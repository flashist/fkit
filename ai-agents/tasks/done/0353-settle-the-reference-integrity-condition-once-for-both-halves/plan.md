# Plan — 0353: Settle the reference-integrity condition, once, for both halves

**Author:** fkit-architect (spawned Plan worker, no owner channel — ADR-021)
**Date:** 2026-08-29 · **Tree:** HEAD `1f33b95`, working tree dirty (`ai-agents/sprints/sprint-7.md` concurrently edited by a producer worker)

---

## ⭐ OWNER RULINGS, 2026-08-29 — THESE AMEND THE PLAN BELOW

Three rulings given live via `AskUserQuestion` in the `fkit lead` session at the plan-approval gate, after this plan was returned. Option labels are **verbatim**. Where a ruling and the plan text below disagree, **the ruling wins**; the plan text is left byte-identical as the record of what was proposed.

**Ruling 1 — on §1 correction C1.** Label: **"Accept — links in scope, citations exempt (Rec)"**. Presented as: *one principle, two consequences: closed task folders are IN scope for the link guard (pointers rot) and EXEMPT for the citation guard (claims are frozen). Grounded in text already owner-ruled in this repo. Cost: contradicts three briefs, so `0354` and `0355` need re-scoping before they run.*
→ **C1 is accepted in full.** §3 Half A's `tasks/done/**` / `tasks/cancelled/**` "NOT exempt" row stands. §6 escalation E2 is authorized: `0354` and `0355` need producer re-scoping, and the driver routes that.

**Ruling 2 — on §6 escalation E1.** Label: **"Widen to the whole closed folder (Rec)"**. Presented as: *exempt closed `done/` and `cancelled/` folders entirely for the citation half. Residual drops 42 → 12 across 9. Reason: the ruling's intent was that closed records are frozen; naming only `review.md` was a 2026-08-01 approximation of that, made when the gap cost ~2 edits rather than 30.*
→ ⛔ **This AMENDS §3 Half B and the §5 reconciliation table.** The citation half's exemption is **no longer `done/*/review.md` only**: closed `tasks/done/**` and `tasks/cancelled/**` folders are exempt **in whole** — `brief.md`, `plan.md`, `worklog.md` and `review.md` alike. The 2026-08-01 owner ruling 2 is thereby **superseded on this point by a later owner ruling**, not reopened by an agent. ⛔ Record it that way in the condition document: quote the 2026-08-01 ruling, quote this one, and date both. The measured consequence to re-verify at Build: citation residual **42 across 22 → 12 across 9**.

**Ruling 3 — plan approval.** Label: **"Approve, folding in my C1/E1 answers (Rec)"**.
→ The plan below is **approved as amended by rulings 1 and 2**.

⛔ **Everything below this section is the architect's returned plan, byte-identical.** Read it with the three rulings applied.

---

## 0. Bottom line

The condition **can** be settled once — but not as "one rule for both halves". It settles as **one principle with two opposite consequences**, and the principle is already owner-ruled in this repo:

> **A link is a pointer. A `path:` + line-number citation is a claim.**
> Claims in a historical record are frozen. Links in a historical record are not — *"a pointer to a file that is no longer there is not history, it is rot."*

That sentence is not mine. It is `claude/skills/fkit-task-done/SKILL.md` §"A *link* to the brief whose status must NOT change" (verified firsthand this turn), and the same claim-versus-pointer test is the ruling principle of `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`, owner-ruled 2026-08-01 from the `0160` report.

Applied to the two halves it decides every open question in this brief, in **opposite directions**, and each direction is measured below.

⚠️ **Three premises in the briefs are wrong and this plan corrects them.** They are load-bearing — the whole exemption set rests on them — so they are stated before the findings, not in a footer.

---

## 1. ⛔ Three corrections to the briefs' premises — read before approving

### C1. ADR-034 does **not** freeze closed task folders. It never said so.

`0353`'s brief, `0354`'s brief and the driver's framing all cite ADR-034 as the authority for exempting `ai-agents/tasks/done/**` from the link guard. I read it in full. Its own **Scope** line reads:

> *"the close condition of a **stateful review ledger** (`<task-folder>/review.md`). It does not change what a review finds, only when the loop **stops**."*

