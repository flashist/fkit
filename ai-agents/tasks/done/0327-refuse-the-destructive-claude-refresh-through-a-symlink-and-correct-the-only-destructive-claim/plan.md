# Implementation plan — task `0327`

**Refuse init's destructive `.claude/` refresh through a symlink, and correct the "ONLY DESTRUCTIVE OPERATION" claim**

Brief: `/Users/mark.dolbyrev/Workspace/fkit/ai-agents/tasks/done/0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim/brief.md`
Planned against `HEAD` = `c45ec3d` ("Ship push"), 2026-08-24. **Planning-only — nothing was written.**

- **Corrections:** 2026-09-04 (`0335`, inside sweep `0357`) — this plan carries **two** dated ⚠️ notes
  inline, both **subject A** (*"the escape happens because `ls` dereferences"*): at **§6 Q1's ⚠️ note**
  (the mechanism itself) and at the **Q1(a) accepted-consequence paragraph** (which inherits that
  mechanism by reference). Marker legend: **⚠️ = a fact that drifted**; **⛔ = a decision that was
  overturned** — both notes are ⚠️, no existing line was edited, and **no ruling is reopened**.

---

## 0. Corrections to what I was told (measured this turn)

Three things I was handed are stale. None changes the task; all change the plan's starting assumptions.

| Claim I was given | Measured today |
|---|---|
| "`0046` … is in the working tree, **uncommitted**" | **Committed.** `git status --porcelain claude/` is **empty**. `0046` landed in `c45ec3d`; its brief is in `ai-agents/tasks/done/`. |
| "`claude/structure-manifest.tsv` … is **already dirty** from another task" | **Clean.** `git status --porcelain claude/structure-manifest.tsv` is empty. |
| The false claim lives at **one** site (`fkit-claude-init.sh:637`) | **Five sites.** See §1.3. `:637` is correct as a coordinate, but it is not the only one. |

Baseline, re-measured this turn (not taken on report): `npm run test:unit` → `tests 737 / pass 737 / fail 0 / suites 20`; `bash test/prove-red.sh` → all 22 mutations red at their named assertion, `✓ hard gate PASSED`.

---

## 1. What is actually wrong

### 1.1 The code, as it stands

`/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude-init.sh:525-536` — anchored on the comment `# 3. refresh the fkit-managed agents + skills (rm+cp of fkit-managed names ONLY …`:

```sh
# 3. refresh the fkit-managed agents + skills (rm+cp of fkit-managed names ONLY — a user's own
#    agents/skills in .claude/ are never touched)
mkdir -p "$dest/.claude/agents" "$dest/.claude/skills"          # :527
rm -f "$dest/.claude/agents/fkit-"*.md                          # :528
cp "$here/agents/fkit-"*.md "$dest/.claude/agents/"             # :529
n_agents="$(ls "$here/agents/fkit-"*.md | wc -l | tr -d ' ')"   # :530
for d in "$dest/.claude/skills/fkit-"*/; do                     # :531
  [ -d "$d" ] && rm -rf "$d"                                    # :532
done                                                             # :533
cp -R "$here/skills/fkit-"* "$dest/.claude/skills/"             # :534
n_skills="$(ls -d "$here/skills/fkit-"*/ | wc -l | tr -d ' ')"  # :535
echo "• refreshed $n_agents agents → .claude/agents/, $n_skills skills → .claude/skills/"  # :536
```

No `[ -L ]` on any component. `mkdir -p`, `rm -f`, `rm -rf`, and `cp`/`cp -R` all dereference.

The guard already exists: `path_contained "<project-relative-path>" <verb>` at `:289` (`path_contained() {  # path_contained <project-relative-path> <verb> → 0 = safe, non-zero + reason on stdout`). It walks every component from `$dest` down testing `[ -L ]`, refuses absolute paths and `..`, prints the reason on stdout, returns non-zero. Callers today: §4 at `:552` (verb `write`), §6 at `:755` (verb `delete`). **I verified the shape fits §3** — see §1.4 for the one place it does not fit trivially.

### 1.2 Reproduced firsthand, 2026-08-24, in `mktemp -d` scratch dirs under `/tmp`, all removed afterwards

