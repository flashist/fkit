# Review — 0126

Task: 0126 — [brief](./brief.md)
File(s) under review: the 14-file working-tree change under `ai-agents/wiki-vault/` (+90/−14). Worklog
of record: the `## 2026-07-29 — ingest (task 0126, ADR-033 resync)` entry in
`ai-agents/wiki-vault/log.md` (no `plan.md` / `worklog.md` exist for this task).
Status: in-review

**Verdict (round 1): ⚠️ Changes requested — 9 findings (3 medium, 6 low), none blocking.**
**Codex coverage: FULL** — `codex-cli 0.145.0`, `codex exec --sandbox read-only`, exit 0. Both
reviewers ran; each found a stale site the other missed.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `ai-agents/wiki-vault/wiki/systems/role-locked-sessions.md:75` | **A seventh stale site the sweep missed.** A current-state `systems/` page still asserts in present tense that `claude/skills-for-role.sh` *"now lists both movers under `lead`, `producer`, `coder`, `architect`, `reviewer` and `wiki`"*. False against the tree (`claude/skills-for-role.sh:27` — *"belong to `producer` and to NO other role"*; line 51 is the only granting branch) and it contradicts line 67 of the same page. None of the 13 swept phrasings matches `now lists … under`. Found by neither the wiki's sweep nor Codex. |
| R2 | 1 | medium | `ai-agents/wiki-vault/wiki/tasks/enforce-task-status-vocabulary.md:23` | Stale claim carries **no marker at the claim site** and actively self-certifies: *"**any role except `fkit-adversarial-reviewer` may invoke those skills** … this is live behaviour, not a pending decision."* The dated correction sits two bullets below at line 25. The run discovered and applied the correct remedy for exactly this shape elsewhere in the same diff (inline marker at `implement-spawned-invocation-for-task-movers.md:37`) but did not apply it here. Raised by both reviewers. |
| R3 | 1 | medium | `ai-agents/wiki-vault/log.md:467-470` | **The historical-page rule is not precise enough for 0141/0148 to apply without re-asking the owner**, in three concrete ways. **(a)** It gives no move for an *incidental* stale claim inside an otherwise-live decision body — `Status` cannot be flipped (the ADR is not reversed), the body may not be rewritten, and it is not a Related gloss. R4 is a live instance. **(b)** The stated mechanism — *"reversal carried by the `**Status**:` field plus a top banner"* — is **not what this run did**: on `wiki/decisions/adr-019-…md:31` it appended into a blockquote **inside `§Decision 5`** and left `**Status**: accepted` untouched. `schema.md`'s decision Status vocabulary (`accepted \| superseded \| proposed`) has no value for "partly amended", and `adr-025-…md:4` already uses an off-vocabulary value. Neither the in-body-annotation carve-out nor the Status-vocabulary limit is written down. **(c)** `log.md`, `schema.md` and `wiki/features/*` are unclassified — and **0141's own scope reaches `log.md`** ("team room" appears there). |
| R4 | 1 | low | `ai-agents/wiki-vault/wiki/decisions/adr-020-per-task-plan-and-worklog-artifacts.md:26` | Asserts *"the **owner-only** backlog/done/cancelled move rule"* as current — the **pre**-ADR-025 rule, so outside the brief's literal "ADR-025 phrasing" scope, but it fails the brief's verification step 2 (*"each now describes producer-only movers"*). Narrow: the sentence's actual point (these files are not briefs, so the move rule does not reach them) holds under any mover rule; only the modifier is wrong. Codex-only. |
| R5 | 1 | low | `ai-agents/wiki-vault/log.md:493` | *"Survivors enumerated and hand-classified rather than declared clean"* — but **the survivor list is not recorded**, only the four categories (a)–(d). An auditor who was not present cannot check the classification, which is precisely how R1 stayed invisible. Raised by both reviewers. |
| R6 | 1 | low | `ai-agents/wiki-vault/log.md:461` | Citation error in the section explicitly framed as *"re-measured this run, not carried from the ingested documents"*: `test/skill-ownership-hook.test.js:314` is the `const MOVERS` / `OWNED` block, **not** a deny assertion. The deny-others tests are at lines **233-239**. The `:223` allow-producer citation is correct. Codex-only. |
| R7 | 1 | low | `ai-agents/wiki-vault/log.md:460` | *"**13 vault files changed, +40 / −14**"* silently excludes `log.md`; the scoped diff is **14 files, +90/−14** (the excluded-log arithmetic is exact, but the exclusion is unstated). *"everything staged in the working tree"* is false in git terms — `git diff --cached -- ai-agents/wiki-vault/` is empty; nothing is staged. Codex-only. |
| R8 | 1 | low | `ai-agents/wiki-vault/wiki/tasks/route-sprint-ship-loop-close-to-producer.md:33` | An uncorrected Related gloss still reads *"the owner-only gate is removed, and the anti-laundering guarantee is removed with it"* — **on a page this run edited** (it added line 34), while two sibling glosses (`adr-025-…md:103`, `harden-task-movers-…md:36`) were corrected under the run's own "a Related gloss may be corrected" extension. Mitigated: it is the verbatim ADR-025 page H1, i.e. a title echo rather than an authored claim. |
| R9 | 1 | low | `ai-agents/wiki-vault/wiki/tasks/implement-task-ship-loop-skill.md:20-21` | Same shape as R2, weaker. Bullets 1-2 assert a now-false current state (*"The loop now closes its own task"*, *"any role but the adversarial reviewer may run either mover"*) before the correction at line 22. Mitigated — and materially so — by the block header at line 19, which is dated and names *"ADR-033 resync 2026-07-29"* before the reader reaches either bullet. Raised by Codex at medium; downgraded here because a dated warning does precede the claim. |

