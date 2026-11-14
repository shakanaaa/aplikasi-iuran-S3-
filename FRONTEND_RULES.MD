# S3 FRONTEND DEVELOPMENT CONSTITUTION
## COMPLETE FRONTEND ENGINEERING RULES & DEVELOPMENT STANDARDS

**Project:** S3 — Sistem Simpanan Siswa  
**Frontend Stack:** React + TypeScript + Inertia.js + Tailwind CSS + Lucide React  
**Backend:** Laravel  
**Database:** MySQL  
**Application Type:** Web Application + PWA (pada tahap final)

---

# 1. ABSOLUTE DEVELOPMENT PRINCIPLES

AI CODING AGENT WAJIB mematuhi seluruh aturan berikut.

1. Frontend bertugas sebagai presentation layer dan interaction layer. Seluruh business logic utama harus tetap berada di backend Laravel.
2. Backend merupakan satu-satunya sumber kebenaran (Single Source of Truth) untuk autentikasi, otorisasi, transaksi, saldo, kalender pembayaran, alokasi pembayaran, dan laporan keuangan.
3. Jangan membuat ulang business logic backend menggunakan React atau TypeScript.
4. Jangan mengarang endpoint, route, model, response, field database, atau status transaksi.
5. Jangan membuat fitur yang tidak diminta.
6. Jangan membuat komponen, hook, utility, service, atau abstraksi yang tidak memiliki kebutuhan nyata.
7. Jangan mengganti arsitektur frontend tanpa alasan teknis yang kuat.
8. Jangan menginstal dependency baru sebelum memeriksa dependency yang sudah tersedia.
9. Jangan menggunakan dummy data untuk menyamarkan fitur yang belum terhubung.
10. Jangan menghapus atau mengubah implementasi backend yang sudah benar hanya untuk memudahkan frontend.
11. Jangan menganggap tampilan berhasil berarti proses backend berhasil.
12. Setiap interaksi yang mengubah data harus memiliki feedback dan penanganan error.
13. Jangan menampilkan status keberhasilan sebelum backend mengonfirmasikannya.
14. Jangan mengabaikan TypeScript error, console error, build error, atau kegagalan request.
15. Seluruh perubahan harus memiliki alasan, ruang lingkup, dan hasil pengujian yang jelas.

**Prinsip utama: Functional Correctness > Data Integrity > Security > Maintainability > Visual Appearance.**

---

# 2. DEVELOPMENT PHASE SEPARATION

Frontend S3 dibangun melalui dua tahap berbeda.

## PHASE A — TEMPORARY TESTING FRONTEND

Ini merupakan tahap yang sedang dikerjakan sekarang.

Tujuan:
- Menguji endpoint backend.
- Menguji proses autentikasi.
- Menguji otorisasi berdasarkan role.
- Menguji pengiriman dan penerimaan data.
- Menguji validasi backend.
- Menguji alur pembayaran tunai.
- Menguji integrasi QRIS.
- Menguji kalender dan alokasi pembayaran.
- Mengidentifikasi kesalahan integrasi sebelum UI final dibuat.

Ketentuan:

1. Gunakan layout sederhana, jelas, dan fungsional.
2. Prioritaskan keterbacaan data dan kemudahan pengujian.
3. Tidak perlu animasi kompleks.
4. Tidak perlu visual dekoratif berlebihan.
5. Tidak perlu membuat desain dashboard final.
6. Jangan membuat ulang desain UI/UX final.
7. Jangan menghabiskan waktu untuk ilustrasi, efek visual, atau komponen yang tidak membantu pengujian.
8. Setiap halaman harus benar-benar terhubung dengan backend.
9. Tambahkan informasi teknis yang aman untuk membantu pengujian, seperti status request, status transaksi, dan pesan validasi.
10. Jangan pernah menampilkan secret key, password, token sensitif, atau data pribadi yang tidak diperlukan.

Temporary Testing Frontend bukan production UI. Jangan memaksakan desain final pada tahap ini.

## PHASE B — FINAL FRONTEND UI/UX

Tahap ini baru dimulai setelah audit dan pengujian backend selesai.

Tujuan:
- Mengimplementasikan desain UI/UX S3.
- Menyediakan pengalaman pengguna yang konsisten.
- Membuat seluruh halaman responsif.
- Memperbaiki aksesibilitas.
- Mengimplementasikan PWA.
- Mengoptimalkan performa.
- Menyiapkan pengalaman penggunaan di lingkungan sekolah.

Aturan:

1. Gunakan rancangan UI/UX yang sudah disetujui sebagai acuan.
2. Pertahankan seluruh business logic yang telah diuji.
3. Jangan mengubah kontrak backend tanpa kebutuhan dan persetujuan.
4. Jangan membuat ulang sistem hanya untuk mendapatkan tampilan yang berbeda.
5. Gunakan kembali komponen yang telah dibuat dan teruji.
6. Setiap perubahan tampilan harus mempertahankan fungsi yang sudah berjalan.

---

# 3. MANDATORY PROJECT INSPECTION

Sebelum melakukan perubahan apa pun, AI WAJIB:

