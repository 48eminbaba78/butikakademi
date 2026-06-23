# -*- coding: utf-8 -*-
"""
BUTIK AKADEMI — SALES OUTREACH AGENT (SUPABASE VERSION)
Bu script, Google ve Instagram üzerinden koç/dershane verisi toplayıp Supabase veritabanına kaydeder
ve Gemini API kullanarak her adaya özel Türkçe satış e-postası (cold email) üretir.
"""

import os
import sys
import json
import urllib.request
import urllib.parse
from datetime import datetime

# Konsol çıktılarını UTF-8 yapmak (Windows uyumluluğu için)
sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None

# ── YAPILANDIRMA ──────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://imyhenrwmsmyikpollur.supabase.co")
# Anon key / Service role key
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# ── REST API İSTEK YARDIMCISI ──────────────────────────────
def make_supabase_request(path, method="GET", payload=None, extra_headers=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    if extra_headers:
        headers.update(extra_headers)

    data = None
    if payload is not None:
        data = json.dumps(payload).encode('utf-8')

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_content = response.read().decode('utf-8')
            return json.loads(res_content) if res_content else []
    except Exception as e:
        print(f"[Supabase Error] HTTP Request to {path} failed: {e}")
        return None

# ── MOCK ARAMA VE VERİ TOPLAMA (LEAD FINDER) ────────────────
def find_leads_mock():
    mock_data = [
        {
            "first_name": "Emin",
            "last_name": "Koc",
            "brand_name": "Emin Koçluk & Eğitim Danışmanlığı",
            "email": "info@eminkocluk.com",
            "instagram": "@eminkocluk",
            "website": "https://www.eminkocluk.com",
            "source": "google_search",
            "notes": "Instagram'da 15k takipçisi var. Bireysel YKS koçluğu yapıyor ve YKS derece öğrencilerini hedefliyor."
        },
        {
            "first_name": "Yesil",
            "last_name": "Koc",
            "brand_name": "Yeşil Koç Akademi",
            "email": "iletisim@yesilkoc.com",
            "instagram": "@yesilkoc",
            "website": "https://www.yesilkoc.com",
            "source": "instagram_tag",
            "notes": "LGS ve YKS koçluk hizmeti veren butik bir kurum. 5 kişilik bir koç kadrosu var."
        },
        {
            "first_name": "Hedef",
            "last_name": "Merkez",
            "brand_name": "Hedef Merkez Dershaneleri",
            "email": "hedefmerkez@gmail.com",
            "instagram": "@hedefmerkez",
            "website": "",
            "source": "google_maps",
            "notes": "Ankara'da yerel butik dershane. Web sitesi yok, kayıtlar için WhatsApp ve DM kullanıyorlar."
        },
        {
            "first_name": "Duru",
            "last_name": "Danismanlik",
            "brand_name": "Duru Eğitim Danışmanlığı",
            "email": "duru.danismanlik@outlook.com",
            "instagram": "@durukoc",
            "website": "https://www.durukocluk.com",
            "source": "google_search",
            "notes": "Bireysel KPSS ve YKS koçluğu yapan bağımsız rehber öğretmen."
        }
    ]
    
    added_count = 0
    for lead in mock_data:
        # Supabase'de e-posta ile kayıt var mı kontrol et
        path = f"leads?email=eq.{urllib.parse.quote(lead['email'])}&select=id"
        existing = make_supabase_request(path)
        
        if existing == []:
            # Kayıt yoksa Supabase'e ekle
            make_supabase_request("leads", method="POST", payload=lead, extra_headers={"Prefer": "return=minimal"})
            print(f"-> {lead['brand_name']} başarıyla Supabase leads tablosuna eklendi.")
            added_count += 1
            
    print(f"[Lead Finder] {added_count} yeni potansiyel koç Supabase'e kaydedildi.")

# ── GEMINI İLE KİŞİSELLEŞTİRİLMİŞ TEKLİF ÜRETME (DRAFTING) ────
def generate_pitch(lead_name, lead_notes, lead_instagram):
    if not GEMINI_API_KEY:
        print("[Draft] HATA: GEMINI_API_KEY ortam değişkeni ayarlanmamış!")
        return "E-posta üretilemedi. Gemini API Key eksik."

    prompt = f"""
Sen Rostrum Akademi platformunun Satış ve Müşteri İlişkileri Temsilcisisin (Adın Caner).
Eğitim koçluğu yapan bir kişiye veya kuruma, Rostrum Akademi'yi tanıtan ve onları 14 günlük ücretsiz deneme sürecine davet eden samimi, profesyonel ve kişiselleştirilmiş bir soğuk e-posta (cold email) yazmanı istiyorum.

Aday Bilgileri:
- Adı: {lead_name}
- Instagram Kullanıcı Adı: {lead_instagram}
- Detay/Biyografi Notu: {lead_notes}

Rostrum Akademi Özellikleri:
- Kendi markalarıyla (logo ve renkleri) white-label platform sunabilmeleri.
- YouTube playlist entegrasyonu ile haftalık ders programlarını 1 dakikada oluşturabilmeleri.
- Velilere tek tıkla gelişim grafiklerini içeren markalı PDF raporlar gönderebilmeleri.
- Öğrencilerine özel entegre Yapay Zeka Ders Asistanı sunmaları.

Yazım Kuralları:
- Konu satırı (Subject) dikkat çekici, tıklama oranı yüksek ve samimi olsun. (Konu: ... şeklinde belirt)
- Mail tonu çok resmi ("Sayın Yetkili") veya aşırı lakayıt olmasın. Samimi, vizyoner ve meslektaş gibi hitap et ("Emin Hocam merhaba," veya "Yeşil Koç ekibine merhaba," gibi).
- Mailde aday notlarındaki detaya (örneğin Instagram takipçi sayısına veya derece öğrencilerini hedeflemesine) mutlaka akıllıca atıfta bulunarak mailin toplu bir mail değil, tamamen ona özel yazıldığını hissettir.
- Maili kısa tut (en fazla 15-20 satır). Okuması kolay olsun.
- Sonunda net bir harekete geçirici mesaj (CTA) ekle: "Bu hafta sistemi 5 dakikalığına birlikte incelemek ister misiniz? Uygun olduğunuz bir günü iletebilirseniz bir Google Meet randevusu oluşturabilirim." gibi.

Lütfen doğrudan Türkçe yazılmış e-posta metnini ver.
"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024
        }
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers=headers, method="POST")
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            pitch = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return pitch
    except Exception as e:
        print(f"[Gemini Error] Mail oluşturulurken hata: {e}")
        return None

# ── TÜM ADAYLARA TEKLİF DRAFTI OLUŞTURMA ────────────────────
def draft_all_leads():
    # Durumu 'pending' olan adayları seç
    path = "leads?status=eq.pending&select=id,first_name,last_name,brand_name,notes,instagram"
    pending_leads = make_supabase_request(path)
    
    if not pending_leads:
        print("[Draft] İşlenecek bekleyen aday bulunamadı.")
        return

    print(f"[Draft] {len(pending_leads)} aday için teklif metni üretiliyor...")
    
    for lead in pending_leads:
        name = f"{lead['first_name']} {lead.get('last_name') or ''}".strip() or lead['brand_name']
        print(f"-> {name} için taslak üretiliyor...")
        pitch = generate_pitch(name, lead.get('notes') or '', lead.get('instagram') or '')
        if pitch:
            update_path = f"leads?id=eq.{lead['id']}"
            make_supabase_request(update_path, method="PATCH", payload={"pitch_text": pitch, "status": "drafted"}, extra_headers={"Prefer": "return=minimal"})
            print(f"   [✓] Taslak oluşturuldu ve Supabase'e kaydedildi.")
        else:
            print(f"   [X] Taslak oluşturulamadı.")
            
    print("[Draft] Taslak oluşturma işlemi tamamlandı.")

# ── CRM VERİLERİNİ GÖSTERME (REPORT) ───────────────────────
def show_crm():
    path = "leads?select=id,brand_name,email,instagram,status&order=created_at.desc"
    rows = make_supabase_request(path)
    
    if not rows:
        print("leads tablosunda veri bulunamadı.")
        return

    print("\n" + "="*80)
    print(f"{'ID':<38} | {'MARKA/AD':<25} | {'E-POSTA/IG':<25} | {'DURUM':<10}")
    print("="*80)
    for row in rows:
        email_or_ig = row.get("email") or row.get("instagram") or "—"
        print(f"{row['id']:<38} | {row['brand_name'][:23]:<25} | {email_or_ig[:23]:<25} | {row['status']:<10}")
    print("="*80 + "\n")

# ── ANA ÇALIŞTIRMA BLOĞU ──────────────────────────────────
if __name__ == "__main__":
    # Komut satırı argümanı kontrolü
    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        if cmd == "list":
            show_crm()
        elif cmd == "draft":
            draft_all_leads()
        elif cmd == "run":
            find_leads_mock()
            draft_all_leads()
            show_crm()
        else:
            print("Kullanım: python outreach_agent.py [run | list | draft]")
    else:
        print("--- Rostrum Akademi Outreach Ajanı Başlatılıyor ---")
        find_leads_mock()
        draft_all_leads()
        show_crm()