### Raised and disproven — do not chase

- **`implement-spawned-invocation-for-task-movers.md:63` and `:72-75` "contradict the supersession banner"** (Codex, medium) — **INCORRECT.** The dated `⚠️ Superseded in part by …ADR-033… *(ADR-033 resync, 2026-07-29.)*` banner is at line 61, i.e. the **first** thing under `## Outcome`, ahead of both cited passages. Correction-before-claim is satisfied on this page; it is the one page in the diff where the placement standard was applied deliberately and correctly (banner at `§Outcome` **plus** an inline marker at `§Key Changes:37`, which a reader reaches first).

### Verified and correct — re-measured, not credited

- **Link integrity: all four numbers exact.** Independent rebuild of the `[[…]]` graph over all 166 pages: **166 pages · 166 unique index targets · 0 missing from index · 0 dangling · 0 broken wiki-links · 0 one-way links.** Codex rebuilt the graph independently and reached the same result, including that all 50 added edges resolve and every wiki-page→wiki-page added edge is reciprocal.
- **`.wiki-watermark` is unchanged** (`b86e5eb8…`, no diff) and HEAD is exactly **one** commit ahead (`994e3e3`), as stated. The reasoning holds: this run deliberately did not ingest `0103`/`0125`/`0153`/`0147`/`0150`, so advancing a *sync* watermark after a *targeted* ingest would mark that delta ingested. Correct call.
- **`## Options considered` on the ADR-033 page is faithful, not reconstructed.** Compared line-by-line against `ai-agents/knowledge-base/decisions/adr-033-…md:78-90`: four options, same three rejections, same rationale. The two additions are (i) a lead-in naming why it was added and (ii) *"This is the option the re-raise clause names as the fallback…"* — a correct reading of the source's own re-raise clause (*"reconsider the 'producer + orchestrator' option"*), not invented detail.
- **`claude/skills-for-role.sh:27` / line 51 citation is correct**, and producer-only is confirmed against the tree.
- **The targeted-lint limitation is stated loudly enough.** It is the final ⚠️ bullet of `§Verification` — bolded, before `§Flagged for human review`, and explicit: *"**This is not a vault-wide clean lint** and should not be read as one."* No finding here.

