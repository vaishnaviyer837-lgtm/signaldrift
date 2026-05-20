import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

const SECTIONS = [
  {
    title: 'Not Financial Advice',
    body: 'SignalDrift is an informational tool only. Nothing displayed — including alerts, signals, AI outputs, summaries, or predictions — constitutes financial advice or an investment recommendation.',
  },
  {
    title: 'AI Predictions & Signals',
    body: 'AI-generated predictions are based on probabilistic models trained on historical data. They may be inaccurate, outdated, or misleading. Past performance does not guarantee future results.',
  },
  {
    title: 'Your Responsibility',
    body: 'You are solely responsible for your own investment decisions. Consult a licensed financial advisor before making any trading or investment decisions involving real money.',
  },
  {
    title: 'Use at Your Own Risk',
    body: 'Markets are inherently volatile and can move against you rapidly. Information from SignalDrift should be one input among many in your research process — never the only one.',
  },
  {
    title: 'Data Disclosure',
    body: 'Market data may be delayed up to 15 minutes depending on data source. We do not execute trades, hold customer funds, or operate as a registered broker-dealer.',
  },
];

export default function LegalScreen() {
  const { completeLegal } = useApp();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  function handleContinue() {
    if (!agreed) return;
    completeLegal();
    navigate('/tutorial');
  }

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div style={styles.iconBadge}>
          <Icon name="scale" size={28} color="var(--accent)" />
        </div>
        <h2 className="display" style={styles.title}>Terms & Risk Disclosure</h2>
        <p style={styles.sub}>Please read carefully before continuing</p>
      </div>

      <div style={styles.scroll}>
        {SECTIONS.map((s, i) => (
          <div key={i} style={styles.section}>
            <div style={styles.sectionTitle}>{s.title}</div>
            <p style={styles.sectionBody}>{s.body}</p>
          </div>
        ))}
      </div>

      <div style={styles.checkRow} onClick={() => setAgreed((a) => !a)}>
        <div style={{
          ...styles.checkbox,
          background: agreed ? 'var(--accent)' : 'transparent',
          borderColor: agreed ? 'var(--accent)' : 'var(--border)',
        }}>
          {agreed && <Icon name="check" size={14} color="#1a1408" strokeWidth={3} />}
        </div>
        <span style={styles.checkLabel}>
          I understand SignalDrift is informational only and not financial advice. I use this app at my own risk.
        </span>
      </div>

      <button
        disabled={!agreed}
        onClick={handleContinue}
        className="btn btn-primary btn-full"
        style={{ marginTop: 4 }}
      >
        I Agree — Continue
      </button>
    </div>
  );
}

const styles = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 20px 24px',
    paddingTop: 'calc(32px + env(safe-area-inset-top))',
    paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
    minHeight: 0,
  },
  header: { textAlign: 'center', marginBottom: 18 },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    background: 'var(--accent-dim)',
    border: '1px solid rgba(212,175,55,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  title: { fontSize: 22, color: 'var(--text)' },
  sub: { fontSize: 12, color: 'var(--dim-light)', marginTop: 4 },
  scroll: {
    flex: 1,
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    padding: '16px 14px',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    marginBottom: 14,
    minHeight: 0,
  },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 5,
  },
  sectionBody: { fontSize: 11.5, color: 'var(--dim-light)', lineHeight: 1.55 },
  checkRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 4px',
    cursor: 'pointer',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: '1.5px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
    transition: 'all 0.15s',
  },
  checkLabel: { fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.5 },
};
