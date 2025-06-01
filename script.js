// script.js

// DOM Elements
const questionTextElement = document.getElementById('question-text');
const answerButtonsElements = {
    A: document.getElementById('btn-A'),
    B: document.getElementById('btn-B'),
    C: document.getElementById('btn-C'),
    D: document.getElementById('btn-D')
};
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const timerElement = document.getElementById('timer');
const feedbackTextElement = document.getElementById('feedback-text');
const nextQuestionButton = document.getElementById('next-question-btn');
const restartButton = document.getElementById('restart-btn');

// Game State Variables
let currentScore = 0;
let currentLevel = 1;
const MAX_LEVEL = 3; // Define the maximum level based on available questions
let questionPool = [];
let currentQuestionIndex = 0;
let currentQuestion = null;
let acceptingAnswers = false;

// Timer Variables
const TIME_PER_QUESTION = 30; // seconds
let timeLeft = TIME_PER_QUESTION;
let timerInterval = null;

// Initialize questions
const allQuestions = window.gameQuestions || [];

function startGame() {
    currentScore = 0;
    currentLevel = 1;
    updateScoreDisplay();
    updateLevelDisplay();
    feedbackTextElement.textContent = "";
    feedbackTextElement.className = 'feedback-text'; // Reset feedback class
    nextQuestionButton.style.display = 'none';
    nextQuestionButton.textContent = "Next Question"; // Reset button text
    nextQuestionButton.onclick = displayNextQuestion; // Reset original handler
    restartButton.style.display = 'none';
    questionTextElement.style.color = 'black'; // Reset text color
    loadQuestionsForLevel();
    displayNextQuestion();
}

function loadQuestionsForLevel() {
    questionPool = allQuestions.filter(q => q.level === currentLevel);
    questionPool.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
}

function displayNextQuestion() {
    resetAnswerButtonStyles();
    feedbackTextElement.textContent = "";
    feedbackTextElement.className = 'feedback-text'; // Reset feedback class
    nextQuestionButton.style.display = 'none';

    if (currentQuestionIndex < questionPool.length) {
        currentQuestion = questionPool[currentQuestionIndex];
        questionTextElement.textContent = currentQuestion.text;
        questionTextElement.style.color = 'black';

        currentQuestion.answers.forEach((answer, index) => {
            const buttonKey = Object.keys(answerButtonsElements)[index];
            const button = answerButtonsElements[buttonKey];
            button.textContent = `${buttonKey}) ${answer.text}`;
            button.disabled = false;
        });
        acceptingAnswers = true;
        startTimer();
    } else {
        handleEndOfLevel();
    }
}

function startTimer() {
    timeLeft = TIME_PER_QUESTION;
    timerElement.textContent = timeLeft;
    stopTimer(); // Clear any existing timer
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            stopTimer();
            handleTimeOut();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function handleTimeOut() {
    if (!acceptingAnswers) return; // Already answered or handled
    acceptingAnswers = false;
    feedbackTextElement.textContent = "Time's up!";
    feedbackTextElement.className = 'feedback-text timeout'; // Apply class

    // Highlight the correct answer
    const correctIndex = currentQuestion.answers.findIndex(ans => ans.isCorrect);
    if (correctIndex !== -1) { // Ensure correct answer exists
        const correctButtonKey = Object.keys(answerButtonsElements)[correctIndex];
        answerButtonsElements[correctButtonKey].classList.add('correct'); // Apply class
    }

    disableAnswerButtons();
    nextQuestionButton.style.display = 'inline-block';
    currentQuestionIndex++;
}

function handleAnswerSelection(event) {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    stopTimer();

    const selectedButton = event.target.closest('.answer-btn');
    if (!selectedButton) return;

    const answerId = selectedButton.id.split('-')[1];
    const answerIndex = Object.keys(answerButtonsElements).indexOf(answerId);

    // Ensure currentQuestion and its answers are defined
    if (!currentQuestion || !currentQuestion.answers || !currentQuestion.answers[answerIndex]) {
        console.error("Error: currentQuestion or its answers are not properly defined.");
        // Potentially reset game or show error
        feedbackTextElement.textContent = "An error occurred. Please restart.";
        feedbackTextElement.style.color = 'red';
        disableAnswerButtons();
        restartButton.style.display = 'inline-block';
        return;
    }

    const isCorrect = currentQuestion.answers[answerIndex].isCorrect;

    if (isCorrect) {
        currentScore += 10; // Example: 10 points per correct answer
        feedbackTextElement.textContent = "Correct!";
        feedbackTextElement.className = 'feedback-text correct'; // Apply class
        selectedButton.classList.add('correct'); // Apply class
    } else {
        feedbackTextElement.textContent = "Wrong!";
        feedbackTextElement.className = 'feedback-text incorrect'; // Apply class
        selectedButton.classList.add('incorrect'); // Apply class

        const correctIndex = currentQuestion.answers.findIndex(ans => ans.isCorrect);
        if (correctIndex !== -1) { // Ensure correct answer exists
            const correctButtonKey = Object.keys(answerButtonsElements)[correctIndex];
            answerButtonsElements[correctButtonKey].classList.add('correct'); // Apply class
        }
    }

    updateScoreDisplay();
    disableAnswerButtons();
    nextQuestionButton.style.display = 'inline-block';
    currentQuestionIndex++;
}

function disableAnswerButtons() {
    for (const key in answerButtonsElements) {
        answerButtonsElements[key].disabled = true;
    }
}

function resetAnswerButtonStyles() {
    for (const key in answerButtonsElements) {
        answerButtonsElements[key].style.backgroundColor = ''; // Should be handled by CSS now, but good for explicit reset
        answerButtonsElements[key].classList.remove('correct', 'incorrect');
        answerButtonsElements[key].disabled = false;
    }
}

function updateScoreDisplay() {
    scoreElement.textContent = currentScore;
}

function updateLevelDisplay() {
    levelElement.textContent = currentLevel;
}

function handleEndOfLevel() {
    stopTimer();
    if (currentLevel < MAX_LEVEL) {
        currentLevel++;
        updateLevelDisplay();
        questionTextElement.textContent = `Well done! Get ready for Level ${currentLevel}!`;
        questionTextElement.style.color = 'blue';
        feedbackTextElement.textContent = "";
        feedbackTextElement.className = 'feedback-text'; // Reset feedback class
        disableAnswerButtons();

        nextQuestionButton.textContent = "Start Next Level";
        nextQuestionButton.style.display = 'inline-block';
        nextQuestionButton.onclick = () => { // Temporarily change onClick
            loadQuestionsForLevel();
            displayNextQuestion();
            nextQuestionButton.textContent = "Next Question"; // Reset button text
            nextQuestionButton.onclick = displayNextQuestion; // Reset original handler
        };
    } else {
        questionTextElement.textContent = `Congratulations! You've completed all levels! Final Score: ${currentScore}`;
        questionTextElement.style.color = 'purple';
        feedbackTextElement.textContent = "Game Over!";
        feedbackTextElement.className = 'feedback-text correct'; // Or a specific 'game-over' class if defined
        disableAnswerButtons();
        nextQuestionButton.style.display = 'none';
        restartButton.style.display = 'inline-block';
    }
}

// Event Listeners
Object.values(answerButtonsElements).forEach(button => {
    button.addEventListener('click', handleAnswerSelection);
});

nextQuestionButton.addEventListener('click', displayNextQuestion);
restartButton.addEventListener('click', startGame);

// Initial game start
startGame();
