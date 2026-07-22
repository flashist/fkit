# Wiki resync for the eighth role — after the source docs land

## ID
0092

## Sprint
Sprint 2

## Priority
84

## Status
✅ Done

## Context

### 🔴 Read this first: the premise this task was filed under was WRONG, and the corrected version is a different task

**This brief was requested as "the vault asserts a seven-role team while the docs assert eight — resync
it."** That was checked against the vault before scoping, **and it is not true. The vault is already
correct, and has been since the 2026-07-19 sync.** What it actually carries:

- **`wiki-vault/index.md:11`** — *"The Claude Code native + Codex agent team: **seven roles built, an
  eighth authorized** (ADR-028)"*. **Already accurate, already decided-not-built aware.**
- **`wiki/systems/fkit.md:9`** — a full ⚠️ callout: *"An eighth role is decided but not built…
  **Verified 2026-07-19: `claude/agents/` holds seven files** — no tester agent, skill, lockdown entry
  or launcher wiring exists… **Seven is the tree; eight is the plan.**"*
- **`wiki/systems/fkit.md:17`** — heading annotated *"### The seven roles (built; an eighth is
  authorized — see the note above)"*.
- **`wiki/systems/fkit.md:73`** — already handles the ADR-023 count claim: *"ADR-023's 'the team stays
  seven' is **no longer current**… **The commit/push ruling itself is untouched**; only the count claim
  moved."*
- **`wiki-vault/log.md:208`** records the wiki re-verifying exactly this on its last run and concluding
  **"No page needed a correction."**

**Where the false premise came from: [ADR-028:165](../../../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md)**,
which named these vault pages as stale and *"not the architect's to fix"*. **That was true when ADR-028
was written. The wiki synced afterwards and fixed them.** The ADR is a dated record, not a live status
board — and it was read as the latter. **The handed-over line numbers were also wrong**
(`fkit.md:15` is the `## Architecture` heading; the real sites are `:7`, `:9`, `:17`).

> **This is the fifth instance in one day of the failure the
> [`add-worked-example-to-evidence-before-assertion`](../../backlog/0013-add-worked-example-to-evidence-before-assertion/brief.md)
> task is being widened to document** — and the first where the stale source was *an ADR being used as
> current state*. Logged here deliberately: it is a **new sub-variant** worth the convention author's
> attention. **A decision record tells you what was true when it was decided; only the artifact tells
> you what is true now.** Had this brief been filed as requested, it would have sent fkit-wiki to
> "fix" pages that are already right.

### The real work — which is the mirror image, and only exists *after* 82/83/81-D land

**`wiki/systems/fkit.md:9` contains a live tracking claim about the source docs:**

> *"`PROJECT.md:8`, `:71-72`, `architecture.md:4`, `:82` and a hard-coded literal at
> `claude/fkit-claude-init.sh:847` still assert seven and are **now false** — an owner/producer
> follow-up, not the wiki's to fix."*

**That sentence is accurate today and becomes false the moment those tasks land.** The vault would then
be telling every agent that documents still assert seven, when they no longer do — and the vault is
what agents read to ground themselves, so a stale claim there propagates into other agents' reasoning.
**That is the resync this task is actually for.**

**So the sequencing instruction was right, for a different reason.** Not *"don't sync before the docs
are fixed or you'll ingest drift"* — the vault has no drift to ingest. It is *"the vault is currently
tracking the docs' staleness, and that tracking note expires when the staleness does."*

## What to build

