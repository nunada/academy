-- Nunada Academy — migration: public profiles (click a name on the leaderboard)
--
-- Run this ONCE in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- Safe to re-run. It contains only what is new; the same statements are also in
-- schema.sql, so a fresh project that runs schema.sql does not need this file.
--
-- What it adds:
--   weekly_medals_of(uuid)  the weekly-medal ranking, now shared (not callable by clients)
--   my_weekly_medals()      same answer as before, now a thin wrapper over it
--   public_profile(uuid)    what any signed-in learner may see of another learner

-- How many *completed* weeks (never the one still running — its rank can
-- still change before it ends) the calling learner placed 1st/2nd/3rd
-- overall. Ranks every learner's weekly total against everyone else's for
-- that same week, then counts how many of the caller's own weeks landed in
-- each of the top three places — computed straight from xp_events, the same
-- one-source-of-truth approach leaderboard_weekly already takes, rather than
-- a count kept and updated separately that could drift from it.
--
-- Takes the learner as an argument so the same ranking serves both the
-- caller's own profile (my_weekly_medals) and anybody's public profile
-- (public_profile). It is not granted to any client role: it answers for
-- whichever id it is handed, so only the two functions below may call it.
create or replace function public.weekly_medals_of(p_user uuid)
returns table (gold bigint, silver bigint, bronze bigint)
language sql
security definer
set search_path = public
as $$
  with weekly as (
    select
      e.user_id,
      p.username,
      date_trunc('week', e.created_at at time zone 'utc') as wk,
      sum(e.amount) as value
      from public.xp_events e
      join public.profiles p on p.id = e.user_id
     where p.role = 'learner'
       and e.created_at < date_trunc('week', now() at time zone 'utc') at time zone 'utc'
     group by e.user_id, p.username, date_trunc('week', e.created_at at time zone 'utc')
  ),
  ranked as (
    select
      user_id,
      row_number() over (partition by wk order by value desc, username asc) as rnk
      from weekly
  )
  select
    count(*) filter (where rnk = 1) as gold,
    count(*) filter (where rnk = 2) as silver,
    count(*) filter (where rnk = 3) as bronze
    from ranked
   where user_id = p_user;
$$;

create or replace function public.my_weekly_medals()
returns table (gold bigint, silver bigint, bronze bigint)
language sql
security definer
set search_path = public
as $$
  select * from public.weekly_medals_of(auth.uid());
$$;

-- What anybody signed in may see of another learner: the numbers and the
-- awards, and nothing that is only theirs to know.
--
-- Left out on purpose: the email address (it lives in auth.users and is never
-- selected), hearts, per-lesson progress, certificate serial numbers, and the
-- timing of individual XP awards. A teacher account answers with no row at
-- all, the way the leaderboards leave teachers out, so a teacher's profile
-- cannot be opened by guessing an id.
--
-- security definer because xp_events, trophies and certificates are readable
-- only by their owner; this returns a fixed shape instead of the rows.
create or replace function public.public_profile(p_user_id uuid)
returns table (
  user_id      uuid,
  username     text,
  display_name text,
  created_at   timestamptz,
  xp_total     bigint,
  xp_week      bigint,
  trophy_ids   text[],
  certificates jsonb,
  gold         bigint,
  silver       bigint,
  bronze       bigint,
  alltime_rank integer
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.username::text,
    p.display_name,
    p.created_at,
    coalesce((select sum(e.amount) from public.xp_events e where e.user_id = p.id), 0)::bigint,
    coalesce((select sum(e.amount) from public.xp_events e
               where e.user_id = p.id
                 and e.created_at >= date_trunc('week', now() at time zone 'utc') at time zone 'utc'), 0)::bigint,
    coalesce((select array_agg(t.trophy_id order by t.earned_at) from public.trophies t where t.user_id = p.id),
             '{}'::text[]),
    coalesce((select jsonb_agg(jsonb_build_object('kind', c.kind, 'ref_id', c.ref_id, 'issued_at', c.issued_at)
                               order by c.issued_at)
                from public.certificates c where c.user_id = p.id),
             '[]'::jsonb),
    m.gold,
    m.silver,
    m.bronze,
    -- Same ordering as leaderboard_alltime, so this is the place the learner
    -- holds on that board. Null outside the top three.
    (select r.rnk::integer from (
        select e.user_id as uid,
               row_number() over (order by sum(e.amount) desc, q.username asc) as rnk
          from public.xp_events e
          join public.profiles q on q.id = e.user_id
         where q.role = 'learner'
         group by e.user_id, q.username
     ) r where r.uid = p.id and r.rnk <= 3)
  from public.profiles p
  cross join lateral public.weekly_medals_of(p.id) m
 where p.id = p_user_id
   and p.role = 'learner';
$$;

-- ------------------------------------------------------------------- grants
-- Same pattern as every other function in schema.sql: Supabase hands EXECUTE to
-- anon directly, so revoking from PUBLIC alone is not enough — name the roles.
revoke execute on function public.my_weekly_medals()     from public, anon;
revoke execute on function public.weekly_medals_of(uuid) from public, anon, authenticated;
revoke execute on function public.public_profile(uuid)   from public, anon;

grant execute on function public.my_weekly_medals()   to authenticated;
grant execute on function public.public_profile(uuid) to authenticated;

-- Make the API notice the new function straight away.
notify pgrst, 'reload schema';
