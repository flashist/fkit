# Implementation plan — `0176` Build the coordination-citation policy guard

**Planned 2026-09-02 by a spawned `fkit-coder` (plan-only; no source written, no `plan.md` created).**
**Every figure below was measured firsthand at this plan gate. None is inherited from the brief.**

---

## 0. Provenance of the specification I will transcribe

| Item | Value |
|---|---|
| Condition document | `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md` |
| Revision taken | committed at `c797df4`, working tree clean and identical |
| Document md5 **today** | `163d85e16df278706ebc2d6c59a31998` |
| Document md5 **the brief records** | `fea9ce0a5b71acda7f3070e76d0f8ccc` |
| §4.2 extract (the script only) md5 | `6c6242a6d57f3625961143b723c3e0ad` |

⚠️ **The brief's checksum does not resolve to any committed revision.** The document has exactly one commit (`c797df4`). The brief's `fea9ce0a…` was taken on 2026-08-30 from an **uncommitted working-tree** revision, while review round 2 was still open — which the brief itself warned about (*"§4.2 may change… say in the worklog which revision you took"*). **I take `c797df4`, and the worklog will record it and this discrepancy.** This is the eighth defect in the brief's record, beyond the seven its correction block names.

---

## 1. The brief's seven falsified places — found, and what each actually is

The dated correction block names seven. I located all seven and re-measured each claim.

| # | Where | What the brief says | What is actually true | My re-measurement at this gate |
|---|---|---|---|---|
| **1** ⛔ headline | Verification step 4 | A citation planted in `done/*/brief.md` or `done/*/worklog.md` **fails** the guard | **INVERTED.** Both must **PASS**. Owner ruling 2026-08-29, option label verbatim **"Widen to the whole closed folder (Rec)"**. The corrected step-4 table is in §"⭐ RE-SCOPED 2026-08-30" | Building it as written gives **RESIDUAL 49 across 23** (`OLD_EXEMPT=1`). ⭐ **Reproduces the brief's "49 across 23 closed `done/` files" exactly** |
| **2** | OWNER RULING 2's closing paragraph | *"It names `done/*/review.md` only. `done/*/brief.md` and `done/*/worklog.md` are NOT exempt"* | **SUPERSEDED** by the same 2026-08-29 ruling. `tasks/done/**` and `tasks/cancelled/**` exempt **in whole** — `brief.md`, `plan.md`, `worklog.md`, `review.md` alike. A later **owner** ruling, not an agent reopening one | Settled exemption today: **166 across 66**. Old shape: 117 across 43 |
| **3** | `## Context` → §"The file and the condition" CONDITION blockquote | Target list is `ai-agents/sprints/*.md`, `ai-agents/tasks/*/*/brief.md`, `ai-agents/wiki-vault/log.md` | **TOO NARROW.** The cited (target) class also includes **`plan.md`, `worklog.md`, `review.md`**. Owner 2026-08-30, **"Not a reopening — widen it (Rec)"**. The gap existed because the condition predates ADR-029 moving those files into the task folder | Carried in §4.2's `TARGET` as the alternation `(?:brief\|plan\|worklog\|review)\.md` |
| **4** | §"The red set" table + its list of 8 residual files | `38 / 19`, `27 across 11`, headline **`11 across 8`**, and 8 named residual files | **ALL STALE.** Superseded twice — by the 2026-08-30 re-measure (`19 across 14`) and again by `0237`'s cleanup | ⭐ **RESIDUAL 0 across 0.** The 8-file list is superseded in full; one of its entries (`sprints/sprint-2.md`) no longer exists at that path |
| **5** | Scoping decision 2 | *"This convention changes the count by zero (38 either way)"*, stated twice as a hard zero | **FALSE as a general claim** — measured 2026-08-30 it moved the total by **8** (190 → 182) | ⚠️ **Today it moves the total by 0** — `166 across 66` both with and without the convention (`FENCES=0 QUOTES=0`). **This does not restore the original claim.** It was false when measured; the figure is tree-dependent, and the 2026-08-30 contributor (7 of the 8 were `0353`'s own ledger quoting inside a fence) has since closed into the exemption. **The decision is unchanged: adopt the convention** |
| **6** | The whole brief | **SILENT on inline code spans** | ⛔ **RULED: this half does NOT skip them.** The sibling link half **does**, so reasoning by analogy gets it backwards. Every coordinate in this repo is written inside backticks because that is house style; for this half backticks are formatting, not quoting | Measured today: skipping spans (`SPANS=1`) takes the total **166 → 5**. The brief recorded 182 → 6. ⭐ **A 33× gutting of the guard.** Residual is 0 → 0 today only because `0237` already cleaned it |
| **7** | Verification step 6 | `git diff --stat` shows no file under `ai-agents/tasks/done/*/review.md` modified | **TOO NARROW.** Must widen to all of `tasks/done/**` and `tasks/cancelled/**`, or the do-not-touch check no longer covers what the ruling protects | Baseline verified clean at this gate: `git status --porcelain` over both trees returns **empty** |

**Also stale, not among the seven, recorded so it is not mistaken for drift I introduced:** the 2026-08-30 correction table asserts `## Status` = `🔲 Backlog` ✅ still true. It now reads `🔄 In progress` — set by the sprint driver today, correctly. Not a defect; the correction table's row is simply superseded by ordinary board movement.

---

## 2. ⭐ THE NAMED QUESTION — would this guard red a correctly-formed review ledger?

**Answer: yes, it would — and after reading the convention end to end, I believe that is the *correct* behaviour, not a defect. But it is a judgment call with a recurring cost, so it goes to the owner rather than being settled here.**

### 2.1 The finding is real, and it is structural — not hypothetical

Three independent confirmations, all measured at this gate:

1. **The reviewer's own skill mandates the form.** `claude/skills/fkit-stateful-review/SKILL.md` prescribes a findings table whose fourth column header is literally **`file:line`**, and its rules section instructs *"verify every claim; cite `file:line`"*. A reviewer following the skill correctly, reviewing a task brief or a sprint board, writes exactly the coordinate this guard flags.
2. **An open task's `review.md` is inside the scanned set and is not exempt.** The exemption is `tasks/done/**` and `tasks/cancelled/**` only. A review ledger is open for precisely as long as the review is running — which is when CI runs.
3. **The dodge has already been used, and it cost something.** `0237`'s own `review.md` measures clean only because its reviewer split every coordinate across two table cells (`` | `0348`'s brief | 96 (note at 62) | ``) and wrote bare `` `:10` ``, `` `:124` ``, `` `:14` `` with no path prefix inside the Claim cells. ⚠️ **And that ledger's own finding R1 is a complaint that the resulting anchor is ambiguous.** The workaround produced the defect the workaround's own author then filed.

