# Fix the unrunnable verify command `bin/release.mjs` prints after a release

## ID
0254

## Sprint
Sprint 5

## Priority
Sprint 5 P12

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**`bin/release.mjs:220` prints a command that cannot work.** On a successful non-dry release it
emits:

```
  Verify: npx github:flashist/fkit#<tag> --version
```

`package.json` has **no `bin` field** (verified 2026-08-08 — the file carries `name`, `version`,
`scripts`, `description`, `license`, `author`, `repository`, `homepage`, `keywords`, and nothing
else), so npx has no executable to resolve. Reproduced 2026-08-08 in a clean-`PATH` temp directory:

```
$ npx --yes github:flashist/fkit#v0.1.29 --version
npm error could not determine executable to run
```

**Cosmetic, and the framing matters.** Nothing depends on this line — no test asserts it, no
downstream script parses it. It is a maintainer-facing print that sends the releaser to a dead end at
exactly the moment they want reassurance the release landed. Fixing it does **not** mean adding a
`bin` field: fkit is deliberately not an npm-installable CLI
([ADR-011](../../../knowledge-base/decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md)
— `bin/release.mjs:66` makes **no npm-registry publish**), and its real distribution is
`curl … install.sh | sh` against `main`.

**Related fact this line quietly misstates.** The printed command implies a tag is installable. It is
not: `install.sh:19` and `claude/fkit-claude.sh:106` both default `FKIT_REF` to `main`, and no
install path resolves a tag. That is the subject of
[`0252`](../0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md);
this task only fixes the printed line.

## What to build

A one-line change in `bin/release.mjs`, in the post-release summary block (`:216-221`).

1. **Replace the `npx …` line with a verification the maintainer can actually run.** Any of these
   satisfies the intent — the coder picks and justifies one in its plan:
   - point at the pushed tag/commit on GitHub (a `git` command against `origin`, e.g. confirming the
     tag resolves), or
   - print the `curl … install.sh | sh` + `fkit --help` path that reflects how fkit is really
     installed, noting it installs `main` HEAD rather than the tag just cut.
2. **Whichever is chosen, the line must not imply a tag is installable** — that is the misstatement
   as much as the broken command is.
3. **Run the command you print, once, before shipping the change.** A verify line that was never
   verified is how this defect arrived. (See
   [`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md).)

### ⛔ Out of scope

- ⛔ **Adding a `bin` field to `package.json`** — that would make fkit an npx-runnable CLI, which is a
  distribution decision, not a print-line fix. If the coder believes it is the right answer, **stop
  and escalate**; do not land it under this brief.
- ⛔ Any other change to `bin/release.mjs` — no bump logic, no tag logic, no added test gate.
- ⛔ Any `ai-agents/wiki-vault/` write (ADR-005).
- ⛔ No commit, no re-rank, no task-file move.

## Verification steps

1. `node bin/release.mjs --dry-run` runs clean, and `grep -n "npx github:flashist" bin/release.mjs`
   returns **no hit**.
2. The replacement command was executed by the coder and its output recorded in the task worklog —
   not asserted, run.
3. `git diff --stat` shows exactly one file changed: `bin/release.mjs`.
4. `grep -n '"bin"' package.json` returns no hit (the out-of-scope boundary held).
5. `npm test` is green.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- Related, and worth landing in the same sprint if either is scheduled:
  [`0252`](../0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md) —
  the release-hygiene record that explains *why* a tag is not an install target. No hard dependency;
  each ships alone.
- Verified 2026-08-08: `bin/release.mjs:220`; `package.json` (no `bin` field); npx failure reproduced
  under a clean `PATH`.
- Filed to the **Backlog** board — no sprint named; no re-rank (ADR-035).

- **⚠️ CARRY CORRECTION, 2026-08-10 — THE CLOSING LINE ABOVE IS NOW FALSE.** *"Filed to the
  **Backlog** board — no sprint named; no re-rank (ADR-035)"* is left **byte-identical**; it was true
  when this brief was filed on **2026-08-08**, and was falsified when the brief was **carried onto
  Sprint 5** by owner ruling of **2026-08-10** (verbatim option label **"Dashboard + all of
  0252-0258"**). The header fields moved in that same act and are the authority:
  **`## Sprint: Sprint 5`**, **`## Priority: Sprint 5 P12`**. **Plan this work against
  [`sprint-5.md`](../../../sprints/sprint-5.md), not the Backlog board.**
  ⚠️ **No drift check fires on this, and none will:** `dashboard.sh` reads the `## Priority`
  **field**, not brief prose, so the machine cannot see a stale closing line — only a reader working
  bottom-up can. Task
  [`0235`](../../backlog/0235-cross-check-a-briefs-status-field-against-its-own-prose/brief.md) covers this
  class generally and is **neither widened nor closed** by this note.
