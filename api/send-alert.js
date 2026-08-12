import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:you@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { subscription, location } = req.body;
  if (!subscription) return res.status(400).json({ error: 'No subscription provided' });

  const payload = JSON.stringify({
    title: 'Aegis Emergency Alert',
    body: `Alert triggered. Location: ${location || 'unavailable'}`
  });

  try {
    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ sent: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
