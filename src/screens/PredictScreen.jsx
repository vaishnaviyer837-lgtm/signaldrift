import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLiveQuotes } from '../lib/useLiveQuotes';
import { STOCKS, DEFAULT_WATCHLIST, formatPrice, formatPct } from '../lib/mockData';
import Icon from '../components/Icon';

// Deterministic mock prediction so the same ticker shows the same forecast
// session-to-session. Real impl will call your serverless function which
// hits Gemini.
function generateMockPrediction(ticker, currentPrice) {
  let h = 0;
  for (let i = 0; i < ticker.length; i++) h = (h * 31 + ticker.charCodeAt(i)) | 0;
  const seed = Math.abs(h);

  const direction = ((seed % 100) / 100) > 0.4 ? 'up' : 'down';
  const confidence = 55 + (seed % 35); // 55-90
  const moveSize = 1.5 + ((seed % 60) / 10); // 1.5%-7.5%
  const target = direction === 'up'
    ? currentPrice * (1 + moveSize / 100)
    : currentPrice * (1 - moveSize / 100);

  const bullishCatalysts = [
    'Sector momentum positive on rotation flows',
    'Options skew indicates institutional accumulation',
    'Earnings beat baseline by analyst consensus',
    'Technical setup: clean breakout above 50-day MA',
    'Volume profile suggests demand zone established',
  ];
  const bearishCatalysts = [
    'Sector showing signs of distribution',
    'Options flow leaning put-side with elevated premium',
    'Negative news cycle weighing on sentiment',
    'Technical breakdown below key support zones',
    'Macro headwinds — Fed commentary cautious',
  ];

  const catalysts = direction === 'up' ? bullishCatalysts : bearishCatalysts;
  const reasons = [catalysts[seed % 5], catalysts[(seed * 7) % 5]];

  const risks = direction === 'up'
    ? 'Watch for broad-market reversal; tighten stops if SPY breaks intraday VWAP.'
    : 'Reversal risk if a positive catalyst (earnings, analyst upgrade, M&A) emerges.';

  return {
    direction,
    confidence,
    target,
    moveSize: direction === 'up' ? moveSize : -moveSize,
    reasons,
    risks,
    timeframe: '5-7 trading days',
  };
}

