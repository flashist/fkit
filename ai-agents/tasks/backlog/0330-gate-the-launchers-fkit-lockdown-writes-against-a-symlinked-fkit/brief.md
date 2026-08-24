# Gate the launcher's `.fkit` lockdown writes against a symlinked `.fkit` — and fix its false "not writable" diagnosis

## ID
0330

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

⚠️ **⛔ READ THIS FIRST — THIS ROW'S PROVENANCE IS DIFFERENT FROM ITS THREE SIBLINGS, AND THE
DIFFERENCE IS NOT COSMETIC.**

`0327`, `0328` and `0329` each rest on an explicit owner ruling of 2026-08-23. **This one does not.**
Finding **F4** was **never put to the owner**. `0046`'s planner recommended *"verify, then fold into
F1's task or file separately"*, and the **driver delegated that placement choice to the filing
producer**. ⛔ **So the existence and placement of this row are the filing producer's judgement under
that delegation — NOT an owner ruling.** ⚠️ **An agent's instruction is not owner consent.** The
placement is returned to the owner as an open question, and **cancelling or folding this row is a
cheap, expected outcome** if the owner prefers it.

### Why its own task, and not folded into `0327` — the justification, stated so it can be overruled

1. ⭐ **The shared-helper argument that justifies folding does not hold.** `0327` is cheap-once-`0046`-
   lands because `path_contained` is *in the same file* as §3. **The launcher is a separate script that
   never sources init**, so it **cannot call that helper at all** without a new shared seam — a design
   choice with its own cost, not a mechanical repeat. **This is the load-bearing reason.**
2. **Different file, different owner ruling scope.** The Q1 ruling is scoped to init's §3. Folding a
   second script in widens a diff under a ruling that did not contemplate it — the same blast-radius
   mistake that correctly kept `0046` out of `0072`.
3. **Different severity class.** `0327` **deletes**; this one **creates and overwrites**. Bundling them
   would blur the distinction the Q1 ruling turns on.
4. **Independently shippable** either way.

⛔ **Counter-argument, recorded rather than suppressed:** both are `-L` guards on a `$dest`/`$proj`
path, and a reviewer may reasonably prefer one task for the whole doctrine. **If the owner folds this
into `0327`, nothing is lost but this row.**

### The finding, and it is no longer a code-read

> ⚠️⚠️ **TWO REPORTS ABOUT F4 DISAGREE, AND THE DISAGREEMENT IS RECORDED HERE UNRESOLVED RATHER THAN
> SETTLED BY PICKING ONE.** Noted 2026-08-24.
>
> | Who | Claim about F4 |
> |---|---|
> | The producer that filed this brief, 2026-08-23 | **F4 was executed**, and the two runs below are its own measurements |
> | `0046`'s Build worker, re-measuring post-change | F4 is **still a code-read, not executed** *on its side* |
>
> ⛔ **Neither report is deleted and neither is endorsed.** They may not even conflict — *"not executed
> on its side"* is a statement about `0046`'s own run, not a denial that someone else ran it — but the
> two sentences read as contradictory to anyone scanning, so both are on the record.
>
> ✅ **WHAT IS SETTLED, because a THIRD party executed it: the DEFECT is confirmed by execution.**
> Re-run independently on **2026-08-24** by the producer that ranked `0327`, in scratch directories
> outside the repo, with a stubbed `claude` binary on `PATH` so the exec was observed rather than
> performed. **Two runs — one against `git archive HEAD` (`0046` NOT applied), one against the working
> tree (`0046` APPLIED).** Measured by `shasum`, before and after:
>
> | Path outside the project | HEAD run | Working-tree run |
> |---|---|---|
> | `settings/coder.json`, pre-seeded with user content | ⛔ **OVERWRITTEN** with the hooks JSON | ⛔ **STILL OVERWRITTEN** |
> | `state/` | ⛔ created outside | ⛔ **still created outside** |
> | `interview`, pre-seeded with user content | ⛔ **OVERWRITTEN** with the intake script | ✅ **survives byte-identical** — `0046`'s guard refuses and says so |
>
> Both runs **exited 0** and **printed no warning about the settings or state escape**. ⭐ **The only
> thing the user sees is the orphan-cleanup refusal** — *"`.fkit/agents` — refused: `.fkit` is a symlink
> — fkit will not delete through one"* — so the launcher **tells the user it will not DELETE through the
> link in the same breath as it WRITES through it three times.** ⚠️ **That inconsistency is new evidence
> and is the sharpest argument for this task: the doctrine is already in this file, and these three
> calls are the ones that skipped it.**
>
> ⛔ **What this third run does NOT settle: which of the two reports above is right about what was run
> before.** It is evidence about the code, not about either agent's process. **Do not write it up as
> resolving that.** ✅ **What it does settle: `0046` closes the `interview` site and does NOT close this
> one — measured, not inferred.**