Method: throwaway project (`$w/proj`) with a copy of `claude/scaffold/ai-agents`; a throwaway "outside" dir (`$w/outside`) pre-seeded with the user's own files; `.claude` (or a component) symlinked to it; then `claude/fkit-claude-init.sh $w/proj </dev/null`. The repo working tree was never a target and `git status --porcelain claude/ test/` is empty after.

**Main case — `.claude` → outside directory:**

```
--- BEFORE ---
<W>/outside/agents/fkit-mine.md
<W>/outside/skills/fkit-myskill/SKILL.md
EXIT=0
stdout: • refreshed 7 agents → .claude/agents/, 26 skills → .claude/skills/
stderr: (empty)
--- AFTER ---
fkit-mine.md DELETED
fkit-myskill/ DELETED
7 agent files + 26 skill dirs written at the link target
project's .claude is still just the symlink — no real .claude/ in the project
```

**Both destructive sites confirmed**, and the brief's central claims all still hold: exit 0, no warning, silent deletion outside the project, the whole fkit payload written out through the link.

**Three further shapes I measured, which the brief anticipates but does not have results for:**

| Shape | Result today | Notes |
|---|---|---|
| **A.** `.claude` real, `.claude/skills` → outside | **EXIT=0**, 26 skill dirs escape, `fkit-myskill/` deleted; agents install correctly into the project | A symlinked component **deeper than the leaf**. Confirms the guard must walk the chain per half, not just test `.claude`. |
| **B.** `.claude` a **dangling** symlink | **EXIT=1 — init DIES.** `mkdir: …/.claude: No such file or directory` (printed twice), `set -euo pipefail` kills init at `:527`; §5, §6 and the summary never run | Not a data-loss shape, a **denial-of-service** shape — the same one `0069` recorded for `ai-agents/` and `0046` recorded for `.fkit`. An `-L`-first guard fixes it as a side effect. |
| **C.** `.claude` real, `.claude/agents` → outside | **EXIT=0**, 7 agent files escape, `fkit-mine.md` deleted; skills install correctly into the project | The mirror of A. Confirms the two halves fail **independently**. |
| **D.** control, ordinary project | EXIT=0, correct install, no stderr | Unaffected. |

A and C together are the finding that shapes the design: **the two halves are independently reachable, and independently survivable.** A symlinked `.claude/skills` should not cost the user their agents.

### 1.3 The false claim is at five sites, not one

```
claude/fkit-claude-init.sh:637   # ⚠️ THIS IS THE ONLY DESTRUCTIVE OPERATION IN FKIT. Read the whole comment before touching it.
claude/fkit-claude-init.sh:17    #      one destructive thing fkit does; announced per path, gated on a reference check
claude/orphan-targets:9          #    rollback. It is the only destructive operation in fkit. Do not add a path because it looks dead.
test/orphan-cleanup.test.js:1    // The orphan-cleanup contract (task 36) — the ONLY destructive operation in fkit.
test/init-intake-guard.test.js:4 // … and §6 applies it to the one destructive operation. …
```

`:637` is the brief's named deliverable and I re-derived it by the quoted string (`grep -n "ONLY DESTRUCTIVE"`), not by going to a number. But `:17` is the **same file's header bullet**, twenty lines from the top, saying the same false thing — correcting `:637` and leaving `:17` is not a fix. `claude/orphan-targets:9` is a **shipped production file** whose version is arguably the most load-bearing of the five: it is the sentence that tells a future contributor that adding a delete is a new owner decision. The two test-file headers are the record the next reader will consult.

**I plan to correct all five.** This is a scope widening past the brief's literal wording (which names only the `:637` string), and I am surfacing it here at the approval gate rather than doing it silently. Trim it if you want it tight — see §6, Q2.

### 1.4 The one place `path_contained`'s shape does not fit trivially

`path_contained` prints its reason on **stdout** and returns non-zero, so the caller captures it in a command substitution (`if ! reason="$(path_contained … )"; then`). That works for §3 unchanged.

What does not carry over from §4: §4 guards **one** path with **one** call. §3 guards **two** paths, and today they share a single `mkdir -p` statement (`:527`) that must be split. Also `n_agents`/`n_skills` become conditionally-unset under `set -u`, so they need initializing, and the summary line at `:536` must stop claiming a refresh that did not happen.

---

## 2. The change surface

