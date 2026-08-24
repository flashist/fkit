# Implementation plan — `0046` Gate the symlink escape when init writes the `.fkit/interview` intake

**Task:** `ai-agents/tasks/done/0046-gate-symlink-escape-in-init-intake-write/brief.md`
**Sprint 6, P10. Owner `fkit-coder`. Status `🔄 In progress` (verified in both the brief `## Status` and the sprint-6 row).**
**Planned 2026-08-23. Every coordinate and claim below was measured this day at the current working tree; nothing is inherited from the brief unchecked.**

---

## 1. What is actually wrong — measured today

### 1a. The primary defect reproduces exactly as the brief describes

`claude/fkit-claude-init.sh` §4 (the first-run intake) is 3 unguarded statements:

```
:496  # 4. first-run intake — a quick TERMINAL questionnaire asked before any LLM starts. …
:500  mkdir -p "$dest/.fkit"
:501  cat > "$dest/.fkit/interview" <<'INTERVIEW'
…
:554  INTERVIEW
:555  chmod +x "$dest/.fkit/interview"
:557  echo "• created intake .fkit/interview"
```

There is no `[ -L ]` test on any component. Reproduced:

```sh
work=$(mktemp -d); proj=$work/proj; outside=$work/outside
mkdir -p "$proj" "$outside"
cp -R claude/scaffold/ai-agents "$proj/ai-agents"
ln -s "$outside" "$proj/.fkit"
claude/fkit-claude-init.sh "$proj"
```

Result (2026-08-23):

```
rc=0
--- outside AFTER ---
-rwxr-xr-x  1 …  2780 Aug 23 12:54 interview
--- stderr ---
⚠ fkit did NOT remove these, and will not without a look from you:
    .fkit/agents — refused: '.fkit' is a symlink — fkit will not delete through one
    …
```

§6 correctly refused through the *same* symlink in the *same* run. §4 wrote straight through it, silently, and init exited 0. That contrast is the whole finding.

### 1b. Two further behaviours measured that the brief does **not** record

**(i) The brief's "Risk: low … Non-destructive (creates, never deletes)" is partly false. §4 can *overwrite* a file outside the project.** The `cat >` redirect follows a symlinked *leaf*:

```sh
mkdir -p "$proj/.fkit"; printf 'ORIGINAL user content\n' > "$outside/victim"
ln -s "$outside/victim" "$proj/.fkit/interview"
claude/fkit-claude-init.sh "$proj"
# → $outside/victim is now 2780 bytes: the interview script. The user's content is GONE.
```

Data loss outside the project, no rollback. Still moderate severity (it needs a symlink at `.fkit/interview`, which nothing normal creates), but "non-destructive" is not an accurate description of §4 and the plan should not be reviewed on that assumption.

**(ii) A *dangling* `.fkit` symlink does not "write through" — it aborts init.** Init runs under `set -euo pipefail` (`:20`). BSD/macOS `mkdir -p` on a dangling symlink fails:

```
rc=1
stderr: mkdir: …/a/.fkit: No such file or directory
stdout tail: • refreshed 7 agents → .claude/agents/, 26 skills → .claude/skills/
```

