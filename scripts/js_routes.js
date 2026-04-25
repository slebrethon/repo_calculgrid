// =====================
// ROUTES GLOBAL APP
// =====================
const ROUTES = {
  MENU: "game_index.html",
  GAME: "game_grid.html",
  PARAMS: "game_params.html",
  SCORE: "game_score.html",
  TUTO: "game_tuto.html"
};

// =====================
// NAVIGATION HELPERS
// =====================
function goToGame() {
  window.location.href = ROUTES.GAME;
}
function goToScore() {
  window.location.href = ROUTES.SCORE;
}
function goToParams() {
  window.location.href = ROUTES.PARAMS;
}
function goToMenu() {
  window.location.href = ROUTES.MENU;
}
function goToTuto() {
  window.location.href = ROUTES.TUTO;
}