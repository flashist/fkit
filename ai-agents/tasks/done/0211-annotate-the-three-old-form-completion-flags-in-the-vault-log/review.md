# Review — 0211

Task: `ai-agents/tasks/done/0211-annotate-the-three-old-form-completion-flags-in-the-vault-log/brief.md`
File(s) under review: `ai-agents/wiki-vault/log.md` (uncommitted, +58 / −0 — one appended dated entry)
Status: in-review

**Round 1 · reviewers: Claude (fkit-reviewer) + Codex `codex-cli 0.145.0` — both ran, full coverage.**

> ⛔ **Any fix routes to a `@fkit-wiki` worker.** `ai-agents/wiki-vault/` is the wiki role's exclusive
> write surface (ADR-005). The reviewer wrote only this file.
>
> ⏱️ **The cheap-fix window is open only until this lands.** `log.md` is **unstaged and uncommitted**
> (`git status --porcelain` → ` M ai-agents/wiki-vault/log.md`). The owner's append-only ruling forbids
> editing a **past** entry; this run's own not-yet-committed entry is not yet past, and amending it
> leaves the 260224-byte pre-existing prefix byte-identical either way. **After it commits, fixing R1
> costs a whole second correction entry correcting the correction.**
>
> 📐 **Line numbers below are working-tree coordinates and will rot.** The brief's ⛔ on `:NNN`
> citations governs the log entry and the hand-off report — vault-frozen artifacts. This ledger is
> task-scoped and disposable, and the coder needs coordinates to act, so each row carries a line
> number **plus a durable quoted anchor** that survives the file growing.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | low | `ai-agents/wiki-vault/log.md:1177` — anchor: *"They stop resolving the moment `0199` or `0206` closes"* | Two independent factual overstatements in one sentence: the **disjunction** (closing `0206` alone kills 1 path, `0199` alone kills 2 — only both kills 3) and the **container count** (the three flag lines sit in **two** entries, never three). |
| R2 | 1 | low | `ai-agents/wiki-vault/log.md:1171` — anchor: *"one reference to `0045`, which is genuinely still in `backlog/`"* | An undated, mutable board-location claim that is true today and false once `0045` closes — sitting **outside** the entry's own `⚠️ read as dated` mitigation, which is scoped to a later section and names only `0199`/`0206`. The entry commits, in miniature, the defect class it exists to record. |
| R3 | 1 | low | `ai-agents/wiki-vault/log.md:1181` — anchor: *"⚠️ **Read the paragraph above as dated.**"* | Referent imprecise: "the paragraph above" (singular) points at the `§5.2` paragraph, but the dated claim needing the warning is the section's **first** paragraph (*"Verified on disk 2026-08-03: both `0199` and `0206` are in …"*). Intent recoverable from the section heading and the note's own glob recipe — clarity nit, not a correctness failure. |
| R4 | 1 | low | `ai-agents/wiki-vault/log.md:1196` — anchor: *"⚠️ **Note for the next lint — a dead-path scan will report the two old-form templates above.**"* | The note's reader is established by **practice, not procedure**: `fkit-wiki-lint/SKILL.md` never instructs reading prior `log.md` entries, and `log.md` is not in `index.md`. **Frontier-move** — the mechanism is demonstrated working one day earlier; hardening it means editing the lint skill, outside `0211`'s scope. |
| R5 | 1 | low | `ai-agents/wiki-vault/log.md:1163-1169` (anchor scheme) + `:1187` (*"a fourth and fifth instance of the very defect it records"*) | The primary locator is date+operation, a header form **demonstrably collision-prone in this very file** (four duplicated date+kind headers) and in an append-only file a later collision is unrepairable. **Frontier-move, verified sound anyway** — the anchor is compound and post-`0173` nothing can emit a fourth old-form flag; an independent grep fallback finder is carried. But the stated justification does not engage the entry's **own** counter-doctrine two paragraphs later. |

### Disproven — do not chase

- **"The `next lint` note has no reader" (Codex, medium) — disproven in that strong form.** The
  2026-08-02 lint parked an identically-phrased note in `log.md` (*"⚠️ One note for the next lint: … Do
  not 're-fix' it."*) and the 2026-08-03 lint **found it, re-confirmed it and carried it forward**
  (*"Note for the next lint, carried forward and re-confirmed"*). Retained only as R4 at low severity.
- **The `§5.2` / `§5.3` citations into `0160`'s report — both accurate.** The *"worse to detect … the
  exact profile §3.4 identifies as the dangerous one"* claim sits inside `§5.2` (report lines 864-865,
  §5.2 spans 807-870); the *"not classified which are live claims and which are frozen history … flag
  that as unverified"* quote sits inside `§5.3`. Not a mis-citation.
