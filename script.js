const levels = {
  easy: { pairs: 4, time: 60 },
  medium: { pairs: 6, time: 80 },
  hard: { pairs: 8, time: 100 },
  epic: { pairs: 10, time: 120 },
  legendary: { pairs: 12, time: 150 }
};
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timer;
let timeLeft;
let currentLevel;

function startGame(level) {
  currentLevel = levels[level];
  document.getElementById('level-selector').classList.add('hidden');
  document.getElementById('stats').classList.remove('hidden');
  document.getElementById('board').innerHTML = '';
  score = 0;
  document.getElementById('score').textContent = score;
  generateBoard(currentLevel.pairs);
  timeLeft = currentLevel.time;
  document.getElementById('timer').textContent = timeLeft;
  timer = setInterval(updateTimer, 1000);
}

function generateBoard(pairCount) {
  const symbols = ['🐉', '🧙‍♂️', '🧝‍♀️', '🧚‍♂️', '🦄', '🪄', '🏰', '🧞‍♂️', '⚔️', '🛡️', '🎇', '🌟'];
  let selected = symbols.slice(0, pairCount);
  let deck = [...selected, ...selected];
  deck.sort(() => 0.5 - Math.random());
  let board = document.getElementById('board');
  board.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(pairCount * 2))}, 80px)`;

  deck.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.textContent = '';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.textContent = this.dataset.symbol;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    disableCards();
    score += 50;
    document.getElementById('score').textContent = score;
    checkWin();
  } else {
    unflipCards();
    score -= 10;
    document.getElementById('score').textContent = score;
  }
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.textContent = '';
    secondCard.textContent = '';
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateTimer() {
  timeLeft--;
  document.getElementById('timer').textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    showResult(false);
  }
}

function checkWin() {
  const matchedCards = document.querySelectorAll('.matched');
  if (matchedCards.length === currentLevel.pairs * 2) {
    clearInterval(timer);
    showResult(true);
  }
}

function showResult(win) {
  document.getElementById('board').innerHTML = '';
  document.getElementById('stats').classList.add('hidden');
  const result = document.getElementById('result');
  const message = document.getElementById('result-message');
  result.classList.remove('hidden');
  message.textContent = win ? `คุณชนะ! คะแนน: ${score}` : 'หมดเวลาแล้ว! ลองใหม่อีกครั้งนะ!';
}

function restartGame() {
  document.getElementById('result').classList.add('hidden');
  document.getElementById('level-selector').classList.remove('hidden');
}
