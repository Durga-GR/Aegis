import { Redis } from '@upstash/redis';
 
const redis = Redis.fromEnv();
 
// Saves a trusted contact's push subscription, tied to the victim who
// invited them. Stored as a Redis hash: aegis:subs:<victimId> -> { <contactId>: subscriptionJSON }
// so that later, send-alert.js can look up "everyone subscribed for this victim".
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  const { victimId, contactId, subscription } = req.body || {};
  if (!victimId || !contactId || !subscription) {
    return res.status(400).json({ error: 'Missing victimId, contactId, or subscription' });
  }
 
  try {
    await redis.hset(`aegis:subs:${victimId}`, { [contactId]: JSON.stringify(subscription) });
    res.status(200).json({ saved: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
