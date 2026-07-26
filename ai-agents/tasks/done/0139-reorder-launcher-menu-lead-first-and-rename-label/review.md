# Review — 0139-reorder-launcher-menu-lead-first-and-rename-label

Task: `ai-agents/tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/brief.md`
File(s) under review: `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh` (working-tree diff)
Status: **closed-out** (2026-07-25). All five findings — R1, R2, R3, R4, R5 — are dispositioned by the
owner and verified by the reviewer. No further review round.

⚠️ **Close-out is not a ship recommendation.** One deviation is open and belongs to the owner, not to
review: **the brief's verification step 4 (`fkit team` opens a lead session) is knowingly unmet**, by
the owner's own R1 ruling, and `brief.md:100` is deliberately left asserting it. The owner rules on
shipping with that gap; the task stays `🔄 In progress` until they do. Review has no finding against
it — it is a recorded decision, not a defect.

Reviewers run (round 1): fkit-reviewer own pass + Codex adversarial pass (`codex exec`, codex-cli
0.145.0, exit 0). Both ran — coverage is full, not partial.

Reviewers run (round 2): fkit-reviewer own pass + a second Codex adversarial pass over the round-2
delta (`codex exec`, exit 0). Both ran — coverage is full, not partial.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `claude/fkit-claude.sh:192` | `fkit team room` typed unquoted (two argv words — the natural spelling of the retired label) now launches a lead session and passes the stray word `room` through to `claude`; at HEAD it was a loud `exit 2` usage error. Confirmed by running both launchers under the test harness. |
| R2 | 1     | low    | `claude/fkit-claude.sh:50` (also the header comment `:9`) | `$ROLES` — the role list the usage-error path prints — still orders `lead` **last**, contradicting the lead-first order this task establishes in the menu, `--help`, and the installer list. Raised independently by both reviewers. |
| R4 | 2     | low    | `claude/fkit-claude.sh:182-187` | The new ⚠️ anti-re-add comment points the next maintainer at **the fix the owner rejected** ("re-adding the alias needs the leftover word handled") and never records *why* it was rejected. It also presents the stray positional as the alias's defect, when that behavior is pre-existing and general to every role word. **Raised independently by both reviewers.** |
| R5 | 2     | low    | `brief.md:100`, `plan.md:107`, `worklog.md:116` | The task's own acceptance records still assert `fkit team` opens a lead session, which the revert made false. The coder disclosed `brief.md:100`; `plan.md:107` (verification step 3) and the stale `worklog.md:116` ("Brief step 4 now met", contradicted by `:150`) were not. |
| R3 | 1     | low    | `claude/fkit-claude.sh:192` | The new arm widens the set of argv spellings that reach the *intentional* after-a-named-role passthrough: `fkit team --resume` / `fkit "team room" --resume` now exec `claude … --resume`, where at HEAD both exited 2. Not a new hole — `fkit lead --resume` already did this (verified at HEAD) — but the surface is two spellings wider. |

### R1 — detail (the confirmed regression)

Verified empirically, both directions, via `test/harness.mjs` with the stubbed `claude`:

| argv | at HEAD | with the diff |
|------|---------|---------------|
| `fkit team room` | `code=2`, `claude` never exec'd, `fkit: "team" is not a role.` | `code=0`, execs `claude --agent fkit-lead --settings .fkit/settings/lead.json room` |
| `fkit team` | `code=2` (the bug this task fixes) | `code=0`, correct lead argv — **fix works** |
| `fkit "team room"` | `code=2` | `code=0`, correct lead argv — **fix works** |

Root cause: the menu reads a whole **line** (`IFS= read -r pick`), so its `"team room"` pattern sees
one string. The explicit-role path reads **argv**, where the shell has already split on whitespace —
so `"team room"` as a pattern only ever matches the *quoted* invocation, and the unquoted one falls
into the `team` arm leaving `room` behind as a positional. Claude Code treats a bare positional as
the session's initial prompt, so the user gets a lead session whose first prompt is the word `room`.

