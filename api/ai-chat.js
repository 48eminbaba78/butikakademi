// ═══════════════════════════════════════════════════════════
// ROSTRUM AKADEMI — AI KOÇ ASİSTANI (Vercel Serverless Function)
// Endpoint: /api/ai-chat
// Groq API proxy (llama-3.3-70b) — hızlı ve ücretsiz
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SB_URL = process.env.SUPABASE_URL || 'https://imyhenrwmsmyikpollur.supabase.co';
const SB_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34';
const db = createClient(SB_URL, SB_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, context, userRole, imageBase64, mimeType, text } = req.body;

    // ── Görsel varsa Gemini Vision kullan ───────────────────
    if (imageBase64) {
      let GEMINI_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_KEY) {
        try {
          const { data } = await db.from('platform_settings').select('value').eq('key', 'ai_settings').maybeSingle();
          GEMINI_KEY = data?.value?.gemini_api_key;
        } catch(e) {}
      }
      if (!GEMINI_KEY) return res.status(500).json({ error: 'Gemini API anahtarı yapılandırılmamış.' });

      const sysPrompt = buildVisionPrompt(context, userRole);
      const userText = text || 'Bu soruyu çöz.';
      const contents = [
        { role: 'user', parts: [{ text: sysPrompt }] },
        { role: 'model', parts: [{ text: 'Anladım, soruyu çözeceğim.' }] },
        { role: 'user', parts: [
          { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } },
          { text: userText }
        ]}
      ];
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents, generationConfig: { temperature: 0.4, maxOutputTokens: 2048 } }) }
      );
      if (!geminiRes.ok) {
        const e = await geminiRes.json().catch(() => ({}));
        return res.status(502).json({ error: e?.error?.message || 'Gemini hatası' });
      }
      const gd = await geminiRes.json();
      const reply = gd?.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt üretilemedi.';
      return res.status(200).json({ reply, model: 'gemini-1.5-flash' });
    }

    // ── Metin: Groq / LLaMA ─────────────────────────────────
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Mesaj listesi boş olamaz.' });
    }

    let GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      const { data: aiSettings } = await db
        .from('platform_settings')
        .select('value')
        .eq('key', 'ai_settings')
        .maybeSingle();
      GROQ_KEY = aiSettings?.value?.groq_api_key;
    }

    if (!GROQ_KEY) {
      return res.status(500).json({ error: 'AI API anahtarı yapılandırılmamış.' });
    }

    // ── Sistem Promptu ──────────────────────────────────────
    const systemPrompt = buildSystemPrompt(context, userRole);

    // ── Groq API İsteği (OpenAI uyumlu) ─────────────────────
    const groqMessages = [{ role: 'system', content: systemPrompt }];
    for (const msg of messages) {
      groqMessages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 2048,
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      return res.status(502).json({ error: 'Yapay zeka servisi şu anda yanıt veremiyor.' });
    }

    const groqData = await groqResponse.json();
    const reply = groqData?.choices?.[0]?.message?.content || 'Üzgünüm, bir yanıt üretemedi.';

    return res.status(200).json({
      reply,
      model: 'llama-3.3-70b-versatile',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('AI Chat error:', err);
    return res.status(500).json({ error: 'Sunucu hatası: ' + (err.message || 'Bilinmeyen hata') });
  }
}

// ── Vision Sistem Promptu ─────────────────────────────────
function buildVisionPrompt(context, userRole) {
  let base = `Sen Rostrum Akademi'nin uzman öğretmen yapay zekasısın. Türkiye eğitim sistemine (YKS/TYT/AYT, LGS) hakimsin.\n\nKESİNLİKLE YALNIZCA TÜRKÇE yanıt ver. İngilizce, Japonca, Çince veya başka hiçbir dil ya da karakter seti kullanma.`;
  if (userRole === 'student') {
    base += `\n\nÖğrenci sana bir soru fotoğrafı gönderdi. O sorunun konusunun uzman öğretmenisin.\nKURALLAR:\n1. Soruyu dikkatlice incele, konusunu belirle ve kısaca belirt.\n2. Çözümü adım adım, net ve öğretici dille yaz. Her adımı numaralandır.\n3. Formül veya kural kullandıysan neden kullandığını açıkla.\n4. Varsa yanlış seçeneklerin neden yanlış olduğunu belirt.\n5. Sonunda cevabı net yaz.`;
  } else {
    base += `\nKullanıcıya görseli analiz ederek yanıt ver.`;
  }
  if (context?.studentName) base += `\nÖğrenci: ${context.studentName}`;
  return base;
}

