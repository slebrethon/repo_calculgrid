// =====================================
// js_include.js
// Chargement global intelligent
// =====================================

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;

    script.onload = () => resolve(src);
    script.onerror = () => reject(`Erreur chargement : ${src}`);

    document.head.appendChild(script);
  });
}

// =====================================
// Chargement séquentiel
// =====================================
async function loadScripts(list) {
  for (const file of list) {
    await loadScript(file);
  }
}

// =====================================
// Scripts communs à toutes les pages
// =====================================
const commonScripts = [

  // LANGUES
  "scripts/i18n/fr.js",
  "scripts/i18n/uk.js",
  "scripts/i18n/es.js",
  "scripts/i18n/it.js",
  "scripts/i18n/pt.js",

  // MODULES GLOBAUX
  "scripts/js_langchoice.js",
  "scripts/js_routes.js",

  // BOOTSTRAP
  "dist_bootstrap/js/bootstrap.bundle.min.js"
];

// =====================================
// Scripts spécifiques selon page
// =====================================
function getPageScripts() {

  const page = window.location.pathname.split("/").pop();

  switch (page) {
    case "game_index.html":
      return [];
    case "game_grid.html":
      return [
        "scripts/js_grid.js"
      ];
    case "game_score.html":
      return [
        "scripts/js_scores.js"
      ];
    case "game_params.html":
      return [
        "scripts/js_params.js"
      ];
    case "game_tuto.html":
      return [
        "scripts/js_tuto.js"
      ];
    default:
      return [];
  }
}

// =====================================
// Initialisation globale
// =====================================
async function initApp() {

  try {

    // scripts communs
    await loadScripts(commonScripts);

    // scripts page active
    await loadScripts(getPageScripts());

    // traductions
    if (typeof applyTranslations === "function") {
      applyTranslations();
    }

    // chargement score page classement
    if (typeof loadScores === "function") {
      loadScores();
    }

    // page prête
    document.dispatchEvent(new Event("appReady"));

    console.log("Application prête");

  } catch (error) {
    console.error(error);
  }
}

// =====================================
// Lancement
// =====================================
document.addEventListener("DOMContentLoaded", initApp);
