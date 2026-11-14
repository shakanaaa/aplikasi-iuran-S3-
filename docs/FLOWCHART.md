# S3 — FLOWCHART BISNIS

**Versi:** 1.1  
**Backend:** Laravel  
**Frontend:** React + TypeScript + Inertia.js  
**Database:** MySQL  
**Payment Gateway:** Midtrans QRIS  
**Platform:** Web dan PWA  
**Role:** Admin dan User (Siswa)

---

# BAGIAN 1 — KONSEP ARSITEKTUR SISTEM

## 1.1 Gambaran Umum

S3 merupakan sistem pencatatan simpanan harian siswa dengan nominal kewajiban Rp1.000 per hari sekolah.

Sistem menyediakan dua metode pembayaran:

1. Pembayaran tunai yang dicatat oleh admin.
2. Pembayaran online melalui QRIS.

Kedua metode pembayaran wajib menggunakan mekanisme alokasi yang sama.

### Alur utama sistem

1. Admin memasukkan data siswa.
2. Admin mengatur tahun ajaran, jurusan, kelas, dan kalender sekolah.
3. Sistem membuat kewajiban harian siswa berdasarkan hari sekolah.
4. Siswa melihat kalender pembayaran.
5. Siswa dapat membayar menggunakan QRIS.
6. Admin dapat mencatat pembayaran tunai.
7. Sistem mengalokasikan uang ke kewajiban tertua yang belum lunas.
8. Sistem memperbarui status kalender siswa.
9. Admin dapat memantau laporan dan riwayat transaksi.
10. Ketika tahun ajaran berakhir, admin memproses kenaikan kelas atau kelulusan.

## 1.2 Prinsip arsitektur

- Satu siswa memiliki satu identitas internal (`students.id`).
- Satu siswa memiliki riwayat kelas.
- Satu kewajiban harian tidak boleh tercatat dua kali.
- Satu transaksi dapat membayar beberapa kewajiban.
- Satu kewajiban dapat menerima alokasi dari beberapa transaksi.
- Transaksi tunai dan QRIS menggunakan sistem alokasi yang sama.
- Pembayaran yang belum berhasil tidak boleh mengubah kalender.
- Saldo prabayar harus memiliki riwayat pergerakan.
- Transaksi keuangan tidak boleh dihapus sembarangan.
- Riwayat siswa harus tetap tersedia setelah lulus.
- Perubahan kalender tidak boleh mengubah catatan historis secara otomatis.

---

# BAGIAN 2 — FLOWCHART UTAMA

## 2.1 Flowchart keseluruhan aplikasi

```mermaid
flowchart TD
    START([Mulai]) --> ACCESS[Buka aplikasi S3]
    ACCESS --> AUTH{Sudah login?}

    AUTH -->|Belum| LOGIN[Halaman login]
    LOGIN --> INPUT[Masukkan identitas dan password]
    INPUT --> VALIDATE{Validasi akun}

    VALIDATE -->|Gagal| ERROR[Tampilkan pesan kesalahan]
    ERROR --> LOGIN

    VALIDATE -->|Berhasil| ROLE{Periksa role}
    AUTH -->|Sudah| ROLE

    ROLE -->|Admin| ADMIN[Dashboard Admin]
    ROLE -->|Siswa| STUDENT[Dashboard Siswa]

    ADMIN --> ADMIN_MENU{Pilih menu admin}
    ADMIN_MENU --> MASTER[Master Data]
    ADMIN_MENU --> FINANCE[Keuangan]
    ADMIN_MENU --> CALENDAR[Kalender Sekolah]
    ADMIN_MENU --> PROMOTION[Kenaikan Kelas]
    ADMIN_MENU --> REPORT[Laporan]
    ADMIN_MENU --> SETTINGS[Pengaturan]

    STUDENT --> STUDENT_MENU{Pilih menu siswa}
    STUDENT_MENU --> MY_CAL[Kalender Pembayaran]
    STUDENT_MENU --> MY_PAYMENT[Pembayaran QRIS]
    STUDENT_MENU --> HISTORY[Riwayat Transaksi]
    STUDENT_MENU --> PROFILE[Profil]

    MASTER --> ADMIN
    FINANCE --> ADMIN
    CALENDAR --> ADMIN
    PROMOTION --> ADMIN
    REPORT --> ADMIN
    SETTINGS --> ADMIN

    MY_CAL --> STUDENT
    MY_PAYMENT --> STUDENT
    HISTORY --> STUDENT
    PROFILE --> STUDENT

    ADMIN --> LOGOUT[Logout]
    STUDENT --> LOGOUT
    LOGOUT --> END([Selesai])
```

