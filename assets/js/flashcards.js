/* Flashcard từ vựng */

function initFlashcards() {
    currentFlashcardIndex = 0;
    isCardFlipped = false;
    document.getElementById('flashcard-container').classList.remove('rotate-y-180');
    updateFlashcard();
}

function updateFlashcard() {
    const vocabs = currentLesson.vocabulary || [];
    if (!vocabs.length) return;
    const item = vocabs[currentFlashcardIndex];
    document.getElementById('fc-hanzi').textContent = item.hanzi;
    document.getElementById('fc-pinyin').textContent = item.pinyin;
    document.getElementById('fc-type').textContent = item.type || '';
    document.getElementById('fc-meaning').textContent = item.meaning;
    document.getElementById('fc-example-zh').textContent = item.example_zh || '';
    document.getElementById('fc-example-py').textContent = item.example_py || '';
    document.getElementById('fc-example-vi').textContent = item.example_vi || '';
    document.getElementById('fc-counter').textContent = `${currentFlashcardIndex + 1} / ${vocabs.length}`;
}

function flipFlashcard() {
    isCardFlipped = !isCardFlipped;
    const card = document.getElementById('flashcard-container');
    if (isCardFlipped) {
        card.classList.add('rotate-y-180');
    } else {
        card.classList.remove('rotate-y-180');
    }
}

function prevFlashcard() {
    const vocabs = currentLesson.vocabulary || [];
    if (!vocabs.length) return;
    if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        if(isCardFlipped) flipFlashcard();
        updateFlashcard();
    }
}

function nextFlashcard() {
    const vocabs = currentLesson.vocabulary || [];
    if (!vocabs.length) return;
    if (currentFlashcardIndex < vocabs.length - 1) {
        currentFlashcardIndex++;
        if(isCardFlipped) flipFlashcard();
        updateFlashcard();
    }
}

function speakCurrentFlashcard() {
    const vocabs = currentLesson.vocabulary || [];
    if (!vocabs.length) return;
    speakText(vocabs[currentFlashcardIndex].hanzi);
}
