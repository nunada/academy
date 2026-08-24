-- What each learner has actually done.
--
-- Run these in the Supabase SQL editor. Nothing here writes, and nothing here
-- is reachable from the app: row-level security limits a signed-in learner to
-- their own rows, and these queries read across everybody. The SQL editor runs
-- as a privileged role, which is exactly why this file lives here and not
-- behind an RPC.
--
-- Four questions, in the order you will want them: who is doing what, how far
-- along each course they are, who has gone quiet, and where people stop.


-- 1. One row per learner ---------------------------------------------------
--
-- Everyone appears, including a learner who signed up and has not finished a
-- single item. Those are the rows worth looking at first, and an inner join
-- would have hidden them.
--
-- XP is summed from xp_events rather than from progress.xp, because that is
-- what the leaderboards count; totals here and totals on the board agree by
-- construction rather than by coincidence.

select
    p.display_name,
    p.username,
    p.created_at::date            as joined,
    coalesce(x.xp, 0)             as xp,
    coalesce(d.lessons, 0)        as lessons,
    coalesce(d.projects, 0)       as projects,
    coalesce(t.trophies, 0)       as trophies,
    coalesce(c.certificates, 0)   as certificates,
    d.last_done::date             as last_active
  from public.profiles p
  left join (select user_id, sum(amount) as xp
               from public.xp_events group by user_id) x on x.user_id = p.id
  left join (select user_id,
                    count(*) filter (where kind = 'lesson')  as lessons,
                    count(*) filter (where kind = 'project') as projects,
                    max(completed_at)                        as last_done
               from public.progress group by user_id) d on d.user_id = p.id
  left join (select user_id, count(*) as trophies
               from public.trophies group by user_id) t on t.user_id = p.id
  left join (select user_id, count(*) as certificates
               from public.certificates group by user_id) c on c.user_id = p.id
 order by xp desc, p.username;


-- 2. How far through each course --------------------------------------------
--
-- The denominators are not in the database. How many lessons a course has is a
-- property of the curriculum in src/content, so they are written out here and
-- have to be kept in step by hand — `npm run check:curriculum` is what proves
-- these same numbers still match the real thing.
--
-- A course_id with no entry below leaves pct null rather than silently
-- reporting a wrong percentage. If you see a null, this list is out of date.

with size (course_id, lessons, projects) as (
  values
    ('python', 37, 18),
    ('html', 14, 7),
    ('css', 14, 7),
    ('javascript', 14, 7),
    ('sql', 14, 7),
    ('typescript', 14, 7),
    ('react', 14, 7),
    ('game-dev', 14, 7)
)
select
    p.display_name,
    g.course_id,
    count(*) filter (where g.kind = 'lesson')  || ' / ' || s.lessons  as lessons,
    count(*) filter (where g.kind = 'project') || ' / ' || s.projects as projects,
    round(100.0 * count(*) / (s.lessons + s.projects))::int           as pct,
    max(g.completed_at)::date                                        as last_touched
  from public.progress g
  join public.profiles p on p.id = g.user_id
  left join size s on s.course_id = g.course_id
 group by p.display_name, g.course_id, s.lessons, s.projects
 order by p.display_name, pct desc nulls last;


-- 3. Who has gone quiet ------------------------------------------------------
--
-- Nothing finished in a week. A learner who signed up and never started counts
-- from the day they joined, which is why created_at stands in for a completion
-- that never happened.

select
    p.display_name,
    p.username,
    coalesce(max(g.completed_at)::date::text, 'never started')        as last_active,
    extract(day from now() - coalesce(max(g.completed_at), p.created_at))::int as days_quiet
  from public.profiles p
  left join public.progress g on g.user_id = p.id
 group by p.id, p.display_name, p.username, p.created_at
having coalesce(max(g.completed_at), p.created_at) < now() - interval '7 days'
 order by days_quiet desc;


-- 4. Where people stop -------------------------------------------------------
--
-- The last thing each learner finished in each course, counted. An item that
-- shows up repeatedly is one where the next step is too big a jump.
--
-- Read it with one caveat: somebody who is mid-lesson right now also has a
-- most-recent item, so a busy week puts ordinary items near the top. Cross-check
-- against query 3 — an item is only really a wall if the people sitting on it
-- have stopped coming back.

with furthest as (
  select distinct on (user_id, course_id)
         user_id, course_id, item_id, kind, completed_at
    from public.progress
   order by user_id, course_id, completed_at desc
)
select
    course_id,
    item_id,
    kind,
    count(*) as learners_stopped_here
  from furthest
 group by course_id, item_id, kind
 order by learners_stopped_here desc, course_id, item_id
 limit 20;
