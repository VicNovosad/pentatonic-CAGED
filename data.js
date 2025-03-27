const keyToPattern = {
  A: { pattern: 4, fret: 0, string: 'E' },
  G: { pattern: 5, fret: 3, string: 'E' },
  E: { pattern: 1, fret: 5, string: 'E' },
  D: { pattern: 2, fret: 7, string: 'E' },
  C: { pattern: 3, fret: 10, string: 'E' }
};

const patternToShape = {
  1: { shape: 'E', startFret: 5 },
  2: { shape: 'D', startFret: 7 },
  3: { shape: 'C', startFret: 10 },
  4: { shape: 'A', startFret: 0 },
  5: { shape: 'G', startFret: 3 }
};

const patterns = {
  1: [
    { string: 0, fret: 5, note: 'A' }, { string: 0, fret: 8, note: 'C' },
    { string: 1, fret: 5, note: 'D' }, { string: 1, fret: 7, note: 'E' },
    { string: 2, fret: 5, note: 'G' }, { string: 2, fret: 7, note: 'A' },
    { string: 3, fret: 5, note: 'C' }, { string: 3, fret: 7, note: 'D' },
    { string: 4, fret: 5, note: 'E' }, { string: 4, fret: 8, note: 'G' },
    { string: 5, fret: 5, note: 'A' }, { string: 5, fret: 8, note: 'C' }
  ],
  2: [
    { string: 0, fret: 8, note: 'C' }, { string: 0, fret: 10, note: 'D' },
    { string: 1, fret: 7, note: 'E' }, { string: 1, fret: 10, note: 'G' },
    { string: 2, fret: 7, note: 'A' }, { string: 2, fret: 10, note: 'C' },
    { string: 3, fret: 7, note: 'D' }, { string: 3, fret: 9, note: 'E' },
    { string: 4, fret: 8, note: 'G' }, { string: 4, fret: 10, note: 'A' },
    { string: 5, fret: 8, note: 'C' }, { string: 5, fret: 10, note: 'D' }
  ],
  3: [
    { string: 0, fret: 10, note: 'D' }, { string: 0, fret: 12, note: 'E' },
    { string: 1, fret: 10, note: 'G' }, { string: 1, fret: 12, note: 'A' },
    { string: 2, fret: 10, note: 'C' }, { string: 2, fret: 12, note: 'D' },
    { string: 3, fret: 9, note: 'E' }, { string: 3, fret: 12, note: 'G' },
    { string: 4, fret: 10, note: 'A' }, { string: 4, fret: 13, note: 'C' },
    { string: 5, fret: 10, note: 'D' }, { string: 5, fret: 12, note: 'E' }
  ],
  4: [
    { string: 0, fret: 0, note: 'E' }, { string: 0, fret: 3, note: 'G' },
    { string: 1, fret: 0, note: 'A' }, { string: 1, fret: 3, note: 'C' },
    { string: 2, fret: 0, note: 'D' }, { string: 2, fret: 2, note: 'E' },
    { string: 3, fret: 0, note: 'G' }, { string: 3, fret: 2, note: 'A' },
    { string: 4, fret: 1, note: 'C' }, { string: 4, fret: 3, note: 'D' },
    { string: 5, fret: 0, note: 'E' }, { string: 5, fret: 3, note: 'G' }
  ],
  5: [
    { string: 0, fret: 3, note: 'G' }, { string: 0, fret: 5, note: 'A' },
    { string: 1, fret: 3, note: 'C' }, { string: 1, fret: 5, note: 'D' },
    { string: 2, fret: 2, note: 'E' }, { string: 2, fret: 5, note: 'G' },
    { string: 3, fret: 2, note: 'A' }, { string: 3, fret: 5, note: 'C' },
    { string: 4, fret: 3, note: 'D' }, { string: 4, fret: 5, note: 'E' },
    { string: 5, fret: 3, note: 'G' }, { string: 5, fret: 5, note: 'A' }
  ]
};

const patternOrder = [4, 5, 1, 2, 3];