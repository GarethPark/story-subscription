# Romance Story Platform - Business Strategy

**Last Updated:** 2026-01-05
**Status:** Phase 1 - Building Custom Generation Feature

---

## Business Model: Hybrid Subscription + Custom Generation

### Value Proposition
AI-powered romance story platform where users can read curated stories OR create their own personalized romance stories with custom characters, tropes, and scenarios.

**Unique Selling Point:** Only platform offering AI-generated personalized romance stories on-demand.

---

## Pricing Structure

### Free Tier
- Access to curated library (20-30 admin-generated stories)
- Browse and discover stories
- 1 new curated story added weekly
- Community features (favorites, reading history)

### Premium ($9.99/month)
- Everything in Free
- **3 custom story credits/month**
- Create personalized stories with:
  - Custom character names
  - Choose tropes, genre, heat level
  - Specific scenario requests
  - 6,000-8,000 word stories
- Save unlimited favorites
- Early access to new features

### Pro ($19.99/month) - Future
- Everything in Premium
- **10 custom story credits/month**
- Longer stories (up to 12,000 words)
- Series generation (multi-part stories)
- Advanced customization (describe ideal characters, settings)

### Add-on
- Extra story credits: $4.99 each (one-time purchase)

---

## Cost Analysis

### API Costs (per story)
- Claude Sonnet 4: ~$3.00 per 8,000-word story
- DALL-E 3 cover: ~$0.08 per image
- **Total per story: ~$3.08**

### Pricing Strategy
- Premium subscription: $9.99/month includes 3 credits = $3.33 per story
- Covers API costs with small margin
- Add-on credits: $4.99 each = $1.91 profit per story
- Curated library stories: One-time cost, infinite value

### Revenue Projections

**Conservative (100 paid users):**
- 100 users × $9.99/month = $999/month
- 50 add-on purchases × $4.99 = $249/month
- API costs: ~$450/month (150 stories)
- **Net: ~$800/month**

**Moderate (500 paid users):**
- 500 users × $9.99 = $4,995/month
- 200 add-on purchases × $4.99 = $998/month
- API costs: ~$1,800/month
- **Net: ~$4,200/month**

**Optimistic (2,000 paid users):**
- 2,000 users × $9.99 = $19,980/month
- 1,000 add-on purchases × $4.99 = $4,990/month
- API costs: ~$9,000/month
- **Net: ~$16,000/month**

---

## Roadmap

### Phase 1: Custom Generation ✅ **COMPLETE**
**Goal:** Allow users to create personalized stories

**Features Built:**
- [x] Admin story generation working (async)
- [x] User-facing custom story generation form
- [x] Character name customization
- [x] Scenario/plot customization (optional text input)
- [x] Credit system (simple counter, no payment yet)
- [x] "My Stories" page to view custom-generated stories
- [x] Separate custom stories from curated library
- [x] Fixed 404 issue - users can view their own unpublished stories

**Technical Implementation:**
- [x] Created `/generate` page for users
- [x] Added credits field to User model
- [x] Created "My Stories" section in dashboard
- [x] Updated Story model to track `isCustom` and `userId`
- [x] Added credit checking before generation
- [x] Updated UI to show remaining credits
- [x] Async generation with status polling
- [x] Enhanced parsing with fallback handling
- [x] Fixed text visibility issues

**AI Model Used:** Claude Sonnet 4 ($3 per 8,000-word story)

**Future Consideration:** Claude Opus 4 as premium tier option
- Cost: ~$7 per story (2x Sonnet cost)
- Use case: Premium users willing to pay 2 credits for ultra-premium quality
- Implementation: Add "Premium Quality" toggle in generation form

### Phase 2: Polish & Design ✨ **IN PROGRESS**
**Goal:** Create elegant, sophisticated UI targeting female romance readers

**Design Philosophy:** "Luxury Romance Library"
- See DESIGN-SYSTEM.md for complete specifications
- Sophisticated, aspirational, feminine aesthetic
- Premium feel without being exclusive

**Tasks:**
- [ ] Set up design system (Tailwind config, fonts, colors)
- [ ] Build beautiful landing page
  - Hero with romantic imagery
  - Features section
  - How it works
  - Testimonials
  - Pricing preview
- [ ] Redesign navigation/header
  - Elegant desktop header
  - Mobile bottom navigation
  - Profile dropdown
- [ ] Improve core pages
  - Dashboard (personal library feel)
  - Browse stories (Pinterest-style grid)
  - Story detail page (beautiful reading experience)
  - My Stories (elegant gallery)
- [ ] Add animations & micro-interactions
  - Smooth transitions
  - Hover effects
  - Loading states (shimmer, not spinner)
  - Success celebrations
- [ ] Mobile optimization
  - Touch-friendly
  - Thumb-zone navigation
  - Swipe gestures

**Design Assets:**
- Color Palette: Deep Rose, Rich Purple, Warm Gold, Cream
- Typography: Playfair Display (headings) + Inter (body)
- Components: Documented in DESIGN-SYSTEM.md

**Time Estimate:** 2-3 days

### Phase 3: Curated Library Growth (Week 4-5)
**Goal:** Build valuable free content library