`0046`'s plan §6 marked F4 **"read from the code, not executed"**. ✅ **It has now been EXECUTED and
CONFIRMED by the filing producer, 2026-08-23.** `claude/fkit-claude.sh` writes launcher lockdown state
through `$proj/.fkit` with **no `[ -L ]` check on any component** (`HEAD`):

| Line (`HEAD`) | Call |
|---|---|
| `:319` | `mkdir -p "$proj/.fkit/state" 2>/dev/null \|\| :` |
| `:331` | `if mkdir -p "$proj/.fkit/settings" 2>/dev/null &&` |
| `:332` | `( printf '{%s}\n' "$hooks" > "$proj/.fkit/settings/$1.json" ) 2>/dev/null; then` |

**Method:** clean `git archive HEAD claude` install share (extracted `fkit-claude-init.sh` `shasum`
`a8e00a69effda2fd745f2e050d10ce14af61dde1`, identical to `git show HEAD:`), a throwaway project
initialised normally, then `.fkit` replaced with a symlink to an outside directory, then
`claude/fkit-claude.sh coder` run with a **stubbed `claude` binary** on `PATH` so the exec is observed
rather than performed.

**Measured, run 1 — outside directory pre-seeded with `user-note.txt` only:**

| Outside the project, after the launcher ran | |
|---|---|
| `settings/coder.json` | ⛔ **created** — the full ADR-010 hooks JSON |
| `state/` | ⛔ **created** |
| `interview` | ⛔ **created** (init's §4, i.e. `0046`'s site, reached through the same link) |
| `user-note.txt` | ✅ untouched |

**Measured, run 2 — outside directory pre-seeded with user content at the exact target paths:**

| Path | Before | After |
|---|---|---|
| `settings/coder.json` | `USER CONTENT — must not be clobbered` | ⛔ **OVERWRITTEN** with the hooks JSON |
| `interview` | `USER CONTENT — interview` | ⛔ **OVERWRITTEN** with the intake shell script |

⚠️ **So this is not merely "creates a file outside the project" — it DESTROYS existing user content at
those paths**, silently (`2>/dev/null` on both), on **every launch**. ⛔ **It does not `rm -rf` a tree,
so it is less severe than `0327`; it is more severe than a pure create.**

### 🆕 The second defect, found while measuring the first: the launcher blames the wrong thing

When `:331`'s `mkdir -p` fails — including for a **dangling** `.fkit`, which is not a permissions
problem at all — `:336` prints, verbatim:

```
⚠ <proj> is not writable — passing the role lockdown inline instead of via .fkit/.
```

⛔ **Measured on a project that was fully writable.** The message names a cause that is false and sends
the user to check permissions instead of the broken symlink. ⚠️ **The comment above it makes clear the
branch was designed for read-only checkouts and permissions — a symlinked or wrong-type `.fkit` simply
falls into it and inherits its wording.**

✅ **Credit where it is due, and this bounds the severity: the lockdown still applied.** It was passed
inline via `--settings`, exactly as the comment promises, so the session **failed SAFE, not open** —
the ADR-010 role isolation was never lost. **The defect is the diagnosis, not the fallback.**

## What to build

