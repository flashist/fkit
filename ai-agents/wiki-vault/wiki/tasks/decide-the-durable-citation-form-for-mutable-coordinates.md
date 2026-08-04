# Decide the durable citation form for mutable coordinates

**Source**: `ai-agents/tasks/done/0160-decide-the-durable-citation-form-for-mutable-coordinates/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0160` · owner `fkit-architect`

**Decision report**: `ai-agents/knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md` (1472 lines) — the authoritative record. This page is a synthesis; where the two differ, the report wins.

## Goal

**An investigation, deliberately not an implementation.** The defect was known and measured; **the fix was not**, and three artifact classes cite each other by coordinates that move without obviously wanting the same answer — one of them collides head-on with a design rule fkit deliberately holds. Per the investigation-first rule, no implementation brief was pre-written.

**The class:** a citation is supposed to save the reader a lookup. A citation to a **mutable coordinate** does the opposite — when the coordinate shifts, the citation still *reads* authoritative and is silently wrong, so the reader who trusts it is misdirected **and never learns to check**. **Nothing in this repo detects the moment it goes stale.**

## Key Changes — the rule, and five cases

### The rule (report §1)

> **A coordinate is safe to cite when the citer controls or freezes the target's revision. It is unsafe when a third party edits the target after you write.**
>
> **Line numbers are for findings against a revision. Names are for cross-references into living documents.**

| If the target is… | …then |
|---|---|
| A source file, test, skill or agent file, cited in a design doc or a finding | **`path:NNN` is correct** — edits arrive as a reviewed diff *to the thing you cited* |
| A file **under review**, cited in a review ledger row | **`path:NNN` is correct — as a claim** about the revision the reviewer read |
| A **coordination document** others append to (`ai-agents/sprints/*.md`, task briefs, `ai-agents/wiki-vault/log.md`) | **`path:NNN` is wrong** — third parties append *above* your line |
| A **task** | **the folder-name `NNNN` prefix**, always (ADR-029 Decision 3) |
| A **board position** | **`P<n>`, and only as rank** |

⚠️ **The fast one-question test does not decide the table, and the report says so against itself.** The question *"am I claiming something about a revision I have read, or pointing a later reader at wherever the target will be?"* cleanly decides **one row of five**. Applied alone, a writer gets the coordination-document row **wrong in the unsafe direction**. **Both conditions must be read together** — the claim-versus-pointer question *and* whether a third party edits the target under you.

### §1.1 — the rider that matters more than any ban

> **Never cite a line number naked.** Pair every `path:NNN` with a quoted fragment or the heading it sits under.

Named the **single highest-value recommendation in the report**, applying to all four cases at once. A naked pointer that has drifted is indistinguishable from a correct one; a pointer carrying its quote is **self-correcting**. Cost to the writer: one clause.

### The five cases

- **Case 1 — board rank in prose.** Out of scope, hard: already owned by [[tasks/state-task-brief-step-5s-append-rule-in-full]] (`0157`) and [[tasks/sweep-the-stale-rank-citations]] (`0159`).
- **Case 2 — `path:NNN` into a growing file. Ruled: narrow, do not ban.** Keep `path:NNN` for code, tests, files under `claude/`, and review findings; **stop** using it for coordination documents. Replacement anchor: the row's task folder ID, or a quoted fragment. ⚠️ **The brief's diagnosis was directionally right and mechanically wrong** — it implied *fast* drift; measurement showed drift is **slow**. *Slow drift is worse*: a pointer wrong by four lines lands on a **neighbouring board row of identical shape** and still reads authoritative. **A ban stops new bad pointers; only a paired quote makes an already-drifted one detectable.**
- **Case 3 — the dead folder path in a review ledger. Owner-ruled 2026-08-01: option (a).** The ledger schema carries the **task folder ID** going forward — `Task: 0159` — with any live link **beside** the ID, never in place of it; plus a **one-time normalization of the 40 existing dead headers**. This costs the writer nothing: the ID is already in the folder name the file sits in. ⚠️ **This is not "just repair the path"** — repairing it means editing a **frozen document**, the thing the ledger rule exists to forbid. **Scope note the sweep must not miss:** the header is not the whole corpus — **42** ledgers carry at least one dead path against 40 dead headers, and **55** distinct dead paths exist corpus-wide.
- **Case 4 — mutable coordinates in the wiki completion flag. Ruled IN, but corrected: half of it already shipped.** See below.
- **Case 5 — ruled OUT OF CLASS by name, and handed back** as its own follow-up: *how does an owner record a merit ordering that board rank can no longer carry?*

