# Worklog — `0339`: teach the lead, producer, ship-loop and READMEs the sprint lifecycle

**Built by:** a spawned `fkit-coder` — the **Build worker** of `/fkit-sprint-ship-loop`, driven by a
live `fkit lead` session.

**Standing approval:** the owner approved `plan.md` on **2026-09-12** via `AskUserQuestion` in the
driver session, option label verbatim **"Approve — build it (Rec)"**. That approval is this worker's
**scope boundary** as well as its permission. ⚠️ It is **trust, not proof** — the marker is prose in
the driver's spawn prompt, not a verifiable token, and this worker cannot check it from its own
context.

**Date:** 2026-09-13.

---

## What was built

Plan steps 1–13, all of them. 17 files intended; **18 touched** — see decision D2.

| # | File | What it got |
|---|---|---|
| 1 | `ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md` | **NEW.** The live convention page: four statuses, the line-3 banner grammar, the by-position rule, the authority split, location, the definition of "current sprint", the single-board rule, the one resolution path, links |
| 2 | `claude/scaffold/ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md` | **NEW.** The de-fkit-ified twin — no ADR links, no `🔒 CLOSED` compat rung, "starting convention, yours to amend" frame, plus the hook-hardening paragraph the sibling's scaffold copy carries |
| 3 | `test/dual-home-parity-exceptions.mjs` | New `audience-adapted` entry for the new path, placed next to its sibling `task-status-vocabulary.md` |
| 4 | `ai-agents/knowledge-base/conventions/dual-home-parity.md` | New path added to the audience-adapted row's brace list |
| 5 | `ai-agents/knowledge-base/conventions/README.md` | New row in *What's here* |
| 6 | `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` | New row, and *"Eight conventions ship with the scaffold"* → *"Nine"* |
| 7 | `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` | Forward reference *"which ADR-047 names and a separate task writes"* replaced by a live relative link |
| 8 | `claude/scaffold/…/task-status-vocabulary.md` | Same, as a link |
| 9 | `claude/structure-spec.md` | Table B row for the new file (alphabetical, between `priority-is-rank-not-identity.md` and `status-report-format.md`), and *"the **nine** files … plus **eight** conventions"* → *"**ten** … **nine**"* |
| 10 | `test/structure-check.test.js` | `EXPECTED_ROWS` 49 → **50**, its `19 Table A dirs + 30 Table B files` comment → `31`, and the `conforming=49` summary regex → `50` (D2) |
| 11 | `claude/structure-manifest.tsv` | Regenerated — **79 entries**. Run **after** the last `claude/scaffold/` byte change (R3) |
| 12 | `claude/agents/fkit-lead.md` | Plural-active definition + the selector command at the end of *What you can do here*; a new *Hard rules* bullet forbidding by-eye / highest-numbered selection; pointer to the new page |
| 13 | `claude/agents/fkit-producer.md` | Two sites — the `initialPrompt:` folded scalar (active **plans**, plural, resolved by the selector), and *Ground yourself before answering* beat 2 (the *"list the folder and find the active one"* clause deleted and replaced) |
| 14 | `claude/skills/fkit-sprint-ship-loop/SKILL.md` | Three sites, wording only — the `$ARGUMENTS` rule (empty = the selector's `board` line), step 1's read, and a new opening-report bullet naming the chosen board, its `reason=`, and any other active sprints not being driven |
| 15 | `ai-agents/README.md` | `sprints/` cell — four statuses in a line-3 banner, `done/` and `cancelled/`, movers-only, the page link, and the upgrade **consequence** sentence |
| 16 | `claude/scaffold/ai-agents/README.md` | Same, audience-adapted pair (no byte-parity) |
| 17 | `claude/skills/fkit-task-brief/SKILL.md` | One word inside step 8's fenced Backlog-board template: *"never eligible as **the** active sprint"* → *"**an** active sprint"* |
| 18 | `.claude/` mirror | Refreshed via `bash claude/fkit-claude-init.sh .` — 7 agents, 28 skills. Gitignored; never hand-edited |

**Not touched, deliberately:** `ai-agents/sprints/sprint-8.md`, `ai-agents/sprints/backlog.md`,
`ai-agents/wiki-vault/` (the brief routes ADR-041's vault page to `fkit-wiki`), `plan.md` (the
driver's, never re-authored), and every task file's location. **Nothing was committed.**

### The status glyphs — where they came from

⛔ The driver's spawn prompt carried the plan's status table with **placeholder tokens**
(`<DONE MARKER>` and friends) in place of the emoji, and the legacy banner as the bare word `CLOSED`.
Those placeholders were **not** written to any file. The real glyphs were copied from **ADR-047 §1's
own table** — `🔲 Backlog`, `🔄 In progress`, `✅ Done`, `⛔ Cancelled` — and the legacy form from §2,
`🔒 CLOSED`. Cross-checked against live data: `ai-agents/sprints/sprint-8.md` line 3 carries
`> ## 🔄 In progress — 2026-09-10.`, and all seven boards in `ai-agents/sprints/done/` carry the
`> ## 🔒 CLOSED — <date>.` legacy form. **No glyph was invented and no placeholder shipped.**

---

## Decision log — what was applied without asking, and why it qualified

Standing approval covers a fix that is verified `CORRECT`, mechanical/localized, and **inside the
approved plan**. Two calls were made under it. Both are recorded so a wrong one is findable.

### D1 — the manifest regen and the mirror refresh were run, in that order

- **Answers:** plan steps 7 and 13, and risk **R3**.
- **What changed:** `claude/structure-manifest.tsv` (79 entries) and the gitignored `.claude/` mirror.
- **Why it qualified:** both are explicit numbered steps of the approved plan. Ordering — regen
  **after** the last `claude/scaffold/` byte change — is the plan's own R3 instruction, followed
  literally.

### D2 — a SECOND hard-coded row count in `test/structure-check.test.js`

- **Answers:** plan step 7, whose stated surface was `EXPECTED_ROWS = 49 → 50`.
- **What changed:** the `assert.match(r.out, /# summary: conforming=49 …/)` regex in the
  *scaffold-verbatim project* test → `conforming=50`, plus that file's `19 Table A dirs + 30 Table B
  files` comment → `31`.
- **Why it qualified:** **verified `CORRECT` by measurement, not by reading.** The targeted run reded
  on exactly this assertion with `actual` reporting `conforming=50` and `expected` matching
  `conforming=49`; the same run's inventory rows listed the new file as `conforming`. It is the
  identical deliberate bump the plan authorized, stated a second time in the same file — mechanical,
  one token, and inside the plan's intent. Bumping the literal was preferred to deriving it from
  `EXPECTED_ROWS`: that refactor would be a shape change the plan did not describe. **Recorded as the
  one place measurement contradicted the plan's stated change surface** (17 files → 18 sites, the
  extra one inside a file already in scope).

**No other fix was applied without asking. No obvious-winner call was made.** One item is being
returned to the owner instead of decided here — see *Surfaced, not decided* below.

---

## Decision log — round 1 review processing (Process-review worker, 2026-09-13)

A **second** spawned `fkit-coder`, the **Process-review worker** of the same driver, acted on review
round 1 (findings **R1–R7**) under the same standing approval. The owner had already ruled every
finding's disposition live via `AskUserQuestion` on 2026-09-12, so all three fixes below are
**inside** both the approved plan and an explicit ruling. Recorded per ADR-019's audit obligation.

### D3 — R1, the scaffold page's false sprint-identity claim

- **Answers:** review finding **R1** (medium), under owner ruling *"Fix all three in 0339 (Rec)"*.
- **What changed:** `claude/scaffold/ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md`
  — *"A **sprint identity** is what the plan's H1 resolves to, and nowhere else"* → *"…what the
  **selector resolves for a plan file**, and nowhere else."*
- **Why it qualified:** verified `CORRECT` by reading `resolve_identity` in
  `claude/skills/fkit-status/dashboard.sh`, not by trusting the finding — it is a three-rung ladder
  (H1 → filename stem → `backlog.md` basename), so the old sentence was false at rungs 2 and 3 and was
  contradicted by the page's own later paragraph. One sentence, one file, no behaviour: mechanical and
  localized, and the owner ruled it fixed here.

### D4 — an obvious-winner call inside D3: point at the selector, do not name the rungs

- **The call:** the reviewer's suggested shape pointed at the selector; the alternative was to spell
  the three rungs out in the page, since the ladder is what makes the old claim false.
- **Chose pointing.** It dominates: writing the identity grammar into prose is **precisely the defect
  R4 flags in the same review**, and precisely what this page's own *"The recognizer has exactly one
  implementation, in `dashboard.sh`. Do not re-state the grammar anywhere else"* forbids. Pointing is
  true, removes the self-contradiction, and stays de-fkit-ified (no ADR link, *"the selector"* is the
  page's existing vocabulary). Within the plan's intent — the page must be true and consumer-safe.

### D5 — R2, the unsourced Sprint 5 story in the live page

- **Answers:** review finding **R2** (low), same owner ruling.
- **What changed:** `ai-agents/knowledge-base/conventions/sprint-status-vocabulary.md`'s motivating
  blockquote — the *"inferred from the highest-numbered filename … stayed \"active\" for weeks"*
  sentence replaced by ADR-047 §Context's own sourced wording: selection read **location** only, so
  every top-level board was treated as live, *"which is why a finished Sprint 5 kept being reported as
  active until a hand-scoped task moved it."*
- **Why it qualified:** verified `CORRECT` on **both** halves independently — ADR-047 attributes the
  failure to depth-1 location-only selection, and the duration is **one day**, not weeks
  (`sprint-5.md` line 3 reads `> ## 🔒 CLOSED — 2026-08-13.`; the 2026-08-14 triage report records
  *"Sprint 5 was archived on 2026-08-14"*). Plan step 1 required *"Content, all of it sourced (no
  invention)"*, so this restores a stated plan requirement. **The scaffold copy was deliberately left
  untouched** — the reviewer flagged its generic framing as faithful to the owner's own report.

