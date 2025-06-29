# Panduan Setup PostgreSQL dan Migrasi Database

## Masalah yang Ditemui
Error `password authentication failed for user "HP TM"` terjadi karena:
1. PostgreSQL tidak dikonfigurasi dengan benar
2. Username sistem Windows dengan spasi tidak kompatibel
3. Tidak ada file `.env` dengan konfigurasi database

## Solusi

### 1. Install PostgreSQL (jika belum)
```bash
# Windows - Download dari https://www.postgresql.org/download/windows/
# Atau gunakan Chocolatey:
choco install postgresql

# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

### 2. Setup PostgreSQL
```bash
# Start PostgreSQL service
# Windows: PostgreSQL akan otomatis start sebagai service
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Masuk ke PostgreSQL sebagai superuser
psql -U postgres

# Buat database
CREATE DATABASE portfolio;

# Buat user (opsional, bisa menggunakan postgres)
CREATE USER myuser WITH PASSWORD 'mypassword';

# Berikan hak akses
GRANT ALL PRIVILEGES ON DATABASE portfolio TO myuser;

# Keluar dari psql
\q
```

### 3. Buat File .env
Buat file `.env` di root project dengan konfigurasi:

```env
# Untuk user postgres default
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio

# Atau untuk user custom
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/portfolio
```

**Catatan:** Ganti `password` dengan password PostgreSQL yang Anda set saat instalasi.

### 4. Jalankan Migrasi
```bash
# Generate migration schema
npm run db:generate

# Jalankan migration
npm run db:migrate

# Migrasi data dari SQLite ke PostgreSQL
npm run migrate:sqlite-to-postgres
```

### 5. Troubleshooting

#### Error: "password authentication failed"
- Pastikan password di `.env` benar
- Cek apakah PostgreSQL service berjalan
- Coba koneksi manual: `psql -U postgres -d portfolio`

#### Error: "database does not exist"
- Buat database terlebih dahulu: `createdb portfolio`

#### Error: "role does not exist"
- Buat user terlebih dahulu atau gunakan user `postgres`

### 6. Verifikasi Setup
```bash
# Test koneksi
psql -U postgres -d portfolio -c "SELECT version();"

# Cek tabel yang sudah dimigrasi
psql -U postgres -d portfolio -c "\dt"
```

## Alternatif: Tetap Gunakan SQLite
Jika tidak ingin setup PostgreSQL, Anda bisa tetap menggunakan SQLite dengan mengubah konfigurasi:

1. Ubah `drizzle.config.ts`:
```typescript
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "./portfolio.db",
  },
});
```

2. Ubah `server/storage.ts` untuk menggunakan SQLite
3. Update dependencies jika diperlukan

## Catatan Penting
- File `.env` tidak boleh di-commit ke git (sudah ada di `.gitignore`)
- Pastikan PostgreSQL service selalu running
- Backup data SQLite sebelum migrasi
- Test aplikasi setelah migrasi untuk memastikan semua berfungsi 