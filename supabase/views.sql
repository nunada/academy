-- Nunada Academy — migration: how many times each article and game has been opened
--
-- Run this ONCE in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- Safe to re-run. Until it has been run the pages simply show no number.
--
-- What it adds:
--   page_views            one row per page (kind + slug), holding its count; closed to every client role
--   page_view(kind, slug, count)  counts one view and returns the total; with count = false it only reads
--   page_views(kind)      the totals of every page of one kind, for the cards on the lists
--
-- Both functions are open to anyone, signed in or not: the pages are public, so visitors who have no account are
-- the ones being counted. That is why the table itself is closed and everything goes through two small functions
-- that check what they are given.
--
-- A counter that anyone can call can be inflated by anyone who wants to, and nothing here pretends otherwise; the
-- checks only keep the table from being abused in other ways: the kind must be 'article' or 'game', the address a
-- plain slug, and at most 1000 pages are ever counted, so made-up addresses cannot fill the database.

create table if not exists public.page_views (
  kind       text   not null check (kind in ('article', 'game')),
  slug       text   not null check (slug ~ '^[a-z0-9][a-z0-9-]{0,79}$'),
  views      bigint not null default 0 check (views >= 0),
  updated_at timestamptz not null default now(),
  primary key (kind, slug)
);

-- Row-level security with no policy lets nobody in; the revoke closes the table grants that Supabase gives new
-- tables by default (to anon and authenticated, by name, not through PUBLIC).
alter table public.page_views enable row level security;
revoke all on table public.page_views from public, anon, authenticated;

create or replace function public.page_view(p_kind text, p_slug text, p_count boolean default true)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v bigint;
begin
  -- Anything that is not a real kind and a plain slug is "unknown", not an error: the page just shows no number.
  if p_kind is null or p_kind not in ('article', 'game') or p_slug is null or p_slug !~ '^[a-z0-9][a-z0-9-]{0,79}$' then
    return null;
  end if;

  if not coalesce(p_count, true) then
    select pv.views into v from public.page_views pv where pv.kind = p_kind and pv.slug = p_slug;
    return coalesce(v, 0);
  end if;

  -- A page that is not counted yet needs a row; refuse once there are 1000, so the table has a ceiling.
  if not exists (select 1 from public.page_views pv where pv.kind = p_kind and pv.slug = p_slug)
     and (select count(*) from public.page_views) >= 1000 then
    return null;
  end if;

  insert into public.page_views as pv (kind, slug, views)
  values (p_kind, p_slug, 1)
  on conflict (kind, slug) do update set views = pv.views + 1, updated_at = now()
  returning pv.views into v;
  return v;
end;
$$;

create or replace function public.page_views(p_kind text)
returns table (slug text, views bigint)
language sql
stable
security definer
set search_path = public
as $$
  select pv.slug, pv.views
    from public.page_views pv
   where pv.kind = p_kind
   order by pv.slug
   limit 1000;
$$;

-- Supabase gives new functions to anon by default, so name the roles on both sides: close, then open on purpose.
revoke execute on function public.page_view(text, text, boolean) from public, anon, authenticated;
revoke execute on function public.page_views(text)               from public, anon, authenticated;
grant  execute on function public.page_view(text, text, boolean) to anon, authenticated;
grant  execute on function public.page_views(text)               to anon, authenticated;
