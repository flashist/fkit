# Plan — 0354, build the link-resolution guard (`test/reference-integrity.test.js`)

**Stamped 2026-09-02, `HEAD` `c797df4`, working tree dirty with other workers' changes.**
Every figure below was re-measured today by me; none is inherited.

---

## ⭐ OWNER RULINGS, 2026-09-02

Two rulings given live via `AskUserQuestion` in the `fkit lead` session at the plan-approval gate. Option labels are **verbatim**.

**Ruling 1 — plan approval.** Label: **"Approve as written (Rec)"**. → The plan below is approved as it stands.

**Ruling 2 — on §6, the one judgement call the plan flagged.** Label: **"No prove-red entry — follow the precedent (Rec)"**. Presented as: *the three sibling content-guards discharge the same duty by exporting pure functions and reddening them against negative fixtures in-file — which M1–M4 and C1–C7 are. Adding an entry would need a new env seam pointing the repo's own content guard elsewhere, which is the "guard that can be talked out of its condition" shape the plan rejects.*
→ ⛔ **No `test/prove-red.sh` entry is added.** §6 stands as written, and the question is settled at the plan gate rather than left to the review round.

⛔ **Everything below this section is the coder's returned plan, byte-identical.**

---

## 0. What I measured, and with what command

§4.1 was extracted **verbatim** from `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md` into the session scratchpad (never into the repo) and run from the repo root.

```
$ node <scratchpad>/link-resolution.js
BROKEN: 0 instances across 0 files
NAMED-EXEMPT: 6 instances (see the exemption list above, each with its reason)
SCANNED: 824 files
```

**The guard is GREEN on arrival.** Runtime 0.32s.

| Reading | Command | Today (2026-09-02) | §6.2 (2026-08-30) |
|---|---|---|---|
| **Settled** | `node link-resolution.js` | **0 broken / 6 named-exempt / 824 scanned** | 0 / 6 / **819** |
| `NAMED_EXEMPT` emptied | *(set edited to empty)* | **6 across 4** | 6 across 4 |
| Document-level span masker | `SPAN_SCOPE=doc` | **1 across 1** | 1 across 1 |
| Blockquotes counted | `QUOTES=0` | **8 across 6** | 8 across 6 |
| Fences only, spans counted | `SPANS=0 QUOTES=0` | **130 across 60** | 130 across 60 |
| Naive | `SPANS=0 QUOTES=0 FENCES=0` | **166 across 72** | 166 across 72 |
| Closed folders also exempt | `EXEMPT_CLOSED=1` | **0 across 0** | 0 across 0 |

⭐ **Every alternate reading reproduced exactly.** The only figure that moved is the scanned-set size, **819 → 824** — five `.md` files added to `ai-agents/` since. The red set did not move.

Two further measurements the condition document asks `0354` to build in, taken today:

- **Stale-key check (§7 item 9a): 0 of 5 keys stale.** All five citing files still exist; all six targets are still missing. Nothing has been orphaned by a close.
- **Case-sensitivity (§7 item 11): 0 divergences.** I swapped `fs.existsSync` for a per-segment `readdirSync` case-exact walk over every resolvable target: **the figures are byte-identical** (0 / 6 / 824). Adopting the check costs nothing today.

⚠️ **The brief's warning that §4.1 "may change — it was under review round 2" is now discharged.** `0353`'s review ledger reads **CONVERGED / closed-out**, and the condition document is **committed and clean at `c797df4`** (`git status` reports no modification). **The revision I transcribe is the file as committed at `c797df4`.**

## 1. Deliverable

**One new file: `test/reference-integrity.test.js`.** No other file changes.

- Picked up by the existing `node --test test/*.test.js` glob — **no `package.json` change**, **no new devDependency** (ADR-014).
- **No registration anywhere else.** I checked: `test/` contributes 0 of the 90 rows in `claude/structure-manifest.tsv`, and no test enumerates or counts test files. A new file in `test/` needs nothing else updated.

## 2. Transcription fidelity — three deliberate deviations, each named

§4.1 is the specification and I transcribe it, **not** re-derive it. Three changes are unavoidable or instructed; each is recorded in the file header and the worklog. Nothing else differs.

| # | Deviation | Why | Measured cost |
|---|---|---|---|
| **D1** | **CommonJS → ESM preamble.** `'use strict'; const fs = require('fs')` becomes `import` statements | House idiom: **all 29 existing test files are ESM; zero use `require`** | 0 — module preamble only. `walk`, `exemptFile`, `maskFencesAndQuotes`, `maskCodeSpans`, `LINK`, `SKIP_SCHEME`, `ELIDED`, `NAMED_EXEMPT` and the match loop are transcribed **byte-identical** |
| **D2** | **`fs.existsSync` → per-segment case-exact walk**, keeping the containment test | Instructed twice: brief §3 item 2 and §7 item 11. macOS's case-insensitive volume otherwise makes the result depend on **who runs the test** | **0 today** — measured above, figures byte-identical |
| **D3** | **The `OPT` env switches are dropped** from the shipped default path | §4 states they exist "**only** to reproduce the recorded alternate readings in §6 and §7. The settled condition is every switch at its default." A guard that can be talked out of its condition by an env var is not a guard | 0 — settled behaviour unchanged |

