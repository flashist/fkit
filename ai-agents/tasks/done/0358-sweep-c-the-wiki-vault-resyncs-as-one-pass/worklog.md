# Worklog — 0358, Sweep C: the wiki-vault pass, SIX members

**Worker:** `fkit-wiki`, spawned Build worker under `fkit-sprint-ship-loop` (no owner channel — ADR-021).
**Approved plan:** `plan.md`, blob `f0b3df5b4ef4f0f77cc4f1342737d6178d3496ef` — **verified by this
worker** with `git hash-object` before any write. The bytes carried by the driver match the file.

⚠️ **Citation discipline binding this file** (plan §2.3): no coordination-document path is ever
followed by a colon and a line number, anywhere, inside backticks or out. The citation guard does
**not** mask inline code spans, so backticks are not a shield. Positions inside `log.md` are recorded
as four fields — dated heading · a durable attribute of the entry · the quoted fragment found ·
what the member claimed.

---

## 2026-09-05 — Step 0a: the hard gate, re-measured not inherited

```
$ node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

**Gate PASSED** — both green, 0 fail, 0 skip. Matches the driver's plan-time reading of 41/41; it was
re-run, not quoted.

## 2026-09-05 — Step 0b: the named baseline

```
$ git rev-parse --short HEAD
cf289c2
```

Full SHA `cf289c26394526ff2601800aa8f40d1873f370ba`.

**The tree at baseline is large and mostly NOT this worker's.** Excluded from my diff by name:

- Sweep B's staged renames and its seven ADR correction notes (committed in `cf289c2`)
- `0357`'s and `0361`'s closed folders, and `0361`'s untracked `plan.md` / `review.md` / `worklog.md`
- `ai-agents/knowledge-base/decisions/adr-046-…` — untracked, new this session
- `0363` / `0376` amendments; `0377` / `0378` new briefs
- working-tree modifications to `adr-003` and `adr-037`
- `test/closed-rank-immutability.test.js` (modified by `0361` phase 2)
- board edits to `backlog.md`, `sprint-7.md`, `done/sprint-2.md`

**My diff is exactly two things:** files under `ai-agents/wiki-vault/`, and this task's own folder.

## 2026-09-05 — Step 1: membership FROZEN, before any write

All six re-read from each brief's own `## Status` header this turn:

| ID | Status | Owner | Board | Act |
|---|---|---|---|---|
| `0199` | 🔲 Backlog | fkit-wiki | `backlog.md`, unranked | page resync — ADR-010 vault page + `index.md` |
| `0239` | 🔲 Backlog | fkit-wiki | `backlog.md`, unranked | page resync — ADR-012 vault page |
| `0287` | 🔲 Backlog | fkit-wiki | `backlog.md`, unranked | page resync — Codex-sandbox pages |
| `0317` | 🔲 Backlog | fkit-wiki | `backlog.md`, unranked | `log.md` append — reconcile `0238`'s flag |
| `0319` | 🔲 Backlog | fkit-wiki | `backlog.md`, unranked | `log.md` append — discharge `0206`'s flag |
| `0212` | 🔲 Backlog | fkit-wiki | `backlog.md`, unranked | `log.md` append — the `"still open"` framing |

⭐ **The brief's own taxonomy is wrong and the plan's correction is confirmed on measurement.** The
brief calls this five page resyncs plus one append. It is **3 appends / 3 page resyncs**. Operational
consequence: the append-only proof is a verification for **three** members, taken **after each
append**, never once at the end.

⛔ `0212`'s membership is owner-ruled (2026-08-29) and was not re-taken here. `0317` and `0319` stay
distinct — owner-ruled, label verbatim *"File its own row (Recommended)"*, reason *"DIFFER IN KIND"*.

---

## 2026-09-05 — Step 2: per-member re-verification, firsthand

### The two upstream checks

| Member | Upstream | Measured this turn | Consequence |
|---|---|---|---|
| `0239` | `0232` | ✅ **LANDED** — in `ai-agents/tasks/done/`, `## Status` reads `✅ Done (agent-closed — not owner-verified)` | `0239` **unblocked** |
| `0287` | `0273` | ⛔ **NOT LANDED** — in `ai-agents/tasks/backlog/`, `## Status` `🔲 Backlog` | ⛔ `0287` **STILL BLOCKED** |

`0287`'s substance re-measured, not inherited:

```
$ grep -ro -- '--sandbox read-only' claude/ | wc -l
6
$ grep -ro -- '--sandbox workspace-write' claude/ | wc -l
0
```

**Six `read-only` call sites, zero `workspace-write`.** The shipped state `0273` exists to change has
not moved. ⛔ **`0287`'s vault pages are left ALONE** — resyncing them now would write a page wrong in
a new way, which is the exact failure its brief's step 2 exists to prevent. Reported, **not closed**.

⚠️ Measurement taken **once**, here, per plan §11 item 10. It is not re-taken later to reach a
closable answer.

### `0199` — reproduces

Two sites, both found:

- **`index.md`, the `0140` row** — quoted fragment found: *"**ADR-010 deliberately left alone** — a
  dated correction note is the sanctioned fix, and it is still open"*. Claim reproduces.
- **ADR-010's vault page, its *"This page is NOT the full resync"* block** — names `0199` as still
  owing the legend, the *"left byte-identical"* clause, the below-the-claim placement rule with its
  rationale, and the §Decision 5 contradiction as history. Claim reproduces.

⭐ **And the page is stale in a way the brief could not have predicted, because ADR-010 kept being
appended to.** Measured against the working-tree ADR this turn:

| Vault page says | Measured on disk today |
|---|---|
| *"FIVE dated correction blocks"* | **10** |
| *"a `- **Corrections:**` header item that carries TWO site lists"* | **four** site lists |

