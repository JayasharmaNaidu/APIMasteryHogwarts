import { HOUSES } from '../data';

export const Btn = ({ children, onClick, pri, disabled }) => (
  <button className={'btn' + (pri ? ' pri' : '')} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

export const Badge = ({ house }) => (
  <span className="badge" style={{ background: HOUSES[house].c }}>
    {HOUSES[house].e} {house}
  </span>
);

// Loading / error message for a useData() result
export const Status = ({ s }) => {
  if (s.l && !s.d) return <div className="mut">Owl is flying…</div>;
  if (s.e) return <div className="bad">🦉 {s.e} (no saved copy to fall back on)</div>;
  return null;
};
