# Implementation plan — task 0252: `RELEASING.md`

## 0. Grounding results — read this before the plan proper

Everything below was re-read on disk **2026-08-13**, at `HEAD = 1c82cbf`. Line numbers cited are today's.

### 0.1 The driver's correction is CONFIRMED — and it is itself imprecise in one way that matters

**Confirmed.** `install.sh:19` is `REF="${FKIT_REF:-main}"` and `install.sh:32` is:

```sh
curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$REF" | tar -xz -C "$TMP/src" --strip-components=1
```

`$REF` is interpolated straight into a codeload tarball URL, which accepts a tag name as readily as a branch name. So the brief's Fact 1 clause **"no install path resolves a tag" (`brief.md:81`) is false as written.** The true, weaker claim is the driver's: *the default and documented path tracks `main`; nothing in the release flow, the README, or `fkit update` points at a tag as an install target.* `claude/fkit-claude.sh:106` confirms the launcher half — `fkit_ref="${FKIT_REF:-$(_fkit_verfield ref)}"; fkit_ref="${fkit_ref:-main}"`.

**But the driver's own example command does not work.** The prompt writes it as:

```sh
FKIT_REF=v0.2.1 curl … | sh      # ← does NOT do what it looks like
```

In a POSIX pipeline the assignment prefix binds to the **first** command only — `curl` — not to the `sh` on the right of the pipe. Measured just now:

```
$ sh -c 'FKIT_REF=v0.2.1 printf "" | sh -c "echo inner-sees=[${FKIT_REF:-UNSET}]"'
inner-sees=[UNSET]
$ sh -c 'printf "" | FKIT_REF=v0.2.1 sh -c "echo inner-sees=[${FKIT_REF:-UNSET}]"'
inner-sees=[v0.2.1]
```

So that form silently installs **`main`** while appearing to pin a tag — a worse failure than the wording it was correcting. The working forms are `… | FKIT_REF=v0.2.1 sh`, or exporting `FKIT_REF` first. **`RELEASING.md` must not reproduce the broken form.** This is the single highest-value thing this document can get right, and it is exactly the kind of error the task exists to stop enshrining.

### 0.2 A code defect found while grounding — reported, not fixed (per the ⛔)

`claude/fkit-claude.sh:99-103`:

```sh
_fkit_reinstall() {   # run the canonical installer for $repo@$ref (refreshes resources + .version)
  command -v curl >/dev/null 2>&1 || { echo "fkit: curl is required to update" >&2; return 1; }
  FKIT_REPO="$fkit_repo" FKIT_REF="$fkit_ref" \
    curl -fsSL "https://raw.githubusercontent.com/$fkit_repo/$fkit_ref/install.sh" | sh
}
```

Same bug, in shipped code. The `FKIT_REPO=`/`FKIT_REF=` prefix binds to `curl`; the `sh` that actually runs `install.sh` never sees them. So `fkit update` on an install pinned to a non-default repo/ref **fetches the pinned ref's `install.sh` but runs it under `install.sh`'s own defaults**, reinstalling `flashist/fkit@main` and then writing `ref=main` into `$SHARE/.version` (`install.sh:69`) — the pin erases itself on first update.

Scope of the impact, precisely:
- **Invisible in the default case** (`flashist/fkit@main`), because the defaults and the intended values coincide. That is why it has survived.
- **Only bites** an install whose repo/ref came from `.version` rather than the caller's environment. An *exported* `FKIT_REF` in the user's shell is inherited by `sh` normally and does propagate.

⛔ Not fixed here — this is a documentation task and `claude/fkit-claude.sh` is explicitly out of scope (`brief.md:187`). **Recommend a separate one-line brief** (`| sh` → `| FKIT_REF=… sh`, or `env FKIT_REPO=… FKIT_REF=… sh`). It is a producer call, not mine.

Note the side effect on this task's content: it *strengthens* the "`main` is the channel" claim. `fkit update` lands on `main` even when it was asked not to.

### 0.3 Where the brief is now stale — itemized

The brief already carries dated corrections for the CI/gate half, and **those corrections are accurate** — I re-verified them. What follows is what is stale **beyond** what the brief already corrects.

