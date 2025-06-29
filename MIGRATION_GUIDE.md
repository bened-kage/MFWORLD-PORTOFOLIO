# Panduan Migrasi SQLite ke PostgreSQL

Panduan ini akan membantu Anda memindahkan data dari database SQLite ke PostgreSQL untuk project PortfolioTracker.

## Prerequisites

1. **PostgreSQL Database**: Pastikan Anda memiliki database PostgreSQL yang sudah siap
2. **Environment Variables**: Set `DATABASE_URL` dengan connection string PostgreSQL
3. **Dependencies**: Install dependensi yang diperlukan

## Langkah-langkah Migrasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Periksa Struktur Database SQLite

Sebelum melakukan migrasi, periksa struktur database SQLite yang ada:

```bash
npm run check:sqlite
```

Script ini akan menampilkan:
- Daftar semua tabel
- Struktur kolom setiap tabel
- Jumlah data di setiap tabel
- Contoh data dari setiap tabel

### 3. Setup Database PostgreSQL

Pastikan database PostgreSQL sudah siap dan dapat diakses. Set environment variable:

```bash
# Windows
set DATABASE_URL=postgresql://username:password@localhost:5432/portfolio

# Linux/Mac
export DATABASE_URL=postgresql://username:password@localhost:5432/portfolio
```

### 4. Generate dan Jalankan Migrasi Schema

```bash
# Generate migration files
npm run db:generate

# Push schema ke database
npm run db:push
```

### 5. Jalankan Migrasi Data

```bash
npm run migrate:sqlite-to-postgres
```

Script ini akan:
- Membaca semua data dari `portfolio.db` (SQLite)
- Memindahkan data ke database PostgreSQL
- Menampilkan progress untuk setiap tabel
- Menangani konflik data dengan `onConflictDoNothing()`

## Struktur Tabel yang Dimigrasi

Script migrasi akan memindahkan data dari tabel-tabel berikut:

1. **users** - Data pengguna admin
2. **biodata** - Informasi profil
3. **skills** - Keahlian dan skill
4. **experiences** - Pengalaman kerja
5. **education** - Pendidikan
6. **activities** - Aktivitas dan kegiatan
7. **articles** - Artikel blog
8. **contact_messages** - Pesan kontak
9. **social_links** - Link sosial media
10. **services** - Layanan yang ditawarkan
11. **projects** - Project portfolio

## Mapping Kolom

Script migrasi menangani perbedaan nama kolom antara SQLite dan PostgreSQL:

| SQLite Column | PostgreSQL Column |
|---------------|-------------------|
| profile_image | profileImage |
| start_date | startDate |
| end_date | endDate |
| contact_messages | contactMessages |
| social_links | socialLinks |

## Handling Data Types

Script migrasi menangani konversi tipe data:

- **Boolean**: SQLite menggunakan integer (0/1), PostgreSQL menggunakan boolean
- **Text**: Langsung dipindahkan
- **Integer**: Langsung dipindahkan
- **Serial/ID**: Auto-increment akan dihandle oleh PostgreSQL

## Troubleshooting

### Error: "Cannot find module 'sqlite3'"
```bash
npm install sqlite3
```

### Error: "Connection refused"
- Pastikan PostgreSQL server berjalan
- Periksa connection string di `DATABASE_URL`
- Pastikan database `portfolio` sudah dibuat

### Error: "Table already exists"
- Script menggunakan `onConflictDoNothing()` untuk menghindari duplikasi
- Jika ingin fresh migration, drop semua tabel di PostgreSQL terlebih dahulu

### Error: "Permission denied"
- Pastikan user PostgreSQL memiliki permission untuk create/insert
- Periksa role dan privileges database

## Verifikasi Migrasi

Setelah migrasi selesai, Anda dapat memverifikasi data:

1. **Cek jumlah data**: Bandingkan jumlah baris di SQLite vs PostgreSQL
2. **Cek sample data**: Ambil beberapa sample data untuk memastikan integritas
3. **Test aplikasi**: Jalankan aplikasi dan pastikan semua fitur berfungsi

## Backup

Sebelum melakukan migrasi, selalu backup data:

```bash
# Backup SQLite
cp portfolio.db portfolio.db.backup

# Backup PostgreSQL (jika ada data existing)
pg_dump portfolio > portfolio_backup.sql
```

## Rollback

Jika migrasi gagal atau ada masalah:

1. **Restore SQLite**: `cp portfolio.db.backup portfolio.db`
2. **Drop PostgreSQL tables**: Jalankan `DROP TABLE` untuk semua tabel
3. **Re-run migration**: Jalankan ulang script migrasi

## Support

Jika mengalami masalah, periksa:
1. Log error di console
2. Struktur database dengan `npm run check:sqlite`
3. Connection string PostgreSQL
4. Permission database

---

**Note**: Pastikan untuk test migrasi di environment development terlebih dahulu sebelum menjalankan di production. 