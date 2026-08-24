-- Nunada Academy — database schema
-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- Safe to re-run: everything is guarded with "if not exists" / "or replace".

create extension if not exists citext;

-- ---------------------------------------------------------------- profiles

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    citext not null unique check (username ~ '^[A-Za-z0-9_.]{3,24}$'),
  display_name text not null,
  lang        text not null default 'id' check (lang in ('en', 'id')),
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------ enrollments

create table if not exists public.enrollments (
  user_id     uuid not null references auth.users (id) on delete cascade,
  kind        text not null check (kind in ('course', 'path')),
  ref_id      text not null,
  enrolled_at timestamptz not null default now(),
  primary key (user_id, kind, ref_id)
);

-- --------------------------------------------------------------- progress

create table if not exists public.progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  course_id    text not null,
  item_id      text not null,
  kind         text not null check (kind in ('lesson', 'project')),
  xp           integer not null check (xp >= 0),
  completed_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index if not exists progress_user_course_idx on public.progress (user_id, course_id);

-- -------------------------------------------------------------- xp_events
-- One row per XP award. The weekly leaderboard is a sum over a time window,
-- so nothing ever has to be reset on a schedule.

create table if not exists public.xp_events (
  id         bigserial primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  amount     integer not null check (amount > 0),
  source     text not null,
  created_at timestamptz not null default now()
);

create index if not exists xp_events_user_time_idx on public.xp_events (user_id, created_at desc);
create index if not exists xp_events_time_idx on public.xp_events (created_at desc);

-- ----------------------------------------------------------------- hearts

create table if not exists public.hearts (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  hearts     integer not null default 5 check (hearts between 0 and 5),
  -- Start of the current regeneration clock, not "last modified".
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------- trophies

create table if not exists public.trophies (
  user_id   uuid not null references auth.users (id) on delete cascade,
  trophy_id text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, trophy_id)
);

-- ----------------------------------------------------------- certificates

create table if not exists public.certificates (
  user_id   uuid not null references auth.users (id) on delete cascade,
  kind      text not null check (kind in ('course', 'path')),
  ref_id    text not null,
  serial    text not null unique,
  issued_at timestamptz not null default now(),
  primary key (user_id, kind, ref_id)
);

-- ================================================================ triggers

-- Create the profile + a full set of hearts the moment an auth user appears.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, lang)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Learner'),
    coalesce(new.raw_user_meta_data ->> 'lang', 'id')
  )
  on conflict (id) do nothing;

  insert into public.hearts (user_id, hearts, updated_at)
  values (new.id, 5, now())
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==================================================================== RPCs

