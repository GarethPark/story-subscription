# Text Readability Standards

**Created**: January 6, 2026
**Purpose**: Ensure all text across Silk is readable, properly spaced, and not squashed

---

## ❌ Problems We Fixed

### Issues Identified:
1. **Generate page subtitle** - Text squashed together with max-w-3xl
2. **Stories page subtitle** - Text cramped with max-w-2xl
3. **Generate "Out of Credits"** - Long text squashed with max-w-md
4. **Stories grid layout** - Stories pushed to left, not using full width

### Root Causes:
- Max-width constraints too narrow (max-w-md, max-w-2xl)
- Font sizes too small for centered headlines (text-lg)
- Missing line-height spacing (no leading-relaxed)
- Container widths too restrictive

---

## ✅ Text Spacing Standards

### Centered Subtitles/Headlines (Hero sections)
```tsx
<p className="text-gray-300 text-xl text-center max-w-4xl mx-auto leading-relaxed">
  Your subtitle text here
</p>
```

**Rules:**
- Font size: `text-xl` (20px) minimum for subtitles
- Max width: `max-w-4xl` (896px) or `max-w-5xl` (1024px) for hero text
- Line height: `leading-relaxed` (1.625)
- Always centered: `text-center mx-auto`
- Color: `text-gray-300` for readability on dark backgrounds

### Body Text (Paragraphs)
```tsx
<p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
  Your body text here
</p>
```

**Rules:**
- Font size: `text-lg` (18px) for important body text
- Max width: `max-w-2xl` (672px) for single column reading
- Line height: `leading-relaxed`
- Can be left-aligned or centered depending on context

### Small Text (Metadata, captions)
```tsx
<span className="text-sm text-gray-400">
  Caption or metadata
</span>
```

**Rules:**
- Font size: `text-sm` (14px) minimum
- No tight max-widths unless absolutely necessary
- Use `text-gray-400` or `text-gray-500` for de-emphasized text

---

## 🚫 Anti-Patterns (What NOT to Do)

### ❌ TOO NARROW:
```tsx
// BAD - Text will look squashed
<p className="text-lg max-w-md mx-auto">
  This is a longer sentence that will wrap awkwardly
</p>

// max-w-md is only 448px - too narrow for sentences
```

### ❌ TOO SMALL:
```tsx
// BAD - Hard to read on large screens
<p className="text-sm text-center">
  This is a main subtitle
</p>

// Subtitles should be text-lg or text-xl
```

### ❌ NO LINE HEIGHT:
```tsx
// BAD - Lines too close together
<p className="text-lg">
  Multi-line text without
  proper spacing between lines
</p>

// Always use leading-relaxed or leading-loose
```

### ❌ CONSTRAINED CONTAINERS:
```tsx
// BAD - Content squashed to left
<div className="container mx-auto">
  <div className="grid grid-cols-3">
    {/* Cards pushed to left on wide screens */}
  </div>
</div>

// Need max-w on container for wide screens
```

---

## ✅ Good Patterns (What TO Do)

### ✅ HERO SUBTITLE:
```tsx
<p className="text-gray-300 text-xl text-center max-w-5xl mx-auto leading-relaxed">
  Personalize every detail - from character names to plot twists. Your story, your way.
</p>
```
- Wide enough: max-w-5xl (1024px)
- Large enough: text-xl (20px)
- Proper spacing: leading-relaxed
- Centered properly: text-center mx-auto

### ✅ SECTION SUBTITLE:
```tsx
<p className="text-gray-300 text-center text-xl max-w-4xl mx-auto leading-relaxed">
  Indulge in our curated collection of irresistible romance
</p>
```
- Appropriate width: max-w-4xl (896px)
- Good size: text-xl
- Readable spacing: leading-relaxed

### ✅ BODY PARAGRAPH:
```tsx
<p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
  Upgrade to Premium for 3 credits per month, or purchase additional credits.
</p>
```
- Paragraph width: max-w-2xl (672px)
- Good body size: text-lg
- Margin bottom: mb-6
- Proper spacing: leading-relaxed

### ✅ WIDE CONTAINER:
```tsx
<div className="container max-w-[1600px] mx-auto px-4 md:px-6 py-12">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
    {/* Cards use full width properly */}
  </div>
</div>
```
- Max width for ultra-wide: max-w-[1600px]
- Responsive grid: 1→2→3→4 columns
- Good spacing: gap-6

---

## 📏 Max-Width Reference Guide

| Class | Width | Best Use Case |
|-------|-------|--------------|
| `max-w-md` | 448px | ❌ Too narrow for most text |
| `max-w-lg` | 512px | ⚠️  Use carefully - still narrow |
| `max-w-xl` | 576px | ✅ Short captions only |
| `max-w-2xl` | 672px | ✅ Body paragraphs |
| `max-w-3xl` | 768px | ✅ Longer body text |
| `max-w-4xl` | 896px | ✅ Section subtitles |
| `max-w-5xl` | 1024px | ✅ Hero subtitles |
| `max-w-6xl` | 1152px | ✅ Wide content |
| `max-w-7xl` | 1280px | ✅ Full-width sections |
| `max-w-[1600px]` | 1600px | ✅ Container max-width |

---

## 🧪 Testing Checklist

### Manual Testing (Required Before Deploy)

