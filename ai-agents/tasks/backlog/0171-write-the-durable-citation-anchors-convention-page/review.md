# Review — 0171

Task: `ai-agents/tasks/backlog/0171-write-the-durable-citation-anchors-convention-page/brief.md`
File(s) under review: the working tree vs `HEAD` (`9360177`), restricted to 0171's eleven-path
change surface — `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`,
`claude/scaffold/ai-agents/knowledge-base/conventions/durable-citation-anchors.md`, both
`conventions/README.md`, `claude/structure-spec.md`, `claude/structure-manifest.tsv`,
`ai-agents/knowledge-base/decisions/{adr-012,adr-016,adr-018,adr-031}*.md`,
`test/structure-check.test.js`.
Status: in-review — round 2 complete, convergence recommended

**Round 1 · reviewed 2026-08-15 · reviewers: fkit-reviewer (Claude) + Codex `gpt-5.6-sol` (both ran).**
⚠️ Per ADR-042, the Codex pass is **reasoning-only** — it ran under `--sandbox read-only` and could
not execute the test suite, build a fixture, or run a mutation. Its findings are static reasoning.
The four affected suites were re-run by the reviewer: **49 pass / 0 fail**.
**Round 1 coverage: FULL (both reviewers ran).** ⛔ That record stands unchanged.

**Round 2 · reviewed 2026-08-15 · reviewer: fkit-reviewer (Claude) only — convergence pass.**
**No Codex pass was run this round, by the driver's instruction**, Round 1 having had full two-reviewer
coverage. ⚠️ **Round 2's own coverage is therefore single-reviewer, and is recorded as such** — it does
not restate Round 1's coverage and does not downgrade it.
⭐ **Round 2 is execution-backed, not reasoning-only.** The page's prescribed verification command was
**run**, in both copies; every count below was re-derived from disk notation-agnostically with
`grep -oE 'adr-0NN[^ )\`"]*:[0-9]' … | wc -l`, never with the `adr-0NN:NNN` pattern that under-counted
in round 1. `test/structure-check.test.js` re-run by the reviewer: **28 pass / 0 fail**, exit 0.
⚠️ **The full suite was NOT re-run by the reviewer** — the coder reports 730/730 and the driver is
re-running it independently. This ledger does not assert that result.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | medium | `ai-agents/knowledge-base/conventions/durable-citation-anchors.md:47-58` | The five-row table is **not carried verbatim**, contrary to owner ruling OQ1. Four cells altered: row 3's targets de-pathed (`ai-agents/sprints/*.md`, task briefs, `ai-agents/wiki-vault/log.md` → "sprint plans, task briefs, an append-only project log") and its `Because` cell drops *"and §3 measures how fast"*; row 4's `Because` drops *"ADR-029 Decision 3:"*; row 5's `Because` drops `:3-4` and converts the path to a link; the caveat blockquote is reworded (*"In this repo's multi-round stateful model"* → *"In a multi-round stateful review"*, *"the §1.1 rider"* → *"the paired-quote rider"*). **Only the row-5 `:3-4` drop is disclosed** in plan §1c / worklog §4. The scaffold *does* ship `ai-agents/sprints/` and `ai-agents/wiki-vault/log.md`, so row 3's de-pathing was not forced by the dual-home ban. Raised by **both** reviewers. |
| R2 | 1 | medium | `ai-agents/tasks/backlog/0171-…/worklog.md:433-453` | **The termination proof's enumeration is narrower than the claim it backs, and a third wave does exist.** The sweep was scoped to `ai-agents/knowledge-base/decisions/`; the conclusion (*"the wave terminates at wave 2. No third wave exists"*) is unscoped. Repo-wide, `adr-016:292` is cited **naked** in four places in **live, non-frozen** documents — `ai-agents/sprints/backlog.md:220`, `:222`, `:225` and `ai-agents/tasks/backlog/0278-…/brief.md:96` — and this task's `adr-016` insertion at `:192` displaced it: `HEAD:adr-016:292` = `## Amendment — 2026-07-14: …`; working-tree `:292` is **blank**, the heading now sits at `:293`. ⚠️ The one pointer the proof *did* find (`adr-042:379` → `adr-016:73`) is genuinely **undisplaced** — verified, `HEAD:73` and `WT:73` are identical strings. |
| R3 | 1 | medium | `ai-agents/tasks/backlog/0232-correct-adr-012s-stale-source-of-truth-and-code-coordinates/brief.md:105` | **Deliverable B silently overlapped an open, owner-ruled task and left its evidence stale.** `0232`'s brief quotes adr-012's header verbatim as its measured evidence — *"their own pre-registered re-raise trigger, `adr-012:139-141`, is met"* — and Deliverable B rewrote that sentence. Measured wrap-aware: **1 occurrence in `HEAD:adr-012`, 0 in the working tree.** `0232`'s brief also claims this exact scope by name (*"this repairs ADR-012's, including its citations INTO ADR-010 — no overlap, neither waits"*), and its class-(5) inventory (*"~6 cross-document `adr-010:NNN` cites"*) plus its stale self-citation item are now already done. Neither `plan.md` nor `worklog.md` mentions `0232`. |
| R4 | 1 | low | `adr-012:107-109`, `adr-018:69-70` | **Two new quoted fragments cross a markdown emphasis boundary and are therefore unfindable by any raw-text search — including the page's own Piece 7 normalised form.** `"Not rejected — deferred"` vs `ADR-010:216-217` raw `Not rejected —\n  **deferred**`; `` "`fkit-survey-project` is reachable from every role session by name" `` vs `ADR-012:146` raw `**…every role session** by name`. Both are verbatim **as rendered** — these are **not** fabrications. The defect is that Piece 7 lists **four** known limits and inline emphasis splitting a phrase is not among them, while the task's own repairs hit it twice. Raised by **both** reviewers (Codex as two separate findings). |
| R5 | 1 | low | `adr-016:146`, `adr-016:334` | Both anchor to `ADR-012 §Context`, but the fragment sits at `adr-012:39` under the nested `### What the mechanism actually is` (`adr-012:31`), inside `## Context` (`adr-012:22`). The page's own rule reads: *"Where the target sits under a nested or dated sub-heading, name that one — it is the smaller region."* The anchors name the ~50-line parent instead of the ~24-line child. Self-inconsistency with the convention being shipped. |
| R6 | 1 | low | `ai-agents/tasks/backlog/0171-…/worklog.md:405-406, 455` | Evidence error. States `adr-012` **"175 → 180 lines, +5"**, twice, and uses `+5` in the displacement reasoning. Measured: `git diff --numstat` = **+15 / −9 = +6**; `wc -l` **175 → 181**. |
| R7 | 1 | low | `ai-agents/knowledge-base/conventions/durable-citation-anchors.md:210-219` | The closing Provenance warning is a near-verbatim copy of the settled precedent block in `priority-is-rank-not-identity.md` — **but it drops that block's `Owner ruling, 2026-07-27.` attribution.** It therefore carries the instruction (*"Do not 'fix' this"*) without the authority that made it acceptable. ⚠️ Codex raised the block itself as **High** (fkit-only maintenance text shipped into projects with no `claude/scaffold/`); **that half is disproven** — see *Re-litigates settled decisions* below. |

