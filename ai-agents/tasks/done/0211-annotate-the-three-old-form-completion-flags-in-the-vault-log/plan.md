# Plan — task 0211: annotate the three old-form completion flags in the vault log

> **Provenance and carry disclosure — read this before treating any part of this file as authoritative.**
>
> This plan was produced by a spawned `@fkit-wiki` planning worker and **approved by the owner** via a
> live `AskUserQuestion` in the `/fkit-sprint-ship-loop` driver session on **2026-08-03**. Per
> `fkit-sprint-ship-loop/SKILL.md` §Durable artifacts, the **driver** wrote this file at the moment of
> approval, before spawning the build.
>
> **What this copy is, stated honestly** (`0162`'s faithful-carry ruling): the approved bytes existed only
> in this session's worker return and `AskUserQuestion` exchange — there was no prior file to copy from.
> So this is a **copy from the driver's context**, not a file→file copy. Two transformations were applied
> and are disclosed rather than hidden:
>
> 1. The worker's return arrived with HTML-escaped angle brackets (`&lt;` / `&gt;`). They are rendered here
>    as literal `<` / `>`, which is what the plan means and what the build must write.
> 2. Three owner rulings answered at approval are recorded in §Owner rulings below rather than being
>    silently merged into the plan body, so the approved text and the rulings on it stay distinguishable.
>
> **`carried-not-approved` remains an accepted structural residual** (`0162`): a hash pins which bytes
> were *carried*, not which were *approved*. Approval leaves no artifact.

## Owner rulings at approval (live `AskUserQuestion`, 2026-08-03)

| Question | Ruling |
|---|---|
| Approve the plan? | **Approved — build it.** |
| The entry's heading `<operation>` word | **`correction`** — a new word, honest about what happened (no page created, no checks run). The plan as written already uses it. |
| Brief verification step 5, unsatisfiable at baseline (demands a clean non-vault `git status`; ten pre-existing paths present) | **Accept the plan's baseline-diff substitution.** Capture non-vault `git status` before the write, diff after, require empty. The brief's step 5 is superseded for this run. |

---

## 0. Scope, in one line

Append **one** new dated entry to `ai-agents/wiki-vault/log.md`. Touch nothing else — not `index.md`, not `.wiki-watermark`, no wiki page, nothing outside the vault.

## 1. Pre-write baseline capture (before any edit)

```
cd /Users/mark.dolbyrev/Workspace/fkit
mkdir -p "$SCRATCH"
git show HEAD:ai-agents/wiki-vault/log.md > "$SCRATCH/log-before.md"
wc -c < "$SCRATCH/log-before.md"                      # expect 260224
git status --porcelain | grep -v 'ai-agents/wiki-vault/' > "$SCRATCH/status-before.txt"
ls -d ai-agents/tasks/*/0199-*/ ai-agents/tasks/*/0206-*/   # re-confirm board location
```

The last command is not ceremony. **If either task has left `backlog/` between now and the build spawn, the entry's central factual paragraph is wrong and must be reworded** from *"will die"* to *"has died"* before writing. Re-run it; do not inherit my result or the brief's.

## 2. The entry — exact text to append

Append **one blank line**, then this block verbatim, to the end of `log.md`. The file already ends in a newline; do not add or remove one.

~~~~
## 2026-08-03 — correction (task `0211`: the three old-form completion flags in this log)

**Not an ingest, not a lint, not a sync.** No page was created or updated, `index.md` is untouched, and `.wiki-watermark` is unchanged. This entry exists only to record a correction about three earlier entries in this file. Task `0211`, owner `fkit-wiki`; the vault is this role's exclusive write surface under ADR-005.

### What is being corrected

Three completion-flag lines already written into this log use the **pre-`0173` flag form**, which hardcoded a `backlog/` path into the flag text. Task `0173` (closed 2026-08-03) changed the generator in all three `claude/skills/fkit-wiki-*/SKILL.md` files: the flag now carries a **task folder ID only, with no path at all**, plus an explicit prohibition on `:NNN` line-number coordinates, and the caller resolves `<NNNN>` to its folder by globbing `ai-agents/tasks/*/<NNNN>-*/`. **`0173` fixed the generator; it could not reach what had already been emitted.** These three are what had already been emitted.

Located by **dated entry and durable anchor** — deliberately no line numbers:

1. **The `2026-08-03 — sync` entry, the first of its two run-ending flag lines** — names task **`0199`**, in the `partial — not ready to close` form.
2. **The same `2026-08-03 — sync` entry, the second of its two run-ending flag lines** — names task **`0206`**, in the `vault work is complete — ready to close` form.
3. **The `2026-08-03 — lint` entry, its single run-ending flag line** — names task **`0199`**, in the `partial — not ready to close` form.

**Three emissions, two distinct tasks: `0199` twice, `0206` once.** Re-verified against this file immediately before this entry was written: a scan of the whole log for flag lines carrying a *substituted* `ai-agents/tasks/backlog/…/brief.md` path returns these three and no others. The other `tasks/backlog/…` strings in this file are not completion flags — they are unsubstituted templates, grep-record prose already recorded as frozen history by the `2026-08-02 — sync` entry, and one reference to `0045`, which is genuinely still in `backlog/`.

### The status of those three paths — stated as of 2026-08-03, not as a fixed fact

**Verified on disk 2026-08-03: both `0199` and `0206` are in `ai-agents/tasks/backlog/`. All three paths resolve. Nothing is broken today.**

They stop resolving the moment `0199` or `0206` closes or is cancelled and its folder moves out of `backlog/` — at which point three frozen, append-only entries point at folders that are no longer there.

This is the *"correct at emission, dead later"* profile that task `0160`'s decision report singles out (§5.2) as the harder of the two to detect: the `partial` form says in so many words *"not ready to close"*, so the task genuinely **is** in `backlog/` when the flag is written, and the path is **true at the time**. A reader who checks these paths today finds them correct and concludes there is nothing to record. **That conclusion is right about today and wrong about next week.** The ruling and its reasoning are summarized at [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]].

⚠️ **Read the paragraph above as dated.** It states what was true on 2026-08-03. It is not a claim about the day you are reading it. Resolve `0199` and `0206` by glob — `ai-agents/tasks/*/0199-*/`, `ai-agents/tasks/*/0206-*/` — to see where they are now.

### Why no path from those three flags is reproduced here

The three flags are **described, not quoted**. Writing out the substituted path from any of them would make this entry a **fourth and fifth instance of the very defect it records** — a live-today, dead-later pointer, sitting in an append-only file, unrepairable by construction.

What is quoted instead is the **form**, with the ID and slug left as unsubstituted placeholders. A template resolves to nothing and points at nothing; the literal `backlog` inside it is the defect being described, not a claim about where any task is.

- old form, `partial`: `Task <NNNN>: partial — not ready to close (ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)`
- old form, `complete`: `Task <NNNN>'s vault work is complete — ready to close (producer runs /fkit-task-done on ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)`
- **current form, post-`0173`, `partial`: `Task <NNNN>: partial — not ready to close`**
- **current form, post-`0173`, `complete`: `Task <NNNN>'s vault work is complete — ready to close`**

**What this costs, stated plainly:** a reader of this entry alone cannot see the two exact slugs that were written. That is deliberate, and it is the only thing given up. The anchor above — dated entry, which run-ending flag line, and folder ID — lands a reader on the original with certainty, and the originals are append-only, so they are always there to be read. A correction entry needs to be a signpost, not a replacement for the text it points at.

⚠️ **Note for the next lint — a dead-path scan will report the two old-form templates above.** They are **specimens quoted to describe a defect, with nothing substituted into them** — the same category as the `claude/dashboard.sh` specimen on the ADR-029 page that the `2026-08-03 — lint` entry already carries forward. **Do not "re-fix" them, and do not substitute real IDs into them.**

### The three originals are unchanged

Per the **owner's ruling of 2026-08-03**, given live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver session: **a wiki run may never edit or annotate a past `log.md` entry in place.** A correction lands as a new dated entry — this one — naming what it corrects by folder ID and durable anchor, with the originals left **byte-identical**. That matches this file's own header (*"Never edit or rewrite existing entries; only append"*), `schema.md`'s *"Append-only chronological activity log"*, and the knowledge-base correction-note form established by task `0143`. The ruling was made **once, for this task and `0199` together**.

Verified for this write: the file's entire pre-existing prefix is byte-identical to its state at the previous commit, and this file's diff carries **zero deletions**.

### Deliberately not done

- **`0148`'s closed review ledger is untouched.** It carries a `backlog/` path for a task now in `done/`; that is correct content in a frozen ledger, not a defect.
- **The further prose rank citations in this log are untouched.** Task `0160`'s report (§5.3) lists them and records, in its own words, that it has *"not classified which are live claims and which are frozen history"*, flagging that as unverified. Different defect class — board-rank citations in prose, not the completion-flag path form — and an unverified inventory. Named as a follow-up, not filed. Its own line-number citations in that list were taken against an 857-line version of this file and no longer resolve, which is the same class over again.
- **The *"still open"*-framing correction is not absorbed here.** It belongs to `0199`, and on the owner's ruling of 2026-08-03 it gets its own separate row. This entry covers the old-form flag paths only.
- **No task was moved and no mover was invoked.** `0199` and `0206` staying open is a precondition of this correction, not an oversight.

- **Write scope:** only `ai-agents/wiki-vault/log.md` touched — this entry appended; no page created or updated; `index.md` and `.wiki-watermark` unchanged. **Nothing committed, nothing staged. No task moved, no mover invoked. No source, skill, agent definition, brief, sprint plan, ADR or report edited.**

Task 0211's vault work is complete — ready to close
~~~~

## 3. Notes for the build worker on that text

- **The run-ending flag is in the new post-`0173` form** — folder ID, no path. This matches the current SKILLs, and it places the new form directly beneath a description of the old one, where the contrast is legible. It creates no new pointer.
- **The `[[…]]` link creates no back-link obligation.** `schema.md`'s bidirectionality rule governs wiki *pages*. `log.md` is not a page, and no page has ever linked back to it. **Do not edit any page to add a back-link** — that would breach this task's write scope.
- **`§5.2` / `§5.3` are section anchors, not line numbers.** They are permitted and are the durable form. Do not convert them to anything else, and do not reproduce §5.3's `:NNN` list.
- Every date in the entry is `2026-08-03`, which is today. If the build runs on a later date, **change the heading date and the "verified on disk" date to the real date of the write**, and re-verify the board locations for that date.

## 4. Verification — run all of it, report commands and output, not conclusions

1. **Append-only, proved by prefix byte-identity** (the decisive check — stronger than `git diff` alone, which cannot distinguish an append from a mid-file insertion):
   ```
   cmp -n $(wc -c < "$SCRATCH/log-before.md") "$SCRATCH/log-before.md" ai-agents/wiki-vault/log.md
   ```
   Must exit **0** with no output. That proves every pre-existing byte is untouched and the write was a pure append.
2. **Zero deletions:** `git diff --numstat -- ai-agents/wiki-vault/log.md` → must read `<added> 0 …`. The `0` in the deletions column is the requirement.
3. **The three originals still read as before:** `git show HEAD:ai-agents/wiki-vault/log.md | grep -c 'not ready to close (ai-agents/tasks/backlog'` and the same grep against the working file. Both must return **3** — the new entry adds none, because it substitutes nothing.
4. **No `:NNN` anywhere in the new text:** `git diff -U0 -- ai-agents/wiki-vault/log.md | grep -nE '^\+.*\.md:[0-9]'` → must return nothing.
5. **No non-vault change** (replaces the brief's step 5, which is unsatisfiable at baseline — see the flag above):
   ```
   git status --porcelain | grep -v 'ai-agents/wiki-vault/' > "$SCRATCH/status-after.txt"
   diff "$SCRATCH/status-before.txt" "$SCRATCH/status-after.txt"
   ```
   Must be **empty**. Report the pre-existing non-vault entries explicitly so the owner sees they were pre-existing and were left alone.
6. **`0148`'s ledger unchanged** — covered by check 5, but state it by name since the brief asks.
7. **Nothing committed, nothing staged:** `git diff --cached --stat` → empty; `git log -1 --format=%H` unchanged from the baseline SHA.
8. **No task moved, no mover invoked** — re-run the `ls -d` from step 1; both still in `backlog/`.
9. **State in the hand-off** whether `0199` and `0206` were still in `backlog/` at the moment of the write, with the command output.

## 5. Accepted residual — recorded, not solved

The entry's own statement *"both `0199` and `0206` are in `backlog/` as of 2026-08-03"* is itself a dated claim in an append-only file. It will become historically-true-but-not-current, exactly like the three flags it describes. **This is unavoidable and is not fixed by anything in this plan** — it is mitigated by the explicit "read as dated" marker and the glob instruction that lets a reader re-derive the current state. It is a dated record, not a stale claim. Do not let a later run "correct" it.

## 6. Close

Route to a spawned `@fkit-producer` (ADR-033), which writes the `(agent-closed — not owner-verified)` marker. **The wiki worker does not close it, and does not invoke a mover.**