Its Decision is about when a review loop terminates, and its Consequences **explicitly accept** that *"a closing task's own worklog may carry known low-severity defects."* It says nothing about post-close edits, and it grants no exemption to any guard. **ADR-034 is not the authority for the closed-folder exemption on either half.**

The real frozen-record rule lives in `claude/skills/fkit-task-done/SKILL.md`, and for links it says the **opposite** of what the briefs assume — a hit in a sibling task folder's `plan.md`, `worklog.md` or `review.md`, or in `ai-agents/sprints/reviews/`, is to be repaired: *"re-point the href, change nothing else."*

**Consequence:** the link half's `tasks/done/` exemption has no authority behind it, and the rule that does exist **mandates the repair**. This plan rules those folders **in scope for the link half**. That contradicts `0354`'s brief and `0355`'s premise, so it is an owner-visible change, flagged here.

### C2. The naive-vs-convention-correct spread is mostly **matcher artifact**, not signal — and the settled number is small either way.

I re-measured with **five** independent matcher implementations. The naive figure ranged **180–246** and the settled figure ranged **5–11**, purely on implementation details of "skip code spans" (single-line vs document-level masking). The brief's `304 / 60 / 24 / 17` is a sixth point in the same cloud; I could not reproduce any of the four figures, and I do not think the difference means anyone was wrong.

⭐ **That instability is the real finding.** A condition expressed as prose plus "write a regex" **cannot** be transferred to `0354` without divergence — which is exactly how `0176` (11 across 8) and `0237` (19 across 15) and my own run (42 across 22) came to disagree about the same sentence. **The condition must be settled as one byte-exact matcher, quoted in the document, that `0354` transcribes rather than re-derives.**

### C3. The vault claim checks out, with a number correction.

A naive matcher reports **12** broken links under `ai-agents/wiki-vault/` (the prior producer said 13); a convention-correct one reports **0**. The prior producer's substance was right — every one is inside an inline code span. **The exemption is still required on principle** (ADR-005 — no other role may repair the vault), but no work should be scoped against those.

---

## 2. What I measured, and how

All commands run from the repo root at HEAD `1f33b95` on **2026-08-29**. Scripts were written to the session scratchpad, never to the repo.

### 2a. The citation half — `0176`'s condition, run verbatim

Scanned set `ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md`; literal full-path targets (`ai-agents/sprints/*.md`, `ai-agents/tasks/*/*/brief.md`, `ai-agents/wiki-vault/log.md`) followed by a line number; fenced blocks and blockquote lines skipped; closed `done/*/review.md` exempt.

| Reading | Total | Files | Exempt | **Residual** |
|---|---|---|---|---|
| `0176` verbatim (fences + blockquotes skipped) | 122 | 51 | 80 | **42 across 22** |
| No skipping at all | 123 | 51 | 81 | **42 across 22** |
| ⛔ …**and inline code spans also skipped** | **4** | 4 | 3 | **1 across 1** |
| Scanned set widened to `sprints/done/` + `sprints/reviews/` | 126 | 53 | 80 | **46 across 24** |
| Exemption widened to the whole `done/` + `cancelled/` folder | 122 | 51 | 110 | **12 across 9** |

**Two results decide the half:**

1. `0176` decision 2's convention (skip fences and blockquotes) moves the count by **one** — 123 → 122. The `0160` report's *"changes the count by zero"* claim **still holds**, five days-plus later. Reconciled, unchanged.
2. ⛔ **Skipping inline code spans collapses the citation half from 122 to 4 — a 30× lever that would gut the guard.** Every coordinate in this repo is written inside backticks, because `durable-citation-anchors` is the house style for writing one. For this half, backticks are **formatting**, not quoting.

### 2b. The link half

Scanned `ai-agents/**/*.md`. Relative targets only; `http(s)`, `mailto:`, `tel:`, `data:`, bare `#anchor` skipped; fragment stripped before resolving; elided targets (`…` or three ASCII dots) skipped.

