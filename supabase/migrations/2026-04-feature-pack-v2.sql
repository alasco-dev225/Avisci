-- Champs pour filtres quartiers + confiance locale + avis vocaux
alter table if exists public.entreprises
  add column if not exists quartier text,
  add column if not exists trust_score int default 0;

alter table if exists public.avis
  add column if not exists audio_url text;

-- Bucket audio pour avis vocaux
insert into storage.buckets (id, name, public)
values ('reviews-audio', 'reviews-audio', true)
on conflict (id) do nothing;

-- Politique simple: utilisateurs connectés peuvent uploader
create policy if not exists "authenticated can upload voice reviews"
on storage.objects for insert
with check (bucket_id = 'reviews-audio' and auth.role() = 'authenticated');

create policy if not exists "public can read voice reviews"
on storage.objects for select
using (bucket_id = 'reviews-audio');

-- Bucket logos des commerces revendiqués
insert into storage.buckets (id, name, public)
values ('company-logos', 'company-logos', true)
on conflict (id) do nothing;

create policy if not exists "public can read company logos"
on storage.objects for select
using (bucket_id = 'company-logos');

create policy if not exists "authenticated can upload company logos"
on storage.objects for insert
with check (bucket_id = 'company-logos' and auth.role() = 'authenticated');
