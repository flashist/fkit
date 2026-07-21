# Review — sprint2-scaffold-launcher-hardening

Task: [`tasks/backlog/fix-scaffold-knowledge-base-folders.md`](../../tasks/done/0043-fix-scaffold-knowledge-base-folders/brief.md) (25) ·
[`tasks/backlog/stop-init-failure-bricking-the-launcher.md`](../../tasks/done/0088-stop-init-failure-bricking-the-launcher/brief.md) (26) ·
[`tasks/backlog/refuse-init-on-weird-ai-agents-state.md`](../../tasks/done/0069-refuse-init-on-weird-ai-agents-state/brief.md) (27)
File(s) under review: `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, `claude/scaffold/ai-agents/README.md`,
`claude/scaffold/ai-agents/knowledge-base/{conventions/README.md, decisions|incidents|reports|history/.gitkeep}`,
deleted `claude/scaffold/ai-agents/knowledge-base/.gitkeep`
Scope: working tree. **Tasks 25, 26, 27 only.** Task 28 (additive convergence) is **PARKED by the owner —
not built, not reviewed**; its open design question (the opt-out cannot live in gitignored `.fkit/`, which
would not survive a clone) is unresolved. Do not read this ledger as having reviewed convergence.
Reviewers: fkit-reviewer (own pass) + Codex via `codex exec` — **both ran in all three rounds; coverage is complete.**
(Round 2 note: `gpt-5.4-codex` was rejected by the account — *"model is not supported when using Codex with a
ChatGPT account"* — and the pass was re-run on the account's default Codex model. Still genuinely model-diverse.)
Status: **CLOSED** (2026-07-14, after round 3 + owner dispositions). See *Closing verdict*.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | **medium** | `claude/fkit-claude.sh:301-314` | Task 26's acceptance criterion is **not met in the brief's own named repro**. On a read-only project that was *never set up*, init cannot create `.claude/agents/`, so the launcher's "start the session anyway" `exec claude --agent fkit-<role>` fails: `--agent 'fkit-coder' not found`, rc=1. The launcher no longer dies in `mkdir` — it dies in `claude` instead. Verified empirically. Not a regression; an **incomplete fix** + a verification gap (the coder tested a *previously set-up* project made read-only, where agents are present and it does work). |
| R2 | 1 | low | `claude/fkit-claude.sh:272` | `printf … > "$path" 2>/dev/null` does **not** suppress the shell's own redirection-open diagnostic (redirections apply left-to-right; the `>` open fails before `2>/dev/null` is in effect). A raw `fkit-claude.sh: line 272: …/coder.json: Permission denied` leaks to stderr on the **main** fallback path — reachable whenever `.fkit/settings/` already exists and the project has since become read-only (`mkdir -p` on an existing dir returns 0). Reproduced. Cosmetic only: stdout (the captured path) is uncorrupted and the temp-file fallback still works. Raised by both reviewers. |
| R3 | 1 | low | `claude/fkit-claude.sh:257-284` | `build_settings` derives the skill **denylist by globbing `$proj/.claude/skills/fkit-*/`**, so with no skills on disk it emits `{"skillOverrides":{}}` — a lockdown that turns nothing off. A denylist computed from the filesystem can only disable what it can see. **Blast radius today: nil** (see below) — recorded as latent hardening, not a live hole. Codex rated this **critical**; downgraded on traced evidence. |
| R4 | 1 | low | `claude/fkit-claude.sh:276-283` | The `mktemp -d` fallback dir is **never cleaned up** — one leaked dir per launch on an unwritable project. It cannot simply be trapped (the settings file must outlive the `exec`); a deterministic per-user path would be idempotent instead. Raised by both. |
| R5 | 1 | low | `claude/fkit-claude.sh:354-372` | After a refusal (R27's gate), `fresh` is computed from `$proj/ai-agents/knowledge-base/PROJECT.md`, which by definition cannot exist on a refused `ai-agents/`. So every bare `fkit` on such a project forces the **producer cold-start + intake, forever**, and it can never complete. A consequence of refuse-and-continue that the brief did not anticipate. Raised by Codex; code path verified. |
| R6 | 1 | low | `claude/fkit-claude-init.sh:40-58` | TOCTOU between the `[ -L ]`/`[ -e ]` preflight and `cp -R`: a local process could swap `$aa` to a symlink in the window. Requires an attacker racing the project path — outside fkit's threat model. Raised by Codex. Recommend accepting as a residual. |

### Disproven / verified-safe — do not chase

- **Task 27's headline premise is FALSE on every `cp` flavor.** Empirically settled:
  BSD/macOS `cp -R` → `File exists`, rc=1, nothing written outside. **GNU coreutils 9.1 (Debian container)** →
  `cp: cannot overwrite non-directory '…/ai-agents' with directory '…'`, rc=1, **the outside path was NOT created**.
  BusyBox → refuses too. Codex independently confirms from the GNU manual: the historical write-through
  happens only under `POSIXLY_CORRECT`. **No live write-outside-the-project bug ever shipped, on any platform.**
  The coder's inability to reproduce it was correct and it generalizes.
- **…but the `[ -L ]` gate is still right, for the *other* reason.** The **live**-symlink case *does* write through on
  GNU `cp -R` (verified: rc=0, the scaffold landed in `/t2/elsewhere/ai-agents`). It is unreachable today only
  because `[ -e ]` short-circuits to "left as-is" — and **task 28 would make it reachable.** Keep the gate.
- **`exit 1` inside `build_settings`'s command substitution does kill the launcher** (the assignment inherits the
  substitution's status; `set -e` fires). Verified; both reviewers agree. Not a hole.
- **Absolute `--settings` behaves identically to relative** — verified with a live probe (an `env` key set in an
  absolute-path settings file was applied in the session).
- **The temp-file attack surface is otherwise empty:** `mktemp -d` yields `drwx------` (0700, verified), so no
  other-user readability and no `/tmp` symlink attack; `noexec`/`TMPDIR` oddities are irrelevant (JSON is read,
  not executed); `mktemp` absence is guarded and refuses to launch unlocked.
- **`.gitkeep` accounting is sound.** Removing `knowledge-base/.gitkeep` cannot leave an empty untracked dir —
  `PROJECT.md` and `conventions/` remain. 4 `.gitkeep` tracked; all five KB folders land in a fresh project.
- **Happy path: no regression.** Already-set-up project → stdout is *only* the role banner, stderr empty, relative
  settings path preserved. Fresh project → full summary. `build_settings`' stdout contract is intact (every warning
  goes to stderr).
- **No stray artifacts** from the coder's process failure (their point D). `claude/scaffold/` contains only the
  intended files; `git status --ignored` is clean of strays; `conventions/README.md` is authored (generalized,
  zero fkit-specific content, not gitignored) — it is not something init dropped.

## Reviewer findings — round 2

**Verdict: one more narrow round — fix R8 only, then close.** Every round-1 fix lands, the riskiest
change (inline `--settings`) is verified sound *and* fails closed, and the records are corrected. One
new medium remains, and it is the **same failure shape R1 had in round 1**: the named repro was fixed,
the *condition* was not.

### Round-1 findings — disposition (all re-verified against the code, not taken on trust)

| #  | Round-1 sev | Now | Evidence |
|----|-------------|-----|----------|
| R1 | medium | **FIXED** | `fkit-claude.sh:317-327`. Never-set-up + read-only → `⚠ fkit has no agents installed here…`, **rc=1, no `exec`**. Re-run E2E with a stubbed `claude` on `PATH`; confirmed. The guard is correct under `set -eu`: `!` in a condition suspends `errexit`, the unmatched glob passes through literally and `ls` returns non-zero, and `"$proj"/.claude/agents/fkit-*.md` quotes the prefix so paths with spaces are safe. `exit 1` is the right code (generic failure; nothing here warrants a bespoke one). **Declining to drop `--agent` was the right call** — an unroled session carries no ADR-010 lockdown and would fail *open*. |
| R2 | low | **FIXED in `build_settings`** (sibling remains → **R7**) | The subshell works: `( printf … > "$path" ) 2>/dev/null` puts the redirection *inside* the silenced scope. No raw `line NNN: … Permission denied` from `build_settings` on the read-only path. Verified. |
| R3 | low | **ACCEPTED RESIDUAL** | Unchanged; still vacuous today. See below. |
| R4 | low | **FIXED — and better than the fix I ratified** | Temp-dir count across three read-only launches: delta **= exactly my 3 test projects, 0 leaked by fkit**. |
| R5 | low | **PARTIALLY FIXED → R8** | Symlink and file-where-dir-belongs now fall through to the menu (verified). The **third** refusal state does not. See R8. |
| R6 | low | **ACCEPTED RESIDUAL** | Unchanged; TOCTOU outside the threat model. See below. |

### The inline `--settings` change — attacked as requested, and it holds

The coder flagged this as the riskiest thing in the diff and asked for independent verification, correctly
noting they had confirmed the *string reaches `claude`* but not Claude Code's **parsing** of it. Settled
empirically, on a throwaway project with two real `fkit-*` skills on disk:

- **`--settings <file-or-json>` is documented** by the CLI itself (`claude --help`, v2.1.208): *"Path to a
  settings JSON file **or a JSON string** to load additional settings from"*. Documentation is not proof, so:
- **Inline JSON loads.** `--settings '{"env":{"FKIT_PROBE":"INLINE_OK"}}'` → the value is live in-session.
- **`skillOverrides` applies *identically* inline and from a file.** Baseline (no settings) → the session sees
  `fkit-alpha, fkit-beta`. Inline `{"skillOverrides":{"fkit-beta":"off"}}` → `fkit-alpha`. File containing the
  same JSON → `fkit-alpha`. **The lockdown does not fail open through this path.**
- **Malformed JSON fails CLOSED**, which is the property that actually matters: a string Claude Code cannot
  parse is treated as a *path*, not found, and the session **refuses to start** (`Error: Settings file not
  found: {"skillOverrides":…`). There is no "unparseable settings → silently unlocked session" mode.
- **The generated string survives argv intact** — `"$settings"` is quoted at both call sites (`:392`, `:444`)
  and the JSON contains no `$`, backtick, or whitespace. Confirmed on the wire: `--settings
  {"skillOverrides":{"fkit-adversarial-review":"off",…}}`, non-empty, non-coder skills off.

**The coder is also right about the design invariant, and I was wrong in round 1.** `architecture.md:48` and
`[[systems/install-and-self-update]]` both record *"fkit … stores no data outside the project's own files"*.
The `mktemp -d` fallback **I ratified in round 1 violated that recorded property** — I approved a boundary
crossing without checking it against the design record, which is exactly the failure a reviewer exists to
prevent. The inline approach restores the invariant (0 temp dirs, no `/tmp` surface) *and* removes R4. The
right call, caught by the coder, not by me. Recorded so it stays caught.

### New in round 2

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R8 | 2 | **medium** | `claude/fkit-claude.sh:374` | **R5's fix covers two of init's three refusal states.** init refuses on `fkit-claude-init.sh:40-46`: symlink, exists-but-not-dir, **and an unreadable/unsearchable directory**. The launcher's new gate is `[ -d ] && [ ! -L ]` — and `-d` is **true** for a `chmod 000` directory (`stat` needs `x` on the *parent*, not `r` on the dir). So on init's third refusal state the gate is entered, `[ ! -f "$pm" ]` is true (PROJECT.md cannot be traversed), `fresh=1`, and the owner is **forced into the producer cold-start that can never complete, on every launch, with no route to the menu** — precisely the R5 failure the fix was written to remove. **Verified E2E**, not by inspection: init prints `⚠ skipped ai-agents/ — it is a directory fkit cannot read into` and the launcher *immediately* prints `This project is not initiated yet — starting the producer to set it up` and execs `--agent fkit-producer`. **Both reviewers found this independently** (Codex rated it High). **Root cause is duplication, not a typo:** the refusal predicate now lives in two files and has *already* drifted on its first outing. Mirror init's acceptance predicate (real dir, not symlink, `-r`, `-x`) or, better, have init *signal* the refusal so the launcher never re-derives it. |
| R7 | 2 | low | `claude/fkit-claude-init.sh:95` | **R2's defect class, one file over, unfixed.** `cat > "$dest/.fkit/interview" <<'INTERVIEW'` is an unguarded, unredirected write: on a read-only project it leaks the same raw shell redirection diagnostic R2 was about — `fkit-claude-init.sh: line 95: …/.fkit/interview: Permission denied`, internal line number and all. The coder's stance ("init's own `rm`/`cp` diagnostics still show, intentionally") is a fair frontier call for `cp`/`rm`, whose messages are *legible* — but this one is not a diagnostic anyone chose to print. Side effect: because init unconditionally rewrites `.fkit/interview` instead of writing it only when absent, a **fully set-up, perfectly healthy read-only checkout fails setup on every launch** and gets the alarming "fkit could not finish setting up this project … files may be missing or stale". Noise, not breakage — but it is a false alarm on a healthy project. |
| R9 | 2 | low | `claude/fkit-claude.sh:262-268` | Skill basenames are interpolated into JSON **unescaped**, so a `fkit-*` skill directory whose name contains `"` or `\` yields malformed (or member-injected) settings JSON. Raised by Codex at **medium**; **downgraded on traced evidence** — the malformed-JSON probe above shows Claude Code **fails closed** (refuses to launch), so this **cannot silently unlock a session**; the worst case is a loud refusal to start. Reachability is near-nil (skill dirs are `cp`'d by init from `claude/skills/fkit-*`, all sane names). Cheap to harden; not worth a round on its own. |
| R10 | 2 | low | `claude/fkit-claude.sh:323` | Codex: the `ls` guard could false-negative on `ARG_MAX` with very many matches, and a *directory* named `fkit-foo.md` would satisfy it. **Both are vacuous today** — there are **7** agents, and nobody creates a directory named `fkit-*.md` inside `.claude/agents/`. An in-shell loop with `[ -f "$f" ]` is strictly better and free, if the file is being touched anyway. Recorded as latent hardening, not a live defect. |

### Re-verified this round — do not chase

- **Records corrections: all four confirmed independently.** The false dangling-symlink/write-through claim
  **never reached `wiki-vault/`** (grepped: zero hits — the coder's read is correct). ADR-015 is amended *in
  place* (`:3` status flagged, `:134` clause struck through with the retraction, decision unchanged, and the
  live-symlink/task-28 interaction preserved as the surviving rationale). The migration report carries §0/§0.1
  corrections and strikes rather than deletes. Task 27's brief carries the `⚠️ Correction (2026-07-14)` block
  and the unsatisfiable verification step is gone. Nothing left to correct.
- **`FKIT_SETUP_ONLY` now exiting 1 on a failed setup is correct and required** — not an unrequested change.
  There are **no external callers** (grepped: only the launcher's own usage + docs), and task 26's brief
  explicitly demands it: *"A failed setup under `FKIT_SETUP_ONLY=1` should **not** exit 0 pretending success."*
  Re-verified: rc=0 on a healthy project.
- **Happy path (100% of real traffic): no regression.** Set-up project → `--settings
  .fkit/settings/coder.json` (**relative path preserved**, tab titles intact), stdout only the role banner,
  no stderr beyond the pre-existing Codex-login notice. Fresh project → full summary, producer cold start.
- **Set-up-then-read-only → still launches, lockdown intact and non-empty**, now inline. Re-verified.

## Reviewer findings — round 3

**Verdict: one more one-line round — fix R11, then close. R8 is fixed at the root cause; R7's pushback
is upheld (my round-2 causal chain was wrong); one genuinely new medium remains.** Every claim below was
re-verified E2E against the code — nothing here is taken on trust, including my own round-2 findings.

### R8 — FIXED, at the root cause, and the fix is sound

The coder removed the duplicated predicate rather than patching the symptom. init now **signals** the
refusal (`fkit-claude-init.sh:193` `[ -n "$aa_state" ] && exit 3`) and the launcher **consumes the
status** (`fkit-claude.sh:312-316`) instead of re-deriving it. That is the right shape, and it is the
shape I asked for. Verified, not inspected:

- **`exit 3` under `set -euo pipefail` is safe.** The coder's specific worry — does errexit fire on
  `[ -n "$aa_state" ]` when `aa_state` is empty, killing the script before `exit 0`? — **it does not**.
  `[` sits on the **left** of an `&&` list, a position bash exempts from errexit. Probed directly:
  empty → `reached`, **rc=0**; non-empty → **rc=3**. Codex ran the same probe independently and agrees.
- **No path exits 3 on a genuine failure.** Every failure-bearing command in init was made to fail:
  `cp`/`rm`/`mkdir`/`chmod`/`cat`/`ls`/`wc` → **1**, `grep` → **2**, `tr` → 0, unbound var → 127,
  signals → 128+n, `pipefail` on `ls|wc|tr` → 1. **Nothing returns 3.** Codex enumerated the same set
  and reached the same conclusion. The 3 channel is unambiguous.
- **`exit 3` strictly implies "all other steps succeeded"** — `set -e` guarantees any earlier failure
  exits *before* line 193. So the status means exactly what it says.
- **All four refusal states now signal 3**: chmod-000 → 3, live symlink → 3, dangling symlink → 3,
  file-where-dir → 3. Controls: healthy → 0, genuinely fresh → 0, unwritable/never-set-up → 1.
- **Launcher outcome, under a real pty** (my first harness had no controlling terminal and misread the
  menu — re-run under `script(1)`): all four refusal states → **the menu**, `coldstart=0`, and **no
  false "could not finish setting up" warning**. The two must-not-regress paths hold: genuinely fresh →
  **producer cold-start + intake captured**; initiated → menu.
- **`|| setup_rc=$?` captures correctly** under `sh`/dash/bash-as-sh (both reviewers probed it).

### R7 — the coder's pushback is UPHELD. My round-2 causal chain was wrong.

The coder asked me to adjudicate, and they are **right**. I verified their claim and then tried to break it.

- **On a healthy, fully-set-up, read-only checkout, init dies at *step 3*, not line 95.** `bash -x`
  trace: the last commands executed are `mkdir -p …/.claude/{agents,skills}` (`:79`) and then
  `rm -f …/.claude/agents/fkit-*.md` (`:80`), which fails `Permission denied` → `set -e` → **rc=1**.
  **`grep -c interview` on init's stderr in that scenario: 0.** Line 95 is never reached.
- **Therefore guarding line 95 in isolation fixes nothing user-visible.** The "files may be missing or
  stale" warning R7 attributed to line 95 is produced by the `rm` at `:80` and would persist unchanged.
  R7 as written was a **symptom-to-cause misattribution — mine.** The coder was right to refuse a
  one-line change that provably doesn't fix the thing it claims to; declining it is the correct call and
  exactly the scrutiny CLAUDE.md's *Review Notes* asks for.
- **The leak itself is real but narrow.** I found the states that *do* reach it: `.fkit/` unwritable
  with `interview` absent, or `interview` itself `chmod 444` → `fkit-claude-init.sh: line 95: …
  Permission denied`, rc=1. Both are contrived partial-permission states, **not** the scenario R7 named.
- **The coder is also right that the warning is *correct* in the read-only case** — fkit genuinely could
  not refresh the agents, so they may well be stale. Not a false alarm.
- **The real fix is graceful degradation across ~10 unguarded writes** (`:58, :67, :73, :79, :80, :81,
  :86, :94, :95, :149, :161`), which is a materially larger change than R7 implied and belongs in its
  own task. **Recorded as an accepted residual** with a re-open condition, per the coder's proposal.

### New in round 3

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R11 | 3 | **medium** | `claude/fkit-claude.sh:387` · `claude/fkit-claude-init.sh:193` | **The refusal signal is LOST when init also fails later — and the R5/R8 bug comes straight back.** One exit code is carrying two independent facts. init sets `aa_state` at `:38-46`, but only emits `exit 3` at the **very end** (`:193`). If any step **after** the refusal fails, `set -e` exits with **that** status (1) and the refusal is never signalled. The launcher then maps rc=1 → `setup_ok=0`, **`aa_refused=0`** → fresh-detection runs → `PROJECT.md` is unreachable under the refused tree → `fresh=1` → **producer cold-start into a tree fkit already refused to touch, on every launch, with no route to the menu.** The R1 guard does not stop it (agents are on disk, so it launches). **Found by Codex; I verified it E2E and it reproduces.** Crucially the trigger is **not exotic — it is the intersection of this task's own two briefs**: a *read-only checkout* (task 26's motivating case) that *also* has a weird `ai-agents/` (task 27's). Verified reproductions: read-only + symlinked `ai-agents/` → rc=1 → **COLD-START**; read-only + chmod-000 `ai-agents/` → rc=1 → **COLD-START**; `ai-agents/` a file + `.fkit` a file → rc=1 → **COLD-START** (stub `claude` receives `--agent fkit-producer` + the fresh seed). |
| R12 | 3 | low | `claude/fkit-claude.sh:410-411` | **Pre-existing, NOT introduced by this diff — recorded, not charged to this task.** The menu gate is `{ [ -t 0 ] \|\| [ -r /dev/tty ]; }`, but `[ -r /dev/tty ]` is **true even with no controlling terminal** (the device node carries rw bits). With no tty and no args, the launcher enters the menu and dies at `exec 3</dev/tty` → `line 411: /dev/tty: Device not configured`, **rc=1** — instead of falling through to the lead default at `:448` that the comment at `:446` promises ("piped / CI → the team room is the safe default"). Confirmed pre-existing at `HEAD:342-343`; the diff contains **zero** `dev/tty` changes. Delicious irony: init's own `.fkit/interview` documents this exact pitfall at `:105-111` and guards it correctly by *opening* the tty in a subshell (`( : < /dev/tty ) 2>/dev/null \|\| exit 0`). The launcher should borrow that. **Out of scope for this task — recommend a follow-up.** |

### R11 — a minimal fix exists, and I verified it closes the hole without regressing anything

Tested on **copies in a scratch dir; the repo was not touched** (`git diff --stat claude/` unchanged
throughout at 4 files). Gate fresh-detection on setup having actually succeeded — `fkit-claude.sh:387`:

```sh
if [ "$aa_refused" = 0 ] && [ "$setup_ok" = 1 ]; then
```

This is **independently correct, not just a patch for the conjunction**: the producer's initiation must
*write* `ai-agents/`, and a failed setup is direct evidence fkit cannot write this project. Cold-starting
an initiation immediately after setup failed is wrong on its own merits, whatever the reason. It also
avoids inventing a fourth exit code (a "refused AND failed" status), which would put a second fact back
into the same channel.

Measured, with the one-line change applied to the copy:

| State | Before | After |
|---|---|---|
| read-only + symlinked `ai-agents/` | COLD-START ✗ | **menu ✓** |
| read-only + chmod-000 `ai-agents/` | COLD-START ✗ | **menu ✓** |
| `ai-agents/` a file + `.fkit` a file | COLD-START ✗ | **menu ✓** |
| genuinely fresh | cold-start ✓ | **cold-start ✓** (preserved) |
| initiated | menu ✓ | **menu ✓** (preserved) |
| pure refusal (no failure) | menu ✓ | **menu ✓** (preserved) |

### Regression sweep — re-run independently, not taken from the coder's report

All 19 of the coder's claims re-verified plus the pty correction. Confirmed: 5 KB folders scaffold in a
fresh project (`PROJECT.md conventions decisions history incidents reports`) · `conventions/README.md`
ships · lockdown non-empty and correct (coder-owned skills **0** wrongly off; reviewer skills **2** off)
· relative settings path `.fkit/settings/coder.json` preserved on the happy path · **stderr EMPTY** on
the happy path · never-set-up + unwritable → clean `exit 1` "no agents installed here" · `FKIT_SETUP_ONLY=1`
→ 0 on healthy, **1** on genuine failure · **0 fkit temp dirs anywhere outside the project**, and the
symlink target `elsewhere/` has **0 entries** — the `architecture.md:48` invariant holds.

## Closeout — R11 fixed, owner dispositions recorded (2026-07-14)

### R11 — FIXED. The round-3 blocker is closed.

The coder reproduced R11 first (both `ro+symlink` and `ro+chmod000` returned **rc=1, not 3** — the refusal
signal lost, exactly as both reviewers said), then applied the reviewer-specified one-line fix at the
fresh-detection gate. **Verified in the source by the reviewer at closeout**, not taken on trust:

```sh
# claude/fkit-claude.sh:395
if [ "$aa_refused" = 0 ] && [ "$setup_ok" = 1 ]; then
```

The rationale is preserved in-code at `:387-389` (one exit status cannot carry two independent facts), so
the next reader finds the reason and not just the guard. Coder's results: **9/9, zero failures** — all three
R11 reproductions now reach the menu (`ro+symlink`, `ro+chmod000`, `file-aa + file-fkit`), all three
must-not-regress paths hold (genuinely fresh → producer cold-start; initiated → menu; pure refusal → menu),
and the happy path is intact (relative settings path preserved, stderr silent, `FKIT_SETUP_ONLY=1` → 0 on a
healthy project). On top of the earlier 19/19 regression sweep. **R11 is neither a task nor a residual — it
is fixed.** No round 4.

### Owner dispositions — the five open questions, ruled

| Q | Ruling | Recorded as |
|---|--------|-------------|
| **R11** — fix now or file as a task? | **Fixed now.** | Closed. Not a residual, not a task. |
| **R7, R9, R10** — ratify as accepted residuals? | **RATIFIED**, with their re-open conditions. | Accepted residuals (below), promoted from *proposal* to *owner-ruled*. |
| **Read-only checkouts — supported configuration?** | **NO. Explicitly ruled out of scope.** | **R7 is closed PERMANENTLY, not merely accepted.** "Make init degrade gracefully on every write" is **not a task** and must **not** be re-raised. The ruling itself is recorded — not just its outcome — so a future review finds the decision instead of re-deriving the need. |
| **R12** — `/dev/tty` headless menu gate? | **WON'T FIX, deliberately.** Owner: *"fkit is a terminal tool, not something else."* Headless operation is **not a target use case**. | **Rejected finding**, with rationale (below). Out of scope **by design**, not by oversight. **Not** a follow-up task — the round-3 "worth a task" recommendation is **superseded**. |
| **`FKIT_SETUP_ONLY=1` exits 0 on a pure refusal** — bug? | **NO — the contract is CORRECT as written.** | Contract recorded explicitly (below) so Codex's flag cannot resurface. |

### R12 — REJECTED (owner ruling, not an oversight)

`claude/fkit-claude.sh:410-411` · **won't fix.** The finding is technically accurate — `[ -r /dev/tty ]` is
true even with no controlling terminal, so a headless launcher enters the menu and dies `Device not
configured` (rc=1) instead of falling through to the lead default. It is also **pre-existing**
(`HEAD:342-343`, zero `dev/tty` changes in this diff). The owner ruled it **out of scope by design**: fkit
is a terminal tool; headless/CI operation is not a target use case, so a code path that only misbehaves
without a terminal is not a defect against fkit's contract. **To the next reviewer who spots the
`[ -r /dev/tty ]` weakness: you are right about the mechanism and it has already been ruled on. This is a
deliberate frontier position, not a bug to re-report.** Re-opens only if headless/CI operation ever becomes
a supported use case — at which point `.fkit/interview:105-111` already shows the correct pattern (probe by
*opening* the tty in a subshell).

### `FKIT_SETUP_ONLY=1` on a pure refusal — CONFIRMED CORRECT

**`FKIT_SETUP_ONLY=1` exits 0 when init refused to touch `ai-agents/` (rc=3), and that is the contract.**
**Refusal is not failure.** Setup genuinely *succeeded* — agents and skills were installed — and
`ai-agents/` was **deliberately** left untouched because it was in a state fkit will not write into. The
non-zero exit is reserved for setup actually failing (task 26's brief: *"A failed setup under
`FKIT_SETUP_ONLY=1` should not exit 0 pretending success"*) — a refusal is not that. Codex flagged the 0 as
suspicious; **it is correct**, and this entry exists so the flag does not resurface.

## Coder response

<!-- CODER-OWNED. The reviewer does not write here. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **Agreed** — verified. My own test was the failure: a stub `claude` that always printed success masked `--agent not found`. The reviewer used the real binary. | Defect (incomplete) | Guard added: setup failed **and** no `.claude/agents/fkit-*.md` on disk → clear message, `exit 1`. Deliberately did **not** drop `--agent` to force a session — unroled = ADR-010 fails open. | **Fixed** (owner-approved: narrow task 26's promise) |
| R2 | **Agreed** — verified. A redirection that fails to *open* is reported by the shell, not the command, so `printf … > f 2>/dev/null` still leaks. | Defect (cosmetic) | Subshell around the write, so the redirection sits inside the scope stderr is silenced for. | **Fixed** |
| R3 | **Partially correct** — Codex rated it critical; it is **vacuous today**. An empty `skillOverrides` means no skills are on disk, and a skill that does not exist cannot be invoked. The lockdown is globbed from disk at launch, so it always classifies what is really there and **cannot fail open**. | Frontier | None. Latent hardening only. | **Accepted residual** (owner-ratified) |
| R4 | **Agreed** — verified. | Defect (hygiene) | **Removed the temp file entirely** rather than patching the leak: `--settings` accepts a file *or* JSON, so the degraded path now passes the JSON **inline**. 0 temp dirs, 0 `/tmp` attack surface — and it restores the recorded invariant *"fkit stores no data outside the project's own files"* (`architecture.md:48`), which my own `mktemp` fallback had violated. | **Fixed** |
| R5 | **Agreed** — verified. | Defect (UX) | A refused `ai-agents/` is no longer treated as "fresh", so it falls through to the menu instead of stranding the owner in an unfinishable producer cold-start on every launch. | **Fixed** (owner-approved: fix, don't accept) |
| R6 | **Agreed** — TOCTOU between the preflight and the copy is real but outside the threat model (a local attacker racing your own project directory already owns you). | Frontier | None. | **Accepted residual** (owner-ratified) |
| R7 | **Partially correct — pushed back, and the pushback was upheld.** The leak is real; **the causal chain is not.** On a healthy read-only checkout init dies at `:80`'s `rm -f` (step 3) and **never reaches line 95** — `bash -x` and `grep -c interview` on stderr (=0) confirm it. Guarding line 95 in isolation provably fixes nothing user-visible. The reviewer withdrew the finding. | Defect (cosmetic), misattributed | None. Filed on the **corrected** grounds so the next reviewer doesn't "fix" line 95 and change nothing. | **Accepted residual — closed permanently.** Owner ruled read-only checkouts are **not a supported configuration**. |
| R8 | **Agreed** — verified, and the root cause named was the right one. `[ -d ]` is **true for a `chmod 000` directory** (`stat` needs `+x` on the *parent*, not `+r` on the dir), so init's third refusal state sailed through my gate and reintroduced R5. The real fault was **duplication**: I put the refusal predicate in two files and it drifted on its first outing. | Defect | Fixed at the root, not the symptom: **init now signals** the refusal (`exit 3` = "setup succeeded, but I deliberately did not touch `ai-agents/`"); the launcher **consumes the status** and no longer re-derives the condition. The predicate has one home. | **Fixed** |
| R9 | **Agreed, low.** Skill names are interpolated into JSON unescaped — but they come from `skills_for_role()` and the on-disk `fkit-*` glob, not user input, and malformed JSON **fails closed** (Claude Code treats it as a path, doesn't find it, refuses to start). It cannot unlock a session. | Frontier | None. Re-open if skill names ever become user-supplied. | **Accepted residual** (owner-ratified) |
| R10 | **Agreed, vacuous.** `ls` ARG_MAX / a directory named `*.md` — at seven agents this is unreachable. | Frontier | None. | **Accepted residual** (owner-ratified) |
| R11 | **Agreed** — reproduced it myself before fixing (`ro+symlink` and `ro+chmod000` both returned **rc=1, not 3** — the refusal signal lost). **One exit status cannot carry two independent facts.** The trigger is the intersection of this work's own two briefs: a read-only checkout (26) that *also* has a weird `ai-agents/` (27). | Defect | Applied the reviewer's one-line fix at the fresh-detection gate: `[ "$aa_refused" = 0 ] && [ "$setup_ok" = 1 ]`. Independently correct, not just a patch — the producer's initiation exists to **write** `ai-agents/`, and a failed setup is direct evidence fkit cannot write this project. Rationale left in-code so nobody "simplifies" the `setup_ok` test back out. | **Fixed** (owner-approved: fix now) |
| R12 | **Agreed on the mechanism** — `[ -r /dev/tty ]` is true with no controlling terminal, so a headless launcher enters the menu and dies instead of defaulting to lead. **Pre-existing; not in this diff.** | Frontier | **None — won't fix, by design.** Owner: *"fkit is a terminal tool, not something else."* Headless operation is not a target use case. | **Rejected** (owner-ruled; not a follow-up task) |

## Accepted residuals (shared, do-not-re-litigate)

A finding that merely restates one of these is **re-litigation** — suppress it and cite this section.

**Owner-ruled at the end of round 1** (R3, R6); **re-verified as still-accurate in rounds 2 and 3**.
**Owner-RATIFIED at closeout** (R7, R9, R10) — proposed in round 3, ruled on by the owner, now binding.

| #  | Accepted | Why it stays accepted | Re-opens if |
|----|----------|-----------------------|-------------|
| R7 | **OWNER-RATIFIED — and CLOSED PERMANENTLY, not merely accepted.** `cat > "$dest/.fkit/interview"` (`fkit-claude-init.sh:95`) is an unguarded write that leaks a raw `line 95: … Permission denied`. | **Filed on the CORRECTED grounds — the original causal chain was wrong and is withdrawn.** R7 as written claimed line 95 is why a healthy read-only checkout fails setup every launch. **It is not.** init dies **earlier**, at **`:80`'s `rm -f`** (step 3); `bash -x` confirms line 95 is **never reached** and init's stderr contains **0** mentions of `interview`. The misattribution was the **reviewer's**, and the coder's pushback was upheld — the residual is filed on true grounds, not the original symptom-to-cause error. The leak itself is real but reachable only in contrived partial-permission states (`.fkit/` unwritable with `interview` absent; `interview` `chmod 444`). The "may be missing or stale" warning is moreover **correct** on a read-only checkout: fkit genuinely could not refresh the agents. **The owner has ruled that read-only checkouts are NOT a supported configuration** — so the underlying condition is out of scope by decision, and "make init degrade gracefully on every write" is **NOT a task**. | **Nothing short of the owner reversing the ruling above.** Do **not** re-raise this as "init should degrade gracefully on an unwritable project" — that framing has been ruled out. Only if read-only checkouts are ever made a **supported configuration** does this become real work, and it would then have to cover **every** write in init (`:58,:67,:73,:79,:80,:81,:86,:94,:95,:149,:161`), not line 95 alone. |
| R9 | **OWNER-RATIFIED.** Skill basenames are interpolated into the settings JSON **unescaped** (`fkit-claude.sh:262-268`), so a `fkit-*` skill dir containing `"` or `\` yields malformed or member-injected JSON. | **Fails closed, and reachability is near-nil.** Verified in round 2: malformed `--settings` makes Claude Code **refuse to start** (it falls back to treating the string as a path) — there is no "unparseable settings → silently unlocked session" mode. Worst case is a loud refusal, never a lockdown bypass. Skill dirs are `cp`'d by init from `claude/skills/fkit-*`, all sane names. Codex rated it medium; **downgraded on traced evidence** and it stayed down on re-trace. | Skill directories ever come from a source fkit does not control (a marketplace, a plugin dir, user-authored skills) — i.e. the same trigger as R3. Then the name is untrusted input and must be escaped. |
| R10 | **OWNER-RATIFIED.** The `ls "$proj"/.claude/agents/fkit-*.md` guard (`fkit-claude.sh:333`) could false-negative on `ARG_MAX` with very many matches, and a *directory* named `fkit-foo.md` would satisfy it. | **Vacuous today.** There are **7** agents (verified: 7 on disk), nowhere near `ARG_MAX`, and nobody creates a directory named `fkit-*.md` inside `.claude/agents/`. An in-shell loop with `[ -f "$f" ]` is strictly better and free **if that line is being touched anyway** — but it does not justify a round on its own. Latent hardening, not a live defect. | The agent count grows by orders of magnitude (it will not), or `.claude/agents/` ever holds fkit-managed **directories**. Realistically: fold it in for free the next time `:333` is edited. |
| R3 | `build_settings` derives the skill **denylist by globbing the filesystem** (`fkit-claude.sh:257-284`), so a skill fkit cannot see is a skill it cannot turn off. With no skills on disk it emits `{"skillOverrides":{}}` — a lockdown that disables nothing. | **Blast radius today is nil**: init `cp`s the full skill set on every launch, so "no skills on disk" co-occurs with "no agents on disk", which R1's new guard now **refuses to launch into** at all. A denylist computed from the filesystem is a *frontier position* (it is what `skillOverrides` can express), not a defect. Codex rated it **critical** in round 1; **downgraded on traced evidence** and it stayed down on re-trace. | fkit ever ships an **allowlist** form of `skillOverrides`, or skills come from anywhere but init's `cp` (a marketplace, a plugin dir). Then the denylist stops being expressible and this becomes live. |
| R6 | **TOCTOU** between the `[ -L ]`/`[ -e ]` preflight and `cp -R` (`fkit-claude-init.sh:40-58`): a local process could swap `ai-agents/` to a symlink inside the window. | **Outside fkit's threat model.** It requires an attacker who already has write access to the project path — i.e. someone who can simply write the files directly and skip the race entirely. Closing it buys nothing against that attacker. | fkit ever runs against a path a **less-trusted** process can write (a shared CI workspace, a multi-tenant checkout). Then the window is worth closing. |

**Also settled and not to be re-raised** (full evidence in *Disproven / verified-safe*, round 1, and
*Re-verified this round*, round 2):

- **Task 27's headline premise — `cp -R` writing outside the project through a *dangling* symlink — is FALSE
  on every platform.** Retracted across ADR-015, the migration report, and the task brief; it never reached
  the wiki. **The `[ -L ]` gate is still right, on the corrected grounds** (dangling → DoS; **live symlink →
  GNU `cp` really does write through, and task 28 is exactly what arms it**; file-where-dir-belongs → silent
  permanent breakage). Do not "simplify" the gate away on the strength of the retraction.
- **Inline `--settings` JSON is a supported, verified-equivalent mechanism** that **fails closed** when
  malformed. Settled empirically in round 2; not to be re-litigated on suspicion.
- **`exit 1` inside `build_settings`'s command substitution does kill the launcher** (the assignment inherits
  the substitution's status; `set -e` fires). Not a hole.
- **The `exit 3` refusal channel is SAFE and unambiguous** (round 3, both reviewers, independently
  probed). `[ -n "$aa_state" ] && exit 3` does **not** trip errexit when `aa_state` is empty (`[` is on
  the left of an `&&` list — an errexit-exempt position); **no** init command returns 3 on failure
  (`cp`/`rm`/`mkdir`/`chmod`/`cat`/`ls`/`wc` → 1, `grep` → 2, signals → 128+n, unbound → 127); and
  `set -e` guarantees `exit 3` is reachable **only** when every other step succeeded. `|| setup_rc=$?`
  captures it correctly under sh/dash/bash. Do not re-litigate the mechanism — **R11 is about the
  signal being *lost* on a later failure, which is a different defect and is NOT settled.**

**REJECTED by the owner — do not file, do not re-report:**

- **R12 — the launcher's `[ -r /dev/tty ]` menu gate** (`fkit-claude.sh:410-411`). **WON'T FIX, by design.**
  Round 3 recommended a follow-up task; **the owner overruled that and rejected the finding outright.**
  Rationale: *"fkit is a terminal tool, not something else."* **Headless operation is not a target use
  case**, so a path that only misbehaves without a controlling terminal is not a defect against fkit's
  contract. The mechanism is real and correctly described (`[ -r /dev/tty ]` is true with no controlling
  terminal, so the launcher enters the menu and dies `Device not configured`, rc=1, instead of defaulting to
  the lead as `:446` promises) — **and it has already been ruled on.** Re-opens only if headless/CI operation
  becomes a supported use case; `.fkit/interview:105-111` already shows the correct pattern.

**Contract, confirmed — not a bug:**

- **`FKIT_SETUP_ONLY=1` exits 0 on a pure refusal (init rc=3), and that is correct.** **Refusal is not
  failure.** Setup succeeded — agents and skills installed — and `ai-agents/` was *deliberately* left
  untouched. Non-zero is reserved for setup genuinely failing. Codex flagged the 0; **the flag is wrong**.

## Convergence call — round 3

**Not converged, but one line from it. Fix R11, then close — no round 4.**

This is **not** a review loop. Rounds 1→2→3 have been strictly converging and every round found strictly
fewer, narrower things:

| Round | Findings | Of which medium+ | Re-litigation |
|-------|----------|------------------|---------------|
| 1 | R1–R6 | 1 medium | — |
| 2 | R7–R10 (+ R1–R6 dispositioned) | 1 medium (R8) | none |
| 3 | R11, R12 (+ all prior dispositioned) | 1 medium (R11), 1 pre-existing/out-of-scope | none |

- **R8 is fixed at the root cause** the reviewer named — the predicate now has one home. That is the fix
  I asked for, and it holds under attack from both reviewers.
- **R7 is withdrawn on the coder's evidence.** The coder was right, I was wrong, and the pushback was
  exactly the "verify the claim against the actual codebase before changing anything" behavior
  CLAUDE.md's *Review Notes* mandates. **A reviewer being wrong is a normal event; recording it is what
  keeps the ledger trustworthy.**
- **R11 is genuinely new** — surfaced by the Codex pass (the model-diverse second opinion earning its
  keep; my own pass missed it), then verified E2E by me rather than taken on trust. It is not a
  re-statement of any accepted residual.

**Why R11 warrants the round rather than a follow-up task:** it resurrects *the exact failure this task
exists to prevent* (the unescapable producer cold-start), and it does so in **the intersection of the
task's own two briefs** — a read-only checkout (26) that also has a weird `ai-agents/` (27). Shipping 26
and 27 together while their conjunction still reproduces the bug would be closing the task on a
technicality. The fix is **one line**, and the reviewer has **already verified it closes all three
reproductions and regresses none of the three must-not-regress paths**.

**Therefore: no round 4 is needed.** There is nothing left for another review pass to discover — the fix
is specified and pre-verified. The coder applies it, re-runs the six rows of the R11 table, and the
review closes. If the owner would rather ship now, R11 must instead become a **task**, not a residual:
it is a live medium defect, not a settled tradeoff.

**Suppressed as settled this round (cited, not re-argued):** the filesystem-globbed denylist (R3), the
`[-L]`/`cp -R` TOCTOU (R6), unescaped skill basenames (R9), the `ls` guard's ARG_MAX/dir edge (R10),
`cp -R` write-through on a *dangling* symlink (empirically false on every platform), inline `--settings`
being a supported and fail-closed mechanism, and the `exit 3` **mechanism** (as distinct from R11's
signal-loss defect).

## Closing verdict

> **APPROVED — CLOSED. Tasks 25, 26, 27 ship. Every medium finding is fixed at its root cause (R1, R8,
> R11); five residuals are owner-ruled and binding (R3, R6, R7, R9, R10); R12 is rejected by design; task
> 28 is parked and NOT reviewed. Coverage complete — both reviewers ran all three rounds. No round 4.**

**Converged.** Rounds 1→2→3 found strictly fewer and narrower things (6 → 4 → 2 findings; exactly one
medium each round, each fixed at the root cause rather than the symptom), with **zero re-litigation** in any
round. The last blocker (R11 — the refusal signal lost when init also fails later, resurrecting the
inescapable producer cold-start in the intersection of tasks 26 and 27) is **fixed and verified in the
source** at `claude/fkit-claude.sh:395`; 9/9 targeted checks pass on top of the 19/19 regression sweep.
There is nothing left for another pass to discover.

**Scope boundary — read this before citing the ledger.** This review covers **tasks 25, 26 and 27 only**.
**Task 28 (additive convergence) is PARKED by the owner: not built, not reviewed.** Its design question is
open — the opt-out cannot live in gitignored `.fkit/`, which would not survive a clone. Nothing in this
ledger constitutes review of convergence. Note that task 28 is also what would **arm** the live-symlink
`cp -R` write-through (see *Accepted residuals*), so the `[ -L ]` gate must survive into it.

**Two records worth keeping, because they are what make this ledger trustworthy:** the reviewer was
**wrong** about R7's causal chain and the coder's pushback was **upheld** — the residual is filed on the
corrected grounds (init dies at `:80`'s `rm -f`, never reaching line 95). And R11 was surfaced by the
**Codex** pass, not the reviewer's own — the model-diverse second opinion earning its keep on the single
most consequential defect in the diff.

**Nothing is owed by this review.** No follow-up tasks are open from it: R11 fixed, R7/R9/R10 accepted with
re-open conditions, R12 rejected. The only open thread in the neighborhood is **task 28**, which is the
owner's to unpark.
