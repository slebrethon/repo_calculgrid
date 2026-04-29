// =====================
// AUDIO SETTINGS
// =====================

// Valeurs par défaut
function getAudioSettings() {
  return {
    sfx: localStorage.getItem("audio_sfx") !== "false",
    music: localStorage.getItem("audio_music") !== "false"
  };
}

// Sauvegarde
function setAudioSetting(type, value) {
  localStorage.setItem("audio_" + type, value);
}

// =====================
// INIT PAGE PARAMS
// =====================
function initParamsPage() {

  if (typeof applyTranslations === "function") {
    applyTranslations();
  }

  if (typeof highlightActiveLanguage === "function") {
    highlightActiveLanguage();
  }

  const toggleSFX = document.getElementById("toggleSFX");
  const toggleMusic = document.getElementById("toggleMusic");

  if (!toggleSFX || !toggleMusic) return;

  const audio = getAudioSettings();

  toggleSFX.checked = audio.sfx;
  toggleMusic.checked = audio.music;

  toggleSFX.addEventListener("change", () => {
    setAudioSetting("sfx", toggleSFX.checked);
  });

  toggleMusic.addEventListener("change", () => {
    setAudioSetting("music", toggleMusic.checked);
  });
}

// =====================
// Lancement via js_include.js
// =====================
document.addEventListener("appReady", initParamsPage);