Blast radius traced: **the role lock is NOT bypassed** — `--agent fkit-lead` and
`.fkit/settings/lead.json` are both correct. The harm is (a) the loud ADR-010 usage error is lost for
this input, and (b) a junk initial prompt. Hence medium, not high.

Why it matters more than the row length suggests: the person the alias exists for is exactly the
person who learned the two-word label, and `fkit team room` is the spelling they will type. Of the
three spellings, the most likely one is the broken one.

Note: the in-file comment at `:187–191` claims the arm carries the "same alias set as the menu arm
below, on purpose". The alias *set* matches; the *behavior* does not, for the reason above.

Note on the obvious non-fix: dropping the `"team room"` pattern does **not** help — once `team` is
accepted at all, `fkit team room` still sets `role=lead` and still leaves `room` behind. The leftover
word has to be consumed explicitly (e.g. a `team` arm that shifts a following `room`), or leftover
non-flag positionals have to be rejected.

### Checked and cleared (no finding — recorded so they are not re-chased)

- POSIX `case` semantics: comments between arms are legal; no pattern in the new arm contains a glob
  metacharacter, so nothing matches unintentionally. Verified `Team`, `TEAM`, `team ` (trailing
  space), ` team`, `team-room`, `teamroom` all still `exit 2`.
- The `exit 2` guard itself is intact: `fkit bogus` and `fkit --resume` both exit 2 with `claude`
  never exec'd.
- Passthrough after a named role unaffected: `fkit lead --debug`, `fkit team --debug`,
  `fkit "team room" --debug` all produce correct argv with `--debug` appended.
- `$ROLES` is display-only — it is read at exactly one place (`:211`, the error message) and gates
  nothing. Reordering it cannot change acceptance.
- `claude/fkit-claude-init.sh:857–863`: column alignment is correct (every label padded to 13 cols),
  and the block's terminating `\n\n` sits on the last line (`wiki`) exactly once. No rendering
  regression.
- Menu block `:460–466` and arms `:473–479`: numbers, labels, and word aliases agree one-to-one; the
  `[1-7]` prompt and the `is not one of 1-7` error remain accurate.
- Removing `lead` from the generic `role="$1"` arm is behavior-identical for `fkit lead`.

---

## Round 2 — verification of the delta

### The coder's correction to R1 — checked, and CORRECT (it goes further than stated)

Verified independently against a **full copy of `claude/`** with only the launcher reverted to HEAD:

| argv | HEAD | round-1 working tree |
|------|------|----------------------|
| `fkit lead room` | `rc=0`, execs `… --agent fkit-lead … room` | identical |
| `fkit coder room` | `rc=0`, execs `… --agent fkit-coder … room` | identical |
| `fkit team room` | `rc=2`, no exec | `rc=0`, execs `… --agent fkit-lead … room` |

**Agreed, and broader than the coder claimed:** the stray-positional behavior is not merely
pre-existing for the `lead` spelling — it is general to **every** role word (`coder` confirmed). So a
narrow "consume the leftover word" fix would have made `team` stricter than all seven real roles, not
just `lead`. That strengthens the owner's revert.

One clarification for the record: the coder's invalidated probe was **their own** (a lone launcher
copy). Round 1's reviewer probe used a full `cp -R claude/` copy and did exec successfully, so the R1
table as written stands. The correction adds the `lead room` / `coder room` rows the review did not
have; it does not overturn R1, which reported the loss of the loud `exit 2` for `fkit team room` —
still accurate.

### Round-2 delta — verified

