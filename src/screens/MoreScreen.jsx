import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SECTORS } from '../lib/mockData';
import Icon from '../components/Icon';

export default function MoreScreen() {
  const { user, subscription, selectedSectors, signOut, resetAccount, upgradeTo } = useApp();
  const navigate = useNavigate();
  const [showPricing, setShowPricing] = useState(false);

  const sectorMap = Object.fromEntries(SECTORS.map((s) => [s.id, s]));

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  function handleReset() {
    if (confirm('Reset account and clear all data? This will sign you out.')) {
      resetAccount();
      navigate('/');
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h1 className="display" style={styles.title}>Account</h1>
      </div>

      <div style={styles.scroll}>
        {/* Profile card */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.profileName}>{user?.name || 'Demo User'}</div>
            <div style={styles.profileEmail}>{user?.email || ''}</div>
          </div>
          <div style={{
            ...styles.tierBadge,
            background:
              subscription === 'max' ? 'rgba(245,158,11,0.15)' :
              subscription === 'explorer' ? 'rgba(212,175,55,0.15)' :
              'var(--card-alt)',
            color:
              subscription === 'max' ? 'var(--gold-deep)' :
              subscription === 'explorer' ? 'var(--accent)' :
              'var(--dim-light)',
            borderColor:
              subscription === 'max' ? 'rgba(245,158,11,0.3)' :
              subscription === 'explorer' ? 'rgba(212,175,55,0.3)' :
              'var(--border)',
          }}>
            {subscription === 'max' && <Icon name="crown" size={11} strokeWidth={2.5} />}
            {subscription === 'free' ? 'Free' : subscription === 'explorer' ? 'Explorer' : 'Max'}
          </div>
        </div>

        {/* Upgrade CTA */}
        {subscription !== 'max' && (
          <button onClick={() => setShowPricing(true)} style={styles.upgradeCard}>
            <div style={styles.upgradeLeft}>
              <Icon name="crown" size={20} color="var(--accent)" />
              <div>
                <div style={styles.upgradeTitle}>Unlock more signals</div>
                <div style={styles.upgradeSub}>Upgrade for unlimited access</div>
              </div>
            </div>
            <Icon name="chevronRight" size={18} color="var(--accent)" />
          </button>
        )}

        {/* Sectors summary */}
        <div className="section-label">Your Sectors</div>
        <div style={styles.sectorList}>
          {selectedSectors.length === 0 && (
            <div style={styles.emptySector}>No sectors selected</div>
          )}
          {selectedSectors.map((id) => {
            const sec = sectorMap[id];
            if (!sec) return null;
            return (
              <div key={id} style={{ ...styles.sectorChip, borderColor: `rgba(${sec.rgb},0.3)`, background: `rgba(${sec.rgb},0.08)` }}>
                <span>{sec.emoji}</span>
                <span style={{ color: sec.color, fontWeight: 600 }}>{sec.label}</span>
              </div>
            );
          })}
        </div>

        {/* Menu */}
        <div className="section-label" style={{ marginTop: 18 }}>Settings</div>
        <MenuRow icon="bell"        label="Notifications"     onClick={() => alert('Notifications coming soon')} />
        <MenuRow icon="grid"        label="Edit Sectors"      onClick={() => navigate('/sectors')} />
        <MenuRow icon="shield"      label="Privacy & Data"    onClick={() => alert('Privacy page placeholder')} />
        <MenuRow icon="scale"       label="Terms & Risk"      onClick={() => navigate('/legal')} />
        <MenuRow icon="alert"       label="Reset Account"     onClick={handleReset} danger />
        <MenuRow icon="logout"      label="Sign Out"          onClick={handleSignOut} />

        <div style={styles.footer}>
          <div style={styles.footerBrand}>SignalDrift</div>
          <div style={styles.footerVersion}>v0.1.0 · Demo Build</div>
          <div style={styles.footerLegal}>
            Not a registered broker-dealer.<br />
            Information for educational purposes only.
          </div>
        </div>
      </div>

      {showPricing && <PricingSheet onClose={() => setShowPricing(false)} onSelect={(tier) => { upgradeTo(tier); setShowPricing(false); }} current={subscription} />}
    </div>
  );
}

function MenuRow({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} style={styles.menuRow}>
      <Icon name={icon} size={18} color={danger ? 'var(--red)' : 'var(--text-soft)'} />
      <span style={{ ...styles.menuLabel, color: danger ? 'var(--red)' : 'var(--text-soft)' }}>{label}</span>
      <Icon name="chevronRight" size={16} color="var(--dim)" />
    </button>
  );
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '3 sectors',
      '10 stocks in watchlist',
      'Top 2 daily signals',
      'Basic AI predictions',
    ],
  },
  {
    id: 'explorer',
    name: 'Explorer',
    price: '$14',
    period: '/month',
    featured: true,
    features: [
      'Unlimited sectors',
      'Unlimited watchlist',
      'All signals (1H / 4H / 1D)',
      'Full news + sentiment',
      '30 AI chats / day',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    price: '$39',
    period: '/month',
    gold: true,
    features: [
      'Everything in Explorer',
      'Premium AI predictions',
      'Unlimited AI chat',
      'Priority signal alerts',
      'Advanced dashboard',
    ],
  },
];