## 2.2 Flowchart autentikasi dan hak akses

```mermaid
flowchart TD
    A([Mulai]) --> B[Halaman Login]
    B --> C{Jenis akun}

    C -->|Admin| D[Masukkan username dan password]
    C -->|Siswa| E[Masukkan nama lengkap dan password]

    D --> F[Validasi kredensial]
    E --> F

    F --> G{Data valid?}
    G -->|Tidak| H[Catat percobaan login jika diperlukan]
    H --> I[Tampilkan pesan error]
    I --> B

    G -->|Ya| J{Akun aktif?}
    J -->|Tidak| K[Tampilkan akun tidak aktif]
    K --> B

    J -->|Ya| L[Buat session autentikasi]
    L --> M[Ambil role dan permission]
    M --> N{Role}

    N -->|Admin| O[Dashboard Admin]
    N -->|Siswa| P[Dashboard Siswa]

    O --> Q{Request halaman}
    P --> R{Request halaman}

    Q --> S[Periksa permission dan policy]
    R --> T[Periksa kepemilikan data]

    S --> U{Diizinkan?}
    T --> U

    U -->|Tidak| V[403 Forbidden]
    U -->|Ya| W[Tampilkan halaman]

    V --> X([Selesai])
    W --> X
```

**Catatan autentikasi:**

- Admin menggunakan username dan password.
- Siswa login menggunakan **nama lengkap dan password** melalui relasi `students.user_id`.
- `students.id` adalah satu-satunya identitas internal siswa; tidak ada identitas siswa tambahan di luar `students.id`.
- Nama lengkap **tidak unik** karena dua siswa dapat memiliki nama yang sama.
- Jika terdapat nama lengkap yang sama, sistem **tidak boleh memilih akun secara acak**. Admin wajib menyediakan mekanisme identifikasi dan aktivasi akun (misalnya penetapan username unik sebagai pembeda) sehingga siswa masuk ke akun yang benar.
- Password wajib di-hash.
- Password tidak boleh disimpan dalam bentuk teks biasa.

---

# BAGIAN 3 — FLOWCHART MASTER DATA

## 3.1 Manajemen jurusan, kelas, dan tahun ajaran

```mermaid
flowchart TD
    A([Dashboard Admin]) --> B[Master Data]
    B --> C{Pilih data}

    C -->|Jurusan| D[Daftar Jurusan]
    C -->|Kelas| E[Daftar Kelas]
    C -->|Tahun Ajaran| F[Daftar Tahun Ajaran]

    D --> D1{Aksi}
    D1 -->|Tambah| D2[Form Jurusan]
    D1 -->|Edit| D3[Ubah Jurusan]
    D1 -->|Nonaktifkan| D4[Periksa relasi jurusan]
    D2 --> D5[Validasi kode dan nama]
    D3 --> D5
    D4 --> D6{Masih digunakan?}
    D6 -->|Ya| D7[Tolak penghapusan atau nonaktifkan]
    D6 -->|Tidak| D8[Nonaktifkan]
    D5 --> D9[Simpan perubahan]
    D7 --> D
    D8 --> D
    D9 --> D

    E --> E1[Kelola nama kelas dan tingkat]
    E1 --> E2[Hubungkan dengan jurusan]
    E2 --> E3[Hubungkan dengan tahun ajaran]
    E3 --> E4[Validasi kelas]
    E4 --> E5[Simpan]
    E5 --> E

    F --> F1[Tambah tahun ajaran]
    F1 --> F2[Isi tanggal mulai dan berakhir]
    F2 --> F3[Atur status aktif]
    F3 --> F4{Ada tahun ajaran aktif lain?}
    F4 -->|Ya| F5[Konfirmasi pergantian tahun ajaran]
    F4 -->|Tidak| F6[Simpan]
    F5 --> F6
    F6 --> F
```

