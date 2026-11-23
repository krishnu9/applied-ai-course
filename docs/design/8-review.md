# Stage 8 — Final review

Date: 2026-11-23
Product: lastminute.dev
Reviewer: `review` (build wave 12, unit U7)
Scope: every PRD user story, the eight definition-of-done items, goals G1–G5, the content bar,
safety, hygiene, accessibility and visual craft. Production export and dev server.
No project file was edited.

## Verdict

**SHIP WITH NOTES.**

No P0 issue. No factual or content-bar violation. The product meets the three moments, all
four routes, the six lessons, the spine, both widgets and the disclaimer. The build is green.
One P1 goal miss (G1 click budget) and eight P2 notes are recorded below.

| Severity | Count |
| --- | ---: |
| P0 | 0 |
| P1 | 1 |
| P2 | 8 |

No P0 functional miss. F2 and F3 are P2 polish inside P0 stories. The shell, state change and
reload behavior pass. The home route has no separate nav item by the PRD's own decision, so the
missing logo marker is a small improvement, not a failed flow.

## Criteria table

Verdicts: PASS, PARTIAL or FAIL. "Note" names a recorded issue.

### Build, safety and hygiene

| ID | Criterion | Verdict | Evidence |
| --- | --- | --- | --- |
| BUILD-1 | `CONTENT_VALIDATE=1 npm run build` passes | PASS | Exit 0. Next 16.4.6 compiled 12 static pages. TypeScript passed. |
| BUILD-2 | `npx tsc --noEmit` passes | PASS | Exit 0. |
| BUILD-3 | `out/` has `/`, `/roadmap`, `/about`, six lessons, `404.html` | PASS | Present: `index.html`, `roadmap.html`, `about.html`, `404.html`, `lessons/{evaluation,prompt-contract,retrieval,agents,fine-tuning,cost}.html`. |
| CONSOLE | Zero console errors and hydration warnings | PASS | Production: zero script and page errors. Dev: zero hydration messages on 10 routes at 1440 and 390. One expected browser resource log for the intentional 404 document. |
| NET | No external request at runtime | PASS | All request hosts were `localhost:4173` (prod) and `localhost:3000` (dev). Zero external hosts. Zero failed requests. |
| SECRET | No secret, no `.env` value | PASS | Only `.env.example` exists, text "No environment variables are required." Source grep found no key or token value. |
| STORAGE | No `localStorage` outside `lib/progress/storage.ts` | PASS | Grep of `app`, `components`, `lib`, `content` found no other use. No `fetch`, XHR or URL outside content in source. |
| LINKS | No broken internal link | PASS | Nine unique internal links fetched. All returned 200. |

### User stories

