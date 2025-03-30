document.addEventListener("DOMContentLoaded", () => {
    let words = [];
    let chain = [];
    let currentQuestionIndex = 0;
    let revealedLetters = [];
    let maxHints;

    async function loadWords() {
        try {
            const response = await fetch("words.json");
            words = await response.json();
        } catch (error) {
            console.error("Error loading words:", error);
        }
    }

    function generateRandomChain(difficulty) {
        let filteredWords = words.filter(w => {
            let len = w.split(" ")[0].length;
            return (difficulty === "easy" && len <= 4) ||
                   (difficulty === "medium" && len >= 4 && len <= 6) ||
                   (difficulty === "hard" && len >= 5);
        });
        
        if (filteredWords.length < 10) {
            console.error("Not enough words for difficulty.");
            return;
        }

        let startWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
        chain = [startWord];

        for (let i = 1; i < 10; i++) {
            let nextWord = filteredWords.find(w => w.startsWith(chain[i - 1].split(" ")[1]));
            if (!nextWord) break;
            chain.push(nextWord);
        }

        if (chain.length === 10) {
            startQuiz();
        } else {
            generateRandomChain(difficulty);
        }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        showQuestion();
    }

    function showQuestion() {
        if (currentQuestionIndex >= chain.length - 1) {
            document.getElementById("quiz-container").innerHTML = "<h2>Game Over! Want to play again?</h2>";
            return;
        }

        let firstWord = chain[currentQuestionIndex].split(" ")[0];
        let missingWord = chain[currentQuestionIndex].split(" ")[1];
        let nextWord = chain[currentQuestionIndex + 1].split(" ")[1];

        revealedLetters = new Array(missingWord.length).fill("_");
        maxHints = missingWord.length - 1;

        document.getElementById("question").innerHTML = 
            `${firstWord} ${revealedLetters.join('')} -> ${revealedLetters.join('')} ${nextWord}`;
    }

    function checkAnswer() {
        let input = document.getElementById("answer").value.toLowerCase();
        let correctAnswer = chain[currentQuestionIndex].split(" ")[1].toLowerCase();
        
        if (input === "iamacheater") {
            document.getElementById("quiz-container").innerHTML = chain.join(" -> ");
            return;
        }

        if (input === correctAnswer) {
            currentQuestionIndex += 2;
            showQuestion();
        } else {
            alert("Incorrect, try again!");
        }
    }

    function revealHint() {
        let correctAnswer = chain[currentQuestionIndex].split(" ")[1];
        let unrevealed = revealedLetters.map((c, i) => c === "_" ? i : -1).filter(i => i !== -1);

        if (unrevealed.length > 1) {
            let randomIndex = unrevealed[Math.floor(Math.random() * unrevealed.length)];
            revealedLetters[randomIndex] = correctAnswer[randomIndex];
            document.getElementById("question").innerHTML = revealedLetters.join(' ');
        }
    }

    document.getElementById("start-btn").addEventListener("click", () => {
        let difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        generateRandomChain(difficulty);
    });

    document.getElementById("submit-btn").addEventListener("click", checkAnswer);
    document.getElementById("hint-btn").addEventListener("click", revealHint);

    loadWords();
});