| File | What changes |
|---|---|
| `/Users/mark.dolbyrev/Workspace/fkit/claude/fkit-claude-init.sh` | **§3 (`:525-536`)** — rewrite as two independently-guarded halves. **`:637`** — correct the exclusivity claim and add the §3 cross-reference. **`:17`** — correct the header's §6 bullet. **`:12-13`** — note the §3 guard in the header's §3 bullet. |
| `/Users/mark.dolbyrev/Workspace/fkit/claude/orphan-targets` | **`:9`** — correct the exclusivity claim in the ⛔ owner-ruling block. Comment-only; the `#` prefix keeps it invisible to `cleanup_orphans()`'s parser. |
| `/Users/mark.dolbyrev/Workspace/fkit/test/init-claude-refresh-guard.test.js` | **NEW.** The §3 contract suite, modeled on `test/init-intake-guard.test.js`. |
| `/Users/mark.dolbyrev/Workspace/fkit/test/orphan-cleanup.test.js` | **`:1`** — header comment only. No assertion changes. |
| `/Users/mark.dolbyrev/Workspace/fkit/test/init-intake-guard.test.js` | **`:4`** — header comment only. No assertion changes. |

**Not touched, verified this turn:**
- `claude/structure-manifest.tsv` — **no regen owed.** `bin/generate-structure-manifest.mjs` walks only `claude/scaffold/` (its `readdirSync(join(REPO_ROOT, 'claude', 'scaffold'))` plus git history over 3 home prefixes + 4 root-file paths). Neither `fkit-claude-init.sh` nor `orphan-targets` is in that set. Verified by reading the generator, not assumed.
- `claude/fkit-claude.sh` — the launcher. See §6 Q1; I am recommending we do **not** touch it.
- `test/prove-red.sh` / `test/harness.mjs` — see §4.4.

---

## 3. The steps, in order

### Step 1 — write the test suite first, and run it RED

Create `test/init-claude-refresh-guard.test.js` **before** touching init. Model: `test/init-intake-guard.test.js` (same imports, same `trash`/`after` containment, same `manifest()` two-way freeze discipline, same `rc === 0 || rc === 3` tolerance).

Counts are **derived**, not hardcoded — `readdirSync(join(REPO,'claude','agents'))` filtered to `fkit-*.md`, and `claude/skills/fkit-*/` — so adding a role or skill later cannot red this suite.

Tests:

| # | Case | Assertions | Pre-fix |
|---|---|---|---|
| A1 | `.claude` → outside, seeded with `agents/fkit-mine.md` + `skills/fkit-myskill/` | both user paths still exist; **two-way `manifest(outside)` freeze equal**; stderr matches both refusals; rc 0 or 3; **no `• refreshed` line on stdout** | **RED** (measured: both deleted, exit 0, no stderr) |
| A2 | `.claude/skills` → outside, `.claude/agents` real | outside frozen; `fkit-myskill/` survives; **agents still installed in the project** (N regular files, `lstatSync` not a symlink); stdout names skills-only refusal | **RED** (measured shape A) |
| A3 | `.claude/agents` → outside, `.claude/skills` real | outside frozen; `fkit-mine.md` survives; **skills still installed in the project**; stdout names agents-only refusal | **RED** (measured shape C) |
| A4 | `.claude` a **dangling** symlink | rc 0 or 3 (**not 1**); link target never created; `.gitignore` exists (§5 ran); summary printed (`/Role-locked sessions/`) | **RED** (measured: EXIT=1, init dies) |
| A5 | `.claude` symlinked **inside** the project | refused anyway — the rule is "no symlink in the chain", not "does it escape"; nothing lands at the inner dir | **RED** (pre-fix it writes through). Pins the same deliberate behaviour change `0046` pinned for `.fkit`. |
| B1 | verb consistency in one run | §3 says `refresh`, §4 still says `write`, §6 still says `delete` | RED (no `refresh` message exists) |
| C1 | **control** — ordinary project | N agents + M skills land as **regular files/dirs**; the `• refreshed N agents → .claude/agents/, M skills → .claude/skills/` line prints **byte-identically**; a user's own `my-agent.md` and `my-skill/` (non-`fkit-` names) survive untouched; a second run is idempotent (`manifest` equal) | **GREEN before and after.** If this ever reds, the fix broke the happy path. |

**Run it against unmodified init and record the failure list.** This is the red-first proof; see §4.1 for exact commands and §4.4 for why `prove-red.sh` cannot supply it.

