# 0162 — approved plan

- **Task:** `0162` — *Decide the construction that satisfies the sprint-loop's verbatim-carry requirement*
- **Worker role:** `fkit-architect` (Build worker of `/fkit-sprint-ship-loop`)
- **Approved by the owner** via `AskUserQuestion` in the live driver session, **2026-08-02** — *"Approve
  as planned"*, with four accompanying rulings (§5).

---

## ⚠️ 0. This file is the worked example of the defect this task diagnoses

**`/fkit-sprint-ship-loop` does not write `plan.md` until the Build step.** So this file — the approved
plan — is being written **by the worker implementing it**, hours after the approval it records, not at
the moment of approval. That is finding **F2**, demonstrated on the very task that found it.

Verified firsthand: at the start of this Build turn, an `ls -la` of this folder returned exactly one
file, `brief.md`.

**The consequence the owner's own ruling ran into immediately.** The owner ruled (OQ-1) that a carry is
*paste + path/hash pointer*. The spawn prompt that produced this work carried **the paste and no
pointer** — because the referent did not exist yet. **Half of the approved construction was unavailable
at the moment it was supposed to be used.** The driver disclosed this rather than asserting a fidelity it
could not deliver; the disclosure is testimony, unverifiable (no transcript is stored).

Contrast `claude/skills/fkit-task-ship-loop/SKILL.md:102` and `:143`, which persist the plan **at plan
approval**. Follow-up 1 (§6) moves the sprint loop's write to match. **Nothing else in this plan is
executable until it does.**

---

## 1. Deliverable — what the approved plan authorized

**Exactly one new file:** `ai-agents/knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md`,
a decision report, plus this task folder's `plan.md` and `worklog.md`.

