# Repair the four-mirror checklist in `claude/skills-for-role.sh`'s header — it is incomplete again

## ID
0226

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-up 5 of `0200`'s report**, filed on a **named owner ruling** taken via `AskUserQuestion` in a
live `fkit lead` driver session on **2026-08-05**: *file items 1, 2, 3 and 4 from `0200`'s unfiled
follow-ups list*. Source:
[`2026-08-05-eval-process-review-step-role-ownership.md`](../../../knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md)
**S13 and §8 item 5**.

> ### ⛔ THIS TASK IS INDEPENDENT OF `0200`'s RULING.
>
> `0200` decided *which role runs the Process-review step*. **This task is not downstream of that
> decision** — the checklist would be incomplete whichever way `0200` had ruled. It was found **while**
> costing the rejected option (b), not **because** of it. Do not gate it on ADR-038, and do not frame
> it as a consequence of the routing rule.

**The framing worth keeping.** `claude/skills-for-role.sh`'s header carries this warning, in its own
words:

> *"⚠️ THIS LIST SAID "TWO" UNTIL 2026-07-18, AND THE OMISSION COST EXACTLY WHAT IT LOOKS LIKE IT
> WOULD. Task 70 followed the two-item list precisely and still shipped a false statement into every
> consuming project… A checklist that is itself incomplete is worse than no checklist: it is followed,
> and it fails. If you add a fifth mirror, add it HERE FIRST."*

**This is the task-70 failure mode recurring inside the very checklist that documents task 70.** The
list now says FOUR and is still incomplete.

---

### ⚠️ RE-DERIVE THE SITE LIST YOURSELF AND COUNT IT. Do not inherit any number in this brief.

**Two prior counts of this ground were wrong.** `0200`'s report §7 printed *"8 files / 9 sites"*;
its own ledger residual **R15** records the true figure for that scope as **7 files / 8 sites** — and
the wrong figure had propagated from a reviewer's Round-1 error before anyone re-measured. **Every
count in this repo on this subject is a hand grep.** Treat the table below as a **measured floor to
re-verify**, never as the answer.

### The measured floor — taken first-hand 2026-08-05

**Definition used** (state your own, and say if it differs): *a site is a passage that states, in
human-readable text, which role owns which fkit skill — or asserts a skill count that a role→skill
change would falsify.*

**Declared by the header today — 4 files:**

| Declared file | What the header says it is |
|---|---|
| `claude/skills/fkit-team/SKILL.md` | the roster the `/fkit-team` skill prints |
| `claude/README.md` | the skill-ownership table |
| `claude/scaffold/CLAUDE.md` | ships into every consuming project's root `CLAUDE.md` |
| `ai-agents/knowledge-base/architecture.md` | the skill count and the role/skill table |

**Undeclared sites measured this turn:**

