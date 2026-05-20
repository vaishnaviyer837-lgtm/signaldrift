import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLiveQuotes } from '../lib/useLiveQuotes';
import { MOCK_NEWS, STOCKS, formatPct } from '../lib/mockData';
import Icon from '../components/Icon';

const FILTERS = [
  { id: 'all',     label: 'All' },
  { id: 'bullish', label: 'Bullish' },
  { id: 'bearish', label: 'Bearish' },
  { id: 'watchlist', label: 'My Watchlist' },
];

export default function NewsScreen() {
  const { watchlist, canAccessFeature } = useApp();
  const quotes = useLiveQuotes();
  const [filter, setFilter] = useState('all');
  const hasFull = canAccessFeature('fullNews');

  const filtered = useMemo(() => {
    let list = MOCK_NEWS;
    if (filter === 'bullish') list = list.filter((n) => n.sentiment === 'bullish');
    else if (filter === 'bearish') list = list.filter((n) => n.sentiment === 'bearish');
    else if (filter === 'watchlist' && watchlist.length > 0) {
      list = list.filter((n) => watchlist.includes(n.ticker));
    }
    return list;
  }, [filter, watchlist]);

  const visible = hasFull ? filtered : filtered.slice(0, 4);
  const lockedCount = filtered.length - visible.length;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div>
          <h1 className="display" style={styles.title}>News</h1>
          <p style={styles.sub}>Curated · ticker-tagged · sentiment-scored</p>
        </div>
        <div className="tag tag-live">
          <span className="live-pulse" />
          Live
        </div>
      </div>

      <div style={styles.filterRow}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              ...styles.filterPill,
              borderColor: filter === f.id ? 'var(--accent)' : 'var(--border)',
              background: filter === f.id ? 'var(--accent-dim)' : 'transparent',
              color: filter === f.id ? 'var(--accent)' : 'var(--dim-light)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={styles.scroll}>
        {visible.map((news) => (
          <NewsCard key={news.id} news={news} quote={quotes[news.ticker]} />
        ))}

        {visible.length === 0 && (
          <div style={styles.empty}>
            <Icon name="newspaper" size={32} color="var(--dim)" />
            <div style={styles.emptyTitle}>No headlines yet</div>
            <div style={styles.emptySub}>Try a different filter</div>
          </div>
        )}

        {lockedCount > 0 && (
          <div style={styles.gateCard}>
            <Icon name="crown" size={20} color="var(--accent)" />
            <div style={styles.gateTitle}>
              {lockedCount} more headlines available
            </div>
            <div style={styles.gateSub}>
              Upgrade to Explorer for full news access, real-time alerts on watchlist headlines, and sentiment trend analysis.
            </div>
            <button className="btn btn-primary" style={styles.gateBtn}>
              Upgrade — Explorer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NewsCard({ news, quote }) {
  const meta = STOCKS[news.ticker];
  const sentimentColor =
    news.sentiment === 'bullish' ? 'var(--green)' :
    news.sentiment === 'bearish' ? 'var(--red)' : 'var(--dim-light)';

  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.head}>
        <div style={cardStyles.tickerBadge}>
          <span style={cardStyles.ticker}>{news.ticker}</span>
          {quote && (
            <span style={{ ...cardStyles.change, color: quote.changePct >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {formatPct(quote.changePct)}
            </span>
          )}
        </div>
        <div style={{ ...cardStyles.sentiment, color: sentimentColor }}>
          <Icon
            name={news.sentiment === 'bullish' ? 'trendUp' : news.sentiment === 'bearish' ? 'trendDown' : 'pulse'}
            size={11}
            strokeWidth={2.5}
          />
          {news.sentiment}
        </div>
      </div>
      <p style={cardStyles.headline}>{news.headline}</p>
      <div style={cardStyles.foot}>
        <span style={cardStyles.source}>{news.source}</span>
        <span style={cardStyles.time}>{news.minutesAgo}m ago</span>
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
  filterRow: {
    display: 'flex',
    gap: 6,
    padding: '0 18px 12px',
    overflowX: 'auto',
  },
  filterPill: {
    padding: '7px 13px',
    borderRadius: 18,
    fontSize: 12,
    fontWeight: 600,
    border: '1px solid',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 18px 24px',
    WebkitOverflowScrolling: 'touch',
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: 'var(--dim-light)',
  },
  emptyTitle: { fontSize: 14, fontWeight: 600, color: 'var(--text-soft)', marginTop: 10 },
  emptySub: { fontSize: 12, color: 'var(--dim-light)', marginTop: 4 },
  gateCard: {
    background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(245,158,11,0.05))',
    border: '1px dashed rgba(212,175,55,0.4)',
    borderRadius: 14,
    padding: 18,
    textAlign: 'center',
    marginTop: 8,
  },
  gateTitle: { fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '10px 0 4px' },
  gateSub: { fontSize: 12, color: 'var(--dim-light)', lineHeight: 1.5, marginBottom: 14 },
  gateBtn: { height: 42, padding: '0 22px' },
};

const cardStyles = {
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tickerBadge: { display: 'flex', alignItems: 'center', gap: 8 },
  ticker: { fontSize: 13, fontWeight: 800, color: 'var(--text)' },
  change: { fontSize: 11, fontWeight: 600 },
  sentiment: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  headline: {
    fontSize: 13.5,
    color: 'var(--text-soft)',
    lineHeight: 1.45,
    marginBottom: 9,
    fontWeight: 500,
  },
  foot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: { fontSize: 11, color: 'var(--dim-light)', fontWeight: 600 },
  time: { fontSize: 10, color: 'var(--dim)' },
};