1. Membaca `AGENTS.md`.
2. Membaca `CLAUDE.md` jika tersedia.
3. Membaca dokumen frontend rules.
4. Memeriksa struktur direktori project.
5. Memeriksa `package.json`.
6. Memeriksa konfigurasi TypeScript.
7. Memeriksa konfigurasi Tailwind CSS.
8. Memeriksa konfigurasi Vite.
9. Memeriksa setup React dan Inertia.js.
10. Memeriksa route Laravel yang berhubungan dengan frontend.
11. Memeriksa middleware dan autentikasi.
12. Memeriksa response dan props dari backend.
13. Memeriksa komponen yang sudah tersedia.
14. Memeriksa `git status` dan branch aktif.
15. Memeriksa apakah terdapat perubahan pengguna yang belum di-commit.

Jangan mengasumsikan struktur folder project sebelum memeriksanya.

Jangan membuat file konfigurasi baru apabila konfigurasi yang tersedia sudah mencukupi.

Jika kontrak backend belum jelas, identifikasi masalahnya dan laporkan. Jangan mengarang kontrak baru secara diam-diam.

---

# 4. FRONTEND ARCHITECTURE

Gunakan arsitektur yang konsisten dengan implementasi project Laravel + React + Inertia.js.

## 4.1 Technology Rules

- React sebagai UI library.
- TypeScript untuk seluruh kode aplikasi frontend.
- Inertia.js untuk komunikasi dan navigasi sesuai arsitektur project.
- Tailwind CSS untuk styling.
- Lucide React untuk ikon.
- Vite sebagai build tool jika sudah digunakan oleh project.

Jangan menambahkan Next.js, Vue, Redux, Zustand, Axios, React Query, atau library lain secara otomatis.

Sebelum menggunakan dependency, periksa apakah fitur yang dibutuhkan sudah dapat dikerjakan menggunakan teknologi yang tersedia.

## 4.2 Separation of Concerns

Pisahkan tanggung jawab:

- Pages: halaman berdasarkan route dan kebutuhan pengguna.
- Components: komponen UI yang digunakan kembali.
- Layouts: kerangka halaman berdasarkan role atau area aplikasi.
- Hooks: reusable stateful logic yang memang diperlukan.
- Types: tipe data frontend dan kontrak backend.
- Utils: fungsi presentasi atau utilitas murni.
- Services: hanya jika terdapat alasan konkret dan pola komunikasi project membutuhkannya.

Jangan memindahkan business logic ke dalam hooks atau services frontend.

Jangan membuat folder kosong atau struktur berlapis tanpa kebutuhan.

## 4.3 Component Rules

Setiap komponen harus:

1. Memiliki satu tanggung jawab yang jelas.
2. Memiliki nama yang deskriptif.
3. Memiliki props yang terdefinisi.
4. Tidak memiliki duplikasi implementasi yang tidak perlu.
5. Tidak memiliki efek samping tersembunyi.
6. Tidak mengakses endpoint secara sembarangan.
7. Tidak menyimpan data sensitif secara tidak aman.
8. Memiliki penanganan state yang tepat jika berinteraksi dengan pengguna.

Komponen yang hanya digunakan sekali tidak harus dipisahkan menjadi file baru.

Jangan membuat komponen generik yang terlalu kompleks untuk kebutuhan sederhana.

---

# 5. TYPESCRIPT RULES

TypeScript wajib digunakan dengan disiplin.

1. Jangan menggunakan `any` kecuali ada alasan teknis yang benar-benar tidak dapat dihindari.
2. Jangan menggunakan type assertion untuk menutupi kesalahan tipe.
3. Jangan menggunakan `@ts-ignore` sebagai jalan pintas.
4. Jangan menggunakan `@ts-expect-error` tanpa alasan dan penjelasan.
5. Gunakan interface atau type sesuai kebutuhan.
6. Definisikan props komponen.
7. Definisikan bentuk data dari backend.
8. Gunakan union type untuk status yang mempunyai pilihan tetap jika kontraknya mendukung.
9. Tangani nilai nullable dan optional secara eksplisit.
10. Jangan menganggap nilai dari server selalu tersedia.
11. Jangan menggunakan `as` untuk memaksa response API menjadi tipe tertentu tanpa validasi kontrak.
12. Jangan membuat tipe yang bertentangan dengan response backend.

Contoh:

```ts
type PaymentStatus =
    | 'pending'
    | 'paid'
    | 'failed'
    | 'expired'
    | 'cancelled';

interface StudentSummary {
    name: string;
    major: string;
    class_name: string;
}
```

Contoh tersebut merupakan ilustrasi. Sesuaikan nama field dan nilai status dengan kontrak backend sebenarnya.

Jangan menganggap contoh di dokumen ini sebagai izin untuk mengganti schema backend.

---

# 6. BACKEND COMMUNICATION RULES

Seluruh komunikasi frontend dengan backend wajib mengikuti kontrak yang benar-benar tersedia.

## 6.1 Request Rules

1. Gunakan route Laravel yang sudah tersedia.
2. Periksa route name dan HTTP method sebelum menghubungkannya.
3. Gunakan mekanisme Inertia yang sesuai dengan pola project.
4. Jangan mengarang URL endpoint.
5. Jangan membuat endpoint baru hanya untuk menghindari perbaikan kontrak yang sudah ada.
6. Jangan mengirim field yang tidak diminta backend.
7. Jangan mengirim data sensitif yang tidak dibutuhkan.
8. Jangan mengirim data hasil kalkulasi frontend sebagai kebenaran transaksi.
9. Jangan mengirim ID dari state yang belum tervalidasi.
10. Gunakan parameter pagination, filter, dan sorting sesuai dukungan backend.

## 6.2 Response Rules

