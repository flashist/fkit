# Worklog — `0306` Repair the three decay shapes across the open backlog briefs

**Role:** fkit-coder (Build step of `/fkit-sprint-ship-loop`, Sprint 6 P1)
**Run date:** 2026-08-15 · **HEAD at run:** `9360177` · **Plan:** `plan.md`, blob
`fc99fd6c0695d68369ba8216343ddf5a4ee57711` — **verified by `git hash-object` before any write; it
matched, so the file on disk was used as authoritative and the driver's pasted copy was not relied on.
No divergence between paste and file was found.**

⛔ **No commit, no push, no `git add`, no `git stash`.** ⛔ **No task file moved; no `## Status` line
touched.** ⛔ **`ai-agents/sprints/sprint-6.md` not edited** (its working-tree modification predates
this run — see §7).

---

## 1. Step 1 — the re-measurement, and how it compared to the plan

**Every figure in the plan's §1 reproduced exactly at `9360177`. Nothing moved between planning and
build, so the plan's §8 step-1 stop condition did not fire.**

| Measure | Brief (`4424b44`) | Plan (`9360177`) | **Build, re-derived (`9360177`)** | verdict |
|---|---|---|---|---|
| Shape 1 — occurrences, all N | *not recorded* | 31 | **31** | reproduced |
| Shape 1 — files, all N | *not recorded* | 20 | **20** | reproduced |
| Shape 1 — split by N | — | 2×23, 3×2, 5×4, 6×2 | **2×23, 3×2, 5×4, 6×2** | reproduced |
| Shape 1 — **dead** occurrences | 28 | **29** | **29** | brief was **+1 low** |
| Shape 1 — **dead** files | 17 | **18** | **18** | brief was **+1 low** |
| Shape 1 — **live** `sprint-6.md` paths | *not recorded* | 2 | **2** | new class, confirmed |
| Shape 2 — files with a bare numeral (ci, excl. `0306`) | 13 | **14** | **14** | brief was **+1 low** |
| Shape 2 — `claude/` occurrences / files | 12 / 5 | 12 / 5 | **12 / 5** | reproduced, no drift |
| Shape 3 — rows needing repair | 5 | **4** | **4** | brief **over-counted by 1** |
| Dashboard `^drift ` (both boards) | ~30 | 0 / 0 | **0 / 0** | brief's figure was unanchored |
| Dashboard `^derive .*UNPARSEABLE` (both boards) | 3 | 0 / 0 | **0 / 0** | brief's figure was unanchored |

**Per-numeral totals (case-insensitive, whole open backlog including `0306`), re-derived:**
`36`×25, `43`×20, `27`×12, `28`×8, `80`×7, `70`×7, `23`×6, `46`×5, `47`×3, `26`×2 — **identical to
the plan's §1c.**

### The four re-measurement findings, recorded as V12 requires

1. **⭐ `ai-agents/sprints/sprint-6.md` EXISTS and is the active board.** The brief's Shape-1 premise
   — *"No `sprints/sprint-N.md` path resolves any more, for any N"* — **is false.** 2 of the 31
   matches (`0154:159`, `0272:280`, both markdown links) point at it and are **correct**. They were
   left untouched, with no note: a live path needs no correction.
2. **⭐ The case gap.** `\btask ` (lowercase) misses **7 sites** in open briefs — `0013:149`,
   `0045:20`, `0046:51`, `0046:86`, `0046:109`, `0188:62`, `0226:37` — including **every** site in
   `0188`, a file the brief's 13-file list omits entirely. The brief's own verification step 3 uses
   the case-sensitive form and therefore **cannot see them**. All verification here used `grep -i`.
3. **⭐ The wrap gap.** `0046` returned 7 single-line hits but **8 joined**: `brief.md:26` ended in
   the bare word `task` and `:27` opened with `36 (…)`. **An eighth `task 36` existed that
   `grep -ohE` could not see.** It was found by the `tr '\n' ' ' | tr -s ' '` joined pass and
   repaired by hand. **Post-run wrap check: joined == single in every open brief (0 mismatches).**
4. **⭐ `0240` was ALREADY REPAIRED at HEAD**, on **both** edges (`Depends on: 0222`, `Blocks: 0182`),
   with correctly nested dated corrections. **Shape 3's repair population is 4, not 5.** `0240` was
   not touched; re-repairing would have duplicated a correction.

### Two further findings this build added, which the plan did not have

5. **⭐ The plan's slug for `task 23` is wrong.** Plan §3b writes
   `0006-add-launcher-contract-test-suite`. **On disk the folder is
   `ai-agents/tasks/done/0006-add-launcher-contract-smoke-script/`** — the plan took the brief's H1
   (*"Add the launcher-contract test suite"*), not the durable folder slug. **The disk slug was used.**
6. **⭐ `test/` carries 25 more stale `task 43` occurrences** — `prove-red.sh` ×4,
   `launcher-contract.test.js` ×4, `skill-ownership-hook.test.js` ×1, and **×16 (8 each)** inside the
   two frozen `test/fixtures/closed-rank-0174-{before,after}.md` board snapshots (which must never be
   edited). `4 + 4 + 1 + 16 = 25`. 📌 **Corrected 2026-08-15 (review round 1, R3)** — this line first
   said *"×14"*, which did not sum to its own total of 25. Re-counted per file on disk with
   `grep -oiE '\btask 43\b'`; the total 25 was right, the itemisation was not.
   ⛔ **`test/` is out of scope** (plan §5, V5′). **Not repaired. Recorded here and in `0302`'s brief
   so the class is not re-discovered a third time.**

---

## 2. The resolution rule, and how each numeral was proved

**Rule:** pre-migration `task NN` = the task's **old `## Priority` field value**, the pre-ADR-029
identity that `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` exists to
explain. ⚠️ **The rule is a lead, not proof** — priority is rank, was re-ranked, and is not
guaranteed unique. **Collision check run over the whole corpus: priorities `2`, `3`, `9`, `12`, `13`,
`119` collide; NONE of the cited numerals do.** Every numeral below was confirmed a second way, from
prose or from git, before anything was written.

