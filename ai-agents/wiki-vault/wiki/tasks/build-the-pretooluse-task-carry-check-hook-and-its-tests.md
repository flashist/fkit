# Build the `PreToolUse`/`Task` carry-check hook and its tests

**Source**: `ai-agents/tasks/done/0204-build-the-pretooluse-task-carry-check-hook-and-its-tests/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P13` · ID 0204 · owner `fkit-coder` · built 2026-08-25, three review rounds 2026-08-26

## Goal

**Follow-up 3 of `0162`'s decision report.** On a `PreToolUse` hook matching the `Task` tool, when the spawn is a `/fkit-sprint-ship-loop` Build or Process-review spawn, confirm the prompt contains **the exact bytes of the `plan.md` it names, at the `git hash-object` blob it names**.

### ⚠️ The five caveats — carried unsoftened into plan, worklog and shipped code

1. ⛔ **It checks a carry-fidelity PROXY for condition (b), never (b) itself.** A hook can establish *the prompt contains the bytes of the file at path P with blob H*. It can **never** establish that P is what the owner approved — approval lives in a session channel that leaves no artifact ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]). **A green check does not mean the marker held.** ⛔ **This does NOT close the `carried-not-approved` residual.**
2. **Hard-gated on `0202`** (`plan.md` written at plan approval) — discharged before the build; a missing file is now a loud `dangling pointer` deny, never a silent pass.
3. **TOCTOU.** `plan.md` is read once, at spawn time; it may be rewritten before the worker uses the carried text. The hook is described nowhere as guaranteeing what the worker *received*.
4. ⛔ **The sibling hooks' jq-free `"[^"]*"` string extraction must NOT be copied** — a spawn prompt is a long, multi-line, escape-bearing JSON string value. This needed **real JSON parsing**, done with `node` (no new dependency — [[decisions/adr-014-how-fkit-tests-itself]]'s zero-devDeps rule holds).
5. ⛔ **Launcher sessions only.** Hooks live in `.fkit/settings/<role>.json`, which only `fkit <role>` loads. A spawned or non-launcher session is **not covered**. ⚠️ Those settings are gitignored and regenerated per launch, so **no session gets the hook until its next launch** — including the lead session that drove this sprint.

## Key Changes

| File | Change |
|---|---|
| `claude/carry-check-hook.sh` | **new** — wrapper; `node` missing → allow + loud stderr, else `exec node` on the `.mjs` beside it |
| `claude/carry-check-hook.mjs` | **new** — the check; node built-ins only. Header states proxy-not-(b), TOCTOU, launcher-only, the ungated limit, the fail-open policy |
| `claude/fkit-claude.sh` | third `PreToolUse` entry, matcher `Agent\|Task`, for every role |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | `0203`'s `unverified` marker removed — **five sites** |
| `test/carry-check-hook.test.js` | **new** — grew 19 → 22 → 26 tests across the rounds |
| `test/launcher-contract.test.js`, `test/prove-red.sh` | registration pinned in all three places; prove-red index `TWENTY-TWO` → **TWENTY-FOUR** |

⭐ **`tool_name` is delivered as `"Agent"` since Claude Code 2.1.63** — `Task` was renamed and survives as a matcher alias. The regex `"Agent|Task"` matches both, and the hook self-checks membership.

### ⛔ The surgical marker removal

The brief carved out one exception to its own scope fence: removing `0203`'s now-false `unverified` marker text, *"in the same change that lands the hook — not a separate task"* (owner ruling 2026-08-05). ⛔ **One site was protected**: the paragraph headed *"The honest bound on 'true by construction'"* — the [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] honesty clause for the whole construction. Only the clause *"and until `0204`'s carry-check hook lands, nothing does"* could go. **Result: `2 insertions(+), 22 deletions(-)`**, the two insertions being that paragraph's re-punctuated lines; *"This construction narrows the hazard; it does not remove it"* untouched.

## Outcome

**THREE review rounds, 14 findings**, `fkit-reviewer` + Codex (`codex exec --sandbox read-only`), **coverage full** in rounds 2 and 3. Final: `node --test test/*.test.js` → **773/773**; hook suite **26/26**; `bash test/prove-red.sh` → **24/24, hard gate PASSED**. ⭐ **Each of the four round-3 fixes was pinned by a mutant that failed exactly its own named test — none of the new tests is tautological.**

### ⭐⭐ The arc worth remembering: a Round-1 fix *re-opened* the hole it was next to

