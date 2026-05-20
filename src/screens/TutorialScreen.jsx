import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SLIDES = [
  { emoji: '⚡', title: 'Welcome to SignalDrift', body: 'High-conviction market signals, powered by AI. Built for people who hate being late to a move.' },
  { emoji: '📊', title: 'Live Markets',           body: 'Track 250+ tickers across 10 sectors. Real-time quotes, intraday charts, and sector flows in one screen.' },
  { emoji: '🎯', title: 'Probability Signals',     body: 'Every signal comes with a confidence score and a clear rationale. No black boxes — you see why.' },
  { emoji: '🗂️', title: 'Sector-Focused',          body: 'Organize your focus by sector — Technology, AI, Biotech, Crypto, and more. Your feed, your way.' },
  { emoji: '✨', title: 'AI Predictions',          body: 'Ask the AI for a probability-weighted forecast on any ticker, anytime. Bullish, bearish, or sideways.' },
  { emoji: '📰', title: 'News That Moves Markets', body: 'Curated headlines tagged by ticker and sentiment. Filter the noise, keep the signal.' },
  { emoji: '🔔', title: 'Smart Alerts',            body: 'Get notified when a price target hits, a signal triggers, or a major catalyst breaks.' },
  { emoji: '🚀', title: 'Ready to Start',          body: "Let's set up your sector focus and watchlist. Takes about 30 seconds." },
];

export default function TutorialScreen() {
  const { completeTutorial } = useApp();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  function next() {
    if (idx < SLIDES.length - 1) {
      setIdx(idx + 1);
    } else {
      completeTutorial();
      navigate('/sectors');
    }
  }

  function skip() {
    completeTutorial();
    navigate('/sectors');
  }

  const slide = SLIDES[idx];

  return (
    <div style={styles.root}>
      <button onClick={skip} style={styles.skip}>Skip</button>

      <div key={idx} className="fade-in" style={styles.content}>
        <div style={styles.emoji}>{slide.emoji}</div>
        <h2 className="display" style={styles.title}>{slide.title}</h2>
        <p style={styles.body}>{slide.body}</p>
      </div>

      <div style={styles.dots}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.dot,
              width: i === idx ? 22 : 6,
              background: i === idx ? 'var(--accent)' : 'var(--border)',
            }}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>

      <button onClick={next} className="btn btn-primary btn-full" style={styles.btn}>
        {idx === SLIDES.length - 1 ? 'Get Started' : 'Next'}
      </button>
    </div>
  );
}

const styles = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 24px',
    paddingTop: 'calc(20px + env(safe-area-inset-top))',
    paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
    position: 'relative',
  },
  skip: {
    position: 'absolute',
    top: 'calc(20px + env(safe-area-inset-top))',
    right: 20,
    fontSize: 13,
    color: 'var(--dim-light)',
    fontWeight: 500,
    padding: 6,
    zIndex: 1,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    textAlign: 'center',
  },
  emoji: { fontSize: 78, marginBottom: 28, lineHeight: 1 },
  title: { fontSize: 26, color: 'var(--text)', marginBottom: 14 },
  body: { fontSize: 14.5, color: 'var(--dim-light)', lineHeight: 1.65, maxWidth: 300 },
  dots: {
    display: 'flex',
    gap: 6,
    justifyContent: 'center',
    padding: '20px 0 18px',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    transition: 'width 0.25s, background 0.25s',
    cursor: 'pointer',
  },
  btn: { marginTop: 4 },
};
