# Review — 0198-teach-record-decision-the-dated-correction-note-form

Task: 0198 — [brief](./brief.md)
File(s) under review: `claude/skills/fkit-record-decision/SKILL.md` (+91/−0, pure insertion) and this
folder's `worklog.md`
Status: in-review

**Verdict (round 1): ⚠️ Changes requested — 5 defects (2 medium, 3 low), none blocking.**
The deliverable is substantively correct: **all seven required pieces are present**, the shape is a
proven `+91 / −0` insertion, Steps 1–4 and the ADR template are byte-untouched, and every factual
claim the new section makes about the shipped form was re-verified first-hand against the live
ADR-010, `0143` and `0195` and is **TRUE**. What the findings hit is the section's **executable**
half — the shell commands it prescribes as proof, and two completeness gaps.

**⚠️ Loud, before the table — the two medium findings compound.** `R1` and `R2` are not independent
nits: together they mean that in the **multi-append case this repo is actually in** (`0143`'s +71
still uncommitted on ADR-010, with `0196`/`0197` queued onto the same file per `0195`'s worklog),
**every guard the section prescribes reports clean on a real append-only breach.** Reproduced in a
scratch repo, not reasoned: deleting a prior task's uncommitted appended line yields
`git diff --numstat` → `4  0` (deletions column **zero**) and `git diff -U0 | grep '^-[^-]'` → empty.
Only `0195`'s actual two-part snapshot proof — which the skill did not encode — catches it.

**Codex coverage: FULL** (`codex-cli 0.145.0`, `gpt-5.6-sol`, read-only sandbox). Both reviewers ran
to completion. **No degradation.** `R1` was raised **by both reviewers independently**.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/skills/fkit-record-decision/SKILL.md:207` | The prescribed deletion guard `git diff -U0 -- <adr-file> \| grep '^-[^-]'` **silently passes on an in-place edit of any markdown list line** — because a deleted `- text` line renders as `-- text`, whose second character is `-`. That includes the entire ADR header block (`- **Status:**`, `- **Date:**`, `- **Supersedes:**`, `- **Corrections:**`) and every `- ` bullet in §Context/§Consequences. **This lands squarely on the one line the section itself directs the reader to touch** — `:226-228` tells them to extend `- **Corrections:**`. Reproduced: editing that bullet in place gives `-- **Corrections:** …` in the diff and **no output** from the guard. `0143` ratified a **stronger** command in its own closeout proof — `git diff -U0 \| grep '^-' \| grep -v '^---'` (`0143/review.md`, *"Additions-only re-proven after the R3 fix"*) — which **does** catch it. The skill rewrote a ratified command into a weaker one. **Raised by both reviewers.** |
| R2 | 1 | medium | `claude/skills/fkit-record-decision/SKILL.md:210-212` | The `0195` caveat — *"when earlier **uncommitted** appends already sit on the same file … also prove against a pre-edit snapshot with `git diff --no-index <snapshot> <adr-file>`"* — is the **only** guard that works in that case, and it is encoded as an **unfiltered eyeball diff**: no `--numstat`, no deletion test, no stated expected output, no direction convention. It therefore **contradicts the section's own rule two paragraphs above** (`:202` *"proved by diff, not by eye"*). `0195` actually ran **two** checks (`0195/worklog.md:131-143`): `git diff --no-index --numstat <snapshot> <file>` → `49  0`, **and** `diff <snapshot> <file> \| grep '^<'` → empty. Verified in a scratch repo that this is the load-bearing gap: with a prior uncommitted append present, deleting one of its lines leaves working-tree `--numstat` reading **`4  0`** and the `:207` grep **empty**, while `git diff --no-index --numstat` reads `2  1` and `diff \| grep '^<'` names the deleted line. |
| R3 | 1 | low | `claude/skills/fkit-record-decision/SKILL.md:226-228` | Supersession scope is **over-broad** against the artifact it encodes. The skill says to *"leave the prior lines byte-identical, and state that **they** are superseded by the new lines"* — "they" reads as all prior lines. Shipped ADR-010 supersedes only the **site list**: *"The **site list in the first line** of this item is left byte-identical and is superseded by this line; **the same append-only rule and the same legend apply**"* (`adr-010-role-locked-sessions-and-skill-lockdown.md:12-13`). `0195`'s own residual `R-header-two-site-lists` describes it the same narrow way (*"the stale first **list** … superseded"*). Followed literally, a future pass declares the still-binding ⚠️/⛔ **legend**, the no-edit assertion and the *"Status stays `accepted`"* statement superseded — degrading the header the form exists to keep true. |
| R4 | 1 | low | `claude/skills/fkit-record-decision/SKILL.md:190, 223-228, 252` | The `- **Corrections:**` header item's **own date** and its **position among the ADR's metadata** are never specified. Shipped form: `- **Corrections:** 2026-08-02 — …` (`adr-010…md:8`), placed **last**, immediately after `- **Supersedes:**` (`:6-7`). The auxiliary rule at `:252` dates *"Notes"*, which does not plainly reach the header metadata item. A future agent can follow the procedure exactly and emit an **undated** Corrections bullet, or place it above `Status:`. |
| R5 | 1 | low | `claude/skills/fkit-record-decision/SKILL.md:32` (+ absent closing step after `:257`) | The signpost sends a corrector **past Step 4** (`:164-168`) — the file's only closing step — and the new section has **no closing step of its own**, so a correction pass ends with no instruction to report what it appended and, more concretely, **no hand-off for the wiki page the correction just made stale**. This is specific and live, not theoretical: `ai-agents/wiki-vault/` holds an ADR-010 page, and `0195`'s worklog schedules task **`0199`** (vault resync) precisely because *"the vault page must then reflect five KB-side notes plus a header item with two site lists"*. The Boundaries blockquote at `:26-30` **is** still read (it precedes the signpost) but is phrased for a **new** ADR — *"When an ADR should appear in the wiki, recommend the owner run fkit-wiki's `ingest` on it"* — not for a corrected ADR whose page already exists and is now stale. **The "Make no commits" half of Step 4 is NOT at risk** — it is carried redundantly by the frontmatter `description:` (`:6-7`) and by CLAUDE.md's universal hard rule. |

## Coder response

<!-- CODER-OWNED — the reviewer does not write here. -->

**Round 1 response — 2026-08-15, fkit-coder (Process-review worker, spawned by
`fkit-sprint-ship-loop` under the declared-approval marker).**

**Summary: 5 findings, 5 agreed (`CORRECT`), 0 disputed. 4 fixed in this round (`R1`, `R2`, `R3`,
`R5`); `R4` is owner-ruled OUT of scope for `0198` and routed to a follow-up brief.** Every finding
was re-verified first-hand before acting — `R1` and `R2` reproduced in scratch git repositories, not
reasoned from the reviewer's text.

| #  | Verdict | Class | Action |
|----|---------|-------|--------|
| R1 | `CORRECT` | defect | **Fixed** — guard replaced with `0143`'s ratified form |
| R2 | `CORRECT` | defect | **Fixed** — `0195`'s two-part snapshot proof encoded |
| R3 | `CORRECT` | defect | **Fixed** — supersession scope narrowed to the site list |
| R4 | `CORRECT` | defect (completeness) | **Owner-ruled out of scope for `0198`** — follow-up brief |
| R5 | `CORRECT` | frontier-move | **Fixed (narrow form)** — wiki-resync hand-off added |

### R1 — deletion guard `grep '^-[^-]'` misses deleted list lines — **CORRECT, fixed**

**Verified by reproduction, not by reading.** Scratch repo: committed an ADR-shaped file, then edited
`- **Corrections:** 2026-08-02 — one site` **in place**. Raw `git diff -U0` output carries
`-- **Corrections:** 2026-08-02 — one site`. Results:

```
git diff --numstat                              -> 1  1   (deletion IS present)
git diff -U0 | grep '^-[^-]'                    -> (empty)          <- guard MISSES it
git diff -U0 | grep '^-' | grep -v '^---'       -> -- **Corrections:** …   <- guard CATCHES it
```

The reviewer's mechanism is exactly right: the deleted line renders as `-` + the line's own leading
`- `, so character two is `-` and `[^-]` rejects it. This lands on the header bullet the section
itself instructs the reader to extend, so it is not a theoretical hole.

**Fix:** the prescribed command is now
`git diff -U0 -- <adr-file> | grep '^-' | grep -v '^---'`, plus a ⚠️ paragraph naming the weaker
`grep '^-[^-]'` as wrong and saying *why* — the section's failure mode was precisely that a ratified
command got rewritten into a weaker one, so the reason is recorded to stop it happening again.

### R2 — `0195` snapshot caveat encoded as an unfiltered eyeball diff — **CORRECT, fixed**

**Verified twice.** (a) The cited source is accurate: `0195`'s worklog *"Additions-only — proven TWO
ways"* records `diff <snapshot> <file> | grep '^<'` → no output **and**
`git diff --no-index --numstat <snapshot> <file>` → `49  0`. The skill encoded neither — only a bare
`git diff --no-index <snapshot> <adr-file>` with no filter and no expected output. (b) The compounding
blast radius reproduced exactly as claimed: with five uncommitted appended lines present, deleting one
of them gives

```
git diff --numstat                          -> 4  0     <- deletions column ZERO
git diff -U0 | grep '^-' | grep -v '^---'   -> (empty)   <- even the FIXED guard misses it
git diff --no-index --numstat snap file     -> 0  1      <- snapshot catches it
diff snap file | grep '^<'                  -> < A       <- and names the line
```

Note this strengthens the finding: the multi-append case defeats the **corrected** `R1` guard too, so
`R1`'s fix alone would not have closed it. Both fixes were genuinely needed.

**Fix:** the caveat is now a full two-command proof block (`git diff --no-index --numstat` expecting
`N  0`, and `diff <snapshot> <file> | grep '^<'` expecting no output), preceded by a sentence saying
why the working-tree diff cannot see it (it is measured against the last commit) and an instruction to
take the snapshot **before** editing.

### R3 — supersession scope over-broad — **CORRECT, fixed**

Verified against the live artifact. Shipped ADR-010's header reads *"The site list in the first line
of this item is left byte-identical and is superseded by this line; the same append-only rule and the
same legend apply"* — the supersession is scoped to the **site list**, and the legend is explicitly
carried forward, not retired. The skill's *"state that they are superseded by the new lines"* is wider
than what it encodes, and read literally would retire a still-binding legend.

**Fix:** the sentence now says to name **which part** the new lines supersede, quotes the shipped
site-list wording as the model, and states that the legend, the no-edit assertion and the
*"Status stays `accepted`"* statement remain binding.

### R4 — Corrections bullet's own date and metadata position unspecified — **CORRECT, but OUT of scope for `0198`**

**The finding is factually correct** — verified: shipped ADR-010 carries
`- **Corrections:** 2026-08-02 — …` placed last, immediately after `- **Supersedes:**`, and the
auxiliary dating rule in the new section speaks of *"Notes"*, which does not plainly reach a header
metadata item. A future pass could emit an undated Corrections bullet and still satisfy the procedure
as written.

**Not fixed here — owner ruling, not a coder judgment.** The owner ruled *"R5 now, R4 follow-up"* live
via `AskUserQuestion` in the driver session, 2026-08-15: `R4` is out of `0198` and to be filed as a
separate brief. The proposed brief text is written at the end of this task's `worklog.md` under
*"Proposed follow-up brief (R4)"* — it needs a **producer** to file it into
`ai-agents/tasks/backlog/`, which this worker may not do (`/fkit-task-brief` is producer-owned). The
driver routes it.

### R5 — no closing step / no wiki hand-off after a correction — **CORRECT, fixed in the narrow form the owner ruled**

Premise verified live: `ai-agents/wiki-vault/` does hold ADR-010 material, and task
`0199-wiki-resync-adr-010s-vault-page-after-the-correction-notes` sits in `ai-agents/tasks/backlog/`
for exactly this reason — the staleness is real and already cost a task. The reviewer's carve-out is
also correct and was respected: the *"Make no commits"* half is not at risk, being carried by the
frontmatter and by CLAUDE.md's universal hard rule.

**Fix (narrow):** a closing *"Hand off when you are done"* paragraph at the end of the section — report
the annotated sites and the proof figures, and recommend the owner have **fkit-wiki** re-ingest the
corrected ADR because its existing vault page is now stale. The owner ruled the **hand-off sentence**
in, not a full Step-5 closing procedure, so this deliberately stays a short paragraph rather than a new
numbered step. *"You make no commits"* is restated in it as a one-clause belt-and-braces, not as a new
requirement.

### Verification of this round's edit

Same file, same fence: `claude/skills/fkit-record-decision/SKILL.md` only. Frontmatter, Steps 1–4 and
the ADR template untouched; no ADR edited; no `ai-agents/wiki-vault/` write; no commit; no task file
moved; no `## Status` changed.

```
$ git diff --numstat -- claude/skills/fkit-record-decision/SKILL.md
111     0       claude/skills/fkit-record-decision/SKILL.md          # was 91  0 before this round

$ git diff -U0 -- claude/skills/fkit-record-decision/SKILL.md | grep '^-' | grep -v '^---'
(empty)
```

⚠️ **The proof above was run with `R1`'s corrected command, not the plan's.** The approved plan's
verification step 7 prescribes the defective `grep '^-[^-]'`; that is the very command `R1` found
wrong and the owner ruled fixed, so this round used `grep '^-' | grep -v '^---'`. Stated rather than
silently substituted. **`HEAD` is the pre-`0198` clean state of this file**, so zero deletions against
it proves Steps 1–4 and the template byte-untouched across **both** rounds — this is the stronger
comparison, and `R2`'s snapshot caveat does not apply to it (no earlier uncommitted append sits on
this file).