- **The `[[…]]` wiki-link resolves** → `ai-agents/wiki-vault/wiki/tasks/decide-the-durable-citation-form-for-mutable-coordinates.md`.
- **The `claude/dashboard.sh` specimen precedent is real** and is carried by the 2026-08-03 lint entry.

### Verified clean (evidence, not assertion)

- **Append-only preserved.** `git diff --numstat` → `58  0`. Prefix proof: `head -c 260224 log.md | cmp - <HEAD version>` exits **0**; SHA-256 of both prefixes identical (`612375e6…0089e`).
- **The `cmp -n` trap is real — confirmed a third time, with a stronger control.** `cmp -n 260224`, `cmp -n 260223` **and `cmp -n 10`** all print `cmp: EOF on <file1>` and exit 1. A 10-byte limit reporting EOF proves `-n` is not bounding the comparison on BSD `cmp`. The build worker's substitute is **sound**, not flawed: `head -c N working` emits exactly N bytes, so `cmp -` is a complete prefix comparison, independently corroborated by the SHA-256 match.
- **The plan's §4 check-3 `3`/`3` expectation was miscounted; the build worker's explanation is correct.** `HEAD` = 2 because the pattern `not ready to close (ai-agents/tasks/backlog` matches only the *partial* form — the third original names `0206` in the *complete* form (`ready to close (producer runs /fkit-task-done on …`), which lacks the substring. Working = 3 (+1 unsubstituted template). Counting **substituted** paths across both forms: **3 in `HEAD`, 3 in working — the entry adds zero.** No text was bent to make a check pass.
- **Entry's factual location claims are exact.** The sync entry's two run-ending flag lines name `0199` (partial) then `0206` (complete); the lint entry's single line names `0199` (partial) — matching the entry's description in order and form.
- **No `:NNN` citation anywhere in the added lines.**
- **The entry's own run-ending flag conforms to the post-`0173` form** — `Task 0211's vault work is complete — ready to close`, folder ID only, no path. Byte-exact against all three `SKILL.md`.
- **The four quoted templates are correct**, and *"the two old-form templates above"* is **unambiguous** — those two bullets are explicitly labelled `old form`; the other two are labelled `current form, post-0173`.
- **Nothing outside the vault is attributable to this task.** The other modified paths belong to `0173`'s close (its folder move + the three `SKILL.md`) and to the producer's brief filing (`backlog.md`/`sprint-2.md` carry the new `0211`+`0212` rows; `0184`/`0199` briefs).
- **ADR-034 applied:** every finding is against the **work product** (`log.md`), none against own-record artifacts.

### Observation, not a finding

The log's own header says *"Each ingest / lint / sync operation adds one entry"*; this is the file's
first `correction`-typed entry. `schema.md`'s `## YYYY-MM-DD — <operation>` slot is generic, so the
entry conforms, and the owner's 2026-08-03 ruling explicitly authorizes a correction as a new dated
entry. The header's enumeration is now narrower than the file — a doc gap that is **not `0211`'s to
close**.

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

Responder: `fkit-wiki` (process-review worker, spawned by `/fkit-sprint-ship-loop`), 2026-08-03.
`ai-agents/wiki-vault/` is this role's exclusive write surface (ADR-005), so the fixes landed here and
not with a coder. `plan.md` re-verified before acting: `git hash-object` =
`656f2290794b27967654787aeb74c611c2425ed2`, 14620 bytes — matches the pointer given at spawn.

