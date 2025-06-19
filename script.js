let words = [];
let currentIndex = 0;
let currentWord = null;
let timeout;

const greekEl = document.getElementById('greek-word');
const englishEl = document.getElementById('english-translation');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const revealBtn = document.getElementById('reveal-btn');
const timerToggleBtn = document.getElementById('timer-toggle');

let timerEnabled = true;
// set the max number of chapters
const MAX_CHAPTERS = 4;

async function loadChapters(chapterMode = true, chapterNumber = 1) {
    words = [];
    currentIndex = 0;

    if (chapterMode) {
        console.log("Loading chapter", chapterNumber);
        try {
            const res = await fetch(`chapters/${chapterNumber}.json`);
            const raw = await res.json();
            words = normalizeData(raw, chapterNumber);
        } catch (e) {
            console.error(`Error loading chapter ${chapterNumber}`, e);
        }
    } else {
        console.log("Loading all chapters");
        const promises = [];
        for (let i = 1; i <= MAX_CHAPTERS; i++) {
            promises.push(
                fetch(`chapters/${i}.json`)
                    .then(res => res.json())
                    .then(raw => normalizeData(raw, i))
                    .catch(err => {
                        console.error(`Error loading chapter ${i}`, err);
                        return []; // fail-safe fallback
                    })
            );
        }
        const results = await Promise.all(promises);
        words = results.flat();
    }

    if (words.length === 0) {
        greekEl.textContent = "No words loaded.";
        englishEl.textContent = "";
        return;
    }

    const chapterSelect = document.getElementById('chapter-select');
    const loadAllBtn = document.getElementById('load-all');

// Highlight logic
    if (chapterMode) {
        chapterSelect.value = chapterNumber;
        loadAllBtn.classList.remove('active-mode');
    } else {
        chapterSelect.value = ""; // Reset dropdown
        loadAllBtn.classList.add('active-mode');
    }
    shuffleWords();
    showWord();
}

function normalizeData(rawData, chapterNum = null) {
    const entries = [];

    const pushList = (list, type) => {
        if (rawData[list]) {
            for (const item of rawData[list]) {
                if (item.greek && item.english) {
                    entries.push({ ...item, type, chapter: chapterNum });
                }
            }
        }
    };

    pushList('phrases', 'phrase');
    pushList('questions', 'question');
    pushList('verbs', 'verb');
    pushList('nouns', 'noun');
    pushList('adjectives', 'adjective');
    pushList('adverbs', 'adverb');
    pushList('prepositions', 'preposition');

    if (rawData.verb_conjugations) {
        for (const v of rawData.verb_conjugations) {
            if (v.verb && Array.isArray(v.forms)) {
                for (const f of v.forms) {
                    entries.push({
                        greek: f.greek,
                        english: f.english,
                        pronunciation: f.pronunciation || '',
                        baseVerb: v.verb,
                        type: 'verb',
                        chapter: chapterNum
                    });
                }
            } else if (v.greek && v.english) {
                entries.push({
                    greek: v.greek,
                    english: v.english,
                    pronunciation: v.pronunciation || '',
                    type: 'verb',
                    chapter: chapterNum
                });
            }
        }
    }

    return entries;
}

function showWord(overrideWord = null) {
    clearTimeout(timeout);
    const word = overrideWord || (currentIndex >= 0 ? words[currentIndex] : currentWord);

    let articlePrefix = '';
    if (word.type === 'noun' && word.article) {
        articlePrefix = word.article + ' ';
    }

    greekEl.innerHTML = `<span class="type-dot" style="background-color: ${getTypeColor(word.type)};"></span> ${articlePrefix}${word.greek}`;
    englishEl.textContent = word.english;
    const pronunciationEl = document.getElementById('pronunciation');
    pronunciationEl.textContent = word.pronunciation || '';

    englishEl.classList.add('hidden');
    pronunciationEl.classList.add('hidden');

    if (timerEnabled) {
        timeout = setTimeout(() => {
            englishEl.classList.remove('hidden');
            pronunciationEl.classList.remove('hidden');
        }, 5000);
    }
}
function getTypeColor(type) {
    switch (type) {
        case 'phrase': return 'blue';
        case 'verb': return 'green';
        case 'noun': return 'orange';
        case 'adjective': return 'purple';
        case 'adverb': return 'brown';
        case 'question': return 'teal';
        case 'preposition': return 'maroon';
        default: return 'gray';
    }
}

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Normalize Greek accents and characters
function normalizeGreek(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function normalizeString(str) {
    return str ? normalizeGreek(str).toLowerCase() : "";
}

searchInput.addEventListener('input', () => {
    const query = normalizeString(searchInput.value.trim());
    if (!query) {
        searchResults.classList.add('hidden');
        return;
    }

    const matches = words.filter(word =>
        normalizeString(word.greek).includes(query) ||
        normalizeString(word.english).includes(query)
    );

    if (matches.length === 0) {
        searchResults.innerHTML = '<li>No matches found</li>';
    } else {
        searchResults.innerHTML = matches.map((match, index) =>
            `<li data-index="${index}"><strong>${match.greek}</strong>: ${match.english}</li>`
        ).join('');
    }

    searchResults.classList.remove('hidden');

    // Add click handlers for search results
    const items = searchResults.querySelectorAll('li[data-index]');
    items.forEach((item, i) => {
        item.addEventListener('click', () => {
            const match = matches[i];
            clearTimeout(timeout);

            currentIndex = -1; // Disable normal rotation
            currentWord = match;
            showWord(match);

            searchResults.classList.add('hidden');
            searchInput.value = '';
        });
    });
});
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
    clearTimeout(timeout);
    englishEl.classList.remove('hidden');
    const pronunciationEl = document.getElementById('pronunciation');
    pronunciationEl.classList.remove('hidden');
});

function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadChapters(false); // default: All Chapters
    highlightAllChaptersButton(); // Optional, if you have a highlight function
});
timerToggleBtn.addEventListener('click', () => {
    timerEnabled = !timerEnabled;

    // Cancel any active timer immediately
    clearTimeout(timeout);

    // Update button style and label
    timerToggleBtn.classList.toggle('active', timerEnabled);
    timerToggleBtn.classList.toggle('inactive', !timerEnabled);
    timerToggleBtn.textContent = timerEnabled ? '⏱️ Timer: ON' : '⏱️ Timer: OFF';
});
