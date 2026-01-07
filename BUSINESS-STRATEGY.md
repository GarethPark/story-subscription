# Silk - Business Strategy & Launch Plan

**Product:** AI-powered personalized romance story platform
**Brand:** Silk
**Domain:** readsilk.com (to be purchased)
**Current URL:** romance-story-subscription.vercel.app
**Last Updated:** 2026-01-07

---

## Executive Summary

Silk is a high-margin SaaS platform (90%+ profit margins) that allows romance readers to generate personalized AI stories with custom characters, tropes, and scenarios. Revenue comes from subscriptions ($9.99/month) and credit purchases ($4.99/credit).

**Key Insight:** Romance readers spend billions on romance content. We offer instant gratification + infinite personalization at competitive pricing.

---

## Revenue Model

### Pricing Tiers

#### Tier 1: Free (Lead Generation)
- Browse and read curated library
- No story generation
- **Goal:** Hook users with quality content, convert to paid

#### Tier 2: Premium - $9.99/month
- 3 custom story generation credits per month
- Access to curated library
- Keep all generated stories forever
- **Target:** Core user base
- **Cost:** ~$0.60 for 3 stories (Claude Sonnet 4)
- **Margin:** ~94% ($9.39 profit per subscriber)

#### Tier 3: Credit Add-ons - $4.99/credit
- Purchase individual credits on-demand
- For users who want more than 3 stories/month
- No subscription required
- **Target:** Power users, one-time purchasers
- **Cost:** ~$0.20 per story
- **Margin:** ~96% ($4.79 profit per credit)

#### Tier 4: Story Extensions - $2.99 each (Future)
- Extend any story by 3,000-5,000 words
- Continue the story you love
- **Cost:** ~$0.10 to generate
- **Margin:** 96% profit
- **Target:** Engaged users who love specific stories
- **Status:** Designed but not yet implemented

---

## Unit Economics

### Costs per Story
- **Standard generation (Claude Sonnet 4):** ~$0.15-0.20
- **Premium generation (Claude Opus):** ~$0.60-0.75
- **Story extension:** ~$0.10
- **Cover image (DALL-E 3):** ~$0.08 (optional)

### Revenue per Customer

**Premium Subscriber ($9.99/month):**
- Revenue: $9.99
- Cost: ~$0.60 for 3 stories (Sonnet)
- **Net margin: ~$9.39 (94%)**

**Credit Purchase ($4.99):**
- Revenue: $4.99
- Cost: ~$0.20
- **Net margin: ~$4.79 (96%)**

**Story Extension ($2.99):**
- Revenue: $2.99
- Cost: ~$0.10
- **Net margin: ~$2.89 (96%)**

### Monthly Operating Costs
- AI generation: Variable based on usage
- Hosting (Vercel): $20-50/month
- Database (Neon): Free tier → $20-50/month at scale
- Stripe fees: 2.9% + $0.30 per transaction
- Domain: $10-15/year (~$1/month)

**At 100 subscribers:**
- Revenue: $999/month
- Costs: ~$60/month
- **Profit: ~$940/month**

---

## Money Flow (Critical - No Upfront Capital Needed)

### Payment Flow (Upfront Collection)

1. **User Pays First:**
   - Subscription: $9.99/month charged immediately via Stripe
   - OR One-time: $4.99/credit charged immediately
   - Money hits your Stripe account **before** any generation

2. **Credits Added:**
   - Stripe webhook adds credits to user account
   - User has pre-paid balance

3. **User Generates Story:**
   - Credit deducted IMMEDIATELY (before generation starts)
   - Already implemented in code

4. **We Pay for Generation:**
   - API call to Anthropic (Claude)
   - We pay ~$0.15-0.20 from our Anthropic account
   - Billed monthly by Anthropic
   - **We've already collected $4.99-9.99 from user**

5. **If Generation Fails:**
   - Credit auto-refunded to user
   - Minimal loss (~$0.15)

**Key:** Cash-flow positive from day 1. No upfront capital needed beyond domain ($10-15).

---

## Revenue Projections

