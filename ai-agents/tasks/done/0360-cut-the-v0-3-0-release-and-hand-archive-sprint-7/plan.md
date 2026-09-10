# Implementation plan — task `0360`: cut v0.3.0 and hand-archive Sprint 7

## Baseline (measured by the planner at HEAD `5ed0b91`)

- `git status --short`: two modified doc files only — the driver's `🔄 In progress` status flips on
  `sprint-7.md`'s `P12` row and `0360`'s brief, plus the two corrected `sprint-7.md` rows.
- `VERSION` = `0.2.2`, `package.json` = `0.2.2`, newest tag `v0.2.2` (annotated).
- Minor lands on **v0.3.0** (`bumpPart` in `bin/release.mjs`).
- `git log origin/main..HEAD` empty — nothing unpushed today.
- `push.followTags` unset (the script's documented assumption holds).
- `test/reference-integrity.test.js` baseline **GREEN, 20/20** — 875 files, 3386 targets, **0 broken**,
  7 named-exempt. This is the before-baseline the archive is compared against.
- Board = 15 rows: 13 done, 1 cancelled, **1 in progress (`0360`)**.
- `dashboard.sh select-active ai-agents/sprints` → `active file="sprint-7.md"`, exit 0.

## Three defects in the brief's own steps, measured

| Brief says | Measured reality |
|---|---|
| step 1: `npm run release:minor` | ⛔ **It PUSHES.** `doPush = !has("--no-push")`; `release:minor` is `node bin/release.mjs --minor` with no such flag. Run literally it does `git push origin main` **and** `git push origin v0.3.0`. |
| the tag's *"message names Sprint 7 and the measurement-anchor purpose"* | ⛔ **Unreachable through the script.** It hardcodes `git tag -a <tag> -m "Release v<version>"`. `-m/--message` sets the **commit** message only. |
| `npm run release:dry` | ⛔ **Dry-runs a PATCH, not the minor.** It is `node bin/release.mjs --dry-run` — no `--minor`. It would plan **v0.2.3**. |
| step 7's grep: `Moved to [Sprint 7](sprint-7.md)` → zero hits | ⛔ **Passes while 3 broken links remain in `backlog.md` alone**, plus 29 more across 12 closed task briefs and 1 cancelled one. Real surface: **36 link instances across 14 files**. |

## `sprint-7.md`'s 91 links, fully accounted for

Measured through the guard's exported `maskFencesAndQuotes` / `maskCodeSpans` / `LINK`.

| Class | Count | Repair |
|---|---|---|
| `](../…)` | 75 (69 guard-visible + 6 masked) | → `](../../…)` |
| `](backlog.md)` | 13 (12 visible + 1 masked) | → `](../backlog.md)` |
| `](done/sprint-6.md)` | 1 (**masked**, blockquote) | → `](sprint-6.md)` |
| `](sprint-7.md)` self-refs | 2 (1 visible, 1 masked) | **none** — both resolve to `done/sprint-7.md` after the move |

⚠️ **`test/reference-integrity.test.js` masks blockquotes and code spans — it cannot prove 8 of the 91**,
including the one link whose repair is not the mechanical rule (`done/sprint-6.md` → `sprint-6.md`,
inside a blockquote). **Green is necessary, not sufficient.**

## The 36 inbound instances that break

`ai-agents/sprints/backlog.md` 7 · `0360/brief.md` 6 · `0361/brief.md` 5 · `0347/brief.md` 3 (1 masked) ·
`0355/brief.md` (cancelled) 2 · `0176` 2 · `0237` 2 · `0354` 2 · `0358` 2 · `0352` 1 · `0353` 1 ·
`0356` 1 · `0357` 1 · `0359` 1.

All take `](../../../sprints/sprint-7.md)` → `](../../../sprints/done/sprint-7.md)`, except
`backlog.md`'s `](sprint-7.md)` → `](done/sprint-7.md)`.

Repointing hrefs inside **closed** records is the sanctioned treatment, not a rewrite: `/fkit-task-done`'s
own rule for a closed plan is *"re-point the href, change nothing else"*, and the owner's 2026-08-29
ruling put closed folders **in scope** for exactly this.

## Guard risks cleared by measurement

- `sprints/done/` floor is 5; the archive takes it 6→7.
- `NAMED_EXEMPT`'s 7 keys touch neither file.
- `closed-rank-immutability` watches `sprints/done/` **by basename, deliberately**, so the archival
  rename is transparent to it.
- The two `sprint-7.md` self-links stay resolvable after the move.
- `sprint-7.md` contributes **zero** citation-policy hits, so leaving that scanned set costs `total`
  nothing.

## Throughput — the figure the banner reports

Re-measured by the planner at HEAD `5ed0b91`; **matches the driver's relay exactly**:

```
totals created 382 closed 270
open 112
repair 23
repair-pct 20.5
repair-excluding-source-defects 20
repair-excluding-source-defects-pct 17.9
exception 0215 / 0234 / 0334  repairs-source-defect
```

Baseline at anchor `a9c2709`: **open 129, repair 45 (34.9%), excl-source-defects 42 (32.6%)**.

⛔ **Sprint 7's success criterion is a record-repair share under 10%. Measured 20.5%. THE SPRINT MISSES
IT.** ⛔ Do not adjust, round, reframe, or bury this. The brief requires *"the real number, met or
missed"*.

⭐ **W36 (14 created / 20 closed) and W37 (7 / 28) are the first two weeks where closes exceed
creations.** Every prior week created more than it closed.

---

# The plan

## Phase 0 — freeze the baseline (no writes)

1. `git status --short`, `git rev-parse HEAD` — record.
2. `node --test test/reference-integrity.test.js` — record **0 broken / 7 named-exempt / 875 scanned**
   as the before-baseline.
3. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-7.md` — record, paste.
4. `node claude/skills/fkit-status/throughput.mjs` — record now; re-measure at the release commit later.

## Phase 1 — the release (⛔ nothing pushed)

5. **Dry run, correctly:** `npm run release:minor -- --dry-run`. Report output verbatim. (~6 min: the
   gate runs `npm test` even under `--dry-run`.) Confirm it names **v0.3.0**.
6. **Real run:** `npm run release:minor -- --no-tag --no-push` — bumps `VERSION` + `package.json` to
   `0.3.0`, `git add -A`, commits `"Release v0.3.0"`, **creates no tag and pushes nothing**. Expected
   summary: `⚠ NOT released — nothing was pushed, no tag created` / `v0.3.0 is committed locally only.`
   - `git add -A` will sweep in the two in-progress status flips and the two corrected rows. Expected
     and stated.
7. **Create the annotated tag by hand**, with the message the brief requires:
   `git tag -a v0.3.0 -m "<names Sprint 7 + the measurement-anchor purpose>"`. **Local only.** No secrets.
8. Verify: `node -p "require('./package.json').version"` → `0.3.0`;
   `git tag -l --format='%(objecttype) %(refname:short)' v0.3.0` → **`tag v0.3.0`** (annotated, not
   `commit`); `git tag -n99 v0.3.0`; `git log origin/main..HEAD` → shows the release commit is **local**.
9. Re-run `throughput.mjs` at the release commit; that is the figure the banner reports.

## Phase 2 — the archive

10. Flip `0360`'s row on `sprint-7.md` to `✅ Done (agent-closed — not owner-verified)`, then re-run
    `dashboard.sh ai-agents/sprints/sprint-7.md` and paste it — the brief's step-5 zero-open-rows
    evidence, taken **before** the move.
11. **Write the archival banner** into `sprint-7.md` (still at its live path), directly under the H1,
    mirroring Sprint 6's shape. Content, in full:
    - `🔒 CLOSED — 2026-09-08`, archived by the fkit lead's sprint ship-loop.
    - ⭐ **Unlike Sprint 6's, this archival DOES carry an owner ruling** — *"Hand-archive again, with the
      caveat (Rec)"*, 2026-08-29 — **and it is still agent-performed and NOT owner-verified**, per the
      same ruling. Both halves, stated separately; Sprint 6's banner said *"NO owner ruling authorizing
      it"* and copying that sentence here would be false.
    - Row standing: **15 rows — 14 done `(agent-closed — not owner-verified)`, 1 `⛔ Cancelled` (`0355`,
      `P5`, rank gap deliberate)**. Every close agent-performed; owner ruled *"Archive as agent-closed
      (Rec)"* 2026-09-07. **A done row and a cancelled row are reported as different facts.** No status,
      no rank, no renumbering changed (ADR-035).
    - **Success criterion: MISSED.** Target *"under 10% of open work"*. Measured at the release commit,
      2026-09-08: **repair 23 of 112 open = 20.5%**; **excluding source-defect repairs (`0215`, `0234`,
      `0334`) 20 of 112 = 17.9%**. Baseline as ruled 2026-08-29: **42 of 129 = 32.6%**, with the board's
      own correction that the denominator was already **138** that day. Says which figure the script
      reproduces and why. **No rounding, no reframing.**
    - ⭐ **W36 (14 created / 20 closed) and W37 (7 / 28) are the first two weeks where closes exceed
      creations.** Every prior week created more than it closed.
    - `v0.3.0` cut with an annotated tag as the measurement anchor; **committed and tagged locally,
      unpushed — the push is the owner's.**
    - The successor clause per ruling **Z4** below.
    - The archival's own link repair, with counts.
12. **Move:** `git mv ai-agents/sprints/sprint-7.md ai-agents/sprints/done/sprint-7.md`.
13. **Repair the moved file's links** by the four rules in the table above. Applied by an explicit script
    over link *targets* only — ⛔ **never a blind text `sed`**: the string `sprint-7.md` appears in prose
    and code spans throughout, and corrupting those is the failure mode. Verify: 75 `](../../`,
    13 `](../backlog.md)`, 1 `](sprint-6.md)`, 2 `](sprint-7.md)` untouched; **91 links accounted for,
    before = after**.
14. **Repair the 36 inbound instances** across the 14 files listed above. `backlog.md`'s form →
    `](done/sprint-7.md)`; all others → `](../../../sprints/done/sprint-7.md)`. Link targets only.
15. **Re-run the masked-link resolver by hand** over the moved file and confirm all 9 guard-invisible
    links resolve on disk — the guard cannot do this and ⛔ **must not be presented as if it had**.

## Phase 3 — proof

16. `node --test test/reference-integrity.test.js` → **0 broken**, named-exempt still **7**, scanned still
    > 800. ⛔ Green or the archive is not done.
17. `node --test test/coordination-citation-policy.test.js` → residual `[]`, `total > 120`, `visited > 500`.
18. `node --test test/closed-rank-immutability.test.js` → green (it watches `sprints/done/` by basename by
    design; this proves no closed rank moved and the banner introduced nothing parsed as a board row).
19. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/done/sprint-7.md` — zero open rows.
20. `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` — report output **and
    exit code**. Expect `active none` / **exit 3**. ⛔ No Sprint 8 opened to make it non-empty.
