// Concept 06: a fake API with latency, errors and an "offline" switch.
// To use a real API, replace the functions in API with fetch() calls
// and keep transform() to normalise whatever JSON comes back.
import { RAW, SK } from '../data';

export const net = { offline: false };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fakeRequest = async (fn) => {
  await sleep(350 + Math.random() * 450);
  if (net.offline) throw new Error('Owl Post is offline');
  return fn();
};

// The "raw" JSON shape the server sends...
const rawShape = (r) => ({
  id: r[0],
  fullName: r[1],
  houseName: r[2],
  year: r[3],
  skills: r[4].map((v, i) => ({ skill: SK[i], value: v })),
});

// ...and the common format the UI wants (normalising)
export function transform(raw) {
  const o = { id: raw.id, name: raw.fullName, house: raw.houseName, year: raw.year };
  raw.skills.forEach((s) => (o[s.skill] = s.value));
  o.total = SK.reduce((t, k) => t + o[k], 0);
  return o;
}

export const API = {
  // Pagination: limit, offset, next
  list: ({ limit, offset, house, q }) =>
    fakeRequest(() => {
      const l = RAW.filter(
        (r) => (!house || r[2] === house) && r[1].toLowerCase().includes(q.toLowerCase())
      );
      return {
        count: l.length,
        next:
          offset + limit < l.length
            ? `/students?limit=${limit}&offset=${offset + limit}`
            : null,
        results: l.slice(offset, offset + limit).map((r) => ({ id: r[0], name: r[1], house: r[2] })),
      };
    }),

  student: (id) =>
    fakeRequest(() => {
      const r = RAW.find((x) => x[0] === id);
      if (!r) throw new Error('404 No student with id ' + id);
      return transform(rawShape(r));
    }),

  houses: () =>
    fakeRequest(() => ({
      weeks: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'],
      points: {
        Gryffindor: [40, 95, 150, 210, 260],
        Slytherin: [55, 100, 140, 205, 250],
        Ravenclaw: [30, 70, 130, 170, 235],
        Hufflepuff: [45, 80, 120, 185, 220],
      },
    })),
};
