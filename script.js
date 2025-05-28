const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const cards = [...emojis, ...emojis];
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const pairsDisplay = document.getElementById('pairs');
const resetBtn = document.getElementById('reset-btn');
const winMessage = document.getElementById('win-message');
const finalMovesDisplay = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let pairsFound = 0;

// Initialize game
function initGame() {
    gameBoard.innerHTML = '';
    moves = 0;
    pairsFound = 0;
    updateStats();
    winMessage.classList.remove('show');

    const shuffledCards = shuffleArray([...cards]);

    shuffledCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">${emoji}</div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Flip card
function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    updateStats();
    checkForMatch();
}

// Check match
function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        disableCards();
        pairsFound++;
        updateStats();
        checkWin();
    } else {
        unflipCards();
    }
}

// Disable matched cards
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
}

// Unflip unmatched cards
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset board state
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Update stats
function updateStats() {
    movesDisplay.textContent = moves;
    pairsDisplay.textContent = pairsFound;
}

// Check win
function checkWin() {
    if (pairsFound === emojis.length) {
        finalMovesDisplay.textContent = moves;
        setTimeout(() => {
            winMessage.classList.add('show');
        }, 500);
    }
}

// Event listeners
resetBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start game
initGame();

// Show win message
winMessage.addEventListener('click', () => {
    winMessage.classList.remove('show');
});