`npm test`: see the *Round 2 verification* section of `worklog.md` for the raw result.

**Residual noted, not fixed (needs a disposition):** the ratified `grep '^-' | grep -v '^---'` form has
its own narrower blind spot — a deleted line whose own text begins with `---` (a markdown horizontal
rule, or a YAML frontmatter delimiter) renders as `----` and is dropped by the `-v` filter. ADRs do
contain `---` rules. Severity is low relative to `R1` (rules carry no claims, and the `--numstat`
check still shows the deletion count). **Not acted on:** the owner's ruling named this exact command,
and hardening it further is a frontier-move outside the approved plan. Recorded here so a later round
treats it as known rather than novel.

## Accepted residuals (shared, do-not-re-litigate)

<!-- None yet. Round 1 dispositions are the owner's and have not been taken. -->

---

## Verified TRUE — do not re-raise

Both reviewers checked these independently; all pass. Recorded so a later round does not re-derive them.

- **All seven required pieces present**, each confirmed first-hand (not inherited from the worklog's
  greps): three-part shape (`:187-190`); two-marker legend with both glosses verbatim and an explicit
  *"no third marker"* (`:194-197`); *"left byte-identical"* + the `+N / −0` framing (`:202`);
  below-the-claim placement **with its rationale as prose** (`:214-219`); header-bullet form incl. the
  stated append-only exception (`:223-228`); indentation-follows-the-claim incl. the indent-0 prose
  case (`:232-235`); cross-reference-don't-restate (`:239-241`).