Test on these viewport sizes:
- [ ] Mobile (375px) - iPhone SE
- [ ] Tablet (768px) - iPad
- [ ] Laptop (1280px) - MacBook
- [ ] Desktop (1920px) - Standard monitor
- [ ] Ultra-wide (2560px) - Wide monitor

### For Each Page, Check:

**Text Readability:**
- [ ] No text appears "squashed" or cramped
- [ ] Line breaks happen naturally at punctuation
- [ ] Multi-line text has comfortable spacing
- [ ] Text doesn't extend too far horizontally (>80ch)
- [ ] Subtitles are visually distinct (larger than body)

**Layout:**
- [ ] Content doesn't hug left side on wide screens
- [ ] Cards/grid items distribute evenly
- [ ] Margins and padding feel balanced
- [ ] Nothing feels "empty" or "crowded"

**Typography:**
- [ ] Font sizes increase on larger screens (responsive)
- [ ] Line height is comfortable (leading-relaxed)
- [ ] Text contrast is sufficient (WCAG AA minimum)
- [ ] Headings use proper hierarchy (h1 > h2 > h3)

### Pages to Test:

1. **Homepage** (/)
   - [ ] Hero subtitle "Indulge in stories where passion ignites..."
   - [ ] Feature descriptions
   - [ ] Pricing card text

2. **Generate** (/generate)
   - [ ] Page subtitle "Personalize every detail..."
   - [ ] "Out of Credits" message
   - [ ] "How It Works" section text

3. **Stories** (/stories)
   - [ ] Header subtitle "Indulge in our curated collection..."
   - [ ] Story card descriptions
   - [ ] Empty state message

4. **Story Reader** (/stories/[id])
   - [ ] Story summary text
   - [ ] Main story content (8,000 words!)
   - [ ] "The End" section text

5. **Login/Signup** (/login, /signup)
   - [ ] Welcome text
   - [ ] Form labels and inputs
   - [ ] Feature list items

6. **Dashboard** (/dashboard)
   - [ ] Welcome message
   - [ ] CTA card text
   - [ ] Card descriptions

7. **Profile** (/profile)
   - [ ] Section headings
   - [ ] Account info labels

8. **About/Legal** (/about, /privacy, /terms)
   - [ ] Long-form body text
   - [ ] Section paragraphs
   - [ ] List items

---

## 🔧 Quick Fixes Reference

### If text looks squashed:

1. **Increase max-width:**
   ```tsx
   // Before
   max-w-md    // 448px - too narrow

   // After
   max-w-2xl   // 672px - better for body
   max-w-4xl   // 896px - better for subtitles
   ```

2. **Increase font size:**
   ```tsx
   // Before
   text-base   // 16px - too small for hero
   text-lg     // 18px - okay for body

   // After
   text-xl     // 20px - good for subtitles
   text-2xl    // 24px - good for small headings
   ```

3. **Add line height:**
   ```tsx
   // Before
   <p className="text-lg max-w-2xl">

   // After
   <p className="text-lg max-w-2xl leading-relaxed">
   ```

4. **Center properly:**
   ```tsx
   // Before
   <p className="text-center max-w-4xl">

   // After
   <p className="text-center max-w-4xl mx-auto">
   ```

---

## 📊 Current Status

### ✅ Fixed (January 6, 2026):
- [x] Generate page subtitle - Changed to text-xl, max-w-5xl
- [x] Stories page subtitle - Changed to text-xl, max-w-4xl
- [x] Generate "Out of Credits" - Changed to text-lg, max-w-2xl
- [x] Stories grid layout - Container max-w-[1600px], better responsive grid
- [x] All centered text now has leading-relaxed

### 🔄 Still Need to Test:
- [ ] Story reader page (8,000 word stories)
- [ ] Mobile text scaling
- [ ] Accessibility (screen reader testing)

---

## 📝 Implementation Notes

### Files Modified:
- `app/generate/page.tsx` - Fixed subtitle and "Out of Credits" text
- `app/stories/page.tsx` - Fixed header subtitle and layout width

### CSS Classes Used:
```css
/* Font Sizes */
text-sm      /* 14px - metadata */
text-base    /* 16px - default body */
text-lg      /* 18px - emphasized body */
text-xl      /* 20px - subtitles */
text-2xl     /* 24px - small headings */

/* Max Widths */
max-w-2xl    /* 672px - body paragraphs */
max-w-4xl    /* 896px - section subtitles */
max-w-5xl    /* 1024px - hero subtitles */

/* Line Heights */
leading-normal   /* 1.5 - default */
leading-relaxed  /* 1.625 - comfortable */
leading-loose    /* 2.0 - very spacious */
```

---

## 🎯 Design Principles

1. **Readability First**: Text must be comfortable to read at all sizes
2. **Generous Spacing**: When in doubt, use more space not less
3. **Responsive Sizing**: Larger text on larger screens
4. **Semantic Hierarchy**: Clear visual distinction between text levels
5. **Consistent Patterns**: Reuse proven text styles across pages

**Golden Rule**: If text looks "squashed" or "cramped", it probably is.
Make it bigger, wider, and add more line-height.

---

## ✨ Quick Test Command

```bash
# Check all text elements with max-width constraints
grep -rn "max-w-" app/*.tsx app/**/*.tsx | grep -E "text-|<p"

# Should only find appropriate widths (2xl, 4xl, 5xl)
# If you see max-w-md or max-w-lg, investigate!
```
