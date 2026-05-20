import { useEffect, useState, useRef } from 'react';
import { tickAll } from './mockData';

/**
 * Returns a live-feeling map of { SYMBOL: { price, change, changePct, ... } }.
 * Updates every `intervalMs`. Swap implementation to Finnhub later — the hook
 * shape stays the same.
 */
export function useLiveQuotes(intervalMs = 2200) {
  const [quotes, setQuotes] = useState(() => tickAll());
  const ref = useRef();

  useEffect(() => {
    ref.current = setInterval(() => {
      setQuotes(tickAll());
    }, intervalMs);
    return () => clearInterval(ref.current);
  }, [intervalMs]);

  return quotes;
}