### Step 2 — implement the §3 guard

Replace `:527-536`. Shape (final wording settled at build time; this is the structure):

```sh
# [ -L ] FIRST, ALWAYS — §1's doctrine, §4's and §6's application, and the site with the WORST
# consequence. `mkdir -p`, `rm -f`, `rm -rf` and `cp` all DEREFERENCE: with .claude symlinked out of
# the project this DELETED a user's agents/fkit-*.md and rm -rf'd their skills/fkit-*/ at the link
# target and exited 0 (reproduced, 0327) — and a symlinked .claude/agents or .claude/skills does the
# same one half at a time. Whole chain, not just the leaf.
#
# TWO calls, not one, because the halves fail independently and are independently survivable: a
# symlinked .claude/skills must not cost the user their agents. Each call walks .claude too, so a
# symlinked .claude refuses both — two messages for two skipped steps, which is §1's shape, not noise.
#
# Non-fatal (§1's bar, 0088's, and §4's): warn and carry on. STDERR, not stdout — the launcher sends
# init's stdout to /dev/null on an already-set-up project, exactly the case this warning exists for.
n_agents=""
n_skills=""
if ! agents_reason="$(path_contained ".claude/agents" refresh)"; then
  {
    echo "⚠ skipped the .claude/agents refresh: $agents_reason"
    echo "    $dest/.claude/agents"
    echo "  Nothing was written or deleted and nothing is broken. The rest of setup continues — but"
    echo "  your fkit agents were NOT installed here, so a session started now may find none."
    echo "  Replace the symlinked path with a real directory, then re-run: fkit"
  } >&2
else
  mkdir -p "$dest/.claude/agents"
  rm -f "$dest/.claude/agents/fkit-"*.md
  cp "$here/agents/fkit-"*.md "$dest/.claude/agents/"
  n_agents="$(ls "$here/agents/fkit-"*.md | wc -l | tr -d ' ')"
fi
# … the skills half, same shape, guarding `.claude/skills`, wrapping the mkdir, the rm -rf loop and
#   the cp -R …
```

Then the summary line becomes truthful per-half — both halves ran → **byte-identical to today's line**; one half → that half only; neither → no line at all (the two stderr warnings carry it).

Decisions taken, and why:

- **Verb `refresh`.** The verb is a free parameter precisely so each caller's refusal says what it was about to do. §3 does `mkdir` + `rm` + `cp` in one breath; "refresh" is the only word true of all three. `delete` would understate the writes, `write` would understate the deletes. Existing pins on §4's `write` and §6's `delete` are unaffected.
- **Two calls, not one on `.claude`.** From measured shapes A and C: the halves are independently reachable. Per-half refusal is strictly better for the user and is what makes A2/A3 assertable.
- **Guard placed before `mkdir -p`.** Required, not stylistic: shape B (dangling `.claude`) kills init *at* the `mkdir`, so a guard placed after it never runs.
- **Non-fatal, exit status unchanged.** See §6 Q1 for the part of this I am **not** deciding.

### Step 3 — correct the exclusivity claim

`claude/fkit-claude-init.sh:637`, found by `grep -n "ONLY DESTRUCTIVE"` — **re-characterise *and* enumerate**, which is the brief's "say which, and why". Both halves, because either alone is a worse comment:

```
# ⚠️ THIS IS FKIT'S ONLY UNRECOVERABLE DELETE — the only place it removes a path it did not write and
# does not put back. Read the whole comment before touching it.
#
# It is NOT the only `rm` (0327). §3 above deletes too: an `rm -f` over the fkit-managed agent files
# and an `rm -rf` over each fkit-managed skill directory. That is a REFRESH — it removes only fkit's
# own managed names, in fkit's own gitignored namespace, and re-copies them in the next statement, so
# re-running init restores it. This section removes the USER's paths, permanently, and nothing
# recreates them. That difference is why §6 carries the apparatus below — per-path announcement, a
# reference-count gate, a containment walk — and §3 carries only the containment walk.
```

The re-characterisation is defensible on the code, not on convenience: §3's deletes are namespaced to `fkit-*` under `.claude/`, gitignored (`:632-633`), and re-created in the same statement; §6's are permanent removals of paths fkit never wrote. **Recorded caveat, which goes in the worklog:** §3's `rm -f …/fkit-*.md` *will* delete a user file that happens to use the `fkit-` prefix — that is exactly what my reproduction's `fkit-mine.md` was. Inside the project that is the documented namespace convention, and `:526`'s "a user's own agents/skills in `.claude/` are never touched" is true only for non-`fkit-` names. I am **not** changing that behaviour here; I am recording that the comment slightly overclaims.

