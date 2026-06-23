// ═══════════════════════════════════════════════════════════
// ROSTRUM AKADEMI — EMAIL DISPATCHER & LINK TRACKING API
// Endpoint: /api/send-email
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SB_URL = 'https://imyhenrwmsmyikpollur.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34';
const db = createClient(SB_URL, SB_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { leadId, pitchText } = req.body;

  if (!leadId || !pitchText) {
    return res.status(400).json({ message: 'leadId and pitchText are required' });
  }

  try {
    // 1. Fetch Lead details from Supabase
    const { data: lead, error: leadErr } = await db
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .maybeSingle();

    if (leadErr || !lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // 2. Parse Subject and Email Body from Pitch Text
    const lines = pitchText.split('\n');
    let subject = 'Rostrum Akademi Davetiyesi';
    let bodyText = pitchText;

    const subjectLine = lines.find(l => l.toLowerCase().startsWith('konu:'));
    if (subjectLine) {
      subject = subjectLine.replace(/konu:/i, '').trim();
      bodyText = lines.filter(l => !l.toLowerCase().startsWith('konu:')).join('\n').trim();
    }

    // 3. Construct Trackable Link
    const protocol = req.headers.host.includes('localhost') ? 'http' : 'https';
    const clickUrl = `${protocol}://${req.headers.host}/index.html?lead_id=${leadId}`;

    // Format body with HTML line breaks and append trackable CTA link
    const formattedHtml = `
      <div style="font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
        ${bodyText.replace(/\n/g, '<br>')}
        <br><br>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <div style="text-align: center; margin: 20px 0;">
          <a href="${clickUrl}" style="background-color: #f0a500; color: #07060a; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Sistemi Canlı İnceleyin →
          </a>
        </div>
      </div>
    `;

    // 4. Send Email via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

    if (!resendApiKey) {
      // API Key missing: Simulate successful delivery in developer log and update status
      console.warn('[Resend] RESEND_API_KEY missing! Simulating successful dispatch.');
      await db.from('leads').update({
        pitch_text: pitchText,
        status: 'contacted'
      }).eq('id', leadId);
      
      return res.status(200).json({ 
        success: true, 
        simulated: true, 
        message: 'Dispatched in mock mode. Set RESEND_API_KEY environment variable to activate real sending.' 
      });
    }

    const resendUrl = 'https://api.resend.com/emails';
    const resendRes = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Rostrum Akademi <${senderEmail}>`,
        to: [lead.email],
        subject: subject,
        html: formattedHtml
      })
    });

    const resendData = await resendRes.json();

    if (resendRes.ok) {
      // 5. Update Status in Supabase on success
      await db.from('leads').update({
        pitch_text: pitchText,
        status: 'contacted'
      }).eq('id', leadId);

      return res.status(200).json({ success: true, resendId: resendData.id });
    } else {
      console.error('[Resend Error]', resendData);
      return res.status(resendRes.status).json({ message: 'Resend API failed: ' + (resendData.message || resendRes.statusText) });
    }

  } catch (err) {
    console.error('Send email API error:', err);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
}
