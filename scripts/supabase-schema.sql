-- =============================================================================
-- NeuralVarsity Masterclass — Supabase setup (A to Z)
-- Paste this entire file into: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run: uses IF NOT EXISTS / IF EXISTS where possible.
-- Does NOT delete existing registration data.
-- =============================================================================

-- 1. UUID support
create extension if not exists pgcrypto;

-- 2. Table (matches Next.js Razorpay integration)
create table if not exists public.masterclass_registrations (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  email text not null,
  phone_number text not null,
  country_code text default 'IN',          -- ISO code: IN, US, GB (set by the app)
  city text,
  user_role text,

  payment_id text,
  order_id text,
  payment_signature text,

  amount_paid numeric default 111,
  payment_status text default 'unpaid',    -- unpaid → paid (or failed)

  course_name text default 'AI Masterclass',

  created_at timestamptz default now()
);

-- 3. Align defaults if table was created earlier with different values
alter table public.masterclass_registrations
  alter column country_code set default 'IN';

alter table public.masterclass_registrations
  alter column payment_status set default 'unpaid';

alter table public.masterclass_registrations
  alter column amount_paid set default 111;

alter table public.masterclass_registrations
  alter column course_name set default 'AI Masterclass';

-- 4. Indexes for payment + email lookups
create index if not exists masterclass_registrations_order_id_idx
  on public.masterclass_registrations (order_id);

create index if not exists masterclass_registrations_email_idx
  on public.masterclass_registrations (email);

create index if not exists masterclass_registrations_payment_status_idx
  on public.masterclass_registrations (payment_status);

-- 5. Row Level Security
alter table public.masterclass_registrations enable row level security;

-- Remove open anon insert (server uses service role; blocks fake public inserts)
drop policy if exists "Allow inserts" on public.masterclass_registrations;

drop policy if exists "Allow authenticated reads" on public.masterclass_registrations;

create policy "Allow authenticated reads"
  on public.masterclass_registrations
  for select
  to authenticated
  using (true);

-- =============================================================================
-- Done. App flow:
--   Form submit  → insert row with payment_status = 'unpaid'
--   Razorpay pay → update order_id, payment_id, payment_signature, status = 'paid'
-- =============================================================================
