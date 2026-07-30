# Worklog — 0161 disambiguate the frozen-history clause

Task: make the `## What NOT to rewrite` second bullet of
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` say which notation form it
covers. Dual-homed page; both copies must stay byte-identical.

Run by `fkit-coder`, spawned by `/fkit-sprint-ship-loop` under its declared-approval marker (the owner
approved the plan via `AskUserQuestion` in the driver session). **Two rounds: a build round, then a
process-review round that changed the remedy after review found it contradicted `0159`.**

There is **no `plan.md` on disk** — the plan lived in the driver session only. This worklog is therefore
written to stand alone: every check is defined below, not merely numbered.

---

## What changed, finally

One bullet, rewritten in **both** homes. `7` lines in, `2` out, per home.

```
- **Existing `priority (folderID)` notations are frozen history — the board-cell form only.** A sprint
  board's Priority cell like `124 (0150)` records what that row meant on the day it was written; the
  notation simply becomes unnecessary going forward, and is never mass-edited. The **prose** form
  `0150 (124)` in a brief's reasoning — the same two numbers, reversed — is **not** covered: it is a
  live cross-reference that misdirects a reader today. Owner ruling, 2026-07-27. A stale one is
  rewritten to **name the folder ID and drop the rank**; updating it to today's number only reproduces
  the defect with a fresher date.
