# Review — 0252

Task: 0252 — [brief](./brief.md)
File(s) under review: `RELEASING.md` (new, 173 lines) · `ai-agents/knowledge-base/architecture.md` (+2/-0, flow "6 — Release") · this task folder's `worklog.md`
Status: in-review

Reviewers run (Round 1): fkit-reviewer own pass **and** Codex adversarial pass
(`codex exec --sandbox read-only`, codex-cli 0.145.0, exit 0). **Coverage: full.**
Per ADR-042 D1 a Codex review is reasoning-only — it executed nothing; every Codex claim below was
re-verified by this reviewer against disk before being recorded.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `RELEASING.md:75-79` | "The manifest covers **exactly**: everything under `claude/scaffold/ai-agents/` … plus `CLAUDE.md` and `AGENTS.md`" is false — the shipped `claude/structure-manifest.tsv` carries `ai-agents/reviews/README.md`, a project path with no counterpart in the current scaffold. The cited `workingTreeFiles()` span is only the working-tree half; the walk is history ∪ working tree over three historical homes (`bin/generate-structure-manifest.mjs:13-17,71-84`). |
| R2 | 1 | medium | `RELEASING.md:28-29` | "Nothing in the release flow, the README, or **`fkit update`** points an install at one [a tag]" is contradicted by `claude/fkit-claude.sh:99-103`: `_fkit_reinstall`'s own contract line reads *"run the canonical installer for `$repo@$ref`"*, it fetches `install.sh` from `$fkit_ref`, and it sets `FKIT_REF="$fkit_ref"`. Only the pre-pipe env-propagation bug (folded into `0284`) stops that reaching the install — so the sentence is true today **only because of an open defect**, and goes false when `0284` lands. This is the exact staleness class D5 rewrote the *next* paragraph to avoid. |
| R3 | 1 | low | `RELEASING.md:133-134` | "**Every run** executes `npm test` before its first mutating line" is false for `--no-test` (`bin/release.mjs:81,84,188-198`), and §5's first bullet contradicts it 30 lines later. "The test gate cannot be forgotten" is defensible; "every run" is not. |
| R4 | 1 | low | `RELEASING.md:43-47` | "the update check is **permanently** silent" is an absolute with two counterexamples: (a) an install-time `resolve_sha` failure writes `sha=unknown` (`install.sh:67`), which is non-empty, so the check fires forever; (b) for an **annotated** tag `git ls-remote … \| awk NR==1` yields the *tag-object* sha (`v0.2.1` → `18595e8…`) while the curl/API fallback yields the *commit* sha (`692b8e9…`), so an install whose tool availability changed between install and check compares unequal values. Note: both counterexamples *strengthen* the paragraph's "reachable, not supported" verdict — only the absolute wording is wrong. |
| R5 | 1 | low | `RELEASING.md:27` | `bin/release.mjs:213` is `const tag = \`v${version}\`` — tag-*name* construction only. It does not support "creates an annotated `v<x.y.z>` tag"; creation is `bin/release.mjs:259-260`, push `:262-263`. §4's `:200-263` span does cover it. ⚠️ V1's stated method — *"each span was additionally read and matched against the sentence citing it"* — did not hold here. |
| R6 | 1 | low | `RELEASING.md:73` | "Regenerate … **when, and only when**, `claude/scaffold/` content changed" is wrong in both directions. Over-triggers: editing `claude/scaffold/universal-rules.md` is scaffold content but needs no regen (`KNOWN` marks it `skip`, `:261-264`, and its content is elided from the root-file hashes). Under-triggers: editing `bin/generate-structure-manifest.mjs`'s path map or hash contract changes the manifest with no scaffold edit at all. Capped low — `test/structure-manifest.test.js` reds on staleness either way. |
| R7 | 1 | low | `RELEASING.md:65-67` | §2 endorses `architecture.md:415`'s "**Version bumping is load-bearing** — and it still is" without saying in what sense, two lines after establishing that skipping the bump leaves the notice "still correct, just less informative". `architecture.md:415-416`'s own stated reason (*"self-update compares the installed sha … and reports the version from `VERSION`"*) is precisely the reasoning `0257` falsified (`0257/brief.md`: *"A version bump does not fix this … it treats the symptom for one cycle"*). §2 states the post-`0257` mechanism correctly at `:53-56`; this one sentence re-imports the stale evaluation. |
| R8 | 1 | low | `RELEASING.md:91-93` | "Adding a *new* top-level entry to `claude/scaffold/` **is not a regen**" drops the final duty: after teaching both halves of the walk (`bin/generate-structure-manifest.mjs:268-277`) you must still run `npm run generate:manifest`. As written a reader can finish at "teach the generator". |

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

