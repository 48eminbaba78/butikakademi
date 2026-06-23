// ═══════════════════════════════════════════════════════════
// ROSTRUM AKADEMI — INSTAGRAM COMMENTS & DM WEBHOOK
// Endpoint: /api/instagram-webhook
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SB_URL = 'https://imyhenrwmsmyikpollur.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34';
const db = createClient(SB_URL, SB_KEY);

const WEBHOOK_VERIFY_TOKEN = 'rostrum_webhook_verify_token_2026';

export default async function handler(req, res) {
  // ── 1. GET Request: Webhook Verification ──
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
        console.log('[Webhook] Webhook successfully verified.');
        return res.status(200).send(challenge);
      } else {
        return res.status(403).send('Forbidden: Token mismatch');
      }
    }
    return res.status(400).send('Bad Request');
  }

  // ── 2. POST Request: Meta Webhook Event Received ──
  if (req.method === 'POST') {
    const body = req.body;

    // Check if it is an Instagram event
    if (body.object === 'instagram') {
      try {
        // Token'ı Supabase'den oku
        const { data: credData } = await db.from('platform_settings').select('value').eq('key', 'instagram_credentials').maybeSingle();
        const accessToken = credData?.value?.instagram_access_token;
        if (!accessToken) {
          console.error('[Webhook] Access token bulunamadı');
          return res.status(200).json({ status: 'no_token' });
        }

        // Fetch automation rules
        const { data: rulesData } = await db.from('platform_settings').select('value').eq('key', 'instagram_automation_rules').maybeSingle();
        const rules = (rulesData && rulesData.value) || [];

        // Iterate through entries and changes
        for (const entry of body.entry || []) {
          for (const change of entry.changes || []) {
            const value = change.value;
            const field = change.field;

            // Handle new comments
            if (field === 'comments' && value && value.id) {
              const commentId = value.id;
              const text = (value.text || '').trim().toUpperCase();
              const username = value.from ? value.from.username : '';

              console.log(`[Webhook] Comment received from @${username}: "${value.text}" on media_id: ${value.media_id}`);

              // Yorumun içinde trigger kelimesi geçiyor mu kontrol et
              const matchingRule = rules.find(r => text.includes(r.trigger.toUpperCase()));

              if (matchingRule) {
                console.log(`[Webhook] Match found for trigger "${matchingRule.trigger}"! Executing actions...`);

                // Action A: Post public comment reply
                const commentReplyUrl = `https://graph.facebook.com/v20.0/${commentId}/replies`;
                const replyCommentRes = await fetch(commentReplyUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    message: matchingRule.reply_comment,
                    access_token: accessToken
                  })
                });
                const replyCommentData = await replyCommentRes.json();
                if (replyCommentData.error) {
                  console.error('[Webhook] Failed to reply comment:', replyCommentData.error.message);
                } else {
                  console.log('[Webhook] Public reply sent:', replyCommentData.id);
                }

                // Action B: Send private DM to user who commented
                const dmUrl = `https://graph.facebook.com/v20.0/me/messages?access_token=${accessToken}`;
                const dmRes = await fetch(dmUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    recipient: {
                      comment_id: commentId
                    },
                    message: {
                      text: matchingRule.send_dm
                    }
                  })
                });
                const dmData = await dmRes.json();
                if (dmData.error) {
                  console.error('[Webhook] Failed to send private DM:', dmData.error.message);
                } else {
                  console.log('[Webhook] Private DM sent to user.');
                }
              }
            }
          }
        }
        
        return res.status(200).json({ status: 'success' });
      } catch (err) {
        console.error('[Webhook] Processing error:', err);
        return res.status(500).json({ message: 'Internal processing error' });
      }
    }

    return res.status(200).json({ status: 'ignored' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