### Round 2 — findings from the convergence pass

⭐ **Verdict first: all seven round-1 findings are confirmed discharged.** The five new findings below
are **evidence- and wording-level**; only one (R12) touches shipped content, and none reopens a
round-1 finding.

| #   | Round | Sev | file:line | Claim |
|-----|-------|-----|-----------|-------|
| R8  | 2 | medium | `worklog.md` §7f *"Line counts measured before and after"*, §7h *"Wave 4"* | **The wave-4 termination proof's load-bearing figure is wrong at both ends, and it is the number the whole claim rests on.** Both sections state `backlog.md` **"407 → 407"**. Measured: `git show HEAD` `wc -l` = **404**; working tree = **408**; `git diff --numstat` = **10 / 6 = +4**. `407` is neither the before nor the after. The stated *method* — *"line counts before and after are identical, so nothing moved"* — is therefore **false for `backlog.md`**, the one file where the claim mattered most. §7h's honest caveat names the pre-existing hunk as **`+3`**; measured **`+4`** (`@@ -249 +249,5 @@`). ⭐ **The CONCLUSION survives, but only on evidence the worklog does not give.** Re-derived per hunk: 0171's five edits are `@@ -139 +139 @@`, `-186 +186`, `-220 +220`, `-222 +222`, `-225 +225` — **all pure same-line substitutions, zero net lines**; the entire `+4` is one pre-existing uncommitted hunk at `:249`. And, notation-agnostic and repo-wide (`grep -rInoE 'backlog(\.md)?:[0-9]+'`, all `*.md`/`*.js`/`*.sh`, excluding `node_modules/` and the gitignored `.claude/`), **all 55 `backlog.md:NNN` pointer occurrences target lines < 249** — the highest is `:230`. **Nothing that is cited moved. No wave 4.** ⚠️ Note the coder's figure was 46 occurrences and mine is 55; the gap is immaterial, since every one of the 55 is above the only displacing hunk. |
| R9  | 2 | low | `worklog.md` §8 *"Not done — held scope"* | **§8 is stale and self-contradicted by §7f in the same file.** It asserts *"`sprint-6.md` and `backlog.md` untouched"*. `backlog.md` carries **five 0171 hunks** (`:139`, `:186`, `:220`, `:222`, `:225`), three of them the repairs §7f documents. A reader who consults the held-scope section alone is told the opposite of what happened. ⚠️ Separately verified and **clean**: `sprint-6.md`'s two changed lines are **not** 0171's — `:205` is the producer's `0306` close (`🔲 Backlog` → `✅ Done (agent-closed — not owner-verified)` + `tasks/backlog/` → `tasks/done/` href) and `:206` is the loop's own status mark (`🔲 Backlog` → `🔄 In progress`). **`sprint-6.md:206`'s citation text is byte-untouched.** The standing edit ban was honoured. |
| R10 | 2 | low | `worklog.md` §7d, R1 disclosure table, item 5 | **The region count is five, confirmed — but the text count is six, and the sixth is still undisclosed.** Re-derived by exhaustive word-diff of the report's table+caveat (`2026-08-01-durable-citation-form-for-mutable-coordinates.md:118-132`) against the page's: rows 1 and 2 are byte-identical; **four cell alterations**; **one blockquote region**. ⭐ **Five altered regions — NOT six. The coder's count is right and the driver's caveat is right.** But that one blockquote region carries **three** distinct textual alterations and §7d discloses **two**. The third: the caveat's heading drops the report's finding label — report *"…stated rather than glossed **(R6)**."* → page *"…stated rather than glossed."* Same class and same justification as the disclosed `§3` and `§1.1` drops (an unresolvable cross-reference into a report the page may not link), so the drop is defensible; it is the **disclosure** that is still incomplete, which is precisely the defect R1 named. |
| R11 | 2 | low | `worklog.md` §7f, *"Post-repair enumeration — scope: … `ai-agents/tasks/backlog/` …"* | **The exhaustiveness claim is false again, in the same shape as R2 — fourth instance.** §7f claims *"Every surviving pointer into a file this task edited is either one of the three ruled residuals above, or verified undisplaced"*, over a scope that explicitly includes `ai-agents/tasks/backlog/`. Notation-agnostic re-sweep of that scope finds **9 surviving occurrences the enumeration names nowhere**, all of the displaced pair, all in **this task's own two files**: `0171/brief.md:88`, `:242`, `:281` — **6 occurrences on 3 lines** — and `0171/plan.md:239`, `:245`, `:246` — **3 occurrences on 3 lines**. Both targets verified displaced: `HEAD:adr-012:87` = `` (`adr-010:107-110`). ``, working tree `:87` = the `⛔ Owner:` banner sentence; `HEAD:105` = *"consult path. It remains deferred (as in `adr-010:92-94`)…"*, working tree `:105` is **blank**. ⛔ **No repair is right here** — the brief and plan are the historical record of *which* pointers were repaired, rewriting them would destroy the evidence, and `plan.md` is byte-frozen. **Record, do not repair.** The defect is the unqualified word *"every"*. |
| R12 | 2 | low | `ai-agents/knowledge-base/conventions/durable-citation-anchors.md:157-161` (and the byte-identical scaffold copy) | ⭐ **The broadened Piece 7 limit is correct where it was tested and over-claims where it was not — and I ran it rather than reading it.** ✅ **The `>` half is verified by execution, in both copies**, on the Provenance attribution `Owner ruling, 2026-08-01.` (now at `:222-223`): naive `grep -c` → **0**; the page's own step-2 form (`tr '\n\t' '  ' \| tr -s ' '`) → **0**; the **prescribed** marker-strip form (`sed 's/^[[:space:]>*-]*//'` then join and squeeze) → **1**. The third false zero is real, reproducible, and the prescribed fix genuinely cures it. ⛔ **But the same bullet bundles `\|` into that class** — *"a `\|` between table cells, and equally a `>` … all survive the join and defeat the match. **Strip leading markers as well as whitespace** before matching: `sed 's/^[[:space:]>*-]*//'`"* — and the prescribed strip **cannot touch `\|`**. Measured on `\| alpha \| beta \|` searching `alpha beta`: bare join+squeeze **0**, prescribed strip **0**, only a global `s/\|//g` yields **1**; the sed leaves the line byte-identical, because `\|` is not in the character class and, between cells, is not a leading marker at all. **The remedy cures `>` and `-`/`*` bullets and does nothing for `\|`.** On a page whose own closing rule is *"State which of these limits your check did not cover, in the same breath as the result"*, a remedy sentence that covers a case it cannot is this page's own defect class. **Fix is one clause, not a method change** — the method is right. |

