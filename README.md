# SignalDrift

Probability-weighted market signals. Web PWA, installable to home screen, deployable to Vercel in 10 minutes.

> Built as a pre-seed pitch demo. Mock data today, real APIs in Phase 2.

---

## Run locally

You need Node 18 or newer.

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`). Open Chrome DevTools, toggle the device toolbar (Cmd-Shift-M on Mac, Ctrl-Shift-M on Windows), pick an iPhone preset. That's the experience your users get.

---

## Deploy to Vercel (free, 5 minutes)

### Option A — From the website (no terminal needed)

1. Push this folder to a new GitHub repo.
2. Go to **vercel.com**, sign up with GitHub.
3. Click **Add New → Project**, pick your repo.
4. Vercel auto-detects Vite. Just click **Deploy**.
5. You get a live URL like `signaldrift-xxx.vercel.app`. Share it.

### Option B — From the terminal

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Adding a custom domain

1. In Vercel dashboard → your project → **Settings → Domains**.
2. Add `signaldrift.ai` (buy it on Namecheap or Cloudflare first, around $15-20/yr).
3. Vercel shows you the DNS records to add at your registrar.
4. Done in 10 minutes once DNS propagates.

---

## What works today

- Full auth flow (signup / signin, localStorage-backed)
- Legal agreement gate, 8-slide tutorial, sector selection with free-tier limits
- Live-feeling market dashboard with sparklines and animated tick updates across 35 tickers
- Probability-weighted signals feed with confidence bars
- AI prediction screen (deterministic mock — same ticker = same forecast)
- News feed with sentiment filtering and watchlist filter
- 3-tier pricing (Free / Explorer / Max) with feature gates
- Installable as PWA on iOS and Android (Add to Home Screen)
- Works offline after first load

## What's mocked (Phase 2 swap-out)

| Feature | Mock today | Phase 2 |
|---|---|---|
| Stock quotes | `tickAll()` in `mockData.js` | Finnhub `/quote` endpoint via serverless function |
| News headlines | `MOCK_NEWS` array | Finnhub `/company-news` or NewsAPI |
| Signals | `MOCK_SIGNALS` array | Your own signal-generation backend |
| AI predictions | `generateMockPrediction()` | Gemini API via serverless function |
| Auth | localStorage | Supabase Auth (free tier) |
| Payments | Tier-switch button | Stripe Checkout |

All swap-points are isolated — each is one function or one file. No re-architecture needed.

---

## Project structure

```
src/
├── App.jsx                 # Router + onboarding gate
├── main.jsx                # Entry
├── context/
│   └── AppContext.jsx      # Auth, subscription, watchlist
├── lib/
│   ├── mockData.js         # All mock data + tick generator
│   └── useLiveQuotes.js    # Live-quotes hook (swap to real API here)
├── components/
│   ├── Icon.jsx            # Inline SVG icons
│   └── TabBar.jsx          # Bottom nav
├── screens/
│   ├── AuthScreen.jsx
│   ├── LegalScreen.jsx
│   ├── TutorialScreen.jsx
│   ├── SectorScreen.jsx
│   ├── MarketsScreen.jsx
│   ├── SignalsScreen.jsx
│   ├── PredictScreen.jsx
│   ├── NewsScreen.jsx
│   └── MoreScreen.jsx
└── styles/
    └── global.css          # Design tokens + base styles
```

---

## Demo script for VC meetings

A 90-second walkthrough that hits every key feature:

1. **Open URL** → land on Auth screen, gold "Live · Real-time US markets" badge animating
2. **Tap "Create account"**, enter name/email/password, tap **Create account**
3. **Legal screen** — scroll through risk disclosures, check the box, tap Continue (shows you care about compliance)
4. **Skip tutorial** with the Skip button (or click through dots to flex)
5. **Sector selection** — pick Technology, AI, Semiconductors. Note the "1 left" badge — that's your upsell hook
6. **Markets tab** — live tick updates every 2.2s, sparklines, sector chips, swipe down for watchlist
7. **Signals tab** — show the two visible signals, confidence bars, then **the locked-cards card** — "This is where free converts to paid"
8. **Predict tab** — tap NVDA, then TSLA, watch the AI generate a new forecast each time. Note the disclaimer
9. **News tab** — filter to Bullish, then Bearish. Talk about sentiment tagging
10. **More tab** → tap **Unlock more signals** → show pricing → tap **Max** → notice the badge on Account changes to gold "Max" → that's the conversion moment

---

## Important: rotate your API keys

Your `add-keys.sh` exposed real keys for Anthropic and Finnhub. Before doing anything else:

1. Go to `console.anthropic.com` → Settings → API Keys → **revoke** the exposed key, generate a new one
2. Go to `finnhub.io` → Dashboard → **revoke** the exposed key, generate a new one
3. Never commit keys to git. Use Vercel Environment Variables (Settings → Environment Variables) — keys live there, never in code

---

## Disclaimer

This app is built as a product demo. It is not a registered investment adviser, broker-dealer, or financial product. All mock data, signals, and AI outputs are illustrative. Do not use the demo build to make real trading decisions.
