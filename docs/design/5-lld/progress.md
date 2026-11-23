# Stage 5 — Low-level design: `progress`

The progress module is the only seam between the reader and the browser. It stores reader state,
survives reload, and fails without breaking a route. Sources: `4-hld.md` sections 3, 5, 7 and 10;
PRD US-13 to US-17 and US-15.

## 1. Files and boundaries

| File | Owns |
| --- | --- |
| `lib/progress/store.ts` | Snapshot store; state transitions |
| `lib/progress/storage.ts` | Guarded adapter; `available` flag; validation |
| `lib/progress/context.tsx` | `ProgressProvider` and `useProgress`; hydration |
| `lib/progress/selectors.ts` | Pure reads; completion gate; correctness lookup |
| `lib/progress/index.ts` | Public entry |

The module imports `lib/types.ts` only, never `content`; the gate receives a `Lesson`. Only
`storage.ts` calls `localStorage`.

## 2. Snapshot and invariants

`ProgressState` comes from `lib/types.ts` (HLD section 5).

```ts
export type StorageStatus = 'ok' | 'unavailable';
export type ProgressSnapshot = Readonly<{ state: ProgressState; ready: boolean; storage: StorageStatus }>;
```

- Each `LessonSlug` key holds 0–3 answers, 0–5 ticks and a note of 280 characters or fewer.
- `selectedOptionId` is the only stored answer field. Correctness is never stored.
- State objects are replaced, never mutated. Render reads no storage and no clock.

## 3. `storage.ts`

```ts
export const STORAGE_KEY = 'lastminute.progress.v1';
export const MAX_PROOF = 280;
export const MAX_BYTES = 8192;
export const ID_PATTERN = /^[a-z][a-z0-9-]{0,40}$/;
export const TICK_IDS = ['item-1', 'item-2', 'item-3', 'item-4', 'item-5'] as const;
let available: boolean | null = null; // null = not tested, true = usable, false = stop
```

`available` is the single session flag. The first access sets it; `false` stops later storage calls.
The snapshot field `storage` shows it.

```ts
export function readProgress(): { state: ProgressState; status: StorageStatus };
export function writeProgress(state: ProgressState): StorageStatus;
export function resetProgress(): void;
export function subscribeToStorage(onChange: () => void): () => void;
export function isLessonSlug(value: unknown): value is LessonSlug;
```

`readProgress` returns state and status; `writeProgress` returns the new status; `resetProgress`
removes the key; `subscribeToStorage` returns an unsubscribe function. Nothing throws.

Exact try/catch behaviour:

- `getStorage()` returns `null` on the server and when `available === false`, and changes no flag.
  A throwing `window.localStorage` access or `getItem` sets `available = false`.
- A parse failure returns the empty state with status `ok`; the key stays and the next write
  replaces it. No banner.
- A throwing `setItem` (quota) sets `available = false` and returns `unavailable`; memory stays. A
  payload over 8192 bytes also returns `unavailable`.
- A throwing `removeItem` sets `available = false`.

`normalise(value)` runs these steps in a guarded body:

1. Reject a non-plain object or `version !== 1` with the empty state.
2. Keep lesson keys that pass `isLessonSlug`; drop a non-object value.
3. Per entry: `status` is `repaired` only for the exact string.
4. Answers keep ids that pass `ID_PATTERN`, up to 3. Ticks keep the five tokens, deduplicated, in
   `TICK_IDS` order.
5. `proofNote` is a string, stripped of control characters except `\n`, cut to 280.
6. `repairedAt` is a valid ISO string or `null`.
7. `lastLessonSlug` is a slug or `null`. `lastSectionId` passes `ID_PATTERN` or is `null`.
   `updatedAt` is a valid ISO string or a fixed epoch.

Duplicate ticks and unknown slugs drop out. Unknown check id means a broken `ID_PATTERN` or a
fourth distinct id. Membership lives in `content`; the cap of 3 and exact-id matching keep a stray
id inert.

## 4. `store.ts`

