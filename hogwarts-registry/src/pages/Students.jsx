import { useState } from 'react';
import { useData } from '../hooks';
import { API } from '../api/mockApi';
import { HOUSES } from '../data';
import { Btn, Badge, Status } from '../components/UI';

export default function Students({ favs, setFavs, cmp, setCmp }) {
  const [q, setQ] = useState('');
  const [house, setHouse] = useState('');
  const [limit, setLimit] = useState(4);
  const [offset, setOffset] = useState(0);

  // The key lists every input, so each combination is cached separately
  const s = useData(`list:${house}:${q}:${limit}:${offset}`, () =>
    API.list({ limit, offset, house, q })
  );
  const d = s.d;

  const toggle = (arr, set, x) =>
    set(arr.some((a) => a.id === x.id) ? arr.filter((a) => a.id !== x.id) : [...arr, x]);

  return (
    <div>
      <h2>Students</h2>
      <div className="row">
        <input
          placeholder="Search name…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOffset(0); }}
        />
        <select value={house} onChange={(e) => { setHouse(e.target.value); setOffset(0); }}>
          <option value="">All houses</option>
          {Object.keys(HOUSES).map((n) => <option key={n}>{n}</option>)}
        </select>
        per page
        <select value={limit} onChange={(e) => { setLimit(+e.target.value); setOffset(0); }}>
          {[4, 6, 8].map((n) => <option key={n}>{n}</option>)}
        </select>
      </div>

      <Status s={s} />

      {d && (
        <div className="grid">
          {d.results.map((x) => {
            const saved = favs.some((f) => f.id === x.id);
            const inCmp = cmp.some((c) => c.id === x.id);
            return (
              <div className="card" key={x.id}>
                <Badge house={x.house} />
                <div className="nm">{x.name}</div>
                <div className="row">
                  <Btn onClick={() => toggle(favs, setFavs, x)}>{saved ? '★ Saved' : '☆ Save'}</Btn>
                  <Btn onClick={() => toggle(cmp, setCmp, x)} disabled={inCmp}>
                    {inCmp ? '✓ In compare' : '+ Compare'}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {d && !d.results.length && <div className="mut">No students match.</div>}

      {d && (
        <div className="row">
          <Btn onClick={() => setOffset(Math.max(0, offset - limit))} disabled={offset === 0}>← Prev</Btn>
          <Btn pri onClick={() => setOffset(offset + limit)} disabled={!d.next}>Next →</Btn>
          <span className="mut">
            limit={limit} offset={offset} · {d.count} found · next = {d.next || 'null'}
          </span>
        </div>
      )}
    </div>
  );
}
