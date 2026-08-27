# Review — 0253

Task: 0253 — [brief](./brief.md)
File(s) under review: `README.md` (9 insertions, 2 deletions), `ai-agents/tasks/backlog/0253-…/worklog.md` (new)
Status: in-review

**Verdict (Round 1): ⚠️ Changes requested — 1 low defect (none blocking).** Four further low findings
are dispositions, not defects.

**Reviewers run:** my own pass (executed commands — see below) **and** the Codex adversarial pass
(`codex exec --sandbox read-only`, gpt-5.6-sol). **Coverage caveat, per ADR-042 D1:** Codex read files
and ran read-only shell (`rg`, `git hash-object`, `awk`) — two of its reads independently agree with
mine (plan blob `1c3ffd8…`, 13 over-100 lines). It **did not and cannot** run the test suite, build a
fixture, or execute a mutation. **Nothing Codex reports is a measurement.**
⚠️ My first Codex invocation was wasted by my own over-restrictive prompt ("do not run commands") and
Codex correctly refused rather than fabricate. The second run, with read-only reads permitted, is the
one reported here.

⚠️ **I did NOT re-run `npm test`.** The worklog's 723/723 at 456.46 s and 460.49 s are the Build
worker's measurements, **not reproduced by me**. Reason: the working tree carries 24 other tasks'
changes and another agent was writing during this review, so a run would measure a moving tree and any
red would be unattributable to 0253. The change is root-`README.md`-only, which is in neither
`claude/structure-manifest.tsv` nor `claude/structure-spec.md`, so it cannot move a suite.

**The one flagged deviation from approved plan text — CONFIRMED CLEAN, by running.** The Build worker
re-wrapped the new paragraph's line breaks. I verified in Python that the whitespace-joined words of
`README.md:35-40` are **exactly equal** to `plan.md:52-56`, and that both render to **identical HTML**
after whitespace collapse. The plan's printed block really does violate the plan's own ≤100 rule
(lines of 99/103/99/101/83 bytes); the shipped wrap peaks at 97 bytes. No trailing whitespace, so no
accidental hard breaks. **The "only one wrap works" claim is not falsified** — a wrap must keep
`…and nothing tells you` unbroken for Step 3's literal grep, and stay ≤100; the shipped one does both.

**Worklog evidence I reproduced myself, by running:** Step 2 strong form (exactly the two `:35-36`
deletions), `:31-33` byte-identity vs `HEAD`, Step 5 citation sweep (empty), Step 7 width (14 → 13,
`comm -13` of the over-100 sets empty), `git diff --stat -- README.md` (9+/2-), the three preservation
greps, and `grep -c RELEASING README.md` → 0. **All agree with the worklog.**

