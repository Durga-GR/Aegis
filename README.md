# Aegis 🎮🛡️

**A covert digital safety companion against sextortion and online coercion, disguised as a fully playable game.**


## The Problem

Sextortion is one of the fastest-growing cybercrimes in India — and most victims never report it, because asking for help means someone might see them do it. Existing safety apps are visible, generic panic-button tools that aren't built for the prolonged, psychologically manipulative nature of sextortion, and victims often don't know which authorities to approach or what evidence to preserve.

## The Idea

**Aegis is a mobile game.** It looks and plays exactly like a casual Flappy-Bird-style game called *Sky Hopper* — full leaderboard, shop, sound, the works. Hidden underneath it is a complete safety system: silent emergency triggers, evidence logging, legal/reporting guidance, and a supportive chatbot — all reachable only if you know how, without ever opening anything that looks like a "safety app."

## How It's Disguised

| What it looks like | What it actually is |
|---|---|
| A friends/co-op invite list | Your emergency contacts |
| A "quick phrase" voice command | Your spoken safe-word trigger |
| A "power move" combo you tap out | Your silent tap-pattern trigger |
| Long-pressing the score | Opens Settings (contact/trigger setup) |
| Long-pressing the game character | Opens a private support chat |

## Features

- 🎮 **Fully playable game** — not a mockup; real physics, scoring, difficulty levels, coins, a shop, and a leaderboard
- 🤫 **Two silent triggers** — a tap-pattern "combo" and a spoken "quick phrase," both detected live during normal gameplay without visibly interrupting it
- 📍 **Emergency response** — logs a timestamped alert with real GPS location and your saved contacts
- 📓 **Evidence log** — exportable as a plain-text file, ready to support a police complaint
- 📖 **Guidance** — step-by-step reporting instructions (cybercrime.gov.in, helplines 1930 / 1091 / 112), and plain-language explanations of IT Act 67/67A and BNS 356
- 💬 **Support chatbot** — a warm, non-judgmental first point of contact, with immediate escalation to real crisis helplines if risk language comes up
- 🧪 **Built-in diagnostics** — an in-app test suite that verifies the trigger logic, logging, and chat routing actually work
- ▶️ **Guided demo mode** — one click walks through every feature automatically, for live presentations

## Project Structure

```
aegis/
├── index.html          → the full app (game + hidden safety system)
├── api/
│   └── chat.js          → serverless function powering the AI support chat
├── package.json
├── docs/
│   ├── Aegis_Proposal.docx
│   ├── Aegis_Demo_Script.docx
│   └── Aegis_Test_Plan.docx
└── README.md
```

## Running It

**Just the game (no AI chat, works instantly, no setup):**
Open `index.html` directly in any browser, or visit the GitHub Pages link below.

**With the real AI-powered support chat:**
The chatbot calls Claude via a small serverless backend that keeps the API key private. To run this part yourself:
1. Get an API key at [console.anthropic.com](https://console.anthropic.com)
2. Deploy this repo on [Vercel](https://vercel.com) (free tier is enough)
3. Add your key in Vercel → Settings → Environment Variables as `ANTHROPIC_API_KEY`
4. Redeploy — your live link will now have a fully working AI chat

Without a deployed backend, the chat still works using rule-based fallback logic — the game and every other feature (triggers, alerts, guide, diagnostics) work regardless.

## Honest Limitations (by design, not bugs)

This is a browser-based prototype built for a hackathon demo. A few things are shown as logic/UI here but would need a native mobile app to be fully real:
- **Alerts are logged, not transmitted** — a webpage can't send real SMS or push notifications; that would use native APIs in a real app.
- **Voice detection needs an explicit mic permission and button press** — true silent, always-on listening needs native OS-level permissions.
- **State resets on page refresh** — browser artifacts can't use persistent storage; a real app would save this properly on-device.

## What Makes Aegis Different

Covert safety apps and vault-style disguised apps already exist, but usually either hide personal data or send a generic panic alert. Aegis combines a **fully playable game disguise**, a **dual silent-trigger system**, **automatic evidence packaging aligned with Indian law**, and a **private AI support layer** — built specifically around the psychological and legal realities of sextortion, not general physical safety threats.


