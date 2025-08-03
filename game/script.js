const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Paddle
const paddle = {
  width: 80,
  height: 12,
  x: canvas.width / 2 - 40,
  y: canvas.height - 30,
  speed: 6
};

// Ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  dx: 3,
  dy: -3
};

let score = 0;
let isGameRunning = false;

// DOM Elements
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const scoreDisplay = document.getElementById("score");

// Event Listeners
document.addEventListener("mousemove", movePaddle);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

function movePaddle(e) {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.width / 2;

  // Batas paddle
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function startGame() {
  startScreen.classList.remove("active");
  resetGame();
  isGameRunning = true;
  requestAnimationFrame(update);
}

function restartGame() {
  gameOverScreen.classList.remove("active");
  resetGame();
  isGameRunning = true;
  requestAnimationFrame(update);
}

function resetGame() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -3;
  score = 0;
  scoreDisplay.textContent = `Skor: ${score}`;
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
}

function update() {
  if (!isGameRunning) return;

  // Update posisi bola
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Pantulan kiri/kanan
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }

  // Pantulan atas
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Pantulan paddle
  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.dy *= -1;
    score++;
    scoreDisplay.textContent = `Skor: ${score}`;
  }

  // Game over
  if (ball.y - ball.radius > canvas.height) {
    isGameRunning = false;
    finalScore.textContent = `Skor Anda: ${score}`;
    gameOverScreen.classList.add("active");
  }

  draw();
  requestAnimationFrame(update);
}