Round 1 processed 2026-08-13 by `fkit-coder`, spawned as the **Process-review worker** of
`/fkit-sprint-ship-loop` under its declared-approval marker. The owner ruled **fix all eight**
(`AskUserQuestion`, live driver session, 2026-08-13). Every finding was **re-verified against disk
by this coder before any edit** — none was taken on the reviewer's word (`CLAUDE.md` §Review Notes).
All eight verified **CORRECT**. **Write surface: `RELEASING.md` only.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (doc accuracy) | Dropped "exactly". `:75-79` now states the **working-tree** covered set (the half a maintainer's edit lands in) and adds a paragraph saying the `.tsv` is wider — it carries two retired scaffold homes and paths no current scaffold file occupies, `ai-agents/reviews/README.md` among them, from the git-history half of the walk (`:13-18`, `:67-81`). Closes with "do not read the covered set as an inventory of the `.tsv`". | fixed |
| R2 | CORRECT | Defect (0284-dependent claim) | Rewrote `:28-29` to be true before **and** after `0284`: "Nothing in the release flow, the README, or `fkit update` **puts an install onto a tag on its own**; an install lands on one only when someone explicitly sets `FKIT_REF`." Asserts nothing about what `_fkit_reinstall` does with the ref — the half the defect governs. Completes D5's discipline. | fixed |
| R3 | CORRECT | Defect (doc accuracy) | `:133-134` "**Every run** executes" → "A release run executes … — skipping it is possible, but only by asking for it explicitly with `--no-test` (`bin/release.mjs:84`, `:188`), which §5 costs out." The §5 contradiction is now a forward reference. "The test gate cannot be forgotten" kept — defensible, and R3 said so. | fixed |
| R4 | CORRECT | Defect (over-absolute) | Dropped "permanently". `:43-47` now says the quiet "is a side effect, not a guarantee, and it breaks in at least two ways", then states both: `sha=unknown` (`install.sh:67`) never matches because the check only tests non-emptiness (`claude/fkit-claude.sh:136-138`); and `git ls-remote` on an annotated tag returns the **tag object's** sha while the curl fallback returns the **commit's**. The "reachable, not supported" verdict is strengthened, not weakened. | fixed |
| R5 | CORRECT | Defect (citation) | `:27` `bin/release.mjs:213` → **`:259-260`** for creation, with "the name is built at `:213`" kept so neither fact is lost. | fixed |
| R6 | CORRECT | Defect (wrong in both directions) | `:73` "when, and only when, `claude/scaffold/` changed" → "whenever you change what it hashes", then both real triggers named: a covered scaffold file, **or** the generator's own path map / hash contract. The over-trigger is closed explicitly — `universal-rules.md` "sits inside `claude/scaffold/` and is deliberately skipped … so editing it is a scaffold edit that owes no regen". | fixed |
| R7 | CORRECT | Defect (stale reasoning re-imported) | `:65-67` now names the sense: "in one specific sense, which is worth naming because task `0257` retired the old one. Bumping is what lets the update notice name a **version delta** (`v0.2.1 → v0.2.2`) instead of falling back to a **sha delta**." Matches the approved plan's §2/§0.4 instruction the shipped text had drifted from. ⛔ Fixed in `RELEASING.md`; `architecture.md` untouched. | fixed |
| R8 | CORRECT | Defect (omission) | `:91-93` "is not a regen" → "is **more** than a regen, not less", and the duty is restored: "Teaching the generator is step one — you still have to run `npm run generate:manifest` afterwards and commit the result, or the tree is stale exactly as if you had skipped the regen entirely." | fixed |

**Independent re-verification of each finding, before the edits** (measured this turn, not taken on trust):

- **R1** — `grep -n 'reviews/README' claude/structure-manifest.tsv` → lines 80, 81; `ls claude/scaffold/ai-agents/reviews/` → *No such file or directory*. Full sweep: 17 distinct project paths in the `.tsv`, **exactly one** with no counterpart in the current scaffold (14 files under `scaffold/ai-agents` + `CLAUDE.md` + `AGENTS.md` = 16, + the orphan = 17). History-walk constants read at `:67-81`. **CONFIRMED.**
- **R2** — `claude/fkit-claude.sh:99-103` read from disk: contract comment *"run the canonical installer for `$repo@$ref`"*, fetches `install.sh` from `$fkit_ref`, sets `FKIT_REF="$fkit_ref"` **pre-pipe**. The sentence's truth does rest on the propagation defect. **CONFIRMED.**
- **R3** — `bin/release.mjs:84` = `const doTest = !has("--no-test");`, `:188` = `if (doTest) {`. **CONFIRMED.** (Reviewer's `:81` is off by 3 — `:81` is `const dryRun`; immaterial, `:84` is the line that matters.)
- **R4** — (a) `install.sh:67` = `printf 'sha=%s\n' "${sha:-unknown}"`; `claude/fkit-claude.sh:136-138` tests only `-n` on both sides. (b) **Measured live, not reasoned:** `git ls-remote … v0.2.1` → `18595e808f…` (= `git rev-parse v0.2.1`, the tag object); `curl api.github.com/repos/flashist/fkit/commits/v0.2.1` → `692b8e9039…` (= `git rev-parse v0.2.1^{commit}`). Two different shas for one unmoved tag. **CONFIRMED, both counterexamples.**
- **R5** — `:213` = ``const tag = `v${version}`;``; `:259-260` = ``step(`create annotated tag ${tag}`);`` + `git(["tag","-a",…])`. **CONFIRMED.**
- **R6** — `KNOWN` at `:261-264` marks `universal-rules.md` `'skip'`, and that file is inside `claude/scaffold/`. Generator-side changes move hashes with no scaffold edit. **CONFIRMED, both directions.**
- **R7** — `architecture.md:415-416` read; its stated reason is the sha-compare mechanism `0257` re-scoped. `RELEASING.md:65-67` did re-import the evaluation without naming a sense. **CONFIRMED.**
- **R8** — `:268-277` throw says *"teach BOTH halves of the walk"* and stops there; nothing in the shipped `RELEASING.md` sentence carried the reader on to the regen. **CONFIRMED.**

**Nothing was found wrong.** All eight stand as written; no finding was reworded around rather than fixed.

**Post-fix re-verification — real output in `worklog.md` §7.** V1 **35/35** (32 by the regex + **3 bare
shorthand citations the plan's V1 regex structurally cannot see** — see the residual below), each span
read and matched against its citing sentence; V3, V4, V5 (0 removed lines, protected sentence
untouched), V6 (status byte-identical to the session-start snapshot), V8 all PASS. **`npm test` re-run
after the fixes: GREEN, exit 0, 723/723 assertions, 0 failures, measured 448 s (7 min 28 s)** — inside
the owner-ruled 6–8 min band.

## Accepted residuals (shared, do-not-re-litigate)

- **Runtime wording "roughly 6–8 minutes, machine-dependent"** — What: `RELEASING.md:102-105` states that range plus a ~1-minute failing-run clause · Why (structural): owner ruling 2026-08-13 via `AskUserQuestion`, superseding the owner's own 2026-08-12 `~6 min` ruling; the resulting disagreement with `bin/release.mjs:190` and `.github/workflows/test.yml:28-32` is deliberate and accepted · Re-raise only if: the owner reopens the wording, or a measured run falls outside the 6–8 min band in a way that makes the budget misleading rather than merely conservative.
- **No `README.md` change in this task** — What: `RELEASING.md` is not linked from the README · Why (structural): owner ruling 2026-08-13; task `0253` (open, P14) owns the README and a second editor would collide · Re-raise only if: `0253` is cancelled or closed without adding the link.
- **Repo-root placement, not `conventions/`** — What: `RELEASING.md` sits at the repo root · Why (structural): owner-settled; `ai-agents/knowledge-base/conventions/` is dual-homed and ships into every consuming project, which has no release to cut. Verified: no reference to `RELEASING.md` exists in `claude/`, `install.sh`, `test/`, or `.github/` · Re-raise only if: the dual-home rule changes.
- **The post-pipe `curl … | FKIT_REF=v0.2.1 sh` form** — What: `RELEASING.md:35` shows the assignment *after* the pipe, labelled "reachable, not supported", with `:38-41` explaining why the pre-pipe form silently installs `main` · Why (structural): owner ruling 2026-08-13; showing the working form is what stops readers inventing the broken one · Re-raise only if: the launcher/installer stops reading `FKIT_REF`.
- **The `_fkit_reinstall` env-propagation defect is `0284`'s** — What: not fixed and not mentioned in `RELEASING.md` · Why (structural): owner ruling 2026-08-13 folded it into `0284` · Re-raise only if: `0284` is cancelled. ⚠️ **R2 is not a re-raise of this** — R2 is about a `RELEASING.md` sentence whose truth depends on the defect, not about fixing the defect.

### Recorded, not fixed — carried out of Round 1 (added by the coder, 2026-08-13)

- **⚠️ Line-number drift: the four residuals above cite pre-fix `RELEASING.md` coordinates.** The eight
  fixes lengthened the file from 173 to **201** lines, so two residual pointers no longer resolve to
  what they name. ⛔ **I did not rewrite the reviewer-authored residual text** — the mapping is recorded
  here instead. Measured this turn: the runtime wording cited as `:102-105` is now **`:127-131`**; the
  post-pipe `curl` command cited as `:35` is now **`:36`**, and its ⚠️ explanation cited as `:38-41` is
  now **`:39-42`**. The residuals' *substance* is unaffected — every one of them still holds, and none
  was re-litigated. **Anyone acting on those residuals should use the numbers in this bullet.**
- **Where the eight fixes now live** (for a Round 2 reviewer, so nobody re-resolves R-coordinates
  against a shifted file): R2 → `:29-30` · R4 → `:46-54` · R5 → `:27-28` · R6 → `:82-86` ·
  R1 → `:89-102` · R8 → `:112-118` · R7 → `:72-76` · R3 → `:159-161`. Each range was printed back
  from disk and read before being written here.

- **`architecture.md:415` cites the wrong line for "No npm-registry publish"** — What: it attributes the claim to `bin/release.mjs:66`, which is `const doTag = !has("--no-tag")`; the real site is **`bin/release.mjs:77`** (`Makes no npm-registry publish.`) · Why not fixed: **not this task's file to edit** — V5 protects `architecture.md` and the stale citation sits inside the protected sentence's own line, so correcting it would produce a removed line and fail V5. `RELEASING.md:200` cites `:77` correctly · **Re-verify before acting:** independently re-confirmed from disk this turn (`bin/release.mjs:66` = `--no-tag`, `:77` = `Makes no npm-registry publish.`). **Wants its own brief — producer call.**
- **`architecture.md:498` says "eight" contract suites; there are 20** — What: measured this turn, `ls test/*.test.js | wc -l` → **20**; `:498` names eight by name (`launcher-contract`, `converge-contract`, `dashboard-contract`, `skill-ownership-hook`, `orphan-cleanup`, `rules-block-budget`, `adr-number-uniqueness`, `task-id-uniqueness`). ⚠️ The worklog's earlier "21" is itself one high and should not be propagated · Why not fixed: same file, same ⛔ · **Wants its own brief — producer call.**
- **The plan's V1 citation regex cannot see bare shorthand citations** — What: V1 greps `<file>.<ext>:<line>`, so a second reference written as `` (`bin/release.mjs:84`, `:188`) `` is invisible to it. `RELEASING.md` now holds **three** such shorthands (`:213`, `:67-81`, `:188`) · Why it matters: V1 is the mechanical guard this task leans on, and a citation it cannot see is a citation nobody checks — the same class of gap that let R5 ship · Action taken: all three swept **by hand** this turn (`grep -noE '`:[0-9]+(-[0-9]+)?`'`) and confirmed resolving **and** matching; each sits in the same parenthetical as a full citation to the same file, so the shorthand is unambiguous · **Re-raise if:** anyone re-runs V1 as written and reports a clean sweep as full coverage.

## Notes — checked, not recorded as findings

- **D4 (the plan's false "CI has still never run" premise, refused by the worker): correct call, and the shipped wording is accurate and adequately hedged.** Re-verified by running `gh run list` (5 runs: 4 success, 1 failure `31634593615`) and `gh run view 31634593615 --log-failed` (`✖ the never-delete-lockdown-state guard is case-insensitive`, `AssertionError … /lockdown state/`). `RELEASING.md:154-156` says CI "has been exercised on real pushes and has already caught a failure that a local run had not" — it never says "green" and never says "always green", and the one red run is exactly what the sentence is about. The failure is a Linux-vs-macOS case-sensitivity assertion, which makes the "a local run had not" half well-founded rather than merely asserted. **No over-claim.**
- **D5 (the approved `fkit update` self-erasing-pin clause, deliberately omitted): correct call, and the replacement rationale is sound.** Traced end to end: `install.sh:69` does record `ref=` into `$SHARE/.version` (`:70`), and `_fkit_remote_sha` (`claude/fkit-claude.sh:79-91`) does resolve `$fkit_ref`'s head via `git ls-remote`. The chain is defect-independent as claimed. ⚠️ But the paragraph is not *fully* defect-independent — see **R2**, two lines above it — and its conclusion is over-absolute — see **R4**.
- **V1 independently re-run.** 29 distinct citations extracted from `RELEASING.md`; every one resolves to an existing file and an in-range span printed back from disk. **29/29 confirmed.** One (`bin/release.mjs:213`, R5) resolves but does not support its sentence.
- **V5 independently re-run.** `git diff -U6` on `architecture.md` → `@@ -411,12 +411,14 @@`, +2 lines, **0 removed**; the protected sentence is untouched. Confirmed.
- **V7 (`npm test`, 435 s, 649 assertions) was NOT re-run by this reviewer.** Taken on the worklog's evidence. The change is two Markdown files, neither in `claude/scaffold/`, so no manifest regen is owed — confirmed by inspection, not by a suite run.
- **§4's ordered 6-step list** is accurate for a default `npm run release`; every step is flag- or state-conditional in the code (`bin/release.mjs:200,234-263`), but no non-default path is reachable without an explicit flag. Not recorded.
- **Out-of-scope stale claims the worker self-reported — both CONFIRMED, neither this task's:** (1) `architecture.md:415` attributes "No npm-registry publish" to `bin/release.mjs:66`, which is `--no-tag`; the real site is `:77`. (2) `architecture.md:498` says "eight `node --test` contract suites"; `test/*.test.js` currently numbers **20** (the worklog's "21" is itself one high).

## Re-litigates settled decisions (suppressed)

None. No finding from either reviewer touched an accepted residual or an ADR "Re-raise only if" condition.

## Convergence call

Round 1, no prior rounds — nothing to converge against yet. Eight novel findings, all documentation
accuracy, **zero code defects** (no code was changed). Two are medium (R1, R2); six are low. None
blocks; all are cheap, localized wording or citation edits inside `RELEASING.md`.
**Recommend act, not closeout.**
