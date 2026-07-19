# Filter the `/fkit-status` board to open tasks only

**Source**: `ai-agents/tasks/done/filter-fkit-status-board-to-open-tasks.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 65

## Goal
Show **only tasks that are not complete yet** on the `/fkit-status` dashboard — hide `✅ Done` and `⛔ Cancelled` rows. *"Incomplete"* = `🔲 Backlog` + `🔄 In progress` + `🚧 Blocked`.

## Key Changes
Four owner rulings, recorded so they are not reopened:
1. **The roll-up totals line stays** — rows hidden, scope still visible.
2. **`➡️ Moved` rows are hidden too** — a third inert state.
3. **Drifted rows always render.** The filter is on the **reconciled** state, not the raw marker: a row stamped `✅ Done` whose brief disagrees is *not known to be done*, and **hiding it would bury a finding**.
4. **Replace, don't switch.** No `full`/`all` toggle — that would reverse the locked one-skill-one-output ruling (task 44) and needs a reversal ADR first.

Implementation: the filter lives in **`dashboard.sh`'s `⟦BOARD⟧` rendering** — the board is *"computed, not recited"*, so filtering belongs in the script, not in prose telling the LLM to drop rows. The roll-up keeps counting **all** rows; `⟦FACTS⟧` is unchanged and still reports drift facts about hidden rows. `SKILL.md` was rewritten in the same unit so skill text and script cannot disagree. Tests added per ADR-014.

## Outcome
Done. ⚠️ **This is a conscious reversal of a stated design principle, not drift.** The skill previously insisted *"show the dead rows — a board that hides cancelled and moved tasks lies about scope."* The owner reversed that knowingly; **ruling 1 (keep the roll-up) is the mitigation**, and the convention now says so explicitly: the roll-up counts every task and ends `— of M`, so scope stays visible even though the dead rows do not.

The **`status-report-format` convention was amended to match** — its *"show the real status of every task, including cancelled/moved rows"* bullet was replaced with the show-open-work-only rule plus the roll-up justification and the always-show-drifted-rows carve-out. See [[systems/knowledge-base-structure]].

⚠️ The convention is **dual-homed and its scaffold copy is drifted** — `status-report-format.md` is one of the six files [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] records as out of step (14 diff-lines). Consuming projects have not received this amendment.

## Related
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — `dashboard.sh`, where the filter lives
- [[tasks/remove-output-variants-from-fkit-status]] — task 44, the locked ruling that forced "replace, not switch"
- [[tasks/record-one-skill-one-output-convention]] — the convention behind that ruling
- [[tasks/add-full-board-switch-to-fkit-status]] — task 38, the output variant already reverted once
- [[tasks/report-backlog-board-in-fkit-status-on-request-only]] — task 68; this filter applies to the backlog board too
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — why the amended convention has not reached consuming projects
- [[decisions/adr-014-how-fkit-tests-itself]] — the test constraints
- [[systems/knowledge-base-structure]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]]
- [[tasks/add-status-skill-to-producer]]