| # | Brief text | Status today | Evidence (re-read 2026-08-13) |
|---|---|---|---|
| 1 | `:81` — "no install path resolves a tag" | **FALSE as written.** Not covered by any dated correction. | `install.sh:19`, `:32` — see §0.1 |
| 2 | `:80` — `bin/release.mjs` tags at `:202-209` | **Stale line numbers.** | Tag name `bin/release.mjs:213`; create/push `:259-263` |
| 3 | `:104` — `workingTreeFiles()` at `:258-293` | **Off by ~2.** Scope claim itself exact. | `bin/generate-structure-manifest.mjs:259-295` |
| 4 | `:90` — `_fkit_remote_version`, `:95` | **Imprecise.** `:95` is the URL line inside it. | Function is `claude/fkit-claude.sh:92-98` |
| 5 | `:88-89` — sha compare at `fkit-claude.sh:136-138` | **STILL ACCURATE.** 0257 did not move it. | `:136` `remote=`, `:137` `installed=`, `:138` the `!=` branch |
| 6 | `:95`, `:179` — "architecture.md **§6**" | **Wrong section number.** `§6` is *"Data model — everything is a file in git"*. The release prose is in **§7 "Key flows", numbered flow "6 — Release"**. | `ai-agents/knowledge-base/architecture.md:413-417`; §7 begins at `:337` |
| 7 | `:96-98` — the *reason* "Version bumping is load-bearing" | **The sentence survives; its stated justification is FALSIFIED by 0257.** See §0.4. | `claude/fkit-claude.sh:142-162` |
| 8 | `:34`, `:296` — `npm test` runtime | Brief says `~6 min` (four runs, 328/380/347/344 s). Driver measured **463 s** on 2026-08-13, above that range. **I did not re-measure** — a measurement costs ~8 min and belongs in the build step. | Open question 2 |

⛔ I am not editing `brief.md`, `sprint-5.md`, or `backlog.md`. This table *is* the surfacing.

### 0.4 "Version bumping is load-bearing" — still true, but not for the reason the brief gives

The brief (`:94-101`) defends the sentence with: *"an unbumped `VERSION` makes the notice read `v0.1.30 → v0.1.30 is available`."*

**That is precisely the bug task 0257 removed.** `claude/fkit-claude.sh:142-162` now reads:

```sh
if [ -n "$rver" ] && [ -n "$curver" ] && [ "$rver" != "$curver" ]; then
  printf '\n  ↑ fkit v%s → v%s is available. Run:  fkit update\n\n' "$curver" "$rver"
else
  printf '\n  ↑ fkit %s— newer content on %s (%s → %s). Run:  fkit update\n\n' \
    "${curver:+v$curver }" "$fkit_ref" \
    "$(printf %s "$installed" | cut -c1-7)" "$(printf %s "$remote" | cut -c1-7)"
fi
```

The `vA → vB` line now fires **only when two distinct known versions exist**. An unbumped `VERSION` falls to the `else` branch and prints a coherent sha-delta notice — not nonsense. The launcher's own comment at `:142-146` says so in past tense.

**So, verdict on the brief's ⚠️:** the sentence at `architecture.md:415` is **still accurate and must survive byte-identical** (brief item 2, verification step 4 — both honored). But `RELEASING.md` must state the **true, post-0257 reason**: bumping is what lets the update notice name a version delta (`v0.2.1 → v0.2.2`) instead of falling back to a sha delta. It must **not** repeat the brief's "otherwise you get `v0.1.30 → v0.1.30`" justification, which is stale.

This is the second claim this document would have enshrined permanently. It is the same failure mode as §0.1.

### 0.5 What I confirmed unchanged (so the plan rests on facts, not the brief)

