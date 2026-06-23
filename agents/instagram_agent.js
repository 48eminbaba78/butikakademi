// ═══════════════════════════════════════════════════════════
// BUTIK AKADEMI — INSTAGRAM AUTOMATION & GROWTH AGENT
// Bu script, günlük motivasyon sözleri ve YKS sınav sayacı içerikleri üretir,
// görselleştirir ve Instagram Graph API üzerinden otomatik paylaşım yapar.
// ═══════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Resvg } from '@resvg/resvg-js';

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

// Günün gününe göre otomatik içerik tipini belirle
function selectContentType() {
  const day = new Date().getDay();
  // 0: Pazar, 1: Pazartesi, 2: Salı, 3: Çarşamba, 4: Perşembe, 5: Cuma, 6: Cumartesi
  if (day === 1 || day === 4) {
    return 'tactic';
  } else if (day === 3) {
    return 'comparison';
  } else if (day === 5 || day === 6) {
    return 'seasonal';
  } else {
    return 'countdown';
  }
}

// Gemini API'den Türkçe Motivasyon Sözü veya Çalışma İpucu Alır
async function generatePostContent(daysLeft) {
  const contentType = selectContentType();

  if (!GEMINI_API_KEY) {
    return {
      type: contentType,
      title: contentType === 'tactic' ? "KOÇLUK İŞİNİZİ BÜYÜTÜN" : "YENİ NESİL YÖNETİM",
      subtitle: contentType === 'tactic' ? "Öğrenci Sayınızı Katlayacak 3 Adım" : "Dijital Dönüşüm Zamanı",
      quote: "İyi bir koç öğrencilerini, harika bir koç ise zamanını yönetir.",
      author: "Rostrum Akademi",
      caption: `Koçluk işinizi büyütmek ve haftada 10 saat kazanmak için Rostrum Akademi SaaS altyapısını keşfedin. Ücretsiz deneme için profilimizdeki linke tıklayın! 🚀 #eğitimkoçluğu #ykskoçluğu #edtech`,
      points: [
        { title: "Süreci Otomatikleştirin", desc: "Haftalık planları saniyeler içinde oluşturun ve zaman kazanın." },
        { title: "Veli İletişimini Çözün", desc: "Tek tıkla PDF raporlar oluşturarak velilere profesyonel sunum yapın." },
        { title: "Kapasitenizi Artırın", desc: "Dijital altyapı sayesinde daha fazla öğrenciye üst düzey koçluk verin." }
      ]
    };
  }

  const prompt = `
Sen Rostrum Akademi'nin (@rostrumakademi) popüler Instagram sayfası için profesyonel bir içerik üreticisisin.
Biz eğitim kurumlarına, butik dershanelere ve eğitim koçlarına yönelik yeni nesil bir CRM ve eğitim yönetim yazılımı (SaaS) satıyoruz.
Hedef kitlemiz olan kurucular, öğretmenler ve eğitim koçlarını platformumuzu kullanmaya ikna edecek, onların işlerini nasıl kolaylaştırdığımızı anlatacak Türkçe bir gönderi içeriği üretmeni istiyorum.

Güncel Durum: YKS'ye ${daysLeft} gün kaldı. (Bu bilgiyi koçlara "öğrencileriniz için zaman daralıyor, işinizi hızlandırın" mesajı vermek için kullanabilirsin)
Seçilen İçerik Tipi: "${contentType}"

Lütfen aşağıdaki kurallara göre sadece ham JSON formatında yanıt dön:

1. Eğer tip "countdown" ise:
   - Görsel üzerinde yazacak kısa, koçları ve kurucuları motive edecek, işlerini büyütmeye odaklı bir söz ("quote") ve bu sözün sahibini ("author") belirle.
   - caption: Koçları yazılımımızı 14 gün ücretsiz denemeye davet eden, harekete geçirici bir metin yaz.

2. Eğer tip "tactic" ise:
   - Eğitim koçluğu işini büyüten, zaman kazandıran veya kurumsallaşmayı sağlayan 3 taktik önerisi üret.
   - "title" olarak dikkat çekici bir başlık seç (Örn: "KOÇLUK İŞİNİZİ BÜYÜTÜN", "VELİ MEMNUNİYETİ").
   - "subtitle" olarak genel bir alt başlık belirle (Örn: "Öğrenci Sayınızı Katlayacak 3 Adım").
   - "points": 3 adet taktik içeren liste dön. Her bir point nesnesi "title" (taktik başlığı) ve "desc" (taktik açıklaması, maksimum 15 kelime) alanlarını içermeli.

3. Eğer tip "comparison" ise:
   - Eski tip çalışmak (Excel, kağıt program, WhatsApp dağınıklığı) ile Rostrum Akademi yazılımının özellikleri (dijital takip, veli PDF raporu, CRM) karşılaştırılsın.
   - "title": "BÜYÜK KARŞILAŞTIRMA".
   - "subtitle": "Klasik Yöntemler vs Rostrum Akademi SaaS".
   - "quote": Akılda kalıcı, dönüşüm odaklı slogan.

4. Eğer tip "seasonal" ise:
   - Döneme (YKS'ye kalan süreye vs.) uygun olarak koçların iş yükünü nasıl hafifleteceğimize dair bir rehber üret.
   - "title": Mevsime/Döneme uygun başlık (Örn: "SON AYLARDA ZAMAN YÖNETİMİ").
   - "subtitle": Konu başlığı (Örn: "Koçlar İçin Kriz Yönetimi").
   - "points": 3 adet tavsiye içeren liste dön.

Ortak Alanlar (Tüm tiplerde zorunlu):
- "type": "${contentType}"
- "quote": Kısa vurucu bir slogan veya söz (En fazla 12 kelime).
- "author": "Rostrum Akademi" veya ilgili yazar.
- "caption": Gönderinin altına eklenecek, platformumuzun SaaS avantajlarını (zaman tasarrufu, kurumsallık) öne çıkaran, Call to Action barındıran samimi açıklama metni ve hashtagler.

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
      type: contentType,
      title: contentType === 'tactic' ? "KOÇLUK İŞİNİZİ BÜYÜTÜN" : "YENİ NESİL YÖNETİM",
      subtitle: contentType === 'tactic' ? "Öğrenci Sayınızı Katlayacak 3 Adım" : "Dijital Dönüşüm Zamanı",
      quote: "İyi bir koç öğrencilerini, harika bir koç ise zamanını yönetir.",
      author: "Rostrum Akademi",
      caption: `Koçluk işinizi büyütmek ve haftada 10 saat kazanmak için Rostrum Akademi SaaS altyapısını keşfedin. Ücretsiz deneme için profilimizdeki linke tıklayın! 🚀 #eğitimkoçluğu #ykskoçluğu #edtech`,
      points: [
        { title: "Süreci Otomatikleştirin", desc: "Haftalık planları saniyeler içinde oluşturun ve zaman kazanın." },
        { title: "Veli İletişimini Çözün", desc: "Tek tıkla PDF raporlar oluşturarak velilere profesyonel sunum yapın." },
        { title: "Kapasitenizi Artırın", desc: "Dijital altyapı sayesinde daha fazla öğrenciye üst düzey koçluk verin." }
      ]
    };
  }
}