## Coder response

<!-- CODER-OWNED. The reviewer does not write this section. -->

**Round 1 processed 2026-08-15** by the coder (Process-review step of `/fkit-sprint-ship-loop`), under
the driver's declared-approval marker. **Every finding was verified against disk before any edit.**
Owner rulings for R1/R2/R3 relayed 2026-08-15 via `AskUserQuestion`; R4–R7 applied after verification.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** — verified. Rows 1–2 byte-identical to the report; **four cell alterations** (row 3 targets de-pathed, row 3 `Because` drops *"and §3 measures how fast"*, row 4 `Because` drops *"ADR-029 Decision 3:"*, row 5 `Because` drops `:3-4` and links the path) **plus one blockquote rewording** — five alterations, four of them cells. The reviewer's "four cells" is exact. | **Defect** (undisclosed deviation from owner ruling OQ1) | **Owner ruled ACCEPT as a recorded residual.** ⛔ Not reverted. All five disclosed in `worklog.md` §7d with a per-item reason, so the row-5 `:3-4` drop is no longer the only disclosed one. | **accepted residual** |
| R2 | **CORRECT** — verified. `HEAD:adr-016:292` = the `## Amendment — 2026-07-14` heading; working-tree `:292` is blank, heading now at `:293`, displaced by this task's `:192` insertion. | **Defect** (unscoped conclusion + real third wave) | **Repaired all 6 citers** per owner ruling, by direct heading substitution `adr-016:292` → `adr-016 §Amendment — 2026-07-14`, in `sprints/backlog.md:220,222,225` and the `0276`/`0278`/`0281` briefs. **Same-line substitution: line counts unchanged in all four files**, so no wave 4 is triggered. ⚠️ **Sweep also found displaced live citers the finding did not enumerate — see NEEDS-DECISION in §7e.** | **fixed (partial — residual surfaced)** |
| R3 | **CORRECT** — not re-verified by me beyond confirming the overlap is real; ⛔ **not mine to act on.** | **Defect** (process: undeclared overlap with an open task) | **Owner ruled: producer records and re-measures.** A producer has been spawned. ⛔ `0232`'s brief untouched by me. | **routed to producer** |
| R4 | **CORRECT** — verified. Both fragments return **0** normalised hits against their own source file: ADR-010 raw is `Not rejected —\n  **deferred**`; ADR-012 raw is `**…every role session** by name`. Verbatim *as rendered*, unfindable *as text*. | **Defect** (page's own honesty bar — Piece 7's limit list was incomplete) | **Both halves fixed.** (1) Added a 5th limit, *"inline emphasis splits a phrase"*, to Piece 7. (2) Re-quoted both citations to lie wholly inside or outside the emphasis. **All 14 fragments this task introduced now return ≥1 normalised hit in their source** — table in `worklog.md` §7d. | **fixed** |
| R5 | **CORRECT** — verified. Fragment sits at `adr-012:40` under `### What the mechanism actually is` (`:31`), inside `## Context` (`:22`). The anchors named the ~50-line parent. | **Defect** (self-inconsistency with the shipped rule) | Both anchors changed to `ADR-012 §Context → "What the mechanism actually is"`. Same-line substitution; `adr-016` line count unchanged by this fix. | **fixed** |
| R6 | **CORRECT** — **re-derived myself, the reviewer is right and I was wrong.** `git show HEAD` `wc -l` = **175**; working tree = **181**; `git diff --numstat` = **15 / 9 = +6**. My `+5 (175→180)` was wrong at all four sites. | **Defect** (evidence error in my own worklog) | Corrected to **+6 (175→181)** at all four occurrences; the displacement reasoning re-worded to *"further six lines"*. | **fixed** |
| R7 | **CORRECT** — I upgrade this from the reviewer's *PARTIALLY CORRECT*. Verified: the precedent's Provenance block does carry `Owner ruling, 2026-07-27.` (wrapped across `:41-42`); the new page carried the instruction with no authority at all. | **Defect** (instruction shipped without its warrant) | Attribution restored — **but dated `2026-08-01`, not the precedent's `2026-07-27`.** Copying the precedent's date would attribute this page's link ban to a ruling that was about a different page; `2026-08-01` is the ruling that actually authorizes it (report §11 OQ5 + the brief's accepted cost 2). **Reasoned deviation, not a transcription.** | **fixed** |