- **The gate exists.** `bin/release.mjs:175-186` defines `runTests()`; `:188-192` runs it. The comment at `:160-174` states the position is load-bearing — immediately before the first mutating line. Red → `fail()`, nothing bumped/committed/tagged. Runs under `--dry-run` (`:71-74`). `--no-test` at `:34`/`:68`, behind an unconditional stderr banner at `:194-198`.
- **CI exists.** `.github/workflows/test.yml`, 50 lines: `push: branches: [main]` (`:16-17`), `pull_request:` (`:18`), `workflow_dispatch:` (`:20`), `ubuntu-latest`, `node-version: '24'`, `fetch-depth: 0` (mandatory — `:38-42`), `timeout-minutes: 20`. Its header comment (`:3-11`) already articulates the gate-vs-CI division cleanly and is worth echoing.
- **⚠️ CI has still never run.** No commits have been pushed by this work; `git log` shows the workflow landed 2026-08-12 and nothing observes a runner from here. **`RELEASING.md` says "wired, not yet observed green."**
- **Manifest scope — exactly as Fact 3 states.** `workingTreeFiles()` (`:259-295`) walks `claude/scaffold/` with `KNOWN = {ai-agents: 'walk', CLAUDE.md: 'root', AGENTS.md: 'root', universal-rules.md: 'skip'}`, dropping `.gitkeep` (`:288`), and **throws loudly on any unrecognized top-level scaffold entry** (`:268-277`) — worth a sentence, it is the guard that stops silent drift. The history walk uses `WALK_PATHS` (`:81`), derived from `HOME_PREFIXES` (`:68-72`: `generic/ai-agents/`, `omnigent/scaffold/ai-agents/`, `claude/scaffold/ai-agents/`) + `ROOT_FILES` (`:74-79`: the four `{omnigent,claude}/scaffold/{CLAUDE,AGENTS}.md`). **`bin/` is not covered; neither is `claude/skills/`, `claude/agents/`, nor `claude/fkit-claude*.sh`.** Confirmed as the driver suspected.
- **Not tribal knowledge:** `claude/structure-manifest.tsv:3`, generator header `:302`, and `test/structure-manifest.test.js:114` (`'  → fix: npm run generate:manifest   (then commit the manifest together with the change)'`) all say it.
- `claude/structure-spec.md:23` — *"can report the same `VERSION` and hold different content (ADR-015 Context §4)"*. ADR-015's own §4 heading is `:92`, and its evidence line `:346` reads *"installs at `main` HEAD, not at a tag"* — same imprecision as the brief, but it is a dated ADR and out of scope.
- **`RELEASING.md` does not exist.** Repo-root tracked `.md`: `AGENTS.md`, `CLAUDE.md`, `README.md`, `handoff-fkit-status-filtered-board.md`.

---

## 1. What gets built

**Two files. One new, one one-sentence addition.**

### File 1 — `RELEASING.md` (new, repo root)

Placement is settled (owner ruling 2026-08-08); not re-opened. Six sections:

**§ Preamble (3-4 lines, no heading).** What this is and who it is for: *maintainer guidance for the fkit repo itself.* State explicitly that it ships to nobody — it sits outside `claude/scaffold/` and outside `claude/structure-spec.md`'s inventory tables, which is why it is here and not in `ai-agents/knowledge-base/conventions/` (those are dual-homed; a consuming project has no release to cut). This sentence is what stops a future contributor "tidying" it into `conventions/`.

**§1 — `main` is the release channel.** The core fact, worded per §0.1. Cites `install.sh:19`, `install.sh:32`, `claude/fkit-claude.sh:106`. Says plainly: *merging to `main` is the act of shipping; every commit on `main` is live to the next install.* Then the tag paragraph, in the precise form — the `v<x.y.z>` tag `npm run release` creates is a **marker, not an install target**; nothing in the release flow, the README, or `fkit update` points an install at one; a tag *is* reachable by explicitly overriding `FKIT_REF` (because `$REF` goes straight to codeload), but that is neither the default nor a documented path, and `fkit update` will not keep an install pinned there (§0.2). ⛔ Neither "no install path resolves a tag" nor a headline "you can install a tag." Cross-reference ADR-015 Context §4 rather than restating it.

**§2 — What `VERSION` does, and what it does not do.** Does: names the release in the update notice, and **must keep being bumped for that reason** — the post-0257 reason from §0.4, not the brief's stale one. Does not: select, gate, or identify installed content — distribution is **sha-keyed** (`claude/fkit-claude.sh:136-138`; `VERSION` fetched separately at `:92-98` purely to word the notice). One sentence pointing at ADR-015 Context §4 and `claude/structure-spec.md:23` for the consequence (*two installs, same `VERSION`, different content*), not a restatement of their argument. Ends with an explicit anti-inference: **this is not "stop bumping"** — see `architecture.md:415`.