**Explicitly NOT authorized, and not written:** no ADR (including the ADR-037 §5 correction note — that
is follow-up 4), no `SKILL.md` edit, no agent definition, no source, no test, no task brief, no board
row, nothing under `ai-agents/wiki-vault/`. No task-folder move, no status change (the close is a
producer's). No commit, no push.

---

## 2. Findings established before any question was answered

| # | Finding |
|---|---|
| **F1** | The brief's own citation is stale — `SKILL.md:109` → **`:110`**, and its quote range `:109-115` → **`:110-116`**. `:109` is the heading. **Two stale citations, not the one the plan named.** |
| **F2** | **The sprint loop never writes `plan.md` before the Build spawn.** It names `plan.md` once (`:103`, Build row) and has no artifact table. `0147/` and `0150/` — the two tasks from the failing run — have no `plan.md` on disk. Carry-by-reference is therefore unavailable to the Build spawn and available to Process-review. |
| **F3** | **A driver-side machine check is built precedent, not a concept.** `claude/fkit-claude.sh:296` wires `PreToolUse` hooks by matcher; `skill-ownership-hook.sh:41-47` **denies**. A third matcher on `Task` is mechanically available and receives the spawn prompt. |
| **F4** | **Worker-side detection is impossible** — `claude/agents/fkit-coder.md:93-98`, re-read today. Zero mechanisms proposed. |
| **F5** | The driver's `0195` §7 testimony said "five Q&A pairs"; disk says **four**, and the document's own prose says *"All four"*. The one checkable detail in the testimony is wrong. |

---

## 3. Corrections made to the approved plan during the Build

**A plan is not evidence.** Every claim was re-verified against live files before use. Six corrections:

| # | The plan (or brief) said | Verified today |
|---|---|---|
| **C1** | Repair `:109` → `:110` | **Two citations are stale**, not one — the quote range `:109-115` must also become `:110-116`. Follow-up 6 widened. |
| **C2** | *(brief)* "no test reads `fkit-coder.md` or **any `SKILL.md` content at all**" | **Half wrong.** The `fkit-coder.md` half holds (one `existsSync` hit, `test/converge-contract.test.js:357`). But `test/skill-frontmatter.test.js:577`/`:596` read every skill and agent file's **frontmatter** over a pinned corpus (25 skills, 7 agents). The accurate claim: **no test reads the *body*.** Not inherited — corrected in the report and filed as follow-up 7. |
| **C3** | The unenforced-prose class is `0152`/`0154`/`0157` | **`0157` is closed** (`ai-agents/tasks/done/0157-…`). The open members are `0152` and `0154`. |
| **C4** | "`PreToolUse` hooks wired by matcher" incl. the ship-loop marker hook | `shiploop-marker-hook.sh` is a **`UserPromptExpansion`** hook. Only **two** `PreToolUse` matchers exist (`Skill`, `AskUserQuestion`). Precedent stands; count corrected. |
| **C5** | "no `.claude/settings.json` exists" | True — **but `.claude/settings.local.json` does exist** and is a valid hook host. Checked: it carries **no `hooks` key**. The conclusion holds by a narrower margin than "no settings file exists". |
| **C6** | "add a content hash or git blob ref" | Specified concretely: **`git hash-object`**, which works on **untracked** files. Material — `0143/plan.md`, `0158/plan.md`, `0195/plan.md` are all `??` in `git status` today, so a `git rev-parse HEAD:<path>` pointer would fail on every one. |

---

## 4. The answers, as delivered

| Q | Answer |
|---|---|
| **Q1 — what is a faithful carry?** | **A model restating a long text from its own context cannot be relied on to reproduce it byte-for-byte, nor to detect its own failure to.** So a carry is defined as a **copy operation over a durable artifact**: `Read(plan.md)` in the spawning turn → paste that tool output → cite path + hash. Never recall over conversation state. |
| **Q2 — is by-reference acceptable?** | **Paste *and* pointer.** Three properties separate a good pointer from round 1's, and round 1's had **none**: **durability** (round 1 named "your previous message" — a context the new worker never has), **existence at spawn time** (F2 — today's Build pointer fails this too), **revision identity** (a bare path doesn't say which revision was approved). |
| **Q3 — long plans** | **Truncation is never permissible**, in any declared form. If the plan will not fit, carry **by reference only** and say so — never a partial paste. Discipline: **"verbatim" is a word a driver may apply only to bytes it read from a file that turn.** |
| **Q4 — does (b) survive?** | **(b) stands byte-unchanged** (`fkit-coder.md:65-66`). The changes are to the *driver's* obligation, not the *worker's* condition. **`0163` needs no edit** — its brief (`:96-100`) already keys its clause on (a)(b)(c) rather than re-spelling "verbatim". |
| **Q5 — machine-checkable?** | **Worker-side: no, impossible.** **Driver-side: yes — a `PreToolUse`/`Task` hook**, with four caveats: it checks **(b) only**; it is **hard-gated on F2**; it needs **real JSON parsing** (the sibling hooks' jq-free `"[^"]*"` extraction breaks on a prompt field); **hooks exist only in launcher sessions**. |
| **Q6 — ADR-037** | The ruling **strengthens** the marker. But **ADR-037 §5's *"none is possible"* is too strong** — true of (a) and (c), false of (b). A **narrowing, not a reversal**, and **not** the ADR's pre-registered re-raise trigger (`:362-364` reserves that for a cross-context *token*; this is a file). **Loud:** pure by-reference would have **weakened** the marker — a one-line pointer is far cheaper to forge than a thousand-word paste. |

---

## 5. The owner's rulings — 2026-08-02, `AskUserQuestion`, live driver session

- **Plan approved as written** — report-only, one file under `reports/`, no ADR, no `SKILL.md` edit, no
  brief, no board row.
- **OQ-1 → (a) PASTE + PATH/HASH POINTER.** Both. *A paste alone is unfalsifiable — which is why round
  2's false certification worked.* Pure by-reference rejected partly because it **weakens** the marker.
- **OQ-2 → FILE THE HOOK AS A FOLLOW-UP, gated on the F2 fix.** Do not build it. All four caveats carry
  into the follow-up text.
- **OQ-3 → DATED CORRECTION NOTE ON ADR-037 §5.** Amend the ADR. **Not written by this task** —
  follow-up 4.
- **OQ-4 (timing) → folded into the plan approval, not separately ruled.** Surfaced in the report §11 as
  an open sequencing question.

*(Relayed by the driver. No transcript is stored; recorded as relayed.)*

---

## 6. Follow-ups — named, not written

Full and corrected text lives in the report, **§10**. Summary:

1. **(coder, prerequisite for 2 and 3)** Move the sprint loop's `plan.md` write to plan approval; add the
   artifact table it lacks.
2. **(coder)** Amend *"Rules that make this honor the ADRs"* with the construction + the "verbatim"-word
   discipline.
3. **(coder, hard-gated on 1)** The `PreToolUse`/`Task` carry-check hook + tests, carrying all four caveats.
4. **(architect/owner) — REQUIRED** by OQ-3. Dated correction note to ADR-037 §5.
5. ~~(producer) joint reconciliation of (b) + `0163`~~ — **DO NOT FILE.** Conditional on pure
   by-reference, which the owner rejected.
6. **(producer)** Repair `0162`'s **two** stale citations.
7. **(producer, small)** Correct the brief's test-surface claim (C2).
8. **(fkit-wiki)** Ingest the report.

---

## 7. Scope boundary — what this task did NOT do

No ADR written or edited · no `SKILL.md` touched · no agent definition touched · no source · no test · no
task brief filed · no board row · no sprint-plan edit · nothing under `ai-agents/wiki-vault/` · no task
folder moved · no `## Status` changed · no worker-side detection mechanism proposed anywhere · no commit,
no push.
