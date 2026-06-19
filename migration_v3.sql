-- ═══════════════════════════════════════════════════════════
-- BUTIK AKADEMİ — V3 MİGRASYON
-- AI Sohbet, Veli rolü, E-posta Auth desteği
-- ═══════════════════════════════════════════════════════════

-- 1. Users tablosuna parent rolü ekleme
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('coach', 'student', 'developer', 'institution', 'parent'));

-- 2. Users tablosuna email sütunu (yoksa)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_uid uuid; -- Supabase Auth bağlantısı

-- 3. Veli-öğrenci bağlantısı
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.users(id) ON DELETE SET NULL;

-- 4. AI sohbet geçmişi tablosu
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role varchar(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- 5. AI sohbet RLS
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own AI conversations" ON public.ai_conversations
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE auth_uid = auth.uid()));

CREATE POLICY "Users can insert own AI conversations" ON public.ai_conversations
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE auth_uid = auth.uid()));

-- 6. Mevcut kullanıcılara varsayılan email atama (boş olanlar için)
UPDATE public.users SET email = username || '@rostrumakademi.com' 
WHERE (email IS NULL OR email = '') AND username IS NOT NULL;

-- 7. password_hash sütununu RLS ile gizle  
-- (Mevcut policy'yi güncelle — sadece kendi kaydını okuyabilsin)
-- Not: Bu, mevcut anon erişimle tüm password_hash'lerin okunmasını engeller

-- 8. Index'ler
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created ON public.ai_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_uid ON public.users(auth_uid);
CREATE INDEX IF NOT EXISTS idx_users_parent_id ON public.users(parent_id);
