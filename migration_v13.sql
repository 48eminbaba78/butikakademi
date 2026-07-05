-- ============================================================
-- MIGRATION v13 — Konu Mastery (Yıldız Sistemi) + Tekrar Takip
-- ============================================================

-- 1. konu_mastery tablosu
-- Her öğrencinin her konudaki hakimiyet seviyesini tutar (0-7 yıldız)
CREATE TABLE IF NOT EXISTS public.konu_mastery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL,
  subject text NOT NULL,
  konu text NOT NULL,
  stars integer NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 7),
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','active','td')),
  ka_date timestamptz,          -- Konu anlatımı tamamlanma tarihi
  td_date timestamptz,          -- Tekrar dışı yapılma tarihi
  last_review_date timestamptz, -- Son tekrar tarihi
  review_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject, konu)
);

ALTER TABLE public.konu_mastery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "konu_mastery_select" ON public.konu_mastery;
DROP POLICY IF EXISTS "konu_mastery_modify" ON public.konu_mastery;

CREATE POLICY "konu_mastery_select" ON public.konu_mastery
  FOR SELECT USING (
    student_id = auth.uid()
    OR coach_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'developer'
    )
  );

CREATE POLICY "konu_mastery_modify" ON public.konu_mastery
  FOR ALL USING (
    coach_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'developer'
    )
  );


-- 2. konu_tekrar_log tablosu
-- Her 10 günlük periyotta her konu için tekrar sayısını tutar
CREATE TABLE IF NOT EXISTS public.konu_tekrar_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL,
  subject text NOT NULL,
  konu text NOT NULL,
  period_start date NOT NULL,      -- 10 günlük periyodun başlangıcı (her ayın 1, 11, 21. günü)
  review_count integer DEFAULT 0 CHECK (review_count BETWEEN 0 AND 6),
  notes text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject, konu, period_start)
);

ALTER TABLE public.konu_tekrar_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "konu_tekrar_log_select" ON public.konu_tekrar_log;
DROP POLICY IF EXISTS "konu_tekrar_log_modify" ON public.konu_tekrar_log;

CREATE POLICY "konu_tekrar_log_select" ON public.konu_tekrar_log
  FOR SELECT USING (
    student_id = auth.uid()
    OR coach_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'developer'
    )
  );

CREATE POLICY "konu_tekrar_log_modify" ON public.konu_tekrar_log
  FOR ALL USING (
    coach_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'developer'
    )
  );


-- 3. Deneme sınavlarına mastery öneri alanı ekle (opsiyonel, varsa)
-- Bu tablo zaten var, sadece yeni kolon eklenecek
ALTER TABLE public.exams
  ADD COLUMN IF NOT EXISTS mastery_suggestions jsonb DEFAULT '[]'::jsonb;

-- 4. YKS Alan (SAY, EA, SOZ, DIL) desteği ekleme
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS yks_area varchar(50) DEFAULT 'SAY' CHECK (yks_area IN ('SAY', 'EA', 'SOZ', 'DIL'));

-- 5. update_student_profile fonksiyonunu güncelle
CREATE OR REPLACE FUNCTION public.update_student_profile(
  p_student_id uuid,
  p_full_name text,
  p_target text,
  p_color text,
  p_progress integer,
  p_week_start integer,
  p_username text,
  p_plain_password text,
  p_password_hash text,
  p_yks_area text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
  v_email text;
BEGIN
  v_email := p_username || '@rostrumakademi.com';

  -- Update auth.users
  UPDATE auth.users
  SET email = v_email,
      encrypted_password = crypt(p_plain_password, gen_salt('bf', 10)),
      updated_at = now()
  WHERE id = p_student_id;

  -- Update public.users
  UPDATE public.users
  SET full_name = p_full_name,
      target = p_target,
      color = p_color,
      progress = p_progress,
      week_start = p_week_start,
      username = p_username,
      email = v_email,
      password_hash = p_password_hash,
      yks_area = p_yks_area
  WHERE id = p_student_id;
END;
$$;

