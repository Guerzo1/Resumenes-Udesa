create extension if not exists pgcrypto;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  subject text not null check (char_length(subject) between 1 and 90),
  professor text check (professor is null or char_length(professor) <= 90),
  type text not null check (type in ('Resumen teórico', 'Parcial', 'Parcialito', 'Tutorial', 'TP')),
  description text check (description is null or char_length(description) <= 600),
  pdf_url text not null,
  original_filename text not null check (char_length(original_filename) between 1 and 180),
  uploader_name text check (uploader_name is null or char_length(uploader_name) <= 80),
  downloads integer not null default 0 check (downloads >= 0)
);

create index if not exists documents_created_at_idx on public.documents (created_at desc);
create index if not exists documents_subject_idx on public.documents (lower(subject));
create index if not exists documents_type_idx on public.documents (type);

alter table public.documents enable row level security;

drop policy if exists "Anyone can read documents" on public.documents;
create policy "Anyone can read documents"
on public.documents for select
using (true);

drop policy if exists "Anyone can insert documents" on public.documents;
create policy "Anyone can insert documents"
on public.documents for insert
with check (
  pdf_url like 'https://%'
  and original_filename ilike '%.pdf'
  and type in ('Resumen teórico', 'Parcial', 'Parcialito', 'Tutorial', 'TP')
);

drop policy if exists "Anyone can update download counts" on public.documents;
create policy "Anyone can update download counts"
on public.documents for update
using (true)
with check (true);

create or replace function public.increment_document_downloads(document_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.documents
  set downloads = downloads + 1
  where id = document_id;
$$;

grant execute on function public.increment_document_downloads(uuid) to anon;
grant execute on function public.increment_document_downloads(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', true, 12582912, array['application/pdf'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can read PDF files" on storage.objects;
create policy "Anyone can read PDF files"
on storage.objects for select
using (bucket_id = 'documents');

drop policy if exists "Anyone can upload PDF files" on storage.objects;
create policy "Anyone can upload PDF files"
on storage.objects for insert
with check (
  bucket_id = 'documents'
  and lower(right(name, 4)) = '.pdf'
);