> ⚠️ **Build-time trap, stated so it cannot be forgotten.** The surrounding comment warns that naming a path in prose is a **reference**, and `orphan_refs()` counts references by grepping all of `claude/` for each target token — it cannot tell "we mention this" from "we use this". Targets today are `.fkit/agents`, `.fkit/run`, `.fkit/team-session`, `.omnigent`. My replacement text deliberately says "the fkit-managed agent files" rather than spelling a path, and contains **no** target token (`.claude/agents` does not contain `.fkit/agents`). **This must be re-verified against the actual bytes after editing** — see §4.3.

Then `:17`, `:12-13`, `claude/orphan-targets:9`, and the two test headers, as listed in §2.

### Step 4 — verify (§4), then write the worklog

`worklog.md` records: the reproduction, the non-fatal decision and its reasoning, the re-characterise-vs-enumerate choice, the `fkit-` prefix caveat above, and — required by the brief — the **inherited TOCTOU residual**: the window between the `-L` check and the write is not closable in POSIX shell (it needs `openat()`-class primitives). `:673-677` already records exactly this for §6. The new guard **inherits** that residual; it does not widen it. A worklog claiming the symlink hazard is "closed" without naming it has over-claimed.

---

## 4. Verification

### 4.1 The red-first demonstration — exact commands

```sh
cd /Users/mark.dolbyrev/Workspace/fkit

# RED: suite written, init untouched. Capture the failure list verbatim into the worklog.
node --test test/init-claude-refresh-guard.test.js 2>&1 | tee /tmp/0327-red.txt
# Expect: A1 A2 A3 A4 A5 B1 fail; C1 (control) passes.

# … apply Step 2 …

# GREEN
node --test test/init-claude-refresh-guard.test.js
# Expect: all pass, including C1 unchanged.

# Full baseline
npm run test:unit          # expect 737 + N new, fail 0
bash test/prove-red.sh     # expect all 22 mutations red at their NAMED assertion, ✓ hard gate PASSED
```

Pass criteria: every A/B test flips red→green; **C1 is green in both runs** (a control that only goes green after the fix is not a control); unit count = 737 + the new tests with `fail 0`; prove-red still 22/22.

### 4.2 Containment — where every test symlink points, and how it cleans up

Every "outside" directory is `mkdtempSync(join(tmpdir(), 'fkit-outside-'))`. Every project is `mkdtempSync(join(tmpdir(), 'fkit-refresh-'))`. Both are pushed onto a module-level `trash` array and removed in `after(() => trash.forEach(cleanup))` — byte-for-byte the discipline `test/init-intake-guard.test.js` already uses.

**No fixed path. Nothing under the repo. Nothing outside `os.tmpdir()`.** The symlink escapes the throwaway *project*; it never leaves `os.tmpdir()` and it never reaches the repo. `git status` stays clean — which I will assert by running `git status --porcelain` after the suite.

My planning-time reproductions followed the same rule (`mktemp -d /tmp/fkit-0327-XXXXXX`) and were removed; `git status --porcelain claude/ test/` is empty right now.

### 4.3 The reference-gate check — a required post-edit step, not an assumption

After editing near §6:

```sh
grep -rniE -- '\.fkit/(agents|run|team-session)($|[^A-Za-z0-9_.-])|\.omnigent($|[^A-Za-z0-9_.-])' claude/ | grep -v '^claude/orphan-targets:'
node --test test/orphan-cleanup.test.js
```

The first must return nothing new that my edit introduced; the second must be green. `FKIT_CLEANUP_DRY_RUN=1` is available if a live check is wanted.

### 4.4 `test/prove-red.sh` — verified NOT applicable, and I am not building the seam

Confirmed by reading, not trusted from the brief: `test/harness.mjs:160` is

```js
export const INIT = join(REPO, 'claude', 'fkit-claude-init.sh');
```

