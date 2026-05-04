// =====================
// DOM
// =====================
const grid = document.getElementById('grid');
const targetBox = document.getElementById('target');
const currentSumValue = document.getElementById('currentSumValue');
const scoreValue = document.getElementById('scoreValue');
const levelValue = document.getElementById('levelValue');

const refreshBtn = document.getElementById('refresh');
const resetBtn = document.getElementById('reset');
const quitBtn = document.getElementById('quit');
const pauseBtn = document.getElementById('pauseBtn');

const progressBar = document.getElementById('progressBar');
const timeBar = document.getElementById('timeBar');

const tapSound = document.getElementById('tapSound');
const errorSound = document.getElementById('errorSound');
const winSound = document.getElementById('winSound');
const levelupSound = document.getElementById('levelupSound');
const clockSound = document.getElementById('clockSound');
const musicAmbiance = document.getElementById('musicAmbiance');

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
let level = 0;

let progress = 0;
const maxProgress = 100;

let totalTime = 120;
let remainingTime = 0;
let timerInterval;

let isPaused = false;
let clockAlertPlaying = false;

// =====================
// AUDIO SETTINGS
// =====================
function getAudioSettings() {
  return {
    sfx: localStorage.getItem('audio_sfx') !== 'false',
    music: localStorage.getItem('audio_music') !== 'false',
  };
}