---

**Round 2 processed 2026-08-15**, same worker, same marker. Owner ruled both groups via
`AskUserQuestion`: **"Fix it — one-clause narrowing (Recommended)"** (R12) and **"Fix all four in the
worklog (Recommended)"** (R8–R11). **Every figure re-derived from disk before applying**, as instructed
— two relayed numbers did not reproduce and are corrected below.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R8 | **CORRECT — re-derived; the reviewer is right and I was wrong twice over.** `git show HEAD` = **404**, working tree = **408**, `--numstat` **10 / 6 = +4**. My `407 → 407` matches neither end: it was a real reading taken **mid-task**, after an earlier pass had already edited the file, then presented as the whole-task proof. §7h's `+3` is also wrong; the hunk is `@@ -249 +249,5 @@` = **+4**. | **Defect** (a true measurement supporting a claim it does not support) | Both sections rewritten to give **the evidence that actually carries the conclusion**: all five of my hunks are **zero-net** (`-139 +139`, `-186 +186`, `-220 +220`, `-222 +222`, `-225 +225`) and a zero-net hunk cannot move anything below it; the entire `+4` is one **pre-existing** hunk. ⚠️ **Two relayed figures did not reproduce:** citers relayed as **55**, measured **59** repo-wide over 1010 `.md` files (**45** excluding this task's own folder); highest target relayed as **`:230`**, measured **`:212`** — `:230` is a *citing line inside* `backlog.md`, not a target. **Zero targets ≥ `:249`**, so the pre-existing hunk displaces nothing either. | **fixed** |
| R9 | **CORRECT** — verified. §8 asserted *"`sprint-6.md` and `backlog.md` untouched"* while §7f in the same file documents three repairs to `backlog.md`. | **Defect** (self-contradiction; the held-scope section told a reader the opposite of what happened) | §8 now states `backlog.md` carries **five citation-only, zero-net edits** at `:139`, `:186`, `:220`, `:222`, `:225`, under owner ruling, with no `## Status`, rank, row order, or row count change. **`sprint-6.md` untouched** — and I confirm the reviewer's independent finding that its two changed lines are the producer's `0306` close and the loop's own status mark, not mine. | **fixed** |
| R10 | **CORRECT** — verified by word-diff of the report's caveat against the page's: **four** differences (`(R6)` dropped, `this repo's`→`a`, `model`→`review`, `§1.1`→`paired-quote`), which is **three** phrase-level changes in **one** region. ⭐ **I adopt the reviewer's distinction: five altered REGIONS, six altered TEXTS** — my round-1 "five" counted regions and read as texts. | **Defect** (incomplete disclosure — the exact defect R1 named, recurring) | §7d now states **both counts explicitly** so they cannot be conflated again, and adds row 6: the caveat heading's dropped `(R6)` label — a report revision-history marker that resolves to nothing in a shipped page, and whose *drop* is defensible while its *non-disclosure* was not. | **fixed** |
| R11 | **CORRECT** — verified exactly: `0171/brief.md:88`, `:242`, `:281` = **6 occurrences**; `0171/plan.md:239`, `:245`, `:246` = **3**. **9 total**, all the displaced `adr-012:87`/`:105` pair, inside a declared scope that named `ai-agents/tasks/backlog/`. | **Defect** (false exhaustiveness — fourth instance of "matcher/claim returned too low") | §7f records all nine with their lines. ⛔ **Recorded, never repaired, and I agree that is right rather than a shortfall:** these files are the record *of* the repair — the brief and plan quoting the two naked pointers as the thing to fix — so rewriting them would destroy the evidence, and `plan.md` is byte-frozen. **The defect was the word *"every"***, which is now qualified. | **fixed (record-only)** |
| R12 | **CORRECT — and I reproduced both halves by execution, not reading.** On `\| alpha \| beta \|` searching `alpha beta`: bare **0**, prescribed strip **0**, only `s/\|//g` gives **1**; `diff` confirms the prescribed sed leaves the line **byte-identical**. ⭐ **I also tested the reviewer's warning against bolting on `s/\|//g` and confirmed it independently** — on a two-row table it matches `price 30 tax 5`, a phrase present in **no** cell. A false positive. | **Defect** (in shipped content — a remedy sentence covering a case it cannot cure, on a page that demands stating what a check missed) | **One-clause narrowing, no method change, no invented remedy.** The bullet is split: `>` and `-`/`*` keep the marker-strip, which genuinely cures them; the `\|` case becomes its own limit stating plainly that it **has no cheap remedy**, that deleting pipes buys a false positive for the false negative, and that a phrase which may cross a cell boundary is **unverifiable by this method and must be reported as such**. Six limits now. **Applied to both copies; byte parity re-verified; manifest regenerated.** | **fixed** |

