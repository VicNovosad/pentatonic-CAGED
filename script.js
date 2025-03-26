const keyToPattern = {
  A: { pattern: 4, fret: 0, string: 'E' },
  G: { pattern: 5, fret: 3, string: 'E' },
  E: { pattern: 1, fret: 7, string: 'E' },
  D: { pattern: 2, fret: 10, string: 'E' },
  C: { pattern: 3, fret: 12, string: 'E' }
};

// Pattern to shape mapping based on the image
const patternToShape = {
  1: { shape: 'E', startFret: 7 },
  2: { shape: 'D', startFret: 10 },
  3: { shape: 'C', startFret: 12 },
  4: { shape: 'A', startFret: 0 },
  5: { shape: 'G', startFret: 3 }
};

const patterns = {
  1: [
    { string: 0, fret: 7, note: 'E' }, { string: 0, fret: 10, note: 'G' },
    { string: 1, fret: 7, note: 'A' }, { string: 1, fret: 10, note: 'C' },
    { string: 2, fret: 7, note: 'D' }, { string: 2, fret: 9, note: 'E' },
    { string: 3, fret: 7, note: 'G' }, { string: 3, fret: 9, note: 'A' },
    { string: 4, fret: 8, note: 'C' }, { string: 4, fret: 10, note: 'D' },
    { string: 5, fret: 7, note: 'E' }, { string: 5, fret: 10, note: 'G' }
  ],
  2: [
    { string: 0, fret: 10, note: 'G' }, { string: 0, fret: 12, note: 'A' },
    { string: 1, fret: 10, note: 'C' }, { string: 1, fret: 12, note: 'D' },
    { string: 2, fret: 9, note: 'E' }, { string: 2, fret: 12, note: 'G' },
    { string: 3, fret: 9, note: 'A' }, { string: 3, fret: 12, note: 'C' },
    { string: 4, fret: 10, note: 'D' }, { string: 4, fret: 12, note: 'E' },
    { string: 5, fret: 10, note: 'G' }, { string: 5, fret: 12, note: 'A' }
  ],
  3: [
    { string: 0, fret: 12, note: 'A' }, { string: 0, fret: 15, note: 'C' },
    { string: 1, fret: 12, note: 'D' }, { string: 1, fret: 15, note: 'E' },
    { string: 2, fret: 12, note: 'G' }, { string: 2, fret: 14, note: 'A' },
    { string: 3, fret: 12, note: 'C' }, { string: 3, fret: 14, note: 'D' },
    { string: 4, fret: 12, note: 'E' }, { string: 4, fret: 13, note: 'G' },
    { string: 5, fret: 12, note: 'A' }, { string: 5, fret: 15, note: 'C' }
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

// Define pattern order for determining previous and next patterns
const patternOrder = [4, 5, 1, 2, 3];

function generateFretLabels(containerSelector, totalFrets) {
  const fretLabelsContainer = document.querySelector(containerSelector);

  fretLabelsContainer.innerHTML = '';
  const openLabel = document.createElement("div");
  openLabel.textContent = "Open";
  fretLabelsContainer.appendChild(openLabel);

  for (let i = 1; i <= totalFrets; i++) {
    const fretLabel = document.createElement("div");
    fretLabel.textContent = i;
    fretLabelsContainer.appendChild(fretLabel);
  }
}

function initializeFretboard() {
  const grid = document.getElementById('fretboard-grid');
  for (let string = 0; string < 6; string++) {
    for (let fret = 0; fret < 23; fret++) {
      const cell = document.createElement('div');
      cell.dataset.string = string;
      cell.dataset.fret = fret;
      grid.appendChild(cell);
    }
  }
  updateFretboard();
}

function updatePatternLabels() {
  const patternLabels = document.getElementById('pattern-labels');
  patternLabels.innerHTML = '';

  // Create labels for each pattern
  for (let i = 0; i < 23; i++) {
    const labelDiv = document.createElement('div');
    labelDiv.className = 'pattern-label';

    // Find which pattern starts at this fret
    let patternNum = null;
    for (let p of patternOrder) {
      if (patternToShape[p].startFret === i) {
        patternNum = p;
        break;
      }
    }

    if (patternNum) {
      const shape = patternToShape[patternNum].shape;
      labelDiv.innerHTML = `
        <div class="shape ${shape}">${shape}</div>
        <div class="pattern">pattern ${patternNum}</div>
      `;
    }
    patternLabels.appendChild(labelDiv);
  }
}

function updateFretboard() {
  const key = document.getElementById('key').value;
  const isBaseOnTop = document.getElementById('string-order').checked;
  const { pattern: selectedPattern, fret, string } = keyToPattern[key];

  // Update pattern labels
  updatePatternLabels();

  // Update string labels
  const stringLabels = isBaseOnTop
    ? ['E', 'A', 'D', 'G', 'B', 'E']
    : ['E', 'B', 'G', 'D', 'A', 'E'];
  const stringDivs = document.getElementById('strings').children;
  for (let i = 0; i < stringDivs.length; i++) {
    stringDivs[i].textContent = stringLabels[i];
  }

  // Map string labels to indices based on order
  const stringMap = {};
  stringLabels.forEach((label, index) => {
    stringMap[label] = index;
  });

  const grid = document.getElementById('fretboard-grid');
  const cells = grid.children;

  // Reset all cells
  for (let cell of cells) {
    cell.className = '';
    cell.textContent = '';
  }

  // Track which patterns occupy each cell
  const cellPatterns = Array(6).fill().map(() => Array(23).fill().map(() => new Set()));

  // Apply all patterns and track occupancy
  for (let patternNum = 1; patternNum <= 5; patternNum++) {
    const patternNotes = patterns[patternNum];
    for (let note of patternNotes) {
      const originalString = note.string;
      const adjustedString = isBaseOnTop ? 5 - originalString : originalString;
      const cellIndex = adjustedString * 23 + note.fret;
      cellPatterns[adjustedString][note.fret].add(patternNum);
      cells[cellIndex].innerHTML = `<span class="note-circle">${note.note}</span>`;
    }
  }

  // Apply pattern classes and gradients
  for (let string = 0; string < 6; string++) {
    for (let fret = 0; fret < 23; fret++) {
      const cellIndex = string * 23 + fret;
      const patternSet = cellPatterns[string][fret];
      const patternArray = Array.from(patternSet);

      if (patternArray.length === 0) continue;

      if (patternArray.length === 1) {
        // Single pattern
        const patternNum = patternArray[0];
        cells[cellIndex].classList.add(`pattern-${patternNum}`);
        if (patternNum === selectedPattern) {
          cells[cellIndex].classList.add('selected-pattern');
        }
      } else {
        // Overlapping patterns: determine previous and next patterns
        const sortedPatterns = patternArray.sort((a, b) => {
          const indexA = patternOrder.indexOf(a);
          const indexB = patternOrder.indexOf(b);
          return indexA - indexB;
        });
        const prevPattern = sortedPatterns[0];
        const nextPattern = sortedPatterns[sortedPatterns.length - 1];

        // Apply gradient class
        cells[cellIndex].classList.add(`gradient-${prevPattern}-to-${nextPattern}`);
        if (prevPattern === selectedPattern || nextPattern === selectedPattern) {
          cells[cellIndex].classList.add('selected-pattern');
        }
      }
    }
  }

  // Highlight starting position
  const stringIndex = stringMap[string];
  const startCellIndex = stringIndex * 23 + fret;
  cells[startCellIndex].classList.add('start');

  // Update info
  document.getElementById('info').textContent = 
    `Key: ${key} | Start on Pattern ${selectedPattern} at Fret ${fret} on ${string} string`;
}

window.onload = initializeFretboard;
generateFretLabels(".fret-labels", 22);