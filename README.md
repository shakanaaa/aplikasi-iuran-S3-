# S3 — Sistem Simpanan Siswa

Aplikasi pencatatan iuran harian siswa sebesar Rp1.000 per hari sekolah dengan pembayaran tunai dan QRIS.

## Stack

- Backend: Laravel 13, PHP 8.5
- Frontend: React 18, TypeScript, Inertia.js, Tailwind CSS
- Database: MySQL/MariaDB
- Excel: Laravel Excel
- Payment: Midtrans QRIS
- PWA: Vite PWA

## Kebutuhan

- PHP 8.3+
- Composer
- Node.js dan npm
- MySQL/MariaDB

## Setup Lokal

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run build
```

Sesuaikan konfigurasi database pada `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=s3_iuran
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan aplikasi:

```bash
php artisan serve
```

atau:

```bash
composer run dev
```

Frontend development:

```bash
npm run dev
```

## Testing

```bash
php artisan test
vendor/bin/pint --test
npx tsc --noEmit
npm run build
```

## Catatan

- Konfigurasi Midtrans disimpan di `.env` dan tidak boleh di-commit.
- Database lokal yang digunakan: `s3_iuran`.
- Aturan bisnis detail ada pada `AGENTS.md`.
