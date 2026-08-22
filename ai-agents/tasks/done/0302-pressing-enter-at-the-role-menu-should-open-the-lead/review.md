# Review — 0302

Task: `ai-agents/tasks/done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/brief.md`
File(s) under review: `claude/fkit-claude.sh` — **now +8/−2, uncommitted** (round 1 reviewed +7/−2;
the round-1 **comment edit** for R2/R3 added one comment line and changed **no executable line**) ·
`ai-agents/tasks/done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/worklog.md`
(untracked) · this ledger.
**In the same working tree but NOT part of `0302`'s diff:**
`ai-agents/tasks/backlog/0145-pty-driven-menu-pick-coverage-for-the-launcher/brief.md` (+42/−0) — the
**producer's** separate discharge of the deferred-coverage obligation, written 2026-08-21 under the
owner's verbatim ruling **"Route to a producer now (Recommended)"**. Recorded here so a later reader
does not mis-attribute it to the coder's rounds.
Status: closed-out (2026-08-21, owner-dispositioned — R1–R5 fixed and re-verified, R6 and three other
residuals accepted, owner's real-terminal acceptance passed).
- **Corrections:** 2026-08-21 — this ledger was closed out and then **corrected**, on the owner's
  ruling (live `AskUserQuestion`, 2026-08-21, verbatim option label **"Correct it before closing
  (Recommended)"**). It carries a dated ⚠️ correction note at **§R5-a**, and a dated ⚠️ discharge
  stamp on the **`R5-a`** bullet in *Accepted residuals*. Marker legend: **⚠️ = a fact that drifted**
  (the finding, its severity and its disposition are untouched); **⛔ = a decision that was
  overturned** (do not follow it) — **no ⛔ note exists in this ledger: nothing was overturned, no
  finding was re-opened, and the verdict and closed-out status are unchanged.** Every corrected
  passage is left **byte-identical**; corrections are appended beside it, never written over it.
  ⚠️ **One site carrying the wrong figure is deliberately NOT annotated in place:** `review.md:220`
  (*"→ **14 hits in 5 files**"*) sits inside the **CODER-OWNED** *Coder response* section, which the
  reviewer may not write. It is corrected **by reference** from §R5-a; this bullet is the warning a
  reader gets before reaching it.

**Round 1 — 2026-08-21.** Baseline `HEAD = 7832cba`. Reviewers: fkit-reviewer (own pass) **and**
Codex (`codex-cli 0.145.0`, `codex exec --sandbox read-only`). **Both reviewers ran — coverage is
complete, not partial.**

## ✅ FINAL DECISION VERDICT (round 2, 2026-08-21)

✅ **Approved — ship. All six round-1 findings are settled: R1–R5 fixed and independently
re-verified by the reviewer; R6 accepted by the owner as a frontier-move residual. No behavioural
change entered in round 2 — proven, not asserted (below). Coverage of the original review was
complete (both reviewers ran); ⚠️ this round-2 pass is a DISPOSITION pass by owner ruling — no new
Codex pass was run, and none was owed. One new low documentation defect was found inside R5's own
fix (a wrong hit-count) and is recorded as a residual, not a re-opening; it does not hold the ship.**

---

**Round-1 decision verdict (superseded, kept as the record):** ⚠️ **Changes requested — 5 defects
(none blocking), 1 frontier-move.** Every
finding is documentation accuracy. **No behavioural defect was found by either reviewer**, and the
shipped behaviour was independently re-verified from scratch (below).

---

## Independent verification performed by the reviewer (not inherited from the worklog)

⚠️ **Wording corrected in round 2: this was a pty, not a real terminal.** It is evidence about the
code path under a controlling tty; it is **not** a real-terminal acceptance. The real-terminal
acceptance is the owner's, recorded in *Round 2 — disposition pass* below.

Run under a **pty made the controlling terminal** via Python `pty.openpty()` + `setsid` + `TIOCSCTTY`
— a **third** pty mechanism, different from the worklog's `script -q /dev/null` — against the **real**
`claude/fkit-claude.sh`, inside a throwaway project **outside this repo**, with `claude`, `codex` and
`curl` stubbed on `PATH` exactly as `test/harness.mjs` stubs them. Nothing real was exec'd; no
`.fkit/settings/` was written inside this repo.

**Every run below asserts the junk-token discriminator `? "zzz" is not one of 1-7.` in the SAME run
as the case under test**, so no run is vacuous.

| Input (after `zzz`) | Result | exec'd | rc |
|---|---|---|---|
| `Enter` | `→ lead.` | `claude --agent fkit-lead --settings .fkit/settings/lead.json` | 0 |
| `q` | quit | **never exec'd** | 0 |
| `Ctrl-D` (EOF) | quit | **never exec'd** | 0 |
| `" "` (space) | `? " " is not one of 1-7.` + re-prompt | **never exec'd** | 0 |
| 80-char junk, then `Enter` | `? "aaa…" is not one of 1-7.` then `→ lead.` | `--agent fkit-lead` | 0 |
| `Ctrl-@` (NUL), then `Enter` | `→ lead.` — see **R6** | `--agent fkit-lead` | 0 |

**Pre-change baseline independently reproduced** (HEAD copy of the launcher, same driver, siblings
present): `role [1-7, q to quit]: ` → `zzz` errors → `Enter` gives a **bare re-prompt**, `q` exits 0,
`claude` never exec'd. The brief's "today it silently re-prompts" is confirmed first-hand.

**Other checks run by the reviewer:** `sh -n claude/fkit-claude.sh` clean · `node --test
test/launcher-contract.test.js` → **40 pass / 0 fail** (includes tests 3 and 7, the headless-default
pins) · `git status --porcelain -- claude/ test/` → **only** `M claude/fkit-claude.sh`, `test/`
untouched · `claude/structure-manifest.tsv` holds **69 data lines, none of them a `.sh` path and none
of them the launcher** → the worklog's "no manifest regeneration owed" is **confirmed** ·
doc-drift grep for `role [1-7` across `README.md`, `claude/scaffold/`, `claude/skills/fkit-team/` and
the launcher header → **no stale copy**; the only hits outside the launcher are task/sprint records
quoting the *before* state, which is correct for a record ·
`ai-agents/knowledge-base/architecture.md:531-533` ("…not a real self-update over the network or a
real menu on a tty — those edges stay manual") is **not** falsified by this change ·
`ai-agents/tasks/backlog/0145-…/brief.md:79,83-111` **does** carry the `Enter` row, the junk-token
discriminator and the Ctrl-D distinction → the deferred-coverage obligation is **discharged in
writing**.

---

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | medium | `worklog.md:59-61` | "Every pass below shows `? "zzz" is not one of 1-7.`" is **false** — Step 2, the pass that proves the feature, contains no junk token. Raised by **both** reviewers. |
| R2 | 1 | low | `claude/fkit-claude.sh:628-629` | The comment calls the menu's `*)` arm "a usage error"; it is not — it prints and re-prompts, exit status unchanged. Raised by **both** reviewers. |
| R3 | 1 | low | `claude/fkit-claude.sh:627` | "has always opened the lead for a no-arg, no-tty run" is **overbroad** — an *uninitiated* project is intercepted at `:573-584` and opens the **producer**. |
| R4 | 1 | low | `worklog.md:5` | "(CI green on it)" is asserted with no check cited. The claim is **true** (verified), but it was unsourced and the immediately preceding push run had **failed**. |
| R5 | 1 | low | `worklog.md:209-211` | The stale-`task 43` inventory is incomplete and one anchor is off by one. |
| R6 | 1 | low | `claude/fkit-claude.sh:631` | **Frontier-move, not a defect.** A NUL-only line (`Ctrl-@` then Enter) now opens the lead where it previously re-prompted — empirically confirmed. Recommend accepting as a residual, not fixing. |

### Finding detail

**R1 — medium — `worklog.md:59-61` — the stated evidence-integrity guard does not hold for the
load-bearing pass. Defect (documentation). Raised by both reviewers; verified.**
The worklog names the junk-token assertion as its guard against the plan's trap 1 (a pipe closing
early → EOF → a vacuous green) and states *"Every pass below shows `? "zzz" is not one of 1-7.` on
stdout"*. The Step 2 transcript (`worklog.md:88-101`) — the **only** pass that demonstrates
`Enter → lead` — contains **no `zzz` and no error line**. So the guard as written is not the guard
that actually held there.
**The conclusion survives, and this is why the severity is medium and not high:** an EOF-driven
vacuous run **cannot** exec, because the EOF branch is `IFS= read -r pick <&3 || { echo; exit 0; }`.
Step 2 records an exec, so it was not vacuous. The reviewer additionally re-ran the Enter case with
the discriminator present **in the same run** (table above) and it holds. What is wrong is the
worklog's account of *how* non-vacuity was secured — the class of overclaim
`ai-agents/knowledge-base/conventions/evidence-before-assertion.md` exists to catch, in the one task
whose central risk is a green that could not have gone red.
*Recommended disposition:* correct the sentence to say what is true — Steps 1 and 3 carry the
junk-token discriminator; Step 2's non-vacuity rests on the exec, which EOF cannot produce.

**R2 — low — `claude/fkit-claude.sh:628-629` — "usage error" is the wrong term for the menu's `*)`
arm. Defect (documentation). Raised by both reviewers; verified.**
The new comment reads *"⛔ EMPTY ONLY: the `*)` arm stays a usage error"*. The menu's `*)` arm
(`:632`) prints `? "%s" is not one of 1-7.` and **re-prompts** — the loop continues, nothing exits,
the status is unchanged. The thing that *is* a usage error is the **argv** guard at `:236-242`, which
`printf`s to stderr and `exit 2`s — a different code path, correctly gestured at by the same
sentence's parenthetical *"(the header's `fkit --resume` bug)"*. A reader following this comment could
conclude the menu exits 2 on a junk token; it does not (confirmed: `zzz` → re-prompt, rc 0).
The **fence itself is intact** — `*)` did not widen, verified twice above.
*Recommended disposition:* reword to "the `*)` arm still rejects and re-prompts", keeping the
`--resume` pointer.

**R3 — low — `claude/fkit-claude.sh:627` — the "has always" claim is overbroad. Defect
(documentation). Raised by Codex; verified.**
The comment justifies the change with *"the headless fall-through below (`[ -n "$role" ] ||
role="lead"`) has always opened the lead for a no-arg, no-tty run"*. Two corrections:
1. **It is not universal.** The fresh-project branch at `:573-584` runs **before** both the menu and
   the fall-through, and for an **uninitiated** project a no-arg run `exec`s
   `claude --agent fkit-producer` regardless of tty. The lead default only governs an *initiated*
   project.
2. **"Always" holds only for the current spelling.** History check: `[ -n "$role" ] || role="lead"`
   was introduced with the menu itself (`2e63c2f`) and the value `lead` has never changed — but the
   *display label* was "team room" until `437ea1d`. So the internal role id has always been `lead`;
   the user-visible word has not.
**The argument the comment is making still stands**, which is why this is low: the fresh-project
interception sits ahead of the menu path and the headless path **equally**, so "this makes the
interactive path agree with the headless one" remains true on the branch under discussion.
*Recommended disposition:* qualify with "for an already-initiated project" (a fresh one is
intercepted earlier and opens the producer on both paths).

**R4 — low — `worklog.md:5` — an unsourced CI-state assertion. Defect (documentation), claim itself
CORRECT. Raised by Codex; verified.**
`**Baseline:** HEAD = 7832cba … (CI green on it)` cites no run. The reviewer checked:
`gh run list` → `completed  success  Fix of the broken build  test  main  push  32486696995  4m20s
2026-08-21T13:24:44Z`. **The claim is true.** It was, however, load-bearing and unverifiable from the
document — and the *immediately preceding* push run (`32482230515`, "Sprint push") is
`completed **failure**`, so "green on this one" was not a safe default to assume.
*Recommended disposition:* carry the run id, or drop the parenthetical.

**R5 — low — `worklog.md:209-211` — the stale-numeral inventory is incomplete and one anchor is off
by one. Defect (documentation). Reviewer's own finding.**
The worklog reports *"Stale `task 43` numerals under `test/` (`prove-red.sh:96, :277-278, :348`;
`launcher-contract.test.js` header ×2 and test 9's name)"*. `test/` is untouched by this change, so
these anchors are checkable as written. Actual `task 43` occurrences:
- `test/prove-red.sh:25`, `:96`, `:278`, `:347`
- `test/launcher-contract.test.js:10`, `:13`, `:152`, `:225`

So `:348` should be **`:347`**, and `prove-red.sh:25` and `launcher-contract.test.js:152` are
**omitted**. Named as `0306`'s out-of-scope residue and correctly not repaired here — but an
incomplete hand-off inventory is what a later sweep will work from.
*Recommended disposition:* correct the anchors in the worklog, or replace them with the grep that
regenerates them.

**R6 — low — `claude/fkit-claude.sh:631` — NUL-only input now reaches the lead. FRONTIER-MOVE, not a
defect. Raised by Codex; empirically confirmed by the reviewer.**
Codex predicted that a line whose only content is NUL bytes could reach the new empty arm, because
`read` cannot represent NUL in a shell variable. **Confirmed under a pty:** typing `Ctrl-@` then
Enter yields `role [1-7, Enter=lead, q to quit]: ^@` followed by `→ lead.` and an exec of
`--agent fkit-lead`. Pre-change, that input hit the `"") : ;;` no-op and re-prompted silently.
**Why this should be accepted rather than fixed:** the distinction is not observable at shell level —
`$pick` is genuinely empty by the time `case` sees it, so no fence can be written that is not a
guess; the outcome (a lead session) is the cheapest and most reversible session in the product, which
is the exact reasoning the owner already accepted for `Enter`; and the input requires a deliberate
control-character keystroke. It relocates no settled cost and creates no new class of risk.
*Recommended disposition:* record as an accepted residual (draft text below); do **not** open a fix.

---

## Coder response

<!-- CODER-OWNED. The reviewer does not write here. -->

**Round 1 processed 2026-08-21** by fkit-coder, spawned as the Process-review worker of
`/fkit-sprint-ship-loop`. **Every finding was re-verified against the files first** — none was
actioned on the reviewer's say-so. **Owner dispositions** were given live via `AskUserQuestion` in
the driver session, 2026-08-21, verbatim option labels: **R1–R5 → "Fix all five now
(Recommended)"**; **R6 → "Accept as a residual (Recommended)"**; **Ctrl-D/Enter asymmetry →
"Accept as a residual (Recommended)"**.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** — re-verified | Defect (documentation) | Corrected the claim itself; ⛔ **not** "fixed" by re-running to manufacture the missing junk token | **fixed** |
| R2 | **CORRECT** — re-verified | Defect (documentation) | Reworded "stays a usage error" → "still rejects and re-prompts" | **fixed** |
| R3 | **CORRECT** — re-verified | Defect (documentation) | Qualified "has always…" with "for an already-initiated project" + named the uninitiated→producer interception | **fixed** |
| R4 | **CORRECT** — re-verified | Defect (documentation); underlying CI claim was true but unsourced | Cited run id `32486696995` and named the failing predecessor `32482230515` | **fixed** |
| R5 | **CORRECT** — and the review's own replacement list is **also incomplete** (see below) | Defect (documentation) | Replaced the hand-typed inventory with the regenerating `grep` + a freshly measured two-class list | **fixed** |
| R6 | **CORRECT** — accepted as reported, agreed it is a frontier-move, not a defect | **Frontier-move** | ⛔ **No fix. `""` arm NOT widened.** Recorded as an owner-accepted residual below, as drafted | **accepted as residual (owner)** |

### Verification I performed before acting (not inherited)

- **R1** — Read the transcripts in `worklog.md` directly. **Confirmed:** Step 2 (`Enter → lead`, the
  only pass demonstrating the feature) contains no `zzz` and no error line, while Steps 1 and 3 both
  carry it. The sentence *"Every pass below shows…"* was false as written. The conclusion survives —
  the EOF branch `IFS= read -r pick <&3 || { echo; exit 0; }` exits 0 before any role is chosen, so a
  vacuous run cannot exec, and Step 2 records an exec.
- **R2** — Read the launcher. **Confirmed:** the `*)` arm `printf`s and the `while [ -z "$role" ]`
  loop continues — no exit, exit status unchanged. The genuine usage error is the argv guard
  (`claude/fkit-claude.sh:237-242`: `printf … >&2` then `exit 2`), a different path. Finding correct.
- **R3** — Read the launcher. **Confirmed:** the fresh-project branch sets `role="producer"` and
  `exec`s `claude --agent fkit-producer`, is gated only on `fresh=1 && [ -z "$role" ]` with **no tty
  test**, and sits ahead of both the menu block and the `[ -n "$role" ] || role="lead"`
  fall-through. So a no-arg, no-tty run on an **uninitiated** project opens the **producer**, and
  "has always opened the lead" was overbroad. The comment's argument survives — the interception
  precedes both paths equally.
- **R4** — Ran `gh run list` myself rather than quoting the review. **Confirmed:**
  `32486696995 · success · push · main · "Fix of the broken build" · 2026-08-21T13:24:44Z`, and the
  immediately preceding push `32482230515 · "Sprint push"` is **`failure`**. Both halves correct.
- **R5** — ⚠️ **Re-measured from scratch; neither list was copied.** `grep -rniE '\btask 43\b' test/`
  → **14 hits in 5 files**. The review's eight anchors (`prove-red.sh:25,:96,:278,:347`;
  `launcher-contract.test.js:10,:13,:152,:225`) are **all confirmed**, and the worklog's original
  list was indeed off (`:348` → `:347`; `:277-278` is one hit at `:278`) and short. **But the
  review's list is itself incomplete**: it omits `test/skill-ownership-hook.test.js:1` (a live
  comment, same class) and the frozen fixtures
  `test/fixtures/closed-rank-0174-{before,after}.md`. ⛔ Those fixtures **must not** be swept —
  `test/closed-rank-immutability.test.js:25` calls them **"byte-exact"** and `:548-549`/`:566-567`
  read them directly, so editing a numeral there breaks that suite; the old numeral is correct
  content in a historical snapshot. The worklog now carries the regenerating grep plus this
  two-class superset. **⛔ Still nothing under `test/` was touched** — `0306`'s residue stays
  reported-only.
- **R6** — Accepted the reviewer's empirical result and its reasoning; ran no fix, so nothing to
  re-verify beyond agreeing the classification is right. `read` cannot carry NUL into a shell
  variable, so `$pick` is genuinely empty before `case` runs — no shell-level fence can tell the two
  apart without guessing.

### Change surface of this round

**One source file, comment text only — `claude/fkit-claude.sh`, the menu's empty-input comment
(now `:626-631`).** Zero behaviour change: the executable lines `"") role="lead" ;;` (`:632`) and
`*) printf … ;;` (`:633`) are **byte-unchanged** from the reviewed round. Plus documentation edits to
`worklog.md` (§2 trap-1 note, `:5` CI citation, §4 inventory + acceptance status, §5 decision log)
and this section.

⛔ **Not done, deliberately:** `*)` arm not widened · no behaviour change · no test added · no
prove-red mutation added · nothing under `test/` touched · no edit to `ai-agents/wiki-vault/`,
`ai-agents/knowledge-base/architecture.md`, `claude/structure-manifest.tsv`, or `0145`'s brief ·
Ctrl-D/Enter asymmetry **not** added to the launcher comment (offered, not selected) · `plan.md` not
re-authored · no commit, no push, no task-file move, no `## Status` change.