⛔ **Three traps I will not fall into, verified against the document itself:**

1. ⛔ **§7 item 4's "reports more, never fewer" is NOT transcribed.** It is **withdrawn** — the two maskers are not nested (line-level 6 across 4, document-level 4 across 3; each hides something the other reports). The file ships the **line-level** masker and records the reason as **accuracy**: the document-level masker's one unique hit is a false positive it creates by mis-pairing an earlier unpaired backtick.
2. ⛔ **The containment test is transcribed, not just the rebasing.** §7 item 11 (R12) records that rebasing onto `ROOT` with `path.join` **looked like the fix and was not** — `path.join(ROOT, '/../../../../../etc/hosts')` still yields `/etc/hosts`, and `existsSync` returned true. Both branches get `abs === ROOT || abs.startsWith(ROOT + path.sep)`.
3. ⛔ **The fence-close rule is CommonMark's** — a *closing* fence carries no info string. Both maskers had this wrong before 2026-08-30 and the bug hid one live instance.

## 3. File shape

A pure core with an injectable root, then a thin live-corpus layer. **The root parameter is the seam that makes every mutation arm runnable without writing one byte into `ai-agents/`.**

```
test/reference-integrity.test.js
├─ header comment
│   ├─ names the condition document by filename + the revision (committed at c797df4)
│   ├─ records the test-scope category (repo-content invariant — the task-id-uniqueness precedent)
│   ├─ records D1/D2/D3 above
│   └─ records the five disclosed blind spots (§4 of the re-scope)
├─ exempt(rel)                     ← THE path exemption: ai-agents/wiki-vault/ only. Exported.
├─ walk(dir) / collectFiles(root)  ← builds the scanned set; exemption applied IN the walk
├─ maskFencesAndQuotes(lines)      ← byte-identical to §4.1
├─ maskCodeSpans(text)             ← byte-identical to §4.1
├─ LINK / SKIP_SCHEME / ELIDED     ← byte-identical to §4.1
├─ NAMED_EXEMPT                    ← all 5 keys, all 6 instances, each with its reason comment,
│                                     AND the §7-item-9 cost caveat, carried verbatim
├─ resolveExact(root, abs)         ← D2: per-segment case-exact + containment
└─ scan(root, opts) -> { broken, namedExemptCount, scanned, visited, checked, skipped }
```

`scan` returns the instrumentation the verification steps need: `visited` (every path the walk actually touched) and the `checked` / `skipped` counters.

**The exemption is in the definition, demonstrably.** `exempt(rel)` is consulted inside `collectFiles`, so an exempted file never enters `scanned` and never appears in `visited`. There is no post-filter over failures anywhere in the file — that is structural, and test S1 proves it by inspecting `visited`.

⛔ **The failure message names the citing file, the line's *text*, and the unresolved target — never `file:NNN`.** Verification step 5's `grep -nE ':[0-9]+'` is broader than it looks: it matches any colon immediately followed by a digit, so a tight ternary like `x?1:2` would trip it. I verified the **verbatim §4.1 body already passes that grep with zero hits**; the constraint therefore binds only the code I add, and I will keep it clean.

## 4. Named assertions

### Live corpus (real repo, read-only)

| ID | Assertion | Discharges |
|---|---|---|
| **L1** | `live corpus: the scanned set is non-empty and large` — `scanned > 800` | Anti-vacuity. A guard over zero files passes trivially (the failure mode `task-id-uniqueness` was built to avoid) |
| **L2** | `live corpus: BROKEN is 0` — failure prints every instance as file / line-text / target | The guard itself |
| **L3** | `live corpus: NAMED-EXEMPT is exactly 6` | ⭐ §7 item 9(b). Without it, a seventh instance silently swallowed still reads green |
| **L4** | `named exemptions: no stale key — each citing file exists and each target is still missing` | ⭐ §7 item 9(a). 4 of 5 keys are `tasks/done/` paths and this repo moves task folders as routine work |
| **L5** | `scope: no file under ai-agents/wiki-vault/ was ever visited` | Verification 3′, positive half |
| **L6** | `scope: tasks/done, tasks/cancelled, sprints/done, sprints/reviews and knowledge-base WERE visited` | ⭐ Verification 3′, inverse half — **their absence is the defect, not the proof** |
| **L7** | `scope: claude/ and test/ were never walked at all` | Verification 3′ |
| **L8** | `disclosure: the guard checks a non-trivial number of links, and reports its skips` | Verification step 9 — a guard that checks almost nothing passes trivially |

