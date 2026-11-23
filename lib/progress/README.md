# lib/progress

Reader progress state: one storage key, one store, one provider.

## Invariants

- One live storage key: `lastminute.progress.v2`. A version 1 payload is read once,
  mapped and written to version 2; the version 1 key is left untouched.
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

## Public entry

Import from `@/lib/progress` only: `ProgressProvider`, `useProgress`, `ProgressApi`,
`isRepaired`, `isCheckCorrect`, `canRepair`, `repairedCount`, `resumeTarget`.