---

## Round 2 — disposition pass (reviewer, 2026-08-21)

<!-- REVIEWER-OWNED. -->

⚠️ **Scope of this pass, stated so it is not mistaken for a full round.** By the owner's ruling
(live `AskUserQuestion`, 2026-08-21, verbatim option label **"Disposition-only pass (Recommended)"**)
this is a **disposition pass**: record the owner's dispositions, verify the load-bearing claims of the
coder's round, set the ledger's end state. ⛔ **No second Codex pass was run** — deliberately, on that
ruling; not a degradation and not partial coverage of round 1, which was complete.

### Dispositions — as ruled by the owner, 2026-08-21, via `AskUserQuestion` relayed by the driver

| #  | Owner disposition (verbatim option label) | Final state | Reviewer's verification **this** pass |
|----|-------------------------------------------|-------------|----------------------------------------|
| R1 | **"Fix all five now (Recommended)"** | **Fixed — accepted** | Re-read `worklog.md:65-82` and the Step 2 transcript at `:104-127`. The correction states the true thing in both directions: Steps 1 and 3 carry the discriminator, Step 2's non-vacuity rests on the recorded exec. Step 2 (`:116-122`) does contain **no `zzz`** and **does** record the exec of `--agent fkit-lead`. **Not overstated** — it claims only that an EOF run cannot exec. |
| R2 | **"Fix all five now (Recommended)"** | **Fixed — accepted** | `claude/fkit-claude.sh:630-631` now reads *"the `*)` arm still rejects and re-prompts"*. The `*)` arm itself (`:633`) is byte-unchanged from `HEAD`. |
| R3 | **"Fix all five now (Recommended)"** | **Fixed — accepted** | `:626-629` now qualifies the claim with *"for an already-initiated project"* and names the uninitiated→producer interception. Matches the code at `:573-584`. |
| R4 | **"Fix all five now (Recommended)"** | **Fixed — accepted** | `worklog.md:6` carries run id `32486696995` (`success`, `"Fix of the broken build"`, `2026-08-21T13:24:44Z`) and `:8` names the failing predecessor `32482230515`. |
| R5 | **"Fix all five now (Recommended)"** | **Fixed — accepted, with one new low defect inside the fix (below)** | The eight round-1 anchors re-measured and all confirmed; the coder's added ninth site `test/skill-ownership-hook.test.js:1` confirmed; the do-not-sweep fixture class confirmed. ⚠️ **The replacement inventory's hit COUNTS are wrong** — see *R5-a* below. |
| R6 | **"Accept as a residual (Recommended)"** | **Accepted as a residual — NOT fixed** | Verified the `""` arm was **not** widened: `:632` is `"") role="lead" ;;`, the exact text round 1 reviewed, and `*)` is untouched. |
| — Ctrl-D vs Enter asymmetry | **"Accept as a residual (Recommended)"** | **Accepted as a residual — recorded as drafted** | ⛔ The additional option to also note it in the launcher comment was **offered and NOT selected**. Its absence from `claude/fkit-claude.sh` is **deliberate**, not an oversight; a later pass must not "fix" it. |

