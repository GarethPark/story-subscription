# SaaS Starter Template

A modern, production-ready SaaS starter template built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## Features

- Authentication System - Complete signup/login/logout with JWT sessions
- Landing Page Components - Hero, Features, Pricing, Navbar, Footer
- User Dashboard - Protected dashboard with user info
- Database - SQLite with Prisma ORM (easily switch to PostgreSQL)
- TypeScript - Full type safety
- Tailwind CSS - Modern, responsive styling
- Reusable Components - UI components ready to customize

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT with HTTP-only cookies
- **UI Components**: Custom components

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update JWT_SECRET with a secure random string:

```bash
# Generate a secure secret
openssl rand -base64 32
```

### 3. Set Up Database

Run the Prisma migration to create your database:

```bash
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
├── app/                   # Next.js 14 App Router
│   ├── api/auth/         # Authentication endpoints
│   ├── dashboard/        # Protected dashboard
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   └── page.tsx         # Landing page
├── components/           # React components
│   ├── auth/            # Authentication forms
│   ├── landing/         # Landing sections
│   └── ui/              # UI components
├── lib/                  # Utilities
│   ├── auth/            # Auth logic
│   └── db.ts            # Prisma client
└── prisma/              # Database
    └── schema.prisma    # Models
```

## Customizing for Your Project

### 1. Update Branding

- Edit `app/page.tsx` - Landing page content
- Edit `components/landing/navbar.tsx` - Logo

### 2. Extend Database

Edit `prisma/schema.prisma` then run:

```bash
npx prisma migrate dev --name your_change
```

### 3. Add Pages

Create `app/your-page/page.tsx` for new routes

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Switch to PostgreSQL for production

## Security

- Passwords hashed with bcrypt
- HTTP-only cookies
- JWT with expiration
- **Change JWT_SECRET in production**
- **Use PostgreSQL in production**
- **Enable HTTPS in production**

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server
- `npx prisma studio` - Database GUI

## License

MIT - Free to use for your projects!
