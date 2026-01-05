# Claude.ai Project Guide - Romance Story Subscription

**Last Updated**: January 5, 2026
**Project Status**: ✅ Deployed to Production

---

## 🌐 Production Info

**Live URL**: https://romance-story-subscription.vercel.app
**GitHub**: https://github.com/GarethPark/story-subscription
**Database**: Neon PostgreSQL (aws-us-east-2)

### Admin Login
- **Email**: test@test.com
- **Password**: test123

### Quick Links
- Admin Panel: https://romance-story-subscription.vercel.app/admin
- Generate Stories: https://romance-story-subscription.vercel.app/admin/generate
- Story Library: https://romance-story-subscription.vercel.app/stories

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Styling**: Tailwind CSS v4
- **Auth**: JWT with HTTP-only cookies
- **AI**: Claude 3 Haiku API (Anthropic)
- **Hosting**: Vercel
- **Git**: GitHub

---

## ✅ What's Been Completed

### Core Features Working
1. ✅ User authentication (signup, login, logout)
2. ✅ Story library with search and filters
3. ✅ Story reading interface
4. ✅ Favorites/bookmarks system
5. ✅ Admin role system
6. ✅ AI story generation (Claude API)
7. ✅ Story review/approval workflow
8. ✅ Publish/unpublish controls
9. ✅ Production deployment
10. ✅ Database migration to PostgreSQL

### Test Suite
- 10 comprehensive tests (all passing)
- Automated Prisma client generation
- Schema validation tests

---

## ⚠️ Known Issues

### 🚨 CRITICAL: Claude API Access Limited

**Problem**: API key only has access to Claude 3 Haiku (not Sonnet)
- **Impact**: Stories limited to ~2,000 words instead of 4,000-8,000
- **Status**: WAITING FOR ANTHROPIC SUPPORT RESPONSE
- **Workaround**: Currently using Haiku (works fine, just shorter)

**API Key Details**:
- Key: `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`
- Org ID: `81f641e7-3ebd-4c08-bf88-533a1571fe51`
- Error: All models now return 401 Unauthorized
- Action: Email sent to support@anthropic.com (see email template in SESSION-STATUS.md)

---

## 🗂️ Project Structure

```
romance-story-subscription/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── admin/           # Admin endpoints (story generation)
│   │   └── favorites/       # Favorites management
│   ├── admin/               # Admin pages
│   │   ├── page.tsx         # Admin dashboard
│   │   ├── generate/        # Story generation UI
│   │   └── review/[id]/     # Story review page
│   ├── stories/             # Story library
│   ├── library/             # User favorites
│   └── dashboard/           # User dashboard
├── components/              # React components
│   ├── admin/              # Admin components
│   ├── story/              # Story components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility functions
│   ├── auth/              # Auth helpers
│   └── db.ts              # Prisma client
├── prisma/                # Database
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── tests/                 # Test suite
```

---

## 🔑 Environment Variables (Vercel)

All configured in production:

```bash
DATABASE_URL="postgresql://neondb_owner:npg_J6LEnoXcwr1g@..."
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
ANTHROPIC_API_KEY="sk-ant-api03-..."
NEXT_PUBLIC_APP_URL="https://romance-story-subscription.vercel.app"
```

---

## 🎯 Next Steps (Priority Order)

### If Anthropic Enables Sonnet Access:
1. Update `app/api/admin/generate-story/route.ts` line 159:
   - Change model to: `claude-3-5-sonnet-20241022`
   - Change max_tokens to: `8192`
2. Test generation with 4,000-8,000 word config
3. Generate 20-30 diverse stories
4. Build content catalog

### While Waiting for Sonnet:
- **Option A**: Generate 2,000-word stories with Haiku
- **Option B**: Build Stripe payment integration
- **Option C**: Add reading history & user profiles
- **Option D**: Polish UI/UX

### Future Features (PLAN.md):
- Stripe subscription payments
- Reading history tracking
- User profiles and preferences
- More admin analytics
- SEO optimization

---

## 🔧 Common Development Tasks

### Run Locally
```bash
cd ~/romance-story-subscription/romance-story-subscription
npm run dev
# Visit http://localhost:3000
```

### Generate New Story (via Admin Panel)
1. Login: test@test.com / test123
2. Go to: /admin/generate
3. Select: Genre, Heat Level, Tropes, Word Count
4. Click: Generate Story
5. Review: /admin/review/[id]
6. Publish: Click "Publish Story"

### Deploy to Production
```bash
vercel --prod
# Automatically deploys from main branch
```

### Database Commands
```bash
npx prisma studio           # View/edit database
npx prisma migrate dev      # Create new migration
npx prisma db push          # Push schema changes (no migration)
npx prisma generate         # Regenerate Prisma Client
```

### Run Tests
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
```

---

## 📱 Working from iPhone

### Option 1: Admin Panel (No Coding)
- Visit: https://romance-story-subscription.vercel.app/admin/generate
- Generate stories directly from web interface
- Review and publish stories
- No code changes needed

### Option 2: Claude.ai Projects (Recommended)
1. Go to: https://claude.ai
2. Create new Project
3. Upload this file (CLAUDE-AI-PROJECT-GUIDE.md)
4. Tell me what you want to change
5. I'll provide code snippets
6. Use GitHub web interface to commit changes

### Option 3: GitHub Codespaces
1. Go to: https://github.com/GarethPark/story-subscription
2. Click: Code → Codespaces → Create
3. Full VS Code in browser
4. Make changes and deploy

---

## 🐛 Troubleshooting

### Story Generation Fails
- Check: API key is valid (currently has issues)
- Check: Vercel environment variables are set
- Check: Database connection is working

### Build Fails on Vercel
- Ensure: `prisma generate` runs in build script (already configured)
- Check: All environment variables are set
- Check: Dependencies are installed

### Database Connection Issues
- Verify: DATABASE_URL is correct in Vercel
- Check: Neon database is running
- Run: `npx prisma db push` to sync schema

### Authentication Issues
- Clear browser cookies
- Check: JWT_SECRET is set in production
- Verify: User exists in database

---

## 📞 Support Contacts

**Anthropic API**:
- Email: support@anthropic.com
- Console: https://console.anthropic.com/
- Issue: API key returning 401 errors

**Vercel**:
- Console: https://vercel.com/gareth-parks-projects/romance-story-subscription
- Docs: https://vercel.com/docs

**Neon Database**:
- Console: https://console.neon.tech/
- Project: weathered-forest-80888173

---

## 💾 Backup Information

### Database Backup
```bash
# Export data from Neon
pg_dump $DATABASE_URL > backup.sql

# Import to new database
psql $NEW_DATABASE_URL < backup.sql
```

### Code Backup
- GitHub: https://github.com/GarethPark/story-subscription
- Last commit: January 5, 2026
- All changes pushed and synced

---

## 🎉 Success Metrics

**Current Stats**:
- 5 seed stories published
- 1 admin user configured
- 0 real users (not launched yet)
- ~2,000 word stories (Haiku limit)

**Launch Targets**:
- 30-50 published stories
- Stripe payments live
- SEO optimized
- Social media presence

---

## 📝 Quick Reference Commands

```bash
# Navigate to project
cd ~/romance-story-subscription/romance-story-subscription

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Database management
npx prisma studio

# Check API key status
npx tsx scripts/test-all-models.ts

# Generate seed data
npx tsx prisma/seed.ts
```

---

**Everything is ready to continue development from any device!** 🚀

The project is fully deployed, database is migrated, and all code is on GitHub.
