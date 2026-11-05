import { useState } from 'react';
import { API } from '../api/mockApi';
import { cached } from '../cache';
import { HOUSES, SK } from '../data';
import ChartBox from '../components/ChartBox';
import { Btn } from '../components/UI';

const COLS = [...SK, 'total'];

export default function Compare({ cmp, setCmp }) {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState([]);
  const [busy, setBusy] = useState(false);
  const [stat, setStat] = useState('total');
  const [useCache, setUseCache] = useState(false);

  async function run(mode) {
    setBusy(true); setRows([]); setMsg([]);
    const get = (id) => (useCache ? cached('student:' + id, () => API.student(id)) : API.student(id));
    const ids = cmp.map((c) => c.id);
    const t0 = performance.now();
    const ms = () => Math.round(performance.now() - t0) + ' ms';

    try {
      if (mode === 'seq') {
        // one after another (slower)
        const out = [];
        for (const id of ids) out.push(await get(id));
        setRows(out);
        setMsg([['ok', 'Sequential: ' + ms()]]);
      } else if (mode === 'all') {
        // all at once; one failure rejects everything
        setRows(await Promise.all(ids.map(get)));
        setMsg([['ok', 'Promise.all (parallel): ' + ms()]]);
      } else {
        // all at once; keeps every result, good or bad
        const r = await Promise.allSettled(ids.map(get));
        setRows(r.filter((x) => x.status === 'fulfilled').map((x) => x.value));
        setMsg([
          ['ok', 'Promise.allSettled: ' + ms()],
          ...r.map((x, i) =>
            x.status === 'fulfilled'
              ? ['ok', '✔ ' + cmp[i].name]
              : ['bad', '✘ ' + cmp[i].name + ' → ' + x.reason.message]
          ),
        ]);
      }
    } catch (e) {
      setMsg([['bad', 'Promise.all rejected the whole batch: ' + e.message]]);
    }
    setBusy(false);
  }

  const best = {};
  if (rows.length) {
    COLS.forEach((k) => {
      best[k] = rows.reduce((b, r) => (r[k] > b[k] ? r : b), rows[0]).name; // findBest
    });
  }
  const totals = rows.map((r) => r.total);
  const avg = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
  const none = busy || !cmp.length;

  return (
    <div>
      <h2>Compare students</h2>
      <div className="card">
        {cmp.length ? (
          cmp.map((c) => (
            <span className="chip" key={c.id}>
              {c.name}
              <b onClick={() => setCmp(cmp.filter((x) => x.id !== c.id))}>×</b>
            </span>
          ))
        ) : (
          <div className="mut">Add students from the Students page first.</div>
        )}

        <div className="row">
          <Btn
            onClick={() =>
              !cmp.some((c) => c.id === 999) &&
              setCmp([...cmp, { id: 999, name: 'Unregistered Wizard', house: 'Slytherin' }])
            }
          >
            + Add mystery wizard (will fail)
          </Btn>
        </div>

        <div className="row">
          <Btn onClick={() => run('seq')} disabled={none}>Sequential</Btn>
          <Btn pri onClick={() => run('all')} disabled={none}>Parallel: Promise.all</Btn>
          <Btn onClick={() => run('settled')} disabled={none}>Promise.allSettled</Btn>
          <label className="mut">
            <input type="checkbox" checked={useCache} onChange={(e) => setUseCache(e.target.checked)} /> use cache
          </label>
        </div>

        {busy && <div className="mut">Owls are flying…</div>}
        {msg.map((m, i) => <div key={i} className={m[0]}>{m[1]}</div>)}
      </div>

      {rows.length > 0 && (
        <div className="card">
          <div className="tw">
            <table>
              <thead>
                <tr>{['name', 'house', ...COLS].map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.house}</td>
                    {COLS.map((k) => (
                      <td key={k} className={best[k] === r.name ? 'best' : ''}>{r[k]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mut">
            Highlighted = best in column · total: max {Math.max(...totals)}, min {Math.min(...totals)}, average {avg}
          </div>
          <div className="row">
            Chart stat:
            <select value={stat} onChange={(e) => setStat(e.target.value)}>
              {COLS.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
          <ChartBox
            type="bar"
            labels={rows.map((r) => r.name)}
            datasets={[{
              label: stat,
              data: rows.map((r) => r[stat]),
              backgroundColor: rows.map((r) => HOUSES[r.house].c),
            }]}
          />
        </div>
      )}
    </div>
  );
}
