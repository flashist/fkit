# Implementation plan — task `0340`: backfill the sprint status banner

## ⛔ Corrections that lead — the driver was wrong twice, the brief's title is stale

**1. The `>` spacer does NOT separate two blockquotes — it keeps them as ONE.** The driver inferred
the spacer exists so the banner and the Authority blockquote stay distinct. ⛔ **Backwards.** All
seven archived boards are `> ## …` / `>` / `> **prose**` = **one** blockquote with the banner as its
leading H2. ⭐ **Sprint 8 must match that shape, not split it.**

**2. It is TWO lines, not one.** ADR-047 §8.1, verbatim: *"**`ai-agents/sprints/sprint-8.md`** gains
**one banner line at line 3** plus a `>` spacer, pushing its Authority blockquote down."* ⛔ The driver
called it a "one-line insert" repeatedly.

**3. The brief's TITLE is stale and the folder is deliberately not renamed.** Owner ruling **V3**
(*"Keep — permanent compat rung (Rec)"*) makes `🔒 CLOSED` read as `✅ Done` **forever**, so the seven
archived boards are **not** rewritten. A producer corrected the scope in the brief; the folder stays
named as it is because a rename moves a task folder — the exact link hazard `0381` exists to fix, and
`0381` has not shipped.

**4. "guards 41/41" is not a separate command** — it is `test/reference-integrity.test.js` (20) +
`test/coordination-citation-policy.test.js` (21). Driver-resolved; ⛔ the planner was right to refuse
to claim a figure it could not identify.

## What ADR-047 specifies — verified and quoted

§2 grammar: `> ## <MARKER> <STATUS> — <YYYY-MM-DD>.[ <trailing prose>]`, **strictly line 3**.

§2 recognizer (R4-tightened; date and terminator required):
```
^> ## (🔲 Backlog|🔄 In progress|✅ Done|⛔ Cancelled|🔒 CLOSED) — [0-9]{4}-[0-9]{2}-[0-9]{2}\.( |$)
```

§1: `🔄 In progress` → `> ## 🔄 In progress — <date>.`, lives in `ai-agents/sprints/`, set by
**producer, by hand**. ⭐ Confirmed **`🔲 Backlog`**, not `Planned` (§1.1; owner ruling **V2**
overruled the architect; the identity/status collision is accepted and disambiguated **by position**).

## Step 1 — the only edit

`ai-agents/sprints/sprint-8.md`, insert **before** the current line 3:

```
> ## 🔄 In progress — 2026-09-10.
>
```

Resulting head (probed in a scratch tree):

```
1  # Sprint 8 — Give sprints the lifecycle tasks already have, and prove it by closing this board with a mover
2
3  > ## 🔄 In progress — 2026-09-10.
4  >
5  > **Authority, stated first and in full.** This board exists by an **OWNER RULING given 2026-09-10 via
```

⭐ Byte-for-byte the shape of `sprints/done/sprint-5.md`, `sprint-6.md`, `sprint-7.md`.
⛔ **Nothing else in the file changes.** ⛔ No trailing prose, no `⭐ ACTIVE BOARD` (ruling **Z2**).

## Step 2 — the seven archived boards: NOTHING

`ai-agents/sprints/done/sprint-1.md` … `sprint-7.md` end **byte-identical**. Basis, both recorded:
ADR §8.1 *"⛔ **NO CHANGE.** Owner ruling **V3**"*, and §2 *"Legacy `🔒 CLOSED` … ⭐ **Read FOREVER,
written NEVER**"*.

⛔ `sprints/cancelled/` is **not** created (§8.1; `0341` creates it on first use). ⛔ `backlog.md`
unchanged. ⭐ Scaffold `claude/scaffold/ai-agents/sprints/` holds only two `.gitkeep`s — verified,
nothing to backfill.

## Step 3 — `worklog.md` (new)

