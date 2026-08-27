# Plan — 0168: Remediate the dead brief paths in closed `review.md` ledger headers

> Approved by the owner via `AskUserQuestion` in a live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-26. Written by the driver at approval, before the Build spawn (ADR-020). Rulings on D1–D4 are appended at the end.

### 0. Ruling this executes (read, not re-derived)

`0160` §4.6, owner-ruled 2026-08-01: **(c) folder-ID schema going forward + one-time normalization of the existing dead headers.** Canonical form `Task: NNNN`; a live relative link beside the ID is optional. §4.2.1 + §8.2 (R19, owner-ruled): for the href headers the stale path **label must be replaced, never left standing beside a new ID**; recommended form `Task: 0001 — [brief](./brief.md)`; target `./brief.md` untouched. §4.4.1(d): append-not-rewrite is **rejected for headers**, adopted only for body-level verbatim quotes (out of scope here). `durable-citation-anchors.md` "Link labels" + "Repairing one": *"If the target resolves, replace the label and leave the target alone. If it does not, the pointer is dead and gets the durable form."*

Later rulings that also bind: `0325` (2026-08-26) — self-locator = header-block field, role-not-string; **evidence lines frozen** (`File(s) under review:`, fenced/captured output, dated measurements, findings rows, other tasks' paths, pointers below the header block); freeze calls listed in the report. `0343` item 4: path-token repair is `0325`'s form, **durable form is `0168`'s** — so this task converts form, by ruling.

### 1. Population — measured 2026-08-26 (re-run at build; every count below is dated)

Method: first line beginning `Task:` above the first `## ` heading in every `ai-agents/tasks/done/*/review.md`; classify **form** (href / code span / bare / none) and **named path** (existence test on disk, not string match); for hrefs test the target separately. All 120 headers sit at **line 3**; no ledger has two `Task:` lines; no CRLF.

Reproducible command for the dead set (returns 67 today):
```
for f in ai-agents/tasks/done/*/review.md; do p=$(sed -n '3p' "$f" | grep -o -E 'ai-agents/tasks/[A-Za-z0-9./_-]+\.md' | head -1); [ -n "$p" ] && [ ! -e "$p" ] && echo "$f"; done
```

**Axis 1 — named path:**

| Bucket | Count |
|---|---|
| dead — `backlog/<NNNN>-<slug>/brief.md` (variant 1) | **44** |
| dead — `backlog/<slug>.md` flat (variant 2) | **14** |
| dead — `done/<slug>.md` flat (variant 3) | **9** |
| live — `done/<NNNN>-<slug>/brief.md` | 51 |
| href whose label is `brief.md` (not a location; target resolves) — `0177`, `0254` | 2 |
| no `Task:` header — `0080` | 1 |
| **sum** | **121** ✓ |

**Axis 2 — form:** href **6** (4 dead-label = `0001` `0010` `0022` `0039`, targets `./brief.md`, all resolve; 2 label-`brief.md` = `0177` target `./brief.md`, `0254` target `brief.md`, both resolve) · code span 76 (50 dead / 26 live) · bare 38 (13 dead / 25 live) · none 1. Sum 121 ✓.
**Split: 67 dead = 63 Gap A (non-href) + 4 Gap B (href).** 44 = `0325`'s 2026-08-26 figure (its check saw only variant 1) — consistent.

Dead set, by folder ID: 0001 0003 0008 0010 0017 0020 0022 0023 0036 0039 0048 0049 0052 0054 0055 0070 0072 0074 0075 0079 0082 0086 0087 0101 0102 0103 0122 0123 0124 0125 0126 0132 0133 0136 0141 0142 0143 0147 0148 0150 0151 0153 0157 0158 0159 0160 0161 0162 0167 0171 0174 0190 0191 0195 0198 0200 0202 0218 0241 0246 0248 0252 0253 0256 0259 0268 0306.

All 67 are git-tracked and clean (`git status --porcelain` on the set is empty) — so `numstat` is meaningful (`0313`'s untracked-ledger caveat does not bite). The three dirty/untracked `done/` ledgers (`0203` M, `0204` ??, `0325` ??) are all **live** and outside the set.

Special shapes inside the 67 (the only per-file variation):
- 4 hrefs (Gap B): `` Task: [`<dead flat path>`](./brief.md) ``.
- `0160`: `` Task: 0160 — `<dead path>` `` — ID already present, path dead.
- 4 with trailing prose after the path: `0008` `(Sprint 2, priority 70)`, `0017` ``(task 75, ID `0017`) —``, `0052` `(task 43)`, `0101` ``(ID `0101`)``.
- Every one of the 121 folders has a `brief.md` (checked) — the relative link resolves everywhere.

### 2. Steps

1. **Re-measure** with the classifier (both axes, buckets summing to the folder count); diff against §1; stop if any bucket moved in a way the plan does not cover (a new form, a header not on line 3, a folder without `brief.md`, a dirty file in the set).
2. **Dry run.** A one-off script (Python 3 stdlib or sed, lives in the scratchpad, its text recorded in `worklog.md`) takes the **explicit list** from step 1 as input — not a regex sweep over all ledgers — and rewrites **only line 3** of each listed file by three rules:
   - **R-a (63 non-href):** replace the path token with its wrapping (backticks or none) by `NNNN — [brief](./brief.md)`, `NNNN` = the folder's 4-digit prefix. `Task: \`…/0148-…/brief.md\`` → `Task: 0148 — [brief](./brief.md)`.
   - **R-b (4 hrefs):** replace the whole `` [`<label>`](./brief.md) `` group by `NNNN — [brief](./brief.md)` — label replaced, target byte-identical, link kept (§4.2.1 route ii).
   - **R-c (`0160`):** ID already present → replace only `` `<path>` `` by `[brief](./brief.md)` → `Task: 0160 — [brief](./brief.md)`.
   - **Trailers (4 files):** everything after the path token stays byte-identical: `Task: 0008 — [brief](./brief.md) (Sprint 2, priority 70)`. A trailer's stale rank/old task number is a frozen claim (Case 1 territory, `0159`'s), not this task's.
   - Line count unchanged; nothing else on the line, nothing else in the file.
   Show the full `git diff -U0` of the dry run in the worklog **before** applying.
3. **Apply**, then prove (§4).
4. **Freeze list.** For every file in the set, list the self-hits **not** touched, with reason phrase (per `0325` step-7 shape): `File(s) under review:` self-entries (12 ledgers mention their own folder there today; at least `0151`, `0157`, `0253` name their own `backlog/` path — frozen, role prong), body citations of own/other `backlog/` paths (16 body-level dead paths per `0160` §4.6 — frozen, out of scope), verbatim quotes (`0148/review.md:79`), line 1 `# Review — <slug>` titles on 46 old ledgers (a title, not a locator — untouched).
5. **Record** in `worklog.md`: both tables, the 67-ID list, the script, before/after for one file per variant and per form (incl. one href), the freeze list, the untouched-but-nonconforming residuals (§5), test counts.
6. **No edit** to `claude/skills/*`, movers, board, brief, wiki, `cancelled/`, sprint-keyed ledgers.

### 3. Items 2–5 of the brief — answered

- **Item 2, generator schema line** (`fkit-stateful-review` + `fkit-process-stateful-review`, byte-identical pair) → **D4.** Recommended: **defer to `0326`**, which now owns exactly that write surface by owner ruling 2026-08-23, must argue the form itself, and carries its own open plan/worklog question. Two claimants on the same lines otherwise. The "sweep alone is a treadmill" worry is already answered by `0325`: every future close now repairs the header to a *live* path (not durable, but not dead).
- **Item 3, movers:** **no new duty.** Gap A — `0325`'s self-locator rule now re-points code-span/bare `Task:` paths at close. Gap B — after this sweep no header carries a path label; `0325` leaves relative hrefs byte-identical, so the normalized form is idempotent through every future move. `0342` (backlog) mirrors the rule into `fkit-task-cancelled`. Stated, not edited.
- **Item 4, `cancelled/`:** 11 folders, **0 `review.md`** (re-measured today). Rule covers it; nothing to sweep. Recorded so nobody re-measures.
- **Item 5, `0080`:** → **D3.** Its ledger has no schema header at all (`**Task-id:** \`<slug>\` · **Sprint 2, priority 68**` bold field block, title not `# Review — <id>`).

### 4. Verification (how a reviewer confirms only locators moved)

1. `git diff --numstat -- 'ai-agents/tasks/done/*/review.md'` = **exactly 67 lines, each `1 1`** (`+1 0` for `0080` if D3 = insert). No other path in the numstat for this task (other files in the working tree belong to the driver's parallel work — checked per path, not "clean tree").
2. `git diff -U0` — every hunk header is `@@ -3 +3 @@` (or `@@ -2,0 +3 @@` for `0080`).
3. `git diff -U0 | grep '^[-+]' | grep -v '^[-+][-+]' | grep -v -E '^-Task: |^\+Task: '` → **empty**: every changed line is a `Task:` line.
4. Post-edit classifier: **0 dead**, buckets sum to 121; `grep -c '^Task: [0-9]\{4\} — \[brief\](\./brief\.md)' ai-agents/tasks/done/*/review.md` ≥ 67 and, per file in the set, `NNNN` = folder prefix.
5. Hrefs: all 6 targets resolve before **and** after, byte-identical targets; `0177`/`0254` untouched (absent from numstat).
6. The 51 live headers absent from the diff (D1 = dead-only).
7. Before/after pairs shown: one variant-1 code, one variant-2 bare, one variant-3 code, one href (`0001`), `0160`, one trailer (`0008`).
8. `node --test test/*.test.js` green, count stated (774 at `0325`'s last run; no test reads real ledgers — `dashboard-contract`, `carry-check-hook`, `closed-rank-immutability`, `structure-check` mention `tasks/done` only in fixtures/comments). `prove-red.sh` **not run** — no test file changes; say so.
9. Skill files: `git diff --stat -- claude/` shows nothing from this task.
10. Do not run any context regex over `ai-agents/sprints/done/sprint-2.md` — not needed; no sprint file is read or touched.

### 5. Edge cases / failure modes

- **Prepend-not-replace** (§4.2.1's named failure): a rule that emits `Task: 0001 — [\`dead\`](./brief.md)` passes a naive "has ID" check and fixes nothing. Check 3 + the exact-form grep in check 4 catch it.
- **Unwrapping an href** to a bare path: keeps the dead half, drops the working one. R-b replaces the label group only; check 5 catches it.
- **Global search-and-replace** would touch body evidence (`0148:79` verbatim flag, `File(s) under review:` lines, findings rows). Hence list-driven, line-3-only, hunk check 2.
- **Trailer loss** on `0008` `0017` `0052` `0101` — R-a must be anchored on the path token, not the line end.
- **Driver commits mid-build** (happened during `0325`): numstat against a moved HEAD is still valid only if my edits are not in the commit; if they are, prove with the commit range instead and say so.
- **Untracked ledger enters the set** (a task closed mid-build with an old-form ledger): numstat is blank for it (`0313`); re-measure at step 1 and either add it with `git add -N` proof or exclude it by name.
- **A folder missing `brief.md`** — none today; would make the link dead on write. Step 1 gate.
- **`0326` picks a different schema form later** — corpus of 67 would then differ from new ledgers. Sequencing hazard named by `0326`'s own brief; D2 recommends the form `0160` ruled canonical + recommended, so `0326` deviating is the thing that would need arguing.
- **Sprint-keyed ledgers** `ai-agents/sprints/reviews/sprint2-*.md` carry Gap-B-shaped `Task:` headers (dead flat labels, live `../../tasks/done/…` targets). **Outside this brief's population** — residual, flagged for the producer, not swept.
- **`0175` guard** (owner-ruled LOW, after this task) asserts `ID == folder prefix` for *every* ledger — under D1 = dead-only it is red on the 51 live path-form headers and on `0177`/`0254`, and stays red on every close until `0326` lands. That is a dependency finding for `0175` (needs `0326` too, or must accept path form), not a reason to widen this sweep silently → D1.
- **ADR-034 / "a landed Done belongs to the owner"** (`0201` precondition): writing into 67 `done/` folders is licensed by `0160` §4.6's owner ruling and by the plan gate itself; ADR-034 governs the per-task instance, `0160` §4.5 rules the corpus condition; no re-raise. `0192` (open, architect) asks whether *sibling* ledger re-pointing is evidence rewrite — this plan does not pre-empt it: headers are pointers by the later rulings (`0160`, `0325`), body evidence stays frozen.
- **Board cell** for `0168` still reads *"needs 0160, hard"* (a frozen note; the brief carries the dated discharge from `0306`). Not this task's edit; flag to the closing producer.

### 6. How each caveat / ruling is honored

| Ruling / caveat | Honored by |
|---|---|
| Re-derive counts, positive existence test, both axes, href count even if zero | §1, step 1, check 4 |
| Do not classify by variant alone | axis-2 table; hrefs identified by form inside variant 3 |
| 4 hrefs: text-only, no re-point, no unwrap, **replace** label | R-b, check 5 |
| `Task: 0001` alone also correct (R19) | D2 offers it; link form recommended, not imposed |
| Frozen-ledger rule / evidence freeze (`0325` ⛔) | line-3-only, freeze list, checks 2–3 |
| Append-not-rewrite rejected for headers, kept for quotes | no annotations; body quotes untouched |
| Schema pair byte-identical | untouched here (D4); if D4 = do it here, `diff` of the two fenced blocks is a verification step |
| `cancelled/` covered, recorded as 0 | §3 |
| `0080` not folded in silently | D3 |
| Out of scope: Case 2 `:NNN`, board-rank prose, machine guard | no guard; no `:NNN` written in this plan; trailers' ranks frozen |
| `sprint-2.md` regex warning | nothing touches sprint files |
| Show before/after per variant and per form | check 7 |
| Cite tasks by ID, never rank | throughout |

**Residuals flagged, no decision needed:** 16 body-level dead paths (out of scope, `0160` §4.6); sprint-keyed ledgers' Gap-B headers; `0248 plan.md` / `0218 worklog.md` (`0343`); `0168` board note stale; `0175` dependency on `0326`.

### 7. Owner rulings — `AskUserQuestion`, live `fkit lead` session, 2026-08-26 (verbatim option labels)
- **Plan gate:** "Approve".
- **D1 (population):** "Dead-only, 67 (Recommended)" — normalize only the 67 dead headers; the 51 live path-form headers and the 2 label-only hrefs are untouched.
- **D2 (form):** "`Task: NNNN — [brief](./brief.md)` for all 67 (Recommended)".
- **D3 (`0080`):** "Insert `Task: 0080 — [brief](./brief.md)` (Recommended)" — a new line 3, additive only; population becomes 68 files (67 × `1 1` + `0080` × `1 0`).
- **D4 (generator schema line):** "Defer to 0326 (Recommended)" — no edit to `fkit-stateful-review` / `fkit-process-stateful-review` in this task.
