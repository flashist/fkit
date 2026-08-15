# Backlog triage, part 2 of 4 — rows 0175–0213

Read-only triage of 27 open backlog rows (`0175`–`0213`) on 2026-08-14, HEAD `4424b44`, no active
sprint. **Counts: 23 `KEEP`, 3 `STALE-PREMISE` (`0177`, `0183`, `0193`), 1 `DONE-IN-FACT` (`0206`),
0 `SUPERSEDED`, 0 `DUPLICATE`, 0 `UNCLEAR`.** Every verdict was checked against the live tree, not
inferred from the board row alone — for each row I confirmed on disk whether the defect it names is
still present. The set is dominated by **record-accuracy work** (dated correction notes into ADRs,
closed briefs, closed review ledgers and the vault) and by a **five-task merit-statement chain**
(`0178` → `0179`/`0180`) plus a **five-task ADR-010 chain** (`0196`, `0197`, `0198`, `0199`, and
`0201`'s ledger half). ⚠️ **`size` values below are rough estimates, not measurements** — no
implementation planning was done for any row.

| id | verdict | theme | size | depends | evidence |
|---|---|---|---|---|---|
| 0175 | KEEP | testing | M | `0168` — **hard, still OPEN** (`ai-agents/tasks/backlog/0168-remediate-the-dead-brief-paths-in-closed-review-ledger-headers/`) | Guard for a schema `0168` has not yet applied. Row is explicit the guard is *"regression cover for the sweep"* and is *"worth little before the sweep exists"*; `0168` is still in `backlog/`, so the gate is live. Owner ruled it LOW and sequenced-after — do not promote without a new ruling. |
| 0176 | KEEP | testing | M | `0237` — **hard, still OPEN** (`ai-agents/tasks/backlog/0237-clean-the-coordination-citation-residual-set-that-blocks-0176/`) | The row already carries its own **dated correction 2026-08-06** naming `0237` as the cleanup owner and warning *"do NOT build this guard against the glob as written"*. That correction is still accurate. ⚠️ `ai-agents/tasks/backlog/0176-.../brief.md:115` still lists `ai-agents/sprints/sprint-2.md` — a path that no longer exists (now `sprints/done/sprint-2.md`), which is the exact defect the row's own correction predicted; **self-flagged, so not scored stale.** |
| 0177 | STALE-PREMISE | testing | S | none | Work still needed — `test/rules-block-budget.test.js:26-27` still reads *"The codex side (AGENTS.md, codex-cli 0.145.0) was **NOT** re-measured; assume it still pays."* **But the row's fence is stale**: it says *"⛔ no `RULES_MAX` change (stays 4096)"* while the live value is `claude/fkit-claude-init.sh:337` → `RULES_MAX=4352`. The prohibition names a number that no longer exists on disk, and the `404 B` wrapper figure is measured against the old cap. Re-measure both before scoping. |
| 0178 | KEEP | process | S | none | Deliverable absent: `grep "On merit" ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` → **zero hits**. The convention page still does not carry the merit-statement grammar. It is a **doubly hard gate** — `0179` and `0180` both need it, and `0180`'s owner ruling makes this page's date the guard's cut-off boundary. |
| 0179 | KEEP | process | S | `0178` — **hard, still OPEN** | `claude/skills/fkit-task-brief/SKILL.md:141` `### 5. Determine priority` is unchanged and still mandates the legacy shape for appended rows only. Row's flagged **file collision with `0181`** (both edit step 5) still stands. |
| 0180 | KEEP | testing | M | `0178` + `0179` — **both hard, both still OPEN** | Guard not built. Row carries a **dated correction 2026-08-06** recording the owner's verbatim ruling *"Grandfather existing briefs."* — the 28-brief backfill is off, exempt-by-date is on. ⚠️ That ruling makes `0178` a **doubly** hard gate: the boundary date is the convention page's date and does not exist yet. |
| 0183 | STALE-PREMISE | docs | S | none | The falsehood is **still live in both records** — `ai-agents/sprints/done/sprint-2.md:3312` (*"and **no closed row was renumbered by the insertion**"*, under the `### ⚠️ One row was inserted mid-board…` heading) and `ai-agents/tasks/done/0174-.../brief.md:176` (same clause). Neither carries a correction note. **But the brief's target path is dead**: `ai-agents/tasks/backlog/0183-.../brief.md:78` names `ai-agents/sprints/sprint-2.md`; Sprint 2 is archived to `ai-agents/sprints/done/sprint-2.md`. Work stands, coordinate does not. |
| 0184 | KEEP | process | S | none | Deliverable absent: `ai-agents/knowledge-base/conventions/dependency-declaration-form.md` exists in **both** homes but `grep "advisory\|binding"` → **zero hits**; the three-carrier ruling is unrecorded. The row's own 2026-08-03 re-scope (owner ruling *"re-scope it to the surviving half"*) is still the correct scope. ⚠️ Its `after 0173` trap warning — writing a bare `Depends on: 0173` would flip two truthful `ready` rows false — is unchanged and still binding. |
| 0186 | KEEP | docs | S | none | `grep -n "audience-adapted" ai-agents/knowledge-base/decisions/adr-027-*.md` → **zero hits**; the ADR still models only two kinds. The authoritative list the amendment must point at **does** exist and already uses the term — `test/dual-home-parity-exceptions.mjs:16,29,114` (`kind` is one of `'audience-adapted' \| …`). So the code moved ahead of the ADR: the ADR's byte-align mandate is still a live instruction to ship a regression. |
| 0187 | KEEP | process | S | none | Still undischarged and the record says so in terms: `ai-agents/tasks/done/0133-build-dual-home-parity-test/worklog.md:93` — *"**This does not retire the owner's accepted risk on 0112.**"* — and `:208` — *"**Still open, and NOT retired by this task: the 0112 manual re-verification.**"* Minor: `brief.md:100` cites `ai-agents/sprints/sprint-2.md` (archived path), but it is a passing reference, not the deliverable. |
| 0188 | KEEP | docs | M | none | **All five defects verified live today.** D1: `claude/scaffold/CLAUDE.md` — `grep "task-brief"` → **zero hits**, producer row still omits it. D2: `ai-agents/knowledge-base/architecture.md:145-146` — *"Only `fkit-query` carries no banner"*. D4: `claude/skills-for-role.sh:12` — *"**FOUR** hand-maintained places MIRROR this list"*. D5: root `CLAUDE.md:32` — *"turned off, **invisible** and unrunnable"*. (D3's dead `skills_for_role()` line citation sits in the same `architecture.md` block.) D1/D5 ship into every consuming project and into every session's context. |
| 0189 | KEEP | testing | L | `0188` — **hard by owner ruling** (*"do not let the build quietly repair its own corpus"*), **still OPEN** | `ls test/skill-ownership-sites.mjs` → **No such file or directory**. Registry not built. ADR-036 clauses 2–5 are recorded and accepted, so this builds rather than re-opens. Largest row in this range — 39 rows / 21 classes / 61 files, plus a ~13.9k-char verbatim spec block. |
| 0192 | KEEP | process | M | none (adjacency to ADR-034 / `0169`) | The collision is unresolved on disk: `claude/skills/fkit-task-done/SKILL.md:173-176` still tells a closing producer to re-point a sibling's `review.md` href — *"same rule: re-point the href, change nothing else … They record what happened, not where a file lives"* — the contrary conclusion to the owner's instance-B ruling. Investigation + ruling; *"no change"* is a valid finding. **`0201` is declared to depend on this.** |
| 0193 | STALE-PREMISE | docs | M | none (adjacency to `0178`, conflict with `0180`) | Defects still live — `ai-agents/tasks/done/0158-.../brief.md:29` reads `ai-agents/sprints/sprint-2.md:245-249`, `:100` cites the non-existent `claude/universal-rules.md`, `:195` reads *"On merit this belongs at 122"*. **But the brief's own repair and verification steps are dead as written**: 5 references to `ai-agents/sprints/sprint-2.md` (`brief.md:53,119,133,154,158,163,165`), including verification commands `git diff ai-agents/sprints/sprint-2.md` — Sprint 2 is archived to `sprints/done/`, so those commands now prove nothing. The brief already warns *"⚠️ THIS BRIEF DECAYS"*; it has. |
| 0194 | KEEP | testing | S | `0189` (**still OPEN**), `0190` (**DONE**), `0191` (**DONE**) — brief declares all three at `brief.md:88` | Two of the three prerequisites have discharged since filing: both ADR-037 clause sites now exist. **Only `0189`'s registry remains** — `test/skill-ownership-sites.mjs` is still absent, so the row's *"if `test/skill-ownership-sites.mjs` still does not exist the task is `🚧 Blocked`, not done"* condition still bites. The row's *"three prerequisites, all open"* wording is out of date; the task itself is unchanged and correctly filed as a separate row. |
| 0196 | KEEP | docs | S | none (serialize with `0195` — DONE — and `0197`) | Both target sites uncorrected: `adr-010:30-32` still describes `skillOverrides` as *"hidden from the `/` menu **and unrunnable by name**"* with no note beneath it. `0143`'s own parenthetical at `adr-010:73` still reads *"deliberately **not** corrected in this pass … filed as a follow-up"* — this is that follow-up. Its serialization partner `0195` has **closed**, so the file is free. |
| 0197 | KEEP | docs | M | `0171` — **soft**, still OPEN (supplies the anchor form) | ADR-010's `path:NNN` pointers are untouched — `claude/fkit-claude.sh:151-187`, `:14-18,192-199`, `:75-103` all still stand as written at `adr-010:26-32`, per the ADR's own append-only rule. The never-assessed `claude/scaffold/CLAUDE.md:12-50` pointer is still unassessed. Investigation-first; *"nothing needed repair"* is a legitimate outcome. |
| 0198 | KEEP | process | S | none (`0205`/`0207` follow it if it lands first) | Verified absent: `grep -ic "amend" claude/skills/fkit-record-decision/SKILL.md` → **0**, `grep -c "correction note"` → **0**. The skill still has no notion of amending an ADR. This is the row that makes `0196`, `0197`, `0205` and `0207` cheaper rather than more expensive — four open rows in this range alone must re-derive the form from `done/` without it. |
| 0199 | KEEP | wiki | M | none (must run **after** `0196`/`0197`) | The stale framing is live: `ai-agents/wiki-vault/index.md:187` still reads *"a dated correction note is the sanctioned fix, and it is **still open**"* for task `0140`/ADR-010 — false since 2026-08-02. ⚠️ Its serialization partner `0195` has closed and `0196`/`0197` have not, so the brief's *"if `0195`/`0196`/`0197` land first the page must describe THAT state"* warning is now half-triggered — **re-read ADR-010 before writing**. `fkit-wiki` only (ADR-005). |
| 0201 | KEEP | process | M | `0192` — **hard, declared in the safe direction, still OPEN**; plus a **non-dependency precondition: explicit owner authorization to write into two closed folders** | All three defects verified live: `0158`'s ledger still reads `Status: in-review` at `ai-agents/tasks/done/0158-.../review.md:5` while the task is closed; neither `0143`'s nor `0158`'s ledger carries any dated correction note (`grep "Dated correction\|CORRECTION"` → zero hits in both). ⚠️ The row states plainly *"NOTHING HERE WARRANTS A REOPEN ON ITS MERITS"* — record accuracy only. |
| 0204 | KEEP | testing | L | `0202` — **hard gate, now DONE** (`ai-agents/tasks/done/0202-…`); brief declares it at `brief.md:124` | ⚠️ **The gate has discharged: the driver now writes `plan.md` at approval** — `claude/skills/fkit-sprint-ship-loop/SKILL.md:81,122` (*"on approval the DRIVER writes the approved text to `<task-folder>/plan.md` verbatim"*), which is exactly caveat 2's precondition. Hook absent from `claude/*.sh`. Caveat 5 still holds: no `.claude/settings.json`, and `.claude/settings.local.json` has **no `hooks` key** — launcher sessions only. **`0204` is the only thing standing between the ship-loop and five enumerated honesty markers it must delete** (`SKILL.md:201-214`, list items 1–5), and the SKILL says the removal *"is `0204`'s to make, not a separate task."* |
| 0205 | KEEP | docs | S | none (`0198` related, not blocking) | Uncorrected: `ai-agents/knowledge-base/decisions/adr-037-*.md:249` still reads *"There is no mechanical enforcement, and **none is possible**"*, with no note beneath. `0204`'s existence proves the narrowing is real. ⛔ Wording constraint stands: it must **not** say condition (b) itself is machine-checkable. |
| 0206 | DONE-IN-FACT | wiki | S | none (`brief.md:67` — *"Depends on: nothing"*) | **The vault page exists and satisfies verification steps 1–5.** `ai-agents/wiki-vault/log.md:1081` records the create: report + `0162`'s brief → `[[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]]`. Step 2 (checkable vs testimony) — that page's `:14-15` and `:53` (*"### What is machine-checkable — stated narrowly on purpose"*). Step 3 (`carried-not-approved`) — `:60`, *"### ⛔ The accepted residual `carried-not-approved` — open, structural, and NOT closed by `0202`"*. Step 4 (back-link at current path) — `:3` cites `ai-agents/tasks/done/0162-…/brief.md`. A later sync at `log.md:1937` confirms the report is *"Untouched … not in the delta"*, i.e. already ingested. **Propose closing; the owner rules** (ADR-025). |
| 0207 | KEEP | docs | S | none | Uncorrected: `ai-agents/knowledge-base/decisions/adr-020-*.md:34` still reads *"two new git-tracked, **coder-written**, task-id-keyed artifacts"* while the shipped behaviour (`0202`) has the **driver** writing `plan.md`. ⛔ The row records that Codex's opposite fix (driver delegates the write) was **ruled out** by reviewer and owner — do not re-weigh. |
| 0209 | KEEP | process | S | none | Both schemas unchanged and still identical: `claude/skills/fkit-stateful-review/SKILL.md:74` and `claude/skills/fkit-process-stateful-review/SKILL.md:85` both list `pending approval · ✅ done · won't fix (frontier) · disproven · closeout (re-litigation) · blocked` — no *"out of scope by owner ruling"* value. ⚠️ Both files must change in the same edit or the ledger forks. |
| 0212 | KEEP | wiki | S | none (⛔ must not overlap `0211`, which is **DONE**) | `grep -c "still open" ai-agents/wiki-vault/log.md` → **20 hits**; the two targeted frozen entries are untouched, as the owner's append-only ruling requires. `0211` closed today's-era and its correction entry exists, so the *"two separate entries, deliberately not merged"* boundary is still the right shape. `fkit-wiki` only (ADR-005). |
| 0213 | KEEP | process | S | none (source: `0211` R1 residual; `0211` is **DONE**) | Verified absent: in `claude/skills/fkit-wiki-lint/SKILL.md` every `log.md` mention is still a **write** (`:52` *"Log it. Append to …"*), an explicit **non**-input (`:66` *"`log.md` is not a signal"*), or the crying-wolf rationale (`:204,208`). **No read step exists.** Owner ruled remedy **A** on 2026-08-03; ⚠️ A overturns a deliberate stance, so the new step must reconcile with both passages in the text. |

## Rows I could not judge

**None.** Every one of the 27 was decided against a first-hand check on the live tree. The three
`STALE-PREMISE` verdicts are the closest to a judgement call, and in each the stale element is a
**path or a number I verified is wrong on disk**, not an inference:

- `0177` — the fence *"stays 4096"* against `claude/fkit-claude-init.sh:337` → `RULES_MAX=4352`.
- `0183` — target path `ai-agents/sprints/sprint-2.md` against `ai-agents/sprints/done/sprint-2.md`.
- `0193` — same dead path, but **five times**, including inside its verification commands.

The one verdict the owner should sanity-check is `0206` (`DONE-IN-FACT`): I verified steps 1–5 of its
own verification list are satisfied by the existing vault page, but steps 6 (`/fkit-wiki-lint` clean)
and 7 (change surface confined to the vault) are properties of a **run**, not of the tree, and cannot
be checked after the fact. **I propose closing it; I have not closed it and will not** — cancellation
and closure are owner-ruled per task (ADR-025 / ADR-033).

## Cross-cutting observations

1. **The archived-sprint path rot is real and it is inside briefs, not just boards.** Four of my 27
   briefs reference `ai-agents/sprints/sprint-N.md` — a path that stopped existing when the sprint
   boards moved under `sprints/done/`: `0176` (2 refs, **self-flagged** by its own dated correction),
   `0183` (1, the deliverable target), `0187` (1, passing), `0193` (**5, including verification
   commands**). ⚠️ Two of these — `0183` and `0193` — are *citation-repair* tasks whose whole value is
   coordinate precision, so they now carry the defect class they exist to fix. **Worth a sweep across
   all four triage parts**, not just this one. This is the same shape as the canonical `0272` example
   the brief cited.

2. **A five-row chain hangs off one small unwritten convention page.** `0178` (write the merit
   grammar) gates `0179`, and `0178`+`0179` gate `0180`; the 2026-08-06 grandfathering ruling made
   `0178`'s **date** the guard's cut-off, so `0180` cannot even be defined until `0178` lands. `0178`
   is an `S` — probably the highest leverage-per-hour row in this range.

3. **A second chain hangs off one unwritten skill step.** `0198` (teach `/fkit-record-decision` the
   dated-correction-note form) is *related, not blocking* for `0196`, `0197`, `0205`, `0207` — but
   all four write the same three-part note form, and without `0198` each re-derives it from a closed
   task folder. Four independent re-derivations is exactly how a form forks. **Sequencing `0198`
   first is a scheduling choice, not a dependency change.**

4. **`0204` is now unblocked and it is load-bearing for the ship-loop's own honesty.** Its hard gate
   `0202` closed, and the driver-writes-`plan.md` behaviour it needed is live at
   `claude/skills/fkit-sprint-ship-loop/SKILL.md:81,122`. Until it lands, the ship-loop emits an
   `unverified — no hook checks it until 0204's carry-check hook lands` marker on every spawn; the
   day it lands, **five** enumerated sites in that SKILL.md become false and must be deleted **in the
   same change** (`SKILL.md:201-214`). ⚠️ It does **not** close the `carried-not-approved` residual
   and must not be written up as if it does.

5. **This range is mostly documentary, and mostly small.** By theme: `docs` 8, `process` 8,
   `testing` 6, `wiki` 3, plus `0206` already done. By size: **17 `S`, 8 `M`, 2 `L`** (`0189`,
   `0204`). ⚠️ **Small does not mean cheap here** — several `S` rows carry two or three owner rulings
   apiece that a worker must read and must not re-litigate (`0176` carries two rulings plus four
   scoping decisions; `0180` and `0213` each carry a ruling that overturns a deliberate prior
   stance). The reading cost is the real cost.

6. **Three rows in this range are `fkit-wiki`-only** (`0199`, `0206`, `0212`) and one more
   (`0201`) writes into closed review ledgers. If the owner scopes any of them into a sprint, the
   ship-loop must route them to `fkit-wiki` rather than a coder (ADR-005, a universal hard rule that
   outranks the loop's step table), and `0201` cannot start at all without an explicit owner
   authorization to write into two closed folders.

7. **Five rows sit behind still-open dependencies outside my range**: `0175`→`0168`,
   `0176`→`0237`, `0189`→`0188`, `0194`→`0189`, `0201`→`0192`. Only `0188` and `0192` are inside my
   27; `0168` and `0237` belong to other triage parts, so a **cross-part dependency merge is needed**
   before anything here is sequenced.
