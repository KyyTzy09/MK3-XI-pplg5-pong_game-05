const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Default ukuran
let baseWidth = 1000;
let baseHeight = 600;
let scaleX = 1;
let scaleY = 1;

// Paddle
const paddle = {
  width: 140,
  height: 12,
  x: 0,
  y: 0,
  speed: 6,
  movingLeft: false,
  movingRight: false,
};

// Ball
const ball = {
  x: 0,
  y: 0,
  radius: 8,
  dx: 3, // awal lebih pelan
  dy: -3,
};

let score = 0;
let level = 1;
let lives = 3;
let isGameRunning = false;
let isGameOver = false;
let speedIncrease = 1.2;
let startTime;
let lastLevelUpScore = 0; // kontrol supaya level tidak dobel

// === LEVEL THRESHOLDS (kumulatif) ===
const levelThresholds = [
  0, // dummy
  5,
  13,
  23,
  36,
  52,
  70,
  90,
  112,
  136,
];
const MAX_LEVEL = 10;

// === SOUND EFFECT ===
const bounceSound = new Audio(
  "https://freesound.org/data/previews/82/82364_1022651-lq.mp3"
);
const loseSound = new Audio(
  "https://freesound.org/data/previews/331/331912_3248244-lq.mp3"
);
const gameOverSound = new Audio(
  "https://freesound.org/data/previews/398/398867_5121236-lq.mp3"
);
const perfectSound = new Audio(
  "https://freesound.org/data/previews/341/341695_5121236-lq.mp3"
);
const levelUpSound = new Audio(
  "https://freesound.org/data/previews/331/331912_3248244-lq.mp3"
);

// === BACKGROUND MUSIC ===
const bgMusic = new Audio(
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
);
bgMusic.loop = true;
bgMusic.volume = 0.5;
document.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play();
});

// === TEXT EFFECT ===
let floatingText = null;
function showFloatingText(message, color = "white") {
  floatingText = { text: message, color, opacity: 1, y: canvas.height / 2 };
}

// === TRAIL & LEDAKAN ===
let ballTrail = [];
let explosions = [];

function updateTrail() {
  ballTrail.unshift({ x: ball.x, y: ball.y });
  if (ballTrail.length > 10) ballTrail.pop();
}
function drawTrail() {
  ballTrail.forEach((pos, i) => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, ball.radius - i * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,204,0,${1 - i * 0.1})`;
    ctx.fill();
  });
}
function triggerExplosion(x, y) {
  explosions.push({ x, y, radius: 5, alpha: 1 });
}
function drawExplosions() {
  explosions.forEach((ex, i) => {
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${ex.alpha})`;
    ctx.fill();
    ex.radius += 2;
    ex.alpha -= 0.05;
    if (ex.alpha <= 0) explosions.splice(i, 1);
  });
}

// DOM
const scoreDisplay = document.getElementById("score");
const finalScore = document.getElementById("final-score");
const gameOverScreen = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");

// Event Listener
document.addEventListener("mousemove", movePaddleMouse);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
restartBtn.addEventListener("click", restartGame);
backBtn.addEventListener("click", () => (window.location.href = "index.html"));
window.addEventListener("resize", resizeCanvas);

function movePaddleMouse(e) {
  const rect = canvas.getBoundingClientRect();
  paddle.x = (e.clientX - rect.left) / scaleX - paddle.width / 2;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width)
    paddle.x = canvas.width - paddle.width;
}
function keyDownHandler(e) {
  if (e.key === "ArrowLeft") paddle.movingLeft = true;
  if (e.key === "ArrowRight") paddle.movingRight = true;
}
function keyUpHandler(e) {
  if (e.key === "ArrowLeft") paddle.movingLeft = false;
  if (e.key === "ArrowRight") paddle.movingRight = false;
}

function resetGame() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  // awal lebih pelan
  ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -3;
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - 30;
  score = 0;
  level = 1;
  lives = 3;
  lastLevelUpScore = 0; // reset kontrol level up
  isGameOver = false;
  ballTrail = [];
  explosions = [];
  paddle.width = 140;
  updateHUD();
}
function updateHUD() {
  scoreDisplay.textContent = `Skor⭐: ${score} | Level: ${level}/10 | Lives ❤: ${lives}`;
}