**Corroboration the plan did not cite:** ADR-015 §1 independently records that *"`fkit update` re-runs
`install.sh` and refreshes `~/.local/share/fkit`, the install share. It **never writes to a consuming
project**"* — the same claim the new paragraph makes.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | low | `README.md:35` | **Defect (imprecision).** *"It refreshes the installed copy and stops there"* is **not true in a source checkout**: the `fkit update` arm hits `_fkit_is_source_checkout` first and exits 1 with *"this is a source checkout … update it with 'git pull'"* (`claude/fkit-claude.sh:111-114`). It refreshes nothing there. Mitigated but not covered by the adjacent carve-out at `README.md:33`, which is about the **auto-check**, not about `fkit update` failing. Blast radius near zero — the error is loud and tells the reader exactly what to do, and the affected reader is an fkit developer, not the `curl \| sh` audience. **Raised by Codex; confirmed by me reading the code.** |
| R2 | 1 | low | `README.md:38-39` vs `README.md:54` | **Frontier-move, not a defect — for the owner to rule.** The new text says stale agents/skills mean *"nothing tells you"*; fifteen lines later `:54` says *"A launch also tells you … when your project's fkit-managed structure diverges from what the installed version ships"*. Both are true — `.claude/` is outside the conformance surface (`grep -c '^\.claude' claude/structure-manifest.tsv` → **0**; `grep -c '\.claude' claude/structure-spec.md` → **0**), and the notice at `claude/fkit-claude.sh:507` runs **after** the refresh at `:358`, so it can only ever read clean. But the README never defines *"fkit-managed structure"*, and the repo's own code calls those very files fkit-managed (`claude/fkit-claude-init.sh:568-569`). A reader can conclude the divergence line would catch this. ⚠️ **The obvious remedy — scoping `:54` to `ai-agents/` — is exactly what `plan.md:62` deliberately avoided, to keep the wording neutral pending `0255`.** Fixing it here would pre-empt an open architect decision. **My pass only.** |
| R3 | 1 | low | `README.md:26-27` | **Frontier-move, not a defect — for the owner to rule.** `:26` says *"`fkit` sets the project up **if needed** (… installs the agents and skills into `.claude/` …)"*, which reads as conditional; the new paragraph asserts the launch **unconditionally** rewrites those two globs. Both describe the same code (`claude/fkit-claude-init.sh:481-488` is an unconditional `rm`+`cp` on every launch), so nothing is false — but the new paragraph makes `:26`'s imprecision load-bearing in a way it was not before. `plan.md:90` weighed this exact line and chose to leave it (*"imprecise, not wrong"*). Recording it so the owner rules rather than the plan. **My pass only.** |
| R4 | 1 | low | `worklog.md:93` | **Worklog-only; no README consequence.** The Step-4 row claims a *"Complete caller set"* and *"only on launch"*. That holds for **programmatic** callers, but `claude/fkit-claude-init.sh:19` documents direct human invocation as a supported usage (*"Usage: `claude/fkit-claude-init.sh <project-root>`"*), and this repo's own `CLAUDE.md` instructs exactly that. So refreshing `.claude/` is not *only* reachable via a launch. **The shipped README is unaffected** — it never says "only on launch", and it offers `FKIT_SETUP_ONLY=1 fkit` as the non-session path. The worklog bounded the claim against *future* callers but not against manual invocation. **Raised by Codex; confirmed by me reading the code.** |
| R5 | 1 | low | `worklog.md:91` | **Worklog-only; conclusion unaffected.** The evidence cell says of `install.sh` that *"`SHARE` and `BIN` are its only write targets"*. Literally false: it also creates and populates a temp dir (`install.sh:27` `TMP="$(mktemp -d)"`, `:31` `mkdir -p "$TMP/src"`), trap-cleaned at `:28`. The load-bearing conclusion — **it never writes a consuming project** — still holds, and is independently corroborated by ADR-015 §1. Precision of the recorded evidence, not of the shipped prose. **Raised by Codex; confirmed by me reading the code.** |

### Raised and DISPROVEN — recorded so the coder is not asked to chase them

- **Codex: "setup is best-effort and may fail, so the launch may not refresh"** (`README.md:36-38`).
  True that init is guarded (`claude/fkit-claude.sh:357-369`) — but **that path is loud**, not silent:
  `:371-377` prints *"⚠ fkit could not finish setting up this project… fkit-managed files may be
  missing or stale (agents, skills, or the `ai-agents/` tree)"*, and `:386-390` refuses to start at all
  when no agent exists. So it neither falsifies *"picks up on next launch"* (which describes the
  success path) nor undermines *"nothing tells you"* (which is about the **no-relaunch** window).
  **No finding.**
- **Codex: "mtimes do not prove authorship"** (`worklog.md:56-61`). Over-narrow. Every one of the 24
  files has an mtime **at or before** `19:33:42`, and the worker's session began `19:35:03`. A file
  last modified before a process existed cannot have been modified by it, absent deliberate
  backdating. The mtime argument is sound for the use it was put to. **No finding.**

### Verified and clean — no finding

- Every factual claim in the new paragraph, read against the code: `install.sh` writes only
  `$SHARE`/`$BIN`/`$TMP` (`:20-21`, `:27`, `:41-43`, `:77`) and never a project; the update arm
  `exit 0`s at `claude/fkit-claude.sh:121`, well before the init calls at `:358`/`:360`; the refresh
  really is exactly the two globs the sentence names (`claude/fkit-claude-init.sh:481-488`).