| numeral | lands **today** on (coincidence) | **resolved to** | second, independent proof |
|---|---|---|---|
| `23` | `done/0023-converge-…-on-launch` | **`0006`** `add-launcher-contract-smoke-script` | `test/prove-red.sh` was created in commit `c441d97` **in the same commit as `test/launcher-contract.test.js` and `test/harness.mjs`** — i.e. by the launcher-contract suite task. ADR-014 names *"task 23"* four times as the task that builds the suite and settles the runner. ⭐ **This closes the plan's open `prove-red.sh` provenance check.** |
| `26` | `done/0026-design-deterministic-dashboard…` | **`0088`** `stop-init-failure-bricking-the-launcher` | `0046:58` — *"a refused intake warns and init carries on"* — is that task's bar, verbatim |
| `27` | `cancelled/0027-design-fkit-git-agent…` | **`0069`** `refuse-init-on-weird-ai-agents-state` | `0045:62-63` names it in full: `**task 27** (`refuse-init-on-weird-ai-agents-state`)` |
| `28` | `cancelled/0028-design-ship-loop-timeout…` | **`0023`** `converge-ai-agents-additively-on-launch` | `0045:62` names it in full |
| `36` | `done/0036-extend-mover-reference-sweep…` | **`0072`** `remove-fkit-omnigent-orphan-residue` | `0046:101` names it in full; `orphan_contained()` is on disk at `claude/fkit-claude-init.sh:665` |
| `43` | `done/0043-fix-scaffold-knowledge-base-folders` | **`0052`** `implement-pretooluse-skill-ownership-hook` | `claude/skills-for-role.sh` was **created in commit `13f3e30` alongside `claude/skill-ownership-hook.sh` and `test/skill-ownership-hook.test.js`** — the hook build. ⭐ **This resolves the plan's flagged `skills-for-role.sh:3` ambiguity: the extraction was `0052`, NOT `0063-reconcile-skill-ownership-source-of-truth`, which carries Priority 6.** Not `unresolvable`. |
| `46` | **`backlog/0046-…` — LIVE OPEN** | **`0058`** `investigate-mutation-testing-library-adoption` | `0037:47` names it in full. ⚠️ the worst landing, exactly as the brief warned |
| `47` / `48` | `done/0047-give-codex-the-universal-hard-rules` | **`0064`** `record-one-skill-one-output-convention` / **`0086`** `ship-one-skill-one-output-convention-in-scaffold` | `0137`/`0138` both describe it as *"architect writes the convention, coder ships the scaffold half"* — the exact `0064`/`0086` split |
| **`70`** | `done/0070-relax-tool-allowlists…` | **`0008`** `add-open-questions-interview-skill-for-six-roles` | ⭐ see §2.1 — **this overrides an explicit ⛔ in the brief** |
| `80` | `done/0080-report-backlog-board…` | **`0078`** `repair-stale-adr-029-stop-hook-links-in-the-vault` | `0013:74` carries the resolving link **right beside the numeral** |

### 2.1 ⛔ `task 70` — a brief instruction was OVERRIDDEN by owner ruling. Recorded as required.

**The brief says, explicitly:** *"`task 70` (cited by `0217`, `0226`) resolves **correctly** to
`done/0070-relax-tool-allowlists-except-adversarial-reviewer`. ⛔ Do not 'repair' it."*

**The owner overrode it at `0306`'s plan gate on 2026-08-15**, verbatim option label:
**"Repair the prose sites, leave the quotations (Recommended)"** — given via `AskUserQuestion` in the
live `fkit lead` session driving `/fkit-sprint-ship-loop`, and relayed to this Build step in its
declared-approval marker.

**The evidence the ruling turned on, re-verified first-hand this run:**

- The incident the numeral names is narrated in `claude/skills-for-role.sh:20-22`:
  *"Task 70 followed the two-item list precisely and still shipped a false statement into every
  consuming project (**scaffold/CLAUDE.md asserted the lead role has "only" two skills, which had just
  stopped being true**)."* — **a SKILL-mirror failure.**
- `0008` (Priority 70) **adds a skill to six roles including the lead** (`0008:55` — *"wiki, lead.
  **Not** the adversarial reviewer"*). That is precisely what makes *"the lead has only two skills"*
  stop being true.
- `0070` relaxes **tools, not skills**, and its own brief rules the skill mirrors out of scope in
  terms: `0070:82` — *"Any `fkit-team` / `README.md` mirror table — those track skills, not tools"* —
  and `0070:100` — *"**No `skills-for-role.sh` diff and no `fkit-team` / `README.md` mirror-table
  diff**"*. ⛔ **`0070` cannot be the task that followed the mirror checklist and shipped a false
  skill count.**
- Corroborating date: the *"FOUR mirrors"* warning block landed in commit `0ad055a` (2026-07-18), the
  same day the comment says the list stopped saying "TWO".

**Conclusion: the brief's counter-example fell into exactly the `NN` ↔ `00NN` coincidence trap this
task exists to catch.** Applied as ruled — prose repaired, quotations left with a key beside them.

---

## 3. Change surface, by shape

**38 files in `git diff --stat`. Two of them are NOT this task's** — see §7.

### Shape 1 — dead `ai-agents/sprints/sprint-N.md` (29 dead occurrences, 18 files)

**Repair applied: `ai-agents/sprints/sprint-N.md` → `ai-agents/sprints/done/sprint-N.md`, path only.**
Per the driver's OQ-3 answer (option a), every `:NNN` line-number suffix was left **byte-identical**;
migrating them to `§heading` anchors is `0171`'s job. **No site was a markdown link** (the only two
markdown-link forms point at the live `sprint-6.md`), so relative depth never entered — checked per
site, not assumed.

**19 occurrences repaired across 12 files:**

