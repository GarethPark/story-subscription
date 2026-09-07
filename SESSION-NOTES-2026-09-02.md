# Session Notes — Sep 2, 2026

## Summary
Two threads: (1) worked out actual unit economics per subscriber tier, (2) evaluated OpenRouter as an alternative model provider for the Scorching heat level, since Claude self-moderates on graphic content regardless of prompt wording (confirmed last session, `bc29465`). Found a working candidate model, but it's not reliable enough to ship yet — that's tomorrow's task.

No code was changed in the app itself this session. Everything below is research + local test scripts. `Bug #2` (generation stuck at `PENDING`, see `SESSION-NOTES-2026-08-29.md`) is still open and untouched.

---

## Part 1: Unit economics (informational, no action needed)

Billing is pure pay-per-use — no standing charge, only billed for tokens in actual API calls.

Per-story AI cost is capped by `max_tokens: 8192` in `execute/route.ts` (~$0.08/story max on Claude Sonnet 5, regardless of requested word count).

| Tier | Price | Credits/mo | Stripe fee | Net revenue | Max AI cost | Gross profit | Margin |
|---|---|---|---|---|---|---|---|
| Starter | $6.99 | 3 | ~$0.50 | ~$6.49 | ~$0.24 | ~$6.25 | ~89-96% |
| Plus | $11.99 | 8 | ~$0.65 | ~$11.34 | ~$0.64 | ~$10.70 | ~89-94% |
| Unlimited | $19.99 | "2/day" fair use (~60/mo cap) | ~$0.88 | ~$19.11 | ~$4.80 worst case | ~$14.31 worst case | ~72-95% |

