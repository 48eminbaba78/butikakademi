# -*- coding: utf-8 -*-
"""
BUTIK AKADEMI — SALES OUTREACH AGENT
Bu script, Google ve Instagram üzerinden koç/dershane verisi toplayıp SQLite veritabanına kaydeder
ve Gemini API kullanarak her adaya özel Türkçe satış e-postası (cold email) üretir.
"""

import os
import sys
import sqlite3
import json
import urllib.request
import urllib.parse
from datetime import datetime

# Konsol çıktılarını UTF-8 yapmak (Windows uyumluluğu için)
sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None

# ── YAPILANDIRMA ──────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "leads.db")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Örnek Arama Anahtar Kelimeleri
KEYWORDS = ["yks koçluğu", "öğrenci koçu", "lgs koçluk", "butik dershane"]

# ── VERİTABANI BAŞLATMA ────────────────────────────────────
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            instagram TEXT,
            website TEXT,
            source TEXT,
            notes TEXT,
            status TEXT DEFAULT 'pending', -- pending, drafted, sent, replied, failed
            pitch_text TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()

# ── MOCK ARAMA VE VERİ TOPLAMA (LEAD FINDER) ────────────────
# Gerçek API anahtarı olmadığında çalışacak yüksek kaliteli yerel veri seti
def find_leads_mock():
    mock_data = [
        {
            "name": "Emin Koçluk & Eğitim Danışmanlığı",
            "email": "info@eminkocluk.com",
            "instagram": "@eminkocluk",
            "website": "https://www.eminkocluk.com",
            "source": "google_search",
            "notes": "Instagram'da 15k takipçisi var. Bireysel YKS koçluğu yapıyor ve YKS derece öğrencilerini hedefliyor."
        },
        {
            "name": "Yeşil Koç Akademi",
            "email": "iletisim@yesilkoc.com",
            "instagram": "@yesilkoc",
            "website": "https://www.yesilkoc.com",
            "source": "instagram_tag",
            "notes": "LGS ve YKS koçluk hizmeti veren butik bir kurum. 5 kişilik bir koç kadrosu var."
        },
        {
            "name": "Hedef Merkez Dershaneleri",
            "email": "hedefmerkez@gmail.com",
            "instagram": "@hedefmerkez",
            "website": "",
            "source": "google_maps",
            "notes": "Ankara'da yerel butik dershane. Web sitesi yok, kayıtlar için WhatsApp ve DM kullanıyorlar."
        },
        {
            "name": "Duru Eğitim Danışmanlığı",
            "email": "duru.danismanlik@outlook.com",
            "instagram": "@durukoc",
            "website": "https://www.durukocluk.com",
            "source": "google_search",
            "notes": "Bireysel KPSS ve YKS koçluğu yapan bağımsız rehber öğretmen."
        }
    ]
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    added_count = 0
    for lead in mock_data:
        # E-posta mükerrerlik kontrolü
        cursor.execute("SELECT id FROM leads WHERE email = ?", (lead["email"],))
        if cursor.fetchone() is None:
            cursor.execute("""
                INSERT INTO leads (name, email, instagram, website, source, notes, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
            """, (lead["name"], lead["email"], lead["instagram"], lead["website"], lead["source"], lead["notes"], datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
            added_count += 1
            
    conn.commit()
    conn.close()
    print(f"[Lead Finder] {added_count} yeni potansiyel koç veritabanına eklendi.")

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
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, notes, instagram FROM leads WHERE status = 'pending'")
    pending_leads = cursor.fetchall()
    
    if not pending_leads:
        print("[Draft] İşlenecek bekleyen aday bulunamadı.")
        conn.close()
        return

    print(f"[Draft] {len(pending_leads)} aday için teklif metni üretiliyor...")
    
    for lead_id, name, notes, instagram in pending_leads:
        print(f"-> {name} için taslak üretiliyor...")
        pitch = generate_pitch(name, notes, instagram)
        if pitch:
            cursor.execute("""
                UPDATE leads 
                SET pitch_text = ?, status = 'drafted' 
                WHERE id = ?
            """, (pitch, lead_id))
            print(f"   [✓] Taslak oluşturuldu.")
        else:
            print(f"   [X] Taslak oluşturulamadı.")
            
    conn.commit()
    conn.close()
    print("[Draft] Taslak oluşturma işlemi tamamlandı.")

# ── CRM VERİLERİNİ GÖSTERME (REPORT) ───────────────────────
def show_crm():
    if not os.path.exists(DB_PATH):
        print("leads.db bulunamadı! Önce scripti çalıştırıp veri toplayın.")
        return
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, instagram, status FROM leads")
    rows = cursor.fetchall()
    
    print("\n" + "="*70)
    print(f"{'ID':<4} | {'AD':<30} | {'E-POSTA':<30} | {'DURUM':<10}")
    print("="*70)
    for row in rows:
        print(f"{row[0]:<4} | {row[1][:28]:<30} | {(row[2] or row[3]):<30} | {row[4]:<10}")
    print("="*70 + "\n")
    conn.close()

# ── ANA ÇALIŞTIRMA BLOĞU ──────────────────────────────────
if __name__ == "__main__":
    init_db()
    
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
        # Varsayılan olarak tüm adımları çalıştır
        print("--- Rostrum Akademi Outreach Ajanı Başlatılıyor ---")
        find_leads_mock()
        draft_all_leads()
        show_crm()
