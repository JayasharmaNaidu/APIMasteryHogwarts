import { useEffect, useState } from 'react';
import { cached, cfg, lsGet, lsSet } from './cache';

// Load data through the cache. `key` must describe every input of `fetcher`.
export function useData(key, fetcher) {
  const [s, set] = useState({ d: null, e: null, l: true });
  useEffect(() => {
    let alive = true;
    set((x) => ({ ...x, l: true, e: null }));
    cached(key, fetcher, (d) => alive && set({ d, e: null, l: false }))
      .then((d) => alive && set({ d, e: null, l: false }))
      .catch((e) => alive && set({ d: null, e: e.message, l: false }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, cfg.strategy]);
  return s;
}

// useState that is saved to localStorage (survives page refresh)
export function useLS(k, init) {
  const [v, set] = useState(() => {
    try { const x = lsGet(k); return x ? JSON.parse(x) : init; } catch { return init; }
  });
  useEffect(() => { lsSet(k, JSON.stringify(v)); }, [k, v]);
  return [v, set];
}