### Scenario 1: Soft Launch (Months 1-3)
- 5-20 signups from friends/family/Reddit
- 2-5 convert to paid (10-25% conversion)
- **Revenue: $20-50/month**
- **Profit: ~$15-45/month**

### Scenario 2: Active Marketing (Months 3-6)
- 50-200 signups/month
- 10-30% conversion rate
- 10-60 paying subscribers
- **Revenue: $100-600/month**
- **Profit: ~$90-550/month**

### Scenario 3: Good Growth (Months 6-12)
- 200-500 signups/month
- 15-25% conversion
- 50-150 paying subscribers (cumulative)
- **Revenue: $500-1,500/month**
- **Profit: ~$450-1,400/month**

### Scenario 4: Strong Success (Year 1+)
- 500-1,000 signups/month
- 20-30% conversion
- 200-500 paying subscribers
- **Revenue: $2,000-5,000/month**
- **Profit: ~$1,800-4,700/month**

**Realistic Target:** $500-2,000/month within 6 months with good execution.

---

## Distribution & Marketing Strategy

### Critical Success Factors
1. **Content Quality:** Free library must be AMAZING
2. **Distribution:** Find romance readers where they already are
3. **Word of Mouth:** Romance readers share with friends
4. **Retention:** Monthly subscriptions compound over time

### Phase 1: Prove Quality (Weeks 1-4)

#### 1. TikTok/BookTok - HIGHEST PRIORITY ⭐⭐⭐
**Why:** 50M+ romance readers on BookTok

**Strategy:**
- Create account: @readsilk
- Post 3-5 videos/day:
  - "POV: You can customize your romance to YOUR fantasy"
  - "Watch me generate an enemies-to-lovers story with MY name"
  - Reading dramatic excerpts from AI-generated stories
  - "This AI wrote me the spiciest scene I've ever read"
  - Before/after: "I gave AI these details → It wrote THIS"

**Hook:** Show the OUTCOME (dramatic story moments), not the process
**CTA:** "Link in bio - read free stories or make your own"

**Cost:** $0 (just time)
**Potential:** Viral videos can get 100K-1M+ views

#### 2. Reddit - Romance Communities ⭐⭐⭐
**Where:**
- r/RomanceBooks (500K+ members)
- r/romancelandia
- r/RomanceBookClub
- r/smuttyromancebooks

**Strategy:**
- **DON'T spam** - Participate genuinely first (2 weeks)
- Post: "I built a tool to generate custom romance stories - here's a free one I made for you"
- Give away free custom stories
- "Tell me your favorite trope and I'll generate you a story"
- Share in weekly self-promotion threads

**Cost:** $0
**Potential:** 100-500 signups if well-received

#### 3. Facebook Romance Groups ⭐⭐
**Strategy:**
- Join 20-30 romance reader groups (search "romance readers" "book club")
- Participate first, then share
- "Has anyone tried AI-generated romance?"
- Post excerpts, ask for feedback

**Cost:** $0
**Potential:** Older demographic (30-60), more likely to pay

---

### Phase 2: Convert Free Users (Weeks 2-8)

#### 4. Instagram Romance Community ⭐⭐
**Strategy:**
- Beautiful quote cards from stories
- "Spicy excerpt of the day"
- Partner with micro-influencers (bookstagram accounts)

**Cost:** $0-100 for influencer partnerships
**Potential:** 500-2K followers in 3 months

#### 5. Pinterest (Long-term SEO) ⭐
**Strategy:**
- Pins for each story
- "Best AI-Generated Romance Stories"
- "Customize Your Romance Story - Silk"
- Links drive to site

**Cost:** $0
**Potential:** Long tail traffic (months 3-12)

---

### Phase 3: Paid Acquisition (Month 2+)

#### 6. TikTok Ads ⭐⭐⭐
**Once organic is validated:**
- $20-50/day budget
- Target: Women 25-45, interested in romance novels, BookTok
- Video ads: Testimonials, story generation demos

**Cost:** $500-1,500/month
**Expected:** $5-15 per subscriber
**ROI:** Break even month 1-2, profit after

