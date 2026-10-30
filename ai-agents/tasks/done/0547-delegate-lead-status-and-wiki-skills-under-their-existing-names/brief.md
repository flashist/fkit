# Delegate lead status and wiki skills under their existing names

## ID
0547

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

Owner request, relayed verbatim to the actual producer on **2026-10-30**:

> Can you make the fkit-status to be available for the lead too? I want to use the same skill name, but when the lead is asked for it, the lead should delegate it to the producer, the same thing should be done with the wiki-sync and wiki-lint skills.

The target is the **current Codex preview**, documented in
[codex/README.md](../../../../codex/README.md) and the current
[migration handoff](../../../../model-agnostic-sprint/HANDOFF.md). Read both before planning;
historical migration checkpoints do not override their current rulings. Local operation is
Codex-only; both fkit hooks remain disabled. Live Claude/mixed compatibility remains unverified.
This filing authorizes this brief and one Backlog row, not implementation or publication.

**Current constraint:** `claude/skills-for-role.sh` is canonical for procedure ownership.
`codex/materialize.mjs` reads it; `codex/fkit.mjs` uses that same map to enable native skills,
and `codex/server.mjs` uses it to authorize `fkit_skill`. Lead currently lacks all three names.
Simply adding them to lead's list would expose the existing producer/wiki procedure bodies through
the dispatcher. Catalog visibility and authority to execute must be distinguished deliberately.
The three existing owner banners also prohibit execution by other roles. This task adds delegation
entries for lead; it does not transfer or share execution of those owner procedures.

Wiki grounding: [[systems/role-locked-sessions]],
[[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]],
[[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]],
[[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]],
[[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]], and
[[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]]. These establish
typed fresh workers, real caller identity, wiki-only vault writes, and owner questions returned by
headless workers. The wiki's hook-era account does not describe the current Codex dispatcher or this
same-name routing. Current runtime sources fill that gap; any eventual wiki ingest belongs to wiki.
ADR-036's proposed site registry remains unbuilt; do a fresh live-source sweep rather than assuming
it exists or making this task build it.

Note: 7 commit(s) touched `ai-agents/` since the wiki was last synced
(`185ac5e07e918c089ed3afd23496587315342000`) — this answer may not reflect the latest changes.
Consider running /fkit-wiki-sync.

Related open work: [0216](../../backlog/0216-build-the-fkit-wiki-update-skill-for-the-lead/brief.md) and
[0217](../../backlog/0217-wire-fkit-wiki-update-into-the-leads-skill-ownership-and-mirrors/brief.md) describe a
different, new `fkit-wiki-update` sync-then-lint sequencer. This request invokes each existing name
independently; it neither implements that sequencer nor cancels, edits or depends on those briefs.

## What to build

1. Make **`fkit-status`, `fkit-wiki-sync`, and `fkit-wiki-lint` visible and loadable by those exact
   native skill names in a freshly launched lead session**. Also support the normal request to lead
   to run each. No replacement aliases, manual instructions to switch sessions, or new combined
   command. A lead invocation delegates exactly the requested operation to a fresh actual role:

   | Lead entry | Worker | Worker procedure |
   |---|---|---|
   | `fkit-status` | `fkit-producer` | owned `fkit-status` |
   | `fkit-wiki-sync` | `fkit-wiki` | owned `fkit-wiki-sync` |
   | `fkit-wiki-lint` | `fkit-wiki` | owned `fkit-wiki-lint` |

2. Preserve the authority boundary at **both native skill loading and dispatcher loading**. Resolve
   lead to delegation instructions; resolve producer/wiki to their existing full procedures.
   Lead never executes the producer briefing/dashboard procedure or wiki maintenance, and never
   writes the vault. Use fixed caller identity, not a caller-supplied role or prompt assertion.
   Preserve every other role's existing allow/deny decisions, producer-only movers and wiki-only
   writes. Do not grant all roles access, disable the dispatcher, add a bypass, or reactivate hooks.
   Catalog enablement alone is insufficient. The coder's approved plan must explain the distinction
   between visibility, permission to load a forwarding entry, and permission to execute owner work.
   Keep one canonical policy source; do not introduce a second hand-maintained ownership map.