| file | n | class |
|---|---|---|
| `0013`, `0144`, `0146`, `0149`, `0168`, `0183`, `0187`, `0276` | 1 each | B — ordinary citation |
| `0270` | 2 | B |
| `0155` | 3 | B ×2 + **C** (`:120`, a runnable `dashboard.sh` command) |
| `0156` | 1 | **C** (runnable `dashboard.sh` command) |
| `0193` | 5 | B ×3 + **C** ×2 (`:154`, `:165`, both inside `git diff` verification commands — the reason `0193`'s brief could not be executed as written) |

**10 occurrences deliberately left. Every survivor named, with its reason — a bare count is not a
pass (V1′):**

| site | class | why it was left |
|---|---|---|
| `0176:115` | **D** quoted frozen record | the 8 residual files **as measured 2026-08-01**, when the board genuinely was at that path. Re-pointing would make the record say something the measurer did not measure. |
| `0176:203` | **D** quoted frozen record | inside the verbatim `0237` handback blockquote |
| `0236:1` | **E** subject-of-the-brief | it is the **H1 title**: *"Sweep the stale `ai-agents/sprints/sprint-2.md` prose paths"* |
| `0236:26` | **E** | *"moved the board **from** X **to** Y"* — re-pointing makes it say the board moved from where it already is |
| `0236:100` | **E** | names a **form** (`…:NNN`), not a path to follow |
| `0237:63` | **E** | *"…names `…/sprint-2.md` as one of its 8 files, **and that file no longer exists at that path**"* — re-pointing makes the sentence self-contradictory |
| `0306:176` | **excluded** | `0306`'s own brief, excluded from both sweeps by the driver's OQ-4 answer (option a) |
| **`0236:95`** | ⚠️ **UNRESOLVED — surfaced, not decided** | see §6 question 3 |
| `0234:113` | ⛔ **STOP** | class-C judgement call — see §6 question 1 |
| `0296:194` | ⛔ **STOP** | class-C judgement call — see §6 question 2 |

**Class A (live, left with no note, outside the 29):** `0154:159` and `0272:280`, both
`../../../sprints/sprint-6.md` markdown links to the **active** board.

**⭐ Class E was accepted by owner ruling** at the plan gate — verbatim option label **"Add class E —
leave byte-identical, note beside (Recommended)"**. The brief's Step-3 vocabulary (mis-resolving /
correct / quoted frozen record / unresolvable) has no slot for it, and without it this run would have
corrupted `0236` and `0237`. **Named here so the vocabulary is not silent.**

**Dated notes written beside the leave-class sites:** `0176`, `0236`, `0237` — each names the sites,
the reason, and where the board actually is today.

### Shape 2, `ai-agents/` half — 50 occurrences repaired across 7 files

**Form used:** `` `NNNN` (`folder-slug`) `` on the **first** occurrence of each numeral in each file,
bare `` `NNNN` `` on later occurrences in the same file. This is `0046`'s model and the plan's §3c
form; repeating the full slug 18 times in one file would be unreadable, and the durable half is the
ID. ⚠️ **`0171` (`durable-citation-anchors.md`) is still open** — this run names its own form, as the
plan's §7 requires, and does not claim to have set a convention.

| file | repaired | numerals |
|---|---|---|
| `0013` | 18 | `36`, `27`, `80`, `23` |
| `0045` | 12 | `27`, `28` |
| `0046` | 10 | `36`, `26` — **including the wrapped `task`/`36` at `:26-27`, repaired by hand** |
| `0037` | 6 | `36`, `43`, `46` |
| `0217` | 2 | `70` → `0008` (**the owner-ruled override, §2.1**) |
| `0137` | 1 | `47/48` |
| `0138` | 1 | `47/48` |

**9 occurrences deliberately left. Each named with its reason (V3′, V4):**

| site | why |
|---|---|
| `0046:101` | the `- **Depends on: task 36**` line — the dated correction beneath it states it is **left byte-identical**, and it is the line `dashboard.sh` parses |
| `0188:62`, `0226:37` | **verbatim quotations** of `skills-for-role.sh`'s warning block |
| `0226:41` | live prose, but the owner's OQ-1 ruling enumerated **only `0217`'s two prose sites**. ⛔ **A worker does not widen an enumeration on its own judgement.** Left, and keyed in `0226`'s note. **Surfaced — see §6 question 4.** |
| `0296:66` | **verbatim quotation of `0004`'s frozen cancellation reason** — the brief's own ⛔, upheld |
| `0213:81` | **verbatim quotation** of `fkit-wiki-lint/SKILL.md` step 8 |
| `0196:33`, `0302:159`, `0305:59` | **verbatim quotations of source comments** — see the coupling below |

**Dated notes written beside every left site:** `0188`, `0196`, `0213`, `0226`, `0296`, `0302`,
`0305`. Each gives the numeral → folder-ID key, names the coincidence landing it is **not**, and says
why the quotation is frozen. `0213` and `0226` additionally instruct: *when this task rewrites that
line for its own reasons, repair the numeral in the same pass* — a quotation is only frozen while it
is a quotation.

### Shape 2, `claude/` half — 12 occurrences repaired across 5 files

**`grep -riE '\btask 43\b' claude/` — before: 12. After: 0.** `` `0052` `` citations under `claude/`
after: **12.** ⛔ **Nothing under `claude/scaffold/`, before or after (0 / 0).**

| file | lines |
|---|---|
| `claude/fkit-claude.sh` | `:18`, `:254`, `:273`, `:282`, `:285`, `:292` |
| `claude/README.md` | `:30`, `:55`, `:159` |
| `claude/skills-for-role.sh` | `:3` |
| `claude/skill-ownership-hook.sh` | `:2` |
| `claude/skills/fkit-team/SKILL.md` | `:40` |

Two comment lines were **rewrapped** after the substitution — `fkit-claude.sh:18` and
`skill-ownership-hook.sh:2` — because the full form pushed them to 147 and 131 chars against a p95 of
103 and 102 in those files. **No other line was rewrapped:** in the markdown files the new lengths sit
at or under the file's existing p95, and >110-char lines are already ordinary in this corpus (440 of
20,580 lines in the untouched open briefs).

