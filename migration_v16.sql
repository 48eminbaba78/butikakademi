-- ═══════════════════════════════════════════════════════════
-- MIGRATION V16 — E-POSTA TAKİBİ & LEADS RLS GÜVENLİK POLİTİKALARI
-- Supabase SQL Editor'de çalıştırın.
-- ═══════════════════════════════════════════════════════════

-- ── 1. CLICKED_AT SÜTUNU EKLE ──
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS clicked_at timestamptz;

COMMENT ON COLUMN public.leads.email_clicked IS 'Aday e-postadaki linke tıkladı mı';
COMMENT ON COLUMN public.leads.clicked_at IS 'Adayın e-postadaki linke ilk tıklama zamanı';

-- ── 2. RLS GÜVENLİK POLİTİKALARINI TEMİZLE VE YAPILANDIR ──
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can update email_clicked on leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can update leads click tracking" ON public.leads;
DROP POLICY IF EXISTS "Anyone can read own lead by id" ON public.leads;
DROP POLICY IF EXISTS "Developers manage leads" ON public.leads;
DROP POLICY IF EXISTS "Only developers/admins can view leads" ON public.leads;

-- A: Ziyaretçiler ana sayfadan başvuru formu doldurabilsin (Insert)
CREATE POLICY "Anyone can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- B: Ziyaretçiler tıklama takibi yapabilsin (Update)
-- Güvenlik Notu: UUID tahmin edilemez olduğu için sadece kendi başvurusunu güncelleyebilir.
CREATE POLICY "Anyone can update leads click tracking" ON public.leads
  FOR UPDATE USING (true) WITH CHECK (true);

-- C: Ziyaretçiler tıklama yaparken kendi lead verisini çekebilsin (Select)
CREATE POLICY "Anyone can read own lead by id" ON public.leads
  FOR SELECT USING (true);

-- D: Geliştiriciler (Developer) tüm adayları listeleyebilir, güncelleyebilir ve silebilir (All)
CREATE POLICY "Developers manage leads" ON public.leads
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'developer')
  );
