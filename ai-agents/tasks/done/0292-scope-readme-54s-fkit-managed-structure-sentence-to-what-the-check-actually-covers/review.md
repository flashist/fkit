# Review — 0292

Task: `ai-agents/tasks/done/0292-scope-readme-54s-fkit-managed-structure-sentence-to-what-the-check-actually-covers/brief.md`
File(s) under review: `README.md` (lines 54-55 replaced by 54-57 — 2 lines out, 4 lines in)
Status: closed-out

**Verdict (round 1): ✅ Ready to merge.** No open confirmed defects. Both reviewers ran (Claude +
Codex); neither was skipped, so coverage is full. Every load-bearing factual claim in the new sentence
was re-derived from disk independently of `plan.md` and holds.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1     | low | `README.md:54` | "your project's `ai-agents/` tree … diverges" reads as a tree-wide comparison, but the check is an inventory of 48 pinned spec paths — and of the 46 under `ai-agents/`, only ~10 are content-compared (13 `.gitkeep`s have class `placeholder` / Check `none`; the 19 structural dirs are existence-only; `PROJECT.md` is never content-checked; the 6 `wiki-vault/` rows are existence-only or report-only). Owner files added under `ai-agents/` are never reported. Classified **frontier-move, non-blocking** — see note below. |

### R1 — why it is a frontier-move, not a defect

Recorded so it is not rediscovered, **not** as a change request:

- The sentence is **faithful to the notice's own self-description**. The stderr line the user actually
  sees (`claude/fkit-claude.sh:493-504`) reads *"N path(s) diverge from what the installed fkit version
  ships"* — the same framing at the same altitude.
- It is **not a regression**. The replaced wording ("your project's fkit-managed structure diverges")
  carried the identical imprecision in the identical direction.
- The very next sentence delegates to `/fkit-heal` for the **per-file verdicts**, which is exactly where
  the precision lives. A one-line summary that enumerated the six spec classes would stop being a
  one-line summary.
- Narrowing it further would collide with the brief's hard constraint: the sentence **must** name
  `ai-agents/` *and* the root context files, and a sentence scoping to `ai-agents/` alone **fails the
  task** (brief §Verification step 3).

### Suppressed as settled — re-litigation, listed not dropped

**S1 — "a launch rewrites them outright, so there is nothing to diverge" is false on a degraded launch.**
Raised **independently by both reviewers** (Codex severity: medium; my own pass found the same path).

- **The factual observation is CORRECT.** `claude/fkit-claude-init.sh:21` is `set -euo pipefail`, and
  the `.claude/` refresh sits at `:479-490`. Exits at `:25`, `:27`, `:342`, `:361` all precede it — so a
  launch can start a session in which the refresh never ran and `.claude/` is genuinely stale.
- **It is nonetheless settled by [ADR-043](../../../knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md)
  §"Re-raise only if", condition 4** — verbatim: *"The refresh becomes non-atomic in a way
  `claude/fkit-claude.sh:370-375` does not cover — i.e. a partial `.claude/` can survive a launch
  **without the loud setup-failure warning firing**."*
- **The condition is NOT met, and I verified the whole path rather than assuming it.** Every pre-refresh
  exit yields a non-zero `setup_rc` → `setup_ok=0` (`fkit-claude.sh:365-369`) → the loud warning at
  `:371-376` fires, saying in as many words *"fkit-managed files may be missing or stale (agents,
  skills, or the ai-agents/ tree)"*. Under `set -euo pipefail` a partial `cp` inside `:479-490` aborts
  init the same way. Init's `exit 3` (`:895`, the `ai-agents/` refusal) fires **after** the refresh at
  `:479-490`, so it can never mask a skipped refresh. And if no agent was ever written, `:386-390`
  refuses to start at all.
- **Conclusion: the degraded path is covered by the warning, exactly as ADR-043 ruled — not by the
  notice, and not by this sentence.** ADR-043 also names *"the observation that the launch notice never
  reports `.claude/`"* as explicitly **not** grounds to re-raise.
- ⛔ **This does not reopen ADR-043 or `0255`.** Neither reviewer argued `.claude/` should become a
  conformance surface; the finding is about a README caveat, and the caveat's subject is already
  reported by a louder mechanism.

### Verified clean — the four claims the brief asked to be attacked

