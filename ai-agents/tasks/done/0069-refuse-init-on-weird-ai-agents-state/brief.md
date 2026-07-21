# Refuse to run init against a weird `ai-agents/` — symlink, file-where-dir, unreadable

## ID
0069

## Sprint
Sprint 2

## Priority
27

## Status
✅ Done

## Context

`claude/fkit-claude-init.sh:27-32` decides what to do about `ai-agents/` using `[ -e "$dest/ai-agents" ]`.
**`[ -e ]` and `[ -d ]` dereference symlinks** (verified in the investigation), which gives init three
states it handles wrongly — one live today, one live-and-silent today, one that **task 28 makes
reachable**:

| State | What happens now |
|---|---|
| **`ai-agents` is a *dangling* symlink** (points nowhere valid) | `[ -e ]` is **false** → init takes the `else` branch → **`cp -R` refuses** (`File exists` on BSD; `cannot overwrite non-directory` on GNU), **rc=1** → under `set -euo pipefail` init dies. Nothing is written outside the project — but before task 26, a dead init **bricked the launcher**. A live **denial-of-service** bug. |
| **`ai-agents` is a *live* symlink** (points at a real directory elsewhere) | `[ -e ]` is true → init skips, so **today this is unreachable**. But `cp -R` **does** write through a live symlink (verified on GNU coreutils: rc=0, scaffold landed outside the project) — and **task 28 replaces that skip with per-path writes**, which is exactly what makes it reachable. A **prospective** write-outside-the-project bug, and 28 is what arms it. |
| **A *file* named `ai-agents` sits where the directory belongs** | `[ -e ]` is true → init skips, silently, **forever**. The project is broken and fkit never says so. **Live today.** |
| **`ai-agents/` exists but is unreadable** | Undefined; fails somewhere downstream with a confusing error. |

**fkit must never write outside the project it was pointed at.** That is the line this task defends —
**before** task 28 gives the live-symlink case a way to cross it.

> ### ⚠️ Correction (2026-07-14) — this brief shipped on a wrong premise
>
> As originally written, this brief asserted **as established fact** that on a *dangling* symlink,
> `cp -R` "writes the scaffold through the link, to a path outside the project" — a live
> write-outside-the-project bug. **That is false, on every platform tested.** fkit-coder could not
> reproduce it on macOS/BSD `cp` (refuses, rc=1); fkit-reviewer then settled the Linux question in a
> Debian container — **GNU coreutils 9.1 `cp -R` also refuses** (rc=1, outside path never created), and
> **BusyBox refuses too**. Codex confirmed from the GNU manual that the historical write-through
> behavior on that case only occurs under `POSIXLY_CORRECT`.
>
> **No live write-outside-the-project bug ever shipped.** The premise was wrong, it survived into this
> brief, and it was caught by implementation and review — not before. The table above now states what
> is true. **The task itself stands unchanged**: the gate is still correct and still required, for the
> three real reasons above. Only the rationale was wrong, and the false one has been removed rather
> than quietly softened.

Rationale:
[`reports/2026-07-14-migration-mechanism.md`](../../knowledge-base/reports/2026-07-14-migration-mechanism.md)
§8, the **"refuse on weird state"** row — rated **REQUIRED** and owner-ratified. The report frames it as
part of convergence; **it is separable, two of its three cases are bugs on their own merits, and it is
the precondition convergence needs.** Hence its own task.

**Why this ships before task 28 rather than inside it.** 28 turns the one skipped `cp -R` into a
per-path write loop. Every one of those writes inherits the symlink hazard — and the live-symlink case,
inert today only because init skips it, **becomes reachable the moment 28 lands**. Landing the preflight
first means 28 is built on a tree that has already been proven sane — instead of shipping the hazard
and the mitigation in the same commit, where a reviewer cannot tell them apart.

## What to build

A **preflight check on `$dest/ai-agents`**, in `claude/fkit-claude-init.sh`, that runs **before** the
existing `[ -e ]` branch and refuses loudly on any state it does not understand.

**Refuse** (do not create, do not copy, do not proceed with the `ai-agents/` step) when:

1. **`$dest/ai-agents` is a symlink** — of any kind, live or dangling. Test with **`[ -L ]`**, which is
   the one test that does **not** dereference. This must come **first**, before any `-e`/`-d`, because
   those two will lie to you.
