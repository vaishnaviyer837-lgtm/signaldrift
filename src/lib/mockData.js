// ─────────────────────────────────────────────────────────────────────────
// Mock data — realistic stock universe organized by sector
// Demo-friendly: prices animate, looks live. Swap to Finnhub later.
// ─────────────────────────────────────────────────────────────────────────

export const SECTORS = [
  { id: 'tech',      label: 'Technology',           emoji: '💻', color: '#D4AF37', rgb: '212,175,55' },
  { id: 'ai',        label: 'Artificial Intelligence', emoji: '🤖', color: '#8b5cf6', rgb: '139,92,246' },
  { id: 'semi',      label: 'Semiconductors',       emoji: '🔬', color: '#3b82f6', rgb: '59,130,246' },
  { id: 'biotech',   label: 'Biotech & Pharma',     emoji: '🧬', color: '#22c55e', rgb: '34,197,94' },
  { id: 'crypto',    label: 'Crypto & Web3',        emoji: '₿',  color: '#f59e0b', rgb: '245,158,11' },
  { id: 'fintech',   label: 'Fintech',              emoji: '💳', color: '#06b6d4', rgb: '6,182,212' },
  { id: 'energy',    label: 'Energy & Clean',       emoji: '⚡', color: '#10b981', rgb: '16,185,129' },
  { id: 'defense',   label: 'Defense & Aerospace',  emoji: '🛡️', color: '#ef4444', rgb: '239,68,68' },
  { id: 'ev',        label: 'EV & Mobility',        emoji: '🚗', color: '#ec4899', rgb: '236,72,153' },
  { id: 'consumer',  label: 'Consumer & Retail',    emoji: '🛒', color: '#a855f7', rgb: '168,85,247' },
];

// Each stock has a deterministic base price + volatility seed for the
// mock-tick generator. This makes the data look plausibly live.
export const STOCKS = {
  // Tech
  AAPL:  { name: 'Apple Inc.',           sector: 'tech',    base: 228.15, vol: 0.4 },
  MSFT:  { name: 'Microsoft Corp.',      sector: 'tech',    base: 461.30, vol: 0.5 },
  GOOGL: { name: 'Alphabet Inc.',        sector: 'tech',    base: 192.45, vol: 0.6 },
  META:  { name: 'Meta Platforms',       sector: 'tech',    base: 612.80, vol: 0.7 },
  AMZN:  { name: 'Amazon.com',           sector: 'tech',    base: 218.92, vol: 0.5 },

  // AI
  NVDA:  { name: 'NVIDIA Corp.',         sector: 'ai',      base: 142.65, vol: 1.2 },
  PLTR:  { name: 'Palantir Technologies',sector: 'ai',      base: 78.20, vol: 1.4 },
  AI:    { name: 'C3.ai Inc.',           sector: 'ai',      base: 31.45, vol: 1.6 },
  SMCI:  { name: 'Super Micro Computer', sector: 'ai',      base: 48.30, vol: 1.8 },

  // Semis
  AMD:   { name: 'Advanced Micro Devices', sector: 'semi',  base: 138.75, vol: 1.0 },
  TSM:   { name: 'Taiwan Semiconductor', sector: 'semi',    base: 218.40, vol: 0.7 },
  AVGO:  { name: 'Broadcom Inc.',        sector: 'semi',    base: 1820.50, vol: 0.9 },
  ASML:  { name: 'ASML Holding',         sector: 'semi',    base: 715.20, vol: 0.8 },

  // Biotech
  LLY:   { name: 'Eli Lilly & Co.',      sector: 'biotech', base: 778.90, vol: 0.6 },
  NVO:   { name: 'Novo Nordisk',         sector: 'biotech', base: 102.45, vol: 0.7 },
  MRNA:  { name: 'Moderna Inc.',         sector: 'biotech', base: 41.20, vol: 1.5 },

  // Crypto-related
  COIN:  { name: 'Coinbase Global',      sector: 'crypto',  base: 268.30, vol: 1.6 },
  MSTR:  { name: 'Strategy (MicroStrategy)', sector: 'crypto', base: 372.50, vol: 2.0 },
  MARA:  { name: 'MARA Holdings',        sector: 'crypto',  base: 18.45, vol: 2.2 },

  // Fintech
  V:     { name: 'Visa Inc.',            sector: 'fintech', base: 318.20, vol: 0.3 },
  MA:    { name: 'Mastercard Inc.',      sector: 'fintech', base: 528.40, vol: 0.3 },
  SQ:    { name: 'Block Inc.',           sector: 'fintech', base: 92.85, vol: 1.0 },
  HOOD:  { name: 'Robinhood Markets',    sector: 'fintech', base: 42.10, vol: 1.4 },

  // Energy
  XOM:   { name: 'Exxon Mobil',          sector: 'energy',  base: 118.50, vol: 0.5 },
  ENPH:  { name: 'Enphase Energy',       sector: 'energy',  base: 78.20, vol: 1.2 },
  FSLR:  { name: 'First Solar',          sector: 'energy',  base: 218.45, vol: 1.0 },

  // Defense
  LMT:   { name: 'Lockheed Martin',      sector: 'defense', base: 538.20, vol: 0.4 },
  RTX:   { name: 'RTX Corp.',            sector: 'defense', base: 128.40, vol: 0.4 },
  PLTR2: { name: 'Palantir (Gov)',       sector: 'defense', base: 78.20, vol: 1.4 },

  // EV
  TSLA:  { name: 'Tesla Inc.',           sector: 'ev',      base: 348.60, vol: 1.5 },
  RIVN:  { name: 'Rivian Automotive',    sector: 'ev',      base: 14.25, vol: 1.8 },
  LCID:  { name: 'Lucid Group',          sector: 'ev',      base: 2.85, vol: 2.0 },

  // Consumer
  WMT:   { name: 'Walmart Inc.',         sector: 'consumer',base: 92.40, vol: 0.3 },
  COST:  { name: 'Costco Wholesale',     sector: 'consumer',base: 968.20, vol: 0.5 },
  NKE:   { name: 'Nike Inc.',            sector: 'consumer',base: 78.45, vol: 0.7 },
};

