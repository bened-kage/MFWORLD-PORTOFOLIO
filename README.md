# Portfolio Tracker

A modern portfolio management application built with React, TypeScript, Express.js, and PostgreSQL.

## Features

- 📝 Portfolio management with biodata, skills, experiences, and education
- 📰 Article management system
- 💬 Contact message handling
- 🖼️ Image upload functionality
- 🔐 Admin authentication
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based
- **File Upload**: Multer

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd PortfolioTracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit `.env` file with your database configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio
PORT=5000
NODE_ENV=development
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file
3. Run database migrations:
```bash
npm run db:push
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Run migrations

## Deployment

### Railway Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Add environment variables in Railway dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NODE_ENV` - Set to `production`
4. Railway will automatically detect the Node.js app and deploy it

### Environment Variables for Production

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to `production`
- `PORT` - Railway will set this automatically

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/status` - Check authentication status

### Portfolio Data
- `GET /api/biodata` - Get biodata
- `PUT /api/biodata` - Update biodata (admin only)
- `GET /api/skills` - Get skills
- `POST /api/skills` - Create skill (admin only)
- `PUT /api/skills/:id` - Update skill (admin only)
- `DELETE /api/skills/:id` - Delete skill (admin only)

### Experiences & Education
- `GET /api/experiences` - Get experiences
- `POST /api/experiences` - Create experience (admin only)
- `PUT /api/experiences/:id` - Update experience (admin only)
- `DELETE /api/experiences/:id` - Delete experience (admin only)

### Articles
- `GET /api/articles` - Get articles
- `POST /api/articles` - Create article (admin only)
- `PUT /api/articles/:id` - Update article (admin only)
- `DELETE /api/articles/:id` - Delete article (admin only)

### Contact
- `GET /api/contact` - Get contact messages (admin only)
- `POST /api/contact` - Send contact message

## File Structure

```
PortfolioTracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── ...
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema
├── uploads/              # Uploaded files
└── migrations/           # Database migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License 