```ts
export type ProgressStore = {
  getSnapshot(): ProgressSnapshot;
  subscribe(listener: () => void): () => void;
  hydrate(): void;
  repair(slug: LessonSlug): void;
  setCheck(slug: LessonSlug, checkId: string, selectedOptionId: string): void;
  toggleTask(slug: LessonSlug, itemId: string): void;
  setProof(slug: LessonSlug, text: string): void;
  setPosition(slug: LessonSlug, sectionId: string): void;
  reset(): void;
};
export function createStore(initial: ProgressSnapshot): ProgressStore;
```

`createStore(EMPTY_SNAPSHOT)` starts the app; the snapshot is frozen. The store holds one `snapshot`
and one listener set. `getSnapshot` returns it; `subscribe` returns a remover. A change builds one
snapshot and notifies once. The empty state keeps one identity for both first renders.

- `now()` runs inside actions only.
- An accepted action creates a new snapshot, writes once and notifies once.
- A rejected or identical action returns the same snapshot and does nothing.
- A slug change clears `lastSectionId`. A repaired entry never downgrades.
- Helpers copy the touched entry; untouched entries keep identity.

| Action | Drop when | Transition |
| --- | --- | --- |
| `repair(slug)` | slug invalid; no entry; entry repaired | `status = repaired`; timestamps now; `lastLessonSlug = slug`; clear the section |
| `setCheck(slug, checkId, optionId)` | an id fails `ID_PATTERN`; fourth distinct check; same option | Store `{ selectedOptionId }`; status `in-progress` unless repaired |
| `toggleTask(slug, itemId)` | item not in `TICK_IDS` | Toggle the token; canonical order; status `in-progress` unless repaired |
| `setProof(slug, text)` | text equal after truncation | Normalise and cut to 280; empty text clears the note |
| `setPosition(slug, sectionId)` | slug or section id invalid | Upsert as `in-progress` when absent; set both position fields |
| `reset()` | never | State becomes empty; call `resetProgress()`; keep `ready` and storage status |

Every action drops when `ready` is false. `repair` checks structure only; `RepairButton` calls
`canRepair` first.

`hydrate()` runs once: guard, read, publish `{ state, ready: true, storage }`, install the listener,
notify. A second call does nothing, so StrictMode is safe.

## 5. `context.tsx`

```tsx
'use client';
const ProgressContext = createContext<ProgressApi | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createStore(EMPTY_SNAPSHOT));
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
  useEffect(() => { store.hydrate(); }, [store]);
  const value = useMemo<ProgressApi>(() => ({
    state: snapshot.state, ready: snapshot.ready, storage: snapshot.storage,
    repair: store.repair, setCheck: store.setCheck, toggleTask: store.toggleTask,
    setProof: store.setProof, setPosition: store.setPosition, reset: store.reset,
  }), [snapshot, store]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
function getServerSnapshot(): ProgressSnapshot { return EMPTY_SNAPSHOT; }
export function useProgress(): ProgressApi {
  const value = useContext(ProgressContext);
  if (value === null) throw new Error('useProgress must be used inside ProgressProvider.');
  return value;
}
```

- `getServerSnapshot` is stable; both first trees share one object. `hydrate` runs in `useEffect`;
  render reads no storage.
- It takes `children` only and mounts in `app/layout.tsx`.
- Outside the provider, `useProgress` throws; no silent no-op.

## 6. `selectors.ts`

```ts
export function isRepaired(progress: ProgressState, slug: LessonSlug): boolean;
export function isCheckCorrect(lesson: Lesson, progress: ProgressState, checkId: string): boolean;
export function canRepair(lesson: Lesson, progress: ProgressState): boolean;
export function repairedCount(progress: ProgressState): number;
export function resumeTarget(
  progress: ProgressState,
): { slug: LessonSlug; sectionId: string | null } | null;
```

- All five are pure and safe in render; cost is O(1) except `canRepair`.
- `isRepaired` tests `status === 'repaired'`.
- `isCheckCorrect` returns false for an absent check; otherwise it compares `selectedOptionId` with
  `check.correctOptionId`.
- `canRepair` requires every check correct, five ticks and a non-empty note. The button checks
  `isRepaired`.
- `repairedCount` counts `repaired` entries. `resumeTarget` is `null` without `lastLessonSlug`,
  else `{ slug, sectionId }`.

## 7. Hydration story

