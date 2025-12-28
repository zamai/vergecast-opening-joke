// Game state
// Note: realQuotes and fakeQuotes are loaded from quotes.js
let allQuotes = [];
let usedIndices = new Set();
let currentQuote = null;
let totalGuesses = 0;
let correctGuesses = 0;

// DOM elements
const quoteText = document.getElementById('quote-text');
const fakeBtn = document.getElementById('fake-btn');
const realBtn = document.getElementById('real-btn');
const selectionButtons = document.getElementById('selection-buttons');
const resultArea = document.getElementById('result-area');
const resultMessage = document.getElementById('result-message');
const episodeInfo = document.getElementById('episode-info');
const nextBtn = document.getElementById('next-btn');
const completionMessage = document.getElementById('completion-message');
const restartBtn = document.getElementById('restart-btn');
const guessRate = document.getElementById('guess-rate');
const guessRateValue = document.getElementById('guess-rate-value');

// Initialize game
function initGame() {
    // Combine real and fake quotes into a single pool
    allQuotes = [
        ...realQuotes.map(q => ({ ...q, isReal: true })),
        ...fakeQuotes.map(q => ({ ...q, isReal: false }))
    ];
    
    // Shuffle the quotes using Fisher-Yates algorithm
    shuffleArray(allQuotes);
    
    usedIndices.clear();
    currentQuote = null;
    totalGuesses = 0;
    correctGuesses = 0;
    
    // Hide result and completion messages
    resultArea.classList.add('hidden');
    completionMessage.classList.add('hidden');
    selectionButtons.classList.remove('hidden');
    guessRate.classList.add('hidden');
    
    // Load first quote
    loadNextQuote();
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Load next quote
function loadNextQuote() {
    // Check if all quotes have been used
    if (usedIndices.size >= allQuotes.length) {
        showCompletionMessage();
        return;
    }
    
    // Find an unused quote index
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * allQuotes.length);
    } while (usedIndices.has(randomIndex));
    
    // Mark as used and set as current
    usedIndices.add(randomIndex);
    currentQuote = allQuotes[randomIndex];
    
    // Display the quote
    quoteText.textContent = currentQuote.quote;
    
    // Reset UI state
    resultArea.classList.add('hidden');
    selectionButtons.classList.remove('hidden');
    episodeInfo.textContent = '';
}

// Update guess rate display
function updateGuessRate() {
    if (totalGuesses === 0) return;
    
    const rate = Math.round((correctGuesses / totalGuesses) * 100);
    guessRateValue.textContent = `${rate}%`;
    
    // Show guess rate after first guess
    if (totalGuesses > 0) {
        guessRate.classList.remove('hidden');
    }
}

// Handle user selection
function handleSelection(isReal) {
    if (!currentQuote) return;
    
    const userCorrect = (isReal && currentQuote.isReal) || (!isReal && !currentQuote.isReal);
    
    // Update score
    totalGuesses++;
    if (userCorrect) {
        correctGuesses++;
    }
    updateGuessRate();
    
    // Hide selection buttons
    selectionButtons.classList.add('hidden');
    
    // Show result
    resultMessage.textContent = userCorrect ? '🎉 Correct! 🎉' : '❌ Wrong! ❌';
    resultMessage.className = `result-message ${userCorrect ? 'correct' : 'incorrect'}`;
    
    // Show episode info if it was real
    if (currentQuote.isReal && currentQuote.episode) {
        episodeInfo.textContent = `Episode: ${currentQuote.episode}`;
    } else {
        episodeInfo.textContent = '';
    }
    
    // Show result area
    resultArea.classList.remove('hidden');
}

// Show completion message
function showCompletionMessage() {
    selectionButtons.classList.add('hidden');
    resultArea.classList.add('hidden');
    completionMessage.classList.remove('hidden');
}

// Event listeners
fakeBtn.addEventListener('click', () => handleSelection(false));
realBtn.addEventListener('click', () => handleSelection(true));
nextBtn.addEventListener('click', loadNextQuote);
restartBtn.addEventListener('click', initGame);

// Initialize game on page load
initGame();

