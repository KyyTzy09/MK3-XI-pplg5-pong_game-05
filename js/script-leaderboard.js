const leaderboardList = document.getElementById("leaderboard-list");
const backMenu = document.getElementById("back-menu");

// Ambil data leaderboard dari localStorage
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// Fungsi untuk mendapatkan emoji berdasarkan peringkat
function getRankEmoji(rank) {
  if (rank === 0) {
    return '🥇'; // Peringkat 1 (indeks 0)
  } else if (rank === 1) {
    return '🥈'; // Peringkat 2 (indeks 1)
  } else if (rank === 2) {
    return '🥉'; // Peringkat 3 (indeks 2)
  }
  return ''; // Tidak ada emoji untuk peringkat lainnya
}

if (leaderboard.length === 0) {
  // Jika tidak ada data, tampilkan pesan
  leaderboardList.innerHTML = "<p>No Scores save yet😞</p>";
} else {
  // Ini adalah satu-satunya blok 'else' yang diperlukan
  leaderboard.forEach((player, index) => {
    const li = document.createElement("li");
    const emoji = getRankEmoji(index);
    
    // Gunakan innerHTML untuk menampilkan teks dan HTML
    li.innerHTML = `
        <div>${player.name} - ${player.score} ${emoji}</div>
        <small>Time: ${player.time || '-'}s | Games: ${player.totalPlays || '-'} | Date: ${player.date || '-'}</small>
    `;

    leaderboardList.appendChild(li);
  });
}

// Tambahkan event listener untuk tombol "Kembali ke Menu"
backMenu.addEventListener("click", () => {
  window.location.href = "index.html";
});