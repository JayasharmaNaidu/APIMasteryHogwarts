import { useEffect, useState } from 'react';
import { net } from './api/mockApi';
import { setLogger } from './cache';
import { useLS } from './hooks';
import Pensieve from './components/Pensieve';
import Hall from './pages/Hall';
import Students from './pages/Students';
import Compare from './pages/Compare';
import Cup from './pages/Cup';

const PAGES = { hall: 'Great Hall', students: 'Students', compare: 'Compare', cup: 'House Cup' };
const readHash = () => (PAGES[location.hash.slice(1)] ? location.hash.slice(1) : 'hall');

export default function App() {
  const [page, setPage] = useState(readHash);
  const [off, setOff] = useState(false);
  const [log, setLog] = useState([]);
  const [, force] = useState(0);

  // Saved in localStorage, so they survive a refresh
  const [favs, setFavs] = useLS('hp:favs', []);
  const [cmp, setCmp] = useLS('hp:compare', []);
  const [bonus, setBonus] = useLS('hp:bonus', {});

  // Registered during render so the first page load is logged too
  setLogger((c, t) =>
    setLog((l) => [...l.slice(-60), [c, new Date().toLocaleTimeString() + '  ' + t]])
  );
  net.offline = off;

  useEffect(() => {
    const f = () => setPage(readHash());
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);

  const go = (p) => { location.hash = p; setPage(p); };

  return (
    <div>
      <header>
        <div className="bar">
          <span className="brand">⚡ Hogwarts Registry</span>
          {Object.keys(PAGES).map((p) => (
            <button key={p} className={'tab' + (page === p ? ' on' : '')} onClick={() => go(p)}>
              {PAGES[p]}{p === 'compare' && cmp.length ? ` (${cmp.length})` : ''}
            </button>
          ))}
          <label className={off ? 'off' : 'mut'}>
            <input type="checkbox" checked={off} onChange={(e) => setOff(e.target.checked)} /> 🦉 Owl Post offline
          </label>
        </div>
      </header>

      <div className="wrap">
        {page === 'hall' && <Hall bonus={bonus} favs={favs} go={go} />}
        {page === 'students' && <Students favs={favs} setFavs={setFavs} cmp={cmp} setCmp={setCmp} />}
        {page === 'compare' && <Compare cmp={cmp} setCmp={setCmp} />}
        {page === 'cup' && <Cup bonus={bonus} setBonus={setBonus} />}

        <Pensieve log={log} setLog={setLog} rerender={() => force((x) => x + 1)} />
        <div className="mut">A fan-made demo. All data is made up and served by a mock API.</div>
      </div>
    </div>
  );
}
