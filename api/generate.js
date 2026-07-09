import { isAuthed, generateForDate, trNow, trDateStr } from '../lib/core.js';
import { applyCors } from '../lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  // Caption üretimi — auth gerektirmez, POST body'de type:'reels_caption'
  if (req.method === 'POST' && req.body && req.body.type === 'reels_caption') {
    try {
      const prompt = `Rostrum Akademi için Instagram Reels caption yaz.
Bağlam: Türkiye'nin önde gelen YKS hazırlık dijital platformuyuz. Uygulama üzerinden ders takibi, koçluk ve soru çözümü yapılıyor.
Amaç: Platformumuzu tanıtmak, öğrencileri kayıt olmaya davet etmek.
Kurallar:
- Max 3 kısa satır metin (toplam 150 karakter altında)
- Güçlü, duygusal bir hook ile başla
- 1 net CTA: bio'daki linke tıkla veya DM'e "BAŞLA" yaz
- 8-10 alakalı Türkçe hashtag ekle
Sadece caption metnini döndür, başka hiçbir şey yazma.`;
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': (process.env.ANTHROPIC_API_KEY || '').trim(),
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 400,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!resp.ok) return res.status(500).json({ error: 'AI hatası ' + resp.status });
      const data = await resp.json();
      const caption = (data.content || []).map(b => b.text || '').join('').trim();
      return res.status(200).json({ caption });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (!isAuthed(req)) return res.status(401).json({ error: 'Yetkisiz' });
  try {
    var tomorrow = new Date(trNow().getTime() + 86400000);
    var dateStr = (req.query && req.query.date) || trDateStr(tomorrow);
    var force = req.query && req.query.force === '1';
    var idea = (req.query && req.query.idea ? String(req.query.idea) : '').slice(0, 600);
    var result = await generateForDate(dateStr, { force: force, idea: idea });
    return res.status(200).json(Object.assign({ date: dateStr }, result));
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
