-- migration_v12.sql
-- Add subscription plan and trial fields to public.users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS plan varchar(50) DEFAULT 'trial';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz DEFAULT (now() + interval '14 days');
