// =====================
// RÉCUPÉRATION DOM
// =====================
const grid = document.getElementById("grid");
const targetBox = document.getElementById("target");
const currentSumDisplay = document.getElementById("currentSum");
const refreshBtn = document.getElementById("refresh");
const resetBtn = document.getElementById("reset");
const quitBtn = document.getElementById("quit");
const progressBar = document.getElementById("progressBar");
const timeBar = document.getElementById("timeBar");
const pauseBtn = document.getElementById("pauseBtn");

// =====================
// VARIABLES
// =====================
const rows = 11;
const cols = 6;

let cells = [];
let selectedPath = [];
let currentSum = 0;
let targetNumber = 0;
let isPaused = false;

let progress = 0;
const maxProgress = 100;

let totalTime = 120; // secondes
let remainingTime = totalTime;
let timerInterval;

// =====================
// UI
// =====================
function updateSumDisplay() {
  currentSumDisplay.textContent = "Somme : " + currentSum;
}

function updateProgressBar() {
  let percentage = (progress / maxProgress) * 100;
  progressBar.style.width = percentage + "%";
}

// =====================
// TIMER
// =====================
function startTimer() {

  clearInterval(timerInterval); // sécurité

  remainingTime = 0;

  // ✅ Reset visuel complet
  timeBar.style.width = "0%";
  timeBar.style.backgroundColor = "#4CAF50"; // ← vert par défaut

  timerInterval = setInterval(() => {

    if (isPaused) return; // ⛔ pause active

    remainingTime++;

    let percentage = (remainingTime / totalTime) * 100;
    timeBar.style.width = percentage + "%";

    if (percentage > 70) {
      timeBar.style.backgroundColor = "#ff9800";
    }
    if (percentage > 90) {
      timeBar.style.backgroundColor = "#f44336";
    }

    if (remainingTime >= totalTime) {
      clearInterval(timerInterval);
      console.log("Temps écoulé !");
    }

  }, 1000);
}

// =====================
// SÉLECTION
// =====================
function selectCell(cell, value) {
  cell.classList.add("selected");
  selectedPath.push(cell);
  currentSum += value;
}

// =====================
// OVERFLOW
// =====================
function handleOverflow() {
  selectedPath.forEach(cell => cell.classList.remove("error"));

  if (selectedPath.length === 0) return;

  if (currentSum > targetNumber) {
    const lastCell = selectedPath[selectedPath.length - 1];
    lastCell.classList.add("error");
  }
}

// =====================
// CLICK
// =====================
function handleClick(cell) {
	if (isPaused) return;
  const value = parseInt(cell.dataset.value);

  if (cell.classList.contains("selected")) {

    const lastCell = selectedPath[selectedPath.length - 1];

    if (cell === lastCell) {
      cell.classList.remove("selected", "error");
      selectedPath.pop();
      currentSum -= value;
    }

  } else {

    // 🚫 Bloquer si dépassement
    if (currentSum > targetNumber) return;

    if (selectedPath.length === 0) {
      selectCell(cell, value);
    } else {
      if (cell.classList.contains("available")) {
        selectCell(cell, value);
      }
    }
  }

  handleOverflow();
  updateSumDisplay();
  updateAvailableCells();

  // 🎉 Victoire
  if (currentSum === targetNumber) {

    triggerSuccessEffect(); // 🎉 effet visuel immédiat

    setTimeout(() => {
      updateGridAfterWin();
    }, 300);
  }
}

// =====================
// CASES DISPONIBLES
// =====================
function updateAvailableCells() {

  cells.flat().forEach(cell => {
    cell.classList.remove("available", "disabled");
  });

  // 🚫 Si dépassement → tout bloquer
  if (currentSum > targetNumber) {
    cells.flat().forEach(cell => {
      if (!cell.classList.contains("selected")) {
        cell.classList.add("disabled");
      }
    });
    return;
  }

  if (selectedPath.length === 0) return;

  const last = selectedPath[selectedPath.length - 1];
  const row = parseInt(last.dataset.row);
  const col = parseInt(last.dataset.col);

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ];

  let availableCells = [];

  directions.forEach(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;

    if (cells[r] && cells[r][c]) {
      const candidate = cells[r][c];
      if (!candidate.classList.contains("selected")) {
        availableCells.push(candidate);
      }
    }
  });

  cells.flat().forEach(cell => {

    if (cell.classList.contains("selected")) return;

    if (availableCells.includes(cell)) {
      cell.classList.add("available");
    } else {
      cell.classList.add("disabled");
    }
  });
}