// ── Sistem Promptu Oluşturucu ─────────────────────────────
function buildSystemPrompt(context, userRole) {
  let base = `Sen "Rostrum Akademi Yapay Zeka Asistanı"sın. Türkiye'deki eğitim sistemine (YKS, LGS, KPSS, ALES) hakim, rolüne göre öğrencilere, velilere veya koçlara destek veren bir yapay zekasın.

KURALLAR (KESİNLİKLE UYULMASI ZORUNLU):
- YALNIZCA TÜRKÇE yanıt ver. İngilizce, Japonca, Çince veya başka HİÇBİR dil/karakter kullanma. Tek bir yabancı kelime bile yazma.
- Mesafeli ama kibar bir dil kullan
- Kısa ve öz yanıtlar ver, gereksiz uzatma
- Sorulara adım adım, net cevaplar ver`;

  if (userRole === 'student') {
    base += `\n\nÖĞRENCİ MODU (YAPAY ZEKA DERS ASİSTANI):
- Kendini her zaman net bir şekilde bir Yapay Zeka Ders Asistanı (makine) olarak tanıt. Asla insanmış gibi davranma. "Ben senin koçunum", "Ben senin rehberinim" deme.
- Kesinlikle duygusal veya motivasyonel koçluk yapma. Öğrencilere "Seni anlıyorum", "Seninle gurur duyuyorum" gibi duygusal/samimi ifadeler kullanma. Öğrenci motivasyon veya program önerisi isterse, bunu yapamayacağını belirt ve: "Ben sadece akademik konularda yardımcı olabilecek mekanik bir yapay zekayım. Bu konuyu kendi koçunla görüşmelisin." diyerek koçuna yönlendir.
- Sokratik Yöntemi Kullan: Öğrenci bir soruyu çözemediğini söylediğinde veya yardım istediğinde doğrudan cevabı veya tüm adımları hemen yazma! Adım adım ilerle, ipucu ver, öğrenciye açıklayıcı sorular sorarak onun doğru cevabı bulmasını sağla.
- Sadece mekanik destek ver: Soru çözümü, konu anlatımı, özet çıkarma ve mini testler yap. Ders programı oluşturmayı kesinlikle reddet ve koçuna yönlendir.`;
  } else if (userRole === 'parent') {
    base += `\n\nVELİ VE MÜŞTERİ DESTEK TEMSİLCİSİ MODU:
- Rostrum Akademi platformu ile ilgili özellikler (Hızlı SPA mimarisi, FullCalendar Ders Programı, Deneme Net Takibi, Konu Mastery 7 Yıldız sistemi ve AI asistan desteği) hakkında bilgi ver.
- Kullanıcıya saygılı, çözüm odaklı, kibar ve teknik konularda açıklayıcı yanıtlar sun.
- Çocuğunun gelişim durumunu veya platform işleyişini soran velilere yapıcı tavsiyeler ver.`;
  } else {
    base += `\n\nKOÇ MODU (YAPAY ZEKA COPILOT):
- Koça profesyonel bir meslektaş gibi davran (Hocam, Meslektaşım vb.)
- Veri odaklı analizler sun
- Öğrenci yönetimi ve pedagoji önerileri ver`;
  }

  // Context verisi varsa ekle
  if (context) {
    if (context.studentName) {
      base += `\n\nÖĞRENCİ BİLGİSİ: ${context.studentName}`;
    }
    if (context.examProfile) {
      base += `\nSINAV PROFİLİ: ${context.examProfile}`;
    }
    if (context.recentExams && context.recentExams.length > 0) {
      base += `\n\nSON DENEME SONUÇLARI:`;
      context.recentExams.forEach(exam => {
        base += `\n- ${exam.name} (${exam.date}): ${JSON.stringify(exam.nets)}`;
      });
    }
    if (context.taskCompletionRate !== undefined) {
      base += `\nGÖREV TAMAMLAMA ORANI: %${context.taskCompletionRate}`;
    }
    if (context.weeklyTaskCount !== undefined) {
      base += `\nBU HAFTA GÖREV SAYISI: ${context.weeklyTaskCount}`;
    }
    if (context.target) {
      base += `\nHEDEF: ${context.target}`;
    }
  }

  return base;
}
