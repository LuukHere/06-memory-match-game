// List of emojis to use in the game (8 pairs for 4x4 grid)
const emojis = ['🍎', '🐶', '🚗', '🌟', '🎈', '🍕', '⚽', '🐼'];

// Variables to keep track of the game state
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let canFlip = true;

// Get references to DOM elements
const gameBoard = document.querySelector('#game-board');
const movesDisplay = document.querySelector('#moves');
const messageDisplay = document.querySelector('#message');
const restartBtn = document.querySelector('#restart-btn');

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Function to start or restart the game
function startGame() {
  // Reset variables
  cards = [];
  flippedCards = [];
  matchedCount = 0;
  moves = 0;
  canFlip = true;
  movesDisplay.textContent = `Moves: 0`;
  messageDisplay.textContent = '';

  // Create a list with two of each emoji
  let emojiPairs = emojis.concat(emojis);

  // Shuffle the emoji pairs
  shuffle(emojiPairs);

  // Clear the game board
  gameBoard.innerHTML = '';

  // Create card elements
  for (let i = 0; i < emojiPairs.length; i++) {
    // Create a div for each card
    let card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emojiPairs[i];

    // Create a span to hold the emoji
    let emojiSpan = document.createElement('span');
    emojiSpan.classList.add('emoji');
    emojiSpan.textContent = emojiPairs[i];

    // Add the emoji span to the card
    card.appendChild(emojiSpan);

    // Add click event listener to the card
    card.addEventListener('click', flipCard);

    // Add the card to the game board
    gameBoard.appendChild(card);

    // Add the card to the cards array
    cards.push(card);
  }
}

// Function to handle card flipping
function flipCard() {
  // 'this' refers to the clicked card
  if (!canFlip) {
    // Prevent flipping if waiting for cards to flip back
    return;
  }
  if (this.classList.contains('flipped') || this.classList.contains('matched')) {
    // Ignore if card is already flipped or matched
    return;
  }

  // Flip the card
  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    // Two cards are flipped, check for match
    canFlip = false;
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;

    let card1 = flippedCards[0];
    let card2 = flippedCards[1];

    if (card1.dataset.emoji === card2.dataset.emoji) {
      // It's a match!
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedCount += 2;
      flippedCards = [];
      canFlip = true;

      // Check if all pairs are matched
      if (matchedCount === cards.length) {
        messageDisplay.textContent = `Congratulations! You matched all pairs in ${moves} moves!`;
      }
    } else {
      // Not a match, flip back after a short delay
      setTimeout(function() {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        canFlip = true;
      }, 1000);
    }
  }
}

// Add event listener to the restart button
restartBtn.addEventListener('click', startGame);

// Start the game when the page