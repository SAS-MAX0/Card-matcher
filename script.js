const gameContainer = document.querySelector('.game-container');
const themeSelector = document.getElementById('theme');
const restartButton = document.getElementById('restart');

const allImages = ['acura.png', 'bmw.png', 'kia.png', 'mercedes.png', 'nissan.png', 'toyota.png', 'audi.png', 'chevrolet.png', 'ford.png', 'honda.png', 'mazda.png', 'volvo.png', '1.png', '2.png', '3.png', '4.png', '5.png'];
let currentLevel = 1;
let flippedCards = [];
let matchedCards = [];
let isGameLocked = false;

const themes = {
  winter: { wallpaper: 'url("winter.png")', font: '"Snowburst One", cursive' },
  halloween: { wallpaper: 'url("halloween.png")', font: '"Rock Salt", cursive' },
  mystery: { wallpaper: 'url("mystery.png")', font: '"Spectral", serif' },
  ocean: { wallpaper: 'url("ocean.png")', font: '"Comic Sans MS", cursive' },
  pirate: { wallpaper: 'url("pirate.png")', font: '"Trebuchet MS", cursive' },
  galaxy: { wallpaper: 'url("galaxy.png")', font: '"Courier New", monospace' },
  cyberpunk: { wallpaper: 'url("cyber.png")', font: '"Orbitron", sans-serif' }
};

function startGame() {
  resetGameVariables();
  setupLevel(currentLevel);
}

function resetGameVariables() {
  flippedCards = [];
  matchedCards = [];
  isGameLocked = false;
}

function setupLevel(level) {
  const pairsToMatch = Math.min(6 + (level - 1) * 2, allImages.length);
  const selectedImages = allImages.slice(0, pairsToMatch);
  const cardData = shuffleArray([...selectedImages, ...selectedImages]);

  gameContainer.innerHTML = '';
  cardData.forEach(image => createCard(image));
}

function createCard(image) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.image = image;

  const imgElement = document.createElement('img');
  imgElement.src = image;
  imgElement.alt = image;
  imgElement.style.display = 'none';

  card.appendChild(imgElement);
  gameContainer.appendChild(card);

  card.addEventListener('click', () => handleCardFlip(card));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function handleCardFlip(card) {
  if (isGameLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }

  card.classList.add('flipped');
  card.querySelector('img').style.display = 'block';
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    isGameLocked = true;
    checkForMatch();
  }
}

function checkForMatch() {
  const [firstCard, secondCard] = flippedCards;

  if (firstCard.dataset.image === secondCard.dataset.image) {
    handleMatch(firstCard, secondCard);
  } else {
    handleNoMatch();
  }
}

function handleMatch(card1, card2) {
  card1.classList.add('matched');
  card2.classList.add('matched');
  matchedCards.push(card1, card2);
  flippedCards = [];
  isGameLocked = false;

  if (matchedCards.length === document.querySelectorAll('.card').length) {
    moveToNextLevel();
  }
}

function handleNoMatch() {
  setTimeout(() => {
    flippedCards.forEach(card => {
      card.classList.remove('flipped');
      card.querySelector('img').style.display = 'none';
    });
    flippedCards = [];
    isGameLocked = false;
  }, 1000);
}

function moveToNextLevel() {
  if (currentLevel < 10) {
    setTimeout(() => {
      alert(`Level ${currentLevel} Complete! Moving to Level ${currentLevel + 1}`);
      currentLevel++;
      startGame();
    }, 500);
  } else {
    setTimeout(() => alert("Congratulations! You've completed all levels!"), 500);
  }
}

restartButton.addEventListener('click', () => {
  currentLevel = 1;
  startGame();
});

themeSelector.addEventListener('change', () => {
  const selectedTheme = themes[themeSelector.value];
  document.body.style.backgroundImage = selectedTheme.wallpaper;
  document.body.style.fontFamily = selectedTheme.font;
});

startGame();