```

Nothing else on the page changed. No link of any kind was added.

---

## Round 2 — the shipped remedy was wrong, and review caught it

**What round 1 shipped:** *"a stale one is corrected by **appending a dated correction**, never by a
silent rewrite."*

**Why that was a defect (review finding R1, high, owner-ruled Option A on 2026-07-30):** it contradicts
task `0159` on **15 sites**, and it was never the owner's ruling.

- `0159/brief.md:90-92` (**Part A**, the prose class — the class this clause declares *not covered*):
  *"Rewrite each site below to **name the folder ID and drop the rank** … Do **not** simply update the
  number to today's value: that reproduces the defect with a fresher date."*
- `0159/brief.md:184-186` (**Part B**): *"A **dated correction appended** at each site — **not** a
  rewrite. These are dated historical records and **fall squarely inside the carve-out**."* — i.e. the
  **frozen** class.

Round 1 took Part B's remedy — the one reserved for the frozen class — and applied it to the
**not-frozen** class. Exactly backwards.

**The decisive point:** `0159`'s **Ruling 2** (`0159/brief.md:27-32`), the ruling this whole task exists
to transcribe, **prescribes no remedy at all**. It settles only *which form is covered* and that *"the
sweep proceeds."* So the page shipped a substantive addition **dated and attributed as an owner ruling**,
on a page that ships to every scaffolded project and whose wording no test reads.

**Where the sentence actually came from:** `0161/brief.md:87-90` — this task's own brief — which
instructed *"Point at the **existing practice** — a dated correction appended, never a silent rewrite —
rather than inventing a new procedure."*

**Why the stop-and-raise gate did not trip.** `0161/brief.md:138-142` sets a hard gate: *"Must not
contradict 0159 … If the implementer finds they would say something different, **stop and raise it**."*
It did not trip because the brief framed the sentence as **"the existing practice"** — transcription of
something already settled, not an addition. Nothing in the sentence announced itself as new, so it was
never tested against `0159` the way a new claim would have been. **That is precisely the mechanism by
which an unruled claim acquires a ruling's authority:** it arrives pre-labelled as a quotation.
The gate was sound; the input to it was mislabelled.

**The fix:** the remedy clause now states `0159` Part A's actual remedy. The *"append a dated
correction"* sentence is gone, which also disposes of the secondary ambiguity R1 raised (what makes a
rewrite *"silent"*, and where a dated correction attaches to an inline mid-sentence parenthetical —
neither question arises any more). `0159` was **not** touched; its 15 sites of approved work stand.

**One judgment call inside the fix, flagged for the driver.** The *"Owner ruling, 2026-07-27"* stamp was
**moved** so that it closes the scoping-and-reason sentence — what the owner actually ruled — and the
remedy follows it, unattributed. Leaving the stamp at the end of the bullet would have re-created R1's
root defect in weaker form: attributing to the owner a remedy the ruling does not contain. The remedy is
`0159` Part A's, which is approved work, not a ruling. Everything else about the bullet is as the driver
directed: board-cell scoping, the `124 (0150)` / `0150 (124)` contrast, *"never mass-edited"*, and the
**2026-07-27** date.

---

## The driver supplied the wrong ruling date, and it was corrected against artifacts

The plan and build prompts both stated the owner ruled on **2026-07-29**. That is wrong; the date is
**2026-07-27**, evidenced by:

- `0159/brief.md:18` — *"The two owner rulings this task rests on — both 2026-07-27"* — and its Ruling 2
  at `:27-32`, which records this exact ruling.
- `0161/brief.md:44` — *"The owner ruling — already made, 2026-07-27"*.
- The page's own two date stamps (opening approval block; closing do-not-link callout).

Had 2026-07-29 been taken on trust, a wrong date would have been written into a page that ships to every
scaffolded project, contradicting `0159`'s recorded Ruling 2 — a hard constraint of this task's brief.
The driver accepted the correction before the build.

**Correction (review finding R3).** An earlier revision of this worklog said *"the only 2026-07-29 ruling
on the board is `sprint-2.md:159`, which concerns 0162's placement."* **That was false.** `sprint-2.md`
records several further owner rulings dated 2026-07-29 — among them `0165`'s promotion, `0154`'s
promotion, and the filing approval for `0162`/`0163`/`0164`. **The conclusion is unaffected**: none of
them concerns the frozen-history clause, so 2026-07-27 remains the right date. But the supporting claim
was overstated, in the very artifact whose job was to justify the correction.

**`0159` needs no edit.** Its Ruling 2 and this bullet now agree on the covered form, the reasoning, the
date, and — after round 2 — the remedy.

---

## Checks — what each one is, and its result

Run at the end of round 2, against the final state of both homes. `H0` = `HEAD`'s content,
`sha256 340ab5cb…e781ca`. `H1` = round 1's content, `fc4f8e37…`. `H2` = final, `b7cc3845…`.

| # | What it checks | How | Result |
|---|---|---|---|
| V1 | Both homes byte-identical, **and the content actually changed** — three clauses: `diff` silent, the two hashes equal each other, and the hash differs from the previous state | `diff` + `shasum -a 256` on both homes | **PASS** — identical; both `b7cc3845bb0e0e678e2b768cbbd951f7f655514cc32429d7d4499d7b812a894f`; ≠ `H1` `fc4f8e37…` ≠ `H0` `340ab5cb…` |
| V2 | Both homes changed by the same amount (one logical edit, two files) | `git diff --numstat` on both paths | **PASS** — `7 2` and `7 2` |
| V3 | **Nothing but the target bullet was removed** — the approval block, sibling bullets, the `## What to write` table, the enforcement list and the closing callout all intact | `git diff -U0 -- <path> \| /usr/bin/grep '^-' \| /usr/bin/grep -v '^--- '` | **PASS** — exactly **2** deleted lines per home, and they are exactly the two original bullet lines |
| V4 | No relative markdown link added into the ⛔ never-sync `decisions/` or `reports/` (such a link would be **dead in every scaffolded project**) | `/usr/bin/grep -nE '\]\(([^)]*/)?(decisions\|reports)/'` on both homes | **PASS** — no match; reported as `CLEAN`, not as an unqualified "zero hits" |
| V5 | The deliberate **bare** citations survived unweakened | count `ADR-029` and the decision-report filename; joined-line sweep for the callout sentence | **PASS** — `ADR-029`=3, report=2, per home (unchanged from pre-edit); *"cited by name and NOT linked — deliberately"* present in both |
| V6 | Change surface — no brief, board, skill or source file touched. Snapshot-delta based, because the working tree was **already dirty** with unrelated work | `git status --porcelain` before/after, `diff`ed | **PASS** — round 1 delta was exactly the two page copies; round 2 added **no new path** |
| V7 | Board ranks unchanged; `ai-agents/wiki-vault/` neither written nor reverted | `/usr/bin/grep -oE '\| P[0-9]+ \|' sprint-2.md` before/after; `git diff --numstat -- ai-agents/wiki-vault/` | **PASS** — `RANKS UNCHANGED` (145 cells); wiki-vault still `4 0` on `wiki/systems/testing-and-verification.md`, its pre-existing state |
| V8 | Test suite green (regression guard only — see below) | `npm test` | **PASS** — **523 tests, 523 pass, 0 fail**; `prove-red.sh` hard gate passed |
| V9 | **Standalone-read test** — the clause must answer both questions from its own words, with no appeal to a ruling, a brief, or the plan | read the shipped bullet cold, answer both | **PASS** — see below |