### Mutation arms — verification 4′, all four (fixtures in `os.tmpdir()`, never the repo)

| ID | Arm | Expected |
|---|---|---|
| **M1** | Broken link planted in an **in-scope** file | **FAILS**; removed → passes |
| **M2** | Broken link planted in **`ai-agents/tasks/done/`** | ⭐ **FAILS** — the arm the original brief had backwards |
| **M3** | Broken link planted on a **`NAMED_EXEMPT` (file, target) pair** | **Passes, and the named-exempt count RISES.** A silent pass is not the same result as a counted exemption |
| **M4** | Broken link planted under **`ai-agents/wiki-vault/`** in the fixture tree | **Skipped**, and the file never appears in `visited` |

### Condition-fidelity units

**C1** line-level masker does not report the document-level masker's false positive (§7 item 4) · **C2** a closing fence carries no info string · **C3** a target escaping the repo root via `../` or a root-absolute path is **broken, never satisfied** (§7 item 11 R12) · **C4** a wrongly-cased target is **broken on macOS too** (D2) · **C5** each skip class named separately — scheme, protocol-relative `//`, bare `#anchor`, elided `…`, image `![alt](x)`, reference-style `[a]: url` · **C6** `path#fragment` resolves the file part, fragment ignored · **C7** masker parity with the citation guard (§7 item 14).

## 5. ⛔ The fixture strategy — the question the producer could not resolve

**I take route (a), the scratchpad fixture tree, as primary — and add route (b) as a cheap second check.** Both, not either, and here is why the choice is not arbitrary:

**Route (a) is the only route that runs all four arms legally.** The producer framed the problem as being about the vault arm alone, but **arm M2 has the identical problem and it was not noticed**: planting a broken link in `ai-agents/tasks/done/` to prove the guard reds there would edit a closed task folder, which this brief's own constraints forbid, and would dirty a tree already carrying other workers' uncommitted changes. A tmpdir fixture tree solves the vault arm and the closed-folder arm **with one mechanism**. Route (b) alone solves neither.

**Route (b) still earns its place as one line.** `exempt('ai-agents/wiki-vault/x.md') === true` asserts the predicate directly, so the exemption stays proven even if the walk is later restructured.

**The fixtures are built at runtime under `os.tmpdir()`, not committed under `test/fixtures/`.** This matters: `test/fixtures/` is frozen by ADR-042, and `test/` is out of the scanned set entirely, so a committed fixture would raise an ADR-042 question and buy nothing. `harness.mjs` already states the standing rule — *"Nothing here writes into the repo: every project lives under `os.tmpdir()`"* — and `task-id-uniqueness.test.js` and `adr-number-uniqueness.test.js` both follow it.

⛔ **Nothing is ever written to `ai-agents/wiki-vault/`, not even to revert it.**

## 6. ⛔ How this test earns its mutations — and why it adds no `prove-red.sh` entry

**It adds no mutation to `test/prove-red.sh`, and that is the precedent, not an omission.** Evidence, measured today:

| Guard | Subject | `prove-red.sh` mutations |
|---|---|---|
| `task-id-uniqueness.test.js` | `ai-agents/` content | **0** |
| `adr-number-uniqueness.test.js` | `ai-agents/` content | **0** |
| `closed-rank-immutability.test.js` | `ai-agents/` content | **0** |
| `wiki-flag-convention.test.js` | `claude/skills/` markdown | 6 (mutations 27–28) |

All 28 `prove-red.sh` mutations target an **executable artifact reachable through an env seam** — the launcher (`FKIT_LAUNCHER`), the hooks, `bin/release.mjs` (`FKIT_RELEASE_MJS`), or skill markdown (`FKIT_FRONTMATTER_ROOT`). `wiki-flag-convention` qualifies because its subject tree has such a seam. ⛔ **`ai-agents/` has none, and inventing one would mean shipping a production env var whose only purpose is to point the repo's own content guard somewhere else** — the exact "guard that can be talked out of its condition" shape D3 rejects.

The three `ai-agents/`-content guards discharge the same duty a different way, and I follow them exactly: **export the pure functions and redden them against negative fixtures inside the test file.** M1–M4 and C1–C7 are those mutations — each one a named assertion that fails when the condition is broken. Section 4's table is the mutation list.

⚠️ **Flagged for the reviewer as the one judgement call in this plan.** If the reviewer holds that a `prove-red.sh` entry is required anyway, the cost is a new env seam on the scan root, and I would want that ruled rather than assumed.