### Case 4 in full — because it lands on this vault's own procedures

The candidate rule was *"folder ID and brief path only; no board rank, no `P<n>`, no `:NNN`"*.

- **The rank half already shipped** in all three wiki skills ([[tasks/wiki-flag-carries-folder-id-and-brief-path]], `0153`). *The brief proposed it as new. It is not.*
- **The `:NNN` prohibition is ruled IN** — the existing blocks ban rank and say nothing about line numbers.
- ⚠️ **The mandated flag template hardcodes `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md` — so the flag is itself a dead-path generator.** A `complete` flag says *ready to close*, and the folder leaves `backlog/` in the same session: **the path is dead before anyone reads it.** A `partial` flag is **correct at emission and dies later** — which is *worse to detect*, being demonstrably correct when written. **A review ledger quoting the flag verbatim preserves the dead path forever**; the specimen is `0148`'s own ledger.
- **The brief-path half was NOT ruled by the report** — it was raised as open question 7 and left for the owner. ✅ **The owner ruled it on 2026-08-01, via `AskUserQuestion`: folder ID only, no path at all** (e.g. *"Task 0148's vault work is complete — ready to close"*). ⚠️ **The report at `HEAD` still records this question as open** — it was written before the ruling; the ruling is relayed here from the driver session and is not yet in the report's own text.
- **Ownership boundary:** the flag block lives in `claude/skills/fkit-wiki-*/SKILL.md`. **The wiki role may not edit it** — it is a producer-then-coder follow-up, and the three files still carry the defective form today.

> ✅ **Dated correction 2026-08-03 (lint) — *"the three files still carry the defective form today"* is FALSIFIED, and Case 4 is implemented.** The bullets above are left byte-identical as this page's record of its 2026-08-01 ship date. [[tasks/tighten-the-wiki-completion-flag-block]] (`0173`, closed 2026-08-03) landed the producer-then-coder follow-up: the path is gone from **both** template lines in all three wiki `SKILL.md` files, the `:NNN` prohibition is in, and the routing line resolves `<NNNN>` by glob. **This also discharges follow-up 5 in the table below** — its `producer to file` cell is likewise history. ⚠️ **One clause above is NOT superseded and still holds:** the report's own §11 still records open question 7 as *"⏳ Awaits the owner"*, because the owner ruled after the report was finalised and the ruling travelled in `0173`'s brief instead — a reader who consults §11 alone still finds this unruled.

## Outcome

Done, **agent-closed — not owner-verified**. Four review rounds, Codex coverage FULL throughout.

**Eight follow-ups named, none written** — naming them was the deliverable:

| # | Follow-up | Owner |
|---|---|---|
| 1 | A citation convention page `conventions/durable-citation-anchors.md`, **dual-homed** (owner-ruled) | `fkit-architect` |
| 2 | Narrow the architect agent's `## Output format` bullet | producer to file, coder to edit |
| 3 | Change the review-ledger schema line to a folder-ID anchor — both stateful-review skills | `fkit-coder` |
| 4 | One-time normalization of the 40 dead headers | `fkit-coder` |
| 5 | Tighten the wiki flag block — add the `:NNN` ban, replace the hardcoded `backlog/` path | producer to file |
| 6 | Case 5 handed back as its own task; **the owner ranks it explicitly at filing** | producer to file |
| 7 | A dead-ledger-path guard — **named, filed LOW, sequenced after 3 and 4** | `fkit-coder` |
| 8 | A coordination-citation policy guard, carrying two owner rulings from day one | `fkit-coder` |