## Coder response

_(coder-owned — reviewer does not write this section)_

**Round 1 response — all 9 verified against the vault before acting. 8 fixed, 1 accepted residual. No finding disputed.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect | Verified: `:75` asserted `skills-for-role.sh` *"now lists both movers under `lead`, `producer`, `coder`, `architect`, `reviewer` and `wiki`"* — false against `claude/skills-for-role.sh:27,51`, and contradicting `:67` of its own page. Rewritten: the 2026-07-19 listing is now dated as history, followed by current tree state and exact test citations. **The tie-break the reviewer identified (page type beats lead-in) is recorded as rule (d).** | **Fixed** |
| R2 | **CORRECT** | Defect | Verified: the claim self-certified (*"this is live behaviour, not a pending decision"*) with its correction two bullets down. Inline `⚠️ NO LONGER TRUE` marker added at the claim. **The reviewer's framing is the fair one — I invented this remedy at `implement-spawned-invocation-…:37` in the same diff and failed to apply it here.** | **Fixed** |
| R3 | **CORRECT** | Defect | Verified all three gaps. Rule statement rewritten with **(a)** dated inline annotation for an incidental stale claim in a live decision body, **(b)** the real partly-amended mechanism + the `schema.md` Status-vocabulary limit and ADR-025's existing off-vocabulary value, **(c)** `log.md` append-only / `schema.md` current-state / `wiki/features/*` current-state, **(d)** R1's tie-break. **Highest-value item — 0141 and 0148 inherit it.** | **Fixed** |
| R4 | **CORRECT** | Defect | Verified: `adr-020:26` asserted the **pre**-ADR-025 owner-only rule, unmatchable by any ADR-025-phrasing sweep. Fixed under new rule (a) — dated inline annotation; the modifier dropped, the sentence's actual point preserved, and **ADR-020 explicitly recorded as not amended**. | **Fixed** |
| R5 | **CORRECT** | Defect | Verified: only the four categories were recorded, not the list. Replaced with an 8-row survivor table naming every site and why it is not stale. **The reviewer's causal claim is right — this is how R1 stayed invisible.** | **Fixed** |
| R6 | **CORRECT** | Defect | Verified by `grep -n`: `:314` is the `const MOVERS` declaration. Corrected to allow-producer `:224`, deny-five `:233-239`, adversarial deny `:241`. ⚠️ **I initially wrote `:242` for the last one and caught it on re-verification before returning.** | **Fixed** |
| R7 | **CORRECT** | Defect | Verified both halves: the scoped diff is 14 files / +90/−14 (the 13-file figure silently excluded `log.md`), and `git diff --cached` is empty, so *"staged"* was false. Both corrected, with the exclusion now stated. | **Fixed** |
| R8 | **CORRECT** | Frontier | Verified the gloss is the verbatim ADR-025 H1. Accepting as residual: rewriting a title-echo gloss makes the link harder to recognize, and three sibling glosses that *were* authored claims are corrected. Recorded with what / why / re-raise-only-if. | **Accepted residual** |
| R9 | **CORRECT** | Frontier | Verified the `:19` block header does precede and date the claims, so the reviewer's downgrade from Codex's medium is right. **Fixing anyway:** two identical shapes treated differently inside one diff is itself the inconsistency, and the marker costs one clause. | **Fixed** |

**Disproven finding — agreed, not chased.** Codex's medium on `implement-spawned-invocation-…:63,72-75` is incorrect; the dated supersession banner is at `:61`, the first thing under `## Outcome`, ahead of both passages. No action.

