
const game = document.getElementById("game");

const GAME_TIME = 20;

const LEVEL_TARGETS = {
  easy: 15,
  medium: 10,
  hard: 5
};

let score = 0;
let timeLeft = GAME_TIME;
let currentMole = -1;
let speed = 700;
let currentLevel = "medium";
let gameInterval, timerInterval;
let gameActive = false;

for (let i = 0; i < 9; i++) {
  const div = document.createElement("div");
  div.classList.add("hole");
  div.onclick = () => hitMole(i);
  game.appendChild(div);
}

function startGame(level) {
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  removeConfetti();

  currentLevel = level;
  gameActive = true;

  document.getElementById("levelScreen").style.display = "none";
  document.getElementById("gameUI").style.display = "block";
  document.getElementById("overlay").style.display = "none";

  if (level === "easy") speed = 800;
  if (level === "medium") speed = 600;
  if (level === "hard") speed = 400;

  score = 0;
  timeLeft = GAME_TIME;
  currentMole = -1;

  document.getElementById("score").innerText = score;
  document.getElementById("time").innerText = timeLeft;
  document.getElementById("target").innerText = LEVEL_TARGETS[level];

  showMole();

  gameInterval = setInterval(showMole, speed);
  timerInterval = setInterval(updateTime, 1000);
}

function showMole() {
  if (!gameActive) return;

  const holes = document.querySelectorAll(".hole");

  holes.forEach(h => h.classList.remove("mole"));

  const randomIndex = Math.floor(Math.random() * 9);

  holes[randomIndex].classList.add("mole");
  currentMole = randomIndex;
}

function hitMole(index) {
  if (!gameActive || index !== currentMole) return;

  score++;

  document.getElementById("score").innerText = score;

  document.querySelectorAll(".hole")[index].classList.remove("mole");

  currentMole = -1;
}

function updateTime() {
  if (!gameActive) return;

  timeLeft--;

  document.getElementById("time").innerText = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  if (!gameActive) return;

  gameActive = false;

  clearInterval(gameInterval);
  clearInterval(timerInterval);

  currentMole = -1;

  document.querySelectorAll(".hole").forEach(h => {
    h.classList.remove("mole");
  });

  const target = LEVEL_TARGETS[currentLevel];
  const won = score >= target;

  const card = document.getElementById("resultCard");

  card.classList.remove("win-result", "lose-result");
  void card.offsetWidth;

  document.getElementById("resultIcon").innerText =
    won ? "🏆" : "😢";

  document.getElementById("resultLabel").innerText =
    won ? "CHALLENGE COMPLETED" : "CHALLENGE FAILED";

  document.getElementById("resultTitle").innerText =
    won ? "YOU WON!" : "YOU LOST!";

  document.getElementById("resultMessage").innerText =
    won
      ? "Excellent work! You completed the challenge!"
      : "Not enough points! Give it another try!";

  document.getElementById("finalScore").innerText = score;

  document.getElementById("resultTarget").innerText =
    "Required score: " + target + " points";

  card.classList.add(won ? "win-result" : "lose-result");

  document.getElementById("overlay").style.display = "flex";

  if (won) {
    createConfetti();
  } else {
    removeConfetti();
  }
}

function createConfetti() {
  removeConfetti();

  const overlay = document.getElementById("overlay");
  const container = document.createElement("div");

  container.className = "confetti-container";
  container.id = "confetti";

  for (let i = 0; i < 45; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.animationDelay = Math.random() * 2 + "s";
    piece.style.setProperty("--drift", (Math.random() * 200 - 100) + "px");
    piece.style.setProperty("--rotation", Math.random() * 720 + "deg");

    container.appendChild(piece);
  }

  overlay.insertBefore(container, overlay.firstChild);
}

function removeConfetti() {
  const confetti = document.getElementById("confetti");

  if (confetti) {
    confetti.remove();
  }
}

function restartGame() {
  startGame(currentLevel);
}

function goBack() {
  gameActive = false;

  clearInterval(gameInterval);
  clearInterval(timerInterval);

  currentMole = -1;

  document.querySelectorAll(".hole").forEach(h => {
    h.classList.remove("mole");
  });

  removeConfetti();

  document.getElementById("overlay").style.display = "none";
  document.getElementById("gameUI").style.display = "none";

  const levelScreen = document.getElementById("levelScreen");

  levelScreen.style.display = "flex";
  levelScreen.classList.remove("fade-up");

  void levelScreen.offsetWidth;

  levelScreen.classList.add("fade-up");
}