-- Called before sign-up so a duplicate name fails before the account exists.
create or replace function public.username_available(p_username text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (select 1 from public.profiles where username = p_username::citext);
$$;

-- Idempotent completion: awards XP only the first time an item is finished.
create or replace function public.complete_item(
  p_course_id text,
  p_item_id   text,
  p_kind      text,
  p_xp        integer
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_inserted integer;
begin
  insert into public.progress (user_id, course_id, item_id, kind, xp)
  values (auth.uid(), p_course_id, p_item_id, p_kind, p_xp)
  on conflict (user_id, item_id) do nothing;

  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then
    return 0;  -- already done, no double XP
  end if;

  insert into public.xp_events (user_id, amount, source)
  values (auth.uid(), p_xp, p_kind || ':' || p_item_id);

  return p_xp;
end;
$$;

-- Hearts regenerate one per 15 minutes. Derived on read instead of by a job.
create or replace function public.resolve_hearts()
returns public.hearts
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_row   public.hearts;
  v_regen integer;
begin
  select * into v_row from public.hearts where user_id = auth.uid();

  if v_row is null then
    insert into public.hearts (user_id) values (auth.uid()) returning * into v_row;
    return v_row;
  end if;

  if v_row.hearts >= 5 then
    return v_row;
  end if;

  v_regen := floor(extract(epoch from (now() - v_row.updated_at)) / 900);
  if v_regen > 0 then
    update public.hearts
       set hearts     = least(5, v_row.hearts + v_regen),
           -- Carry the remainder so progress toward the next heart survives.
           updated_at = case
                          when v_row.hearts + v_regen >= 5 then now()
                          else v_row.updated_at + (v_regen * interval '15 minutes')
                        end
     where user_id = auth.uid()
     returning * into v_row;
  end if;

  return v_row;
end;
$$;

create or replace function public.spend_heart()
returns public.hearts
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_row public.hearts;
begin
  v_row := public.resolve_hearts();

  update public.hearts
     set hearts     = greatest(0, v_row.hearts - 1),
         -- A drop from full starts a fresh 15-minute clock.
         updated_at = case when v_row.hearts >= 5 then now() else v_row.updated_at end
   where user_id = auth.uid()
   returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.issue_certificate(p_kind text, p_ref_id text)
returns public.certificates
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_row public.certificates;
begin
  -- The serial must not be derived from the clock alone: finishing the last item
  -- of a path issues the course and the path certificate in the same millisecond,
  -- and `serial` is unique, so a timestamp-only value collides exactly then.
  insert into public.certificates (user_id, kind, ref_id, serial)
  values (
    auth.uid(),
    p_kind,
    p_ref_id,
    'NA-' || upper(left(p_kind, 1)) || '-' || upper(to_hex((extract(epoch from now()))::bigint))
      || '-' || upper(left(replace(gen_random_uuid()::text, '-', ''), 6))
  )
  on conflict (user_id, kind, ref_id) do nothing;

  select * into v_row from public.certificates
   where user_id = auth.uid() and kind = p_kind and ref_id = p_ref_id;

  return v_row;
end;
$$;

-- ---------------------------------------------------------- leaderboards
-- security definer: everyone may read the aggregate, nobody may read the
-- underlying per-user rows of other learners.
--
-- The weekly window is pinned to UTC rather than left to the session's
-- TimeZone. `date_trunc('week', now())` truncates in whatever zone the
-- session happens to be set to, and src/lib/week.ts computes Monday 00:00
-- UTC — so on any database not set to UTC the two would disagree, and a
-- learner would see one number in their header and another on the board.
-- Spelling out the zone makes them agree by construction instead of by
-- configuration. Both are Monday-based: Postgres weeks are ISO weeks.
--
-- Measured on this project afterwards: TimeZone is UTC, so the two spellings
-- return the same instant and nothing was ever wrong here. This guards against
-- a database that is not UTC, not against an outage that happened.

create or replace function public.leaderboard_weekly(p_limit integer default 50)
returns table (user_id uuid, username text, display_name text, value bigint)
language sql
security definer
set search_path = public
as $$
  select p.id, p.username::text, p.display_name, sum(e.amount)::bigint as value
    from public.xp_events e
    join public.profiles p on p.id = e.user_id
   where e.created_at >= date_trunc('week', now() at time zone 'utc') at time zone 'utc'
   group by p.id, p.username, p.display_name
   order by value desc, p.username asc
   limit p_limit;
$$;

create or replace function public.leaderboard_alltime(p_limit integer default 50)
returns table (user_id uuid, username text, display_name text, value bigint)
language sql
security definer
set search_path = public
as $$
  select p.id, p.username::text, p.display_name, sum(e.amount)::bigint as value
    from public.xp_events e
    join public.profiles p on p.id = e.user_id
   group by p.id, p.username, p.display_name
   order by value desc, p.username asc
   limit p_limit;
$$;

create or replace function public.leaderboard_trophies(p_limit integer default 50)
returns table (user_id uuid, username text, display_name text, value bigint)
language sql
security definer
set search_path = public
as $$
  select p.id, p.username::text, p.display_name, count(t.trophy_id)::bigint as value
    from public.trophies t
    join public.profiles p on p.id = t.user_id
   group by p.id, p.username, p.display_name
   order by value desc, p.username asc
   limit p_limit;
$$;

-- ============================================================ row security

alter table public.profiles     enable row level security;
alter table public.enrollments  enable row level security;
alter table public.progress     enable row level security;
alter table public.xp_events    enable row level security;
alter table public.hearts       enable row level security;
alter table public.trophies     enable row level security;
alter table public.certificates enable row level security;

do $$
begin
  -- profiles: readable by any signed-in user (needed to render names), writable by owner
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_read') then
    create policy profiles_read on public.profiles for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_write') then
    create policy profiles_write on public.profiles for update to authenticated
      using (id = auth.uid()) with check (id = auth.uid());
  end if;
end $$;

-- Owner-only read/write for everything else.
do $$
declare
  tbl text;
begin
  foreach tbl in array array['enrollments', 'progress', 'xp_events', 'hearts', 'trophies', 'certificates']
  loop
    if not exists (select 1 from pg_policies where tablename = tbl and policyname = tbl || '_own_select') then
      execute format(
        'create policy %I on public.%I for select to authenticated using (user_id = auth.uid())',
        tbl || '_own_select', tbl);
    end if;
    if not exists (select 1 from pg_policies where tablename = tbl and policyname = tbl || '_own_insert') then
      execute format(
        'create policy %I on public.%I for insert to authenticated with check (user_id = auth.uid())',
        tbl || '_own_insert', tbl);
    end if;
    if not exists (select 1 from pg_policies where tablename = tbl and policyname = tbl || '_own_update') then
      execute format(
        'create policy %I on public.%I for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())',
        tbl || '_own_update', tbl);
    end if;
  end loop;
end $$;

-- Two separate grants reach a new function in this schema, and both must go:
--   1. Postgres grants EXECUTE to the PUBLIC pseudo-role on creation.
--   2. Supabase sets default privileges on `public` that grant EXECUTE directly
--      to the anon, authenticated and service_role roles.
-- Revoking only from PUBLIC leaves (2) intact, and anon keeps its access — so the
-- anon role has to be named explicitly.
--
-- This matters most for the three leaderboard functions: they are security
-- definer and bypass RLS, so without the revoke anyone holding the publishable
-- key (which ships inside the JS bundle) could list every learner's name and XP
-- without signing in. The `authenticated` role keeps its access through (2), so
-- the grants below are belt-and-braces rather than load-bearing.

revoke execute on function public.username_available(text)                from public, anon;
revoke execute on function public.complete_item(text, text, text, integer) from public, anon;
revoke execute on function public.resolve_hearts()                        from public, anon;
revoke execute on function public.spend_heart()                           from public, anon;
revoke execute on function public.issue_certificate(text, text)           from public, anon;
revoke execute on function public.leaderboard_weekly(integer)             from public, anon;
revoke execute on function public.leaderboard_alltime(integer)            from public, anon;
revoke execute on function public.leaderboard_trophies(integer)           from public, anon;

-- Sign-up has to check a name before the account exists, so anon needs this one.
grant execute on function public.username_available(text)     to anon, authenticated;
grant execute on function public.complete_item(text, text, text, integer) to authenticated;
grant execute on function public.resolve_hearts()             to authenticated;
grant execute on function public.spend_heart()                to authenticated;
grant execute on function public.issue_certificate(text, text) to authenticated;
grant execute on function public.leaderboard_weekly(integer)   to authenticated;
grant execute on function public.leaderboard_alltime(integer)  to authenticated;
grant execute on function public.leaderboard_trophies(integer) to authenticated;

-- ================================================================= teachers
--
-- A teacher sees every learner's standing. That is exactly the read the
-- leaderboards refuse: they return an aggregate, and the rows behind it stay
-- owner-only. So the roster arrives through security-definer functions that
-- check the caller's role first, rather than by loosening row-level security
-- and hoping every future query remembers to filter.

alter table public.profiles
  add column if not exists role text not null default 'learner'
  check (role in ('learner', 'teacher'));

-- Promote somebody by hand, from the SQL editor:
--   update public.profiles set role = 'teacher' where username = 'yourname';
-- The guard below is what stops that statement working from the app.

create or replace function public.is_teacher()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher');
$$;

-- `profiles_write` lets a learner update their own row. Left alone, that now
-- includes `role` — anybody could promote themselves and read the whole
-- cohort. Row-level security cannot express "every column but this one", so
-- the column grant does it: update is revoked wholesale and handed back for
-- the two columns the app actually writes.
--
-- The trigger says the same thing a second time. It is not redundant against
-- today's schema, it is redundant against a future `grant all on all tables`,
-- which is advice common enough to turn up in a Supabase thread one day.

revoke update on public.profiles from anon, authenticated;
grant  update (display_name, lang) on public.profiles to authenticated;

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  -- auth.uid() is null in the SQL editor and under the service role, which is
  -- where a promotion is meant to come from.
  if new.role is distinct from old.role and auth.uid() is not null then
    raise exception 'role is not self-assignable' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_role_guard on public.profiles;
create trigger profiles_role_guard
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- One row per learner. Everybody appears, including somebody who signed up and
-- has finished nothing — those are the rows a teacher most needs to see, and an
-- inner join would drop them.
--
-- XP is summed from xp_events rather than from progress.xp, so this total and
-- the leaderboard's agree by construction rather than by coincidence.
create or replace function public.teacher_roster()
returns table (
  user_id      uuid,
  username     text,
  display_name text,
  role         text,
  created_at   timestamptz,
  xp           bigint,
  lessons      bigint,
  projects     bigint,
  trophies     bigint,
  certificates bigint,
  last_active  timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_teacher() then
    raise exception 'teachers only' using errcode = '42501';
  end if;

  return query
    select p.id, p.username::text, p.display_name, p.role, p.created_at,
           coalesce(x.xp, 0)::bigint,
           coalesce(d.lessons, 0)::bigint,
           coalesce(d.projects, 0)::bigint,
           coalesce(t.trophies, 0)::bigint,
           coalesce(c.certificates, 0)::bigint,
           d.last_done
      from public.profiles p
      left join (select e.user_id, sum(e.amount) as xp
                   from public.xp_events e group by e.user_id) x on x.user_id = p.id
      left join (select g.user_id,
                        count(*) filter (where g.kind = 'lesson')  as lessons,
                        count(*) filter (where g.kind = 'project') as projects,
                        max(g.completed_at)                        as last_done
                   from public.progress g group by g.user_id) d on d.user_id = p.id
      left join (select r.user_id, count(*) as trophies
                   from public.trophies r group by r.user_id) t on t.user_id = p.id
      left join (select f.user_id, count(*) as certificates
                   from public.certificates f group by f.user_id) c on c.user_id = p.id
     order by coalesce(x.xp, 0) desc, p.username asc;
end;
$$;

-- Counts per learner per course, and nothing else. How many items a course
-- holds is a property of the curriculum in src/content, not of this database,
-- so the denominator stays in the app — which already carries it for every
-- course card. Returning raw counts is what keeps that number in one place.
create or replace function public.teacher_course_progress()
returns table (
  user_id      uuid,
  course_id    text,
  lessons      bigint,
  projects     bigint,
  last_touched timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_teacher() then
    raise exception 'teachers only' using errcode = '42501';
  end if;

  return query
    select g.user_id, g.course_id,
           count(*) filter (where g.kind = 'lesson')::bigint,
           count(*) filter (where g.kind = 'project')::bigint,
           max(g.completed_at)
      from public.progress g
     group by g.user_id, g.course_id;
end;
$$;

revoke execute on function public.is_teacher()               from public, anon;
revoke execute on function public.teacher_roster()           from public, anon;
revoke execute on function public.teacher_course_progress()  from public, anon;

grant execute on function public.is_teacher()              to authenticated;
grant execute on function public.teacher_roster()          to authenticated;
grant execute on function public.teacher_course_progress() to authenticated;
