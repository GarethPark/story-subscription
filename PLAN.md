# Story Subscription Project Plan

## Project Overview
A romance story subscription SaaS platform where users can browse, read, and subscribe to access premium romance stories.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (Prisma ORM) - switch to PostgreSQL for production
- **Authentication**: JWT with HTTP-only cookies
- **Payment**: Stripe (planned)

## ✅ Completed

### Phase 1: Foundation & Authentication (Completed)
- [x] Next.js project setup with TypeScript
- [x] Tailwind CSS v4 configuration
- [x] Prisma setup with SQLite
- [x] User model and authentication database schema
- [x] JWT authentication system
  - [x] Signup API (`/api/auth/signup`)
  - [x] Login API (`/api/auth/login`)
  - [x] Logout API (`/api/auth/logout`)
  - [x] Get current user API (`/api/auth/me`)
- [x] Authentication pages
  - [x] Signup page with form
  - [x] Login page with form
  - [x] Protected dashboard page
- [x] Landing page components
  - [x] Navbar with login/signup links
  - [x] Hero section
  - [x] Features section
  - [x] Pricing section (placeholder)
  - [x] Footer
- [x] Reusable UI components
  - [x] Button component
  - [x] Input component
  - [x] Card component
- [x] Git repository initialized
- [x] Pushed to GitHub: https://github.com/GarethPark/story-subscription

### Phase 2: Story Core (Completed)
- [x] **Story Database Schema**
  - [x] Create Story model with all fields (title, content, summary, author, genre, coverImage, tags, readingTime, ageRating, etc.)
  - [x] Create Favorite model for user bookmarks
  - [x] Run Prisma migration
  - [x] Update User model with favorites relation
  - [ ] Seed sample stories (deferred due to Prisma 7 compatibility - can add via Prisma Studio)

- [x] **Story Library Page**
  - [x] Create `/stories` route with server-side rendering
  - [x] Display responsive grid of story cards
  - [x] Filter by genre with sidebar
  - [x] Search functionality (by title, summary, author)
  - [x] Story count display
  - [x] Hover effects and transitions
  - [x] Mobile-responsive design
  - [x] Cover image support with fallback gradients

- [x] **Story Reading Interface**
  - [x] Create `/stories/[id]` dynamic route
  - [x] Beautiful reading UI with proper typography
  - [x] Story metadata display (genre, age rating, reading time, views)
  - [x] Tags display
  - [x] Save to favorites button (UI only - functionality pending)
  - [x] Back to library navigation
  - [x] CTA for subscription at end of story

## 🔄 Current Phase: Monetization & User Features

### Next Immediate Tasks
Choose one of:
1. **Subscription Tiers & Payment Integration** (Stripe)
2. **User Favorites/Bookmarks** (simpler, completes story features)
3. **Admin Panel** (for managing stories)

## ⏳ Planned Features

### Phase 3: Monetization
- [ ] **Subscription Tiers**
  - [ ] Define tiers: Free (first chapter only) vs Premium (full access)
  - [ ] Update User model with subscription status
  - [ ] Paywall logic in story reader

- [ ] **Stripe Integration**
  - [ ] Stripe setup and API keys
  - [ ] Checkout flow for subscription
  - [ ] Webhook handling for subscription events
  - [ ] Subscription management page

### Phase 4: User Experience
- [ ] **User Features**
  - [ ] Favorites/bookmarks system
  - [ ] Reading history
  - [ ] User library (saved stories)
  - [ ] Reading preferences (font size, theme)
  - [ ] User profile page

### Phase 5: Content Management
- [ ] **Admin Panel**
  - [ ] Admin role in User model
  - [ ] Protected admin routes
  - [ ] Story CRUD interface
  - [ ] Upload cover images
  - [ ] Publish/unpublish stories
  - [ ] User management
  - [ ] Analytics dashboard

- [ ] **Optional: Author Portal**
  - [ ] Author role
  - [ ] Submit story form
  - [ ] Author dashboard
  - [ ] Revenue sharing (if applicable)

### Phase 6: Polish & Deployment
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Mobile responsiveness review
- [ ] Switch to PostgreSQL
- [ ] Deploy to Vercel
- [ ] Set up production environment variables
- [ ] SSL/HTTPS configuration

## Development Guidelines

### Code Standards
- Use TypeScript strictly (no `any` types)
- Server components by default, client components only when needed
- Keep components small and focused
- Use Tailwind utility classes, avoid custom CSS

### Database
- Always run `npx prisma migrate dev` after schema changes
- Use `npx prisma studio` to view/edit data during development
- Seed data for testing

### Git Workflow
- Commit after each completed feature
- Clear commit messages describing what was done
- Keep commits focused and atomic

## Notes
- Dev server runs on: http://localhost:3000
- Database: SQLite file at `dev.db` (gitignored)
- Environment variables in `.env` (gitignored, template in `.env.example`)

### Test Account
**Email**: test@test.com
**Password**: test123
**Admin**: Yes
This account is created automatically when you run the seed script.

### Testing
Run tests with: `npm test`
See TESTING.md for full testing guide.

## How to Continue This Project

If resuming in a new session:
1. Navigate to project: `cd ~/romance-story-subscription/romance-story-subscription`
2. Check this PLAN.md to see what's done and what's next
3. Check git log: `git log --oneline` to see recent work
4. Start dev server: `npm run dev`
5. Continue with the next unchecked item in "Planned Features"

---

**Last Updated**: 2025-12-31
**Status**: Active Development - Story core features complete, ready for monetization or user features
