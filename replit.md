# Portfolio Website - System Architecture

## Overview

This is a full-stack portfolio website built with a modern React frontend and Express.js backend. The application showcases personal information, skills, experience, education, activities, articles, and includes an admin panel for content management. It uses PostgreSQL for data persistence with Drizzle ORM for database operations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Simple session-based authentication for admin panel
- **API Design**: RESTful API endpoints for CRUD operations
- **Middleware**: Custom logging and error handling middleware

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Database migrations handled through Drizzle Kit

## Key Components

### Database Schema
The application uses the following main entities:
- **users**: Admin authentication
- **biodata**: Personal information and profile data
- **skills**: Technical skills with proficiency levels
- **experiences**: Work experience and positions
- **education**: Educational background
- **activities**: Personal activities and achievements
- **articles**: Blog posts and articles
- **contactMessages**: Contact form submissions
- **socialLinks**: Social media links
- **services**: Professional services offered

### API Endpoints
- **Authentication**: `/api/auth/*` - Login, logout, status check
- **Content Management**: CRUD endpoints for all content types
- **Public Access**: Read-only access to portfolio data
- **Admin Protected**: Write operations require authentication

### Frontend Pages
- **Home**: Main portfolio showcase with hero section, skills, experience
- **Articles**: Blog/article listing page
- **Contact**: Contact form and social links
- **Admin Login**: Authentication page for admin access
- **Admin Panel**: Content management interface

## Data Flow

1. **Public Users**: Browse portfolio content through read-only API endpoints
2. **Admin Users**: Authenticate via login page, then access admin panel for content management
3. **Content Updates**: Admin creates/updates content through forms, data persisted to PostgreSQL
4. **Real-time Updates**: React Query handles cache invalidation and UI updates

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm and drizzle-zod for database operations
- **UI Components**: @radix-ui components with shadcn/ui styling
- **Validation**: Zod for schema validation
- **Forms**: React Hook Form with @hookform/resolvers

### Development Tools
- **Build**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with PostCSS
- **Development**: tsx for TypeScript execution

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: `npm run dev` - concurrent frontend and backend development
- **Production**: `npm run build` followed by `npm run start`
- **Database**: Requires `DATABASE_URL` environment variable

### Hosting
- **Platform**: Configured for Replit deployment with autoscale
- **Port Configuration**: Backend serves on port 5000, exposed as port 80
- **Static Assets**: Frontend assets served from Express in production

## Changelog

```
Changelog:
- June 26, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```