## 3.2 Manajemen siswa

```mermaid
flowchart TD
    A([Admin]) --> B[Menu Data Siswa]
    B --> C{Pilih tindakan}

    C -->|Tambah| D[Form Tambah Siswa]
    C -->|Edit| E[Pilih Siswa]
    C -->|Detail| F[Lihat Profil dan Riwayat]
    C -->|Arsipkan| G[Pilih Siswa]
    C -->|Import| H[Import Excel]
    C -->|Export| I[Export Data]

    D --> J[Isi nama lengkap, jurusan, kelas, dan data opsional]
    J --> K[Validasi data siswa dan kelas]
    K --> L{Valid?}
    L -->|Tidak| M[Tampilkan kesalahan]
    M --> D
    L -->|Ya| N[Buat akun siswa]
    N --> N1{Nama lengkap duplikat?}
    N1 -->|Ya| N2[Admin tetapkan identitas login pembeda]
    N1 -->|Tidak| O[Catat riwayat kelas]
    N2 --> O
    O --> P[Buat kewajiban sesuai kebijakan tanggal efektif]
    P --> Q[Audit log]
    Q --> B

    E --> R[Ubah data siswa]
    R --> S[Validasi perubahan]
    S --> T[Simpan dan audit]
    T --> B

    F --> U[Tampilkan identitas, kelas, kalender, transaksi]
    U --> B

    G --> V[Periksa kewajiban dan transaksi]
    V --> W{Boleh diarsipkan?}
    W -->|Tidak| X[Tampilkan alasan]
    W -->|Ya| Y[Arsipkan tanpa menghapus histori]
    X --> B
    Y --> Q

    H --> Z[Proses import]
    Z --> B

    I --> AA[Generate file export]
    AA --> B
```

## 3.3 Flowchart import Excel

```mermaid
flowchart TD
    A([Admin]) --> B[Unduh Template Excel]
    B --> C[Isi data siswa]
    C --> D[Upload Excel]
    D --> E[Validasi format file]
    E --> F{Format valid?}

    F -->|Tidak| G[Tolak file]
    G --> D

    F -->|Ya| H[Baca seluruh baris]
    H --> I[Validasi setiap baris]

    I --> J{Data valid?}
    J -->|Tidak| K[Catat nomor baris dan alasan]
    J -->|Ya| L[Masukkan ke daftar valid]

    K --> M[Preview hasil import]
    L --> M

    M --> N{Admin menyetujui?}
    N -->|Tidak| O[Batalkan import]
    N -->|Ya| P[Mulai database transaction]

    P --> Q[Proses data valid]
    Q --> R{Ada kegagalan?}

    R -->|Ya| S[Rollback sesuai kebijakan batch]
    R -->|Tidak| T[Commit]

    S --> U[Laporkan kegagalan]
    T --> V[Simpan ringkasan import]
    V --> W[Audit log]
    U --> X([Selesai])
    W --> X
    O --> X
```

**Template import Excel:**

| Kolom | Wajib | Keterangan |
|---|---|---|
| `nama_lengkap` | Ya | Nama lengkap siswa |
| `kode_jurusan` | Ya | Kode jurusan yang tersedia |
| `kode_kelas` | Ya | Kode kelas yang tersedia |
| `tanggal_masuk` | Sesuai kebutuhan | Tanggal masuk siswa |

Template tidak memuat kolom identitas siswa. Sistem membuat `students.id` secara otomatis untuk setiap baris yang berhasil diimpor.

**Aturan import:**