- **D1 (the build's own find, from a smoke run against this task's own plan):** the degraded-form declaration (`pointer-only` / `by reference only`) was scanned over the whole prompt — and `0204`'s own plan says `pointer-only` **seven times**, so a **truncated** paste of it was **allowed**. *The plan's own words declared the degraded form on the driver's behalf.* Fix: scan the prompt **minus every line of each pointed-to file**.
- **R1 (medium):** that line-level subtraction let a **mid-line truncation self-declare** — a cut *after* the words leaves a partial line that is not a file line, so it is read as driver text. ⚠️ **The tail-of-output cut is exactly the tool-cap truncation shape this hook exists for.** Fixed by counting a **≥12-char prefix** of a file line as file content. ⭐ **12 is both the floor and sufficient**: it is the length of the shortest literal (`pointer-only`), a shorter partial cannot hold any literal, and a larger N would re-open partials of length 12..N−1.
- **R7 (low):** a pointer-form line *inside* a pasted plan became a second gated pointer, so a faithful carry was denied. Fixed by dropping a pointer as content when its line is a line of another verified pointer's file.
- ⛔ **R8 (medium) — that R7 fix shrank D1's subtraction set and RE-OPENED the self-declaration fail-open.** Reproduced. **A regression the coder introduced in Round 1 and priced medium in their own derivation, not inherited.** Fixed by subtracting the lines of **every readable pointer file**, gated or not — ⭐ *widening the subtraction can only remove lines from the declaration scan, so it is fail-closed-only and no prior allow changes.*
- **R10:** ⚠️ **`PREFIX_MIN = 12` was not pinned at its floor** — every R1 cut left ≥25 chars, so mutants at 13/20/24 survived. A cut at exactly 12 was added.
- **R12:** ⭐ the mutual-quote guard was **load-bearing, unpinned, and its comment was wrong**. It claimed the case *"needs a mutual blob-id fixpoint"* and is *"in practice unreachable"*. Under the ≥7-hex prefix match it needs no fixpoint — **a self-quoting plan matching its own blob prefix was actually FOUND by nonce search in 170.6 s single-core.** Comment corrected to *"not reachable by accident; reachable deliberately"*, and pinned with a **precomputed** fixture (`blob 03af16b`, nonce 7) so the test never runs the search.

### Accepted residuals — six, all open

- **R2** — path safety is **lexical**: `resolve()` does not follow symlinks, so a symlinked dir under `cwd` lets the hook read and hash a file outside it. Read-only; the only exposure is a blob id. Threat model is a **mistaken** driver, not a hostile one.
- **R5** — *"exact bytes"* is really a **UTF-8 text compare**; byte-exact for anything a JSON prompt can carry, and the hash leg checks true bytes.
- **R6** — a deny larger than the pipe buffer can be **cut at exit**. ⭐ Measured, not assumed: 200 000 bytes written → **65 536 arrive** on this macOS; `fs.writeSync` delivers all. Needs a ≥64 KiB deny reason.
- **R1 / R13** — a partial line with **anything glued after the cut** (a mid-paste elision, a `[... N chars truncated ...]` marker, an END fence not on its own line) is still driver text and can self-declare. ✅ The tail-cut shape is covered because the ship loop's fence sits on its own line.
- **R7 / R9 / R14** — ⭐ **the line-set narrowing cannot tell WHOSE a line is.** Three consequences, all pinned as documented behaviour: a driver-text pointer line byte-identical to pasted content is not gated; the **target's own pointer is un-gated** when a sibling plan on disk quotes it and is pasted in the same spawn; and the near-miss WARNING is silent on the same shape. ⛔ The occurrence-counting narrowing was **rejected by owner ruling** — it would flip a pinned case and stack a second position-blind heuristic on the first.
- **R3-noise** — the SKILL.md example pointer draws the WARNING. Accepted as designed: *looked at, not gated*.

### ⚠️ Two limits recorded beyond the caveats

- **A Build spawn that omits the pointer line entirely is invisible** — ungated, by owner ruling Q1. Closing it needs a machine-readable step marker in the driver's rule text.
- **An infrastructure fault degrades the proxy to nothing** — silently to the model, **loudly on stderr to a human**.

**Flagged for the producer:** `claude/README.md` does not yet list the new hook; and `0333` expects to re-derive the five-site marker list, whose step 5 is now a no-op it must notice.

## Related
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the `PreToolUse` deny shape this hook reuses
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why approval leaves no artifact, and caveat 1 can never be closed
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the declared-approval marker this checks a proxy for
- [[decisions/adr-014-how-fkit-tests-itself]] — the zero-devDeps rule `node` parsing satisfies
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — the coverage statements in this ledger
- [[systems/testing-and-verification]] — prove-red, now at 24 mutations
- [[systems/role-locked-sessions]] — `.fkit/settings/<role>.json`, the only place the hook is registered
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[tasks/amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction]] — *added 2026-08-29 (lint):* `0203`, which shipped the `unverified` marker this task removed at five sites, and named this task as the one to remove it
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — *added 2026-08-29 (lint):* `0162`, whose report commissioned this hook — ⛔ **and whose `carried-not-approved` residual this hook does NOT close**
- [[tasks/pressing-enter-at-the-role-menu-should-open-the-lead]] — *added 2026-08-29 (lint):* `0302`, a run whose plan pointer no hook checked because this had not landed; ⚠️ **and which this hook would still not have covered — a session gets it only at its next launch**
