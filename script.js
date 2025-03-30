// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Sample Game Logic (You can add your existing game logic here)
const difficultySelection = document.getElementById('difficulty-selection');
const gameContainer = document.getElementById('game-container');
const messageBox = document.getElementById('message-box');
const userInput = document.getElementById('user-input');

const words = {
  easy: [
    ["bat", "man"],
    ["man", "cave"],
    ["cave", "bat"],
    ["bat", "wing"],
    ["wing", "nut"]
  ],
  medium: [
    ["table", "cloth"],
    ["cloth", "hanger"],
    ["hanger", "rod"],
    ["rod", "iron"],
    ["iron", "gate"]
  ],
  hard: [
    ["program", "music"],
    ["music", "box"],
    ["box", "office"],
    ["office", "furniture"],
    ["furniture", "company"]
  ]
};

let currentChain = [];
let currentWordIndex = 0;
let difficulty = 'easy';

function startGame() {
  // Clear previous game state
  currentChain = generateRandomChain(difficulty);
  currentWordIndex = 0;
  showNextQuestion();
}

function generateRandomChain(difficulty) {
  const wordList = words[difficulty];
  let chain = [];
  let randomStart = wordList[Math.floor(Math.random() * wordList.length)];
  chain.push(randomStart);

  for (let i = 0; i < 9; i++) {
    let nextWordPair = wordList[Math.floor(Math.random() * wordList.length)];
    chain.push(nextWordPair);
  }

  return chain;
}

function showNextQuestion() {
  if (currentWordIndex < currentChain.length - 1) {
    const currentPair = currentChain[currentWordIndex];
    const nextPair = currentChain[currentWordIndex + 1];
    messageBox.innerHTML = `What is the second word: ${currentPair[0]} ____ -> ____ ${nextPair[1]}?`;

    userInput.value = '';
    userInput.focus();
  } else {
    messageBox.innerHTML = "Congratulations, you've completed the game!";
    gameContainer.innerHTML += "<button onclick='restartGame()'>Play Again</button>";
  }
}

function checkAnswer() {
  const answer = userInput.value.trim().toLowerCase();
  const correctAnswer = currentChain[currentWordIndex][1];

  if (answer === correctAnswer) {
    currentWordIndex++;
    showNextQuestion();
  } else {
    messageBox.innerHTML = "Incorrect. Try again!";
  }
}

function restartGame() {
  gameContainer.innerHTML = `
    <h1>Welcome to Compound Noun Quiz</h1>
    <p>Choose difficulty:</p>
    <button onclick="startGame('easy')">Easy</button>
    <button onclick="startGame('medium')">Medium</button>
    <button onclick="startGame('hard')">Hard</button>
  `;
  messageBox.innerHTML = '';
}

// Set up event listener for the user input
userInput.addEventListener('input', checkAnswer);

// Initialize the game
difficultySelection.innerHTML = `
  <h1>Choose Difficulty</h1>
  <button onclick="startGame('easy')">Easy</button>
  <button onclick="startGame('medium')">Medium</button>
  <button onclick="startGame('hard')">Hard</button>
`;