Setiap response harus ditangani sesuai bentuk sebenarnya.

Perhatikan:

- Success response.
- Validation error.
- Authentication error.
- Authorization error.
- Not found.
- Conflict.
- Rate limit.
- Server error.
- Network error.
- Timeout jika mekanisme request mendukungnya.

Jangan menampilkan seluruh response mentah kepada pengguna.

Pesan teknis dapat ditampilkan pada Temporary Testing Frontend dengan penyaringan informasi sensitif.

## 6.3 State Synchronization

1. Jangan menganggap state frontend sebagai database.
2. Setelah perubahan penting, gunakan response backend sebagai hasil utama.
3. Sinkronkan ulang data melalui mekanisme Inertia yang sesuai.
4. Jangan memperbarui saldo secara optimistis sebelum transaksi dikonfirmasi backend.
5. Jangan mempertahankan state lama ketika server mengembalikan perubahan yang berbeda.
6. Jangan membuat cache sendiri tanpa kebutuhan dan strategi invalidasi yang jelas.
7. Jangan menampilkan data yang sudah kedaluwarsa sebagai data terbaru.

---

# 7. AUTHENTICATION & AUTHORIZATION

Sistem S3 hanya memiliki dua role utama:

- ADMIN
- SISWA

## 7.1 Login

Frontend harus mengikuti mekanisme login yang benar-benar diimplementasikan backend.

Ketentuan:

1. Admin dan Siswa harus mengikuti mekanisme autentikasi sesuai kontrak backend.
2. Jangan membuat autentikasi lokal di React.
3. Jangan menyimpan password dalam localStorage, sessionStorage, atau cookie buatan frontend.
4. Jangan menyimpan token sensitif secara sembarangan.
5. Gunakan session dan mekanisme CSRF sesuai konfigurasi Laravel.
6. Tangani login gagal.
7. Tangani akun nonaktif.
8. Tangani sesi kedaluwarsa.
9. Tangani logout melalui mekanisme backend.
10. Jangan mengarahkan pengguna ke dashboard sebelum status autentikasi dikonfirmasi.

Jika sistem menggunakan nama lengkap untuk login, jangan menganggap nama lengkap selalu unik.

Jangan menambahkan NIS sebagai jalan keluar. Ikuti mekanisme identifikasi akun yang sudah disepakati dan disediakan backend.

## 7.2 Role-Based User Interface

Admin dapat melihat fitur administrasi sesuai otorisasi backend.

Siswa hanya dapat melihat fitur dan data miliknya.

Namun:

**Menyembunyikan tombol bukan sistem keamanan.**

Backend tetap wajib melakukan authorization melalui middleware, policy, gate, atau mekanisme yang digunakan project.

Jangan menjadikan pemeriksaan role frontend sebagai pengganti keamanan backend.

## 7.3 Protected Pages

Setiap halaman yang memerlukan autentikasi harus menangani:

- Belum login.
- Sesi kedaluwarsa.
- Role tidak sesuai.
- Akses ditolak.
- Akun nonaktif.

Jangan hanya memeriksa role ketika komponen pertama kali dirender.

---

# 8. S3 BUSINESS LOGIC BOUNDARIES

Bagian ini wajib dipatuhi agar frontend tidak merusak sistem keuangan.

## 8.1 Payment Calendar

Frontend hanya menampilkan kalender dan status kewajiban dari backend.

Jangan membuat perhitungan kewajiban sekolah sendiri.

Jangan menentukan hari yang wajib dibayar berdasarkan JavaScript.

Jangan menganggap semua tanggal adalah hari sekolah.

Ketentuan kalender yang harus ditampilkan sesuai hasil backend:

- Hari Jumat merupakan hari libur.
- Sabtu dan Minggu mengikuti konfigurasi sekolah.
- Hari libur tambahan mengikuti konfigurasi Admin.
- Hari libur tidak menghasilkan kewajiban pembayaran.
- Riwayat kalender sebelumnya tidak boleh berubah hanya karena konfigurasi hari libur saat ini berubah.
- Status setiap hari harus berasal dari data backend.

Jangan menyediakan pilihan tanggal manual ketika melakukan pembayaran.

Frontend tidak boleh mengalokasikan pembayaran ke tanggal tertentu.

## 8.2 Payment Amount

Nominal pembayaran yang disediakan sistem:

- Rp1.000
- Rp2.000
- Rp3.000
- Rp4.000
- Rp5.000
- Rp6.000
- Rp7.000
- Rp8.000
- Rp9.000
- Rp10.000

Aturan:

1. Tampilkan pilihan nominal sesuai aturan backend.
2. Jangan menerima nominal negatif.
3. Jangan menerima nominal nol.
4. Jangan mengubah nominal diam-diam.
5. Jangan menghitung hasil alokasi di frontend.
6. Jangan menganggap nominal yang dipilih sebagai nominal yang sudah diterima.
7. Backend tetap melakukan validasi final.

Simpan dan tampilkan nilai uang berdasarkan integer rupiah atau representasi uang yang disediakan backend.

Jangan menggunakan JavaScript floating-point untuk menghitung saldo atau transaksi.

Gunakan formatter presentasi, misalnya:

```ts
const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});
```

Formatter hanya untuk tampilan, bukan untuk perhitungan keuangan.

## 8.3 Payment Allocation

Seluruh alokasi pembayaran merupakan tanggung jawab backend.

Aturan sistem:

- Pembayaran mengutamakan kewajiban tertua yang belum lunas.
- Jika pembayaran melebihi tunggakan, kelebihannya masuk ke saldo prabayar.
- Saldo prabayar dapat digunakan untuk kewajiban berikutnya sesuai aturan backend.
- QRIS dan tunai menggunakan Payment Engine yang sama.

Frontend dilarang:

1. Menghitung tanggal tunggakan tertua sendiri.
2. Memecah pembayaran menjadi beberapa kewajiban sendiri.
3. Menghitung saldo prabayar sendiri.
4. Mengubah status kalender menjadi lunas berdasarkan perhitungan lokal.
5. Menggunakan kalender kedua untuk transaksi tunai.
6. Menggunakan kalender berbeda untuk transaksi QRIS.

Frontend hanya menampilkan hasil alokasi yang diberikan backend.

---

# 9. QRIS PAYMENT UI RULES

Frontend QRIS harus mengikuti proses backend dan Midtrans yang telah ditentukan.

## 9.1 QRIS Creation

Alur:

1. Siswa memilih nominal.
2. Frontend mengirim permintaan pembuatan transaksi ke backend.
3. Backend membuat transaksi melalui Midtrans.
4. Backend mengembalikan informasi pembayaran yang aman untuk ditampilkan.
5. Frontend menampilkan QRIS sesuai response backend.
6. Siswa melakukan pembayaran menggunakan aplikasi yang mendukung QRIS, seperti DANA jika didukung oleh merchant dan ketentuan penyedia.
7. Frontend menampilkan status transaksi berdasarkan data backend.

Jangan membuat QRIS palsu atau membuat QR Code dari nominal secara lokal.

## 9.2 Payment Status

Frontend harus mampu menampilkan status sesuai kontrak backend, sekurang-kurangnya menangani keadaan:

- Pending.
- Paid atau sukses.
- Failed.
- Expired.
- Cancelled.

Jika backend mempunyai status tambahan, jangan menghilangkannya.

Jangan memetakan semua status yang tidak dikenal menjadi sukses.

Status tidak dikenal harus ditampilkan secara aman sebagai status yang belum dikenali dan tidak boleh dianggap lunas.

## 9.3 Payment Verification

1. Redirect browser bukan bukti pembayaran.
2. Jangan mengubah transaksi menjadi sukses hanya karena pengguna kembali ke halaman aplikasi.
3. Jangan mengalokasikan pembayaran dari frontend.
4. Jangan mengubah kalender menjadi lunas berdasarkan timer.
5. Jangan membuat webhook di frontend.
6. Jangan menampilkan status lunas sebelum backend mengonfirmasikannya.

Webhook dan verifikasi Midtrans sepenuhnya berada di backend.

## 9.4 QRIS Pending Interface

Saat transaksi pending:

- QRIS harus dapat ditampilkan selama masih berlaku.
- Tampilkan informasi nominal.
- Tampilkan ID atau referensi transaksi yang aman.
- Tampilkan status menunggu pembayaran.
- Tampilkan masa berlaku jika dikirim backend.
- Sediakan cara memuat ulang status melalui mekanisme yang didukung.

Jangan membuat polling tanpa batas.

Jangan melakukan request berulang terlalu cepat.

Ikuti interval dan kebijakan polling yang telah ditetapkan backend.

Jangan membuat transaksi QRIS baru secara otomatis hanya karena halaman di-refresh.

---

# 10. CASH PAYMENT UI RULES

Pembayaran tunai hanya dapat dicatat oleh Admin.

Alur yang harus didukung:

1. Admin membuka menu pembayaran tunai.
2. Admin memilih jurusan.
3. Admin memilih kelas.
4. Admin melihat daftar siswa.
5. Admin memilih siswa.
6. Frontend mengambil detail siswa dan informasi pembayaran dari backend.
7. Admin memilih nominal.
8. Admin memeriksa ringkasan transaksi.
9. Admin mengonfirmasi bahwa uang benar-benar diterima.
10. Frontend mengirim permintaan ke backend.
11. Backend memvalidasi dan mencatat transaksi.
12. Frontend menampilkan hasil dari backend.
13. Kalender dan saldo diperbarui dari data backend.

Ketentuan:

- Jangan memberikan akses pembayaran tunai kepada siswa.
- Jangan menganggap klik konfirmasi sebagai bukti transaksi sudah tercatat.
- Cegah double submission dari sisi UI.
- Backend tetap harus memiliki perlindungan idempotency atau mekanisme pencegahan duplikasi yang sesuai.
- Tampilkan identitas siswa dan nominal sebelum konfirmasi.
- Jangan mengubah transaksi yang telah selesai secara diam-diam.
- Tampilkan pesan kegagalan secara jelas.
- Jangan mengulangi request pembayaran secara otomatis setelah timeout tanpa memeriksa status transaksi.

---

# 11. STUDENT MANAGEMENT UI

Frontend Admin harus mendukung fitur manajemen siswa sesuai kemampuan backend:

- Daftar siswa.
- Pencarian siswa.
- Filter jurusan.
- Filter kelas.
- Detail siswa.
- Tambah siswa.
- Edit siswa.
- Arsip siswa.
- Pemulihan siswa jika backend mendukungnya.
- Riwayat kelas.
- Riwayat transaksi.
- Kenaikan kelas.
- Kelulusan.

Ketentuan:

