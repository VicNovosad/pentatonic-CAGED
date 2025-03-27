const canvas = document.getElementById('fretboard');
const ctx = canvas.getContext('2d');
const fretWidth = 40;
const stringHeight = 40;
const totalFrets = 23;
const totalStrings = 6;

// Pattern colors to match the image
const patternColors = {
  1: 'rgba(153, 102, 204, 0.5)', // Purple (E shape)
  2: 'rgba(255, 153, 51, 0.5)',  // Orange (D shape)
  3: 'rgba(51, 153, 255, 0.5)',  // Blue (C shape)
  4: 'rgba(255, 102, 102, 0.5)', // Pink (A shape)
  5: 'rgba(102, 204, 102, 0.5)'  // Green (G shape)
};
const activePatternColors = {
  1: 'rgba(153, 102, 204, 1)',
  2: 'rgba(255, 153, 51, 1)',
  3: 'rgba(51, 153, 255, 1)',
  4: 'rgba(255, 102, 102, 1)',
  5: 'rgba(102, 204, 102, 1)'
};

function drawFretboard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw frets
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  for (let fret = 0; fret <= totalFrets; fret++) {
    const x = fret * fretWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, totalStrings * stringHeight);
    ctx.stroke();
  }

  // Draw strings
  for (let string = 0; string <= totalStrings; string++) {
    const y = string * stringHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(totalFrets * fretWidth, y);
    ctx.stroke();
  }

  // Draw string labels
  ctx.fillStyle = '#000';
  ctx.font = 'bold 14px Arial';
  const stringLabels = ['E', 'A', 'D', 'G', 'B', 'E'];
  for (let string = 0; string < totalStrings; string++) {
    ctx.fillText(stringLabels[string], -2, (string + 0.5) * stringHeight + 5);
  }

  // Draw fret labels
  ctx.font = '12px Arial';
  for (let fret = 0; fret < totalFrets; fret++) {
    ctx.fillText(fret === 0 ? 'Open' : fret, fret * fretWidth + 10, -5);
  }
}

function applyPatterns(selectedPattern) {
  const patternBoundaries = {};
  const isBaseOnTop = true;

  // Identify pattern boundaries and note positions
  for (let patternNum = 1; patternNum <= 5; patternNum++) {
    const patternNotes = patterns[patternNum];
    const stringMap = {};

    for (let note of patternNotes) {
      const adjustedString = isBaseOnTop ? 5 - note.string : note.string;
      if (!stringMap[adjustedString]) {
        stringMap[adjustedString] = [];
      }
      stringMap[adjustedString].push(note.fret);
    }

    for (let string in stringMap) {
      const frets = stringMap[string].sort((a, b) => a - b);
      if (!patternBoundaries[patternNum]) {
        patternBoundaries[patternNum] = {};
      }
      patternBoundaries[patternNum][string] = {
        first: frets[0],
        last: frets[frets.length - 1],
        frets: frets
      };
    }
  }

  // Draw pattern labels above fretboard
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  for (let patternNum = 1; patternNum <= 5; patternNum++) {
    const startFret = patternToShape[patternNum].startFret;
    const shape = patternToShape[patternNum].shape;
    const x = startFret * fretWidth + fretWidth / 2;
    ctx.fillStyle = patternColors[patternNum].replace('0.5', '1'); // Full opacity for text
    ctx.fillText(`${shape} shape`, x, -40);
    ctx.fillText(`pattern ${patternNum}`, x, -25);
  }

  // Draw pattern rectangles with half-width edges
  for (let patternNum = 1; patternNum <= 5; patternNum++) {
    const boundaries = patternBoundaries[patternNum] || {};
    ctx.fillStyle = patternNum === selectedPattern ? activePatternColors[patternNum] : patternColors[patternNum];

    for (let string in boundaries) {
      const { first, last, frets } = boundaries[string];
      const y = string * stringHeight;
      const height = stringHeight;

      if (first === last) {
        const x = first * fretWidth + fretWidth / 4;
        const width = fretWidth / 2;
        ctx.fillRect(x, y, width, height);
      } else {
        const xStart = first * fretWidth + fretWidth / 2;
        const xEnd = last * fretWidth + fretWidth / 2;
        const width = xEnd - xStart;
        ctx.fillRect(xStart, y, width, height);
      }
    }
  }

  // Draw notes
  for (let patternNum = 1; patternNum <= 5; patternNum++) {
    const patternNotes = patterns[patternNum];
    for (let note of patternNotes) {
      const adjustedString = isBaseOnTop ? 5 - note.string : note.string;
      const x = note.fret * fretWidth + fretWidth / 2;
      const y = adjustedString * stringHeight + stringHeight / 2;

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(note.note, x, y);
    }
  }
}

function createStringMap(stringLabels) {
  const stringMap = {};
  stringLabels.forEach((label, index) => {
    stringMap[label] = index;
  });
  return stringMap;
}

function updateFretboard() {
  const key = document.getElementById('key').value;
  const { pattern: selectedPattern, fret, string } = keyToPattern[key];

  drawFretboard();
  applyPatterns(selectedPattern);

  // Highlight starting position
  const stringMap = createStringMap(['E', 'A', 'D', 'G', 'B', 'E']);
  const stringIndex = stringMap[string];
  const x = fret * fretWidth + fretWidth / 2;
  const y = stringIndex * stringHeight + stringHeight / 2;
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, 2 * Math.PI);
  ctx.stroke();

  document.getElementById('info').textContent = 
    `Key: ${key} | Start on Pattern ${selectedPattern} at Fret ${fret} on ${string} string`;
}

window.onload = updateFretboard;