2. **`$dest/ai-agents` exists and is not a directory** — a regular file, a device, anything. `[ -e ]`
   true and `[ -d ]` false.
3. **`$dest/ai-agents` is a directory but is not readable/traversable** — `[ -r ]` / `[ -x ]`.

**On refusal:** print a clear, actionable message naming the path and the state found (e.g.
*"`ai-agents` is a symlink — fkit will not write through it. Replace it with a real directory, or move
your tree."*), **skip the `ai-agents/` step**, and **carry on with the rest of init** (agents, skills,
intake, gitignore). A weird `ai-agents/` must not cost the user their agents — and, per task 26, it must
not cost them their session either.

**Refusal is not an error the user must fix to launch.** It is a loud, repeated, honest "I did not
touch this, and here is why." State this explicitly in the message so a user with a deliberate symlink
setup understands nothing is broken and nothing will be.

Everything else in init stays as it is. This task adds a gate; it changes no other behavior.

## Verification steps

Run each against a scratch project directory. These are the cases — check the **filesystem**, not just
the console output.

- **Dangling symlink (live DoS bug — *not* a write-outside bug; see the Correction above).**
  `ln -s /tmp/fkit-nowhere-$$ <proj>/ai-agents`, then run init.
  - **Before the fix:** `cp -R` **refuses** with rc=1 (`File exists` on BSD, `cannot overwrite
    non-directory` on GNU) and `set -euo pipefail` kills init. **`/tmp/fkit-nowhere-$$` is NOT
    created** — do not expect it to be, on any platform. The bug here is the **dead init** (and, before
    task 26, the bricked launcher), not a write outside the project.
  - **After the fix:** init **refuses cleanly** — names the path and the state, **does not die**, and
    **`/tmp/fkit-nowhere-$$` still does not exist.**
- **Live symlink (the one that genuinely writes through — today unreachable, task 28 arms it).**
  `mkdir /tmp/elsewhere-$$ && ln -s /tmp/elsewhere-$$ <proj>/ai-agents`.
  - **Before the fix:** init **skips** (`[ -e ]` is true), so nothing happens. That skip is the only
    thing preventing the write-through; **task 28 removes it.**
  - **After the fix:** init **refuses**; `/tmp/elsewhere-$$` is **empty and unmodified** afterwards.
  - *(If you want to see the hazard for yourself, run `cp -R <scaffold>/. <proj>/ai-agents/` by hand
    against the live symlink — on GNU `cp` it lands in `/tmp/elsewhere-$$`, rc=0. That is what 28 would
    do without this gate. It is **not** what init does today.)*
- **File where the directory belongs.** `touch <proj>/ai-agents`. Init refuses **loudly** — the current
  behavior (silent skip forever) is the bug. Confirm the message actually names the problem.
- **Unreadable directory.** `mkdir <proj>/ai-agents && chmod a-rx <proj>/ai-agents`. Init refuses
  cleanly rather than failing with a confusing downstream error. *(Remember to `chmod` it back.)*
- **The two normal cases are untouched.** (a) Fresh project, no `ai-agents/` → still created from the
  scaffold, exactly as before. (b) Project with a real `ai-agents/` directory → still left as-is,
  exactly as before. Neither path may regress; they are 100% of real traffic.
- **Refusal does not abort the rest of init.** In every refusal case above, confirm
  `.claude/agents/fkit-*.md`, `.claude/skills/fkit-*/`, `.fkit/interview`, and the `.gitignore` entries
  are all still written.

## Notes

- **Owner: fkit-coder.**
- **Depends on:** nothing hard. **Sequence with task 26** — refusal must warn-and-continue, which is the
  same discipline 26 establishes at the launcher boundary. Landing 26 first makes this one's "carry on"
  behavior trivially correct.
- **Blocks: task 28.** Convergence writes per-path into `ai-agents/`; every one of those writes needs
  this gate in front of it.
- **`[ -L ]` first. This is the whole trick.** The bug exists precisely *because* the obvious tests
  (`-e`, `-d`) dereference. Any fix that reaches for them before `-L` reintroduces it.
- **No ADR.** Defect fix + a safety precondition already ratified by the owner as part of the §8 bar.
- Risk: **low** to implement, **high** if skipped — this is the only thing standing between task 28 and
  fkit writing into a directory the user never pointed it at.
