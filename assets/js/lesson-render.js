/* Hiển thị nội dung bài: giới thiệu, bài khóa, từ vựng, ngữ pháp */

function renderIntroCard() {
    const objList = document.getElementById('lesson-objectives');
    objList.innerHTML = currentLesson.objectives ? currentLesson.objectives.map(o => `<li>${o}</li>`).join('') : '<li>Trọng tâm ôn tập toàn diện.</li>';

    const warmupContainer = document.getElementById('lesson-warmup-container');
    const warmupList = document.getElementById('lesson-warmup-list');
    if (currentLesson.warmup && currentLesson.warmup.length > 0) {
        warmupContainer.classList.remove('hidden');
        warmupList.innerHTML = currentLesson.warmup.map(w => `
            <div class="bg-white p-3 rounded-xl border border-teal-100 flex items-start justify-between gap-2">
                <div>
                    <p class="font-bold text-slate-900 font-zh text-sm">${w.question}</p>
                    <p class="text-xs text-teal-700 font-zh font-semibold">${w.pinyin || ''}</p>
                    <p class="text-xs text-slate-500 italic">${w.meaning || ''}</p>
                </div>
                <button onclick="speakText('${w.question}')" class="text-teal-600 hover:text-teal-800 p-1 text-sm font-bold">🔊</button>
            </div>
        `).join('');
    } else {
        warmupContainer.classList.add('hidden');
    }

    // Render lesson illustration images
    const imgContainer = document.getElementById('lesson-images-container');
    const imgGallery = document.getElementById('lesson-images-gallery');
    if (currentLesson.images && currentLesson.images.length > 0) {
        imgContainer.classList.remove('hidden');
        imgGallery.innerHTML = currentLesson.images.map(src => `
            <div class="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
                <img src="${src.url || src}" alt="${String(src.caption || 'Minh họa giáo trình').replace(/"/g, '&quot;')}" title="Bấm để phóng to" onclick="zoomImg(this.src)" class="w-full h-28 object-contain bg-slate-100/50 hover:scale-105 transition duration-300 cursor-zoom-in">
            </div>
        `).join('');
    } else {
        imgContainer.classList.add('hidden');
    }
}

