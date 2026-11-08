/* Bài tập và trắc nghiệm */

function renderExercises() {
    const container = document.getElementById('tab-exercise');
    let html = '';

    const full = currentLesson.exercises_full;
    if (full) {
        if (full.fill_blanks) {
            html += `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <h3 class="text-sm sm:text-base font-bold text-teal-900">一、选词填空 – Chọn từ điền vào chỗ trống</h3>
                <div class="flex flex-wrap gap-2 p-3 bg-teal-50 rounded-xl border border-teal-100">
                    <span class="text-xs font-bold text-teal-800 mr-1">Ngân hàng từ:</span>
                    ${full.fill_blanks.word_bank.map(w => `<span class="px-2.5 py-0.5 bg-white text-teal-800 rounded-lg text-xs font-bold font-zh border border-teal-200 shadow-sm">${w}</span>`).join('')}
                </div>
                <ol class="space-y-2 text-xs sm:text-sm text-slate-800 font-zh pt-2">
                    ${full.fill_blanks.sentences.map(s => `<li class="p-2 bg-slate-50 rounded-lg">${s}</li>`).join('')}
                </ol>
            </div>
            `;
        }

        if (full.reorder) {
            html += `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <h3 class="text-sm sm:text-base font-bold text-teal-900">二、完成句子 / 连词成句 – Sắp xếp từ thành câu hoàn chỉnh</h3>
                <div class="space-y-3">
                    ${full.reorder.map((r, i) => `
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p class="font-bold text-xs sm:text-sm text-slate-900 font-zh mb-1">${i + 1}. ${r.chunks}</p>
                            <div class="mt-2 flex items-center justify-between">
                                <button onclick="toggleAnswer('reorder-${i}')" class="text-xs text-teal-700 hover:underline font-bold">Xem đáp án</button>
                                <span id="reorder-${i}" class="text-xs font-bold text-teal-900 font-zh hidden bg-teal-100 px-2 py-0.5 rounded">→ ${r.answer}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            `;
        }

        if (full.translation) {
            html += `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <h3 class="text-sm sm:text-base font-bold text-teal-900">三、翻译成汉语 – Dịch sang tiếng Trung</h3>
                <div class="space-y-3">
                    ${full.translation.map((t, i) => `
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p class="font-bold text-xs sm:text-sm text-slate-800 mb-1">${i + 1}. ${t.vi}</p>
                            <div class="mt-2 flex items-center justify-between">
                                <button onclick="toggleAnswer('trans-${i}')" class="text-xs text-teal-700 hover:underline font-bold">Xem bản dịch chuẩn</button>
                                <span id="trans-${i}" class="text-xs font-bold text-teal-900 font-zh hidden bg-teal-100 px-2 py-0.5 rounded">→ ${t.zh}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            `;
        }

        if (full.qa) {
            html += `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <h3 class="text-sm sm:text-base font-bold text-teal-900">四、回答问题 – Trả lời câu hỏi theo bản thân</h3>
                <ol class="space-y-2 text-xs sm:text-sm text-slate-800 font-zh">
                    ${full.qa.map(q => `<li class="p-2.5 bg-slate-50 rounded-xl border border-slate-200">${q}</li>`).join('')}
                </ol>
            </div>
            `;
        }
    }

    if (currentLesson.exercises && currentLesson.exercises.length) {
        html += `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 class="text-sm sm:text-base font-bold text-teal-900">五、Trắc nghiệm tương tác – Kiểm tra kiến thức</h3>
            ${currentLesson.exercises.map((ex, index) => `
                <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50" id="quiz-${index}">
                    <p class="text-xs sm:text-sm font-bold text-slate-900 mb-3">Câu ${index + 1}: <span class="font-zh text-sm sm:text-base text-teal-900 font-bold">${ex.question}</span></p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        ${ex.options.map(opt => `
                            <button onclick="checkQuizAnswer('${opt.charAt(0)}', '${ex.answer}', ${index}, event)" class="quiz-btn text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-xs sm:text-sm font-zh">${opt}</button>
                        `).join('')}
                    </div>
                    <p id="quiz-feedback-${index}" class="mt-2 text-xs font-bold hidden"></p>
                </div>
            `).join('')}
        </div>
        `;
    }

    container.innerHTML = html;
}

function renderSpecialExercises() {
    renderExercises();
}

function toggleAnswer(id) {
    const el = document.getElementById(id);
    if(el) el.classList.toggle('hidden');
}

function checkQuizAnswer(selected, correct, index, event) {
    const container = document.getElementById(`quiz-${index}`);
    const buttons = container.querySelectorAll('.quiz-btn');
    const feedback = document.getElementById(`quiz-feedback-${index}`);

    buttons.forEach(btn => {
        btn.disabled = true;
        if(btn.textContent.trim().startsWith(correct)) {
            btn.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-900');
        }
    });

    feedback.classList.remove('hidden');
    if (selected === correct) {
        feedback.textContent = "🎉 Hoàn toàn chính xác! Em làm rất tốt.";
        feedback.className = "mt-2 text-xs font-bold text-emerald-600";
        event.target.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-900');
    } else {
        feedback.textContent = `⚠️ Chưa chính xác. Đáp án đúng là: ${correct}`;
        feedback.className = "mt-2 text-xs font-bold text-rose-600";
        event.target.classList.add('bg-rose-100', 'border-rose-500', 'text-rose-900');
    }
}
