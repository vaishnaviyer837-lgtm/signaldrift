import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

const KEYS = {
  USER:        '@sd_user',
  PASSWORD:    '@sd_password',
  SUBSCRIPTION:'@sd_subscription',
  ONBOARDING:  '@sd_onboarding_done',
  LEGAL:       '@sd_legal_agreed',
  TUTORIAL:    '@sd_tutorial_done',
  SECTORS:     '@sd_sectors',
  WATCHLIST:   '@sd_watchlist',
};

const safeGet = (k) => {
  try { return localStorage.getItem(k); } catch { return null; }
};
const safeSet = (k, v) => {
  try { localStorage.setItem(k, v); } catch { /* ignore */ }
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState('free');
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [legalAgreed, setLegalAgreed] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const u = safeGet(KEYS.USER);
      const s = safeGet(KEYS.SUBSCRIPTION);
      const o = safeGet(KEYS.ONBOARDING);
      const l = safeGet(KEYS.LEGAL);
      const t = safeGet(KEYS.TUTORIAL);
      const sec = safeGet(KEYS.SECTORS);
      const w = safeGet(KEYS.WATCHLIST);
      if (u) setUser(JSON.parse(u));
      if (s) setSubscription(s);
      if (o === 'true') setOnboardingDone(true);
      if (l === 'true') setLegalAgreed(true);
      if (t === 'true') setTutorialDone(true);
      if (sec) setSelectedSectors(JSON.parse(sec));
      if (w) setWatchlist(JSON.parse(w));
    } catch (e) {
      console.error('Context hydrate failed:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    const existing = safeGet(KEYS.USER);
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.email.toLowerCase() === email.toLowerCase().trim()) {
        throw new Error('An account with this email already exists.');
      }
    }
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };
    safeSet(KEYS.USER, JSON.stringify(newUser));
    safeSet(KEYS.PASSWORD, password);
    safeSet(KEYS.SUBSCRIPTION, 'free');
    setUser(newUser);
    setSubscription('free');
    return newUser;
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const userStr = safeGet(KEYS.USER);
    const storedPw = safeGet(KEYS.PASSWORD);
    if (!userStr) throw new Error('No account found. Please create one.');
    const storedUser = JSON.parse(userStr);
    if (storedUser.email.toLowerCase() !== email.toLowerCase().trim()) {
      throw new Error('Invalid email or password.');
    }
    if (storedPw !== password) throw new Error('Invalid email or password.');
    setUser(storedUser);
    const s = safeGet(KEYS.SUBSCRIPTION);
    setSubscription(s || 'free');
    return storedUser;
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const resetAccount = useCallback(() => {
    Object.values(KEYS).forEach((k) => { try { localStorage.removeItem(k); } catch {} });
    setUser(null); setSubscription('free');
    setOnboardingDone(false); setLegalAgreed(false); setTutorialDone(false);
    setSelectedSectors([]); setWatchlist([]);
  }, []);

  const completeLegal = useCallback(() => {
    safeSet(KEYS.LEGAL, 'true');
    setLegalAgreed(true);
  }, []);

  const completeTutorial = useCallback(() => {
    safeSet(KEYS.TUTORIAL, 'true');
    setTutorialDone(true);
  }, []);

  const completeOnboarding = useCallback(() => {
    safeSet(KEYS.ONBOARDING, 'true');
    setOnboardingDone(true);
  }, []);

  const saveSectors = useCallback((sectors) => {
    safeSet(KEYS.SECTORS, JSON.stringify(sectors));
    setSelectedSectors(sectors);
  }, []);

  const upgradeTo = useCallback((tier) => {
    safeSet(KEYS.SUBSCRIPTION, tier);
    setSubscription(tier);
  }, []);

  const addToWatchlist = useCallback((symbol) => {
    setWatchlist((prev) => {
      if (prev.includes(symbol)) return prev;
      const next = [...prev, symbol];
      safeSet(KEYS.WATCHLIST, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlist((prev) => {
      const next = prev.filter((s) => s !== symbol);
      safeSet(KEYS.WATCHLIST, JSON.stringify(next));
      return next;
    });
  }, []);

  const canAccessFeature = useCallback((feature) => {
    const gates = {
      unlimitedSectors:     subscription !== 'free',
      unlimitedStocks:      subscription !== 'free',
      fullAlerts:           subscription !== 'free',
      fullNews:             subscription !== 'free',
      unlimitedChat:        subscription === 'max',
      aiPredictions:        true,
      premiumAiPredictions: subscription !== 'free',
      advancedDashboard:    subscription !== 'free',
      advancedSignals:      subscription !== 'free',
    };
    return gates[feature] ?? false;
  }, [subscription]);

  const maxSectors = subscription === 'free' ? 3 : Infinity;
  const maxStocks  = subscription === 'free' ? 10 : Infinity;
  const chatLimit  = subscription === 'free' ? 5 : subscription === 'explorer' ? 30 : Infinity;

  return (
    <AppContext.Provider
      value={{
        user, subscription,
        isAuthenticated: !!user,
        isLoading,
        onboardingDone, legalAgreed, tutorialDone,
        selectedSectors, watchlist,
        maxSectors, maxStocks, chatLimit,
        signUp, signIn, signOut, resetAccount,
        completeLegal, completeTutorial, completeOnboarding,
        saveSectors, upgradeTo,
        addToWatchlist, removeFromWatchlist,
        canAccessFeature,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