// =====================
// SOUND
// =====================
function playSound(sound) {
  if (!sound) return;

  const audio = getAudioSettings();

  if (!audio.sfx) return;

  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// =====================
// MUSIC
// =====================
function startMusic() {
  if (!musicAmbiance) return;

  const audio = getAudioSettings();

  if (!audio.music) return;

  musicAmbiance.loop = true;
  musicAmbiance.volume = 0.25;
  musicAmbiance.play().catch(() => {});
}

function stopMusic() {
  if (!musicAmbiance) return;

  musicAmbiance.pause();
  musicAmbiance.currentTime = 0;
}

// =====================
// CLOCK ALERT
// =====================
function startClockAlert() {
  if (!clockSound || clockAlertPlaying) return;

  const audio = getAudioSettings();
  if (!audio.sfx) return;

  clockAlertPlaying = true;

  clockSound.loop = true;
  clockSound.volume = 0.65;
  clockSound.currentTime = 0;
  clockSound.play().catch(() => {});
}

function stopClockAlert() {
  if (!clockSound) return;

  clockAlertPlaying = false;
  clockSound.pause();
  clockSound.currentTime = 0;
}

// =====================
// UI
// =====================
function updateSumDisplay() {
  currentSumValue.textContent = currentSum;
}

function updateScoreDisplay() {
  if (scoreValue) scoreValue.textContent = score;
}

function updateLevelDisplay() {
  if (levelValue) levelValue.textContent = level;
}

function updateProgressBar() {
  const percent = (progress / maxProgress) * 100;
  progressBar.style.width = percent + '%';
}

function resetTimerBar() {
  remainingTime = 0;
  timeBar.style.width = '0%';
  timeBar.style.backgroundColor = '#4CAF50';
  stopClockAlert();
}

// =====================
// TIMER
// =====================
function startTimer() {
  clearInterval(timerInterval);

  resetTimerBar();

  timerInterval = setInterval(() => {
    if (isPaused) return;

    remainingTime++;

    const percent = (remainingTime / totalTime) * 100;

    timeBar.style.width = percent + '%';

    if (percent > 70) {
      timeBar.style.backgroundColor = '#ff9800';
      startClockAlert();
    } else {
      timeBar.style.backgroundColor = '#4CAF50';
      stopClockAlert();
    }

    if (percent > 90) {
      timeBar.style.backgroundColor = '#f44336';
    }

    if (remainingTime >= totalTime) {
      clearInterval(timerInterval);
      gameOver();
    }
  }, 1000);
}

// =====================
// GAME OVER
// =====================
function gameOver() {
  stopMusic();
  stopClockAlert();

  saveScore();

  alert(getText('game_overtitle') + '\n\n' + getText('game_overtext'));

  goToMenu();
}

// =====================
// SAVE SCORES SESSION
// =====================
function saveScore() {
  let scores = JSON.parse(localStorage.getItem('game_scores')) || [];

  scores.push({
    score: score,
    level: level,
    date: new Date().toLocaleString(),
  });

  scores.sort((a, b) => b.score - a.score);

  scores = scores.slice(0, 50);

  localStorage.setItem('game_scores', JSON.stringify(scores));
}

// =====================
// POINTS / CASE BY LEVEL
// =====================
function getPointsPerCell() {
  if (level >= 10) return 1.5;
  if (level >= 5) return 1.8;

  return 2;
}

// =====================
// SELECTION
// =====================
function selectCell(cell, value) {
  cell.classList.add('selected');
  selectedPath.push(cell);
  currentSum += value;
}

function handleOverflow() {
  selectedPath.forEach((c) => c.classList.remove('error'));

  if (currentSum > targetNumber) {
    const last = selectedPath[selectedPath.length - 1];

    last.classList.add('error');

    playSound(errorSound);
  }
}

// =====================
// CLICK CELL
// =====================
function handleClick(cell) {
  if (isPaused) return;

  playSound(tapSound);

  const value = parseInt(cell.dataset.value);

  if (cell.classList.contains('selected')) {
    const last = selectedPath[selectedPath.length - 1];

    if (cell === last) {
      cell.classList.remove('selected', 'error');
      selectedPath.pop();
      currentSum -= value;
    }
  } else {
    if (currentSum > targetNumber) return;

    if (selectedPath.length === 0 || cell.classList.contains('available')) {
      selectCell(cell, value);
    }
  }

  handleOverflow();
  updateSumDisplay();
  updateAvailableCells();

  if (currentSum === targetNumber) {
    playSound(winSound);

    setTimeout(() => {
      updateGridAfterWin();
    }, 150);
  }
}

// =====================
// NEIGHBORS
// =====================
function updateAvailableCells() {
  cells.flat().forEach((c) => {
    c.classList.remove('available', 'disabled');
  });

  if (currentSum > targetNumber) {
    cells.flat().forEach((c) => {
      if (!c.classList.contains('selected')) {
        c.classList.add('disabled');
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
    [-1, -1],
  ];

  const available = [];

  dirs.forEach(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;

    if (
      cells[r] &&
      cells[r][c] &&
      !cells[r][c].classList.contains('selected')
    ) {
      available.push(cells[r][c]);
    }
  });

  cells.flat().forEach((c) => {
    if (c.classList.contains('selected')) return;

    if (available.includes(c)) {
      c.classList.add('available');
    } else {
      c.classList.add('disabled');
    }
  });
}

// =====================
// RESET SELECTION
// =====================
function resetSelection() {
  selectedPath.forEach((c) => {
    c.classList.remove('selected', 'error');
  });

  selectedPath = [];
  currentSum = 0;

  updateSumDisplay();

  cells.flat().forEach((c) => {
    c.classList.remove('available', 'disabled');
  });
}

// =====================
// BONUS TIME
// =====================
function reduceTimeAfterWin() {
  let bonus = 5;

  if (selectedPath.length >= 5) bonus += 1;
  if (selectedPath.length >= 7) bonus += 1;

  remainingTime -= bonus;

  if (remainingTime < 0) {
    remainingTime = 0;
  }

  const percent = (remainingTime / totalTime) * 100;

  timeBar.style.width = percent + '%';

  if (percent <= 70) {
    timeBar.style.backgroundColor = '#4CAF50';
    stopClockAlert();
  }

  if (percent > 70) {
    timeBar.style.backgroundColor = '#ff9800';
    startClockAlert();
  }

  if (percent > 90) {
    timeBar.style.backgroundColor = '#f44336';
  }
}

// =====================
// WIN UPDATE
// =====================
function updateGridAfterWin() {
  let newSum = 0;

  const pointsPerCell = getPointsPerCell();
  const gain = selectedPath.length * pointsPerCell;

  score += Math.round(gain * 10);
  progress += gain;

  if (progress >= maxProgress) {
    level++;
    progress = 0;

    updateLevelDisplay();
    resetTimerBar();

    playSound(levelupSound);
  }

  updateScoreDisplay();
  updateProgressBar();

  reduceTimeAfterWin();

  selectedPath.forEach((cell) => {
    const val = Math.floor(Math.random() * 9) + 1;

    cell.dataset.value = val;
    cell.textContent = val;

    newSum += val;

    cell.classList.remove('selected', 'error');
  });

  targetNumber = newSum;
  targetBox.textContent = targetNumber;

  selectedPath = [];
  currentSum = 0;

  updateSumDisplay();

  cells.flat().forEach((c) => {
    c.classList.remove('available', 'disabled');
  });
}

// =====================
// GENERATE GRID
// =====================
function generateGrid() {
  grid.innerHTML = '';

  cells = [];

  for (let r = 0; r < rows; r++) {
    cells[r] = [];

    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');

      cell.classList.add('cell');

      if ((r + c) % 2 === 0) {
        cell.classList.add('white');
      } else {
        cell.classList.add('gray');
      }

      const val = Math.floor(Math.random() * 9) + 1;

      cell.textContent = val;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.dataset.value = val;

      cell.addEventListener('click', () => handleClick(cell));

      cells[r][c] = cell;
      grid.appendChild(cell);
    }
  }

  const a = Math.floor(Math.random() * rows);
  const b = Math.floor(Math.random() * cols);

  const c1 = Math.floor(Math.random() * rows);
  const d1 = Math.floor(Math.random() * cols);

  targetNumber =
    parseInt(cells[a][b].dataset.value) + parseInt(cells[c1][d1].dataset.value);

  targetBox.textContent = targetNumber;
}

// =====================
// RESET GAME
// =====================
function resetGame() {
  score = 0;
  level = 0;
  progress = 0;

  updateScoreDisplay();
  updateLevelDisplay();
  updateProgressBar();

  isPaused = false;

  pauseBtn.textContent = getText('game_pause');

  grid.classList.remove('paused');

  stopMusic();
  startMusic();

  startTimer();
  generateGrid();
}

// =====================
// EVENTS
// =====================
refreshBtn?.addEventListener('click', resetGame);

resetBtn?.addEventListener('click', resetSelection);

quitBtn?.addEventListener('click', () => {
  stopMusic();
  stopClockAlert();
  goToMenu();
});

pauseBtn?.addEventListener('click', () => {
  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = getText('game_play');

    grid.classList.add('paused');

    stopClockAlert();
  } else {
    pauseBtn.textContent = getText('game_pause');

    grid.classList.remove('paused');
  }
});

// =====================
// INIT
// =====================
document.addEventListener('appReady', () => {
  updateScoreDisplay();
  updateLevelDisplay();
  updateProgressBar();

  generateGrid();
  startTimer();
  startMusic();
});
