# Review — 0195

Task: 0195 — [brief](./brief.md)
File(s) under review: `ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md` (+49 / −0 for this task)
Status: **closed-out 2026-08-02** — round 1 answered, round-2 fixes applied, round-3 procedural
conformance pass clean (+53 / −0 for this task after the fixes; was +49 / −0 at round 1).
**Closed on the owner's ruling** (`AskUserQuestion`, live lead session, 2026-08-02): the
**[ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)
work-product bar is MET** — R1 and R2 were the only work-product defects, both fixed and confirmed in
the shipped ADR text; R3 is own-record and carries a full residual; R4 is an accepted frontier.
**No round-3 reviewer pass was run, by that ruling.** ⚠️ **Stated cost, put to the owner explicitly and
accepted:** the round-2 fixes (**+4 lines**) never received independent reviewer eyes. Per ADR-034 this
ledger is closed to a **work-product** standard, **not a record-perfect one**. Awaiting the producer's
close.

**Verdict (round 1): ⚠️ Changes requested — 2 defects (none blocking).**
Reviewers run: **fkit-reviewer (Claude)** + **Codex `codex-cli 0.145.0` — FULL coverage, no degradation.**

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md` — §Decision 5 note (Block A), bullet 1, phrase *"`claude/fkit-claude.sh` defines nothing — it only sources it"* | Categorically false as written. `claude/fkit-claude.sh` defines **eight** functions (`_fkit_verfield`, `_fkit_is_source_checkout`, `_fkit_remote_sha`, `_fkit_remote_version`, `_fkit_reinstall`, `build_settings`, `set_tab_title`, `codex_preflight`). The intended claim — it does not define `skills_for_role()` — is true; the unscoped wording is not. A precision defect inside a precision document. Raised by both reviewers. |
| R2 | 1 | low | same file — §Context note (Block B), final line, phrase *"**Still true:** the shell grants **every** role `fkit-team`"* | The shell no longer **grants** any skill. The `skillOverrides` "off"-list `build_settings()` wrote was **retired by ADR-018** (`claude/fkit-claude.sh:263` — *"Retired here (task 43 / ADR-018…): the old `skillOverrides` 'off' list"*); `build_settings()` now emits only `{"hooks":{…}}`, and ownership is enforced by a `PreToolUse` **deny** hook. The substance (every role owns `fkit-team`) is correct and verified. The **mechanism framing is stale**, and because this is *newly written* 2026-08-02 text — not a pre-existing site — **`0196`'s `skillOverrides` fence does not cover it**, so nothing downstream will catch it. Novel; raised by neither the worker nor Codex. |
| R3 | 1 | low | same file — §Related, `Code:` line, `claude/fkit-claude.sh:14-18,29,75-103,151-199` | The worker's self-declared residual `R-third-site-remains` names **§Context lock bullet 2** as *the* remaining site. A **second** un-annotated site still points at `claude/fkit-claude.sh:75-103` — `skills_for_role()`'s former address — in the §Related `Code:` line. **No work is lost:** `0197`'s brief explicitly scopes that exact line. **Not a defect in the ADR**; the defect is that the residual's singular wording would become the authority on "one site left", in a series where `0143` missed one site and `0158` missed six. Record-completeness only. |
| R4 | 1 | low | same file — §Decision 5 note (Block A), the ADR-012 §Decision 1 quotation | Presented inside quote marks as verbatim. Words are **exact**; the source's double quotes around *generated from it **or** dropped* become single quotes, and the source's bold on the opening sentence is dropped. Codex graded this a defect; **I downgrade it — PARTIALLY CORRECT, not a defect.** Nesting a double-quoted phrase inside a `*"…"*` italic quotation forces some disambiguation, and single quotes are a legitimate choice. Recorded so the owner may rule; the cheapest closure is a parenthetical *"(quote marks and bold normalized)"*. |

**Disproven / checked-clean — do not chase.** Every other factual claim in the 49 added lines verified against live code 2026-08-02:

- `skills_for_role()` is defined at `claude/skills-for-role.sh:48` **and nowhere else** (`.claude/skills-for-role.sh` is the gitignored refresh copy).
- Both quoted `skills-for-role.sh` header phrases are **verbatim**: *"the single source of truth for fkit role → skill ownership"* (line 1) and *"Extracted from fkit-claude.sh (task 43 / ADR-018)"* (line 3).
- **Exactly two** consumers source it: `claude/fkit-claude.sh:257` and `claude/skill-ownership-hook.sh:39`. `test/prove-red.sh` mutates the file by path but never sources it — not a third consumer.
- The hook is correctly identified as ADR-018's `PreToolUse` gate that denies a `Skill` call by invoking role (`claude/skill-ownership-hook.sh:129-132`).
- **No** file under `claude/agents/` (7 files) carries a `skills:` key — `grep -rn "skills:" claude/agents/` returns nothing.
- **All seven** arms of `skills_for_role()` begin with `fkit-team`; lead's arm holds exactly **five** skills.
- Both markdown links (`adr-012-…`, `adr-018-…`) resolve to files that exist.
- **⚠️-not-⛔ is correct.** §Decision 5 itself offered *"generated from it **or** dropped"*; ADR-012 §Decision 1 took the second branch **citing that very offer**. The invariant (one source of truth) is in force; nothing was overturned. ⛔ would have been wrong. Both reviewers concur independently.
- **Block B's cross-reference leaves a §Context-only reader under-specified, not misinformed** — it states the file moved and names §Decision 5 as the binding site. Deliberate single-point-of-truth tradeoff, not a defect. Both reviewers concur.
- **Block B's indent-0 placement reads as a correction, not the ADR's own voice** — blockquote form, dated ⚠️ header, and *"the passage above"* anchor it backward; no reader attaches it to the `## Decision` heading below. Not a defect. Both reviewers concur.

