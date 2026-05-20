import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLiveQuotes } from '../lib/useLiveQuotes';
import { SECTORS, STOCKS, DEFAULT_WATCHLIST, formatPrice, formatChange, formatPct, sparkPath, getMarketStatus } from '../lib/mockData';
import Icon from '../components/Icon';

export default function MarketsScreen() {
  const { selectedSectors, watchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const quotes = useLiveQuotes();
  const marketStatus = getMarketStatus();
  const [showAdd, setShowAdd] = useState(false);

  const sectorMap = useMemo(() => Object.fromEntries(SECTORS.map((s) => [s.id, s])), []);

  // Default to demo watchlist if user has none yet
  const effectiveWatchlist = watchlist.length > 0 ? watchlist : DEFAULT_WATCHLIST;

  // Compute top movers across selected sectors (or all if none)
  const movers = useMemo(() => {
    const universe = Object.keys(STOCKS).filter((sym) => {
      if (selectedSectors.length === 0) return true;
      return selectedSectors.includes(STOCKS[sym].sector);
    });
    const list = universe.map((s) => quotes[s]).filter(Boolean);
    list.sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
    return list.slice(0, 4);
  }, [selectedSectors, quotes]);

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 className="display" style={styles.title}>Markets</h1>
          <p style={styles.sub}>Real-time intelligence · NYSE / NASDAQ</p>
        </div>
        <div className={`tag ${marketStatus.isOpen ? 'tag-live' : 'tag-down'}`}>
          {marketStatus.isOpen && <span className="live-pulse" />}
          {marketStatus.label}
        </div>
      </div>

      {/* Market status bar */}
      <div style={{
        ...styles.statusBar,
        background: marketStatus.isOpen ? 'rgba(34,197,94,0.06)' : 'rgba(107,114,128,0.06)',
        borderColor: marketStatus.isOpen ? 'rgba(34,197,94,0.2)' : 'var(--border)',
      }}>
        <span style={{
          ...styles.statusLabel,
          color: marketStatus.isOpen ? 'var(--green)' : 'var(--dim-light)',
        }}>{marketStatus.label}</span>
        <span style={styles.statusTime}>{marketStatus.timeStr}</span>
      </div>

      {/* Sector chips */}
      {selectedSectors.length > 0 && (
        <div style={styles.chipRow}>
          {selectedSectors.map((id) => {
            const sec = sectorMap[id];
            if (!sec) return null;
            return (
              <div
                key={id}
                style={{
                  ...styles.chip,
                  borderColor: `rgba(${sec.rgb}, 0.4)`,
                  background: `rgba(${sec.rgb}, 0.12)`,
                  color: sec.color,
                }}
              >
                <span>{sec.emoji}</span> {sec.label}
              </div>
            );
          })}
        </div>
      )}

      <div style={styles.scroll}>
        {/* Movers */}
        <div className="section-label" style={{ marginTop: 4 }}>Top movers</div>
        <div style={styles.moverRow}>
          {movers.map((q) => (
            <MoverCard key={q.symbol} q={q} />
          ))}
        </div>

        {/* Watchlist */}
        <div style={styles.watchHeader}>
          <span className="section-label" style={{ margin: 0 }}>Watchlist</span>
          <button onClick={() => setShowAdd(true)} style={styles.addBtn}>
            <Icon name="plus" size={14} color="var(--accent)" />
            <span>Add</span>
          </button>
        </div>

        {effectiveWatchlist.map((sym) => {
          const q = quotes[sym];
          if (!q) return null;
          const meta = STOCKS[sym];
          const sec = sectorMap[meta.sector];
          const up = q.changePct >= 0;
          return (
            <div key={sym} style={styles.stockCard}>
              <div style={styles.stockLeft}>
                <div style={styles.stockSym}>
                  {sym}
                  {sec && <span style={{ ...styles.sectorDot, background: sec.color }} />}
                </div>
                <div style={styles.stockName}>{meta.name}</div>
              </div>
              <svg width={56} height={22} style={{ flexShrink: 0 }}>
                <path
                  d={sparkPath(sym, 56, 22, 14)}
                  fill="none"
                  stroke={up ? 'var(--green)' : 'var(--red)'}
                  strokeWidth={1.5}
                />
              </svg>
              <div style={styles.stockRight}>
                <div className="mono" style={styles.stockPrice}>${formatPrice(q.price)}</div>
                <div style={{
                  ...styles.stockChange,
                  color: up ? 'var(--green)' : 'var(--red)',
                }}>
                  {formatPct(q.changePct)}
                </div>
              </div>
              {watchlist.includes(sym) && (
                <button
                  onClick={() => removeFromWatchlist(sym)}
                  style={styles.removeBtn}
                  aria-label="Remove"
                >
                  <Icon name="x" size={12} color="var(--dim)" />
                </button>
              )}
            </div>
          );
        })}

        {/* Disclaimer at bottom */}
        <div style={styles.disclaimer}>
          Data shown for demonstration. Not investment advice.
        </div>
      </div>

      {showAdd && (
        <AddTickerSheet
          onClose={() => setShowAdd(false)}
          onAdd={(sym) => { addToWatchlist(sym); setShowAdd(false); }}
          watchlist={effectiveWatchlist}
        />
      )}
    </div>
  );
}

