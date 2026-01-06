# Silk Product Strategy
**Last Updated**: January 6, 2026

## Executive Summary

**Decision**: Implement Option 1 (Two-Tier Quality) + Story Extension Feature

This strategy maximizes quality to hook users while maintaining healthy profit margins. We invest in premium AI for curated content to showcase quality, use cost-effective AI for custom generation, and add story extensions as a high-margin engagement feature.

---

## AI Model Strategy

### Free Curated Library Stories
**Model**: Claude Opus 4.5 (Anthropic's flagship)
- **Cost**: ~$0.75-$1.00 per 7,000-word story
- **Quality**: Best-in-class emotional depth, character development, narrative pacing
- **Initial Investment**: $75-100 for 100 stories (select best 50 for launch)
- **Ongoing**: $20/month for 20 new curated stories

**Why Opus for Free Stories:**
- First impression is CRITICAL - free stories must WOW users
- One-time cost is manageable ($75-100)
- Quality differentiates us from competitors
- Gets users hooked and willing to pay for custom stories

### Custom User-Generated Stories
**Model**: Claude Sonnet 4
- **Cost**: ~$0.15-$0.20 per 7,000-word story
- **Quality**: Very good - excellent quality-to-cost ratio
- **Profit Margin**: $9.99 subscription - $0.60 cost = $9.39 profit per user
- **Add-on Margin**: $4.99 - $0.20 = $4.79 profit per credit

**Why Sonnet for Custom:**
- Still excellent quality (not a downgrade users will notice)
- Cost-effective at scale
- Healthy profit margins enable sustainable growth
- Fast generation (1-2 minutes)

### Story Extensions (New Feature)
**Model**: Same as original story (Sonnet 4 for custom, Opus for curated)
- **Cost**: ~$0.10 per 3,000-word extension
- **Pricing**: 0.5 credits ($2.50 value)
- **Profit Margin**: $2.50 - $0.10 = $2.40 per extension (96%!)

---

## Pricing Strategy

### Current Pricing (No Changes)
- **Free Tier**: Unlimited access to curated library
- **Premium**: $9.99/month for 3 custom story credits
- **Add-On Credits**: $4.99 per credit

### New: Story Extensions
- **Price**: 0.5 credits per extension
- **Length**: 3,000-4,000 words
- **Feature**: Continue any story (custom or curated)
- **Benefit**: Explore "what happens next", alternative endings, deeper character development

### Future Premium Tier (Phase 2 - Optional)
If users demand even higher quality:
- **"Premium Generation"**: $7.99/credit using Claude Opus 4.5
- Market as "Our highest quality AI model"
- Only add after validating demand

---

## Revenue Model Projection

### Example: 100 Paying Users

**Revenue:**
- 60 users × $9.99 subscription = $599.40
- 40 users × 2 add-on credits × $4.99 = $399.20
- 30 users × 3 extensions × $2.50 = $224.25
- **Total Monthly Revenue**: $1,222.85

**Costs:**
- 180 custom stories × $0.20 = $36.00
- 80 add-on stories × $0.20 = $16.00
- 90 extensions × $0.10 = $9.00
- 20 new curated stories × $1.00 = $20.00
- **Total Monthly Costs**: $81.00

**Gross Profit**: $1,141.85
**Gross Margin**: 93%

---

## Story Extension Feature Specification

### User Experience

**For Curated Library Stories:**
1. User reads a curated story and loves it
2. Clicks "Continue This Story" button at the end
3. Prompted to use 0.5 credits
4. Enters optional prompt: "I want to see them get married" or "Show me their first fight"
5. Extension generates in 1-2 minutes
6. Extension appends to story, marked as "Extended by You"

**For Custom Stories:**
1. User generates their own custom story
2. Can extend it unlimited times
3. Each extension costs 0.5 credits
4. Extensions maintain character names, tone, and continuity

### Technical Implementation

**Database Schema:**
```prisma
model StoryExtension {
  id            String   @id @default(cuid())
  storyId       String
  story         Story    @relation(fields: [storyId], references: [id], onDelete: Cascade)
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  content       String   @db.Text
  wordCount     Int
  userPrompt    String?  @db.Text  // Optional user instructions for extension
  order         Int      // Track sequence (1st extension, 2nd, etc.)
  modelUsed     String   // Track which AI model generated it
  createdAt     DateTime @default(now())

  @@index([storyId, order])
  @@index([userId])
}

// Add to Story model:
model Story {
  // ... existing fields
  extensions StoryExtension[]
}

// Add to User model:
model User {
  // ... existing fields
  storyExtensions StoryExtension[]
}
```

**API Endpoint:**
```typescript
// POST /api/stories/[id]/extend
{
  userPrompt?: string  // Optional continuation instructions
}

Response:
{
  extensionId: string
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED'
}

// GET /api/stories/[id]/extensions/[extensionId]/status
// Similar polling to story generation
```

**Generation Logic:**
```typescript
async function generateStoryExtension(
  storyId: string,
  userId: string,
  userPrompt?: string
) {
  // 1. Verify user has 0.5 credits
  // 2. Deduct 0.5 credits
  // 3. Load original story + all existing extensions
  // 4. Build context prompt:

  const prompt = `
Continue this romance story. Maintain character personalities,
tone, writing style, and plot consistency.

ORIGINAL STORY:
${story.content}

${existingExtensions.map((ext, i) => `
EXTENSION ${i + 1}:
${ext.content}
`).join('\n\n')}

${userPrompt ? `USER REQUEST: ${userPrompt}` : ''}

Continue the story for approximately 3,500 words, picking up
naturally where it left off...
`

  // 5. Generate with same model as original
  // 6. Save extension with order number
  // 7. Return extension ID for status polling
}
```

**UI Components:**
```typescript
// components/story/extend-story-button.tsx
- Shows "Continue Story (0.5 credits)" button
- Modal for optional user prompt
- Credit balance check
- Generation status tracking

// components/story/story-extensions.tsx
- Display all extensions in order
- Mark each extension with creation date
- "Continue again" option after each extension
```

### Why Extensions Are Powerful

1. **Engagement**: Users emotionally invest in stories
2. **Higher LTV**: Average user buys more credits for extensions
3. **Unique Feature**: No competitor offers this
4. **Quality Control**: Users fix endings they didn't like
5. **Viral Potential**: "I extended this story 5 times!" social sharing
6. **Low Cost**: Extensions reuse context, cheaper than full stories

---

## Content Policy & Quality Standards

### Anthropic Claude Policies
- **Allowed**: Romance novels with mature themes, emotional intimacy, tasteful intimate scenes
- **Focus**: Character-driven relationships, emotional depth, narrative progression
- **Not Allowed**: Purely explicit content without story/character development

### Our Quality Standards
All stories (curated and custom) must have:
- Strong character development
- Compelling plot/conflict
- Emotional resonance
- Satisfying resolution (or cliffhanger for extensions)
- Professional prose quality
- 6,000-8,000 words (full stories)
- 3,000-4,000 words (extensions)

---

## Implementation Roadmap

### Phase 1: Quality Validation (This Week)
**Before full implementation, test quality differences:**

1. Generate 10 identical prompts across genres with:
   - Claude Opus 4.5
   - Claude Sonnet 4
   - GPT-4o (for comparison)

2. Blind test with 5-10 beta users

3. Measure:
   - Overall quality ratings
   - Completion rates (did they finish?)
   - Willingness to pay for custom stories
   - Preference for Opus vs Sonnet

4. Validate that Opus quality justifies investment for curated library

### Phase 2: Curated Library Generation (Next Week)
**Budget: $75-100**

1. Create 20-25 detailed story prompts across:
   - Contemporary Romance (5)
   - Historical Romance (5)
   - Paranormal/Fantasy Romance (5)
   - Romantic Suspense (5)
   - Small Town Romance (5)

2. Generate with Claude Opus 4.5

3. Review and select best 50 stories

4. Generate cover images with DALL-E 3

5. Publish to curated library

6. Add metadata: tags, heat levels, tropes, character types

### Phase 3: Story Extension Feature (Week 2-3)
**Development Tasks:**

1. Database migration for StoryExtension model
2. API endpoints: POST /extend, GET /status
3. Extension generation logic with context building
4. UI: "Continue Story" button and modal
5. Extension display in story reader
6. Credit deduction (0.5 credits)
7. Generation status tracking (reuse existing polling)
8. Testing with various scenarios

### Phase 4: Launch & Monitor (Week 3-4)
1. Deploy extension feature
2. Add announcement banner
3. Monitor usage metrics:
   - Extension adoption rate
   - Average extensions per user
   - Credit purchase increase
   - User feedback

4. Iterate based on feedback

---

## Success Metrics

### Key Performance Indicators

**Quality Metrics:**
- Story completion rate > 80% (users finish stories)
- User rating > 4.2/5 stars average
- Return reader rate > 60% (come back for more)

**Engagement Metrics:**
- Extension adoption > 30% of active users
- Average extensions per user > 2
- Time on platform > 15 minutes per session

**Revenue Metrics:**
- Free-to-paid conversion > 3%
- Monthly credit purchases per user > $8
- Extension revenue > 15% of total revenue

**Cost Metrics:**
- Cost per story < $0.25 (blended average)
- Gross margin > 90%
- CAC payback < 2 months

---

## Risk Mitigation

### Potential Issues & Solutions

**Risk**: Opus quality not noticeably better than Sonnet
- **Solution**: Quality test before full investment (Phase 1)
- **Backup**: Use Sonnet for all, invest $100 in marketing instead

**Risk**: Extensions don't get adopted
- **Solution**: Soft launch to subset of users, gather feedback
- **Backup**: Offer first extension free to drive trial

**Risk**: Extension quality is inconsistent
- **Solution**: Include full story context in prompt
- **Backup**: Limit extensions to 3 per story to prevent drift

**Risk**: Users abuse extensions for unlimited content
- **Solution**: 0.5 credit cost creates natural limit
- **Note**: This is actually a good problem (more revenue!)

---

## Next Steps

### Immediate Actions (Tomorrow)

1. **Quality Testing**:
   - Generate 10 test stories (5 Opus, 5 Sonnet)
   - Create comparison doc
   - Decide on final model strategy

2. **Database Schema**:
   - Add StoryExtension model to Prisma schema
   - Run migration
   - Test relationships

3. **Curated Library Prompts**:
   - Draft 25 detailed story prompts
   - Include genre, tropes, heat level, character archetypes
   - Review for diversity and appeal

4. **Extension API**:
   - Design API endpoints
   - Build generation logic
   - Test with sample stories

### Week 1 Goals
- [ ] Complete quality testing
- [ ] Generate 50 curated Opus stories
- [ ] Publish curated library
- [ ] Begin extension feature development

### Week 2 Goals
- [ ] Complete extension feature
- [ ] Deploy to production
- [ ] Launch announcement
- [ ] Monitor initial usage

### Week 3 Goals
- [ ] Analyze metrics
- [ ] Gather user feedback
- [ ] Iterate on extension UX
- [ ] Plan premium tier (if needed)

---

## Cost Budget Summary

### Initial Investment
- Curated library generation: $75-100 (one-time)
- Quality testing: $10 (one-time)
- **Total Initial**: ~$85-110

### Monthly Ongoing Costs
- 20 new curated stories: $20/month
- 100 custom stories @ $0.20: $20/month
- 50 extensions @ $0.10: $5/month
- Cover images (DALL-E): $5/month
- **Total Monthly**: ~$50/month

### Break-Even Analysis
- Need 6 paying users at $9.99/month to cover costs
- Every user beyond 6 is pure profit at 90%+ margin

---

## Technical Notes

### Current System
- **Story Generation**: Uses Claude Sonnet 4 via Anthropic API
- **Cover Images**: Uses DALL-E 3 via OpenAI API
- **Database**: PostgreSQL (Neon) via Prisma ORM
- **Storage**: All content stored in database
- **Generation Flow**:
  1. User submits prompt
  2. Story record created with PENDING status
  3. Background job generates content
  4. Polling for status updates
  5. Story marked COMPLETED when done

### Extension System Architecture
- **Reuse existing generation infrastructure**
- **Add extension table linked to stories**
- **Context building**: Concatenate original + all extensions
- **Model consistency**: Use same model as original story
- **Credit system**: Extend existing credit deduction logic (0.5 instead of 1.0)

### Model Configuration
```typescript
// lib/ai/generate-story.ts
const MODELS = {
  CURATED: 'claude-opus-4.5-20251101',     // For admin-generated curated stories
  CUSTOM: 'claude-sonnet-4-5-20250929',     // For user custom stories
  EXTENSION: 'inherit',                      // Match original story's model
}

const MODEL_COSTS = {
  'claude-opus-4.5': { input: 0.015, output: 0.075 },
  'claude-sonnet-4.5': { input: 0.003, output: 0.015 },
}
```

---

## Appendix: Story Prompt Template

### Template for Curated Story Generation
```
Genre: [Contemporary/Historical/Paranormal/etc.]
Subgenre: [Second Chance/Enemies to Lovers/Forced Proximity/etc.]
Heat Level: [Sweet/Sensual/Steamy]
Setting: [Small town Maine/Victorian London/Modern NYC/etc.]
Word Count: 7,000 words

Protagonist: [Name, age, occupation, key trait]
Love Interest: [Name, age, occupation, key trait]

Central Conflict: [What keeps them apart]
Plot Hook: [Inciting incident]
Key Scenes: [2-3 must-have moments]
Ending: [HEA or HFN]

Tone: [Witty/Emotional/Suspenseful/etc.]
POV: Third person limited, alternating

Generate a complete romance short story following professional
romance novel conventions...
```

---

## Document History
- 2026-01-06: Initial strategy documentation (Option 1 + Extensions decision)
- Next update: After quality testing results
