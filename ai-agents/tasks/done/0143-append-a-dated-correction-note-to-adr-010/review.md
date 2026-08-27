# Review — 0143-append-a-dated-correction-note-to-adr-010

Task: 0143 — [brief](./brief.md)
File(s) under review: `ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md` (+71/−0)
Status: closed-out
<!-- Round 1 dispositioned 2026-08-02: R3 fixed; R1, R2, R4, R5 closed as frontier-moves with owner
     dispositions recorded as accepted residuals. Nothing blocking remains. -->


**Verdict (round 1): ⚠️ Changes requested — 1 medium form finding + 4 low, none blocking.**
The deliverable is correct: additions-only proven independently, and **every factual claim the new
notes assert is TRUE against live code 2026-08-02**. The medium is a *form* question — placement —
which matters because task `0170` cites this note as its model.

**Codex coverage: FULL** (`codex-cli 0.145.0`, read-only sandbox). First invocation died on a harness
error (`timeout` absent on macOS), not a Codex failure; re-run succeeded. Both reviewers ran. No
degradation.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `adr-010-...md:33`, `:114` | Both notices sit **below** the claim they correct, so a reader hits the false text first — at `:30-31` and `:111-113`. The approved plan itself records the vault's adopted convention as *"**banner above claim**"* (`plan.md:76-77`) yet lists only **two** deliberate differences (links, citation form); placement is not among them, so the departure shipped unreasoned. Raised by both reviewers. **Binds `0170`.** |
| R2 | 1 | low | `adr-012:9,23,25,66,87,105,166` · `adr-031:7,27` · `adr-018:88` | The +71 lines displace **12** `adr-010:NNN` pointers in three sibling ADRs — the worker's residual 4 named **2**. All 12 are stale. 10 self-correct (paired quote or `§Decision N` heading, per citation-report §1.1); **2 are naked and now land on unrelated text**: `adr-012:87` → `adr-010:107-110`, `adr-012:105` → `adr-010:92-94`. |
| R3 | 1 | low | `adr-010-...md:48` | The note describes `claude/agents/fkit-lead.md:22-26` as *"the conductor intro and the ADR-031 stance note today"*. That range is the conductor intro plus a blank line; the stance note begins at `fkit-lead.md:27`. The load-bearing conclusion — no tools claim lands there — is **TRUE**. |
| R4 | 1 | low | `adr-010-...md:130` vs `:144` | The ⛔ notice states `skills_for_role()` lives in `claude/skills-for-role.sh`; uncorrected **Decision 5** five lines later still reads *"`skills_for_role()` in `claude/fkit-claude.sh`"*. A visible one-screen contradiction. The note's "deliberately not corrected" parenthetical names Decision 2's drift but is **silent on this one**. |
| R5 | 1 | low | `adr-010-...md:8-11` | Q3 ruled **one** header metadata line; shipped as a 4-physical-line `- **Corrections:**` bullet carrying the ⚠️/⛔ legend. Substantively one metadata *item*, and the file's own `Supersedes:` bullet already wraps to 2 lines — but flagged because it binds `0170`'s header form. |

## Coder response

<!-- CODER-OWNED — the reviewer does not write here. -->