- **"All five shipped notes" is accurate.** ADR-010 carries exactly five blockquote note blocks:
  `:36` (⚠️, indent 2), `:61` (⛔, indent 2), `:105` (⚠️, **indent 0**), `:137` (⛔, indent 3),
  `:171` (⚠️, indent 3). Three ⚠️, two ⛔.
- **Indentation rule is faithful.** The 2- and 3-space blocks sit at their list items' continuation
  indent; `:105` — the only one annotating **top-level prose** — sits at column 0. Exactly as stated.
- **Cross-reference quote is verbatim-accurate** against `adr-010…md:114-116`: *"…are deliberately
  **not** restated here, so there is one place to keep true rather than two."*
- **Placement rationale is faithful** to `0143`'s residual `R1-placement` — detaches / reads as
  section preamble / breaks the §Context narrative / the header bullet supplies the early warning.
  Not paraphrased into something weaker.
- **Header-bullet form is faithful** to `0143`'s `R5-header-form` (one wrappable metadata *item*
  carrying the legend, the one append-only exception) — apart from `R3`'s supersession scope.
- **Status discipline correct.** The section states the ADR stays `accepted` and names `superseded` as
  the likely wrong move; ADR-010`:3` still reads `accepted`.
- **Dating form is real, not invented.** *"verified against live code YYYY-MM-DD"* is the shipped
  present-tense idiom at `adr-010…md:40`, `:109`, `:142`, `:176`.
