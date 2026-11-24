const IMAGES = ["cat1.jpg", "cat2.jpg", "cat3.jpg", "cat4.jpg"];
const symbols = [...IMAGES, ...IMAGES];
const gameBoard = document.getElementById("gameBoard");
const btnStart = document.getElementById("btnStart");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

btnStart.addEventListener("click", createBoard);

let flippedCards = [];
let matchedCards = [];
let canClick = true;
let score = 0;
let timeLeft = 60;
let timerInterval;

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
      alert(`You ran out of time! \nYour Score: ${score}`);
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
      alert(
        `You Win! 
        \nScore: ${score - timeLeft} 
        \nBonus Score: ${timeLeft} 
        \nTotal Score: ${score} 
        \nHigh Score: ${highScore}`,
      );
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");

      card1.querySelector("img").style.display = "none";
      card2.querySelector("img").style.display = "none";

      flippedCards = [];
      canClick = true;
    }, 1000);
  }
}

function createBoard() {
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