// ── 2. PREMIUM GÖRSEL OLUŞTURMA (SVG RENDER) ───────────────
// Rostrum Akademi kurumsal kimliğine uygun (koyu arka plan, altın/mor gradyan) SVG üretir
function generateSvgImage(postData, daysLeft) {
  const { type, title, subtitle, quote, author, points } = postData;
  
  // quote kelimelerini satırlara böl (görselde taşmaması için)
  const words = (quote || '').split(' ');
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
    `<text x="540" y="${640 + (idx * 60)}" text-anchor="middle" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="36" font-weight="600" letter-spacing="-0.5">${line}</text>`
  ).join('\n');

  // Base SVG wrapper
  const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
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
    <circle cx="540" cy="150" r="4" fill="#f0a500"/>`;

  const svgFooter = `
    <!-- Alt Bilgi / Web Adresi -->
    <rect x="420" y="960" width="240" height="36" rx="18" fill="#17151e" stroke="#2d2a3a" stroke-width="1"/>
    <text x="540" y="984" text-anchor="middle" fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="13" font-weight="600" letter-spacing="1">rostrumakademi.app</text>
  </svg>`;

  if (type === 'tactic' || type === 'seasonal') {
    const pts = points || [
      { title: "Planlı İlerleyin", desc: "Zayıf konularınızı haftalık olarak planlayıp ertelemeden bitirin." },
      { title: "Netlerinizi Kaydedin", desc: "Hatalarınızı analiz etmek için her sınav netinizi sisteme girin." },
      { title: "Kronometre Kullanın", desc: "Süre baskısını yönetmek için soru başı saniyelerinizi ölçün." }
    ];
    
    return `${svgHeader}
      <text x="540" y="220" text-anchor="middle" fill="#c084fc" font-family="'Outfit', sans-serif" font-size="20" font-weight="800" letter-spacing="3">${(title || 'TAKTIK').toUpperCase()}</text>
      <text x="540" y="270" text-anchor="middle" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="34" font-weight="900" letter-spacing="-0.5">${subtitle || ''}</text>
      
      <g transform="translate(140, 340)">
        <!-- Point 1 -->
        <g transform="translate(0, 0)">
          <rect width="800" height="130" rx="16" fill="#121018" stroke="#2d2a3a" stroke-width="1.5"/>
          <circle cx="50" cy="65" r="24" fill="#f0a500" fill-opacity="0.1"/>
          <text x="50" y="74" fill="#f0a500" font-family="'Outfit', sans-serif" font-size="26" font-weight="900" text-anchor="middle">1</text>
          <text x="100" y="48" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="22" font-weight="700">${pts[0]?.title || ''}</text>
          <text x="100" y="88" fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="16">${pts[0]?.desc || ''}</text>
        </g>
        
        <!-- Point 2 -->
        <g transform="translate(0, 170)">
          <rect width="800" height="130" rx="16" fill="#121018" stroke="#2d2a3a" stroke-width="1.5"/>
          <circle cx="50" cy="65" r="24" fill="#f0a500" fill-opacity="0.1"/>
          <text x="50" y="74" fill="#f0a500" font-family="'Outfit', sans-serif" font-size="26" font-weight="900" text-anchor="middle">2</text>
          <text x="100" y="48" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="22" font-weight="700">${pts[1]?.title || ''}</text>
          <text x="100" y="88" fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="16">${pts[1]?.desc || ''}</text>
        </g>
        
        <!-- Point 3 -->
        <g transform="translate(0, 340)">
          <rect width="800" height="130" rx="16" fill="#121018" stroke="#2d2a3a" stroke-width="1.5"/>
          <circle cx="50" cy="65" r="24" fill="#f0a500" fill-opacity="0.1"/>
          <text x="50" y="74" fill="#f0a500" font-family="'Outfit', sans-serif" font-size="26" font-weight="900" text-anchor="middle">3</text>
          <text x="100" y="48" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="22" font-weight="700">${pts[2]?.title || ''}</text>
          <text x="100" y="88" fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="16">${pts[2]?.desc || ''}</text>
        </g>
      </g>
    ${svgFooter}`;
  }

  if (type === 'comparison') {
    return `${svgHeader}
      <text x="540" y="220" text-anchor="middle" fill="#f0a500" font-family="'Outfit', sans-serif" font-size="20" font-weight="800" letter-spacing="3">BÜYÜK KARŞILAŞTIRMA</text>
      <text x="540" y="270" text-anchor="middle" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="34" font-weight="900">Klasik Kağıt Programlar vs Rostrum Akademi</text>
      
      <g transform="translate(100, 340)">
        <!-- Paper -->
        <g transform="translate(0, 0)">
          <rect width="400" height="520" rx="24" fill="#151214" stroke="#4a1a1f" stroke-width="2.5"/>
          <text x="200" y="70" text-anchor="middle" fill="#ff5c7a" font-family="'Outfit', sans-serif" font-size="28" font-weight="800">❌ KAĞIT PROGRAM</text>
          <circle cx="200" cy="170" r="50" fill="#ff5c7a" fill-opacity="0.1"/>
          <text x="200" y="182" text-anchor="middle" fill="#ff5c7a" font-family="'Outfit', sans-serif" font-size="36" font-weight="900">📝</text>
          <g fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="18" text-anchor="middle">
            <text x="200" y="290">• Çabuk kaybolur &amp; yırtılır</text>
            <text x="200" y="340">• Süre hesabı manuel yapılır</text>
            <text x="200" y="390">• Veliye raporlanamaz</text>
            <text x="200" y="440">• Sürekli zaman kaybettirir</text>
          </g>
        </g>
        
        <!-- Digital -->
        <g transform="translate(480, 0)">
          <rect width="400" height="520" rx="24" fill="#101815" stroke="#1f4a38" stroke-width="2.5"/>
          <text x="200" y="70" text-anchor="middle" fill="#3ecf8e" font-family="'Outfit', sans-serif" font-size="28" font-weight="800">✅ DİJİTAL PANEL</text>
          <circle cx="200" cy="170" r="50" fill="#3ecf8e" fill-opacity="0.1"/>
          <text x="200" y="182" text-anchor="middle" fill="#3ecf8e" font-family="'Outfit', sans-serif" font-size="36" font-weight="900">📱</text>
          <g fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="18" text-anchor="middle">
            <text x="200" y="290">• Kaybolmaz, ceptedir</text>
            <text x="200" y="340">• Akıllı süre tahmini yapar</text>
            <text x="200" y="390">• Veliye otomatik grafik iletir</text>
            <text x="200" y="440">• Koça haftada 4 saat kazandırır</text>
          </g>
        </g>
      </g>
    ${svgFooter}`;
  }

  // Fallback / Countdown layout
  return `${svgHeader}
    <!-- YKS Sayaç Alanı -->
    <g transform="translate(540, 360)">
      <!-- Arka Plan Halkası -->
      <circle cx="0" cy="0" r="130" fill="none" stroke="#2d2a3a" stroke-width="4"/>
      <circle cx="0" cy="0" r="130" fill="none" stroke="url(#textGrad)" stroke-width="8" stroke-dasharray="820" stroke-dashoffset="200"/>
      
      <!-- Sayaç Rakamı -->
      <text x="0" y="16" text-anchor="middle" fill="#f0eaf8" font-family="'Outfit', sans-serif" font-size="96" font-weight="900" letter-spacing="-3">${daysLeft}</text>
      <text x="0" y="58" text-anchor="middle" fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="16" font-weight="700" letter-spacing="3">GÜN KALDI</text>
    </g>

    <!-- Motivasyon Sözü -->
    <g>
      <!-- Tırnak İşareti -->
      <text x="540" y="570" text-anchor="middle" fill="#f0a500" font-family="Georgia, serif" font-size="140" font-weight="800" fill-opacity="0.25">“</text>
      
      <!-- Dinamik Metin -->
      ${textElements}
      
      <!-- Yazar -->
      <text x="540" y="${700 + (lines.length * 60)}" text-anchor="middle" fill="#a09ab8" font-family="'Outfit', sans-serif" font-size="22" font-weight="500" font-style="italic">— ${author || 'Rostrum Akademi'}</text>
    </g>
  ${svgFooter}`;
}

// ── 3. RESMİ BULUT DEPOSUNA YÜKLEME (SUPABASE STORAGE) ───────
// Supabase'den veya env'den kimlik bilgilerini çeker
async function getInstagramCredentials() {
  let accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  let accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accountId || accountId.includes('YOUR_INSTAGRAM') || !accessToken || accessToken.includes('YOUR_FACEBOOK')) {
    const { data } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'instagram_credentials')
      .maybeSingle();
      
    if (data && data.value) {
      accountId = data.value.instagram_account_id;
      accessToken = data.value.instagram_access_token;
    }
  }

  return { accountId, accessToken };
}

// ── 3. RESMİ BULUT DEPOSUNA YÜKLEME (SUPABASE STORAGE) ───────
async function uploadImageToStorage(svgContent) {
  // Render SVG to PNG
  console.log('[Render] SVG şablonu yüksek çözünürlüklü PNG görseline dönüştürülüyor...');
  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: 1080
    }
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const fileName = `daily-post-${Date.now()}.png`;
  
  // Supabase Storage'a PNG olarak yükle
  const { data, error } = await supabase.storage
    .from('platform_assets') // Bu isimde bir public bucket olmalıdır
    .upload(`instagram_posts/${fileName}`, pngBuffer, {
      contentType: 'image/png',
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
  const { accountId, accessToken } = await getInstagramCredentials();

  if (!accountId || !accessToken || accountId.includes('YOUR_INSTAGRAM') || accessToken.includes('YOUR_FACEBOOK')) {
    console.log('[Instagram] Mock Mode: Instagram kimlik bilgileri eksik. Yüklenecek resim URL:', imageUrl);
    return { success: true, mock: true };
  }

  // 1. Adım: Container Oluştur
  const containerUrl = `https://graph.facebook.com/v20.0/${accountId}/media`;
  const containerRes = await fetch(containerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken
    })
  });

  const containerData = await containerRes.json();
  if (containerData.error) throw new Error(`Container hatası: ${containerData.error.message}`);
  
  const creationId = containerData.id;

  // 2. Adım: Yayınla
  const publishUrl = `https://graph.facebook.com/v20.0/${accountId}/media_publish`;
  const publishRes = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken
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
    console.log(`[İçerik] Söz: "${postData.quote}" - Yazar: ${postData.author} - Tip: ${postData.type}`);

    console.log('[Görsel] SVG şablonu oluşturuluyor...');
    const svgContent = generateSvgImage(postData, daysLeft);

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
