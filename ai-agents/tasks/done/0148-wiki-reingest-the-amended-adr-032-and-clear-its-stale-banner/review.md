# Review — 0148

Task: `ai-agents/tasks/backlog/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/brief.md`
File(s) under review: 6 vault content pages + the appended `ai-agents/wiki-vault/log.md` entry (from `## 2026-07-29 — ingest (task 0148, …)`, log.md:667-746) — **14 insertions / 3 deletions**, re-measured and confirmed
Status: round 1 responded — 5 fixed, 1 accepted residual (R5). Fixes applied 2026-07-29; awaiting re-review.

⚠️ **Scope correction to the round-1 verdict line below, recorded by the coder:** *"Every defect is in the record (`log.md`), not the vault"* is **not accurate for R4**. That citation error reached **four vault content sites** — `adr-032` (1), `record-adr-032` (1), `track-…` (2) — and was corrected in those pages, not only in `log.md`. A **fifth** instance of the same class (`fkit-coder.md:83-91` → **`:82-91`**, the obligation sentence starting mid-`:82`) was **found by the coder while applying R4** and is not in the reviewer's findings. The verdict's shape holds for R1/R2/R3/R6; it does not hold for R4.

**Verdict (round 1): ⚠️ Changes requested — 6 defects (none blocking). Codex coverage: FULL.**
**Vault content passes clean. Every defect is in the record (`log.md`), not the vault.** — the pattern
`0126` and `0141` established, holding for a third time.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | medium | `ai-agents/wiki-vault/log.md:683`, `:743` | Task 0148's board row is cited as `ai-agents/sprints/sprint-2.md:162`. It is **:164** in the working tree and **:160** at HEAD; `:162` is a **different task's** row (rank P130) in both. Wrong against every version, so not a mutability artifact — and it is the one item routed to the **closing producer**. *(Raised by both reviewers.)* |
| R2 | 1 | low | `ai-agents/wiki-vault/log.md:746` | The closing parenthetical claims a naive `grep -oE "\[\[[^]]+\]\]"` over the entry returns **2** hits. It returns **4** — `[[link]]` at `:724`, then `[[^]]`, `[[link]]`, `[[^]]` all at `:746`: **naming the two hits created two more.** The substantive claim (all sit in code spans, none resolves to a page) still holds; only the count is wrong. It sits inside the sentence the entry offers as proof its post-write check works. *(Raised by both reviewers.)* |
| R3 | 1 | low | `ai-agents/wiki-vault/log.md:681` | Present-tense assertion of *"**zero** `tasks/backlog/0118` or `/0119` references vault-wide"*. That grep now returns **2**, both inside this entry's own text (`:681`, `:721`). The V4 bullet at `:721` is covered by the global *"run … before this entry was written"* disclaimer at `:670`; the `:681` prose is a live claim about the vault and is not. Same class as R2. |
| R4 | 1 | low | `ai-agents/wiki-vault/log.md:701`, and the same quote at `adr-032:78`, `record-adr-032:50`, `track-…:18` | `claude/agents/fkit-coder.md:66` is quoted as reading *"(b) it carries a concrete **approved plan** verbatim"*. `:66` reads `**approved plan** verbatim; and (c) …` — the *"(b) it carries a concrete"* half is on **:65**. The quote spans `:65-66`, cited as `:66`. Second instance: the knowledge-base stale block cited as `adr-032:129-132` actually runs **`:129-133`**. Wrapped-line citation imprecision — the class the entry opens by declaring it handled. |
| R5 | 1 | low | `ai-agents/wiki-vault/log.md:711` | The owner ruling that `build-…:42` and `design-…:56` **stay** lives **only in `log.md`**. Neither page carries an on-page marker, while every other corrected site got a dated on-page note. A later sweep reading the page rather than the log sees an under-specified marker description with no signal it was ruled on. The 0-byte disposition is itself the owner's ruling, so the remedy conflicts with it — **owner's call, not a coder fix.** |
| R6 | 1 | low | `ai-agents/wiki-vault/log.md:705`, `:711` | The stated basis for correcting `track-…:17` but freezing `build-…:42` / `design-…:56` — *"`:17` is the last **falsified** copy; two **under-specified** summaries remain"* — does not survive inspection. **All three are exhaustive three-item enumerations of the marker's conditions that omit `verbatim`**; none is a byte-quotation of `fkit-coder.md`, and *"carries a concrete approved plan"* stays true of a plan carried verbatim. The **sound** basis is the page's *purpose* — `track-…` is the task page whose deliverable *was* that contract text and whose §*"The tracked change, in four parts"* presents itself as the record of it. The disposition is right; the reason given for it is not. |

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect | Both citations corrected, and re-cited by **stable identity** (folder ID + brief link) with the line number given as a dated measurement | **fixed** (owner-approved) |
| R2 | **CORRECT** | Defect | Count corrected; the new sub-entry adds **no** double-bracket token, and the final count was **measured after writing**, not predicted | **fixed** (owner-approved) |
| R3 | **CORRECT** | Defect | The `:681` present-tense claim re-scoped to what was measured, and to the pages it was actually about | **fixed** (owner-approved) |
| R4 | **CORRECT** | Defect | `fkit-coder.md:66` → **`:65-66`** (the clause wraps); knowledge-base block `:129-132` → **`:129-133`**. Corrected at all sites | **fixed** (owner-approved) |
| R5 | **CORRECT** (observation) | Frontier-move | **No change** — owner declined on-page markers. Recorded as an accepted residual below | **accepted residual** |
| R6 | **CORRECT** | Defect | The *falsified-vs-summary* rationale is withdrawn; replaced with **page purpose**. Provenance of the wrong rationale recorded | **fixed** (owner-approved) |

