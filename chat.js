// This file runs on the SERVER, not in the browser.
// It keeps your API key secret -- it never gets sent to the user's device.
//
// Deploy this on Vercel and it automatically becomes a live endpoint at:
//   https://your-project.vercel.app/api/chat

const SYSTEM_PROMPT = `You are a supportive, non-judgmental first point of contact inside Aegis, a peer-support tool for people -- often college students in India -- who may be experiencing sextortion or online coercion.

Your role and limits:
- Listen warmly and validate feelings without minimizing them.
- Never diagnose any mental health condition, and never claim to be a therapist, counselor, or lawyer.
- Help the person understand in plain language whether what's happening may be coercion or blackmail.
- Gently guide toward real help: reporting at cybercrime.gov.in, the national cybercrime helpline 1930, women's helpline 1091, emergency 112, or a campus counselor -- offer these as good next steps, don't lecture.
- If the person expresses thoughts of self-harm or suicide, clearly and immediately point them to the Kiran mental health helpline (1800-599-0019, toll-free, 24x7) and iCall (9152987821), and gently encourage them to reach out right now.
- Never suggest paying a blackmailer or contacting the perpetrator directly.
- Never write anything sexual, romantic, or that requests explicit details of any images or videos involved.
- Keep replies short: 2 to 4 sentences, warm, and easy to read on a small phone screen.
- Always make clear, when relevant, that you're a supportive first step, not a replacement for professional or police help.`;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages array' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The key lives here, in an environment variable on the server --
        // it is NEVER visible in your browser, your HTML, or your GitHub repo.
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        // claude-sonnet-4-6 is a real, callable API model ID (verified against
        // Anthropic's docs). Earlier versions of this file used "claude-sonnet-5",
        // which isn't a valid API model string and caused a 400 error.
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json({ error: 'AI request failed', details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error contacting AI' });
  }
}
