# Repair the stale claims `0393` reported in open briefs and board rows, and 0371's garbled Notes

## ID
0399

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

⚠️ **Producer judgement, flagged.** No ruling assigns it. Every edit here is a dated note on an open
brief or board row — a coordination-doc repair, which
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
Decision 1's skill-less clause staffs to the coder. ⚠️ Competing precedent: `0221` (a one-brief premise
repair) carried `fkit-producer`. Raise it at the plan gate if it matters.

## Context

### Provenance

**Owner ruling, 2026-09-15**, given live via `AskUserQuestion` in a `fkit lead` session (Sprint 9
wrap-up), multi-select, verbatim option label **"File claim briefs"** — *"A producer files a backlog
brief or briefs for the ~15 false claims 0393 found, plus ADR-009's misquote and stray </content>
line."* The lead's relay also asked that `0371`'s garbled `## Notes` be flagged in whichever brief fits
— it fits here. Filed by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

**Source:** [`0393`'s worklog](../../done/0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/worklog.md),
its three *"Claim observations"* sections (*"D4: reported, not fixed"*). Sibling briefs: `0397`
(`architecture.md`), `0398` (ADR text defects).

### In scope — each re-verified on disk 2026-09-15 at filing (re-derive at pickup)

Cited by brief/row and quoted text. **Do not trust any line number.**

| # (worklog) | Where | Stale claim | Why it is stale |
|---|---|---|---|
| 9 | `0273`'s brief, its site list | names `claude/skills/fkit-review/SKILL.md`'s `codex exec --sandbox read-only` command by a line number one short of where it sits today | The brief's own *re-measure at implementation time* rule covers it — **a note, not a rewrite** |
| 12 (first part) | `0273`'s brief, the paragraph opening *"⛔ **Do NOT sweep the citation cluster"*** | says the cluster was *"deliberately not filed"* and that one of its citations *"was measured and is CORRECT"* | The cluster was re-anchored by `0275` (✅ Done), and `architecture.md` no longer carries that citation at all (grep, 0 hits). The worklog also says `0356` refuted the *"CORRECT"* verdict — ⚠️ **not re-verified at filing; check `0356`'s record** |
| 11 | `0226`'s brief, row **U5** | three further `architecture.md` sites *"all reading "25""* | `architecture.md` today reads *"26 dirs"* and *"The 28 skills"* |
| 12 (second part) | Backlog board, `0287`'s open row | attributes the Codex-sandbox `architecture.md` sites to *"`0275`/`0273`"* | `0275` is closed; all three sandbox sites are `0273`'s |
| 17 | `0287`'s brief, `## Notes`, the *"Vault writes only"* bullet | *"that is `0275` and `0273`"* | Same as above |
| 13 | `0284`'s brief, verification step 14 | quotes `architecture.md` as saying *"the CI half has never actually run"* | `architecture.md` §1 now reads *"**Both halves have now been exercised.**"* ⚠️ The step's own conclusion (*"CI has never executed any change to this file"*) may still be true — **re-check it separately**; only the quote is certainly stale |
| — | **`0371`'s brief, `## Notes`** — garbled | (a) a sentence beginning *"this is genuinely optional and belongs low"* is joined onto the end of the `- **Blocks:** nothing.` bullet with no line break, and runs straight into the next bullet's *"- ⚠️ **This brief decays.**"*; (b) the *"Filed UNRANKED"* bullet's *"**On merit -"* sentence is cut off and fused with a *"⭐ **Same family, different job:**"* bullet; (c) a stray line *"** Flagged so the owner can say otherwise."* sits alone after the `0176` re-raise bullet — almost certainly the lost tail of (b) | Present since the file's only commit (`351bea3`); **no clean version exists in git history**. ⚠️ The `- **Blocks:**` bullet is parsed by `dashboard.sh` — the joined text must not break it |

### Pointer notes for `0394` — design inputs, not claim repairs

| # (worklog) | What `0394`'s brief should learn |
|---|---|
| 4 | `0394`'s brief classes ADR-042's *"Historical ADRs"* list as a **specimen list** and the 2026-07-11 doc-drift audit as **`mention?`**; `0393`'s triage classed the first **correct** (a pointer list) and the second **drifted, frozen** (a dated report). Treatment was identical (both left byte-identical), but the disagreement is currently recorded only in `0393`'s worklog |
| 15 | A **second spelling** of the `ADR-NNN` line class exists: an `ADR-026` coordinate followed by a bare continuation (a bare colon and a number) in the closed rows for `0280`/`0281`. The E1 pattern cannot see it. `0393`'s worklog OD5 section already names it as a data point |

### Out of scope — recorded so nobody widens silently

- **Closed rows and closed briefs** carrying the same stale text (`0281`/`0282` for #13; `0280`/`0281`
  for #15). Closed records are frozen; this row does not append to them.
- **`0013`'s brief ends with a stray `</content>` line** (found at filing, same class as ADR-009's —
  see `0398`). Not in the ruling; ⚠️ plan-gate question whether to fold it in here.

## What to build

1. **Re-derive every row above at pickup.** Drop any that no longer holds and say so.
2. For each stale claim in an **open** brief or board row: **append a dated ⚠️ correction note** beside
   it, leaving the original text byte-identical (the board/brief convention used on Sprint 9). On a
   board row the note goes **inside the same cell**, appended at its end, with no `|` character.
3. For `0371`: repair the **structure** only — restore the line breaks so each bullet is its own
   bullet, keep `- **Depends on:**` and `- **Blocks:**` in canonical form, and add a dated note saying
   the (b)/(c) text was garbled at filing and what could and could not be recovered. ⛔ **Do not invent
   the lost "On merit" wording** — if it cannot be recovered from any record, say so in the note.
4. Append one dated pointer note to `0394`'s brief carrying #4 and #15.
5. No status, priority, rank or `Depends on` value changes anywhere.

## Verification steps

1. Every in-scope row: before text quoted, the note's text quoted, the on-disk evidence stated with a
   date — in the worklog.
2. `git diff --numstat` for every brief and board file except `0371`'s shows **0 deletions**.
3. `0371`: `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` still derives
   `0371`'s dependencies (no `UNPARSEABLE`); the diff removes no words except to insert line breaks.
4. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` — no new drift line
   compared with a before-capture.
5. `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js` — both
   green; counts stated. ⛔ Nothing under `ai-agents/wiki-vault/`.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- ⚠️ **Split, flagged:** one of three briefs from the same ruling, split by document kind. This one
  bundles seven small note-edits across six files rather than one brief each — each is a minute's
  work and they share one verification; a producer judgement.
- ⚠️ **Races with the rows it annotates.** If `0273`, `0226`, `0284`, `0287`, `0371` or `0394` is picked
  up first, its own run may make the note moot — re-check at pickup, drop what is moot.
- ⚠️ **Filed UNRANKED and APPENDED LAST** by a spawned producer with no owner channel; renumbers and
  inserts nothing
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ No wiki write ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ No commit.