| ID | Criterion | Verdict | Evidence |
| --- | --- | --- | --- |
| US-01 | Landing: H1, promise, 41%, sample label, mapping, button opens lesson 1 | PASS | At 1440 and 390: exact H1, promise, "Pass rate 41%", "Sample evaluation. Fixed data.", four mapping rows, link href `/lessons/evaluation`, click reached that URL. Note F4 on the split phrase. |
| US-02 | Header and footer on every route; current route `aria-current`; disclaimer | PASS | Four routes at 1440 and 390: wordmark, Roadmap, About and footer disclaimer present. `aria-current="page"` on `/roadmap`, `/about`, lesson spine and lesson breadcrumb. `/` has none (F2). |
| US-03 | Search (P2): built, or removed from header | PASS | Search cut. Header has zero search inputs, links or buttons at 1440 and 390. |
| US-04 | Retrieval lesson: H1, outcome, "About 25 minutes", six-lesson tree, loop order | PASS | At 1440 and 390: exact H1, outcome sentence, meta row, six spine links, current "Retrieval" marked, Read→Check→Build→Prove order. |
| US-05 | TOC at 1280: H2 links, active `aria-current="true"`, click scrolls and focuses | PASS | Eight links matched eight section IDs. Active count 1. Click moved scrollY 0→3670 and focused `#check-the-ranking`. At 390 the sheet click also scrolled and focused the heading. |
| US-06 | Code block: filename, Copy, sample output, Copied 2 s, failure copy, 390 scroll | PASS | Filename `eval/run_eval.py`; Copy→Copied; clipboard text 533 characters; revert after 2.2 s. Forced failure showed "Copy failed. Select the code." At 390 the pre was 356 px wide with 671 px content, `overflow-x:auto`; page 390/390. |
| US-07 | Previous and next, course ends named | PASS | Lesson 1 "Start of the path" with no previous link. Lesson 6 "End of the path" and "Open the roadmap" to `/roadmap`. Evaluation next to `/lessons/prompt-contract`; prompt-contract previous to `/lessons/evaluation`. Reproduced at 390. |
| US-08 | Unknown lesson: 404 status and SCR-00 copy and links | PASS | `/lessons/unknown-topic` returned 404. H1 "This lesson does not exist.", "Check the URL or open the roadmap.", "Back to course" → `/`, roadmap link → `/roadmap`, header and footer kept. Label difference F5. |
| US-09 | Correct answer: "Correct.", 2+ sentences, mark, others disabled, reload | PASS | "Correct." with a 2-sentence explanation. Chosen option marked "Correct answer". Other radios disabled. Verdict and explanation returned after reload. |
| US-10 | Wrong answer: "Not quite.", named idea, Try again, no pre-submit mark, reload | PASS | Before submit: no mark, Submit disabled. Wrong choice: "Not quite." plus explanation, "Try again". Retry re-enabled the radios and kept the explanation. Wrong verdict returned after reload. |
| US-11 | Task: 0 of 5, 5 of 5 unlocks, solution opens with Hide, ticks persist | PASS | Counter "0 of 5 steps done"; solution disabled. Five ticks gave "5 of 5 steps done"; solution enabled and opened with "Hide". Reload restored 5 checked boxes. Reproduced at 390. |
| US-12 | Prove note: placeholder, save message, reload, blank keeps repair disabled | PASS | Placeholder "I changed X; the result was Y."; maxlength 280; save message "Proof saved on this device."; note returned after reload. With checks and ticks complete, a blank note kept the button disabled and the note enabled it. Wording note F6. |
| US-13 | Progress survives reload; home count and ledger; reset clears | PASS | Repair gave "1 of 6 layers repaired"; ledger "Repaired"; both survived reload. Roadmap reset returned the header to 0 and all rows to "Not started". Reproduced at 390. A green dot plus "Repaired" is used instead of a tick glyph. |
| US-14 | Resume: last lesson and article position | PASS | No saved position showed "Start with lesson 1". After reading agents, home showed "Resume: Agents with a stop rule" and href `/lessons/agents#check-the-stop`. Open placed the section at top 71.8 px under the header. Reproduced at 390. |
| US-15 | Storage blocked: banner and session-only operation | PASS | Exact banner text at 1440 and 390. Four routes rendered. A check returned "Correct." and a task tick held for the session. |
| US-16 | Spine: six ordered dots, state, pass, cost, p95, sample label | PASS | Six links in course order at 1440 and 390. Each showed Broken/Repaired, Pass 41%, Cost $0.94 / 1k, p95 2.4 s. Label "Sample evaluation. Fixed data." inside the block. |
| US-17 | Repair transition: red node opens lesson, green dot, 58%, $0.71, 1.4 s, reload, count | PASS | Red dot computed `rgb(163, 42, 30)`. One click opened `/lessons/retrieval`. Repair gave `rgb(30, 107, 69)`, "Repaired", Pass 58%, Cost $0.71 / 1k, p95 1.4 s. Reload kept them; header 0→1. No numeral roll (F3). |
| US-18 | Retrieval explorer: query, 12 docs, ranked rows, refund first, clear state | PASS | Three preset buttons. "refund policy" produced ranks 1–3 with 0.91/0.74/0.61, "Source: doc-07/08/02". All 12 documents opened. A cleared query showed "Choose a sample query." and kept three presets. "zzz" showed the exact no-results copy. |
| US-19 | Cost calculator: inputs, defaults, 10x traffic, invalid input, sample label | PASS | Defaults 10000/1000/250/0.75 gave $0.94, $281.25, 2.40 s. 100000 requests gave $2,812.50 monthly and $0.94 per 1k; "Sample" badge stayed. 0 and "abc" showed "Enter at least 1 request." and three "—" results. Copy note F7. |
| US-20 | Roadmap: six rows, states, title, time, outcome, link; stack at 390 | PASS | H1 "The path", six ordered rows, six links, states Done/In progress/Not started, times and outcomes. At 390 rows used a 2-track grid, title links 44 px high, no page scroll. |
| US-21 | About: disclaimer, stack, footer disclaimer | PASS | About shows disclaimer, "Next.js, TypeScript, Tailwind CSS, no backend, no login, no live model calls", and "Progress stays in this browser." Footer disclaimer on all four routes. |
| US-22 | 390/768: no horizontal scroll; spine strip; code box; 768 column and TOC | PASS | Five routes at 390 and 768 had `scrollWidth === clientWidth`. Spine 130 px × 3 columns at 390 and six columns at 768. Code pre scrolled inside. At 768 main grid was one 720 px column and the TOC sat below the article. |
| US-23 | Keyboard: skip link, 2 px rings, arrows, Space, Escape | PASS | First Tab reached "Skip to content"; Enter focused `#main`. 90 Tab stops across two pages all had 2 px solid rings. ArrowDown moved to option-b and selected it. Space selected a radio and ticked a task. Escape closed the phone TOC and returned focus to its toggle. |
| US-24 | Reduced motion: no dot travel, no number roll, no transition over 100 ms | PASS | `--dur-trace` and `--dur-number` computed 0 s. Maximum transition and animation duration was 0.01 ms. The trace element ended without travel. |

