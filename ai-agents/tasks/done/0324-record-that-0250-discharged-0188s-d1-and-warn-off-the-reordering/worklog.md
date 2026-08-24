# Worklog — `0324` (`0324-record-that-0250-discharged-0188s-d1-and-warn-off-the-reordering`)

**Run date:** 2026-08-23 · **Executed by:** a **spawned** `fkit-producer` (no owner channel, ADR-021)
· **Tree at start:** `HEAD` = `05fd9d0`, dirty with other workers' uncommitted changes.

**Authority for writing (not merely filing) these notes:** owner ruling **2026-08-23**, given live via
`AskUserQuestion` in an `fkit lead` session driving `/fkit-sprint-ship-loop` — **verbatim option
label: "Apply the correction now (Recommended)"**. The earlier ruling (`"File the producer follow-up
(Recommended)"`) authorised filing only; a previous spawned producer correctly refused to edit
`sprint-6.md` under it. This run's write to `sprint-6.md` rests on the **apply** ruling.

---

## 1. Premise re-check — four rows, measured 2026-08-23

| # | Target | Anchor (quoted fragment) | Resolves? | Fragment present? | Still stale? | Already corrected? |
|---|---|---|---|---|---|---|
| **1** | `0188`'s `brief.md`, under `## What to build` | `### D1 — `claude/scaffold/CLAUDE.md`: the producer's row omits `/fkit-task-brief`` | ✅ | ✅ | ✅ yes — now false | ❌ no |
| **2** | same file, under `## Verification steps` | step 1, `**D1** — the producer row in `claude/scaffold/CLAUDE.md` lists exactly the skills` | ✅ | ✅ | ✅ yes — passes with no work done | ❌ no |
| **3** | `sprint-6.md`, the row whose Brief cell links `0188-repair-the-five-live-ownership-fact-defects` | `**D1** `claude/scaffold/CLAUDE.md`'s producer row omits `/fkit-task-brief`` | ✅ | ✅ | ✅ yes — now false | ❌ no |
| **4** | **the discharge itself** — `claude/scaffold/CLAUDE.md`'s producer row | the row's skill list | ✅ | — | — | ✅ **`0250`'s edit IS present** |

**Commands and output.**

```
$ git rev-parse --short HEAD
05fd9d0

$ git status --porcelain ai-agents/tasks/backlog/0188-.../brief.md
(empty — the file was CLEAN at run start)

$ grep -n "### D1" ai-agents/tasks/backlog/0188-.../brief.md
54:### D1 — `claude/scaffold/CLAUDE.md`: the producer's row omits `/fkit-task-brief`

$ grep -n '\*\*D1\*\*' ai-agents/tasks/backlog/0188-.../brief.md
138:1. **D1** — the producer row in `claude/scaffold/CLAUDE.md` lists exactly the skills

$ grep -n "0188-repair-the-five-live-ownership-fact-defects" ai-agents/sprints/sprint-6.md
241:| 🔲 Backlog | P14 | Repair the five live ownership-fact defects … **D1** `claude/scaffold/CLAUDE.md`'s producer row omits `/fkit-task-brief` …
```

⚠️ Those `:NNN` are **dated conveniences**, re-derived this run. Site 3 is a **coordination
document** — `durable-citation-anchors.md` row 3 rules `path:NNN` categorically wrong there; the row
is anchored on its **Brief-cell link**, not its number.

**Row 4 — the discharge, in full:**

```
$ grep -n "fkit-initiate-project" claude/scaffold/CLAUDE.md
23:| **producer** | … | `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal` |

$ grep -n "fkit-initiate-project" claude/skills/fkit-team/SKILL.md
54:   | producer | `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal` |

# extracted skill-list strings compared:
scaffold : [`/fkit-initiate-project`, `/fkit-status`, `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal`]
fkit-team: [`/fkit-initiate-project`, `/fkit-status`, `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal`]
→ IDENTICAL
```