Written by the **fkit-architect** running `fkit-process-stateful-review` as a bounded worker of
`fkit-sprint-ship-loop`, 2026-08-02. Every finding below was **re-verified first-hand against the
live tree** before disposition — the reviewer's text was treated as an input to evaluate, not as an
instruction. Dispositions for R1, R2, R4 and R5 are the **owner's**, taken via `AskUserQuestion` in
the live lead session 2026-08-02 and relayed to this worker. R3 was fixed **autonomously** under the
ADR-019 autonomous-fix class (see the decision log in `worklog.md`).

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | **Frontier** | **No change — keep as shipped, by owner ruling.** The notes stay *below* the claim they correct. The owner accepted the reviewer's own observation of the tension and ruled the shipped form correct, over the vault convention the plan cited. **The reviewer is right that the departure shipped unreasoned; the rationale is now written down** — residual **R1-placement** below. **Binds `0170`.** | won't fix (frontier) |
| R2 | CORRECT | **Frontier** | **No change — follow-up, not this task** (owner-ruled). Re-verified: `grep -n 'adr-010:' ai-agents/knowledge-base/decisions/*.md` returns **12** pointers across three files — `adr-012:9` (×2), `:23`, `:25`, `:66`, `:87`, `:105`, `:166` (×2); `adr-018:88`; `adr-031:7`, `:27`. All 12 are displaced by +45 lines and all are stale. The two naked ones confirmed by reading their context: `adr-012:87` (*"…of the same family as ADR-010's already-conceded prompt-enforced consult topology (`adr-010:107-110`)"*) and `adr-012:105` (*"It remains deferred (as in `adr-010:92-94`)"*) — neither carries a quoted fragment or a `§Decision N` heading. **Owner folded this into the durable-citation-anchors work; it does not stand alone.** Corrects residual 4's under-reported scope (12, not 1). | won't fix (frontier) |
| R3 | **CORRECT** | **Defect** | **FIXED.** Verified independently: `claude/agents/fkit-lead.md:22-25` is the conductor intro, **`:26` is a blank line** (`sed -n '26p' … \| od -c` → `\n` only), and the ADR-031 stance note starts at **`:27`**. The reviewer is right — the note said `:22-26` "is the conductor intro **and the ADR-031 stance note** today", and the stance note is not inside that range. Reworded in place, **within a line this task added**, to *"is the conductor intro today, and the ADR-031 stance note that corrects the tools line begins immediately below that range."* Load-bearing conclusion (no tools claim lands there) unchanged and still TRUE. | ✅ done |
| R4 | CORRECT | **Frontier** | **No change — follow-up, not this task** (owner-ruled; already inside the Q4 exclusion). Contradiction re-verified and it is real: `adr-010:127` (new, inside the ⛔ notice) reads *"`skills_for_role()` in `claude/skills-for-role.sh`"*, while uncorrected `adr-010:144` (§Decision 5, pre-existing) reads *"`skills_for_role()` in `claude/fkit-claude.sh` is the single source of truth"*. **The reviewer's line cite `:130` is off by three** — the contradicting notice bullet is `:127`, not `:130`; `:139` is the notice's last line, which is where "five lines above Decision 5" comes from. Substance stands regardless. **⚠️ 0143 therefore ships with a visible self-contradiction on the page, one screen apart. Recorded, not softened** — see residual **R4-contradiction-ships**. | won't fix (frontier) |
| R5 | CORRECT | **Frontier** | **No change — RATIFIED as shipped** (owner-ruled). Q3 said "one header metadata line"; what shipped is a 4-physical-line `- **Corrections:**` bullet (`adr-010:8-11`) carrying the ⚠️/⛔ legend. The owner ruled it **one metadata *item***, and the legend the minimum that makes the two-marker system readable without leaving the ADR. The reviewer's own mitigation checks out: the pre-existing `- **Supersedes:**` bullet already wraps to 2 lines (`:6-7`). **Binds `0170`'s header form** — residual **R5-header-form**. | won't fix (frontier) |

**Requires a code change: nothing.** R3 was a documentation-text fix inside this task's own added
lines. No source file, no test, no config was touched by this round.