- **`FKIT_SETUP_ONLY=1 fkit` works exactly as the sentence promises, and is fully non-interactive.**
  Bare `fkit` leaves `role=""` with `$#` = 0, so the not-a-role guard at `:236` does not fire; the
  exit at `:511-515` precedes the fresh-project branch (`:546-583`), the menu (`:586`), and both
  `exec claude` sites (`:583`, `:645`). **A point neither the plan nor Codex made:** it also precedes
  the intake, which is invoked only at `claude/fkit-claude.sh:575` — so it can never trigger the
  terminal questionnaire, even on a never-set-up project. And it precedes the `claude` presence check
  at `:516`, so it works without Claude Code installed.
- **The `:35-36` correction is correct and minimal.** Exactly two lines changed; the paragraph's real
  subject (`ai-agents/` is never rewritten) is intact and remains true.
- **Third collision site: none.** I read `README.md:1-119` in full. `:100-101` (the Layout table)
  *supports* the new text rather than colliding. `:47-52` untouched and unaffected. Only R2 and R3.
- **`0255` coupling: the wording achieves its goal.** *"nothing tells you"* names the user-visible
  outcome and no mechanism, so it forecloses nothing `0255` might decide. Note for later, not now: a
  detector that runs **at launch** could never falsify it (the launch refreshes first); only a
  check outside a launch would, and that would be a normal docs-follow-behavior edit.
- **Observation, no action recommended.** The paragraph never says *when* the staleness is observable —
  entering via `fkit` always refreshes, so it bites only when the project is opened another way
  (plain `claude`, an IDE, another harness). Saying so would go beyond owner-ruled wording; recorded
  only so nobody mistakes the omission for an oversight.

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

**Round 1, 2026-08-13.** Every finding was verified against the code **before** any action — the
reviewer's notes are inputs, not orders (`CLAUDE.md` §Review Notes). **All five verified CORRECT;
none was refuted.** R4 and R5 came from Codex, which measured nothing (ADR-042 D1), so both were
re-read from disk rather than taken on trust; both held.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | **Defect** (accuracy, in an accuracy task) | Added one parenthetical clause after the affected sentence: *"(In a checkout of this repo it refuses and points you at `git pull`.)"* — tone-matched to `:33`'s existing `(Silence it with …)` carve-out. Paragraph re-wrapped to absorb it; **no other word changed.** | **Fixed** |
| R2 | **CORRECT** | **Frontier-move** — owner-ruled | ⛔ **No change.** `README.md:47-54` byte-identical to `HEAD` (verified after my edit). Owner accepted as a residual. | **Accepted residual** |
| R3 | **CORRECT** | **Frontier-move** — owner-ruled | ⛔ **No change.** `README.md:26-27` byte-identical to `HEAD` (verified after my edit). Owner accepted as a residual. | **Accepted residual** |
| R4 | **CORRECT** | **Defect** in recorded evidence; **no shipped-prose consequence** | `worklog.md` Step-4 row narrowed: the caller set is complete for **programmatic** callers only; `claude/fkit-claude-init.sh:19` documents direct human invocation and this repo's `CLAUDE.md` instructs it. | **Fixed (worklog)** |
| R5 | **CORRECT** | **Defect** in recorded evidence; conclusion unaffected | `worklog.md` Step-4 row corrected: `install.sh` writes `SHARE` (`:20`), `BIN` (`:21`) **and** a `mktemp -d` scratch dir (`:27`, `:31`, trap-cleaned `:28`). Load-bearing conclusion — none is a consuming project — kept. | **Fixed (worklog)** |

### My independent verification of each finding

- **R1.** `_fkit_is_source_checkout` = `[ -d "$share/.git" ] || [ -f "$share/package.json" ]`
  (`claude/fkit-claude.sh:77`); `$share` is *"install root (~/.local/share/fkit), or the repo root in
  a checkout"* (`:68`). The `update` arm tests it **first** (`:111`) and exits **1** with
  *"this is a source checkout ($share) — update it with 'git pull'."* (`:112-113`). So the sentence
  *"refreshes the installed copy and stops there"* is false there — it refreshes nothing and errors.
  **The reviewer is also right that `:33` does not cover it:** `:33` is about the auto-check, which
  is gated on the same predicate at `:126` — a different code path from the `update` verb.
