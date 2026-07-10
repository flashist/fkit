# ADR-005: Vendor the wiki `query` skill directly into every fkit agent bundle — reads decentralized, writes stay fkit-wiki-exclusive

- **Status:** accepted
- **Date:** 2026-07-10
- **Deciders:** owner + fkit-architect

## Context

`ai-agents/tasks/backlog/give-every-agent-direct-wiki-query-access.md` proposes reversing a stated,
checked-in project rule: root `CLAUDE.md` says *"All wiki reads and writes go through the fkit-wiki
agent... no other agent edits the wiki directly,"* `architecture.md` names fkit-wiki as "sole gateway
to `ai-agents/wiki-vault/`," and every one of the other five bundles' "wiki access" prompt sections
states the same rule for reads specifically (`omnigent/fkit-producer/config.yaml:125-131`,
`fkit-coder/config.yaml:113-116`, `fkit-reviewer/config.yaml:97-124,171-173`,
`fkit-architect/config.yaml:110-117`, `fkit-adversarial-reviewer/config.yaml:95-99`).

**No recorded rationale for the centralization rule exists anywhere** — not in the wiki itself, not
as an ADR, not in `log.md`. It is asserted as policy, never justified. That absence doesn't prove the
rule was pointless, but it does mean this decision isn't overriding a documented technical guarantee —
only an unexplained convention.

**Live reliability evidence, independent of the rationale question:** the investigation that produced
this task (a 2-hop producer→architect→fkit-wiki consult) itself hit the exact chain-reliability gap
`document-consult-chain-envelope.md` (Sprint 1, priority 2) exists to catch — fkit-wiki's leg completed
cleanly, but the completion never woke the architect to relay it back, and the stall recurred even
after a manual nudge. Reducing reliance on spawning a separate agent for what is fundamentally a
read-only lookup removes exposure to that gap for the common case, regardless of how the rationale
question resolves.

**Sibling of ADR-004:** both decisions came out of the same 2026-07-10 panel-noise investigation and
follow the same split — architect does due diligence + design + this ADR, fkit-coder does the
vendoring/config rollout.

### Due diligence (completed directly this session, per the task's explicit instruction not to re-spawn a consult chain)

**Q1 — Does `query`'s freshness/sync check depend on fkit-wiki-specific state or tooling?**

Read directly, in full:
- `omnigent/fkit-wiki/skills/query/SKILL.md` — its six documented steps are: read `index.md` → read
  relevant pages → follow `[[wikilinks]]` (max 2 hops) → read cited source files → compose a cited
  answer → note gaps explicitly. **Zero mention of `sync`, `.wiki-watermark`, or any freshness check.**
  It uses only generic file reads every bundle already has.
- `omnigent/fkit-wiki/skills/sync/SKILL.md` — `.wiki-watermark` (a single commit-SHA file under
  `wiki-vault`) is exclusively `sync`'s mechanism: written in its Step 7, read in its Step 1, to
  compute a `git log <sha>..HEAD` delta for *ingest*. Unrelated to `query`.
- `omnigent/fkit-wiki/config.yaml`'s full prompt — lists `query`/`ingest`/`lint`/`sync` as four
  distinct skills and instructs "run exactly one at a time" matching intent. No instruction anywhere
  to run `sync` before or during `query`.

**Conclusion: confirmed.** The sync/watermark check fkit-coder observed live in a prior session
("Using `sync` to check the wiki watermark...") was fkit-wiki's own prompt-level initiative that turn
— not a mechanical dependency of `query`. There is no fkit-wiki-specific state or tooling `query`
relies on.

**Additional finding, sharper than the task's framing assumed:** because `query` itself, as documented,
never checks staleness — even when fkit-wiki is the one running it — the "freshness guarantee" the
task worried about preserving doesn't actually exist today, for anyone, fkit-wiki included. Vendoring
`query` as-is therefore doesn't remove a guarantee; it only extends today's status quo (no freshness
check) to more callers. That said, the task's own fallback option — "a lightweight watermark check
every agent runs before trusting a read" — is cheap and worth adding as a net-new improvement rather
than leaving the gap as-is now that it's been surfaced. See Decision.

**Q2 — Read-path sandbox implications of granting direct wiki-vault read access?**