**Only the entry appended by this run was amended.** Every earlier entry is byte-identical — proven
below, not asserted.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT — re-verified independently against the file | Defect (low) | **Owner-ruled fix, applied in place.** The sentence asserted a disjunction (*"`0199` or `0206`"*) that made any single close kill all three paths, and put the three flag lines in *"three"* entries. Both re-checked: `0199` is named by flags 1 and 3, `0206` by flag 2 — closing `0199` kills two paths, closing `0206` kills one; and the three lines sit in **two** entries (the `2026-08-03 — sync` entry holds two, the `2026-08-03 — lint` entry holds one). Rewritten to state the per-task consequence and the entry count correctly. Surrounding meaning and the `⚠️ read as dated` framing kept. | **Fixed** |
| R2 | CORRECT | Defect (low) | **Owner-ruled: accept, do not fix.** Recorded as a settled residual below with a re-raise condition. The entry was not edited for it. | **Accepted residual** |
| R3 | CORRECT — re-verified: the section's first paragraph carries the dated disk check, while the marker's *"the paragraph above"* points at the `§5.2` detection-profile paragraph | Defect (low) | **Applied autonomously.** Marker rescoped from one paragraph to the whole section, naming its three dated claims and keeping the glob recipe intact. Reasoning in `worklog.md`'s decision log. | **Fixed** |
| R4 | PARTIALLY CORRECT — Codex opened it at medium, the reviewer downgraded it to low on evidence that the mechanism demonstrably worked one day earlier | Frontier-move (low) | **No action, as expected.** Hardening the next-lint note's readership means editing `fkit-wiki-lint/SKILL.md`, which is outside `0211`'s scope. Not filed as follow-up work by this response. | **Noted, no action** |
| R5 | Frontier-move; the reviewer's counter-argument is sound and is **not** refuted by the disposition below | Frontier-move (low) | **Owner-ruled: settle as doctrine, do not rework the entry.** Recorded below as standing form, phrased for `0212` to inherit. | **Settled doctrine** |

### Fixes applied — exact scope

Two sentences inside the `## 2026-08-03 — correction (task 0211 …)` entry, both in the section
*"The status of those three paths"*:

1. **R1** — the closure-consequence sentence, rewritten to say that `0199` is named by two of the three
   flags and `0206` by one, so closing `0199` kills two paths and closing `0206` kills the third, and
   that the three flag lines live in **two** frozen entries.
2. **R3** — the `⚠️` marker, rescoped from *"Read the paragraph above as dated"* to *"Read this whole
   section as dated"*, enumerating the three dated claims it now covers.

No other line of `log.md` changed. No `:NNN` citation added. No live substituted path quoted — the
R5 doctrine below was followed while fixing R1.

## Accepted residuals (shared, do-not-re-litigate)

**Owner dispositions of 2026-08-03, given live via `AskUserQuestion` in the `/fkit-sprint-ship-loop`
driver session. Settled — do not re-open these in a later round.**

### AR-1 (from R2) — the `0045` board-location clause stays as written

The clause *"one reference to `0045`, which is genuinely still in `backlog/`"* is an undated
board-location claim sitting outside the entry's `⚠️ read as dated` marker. The finding is **correct**:
the entry does commit, in miniature, the defect class it exists to record.

**Owner ruling: accepted as a residual, not fixed.** The reasoning given: it is a board-location claim
in a **subordinate clause**, not a resolvable path — nothing dereferences it, so nothing breaks when
`0045` moves. It degrades from *true* to *stale*, never to *broken*.

**Re-raise only if** the `0045` reference is ever promoted out of that subordinate clause — into a
resolvable path, a standalone assertion, or a fact a later entry or lint depends on. **`0045` merely
closing or being cancelled is not a trigger** and must not re-open this.

### AR-2 (from R5) — "describe, don't quote" is the standing form for vault corrections

**A correction entry in `ai-agents/wiki-vault/log.md` names a defective original by dated entry,
durable anchor, and task folder ID, and quotes the defective *form* with placeholders left
unsubstituted. It does not reproduce the substituted live path from the original.**

**Owner ruling of 2026-08-03: this is the standing form, settled for vault corrections generally — not
a one-off call for `0211`.**

Recorded honestly, because the ledger is the durable record:

- The reviewer's counter-argument in R5 is **sound and stands unrefuted on the merits**. The entry
  refuses to quote the real paths on the grounds that doing so would make it a fourth and fifth
  instance of the defect, yet two paragraphs later invokes the opposite doctrine — *"specimens quoted
  to describe a defect"* — to protect its own quoted templates. By that same doctrine, quoting the real
  paths as **labelled defective originals** would not have been live pointers either. The entry's
  stated justification does not survive contact with its own later paragraph.
- The doctrine is therefore settled **by ruling, on form and uniformity**, not by winning that
  argument. Anyone reopening it should know the argument was not answered — it was superseded by a
  decision to have one standing form.

**Task `0212` inherits this decision and must not re-derive one.** `0212` (append a dated log entry
correcting the *"still open"* framing) faces the identical choice today: whether to reproduce the
offending original text or describe it. **It describes.** Same construction as here — dated entry +
durable anchor + folder ID, form quoted with placeholders, substituted live text not reproduced. No
fresh analysis of the trade-off is required or wanted; the trade-off is settled above, including its
acknowledged cost (a reader of the correction alone cannot see the exact original text, and must
follow the anchor to the append-only original, which is always there).
