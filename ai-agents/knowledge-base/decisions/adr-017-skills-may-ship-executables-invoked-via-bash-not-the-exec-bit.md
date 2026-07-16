# ADR-017: Skills may ship executables — invoked via `bash <path>`, never the exec bit

- **Status:** **accepted**
- **Date:** 2026-07-16
- **Deciders:** owner (Mark Dolbyrev), recorded by fkit-architect in session
- **Came from:** [`reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md`](../reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md)

## Context

`claude/skills/fkit-status/dashboard.sh` will be **the first executable fkit ships to a consuming
project for a skill to shell out to.** Verified 2026-07-16: `find claude/skills -type f ! -name
'SKILL.md'` returns **nothing** — every skill in the tree is, today, pure markdown. This is a new
class, and it is outside the scope of [ADR-014](adr-014-how-fkit-tests-itself.md), which governs
**repo-root test infrastructure that cannot reach consumers** — the opposite calculus.

Four forces make this a real decision rather than a file drop:

1. **The ship path works, but only from one directory.** `install.sh:43` is
   `cp -R "$TMP/src/claude" "$SHARE/claude"` — **only `claude/` is copied**. `fkit-claude-init.sh:227`
   then does `cp -R "$here/skills/fkit-"* "$dest/.claude/skills/"` — **whole directories**, so a
   non-`SKILL.md` file rides along. A shipped executable is therefore possible **only** under
   `claude/`, and it arrives at `.claude/skills/<skill>/` in the consuming project.

2. **⚠️ The exec bit does not survive, and nothing says so.** `install.sh:44-46` `chmod +x`'s a
   **hardcoded list of two filenames**:
   ```sh
   for s in fkit-claude.sh fkit-claude-init.sh; do
     [ -f "$SHARE/claude/$s" ] && chmod +x "$SHARE/claude/$s"
   done
   ```
   Any other script gets **no chmod**, and rides a GitHub tarball + `cp -R` chain that does not
   guarantee the bit (`cp` applies the source mode **modified by umask**; the tarball is the upstream
   variable). **That the installer chmods at all is the evidence the bit was already not trusted for
   the two scripts fkit cannot run without.**

   The failure this produces is the worst available shape: **it works on the developer's machine and
   fails on some consumers'** — an umask- and tarball-dependent break, in code that runs unattended,
   reported as "fkit is broken" with no local reproduction.

3. **fkit's own test scope is deliberately fenced.** ADR-014 §Decision 2 states the scope is *"exactly
   two things"* — the argv handed to `claude`, and the `skillOverrides` map — and *"it stays this
   size"*. A shipped executable is testable, is a pure function, and **should** be tested; but doing so
   **widens a fence an ADR put up on purpose.** That widening needs recording, or the next reviewer
   reads the board-renderer test as a scope violation and re-litigates it.

4. **A shipped executable is a consumer-side runtime assumption.** The thing ADR-014's
   `install.sh:43` fact protected — *"repo-root test infrastructure is physically incapable of reaching
   a consuming project"* — **is inverted here by design.** This code is *meant* to reach them.

## Decision

**Skills may ship executables.** Four rules, binding on this and every future one:

1. **Placement:** inside the skill's own directory under `claude/skills/<skill>/`. Nowhere else —
   `install.sh:43` copies only `claude/`, and colocation is what makes the init `cp -R` carry it.

2. **⚠️ Invocation is `bash <path>`, never `./<path>` — and never a shebang relied upon.** The skill
   invokes from the project root:
   ```sh
   bash .claude/skills/fkit-status/dashboard.sh <args>
   ```
   **This is the exec-bit mitigation and the only one adopted.** It sidesteps the bit entirely and
   requires **no change to `install.sh`** — the `curl | sh` entry point and the highest-blast-radius
   file in the repo (`architecture.md:374-378`).

3. **Consumer runtime assumption: `bash`, and nothing more.** No new PATH assumption may be added by a
   shipped skill executable without a new decision. Node in particular is **not** available to reach
   for here merely because ADR-014 permitted it for **repo-root tests**.

4. **Shipped executables are in scope for the test suite, widening ADR-014 §2.** They are pure
   functions of (argv, project files) → (stdout, exit code), tested black-box at repo root under
   `test/`, per ADR-014's still-binding §1 (never ships) and §4 (zero devDeps). **ADR-014 §2's "exactly
   two things" is now three:** argv to `claude`, the `skillOverrides` map, and **the stdout contract of
   a shipped skill executable.** Nothing else about ADR-014 changes.

## Options considered

