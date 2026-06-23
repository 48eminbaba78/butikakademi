// ═══════════════════════════════════════════════════════════
// ROSTRUM AKADEMI — PDF/PRINT REPORT GENERATOR
// Endpoint: /api/generate-pdf-report
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SB_URL = 'https://imyhenrwmsmyikpollur.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34';
const db = createClient(SB_URL, SB_KEY);

export default async function handler(req, res) {
  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).send('<h1>Hata: studentId parametresi zorunludur.</h1>');
  }

  try {
    // 1. Veri Çekme
    const [{ data: student }, { data: tasks }, { data: exams }, { data: appts }] = await Promise.all([
      db.from('users').select('*, workspaces(brand_name, brand_color)').eq('id', studentId).maybeSingle(),
      db.from('tasks').select('*').eq('student_id', studentId),
      db.from('exams').select('*').eq('student_id', studentId),
      db.from('appointments').select('*').eq('student_id', studentId)
    ]);

    if (!student) {
      return res.status(404).send('<h1>Hata: Öğrenci bulunamadı.</h1>');
    }

    // 2. Metrik Hesaplamaları
    const totalTasks = tasks?.length || 0;
    const doneTasks = tasks?.filter(t => t.done)?.length || 0;
    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const brandName = student.workspaces?.brand_name || 'Rostrum Akademi';
    const brandColor = student.workspaces?.brand_color || '#f0a500';

    // Sınav Tipleri ve Net Ortalamaları
    const recentExams = exams?.slice(-5) || [];

    // 3. HTML Şablon Oluşturma
    const htmlReport = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${student.full_name} — Haftalık Gelişim Raporu</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 3rem;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid ${brandColor};
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.5rem;
      color: #0f172a;
    }
    .logo span {
      color: ${brandColor};
    }
    h1 {
      font-family: 'Syne', sans-serif;
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
    }
    .meta {
      font-size: 0.9rem;
      color: #64748b;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      background-color: #f8fafc;
    }
    .card-lbl {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }
    .card-val {
      font-family: 'Syne', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      color: #0f172a;
    }
    h2 {
      font-family: 'Syne', sans-serif;
      font-size: 1.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2rem;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 600;
      background-color: #dcfce7;
      color: #15803d;
    }
    .badge-pending {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    .print-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background-color: #0f172a;
      color: #ffffff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    @media print {
      .print-btn {
        display: none;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>

  <button class="print-btn" onclick="window.print()">🖨️ PDF Olarak Kaydet</button>

  <div class="header">
    <div>
      <h1>${student.full_name}</h1>
      <div class="meta">Hedef: <strong>${student.target || 'Belirtilmemiş'}</strong> | Tarih: <strong>${new Date().toLocaleDateString('tr-TR')}</strong></div>
    </div>
    <div class="logo">${brandName}</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-lbl">Görev Başarı Oranı</div>
      <div class="card-val" style="color: ${brandColor}">%${completionRate}</div>
      <div style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;">${doneTasks} tamamlanan / ${totalTasks} toplam görev</div>
    </div>
    <div class="card">
      <div class="card-lbl">Genel İlerleme</div>
      <div class="card-val">%${student.progress}</div>
      <div style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;">Sistem müfredat yüzdesi</div>
    </div>
    <div class="card">
      <div class="card-lbl">Girilen Denemeler</div>
      <div class="card-val">${exams?.length || 0}</div>
      <div style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;">Toplam takip edilen sınav</div>
    </div>
  </div>

  <h2>📊 Son Deneme Net Performansları</h2>
  ${recentExams.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th>Sınav Adı</th>
        <th>Tarih</th>
        <th>Sınav Türü</th>
        <th>Ders Bazlı Net Dağılımı</th>
      </tr>
    </thead>
    <tbody>
      ${recentExams.map(e => `
        <tr>
          <td><strong>${e.name}</strong></td>
          <td>${e.date}</td>
          <td><span class="badge" style="background-color: #eff6ff; color: #1d4ed8;">${e.exam_type}</span></td>
          <td>${Object.entries(e.nets || {}).map(([subject, net]) => `${subject}: <strong>${net}</strong>`).join(', ')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : '<p style="color: #64748b;">Henüz deneme kaydı bulunmuyor.</p>'}

  <h2>📅 Haftalık Ders Çalışma Planı Görevleri</h2>
  ${tasks && tasks.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th>Tarih</th>
        <th>Ders / Konu</th>
        <th>Tür</th>
        <th>Süre</th>
        <th>Durum</th>
      </tr>
    </thead>
    <tbody>
      ${tasks.slice(0, 15).map(t => `
        <tr>
          <td>${t.date}</td>
          <td><strong>${t.subject}</strong>${t.note ? `<br><span style="font-size: 11px; color: #64748b;">Not: ${t.note}</span>` : ''}</td>
          <td>${t.type}</td>
          <td>${t.duration} dk</td>
          <td><span class="badge ${t.done ? '' : 'badge-pending'}">${t.done ? 'Tamamlandı' : 'Bekliyor'}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : '<p style="color: #64748b;">Haftalık programda tanımlanmış görev bulunmuyor.</p>'}

</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(htmlReport);

  } catch (err) {
    console.error('PDF Report generator error:', err);
    return res.status(500).send(`<h1>Sunucu Hatası: ${err.message}</h1>`);
  }
}
