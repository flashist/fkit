# Correct the ADR text defects `0393` reported — ADR-016's "Zero hooks", ADR-001's banner pointers, and ADR-009's stray `</content>` line

## ID
0398

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

⚠️ **Producer judgement, flagged.** No ruling assigns it. ADRs are produced by `/fkit-record-decision`,
the architect's skill, so
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
Decision 1 points at the architect; `0393`'s ADR drift notes were also written under an architect
owner field. The competing reading — a dated note is a coordination-doc repair, which the skill-less
clause gives the coder — is live; raise it at the plan gate.

## Context

### Provenance

**Owner ruling, 2026-09-15**, given live via `AskUserQuestion` in a `fkit lead` session (Sprint 9
wrap-up), multi-select, verbatim option label **"File claim briefs"** — *"A producer files a backlog
brief or briefs for the ~15 false claims 0393 found, plus ADR-009's misquote and stray </content>
line."* Filed by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

**Source:** [`0393`'s worklog](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/worklog.md),
sections *"Claim observations found while triaging"*, *"Claim observations added at T-DI"* and *"Claim
observations added in round 1"* (all *"D4: reported, not fixed"*). Sibling briefs: `0397`
(`architecture.md`), `0399` (open briefs and board rows).

### In scope — re-verified on disk 2026-09-15 at filing (re-derive at pickup)

| # (worklog) | ADR | Defect | Re-verified |
|---|---|---|---|
| 2 | **ADR-009** | The file's last line is a stray `</content>` — an authoring artifact, now sitting **after** `0393`'s own dated correction note at the end of §Related | ✅ still present |
| 10 | **ADR-016** §Consequences, the list under *"Verified, in this repository:"* | *"**Zero hooks.** `PreToolUse` appears only in prose … never in a settings file"* — false today: the ADR-018 skill-ownership hook ships, and `claude/` holds several `*-hook.sh` scripts. ⚠️ The same list's *"All seven agents hold `Bash`"* / *"Five of seven hold `Write`/`Edit`"* predate ADR-022 — **re-check both** while there | ✅ still false; no note covers it |
| 3 (first part) | **ADR-001**, the ⚠ *"Read as history"* banner at the top | The banner points at its own body by bare line numbers (a bare colon followed by 26, by 22, and by 40-41) taken **before the banner was inserted**; every one is now 19 lines short — the quoted sentences sit at body lines 45, 41 and 59-60 today | ✅ still off by 19; no note covers it |

### Dropped at filing — already corrected, recorded so nobody re-files them

- **Worklog item 1 — ADR-009's misquote** (*"no flavor is deleted until the native port proves
  itself"*, attributed to ADR-008). ⛔ **The owner's ruling named this one explicitly — dropped on
  re-verification, not on judgement of its value.** `0393`'s own dated correction note on ADR-009
  (2026-09-15, end of §Related) already quotes the sentence and says *"The words in quotation marks in
  the claim are a paraphrase of that option, not its wording"*, naming ADR-008's *"Port alongside
  Omnigent (chosen)"* option as the real text. For an accepted ADR a dated note **is** the correction
  form, so nothing is left to do. ⚠️ If the owner wants the quotation marks themselves addressed, that
  is a new decision — raise it.
- **Worklog item 16 — ADR-042's *"OUTSIDE `0273`'s scope"* heading.** `0393`'s dated note at the end of
  ADR-042 already says the statement *"is itself dated — `0273` was widened to cover them by owner
  ruling the same day"*. Already on the record.
- **Worklog item 3, second part — ADR-010 §Related's bare ADR-008 range.** Covered by `0393`'s dated
  note below ADR-010 §Context (*"the bare range in §Related's first bullet"*).
- **Worklog item 3, third part — ADR-015's ADR-013 pointer.** The worklog itself records it correct
  today.

### ⚠️ Found at filing, NOT scoped — a plan-gate question

The stray `</content>` line is a **class**, not a one-off. Measured 2026-09-15 with
`git grep --untracked -l '^</content>'` outside the vault: **21 files**. Outside closed task folders:
**8** — ADR-009, **ADR-010, ADR-017, ADR-018**, three dated reports under `knowledge-base/reports/`, and
the open brief `0013`. The ruling named **ADR-009 only**. ⛔ **Do not widen silently** — ask at the plan
gate whether the other three ADRs join this row (they are the same one-line fix). Reports are dated
records and closed task folders are frozen; recommend leaving both. `0013`'s brief is `0399`'s
territory if anyone's.

## What to build

1. **Re-derive the three in-scope defects** and confirm none has gained a note since filing.
2. **ADR-009:** remove the stray final `</content>` line. ⚠️ It is the file's last line, so removal
   shifts no line anything cites. Plan-gate check: confirm removing an authoring artifact is acceptable
   on an accepted ADR, or record it in a dated note instead.
3. **ADR-016:** append a dated ⚠️ correction note beside the *"Verified, in this repository:"* list —
   the list was a 2026-07-14 snapshot; say what is true today, with evidence and a date. Decision
   unchanged; status stays `accepted`.
4. **ADR-001:** append a dated ⚠️ note saying the banner's three self-pointers predate the banner and
   where each quoted sentence sits today — **by quoted text, not a fresh line number**.
5. **Placement:** follow `0393`'s measured placement rule (a note must not shift any line another file
   cites correctly). Check inbound citations to ADR-016 and ADR-001 before choosing each spot, and
   record the check.
6. No decision is reopened; no other ADR text is changed.

## Verification steps

1. `tail -1` of ADR-009 is no longer `</content>`; `git diff` for ADR-009 is exactly one removed line.
2. ADR-016 and ADR-001 diffs are **pure additions** (`git diff --numstat` shows 0 deletions for both).
3. Each note quotes the claim it corrects and states the on-disk evidence with a date.
4. For each placement, the inbound-citation check is recorded, and no citation that landed before the
   edit fails to land after it.
5. `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` — both
   green; counts stated. ⛔ Nothing under `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- ⚠️ **Split, flagged:** one of three briefs from the same ruling, split by document kind — accepted
  ADRs (this), living `architecture.md` (`0397`), open briefs and board rows (`0399`). A producer
  judgement.
- ⚠️ **Filed UNRANKED and APPENDED LAST** by a spawned producer with no owner channel; renumbers and
  inserts nothing
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ No wiki write ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
  — the vault's ADR-009 page repeats the misquoted words (*"no flavor is deleted until the native port
  proves itself"*, grepped 2026-09-15) without the paraphrase caveat; report it for `fkit-wiki`.
- ⛔ No commit.
