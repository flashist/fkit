# Sweep A's members — the ten citation-rot rows it absorbed and closed, plus `0349`

**Source**: `ai-agents/tasks/done/0193-repair-the-stale-citations-in-0158s-closed-brief/brief.md`; also `done/0197-resolve-adr-010s-remaining-stale-code-line-ranges/brief.md`, `done/0232-correct-adr-012s-stale-source-of-truth-and-code-coordinates/brief.md`, `done/0275-correct-the-stale-adversarial-review-citations-in-architecture-mds-review-walkthrough/brief.md`, `done/0308-triage-and-repair-claudes-surviving-stale-task-numeral-seeds/brief.md`, `done/0309-repair-the-hyphenated-task-nn-citation-class-in-four-open-briefs/brief.md`, `done/0320-repair-the-four-stale-0171-claims-that-fall-outside-0309s-scope/brief.md`, `done/0321-repair-the-two-stale-0171-claims-on-the-live-backlog-board/brief.md`, `done/0343-repair-the-two-stale-self-locators-outside-0168s-scope-in-0248s-plan-and-0218s-worklog/brief.md`, `done/0344-refresh-the-stale-line-refs-and-moot-r5-rationale-inside-release-mjss-fenced-summary-block/brief.md`, `cancelled/0349-correct-adr-042s-two-stale-test-prove-red-sh-59-citations/brief.md`
**Status**: done — ten `✅ Done (agent-closed — not owner-verified)`; `0349` `⛔ Cancelled (agent-closed — not owner-verified) (2026-08-29)`, absorbed into `0344`
**Sprint/Tag**: Backlog board, unranked (all eleven) · worked inside Sprint 7's Sweep A (`0356`), 2026-09-03 → 2026-09-04 · owners as filed: `fkit-producer` (`0193`, `0320`, `0321`), `fkit-architect` (`0197`), `fkit-coder` (the rest)

> ⭐ **Ingested 2026-10-24 by task `0380`** (the closed-task backlog Sweep C bounded out). One page for all
> eleven because they were done as **one pass** and closed off **one hand-off list** — the shape earlier
> syncs used for grouped closes. Each row below is one task. The pass itself is
> [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]]; this page records what each **member** asked
> for and how it ended.

## Goal
Each row is a **citation-rot** task: a recorded pointer (a line number, a path, an old task number) no
longer lands on what it claims, so repair or re-anchor it. Filed one at a time between 2026-08-02 and
2026-08-28; Sweep A absorbed them so the same rules were applied once.