function drawPaddle() {
  ctx.fillStyle = "#1e90ff";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffcc00";
  ctx.fill();
}
function drawFloatingText() {
  if (floatingText) {
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = `rgba(${
      floatingText.color === "yellow" ? "255,255,0" : "255,255,255"
    },${floatingText.opacity})`;
    ctx.textAlign = "center";
    ctx.fillText(floatingText.text, canvas.width / 2, floatingText.y);
    floatingText.y -= 1;
    floatingText.opacity -= 0.02;
    if (floatingText.opacity <= 0) floatingText = null;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTrail();
  drawPaddle();
  drawBall();
  drawExplosions();
  drawFloatingText();
}

function update() {
  if (!isGameRunning) return;

  // Paddle movement
  if (paddle.movingLeft) paddle.x = Math.max(0, paddle.x - paddle.speed);
  if (paddle.movingRight)
    paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed);

  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall bounce
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
    bounceSound.currentTime = 0;
    bounceSound.play();
  }
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
    bounceSound.currentTime = 0;
    bounceSound.play();
  }

  // Paddle collision
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.dy > 0
  ) {
    ball.dy *= -1;

    // Hitung skor sesuai level
    let pointPerHit = 1
    score += pointPerHit;

    updateHUD();
    bounceSound.currentTime = 0;
    bounceSound.play();
    perfectSound.currentTime = 0;
    perfectSound.play();
    showFloatingText(`+${pointPerHit} point!`, "yellow");
    triggerExplosion(ball.x, ball.y);

    // === LEVEL UP CHECK ===
    if (
      level < MAX_LEVEL &&
      score >= levelThresholds[level] &&
      lastLevelUpScore < levelThresholds[level]
    ) {
      level++;
      lastLevelUpScore = score;

      ball.dx *= 1.2;
      ball.dy *= 1.2;

      paddle.width = Math.max(60, paddle.width - 10);

      showFloatingText(`LEVEL ${level} UP!`, "white");
      levelUpSound.currentTime = 0;
      levelUpSound.play();
      updateHUD();
    }
  }

  // Ball falls
  if (ball.y - ball.radius > canvas.height) {
    lives--;
    updateHUD();
    loseSound.currentTime = 0;
    loseSound.play();
    showFloatingText("OH NO!", "red");

    if (lives > 0) {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
      ball.dy = -3;
    } else {
      isGameRunning = false;
      isGameOver = true;
      finalScore.textContent = `Skor Kamu: ${score}`;
      gameOverScreen.classList.add("active");
      bgMusic.pause();
      bgMusic.currentTime = 0;
      gameOverSound.play();

      saveToLeaderboard(score, level);
      renderLeaderboardIntoGameOver();
    }
  }

  updateTrail();
  draw();
  requestAnimationFrame(update);
}

// === LEADERBOARD ===
function saveToLeaderboard(scoreValue, reachedLevel) {
  try {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const currentPlayer = localStorage.getItem("currentPlayer") || "Player";

    const existingIndex = leaderboard.findIndex(
      (entry) => entry.name === currentPlayer
    );

    if (existingIndex >= 0) {
      if (scoreValue > leaderboard[existingIndex].score) {
        leaderboard[existingIndex].score = scoreValue;
        leaderboard[existingIndex].level = reachedLevel;
        leaderboard[existingIndex].date = new Date().toLocaleString();
      }
    } else {
      leaderboard.push({
        name: currentPlayer,
        score: scoreValue,
        level: reachedLevel,
        date: new Date().toLocaleString(),
      });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  } catch (e) {
    console.error("Gagal menyimpan leaderboard:", e);
  }
}

// Restart game
function restartGame() {
  gameOverScreen.classList.remove("active");
  resetGame();
  isGameRunning = true;
  bgMusic.currentTime = 0;
  bgMusic.play();
  startTime = Date.now();
  requestAnimationFrame(update);
}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;
  scaleX = canvas.width / baseWidth;
  scaleY = canvas.height / baseHeight;
  paddle.y = canvas.height - 30;
}
resizeCanvas();

// === AUTO START GAME ===
window.addEventListener("load", () => {
  document.getElementById("game-container").style.display = "block";
  resetGame();
  isGameRunning = true;
  startTime = Date.now();
  bgMusic.play().catch(() => {});
  requestAnimationFrame(update);
});