## 7. §7 item 14 — the masker-parity check, and its wrinkle

§7 item 14 asks `0354` and `0176` to **assert their two copies of `maskFencesAndQuotes` are byte-identical**, because that 13-line function has **already drifted once** — R2 found the same fence-close bug in both copies.

⛔ **`test/coordination-citation-policy.test.js` does not exist yet** (`0176` is unshipped; I verified the file is absent). I ship assertion **C7 anyway, gated on the sibling's presence**: when the sibling is absent it reports that state **explicitly and loudly** rather than passing silently; the moment `0176` lands, the parity check is already live and `0176` does not have to remember to build it. The alternative — leaving it to `0176` — puts the check downstream of the drift it exists to catch.

## 8. What the close report must disclose

Not discovered later — stated at close, per §4 of the re-scope:

1. **Blockquote lines are skipped** — 8 instances across 6 files hidden today (I re-measured: `QUOTES=0` → 8 across 6). All inspected on 2026-08-30, all quotation or proposed text, none genuine rot. ⛔ Today's sample is clean; **the blind spot is not safe**.
2. **Anchor existence is never checked** — `path#fragment` resolves the file part only. Cost unmeasured, deliberately not folded in.
3. **Reference-style definitions (`[a]: url`) are out of scope, by name.** Cost 0 today.
4. **The link grammar is narrower than the ruled class** — nested label brackets, balanced-paren destinations. Measured with a widened grammar: identical red set. Live cost 0.
5. **The `NAMED_EXEMPT` key caveat** — keyed on (citing file, target), so **a future genuine rot with the same pair is also suppressed**. Cost 0 today. ⛔ Carried into the file as a comment, not dropped.
6. **The fence masker's two rough edges** (§7 item 13) — an unterminated fence masks to EOF; a fence indented 4+ spaces is invisible. Named, deliberately not fixed by owner ruling, cost 0. **I transcribe this masker as-is and record that I know that is what I am transcribing.**
7. ⛔ **Green does not mean the sweeps are unblocked.** The forced-sequencing gate needs `0176` green too, and that is `0237`'s real work — 19 instances across 14 files.

## 9. Verification I will run and report

1. `npm run test:unit` — the new file green alongside the existing suite (~85s).
2. The eight live-corpus assertions, with the scanned-set size and the checked/skipped counts printed.
3. All four mutation arms M1–M4, all three runs of M1 reported.
4. `grep -nE ':[0-9]+' test/reference-integrity.test.js` → expect **no hits**.
5. `git diff --stat` → **zero** files touched under `ai-agents/tasks/done/`, `ai-agents/tasks/cancelled/`, `ai-agents/wiki-vault/`; **zero** change to `package.json`.
6. `npm test` in full, **including `bash test/prove-red.sh`'s hard gate** — I report the red run, not only the green one. ⚠️ The full run exceeds ten minutes.
7. A final re-run of the scratchpad §4.1 script immediately before hand-off, to confirm the test's output still agrees with the specification's output on the tree as it then stands.

## 10. Risks and edge cases

- ⛔ **The plan, worklog and review ledger for this task land inside the scanned set.** §7 item 12 recorded this drift happening live during `0353`. **This plan text uses backticked paths throughout and contains no `[label](relative-target)` markdown link**, so writing it cannot redden the guard it plans. The same discipline applies to the worklog and to the reviewer's ledger — worth stating to the reviewer up front.
- **The scanned-set count will keep moving** (819 → 824 in three days). L1 asserts a floor (`> 800`), never an exact count — an exact count would be a guard that reds on ordinary work.
- **A concurrent worker could add a genuinely broken link mid-run.** If the guard reds at hand-off I report it as a finding with the instance named, and ⛔ **do not weaken the condition to make it green.**
- **A close landing during this task could orphan a `NAMED_EXEMPT` key** (4 of 5 are `tasks/done/` paths). That is precisely what L4 exists to catch, loudly.
- **D2's case-exact walk does one `readdirSync` per path segment.** Current scan is 0.32s; I will re-time and report if it degrades materially.
- ⚠️ **`test/` and `claude/` are out of scope, and 443 hits live there** — 440 frozen `test/fixtures/`, the rest `claude/scaffold/` templates that resolve in the consuming project. L7 asserts they are never walked, so this can never quietly become a 443-instance red set.

## 11. Out of scope — explicitly

⛔ Fixing any broken link (`0355`, cancelled — red set 0) · ⛔ editing `ai-agents/wiki-vault/` · ⛔ editing anything under `tasks/done/` or `cancelled/` · ⛔ touching `test/coordination-citation-policy.test.js` or `0176`'s scope · ⛔ moving any task file (producer-only, ADR-033) · ⛔ committing or pushing.
