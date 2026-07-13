# ADR-009: Claude Code native + Codex is the only runtime; Omnigent is removed

- **Status:** accepted
- **Date:** 2026-07-11
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Supersedes:** [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) (dual-runtime)

## Context

[ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) (2026-07-11) made fkit
**dual-runtime**: the original Omnigent bundles under `omnigent/` plus a Claude Code native port
under `claude/`, both operating on the same `ai-agents/` file contracts. It deliberately kept
Omnigent as a peer — "no flavor is deleted until the native port proves itself"
(`adr-008:54`) — and accepted hand-mirroring behavior across both flavors as the cost.

The port has now proved itself, and the cost has come due:

- **The dispatch already inverted in code.** Bare `fkit` runs the Claude flavor; Omnigent was moved
  to the `fkit omnigent` subcommand; `fkit claude` survives only as a legacy alias
  (`install.sh:87-103`). Omnigent is *already* the secondary path in practice.
- **Hand-mirroring did not happen.** The 2026-07-11 doc-drift audit
  ([`2026-07-11-doc-drift-audit.md`](../reports/2026-07-11-doc-drift-audit.md)) found the Omnigent-side
  docs, printed strings, and counts pervasively stale — `omnigent/README.md:50-84` still documents
  bare `fkit` as the Omnigent entrypoint, `omnigent/fkit-init.sh:212-217` prints "6 agents" over a
  list of five, and `omnigent/fkit-reconnect.sh:94,100` tells a user mid-incident to "run `fkit`",
  which now starts Claude and never starts an Omnigent server. The dual-flavor tax was real and was
  not being paid.
- **The original driver never went away.** ADR-008's context: Omnigent's orchestration was
  unreliable for the owner (sub-sub-agents failing to reply, dropped sessions, failed connections) —
  the failure classes that `omnigent/fkit-reconnect.sh` and `omnigent/fkit-team-restart.sh` exist to
  paper over. Since the switch, the team has worked productively on the Claude path.
- **Owner ruling (this session):** Omnigent is legacy and will be removed; Claude Code native +
  Codex sidekick is the model going forward.

**Crucially, `omnigent/` is not dead weight that can simply be deleted.** The audit found the Claude
flavor has three hard dependencies on it:

1. **The shared scaffold lives there.** `claude/fkit-claude-init.sh:20` sets
   `scaffold="$here/../omnigent/scaffold"` and copies the `ai-agents/` tree (`:30`) *and* `AGENTS.md`
   (`:46`) from it. `claude/scaffold/` contains only `CLAUDE.md`. Deleting `omnigent/` makes Claude
   init hard-fail at `:24`.
2. **The installer hard-requires it.** `install.sh:32-33` exits 1 if `omnigent/fkit.sh` is absent.
3. **Self-update lives there.** The generated launcher routes `update|upgrade` to
   `omnigent/fkit.sh`; its own comment states *"Self-update stays on the omnigent script, which owns
   it"* (`install.sh:88-94`).

Dependency 3 exposed a **live defect**: `claude/fkit-claude.sh` contains no update check at all, so
the *default* flavor never self-updates. Self-update must therefore be **built** for the Claude path,
not merely moved — which makes it a design decision inside this one (see ADR §Decision, point 3).

## Decision

**Claude Code native is fkit's only runtime.** `omnigent/` is removed from the repo. Specifically:

1. **One flavor.** The team ships as Claude Code subagents (`claude/agents/`) + `/fkit-*` skills
   (`claude/skills/`). `install.sh` installs one flavor. The `omnigent` and `claude` subcommands, the
   `fkit-team` root agent, `.fkit/agents/` vendoring, `.fkit/run`, and the reconnect/restart tooling
   all go away with it.
2. **Codex is a required dependency, not optional.** The adversarial second opinion runs on Codex
   (`codex exec --sandbox read-only`) for genuine model diversity. Codex's absence is a **setup
   error**, surfaced by a preflight check — *not* a supported degraded mode. The existing
   `[claude-fallback — NOT model-diverse]` path is consequently no longer a mode fkit offers; a
   review that cannot reach Codex is not a complete review.
3. **Self-update: check, notify, but never silently execute.** The Claude path gets a throttled
   update *check* that prints "a newer version is available — run `fkit update`". It does **not**
   inherit Omnigent's silent fetch-and-exec of `install.sh` from `main`
   (`architecture.md:328-333` flagged that as an unverified-integrity trust surface). `fkit update`
   remains explicit and user-invoked.