1. Jangan membuat NIS.
2. Jangan menampilkan kolom NIS.
3. Jangan membuat NIS otomatis.
4. Gunakan identitas dan field yang memang tersedia di backend.
5. Gunakan pagination backend apabila disediakan.
6. Gunakan filter backend jika tersedia.
7. Jangan memuat seluruh data siswa secara tidak perlu.
8. Jangan menghapus data keuangan ketika siswa diarsipkan.
9. Gunakan dialog konfirmasi untuk tindakan penting.
10. Tampilkan hasil perubahan berdasarkan response backend.

## 11.1 Student Promotion

UI kenaikan kelas harus mendukung alur yang disediakan backend:

- Kelas X menjadi XI.
- Kelas XI menjadi XII.
- Kelas XII menjadi Alumni.

Jika tersedia, tampilkan preview sebelum proses dilaksanakan.

Jangan menjalankan kenaikan kelas hanya dengan mengubah label kelas di frontend.

Jangan melakukan kenaikan kelas otomatis tanpa konfirmasi yang sesuai.

Jangan menghapus riwayat transaksi lama.

---

# 12. EXCEL IMPORT UI

Fitur import siswa harus mengikuti kontrak backend.

Template Excel yang ditentukan:

| nama_lengkap | kode_jurusan | kode_kelas |
|---|---|---|

Jangan menambahkan kolom NIS.

Frontend harus mendukung:

1. Download template jika disediakan backend.
2. Upload file.
3. Menampilkan batas format dan ukuran sesuai backend.
4. Mengirim file melalui mekanisme multipart yang benar.
5. Menampilkan proses upload.
6. Menampilkan hasil validasi.
7. Menampilkan baris valid.
8. Menampilkan baris bermasalah.
9. Menampilkan alasan kesalahan setiap baris.
10. Konfirmasi import.
11. Menampilkan jumlah berhasil dan gagal.
12. Menampilkan hasil akhir sesuai response backend.

Ketentuan:

- Jangan menganggap file berhasil diimpor hanya karena upload berhasil.
- Jangan mengubah isi file secara diam-diam.
- Jangan mengirim ulang import secara otomatis ketika hasil request tidak diketahui.
- Jangan menampilkan data siswa secara berlebihan pada error log.
- Jangan menyimpan file Excel atau data pribadi di browser tanpa kebutuhan.
- Jangan membuat akun atau password siswa sendiri di frontend.
- Proses pembuatan akun dan aktivasi mengikuti backend.

---

# 13. FINANCIAL DATA PRESENTATION

Frontend harus membedakan data keuangan secara jelas.

Sekurang-kurangnya bedakan:

- Total kewajiban.
- Total pembayaran.
- Total tunggakan.
- Saldo prabayar.
- Transaksi pending.
- Transaksi berhasil.
- Transaksi gagal.

Jangan mencampurkan saldo prabayar dengan total uang yang sudah dibayarkan tanpa penjelasan.

Jangan menjumlahkan transaksi pending sebagai pembayaran yang telah diterima.

Jangan menyimpulkan kondisi keuangan dari jumlah baris tabel saja.

Jangan menghitung ulang total transaksi jika backend sudah memberikan agregasi yang benar.

Gunakan data backend untuk dashboard dan laporan.

Pastikan nominal memiliki format Rupiah dan informasi tanggal konsisten.

---

# 14. FORM HANDLING

Setiap form harus mengikuti aturan berikut:

1. Gunakan controlled state atau mekanisme form yang sesuai dengan arsitektur project.
2. Validasi format input sebelum submit untuk membantu pengguna.
3. Validasi backend tetap menjadi sumber kebenaran.
4. Tampilkan error pada field terkait.
5. Pertahankan input yang tidak sensitif jika validasi gagal dan aman untuk dilakukan.
6. Jangan menyimpan password dalam state global.
7. Jangan mencatat password ke log.
8. Disable tombol submit ketika request sedang diproses.
9. Cegah pengiriman berulang.
10. Tampilkan indikator loading.
11. Tampilkan hasil request yang jelas.
12. Reset form hanya setelah keberhasilan sesuai kebutuhan.
13. Gunakan konfirmasi sebelum tindakan yang berpengaruh pada data penting.

Jangan menghapus pesan error sebelum pengguna memahami kesalahannya.

Jangan menonaktifkan validasi hanya karena ada error pada tampilan.

---

# 15. LOADING, EMPTY, ERROR & SUCCESS STATES

Setiap halaman yang mengambil atau mengubah data wajib mempertimbangkan state berikut.

## Loading

Tampilkan indikator ketika data sedang dimuat atau dikirim.

Hindari tampilan kosong yang membuat pengguna mengira halaman rusak.

## Empty

Bedakan:

- Belum ada data.
- Tidak ditemukan hasil pencarian.
- Filter tidak menghasilkan data.
- Belum memiliki transaksi.
- Belum memiliki kewajiban pembayaran.

Jangan menampilkan error untuk kondisi kosong yang normal.

## Error

Tampilkan pesan yang dapat dipahami pengguna.

Jangan menampilkan stack trace, kredensial, SQL query, atau informasi internal server.

## Success

Berikan konfirmasi hanya setelah backend berhasil memproses tindakan.

## Pending

Gunakan state khusus untuk proses yang belum selesai, terutama pembayaran QRIS.

Jangan menggabungkan pending dengan success.

---

# 16. SEARCH, FILTER & PAGINATION

