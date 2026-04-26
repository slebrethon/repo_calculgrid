// =====================================
// js_tuto.js
// Tutoriel interactif
// =====================================

const tutoSteps = [

  {
    titleKey: "tuto_step1_title",
    textKey: "tuto_step1_text",
    className: "step-target"
  },
  {
    titleKey: "tuto_step2_title",
    textKey: "tuto_step2_text",
    className: "step-pause"
  },
  {
    titleKey: "tuto_step3_title",
    textKey: "tuto_step3_text",
    className: "step-sum"
  },
  {
    titleKey: "tuto_step4_title",
    textKey: "tuto_step4_text",
    className: "step-time"
  },
  {
    titleKey: "tuto_step5_title",
    textKey: "tuto_step5_text",
    className: "step-progress"
  },
  {
    titleKey: "tuto_step6_title",
    textKey: "tuto_step6_text",
    className: "step-grid"
  },
  {
    titleKey: "tuto_step7_title",
    textKey: "tuto_step7_text",
    className: "step-buttons"
  },
  {
    titleKey: "tuto_step8_title",
    textKey: "tuto_step8_text",
    className: "step-center"
  }

];

let currentStep = 0;


// =====================
// GRID
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

      cell.textContent = Math.floor(Math.random() * 9) + 1;

      grid.appendChild(cell);
    }
  }

  // valeurs interface
  document.getElementById("target").textContent = 15;
  document.getElementById("currentSumValue").textContent = 0;
  document.getElementById("scoreValue").textContent = 0;

  document.getElementById("timeBar").style.width = "40%";
  document.getElementById("progressBar").style.width = "20%";
}


// =====================
// AFFICHAGE MODALE
// =====================
function showStep() {

  const step = tutoSteps[currentStep];
  const modal = document.getElementById("tutorialModal");

  modal.className = "tutorial-modal";
  modal.classList.add(step.className);

  document.getElementById("tutoTitle").textContent =
    getText(step.titleKey) || "";

  document.getElementById("tutoText").textContent =
    getText(step.textKey) || "";

  document.getElementById("modalPrev").textContent =
    getText("tuto_btn_prev");

  document.getElementById("modalNext").textContent =
    getText("tuto_btn_next");

  document.getElementById("modalQuit").textContent =
    getText("tuto_btn_quit");

  document.getElementById("modalPrev").disabled =
    currentStep === 0;

  document.getElementById("modalNext").disabled =
    currentStep === tutoSteps.length - 1;
}


// =====================
// NAVIGATION
// =====================
function nextStep() {

  if (currentStep < tutoSteps.length - 1) {
    currentStep++;
    showStep();
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

document.addEventListener("appReady", initTutorial);
