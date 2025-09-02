const leaderboardList = document.getElementById("leaderboard-list");
const backMenu = document.getElementById("back-menu");

// Ambil data leaderboard
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

if (leaderboard.length === 0) {
  leaderboardList.innerHTML = "<p>Belum ada skor tersimpan</p>";
} else {
  leaderboard.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = `${player.name} - ${player.score}`;
    leaderboardList.appendChild(li);
  });
}

backMenu.addEventListener("click", () => {
  window.location.href = "index.html";
});
