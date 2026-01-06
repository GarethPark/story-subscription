# Design System - Romance Story Platform

**Created:** January 6, 2026
**Status:** In Progress
**Goal:** Elegant, sophisticated design targeting female romance readers

---

## Design Philosophy

**Core Concept:** "Luxury Romance Library"
- Sophisticated romance novel aesthetic meets modern app design
- Premium, aspirational, but approachable
- Feminine without being juvenile
- Sensual without being overtly sexual

**Inspiration:**
- High-end book clubs (Reese's, Oprah's)
- Anthropologie's elegant femininity
- Romance novel cover aesthetics
- Dating apps like Bumble (feminine but modern)

---

## Color Palette

### Primary Colors

**Deep Rose** - `#BE185D` (rose-700)
- Use for: Primary CTAs, important highlights
- Represents: Passion, romance, warmth

**Rich Purple** - `#7C3AED` (violet-600)
- Use for: Secondary actions, accents
- Represents: Luxury, mystery, depth

**Warm Gold** - `#F59E0B` (amber-500)
- Use for: Premium features, success states
- Represents: Premium quality, achievement

### Neutral Colors

**Cream/Ivory** - `#FFFBEB` (amber-50)
- Use for: Page backgrounds, soft sections
- Creates warmth, romance

**Soft White** - `#FFFFFF`
- Use for: Cards, overlays
- Clean, modern

**Charcoal** - `#1F2937` (gray-800)
- Use for: Primary text, headings
- Elegant, readable

**Soft Gray** - `#F3F4F6` (gray-100)
- Use for: Subtle backgrounds, borders
- Gentle contrast

### Accent Colors

**Blush Pink** - `#FDF2F8` (pink-50)
- Use for: Hover states, gentle highlights
- Soft, romantic

**Champagne** - `#FEF3C7` (amber-100)
- Use for: Premium badges, special features
- Luxurious touch

**Success Green** - `#10B981` (emerald-500)
- Use for: Completed states only
- Minimal use

---

## Typography

### Font Families

**Headings:** Playfair Display (serif)
```css
font-family: 'Playfair Display', serif;
```
- Elegant, romantic, timeless
- Use for: H1, H2, hero text, story titles

**Alternative Heading:** Cormorant Garamond
- If Playfair feels too formal
- Same use cases

**Body:** Inter (sans-serif)
```css
font-family: 'Inter', sans-serif;
```
- Modern, clean, highly readable
- Use for: All body text, UI elements

**Alternative Body:** Plus Jakarta Sans
- Softer, more friendly
- Same use cases

**Accent:** Dancing Script or Parisienne (script)
```css
font-family: 'Dancing Script', cursive;
```
- Sparingly! Only for special moments
- Use for: Section labels like "Your Stories", "Featured"

### Type Scale

**Hero:**
- Desktop: 72px / 4.5rem (font-size), 1.1 (line-height)
- Mobile: 48px / 3rem

**H1:**
- Desktop: 48px / 3rem, 1.2
- Mobile: 36px / 2.25rem

**H2:**
- Desktop: 36px / 2.25rem, 1.3
- Mobile: 30px / 1.875rem

**H3:**
- Desktop: 30px / 1.875rem, 1.4
- Mobile: 24px / 1.5rem

**H4:**
- Desktop: 24px / 1.5rem, 1.4
- Mobile: 20px / 1.25rem

**Body Large:**
- 18px / 1.125rem, 1.6

**Body:**
- 16px / 1rem, 1.6

**Body Small:**
- 14px / 0.875rem, 1.5

**Caption:**
- 12px / 0.75rem, 1.4

---

## Spacing System

**Based on 4px grid:**
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)
- 4xl: 96px (6rem)

**Section Spacing:**
- Between major sections: 64px (4rem) desktop, 48px (3rem) mobile
- Between subsections: 32px (2rem)
- Between elements: 16px (1rem)

---

## Components

### Buttons

**Primary Button:**
```css
background: linear-gradient(135deg, #BE185D 0%, #7C3AED 100%);
color: white;
padding: 12px 32px;
border-radius: 12px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(190, 24, 93, 0.25);
transition: all 0.3s ease;

hover: transform: translateY(-2px);
       box-shadow: 0 6px 20px rgba(190, 24, 93, 0.35);
```

**Secondary Button:**
```css
background: white;
color: #BE185D;
border: 2px solid #BE185D;
padding: 12px 32px;
border-radius: 12px;
font-weight: 600;

hover: background: #FDF2F8;
```

**Text Button:**
```css
color: #7C3AED;
font-weight: 600;
text-decoration: underline;

hover: color: #BE185D;
```

### Cards

