# Worklog — 0292: scope README:54's "fkit-managed structure" sentence

**Role:** `fkit-coder`, spawned as the Build worker of `/fkit-sprint-ship-loop`.
**Standing approval:** the owner approved `plan.md` live via `AskUserQuestion` in the driver's
`fkit lead` session on 2026-08-14 — verbatim option label **"Approve as planned (Recommended)"**,
which answered both open questions (**no reflow**, **§C6 wording verbatim**).

## What was done

Replaced `README.md:54-55` with the four-line §C6 wording from the approved plan. Nothing else.

- **Before** (2 lines, `:54-55`):
  ```
  A launch also tells you — one stderr line — when your project's fkit-managed structure diverges from
  what the installed version ships. To see the per-file verdicts and repair, run `/fkit-heal` in a
  ```
- **After** (4 lines, `:54-57`):
  ```
  A launch also tells you — one stderr line — when your project's `ai-agents/` tree, or its root
  `CLAUDE.md` / `AGENTS.md`, diverges from what the installed version ships. (The fkit agents and
  skills under `.claude/` are not part of that check: a launch rewrites them outright, so there is
  nothing to diverge.) To see the per-file verdicts and repair, run `/fkit-heal` in a
  ```

Old lines `:56-59` survive **byte-identical** at `:58-61`. Proven by `git diff -U0 -- README.md`
showing exactly two `-` lines and four `+` lines, with no `±` on any surrounding prose line.

No reflow of the rest of the paragraph, per the owner's answer to open question 1. The fourth new
line is 83 chars — the accepted cosmetic cost of leaving `:56-59` untouched.

## Disk re-check before editing

The plan's location claim was re-verified this turn, not trusted:
`grep -n "fkit-managed" README.md` → single hit, line 54. The two lines on disk matched the plan's
quotation byte-for-byte before the edit was applied.

## Decision log — autonomous fixes and obvious-winner calls

**none.**

No fix was applied without asking, and no obvious-winner call was made. The task was a single
verbatim-wording edit fully specified by the approved plan; nothing arose that required a judgment
call, so nothing was decided unattended. (Recorded explicitly so an empty log is distinguishable
from a forgotten one.)

## Not done — deliberately outside the surface

- No commit, no `git add`, no staging of `README.md`.
- No task-file move, no `## Status` change — a separate producer runs the close.
- `plan.md` not touched, re-authored, or overwritten.
- Nothing under `claude/`, `ai-agents/wiki-vault/`, or `ai-agents/knowledge-base/decisions/`.

## Residuals carried forward

Recorded, not fixed — all three are the plan's own out-of-scope findings:

1. The `fkit-managed` phrase survives outside the README, in the code the sentence describes —
   `claude/fkit-claude-init.sh:567-569` (gitignore comments) and `claude/fkit-claude.sh:393`
   (a comment reading "when the project's fkit-managed structure diverges"). Both files are on
   ADR-043 §C1's explicitly-unaffected list; the brief forbids touching them. The README fix does
   not retire the phrase repo-wide.
2. No `wiki-vault/` sweep for the same over-broad claim was performed — that lands on `0293`.
3. No other README defect was found **because no audit was run**. Absence of findings here is not a
   clean bill of health for the file.

## Review round 1 — Process-review worker (`/fkit-sprint-ship-loop`), 2026-08-14

**Role:** `fkit-coder`, spawned as the **Process-review worker** of `/fkit-sprint-ship-loop`.
**Carry:** pointer-only — `plan.md` referenced by path + blob hash, not pasted. Declared as such by the
driver, and safe here because **no source was to be written**.

### Decision log — autonomous fixes and obvious-winner calls

**none.**

**No fix was applied and no obvious-winner call was made.** The review found **zero defects**, and the
owner **explicitly declined** the wording change, so there was nothing to apply under the standing
approval. No code file was opened for writing this round. (Recorded explicitly so an empty log is
distinguishable from a forgotten one.)

### What was done

Verification and ledger-writing only:

- Re-derived the conformance surface from `claude/structure-spec.md` **independently** of the
  reviewer's numbers: 48 rows / 48 unique paths, 46 under `ai-agents/`, exactly 2 outside
  (`CLAUDE.md`, `AGENTS.md`); class split 19 dirs / 13 placeholders / 10 fkit-authored / 3
  wiki-authored living / 1 owner seed. Content-compared set = the **10** fkit-authored reference files.
- Re-walked the S1 degraded-launch path: `init:21` `set -euo pipefail`; refresh at `:481-490`; **all**
  pre-refresh exits (`:25`, `:27`, `:342`, `:361`) yield non-zero `setup_rc` → `setup_ok=0` → the loud
  warning at `fkit-claude.sh:372-377`. ADR-043 condition 4 **not met**; suppression holds.
- Wrote the *Coder response* section and the shared *Accepted residuals* (AR-1, AR-2) into `review.md`;
  set that ledger's own header to `Status: closed-out`. The reviewer's *Reviewer findings* section was
  **not** edited.

### Independent correction recorded against the reviewer

R1's supporting parenthetical said *"the 6 `wiki-vault/` rows are existence-only or report-only"*.
Re-measured: `wiki-vault/` contributes **13** rows (6 dirs + 4 `.gitkeep`s + 3 living files), and the
first two groups are already inside the "19 dirs" / "13 `.gitkeep`s" the same sentence counts — so 6
double-counts; the genuinely leftover rows are the **3** living files. **Finding, classification, and
verdict are unchanged**; the content-compared count of ~10 is correct.

### ⚠️ Observed outside 0292's folder — reported, not touched

`HEAD` is **`ce6bf54` "Sprint push"** (2026-08-14 11:57), **not** `c23e322`. It contains 0292's README
change plus `0288`'s and `0294`'s work. The working tree is clean. The driver's brief and the
reviewer's ledger both state nothing had been committed — **true when written, stale now.** I committed
nothing, staged nothing, and reverted nothing.

## Honest limit on verification

**No test establishes that the new sentence is correct.** It is prose; nothing in `test/` reads the
root README's prose. Correctness rests entirely on the plan's disk measurements (the spec inventory
is 48 paths, exactly two outside `ai-agents/` — `CLAUDE.md` and `AGENTS.md`; `.claude/` appears
nowhere in the conformance surface; the launch refresh is an unconditional delete-and-recopy that
runs *before* the notice). `npm test` proves only that the edit broke nothing.
