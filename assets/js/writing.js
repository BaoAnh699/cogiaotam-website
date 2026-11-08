/* Luyện viết chữ Hán (HanziWriter) */

function openWritingModal(word) {
    currentWordString = word.replace(/[^一-龥]/g, '');
    if (!currentWordString) return;
    currentCharIndex = 0;

    const modal = document.getElementById('writing-modal');
    modal.classList.remove('hidden');

    const selectorBox = document.getElementById('char-selector-box');
    if (currentWordString.length > 1) {
        selectorBox.classList.remove('hidden');
        selectorBox.innerHTML = currentWordString.split('').map((ch, idx) => `
            <button onclick="selectChar(${idx})" id="char-btn-${idx}" class="w-8 h-8 rounded-lg font-bold font-zh text-sm ${idx === 0 ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'}">${ch}</button>
        `).join('');
    } else {
        selectorBox.classList.add('hidden');
    }

    initHanziWriter(currentWordString[0]);
}

function selectChar(idx) {
    currentCharIndex = idx;
    document.querySelectorAll('#char-selector-box button').forEach((b, i) => {
        b.className = `w-8 h-8 rounded-lg font-bold font-zh text-sm ${i === idx ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'}`;
    });
    initHanziWriter(currentWordString[idx]);
}

function initHanziWriter(char) {
    const target = document.getElementById('hanzi-target');
    target.innerHTML = '';
    document.getElementById('writing-status').textContent = `Đang tập viết chữ: ${char}`;
    
    try {
        currentWriter = HanziWriter.create('hanzi-target', char, {
            width: 200,
            height: 200,
            padding: 15,
            strokeColor: '#0f766e',
            radicalColor: '#f59e0b',
            outlineColor: '#fca5a5',
            drawingColor: '#0d9488',
            showOutline: true,
            showCharacter: false
        });
        currentWriter.animateCharacter();
    } catch(e) {
        console.error("HanziWriter error", e);
    }
}

function animateCurrentHanzi() {
    if(currentWriter) {
        document.getElementById('writing-status').textContent = "Đang biểu diễn thứ tự nét...";
        currentWriter.animateCharacter({
            onComplete: () => {
                document.getElementById('writing-status').textContent = "Biểu diễn hoàn tất!";
            }
        });
    }
}

function quizCurrentHanzi() {
    if(currentWriter) {
        document.getElementById('writing-status').textContent = "Em hãy dùng chuột hoặc ngón tay viết từng nét vào ô nhé!";
        currentWriter.quiz({
            onComplete: (summary) => {
                document.getElementById('writing-status').textContent = `🎉 Tuyệt vời! Em đã viết đúng với ${summary.totalMistakes} lỗi sai.`;
            }
        });
    }
}

function closeWritingModal() {
    document.getElementById('writing-modal').classList.add('hidden');
}