## Key Changes
| Task | What was wrong | How it ended |
|---|---|---|
| `0193` | `0158`'s closed brief carried six stale facts (a pointer into the archived Sprint 2 board, a `## Priority` that disagreed with the board, a non-existent `claude/universal-rules.md` path, three tasks called open that had closed, a bare-rank merit note); owner ruling extended it to a seventh — `0162`'s brief, `## Priority` 127 vs board `P128` | **Six of seven repaired** as dated corrections; `0162`'s two P127 bullets left byte-identical (true when written). ⚠️ **Defect 2 (the archived board row) settled, NOT repaired** — owner ruling H12 *"A — annotate, don't remove (Rec)"*, so its own verification step 1 does not pass as written. `0180`'s brief updated because its live specimen was repaired |
| `0197` | ADR-010's outbound `path:NNN` code pointers never re-checked after `0143`, including one range into `claude/scaffold/CLAUDE.md` nobody had ever looked at | Every pointer assessed; **four dated ⚠️ notes appended (+58 / −0)**. ⭐ The never-checked scaffold range **lands** (it opens on *"The fkit agent team"*) and earns **no** note — annotating it would have been a false drift claim |
| `0232` | ADR-012 named `claude/fkit-claude.sh` as the home of `skills_for_role()` (it is `claude/skills-for-role.sh`), plus 15 more stale code coordinates and three false asides | **16 occurrences noted by §heading, +57 / −0**; the *"MUST be corrected"* directive recorded as one half satisfied, one half removed. Two classes had already been fixed by `0171` and got no note |
| `0275` | Two stale `fkit-adversarial-review/SKILL.md` pointers in `architecture.md`'s review walkthrough; the brief fenced a third as *"CORRECT. DO NOT FIX IT"* | ⛔ **The fence was refuted** — the third pointer had drifted too. All three fully qualified with their own file names, in quoted-text form |
| `0308` | 48 pre-ADR-029 task numerals (*"task 36"*) in 12 `claude/` files — they now resolve to the **wrong** task, not to nothing | First round **stopped rather than guess** (resolving each numeral needs history, not pattern-matching); done in a later round under ruling H11. ⚠️ Residual: the pattern was singular-only, so **6 plural `tasks NN`** were never triaged (one in `claude/scaffold/`) — ruling H16 closed `0308` anyway and handed the gap to the producer as a follow-up to file |
| `0309` | The hyphenated `task-NN` form, invisible to three earlier sweeps that only searched `task NN`; plus prose still calling `0171` open | Done. ⚠️ Its class-1 population was **7 sites, not the brief's 6** (`0315` was never seen at filing). Its `0172` dependency line was **surfaced, not repaired** (ruling H2) — see [[tasks/apply-0307s-ruling-to-0172s-stale-hard-dependency-declaration]] |
| `0320` | Two closed briefs (`0261`, `0263`) still called `0171` open | Two dated notes, **+8 / −0** each; claims left byte-identical. Ruled into Sweep A (not B) because it is one family with `0309` and `0321` |
| `0321` | Two Backlog-board rows with the same stale `0171` claim | ⭐ **Different treatments, which was the deliverable:** one live instruction repaired in place, one dated reading annotated. ⚠️ Two of its own verification clauses were **unsatisfiable in a combined sweep** — accepted residual under ruling H10 |
| `0343` | Two header locators in `0248`'s `plan.md` and `0218`'s `worklog.md` pointing at `backlog/` paths that no longer exist | Both re-pointed; five other hits in those folders frozen and listed |
| `0344` | Stale line numbers and a moot rationale in `bin/release.mjs`'s fenced summary comment block; widened on 2026-08-29 (*"One combined pass (Rec)"*) to take `0349` | Both halves done with **durable anchors and no numbers** (the approved plan forbade fresh `path:NNN`); comment-only proof empty. ⚠️ Open question it left: does `durable-citation-anchors.md` need an addendum for a code comment citing its own file? |
| `0349` | ADR-042 cited `test/prove-red.sh` by a line number that had drifted, at two sites | ⛔ **Cancelled 2026-08-29 as superseded-and-absorbed** — its scope moved into `0344`, not dropped |

**Two shared rules ran through every member** (the sweep's own, recorded in full on its page): a
**live pointer** is re-anchored, a **frozen record of a past reading** is left byte-identical and gets a
dated note; and a fix never writes a **fresh** line number.

## Outcome
- **Ten closes off two hand-off lists**: eight on round 1's list (`0197`, `0232`, `0275`, `0309`, `0320`,
  `0321`, `0343`, `0344`), then `0193` and `0308` after ruling H11. All agent-closed by a spawned producer.
- **Not members, and not this page's:** `0286` and `0323` stayed open by ruling (later cancelled into
  `0392` — see [[tasks/the-five-architecture-md-rows-cancelled-into-0392]]); `0298` was out (a test, not a repair).
- ⚠️ **A green test run proves nothing here.** The two citation guards scan neither
  `ai-agents/knowledge-base/`, `claude/` nor `bin/` for citations, so most of these repairs are covered
  only by the per-repair checks in `0356`'s worklog.

## Related
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] — the pass that did the work
- [[tasks/sweep-b-members-the-seventeen-correction-note-rows]] · [[tasks/sweep-c-members-the-five-vault-resync-rows]] — the other two sweeps' members
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board Sweep A ran on
- [[tasks/write-the-durable-citation-anchors-convention-page]] — `0171`, the anchor form these repairs use and the task three members called stale-open
- [[tasks/repair-the-three-decay-shapes-across-the-open-backlog-briefs]] — `0306`, parent of `0308` and `0309`
- [[tasks/append-a-dated-correction-note-to-adr-010]] · [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — `0143` / `0195`, the ADR-010 notes `0197` continued
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] · [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — ADRs these members annotated
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] · [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — `0158` / `0162`, the closed briefs `0193` corrected
- [[tasks/release-mjs-with-branch-other-commits-and-tags-head-but-pushes-a-different-ref]] — the `bin/release.mjs` summary block `0344` re-anchored
- [[tasks/remediate-the-dead-brief-paths-in-closed-review-ledger-headers]] — `0168`, whose scope `0343` sat outside
- [[tasks/apply-0307s-ruling-to-0172s-stale-hard-dependency-declaration]] — `0372`, the row `0309`'s surfaced dependency line became
