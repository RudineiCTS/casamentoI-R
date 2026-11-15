-- =====================================================================
-- Site de casamento Isa & Rudinei: estrutura do banco no Supabase
-- Cole tudo no SQL Editor do Supabase e clique em "Run". Pode rodar de novo
-- sem problema (usa IF NOT EXISTS / ON CONFLICT).
--
-- Segurança: RLS ligado e NENHUMA política para anon/authenticated.
-- Só o servidor do Next.js (com a SUPABASE_SECRET_KEY) lê e grava.
-- A chave publicável sozinha não acessa nada destas tabelas.
-- =====================================================================

-- ---------- Presentes ----------
create table if not exists public.gifts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text not null default '',
  kind            text not null default 'tradicional' check (kind in ('tradicional', 'lua-de-mel')),
  category        text not null default 'Outros',
  price_cents     integer not null check (price_cents >= 0),
  quota_total     integer check (quota_total is null or quota_total > 0),
  quota_given     integer not null default 0 check (quota_given >= 0),
  image_url       text,
  store_url       text,
  status          text not null default 'disponivel' check (status in ('disponivel', 'recebido')),
  visible         boolean not null default true,
  sort_order      integer not null default 0,
  stripe_price_id text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists gifts_sort_idx on public.gifts (sort_order, created_at);
alter table public.gifts enable row level security;

-- ---------- Confirmações de presença (RSVP) ----------
create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text,
  message     text,
  created_at  timestamptz not null default now()
);

create index if not exists rsvps_created_idx on public.rsvps (created_at desc);
alter table public.rsvps enable row level security;

-- ---------- Fotos dos presentes (Storage) ----------
-- Bucket público para leitura (as fotos aparecem no site); upload só pelo servidor.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('presentes', 'presentes', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
