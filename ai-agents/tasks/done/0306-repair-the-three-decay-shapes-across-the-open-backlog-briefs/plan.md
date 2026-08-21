# Implementation plan — `0306` Repair the three decay shapes across the open backlog briefs

**Planned:** 2026-08-15 · **Measured at HEAD:** `9360177` · **Brief's figures measured at:** `4424b44`
**Planner:** fkit-coder (Plan step of `/fkit-sprint-ship-loop`, Sprint 6 P1) · **No files written by this step.**

---

## 0. Headline — read this before the steps

**Step 1 (re-measure) has already been run, in this planning step, and it changed the shape of the task.** Every figure below is derived from disk at `9360177`; nothing is copied from the brief. Four results matter more than the rest:

1. **⭐ Shape 2 is roughly twice the size the brief records.** The brief classifies **4** numerals as mis-resolving (`27`, `28`, `36`, `43`) and leaves **5** unclassified. Disk evidence resolves **8** as mis-resolving — the five "unclassified" ones (`23`, `26`, `46`, `47/48`, `80`) are **not** benign. A mechanical resolution rule was found and is stated in §3.
2. **⛔⛔ One of the brief's two explicit "do not repair" counter-examples is contradicted by the evidence.** The brief says `task 70` resolves **correctly** to `0070-relax-tool-allowlists-except-adversarial-reviewer`. The resolution rule and the surrounding prose both point at `0008-add-open-questions-interview-skill-for-six-roles` instead. **This plan does not settle it — it is Open Question 1.**
3. **⛔ Shape 1's stated premise is false at live HEAD.** The brief says *"No `sprints/sprint-N.md` path resolves any more, for any N."* **`ai-agents/sprints/sprint-6.md` exists** — it is the active board. 2 of the 31 matches point at it and are **correct**, not dead.
4. **⛔ Three of the brief's own verification commands cannot pass as written**, and one of its five Shape-3 targets is **already repaired** at HEAD. Detail in §6 and §5.

**Nothing in this plan re-splits the task.** The owner ruling — verbatim option label **"One cleanup task, scheduled early (Recommended)"** — governs, and §7 Open Question 5 puts the growth to the owner as a question, not as a split.

---

## 1. Step 1 — the re-measurement, with commands and results

These are the exact commands run, at `9360177`. They are recorded here so the build step re-runs them verbatim and compares, rather than inheriting these numbers.

### 1a. Measurement discipline applied

Three hazards were tested for, not assumed away:

```sh
# (a) occurrences, not lines — grep -c counts LINES
grep -ohE 'PATTERN' <files> | wc -l          # occurrence count
grep -lE  'PATTERN' <files> | wc -l          # file count

# (b) line-wrap — a phrase split across a newline is invisible to single-line grep.
#     Join, then SQUEEZE, because the continuation line's indent survives a bare tr.
tr '\n' ' ' < "$f" | tr -s ' ' | grep -oE 'PATTERN' | wc -l

# (c) case — the earlier passes were case-sensitive and were WRONG.
grep -ohiE 'PATTERN' <files>
```

**(b) and (c) each found real sites that the case-sensitive single-line form missed.** Both are recorded below as findings, not as footnotes.

### 1b. Shape 1 — dead `ai-agents/sprints/sprint-N.md`

```sh
for f in ai-agents/tasks/backlog/*/brief.md; do
  n=$(grep -oE 'sprints/sprint-[0-9]+\.md' "$f" | wc -l | tr -d ' ')
  [ "$n" != 0 ] && echo "$n  $f"
done
grep -ohE 'sprints/sprint-[0-9]+\.md' ai-agents/tasks/backlog/*/brief.md | sort | uniq -c
ls ai-agents/sprints/ ai-agents/sprints/done/
```

**Result at `9360177`:** 31 occurrences across 20 files. Split by N: **sprint-2 ×23, sprint-3 ×2, sprint-5 ×4, sprint-6 ×2**.
`ai-agents/sprints/` holds `backlog.md`, **`sprint-6.md`**, `done/`, `reviews/`. `done/` holds `sprint-1..5.md`.

