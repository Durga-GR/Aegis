import webpush from 'web-push';
import { Redis } from '@upstash/redis';
 
const redis = Redis.fromEnv();
 
webpush.setVapidDetails(
  'mailto:you@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
 
// Looks up every trusted contact who has enabled alerts for this victim,
// and pushes a real notification (with location) to each of their phones.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  const { victimId, location } = req.body || {};
  if (!victimId) return res.status(400).json({ error: 'No victimId provided' });
 
  let subsMap = {};
  try {
    subsMap = (await redis.hgetall(`aegis:subs:${victimId}`)) || {};
  } catch (err) {
    return res.status(500).json({ error: 'Could not read subscriptions: ' + err.message });
  }
 
  const entries = Object.entries(subsMap);
  if (!entries.length) {
    // No trusted contact has accepted an invite and enabled alerts yet.
    return res.status(200).json({ sent: 0, failed: 0, note: 'No subscribed contacts yet.' });
  }
 
  const payload = JSON.stringify({
    title: 'Aegis Emergency Alert',
    body: `A trusted contact may be in danger. Location: ${location || 'unavailable'}`
  });
 
  let sent = 0, failed = 0;
  await Promise.all(entries.map(async ([contactId, subJson]) => {
    try {
      const subscription = typeof subJson === 'string' ? JSON.parse(subJson) : subJson;
      await webpush.sendNotification(subscription, payload);
      sent++;
    } catch (err) {
      failed++;
      // Subscription is dead/expired (contact revoked permission, uninstalled, etc) -- clean it up.
      if (err.statusCode === 404 || err.statusCode === 410) {
        try { await redis.hdel(`aegis:subs:${victimId}`, contactId); } catch (e) {}
      }
    }
  }));
 
  res.status(200).json({ sent, failed });
}
 



