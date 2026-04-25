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
  if (lang === "uk") return uk;
  if (lang === "es") return es;
  if (lang === "it") return it;
  if (lang === "pt") return pt;
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
    highlightActiveLanguage();
}
// Afficher la langue
function highlightActiveLanguage() {
  const currentLang = getSavedLanguage();
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.remove("lang-active");
    if (btn.getAttribute("onclick").includes(currentLang)) {
      btn.classList.add("lang-active");
    }
  });
}
// Bouton retour
function goBack() {
  window.history.back();
}

// appel global
document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();
    highlightActiveLanguage();
});
