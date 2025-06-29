# Railway Deployment Guide

Panduan lengkap untuk deployment Portfolio Tracker di Railway.

## Prerequisites

1. Akun GitHub
2. Akun Railway (https://railway.app)
3. Database PostgreSQL (bisa menggunakan Railway PostgreSQL atau external)

## Langkah-langkah Deployment

### 1. Persiapan Repository

Pastikan semua file sudah di-commit dan push ke GitHub:

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Setup Railway Project

1. Buka [Railway Dashboard](https://railway.app/dashboard)
2. Klik "New Project"
3. Pilih "Deploy from GitHub repo"
4. Pilih repository Portfolio Tracker
5. Railway akan otomatis mendeteksi sebagai Node.js project

### 3. Setup Database

#### Option A: Railway PostgreSQL (Recommended)

1. Di Railway project, klik "New"
2. Pilih "Database" → "PostgreSQL"
3. Railway akan otomatis membuat database dan environment variables
4. Copy `DATABASE_URL` yang diberikan Railway

#### Option B: External PostgreSQL

1. Gunakan database PostgreSQL eksternal (Neon, Supabase, dll)
2. Copy connection string database

### 4. Configure Environment Variables

Di Railway project, buka tab "Variables" dan tambahkan:

```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

**Catatan**: Jika menggunakan Railway PostgreSQL, `DATABASE_URL` sudah otomatis tersedia.

### 5. Deploy

1. Railway akan otomatis deploy setiap kali ada push ke repository
2. Atau klik "Deploy" manual di dashboard
3. Tunggu proses build dan deploy selesai

### 6. Setup Database Schema

Setelah deploy berhasil:

1. Buka Railway project
2. Klik tab "Deployments"
3. Klik deployment terbaru
4. Buka "Logs" untuk melihat output
5. Pastikan tidak ada error

### 7. Run Database Migration

Jika perlu, jalankan migration manual:

1. Buka Railway project
2. Klik tab "Deployments"
3. Klik deployment terbaru
4. Buka "Logs"
5. Pastikan database schema sudah ter-setup

## Troubleshooting

### Common Issues

#### 1. Build Error
- Pastikan semua dependencies terinstall
- Cek log build di Railway dashboard
- Pastikan Node.js version compatible

#### 2. Database Connection Error
- Pastikan `DATABASE_URL` benar
- Cek apakah database bisa diakses dari Railway
- Pastikan database sudah running

#### 3. Port Error
- Railway akan otomatis set `PORT` environment variable
- Pastikan aplikasi menggunakan `process.env.PORT`

#### 4. File Upload Error
- Pastikan folder `uploads` ada
- Cek permission folder
- Pastikan path upload benar

### Debug Commands

Untuk debug di Railway:

1. Buka project di Railway
2. Klik tab "Deployments"
3. Klik deployment terbaru
4. Buka "Logs" untuk melihat error

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NODE_ENV` | Environment mode | No | development |
| `PORT` | Server port | No | 5000 (Railway sets this) |

## Post-Deployment

### 1. Test Application

1. Buka URL yang diberikan Railway
2. Test semua fitur utama:
   - Home page
   - Admin login
   - CRUD operations
   - File upload

### 2. Setup Custom Domain (Optional)

1. Di Railway project, klik "Settings"
2. Scroll ke "Domains"
3. Tambahkan custom domain
4. Setup DNS records sesuai instruksi

### 3. Monitor Application

1. Gunakan Railway dashboard untuk monitor:
   - Resource usage
   - Logs
   - Deployments
   - Performance

## Security Considerations

1. **Environment Variables**: Jangan commit `.env` file
2. **Database**: Gunakan strong password untuk database
3. **Admin Access**: Setup admin credentials yang aman
4. **File Upload**: Implement file validation dan size limits
5. **HTTPS**: Railway otomatis menyediakan HTTPS

## Cost Optimization

1. **Free Tier**: Railway menyediakan free tier dengan limit
2. **Resource Usage**: Monitor CPU dan memory usage
3. **Database**: Pilih plan database sesuai kebutuhan
4. **Auto-sleep**: Free tier akan sleep setelah idle

## Support

Jika mengalami masalah:

1. Cek Railway documentation: https://docs.railway.app
2. Cek logs di Railway dashboard
3. Cek GitHub issues untuk project ini
4. Hubungi Railway support jika diperlukan 