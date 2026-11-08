/* Vở ghi của học viên (lưu localStorage) */

function openNotebook() {
    document.getElementById('notebook-modal').classList.remove('hidden');
}

function closeNotebook() {
    document.getElementById('notebook-modal').classList.add('hidden');
}

function loadNotebook() {
    const area = document.getElementById('notebook-area');
    area.value = localStorage.getItem('linggxinn_hsk2_notebook') || '';
    area.addEventListener('input', () => {
        localStorage.setItem('linggxinn_hsk2_notebook', area.value);
    });
}

function clearNotebook() {
    const area = document.getElementById('notebook-area');
    area.value = '';
    localStorage.removeItem('linggxinn_hsk2_notebook');
}

function exportNotebook() {
    const area = document.getElementById('notebook-area');
    const blob = new Blob([area.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Vo_Ghi_HSK2_Linggxinn.txt';
    a.click();
    URL.revokeObjectURL(url);
}