- **Resync `wiki/systems/fkit.md` and `wiki-vault/index.md` against the corrected source docs**, once
  tasks 82, 83 and 81 Part D have landed. Specifically:
  - **`fkit.md:9`** — the *"still assert seven and are now false"* tracking list must be **updated or
    retired** to reflect which sites were corrected and by which task. If all land, the follow-up it
    names is discharged and should say so.
  - **Re-verify the built-vs-decided claim rather than carrying it forward.** `claude/agents/` may or
    may not still hold seven files by then — **count them; do not copy the previous run's number.**
    ADR-028's tester is sequenced behind a CI gate, so it is *likely* still seven, but likely is not
    verified.
  - **`fkit.md:7`** — the Summary sentence still opens *"a team of **seven** role-scoped AI agents"*
    with the qualifier a line below. **Judge whether that is still the right shape** once the source
    docs read eight-with-a-caveat; a summary that disagrees with its own callout is the kind of thing
    a reader skims past the caveat on. **This is a judgment call, not a defect — do not treat it as one.**
  - **`fkit.md:73`'s ADR-023 parenthetical** — task 82 adds a real pointer inside ADR-023 itself. Check
    whether the vault's paraphrase should now cite it.
- **⚠️ Carry the decided-not-built constraint.** ADR-028, 029 and 030 are all **decided and unbuilt**.
  **The vault must describe an eighth role as decided, never as existing.** The current pages get this
  right — *"Seven is the tree; eight is the plan"* — **and that framing should survive the resync, not
  be flattened into "eight roles" by a well-meaning count update.** A vault page asserting a tester
  role exists would propagate into other agents' reasoning, which is the exact harm used to justify
  sprinting task 82.

## Verification steps

- **`claude/agents/*.md` was counted on this run**, and the number in the vault matches it. Not copied
  from `log.md`, not copied from this brief.
- **No vault page asserts the tester role exists.** Read `index.md` and `systems/fkit.md` as a
  first-time reader: could they conclude an eighth agent is installed and invokable? If yes, it fails.
- **The `fkit.md:9` tracking list matches reality** — every source site it names as *"still asserts
  seven"* is re-checked, and any that were fixed are removed or marked done with their task number.
- **Every source line number cited in the vault resolves to what the vault says it does.** This brief
  was handed three line numbers and one was wrong; the resync should not propagate that class of error.
- **The decided-not-built framing survives.** Diff the callout at `:9` and the heading at `:17` — if
  the qualifier weakened, that is a regression regardless of what else improved.

## Notes

- **Owner: fkit-wiki.** Only fkit-wiki writes `ai-agents/wiki-vault/` (ADR-005, and the hard rule in
  `CLAUDE.md`). **Nobody else may touch these pages**, including to "just fix the count".
- **⚠️ Depends on tasks 82, 83 and 81 Part D — this is a real dependency, not a preference.** The work
  is *reconciling the vault against corrected docs*; running it first would reconcile against
  uncorrected ones and achieve nothing. **Precedent: Sprint 2 task 11**, and the standing note at
  `sprint-2.md:209` — *"Task 11 (wiki sync) is genuinely last. Syncing before the docs are rewritten
  just ingests the drift."*
- **Deliberately NOT folded into [task 78](../0099-wiki-sync-task-folder-migration/brief.md).** 78 waits out the
  whole 75 → 76 migration. Different subject matter, and a much longer timer. **This is independently
  shippable** once its three dependencies land.
- **Scope is small and may turn out to be near-zero.** If 82/83/81-D land cleanly, this could be a
  single edit to the `:9` callout. **That is a success, not a reason to skip it** — the tracking claim
  is load-bearing precisely because agents read the vault as current truth. **Equally: do not invent
  work to justify the task.** If a page is already right, the correct action is to verify it and record
  that no change was needed, as `log.md:208` did.
- **Risk: low.** No runtime surface. The real risk is a resync that *weakens* correct pages — see the
  decided-not-built warning.
- **Evidence sources:** `ai-agents/wiki-vault/index.md:11`; `ai-agents/wiki-vault/wiki/systems/fkit.md:7,:9,:17,:73`;
  `ai-agents/wiki-vault/log.md:208`; `adr-028-…md:165`; `ai-agents/sprints/sprint-2.md:209` (task 11
  precedent). **All read on 2026-07-19, not recalled.**
