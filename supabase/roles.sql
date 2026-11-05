-- Nunada Academy — roles, teacher approval and classes
-- Run this once in the Supabase SQL editor, AFTER schema.sql and public-profile.sql.
-- Safe to re-run: everything is guarded with "if not exists" / "or replace".
--
-- Three kinds of account:
--
--   learner  a student. Belongs to one teacher, chosen when the learner first takes a course (the teacher's
--            username, optional); with none given, the learner belongs to the Nunada admin.
--   teacher  signs up as a teacher, but cannot see anybody until an admin approves the account
--            (approval = 'pending' -> 'approved', or 'rejected'). Sees only the progress of their own students.
--   admin    approves teachers and sees every class. Never created from the app: the last statement of this file
--            promotes the account named "nunada", and any other admin is made the same way, by hand.
--
-- The rules live here and not in the app. Every read of somebody else's progress goes through a function that checks
-- the caller's role first, and the columns that decide who may see what (role, approval, teacher_id) cannot be written
-- from the app at all.

-- ------------------------------------------------------------------ columns

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('learner', 'teacher', 'admin'));

-- Existing teachers stay approved: the default is 'approved', and only a new teacher sign-up starts 'pending'.
alter table public.profiles add column if not exists approval text not null default 'approved';
alter table public.profiles drop constraint if exists profiles_approval_check;
alter table public.profiles
  add constraint profiles_approval_check check (approval in ('pending', 'approved', 'rejected'));

-- The teacher (or admin) a learner studies with. Null means "not chosen yet", which is read as the default admin.
alter table public.profiles add column if not exists teacher_id uuid references public.profiles (id) on delete set null;
create index if not exists profiles_teacher_idx on public.profiles (teacher_id);

-- ------------------------------------------------------------ the guard
--
-- The column grant in schema.sql already lets the app write only username, display_name and lang. This is the second
-- lock, for the day somebody runs a blanket `grant all`: `role` can never be changed from the app, and `approval` and
-- `teacher_id` only by the functions below, which say so with a transaction-local setting that no client can set (it
-- is not a function PostgREST exposes).

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  -- auth.uid() is null in the SQL editor and under the service role, which is where a promotion is meant to come from.
  if auth.uid() is not null then
    if new.role is distinct from old.role then
      raise exception 'role is not self-assignable' using errcode = '42501';
    end if;
    if current_setting('nunada.profile_admin', true) is distinct from 'on' then
      if new.approval is distinct from old.approval then
        raise exception 'approval is not self-assignable' using errcode = '42501';
      end if;
      if new.teacher_id is distinct from old.teacher_id then
        raise exception 'the teacher is chosen with set_my_teacher' using errcode = '42501';
      end if;
    end if;
  end if;
  return new;
end;
$$;

-- ------------------------------------------------------------ sign-up
--
-- A teacher sign-up carries role = 'teacher' in its metadata and starts 'pending'. Anything else, including a
-- sign-up that asks for 'admin', is a learner: the metadata is written by the browser, so it is never trusted
-- further than that.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := case when new.raw_user_meta_data ->> 'role' = 'teacher' then 'teacher' else 'learner' end;
begin
  insert into public.profiles (id, username, display_name, lang, role, approval)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Learner'),
    coalesce(new.raw_user_meta_data ->> 'lang', 'id'),
    v_role,
    case when v_role = 'teacher' then 'pending' else 'approved' end
  )
  on conflict (id) do nothing;

  insert into public.hearts (user_id, hearts, updated_at)
  values (new.id, 5, now())
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- ------------------------------------------------------------ who is who

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- An approved teacher. A teacher who is still pending, or was turned down, is not one.
create or replace function public.is_teacher()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher' and p.approval = 'approved');
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.is_admin() or public.is_teacher();
$$;

-- The admin a learner belongs to when they name nobody: the account called "nunada", or else the oldest admin.
create or replace function public.default_teacher_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select p.id from public.profiles p where p.role = 'admin' order by (p.username = 'nunada') desc, p.created_at asc limit 1;
$$;

-- ----------------------------------------------------------- joining a class

-- The calling learner's teacher: the one they chose, or the default admin. No row for a teacher or an admin.
create or replace function public.my_teacher()
returns table (id uuid, username text, display_name text, role text)
language sql
security definer
stable
set search_path = public
as $$
  select t.id, t.username::text, t.display_name, t.role
    from public.profiles me
    join public.profiles t on t.id = coalesce(me.teacher_id, public.default_teacher_id())
   where me.id = auth.uid() and me.role = 'learner';