**⚠️ Deliberately NOT repaired, and reported rather than swept** — the owner's widening covered the
**`task 43` numeral only**: `claude/fkit-claude.sh:266` and `claude/skills-for-role.sh:20` (`Task 70`),
`claude/fkit-claude-init.sh:578` (`Task 36`), `claude/orphan-targets:7` (`task 36`),
`claude/skills/fkit-status/dashboard.sh:149/157/160` and `claude/skills/fkit-task-{done,cancelled}/SKILL.md`
(`task 67`). **Nobody should read the widening as a `claude/` sweep.**

### The quotation coupling — the run created this problem itself, and paid for it

Three open briefs quote the source comments this run repaired. **Repairing the source turns each into
a quotation of text that no longer exists.** Treatment, per plan §3d: **source repaired; each
quotation left byte-identical; a dated note appended recording the repair and the new wording.**

- **`0196:33`** quotes `fkit-claude.sh:282`. ⚠️ **Now stale.** Note written with the new wording.
- **`0305:59`** quotes `fkit-claude.sh:18`. ⚠️ **Now stale in wording AND line-wrap.** Note written
  with the new wording, and stating explicitly that the claim the evidence supports — *"denies any
  `Skill` call … at any spawn depth"* — **is unchanged**, so `0305`'s question is exactly as open.
- **`0302:159`** — ⭐ **the plan was wrong about this one.** It records the site as a quotation of
  `claude/skills-for-role.sh`. **It is a quotation of `test/prove-red.sh:347`**, which is out of
  scope and was not touched — so **that quotation is still accurate**. The note says so, and carries
  the `test/` residual from finding 6.

### Shape 3 — 4 rows repaired, 1 corrected, 1 skipped

**Form:** a dated correction as a **nested bullet beneath** the original, leaving every
`- **Depends on:**` line **byte-identical**. Model: `0224:231-235` and `0240:285-291`, both already on
disk.

| row | edge | discharged by | note |
|---|---|---|---|
| `0168` | `0160` | `done/0160-decide-the-durable-citation-form-for-mutable-coordinates/` | ⚠️ the **ruling** survives as a constraint on output, only the **wait** is gone |
| `0204` | `0202` (hard gate) | `done/0202-write-plan-md-at-plan-approval…/` | `0203` also closed; the line never made it a gate |
| `0223` | `0222` | `done/0222-record-adr-038…/` + ADR-038 on disk | the reason clause must still match the ADR |
| `0046` | `task 36` → `0072` | `done/0072-remove-fkit-omnigent-orphan-residue/` | **both shapes in one correction** — stale numeral *and* discharged edge; `orphan_contained()` confirmed at `claude/fkit-claude-init.sh:665` |
| `0194` | `0189`, `0190`, `0191` | `0190`, `0191` closed | ⛔ **`0189` STILL OPEN** (`🔲 Backlog`) — **this row stays BLOCKED.** Two nested corrections: one on the `Depends on:` line, one on the stale *"All three dependencies are open"* claim, which now names **`0189` alone**. Both leave the originals byte-identical. |
| **`0240`** | — | — | ⛔ **SKIPPED — already repaired at HEAD, both edges.** Re-repairing would duplicate a correction. |

⛔ **`0224`, `0225`, `0229`, `0271` not touched** — verified present and already-correct.

**Parse-shape guard held.** ⚠️ **But note an honest limitation:** for `0046` and `0168` the dashboard's
derive cell still shows only the **original** text (`depends="task 36"`, `depends="0160 — hard."`),
because both write the value *inside* the `**…**` span the parser reads, so the appended correction
falls outside it. `0223`, `0204` and `0194` do carry the correction into the cell. **No row is
`UNPARSEABLE` and every row still derives**, so V7′ passes — but **a reader of the `sprint-6` dashboard
alone still sees stale dependency text for `0046` and `0168`.** Recorded as a residual, not repaired:
fixing it means editing the byte-identical line.

---

## 4. Verification — results, with the corrections the brief's own steps needed

⭐ **Three of the brief's verification commands cannot pass as written.** Each was replaced; the
original and the defect are stated.