| Claim | Result |
|---|---|
| Revert is complete; explicit-role `case` back to HEAD shape | **Confirmed** — `diff` against HEAD shows the block is byte-identical apart from the new 6-line comment |
| `fkit team`, `fkit "team room"`, `fkit team room` | **All `rc=2`, no exec** — HEAD behavior restored |
| All seven role words + `adv` / `adversarial` / `adversarial-reviewer` | **Correct `--agent` + settings pair each** |
| ADR-010 guard | **Intact** — `fkit bogus`, `fkit --resume` → `rc=2`, no exec |
| `fkit lead --debug` passthrough | **Intact** |
| `$ROLES` reorder is display-only | **Confirmed** — read at exactly one site (`:210`, the usage-error `printf`). No loop, no `set --`, no `case` over it, no settings generation. Reordering cannot change acceptance. |
| Usage error output | **Confirmed verbatim:** `Roles: lead producer coder architect reviewer adversarial-reviewer wiki (or: adv)` |
| `npm test` | **Confirmed independently: 521 tests / 521 pass / 0 fail / 17 suites**, and `✓ hard gate PASSED` |
| `bash -n` + `sh -n` both scripts | **OK** — the comment between `role=""` and `case` is valid POSIX |
| No other site asserts `fkit team` works as a CLI word | **Confirmed outside the task folder.** Inside it, three do — see R5 |
| No launcher-contract assertion invalidated or left vacuous by the revert | **Confirmed** (Codex concurs) |

### R4 — detail

The comment's last sentence — *"Re-adding the alias needs the leftover word handled; do not re-add it
casually"* — describes exactly the narrow fix the owner **rejected**. A maintainer who follows it
consumes `room` in a `team` arm and thereby makes `fkit team room` stricter than `fkit lead room` and
`fkit coder room`: the very inconsistency that sent the decision to the owner. The comment also frames
the stray positional as something the alias caused, when it is the standing behavior of every role
word. Cost to fix: two sentences. No runtime effect, which is why this is low — but this comment is
the durable record of an owner-level decision, and as written it argues for the rejected option.

---

## Round 3 — R4 / R5 fixes verified, review closed

Reviewer pass only (no Codex pass: the delta is one comment plus two task-artifact edits, with **zero
executable-line changes** — confirmed by filtering the diff to non-comment lines, which shows nothing
new beyond the round-2 code already reviewed). This is a deliberate, stated scope reduction, not a
degraded run: there was no code for a second model to attack.

**R4 — SATISFIED.** Both halves of the finding are met by `claude/fkit-claude.sh:188-192`:
- *Record why the narrow fix was rejected* → "A `team` arm that consumed a following `room` was
  weighed and REJECTED for exactly that reason: it would make one spelling stricter than all seven
  real role words." ✅
- *Stop framing the stray positional as the alias's defect* → "The leftover word is NOT the alias's
  bug: `fkit lead room` and `fkit coder room` do the same thing and always have." ✅

Every factual claim in the amended comment independently checked and **true**: `fkit lead room` and
`fkit coder room` both pass the word through (verified at HEAD and now); the after-a-named-role
passthrough is declared intentional by the guard's own comment at `:212`; "the guard below" and "the
arm below" both resolve to real code (`:200` and `:477`); the menu arm still accepts `team` /
`team room` as picks. A maintainer following this comment now reaches the owner's conclusion, not the
rejected one.

**R5 — SATISFIED as split-ruled.** `plan.md:107` corrected with a dated, flagged amendment note;
`worklog.md:122` struck through and marked STALE with a pointer to P6; `brief.md:100` **confirmed
untouched**, per the owner's ruling that an author does not rewrite the acceptance criterion their own
change failed. The deviation is recorded in the worklog (`:13`, `:15`, `:158`, P6) and carried into
close-out. Reviewer agrees with the split: amending the brief here would have destroyed the evidence
the owner needs to rule on shipping.

### Round-3 verification (re-run, not taken on trust)

| Check | Result |
|---|---|
| `bash -n` and `sh -n` on `claude/fkit-claude.sh` | **Both OK** |
| `node --test test/*.test.js` | **521 tests / 521 pass / 0 fail / 17 suites** |
| `prove-red.sh` | **`✓ hard gate PASSED`** |
| Delta is comment-only | **Confirmed** — no executable line changed vs the round-2 state |
| `fkit team`, `fkit "team room"`, `fkit team room` | **rc=2, no exec** |
| All seven roles + `adv` / `adversarial` / `adversarial-reviewer` | **Correct `--agent` + settings pair each** |
| `fkit bogus`, `fkit --resume` | **rc=2, no exec** — ADR-010 guard intact |
| `fkit lead --debug` | **`--debug` passed through** |
| Bare `fkit` (no tty) | **→ `fkit-lead`** |

