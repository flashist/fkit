# Plan — `0347` Note ADR-044's oracle rule onto `0224` and `0225`

**Task:** `ai-agents/tasks/done/0347-note-adr-044s-oracle-rule-onto-0224-and-0225/brief.md`
**Planned:** 2026-08-29, by `@fkit-coder` as the Plan worker of `/fkit-sprint-ship-loop`.
**Scope:** brief edits only — two append-only notes. ⛔ No source, no board row, no folder move, no vault write, no commit.

---

## 0. Two corrections to the figures I was handed — read these first

**(a) ⛔ The C6 figure has MOVED. It is `9 of 14` today, not `8 of 13`.** Re-measured by me on 2026-08-29 (method below). ADR-044 §C6's `8 of 13` was correct on 2026-08-28 and is now stale — one new producer-owned row, `0360`, was filed and it carries three producer-exclusive skill tokens, so **both** numerator and denominator moved by one.

**(b) ⛔ The failing test I was warned about does NOT reproduce. The suite is green.** I ran `test/closed-rank-immutability.test.js` directly: **34 tests, 34 pass, 0 fail** — including `live leg 2: HEAD vs HEAD^`, the named failure. I also ran the full `npm test` (`node --test test/*.test.js && bash test/prove-red.sh`): **exit 0**, hard gate `PASSED`. This is consistent with the briefing's own prediction that it "clears on the owner's next commit" — `c45ec3d Ship push` is HEAD. **So `792 tests, 791 pass, 1 fail` is stale; nothing is failing and there is nothing to work around.**