| step | defect | replacement | **result** |
|---|---|---|---|
| **V1′** | `grep -rE 'sprints/sprint-[0-9]+\.md'` also matches the **live** `sprint-6.md`, so it can never return "only justified survivors" | narrow to dead N; enumerate the live paths as justified | ✅ **PASS** — 19 repaired, 10 left, **all 10 named with reasons** in §3; the 2 live paths enumerated |
| **V2** | — | resolve each re-pointed path with `[ -f ]` | ✅ **PASS** — `done/sprint-2.md`, `done/sprint-3.md`, `done/sprint-4.md`, `done/sprint-5.md` all resolve; **0 dead** |
| **V3′** | `\btask ` is **case-sensitive** (misses 7 sites, all of `0188`) and **single-line** (misses `0046`'s wrapped `task 36`) | `grep -ohiE` **plus** the `tr '\n' ' ' \| tr -s ' '` joined pass | ✅ **PASS** — 50 repaired; **9 left, each named with its reason** (§3); **wrap check: joined == single in every open brief, 0 mismatches**; **no numeral left unclassified** |
| **V4** | — | `27/28/36/43` survive only inside justified quotations | ✅ **PASS** — `36` survives only at `0046:101` (declared byte-identical) and inside `0306`'s own correction text; `43` only in the three quotations; `27` and `28` have **no** survivors |
| **V5′** | brief's step is narrower than the owner's widening | before/after re-derived; forbidden paths asserted absent | ✅ **PASS** — `claude/` `task 43`: **12 → 0**; `claude/scaffold/`: **0 → 0**; `git diff --name-only` contains **nothing** under `test/`, `bin/`, `claude/scaffold/`, `ai-agents/wiki-vault/`, `tasks/done/`, `tasks/cancelled/`; **`claude/structure-manifest.tsv` absent from the diff**; `npm run generate:manifest` **not run**. **`npm test` — see §5.** |
| **V6′** | brief runs the dashboard over `backlog.md` only, but **4 of the 5 Shape-3 rows derive on `sprint-6.md`** | run **both** boards; compare against the §1 baselines; **anchored greps only** | ✅ **PASS** — exit `0` on both; `^drift ` **0 → 0** on both; `^derive .*UNPARSEABLE` **0 → 0** on both. **The full non-table dashboard output is byte-identical before/after apart from exactly the three derive cells this task intended to change** (`0194` on `backlog`, `0223` and `0204` on `sprint-6`). ⛔ `grep -F` on the bare token was never used — the dashboard echoes rows verbatim, so prose that *mentions* the token matches its own documentation (bare `grep -c drift` returns **24**, bare `UNPARSEABLE` returns **2**, on an untouched board). |
| **V7′** | brief names five rows; **`0240` needs no repair** | four rows repaired; `0240` verified unchanged | ✅ **PASS** — `0168`, `0204`, `0223`, `0046` each render exactly **1** `^derive` line on `sprint-6.md`; `0194` renders **1** on `backlog.md`; **none `UNPARSEABLE`** |
| **V8** | — | `0194` still reads blocked, on `0189` alone | ✅ **PASS** — nested correction names `0189` alone and says ⛔ *"This row is still BLOCKED. Do not mark it ready."* `0189` re-verified `🔲 Backlog` on disk |
| **V9** | — | no `brief.md` under `0224`, `0225`, `0229`, `0271`, **or `0240`** | ✅ **PASS** — `git diff --name-only` matches none of the five |
| **V10** | — | no `tasks/done/`, no `tasks/cancelled/`, no `## Status` line, no new `sprint-6.md` change | ✅ **PASS** — `git diff -U0 \| grep '^[+-]## Status'` is **empty**; `git status --porcelain` shows no `done/` or `cancelled/` path; `sprint-6.md`'s modification is the **pre-existing** one (§7) |
| **V11′** | inverted per the master correction | both halves stated; `claude/` before/after re-derived; every deliberate survivor named | ✅ **PASS** — §3. **Honest residual, stated: repairing these 12 comments removes today's seed, but NOTHING ENFORCES the durable citation form, so the class can return. That is `0171`'s job. This task does not claim otherwise.** |
| **V12** | — | drift table both directions + the four re-measurement findings | ✅ **PASS** — §1 |

---

## 5. `npm test`

`package.json` runs `node --test test/*.test.js && bash test/prove-red.sh`.

**Run TWICE — once after the build, once after the owner's four rulings of 2026-08-15 were applied.
Both runs green. The second run is the authoritative one and is what is recorded here.**

✅ **GREEN — run to completion, exit code `0`.** Both halves:

- `node --test test/*.test.js` — **`pass 730`, `fail 0`, `cancelled 0`, `skipped 0`, `todo 0`.**
- `bash test/prove-red.sh` — **`✓ hard gate PASSED — real + unmutated copy green; each mutation reds
  its NAMED assertion.`** All 11 baselines (`0a`–`0k`) green; all 22 mutations (`1`–`22`) red at their
  named assertion. **No mutation reported `✗ MUTATION WAS A NO-OP`** — which matters here, because
  mutations 1 and 2 `sed` into `claude/skills-for-role.sh` and `claude/fkit-claude.sh`, two of the
  five files this run edited. **The edits did not break the mutation seams.**

**⚠️ Why a green run here is weak evidence, stated rather than glossed:** this task changed **comments
and markdown only**. No test asserts on any string this run altered — checked directly:
`grep -rnE "task 43|Retired here|Extracted from" test/` returns only test files' **own** comments and
two frozen fixtures, never an assertion. `prove-red.sh`'s mutations `sed` on **code** lines
(`^([ \t]*reviewer\)…`, `^  exit 2$`), not on the comment lines touched here. **Green confirms nothing
was broken; it does not confirm the repairs are correct.** The repairs' correctness rests on §2's
two-independent-proofs-per-numeral, not on the suite.

**Why a green run here is weak evidence, stated rather than glossed:** this task changed **comments
and markdown only**. No test asserts on any string this run altered — checked directly:
`grep -rnE "task 43|Retired here|Extracted from" test/` returns only test files' **own** comments and
two frozen fixtures, never an assertion. `prove-red.sh`'s mutations `sed` on **code** lines
(`^([ \t]*reviewer\)…`, `^  exit 2$`), not on the comment lines touched here.

---

## 6. The four surfaced judgement calls — ALL RULED AND APPLIED

The Build step stopped at four sites and returned `NEEDS-DECISION` rather than deciding them. **The
owner ruled all four on 2026-08-15** via `AskUserQuestion` in a live `fkit lead` session driving
`/fkit-sprint-ship-loop`, relayed by the driver. **Each ruling is a selection from an option list, so
the option label is the verbatim text.** The Build step's recommendation was taken in all four cases.

| # | site | ruling — verbatim option label | applied |
|---|---|---|---|
| 1 | `0234:113` | **"Leave it, dated note beside (Recommended)"** | site byte-identical; dated note in `0234`'s `## Notes` |
| 2 | `0296:194` | **"Leave it, dated note beside (Recommended)"** | site byte-identical; dated note in `0296`'s `## Notes` |
| 3 | `0236:95` | **"Re-point to `done/sprint-3.md` (Recommended)"** | re-pointed; `0236`'s note rewritten from *unresolved* to *re-pointed by ruling* |
| 4 | `0226:41` | **"Repair it to `0008`, consistent with the ruling (Recommended)"** | repaired; `0226`'s note rewritten |

**1. `0234:113`** — *"Run the dashboard over **all four live boards** — `sprints/backlog.md`,
`sprints/sprint-3.md`, …"*. `sprint-3` is archived, but re-pointing the path alone leaves **"live"**
false and **"four"** unverified — both are the step's substance, so correcting them is `0234`'s call.
**Left byte-identical.** The note names the dead path, gives its archived location, says why a
re-point would not have been a fix, and tells the next runner to resolve the board list against
`ai-agents/sprints/` first (live today: `backlog.md`, `sprint-6.md`).

**2. `0296:194`** — the `for b in … sprints/sprint-5.md sprints/done/sprint-*.md` loop. ⭐ **The loop
is not broken:** the `done/sprint-*.md` glob already matches `done/sprint-5.md`, so every intended
board is still scanned and the dead literal simply contributes nothing. Re-pointing would make the
loop scan that board **twice**; deleting the term is a semantic edit to someone else's command.
**Left byte-identical.** ⚠️ The note additionally records a defect nobody had flagged: **the loop omits
`sprint-6.md` entirely** — it did not exist when the brief was written — so the reverse sweep would
not cover the **active** board.

**3. `0236:95` — ⭐ AN EXPLICIT CLASS-E ENUMERATION IN THE APPROVED PLAN WAS OVERTURNED.** Recorded as
such, with the reason. The plan's §2 listed this site as class E ("subject-of-the-brief mention,
re-pointing destroys its meaning"). **The plan's own class-E definition never covered it:** the matched
string is **`ai-agents/sprints/sprint-3.md`** — a **file the implementer is told to open and read** —
not the `sprint-2.md` that this brief's sentences are *about*. The plan appears to have assumed the
match was `sprint-2.md`. Under the plan's own rule the site is class **B**. ⛔ **The Build step left it
byte-identical and flagged it rather than acting**, because a worker does not overturn an explicit
enumeration on its own judgement; **the owner then overturned it.** Verified before and after:
`ai-agents/sprints/done/sprint-3.md` exists **and still contains the literal old path (2
occurrences)**, so the bullet's claim is as true as it was and now resolvable too.

**4. `0226:41` — ⭐ THE OQ-1 ENUMERATION WAS WIDENED, AND THE WIDENING IS THE OWNER'S, NOT THIS RUN'S.**
Recorded as such. The 2026-08-15 plan-gate ruling on OQ-1 named **only** `0217:32` and `0217:92` as the
live-prose `task 70` sites to repair. `0226:41` is also live prose and was in neither list, so the
Build step left it and surfaced it. **The owner's second ruling of 2026-08-15 extends the
`task 70` → `0008` repair to cover it.** ⛔ **This is NOT licence to sweep further `task 70` sites.**
Before applying it the Build step re-enumerated the whole class: **the spaced `\btask 70\b` population
in open briefs is exactly `0188:62` (quoted), `0217:32`, `0217:92` (repaired), `0226:37` (quoted),
`0226:41` (repaired by this ruling), and `0306:118`/`:233` (excluded). There is NO third live-prose
site.** The class is closed, not inferred.

### ⛔ A NEW FINDING the widening surfaced — NOT swept, surfaced

**A hyphenated `task-NN` form exists that NO measurement in this task ever counted** — not the brief's,
not the plan's, not the build's. `\btask [0-9]{1,2}\b` cannot match it. **7 occurrences across 4 open
briefs:**

| site | reads | resolves to |
|---|---|---|
| `0226:41`, `0226:161`, `0226:186` | `task-70` | `0008` |
| `0037:24` | `pre-task-18` | *(unresolved — `18` not triaged by this task)* |
| `0156:120` | `task-68` | *(unresolved — `68` not triaged by this task)* |
| `0184:165` | `task-84` | *(unresolved — `84` not triaged by this task)* |

⭐ **`0184` was in no Shape-2 file list anywhere** — not the brief's 13, not the build's 14. It is a
**fifth** file carrying a stale numeral, visible only in this form.

⛔ **NOT REPAIRED.** `task-NN` is outside the class the brief, the plan, the owner's rulings and every
measurement in this task were defined on. Sweeping it would be inferring a pattern the owner did not
rule on — the exact move the driver's instruction forbids. **Recorded here and in `0226`'s dated note
so the class is not re-discovered a fourth time.** It is a candidate follow-up task, not this task's
work.

---

## 7. Working-tree honesty

**Two of the 38 modified files are NOT this task's, and were already modified when the run started:**

- `ai-agents/sprints/sprint-6.md` — one row-description change, present at session start. ⛔ **Not
  edited by this run** (the driver's hard rules forbid it).
- `ai-agents/tasks/backlog/0306-…/brief.md` — present at session start. ⛔ **Excluded from both
  sweeps by name**, per the driver's OQ-4 answer (option a): it carries **16 `task 43`**, plus
  `23`/`26`/`27`/`28`/`36`/`46`/`47`/`70`/`80` and one `sprints/sprint-2.md` — **all of it the
  specification of the defect.** Repairing it would erase the task's own description of what it
  repairs. **Verified untouched: it appears in `git status` exactly as it did at session start.**

`plan.md` is untracked (`??`) and was **not** re-authored — the driver wrote it at approval.

⛔ **`git stash` was banned for this run and was not used.** No `git add`, no commit, no push.

---

## 8. Decision log — what was done without asking, and why it qualified

Per ADR-019 `:96` (the audit obligation that transfers with the autonomy) and ADR-020's worklog
decision log. **Standing approval:** the owner-approved plan carried in the Build spawn's
declared-approval marker.

| # | what | which finding/step it answers | why it qualified |
|---|---|---|---|
| 1 | Repaired 19 Shape-1 occurrences across 12 files | plan §2, classes B and C | verified `CORRECT` (each path checked with `[ -f ]`), mechanical, **inside the approved plan** |
| 2 | Repaired 50 Shape-2 occurrences across 7 `ai-agents/` files | plan §3, owner's OQ-5 widening | verified `CORRECT` (Priority index + a second independent proof per numeral, §2), mechanical, **in plan** |
| 3 | Repaired 12 `claude/` occurrences across 5 files | plan §3d | verified `CORRECT`, mechanical, **in plan** |
| 4 | Wrote 4 Shape-3 dated corrections + 2 on `0194` | plan §4 | verified `CORRECT` (every target folder located on disk), localized, **in plan** |
| 5 | Skipped `0240` | plan §4, re-measurement finding 4 | the plan **instructs** the skip; re-verified on disk before honouring it |
| 6 | Wrote 10 leave-class dated notes (`0176`, `0188`, `0196`, `0213`, `0226`, `0236`, `0237`, `0296`, `0302`, `0305`) | plan §2 classes D/E, §3d coupling | **in plan** — the plan and the owner's OQ-2 ruling both require a note beside every left site |
| 7 | **Obvious winner** — used the **disk** folder slug `0006-add-launcher-contract-smoke-script` where the plan wrote `0006-add-launcher-contract-test-suite` | finding 5 | the plan's slug does not exist on disk; writing it would ship a **dead** anchor into a task whose whole purpose is durable anchors. One option dominates; **within the plan's intent** |
| 8 | **Obvious winner** — resolved `skills-for-role.sh:3` to `0052` rather than classifying it `unresolvable` | plan §3d's flagged ambiguity | git shows the file was **created in the hook build's own commit** (`13f3e30`); `0063` carries Priority 6, not 43. The plan asked for exactly this check and named `unresolvable` only as the fallback if it failed. It did not fail. |
| 9 | **Obvious winner** — resolved `prove-red.sh`'s `task 23` provenance to `0006` | plan §3b's flagged *"not yet proven"* | git shows `prove-red.sh` created in the same commit as the launcher-contract suite (`c441d97`); ADR-014 names task 23 as that build. The plan asked for the check; it passed. |
| 10 | Rewrapped 2 shell comment lines after substitution | plan §3d | cosmetic, localized, keeps the files inside their own p95 comment width; no semantic change |
| 11 | Chose *full form on first occurrence per file, bare ID after* | plan §3c / §7's `0171` requirement | the plan's form, applied readably; **named here** as the plan's §7 requires, and not claimed as a convention |
| 12 | Applied the owner's four 2026-08-15 rulings (§6) | the four surfaced judgement calls | **not autonomous — each was ruled by the owner** after this step returned `NEEDS-DECISION`. Recorded here for completeness of the audit trail, not as an unattended action. |
| 13 | ⛔ **Declined to sweep the hyphenated `task-NN` form** (7 occurrences, 4 files, incl. the previously-invisible `0184`) | §6's new finding | **the opposite of an autonomous action** — the driver's instruction was to stop and surface rather than infer the pattern a second time. Surfaced in §6 and in `0226`'s note. |

**⛔ NOT done without asking — four judgement calls stopped and surfaced instead:** the two class-C
sites (`0234:113`, `0296:194`), the `0236:95` enumeration conflict, and the unenumerated `0226:41`.
**All four are in §6.**

### 8.1 Review round 1 — fixes applied WITHOUT asking, and why each qualified

**Standing approval:** the same owner-approved plan, carried in the Process-review spawn's
declared-approval marker. **Discipline applied:** apply without asking only when verified `CORRECT`,
mechanical/localized, and inside the approved plan; stop and surface every judgement call. **Each
finding below was verified against disk FIRST** — none was applied on the reviewer's say-so.

| # | finding it answers | what changed | why it qualified |
|---|---|---|---|
| 14 | **R1** — self-contradictory dated note | `0226/brief.md` `## Notes`: the note's headline no longer claims *both* `Task 70` mentions were left byte-identical; it now says one was repaired and the rest left, and a closing bullet records the correction and what it first said | verified `CORRECT` on disk — the headline at `:200` and its own bullet at `:205` contradicted each other. Text-only, one note, **in plan** (§3's *"a dated note beside every left site"*). ⛔ No `Task 70` / `task-70` string in `## Context` was rewritten |
| 15 | **R2** — wrong stated reason at `0296` | `0296/brief.md` `## Notes`: *"simply contributes nothing"* replaced with the measured behaviour — `grep` on the missing file **warns on stderr and exits `2`**, a status this pipeline **discards** — and the tie to this brief's own **Trap 2**. **The leave-it DECISION is unchanged** and the loop site stays byte-identical | verified `CORRECT` by direct test: `grep -oE zzz ./nonexistent.md` → stderr warning, `exit=2`. Text-only, one note, **in plan** (the owner-ruled *"Leave it, dated note beside"* stands; only its reasoning was wrong). ⚠️ Stated precisely rather than borrowed: no false `DEAD:` line is produced **here**, because the resolution test is `[ -f ]` and is never reached for the dead term |
| 16 | **R3** — itemisation that did not sum | `0302/brief.md` `## Notes` **and** worklog §1 finding 6: *"×14"* → **×16 (8 each)**, with `4 + 4 + 1 + 16 = 25` shown | **re-derived from disk, not taken from the reviewer**: `grep -oiE '\btask 43\b'` per file gives `prove-red.sh` 4, `launcher-contract.test.js` 4, `skill-ownership-hook.test.js` 1, each fixture **8**; `grep -roiE` over `test/` totals **25**. Arithmetic, localized, **in plan**. ⛔ `test/` still untouched |
| 17 | **R4** — botched substitution | `0037/brief.md:47`: `` `0058` (`slug`)** (`slug`) `` → `` `0058`** (`slug`) `` | verified `CORRECT` against `HEAD`, which read `` folded into task 46** (`investigate-mutation-testing-library-adoption`) `` — the descriptive name was **already** outside the bold, so the bare ID was the right substitution and the line still carries the full form. Mechanical, one line, **in plan** |
| 18 | **R5, the disclosure-distance half only** | `0226/brief.md` `## Context`: a short blockquote added **immediately beneath the repaired sentence**, stating that *"task-70"* and *"`0008`"* name the same task, that the hyphenated form was deliberately left, and where the full note is | the **string** `task-70` was **NOT** rewritten — the owner ruled the whole hyphenated class into a follow-up brief. Only the 170-line gap between the mixed-naming sentence and its disclosure was closed; additive, localized, **in plan** (the plan's own *"note beside"* treatment). ⚠️ **If that read of the ruling is wrong, this blockquote is the only thing to revert** |

⛔ **NOT applied — ruled by the owner into follow-up briefs, not fixed here:** **R6** (`0046`/`0168`
dashboard derive cells) and **R7** (`claude/`'s surviving `Task 70` / `Task 36` / `task 67` seeds).
Both are now in §9 Residuals. ⛔ **No `Depends on:` / `Blocks:` line was touched** — R6's fix would
require editing exactly the byte-identical line this task promised not to edit. ⛔ **This step filed no
task folders**; filing is producer-only and the driver routes it.

⛔ **Nothing in `plan.md` was amended.** The rulings land in `review.md` and here, as instructed.

**⛔ NOT done — scope held:** `test/`'s 25 stale `task 43` (finding 6), and `claude/`'s `Task 70` /
`Task 36` / `task 67` numerals. Both reported, neither swept.

---

## 9. Residuals, stated plainly

1. ⚠️ **Nothing enforces the durable citation form.** This run removed today's seed; it did not close
   the class. `0171` (`conventions/durable-citation-anchors.md`) is still `🔲 Backlog` and the file
   does not exist. **The decay can return tomorrow.**
2. ⚠️ **`test/` still carries 25 stale `task 43` occurrences**, 14 of them in frozen fixtures that
   must never be edited. Out of scope; unfixed.
3. ⚠️ **`0046` and `0168` still show stale dependency text in the dashboard's derive cell** — their
   corrections fall outside the `**…**` span the parser reads. Not `UNPARSEABLE`; not repaired,
   because fixing it means editing a line declared byte-identical.
   ⭐ **Round-1 review (R6) raised this to a real gap, not a cosmetic one, and it is right:** for
   `0046` the board **still prints `depends="task 36"`** — the exact mis-resolving numeral this task
   exists to eliminate — and `0168` still prints `depends="0160 — hard."`. The board **is** the surface
   the brief's rationale is about (*"the row presents as blocked to anyone skimming the board"*), so
   Shape 3's stated purpose is **not met on that surface for 2 of the 4 repaired rows**.
   ⛔ **Owner ruling 2026-08-15, verbatim option label: "File a follow-up task (Recommended)."** Not
   fixed here. **A follow-up brief is owed** — the fix means either editing the byte-identical
   `- **Depends on: …**` span or teaching `dashboard.sh` to read the nested correction. ⛔ This step
   did not file it; filing is producer-only.
4. ✅ **The four surfaced judgement calls are all ruled and applied** (§6) — **no site is left
   undecided.** Every deliberate survivor in this task now carries a stated reason.
4b. ⚠️ **A hyphenated `task-NN` form is still stale and unswept** — 7 occurrences across `0037`,
   `0156`, `0184`, `0226`, including **`0184`, a file no Shape-2 list ever named.** Outside this
   task's measured class by definition; deliberately not swept. **§6.**
   ⛔ **Owner ruling 2026-08-15, verbatim option label: "File a brief for the whole hyphenated class
   (Recommended)."** **A follow-up brief is owed for the whole class.** ⛔ Round-1 review raised
   `0226:41` (R5) as a half-repaired sentence naming one referent two ways; **the string was NOT
   rewritten** — it belongs to the class the owner just ruled into that follow-up. What was fixed is
   only the **distance**: the disclosure now sits beside the sentence as well as under `## Notes`
   (§8.1 #18). ⛔ This step did not file the brief; filing is producer-only.

7. ⚠️ **`claude/` still carries 10 stale non-`task 43` numerals across 7 files — the live seeds this
   whole decay class grows from.** Round-1 review (**R7**) is right that they appeared only in §3, not
   in the residual list a closing reader consults. **Re-derived on disk this step**
   (`grep -rniE '\btask ?-?(70|36|67)\b' claude/`, `claude/scaffold/` excluded):

   | site | reads | means |
   |---|---|---|
   | `claude/skills-for-role.sh:20` | `Task 70` | `0008` — ⭐ **the seed this task's own `task 70` → `0008` argument rests on** |
   | `claude/fkit-claude.sh:267` | `Task 70` | `0008` (the same warning block, mirrored) |
   | `claude/fkit-claude-init.sh:578` | `Task 36` | `0072` |
   | `claude/orphan-targets:7` | `task 36` | `0072` |
   | `claude/skills/fkit-status/dashboard.sh:58` | `task 36` | `0072` |
   | `claude/skills/fkit-status/dashboard.sh:149`, `:157`, `:160` | `task 67` / `Task 67` | *(unresolved — `67` was never triaged by this task)* |
   | `claude/skills/fkit-task-done/SKILL.md:195`, `fkit-task-cancelled/SKILL.md:202` | `task 67` | *(unresolved — same)* |

   ⚠️ **§3's list of these was itself incomplete** — it named `dashboard.sh:149/157/160` but **missed
   `dashboard.sh:58`** (`task 36`). Corrected here. ✅ **`claude/scaffold/` carries none of them (0).**
   ⛔ **Correctly out of scope** — the owner's widening covered the **`task 43` numeral only**, and
   nobody should read that widening as a `claude/` sweep. ⛔ **Owner ruling 2026-08-15, verbatim option
   label: "Name them in Residuals, then file a follow-up (Recommended)."** Named here; **a follow-up
   brief is owed**. ⛔ This step did not file it; filing is producer-only.
5. ⚠️ **`0194` remains BLOCKED on `0189`.** This task corrected the record; it did not unblock the row.
6. ⚠️ **The `0196` and `0305` quotations are now knowingly stale.** That is the accepted cost of
   repairing the source, and each carries a dated note giving the new wording. **`0302`'s is not
   stale** — it quotes `test/`, which was out of scope.
