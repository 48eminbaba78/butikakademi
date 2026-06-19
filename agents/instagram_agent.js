// ═══════════════════════════════════════════════════════════
// BUTIK AKADEMI — INSTAGRAM AUTOMATION & GROWTH AGENT
// Bu script, günlük motivasyon sözleri ve YKS sınav sayacı içerikleri üretir,
// görselleştirir ve Instagram Graph API üzerinden otomatik paylaşım yapar.
// ═══════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// ── YAPILANDIRMA ──────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://imyhenrwmsmyikpollur.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''; // Service Role key tavsiye edilir
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID || 'YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID';
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || 'YOUR_FACEBOOK_GRAPH_API_ACCESS_TOKEN';

// YKS Sınav Tarihi (Örn: 2026-06-20T10:00:00)
const YKS_DATE = new Date('2026-06-20T10:00:00');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 1. HESAPLAMALAR VE GEMINI ENTEGRASYONU ────────────────
function getDaysLeftToYks() {
  const diffTime = YKS_DATE.getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

// Gemini API'den Türkçe Motivasyon Sözü veya Çalışma İpucu Alır
async function generatePostContent(daysLeft) {
  if (!GEMINI_API_KEY) {
    return {
      quote: "Başarı, her gün tekrarlanan küçük adımların toplamıdır.",
      author: "Robert Collier",
      caption: `YKS'ye tam ${daysLeft} gün kaldı! Çalışmalara kesintisiz devam eden tüm şampiyonlara başarılar dileriz. 🚀 #yks2026 #ykskocluk #rostrumakademi`
    };
  }

  const prompt = `
Sen Rostrum Akademi'nin popüler Instagram sayfası (@rostrumakademi) için bir içerik üreticisisin.
YKS'ye hazırlanan öğrencileri motive edecek, onlara odaklanma ve sınav taktikleri verecek Türkçe bir gönderi içeriği üretmeni istiyorum.

Güncel Durum: YKS'ye ${daysLeft} gün kaldı.

Bana JSON formatında şu alanları dön:
1. "quote": Gönderi görselinin üzerinde yazacak kısa, vurucu ve ilham verici bir cümle (En fazla 12-15 kelime).
2. "author": Bu sözün sahibi (Eğer anonim veya Rostrum Akademi ise "Rostrum Akademi" yaz).
3. "caption": Gönderinin altına eklenecek, öğrencileri harekete geçiren, Rostrum Akademi platformunun kolaylıklarından (haftalık program, deneme takibi vb.) da bahseden samimi bir açıklama yazısı ve hashtagler.

Lütfen sadece ham JSON çıktısı ver. Markdown formatı veya ek metin olmasın.
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.8 }
      })
    });

    if (!response.ok) throw new Error('Gemini API hatası');
    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);
  } catch (error) {
    console.error('Gemini içerik üretimi başarısız, varsayılan içerik kullanılıyor:', error);
    return {
      quote: "Büyük işler başarmak için sadece harekete geçmek yetmez, önce inanmak gerekir.",
      author: "Anatole France",
      caption: `YKS'ye son ${daysLeft} gün! Hayallerine giden yolda Rostrum Akademi ile programını yap, ilerlemeni grafiklerle izle. 📊 #yks2026 #ykssayac #derscalismagunlugu`
    };
  }
}

