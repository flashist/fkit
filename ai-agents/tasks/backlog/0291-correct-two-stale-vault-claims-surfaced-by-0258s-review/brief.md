# Correct two stale vault claims surfaced by `0258`'s retroactive review — `index.md`'s `~6 min` figure and `log.md`'s `0288`/`0289` misdirection

## ID
0291

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

### Authority

**Owner ruling 2026-08-13**, given live in a `fkit lead` session via `AskUserQuestion` and relayed
through the driver — **the option label is the verbatim text**: **"One task covering both"**. The
owner was offered three shapes (one task for both items, extending `0289`, or two separate tasks) and
chose one task.

### Provenance — an independent review run AFTER the task had already closed

Both items were surfaced by an **independent `fkit-reviewer` pass over
[`0258`](../../done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md)'s vault
work**, run **2026-08-13** at the owner's request because `0258` had **shipped with no reviewer pass**.

⚠️ **That review was EPHEMERAL and left no artifact on disk.** Measured 2026-08-13:
`ai-agents/tasks/done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/` contains
**`brief.md` only** — there is **no `review.md`**, and nothing under
`ai-agents/sprints/reviews/` covers it. ⛔ **Do not go looking for the review file; it does not
exist.** This brief is the only durable carrier of its two findings, which is exactly why it exists.

✅ **The review's overall verdict on `0258` was SOUND** — six facts checked and held, no reversal, no
scope leak, no false claim. **These two are low-severity corrections, not a repudiation of `0258`.**
⛔ Do not let this row read as re-opening `0258`.

### ⚠️ TWO ITEMS, TWO FILES, TWO DIFFERENT CONVENTIONS — DO NOT BLUR THEM

| | File | Nature of the fix |
|---|---|---|
| **Item 1** | `ai-agents/wiki-vault/index.md` | An **ordinary current-state page edit** — replace the superseded figure in place |
| **Item 2** | `ai-agents/wiki-vault/log.md` | **APPEND-ONLY** — a **new dated entry**; the old line stays **byte-identical** |

⛔ **Applying item 1's method to item 2 breaks the log's own contract.** Read on.

---

## Item 1 — `index.md` still records the superseded `~6 min` figure

### The stale text — measured on disk 2026-08-13

`ai-agents/wiki-vault/index.md:323`, in the `0256` roll-up line
(`[[tasks/gate-releases-so-an-untested-tree-cannot-ship]]`), reads:

> Measured cost **~6 min per release**.

### Why it is superseded