The brief's own figures (five blocks, two site lists) were true on 2026-08-03 and are now stale —
`0197` (sweep `0356`) and `0196` (sweep `0357`) each appended more. The brief's `⚠️ Ordering matters`
constraint anticipated exactly this: *"If `0195` / `0196` / `0197` land before this runs, the page
must describe **that** state."* They have. The page describes that state.

ADR-010 `Status` on disk: `accepted`. Unchanged, as item 6 requires.

### `0239` — reproduces

ADR-012's vault page §Decision 1 still reads *"`skills_for_role()` in `claude/fkit-claude.sh` is the
**only** place role→skill ownership is expressed"*. On disk `skills_for_role()` lives in
`claude/skills-for-role.sh`. The landed ADR carries **5** dated correction notes from `0232`
(2026-09-03, inside sweep `0356`) — at §The live bug, §Decision 1, §Decision 2, §Consequences and
§Related. The vault page records **none** of them. Claim reproduces.

⭐ Re-derived from the **landed ADR**, not from `0239`'s brief, as its own constraint requires.

### `0317` — reproduces; verdict **discharged**

`0238`'s two substantive conditions, both re-measured today:

**(a) Literal pre-archival path `ai-agents/sprints/sprint-2.md` in the vault:**

```
$ grep -rl 'ai-agents/sprints/sprint-2\.md' ai-agents/wiki-vault/ --include='*.md' | wc -l
6
$ grep -ro 'ai-agents/sprints/sprint-2\.md' ai-agents/wiki-vault/ --include='*.md' | wc -l
26
```

