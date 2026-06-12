export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const url = "https://bilgisarmal.frns.in/mobile_solved/mobile_watch.php?app=vvx&os=web&ln=tr&action=source_list&id=1";

  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9",
        "Referer": "https://bilgisarmal.frns.in/",
      }
    });
    const text = await r.text();
    res.status(200).json({ status: r.status, ok: r.ok, body: text.slice(0, 500) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