Re-derived from disk this round, independently of `plan.md`. Codex reached the same result on all four
by reasoning (ADR-042 D1: a Codex review is **reasoning-only**, read-only sandbox, executes nothing —
its agreement is corroboration, not a second measurement). The measurements below are **mine**.

1. **Conformance surface = the `claude/structure-spec.md` inventory: 48 paths, 46 under `ai-agents/`,
   exactly two outside — `CLAUDE.md`, `AGENTS.md`.** Extracted programmatically from field 1 of every
   inventory row across both tables (Table A `:62-80` = 19 dirs; Table B `:89-117` = 29 files).
   **No third category exists**, so the sentence omits nothing. `check.sh:155` walks
   `parse_tables "$spec"` and invents no paths of its own; `structure_notice` only filters that output.
2. **`.claude/` is absent from the entire surface.** Zero occurrences in `claude/structure-spec.md`,
   zero in `claude/skills/fkit-heal/check.sh`, zero in `claude/structure-manifest.tsv`, zero among the
   48 extracted inventory paths.
3. **The refresh is unconditional and runs before the notice.** `fkit-claude-init.sh:481-488` is
   delete-and-recopy (`rm -f` / `cp`, `rm -rf` / `cp -R`) with no comparison and no condition. Init is
   invoked at `fkit-claude.sh:358`/`:360`; `structure_notice` fires at `:507`. Ordering correct. (The
   one qualification is S1 above, settled.)