#### 7. Facebook/Instagram Ads ⭐⭐
**Target:**
- Women 30-55
- Interested in: Romance novels, Kindle Unlimited, Audible, Book of the Month
- Lookalike audiences from subscribers

**Cost:** $500-1,000/month
**Expected:** $10-20 per subscriber

---

### Phase 4: Partnerships & Growth Hacks

#### 8. Romance Author Partnerships ⭐⭐⭐
**Strategy:**
- Reach out to indie romance authors (10K-100K followers)
- Offer: Free premium account + revenue share (20%?)
- They promote to their audience
- "Use Silk to write fan fiction of my characters!"

**Potential:** Each author brings 50-500 users

#### 9. Romance Podcasts ⭐
**Examples:** "Fated Mates," "Smart Bitches Trashy Books"

**Strategy:**
- Guest appearances: "I built AI that writes personalized romance"
- Offer discount codes to listeners
- Sponsor episodes

**Cost:** $0-500/episode
**Potential:** 100-1,000 listeners convert

#### 10. Giveaways & Viral Loops ⭐⭐
**Launch promotions:**
- "First 100 users get 5 free story credits"
- "Refer a friend, both get 2 free credits"
- "Share your AI story on TikTok, tag us, get free month"

**Cost:** ~$50-200 in lost revenue
**Potential:** Viral growth, early adopters

---

## Launch Timeline