**R12 verified with the page's own prescribed method, in both copies** — strip markers, join, squeeze:
`The `|` sits *between* cells, not at the line start` → **1 / 1**; `unverifiable by this method, and say
so` → **1 / 1**. Byte parity re-checked after: `diff` empty.

## Re-litigates settled decisions (suppressed — recorded, not dropped)

- **Codex High — `adr-031:27`, *"with no Write or Edit tools, deliberately"* is not verbatim in
  ADR-010.** **Fact correct, conclusion wrong.** `ADR-010:33` reads *"It has no Write or Edit tools,
  deliberately"*; ADR-031 substitutes *"with"* for *"It has"* to fit its own sentence. Verified
  wrap-aware: the phrase `no Write or Edit tools, deliberately` **is** at `ADR-010:33`, under
  `## Context`. It is **pre-existing frozen text in an `accepted` ADR** that the brief forbids
  rewriting (*"Repair the pointer; change nothing else on the line"*), and the only thing 0171
  changed there is the anchor — `§Decision 3` → `§Context` — which is **correct**. Already
  adjudicated in `worklog.md` §7b Ruling 1. **Do not send this back a third time.**
- **Codex High — the page's Provenance block ships fkit-repo-only maintenance text into consuming
  projects that have no `claude/scaffold/` and no `dual-home-parity.md`.** **Disproven as a novel
  defect.** `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` — itself
  byte-identical dual-homed — carries the same block almost word for word and closes it
  **"Owner ruling, 2026-07-27."** `plan.md` §1a mandated *"Follow that exactly."* The residue that
  is genuinely new is recorded as **R7**.

