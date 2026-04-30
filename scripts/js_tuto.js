// =====================================
// js_tuto.js
// Tutoriel interactif complet
// =====================================

const tutoSteps = [

  {
    titleKey: "tuto_step1_title",
    textKey: "tuto_step1_text",
    className: "tuto-01"
  },
  {
    titleKey: "tuto_step2_title",
    textKey: "tuto_step2_text",
    className: "tuto-02"
  },
  {
    titleKey: "tuto_step3_title",
    textKey: "tuto_step3_text",
    className: "tuto-03"
  },
  {
    titleKey: "tuto_step4_title",
    textKey: "tuto_step4_text",
    className: "tuto-04"
  },
  {
    titleKey: "tuto_step5_title",
    textKey: "tuto_step5_text",
    className: "tuto-05"
  },
  {
    titleKey: "tuto_step6_title",
    textKey: "tuto_step6_text",
    className: "tuto-06"
  },
  {
    titleKey: "tuto_step7_title",
    textKey: "tuto_step7_text",
    className: "tuto-07"
  },
  {
    titleKey: "tuto_step8_title",
    textKey: "tuto_step8_text",
    className: "tuto-08"
  },
  {
    titleKey: "tuto_step9_title",
    textKey: "tuto_step9_text",
    className: "tuto-09"
  },
  {
    titleKey: "tuto_step10_title",
    textKey: "tuto_step10_text",
    className: "tuto-10"
  }

];

let currentStep = 0;


// =====================
// GRID DEMO
// =====================
function generateTutorialGrid() {

  const grid = document.getElementById("grid");

  if (!grid) return;

  grid.innerHTML = "";

  const rows = 11;
  const cols = 6;

  for (let r = 0; r < rows; r++) {

    for (let c = 0; c < cols; c++) {

      const cell = document.createElement("div");

      cell.classList.add("cell");

      if ((r + c) % 2 === 0) {
        cell.classList.add("white");
      } else {
        cell.classList.add("gray");
      }

      cell.textContent =
        Math.floor(Math.random() * 9) + 1;

      grid.appendChild(cell);
    }
  }

  // Valeurs interface
  const target = document.getElementById("target");
  const sum = document.getElementById("currentSumValue");
  const score = document.getElementById("scoreValue");
  const timeBar = document.getElementById("timeBar");
  const progressBar =
    document.getElementById("progressBar");

  if (target) target.textContent = 15;
  if (sum) sum.textContent = 0;
  if (score) score.textContent = 0;

  if (timeBar) {
    timeBar.style.width = "40%";
  }

  if (progressBar) {
    progressBar.style.width = "20%";
  }
}


// =====================
// AFFICHAGE ETAPE
// =====================
function showStep() {

  const step = tutoSteps[currentStep];

  const modal =
    document.getElementById("tutorialModal");

  if (!modal) return;

  // Reset classes
  modal.className = "tutorial-modal";
  modal.classList.add(step.className);

  // Titre
  const title =
    document.getElementById("tutoTitle");

  if (title) {
    title.innerHTML =
      getText(step.titleKey);
  }

  // Texte
  const text =
    document.getElementById("tutoText");

  if (text) {
    text.innerHTML =
      getText(step.textKey);
  }

  // Progression
  const total = tutoSteps.length;
  const current = currentStep + 1;

  const counter =
    document.getElementById("tutoCounter");

  if (counter) {
    counter.textContent =
      current + " / " + total;
  }

  const fill =
    document.getElementById(
      "tutoProgressFill"
    );

  if (fill) {
    fill.style.width =
      ((current / total) * 100) + "%";
  }

  // Boutons
  const btnPrev =
    document.getElementById("modalPrev");

  const btnNext =
    document.getElementById("modalNext");

  const btnQuit =
    document.getElementById("modalQuit");

  if (btnPrev) {
    btnPrev.textContent =
      getText("tuto_btn_prev");

    btnPrev.disabled =
      currentStep === 0;
  }

  if (btnNext) {

    if (currentStep === total - 1) {
      btnNext.textContent =
        getText("tuto_btn_finish") ||
        getText("tuto_btn_next");
    } else {
      btnNext.textContent =
        getText("tuto_btn_next");
    }

    btnNext.disabled = false;
  }

  if (btnQuit) {
    btnQuit.textContent =
      getText("tuto_btn_quit");
  }
}


// =====================
// NAVIGATION
// =====================
function nextStep() {

  if (
    currentStep <
    tutoSteps.length - 1
  ) {

    currentStep++;
    showStep();

  } else {

    // Dernière étape
    goToMenu();
  }
}

function prevStep() {

  if (currentStep > 0) {
    currentStep--;
    showStep();
  }
}


// =====================
// INIT
// =====================
function initTutorial() {

  generateTutorialGrid();
  showStep();
}


// =====================
// READY
// =====================
document.addEventListener(
  "appReady",
  initTutorial
);