// Default watchlist for new users
export const DEFAULT_WATCHLIST = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL'];

// News headlines for mock News feed
export const MOCK_NEWS = [
  {
    id: 1,
    ticker: 'NVDA',
    headline: 'NVIDIA reportedly accelerates Blackwell shipments amid record AI demand',
    source: 'Reuters',
    sentiment: 'bullish',
    minutesAgo: 12,
  },
  {
    id: 2,
    ticker: 'TSLA',
    headline: 'Tesla robotaxi pilot expands to two new metro areas this quarter',
    source: 'Bloomberg',
    sentiment: 'bullish',
    minutesAgo: 24,
  },
  {
    id: 3,
    ticker: 'AAPL',
    headline: 'Apple Vision Pro 2 leaks point to lighter design, $2,499 target price',
    source: 'The Information',
    sentiment: 'neutral',
    minutesAgo: 38,
  },
  {
    id: 4,
    ticker: 'PLTR',
    headline: 'Palantir wins $1.4B DoD contract for AI battle-management platform',
    source: 'WSJ',
    sentiment: 'bullish',
    minutesAgo: 52,
  },
  {
    id: 5,
    ticker: 'COIN',
    headline: 'SEC drops appeal in Coinbase staking case — analysts call it pivotal',
    source: 'CoinDesk',
    sentiment: 'bullish',
    minutesAgo: 71,
  },
  {
    id: 6,
    ticker: 'LLY',
    headline: 'Eli Lilly oral GLP-1 misses primary endpoint in Phase 3 trial',
    source: 'STAT News',
    sentiment: 'bearish',
    minutesAgo: 95,
  },
  {
    id: 7,
    ticker: 'AMD',
    headline: 'AMD MI400 series taped out — production ramp targeted for late next year',
    source: 'SemiAnalysis',
    sentiment: 'bullish',
    minutesAgo: 124,
  },
  {
    id: 8,
    ticker: 'META',
    headline: 'Meta Reality Labs losses narrow as Quest 4 outpaces forecasts',
    source: 'CNBC',
    sentiment: 'bullish',
    minutesAgo: 178,
  },
];