### 2.2 What the convention actually rules — read whole, not in one section

The spawn brief characterised `durable-citation-anchors.md` as ruling `file:line` **correct** for a review ledger. That is what **row 2** and the **§"Review-ledger practice"** section say in isolation:

> *"A file **under review**, cited in a review ledger row → `path:NNN` is correct — as a claim"*
> *"A review finding's `file:line` cell **stands**… nothing on this page bans it."*

⭐ **But the same page rules the opposite when the target is a coordination document, and says so explicitly.** Row 3 rules `path:NNN` **wrong, categorically**, for *"a coordination document others append to — sprint plans, task briefs, an append-only project log"*. And the page's own scope note pre-empts exactly this collision:

> *"Row 3 it actively contradicts — citing a sprint board line as a claim about a revision you read answers 'claim', and therefore 'safe', while the table rules `path:NNN` **wrong** there, **categorically**… **So both conditions must be read together**: the claim-versus-pointer question **and** *is the target a document a third party edits under me?* **The second condition is what makes row 3 categorical**, and it is the one a writer skips."*

**Reading:** row 2 governs a review of a *source file*. Row 3 governs the *target class*, categorically, and the scope note says the target condition is what makes it categorical. A review row citing a **task brief** by line number is therefore ruled **wrong** by the convention — and the correct form is the heading-plus-quoted-fragment anchor, which is what `0237`'s R1 finding was itself arguing for.

⚠️ **The tension is genuine and I am not glossing it.** The sentence *"nothing on this page bans it"* is a real counter-argument, written without the coordination-document case in mind. This is why the question is put to the owner rather than closed by me.

### 2.3 Live cost, measured

| Measure | Value at this gate |
|---|---|
| `review.md` files anywhere under `ai-agents/tasks/` | **133** |
| …of them under `backlog/` (open, in the scanned set, **not** exempt) | ⭐ **0** |
| …of them under `done/` (exempt) | **133** |
| Residual hits contributed by any review ledger today | ⭐ **0** |

⭐ **The guard ships green under every option below.** The cost is entirely prospective — it lands the first time a stateful review runs on a task whose subject is a coordination document. `0356`, `0357` and `0358` — the three sweeps this guard gates — are exactly that shape.

### 2.4 The options

