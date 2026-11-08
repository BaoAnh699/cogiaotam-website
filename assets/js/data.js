/* Dữ liệu bài học: nạp từ thư mục data/ (JSON) */
const allLessons = [];
const specialLessons = [];

const DATA_FILES = ['data/lessons.json', 'data/special-lessons.json'];

async function loadData() {
    const [lessons, special] = await Promise.all(DATA_FILES.map(async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url} (HTTP ${res.status})`);
        return res.json();
    }));
    allLessons.splice(0, allLessons.length, ...lessons);
    specialLessons.splice(0, specialLessons.length, ...special);
}