3. Reuse the configured fresh-role delegation path and its saved per-role runtime/model/effort,
   lineage, hop/cycle checks and failure handling. No generic helper impersonating producer/wiki,
   role switch in lead, native-subagent bypass, or silent runtime/model fallback. A headless worker
   with a decision returns `NEEDS-DECISION` and context to lead. Lead asks the real owner through
   its interactive owner channel, waits for an actual answer, and relays that answer to the proper
   worker. A decline, cancellation, explanation request, timeout or missing answer grants no consent.
   A headless lead returns the question upstream; it must not invent an interactive owner channel.
4. Pass supported arguments and relevant caller context without reinterpretation or loss. Status
   accepts empty (every active sprint), a named live/archived/cancelled sprint, or case-insensitive
   `Backlog`, retaining missing-target and no-active-sprint behavior. `full`, `all` and `board` remain
   ordinary target text, not new modes. Sync preserves empty, `YYYY-MM-DD`, and `force`. Lint gains
   no new argument contract. Carry caller-named tracked task IDs where relevant to wiki flags.
   A sync request does not also run lint, and a lint request does not implicitly sync.
5. Await the worker and relay its **full prescribed output**. Status retains its complete
   seven-beat briefing and full dashboard, all active sprints, drift, blockers, owner questions and
   failure caveats; no summary-only substitute. Wiki reports retain judgment warnings, partial or
   failed outcomes, no-change results, and verbatim terminal task flags:
   `Task <NNNN>'s vault work is complete — ready to close`,
   `Task <NNNN>: partial — not ready to close`, or
   `No tracked task completed by this run.` Preserve their prescribed placement within the report.
   Neither forwarding entry auto-closes tasks or boards. Missing, interrupted, empty, denied or
   failed worker output must be reported honestly, with any usable partial result and unresolved
   question retained; never claim completion or substitute lead's own execution. Do not design a
   general retry/recovery system in this task.
6. Make the source and compatibility changes coherent. Canonical prompts/procedures remain under
   `claude/`; inspect `claude/skills-for-role.sh`, the three `SKILL.md` owner banners,
   `claude/agents/fkit-lead.md`, owner-role prompts, and Codex materialization, native catalog,
   dispatcher and preview/reporting paths. Generated `.agents/` and `.claude/` copies are outputs,
   not authored fixes. Ensure role-specific loading cannot overwrite another concurrent role's
   skill with the wrong variant. Preserve direct producer/wiki use and supported legacy/configured
   Claude-source behavior through the shared policy and adapters, without granting lead the owner
   procedure. Use deterministic compatibility checks locally; no Claude API probes or success claim.
7. Sweep live ownership/availability statements, using the checklist as a floor: both checklist
   copies in `claude/skills-for-role.sh` and `claude/fkit-claude.sh`,
   `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`,
   `ai-agents/knowledge-base/architecture.md`, `test/skill-ownership-hook.test.js`, and the initializer's
   printed roster. Include Codex-generated team output, runtime instructions, preview/catalog output
   and runtime docs where affected. Say explicitly which entries are delegated and who executes.
   Recount unique skill names rather than adding three to a count for three reused names. Report
   additional mirror sites found; do not rewrite historical records or the wiki. Follow dual-home
   rules for any actual paired convention change, and regenerate the manifest if scaffold changes.
