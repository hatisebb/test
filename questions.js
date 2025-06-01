// questions.js

const questions = [
    // Level 1 (Easy)
    {
        id: 1,
        text: "Who was the first president of the United States?",
        answers: [
            { text: "Abraham Lincoln", isCorrect: false },
            { text: "George Washington", isCorrect: true },
            { text: "Thomas Edison", isCorrect: false },
            { text: "Martin Luther King Jr.", isCorrect: false }
        ],
        level: 1
    },
    {
        id: 2,
        text: "What did the Egyptians build as tombs for pharaohs?",
        answers: [
            { text: "Castles", isCorrect: false },
            { text: "Igloos", isCorrect: false },
            { text: "Pyramids", isCorrect: true },
            { text: "Temples", isCorrect: false }
        ],
        level: 1
    },
    {
        id: 3,
        text: "Which explorer is famous for discovering America in 1492?",
        answers: [
            { text: "Marco Polo", isCorrect: false },
            { text: "Christopher Columbus", isCorrect: true },
            { text: "Neil Armstrong", isCorrect: false },
            { text: "Julius Caesar", isCorrect: false }
        ],
        level: 1
    },

    // Level 2 (Medium)
    {
        id: 4,
        text: "Who was the queen of England during Shakespeare’s time?",
        answers: [
            { text: "Queen Elizabeth I", isCorrect: true },
            { text: "Queen Victoria", isCorrect: false },
            { text: "Queen Mary", isCorrect: false },
            { text: "Queen Anne", isCorrect: false }
        ],
        level: 2
    },
    {
        id: 5,
        text: "What wall was built to divide East and West Berlin?",
        answers: [
            { text: "The Iron Curtain", isCorrect: false },
            { text: "The Berlin Wall", isCorrect: true },
            { text: "The Wall of China", isCorrect: false },
            { text: "The Western Wall", isCorrect: false }
        ],
        level: 2
    },

    // Level 3 (Hard)
    {
        id: 6,
        text: "Who was the leader of France during the Napoleonic Wars?",
        answers: [
            { text: "Charlemagne", isCorrect: false },
            { text: "Napoleon Bonaparte", isCorrect: true },
            { text: "Louis XVI", isCorrect: false },
            { text: "Charles de Gaulle", isCorrect: false }
        ],
        level: 3
    },
    {
        id: 7,
        text: "What war started in 1914 and ended in 1918?",
        answers: [
            { text: "World War II", isCorrect: false },
            { text: "The Civil War", isCorrect: false },
            { text: "World War I", isCorrect: true },
            { text: "The Vietnam War", isCorrect: false }
        ],
        level: 3
    }
    // Add more questions here as needed
];

// To make questions available in script.js, if not using ES6 modules:
// (This is a common way if you're not setting up a module system for a simple project)
if (typeof window !== 'undefined') {
    window.gameQuestions = questions;
}