function MoverCard({ q }) {
  const up = q.changePct >= 0;
  return (
    <div style={moverStyles.card}>
      <div style={moverStyles.sym}>{q.symbol}</div>
      <div className="mono" style={moverStyles.price}>${formatPrice(q.price)}</div>
      <div style={{
        ...moverStyles.change,
        color: up ? 'var(--green)' : 'var(--red)',
      }}>
        <Icon name={up ? 'arrowUp' : 'arrowDown'} size={10} strokeWidth={3} />
        {formatPct(q.changePct)}
      </div>
    </div>
  );
}

function AddTickerSheet({ onClose, onAdd, watchlist }) {
  const [q, setQ] = useState('');
  const available = Object.keys(STOCKS).filter((s) => !watchlist.includes(s));
  const filtered = q
    ? available.filter((s) =>
        s.toLowerCase().includes(q.toLowerCase()) ||
        STOCKS[s].name.toLowerCase().includes(q.toLowerCase())
      )
    : available.slice(0, 20);

  return (
    <>
      <div style={sheetStyles.backdrop} onClick={onClose} />
      <div className="slide-up" style={sheetStyles.sheet}>
        <div style={sheetStyles.handle} />
        <div style={sheetStyles.title}>Add to Watchlist</div>
        <div style={sheetStyles.searchBox}>
          <Icon name="search" size={16} color="var(--dim-light)" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ticker or company..."
            style={sheetStyles.searchInput}
          />
        </div>
        <div style={sheetStyles.list}>
          {filtered.length === 0 && (
            <div style={sheetStyles.empty}>No matches</div>
          )}
          {filtered.map((sym) => (
            <button key={sym} onClick={() => onAdd(sym)} style={sheetStyles.row}>
              <div>
                <div style={sheetStyles.rowSym}>{sym}</div>
                <div style={sheetStyles.rowName}>{STOCKS[sym].name}</div>
              </div>
              <Icon name="plus" size={16} color="var(--accent)" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const styles = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 'env(safe-area-inset-top)',
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 18px 8px',
  },
  title: { fontSize: 26, color: 'var(--text)' },
  sub: { fontSize: 12, color: 'var(--dim-light)', marginTop: 2 },
  statusBar: {
    margin: '0 18px 12px',
    padding: '9px 13px',
    borderRadius: 10,
    border: '1px solid',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: { fontSize: 12, fontWeight: 700 },
  statusTime: { fontSize: 11, color: 'var(--dim-light)' },
  chipRow: {
    display: 'flex',
    gap: 6,
    padding: '0 18px 10px',
    overflowX: 'auto',
    flexShrink: 0,
  },
  chip: {
    padding: '5px 11px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    border: '1px solid',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 18px 24px',
    WebkitOverflowScrolling: 'touch',
  },
  moverRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    marginBottom: 18,
  },
  watchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: 'var(--accent)',
    fontWeight: 700,
    padding: '4px 10px',
    background: 'var(--accent-dim)',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: 16,
  },
  stockCard: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  stockLeft: { flex: 1, minWidth: 0 },
  stockSym: {
    fontSize: 15,
    fontWeight: 800,
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  sectorDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  stockName: {
    fontSize: 11,
    color: 'var(--dim-light)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 140,
  },
  stockRight: { textAlign: 'right' },
  stockPrice: { fontSize: 14, fontWeight: 700, color: 'var(--text)' },
  stockChange: { fontSize: 12, fontWeight: 600, marginTop: 1 },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
    opacity: 0.5,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 10,
    color: 'var(--dim)',
    padding: '20px 12px 8px',
  },
};

const moverStyles = {
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '12px 12px',
  },
  sym: { fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 2 },
  change: {
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
};

const sheetStyles = {
  backdrop: {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 10,
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    background: 'var(--card)',
    borderTop: '1px solid var(--border)',
    borderRadius: '20px 20px 0 0',
    padding: '12px 18px 24px',
    paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
    zIndex: 11,
    maxHeight: '70%',
    display: 'flex',
    flexDirection: 'column',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    background: 'var(--border)',
    margin: '0 auto 14px',
  },
  title: { fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 12 },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--card-alt)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0 12px',
    height: 42,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: 'var(--text)',
    fontSize: 14,
    height: 42,
  },
  list: { flex: 1, overflowY: 'auto', minHeight: 200 },
  empty: { textAlign: 'center', color: 'var(--dim-light)', padding: 30, fontSize: 13 },
  row: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 4px',
    borderBottom: '1px solid var(--border)',
    textAlign: 'left',
  },
  rowSym: { fontSize: 14, fontWeight: 700, color: 'var(--text)' },
  rowName: { fontSize: 11, color: 'var(--dim-light)', marginTop: 2 },
};
