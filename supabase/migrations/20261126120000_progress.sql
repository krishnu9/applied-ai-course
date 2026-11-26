-- Progress storage for lastminute.dev
-- One row per lesson per user, plus one meta row per user.
-- Row-level security is the only authorization boundary. No service-role key is used.

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_slug text not null,
  status text not null default 'in-progress'
    check (status in ('in-progress', 'repaired')),
  check_answers jsonb not null default '{}'::jsonb,
  task_ticks text[] not null default '{}',
  proof_note text not null default '',
  repaired_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_slug),
  constraint lesson_slug_format check (lesson_slug ~ '^[a-z][a-z0-9-]{0,40}$'),
  constraint proof_note_length check (char_length(proof_note) <= 280)
);

create table if not exists public.progress_meta (
  user_id uuid primary key references auth.users (id) on delete cascade,
  last_lesson_slug text,
  last_section_id text,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lesson_progress_touch on public.lesson_progress;
create trigger lesson_progress_touch
before update on public.lesson_progress
for each row execute function public.touch_updated_at();

drop trigger if exists progress_meta_touch on public.progress_meta;
create trigger progress_meta_touch
before update on public.progress_meta
for each row execute function public.touch_updated_at();

alter table public.lesson_progress enable row level security;
alter table public.progress_meta enable row level security;

drop policy if exists "own lessons select" on public.lesson_progress;
create policy "own lessons select" on public.lesson_progress
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "own lessons insert" on public.lesson_progress;
create policy "own lessons insert" on public.lesson_progress
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "own lessons update" on public.lesson_progress;
create policy "own lessons update" on public.lesson_progress
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "own lessons delete" on public.lesson_progress;
create policy "own lessons delete" on public.lesson_progress
for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "own meta select" on public.progress_meta;
create policy "own meta select" on public.progress_meta
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "own meta insert" on public.progress_meta;
create policy "own meta insert" on public.progress_meta
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "own meta update" on public.progress_meta;
create policy "own meta update" on public.progress_meta
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "own meta delete" on public.progress_meta;
create policy "own meta delete" on public.progress_meta
for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.lesson_progress, public.progress_meta from anon;
grant select, insert, update, delete
  on public.lesson_progress, public.progress_meta
  to authenticated;