// Signal feed — pre-built mock signals
export const MOCK_SIGNALS = [
  {
    id: 's1', ticker: 'NVDA', type: 'BULLISH BREAKOUT',
    confidence: 87, timeframe: '1D',
    rationale: 'Volume surge 3.2x avg. Reclaimed 50DMA. Options flow heavily skewed call-side ($142C/$150C blocks).',
    minutesAgo: 4,
  },
  {
    id: 's2', ticker: 'PLTR', type: 'MOMENTUM CONTINUATION',
    confidence: 78, timeframe: '4H',
    rationale: 'Higher-highs intact. RSI 64 (room above). Sector flow positive on government-tech rotation.',
    minutesAgo: 18,
  },
  {
    id: 's3', ticker: 'COIN', type: 'CATALYST POP',
    confidence: 71, timeframe: '1D',
    rationale: 'SEC appeal withdrawal removes overhang. Historical post-resolution drift +4.2% over 5 sessions.',
    minutesAgo: 42,
  },
  {
    id: 's4', ticker: 'LLY', type: 'BEARISH REVERSAL',
    confidence: 81, timeframe: '1D',
    rationale: 'Failed trial = pipeline risk. Gap-down on 4.8x volume. Put/call ratio inverted to 1.6.',
    minutesAgo: 67,
  },
  {
    id: 's5', ticker: 'AMD', type: 'ACCUMULATION',
    confidence: 64, timeframe: '1W',
    rationale: 'Quiet base near $135. Institutional buys reported in last 13F window. Watching $145 breakout.',
    minutesAgo: 134,
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Live-feeling tick generator
// Walks each stock with mean-reversion + per-tick noise so the UI never
// goes stale during a demo.
// ─────────────────────────────────────────────────────────────────────────
const tickState = {};
Object.keys(STOCKS).forEach((sym) => {
  tickState[sym] = { price: STOCKS[sym].base, open: STOCKS[sym].base };
});

export function tickAll() {
  const out = {};
  for (const sym of Object.keys(STOCKS)) {
    const meta = STOCKS[sym];
    const st = tickState[sym];
    // small noise, mild mean-reversion toward base
    const drift = (meta.base - st.price) * 0.02;
    const noise = (Math.random() - 0.5) * meta.vol * 0.6;
    st.price = Math.max(0.05, st.price + drift + noise);
    const change = st.price - st.open;
    const changePct = (change / st.open) * 100;
    out[sym] = {
      symbol: sym,
      name: meta.name,
      sector: meta.sector,
      price: st.price,
      change,
      changePct,
      open: st.open,
    };
  }
  return out;
}

// Initialize: seed plausible intraday change so first paint isn't all $0.00
(function seed() {
  for (const sym of Object.keys(STOCKS)) {
    const v = STOCKS[sym].vol;
    const initialMove = (Math.random() - 0.5) * v * 8;
    tickState[sym].price = STOCKS[sym].base + initialMove;
  }
})();

export function formatPrice(p) {
  if (p == null) return '—';
  if (p >= 1000) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return p.toFixed(2);
}

export function formatChange(c) {
  const sign = c >= 0 ? '+' : '';
  return `${sign}${c.toFixed(2)}`;
}

export function formatPct(p) {
  const sign = p >= 0 ? '+' : '';
  return `${sign}${p.toFixed(2)}%`;
}

// Tiny sparkline path generator (24px tall, variable width)
export function sparkPath(seed, width = 60, height = 24, points = 16) {
  // pseudo-random walk seeded by the ticker name
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const rand = () => {
    h = (h * 1664525 + 1013904223) | 0;
    return ((h >>> 0) % 10000) / 10000;
  };
  const xs = [];
  let y = height / 2;
  for (let i = 0; i < points; i++) {
    y += (rand() - 0.5) * (height * 0.45);
    y = Math.max(2, Math.min(height - 2, y));
    xs.push([(i / (points - 1)) * width, y]);
  }
  return xs.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

// Check if US market is open (NYSE hours, approximate, no holiday calendar)
export function getMarketStatus() {
  const now = new Date();
  // Convert to ET (approx — no DST awareness)
  const etOffset = -5;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const et = new Date(utc + 3600000 * etOffset);
  const day = et.getDay(); // 0=Sun
  const hour = et.getHours();
  const min = et.getMinutes();
  const totalMin = hour * 60 + min;
  const open = 9 * 60 + 30;
  const close = 16 * 60;
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && totalMin >= open && totalMin < close;
  return {
    isOpen,
    label: isOpen ? 'Markets Open' : isWeekday ? (totalMin < open ? 'Pre-Market' : 'After Hours') : 'Markets Closed',
    timeStr: et.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' ET',
  };
}