**Verification method for each, run before any edit:**

- **R1** — `grep -n "0148-wiki-reingest" ai-agents/sprints/sprint-2.md` → **`:164`** (P132). `:162` is `0157`'s row (P130). At HEAD: `:160`. **Wrong against both versions, so not a mutability artifact** — the reviewer is right that this is a plain error, and it was the coordinate routed to the closing producer.
- **R2** — extracted the entry with `awk '/^## 2026-07-29 — ingest \(task 0148/,0'` then `grep -oE '\[\[[^]]+\]\]' | wc -l` → **4**, not 2. Confirmed the recursion: naming the two hits created two more, both at `:746`.
- **R3** — `grep -rn --include='*.md' "tasks/backlog/0118\|tasks/backlog/0119" ai-agents/wiki-vault/` → **2 hits, `log.md:681` and `:721`, both self-referential.** The reviewer's distinction is exact: `:721` is covered by the pre-write disclaimer at `:670`; the `:681` prose is not.
- **R4** — `awk 'NR==65||NR==66'` on `claude/agents/fkit-coder.md`: `:65` ends *"(b) it carries a concrete"*, `:66` begins *"**approved plan** verbatim"*. **The quoted clause wraps `:65-66`.** ⚠️ **Noted because it is on-theme: this is a wrapped-line citation error inside an entry whose own standing warning is about wrapped lines.** Knowledge-base block: `:129` opens, **`:133`** closes (*"separately. Recorded here so the gap is visible rather than assumed closed."*). Codex judged both acceptable; **I agree with the reviewer, not Codex** — a citation a reader cannot land on is wrong regardless of severity.
- **R6** — read all three sites in full. `track-…:17` enumerates all three conditions (caller / concrete approved plan / owner approved by relay); `build-…:42` and `design-…:56` enumerate the same three as *"caller identity, the concrete approved plan, and a statement that the owner approved it"*. **All three are exhaustive enumerations omitting `verbatim`; none is a byte-quotation of condition (b).** The reviewer is right that *"carries a concrete approved plan"* stays true of a plan carried verbatim, so **nothing about `:17` is more *falsified* than the other two.** The distinction I published does not hold.

**On R6's provenance, recorded because it bears on where the control failed.** The falsified-vs-summary framing **originated in the driver's routing message**, which described `track-…:17` as *"the last copy out of step"* and, at the process-review hand-off, as *"the last **falsified** copy"*. I adopted it and published it as my own reasoning without testing whether it separated the three sites — **it does not.** The disposition it produced is nonetheless correct on the sound basis (page purpose), which is why this is a record defect and not a content defect. **The lesson is the one this chain keeps re-learning: an inherited framing is a claim to verify, not a premise to build on.**