**§3 — Before you release: the checklist.** Ordered, short:
1. **`npm run generate:manifest` — when and only when `claude/scaffold/` content changed.** Name the exact covered set: `claude/scaffold/ai-agents/**` (minus `.gitkeep`) plus `claude/scaffold/CLAUDE.md` and `claude/scaffold/AGENTS.md`; `claude/scaffold/universal-rules.md` is deliberately skipped. State the negative explicitly: **editing `claude/skills/**`, `claude/agents/**`, or `claude/fkit-claude*.sh` does not require a regen.** Commit the regenerated `claude/structure-manifest.tsv` **in the same change**. Note the generator refuses loudly on an unrecognized scaffold entry (`:268-277`) — a new scaffold file is a decision, not a regen.
2. **Run `npm test` yourself first — as fast feedback, not as the last line of defence.** Because `npm run release` runs it too (§4), the reason to run it first is cost: you would rather fail before the release run than during it. **A failure is far cheaper than a pass** — `npm test` is `node --test test/*.test.js && bash test/prove-red.sh` (`package.json:5`), so a red unit suite short-circuits at the `&&` and `prove-red.sh` never runs; a break surfaces in about a minute. (Runtime figure → open question 2.)
3. **Decide the bump.** `npm run release` (patch) / `release:minor` / `release:major` / `--version x.y.z`. `VERSION` is the source of truth; `package.json` is kept in sync; they must already agree or the script aborts (`bin/release.mjs:143-147`).
4. **`npm run release:dry` if unsure.** Prints the plan and touches nothing — but note it **still runs the full suite**, so a dry run is not a cheap run.

**§4 — What `npm run release` does for you.** The gate, stated as it is: every run executes `npm test` **before its first mutating line** and refuses to release on red, leaving the tree exactly as you left it (`bin/release.mjs:160-192`). Say plainly **the gate cannot be forgotten**. Then the sequence: bump → `git add -A` → commit → push branch → annotated `v<version>` tag → push tag. Then the gate-vs-CI division, which `test.yml:3-11` already argues well: the **gate** sees the working tree `git add -A` is about to ship (including uncommitted and untracked work) and CI never can; **CI** covers `main` HEAD, which is what `install.sh` actually installs. Neither replaces the other.

**§5 — Residuals: what is still not covered.** Four bullets, each stated precisely and none inflated:
- **`--no-test` can still ship an unverified tree.** Loud (unconditional stderr banner, `bin/release.mjs:194-198`), never a default, but not blocked.
- **CI is wired, not yet observed green on a runner.** ⛔ Do not write that CI works; ⛔ do not write that no CI exists. `workflow_dispatch:` (`test.yml:20`) exists so the first run can be triggered without pushing.
- **The gate tests the tree as it stood when the suite started** — the version bump is written *after* it, so the gate does not test the exact committed bytes (`bin/release.mjs:167-174`). Deliberate, documented in the script.
- **No npm-registry publish** (`architecture.md:414`, `bin/release.mjs:66`). The tag and `main` are the whole distribution.

### File 2 — `ai-agents/knowledge-base/architecture.md`, flow "6 — Release"

One sentence appended after the existing paragraph at `:413-417`, pointing at `RELEASING.md` as the maintainer's release procedure. **No rewrite of the flow. The "Version bumping is load-bearing" sentence stays byte-identical** — enforced by verification step V5 below.

⚠️ **Note the brief's "§6" is a mis-citation** (§0.3 row 6). The edit lands in **§7 "Key flows" → numbered flow "6 — Release"**, at `architecture.md:413-417`. Same target the brief means; different section number than it names. Flagged so nobody "corrects" it later.

---

## 2. Sequencing

1. Re-run the citation sweep (V1 below) to pin every `file:line` on the day of writing — line numbers in this plan are from 2026-08-13 and could move if anything else lands first.
2. Write `RELEASING.md`.
3. Add the one sentence to `architecture.md`.
4. Run the full verification set (§3). Fix any citation drift the sweep finds.
5. Write `plan.md` and `worklog.md` into `ai-agents/tasks/backlog/0252-…/` (ADR-020/029 task-folder artifacts).
6. Hand to review. ⛔ No commit, no push, no task-file move, no re-rank.

---

## 3. Verification — named commands, not "review carefully"