> ⭐ **SCOPE, NARROWED BY OWNER RULING 2026-08-24 — READ THIS BEFORE THE BULLETS. THIS TASK IS THE `-L`
> CONTAINMENT CHECK ALONE.** Given live via `AskUserQuestion` in an `fkit lead` session driving
> `/fkit-sprint-ship-loop` and relayed to a spawned `fkit-producer` with no owner channel
> ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
>
> **The reason, re-measured firsthand 2026-08-24 against the working tree — and `claude/fkit-claude.sh`
> is byte-identical to `HEAD` there, so these coordinates are current in both:**
>
> | Anchor (quote first, number second) | What it does on failure |
> |---|---|
> | `mkdir -p "$proj/.fkit/state" 2>/dev/null \|\| :` (`:319`) | **`\|\| :` — swallows the failure outright.** Non-fatal by construction. |
> | `if mkdir -p "$proj/.fkit/settings" … && ( printf … > … ) …; then` (`:331`–`:332`) | **falls through to the documented inline-settings fallback** at `:336`, which passes the same hooks JSON to `--settings` inline. Non-fatal, and fail-**safe**. |
>
> ⛔ **So the failure mode here is a SILENT ESCAPE, never an abort.** Nothing in the launcher's `.fkit`
> path can kill a session, and **no abort-hardening work belongs in this task.** That shape —
> a `mkdir -p` whose failure is fatal under `set -euo pipefail` — is `0328`'s, in a **different file**
> (`claude/fkit-claude-init.sh`). ⚠️ **A plan that arrives here proposing to make these calls non-fatal
> has misread the code: they already are.**
>
> ✅ **Checked, and stated rather than assumed: this brief contained NO wording implying an abort, so
> nothing was corrected for it.** The narrowing above is an **addition** — the existing text already
> said the session *"failed SAFE, not open"* and that the lockdown still applied. ⛔ **The two
> deliverables below are UNCHANGED by this ruling** — the guard **and** the `:336` misdiagnosis fix; the
> ruling narrows *how the guard is scoped*, not *what the task ships*.
>
> ⚠️ **Line numbers throughout this brief are snapshots. Anchor on the quoted code, not the number**
> ([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).

- **Guard the launcher's `.fkit` writes** at `:319`, `:331` and `:332` so a symlinked (or dangling, or
  wrong-type) `.fkit` is not written through.
- ⭐ **Decide FIRST, and state, how the launcher gets the check — this is the design question in the
  task.** ⚠️ **`path_contained` lives in `claude/fkit-claude-init.sh` and the launcher does not source
  it.** The options each have a real cost: **(i)** extract the helper into a small shared file both
  scripts source — cleanest, but adds a new install-share file and therefore touches the release
  surface; **(ii)** duplicate a minimal `-L` walk in the launcher — no new file, but **two copies of a
  safety rule that must not drift**, which is precisely the failure mode `0046`'s brief names when it
  says a rule with no enforcement point gets missed; **(iii)** have the launcher source init's helper
  directly — smallest diff, but couples launcher startup to init's internals. ⛔ **Do not pick by
  keystroke.** ⚠️ **Check `RELEASING.md` and `claude/structure-manifest.tsv` before choosing (i)** — a
  new file in the install share may owe a regen, and **`0188` is the open manifest-regen row that a
  stray regen would collide with.**
- ⛔ **The fallback must stay fail-safe.** On refusal the lockdown is **still applied inline** — a
  session without `--settings` carries no ADR-010 isolation and would fail **open**, every role's skills
  live at once. **Refusing the file write must never become refusing the lockdown.**
- **Fix `:336`'s message** so it names the actual cause. ⚠️ **Keep the read-only-checkout wording for the
  case it was written for** — the fix is to stop *every* failure inheriting it, not to replace it.

## Verification steps

- **Both reproductions are closed**, each asserted separately with a **before/after manifest of the
  OUTSIDE tree**: (1) `.fkit` → an outside directory, nothing pre-seeded — **no `settings/`, no `state/`
  created there**; (2) the same with `settings/coder.json` pre-seeded with user content — ⛔ **the
  content survives byte-for-byte.** ⚠️ **`test/harness.mjs`'s `manifest()` walks only the project and
  CANNOT see an escape** — a test relying on it alone passes while the bug is live.
- **The dangling-link case** — `.fkit` a broken symlink — is refused, and ⭐ **the warning names the
  symlink, not writability.** Assert on the message text.
- ⭐ **The lockdown is still applied on the refusal path.** Assert the launcher passes the hooks JSON
  **inline**; ⛔ **a test that only checks "no file was written outside" would pass a regression that
  dropped `--settings` entirely** — the worst possible outcome here.
- **A symlinked component deeper than the leaf** (`.fkit/settings` a link, `.fkit` real) is refused too.
- **The genuine read-only-checkout case still works** — `chmod` a project unwritable, confirm the
  inline fallback still fires **and still says the project is not writable**, because there it is true.
- **The ordinary case is untouched:** a normal `.fkit` gets `state/` and `settings/<role>.json`, and the
  launcher passes the relative `--settings` path exactly as before.