**On R5, why I did not fix it despite agreeing with the finding.** The reviewer is right that a later sweep reading `build-…:42` / `design-…:56` sees no signal they were ruled on. But the remedy contradicts its own premise: an on-page marker breaks the 0-byte disposition that *is* the owner's ruling, and annotating pages judged not-wrong would establish that any imprecise-but-true summary needs a correction note. **Owner declined 2026-07-29. Recorded as a shared residual rather than silently dropped.**

## Accepted residuals (shared, do-not-re-litigate)

- **Targeted prose lint, not vault-wide** — What: the prose/template lint ran over the 6 touched pages only; the structural checks (links, index, frontmatter, secrets) did run across all 166 pages + `index.md`. Why (structural): stated explicitly at `log.md:727` with a ⚠️, naming the last vault-wide lint, and placed inside the Verification section where a reader checking the brief's step 6 looks. **Reviewer judgment: loud enough, correctly placed.** · Re-raise only if: a later entry reports a targeted lint as a vault-wide clean lint.
- **`.wiki-watermark` deliberately not advanced** — What: stays at `b86e5eb`; HEAD is `994e3e3` plus a dirty tree. Why (structural): HEAD carries real un-ingested source (`0103`'s artifacts, the new `priority-is-rank-not-identity.md` convention, both sprint boards, ~20 backlog briefs). Advancing would move the next sync's window **past** those files and silently swallow them; the 2026-07-26 lint could advance only because that commit was the vault's own output and contained no source. **Reviewer judgment: the argument is sound, and "last of the chain" is correctly argued as an argument *against* advancing — the delta is larger now than when `0126` deferred it, not smaller. Frontier-move, correctly reasoned, loudly placed as flag 1.** · Re-raise only if: a run advances the watermark without ingesting the delta in the same run.
- **Un-ingested delta excluded by design** — What: `0103`, `0125`, `0126`, `0141`, `0147`, `0150`, `0153` and `priority-is-rank-not-identity.md` have **no vault page at all**; a separate sync task owns them. Why (structural): all three chain tasks scoped to annotating existing pages' now-false claims, never to creating pages. · Re-raise only if: a chain task silently creates or omits a page inside that boundary.
- **Knowledge-base staleness routed, not fixed** — What: `ai-agents/knowledge-base/decisions/adr-032-…:129-133` still states A2's worklog gap as live. Why (structural): ADR-005 — the wiki role never writes `knowledge-base/`; routed to task `0143`'s architect pass (owner-ruled 2026-07-29). · Re-raise only if: a wiki run writes `knowledge-base/`.
- **`sprint-2.md` board row fixed by the closing producer** — What: the 0148 row still carries the brief's two disproved claims. Why (structural): the board is outside the wiki's write scope; owner-ruled 2026-07-29 that the closing producer fixes it at close. **See R1 — the coordinate handed over for that fix is wrong.** ✅ **Corrected in the R1 fix: the row is `ai-agents/sprints/sprint-2.md:164` (P132) measured 2026-07-29, `:160` at HEAD, and it is re-cited by folder ID + brief link so the hand-off does not depend on a line number at all.** · Re-raise only if: the row survives the close.
- **On-page markers for the two deliberately-frozen sites (R5)** — What: `build-fkit-sprint-ship-loop-skill.md:42` and `design-fkit-lead-…:56` enumerate the marker's three conditions without `verbatim` and carry **no on-page note** that this was inspected and ruled on; the ruling lives only in `log.md`. Why accepted: an on-page marker would break the **0-byte disposition that is itself the owner's ruling**, and annotating pages judged not-wrong sets a precedent that any imprecise-but-true summary needs a correction note. Owner-declined 2026-07-29. · Re-raise only if: a later sweep flags either site as a miss (which is the cost being accepted), **or** `fkit-coder.md`'s condition (b) changes again such that the enumerations become actually false rather than merely less precise.

## Verified clean — re-measured by the reviewer, not credited

- **The brief was wrong on both headline claims — confirmed independently.** `grep -c "Amendment — 2026-07-22"` → **2** at HEAD *and* now (brief says 0). `grep -n "STALE"` → **1 hit at `:9`**, byte-identical at HEAD, and it is the ✅ replacement line, not a banner. **Third consecutive chain brief to misstate its own starting state.**
- **Own sweep, 6 phrasing families the wiki did not use** (`nothing yet implements` / `unimplemented` / `unsatisfiable` / `yet to land` / `remains open` / `dangling` / `absent from` / `without it existing` / `citation … resolves`, plus every `0118|0119|0147|0150` mention minus resolved ones): **zero present-tense survivors.** Every hit is past-tense history or a different subject. **The inventory was complete — the first chain task where a reviewer found no additional stale site.** Codex, sweeping its own independent family set, also found none.
- **Rule (a) on `adr-032`:** both hunks pure insertions (`@@ -46,0 +47,2 @@`, `@@ -75,0 +78,2 @@`) — no line removed or modified anywhere in the file; `**Status**: accepted` untouched; no banner; both original claims byte-identical; A3 byte-identical verified **by content** after its `:60`→`:62` shift.
- **Annotation placement:** every correction adjacent to its claim — `track :17→:18`, `adr-032 :46→:48` and `:76→:78`, `build :44→:46`, `design :56` inline, `record :44→:46` and `:48→:50`. The 19-line and 25-line gaps the entry cites are both arithmetically correct against HEAD.
- **Routed marker fix lands at `:17`** (correction at `:18`), plus a second dated clause at the `:43` R1 bullet. **No fifth *falsified* marker copy exists:** `record-adr-032:27` and `adr-032:38` both already carry `verbatim`.
- **Integrity, independently re-measured:** 166 pages (0 features · 8 systems · 33 decisions · 125 tasks) · 166 unique index targets · 0 index gaps · per-file `[[link]]`-target sets **md5-identical to HEAD for all 6 files** · `.wiki-watermark` clean · `ai-agents/knowledge-base/` **0** dirty files · `index.md` diff is exactly the 2 lines attributed to `0126`.
- **Attribution arithmetic:** `git diff --numstat` over the 6 files = 15/4; minus `adr-019`'s 1/1 (`0126`'s `:31` line) = **14/3**. Confirmed.
- **Self-caught defects D1-D3 accurately recorded.** D1 reproduced (A3 `:60`→`:62`, byte-identical). D2 reproduced — `grep -vE "^[-+][-+]"` does eat every `index.md` entry line because entries begin with `-`; the anchored filter yields the 2 lines. D3 confirmed by the numstat arithmetic above. **D4 is accurate in substance but wrong in its count → R2.**