The driver is right that this is the weak point, and that this session has now been bitten twice by unverified claims (§0.1, §0.4). So the citation check is **mechanical**, not a reading.

**V1 — every `file:line` citation in `RELEASING.md` is printed back from disk.** Run at the repo root:

```sh
grep -oE '[A-Za-z0-9_./-]+\.(sh|mjs|js|json|yml|tsv|md):[0-9]+(-[0-9]+)?' RELEASING.md \
| sort -u \
| while IFS=: read -r f l; do
    s=${l%%-*}; e=${l##*-}
    printf '\n--- %s:%s ---\n' "$f" "$l"
    if [ -f "$f" ]; then sed -n "${s},${e}p" "$f"; else echo "!! MISSING FILE: $f"; fi
  done
```

Every span printed must contain the thing the document claims is there. A missing file or an empty span is a hard fail. This is a throwaway command, **not a committed script** — committing a checker is a different task.

**V2 — the specific claims the brief's verification step 2 names:**
```sh
grep -n 'FKIT_REF:-main' install.sh claude/fkit-claude.sh
grep -n 'workingTreeFiles' bin/generate-structure-manifest.mjs
grep -n 'codeload.github.com' install.sh
grep -n 'runTests' bin/release.mjs
grep -n 'workflow_dispatch' .github/workflows/test.yml
```

**V3 — the manifest-scope claim is exact and does not over-claim** (brief verification step 3):
```sh
sed -n '259,295p' bin/generate-structure-manifest.mjs   # the KNOWN map, verbatim
grep -n 'claude/skills\|claude/agents' RELEASING.md      # must appear ONLY in a "does not require a regen" sentence
```

**V4 — the tag-reachability wording is right, and the command form is right.** If §1 prints an `FKIT_REF` example at all (open question 3), it must place the assignment **after** the pipe:
```sh
grep -n 'FKIT_REF' RELEASING.md    # must not match '^.*FKIT_REF=[^ ]* *curl'
```
Manual read of the matched lines against §0.1. This is the one claim I will not delegate to a regex alone.

**V5 — `architecture.md`'s protected sentence is byte-identical** (brief verification step 4):
```sh
grep -n "Version bumping is load-bearing" ai-agents/knowledge-base/architecture.md
git diff -U0 -- ai-agents/knowledge-base/architecture.md
```
The diff must show **added lines only** — no `-` line other than a pure context re-flow, and never the protected sentence.

**V6 — nothing leaked into a forbidden tree** (brief verification step 5):
```sh
git status --porcelain
```
Must show exactly `?? RELEASING.md`, `M ai-agents/knowledge-base/architecture.md`, and the task-folder artifacts. **Nothing under `ai-agents/wiki-vault/`, nothing under `claude/scaffold/`, nothing under `claude/`, `bin/`, `install.sh`, or `.github/`.**

**V7 — `npm test` green** (brief verification step 6). Docs-only at repo root, so nothing should move. Reasoning for why it should be green — stated as expectation, confirmed by the run, not asserted in place of it: `structure-manifest.test.js` walks `claude/scaffold/` only, so a root file owes no regen; `structure-spec.test.js` parses the inventory tables, which do not list it; `dual-home-parity.test.js` walks `ai-agents/knowledge-base/conventions/` ∪ scaffold, untouched. **`RELEASING.md` is therefore its own worked example of §3 checklist item 1 — a `claude/`-adjacent change that owes no regen.** Budget several minutes (open question 2) and do not read silence as a hang. This run also yields a fresh runtime data point, which I will report.

**V8 — the two claims this task exists to stop enshrining are absent.** Manual, but targeted:
```sh
grep -n 'no install path\|cannot install a tag\|no CI\|CI is working\|v0.1.30\|nothing else will' RELEASING.md
```
Expected: **no matches.**

---

## 4. Risks and edge cases