**Roll-up: 9 of 9 checks pass** at the final state. Two checks were themselves defective and were
repaired mid-run (next section); the results above are from the repaired forms.

### V9 answers, from the final wording alone

- *"I am correcting a stale `0150 (124)` cross-reference inside a brief's reasoning — does this clause
  forbid me?"* → **No.** The bullet scopes itself *"the board-cell form only"* and names the case
  directly: the prose form *"is **not** covered"*. It then says what to do — *"rewritten to name the
  folder ID and drop the rank"* — and warns that *"updating it to today's number only reproduces the
  defect with a fresher date."*
- *"I want to mass-edit the `124 (0150)` cells on a sprint board."* → **No — that is the frozen form.**
  *"A sprint board's Priority cell like `124 (0150)` records what that row meant on the day it was
  written; the notation … is never mass-edited."*

---

## Two checks were wrong and were repaired mid-run

1. **V3's predicate was blind to the exact damage it exists to catch.** `git diff -U0 | grep '^-[^-]'`
   **cannot see a deleted markdown list item** — a deleted `- **Existing…` renders as `-- **Existing…`
   and `[^-]` filters it out. It reported **1** deleted line where there were **2**. Since V3's whole
   job is to prove no other bullet, table row or callout was disturbed, the defective form read falsely
   clean. Repaired to `grep '^-' | grep -v '^--- '`. The reviewer reproduced the 1-vs-2 discrepancy and
   **swept the sprint: the defective construction appears in no other brief or plan on disk**, so it is
   a class risk, not a live spread.
2. **V8's command was wrong for this repo.** The brief specifies `node --test test/` (`0161/brief.md:132`);
   this repo runs `node --test test/*.test.js && bash test/prove-red.sh` (`package.json`). The directory
   form fails with `MODULE_NOT_FOUND` — a **false red** unrelated to any change. Used `npm test`.
   The brief's step 8 is still wrong on disk; flagged, not fixed (this task may not edit a brief).

---

## Nothing guards this page — the checks above were the only guard

No test reads this page's wording, and **no test compares its two homes.**
`test/converge-contract.test.js:369` ("byte-for-byte") compares a *freshly scaffolded output tree*
against `claude/scaffold/`; it never reads the live `ai-agents/` copy, so **editing one home and not the
other would have left the suite green.** ADR-027 decided a parity test should exist; task **0133** is
building it and it is **not landed**. This is why V1 required the hash to have **changed** as well as to
match — a plain identity check passes happily on two untouched files — and why the second home was
produced by `cp` in both rounds, never re-typed.

The green suite above therefore says nothing about this change. It is a regression guard on unrelated
code, and that is all.

**And review, not any check, is what caught the round-1 defect.** Every one of V1–V9 passed on round 1's
wording. V1 and V2 pass just as happily on two identical **wrong** files.

---

## Out of scope, flagged not fixed

- `0161/brief.md:156-168` cites its own rank as **128** and `0157`'s as **127**; the board reads **P131**
  and **P130** (two later displacement re-ranks). That is a stale board-rank citation in brief prose —
  **`0159`'s sweep surface**, not this task's. Under the clause as now written it is repaired by
  **rewriting it to name the folder ID and drop the rank**, which is a small demonstration that the
  corrected wording is operable on a real case. (Under round 1's wording it would have been repaired the
  opposite way — the contradiction R1 identified, visible on this task's own brief.)
- `0161/brief.md:132`'s wrong `node --test test/` command, above.
- **The page's remedy is narrower than `0159` Part A.** Part A also allows stating the order
  *relatively* (*"directly below 0147"*) where relative order is the actual point. The bullet states only
  the folder-ID remedy, per the owner's Option A wording. Not a contradiction — a narrower restatement.

## Change surface

- `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`
- `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`
- this `worklog.md`, and the *Coder response* section of `review.md`

No commit, no push. No task file moved, no board rank changed, no brief edited (including `0159`'s),
nothing written to `ai-agents/wiki-vault/`.

**Line citations in this worklog are anchored by quoted text wherever a coordinate could move.** The
page's closing callout date stamp — cited as `:63` in an earlier revision of this file (review finding
R4) — was already stale when written: the round-1 edit had moved it to `:67`, and the round-2 edit moved
it again to **`:68`**. It is cited here by its text, *"Owner ruling, 2026-07-27. `task-status-vocabulary.md`
above *is* linked…"*, which survives the next shift. This is an instance of the class `0160` is deciding.
