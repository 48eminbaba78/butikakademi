-- ============================================================
-- MIGRATION v14 — Onboarding Wizard: Koç Profil Alanları
-- ============================================================

-- workspaces tablosuna koç profil alanları ekle
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS phone varchar(50);
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS exam_types text DEFAULT 'YKS';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS student_count_range varchar(50) DEFAULT '1-5';

-- Öğrenci notları için düzgün tablo (platform_settings hack'ini değiştirir)
CREATE TABLE IF NOT EXISTS public.student_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notes text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(coach_id, student_id)
);
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_notes_policy" ON public.student_notes;
CREATE POLICY "student_notes_policy" ON public.student_notes FOR ALL USING (
  coach_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'developer')
);