| | Option | What it does | Cost |
|---|---|---|---|
| **A** ⭐ **(Rec)** | **Ship as specified. No exemption for review ledgers.** | A coordination-document coordinate is flagged wherever it is written, open review ledger included | Reviewers must anchor by heading + quoted fragment when the target is a coordination document — which the convention already requires. **Recurring friction on every future doc-task review**, and the split-cell dodge stays available with its measured ambiguity cost |
| **B** | **Exempt open `review.md` from the citing side** — add `ai-agents/tasks/*/*/review.md` to `exempt()` | Review ledgers may write the banned form freely | ⛔ Silently widens the exemption from *"closed records are frozen"* to *"ledgers anywhere"*. A review ledger is the single place this repo writes the most coordinates, so this is the largest hole available. **Not in §4.2** — adding it is re-deciding the specification, not transcribing it |
| **C** | **Narrow the target class** so a citer and its target in the same task folder do not count | Self-citation inside one review is allowed | Unmeasured, not in §4.2, and does not cover the common case (a review of a *sprint board* or of *another* task's brief) |
| **D** | **A, plus a follow-up amending the reviewer skill's guidance** so the `file:line` column is documented as *"heading + fragment where the target is a coordination document"* | Removes the pressure that produced the split-cell dodge | One follow-up task, producer's to file. **Does not block this task** |

### 2.5 My recommendation: **A, with D filed as a follow-up**

1. **§4.2 contains no such exemption, and the brief forbids paraphrase.** Adding one is re-deciding the condition, and *"five hand-written matchers produced five different figures"* is why re-deciding is banned here.
2. **The convention supports flagging it.** Row 3 is categorical and the scope note names the target condition as what makes it so.
3. **Measured live cost is 0** — the guard ships green under A, today.
4. **B is precisely the "silently widen an exemption" my instructions forbid** without the owner saying so by name.
5. **The friction A creates is the rule working**, not the rule misfiring — and D removes the part of it that is merely an un-updated skill doc.

⛔ **I am not applying this. It changes what ships and what every future reviewer must write. It is the owner's call.**

---

## 3. Re-measured residual at this plan gate

**Method:** extracted §4.2 verbatim (the fenced `js` block, lines 519–669 of the condition document) to a **session scratchpad — never into the repo** — and ran `node coordination-citation.js` from the repo root. Nothing was written into the working tree.

```
SCANNED:  718 files
TOTAL:    166 citations across 66 files
EXEMPT:   166 across 66 files
RESIDUAL: 0 across 0 files
```

⭐ **`RESIDUAL: 0 across 0` — reproduced. This is a fourth independent context confirming `0237`'s closing figure.**

**Every recorded alternate reading, re-run at this gate:**

| Reading | Command | Scanned | Total | Exempt | Residual | vs. 2026-08-30 |
|---|---|---|---|---|---|---|
| ⭐ **Settled** (all defaults) | `node …` | 718 | **166 / 66** | 166 / 66 | ⭐ **0 / 0** | was 182 / 79, residual 19 / 14 |
| Nothing masked | `FENCES=0 QUOTES=0` | 718 | 166 / 66 | 166 / 66 | 0 / 0 | was 190 / 80 — **the convention now moves the total by 0, not 8** |
| Spans also skipped | `SPANS=1` | 718 | ⛔ **5 / 4** | 5 / 4 | 0 / 0 | was 6 / 5 — ⭐ **the 33× trap, confirmed** |
| Widened to `sprints/done` + `sprints/reviews` | `WIDE=1` | 726 | 172 / 68 | 166 / 66 | ⛔ **6 / 2** | brief records **+4**; ⚠️ **it is now +6.** Reconfirms OUT is the right call, and the cost grew |
| 2026-08-01 exemption shape | `OLD_EXEMPT=1` | 718 | 166 / 66 | 117 / 43 | ⛔ **49 / 23** | ⭐ **reproduces the brief's "49 across 23" exactly** |

**Why the total fell 182 → 166 and the residual 19 → 0:** `0237` cleaned the residual, and several citing folders closed into `done/**` since 2026-08-30. Scanned-set size rose 708 → 718 as new task folders were filed.

⚠️ **This is a snapshot of a live tree.** The repo's own coordination documents are inside the scanned set and this team writes to them continuously. It will be re-measured immediately before the green run.

---

## 4. What I will build

**One new file. Nothing else changes.**

| File | Change |
|---|---|
| `test/coordination-citation-policy.test.js` | ⭐ **NEW** — the only file created or edited |
| `package.json` | ⛔ **unchanged** — picked up by the existing `node --test test/*.test.js` glob (verification step 1) |
| `test/prove-red.sh` | ⛔ **unchanged** — see §7 |
| `test/reference-integrity.test.js` | ⛔ **unchanged** — but its behaviour changes; see §6 |
| Anything under `ai-agents/tasks/done/**`, `cancelled/**`, `wiki-vault/**` | ⛔ **never touched** |

The file follows `test/reference-integrity.test.js` (task `0354`, the sibling half) as its structural precedent in every respect — it is the same fourth test-scope category (an invariant over the repo's own `ai-agents/` content), by the same instruction in §4 of the condition document: *"`0354` transcribes Half A into `test/reference-integrity.test.js`; `0176` transcribes Half B into `test/coordination-citation-policy.test.js`."*

### 4.1 Target class, scanned set, exemption set — exact

**Scanned set** — `ai-agents/tasks/<board>/<folder>/*.md` (every `.md`, every board) **+** `ai-agents/sprints/*.md` (top level only).

| Surface | In / Out | Authority |
|---|---|---|
| `ai-agents/tasks/**/*.md` (all boards) | **IN** | Scoping decision 1, unchanged |
| `ai-agents/sprints/*.md` (top level) | **IN** | Scoping decision 1, unchanged |
| `ai-agents/sprints/done/**`, `ai-agents/sprints/reviews/**` | ⛔ **OUT — never walked** | `0353`, for this half. Measured cost of including: **+6 and 0** at this gate |
| `ai-agents/knowledge-base/**` | ⛔ **OUT** | Scoping decision 1 — a report cites a coordination document **as the specimen it is diagnosing** |
| `ai-agents/wiki-vault/**` | ⛔ **OUT — never walked, never written** | ADR-005 |
| `claude/`, `test/` | ⛔ **OUT** | Scoping decision, unchanged |

**Exemption set** — inside the guard's **definition**, consulted within the scan loop and counted into an `EXEMPT` bucket, never a post-filter over a finished list (OWNER RULING 2, unchanged; verification step 3 proves it):

```
ai-agents/tasks/done/**       →  EXEMPT IN WHOLE (brief · plan · worklog · review alike)
ai-agents/tasks/cancelled/**  →  EXEMPT IN WHOLE
ai-agents/tasks/backlog/**    →  NOT exempt
ai-agents/sprints/*.md        →  NOT exempt
```

**Match rule — three prongs, transcribed byte-identical from §4.2:**

1. ⭐ **LITERAL** — a full `ai-agents/`-prefixed path followed immediately by a colon and digits. **OWNER RULING 1, unchanged and NOT reopened.** Resolved shorthand (a bare board name or a bare `NNNN/brief` followed by a line number) is **refused by name** — not folded in, not a flag, not behind an option. **I will pin this refusal as a positive assertion (M6) so a later well-meaning widening turns the suite red.**
2. **Cited (target) class** — `ai-agents/sprints/<name>.md` · `ai-agents/tasks/<board>/<folder>/{brief,plan,worklog,review}.md` · `ai-agents/wiki-vault/log.md`.
3. **Left boundary** `(?<![\w./-])` — so a suffix of a longer token is not a hit. Cost 0.

**Masking:** fenced blocks and blockquote lines skipped, on CommonMark's fence-close rule (a *closing* fence carries **no info string**). ⛔ **Inline code spans NOT skipped.**

### 4.2 Deviations from §4.2 — named, not discovered late

Following `0354`'s D-numbering precedent.

- **D1 — CJS preamble becomes ESM.** House idiom: all 26 existing `test/*.test.js` use `import`. Default imports, so every transcribed call site stays literally `fs.readFileSync` / `path.join`. **Cost 0.**
- **D2 — the `OPT` environment switches are dropped; every switch hard-wired to its settled default.** §4.2's own header: *"The SETTLED condition is every switch at its default."* A guard that can be talked out of its own condition by an environment variable is not a guard. Exactly `0354`'s D3. **Cost 0.**
- **D3 — the root is a parameter, not a module-global `process.cwd()`.** This is the fixture seam: it lets the mutation arms run against a tree in `os.tmpdir()`, so proving the guard reddens inside `tasks/done/` costs **zero bytes written into this repo**. The live condition always runs against `REPO` from `test/harness.mjs`. A test seam, never an environment switch. Exactly `0354`'s S1. **Cost 0.**
- **D4 — `maskCodeSpans` is NOT transcribed.** §4.2 defines it but gates it behind `OPT.spans`, whose settled default is **off**; under D2 it becomes unreachable dead code. ⛔ **Shipping a dead function that, if ever wired up, silently takes the guard from 166 hits to 5 is a hazard, not fidelity.** In its place I assert the ruling **positively** (arm **C4**: a coordinate inside backticks **must** red). That is strictly stronger protection than keeping the function. ⚠️ **Named as an open question (§9 Q4) — it is the one place I depart from a function the document contains.**
- **D5 — instrumentation.** `scan()` returns `visited`, `total`, `exemptCount` and `residual` so the arms can prove **what** was scanned, not merely that nothing was found. Consulted by no match rule; removing it changes no verdict.

⭐ **Byte-identical, and I will say so precisely rather than overclaim:** `TARGET`, `blank`, `exempt` and `maskFencesAndQuotes` are transcribed byte-identical **modulo D2** (removal of the `OPT.*` references — which is what D2 *is*). The scan loop is **not** byte-identical: it reads a `root` parameter and increments counters. The decision it reaches for any given line is unchanged.

---

## 5. Test design

`node --test`, zero devDependencies (ADR-014). Pure functions exported; every mutation fixture built under `os.tmpdir()`; the live corpus opened **read-only**.

### Live-corpus arms

| Arm | Asserts | Expected today |
|---|---|---|
| **L1** | The scanned set is non-empty and large | `> 500` files; diagnostic reports the exact **718** |
| **L2** ⭐ | **RESIDUAL is 0 under the settled condition** — the shipping condition | **0** |
| **L3** | The arithmetic closes: `total === exemptCount + residual.length`, and `exemptCount > 0` | 166 = 166 + 0. ⭐ *Carries blind spot 9(b)'s lesson from the sibling half: an assertion of only `residual === 0` stays green if the exemption silently swallows an instance* |
| **L4** | Every exempt path lies under `tasks/done/` or `tasks/cancelled/` — the exemption cannot drift wider unnoticed | all 66 |
| **L5** ⭐ | **Closed folders WERE visited, then exempted** — `visited` contains `done/**` files **and** their hits are counted in `exemptCount`. This is verification step 3's *"in the definition, not a post-filter"* made checkable rather than claimed | passes |
| **L6** | Scope negative: no file under `sprints/done/`, `sprints/reviews/`, `knowledge-base/`, `wiki-vault/`, `claude/`, `test/` was ever visited | 0 each |
| **L7** | Disclosure `t.diagnostic` — scanned / total / exempt / residual, plus each named blind spot's re-measured live cost | — |

### Mutation arms — fixtures in `os.tmpdir()`, nothing written into the repo

| Arm | Planted at | Must | Why |
|---|---|---|---|
| **M1** | `tasks/backlog/<f>/brief.md` | ⛔ **FAIL** | Open board. And it stops failing when removed — proves the arm is live |
| **M2** | `tasks/backlog/<f>/worklog.md` | ⛔ **FAIL** | Open board; the citing-side set was always `*.md` |
| **M3** | `sprints/<board>.md` | ⛔ **FAIL** | Live board |
| **M4** ⭐ | `done/<f>/brief.md`, `worklog.md`, `plan.md`, `review.md`, `cancelled/<f>/brief.md` | ⭐ **all five PASS** | ⭐ **The corrected step 4, transcribed not paraphrased.** This is the arm the brief's inverted step 4 would have gotten backwards |
| **M5** | From an open file, a citation **of** `…/plan.md`, `…/worklog.md`, `…/review.md` | ⛔ **FAIL** | The widened cited class, owner 2026-08-30. Step 4 never tested the target prong |
| **M6** ⭐ | In an open file: a bare board name + line number, and a bare `NNNN/brief` + line number | ⭐ **both PASS** (not matched) | ⭐ **Pins OWNER RULING 1's refusal as an assertion**, so a later widening reds instead of sliding in |
| **M7** | `notai-agents/sprints/x.md` + line number; `claude/scaffold/ai-agents/tasks/x/y/brief.md` + line number | **both PASS** | Left boundary, blind spot 7, cost 0 |
| **M8** | A `claude/…` source-file coordinate in an open file | **PASS** | ⭐ The deliberate non-flag (blind spot prong B) asserted, so the refusal to widen is **visible** rather than accidental |

### Correctness arms

| Arm | Asserts |
|---|---|
| **C1** | A coordinate inside a fenced block is masked — **plus the control**: the same coordinate outside the fence reds, so the skip case proves something |
| **C2** | CommonMark fence close — a *closing* fence carries no info string; a nested opener with an info string does **not** end the block early. *This is the bug that was introduced once and copied into both specification maskers* |
| **C3** | A blockquote line is masked, with its control |
| **C4** ⭐ | ⭐ **Inline code spans are NOT skipped — a coordinate inside backticks REDS.** The 30× trap, pinned. This is D4's replacement for the dead function |
| **C5** | ⭐ **An elided target counts** — a coordinate whose folder segment contains `…` reds. The deliberate divergence from the link half (blind spot 10), pinned so it reads as a ruling rather than an accident of two scripts |

⛔ **I will not duplicate C7's parity check from this side** — the sibling already owns it.

---

## 6. What **C7** asserts, and what arming it does

**`C7 masker parity with the citation half (§7 item 14)`** in `test/reference-integrity.test.js` is a **byte-for-byte source comparison**. It:

1. reads `test/coordination-citation-policy.test.js`;
2. locates the declaration with `/(?:async\s+)?function\s+maskFencesAndQuotes\s*\(/` — capturing modifiers deliberately, because a plain `indexOf('function …')` yields a slice identical to its own on an `async` sibling, a measured **false parity**;
3. brace-scans to the closing `}`;
4. compares that slice against its own `maskFencesAndQuotes.toString()`, CRLF-normalised and trimmed.

**Today it is `skip`ped** with a loud diagnostic, because the sibling does not exist. ⭐ **The moment my file lands the skip becomes a live assertion — an existing test file changes behaviour without being edited.** That is the design: `0176` does not have to remember to build the check.

### What this constrains in my file — and it is not a free constraint

⛔ **`maskFencesAndQuotes` in my file must be byte-identical to the one shipped in `test/reference-integrity.test.js` — which is the OPT-free form, not §4.2's OPT-gated form.** §4.2's copy reads `return OPT.fences ? blank(line) : line`; the shipped sibling reads `return blank(line)`. **These two instructions collide**, and the resolution is D2: `0354` already dropped the switches under the same reasoning, and the settled condition *is* every switch at its default. So the OPT-free form is the condition, not a paraphrase of it.

Two further constraints, from C7's own documented edges (both fail **safe** — they report drift that is not there, never parity that is not there, and are deliberately unfixed):

- the function must sit at **column 0** — a re-indented copy compares unequal;
- no `}` inside a string literal in the function body — it would truncate the brace scan.

### ⭐ Verified empirically at this plan gate, not assumed

I simulated C7 against a scratchpad sibling carrying the transcribed OPT-free masker, importing the **real** `maskFencesAndQuotes` from `test/reference-integrity.test.js`:

```
ours starts with "export"? false
C7 PARITY: PASS
```

Two facts confirmed rather than reasoned about: `Function.prototype.toString()` does **not** include the `export` keyword (so C7's slice, which starts at `function`, is symmetric), and the transcribed form matches byte-for-byte. **This is the single highest-risk mechanical detail in the task and it is now measured.**

---

## 7. `test/prove-red.sh` — **no new mutation arms**

**Decision: none. The existing 28 mutations are untouched, and the file is not edited.**

**Precedent and reasoning, both already owner-ruled for the sibling half** — recorded verbatim in `test/reference-integrity.test.js`'s header, **owner ruling 2026-09-02, option label verbatim "No prove-red entry — follow the precedent (Rec)"**:

> All 28 prove-red mutations target an executable artifact reachable through an **environment seam** (`FKIT_LAUNCHER`, the hooks, `FKIT_RELEASE_MJS`, `FKIT_FRONTMATTER_ROOT`). `ai-agents/` has **no such seam**, and inventing one would mean shipping a production environment variable whose only purpose is to point the repo's own content guard somewhere else — the exact shape D2 rejects.

**Verified at this gate:** `test/prove-red.sh` carries 28 mutations and references **none** of the four `ai-agents/`-content guards (`task-id-uniqueness`, `adr-number-uniqueness`, `closed-rank-immutability`, `reference-integrity`). Each of those discharges the red-first duty the other way — exporting pure functions and reddening them against negative fixtures in-file.

⭐ **My M and C arms ARE the mutations.** Each fails when the condition is broken, and M1 explicitly asserts both directions (reds when planted, greens when removed).

⚠️ **This transfers a ruling given for `0354` to `0176`.** The reasoning is identical and the artifact class is identical, but it is a different task — so it is listed as an open question (§9 Q2) for a one-word re-affirmation rather than assumed silently.

---

## 8. How I verify, with expected figures

| # | Check | Expected |
|---|---|---|
| 1 | Re-run §4.2 from the scratchpad immediately before the green run | **RESIDUAL 0 across 0** — ⛔ if it has moved, I stop and report rather than cleaning anything (cleanup is `0237`'s scope, and `0237` is closed) |
| 2 | `node --test test/coordination-citation-policy.test.js` | all arms pass |
| 3 | ⭐ `node --test test/reference-integrity.test.js` | ⭐ **20 tests, 20 pass, 0 skip.** Today: 20 tests, 19 pass, **1 skip** (C7). **The skip becoming a pass is the proof C7 armed** |
| 4 | `npm test` | ~830 tests, **0 fail, 0 skip**. Today the driver measured **812 / 811 pass / 0 fail / 1 skip**. ⚠️ **The total is approximate** — it depends on my final arm count. **The load-bearing prediction is `0 skip`, not the total** |
| 5 | `bash test/prove-red.sh` | `✓ hard gate PASSED`, **28 mutations**, unchanged |
| 6 | **The red run, reported alongside the green one** (step 5) | Invert `exempt()` to `() => false` → **RESIDUAL 166 across 66**. Restrict it to the 2026-08-01 shape → **RESIDUAL 49 across 23**. ⭐ Both measured at this gate; the second reproduces the brief's own figure exactly |
| 7 | `git status --porcelain ai-agents/tasks/done ai-agents/tasks/cancelled` (step 6, **widened** per correction 7) | **empty** — baseline verified empty at this gate |
| 8 | `git status --porcelain` overall | exactly one new untracked file, plus whatever the driver writes |
| 9 | Step 7 disclosure | the incompleteness stated **by name** in the close report — see §10 |
| 10 | Step 8 | the shorthand extension **named, not implemented** — and additionally pinned by arm **M6** |

⛔ **No commit, no push. No task file moved. Nothing written to `ai-agents/wiki-vault/`.**

---

## 9. What I will deliberately NOT flag, and why

Each is a **ruled** non-flag, not an oversight, and each is asserted or disclosed rather than left implicit.

| # | Not flagged | Re-measured cost at this gate | Authority |
|---|---|---|---|
| 1 | **Resolved shorthand** — a bare board name or bare `NNNN/brief` + line number | `0013`'s brief carries one, live and **open** (see §10) | ⭐ OWNER RULING 1, refused **by name**. Pinned by **M6** |
| 2 | ⭐ **Source-file coordinates cited from inside the scanned set** (`claude/…` or `test/…` + line number) | ⭐ **249 instances across 45 files.** Was 250 / 46. Top contributors unchanged: `sprints/backlog.md` (44), `0232`'s brief (37), `0197`'s brief (13), `0286`'s brief (10) | Brief refuses the widening by name. Pinned by **M8**. ⚠️ Counts *coordinates*, **not verified-stale ones**; matcher-dependent (216–250 across three matchers) |
| 3 | **Citing sites outside the scanned set** — the three known-stale citations in `test/` and `claude/skills/` citing `claude/fkit-claude-init.sh` | **3** | Both prongs fail (target class *and* citing scope). Red-team fixtures, not an instruction to widen |
| 4 | `ai-agents/sprints/done/**` and `sprints/reviews/**` | ⚠️ **+6 and 0** — the brief records **+4**; re-measured today it is **+6** | `0353`, for this half. ⛔ The link half was ruled the **other** way on both — do not import its answer |
| 5 | `ai-agents/knowledge-base/reports/**` | not measured | Scoping decision 1 — a report cites a coordination document **as the specimen it is diagnosing** |
| 6 | Anything inside a **fenced block** or on a **blockquote line** | **0 today** (the convention moves the total by 0 at this gate; it moved it by 8 on 2026-08-30) | Scoping decision 2 |
| 7 | **Whether any coordinate is actually stale** | unmeasurable | The condition is **syntactic**. *"No check can verify that line N still says what the citer meant"* — that half is unenforceable and always was |
| 8 | **Malformed coordinates in prose** — the folder-segment class is permissive and there is no right-hand file-name closure | **0 today** | Blind spot 7. Tightening would make the regex materially harder to read for no measured gain |

**And one deliberate *positive* divergence from the sibling half, so it reads as a ruling:**

| ⭐ | **Elided targets COUNT for this half** — a coordinate whose path contains `…` is a hit. Half A skips them | ⚠️ **45 elided hits today, ALL inside the exemption → residual cost 0.** The brief records *"1, arguably 2, both inside the 19"* — that figure no longer reproduces, because `0237` cleared the residual and the carrying folders closed | Pinned by arm **C5** |

---

## 10. ⛔ The accepted incompleteness — named correctly, and sharpened by measurement

**Verification step 7 is mandatory and unchanged: a close report presenting this guard as complete has failed verification. Being a gate on `0356`, `0357` and `0358` does not make it complete.**

The two named specimens, **re-verified firsthand at this gate rather than paraphrased from the brief**:

| Specimen | Status today | Why the guard does not flag it |
|---|---|---|
| ⭐ **`0013`'s brief** — `` [`sprint-2.md:354`](../../../sprints/done/sprint-2.md) ``, where the **visible label is bare shorthand** that does not match the literal `ai-agents/sprints/*.md` form | ⭐ **`0013` is in `backlog/` — OPEN and NOT exempt.** Confirmed present today | **The literal reading alone.** ⭐ This is the *live* specimen: the guard walks this file, reads this line, and does not flag it |
| **`0160`'s brief** — *"in three places"* | ⚠️ **`0160` is in `done/` — now exempt** | ⭐ **Two reasons now, where 2026-08-01 had one:** the literal reading **and** the closed-folder exemption. Step 7's wording is still true; its *reason* has changed |

⚠️ **A precision on "three places", measured rather than repeated.** I count **5** bare-shorthand `.md` + line-number coordinates in `0160`'s brief today, not three. The most likely explanation — **unconfirmed, and I flag it as unconfirmed** — is that the 2026-08-01 count predates the 2026-08-30 widening of the cited class (one of the five names a `plan.md`, which was not then in the class) and that a repeated coordinate was counted once. **I will report the measured 5 and this discrepancy, not silently restate "three".**

**Plus the four further blind spots §"⭐ RE-SCOPED 2026-08-30" §4 requires be disclosed with it**, each re-measured at this gate rather than inherited: **249 across 45** (source-file targets), **3** (citing sites outside the set), **0 today** (no right-hand closure / permissive segments), **45 hits, 0 residual** (no elision rule).

---

## 11. ⛔ My blind spots — what this plan does **not** cover

1. **The residual figure is a snapshot of a live tree, and the tree includes this task's own artifacts.** `RESIDUAL 0` was true at the moment I measured. **My own `plan.md` and `worklog.md` land in `tasks/backlog/0176-…/`, inside the scanned set and not exempt** — this task builds the guard that would catch them. Every coordinate in this plan text is written in the two-cell or bare-name form for that reason. ⚠️ **But the driver pastes this text**, so the discipline has to survive the paste. **I will re-measure after the driver writes `plan.md` and again immediately before the green run.**
2. **C7 parity is verified against a *simulated* sibling, not the real file** — which cannot exist until the build step. The simulation used the real `maskFencesAndQuotes` and the real C7 slice logic, so the risk is low, but it is not zero.
3. **I have not run full `npm test` at this gate.** I ran the `reference-integrity` suite only (20 tests, 19 pass, 1 skip). ⭐ **The 812 / 811 / 1-skip baseline is the driver's measurement, not mine** — I am relying on it for the total, and my `0 skip` prediction does not depend on it.
4. **Prong B's 249 counts coordinates, not verified-stale ones.** An unknown fraction are still accurate. Three matchers give 216 / 249 / 250 — same order of magnitude, but **the number I put to the owner is matcher-dependent and I say so.**
5. **I did not audit the 45 elided hits** to see whether any is genuinely rotted. They are all inside the exemption, so the guard's verdict is unaffected — but "cost 0" means *0 residual*, not *0 problems*.
6. **The review-ledger question is priced on principle, not on a rate.** I measured today's cost (0). I **cannot** measure how often future reviews will produce these coordinates, so option A's recurring friction is a real cost I have not quantified.
7. ⚠️ **I did not check whether `0356`, `0357` and `0358` — the three sweeps this guard gates — will themselves write coordination-document coordinates into open briefs while they run.** If they do, this guard reds mid-sweep. **A real sequencing risk, flagged and unmeasured.** It interacts directly with question Q1.
8. **The `+6` drift on `WIDE=1` (brief records `+4`) is reported but not explained.** I did not identify which 2 instances are new.
9. **`0361`'s claim about `test/closed-rank-immutability.test.js` `live leg 1`** — I did not touch it. It does not bear on this plan: that file is a sibling `ai-agents/`-content guard but shares no code with mine. Reported, not fixed; `P13`'s business.

---

## 12. Sequencing

1. Re-read §4.2 at revision `c797df4`; record the revision and the checksum discrepancy in the worklog.
2. Write `test/coordination-citation-policy.test.js` — header (deviations D1–D5, blind spots, the prove-red rationale), transcribed core, then L / M / C arms.
3. ⭐ Run `node --test test/reference-integrity.test.js` **first** — confirm C7 armed and passes (20 / 20 / 0 skip). **If C7 reports drift, stop and fix the transcription, never the assertion.**
4. Run `node --test test/coordination-citation-policy.test.js`.
5. Run the red runs (§8 row 6) and record both figures.
6. Re-measure the residual; run `npm test` and `bash test/prove-red.sh`.
7. Run the widened step-6 `git status` check.
8. Write the worklog with the disclosure of §10 and §11 in full.
9. Hand to the reviewer for a stateful review.

**Estimated surface: one new file, roughly 350–450 lines including the header. No other file edited.**

---

## ⭐ OPEN QUESTIONS FOR THE OWNER

**Q1 is the one the 2026-09-02 ruling required be named at this plan gate, and it is the only one that changes what ships.**

| | Question | Options | My recommendation |
|---|---|---|---|
| **Q1** ⭐ | **Would this guard red a correctly-formed review ledger in an open task — and is that correct?** An open task's `review.md` is in the scanned set and not exempt. The reviewer's own skill prescribes a findings-table column named `file:line`. `0237`'s reviewer split every coordinate across two table cells to dodge the matcher, and that ledger's own R1 finding then complains the resulting anchor is ambiguous. **Live cost today: 0** — all 133 `review.md` are in `done/`. | **A** Ship as specified, no exemption · **B** Exempt open `review.md` · **C** Narrow the target class for same-folder self-citation · **D** = A + a follow-up amending the reviewer skill's guidance | ⭐ **A, with D filed as a follow-up.** The convention's row 3 rules the coordination-document target **categorically wrong**, and its own scope note says the target condition is what makes it categorical — so flagging it is the rule working. §4.2 contains no such exemption, and **B is exactly the silent widening I am forbidden to make.** The guard ships **green** under A. ⚠️ **The cost is recurring friction on every future review of a doc task, and I cannot quantify its rate.** |
| **Q2** | **Confirm `0176` inherits `0354`'s prove-red ruling?** Owner ruling 2026-09-02, option label verbatim **"No prove-red entry — follow the precedent (Rec)"** was given for the sibling half. Identical reasoning, identical artifact class — but a different task. | **Yes, inherit** · **No, add mutation arms to `test/prove-red.sh`** | ⭐ **Yes, inherit.** `ai-agents/` has no environment seam, and inventing one would ship a production env var whose only purpose is to point the guard elsewhere — the exact shape deviation D2 rejects. |
| **Q3** | **The 2026-08-24 note says to put the widening question to the owner "if one is present when this task runs." You are present, so I am putting it.** Should the target class widen to **source-file** coordinates? | **No, refuse** (the brief refuses it by name) · **File as a follow-up** · **Widen now** | ⭐ **No, refuse — and file as a follow-up if you want it costed.** ⚠️ **The measured number, re-measured today: 249 instances across 45 files** — two orders of magnitude above the "three" the note implies. **It counts coordinates, not verified-stale ones**, and is matcher-dependent (216–250). Widening now would take the guard red on arrival. |
| **Q4** | **May I omit the dead `maskCodeSpans` function (deviation D4)?** §4.2 defines it but its switch is settled **off**, so under D2 it is unreachable. Shipping it dead means shipping a function that, if ever wired up, silently takes the guard from 166 hits to **5**. | **Omit + assert the ruling positively (arm C4)** · **Transcribe it dead for fidelity** | ⭐ **Omit.** Arm C4 asserting *"a coordinate inside backticks must red"* is strictly stronger protection than keeping the function. This is the one place I depart from a function the specification contains, so I am naming it rather than deciding it quietly. |

---

**Nothing was written. No file created or edited, no commit, no task file moved, nothing written to `ai-agents/wiki-vault/`.** The `§4.2` extract and every measurement script live in the session scratchpad only.

---

# ⭐ OWNER RULINGS AT THE PLAN GATE — 2026-09-02

⛔ **Appended by the driver (`fkit-sprint-ship-loop`, `fkit lead` session) AFTER the plan text above.** Six rulings, given live via `AskUserQuestion` in this session, recorded by **verbatim option label**.

⚠️ **One transport note, stated for honesty.** The plan text above is the worker's returned text with HTML entity escapes (`&gt;`, `&lt;`) restored to the `>` and `<` characters they encode — an artifact of the spawn-return channel, not an edit of content. No other character was changed.

| # | Question | ⭐ Owner's choice — option label verbatim | What it settles |
|---|---|---|---|
| G0 | Approve this plan for `0176`? | **"Approve as written (Rec)"** | ⭐ **The plan above is APPROVED as written**, contingent on G1 below |
| **G1** ⭐ | The named question — an open task's `review.md` is scanned and not exempt, so the guard would red on correctly-formed review ledgers | **"A + file follow-up D (Rec)"** | ⭐ **Option A ships: NO exemption for review ledgers.** A coordination-document coordinate is flagged wherever it is written, open review ledger included. ⛔ **Option B — exempting open `review.md` — is REFUSED.** ⭐ **AND follow-up D is to be filed**: a task amending the reviewer skill's guidance so its `file:line` column reads *"heading + fragment where the target is a coordination document"*. ⛔ D is the **producer's to file** and **does not block this task** |
| G2 | Does `0176` inherit `0354`'s prove-red ruling? | **"Yes, inherit (Rec)"** | ⭐ **No `test/prove-red.sh` entry.** The file stays byte-unchanged at 28 mutations. The M and C arms are the mutations |
| G3 | Should the target class widen to source-file coordinates? | **"No, refuse — file follow-up if wanted (Rec)"** | ⛔ **Refused.** Source-file `path:NNN` stays legal — the convention's row 1 rules it correct, and re-measured cost is **249 across 45**. ⭐ A follow-up may be filed to cost it; that is the producer's and does not block this task |
| G4 | May the dead `maskCodeSpans` function be omitted (D4)? | **"Omit, assert positively (Rec)"** | ⭐ **Omit it.** Arm **C4** asserts the ruling positively instead: a coordinate inside backticks **must** red |
| **G5** | Blind spot 7 — the three sweeps this guard gates may write banned-form coordinates into open briefs while running, redding the guard mid-sweep | **"Carry it into each sweep's plan gate (Rec)"** | ⛔ **Not measured now and not `0176`'s to solve.** ⭐ **Each of `0356`, `0357` and `0358` must state at its own plan gate how it avoids writing the banned form into open records** — the two-cell discipline `0237` used is the available answer. The driver carries this forward |

⭐ **G1 is the ruling that decides what ships.** Options A and B produce different code. The owner took A, and refused the exemption by name.