## Accepted residuals (shared, do-not-re-litigate)

**Owner dispositions taken 2026-08-15 via `AskUserQuestion` in a live `fkit lead` session driving
`/fkit-sprint-ship-loop`, relayed to this reviewer by the driver. Option labels are verbatim.**

| Finding | Owner disposition (verbatim option label) | What that settles |
|---|---|---|
| **R1** — five undisclosed table alterations | **"Accept as a recorded residual (Recommended by the reviewer)"** | The page's five deviations from the report's table **stand, not reverted**. Each carries a reason in `worklog.md` §7d. ⛔ Do not re-raise the alterations. |
| **R2** — third displacement wave | **"Repair all 6 now, in `0171`"** | All six `adr-016:292` citers repaired by heading substitution. ⛔ Do not re-raise the six. |
| **R3** — `0232` overlap | **"Producer records what `0171` did, and re-measures (Recommended)"** | The overlap is the **producer's** to record in `0232`; ⛔ the coder does not write `0232`'s brief. |
| **residual citers** | **"Repair the authorized surfaces only (the worker's recommendation)"** | Three surfaces repaired; **four left standing**, listed below with their reasons. ⛔ Do not re-raise the four. |

### The four standing residuals — verified on disk this round, notation-agnostic

| Residual | Occurrences (re-derived) | Why it stands |
|---|---|---|
| `ai-agents/sprints/sprint-6.md:206` — `adr-012:87`, `adr-012:105` | **2 occurrences, 1 line** | Standing edit ban on `sprint-6.md`; the owner did **not** lift it. ⭐ **This is `0171`'s own board row**, and the two coordinates it carries are exactly the two naked pointers this task was widened to repair — **the task fixed the citation everywhere except in the sentence announcing that it would.** Both verified displaced (`:87` now lands on the `⛔ Owner:` banner sentence; `:105` is **blank**). |
| `ai-agents/sprints/reviews/sprint2-shared-instructions-delivery.md:35`, `:344` — `adr-016:214` | **2 occurrences, 2 lines** | Closed sprint-2 review ledger, treated as **frozen history**. Displacement re-verified: `HEAD:adr-016:214` = *"- The layer the task asked for is **available today**…"*, working tree `:214` is **blank**. |
| `0232/brief.md` — `adr-012:139-141` at `:105`, `:113`, `:262`, `:394` | ⚠️ **4 occurrences, 4 lines — confirmed FOUR, not one** | The producer holds `0232`; a second writer in one file is how two records diverge. ⭐ **The coder's correction of the driver's figure is right**: the finding named one site, disk carries four. |
| `0171/brief.md`, `0171/plan.md` — `adr-012:87`, `adr-012:105` | **9 occurrences, 6 lines** (see **R11**) | Surfaced this round, unenumerated until now. These files are the **historical record of which pointers were repaired**; rewriting them destroys the evidence, and `plan.md` is **byte-frozen** at `02803660a9c236aaf4dfcc327d7f06af07968f0d`. **Record, never repair.** |

### ⛔ The two boards now disagree — a VISIBLE artifact of the owner's ruling, not a silent one

Verified by this reviewer on disk:

- `ai-agents/sprints/backlog.md:139` now reads **`ADR-012 §Decision 2 and §Decision 4`** — repaired.
- `ai-agents/sprints/sprint-6.md:206` still reads **`adr-012:87`** / **`adr-012:105`** — under the ban.

The same task row, carried byte-identically onto two boards, now carries two different citation forms.
**This is the direct, foreseen consequence of the ruling "repair the authorized surfaces only" meeting
the standing `sprint-6.md` edit ban** — it is recorded here so the next reader finds a *reason*, not a
mystery, and so no future sweep "corrects" one board into agreement with the other without reopening
the ban. ⚠️ **Do not silently reconcile the two boards.** Lifting the ban is an owner call.

## ⛔ Work `0171` did that is credited to another task — `0232` (mirror of `worklog.md` §7g)

**Recorded in this ledger because a reader of `0171` must be able to learn it, without the transcript
and without opening another task's brief.** Re-derived by this reviewer, not copied.

`0171`'s Deliverable B **silently discharged two classes of the open task `0232`** (round-1 **R3**):

- **`0232` Class 5 — discharged in full.** At `HEAD` (`9360177`) the `adr-012` file carried **9
  `adr-010:NNN` occurrences across 7 distinct lines**; the working tree carries **0**. Re-derived at
  both revisions, occurrence-counted with `grep -o … | wc -l`. ⚠️ **Scope stated beside the figure:**
  9/7 is the **`adr-012` file alone**, which is `0232`'s scope. Across the whole
  `knowledge-base/decisions/` directory the figures are **12 occurrences on 10 lines → 0**.