— hardcoded, **no env override** (the only `process.env.FKIT_*` in that file is `FKIT_LAUNCHER` at `:25`). `runInit()` therefore always spawns the **real** repo init. `prove-red.sh`'s `make_claude_copy()` copies the whole `claude/` tree and points `FKIT_LAUNCHER` at the copy's launcher, so a mutation to the copy's init is exercised only by tests that go *through the launcher* — and my suite, like `init-intake-guard.test.js`, drives init directly. **A mutant init cannot red my suite.** That seam is open task `0037`'s deliverable and I am not building it here.

Consequence, stated plainly: **the red-first proof for this change is manual (§4.1), not mechanized.** That is a real gap in this change's evidence, and it is `0037`'s to close.

Side note that must hold: my tests never read `FKIT_LAUNCHER`, so they are green under every mutant run and cannot false-red prove-red's step 0.

### 4.5 Regression checks at the other guarded sites

`node --test test/converge-contract.test.js test/orphan-cleanup.test.js test/init-intake-guard.test.js test/launcher-contract.test.js test/structure-notice.test.js` — §1 convergence, `install_root_file`/`merge_rules`, §6 cleanup, and `0046`'s §4 guard must all behave exactly as before. All are in the 737 anyway; listed so a fast loop can run them first.

---

## 5. Risks, and what I am deliberately NOT doing

### Risks

1. **The summary line changes shape when a half is refused.** Mitigated by C1 pinning the both-halves-ran line byte-identically. Low.
2. **`set -u` on a conditionally-unset `n_agents`/`n_skills`.** Explicitly initialized to `""`. Covered by A1/A2/A3.
3. **The §6 comment edit trips the reference gate.** Real, and the reason §4.3 is a mandatory step rather than a note. My text avoids target tokens by construction, but "by construction" is a claim to run, not to reason about.
4. **Editing `claude/orphan-targets` touches a parsed file.** Comment-only, `#`-prefixed, parser skips it after whitespace-trimming. `test/orphan-cleanup.test.js` must be green — §4.3.
5. **Test-suite wall-clock.** Seven new tests, each spawning init (~1-2s), and `prove-red.sh` runs the whole suite 7+ times. Adds perhaps a minute or two overall. `init-intake-guard.test.js` set the precedent with six tests of the same shape.
6. **A5 is a deliberate behaviour change**, not a bug fix: a `.claude` symlinked *inside* the project is now refused. Same call `0046` made for `.fkit`, same reason (deciding "does it escape" means resolving, and resolving is how you get talked into a path you did not mean). Pinned on purpose so a future reader sees it was chosen.

### Explicitly NOT doing — so nobody closes these by accident

