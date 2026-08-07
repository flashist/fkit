# Plan — 0245: the producer-owned structure-check skill (read-only conformance report)

> Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-07. Verbatim
> selections: plan **"Approve (Recommended)"** (the §2 exit-code contract 0/1/2 accepted as stated,
> per the question's wording); open question 1 — skill name — ruled by owner-typed answer, verbatim
> **"fkit-heal"** (overriding both offered options: every occurrence of `fkit-structure-check`
> below reads as **`fkit-heal`** — skill dir `claude/skills/fkit-heal/`, and all hook wiring,
> tests, and mirror rows use `fkit-heal`); open question 2 — spec amendment — ruled **"Amend now
> (Recommended)"** (amend `claude/structure-spec.md`'s markers-absent sentence to the §3
> precedence; this is the 0243 accepted residual R3 re-opened and closed under its own recorded
> re-raise clause, "0245 defines classification precedence"). Open question 3's exit-code contract
> is accepted as part of the plan approval. Plan authored by a spawned fkit-coder
> (`/fkit-plan-task`), presented by the fkit-lead driver, written to this file by the driver in the
> approval turn (fkit-sprint-ship-loop §Durable artifacts). The worker's text below is kept
> verbatim, including its pre-ruling `fkit-structure-check` name recommendation — the header's
> ruling governs.

**Task:** `ai-agents/tasks/done/0245-build-the-producer-owned-structure-check-skill/brief.md`
**Deps verified on disk:** 0243 shipped `claude/structure-spec.md` (pinned machine-read inventory tables) + `test/structure-spec.test.js`; 0244 shipped `claude/structure-manifest.tsv` + `bin/generate-structure-manifest.mjs` (exports `normalizeEndings` / `elideRulesRegion` / `markerLines` / `hashFor`). ADR-039 licenses the capability; this unit is the **check only — read-only in every branch** (repair is 0246).

## 1. Shape of the deliverable

A new skill directory `claude/skills/fkit-structure-check/` with two files:

- **`SKILL.md`** — the producer's procedure. Frontmatter with `name` + `>-` folded-block `description` (required by `test/skill-frontmatter.test.js`), then the `⛔ Owner: the producer` banner, then the procedure (§4 below).
- **`check.sh`** — a deterministic **bash** checker that computes the whole per-file conformance report. Per **ADR-017** (all four rules): it lives inside the skill dir (that is the only ship path — `install.sh` copies only `claude/`, init's `cp -R` carries the whole skill dir); it is invoked `bash .claude/skills/fkit-structure-check/check.sh …`, never `./`; its runtime assumption is **bash and nothing more — no Node** (ADR-017 rule 3 explicitly forbids reaching for Node consumer-side, so `check.sh` cannot import 0244's exported JS functions; it must *reproduce the hashing contract* — see §3 — and the test suite pins parity). Its stdout contract is repo-testable under ADR-017 rule 4's scope widening (precedent: `fkit-status/dashboard.sh` + `dashboard-contract.test.js`).

Why a script and not prose: the classification is byte-mechanics (hashing, marker counting, manifest lookup) — exactly the silent-wrong LLM arithmetic ADR-017 exists to eliminate. The LLM's job is presenting the report and the diffs, not computing verdicts.

**Skill name — `fkit-structure-check` (recommendation; open question 1).** 0246 adds the repair phase *inside this same skill* (design §11 unit 5), so the name should survive that. Alternative: `fkit-structure`. The name binds the hook wiring and every mirror, so it should be settled before implementation.

## 2. `check.sh` contract