**Additions-only re-proven after the R3 fix** (the step's hard gate):

```
$ git diff --numstat -- …/adr-010-…md
71      0       ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md

$ git diff -U0 -- …/adr-010-…md | grep '^-' | grep -v '^---'
(no output)

$ git diff --check -- …/adr-010-…md
(clean)
```

**71 insertions, 0 deletions — unchanged by the fix.** R3's repair edited only text this task itself
added; **no pre-existing ADR line was modified**, so the `NEEDS-DECISION` stop condition was not hit.

## Accepted residuals (shared, do-not-re-litigate)

- **R1-placement — correction notes go BELOW the claim they correct, not above it.**
  **What:** in a knowledge-base ADR, a dated `⚠️`/`⛔` note is placed **directly after** the bullet or
  decision item it corrects, indented to that item's continuation level. The vault's *"banner above
  claim"* convention is **not** carried over to the KB side.
  **Why (structural):** a block placed *above* a bullet visually detaches from the thing it corrects —
  it reads as a preamble to the section rather than as an annotation on one claim — and it breaks the
  §Context narrative, which is continuous prose the reader is moving through. The reader is warned
  before any body text is reached by the header `- **Corrections:**` bullet (`adr-010:8-11`), which
  names both note sites and carries the marker legend; below-placement therefore costs no warning.
  **Rejected alternative:** banner-above-claim (the vault convention, cited in `plan.md:76-77`) —
  rejected on the two grounds above. **Rejected alternative:** a single end-of-file "Corrections"
  section — rejected in planning; it reproduces the exact placement error the vault's own lint named.
  **This is the owner's ruling of 2026-08-02, recorded because the departure originally shipped with
  no rationale — that is what this entry fixes.** **⚠️ Binds task `0170`** (the ADR-032 dated-note
  append, which cites `0143` as its model): `0170` places its note **below** the claim.
  **Re-raise only if:** a KB reader demonstrably acts on a corrected claim without seeing its note, or
  the header `- **Corrections:**` bullet is dropped from the form (removing the early warning that
  makes below-placement safe).

- **R5-header-form — the header correction bullet is ONE metadata ITEM, and may wrap.**
  **What:** the ADR header gains one `- **Corrections:**` bullet. It may span several physical lines,
  and it carries the **marker legend** (⚠️ = a fact that drifted, decision untouched; ⛔ = a decision
  that was overturned, do not follow it) plus the note sites and an assertion that no existing line
  was edited.
  **Why (structural):** the two-marker system is unreadable without its legend, and a legend that
  lives anywhere but the header forces the reader to find it after they have already met a marker.
  One *item* is the unit Q3 was asking about; physical-line count is a rendering artifact — the
  file's own `- **Supersedes:**` bullet (`:6-7`) already wraps.
  **Rejected alternative:** a literal single physical line — rejected: it cannot hold the legend, so
  the legend would have to move into the body or be dropped.
  **⚠️ Binds `0170`'s header form.**
  **Re-raise only if:** the marker vocabulary grows beyond the two markers (⚠️/⛔), at which point the
  legend outgrows a header bullet and needs its own home — likely the convention page, not the ADR.

- **R4-contradiction-ships — 0143 knowingly ships a visible self-contradiction inside ADR-010.**
  **What:** `adr-010:127` (new) and `adr-010:144` (pre-existing §Decision 5) name **different files**
  for `skills_for_role()`, one screen apart, and this task ships that way. **This is not softened and
  not a rendering nit — a reader of §Decision 5 alone is still told the wrong file.**
  **Why (structural):** correcting `:144` means correcting **Decision 5**, which the owner excluded
  under Q4 (*"file them as follow-ups"*) so this pass establishes the note form on **one** clean
  cause rather than mixing the ADR-018/ADR-012 drift into a note about the menu and the ADR-031
  reversal. The binding *"note, not a rewrite"* ruling also forbids editing `:144` in place.
  **Rejected alternative:** fix `:144` now — rejected, it is the excluded scope and would breach
  additions-only. **Rejected alternative:** drop the correct filename from `:127` so the page reads
  consistently — rejected outright: it would trade a *visible* contradiction for a *silent* falsehood.
  **Re-raise only if:** follow-up 2 (the §Decision 5 / `skills_for_role()` correction note) has not
  landed by the end of Sprint 2 — at which point the contradiction has outlived its justification.

- **R2-pointer-drift — an append into a cited ADR breaks sibling `path:NNN` pointers, and that is the
  accepted price of "note, not a rewrite".**
  **What:** this +71-line append displaced **12** `adr-010:NNN` pointers in ADR-012, ADR-018 and
  ADR-031. **None** is repaired by this task. **Corrects the build worker's residual 4, which reported
  the scope as 1 pointer, not 12.**
  **Why (structural):** any pure append moves every downstream line number; the owner's binding
  *"note, not a rewrite"* ruling makes appending the only permitted shape, so pointer drift is
  unavoidable rather than chosen. 10 of the 12 self-correct because they carry a paired quote or a
  `§Decision N` heading (per the citation report's §1.1 rider) — including ADR-031's, which pairs
  `adr-010:66-68` with the full phrase *"`fkit-lead` (the team room) is a router, not a doer"*. Only
  **2** are naked (`adr-012:87`, `adr-012:105`).
  **Rejected alternative:** repair the 12 pointers here — rejected by the owner; it edits three ADRs
  this task's scope fence excludes, and it treats a systemic citation-form problem as a one-file fix.
  **Rejected alternative:** file it as a standalone follow-up — rejected by the owner; it **folds into
  the durable-citation-anchors work** instead.
  **Re-raise only if:** a **naked** `adr-010:NNN` pointer is found to have misled a reader in practice,
  or the durable-citation-anchors work is cancelled (removing the home this was folded into).

- **R3-cite-accuracy — a correction note's own citations are held to the standard the note enforces.**
  **What:** a factual slip inside a dated correction note is a **defect**, fixed on sight, not a nit —
  even when the slip does not change the note's conclusion.
  **Why (structural):** a note whose entire authority rests on *"the ADR says X, the truth is Y"* has
  no authority left once its own Y is inaccurate. This is why R3 was fixed autonomously rather than
  deferred with R2 and R4.
  **Re-raise only if:** never as a challenge to the standard. A **specific** inaccurate citation in a
  correction note is always in scope to report.

- **Citation form — no `:NNN` into a mutable file, anchored by file + quoted phrase.** (Adjudicated
  by the reviewer in *Adjudications* below and carried forward by the owner as settled.)
  **What:** the notes cite `claude/…` files by **filename + quoted phrase**, with **no** line number.
  **Why (structural):** `reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md` §3.3 is
  titled *"Ruling — narrow, do not ban"* — its *"Keep `path:NNN`"* is a **carve-out from a proposed
  ban, not an obligation**; §1.1's rider governs *how* to cite a number, not *whether* to. The shipped
  form carries the durable half (the quote) and drops the fragile half (the number), so it cannot
  violate §1.1 — there is no naked number to violate it with. **R2 is live proof the choice was right:
  12 sibling `:NNN` pointers broke in this very edit while the notes' own citations survived
  untouched.** **Not mandated, and not non-compliant.** **Binds `0170`**, whose own row independently
  mandates *"write no `:NNN` line numbers"*.
  **Separately recorded as still accurate:** the build worker's report that the **plan's stated
  rationale** for this choice was false (the plan reasoned from §3.3's heading without reading its
  body) **stands** — the rationale was wrong, the conclusion was right, and the worker was correct to
  say so rather than inherit it silently. Worklog follow-up 7 (*"reconsider the citation form"*) is
  **closed by this residual**, not left open.
  **Re-raise only if:** the durable-citation report is superseded by a ruling that makes a paired
  `path:NNN` mandatory rather than permitted for files under `claude/`.

- **Q4-scope-fence — the ⛔ notice's `skillOverrides` parenthetical stays.**
  **What:** the §Context reversal notice keeps its italic parenthetical naming ADR-018's retirement of
  Decision 2's `skillOverrides` mechanism as a **drift, not a reversal**, and as **deliberately not
  corrected in this pass**. Wording as shipped.
  **Why (structural):** ADR-031's own scope sentence is the flat *"Decisions 1, 2, 4, 5 are
  unaffected"*. Relayed flat into ADR-010 that would have inserted a **new** misleading claim into a
  correction note — the precise failure the brief exists to prevent — because Decision 2's mechanism
  **is** retired, just not by ADR-031. The shipped wording (*"No other ADR-010 decision is **reversed
  by ADR-031**"* + the deferral parenthetical) is precisely true and leaves follow-up 1's surface
  fully intact: no ⚠️ block at Decision 2, no "what is true today", no marker, no restatement.
  **Rejected alternative:** relay ADR-031's sentence verbatim — rejected as above. **Rejected
  alternative:** strike the parenthetical entirely — rejected; it is the brief's own sanctioned
  "addressed-or-explicitly-deferred" pattern, and Codex's *"excluded scope was shipped"* reading was
  adjudicated **PARTIALLY CORRECT and not a defect** (see *Adjudications*).
  **Classification: frontier-move, correctly self-flagged by the build worker.**
  **Re-raise only if:** the parenthetical is ever expanded into an actual correction of Decision 2
  before follow-up 1 is scoped and approved.

---

## Verified TRUE — do not re-raise

Both reviewers checked these independently; all pass. Recorded so a later round does not re-derive them.

- **Additions-only.** `git diff --numstat` = `71 0`; `git diff -U0` contains **zero** `-` lines. Original
  text byte-identical. `Status:` still `accepted` (`:3`). `git diff --check` clean; no trailing
  whitespace; no secret, credential or endpoint.
- **Menu.** lead is option **1** (`claude/fkit-claude.sh:468`, arm `1|lead)` `:481`); wiki is option **7**
  (`:474`, `:487`). No `team` arm on any path (`:198-202`, `:480-491`).
- **"Team room" retired.** The string survives in the launcher **only** inside the rejection comment
  (`claude/fkit-claude.sh:182`, `:188`) — exactly as the note claims. Quoted fragment matches the file.
- **No `tools:` key** in `claude/agents/fkit-lead.md` → the ADR's *"no Write or Edit tools"* is false, as
  the note says. The note's quotation of that file's stance note is accurate.
- **Five skills.** `skills_for_role()` in `claude/skills-for-role.sh:50` grants lead exactly the five
  named. The ADR's *"owns only `/fkit-team` and `/fkit-query`"* (two) is false, as the note says.
- **ADR-031 reverses §Decision 3** and names the exact site (`adr-031:6-7`, `:26-27`, `:151`); the note's
  quotation *"a real decision, not a drift"* is accurate.
- **Safe-default claim still true** (`claude/fkit-claude.sh:496-498`); only the pointer `:190` is stale —
  as the note says.
- **ADR-018 retired the `skillOverrides` off-list** (`adr-018:46`, `:101`).
- **All five new relative links resolve** on disk (ADR-022, ADR-031, ADR-018, `0139`, `0140` briefs).
- **⚠️/⛔ distinctness works.** Separate emoji, separate bold lead-ins, legend in the header, and a bare
  blank line between the two §Context blocks so they render as **two** blockquotes, nested inside the
  bullet. Owner's Q1 satisfied as ruled.

## Adjudications the spawn brief asked for

**Q4 deviation (the `skillOverrides` parenthetical) — the worker's call was RIGHT. Keep it.**
Codex raised this as *"excluded scope was shipped"* — **PARTIALLY CORRECT, and I do not adopt it as a
defect.** Codex is literally right that a substantive fact reaches the reader. It is wrong that this is
the excluded scope: Q4 excluded *folding in the correction*, and **no correction to Decision 2 was
written** — no ⚠️ block at Decision 2, no "what is true today", no marker, no restatement of the
mechanism. The follow-up's entire surface remains. What shipped is a **scope fence**: relaying ADR-031's
flat *"Decisions 1, 2, 4, 5 are unaffected"* would have inserted a **new** misleading claim into a
correction note — the exact failure the brief exists to prevent — since Decision 2's mechanism *is*
retired, just not by ADR-031. The chosen wording (*"No other ADR-010 decision is **reversed by
ADR-031**"*) is precisely true. **Classification: frontier-move, not a defect.** The worker flagged the
deviation itself, which is the correct behavior. Still the owner's to strike if they read Q4 strictly.

**Citation form — (a) PERMITTED, and the strongest available choice.** Ruling on
`reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md`:
§3.3 is titled *"Ruling — **narrow, do not ban**"*; its *"Keep `path:NNN` for code, tests, files under
`claude/`"* is the **carve-out from a proposed ban** — it makes `:NNN` *permitted* there, contrasted
against *"Stop using it"* for coordination docs. It is **not** an obligation to attach a number.
§1.1's rider — *"Never cite a line number naked. Pair every `path:NNN` with a quoted fragment or the
heading it sits under"* — constrains **how** you cite a number, not **whether**. §3.4 says so outright:
*"This is the argument for the §1.1 rider rather than for the ban — a ban stops new bad pointers; only a
paired quote makes an already-drifted one detectable."* What shipped (file + quoted phrase, **no**
`:NNN`) carries the durable half and omits the fragile half; it cannot violate §1.1 because no naked
number exists. **Not (b) mandated, and emphatically not (c) non-compliant.** R2 is live proof of its
value: this very edit broke **12** sibling `:NNN` pointers while the notes' own citations survived
untouched. **This ruling binds `0170` — the no-`:NNN` form is correct and should be carried forward.**
Separately: the worker's report that the plan's *stated ground* for this was false is **accurate and
honest** — the plan reasoned from §3.3's heading alone. The rationale was wrong; the conclusion was
right. Credited, not charged.

**Residual 4 (ADR-031's `adr-010:66-68`) — the worker's reasoning holds, but under-reported the scope.**
Decision 3 moved `66-68` → `111-113`; `:66-68` today lands inside the new ⚠️ §Context block. It **does**
self-correct: ADR-031 pairs it with the full quote *"`fkit-lead` (the team room) is a router, not a
doer"*, and the text it now lands on explicitly names §Decision 3. Agreed — **ADR-031 does not need
repair, and repairing it would be a follow-up, not this task.** But this is R2: the same append broke
**12** pointers, not 1, and two of them are naked. **Classification: frontier-move.** Pointer drift is
the unavoidable price of the owner's binding *"note, not a rewrite"* ruling — any append moves
downstream line numbers. Out of scope here (ADR-012/018/031 are correctly untouched); worth one
follow-up, best folded into the durable-citation-anchors work rather than filed standalone.

**Scope discipline — CLEAN.** Untouched and verified: `ai-agents/wiki-vault/` (incl. ADR-010's vault
page), ADR-031, ADR-022, ADR-018, ADR-012, ADR-032, `/fkit-record-decision`, every source file, every
test. No commit, no push. `sprint-2.md` and `0143/brief.md` carry **only** the driver's `🔲 Backlog` →
`🔄 In progress` flip for this task; the remaining `sprint-2.md` delta is task `0158`'s rows and the
producer's `0190`–`0194` appends — **not this task's**. `adr-037-*.md` and the `0158-*` folders are the
previous task's, correctly excluded.

## Re-litigates settled decisions (suppressed)

None. This is round 1 on a fresh ledger; no accepted residual and no ADR *"Re-raise only if"* condition
was matched by any finding.

## Convergence call

**Act, do not close out.** Round 1, all findings novel, nothing re-litigated. Only **R1** carries a real
disposition, and it is the owner's: below-claim (as shipped) versus banner-above-claim (the convention
the plan cited). Both are pure appends, so either is compatible with *"note, not a rewrite"*. R2–R5 are
low and none blocks this task — R2 and R4 resolve as follow-ups against other files, R3 is a one-clause
wording nit, R5 is an observation on the header form. **Whatever the owner rules on R1 and R5 should be
recorded as accepted residuals, because `0170` inherits this form.**
