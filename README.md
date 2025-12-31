# Story Subscription Platform

A modern romance story subscription platform built with Next.js 16, TypeScript, Tailwind CSS, and Prisma. Users can browse, read, and subscribe to access premium romance stories.

## Features

### Core Features
- **Authentication System** - Complete signup/login/logout with JWT sessions
- **Story Library** - Browse and search romance stories with filters
- **Story Reader** - Beautiful reading interface with metadata and tags
- **Genre Filtering** - Filter stories by Contemporary, Historical, Paranormal, etc.
- **Search** - Search stories by title, author, or summary
- **User Dashboard** - Protected dashboard with user information
- **Responsive Design** - Mobile-first, works on all devices

### Landing Page
- Hero section with CTA
- Features showcase
- Pricing tiers (placeholder)
- Professional navbar and footer

### Database
- Story model with title, content, author, genre, tags, cover images
- User favorites/bookmarks support (database ready)
- SQLite for development (easily switch to PostgreSQL for production)

## Architecture & Libraries

### Framework & Core
- **Next.js 16.1.1** - React framework with App Router for server-side rendering and routing
  - App Router for file-based routing
  - Server Components by default for optimal performance
  - Server Actions for form handling
  - Image optimization with next/image
- **React 19.2.3** - UI library with latest features
- **TypeScript 5** - Type safety across the entire codebase

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
  - Custom configuration with design tokens
  - Mobile-first responsive design
  - Dark mode support ready
- **class-variance-authority** - Type-safe component variants
- **clsx & tailwind-merge** - Conditional className utilities

### Database & ORM
- **Prisma 5.22.0** - Type-safe database ORM
  - Declarative schema modeling
  - Auto-generated TypeScript types
  - Migration system for schema changes
  - Prisma Studio for database GUI
- **SQLite** - Development database (file:./dev.db)
  - Zero configuration
  - Easy to switch to PostgreSQL for production

### Authentication & Security
- **JWT (jsonwebtoken)** - Stateless authentication tokens
- **bcryptjs** - Password hashing with salt rounds
- **HTTP-only cookies** - Secure token storage
- **Next.js middleware** - Route protection

### UI Components
- **Custom component library** - Reusable React components
  - Button, Input, Card components
  - Consistent design system
  - Type-safe props with TypeScript
- **Lucide React** - Modern icon library
  - Tree-shakeable icons
  - Consistent styling

### Development Tools
- **ESLint** - Code linting with Next.js config
- **tsx** - TypeScript execution for scripts
- **Git** - Version control

## Project Architecture

```
story-subscription/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   └── auth/               # Authentication endpoints
│   │       ├── login/          # POST /api/auth/login
│   │       ├── logout/         # POST /api/auth/logout
│   │       ├── signup/         # POST /api/auth/signup
│   │       └── me/            # GET /api/auth/me
│   ├── stories/                # Story pages
│   │   ├── [id]/              # Dynamic story reader
│   │   └── page.tsx           # Story library
│   ├── dashboard/              # Protected dashboard
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
│
├── components/                  # React Components
│   ├── auth/                   # Authentication forms
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── landing/                # Landing page sections
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── pricing.tsx
│   │   └── footer.tsx
│   └── ui/                     # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       └── card.tsx
│
├── lib/                         # Utility functions
│   ├── auth/                   # Authentication logic
│   │   ├── password.ts        # bcrypt utilities
│   │   └── session.ts         # JWT utilities
│   ├── db.ts                   # Prisma client singleton
│   └── utils.ts                # Helper functions
│
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
│
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── PLAN.md                     # Project roadmap
```

### Data Flow

1. **Client Request** → Next.js App Router
2. **Server Component** → Fetches data from Prisma
3. **Prisma ORM** → Queries SQLite database
4. **Response** → Rendered HTML sent to client
5. **Hydration** → Interactive React components

### Authentication Flow

1. User submits credentials → Login form
2. Server validates → bcrypt password check
3. JWT created → Signed token
4. Cookie set → HTTP-only, secure
5. Subsequent requests → JWT verified via middleware
6. Protected routes → Redirect if unauthorized

### Database Schema

**User Model**
- Authentication and profile data
- Relations to favorites

**Story Model**
- Title, content, summary, author
- Genre, tags, reading time, age rating
- Cover image URL
- Published status and featured flag
- View count tracking

**Favorite Model**
- User-story relationship
- Bookmark functionality

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