- **`bash <path>` invocation, no installer change (chosen)** — the mitigation is local to the skill
  that needs it, costs one word, cannot regress, and touches nothing with blast radius. Its only cost
  is that the shebang line becomes decorative, which is a documentation problem, not a runtime one.

- **Extend `install.sh`'s chmod list** — **rejected.** It edits the `curl | sh` entry point — the file
  whose breakage *"breaks installation itself, including the self-update path that would ship the fix"*
  (`sprint-2.md:89-91`) — for **zero gain** over rule 2. It is also a **hardcoded list**: every future
  shipped script must remember to join it, and forgetting is silent. Rule 2 has no list to forget.

- **`chmod +x` in `fkit-claude-init.sh` instead** — **rejected**, same trade, plus it puts a mutation
  in the every-launch path for a problem `bash <path>` deletes.

- **`find … -name '*.sh' -exec chmod +x`** in the installer — **rejected.** It fixes the forgetting
  problem but broadens the installer to chmod files by pattern, unattended, in the user's share dir.
  More surface, still zero gain over rule 2.

- **Ship no executables; keep everything prose** — **rejected, and it is the status quo this
  overturns.** It is precisely what makes `/fkit-status`'s roll-up a *"counts must sum to M"*
  instruction (`claude/skills/fkit-status/SKILL.md:198-201`) rather than an invariant. fkit's stated
  failure mode is **silent-wrong** (ADR-014 §Context 1), and an LLM hand-counting a table is that
  failure with a worked example attached.

- **Node for the shipped script** — **rejected here** (design spec §4.3). ADR-014's node precedent is
  for **repo-root infra `install.sh:43` cannot ship**; a consumer-side script inverts that calculus and
  adds a PATH assumption fkit does not currently make. *(This is the reasoning most likely to be
  re-derived wrongly: "ADR-014 chose node" is true and does not apply.)*

## Consequences

- **Positive:** a skill can now compute what it used to recite, which is the only real fix for
  silent-wrong LLM arithmetic. The exec-bit trap — an umask-dependent break that reproduces on nobody's
  dev machine — is closed **by construction**, with no change to the installer. The ADR-014 scope
  widening is recorded once, here, so the board-renderer test does not read as a violation.

- **Negative / costs:**
  - **The shebang in a shipped script is decorative and misleading.** Someone will run `./dashboard.sh`
    locally, it will work on their machine, and they will conclude rule 2 is superstition. The rule
    must therefore be stated **in the skill and in the script's own header comment**, with the
    `install.sh:44-46` citation — not just here.
  - **`SKILL.md` and the script become a mirror pair that can drift** — a parse contract on one side, an
    output format on the other. A fourth mirror, in the class ADR-014 §Deferred already flags. The
    output's version marker (`⟦fkit-dashboard v1⟧`) makes the drift *visible*; it does not prevent it.
  - **fkit now has consumer-side code that is not markdown.** The review surface grows.

- **Residual risks / "re-raise only if":**
  - **a shipped skill executable needs something beyond `bash`** — that is a new consumer PATH
    assumption and rule 3 sends it back to the owner. It is not the implementer's call;
  - **`install.sh` ever grows a general chmod pass** (e.g. for another reason entirely) — rule 2's
    justification weakens and the `./<path>` question may be reopened. **Not before**;
  - **test infrastructure ever becomes something a consuming project installs** — ADR-014 flags this as
    inverting its own foundation, and rule 4 would have to be re-derived with it;
  - **a shipped executable ever needs to write** — everything here assumes read-only (the `/fkit-status`
    script reads two file kinds and writes nothing). A writing executable in a user's project on an
    unattended path is a different decision, and it is the class that produced ADR-015's invariant.

## Related

- [`reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md`](../reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md)
  — the design this generalizes; §4.4 (invocation), §4.6 (the scope widening).
- [ADR-014](adr-014-how-fkit-tests-itself.md) — §1, §4 still bind; **§2's fence is widened by rule 4**;
  its `install.sh:43` fact is the foundation both rest on.
- [ADR-011](adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md) — `package.json` scope,
  no `bin` field.
- `install.sh:43` (copies only `claude/`), `install.sh:44-46` (**the hardcoded chmod list — the whole
  reason for rule 2**).
- `claude/fkit-claude-init.sh:227` (`cp -R skills/fkit-*` — whole directories, which is what carries a
  non-`SKILL.md` file).
- `claude/skills/fkit-status/SKILL.md:198-201` — the *"counts must sum to M"* instruction this class of
  change exists to turn into an invariant.
- `ai-agents/tasks/done/build-deterministic-dashboard-script-for-fkit-status.md` — the first
  implementation under this ADR.
</content>
