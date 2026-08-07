# Plan — 0244: the hash-manifest generator and its completeness test

> Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-07 — verbatim
> selected options: plan **"Approve (Recommended)"**; open question 1 ruled **"Faithful JS impl
> (Recommended)"** (implement the marker-recognition contract faithfully in JS, cited to
> `marker_lines`, fixture-tested — not a shell-out); open question 2 ruled **"Class-agnostic
> superset (Recommended)"** (every file ever shipped under the homes, excl. `.gitkeep` and
> `universal-rules.md`; classification stays in 0243's spec). Plan authored by a spawned fkit-coder
> (`/fkit-plan-task`), presented by the fkit-lead driver, written to this file by the driver in the
> approval turn (fkit-sprint-ship-loop §Durable artifacts). The two open questions below are kept
> verbatim as returned; both are RULED as above.

**Task:** `ai-agents/tasks/done/0244-build-the-hash-manifest-generator-and-completeness-test/brief.md`
**Authority:** report `2026-08-06-design-post-update-structure-check.md` §7 (mechanism + hashing contract), §8 (elision), §9 (fixtures); ADR-015 (mechanism recorded in §Rejected alternatives; Context §2 names the three homes; Context §4 sha-keyed distribution); **ADR-039 §6** (Q6 "Fold it in (Recommended)" — the manifest is the licensed capability's determination layer; 0242 is Done, so the brief's "ships behind 0242" gate is discharged); ADR-014 (test bar: `node --test`, zero devDeps).

## What gets built — 3 new files + 1 edit

1. **`bin/generate-structure-manifest.mjs`** — the generator. Node, zero dependencies (`node:crypto`, `node:child_process`, `node:fs`), sibling of `bin/release.mjs`. Repo-side tooling only — it is *not* shipped (only `claude/` ships); the **manifest** it writes is.
2. **`claude/structure-manifest.tsv`** — the committed manifest artifact. Home per report §4/§7: the install share, beside the (future, 0243) `claude/structure-spec.md`. `install.sh` copies `claude/` wholesale, so it ships and stays staleness-proofed with no installer change.
3. **`test/structure-manifest.test.js`** — the completeness/contract test, in the repo suite (`npm test` glob `test/*.test.js` picks it up automatically).
4. **`package.json`** — one added script: `"generate:manifest": "node bin/generate-structure-manifest.mjs"` (discoverability; ADR-011 already allows scripts).

## Generator design

**Definition of "shipped":** every blob reachable from `HEAD`'s ancestry at any of the historical home paths, **plus the current working-tree content** of `claude/scaffold/` (see "why worktree" below).