### D6 — R4, the ship-loop's self-contradicting `$ARGUMENTS` rule

- **Answers:** review finding **R4** (low), same owner ruling.
- **What changed:** `claude/skills/fkit-sprint-ship-loop/SKILL.md` — dropped the restating
  parenthetical *"(the lowest-ordered `🔄 In progress` sprint, or an `⭐ ACTIVE BOARD` override;
  `reason=` says which)"*, leaving *"**empty = the selector's `board` line — the single chosen
  board**."* No other rewording was needed.
- **Why it qualified:** verified `CORRECT` by diffing against `HEAD` — the pre-change line **pointed**
  rather than restated and was self-consistent with the retained *"Do not re-derive that rule here"*;
  this task's own edit created the contradiction. **It is therefore a regression this change
  introduced**, caught by the round-1 regression check. Deleting one parenthetical is mechanical and
  localized. Nothing was lost: the loop's opening-report beat still requires naming *"the selector's
  `reason=` for it"*, and the adjacent plural sentence was kept because it states the loop's scope,
  not the selection grammar.

### Not fixed, by explicit owner ruling — no discretion exercised

**R3 + R5** → one shared *Accepted residual* recorded in `review.md` covering the `claude/` vs
`.claude/` path class (ruling *"Residual + one sweep task (Rec)"*). **R6** → folded into `0389`
(ruling *"Fold into 0389 (Rec)"*). **R7** → its own follow-up (ruling *"File a follow-up (Rec)"*).
⛔ **No task was filed by this worker** — producers carry all three in parallel. All three were
confirmed present on disk on 2026-09-13 (`0389`, `0390` the path-form sweep, `0391` the root-README
follow-up) and their ids were written into the ledger so each residual and routed row names a real
target — **reading and citing them, not creating them.** ⚠️ One measurement
correction recorded in the R3 row: the repo-only path-form class is **7** sites at `HEAD` across
**three** sprint skills becoming **8**, not the reviewer's *"8 … across the four sprint skills … adds
a 9th"*. Off by one in both counts, immaterial to the ruling.