21. `grep -rn '](sprint-7.md)' ai-agents/sprints/backlog.md` → zero; and the full-repo resolver re-run →
    **zero** links resolving to the old path.
22. `git diff --stat -- ai-agents/wiki-vault/` → empty.
23. `npm test` → full suite + `prove-red.sh`. Report counts. (~6 min; third gate run.)
24. `git status --short` — the archive is **uncommitted**, left for the owner.
    `git log origin/main..HEAD` — nothing pushed.

## Phase 4 — hand off

25. Driver relays the evidence packet; **the driver spawns `@fkit-producer`** to run `/fkit-task-done` on
    `0360` (movers are producer-only, ADR-033). The producer is told the board row is **already**
    `✅ Done` and the board now lives at `ai-agents/sprints/done/sprint-7.md`.
26. Owner pushes: `git push origin main && git push origin v0.3.0`. ⛔ Never the loop.

**Runtime: ~20 min of test gates alone** (dry-run gate, release gate, final `npm test`).

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-08

Given live via `AskUserQuestion` in this `fkit lead` session. Option labels recorded **verbatim**.
These bind the Build and Process-review workers.

| # | Question | Owner ruling (verbatim option label) | What it settles |
|---|---|---|---|
| **Z0** | Approve this plan as written? | Approved via the seven rulings below; the plan above is the approved plan. | ⛔ Every step above stands as written **except** where a ruling below narrows it. |
| **Z1** | D1 — `npm run release:minor` PUSHES, and cannot write the required tag message. | **"`--no-tag --no-push`, hand-tag (Rec)"** | ⭐ Run **`npm run release:minor -- --no-tag --no-push`** — bump + local commit only. Then **create the annotated tag by hand** with a message naming Sprint 7 and the measurement-anchor purpose. ⛔ **The literal brief step-1 command is NOT run — it pushes `main` and the tag.** ⛔ Nothing is pushed; the push is the owner's. |
| **Z2** | D2 — `0360` is `🔄 In progress` on the board it archives. | **"Flip the row by hand before the move (Rec)"** | ⭐ **Flip `0360`'s row to `✅ Done (agent-closed — not owner-verified)` by hand, BEFORE the move**, as part of the hand-archive. ⭐ **The banner must disclose that the row performing the archival flipped itself.** The producer's later `/fkit-task-done` then finds the row already Done. ⛔ Options (b) archive-open and (c) close-first are NOT taken. |
| **Z3** | D3 — 36 broken link instances across 14 files, 29 of them inside closed/cancelled task briefs. | **"Repair all 36 (Rec)"** | ⭐ **Repair all 36. Href only — change nothing else**, per `/fkit-task-done`'s own rule for a closed record, and the owner's 2026-08-29 ruling putting closed folders in scope. ⛔ **No `NAMED_EXEMPT` additions** — exemptions are for refused-repoint quotations, these are live pointers, and adding any would break the pinned `namedExemptCount === 7`. ⛔ No follow-up-task deferral: that would hand off a RED suite. |
| **Z4** | D4 — does Sprint 7's banner name a successor? | **"Omit, and state the omission (Rec)"** | ⭐ **Omit the successor clause, and say in the banner that it is omitted and why** — no Sprint 8 exists, and naming one ships a dangling link (`0294`: *"Not recommended without an explicit ruling"*; Sprint 6's banner did the same). ⭐ **State that the omission establishes no convention.** |
| **Z5** | D5 — does Sprint 6's banner gain a successor clause pointing here? | **"Leave Sprint 6 byte-identical (Rec)"** | ⛔ **`ai-agents/sprints/sprint-6.md` is NOT touched. Not one byte.** ⭐ The board's standing open question — *"STILL OPEN — does Sprint 6's banner gain a successor clause pointing here?"* — is now **ANSWERED: no**, by this ruling. ⭐ **Mark it answered in the archived board's open-questions section, dated 2026-09-08, quoting this option label** — an archived board must not carry a live question nobody can act on. |
| **Z6** | D6 — two frozen quotes of `backlog.md` rows go stale when the archive re-points those rows. | **"Annotate, don't rewrite (Rec)"** | ⭐ **Leave both quotes byte-identical; add one dated (2026-09-08) annotation** beside them stating the archival re-pointed `backlog.md`'s markers. The repo's *annotate, never rewrite* precedent (`0306`, carried by `0176`/`0237`). ⛔ **Do not rewrite the quoted text.** |
| **Z7** | D7 — release precedes archive, so tag `v0.3.0` does not contain the archive. | **"Keep the brief's order (Rec)"** | ⭐ **Release first, then archive** — the brief's explicit, owner-derived order. The anchor is a **dated point in history**, which it remains. ⭐ The archive is the part that could red a guard, so proving it separately from the release gate is the honest split. ⚠️ **Consequence, accepted and to be stated in the banner: the archive is left UNCOMMITTED for the owner, and the anchor sits one commit before the sprint's closing commit.** |

## ⭐ Standing corrections to the brief, carried by these rulings

⛔ **Three of the brief's own steps are defective and are NOT followed literally** — measured by the
planner, ruled by the owner at Z1/Z3:

1. **step 1's command pushes** → replaced by Z1's `-- --no-tag --no-push` plus a hand-made annotated tag.
2. **`npm run release:dry` dry-runs a PATCH** (`v0.2.3`), not the minor → use
   `npm run release:minor -- --dry-run`.
3. **step 7's grep proves almost nothing** — it passes with 32 broken links standing → replaced by Z3's
   full 36-instance repair and the Phase-3 resolver re-run.

⚠️ **A guard passing is not proof the archive is correct.** `test/reference-integrity.test.js` masks
blockquotes and code spans and **cannot see 8 of `sprint-7.md`'s 91 links** — including the one whose
repair is not the mechanical rule. Phase 2 step 15's by-hand resolver run is **not optional**, and its
result must be reported separately from the guard's.
