import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';

const TABS = [
  { path: '/app',         icon: 'stats',      label: 'Markets' },
  { path: '/app/signals', icon: 'pulse',      label: 'Signals' },
  { path: '/app/predict', icon: 'sparkles',   label: 'Predict' },
  { path: '/app/news',    icon: 'newspaper',  label: 'News' },
  { path: '/app/more',    icon: 'grid',       label: 'More' },
];

export default function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav style={styles.bar}>
      {TABS.map((tab) => {
        const active = pathname === tab.path;
        return (
          <button
            key={tab.path}
            style={styles.tab}
            onClick={() => navigate(tab.path)}
          >
            <div style={{ ...styles.indicator, opacity: active ? 1 : 0 }} />
            <Icon
              name={tab.icon}
              size={22}
              color={active ? 'var(--accent)' : 'var(--dim-light)'}
              strokeWidth={active ? 2.4 : 1.8}
            />
            <span style={{
              ...styles.label,
              color: active ? 'var(--accent)' : 'var(--dim-light)',
              fontWeight: active ? 700 : 500,
            }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  bar: {
    height: 'calc(64px + env(safe-area-inset-bottom))',
    paddingBottom: 'env(safe-area-inset-bottom)',
    background: 'rgba(6, 9, 15, 0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexShrink: 0,
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    position: 'relative',
    paddingTop: 6,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 2,
    background: 'var(--accent)',
    borderRadius: 2,
    transition: 'opacity 0.2s',
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
    transition: 'color 0.2s',
  },
};
