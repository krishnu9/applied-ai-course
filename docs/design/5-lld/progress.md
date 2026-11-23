# Stage 5 — Low-level design: `progress`

The progress module is the only seam between the reader and the browser. It stores reader state,
survives reload, and fails without breaking a route. Sources: `4-hld.md` sections 3, 5, 7 and 10;
PRD US-13 to US-17 and US-15.

## 1. Files and boundaries

| File | Owns |
| --- | --- |
| `store.ts` | Immutable snapshot store; every state transition |
| `storage.ts` | Guarded localStorage adapter; `available` flag; validation |
| `context.tsx` | `ProgressProvider` and `useProgress`; hydration trigger |
| `selectors.ts` | Pure reads; completion gate; correctness lookup |
| `index.ts` | The only public entry |

The module imports `lib/types.ts` only. It must not import `content`; the gate receives a `Lesson`
from the caller. Only `storage.ts` calls `localStorage`. Other modules import `@/lib/progress`.

## 2. Snapshot and invariants

`ProgressState` comes from `lib/types.ts` (HLD section 5).

```ts
export type StorageStatus = 'ok' | 'unavailable';
export type ProgressSnapshot = Readonly<{
  state: ProgressState; ready: boolean; storage: StorageStatus;
}>;
```

- Lesson keys are `LessonSlug` values. Each lesson holds 0–3 answers, 0–5 ticks and a note of 280
  characters or fewer.
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

`available` is one module-level flag for the page session. The first access sets it. A `false` value
stops every later storage call. The snapshot field `storage` is its visible form.

```ts
export function readProgress(): { state: ProgressState; status: StorageStatus };
export function writeProgress(state: ProgressState): StorageStatus;
export function resetProgress(): void;
export function subscribeToStorage(onChange: () => void): () => void;
export function isLessonSlug(value: unknown): value is LessonSlug;
```

`readProgress` returns a state and a status. `writeProgress` returns the status after the attempt.
`resetProgress` removes the key. `subscribeToStorage` returns an unsubscribe function. No function
throws to its caller.

Exact try/catch behaviour:

- `getStorage()` returns `null` on the server and when `available === false`; it changes no flag.
- A throwing `window.localStorage` access or `getItem` sets `available = false`.
- A parse failure returns the empty state with status `ok`. The key stays; the next write replaces
  it. No banner shows.
- A throwing `setItem` (quota) sets `available = false` and returns `unavailable`; memory state
  stays. A payload over 8192 bytes also returns `unavailable`.
- A throwing `removeItem` sets `available = false`.

`normalise(value)` runs these steps in a guarded body:

1. Reject a non-plain object or `version !== 1`.
2. Keep lesson keys that pass `isLessonSlug`; drop a non-object value.
3. Per entry: `status` is `repaired` only for the exact string.
4. Answers keep ids that pass `ID_PATTERN`, up to 3. Ticks keep the five tokens, deduplicated, in
   `TICK_IDS` order.
5. `proofNote` is a string, stripped of control characters except `\n`, cut to 280.
6. `repairedAt` is a valid ISO string or `null`.
7. `lastLessonSlug` is a slug or `null`. `lastSectionId` passes `ID_PATTERN` or is `null`.
   `updatedAt` is a valid ISO string or a fixed epoch.

Duplicate ticks and unknown slugs drop out. Unknown check id means a broken `ID_PATTERN` or a
fourth distinct id. Membership in a lesson's check list lives in `content`, so the module cannot
test it. The cap of 3 and exact-id matching keep a stray id inert.

## 4. `store.ts`