1. Gunakan parameter pencarian sesuai kontrak backend.
2. Jangan membuat filter yang tidak didukung backend.
3. Jangan melakukan filter data sensitif hanya untuk menyembunyikan hasil dari UI.
4. Gunakan pagination backend untuk daftar berukuran besar.
5. Pertahankan filter ketika berpindah halaman jika didukung.
6. Tangani perubahan filter dengan benar.
7. Hindari request berulang akibat perubahan state yang tidak perlu.
8. Jangan mengunduh semua data hanya untuk melakukan pencarian lokal.
9. Tampilkan informasi total halaman atau jumlah data jika disediakan.
10. Jangan mengasumsikan hasil pencarian selalu tersedia.

---

# 17. DATE, TIME & CALENDAR PRESENTATION

Gunakan zona waktu aplikasi sesuai kebijakan sistem sekolah. Untuk konteks S3, basis waktu operasional adalah Asia/Jakarta jika backend menetapkannya.

Aturan:

1. Jangan menggeser tanggal akibat parsing timezone yang salah.
2. Jangan menganggap string tanggal tanpa timezone sebagai UTC.
3. Ikuti format tanggal dari backend.
4. Bedakan tanggal kalender dan timestamp transaksi.
5. Gunakan format tampilan Indonesia.
6. Jangan menghitung hari sekolah di frontend.
7. Jangan menghitung jatuh tempo sendiri.
8. Jangan menentukan status libur sendiri.
9. Jangan mengubah data kalender historis.
10. Jika backend mengirim waktu kedaluwarsa pembayaran, tampilkan berdasarkan data tersebut.

Uji kasus tanggal ketika waktu melewati tengah malam dan ketika bulan atau tahun berganti.

---

# 18. UI/UX CONSISTENCY

Untuk Temporary Testing Frontend:

- Gunakan tampilan sederhana.
- Gunakan navigasi yang mudah.
- Gunakan tabel dan form yang terbaca.
- Gunakan status badge secara konsisten.
- Hindari animasi yang tidak diperlukan.

Untuk Final Frontend:

- Ikuti desain UI/UX S3 yang telah ditetapkan.
- Gunakan design tokens.
- Gunakan sistem spacing yang konsisten.
- Gunakan tipografi yang konsisten.
- Gunakan komponen yang dapat digunakan kembali.
- Pastikan navigasi Admin dan Siswa berbeda sesuai kebutuhan.
- Jangan mengubah desain tanpa alasan yang jelas.
- Hindari terlalu banyak warna, gradient, shadow, dan dekorasi.
- Jangan membuat setiap halaman memiliki gaya berbeda.

Jangan mengorbankan kejelasan informasi keuangan demi estetika.

---

# 19. RESPONSIVE DESIGN

Pada Final Frontend, semua halaman harus diuji pada:

- Desktop.
- Laptop.
- Tablet.
- Smartphone.

Ketentuan:

1. Tidak boleh ada horizontal overflow yang tidak disengaja.
2. Tombol harus nyaman digunakan dengan sentuhan.
3. Tabel panjang harus memiliki strategi tampilan mobile yang layak.
4. Modal harus sesuai ukuran layar.
5. Navigasi harus tetap dapat digunakan.
6. Form tidak boleh terpotong.
7. Kalender harus tetap terbaca.
8. QR Code tidak boleh terpotong atau terlalu kecil.
9. Informasi transaksi harus tetap terbaca.
10. Jangan hanya mengandalkan satu ukuran viewport.

Temporary Testing Frontend tetap harus bisa digunakan pada ukuran layar yang umum, tetapi tidak perlu mengejar polishing responsif secara berlebihan.

---

# 20. ACCESSIBILITY

UI harus memperhatikan aksesibilitas:

1. Gunakan elemen HTML semantik.
2. Tombol harus menggunakan elemen button.
3. Tautan harus menggunakan elemen link.
4. Input harus memiliki label.
5. Ikon dekoratif tidak boleh menjadi satu-satunya penanda tindakan.
6. Status tidak boleh dibedakan hanya melalui warna.
7. Berikan fokus keyboard yang terlihat.
8. Modal harus memiliki perilaku keyboard yang layak.
9. Jangan menghilangkan outline fokus tanpa pengganti.
10. Gunakan teks alternatif untuk gambar yang bermakna.
11. Pastikan kontras teks cukup.
12. Gunakan nama aksesibel untuk tombol ikon.

---

# 21. SECURITY RULES

Frontend bukan lapisan keamanan utama.

1. Jangan menyimpan Server Key Midtrans di frontend.
2. Jangan menyimpan Signature Secret Key di frontend.
3. Jangan menyimpan password pengguna.
4. Jangan mengekspos secret melalui Vite environment variable.
5. Jangan mengirim token rahasia ke browser.
6. Jangan menampilkan stack trace.
7. Jangan memasukkan data sensitif ke console.
8. Jangan menggunakan `dangerouslySetInnerHTML` tanpa sanitasi dan alasan yang jelas.
9. Jangan merender HTML dari input pengguna sebagai HTML tepercaya.
10. Jangan menaruh data pribadi di URL apabila tidak diperlukan.
11. Jangan menganggap hidden field sebagai perlindungan manipulasi data.
12. Jangan menganggap ID yang dikirim browser dapat dipercaya.
13. Jangan menganggap tombol tersembunyi sebagai otorisasi.
14. Jangan menyimpan informasi autentikasi pada localStorage secara sembarangan.
15. Jangan memproses file unggahan tanpa validasi backend.