**Form compliance — all six binding rules met:**

| Rule | Verdict |
|---|---|
| 1. Additions only, `−0` | ✅ **independently re-derived, two ways** (see Evidence below) |
| 2. ⚠️/⛔ not collapsed | ✅ Block A argues the distinction explicitly |
| 3. Placement below the claim | ✅ both blocks |
| 4. No `:NNN` into a mutable file | ✅ every new citation is file + heading/function + quoted phrase |
| 5. Header bullet = one wrappable item | ✅ 2-space continuation, no blank line — renders as one list item |
| 6. `Status:` stays `accepted` | ✅ line 3 unchanged |

**Owner-ruling compliance — all four met:** OQ-1 (header continuation **appended**; existing line byte-identical, proven by `−0`) · OQ-2 (Block A names §Context lock bullet 2 without annotating it) · OQ-3 (`0197`'s brief untouched — untracked, mtime `15:47:43`, hours before this task's `18:48:11` edit) · frozen-ledger ruling (no review-ledger path re-pointed).

**Scope discipline — clean.** Only the ADR was modified by this task. `ai-agents/wiki-vault/` untouched. The `0196`/`0197`/`0198`/`0171`/`0199` briefs untouched. The sprint board's last write (`18:38:52`) **precedes** this task's ADR edit (`18:48:11`) — its changes are the producer's `0143`/`0158` closures and the `0190`–`0199` filing addendum, not this worker's. No source file, no test, no task status changed.

**Size overrun is not scope creep.** +49 against a +26 plan estimate. The extra ~23 lines are the *"Why ⚠️ and not ⛔"* rationale, the OQ-2-authorized *"Named, not repaired here"* paragraph, and the fuller ADR-012 quotation. No claim outside the task's scope was added.

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