- **`npm test` green, with the count stated.**
- ⚠️ **Check whether `test/prove-red.sh` reaches `claude/fkit-claude.sh` before claiming mutation
  coverage; if it does not, say so plainly rather than letting it pass unremarked.**

## Notes

- **Owner: fkit-coder** — a production launcher (`claude/fkit-claude.sh`) change.
- **Depends on:** nothing.
- ⚠️ **Line numbers are from `git show HEAD:claude/fkit-claude.sh` at commit `05fd9d0`.** `0046`'s
  coder was concurrently editing `claude/fkit-claude-init.sh` — **not this file** — but **re-derive at
  plan time anyway; resolve by the code, never by the number.**
- ⛔ **NOT covered by `0046`.** `0046` guards **init's** `.fkit` write (§4, the `interview` intake).
  ⚠️ **The measured `interview` overwrite above is `0046`'s site reached through the launcher's run of
  init — `0046` closes that one; it does NOT touch `:319`/`:331`/`:332`, which are in a different
  file.** ⛔ **Do not close this on `0046` landing.**
- **Relates to `0327`** (init §3's destructive escape — the fold-in candidate; see the justification
  above), **`0328`** (init's `mkdir -p` aborts — ⚠️ **the `:336` misdiagnosis is most often SEEN in
  `0328`'s dangling-`.fkit` scenario, and `0328`'s brief points here for the fix**) and **`0329`**
  (§5's `.gitignore` product decision).
- ⛔ **Distinct from `0045`, measured not assumed.** `0045` is the **read** side under **`ai-agents/`**
  and is **latent** by its own brief's words; this is a **write and overwrite** through `.fkit` in the
  **launcher**, **live and reproduced today**. **Neither closes the other.**
- **Risk: moderate, and higher than its three siblings' — because the code it touches is the ADR-010
  lockdown path.** The defect itself is bounded (create/overwrite at two known paths, not a recursive
  delete), but a careless fix can drop `--settings` and fail the session **open**. ⭐ **That is where
  review attention belongs, not on the `-L` walk.**
- ⚠️ **Residual this task cannot close:** the TOCTOU window between the `-L` check and the write is not
  closable in POSIX shell — `claude/fkit-claude-init.sh:610-611` (at `HEAD`) already records exactly
  this. **The guard inherits that residual; it does not widen it.**
- ⛔ **Out of scope:** init §3 (`0327`), init's `mkdir -p` fatality (`0328`), §5's `.gitignore`
  (`0329`), `0046`'s §4 fix, regenerating `claude/structure-manifest.tsv` speculatively (**`0188`
  owns it**), any `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  any re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  and any task-file move ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- **Evidence sources:** `ai-agents/tasks/done/0046-gate-symlink-escape-in-init-intake-write/plan.md`
  §6 (finding **F4**, there marked *"read from the code, not executed"*) and §7's *"F4 is a code-read,
  not an execution"*. ⭐ **Both reproductions, the overwrite result and the `:336` misdiagnosis are the
  filing producer's own measurements**, executed 2026-08-23 against `HEAD` = `05fd9d0` in scratch
  directories outside the repo with a stubbed `claude` binary; **the repo working tree was not modified
  by them.** ⛔ **F4's "unverified" marker in `0046`'s plan §7 is now DISCHARGED** — but that plan file
  was **not edited** by this filing; the discharge is recorded here.
  > ⚠️ **DATED NOTE 2026-08-24 — the "DISCHARGED" claim above is CONTESTED as to WHO discharged it, and
  > is left byte-identical.** `0046`'s Build worker reports F4 **still a code-read, not executed** on its
  > side. **See the disagreement table under §*"The finding, and it is no longer a code-read"*.** ✅ **The
  > underlying defect IS independently execution-confirmed on 2026-08-24 by a third producer** — that
  > much is settled; **which earlier report is right about what it ran is not**, and this brief does not
  > decide it. ⛔ **`0046`'s folder was NOT read or edited by that 2026-08-24 check either** — a reviewer
  > was concurrently writing its ledger and it was left alone entirely, so **that plan file's own §7
  > marker is UNVERIFIED BY THIS BRIEF and may still read "unverified" on disk.**
- ⛔ **Filed by a spawned `fkit-producer` with NO owner channel** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):
  **appended, unranked; nothing was re-ranked by this filing and no `## Status` was changed anywhere.**
