# Quick Start Guide - Tomorrow's Session

**Date**: January 7, 2026
**Goal**: Implement Story Extensions + Generate Curated Library

---

## 🎯 What We Decided Tonight

### AI Strategy (APPROVED)
- **Free Library**: Claude Opus 4.5 (~$1/story) - Best quality to hook users
- **Custom Stories**: Claude Sonnet 4 (~$0.20/story) - Great quality, healthy margins
- **Budget**: $75-100 approved for initial 50 curated stories

### New Feature: Story Extensions
- Users can extend ANY story (curated or custom) for 0.5 credits
- 3,000-4,000 words per extension
- Huge engagement driver + 96% profit margin
- See PRODUCT-STRATEGY.md for full spec

---

## 📋 Tomorrow's Tasks (In Priority Order)

### Task 1: Quality Testing (1-2 hours)
**Test Opus vs Sonnet to validate quality difference**

```bash
# Create test script
cd ~/romance-story-subscription/romance-story-subscription

# Generate 5 stories with each model
# Compare quality, decide if Opus worth the cost for curated library
```

**What to test:**
- Same prompts on both models
- Blind comparison
- Check: emotional depth, prose quality, character development

### Task 2: Database Schema Update (30 mins)
**Add StoryExtension model**

```bash
# Edit prisma/schema.prisma
# Add:

model StoryExtension {
  id            String   @id @default(cuid())
  storyId       String
  story         Story    @relation(fields: [storyId], references: [id], onDelete: Cascade)
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  content       String   @db.Text
  wordCount     Int
  userPrompt    String?  @db.Text
  order         Int
  modelUsed     String
  createdAt     DateTime @default(now())

  @@index([storyId, order])
  @@index([userId])
}

# Add to Story model:
model Story {
  # ... existing fields
  extensions StoryExtension[]
}

# Add to User model:
model User {
  # ... existing fields
  storyExtensions StoryExtension[]
}

# Run migration
npx prisma migrate dev --name add_story_extensions
npx prisma generate
git add -A
git commit -m "Add StoryExtension model to schema"
git push
```

### Task 3: Story Prompts (1 hour)
**Draft 25 detailed prompts for curated library**

Create file: `curated-story-prompts.md`

Example template:
```
STORY 1:
Genre: Contemporary Romance
Subgenre: Second Chance Romance
Heat Level: Steamy
Setting: Small coastal town in Maine
Characters:
  - Ella (28, marine biologist, guarded)
  - Marcus (30, architect, charming)
Central Conflict: They were engaged 5 years ago, she left him
Plot Hook: She returns for her father's funeral, he's still there
Key Scenes:
  - Tense reunion at harbor
  - Forced to work together on pier restoration
  - Confession under northern lights
Ending: HEA with proposal at the lighthouse
```

**Diversity requirements:**
- 5 Contemporary
- 5 Historical
- 5 Paranormal/Fantasy
- 5 Romantic Suspense
- 5 Small Town/Holiday

- Mix of heat levels (Sweet, Sensual, Steamy)
- Variety of tropes (enemies to lovers, second chance, forced proximity, etc.)

### Task 4: Extension API (2-3 hours)
**Build story extension endpoints**

Files to create:
1. `app/api/stories/[id]/extend/route.ts` - POST to create extension
2. `app/api/stories/[id]/extensions/[extensionId]/status/route.ts` - GET status

```typescript
// POST /api/stories/[id]/extend
// Check user has 0.5 credits
// Deduct credits
// Load story + existing extensions
// Create extension record with PENDING status
// Trigger background generation
// Return extension ID

// GET /api/stories/[id]/extensions/[extensionId]/status
// Return generation status (PENDING/GENERATING/COMPLETED/FAILED)
```

### Task 5: Extension UI (1-2 hours)
**Add "Continue Story" button to story reader**

Components to create:
- `components/story/extend-story-button.tsx`
- `components/story/story-extensions-list.tsx`

Update:
- `app/stories/[id]/page.tsx` - Add extension button and list

---

## 🔑 Key Files Reference

### Current System
- **Story Generation**: `lib/ai/generate-story.ts`
- **Admin Generation**: `app/api/admin/generate-story/[id]/execute/route.ts`
- **User Generation**: `app/api/generate-story/[id]/execute/route.ts`

### AI Models
```typescript
// Claude Opus 4.5 (for curated)
const OPUS_MODEL = 'claude-opus-4-5-20251101'

// Claude Sonnet 4 (for custom - current)
const SONNET_MODEL = 'claude-sonnet-4-5-20250929'
```

### Current Pricing
- Premium: $9.99/month = 3 credits
- Add-on: $4.99 = 1 credit
- Extension: 0.5 credits (NEW)

---

## 📊 Success Metrics

After implementing extensions, track:
- Extension adoption rate (target: >30% of users)
- Average extensions per user (target: >2)
- Credit purchase increase (target: +20%)
- Extension completion rate (users finishing extended stories)

---

## 🚨 Important Notes

### Environment Variables
```bash
ANTHROPIC_API_KEY - Already set (works for Opus and Sonnet)
OPENAI_API_KEY - For cover images (optional)
DATABASE_URL - Neon Postgres
```

### Test Account
- Email: test@test.com
- Password: test123
- Credits: 10 (set for testing)

### Deployment
```bash
# Build and test locally
npm run build

# Commit and push triggers auto-deploy
git add -A
git commit -m "Message"
git push

# Monitor deployment
vercel logs --follow
```

---

## 💡 Quick Commands

```bash
# Navigate to project
cd ~/romance-story-subscription/romance-story-subscription

# Check status
git status
git log --oneline -5

# Database GUI
npx prisma studio

# Development server
npm run dev

# Build (check for errors)
npm run build

# Deploy
git push
# Auto-deploys to: https://romance-story-subscription.vercel.app
```

---

## 📖 Documentation Files

1. **PRODUCT-STRATEGY.md** - Complete AI strategy, extensions spec, roadmap
2. **BUSINESS-STRATEGY.md** - Original business model, pricing tiers
3. **SESSION-STATUS.md** - Full session history and current status
4. **QUICK-START.md** - This file (quick reference)

---

## 🎯 Week 1 Goal

**By End of Week:**
1. ✅ Quality testing complete (Opus vs Sonnet validated)
2. ✅ 50 curated Opus stories generated and published
3. ✅ Story extension feature fully implemented
4. ✅ Extensions deployed to production
5. ✅ Monitoring metrics for user adoption

**Budget**: $75-100 for curated library generation

---

## 🤔 Decision Points

### If Opus quality NOT significantly better:
- Fallback: Use Sonnet for all stories
- Invest $100 saved into marketing instead

### If Extensions don't get adopted:
- Offer first extension free to drive trial
- Add "Extend for Free" promotion banner

### If Extension quality inconsistent:
- Limit to 3 extensions per story max
- Add quality check before showing to user

---

## ✅ Pre-Flight Checklist

Before starting work tomorrow:
- [ ] Read PRODUCT-STRATEGY.md (full context)
- [ ] Review this QUICK-START.md (actionable tasks)
- [ ] Check SESSION-STATUS.md (where we left off)
- [ ] Pull latest code: `git pull`
- [ ] Verify local build: `npm run build`
- [ ] Open Prisma Studio: `npx prisma studio`
- [ ] Have Anthropic console open for API monitoring

---

**Ready to build!** 🚀

See PRODUCT-STRATEGY.md for comprehensive strategy details.
See SESSION-STATUS.md for full project history.