- **`0328`** (init's `mkdir -p` being fatal): **partially and incidentally overlapped, NOT closed.** My guard converts the *dangling-symlink* shape (measured B: EXIT=1) into a warn-and-continue, because the guard sits before the `mkdir`. It does **nothing** for the non-symlink causes `0328` owns — `.claude` a regular file, a read-only parent, ENOSPC, permissions. `path_contained` returns 0 for all of those and the `mkdir` still kills init. **`0328` remains fully open and must not be closed by this task.**
- **`0329`** (§5 appends through a symlinked `.gitignore`) — untouched. Also a product decision, not a refactor.
- **`0330`** (the launcher writes lockdown state through a symlinked `.fkit`) — untouched. Different file (`claude/fkit-claude.sh`), and not reachable from init's helper without a new shared seam.
- **`0332`** (hard-link shape) — untouched. `path_contained` tests `[ -L ]` only; a hard link is invisible to it. Unchanged by this task, in either direction.
- **`0037`** (the `INIT` override seam in `test/harness.mjs`) — not built. §4.4.
- **`0045`** (read-side symlink hazard under `ai-agents/`) — different side, different tree, still latent. Untouched.
- **`0046`'s §4 fix** — not modified. Only its header comment's `:4` wording.
- No `ai-agents/wiki-vault/` write. No task-file move. No re-rank. No commit, no push.
- **The TOCTOU residual is not closed** and is not claimed to be. §3, Step 4.

---

## 6. Open questions for the owner

Two. I have a recommendation on each and neither blocks starting.

### Q1 — When `.claude/agents` is refused, should init still exit 0?

**The tension the brief asks me to resolve, and the half of it I will not decide alone.**

I *am* deciding the shape: **warn on stderr, skip that half, carry on** — §1's bar, §4's bar, `0088`'s bar, and the doctrine the wiki records for `0069` ("a weird `ai-agents/` must not cost the user their agents"). Per-half refusal also means a symlinked `.claude/skills` still leaves the agents installed, so the common case still starts.

What I will not decide alone is the **exit status**, because it crosses into the launcher's contract:

- Today init exits `3` only for a refused `ai-agents/`; `claude/fkit-claude.sh:366-369` maps `3 → aa_refused`, anything else non-zero → `setup_ok=0`.
- `fkit-claude.sh:387` — *"If setup failed AND no fkit agent was ever written to disk, there is nothing to launch into"* — only fires when `setup_ok = 0`.
- So with my recommended exit-0 refusal, `setup_ok` stays 1 and the launcher will `claude --agent fkit-<role>` with **no agent file present**, producing Claude Code's own confusing "agent not found" — the exact failure that comment says it exists to prevent.
- ⚠️ And note the launcher's fail-safe is *already* symlink-blind: its `ls "$proj"/.claude/agents/fkit-*.md` **dereferences**, so on a project that ran the buggy init once, it finds the escaped copies at the link target and starts a session reading agents from outside the project.

  > ⚠️ **Dated correction 2026-09-04 (`0335`, inside sweep `0357`) — the CONCLUSION above is right and
  > the MECHANISM is wrong.** The bullet is **left byte-identical**. The fail-safe genuinely is
  > symlink-blind; it is not `ls` that makes it so, and that distinction decides where the fix must go.
  >
  > **What actually happens — the escape is the SHELL GLOB, not `ls`.** The guard is this line:
  >
  > ```sh
  > if [ "$setup_ok" = 0 ] && ! ls "$proj"/.claude/agents/fkit-*.md >/dev/null 2>&1; then
  > ```
  >
  > `"$proj"/.claude/agents/fkit-*.md` is **expanded by the shell before `ls` ever runs**, and pathname
  > expansion **traverses symlinked directories**. So when `.claude` (or `.claude/agents`) is a symlink
  > pointing outside the project, the glob resolves to the escaped copies at the link target, hands `ls`
  > a **real, already-resolved, genuinely existing path**, and the guard is skipped.
  >
  > ⛔ **This is why an `ls`-only fix cannot close it:** `ls` has nothing left to detect. **Measured
  > first-hand 2026-09-04** in a throwaway tree: with `.claude` a symlink to an outside directory
  > holding `agents/fkit-coder.md`, the guard is **skipped** and `realpath` confirms resolution outside
  > the project — and running a **dereferencing** `ls -L` on that same case **still exits 0**, so the
  > guard is **still skipped**. ⭐ A dereferencing `ls` does not close this shape.
  >
  > **A second shape this note adds, which no record here mentions: a DANGLING symlink also passes.**
  > An `.claude/agents/fkit-<role>.md` that is a symlink to a **non-existent** target still matches the
  > glob (matching is by name, via a directory read), and plain `ls` on a broken link exits **0** because
  > it does not dereference the final component. Measured 2026-09-04: plain `ls` **rc=0** (guard
  > skipped), `ls -L` **rc=1**. ⭐ **The guard is satisfied by mere name existence.** This shape needs no
  > buggy init to arise.
  >
  > **Where the corrected mechanism lives durably:** task `0334`, which owns the launcher-side fix.
  > ⛔ **This note reopens no ruling of `0327`** — including its Q1(a) exit-status ruling — adds no
  > finding, and changes no status.

| Option | Consequence |
|---|---|
| **(a) Warn, continue, exit unchanged (Rec)** | Consistent with every other refusal in the file; no launcher change; no new contract; the stderr warning is loud and names the fix. Cost: on a fresh project with a symlinked `.claude`, the session start fails with Claude Code's message rather than fkit's. **Nothing is destroyed, and that is the whole point of the change.** |
| **(b) Warn, continue, exit non-zero** | Trips `setup_ok=0`, so the launcher's fail-safe engages and says "no agents installed here" plainly. Cost: a *deliberate refusal* reported as a *setup failure* contradicts the rc-3 doctrine ("a refusal is a status, not a failure"), and the "could not finish setting up" banner then prints on every launch, forever, for a state the user chose. |
| **(c) New exit code `4` = "refused `.claude/`", launcher maps it** | Cleanest signalling. Cost: changes the init↔launcher contract, touches `claude/fkit-claude.sh` and `test/launcher-contract.test.js`, and overlaps `0330`'s territory. **Real scope growth for this task.** |

**I recommend (a)** and will implement it unless you say otherwise. If you want the launcher to speak clearly here, (c) is the right shape but should be its own task.

### Q2 — Correct the exclusivity claim at all five sites, or only the one the brief names?

The brief's deliverable is "the claim must stop being false" and names one string (`fkit-claude-init.sh:637`). I found five (§1.3), including `fkit-claude-init.sh:17` — the same file's own header — and `claude/orphan-targets:9`, a shipped file whose copy of the sentence gates whether a contributor may add a delete.

| Option | Consequence |
|---|---|
| **(a) All five (Rec)** | The claim actually stops being false. Two are production files, three are comments; zero behavioural risk beyond the reference-gate check in §4.3. Goes slightly past the brief's literal wording. |
| **(b) Only `:637`** | Stays strictly inside the brief. Leaves the same false sentence in the same file twenty lines from the top, and in `orphan-targets`. A reviewer will, correctly, file it again. |
| **(c) `:637` + `:17` + `orphan-targets:9`; leave the two test headers** | Middle. Production files honest, test-file headers left stale. |

**I recommend (a).**

---

## Owner's answers to §6 — recorded by the driver at approval (2026-08-24)

All given live via `AskUserQuestion` in a `fkit lead` session driving `/fkit-sprint-ship-loop`. **Option labels verbatim.**

| Q | Ruling | Verbatim option label |
|---|---|---|
| **Plan** | **Approved as written**, on Q1(a) + Q2(a). | **"Approve on Q1(a) + Q2(a) (Recommended)"** |
| **Q1 — exit status** | **(a) Warn, continue, exit unchanged.** ⛔ Do **not** add a new exit code; do **not** touch `claude/fkit-claude.sh`. The launcher-clarity shape (option c) is a separate task if the owner wants it. | **"(a) Exit unchanged (Recommended)"** |
| **Q2 — how many sites** | **(a) All five.** The claim actually stops being false. | **"(a) All five (Recommended)"** |

⚠️ **One consequence of Q1(a) that the owner accepted explicitly, recorded so it is not rediscovered as a defect:** on a fresh project with a symlinked `.claude`, the session start will fail with Claude Code's own "agent not found" message rather than fkit's. **Nothing is destroyed — which is the whole point of the change.** The launcher's symlink-blind fail-safe (§6 Q1's ⚠️ note) is **not** repaired by this task and remains a live, unowned observation.