**Standard Card:**
```css
background: white;
border-radius: 16px;
padding: 24px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
border: 1px solid rgba(0, 0, 0, 0.05);

hover: box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
       transform: translateY(-4px);
transition: all 0.3s ease;
```

**Story Card:**
```css
background: white;
border-radius: 12px;
overflow: hidden;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

hover: box-shadow: 0 8px 24px rgba(190, 24, 93, 0.15);
       transform: translateY(-4px);
```

### Input Fields

**Text Input:**
```css
background: white;
border: 2px solid #E5E7EB;
border-radius: 12px;
padding: 12px 16px;
font-size: 16px;

focus: border-color: #BE185D;
       box-shadow: 0 0 0 3px rgba(190, 24, 93, 0.1);
```

**Textarea:**
- Same as text input
- Min height: 120px

### Badges/Tags

**Genre Badge:**
```css
background: linear-gradient(135deg, #FDF2F8 0%, #FEF3C7 100%);
color: #BE185D;
padding: 4px 12px;
border-radius: 16px;
font-size: 12px;
font-weight: 600;
```

**Heat Level Badge:**
```css
background: based on heat level
- Sweet: #10B981 (green)
- Warm: #F59E0B (amber)
- Hot: #EF4444 (red)
- Scorching: #BE185D (deep rose)

padding: 4px 12px;
border-radius: 16px;
color: white;
font-size: 12px;
font-weight: 600;
```

---

## Imagery Guidelines

### Photography Style

**Preferred:**
- Soft focus, dreamy quality
- Warm lighting (golden hour, candlelight)
- Cozy, intimate settings (reading nooks, cafes, bedrooms)
- Diverse couples showing genuine emotion
- Books, hands holding books, pages turning

**Avoid:**
- Harsh lighting or clinical settings
- Overly sexualized imagery
- Cheesy stock photo poses
- Cold, impersonal spaces

### Cover Images

**AI-Generated (DALL-E):**
- Romance novel cover style
- Professional book cover quality
- Genre-appropriate
- Couple chemistry emphasized
- Elegant, aspirational

**Gradient Fallbacks:**
```css
background: linear-gradient(135deg,
  #BE185D 0%,
  #7C3AED 50%,
  #F59E0B 100%
);
opacity: 0.8;
```

### Icons

**Style:**
- Line icons (not filled)
- Stroke width: 2px
- Size: 20-24px standard
- Color: Match text or accent color

**Sources:**
- Lucide React (current)
- Heroicons
- Custom illustrations for special elements

---

## Animations & Transitions

### Duration

**Fast:** 150ms
- Hover states
- Simple opacity changes

**Medium:** 300ms (default)
- Most transitions
- Button hovers
- Card elevations

**Slow:** 500ms
- Page transitions
- Large movements
- Complex animations

### Easing

