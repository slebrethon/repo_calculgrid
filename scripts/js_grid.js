// =====================================
// script.js
// Jeu principal (scope isolé)
// =====================================

(() => {

"use strict";

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
const toolsBtn = document.getElementById("toolsBtn");

const progressBar = document.getElementById("progressBar");
const timeBar = document.getElementById("timeBar");

const tapSound = document.getElementById("tapSound");
const errorSound = document.getElementById("errorSound");

// sécurité si mauvaise page
if (!grid) return;

// =====================
// VARIABLES
// =====================
const rows = 11;
const cols = 6;

let cells = [];
let selectedPath = [];
let currentSum = 0;
let targetNumber = 0;

let score = 0;

let progress = 0;
const maxProgress = 100;

let totalTime = 120;
let remainingTime = 0;
let timerInterval = null;

let isPaused = false;
let isGameOver = false;

// =====================
// TEXTES
// =====================
function txt(key) {
  if (typeof getText === "function") {
    return getText(key);
  }
  return key;
}

// =====================
// AUDIO SETTINGS
// =====================
function getAudioSettings() {
  return {
    sfx: localStorage.getItem("audio_sfx") !== "false",
    music: localStorage.getItem("audio_music") !== "false"
  };
}

function playSound(audioEl) {
  if (!audioEl) return;
  if (!getAudioSettings().sfx) return;

  audioEl.currentTime = 0;
  audioEl.play().catch(() => {});
}

// =====================
// UI
// =====================
function updateSumDisplay() {
  if (currentSumValue) {
    currentSumValue.textContent = currentSum;
  }
}

function updateScoreDisplay() {
  if (scoreValue) {
    scoreValue.textContent = score;
  }
}

function updateProgressBar() {
  if (!progressBar) return;

  const percent = (progress / maxProgress) * 100;
  progressBar.style.width = percent + "%";
}

function updateTimeBar() {
  if (!timeBar) return;

  const percent = (remainingTime / totalTime) * 100;

  timeBar.style.width = percent + "%";

  if (percent > 90) {
    timeBar.style.backgroundColor = "#f44336";
  } else if (percent > 70) {
    timeBar.style.backgroundColor = "#ff9800";
  } else {
    timeBar.style.backgroundColor = "#4CAF50";
  }
}

// =====================
// TIMER
// =====================
function startTimer() {

  clearInterval(timerInterval);

  remainingTime = 0;
  updateTimeBar();

  timerInterval = setInterval(() => {

    if (isPaused || isGameOver) return;

    remainingTime++;

    updateTimeBar();

    if (remainingTime >= totalTime) {
      gameOver();
    }

  }, 1000);
}

// bonus temps : recule de X sec
function reduceTime(seconds) {

  remainingTime -= seconds;

  if (remainingTime < 0) {
    remainingTime = 0;
  }

  updateTimeBar();
}

// =====================
// GAME OVER
// =====================
function gameOver() {

  clearInterval(timerInterval);

  saveScore(score);

  const modal = new bootstrap.Modal(
    document.getElementById("gameOverModal")
  );

  modal.show();
}

// =====================
// SCORE SAVE
// =====================
function saveScore(score) {

  let scores = JSON.parse(localStorage.getItem("game_scores")) || [];

  scores.push({
    score: score,
    date: new Date().toLocaleString()
  });

  // Trier du meilleur au pire
  scores.sort((a, b) => b.score - a.score);

  // Garder top 50
  scores = scores.slice(0, 50);

  localStorage.setItem("game_scores", JSON.stringify(scores));
}

// =====================
// GRID HELPERS
// =====================
function selectCell(cell, value) {
  cell.classList.add("selected");
  selectedPath.push(cell);
  currentSum += value;
}

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

function handleOverflow() {

  selectedPath.forEach(c => c.classList.remove("error"));

  if (currentSum > targetNumber) {

    const lastCell = selectedPath[selectedPath.length - 1];

    if (lastCell) {
      lastCell.classList.add("error");
      playSound(errorSound);
    }
  }
}

// =====================
// AVAILABLE CELLS
// =====================
function updateAvailableCells() {

  cells.flat().forEach(cell => {
    cell.classList.remove("available", "disabled");
  });

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

  const row = +last.dataset.row;
  const col = +last.dataset.col;

  const dirs = [
    [0,1],[1,0],[0,-1],[-1,0],
    [1,1],[1,-1],[-1,1],[-1,-1]
  ];

  const available = [];

  dirs.forEach(([dr, dc]) => {

    const r = row + dr;
    const c = col + dc;

    if (
      cells[r] &&
      cells[r][c] &&
      !cells[r][c].classList.contains("selected")
    ) {
      available.push(cells[r][c]);
    }

  });

  cells.flat().forEach(cell => {

    if (cell.classList.contains("selected")) return;

    if (available.includes(cell)) {
      cell.classList.add("available");
    } else {
      cell.classList.add("disabled");
    }

  });
}

// =====================
// WIN
// =====================
function triggerSuccessEffect() {

  if (!targetBox) return;

  targetBox.classList.add("success");

  setTimeout(() => {
    targetBox.classList.remove("success");
  }, 300);
}

function updateGridAfterWin() {

  let newSum = 0;

  // score
  score += selectedPath.length;
  updateScoreDisplay();

  // progression
  progress += selectedPath.length * 2;
  if (progress > maxProgress) progress = maxProgress;
  updateProgressBar();

  // bonus temps :
  // base 5 sec + bonus skill
  const bonus = Math.max(0, selectedPath.length - 3);
  reduceTime(5 + bonus);

  selectedPath.forEach(cell => {

    const val = Math.floor(Math.random() * 9) + 1;

    cell.dataset.value = val;
    cell.textContent = val;

    newSum += val;

    cell.classList.remove("selected", "error");
  });

  targetNumber = newSum;

  if (targetBox) {
    targetBox.textContent = targetNumber;
  }

  selectedPath = [];
  currentSum = 0;

  updateSumDisplay();

  cells.flat().forEach(cell => {
    cell.classList.remove("available", "disabled");
  });
}

// =====================
// CLICK
// =====================
function handleClick(cell) {

  if (isPaused || isGameOver) return;

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

    if (
      selectedPath.length === 0 ||
      cell.classList.contains("available")
    ) {
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
    }, 250);
  }
}