- **The rename-aware walk is home-level, per the report's own definition:** the three fixed prefixes ADR-015 Context §2 names — `generic/ai-agents`, `omnigent/scaffold/ai-agents`, `claude/scaffold/ai-agents` — all map onto the project path `ai-agents/…`; root context files map `omnigent/scaffold/{CLAUDE,AGENTS}.md` and `claude/scaffold/{CLAUDE,AGENTS}.md` → `{CLAUDE,AGENTS}.md`. (Per-file rename detection inside a home is unnecessary: ADR-015 Context §2 verified zero file renames in fkit's history; the homes *are* the renames.)
- **Mechanics (fast, few processes):** one `git log HEAD --raw --no-renames --format=%H -- <the 7 prefixes/paths>` pass collects every (path → blob-sha) ever present; unique blobs are read via one `git cat-file --batch`; each is normalized, (for root files) elided, sha256-hashed, and recorded under its project path. Speed matters: prove-red re-runs the full suite ~16×, so the test (which re-runs the generator) must stay in the ~1s range — this two-process design does.
- **Hashing contract (recorded in the artifact header AND the generator, per the brief):**
  - sha256 hex over content normalized **CRLF → LF** — exactly that transform, both sides (generation here; the on-disk file at check time — the consumer's obligation is stated in the header).
  - **Root context files (`CLAUDE.md`/`AGENTS.md`): the lines *strictly between* the rules markers are elided before hashing; the marker lines themselves are KEPT.** This is load-bearing for report §8's classification: markers present + any block content → elides to the shipped bare-pair form → match (block-only drift = untouched); markers *deleted* → nothing elided, no marker lines in the hashed content → matches nothing → owner-edited, exactly as §8 rules. Marker recognition follows the `marker_lines` contract (`claude/fkit-claude-init.sh:374`): whole-line equality after trimming `[ \t\r]` — never substring match (init's quoted-in-prose defect), `\r` in the trim set (init's CRLF defect). Implemented as a small JS function that carries the contract verbatim with a citation comment — see open question 1 — with fixtures asserting both load-bearing properties.
  - Markers **absent** in a shipped version → whole file hashed (verified real: the omnigent-era `CLAUDE.md` shipped without markers). A shipped version with a **malformed** pair (counts ≠ 1/1, or end before begin) → the generator **fails loudly** (mirrors `merge_rules`' refusal; a wrong guess would bake a wrong hash into the shipped artifact). Adjacent pair (scaffold's current bare pair, lines 68–69) → elides nothing, valid.
- **Path scope:** every regular file ever shipped under the homes, **excluding** `.gitkeep` (placeholder class — report §4: "check: none") and **excluding** `claude/scaffold/universal-rules.md` (install-side input to the rules block, never copied into a project — not a project path; its content lands inside the marker region, which is elided anyway). Everything else is included **class-agnostically** — including owner-seed `PROJECT.md`, the wiki-vault files, and historical-only paths (e.g. `ai-agents/reviews/README.md`, shipped in the generic era, gone today). Rationale: the manifest is pure data ("which hashes has fkit ever shipped at this path"); *class semantics* — what may be checked, repaired, or must never be touched — live in the 0243 spec, per §7's division of labor. This is a strict superset of the brief's "every spec'd fkit-authored path", costs bytes only, and keeps the generator decoupled from the not-yet-landed spec (see open question 2).
- **Why the worktree is included:** a scaffold edit and its regenerated manifest land in the *same* commit — at generation time the new blob exists in no commit yet. History-only generation would ship a manifest that misses the very version its own commit ships. So: history ∪ current `claude/scaffold/` on-disk content, deterministically.
- **Output:** `#`-commented header (what it is; the full contract above; the regenerate command; "do not edit by hand — the test goes red when stale") then `<sha256>\t<project-path>` lines, sorted by path then hash, LF endings, trailing newline — byte-deterministic. Modes: default writes `claude/structure-manifest.tsv`; `--stdout` prints (the test's seam). Exports its normalize/elide/hash functions with a `main` guard so the test imports rather than re-implements them.
- **Writes nothing else.** Never anything under `ai-agents/` (brief verification 6), never outside the repo.

## The completeness test

Same scope category as `test/dual-home-parity.test.js` (an invariant over repo content — the established "fourth category"; cite it, don't re-argue). Assertions:

- **A — completeness + determinism + staleness guard:** run the generator with `--stdout`; output must equal the committed `claude/structure-manifest.tsv` byte-for-byte. This single assertion makes the manifest's coverage claim live: touch anything under `claude/scaffold/` without regenerating and the suite goes red — the "regenerated whenever the shipped share content is built" contract, enforced (the distribution is sha-keyed, ADR-015 Context §4, so *every commit* is a potential release; the test is the enforcement point, not `bin/release.mjs`).
- **B — multi-era spot-check (brief verification 1):** `ai-agents/README.md` carries ≥ 2 distinct hashes (11 distinct blobs exist), and specifically the manifest contains both the normalized hash of the generic-era blob (`git show db49851:generic/ai-agents/README.md` — a frozen historical coordinate, safe to pin) and of the current `claude/scaffold/ai-agents/README.md`.
- **C — CRLF fixture (brief verification 2):** take a currently-shipped file's bytes, rewrite `\n` → `\r\n`, run the *check-side* normalize+hash (imported from the generator): the result is present in the manifest — an ending-only variant classifies **untouched-stale, never owner-edited**. Negative control: the same file with one real content-byte changed matches nothing.
- **D — elision fixture (brief verification 3):** current scaffold `CLAUDE.md` with a synthetic populated rules block between its markers (block-only drift) hashes, after elision, to a manifest entry. Negative controls: body-drift outside the markers matches nothing; markers deleted entirely matches nothing (the §8 owner-edited rule).
- **E — marker-recognition contract:** a marker string quoted inside prose (not the whole line) is inert; a CRLF-terminated marker line still recognized — the two defects `marker_lines`' comments record.
- Fixtures are built **in memory** from real shipped bytes (no `test/fixtures/` additions — they can't rot).
- **Environment guards:** if `git rev-parse --is-shallow-repository` is true, fail with a clear "full clone required" diagnostic rather than a misleading red. The test derives the repo root the way `harness.mjs` does (parent of `test/`) and needs no prove-red seam — it must be indifferent to `FKIT_LAUNCHER`, because prove-red's `run_suite()` executes the whole real suite per mutation.
- **No prove-red mutation is added**, deliberately: mutations run suites against *copies*; this test's subject is the real repo's git history and committed artifact, which the copy-tree mechanism can't meaningfully mutate. Red-first is demonstrated by build order instead (below). ADR-026 (prove-red stays hand-rolled) untouched.

## Sequencing — red first, per the brief

1. Write `test/structure-manifest.test.js` first. Run `node --test test/structure-manifest.test.js` → **red** (no manifest, no generator). Capture the red output in the task worklog (brief verification 5).
2. Write `bin/generate-structure-manifest.mjs`; add the npm script.
3. Run it once → `claude/structure-manifest.tsv` created. Spot-check by hand: README.md hashes from ≥ 2 eras present (brief verification 1); `git status --porcelain ai-agents/` empty (verification 6).
4. `npm test` — full suite **including `test/prove-red.sh`** — green. Confirm the suite-time cost prove-red multiplies by ~16 stays acceptable; optimize the walk if not.

## Out of scope (guarded)

No classification consumer (0245/0246's territory); no consuming-project write ever; no launch-path change (0247); no wiki-vault write; no commit, no task-file move; **zero new devDependencies** (ADR-014 — the generator and test use node builtins only). The 0242 ship-gate is discharged (ADR-039 landed, 0242 Done) — releasing the manifest as a shipped artifact is licensed.

## Edge cases carried into implementation

- Omnigent-era root files without markers → whole-file hash (real case, verified).
- Malformed marker pair in any shipped version → generator fails loudly, never guesses.
- Adjacent (empty) marker pair → valid, elides nothing.
- CRLF→LF only — lone `\r` is content, untouched (the contract says CRLF, exactly).
- Same content shipped at a path in several homes/eras → hashes deduped per path.
- Historical-only paths included as data; class semantics stay the spec's.
- Merge-ancestry commits included (`git rev-list` full ancestry, not first-parent) — any ancestor sha was installable.
- Shallow clone → loud diagnostic, not a false red.
- Deterministic output (sort, LF, trailing newline) so regeneration diffs are minimal and test A is byte-exact.

## Open questions — RULED by the owner 2026-08-07 (see header)

1. **`marker_lines` "reuse" interpretation.** The generator is Node; `marker_lines` is an inline shell function in `fkit-claude-init.sh` that cannot be sourced without executing init. Plan implements the *contract* verbatim in JS (whole-line equality after `[ \t\r]` trim), cited to `marker_lines`, with test E asserting both of its load-bearing properties — reading the brief's "never a re-implementation of that contract" as forbidding a *divergent* recognition rule, not forbidding a second faithful implementation in another language. Alternative (extracting/sourcing the shell function, or shelling out to a copied awk program) is equally a second copy, just harder to test. **RULED: "Faithful JS impl (Recommended)".**
2. **Manifest path scope is a class-agnostic superset** — every file ever shipped under the homes (incl. `PROJECT.md`, wiki-vault files, historical-only paths), excluding only `.gitkeep` and `universal-rules.md`; classification stays entirely in the 0243 spec. This satisfies the brief's "every spec'd fkit-authored path" as a strict superset and decouples 0244 from the unlanded 0243. **RULED: "Class-agnostic superset (Recommended)".**