*(Honest limit on (b): the backgrounded `npm test` capture retained only its tail, so I have `exit 0` and the mutation gate's `PASSED` line but not the aggregate `pass/fail` counts. Exit 0 through an `&&` chain is sufficient proof that `node --test` had zero failures. The Build worker should re-run and name the counts.)*

---

## 1. What I measured, and how

### 1.1 The C6 re-measurement (the number both notes must carry)

**Method — ADR-044 §C6's own, re-run verbatim.** Population = every brief under `ai-agents/tasks/backlog/` whose `## Status` field is `🔲 Backlog` (status-based, exactly as §C6 states: *"the 123 `🔲 Backlog` rows, each row's own brief read for `## Owner`"*). `## Owner` read with an anchored match on `^## Owner$` — deliberately, because §C6's own *"Unverified this pass"* section records that an unanchored `grep -A1 '^## Owner'` mis-reads `0184`'s second `## Owner rulings on record` heading. Then every `/fkit-[a-z0-9-]+` token in each producer-owned brief, checked against `skills_for_role()` in `claude/skills-for-role.sh`.

| | ADR-044 §C6, 2026-08-28 | **Re-measured 2026-08-29** |
|---|---|---|
| `🔲 Backlog` briefs (population) | 123 | **138** |
| of which `## Owner: fkit-producer` | 13 | **14** |
| …carrying ≥1 real `/fkit-*` skill token | 9 | **10** |
| …⛔ carrying ≥1 **producer-exclusive** skill token | **8** | **⛔ 9** |

**The 14 producer-owned rows:** `0013`, `0149`, `0183`, `0184`, `0187`, `0193`, `0221`, `0262`, `0318`, `0320`, `0321`, `0335`, `0340`, **`0360`** — the ADR's exact 13 plus the new `0360`.

**Producer-exclusive skills, derived from `skills_for_role()` 2026-08-29** (in `producer`'s list and no other role's): `fkit-heal`, `fkit-initiate-project`, `fkit-status`, `fkit-task-brief`, `fkit-task-cancelled`, `fkit-task-done`.

**The 9 rows a grep oracle would misroute:** `0184`, `0187`, `0262`, `0318`, `0320`, `0321`, `0335`, `0340`, **`0360`**. Only `0221` carries a real skill token that is *not* producer-exclusive (the lead-owned `/fkit-sprint-ship-loop`). `0013` names the **agent** `/fkit-coder`, not a skill; `0149`, `0183`, `0193` name no `/fkit-*` token at all.

**⚠️ One limb I inherited rather than re-verified.** ADR-044's claim *"none of the N names a **producing** skill, so Decision 1 staffs all N with `@fkit-coder`"* requires reading each brief's deliverable. I re-verified this **only for the new row `0360`**: its `## What to build` is *"Run `npm run release:minor`"* plus a **hand**-archive, and the two sprint-mover tokens it names — `/fkit-sprint-done`, `/fkit-sprint-cancelled` — **do not exist in `skills_for_role()`** (`0341` would build them and is explicitly held out of `0360`'s scope). So `0360` names no producing skill and the "all N → coder" claim still holds at 14. For the other 13 I am relying on ADR-044's 2026-08-28 per-brief read. **This is stated in the plan rather than papered over.**

**⚠️ A methodological note worth keeping visible.** `0360`'s `## Sprint` is `Sprint 7`, not `Backlog` — it is in the population because its `## Status` is `🔲 Backlog`, and §C6's stated population is status-based. `0347` itself is *excluded* for the same reason (its status is `🔄 In progress`). If a future re-measurement uses `ai-agents/sprints/backlog.md`'s rows instead of task status, it will get a different denominator. The notes will name the method, not just the number.

### 1.2 Everything else I verified this pass

- **`0224` and `0225` are untouched and still `🔲 Backlog`.** `git status --porcelain` on both folders: **empty**. Both read `## Sprint: Backlog`, `## Priority: Unscheduled`, `## Status: 🔲 Backlog`. ✅ **The ordering window this task exists to close is still open.**
- **`0224`'s `## Owner` is `fkit-architect`; `0225`'s is `fkit-coder`.** (Neither is `fkit-producer` — the brief never claimed they were, but worth pinning since the note discusses `## Owner`.)
- **`## Notes` is the last section of both briefs** — `0224:229`, `0225:112`; file lengths 284 and 138 lines. **So a pure EOF append is structurally inside `## Notes`**, which is what makes verification step 2 (`−0` outside `## Notes`) provable rather than eyeballed.
- **`grep -c "Depends on"` baseline: `0224` = 3, `0225` = 3.**
- **`0345` exists** — `ai-agents/tasks/backlog/0345-carry-adr-044s-build-and-plan-role-rule-into-the-ship-loop-and-agent-text/`, `## Status: 🔲 Backlog`, `## Sprint: Backlog`, `## Priority: Unscheduled`.
- **⭐ The rule-cell genuinely does not exist yet.** `claude/skills/fkit-sprint-ship-loop/SKILL.md:122-123` — the **Plan** and **Build** cells still read the literal `` `@fkit-coder` ``. Only the **Process review** cell (`:126`) is a reasoned rule today. So `0225`'s note must warn against parsing text that is not there.
- **Test baseline:** `node --test test/task-id-uniqueness.test.js test/dashboard-contract.test.js` → **185 tests, 185 pass, 0 fail** (17.8s). Full `npm test` → **exit 0**.

---

## 2. Files to change — exactly two

| File | Edit |
|---|---|
| `ai-agents/tasks/backlog/0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md` | **Append** the note in §3.1 at EOF (inside `## Notes`). No other line touched. |
| `ai-agents/tasks/backlog/0225-add-the-loop-table-row-to-skill-ownership-test/brief.md` | **Append** the note in §3.2 at EOF (inside `## Notes`). No other line touched. |

Plus this task's own folder (`plan.md` written by the driver at approval; `worklog.md` by the Build worker).

⛔ **Not touched:** `claude/`, `test/`, `ai-agents/sprints/*`, ADR-038, ADR-044, `ai-agents/wiki-vault/`, either brief's `## ID` / `## Sprint` / `## Priority` / `## Status` / `## Owner`, either brief's `## Context` / `## What to build` / `## Verification steps`, and both task folders' locations.

---

## 3. The exact text to append

### 3.1 `0224` — append verbatim at EOF

```markdown

### ⭐ 2026-08-29 — ADR-044 CHANGES THIS DETECTOR'S **ORACLE**. The mechanism is unchanged.

**Source:** [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
§C3, §C6, §Decision 1 — `Status: accepted` 2026-08-27, the deliverable of
[`0270`](../../done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/brief.md).
Filed as follow-on (iii) of §C2 on **owner ruling ND6**, verbatim: *"File all three after the ADR is
accepted (Recommended)"*. Written by
[`0347`](../0347-note-adr-044s-oracle-rule-onto-0224-and-0225/brief.md).

⛔ **THE MECHANISM IS UNCHANGED — DO NOT RE-SCOPE THIS TASK.** The pair stands exactly as written
above: half (i) the git-tracked, append-only denial log, half (ii) the mandatory worklog `**Role:**`
line, **both in one change surface** (verification step 8). This note touches neither open question
(the denial-log path/filename, and who is obliged to read the log), neither residual (**R14** presence-
not-misattribution, **R18** ADR-022 leaves the worker tool-unrestricted), nor the `## Owner` field.

**What changes is the ORACLE — what half (ii)'s `**Role:**` line is checked AGAINST.**

- ⛔ **Old oracle (now wrong for Build):** the **literal role cell** in `/fkit-sprint-ship-loop`'s
  step-2 table.
- ⭐ **New oracle — ADR-044 §Decision 1, verbatim:** *"The Build row's role is the owner, in
  `skills_for_role()`, of the skill the deliverable is produced by."* And for a skill-less deliverable:
  *"A deliverable that names no skill — source, tests, scaffold, prose under `claude/`,
  coordination-doc repairs — is the coder's, as sole source-write authority, **whatever `## Owner`
  says**."* ⚠️ **That last clause is deliberate:** a `## Owner` differing from the Build role is the
  rule working, not a defect — so the detector must never derive the expected role from `## Owner`.
  (ADR-044 **§Decision 4** gives `## Owner` its own separate live job — the step-1 vault-row skip
  predicate. Two fields, two questions.)
- ⚠️ **Scope of the change, per ADR-044 §C4:** it moves **Build**. **Verify stays table-fixed**, and
  ADR-038 is *"not amended and not superseded"*. Do not widen this note past Build.
- ⚠️ **Consequence of NOT carrying this note, in ADR-044 §C3's own words:** *"Without this note the
  detector flags **every lawful non-coder Build as a misroute**."*

⛔ **THE ANTI-PATTERN THIS DETECTOR MUST NOT IMPLEMENT: grepping the brief for `/fkit-*` skill names.**
ADR-044 §C6, verbatim: *"A future oracle (`0224`, `0225` — C3) **must read the deliverable's producing
skill, never grep the brief for skill names.**"* This is measured, not stylistic — a grep oracle
**reproduces at scale the exact misroute ADR-044 removes**:

- **ADR-044 §C6, measured 2026-08-28:** a grep-for-skill-names oracle would route **8 of the 13**
  `## Owner: fkit-producer` rows back to the producer — *"reproducing precisely the `## Owner` staffing
  Decision 1 replaces."*
- ⭐ **RE-MEASURED 2026-08-29 by `0347` — the figure has MOVED: it is now 9 of 14.** The row `0360`
  was filed since; it is producer-owned and names `/fkit-status`, `/fkit-task-done` and
  `/fkit-task-cancelled`, so numerator and denominator each grew by one. **The shape of the failure is
  unchanged and slightly worse: ~64% of producer-owned rows misrouted.**
- **Method, so a later reader can re-run it rather than trust it** (`conventions/evidence-before-assertion.md`):
  population = briefs under `ai-agents/tasks/backlog/` whose **`## Status` is `🔲 Backlog`** — **138**
  on 2026-08-29 (123 on 2026-08-28); `## Owner` read with an **anchored** `^## Owner$` match (an
  unanchored one mis-reads `0184`'s second `## Owner rulings on record` heading — ADR-044 §"Unverified
  this pass"); then every `/fkit-[a-z0-9-]+` token per brief checked against `skills_for_role()` in
  `claude/skills-for-role.sh`.
- **The 14 producer-owned rows, 2026-08-29:** `0013`, `0149`, `0183`, `0184`, `0187`, `0193`, `0221`,
  `0262`, `0318`, `0320`, `0321`, `0335`, `0340`, `0360`. **Ten carry a real `/fkit-*` skill token**;
  ⛔ **nine of those ten name a producer-*exclusive* skill** — `/fkit-status`, `/fkit-task-brief`,
  `/fkit-task-done`, `/fkit-task-cancelled` or `/fkit-heal` (`0184`, `0187`, `0262`, `0318`, `0320`,
  `0321`, `0335`, `0340`, `0360`). Only `0221` does not, naming the lead-owned
  `/fkit-sprint-ship-loop`. `0013` names the **agent** `/fkit-coder`, not a skill; `0149`, `0183`,
  `0193` name none.
- ⚠️ **A mention is not an invocation.** ADR-044 §C6 checked all five `/fkit-record-decision` /
  `/fkit-task-brief` citations in that set and found *"every one is a reference, not an invocation"* —
  most of them citing a skill's prose as an **authority for form**. That is precisely why grep cannot
  serve: it cannot tell a citation from a call.
- ⛔ **This number is live and will move again.** Re-measure it before relying on it; do not copy it
  forward unchecked. **Partial verification, stated:** `0347` re-verified the *"names no producing
  skill"* limb only for the new row `0360` (it runs `npm run release:minor` plus a **hand**-archive;
  the `/fkit-sprint-done` and `/fkit-sprint-cancelled` tokens it names **do not exist** in
  `skills_for_role()` — `0341` would build them and is out of `0360`'s scope). The other 13 are
  inherited from ADR-044's 2026-08-28 per-brief read, **not re-verified on 2026-08-29**.

⭐ **What this means concretely for half (ii)'s implementation.** The detector compares the recorded
`**Role:**` against the role that **ADR-044 §Decision 1's rule** yields for that row's deliverable —
producing skill → its owner in `skills_for_role()`; no producing skill → `fkit-coder`. ⛔ Not against
the step table's literal cell, ⛔ not against `## Owner`, and ⛔ **never** against a grep of the brief.

⚠️ **R14 is unchanged and is NOT relaxed by this note.** Half (ii) remains a **presence** test:
nothing compares the recorded role to the row's role, so a worker writing the *wrong* `**Role:**`
value still passes. ⛔ Do not read "the oracle is now ADR-044's rule" as a claim that half (ii)
compares anything — that would ship the false guarantee R14 exists to prevent. The oracle stated here
is what a comparison **must use if and when one is built**.
```

### 3.2 `0225` — append verbatim at EOF

```markdown

### ⭐ 2026-08-29 — ADR-044: THE PARSER MUST ACCEPT A **RULE-CELL** IN Plan/Build. The assertion gets STRONGER.

**Source:** [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
§C3, §C6, §Decision 1 — `Status: accepted` 2026-08-27, the deliverable of
[`0270`](../../done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/brief.md).
Filed as follow-on (iii) of §C2 on **owner ruling ND6**, verbatim: *"File all three after the ADR is
accepted (Recommended)"*. Written by
[`0347`](../0347-note-adr-044s-oracle-rule-onto-0224-and-0225/brief.md).

**A design-note widening, not a re-scope.** Scope, out-of-scope, and the honesty clause above all
stand unchanged.

⭐ **What widens.** ADR-044 §C3, verbatim: *"its parser must accept a **rule-cell** in Plan/Build (a
skill→owner expression, not a literal)"*. Today every `Role named` cell the parser meets is a literal
`@fkit-<role>` token. After ADR-044 lands in the loop text, the **Plan** and **Build** cells become a
**rule** — *"the owner, in `skills_for_role()`, of the skill the deliverable is produced by"*
(§Decision 1) — in the same shape `0223` gave the Process-review cell.

⭐ **THE ASSERTION BECOMES STRONGER, NOT WEAKER. A reader who takes "accept a rule-cell" as a loosening
has read it backwards.** ADR-044 §C3, verbatim: *"its assertion becomes **stronger**: every named Build
skill's owner must own it in `skills_for_role()`."* The parser stops asserting *"this literal role owns
this literal skill"* on a handful of rows and starts asserting the **ownership invariant across every
skill a rule-cell names**. ⛔ A parser that merely tolerates a rule-cell — matching zero rows on it and
passing — has implemented the opposite of this note. The existing rule stands and covers it: the parser
**must fail loudly if it matches zero rows**.

⚠️ **THE RULE-CELL DOES NOT EXIST YET —
[`0345`](../../backlog/0345-carry-adr-044s-build-and-plan-role-rule-into-the-ship-loop-and-agent-text/brief.md)
WRITES IT.** Verified on disk 2026-08-29: `claude/skills/fkit-sprint-ship-loop/SKILL.md:122-123` — the
**Plan** and **Build** cells still read the literal `` `@fkit-coder` ``; only the Process-review cell
(`:126`) is a reasoned rule today. `0345` is `🔲 Backlog` / `Unscheduled`. ⛔ **Do not write a parser
against text that is not in the file** — either build against the literals today and widen when `0345`
lands, or sequence this task after it. **This is an ordering note, not a hard block** (the same shape as
the `0223` ordering note above): whichever lands second re-verifies its coordinates.

⚠️ **Two things `0345` will make stale in `## Verification steps` above — flagged here, NOT edited
there.** Once the Build cell names skills: (a) step 4's *"the test reports **4** row assertions"* is no
longer the right count; (b) step 4's *"Build and Verify are skipped"* stops being true of **Build**
(Verify stays table-fixed and stays skipped — ADR-044 §Decision 3 and §C4 scope the change to Build
alone). ⛔ The implementer must reconcile both against the file as it actually reads, and say so in the
worklog rather than asserting the stale numbers.

⛔ **THE ANTI-PATTERN THIS PARSER MUST NOT IMPLEMENT: grepping a brief for `/fkit-*` skill names.**
ADR-044 §C6, verbatim: *"A future oracle (`0224`, `0225` — C3) **must read the deliverable's producing
skill, never grep the brief for skill names.**"* Measured, not stylistic:

- **ADR-044 §C6, measured 2026-08-28:** a grep-for-skill-names oracle would route **8 of the 13**
  `## Owner: fkit-producer` Backlog rows back to the producer — *"reproducing precisely the `## Owner`
  staffing Decision 1 replaces."*
- ⭐ **RE-MEASURED 2026-08-29 by `0347` — the figure has MOVED: it is now 9 of 14**, the new row `0360`
  adding one to each side. **~64% of producer-owned rows misrouted.**
- **Method** (`conventions/evidence-before-assertion.md`): population = briefs under
  `ai-agents/tasks/backlog/` whose **`## Status` is `🔲 Backlog`** — **138** on 2026-08-29 (123 on
  2026-08-28); `## Owner` matched **anchored** on `^## Owner$`; every `/fkit-[a-z0-9-]+` token per brief
  checked against `skills_for_role()` in `claude/skills-for-role.sh`. **Ten of the fourteen carry a real
  skill token; nine of those ten name a producer-*exclusive* skill** (`/fkit-status`,
  `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal`) — `0184`, `0187`,
  `0262`, `0318`, `0320`, `0321`, `0335`, `0340`, `0360`; only `0221` does not. ⛔ **Live figure —
  re-measure, do not copy forward.** Full measurement and its stated partial-verification limit:
  ADR-044 §C6 and `0224`'s companion note of the same date.
- ⚠️ **Why grep cannot work at all here:** ADR-044 §C6 checked every one of those citations and found
  *"a mention is not a producing skill … every one is a reference, not an invocation"*. The token in a
  brief is usually a citation of a skill's **prose as an authority for form**, not a call. **The
  producing skill is a property of the deliverable, not of the brief's word choice.**

⚠️ **This does not weaken the honesty clause above.** The test still catches a future edit orphaning a
row from `skills_for_role()`; it still catches **no** driver departure. Detection of a departure remains
[`0224`](../../backlog/0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md)'s job.
```

---

## 4. Two judgement calls I made — named so they can be overruled

**(a) Both figures are carried, deliberately.** The brief pulls two ways: verification **step 5** demands *"the **8 of 13** figure … the number must be present, not paraphrased away"*, while `## Notes` demands *"If it has moved, write the new number and say when it was measured."* Since it **has** moved, I satisfy both literally: `8 of 13` appears as the **dated ADR-044 §C6 citation**, and `9 of 14` as the **re-measured live figure**, each with its date and method. ⛔ Dropping either would fail one clause of the brief.

**(b) `0345` is named as an *ordering note*, not a canonical `Depends on:` bullet.** Two reasons: (i) it is genuinely ordering, not blocking — `0225` can be built today against the literal cells; (ii) `0225`'s `## Notes` already carries a canonical `- **Depends on:**` bullet plus a dated correction reading *"Current dependency: `Depends on: nothing`"*, and adding a **second** such bullet risks `dashboard.sh` deriving the wrong **Next step** for the row — the exact failure `conventions/dependency-declaration-form.md` exists to prevent. **Neither note contains the literal string `Depends on`**, so `grep -c "Depends on"` stays at **3** on each brief and verification step 9's baseline is preserved. It mirrors the brief's own existing *"⚠️ **Ordering note, not a hard dependency:**"* bullet for `0223`. **Overrule this if you want a hard dependency declared.**

---

## 5. Sequencing

1. Re-run the C6 measurement (script in §7) and confirm `9 of 14` still holds at Build time. **If it has moved again, update both notes' numbers and dates before writing them** — do not paste this plan's figure blind.
2. Append §3.1 to `0224`'s brief at EOF.
3. Append §3.2 to `0225`'s brief at EOF.
4. Run verification (§6).
5. Write `worklog.md` in `0347`'s folder — including the re-measured figures, the method, and the two judgement calls above.

---

## 6. Verification — mapped to the brief's ten steps

| # | Brief's step | How it is proved |
|---|---|---|
| 1 | exactly two existing files + this task's folder | `git diff --numstat` — expect two `brief.md` rows and nothing else outside `ai-agents/tasks/backlog/0347-*/` |
| 2 | `−0` outside `## Notes` | `git diff -U0 -- <both briefs> \| grep -c '^-[^-]'` → **`0`**. A pure EOF append removes nothing, and `## Notes` is the last section of both. **Prove it with the grep, don't eyeball it.** |
| 3 | five fields byte-identical to HEAD | For each brief: `git show HEAD:<path> \| awk '$0 ~ /^## (ID\|Sprint\|Priority\|Status\|Owner)$/{h=$0;getline;print h": "$0}'` vs the same over the working tree — **diff must be empty** |
| 4 | `0224` note: `skills_for_role()`, ADR-044, producing-skill-not-literal-cell | `grep -c 'skills_for_role()' ` and `grep -c 'ADR-044'` > 0; `grep -n "producing skill"` and `grep -n "not the table's literal cell\|literal role cell"` |
| 5 | `0224` note carries **8 of 13** | `grep -c '8 of the 13' <0224 brief>` → ≥1. **Also assert `grep -c '9 of 14'` → ≥1** (the live figure) |
| 6 | `0225` note: rule-cell + **stronger** + strengthened form | `grep -n 'rule-cell'`, `grep -n 'STRONGER\|stronger'`, `grep -n "every named Build skill's owner must own it in"` |
| 7 | `0225` note names `0345` | `grep -c '0345' <0225 brief>` → ≥1 |
| 8 | both notes dated | `grep -c '2026-08-29'` → ≥1 in each note |
| 9 | canonical dependency form intact | `grep -c "Depends on"` → **`3` on each**, unchanged from the HEAD baseline I measured |
| 10 | `npm test` green; name the counts for the two files | `node --test test/task-id-uniqueness.test.js test/dashboard-contract.test.js` — **baseline 185/185/0**, must stay 185/185/0. Then full `npm test` (`node --test test/*.test.js && bash test/prove-red.sh`) — **must exit 0**, and **name the aggregate counts** (I could not: my backgrounded capture kept only the tail). |

**Extra check not in the brief, worth running:** `bash claude/dashboard.sh` (or whatever the `/fkit-status` renderer entry point is) over the Backlog board and confirm the `0224` / `0225` rows still render `ready` — proving the appended notes introduced no `depends-unparseable` drift.

---

## 7. Re-measurement script (run in **bash**, not zsh)

⚠️ **zsh does not word-split unquoted expansions**, which silently corrupted my first run of this — every row came back "producer-exclusive". Run it under `bash -c`.

```bash
bash -c '
cd /Users/mark.dolbyrev/Workspace/fkit
. claude/skills-for-role.sh
PROD=$(skills_for_role producer | tr " " "\n" | grep -v "^$" | sort -u)
OTHER=$(for r in lead coder architect reviewer adversarial-reviewer wiki; do skills_for_role $r; done \
        | tr " " "\n" | grep -v "^$" | sort -u)
PEX=$(comm -23 <(echo "$PROD") <(echo "$OTHER"))
rows=(); for f in ai-agents/tasks/backlog/*/brief.md; do
  st=$(awk "\$0==\"## Status\"{getline; while(\$0 ~ /^[[:space:]]*\$/) getline; print; exit}" "$f")
  ow=$(awk "\$0==\"## Owner\"{getline;  while(\$0 ~ /^[[:space:]]*\$/) getline; print; exit}" "$f")
  [ "$st" = "🔲 Backlog" ] && [ "$ow" = "fkit-producer" ] && rows+=("$f")
done
n=0; for f in "${rows[@]}"; do
  hit=""; while read -r t; do [ -n "$t" ] && grep -qxF "$t" <<< "$PEX" && hit=1; done \
    < <(grep -oE "/fkit-[a-z0-9-]+" "$f" | sed "s|^/||" | sort -u)
  [ -n "$hit" ] && { n=$((n+1)); echo "MISROUTED: $(basename $(dirname $f))"; }
done
echo "=> $n of ${#rows[@]}"
'
```

---

## 8. Risks and edge cases

1. **⚠️ The figure moves again between plan and build.** It moved once in 24 hours. Step 1 of the sequencing re-runs it; the notes name the method so a later reader can re-derive rather than trust.
2. **⚠️ Emoji and the `## Status` match.** `🔲 Backlog` is matched as a literal string. A brief using a different whitespace or a variation selector would fall out of the population silently. The script's total (138) is printed so a sudden drop is visible.
3. **`0224` is a contended file** — its `## What to build` warns that `0203`, `0208`, `0223` also edit `claude/skills/fkit-sprint-ship-loop/SKILL.md`. **This task edits no skill file at all**, so that contention does not apply here. Noted so nobody re-raises it.
4. **`0225`'s note is long relative to a small brief** (138 lines → ~+60). Justified: every clause is either required by `0347`'s `## What to build` or is a measured correction. **Nothing is padding.**
5. **`0224`'s note explicitly refuses to relax R14.** The strongest failure mode of this note is that a future implementer reads "the oracle is now ADR-044's rule" as a claim that half (ii) *compares* roles — it does not; it is a presence test. The note says so in its own last paragraph.
6. **⚠️ I did not run the `/fkit-query` wiki lookup.** The task is a brief-text edit whose entire authority is ADR-044, `0347`'s brief, and two live measurements, all of which I read at source. **Stated rather than skipped silently** — if the owner wants a vault cross-check before approval, say so and it is one spawn.
7. **Nothing here is committed.** ⛔ The commit and push remain the owner's.

---

## 9. Open questions

**None.** Both judgement calls in §4 are resolved in a way that satisfies every clause of the brief literally; they are named so the owner can overrule either at the approval gate rather than because they need a decision to proceed.