### What I re-verified first-hand this pass (not inherited from the coder's report)

- **The executable lines really are byte-unchanged — proven, not asserted.** Stripped every
  whole-line comment from `HEAD:claude/fkit-claude.sh` and from the working tree, then diffed the
  remainder. The **only** two differences in the entire file are the prompt string
  (`role [1-7, q to quit]:` → `role [1-7, Enter=lead, q to quit]:`) and the arm
  (`"") : ;;` → `"") role="lead" ;;`) — i.e. **exactly the round-1 change, and nothing else**. No new
  executable line entered in round 2. **Therefore the round-1 behavioural verdict still applies
  unchanged**, and the pty evidence gathered in round 1 has not been invalidated.
- **Round-2 delta is comment text only.** `git diff --numstat` → `8 2 claude/fkit-claude.sh`; round 1
  reviewed `+7/−2`, so the round is exactly **one added comment line** plus reworded comment text.
- **R6's fence is intact.** `*)` did not widen; the empty arm did not widen beyond `""`.
- ⛔ **Not run:** the real `claude`, a new Codex pass, any test suite. The coder's `prove-red.sh`
  (22/22 red, gates `0a`–`0k`, mutation 2 still red) and `npm test` (730/730) are **the coder's
  measurements, taken on this ledger's word** — this pass did not re-run them. They are consistent
  with a comment-only delta, which is what I did verify independently.

