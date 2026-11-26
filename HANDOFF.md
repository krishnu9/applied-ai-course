# Hand-off — authentication work

Date: 2026-11-26
Repository: https://github.com/krishnu9/applied-ai-course
Production: https://applied-ai-course.vercel.app

## What this project is

`lastminute.dev` is a 24-lesson written course on AI engineering for interview preparation, built
with Next.js App Router, TypeScript, Tailwind CSS and npm. It originally shipped as a static
export. The course content is complete: 24 live lessons in 10 chapters, ELI5 sections, diagrams,
eight interactive labs, checks, five-step evaluations, and interview corners. Content contracts
live in `docs/content/`.

## Git state at hand-off

- `main` — the last public, working static release. This is what Vercel production builds.
- `auth-supabase` — all authentication work, not yet deployed. It is pushed so another agent can
  continue.

Do not merge `auth-supabase` into `main` until the Supabase setup below is complete. Without the
environment values the login page cannot send email, and merging would gate production behind a
broken sign-in.

## Authentication design (implemented on `auth-supabase`)

- Supabase Auth with email magic links. No passwords.
- Public: `/` landing and `/login`. Private: `/lessons/*`, `/roadmap`, `/about`.
- `proxy.ts` (Next 16's middleware) refreshes the session and redirects anonymous requests to
  `/login?next=…`. Safe `next` handling blocks open redirects.
- `app/(course)/layout.tsx` checks `getUser()` again, so a proxy miss cannot expose a page.
- Protected pages are server-rendered; `output: "export"` is removed. Protected responses send
  `Cache-Control: private, no-store` and `Vary: Cookie`.
- `content/index.ts` is `server-only`; client components import summaries from
  `lib/course-registry.ts` only. Lesson prose must never return to client bundles.
- Progress: local-first, then per-lesson sync to Supabase with an 800 ms debounce, retry banner,
  merge on first sign-in, and local clear on sign-out. Reset removes both copies.
- Tables: `lesson_progress` and `progress_meta`, both with row-level security for
  `auth.uid() = user_id`. No service-role key exists anywhere in the app.

Key files:

- `proxy.ts`, `lib/supabase/{env,client,server,proxy}.ts`, `lib/auth/{redirect,routes}.ts`
- `app/login/page.tsx`, `components/auth/{AuthProvider,LoginForm}.tsx`
- `app/auth/callback/route.ts`, `app/auth/signout/route.ts`
- `app/(course)/layout.tsx`
- `supabase/migrations/20261126120000_progress.sql`
- `lib/progress/{remote,sync,store,storage,context}.ts`
- `components/shell/{AccountMenu,StorageBanner,HeaderProgress}.tsx`
- `lib/course-registry.ts`, `lib/score-summary.ts`

## Blocked on owner setup

The code compiles, but end-to-end auth needs a Supabase project. The owner must:

1. Create a Supabase project named `applied-ai-course` (Free plan).
2. Keep the Email provider enabled (magic links).
3. Authentication → URL Configuration:
   - Site URL: `https://applied-ai-course.vercel.app`
   - Redirect URLs: `http://localhost:3000/auth/callback`,
     `https://applied-ai-course.vercel.app/auth/callback`,
     `https://*-krishnu9s-projects.vercel.app/auth/callback`
4. Project Settings → API: copy **Project URL** and **anon public** key. Never use the
   `service_role` key.
5. Run `supabase/migrations/20261126120000_progress.sql` in the Supabase SQL editor. Confirm both
   tables show RLS enabled.

## Next steps

1. Check out `auth-supabase`.
2. Put the two values in `.env.local` (gitignored):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Add the same names to Vercel for Production, Preview and Development, then redeploy.
4. Test the magic-link flow with a real email.
5. Verify RLS with the anon key: reads return no rows, and a forged `user_id` insert is denied.
6. Verify two browser profiles on one account sync a repair and a proof note.
7. Merge `auth-supabase` into `main` only after these pass. Vercel then deploys the private course.

Commands:

```bash
git checkout auth-supabase
npm install
npm run dev

npm run typecheck
npm run lint
npm run build
COURSE_FINAL=1 CONTENT_VALIDATE=1 npm run build
```

Vercel environment values (run once per scope, value from the owner):

```bash
printf '%s' '<project-url>' | vercel env add NEXT_PUBLIC_SUPABASE_URL production
printf '%s' '<anon-key>' | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

Repeat for `preview` and `development`, then `vercel --prod`.

## Verification checklist

- `curl -I /lessons/retrieval` → 307 to `/login?next=%2Flessons%2Fretrieval`; same for `/roadmap`
  and `/about`; `/` and `/login` → 200.
- `next=/https://evil.com`, `//evil.com`, `/\evil.com` resolve to `/`.
- Magic link arrives, callback sets cookies, lands on the requested lesson; a reused code shows
  the error state.
- Signed-in `/login` redirects to a safe `next`.
- RLS: anon key sees no rows; forged user id denied; two accounts isolated.
- Local progress migrates on first sign-in; backup key is written; a second device restores.
- Sign-out clears local progress, sync index and backup; `/roadmap` redirects.
- Bundle gate: a distinctive lesson sentence is absent from `.next/static/chunks`.
- 390/768/1440: no horizontal scroll, no console errors on the public pages and a lesson.

## Known notes

- Supabase's built-in mailer is rate-limited and can land in spam. Show the retry message; custom
  SMTP is the later fix.
- Preview deployments have separate origins and cookies; the wildcard callback must be
  allowlisted.
- Refreshed cookies must be copied onto proxy redirects, or users are logged out intermittently.
- `docs/content/BOOK-INVENTORY.md` stays unpublished.
- Content facts, copyright audit and coverage verification are in `docs/content/reviews/`.
