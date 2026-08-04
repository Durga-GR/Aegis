// This file runs on the SERVER, not in the browser.
// It keeps your Gemini API key secret -- it never gets sent to the user's device.
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

const MODEL = 'gemini-2.5-flash'; // free-tier eligible

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages array' });
  }

  // Gemini's REST API doesn't use {role:'user'/'assistant'}; it uses
  // {role:'user'/'model'} and wraps text in a "parts" array.
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // The key lives here, in an environment variable on the server --
          // it is NEVER visible in your browser, your HTML, or your GitHub repo.
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 300 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({ error: 'AI request failed', details: data });
    }

    // Reshape Gemini's response into the same {content:[{text}]} shape
    // the front-end already expects from the old Anthropic call, so
    // index.html's callAI() doesn't need to change at all.
    const text = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
    return res.status(200).json({ content: [{ text }] });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error contacting AI' });
  }
}