Verified directly via `grep` across all seven bundles' `config.yaml` `os_env.sandbox` blocks: every
one is `type: none` — `fkit-producer/config.yaml:42`, `fkit-coder/config.yaml:42`,
`fkit-reviewer/config.yaml:51`, `fkit-architect/config.yaml:46`,
`fkit-adversarial-reviewer/config.yaml:45`, `fkit-team/config.yaml:41`, `fkit-wiki/config.yaml:41`.
Matches `architecture.md`'s project-wide claim ("all seven agents run `sandbox: none`").

**Conclusion: confirmed, no correction needed.** There is no OS-level read- or write-path restriction
anywhere today, for any bundle, on any path. The wiki-vault boundary has only ever been a prompt-level
convention. Granting direct read access is purely a skill-vendoring + prompt-text change — nothing to
add, loosen, or newly restrict at the `os_env`/sandbox layer. Every one of the five bundles already had
unsandboxed *write* access to `ai-agents/wiki-vault/` before this task, too; nothing here creates a new
technical capability, only new habitual proximity to files these agents were already, technically,
free to touch.

### Scope note (flagged for owner confirmation, not resolved here)

`ai-agents/sprints/plan-sprint-1.md`'s "Not in this sprint (explicitly deferred)" section excludes
"Expanding or polishing the six agents' skill sets," yet this task sits in Sprint 1 at priority 13 and
requires exactly that — vendoring `query` into five more bundles. The sprint plan's own Context section
already flags priorities 12–13 as appended out-of-band and to be treated as unlocked pending owner
confirmation; this contradiction should be resolved under that same existing convention rather than
silently proceeding. Not a blocker to recording this ADR or to fkit-coder's implementation, but the
owner should explicitly confirm the exception before this task is treated as sprint-locked.

## Decision

Vendor the `query` skill directly into every non-wiki bundle, decentralizing **reads only**; writes
stay 100% centralized to fkit-wiki.

1. **Canonical source, five copies.** `omnigent/fkit-wiki/skills/query/SKILL.md` remains the single
   canonical source (amended per point 2 below), copied byte-identical into
   `omnigent/fkit-{producer,coder,reviewer,architect,adversarial-reviewer}/skills/query/SKILL.md`.
   fkit-wiki keeps its own copy too — all six are identical going forward, edited at the canonical
   source and re-copied.