1. Server: `getServerSnapshot` returns `EMPTY_SNAPSHOT`; HTML shows 0 of 6, baseline scores, no
   resume.
2. The first client render uses the same object, so the HTML matches; no mismatch.
3. `useEffect` calls `hydrate()`; React re-renders with saved data.
4. Empty or blocked storage keeps 0; blocked storage also shows the banner. No time or random value
   enters render; `ready` gates storage-dependent branches.

`hydrate` installs one guarded `storage` listener for `STORAGE_KEY` or `key: null`. It re-reads and
publishes on a difference. A missing `addEventListener` yields a no-op; last write wins, with no
conflict UI.

## 8. Consumers

| Module | Components | Reads and calls | Must never |
| --- | --- | --- | --- |
| lesson | `CheckBlock`, `TaskChecklist`, `ProveNote`, `RepairButton`, `LessonPosition` | `isCheckCorrect`, ticks, `proofNote`, `canRepair`, `isRepaired`; `setCheck`, `toggleTask`, `setProof`, `repair`, `setPosition` | call storage; write in render |
| shell | `HeaderProgress`, `Spine`, `StorageBanner`, `ResetProgress` | `repairedCount`, `isRepaired`, `ready`, `storage`; `reset` | hide the banner |
| home | `RunPanel`, `HomeAction`, `LessonLedger` | `repairedCount`, `resumeTarget`, `isRepaired` | invent progress |
| roadmap | `RoadmapTable`, `RoadmapAction` | `isRepaired`, `repairedCount`, `resumeTarget` | sort by its own state |

Consumers never call `localStorage` or hold a private store. They import `@/lib/progress` only
and never write in render. Before `ready`, they read `ready`, not `state`.

## 9. Build units

These units map to U2, which alone touches the marked mount line.

| Unit | Files | Depends on | Checkable done line |
| --- | --- | --- | --- |
| PU-1 Storage adapter | `storage.ts` | `lib/types.ts` | `localStorage` is in one file. Blocked storage returns empty and `unavailable`, no exception. Corrupt JSON and `version: 2` return empty with `ok`. Unknown slugs and duplicate ticks drop out. A 400-character note returns 280. A failed write keeps memory. |
| PU-2 Store and selectors | `store.ts`, `selectors.ts` | PU-1 | `getSnapshot()` is stable and `toggleTask` changes it once. `canRepair` is false for a wrong check, 4 ticks or a blank note. `isCheckCorrect` follows `correctOptionId`. `repairedCount` is 0 empty, 6 after repairs. |
| PU-3 Context and mount | `context.tsx`, `index.ts`, the mount line | PU-2 | `npm run build` passes. `out/index.html` contains "0 of 6 layers repaired". Saved progress moves 0 to N without a hydration warning. A page without the provider throws the exact message. |

## 10. Failure matrix

| Failure | Adapter result | Snapshot | UI |
| --- | --- | --- | --- |
| Storage blocked | `available = false`; empty state | `ready: true`, `unavailable` | Banner "Progress cannot be saved in this browser. You can still read every lesson." Session state works. |
| Quota full | `available = false`; memory keeps the new state | `unavailable` | The action stays visible; no key is written. |
| Corrupt JSON | Empty state; key untouched | `ok` | 0 of 6, baseline scores, no banner. Next write replaces the key. |
| Version mismatch | Empty state | `ok` | 0 of 6, no banner. Next write stores version 1. |
| Unknown slug | Slug dropped; `lastLessonSlug` becomes `null` | normalised | Count and spine ignore it. No banner. |
| Cleared in another tab | `key: null`; re-read | empty | Count to 0, scores to baseline, resume link gone. |
| Proof over 280 | Cut to 280 at write and read | normalised | The field shows 280 characters; no error. |

## 11. Risks and constraints

- **8 KB cap.** Six full lessons stay near 4 KB. A new field needs a new bound.
- **No timestamps in render.** `updatedAt` and `repairedAt` are compare values only. No component
  formats them.
- **No hydration mismatch.** The server snapshot is frozen and shared. Reads happen only in
  `useEffect`. No render branch tests `typeof window`.
- **One write per change.** Each action writes once. Proof waits for the 800 ms debounce. Position
  writes only on a section change; no probe write occurs.