### Convergence call (round 3) — CONVERGED, review closed

Zero new findings. Every finding across three rounds is closed: R1 fixed by revert, R2 fixed, R3
recorded as a residual, R4 fixed, R5 fixed as split-ruled. Two coder corrections were offered and both
were checked rather than accepted on trust — one was right (the general stray positional, which the
reviewer then extended to `coder`), one was a self-correction that did not affect the reviewer's own
evidence. **No round 4.** The only open item is the owner's ship ruling on the knowingly-unmet brief
step 4, which is a decision, not a review finding.

### Convergence call (round 2)

Round 2 is **not** re-litigation: R4 and R5 are novel, and R4 was reached independently by both
reviewers. But it is converging — every round-1 finding is closed, verified, and neither new finding
touches runtime behavior. **Recommendation: disposition R4 and R5, then close out without a round 3.**
A comment edit and a records amendment do not need another two-reviewer pass; the coder's own read-back
is sufficient evidence.

## Coder response

<!-- CODER-OWNED. The reviewer does not write here. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect (regression I introduced) | **Owner ruled: revert the `team` alias entirely.** The explicit-role `case` is back to HEAD behavior (`lead` in the generic arm; no `team` / `team room`), plus a ⚠️ comment recording why re-adding it is not casual. | **fixed (by revert)** |
| R2 | **CORRECT** | Defect (consistency) | **Owner ruled: fold into 0139.** `$ROLES` (`:50`) reordered lead-first; header comment (`:9`) likewise. | **fixed** |
| R3 | **CORRECT as stated** (reviewer's own "not a new hole" is right) | Frontier-move | **Owner ruled: record as an accepted residual.** No code change — and the R1 revert made the *widening* moot; what is recorded below is the pre-existing passthrough that survives it. | **recorded, no code change** |

### Owner dispositions, 2026-07-25 (relayed live from the coder session)

- **R1 → revert.** Not one of the three narrow fixes: the alias itself goes. Consequence stated
  plainly: **`fkit team` errors again** (`fkit: "team" is not a role.`), so **the brief's verification
  step 4 is unmet as written** — it asks that `fkit team` open a lead session. `team` / `team room`
  remain **menu-pick aliases**, which is what they were before this task.
- **R2 → fold into 0139.**
- **R3 → record.**

### Coder verification of each finding (run independently, not taken on trust)

**R1 — reproduced exactly.** With the working-tree launcher, `fkit team room` →
`--agent fkit-lead --settings .fkit/settings/lead.json room`, rc=0. Against HEAD → `rc=2`, no exec.
The regression is real and it is mine.

> ⚠️ **One correction to the framing, from evidence the review did not have.** My first HEAD probe
> used a *lone copy* of `fkit-claude.sh` in a temp dir; it cannot resolve its sibling resources and
> returns rc=1 without exec-ing, which silently invalidates every exec-path comparison. Re-run against
> a **full copy of `claude/`** with only the launcher reverted to HEAD:
>
> | argv | HEAD | working tree |
> |---|---|---|
> | `fkit lead room` | `rc=0`, execs `… --agent fkit-lead … room` | identical |
> | `fkit team room` | `rc=2`, no exec | `rc=0`, execs `… --agent fkit-lead … room` |
> | `fkit lead --resume` | `rc=0`, execs with `--resume` | identical |
>
> **So the stray-positional behavior is pre-existing for the `lead` spelling** — `fkit lead room` has
> always opened a lead session whose first prompt is `room`. What my change did was extend that same
> behavior to the `team` spelling, which previously errored. That does not make R1 wrong — the loud
> error *was* lost for `fkit team room`, exactly as reported. It does change what a fix costs: a
> `team` arm that consumes a following `room` would make **`fkit team room` stricter than
> `fkit lead room`**, i.e. it fixes the new spelling by making the two spellings disagree. Rejecting
> leftover positionals in general would fix both, but that is a behavior change to the `lead` path
> and squarely outside this task.

**R2 — confirmed by reading.** `:50` is `ROLES="producer coder architect reviewer adversarial-reviewer
wiki lead"` (lead last) and the header comment `:9` reads `fkit producer|architect|reviewer|wiki|adv|lead`.
The reviewer's "display-only" clearance is also confirmed: `$ROLES` is read at exactly one site, the
usage-error message, and gates no acceptance.

**R3 — confirmed, including the reviewer's own qualifier.** `fkit lead --resume` execs with
`--resume` at HEAD too, so the after-a-named-role passthrough is pre-existing and intentional
(the comment at `:203` says so). My change widens which *spellings* reach it by two. Agreed: no fix.

**Why none of these was applied autonomously.** The ship-loop lets me apply a fix without asking only
when it is mechanical, in-plan, and `CORRECT`. R1's three candidate fixes trade off against each other
(and one of them creates a `lead`/`team` inconsistency), R2 is outside the approved plan's file scope
even though it is one line, and R3 is a frontier-move. All three stop for the owner.

### Round-1 fixes applied, and re-verified after the last code change

| Change | File:line | Verified |
|---|---|---|
| `team` / `team room` removed from the explicit-role `case`; `lead` restored to the generic arm; ⚠️ comment added | `claude/fkit-claude.sh:182-191` | `fkit team`, `fkit "team room"`, `fkit team room` → **all rc=2, no exec** (HEAD behavior restored) |
| `$ROLES` reordered lead-first | `claude/fkit-claude.sh:50` | usage error prints `Roles: lead producer coder architect reviewer adversarial-reviewer wiki (or: adv)` |
| header comment reordered lead-first | `claude/fkit-claude.sh:9` | read back |

Re-verification after those edits:

- `npm test` → **521 tests / 521 pass / 0 fail**, `✓ hard gate PASSED` (`prove-red.sh`).
- `bash -n` on both scripts — OK.
- Every real role word still resolves correctly: `lead`, `producer`, `coder`, `architect`,
  `reviewer`, `wiki`, `adv`, `adversarial` → the right `--agent` + settings pair.
- `fkit lead --debug` still passes `--debug` through; `fkit bogus` still exits 2 (ADR-010 guard).
- The pty menu suite re-run: **16/16**, unchanged — the menu still accepts `team` and `team room` as
  picks, which is the behavior the revert deliberately preserves.

## Accepted residuals (shared, do-not-re-litigate)

*The four entries below were added by the reviewer in round 2, recording the owner's dispositions of
R1, R2 and R3 relayed from the coder session on 2026-07-25. The entry immediately below was added in
round 3 for R5.*

- **Brief verification step 4 is knowingly unmet, and `brief.md` is deliberately not amended**
  *(owner disposition of R5, 2026-07-25)* — What: `brief.md:100` still asserts that `fkit team` opens
  a lead session; after the R1 revert it does not, and the line stays as written. `plan.md` and
  `worklog.md` were corrected with dated amendment notes; the brief was not · Why (structural): a
  brief's acceptance criteria belong to the producer and the owner. The author of the change that
  failed a criterion must not quietly rewrite that criterion — leaving it visibly unmet, with the
  deviation flagged at close-out, is what lets the owner rule on shipping with full information ·
  Re-raise only if: the owner rules on the deviation and the brief is amended by whoever owns it, or
  the criterion is met by a later change.

- **`fkit team` is a menu-pick alias only, never a CLI word** *(owner disposition of R1, 2026-07-25)*
  — What: the explicit-role path accepts the seven real role words plus `adv` / `adversarial`; `team`
  and `team room` are accepted **only** as menu picks, exactly as before this task. `fkit team` exits
  2 · Why (structural): the menu reads a whole line, the CLI reads argv already split on whitespace,
  so the two-word label cannot behave identically on both paths. Every narrow fix (consuming a
  following `room`) would have made `team` **stricter** than every real role word — verified: `fkit
  lead room` and `fkit coder room` both pass `room` through to `claude` and always have. The owner
  chose to drop the alias rather than introduce that asymmetry. **Knowingly accepted consequence: the
  brief's verification step 4 is unmet as written** · Re-raise only if: the leftover-positional
  behavior is changed for *all* role words, at which point the alias can be re-added consistently.
- **Stray positional after a real role word** — What: `fkit <role> <word>` passes `<word>` to `claude`
  as the session's initial prompt; there is no rejection of leftover non-flag positionals · Why
  (structural): pre-existing for all seven role words, and the after-a-named-role passthrough is
  deliberate (the guard's own comment at `:203` says so) · Re-raise only if: it is shown to bypass the
  role lock — it does not today; `--agent` and `--settings` are correct in every case checked.
- **After-a-named-role passthrough reaches `--resume`** *(owner disposition of R3, 2026-07-25)* —
  What: `fkit lead --resume` execs `claude --agent fkit-lead --settings … --resume`, and the same
  holds for every named role · Why (structural): pre-existing at HEAD and intentional — args after a
  named role pass through by design (ADR-010's guard covers the *no-role* case only). The round-1
  alias briefly widened which spellings reached it; **the R1 revert made that widening moot, so what
  is recorded here is only the pre-existing passthrough that survives** · Re-raise only if: evidence
  appears that `--resume` overrides the pinned `--agent`, which would make it a genuine role-lock
  bypass rather than an intentional passthrough. Untested — it requires launching a real `claude`.
- **`$ROLES` ordering is display-only** *(owner disposition of R2, 2026-07-25: folded into 0139)* —
  What: `ROLES` at `:50` is now lead-first, matching the menu, `--help`, and the installer list · Why
  (structural): verified to be read at exactly one site (the usage-error message); it gates no
  acceptance, so its order is presentation, not contract · Re-raise only if: a second read of `$ROLES`
  is added that depends on its order.

- **Silent mis-pick after renumbering** — What: the menu renumber shifts every role except lead down
  one position, and an old muscle-memory pick lands in a different role's session with no warning ·
  Why (structural): a confirmation prompt would tax every correct pick to catch a rare wrong one; the
  owner weighed and accepted this cost explicitly on 2026-07-25 · Re-raise only if: a mis-pick path is
  found that is not merely "the number moved" — e.g. one that launches with the wrong `--agent` or the
  wrong settings file. (Reviewer checked this in round 1: every menu number maps to the correct
  agent+settings pair. The record is correct.)
- **No launcher-contract test for the new `team` / `team room` words** — What: `test/launcher-contract.test.js`
  covers the 7 role words plus `adv` / `adversarial`, but not the words added by this task · Why
  (structural): the owner ruled the coverage gap becomes a separately named follow-up task rather than
  growing 0139's scope · Re-raise only if: the missing coverage hides a demonstrable defect in the
  current code. **This condition IS met for R1** — a test asserting `fkit team room` had already
  caught it — so R1 is reported rather than suppressed, and the follow-up task should carry the
  unquoted two-word case explicitly. **Round-2 update:** after the R1 revert there are no new CLI
  words left to cover. What the follow-up task should now pin is the **menu** picks `team` /
  `team room` (still accepted, still untested) and the negative CLI assertions `fkit team` /
  `fkit team room` → `rc=2, no exec`, which is what stops the alias being re-added by accident.
- **Out of scope by owner ruling (tasks 0140 / 0141)** — What: `claude/agents/fkit-lead.md`, all
  README files, `CLAUDE.md`, `AGENTS.md`, `ai-agents/knowledge-base/architecture.md`,
  `claude/skills/fkit-team/SKILL.md`, `ai-agents/wiki-vault/` — every stale "menu option 7" citation
  and every remaining "team room" in prose · Why (structural): the owner split the prose retirement
  and the wiki resync into their own tasks on 2026-07-25 · Re-raise only if: a file in that set is a
  *behavioral* dependency of the launcher, not prose.