**Tasks:**
- Generate 30-50 high-quality curated stories
- Ensure variety: all genres, heat levels, tropes
- Organize library with filters/search
- Featured stories section
- Quality review process
- Batch generation tool for admins

### Phase 4: Payment Integration (Week 5-6)
**Goal:** Start generating revenue

**Features:**
- Stripe integration for subscriptions
- Premium tier with 3 credits/month
- Add-on credit purchases ($4.99 each)
- Subscription management page
- Free trial (7 days)

### Phase 5: Enhanced Customization (Month 2-3)
**Goal:** Advanced personalization features

**Features:**
- Character description input (physical appearance, personality)
- Setting customization (city, time period, specific locations)
- Series generation (continue a story)
- Story remix (regenerate with different tropes)
- Save story templates
- Claude Opus 4 as premium quality option (2 credits)

### Phase 6: Community & Growth (Month 3+)
**Goal:** Viral growth and retention

**Features:**
- Share custom stories (optional, privacy controls)
- Vote on next curated story themes
- Reading challenges/achievements
- Referral program (give 1 free credit)
- Email notifications for new stories
- Mobile-responsive PWA

---

## Competitive Analysis

### Direct Competitors
1. **Kindle Unlimited** ($11.99/month)
   - Huge library, human-written
   - No personalization
   - We're cheaper with custom generation

2. **Radish/Dreame** (Coins/chapter model)
   - Serialized stories
   - No personalization
   - Can get expensive

3. **Wattpad** (Free + Premium $6.99/month)
   - User-generated content
   - Quality varies wildly
   - No personalization

### Our Advantage
- **Only platform with AI personalization**
- Instant gratification (2-min story generation)
- Consistent quality (Claude Sonnet 4)
- Infinite variety
- Competitive pricing

---

## Marketing Strategy (Future)

### Target Audience
- Women 25-45 (primary romance readers)
- Voracious readers (3+ books/week)
- Tech-savvy early adopters
- Active on BookTok, Bookstagram, romance subreddits

### Channels
1. **Social Media:**
   - TikTok: "I made an AI romance story about [specific scenario]"
   - Instagram: Cover images, story teasers
   - Reddit: r/RomanceBooks, r/romancelandia

2. **Content Marketing:**
   - Blog: Romance writing tips, trope explanations
   - SEO: "Best romance stories online", "free romance books"

3. **Partnerships:**
   - Romance book bloggers/reviewers
   - BookTok influencers
   - Romance writing communities

4. **Referral Program:**
   - Give 1 free credit for each referral who signs up

---

## Success Metrics

### Phase 1 Metrics (Custom Generation)
- Users creating custom stories (target: 50% of signups)
- Average credits used per user (target: 2+ per month)
- Story completion rate (users actually reading generated stories)
- Regeneration rate (are users happy first try?)

### Phase 2 Metrics (Growth)
- Monthly Active Users (MAU)
- Conversion rate (free → paid): Target 5-10%
- Churn rate: Target <5% monthly
- Average revenue per user (ARPU): Target $8-10
- Customer acquisition cost (CAC): Target <$20
- Lifetime value (LTV): Target $100+

---

## Technical Stack

**Current:**
- Next.js 15 (App Router)
- PostgreSQL (Vercel Postgres)
- Prisma ORM
- Claude Sonnet 4 API (story generation)
- DALL-E 3 API (cover images)
- Vercel (hosting - free tier)

**Future Additions:**
- Stripe (payments)
- SendGrid/Resend (email)
- Vercel Analytics (usage tracking)
- Sentry (error monitoring)

---

## Risk Mitigation

### API Cost Overruns
- **Risk:** Users abuse system, generate too many stories
- **Mitigation:** Credit limits, rate limiting, fraud detection

### Content Quality Issues
- **Risk:** AI generates inappropriate/low-quality content
- **Mitigation:** Heat level controls, content moderation, user reporting

### AI Model Changes
- **Risk:** Anthropic changes pricing/access
- **Mitigation:** Multi-model strategy (fallback to GPT-4), cost monitoring alerts

### Payment Fraud
- **Risk:** Credit card fraud, chargebacks
- **Mitigation:** Stripe Radar, email verification, usage patterns

---

## Open Questions

1. Should we allow users to share/publish their custom stories publicly?
   - Pro: Viral growth, community
   - Con: Moderation burden, quality concerns

2. Should we offer refunds if user doesn't like generated story?
   - Pro: Customer satisfaction
   - Con: Could be abused

3. Should we add "regenerate" option (same config, new story)?
   - Pro: User satisfaction
   - Con: Higher API costs

4. What's the minimum curated library size before launch?
   - Target: 30 stories minimum across all genres

---

## Next Session Checklist

When continuing work, check:
- [ ] Current phase from roadmap
- [ ] Recent commits (what was just built)
- [ ] Open PRs or WIP features
- [ ] Any production issues
- [ ] User feedback or bugs

---

## Decision Log

**2026-01-05:**
- ✅ Chose Hybrid Model over pure subscription or pure custom
- ✅ Decided to start with custom generation (Phase 1)
- ✅ Set pricing: $9.99 Premium (3 credits), $4.99 add-on credits
- ✅ Fixed character name repetition issue (updated prompt)
- ✅ Implemented async generation to avoid Vercel timeout

---

*This is a living document. Update after major decisions or pivots.*