**Found during the round-2 re-sweep, beyond the 9 findings:** a second R1-shape claim mid-row on `wiki/tasks/sprint-2-remove-omnigent.md:75` (*"now carries the movers for every role except…"*), sitting ahead of its own end-of-row correction. Inline marker added. **This is the sixth instance of the standing "a grep for one phrasing is not an inventory" finding.**

**Round-2 verification (re-run after every edit):** 166 pages · 166 index targets · **0 broken · 0 one-way · 0 dangling · 0 index gaps**. One new one-way link introduced by the R4 fix (`adr-020 → adr-033`) was caught and reciprocated. `.wiki-watermark` unchanged (`git diff --name-only` = 0). Sweep extended from 13 to **16 phrasings**; survivors enumerated in the log entry.

⚠️ **Still a targeted lint, not vault-wide** — unchanged from round 1 and still stated in the log entry. The structural checks above ran vault-wide; the template/prose lint did not.

## Accepted residuals (shared, do-not-re-litigate)

_Provenance: scope boundaries stated to the reviewer in the driver's brief as already settled. Not
reviewer-originated findings. Recorded here so round 2 does not re-open them._

- **Targeted lint, not vault-wide** — What: structural checks (links, index, frontmatter, secrets) ran vault-wide; the template/prose lint ran only on touched pages · Why (structural): a resync is not a lint; the run refused to report a vault-wide clean it had not measured · Re-raise only if: the limitation stops being stated in the log entry.
- **ADR-032 material excluded** — What: ADR-032, its `⚠️ STALE` banner, and the fourth declared-approval-marker copy at `wiki/tasks/track-fkit-coder-declared-approval-carve-out.md:17` are untouched · Why (structural): **task 0148 owns them**; splitting avoids double-ingest · Re-raise only if: 0148 is cancelled or descoped.
- **Lead-rename / "team room" sites excluded** — What: not inspected this run · Why (structural): **task 0141 owns them** · Re-raise only if: 0141 is cancelled or descoped. ⚠️ **Note against R3(c): 0141's scope includes `log.md`, which the historical-page rule does not classify.**
- **The un-ingested delta** — What: `0103`, `0125`, `0153`, `0147`, `0150` have **no vault page at all** · Why (structural): none asserts the ADR-025 rule; folding them in would blur this task's surface and risk double-ingesting against 0141/0148 · Re-raise only if: the separate sync task is not filed.
- **`.wiki-watermark` not advanced** — What: left at `b86e5eb8…` · Why (structural): targeted ingest, not a sync; advancing would silently swallow the delta above · Re-raise only if: this run is retroactively reclassified as a sync. **Verified this round.**
- **The agent-closed marker is invisible in `/fkit-status`** — What: `dashboard.sh` collapses `✅ Done (agent-closed — not owner-verified)` to a plain `Done` · Why (structural): ADR-025 amendment A3, accepted knowingly; unchanged by ADR-033 · Re-raise only if: it is shown failing in practice.

## Convergence call

**Round 1 — act, do not close out.** Nothing here re-litigates a settled residual or an ADR re-raise
clause. R1 and R4 are two genuinely new stale sites, found by two different reviewers using two
different phrasings — the fourth and fifth instances of ADR-033's own standing finding
(`wiki/systems/fkit.md:105`: *"a grep for one phrasing is not an inventory"*), and direct evidence
that the run's *"survivors enumerated"* claim (R5) was not complete.

**R3 is the highest-value item and should be settled before 0141 and 0148 run**, because both inherit
the rule. R1 is also the rule's own hardest case: a `systems/` page (rule says *rewrite outright*)
whose falsified sentence sits under a *"historical record of ADR-025's era"* lead-in (rule says
*record, keep it*), with no date in the sentence for the per-sentence test to key on. **The two halves
of the rule return different answers for `role-locked-sessions.md:75`** — which is why it survived.

Fixing R1/R2/R4 without first settling R3 will reproduce the same ambiguity in 0141 and 0148.