- **`0232` Class 4 item 3 — discharged.** The `adr-012:139-141` **self-citation** in ADR-012's own
  header banner, repaired here.
- **`0232`'s remainder fell from 26 to 16** — 16 code-coordinate occurrences across 12 lines of
  `adr-012`, none touched by `0171`. Arithmetic checks: 16 + 9 + 1 = 26.

**Recorded by the producer, as the owner ruled.** A spawned producer appended **four dated notes** to
`0232`'s brief at `:111`, `:126`, `:240`, `:356` — verified **additions only**, `git diff --numstat` =
**181 / 0**. ⛔ Neither the coder nor this reviewer wrote that file.

⏱️ **Owner-ruled ordering constraint, and the reason it exists — `0232` runs ONLY after `0171`
commits.** The discharge exists **only in the uncommitted working tree**. A revert of `0171` regrows
`0232`'s remainder straight back **from 16 to 26**. ⚠️ This is a hard sequencing fact, not a
preference: `0232` started before `0171` commits will re-measure a tree that is about to change under
it. Neither `plan.md` nor the pre-round-1 worklog mentioned `0232` at all — **that silence was the
defect R3 caught**, and this section is its remedy.

## Verified and confirmed — claims that survived checking

Recorded so they are not re-derived or re-corrected next round.

- **The "defective at authoring" framing is CORRECT for all ten `adr-012` pointers**, not just the
  one spot-checked. `adr-012`'s blob is byte-identical `dbeeb0fe431435f1fb6a51b9ea09bc9d97b8b9ad` at
  `4140e77` and at `HEAD`, so HEAD's text **is** the authoring-time text. Each cited range at HEAD
  lands on unrelated text: `:92` = a **blank line**; `:21-23` = the ADR-010 opening sentence (the
  `--settings` inheritance line is at `:39`); `:130` = *"open question). Deferring it is what makes
  Decision 3's benign leak necessary."* (claimed text at `:141`); `:139-141` = the consult-path
  bullet (the re-raise trigger is at `:156`); `:95-98` = the survey-project cost bullet (the hook
  question is at `:112`); `:142-143` = the `SKILL.md` rewording bullet (*"widens the leak"* is at
  `:154`); `:154-156` = the re-raise bullets (*"Its file is kept intact"* is at `:171`).
  ⛔ **This framing has now been corrected twice and verified once. It is right. Leave it.**
- **`adr-042:379` → `adr-016:73` is undisplaced** — `HEAD:73` and working-tree `:73` are identical
  strings.
- **Zero residual `adr-010:NNN` and zero residual `adr-012:NNN` inside `decisions/`** — re-derived
  wrap-aware, occurrences via `grep -o … | wc -l`.
- **R20 narrowed wording carried verbatim**; `never be a mutable coordinate` = **0 / 0** in both
  copies; the withdrawn wording is absent from the report too.
- **Dual-home link bans held.** The page's only markdown links are `priority-is-rank-not-identity.md`
  and `evidence-before-assertion.md`, both present in **both** trees. No link into `reports/`,
  `decisions/`, `tasks/`, `sprints/`, or to `dual-home-parity.md`. `](config.ts)` is inside a
  double-backtick code span and is not a link.
- **Byte parity holds.** Both copies are git blob `4ae8a8693bd7fe1f7e098b7f3854c67a65c2a9b1`; `diff`
  is empty.
- **Every count re-derived from disk and correct.** Scaffold conventions excl. `README.md` = **8** →
  *"Eight conventions ship with the scaffold"* ✅. Live **9** / scaffold **8**, delta exactly
  `dual-home-parity.md` ✅. `structure-spec.md` Table A = **19**, Table B = **30**, total **49** —
  matches `EXPECTED_ROWS = 49` and the `19 Table A dirs + 30 Table B files` comment ✅. The live
  README's `†` footnote *"Three of them"* is **true**: the byte-identical set measured across both
  trees is exactly `task-owner-vocabulary.md`, `priority-is-rank-not-identity.md`,
  `durable-citation-anchors.md` ✅. Manifest `+2` lines, both correct ✅.
- **The two hand-edited `conventions/README.md` files — which no test covers, being a deliberate
  `index` parity exception — were compared by hand and are in step.**
- **The ADR diffs touch citation text only.** No prose, `**Status:**`, date, heading or decision text
  changed in any of the four files.

## Round 2 — re-derived and confirmed (do not re-derive next round)

