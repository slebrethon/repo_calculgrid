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

document.addEventListener("DOMContentLoaded", () => {

    applyTranslations();
    highlightActiveLanguage();

    const audio = getAudioSettings();

    const toggleSFX = document.getElementById("toggleSFX");
    const toggleMusic = document.getElementById("toggleMusic");

    toggleSFX.checked = audio.sfx;
    toggleMusic.checked = audio.music;

    toggleSFX.addEventListener("change", () => {
        setAudioSetting("sfx", toggleSFX.checked);
    });

    toggleMusic.addEventListener("change", () => {
        setAudioSetting("music", toggleMusic.checked);
    });

});