Init dies at `:500`. §5 (gitignore), §6 (orphan cleanup) and the summary **never run**. The launcher survives this (`fkit-claude.sh:359-370` captures `setup_rc` and starts the session anyway — `0088`'s guard holds), so it is not a brick, but setup is silently left half-done on every launch. Note the brief predicts the opposite for this case ("`-e` is false for one, so a guard that checks existence instead of `-L` will write through and create the target"). Measured, `mkdir -p` fails and `cat >` is never reached — but the brief's *conclusion* still holds for the leaf: `: > dangling_leaf_symlink` **does** create the target, verified in isolation. The `-L`-first guard fixes both shapes.

### 1c. The other `-L` sites — verified, and how they solved it

| § | Site | Guard today | Verdict |
|---|---|---|---|
| §1 preflight | `aa="$dest/ai-agents"` `:281` | `[ -L "$aa" ]` at `:283`, ahead of every `-e`/`-d` | ✅ guarded |
| §1 per-path | `dst="$aa/$rel"` `:443` | `[ -L "$dst" ]` at `:167`, before `-e` | ✅ guarded |
| §2 | `install_root_file` `:470` | `[ -L "$f" ]` at `:471` | ✅ guarded (leaf-only is complete here — the paths are `$dest/CLAUDE.md`, no intermediate component) |
| §2 | `merge_rules` `:382` | `[ -L "$f" ]` at `:386` | ✅ guarded |
| §6 | `p="$dest/$line"` `:737` | `orphan_contained` at `:731` — walks the **whole parent chain** | ✅ guarded |
| **§4** | `$dest/.fkit/interview` `:500-555` | **none** | ❌ **this task** |

**A shared helper already exists: `orphan_contained()`.** Live at **`claude/fkit-claude-init.sh:669`** (body `:669-689`, doctrinal comment `:655-667`). It is exactly the check §4 needs: refuses an absolute path, refuses `..`, then walks every component from `$dest` down testing `[ -L ]`, printing the reason on stdout and returning non-zero. It is called once, at `:731`.

### 1d. Brief claims that are now false — stated, not planned around

| Brief says | Measured today |
|---|---|
| `orphan_contained()` at `fkit-claude-init.sh:647` | **`:669`** |
| dated correction says `:665` | **`:669`** (the correction was itself already stale) |
| "§4 writes at `:476`" | **`:500-501`**, `chmod` at `:555` |
| doctrine comment "~`:159-172`" | **`:161-166`** (the `[ -L ] FIRST, ALWAYS` block; the `if` is `:167`) |
| "**the third site** in one file that needed the same rule" | §4 is the third site *fixed*. It is **not** the last unguarded one — §3 and §5 are also unguarded (see §6 below), and §3 **deletes**. |
| "Risk: low. Non-destructive (creates, never deletes)" | **Partly false** — see 1b(i). It can overwrite a file outside the project. |
| Evidence source `ai-agents/reviews/remove-fkit-omnigent-orphan-residue.md` | **Dead path.** `ai-agents/reviews/` does not exist. Live: `ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue/review.md` |
| Evidence source `ai-agents/tasks/backlog/remove-fkit-omnigent-orphan-residue.md` | **Dead path.** Live: `ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue/brief.md` |
| `Relates to: gate-read-side-symlink-hazard-in-init.md` | Live: `ai-agents/tasks/backlog/0045-gate-read-side-symlink-hazard-in-init/brief.md` — **still open**, genuinely a different side (read hazard under `ai-agents/`). No overlap with this change. |

**Dependency re-verified independently, not taken on trust:** `ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue/` exists in `done/`. `ai-agents/tasks/done/0036-extend-mover-reference-sweep-to-the-knowledge-base/` also exists and is unrelated — confirming the brief's dated correction that the bare numeral `task 36` mis-resolves. `orphan_contained()` is on disk. **Current dependency: nothing.** The brief's correction is accurate on this point.

**Baseline suite state, measured today, not inherited:** `npm run test:unit` → **730 pass, 0 fail, 17 suites, 64.6s**. (I did not run `prove-red.sh` myself — see §7 "unverified".)

---

## 2. The change surface

Four files. No commit, no push, no wiki write, no task-file move.

### `claude/fkit-claude-init.sh` — three edits

**(a) Hoist and rename the helper.** Move lines **`655-689`** (the doctrinal comment block plus the `orphan_contained()` body) to sit **between line `267`** (the closing `}` of `converge_ai_agents`) **and line `269`** (`# 1. ai-agents/ working structure …`). Rename to **`path_contained`**, and add a second parameter for the verb so the message stays truthful at each caller:

```sh
path_contained() {  # path_contained <project-relative-path> <verb> → 0 = safe, non-zero + reason on stdout
  …
    if [ -L "$_cur" ]; then
      echo "'$_seg' is a symlink — fkit will not $2 through one"
      return 1
    fi
  …
}
```

The comment block moves with it and gains ~3 lines: it currently says "safe to **delete**" and "convergence only CREATES … never got applied to the one operation that DELETES", which is no longer the whole story once §4 shares it. It must say the helper now guards a **write** as well, and that `orphan_contained`'s naming was retired for exactly that reason.

**(b) Update §6's call site (`:731`, post-move `:697` ±).** `orphan_contained "$line"` → `path_contained "$line" delete`. **§6's emitted message stays byte-identical** — `'.fkit' is a symlink — fkit will not delete through one` — which is what makes "no regression at the other two sites" checkable rather than asserted. The two other `orphan_contained` mentions in comments (`:720`, `:799`) get the new name.

**(c) Guard §4.** Replace `:500-557` with:

```sh
# [ -L ] FIRST, ALWAYS — the same doctrine §1 states at :161 and §6 applies at its call site, and the
# one site that never got it. `mkdir -p` and `cat >` both DEREFERENCE: with .fkit symlinked out of the
# project this wrote `interview` to the link target (reproduced, 0046), and with the LEAF symlinked it
# OVERWROTE whatever was there. The whole chain is walked, not just the leaf — a symlinked parent makes
# the leaf a real path and -L on the leaf alone is false.
# Non-fatal by design (§1's bar, and 0088's): a refusal warns and setup carries on. The intake is
# optional already — with no .fkit/interview the launcher's `[ -x … ]` probe (fkit-claude.sh:576) just
# skips it and the LLM interviews instead. STDERR, not stdout: the launcher sends init's stdout to
# /dev/null on an already-set-up project, which is exactly the case this warning exists for.
if ! intake_reason="$(path_contained ".fkit/interview" write)"; then
  {
    echo "⚠ skipped the .fkit/interview intake: $intake_reason"
    echo "    $dest/.fkit/interview"
    echo "  Nothing was written and nothing is broken. The rest of setup continues and your session"
    echo "  will start; the LLM will interview you instead."
  } >&2
else
  mkdir -p "$dest/.fkit"
  cat > "$dest/.fkit/interview" <<'INTERVIEW'
  … (heredoc unchanged, byte for byte) …
INTERVIEW
  chmod +x "$dest/.fkit/interview"
  echo "• created intake .fkit/interview"
fi
```

Three notes on that shape, all deliberate:

- `if ! var="$(cmd)"` is the **exact idiom already at `:731`** under the same `set -euo pipefail`. A command in an `if` condition is exempt from `set -e`; this is proven in-file, not a new trick.
- **One call covers both statements.** `path_contained ".fkit/interview"` walks `.fkit` then `.fkit/interview`, so it guards `mkdir -p` and `cat >` in a single test — matching §6's single-check-before-anything shape.
- The heredoc is **not reindented** when it moves inside the `else`. `<<'INTERVIEW'` is not `<<-`, so the terminator must stay at column 0 and the body must stay byte-identical. Reindenting it would change the shipped script's content. This is the single most likely mechanical mistake in this change.

### `test/init-intake-guard.test.js` — new file

New, because §4 is init's own contract: `converge-contract.test.js` is scoped to §1 and `orphan-cleanup.test.js` to §6. `package.json`'s `test` script globs `test/*.test.js`, so the file is picked up with no wiring.

### `test/orphan-cleanup.test.js` — two small edits, both forced by the fix

At `:404-407` that suite carries the *provenance of this bug* as a comment, and deliberately weakens its assertion because of it:

> `// Nothing outside was DELETED or MUTATED. Deliberately not a "nothing appeared" freeze: init's §4`
> `// creates .fkit/interview, and with .fkit symlinked that write lands outside the project. That is a`
> `// real (pre-existing, non-destructive) issue in §4 — see the task note — but it is NOT this`
> `// cleanup, and a freeze assertion here would fail for the wrong reason and hide the right one.`

After the fix that comment is **false**. Leaving it is a stale load-bearing claim in a test file.

- **(1) Rewrite the comment** to record that `0046` closed the §4 escape, so the one-way check became a two-way freeze.
- **(2) Tighten the assertion** from one-way (every pre-existing entry unchanged) to a full two-way freeze (`outsideAfter` deep-equals `outsideBefore` — nothing changed **and nothing appeared**). This is the strengthening the comment says was blocked only by this bug. It also serves as a second, independent regression net written by a different task.

Also at `:273` a comment quotes §6's refusal string verbatim (`'.fkit' is a symlink — fkit will not delete through one`). Keeping §6's message byte-identical (edit 2b) means **that comment stays true and needs no edit** — a deliberate reason for the verb-parameter design over a generic message.

### Explicitly **not** in the change surface — each verified, not assumed

- **`claude/structure-manifest.tsv` — no regen owed.** `bin/generate-structure-manifest.mjs:70-78` maps only `{generic,omnigent/scaffold,claude/scaffold}/ai-agents/` and the four scaffold root files. `claude/fkit-claude-init.sh` is in none of them, so nothing from this change reaches the manifest. `RELEASING.md:105` states the same negative. ⚠️ **`claude/structure-manifest.tsv` is already modified in the working tree by another task** — a "cautious" regen here would collide with that task's work as well as being wrong.
- **`test/prove-red.sh` — no mutation added, and none is currently possible.** Verified: prove-red's 22 mutations target the launcher, five standalone hook scripts, a `claude/` tree copy, and `bin/release.mjs`. `fkit-claude-init.sh` appears in that file **only in a comment** (`:12`) — it is **not in the subject set**, and the guards at §1 and §6 have no mutation either, so this is the established precedent, not an omission I am creating. The reason is structural: `test/harness.mjs:160` resolves `INIT` as a hardcoded const with no `FKIT_INIT` override, so prove-red has no seam to reach init through. **That seam is the deliverable of an existing open task, `0037-extend-prove-red-to-reach-init`**, whose brief names precisely this gap. Building it here would be doing `0037`'s work inside `0046`'s diff. The red-first proof in §4 below covers the same ground for this guard by hand.
- **`.claude/` copies** — gitignored, regenerated by `claude/fkit-claude-init.sh .`; and `fkit-claude-init.sh` is not among the files copied into `.claude/` at all. Nothing to mirror.
- **`claude/scaffold/`, `test/dual-home-parity.test.js`** — that guard walks `ai-agents/` against `claude/scaffold/ai-agents/`; neither touched file lives in either home.

---

## 3. Steps, in order

1. **Capture the pre-fix evidence.** Run the three reproducers from §1 (symlinked `.fkit`; dangling `.fkit`; symlinked leaf `.fkit/interview`) against the untouched tree and record their output in the task worklog. This is the "before" half of the red-first proof and it must be captured before any edit.
2. **Write `test/init-intake-guard.test.js`** (full list in §4). Do **not** touch `fkit-claude-init.sh` yet.
3. **Update `test/orphan-cleanup.test.js`** — comment rewrite + two-way freeze.
4. **Run the new and changed tests. Confirm RED, at the expected assertions** (§4 lists which and why). A test that passes here is a test that is not testing this defect — stop and fix the test, do not proceed.
5. **Edit `claude/fkit-claude-init.sh`** — the three edits of §2, in order (a) hoist+rename, (b) §6 call site, (c) §4 guard. Do (a) and (b) as one atomic move so the script is never left with a call to a name that does not exist. After (a)+(b), run `sh -n claude/fkit-claude-init.sh` and `node --test test/orphan-cleanup.test.js test/converge-contract.test.js` — this isolates any regression from the *extraction* (which the brief correctly names as the higher-risk half) before the new guard is added on top.
6. **Add the §4 guard** — edit (c).
7. **Run the full verification of §4.** Confirm GREEN.
8. **Run the audit sweep** over every `$dest`-relative write and **report only** (§6). Fix nothing new.
9. **Write the worklog** into `ai-agents/tasks/done/0046-gate-symlink-escape-in-init-intake-write/worklog.md` — pre-fix evidence, post-fix evidence, the audit findings, the brief-claim corrections from §1d, and anything left unverified.
10. **Hand to the reviewer** (`@fkit-reviewer`, stateful, task-id `0046`), pointing review attention at the **extraction** (§1/§6 regression surface) per the brief's own risk note.

---

## 4. Verification

### 4a. The red-first demonstration — exact commands

**Before any edit to `fkit-claude-init.sh`:**

```sh
node --test test/init-intake-guard.test.js
node --test test/orphan-cleanup.test.js
```

**Pass = RED, at these named assertions:**

| Test | Expected pre-fix failure |
|---|---|
| `.fkit symlinked outside → refuse, nothing lands outside` | FAILS — `interview` appears at the link target |
| `.fkit a DANGLING symlink → refuse, init completes` | FAILS — init exits 1 and never reaches §5/§6/summary |
| `a symlinked LEAF is not written through` | FAILS — the outside file is overwritten with the interview script |
| `.fkit symlinked INSIDE the project is refused too` | FAILS — the intake is written through the link |
| `§6 says "delete", §4 says "write"` | FAILS — §4 emits no message at all |
| `ordinary .fkit → executable intake, idempotent` | **PASSES pre-fix** — this is the control. It must pass in both runs; if it ever reds, the fix broke the happy path. |
| `orphan-cleanup.js` two-way freeze | FAILS — `interview` appears in `outsideAfter` |

**After the edit:**

```sh
sh -n claude/fkit-claude-init.sh                                        # syntax
node --test test/init-intake-guard.test.js                              # GREEN
node --test test/orphan-cleanup.test.js test/converge-contract.test.js  # GREEN — the extraction did not regress §1/§6
npm test                                                                # full suite + prove-red
```

**Pass criteria for `npm test`:** `fail 0`, `pass ≥ 737` (730 baseline measured today + the new tests), and `prove-red.sh` exits 0 with all **22/22** mutations reddening their named assertions. ⚠️ A drop below 730 pre-existing passes, or a prove-red count other than 22, is a regression regardless of what the new tests say.

**Manual re-run of the §1 reproducers** after the fix, output pasted into the worklog: all three must refuse, warn on stderr, and leave the outside dir untouched — and init must still exit 0/3 and still print the summary.

### 4b. The test list, mapped to the brief's verification bullets

`test/init-intake-guard.test.js`:

1. **`.fkit` symlinked to a directory outside the project** → stderr matches `/skipped the .fkit\/interview intake/` and `/symlink/`; `existsSync(outside/interview)` is false; a **two-way `manifest()` freeze of `outside`** (nothing changed, nothing appeared); `r.code` is 0 or 3. *(brief bullets 1 and 2)*
2. **Same run, non-fatal**: `.gitignore` was still written and the summary still printed — i.e. §5 and the summary, which sit *after* §4, both ran. *(brief bullet 6, and the measured 1b(ii) abort)*
3. **Dangling `.fkit` symlink** → refuse; the link target still does not exist; init completes (`code` 0 or 3, summary printed). *(brief bullet 3)*
4. **Symlinked leaf** `.fkit/interview` → an existing outside file is byte-identical after the run. *(covers the destructive shape the brief does not record)*
5. **A symlinked component deeper than nothing — `.fkit` symlinked to a directory *inside* the project** → still refused. *(brief bullet 4 — pins that the rule is "no symlink anywhere in the chain", matching §1 and §6 exactly, not "does it escape")*
6. **The ordinary case** → `.fkit/interview` exists, `lstat` says regular file (not a symlink), mode has `+x`, content contains a known marker line from the heredoc, and a second init run leaves it byte-identical. *(brief bullet 5 — this is what catches a mangled heredoc)*
7. **Verb correctness in one run**: a project carrying `.fkit/agents` residue **and** a symlinked `.fkit` emits **both** `…will not delete through one` (§6) and `…will not write through one` (§4). *(pins the parameterization and the "§6 message byte-identical" claim)*

### 4c. ⚠️ Containment — the test must not itself escape

Every "outside" directory is created with `mkdtempSync(join(tmpdir(), 'fkit-outside-'))` — `os.tmpdir()`, never a fixed path like `/tmp/outside`, never anything under the repo, never a path the test does not own. Each is pushed to a `trash` array and removed in `after(() => trash.forEach(cleanup))`. This is verbatim the pattern `test/orphan-cleanup.test.js:22-27, 389-398` already uses for the same hazard. The symlink escapes the *throwaway project*, which is the point; it never leaves `os.tmpdir()` and it never reaches the repo. `git status` must be clean after the run — check it.

Pre-fix, the red runs **will** create `interview` inside those temp dirs (that is the bug being demonstrated); `after()` removes them either way.

---

## 5. Risks, and what I am deliberately not doing

**Risks, in descending order:**

1. **The extraction, not the fix.** The brief says this and it is right: moving `orphan_contained` touches two working, already-reviewed guards. Mitigations: §6's emitted message is byte-identical by design; the move is a pure relocation (no body change beyond the verb parameter); step 5 runs `orphan-cleanup` + `converge-contract` *before* the new guard is added, so a regression there cannot be confused with a §4 problem. This is where review attention belongs.
2. **The heredoc.** `<<'INTERVIEW'` moving inside an `else` branch. If it is reindented, or the `INTERVIEW` terminator leaves column 0, the shipped intake script changes or the parse breaks. Test 6 (content marker + `+x`) is the specific net; `sh -n` catches the parse.
3. **A behaviour change on `.fkit` symlinked *inside* the project.** After this, that is refused (test 5). Consistent with §1 and §6, and `.fkit/` is gitignored fkit-managed state nobody has a reason to symlink — but it is a real behaviour change and is called out here rather than discovered in review.
4. **`path_contained` uses non-`local` variables** (`_rest`, `_cur`, `_seg`) — POSIX `sh` has no `local`. Unchanged from today's function, but it now runs earlier and in a different scope. The `_`-prefixed names do not collide with anything in §4's scope; verified by reading, and the ordinary-case test would red if they did.
5. **`npm test` runtime grows.** `prove-red.sh` runs the *full* suite 4 times (`:268, 274, 386, 761`), so ~7 extra init spawns cost roughly +30-40s overall. Acceptable; noted so it is not read as a hang.
6. **Working-tree contention.** The tree carries other tasks' uncommitted work (13 dirty paths), including **`claude/structure-manifest.tsv` and `claude/scaffold/CLAUDE.md`**. Neither of my four files is currently dirty — verified with `git status --porcelain -- claude/ test/ bin/ package.json`. I must not regen the manifest and must not touch `claude/scaffold/`.

**Deliberately NOT doing:**

- **Not fixing §3, §5, or anything else the audit finds.** The brief's 🔒 scope limit is explicit: the audit bullet is "a floodlight, not a licence". §6 below reports; it does not patch.
- **Not adding a `prove-red.sh` mutation, and not adding the `FKIT_INIT` seam** — that is `0037`'s deliverable (§2).
- **Not making `mkdir -p "$dest/.fkit"` non-fatal for non-symlink failures** (permissions, ENOSPC, `.fkit` being a regular file). The guard fixes the symlink shape of the abort; the general shape is a separate robustness change adjacent to `0088`, reported in §6 and raised as an open question.
- **Not touching `0045`** (read-side hazard). Different side, still open, and the brief says neither closes the other.
- **Not repairing the brief's own dead evidence paths** (§1d) — a brief edit is not this source task's scope. Reported instead.
- **Not committing, not pushing, not writing `ai-agents/wiki-vault/`, not moving any task file.**

---

## 6. The audit — reported, not fixed (the brief's floodlight bullet)

Sweep of every `$dest`-relative write in `claude/fkit-claude-init.sh`. **All four findings below were executed, not read**, except where marked.

**F1 — §3 refreshes `.claude/` with no `-L` check, and it DELETES through the link. `:485-492`.**
```
mkdir -p "$dest/.claude/agents" "$dest/.claude/skills"
rm -f "$dest/.claude/agents/fkit-"*.md
cp "$here/agents/fkit-"*.md "$dest/.claude/agents/"
for d in "$dest/.claude/skills/fkit-"*/; do [ -d "$d" ] && rm -rf "$d"; done
cp -R "$here/skills/fkit-"* "$dest/.claude/skills/"
```
Measured with `.claude` symlinked to an outside directory containing a user file `agents/fkit-mine.md`: init exited **0**, `fkit-mine.md` was **DELETED**, seven fkit agent files and a whole `skills/` tree were created at the link target.
⚠️ **This is more serious than the defect this task fixes.** §4 creates (and, in one shape, overwrites); §3 **deletes**, unprompted and unannounced, outside the project. It contradicts the brief's framing of §4 as "the third site" — §3 is a fourth, and the worse one. It also means fkit has a second destructive operation, where `:576`'s comment claims §6 is "THE ONLY DESTRUCTIVE OPERATION IN FKIT".
**Recommendation:** its own task, filed at a priority above where `0046` sat. The fix is mechanical once `path_contained` is hoisted — the same guard on `.claude/agents` and `.claude/skills`. **Not fixed here.**

**F2 — §5 appends to `$dest/.gitignore` with no `-L` check. `:562`.** Measured: with `.gitignore` symlinked to an outside file, all three fkit ignore blocks were appended to the outside file. This is the case the brief predicted and explicitly reserved to the owner: a symlinked `.gitignore` may be **legitimate user setup**, so refusing it could break a real workflow. **Product decision, not a refactor. Not fixed here.**

**F3 — `mkdir -p` aborts init under `set -euo pipefail` for reasons the `-L` guard does not cover.** `:485` and `:500`. Any failure (unwritable parent, ENOSPC, `.fkit` present as a regular file) kills init mid-way; §5, §6 and the summary never run. Measured for the dangling-symlink case (§1b(ii)). Everything *else* in init is carefully non-fatal (`:167`'s subtree refusal, `merge_rules`' four refusals, §6's per-path refusals) — these two `mkdir`s are the exception. Adjacent to `0088`'s bar. **Recommendation:** its own task. **Not fixed here.**

**F4 — adjacent, and OUTSIDE the audited file: the launcher writes lockdown settings through a symlinked `.fkit`.** `claude/fkit-claude.sh:319` `mkdir -p "$proj/.fkit/state"` and `:331-332` `mkdir -p "$proj/.fkit/settings"` + `printf … > "$proj/.fkit/settings/$1.json"`, with no `-L` check. ⚠️ **This one is read from the code, not executed** — it needs a stubbed launcher run I did not perform, so treat it as a lead to verify, not a measured fact. Same doctrine, different file; outside the brief's "rest of the file" wording. **Recommendation:** verify, then fold into F1's task or file separately.

**Verified guarded, no action:** §1 preflight `:283`, §1 per-path `:167`, `install_root_file` `:471`, `merge_rules` `:386`, §6 `:731`.

**Residual this task does not close:** the TOCTOU window between the `-L` check and the write is not closable in POSIX shell — it needs `openat()`-class primitives. §6 already records exactly this at `:610-611`. The new guard inherits that residual; it does not widen it.

---

## 7. Unverified — stated, not glossed

- **I did not run `test/prove-red.sh`.** Its 22 mutations run the full suite four times and I judged the cost unwarranted for a plan. Its subject set was determined by **reading** the script and grepping for `fkit-claude-init.sh` (one hit, in a comment at `:12`) — that part is verified. That it currently passes 22/22 is the lead's report, not my measurement, and step 7 re-runs it.
- **F4 is a code-read, not an execution.** Marked as such above.
- **I have not confirmed whether `0037` or `0045` are scheduled**, only that both briefs exist under `ai-agents/tasks/backlog/`.

---

## 8. Open questions for the owner

**Q1 — F1 (§3 deletes through a symlinked `.claude/`). What now?**
This is a live destructive escape, measured today, and it is worse than the defect `0046` fixes. `0046`'s scope limit says report-only, so I plan to report it.
- **(a) Report only; file it as its own task.** *(Rec — it is what the brief's scope limit instructs, and it keeps this diff's blast radius where the reviewer expects it.)*
- (b) Widen `0046` to cover §3 as well. Cheap now that `path_contained` is hoisted, but it repeats the blast-radius mistake that (correctly) kept this out of `0072`, and puts a *destructive* change under a review scoped to a non-destructive one.
- (c) Stop `0046` and do §3 first, as the higher-severity item.

**Q2 — F2 (§5 appends through a symlinked `.gitignore`). Is a symlinked `.gitignore` legitimate?**
The brief predicted this and reserved it as a product decision. Refusing it makes fkit consistent; it may also break someone who deliberately symlinks `.gitignore` to a shared file.
- (a) Refuse, like every other site — consistency wins.
- (b) Allow it deliberately, and record *why* in the code, so the next audit does not re-flag it.
- **(c) File it as its own task with both options and decide there.** *(Rec — it needs no answer to ship `0046`.)*

**Q3 — F3: should the `mkdir -p` calls at `:485` and `:500` be made non-fatal in this task?**
It is ~2 lines and directly adjacent (`0088`'s bar), and today a dangling-symlink or wrong-type `.fkit` silently costs the user §5, §6 and the summary on every launch.
- **(a) No — report it, file it separately.** *(Rec — the `-L` guard already fixes the shape `0046` is about, and this widens a diff the brief deliberately fenced.)*
- (b) Yes, include it — it is small, and the case is already reproduced.

**Q4 — the brief's two dead evidence paths (§1d).** `ai-agents/reviews/…` does not exist; both live under `ai-agents/tasks/done/0072-…/`. `0306` swept sprint-paths and bare numerals but not this shape.
- **(a) Note it in the worklog; leave the brief alone.** *(Rec — a source task editing brief prose is a scope leak, and the correction convention wants a dated note appended beside the original, not a rewrite.)*
- (b) Append a dated correction to `0046`'s brief as part of this task.
- (c) Route it to `@fkit-producer` as a brief-repair item.

**Q5 — helper name.** I propose **`path_contained`**. Alternative: `contained_in_project` (more explicit about the invariant, longer at both call sites). No strong preference; flagging it because renaming after review is more churn than choosing now. *(Rec: `path_contained`.)*

---

**Nothing was written. This plan is the artifact; no file on disk was created or edited by this planning run** (temp reproduction directories under `/tmp` were created and removed; `git status --porcelain` is unchanged at 13 dirty paths, none of them mine).

---

## Owner's answers to §8 — recorded by the driver at approval (2026-08-23)

All given live via `AskUserQuestion` in a `fkit lead` session driving `/fkit-sprint-ship-loop`. **Option labels verbatim.**

| Q | Ruling | Verbatim option label |
|---|---|---|
| **Plan** | **Approved as written.** | **"Approve (Recommended)"** |
| **Q1 (F1, §3 destructive escape)** | **Report only. Filed as its own task, high priority.** ⛔ Not fixed in `0046`. The filed task must ALSO correct `:577`'s now-false claim that §6 is *"THE ONLY DESTRUCTIVE OPERATION IN FKIT"*. | **"File as its own task, high priority (Recommended)"** |
| **Q2 (F2, `.gitignore`)** | **Filed as its own task**, carrying both options for the owner to decide there. Needs no answer to ship `0046`. | **"File it as its own task (Recommended)"** |
| **Q3 (F3, fatal `mkdir -p`)** | **Filed separately.** ⛔ Not included in `0046`. | **"File separately (Recommended)"** |
| **Q4 (brief's dead evidence paths)** | **Note it in the worklog; leave the brief alone.** — the planner's own recommendation (a), taken by the driver as the recommended branch. | *(planner's rec (a); no separate owner label)* |
| **Q5 (helper name)** | **`path_contained`.** — the planner's own recommendation, taken by the driver as the recommended branch. | *(planner's rec; no separate owner label)* |

⚠️ **Q4 and Q5 were NOT put to the owner as separate `AskUserQuestion` items** — the driver took the planner's stated recommendation on both, as low-stakes and reversible. That is recorded here so a later reader does not mistake them for owner rulings. **Q1, Q2, Q3 and the plan approval ARE owner rulings**, with the verbatim labels above.

## Driver's note on this file (fkit-sprint-ship-loop, 2026-08-23)

Written by the **driver** at plan approval, before the Build spawn, per `fkit-sprint-ship-loop/SKILL.md`
§*Durable artifacts*.

⚠️ **One transcription note, disclosed rather than hidden.** The planning worker's text reached the driver
through a transport that HTML-escaped `&`, `<` and `>`. The driver decoded those back to the characters
the plan plainly intends (e.g. `cat > "$dest/.fkit/interview" <<'INTERVIEW'`, `} >&2`, `[ -d "$d" ] && rm -rf "$d"`).
**No other byte was altered, and nothing was summarised, re-rendered or omitted.** This is stated because
the loop's faithful-carry construction turns on the word "verbatim", and a silent decode — however
obviously correct — is exactly the class of undisclosed transformation that construction exists to prevent.
