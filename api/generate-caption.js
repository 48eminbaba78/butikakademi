export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type = 'reels_caption' } = req.body || {};

  const prompts = {
    reels_caption: `Rostrum Akademi için Instagram Reels caption yaz.
Bağlam: Türkiye'nin önde gelen YKS hazırlık dijital platformuyuz. Uygulama üzerinden ders takibi, koçluk ve soru çözümü yapılıyor.
Amaç: Platformumuzu tanıtmak, öğrencileri kayıt olmaya davet etmek.
Kurallar:
- Max 3 kısa satır metin (toplam 150 karakter altında)
- Güçlü, duygusal bir hook ile başla
- 1 net CTA: bio'daki linke tıkla veya DM'e "BAŞLA" yaz
- 8-10 alakalı Türkçe hashtag ekle
Sadece caption metnini döndür, başka hiçbir şey yazma.`,
  };

  const prompt = prompts[type] || prompts.reels_caption;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': (process.env.ANTHROPIC_API_KEY || '').trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return res.status(500).json({ error: 'AI hatası: ' + t.slice(0, 200) });
    }

    const data = await resp.json();
    const caption = (data.content || []).map(b => b.text || '').join('').trim();
    return res.status(200).json({ caption });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
