const leaderboardList = document.getElementById("leaderboard-list");
const backMenu = document.getElementById("back-menu");

// Ambil data leaderboard dari localStorage
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// Fungsi untuk mendapatkan emoji berdasarkan peringkat
function getRankEmoji(rank) {
  if (rank === 0) return '🥇';
  if (rank === 1) return '🥈';
  if (rank === 2) return '🥉';
  return '';
}

if (leaderboard.length === 0) {
  leaderboardList.innerHTML = "<p>No Scores save yet 😞</p>";
} else {
  leaderboard.forEach((player, index) => {
    const li = document.createElement("li");
    const emoji = getRankEmoji(index);

    li.innerHTML = `
      <div>${player.name} - ${player.score} ${emoji}</div>
      <small>Level: ${player.level || '-'} | Date: ${player.date || '-'}</small>
    `;

    leaderboardList.appendChild(li);
  });
}

// Tombol kembali
backMenu.addEventListener("click", () => {
  window.location.href = "index.html";
});
