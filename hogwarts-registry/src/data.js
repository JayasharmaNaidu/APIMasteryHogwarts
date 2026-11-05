// Static data used by the mock API and the UI
export const HOUSES = {
  Gryffindor: { c: '#ae0001', e: '🦁' },
  Slytherin: { c: '#2a623d', e: '🐍' },
  Ravenclaw: { c: '#2b4f9e', e: '🦅' },
  Hufflepuff: { c: '#d99a00', e: '🦡' },
};

export const SK = ['bravery', 'intellect', 'cunning', 'loyalty', 'magic'];

// [id, name, house, year, [bravery, intellect, cunning, loyalty, magic]]
export const RAW = [
  [1, 'Harry Potter', 'Gryffindor', 5, [92, 70, 55, 88, 90]],
  [2, 'Hermione Granger', 'Gryffindor', 5, [85, 99, 60, 92, 95]],
  [3, 'Ron Weasley', 'Gryffindor', 5, [80, 62, 50, 95, 68]],
  [4, 'Neville Longbottom', 'Gryffindor', 5, [90, 66, 35, 96, 64]],
  [5, 'Draco Malfoy', 'Slytherin', 5, [52, 78, 94, 45, 80]],
  [6, 'Blaise Zabini', 'Slytherin', 5, [55, 80, 85, 55, 76]],
  [7, 'Pansy Parkinson', 'Slytherin', 5, [48, 65, 82, 50, 62]],
  [8, 'Luna Lovegood', 'Ravenclaw', 4, [78, 90, 40, 94, 85]],
  [9, 'Cho Chang', 'Ravenclaw', 6, [70, 88, 55, 80, 82]],
  [10, 'Cedric Diggory', 'Hufflepuff', 7, [86, 80, 58, 97, 88]],
  [11, 'Hannah Abbott', 'Hufflepuff', 5, [60, 72, 40, 95, 66]],
  [12, 'Susan Bones', 'Hufflepuff', 5, [68, 78, 45, 93, 74]],
];

// Latest points per house (last week + any bonus points the user awarded)
export const standings = (hd, bonus) =>
  Object.keys(HOUSES).map((n) => ({
    n,
    pts: hd.points[n][hd.points[n].length - 1] + (bonus[n] || 0),
  }));
