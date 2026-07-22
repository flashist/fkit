# Gate the symlink escape when init writes the `.fkit/interview` intake

## ID
0046

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**`fkit-claude-init.sh` §4 writes through a symlinked `.fkit/`, landing a file outside the project.**
The first-run intake section does `mkdir -p "$dest/.fkit"`, then `cat > "$dest/.fkit/interview"`, then
`chmod +x` — with **no `[ -L ]` check on any component**. If `.fkit` is a symlink pointing out of the
project, `mkdir -p` silently traverses it and the `interview` script is created **outside the project
fkit was pointed at**.

**Reproduced, not theorized.** Found by the coder while building the test for review finding R1 on task
36 (`remove-fkit-omnigent-orphan-residue`). With `.fkit → /tmp/outside`, init created
`/tmp/outside/interview`.

**This is the third site in one file that needed the same `-L`-before-deref rule.** The rule is already
written down in this repo, in this very file, in §1's own comment (~:159-172):

> *"`[ -L ]` FIRST, ALWAYS. -e/-d DEREFERENCE… we would then mkdir/cp straight THROUGH it, outside the
> project fkit was pointed at. -L is the one test that does not lie."*

That doctrine was applied to **§1 (convergence)** and, as of task 36, to **§6 (orphan cleanup)**. **§4
never got it.** A rule stated in a file's own comments and then missed twice is not three bugs — it is
one doctrine that has no enforcement point. That is what makes this worth more than a one-line patch.

**Why it is not urgent:** the operation is **non-destructive**. It *creates* a file; it never deletes.
No data loss, no rollback problem. That is precisely why it was correctly kept out of task 36 and why
it is filed unsprinted rather than sprinted.

**Scoping provenance:** the coder and the fkit-reviewer **independently** judged this out of scope for
task 36 — different function, pre-existing, and fixing unrelated code inside a review round expands a
diff's blast radius under a review not scoped to it. The reviewer's words: *"cheapness isn't scope."*
That call stands; this brief is its consequence, not a reversal of it.

## What to build

- **Extract the containment check once, above its callers.** Task 36 added `orphan_contained()`
  (`fkit-claude-init.sh:647`) — it walks a path's parent chain and refuses on `-L` at any component,
  which is exactly the check §4 needs. **It is defined at :647; §4 writes at :476** — so it must be
  hoisted (or a shared equivalent extracted) above the first caller. Naming should stop implying
  "orphans"/deletion, since it will now guard a write.
- **Guard §4's intake write with it** — before `mkdir -p "$dest/.fkit"` and before the `cat >`. On
  refusal, **refuse and report**; do not write through the link.
- **Non-fatal**, consistent with §1 and task 26's bar: a refused intake warns and init carries on. The
  intake is optional-by-design already (it skips cleanly when headless), so a refusal must not brick
  the launcher.
- **Message and behavior consistent with §1's existing refusal** — same shape, same tone, names the
  actual cause.
- **Audit the rest of the file for unguarded `$dest`-relative writes — and REPORT, do not fix.** With
  the helper hoisted, sweep for any other site that writes to a `$dest` path without an `-L` check.
  **Fix nothing new under this brief.** Any additional site found is **surfaced to the owner as a
  finding with a recommendation**, and becomes its own decision. See the scope limit in Notes — this
  bullet is a floodlight, not a licence.

## Verification steps

- **The reproducer is closed:** with `.fkit` symlinked to a directory outside the project, run init and
  confirm it **refuses and reports** rather than writing through. The pre-fix behavior — an `interview`
  file appearing at the link target — must not occur.
- **Nothing outside the project root is created — assert it explicitly.** Snapshot a manifest of the
  tree **outside `$dest`** before and after, and require it unchanged. ⚠️ **The existing `manifest()`
  helper in `test/harness.mjs` only walks the project and CANNOT see an escape** — it will pass while
  the bug is live. A test that relies on it alone does not test this defect.
- **The dangling-link case:** `.fkit` a *broken* symlink. `-e` is false for one, so a guard that checks
  existence instead of `-L` will write through and create the target. Confirm refusal.
- **A symlinked component deeper than the leaf** is refused too — the guard walks the chain, it does
  not just test `.fkit` itself.
- **The ordinary case is untouched:** a normal, non-symlink `.fkit` gets its `interview` script,
  executable, exactly as before — and the fresh-project intake flow still runs.
- **Non-fatal:** a refused intake warns and init still completes the rest of setup successfully.
- **No regression at the other two sites:** §1 convergence and §6 cleanup behave exactly as before the
  extraction. Task 36's cleanup tests must still pass unchanged.

## Notes

- **Owner: fkit-coder** — a production init (`fkit-claude-init.sh`) change.
- **🔒 Scope limit — deliberate.** This brief fixes **§4 only**, plus the extraction that serves it. The
  audit bullet **reports**; it does not authorize fixing other sites. Rationale: at least one plausible
  additional site (§5 appending to `$dest/.gitignore`) may be a case where a symlink is **legitimate
  user setup**, and refusing it would break a real workflow. That is a **product decision, not a
  refactor** — it comes back to the owner. Widening the fix inside this brief would repeat exactly the
  blast-radius mistake that (correctly) kept this out of task 36.
- **Relates to: `gate-read-side-symlink-hazard-in-init.md`** — same doctrine, **opposite side**. That
  one is the **read** hazard under `ai-agents/`; this one is the **write** hazard under `.fkit/`.
  **Neither closes the other** — do not mark one done on the strength of the other. If both are picked
  up together, the extracted helper is the natural shared seam.
- **Depends on: task 36** (`remove-fkit-omnigent-orphan-residue`) — **soft, not hard.** It supplies
  `orphan_contained()`. If 36 has not landed, this task writes the helper itself and 36 adopts it; the
  sequencing is a convenience, not a blocker.
- **Risk: low.** Non-destructive (creates, never deletes), and the trigger requires a symlinked `.fkit`
  — not an ordinary state. The **extraction** carries more regression risk than the fix does: it touches
  two working, already-reviewed guards (§1, §6). That is where review attention belongs.
- **Evidence sources:** `ai-agents/reviews/remove-fkit-omnigent-orphan-residue.md` (task 36 review
  ledger — *Coder response* → "Out of scope, surfaced not fixed", and the reviewer's Round 2
  confirmation of the scoping call). Task 36 brief:
  `ai-agents/tasks/backlog/remove-fkit-omnigent-orphan-residue.md`. In-file doctrine statement:
  `claude/fkit-claude-init.sh` ~:159-172.
</content>
</invoke>
