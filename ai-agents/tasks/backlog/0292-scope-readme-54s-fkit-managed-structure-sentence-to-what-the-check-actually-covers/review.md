# Review — 0292

Task: `ai-agents/tasks/backlog/0292-scope-readme-54s-fkit-managed-structure-sentence-to-what-the-check-actually-covers/brief.md`
File(s) under review: `README.md` (lines 54-55 replaced by 54-57 — 2 lines out, 4 lines in)
Status: in-review

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

_(coder-owned — reviewer does not write here)_

## Accepted residuals (shared, do-not-re-litigate)

_None recorded by the reviewer this round. R1's disposition and any promotion of it to a residual are
the owner's call — see the questions returned with this review._