### Definition of done

| ID | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| DoD-1 | Build passes; `/` at 1280 with no console error | PASS | Build exit 0. Home at 1280 had zero script and page errors. |
| DoD-2 | Hero promise and 41%; six dots; red Retrieval dot opens lesson | PASS | Promise true, 41% true, six dots, red node `rgb(163, 42, 30)`, click opened `/lessons/retrieval`. Phrase note F4. |
| DoD-3 | Wrong answer shows "Not quite."; correct shows "Correct." | PASS | Wrong produced "Not quite." with explanation. Retry and correct produced "Correct." |
| DoD-4 | Task 5 of 5; solution opens; note saved message | PASS | "5 of 5 steps done", solution visible, "Proof saved on this device." |
| DoD-5 | Repair turns Retrieval green: 58%, $0.71, 1.4 s | PASS | Node text "Repaired / Pass 58% / Cost $0.71 / 1k / p95 1.4 s"; dot `rgb(30, 107, 69)`; header "1 of 6 layers repaired". |
| DoD-6 | Reload returns tick, note and Resume card | PASS | After reload: home "1 of 6 layers repaired", ledger "Repaired", "Resume: Retrieval that earns its keep". Opening it returned the exact note and five ticks. |
| DoD-7 | Evaluation start; cost end; unknown slug 404 copy | PASS | "Start of the path", "End of the path" plus "Open the roadmap", "This lesson does not exist." with status 404. |
| DoD-8 | Blocked storage banner; course works; 390/768 no scroll; focus ring | PASS | Exact banner and working check. 390 and 768 `scrollWidth === clientWidth` on home and lesson. Tab reached "Skip to content" with a 2 px ring. |

### Goals

| ID | Goal | Verdict | Evidence |
| --- | --- | --- | --- |
| G1 | Lesson 1 complete with one note, under 3 minutes, at most 8 clicks | PARTIAL | Marked repaired with one note in 2.5 s of automation. Measured mouse path was 11 clicks: start, 2 option + 2 submit, 5 ticks, repair. Budget is 8 (F1). |
| G2 | Every lesson has the full loop | PASS | Six lessons: 2/2/3/2/2/2 checks = 13. Every explanation had 2 sentences. Every lesson had a 5-item task, a solution and one prove field. |
| G3 | "The Run" in one click | PASS | One click on the red node opened lesson 3. Repair moved pass 41→58, cost $0.94→$0.71 and p95 2.4→1.4 s. |
| G4 | Work survives reload; private context is empty | PASS | Tick, note, green node, count and position returned after reload. A fresh private context showed 41%, $0.94, 2.4 s, "0 of 6", "Broken" and no Resume link. |
| G5 | Widgets return fixed answers | PASS | Retrieval: refund policy→doc-07 0.91, billing→doc-02 0.88, late delivery→doc-05 0.92. Cost: $0.94, $281.25, 2.40 s. |

### Content, visual, accessibility, safety