Every figure below was measured by this reviewer on 2026-08-15, **notation-agnostically**
(`adr-0NN[^ )`"]*:[0-9]`), never with the `adr-0NN:NNN` pattern that under-counted in round 1.

- ⭐ **The page's own prescribed verification command WORKS — run, not read.** On
  `Owner ruling, 2026-08-01.` at `:222-223`, **in both copies**: naive `grep -c` **0**; the page's
  step-2 join+squeeze **0**; the prescribed marker-strip form **1**. **The third false zero
  reproduces exactly, and the broadened limit cures it.** (Its one over-claim is **R12**.)
- **All six `adr-016:292` citers repaired.** Residual occurrences of that pointer anywhere in the
  tree, excluding `0171`'s own `worklog.md`/`review.md`: **0**.
- **The three authorized repairs landed and are citation-text-only.** `backlog.md:139` →
  `ADR-012 §Decision 2 and §Decision 4`; `backlog.md:186` →
  `ADR-012 §Consequences, *"reopen Decisions 3 and 4 together"*`; `0286/brief.md:157` →
  `` `…/adr-016-…md` §"Delivery is structural…", *"Zero hooks"* ``. ✅ **No `## Status`, no Priority
  cell, no rank, no row order and no href changed at any of the three** — verified per hunk: every
  one is a single-line `@@ -N +N @@` substitution.
- **No third-party citer of the five rewritten `backlog.md` lines exists.** Sweeping
  `backlog(\.md)?:(139|186|220|222|225)` repo-wide returns only `0171`'s own `worklog.md` and
  `review.md`. Nobody else was pointing at the text that changed.
- **Wave 4 does not exist — re-derived, with the scope stated beside the conclusion.** Scope: all
  `*.md`/`*.js`/`*.sh` in the repository, tracked and untracked, excluding `node_modules/` and the
  gitignored `.claude/` mirrors. **55 `backlog.md:NNN` pointer occurrences; all target lines < 249;
  the only displacing hunk is the pre-existing `+4` at `:249`.** Nothing cited moved. ⚠️ The
  worklog's supporting *figures* are wrong — see **R8** — the conclusion is not.
- **Line counts for the other repaired files, re-derived:** `0286/brief.md` **325 → 325**,
  `0276/brief.md` **236 → 236**, `0278/brief.md` **232 → 232**, `0281/brief.md` **202 → 202** — all
  `+1/−1` same-line substitutions, exactly as claimed. ⛔ **Only `backlog.md`'s figure was wrong.**
- **`plan.md` is byte-frozen and intact** — `git hash-object` = `02803660a9c236aaf4dfcc327d7f06af07968f0d`.
- **The two page copies are byte-identical** — both `git hash-object` = `1a633b444bf6319c6b2da3f4909d02b0e5fc60aa`.
- **The dual-home link ban holds after the round-1 repairs.** The page's only markdown links remain
  `priority-is-rank-not-identity.md` (×2) and `evidence-before-assertion.md`, both present in **both**
  trees. Zero occurrences of `wiki-vault`, `adr-010`, `adr-043`, `sprints/reviews` or
  `tasks/cancelled` in either copy. `](config.ts)` is inside a code span, not a link.
- **`test/structure-check.test.js`: 28 pass / 0 fail, exit 0** — re-run by this reviewer.
  ⚠️ The **full** suite was not re-run here; the 730/730 figure is the coder's and the driver's.
- **Both Codex findings suppressed in round 1 stayed suppressed.** Neither reappeared, and neither is
  re-raised here.
- ⓘ Two harmless drifts noted, no action: `worklog.md` §7d locates the Provenance attribution at
  `:220-221`; it is at `:222-223` today — a dated coordinate that drifted **inside its own task**,
  which is this page's thesis demonstrating itself. And §7d's *"a SIXTH limit … rather than adding a
  seventh"* does not line up with the page's **five**-bullet limit list; the list is correct.

## Convergence call

⭐ **Called proactively: `0171` has converged. Recommend closeout after R12.**

Round 2 surfaced **zero** new defects in behaviour and **zero** re-openings of a round-1 finding. Of
the five new findings, four (**R8**, **R9**, **R10**, **R11**) are **evidence and disclosure errors in
`worklog.md`** — the record, not the deliverable — and every substantive conclusion they touch
**survives re-derivation**. Only **R12** touches shipped, dual-homed content, and it is a one-clause
narrowing of a sentence whose method is otherwise verified correct by execution.

⚠️ **The honest pattern, stated rather than buried:** this task has now produced **four** distinct
instances of a matcher or a count returning a figure that was too low or simply not on disk — the
round-1 `adr-016:292` under-count, the R7 false zero, the `backlog.md` `407 → 407` figure (**R8**), and
the incomplete `tasks/backlog/` enumeration (**R11**). That is not a reason to keep the task open; it
is the strongest possible evidence for the page the task ships, and **Piece 7 already names the class**.
Further rounds would keep finding instances of the thing the page exists to warn about. **Stop here.**

⛔ **Not converged into agreement, and deliberately so:** the two boards disagree (`backlog.md:139` vs
`sprint-6.md:206`). That is a recorded, reasoned residual of the owner's ruling, not drift.
