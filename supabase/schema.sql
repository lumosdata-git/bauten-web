-- Estrutura de leads recebidos pela seção "Vamos conversar".
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  phone varchar(11) not null check (phone ~ '^[0-9]{11}$'),
  interest text not null check (char_length(interest) between 2 and 120),
  created_at timestamptz not null default timezone('utc', now())
);

comment on table public.leads is 'Leads enviados pelo formulário de contato da Bauten';
comment on column public.leads.phone is 'Celular brasileiro armazenado somente com 11 dígitos';

alter table public.leads enable row level security;

-- O formulário público pode criar leads, mas não pode consultar, editar ou excluir registros.
drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (lower(email));
