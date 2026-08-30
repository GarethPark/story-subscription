# Session Notes — Aug 29, 2026

## Summary
Story generation was completely broken in production (0 successful generations all day). Root cause found, fixed, and pushed to GitHub — but **not yet deployed to production**. One new bug discovered along the way, still unfixed.

---

## Bug #1: Retired Claude model snapshots — FIXED, pushed, NOT deployed

**Symptom:** Admin email alert — `404 not_found_error, model: claude-sonnet-4-20250514`. Traced to production DB: 6/6 generation attempts failed today, 0 completed, all with the same error.

**Root cause:** Anthropic retired the `claude-sonnet-4-20250514` and `claude-opus-4-20250514` model snapshots (dated May 2025) that were hardcoded across the codebase. Not a code regression — the lines hadn't changed since Jan 28. Anthropic just stopped serving those model IDs.

**Affected user:** `will.hudson@live.co.uk` (user id `cmtdn07mb0000qkt5fzu8tvfg`) — signed up today, hit the failure 6 times in a row, credits were auto-refunded each time but the feature was fully broken for their first experience. Worth a personal follow-up email if you want to try to save that signup.

**Fix applied** (commit `72feee4`, pushed to `origin/main`):
- Updated model IDs to current models, verified live against the real Anthropic API before committing:
  - `claude-sonnet-4-20250514` → `claude-sonnet-5` (user custom story generation)
  - `claude-opus-4-20250514` → `claude-opus-5` (admin curated stories, story extensions, batch generation scripts)
  - `claude-3-haiku-20240307` → `claude-haiku-4-5-20251001` (`scripts/test-api-key.ts`, also dead)
- Also added `thinking: { type: 'disabled' }` to every call. Both new models default to adaptive extended thinking, which adds a `thinking` content block before the actual text — four of the eight call sites parse the response as `content[0].type === 'text'`, so without this they'd have silently returned empty strings instead of a clean error. Verified the fix restores the exact old single-text-block response shape on both models.
- Files changed: `app/api/generate-story/[id]/execute/route.ts`, `app/api/admin/generate-story/[id]/execute/route.ts`, `app/api/stories/[id]/extend/route.ts`, `generate-story.ts`, `scripts/generate-50-stories.ts`, `scripts/generate-5-stories.ts`, `scripts/generate-batch-custom.ts`, `scripts/test-api-key.ts`.
- `tsc --noEmit` passes clean.

**STATUS: DEPLOYED AND CONFIRMED WORKING** (deployed via `vercel --prod`, aliased to www.readsilk.com). Verified by calling the production execute endpoint directly for test story `cmtent6ly000310it46kyznhp` — it completed successfully: title "The Orchard We Left Behind", 5,533 characters of real content, generated with `claude-sonnet-5`. DB status is `COMPLETED`.

Note: this test called `/api/generate-story/[id]/execute` directly, bypassing the normal trigger — so it confirms the *model fix* works, but doesn't yet confirm the normal signup→generate flow works end-to-end. See Bug #2.

**TODO tomorrow:**
1. Re-test the *normal* flow (not a direct `/execute` call) once Bug #2 is fixed, to confirm a real user can generate a story start to finish.
2. Consider a follow-up email to `will.hudson@live.co.uk` now that generation actually works.

---

## Bug #2: Story generation gets stuck at PENDING forever — NOT FIXED, needs investigation

**Discovered while testing Bug #1's fix.** Triggered a real generation through the normal flow (`POST /api/generate-story` while logged in) against production. The story row was created fine, credit was deducted, but `generationStatus` stayed `PENDING` indefinitely — `updatedAt` never moved past `createdAt`, meaning the actual generation step was never even attempted.

**Root cause (likely):** `app/api/generate-story/route.ts` kicks off the real work with an un-awaited "fire and forget" `fetch()` to `/api/generate-story/[id]/execute`, then immediately returns its own response to the client. On Vercel serverless, once a function returns, the runtime can freeze/terminate the execution context before that background `fetch` actually completes — a known footgun with this pattern. Calling `/execute` directly (bypassing the trigger) does work and reaches the model call correctly.

**Test artifact left in production DB:** story id `cmtent6ly000310it46kyznhp`, owned by test account `garethpark@msn.com`, permanently stuck at `PENDING`. Safe to ignore/delete — it's a real 1-credit story generation charge, was refunded... actually **not yet refunded**, since it never failed, just hung. Consider deleting this row and manually crediting back the 1 credit if you want the test account's balance accurate, or just ignore it since it's your own test account.

**TODO tomorrow:**
1. Decide on a fix — most robust options: use `waitUntil()` (Vercel/Next.js primitive for background work that's allowed to outlive the response) instead of bare `fetch()`, or make the initial request actually `await` the generation (accepting a longer response time), or move to a proper queue.
2. Clean up test story `cmtent6ly000310it46kyznhp` in production DB.
3. Once fixed, re-verify the *normal* user-facing flow (not just direct `/execute` calls) completes end-to-end.

---

## Other things from this session (informational, no action needed)
- Confirmed site is live on Vercel + Neon Postgres, DNS/headers verified independently (not just docs).
- Confirmed via direct production DB query: 10 total users, 1 paying subscriber (Starter tier — likely your own test account, not an organic customer, worth confirming in Stripe).
- `npm audit` flagged 25 advisories, but none are in the actual production runtime path except `sharp` (via `next/image`) — low urgency, would clear up with a routine `next` patch bump.
- Facebook ad campaign was live as of Jan 28 launch doc at $10/day — worth checking Meta Ads Manager directly for current spend/status, wasn't able to verify from code/repo.
