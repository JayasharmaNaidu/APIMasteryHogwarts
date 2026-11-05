// Concept 08: localStorage cache with TTL, cache-first, stale-while-revalidate
// and offline fallback.
export const cfg = { strategy: 'swr', ttl: 30 }; // 'swr' | 'cache' | 'network'

let logger = () => {};
export const setLogger = (fn) => (logger = fn);

export const lsGet = (k) => {
  try { return localStorage.getItem(k); } catch { return null; }
};
export const lsSet = (k, v) => {
  try { localStorage.setItem(k, v); } catch { /* storage full or blocked */ }
};

export async function cached(key, fetcher, onData) {
  const k = 'hp:c:' + key;
  let c = null;
  try { c = JSON.parse(lsGet(k)); } catch { /* ignore bad JSON */ }
  const age = c ? (Date.now() - c.savedAt) / 1000 : 0;

  // fetch, then save { data, savedAt } as a JSON string
  const fresh = async () => {
    const data = await fetcher();
    lsSet(k, JSON.stringify({ data, savedAt: Date.now() }));
    return data;
  };

  if (cfg.strategy !== 'network' && c) {
    if (age < cfg.ttl) {
      logger('ok', `HIT ${key} (${age.toFixed(0)}s old)`);
      return c.data;
    }
    if (cfg.strategy === 'swr') {
      logger('', `STALE ${key}: shown instantly, refreshing…`);
      fresh()
        .then((d) => { logger('ok', `REFRESHED ${key}`); onData && onData(d); })
        .catch((e) => logger('bad', `Refresh failed: ${e.message}`));
      return c.data;
    }
  }

  try {
    logger('', `${c ? 'EXPIRED' : 'MISS'} ${key}, fetching…`);
    const d = await fresh();
    logger('ok', `CACHED ${key}`);
    return d;
  } catch (e) {
    if (c) {
      logger('bad', `OFFLINE fallback to saved ${key} (${e.message})`);
      return c.data;
    }
    throw e;
  }
}
