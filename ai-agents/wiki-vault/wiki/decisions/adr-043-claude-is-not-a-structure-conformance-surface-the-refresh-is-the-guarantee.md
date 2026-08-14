# ADR-043: `.claude/` is not a structure-conformance surface — the unconditional refresh is the guarantee

**Date**: 2026-08-13
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md`
**Task**: `0255` — *Decide whether `.claude/` enters the structure-conformance surface*
**Owner sign-off**: **required and given** — the fkit owner, in person, 2026-08-13, via
`AskUserQuestion` in a live `fkit lead` session; verbatim option label **"Sign off — Option 4"**

## Context

**Nothing anywhere checks whether a project's `.claude/` matches the installed fkit version** — and
the ADR's own re-derivation on 2026-08-13 found the reason is not an unfunded gap but a tree the
conformance design never looked at.

- **The spec has zero `.claude` rows.** `grep -c '\.claude' claude/structure-spec.md` → **0**, across
  48 inventory rows. *(Re-measured by this ingest, 2026-08-13: still **0**.)*
- **The spec inventory is the check's entire input.** `claude/skills/fkit-heal/check.sh` pins the
  contract verbatim — *"one line per spec-inventory row, in table order"*. **A path absent from the
  tables is a path the check cannot see.**
- **The manifest cannot cover it either.** `bin/generate-structure-manifest.mjs`'s
  `workingTreeFiles()` walks `claude/scaffold/` only; agents and skills ship from `claude/agents/`
  and `claude/skills/`, which the walk never reaches.
- **Staleness is handled bluntly and silently.** `claude/fkit-claude-init.sh` does
  `rm -f .claude/agents/fkit-*.md` + `cp`, and `rm -rf` each `.claude/skills/fkit-*/` + `cp -R`,
  printing **one count line** — no per-file verdict, no comparison, no report.
- **The paths are gitignored** — the ignore entries read literally *"fkit-managed agents"* and
  *"fkit-managed skills"*.

### The trap that makes it more than a coverage gap

A project whose owner ran `fkit update` but **never re-launched `fkit` there** keeps stale agents and
skills with **no signal**. The launch notice cannot fire, because **the launch is the same event that
refreshes them** — init runs early in `claude/fkit-claude.sh`, `structure_notice` is called ~149 lines
and one full refresh later. **The notice can only ever read clean.**

### `.claude/` was never considered, and its semantics are the *inverse* of `ai-agents/`

`grep -c '\.claude'` returns **0** for ADR-039, **0** for the structure-check design report, and **0**
for ADR-015. **There was no prior ruling to be consistent with and no rejected alternative to
reopen.** `ai-agents/` is governed by ADR-015's *create-if-absent only; no overwrite, no move, no
delete, ever* — which is exactly why conformance there needs a spec, a manifest, and consent-gated
repair. `.claude/`'s fkit-managed paths are the **inverse**: init deletes and overwrites them
unconditionally, every launch, on a gitignored tree.

## Decision

**`.claude/` is deliberately NOT a structure-conformance surface.** The unconditional refresh is the
guarantee. **No spec row, no manifest row, no new class, no new check.**

⚠️ **`claude/structure-spec.md` keeps zero `.claude` rows by DECISION, not by omission.** This is the
sentence that closes `0255`'s finding that the tree *"was never considered"*. A future reader — or a
future review — encountering the absence must read it as **ruled**, not as an oversight awaiting
correction.

### The strongest argument, stated as such: the refresh is *stronger* than conformance

⛔ **Not a concession that `.claude/` gets a weaker guarantee for less machinery.** On **deletion** it
gets a **strictly stronger** one:

- Under **ADR-015's invariant**, a file fkit stops shipping **lingers under `ai-agents/` forever**.
  Delete is forbidden; `/fkit-heal` can only ever **report** it.
- Under `.claude/`'s refresh, **a retired agent or skill is gone automatically on the next launch** —
  no report, no consent step, no owner action.

*Bringing `.claude/` under the conformance surface would be describing a stronger guarantee in a
weaker vocabulary.*

**Every supported entry point refreshes first** — `fkit`, `fkit <role>`, and `FKIT_SETUP_ONLY=1 fkit`
all run init before anything else. **There is no supported path into an fkit session that does not
pass through the refresh.**

### Options weighed — all four, the three rejected on their real costs

| Option | Verdict | Why |
|---|---|---|
| **1** — extend spec + manifest to `.claude/fkit-*` | **REJECTED** | Genuinely elegant (new rows reach both consumers with zero new code), but four compounding costs: the manifest answers *"may fkit overwrite this?"*, whose answer here is unconditionally **yes** — **"owner-edited" is not a state that survives a launch**; the payload is **36 files per release** against a **66-row** entire-history manifest; it needs a **seventh class**; and `test/structure-spec.test.js`'s **bidirectional set equality** fails in both directions. ⛔ **And after all four costs, it reports nothing** — the refresh precedes the notice, so every row reads `conforming` |
| **2** — report at launch, before the refresh | **REJECTED** | The sharpest of the three — the only point where the divergence is real *and* visible. But it adds logic to the one `set -euo pipefail` script that must never brick a launch, **reports a fault fkit repairs in the next statement** (against the notice's own *"nobody runs what nobody is told to run"* contract — here there is nothing to run), and fires on every launch after every update with near-zero actionability |
| **3** — report out-of-band (`/fkit-heal` or a new check) | **REJECTED** | Cannot exist without Option 1's rows or a parallel comparison engine inside a one-contract script; ⚠️ **not actually out-of-band** — its only realistic invocation is inside a session, and every session was preceded by the refresh; and **it has no repair to offer** (the repair is *"re-launch"*, which the owner already did to get there) |
| **4** — not a conformance surface at all | ✅ **ACCEPTED** | **It is already true**; the deletion argument above; the gap that was real is closed by `0253`'s README prose; **zero cost** — no spec row, no manifest row, no seventh class, no test change, no init risk |

⚠️ **A fifth framing preserved, not built:** all four options answer by **checking state**, but the
question an owner actually has — *"did my `fkit update` reach this project?"* — is about an **event**,
and is cheaper as **provenance than as conformance**.

## Consequences

- **C1 — Explicitly unaffected**, stated so a later reader does not hunt for edits this decision did
  not make: `claude/structure-spec.md`'s pinned machine-read contract, `test/structure-spec.test.js`,
  `claude/structure-manifest.tsv` + its generator, `claude/skills/fkit-heal/*`,
  `claude/fkit-claude-init.sh` and `claude/fkit-claude.sh` — **all unchanged**.
- **C2 — ⛔ ADR-015's invariant is NOT touched and NOT amended.** It governs `ai-agents/` and
  **neither extends to `.claude/` nor needs to** — the invariant forbids overwrite and delete, and
  `.claude/`'s whole mechanism *is* overwrite and delete. This ADR **records that boundary; it does
  not move it**.
- **C3 — ⛔ ADR-039 is NOT touched and NOT amended.** The consent-gated repair stays scoped to the
  spec inventory (`ai-agents/**` plus the two root context files).
- **C4 — The implementation thread ENDS rather than defers.** `0255` listed itself as blocking *"the
  (unwritten) implementation brief for `.claude/` conformance"*. ⛔ **Under this decision that brief is
  never written** — and the owner was told so in those terms **before** signing off. *The most
  consequential consequence of the ruling.*
- **C5 — Absence is now evidence of a decision.** Anyone finding zero `.claude` rows in the spec must
  read this ADR before proposing to add them.
- **C6 — `README.md:54` must be scoped; a follow-on docs brief.** The line promises a divergence
  signal for *"your project's fkit-managed structure"* — a phrase the repo's own gitignore comments
  put `.claude/` **inside**, so it appears to promise exactly what `README.md:39` says nothing tells
  you. ⚠️ **The obvious remedy is itself wrong — do not apply it**: scoping the line to `ai-agents/`
  would **under-describe** the check, because **Table B includes the root `CLAUDE.md` and
  `AGENTS.md`**, which are not under `ai-agents/`. ⛔ **Not applied in the ADR** (`0255`'s
  no-implementation fence); owner-ruled **"Its own follow-on brief"**.
  > ✅ **DISCHARGED 2026-08-14 — `README.md:54` is NO LONGER WRONG.** The bullet above is left
  > **byte-identical** as the record of the decision. The follow-on brief it ruled for is **`0292`**,
  > and its edit is committed in `ce6bf54`. The line now scopes the signal to *"your project's
  > `ai-agents/` tree, or its root `CLAUDE.md` / `AGENTS.md`"* and adds an explicit parenthetical that
  > **the fkit agents and skills under `.claude/` are not part of that check, because a launch rewrites
  > them outright, so there is nothing to diverge.** ✅ **It avoided the wrong remedy this bullet warned
  > about** — it did **not** scope the line to `ai-agents/` alone, so Table B's root `CLAUDE.md` /
  > `AGENTS.md` are still described.
  > ⚠️ **`0292`'s brief close is staged in the working tree but NOT committed** at the time of this
  > write, so this sync did **not** ingest `0292` as a done task; only its landed effect on `README.md`
  > is recorded. The row is flagged for the next sync.
- **C7 — A refresh *receipt* is PERMITTED, not required.** The ruling rules out `.claude/` as a
  **conformance surface**; it does **not** forbid init recording what it refreshed *from*, as
  **provenance rather than classification**. ⛔ **Nothing is being built and nothing is filed** — the
  clause exists solely so a future reader cannot misread *"not a conformance surface"* as *"no
  signal, ever."* Owner-ruled verbatim **"Record it in the ADR as permitted, not required"**.

### Residuals — conceded, not argued away

- **R1 — a project entered without `fkit` keeps stale agents and skills, unobserved.** Real. But
  **fkit has already declined that mode**: the launcher refuses an unroled session, verbatim *"it
  would fail OPEN … Refusing is the safe answer."* Staleness in a mode fkit refuses to create is the
  cost of entering outside the launcher, **not a conformance gap**.
- **R2 — there is no retrospective signal.** The owner is never told their last N sessions ran on old
  agents. Low value; better answered by C7's receipt than by a check.
- *(Checked and discarded as a third residual: a partially-failed refresh — already covered by init's
  `set -euo pipefail` abort plus the launcher's loud "missing or stale" warning.)*

### Re-raise only if — four properties, none true today

1. `.claude/fkit-*` **stops being unconditionally overwritten** (e.g. fkit starts *merging* into an
   agent file, or honoring an owner edit there) — then `owner-edited` becomes real and the manifest
   earns its price.
2. `.claude/fkit-*` **stops being gitignored** — a tracked tree carries diffable owner intent.
3. **A supported entry path appears that does not run init first.**
4. **The refresh becomes non-atomic** in a way the launcher's setup-failure warning does not cover.

⛔ **Do not re-raise on:** the absence of `.claude` rows in the spec, their absence from the manifest,
or the observation that the launch notice never reports `.claude/`. **All three are this decision,
working as ruled.**

## Related
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the `ai-agents/`
  create-if-absent invariant. **Not touched, not amended** (C2); this ADR records where its scope ends
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the
  licensed consent-gated repair. **Not touched, not amended** (C3); contains **zero** `.claude`
  matches — the tree was never considered there
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why this ADR's vault ingest is a
  separately-filed task (`0293`) rather than part of the decision
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the role lock that makes an unroled
  session unsafe, which is why R1's entry path is **unsupported** rather than merely undesirable
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]] — version bumping is
  load-bearing; the same distribution model that makes `.claude/` gitignored and refreshed
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — task `0255`, the decision
  task this ADR discharges
- [[tasks/state-the-per-project-relaunch-step-fkit-update-requires]] — task `0253`, which shipped this
  decision's **premise** (the README re-launch prose) and deferred the `:54` reconciliation to it
- [[tasks/design-the-post-update-structure-check]] — the design behind the conformance surface;
  **zero** `.claude` matches
- [[systems/install-and-self-update]] — the launcher, init refresh, and self-update this ADR reasons over
- [[systems/launch-convergence-and-init]] — the ADR-015 invariant in practice, and the tree this
  decision draws a boundary against
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board `0255` closed on
- [[tasks/wiki-ingest-of-adr-043-claude-is-not-a-structure-conformance-surface]] — ⚠️ *Added 2026-08-14:* task `0293`, the row that carried this ADR into the vault. Filed rather than run on an owner ruling (**"Batch it — file it, run later"**) to avoid a fourth same-day write to one page; ⛔ **its own "do not touch" constraint was then breached and reverted** by the sync that discharged it
