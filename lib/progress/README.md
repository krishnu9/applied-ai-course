# lib/progress

Reader progress state: local-first storage, one provider and optional account sync.

## Invariants

- One live state key: `lastminute.progress.v2`. A version 1 payload is read once,
  mapped and written to version 2; the version 1 key is left untouched.
- Two side keys hold no progress state: `lastminute.progress.backup` (the pre-merge
  safety copy) and `lastminute.progress.sync-index` (slug -> last local write time).
- Only `lib/progress/storage.ts` touches browser storage. No component or route reads it.
- The server and the first client render use the frozen `EMPTY_SNAPSHOT` (`ready: false`).
  Storage is read after mount, in `useEffect`, so no hydration mismatch occurs.
- Every accepted action writes once. A dropped or identical action writes nothing and keeps
  the same snapshot reference.
- Actions are ignored before `hydrate()` publishes `ready: true`.
- A repaired lesson never downgrades. A slug change clears `lastSectionId`.
- Correctness is never stored: `selectedOptionId` is compared with `correctOptionId` in a selector.
- The storage adapter never throws. The first failure sets one module-level `available = false`
  flag, which stops all later storage calls for the session.
- Corrupt JSON and a version mismatch return the empty state with status `ok` and no banner.
- The payload cap is 65536 bytes. The proof note cap is 280 characters. The check-answer
  cap is 6 per lesson.

## Account sync

- `remote.ts` is the only Supabase progress adapter. It returns typed results and never throws.
- `sync.ts` is pure: it merges local and remote state and returns the uploads it needs.
  Repaired wins, ticks union, checks and notes last-write-wins by the sync index against the
  row `updated_at`, position follows the newer `updatedAt`.
- `store.ts` keeps writes local first, then debounces one remote upsert per lesson and the meta
  row (800 ms), flushes on `pagehide`, and keeps the queue when an upload fails.
- Sync state is `local | loading | synced | error`. A signed-out reader stays on `local`.
- `attachUser` backs up local state, fetches, merges, publishes and uploads. `detachUser` keeps
  the local cache. `clearLocal` wipes the account footprint (the sign-out UI calls it).
- `reset` deletes remote rows when signed in, then writes an empty v2 state.

## Public entry

Import from `@/lib/progress` only: `ProgressProvider`, `useProgress`, `ProgressApi`,
`isRepaired`, `isCheckCorrect`, `canRepair`, `repairedCount`, `resumeTarget`.
The hook also exposes `sync`, `user`, `retrySync` and `clearLocal`.
