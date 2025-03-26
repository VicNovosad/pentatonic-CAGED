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