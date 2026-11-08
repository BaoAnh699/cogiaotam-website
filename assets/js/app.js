/* Khởi động ứng dụng */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadData();
    } catch (err) {
        showLoadError(err);
        return;
    }
    initEditor();       // áp dụng bản nháp (nếu có) trước khi vẽ giao diện
    initNavigation();
    initHomeGrids();
    setupTabs();
    loadNotebook();
});

function showLoadError(err) {
    console.error(err);
    const grid = document.getElementById('lesson-grid');
    if (!grid) return;
    const local = location.protocol === 'file:';
    grid.innerHTML = `
        <div class="col-span-full bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 text-sm space-y-1">
            <p class="font-bold">Không tải được dữ liệu bài học.</p>
            <p>${local
                ? 'Trang đang được mở trực tiếp từ file. Hãy chạy qua máy chủ web, ví dụ: <code>python -m http.server 8000</code> rồi mở http://localhost:8000.'
                : 'Vui lòng kiểm tra kết nối mạng và thử tải lại trang.'}</p>
        </div>`;
}