// ── 2. PREMIUM GÖRSEL OLUŞTURMA (SVG RENDER) ───────────────
// Rostrum Akademi kurumsal kimliğine uygun (koyu arka plan, altın/mor gradyan) SVG üretir
function generateSvgImage(daysLeft, quote, author) {
  // quote kelimelerini satırlara böl (görselde taşmaması için)
  const words = quote.split(' ');
  let lines = [];
  let currentLine = '';
  words.forEach(w => {
    if ((currentLine + ' ' + w).length > 25) {
      lines.push(currentLine);
      currentLine = w;
    } else {
      currentLine = currentLine ? currentLine + ' ' + w : w;
    }
  });
  if (currentLine) lines.push(currentLine);

  // İlk 3 satırı göster
  lines = lines.slice(0, 3);

  const textElements = lines.map((line, idx) => 
    `<text x="540" y="${480 + (idx * 60)}" text-anchor="middle" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="38" font-weight="600" letter-spacing="-0.5">${line}</text>`
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
    <!-- Premium Mesh Gradient Arka Plan -->
    <rect width="1080" height="1080" fill="#07060a"/>
    <defs>
      <radialGradient id="mesh1" cx="20%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#f0a500" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#07060a" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="mesh2" cx="80%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#c084fc" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#07060a" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f0a500"/>
        <stop offset="100%" stop-color="#c084fc"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1080" fill="url(#mesh1)"/>
    <rect width="1080" height="1080" fill="url(#mesh2)"/>

    <!-- Estetik Grid Lines -->
    <path d="M 0,180 L 1080,180 M 0,900 L 1080,900 M 180,0 L 180,1080 M 900,0 L 900,1080" stroke="#ffffff" stroke-opacity="0.02" stroke-width="1.5"/>

    <!-- Üst Başlık & Logo -->
    <text x="540" y="120" text-anchor="middle" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="24" font-weight="800" letter-spacing="4">ROSTRUM AKADEMİ</text>
    <circle cx="540" cy="150" r="4" fill="#f0a500"/>

    <!-- YKS Sayaç Alanı -->
    <g transform="translate(540, 290)">
      <!-- Arka Plan Halkası -->
      <circle cx="0" cy="0" r="95" fill="none" stroke="#2d2a3a" stroke-width="3"/>
      <circle cx="0" cy="0" r="95" fill="none" stroke="url(#textGrad)" stroke-width="6" stroke-dasharray="600" stroke-dashoffset="150"/>
      
      <!-- Sayaç Rakamı -->
      <text x="0" y="12" text-anchor="middle" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="68" font-weight="900" letter-spacing="-2">${daysLeft}</text>
      <text x="0" y="42" text-anchor="middle" fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="12" font-weight="700" letter-spacing="2">GÜN KALDI</text>
    </g>

    <!-- Motivasyon Sözü -->
    <g>
      <!-- Tırnak İşareti -->
      <text x="540" y="420" text-anchor="middle" fill="#f0a500" font-family="Georgia, serif" font-size="120" font-weight="800" fill-opacity="0.25">“</text>
      
      <!-- Dinamik Metin -->
      ${textElements}
      
      <!-- Yazar -->
      <text x="540" y="${530 + (lines.length * 60)}" text-anchor="middle" fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="18" font-weight="500" font-style="italic">— ${author}</text>
    </g>

    <!-- Alt Bilgi / Web Adresi -->
    <rect x="420" y="960" width="240" height="36" rx="18" fill="#17151e" stroke="#2d2a3a" stroke-width="1"/>
    <text x="540" y="984" text-anchor="middle" fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="13" font-weight="600" letter-spacing="1">rostrumakademi.app</text>
  </svg>`;
}

// ── 3. RESMİ BULUT DEPOSUNA YÜKLEME (SUPABASE STORAGE) ───────
async function uploadImageToStorage(svgContent) {
  // SVG dosyasını geçici olarak kaydet ve PNG/JPEG servisi veya doğrudan SVG olarak buluta at
  const fileName = `daily-post-${Date.now()}.svg`;
  
  // Supabase Storage'a yükle
  const { data, error } = await supabase.storage
    .from('platform_assets') // Bu isimde bir public bucket olmalıdır
    .upload(`instagram_posts/${fileName}`, svgContent, {
      contentType: 'image/svg+xml',
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  // Public URL al
  const { data: { publicUrl } } = supabase.storage
    .from('platform_assets')
    .getPublicUrl(`instagram_posts/${fileName}`);

  return publicUrl;
}

// ── 4. INSTAGRAM GRAPH API PAYLAŞIM ───────────────────────
async function publishToInstagram(imageUrl, caption) {
  if (INSTAGRAM_ACCOUNT_ID === 'YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID') {
    console.log('[Instagram] Mock Mode: Instagram kimlik bilgileri eksik. Yüklenecek resim URL:', imageUrl);
    return { success: true, mock: true };
  }

  // 1. Adım: Container Oluştur
  const containerUrl = `https://graph.facebook.com/v12.0/${INSTAGRAM_ACCOUNT_ID}/media`;
  const containerRes = await fetch(containerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: INSTAGRAM_ACCESS_TOKEN
    })
  });

  const containerData = await containerRes.json();
  if (containerData.error) throw new Error(`Container hatası: ${containerData.error.message}`);
  
  const creationId = containerData.id;

  // 2. Adım: Yayınla
  const publishUrl = `https://graph.facebook.com/v12.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`;
  const publishRes = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: INSTAGRAM_ACCESS_TOKEN
    })
  });

  const publishData = await publishRes.json();
  if (publishData.error) throw new Error(`Publish hatası: ${publishData.error.message}`);

  return { success: true, id: publishData.id };
}

// ── ANA TETİKLEYİCİ FONKSİYON ──────────────────────────────
async function runAgent() {
  console.log('--- Rostrum Akademi Instagram Ajanı Çalışıyor ---');
  try {
    const daysLeft = getDaysLeftToYks();
    console.log(`[Sayaç] YKS'ye kalan gün: ${daysLeft}`);

    console.log('[Gemini] İçerik ve açıklama metinleri üretiliyor...');
    const postData = await generatePostContent(daysLeft);
    console.log(`[İçerik] Söz: "${postData.quote}" - Yazar: ${postData.author}`);

    console.log('[Görsel] SVG şablonu oluşturuluyor...');
    const svgContent = generateSvgImage(daysLeft, postData.quote, postData.author);

    console.log('[Storage] Görsel Supabase Storage\'a yükleniyor...');
    const publicUrl = await uploadImageToStorage(svgContent);
    console.log(`[Bulut] Görsel URL: ${publicUrl}`);

    console.log('[Instagram] Gönderi paylaşılıyor...');
    const result = await publishToInstagram(publicUrl, postData.caption);
    
    if (result.success) {
      console.log('🎉 Gönderi Instagram\'da başarıyla paylaşıldı! ID:', result.id || 'MOCK');
    }
  } catch (error) {
    console.error('❌ Ajan çalışırken kritik hata oluştu:', error);
  }
}

// Ajanı doğrudan çalıştır
runAgent();
