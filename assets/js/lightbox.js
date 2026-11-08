/* Phóng to ảnh minh họa khi bấm vào */
function zoomImg(src) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out';
    overlay.innerHTML = `<img src="${src}" class="max-w-full max-h-full object-contain rounded-lg bg-white" alt="">`;
    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);
}
