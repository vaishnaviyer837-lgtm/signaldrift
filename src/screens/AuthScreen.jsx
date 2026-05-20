import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

export default function AuthScreen() {
  const { signIn, signUp } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(null);

  async function submit(e) {
    e?.preventDefault?.();
    setError('');
    if (!email.trim() || !password.trim()) return setError('Please fill in all fields.');
    if (mode === 'signup' && !name.trim()) return setError('Please enter your name.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp({ name: name.trim(), email: email.trim(), password });
      } else {
        await signIn({ email: email.trim(), password });
      }
      navigate('/legal');
    } catch (err) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      <form onSubmit={submit} style={styles.scroll}>
        {/* Brand block */}
        <div className="fade-in" style={styles.brand}>
          <div style={styles.liveRow}>
            <span className="live-pulse gold" />
            <span className="overline">Live · Real-time US markets</span>
          </div>
          <h1 className="display" style={styles.brandTitle}>SignalDrift</h1>
          <p style={styles.tagline}>
            Probability-weighted market signals.<br />
            Built for people who hate being late.
          </p>
        </div>

        {/* Card */}
        <div className="slide-up" style={{ ...styles.card, animationDelay: '0.1s' }}>
          <div style={styles.modeHeader}>
            <h2 className="display" style={styles.modeTitle}>
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={styles.modeSub}>
              {mode === 'signin'
                ? 'Sign in to access live signals and your watchlist.'
                : 'Start receiving high-conviction signals in under a minute.'}
            </p>
          </div>

          {mode === 'signup' && (
            <Field
              icon="user"
              placeholder="Full name"
              value={name}
              onChange={setName}
              focused={focused === 'name'}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              autoComplete="name"
            />
          )}

          <Field
            icon="mail"
            placeholder="Email address"
            value={email}
            onChange={setEmail}
            type="email"
            focused={focused === 'email'}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            autoComplete="email"
          />

          <Field
            icon="lock"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            type={showPass ? 'text' : 'password'}
            focused={focused === 'password'}
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused(null)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            trailing={
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={styles.eyeBtn}
              >
                <Icon name={showPass ? 'eyeOff' : 'eye'} size={18} color="var(--dim-light)" />
              </button>
            }
          />

          {error && (
            <div style={styles.errorRow}>
              <Icon name="alert" size={14} color="var(--red)" />
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ marginTop: 18 }}
          >
            {loading ? '...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <div style={styles.divider}>
            <div style={styles.divLine} />
            <span style={styles.divText}>or</span>
            <div style={styles.divLine} />
          </div>

          <button
            type="button"
            onClick={() => { setMode((m) => (m === 'signin' ? 'signup' : 'signin')); setError(''); }}
            style={styles.switchBtn}
          >
            {mode === 'signin' ? (
              <>New to SignalDrift? <span style={styles.switchHi}>Create account</span></>
            ) : (
              <>Already have an account? <span style={styles.switchHi}>Sign in</span></>
            )}
          </button>
        </div>

        {/* Proof strip */}
        <div className="fade-in" style={{ ...styles.proofRow, animationDelay: '0.2s' }}>
          <ProofItem icon="flash" label="Signals in 3s" />
          <ProofItem icon="pulse" label="250+ tickers" />
          <ProofItem icon="shield" label="Bank-grade data" />
        </div>

        <p style={styles.legal}>
          By continuing you agree to our Terms of Service and Privacy Policy.<br />
          SignalDrift is not a broker and does not provide financial advice.
        </p>
      </form>
    </div>
  );
}

function Field({ icon, value, onChange, focused, onFocus, onBlur, trailing, ...rest }) {
  return (
    <div style={{
      ...styles.field,
      ...(focused ? styles.fieldFocused : {}),
    }}>
      {icon && (
        <Icon
          name={icon}
          size={18}
          color={focused ? 'var(--accent)' : 'var(--dim-light)'}
          style={{ marginRight: 10 }}
        />
      )}
      <input
        style={styles.fieldInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCorrect="off"
        spellCheck={false}
        {...rest}
      />
      {trailing}
    </div>
  );
}

function ProofItem({ icon, label }) {
  return (
    <div style={styles.proofItem}>
      <Icon name={icon} size={14} color="var(--accent)" />
      <span style={styles.proofText}>{label}</span>
    </div>
  );
}

const styles = {
  root: {
    flex: 1,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  scroll: {
    padding: '40px 24px 32px',
    paddingTop: 'calc(40px + env(safe-area-inset-top))',
    display: 'flex',
    flexDirection: 'column',
  },
  brand: { marginBottom: 28 },
  liveRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 },
  brandTitle: { fontSize: 44, color: 'var(--text)', marginBottom: 10 },
  tagline: { fontSize: 15, color: 'var(--secondary)', lineHeight: 1.55 },
  card: {
    background: 'var(--card)',
    borderRadius: 'var(--r-xl)',
    border: '1px solid var(--border)',
    padding: 22,
    boxShadow: 'var(--shadow-card)',
  },
  modeHeader: { marginBottom: 18 },
  modeTitle: { fontSize: 24, color: 'var(--text)' },
  modeSub: { fontSize: 13, color: 'var(--dim-light)', marginTop: 4, lineHeight: 1.5 },
  field: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--card-alt)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    padding: '0 14px',
    height: 50,
    marginBottom: 10,
    transition: 'border-color 0.15s, background 0.15s',
  },
  fieldFocused: {
    borderColor: 'var(--accent)',
    background: 'var(--card-hi)',
  },
  fieldInput: {
    flex: 1,
    color: 'var(--text)',
    fontSize: 15,
    height: 50,
  },
  eyeBtn: { padding: 4, display: 'flex' },
  errorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: '8px 10px',
    background: 'var(--red-dim)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--r-sm)',
  },
  errorText: { fontSize: 12, fontWeight: 600, color: 'var(--red)' },
  divider: { display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' },
  divLine: { flex: 1, height: 1, background: 'var(--border)' },
  divText: { fontSize: 10, color: 'var(--dim-light)', textTransform: 'uppercase', letterSpacing: 1.4 },
  switchBtn: { textAlign: 'center', padding: 6, fontSize: 13, color: 'var(--dim-light)', width: '100%' },
  switchHi: { color: 'var(--accent)', fontWeight: 700 },
  proofRow: { display: 'flex', justifyContent: 'space-between', marginTop: 24, marginBottom: 16, padding: '0 4px' },
  proofItem: { display: 'flex', alignItems: 'center', gap: 5 },
  proofText: { fontSize: 11, fontWeight: 600, color: 'var(--dim-light)' },
  legal: {
    fontSize: 10,
    color: 'var(--dim)',
    textAlign: 'center',
    lineHeight: 1.6,
    padding: '0 12px',
  },
};
