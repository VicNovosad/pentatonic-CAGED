// lbl: Removed data and imported from data.js
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

// Service function to update string labels
function updateStringLabels(isBaseOnTop) {
  const stringLabels = isBaseOnTop
    ? ['E', 'A', 'D', 'G', 'B', 'E']
    : ['E', 'B', 'G', 'D', 'A', 'E'];
  const stringDivs = document.getElementById('strings').children;
  for (let i = 0; i < stringDivs.length; i++) {
    stringDivs[i].textContent = stringLabels[i];
  }
  return stringLabels;
}

// Service function to create string map
function createStringMap(stringLabels) {
  const stringMap = {};
  stringLabels.forEach((label, index) => {
    stringMap[label] = index;
  });
  return stringMap;
}

// Service function to reset all cells
function resetCells(cells) {
  for (let cell of cells) {
    cell.className = '';
    cell.textContent = '';
  }
}

// Service function to build cellPatterns array
function buildCellPatterns(isBaseOnTop) {
  const cellPatterns = Array(6).fill().map(() => Array(23).fill().map(() => new Set()));
  for (let patternNum = 1; patternNum <= 5; patternNum++) {
    const patternNotes = patterns[patternNum];
    for (let note of patternNotes) {
      const originalString = note.string;
      const adjustedString = isBaseOnTop ? 5 - originalString : originalString;
      const cellIndex = adjustedString * 23 + note.fret;
      cellPatterns[adjustedString][note.fret].add(patternNum);
    }
  }
  return cellPatterns;
}

// Service function to apply notes to cells
function applyNotes(cells, isBaseOnTop) {
  for (let patternNum = 1; patternNum <= 5; patternNum++) {
    const patternNotes = patterns[patternNum];
    for (let note of patternNotes) {
      const originalString = note.string;
      const adjustedString = isBaseOnTop ? 5 - originalString : originalString;
      const cellIndex = adjustedString * 23 + note.fret;
      cells[cellIndex].innerHTML = `<span class="note-circle">${note.note}</span>`;
    }
  }
}

// Service function to get the previous or next pattern in a circular order
function getAdjacentPattern(patternOrder, currentPattern, direction) {
  const index = patternOrder.indexOf(currentPattern);

  if (index === -1) {
    throw new Error(`Pattern ${currentPattern} not found in patternOrder.`);
  }

  if (direction === 'previous') {
    return patternOrder[(index - 1 + patternOrder.length) % patternOrder.length];
  } else if (direction === 'next') {
    return patternOrder[(index + 1) % patternOrder.length];
  } else {
    throw new Error(`Invalid direction: ${direction}. Use 'previous' or 'next'.`);
  }
}

// Service function to apply pattern styles (colors and gradients)
function applyPatternStyles(cells, selectedPattern) {
  const patternBoundaries = {};

  // Step 1: Identify first and last notes per string for each pattern
  for (let patternNum = 1; patternNum <= 5; patternNum++) {
    const patternNotes = patterns[patternNum];
    const stringMap = {};

    // Group notes by adjusted string
    for (let note of patternNotes) {
      const adjustedString = 5 - note.string; // Assuming isBaseOnTop = true
      if (!stringMap[adjustedString]) {
        stringMap[adjustedString] = [];
      }
      stringMap[adjustedString].push(note.fret);
    }

    // Store boundaries
    for (let string in stringMap) {
      const frets = stringMap[string].sort((a, b) => a - b);
      if (!patternBoundaries[patternNum]) {
        patternBoundaries[patternNum] = {};
      }
      patternBoundaries[patternNum][string] = {
        first: frets[0],
        last: frets[frets.length - 1]
      };
    }
  }

  // Step 2: Apply styles based on boundaries
  for (let patternNum = 1; patternNum <= 5; patternNum++) {
    const previousPattern = getAdjacentPattern(patternOrder, patternNum, 'previous');
    const boundaries = patternBoundaries[patternNum] || {};

    for (let string in boundaries) {
      const { first, last } = boundaries[string];
      for (let fret = first; fret <= last; fret++) {
        const cellIndex = string * 23 + fret;
        const isFirst = fret === first;
        const isLast = fret === last;

        // Base pattern class for all cells in range
        cells[cellIndex].classList.add(`pattern-${patternNum}`, 'fretboard-cell');
        if (patternNum === selectedPattern) {
          cells[cellIndex].classList.add('active-pattern');
        }

        // Add pattern-color divs for first and last cells
        if (isFirst || isLast) {
          cells[cellIndex].insertAdjacentHTML('beforeend', `
            <div class="pattern-color pattern-${previousPattern}"></div>
            <div class="pattern-color current-pattern pattern-${patternNum}"></div>
          `);
        }
      }
    }
  }
}

function updateFretboard() {
  const key = document.getElementById('key').value;
  const isBaseOnTop = true; // Always act as if the checkbox was turned on
  const { pattern: selectedPattern, fret, string } = keyToPattern[key];

  // Update pattern labels
  updatePatternLabels();

  // Update string labels and create string map
  const stringLabels = updateStringLabels(isBaseOnTop);
  const stringMap = createStringMap(stringLabels);

  const grid = document.getElementById('fretboard-grid');
  const cells = grid.children;

  // Reset all cells
  resetCells(cells);

  applyNotes(cells, isBaseOnTop);
  
  // Apply pattern styles
  applyPatternStyles(cells, selectedPattern);

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