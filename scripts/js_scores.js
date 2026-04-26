function loadScores() {

  const table = document.getElementById("scoreTable");

  let scores =
    JSON.parse(localStorage.getItem("game_scores")) || [];

  table.innerHTML = "";

  if (scores.length === 0) {
    table.innerHTML =
      `<tr><td colspan="3">Aucun score</td></tr>`;
    return;
  }

  scores.forEach((entry, index) => {

    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.score}</td>
        <td>${entry.date}</td>
      </tr>
    `;
  });
}

document.addEventListener("appReady", loadScores);