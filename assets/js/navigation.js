/* Menu, trang chủ, mở bài học, chuyển tab */

function initNavigation() {
    const menu = document.getElementById('menu-lessons');
    let html = '';
    allLessons.forEach(l => {
        html += `<button onclick="openLesson(${l.id})" class="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg whitespace-nowrap transition-colors">Bài ${l.id}</button>`;
    });
    specialLessons.forEach(l => {
        html += `<button onclick="openSpecialLesson(${l.id})" class="px-2.5 py-1 text-xs font-bold text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg whitespace-nowrap transition-colors">${l.title_zh}</button>`;
    });
    menu.innerHTML = html;
}

function initHomeGrids() {
    const lgrid = document.getElementById('lesson-grid');
    lgrid.innerHTML = allLessons.map(l => {
        const vocabCount = l.vocabulary ? l.vocabulary.length : 0;
        const dialogueCount = l.dialogues ? l.dialogues.length : 0;
        const grammarCount = l.grammar ? l.grammar.length : 0;
        return `
        <div onclick="openLesson(${l.id})" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">Bài ${l.id}</span>
                    <span class="text-xs text-slate-400 font-semibold">${dialogueCount} bài khóa</span>
                </div>
                <h4 class="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition font-zh">${l.title_zh}</h4>
                <p class="text-xs font-semibold text-slate-500 mb-3">${l.title_vi}</p>
                <p class="text-xs text-slate-600 line-clamp-2 mb-4">${l.description || ''}</p>
            </div>
            <div class="flex items-center justify-between pt-3 border-t text-[11px] font-bold text-slate-500">
                <span>📖 ${vocabCount} từ vựng</span>
                <span>⭐ ${grammarCount} ngữ pháp</span>
            </div>
        </div>
        `;
    }).join('');

    const sgrid = document.getElementById('special-grid');
    sgrid.innerHTML = specialLessons.map(l => `
        <div onclick="openSpecialLesson(${l.id})" class="bg-gradient-to-br from-amber-50 to-orange-50/60 p-5 rounded-2xl shadow-sm border border-amber-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
            <div>
                <span class="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-2">Chuyên đề đặc biệt</span>
                <h4 class="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition font-zh">${l.title_zh}</h4>
                <p class="text-xs font-semibold text-slate-600 mb-2">${l.title_vi}</p>
                <p class="text-xs text-slate-600 line-clamp-2">${l.description}</p>
            </div>
            <div class="pt-3 border-t border-amber-200/60 mt-4 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>Bấm vào để học ➡️</span>
            </div>
        </div>
    `).join('');
}

function goHome() {
    document.getElementById('homepage').classList.remove('hidden');
    document.getElementById('lesson-page').classList.add('hidden');
    window.scrollTo(0, 0);
}

function openLesson(id) {
    currentLesson = allLessons.find(l => l.id === id);
    if (!currentLesson) return;
    isSpecialLesson = false;

    document.getElementById('homepage').classList.add('hidden');
    document.getElementById('lesson-page').classList.remove('hidden');
    window.scrollTo(0, 0);

    document.getElementById('lesson-title-header').innerHTML = `Bài ${currentLesson.id}: <span class="font-zh font-bold">${currentLesson.title_zh}</span> - ${currentLesson.title_vi}`;
    
    document.getElementById('lesson-tts-btn').onclick = () => {
        speakText(`第${currentLesson.id}课 ${currentLesson.title_zh}`);
    };

    renderIntroCard();
    renderDialogues();
    renderVocabulary();
    renderGrammar();
    renderExercises();
    initFlashcards();
    switchTab('tab-dialogue');
}

function openSpecialLesson(id) {
    currentLesson = specialLessons.find(l => l.id === id);
    if(!currentLesson) return;
    isSpecialLesson = true;

    document.getElementById('homepage').classList.add('hidden');
    document.getElementById('lesson-page').classList.remove('hidden');
    window.scrollTo(0, 0);

    document.getElementById('lesson-title-header').innerHTML = `<span class="font-zh font-bold">${currentLesson.title_zh}</span> - ${currentLesson.title_vi}`;
    document.getElementById('lesson-tts-btn').onclick = () => {
        speakText(currentLesson.title_zh);
    };

    renderIntroCard();
    renderSpecialDialogues();
    renderVocabulary();
    renderSpecialGrammar();
    renderSpecialExercises();
    initFlashcards();
    switchTab('tab-dialogue');
}

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            switchTab(target);
        });
    });
}

function switchTab(targetId) {
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('border-teal-700', 'text-teal-700');
        b.classList.add('border-transparent', 'text-slate-600');
    });
    const activeBtn = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('border-teal-700', 'text-teal-700');
        activeBtn.classList.remove('border-transparent', 'text-slate-600');
    }
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    const activeContent = document.getElementById(targetId);
    if(activeContent) activeContent.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