**Owner ruling 2026-08-13**, given via `AskUserQuestion` — **verbatim option label**:
**"Range: 'roughly 6–8 minutes, machine-dependent'"**. ⚠️ **It overrides the owner's OWN earlier
2026-08-12 `~6 min` ruling.** The ruling is recorded in
[`0252`'s review ledger](../../done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/review.md)
at `:68`, and the ruled wording **landed** at `RELEASING.md:128`, verified by `grep` on 2026-08-13:

> A green run takes **roughly 6–8 minutes, machine-dependent**; a red one usually comes back in

### ⛔⛔ THIS IS NOT COVERED BY THE ACCEPTED RESIDUAL IT RESEMBLES — READ THIS BEFORE SUPPRESSING IT

`0252`'s review ledger at
[`review.md:68`](../../done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/review.md)
records an **accepted residual, do-not-re-litigate**, quoted verbatim from disk 2026-08-13:

> **Runtime wording "roughly 6–8 minutes, machine-dependent"** — What: `RELEASING.md:102-105` states
> that range plus a ~1-minute failing-run clause · Why (structural): owner ruling 2026-08-13 via
> `AskUserQuestion`, superseding the owner's own 2026-08-12 `~6 min` ruling; **the resulting
> disagreement with `bin/release.mjs:190` and `.github/workflows/test.yml:28-32` is deliberate and
> accepted** · Re-raise only if: the owner reopens the wording, or a measured run falls outside the
> 6–8 min band in a way that makes the budget misleading rather than merely conservative.

⚠️ **That residual is scoped to the CODE sites only.** It accepts a *deliberate* disagreement between
`RELEASING.md` and `bin/release.mjs` / `.github/workflows/test.yml`. **The vault index is a different
site the residual does not name and does not reach** — and the `0258` reviewer drew exactly that
distinction when it raised this. ⛔ **A later reader must not suppress this row as "already settled".**

⛔⛔ **CONVERSELY: THIS ROW MUST NOT WIDEN INTO "FIX THE `~6 min` FIGURES EVERYWHERE."** Doing so would
**breach a live accepted residual**. The `~6 min` figures at `bin/release.mjs:71`, `:173`, `:190` and
the comment at `.github/workflows/test.yml:29` are **explicitly out of scope and must be left
byte-identical**. ⛔ This task touches **`ai-agents/wiki-vault/index.md` and nothing else** for item 1.

### ⚠️ On the measured numbers — state the RANGE, do not publish a duration list

⛔ **Do not write a list of measured seconds onto the index.** The owner ruled a **wording**, and the
wording is what the vault should echo. ⚠️ **A duration list was offered to the producer that filed
this row and could NOT be fully reproduced from disk** — a sweep on 2026-08-13 found `328`, `344`,
`347`, `380`, `404` and `448` s recorded (chiefly `.github/workflows/test.yml:28-29`, which names
*"328 / 380 / 347 / 344 s"*, and `0252`'s `review.md:64`, which names *"448 s (7 min 28 s)"*), while
several other figures quoted to the producer could not be located at all. **That unreproducibility is
itself the reason the page should carry the ruled range, not a tally.** If the librarian wants to cite
evidence, cite `.github/workflows/test.yml` and `0252`'s ledger by anchor — do not invent a set.

---

## Item 2 — `log.md` names `0288` where the owed work is `0289`

### The misdirecting text — measured on disk 2026-08-13

`ai-agents/wiki-vault/log.md:2091-2095`, inside the `0258` ingest entry, under a paragraph about an
**owed resync**:

> ⚠️ **Found already-wrong on the page and deliberately NOT repaired — outside `0252`'s scope, owed
> its own resync:** the same-day `0285` block calls the unrunnable post-release verify command *"a
> SEPARATE, still-open defect (task `0254`)"*. **`0254` is no longer open** — its brief now sits in
> `ai-agents/tasks/done/`, and **a follow-up `0288` has been filed**. **Flagged in place on the page
> and here; the wiki does not file tasks.**

⚠️ **The `0288` mention is at `:2094`, not `:2095`** — the producer that filed this row re-measured it.
`:2095` is the paragraph's closing line. **Anchor on the quoted sentence, not the number.**

### ⚠️ THE GRADE IS "PARTIALLY CORRECT" — DO NOT SHARPEN IT TO "WRONG"

The `0258` reviewer graded this **partially correct**, and that nuance must survive into the fix:

- ✅ **`0288` really was filed**, really is a same-day follow-up, and really is open. The sentence is
  **not flatly false**.
- ⚠️ **But it is MISDIRECTING in context.** The paragraph is about an **owed resync of the vault
  page**. `0288` is the **code-fix** row (the post-release verify line's flag-combination defects,
  `## Owner: fkit-coder`). The **resync** is
  [`0289`](../../done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md)
  (`## Owner: fkit-wiki`) — which did not yet exist when the `0258` entry was written.
- ✅ **The correction is therefore an ADDITION, not a reversal**: the paragraph named the follow-up it
  knew about; a second, differently-owned follow-up now carries the resync debt it was describing.

⛔ **A correction entry that says the old entry "was wrong" has overshot and has failed this item.**

### ⛔⛔ `log.md` IS APPEND-ONLY — THE CORRECTION IS A NEW ENTRY, NEVER AN IN-PLACE EDIT

**The convention is stated in `log.md`'s own header.** Verified on disk 2026-08-13,
`ai-agents/wiki-vault/log.md:3-5`, quoted verbatim:

> Append-only activity log — newest entries at the bottom. Never edit or rewrite
> existing entries; only append. Each ingest / lint / sync operation adds one entry
> (see `schema.md` for the format).

**And it is an owner ruling, recorded on
[`0212`](../0212-append-a-dated-log-entry-correcting-the-still-open-framing/brief.md) (owner ruling
2026-08-03), quoted verbatim from that brief:**

> **A wiki run may NEVER edit or annotate a past `log.md` entry in place.** A correction lands as a
> **new dated entry** that names what it corrects by **folder ID and durable anchor**. The original
> entries stay **byte-identical**.

⛔ **A librarian who edits `:2094` in place has broken the log's own contract**, regardless of how
small or how true the edit is. ⚠️ Related prior work — [`0211`](../../done/0211-annotate-the-three-old-form-completion-flags-in-the-vault-log/brief.md)
is the **carve-out**, not the rule; do not read it as permission.

---

## ⚠️ RE-DERIVE FROM DISK — THIS BRIEF IS A POINTER, NOT A SOURCE

⛔ **This project has been bitten repeatedly by corrections that were themselves wrong** — including
inside owner-approved plan text and inside a review ledger. Every `:NNN` above is a **dated anchor of
2026-08-13**; the durable anchor is the **quoted text**. Before writing, re-derive:

- `index.md`'s `~6 min` sentence and its line;
- `log.md`'s `0288` sentence and its line;
- `log.md`'s append-only header;
- `0252`'s residual text and its scope;
- `0288`'s and `0289`'s `## Status` and `## Owner`.

⚠️ **State explicitly, in both directions, where what you measure differs from this brief.**

### ⛔ THIS ROW RUNS IN A `fkit wiki` SESSION — NOT IN `/fkit-sprint-ship-loop`

`## Owner` is **`fkit-wiki`** and must stay that way. **Vault writes are that role's exclusively**
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

⚠️ **The sprint loop cannot run this row** — the same exclusion recorded on
[`0258`](../../done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md),
[`0285`](../../done/0285-wiki-resync-of-the-install-and-self-update-page-after-0257/brief.md),
[`0287`](../0287-wiki-resync-of-the-codex-sandbox-read-only-pages-after-0273/brief.md) and
[`0289`](../../done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md):
**the loop never reads `## Owner`**
([ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)
fixes each step's role to the skill that step runs), so its **Build** step spawns `@fkit-coder`, and
that role may **never** write the vault. Driven by the loop this row either stalls on a refusal or
breaches ADR-005. **It runs in a `fkit wiki` session, or via a spawned librarian.**

⚠️ **That is an exclusion from the loop and from nothing else.** `## Status` stays `🔲 Backlog`. This
row is **NOT blocked**, **NOT deprioritised**, **NOT descoped**.

### ⚠️ Concurrency — `0289` is executing against a DIFFERENT page

At filing time a librarian was running `0289` against
`ai-agents/wiki-vault/wiki/systems/install-and-self-update.md`. **Neither of this row's two sites is
that page**, and `0289`'s scope is owner-ruled to that one page. **No overlap.** ⚠️ But `0289`
**appends its own `log.md` entry**, so re-read `log.md`'s tail before appending — do not assume the
file ends where this brief says it does.

## What to build

Two corrections, **one run**, in a `fkit wiki` session under the librarian's own procedure
(`/fkit-wiki-ingest` on these targets — **the librarian's call which fits**).

1. **Re-derive** every fact listed under *"RE-DERIVE FROM DISK"*. ⛔ Do not work from this brief's
   quotations. **Report both-direction differences.**

2. **Item 1 — edit `ai-agents/wiki-vault/index.md` in place.** Replace the superseded
   `~6 min per release` figure in the `0256` roll-up line with the **owner-ruled range wording**
   (`roughly 6–8 minutes, machine-dependent`), attributed as the ruling it is.
   - ⛔ **Change nothing else on that line.** Everything else in the `0256` roll-up — the two gates,
     `fetch-depth: 0`, the load-bearing gate position, the `install.sh`-uncovered flag — is
     **accurate and stays byte-identical**.
   - ⛔ **No duration list.** See *"On the measured numbers"* above.
   - ⛔ **`index.md` only.** If the same superseded figure appears on a **content page** under
     `wiki/`, ⚠️ **REPORT it as a finding — do not fix it here.** That is a separate row's call.

3. **Item 2 — append ONE new dated entry to `ai-agents/wiki-vault/log.md`.**
   - The entry names what it corrects by **folder ID and durable anchor** — the `0258` ingest entry,
     the *"Found already-wrong on the page and deliberately NOT repaired"* paragraph, quoted.
   - It records the **partially-correct** shape: `0288` was filed and is real, **and** the resync debt
     the paragraph describes is carried by `0289` (`## Owner: fkit-wiki`), which did not exist when
     the entry was written. ⛔ **Not "the entry was wrong."**
   - ⛔ **The original paragraph stays byte-identical.** No in-place edit, no annotation, no reflow.
   - ✅ **This same entry also records item 1's `index.md` edit** — one run, one log entry, both
     corrections named. (A second entry is acceptable if the librarian's procedure demands it; what is
     **not** acceptable is an unlogged vault write.)

4. **Bidirectional link hygiene** — if either correction adds or changes a `[[…]]` link, fix the
   back-link on the far page. ⛔ **That is the ONLY circumstance in which this task touches a third
   file.**

5. **Record one verdict per site touched** — *corrected in place* / *append-only, new entry written* /
   *out of scope, reported*. ⛔ A batch verdict does not satisfy this.

### Constraints

- ⛔ **SCOPE IS TWO SITES** — `ai-agents/wiki-vault/index.md` (the `0256` roll-up line) and
  `ai-agents/wiki-vault/log.md` (one appended entry), plus whatever link hygiene step 4 requires.
  ⛔ **This is NOT a general vault sweep and NOT a `~6 min` hunt.** If a broader sweep looks valuable,
  **report it as a finding; do not run it here.**
- ⛔ **DO NOT TOUCH `bin/release.mjs` OR `.github/workflows/test.yml`** — their `~6 min` figures are a
  **live accepted residual** on `0252` (`review.md:68`). Editing them breaches it.
- ⛔ **`log.md` is APPEND-ONLY** — owner ruling 2026-08-03 (`0212`), and `log.md:3-5`.
- ⛔ **Vault writes only.** Do not edit `ai-agents/knowledge-base/`, `claude/`, `RELEASING.md`, or any
  source file. ⚠️ **If a knowledge-base page carries the same superseded figure, REPORT it — do not
  fix it.**
- ⛔ **Do not edit any existing task brief**, including `0252`'s, `0256`'s, `0258`'s, `0288`'s and
  `0289`'s — and **do not edit `0252`'s review ledger**.
- ⛔ **Do not touch `wiki/systems/install-and-self-update.md`** — `0289` owns it and may be mid-run.
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  no re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  no board-row edit beyond this task's own close.
- ⛔ **No commit, no push.**

## Verification steps

Each step is a runnable command. **Paste the command and its output; do not assert.**

1. **Facts were re-derived, not inherited.**
   ```
   grep -n "6 min per release" ai-agents/wiki-vault/index.md
   grep -n "a follow-up .0288. has been filed" ai-agents/wiki-vault/log.md
   sed -n '1,6p' ai-agents/wiki-vault/log.md
   grep -n -A2 "^## Status" ai-agents/tasks/backlog/0288-*/brief.md ai-agents/tasks/backlog/0289-*/brief.md 2>/dev/null
   ```
   ⚠️ **State explicitly where the measurement differs from this brief.**

2. **Item 1 landed — the range replaced the point figure.** Both must hold:
   ```
   grep -c "6 min per release" ai-agents/wiki-vault/index.md          # expect 0
   grep -n "6–8 minutes, machine-dependent" ai-agents/wiki-vault/index.md   # expect ≥1 hit
   ```

3. **Item 1 did not leak.** The residual's code sites are untouched:
   ```
   git diff --stat -- bin/release.mjs .github/workflows/test.yml RELEASING.md   # expect EMPTY
   grep -c "~6 min" bin/release.mjs                                    # expect 3, unchanged
   ```

4. **Item 2 landed — a NEW log entry exists and names both the anchor and `0289`.**
   ```
   git diff --numstat -- ai-agents/wiki-vault/log.md    # deletions column MUST be 0
   tail -60 ai-agents/wiki-vault/log.md | grep -n "0289"
   ```
   ⚠️ **`0 deletions` is the append-only proof.** A non-zero deletion count means a past entry was
   edited — **that is a failure of this task, not a detail.**

5. **Item 2 did not overwrite — the original paragraph is byte-identical.** Capture the paragraph's
   sha before the run and re-check after:
   ```
   grep -n "a follow-up .0288. has been filed" ai-agents/wiki-vault/log.md
   git diff -U0 -- ai-agents/wiki-vault/log.md | grep '^-' | grep -v '^---'   # expect EMPTY
   ```
   ⛔ **Any `-` line other than the diff header means the log was edited, not appended.**

6. **Nothing outside the two sites changed.**
   ```
   git status --porcelain
   ```
   ⚠️ Expect **only** `ai-agents/wiki-vault/index.md`, `ai-agents/wiki-vault/log.md`, this brief, and
   at most one far page from step 4's link hygiene. ⛔ **Nothing under
   `ai-agents/knowledge-base/decisions/`, nothing in `claude/`, no source file, and NOT
   `wiki/systems/install-and-self-update.md`.**

7. **Nothing committed, nothing staged.**
   ```
   git log --oneline -1 && git diff --cached --stat   # expect the staged diff EMPTY
   ```

## Notes

- **Why Backlog / Unscheduled.** Sprint 5 is finished (16 done, `0255` in flight); there is no open
  sprint to file into. Both items are **low-severity accuracy corrections to synthesized knowledge**,
  not defects in shipped behavior — nothing is broken for a user, and no other row is blocked on
  them. ⛔ **This row was filed by a spawned producer with no owner channel, so it is UNRANKED and
  re-ranks nothing** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  The owner may rank it whenever they next touch the board.
- **Relationship to `0289` — deliberately separate.** The owner was offered "extend `0289`" and chose
  a new row. `0289` is scoped, owner-ruled, to **one page**
  (`wiki/systems/install-and-self-update.md`) and one claim (the *"still-open `0254`"* text). Neither
  of this row's sites is inside that scope.
- **Relationship to `0290`.** `0290` asks the *general* question — should anything **notice** when
  closing a task falsifies a vault claim. This row is a **specific instance** of exactly that pattern
  and is useful evidence for `0290`'s investigation. ⛔ **It does not answer `0290` and must not try
  to.** No mechanism, no lint check, no skill edit belongs in this row.
- **Relationship to `0212`.** `0212` is a different `log.md` append — it corrects the `"still open"`
  framing of `0143`'s fix on two 2026-07-26 entries. **No overlap.** Its owner ruling on the
  append-only method is cited above because it is the governing precedent, not because the rows share
  scope. ⚠️ If both run in one session, they are still **two distinct dated entries**.
- **`0258` was not re-opened.** It closed `✅ Done (agent-closed — not owner-verified)` and its review
  verdict was sound. This row carries forward two corrections that were **outside** its owner-ruled
  scope, in the same way `0289` carries the one `0258` itself flagged and declined.

- **⚠️ Dated correction, 2026-08-13 — `0289` HAS FINISHED AND CLOSED. Two things written above are
  superseded. Every prior byte is left identical, per this project's dated-correction practice. They
  were TRUE WHEN WRITTEN; they are SUPERSEDED, NOT DELETED.** **Authority:** the owner, 2026-08-13,
  `fkit lead` session, verbatim option label **"Correct both, and record it IN 0290 as evidence"**.
  Appended by a spawned `fkit-producer` with **no owner channel**. ⛔ **Nothing else about this row
  changed** — `## Status` stays `🔲 Backlog`, `## Priority` stays `Unscheduled`, `## Sprint` stays
  `Backlog`, `## Owner` stays `fkit-wiki`. **No board row was touched, nothing was re-ranked**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  **no mover ran** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  **nothing was written under `ai-agents/wiki-vault/`** (⛔ [ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  and **nothing was committed.**

  **What is now superseded — each re-measured on disk 2026-08-13, not inherited:**

  1. **`:197-201` and `:255` — the concurrency fence against
     `wiki/systems/install-and-self-update.md`. ⛔ THE FENCE IS SPENT.** The section above says *"At
     filing time a librarian was running `0289`"* and the constraint at `:255` says `0289` *"owns it
     and may be mid-run"*. **The run has FINISHED.** `0289` is closed —
     `ai-agents/tasks/done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/brief.md:12-13`
     reads `✅ Done (agent-closed — not owner-verified)` — and its correction block is on the page at
     `install-and-self-update.md:99`.
     ⚠️ **A planner reading the old text would honour a constraint that no longer applies.** ✅ **The
     CONCLUSION the fence protected is unaffected and still binding for an entirely separate reason:
     `install-and-self-update.md` is still OUT OF THIS ROW'S SCOPE**, because this row's scope is
     owner-ruled to **two sites** — `ai-agents/wiki-vault/index.md` and `ai-agents/wiki-vault/log.md`
     — and that page is neither. ⛔ **Still do not touch it. The reason is scope, no longer
     concurrency.**
     ✅ **The `log.md` re-read warning at `:201-203` STANDS and is now confirmed, not hypothetical** —
     `0289` **did** append its own `log.md` entry. **Re-read `log.md`'s tail before appending; do not
     assume the file ends where this brief says it does.**

  2. **`:270`, verification step 1 — the glob `ai-agents/tasks/backlog/0289-*` MATCHES NOTHING**
     (confirmed: `zsh: no matches found`; the `2>/dev/null` on that line means it fails **silently**,
     which is worse — the check would appear to pass while covering nothing). **The working path,
     verbatim:**
     `ai-agents/tasks/done/0289-wiki-resync-of-the-still-open-0254-claim-in-the-install-pages-0285-block/`
     — so step 1's last line should be run as:
     ```
     grep -n -A2 "^## Status" ai-agents/tasks/backlog/0288-*/brief.md ai-agents/tasks/done/0289-*/brief.md
     ```
     ⚠️ **`0288` is still under `backlog/` — verified today — so only the `0289` half of that line
     moves.** ✅ **`:270` is the ONLY dead `backlog/0289-*` path in this brief**; every other `0289`
     reference here is prose or a link already pointing at `done/`. Enumerated with
     `grep -rn "backlog/0289"` over this file, not taken on report.

- **✅ Dated re-measurement, 2026-08-13 — BOTH of this row's target sites are STILL UN-FIXED. The work
  is fully live.** ⚠️ Checked specifically because `0289` also wrote `log.md`, so item 2's site could
  plausibly have moved underneath this brief. It did not.
  - **Item 1 — `ai-agents/wiki-vault/index.md:323`** still carries **`Measured cost ~6 min per
    release`** in the `0256` roll-up line. `grep -n "6–8 minutes" ai-agents/wiki-vault/index.md`
    returns **nothing**. **Unchanged; item 1 stands exactly as written.**
  - **Item 2 — `ai-agents/wiki-vault/log.md:2094`** still carries the *"and a follow-up `0288` has
    been filed"* text inside the `0258` ingest entry. **Unchanged; item 2 stands exactly as written.**
    ⚠️ **`0289` saw this site and deliberately left it alone** — its own ledger row in `log.md` records
    the verdict *"Out of scope, reported — same owner-assigned task, and append-only means it can only
    ever be a new entry, never an edit. Not touched."* ✅ **That is a confirmation of this row's
    premise, not a conflict with it:** the site is still owed, and it is owed to **this** row.
  - ⛔ **Re-derive both anyway when this row runs** — this note is a dated measurement, not a
    substitute for step 1.

- **⚠️ Dated note, 2026-08-13 — this row's own brief became an instance of `0290`'s subject.** Closing
  `0289` falsified the two statements corrected above, in the same working session this row was
  filed. **The evidence is recorded in
  [`0290`](../0290-decide-whether-anything-should-notice-when-a-close-falsifies-a-vault-claim/brief.md)'s
  `## Notes`, where it belongs.** ⛔ **Nothing about it changes this row's scope, which remains the two
  vault sites named above** — and ⛔ **this row still must not try to answer `0290`'s question**, per
  the *"Relationship to `0290`"* note above, which is unaffected.