- **R2.** Reproduced both zero-counts (`manifest` → 0, `spec` → 0) and the `:507`-after-`:358`
  ordering. Both statements are true simultaneously; the collision is in reader inference, not fact.
  **I agree it is a frontier-move, not a defect**, and agree with the reviewer that scoping `:54` is
  the `0255` pre-emption `plan.md:62` set out to avoid.
- **R3.** `claude/fkit-claude-init.sh:481-488` is an unconditional `rm`+`cp` on every launch, so
  `:26`'s "if needed" is imprecise, not false. Nothing I added makes it false; it makes it more
  visible. **Frontier-move.**
- **R4.** Read `claude/fkit-claude-init.sh:19` directly: `# Usage:  claude/fkit-claude-init.sh
  <project-root>`. Confirmed. My original wording was overbroad and is now narrowed to what I
  actually proved.
- **R5.** Read `install.sh:27` (`TMP="$(mktemp -d)"`), `:28` (trap), `:31` (`mkdir -p "$TMP/src"`).
  Confirmed — my *"only write targets"* phrasing was literally false. Corrected.

### Re-verification after the R1 fix — all re-run, real output

| Check | Result |
|---|---|
| Step 1 | `git diff --stat -- README.md` → `1 file changed, 9 insertions(+), 2 deletions(-)` |
| Step 2 strong form | deleted lines = **exactly the two original `:35-36` lines**, nothing else |
| Step 2 preservation | `:31-33` **byte-identical** to `HEAD` |
| Step 3 | all three literal greps hit, one line each (`:37`, `:39`, `:40`) |
| Step 5 | citation sweep **EMPTY** — the clause adds no `file:line` |
| Step 7 | over-100 count **13**; `comm -13` vs `HEAD` → **zero new** over-100 lines |
| Paragraph width | 99/95/97/95/97/71 **bytes**, 99/95/95/95/97/71 **chars** — ≤100 on both |
| `:26-27`, `:47-54` | **byte-identical** to `HEAD` (R2/R3 residuals genuinely untouched) |
| `npm test` | **723 tests / 723 pass / 0 fail**, hard gate PASSED, `EXIT=0`, **measured `real 442.85` s** |

⚠️ **On the test suite:** the reviewer correctly flagged that it did **not** reproduce the Build
step's 456.46 s / 460.49 s. I re-ran it this round — **442.85 s, same 723/723/0** — but that is again
**my** measurement, not an independent one, and the tree still carries other tasks' changes. It
remains a **neutrality** check: root `README.md` is in neither `structure-manifest.tsv` nor
`structure-spec.md`, so it cannot move a suite either way.

### Reviewer points I accept without action

- The two **disproven Codex claims** (best-effort setup ⇒ silent staleness; mtimes cannot establish
  authorship) — I agree with the disproofs and am not chasing either.
- The reviewer's own new finding, that `FKIT_SETUP_ONLY=1 fkit` exits before the intake invocation
  and before the `claude` presence check, **strengthens** the sentence I shipped. No edit needed.

## Accepted residuals (shared, do-not-re-litigate)

Owner-ruled 2026-08-13 via `AskUserQuestion` in the driver session: **"Accept both as residuals."**
⛔ Do not re-raise these in a later round without new evidence.

- **R2 — `README.md:38-39` "nothing tells you" vs `:54` "a launch also tells you … structure
  diverges".** Both statements are true: `.claude/` is outside the conformance surface (manifest and
  spec both contain zero `.claude` entries), and the divergence notice runs **after** the launch
  refresh, so it can only read clean. **Reason for accepting rather than fixing:** the obvious
  remedy — scoping `:54` to `ai-agents/` — would **pre-empt task `0255`**, the open architect
  decision on whether `.claude/` enters the conformance surface. `plan.md:62` deliberately chose
  mechanism-free wording (*"nothing tells you"* names the user-visible outcome only) precisely so
  this task forecloses nothing `0255` might decide. The owner upheld that choice.
  **Revisit when `0255` lands, not before.**
- **R3 — `README.md:26-27` "sets the project up if needed" reads conditional.** The launch refresh is
  in fact unconditional. **Reason for accepting:** imprecise, not wrong — nothing in the new
  paragraph makes it false. `plan.md:90` weighed this exact line and left it; the owner upheld that.
  Editing it would widen an accuracy task into a rewrite of a paragraph the brief put out of scope.