function renderDialogues() {
    const container = document.getElementById('tab-dialogue');
    if (!currentLesson.dialogues) {
        container.innerHTML = '<p class="text-slate-500">Đang cập nhật bài khóa...</p>';
        return;
    }

    container.innerHTML = currentLesson.dialogues.map((d, dIdx) => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b">
                <h3 class="text-base font-bold text-teal-900 flex items-center gap-2">
                    <span class="w-2.5 h-5 bg-teal-700 rounded-full"></span>
                    <span>${d.title}</span>
                </h3>
            </div>

            ${d.lines ? `
            <div class="space-y-3">
                ${d.lines.map(line => `
                    <div class="flex gap-3 sm:gap-4">
                        <div class="flex-shrink-0 w-10 h-10 bg-teal-700 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-sm font-zh">${line.speaker}</div>
                        <div class="bg-slate-50 p-3.5 rounded-2xl rounded-tl-sm flex-grow border border-slate-200 relative">
                            <div class="flex items-start justify-between gap-2 mb-1">
                                <p class="text-base sm:text-lg font-bold text-slate-900 font-zh">${line.hanzi}</p>
                                <button onclick="speakText('${line.hanzi}')" class="text-teal-600 hover:text-teal-800 p-1 rounded-full hover:bg-teal-100 transition flex-shrink-0 text-sm">🔊</button>
                            </div>
                            <p class="text-teal-700 text-xs sm:text-sm font-zh font-bold mb-1">${line.pinyin}</p>
                            <p class="text-slate-600 text-xs sm:text-sm italic">${line.vietnamese}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${d.passage ? `
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div class="flex items-start justify-between gap-2">
                    <p class="text-base sm:text-lg font-bold text-slate-900 font-zh leading-relaxed">${d.passage.hanzi}</p>
                    <button onclick="speakText('${d.passage.hanzi}')" class="text-teal-600 hover:text-teal-800 p-1 rounded-full hover:bg-teal-100 font-bold text-sm">🔊</button>
                </div>
                <p class="text-teal-700 text-xs sm:text-sm font-zh font-bold leading-relaxed">${d.passage.pinyin}</p>
                <p class="text-slate-600 text-xs sm:text-sm italic leading-relaxed pt-2 border-t">${d.passage.vietnamese}</p>
            </div>
            ` : ''}

            ${d.comprehension && d.comprehension.length ? `
            <div class="bg-teal-50/60 p-4 rounded-xl border border-teal-100 mt-3">
                <p class="font-bold text-xs text-teal-900 uppercase tracking-wider mb-2">Câu hỏi đọc hiểu / Phán đoán đúng sai:</p>
                <ul class="space-y-1.5 text-xs sm:text-sm text-slate-800 font-medium font-zh">
                    ${d.comprehension.map(q => `<li>• ${q}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    `).join('');
}

function renderSpecialDialogues() {
    const container = document.getElementById('tab-dialogue');
    if (currentLesson.id === 15) {
        container.innerHTML = currentLesson.categories.map(cat => `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 class="text-base font-bold text-amber-900 pb-2 border-b font-zh">${cat.category}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${cat.wishes.map(w => `
                        <div class="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between gap-2">
                            <div>
                                <button onclick="openWritingModal('${w.hanzi.replace(/[！!]/g, '')}')" class="text-lg font-bold text-slate-900 font-zh hover:text-amber-800 hover:underline">${w.hanzi}</button>
                                <p class="text-xs text-amber-700 font-bold font-zh">${w.pinyin}</p>
                                <p class="text-xs text-slate-600 font-medium">${w.meaning}</p>
                            </div>
                            <button onclick="speakText('${w.hanzi}')" class="text-amber-700 hover:bg-amber-100 p-1.5 rounded-full font-bold">🔊</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 class="text-base font-bold text-teal-900 pb-2 border-b">Thực hành giao tiếp & Tình huống</h3>
                <p class="text-sm text-slate-700">Ôn tập toàn diện các tình huống đàm thoại từ các bài học trước. Luyện tập phản xạ nghe nói và hoàn thành đoạn văn theo bản thân.</p>
                <div class="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <p class="font-bold text-xs text-teal-900 uppercase mb-2">Đề bài viết / Đàm thoại tình huống:</p>
                    <p class="text-sm font-bold text-slate-800">${currentLesson.exercises_full ? currentLesson.exercises_full.writing_prompt : ''}</p>
                </div>
            </div>
        `;
    }
}

function renderVocabulary() {
    const tbody = document.getElementById('vocab-table-body');
    const badge = document.getElementById('vocab-count-badge');
    const vocabs = currentLesson.vocabulary || [];
    badge.textContent = `${vocabs.length} từ`;

    tbody.innerHTML = vocabs.map((v, idx) => `
        <tr class="hover:bg-teal-50/50 transition-colors">
            <td class="p-3 text-center text-slate-400 font-bold">${idx + 1}</td>
            <td class="p-3">
                <button onclick="openWritingModal('${v.hanzi}')" class="font-bold text-base sm:text-lg text-slate-900 font-zh hover:text-teal-700 hover:underline decoration-dashed underline-offset-4" title="Xem thứ tự nét viết">${v.hanzi}</button>
            </td>
            <td class="p-3 text-teal-700 font-bold font-zh text-xs sm:text-sm">${v.pinyin}</td>
            <td class="p-3 text-slate-500 font-semibold text-xs hidden sm:table-cell">${v.type || '-'}</td>
            <td class="p-3 text-slate-800 font-medium text-xs sm:text-sm">${v.meaning}</td>
            <td class="p-3">
                ${v.example_zh ? `
                    <div class="font-zh font-bold text-slate-800 text-xs sm:text-sm">${v.example_zh}</div>
                    <div class="text-teal-700 text-[11px] font-zh font-semibold">${v.example_py || ''}</div>
                    <div class="text-slate-500 text-[11px] italic">${v.example_vi || ''}</div>
                ` : '<span class="text-slate-400 italic text-xs">Đang cập nhật...</span>'}
            </td>
            <td class="p-3 text-center">
                <button onclick="speakText('${v.hanzi}')" class="text-teal-600 hover:text-teal-800 p-1.5 rounded-full hover:bg-teal-100 text-sm font-bold">🔊</button>
            </td>
        </tr>
    `).join('');

    const expCard = document.getElementById('expansion-vocab-card');
    const expContent = document.getElementById('expansion-content');
    if (currentLesson.expansion_vocabulary && currentLesson.expansion_vocabulary.length) {
        expCard.classList.remove('hidden');
        expContent.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${currentLesson.expansion_vocabulary.map(e => `
                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                        <div>
                            <button onclick="openWritingModal('${e.hanzi}')" class="font-bold text-base text-slate-900 font-zh hover:text-amber-600">${e.hanzi}</button>
                            <span class="text-xs text-amber-700 font-zh font-bold ml-1">(${e.pinyin})</span>
                            <p class="text-xs text-slate-600 mt-0.5">${e.meaning}</p>
                        </div>
                        <button onclick="speakText('${e.hanzi}')" class="text-amber-600 hover:bg-amber-100 p-1 rounded-full text-sm font-bold">🔊</button>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        expCard.classList.add('hidden');
    }
}

function filterVocab(query) {
    const q = query.toLowerCase().trim();
    const rows = document.querySelectorAll('#vocab-table-body tr');
    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
    });
}

function renderGrammar() {
    const container = document.getElementById('tab-grammar');
    if (!currentLesson.grammar || !currentLesson.grammar.length) {
        container.innerHTML = '<p class="text-slate-500">Đang cập nhật ngữ pháp...</p>';
        return;
    }

    container.innerHTML = currentLesson.grammar.map((g, idx) => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 class="text-base font-bold text-teal-900 bg-teal-50 inline-block px-3.5 py-1.5 rounded-xl font-zh border border-teal-200">${g.structure}</h3>
            <p class="text-slate-700 font-medium text-xs sm:text-sm leading-relaxed">${g.explanation}</p>
            ${g.examples && g.examples.length ? `
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p class="font-bold text-xs text-slate-500 mb-2 uppercase tracking-wider">Ví dụ minh họa:</p>
                <ul class="list-disc list-inside space-y-1.5 text-slate-900 font-zh text-sm sm:text-base">
                    ${g.examples.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            ${g.exercises && g.exercises.length ? `
            <div class="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                <p class="font-bold text-xs text-teal-800 mb-2 uppercase tracking-wider">Bài tập áp dụng nhanh:</p>
                <ul class="space-y-1 text-xs sm:text-sm font-zh text-slate-800">
                    ${g.exercises.map(ex => `<li>• ${ex}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    `).join('');
}

function renderSpecialGrammar() {
    renderGrammar();
}