**6 files, 26 occurrences — the SAME 6 files measured 2026-08-22. The count has not moved.** The list,
with disposition (a count without a list fails this member's step 4):

| Site | Occ | Disposition |
|---|---|---|
| `log.md` | 20 | Frozen dated entries. Append-only; corrected by appended note, never edited |
| ADR-034's vault page | 1 | **Historical** — describes a past sweep's 12-file set |
| ADR-037's vault page | 1 | **Historical** — a dated 2026-07-27 instance |
| `specify-and-support-the-reverse-move-sprint-to-backlog` | 1 | **Historical** — a dated 2026-08-03 command transcript |
| `sprint-2-remove-omnigent` | 3 | `**Source**:` already annotates *"(archived 2026-08-06; was …)"*; other two are dated command transcripts |
| `sprint-3-close-the-rank-integrity-loop` | 1 | **Meta** — names the string as prose |

⛔ **None is a live pointer.** These are the six named pre-archival-path instances the 2026-08-07 entry
warned about; ⛔ not re-fixed, per that warning and this member's own constraint.

**(b) A live claim that Sprint 2 is the active board — whitespace-normalised:**

```
$ cat <file> | tr '\n\t' '  ' | tr -s ' ' | grep -oiE "(Sprint 2 is (the )?(current|active)[^.]{0,60}|(current|active) sprint[^.]{0,20}Sprint 2)"
```

One hit, in `log.md`, reading *"Sprint 2 is active or that the board lives at the old path"* — that is
**the check's own description of itself**, not a claim. ⭐ **Zero live active-Sprint-2 claims.**

⚠️ **Stated limits of the normalised form**, per `durable-citation-anchors`: it does not catch a claim
split across table cells, one carried by wording drift, one broken by inline emphasis, or one inside a
code fence. The result is a floor, and is reported as one.

**`ai-agents/sprints/sprint-3.md` does not exist:**

```
$ ls ai-agents/sprints/
backlog.md  done  reviews  sprint-7.md
```

The active board is **Sprint 7** — not Sprint 6, which is what was true when `0317`'s brief was
written. Re-measured, and the difference is recorded rather than smoothed.

### `0319` — reproduces; verdict **discharged**

Both flag lines still stand, byte-identical, and the contradiction reproduces:

- The **`2026-08-03 — sync`** entry, at the second of its two run-ending flag lines — quoted fragment
  found: *"Task 0206's vault work is complete — ready to close"*.
- The **`2026-08-06 — ingest (sync)`** entry, at its run-ending flag line — quoted fragment found:
  *"Task 0206: partial — not ready to close"*.

Nothing has withdrawn either. The **`2026-08-22 — ingest (sync)`** entry records the tension without
resolving it — *"`0206`'s deliverable was verified present this run; `0238`'s literal acceptance text
was **overtaken, not met**"* — which is precisely the outcome `0319`'s step 3 forbids repeating.

⚠️ **`0206` has since CLOSED** — it is in `ai-agents/tasks/done/`. That is what makes the standing
flag stale rather than contested.

**`0206`'s five substantive checks, answered individually, site by site** (a "looks covered" fails
this member's step 7). Page: `wiki/tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement`.

| # | `0206`'s check | Measured today | Verdict |
|---|---|---|---|
| 1 | A vault page covers the faithful-carry report | Page exists; cites `…/reports/2026-08-02-faithful-carry-of-an-approved-plan.md` (1 occurrence) | ✅ present |
| 2 | Carries **checkable vs testimony** explicitly | Normalised match found — *"checkable-vs-testimony"* and *"checkable detail inside the testimony"* | ✅ present |
| 3 | States `carried-not-approved`, and that `0202` does not close it | Heading found: *"⛔ The accepted residual `carried-not-approved` — open, structural, and NOT closed by `0202`"* | ✅ present |
| 4 | Back-links `0162`'s brief at its **current** `done/` path | `**Source**:` reads `ai-agents/tasks/done/0162-decide-the-construction-…/brief.md` | ✅ present |
| 5 | Any pre-existing link to `0162`'s old `backlog/` path repaired or reported | Raw scan: 0 hits. Normalised scan across every vault file naming `0162`: 0 hits | ✅ absent |

⚠️ **Same stated limits** on the step-5 absence half as above — the normalised form is a floor, blind
to table-cell splits, wording drift, inline emphasis and fenced text.

**All five reproduce as present. `0206`'s flag is STALE, not contested → verdict `discharged`.**

### `0212` — reproduces; both target entries disambiguated WITHOUT a line number

⭐ **Plan §11 item 2's stop condition was tested first and it did not fire.** Both roll-ups reproduce
on two distinct `2026-07-26 — ingest (sync)` entries:

- The entry whose roll-up records **161 pages** (`0 features · 8 systems · 33 decisions · 120 tasks`)
- The entry whose roll-up records **166 pages** (`0 features · 8 systems · 33 decisions · 125 tasks`)

No fallback to a line number was needed, and none was written.

| Entry (by roll-up) | Flagged item | Quoted fragment found | Reproduces? |
|---|---|---|---|
| **161 pages** | ADR-010 stale-text | *"The sanctioned fix is a **dated correction note**, an architect call, **still open**."* | ✅ yes |
| **166 pages** | ADR-029 §Decision 6 | *"the sanctioned fix is task `0143`'s dated-correction-note form, **still open**."* | ✅ yes |

**Set re-derived at run time:**

```
$ grep -o "still open" ai-agents/wiki-vault/log.md | wc -l
23
```

**23 hits. Only the two above assert `0143`'s fix is unshipped.** The other 21 refer to unrelated open
items — the sync procedure's structural blind spot, `prove-red`'s R2 no-op mode, the missing
`dual-home-parity` test, standing earlier-entry flags, `0288`, `0300`, `0171`, `0176` — and are
**correct as written and left alone**, as the brief instructs.

**The corrected facts, re-measured:**

- `0143` — `ai-agents/tasks/done/`, `✅ Done (agent-closed — not owner-verified)`. Shipped 2026-08-02.
- `0195` — same, same day.
- ADR-010 carries **10** dated correction blocks and **four** site lists today; `Status` `accepted`.
  ⚠️ The brief's *"five … two site lists"* was a 2026-08-03 reading and is itself now stale. Reported
  as a difference, not smoothed over.

⭐ **The ADR-029 item's OTHER half has ALSO changed — a distinct statement, not folded in**, exactly as
the brief's item 1 third bullet directs. Measured in `claude/skills/fkit-status/dashboard.sh`:

> `# THE FOLDER-NAME ID PREFIX IS PRIMARY. The Priority cell is MUTABLE BOARD RANK`
> `# THE LADDER: folder ID prefix → Priority number → sanitised folder name → '?'.`

The frozen entry says *"still derives task identity from the mutable Priority cell; the folder ID is
only a fallback."* **That is now reversed** — the folder ID is primary, the Priority cell is arm 2.
And *"Until 0103 lands…"*: `0103` is in `ai-agents/tasks/done/`, `✅ Done`. Both halves of that item
are spent, and the correction entry says so as two separate statements.

---

## 2026-09-05 — Step 4: the sync delta, and the bound

```
$ git log 16754e3..HEAD --oneline | wc -l
10
```

Watermark `16754e3bb25add5ac3d16a2411c3013f10ac48e8` (2026-08-28). **150** committed files changed
under `ai-agents/` excluding the vault. Of those: **14** knowledge-base files, **7** sprint files,
**29** committed `done/` briefs.

**Closed-task backlog, measured (committed plus working tree):**

```
$ # closed-task folders touched since the watermark
61
$ # of those, no vault task page under a slug match
45
```

⛔ **The 45 are BOUNDED OUT of this row — owner ruling T2, label verbatim "Bound out + filing request
(Rec)".** 45 is 7.5× the member count and a **different act**: a resync reconciles a page with a
changed truth; a task ingest creates new synthesized knowledge from a source read in full. Folding
them in makes this row unauditable against its own member-shaped verification steps.

⭐ **The bound is written into the `log.md` entry itself, not only here** — plan §7 stage 5 and §11
item 7. Without that, the advanced watermark reads to the next sync as proof the 45 were ingested.
That is the single most dangerous side effect of bounding, and the log entry is the mitigation.

⚠️ Slug matching is a **floor, not a census** — a page could exist under a different slug. The order
of magnitude is not in doubt.

**The 11 ADRs (owner ruling T1, label verbatim "All 11 (Rec)")** — confirmed against the delta:
`003` `010` `012` `020` `032` `037` `038` `041` `042` `045` committed, `046` untracked.

**T5 — working-tree bytes ingested, hashed as read** (`git hash-object`):

| ADR | Blob of the bytes ingested |
|---|---|
| `adr-003` | `4702760315fbc041d66a0a9086ea83956990fa3f` |
| `adr-010` | `3ced65a930e80e512221f3d2ebfa4bb7888e6f15` |
| `adr-012` | `c7d5ac9be5b660e35bed947a3b4c8a435ec39a62` |
| `adr-020` | `9f86be5c14ecf0a4c71b49f6a2327cb6b904bd78` |
| `adr-032` | `a9b44d68f8822fb0a9d2bad7f14f0ac1b03f4a45` |
| `adr-037` | `9343f71739a9c5db7d140f574df87e85ec899408` |
| `adr-038` | `8c3a6307a2718b97ad3e6bf8ad4e9557c1f1954e` |
| `adr-041` | `cba6154378646286c2408aff446abd568a4b30be` |
| `adr-042` | `278d60ce260d66753d20fffa07062c95409223d7` |
| `adr-045` | `fcb99a86c1d5527d070826250a5426fe17e374eb` |
| `adr-046` | `6093dd4b2a80ab4282ab2fa6c2c3c45712c98b5b` |

⚠️ **T5's accepted cost, restated:** `adr-003`, `adr-037` and `adr-046` carry uncommitted bytes. If
that in-flight work is amended or reverted, the vault page describes a revision that never landed.
**The recorded hash makes that detectable; it does not prevent it.**

⚠️ ADR-046 was re-read immediately before ingest. It carries **three** dated correction passes, all
2026-09-05, the third correcting the second's site list, the second correcting the first — and site 3
of the third pass corrects a claim **inside the first note itself**. A copy read earlier today would
already be stale.

---

## 2026-09-05 — Step 5: the pass, stage by stage

### Stage 1 — `/fkit-wiki-sync`

Delta detected as recorded above. ⛔ The 45 closed-task pages were **not** ingested; the bound was
recorded **before** the run, and again inside the log entry.

### Stage 2 — `/fkit-wiki-ingest`

- **2 pages CREATED**: ADR-045 and ADR-046 vault pages, to `schema.md`'s decision template with
  **bold inline metadata** (`**Date**:`, `**Status**:`, `**Source**:`) — ⛔ no YAML frontmatter.
- **2 `index.md` catalog rows added** under `## Decisions` — plan §11 item 8, the file most often
  forgotten in an ingest. Verified present by the index-coverage check below.
- **10 cross-links made bidirectional** — 8 reciprocal back-links appended to existing pages
  (`adr-034`, `adr-042`, `adr-035`, `adr-029`, `systems/review-and-model-diversity`, and three task
  pages), plus the ADR-045 ↔ ADR-046 pair.
- **9 pages UPDATED** with dated resync notes: `adr-003` `adr-010` `adr-012` `adr-020` `adr-032`
  `adr-037` `adr-038` `adr-041` `adr-042`.
- **`0199`'s page half**: ADR-010's vault page + the `index.md` `0140` row.
- **`0239`**: ADR-012's vault page, re-derived from the landed ADR.
- ⛔ **`0287` excluded by its blocked upstream**, recorded as an exclusion, not an omission.

⭐ **One finding surfaced that the brief could not have predicted.** `0199`'s brief and `0212`'s both
carry *"five correction blocks / two site lists"* for ADR-010 — 2026-08-03 readings. **Measured today:
10 blocks, four site lists**, because `0197` and `0196` each appended more after those briefs were
written. Both records now carry the measured figures and say the brief's were stale.

### Stage 3 — the three member `log.md` appends, PLUS the pass entry

⭐ **Four appends, and the append-only diff was taken after EACH ONE** — plan §11 item 1. A single
end-of-run check cannot tell which append was clean.

| Append | Cumulative `git diff --numstat` | Deletions |
|---|---|---|
| A — `ingest (sync)`, the pass record + the bound | `104  0` | **0** |
| B — `correction (0212)` | `197  0` | **0** |
| C — `reconciliation (0317)` | `286  0` | **0** |
| D — `discharge (0319)` | `371  0` | **0** |
| E — `lint` + watermark (stage 4/5) | `455  0` | **0** |

**Three separate dated entries for the three members, never one shared entry.** `0319`'s adjacency
note *permits* sharing; `0317`'s brief says *"Append ONE dated `log.md` entry"* and `0358` says
*"never a shared step."* Three entries is the only construction satisfying all three, it costs
nothing on an append-only file, and a reader grepping for `0206`, `0238` or `0143` lands on an entry
that **answers that question**.

**Two independent proofs of append-only, not one:**

```
$ git diff -U0 -- ai-agents/wiki-vault/log.md | grep '^-' | grep -v '^---'
(no output)
$ head -n <snapshot line count> ai-agents/wiki-vault/log.md | cmp -s - <pre-run snapshot>
IDENTICAL
```

⭐ **The second is the stronger one:** every byte of the file that predates this run is unchanged, so
no past entry was edited, reworded or annotated in place. The frozen `0206` and `0238` flag lines are
covered by that proof and were also counted individually before and after — unchanged.

### Stage 4 — `/fkit-wiki-lint`, counts before AND after

| Measure | Before | After |
|---|---|---|
| Content pages | **272** (0 features · 8 systems · 44 decisions · 220 tasks) | **274** (46 decisions) |
| Index entries covering pages | 272 | **274** |
| Pages missing from `index.md` | 0 | **0** |
| Broken wiki-links (elided log forms excluded) | 0 | **0** |
| Genuine broken markdown links | 0 | **0** |
| YAML frontmatter | 0 | **0** |
| Vault ADR ↔ knowledge-base ADR | 44 ↔ 46 | **46 ↔ 46** |

**Issues found 1 · fixed 1 · flagged for human review 0 new.** The one issue: two shipped accepted
ADRs had no vault page. ⭐ **Knowledge-base ADRs with no vault page is now ZERO.**

ADR cross-check run as specified — regular files only, case-insensitive filename match, numeric
comparison with leading zeros stripped, and the duplicate-NNN pass run **separately** over the
knowledge-base rather than nested in the vault loop. **No missing counterpart, no slug divergence, no
heading/filename mismatch, no duplicate number.**

⚠️ **One script artefact, not a finding:** the metadata sweep listed `.gitkeep` as lacking
`**Date**:`. It is not a markdown page; the check's file filter was loose. **No page is missing
required metadata.**

### Stage 5 — watermark

`.wiki-watermark` advanced `16754e3` → `cf289c2` (`1  1`, a single-line overwrite).

⛔ **The bound is written into the log entry itself, twice** — in the `ingest (sync)` entry's
*"THE BOUND"* section and again in the lint entry's watermark section. Without that, the advanced
watermark reads as proof the 45 were ingested.

⚠️ **A second watermark subtlety, recorded because nothing else would catch it.** `adr-003`,
`adr-037` and `adr-046` were ingested from **uncommitted** bytes while the watermark names a
**commit**. When that work commits, the next sync re-surfaces those three as delta. **A safe
over-report, not an under-report** — noted in the log entry so the next run knows why.

---

## 2026-09-05 — Step 6: verification, mapped onto the brief's nine steps

| # | Check | Result |
|---|---|---|
| 1 | Diff only under the vault + this task's folder | ✅ Confirmed against the named baseline. ⚠️ `0358/brief.md` shows modified — **it was already modified in the baseline porcelain, before this run**, and this worker never wrote it |
| 2 | Frozen membership precedes every write; six members; `0212` owner-ruled 2026-08-29 | ✅ Step 1 above, a discrete dated step before any write |
| 3 | Six re-verified firsthand; `0212`'s zero-deletion diff; no path-plus-number form | ✅ Per-member records above; `455 / 0`; scan of the diff returns nothing |
| 4 | Upstream check **shown** for `0239` and `0287` with evidence | ✅ Both re-measured; `0287`'s six `read-only` sites counted |
| 5 | `0317` / `0319` each with own reasoning, verification, report line; `0212` / `0199` each naming which half they carried | ✅ Three separate entries; the *"DIFFER IN KIND"* distinction written **in words** in `0319`'s entry; `0199`'s entry says the `log.md` half is not its own |
| 6 | `/fkit-wiki-lint` clean; counts before **and** after | ✅ Table above; 1 found, 1 fixed, 0 new flagged |
| 7 | The vault-internal link count reported with a **current** figure | ✅ **12**, all inside code spans, **0 genuine**. ⚠️ Brief says 13 — **difference stated, NOT reconciled** |
| 8 | `git status` shows no folder moved, no row flipped; the report says the list is a hand-off | ✅ Nothing under `ai-agents/tasks/` written but this folder's own `worklog.md`; no board file touched |
| 9 | `npm test` passes; counts reported | See below |

**Additional, required by plan §2.3 rule 5 — both guards re-run over my own new records BEFORE the
review round is requested:**

```
$ node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js
ℹ tests 41   ℹ pass 41   ℹ fail 0   ℹ skipped 0
```

⭐ **41/41 green AFTER the writes.** A self-inflicted red would have been caught here, by me, not by
the reviewer.

### ⛔ WHAT "VERIFIED" CANNOT MEAN ON THIS ROW — stated in the verdict, not a footer

**Neither guard covers this row's deliverable.** `test/reference-integrity.test.js` exempts everything
under `ai-agents/wiki-vault/` and its arm **L5** asserts positively that no vault file ever entered the
scanned set. `test/coordination-citation-policy.test.js` never walks the vault at all — `log.md`
appears in its `TARGET` regex **as a CITED class, never as a citing one**.

⭐ **So for this row the guards are a regression gate over MY OWN THREE RECORDS**, which sit in an open
backlog folder and are scanned and not exempt. They are **not** a coverage gate over the vault.

⛔ **`npm test` green proves almost nothing about the vault.** What actually verifies this pass is the
lint counts before and after, the per-append zero-deletion proofs, the byte-identical snapshot
comparison, the per-member re-verification with quoted fragments, and the diff surface. **Stating the
suite as the verification would be false.**

⚠️ **And the vault's own citation rule has NO test underneath it.** The vault is exempt from both
guards, but `durable-citation-anchors` row 3 rules a line number into `log.md` wrong **categorically**.
This pass bound its vault writes to that rule by discipline, and the diff scan confirms it — but
**an exemption from a check is not an exemption from the rule**, and this is the row where those two
come apart.

---

## 2026-09-05 — Addendum: the vault's own citation rule, checked because nothing tests it

Scanned the whole vault for a coordination-document path followed by a line number.

| | Count |
|---|---|
| Found in the vault (pre-existing) | **4** |
| **Added by this run** | **0** |
| Genuine live defects | **0** |

**Triage — none is repairable and none is a defect:**

- **Three in frozen `log.md` entries**, all about task `0148`'s Sprint 2 board row. Append-only, so
  unfixable by edit **by rule**. ⭐ The third is itself a dated note recording that the first two
  rotted — it measures the row's true position at the time and notes it had **moved again by HEAD**.
  The vault documenting its own coordinate rot is the argument *for* the durable-anchor convention.
- **One on an ordinary page** (`wiki-ingest-of-adr-043-…`), inside a bullet left **byte-identical** and
  **immediately superseded by a dated ✅ block directly beneath it** naming the real archived path.
  ⛔ Editing it would destroy the record its own correction block preserves.

⛔ **Not fixed, deliberately** — plan §9 scopes no work against pre-existing vault findings, and all
four are already handled by the vault's own appended-note convention. Recorded in `log.md` so a future
scan recognises them as triaged history rather than rediscovering them as new work.

---

## 2026-09-05 — Link churn the producer must know about BEFORE it moves a folder

> # ⛔ STOP — THIS SECTION IS SUPERSEDED. DO NOT ACT ON IT.
>
> ⛔ **Its figure of 13 is WRONG and its claim that no member links another member is WRONG.**
> The true set is **18 unconditional + 3 order-sensitive, 17 of them guard-visible.**
> ⭐ **Go to the final section of this file, `2026-09-06 — R1, the FINAL corrected worklist`, and use
> that.** A producer acting on the numbers below will leave the suite red.

⚠️ **Re-measured this run; the plan's prediction does NOT fully reproduce and the measured figure is
reported instead.**

**13** markdown links point into the **five** folders proposed for close while they sit in `backlog/`.
⭐ **ZERO of the 13 are inside the vault**, so **all 13 are link-guard-relevant** and every one breaks
the instant its folder moves to `done/`.

| Holding file | Members it links |
|---|---|
| `ai-agents/sprints/backlog.md` | all five — `0199` `0212` `0239` `0317` `0319` |
| `ai-agents/sprints/done/sprint-2.md` | `0199` |
| `0258`'s closed brief | `0239` |
| `0291`'s closed brief | `0212` |
| `0318`'s closed brief | `0317` |

⚠️ **Three of the five holders are already-closed folders.** They are exempt from the **citation**
guard but ⛔ **NOT** from the **link** guard, which scans `ai-agents/tasks/done/`.

⚠️ **Two differences from the plan's prediction, reported rather than smoothed:**

1. The plan predicted **20** links across the six members; this run measures **16** across six, **13**
   across the five closing. The tree changed between the plan and the run.
2. The plan predicted **two member-to-member links** (`0239`'s brief → `0199`, `0319`'s brief → `0317`).
   ⛔ **Neither reproduces as a markdown link carrying a `backlog/` path.** No closing member's own
   folder holds a link into another closing member's folder.

⛔ **Repointing these is the PRODUCER's act, after this hand-off — outside my diff and outside my
verification.** Flagged because not flagging it would leave the next suite run red with nobody
expecting it.

⚠️ **`0287` is NOT in this table and NOT on the close list.** Its 3 links stay valid because its folder
does not move.

---

# 2026-09-05 — ROUND 1 REVIEW CORRECTIONS

⛔ **Method applied by hand, NOT by skill.** `skills_for_role()` grants **wiki**
`fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-wiki-ingest fkit-wiki-lint
fkit-wiki-sync`. **`fkit-process-stateful-review` is coder-only**, and the ADR-018 hook denies it to a
wiki identity at any spawn depth. It was **not invoked**. ⛔ **The ledger's `## Coder response` section
was NOT written by this worker** — the artifact marks it `CODER-OWNED (ADR-038)`, and ADR-044 names a
spawned wiki writing that section as *"the shape ADR-038 now forbids."* Dispositions are recorded
**here**, in this worker's own record, and returned to the driver to route.

⭐ **Every one of the eight findings lands in a file this role owns** — `worklog.md` and the vault's
`log.md`. So all eight are dischargeable without touching a surface that is not mine.

## Dispositions — verdict derived from a blast radius traced here, never inherited

| # | Verdict | Class | Action |
|---|---|---|---|
| R1 | **CORRECT** | Defect | Worklist corrected below — ⚠️ **and the correction below was ITSELF short by 3; the true figure is 18 + 3, see the 2026-09-06 section at the end of this file** |
| R2 | **CORRECT** | Defect | Proof table corrected below |
| R3 | **CORRECT** | Defect | Dated `log.md` append |
| R4 | ⛔ **DISPROVEN** | — | Not corrected; the measurement is recorded in the append instead |
| R5 | **CORRECT** | Defect | ⛔ **THIS CELL WAS FALSE WHEN WRITTEN.** It claimed *"corrected below and in the append"*; the correction landed in **this file only** — the 2026-09-05 append had **no R5 section**. Discharged for real by the **2026-09-06 append**, verified by grepping the work product for the corrected wording |
| R6 | **CORRECT** | Defect | Dated `log.md` append |
| R7 | **CORRECT** | Defect | Dated `log.md` append |
| R8 | **CORRECT** | Defect | Dated `log.md` append |

## R1 — the link-churn worklist, CORRECTED. ⛔ My earlier reasoning was wrong, not just my number.

⛔ **The wrong test, named.** My earlier section dismissed the member-to-member links as *"not a
markdown link carrying a `backlog/` path."* **That test is invalid.** The link guard **resolves
`../<sibling>/brief.md` relative to the citing file** — the `backlog/` segment never appears in the
href and is irrelevant to whether the link breaks. ⭐ **The plan's prediction was right and I
disproved it with a test that could not have detected it.**

⭐ **Root cause, single and mechanical:** my verification script **substring-matched the raw href**
(`"backlog/<folder>" in target`) instead of resolving it. Every miss follows from that one error.

⚠️ **A second, self-inflicted bug worth recording.** My re-check script skipped any path containing
`wiki-vault` — which silently excluded **this task's own folder**,
`0358-sweep-c-the-wiki-vault-resyncs-as-one-pass`. That is why `0358`'s own brief never entered the
scan.

### The corrected worklist — **15 unconditional + 3 order-sensitive**

**Unconditional — break when their target moves, whatever the order (15):**

| Citing file | Targets | Count |
|---|---|---|
| `ai-agents/sprints/backlog.md` | `0199` `0212`×2 `0239` `0317`×3 `0319`×2 | **9** |
| `ai-agents/sprints/done/sprint-2.md` | `0199` | 1 |
| `0258`'s closed brief | `0239` | 1 |
| `0291`'s closed brief | `0212` | 1 |
| `0318`'s closed brief | `0317` | 1 |
| `0319`'s brief § Related → **`0290`** | outbound; `0290` stays put | 1 |
| `0358`'s own brief → **`0212`** | `0358` stays in `backlog/` | 1 |

**Order-sensitive — safe only if the five close in ONE state (3):** `0239`'s brief → `0199`;
`0319`'s brief → `0317` **×2**. ⭐ **Owner ruling, label verbatim "Repoint 15, close five in one
state (Rec)": the five members close in ONE state, so no intermediate state exists and these three
never break.** ⛔ Closing them one `/fkit-task-done` at a time reds the guard between calls.

### ⭐ My own refinement, measured here — 14 of the 15 red the suite, not 15

`test/reference-integrity.test.js` **masks blockquote lines** (`maskFencesAndQuotes`:
`if (/^\s*>/.test(line)) return blank(line);`), and its own header states the consequence: *"A future
genuine rot inside a blockquote will not be caught."*

⛔ **`0358`'s brief cites `0212` on a blockquote line**, so that break is **invisible to the guard**.
It is a **real broken link for a human reader** and must still be repointed — but it will **not** red
`npm test`. **14 of the 15 are guard-visible.**

⚠️ **This narrows the operational claim, it does not soften the worklist.** All 15 need repointing;
only 14 announce themselves.

### ⛔ Two move-shapes, and only one is dangerous

- **`../../done/<target>` survives the move.** From `backlog/X/` and from `done/X/` alike it resolves
  to `tasks/done/<target>`. Three such links exist (`0199`→`0143`, `0239`→`0232`, `0319`→`0318`) and
  ⛔ **none is a break** — do not repoint them.
- **`../<sibling>` does NOT survive** unless the sibling moves in the same act.

## R2 — the append-proof table, CORRECTED

⛔ **My table was wrong at three sites.** It said *"Four appends"*, listed five rows ending `455  0`,
and verification row 3 repeated `455 / 0`. The lint entry compounded it with *"across all five of this
run's entries."*

**Corrected: this run made SEVEN appends to `log.md`, and the delivered file is `591  0`.**

| Append | Cumulative `--numstat` | Deletions |
|---|---|---|
| A — `ingest (sync)` | `104  0` | 0 |
| B — `correction (0212)` | `197  0` | 0 |
| C — `reconciliation (0317)` | `286  0` | 0 |
| D — `discharge (0319)` | `371  0` | 0 |
| E — `lint` + watermark | `455  0` | 0 |
| F — lint addendum (**26 lines; had NO recorded proof — this is R2**) | `481  0` | 0 |
| G — this round-1 correction entry | `591  0` | 0 |

⭐ **Append-only itself always held** — the reviewer verified it independently, and appends F and G
were each proved against a fresh pre-append snapshot by `cmp`. **The defect was the audit record, not
the file.** On a row whose only real verification is the per-append proof, an unproved append is a
genuine hole even when the property holds.

## R5 — the `0287` claim, CORRECTED

⛔ *"`0287`'s vault pages were left ALONE"* is **overbroad and falsifiable by one `git status`.**
`0287`'s brief enumerates carrying pages including `wiki/systems/review-and-model-diversity.md`, and
this run touched it (an ADR-045 back-link), plus `index.md` and ADR-042's page.

⭐ **Read it as: *`0287`'s SANDBOX CLAIMS were left alone.*** That is true and re-verified — no
`read-only` sandbox sentence moved on any page, **6** `--sandbox read-only` and **0**
`--sandbox workspace-write` remain under `claude/`, `0273` is still `🔲 Backlog`, and `0287` is on
neither close list. **T3's substance is correctly honoured; only the wording failed.**

---

# 2026-09-06 — R1, the FINAL corrected worklist  ⭐ THIS IS THE ONE THE PRODUCER USES

⛔ **Supersedes BOTH earlier figures in this file** — the original `13` and the round-1 correction's
`15 + 3`. **Measured independently here, resolving every link through a reimplementation of the
guard's own `maskFencesAndQuotes`.**

## ⭐ **18 unconditional + 3 order-sensitive. 17 of the 18 are guard-visible.**

### Why my round-1 figure of 15 was still short by 3

⛔ **The three missing links are in `review.md`'s own R1 row**, which quotes citing sites and in doing
so links `0212`, `0199` and `0317`. They survive masking and **red the guard** when those rows close.

⭐ **The reviewer's scan predates its own row — which is exactly why 17 ≠ 20.** A ledger that quotes
link targets becomes a citing document itself, and no scan taken before the ledger was written can
see them.

⚠️ **And my own round-1 re-count could not have seen them either**, for the reason already recorded:
my script skipped any path containing `wiki-vault`, which excluded this entire task folder — `brief.md`
**and** `review.md` alike. **One filter bug hid both misses.** Corrected here to match on the
directory prefix `ai-agents/wiki-vault`, never on the substring.

### The worklist

**Unconditional — break when their target moves, in any order (18):**

| Citing file | Targets | Links |
|---|---|---|
| `ai-agents/sprints/backlog.md` | `0199` · `0212`×2 · `0239` · `0317`×3 · `0319`×2 | **9** |
| `0358`'s **`review.md`** (the R1 row) | `0212` · `0199` · `0317` | **3** |
| `ai-agents/sprints/done/sprint-2.md` | `0199` | 1 |
| `0258`'s closed brief | `0239` | 1 |
| `0291`'s closed brief | `0212` | 1 |
| `0318`'s closed brief | `0317` | 1 |
| `0319`'s brief § Related → `0290` | outbound; `0290` stays put | 1 |
| `0358`'s own brief → `0212` | `0358` stays in `backlog/` | 1 |

**Order-sensitive (3):** `0239`'s brief → `0199`; `0319`'s brief → `0317` **×2**.
⭐ **Owner ruling, label verbatim "Repoint 15, close five in one state (Rec)" — the five members close
in ONE state, so no intermediate state exists and these three never break.** ⛔ Closing them one
`/fkit-task-done` at a time reds the guard between calls.

### ⛔ One of the 18 is guard-blind — repoint it anyway

`0358`'s brief cites `0212` **on a blockquote line**, and `reference-integrity` masks blockquotes
(`maskFencesAndQuotes`), its own header conceding *"a future genuine rot inside a blockquote will not
be caught."* **17 of 18 announce themselves; this one does not.** It is a real broken link for a human
reader.

### ⛔ Three links look like breaks and are NOT — do not repoint them

`0199`→`0143`, `0239`→`0232`, `0319`→`0318` all use the **`../../done/<target>`** form, which resolves
to `ai-agents/tasks/done/<target>` from `backlog/X/` and from `done/X/` alike. ⭐ **`../../done/X`
survives the move; `../X` does not.** That distinction is the whole mechanism.

### ⛔ Who repoints `review.md`

⚠️ **Not this worker.** `review.md` is the reviewer's and the coder's; the wiki role never writes it.
Those three links are the **producer's** to repoint at close, and they are listed here so the
producer's worklist is complete — the driver carries it across.

---

# 2026-09-06 — R5, discharged FOR REAL, and the check that proves it

⛔ **Round 1 recorded R5 as corrected "below and in the append". That was false**: the correction
existed in this file only, and the 2026-09-05 append had **no R5 section**. The overbroad sentence
stood in the **work product**.

✅ **Discharged by the 2026-09-06 `log.md` append** — `641 0`, zero deletions, prefix `cmp`-identical
against a pre-append snapshot.

⭐ **The check that works, recorded so it is reused:** grep the **work product** for the *corrected
wording*, not the record for a claim of correction.

```
$ grep -c "sandbox claims\|SANDBOX CLAIMS" ai-agents/wiki-vault/log.md
2
```

Before the append this returned **0** while the disposition table said "corrected" — that gap is the
whole defect class. ⚠️ **A record row describing a repair is not evidence a repair happened.**

## ⚠️ A frontier, deliberately NOT chased

The 2026-09-05 correction append freezes `21` / `28` for R3 and `31` for R6, and **its own text
contains both literals** — the delivered file is now higher again. ⭐ **This recursion was already
named in that entry, which concluded: *"cite the six files; do not cite a number."*** Appending
another correction would re-enter the same loop. ⛔ **Recorded as a frontier, not a defect to fix.**

---

# 2026-09-10 — review ledger CLOSED OUT (records only)

⛔ **Written by a spawned `fkit-coder` on the owner's ruling of 2026-09-10, option label verbatim
"Close out 0358's review ledger (Rec)."** ⛔ **`0358` is NOT reopened.** It stays in
`ai-agents/tasks/done/`. No mover was invoked, no folder moved, no board row flipped, no brief
re-statused, no source or test edited, nothing committed or staged by me.

**Surface written:** this file, and `review.md`'s `## Coder response` section plus its header
`Status:` and its `## Accepted residuals`. ⛔ **`## Reviewer findings` was not touched.**

## What changed in the ledger

| | Was | Now | Why |
|---|---|---|---|
| Header | `Status: in-review` | **`Status: closed-out`** | All eight findings dispositioned — 7 `✅ done`, 1 `disproven`. Nothing blocking remains |
| **R1** | `blocked` | **`✅ done`** | The gap the row named — *"the corrected worklist is still short by 3"* — is closed on disk and the worklist was **acted on** |
| **R5** | `blocked` | **`✅ done`** | Discharged in the **work product**, not merely in a record |

⭐ **Neither Status was set by inheriting a claim.** I was handed both as discharged and told
explicitly not to take it on trust; both were re-measured here first. Severity and disposition on both
rows are derived from what I measured, never from the briefing.

## The measurements this closeout rests on

**R5 — the check that works, reused.** ⭐ **Grep the work product for the corrected wording, never the
record for a claim of correction** — this task's own recorded lesson.

- `ai-agents/wiki-vault/log.md` § *"2026-09-06 — correction (task `0358`, round 1 review, R5) — the
  `0287` exclusion claim"` is **on disk**, and reads the sentence instead as *"⭐ **`0287`'s SANDBOX
  CLAIMS were left alone.**"*
- `grep -c "sandbox claims\|SANDBOX CLAIMS"` on `log.md` → **3**. The signature of the defect was **0**.
  ⚠️ **My 3 is not this file's earlier 2** — the third hit is the wiki's 2026-09-10 withdrawal entry,
  written after that count was taken. Reported as measured rather than reconciled to the record.
- The original overbroad sentence is **still present byte-identical** in the frozen ingest entry
  § *"⛔ `0287` is EXCLUDED BY A BLOCKED UPSTREAM — not by oversight, and it is NOT on the close list"*.
  ⭐ Append-only honoured: annotated, never rewritten.

**R1 — the record is corrected AND the worklist was acted on.**

- § *"2026-09-06 — R1, the FINAL corrected worklist"* supersedes both earlier figures at **18
  unconditional + 3 order-sensitive, 17 guard-visible**, and its table carries the row the ledger said
  was missing — `review.md`'s own R1 row citing `0212` · `0199` · `0317`.
- **All five members are in `ai-agents/tasks/done/` today**, and `reference-integrity` measures **0
  broken over 3391 resolved targets**, with `done/` folders provably in scope (its arm *"M2 mutation: a
  broken link in ai-agents/tasks/done/ REDS"*).
- ⭐ **The three sibling links out of `review.md` HEALED rather than needing a repoint** — `../<name>/brief.md`
  resolves again once citer and target are both in `done/`. That is the inversion `test/reference-integrity.test.js`
  already records in its `NAMED_EXEMPT` comment, and it is why three exemptions added on 2026-09-06
  were deleted again the same day.
- ⚠️ **One link out of `review.md` genuinely does not resolve** — the R1 row's quotation of `0319`'s
  brief citing `0290`, whose target is still open. It is a **`NAMED_EXEMPT` pair**, deliberate, with a
  trip-wire comment for the day `0290` closes. ⛔ **I added no exemption. Exempt count measured 7,
  before and after my write.**

**Guards, re-measured after my write** (not carried over from the briefing — this write adds links, so
a stale count would be worthless): `reference-integrity` **20/20 pass**, 0 broken, exempt 7 ·
`coordination-citation-policy` **21/21 pass**, residual 0.

## What I did NOT do

- ⛔ **No vault write.** The wiki's two withdrawal writes were **uncommitted in the working tree** when
  I read them; I left them exactly as found — ADR-005.
- ⛔ **No full suite.** Two guards only, named above.
- ⚠️ **R2's residual carried forward unchanged**: § *"Stage 3 — the three member `log.md` appends, PLUS
  the pass entry"* still reads *"Four appends"* over a table ending `455  0`, with no forward pointer
  to the corrected 7-append table. **Left alone deliberately** — R2 is discharged, the ruling scoped
  this write to the ledger, and rewriting a run record to tidy it is the exact failure mode this task
  spent two rounds learning.
- ⛔ **`0287` is not closed and must not be read as `0358` residue.** Recorded in full What / Why /
  Re-raise-only-if shape in the ledger's `## Accepted residuals`.
