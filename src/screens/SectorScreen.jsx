import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SECTORS } from '../lib/mockData';
import Icon from '../components/Icon';

export default function SectorScreen() {
  const { saveSectors, completeOnboarding, maxSectors, subscription } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  function toggle(id) {
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((s) => s !== id));
    } else {
      if (selected.length >= maxSectors) return;
      setSelected((prev) => [...prev, id]);
    }
  }

  function finish() {
    if (selected.length === 0) return;
    saveSectors(selected);
    completeOnboarding();
    navigate('/app');
  }

  const isFree = subscription === 'free';
  const remaining = isFree ? maxSectors - selected.length : null;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h2 className="display" style={styles.title}>Choose Your Sectors</h2>
        <p style={styles.sub}>
          {isFree ? `Free plan: up to ${maxSectors} sectors` : 'Select as many as you like'}
        </p>
      </div>

      <div style={styles.countRow}>
        <span style={styles.countText}>
          {selected.length} selected{isFree ? ` / ${maxSectors} max` : ''}
        </span>
        {isFree && (
          <span style={{
            ...styles.limitBadge,
            background: remaining === 0 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
            color: remaining === 0 ? 'var(--red)' : 'var(--gold-deep)',
          }}>
            {remaining === 0 ? 'Limit reached' : `${remaining} left`}
          </span>
        )}
      </div>

      <div style={styles.grid}>
        {SECTORS.map((sector) => {
          const isSelected = selected.includes(sector.id);
          const isDisabled = !isSelected && isFree && selected.length >= maxSectors;
          return (
            <button
              key={sector.id}
              onClick={() => !isDisabled && toggle(sector.id)}
              style={{
                ...styles.card,
                opacity: isDisabled ? 0.35 : 1,
                borderColor: isSelected ? sector.color : 'var(--border)',
                background: isSelected
                  ? `rgba(${sector.rgb}, 0.08)`
                  : 'var(--card)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              <span style={styles.emoji}>{sector.emoji}</span>
              <span style={{
                ...styles.label,
                color: isSelected ? sector.color : 'var(--text-soft)',
              }}>
                {sector.label}
              </span>
              {isSelected && (
                <div style={{ ...styles.checkmark, background: sector.color }}>
                  <Icon name="check" size={11} color="#1a1408" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isFree && remaining === 0 && (
        <div style={styles.upgrade}>
          <Icon name="crown" size={14} color="var(--accent)" />
          <span style={styles.upgradeText}>
            Upgrade to <strong>Explorer</strong> for unlimited sectors
          </span>
        </div>
      )}

      <button
        disabled={selected.length === 0}
        onClick={finish}
        className="btn btn-primary btn-full"
        style={{ marginTop: 4 }}
      >
        Continue ({selected.length})
      </button>
    </div>
  );
}

const styles = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 18px',
    paddingTop: 'calc(24px + env(safe-area-inset-top))',
    paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
    overflow: 'hidden',
  },
  header: { paddingBottom: 8 },
  title: { fontSize: 26, color: 'var(--text)' },
  sub: { fontSize: 13, color: 'var(--dim-light)', marginTop: 4 },
  countRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 2px 12px',
  },
  countText: { fontSize: 12, color: 'var(--dim-light)' },
  limitBadge: {
    padding: '4px 9px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 9,
    overflowY: 'auto',
    paddingBottom: 8,
    alignContent: 'start',
  },
  card: {
    background: 'var(--card)',
    border: '1.5px solid var(--border)',
    borderRadius: 12,
    padding: 14,
    position: 'relative',
    textAlign: 'left',
    minHeight: 88,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.15s',
  },
  emoji: { fontSize: 24, marginBottom: 6, display: 'block' },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-soft)',
    lineHeight: 1.3,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgrade: {
    margin: '6px 0',
    padding: '10px 14px',
    background: 'rgba(212,175,55,0.08)',
    border: '1px solid rgba(212,175,55,0.25)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  upgradeText: { fontSize: 12, color: 'var(--accent)' },
};
