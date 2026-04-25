// =====================
// AFFICHAGE SCORE
// =====================
async function loadScores() {

  console.log("LOAD SCORES START");

  const table = document.getElementById("scoreTable");

  try {
    const res = await fetch("scripts/php_getscores.php");

    console.log("FETCH OK");

    const scores = await res.json();

    console.log("DATA:", scores);

    table.innerHTML = "";

    scores.forEach((entry, index) => {

      let row = `
        <tr>
          <td>${index + 1}</td>
          <td>${entry.score}</td>
          <td>${entry.date}</td>
        </tr>
      `;

      table.innerHTML += row;
    });

  } catch (error) {

    console.error("ERREUR:", error);
  }
  if (scores.length === 0) {
    table.innerHTML = `<tr><td colspan="3">Aucun score</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("PAGE LOADED");
  loadScores();
});