export default function PredictScreen() {
  const { watchlist, canAccessFeature } = useApp();
  const quotes = useLiveQuotes();
  const tickers = watchlist.length > 0 ? watchlist : DEFAULT_WATCHLIST;
  const [active, setActive] = useState(tickers[0]);
  const [generating, setGenerating] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const quote = quotes[active];
  const hasPremium = canAccessFeature('premiumAiPredictions');

  function generate() {
    if (!quote) return;
    setGenerating(true);
    setPrediction(null);
    setTimeout(() => {
      setPrediction(generateMockPrediction(active, quote.price));
      setGenerating(false);
    }, 1100);
  }

  // Auto-generate on ticker change
  React.useEffect(() => {
    if (quote) generate();
    // eslint-disable-next-line
  }, [active]);

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h1 className="display" style={styles.title}>AI Predictions</h1>
        <p style={styles.sub}>Probability-weighted forecasts · 5–7 day horizon</p>
      </div>

      <div style={styles.scroll}>
        {/* Ticker pills */}
        <div style={styles.pillRow}>
          {tickers.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              style={{
                ...styles.pill,
                borderColor: active === t ? 'var(--accent)' : 'var(--border)',
                background: active === t ? 'var(--accent-dim)' : 'var(--card)',
                color: active === t ? 'var(--accent)' : 'var(--text-soft)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Prediction card */}
        <div style={styles.predCard}>
          <div style={styles.predHead}>
            <div style={styles.predHeadLeft}>
              <span style={styles.predHeadTitle}>{active}</span>
              {quote && (
                <span className="mono" style={styles.predHeadPrice}>
                  ${formatPrice(quote.price)}
                </span>
              )}
            </div>
            {hasPremium ? (
              <div className="tag tag-gold" style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--gold-deep)' }}>
                <Icon name="crown" size={10} strokeWidth={2.5} />
                Max
              </div>
            ) : (
              <div className="tag tag-gold">
                <Icon name="sparkles" size={10} strokeWidth={2.5} />
                Free
              </div>
            )}
          </div>

          {generating && (
            <div style={styles.loading}>
              <div className="skeleton" style={{ height: 50, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 16, width: '70%' }} />
            </div>
          )}

          {prediction && !generating && (
            <>
              <div style={{
                ...styles.directionBar,
                background: prediction.direction === 'up' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                borderColor: prediction.direction === 'up' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
              }}>
                <Icon
                  name={prediction.direction === 'up' ? 'trendUp' : 'trendDown'}
                  size={22}
                  color={prediction.direction === 'up' ? 'var(--green)' : 'var(--red)'}
                  strokeWidth={2.4}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: prediction.direction === 'up' ? 'var(--green)' : 'var(--red)',
                  }}>
                    {prediction.direction === 'up' ? 'Bullish' : 'Bearish'} · {formatPct(prediction.moveSize)}
                  </div>
                  <div style={styles.dirSub}>
                    Target: <span className="mono">${formatPrice(prediction.target)}</span> · {prediction.timeframe}
                  </div>
                </div>
              </div>

              <div style={styles.confSection}>
                <div style={styles.confLabel}>
                  <span>Model confidence</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{prediction.confidence}%</span>
                </div>
                <div style={styles.confBar}>
                  <div style={{
                    ...styles.confFill,
                    width: `${prediction.confidence}%`,
                  }} />
                </div>
              </div>

              <div style={styles.section}>
                <div style={styles.sectionTitle}>Key drivers</div>
                <ul style={styles.list}>
                  {prediction.reasons.map((r, i) => (
                    <li key={i} style={styles.listItem}>
                      <span style={styles.bullet}>•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.section}>
                <div style={styles.sectionTitle}>Primary risk</div>
                <p style={styles.sectionBody}>{prediction.risks}</p>
              </div>

              <button onClick={generate} style={styles.regenBtn}>
                <Icon name="sparkles" size={12} color="var(--accent)" />
                Regenerate forecast
              </button>
            </>
          )}
        </div>

        <div style={styles.disclaimer}>
          ⚠ AI predictions are probabilistic estimates based on historical patterns.<br />
          They are not investment advice and may be wrong.
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 'env(safe-area-inset-top)',
    overflow: 'hidden',
  },
  header: { padding: '20px 18px 12px' },
  title: { fontSize: 26, color: 'var(--text)' },
  sub: { fontSize: 12, color: 'var(--dim-light)', marginTop: 2 },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 18px 24px',
    WebkitOverflowScrolling: 'touch',
  },
  pillRow: {
    display: 'flex',
    gap: 6,
    marginBottom: 16,
    overflowX: 'auto',
    paddingBottom: 4,
  },
  pill: {
    padding: '7px 14px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
    border: '1.5px solid',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  predCard: {
    background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(212,175,55,0.04))',
    border: '1.5px solid rgba(245,158,11,0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  predHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  predHeadLeft: { display: 'flex', alignItems: 'baseline', gap: 10 },
  predHeadTitle: { fontSize: 18, fontWeight: 800, color: 'var(--text)' },
  predHeadPrice: { fontSize: 14, fontWeight: 600, color: 'var(--text-soft)' },
  loading: { padding: '4px 0' },
  directionBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid',
    marginBottom: 14,
  },
  dirSub: { fontSize: 11, color: 'var(--dim-light)', marginTop: 2 },
  confSection: { marginBottom: 14 },
  confLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: 'var(--dim-light)',
    marginBottom: 5,
  },
  confBar: {
    height: 6,
    background: 'var(--card-alt)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent), var(--green))',
    borderRadius: 3,
    transition: 'width 0.6s',
  },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--dim-light)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  sectionBody: { fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.55 },
  list: { listStyle: 'none' },
  listItem: {
    fontSize: 12.5,
    color: 'var(--text-soft)',
    lineHeight: 1.5,
    display: 'flex',
    gap: 6,
    marginBottom: 4,
  },
  bullet: { color: 'var(--accent)', flexShrink: 0 },
  regenBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    padding: '10px',
    marginTop: 6,
    background: 'var(--card-alt)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--accent)',
  },
  disclaimer: {
    background: 'rgba(239,68,68,0.06)',
    border: '1px solid rgba(239,68,68,0.18)',
    borderRadius: 10,
    padding: 10,
    fontSize: 11,
    color: 'var(--red)',
    textAlign: 'center',
    lineHeight: 1.5,
    marginTop: 6,
  },
};