`0250`'s edit **is present**; the twin match **holds**. The correction is therefore true and the run
proceeded. (Had it been absent, the brief's step 1 requires STOP.)

**The two orderings, re-measured this run** — the fact the notes turn on:

| Carrier | Position of `/fkit-task-brief` |
|---|---|
| `skills_for_role()`, `producer)` branch, in `claude/skills-for-role.sh` | **second** among role-specific skills |
| `claude/scaffold/CLAUDE.md` producer row | **third, after `/fkit-status`** |
| `claude/skills/fkit-team/SKILL.md` producer row | **third, after `/fkit-status`** |

**Re-verification of the "order is not normative" ruling** (the brief required this before quoting it
as landed). `grep -rn "order is not normative" ai-agents/ claude/` now returns hits — including
`0250`'s `review.md`, which records it with its verbatim label. ⚠️ **That file is a review ledger a
concurrent `fkit-coder`/reviewer is writing, and this run did not open or edit it.** The ruling is
therefore **not quoted as a landed convention** in any of the three notes; the reordering case rests
entirely on `0250`'s `plan.md` §1d, exactly as the brief instructed.

---

## 2. The three notes — all marked ⚠️, none marked ⛔

**Why ⚠️ and not ⛔** (`fkit-record-decision/SKILL.md`, §*Correcting an accepted ADR — the dated
correction note*): the legend admits exactly two markers and no third. ⚠️ = **a fact that drifted**;
⛔ = **a decision that was overturned**. Here a **defect was discharged** — the scaffold row no longer
omits the skill. **No decision was overturned.** Marking these ⛔ would tell every reader to stop
following a standing decision, which is false. The *"do not reorder"* warning is **content inside the
⚠️ note**, not a licence for a second marker — and for that reason **no ⛔ glyph appears anywhere in
any of the three notes**; the prohibition is carried in bold prose instead.

**Placement:** below the claim, per the form. Each note sits **immediately** below its claim with no
intervening prose, and **opens with the discharge sentence** — the mitigation the brief prescribes.
At site 1 the note is deliberately placed **above** the *"Repair against `skills_for_role()`"*
instruction, so a reader travelling down the section meets the warning **before** the instruction.

**Indentation:** site 1 is top-level prose → **column 0**. Site 2 is a numbered list item → the
item's **3-space continuation indent**.

**Citation form:** no `:NNN` written into any note; tasks cited by folder-ID per
`durable-citation-anchors.md` row 4; files cited by path plus quoted phrase.

---

## 3. Proof, per site — and the shapes are NOT the same

### Sites 1 and 2 (`0188/brief.md`) — additions-only, `+42 / −0`

```
$ git diff --numstat -- ai-agents/tasks/backlog/0188-.../brief.md
42	0	ai-agents/tasks/backlog/0188-repair-the-five-live-ownership-fact-defects/brief.md

$ git diff -U0 -- <that file> | grep '^-' | grep -v '^---'
(no output)

$ git diff --no-index --numstat <snapshot> <that file>
42	0

$ diff <snapshot> <that file> | grep '^<'
(no output)
```

Both quoted fragments are still present **verbatim** after the edit (`grep -c` → `1` each).

### Site 3 (`sprint-6.md`) — ⚠️ additions-only proof was NOT available, and this is expected

**A board row is one physical line.** Appending inside its `Task` cell **modifies** that line, so the
diff necessarily shows `-old +new` and a `+N / −0` figure is **unobtainable here**. ⛔ **No `+N/−0`
claim is made for this site**, and the row was not restructured to manufacture one.

**Proof used instead — byte-identical prefix preservation against a before-edit snapshot:**

```
PREFIX PRESERVED BYTE-IDENTICALLY: True   (3534 bytes, up to and including
                                           "**Recommended sequence position 14 of 18 — prose, not a rank.**")
TAIL   PRESERVED BYTE-IDENTICALLY: True   (the Brief-cell link is unchanged)
net added chars: 1576
```

⚠️ **`sprint-6.md` was already dirty from another worker**, so a diff against `HEAD` shows changes
that are **not this run's**. All site-3 measurement was made against the **before-edit snapshot**.
**Excluded by name as not this run's:** the ship-loop driver's `🔄 In progress` marking on `0250`'s
**P9 row (line 236)**, and the `0324` row already appended to `ai-agents/sprints/backlog.md`.

---

## 4. Board-shape checks

```
$ diff <snapshot> ai-agents/sprints/sprint-6.md   → 241c241   (EXACTLY ONE line changed)
line count before = after = 332
changed line numbers: [241]        ← the 0188 row, and nothing else
0250 P9 row (line 236): UNCHANGED
```

- **`## Status` field lines:** `git diff -U0 | grep -E '^[-+]## Status$'` → **empty**. No status value
  changed anywhere.
  ⚠️ A looser pattern (`^[-+].*## Status`) does return hits — those are the literal string
  `` `## Status` `` **inside board-cell prose** on other workers' dirty rows, not status fields.
  Stated rather than glossed.
- **Unescaped pipes:** escape-aware field count (`\|` masked before counting) over `sprint-6.md`.
  Defective-row set **before = empty**, **after = empty** — `diff` of the two sets is empty.
  **UNCHANGED.** ⚠️ Per the brief, a passing `dashboard.sh` is **not** evidence of this; the count
  above is. No `|` was written into the cell in any form.
- **Dashboards:**

| Check | Result |
|---|---|
| `dashboard.sh ai-agents/sprints/sprint-6.md` | **exit 0** |
| `dashboard.sh ai-agents/sprints/backlog.md` | **exit 0** |
| `backlog.md` render | **byte-identical** (`cmp` clean) |
| `sprint-6.md` render | differs on **exactly one line** — the `0188` row's `Task` text |
| `⟦FACTS⟧` block (`sprint-6.md`) | **byte-identical** |
| every `⟨derive: …⟩` field | **byte-identical**, both boards (11 on `sprint-6`, 107 on `backlog`) |
| every `depends=` value | **unchanged**, both boards |
| `derive 0188 depends=` | `"nothing."` — unchanged |
| counts | `8 done · 1 in progress · 10 backlog — of 19` — unchanged |

⚠️ **A false-negative I hit and am recording rather than hiding.** My first derive check used
`grep -o 'derive[^|]*'`, which matched the substring *"derive"* inside the phrase *"do not re-derive
one"* in the `0188` cell prose and reported a change. That was a **measurement artifact of my own
pattern**, not a derive change. Re-measured with `grep -o '⟨derive:[^⟩]*⟩'` → all fields
byte-identical. **No bold dependency label was quoted into any cell** (the `task-84` misreport class).

---

## 5. ⚠️ ACCEPTED GAP — the `0315` reader-warning gap, and it bites harder here

The correction-note form's part 3 is a header `- **Corrections:**` metadata bullet, and **it is what
justifies below-placement**: *"the reader is already warned first by the header bullet, so
below-placement costs no warning."* **A task brief and a board row have no such header, and no
equivalent has been defined** — that is `0315`'s open question. Following the precedent of `0318` and
`0320`, this run **omitted the header bullet** and records the gap here rather than inventing one.
⛔ `0315` is **not** pre-decided.

**Consequence, stated plainly: a reader who stops at the claim gets no warning.**

⚠️ **And the gap is more severe here than at those precedents.** At `0318` and `0320` the corrected
text was **testimony** — a reader who missed the note merely believed something stale. Here **D1 is a
live instruction to act**, so a reader who never reaches the note does not merely believe something
stale — **they execute the reordering**, undo `0250`'s deliberate choice, re-break the
scaffold-to-`fkit-team` twin match, and report success.

**Mitigation applied within the form:** each note is placed **immediately** below its claim with no
intervening prose and opens with the discharge sentence; at site 1 the note is additionally placed
**above** the *"Repair against `skills_for_role()`"* instruction it warns off. ⛔ **That is a
mitigation, not a fix.** The gap is **accepted**, belongs to `0315`, and is **not solved here**.

---

## 6. Out-of-scope confirmations

- `0188` **not reopened, re-statused, re-ranked, moved or renamed** — `## Status` `🔲 Backlog`,
  `## Priority` `Sprint 6 P14`, board rank **P14**, and headings `### D2` … `### D5` all present and
  byte-identical. **D1 is one of five; four remain live.**
- `0250` — **nothing in its folder was opened for writing**, `review.md` included (a reviewer was
  writing it concurrently). Its **P9 row is byte-identical**, `🔄 In progress` marking as found.
- `claude/` — **untouched**, scaffold and manifest included.
- `ai-agents/wiki-vault/` — **not written**. ⚠️ **Not measured either**: this run did not check whether
  the vault carries the same stale D1 claim. That absence is stated, not reported as a zero — **route
  any vault instance to `fkit-wiki`** (ADR-005).
- `ai-agents/knowledge-base/` — untouched. `0322`'s stray-pipe rows — **not repaired here**.
- **No commit, no push. No secrets in any artifact.**

---

## 7. Close

`0324` closed this session with `/fkit-task-done`, carrying
**`✅ Done (agent-closed — not owner-verified)`**. This producer was **spawned** and has no owner
channel (ADR-021), so per ADR-033 §5 the close is **agent-closed**: the owner's ruling authorised the
**work**, not a verification of it. **No human has checked this work.**