- **The document goes stale the way the brief did.** Mitigation: `RELEASING.md` cites `file:line` sparingly and prefers *function/constant names* (`runTests()`, `WALK_PATHS`, `_fkit_remote_sha`) which survive line drift, using line numbers only where a reader needs to find a specific line. V1 stays runnable by anyone later.
- **Over-correcting §1.** Real risk: making tag-installability sound like a feature. Mitigation: the tag paragraph leads with *marker, not install target* and the override is framed as unsupported, with §0.2's self-erasing-pin fact as the concrete reason.
- **A reviewer flags the `--no-test` and CI-never-ran bullets as FUD.** They are brief-mandated and true. Pre-empted by stating each in one precise sentence in §5 rather than as a warning banner.
- **`handoff-fkit-status-filtered-board.md` sits untracked-adjacent at root** — unrelated, not touched, mentioned only so its presence in `git status` output is not mistaken for this task's doing.
- **Line numbers in this plan drift** if anything lands between approval and build. V1 + V2 are re-run at write time; the plan's numbers are evidence for the *decisions*, not the document's citations.

---

## 5. Answers to the four scope questions

1. **Sections** — six, as §1 above (preamble, channel, `VERSION`, checklist, what release does, residuals).
2. **Second file** — `architecture.md` is already in scope (brief item 2). README is **not planned** → open question 1.
3. **Runtime number** → open question 2.
4. **Verification** → §3, eight named checks.

---

## 6. Open questions for the owner

**Q1 — Does `README.md` get a pointer to `RELEASING.md`?**
My finding: **no obligation.** README's `## Layout` block (`README.md:88-100`) is a **curated** listing, not exhaustive — it already omits `README.md`, `CLAUDE.md`, `AGENTS.md`, `package.json`, `bin/`, and `test/`. So `RELEASING.md`'s absence is not an inconsistency. README is also reader-facing (people *installing* fkit), while `RELEASING.md` is maintainer-facing.
- **(a) No README change (Rec).** Zero collision risk with `0253` (P14, open), which owns `README.md:31-33` "Staying current". Keeps this task to two files.
- **(b) Add one line to `## Layout`** — `RELEASING.md   how a release is cut (maintainers)`. Cheap; lands at `README.md:89-90`, structurally distant from 0253's paragraph, so a collision is avoidable but no longer impossible.
- **(c) Add a sentence to "Staying current"** — ⛔ **not recommended**: that is exactly 0253's paragraph. Direct collision.

**Q2 — Does `RELEASING.md` name a runtime figure for `npm test`, and which?**
The brief's amendments (owner-ruled 2026-08-12) say write **`~6 min`** — four runs, 328/380/347/344 s. The driver measured **463 s (7 m 43 s)** on 2026-08-13, **outside that range**. I did not re-measure; V7 will produce a fifth data point.
- **(a) State a range: "roughly 6-8 minutes, machine-dependent" (Rec).** Honest across all five measurements, does not enshrine a number already known to be low, and does not contradict the brief's intent (a budget, not a spec). Add one clause that a *failing* run returns in about a minute.
- **(b) Write `~6 min` exactly as the brief's amendment instructs.** Consistent with `bin/release.mjs:71`/`:173`/`:190` and `test.yml:28-32` — but propagates a figure the newest measurement exceeds by 28%, into a **fourth** site.
- **(c) Name no number** — "budget several minutes; the script prints its own estimate." Cannot go stale. But drops the useful red-vs-green cost asymmetry that makes checklist item 2 worth doing.

⚠️ Regardless of choice: the existing `~6 min` sites (`bin/release.mjs:71`, `:173`, `:190`; `.github/workflows/test.yml:28-32`) are **outside this task's scope** (⛔ no `bin/release.mjs` edit). If (a) or (c) is chosen, `RELEASING.md` and the script disagree by design — that gap wants a separate brief. Producer call.

**Q3 — Does §1 print a literal `FKIT_REF` install command?**
- **(a) Yes, in the correct post-pipe form, explicitly labelled unsupported (Rec).** Someone will try this; showing the working form is what stops them writing the broken one (§0.1). Framed as *"reachable, not supported"*.
- **(b) No command, prose only** — "a tag is reachable only by explicitly overriding `FKIT_REF`." Zero risk of reading as endorsement; leaves a reader to invent the incantation themselves, and the obvious guess is the broken one.

---

## What's next?

- **Approve or amend the plan**, and answer Q1-Q3 — the build is gated on them (Q2 changes prose, Q1 changes the file count).
- **Two items for the producer, both outside this task:** (i) the `_fkit_reinstall` env-propagation defect at `claude/fkit-claude.sh:101-102` (§0.2) — real, shipped, invisible in the default case; (ii) the `~6 min` figure at `bin/release.mjs:71`/`:173`/`:190` vs the 463 s measurement, if Q2 lands on (a) or (c).
- **Nothing is written yet.** No files created, no commits, no task-file moves.

