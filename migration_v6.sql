-- ═══════════════════════════════════════════════════════════
-- BUTIK AKADEMİ — V6 MİGRASYON
-- Özel Kaynaklar ve Program Şablonları Desteği
-- ═══════════════════════════════════════════════════════════

-- 1. resources tablosuna coach_id ekleme (foreign key referencing public.users)
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS coach_id uuid REFERENCES public.users(id) ON DELETE CASCADE;

-- 2. resources tablosu için RLS aktif etme
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 3. resources RLS politikalarını tanımlama
DROP POLICY IF EXISTS "Resources are viewable by authed users" ON public.resources;
CREATE POLICY "Resources are viewable by authed users" ON public.resources
    FOR SELECT USING (
        coach_id IS NULL 
        OR coach_id = auth.uid() 
        OR coach_id = public.get_user_coach(auth.uid())
        OR public.get_user_role(auth.uid()) = 'developer'
    );

DROP POLICY IF EXISTS "Coaches and developers can manage resources" ON public.resources;
CREATE POLICY "Coaches and developers can manage resources" ON public.resources
    FOR ALL USING (
        coach_id = auth.uid()
        OR public.get_user_role(auth.uid()) = 'developer'
    );

-- 4. program_templates tablosunu oluşturma
CREATE TABLE IF NOT EXISTS public.program_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    name varchar(255) not null,
    description text,
    tasks jsonb not null default '[]'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- 5. program_templates için RLS aktif etme
ALTER TABLE public.program_templates ENABLE ROW LEVEL SECURITY;

-- 6. program_templates RLS politikalarını tanımlama
DROP POLICY IF EXISTS "Templates are viewable by their coach" ON public.program_templates;
CREATE POLICY "Templates are viewable by their coach" ON public.program_templates
    FOR SELECT USING (coach_id = auth.uid());

DROP POLICY IF EXISTS "Templates are manageable by their coach" ON public.program_templates;
CREATE POLICY "Templates are manageable by their coach" ON public.program_templates
    FOR ALL USING (coach_id = auth.uid());
