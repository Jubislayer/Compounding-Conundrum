// game.js - Main JavaScript logic for the Compound Noun Quiz PWA

document.addEventListener("DOMContentLoaded", () => {
    let difficulty = "";
    let chain = [];
    let currentQuestionIndex = 0;
    let revealedLetters = [];
    
    const difficultySelection = document.getElementById("difficulty-selection");
    const gameContainer = document.getElementById("game-container");
    const questionText = document.getElementById("question-text");
    const userInput = document.getElementById("user-input");
    const submitButton = document.getElementById("submit-button");
    const hintButton = document.getElementById("hint-button");
    const restartButton = document.getElementById("restart-button");
    const messageBox = document.getElementById("message-box");
    
    document.getElementById("easy").addEventListener("click", () => startGame("easy"));
    document.getElementById("medium").addEventListener("click", () => startGame("medium"));
    document.getElementById("hard").addEventListener("click", () => startGame("hard"));
    restartButton.addEventListener("click", () => location.reload());
    submitButton.addEventListener("click", checkAnswer);
    hintButton.addEventListener("click", revealHint);
    
    function startGame(selectedDifficulty) {
        difficulty = selectedDifficulty;
        difficultySelection.style.display = "none";
        gameContainer.style.display = "block";
        generateRandomChain();
    }
    
    function generateRandomChain() {
        const sampleChains = {
            easy: [["bat", "man"], ["man", "cave"], ["cave", "bat"], ["bat", "wing"], ["wing", "nut"]],
            medium: [["table", "cloth"], ["cloth", "hanger"], ["hanger", "rod"], ["rod", "iron"], ["iron", "gate"]],
            hard: [["program", "music"], ["music", "box"], ["box", "office"], ["office", "furniture"], ["furniture", "company"]]
        };
        chain = sampleChains[difficulty];
        currentQuestionIndex = 0;
        askQuestion();
    }
    
    function askQuestion() {
        if (currentQuestionIndex >= chain.length - 1) {
            messageBox.innerText = "Congratulations! You've completed the quiz!";
            return;
        }
        
        let firstWord = chain[currentQuestionIndex][0];
        let missingWord = chain[currentQuestionIndex][1];
        let nextWord = chain[currentQuestionIndex + 1][1];
        revealedLetters = new Array(missingWord.length).fill("_");
        
        questionText.innerText = `What is the second word: ${firstWord} ${revealedLetters.join('')} -> ${revealedLetters.join('')} ${nextWord}?`;
        userInput.value = "";
    }
    
    function checkAnswer() {
        let correctWord = chain[currentQuestionIndex][1];
        let userAnswer = userInput.value.trim().toLowerCase();
        
        if (userAnswer === "iamacheater") {
            messageBox.innerText = `Cheater! The full chain is: ${chain.map(pair => pair.join(" -> ")).join(", ")}`;
            return;
        }
        
        if (userAnswer === correctWord) {
            messageBox.innerText = "Correct!";
            currentQuestionIndex += 1;
            askQuestion();
        } else {
            messageBox.innerText = "Try again!";
        }
    }
    
    function revealHint() {
        let correctWord = chain[currentQuestionIndex][1];
        let unrevealedIndices = revealedLetters.map((char, i) => (char === "_" ? i : -1)).filter(i => i !== -1);
        
        if (unrevealedIndices.length > 1) {
            let randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
            revealedLetters[randomIndex] = correctWord[randomIndex];
            questionText.innerText = `What is the second word: ${chain[currentQuestionIndex][0]} ${revealedLetters.join('')} -> ${revealedLetters.join('')} ${chain[currentQuestionIndex + 1][1]}?`;
        } else {
            messageBox.innerText = "You must guess at least one letter!";
        }
    }
});