## Coverage gap the reviewer could not close

⚠️ **The emitted completion-flag line was NOT verified — it is not on disk.** The wiki's returned report
is held by the driver. This matters: `sprint-2.md` rank P129 records that this exact check **failed on
its second live use** — `log.md:623` shows `0141` emitting a non-conforming form, and a spawned producer
testified it *"would have acted on it without noticing."* The conforming string, extracted from
`claude/skills/fkit-wiki-ingest/SKILL.md:72` and substituted (reviewer and Codex derived it
independently and agree character-for-character):

```
Task 0148's vault work is complete — ready to close (producer runs /fkit-task-done on ai-agents/tasks/backlog/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/brief.md)
```

**Exactly one flag line is required** — 0148 is the only `fkit-wiki`-owned backlog brief whose Status is
not `✅ Done`. **The driver must compare the wiki's returned line against the block above.**

## Reviewers run

- **Reviewer pass (Claude):** full. 6 findings.
- **Codex adversarial pass (`codex exec --sandbox read-only`, codex-cli 0.145.0):** **ran successfully — coverage FULL, not degraded.** 2 confirmed findings, 0 suspected; both are R1 and R2 (raised by both). Codex explicitly cleared the alternate stale-claim sweep, rule (a), annotation placement, the routed marker, the deliberately-left summaries, the other citations, D1-D3, and the integrity numbers. It judged R4's citation acceptable and R6's distinction sound — **the reviewer's dissent on those two is recorded as low severity for that reason.**
