// ─────────────────────────────────────────────────────────────────────────
// Icon set — inline SVG paths, no external font dependency
// All icons render at currentColor so they tint via CSS.
// ─────────────────────────────────────────────────────────────────────────
import React from 'react';

const ICONS = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4.5 5-7 8-7s6.5 2.5 8 7"/></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff: <><path d="M3 3l18 18"/><path d="M10.5 6.2A11 11 0 0 1 22 12s-1.5 3-4.5 5"/><path d="M6.5 6.5C3.9 8 2 12 2 12s3.5 7 10 7c2 0 3.7-.5 5.2-1.3"/><circle cx="12" cy="12" r="3"/></>,
  alert: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="0.5"/></>,
  check: <><polyline points="20 6 9 17 4 12"/></>,
  chevronRight: <><polyline points="9 6 15 12 9 18"/></>,
  chevronLeft: <><polyline points="15 6 9 12 15 18"/></>,
  arrowUp: <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
  arrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
  trendUp: <><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></>,
  trendDown: <><polyline points="3 7 9 13 13 9 21 17"/><polyline points="14 17 21 17 21 10"/></>,
  pulse: <><polyline points="3 12 7 12 10 4 14 20 17 12 21 12"/></>,
  sparkles: <><path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z"/><path d="M19 14l.7 1.7L21.5 16.5l-1.8.7L19 19l-.7-1.8L16.5 16.5l1.8-.8z" /></>,
  newspaper: <><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></>,
  stats: <><line x1="4" y1="20" x2="4" y2="10"/><line x1="10" y1="20" x2="10" y2="4"/><line x1="16" y1="20" x2="16" y2="14"/><line x1="20" y1="20" x2="20" y2="8"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  shield: <><path d="M12 2l8 4v6c0 5-3.5 9.4-8 10-4.5-.6-8-5-8-10V6z"/><polyline points="9 12 11 14 15 10"/></>,
  flash: <><polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2"/></>,
  scale: <><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7l-3 6a3 3 0 1 0 6 0z"/><path d="M19 7l3 6a3 3 0 1 1-6 0z"/></>,
  crown: <><path d="M3 18l2-10 5 5 2-8 2 8 5-5 2 10z"/><line x1="3" y1="21" x2="21" y2="21"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  search: <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  star: <><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></>,
  zap: <><polygon points="13 2 4 14 12 14 11 22 20 10 12 10"/></>,
};

export default function Icon({ name, size = 18, color, strokeWidth = 2, style }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
