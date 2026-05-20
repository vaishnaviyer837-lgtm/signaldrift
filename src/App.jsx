import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import AuthScreen from './screens/AuthScreen';
import LegalScreen from './screens/LegalScreen';
import TutorialScreen from './screens/TutorialScreen';
import SectorScreen from './screens/SectorScreen';
import MarketsScreen from './screens/MarketsScreen';
import SignalsScreen from './screens/SignalsScreen';
import PredictScreen from './screens/PredictScreen';
import NewsScreen from './screens/NewsScreen';
import MoreScreen from './screens/MoreScreen';
import TabBar from './components/TabBar';

export default function App() {
  const { isAuthenticated, isLoading, legalAgreed, tutorialDone, onboardingDone } = useApp();
  const { pathname } = useLocation();

  if (isLoading) {
    return (
      <div className="app-shell">
        <div className="phone-viewport">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="display" style={{ fontSize: 32, color: 'var(--accent)', letterSpacing: -1 }}>
              SignalDrift
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding flow gates
  function gate() {
    if (!isAuthenticated) return '/';
    if (!legalAgreed) return '/legal';
    if (!tutorialDone) return '/tutorial';
    if (!onboardingDone) return '/sectors';
    return '/app';
  }

  const target = gate();
  const isOnboarding = ['/', '/legal', '/tutorial', '/sectors'].includes(pathname);
  const isApp = pathname.startsWith('/app');

  return (
    <div className="app-shell">
      <div className="phone-viewport">
        <Routes>
          <Route path="/"        element={isAuthenticated ? <Navigate to={target} replace /> : <AuthScreen />} />
          <Route path="/legal"   element={!isAuthenticated ? <Navigate to="/" replace /> : <LegalScreen />} />
          <Route path="/tutorial" element={!isAuthenticated || !legalAgreed ? <Navigate to={target} replace /> : <TutorialScreen />} />
          <Route path="/sectors" element={!isAuthenticated || !legalAgreed || !tutorialDone ? <Navigate to={target} replace /> : <SectorScreen />} />

          <Route path="/app"         element={target !== '/app' ? <Navigate to={target} replace /> : <MarketsScreen />} />
          <Route path="/app/signals" element={target !== '/app' ? <Navigate to={target} replace /> : <SignalsScreen />} />
          <Route path="/app/predict" element={target !== '/app' ? <Navigate to={target} replace /> : <PredictScreen />} />
          <Route path="/app/news"    element={target !== '/app' ? <Navigate to={target} replace /> : <NewsScreen />} />
          <Route path="/app/more"    element={target !== '/app' ? <Navigate to={target} replace /> : <MoreScreen />} />

          <Route path="*" element={<Navigate to={target} replace />} />
        </Routes>

        {isApp && target === '/app' && <TabBar />}
      </div>
    </div>
  );
}
