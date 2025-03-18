const inputs = [...document.querySelectorAll("input")];
const buildings = document.querySelectorAll(".city div");
const statusBar = document.querySelector(".status-bar");

function isMissingClue(clue) {
  return clue === 0 || clue === false || clue === null || clue === undefined;
}

function countVisible(line) {
  let maxHeight = 0;
  let count = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] > maxHeight) {
      maxHeight = line[i];
      count++;
    }
  }
  return count;
}

function validateSolution(grid, clues) {
  const SIZE = grid.length;
  for (let row = 0; row < SIZE; row++) {
    const leftClue = clues[5 + row];
    if (!isMissingClue(leftClue) && countVisible(grid[row]) !== leftClue) {
      return false;
    }
    const rightClue = clues[10 + row];
    if (
      !isMissingClue(rightClue) &&
      countVisible([...grid[row]].reverse()) !== rightClue
    ) {
      return false;
    }
  }
  for (let col = 0; col < SIZE; col++) {
    const colArray = Array(SIZE)
      .fill()
      .map((_, row) => grid[row][col]);
    const topClue = clues[col];
    if (!isMissingClue(topClue) && countVisible(colArray) !== topClue) {
      return false;
    }
    const bottomClue = clues[15 + col];
    if (
      !isMissingClue(bottomClue) &&
      countVisible([...colArray].reverse()) !== bottomClue
    ) {
      return false;
    }
  }
  return true;
}

function isValid(grid, row, col, value, clues) {
  const SIZE = grid.length;
  const EMPTY = 0;
  for (let c = 0; c < SIZE; c++) {
    if (grid[row][c] === value) return false;
  }
  for (let r = 0; r < SIZE; r++) {
    if (grid[r][col] === value) return false;
  }
  const originalValue = grid[row][col];
  grid[row][col] = value;
  const rowFilled = grid[row].every((cell) => cell !== EMPTY);
  if (rowFilled) {
    const leftClue = clues[5 + row];
    if (!isMissingClue(leftClue) && countVisible(grid[row]) !== leftClue) {
      grid[row][col] = originalValue;
      return false;
    }
    const rightClue = clues[10 + row];
    if (
      !isMissingClue(rightClue) &&
      countVisible([...grid[row]].reverse()) !== rightClue
    ) {
      grid[row][col] = originalValue;
      return false;
    }
  }
  const colArray = Array(SIZE)
    .fill()
    .map((_, r) => grid[r][col]);
  const colFilled = colArray.every((cell) => cell !== EMPTY);
  if (colFilled) {
    const topClue = clues[col];
    if (!isMissingClue(topClue) && countVisible(colArray) !== topClue) {
      grid[row][col] = originalValue;
      return false;
    }
    const bottomClue = clues[15 + col];
    if (
      !isMissingClue(bottomClue) &&
      countVisible([...colArray].reverse()) !== bottomClue
    ) {
      grid[row][col] = originalValue;
      return false;
    }
  }
  grid[row][col] = originalValue;
  return true;
}

function solveLoop(grid, row, col, clues) {
  const SIZE = grid.length;
  const EMPTY = 0;
  if (row === SIZE) {
    return true;
  }
  const nextRow = col === SIZE - 1 ? row + 1 : row;
  const nextCol = col === SIZE - 1 ? 0 : col + 1;
  for (let value = 1; value <= SIZE; value++) {
    if (isValid(grid, row, col, value, clues)) {
      grid[row][col] = value;
      if (solveLoop(grid, nextRow, nextCol, clues)) {
        return true;
      }
      grid[row][col] = EMPTY;
    }
  }
  return false;
}

function solve(clues) {
  const SIZE = 5;
  const EMPTY = 0;
  const grid = Array(SIZE)
    .fill()
    .map(() => Array(SIZE).fill(EMPTY));
  const solved = solveLoop(grid, 0, 0, clues);
  if (solved && validateSolution(grid, clues)) {
    return grid.flat();
  } else {
    return null;
  }
}

function handleKeyup({ target }) {
  let value = target.value.replace(/[^1-5]/g, "");
  value = parseInt(value[value.length - 1], 0);
  if (isNaN(value)) {
    value = "";
  }
  target.value = value;
  const clues = inputs.map(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? false : parsed;
  });
  if (clues.every((clue) => !clue)) {
    statusBar.className = "status-bar";
    return;
  }
  statusBar.className = "status-bar thinking";
  setTimeout(() => {
    const solution = solve(clues);
    if (solution) {
      statusBar.className = "status-bar complete";
      buildings.forEach((building, index) => {
        building.innerHTML = solution[index];
      });
    } else {
      statusBar.className = "status-bar invalid";
      buildings.forEach((building, index) => {
        building.innerHTML = "";
      });
    }
  }, 50);
}

inputs.forEach((input) => {
  input.addEventListener("keyup", handleKeyup);
});

inputs[0].focus();
