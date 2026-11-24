const IMAGES = ["cat1.jpg", "cat2.jpg", "cat3.jpg", "cat4.jpg"];
const symbols = [...IMAGES, ...IMAGES];
const gameBoard = document.getElementById("gameBoard");
const btnStart = document.getElementById("btnStart");
const btnInstruction = document.getElementById("btnInstruction");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const countdownDisplay = document.getElementById("countdown");
const container = document.getElementById("container");
const winModal = document.getElementById("win");
const loseModal = document.getElementById("lose");
const countModal = document.getElementById("countModal");
const btnPlayAgain = document.getElementById("btnPlayAgain");
const btnPlayAgainLose = document.getElementById("btnPlayAgainLose");
const loginModal = document.getElementById("login");
const instructionModal = document.getElementById("instructionModal");
const btnOk = document.getElementById("btnOk");
const usernameInput = document.getElementById("usernameInput");
const difficultyInput = document.getElementById("difficultyInput");

let flippedCards = [];
let matchedCards = [];
let canClick = true;
let score = 0;
let timeLeft = 60;
let timerInterval;
let countInterval;
let username = "";
let difficulty = "easy";

function validateInputs() {
  const isUsernameEmpty = usernameInput.value.trim() === "";
  const isDifficultyEmpty = difficultyInput.value === "";
  btnStart.disabled = isUsernameEmpty || isDifficultyEmpty;
}
validateInputs();
usernameInput.addEventListener("input", validateInputs);
difficultyInput.addEventListener("change", validateInputs);
btnStart.addEventListener("click", function () {
  username = usernameInput.value.trim();
  difficulty = difficultyInput.value;
  btnStart.disabled = true;
  countdownDisplay.style.display = "block";
  btnStart.style.display = "none";
  showCountModal();
});
btnInstruction.addEventListener("click", function () {
  instructionModal.style.display = "block";
  container.style.display = "none";
});
btnOk.addEventListener("click", function () {
  instructionModal.style.display = "none";
  container.style.display = "block";
});

function showCountModal() {
  btnInstruction.style.display = "none";
  loginModal.style.display = "none";
  container.style.display = "none";
  countModal.style.display = "block";
  countdown = 3;
  countdownDisplay.innerText = countdown;
  clearInterval(countInterval);
  countInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownDisplay.innerText = countdown;
    } else {
      clearInterval(countInterval);
      countdownDisplay.innerText = "Go!";
      setTimeout(() => {
        countModal.style.display = "none";
        canClick = true;
        createBoard();
      }, 1000);
    }
  }, 1000);
}

let highScore = localStorage.getItem("memoryMatchHS") || 0;
highScoreDisplay.innerText = highScore;
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("memoryMatchHS", highScore);
    highScoreDisplay.innerText = highScore;
  }
}

function startTimer() {
  timeLeft = 60;
  timerDisplay.innerText = timeLeft;
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      canClick = false;
      updateHighScore();
      showLoseModal();
    }
  }, 1000);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const img1 = card1.querySelector("img").src;
  const img2 = card2.querySelector("img").src;
  if (img1 == img2) {
    matchedCards.push(card1, card2);
    score += 10;
    scoreDisplay.innerText = score;
    flippedCards = [];
    canClick = true;

    if (matchedCards.length === symbols.length) {
      clearInterval(timerInterval);
      score = score + timeLeft;
      scoreDisplay.innerText = score;
      updateHighScore();
      showWinModal();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");

      card1.querySelector("img").style.display = "none";
      card2.querySelector("img").style.display = "none";

      flippedCards = [];
      canClick = true;
    }, 500);
  }
}

function showWinModal() {
  winModal.style.display = "block";
  container.style.display = "none";

  scoreWin = document.getElementById("scoreWin");
  bonusWin = document.getElementById("bonusWin");
  totalWin = document.getElementById("totalWin");
  highScoreWin = document.getElementById("highScoreWin");

  scoreWin.innerText = `Score: ${score - timeLeft}`;
  bonusWin.innerText = `Bonus Score: ${timeLeft}`;
  totalWin.innerText = `Total Score: ${score}`;
  highScoreWin.innerText = `High Score: ${highScore}`;

  btnPlayAgain.addEventListener("click", function () {
    window.location.reload();
  });
}
function showLoseModal() {
  container.style.display = "none";
  loseModal.style.display = "block";
  scoreLose = document.getElementById("scoreLose");
  scoreLose.innerText = `Your Score: ${score}`;

  btnPlayAgainLose.addEventListener("click", function () {
    window.location.reload();
  });
}

function createBoard() {
  container.style.display = "block";
  gameBoard.innerHTML = "";
  matchedCards = [];
  flippedCards = [];
  score = 0;
  scoreDisplay.innerText = score;
  canClick = true;
  startTimer();

  const shuffledSymbols = shuffle(symbols);
  shuffledSymbols.forEach((symbols) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = `../assets/${symbols}`;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = "10px";
    img.style.objectFit = "cover";
    img.style.display = "none";

    card.appendChild(img);
    card.addEventListener("click", function () {
      if (
        canClick &&
        !this.classList.contains("flipped") &&
        flippedCards.length < 2
      ) {
        this.classList.add("flipped");
        this.querySelector("img").style.display = "block";
        flippedCards.push(this);
        if (flippedCards.length === 2) {
          canClick = false;
          checkMatch();
        }
      }
    });
    gameBoard.appendChild(card);
  });
}
