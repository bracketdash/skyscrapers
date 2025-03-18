const inputs = [...document.querySelectorAll("input")];
const buildings = document.querySelectorAll(".city div");
const statusBar = document.querySelector(".status-bar");

function solve(clues) {
  // TODO
  return false;
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
  console.log(clues);
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
  }, 500);
}

inputs.forEach((input) => {
  input.addEventListener("keyup", handleKeyup);
});
