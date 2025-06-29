import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL tidak ditemukan!');
  console.log('📝 Silakan buat file .env dengan konfigurasi berikut:');
  console.log('DATABASE_URL=postgresql://username:password@localhost:5432/portfolio');
  process.exit(1);
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});