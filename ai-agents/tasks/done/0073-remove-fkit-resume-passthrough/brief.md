# Remove `fkit --resume` and the blanket arg-passthrough

## ID
0073

## Sprint
Sprint 2

## Priority
18 *(same class as the Omnigent removal — sequenced **after tasks 2 and 4**; see Notes)*

## Status
✅ Done

## Context

**`fkit --resume` is Omnigent scar tissue, not a feature.** It exists because the Omnigent flavor's
session model was a **durable, long-lived root** that had to be re-attached — and the runner had known
disconnect bugs (see `ai-agents/wiki-vault/wiki/systems/subagent-runner-connectivity.md`, and the
`reconnect` / `restart-team` verbs still wired into `install.sh:93`). In the Claude-native flavor a
role session is just `claude --agent fkit-<role>`; **the durable-root/reconnect problem it worked
around no longer exists.** `claude/README.md:117` already says as much: *"Claude Code owns its sessions
(`claude --resume`); there is nothing to reconnect."*

**Owner decision (2026-07-11), verbatim:** *"Ask the producer to create a task for removing the
`fkit --resume` thing (it was created to work around the limitations and bugs of omnigent)."*

**This supersedes the earlier triage.** fkit-coder's adjacent finding on task 17 framed this as a
defect with two candidate fixes — *persist the resumed session's role* vs *require a role before
`--resume`*. **The owner rejected both.** The disposition is **removal**. Do not reopen the
persist-vs-require question; do not build a replacement.

### What the code actually does today

The behavior is not a `--resume` flag — **there is no `--resume` handling anywhere.** It is an
unintended consequence of a **blanket passthrough of any unrecognized first argument**:

1. `install.sh:89–95` — the `$BIN/fkit` wrapper matches `omnigent` / `update|upgrade|reconnect|restart-team`
   / `claude`. `--resume` matches none, so argv falls through to `claude/fkit-claude.sh`.
2. `claude/fkit-claude.sh:64–69` — `--resume` is not a role, so `role` stays empty and **nothing is
   shifted**.
3. `:153` — the menu is skipped, because it requires `[ "$#" -eq 0 ]`.
4. `:190` — *"No role, not interactive (piped/CI, or extra args given) → the team room is the safe
   default"* sets `role="lead"`.
5. `:199` — `exec claude --agent fkit-lead --settings .fkit/settings/lead.json --resume`.

**So `fkit --resume` silently resumes any session — a coder session included — as `lead`:** lead's skill
lockdown, no `Write`/`Edit`. The user gets their conversation back and their role taken away, with no
warning.

## What to build

**The removal is (b): drop the blanket unrecognized-arg passthrough** — not a doc-only edit (that would
leave the silent `lead` resume in place), and not a `--resume`-specific special case (there is no
`--resume` code to delete; special-casing one flag leaves every *other* stray arg on the same broken
path).

1. **`claude/fkit-claude.sh` — arg parsing.** When **no role was named** and **args remain**, that is a
   **usage error**, not a lead session: print `fkit: "<arg>" is not a role.` plus the role list, and exit
   non-zero.
   - **Preserve the legitimate `lead` default at `:190`** for the *no-args, no-tty* case (piped / CI). Only
     the *"extra args given"* half of that branch goes away. Split the condition so this is explicit.
   - **Keep passthrough *after* a named role** (`fkit coder --debug …` → `"$@"` post-`shift`). That path is
     intentional and is not in scope.
   - Establish the **final known-verb set** from the code as it stands when you pick this up — roles, plus
     whatever verbs tasks 2 and 4 leave on the Claude script (`update` at minimum). An unrecognized-arg
     error that rejects `fkit update` is a regression; see Notes.