- Jurusan dan kelas harus tersedia.
- Kolom wajib harus terisi.
- `tanggal_masuk` harus berupa tanggal yang valid jika diisi.
- Baris yang tidak valid harus ditampilkan berdasarkan nomor baris.
- Preview wajib ditampilkan sebelum import.
- Tidak boleh otomatis menimpa siswa yang sudah ada.
- Kemungkinan duplikat ditandai berdasarkan kombinasi nama lengkap, jurusan, kelas, dan tanggal masuk; admin memutuskan melalui preview.
- Password dibuat melalui proses aktivasi akun yang aman oleh admin.
- Simpan riwayat batch import.

---

# BAGIAN 4 — FLOWCHART KALENDER DAN KEWAJIBAN HARIAN

## 4.1 Pembuatan kalender kewajiban

```mermaid
flowchart TD
    A([Mulai]) --> B[Ambil siswa aktif]
    B --> C[Ambil tahun ajaran]
    C --> D[Ambil periode kalender]
    D --> E[Ambil jadwal sekolah]
    E --> F[Ambil hari libur]

    F --> G[Periksa setiap tanggal]
    G --> H{Tanggal termasuk hari sekolah?}

    H -->|Tidak| I[Tidak membuat kewajiban]
    H -->|Ya| J{Hari Jumat?}

    J -->|Ya| I
    J -->|Tidak| K{Hari libur tambahan?}

    K -->|Ya| I
    K -->|Tidak| L[Periksa siswa memenuhi syarat]
    
    L --> M{Siswa aktif pada tanggal tersebut?}
    M -->|Tidak| I
    M -->|Ya| N[Periksa kewajiban sudah ada]

    N --> O{Sudah ada?}
    O -->|Ya| P[Lewati]
    O -->|Tidak| Q[Buat kewajiban Rp1.000]

    P --> R{Masih ada tanggal?}
    I --> R
    Q --> R

    R -->|Ya| G
    R -->|Tidak| S[Hitung status kewajiban]
    S --> T[Perbarui ringkasan kalender]
    T --> U([Selesai])
```

## 4.2 Aturan kalender

Status kalender harus dibedakan menjadi:

| Status | Arti |
|---|---|
| Lunas | Kewajiban telah dibayar penuh |
| Belum lunas | Kewajiban masih memiliki kekurangan |
| Sebagian | Sudah menerima alokasi tetapi belum lunas |
| Libur | Tidak ada kewajiban |
| Belum berlaku | Siswa belum aktif atau belum memenuhi syarat pada tanggal tersebut |

Status menunggu pembayaran QRIS ditampilkan sebagai status transaksi, bukan sebagai status lunas pada kalender.

## 4.3 Flowchart perhitungan status kalender

```mermaid
flowchart TD
    A([Ambil tanggal siswa]) --> B{Apakah hari sekolah?}
    B -->|Tidak| C[Status Libur atau Tidak Ada Kewajiban]
    B -->|Ya| D{Siswa aktif pada tanggal tersebut?}

    D -->|Tidak| E[Status Belum Berlaku]
    D -->|Ya| F[Ambil kewajiban harian]

    F --> G{Kewajiban ditemukan?}
    G -->|Tidak| H[Periksa generator kewajiban]
    H --> I[Buat jika memang memenuhi syarat]
    I --> F

    G -->|Ya| J[Hitung total alokasi bersih]
    J --> K{Total alokasi >= nominal kewajiban?}

    K -->|Ya| L[Status Lunas]
    K -->|Tidak| M{Total alokasi > 0?}

    M -->|Ya| N[Status Sebagian]
    M -->|Tidak| O[Status Belum Lunas]

    C --> P([Selesai])
    E --> P
    L --> P
    N --> P
    O --> P
```

---

# BAGIAN 5 — FLOWCHART PEMBAYARAN

## 5.1 Mekanisme alokasi pembayaran bersama

Ini merupakan bagian terpenting aplikasi.

Pembayaran tunai dan QRIS harus memanggil proses alokasi yang sama.

