// =====================
// LANGUE - MODULE GLOBAL
// =====================

// Détection langue sauvegardée
function getSavedLanguage() {
  return localStorage.getItem("lang") || "fr";
}

// Récupération objet langue
function getCurrentLangObject() {

  const lang = getSavedLanguage();

  if (lang === "en") return en;
  if (lang === "es") return es;
  return fr;
}

// Appliquer traductions
function applyTranslations() {

  const currentLang = getCurrentLangObject();

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");

    if (currentLang[key]) {
      el.textContent = currentLang[key];
    }
  });
}

function getText(key) {
  const currentLang = getCurrentLangObject();
  return currentLang[key] || key;
}

// Changer langue
function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  applyTranslations();
}

// Bouton retour
function goBack() {
    window.location.href = "game_grid.html";
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
});