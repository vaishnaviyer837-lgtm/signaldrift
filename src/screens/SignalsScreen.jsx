import React from 'react';
import { useApp } from '../context/AppContext';
import { useLiveQuotes } from '../lib/useLiveQuotes';
import { MOCK_SIGNALS, STOCKS, formatPrice, formatPct } from '../lib/mockData';
import Icon from '../components/Icon';

export default function SignalsScreen() {
  const { canAccessFeature } = useApp();
  const quotes = useLiveQuotes();
  const hasAdvanced = canAccessFeature('advancedSignals');

  // Free users see top 2 signals
  const visibleSignals = hasAdvanced ? MOCK_SIGNALS : MOCK_SIGNALS.slice(0, 2);
  const lockedSignals = hasAdvanced ? [] : MOCK_SIGNALS.slice(2);

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div>
          <h1 className="display" style={styles.title}>Signals</h1>
          <p style={styles.sub}>Probability-weighted, AI-ranked</p>
        </div>
        <div className="tag tag-gold">
          <Icon name="pulse" size={10} strokeWidth={2.5} />
          {MOCK_SIGNALS.length} active
        </div>
      </div>

      <div style={styles.scroll}>
        {visibleSignals.map((sig) => (
          <SignalCard key={sig.id} sig={sig} quote={quotes[sig.ticker]} />
        ))}

        {!hasAdvanced && lockedSignals.length > 0 && (
          <div style={styles.gateCard}>
            <Icon name="crown" size={20} color="var(--accent)" />
            <div style={styles.gateTitle}>
              {lockedSignals.length} more signals available
            </div>
            <div style={styles.gateSub}>
              Upgrade to Explorer for full signal access, advanced confidence scoring, and 1H/4H/1D timeframes.
            </div>
            <button className="btn btn-primary" style={styles.gateBtn}>
              Upgrade — Explorer
            </button>
          </div>
        )}

        {hasAdvanced && lockedSignals.map((sig) => (
          <SignalCard key={sig.id} sig={sig} quote={quotes[sig.ticker]} />
        ))}

        <div style={styles.disclaimer}>
          Signals are probabilistic estimates, not advice. Past signals do not predict future results.
        </div>
      </div>
    </div>
  );
}

function SignalCard({ sig, quote }) {
  const isBearish = sig.type.toLowerCase().includes('bearish');
  const tone = isBearish ? 'down' : 'up';
  const color = isBearish ? 'var(--red)' : 'var(--green)';
  const bgColor = isBearish ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)';
  const borderColor = isBearish ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)';

  return (
    <div style={{
      ...cardStyles.card,
      background: bgColor,
      borderColor: borderColor,
    }}>
      <div style={cardStyles.head}>
        <div style={cardStyles.headLeft}>
          <div style={cardStyles.ticker}>{sig.ticker}</div>
          <div style={cardStyles.tf}>{sig.timeframe}</div>
        </div>
        <div style={{ ...cardStyles.typePill, background: color }}>
          {sig.type}
        </div>
      </div>

      {quote && (
        <div style={cardStyles.priceRow}>
          <span className="mono" style={cardStyles.price}>${formatPrice(quote.price)}</span>
          <span style={{ ...cardStyles.priceChange, color: quote.changePct >= 0 ? 'var(--green)' : 'var(--red)' }}>
            <Icon name={quote.changePct >= 0 ? 'arrowUp' : 'arrowDown'} size={10} strokeWidth={3} />
            {formatPct(quote.changePct)}
          </span>
        </div>
      )}

      <div style={cardStyles.confidence}>
        <div style={cardStyles.confLabel}>
          <span>Confidence</span>
          <span style={{ color, fontWeight: 700 }}>{sig.confidence}%</span>
        </div>
        <div style={cardStyles.confBar}>
          <div style={{
            ...cardStyles.confFill,
            width: `${sig.confidence}%`,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          }} />
        </div>
      </div>

      <p style={cardStyles.rationale}>{sig.rationale}</p>

      <div style={cardStyles.foot}>
        <span style={cardStyles.time}>{sig.minutesAgo}m ago</span>
        <button style={cardStyles.detailsBtn}>
          Details
          <Icon name="chevronRight" size={12} color="var(--accent)" strokeWidth={2.5} />
        </button>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 18px 12px',
  },
  title: { fontSize: 26, color: 'var(--text)' },
  sub: { fontSize: 12, color: 'var(--dim-light)', marginTop: 2 },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 18px 24px',
    WebkitOverflowScrolling: 'touch',
  },
  gateCard: {
    background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(245,158,11,0.05))',
    border: '1px dashed rgba(212,175,55,0.4)',
    borderRadius: 14,
    padding: 18,
    textAlign: 'center',
    margin: '8px 0',
  },
  gateTitle: { fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '10px 0 4px' },
  gateSub: { fontSize: 12, color: 'var(--dim-light)', lineHeight: 1.5, marginBottom: 14 },
  gateBtn: { height: 42, padding: '0 22px' },
  disclaimer: {
    textAlign: 'center',
    fontSize: 10,
    color: 'var(--dim)',
    padding: '16px 12px 8px',
    lineHeight: 1.5,
  },
};

const cardStyles = {
  card: {
    border: '1px solid',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  ticker: { fontSize: 17, fontWeight: 800, color: 'var(--text)' },
  tf: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--dim-light)',
    background: 'var(--card-alt)',
    padding: '2px 6px',
    borderRadius: 4,
  },
  typePill: {
    fontSize: 9,
    fontWeight: 800,
    color: '#fff',
    padding: '4px 9px',
    borderRadius: 6,
    letterSpacing: 0.4,
  },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  price: { fontSize: 15, fontWeight: 700, color: 'var(--text)' },
  priceChange: { fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 1 },
  confidence: { marginBottom: 10 },
  confLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 10,
    color: 'var(--dim-light)',
    marginBottom: 4,
  },
  confBar: {
    height: 5,
    background: 'var(--card-alt)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confFill: { height: '100%', borderRadius: 3, transition: 'width 0.6s' },
  rationale: {
    fontSize: 12,
    color: 'var(--text-soft)',
    lineHeight: 1.55,
    marginBottom: 10,
  },
  foot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTop: '1px solid var(--border)',
  },
  time: { fontSize: 10, color: 'var(--dim)' },
  detailsBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--accent)',
    padding: 2,
  },
};