**Round 2 — written 2026-08-02 by the coder-side worker (fkit-architect, spawned by
`fkit-sprint-ship-loop`). Every finding verified first-hand against live code before any verdict was
written; the reviewer's measurements were re-run, not inherited.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **AGREE — CORRECT** | **Defect** (precision, medium) | ADR reworded, round-2 append. `claude/fkit-claude.sh` **defines no `skills_for_role()` of its own — it only sources it**, plus a parenthetical stating it does define other functions (`build_settings()` named) and that the claim is scoped to `skills_for_role()` alone. | **fixed** |
| R2 | **AGREE — CORRECT** | **Defect** (stale mechanism, low) | ADR reworded, round-2 append. *"Still true"* → *"Still true in substance"*; the substance (every role owns `fkit-team`) kept and re-verified; the shell-grants framing replaced with the live mechanism — since ADR-018 the launcher grants nothing, `build_settings()` emits only hooks, ownership is a `PreToolUse` **deny** hook reading `skills_for_role()` at call time. | **fixed** |
| R3 | **AGREE — CORRECT** | **Record-completeness**, not an ADR defect | **No ADR change.** The residual `R-third-site-remains` is reworded to name **both** remaining sites (§Context lock bullet 2 **and** §Related's `Code:` line) and recorded below under *Accepted residuals*. | **residual reworded** |
| R4 | **AGREE with the reviewer's downgrade — PARTIALLY CORRECT, not a defect** (Codex graded it a defect; that grading is **rejected**) | **Frontier** (quotation-style preference) | **No change.** Owner ruled accept as-is. Words are exact — re-verified verbatim against ADR-012 §Decision 1 this round; the double→single quote normalization is forced by nesting inside `*"…"*`, and the dropped opening bold is a formatting artifact of the same nesting, not a wording change. The suggested *"(quote marks and bold normalized)"* parenthetical was **not** added. | **accepted as-is** |

**First-hand verification of each finding, this round:**

- **R1 — confirmed.** `grep -nE '^\s*(function\s+)?[A-Za-z_][A-Za-z0-9_]*\s*\(\)\s*\{' claude/fkit-claude.sh`
  returns **exactly eight** definitions: `_fkit_verfield`, `_fkit_is_source_checkout`,
  `_fkit_remote_sha`, `_fkit_remote_version`, `_fkit_reinstall`, `build_settings`, `set_tab_title`,
  `codex_preflight`. The reviewer's list matches name-for-name, with none missing and none extra.
  `skills_for_role` is **not** among them. So *"defines nothing"* was false as written and the narrower
  claim is true — exactly as the finding states. **The count "eight" was deliberately NOT written into
  the ADR**: a number like that drifts on the next function added, and this ADR is a mutable file three
  serial tasks are appending to. The scoping is carried by wording instead. Recorded here so the
  evidence is not lost.
- **R2 — confirmed.** `claude/fkit-claude.sh`'s comment above `build_settings()` reads *"Retired here
  (task 43 / ADR-018, replacing ADR-012 §3): the old `skillOverrides` 'off' list and the
  `CONSULT_SKILLS` always-on exception list it required."* The function's own signature comment reads
  *"→ .fkit/settings/<role>.json containing {"hooks":{…}}"*, and its `hooks=` assignment emits a single
  `{"hooks":{…}}` object — `PreToolUse` (Skill + AskUserQuestion), `Stop`, `UserPromptExpansion`. **No
  `skillOverrides` key is written anywhere.** The substance was re-checked too: all seven arms of
  `skills_for_role()` begin with `fkit-team`. So substance correct, mechanism stale — finding correct.
  The ADR-018 link target `adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md`
  was confirmed to exist before the link was written.
- **R3 — confirmed.** §Related's `Code:` line does carry `claude/fkit-claude.sh:75-103`,
  `skills_for_role()`'s former address. It names **no function**, so it is not a fourth statement of
  the wrong home — which is why R3 correctly grades it *not an ADR defect*. But the worklog residual's
  **singular** wording (*"the remaining site"*) would have become the authority on how many sites are
  left, and it is wrong by one. Reworded, not argued.
- **R4 — re-verified verbatim.** ADR-012 §Decision 1 reads *"The `skills:` frontmatter is inert and is
  therefore DROPPED, not generated. ADR-010 §5 offered "generated from it **or** dropped"; that choice
  is now settled as **dropped**."* Word-for-word identical to the ADR-010 quotation; only the inner
  quote marks and the opening bold differ. **Codex's defect grading is rejected on evidence** — a
  quotation's fidelity is in its words, and no word differs.

**Change surface of round 2 — two edits, both inside lines this task itself added.** No pre-existing
ADR-010 line was touched, so the load-bearing constraint holds with no exception:

| Proof | Command | Result |
|---|---|---|
| 1. against the pre-edit snapshot | `diff <snap> <file>` / `git diff --no-index --numstat` | **53 added, 0 removed**, zero `<` lines (was 49/0 at round 1; +4 from these two fixes) |
| 2. against `HEAD` | `git diff --numstat`; `git diff -U0 \| grep '^-[^-]'` | **`124  0`**; deletion grep empty; `git diff --check` clean |

`124 = 0143's uncommitted 71 + this task's 53.` The snapshot
(`adr-010.PRE-0195.md`, `shasum 0ff1a57eed9c31b8532fdb92a706706f725b12bd`) was **reachable and
unchanged** — no baseline had to be reconstructed. `- **Status:** accepted` still untouched.

**Tests:** `npm test` — see the worklog's decision log for the result recorded this round. No test
reads this ADR, so a green suite is a regression check, not evidence the notes are correct; the two
diff proofs and the live-code re-verification above are that evidence.

**Not done, deliberately:** no third site annotated (`0196`/`0197` fence, OQ-2), no `0197` brief edit
(OQ-3 — the producer's), no review-ledger path re-pointed (frozen-ledger ruling), no wiki write, no
task-status change, no commit.

### Round 3 — procedural conformance pass, 2026-08-02 (`@fkit-coder`; `/fkit-process-stateful-review` **invoked and read in full**)

**Why this round exists.** Round 2's responder was `fkit-architect`, which the ADR-018 `PreToolUse`
hook correctly denied the coder-owned skill; it applied the method by hand from its spawn instruction
and disclosed that it had never read the skill's own procedure text. The owner ruled a re-run as
`@fkit-coder`. **The hook permitted the skill this round.** Its procedure was read in full and compared
against what round 2 recorded. **R1–R4's verdicts are owner-dispositioned and are NOT reopened here** —
this round checks *procedural completeness*, nothing else.

**Steps round 2 missed, skipped, or did differently — and what was done about each:**

| Skill step | What round 2 did | Round 3 |
|---|---|---|
| **Step 0 — skim `knowledge-base/decisions/` and treat each ADR's *"Re-raise only if"* as an accepted residual** | **NOT DONE.** No ADR loop-check recorded. ADR-012/ADR-018 appear only as *evidence*, not as settled decisions checked against the findings. | **Done this round.** 10 of 37 ADRs carry a *Re-raise only if*. **None** of them suppresses R1–R4. **But one is binding and was missed: [ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)**, which names *this skill's* Step-6 close line as bound by it and is the **only durable home** for the close bar (its own §Binds says no skill was edited to carry the pointer). See the close-bar question below. |
| **Step 2 — loop check first, loudly, + a suppressed-as-settled list** | **Partial.** The substantive check was done: R2 was tested against `Q4-scope-fence` and explicitly ruled outside it. The four inherited residuals were declared not-re-litigated. **No suppressed list was stated.** | **Suppressed as settled this review: NONE.** No finding matched a residual or an ADR whose re-raise condition is unmet. Stated so an empty list is distinguishable from a forgotten one. |
| **Step 3 — severity is the responder's to assign; never inherit the reviewer's label** | **Inherited.** The rows carry *"(precision, medium)"* and *"(stale mechanism, low)"* — identical to the reviewer's labels, with no blast-radius trace recorded. | **Re-derived independently. Both labels stand, on the responder's own reasoning:** R1 **medium** — no runtime blast radius at all (a knowledge artifact), but a *categorically false* claim inside the very note whose job is to correct a false claim is self-undermining, which is what carries the label, not reach. R2 **low** — stale framing, correct substance, in text no downstream fence would ever reach. Labels coincide with the reviewer's; the derivation did not. |
| **Step 3.5 — regression / oscillation check against the response history, before applying** | **Partial.** The two recorded judgment calls *are* pre-application checks against settled residuals (`Citation form` for the suppressed function count, `Q4-scope-fence` for R2's wording). Never framed as a regression check, and the round-2 fix lines were not re-tested against the form residuals. | **Missing arms run this round, all clean.** `Citation form`: the only two `:NNN` citations anywhere in this ADR's added lines sit at `:51` and `:157` — **both `0143`'s**, and both *quoting a pre-existing stale pointer* rather than writing a new one; **`0195` added no `:NNN`.** `R5-header-form`: the `- **Corrections:**` item still parses as **one** list item (continuation-indented, no blank line). `−0`: re-proven both ways below. **No oscillation, no regression.** |
| **Step 4 — Status cell must use the prescribed vocabulary** (`pending approval` · `✅ done` · `won't fix (frontier)` · `disproven` · `closeout (re-litigation)` · `blocked`) | **Not met.** All four cells use ad-hoc values — `fixed`, `fixed`, `residual reworded`, `accepted as-is`. | **Mapped, not rewritten** (the round-2 rows stay as the owner saw them — the same additions-only discipline this ADR is built on): R1 `fixed` → **`✅ done`** · R2 `fixed` → **`✅ done`** · R3 `residual reworded` → **`✅ done`** (the action was completing a residual, and it was completed) · R4 `accepted as-is` → **`won't fix (frontier)`**. No verdict or disposition changes. |
| **Step 4/5 — Status `pending approval`, then gate on the owner** | **Legitimately overridden**, not missed: the owner dispositioned each of R1–R4 individually via `AskUserQuestion` **before** the worker was spawned. Recorded per finding in the worklog's decision log. | **No gap.** |
| Step 1 · Step 3 (verify against live code) · Step 6 (apply, update rows, full What/Why/Re-raise residuals, no commit) | **Done, and done well.** All four findings re-verified first-hand with quoted evidence; all three round-2 residuals carry the complete What / Why / Re-raise triple. | **Both applied fixes confirmed present in the deliverable this round** — R1 at §Decision 5's note (*"defines no `skills_for_role()` of its own — it only sources it"*, with the scoping parenthetical) and R2 at §Context's note (*"Still true in substance"* + the `PreToolUse` **deny** mechanism). Recorded action matches shipped text. |
| **Step 5 — convergence call** · **Step 7 — final report** | Not in the ledger. May have been in the worker's return message. | **Not verifiable from here** — stated rather than assumed clean. Convergence call supplied below. |
| **Ownership — never edit the reviewer's rows** | No internal sign of tampering (the findings read in the reviewer's own voice, e.g. *"I downgrade it"*). | **Not provable either way**: `review.md` is untracked, so no baseline exists to diff against. Flagged, not claimed. |

**`−0` re-proven independently this round** — snapshot `adr-010.PRE-0195.md`, `shasum
0ff1a57eed9c31b8532fdb92a706706f725b12bd` (**matches** the round-1/round-2 record; reachable, no
baseline reconstructed): snapshot → current **`53  0`**, `diff | grep '^<'` empty; `HEAD` → current
**`124  0`** (= `0143`'s uncommitted 71 + this task's 53), `git diff -U0 | grep '^-[^-]'` empty.
`- **Status:** accepted` unchanged. **This round changed no ADR line** — its only writes are this
section and the worklog's round-3 decision-log entry.

**Convergence call (Step 5).** **Converged on the work product.** Both work-product defects (R1, R2) are
fixed and confirmed in the shipped text; R3 is an **own-record** finding, recorded as a residual with a
re-raise condition; R4 is an accepted frontier. Round 3 found **no new defect in the deliverable** — every
gap it found was in the *process record*, and all of them are now closed except the one question below.
**Recommend: no further review round on the ADR itself.**

**The ledger's `Status` — surfaced as a question, RULED by the owner 2026-08-02.** Step 6 says set
`closed-out` once *"all novel findings are closeout / disproven / accepted and nothing blocking
remains"*. Read literally that condition is **not** met (R1 and R2 were *fixed*, which is not one of the
three listed dispositions), so `in-review` was literally correct. Read through **ADR-034** — the ADR
Step 0 required loading, and which explicitly rebinds this very line — the bar is *"the swept **work
product** is clean"*, and by that bar it **is** met. The responder did **not** flip the header on its
own: the choice decided whether another reviewer pass ran before the close, which is a scope call. It
was put to the owner, who **ruled the ADR-034 bar met and closed the ledger with no round-3 reviewer
pass**, accepting the stated cost (the +4 fix lines get no independent reviewer eyes). Header updated
accordingly.

> **📌 On the record for `0200` — the process finding, not the task finding.** The **only** reason
> ADR-034 entered this review at all is **Step 0's ADR skim**, the step round 2 never ran. That skim was
> the substantive gap in this round's analysis, and it turned out to **decide the close bar** — without
> it the ledger would have closed (or not) on Step 6's literal wording alone, unaware that a ratified ADR
> had rebound that exact line. This is precisely the re-derivation risk **ADR-034's own §Binds predicted
> in writing**: it records that **no skill was edited** to carry the pointer, that this skill's Step-6
> line is one of the three surfaces bound by it, and that *"until those pointers exist, this ADR is the
> **only** durable home for the bar and each role must reach it here."* A responder that skips Step 0
> cannot reach it. **The follow-up worth ranking is landing those three pointers** — in
> `fkit-process-stateful-review` Step 6, `fkit-stateful-review`'s *"when warranted"*, and
> `fkit-task-ship-loop`'s termination condition — so the bar stops depending on one optional skim.

## Accepted residuals (shared, do-not-re-litigate)

Inherited from `0143`, owner-ratified, binding on this task and followed by it. **Not re-litigated in round 1.**

- **R1-placement (`0143`)** — What: a dated correction note goes **BELOW** the claim it corrects, departing from the vault's "banner above claim" convention · Why (structural): owner ruling; an above-placement banner separates the claim from the record of what was decided, and the ADR's byte-identical text is the record · Re-raise only if: the owner reopens the placement convention.
- **Citation form (`0143`)** — What: **no `:NNN` line numbers into a mutable file**; anchor by file plus function/heading plus quoted phrase. **Permitted, not mandated** · Why (structural): line numbers displace on every append, and this ADR is being appended to by three serial tasks · Re-raise only if: `0171`'s durable-citation-anchors convention page supersedes the form.
- **R5-header-form (`0143`)** — What: the `- **Corrections:**` header bullet is **one wrappable metadata item** carrying the ⚠️/⛔ legend, and is the one part of an `accepted` ADR an append-only correction may extend · Why (structural): the legend must be discoverable from the header without duplicating it at every note site · Re-raise only if: the item stops parsing as a single markdown list item.
- **Q4-scope-fence (`0143`)** — What: the `skillOverrides` parenthetical stays as shipped; Codex's *"excluded scope"* reading was ruled **PARTIALLY CORRECT, not a defect** · Why (structural): owner ruling Q4 fenced `skillOverrides` out as an unrelated cause; `0196` discharges the exclusion · Re-raise only if: `0196` closes without discharging it. **Note: R2 above is *not* covered by this fence** — R2 is newly written text, not the fenced pre-existing site.

### Accepted in round 2 — owner-dispositioned 2026-08-02 (`AskUserQuestion`, live lead session)

All three round-1 candidates were put to the owner and **ACCEPTED**. Recorded here with full
reasoning, so no later round re-argues them.

- **`R-third-site-remains` (`0195`) — REWORDED, then accepted.** What: after this task, ADR-010 still
  points at `claude/fkit-claude.sh` for `skills_for_role()` at **two** un-annotated sites, not one —
  (a) **§Context lock bullet 2**, which names the function and so states the wrong home outright, and
  (b) **§Related's `Code:` line**, a bare coordinate list carrying `claude/fkit-claude.sh:75-103`, the
  function's former address, naming no function · Why (structural): both sites are fenced out of this
  task — (a) to `0196` (the retired `skillOverrides` mechanism) and `0197` (stale line-ranges), (b) to
  `0197` — and OQ-2 authorized **naming** (a) in Block A without annotating it. **No work is lost:**
  `0197`'s brief already scopes the `Code:` line · Why the rewording was required: the round-1 wording
  called (a) *the* remaining site. In a series where `0143` missed one site and `0158` missed six, a
  residual that undercounts by one becomes the authority on "we're done" · **Re-raise only if** `0196`
  **and** `0197` both close with either site still pointing at `claude/fkit-claude.sh` for
  `skills_for_role()`.
- **`R-header-two-site-lists` (`0195`) — accepted as-is.** What: the `- **Corrections:**` header item
  now carries **two** site lists — the original (*"§Context and §Decision 3"*) and the appended
  continuation naming §Decision 5 and §Context's *"One real inconsistency"* passage. Accurate read
  whole; momentarily misleading read halfway · Why (owner ruling): the brief **pre-authorized** editing
  the first line in place, and the owner **declined** the pre-authorization (OQ-1a, append only). That
  buys `−0` outright with no exception clause, and keeps the header inside `0143`'s ratified
  `R5-header-form` ("one metadata *item* that may wrap") instead of carving a new exception out of the
  load-bearing constraint · **Re-raise only if** the item stops parsing as a single markdown list item,
  or a later append makes the stale first list actively wrong rather than superseded.
- **`R-size-overrun` (`0195`) — accepted as-is.** What: shipped **+49** at round 1 (**+53** after this
  round's two fixes) against a plan estimate of **+26** · Why (structural): scope is unchanged — the
  extra lines are the *"Why ⚠️ and not ⛔"* rationale, the OQ-2-authorized *"Named, not repaired here"*
  paragraph, the fuller ADR-012 quotation and wrapping, every one of them an element the approved plan
  itself specified. **No claim outside the task's scope was added**, which the reviewer verified
  independently · **Re-raise only if** a later ADR-010 append shows the same overrun ratio, which would
  make it an estimation-method problem rather than one task's wrapping.

<!-- Round 1 left these three as CANDIDATES pending the owner. Disposition arrived 2026-08-02:
     all three ACCEPTED, with R-third-site-remains reworded to name both sites. Recorded above. -->