2. **Add one lightweight, read-only staleness-surfacing step to the canonical `query` skill** (so all
   six copies gain it uniformly, including fkit-wiki's own — this is a real, if small, improvement over
   today's status quo, not merely a preserved guarantee):
   - Insert a step immediately after "read `index.md`": check whether
     `ai-agents/wiki-vault/.wiki-watermark` exists. If it does, run
     `git log <sha>..HEAD --oneline -- ai-agents/ ':!ai-agents/wiki-vault/'` (using the watermark's
     SHA) and count matching commits. If the file doesn't exist, skip silently — that's normal on a
     project that has never been synced, not a defect.
   - This is strictly read-only: no write to `.wiki-watermark`, no write to `log.md`, no invocation of
     `sync`'s full ingest logic — just the same cheap existence-and-diff-count check `sync` already
     does in its own Step 1, reused narrowly and without side effects.
   - If the count is nonzero, append one caveat line to the composed answer: *"Note: N commit(s)
     touched `ai-agents/` since the wiki was last synced (`<sha>`) — this answer may not reflect the
     latest changes. Consider asking fkit-wiki to run `sync`."* If zero, or the watermark file is
     absent, no caveat line is added.
   - Requires no new tool grant: `git`/file-read access is already present, unsandboxed, on every
     bundle (Q2).
3. **Rewrite each of the five bundles' "wiki access" prompt sections** (cited paths above), plus
   `omnigent/fkit-reviewer/skills/stateful-review/SKILL.md:84-85`'s "wiki-only-via-fkit-wiki rule"
   wording: use `query` directly and in-process for lookups; consult fkit-wiki (via ADR-004's
   `wiki-consult` fixed title) only for **writes** (`ingest`/`lint`/`sync`) or a lookup that genuinely
   needs fkit-wiki's own deeper multi-step research beyond a simple query.
4. **Writes remain 100% centralized to fkit-wiki.** Only `query` is vendored — never `ingest`, `lint`,
   or `sync` — and every bundle's prompt keeps an explicit "never write to `ai-agents/wiki-vault/`"
   rule. `fkit-team` needs no edit (it carries no wiki-access instruction today, confirmed).
5. **No `os_env`/sandbox changes anywhere** — nothing to add or loosen (Q2).
6. Update root `CLAUDE.md`, `PROJECT.md`, and `architecture.md` wherever they assert "all reads and
   writes go through fkit-wiki" / "sole gateway," to instead state: reads are direct and in-process
   per agent via the vendored `query` skill; writes remain fkit-wiki-exclusive.
7. Implementation (vendoring, prompt rewrites, doc updates) is **fkit-coder's**, per the task's own
   ownership split. This ADR records the decision and its rationale only.

## Options considered

- **Vendor `query` (single canonical source, five copies) + add a lightweight read-only staleness
  note; writes stay centralized (chosen)** — closes the ad hoc-consult/chain-stall problem for the
  common read case, adds a small real improvement over today's freshness gap, keeps the
  higher-stakes write path untouched.
- **Vendor `query` verbatim, no staleness check** — rejected: technically sufficient (matches status
  quo exactly, since no guarantee exists today either), but ignores a nearly-free improvement the
  task itself suggested and that closes a real, if pre-existing, gap, now that it's been surfaced.
- **Make freshness airtight by having `query` invoke full `sync` logic first** — rejected: far too
  expensive per lookup (a full multi-file git-log scan plus page-rewrite step on every single
  question defeats the purpose of removing the extra hop's overhead), and would require write access
  (`.wiki-watermark`, `log.md`) from all five bundles, contradicting this task's reads-only scope.
- **Keep full centralization (status quo)** — rejected: no recorded technical rationale was ever
  found for it, and it has now demonstrably added fragility (the chain-stall incident), not just
  noise, per this task's own investigation.
- **Decentralize writes too** — rejected, out of scope: six unsandboxed agents concurrently able to
  write the same `index.md`/`log.md`/pages is a materially larger and different risk than reads, not
  evaluated or accepted here.

## Consequences

- **Positive:** removes the single biggest source of ad hoc consult spawns (per the task's own
  framing) for the common "simple lookup" case; removes exposure to the two-hop consult chain-stall
  gap for that case; adds a small, net-new freshness signal that didn't mechanically exist before,
  uniformly, to all six copies of `query` including fkit-wiki's own.
- **Negative / costs:** six copies of the same skill file must now be kept in sync by hand — no
  shared/base-config or shared-skill mechanism exists in Omnigent (`architecture.md` already names
  this duplication pattern as accepted elsewhere; this is a new instance of it, not a new problem).
  Marginal increase in *proximity* to an accidental direct write — five more bundles now have habitual
  file-read contact with wiki-vault paths — even though the underlying technical capability to write
  was already there, unsandboxed, before this task. Compounds the case for eventually prioritizing the
  already-deferred `sandbox.write_paths` item, without solving it here.
- **Flag, not a blocker:** the Sprint 1 "skill-set expansion is deferred" vs. this task's actual scope
  contradiction (see Context) needs explicit owner confirmation, per the sprint doc's own established
  convention for its other out-of-band priority additions.
- **Residual risks / "re-raise only if":** an agent is ever caught actually writing to
  `ai-agents/wiki-vault/` directly (should never happen per the prompt rule — treat as an incident,
  not a reason to revert this decision); or the staleness note proves noisy or wrong in real usage
  (revisit the check's precision, don't drop reads decentralization over it).

## Related

- `ai-agents/knowledge-base/decisions/adr-004-fixed-role-based-titles-for-consult-spawns.md` — same
  originating investigation, same architect/coder ownership split.
- `CLAUDE.md`, `ai-agents/knowledge-base/architecture.md` — "sole gateway" wording to be updated per
  Decision point 6 (fkit-coder).
- `ai-agents/tasks/backlog/give-every-agent-direct-wiki-query-access.md` — the task this ADR resolves
  the due-diligence blocker for.
- `ai-agents/sprints/plan-sprint-1.md` — priority 13 entry and the "Not in this sprint" scope-conflict
  flag.
- `ai-agents/knowledge-base/decisions/incidents/` *(if formalized per Sprint 1 task 11)* — the
  chain-stall incident cited above, if it gets its own write-up.
