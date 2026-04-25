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

function showStep() {

  const step = tutoSteps[currentStep];
  const modal = document.getElementById("tutorialModal");

  modal.className = "tutorial-modal";
  modal.classList.add(step.className);

  document.getElementById("tutoTitle").textContent =
    getText(step.titleKey);

  document.getElementById("tutoText").textContent =
    getText(step.textKey);

  document.getElementById("modalPrev").textContent =
    getText("tuto_btn_prev");

  document.getElementById("modalNext").textContent =
    getText("tuto_btn_next");

  document.getElementById("modalQuit").textContent =
    getText("tuto_btn_quit");
}

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

function initTutorial() {
  generateTutorialGrid();
  showStep();
}

document.addEventListener("appReady", initTutorial);