```mermaid
flowchart TD
    A([Pembayaran Berhasil]) --> B[Terima transaksi dari sumber]
    B --> C{Metode pembayaran}

    C -->|Tunai| D[Transaksi tunai admin]
    C -->|QRIS| E[Transaksi QRIS terverifikasi]

    D --> F[Validasi nominal dan siswa]
    E --> F

    F --> G{Transaksi valid dan belum diproses?}
    G -->|Tidak| H[Tolak atau tandai duplikat]
    G -->|Ya| I[Mulai database transaction]

    I --> J[Lock data siswa dan saldo]
    J --> K[Ambil kewajiban tertua yang belum lunas]
    K --> L[Hitung kekurangan setiap kewajiban]

    L --> M{Masih ada uang?}
    M -->|Tidak| N[Selesaikan alokasi]
    M -->|Ya| O{Masih ada kewajiban?}

    O -->|Ya| P[Alokasikan ke kewajiban tertua]
    P --> Q[Kurangi sisa uang]
    Q --> R[Perbarui nilai alokasi]
    R --> M

    O -->|Tidak| S[Catat sisa sebagai saldo prabayar]
    S --> N

    N --> T[Perbarui status transaksi]
    T --> U[Commit database transaction]
    U --> V[Perbarui tampilan kalender]
    V --> W[Catat audit log]
    W --> X([Selesai])

    H --> X
```

## 5.2 Contoh alokasi

Misalnya siswa mempunyai:

| Tanggal | Kewajiban | Sudah dibayar | Kekurangan |
|---|---:|---:|---:|
| 13 Nov | Rp1.000 | Rp0 | Rp1.000 |
| 14 Nov | Rp1.000 | Rp0 | Rp1.000 |
| 15 Nov | Rp1.000 | Rp0 | Rp1.000 |
| 16 Nov | Rp1.000 | Rp0 | Rp1.000 |

Siswa membayar Rp3.000.

Hasil:

| Tanggal | Alokasi | Status |
|---|---:|---|
| 13 Nov | Rp1.000 | Lunas |
| 14 Nov | Rp1.000 | Lunas |
| 15 Nov | Rp1.000 | Lunas |
| 16 Nov | Rp0 | Belum lunas |

Jika siswa membayar Rp5.000, maka Rp1.000 sisanya dicatat sebagai saldo prabayar.

Saldo prabayar bukan transaksi pembayaran baru. Saldo tersebut merupakan sisa uang dari transaksi yang sudah berhasil.

## 5.3 Flowchart pembayaran tunai

```mermaid
flowchart TD
    A([Dashboard Admin]) --> B[Menu Pembayaran Tunai]
    B --> C[Pilih Jurusan]
    C --> D[Pilih Kelas]
    D --> E[Tampilkan Daftar Siswa]
    E --> F[Pilih Siswa]

    F --> G[Tampilkan Detail Kewajiban]
    G --> H[Pilih Nominal Rp1.000-Rp10.000]
    H --> I[Konfirmasi Pembayaran]

    I --> J{Konfirmasi valid?}
    J -->|Tidak| G
    J -->|Ya| K[Backend validasi]

    K --> L{Siswa aktif dan nominal valid?}
    L -->|Tidak| M[Tampilkan error]
    M --> G

    L -->|Ya| N[Buat transaksi tunai]
    N --> O[Panggil Allocation Service]
    O --> P[Alokasikan kewajiban tertua]
    P --> Q[Catat sisa prabayar jika ada]
    Q --> R[Commit transaksi]
    R --> S[Tampilkan bukti pembayaran]
    S --> T[Update kalender siswa]
    T --> U[Audit log]
    U --> V([Selesai])
```

## 5.4 Flowchart pembayaran QRIS

