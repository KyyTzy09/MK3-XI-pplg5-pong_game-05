const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Default ukuran
let baseWidth = 1000;
let baseHeight = 600;

// Scale untuk responsive
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
  dx: 3,
  dy: -3,
};

let score = 0;
let lives = 3;
let isGameRunning = false;

// === SOUND EFFECT ===
const bounceSound = new Audio("https://freesound.org/data/previews/82/82364_1022651-lq.mp3");
const loseSound = new Audio("https://freesound.org/data/previews/331/331912_3248244-lq.mp3");
const gameOverSound = new Audio("https://freesound.org/data/previews/398/398867_5121236-lq.mp3");
const perfectSound = new Audio("https://freesound.org/data/previews/341/341695_5121236-lq.mp3");

// === BACKGROUND MUSIC ===
const bgMusic = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

// === TEXT EFFECT ===
let floatingText = null;
function showFloatingText(message, color = "white") {
  floatingText = {
    text: message,
    color: color,
    opacity: 1,
    y: canvas.height / 2,
  };
}

// DOM Elements
const backBtn = document.getElementById("back-btn");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const scoreDisplay = document.getElementById("score");

// Event Listeners
document.addEventListener("mousemove", movePaddleMouse);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

restartBtn.addEventListener("click", restartGame);
backBtn.addEventListener("click", backGame);
window.addEventListener("resize", resizeCanvas);

// Mouse control
function movePaddleMouse(e) {
  const rect = canvas.getBoundingClientRect();
  paddle.x = (e.clientX - rect.left) / scaleX - paddle.width / 2;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width)
    paddle.x = canvas.width - paddle.width;
}

// Keyboard control
function keyDownHandler(e) {
  if (e.key === "ArrowLeft") paddle.movingLeft = true;
  if (e.key === "ArrowRight") paddle.movingRight = true;
}
function keyUpHandler(e) {
  if (e.key === "ArrowLeft") paddle.movingLeft = false;
  if (e.key === "ArrowRight") paddle.movingRight = false;
}

window.addEventListener("load", () => {
  resetGame();
  isGameRunning = true;
  bgMusic.play();
  requestAnimationFrame(update);
});

function restartGame() {
  gameOverScreen.classList.remove("active");
  resetGame();
  isGameRunning = true;
  bgMusic.currentTime = 0;
  bgMusic.play();
  requestAnimationFrame(update);
}

function backGame() {
  resetGame();
  window.location.href = "index.html";
  requestAnimationFrame(true);
}

function updateHUD() {
  scoreDisplay.textContent = `Score⭐: ${score} | Lives ❤ : ${lives}`;
}

function resetGame() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -3;
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - 30;
  score = 0;
  lives = 3;
  updateHUD();
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
  ctx.closePath();
}

function drawFloatingText() {
  if (floatingText) {
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = `rgba(${floatingText.color === "white" ? "255,255,255" : "255,50,50"},${floatingText.opacity})`;
    ctx.textAlign = "center";
    ctx.fillText(floatingText.text, canvas.width / 2, floatingText.y);
    floatingText.y -= 1;
    floatingText.opacity -= 0.02;
    if (floatingText.opacity <= 0) {
      floatingText = null;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawFloatingText();
}

function update() {
  if (!isGameRunning) return;

  // Gerakan paddle
  if (paddle.movingLeft) {
    paddle.x -= paddle.speed;
    if (paddle.x < 0) paddle.x = 0;
  }
  if (paddle.movingRight) {
    paddle.x += paddle.speed;
    if (paddle.x + paddle.width > canvas.width)
      paddle.x = canvas.width - paddle.width;
  }

  // Update posisi bola
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Pantulan kiri/kanan
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
    bounceSound.currentTime = 0;
    bounceSound.play();
  }

  // Pantulan atas
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
    bounceSound.currentTime = 0;
    bounceSound.play();
  }

  // Pantulan paddle
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.dy > 0
  ) {
    ball.dy *= -1;
    score++;
    updateHUD();
    bounceSound.currentTime = 0;
    bounceSound.play();
    perfectSound.currentTime = 0;
    perfectSound.play();
    showFloatingText("PERFECT!", "white");
  }

  // Bola jatuh
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
      finalScore.textContent = `Your Score⭐: ${score}`;
      gameOverScreen.classList.add("active");

      bgMusic.pause();
      bgMusic.currentTime = 0;

      gameOverSound.currentTime = 0;
      gameOverSound.play();

      const playerName = localStorage.getItem("currentPlayer") || "Anonim";
      let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
      const existingPlayer = leaderboard.find((p) => p.name === playerName);

      if (existingPlayer) {
        if (score > existingPlayer.score) {
          existingPlayer.score = score;
        }
      } else {
        leaderboard.push({ name: playerName, score: score });
      }

      leaderboard.sort((a, b) => b.score - a.score);
      leaderboard = leaderboard.slice(0, 10);
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
  }

  draw();
  requestAnimationFrame(update);
}

// Responsive canvas
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;

  scaleX = canvas.width / baseWidth;
  scaleY = canvas.height / baseHeight;

  paddle.y = canvas.height - 30;
}
resizeCanvas();