**Dead population = 29 occurrences across 18 files** (sprint-6's 2 are live and excluded).

| | brief (`4424b44`) | live (`9360177`) | difference |
|---|---|---|---|
| files with a **dead** path | 17 | **18** | **+1** |
| **dead** occurrences | 28 | **29** | **+1** |
| files with a **live** `sprint-6.md` path | *not recorded* | **2** | **new class** |

**Grown, not shrunk.** New since the brief: `0306` itself (`:176`, ×1 — its own text). Newly visible as a *live* path: `0154:159`, `0272:280`. Every per-file count in the brief's table reproduced unchanged. **Wrap check: no wrapped occurrences of this pattern** (joined count == single-line count for every file).

### 1c. Shape 2 — bare `task NN` in open briefs

```sh
grep -ohiE '\btask [0-9]{1,2}\b' ai-agents/tasks/backlog/*/brief.md | tr 'A-Z' 'a-z' | sort | uniq -c | sort -rn
grep -nE  '\bTask [0-9]{1,2}\b' ai-agents/tasks/backlog/*/brief.md      # the capital-T sites
for f in ai-agents/tasks/backlog/*/brief.md; do                          # the wrap check
  r=$(tr '\n' ' ' < "$f" | tr -s ' ' | grep -oE '\btask [0-9]{1,2}\b' | wc -l|tr -d ' ')
  s=$(grep -ohE '\btask [0-9]{1,2}\b' "$f" | wc -l|tr -d ' ')
  [ "$r" != "$s" ] && echo "WRAPPED: $f single=$s joined=$r"
done
```

**Result:** **14 files** carry a bare numeral (brief says 13). Case-insensitive totals: `task 36` ×25, `43` ×20, `27` ×12, `28` ×8, `80` ×7, `70` ×7, `23` ×6, `46` ×5, `47` ×3, `26` ×2.

**Two measurement findings, each a live site the brief's own verification command cannot see:**

- **⭐ Case.** `\btask ` (lowercase) misses **7 sites** in open briefs, including **every** site in **`0188-repair-the-five-live-ownership-fact-defects`** — a file **absent from the brief's 13-file list entirely**. The capital-`T` sites: `0013:149`, `0045:20`, `0046:51`, `0046:86`, `0046:109`, `0188:62`, `0226:37`.
- **⭐ Wrap.** `0046` returns 7 single-line hits but **8 joined** — `brief.md:26` ends in the bare word `task` and `:27` opens with `36 (\`remove-fkit-omnigent-orphan-residue\`)`. **An eighth `task 36` exists that `grep -ohE` cannot see**, and the brief's verification step 3 uses exactly that form.

**Drift vs the brief's Shape-2 table:** the brief lists `task 43` as cited by `0196`, `0302`, `0305`. **`0037:35` also carries it** — a fourth citer the table misses.

### 1d. Shape 2 — `task 43` under `claude/`

```sh
grep -rlE '\btask 43\b' claude/ | while read f; do echo "$(grep -oE '\btask 43\b' "$f"|wc -l|tr -d ' ')  $f"; done
grep -roiE '\btask 43\b' claude/ | wc -l          # case-insensitive total
grep -rn  '\btask 43\b' claude/scaffold/          # must be empty
```

**Result — 12 occurrences across 5 files. This matches the brief's corrected figure exactly; no drift.**

| file | occurrences |
|---|---|
| `claude/fkit-claude.sh` | 6 (`:18`, `:254`, `:273`, `:282`, `:285`, `:292`) |
| `claude/README.md` | 3 (`:30`, `:55`, `:159`) |
| `claude/skills-for-role.sh` | 1 (`:3`) |
| `claude/skill-ownership-hook.sh` | 1 (`:2`) |
| `claude/skills/fkit-team/SKILL.md` | 1 (`:40`) |

**Nothing under `claude/scaffold/`.** Case-insensitive total is also 12 (no capital-T `Task 43`). No wrapped occurrences under `claude/`.

⚠️ **Reported, and deliberately out of scope:** `claude/` also carries `Task 70` (`fkit-claude.sh:266`, `skills-for-role.sh:20`), `Task 36` (`fkit-claude-init.sh:578`) and `Task 67` (`skills/fkit-status/dashboard.sh:160`). The owner ruling widened scope to **the `task 43` numeral only**; these are **not** repaired and are recorded here so nobody reads the widening as a `claude/` sweep.

### 1e. Shape 3 — discharged dependencies

```sh
for id in 0168 0204 0223 0240 0046 0194; do
  grep -nE '^\s*-?\s*\*\*(Depends on|Blocks)' ai-agents/tasks/backlog/${id}-*/brief.md; done
for n in 0160 0202 0222 0182 0189 0190 0191; do ls -d ai-agents/tasks/*/${n}-*; done
```

**Result:**

| row | dependency | target today | already corrected? |
|---|---|---|---|
| `0168` | `0160` | `done/` | **no** — repair |
| `0204` | `0202` | `done/` | **no** — repair |
| `0223` | `0222` | `done/` | **no** — repair |
| `0046` | `task 36` → `0072` by name | `done/` | **no** — repair |
| **`0240`** | `0222`, and `Blocks: 0182` | both `done/` | **⭐ YES — ALREADY REPAIRED** |
| `0194` | `0189` open; `0190`,`0191` closed | mixed | **no** — correct the count only |

**⭐ `0240` is already fully repaired at HEAD `9360177`**, on **both** edges, with correctly nested `✅ DATED CORRECTION 2026-08-14` / `⛔ DATED CORRECTION 2026-08-14` bullets. **Shape 3's repair population is 4, not 5.** Re-repairing it would duplicate a correction.

`0224`, `0225`, `0229`, `0271` verified present and already-correct — untouched, as the brief requires.

### 1f. Dashboard baseline — captured before any edit

```sh
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md  > /tmp/dash_backlog_before.txt
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md > /tmp/dash_s6_before.txt
```

| board | exit | `grep -c '^drift '` | `grep -cE '^derive .*UNPARSEABLE'` |
|---|---|---|---|
| `backlog.md` | `0` | **0** | **0** |
| `sprint-6.md` | `0` | **0** | **0** |

Contrast values, recorded to show the anchoring matters: on `backlog.md` a **bare** `grep -c drift` returns **24** and a bare `grep -c UNPARSEABLE` returns **2**. The brief predicts "~30" and "3" — **both have drifted**; the anchored forms are the ones to use, exactly as the brief insists.

**⭐ Which board derives which row** (this changes verification 7):

| row | `^derive` on `backlog.md` | `^derive` on `sprint-6.md` |
|---|---|---|
| `0168`, `0204`, `0223`, `0046` | **0** | **1 each** |
| `0240`, `0194` | **1 each** | 0 |

---

## 2. Step 2 — repair Shape 1 (29 dead occurrences, 18 files)

**The repair is `ai-agents/sprints/sprint-N.md` → `ai-agents/sprints/done/sprint-N.md`.** Almost every site is a **repo-root-relative plain-text path**, not a markdown link, so relative depth does not enter; the two markdown-link sites (`0154`, `0272`) point at the **live** `sprint-6.md` and are not touched. Depth is still checked per site rather than assumed.

**⛔ This is not a sweep.** Each of the 29 sites is classified into one of five treatments before anything is written:

| # | treatment | what it means | sites (verified in planning) |
|---|---|---|---|
| **A** | **Live — leave, no note** | the path resolves | `0154:159`, `0272:280` (`sprint-6.md`) — *outside the 29* |
| **B** | **Re-point** | ordinary citation of an archived board | the bulk of the 29 |
| **C** | **Executable command — re-point, priority** | the command fails as written | `0155:120`, `0156:122`, `0193:154`, `0193:165`, `0234:113`, `0296:194` |
| **D** | **Quoted frozen record — leave, dated note beside** | the coordinate is part of a verbatim quotation | per-site, incl. `0176:203` (inside its own 2026-08-06 correction blockquote) |
| **E** | **⭐ Subject-of-the-brief mention — leave, dated note beside** | the sentence is *about* the string; re-pointing destroys its meaning | `0236:1` (the **title**), `0236:26`, `0236:95`, `0236:100`, `0237:63`, `0306:176` |

**⭐ Class E is new — the brief's vocabulary has no slot for it, and without it the run corrupts records.** `0236` is the task *"Sweep the stale `ai-agents/sprints/sprint-2.md` prose paths after the archival"*: the dead string is its **title and its subject**. `0237:63` reads *"…names `ai-agents/sprints/sprint-2.md` as one of its 8 files, and that file no longer exists at that path"* — re-pointing makes the sentence self-contradictory. **This is Open Question 2.**

**Two class-C sites need a judgement call and the build step STOPS at each rather than choosing:**

- **`0296:194`** — inside a runnable loop: `for b in ai-agents/sprints/backlog.md ai-agents/sprints/sprint-5.md ai-agents/sprints/done/sprint-*.md`. The `done/sprint-*.md` glob **now already covers** sprint-5, so re-pointing makes the term **redundant, not correct**. Dropping a term is a semantic edit to someone else's verification command.
- **`0234:113`** — *"Run the dashboard over **all four live boards** — `sprints/backlog.md`, `sprints/sprint-3.md`, …"*. `sprint-3` is archived, so re-pointing the path leaves the word **"live"** false and the count **"four"** unverified.

**Named priority cases from the brief, all confirmed on disk:** `0193` (5 occurrences, `:154` and `:165` inside `git diff ai-agents/sprints/sprint-2.md` verification commands — the reason its brief cannot be executed); `0183:78` (its deliverable *target* is a dead path); `0176` (repair **beside** its 2026-08-06 correction at `:195-210`, never over it).

**⛔ `0306`'s own `:176` is class E and is not repaired** — it is this task's specification describing `0193`'s defect. See Open Question 4.

---

## 3. Step 3 — repair Shape 2 (the load-bearing step)

### 3a. ⭐ The resolution rule found on disk

Pre-migration `task NN` equals the task's **`## Priority` field value** — the pre-ADR-029 identity, which is precisely why `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` exists. Derivation:

```sh
for d in ai-agents/tasks/*/[0-9][0-9][0-9][0-9]-*/; do
  p=$(awk '/^## Priority/{getline; print; exit}' "$d/brief.md"); echo "$p|$(basename $d)"
done | sort -n -t'|' -k1
```

**⚠️ The rule is a lead, not proof.** Priority is *rank*, was re-ranked, and is **not guaranteed unique**. It is used to *generate* a candidate; each site is then confirmed against the surrounding prose, which usually names the work — the durable half that survived the migration. **A numeral is only repaired when both agree.** Collision check run over the cited numerals: **no collisions**.

### 3b. Per-numeral classification — evidence in hand

| numeral | resolves **today** to | intended referent + independent evidence | class |
|---|---|---|---|
| `task 23` | `done/0023-converge-…-on-launch` | `0006-add-launcher-contract-test-suite` (P23). `0013:240` cites `test/prove-red.sh (task 23 / ADR-014)` — ⚠️ **verify `prove-red.sh`'s provenance before writing**; not yet proven | **mis-resolving** (pending that check) |
| `task 23` @ `0296:66` | — | inside `⛔ Cancelled (2026-07-14) — superseded by Sprint 2 task 23` | **quoted frozen record → note beside** |
| `task 26` | `done/0026-design-deterministic-dashboard…` | `0088-stop-init-failure-bricking-the-launcher` (P26). `0046:58` — *"a refused intake warns and init carries on"* — exact match | **mis-resolving** |
| `task 27` | `cancelled/0027-design-fkit-git-agent…` | `0069-refuse-init-on-weird-ai-agents-state` (P27). **`0045:62-63` names it: `**task 27** (\`refuse-init-on-weird-ai-agents-state\`)`** | **mis-resolving** ⚠️ the brief's *"a behavioral-claim form"* is wrong |
| `task 28` | `cancelled/0028-design-ship-loop-timeout…` | `0023-converge-ai-agents-additively-on-launch` (P28); `0045:62` names it | **mis-resolving** ✅ agrees with brief |
| `task 36` | `done/0036-extend-mover-reference-sweep…` | `0072-remove-fkit-omnigent-orphan-residue` (P36); `0046:101` names it | **mis-resolving** ✅ agrees with brief |
| `task 43` | `done/0043-fix-scaffold-knowledge-base-folders` | **`0052-implement-pretooluse-skill-ownership-hook`** (P43 — and ADR-018 §Tasks names `implement-pretooluse-skill-ownership-hook` as its sibling implementation task) | **mis-resolving** ✅ agrees with brief; **task ID resolved from disk, not carried from the brief** |
| `task 46` | **`backlog/0046-…` — LIVE OPEN** | `0058-investigate-mutation-testing-library-adoption` (P46); `0037:47` names it | **mis-resolving — the worst landing**, exactly as the brief warned |
| `task 47/48` | `done/0047-give-codex-the-universal-hard-rules` | `0064-record-one-skill-one-output-convention` / `0086-ship-one-skill-one-output-convention-in-scaffold` (P47/P48). `0137:156` describes *"architect writes the convention, coder ships the scaffold half"* — exact match | **mis-resolving** |
| **`task 70`** | `done/0070-relax-tool-allowlists…` | **`0008-add-open-questions-interview-skill-for-six-roles` (P70)** — and the quoted warning *"Task 70 followed the two-item list precisely and still shipped a false statement into every consuming project"* describes a **mirror** failure, which `0008` is and `0070` is not | **⛔ CONTRADICTS the brief's explicit "do not repair" — Open Question 1** |
| `task 80` | `done/0080-report-backlog-board…-on-request-only` | `0078-repair-stale-adr-029-stop-hook-links-in-the-vault` (P80). **`0013:74` carries the link right beside the numeral** | **mis-resolving** |

**Net:** the brief's *"NOT resolved by this triage"* set (`23`, `26`, `46`, `47/48`, `80`) resolves to **five more mis-resolving numerals**, and one of its two safe counter-examples is in doubt.

### 3c. Repair form (Step 3.4)

Per the brief and `0046`'s model: the durable four-digit folder ID **with the descriptive name alongside** —

> `task 36` → `` `0072` (`remove-fkit-omnigent-orphan-residue`) ``

**Where the site is a quotation (class D) the numeral is never rewritten** — a dated note goes beside it.

### 3d. The `claude/` half (12 occurrences, 5 files) — and a coupling the brief does not name

Same four-way classification, per site, **not a find-and-replace**. All 12 already cite `ADR-018` in the same breath, so the durable half is present and only the numeral rots.

**⭐ The two halves of this task are coupled, and the run creates the problem itself.** Three open briefs quote those source comments **verbatim**:

- `0196:33` — *"Retired here (task 43 / ADR-018, …"* quotes `fkit-claude.sh:282`
- `0302:159` — *"…`skills-for-role.sh` (task 43) — the mutation targets THAT file now"*
- `0305:59` — a `>` blockquote of `fkit-claude.sh:18`

**Repair the source and those three quotations become quotations of text that no longer exists.** Treatment: repair the source; leave each quotation **byte-identical**; append a dated note recording that the quoted comment was repaired by `0306` and giving the new wording. This is the append-only pattern the board already uses.

⚠️ **`0037:35` carries `task 43` as live prose, not a quotation** — repair it inline. It is the citer the brief's table missed.

⚠️ **`claude/skills-for-role.sh:3`** reads *"Extracted from `fkit-claude.sh` (task 43 / ADR-018)"*. The extraction may have been `0052` (P43) or `0063-reconcile-skill-ownership-source-of-truth`. **Resolve from disk before writing; if it cannot be resolved, classify it `unresolvable` and report it** — a first-class finding, per Step 3.3.

⚠️ **`claude/skill-ownership-hook.sh:2`** is the most load-bearing site: the hook that `task 43` *means*, whose own header cites the numeral.

**Release surface, re-verified this planning step:** none of the 5 files is under `claude/scaffold/`, so ⛔ **no `npm run generate:manifest`**, and `claude/structure-manifest.tsv` must **not** appear in the diff. `test/dual-home-parity.test.js` walks `ai-agents/` against `claude/scaffold/ai-agents/`; none of the 5 is in either home. **`npm test` is still run and its result stated** — `test/skill-frontmatter.test.js`, `test/skill-ownership-hook.test.js` and `test/launcher-contract.test.js` all read the touched files.

---

## 4. Step 4 — repair Shape 3 (4 rows, not 5)

For `0168`, `0204`, `0223`, `0046`: **append a dated correction as a nested bullet beneath the original**, leaving the original `Depends on:` line **byte-identical**. The model is `0224:231-235` and `0240:285-291`, both already on disk.

⛔ **`0240` is skipped — already repaired at HEAD, both edges.** Re-repairing duplicates a correction. This is a re-measurement finding, reported.

**`0194`:** correct *"⚠️ All three dependencies are open at filing"* to name **`0189` alone** as the surviving block. ⛔ **`0194` stays blocked** — do not mark it ready.

**Parse-shape guard.** The nested-bullet form is used because `dashboard.sh` derives the next-step from a `- **Depends on:**` bullet with nothing between `**` and the label; a decorated variant renders `⟨derive: UNPARSEABLE — see brief⟩`.

⚠️ **`0168`'s line is `- **Depends on 0160 — hard.**` — no colon** — yet it *does* render a derive line on `sprint-6.md` today. The parse is more permissive than the brief describes. **The plan does not assume either way**: the dashboard is re-run after the edit and the derive line compared against the captured baseline.

⛔ **`0224`, `0225`, `0229`, `0271` are not touched.**

---

## 5. Files this task touches

**Under `ai-agents/tasks/backlog/`** — up to ~28 `brief.md` files across the three shapes. Shape 1: 18. Shape 2: 14 (incl. **`0188`**, absent from the brief's list). Shape 3: 5 (`0168`, `0204`, `0223`, `0046`, `0194`). Overlaps: `0013`, `0046`, `0296`.

**Under `claude/`** — exactly 5: `fkit-claude.sh`, `README.md`, `skills-for-role.sh`, `skill-ownership-hook.sh`, `skills/fkit-team/SKILL.md`.

**Never touched:** `ai-agents/wiki-vault/`, `test/`, `bin/`, `claude/scaffold/`, `ai-agents/sprints/*.md` (including `sprint-6.md`), anything under `tasks/done/` or `tasks/cancelled/`, `sprints/done/`, and the four already-correct rows.

---

## 6. Verification — and the corrections the brief's own steps need

**⭐ Three of the brief's verification commands cannot pass as written. Each is replaced, with the original stated.**

| brief step | defect found in planning | replacement |
|---|---|---|
| **V1** | `grep -rE 'sprints/sprint-[0-9]+\.md'` also matches the **live** `sprint-6.md`, so it can never return "only justified survivors" | narrow to dead N, **and** enumerate `0154:159` / `0272:280` as justified live paths |
| **V3** | `grep -ohE '\btask [0-9]{1,2}\b'` is **case-sensitive** (misses 7 sites, all of `0188`) and **single-line** (misses `0046`'s wrapped `task 36`) | `grep -ohiE` **plus** the `tr '\n' ' ' \| tr -s ' '` joined pass; both counts reported |
| **V6** | runs the dashboard over `backlog.md` only; **four of the five Shape-3 rows derive on `sprint-6.md`** | run **both** boards; compare `^drift ` and `^derive .*UNPARSEABLE` against the §1f baselines |
| **V7** | names five rows; **`0240` needs no repair** | four rows repaired; `0240` verified unchanged and reported as already-correct |

Full verification list to be satisfied:

1. **V1′** — dead sprint paths gone from open briefs; **every survivor named with its reason** (class D or E). A bare count is not a pass.
2. **V2** — every re-pointed path resolves, checked by resolving relative to the file that holds it (`[ -f ]`), not by eyeballing.
3. **V3′** — every distinct numeral, case-insensitive and wrap-aware, carries a worklog line: classification + evidence. **An unclassified numeral is a failed verification**; `unresolved` passes only with a stated reason.
4. **V4** — `task 27/28/36/43` survive only inside individually-justified quotations.
5. **V5′** (widened) — `grep -rn '\btask 43\b' claude/` **before and after**, both re-derived; every survivor justified; `git diff --stat` **lists** `claude/` files and **nothing** under `claude/scaffold/`, `test/`, `bin/`; **`claude/structure-manifest.tsv` absent**; `npm test` green and stated.
6. **V6′** — both boards: exit `0`, `grep -c '^drift '` unchanged from baseline (**0/0**), `grep -cE '^derive .*UNPARSEABLE'` = `0`. ⛔ Never `grep -F` the literal token — the dashboard echoes rows verbatim, so prose that *mentions* it matches its own documentation. Anchored only.
7. **V7′** — `0168`, `0204`, `0223`, `0046` each still render a `^derive` line on `sprint-6.md`, and `0194` on `backlog.md` — none `UNPARSEABLE`.
8. **V8** — `0194` still reads blocked, on `0189` alone.
9. **V9** — `git diff --stat` lists no `brief.md` under `0224`, `0225`, `0229`, `0271`, **and none under `0240`**.
10. **V10** — `git status --porcelain` shows no path under `tasks/done/` or `tasks/cancelled/`; no `## Status` line in the diff; **no change to `ai-agents/sprints/sprint-6.md` beyond what was already uncommitted before this task started**.
11. **V11′** (inverted, per the master correction) — the worklog states **both** halves repaired, gives re-measured `claude/` before/after counts, and names any occurrence deliberately left with its reason. ⚠️ **The honest residual is still stated:** repairing these 12 comments removes today's seed, but **nothing enforces the durable citation form**, so the class can return — that is `0171`'s job, and this task does not claim otherwise.
12. **V12 (added)** — the worklog records the drift table of §1 in both directions, and the **four re-measurement findings**: the live `sprint-6.md`, the case gap, the wrap gap, and `0240` already repaired.

---

## 7. Risks and stop-points

- **⛔ Uncommitted work already in the tree.** `ai-agents/sprints/sprint-6.md` and `0306/brief.md` are modified at session start. **`git stash` is banned this run**; no `git add`, no commit, no push. The `git diff --stat` verifications must account for the pre-existing modifications rather than treating the whole diff as this task's.
- **File contention is wide by construction** — ~28 open brief folders. ⛔ Do not run any other row that touches these briefs concurrently.
- **The Priority-index rule is a lead, not proof.** Every repair needs prose confirmation too. Where the two disagree, the site is left and reported `unresolved`.
- **Class-C semantic edits** (`0296:194`, `0234:113`) change someone else's verification command. **The build step stops and surfaces at each** rather than choosing.
- **`0171` is open** (`🔲 Backlog`; `conventions/durable-citation-anchors.md` does not exist), so this task runs **first** and must **name the anchor form it used and why** — Open Question 3.

---

## 8. Sequencing

1. Re-run §1's commands, diff against §1's figures, record both. *(If anything moved again, stop and report before editing.)*
2. Capture the dashboard baselines for **both** boards (§1f).
3. Shape 3 — 4 rows + `0194`. Smallest, best-precedented, and independently verifiable. Re-run the dashboard.
4. Shape 1 — classify all 29 sites into A–E first, **write nothing until the classification is complete**, then repair classes B and C, stopping at the two class-C judgement calls.
5. Shape 2, `ai-agents/` half — per-numeral, evidence recorded per site.
6. Shape 2, `claude/` half — 12 sites; then `npm test`; then the coupling notes on `0196`, `0302`, `0305`.
7. Full verification sweep V1′–V12; write `worklog.md`.

---

## OPEN QUESTIONS

**1. ⛔ `task 70` — the brief's counter-example is contradicted by the evidence. Which wins?**
The brief carries an explicit ⛔ *"`task 70` (cited by `0217`, `0226`) resolves **correctly** to `done/0070-relax-tool-allowlists-except-adversarial-reviewer`. Do not 'repair' it."* But the resolution rule gives **`0008-add-open-questions-interview-skill-for-six-roles`** (Priority 70), and the prose fits `0008` far better: the quoted warning is *"Task 70 followed the two-item list precisely and still shipped a false statement into every consuming project"* — a **mirror-checklist** failure, which adding one skill across six roles is and a tool-allowlist relaxation is not. **`task 70` ↔ `0070` is exactly the coincidence trap this task exists to catch, and the brief may have fallen into it.**
Options: **(a)** honour the brief's ⛔, leave `task 70` untouched, report the contradiction; **(b) (Rec)** treat it as mis-resolving and repair the two *prose* sites in `0217` (`:32`, `:92`), leaving the *quoted* sites in `0226:37` and `0188:62` byte-identical with a note beside; **(c)** leave it and file a follow-up task.
*I am not settling this — it contradicts an explicit instruction and changes what gets written.*

**2. ⭐ Accept a fifth leave-class, "subject-of-the-brief mention"?**
The brief's Step-3 vocabulary is mis-resolving / correct / quoted frozen record / unresolvable, and Step 2 exempts only *quoted frozen records*. **`0236`'s title, `0237:63` and `0306:176` are none of those** — the dead string is the sentence's subject, and re-pointing it destroys the meaning (`0236` is literally the task *"Sweep the stale `ai-agents/sprints/sprint-2.md` prose paths"*).
Options: **(a) (Rec)** add class E — leave byte-identical, dated note beside; **(b)** force them into "quoted frozen record" (inaccurate, but no new vocabulary); **(c)** re-point them anyway (⛔ corrupts the records — not recommended).

**3. Anchor form, with `0171` still open.** `0171` (`🔲 Backlog`) has not written `durable-citation-anchors.md`, so this run must name its own form. Proposed: **task citations** → `` `NNNN` (`folder-slug`) ``, per `0046`'s model; **board citations** → re-point the **path only** (`sprints/done/sprint-N.md`), leaving any `:NNN` line-number suffix **byte-identical** with a note.
The tension: `0236:100` records that `0160`'s ruling makes the `path:NNN` form *"categorically wrong for a mutable coordinate"*, which argues for rewriting those to `§"heading"` anchors instead.
Options: **(a) (Rec)** path-only re-point; heading-anchor migration is `0171`'s job and doing it here is a frontier-move across 18 briefs; **(b)** migrate `:NNN` to `§heading` now, at materially higher cost and risk of forking a form `0171` may then rule differently.

**4. Is `0306`'s own `brief.md` excluded from repair?** It carries **16 `task 43`**, plus `task 23/26/27/28/36/46/47/70/80` and one `sprints/sprint-2.md` — all of it the *specification of the defect*. Repairing it would erase the task's own description of what it repairs.
Options: **(a) (Rec)** exclude `0306/brief.md` from both sweeps, stated explicitly by name in the worklog and in the verification commands; **(b)** repair it like any other brief (⛔ destroys the spec — not recommended).

**5. Shape 2 roughly doubled. Proceed inside one task, or stop?** The brief classifies 4 mis-resolving numerals; disk evidence gives **8** (`23`, `26`, `27`, `28`, `36`, `43`, `46`, `47/48`, `80`), plus a 14th file (`0188`) and a 4th `task 43` citer (`0037`) that the brief's tables miss.
⛔ **This plan does not re-split the task** — the owner ruling **"One cleanup task, scheduled early (Recommended)"** governs, and a split is the owner's call, not the run's.
Options: **(a) (Rec)** proceed as one task with the widened Shape-2 set — the extra numerals are the same mechanical class and the resolution rule is already derived; **(b)** repair only the brief's original 4 numerals and file the other 5 as a follow-up; **(c)** split (⛔ requires reversing the 2026-08-14 ruling).

---

<!-- ============================================================================
     ADDENDUM — NOT PART OF THE PLANNER'S TEXT.
     Everything above this line is the plan as returned by the Plan-step worker,
     copied verbatim. Everything below was appended by the driver (fkit-lead) in
     the same turn as the approval, and records the owner's rulings AT the plan
     gate. It is additive: not one byte above it was altered.
     ============================================================================ -->

## ⛔ Owner rulings at the plan gate — 2026-08-15

**Channel:** `AskUserQuestion`, live `fkit lead` session driving `/fkit-sprint-ship-loop`.
**Form:** each ruling is a selection from an option list, so **the option label is the verbatim text.**

| # | Question | Ruling — verbatim option label |
|---|---|---|
| **Plan gate** | Approve this plan? | **"Approve — build all three shapes (Recommended)"** |
| **OQ 1** | `task 70` — brief's ⛔ vs the evidence | **"Repair the prose sites, leave the quotations (Recommended)"** |
| **OQ 5** | Shape 2 scope, after it roughly doubled | **"Repair the widened set — all of it (Recommended)"** |
| **OQ 2** | A fifth leave-class for subject-of-the-brief mentions | **"Add class E — leave byte-identical, note beside (Recommended)"** |

**What each ruling authorizes, stated so the Build step does not have to infer it:**

1. **OQ 1 — `task 70` is treated as mis-resolving.** ⚠️ **This ruling overrides the brief's explicit ⛔** *"resolves correctly to `0070`… Do not 'repair' it."* Repair the two **live-prose** sites in `0217` (`:32`, `:92`) to `0008` (`add-open-questions-interview-skill-for-six-roles`). ⛔ Leave the **quoted** sites — `0226:37` and `0188:62` — **byte-identical**, with a dated note beside each. The owner ruled this on the evidence in §3b; **record in the worklog that a brief instruction was overridden by owner ruling, and name the ruling.**
2. **OQ 5 — the widened Shape-2 set is in scope**: `23`, `26`, `27`, `28`, `36`, `43`, `46`, `47/48`, `80`, plus the 14th file `0188` and the 4th `task 43` citer `0037`. This is **not** a re-split and **not** a re-scope of the task; it is the same task measured correctly.
3. **OQ 2 — class E is accepted** as a fifth leave-class, exactly as §2's table defines it. Name it in the worklog so the vocabulary is not silent.

**The two remaining open questions were answered by the driver, not the owner, and both took the conservative branch. The owner was told and did not object:**

4. **OQ 3 → option (a).** Path-only re-point; `:NNN` line-number suffixes stay byte-identical. Migrating them to `§heading` anchors is **`0171`'s** job and is a frontier move across 18 briefs.
5. **OQ 4 → option (a).** **`0306`'s own `brief.md` is excluded from both sweeps**, by name, in the worklog and in every verification command. Repairing it would erase the specification it is.

⚠️ **Everything else in the plan stands as written** — including its two class-C stop-points (`0296:194`, `0234:113`), which the Build step must surface rather than decide.