Excludes hosting (Vercel/Neon), refunded-but-hung generations (Bug #2), and customer acquisition cost.

**Also flagged (not fixed):** `max_tokens: 8192` (≈6,000 words) contradicts the Plus tier pricing page's promise of "8,000-10,000 word stories" — Plus subscribers can't actually get what's advertised; the story would just cut off mid-scene. Worth fixing separately.

---

## Part 2: OpenRouter for the Scorching tier

### Why
Last session's prompt rework (`bc29465`) confirmed Claude self-moderates graphic content regardless of wording. Decided to test routing just the Scorching tier through a different provider, keeping Claude for Sweet/Warm/Hot.

### Setup
- `OPENROUTER_API_KEY` already present in `.env` and confirmed working (uses the `openai` npm package, already a dependency, pointed at `baseURL: https://openrouter.ai/api/v1` — OpenRouter is OpenAI-API-compatible, so no new SDK needed).
- Added `scripts/output/` to `.gitignore` — test scripts write generated story drafts there; never commit generated erotica drafts.
- New file: `scripts/test-openrouter-scorching.ts` — standalone script, takes no args, generates one sample story per candidate model using the same prompt shape and Scorching heat guidance as `app/api/admin/generate-story/[id]/execute/route.ts`, saves each to `scripts/output/`. Safe to rerun any time; doesn't touch the production DB.

### Candidates researched (pulled live from OpenRouter's `/api/v1/models`, not from training memory — my knowledge cutoff is Jan 2026 and it's Sep 2026 now, so the catalog has moved on)
- `anthracite-org/magnum-v4-72b` — trained specifically to mimic high-end prose quality with refusal training stripped out. **This is the one we're pursuing.**
- `sao10k/l3.3-euryale-70b` — well-regarded for explicit creative writing, cheapest capable option. **Untested** — OpenRouter's upstream provider returned `429` (overloaded) on every attempt tonight. Worth retrying tomorrow, may just have been transient capacity.
- `cognitivecomputations/dolphin-mistral-24b-venice-edition` ("Venice: Uncensored") — tested, **ruled out**. Despite the branding it undershot the word count badly and wrote almost no explicit content — the opposite of what we wanted.

### Magnum v4 72B — iteration log
1. **First run**, `temperature: 1` (matching the Claude config): genuinely explicit, crossed the line Claude won't — but prose was glitchy (corrupted tokens, gibberish strings, a swapped character name mid-scene). Cut off before finishing (hit `max_tokens: 6000`).
2. **Second run**, `temperature: 0.8`, `max_tokens: 9000`, added "no corrupted text" instruction: prose came out clean, but the model **stopped itself** (`finish_reason: stop`, not a token cutoff) right before the explicit scene began — built all the tension, then ended at 976 words.
3. **Third run**, `temperature: 0.9`, added explicit "do not stop, wrap up, or fade to black once the scene starts" instruction: worked — clean prose, real explicit content, complete story with proper epilogue. This became the settings used for the reliability batch below.

### Reliability batch — 5 runs at temperature 0.9, same prompt (Contemporary, enemies-to-lovers/forced-proximity, 3,000 target words)
Saved in `scripts/output/batch/run-1.txt` through `run-5.txt`. Read all 5 in full (an automated keyword-scan first pass missed real problems — don't trust it, read the actual text).

| Run | Words | Explicit content | HEA ending | Notes |
|---|---|---|---|---|
| 1 | 2194 | Present, one scene, fairly restrained | Yes, resolved | **POV bug** — drifts into first person for 2 paragraphs, then back to third. Mislabeled "EPISODE:" instead of "EPILOGUE:" (typo, doesn't break parsing) |
| 2 | 1457 | Present, several scenes | Ambiguous/open-ended, not a confirmed reunion | Softer ending than spec asks for |
| 3 | 2173 | Strong, explicit throughout | **No** — ends on an unresolved business-rivalry cliffhanger | Best prose of the batch, but fails the HEA requirement outright |
| 4 | 1843 | Strong, explicit | Yes, resolved (marriage + pregnancy epilogue) | Response starts with a stray **"Here is the requested romance story:"** preamble before `TITLE:` — Claude never does this |
| 5 | 2721 | **Weak** — mostly a vague fade-to-black flashback, not an on-page scene | **No** — ends on doubt/conflict | Effectively failed both the explicitness and HEA requirements |

**Bottom line:** the garbled-text problem is solved (none of the 5 batch runs had it — lower temperature + explicit "don't stop" instruction fixed that). But two new reliability problems showed up that Claude doesn't have:
- **No/ambiguous happy ending in ~40% of runs** (2/5 clearly, arguably 3/5) — this directly breaks the genre promise (HEA is a hard requirement, not a nice-to-have, for a romance platform).
- Occasional formatting artifacts (chat-style preamble text, one POV slip).

Not ready to wire into production as-is. Cost isn't the blocker — Magnum is ~$0.04-0.05/story even before accounting for retries, still cheaper than Claude's ~$0.08/story ceiling.

---

## Next steps for tomorrow

Decided: build **option 2**, a validation + retry gate, rather than just hardening the prompt further (prompt tweaks alone won't get to 100% reliability with any model).

1. **Design the validation check** — after generating a Scorching-tier story via OpenRouter/Magnum, before saving it: check the ending has a clear HEA (e.g. keyword/pattern check near the end, or a cheap second LLM call to classify it), and check the story actually contains real explicit content (not just a fade-to-black flashback).
2. **Wire in retry logic** — on a failed check, regenerate once (maybe twice) before giving up; decide what happens if it still fails after retries (fall back to Claude for that generation? Fail and let the user retry manually like any other failure?).
3. **Retry the Euryale 70B test** — got rate-limited (`429`) every attempt tonight; may be worth having as a second option or fallback if it's more reliable once its capacity issue clears.
4. **Decide where this lives in the code** — `app/api/generate-story/[id]/execute/route.ts` and `app/api/admin/generate-story/[id]/execute/route.ts` both have their own `generateStoryContent` function with the heat-level prompt; the OpenRouter path should probably branch inside both (or get extracted into a shared helper) only when `heatLevel === 'Scorching'`, leaving Sweet/Warm/Hot on Claude untouched.
5. Once the gate is built and passing reliably in local testing, test the *real* execute route end-to-end (not just the standalone script) before considering this done.

**Reminder — still open from last session:** Bug #2 (generation stuck at `PENDING` forever on the normal signup→generate flow) is untouched and still needs the `waitUntil()` fix. See `SESSION-NOTES-2026-08-29.md`.

## Files touched this session
- `scripts/test-openrouter-scorching.ts` (new) — 3-model comparison script
- `.gitignore` — added `scripts/output/`
- `scripts/output/**` (gitignored, local only) — generated test story drafts, safe to delete/regenerate anytime