| ID | Criterion | Verdict | Evidence |
| --- | --- | --- | --- |
| CONTENT | Original text; one citation per lesson; no book figures; disclaimer; sample labels; consistent numbers | PASS | Six lessons each had exactly one citation line naming "AI Engineering by Chip Huyen". All six code blocks carried "Sample output. Fixed data.". Three original flat SVG diagrams. Disclaimer in footer and About. Numbers agree: 74 minutes, 41/49%, 58%/$0.71/1.4 s, $0.94/$281.25/2.40 s, retrieval order doc-07/08/02. |
| VISUAL | Three moments; spine story; paper and ink; no card grid, gradient or chat box | PASS | Mapping visible on home; check verdict visible with amber panel; reload restores work. Fixed spine rail with hairline and state words. Zero gradients, zero box shadows, zero images, serif prose with mono figures. Ledger and mapping are hairline rows. |
| A11Y | Skip link, one h1, rings, labels, keyboard, contrast, 200% zoom | PASS | One h1 on every route; landmarks banner/nav/main/complementary/contentinfo; all controls labelled; no skipped heading level; 90 focus stops with 2 px rings; text contrast 5.00–16.70, focus 8.60, functional borders 3.59. 200% text at 390 had no horizontal scroll. Hairline note F8. |
| RESP | Phone and tablet layout | PASS | 390: 3×2 spine strip, TOC sheet, 56 px action bar, 44 px effective targets. 768: six-column strip, one text column, TOC below content, action bar hidden. 320: no small targets beyond native controls inside 44 px labels. |

## Failures

| # | Severity | Criterion | Symptom | Owner | Minimal fix |
| --- | --- | --- | --- | --- | --- |
| F1 | P1 | G1 click budget | The shortest mouse path to complete lesson 1 measured 11 clicks. The goal allows 8. Completion took 2.5 s of automation. The 3-minute goal also conflicts with a 10-minute reading lesson if reading time is counted. | PRD goals and lesson flow | Revise G1 to count primary actions or allow 12 interactions. Or measure from the first action and state that reading time is excluded. |
| F2 | P2 | US-02 current route | `/` has no `aria-current="page"`. Roadmap, About and lesson routes have it. | `components/shell/SiteHeader.tsx` | Add `aria-current={pathname === "/" ? "page" : undefined}` to the wordmark link. |
| F3 | P2 | US-17 number roll | Score values change instantly. The `.score-in` CSS class exists but no component uses it. | `components/home/RunPanel.tsx`, `components/shell/SpineNode.tsx` | Apply the number animation on a value change. Keep the reduced-motion guard. Or remove the roll promise from the PRD and concept. |
| F4 | P2 | US-01 / DoD-2 "41% pass" | The home shows a "Pass rate" label and a separate "41%" value. The contiguous phrase "41% pass" does not appear. | `components/home/RunPanel.tsx` or PRD copy | Render "41% pass" as one string in the run panel. Or accept the split label and value. |
| F5 | P2 | US-08 link label | The 404 page shows "Open the roadmap". US-08 says "View roadmap". SCR-00 says "Open the roadmap". | `app/not-found.tsx` or PRD copy | Align the story and SCR-00. The code follows SCR-00. |
| F6 | P2 | US-12 save copy | US-12 says the note saves with "Saved". The product shows "Proof saved on this device." per PRD section 4. | PRD copy | Align the story to section 4. The code follows section 4. |
| F7 | P2 | US-19 error copy | US-19 says "Enter a number above 0." The product shows per-field text "Enter at least 1 request." HLD and LLD resolve this. US-19 also says 10x traffic updates "both"; the correct behavior keeps cost per 1k fixed and scales monthly cost. | PRD copy | Align the story to the resolved per-field messages. State that cost per 1k does not depend on traffic. |
| F8 | P2 | Line contrast | The decorative hairline `#D9D3C7` measures 1.40:1 on paper. The PRD says lines must reach 3:1. Functional borders use `#8A8271` at 3.59:1. | Design tokens, `app/globals.css` | Darken the hairline for "lines" or limit the 3:1 rule to functional boundaries and focus. |
| F9 | P2 | Header progress on phone | At 390 the header shows compact "0/6". PRD section 3 says "N of 6 layers repaired". The full sentence is available only to assistive technology. | `components/shell/HeaderProgress.tsx` or PRD copy | Show the full sentence at 390, or accept the compact form in the PRD. |

## Open notes

