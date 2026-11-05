import { useData } from '../hooks';
import { API } from '../api/mockApi';
import { HOUSES, standings } from '../data';
import ChartBox from '../components/ChartBox';
import { Btn, Status } from '../components/UI';

export default function Cup({ bonus, setBonus }) {
  const s = useData('houses', API.houses);

  if (!s.d) {
    return (
      <div>
        <h2>House Cup</h2>
        <Status s={s} />
      </div>
    );
  }

  const hd = s.d;
  const st = standings(hd, bonus);
  const award = (n) => setBonus({ ...bonus, [n]: (bonus[n] || 0) + 10 });

  const lines = Object.keys(HOUSES).map((n) => ({
    label: n,
    data: hd.points[n].map((p, i, a) => (i === a.length - 1 ? p + (bonus[n] || 0) : p)),
    borderColor: HOUSES[n].c,
    backgroundColor: HOUSES[n].c,
    tension: 0.3,
  }));

  return (
    <div>
      <h2>House Cup</h2>
      <div className="card">
        <h3>Points over the term</h3>
        <ChartBox type="line" labels={hd.weeks} datasets={lines} height={260} />
        <div className="row">
          Award 10 points:
          {Object.keys(HOUSES).map((n) => (
            <Btn key={n} onClick={() => award(n)}>{HOUSES[n].e} {n}</Btn>
          ))}
          <Btn onClick={() => setBonus({})}>Reset</Btn>
        </div>
        <div className="mut">
          Each click updates the same chart with chart.update() and is saved in localStorage.
        </div>
      </div>

      <div className="card">
        <h3>Current totals</h3>
        <ChartBox
          type="bar"
          labels={st.map((x) => x.n)}
          datasets={[{
            label: 'Points',
            data: st.map((x) => x.pts),
            backgroundColor: st.map((x) => HOUSES[x.n].c),
          }]}
        />
      </div>
    </div>
  );
}