**No other fix was applied, and no other obvious-winner call was made, in review processing.**

### Verification of the review-round fixes — measured 2026-09-13, after D3–D6

| Check | Result |
|---|---|
| Targeted: `structure-check`, `structure-spec`, `structure-manifest`, `dual-home-parity`, `reference-integrity`, `skill-frontmatter`, `coordination-citation-policy` | **120/120 pass, 0 fail** — the stated baseline exactly |
| `npm run test:unit` | **963/963 pass, 0 fail**, 24 suites — baseline exactly |
| `reference-integrity` | Scanned **911** files, 3558 link targets, **0 broken**, **7 named-exempt** — the pinned count holds after both ledgers were rewritten |
| `coordination-citation-policy` | **RESIDUAL 0 across 0 files.** This task's `review.md` and this worklog are scanned and NOT exempt; every coordination-document citation in both is a **quoted fragment**, never `path:NNN` |
| `npm test` (full, chaining `test/prove-red.sh`) | **PASSED** — closing line `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.` All **34/34** mutations red, including 33 and 34 (the task movers' `targetIsBack` delete rule and board-word swap) |

⚠️ **Honest scope of the gate reading:** the run was piped through `tail`, so baselines `0a`–`0k`
scrolled off and only `0l`–`0o` were seen line-by-line. The gate's own closing assertion — which it
prints only on success — is the evidence for the rest, not fifteen individually observed lines.

**Ordering followed:** `npm run generate:manifest` was re-run **after** the R1 scaffold edit (the only
scaffold byte changed this round), then `bash claude/fkit-claude-init.sh .`. ⭐ **Verified the manifest
holds the SCAFFOLD copy's sha256 for the dual-homed page**, not the live copy's: manifest row
`98bb0123…` equals the scaffold file's digest, while the live copy hashes to `a5992ee2…` and appears
nowhere in the manifest — reversing them would make every consuming project's installed file report as
owner-edited to `/fkit-heal`. The generator sources only from `claude/scaffold/`, by construction.

⛔ **Nothing was committed or pushed. No task file was moved. No task was filed.**

---

## Verification — measured, not asserted

Run on 2026-09-13, in this order.

| Check | Result |
|---|---|
| Targeted: `dual-home-parity`, `structure-check`, `structure-manifest`, `structure-spec`, `reference-integrity` | **71/71 pass, 0 fail** (first run: 70/71, the D2 assertion — green after the bump) |
| `npm run test:unit` | **963 pass, 0 fail**, 24 suites, 81.1s — the baseline exactly |
| `reference-integrity` | **22/22.** Scanned **906** files, resolved 3534 link targets, **0 broken**, **7 named-exempt** — the pinned count holds |
| `coordination-citation-policy` | **21/21** |
| `mover-exemption-step` | **24/24** |
| `skill-frontmatter` | **28/28** — the producer's `initialPrompt:` folded scalar still parses (R2) |
| `rules-block-budget` | **3/3** — untouched by design |
| `structure-check` `EXPECTED_ROWS` | **50**, not 51. One row added, as intended (R7) |
| `npm test` (full, with `test/prove-red.sh`) | **PASSED, exit 0** — 963/963 unit, then the hard gate: 15 baselines green (`0a`–`0o`) and **all 34 mutations red their NAMED assertion** |

**The plan's own greps, step 7:**

- `grep -rn -i "current sprint\|active sprint" claude/agents/fkit-lead.md` → **3 hits**; the block
  names the selector, says plural, and points at the page.
- `grep -c "find the active one" claude/agents/fkit-producer.md` → **0**.
- `grep -rn -i "highest"` across the six files → **no line states the highest-N rule.** Every hit is
  either a negation of it (lead ×2, producer ×2) or unrelated priority/ID prose in
  `fkit-task-brief/SKILL.md`.

**Step 8 — the live selector, after the mirror refresh:**

```
active file="sprint-8.md" identity="Sprint 8" status="In progress"
board file="sprint-8.md" identity="Sprint 8" status="In progress" reason="lowest-ordered"
```
exit **0**, unchanged.

**§G — the two-In-progress substitute.** The brief's step 6 asks for a live `fkit lead` dry run against
a two-active fixture; no such fixture exists, this repo has one active sprint, and a Build worker
cannot open an interactive session. Substitute run, in the **scratchpad, never in the repo**: a
throwaway `sprints/` tree holding a copy of `sprint-8.md`, a copy of `backlog.md`, and a minimal
`sprint-9.md` whose line 3 reads `> ## 🔄 In progress — 2026-09-13.`

```
active file="sprint-8.md" identity="Sprint 8" status="In progress"
active file="sprint-9.md" identity="Sprint 9" status="In progress"
board file="sprint-8.md" identity="Sprint 8" status="In progress" reason="lowest-ordered"
```
exit **0** — **two `active` lines, exactly one `board` line**, `reason="lowest-ordered"`. That is the
property the new lead / producer / ship-loop prose tells a reader to trust. ⚠️ The interactive
`fkit lead` run remains available to the owner as a **confirmation, not the gate**.

**Full gate.** `npm test` (which chains `test/prove-red.sh`) was run **once, at the end**, deliberately
not per-iteration. Measured result: **exit 0**, closing line
`✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.` Mutations
**33** and **34** — the two that exercise the task movers' `targetIsBack` delete rule and board-word
swap — are the ones nearest this change's blast radius, and both red correctly.

---

## Surfaced, not decided — one item for the owner

**The `dual-home-parity.md` mirror's entry count was already stale before this change, and this change
makes it staler.** The convention says *"The mirror is COMPLETE as of 2026-08-01: all 26 module
entries appear above — 16 file entries and 10 directory entries"*, and it instructs *"If you add an
entry to the module, add its row here in the same change."*

Measured 2026-09-13: the module held **27** entries (**17** files) **before** this task, and **28**
(**18** files) after. The pre-existing gap is one `live-only` entry, `.fkit-accepted-drift`, which has
**no row in the mirror table at all** — added by earlier work without the mirror row the convention
requires.

⛔ **Not fixed here.** Adding an unrelated path's row and restating the count is **outside the approved
plan**, and the count sentence cannot be made true without also adding that missing row. **No test
pins the number**, so nothing is red because of it. Returned to the driver as a `NEEDS-DECISION` for
the owner: fix it in this change, or file it as its own task.

---

## Notes for the reviewer

- **Two driver deviations were declared in the spawn prompt and are recorded here so they can be
  weighed.** (1) The plan was carried **pointer-only**, not pasted — read from disk with `Bash(cat)`
  and hash-verified against the driver's stated pointer before any edit; the file is 329 lines /
  22,782 bytes and `cat` reported no truncation. (2) `plan.md` on disk is **not** byte-verbatim: the
  driver substituted placeholder tokens for the status glyphs. Per the spawn instruction `plan.md` was
  left exactly as the driver wrote it — placeholders included.
- **Citations in this file are by quoted fragment, never by `path:NNN`** (risk R5): this worklog sits
  under `ai-agents/tasks/backlog/` and is scanned by `coordination-citation-policy`, with no exemption.
- **The lock question was not escalated**, on the plan's recorded precedent: running
  `dashboard.sh` is a `Bash` call, not a `Skill` call, so the ADR-018 hook never sees it, and a
  lead-owned skill already instructs the driver to run that script directly. The brief's *"raise
  separately if judged to breach the lock's intent"* therefore does not fire.
- **The movers' internal step order is deliberately absent** from both new pages (R6). ADR-047 warns
  that the sprint movers *invert* the task movers' order; nothing on a vocabulary page needs it, so
  omitting it removes the trap.
- **Path form** is `.claude/skills/fkit-status/dashboard.sh` on both new pages and in the two agent
  files, matching `fkit-status/SKILL.md`; the ship-loop's own edit keeps that file's existing
  `claude/skills/…` form rather than introducing a second style mid-file. The repo-wide mix of the two
  forms is pre-existing and **out of scope — flagged, not fixed**, exactly as the plan directs.
