// =====================
// DOM
// =====================
const grid = document.getElementById("grid");
const targetBox = document.getElementById("target");
const currentSumValue = document.getElementById("currentSumValue");
const scoreValue = document.getElementById("scoreValue");

const refreshBtn = document.getElementById("refresh");
const resetBtn = document.getElementById("reset");
const quitBtn = document.getElementById("quit");
const pauseBtn = document.getElementById("pauseBtn");

const progressBar = document.getElementById("progressBar");
const timeBar = document.getElementById("timeBar");

const tapSound = document.getElementById("tapSound");
const errorSound = document.getElementById("errorSound");

// =====================
// AUDIO
// =====================
function getAudioSettings() {
  return {
    sfx: localStorage.getItem("audio_sfx") !== "false",
    music: localStorage.getItem("audio_music") !== "false"
  };
}

function playSound(sound) {
  const audio = getAudioSettings();
  if (!audio.sfx) return;

  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// =====================
// VARIABLES
// =====================
const rows = 11;
const cols = 6;

let cells = [];
let selectedPath = [];
let currentSum = 0;
let targetNumber = 0;

let progress = 0;
const maxProgress = 100;

let score = 0;

let totalTime = 120;
let remainingTime = 0;
let timerInterval;

let isPaused = false;

// =====================
// UI
// =====================
function updateSumDisplay() {
  currentSumValue.textContent = currentSum;
}

function updateScoreDisplay() {
  scoreValue.textContent = score;
}

function updateProgressBar() {
  let percent = (progress / maxProgress) * 100;
  progressBar.style.width = percent + "%";
}

// =====================
// TIMER
// =====================
function startTimer() {

  clearInterval(timerInterval);

  remainingTime = 0;
  timeBar.style.width = "0%";
  timeBar.style.backgroundColor = "#4CAF50";

  timerInterval = setInterval(() => {

    if (isPaused) return;

    remainingTime++;

    let percent = (remainingTime / totalTime) * 100;
    timeBar.style.width = percent + "%";

    if (percent > 70) timeBar.style.backgroundColor = "#ff9800";
    if (percent > 90) timeBar.style.backgroundColor = "#f44336";

    if (remainingTime >= totalTime) {
      clearInterval(timerInterval);
      handleGameOver();
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

function handleOverflow() {
  selectedPath.forEach(c => c.classList.remove("error"));

  if (currentSum > targetNumber) {

    const lastCell = selectedPath[selectedPath.length - 1];

    if (!lastCell.classList.contains("error")) {
      lastCell.classList.add("error");
      playSound(errorSound);
    }
  }
}

// =====================
// CLICK
// =====================
function handleClick(cell) {

  if (isPaused) return;

  playSound(tapSound);

  const value = parseInt(cell.dataset.value);

  if (cell.classList.contains("selected")) {

    const last = selectedPath[selectedPath.length - 1];

    if (cell === last) {
      cell.classList.remove("selected", "error");
      selectedPath.pop();
      currentSum -= value;
    }

  } else {

    if (currentSum > targetNumber) return;

    if (selectedPath.length === 0 || cell.classList.contains("available")) {
      selectCell(cell, value);
    }
  }

  handleOverflow();
  updateSumDisplay();
  updateAvailableCells();

  if (currentSum === targetNumber) {
    triggerSuccessEffect();
    setTimeout(() => {
      updateGridAfterWin();
    }, 300);
  }
}

// =====================
// VOISINAGE
// =====================
function updateAvailableCells() {

  cells.flat().forEach(c => {
    c.classList.remove("available", "disabled");
  });

  if (currentSum > targetNumber) {
    cells.flat().forEach(c => {
      if (!c.classList.contains("selected")) {
        c.classList.add("disabled");
      }
    });
    return;
  }

  if (selectedPath.length === 0) return;

  const last = selectedPath[selectedPath.length - 1];
  const row = +last.dataset.row;
  const col = +last.dataset.col;

  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ];

  let available = [];

  dirs.forEach(([dr, dc]) => {
    let r = row + dr;
    let c = col + dc;

    if (cells[r] && cells[r][c] && !cells[r][c].classList.contains("selected")) {
      available.push(cells[r][c]);
    }
  });

  cells.flat().forEach(c => {
    if (c.classList.contains("selected")) return;

    if (available.includes(c)) {
      c.classList.add("available");
    } else {
      c.classList.add("disabled");
    }
  });
}

// =====================
// RESET
// =====================
function resetSelection() {

  selectedPath.forEach(c => c.classList.remove("selected", "error"));

  selectedPath = [];
  currentSum = 0;
  updateSumDisplay();

  cells.flat().forEach(c => {
    c.classList.remove("available", "disabled");
  });
}

// =====================
// VICTOIRE
// =====================
function triggerSuccessEffect() {
  targetBox.classList.add("success");
  setTimeout(() => targetBox.classList.remove("success"), 300);
}

function updateGridAfterWin() {

  let newSum = 0;

  // =====================
  // SCORE + PROGRESS
  // =====================
  let gained = selectedPath.length * 2;
  progress += gained;
  score += gained;

  if (progress > maxProgress) progress = maxProgress;

  updateProgressBar();
  updateScoreDisplay();

  // =====================
  // BONUS TEMPS
  // =====================
  let bonusTime = 5 + selectedPath.length;
  const maxBonus = 15;
  if (bonusTime > maxBonus) bonusTime = maxBonus;

  remainingTime -= bonusTime;
  if (remainingTime < 0) remainingTime = 0;

  let percent = (remainingTime / totalTime) * 100;
  timeBar.style.width = percent + "%";

  // =====================
  // RESET VISUEL COMPLET AVANT UPDATE
  // =====================
  cells.flat().forEach(cell => {
    cell.classList.remove("selected", "error", "available", "disabled");
  });

  // =====================
  // UPDATE DES CASES SELECTIONNÉES
  // =====================
  selectedPath.forEach(cell => {

    let val = Math.floor(Math.random() * 9) + 1;

    cell.dataset.value = val;
    cell.textContent = val;

    newSum += val;
  });

  // =====================
  // NOUVEL OBJECTIF
  // =====================
  targetNumber = newSum;
  targetBox.textContent = targetNumber;

  // =====================
  // RESET LOGIQUE
  // =====================
  selectedPath = [];
  currentSum = 0;
  updateSumDisplay();

  // ?? IMPORTANT
  updateAvailableCells();
}

// =====================
// GRID
// =====================
function generateGrid() {

  grid.innerHTML = "";
  selectedPath = [];
  currentSum = 0;
  updateSumDisplay();

  cells = [];

  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      cells[r][c] = null;
    }
  }

  let path = [];
  let len = Math.floor(Math.random() * 4) + 3;

  let sr = Math.floor(Math.random() * rows);
  let sc = Math.floor(Math.random() * cols);

  path.push([sr, sc]);

  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ];

  while (path.length < len) {
    let [r, c] = path[path.length - 1];

    let moves = dirs
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nr, nc]) =>
        nr >= 0 && nr < rows && nc >= 0 && nc < cols
        && !path.some(([pr, pc]) => pr === nr && pc === nc)
      );

    if (!moves.length) break;

    path.push(moves[Math.floor(Math.random() * moves.length)]);
  }

  let sum = 0;
  let values = path.map(() => {
    let v = Math.floor(Math.random() * 9) + 1;
    sum += v;
    return v;
  });

  targetNumber = sum;
  targetBox.textContent = targetNumber;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {

      let cell = document.createElement("div");
      cell.classList.add("cell");

      cell.classList.add((r + c) % 2 === 0 ? "white" : "gray");

      let idx = path.findIndex(([pr, pc]) => pr === r && pc === c);
      let val = (idx !== -1) ? values[idx] : Math.floor(Math.random() * 10);

      cell.textContent = val;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.dataset.value = val;

      cell.addEventListener("click", () => handleClick(cell));

      cells[r][c] = cell;
      grid.appendChild(cell);
    }
  }
}