---

<!-- ─────────────────────────────────────────────────────────────────────────
     DRIVER-APPENDED — NOT part of the approved plan text above.
     Written by fkit-sprint-ship-loop at the plan gate, 2026-08-13.
     ───────────────────────────────────────────────────────────────────────── -->

## Owner approval record (driver-appended)

The owner approved this plan via `AskUserQuestion` in the `fkit lead` session on **2026-08-13**, and
answered all three open questions.

**Plan approved** — verbatim option label: *"Approve"*. Scope is the two files named in §1:
`RELEASING.md` (new, repo root) and one appended sentence to `architecture.md` flow 6.

**Q1 — README pointer: NO README CHANGE.** The owner took the plan's own recommendation (a),
presented as part of the approval. ⛔ Do not touch `README.md` under this task — `0253` (P14, still
open) owns the README change, and avoiding the collision is the reason. **File count stays two.**

**Q2 — Runtime figure: option (a), "roughly 6–8 minutes, machine-dependent."**
⚠️ **This is a NEW owner ruling that SUPERSEDES the owner's own 2026-08-12 ruling** which had said to
write `~6 min`. The conflict was put to the owner explicitly and in those terms — that choosing
anything but `~6 min` overrides their earlier ruling — and they chose the range anyway. So:
- `RELEASING.md` writes **"roughly 6–8 minutes, machine-dependent"**, plus the plan's clause that a
  *failing* run returns in about a minute.
- The brief's `~6 min` amendment text is **superseded on this point, and is NOT to be edited**
  (⛔ no brief edit under this task) — the supersession lives here and in the worklog.
- The resulting disagreement with `bin/release.mjs:71`/`:173`/`:190` and `test.yml:28-32` is
  **deliberate and accepted**, not an oversight. Those sites stay out of scope.

**Q3 — Literal `FKIT_REF` command: YES, option (a).** Verbatim option label: *"Yes — correct
post-pipe form, labelled unsupported"*. §1 prints `curl … | FKIT_REF=v0.2.1 sh`, framed as
*"reachable, not supported"*. ⛔ **Never the pre-pipe form.** V4 enforces this.

**The `_fkit_reinstall` defect (§0.2) — FOLDED INTO TASK `0284`.** Verbatim option label: *"Fold into
0284"*. A producer amends `0284`'s brief separately; `0284` stays `🔲 Backlog`. ⛔ **Not this task's
work — do not fix it here, and do not file it.** The owner was told, and it drove the choice, that
`0284` is already open to add `--max-time` to that exact line (`:102`) by their own 2026-08-13
ruling — so the two fix sites coincide and one task avoids a conflicting second edit.

**Driver's independent verification, run before approval** (measured this turn, not asserted):

- **The plan's correction to the driver is CONFIRMED, and the driver's original claim was WRONG.**
  Measured with a corrected test (the driver's first attempt was itself malformed — the middle shell
  expanded the variable, so both forms printed `UNSET` and the test measured nothing):
  ```
  sh -c 'FKIT_REF=vTAG printf "" | sh -c '\''echo inner sees [$FKIT_REF]'\'''  → inner sees []
  sh -c 'printf "" | FKIT_REF=vTAG sh -c '\''echo inner sees [$FKIT_REF]'\'''  → inner sees [vTAG]
  ```
  The assignment prefix binds to the **first** command of the pipeline. §0.1 stands in full.
- `claude/fkit-claude.sh:99-103` re-read from disk — the `FKIT_REPO=… FKIT_REF=… curl … | sh` shape
  in §0.2 is present exactly as quoted. The defect is real and shipped.
- `0284`'s brief confirmed open and already scoped to edit `:102` (`--max-time`), by owner ruling
  2026-08-13 — which is why the propagation fix folds there rather than into a new task.
- `architecture.md:413-417` re-read: the protected sentence is **"Version bumping is load-bearing"**
  followed by *"— self-update compares the installed sha against the remote head and reports the
  version from `VERSION`."* That wording is consistent with §0.4's post-0257 finding, and it must
  survive byte-identical (V5).
