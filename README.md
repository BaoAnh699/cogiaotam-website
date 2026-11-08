# HSK 2 – Học Tiếng Trung cùng Linggxinn

Website giáo trình HSK 2: bài khóa, từ vựng, ngữ pháp, flashcard, luyện viết chữ Hán, bài tập và vở ghi cá nhân.
Trang web tĩnh (HTML/CSS/JS thuần), triển khai miễn phí bằng GitHub Pages.

## Cấu trúc thư mục

```
hsk2-linggxinn/
├── index.html                  # Khung trang (giao diện, các modal)
├── README.md
├── .nojekyll                   # Báo GitHub Pages không xử lý bằng Jekyll
├── .gitignore
├── data/
│   ├── lessons.json            # 12 bài học chính
│   └── special-lessons.json    # Các bài ôn tập / chuyên đề
└── assets/
    ├── css/
    │   └── styles.css          # CSS tùy chỉnh (Tailwind nạp qua CDN)
    ├── images/
    │   ├── favicon.svg
    │   └── lessons/            # Ảnh minh họa: lesson-03-1.jpg, review-13-1.jpg, ...
    └── js/
        ├── tailwind-config.js  # Màu và font cho Tailwind
        ├── state.js            # Biến trạng thái dùng chung
        ├── data.js             # Nạp dữ liệu từ data/*.json
        ├── navigation.js       # Menu, trang chủ, mở bài, chuyển tab
        ├── lesson-render.js    # Giới thiệu, bài khóa, từ vựng, ngữ pháp
        ├── exercises.js        # Bài tập, trắc nghiệm
        ├── flashcards.js       # Flashcard
        ├── writing.js          # Luyện viết chữ Hán (HanziWriter)
        ├── tts.js              # Phát âm
        ├── lightbox.js         # Phóng to ảnh
        ├── notebook.js         # Vở ghi (localStorage)
        ├── editor.js           # Chế độ quản trị (chỉnh sửa nội dung)
        └── app.js              # Khởi động ứng dụng
```

## Chạy trên máy

Trang cần chạy qua máy chủ web (mở trực tiếp file `index.html` sẽ không đọc được dữ liệu JSON):

```bash
python -m http.server 8000
# mở http://localhost:8000
```

## Triển khai lên GitHub Pages

1. Đẩy toàn bộ thư mục lên một repository (nhánh `main`).
2. Vào **Settings → Pages → Deploy from a branch → `main` / `(root)`**.
3. Tên miền riêng: file `CNAME` ở thư mục gốc phải chứa đúng tên miền (hiện tại là
   `lophoccuatam.me`). Trong **Settings → Pages → Custom domain**, nhập cùng tên miền
   và trỏ DNS theo hướng dẫn của GitHub (4 bản ghi A cho tên miền gốc, 1 bản ghi CNAME
   `www` → `<username>.github.io`). Không xóa file `CNAME` khi tái cấu trúc hoặc tải
   lại mã nguồn.

## Chỉnh sửa nội dung

**Cách 1 – Sửa trực tiếp file:** sửa `data/lessons.json`, `data/special-lessons.json` và thêm ảnh vào `assets/images/lessons/`.

**Cách 2 – Dùng giao diện quản trị:**

1. Mở trang với đuôi `#admin` (ví dụ `https://tenmien.com/#admin`) và đăng nhập.
   Mật khẩu mặc định đặt ở đầu hàm `initEditor()` trong `assets/js/editor.js` (hằng `PIN`) – hãy đổi.
2. Mở một bài học → **Sửa bài đang mở**. Có thể sửa mọi nội dung, thêm/xóa/đổi thứ tự mục, thêm/xóa ảnh;
   ngoài ra có **Thêm bài mới** và **Xóa bài đang mở**.
3. Bấm **Tải bản cập nhật (.zip)**, giải nén và chép đè vào thư mục dự án (`data/` và `assets/`), rồi commit.
   Ảnh bị xóa trong giao diện vẫn còn trong `assets/images/lessons/`; xóa tay nếu muốn dọn.

Lưu ý: mật khẩu chỉ ẩn giao diện sửa. Thay đổi chỉ lưu trong trình duyệt của người sửa cho đến khi bạn commit
lên GitHub, nên người khác không thể làm thay đổi website thật.

## Công nghệ

Tailwind CSS (CDN) · [HanziWriter](https://hanziwriter.org) · Google Fonts (Quicksand) · JSZip (chỉ nạp khi xuất bản cập nhật)