// =====================
// GAME OVER
// =====================
function saveScore(finalScore) {

  fetch("scripts/php_savescores.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        score: finalScore
      })
    })
    .then(res => res.text())
    .then(data => console.log("PHP RESPONSE:", data))
    .catch(err => console.error("Erreur:", err));
}

function handleGameOver() {

  saveScore(score);

  isPaused = true;
  grid.classList.add("paused");

  cells.flat().forEach(cell => {
    cell.style.pointerEvents = "none";
  });

  const modal = new bootstrap.Modal(document.getElementById('gameOverModal'));
  modal.show();
}

function restartGame() {

  const modalEl = document.getElementById('gameOverModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  cells.flat().forEach(cell => {
    cell.style.pointerEvents = "auto";
  });

  resetGame();
}

// =====================
// RESET GAME
// =====================
function resetGame() {

  progress = 0;
  score = 0;

  updateProgressBar();
  updateScoreDisplay();

  isPaused = false;
  pauseBtn.textContent = getText("game_pause");

  grid.classList.remove("paused");

  startTimer();
  generateGrid();
}

// =====================
// EVENTS
// =====================
refreshBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetSelection);
quitBtn.addEventListener("click", goToMenu);

pauseBtn.addEventListener("click", () => {

  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = getText("game_play");
    grid.classList.add("paused");
  } else {
    pauseBtn.textContent = getText("game_pause");
    grid.classList.remove("paused");
  }
});

// =====================
// INIT
// =====================
applyTranslations();
generateGrid();
startTimer();
updateProgressBar();
updateScoreDisplay();