### Week 1: Foundation
**Tasks:**
- [ ] Generate 50 AMAZING curated stories (Claude Opus)
- [ ] Create TikTok account (@readsilk)
- [ ] Post 3 videos/day on TikTok
- [ ] Join Reddit romance communities (participate, don't spam)

**Goal:** 100 signups

### Week 2: Soft Launch
**Tasks:**
- [ ] Continue TikTok (3-5 videos/day)
- [ ] Post "I built this" on r/RomanceBooks
- [ ] Offer 50 free custom stories on TikTok
- [ ] Start collecting emails
- [ ] Join 20 Facebook romance groups

**Goal:** 500 signups, 10 paying ($100/month)

### Week 3-4: Scale What Works
**Tasks:**
- [ ] If TikTok works → Post more
- [ ] If Reddit works → Be more active
- [ ] Add Instagram content
- [ ] Start Pinterest pins
- [ ] Launch referral program

**Goal:** 1,000 signups, 50 paying ($500/month)

### Month 2: Validate & Expand
**Tasks:**
- [ ] Start small ad budget ($20/day on best channel)
- [ ] First influencer partnership
- [ ] Track metrics ruthlessly
- [ ] Collect user feedback

**Goal:** 2,000 signups, 150 paying ($1,500/month)

### Month 3+: Scale
**Tasks:**
- [ ] Increase ad budget to $50/day
- [ ] Podcast appearances
- [ ] Multiple influencer partnerships
- [ ] Optimize conversion funnel

**Goal:** 5,000 signups, 300 paying ($3,000/month)

---

## Immediate Next Steps (Tomorrow)

### Priority 1: Populate Curated Library ⭐⭐⭐
**Why:** Users need quality content to convert. Without this, nothing else matters.

**Tasks:**
1. Generate 50 high-quality romance stories using **Claude Opus** (not Sonnet)
2. Ensure variety:
   - **Genres:** Contemporary, Historical, Paranormal, Fantasy, Suspense
   - **Heat levels:** Sweet, Warm, Hot, Scorching
   - **Tropes:** Enemies to lovers, second chance, forced proximity, fake dating, etc.
3. Review and polish the best ones
4. Publish to library

**Cost:** ~$75-100 for 100 stories (select best 50)
**Time:** Few hours of generation + review
**Impact:** Makes platform look established, gives users content to fall in love with

### Priority 2: Stripe Payment Integration
**Why:** Can't generate revenue without this. Currently blocking all revenue.

**Tasks:**
1. Set up Stripe account
2. Implement subscription checkout ($9.99/month)
3. Implement credit purchase flow ($4.99/credit)
4. Create webhooks for payment events
5. Build subscription management page
6. Test thoroughly

**Time:** 1-2 days of development
**Impact:** Unblocks all revenue generation

### Priority 3: Story Extensions Feature (Quick Win)
**Why:** High margin (96%), engagement driver, already designed.

**Tasks:**
1. Add `StoryExtension` model to Prisma schema
2. Create `/api/stories/[id]/extend` endpoint
3. Add "Continue Story" button to story reader
4. Implement credit deduction (charge 1 credit)
5. Test

**Time:** 4-6 hours of development
**Impact:** Additional revenue stream, increases engagement

### Priority 4: User Feedback Form
**Why:** Essential for understanding what users love/hate, guides product iteration.

**Tasks:**
1. Create feedback form component (rating + text feedback)
2. Add feedback collection on story completion
3. Store feedback in database (create Feedback model)
4. Build admin view to review feedback
5. Add feedback prompts at key moments (after generation, after reading story)
6. Optional: Net Promoter Score (NPS) tracking

**Time:** 4-6 hours of development
**Impact:** User insights, product improvement data, testimonials for marketing

### Priority 5: Category/Trope Visual System
**Why:** Makes browsing more engaging, helps users discover new tropes visually.

**Tasks:**
1. Review all genre categories and trope combinations
2. Generate hero images for each category/trope combo (using DALL-E)
3. Add image fields to genre/trope selection UI
4. Update story cards to display trope/genre images
5. Create visual category browsing page

**Time:** Image generation (user handles tomorrow) + 6-8 hours UI development
**Impact:** Better UX, more engaging discovery, professional polish

---

## Success Metrics to Track

### Week 1
- Signups: 100
- TikTok views: 10K+
- TikTok followers: 100+

### Month 1
- Signups: 500-1,000
- Paying users: 10-50
- MRR (Monthly Recurring Revenue): $100-500
- Free-to-paid conversion: 5-10%
- TikTok followers: 500+

### Month 3
- Signups: 2,000-5,000
- Paying users: 100-300
- MRR: $1,000-3,000
- Free-to-paid conversion: 10-20%
- TikTok followers: 2,000+
- CAC (Customer Acquisition Cost): <$15
- LTV (Lifetime Value): >$30

### Month 6
- Signups: 5,000-10,000
- Paying users: 300-800
- MRR: $3,000-8,000
- Free-to-paid conversion: 15-25%
- Churn rate: <10%/month
- CAC: <$10
- LTV: >$50

---

## Critical Rules for Success

### ✅ DO:
- Ship fast, iterate faster
- Talk to users constantly
- Focus on content quality first (free library must be AMAZING)
- Be genuine in communities (don't spam)
- Track metrics religiously
- Double down on what works
- Test one marketing channel at a time

### ❌ DON'T:
- Spend on ads before validating organic traction
- Build features users don't ask for
- Spam communities (instant ban + bad reputation)
- Ignore user feedback
- Give up after first month
- Try to do everything at once

---

## The ONE Thing That Matters Most

**Content quality in the free library.**

If users read a free story and think "OMG this is amazing" → they'll pay for custom ones.
If they think "meh, it's okay" → they won't convert.

Everything else (marketing, ads, features) only works if the core product is excellent.

**This is why Priority #1 tomorrow is generating 50 incredible stories using Claude Opus.**

---

## Current Product Status

### ✅ Complete (Ready for Launch):
- Full authentication system (JWT + sessions)
- Story generation (async, polling, status tracking)
- Credit system (deduction, refunds)
- User dashboard
- My Stories page (view custom generated stories)
- Favorites system
- Dark theme design (consistent "Silk" branding)
- Consistent navigation across all pages
- Story reader (optimized for readability)
- Database schema (User, Story, Favorite, Session models)
- Admin panel (generate, review, publish stories)

### ❌ Blocking Launch:
1. **Curated library (empty)** - Need 50 stories
2. **Stripe payment integration** - Can't charge users
3. **Domain (readsilk.com)** - Need to purchase

### 🔜 Post-Launch Features (In Priority Order):
1. **Story extensions** ($2.99 each) - Additional revenue stream
2. **User feedback form** - Collect ratings, reviews, testimonials
3. **Category/trope images** - Visual browsing system
4. Email verification
5. Password reset
6. Profile editing
7. User analytics/tracking
8. Email notifications
9. Reading history
10. Rate limiting on API endpoints

---

## Competitive Analysis

### Direct Competitors

#### 1. Kindle Unlimited ($11.99/month)
- **Strengths:** Huge library, human-written, established brand
- **Weaknesses:** No personalization, limited to existing books
- **Our Advantage:** Cheaper + infinite personalization

#### 2. Radish/Dreame (Coins/chapter model)
- **Strengths:** Serialized stories, large user base
- **Weaknesses:** No personalization, can get expensive
- **Our Advantage:** All-you-can-read model, custom generation

#### 3. Wattpad (Free + Premium $6.99/month)
- **Strengths:** User-generated content, large community
- **Weaknesses:** Quality varies wildly, no personalization
- **Our Advantage:** Consistent AI quality, personalization

### Our Unique Advantages
- ✅ **Only platform with AI personalization**
- ✅ Instant gratification (2-minute story generation)
- ✅ Consistent quality (Claude Sonnet 4)
- ✅ Infinite variety (never run out of content)
- ✅ Competitive pricing ($9.99 vs $11.99 for Kindle Unlimited)
- ✅ High margins (90%+) allow aggressive marketing

---

## Risk Mitigation

### API Cost Overruns
- **Risk:** Users abuse system, generate too many stories
- **Mitigation:** Credit limits, rate limiting, fraud detection, credit costs are pre-paid

### Content Quality Issues
- **Risk:** AI generates inappropriate/low-quality content
- **Mitigation:** Heat level controls, content moderation, user reporting, test thoroughly

### AI Model Changes
- **Risk:** Anthropic changes pricing/access
- **Mitigation:** Multi-model strategy (can switch to GPT-4), cost monitoring alerts

### Payment Fraud
- **Risk:** Credit card fraud, chargebacks
- **Mitigation:** Stripe Radar (built-in fraud detection), email verification, usage pattern monitoring

### Platform Risk
- **Risk:** Anthropic bans our use case
- **Mitigation:** Review ToS, have backup (OpenAI GPT-4), diversify providers

---

## Key Contacts & Resources

### Domain Registration
- **Recommended:** Namecheap.com
- **Target domain:** readsilk.com
- **Cost:** ~$10-15/year

### Payment Processing
- **Stripe** (stripe.com)
- Free to set up
- 2.9% + $0.30 per transaction

### AI Generation
- **Anthropic API** (Claude)
- Pay-as-you-go, billed monthly
- No upfront cost

### Marketing Channels (To Create)
- TikTok: @readsilk
- Reddit: Participate in r/RomanceBooks, r/romancelandia
- Facebook: Join romance reader groups
- Instagram: Bookstagram community
- Pinterest: Romance story pins

---

## Decision Log

**2026-01-07:**
- ✅ Finalized pricing: $9.99 Premium (3 credits), $4.99 add-ons
- ✅ Corrected cost estimates: $0.15-0.20 per story (not $3!)
- ✅ Decided on brand name: "Silk"
- ✅ Target domain: readsilk.com
- ✅ TikTok as primary growth channel (BookTok)
- ✅ Priority: Content quality > everything else
- ✅ Launch plan: Week 1 = Generate 50 stories + TikTok
- ✅ Revenue model validated: No upfront capital needed, cash-flow positive day 1

**2026-01-06:**
- ✅ Fixed all text layout issues (one-word-per-line problems)
- ✅ Implemented consistent navigation across all pages
- ✅ Converted entire site to dark theme for consistency
- ✅ Fixed button clickability issues

**2026-01-05:**
- ✅ Chose Hybrid Model over pure subscription
- ✅ Implemented async generation to avoid Vercel timeouts
- ✅ Fixed character name repetition in stories

---

*This is a living document. Update after major decisions or pivots.*

**Next Session Focus:**
1. Generate 50 curated stories using Claude Opus
2. Generate category/trope hero images using DALL-E
3. Then: Stripe integration → Story extensions → Feedback form