// =====================
// GENERATE GRID
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
  const len = Math.floor(Math.random() * 4) + 3;

  let sr = Math.floor(Math.random() * rows);
  let sc = Math.floor(Math.random() * cols);

  path.push([sr, sc]);

  const dirs = [
    [0,1],[1,0],[0,-1],[-1,0],
    [1,1],[1,-1],[-1,1],[-1,-1]
  ];

  while (path.length < len) {

    const [r, c] = path[path.length - 1];

    const moves = dirs
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nr, nc]) =>
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !path.some(([pr, pc]) =>
          pr === nr && pc === nc
        )
      );

    if (!moves.length) break;

    path.push(
      moves[Math.floor(Math.random() * moves.length)]
    );
  }

  let sum = 0;

  const values = path.map(() => {
    const v = Math.floor(Math.random() * 9) + 1;
    sum += v;
    return v;
  });

  targetNumber = sum;

  if (targetBox) {
    targetBox.textContent = targetNumber;
  }

  for (let r = 0; r < rows; r++) {

    for (let c = 0; c < cols; c++) {

      const cell = document.createElement("div");

      cell.classList.add("cell");

      if ((r + c) % 2 === 0) {
        cell.classList.add("white");
      } else {
        cell.classList.add("gray");
      }

      const idx = path.findIndex(
        ([pr, pc]) => pr === r && pc === c
      );

      const val =
        idx !== -1
          ? values[idx]
          : Math.floor(Math.random() * 10);

      cell.textContent = val;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.dataset.value = val;

      cell.addEventListener("click", () => {
        handleClick(cell);
      });

      cells[r][c] = cell;
      grid.appendChild(cell);
    }
  }
}

// =====================
// RESET GAME
// =====================
function resetGame() {

  clearInterval(timerInterval);

  isPaused = false;
  isGameOver = false;

  score = 0;
  progress = 0;

  updateScoreDisplay();
  updateProgressBar();

  if (pauseBtn) {
    pauseBtn.textContent = txt("game_pause");
    pauseBtn.classList.remove("play");
    pauseBtn.classList.add("pause");
  }

  grid.classList.remove("paused");

  generateGrid();
  startTimer();
}

// =====================
// EVENTS
// =====================
if (refreshBtn) {
  refreshBtn.addEventListener("click", resetGame);
}

if (resetBtn) {
  resetBtn.addEventListener("click", resetSelection);
}

if (quitBtn) {
  quitBtn.addEventListener("click", () => {
    if (typeof goToMenu === "function") {
      goToMenu();
    }
  });
}

if (pauseBtn) {

  pauseBtn.addEventListener("click", () => {

    isPaused = !isPaused;

    if (isPaused) {

      pauseBtn.textContent = txt("game_play");
      pauseBtn.classList.remove("pause");
      pauseBtn.classList.add("play");

      grid.classList.add("paused");

    } else {

      pauseBtn.textContent = txt("game_pause");
      pauseBtn.classList.remove("play");
      pauseBtn.classList.add("pause");

      grid.classList.remove("paused");
    }

  });
}

if (toolsBtn) {
  toolsBtn.addEventListener("click", () => {
    if (typeof goToParams === "function") {
      goToParams();
    }
  });
}

// =====================
// INIT
// =====================
function initGame() {

  if (typeof applyTranslations === "function") {
    applyTranslations();
  }

  if (pauseBtn) {
    pauseBtn.classList.add("pause");
  }

  updateScoreDisplay();
  updateProgressBar();

  generateGrid();
  startTimer();
}

document.addEventListener("appReady", initGame);

})();