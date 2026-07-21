# Give every fkit agent direct wiki-query access

## ID
0048

## Sprint
Sprint 1

## Priority
13

## Status
✅ Done — verified complete in code by the 2026-07-11 doc-drift audit (every agent carries
`/fkit-query` directly; no per-lookup fkit-wiki spawn required).

## Context

Originally the owner's idea #1 in a wider panel-noise discussion (2026-07-10), alongside two other
ideas that became [`ADR-004`](../../../knowledge-base/decisions/adr-004-fixed-role-based-titles-for-consult-spawns.md):
instead of every agent spawning a fresh `fkit-wiki` sub-agent session for every wiki lookup (the
single biggest source of ad hoc consult children today), vendor the wiki `query` skill directly
into every agent's own bundle, with direct read access to `ai-agents/wiki-vault/`, so a lookup
happens in-process instead of via a spawn.

**This reverses a stated, checked-in project rule**, not just an operational habit: root `CLAUDE.md`
says *"All wiki reads and writes go through the fkit-wiki agent... no other agent edits the wiki
directly,"* and the producer's own prompt states the same for reads specifically. That's why this
was flagged for investigation rather than written as a task immediately.

**What the investigation found before it stalled:**
- fkit-wiki, queried directly, confirmed: **no rationale for the centralization rule is recorded
  anywhere** — not in the wiki itself (`[[systems/fkit]]` states it as a policy fact with no "why"),
  not as an ADR, not in `log.md`. The nearest documentation is `PROJECT.md`/`architecture.md`
  simply asserting fkit-wiki as "sole gateway," unexplained. This weakens the case that
  centralization protects some specific, documented technical guarantee — but doesn't prove it
  doesn't; **absence of a recorded reason isn't the same as absence of a real reason.**
- **Not yet answered** (the investigation stalled before reaching this): whether the `query`
  skill's own logic — specifically the `sync`/watermark freshness check fkit-wiki runs before
  answering (observed directly in this session: "Using `sync` to check the wiki watermark...") —
  depends on fkit-wiki-specific state, tooling, or sandbox permissions that other bundles don't
  have. If it does, vendoring the skill naively risks agents answering from **stale** wiki content
  without knowing it's stale. This must be checked, not assumed either way.
- **Live supporting evidence, independent of the above:** the investigation itself (a
  producer→architect→fkit-wiki, 2-hop consult) hit a concrete instance of the exact reliability gap
  `document-consult-chain-envelope.md` (Sprint 1, priority 2) exists to catch — fkit-wiki's leg
  completed cleanly, but the completion never woke the architect to relay it back, requiring a
  manual nudge, and the stall recurred even after nudging. This is separate evidence for the same
  conclusion: reducing reliance on spawning another agent for what is fundamentally a read-only
  lookup is worth doing regardless of the original rationale question, since spawning an
  intermediary for a simple read has now demonstrably added fragility, not just noise.

## What to build

1. **fkit-architect completes the interrupted due diligence first, done directly/synchronously
   (not via another multi-hop consult, to avoid re-triggering the same stall):**
   - Whether the `query` skill's freshness/sync check depends on fkit-wiki-specific state or
     tooling, and if so, how to preserve that guarantee for agents querying directly (e.g. a
     lightweight watermark check every agent runs before trusting a wiki read, or an explicit
     accepted risk if not feasible).
   - Read-path sandbox implications of granting other bundles direct read access to
     `ai-agents/wiki-vault/` (architecture.md already names `sandbox.write_paths` as a known,
     deferred risk area for writes — confirm whether an analogous read-path restriction exists or
     needs adding).
2. Vendor the `query` skill (or a portable equivalent) into every non-wiki bundle — producer,
   coder, reviewer, architect, adversarial-reviewer — with direct wiki-vault read access.
3. Rewrite each agent's "how to consult the wiki" prompt section: use the `query` skill directly
   and in-process for lookups; only spawn `fkit-wiki` (via the `wiki-consult` fixed title from
   ADR-004) for **writes** (ingest/lint/sync) or when a lookup genuinely needs fkit-wiki's own
   deeper multi-step research, not a simple query.
4. **Writes stay centralized to fkit-wiki — this task is reads-only.** Precisely: only the `query`
   skill gets vendored into the other bundles, never `ingest`/`lint`/`sync`, and each agent's prompt
   keeps the explicit instruction not to write to `ai-agents/wiki-vault/`. Be honest about what this
   does and doesn't guarantee — **this was already, and remains, a prompt-level convention, not a
   sandboxed restriction**: `architecture.md` already names "role boundaries are prompt-enforced,
   not sandboxed (`sandbox: none`)" as a known, accepted project-wide risk, and every agent already
   has raw file-write tools that could touch the vault today regardless of this task. Nothing here
   creates or removes a technical guarantee that didn't already (not) exist.
5. **Name the marginal risk this does add, rather than treating it as zero:** giving agents direct
   read access to wiki-vault file paths is a smaller step to an accidental/convenient write than
   today's total separation (spawn-only, no direct file contact at all). Not a new *kind* of risk —
   the existing sandbox-gap risk — but a real increase in proximity. Cross-reference the sprint's
   already-deferred `sandbox.write_paths` / structural role-boundary item (see
   `plan-sprint-1.md`'s "Not in this sprint" section) — this task doesn't need to solve that, but
   should note it compounds the case for prioritizing it eventually.
5. Update root `CLAUDE.md`/`AGENTS.md`'s wiki-access section, and `PROJECT.md`/`architecture.md`
   wherever they state the old "all reads and writes go through fkit-wiki" wording, so the docs
   match the new reality instead of contradicting it.
6. Record an ADR (next number after ADR-004) capturing: the absence of a recorded original
   rationale, the owner's decision to relax the rule for reads given that plus the live
   chain-reliability evidence, and the explicit, unchanged constraint that writes stay centralized.

## Verification steps

- Each of the 5 non-wiki agents can independently answer a realistic wiki lookup without spawning
  `fkit-wiki`.
- Only `query` is vendored into the other bundles — confirm `ingest`/`lint`/`sync` are not present
  in any non-wiki agent's skill set, and each non-wiki agent's prompt still explicitly states it
  must not write to `ai-agents/wiki-vault/`. (This is a prompt/skill-bundling check, not a sandbox
  proof — no technical write restriction exists today or after this task; see Context.)
- If the wiki is stale relative to `ai-agents/` source changes not yet ingested, an agent reading
  directly still surfaces that staleness (or the task explicitly documents why this guarantee is
  being intentionally dropped, with the owner's sign-off) — not silently trusting stale content.
- `CLAUDE.md`/`AGENTS.md`/`PROJECT.md`/`architecture.md` no longer contradict actual behavior.
- The new ADR exists and accurately records the rationale and the read/write split.

## Notes

- Natural owner: **fkit-architect** for the due-diligence + design + ADR, **fkit-coder** for the
  vendoring/config edits + doc updates — same split as `rollout-adr-004-fixed-consult-titles.md`.
- Reuse the architect's partial findings already gathered (no recorded rationale on record) rather
  than re-investigating from scratch — only the two open items above are still outstanding.
- Related: worth cross-referencing from `document-consult-chain-envelope.md` once that's written —
  the chain-stall hit during this task's own investigation is a concrete, reproducible case for it.
