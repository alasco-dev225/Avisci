alter table if exists public.profiles
  add column if not exists role text default 'user';

alter table if exists public.profiles
  add column if not exists company_name text;

alter table if exists public.entreprises
  add column if not exists claimed_by uuid references auth.users(id),
  add column if not exists is_verified boolean default false,
  add column if not exists source text,
  add column if not exists source_osm_id text;

alter table if exists public.avis
  add column if not exists user_id uuid references auth.users(id),
  add column if not exists status text default 'published',
  add column if not exists updated_at timestamptz default now();

create table if not exists public.favoris (
  user_id uuid references auth.users(id) on delete cascade,
  entreprise_id uuid references public.entreprises(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, entreprise_id)
);

create table if not exists public.revendications_entreprises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entreprise_id uuid not null references public.entreprises(id) on delete cascade,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.signalements_avis (
  id uuid primary key default gen_random_uuid(),
  avis_id uuid not null references public.avis(id) on delete cascade,
  reported_by uuid not null references auth.users(id) on delete cascade,
  motif text not null,
  commentaire text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.reponses_entreprises (
  id uuid primary key default gen_random_uuid(),
  avis_id uuid not null unique references public.avis(id) on delete cascade,
  entreprise_id uuid not null references public.entreprises(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  contenu text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
