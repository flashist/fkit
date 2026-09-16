# The two citation sweeps — `architecture.md` outbound/inbound, and the repo-wide `ADR-NNN:LINE` class

**Source**: `ai-agents/tasks/done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 9 · `P7` · `0393` · ✅ Done (agent-closed — not owner-verified)

## Goal

⭐ **The sentence this row exists to prove is the convention page's own:** *"A citation form is only as
good as the pattern that finds violations of it."*

⛔ **`P7` is NOT a merit judgement.** ⭐ **On merit it sits second, directly below `0392`** — it is the
largest row on the board. **It is ranked last because it cannot start earlier.**

## Key Changes

### ⛔⛔ The two halves are not the same size, and one is not an `architecture.md` task

⛔ **Group E is REPO-WIDE**, a case-insensitive `ADR-NNN:LINE` sweep across `ai-agents/` and
`claude/`; `architecture.md` contributes **exactly one** site to it. ⚠️ **Stated prominently because
the row's title and its sibling both say `architecture.md`, and a reader who scopes Group E to that
file scopes it to roughly one percent of its real size.** ⭐ **Group E alone is larger than everything
else in this row and its sibling combined.**

### ⛔ `0286` was already PARTLY satisfied — and by Sprint 7, not Sprint 8

| | State at pickup |
|---|---|
| **Half A, outbound** | `0356` (commit `351bea3`, **2026-09-04, Sprint 7-era**) replaced **six of seven** named coordinates; the durable heading-plus-fragment form is now the file's dominant style |
| **Half A, the census** | ⛔ **Evidenced nowhere** — `0356` ran a **class** sweep, not `0286`'s per-citation census |
| **Still stale** | ⚠️ **At least SEVEN outbound coordinates wrong or drifted**, out of ~28 remaining |
| **Half B, inbound** | ⛔ **Untouched. No part of it had been done by anything** |

⛔ **`0286`'s own brief records neither its split nor its partial completion** — it still reads as
though both halves are outstanding. ⭐ **So `D0` begins by re-establishing what half A actually
covered, rather than trusting either brief.**

### ⛔⛔ D4 binds everywhere, and the split made it STRONGER

> **Correct the citation, never the prose.** If a claim looks wrong, **report it — do not fix it.**
> ⭐ *"Repairing a coordinate that supports a false sentence would make the sentence look verified."*

⛔ **After the split this row has NO prose-repair exception at all** — the consolidated row's
exceptions were Groups A–C and they went to `0392`. ⛔ **§9.5's stale anchors are `0392`'s Group C
alone**, which repairs the anchor **and** the false claim **together** — the only safe treatment, and
exactly why `0356` reported instead of repairing.

⛔ **`D5`: re-derive the shift map from disk, never inherit one** — `0286`'s own table was a correction
of a recorded `+4` that was wrong. ⛔ **Where a shifted line falls inside a rewritten range, arithmetic
does not apply** — re-derive by reading what the citing text claims and finding it.

### ⭐⭐ Two owner rulings narrowed the declared scope, and neither touched the exemptions

1. **2026-09-14, verbatim *"Whole class, case-insensitive (Rec)"*.** ⛔ **The owner's stated reason:
   under the narrow scope, criterion 4 reads as MET while roughly 320 occurrences still stand.**
2. **2026-09-14, verbatim *"Include untracked + a specimen class (Rec)"*.** ⛔⛔ **The declaration is a
   COMMAND, not a number:** `git grep --untracked -oihE 'adr-[0-9]{3}:[0-9]+' -- .`, plus whatever
   exemption pathspecs the plan gate declares, **recorded as run**. **472 / 71 with `--untracked`,
   against 446 / 67 tracked-only.**

⚠️ **What stayed `0393`'s plan-gate call: the exemption list alone** (`wiki-vault/`, closed task
folders). ⛔ **Two rulings narrowed case, then tracking. Neither touched the exemptions.**

### ⭐⭐ The fourth triage class — `mentioned`

**A `mentioned` coordinate is one the sentence is TALKING ABOUT rather than USING to point a reader
somewhere** — a sample of the defect, a triage target, a dated measurement result.
⛔⛔ **Repairing one CORRUPTS THE RECORD OF THE VERY CLASS THIS ROW IS SWEEPING.**

**The test, identical at every site:** *replace the line number with the correct one — **does the
surrounding sentence become FALSE?*** **YES → `mentioned`, leave it byte-identical. NO → live
citation, repair it.**

⚠️ **It is a READING judgement, not a mechanical one** — a use and a mention are lexically identical,
so no pattern separates them. ⛔ **A genuinely ambiguous site is recorded `mention?` and raised, never
guessed** — a wrong "repair" is unrecoverable from the diff alone, because the corrupted text still
looks well-formed. ⛔ **`mentioned` is a VERDICT YOU RECORD, not a step you SKIP.**

⭐ **They cluster rather than scatter: 26 of them sat in four files** — this brief, `0394`'s, `0392`'s,
and the Sprint 9 board — **because those are the documents *about* the defect.**

### ⭐ `ADR-013`'s five coordinates — triaged individually, and one had moved AGAIN

⛔ **One treatment for the sentence was refused.** At least three had drifted, at least one had not:
`ADR-009:131` **still lands correctly** — ⭐ **the don't-repair-what-works check** — while `ADR-010:130`
had **drifted a second time**, onto different text than `0323` recorded. ⛔ **`ADR-013`'s
`- **Status:** accepted` does NOT change: a drifted fact never makes an ADR `superseded`.**

## Outcome

### ⭐ What landed in the vault's line of sight, measured on disk 2026-09-16

**Nine ADR pages' sources gained dated 2026-09-15 `0393` correction notes** — ADR-009, 010, 011, 013,
017, 022, 028, 031 and 042. ⭐ **Those notes were ingested into this vault by the previous sync pass
(2026-09-16), and ⛔ no decision was reopened on any of them.** ADR-028's note is a worked example of
the form: *"the two `architecture.md` line pointers in this item no longer land … The item is **left
byte-identical** as the record of what was verified on 2026-07-19"*, with the passages relocated by
heading and quoted text beside it.

### ⛔ `E6` routed the vault's own sites here — and this sync triaged them

**`E6`: report `ai-agents/wiki-vault/`'s count and paths for routing to `fkit-wiki`. ⛔ No write to
the vault, ever** ([[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]).

⭐ **Measured by the wiki role, 2026-09-16: 28 occurrences across 5 vault files** — `log.md`,
[[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]],
[[tasks/amend-project-brief-for-the-eighth-role]],
[[tasks/refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role]] and
[[tasks/write-the-durable-citation-anchors-convention-page]].

**Triaged under `E2`'s four classes:**

| Verdict | Count | Reasoning |
|---|---|---|
| ⭐ **`mentioned`** — leave byte-identical | **25** | Triage tables, survivor lists, sweep records and dated measurements. ⛔ **The vault is the archetype of E2's clustering finding: these are documents *about* the defect** |
| ✅ **correct** — leave | **1** | `ADR-008:85` on the ADR-022 page. ⭐ **Re-resolved this sync: line 85 still reads *"a tool allowlist without Write/Edit does not stop `Bash` from writing files"*** |
| ⛔ **drifted, live** — repaired | **2** | Both cite `ADR-028:154`. ⚠️ **That line now reads a *"do not re-raise"* bullet, not the clause it is cited for.** Repaired this sync to heading-plus-quoted-fragment form |

⛔ **Zero vault sites were "repaired" from the `mentioned` class** — doing so would have corrupted the
record of the very class `0393` swept.

### ⛔⛔ The growth figure this row's own census banned

⛔ **The *"+8 occurrences and +5 files in one day"* figure is NOT reproducible and must not be cited as
measured fact — anywhere, by anyone.** ⚠️ **It was relayed to the owner as measured fact more than
once, inside a question the owner then ruled on.** ⛔ **None of the four prior measurements recorded
its scope, so none can be checked against another.** ⭐ **The guard row `0394` stands on the better
reason: a class whose census cannot be reproduced across five measurements has no machine-checkable
definition, and supplying one is exactly what a guard does.** ⛔ **What is NOT established is the rate.**

⚠️ **`D8` — whether a guard test can catch stale line citations mechanically — was framed as genuinely
open**, with *"infeasible"* named a legitimate answer: the weak form catches almost nothing, the strong
form needs a quotable anchor the corpus mostly lacks, and **a noisy guard people learn to ignore is
worse than none.**

## Related
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]]
- [[tasks/architecture-md-prose-repair-9-1-inventory-occurrence-b-and-9-5]]
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]]
- [[tasks/write-the-durable-citation-anchors-convention-page]]
- [[tasks/build-the-coordination-citation-policy-guard]]
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- [[systems/knowledge-base-structure]]