4. **`ai-agents/` file contracts are unchanged.** They were ADR-008's designated portability layer
   and are the reason this removal is cheap. They survive as-is.
5. **The removal is extract-then-delete, in order:** move the scaffold into `claude/`, build Claude
   self-update, rewrite `install.sh`, *then* `git rm -r omnigent/`. Deleting first breaks the
   product.

## Options considered

- **Claude-native only, Omnigent removed (chosen).** Ends the mirroring tax, deletes a large stale
  surface, and matches where the code and the team already are. Costs the Omnigent escape hatch.
- **Keep dual-runtime (ADR-008 status quo).** Rejected: the mirroring cost is already unpaid — the
  Omnigent side is pervasively stale and its recovery tooling actively misdirects users. Keeping a
  flavor nobody maintains is worse than not having it, because it *looks* supported.
- **Keep `omnigent/` but freeze it as deprecated/unmaintained.** Rejected: the three hard
  dependencies above mean a frozen `omnigent/` is still load-bearing (scaffold, installer,
  self-update). A "frozen" directory the product depends on at runtime is not frozen — and it keeps
  its stale docs and misleading recovery hints shipping to users. Extracting the dependencies is
  required either way, at which point deletion is nearly free.
- **Make Codex optional, keeping the Claude-only fallback (rejected for now).** Rejected by owner
  ruling: the adversarial pass exists *for* model diversity, so a same-model fallback is a review
  that quietly isn't the thing it claims to be. Accepted cost: a harder install prerequisite.

## Consequences

- **Positive:** one runtime to maintain; the doc surface shrinks by roughly half; behavior changes
  stop needing hand-mirroring (the standing structural cost ADR-008 accepted); the self-update trust
  risk in `architecture.md:328-333` is retired rather than ported; role boundaries get *stronger*
  enforcement (tool allowlists + skill lockdown) than Omnigent's prompt-only rules.
- **Negative / costs:**
  - **fkit is now hard-coupled to Anthropic's Claude Code CLI** plus the Codex CLI. There is no
    fallback runtime. If Claude Code makes a breaking change, fkit has no second leg to stand on —
    this is a real, accepted concentration risk, and it is the main thing this ADR buys its
    simplicity with.
  - **Codex becomes a required install prerequisite**, raising the barrier to first run.
  - Losing auto-update-on-launch means some users will run stale versions longer.
  - The Omnigent work (7 bundles, vendoring, reconnect/restart, `validate-bundles.sh`) is written
    off. ADR-003/004/005/006/007 become historical.
- **Residual risks / "re-raise only if":**
  - **Claude Code's subagent/skill primitives regress or are removed**, or its licensing/pricing
    makes it untenable as the sole runtime — at that point the single-runtime bet must be reopened.
    A finding of the form "fkit only runs on one vendor's CLI" is **not** a new defect; it is this
    decision, knowingly taken.
  - **The Codex hard-dependency proves too costly at install time** (e.g. it blocks real users from
    onboarding) — reopen point 2 only, and only with evidence from actual users. The `(for now)` in
    the owner's ruling is deliberate.
  - Do **not** re-raise "Omnigent orchestration could be fixed" — that was ADR-008's finding and this
    ADR's premise.

## Related

- Supersedes [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) — the dual-runtime
  decision. ADR-008 is kept, not deleted: it is the record of *why fkit left Omnigent*.
- Retires (as omnigent-only mechanics, to be marked superseded **when the code is actually removed**,
  not before): [ADR-003](adr-003-ci-runs-validate-bundles.md),
  [ADR-004](adr-004-fixed-role-based-titles-for-consult-spawns.md),
  [ADR-005](adr-005-vendor-wiki-query-skill-reads-decentralized.md),
  [ADR-006](adr-006-symlink-vendored-query-skill-not-copy.md),
  [ADR-007](adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill.md).
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the interaction model on the
  surviving runtime.
- [ADR-001](adr-001-package-json-stays-metadata-only.md) — **unresolved**; owner has flagged it for
  further investigation. Not settled by this ADR.
- Evidence: [`2026-07-11-doc-drift-audit.md`](../reports/2026-07-11-doc-drift-audit.md).
- Code: `install.sh:32-33,87-103`, `claude/fkit-claude-init.sh:20,24,30,46`,
  `claude/fkit-claude.sh`, `omnigent/fkit.sh`.
</content>