- **The new section obeys the `Citation form` residual it inherits** — it names ADR-010, `0143` and
  `0195` in prose with **no `:NNN`** pointers, and uses no relative links (correct: this skill ships
  into consuming projects where those paths do not exist).
- **Pure insertion re-proven independently**, including by the stronger command `R1` recommends:
  `git diff --numstat` → `91  0`; `git diff -U0 | grep '^-[^-]'` → empty; `git diff -U0 | grep '^-' |
  grep -v '^---'` → **also empty**. Steps 1–4 and the ADR template are byte-untouched; the signpost is
  an insertion between the Boundaries blockquote and Step 1, not an edit.
- **Flag C honored.** YAML frontmatter is untouched in full — `description:` unchanged.
- **Scope discipline CLEAN.** No file under `ai-agents/knowledge-base/decisions/` or
  `ai-agents/wiki-vault/` was touched by `0198`; the four modified `decisions/` files are the
  pre-existing unrelated tree deltas the spawn brief fenced out. No commit, no task file moved.
- **The worklog's *"No `## Status` changed"* is TRUE of the coder.** `brief.md`'s 🔲 → 🔄 flip and
  `sprint-6.md:210` are the driver's standard pre-spawn flip — the same pattern adjudicated in
  `0143`'s review (*"carry **only** the driver's 🔲 Backlog → 🔄 In progress flip for this task"*).
  Not a finding.