1. `select-active` output **verbatim**, before and after, with the identical-output fact stated.
2. Board render output **verbatim** — ⛔ **inside a ``` fence** (see the hazard below).
3. The recognizer-conformance check run **mechanically** (the §2 regex against line 3) — ⭐ **this is
   the inspection proof that replaces the deferred machine-read proof.**
4. An explicit line: *"success criterion (a) is NOT reported as met; the status rung that would
   demonstrate it ships with `0338`."*
5. The rewritten verification steps (below) — ⭐ **here only**, per ruling **Z3**.

## Rewritten verification steps — the brief's four are stale; these replace them

| # | Check | Expected — measured on a scratch copy |
|---|---|---|
| 1 | §2 recognizer regex vs. new line 3 | **MATCH** ✅ |
| 2 | `dashboard.sh select-active ai-agents/sprints` | `active file="sprint-8.md" identity="Sprint 8"`, candidates `backlog.md` + `sprint-8.md`, exit 0 — ⭐ **byte-identical to before** ✅ |
| 3 | `dashboard.sh ai-agents/sprints/sprint-8.md` | **byte-identical to before** ✅ |
| 4 | `dashboard.sh identity ai-agents/sprints/sprint-8.md` | `Sprint 8` ✅ |
| 5 | byte-level `diff` against a pre-edit snapshot (⚠️ **CORRECTED 2026-09-11, owner-ruled** — this step originally read `git diff --stat`, which **cannot see `sprint-8.md` because it is UNTRACKED**: a literal reading returns empty and reads as "no change", a false green. The `sprints/done/` half below was always correct.) | exactly one file, `+2 −0`; `git diff -- ai-agents/sprints/done/` **empty** |
| 6 | `npm run test:unit` | 877/877 baseline |
| 7 | Head-shape parity vs. `sprints/done/sprint-5..7.md` | same three-line pattern |

⛔ **Step 2 is a NO-REGRESSION proof, not a status proof.** It is identical **precisely because the
reader has no status rung yet.** ⭐ State it that way in the worklog; do not dress it up.

## ⛔ The hazard the brief does not mention

Board-render output is ~22 lines / ~15.5 KB containing **12 distinct relative `.md` links written
relative to `ai-agents/sprints/`** (`](../tasks/backlog/0338-…/brief.md)`,
`](../knowledge-base/decisions/adr-021-…md)`, `](../../claude/skills/fkit-task-done/SKILL.md)`, …).
⛔ **Pasted raw into `ai-agents/tasks/backlog/0340-…/worklog.md` — which `reference-integrity` DOES
scan — every one resolves wrong and the guard reds.**

⭐ **Mitigation: wrap the paste in a ``` fence.** `maskFencesAndQuotes` blanks fenced blocks, and the
citation guard masks fences too. ⭐ Verified: the render output contains **zero** ``` and **zero**
`~~~` runs, so the fence cannot be broken from inside. Coordinate-shaped `path:NNN` hits in the render
output: **0**.

## Positional-reader sweep — all checked, all clear

| Reader | Why a line-3 insertion is safe |
|---|---|
| `dashboard.sh` identity | `head -1` only (`:85`) — line 1 untouched |
| `dashboard.sh` `field_value` / section scan | `$0 == "## <field>"` and `/^## /`, **anchored at column 1**; the banner starts `> ` |
| `STATUS_HEADING_RE` | `^## Status`-anchored; non-collision re-confirmed |
| `test/closed-rank-immutability.test.js` | keys on task-id rows + Priority cells across revs; prepending two non-row lines changes no row |
| `test/coordination-citation-policy.test.js` | scans live `ai-agents/sprints/*.md` for `path:NNN`; **blockquotes masked**, and the banner carries no coordinate |
| `test/reference-integrity.test.js` | link scan; the banner carries no link |
| any test pinning `sprint-8` | **zero hits** across `test/` and `claude/` |
| empirical | render + `select-active` diff clean |

## ⛔ What CANNOT be proven today

Eligibility is **identity-only** (`claude/skills/fkit-status/dashboard.sh:173`, `is_eligible`). Live
`select-active` already returns `active file="sprint-8.md"` under `v1`. ⛔ **Success criterion (a) —
Sprint 8 chosen BECAUSE its status reads `In progress` — is unobservable until `0338` ships.**
⭐ The producer's deferred-proof instruction on the brief stands: ⛔ **do NOT report criterion (a) as met.**

## `0338`'s eight S-scenarios

⛔ **Not touched.** Their fixtures use `prosePlan()` in `test/dashboard-contract.test.js`; this task
writes no test and no fixture. **No overlap.**

## Not in scope, explicitly

README / scaffold README cancelled-folder sentence (**`0339`** claims it explicitly; verified both
ends) · `conventions/sprint-status-vocabulary.md` (ADR §1: *"⛔ **This ADR names it and does not create
it**"*) · `sprints/cancelled/` (`0341`) · any `dashboard.sh` change (`0338`) · the `P3` row's closure
(producer, ADR-033) · the brief's title and folder name (frozen pending `0381`).

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-11

Given live via `AskUserQuestion`. Option labels **verbatim**. These bind the Build and Process-review workers.

| # | Question | Owner ruling | What it settles |
|---|---|---|---|
| **Z0** | Approve this plan? | Approved via Z1–Z3 | ⛔ Every step above stands as written except where narrowed below. |
| **Z1** | What date goes in the banner? | **"2026-09-10 — when it opened (Rec)"** | ⭐ **`2026-09-10`** — the day Sprint 8 opened by owner ruling and entered `In progress`. ⭐ Basis: all seven archived banners carry the date of the **state transition**, not of the typing. ⛔ **Not `2026-09-11`.** ⚠️ The value is permanent. |
| **Z2** | Does the banner carry `⭐ ACTIVE BOARD`? | **"No — bare banner (Rec)"** | ⛔ **No marker. Bare banner.** ⭐ §6 makes the marker an **override** of lowest-ordered selection, and Sprint 8 is the only eligible board — it would override nothing. ⚠️ **And the cost that decided it: when Sprint 8 goes `✅ Done`, a leftover marker fires `drift active-marker-on-non-active` (test P15), and the movers (`0341`) have NO step to strip it.** |
| **Z3** | Where do the rewritten verification steps go? | **"worklog.md only (Rec)"** | ⭐ **`worklog.md` only. ⛔ `brief.md` is NOT edited** — it is a producer artifact and both its existing corrections were written by spawned producers. ⚠️ **Accepted cost, named: the brief keeps four stale steps at its top, and a future reader meets them before the worklog.** |