// =====================
// PAUSE TIMER
// =====================
pauseBtn.addEventListener("click", () => {

  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = "PLAY";
    grid.classList.add("paused"); // 👈 effet visuel
  } else {
    pauseBtn.textContent = "PAUSE";
    grid.classList.remove("paused");
  }
});

// =====================
// RESET SÉLECTION
// =====================
function resetSelection() {
  selectedPath.forEach(cell => {
    cell.classList.remove("selected", "error");
  });

  selectedPath = [];
  currentSum = 0;
  updateSumDisplay();

  cells.flat().forEach(cell => {
    cell.classList.remove("available", "disabled");
  });
}

// =====================
// REACTUALISE GAME
// =====================
function resetGame() {
  // 🔄 Reset progression
  progress = 0;
  updateProgressBar();

  // ⏱ Reset timer
  clearInterval(timerInterval);
  startTimer();

  // 🔁 Reset grille + cible + sélection
  generateGrid();
}

// =====================
// VICTOIRE
// =====================
function updateGridAfterWin() {

  let newSum = 0;

  // 🎯 Progression
  let gain = selectedPath.length * 2;
  progress += gain;
  if (progress > maxProgress) progress = maxProgress;

  updateProgressBar();

  // 🔄 Remplacer uniquement les cases sélectionnées
  selectedPath.forEach(cell => {

    let newValue = Math.floor(Math.random() * 9) + 1;
    cell.dataset.value = newValue;
    cell.textContent = newValue;

    newSum += newValue;

    cell.classList.remove("selected", "error");
  });

  // Nouvelle cible basée sur ces cases
  targetNumber = newSum;
  targetBox.textContent = targetNumber;

  selectedPath = [];
  currentSum = 0;
  updateSumDisplay();

  cells.flat().forEach(cell => {
    cell.classList.remove("available", "disabled");
  });
}

// =====================
// EFFETE CHANGEMENT SOMME
// =====================
function triggerSuccessEffect() {
  targetBox.classList.add("success");

  setTimeout(() => {
    targetBox.classList.remove("success");
  }, 300);
}

// =====================
// GÉNÉRATION GRILLE SOLVABLE
// =====================
function generateGrid() {
  grid.innerHTML = "";
  currentSum = 0;
  selectedPath = [];
  updateSumDisplay();

  cells = [];

  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      cells[row][col] = null;
    }
  }

  let pathLength = Math.floor(Math.random() * 4) + 3;
  let path = [];

  let startRow = Math.floor(Math.random() * rows);
  let startCol = Math.floor(Math.random() * cols);

  path.push([startRow, startCol]);

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ];

  while (path.length < pathLength) {
    let [row, col] = path[path.length - 1];

    let moves = directions
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([r, c]) =>
        r >= 0 && r < rows
        && c >= 0 && c < cols
        && !path.some(([pr, pc]) => pr === r && pc === c)
      );

    if (moves.length === 0) break;

    let next = moves[Math.floor(Math.random() * moves.length)];
    path.push(next);
  }

  let solutionSum = 0;
  let pathValues = [];

  path.forEach(() => {
    let val = Math.floor(Math.random() * 9) + 1;
    pathValues.push(val);
    solutionSum += val;
  });

  targetNumber = solutionSum;
  targetBox.textContent = targetNumber;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

      const cell = document.createElement("div");
      cell.classList.add("cell");

      if ((row + col) % 2 === 0) {
        cell.classList.add("white");
      } else {
        cell.classList.add("gray");
      }

      let index = path.findIndex(([r, c]) => r === row && c === col);
      let value = (index !== -1)
        ? pathValues[index]
        : Math.floor(Math.random() * 10);

      cell.textContent = value;

      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.dataset.value = value;

      cells[row][col] = cell;

      cell.addEventListener("click", () => handleClick(cell));

      grid.appendChild(cell);
    }
  }
}

// =====================
// EVENTS
// =====================
refreshBtn.addEventListener("click", () => {
  resetGame();
  isPaused = false;
  pauseBtn.textContent = "PAUSE";
	grid.classList.remove("paused");
});
resetBtn.addEventListener("click", resetSelection);
quitBtn.addEventListener("click", () => {
  window.location.href = "game.html";
});

// =====================
// INIT
// =====================
generateGrid();
updateProgressBar();
startTimer();