**Inputs:** `bash check.sh [--share <dir>] [project-root]` (project-root defaults to cwd). Share resolution: `--share` wins; else if `<project-root>/claude/structure-spec.md` exists, the project is a source-checkout self-host and the share is the project root (mirrors `fkit-claude.sh`'s `share="$(cd "$here/.." && pwd)"` self-host property); else `${XDG_DATA_HOME:-$HOME/.local/share}/fkit`. Spec (`$share/claude/structure-spec.md`), manifest (`$share/claude/structure-manifest.tsv`), or scaffold missing → loud error, exit 2 (cannot run ≠ nonconforming).

**Inventory source:** parse the spec's two pinned tables (§"Inventory Table A — directories", §"Inventory Table B — files") under the machine-read contract 0243 pinned: heading text, 3-column backticked-path rows, class cell one of the six class names. An unrecognized class name or missing pinned heading → refuse loudly (guards spec/skill version skew — a stale skill copy must not guess against a newer spec).

**Per-row outcomes — exactly the report-§7 classes:** `conforming` / `missing` (report, never create — convergence's job) / `untouched-stale` / `owner-edited` / `wrong-type` / `wiki-routed`, plus three refusal/annotation outcomes the design's safety bar requires: `refused: symlink`, `refused: malformed-markers`, `unreadable` (chmod-000: refuse to classify that file, non-fatal, continue), and `kept-out`.

Per class (spec §"The six classes", carried, not re-derived):
- **structural directory:** `-L` test **first** (symlink → refuse, never traverse); missing → `missing`; exists-as-file → `wrong-type`; real dir → `conforming`. Renamed-dir limit: the check reports the spec path as `missing` and cannot see the renamed twin; the report states this limit once (ADR-015's rename consequence).
- **fkit-authored reference file:** hash classification (§3).
- **owner-authored seed** (`PROJECT.md`): existence only. Never content-checked.
- **wiki-authored living file:** existence only; `schema.md` additionally content-checked (same §3 pipeline) but any nonconformity reports as `wiki-routed` — repair routed to `fkit-wiki`, ADR-005 named in the line. The check **reads** vault paths only.
- **placeholder:** init's `.gitkeep` rule governs — a missing `.gitkeep` in a directory that exists is `conforming`, not a defect.
- **root context file:** §3 with marker elision. `CLAUDE.md`/`AGENTS.md` sit outside `ai-agents/`, so keep-out (which is `ai-agents/`-relative) cannot cover them — stated, not implied.

**Keep-out:** reuse init's parser semantics on `ai-agents/.fkit-keep-out` (per-line, `\r`-trimmed, `#`/blank skipped, normalized to `ai-agents/`-relative, entry covers path + subtree). Unreadable/symlinked/directory keep-out → **fail closed**: refuse to check the `ai-agents/` subtree, say why loudly, still check the root files (mirrors init's R1 lesson verbatim).

**Output:** deterministic report — one line per inventory row in table order (`<outcome>\t<path>\t<detail>`), then per-class summary counts computed by the script (not the LLM). Exit codes: 0 = ran, fully conforming; 1 = ran, nonconformities/refusals found; 2 = could not run. Stdout is the test contract.

**Read-only, structurally:** `check.sh` contains no write operation on any checked path — no `>` redirect into the project, no `mkdir`, no `cp`, no `touch` (brief verification 7's grep must come back empty). Temp usage, if any, confined to `mktemp` outside the project tree.

## 3. The hashing pipeline and the classification precedence (the 0243-R3 residual, resolved here)

`check.sh` reproduces 0244's hashing contract in bash (the manifest header states consumers MUST): (1) CRLF→LF, exactly that transform (a lone `\r` is content); (2) root files only: marker recognition per `marker_lines`' whole-line-trim-`[ \t\r]` contract (awk, same as init's), elide lines strictly between the markers keeping the marker lines; (3) sha256 hex — via `sha256sum`, falling back to `shasum -a 256`; neither present → that file reports `unreadable`-class refusal and the run stays non-fatal (flagged loudly).

**Classification precedence — the ruling 0243's accepted residual defers to this task:**

1. **Symlink / wrong-type** → refuse before any content read.
2. **Unreadable** → refuse to classify, continue.
3. **Root files: malformed marker set** (begin/end counts ≠ 1/1, or end before begin) → **refuse-to-classify, report the malformation** — the manifest is never consulted (mirrors `merge_rules`' and the generator's refusal contract).
4. Otherwise compute the hash — with elision when exactly one well-formed pair exists, **whole-file when markers are absent** — and the **manifest verdict decides**:
   - hash = the installed version's hash (the share's `claude/scaffold/` copy, hashed under the same contract) → `conforming`;
   - hash matches any `structure-manifest.tsv` row for that path → `untouched-stale`;
   - matches nothing → `owner-edited`.

**Consequence, stated explicitly (the omnigent-era case):** *markers-absent is an input-shaping fact, not a classification.* A markerless root file whose whole-file hash matches a shipped row — the manifest provably carries whole-file hashes of markerless omnigent-era root files — classifies **`untouched-stale`**, not owner-edited. Markers-absent + no match → `owner-edited` (deleting the markers is an owner edit). Either way **report-only** in this unit.

**Follow-on (open question 2):** `claude/structure-spec.md` §"Project root" still carries report §8's verbatim "will classify owner-edited" sentence, kept as an accepted residual whose recorded re-raise clause is exactly *"0245 defines classification precedence."* I recommend amending that one bullet in this task to state the precedence above (content-only edit; the pinned inventory tables are untouched, so `test/structure-spec.test.js` is unaffected; the spec is not in the manifest walk, so no regeneration for it). This re-opens an accepted residual **under its own recorded re-raise clause** — owner/driver call, not mine. **RULED: "Amend now (Recommended)" — see header.**

## 4. `SKILL.md` procedure (outline)

Resolve project root; run `check.sh`; present the report verbatim (never recompute verdicts); for each `owner-edited` file show the diff against the share's scaffold copy (`diff "$share/claude/scaffold/…" <path>`; for root files, note the fkit-managed block region will appear in a plain diff and is not drift); for `wiki-routed` lines state the ADR-005 routing (consult `fkit-wiki` / owner-directed `/fkit-wiki-ingest`) and never touch the vault; state the renamed-dir both-exist limit; state loudly that **this skill's check phase repairs nothing and prompts for no repair** — the consent-gated repair is 0246 and until it ships the skill is report-only end to end. No task-file moves, no commits, no re-ranks.

## 5. Wiring — the complete ownership surface (the 0111→0112 lesson)

1. **`claude/skills-for-role.sh`** — add the skill to the `producer)` line. Single source of truth; the ADR-018 hook and the launcher both source it, so session lock + consult denial follow.
2. **`test/skill-ownership-hook.test.js`** — add the skill to `UNIVERSE` and to `OWNED.producer` (the hand-maintained mirror — its header demands it). The matrix then generates producer-allow **and denies for all six other roles**, satisfying brief verification 1 with margin.
3. **The four checklist mirrors** (`skills_for_role()`'s own ⚠️ block), same commit:
   - `claude/skills/fkit-team/SKILL.md` — producer row;
   - `claude/README.md` — producer row of the skill table;
   - `claude/scaffold/CLAUDE.md` — producer row (line ~23);
   - `ai-agents/knowledge-base/architecture.md` — producer row **and the "25 skills" count → 26** (§4.2 heading and the tree comment at ~line 68).
4. **`claude/agents/fkit-producer.md`** — its prose enumerates the producer's procedures (verified: line ~36). Not on the checklist, but this is precisely ADR-036's 0124 failure class (a system prompt arguing with the hook); add the skill there in the same commit.
5. **Manifest regeneration:** editing `claude/scaffold/CLAUDE.md` changes a working-tree scaffold file that `structure-manifest.tsv` hashes — run `npm run generate:manifest` in the same change or `test/structure-manifest.test.js` goes red on byte-equality.
6. **ADR-036 registry — verified: does not fire.** `test/skill-ownership-sites.mjs` does not exist (registry deferred/unbuilt; confirmed by listing `test/`); nothing to register. The checklist comment remains the governing instruction and is followed as above.
7. **ADR-027 dual-home — verified: what it actually requires here is nothing to sync.** Dual-homing covers fkit-authored files existing in both `ai-agents/` and `claude/scaffold/ai-agents/`; no edit in this task touches such a pair (`architecture.md` is live-only; `claude/scaffold/CLAUDE.md`'s counterpart is not a parity-test pair). `test/dual-home-parity.test.js` must simply stay green.
8. **`.claude/` copies** are gitignored refreshes — canonical sources under `claude/` only; next launch (or `claude/fkit-claude-init.sh .`) propagates.

## 6. Tests — `test/structure-check.test.js` (new, black-box, ADR-014 `node --test`, zero devDeps)

Drives `bash claude/skills/fkit-structure-check/check.sh --share <repo> <fixture>` against temp fixture projects built per test (repo doubles as the share: it holds spec, manifest, scaffold). Fixture matrix — brief item 5 + verification steps, mapped:

- **fresh/conforming** (scaffold copy + root files, both scaffold-verbatim and with stuffed rules-block content): all `conforming`, exit 0, and a before/after hash sweep of the whole fixture tree proves **zero mutation** (verification 2) — this case also transitively **pins bash↔JS hashing parity**: it only passes if `check.sh`'s pipeline reproduces `hashFor`'s output for every scaffold file.
- **drifted-untouched vs drifted-edited** (old shipped blob via `git cat-file` from a manifest-matching historical version, vs a hand-edited file): classify `untouched-stale` vs `owner-edited` respectively, manifest-driven (verification 3).
- **markers:** malformed (duplicate begin; end-before-begin) → `refused: malformed-markers`; absent + byte-equal to a shipped whole-file row (historical omnigent-era root file) → **`untouched-stale`** (pins the §3 precedence — the R3 re-raise's answer); absent + unmatched → `owner-edited`; **block-only drift** on an otherwise-current file → `conforming` (elision correctness); body-drift with intact block → classified by body (verification 4).
- **safety bar:** symlinked subdir, dangling symlink, file-where-dir-belongs → refused loudly, run continues (non-fatal); chmod-000 file → `unreadable`, run completes (skipped when running as root, per existing suite precedent); CRLF variant of the current shipped file → `conforming`, CRLF variant of an older shipped file → `untouched-stale`, never `owner-edited` (verification 5, per the §7 normalization contract).
- **keep-out:** entry covering a deleted path → `kept-out`, not `missing`; unreadable keep-out → subtree check refused loudly, root files still checked.
- **wiki-vault:** edited `schema.md` → `wiki-routed` line naming `fkit-wiki`; the mutation sweep proves nothing under `wiki-vault/` was written (verification 6).
- **renamed dir:** spec path `missing` + the stated limit line.
- **placeholder rule:** `.gitkeep` deleted from an existing dir → `conforming`.
- **missing reference file** → `missing`, and the sweep proves it was not created.
- **cannot-run:** share without spec/manifest → exit 2, loud.

Plus the manual audit (verification 7): grep `check.sh` and `SKILL.md` for any write action on checked paths — none.

**Not doing:** extending `prove-red.sh` to mutate `check.sh` — ADR-026's prove-red scope is the hooks/launcher; the brief does not ask for it. Stated as an assumption, not silently skipped.

## 7. Sequencing

1. `check.sh` + `SKILL.md` (skill dir complete).
2. Wiring: `skills-for-role.sh`, hook-test `UNIVERSE`/`OWNED`, four mirrors, producer agent prose.
3. `npm run generate:manifest` (scaffold/CLAUDE.md changed).
4. Spec precedence amendment (if open question 2 is ruled yes). **Ruled yes — see header.**
5. `test/structure-check.test.js`.
6. `npm test` full-suite green; then run the skill's `check.sh` against this repo as a live smoke — expected result: the seven known-drifted files report `untouched-stale`/`owner-edited` (the ADR-039 trigger-2 evidence, now visible through the tool), and `git status --porcelain` unchanged.

## 8. Risks / edge cases affecting implementation

- **Bash reimplementation drift vs the JS hashing contract** — the top risk; mitigated by the conforming-fixture parity pin (§6) and by carrying `marker_lines`' awk contract verbatim.
- **sha256 tool availability** (`sha256sum` vs `shasum`) — fallback chain, loud refusal if neither.
- **Spec-table parsing skew** (stale skill copy vs newer spec) — refuse-on-unknown-class, never guess.
- **Manifest historical-only paths** (e.g. `ai-agents/reviews/README.md`) — never checked: iteration is spec-inventory-driven, by design.
- **Forgetting the manifest regen after the scaffold/CLAUDE.md mirror edit** — `test/structure-manifest.test.js` catches it, but the plan sequences it explicitly so it never reaches red.
- **Dogfood-repo smoke will report nonconformities** — that is correct behavior, not a failure; stated so it is not "fixed".

## Open questions — RULED by the owner 2026-08-07 (see header)

1. **Skill name** — `fkit-structure-check` (Rec) vs `fkit-structure`? Binds the hook wiring and all mirrors; 0246 later adds the repair phase inside this same skill. **RULED by owner-typed answer: `fkit-heal`.**
2. **Amend `claude/structure-spec.md`'s markers-absent sentence in this task?** (Rec: yes.) The 0243 accepted residual's own recorded re-raise clause is "0245 defines classification precedence" — this is its sanctioned resolution, but it re-opens an accepted residual, so it needs the owner's (or driver-relayed) nod, and the brief does not name the spec among this task's files. **RULED: "Amend now (Recommended)".**
3. **Exit-code contract** for `check.sh` (0 conforming / 1 nonconforming / 2 cannot-run) — stated as a plan decision; flagging it since 0247's launch notice may want to build on it. No change needed if accepted as-is. **Accepted as stated with the plan approval.**