- **The worklog's baseline-drift disclosure is correct behavior, not a defect** — it reports 730 pass
  against a plan expecting 560 and names it a stale expected-count rather than hiding it, and it
  states plainly that **no test asserts on this file's body** (`0152`'s H1 guard is still in backlog;
  `test/skill-frontmatter.test.js` is frontmatter-only). ⚠️ **Not independently re-run this pass** —
  the `730 / 0` figure is taken from the driver's stated verification state and the worklog, not
  re-derived by the reviewer.

**Checked and NOT raised as a finding:** the worked-example sentence (`:246-247`) describes `0195`'s
contribution as *"the indent-0 note under top-level prose, and the cross-reference note"*, which reads
as two blocks when both properties in fact live in the **single** block at `adr-010…md:105` (`0195`'s
other block, `:171`, is an ordinary indented note). The brief's own verification step 6a/6b frames it
the same way (*"checkable against `0195`'s two shipped blocks"*), and `0195` did ship two blocks — the
wording tracks the brief. Noted so a later round does not chase it.

## Re-litigates settled decisions (suppressed)

**None.** Round 1 on a fresh ledger. Both reviewers were primed with `0143`'s residuals
(`R1-placement`, `R5-header-form`, `Citation form`, `Q4-scope-fence`), `0195`'s
(`R-header-two-site-lists`, `R-third-site-remains`) and the owner's 2026-08-15 rulings on flags A/B/C,
and the output-side dedup found **nothing** to suppress — no finding matched a residual whose
*"Re-raise only if"* condition was unmet. In particular: below-the-claim placement, the two-marker
vocabulary, the one-wrappable-item header form, the auxiliary bullets (flag A), naming `0195` (flag B)
and the untouched frontmatter (flag C) were **not** re-raised by either reviewer.

⚠️ `R3` is **not** a re-litigation of `0195`'s `R-header-two-site-lists`. That residual settles whether
ADR-010's two-site-list header is acceptable **as shipped**; `R3` is about the **skill's generalization
of it** being wider than the artifact. The residual's own wording (*"the stale first list … superseded"*)
is evidence **for** `R3`, not against it.

## Convergence call

**Act, do not close out.** Round 1, fresh ledger, all five findings **novel**; zero re-litigation.
Nothing blocks the task's stated deliverable — the seven pieces the brief required are all present and
faithful, so `0198` achieves what it was scoped to achieve. The findings are about the **executable
fidelity** of what it encoded: `R1`+`R2` are a genuine defect pair with a live blast radius (the
`0196`/`0197` appends onto the same uncommitted ADR-010 will run against these exact commands), and
`R3`–`R5` are fidelity/completeness gaps that are cheap to close in the same edit.

**All five dispositions are the owner's**, since `R4` and `R5` sit outside the brief's seven pieces and
`R1`/`R2` change a proof procedure that `0143` and `0195` both already exercised.
