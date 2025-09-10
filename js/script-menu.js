const playBtn = document.getElementById("btn-play");
const leaderboardBtn = document.getElementById("leaderboard-btn");
const nameInput = document.getElementById("player-name");

playBtn.addEventListener("click", () => {
  const playerName = nameInput.value.trim();
  if (!playerName) {
    alert("Please, input your name before playing!");
    return;
  }
  localStorage.setItem("currentPlayer", playerName);
  window.location.href = "game.html";
});

leaderboardBtn.addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});
