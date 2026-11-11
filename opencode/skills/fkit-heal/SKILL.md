---
name: fkit-heal
description: Producer-owned structure report and consent-gated untouched-stale scaffold repair for OpenCode.
---

Only fkit-producer runs this procedure. It checks the OpenCode-adapted scaffold, including AGENTS.md
and ai-agents/. It does not require or create CLAUDE.md. Generated profiles/procedures are refreshed
by setup rather than repaired by heal. The snapshot under .opencode/fkit-resources/ is rebuilt on
launch from the installed FKit source; do not edit it or treat it as project knowledge.

Run `bash .opencode/skills/fkit-heal/check.sh` from the project root. Exit 0 means conforming;
1 means nonconformities/refusals; 2 means cannot run. Present every row and summary verbatim.
Do not infer a verdict or omit refusals. Outcomes retain their original meaning:
conforming, missing, untouched-stale, owner-edited, wrong-type, wiki-routed, kept-out,
refused: symlink, refused: malformed-markers, unreadable. Missing paths are report-only here.
An unreadable or invalid ai-agents/.fkit-keep-out fails closed for that subtree. A renamed path is
reported missing; no rename detection is claimed. For owner-edited files, show diffs against
.opencode/fkit-resources/claude/scaffold/<path>; never replace them. Wiki repairs belong exclusively
to fkit-wiki; producer never writes the vault.

Repair requires the owner present, or a parent relaying decisions live. In headless/background work,
stop after the check. With no untouched-stale rows, say nothing repair-eligible; do not invent consent.

1. Run `bash .opencode/skills/fkit-heal/repair.sh propose`. Present its entire enumerated item list,
   diff blocks and exclusions verbatim. This phase writes nothing.
2. Use question to ask approval for that exact list: full list, named subset, or not now. Workers
   return the complete proposal with NEEDS-DECISION to the parent; only the actual owner's answer
   authorizes apply. Explanation requests, silence and prior unrelated approval are not consent.
3. Pipe only the exact approved item lines, verbatim, to
   `bash .opencode/skills/fkit-heal/repair.sh apply`. Apply rechecks eligibility, target bytes and
   replacement bytes; changed-since-propose is refused. Present all output, loudest refusals first.
4. Consent stays only in the live transcript, never in a file, config or environment setting.

Only replacements of known untouched-stale FKit files are allowed. No move, rename, deletion,
owner-edited replacement, task lifecycle change or wiki write. Scripts retain the shared manifest
hashing, marker validation, symlink refusal and apply-time freshness checks. End with What's next?