| Matcher | Exemptions | Broken | Files |
|---|---|---|---|
| Naive — code spans and fences counted | none | **180 – 246** (matcher-dependent) | 81 – 95 |
| Fences skipped only | none | 142 – 204 | 69 – 81 |
| Fences + inline code spans skipped | none | 14 – 25 | 10 – 16 |
| ⭐ Fences + code spans + blockquotes skipped | vault only | ⭐ **6 across 4** | — |
| Same, line-level masker instead of document-level | vault only | **5 across 3** | — |
| Same, if closed folders were also exempt (the briefs' assumption) | + `tasks/done/`, `cancelled/`, `sprints/done/` | **1 across 1** | — |
| `ai-agents/wiki-vault/` alone | none | **0** (naive: 12) | 0 |
| `claude/` + `test/` | none | **442 across 4** | — |

**Two results decide this half:**

1. ⭐ **The settled red set is 5–6 instances, not 24 and not 17.** I inspected every survivor by hand. **All of them are quoted or illustrative text** — synthetic fixture rows, a regex written in prose, quoted proposed skill text, an elided example path. My honest reading is that the true in-scope broken-link count is **at or near zero**, and that the residual is dominated by masker edge cases (multi-line inline code spans), not by rot.
2. **440 of the 442 hits under `claude/` + `test/` are in `test/fixtures/`** — frozen fixtures ADR-042 already names as such — and the other 2 are in `claude/scaffold/` **templates whose relative links resolve in the consuming project, not in this repo.** A guard reddening on those is not inconvenient, it is **wrong**.

⚠️ **Drift observed live.** Mid-measurement the naive count moved 245 → 246 and a broken ADR-033 link appeared in `ai-agents/sprints/sprint-7.md` and then disappeared again, from the concurrent producer worker. Every figure above is a snapshot of a moving tree; the document must carry that caveat, and the build spawn must re-run the battery.

### 2c. What I did **not** verify

- **`npm test` was not run by me.** The driver reports 792/792 green with `prove-red.sh` passing; I am relaying that, not confirming it. The build spawn runs it.

---

## 3. The settled condition

### The principle (one, for both halves)

> **A markdown link is a pointer; a `path` + line-number citation is a claim.** Where a construct is a *pointer*, rot is repairable and closed records are **in scope**. Where it is a *claim*, the claim is frozen and closed records are **exempt**. Where a construct appears inside a delimiter, ask what the delimiter does *to that construct*: for links, backticks and blockquotes mean "displayed as text, not offered as a pointer" → **skip**. For citations, backticks are the house form for *writing* a coordinate → **do not skip**.

### Half A — markdown link resolution

| Element | Ruling | Authority |
|---|---|---|
| Scanned set | `ai-agents/**/*.md` | new; nothing prior ruled it |
| `ai-agents/sprints/done/**`, `sprints/reviews/**` | **IN scope** | `fkit-task-done` names both and mandates re-pointing |
| `knowledge-base/reports/`, `decisions/`, `conventions/` | **IN scope** | `0176` decision 1's carve-out protects a *specimen being diagnosed*; a link is not a specimen. Measured cost of exempting reports: **zero** |
| `claude/`, `test/` | **OUT of scope** | 440 of 442 hits are frozen `test/fixtures/`; the rest are `claude/scaffold/` templates that resolve post-install, not here |
| `tasks/done/**`, `tasks/cancelled/**` | ⛔ **NOT exempt** | `fkit-task-done`: *"re-point the href, change nothing else."* ADR-034 grants no exemption (see C1) |
| `ai-agents/wiki-vault/**` | **EXEMPT** | ADR-005; `fkit-task-done` defers to it by name |
| Fenced blocks | **skipped** | `0176` decision 2, carried over |
| Blockquote lines | **skipped** | `0176` decision 2, carried over. ⚠️ Measured blind spot: **11 instances**, mixed quotation and genuine rot. Recorded, not hidden |
| Inline code spans | **skipped** | new ruling, delegated to this task by the brief. A link in backticks is documented marker text, not a pointer |
| `http(s)`/`mailto:`/`tel:`/`data:`/bare `#anchor` | skipped | new |
| Elided targets (`…` or three ASCII dots) | **skipped** | new. `0252-.../brief.md` is prose elision, not a path |
| `path#fragment` | file part resolved; **fragment ignored** | new. Anchor existence is explicitly **out of scope** and named as a future extension |
| Reference-style links (`[a]: url`) | **out of scope**, named | new; none found to matter |

### Half B — `path` + line-number citation of a coordination document

| Element | Ruling | Authority |
|---|---|---|
| Scanned set | `ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md` | `0176` decision 1 — **unchanged** |
| `sprints/done/**` | ⭐ **OUT** — answers `0237` step 3 | Closed boards are historical records; their claims are frozen. Measured cost of including: **+4 residual** |
| `sprints/reviews/**` | ⭐ **OUT** — answers `0237` step 3 | Same reason. Measured cost of including: **0** |
| Target class | literal full path only | `0176` decision 4 / **owner ruling 1, 2026-08-01 — not reopened** |
| Fenced blocks + blockquote lines | skipped | `0176` decision 2 — unchanged. Verified: changes the count by 1 |
| Inline code spans | ⛔ **NOT skipped** | new ruling. Skipping takes 122 → 4 and destroys the guard |
| Closed `done/*/review.md` | **EXEMPT, and only that** | **owner ruling 2, 2026-08-01 — not reopened** |
| `done/*/brief.md`, `plan.md`, `worklog.md` | **NOT exempt** | Same owner ruling, by name. See §6 escalation E1 |
| `knowledge-base/reports/` | **OUT** | `0176` decision 1 — unchanged |
| `claude/`, `test/` | **OUT** | Those three known-stale citations target a *source file*, which is not a coordination document; they fail the target prong regardless of scanned set. `0176` refuses to widen; so does this |

### Measured red set under the settled condition (2026-08-29, HEAD `1f33b95`)

- **Link half: 6 instances across 4 files** (5 across 3 under an alternate masker). All inspected; all read as quoted or illustrative. **True red set plausibly 0.**
- **Citation half: 42 instances across 22 files.** ⚠️ **30 of the 42, across 13 files, sit under `ai-agents/tasks/done/`** in `brief.md` / `plan.md` / `worklog.md`.
- Against the brief's three tabulated readings: **the settled condition matches none of them**, and §2 says why.

---

## 4. Deliverable

**One file:** `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md`

Sections, in order:
1. **The principle** — claim vs pointer, with its two authorities quoted verbatim.
2. **⛔ Corrections C1–C3** — up front, not in a footer.
3. **Half A and Half B condition tables** as in §3 above.
4. ⭐ **The matcher, as one fenced, self-contained, copy-pasteable script per half** — the byte-exact source `0354` transcribes. Not prose, not "write a regex".
5. **The reconciliation table** (§5 below).
6. **The measured red set**, dated, with the exact commands and their output pasted.
7. **Named blind spots**, each with its measured cost: the 11 blockquote instances; anchor existence unchecked; reference-style links; multi-line-code-span masker sensitivity; the shorthand extension (still refused by name).
8. **Escalations E1–E2** (§6).

⛔ **No test file** (that is `0354`). ⛔ **No citation or link cleaned** (that is `0355` / `0237`). ⛔ **Nothing written to `ai-agents/wiki-vault/`.** ⛔ **No `path` + line-number citations anywhere in the document** — a document defining the rule must not ship carrying the violation. ⛔ **`0176`'s and `0237`'s briefs are read, never edited.** ⛔ **`ai-agents/sprints/sprint-7.md` is not touched** (concurrent producer).

---

## 5. The reconciliation table (mandatory — this is what ships)

| # | `0176` scoping decision / `0237` question | Verdict | Authority |
|---|---|---|---|
| 1 | Scanned set = `tasks/*/*/*.md` + `sprints/*.md`; **do not widen to reports** | **Citation half: unchanged.** **Link half: widened** to `ai-agents/**/*.md` incl. reports | `0176` decision 1 preserved for citations; the reports carve-out is specimen-protection and does not transfer to links. Measured cost of the widening: **0** |
| 2 | Skip fenced blocks and blockquote lines | **Unchanged, both halves** | `0176` decision 2. Re-verified: changes the citation count by 1 |
| 2b | *(silent)* Inline code spans | ⭐ **Answered — and the halves diverge.** Link half: **skipped**. Citation half: **not skipped** | New ruling, delegated to this task by `0353`'s brief. Measured both ways |
| 3 | It is red today; shipping red is not an option | **Unchanged**, and the citation figure has grown 11 → 42 | `0176`. Re-measured |
| 4 | 🔒 The reading is **literal** (owner ruling 1, 2026-08-01) | **Unchanged — not reopened** | Owner |
| — | 🔒 Closed `done/*/review.md` exempt, **by name and only that** (owner ruling 2, 2026-08-01) | **Citation half: unchanged — not reopened.** **Link half: does not inherit it — closed folders are IN scope** | Owner ruling preserved for claims; `fkit-task-done` mandates repair for pointers. See C1 |
| — | `0237` step 3 — does the condition reach `sprints/done/*.md`? | ⭐ **ANSWERED: no**, for the citation half. **Yes**, for the link half | Frozen claims vs repairable pointers. Cost of the other choice: +4 residual |
| — | `0237` step 3 — does it reach `sprints/reviews/*.md`? | ⭐ **ANSWERED: no**, for the citation half. **Yes**, for the link half | Same. Cost of the other choice: 0 |
| — | The shorthand extension | **Unchanged — still refused by name** | `0176`; `0353` |
| — | ADR-034 as the closed-folder authority | ⛔ **Corrected — it never granted one** | ADR-034's own Scope and Consequences |

---

## 6. Escalations for the owner — decided by nobody in this plan

**E1. `0176`'s owner ruling 2 now costs 4× what it did when it was made, and the growth is entirely in the surface the owner chose *not* to exempt.** The ruling was given on 2026-08-01 against a measured residual of **11 across 8**. The same condition today measures **42 across 22**, and **30 of them are inside closed `done/` task folders** — including `plan.md`, a file type the ruling did not contemplate (it names `brief.md` and `worklog.md`). Widening the exemption to the whole closed folder would drop the residual to **12 across 9**. ⛔ **This plan does not touch that ruling** — it is the owner's, and `0353` forbids reopening it. It is surfaced so `0237` is not sprung with 30 edits to closed records. **The owner may wish to re-rule before `0237` runs.**

**E2. `0354` and `0355` need re-scoping in light of C1 and C2.** `0354`'s brief instructs exempting `tasks/done/**` on an authority that does not exist, and `0355`'s red set is ~6 instances that all read as false positives rather than the 24 it was scoped against. Both are the producer's to amend, not mine. **Recommend the driver route this to a producer spawn once this plan is approved.**

---

## 7. Verification steps (for the Build spawn)

1. The document exists at `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md`; `git diff --stat` shows **zero** files touched under `ai-agents/wiki-vault/`, `ai-agents/tasks/backlog/0176-*/`, `ai-agents/tasks/backlog/0237-*/`, and `ai-agents/sprints/sprint-7.md`.
2. **Re-run the full measurement battery** at build time and paste command + output into the document. The tree moved during planning; do not inherit §2's figures — reproduce them and report any delta.
3. Every glob and exemption in the document is a **runnable command**; running it reproduces the reported figures. Paste both.
4. The reconciliation table has a row for **each of `0176`'s four scoping decisions** and for **`0237`'s step-3 question**, each with a verdict and an authority.
5. `grep` the document for the decision sentence on `sprints/done/` and `sprints/reviews/` — it must be an **answer**, never "both are defensible".
6. Both halves' red sets reported with instance **and** file counts, dated, and stated against the brief's three tabulated readings — with the explicit statement that the settled condition matches **none** of them, and why.
7. `grep -nE '\.md:[0-9]+' ` over the new document returns **nothing**.
8. `npm test` — report the counts and the `prove-red.sh` gate result. ⚠️ Budget: the full run now exceeds ten minutes; `node --test test/*.test.js` alone is ~85s.

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| ⭐ **C1 contradicts three briefs.** If the owner rejects it, the link half's exemption set inverts and `0355`'s scope changes again | It is the first thing in the document and in this plan. Approve or reject it explicitly before Build runs |
| **The inline-code-span ruling diverges between halves**, against `0353`'s "settle it once" title | Divergence is anticipated by the brief itself (§2 asks whether the halves differ and why). One principle, two consequences, both measured |
| **The matcher is the condition.** Prose plus "write a regex" reproducibly diverges (11 vs 19 vs 42 on the same sentence) | Ship the matcher as byte-exact quoted script; recommend `0354` transcribe, not re-derive |
| **Live tree drift** — a producer is editing `sprints/sprint-7.md` now; counts moved mid-measurement | Every figure carries HEAD + date; Build re-measures |
| **Blockquote blind spot (11 instances)** carried over from `0176` decision 2, some of them genuine rot | Recorded by count and class in §"Named blind spots", the way `0176` recorded its own accepted incompleteness. Not hidden |
| **`0176`'s guard is nearly vacuous if code spans are ever skipped** (122 → 4) | Ruled explicitly and measured, so a later implementer cannot re-derive it the other way by accident |
