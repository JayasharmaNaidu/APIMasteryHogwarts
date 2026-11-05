import { cfg, lsGet } from '../cache';
import { Btn } from './UI';

// Control panel to watch and tweak the cache
export default function Pensieve({ log, setLog, rerender }) {
  const keys = [];
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('hp:'))
      .forEach((k) => keys.push([k, (lsGet(k) || '').length]));
  } catch { /* storage blocked */ }

  const clearCache = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('hp:c:'))
        .forEach((k) => localStorage.removeItem(k));
    } catch { /* storage blocked */ }
    setLog([]);
    rerender();
  };

  return (
    <details className="card">
      <summary>🔮 Pensieve (cache &amp; storage)</summary>
      <div className="row">
        Strategy
        <select value={cfg.strategy} onChange={(e) => { cfg.strategy = e.target.value; rerender(); }}>
          <option value="swr">stale-while-revalidate</option>
          <option value="cache">cache-first</option>
          <option value="network">network-only</option>
        </select>
        TTL
        <input
          type="number"
          min="1"
          value={cfg.ttl}
          style={{ width: 64 }}
          onChange={(e) => { cfg.ttl = +e.target.value || 1; rerender(); }}
        />
        s
        <Btn onClick={clearCache}>Clear cache</Btn>
      </div>
      <div className="mut">
        Stored keys: {keys.map((k) => `${k[0]} (${k[1]} chars)`).join(', ') || 'none'}
      </div>
      <div className="log" style={{ marginTop: 8 }}>
        {log.length
          ? log.map((l, i) => <div key={i} className={l[0]}>{l[1]}</div>)
          : 'Open a page to see cache activity. Try offline mode in the header after visiting pages once.'}
      </div>
    </details>
  );
}
