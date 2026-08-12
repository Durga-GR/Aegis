let subscriptions = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  subscriptions.push(req.body);
  res.status(200).json({ saved: true });
}

export function getSubscriptions() {
  return subscriptions;
}