⚠️ **Follow-up 8 ships knowingly incomplete.** It runs on the **literal full-path** form only — the one reproducible reading — and **will not flag the bare-filename specimen the report names first**. Extending it is a separate named decision with its own measured cost, not a fold-in. Its exemption for citations already inside closed `done/*/review.md` ledgers is an owner ruling: without it the guard is red on 27 citations in frozen historical ledgers the owner has ruled will not be cleaned.

⚠️ **Two parity warnings, verified firsthand rather than taken on trust.** The two stateful-review skills' schema blocks are **not** byte-identical — they differ by two role-relative annotations — so follow-up 3's instruction must be *"change the `Task:` line identically in both"*, never *"make the blocks byte-identical"*. The same applies to the three wiki skills: sync's block differs from ingest's and lint's by leading indentation only, and an editor told *"byte-equivalent"* would normalize it and produce a diff nobody asked for.

**The report reported a method defect of its own** — a segmentation classifier keyed on `✅ Done` appearing *anywhere in the row*, which false-positived on a row whose *description* contained the string while its status cell read `🔲 Backlog`, producing wholly wrong figures. Re-keyed to the status cell alone. *It was my evidence-gathering that was broken.*

## Related

- [[tasks/sweep-the-stale-rank-citations]] — `0159`, Case 1's repair half
- [[tasks/state-task-brief-step-5s-append-rule-in-full]] — `0157`, Case 1's rule half
- [[tasks/disambiguate-the-frozen-history-clause]] — `0161`, the sibling that lands first by preference
- [[tasks/wiki-flag-carries-folder-id-and-brief-path]] — `0153`, whose template Case 4 corrects
- [[tasks/tighten-the-wiki-completion-flag-block]] — `0173`, which implements Case 4 — **on a ruling that is not in this report**: §11 still reads *"⏳ Awaits the owner"*, and the owner ruled after the report was finalised
- [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] — `0211`, which records the flags already emitted in the old form, and establishes **"describe, don't quote"** as the standing form for vault corrections
- [[tasks/wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner]] — `0148`, the near-miss that produced Case 4
- [[tasks/implement-task-folder-name-scheme-change]] — `0103`, the rank-vs-identity convention
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — Decision 3, the permanent ID
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — its bearing, stated in both directions
- [[systems/review-and-model-diversity]] — the ledger whose schema changes
- [[systems/knowledge-base-structure]] — where the new convention page lands
- [[tasks/wiki-skills-flag-ready-to-close]] — `0125`, whose flag block Case 4 rules on
- [[tasks/correct-claude-mds-stale-skills-for-role-location]] — `0151`, a live specimen: its fix turned one line into three and invalidated every `CLAUDE.md:43` citation
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — whose dated correction notes carry `:NNN` tree coordinates this ruling governs
- [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] — `0120`, whose `CLAUDE.md:43` citation is a naked-pointer specimen
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — **a mid-board insertion is NOT the owner-ruled re-rank exception** — forced by arithmetic, not policy
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174` — the merit-ordering ruling; **the task that became its own proof case**
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — ADR-037 follows this citation form throughout — heading plus quoted phrase, never a naked `:NNN`
- [[tasks/decide-whether-a-spawn-instruction-may-override-a-skill-rule]] — task `0158` — whose own brief broke it in two places, one of them the exact stale-pointer failure ruled on here
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162` — two more instances of the stale-coordinate arc, both off by one line
- [[tasks/append-a-dated-correction-note-to-adr-010]] — task `0143` — the no-`:NNN` note form, whose own citations survived an append that broke **12** sibling pointers
- [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — task `0195` — the same form carried forward as an accepted residual (**permitted, not mandated**)
