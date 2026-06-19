-- ============================================================================
-- BUTIK AKADEMI — ADMIN PANEL SCHEMA UPGRADES (admin_schema_v2.sql)
-- ============================================================================

-- 1. Upgrade appointments table to support meeting status tracking
alter table public.appointments add column if not exists status varchar(50) default 'pending' check (status in ('pending', 'completed', 'cancelled'));

-- 2. Upgrade users table to support account suspension/activation
alter table public.users add column if not exists active boolean default true;

-- 3. Create audit_logs table for administrative tracking (Audit Trail)
create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    admin_id uuid references public.users(id) on delete set null,
    action varchar(255) not null,
    target_type varchar(100),
    target_id varchar(100),
    ip_address varchar(50),
    created_at timestamptz default now()
);

-- Enable RLS for audit_logs
alter table public.audit_logs enable row level security;

create policy "Only developers/admins can view audit logs" 
    on public.audit_logs for select 
    using (auth.uid() in (select id from public.users where role = 'developer'));

create policy "Anyone can insert audit logs" 
    on public.audit_logs for insert 
    with check (true);