### R5-a — NEW, low — `worklog.md:292-305` — the corrected inventory's **counts** are wrong (its **anchors** are right). Defect (documentation). Reviewer's own finding, this pass.

Confirming the coder's superset **and** refuting part of it. Ran the worklog's own quoted command,
`grep -rniE '\btask 43\b' test/`:

- **(a) Live, sweepable — CONFIRMED EXACTLY, 9 lines in 3 files.** `test/prove-red.sh:25`, `:96`,
  `:278`, `:347` · `test/launcher-contract.test.js:10`, `:13`, `:152`, `:225` ·
  `test/skill-ownership-hook.test.js:1`. My round-1 list **was** incomplete — it omitted
  `skill-ownership-hook.test.js:1`. The coder is right and I was wrong; this list, not mine, is the
  one a sweep should use.
- **(b) ⛔ Frozen fixtures — do-not-sweep CONFIRMED, but the count is not 5.**
  `test/fixtures/closed-rank-0174-before.md` and `-after.md` carry **8 matching lines each
  case-insensitively (16), 7 each case-sensitively (14)** — not the "5 hits, case-sensitive" the
  worklog states.
- **⚠️ So the headline "14 hits in 5 files" is wrong for the command it quotes.** That command
  returns **25 lines across 5 files** (9 live + 16 fixture). The file count is right; the hit count
  is not.