| # | Site | Measured at |
|---|---|---|
| U1 | **Every skill's own `⛔ Owner:` banner** — each names the one role allowed to execute it. `/usr/bin/grep -rln '⛔ Owner' claude/skills/` returns **24 files**; only `fkit-query` has none (universal by design), and 24 + `fkit-query` = the 25 skills `architecture.md` counts. Example: `> ## ⛔ Owner: the **coder**` | `claude/skills/fkit-process-stateful-review/SKILL.md:14` (+ 23 more) |
| U2 | **Every agent prompt's own skill list** — all **7** roles: architect `:45`, coder `:102`, reviewer `:36`, wiki `:47`, producer `:35`, lead `:54`/`:83-90`, adversarial-reviewer `:26`/`:30` | `claude/agents/fkit-*.md` |
| U3 | **A SECOND site inside declared `fkit-team/SKILL.md`** — the shared-skills prose after the role→skill table (movers producer-only; the six Claude-side roles' two extra skills). The header counts the file once | `claude/skills/fkit-team/SKILL.md:61-70` |
| U4 | **A SECOND site inside declared `claude/README.md`** — the per-agent tool-allowlist table, whose `fkit-lead` row asserts *"(owns `/fkit-sprint-ship-loop`)"* | `claude/README.md:103` |
| U5 | **Three further sites inside declared `architecture.md`** beyond its role/skill table — two standalone skill counts plus the §4.2 heading, all reading *"25"* | `ai-agents/knowledge-base/architecture.md:25`, `:68`, `:135` |
| U6 | **Cross-attributions naming ANOTHER role's ownership** — *"the coder's `fkit-process-stateful-review`"* | `claude/skills/fkit-stateful-review/SKILL.md:7`, `:47`, `:132`; `claude/agents/fkit-reviewer.md:41` |

**My count under the definition above: 44 sites across 34 files** (24 banner files + 7 agent files +
`README.md` + `scaffold/CLAUDE.md` + `architecture.md`; `fkit-team/SKILL.md` is one of the 24). **⚠️
Definition-dependent and stated as such** — U6's four sentences sit inside regions already counted, so
a region-based count gives fewer. **Re-derive; do not paste this number in.**

### ⚠️ `claude/agents/fkit-coder.md` is NOT one of the newly-found sites

Report **R9** corrected this explicitly: the coder **keeps** `fkit-process-stateful-review` under every
option, so its sentence stays true. **It IS a site under U2** (it lists the coder's own skills), but it
is **not** evidence of the option-(b) under-count. Do not conflate the two.

### Sites deliberately EXCLUDED, and why — re-check these judgments

- `claude/skills/fkit-task-ship-loop/SKILL.md:78`, `:152`, `:303` and
  `claude/skills/fkit-process-review/SKILL.md:29`, `:93`, `:166` — they name the **skill** but assert
  no **role ownership**.
- `claude/scaffold/ai-agents/knowledge-base/conventions/evidence-before-assertion.md:28` — lists skills
  as examples of procedures that check something; not an ownership claim.
- `claude/fkit-claude.sh` and `claude/skill-ownership-hook.sh` — they **source** `skills_for_role()`
  rather than mirroring it. That is the design, not a defect.
- `.claude/agents/` and `.claude/skills/` — gitignored fkit-managed copies, refreshed by
  `claude/fkit-claude-init.sh`. **Not sites.**

---

> ### ⚠️ CONFLICT WITH AN ACCEPTED ADR — SURFACE THIS BEFORE STARTING
>
> **[ADR-036](../../../knowledge-base/decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md)
> already decided that the skill-ownership site inventory is a DECLARED REGISTRY, not a checklist** —
> and **`0189` is the open task that builds it**, with its completeness tripwire. `0189`'s brief records
> that `0142`'s report enumerated **39 rows across 21 classes over 61 fact-site files, against a
> checklist that names FIVE**.
>
> So there are now **three** counts of this ground — the header's **4**, `0142`'s **61 files**, and my
> **34 files / 44 sites** above — and **they differ because the DEFINITION differs, not because two of
> them are wrong.** Settling the definition is this task's first step, not an afterthought.
>
> **This was an open question. It is now SETTLED — do not re-ask it.** See the ruling immediately below.

---

## ✅ OWNER RULING — SETTLED 2026-08-05. Do not re-open.

| | |
|---|---|
| **Date** | 2026-08-05 |
| **Channel** | `AskUserQuestion`, put to the owner in a live `fkit lead` driver session |
| **Question** | Is repairing the hand checklist worth doing at all, given ADR-036 and `0189`? Options: (a) repair it as interim cover; **(b) narrow it to the site classes plus a pointer at the registry**; (c) drop it and pull `0189` forward |
| **Chosen** | **(b) — NARROW TO SITE CLASSES.** The brief's own recommendation, confirmed by the owner |

**Rationale the owner ruled on, recorded so it is not re-litigated:** a header that enumerates the site
**classes** stays true as files are added, where a **44-line hand list is stale the week it lands** —
which is *the very failure `0226` exists to repair*. A class list also **does not race `0189`'s ADR-036
registry**: it is honest interim cover that the registry can supersede without contradicting it.

⛔ **`0226`'s planner must not re-put this question to the owner.** Options (a) and (c) are closed.

## What to build

**No longer held — the owner ruled option (b), NARROW TO SITE CLASSES** (see the ruling block above).
The shape:

1. **Re-derive and count the site list first**, recording the definition used and the exact commands
   run. Evidence, not assertion — see
   [`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md).
   ⚠️ You still measure; you just do not **paste the measurement into the header** as 44 rows. The count
   is how you prove the class list is complete.
2. **Repair `claude/skills-for-role.sh`'s header block so it declares the site CLASSES, not the
   individual sites.** ⛔ **Do not hand-list 44 sites** — that list is stale the week it lands, which is
   the failure this task repairs. At minimum these classes, each stated as a class with a way to
   enumerate it (a `/usr/bin/grep` that finds its members):
   - **Every skill's own `⛔ Owner:` banner** — `claude/skills/*/SKILL.md` (`fkit-query` has none, by design)
   - **Every agent prompt's own skill list** — `claude/agents/fkit-*.md`, all seven roles
   - **`claude/README.md`'s skill-ownership table** — *and* its per-agent tool-allowlist table, which
     also asserts ownership
   - **`claude/skills/fkit-team/SKILL.md`** — the role→skill roster *and* the shared-skills prose after it
   - **`claude/scaffold/CLAUDE.md`** — ships into every consuming project's root `CLAUDE.md`
   - **`ai-agents/knowledge-base/architecture.md`** — its role/skill table *and* every standalone skill
     **count**, which a role→skill change falsifies
   - **Cross-attributions naming ANOTHER role's ownership**, wherever they sit — e.g. *"the coder's
     `fkit-process-stateful-review`"* inside a reviewer-owned file
3. **Keep the task-70 warning and its "add it HERE FIRST" instruction verbatim.** They are the reason
   this task exists; do not compress them away.
4. **Add a dated note recording that the list was incomplete a second time**, so the next reader sees a
   pattern rather than a one-off — matching the existing *"THIS LIST SAID TWO UNTIL 2026-07-18"* form.
   Do not invent a third shape.
5. **Point at ADR-036 and `0189`** so the header does not present itself as the durable answer.

### Out of scope

- ⛔ **Do not change `skills_for_role()` itself.** No role gains or loses a skill in this task.
- ⛔ **Do not repair the stale sentences the audit finds.** U6's four cross-attributions and any other
  false text are a **separate** repair (`0188` covers five live ownership-fact defects — check it
  first). This task fixes the **checklist**, not the sites.
- ⛔ Do not build the registry or the tripwire — that is `0189`.
- ⛔ No `wiki-vault/` write. No commit.

## Verification steps

1. **The count is evidenced.** The worklog records the definition used, the exact `/usr/bin/grep`
   commands run, and their output — not a restated number. **Any figure inherited from this brief or
   from `0200`'s report without re-measurement fails this step.**
2. Every class in the measured floor above appears in the repaired header, or is **explicitly excluded
   with a stated reason**. Silence about a class is a failure.
3. `/usr/bin/grep -c '⛔ Owner' claude/skills/*/SKILL.md` is re-run and its result matches whatever the
   header claims about banner coverage.
4. The task-70 warning block and the *"If you add a fifth mirror, add it HERE FIRST"* instruction are
   present and unweakened. Diff them to confirm.
5. The header names **ADR-036** and **`0189`** as the durable answer, so a future reader does not treat
   the repaired hand list as the endpoint.
6. `bash -n claude/skills-for-role.sh` parses clean (the change is comment-only, so this must hold), and
   `skills_for_role()` output is **byte-identical** before and after for all eight arguments (the seven
   roles plus an unknown one).
7. `node --test test/` passes — `test/skill-ownership-hook.test.js` sources this file directly, so a
   header edit that breaks sourcing surfaces there.
8. `git diff --stat` shows **one file changed**: `claude/skills-for-role.sh`.

## Notes

- **Depends on:** nothing. ⚠️ **Explicitly NOT dependent on `0222`/ADR-038** — see the independence
  banner above.
- **Blocks:** nothing. **Overlaps `0189`** (the ADR-036 registry) — see the conflict banner; `0189`
  may subsume this task entirely.
- **Owner:** fkit-coder — a comment-block edit under `claude/`.
- **Size: small.** The owner ruled option (b) — a class list is a comment-block edit. (A 44-site hand
  enumeration would have been medium; it is ruled out.)
- **Merit position, for the owner:** above `0225` (this failure has recurred; `0225`'s has not) and
  below `0224`. **Also check `0188` and `0189` before ranking** — all three sit on the same ground.
- ✅ **SETTLED, not open:** whether the hand checklist is worth repairing given ADR-036 and `0189` was
  **ruled by the owner on 2026-08-05 via `AskUserQuestion` in a live driver session — option (b), narrow
  to site classes.** Full record in the ruling block above. **Do not re-ask it.**
- ⚠️ **Filed on the Backlog board because the owner's ruling named no sprint.** A spawned producer has
  no owner channel and never invents a sprint placement. **Flagged for owner confirmation: Sprint 2
  may be the intended home**, alongside `0222`.