- Accepted deviations:
  - The course tree marks a repaired lesson with a green dot and the word "Repaired", not a tick glyph. This is clearer for colour-blind readers.
  - Native radio and checkbox controls are 16 px inside 44 px labels. The label is the touch target.
  - The spine rail is 128 px, not the PRD's 88 px. The QA wave raised it to stop mid-word breaks.
  - At 768 the TOC sits below the content, per US-22. HLD section 7 said a 240 px side TOC. The story wins.
  - The 404 document logs one browser resource error because the route is a real 404. Script and page errors are zero.
- Content clarification:
  - The retrieval proof example names the broken order (doc-08 at rank 3). The widget shows the expected repaired order (doc-08 at rank 2). The lesson explains both orders. This is not a contradiction.
- Risks:
  - The fixed phone action bar can sit over a control that happens to be at the viewport bottom. Scrolling clears it. Consider hiding the bar while any control behind it has focus.
  - On static hosting, the host must serve `404.html` for unknown paths. Vercel does this. A file server needs a fallback rule.
  - The PRD line-contrast rule fails on decorative hairlines. WCAG 1.4.11 applies to required boundaries, so this is not a WCAG failure for panels.
  - The run score is the repaired pair of the highest-order repaired layer, not a cumulative score. An out-of-order repair can hide an earlier layer's numbers. The code documents this model and the values stay deterministic.
- Suggested next steps:
  - Fix F2 and F3. Both are small and visible.
  - Align the PRD and story copy with the shipped strings (F4–F7).
  - Revise G1 or add a keyboard path that meets the 8-click budget.
  - Add the review harness to the repository so the next wave can rerun it.
  - Verify the static 404 fallback on the chosen host.
  - Lighthouse targets were not measured. The PRD lists them as intentions.

## Evidence

### Commands

- `CONTENT_VALIDATE=1 npm run build` — PASS, exit 0, 12 static pages.
  The first attempt reported a concurrent build lock. The rerun passed.
- `npx tsc --noEmit` — PASS, exit 0.
- `node /tmp/lm-qa/server.mjs` — static export server on `http://localhost:4173`.
- `node /tmp/lm-qa/review-desktop.mjs` — 43 checks, all pass except G1 (PARTIAL).
- `node /tmp/lm-qa/review-mobile-dev.mjs` — 12 checks, all pass.
- `node /tmp/lm-qa/review-mobile-interactions.mjs` — 14 checks, all pass.
- Raw results: `/tmp/lm-qa/review-desktop.json`, `/tmp/lm-qa/review-mobile-dev.json`,
  `/tmp/lm-qa/review-mobile-interactions.json`.

### Routes and widths

- Routes: `/`, `/roadmap`, `/about`, six lesson pages, `/lessons/nope`, `/lessons/unknown-topic`.
- Widths: 1440, 1280, 768, 390. Touch targets also at 320.
- The production export and the dev server both passed.

### Screenshots

- `/tmp/lm-qa/review-home-1440.png`, `review-home-390.png`, `review-home-full-390.png`
- `review-lesson-retrieval-1440.png`, `review-lesson-retrieval-390.png`, `review-lesson-768.png`
- `review-roadmap-1440.png`, `review-about-1440.png`, `review-404.png`
- `review-widget-explorer-rank.png`, `review-widget-explorer-1440.png`
- `review-widget-calculator-1440.png`, `review-mobile-widget-explorer.png`,
  `review-mobile-widget-calculator.png`
- `review-check-wrong-1440.png`, `review-check-correct-1440.png`
- `review-spine-repaired.png`, `review-mobile-repaired-home.png`
- `review-storage-banner-390.png`, `review-toc-390.png`
- `review-focus-ring.png`, `review-diagram.png`, `review-zoom200-390.png`

### Network log summary

- Production: every request host was `localhost:4173`.
- Dev: every request host was `localhost:3000`.
- External hosts: 0. Failed requests: 0.
- Console: zero script and page errors. One expected "Failed to load resource: 404" line for the
  intentional `/lessons/nope` document.
- Hydration: no "did not match" or hydration warning in the dev console.

### Measured accessibility values

| Pair | Ratio |
| --- | ---: |
| Ink on paper | 16.70 |
| Muted on paper | 6.76 |
| Muted on surface | 6.26 |
| Success on success background | 5.56 |
| Warning on warning background | 5.00 |
| Danger on danger background | 5.88 |
| Accent on paper | 8.60 |
| Focus ring on paper | 8.60 |
| Functional border on paper | 3.59 |
| Decorative hairline on paper | 1.40 |
