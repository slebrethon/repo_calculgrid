// =====================
// ROUTES GLOBAL APP
// =====================
const ROUTES = {
  GAME: "game_grid.html",
  SCORE: "game_score.html",
  PARAMS: "game_params.html",
  MENU: "game_index.html"
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