4. **No contradiction inside `README.md`.** `:36` is about `fkit update`'s behavior in a checkout —
   different subject. `:42-43` (*"A launch refresh replaces the agents and skills under `.claude/` — it
   never rewrites your project's own content under `ai-agents/`"*) **interlocks** with the new sentence:
   `.claude/` is rewritten but not reported; `ai-agents/` is reported but not rewritten. `:39`'s *"old
   agents and skills, and nothing tells you"* is about **not** launching; the parenthetical is about
   what happens **when** you launch — which is precisely the reconciliation the task exists to make.

### Also verified

- **Wording is byte-identical to ADR-043 §C6** (`adr-043-…:279-282`), modulo line-wrapping only —
  confirmed by diffing the joined ADR blockquote against the joined README lines: identical. Both
  mandatory halves present (root-context-file naming; `.claude/` parenthetical **with** its reason).
- **The undefined phrase is gone:** `grep -c "fkit-managed structure" README.md` → `0`.
- **Blast radius contained:** `git diff -U0 -- README.md` → exactly 2 `-` lines, 4 `+` lines. No `±` on
  any surrounding prose line, so `0253`'s `:56-59` survives byte-identical at `:58-61` as claimed.
- **Nothing committed, nothing staged:** `git log --oneline c23e322..HEAD` → 0 commits; HEAD is still
  `c23e322`; `git diff --cached --stat -- README.md` → empty.

### Honest limit on this review

**No test establishes the sentence's correctness, and none can — it is prose.** `npm test` proves only
that the edit broke nothing. The coder stated this plainly in `worklog.md` and `plan.md` and did not
overclaim; I confirm it. Correctness rests entirely on the disk measurements above, which I re-derived
myself rather than inheriting. That is the strongest available evidence here, and it is weaker than a
test would be — if `claude/structure-spec.md`'s inventory later gains a path outside `ai-agents/`, this
sentence goes stale silently, with nothing to catch it.

## Coder response

**Round 1. No code change applied — and none was warranted.** Zero confirmed defects; the owner
declined the wording change. Every finding below was re-verified against disk this round; the
reviewer's verdicts were **not** inherited.

| #  | My verdict | Class | Action | Status |
|----|-----------|-------|--------|--------|
| R1 | **CORRECT** — re-measured independently, holds | **frontier-move** | No code change. Promoted to an accepted residual per the owner's ruling. | `won't fix (frontier)` |
| S1 | **CORRECT as fact** — re-verified independently | **frontier-move** (settled) | No code change. Stays suppressed under ADR-043 §"Re-raise only if" condition 4, which I re-checked myself and confirm is **not met**. | `won't fix (settled)` |

### R1 — my independent verification

I re-derived the inventory from `claude/structure-spec.md` programmatically rather than reading the
reviewer's numbers back:

- **48 inventory rows, 48 unique paths. 46 under `ai-agents/`; exactly two outside — `CLAUDE.md`,
  `AGENTS.md`.** Confirms the reviewer's headline measurement exactly.
- **Class breakdown of the 46** (mine, this round): 19 `structural directory`, 13 `placeholder`,
  10 `fkit-authored reference file`, 3 `wiki-authored living file`, 1 `owner-authored seed`.
- **The content-compared set is exactly 10** — the `fkit-authored reference file` rows
  (`ai-agents/README.md`, `ai-agents/tasks/README.md`, and the 8 `knowledge-base/conventions/*.md`),
  none of which are under `wiki-vault/`. `PROJECT.md` is class `owner-authored seed`, spec `:46`:
  *"**never** content-checked"*. The 13 `.gitkeep`s are class `placeholder`, Check `none` (spec `:48`).
  The 19 structural dirs are existence-only. So R1's *"only ~10 are content-compared"* is **right**.
- **`.claude/` appears zero times** in `claude/structure-spec.md`, `claude/structure-manifest.tsv`,
  and `claude/skills/fkit-heal/check.sh` — re-counted, all three zero.
- **`check.sh` invents no paths**: `check.sh:155` takes `rows="$(parse_tables "$spec")"` and the loop
  consumes only that; `parse_tables` fails closed (`exit 3`) if either pinned table heading is missing.

**One correction to the reviewer's parenthetical — it does not change the finding.** R1's supporting
list says *"the 6 `wiki-vault/` rows are existence-only or report-only"*. The count is off as written:
`wiki-vault/` contributes **13** rows, not 6 — 6 structural dirs, 4 `.gitkeep` placeholders, and 3
`wiki-authored living file`s — and the first two groups are **already counted** inside the "19
structural dirs" and "13 `.gitkeep`s" the same sentence lists, so quoting 6 here double-counts. The
rows genuinely *left over* at that point in the list are the **3** living files (`index.md`, `log.md`
existence-only; `schema.md` content-checked but **report-only**, spec `:111-113`). The arithmetic still
closes and the conclusion is unchanged: 19 + 13 + 10 + 3 + 1 = 46, content-compared = 10.

**Classification — I agree it is a frontier-move, not a defect,** on the reviewer's stated grounds,
which I checked rather than accepted: the stderr line at `claude/fkit-claude.sh:496` does read
*"%d path(s) diverge from what the installed fkit version ships"* — the same tree-wide altitude — so
the sentence is faithful to the notice's own self-description and is not a regression on the replaced
wording.

**Disposition — ⛔ accepted residual, no README edit.** The owner ruled *"Promote to accepted residual
(Recommended)"* live via `AskUserQuestion` in the driving `fkit lead` session on **2026-08-14**, and
**explicitly declined** the fix-the-wording-now option: changing it would depart from ADR-043 §C6's
verbatim text and reopen an accuracy question two measurement passes just closed. Recorded below under
*Accepted residuals*.

### S1 — my independent verification

I walked the whole degraded-launch path myself:

- **`claude/fkit-claude-init.sh:21` is `set -euo pipefail`** — confirmed.
- **The `.claude/` refresh is at `:481-490`** (`rm -f` + `cp` for agents, `rm -rf` + `cp -R` for
  skills) — unconditional, no comparison.
- **Every pre-refresh exit precedes it**: `:25`, `:27`, `:342`, `:361` — all `exit 1`. I enumerated
  *all* `exit` statements in the file; the only others are `:506`, `:512`, `:513` (`exit 0`, first-run
  intake) and `:895`/`:896`, **all after `:490`**. So `exit 3` at `:895` fires after the refresh and
  can never mask a skipped one — the reviewer's claim, confirmed.
- **The loud warning fires on every one of those paths**: non-zero `setup_rc` → `case` at
  `fkit-claude.sh:365-369` → `setup_ok=0` → the block at `:372-377` prints *"⚠ fkit could not finish
  setting up this project… fkit-managed files may be missing or stale (agents, skills, or the
  ai-agents/ tree)"* (`:373` verbatim).
- **ADR-043 condition 4 verbatim** (`adr-043-…:315-316`): *"The refresh becomes non-atomic in a way
  `claude/fkit-claude.sh:370-375` does not cover — i.e. a partial `.claude/` can survive a launch
  without the loud setup-failure warning firing."* **Not met** — a partial `.claude/` cannot survive a
  launch silently, because the warning fires on exactly those exits.

**So the factual observation stands and the suppression stands with it.** The degraded path is covered
by the warning, not by the notice and not by this sentence — which is what ADR-043 ruled. ADR-043
`:318-320` also names *"the observation that the launch notice never reports `.claude/`"* as
explicitly **not** grounds to re-raise. **This reopens neither ADR-043 nor `0255`.**

### Verification I could not do — stated, not skipped

**No test establishes the sentence's correctness, and none can — it is prose.** I did not run
`npm test` this round: I changed no code, and the working tree carries `0288`'s in-flight
`bin/release.mjs` + `test/` work, so a suite result would say nothing about `0292` either way. The
reviewer's own *"Honest limit"* section is correct and I do not soften it — correctness here rests
entirely on disk measurements, which is weaker evidence than a test.

### ⚠️ One reviewer statement has gone stale since the ledger was written

**Reviewer findings `:92-93` reads *"Nothing committed, nothing staged… HEAD is still `c23e322`".**
**That is no longer true on disk.** As of this round `HEAD` is **`ce6bf54` "Sprint push"** (2026-08-14
11:57:38 +0300), and it **contains 0292's README change** — `git show ce6bf54 -- README.md` is exactly
the 2-out/4-in diff, and `git diff -- README.md` against `HEAD` is now empty. The same commit also
carries `0288`'s and `0294`'s work and this ledger's earlier revision.

**I did not commit anything, and I am not reverting it.** Recorded per the concurrency instruction to
report what I see outside 0292's folder and fix none of it. This does not change any verdict above —
the reviewed content is byte-identical either way — but it means the ledger's "nothing committed" line
should be read as *true when written*, not as current state. **Flagged for the driver:** a commit
landed across three tasks' work; whether the owner asked for it is not visible from my context.

## Accepted residuals (shared, do-not-re-litigate)

### AR-1 — the launch notice's one-line summary reads broader than the check it summarizes

**Promoted from R1 by owner ruling, 2026-08-14** (live `AskUserQuestion` in the driving `fkit lead`
session; verbatim option label **"Promote to accepted residual (Recommended)"**).

- **What.** `README.md:54`'s *"your project's `ai-agents/` tree, or its root `CLAUDE.md` /
  `AGENTS.md`, diverges"* reads as a tree-wide comparison. The check is not tree-wide: it is an
  inventory of **48 pinned spec paths** (46 under `ai-agents/`, 2 outside), of which only the **10**
  `fkit-authored reference file` rows are content-compared. 19 structural dirs and 13 `.gitkeep`
  placeholders are existence-only, `PROJECT.md` is never content-checked, and the 3 `wiki-vault/`
  living files are existence-only or report-only. **Owner files added under `ai-agents/` are never
  reported at all.**
- **Why this is the intended shape (structural).** The sentence is faithful to the stderr line it
  describes (`claude/fkit-claude.sh:496`, same altitude, same framing) and is **not a regression** —
  the replaced wording carried the identical imprecision. The next sentence delegates to `/fkit-heal`
  for the **per-file verdicts**, which is where the precision belongs; a one-line summary that
  enumerated the six spec classes would stop being a one-line summary. The wording is **byte-identical
  to ADR-043 §C6** (`adr-043-…:279-282`), and the owner declined changing it precisely to avoid
  departing from that verbatim text and reopening a question two measurement passes just closed.
  Narrowing to `ai-agents/` alone would additionally **fail the task** (brief §Verification step 3).
- **Re-raise only if.** (1) `claude/structure-spec.md`'s inventory gains a path **outside**
  `ai-agents/` and outside the root context files — the sentence then becomes factually wrong, not
  merely coarse, **and nothing catches it**, since no test reads the README's prose; or (2) ADR-043 §C6
  is itself amended, which releases the verbatim-wording constraint; or (3) the `/fkit-heal` delegation
  in the following sentence is removed, so the summary is no longer backed by a precise report.

### AR-2 — silent staleness of this sentence: owner ruled a follow-on task be filed

**Owner ruling, 2026-08-14** (same channel; verbatim option label **"File a follow-on task
(Recommended)"**), recorded here because the gap is real and must not be rediscovered as a defect.

- **What.** If `claude/structure-spec.md`'s inventory later gains a path outside `ai-agents/`, this
  README sentence goes stale **silently** — nothing in `test/` reads the root README's prose, so there
  is no mechanism to catch it. This is AR-1's re-raise condition (1), left unguarded.
- **Status: NOT filed here — the driver's to route.** ⛔ Task filing is the producer's exclusively
  (ADR-033) and this worker created no task file. The follow-on is **owed** and the driver routes it to
  `@fkit-producer`. Recorded so the obligation survives this ledger.