2. **`claude/fkit-claude.sh` — the two places that advertise it.** Both are stale the moment step 1 lands:
   - `:10` — header comment `fkit --resume  # any other arg is passed straight through to claude`
   - `:57` — `--help` text: *"Anything that isn't a role is passed through to `claude` (e.g. `fkit --resume`)."*
   Delete both claims. Do **not** replace them with a "use `claude --resume` instead" tip — the owner did
   not ask for a replacement, documented or otherwise.

3. **Grep the rest of the surface and clean only what is now false.** Confirmed mentions:
   `README.md:39` (*"Come back tomorrow and `fkit` resumes the exact same workspace"* — an **Omnigent**
   claim; it is **task 8's** to rewrite, leave it), `claude/README.md:117` (already correct — describes the
   absence, keep it), `claude/skills/fkit-wiki-sync/SKILL.md:71` (unrelated use of the word "resume").
   Re-grep at pickup; touch nothing that is merely adjacent.

## Verification steps

- `fkit --resume` **errors with a usage message and a non-zero exit** — it does not launch a session.
- `fkit --anything-unrecognized` does the same. No stray arg reaches `claude` without a role.
- `fkit` (bare, on a tty) still shows the **role menu**; `fkit coder` still goes straight to the coder.
- `fkit` with **no args and no tty** (`fkit </dev/null`, or piped) still lands on **`lead`** — the CI
  default is intact.
- `fkit coder --resume` still reaches `claude` with the arg (role named ⇒ passthrough). **Establish from
  the run whether it does the right thing**: `--agent fkit-coder` re-applied over a resumed transcript, with
  the coder's skill settings. If it does, nothing further is needed. **If it silently resumes a session
  belonging to a different role under the coder's lockdown, do not fix it here — raise it** (see Open
  questions).
- Whatever verbs survive tasks 2/4 (`fkit update` at minimum) still work — the new error branch must not
  swallow them.
- `fkit --help` no longer mentions passthrough or `--resume`.

## Notes

- **Owner: fkit-coder.** Diagnosed by fkit-coder as an adjacent finding on task 17; triaged to removal by
  the owner on 2026-07-11.
- **Risk: low. Blast radius: the front door.** One file, ~10 lines. But it is the argv path every single
  `fkit` invocation walks, and the failure mode is *"a verb the user relies on now errors."* The verb
  inventory is the whole job here; the code is trivial.
- **Sequencing — after tasks 2 and 4, not before.** This is the same extract → build → rewrite → delete
  class as tasks 1–5, and it collides with two of them:
  - **Task 4 (installer rewrite)** rewrites the `$BIN/fkit` wrapper heredoc — the dispatcher that decides
    which args ever reach `fkit-claude.sh`. Removing the passthrough underneath a wrapper that is about to
    be rewritten means doing the analysis twice.
  - **Task 2 (self-update)** decides where `fkit update` lives once `omnigent/fkit.sh` stops owning it.
    **The known-verb set this task must enumerate is not final until task 2 lands.**

  **It is not folded into either.** It is independently shippable (owner's smallest-shippable rule), it is
  a *behavior* removal rather than a *file* deletion, and burying it inside the sprint's highest-risk task
  (4) would hide it in that diff. **If the coder is already inside `fkit-claude.sh` for task 4, landing it
  in the same pass is fine** — say so in the commit; don't let it disappear.
- **Not blocked on task 5** (`delete-omnigent-directory`) — nothing here reads `omnigent/`.
- **No ADR.** Removing a workaround for a runtime that ADR-009 already retired is execution of that ADR,
  not a new decision.

## Open questions

1. **Does removal leave a real gap?** If a user wants their previous coder conversation back, the
   supported answer is now `fkit coder --resume` (role named, arg passed through) or plain
   `claude --resume`. **The verification step above establishes whether `fkit coder --resume` actually
   holds the role.** If it turns out `--resume`'s interactive picker lets a user select a *producer*
   session and get it under the *coder*'s agent and lockdown, that is the same class of bug one level
   down — **flag it to the owner as a new question; do not extend this task to fix it.**
