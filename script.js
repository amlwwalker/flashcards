let words = [];
let currentIndex = 0;
let timeout;

const greekEl = document.getElementById('greek-word');
const englishEl = document.getElementById('english-translation');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const revealBtn = document.getElementById('reveal-btn');

fetch('words.json')
    .then(res => res.json())
    .then(data => {
        words = data;
        shuffleWords();
        showWord();
    });

function showWord() {
    clearTimeout(timeout);
    const word = words[currentIndex];
    greekEl.textContent = word.greek;
    englishEl.textContent = word.english;
    englishEl.classList.add('hidden');

    timeout = setTimeout(() => {
        englishEl.classList.remove('hidden');
    }, 5000);
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % words.length;
    showWord();
});

shuffleBtn.addEventListener('click', () => {
    shuffleWords();
    currentIndex = 0;
    showWord();
});

revealBtn.addEventListener('click', () => {
    clearTimeout(timeout); // cancel auto-reveal
    englishEl.classList.remove('hidden');
});

function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}