> ⚠️ **Dated correction 2026-09-04 (`0335`, inside sweep `0357`) — the claim this paragraph POINTS AT
> has been corrected, and this pointer now inherits a wrong mechanism.** The paragraph is **left
> byte-identical**.
>
> This paragraph does not itself state a mechanism — it inherits one **by reference**, pointing at
> §6 Q1's ⚠️ note. ⭐ **That note's mechanism has been corrected**: the escape is the **shell glob**
> expanding before `ls` runs and traversing symlinked directories, **not** `ls` dereferencing. A
> **dangling** symlink is a second shape that also passes the guard, by name alone. **See the dated
> correction under that note for the measured evidence.**
>
> ⭐ **Everything else in this paragraph stands unchanged:** the fail-safe is genuinely symlink-blind,
> it genuinely is **not** repaired by `0327`, and it genuinely remains a live observation. The
> observation is no longer *unowned* — task `0334` now owns the launcher-side fix.
>
> ⛔ **This note reopens no ruling**, in particular not Q1(a), and changes no status.

## Driver's note on this file (fkit-sprint-ship-loop, 2026-08-24)

Written by the **driver** at plan approval, before the Build spawn, per `fkit-sprint-ship-loop/SKILL.md`
§*Durable artifacts*.

⚠️ **One transcription note, disclosed rather than hidden.** The planning worker's text reached the driver
through a transport that HTML-escaped `&`, `<` and `>`. The driver decoded those back to the characters
the plan plainly intends (e.g. `} >&2`, `[ -d "$d" ] && rm -rf "$d"`, `path_contained <path> <verb>`).
**No other byte was altered, and nothing was summarised, re-rendered or omitted.** This is stated because
the loop's faithful-carry construction turns on the word "verbatim", and a silent decode — however
obviously correct — is exactly the class of undisclosed transformation that construction exists to prevent.