8. Add the user-visible change to `CHANGELOG.md` under Unreleased. Extend meaningful **existing**
   process/contract tests, principally `test/launcher-contract.test.js` and
   `test/skill-ownership-hook.test.js`, under [CONTRIBUTING.md](../../../../CONTRIBUTING.md)/ADR-057.
   Cover shipped-script behavior through inputs, output, argv and written artifacts. No new test
   file or prove-red case without specific owner approval; no tests pinning prompt wording or
   pretending to prove LLM compliance. This is a product change requiring the normal concrete
   owner-approved coder plan before source edits. Architectural decisions or ADR amendments, if
   necessary, go to the architect through the established process; this brief grants no ADR authority.

## Verification steps

1. In a disposable Codex-configured project, refresh through normal setup and launch lead using
   the checkout. Check native catalog visibility/loadability for all three exact names and the
   dispatcher result for the fixed lead caller. Show each entry routes to its specified worker;
   preview text alone is insufficient. Check direct producer/wiki calls still load their full
   procedures and other roles retain their prior permissions. Include negative permission checks,
   not merely three newly successful loads. No global install or real-project vault writes.
2. Extend existing black-box tests to exercise catalog selection, fixed-caller dispatcher routing,
   fresh worker role/argv, saved model/effort selection, argument transport, and legacy hook
   allow/deny behavior as affected. A lead forwarding allowance must never become an allowance to
   execute the full owner procedure. Keep disabled Codex hooks disabled. Stubs establish transport
   and permissions, not actual role behavior or live Claude/account compatibility.
3. Run bounded actual Codex acceptance in disposable projects for each operation. Establish that
   the worker really has producer/wiki identity and loads its owned skill; show lead delegates
   rather than doing owner work. Cover status empty with multiple active sprints and explicit
   Backlog/named sprint selection; check archived/cancelled, missing target and no-active cases
   against the existing contract. Cover sync empty/date/force and lint independently. Keep writes
   confined to fixture vaults and performed by actual wiki workers. Distinguish executed cases
   from deterministic transport fixtures and reasoning-only checks; disclose anything unverified.
4. Check full status output and wiki warnings/task flags survive forwarding, including an idle
   sync. Exercise worker question, cancellation, partial/failure, denied and absent-output paths
   with controlled fixtures where needed. Prove there is no fabricated answer, lost flag, false
   success, automatic closure, implicit second wiki operation or lead vault write. A synthetic
   owner reply proves relay plumbing only; it is not real owner approval or human UI acceptance.
5. Check affected live mirrors and generated outputs agree about forwarding versus execution,
   direct-owner availability and unique skill counts. Verify links and same-name native loading
   after repeat setup, including isolation between lead and owner sessions. Record the source sweep
   and any omissions; do not claim a universal write wall or live Claude compatibility.
6. Run focused existing-file checks plus **`npm test` and `npm run test:prove-red`** for the policy/
   ownership-test changes, following CONTRIBUTING. If scaffold changes, run
   `npm run generate:manifest` before verification and inspect the generated diff. Record exact
   commands, counts, failures, skips, elapsed times and coverage limits. Keep `npm test` within the
   120-second budget; prove-red retains its four existing cases. No release command is authorized.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- One coherent unit requested by the owner: same-name lead delegation for this fixed three-entry
  set, including the shared visibility/authorization seam, compatibility mirrors and verification.
  Unloadable forwarding prose or broad owner grants alone do not deliver the requested behavior.
  No generic delegation framework or unrelated skill expansion is requested.
- Filed 2026-10-30 by the actual `fkit-producer` through owned `fkit-task-brief`, grounded through
  read-only `fkit-query`. Highest current task ID across backlog/done/cancelled was 0546.
- Backlog, unranked; no Sprint 12 placement, changed dependency links or sprint waits introduced.
- Open product questions at filing: **none**. The requested names, delegates and runtime target
  are explicit. The coder must present the concrete technical seam and verification scope at its
  normal plan gate; this filing is not plan approval.
- Brief-only authorization: no source implementation, task/sprint closures, vault writes, global
  installation, other-project changes, commit, push, release or publication.