**Standard:** `ease-in-out`
**Bounce:** `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
**Smooth:** `cubic-bezier(0.4, 0, 0.2, 1)`

### Special Animations

**Favorite Heart:**
- Scale + pulse when clicked
- Particle effect (hearts flying up)

**Story Complete:**
- Confetti animation
- Gentle shimmer on success message

**Loading States:**
- Shimmer effect (not spinner)
- Pulsing gradient for skeletons

**Page Transitions:**
- Fade + slight slide up
- 300ms duration

---

## Layouts

### Max Widths

**Narrow (Text-heavy):** 720px
- Story reading view
- Blog posts
- Long-form content

**Standard:** 1280px
- Dashboard
- Browse page
- Most pages

**Wide:** 1536px
- Landing page sections
- Full-width galleries

### Grid System

**Story Grid (Browse):**
- Desktop: 4 columns
- Tablet: 3 columns
- Mobile: 2 columns
- Gap: 24px

**Content Grid:**
- Desktop: 12 columns
- Tablet: 8 columns
- Mobile: 4 columns

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / Small desktop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

---

## Page-Specific Designs

### Landing Page

**Structure:**
1. Hero Section
2. Features (3 columns)
3. How It Works (3 steps)
4. Story Showcase (carousel)
5. Testimonials
6. Pricing Preview
7. Final CTA
8. Footer

**Hero:**
- Full height (100vh min)
- Background: Romantic imagery with gradient overlay
- Large heading (Playfair Display)
- Subheading explaining value
- 2 CTAs: "Start Reading Free" + "Create Your Story"
- Trust indicator: Star rating + testimonial snippet

### Dashboard

**Sections:**
1. Welcome Hero (personalized)
2. Create Story CTA (prominent)
3. Your Stories (horizontal scroll)
4. Curated Recommendations
5. Credits & Membership Card

**Layout:**
- Sidebar navigation (desktop)
- Bottom tab bar (mobile)
- Content area with sections

### Browse/Stories Page

**Layout:**
- Sidebar filters (desktop)
- Top filters + sort (mobile)
- Grid of story cards (cover-first)
- Infinite scroll or pagination

**Filters:**
- Genre (checkboxes)
- Heat Level (slider or buttons)
- Tags (multi-select)
- Sort: Popular, New, Romantic, Steamy

### Story Detail Page

**Layout:**
1. Hero (cover + metadata)
2. Summary
3. Tags/badges
4. Read/Favorite CTAs
5. Story content (beautiful typography)
6. Related stories footer

**Reading View:**
- Clean, distraction-free
- Sepia/night mode toggle
- Font size controls
- Progress indicator

---

## Navigation

### Header (Desktop)

```
┌────────────────────────────────────────────────────────────┐
│ 📖 RomanceStory    Browse  My Stories  Library             │
│                                          💎 3  [Profile] →  │
└────────────────────────────────────────────────────────────┘
```

**Sticky:** Yes, with blur backdrop
**Height:** 64px
**Shadow:** Subtle, appears on scroll

### Header (Mobile)

```
┌──────────────────────────────────────┐
│ ☰  RomanceStory        💎 3  [👤]   │
└──────────────────────────────────────┘
```

**Bottom Tab Bar:**
```
┌──────────────────────────────────────┐
│  🏠 Home  📚 Browse  ➕  ❤️  👤     │
└──────────────────────────────────────┘
```

### Footer

**Sections:**
- Logo + tagline
- Quick links (Browse, Pricing, About)
- Legal (Terms, Privacy, Cookies)
- Social media
- Newsletter signup

**Style:**
- Dark background (#1F2937)
- Light text
- Elegant, minimal

---

## Responsive Design

### Mobile-First Approach

All designs start mobile, scale up

**Key Considerations:**
- Touch targets: Min 44x44px
- Thumb-friendly bottom navigation
- Swipe gestures for stories
- Readable text without zooming
- Fast loading (optimize images)

### Desktop Enhancements

- Hover states (not on mobile)
- Multi-column layouts
- Larger images/typography
- Sidebar navigation
- More generous spacing

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on background: Min 4.5:1
- Large text: Min 3:1
- UI elements: Min 3:1

**Focus States:**
- Visible outline on all interactive elements
- 2px solid color + offset

**Alt Text:**
- All images have descriptive alt text
- Decorative images: alt=""

**Keyboard Navigation:**
- Tab order makes sense
- All actions keyboard accessible
- Skip links for long pages

**Screen Readers:**
- Semantic HTML
- ARIA labels where needed
- Logical heading structure

---

## Implementation Priority

### Phase 1: Foundation (Day 1)
- [ ] Set up Tailwind config with custom colors
- [ ] Add Google Fonts (Playfair Display, Inter)
- [ ] Create base components (Button, Card, Input)
- [ ] Update global styles

### Phase 2: Landing Page (Day 1-2)
- [ ] Hero section with CTA
- [ ] Features section
- [ ] How it works
- [ ] Pricing preview
- [ ] Footer

### Phase 3: Navigation (Day 2)
- [ ] New header component
- [ ] Mobile bottom navigation
- [ ] Profile dropdown
- [ ] Credits display

### Phase 4: Core Pages (Day 2-3)
- [ ] Dashboard redesign
- [ ] Browse/Stories page (grid)
- [ ] Story detail page
- [ ] My Stories page
- [ ] Generate page polish

### Phase 5: Polish (Day 3)
- [ ] Animations and transitions
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Mobile optimization
- [ ] Accessibility audit

---

## Brand Voice

**Tone:**
- Warm, inviting, friendly
- Sophisticated, not condescending
- Encouraging, empowering
- Fun but not silly
- Passionate about romance

**Example Copy:**

❌ "Generate AI stories"
✅ "Create your perfect romance"

❌ "User dashboard"
✅ "Your personal library"

❌ "Purchase credits"
✅ "Unlock more stories"

❌ "Story generation failed"
✅ "Oops! Let's try that again"

---

## Assets Needed

### Fonts
- [ ] Playfair Display (Google Fonts)
- [ ] Inter (Google Fonts)
- [ ] Dancing Script (optional, Google Fonts)

### Images
- [ ] Hero background (romantic, dreamy)
- [ ] Feature section illustrations (3)
- [ ] Testimonial avatars (3-5)
- [ ] Sample story covers (for showcase)

### Icons
- [ ] Custom logo/brand mark
- [ ] Social media icons
- [ ] Feature icons (elegant, custom)

---

## Next Steps

1. **Review & Approve Design Direction**
2. **Set up Tailwind config**
3. **Build component library**
4. **Implement landing page**
5. **Redesign core pages**
6. **Polish & test**
7. **Launch! 🚀**

---

*Design is love, love is design.* 💕