```mermaid
flowchart TD
    A([Dashboard Siswa]) --> B[Menu Bayar]
    B --> C[Tampilkan nominal pembayaran]
    C --> D[Pilih nominal Rp1.000-Rp10.000]
    D --> E[Konfirmasi]

    E --> F{Input valid?}
    F -->|Tidak| C
    F -->|Ya| G[Backend membuat transaksi pending]

    G --> H[Request QRIS ke Midtrans]
    H --> I{Midtrans merespons?}

    I -->|Tidak| J[Catat kegagalan request]
    J --> K[Tampilkan pesan]
    K --> B

    I -->|Ya| L[Simpan referensi dan QRIS]
    L --> M[Tampilkan QRIS]
    M --> N[Menunggu pembayaran]

    N --> O[Midtrans mengirim webhook]
    O --> P[Verifikasi signature dan transaksi]
    P --> Q{Webhook valid?}

    Q -->|Tidak| R[Tolak dan catat]
    Q -->|Ya| S[Periksa status transaksi]

    S --> T{Status pembayaran}
    T -->|Settlement/Capture sukses| U[Periksa idempotency]
    T -->|Pending| V[Tetap menunggu]
    T -->|Expire| W[Tandai kedaluwarsa]
    T -->|Deny/Cancel| X[Tandai gagal atau dibatalkan]

    U --> Y{Sudah diproses?}
    Y -->|Ya| Z[Berikan respons tanpa alokasi ulang]
    Y -->|Tidak| AA[Mulai database transaction]

    AA --> AB[Ubah status transaksi sukses]
    AB --> AC[Panggil Allocation Service]
    AC --> AD[Alokasikan kewajiban tertua]
    AD --> AE[Catat saldo prabayar]
    AE --> AF[Commit]

    AF --> AG[Update kalender]
    AG --> AH[Kirim notifikasi]
    AH --> AI([Selesai])

    R --> AI
    Z --> AI
    V --> AI
    W --> AI
    X --> AI
```

**Catatan penting:**

- QRIS yang baru dibuat tidak langsung dianggap lunas.
- Status sukses hanya boleh ditentukan setelah verifikasi backend.
- Webhook yang sama dapat dikirim lebih dari sekali.
- Webhook berulang tidak boleh mengalokasikan pembayaran dua kali.
- Gunakan identitas event atau referensi transaksi untuk idempotency.
- Jika webhook terlambat, gunakan proses rekonsiliasi status transaksi.
- Jangan membatalkan transaksi yang sudah sukses hanya karena frontend menampilkan timeout.

## 5.5 Flowchart pembatalan dan koreksi transaksi

```mermaid
flowchart TD
    A([Admin]) --> B[Menu Riwayat Transaksi]
    B --> C[Pilih Transaksi]
    C --> D[Lihat Detail]
    D --> E{Tindakan}

    E -->|Lihat| F[Tampilkan detail transaksi]
    E -->|Ajukan koreksi| G[Isi alasan koreksi]
    E -->|Refund| H[Ajukan pengembalian dana]

    G --> I[Periksa status transaksi]
    H --> I

    I --> J{Boleh dikoreksi?}
    J -->|Tidak| K[Tolak dan tampilkan alasan]
    J -->|Ya| L[Catat permintaan koreksi]

    L --> M[Periksa otorisasi]
    M --> N{Diizinkan?}
    N -->|Tidak| O[Tolak]
    N -->|Ya| P[Catat reversal atau adjustment]

    P --> Q[Balikkan alokasi terkait]
    Q --> R[Hitung ulang kewajiban]
    R --> S[Sesuaikan ledger prabayar jika perlu]
    S --> T[Audit log]
    T --> U[Perbarui laporan]

    F --> V([Selesai])
    K --> V
    O --> V
    U --> V
```

---

# BAGIAN 6 — FLOWCHART SALDO PRABAYAR

## 6.1 Penggunaan saldo prabayar

```mermaid
flowchart TD
    A([Ada Saldo Prabayar]) --> B[Periode kewajiban baru]
    B --> C[Generate kewajiban harian]
    C --> D[Ambil saldo prabayar tersedia]
    D --> E[Ambil kewajiban tertua belum lunas]

    E --> F{Ada kewajiban?}
    F -->|Tidak| G[Simpan saldo tetap tersedia]
    F -->|Ya| H[Hitung kekurangan kewajiban]

    H --> I{Saldo cukup?}
    I -->|Ya| J[Alokasikan sesuai kekurangan]
    I -->|Tidak| K[Alokasikan seluruh saldo]

    J --> L[Catat pergerakan saldo]
    K --> L
    L --> M[Perbarui status kewajiban]
    M --> N[Hitung sisa saldo]

    N --> O{Masih ada saldo?}
    O -->|Ya| E
    O -->|Tidak| P([Selesai])

    G --> P
```