- **⚠️ And the stated REASON for do-not-sweep is stronger than the mechanism the worklog names.** The
  worklog says editing a numeral there "would break that suite". That is **not reliably true** — the
  matching fixture lines sit in table-cell prose, and `closed-rank-immutability.test.js` asserts row
  ranks/ids (`deepEqual` on eight rows) and a hardcoded row count (148), which prose edits need not
  disturb. The binding reason is the **provenance contract**:
  `test/closed-rank-immutability.test.js:25-31` declares the fixtures **"byte-exact copies"** of two
  named commits and states *"Provenance lives HERE, never inside the fixture bytes."* A numeral edit
  falsifies that contract **even where no assertion happens to trip** — which is worse, not better.
  **Do not sweep them.**

**Classification:** documentation accuracy, **low**, non-blocking — every *anchor* a future sweep
needs is correct; only the arithmetic around them is not. **Disposition applied here:** recorded as a
reported-not-repaired residual below rather than re-opened as a round-2 finding, because the owner's
ruling for this pass was disposition-only and the corrected numbers now live in this ledger, which is
the durable record. ⛔ No source or worklog edit was made for it — the reviewer does not write either.

> ⚠️ **Dated correction 2026-08-21 — the §R5-a figures above are re-measured and CONFIRMED, and the
> missing piece is supplied: WHICH grep variant each number belongs to.** The R5-a text above is
> **left byte-identical**. Nothing about the finding — its existence, its severity (**low**), its
> classification (**documentation**) or its disposition (**reported-not-repaired residual**) —
> changes. No finding is re-opened.
>
> **Re-derived from scratch this pass, not copied from any prior pass** (four earlier passes over this
> inventory each found the previous one's arithmetic wrong). Measured at `HEAD = 7832cba` with `test/`
> untouched. **Every number is stamped with the exact command that produces it** — an unstamped count
> is the defect that keeps recurring here, because the two variants genuinely disagree:
>
> | Command | Total | Class (a) live | Class (b) frozen fixtures |
> |---|---|---|---|
> | `grep -rniE '\btask 43\b' test/` — case-**insensitive** | **25** hits in **5** files | **9** (3 files) | **16** (8 per file × 2) |
> | `grep -rnE '\btask 43\b' test/` — case-**sensitive** | **23** hits in **5** files | **9** (3 files) | **14** (7 per file × 2) |
>
> - **Class (a) is 9 under BOTH variants — it does not move**, so a sweep list is variant-independent:
>   `test/prove-red.sh:25`, `:96`, `:278`, `:347` · `test/launcher-contract.test.js:10`, `:13`,
>   `:152`, `:225` · `test/skill-ownership-hook.test.js:1`.
> - **The entire 25 → 23 gap is class (b): exactly one `Task 43` with a capital `T` per fixture** —
>   `test/fixtures/closed-rank-0174-before.md:2227` and `test/fixtures/closed-rank-0174-after.md:2233`,
>   both the line *"**Task 43 — implement the hook**, retire the old off-list/`CONSULT_SKILLS`
>   plumbing…"*. Nothing else differs between the variants.
> - Arithmetic, checked both ways: 9 + 16 = **25** ✓ (`-i`) · 9 + 14 = **23** ✓ (case-sensitive).
> - **"Hits" and "lines" are interchangeable on this inventory** — verified, not assumed: `-o` match
>   counts equal line counts under both variants (25/25 and 23/23), i.e. no line carries two matches.
>
> **⚠️ A SECOND site of the wrong figure, named here because it is not annotated in place.**
> `review.md:220`, inside the **CODER-OWNED** *Coder response* section, states
> `grep -rniE '\btask 43\b' test/` **"→ 14 hits in 5 files"**. That is **wrong for the command it
> quotes**: `-i` returns **25**. The number `14` is the case-**sensitive** count of class (b)
> **alone** — the frozen fixtures only, under the *other* variant — so it is neither a total nor a
> count of the command cited. It is exactly the two-way ambiguity this note exists to close.
> **The reviewer does not write in the coder's section**, so no note was placed at `:220`; the correct
> figures live here and in the *Accepted residuals* bullet below, and the header
> `- **Corrections:**` bullet warns a reader before they reach `:220`. If an in-place marker at `:220`
> is wanted, a **coder** must place it — that is a new, coder-initiated step, not part of this
> correction.
>
> **Unchanged and still binding — re-confirmed this pass, deliberately NOT restated here.** The
> anchors, the two-class split, the ⛔ do-not-sweep rule on the frozen fixtures, and its binding
> reason — the **"byte-exact copies"** provenance contract at
> `test/closed-rank-immutability.test.js:25-31`, which a numeral edit falsifies **even where no
> assertion trips**, a stronger reason than "it breaks the suite" (which is not reliably true) — all
> stand **byte-identical** at `:301-316` above and in the *Accepted residuals* bullet below. They are
> **deliberately not restated here, so there is one place to keep true rather than two.** Only the
> arithmetic around them was ever in question, and it is settled by the table above.

### Owner's real-terminal acceptance — DONE

✅ **Real-terminal acceptance pass performed by the OWNER, 2026-08-21**, verbatim result label:
**"Opened the lead — works"**. This **discharges** the outstanding acceptance item that both this
reviewer and the verifier flagged. It is the only real-terminal evidence in this task: every other
run on this ledger and in `worklog.md` is a **pty** (`script -q /dev/null` ×2, `pty.openpty()` ×1),
and none of them is described as a real-terminal verification.

---

## Re-litigates settled decisions (suppressed)

Nothing was suppressed this round — **neither reviewer raised a settled item.** Codex was primed with
the settled list and did not attempt any of it. Recorded so the absence is not mistaken for an
omission:

- **"There is no automated test for the `""` case arm."** SETTLED — owner ruling 2026-08-21, verbatim
  option label **"Approve on 3A (Recommended)"**. Branch 3B (task-local pty test + matching prove-red
  mutation) was designed and declined: it would falsify
  `ai-agents/knowledge-base/architecture.md:531-533` (a line this task may not edit) and import a
  `sleep`-timing race duplicating `0145`'s surface. The obligation was **discharged**, and the
  reviewer verified the discharge on disk: `ai-agents/tasks/backlog/0145-…/brief.md:79` now carries
  the `Enter` row, `:99-106` the junk-token discriminator, `:108-111` the Ctrl-D distinction.
  **Re-raise only if:** the change is shown *wrong* in a way a non-pty, non-timing test would catch.
- **"Mark the default in the menu list (`1) lead  (default)`)."** SETTLED — declined by the owner,
  verbatim option label **"Prompt text only (Recommended)"**. Verified not done.
- **"Enter should ask for confirmation."** SETTLED — defeats the request (the owner asked to avoid
  typing).
- **"`fkit` should not default to lead at all."** SETTLED — the headless fall-through has shipped
  since the menu was introduced (`2e63c2f`).
- **Pre-existing, reported-not-repaired, out of scope:** prove-red **mutation 2 carries no `cmp -s`
  no-op guard** while 1, 3-9 and 12-22 do — the reviewer **confirmed this is accurate**; it is
  ADR-026 Decision 5's "offered and not taken" hardening, not caused by this change.

---

## Accepted residuals (shared, do-not-re-litigate)

<!-- SHARED section. Promoted from "proposed" to ACCEPTED by fkit-coder (Process-review worker),
     2026-08-21, on the owner's dispositions relayed by the /fkit-sprint-ship-loop driver.
     Provenance note: normally the reviewer's phase 2 records dispositions here; this round the
     driver assigned the recording to the coder. The reviewer's drafted text is carried VERBATIM
     below — only the "(proposed)" marker was replaced with the acceptance stamp. -->

**✅ ACCEPTED by the owner, 2026-08-21**, live via `AskUserQuestion` in the driver session. Verbatim
option label for **both** entries: **"Accept as a residual (Recommended)"**. Do not re-litigate
either without meeting its stated re-raise condition.

- *(accepted — owner, 2026-08-21)* **Ctrl-D and Enter differ at the menu** — What: after this change a literal `Enter`
  opens the lead while `Ctrl-D` (EOF) still exits 0 and opens nothing, two outcomes from what looks
  like the same empty line. · Why (structural): they are different events, not different renderings
  of one event — EOF means "no more input" and the loop must terminate without choosing a role, while
  Enter is a deliberate keystroke; making EOF open a session would open one on every broken pipe and
  every closed harness, which is precisely the plan's trap 1. The distinction is already recorded
  where a reader will look: `ai-agents/tasks/backlog/0145-…/brief.md:108-111` (*"a test that
  conflates them proves nothing"*) and `worklog.md:202-203`. · Re-raise only if: a user reports
  Ctrl-D being read as Enter on a real terminal.
- *(accepted — owner, 2026-08-21)* **A NUL-only line opens the lead (R6)** — What: `Ctrl-@` then Enter reaches the empty
  arm and opens the lead. · Why (structural): `read` cannot carry NUL into a shell variable, so
  `$pick` is empty before `case` runs and no shell-level fence can distinguish the two; the outcome
  is the cheapest, most reversible session in the product; the input requires a deliberate control
  character. · Re-raise only if: the launcher ever gains a non-`sh` input path where the distinction
  becomes observable.

### Added in round 2 by the reviewer (disposition pass, 2026-08-21)

**Owner-ruled residual:**

- *(accepted — owner, 2026-08-21, verbatim option label **"Approve on 3A (Recommended)"**)* **The
  `""` case arm ships with NO automated test** — What: the Enter-default has no unit, contract, or
  prove-red coverage; its only evidence is three pty runs plus the owner's real-terminal acceptance.
  · Why (structural): branch 3B (task-local pty test + matching prove-red mutation) was designed and
  **declined** — it would falsify `ai-agents/knowledge-base/architecture.md:531-533` (a line this
  task may not edit) and import a `sleep`-timing race duplicating `0145`'s surface. The obligation is
  **discharged in writing** onto `0145`, verified on disk (`0145-…/brief.md:79` the `Enter` row,
  `:99-106` the junk-token discriminator, `:108-111` the Ctrl-D distinction). · Re-raise only if: the
  change is shown *wrong* in a way a non-pty, non-timing test would catch. **See also the full
  entry in *Re-litigates settled decisions* above — this is the same ruling, recorded here so a
  reader of the residual list alone does not miss it.**

**Reported-not-repaired, out of scope for `0302` — carried, not fixed. ⛔ Nothing under `test/` was
touched by this task, and nothing here authorizes touching it:**

- **`0306`'s stale `task 43` numerals under `test/`** — ⚠️ **use THIS list, not the worklog's and not
  the round-1 review's; both are wrong in different ways (see R5 and R5-a).** Regenerate with
  `grep -rniE '\btask 43\b' test/` → **25 lines across 5 files** at `HEAD = 7832cba`, in two classes:
  **(a) sweepable live comments/test names, 9 lines** — `test/prove-red.sh:25,:96,:278,:347`,
  `test/launcher-contract.test.js:10,:13,:152,:225`, `test/skill-ownership-hook.test.js:1`; and
  **(b) ⛔ DO NOT SWEEP, 16 lines (8 per file)** — `test/fixtures/closed-rank-0174-before.md` and
  `-after.md`, declared **byte-exact copies** of two named commits at
  `test/closed-rank-immutability.test.js:25-31`, whose provenance *"lives HERE, never inside the
  fixture bytes."* The old numeral is **correct content** in a historical snapshot. · Owner of the
  sweep: `0306`'s successor. · Re-raise only if: a sweep is opened — then it works from the
  regenerating grep, never from a typed list.
- **`R5-a` — the worklog's own hit COUNTS are wrong** (`worklog.md:292-305`: "14 hits in 5 files",
  and "(b) 5 hits, case-sensitive"). Anchors correct, arithmetic not. Low, documentation only, and
  **superseded by the classified list in the bullet directly above**, which is now the durable
  record. · Re-raise only if: someone works from the worklog's counts instead of this ledger's.
  > ⚠️ **Dated correction 2026-08-21 — `R5-a` is DISCHARGED on the worklog side. It is no longer an
  > outstanding residual.** The bullet above is **left byte-identical** as the record of what the
  > round-2 disposition pass found; it should now be read in the past tense.
  >
  > **Verified first-hand this pass, not taken on the coder's report:** a coder re-measured and
  > corrected `worklog.md` §4. It now states **25 (`-i`) / 23 (case-sensitive)** with the variant named
  > (`worklog.md:289`, `:293-294`, `:298-299`), the fixtures as **16 `-i` / 14 case-sensitive** (8 / 7
  > per file, `:307`), the arithmetic check **9 + 16 = 25** (`:299`), and it carries its own dated
  > correction note at `:344-363`. It also adopted the **provenance-contract** reason over "it breaks
  > the suite" (`:357`). The two wrong figures this residual was raised against — *"14 hits in 5
  > files"* and *"5 hits, case-sensitive"* — **are gone from the worklog.**
  >
  > **What remains open, and it is narrower:** the same wrong figure **still stands at `review.md:220`**
  > in the CODER-OWNED *Coder response* section, corrected by reference from §R5-a. **Nothing under
  > `test/` was touched**, so the sweep obligation in the bullet directly above is untouched and still
  > belongs to `0306`'s successor. · **Re-raise only if:** someone works from `review.md:220` instead
  > of this ledger's classified list.
- **prove-red `mutation 2` carries no `cmp -s` no-op guard** — re-confirmed this pass:
  `test/prove-red.sh` has `cmp -s` guards at `:367, :402, :425, :447, :468, :490, :524, :559, :645,
  :688, :729, :754, :775, :817, :858, :908, :948, :991, :1022` (mutations 1, 3-9, 12-22) and **none
  for mutation 2**. Pre-existing; **not caused by this change**; it is ADR-026 Decision 5's "offered
  and not taken" hardening, still open. Mutation 2 was verified **still red** in the coder's run, so
  the gate is not currently vacuous. · Re-raise only if: mutation 2 ever goes green, or the ADR-026
  hardening is picked up.

---

## Convergence call

**Round 1 of a fresh ledger — no prior rounds, nothing re-litigated, so this is not a loop.**

**Recommend: act, then close.** All six findings are documentation-only and cheap; **none blocks the
change**. The shipped behaviour is correct and was verified three independent ways (the worklog's two
`script`-based runs, and this review's `pty.openpty()` run reproducing both the before and the after
states with a non-vacuous discriminator in every run).

**R1 is the one worth doing before the ledger closes** — it is a false statement about how the
evidence was kept honest, in the task whose whole risk was a vacuous green. R2 and R3 are corrections
to a comment block that this repo treats as the record. R4 and R5 are citation hygiene. R6 wants a
residual entry, not a fix.

**If the owner prefers to ship as-is:** nothing here justifies holding the change. The correct
closeout is then to record R1-R5 as known documentation debt with an owner, not to mark them
resolved.

### Round 2 — convergence call (final)

✅ **CONVERGED — close it.** R1–R5 were fixed and independently re-verified; R6 and three further
residuals are recorded with re-raise conditions; the owner's real-terminal acceptance passed. The
round-2 delta is **comment text only**, proven by a comment-stripped diff against `HEAD`, so nothing
in the round-1 behavioural verdict needs re-testing.

**⚠️ Two things a closer must carry forward, and one it must not undo:**
1. **Carry:** `R5-a` — the corrected `task 43` inventory lives in *Accepted residuals* above, not in
   `worklog.md`, whose counts are wrong. A sweep working from the worklog will mis-scope.
2. **Carry:** nothing under `test/` was touched; `0306`'s residue and prove-red mutation 2's missing
   `cmp -s` guard remain open, owned elsewhere.
3. ⛔ **Do not undo:** the Ctrl-D/Enter asymmetry is **deliberately absent** from the launcher
   comment — that option was offered to the owner and not selected.

**No further review round is owed.** This ledger is closed-out.