CSRF, session security, authorization, webhook verification, dan proteksi transaksi tetap menjadi tanggung jawab backend.

---

# 22. PERFORMANCE RULES

1. Hindari render ulang yang tidak perlu.
2. Jangan memakai `useEffect` untuk semua kebutuhan.
3. Jangan membuat state duplikat dari props tanpa kebutuhan.
4. Jangan menggunakan `useMemo` atau `useCallback` hanya sebagai dekorasi.
5. Gunakan pagination untuk data besar.
6. Hindari memuat data yang tidak sedang diperlukan.
7. Jangan membuat request yang sama berkali-kali.
8. Hindari dependency besar yang tidak dibutuhkan.
9. Gunakan lazy loading hanya ketika memang memberi manfaat.
10. Optimalkan gambar pada Final Frontend.
11. Jangan memasang polling transaksi yang tidak terkendali.
12. Jangan membuat animasi berat yang mengganggu perangkat sekolah.

---

# 23. PWA RULES — FINAL PHASE ONLY

PWA dikerjakan setelah fitur inti dan integrasi stabil.

Sediakan sesuai kebutuhan:

- Web App Manifest.
- Ikon aplikasi.
- Installability.
- Service Worker.
- Offline fallback.
- Update mechanism.
- Pengelolaan cache.

Ketentuan keamanan:

1. Jangan menyimpan data finansial sensitif dalam cache publik.
2. Jangan melakukan cache respons pribadi secara sembarangan.
3. Jangan membuat mode offline yang mengklaim pembayaran berhasil.
4. Jangan menganggap transaksi yang dibuat offline sudah tercatat.
5. Jangan menyimpan QRIS transaksi kedaluwarsa sebagai pembayaran aktif.
6. Jangan membuat service worker menghambat pembaruan aplikasi.
7. Jangan melakukan cache terhadap response autentikasi atau data pribadi tanpa kebijakan yang aman.

Pembayaran membutuhkan koneksi dan konfirmasi backend.

---

# 24. TESTING REQUIREMENTS

Setiap implementasi frontend harus diuji.

## 24.1 Static Checks

Jalankan perintah yang benar-benar tersedia di `package.json`, misalnya:

- TypeScript check.
- ESLint.
- Frontend test.
- Production build.

Jangan mengasumsikan nama script tersedia.

## 24.2 Functional Testing

Uji setidaknya:

### Authentication
- Admin login.
- Siswa login.
- Password salah.
- Akun tidak aktif.
- Logout.
- Session expired.
- Role tidak sesuai.

### Student
- Dashboard.
- Kalender.
- Status pembayaran.
- Riwayat transaksi.
- Data pribadi hanya milik siswa yang login.

### Cash Payment
- Pemilihan jurusan.
- Pemilihan kelas.
- Pemilihan siswa.
- Pemilihan nominal.
- Konfirmasi penerimaan uang.
- Transaksi berhasil.
- Transaksi gagal.
- Pencegahan double submission.

### QRIS
- Membuat transaksi.
- Menampilkan QR Code.
- Status pending.
- Status sukses yang telah dikonfirmasi backend.
- Status gagal.
- Status expired.
- Status cancelled.
- Refresh halaman.
- Webhook duplikat ditangani backend.
- Redirect browser tidak dianggap sebagai bukti pembayaran.

### Calendar
- Hari Jumat.
- Hari libur sekolah.
- Sabtu dan Minggu sesuai konfigurasi.
- Kewajiban tertua.
- Kewajiban yang sudah lunas.
- Kewajiban belum lunas.
- Saldo prabayar.
- Perubahan bulan dan tahun.

### Student Management
- Tambah.
- Edit.
- Arsip.
- Import Excel.
- Kesalahan validasi.
- Kenaikan kelas.
- Kelulusan.
- Nama siswa duplikat.

### Financial Display
- Pembayaran sebagian.
- Pembayaran penuh.
- Pembayaran melebihi tunggakan.
- Saldo prabayar.
- Pending tidak dihitung sebagai lunas.
- Nominal Rupiah benar.

## 24.3 Regression Testing

Ketika mengubah satu komponen, pastikan fitur lain yang memakai komponen tersebut tetap bekerja.

Jangan menghapus atau menurunkan kualitas test untuk membuat build terlihat berhasil.

Jangan mengklaim semua test berhasil apabila tidak menjalankannya.

---

# 25. ERROR HANDLING & DEBUGGING

Ketika terjadi error:

1. Reproduksi masalah.
2. Periksa console browser.
3. Periksa network request.
4. Periksa response backend.
5. Periksa kontrak data.
6. Identifikasi akar masalah.
7. Tentukan apakah sumber masalah berada di frontend atau backend.
8. Perbaiki penyebab sebenarnya.
9. Jalankan kembali pengujian.

Dilarang:

- Menyembunyikan error tanpa memperbaikinya.
- Mengganti error dengan dummy data.
- Menghapus validasi.
- Memaksa response menjadi tipe yang salah.
- Membuat fallback success.
- Mengulang transaksi pembayaran tanpa pemeriksaan.
- Mengubah status finansial secara lokal untuk menghindari bug.

Jika masalah berasal dari backend, laporkan endpoint, request, response, dan masalahnya. Jangan membuat workaround finansial di frontend.

---

# 26. GIT & CHANGE MANAGEMENT

Sebelum mengubah file:

1. Periksa branch.
2. Periksa `git status`.
3. Periksa perubahan yang belum di-commit.
4. Jangan menghapus perubahan milik pengguna.
5. Jangan mengganti konfigurasi tanpa kebutuhan.
6. Jangan mengedit file di luar lingkup pekerjaan.

Ketika pekerjaan selesai:

1. Periksa diff.
2. Hapus debug code yang tidak diperlukan.
3. Periksa tidak ada secret.
4. Jalankan test yang tersedia.
5. Jalankan build.
6. Laporkan file yang berubah.
7. Laporkan hasil pengujian.

Jangan melakukan:

- `git reset --hard` tanpa izin.
- `git clean -fd` tanpa izin.
- Force push.
- Rewrite shared history.
- Mengubah remote.
- Push otomatis.
- Commit otomatis tanpa otorisasi jika aturan project mewajibkan persetujuan.

Gunakan Conventional Commits jika commit telah diizinkan.

---

# 27. DOCUMENTATION RULES

Dokumentasikan frontend seperlunya.

README atau dokumentasi project harus menjelaskan:

- Cara menjalankan frontend.
- Dependency utama.
- Environment configuration.
- Hubungan React, Inertia, dan Laravel.
- Struktur direktori aktual.
- Cara menjalankan TypeScript check.
- Cara menjalankan frontend test.
- Cara menjalankan production build.
- Cara debugging masalah integrasi.

Jangan mendokumentasikan fitur yang belum ada sebagai fitur selesai.

Jangan menyalin konfigurasi rahasia ke dokumentasi.

---

# 28. ACCEPTANCE CRITERIA

Frontend dianggap selesai apabila:

1. Seluruh halaman sesuai scope pekerjaan telah tersedia.
2. Semua route menggunakan kontrak backend yang benar.
3. Tidak ada dummy data yang menggantikan data produksi.
4. Tidak ada business logic finansial yang diduplikasi.
5. Autentikasi sesuai backend.
6. Otorisasi tidak hanya mengandalkan frontend.
7. Semua form menangani validasi dengan benar.
8. Semua request menangani error.
9. Pembayaran pending tidak ditampilkan sebagai lunas.
10. QRIS mengikuti status yang dikonfirmasi backend.
11. Pembayaran tunai menggunakan proses backend yang sama untuk alokasi.
12. Kalender membaca status dari backend.
13. Siswa tidak dapat melihat data siswa lain.
14. Tidak ada kolom atau fitur NIS.
15. TypeScript check berhasil.
16. Test yang tersedia telah dijalankan dan hasilnya dilaporkan.
17. Production build berhasil.
18. Tidak ada error kritis yang belum dilaporkan.
19. Tidak ada secret yang terekspos.
20. Seluruh perubahan sesuai scope pekerjaan.

Untuk Temporary Testing Frontend, kriteria visual final dan PWA belum diwajibkan. Fokus utamanya adalah membuktikan integrasi serta business logic backend berjalan benar.

---

# 29. REQUIRED AI WORKFLOW

Setiap task frontend wajib mengikuti urutan:

**INSPECT → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → REPORT**

### INSPECT
Periksa struktur project, instruksi, dan kode yang berkaitan.

### UNDERSTAND
Pastikan memahami kebutuhan pengguna, kontrak backend, dan dampak perubahan.

### PLAN
Susun langkah implementasi paling kecil yang menyelesaikan task.

### IMPLEMENT
Implementasikan hanya yang dibutuhkan.

### TEST
Jalankan test yang relevan dan periksa hasilnya.

### REVIEW
Periksa kualitas kode, keamanan, regresi, dan diff.

### REPORT
Laporkan hasil secara jujur dan terstruktur.

Jangan melompati tahapan hanya untuk menghasilkan banyak file.

---

# 30. REQUIRED REPORT FORMAT

Setelah menyelesaikan pekerjaan, AI WAJIB memberikan laporan:

## A. Task Summary
Apa yang dikerjakan dan tujuannya.

## B. Files Changed
Daftar file yang dibuat, diedit, atau dihapus beserta alasannya.

## C. Backend Integration
Endpoint atau route yang digunakan dan status integrasinya.

## D. Functional Status
Fitur yang berhasil, belum berhasil, atau belum diuji.

## E. Testing Results
Perintah yang benar-benar dijalankan dan hasilnya.

## F. Errors
Masalah yang ditemukan dan apakah sudah diperbaiki.

## G. Security Review
Apakah ada potensi kebocoran data, masalah role, atau masalah request.

## H. Remaining Work
Pekerjaan berikutnya yang memang diperlukan.

Jangan menulis "100% selesai" tanpa bukti pengujian yang memadai.

---

# FINAL DIRECTIVE

Bertindaklah sebagai Senior Frontend Engineer yang bekerja pada sistem keuangan sekolah.

Jangan mengejar jumlah kode, jumlah komponen, atau jumlah halaman.

Utamakan implementasi yang benar, sederhana, aman, dapat diuji, dan konsisten dengan backend.

Untuk tahap saat ini, kerjakan TEMPORARY TESTING FRONTEND terlebih dahulu.

Jangan membuat Final Frontend UI/UX sebelum backend dinyatakan lolos audit dan pengujian.

Jangan mengarang fitur atau kontrak backend.

Jangan mengubah business logic pembayaran di frontend.

Jangan melakukan pekerjaan di luar scope.

**Every feature must work, every interaction must be testable, every financial status must come from the backend, and every claim of completion must be supported by evidence.**