```ts
export const EMPTY_SNAPSHOT: ProgressSnapshot = Object.freeze({
  state: createEmptyState(), ready: false, storage: 'ok',
});
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

The store holds one `snapshot` variable and one listener set. `getSnapshot` returns it; `subscribe`
returns a remover. A change builds one new snapshot and calls each listener once. Frozen
`EMPTY_SNAPSHOT` keeps one identity for the server and the first client render.

- `now()` runs inside actions only.
- An accepted action creates a new state and snapshot, writes once and notifies once.
- A rejected or identical action returns the same snapshot and does nothing.
- A slug change clears `lastSectionId`. A repaired entry never downgrades.
- Actions are ignored while `ready` is false.
- Helpers copy the touched entry; untouched entries keep identity.

| Action | Drop when | Transition |
| --- | --- | --- |
| `repair(slug)` | slug invalid; no entry; entry repaired | `status = repaired`; timestamps now; `lastLessonSlug = slug`; section cleared on a slug change |
| `setCheck(slug, checkId, optionId)` | an id fails `ID_PATTERN`; fourth distinct check; same option | Store `{ selectedOptionId }`; status `in-progress` unless repaired |
| `toggleTask(slug, itemId)` | item not in `TICK_IDS` | Toggle the token; canonical order; status `in-progress` unless repaired |
| `setProof(slug, text)` | text equal after truncation | Normalise and cut to 280; empty text clears the note |
| `setPosition(slug, sectionId)` | slug or section id invalid | Upsert as `in-progress` when absent; set both position fields |
| `reset()` | never | State becomes empty; call `resetProgress()`; keep `ready` and storage status |

Every action drops when `ready` is false. `repair` enforces only structure. `RepairButton` calls
`canRepair` first.

`hydrate()` runs once: guard on `hydrated`; read; publish `{ state, ready: true, storage }`; install
the storage listener; notify once. A second call does nothing, so StrictMode is safe.

## 5. `context.tsx`

```tsx
'use client';
export function ProgressProvider({ children }: { children: ReactNode }) {
  const ref = useRef<ProgressStore | null>(null);
  ref.current ??= createStore(EMPTY_SNAPSHOT);
  const store = ref.current;
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
  useEffect(() => { store.hydrate(); }, [store]);
  // value = snapshot state, ready, storage plus the six store actions, via useMemo
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
function getServerSnapshot(): ProgressSnapshot { return EMPTY_SNAPSHOT; }
export function useProgress(): ProgressApi {
  const value = useContext(ProgressContext);
  if (value === null) throw new Error('useProgress must be used inside ProgressProvider.');
  return value;
}
```

- `getServerSnapshot` is stable, so the server and first client trees share one object.
- `hydrate` runs in `useEffect`; render reads no storage.
- The provider takes `children` only and mounts once in `app/layout.tsx`.
- Outside the provider, `useProgress` throws; there is no silent no-op.
- `ProgressApi` is the HLD section 3 type.

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

- All five are pure, clock-free and safe on the empty state.
- `isRepaired` tests `status === 'repaired'`.
- `isCheckCorrect` returns false for an absent check. Otherwise it compares `selectedOptionId` with
  `check.correctOptionId`, never a stored flag.
- `canRepair` requires every check correct, a 5-item task with all five `TICK_IDS`, and a non-empty
  note. It answers the gate only; the button checks `isRepaired` first.
- `repairedCount` counts `repaired` entries. `resumeTarget` is `null` without `lastLessonSlug`,
  else `{ slug, sectionId }`.
- Cost is O(1), except `canRepair` at O(checks + 5). Every call is safe in render.

## 7. Hydration story

1. Server: `getServerSnapshot` returns `EMPTY_SNAPSHOT`; HTML shows 0 of 6, baseline scores, no
   resume.
2. The first client render uses the same object, so the HTML matches; there is no mismatch.
3. `useEffect` calls `hydrate()`. The store publishes `ready: true`, and React re-renders with saved
   data.
4. Empty or blocked storage keeps 0; blocked storage also shows the banner.
5. No time or random value enters render; `ready` gates storage-dependent branches.

`hydrate` installs one guarded `storage` listener for `STORAGE_KEY` or `key: null`. It re-reads and
publishes on a difference. The writing tab gets no event. A missing `addEventListener` yields a
no-op. Last write wins; no conflict UI exists.

## 8. Consumers

| Module | Components | Reads and calls | Must never |
| --- | --- | --- | --- |
| lesson | `CheckBlock`, `TaskChecklist`, `ProveNote`, `RepairButton`, `LessonPosition` | `isCheckCorrect`, ticks, `proofNote`, `canRepair`, `isRepaired`; `setCheck`, `toggleTask`, `setProof`, `repair`, `setPosition` | call storage; write in render |
| shell | `HeaderProgress`, `Spine`, `StorageBanner`, `ResetProgress` | `repairedCount`, `isRepaired`, `ready`, `storage`; `reset` | invent a count; hide the banner |
| home | `RunPanel`, `HomeAction`, `LessonLedger` | `repairedCount`, `resumeTarget`, `isRepaired` | compute progress from content |
| roadmap | `RoadmapTable`, `RoadmapAction` | `isRepaired`, `repairedCount`, `resumeTarget` | sort by its own state |

Consumers must never call `localStorage`, hold a private store, or call `createStore`. They must
import from `@/lib/progress` only and must not write during render. Before `ready`, they must read
`ready`, not `state`; the count selectors return the empty answer.

## 9. Build units

These units map to U2 in HLD section 9. Only U2 may touch the marked provider mount line.

| Unit | Files | Depends on | Checkable done line |
| --- | --- | --- | --- |
| PU-1 Storage adapter | `storage.ts` | `lib/types.ts` | `localStorage` appears in one file. Blocked storage returns empty and `unavailable` with no exception. Corrupt JSON and `version: 2` return empty with status `ok`. An unknown slug and a duplicate tick drop out. A 400-character note returns 280. A failed write keeps memory state. |
| PU-2 Store and selectors | `store.ts`, `selectors.ts` | PU-1 | `getSnapshot()` is stable. `toggleTask` changes it once. `canRepair` is false for one wrong check, 4 ticks or a blank note; true for all correct, 5 ticks and a note. `isCheckCorrect` follows `correctOptionId`. `repairedCount` is 0 empty, 6 after six repairs. |
| PU-3 Context and mount | `context.tsx`, `index.ts`, the mount line | PU-2 | `npm run build` passes. `out/index.html` contains "0 of 6 layers repaired". Saved progress moves 0 to N after mount with no hydration warning. A page without the provider throws the exact message. |

## 10. Failure matrix

| Failure | Adapter result | Snapshot | UI |
| --- | --- | --- | --- |
| Storage blocked | `available = false`; empty state | `ready: true`, `unavailable` | Banner "Progress cannot be saved in this browser. You can still read every lesson." Session state works. |
| Quota full | `available = false`; memory keeps the new state | `unavailable` | The action stays visible. Banner shows. No key is written. |
| Corrupt JSON | Empty state; key untouched | `ok` | 0 of 6, baseline scores, no banner. Next write replaces the key. |
| Version mismatch | Empty state | `ok` | 0 of 6, no banner. Next write stores version 1. |
| Unknown slug | Slug dropped; `lastLessonSlug` becomes `null` if it matched | normalised | Count and spine ignore it. No banner. |
| Cleared in another tab | `key: null`; re-read | empty | Count to 0, scores to baseline, resume link gone. |
| Proof over 280 | Cut to 280 at write and read | normalised | The field shows 280 characters. No error. |

## 11. Risks and constraints

- **8 KB cap.** Six lessons with 3 answers, 5 ticks and a 280-character note stay near 4 KB. A new
  field needs a new bound. `writeProgress` refuses a payload over 8192 bytes.
- **No timestamps in render.** `updatedAt` and `repairedAt` are compare values only. No component
  formats them.
- **No hydration mismatch.** The server snapshot is frozen and shared. Reads happen only in
  `useEffect`. No render branch tests `typeof window`.
- **One write per change.** Each action writes once. Proof waits for the 800 ms debounce. Position
  writes only on a section change. No probe write occurs at startup.
- **Snapshot identity.** A rejected action must return the old object. A new object on every action
  causes a render loop.
- **Sticky quota failure.** One throw stops all storage calls. A reload reads the last good key.
- **Cross-tab conflict.** Last write wins. A note edited in two tabs loses one edit.
- **Version 1 only.** A format change needs a version bump and a migration branch.