$$;

-- Joins the class of the teacher with this username. Blank means the default admin. Only an approved teacher or an
-- admin can be named; anything else is "teacher not found", the same answer for a name that does not exist and for a
-- teacher who has not been approved, so the message does not tell a stranger who has applied.
create or replace function public.set_my_teacher(p_username text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name   text := nullif(btrim(coalesce(p_username, '')), '');
  v_target uuid;
begin
  if not exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'learner') then
    raise exception 'learners only' using errcode = '42501';
  end if;

  if v_name is null then
    v_target := public.default_teacher_id();
  else
    select t.id into v_target
      from public.profiles t
     where t.username = v_name::citext
       and (t.role = 'admin' or (t.role = 'teacher' and t.approval = 'approved'));
  end if;

  if v_target is null then
    raise exception 'teacher not found' using errcode = 'P0002';
  end if;

  perform set_config('nunada.profile_admin', 'on', true);
  update public.profiles set teacher_id = v_target where id = auth.uid();
  perform set_config('nunada.profile_admin', 'off', true);
end;
$$;

-- ---------------------------------------------------------- approving teachers

create or replace function public.admin_teachers()
returns table (
  user_id      uuid,
  username     text,
  display_name text,
  approval     text,
  created_at   timestamptz,
  students     bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admins only' using errcode = '42501';
  end if;

  return query
    select p.id, p.username::text, p.display_name, p.approval, p.created_at,
           (select count(*) from public.profiles s where s.teacher_id = p.id and s.role = 'learner')::bigint
      from public.profiles p
     where p.role = 'teacher'
     order by (p.approval = 'pending') desc, p.created_at desc;
end;
$$;

create or replace function public.set_teacher_approval(p_user uuid, p_approval text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admins only' using errcode = '42501';
  end if;
  if p_approval not in ('pending', 'approved', 'rejected') then
    raise exception 'unknown approval' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles t where t.id = p_user and t.role = 'teacher') then
    raise exception 'not a teacher account' using errcode = 'P0002';
  end if;

  perform set_config('nunada.profile_admin', 'on', true);
  update public.profiles set approval = p_approval where id = p_user;
  perform set_config('nunada.profile_admin', 'off', true);
end;
$$;

-- ------------------------------------------------------------ what staff see
--
-- An approved teacher sees the learners whose teacher_id is theirs. An admin sees every learner, with the teacher each
-- one belongs to. Nobody else gets a row, and a teacher's or admin's own account is never a row: the roster is about
-- students. XP is summed from xp_events, as the leaderboard does, so the two agree by construction.

drop function if exists public.teacher_roster();
create or replace function public.teacher_roster()
returns table (
  user_id          uuid,
  username         text,
  display_name     text,
  role             text,
  created_at       timestamptz,
  xp               bigint,
  lessons          bigint,
  projects         bigint,
  trophies         bigint,
  certificates     bigint,
  last_active      timestamptz,
  teacher_username text,
  teacher_name     text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'teachers only' using errcode = '42501';
  end if;

  return query
    select p.id, p.username::text, p.display_name, p.role, p.created_at,
           coalesce(x.xp, 0)::bigint,
           coalesce(d.lessons, 0)::bigint,
           coalesce(d.projects, 0)::bigint,
           coalesce(t.trophies, 0)::bigint,
           coalesce(c.certificates, 0)::bigint,
           d.last_done,
           tt.username::text,
           tt.display_name
      from public.profiles p
      left join public.profiles tt on tt.id = coalesce(p.teacher_id, public.default_teacher_id())
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
     where p.role = 'learner'
       and (public.is_admin() or p.teacher_id = auth.uid())
     order by coalesce(x.xp, 0) desc, p.username asc;
end;
$$;

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
  if not public.is_staff() then
    raise exception 'teachers only' using errcode = '42501';
  end if;

  return query
    select g.user_id, g.course_id,
           count(*) filter (where g.kind = 'lesson')::bigint,
           count(*) filter (where g.kind = 'project')::bigint,
           max(g.completed_at)
      from public.progress g
      join public.profiles p on p.id = g.user_id
     where p.role = 'learner'
       and (public.is_admin() or p.teacher_id = auth.uid())
     group by g.user_id, g.course_id;
end;
$$;

-- ------------------------------------------------------- finishing an item
--
-- Teachers and admins work through the lessons for free, and the app tells the server so with an award of 0 XP. The
-- original function tried to write that as an XP event, and xp_events only holds positive amounts, so it failed for
-- exactly the accounts that send 0. A completion with no XP now records the progress row and no event.

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

  if p_xp > 0 then
    insert into public.xp_events (user_id, amount, source, course_id)
    values (auth.uid(), p_xp, p_kind || ':' || p_item_id, p_course_id);
  end if;

  return p_xp;
end;
$$;

-- ------------------------------------------------------ moving a student (admin)
--
-- The admin can put any learner in the class of another approved teacher, or of an admin (themself included, which
-- is "study with Nunada"). The learner's own choice goes through set_my_teacher; this is the admin's override, for a
-- student who typed the wrong name or whose class has changed hands.

create or replace function public.admin_set_student_teacher(p_student uuid, p_teacher uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admins only' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles s where s.id = p_student and s.role = 'learner') then
    raise exception 'not a learner' using errcode = 'P0002';
  end if;
  if not exists (
    select 1 from public.profiles t
     where t.id = p_teacher and (t.role = 'admin' or (t.role = 'teacher' and t.approval = 'approved'))
  ) then
    raise exception 'teacher not found' using errcode = 'P0002';
  end if;

  perform set_config('nunada.profile_admin', 'on', true);
  update public.profiles set teacher_id = p_teacher where id = p_student;
  perform set_config('nunada.profile_admin', 'off', true);
end;
$$;

-- ------------------------------------------------------------ feedback (admin)
--
-- `feedback` is written by the in-app button and readable only by its writer. The admin reads all of it through this
-- function, newest first, with the name of who wrote it.

create or replace function public.admin_feedback(p_limit integer default 500)
returns table (
  id           bigint,
  user_id      uuid,
  username     text,
  display_name text,
  role         text,
  rating       smallint,
  comment      text,
  created_at   timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admins only' using errcode = '42501';
  end if;

  return query
    select f.id, f.user_id, p.username::text, p.display_name, p.role, f.rating, f.comment, f.created_at
      from public.feedback f
      left join public.profiles p on p.id = f.user_id
     order by f.created_at desc, f.id desc
     limit greatest(1, least(coalesce(p_limit, 500), 2000));
end;
$$;

-- --------------------------------------------------------------- permissions
-- As in schema.sql: Supabase hands EXECUTE to anon on every new function, so anon is named in the revoke.

revoke execute on function public.is_admin()                            from public, anon;
revoke execute on function public.is_teacher()                          from public, anon;
revoke execute on function public.is_staff()                            from public, anon;
revoke execute on function public.default_teacher_id()                  from public, anon, authenticated;
revoke execute on function public.my_teacher()                          from public, anon;
revoke execute on function public.set_my_teacher(text)                  from public, anon;
revoke execute on function public.admin_teachers()                      from public, anon;
revoke execute on function public.set_teacher_approval(uuid, text)      from public, anon;
revoke execute on function public.teacher_roster()                      from public, anon;
revoke execute on function public.teacher_course_progress()             from public, anon;
revoke execute on function public.complete_item(text, text, text, integer) from public, anon;
revoke execute on function public.admin_set_student_teacher(uuid, uuid) from public, anon;
revoke execute on function public.admin_feedback(integer)               from public, anon;

grant execute on function public.is_admin()                            to authenticated;
grant execute on function public.is_teacher()                          to authenticated;
grant execute on function public.is_staff()                            to authenticated;
grant execute on function public.my_teacher()                          to authenticated;
grant execute on function public.set_my_teacher(text)                  to authenticated;
grant execute on function public.admin_teachers()                      to authenticated;
grant execute on function public.set_teacher_approval(uuid, text)      to authenticated;
grant execute on function public.teacher_roster()                      to authenticated;
grant execute on function public.teacher_course_progress()             to authenticated;
grant execute on function public.complete_item(text, text, text, integer) to authenticated;
grant execute on function public.admin_set_student_teacher(uuid, uuid) to authenticated;
grant execute on function public.admin_feedback(integer)               to authenticated;

-- ------------------------------------------------------------ the first admin
--
-- "Nunada" is the admin. This runs here, in the SQL editor, where auth.uid() is null and so the guard above lets it
-- through; the app has no way to say it. Another admin later: the same statement with their username.

do $$
begin
  update public.profiles set role = 'admin', approval = 'approved' where username = 'nunada';
  if not found then
    raise notice 'There is no account with the username "nunada" yet. Sign up with it, then run this file again.';
  end if;
end $$;
