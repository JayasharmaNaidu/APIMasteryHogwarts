import { useData } from '../hooks';
import { API } from '../api/mockApi';
import { HOUSES, standings } from '../data';
import ChartBox from '../components/ChartBox';
import { Btn, Badge, Status } from '../components/UI';

export default function Hall({ bonus, favs, go }) {
  const s = useData('houses', API.houses);
  const st = s.d ? standings(s.d, bonus).sort((a, b) => b.pts - a.pts) : [];

  return (
    <div>
      <div className="hero">
        <h1>Hogwarts Registry</h1>
        <div className="mut">Browse students, compare their talents and follow the House Cup.</div>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Btn pri onClick={() => go('students')}>Browse students</Btn>
          <Btn onClick={() => go('cup')}>Watch the House Cup</Btn>
        </div>
      </div>

      <Status s={s} />

      {s.d && (
        <div className="grid">
          <div className="card">
            <h3>House Cup standings</h3>
            <ChartBox
              type="doughnut"
              labels={st.map((x) => x.n)}
              datasets={[{
                label: 'Points',
                data: st.map((x) => x.pts),
                backgroundColor: st.map((x) => HOUSES[x.n].c),
              }]}
            />
            {st.map((x, i) => (
              <div key={x.n}>{i + 1}. {HOUSES[x.n].e} {x.n}: {x.pts}</div>
            ))}
          </div>

          <div className="card">
            <h3>Your saved students</h3>
            {favs.length ? (
              favs.map((f) => (
                <div key={f.id} style={{ margin: '6px 0' }}>
                  <Badge house={f.house} /> {f.name}
                </div>
              ))
            ) : (
              <div className="mut">
                Nobody yet. Press ☆ Save on the Students page. Saved students stay after you
                refresh, thanks to localStorage.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