function PricingSheet({ onClose, onSelect, current }) {
  return (
    <>
      <div style={pricingStyles.backdrop} onClick={onClose} />
      <div className="slide-up" style={pricingStyles.sheet}>
        <div style={pricingStyles.handle} />
        <div style={pricingStyles.title}>Choose Your Plan</div>
        <div style={pricingStyles.sub}>Unlock the full SignalDrift experience</div>
        <div style={pricingStyles.list}>
          {PLANS.map((p) => {
            const isCurrent = current === p.id;
            return (
              <div
                key={p.id}
                style={{
                  ...pricingStyles.plan,
                  borderColor: p.featured ? 'var(--accent)' : p.gold ? 'var(--gold-deep)' : 'var(--border)',
                  background: p.featured
                    ? 'rgba(212,175,55,0.06)'
                    : p.gold
                    ? 'rgba(245,158,11,0.05)'
                    : 'var(--card)',
                }}
              >
                <div style={pricingStyles.planHead}>
                  <div style={pricingStyles.planName}>{p.name}</div>
                  <div style={pricingStyles.planPrice}>
                    <span style={{ color: p.gold ? 'var(--gold-deep)' : p.featured ? 'var(--accent)' : 'var(--text)' }}>
                      {p.price}
                    </span>
                    <span style={pricingStyles.planPeriod}>{p.period}</span>
                  </div>
                </div>
                {p.featured && <div style={pricingStyles.badge}>Most Popular</div>}
                {p.gold && <div style={{ ...pricingStyles.badge, background: 'rgba(245,158,11,0.18)', color: 'var(--gold-deep)' }}>Elite</div>}
                <ul style={pricingStyles.features}>
                  {p.features.map((f, i) => (
                    <li key={i} style={pricingStyles.feature}>
                      <Icon name="check" size={12} color="var(--green)" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent}
                  onClick={() => onSelect(p.id)}
                  className={
                    isCurrent ? 'btn btn-ghost' : p.gold ? 'btn btn-gold' : 'btn btn-primary'
                  }
                  style={{ ...pricingStyles.planBtn, opacity: isCurrent ? 0.6 : 1 }}
                >
                  {isCurrent ? 'Current Plan' : `Choose ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
        <div style={pricingStyles.note}>
          Demo build: no payment required. Plans switch instantly for preview.
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
  },
  header: { padding: '20px 18px 12px' },
  title: { fontSize: 26, color: 'var(--text)' },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 18px 24px',
    WebkitOverflowScrolling: 'touch',
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    background: 'linear-gradient(135deg, var(--accent-hi), var(--accent))',
    color: '#1a1408',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    flexShrink: 0,
  },
  profileInfo: { flex: 1, minWidth: 0 },
  profileName: { fontSize: 15, fontWeight: 700, color: 'var(--text)' },
  profileEmail: { fontSize: 12, color: 'var(--dim-light)', marginTop: 2 },
  tierBadge: {
    padding: '5px 10px',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  upgradeCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(245,158,11,0.04))',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  upgradeLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  upgradeTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text)', textAlign: 'left' },
  upgradeSub: { fontSize: 11, color: 'var(--dim-light)', marginTop: 2, textAlign: 'left' },
  sectorList: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  emptySector: { fontSize: 12, color: 'var(--dim-light)', padding: 6 },
  sectorChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 10px',
    borderRadius: 16,
    border: '1px solid',
    fontSize: 11,
  },
  menuRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '14px 14px',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    marginBottom: 6,
    textAlign: 'left',
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: 500 },
  footer: { textAlign: 'center', padding: '32px 12px 8px' },
  footerBrand: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-soft)', letterSpacing: -0.5 },
  footerVersion: { fontSize: 11, color: 'var(--dim-light)', marginTop: 2 },
  footerLegal: { fontSize: 10, color: 'var(--dim)', marginTop: 14, lineHeight: 1.5 },
};

const pricingStyles = {
  backdrop: {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    zIndex: 10,
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    background: 'var(--bg-elev)',
    borderTop: '1px solid var(--border)',
    borderRadius: '24px 24px 0 0',
    padding: '12px 18px 16px',
    paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
    zIndex: 11,
    maxHeight: '88%',
    display: 'flex',
    flexDirection: 'column',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    background: 'var(--border)',
    margin: '0 auto 14px',
  },
  title: { fontSize: 20, fontWeight: 800, color: 'var(--text)', textAlign: 'center', fontFamily: 'var(--font-display)' },
  sub: { fontSize: 12, color: 'var(--dim-light)', textAlign: 'center', marginBottom: 16, marginTop: 4 },
  list: { flex: 1, overflowY: 'auto' },
  plan: {
    border: '1.5px solid',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    position: 'relative',
  },
  planHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  planName: { fontSize: 15, fontWeight: 800, color: 'var(--text)' },
  planPrice: { fontSize: 16, fontWeight: 700 },
  planPeriod: { fontSize: 11, color: 'var(--dim-light)', marginLeft: 4 },
  badge: {
    position: 'absolute',
    top: -8,
    right: 12,
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
    fontSize: 9,
    fontWeight: 800,
    padding: '3px 9px',
    borderRadius: 12,
    letterSpacing: 0.3,
    border: '1px solid rgba(212,175,55,0.3)',
  },
  features: { listStyle: 'none', margin: '10px 0' },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: 'var(--text-soft)',
    padding: '3px 0',
  },
  planBtn: { width: '100%', height: 38, fontSize: 13 },
  note: {
    textAlign: 'center',
    fontSize: 10,
    color: 'var(--dim)',
    paddingTop: 10,
  },
};