Saldo prabayar wajib dicatat sebagai ledger. Jangan hanya menyimpan angka saldo yang dapat berubah tanpa riwayat.

---

# BAGIAN 7 — FLOWCHART KENAIKAN KELAS DAN KELULUSAN

## 7.1 Kenaikan kelas massal

```mermaid
flowchart TD
    A([Admin]) --> B[Menu Kenaikan Kelas]
    B --> C[Pilih Tahun Ajaran Asal]
    C --> D[Pilih Tahun Ajaran Tujuan]
    D --> E[Ambil siswa aktif]
    E --> F[Kelompokkan berdasarkan jurusan dan kelas]

    F --> G[Atur pemetaan kelas]
    G --> H[Preview perubahan]

    H --> I{Validasi berhasil?}
    I -->|Tidak| J[Tampilkan konflik]
    J --> G

    I -->|Ya| K[Admin menyetujui]
    K --> L[Mulai database transaction]

    L --> M[Proses setiap siswa]
    M --> N{Tingkat kelas}

    N -->|X| O[Pindah ke XI]
    N -->|XI| P[Pindah ke XII]
    N -->|XII| Q[Ubah status menjadi Alumni]

    O --> R[Tutup riwayat kelas lama]
    P --> R
    Q --> S[Tutup riwayat kelas aktif]

    R --> T[Buat riwayat kelas baru]
    S --> U[Catat kelulusan]

    T --> V{Masih ada siswa?}
    U --> V

    V -->|Ya| M
    V -->|Tidak| W[Commit perubahan]

    W --> X[Simpan promotion batch]
    X --> Y[Audit log]
    Y --> Z([Selesai])
```

## 7.2 Kenaikan kelas individual

```mermaid
flowchart TD
    A([Admin]) --> B[Pilih Siswa]
    B --> C[Lihat kelas sekarang]
    C --> D[Pilih kelas tujuan]
    D --> E[Isi alasan perubahan]
    E --> F[Validasi jurusan dan tahun ajaran]
    F --> G{Valid?}

    G -->|Tidak| H[Tampilkan error]
    H --> D

    G -->|Ya| I[Preview riwayat]
    I --> J[Konfirmasi]
    J --> K[Tutup riwayat kelas lama]
    K --> L[Buat riwayat kelas baru]
    L --> M[Audit log]
    M --> N([Selesai])
```

## 7.3 Kelulusan

Ketika siswa kelas XII lulus:

- Status siswa menjadi `graduated`.
- Tanggal kelulusan dicatat.
- Riwayat kelas terakhir tetap tersimpan.
- Akun siswa dapat dinonaktifkan sesuai kebijakan.
- Transaksi dan kalender historis tetap dapat dilihat admin.
- Siswa tidak lagi menerima kewajiban baru setelah tanggal efektif kelulusan.

---

# BAGIAN 8 — FLOWCHART LAPORAN DAN AUDIT

## 8.1 Laporan keuangan

```mermaid
flowchart TD
    A([Admin]) --> B[Menu Laporan]
    B --> C[Pilih Jenis Laporan]

    C --> D[Laporan Harian]
    C --> E[Laporan Bulanan]
    C --> F[Laporan Per Kelas]
    C --> G[Laporan Per Jurusan]
    C --> H[Laporan Per Siswa]
    C --> I[Laporan Metode Pembayaran]

    D --> J[Pilih periode]
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J

    J --> K[Validasi filter]
    K --> L[Ambil data transaksi dan alokasi]
    L --> M[Hitung total pembayaran]
    M --> N[Hitung kewajiban]
    N --> O[Hitung tunggakan]
    O --> P[Hitung saldo prabayar]
    P --> Q[Tampilkan laporan]

    Q --> R{Export?}
    R -->|Ya| S[Generate Excel/PDF]
    R -->|Tidak| T([Selesai])
    S --> T
```

## 8.2 Audit log

Audit log harus mencatat tindakan penting, misalnya:

- Penambahan siswa.
- Perubahan data siswa.
- Pengarsipan siswa.
- Import Excel.
- Kenaikan kelas.
- Perubahan kalender.
- Pencatatan tunai.
- Koreksi transaksi.
- Reversal.
- Perubahan pengaturan pembayaran.
- Perubahan hak akses.

Setiap catatan audit sebaiknya memiliki:
- Pengguna yang melakukan tindakan.
- Jenis tindakan.
- Entitas yang berubah.
- ID entitas.
- Data sebelum perubahan jika aman disimpan.
- Data sesudah perubahan jika aman disimpan.
- Waktu.
- IP atau informasi request yang relevan.

Jangan menyimpan password, secret key, token, atau data sensitif di audit log.

---

# BAGIAN 15 — SKENARIO PENGUJIAN WAJIB

## Skenario 1 — Pembayaran normal

Kondisi:
- Tiga kewajiban belum lunas.
- Siswa membayar Rp3.000.

Hasil:
- Ketiga kewajiban lunas.
- Tidak ada saldo prabayar.

## Skenario 2 — Pembayaran berlebih

Kondisi:
- Tiga kewajiban belum lunas.
- Siswa membayar Rp5.000.

Hasil:
- Tiga kewajiban lunas.
- Saldo prabayar Rp2.000.

## Skenario 3 — Pembayaran sebagian

Kondisi:
- Siswa memiliki kewajiban Rp1.000.
- Terdapat pembayaran Rp500 yang diizinkan oleh proses koreksi atau sumber pembayaran yang mendukung nominal parsial.

Hasil:
- Status kewajiban menjadi sebagian.
- Kekurangan tetap tercatat.

Catatan: nominal pilihan pembayaran normal tetap Rp1.000 sampai Rp10.000. Skenario parsial terutama menguji mekanisme alokasi dan koreksi.

## Skenario 4 — Pembayaran QRIS pending

Kondisi:
- Siswa membuat QRIS Rp3.000.
- Pembayaran belum dilakukan.

Hasil:
- Transaksi pending.
- Kalender tidak berubah.
- Tidak ada alokasi.

## Skenario 5 — Webhook berulang

Kondisi:
- Midtrans mengirim event sukses yang sama dua kali.

Hasil:
- Transaksi hanya diproses sekali.
- Kalender tidak mengalami pembayaran ganda.

## Skenario 6 — Hari Jumat

Kondisi:
- Tanggal yang diperiksa adalah Jumat.

Hasil:
- Tidak ada kewajiban harian.
- Kalender menampilkan libur.

## Skenario 7 — Kenaikan kelas

Kondisi:
- Siswa berada di X RPL.

Hasil:
- Siswa berpindah ke XI RPL pada tahun ajaran berikutnya.
- Riwayat lama tetap tersedia.
- Transaksi lama tidak berubah.

## Skenario 8 — Siswa lulus

Kondisi:
- Siswa berada di XII RPL.

Hasil:
- Status menjadi graduated.
- Riwayat pembayaran tetap tersedia.
- Kewajiban baru tidak dibuat setelah tanggal efektif kelulusan.

## Skenario 9 — Dua pembayaran bersamaan

Kondisi:
- Dua request pembayaran masuk hampir bersamaan untuk siswa yang sama.

Hasil:
- Tidak ada alokasi melebihi kewajiban.
- Tidak ada saldo ganda.
- Setiap transaksi tercatat secara konsisten.

## Skenario 10 — Import data duplikat

Kondisi:
- File Excel berisi data siswa yang berpotensi duplikat (nama lengkap, jurusan, kelas, dan tanggal masuk sama dengan data yang sudah ada).

Hasil:
- Sistem menandai baris sebagai kemungkinan duplikat.
- Baris bermasalah ditampilkan pada preview.
- Siswa lama tidak tertimpa tanpa persetujuan admin.

## Skenario 11 — Login siswa dengan nama duplikat

Kondisi:
- Dua siswa memiliki nama lengkap yang sama.

Hasil:
- Sistem tidak memilih akun secara acak.
- Admin telah menetapkan identitas login pembeda melalui mekanisme aktivasi akun.
- Siswa masuk ke akun yang benar.
