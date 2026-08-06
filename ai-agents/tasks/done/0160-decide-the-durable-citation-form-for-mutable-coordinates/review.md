# Review — 0160-decide-the-durable-citation-form-for-mutable-coordinates

Task: 0160 — `ai-agents/tasks/backlog/0160-decide-the-durable-citation-form-for-mutable-coordinates/brief.md`
File(s) under review: `ai-agents/knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md` (755 lines at round 1; 1214 lines at round 2; 1402 lines at round 4; **1472 lines at round 5**, untracked)
Status: **closed-out** — **round 6 final verification, 2026-08-01. Both ruled remedies (R27, R28) landed and were verified; R30's flagged concern landed; all 30 findings R1–R30 are dispositioned; nine are recorded accepted residuals by direct owner ruling. No round-6 finding. One below-threshold imprecision recorded, not dropped — see the round-6 block.**

Round 1 — 2026-08-01. Reviewers run: **fkit-reviewer (own pass)** + **Codex adversarial second opinion — coverage FULL** (`codex-cli 0.145.0`, `codex exec --sandbox read-only`). No reviewer was skipped.

Verdict: **⚠️ Changes requested — 15 confirmed defects (none blocking).** The measurements are, with two
exceptions, real: five of the six major measurement blocks reproduce cell-for-cell on independent
re-run, and every quotation is verbatim. The defects are concentrated in the case-3 argumentation and
in one stated "Fact".

## Reviewer findings

| #   | Round | Sev    | file:line | Claim |
|-----|-------|--------|-----------|-------|
| R1  | 1     | medium | report §4.2 Fact C, :246-248 (relayed §8.2 :603-604) | **Fact C is false** — 4 of 60 `Task:` headers *are* markdown hrefs, and their hrefs resolve; this falsifies the "notation accident" for those 4 and is handed to `0168` as a received fact. |
| R2  | 1     | medium | report §4.4 :286-288 vs :297-300 | The strongest counter-argument is **conceded then denied by assertion**: Fact A proves the header names the same *task*, not that the *path* carries no claim about where the brief was on review day. |
| R3  | 1     | medium | report §4.4 :300-301 | The pro-repair rebuttal calls a dead path "precisely the silent failure §3.4 describes" — but by §3.4's own taxonomy a dead path is the **loud** category. |
| R4  | 1     | medium | report §4.4 (whole section) | **Two of the four alternatives the brief mandates for case 3 are never weighed** — "resolve location at read time" and "append rather than rewrite" appear nowhere in the report. |
| R5  | 1     | medium | report §1.1 :67-74 vs §1.2 :90-92 | The universal paired-quote rider **contradicts** "Review-ledger practice is untouched" — the ledger schema row has no quote or heading field. |
| R6  | 1     | medium | report §1 :55 vs :60 | By §1's **own stated test** ("who else edits the thing I just pointed at?"), a review-ledger finding falls on the *unsafe* side; the table rules it safe as "frozen by construction". |
| R7  | 1     | medium | report §5.1-§5.2 :363-398, follow-up 5 :561 | Case 4 is ruled **IN** on a rule mandating "folder ID **and brief path**", while §5.2(ii) proves that same brief path "manufactures a dead path by construction" — unreconciled, and no replacement form is named. |
| R8  | 1     | medium | report §7 :512, §7.2 :534-542 | "**Nothing can enforce this**" for case 2 conflates enforcing the *policy* (syntactic, trivially checkable) with verifying *semantics* (genuinely unenforceable). |
| R9  | 1     | medium | report §4.5 :303-320 | ADR-034 is engaged **selectively**: the re-raise condition that most directly applies (`adr-034…:151-153`, residuals that "mislead a later reader or a later round") is omitted, and replaced by an individual-vs-corpus distinction ADR-034 does not state. |
| R10 | 1     | low    | report §4.6 :346-348 | The "**57 distinct dead paths**" figure is mislabelled — globally distinct is **55**; 57 is the sum of per-ledger distinct counts; the report's own 40 + 16 gives 56; §8.2 restates 16 as "~17". |
| R11 | 1     | low    | report §10 :692 | "**not one of them is written**" is false for follow-ups 3 and 4 — they *are* `0168`, which §8 itself labels "This is `0168` item 1 / item 2". Duplicate-filing risk for the producer. |
| R12 | 1     | low    | report §5.2 :378-379 | "**Byte-equivalent blocks**" is false for the sync copy — `fkit-wiki-sync/SKILL.md:116-122` has 0-space indentation where ingest and lint have 3. |
| R13 | 1     | low    | report §1 table :59 | The Because cell gives a **non-distinguishing reason** for the safe/unsafe split ("the revision is in git and recoverable" is equally true of `sprint-2.md`); the real distinguishing argument sits elsewhere in the report. |
| R14 | 1     | low    | report §7 table :514 | Case 4's enforcement cell answers verification step 4 with a **third option** ("`0165`'s question, not mine") — neither a file+condition nor the literal words the step requires. |
| R15 | 1     | low    | report §5.2 :392-393 | "**Every flag is emitted about a task that is about to close**" is false for half the quoted template — the `partial or uncertain` form is explicitly *"not ready to close"*. |

### Evidence per finding

**R1** — `ai-agents/tasks/done/0001-…`, `0010-…`, `0022-…`, `0039-…` each read
``Task: [`<dead path>`](./brief.md)``. All four `./brief.md` targets exist, i.e. the href is **live**.
Fact C's notation sub-counts (30 code / 10 bare of the 40 dead) reconcile only if `` [`x`](y) `` is
classified as a code span — which is what the report's classifier did (my run: 26 code / 10 bare /
**4 href**; live 4 / 15 / 0, matching exactly). Load-bearing: §4.3's notation accident says *"A rule
written in terms of hrefs does not visibly reach them"* — for these 4 the mover's href rule
demonstrably **did** reach them.

**R2** — §4.4 concedes: *"A code span is arguably a claim, not a pointer… which is **true**, and which
the frozen-ledger rule protects."* §4.4 then rebuts with *"there is no claim to destroy because there
was no independent claim."* Fact A's method (compare header slug to containing folder name) cannot
support that; it establishes task identity, not absence of a location claim. Flagged **premise
concern** under the owner's settled remedy — not a request to revisit it.

**R3** — §3.4 defines the taxonomy: silent = lands *"on a **neighbouring board row of identical
shape** … and still reads authoritative"*; loud = *"A fast-drift failure is loud."* A dead path
resolves to nothing. §4.4 invokes the silent category for it.

**R4** — brief `## What to build` item 3: *"Weigh at minimum: accept the dead paths; resolve location
at read time; write a location-free anchor going forward; append rather than rewrite."* Grep over the
report: **0** occurrences of "read time" / "read-time"; no `append` or `annotat` hit is a case-3
alternative. Weighed: *accept* (§4.4) and *location-free anchor* (the ruling). The two unweighed
options are precisely the ones that preserve frozen history. Compounds R2 and R3.

**R5** — §1.1: *"**Never cite a line number naked.** Pair every `path:NNN` with a quoted fragment or
the heading it sits under… it applies to **all four cases at once**."* §1.2: *"Review-ledger practice
is **untouched**… Nothing in this report asks a reviewer to change how they write a finding row."*
The schema row is `| # | Round | Sev | file:line | Claim |` (`fkit-stateful-review/SKILL.md:49-52`) —
no quote or heading field. Material: follow-up 3 / `0168` item 2 rewrites that schema. Secondary: the
report cites `priority-is-rank-not-identity.md:3-4` unpaired in its own §1 table, against its §1.2
sting (*"where a line number appears it is paired with a quote or a method"*).

**R6** — §1's test is *"after I publish this sentence, who else edits the thing I just pointed at?"*
For a file under review the answer is: the coder, immediately, in response to that very finding. In
this repo's multi-round stateful model a round-1 finding is re-read in round 2 after the cited file
moved. "Frozen by construction" is true of the reviewer's *assertion*, false of the *reader's
resolution*.

**R7** — §5.1 quotes the candidate rule *"folder ID and brief path only"*; §5.2 rules it **IN**.
§5.2(ii) then proves the mandated `backlog/<NNNN>-<slug>/brief.md` in the flag template
*"manufactures a dead path by construction"*. Follow-up 5 says only *"fix the hardcoded `backlog/`
path"* — no replacement form. A producer filing follow-up 5 still needs a ruling.

**R8** — §7.2 considers only a line-count assertion. Case 2's own recommendation is syntactic (*"Stop
using it for coordination documents"*), and a `node --test` check asserting no `sprint-2.md:NNN` in
`ai-agents/tasks/*/*/brief.md` is trivially writable and would have caught the original 11-pointer
incident. The report's own case-1 precedent is exactly this shape — §7 marks case 1 *"Already is"*
enforced by `test/dashboard-contract.test.js` (file confirmed present).

**R9** — `adr-034-…:151-153` reads: *"The recorded own-record residuals are observed to **mislead a
later reader or a later round**"*. That is the report's own characterization of dead headers. §4.5
quotes only `:148-150`, calls leaning on it circular, and substitutes *"ADR-034 governs the
**individual instance**"*. The omission **cut against** the report — engaging `:151-153` would have
supplied ADR-034's own sanctioned route and made the corpus-level distinction unnecessary.

**R10** — my re-run: 42 ledgers ✓, 14 body-ledgers ✓, 16 body paths ✓ (all three reproduce exactly
under the report's implicit "additional to the header" rule). Globally distinct dead paths = **55**;
sum of per-ledger distinct = **57**; report's own 40 + 16 = **56**. Three numbers, one label.

**R11** — `ai-agents/tasks/backlog/0168-remediate-the-dead-brief-paths-in-closed-review-ledger-headers/`
exists. §8 items 3 and 4 say *"This is `0168` item 2"* / *"item 1"*; §8.2 calls it *"the pre-filed
execution arm"*. §10's absolute closing claim contradicts both.

**R12** — `diff` of the quoted 7-line blocks: ingest `:72-78` and lint `:81-87` byte-identical; sync
`:116-122` identical text, 0-space vs 3-space leading indent. The report itself insists on exactly
this distinction for `0168` in §8.1.

**R13** — the distinguishing argument does exist (§3.2's measured 97%-in-8-days growth, and §1's own
"who else edits it" test); it is simply not the reason printed in the table cell. Ruling holds;
articulation does not carry it.

**R14** — verification step 4 requires a file + condition, or the words *"nothing can enforce this"*.
Defensible, since the brief assigns `0165` *"whether the flag's form is checked at all"*, and §10
states the position honestly. Recorded as a literal step-4 gap only.

**R15** — the quoted template's second form is *"partial or uncertain → `Task <NNNN>: partial — not
ready to close`"*. The dead-path-by-construction conclusion survives for the `complete` form; the
stated syllogism does not cover the partial form, which may sit in `backlog/` indefinitely.

### Disproven / not recorded as findings

- **OQ3, OQ5, OQ6 were NOT silently decided.** All three carry an explicit recommendation and a
  `⏳ Awaits the owner` marker (§11), and the markers are carried consistently into §7.1, §8's
  Depends-on column and §10. Codex raised OQ6 as "silently decided" because §8 names the guard as
  follow-up 7; I **disprove** it — the same cell carries `⏳ open question 6`. Marked, not decided.
- **The "scope accident" claim (§4.3) stands.** I read the bullet *after* `fkit-task-done/SKILL.md:170-174`
  — `:176-184`, *"The moved folder's OWN outbound links… to a **sibling** task"*. Neither bullet
  covers own-`review.md` → own-`brief.md`. The claim is correct.
- **Verification step 6's flag is honest, not a dodge** — independently re-verified, not inherited.
  See the verification walk in the reviewer's return.
- **log.md "857 lines" vs `wc -l` = 856** — the file ends with a newline; 857 is split-lines
  semantics. Informational, below finding threshold.

---

### Round 2 — 2026-08-01 — findings against the round-2 delta

Reviewers run: **fkit-reviewer (own pass)** + **Codex adversarial second opinion — coverage FULL**
(`codex-cli 0.145.0`, `codex exec --sandbox read-only`). No reviewer was skipped. Scope: the ~460 lines
added since round 1 — **§4.2.1 (new), §4.4.1 (new), §1's replaced discriminator, §7.2 / follow-up 8,
§4.2's corrected Fact C** — plus consequential consistency across §4.3, §4.6, §8 and §8.2.

**Verdict: ⚠️ Changes requested — 10 confirmed defects (1 high, 6 medium, 3 low). The ruled remedy is
not challenged by any of them.** The report is the task's **work product**, so ADR-034's own-record bar
does not cover a defect in it (see `## Accepted residuals`). **§4.2.1's core distinction holds and its
stated conditional holds and is verified**; what fails is §4.2.1's **population arithmetic**, one of its
**historical claims**, and several **overclaimed generalizations**.

**Independently re-measured, not inherited** (my own Python pass; Codex ran its own; three independent
runs now agree cell-for-cell): 60 `done/*/review.md` · 59 with a `Task:` header · 1 without (`0080`) ·
**40 dead / 19 live** · notation **30 code / 25 bare / 4 href**, dead **26 / 10 / 4**, live **4 / 15 / 0**
· dead variants **17 folder-form / 14 flat-`backlog` / 9 flat-`done`** · all 4 hrefs inside the 9
flat-`done`, all 4 targets exactly `./brief.md`, all 4 resolving. **Method — the corrected one:** test
`[…](…)` **before** the backtick span, extract the **link text** for an href, `os.path.exists` the named
path. **Every published figure reproduces.** The round-1 bug the author names (backtick tested first) is
confirmed as the cause and confirmed as fixed in the published numbers.

| #   | Round | Sev    | file:line | Claim |
|-----|-------|--------|-----------|-------|
| R16 | 2     | **high** | report §4.2.1 :336-338 (repeated §4.3 :441-443, §8.2 :978-979) | **Gap A's population is wrong twice.** *"**56** headers are not hrefs at all"* contradicts its own parenthetical in the same sentence (26+4 code span, 10+15 bare = **55**); and it calls the rule's no-op on all of them *"a **miss**"* when only **36** of them name a dead path — 19 resolve, so there is nothing to miss. The reconciliation `0168` actually needs — **40 dead = 36 Gap A + 4 Gap B** — is never printed. |
| R17 | 2     | medium | report §4.2.1 :343-344 vs §4.3 :445-447 | **A false historical claim, contradicting the report's own §4.3.** §4.2.1: *"The defect was written at authoring time and **no mover rule has ever governed it**."* §4.3: *"Their href **was** reached … The mover re-pointed the **link** and left the **label**."* Git shows **§4.3 is right**. |
| R18 | 2     | medium | report §7.2 :886-905 | **Follow-up 8's "red today" corpus is understated ~6.5×**, measured under §7.2's **own** condition and **own** scanned set: **39 citations across 20 files**, of which **27 sit in closed `done/*/review.md` ledgers** — a frozen-ledger and ADR-034 collision the report never names. Separately the condition's literal full-path patterns **miss the specimen §7.2 lists first**. |
| R19 | 2     | medium | report §4.2.1 :380-385, :411-414 vs §4.6 :613 | **An optional element is promoted into a requirement, against the ruled schema.** §4.6 ruled `Task: 0159`, *"**Optionally** with a live relative link beside the ID"*. §4.2.1 rules *"**never** unwrap the link"* and calls dropping it *"wrong"* — but `Task: 0001` with no link is the canonical ruled form and is fully durable. |
| R20 | 2     | medium | report §4.2.1 :372-375 vs §1 :79-80; routing gap at §8 :925 | **The general writer rule contradicts §1 as worded.** *"A link's display text must **never** be a mutable coordinate"* bans a linked `path:NNN` that §1 expressly permits for source files and findings. Live specimen in-repo. **And it has no route out of the report:** follow-up 1's contents list does not include it. |
| R21 | 2     | medium | report §4.4.1(b) :518-521 vs :505-506 (promoted at §4.2.1 :362-364) | **(b)'s "decisive" objection 3 is a false equivalence.** (b) is defined as mapping *"the header's **slug** to a folder at the moment of reading"*; the 4 hrefs are a **static authored** `./brief.md`, which resolves nothing at read time. They are not *"read-time resolution already shipping"*. |
| R22 | 2     | medium | report §1 :63, :74 vs the §1 table :79-83 | **The R6 replacement discriminator is overclaimed.** Presented as *"the whole test"* and *"the one that actually splits the rows"*, it cleanly decides **one** of five table rows. Row 3 **contradicts** it, row 1 gets two different answers, row 4 does not parse, row 5 needs a distinction the question does not supply. |
| R23 | 2     | low    | report §4.2.1 :346-347, :353-368 | ***"The more dangerous of the two"* is not established.** The support is per-instance detectability only; frequency, consequence and population are never weighed — and the populations (**36 vs 4**, after R16) point the other way. |
| R24 | 2     | low    | report §4.2.1 :388-392, §4.4.1(d) :557-558 | **New text re-deploys the premise the report conceded is a non-sequitur**, and uses it to state *"**R2's** … argument does not reach it"* — without the disclosure §4.4 :477-486 carries for the same premise. |
| R25 | 2     | low    | report §4.1 :246-248 vs §4.2 :296 | **§4.1 still prints the classifier precedence the report blames for the false Fact C** — *"backtick span → markdown href → bare text"* — while §4.2 states *"The corrected classifier tests for `[…](…)` **first**."* |

#### Evidence per round-2 finding

**R16** — §4.2.1:336-338 reads: *"**Gap A — the 56 that rule never reaches.** 30 code spans + 25 bare −
the 4 hrefs + … precisely: **56 headers are not hrefs at all** (26+4 code span, 10+15 bare). There is no
href to re-point, so the rule is a no-op on every one of them. **This is a miss.**"* The parenthetical
sums to 30 + 25 = **55**. §4.2's own table gives 59 headers − 4 hrefs = **55**. **56** is `60 files − 4`,
which counts the one file with **no header at all** (`0080`) — routed separately as `0168` item 5 at
§8.2:1027-1028. Second error, independent of the first: of those 55, **19 name a live path** (4 code
span + 15 bare, my measurement and Codex's); the mover's href rule is a no-op on them too, but there is
nothing to miss. The dead-pointer class §4.2.1's own comparison table (:353, *"Gap A — dead pointer"*)
is about is **36**. Load-bearing: §4.2.1's stated purpose is *"`0168` executes against a ruling"*
(:320-321), and the split it hands `0168` is **40 = 36 + 4**, which appears nowhere. Repeated verbatim
at §4.3:441-443 (*"**56** headers are code spans or bare text"*) and §8.2:978-979 (*"The other **56** are
code spans and bare text"* — false for `0080`, which is neither). **Raised by Codex; verified and graded
by me.**

**R17** — verified from git rather than argued. `ai-agents/tasks/done/0001-add-backlog-board-default-for-unsprinted-task-briefs/review.md`:

- at `331f298` (2026-07-21, *"task 76: migrate every task into a folder; update all tooling (ADR-029)"*) —
  ``Task: [`ai-agents/tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md`](../tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md)``
- at `185b321` (2026-07-21, *"Tasks update"*, 113 files changed) —
  ``Task: [`ai-agents/tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md`](./brief.md)``

**The target was rewritten; the label was left byte-identical.** So the header was **not** *"written at
authoring time"* in its present form, and something **did** govern it. §4.3's account is the correct one
and §4.2.1's is false. **Codex raised the contradiction but resolved it the wrong way** — it asserted
*"No evidence says the mover authored or changed it"* and concluded §4.3 was unsupported; the git
history above refutes that. Precision the fix should keep: `185b321` is a post-ADR-029 sweep commit, so
*"the **mover**"* names the actor loosely — what is established is that a link-repair pass touched the
target and left the label. That is §4.3's *"more damning"* reading and it **strengthens** the repair
case. Consequence: §8.2:981 relays *"See §4.2 and **§4.3**"* to `0168`, so a `0168` coder reads both
accounts and gets a contradiction.

**R18** — §7.2:900-903 states: *"The live violations I measured on 2026-08-01 are the three external
citations in §3.1 (`0013`, `0149`, `0158`) plus the three inside `0160`'s own brief. If the vault is in
scope, `log.md:683`/`:743` are two more."* Applying §7.2's **own** condition (:886-888 — a `<path>:<NNN>`
whose path matches `ai-agents/sprints/*.md`, `ai-agents/tasks/*/*/brief.md`, or
`ai-agents/wiki-vault/log.md`) over §7.2's **own** *"defensible core"* scanned set (:892-893 —
`ai-agents/tasks/*/*/*.md` and `ai-agents/sprints/*.md`) gives **39 citations across 20 files** — and
**39 across 20 still** after applying §7.2 item 2's own suggested convention of skipping fenced blocks
and blockquote lines. Three separable problems:

1. **The vault-scope framing is a category error.** `log.md:683`/`:743` are cited **from**
   `ai-agents/tasks/done/0148-…/review.md:17-18`, squarely inside the stated scanned set. Whether the
   vault is scanned is irrelevant to them; the *target* is what the condition tests.
2. **27 of the 39 sit in closed `done/*/review.md` ledgers** (`0001`×3, `0010`, `0054`, `0062`, `0082`,
   `0105`, `0126`×4, `0141`×3, `0148`×8, `0150`, `0157`, `0159`×3). §7.2 says the guard *"lands after a
   cleanup"* — that cleanup means editing 27 citations in **frozen historical ledgers**, which collides
   head-on with §4.3's own frozen-ledger rule and with ADR-034. §7.2's stated purpose is *"stated now so
   they are not discovered late"*; this is the single largest thing it does not state.
3. **The condition misses its own lead specimen.** `0013/brief.md:28` reads
   ``[`sprint-2.md:354`](../../../sprints/done/sprint-2.md)`` — the bare `sprint-2.md:354` does not match
   `ai-agents/sprints/*.md`, so the guard as written would not flag the first violation §7.2 lists.
   Codex found the same shorthand gap independently and adds that `0160`'s own brief cites the same way
   at `:40`, `:89`, `:113`. The condition must say whether *"names"* means literal full-path syntax or
   resolved shorthand. **Follow-up 8 is buildable and would be red** — that half of the claim is
   confirmed by both reviewers; it is the size and the specification that fail.

**R19** — §4.6:613 rules: *"**Optionally** with a live relative link **beside** the ID, never in place of
it."* §4.2.1:382-385 rules: *"**never** touch the target, and **never** unwrap the link (unwrapping
discards the working half and keeps the broken half — strictly worse than doing nothing)"*, and :413-414
*"**Both mistakes are available and both are wrong**: the first preserves the defect, the second destroys
the one part that always worked."* Under §4.6, `Task: 0001` **with no link at all** is the complete,
canonical, fully durable normalization — dropping the link is not one of two mistakes, it is the ruled
form. What is genuinely wrong is unwrapping to a **bare dead label**; §4.2.1 does not distinguish that
from removing the link while replacing the header. **Raised by Codex; verified against §4.6's text.**
**Sub-note, mine:** §4.2.1's sweeper test asks only *"Does the target resolve?"* — resolving is not the
same as move-proof. A relative target such as `../../done/<slug>/brief.md` resolves today and dies on
the next move, and label-only repair would preserve it. **No such instance exists in this corpus** (all
4 targets are `./brief.md`, verified), and §8.2:991-993 states the move-proof point for these 4 — but
the rule at :380-386 is written generally and does not.

**R20** — §1's table :79-80 rules `path:NNN` **correct** for *"a source file, test, skill or agent file,
cited in a design doc or a finding"*. §4.2.1:372-375 rules: *"**A link's display text must never be a
mutable coordinate.**"* A citation written ``[`fkit-task-done/SKILL.md:170`](../../claude/skills/fkit-task-done/SKILL.md)``
is permitted by the first and banned by the second. Live specimen in-repo: `0013/brief.md:28`. The
defensible rule is narrower — do not use a mutable **location** as the visible identity of a
**forwarding** link into a **living** document — which is what §4.2.1's own next sentence (:377-378)
actually argues. **Raised by Codex; verified.** **Routing half, mine, and it bears directly on the
residual the author put on record:** the author correctly declined to write this rule into the
convention page (that page does not exist yet; it is unfiled follow-up 1, and the page was outside this
round's change surface) and flagged it as an unfiled consequence in this ledger. But **§8:925 lists
follow-up 1's contents as *"§1's rule, the §1 table, the §1.1 rider and §1.2's ledger-row practice
note"*** — §4.2.1's writer rule is not in that list, so a producer filing follow-up 1 from §8 carries
none of it. The flag lives only in the ledger, which the producer does not read to file follow-ups. One
line in §8:925 closes it — **and it should carry the narrowed wording, not the `never`.**

**R21** — §4.4.1 defines (b) at :505-506 as *"a reader — or a tool — recovers the task's current location
by mapping the header's **slug** to a folder at the moment of reading."* Its objection 3 (:518-521)
reads: *"**The 4 href headers are read-time resolution already shipping, and they demonstrate the
failure.** … That is (b) in production."* They are not: `./brief.md` is a **static href authored into the
file**; nothing consumes the slug and nothing resolves at read time. What the 4 actually demonstrate is
that an independent durable pointer does not repair stale display text — a real and useful point, but
not a disproof of (b). **(b)'s verdict survives** on objections 1 (no resolver exists), 2 (readability
unfixed) and 4 (the generator keeps running); the *"in production"* leg does not. Material because
§4.2.1:362-364 promotes exactly that leg into the Gap B ruling: *"§4.4.1(b) already used these four as
the disproof of read-time resolution … and this is the same observation promoted to a ruling."*
**Raised by Codex; verified against (b)'s own definition.** Confirmed separately: all four alternatives
**are** given a real for / against / verdict — the R4 repair is structurally sound and is **not**
re-raised.

**R22** — §1:63 introduces the replacement as *"That is the whole test, and a writer can apply it in one
question"*; :74 calls it *"the one that actually splits the rows"*. Walked against §1's own table:

- **Row 1** (source/test/skill/agent file, *"cited in a design doc **or** a finding"*) — the row bundles
  two uses that answer differently. A **finding** is a claim about a read revision → safe ✓. A **design
  doc** citation is a pointer for a later reader → the question says **unsafe**, the table says
  `path:NNN` is **correct**. The row is carried by its Because cell, not by the question.
- **Row 2** (file under review) — ✓ decided, and this is the row R6 was about. The replacement is a
  genuine improvement here.
- **Row 3** (coordination document) — **contradicted.** A citation of `sprint-2.md:162` as a claim about
  the revision the writer read answers *"claim"* → the question says **safe**; the table rules
  `path:NNN` **wrong**, categorically. This report does exactly that in §3.4:232-234, and §7.2:894-895
  concedes it (*"Widening it … would fail on **this report**, which cites `sprint-2.md:162`"*).
- **Row 4** (a task) — does not parse. *"Use the folder-name `NNNN` prefix, always"* is a durable-identity
  ruling; the question offers no route to it, and the Because cell cites ADR-029 instead.
- **Row 5** (a board position) — partial. Separating rank from identity comes from
  `priority-is-rank-not-identity.md`, not from the question.

One row cleanly decided, one contradicted, one ambiguous, one inapplicable, one partial. **This is a new
defect in the R6 replacement, not a re-raise of R6** — the old question failed row 2, which the new one
fixes. The rule block at :57-61 is sound; the **overclaim** at :63 and :74 is the defect, and it matters
because follow-up 1 copies §1 into a convention page. **Both reviewers found this independently**;
Codex's row-3 counter-example is stronger than my row-1 one and is the one to fix on.

**R23** — §4.2.1:346-347 rules *"a stale label on a working link is a **DIFFERENT** defect from a dead
pointer, and it is the **more dangerous** of the two."* **The "different" half holds and is the
load-bearing half** — different failure mode, different repair, correctly derived. The *"more
dangerous"* half is supported only by the :353-358 table, which establishes *"harder to notice per
click"*; :366-368 adds contagion and then expressly disclaims measuring it (*"Stated as a mechanism,
**not** as a measured claim"* — honest, and correctly flagged by the author). Frequency, consequence and
aggregate exposure are never weighed, and the populations are **36 versus 4**. Nothing in the remedy
turns on it — §4.6 repairs all 40 identically — which is why this is low, not medium. **Both reviewers
found it; Codex graded it medium, I grade it low on blast radius.**

**R24** — §4.2.1:388-392: *"A header label is not a quotation — **per Fact A it asserts nothing its own
folder does not already assert**. Repairing it is a pointer normalization … and **R2's 'a code span may
be a claim about review day' argument does not reach it for the same reason.**"* §4.4.1(d) objection 4
(:557-558) uses the same premise. But §4.4's warning box (:477-486) **concedes** that Fact A's method
establishes **task identity**, not the absence of a claim about where the brief sat, and that the
rebuttal *"does not follow from the evidence offered for it"*. Two newly written passages dismiss R2 on
exactly the reasoning R2 disproved, and neither carries the disclosure §4.4 carries. **This does not
reopen R2 and does not touch the remedy** — the conclusion is right on an independent ground the section
already states: a header label is a **pointer**, not a quotation, so §4.4.1(d)'s quotation protection
genuinely does not reach it. The defect is that the sentence leans on the conceded premise instead.
Codex suppressed R2 entirely and did not reach this; **mine alone.**

**R25** — §4.1:246-248 states the method as *"extract the path (backtick span → markdown href → bare
text, then trimmed to the first `\S+\.md` token …)"*. §4.2:296 states *"The corrected classifier tests
for `[…](…)` **first**."* **No published count is affected** — verified by running both precedences: for
all 4 hrefs the label sits inside backticks inside the link text, so both orders extract the same dead
path, and 40/19/60 and 17-14-9 are identical either way. But §4.1 is the method section a reader
reproduces from, and as written it re-derives the notation bug §4.2 exists to correct. **Mine alone.**

#### Not recorded as round-2 findings

- **§4.2.1's central distinction holds.** Gap A (no href to re-point) and Gap B (target already correct;
  *"change nothing else"* forbids the label edit) are genuinely different defects with genuinely
  different repairs. The mover-rule quote at `fkit-task-done/SKILL.md:170-171` — *"re-point the href,
  change nothing else"* — is **verbatim and correct**, including its **sibling**-folder qualifier.
- **§4.2.1's stated conditional holds, and the failure mode is real.** Verified against §4.6:613's own
  wording: a sweeper producing ``Task: 0001 — [`dead path`](./brief.md)`` satisfies *"the ID with a live
  relative link beside it"* while leaving all four defects intact. **Both reviewers confirm it
  independently.** It **is** stated where a sweeper looks — §8.2:998-1007, the *"what `0168` receives"*
  relay, with the recommended form `Task: 0001 — [brief](./brief.md)` spelled out. Codex explicitly
  recorded *"No finding there"*, and I agree. **Noted, below finding threshold:** §4.6's ruling box and
  §8:928's follow-up-4 row do not carry the condition, so a producer filing from §8 alone would not see
  it. Two independent passes judged the §8.2 relay sufficient; recorded as a note, not a finding.
- **§4.2.1 does not re-import R3's error.** Its loud/silent usage (:356) is self-defined inline and
  matches §3.4's taxonomy — a dead pointer is the **loud** category. That is the corrected reading, not
  §4.4's conceded one. Independently confirmed by Codex. **R3 is not re-raised by either reviewer.**
- **§4.4.1 satisfies R4 structurally.** All four brief-mandated alternatives receive a for, an against
  and a real verdict, and (d) is given a genuinely strong case before rejection. Only objection 3 inside
  (b) fails (R21).
- **The corrected Fact C reproduces in full**, on a third fully independent run — see the measurement
  block above. R1's repair is sound.
- **The follow-up count and §10's breakdown are consistent** — eight follow-ups at §8:923-932, and
  §10:1113-1114's *"two of the eight are filed … six need filing … none of the eight is implemented"*.
  R11's repair holds. §12's four-modified / two-untracked claim reproduces against `git status` today.
- **`npm test` was not re-run by me** — the round-2 delta is documentation-only, touches no source, and
  no test asserts against this report. Codex attempted a re-run and it was **inconclusive** (the
  read-only sandbox blocked test-fixture `mkdtemp` with `EPERM`); that does not refute the author's
  recorded 523-test pass, and nothing in round 2 could have regressed it. **Stated rather than implied.**

---

### Round 4 — 2026-08-01 — **full re-review of the whole artifact, not the delta**

Reviewers run: **fkit-reviewer (own pass)** + **Codex adversarial second opinion — coverage FULL**
(`codex-cli 0.145.0`, `codex exec --sandbox read-only`). **No reviewer was skipped; this is not a
degraded run.** Scope: the entire 1402-line report re-attacked from scratch, at the owner's explicit
instruction that a narrow R18-only pass was not acceptable.

**Verdict: ⚠️ Changes requested — 5 confirmed defects (0 high, 2 medium, 3 low). None blocks the
case-3 ruling, the §4.6 remedy, the `40 = 36 + 4` split, or any instruction `0168` executes against.**

**Round 3's zero refutations were genuine convergence, not insufficient resistance — and I checked
rather than assumed.** Every count in the report reproduces on a fifth fully independent run; every
named quotation is verbatim with a correct location; the self-citation sweep is clean; and the R23
load-bearing check holds. The five findings below are all in text written *in round 3*, and four of
the five are one-clause repairs.

#### Independently re-measured, not inherited

My own Python pass over `ai-agents/tasks/done/*/review.md`; Codex ran its own; both agree cell-for-cell
with the author's round-3 table — **five independent runs now agree**:

124 folders under `done/` · **60** carrying a `review.md` · **59** with a `Task:` header · **1 without**
(`0080`) · **40 dead / 19 live** · notation **30 code / 25 bare / 4 href** · dead **26 / 10 / 4** · live
**4 / 15 / 0** · dead variants **17 folder-form / 14 flat-`backlog` / 9 flat-`done`** · non-href **55** ·
**Gap A 36 / Gap B 4 · 36 + 4 = 40 ✓** · the 4 hrefs are `0001`, `0010`, `0022`, `0039`, all targets
exactly `./brief.md`, all 4 resolving. **R16's repair is correct and complete.**

#### The R18 adjudication — resolved against the corpus, deferring to neither prior number

**Method:** §7.2's own condition (a `<path>:<NNN>` whose path names `ai-agents/sprints/*.md`,
`ai-agents/tasks/*/*/brief.md`, or `ai-agents/wiki-vault/log.md`) run over §7.2's own *"defensible
core"* scanned set (`ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md`), skipping fenced blocks and
blockquote lines, counting occurrences with overlapping matches deduped.

| Reading | Citations / files | in closed `done/*/review.md` | Reproducible? |
|---|---|---|---|
| **Literal full path** | **38 / 19** | **27 across 11** | **Yes — exactly.** Mine, Codex's and the author's runs agree, including the post-exemption **11 / 8** and its **6 `backlog/` briefs + 3 `ai-agents/sprints/` + 2 non-`review.md` under `done/`** breakdown |
| Literal + elided prose paths | **39 / 20** at round-3 measurement time; **40 / 21** today | 28 across 12 | Yes, but **already drifted** — see R30 |
| Resolved shorthand | published **391 / 53**; Codex **399 / 53**; mine **296–318 / 46–48** | published 264/28; Codex 264/28; mine 186/23 | **No** — the reading is under-specified, so the figure is pattern-dependent |

**The author is right and my round-2 figure was wrong.** The strict literal reading is **38 / 19**, not
39 / 20. The single difference is exactly what the author identified: `0150/review.md:24`'s **elided**
prose path (`ai-agents/tasks/done/0119-…/brief.md:26`), which only a pattern admitting `…` matches.

**My *"27 of the 39"* was internally inconsistent, and the author is right that my own enumeration sums
to 28.** The diagnosis: **27** is the closed-ledger count under the **literal** reading; **39** was the
total under the **elided** reading; my enumeration (28 across 12) was the closed-ledger count under the
**elided** reading. **I paired a literal numerator with an elided denominator.** Neither prior headline
number was wholly right; the author's strict re-measurement was, and **§7.2 as printed is correct.**

**Which reading follow-up 8 should specify — my ruling:** the guard's **shipping condition should be
specified on the LITERAL full-path form**, because it is the only reading that is reproducible (four
independent runs agree) and therefore the only one usable as a test's acceptance criterion; and the
**shorthand-resolution extension must be filed as its own explicitly named decision** with its own
measured cost, **not** folded into decision 2. Literal-only is not sufficient on its own — it misses
§7.2's own lead specimen — which is precisely what **R27** below is about.

| #   | Round | Sev    | file:line | Claim |
|-----|-------|--------|-----------|-------|
| R26 | 4     | low | report §4.2.1 :361-374 vs §4.3 :573-575 (relayed §8.2 :1158-1162) | **§4.2.1's Gap A / Gap B "reach" asymmetry omits the scope accident its own §4.3 names.** The mover clause is written for a **sibling** folder's `review.md`; every measured header sits in the folder's **own** `review.md` pointing at its **own** brief — the one direction the clause was not written for. So the clause does not reach Gap B by coverage either, and *"the 4 the rule reaches and correctly declines to change"* reads as clause-coverage where only an **empirical** fact (R17's git evidence) is established. |
| R27 | 4     | medium | report §7.2 :1040-1041 vs :1056-1057 | **§7.2 attributes the 38 → 391 blow-up to the wrong decision, and never lists the decision that actually causes it.** :1056-1057 says *"**Decision 2** above is therefore not a detail: it is the difference between a 38-line cleanup and a 391-line one"* — but :1040-1041, fifteen lines earlier, says skipping fenced blocks and blockquotes *"changes **nothing** under either literal reading (38 either way)"*. The 10× swing is the **literal-vs-resolved-shorthand** reading of *"names"*, which is **not one of the three stated decisions** a follow-up-8 implementer is told to make. |
| R28 | 4     | medium | report front matter :6-18 | **The report's own Status block is three rounds stale and materially false in three respects.** It reads *"**Round 1 of review processed**"*, lists corrections for **R1–R15** only, and states *"**Three** findings — R2, R3 and R9 — … ruled ACCEPTED RESIDUALS"*. After rounds 2 and 3 there are **25** findings and **six** accepted residuals (R2, R3, R9, R23, R24, R25). A reader of the front matter — including a `0168` coder — is told half the residual set exists. |
| R29 | 4     | low | report §8.2 :1170-1171, :1181-1184 | **§8.2 attributes a clause to `0168`'s brief that the brief does not contain.** *"`0168`'s brief … **says**: *treat as text-only, do not re-point, do not unwrap, break no working link*"* — but `0168/brief.md` never says *"text-only"* (it says the target *"must not be re-pointed or unwrapped"*, `:183`). §8.2 then critiques *"'Text-only' … does **not** say the label must be **replaced**"*, i.e. it analyses wording it supplied itself. **The substantive point survives** — the brief as actually written does not require replacement — but the attribution does not. |
| R30 | 4     | low | report §7.2 :1034-1038, :1072-1076 | **§7.2's red-set figures are measured over a scanned set that contains this task's own growing ledger, and have already drifted.** `ai-agents/tasks/*/*/*.md` includes `0160/review.md`, which grew ~380 lines in round 3 and grows again here. Elided reading: **39 / 20 → 40 / 21** (the extra hit is `0160/review.md:595`, this ledger's own round-3 text quoting the elided specimen). Shorthand post-exemption: **127 / 25 → 130–135 / 25**. The **literal** figures are stable at 38 / 19 / 27 / 11-8. Figures published without an as-of snapshot read as durable and are not. |

#### Evidence per round-4 finding

**R26** — `claude/skills/fkit-task-done/SKILL.md:170-171` reads *"A hit in a **sibling** task folder's
`plan.md`, `worklog.md` or `review.md` … re-point the href, change nothing else."* `:176-184` covers
*"The moved folder's OWN outbound links"* but explicitly *"to a **sibling** task"*. **Neither bullet
covers own-`review.md` → own-`brief.md`** — which §4.3:573-575 states correctly as a second,
independent *"scope accident"*, and which I confirmed in round 1 while disproving a Codex claim to the
contrary. §4.2.1 does **quote the sibling qualifier verbatim at :362**, so the limit is on the page —
but its Gap A bullet grounds *"that rule never reaches"* on the **notation** accident alone (*"There is
no href to re-point"*), and its Gap B bullet says *"change nothing else" **actively forbids** touching
the stale label*, which is only a live constraint if the clause applies. **Downgraded to low, and here
is the blast radius I traced:** no count moves (Codex concedes the 36/4 split survives, and my own run
confirms it); §4.6 repairs all 40 identically either way; §8.2:1208-1210's conclusion — *"the movers
gain no new duty … needs no amendment for the header"* — holds under either reading, because the
folder-ID schema removes the path entirely. What fails is the **characterization** of
`/fkit-task-done`'s current behaviour as *"correct behaviour, not a miss"* rather than *"unspecified —
the clause does not reach this direction either."* One cross-reference to §4.3 closes it.
**Raised by Codex at medium; verified and graded low by me on blast radius.**

**R27** — the two sentences, both inside §7.2 item 3, fifteen lines apart:

- :1040-1041 — *"Skipping fenced blocks and blockquotes changes **nothing** under either literal
  reading (38 either way)."*
- :1056-1057 — *"**Decision 2** above is therefore not a detail: it is the difference between a
  38-line cleanup and a 391-line one."*

Decision 2 (:1025-1028) **is** the fenced-block / blockquote convention. **Confirmed independently:**
my run gives 38 with fence-and-blockquote skipping and 38 without — decision 2 changes nothing, exactly
as :1040 says. The 38 ↔ 391 swing is the literal-vs-shorthand reading of *"names a coordination
document"*, which §7.2 discusses at :1052-1057 but **never elevates to a decision**, while its heading
promises *"**Three** things whoever writes it must decide, stated now so they are not discovered
late."* Material because this is the deliverable: the report's job is naming follow-ups, §8:1107 already
knows the reading is a choice (*"or **127** / 25 files, if the shorthand reading is chosen"*), and a
coder filing follow-up 8 from §7.2's decision list decides fence-handling and never decides the one
thing that swings the cleanup 10× **and** determines whether the guard catches the specimens §7.2 names
first (`0013/brief.md:28`, and `0160/brief.md:40`/`:89`/`:113`). **This is the same grep-returned-nothing
class R18's own missed lead specimen belonged to. Mine alone — Codex did not find it.**

**R28** — report :6 reads *"**Status:** **Round 1 of review processed, 2026-08-01.**"*; :11-15 lists
*"**Round-1 review corrections applied to this file**"* naming R1, R4, R5/R6, R7, R8, R10–R15; :16-18
reads *"**Three findings — R2, R3 and R9 — are correct and were ruled ACCEPTED RESIDUALS by the
owner**."* Rounds 2 and 3 applied R16–R22 throughout the file and added **R23, R24, R25** as accepted
residuals — recorded in place in the body (§4.2.1's warning boxes) but contradicted by the front
matter, which a reader reaches first. **Graded medium, not low:** this is the report's own status
metadata on the durable work product `0168` executes against, and the residual count is the one number
a later reader most needs in order to know which claims are accepted-as-weak. Cheap to fix; wrong as it
stands. **Raised by Codex at low; upgraded by me.**

**R29** — `grep -niE 'text-only|text only'` over `ai-agents/tasks/backlog/0168-…/brief.md` returns
**nothing**. What the brief actually says, `:183`: *"Their link **target** (`./brief.md`) already
resolves and **must not be re-pointed or unwrapped**"*; `:223-226` requires re-resolving every href
target after an edit. The report's four italicized clauses at :1170-1171 are a fair **paraphrase**
presented as what the brief *"says"*, and §8.2:1181-1184 then quotes *"Text-only"* back and finds it
under-specified. **The recommendation is right on the brief as actually written** — it genuinely does
not require the label to be replaced — so only the attribution fails. Low. **Note for the record:** the
same phrasing propagated into this ledger's own `## Accepted residuals` (my round-2 text); that is
ledger-internal and ADR-034-covered, and I am not repairing it. **Raised by Codex; verified by me.**

**R30** — `0160/review.md` sits inside `ai-agents/tasks/*/*/*.md`, §7.2's own scanned set. My run today
finds the elided reading at **40 / 21**, with the extra hit at `0160/review.md:595` — this ledger's
round-3 text quoting `ai-agents/tasks/done/0119-…/brief.md:26` as the specimen. **Codex found the
identical extra hit independently.** Shorthand post-exemption drifted from the published **127 / 25** to
**130 / 25** (mine) and **135 / 25** (Codex's, which reproduced the published closed-ledger 264 / 28
exactly). **The literal reading did not drift** — 38 / 19 / 27 / 11-8 on every run. Low, and the fix is
an as-of date plus a sentence naming the self-reference, not a new number. **Both reviewers found it.**

#### Verified, not accepted — the round-3 claims the driver asked me to check

- **R16's fix — correct and complete at all four sites, and no fifth site was missed.** Confirmed by
  enumerating every occurrence of `56` and `55` in the report. The four corrected sites: §4.2 Fact C's
  heading (:315-318, now *"4 of the 59 … the other 55"*), §4.2.1's Gap A bullet (:365-369), §4.3's
  notation accident (:559-564), §8.2's relay (:1154, :1160-1162). **Every surviving `56`** is either an
  explicit correction note (:316, :383, :385, :563, :1160) or §4.6's legitimately different
  `40 header + 16 body` double-count (:764) — **not one is a live wrong figure.** The *"a miss"*
  over-claim is repaired (:367, *"a **miss on the 36 that name a dead path** only"*) and `40 = 36 + 4`
  is printed in a call-out box at :376-381 and starred in §8.2 at :1158. My own run confirms 36 + 4 = 40.
- **R17 — the deletion is clean and left no dangling reference.** `grep` for *"authoring time"* /
  *"never governed"* / *"no mover rule"* returns **exactly one** hit, :393, inside the correction box
  that quotes the deleted sentence in order to retract it. §4.3:566-572 stands and is the surviving
  account. **⚠️ But see R26** — §4.2.1 kept §4.3's *notation* accident and not its *scope* accident.
- **R19 — applied as ruled.** §4.2.1:470-471 now reads *"`Task: 0001` alone — the canonical ruled
  form. Dropping the link is **permitted**"*; §8.2:1190-1195 retracts *"dropping the link … is also
  wrong."* **§4.6:742 is untouched** (*"**Optionally** with a live relative link **beside** the ID"*).
  The narrower binding constraint — the stale label must be **replaced**, never left standing — survives
  in both places. **Correct, and it introduces no new contradiction.**
- **R20 — applied, both halves.** The rule is narrowed at :447-452 to *"Do not use a mutable location
  as the visible label of a forwarding link into a living document"*, with the withdrawn `never`
  recorded at :457-464. §8:1100's follow-up 1 contents list **now names it explicitly and specifies the
  narrowed wording**, closing the routing gap. Verified against §1:105 — no contradiction remains.
- **R21 — applied.** §4.4.1(b) objection 3 (:639-647) is rewritten to *"A durable pointer sitting beside
  dead display text does not fix the display text"*, the *"in production"* leg is retracted, and the
  *"decisive"* label is removed from it (:647). (b)'s rejection now rests explicitly on objections 1, 2
  and 4 (:649-652). The promotion site §4.2.1:429-439 is corrected too. **Verdict unchanged, reasoning
  repaired.**
- **R22 — applied, and the author took the honest route.** §1:70-92 carries a five-row scope table
  conceding **1 cleanly decided, 1 contradicted, 1 answered twice, 1 that does not parse, 1 partial**,
  with the *"whole test"* and *"the one that actually splits the rows"* overclaims corrected in both
  places including inside the round-1 R6 box (:94-101). §8:1100 instructs follow-up 1 to carry the scope
  note. **No new doctrine was invented to paper over the gap** — each row's reason is taken from that
  row's own Because cell.
- **The unrequested §4.6 self-citation repair — confirmed, and no other survives.** `grep -nE
  '§[0-9]+(\.[0-9]+)*:[0-9]'` over all 1402 lines returns **exactly one** hit: :508, inside the
  disclosure box quoting the old `§4.6:509-516` in order to retract it. **Codex swept independently and
  agrees: no surviving operative `§N:LLL` self-citation anywhere in the report.**

#### 🔎 The R23 load-bearing check — run independently, and it is clean

**This mattered because an accepted residual that is secretly load-bearing is an unexamined premise,
and R23 was accepted on the express understanding that it is not.** I did **not** rely on the author's
single-phrase grep.

- **Traced every downstream consumer by reading it**, not by pattern: §4.2.1's writer rule (:445-455),
  the sweeper's two repairs (:466-477), §4.2.1's stated condition (:526-532), §4.6's remedy (:728-774),
  §8.2's relay to `0168` (:1143-1223), and §8's eight follow-ups with their priorities (:1098-1107).
  **Every one derives from the label-versus-target mechanism. Not one derives anything from the danger
  ranking.** §4.6 repairs all 40 identically; §8's follow-up ordering does not prioritise Gap B over
  Gap A. **Delete the ranking and nothing downstream moves — confirmed.**
- **Codex ran its own dependency check and reached the same conclusion independently**
  (*"Gap B dependency: clean … Removing that ranking changes no downstream instruction"*).
- **One imprecision, below finding threshold and recorded rather than dropped:** the report states at
  :413 that *"the phrase occurs exactly once in the report, here."* Case-insensitively it occurs
  **twice** — :403 (the ruling, a **use**) and :405 (the disclosure box, a **mention** in quotation
  marks). Case-sensitively it occurs once, which is what the author's grep measured. The use/mention
  distinction makes the substantive claim true; the sentence is imprecise, and nothing turns on it.
- **Also below threshold:** :441's *"It is also the more contagious"* is a second unestablished
  comparative. It was already named in R23's round-2 evidence, it expressly disclaims being a measured
  claim (:442-443), and nothing downstream cites it either. **Covered by R23, not a new finding.**

#### Not recorded as round-4 findings

- **Every corpus figure reproduces on a fifth independent run** — see the measurement block above.
  Codex reproduced them too, plus §4.6's whole-ledger set (42 ledgers · 55 globally distinct · 57
  per-ledger sum · `40 + 16 − 1 = 55` · 14 ledgers with 16 body-level paths, 17 by per-ledger sum),
  §3.1's brief-citation counts, and §6.2's case-5 board arithmetic. **Clean.**
- **Every named quotation is verbatim with a correct location** — I checked
  `fkit-task-done/SKILL.md:157-159`, `:164-165` and `:170-174`; `adr-034-…:151-153` (*"mislead a later
  reader or a later round"* — R9's quote is accurate); `fkit-stateful-review/SKILL.md`'s schema block;
  and `priority-is-rank-not-identity.md:3-4`. Codex additionally checked the architect's `## Output
  format` bullet and all three wiki flag blocks. **All clean except R29's paraphrase.**
- **The owner's R18 grandfather ruling is implemented in both required places** — §7.2's ruling box
  (:1059-1076) and §8's follow-up 8 row (:1107), which repeats the exemption, names the 27 exempt
  citations, states the `review.md`-only limit, and carries the 11 / 8 residual. **A producer filing
  from §8 alone cannot miss it, which is what the ruling required.**
- **The three ADR-034 framing boxes are correct as written.** ADR-034's own text at `:148-150` —
  *"A task's own record becomes **load-bearing for another consumer** … Then that record is somebody's
  work product and this bar no longer covers it"* — **independently supports** the ledger's insistence
  that the six residuals rest on a direct owner ruling and **not** on ADR-034. The framing has not
  quietly widened.
- **`npm test` was not re-run by me** — round 3's delta is documentation-only, touches no source, and
  no test asserts against this report. The author's round-3 run (**523 tests, 0 failures**, plus
  `test/prove-red.sh` PASSED) is not re-verified here and is **not** inherited as my own evidence.
  Codex did not run it either, per instruction. **Stated rather than implied.**
- **The four uncommitted files from other workers** (`sprint-2.md`, `0160`/`0168`/`0170` briefs) were
  **not** reviewed, reverted, staged or cleaned.

#### Convergence call

**Converging, clearly, and I recommend closeout is now a reasonable owner choice.** Findings per round:
**15 → 10 → 5**. Peak severity: **1 high → 0 high**. **No round-4 finding re-litigates an accepted
residual**, and none disputes the ruling, the remedy, the `40 = 36 + 4` split, or any `0168`
instruction. All five sit in text written in round 3, and four are one-clause repairs; the fifth (R28)
is a front-matter refresh.

**This is not a closeout-for-loop verdict** — the five are new, real defects in new text, so
`🔁 Closeout — no action` would be false. But the honest read of the trend is that the artifact is
sound and the remaining defects are cosmetic-to-specification grade. **The disposition is the owner's:
apply the five, or accept them as residuals and close.** My recommendation is **apply R27 and R28**
(both cheap, both affect what a downstream reader or follow-up-8 implementer acts on) and **accept R26,
R29 and R30 as residuals** — but that is a recommendation, not a ruling.

**⚠️ Nothing was added to `## Accepted residuals` this round.** The five round-4 findings carry **no
owner ruling**, and recording them as settled without one is exactly the move the R2/R3/R9 and
R23/R24/R25 boxes exist to prevent.

### Round 6 — 2026-08-01 — **final verification of the closing round. Narrow by design.**

Reviewers run: **fkit-reviewer (own pass)** + **Codex adversarial second opinion — coverage FULL**
(`codex-cli 0.145.0`, `codex exec --sandbox read-only`), both scoped to the round-5 delta.
**No reviewer was skipped.** This pass confirms the owner's rulings landed; it is **not** a re-attack of
the artifact, and no round-6 material was manufactured.

**Verdict: ✅ Approve — close out. Every ruled disposition landed and was verified against the report;
no new defect at or above finding threshold; one below-threshold imprecision recorded rather than
dropped. Findings per round: 15 → 10 → 5 → 0.**

#### What was ruled, and whether it landed — verified in the report, not inherited from the response

| Ruled | Landed? | Verified where |
|---|---|---|
| **R27 — APPLY** | **Yes, and more completely than my finding asked.** §7.2's decision list now reads *"**Four** things whoever writes it must decide"* (:1042) and decision 4 is *"which reading of 'names a coordination document' the guard's condition uses"* (:1088-1093). **Both misattributing sentences are corrected** — item 3's opening at :1053-1055 and its closing at :1082-1086, each marked in place. **The author is right that it appeared twice; my finding cited only the closing one.** | report :1042, :1053-1055, :1082-1086, :1088-1093 |
| **No third instance survives** | **Confirmed, by both reviewers independently.** Every remaining mention of decision 2 is either its own list item (:1048-1052), the method note *"skipping fenced blocks … per decision 2"* (:1058), the footnote *"changes **nothing** … (38 either way)"* (:1066), a round-5 correction note (:1055, :1085-1086), or the ruling box's *"not folded into decision 2"* (:1101). **Not one attributes the cleanup size or the specimen coverage to decision 2.** | report, swept for `decision 2` / `not a detail` / `38-line` / `391-line` / `depends entirely` |
| **R28 — APPLY** | **Yes on all three falsehoods.** The Status block now reads *"**Rounds 1–5** of review processed"*, *"**30 findings — R1–R30**"* with the per-round ranges (R1–R15 · R16–R25 · R26–R30), the round-2 and round-4 correction lists that never existed, and **nine** accepted residuals **by identifier**. The ADR-034 warning is repeated in the front matter. | report :6-12, :13-23, :24-32 |
| **Owner ruling recorded, with its cost** | **Yes, and plainly — not softened.** §7.2's `🔒 OWNER RULING` box (:1096-1115) and §8's follow-up 8 row (:1175) both carry it. The admission is verbatim explicit: *"the guard is **knowingly incomplete on day one**"*, *"**misses this section's own lead specimen**"*, *"**Those violations are real and the shipped guard will not flag them**"*, and in §8 *"**⚠️ It is therefore knowingly incomplete: it will not flag `0013/brief.md:28`'s bare `sprint-2.md:354`, the specimen §7.2 names first**"* — with `0160`'s own brief at `:40`/`:89`/`:113` named alongside it. **There is no hedge and no burial: it is in the ruling box itself and in the row a producer files from.** | report :1109-1115, :1175 |
| **R30's flagged concern — APPLY** | **Yes.** §7.2's box carries **📅 As of 2026-08-01, and that date is load-bearing (R30)** (:1135), names the self-reference (*"the scanned set … contains this task's own still-growing ledger, so every figure here is a snapshot, not a durable fact"*), states the elided and shorthand drift, and instructs *"**Whoever files follow-up 8 must re-measure at filing time rather than quoting this number**"*. §8's row repeats both the dated figure and the re-measure instruction. | report :1130-1145, :1175 |
| **R26, R29, R30 — ACCEPT as residuals** | **Yes, recorded unsoftened** under `## Coder response` :1054-1103, in the R2/R3/R9 · R23/R24/R25 shape: a real-defects-deliberately-left-standing preamble, each with What / Why / Re-raise-only-if, each attributed to a **direct owner ruling made after an explicit warning**, and an explicit box stating **ADR-034 is not the justification**. **None is softened into a finding that dissolved on inspection.** | ledger :1054-1103 |
| **Both below-threshold notes** | **Both handled, neither dropped.** *"occurs exactly once"* → *"**asserted** exactly once in the report, in the sentence above — its only other appearance is inside this box, quoting it in order to flag it"* (:428-429), with the correction marked (:430-432). *"It is also the more contagious"* is **left standing** with a clause recording that the comparative *"rests on the same unmeasured footing as the danger ranking above, and nothing downstream cites it either"* (:460-466) — **treatment identical to R23's, which is the right call: flag where the claim is made, change no owner-ruled claim.** | report :420-432, :460-466 |

#### The residual count — adjudicated: **nine is right, and six would now be wrong**

R28's subject was a stale count, so a fresh wrong one would reproduce the defect. **I re-derived it from
this ledger's own finding tables and disposition records rather than accepting either number.**

| Round | Findings | Applied | Accepted residual |
|---|---|---|---|
| 1 | R1–R15 (15) | R1, R4, R5, R6, R7, R8, R10–R15 (12) | **R2, R3, R9** (3) |
| 2 | R16–R25 (10) | R16–R22 (7) | **R23, R24, R25** (3) |
| 4 | R26–R30 (5) | R27, R28 (2) | **R26, R29, R30** (3) |
| **Total** | **30** | **21** | **9** |

**30 = 21 + 9 ✓.** No finding is dispositioned accepted-residual and omitted from the nine; no finding
in the nine is anything other than accepted-residual. **My round-4 "six" was correct for the state I
measured** — R26/R29/R30 carried no ruling at that moment, and I said so explicitly at the time
(*"⚠️ Nothing was added to `## Accepted residuals` this round"*). The owner ruled them on 2026-08-01;
they join the set; **nine is the count today and writing six would have reproduced R28 exactly.** The
author's re-derivation is right and its stated reasoning is right.

#### The one consistency change beyond the two ruled remedies — **in scope, not a finding**

§8's follow-up 8 row previously read *"or **127** / 25 files, if the shorthand reading is chosen"*,
offering as an open choice the very thing the owner had just ruled. **Leaving it would have made the
report contradict its own new §7.2 ruling box in the same round it was written** — the ruled remedy
would have landed broken. The row now carries both rulings (:1175) and names the shorthand extension as
a separate decision to file. **Judged in scope:** it is inside the ruled remedy's blast radius, not
adjacent to it; it changes no count, no ruling and no follow-up's existence; and it was **disclosed**
rather than slipped in. The only surviving `127` is at :1140, inside the R30 as-of box as a **historical
drift datum**, correctly framed. The parallel front-matter *"change surface"* alignment to §12's
longstanding wording is the same class. **Neither is recorded as a finding.**

#### 🔎 The literal figures — a **fifth** independent run, and they hold

Because follow-up 8's acceptance criterion is specified on this reading, I re-measured rather than
inheriting the author's round-5 re-derivation: §7.2's own condition over §7.2's own *"defensible core"*
scanned set, fenced blocks and blockquote lines skipped, ellipsis-elided paths excluded.

**38 / 19 total · 27 / 11 exempt · 11 / 8 residual — identical to the published figures**, and the
residual composition matches §7.2 cell for cell: **6 `backlog/` briefs** (`0149`, `0154`, `0158`,
`0160`, `0165`, `0166`), **3 in `ai-agents/sprints/`** (all `sprint-2.md`), **2 non-`review.md` under
`done/`** (both `0092/brief.md`). **That is five independent runs of the literal reading with zero
movement** — round-3 author, round-4 reviewer, round-4 Codex, round-5 author, round-6 reviewer — which
is precisely the reproducibility the owner's ruling rests on. **R30's drift claim also reproduces:**
admitting elided paths gives **42 / 21** today, the four elided-only hits being `0150/review.md:24` plus
**three inside this ledger** (:394, :477, :836). The report's 42 / 21 is right and its self-reference
warning is right.

#### ⚠️ Below finding threshold — recorded rather than dropped, and it carries **no owner ruling**

**R28's replacement front matter is itself slightly incomplete, in the same class R28 named.** The
round-4 applied-corrections list (report :21-23) names **R27 and R28 only**, and :29-30 says the last
five residuals were recorded *"with the report text left as written per the ruling"* — but **R30's
flagged concern was applied to the report**, adding the dated snapshot and the re-measure instruction at
§7.2 :1135 and §8 :1175. So for R30 the *figures* were left as written while a dated caveat **was**
added, and the front matter does not say so. **Raised by Codex, verified by me.**

**Why this is below threshold and does not block closeout:** it misleads no downstream consumer — the
dated caveat and the re-measure instruction are both present and correct at the two places anyone acts
from (§7.2's ruling box and §8's follow-up 8 row), so a follow-up-8 filer gets the right instruction
whether or not the front matter lists it; `0168` acts on §8.2, which is untouched by this. It is a
one-clause omission in metadata, of exactly the grade of the two below-threshold notes handled in round
5. **It is stated here, not buried, and not softened: the R28 remedy landed on all three material
falsehoods and left one immaterial gap.**

**⚠️ It is NOT recorded in `## Accepted residuals`, because it carries no owner ruling.** Recording it
as settled without one is the move the R2/R3/R9, R23/R24/R25 and R26/R29/R30 boxes exist to prevent.
**A one-clause fix is available at the owner's discretion; it is not required to close.**

#### Not recorded as round-6 findings

- **ADR-034 has not quietly widened.** Re-read `adr-034-…:148-153`: *"A task's own record becomes
  **load-bearing for another consumer** … Then that record is somebody's work product and this bar no
  longer covers it."* The ADR's own text **independently supports** the ledger's insistence that all
  nine residuals rest on a direct owner ruling and **not** on ADR-034. **All three residual boxes
  (round-1, round-2, round-4) state this, unchanged and in the same words.** No accepted residual in
  this ledger cites ADR-034 as its justification. **Confirmed, not assumed.**
- **`npm test` was not re-run by me.** The round-5 delta is documentation-only and touches no source.
  The author's round-5 run (**523 tests, 0 failures**, `test/prove-red.sh` PASSED) is recorded and is
  **not** inherited as my evidence. Codex did not run it either. **Stated rather than implied.**
- **The four uncommitted files from other workers** (`sprint-2.md`, `0160`/`0168`/`0170` briefs) were
  **not** reviewed, reverted, staged or cleaned. `sprint-2.md` was not read.
- **No secrets** in either artifact.

#### Convergence call — **closeout, and this one is clean**

**15 → 10 → 5 → 0.** Peak severity 1 high → 0 high → none. **The two ruled remedies landed and were
verified in the report itself; the ruled acceptances are recorded unsoftened with re-raise conditions;
the flagged concern was applied; both below-threshold notes were handled; the one unrequested change was
in scope and disclosed.** The swept work product is clean at the close bar. **The remaining nine
residuals are recorded, attributed to a direct owner ruling, and do-not-re-litigate. Status set to
`closed-out`.**

## Coder response

Round 1 processed 2026-08-01 by **fkit-architect** (the author of the report under review), spawned by
`/fkit-sprint-ship-loop`. The `fkit-process-stateful-review` **method** was applied by hand — that skill
is coder-only and the ADR-018 hook denies it to this role, so it was not invoked.

**⚠️ Two findings carry no owner ruling — R5 and R6.** The owner's 2026-08-01 dispositions covered 13
of the 15 findings (R1, R4, R7, R8, R10–R15 to apply; R2, R3, R9 as accepted residuals). **R5 and R6
were not put to the owner and were not ruled.** I verified both, found both correct, and repaired both
**inside the report file only** — no follow-up added, no schema touched, no owner remedy changed.
Flagged here rather than passed silently.

**Verdict summary: 15 findings, 15 verified CORRECT, 0 refuted.** I re-measured R1, R10 and R12 from
the artifacts myself rather than accepting the reviewer's numbers; all three reproduced. 12 applied,
3 recorded as accepted residuals by owner ruling.

| #   | Verdict | Defect / Frontier | Action | Status |
|-----|---------|-------------------|--------|--------|
| R1  | CORRECT | Defect | Fact C re-measured and rewritten (§4.2 now a notation table: **4 of 60 are hrefs**, dead-label/live-target); §4.3's notation accident rewritten — the 4 hrefs now *strengthen* the repair case; §8.2's relay to `0168` corrected and marked as a corrected relay | ✅ done |
| R2  | CORRECT | Defect | **Accepted residual — owner ruling.** Not repaired. Recorded in place at report §4.4 in a warning box, attributed | ⚪ residual |
| R3  | CORRECT | Defect | **Accepted residual — owner ruling.** Not repaired. Recorded in the same §4.4 box, attributed | ⚪ residual |
| R4  | CORRECT | Defect | New **§4.4.1** weighs all four brief-mandated alternatives explicitly — accept / resolve-at-read-time / location-free anchor / append-not-rewrite — each with for, against and a verdict. Owner's remedy unchanged | ✅ done |
| R5  | CORRECT | Defect | **No owner ruling — my call.** §1.2's flat *"Review-ledger practice is untouched"* replaced: the ban does not reach the ledger row, the §1.1 rider does. Schema quoted; the ask routed to the convention page (follow-up 1), **deliberately not** into follow-up 3 / `0168` item 2. Logged as unenforced in §10. The unpaired `priority-is-rank-not-identity.md:3-4` citation in §1's own table now carries its quote | ✅ done |
| R6  | CORRECT | Defect | **No owner ruling — my call.** §1's one-question test replaced with a discriminating one (*claim about a revision I read* vs *pointer for a later reader*); the old question is quoted and its failure stated. Table row 2 now reads "correct — as a claim" with a caveat block on round-2 re-resolution | ✅ done |
| R7  | CORRECT | Defect | **Open question 7** added to §11, `⏳ Awaits the owner`, with three unweighted candidates and **no recommendation** — deliberately not decided. §5.2's ruling narrowed: folder-ID half IN, `:NNN` half IN, **brief-path half NOT ruled**. Follow-up 5 marked filable-but-not-implementable until ruled | ✅ done |
| R8  | CORRECT | Defect | §7 table row 2 split into policy (enforceable) / meaning (not). §7.2 rewritten with file `test/coordination-citation-policy.test.js`, an explicit condition, and three named scoping decisions. **Follow-up 8** added → **eight** follow-ups. The honest half kept verbatim: no check can verify a cited line still means what the citer meant | ✅ done |
| R9  | CORRECT | Defect | **Accepted residual — owner ruling.** Not repaired. Recorded in place at report §4.5 in a warning box, attributed, including that the omission **cut against** the report | ⚪ residual |
| R10 | CORRECT | Defect | Re-measured independently: **55** globally distinct · **57** sum-of-per-ledger · **56** = this report's 40+16, which double-counts exactly one path (`…/backlog/assert-task-ids-are-unique-in-the-test-suite.md`). §4.6 now prints all three with their semantics and the identity **40 + 16 − 1 = 55**; §8.2's relay corrected | ✅ done |
| R11 | CORRECT | Defect | §10's closing claim corrected to *"not one of the eight is implemented"*, with an explicit breakdown: **2 filed (`0168` = follow-ups 3 and 4) · 6 need filing · 0 implemented**, and a stated duplicate-filing warning for the producer. *(Partial note: read as "implemented", the original sentence was true; read against §10's own neighbouring "the producer files it and a coder writes it", it was not. The ambiguity is the defect and the duplicate-filing risk is real, so I applied it.)* | ✅ done |
| R12 | CORRECT | Defect | Verified by diff myself: ingest and lint byte-identical; **sync differs — 0-space vs 3-space leading indent**, text identical when stripped. §5.2's *"byte-equivalent"* corrected, and follow-up 5's instruction restated as *"make the same textual change in all three"*, never *"make the blocks byte-identical"* | ✅ done |
| R13 | CORRECT | Defect | §1 table row 1's Because cell replaced with the actually-distinguishing reason (edits arrive as a reviewed diff **to the thing you cited**, not as unrelated growth above it); row 3's Because sharpened to name third-party appends | ✅ done |
| R14 | CORRECT | Defect | §7's case-4 cell now answers verification step 4 in its required form: **"nothing can enforce this"**, literally, for today — with the `0165` deferral recorded **beside** it rather than in place of it. **No ninth follow-up created**, keeping the count at the owner's eight | ✅ done |
| R15 | CORRECT | Defect | §5.2's blanket *"every flag is emitted about a task that is about to close"* replaced by the two forms treated separately: `complete` → dead almost immediately; `partial` → **true at emission**, dies whenever the task later closes, possibly never. By-construction conclusion survives for both, and the `partial` form is argued to be the *harder* one to detect | ✅ done |

### Where the fixes landed

Two files, matching the approved change surface exactly:

- `ai-agents/knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md` — all
  12 applied fixes plus the three residual notices. Grew **755 → 1087 lines** (`wc -l`).
- this ledger's `## Coder response` section — this text. **`## Reviewer findings` was not touched, and
  `## Accepted residuals` was not written by me** (the reviewer owns it in its phase-2 pass).

Every correction is **marked in place** in the report, naming its finding number, rather than applied
silently — the false Fact C in particular, because `0168` received it as a stated fact.

### The three accepted residuals, stated plainly

These are **real defects the owner chose to accept**, not findings that dissolved on inspection. All
three were ruled by the owner on **2026-08-01, via `AskUserQuestion` in the live
`/fkit-sprint-ship-loop` driver session**, on the stated basis that the case-3 ruling stands on the
schema change — which **no** finding disputes — and only the quality of the argument for it is at issue.

- **R2 — §4.4 concedes the location-claim counter, then denies it by assertion.** Fact A's method
  (header slug vs containing folder name) establishes **task identity**; it cannot establish that the
  path carried no claim about where the brief sat on review day. The rebuttal *"there is no claim to
  destroy because there was no independent claim"* does not follow from the evidence offered for it.
- **R3 — §4.4 calls a dead path "silent" when §3.4's own taxonomy makes it loud.** §3.4 defines silent
  as landing *"on a neighbouring board row of identical shape … and still reads authoritative"*, and
  says outright *"A fast-drift failure is loud."* A path resolving to nothing is the loud category.
- **R9 — ADR-034 engaged selectively.** The on-point re-raise condition (`adr-034-…:151-153`, residuals
  observed to *"mislead a later reader or a later round"*) is omitted, and an individual-vs-corpus
  distinction ADR-034 does not state is substituted. The omission cut **against** this report.

⚠️ **ADR-034 is NOT the justification, and must not be cited as one.** ADR-034 accepts residuals in a
task's **own record**; these three sit in the **work product**. The owner was explicitly warned of that
gap and ruled anyway. **The justification is a direct owner ruling and nothing else.**

### What I did not do

- **No follow-up brief written.** Naming them is the deliverable; the producer files them.
  Follow-up 8 is **named**, not filed.
- **Open question 7 is not decided.** Three candidates listed, no recommendation, `⏳ Awaits the owner`.
- **Nothing outside the two files above was written.** No `claude/`, no `brief.md` (neither `0160`'s nor
  `0168`'s), no `sprint-2.md`, no `wiki-vault/`, no task moved, no rank changed, no commit, no push.
- **The four pre-existing uncommitted edits were not reverted, staged or cleaned.**

### Verification after the changes

- **`npm test`: 523 tests, 17 suites, 0 failures**, and `test/prove-red.sh`'s hard gate `✓ PASSED` —
  all 7 mutations reddened their named assertion. Same figures as before the edits; nothing regressed.
- **Rank sequence unchanged:** `diff` of `grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md`
  between `HEAD` and the working tree is **empty** — 148 ranks, zero difference.
- **`git status --porcelain`** shows 4 modified + 2 untracked. The 2 untracked are this task's report
  and this ledger. Of the 4 modified — `sprint-2.md`, `0160/brief.md`, `0170/brief.md`,
  `0168/brief.md` — **none was written by me**; the first three predate my first action this run and
  `0168/brief.md` is the producer's separate Fact C correction. Report §12 was updated to say four
  rather than the three it originally recorded.

### One residual I want on record — my own, not the reviewer's

**§4.4.1 recommends `append rather than rewrite` for the 16 body-level dead paths** (those inside
verbatim quotations, e.g. `0148/review.md:79`), where rewriting would falsify a quote. That is a
**recommendation into §4.6's already-open scoping question for follow-ups 4 and 7** — it is explicitly
**not** a change to the owner's ruled remedy, which governs the 40 headers. If the owner reads it as
remedy scope creep, it should be struck; I judged it inside the scope note the first draft already
left open, and I flag the judgement rather than assume it.

---

### Round-2 note — 2026-08-01 — the Gap B ruling

**Not a reviewer finding.** This round was opened by the owner, not by the reviewer: a producer
correcting `0168`'s brief re-measured the corpus and found that round-1's **R1** fix got **half** of what
Fact C means. R1 correctly changed *"0 of 60 headers are hrefs"* to *"4 of 60 are hrefs"*. It did **not**
rule on what those 4 are, and `0168` executes against rulings.

**Owner rulings carried into this round, recorded:** **R5 and R6 are ratified as applied** — including
routing R5's consequence to the convention page rather than into follow-up 3 / `0168` item 2 — and
**§4.4.1's append-not-rewrite recommendation for the 16 body-level paths is kept** as a recommendation
into §4.6's open scoping question. **I changed nothing about any of the three.**

**I re-measured the corpus myself** rather than inheriting the two prior agreeing measurements
(`conventions/evidence-before-assertion.md`; twice this run a re-measurement has caught an error).
Method: for each of the 60 `done/*/review.md`, take the first `Task:` line, classify **notation** by
testing `[…](…)` **before** the backtick span, extract the **named** path (link *text* for an href), and
`test -e` it. **Every figure reproduces** — 40 dead / 19 resolve / 60 files, notation **30-25-4-1**,
variants **17-14-9**, all 4 hrefs inside variant 3's nine, all 4 targets `./brief.md` and all 4 resolving.

**What I found that the fix had not captured:** **notation and variant are independent axes.** The
original measurement took only the variant axis and inferred notation from it — that is the actual
mechanism behind "0 hrefs", and it is why the corrected count alone was not enough.

**The ruling — new §4.2.1.** A stale **label** on a **working** link is a **different** defect from a
dead pointer, and the more dangerous one, because it **inverts §1.1's self-correction property**: a dead
pointer announces its failure when followed; Gap B never announces anything, because following it works
and only *reading* it misleads. Gap A (56 non-href headers) is a mover **miss**; Gap B (the 4) is **not**
— `SKILL.md:171` says *"re-point the href, change nothing else"*, and for these four the target needs no
re-pointing while *"change nothing else"* forbids touching the label. **`/fkit-task-done` doing nothing
there is correct behaviour.**

**Does the folder-ID schema close both? Verified rather than asserted — and the honest answer is
conditional.** Gap A: closed unconditionally. **Gap B: closed only if the normalization *replaces* the
label rather than prepending an ID beside it.** A sweeper who prepends `Task: 0001` and leaves
`[`dead path`](./brief.md)` standing **satisfies the schema and leaves all four defects intact** — the
cheapest reading of the instruction as written. That condition was stated nowhere before this round.

**What `0168` should do with the 4** — its brief's *treat as text-only / do not re-point / do not unwrap
/ break no working link* is **correct on all four clauses**; the one gap is that "text-only" does not say
the label must be **replaced**. Recommended normalized form: `Task: 0001 — [brief](./brief.md)`. **I did
not edit `0168`'s brief** — the producer owns it.

**A residual I want on record.** §4.2.1 states the general writer rule — *a link's display text must
never be a mutable coordinate* — inside this report. Its natural home is the **convention page** that
R5's consequence was routed to. **I did not write it there**: the convention page is outside this round's
two-file change surface, and the owner ruled R5's routing settled. **Flagging it as an unfiled
consequence rather than acting on it** — a follow-up for the producer, not a defect in this report.

### Round-3 response — 2026-08-01 — R16 through R25

**Change surface: exactly two files** — the report, and this `## Coder response` section, appended to.
`## Reviewer findings` and `## Accepted residuals` are **untouched** — the reviewer owns both. No task
file moved, no `brief.md` edited, nothing under `claude/` or `ai-agents/wiki-vault/` touched, nothing
committed. **The four files carrying uncommitted edits from other workers this run were not reverted,
staged or cleaned.**

**Seven fixes applied (R16–R22), zero refuted. Three recorded as accepted residuals (R23–R25).**

#### Every count re-derived — nothing inherited

**I re-measured the corpus myself rather than trusting any number in the review, in the driver's prompt,
or in my own round-2 text.** That is not ceremony. The driver disclosed that it relayed *"Gap A — 56
code-span/bare headers"* to me in round 2 **without checking that 30 + 25 = 55**, and I published it. A
count arriving inside a prompt is precisely what `conventions/evidence-before-assertion.md` forbids me to
pass along unverified, and R16 is what happens when I do.

Independent round-3 run over `ai-agents/tasks/done/*/review.md`:

| Measure | Round-3 value |
|---|---|
| Task folders under `done/` | 124 |
| …carrying a `review.md` | **60** |
| …with a `Task:` header | **59** (`0080` has none) |
| Header path dead / resolves | **40 / 19** |
| Notation — code span / bare / href | **30 / 25 / 4** |
| …dead by notation | 26 code + 10 bare + 4 href = **40** |
| …live by notation | 4 code + 15 bare + 0 href = **19** |
| **Non-href headers** | **55** (30 + 25) — **not 56** |
| **Gap A — dead non-href** | **36** |
| **Gap B — dead href** | **4** |
| **The split `0168` needs** | **40 dead = 36 + 4** ✓ |
| Dead variants | 17 folder-form / 14 flat-`backlog` / 9 flat-`done` |
| All 4 href targets | exactly `./brief.md`, all 4 resolve |

**Every published figure reproduces except the two R16 names.** This is now a fourth independent run
agreeing cell-for-cell with the reviewer's, Codex's, and my round-2 pass.

#### R16 — HIGH — **applied. The finding is correct on both halves, and my round-2 text was wrong twice.**

**56 was wrong.** It is `60 files − 4 hrefs`, which counts `0080` — the one ledger with **no `Task:`
header at all**, therefore neither href nor non-href, and routed separately as `0168` item 5. The
correct population is **55**, and **my own parenthetical in the same sentence always said so** (26+4
code span, 10+15 bare). I printed a number that contradicted the arithmetic sitting beside it.

**"A miss" was wrong.** The mover's href rule is a no-op on all 55, but **only 36 name a dead path** —
the other **19 resolve fine**, so on those there is nothing to miss. The comparison table in the same
subsection is explicitly about *"Gap A — dead pointer"*, i.e. the 36.

**The split `0168` executes against — 40 dead = 36 Gap A + 4 Gap B — appeared nowhere in the report.**
That is the more serious half: §4.2.1's stated purpose is that *"`0168` executes against a ruling"*, and
the one number it needed was missing. It is now printed in a call-out box in §4.2.1 and repeated as a
starred bullet in §8.2's *"what `0168` receives"* relay.

**Fixed at all four sites** — the three the finding names plus one it did not: §4.2 **Fact C's own
heading** still read *"4 of the 60 headers … the other 56 are not"*. Corrected to *"4 of the 59 … the
other 55"*. §8.2's form was **additionally false for `0080`**, which is neither a code span nor bare
text; that is now said in the text rather than left for a reader to notice.

#### R17 — medium — **applied. My claim was false and my own §4.3 said so.**

§4.2.1 asserted *"the defect was written at authoring time and no mover rule has ever governed it."*
**Verified from git, not argued** — `0001`'s ledger, same line, three revisions:

- `0ad055a` (2026-07-18), then at `ai-agents/reviews/<slug>.md` —
  ``Task: [`ai-agents/tasks/done/<slug>.md`](../tasks/done/<slug>.md)``
- `331f298` (2026-07-21, *"migrate every task into a folder … (ADR-029)"*) — **target unchanged**
- `185b321` (2026-07-21, *"Tasks update"*) — ``Task: [`ai-agents/tasks/done/<slug>.md`](./brief.md)``

**The target was rewritten between `331f298` and `185b321`; the label is byte-identical across all
three.** So something *did* govern these headers, and it repaired the target and left the label — which
is exactly §4.3's account. **§4.3 is the correct one; §4.2.1's sentence is deleted** and replaced with a
warning box carrying the git evidence.

**Kept from the reviewer, because it is the honest limit of the evidence:** `185b321` is a
post-ADR-029 sweep commit, so *"the mover"* names the actor loosely. What is established is that **a
link-repair pass** touched the target and not the label — which **strengthens** the case for repair.
**Noted for the record: Codex raised the contradiction and resolved it backwards** (concluding §4.3 was
unsupported); the reviewer refuted that with the git history above, and I confirm the reviewer.

#### R18 — medium — **applied, re-measured, and the owner's grandfather ruling written into follow-up 8.**

**My round-2 figure was six citations.** Re-measured in round 3 under §7.2's **own** condition and
**own** *"defensible core"* scanned set, skipping fenced blocks and blockquote lines:

| Reading of *"names a coordination document"* | Citations | Files | in closed `done/*/review.md` |
|---|---|---|---|
| Literal full path only | **38** | **19** | **27** across 11 files |
| Literal + elided prose paths (`…/0119-…/brief.md:26`) | **39** | **20** | **28** across 12 files |
| Resolved shorthand too (`sprint-2.md:354`, `0159/brief.md:13`) | **391** | **53** | **264** across 28 files |

**Understated by ~6.3× on the literal reading and ~65× on the shorthand reading.** Skipping fenced
blocks and blockquotes changes **nothing** under either literal reading — 38 either way.

**I confirm the finding's substance and record one small divergence rather than hiding it.** I get **38 /
19 files** on the strict literal pattern where the reviewer got **39 / 20**; the single difference is
`0150/review.md:24`, which cites `ai-agents/tasks/done/0119-…/brief.md:26` with an **elided** path
segment — a real citation, matched only if the pattern admits `…`. **Both readings are defensible and
neither changes the conclusion.** Separately, the reviewer's *"27 of the 39"* and its own parenthetical
enumeration **do not agree** — the list sums to **28** and includes `0150`. My measurement: **27** on the
strict reading, **28** with the elided form admitted. Recorded as a note, **not** as a counter-finding —
R18's three substantive claims all hold.

**All three sub-claims verified independently:**
1. **The vault-scope framing was a category error** — `log.md:683`/`:743` are cited **from**
   `0148/review.md:17-18`, inside the stated scanned set. The condition tests the **target**, not the
   citing file. Rewritten.
2. **The frozen-ledger collision is real and I never named it** — 27 of the 38 sit in closed ledgers.
3. **The condition misses its own lead specimen** — confirmed by running both patterns against
   `0013/brief.md:28`, ``[`sprint-2.md:354`](../../../sprints/done/sprint-2.md)``: the literal
   `ai-agents/sprints/*.md` pattern does **not** match, the shorthand-admitting one does. This is the
   grep-returned-nothing failure mode, and it hit the first violation §7.2 lists.

**🔒 The owner's ruling is written into follow-up 8's definition, not into a footnote.** §7.2 item 3 now
carries a ruling box: *the policy applies going forward; citations already inside closed
`done/*/review.md` ledgers are exempt by name*, consistent with the frozen-ledger rule this report's own
case-3 argument relies on and with ADR-034. **The cost the owner accepted is stated in the report, not
glossed: the guard must carry the exemption from day one or it is red on historical files the ruling has
decided will never be cleaned.** The follow-up 8 table row in §8 repeats it, so a producer filing from §8
alone cannot miss it.

**One thing the ruling does not cover, stated so it is not discovered late:** the exemption names
`done/*/review.md` only. **`done/*/brief.md` and `done/*/worklog.md` are not exempt.** After the
exemption the red set is **11 citations across 8 files** (6 in `backlog/` briefs, 3 in
`ai-agents/sprints/`, 2 in non-`review.md` files under `done/`) — or **127 across 25 files** if the
shorthand reading is chosen. Both re-measured in round 3.

#### R19 — medium — **applied. §4.2.1 yields; §4.6 is untouched.**

§4.6 rules *"**Optionally** with a live relative link beside the ID"*. §4.2.1 ruled *"**never** unwrap
the link"* and called dropping it *"wrong"* — **promoting an optional element into a requirement against
the ruled schema.** `Task: 0001` with no link is the canonical, complete, fully durable form.

**Corrected at all three sites** — §4.2.1's sweeper test, §4.2.1's closing condition, and §8.2's relay to
`0168` (which said *"dropping the link to satisfy the schema is also wrong"*). **§4.6 not touched.**

**The binding constraint is narrower and survives intact:** the stale path label must be **replaced**,
never left standing beside a new ID. `Task: 0001 — [brief](./brief.md)` is now stated as **recommended,
not required**.

**The cost the owner accepted, stated in the report:** for the 4 href headers, a sweeper who takes the
bare-ID route **discards a working `./brief.md` target that already exists and cost nothing to keep**.
That is a real loss of convenience. It is **not** a loss of the durable reference — the ID is that.

**Kept from the reviewer's sub-note:** *resolving* ≠ *move-proof*. A target like
`../../done/<slug>/brief.md` resolves today and dies on the next move; the sweeper test asks only *"does
the target resolve?"*. **No such instance exists in this corpus** — all 4 targets are exactly
`./brief.md`, re-verified in round 3 — but the caveat is now in the report because the rule is written
generally.

#### R20 — medium — **applied, both halves.**

**First half — the rule is narrowed.** *"A link's display text must **never** be a mutable coordinate"*
banned a linked `path:NNN` that §1 expressly permits for source files, tests, skill and agent files
cited in a design doc or a finding. Live specimen in-repo, `0013/brief.md:28`. Narrowed to: **"do not use
a mutable location as the visible label of a forwarding link into a living document"** — which is what
the paragraph beneath it always argued.

**Second half — the routing gap is closed.** §8's follow-up 1 contents list read *"§1's rule, the §1
table, the §1.1 rider and §1.2's ledger-row practice note"* — **the writer rule was not in it**, so a
producer filing follow-up 1 from §8 would carry none of it, and my round-2 residual flag lived only in
this ledger, which the producer does not read to file follow-ups. **The list now names it explicitly,
and specifies that it carries the narrowed wording, not the withdrawn `never`** — along with §1's new
R22 scope note.

#### R21 — medium — **applied. The verdict survives; the reasoning is fixed.**

§4.4.1 defines (b) as mapping *"the header's **slug** to a folder at the moment of reading"*. The 4
hrefs are a **static authored `./brief.md`** — nothing consumes the slug, nothing resolves at read time.
Calling them *"(b) in production"* was a false equivalence, and objection 3 was labelled **"decisive"**
on it.

**(b)'s rejection is unchanged** and now explicitly rests on its other three legs — no resolver exists,
readability is unfixed, the generator keeps running — none of which was disputed in round 2. Objection 3
is rewritten to the point the four actually make: **a durable pointer sitting beside dead display text
does not fix the display text** — which is evidence for objection 2. The *"decisive"* label is removed.

**Fixed at the promotion site too**, §4.2.1, which had promoted the broken leg into the Gap B ruling as
*"the disproof of read-time resolution"*.

#### R22 — medium — **applied. I took the "say what it does not settle" route.**

I did **not** try to make the question decide all five rows — doing so would have meant inventing a new
rule inside a repair round. Instead §1 now carries a scope table walking the question against its own
five rows: **1 cleanly decided (row 2, the row R6 was about), 1 contradicted (row 3), 1 answered twice
(row 1), 1 that does not parse (row 4), 1 partial (row 5)** — each with the reason that actually carries
it, **taken from that row's own Because cell**, so this is a scope correction rather than new doctrine.

*"That is the whole test"* → *"the rule block above is the test; this question is a writer's fastest way
into it"*. *"The one that actually splits the rows"* → corrected in both places, including inside the
round-1 R6 correction box which repeated the phrase.

**The honest statement now printed: a writer applying the question alone gets row 3 wrong in the unsafe
direction.** Both conditions must be read together — claim-vs-pointer, **and** whether a third party
edits the target under you. **Follow-up 1 is instructed to carry the scope note, not the bare question.**

**This is a defect in the R6 replacement, not a re-raise of R6** — the replacement is still better than
the original, which ruled a review finding *unsafe*.

### Round-2 findings accepted as residuals — **direct owner ruling, 2026-08-01**

> ⚠️ **ADR-034 is NOT the justification for these three, and must not be cited as one.** ADR-034 accepts
> residual defects in a task's **own record**. These three sit in the **work product** — the report *is*
> this task's deliverable — which ADR-034 does not reach. **The justification is a direct owner ruling
> and nothing else**, made on 2026-08-01 via `AskUserQuestion` in the live `/fkit-sprint-ship-loop`
> driver session, **after the owner was explicitly warned of that distinction**. Recorded this way so
> ADR-034 does not quietly grow a scope it was never given.
>
> **All three are real defects, correct as found, deliberately left standing — not findings that
> dissolved on inspection.** Recorded unsoftened, in the reviewer's own words where possible.

- **R23 — *"the more dangerous of the two"* is not established.** What: §4.2.1 rules Gap B *"the more
  dangerous"* of the two defects. The support is **per-instance detectability only** — *harder to notice
  per click*. **Frequency, consequence and aggregate exposure are never weighed, and the populations run
  36 : 4 the other way.** The contagion argument at :366-368 expressly disclaims being a measured claim.
  Recorded in place at report §4.2.1, in a warning box directly beneath the ruling sentence · Why:
  **direct owner ruling**, 2026-08-01 — **not ADR-034** · Re-raise only if: some later text is found to
  **depend** on the ranking, or the ranking is copied into the convention page.

  > **⚠️ Load-bearing check, run because the driver required it, and the answer is clean.** An
  > accepted-as-weak claim must not keep carrying weight. **It does not.** The *"DIFFERENT defect"* half
  > is load-bearing and is confirmed correct by both reviewers; the danger **ranking** is not. Checked
  > across the whole report: the writer rule, the sweeper's two repairs, §4.2.1's stated condition,
  > §4.6's remedy and §8.2's relay to `0168` each derive from the **label-versus-target mechanism**, and
  > **not one of them cites the ranking**. `grep` confirms the phrase *"more dangerous"* occurs **exactly
  > once** in the report — in the sentence itself. **Delete the ranking and nothing downstream moves.**
  > This is now stated in the report, at the sentence, so a later reader is not misled about how much
  > the claim is holding up. **The sentence itself is left as written, per the ruling.**

- **R24 — new text re-deploys the conceded Fact-A premise to dismiss R2, without §4.4's disclosure.**
  What: §4.2.1 (*"per Fact A it asserts nothing its own folder does not already assert … R2's argument
  does not reach it for the same reason"*) and §4.4.1(d) objection 4 lean on the premise that §4.4's own
  warning box **concedes** is a non-sequitur — Fact A's method establishes **task identity**, not the
  absence of a claim about where the brief sat on review day — and neither passage carries the
  disclosure §4.4 carries for the same premise. Recorded here; **the report text is left as written**
  per the ruling · Why: **direct owner ruling**, 2026-08-01 — **not ADR-034** · **This does not reopen
  R2**, which remains a round-1 accepted residual · Re-raise only if: a **third** passage is written that
  leans on the same premise. **Stated plainly: the conclusion is right on an independent ground the
  section already states** — a header label is a **pointer**, not a quotation, so §4.4.1(d)'s quotation
  protection does not reach it. The defect is the reasoning leaned on, not the verdict.

- **R25 — §4.1 still prints the classifier order the report blames for the false Fact C.** What: §4.1's
  method reads *"backtick span → markdown href → bare text"* while §4.2 states *"the corrected classifier
  tests for `[…](…)` **first**"* — so the method section a reader reproduces from re-derives the very
  notation bug §4.2 exists to correct. Recorded here; **§4.1 left as written** per the ruling · Why:
  **direct owner ruling**, 2026-08-01 — **not ADR-034** · Re-raise only if: someone reproduces the
  measurement from §4.1 and publishes a figure that differs. **No count is affected — verified
  independently in round 3, not taken from the reviewer:** for all 4 hrefs the label sits inside
  backticks inside the link text, so both precedences extract the same dead path, and 40/19/60 and
  17-14-9 are identical either way.

### One self-consistency repair, raised by no finding — disclosed rather than slipped in

§4.2.1 cited **`§4.6:509-516`** for the ruled header form. **That range was already wrong before this
round** — the ruled form sits at `:731-734` — and it was **the only `§N:LLL` self-citation in the
report**. It is precisely the defect §1's table rules on: a line number into a **growing** document,
where the growth was this report's own review rounds. **Replaced with the section name plus the quoted
form**, per the report's own ruling, and recorded in place in the report. Flagged here because it is a
change neither the review nor the owner asked for; it changes no count, no ruling and no remedy.

### Round-3 verification

- **`npm test` — 523 tests, 17 suites, 523 pass, 0 fail, 0 skipped, 32.0 s**, and `test/prove-red.sh`'s
  hard gate **PASSED** (real + unmutated copy green; each of the 7 mutations reds its named assertion).
  Re-run in round 3, not carried forward. The round-2 delta and this round's are documentation-only and
  touch no source, so no regression was possible — **run anyway rather than asserted.**
- **Change surface — exactly two files**, both already untracked before this round: the report and this
  ledger. The four `M` entries in `git status --porcelain`
  (`sprint-2.md`, `0160/brief.md`, `0168/brief.md`, `0170/brief.md`) are **other workers' uncommitted
  edits from this run** and were **not** reverted, staged or cleaned.
- **Rank sequence byte-identical** — `grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md` diffed
  between `HEAD` and the working tree: **148 ranks, zero diff.**
- **Nothing written to `ai-agents/wiki-vault/`**, nothing under `claude/`, **no `brief.md` edited, no
  follow-up brief written, no task folder moved, no mover skill invoked, nothing committed or pushed.**
- **No secrets in either artifact.**

### Round-5 response — 2026-08-01 — R26 through R30

**All five verified against the artifact. None refuted — each is real as found.** Two applied (R27,
R28), three accepted as residuals by direct owner ruling (R26, R29, R30). **No round-6 material was
manufactured**, and nothing here re-opens a settled residual.

| #   | Verdict | Class | Disposition |
|-----|---------|-------|-------------|
| R26 | CORRECT | Defect | **Accepted residual — direct owner ruling.** §4.2.1's Gap A/B "reach" asymmetry still omits §4.3's scope accident. Report text left as written. See the residual box below |
| R27 | CORRECT | Defect | **Applied.** §7.2 now states **four** decisions, not three; the 10× swing is re-attributed to the reading of *"names a coordination document"*, and the owner's literal-form ruling is recorded at the decision. §8's follow-up 8 row carries it too |
| R28 | CORRECT | Defect | **Applied.** Report front matter rewritten: rounds processed, finding range, corrections by round, and the residual set with its identifiers |
| R29 | CORRECT | Defect | **Accepted residual — direct owner ruling.** The attribution to `0168`'s brief is wrong; the substantive point survives. Report text left as written. See the residual box below |
| R30 | CORRECT | Defect | **Accepted residual — direct owner ruling**, *plus* the reviewer's flagged concern applied: the grandfather ruling's cost estimate now carries an explicit as-of date. See both entries below |

**R27 — what changed, and one thing the reviewer did not name.** The misattribution appears **twice**,
not once. The reviewer cited the closing sentence of §7.2 item 3; **item 3's own opening sentence made
the same claim** (*"the size depends entirely on decision 2 above"*). Both are corrected, both marked in
place. The decision list heading now reads **four**, the new decision 4 is *which reading of "names a
coordination document" the condition uses*, and the owner's ruling sits in a box directly beneath it:
**follow-up 8 ships on the LITERAL full-path form; the shorthand extension is filed as its own named
decision with its own measured cost.** The recorded rationale is reproducibility — literal reproduces
exactly across independent runs (**38 / 19**, **27 / 11** exempt, **11 / 8** residual) while the
shorthand reading did not (published **391 / 53** · Codex **399 / 53** · reviewer **296–318 / 46–48**),
and a test's acceptance criterion must be reproducible. **The cost is stated, not glossed:** the literal
condition **misses §7.2's own lead specimen** — `0013/brief.md:28`'s bare `sprint-2.md:354` label, and
`0160`'s brief the same way at `:40`, `:89`, `:113` — so **the guard is knowingly incomplete on day one**
and both §7.2 and §8's follow-up 8 row say so in those words.

**R28 — what changed.** The Status block said *"Round 1 of review processed"*, listed R1–R15, and
claimed **three** accepted residuals. It now states **rounds 1–5**, **30 findings R1–R30** with the
per-round ranges (R1–R15 round 1 · R16–R25 round 2 · R26–R30 round 4), the round-2 and round-4
corrections that were never listed, and **nine** accepted residuals by identifier with where each is
recorded. **The residual count is nine, not the reviewer's six** — the reviewer's figure was correct
for the state it measured (before round 4's own findings were dispositioned); R26, R29 and R30 join the
set today, and writing six would have reproduced the exact defect R28 names. **Re-derived from the
ledger's own finding tables, not taken from the review text.** The ADR-034 warning is repeated in the
front matter so a reader who never opens this ledger still gets it.

#### Round-4 findings accepted as residuals — **direct owner ruling, 2026-08-01**

> ⚠️ **ADR-034 is NOT the justification for these three, and must not be cited as one.** ADR-034 accepts
> residual defects in a task's **own record**. These three sit in the **work product** — the report *is*
> this task's deliverable — which ADR-034 does not reach. **The justification is a direct owner ruling
> and nothing else**, made on 2026-08-01 via `AskUserQuestion` in the live `/fkit-sprint-ship-loop`
> driver session, **after the owner was explicitly warned of that distinction**. Recorded this way so
> ADR-034 does not quietly grow a scope it was never given. *(The reviewer re-read ADR-034 `:148-150`
> in round 4 and independently confirms this framing is right and that the ADR has not widened.)*
>
> **All three are real defects, correct as found, deliberately left standing — not findings that
> dissolved on inspection.** Recorded unsoftened, in the reviewer's own words where possible.

- **R26 — §4.2.1's Gap A / Gap B "reach" asymmetry omits the scope accident its own §4.3 names.** What:
  `/fkit-task-done`'s mover clause is written for a **sibling** task folder's `review.md`; **every
  measured header sits in the folder's own `review.md` pointing at its own `brief.md`** — the one
  direction the clause was not written for. So the clause does not reach Gap B **by coverage** either,
  and *"the 4 the rule reaches and correctly declines to change"* reads as clause-coverage where only an
  **empirical** fact is established. Report text left as written · Why: **direct owner ruling**,
  2026-08-01 — **not ADR-034** · **Blast radius, traced by the reviewer and not disputed here: no count
  moves** (36 + 4 = 40 survives), §4.6 repairs all 40 identically, and §8.2's *"the movers gain no new
  duty"* conclusion holds under either reading, because the folder-ID schema removes the path entirely.
  What is wrong is the **characterization** of current mover behaviour as *"correct behaviour, not a
  miss"* rather than *"unspecified"* · Re-raise only if: some later text makes the mover clause's
  **coverage** of Gap B load-bearing, or the asymmetry is copied into follow-up 1's convention page.
  *(Codex graded it medium; the reviewer verified and downgraded to low on blast radius. Recorded at the
  reviewer's grade; the remedy is identical either way.)*

- **R29 — §8.2 attributes a clause to `0168`'s brief that the brief does not contain.** What: §8.2 says
  `0168`'s brief *"says: treat as text-only, do not re-point, do not unwrap, break no working link"* and
  then critiques *"'Text-only' … does not say the label must be replaced"* — **analysing wording it
  supplied itself.** `grep -niE 'text-only|text only'` over `0168`'s brief returns **nothing**; what the
  brief actually says is that the link **target** *"must not be re-pointed or unwrapped"*. Report text
  left as written · Why: **direct owner ruling**, 2026-08-01 — **not ADR-034** · **Stated plainly: the
  substantive point survives and the attribution does not.** The recommendation is right on the brief as
  actually written — it genuinely does not require the stale label to be replaced — so what fails is the
  quotation, which is exactly the class of defect this report exists to rule on · Re-raise only if:
  `0168`'s brief is edited such that the recommendation itself no longer holds, or the paraphrase is
  copied into a follow-up brief as a quotation.

- **R30 — §7.2's red-set figures are measured over a scanned set that contains this task's own growing
  ledger, and have already drifted.** What: `ai-agents/tasks/*/*/*.md` includes `0160`'s own
  `review.md`, so every figure §7.2 publishes is stale on arrival. **Confirmed by my own round-5
  re-measurement, not inherited:** the *elided* reading has moved **39 / 20 (round 3) → 40 / 21 (round
  4, reviewer) → 42 / 21 (round 5, mine)**, the three new hits all being this ledger's own text quoting
  the elided specimen; the shorthand reading moved from **127 / 25** to **130–135 / 25**. **The literal
  figures did not move: 38 / 19 total, 27 / 11 exempt, 11 / 8 residual on every run.** Report figures
  left as written · Why: **direct owner ruling**, 2026-08-01 — **not ADR-034** · Re-raise only if: an
  elided or shorthand figure from §7.2 is quoted as current in a follow-up brief or a test's expected
  value · **The reviewer's flagged concern was applied rather than accepted** — see directly below.

#### R30's flagged concern — **applied, per the owner's instruction**

The grandfather ruling's cost estimate is going into follow-up 8's brief, so it now carries an
**explicit as-of date**. §7.2's ruling box states the residual as **11 citations across 8 files, as of
2026-08-01** — 6 `backlog/` briefs, 3 under `ai-agents/sprints/`, 2 non-`review.md` files under
`done/` — plus a sentence naming the self-reference and instructing whoever files follow-up 8 to
**re-measure at filing time rather than quoting the number**. §8's follow-up 8 row repeats both. **The
figure is my own round-5 re-derivation, not the round-3 one carried forward:** §7.2's own condition, run
over §7.2's own *"defensible core"* scanned set (`ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md`),
fenced blocks and blockquote lines skipped, literal full-path reading — **38 / 19 total · 27 / 11 inside
closed `done/*/review.md` · 11 / 8 residual**, matching the published figures exactly. That is a
**fourth** independent run of the literal reading (round-3 author · round-4 reviewer · round-4 Codex ·
round-5 me), and §7.2 now says so.

#### The two below-threshold notes — what I did with each

**Both were real; neither was dropped.**

- ***"the phrase occurs exactly once in the report, here"* (§4.2.1's R23 box) — corrected.** Verified
  myself: case-**sensitively** `more dangerous` occurs once; case-**insensitively** twice, the second
  being *"More dangerous"* inside the box itself, quoting the claim in order to flag it. That is a
  use/mention artifact and the substantive point is untouched — but the sentence as printed is false
  against the obvious `grep`, and this report's entire subject is claims that read as durable and are
  not. Rewritten to *"asserted exactly once … its only other appearance is inside this box, quoting it
  in order to flag it"*, with the correction marked in place. **This does not re-open R23** — the
  owner-ruled sentence (*"the more dangerous of the two"*) is untouched; what changed is my own
  annotation about it.
- ***"It is also the more contagious"* (§4.2.1) — flagged in place, sentence left standing.** The
  reviewer is right that this is a **second unestablished comparative**, and right that R23 already
  covers it. The existing disclaimer only disowned the **causal** claim about how the corpus arose, not
  the **comparison**. Rather than widen an owner-ruled residual or rewrite a sentence the ruling left
  standing, I added one clause at the sentence recording that the comparative rests on the same
  unmeasured footing as the danger ranking and that nothing downstream cites it. **Treatment is
  deliberately identical to R23's: flag where the claim is made, change no claim.**

#### One consistency change no finding asked for — disclosed rather than slipped in

§8's follow-up 8 row previously offered the reading as an open choice (*"or **127** / 25 files, if the
shorthand reading is chosen"*). The owner's literal ruling settles it, so leaving that row as written
would have contradicted the new §7.2 box the same round it was written. The row now states **both**
rulings a coder must carry — the closed-ledger exemption **and** the literal reading, including the
knowingly-missed lead specimen — and the shorthand extension is named there as a separate decision to
file. **Flagged because it is a change beyond the two ruled remedies**; it changes no count, no ruling
and no follow-up's existence. Front matter's *"change surface"* bullet was likewise brought into line
with §12's longstanding wording (report + this ledger's `## Coder response`), which it contradicted.

#### Round-5 verification

- **`npm test` — 523 tests, 17 suites, 523 pass, 0 fail, 0 skipped, 33.3 s, exit 0**, and
  `test/prove-red.sh`'s hard gate **PASSED** (real + unmutated copy green; each of the 7 mutations reds
  its named assertion). **Re-run in round 5, not carried forward.** The round-5 delta is
  documentation-only and touches no source, so no regression was possible — **run anyway rather than
  asserted.**
- **Change surface — exactly two files**, both already untracked before this round: the report
  (1402 → 1472 lines) and this ledger (1115 → 1268). **`## Reviewer findings` and `## Accepted residuals` were not
  touched**; every word above sits inside `## Coder response`.
- The four `M` entries in `git status --porcelain` (`sprint-2.md`, `0160`/`0168`/`0170` briefs) are
  **other workers' uncommitted edits from this run** and were **not** reverted, staged or cleaned.
- **Rank sequence byte-identical** — `grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md` diffed
  between `HEAD` and the working tree: **148 ranks, zero diff.**
- **Nothing written to `ai-agents/wiki-vault/`**, nothing under `claude/`, **no `brief.md` edited, no
  follow-up brief written, no task folder moved, no mover skill invoked, nothing committed or pushed.**
- **No secrets in either artifact.**

## Accepted residuals (shared, do-not-re-litigate)

- **Case 3 remedy** — What: folder-ID ledger schema going forward **plus** a one-time normalization of
  all 40 dead headers · Why (structural): owner ruling, 2026-08-01, via `AskUserQuestion` in the live
  `/fkit-sprint-ship-loop` driver session, on this report's recommendation; alternatives (accept the
  dead paths; ADR-034 residual treatment) were put and rejected · Re-raise only if: a **new** premise
  defect is shown that the owner did not have in front of them. R2/R3/R4/R9 are argument-quality
  findings against §4.4-§4.5 and do **not** re-open the remedy.
- **Case 5 disposition** — What: ruled **out of class** and handed back as its own task · Why
  (structural): owner ruling, 2026-08-01, reversing their own 2026-07-30 routing; the recording
  producer's on-record dissent agreed on class grounds · Re-raise only if: never, on class grounds.
- **`0168` is kept** — What: retained as the pre-filed execution arm of the case-3 ruling · Why
  (structural): owner ruling, 2026-08-01 · Re-raise only if: the case-3 remedy itself changes.
- **No `worklog.md` for this task** — What: none written · Why (structural): driver's call; ADR-020
  scopes plan/worklog to the coder, and `0160` is an architect investigation · Re-raise only if: the
  task is re-scoped to an implementation.
- **`0160`'s brief defects are the producer's, not this report's** — What: verification step 8's wrong
  command (`node --test test/`), step 1 self-contradicting steps 9-10, and `## Notes` *"Blocks:
  nothing"* · Why (structural): briefs are the producer's artifact; the report correctly recorded them
  in §9 rather than editing them · Re-raise only if: a producer declines to correct them after relay.

### Round-1 findings accepted as residuals — **direct owner ruling, 2026-08-01**

> ⚠️ **ADR-034 is NOT the justification for these three, and must not be cited as one.** ADR-034 accepts
> residual defects in a task's **own record**. These three sit in the **work product** — the report *is*
> this task's deliverable — which ADR-034 does not reach. **The justification is a direct owner ruling
> and nothing else**, made on 2026-08-01 via `AskUserQuestion` in the live `/fkit-sprint-ship-loop`
> driver session, **after the owner was explicitly warned of that distinction**. Recorded this way so
> ADR-034 does not quietly grow a scope it was never given. The stated basis of the ruling: the case-3
> remedy stands on the schema change, which **no** finding disputes; only the quality of the argument
> for it is at issue.
>
> **All three are real defects, correct as found, deliberately left standing — not findings that
> dissolved on inspection.** The report records each in place, in a warning box, attributed.

- **R2 — §4.4 concedes the location-claim counter, then denies it by assertion.** What: §4.4:471-475
  rebuts the strongest counter-argument with *"there is no claim to destroy because there was no
  independent claim"*, which Fact A cannot support — Fact A's method (header slug vs containing folder
  name) establishes **task identity**, not the absence of a claim about **where the brief sat on review
  day**. Recorded in place at report §4.4:477-486 · Why (structural): **direct owner ruling**,
  2026-08-01, as above — **not ADR-034** · Re-raise only if: a **new** premise defect is shown that the
  owner did not have in front of them. **Round-2 finding R24 is not a re-raise** — it records that
  *newly written* §4.2.1 and §4.4.1(d) text re-deploys the conceded premise without §4.4's disclosure,
  and it asks for a disclosure, not for R2 to be repaired.
- **R3 — §4.4 calls a dead path "silent" when §3.4's own taxonomy makes it loud.** What: §3.4 defines
  silent as landing *"on a **neighbouring board row of identical shape** … and still reads
  authoritative"* and says outright *"A fast-drift failure is loud."* A path resolving to **nothing** is
  the loud category; §4.4:474-475 invokes the silent one for it. Recorded in place at report
  §4.4:477-486 · Why (structural): **direct owner ruling**, 2026-08-01, as above — **not ADR-034** ·
  Re-raise only if: never, on the argument. **Both round-2 reviewers confirmed §4.2.1 does not repeat
  the error** — its loud/silent usage is the corrected one.
- **R9 — ADR-034 engaged selectively in §4.5.** What: the re-raise condition that most directly applies
  — `adr-034-…:151-153`, residuals observed to *"mislead a later reader or a later round"* — is omitted,
  and an individual-vs-corpus distinction ADR-034 does not itself state is put in its place. **The
  omission cut against the report**: engaging `:151-153` would have supplied ADR-034's own sanctioned
  route to the same ruling. Recorded in place at report §4.5:589-597 · Why (structural): **direct owner
  ruling**, 2026-08-01, as above — **not ADR-034** (and note the doubled irony: ADR-034 is both the
  subject of this finding and, correctly, *not* the authority accepting it) · Re-raise only if: a
  producer or a later round acts on §4.5's individual-vs-corpus distinction as though it were ADR-034's
  own text.

### Round-2 findings accepted as residuals — **direct owner ruling, 2026-08-01**

> ⚠️ **ADR-034 is NOT the justification for these three, and must not be cited as one** — same framing
> as the round-1 box above, for the same reason: the report is this task's **work product**, not its own
> record. **The justification is a direct owner ruling and nothing else**, made on 2026-08-01 via
> `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session, **after the owner was explicitly
> warned of that distinction.** All three are real defects, correct as found, deliberately left standing.
>
> *Indexed here in round 6 so the shared do-not-re-litigate list is complete. The full text of each —
> What / Why / Re-raise-only-if — is recorded under `## Coder response` and is not restated here, so the
> two records cannot drift apart.*

- **R23 — *"the more dangerous of the two"* is not established.** §4.2.1 ranks Gap B the more dangerous
  on **per-instance detectability only**; frequency, consequence and aggregate exposure are never
  weighed, and the populations run **36 : 4** the other way. Recorded in place at report §4.2.1 in a
  warning box beneath the ruling sentence (:420-432) · **Load-bearing check run independently in round 4
  and clean** — every downstream consumer derives from the label-versus-target mechanism, not one cites
  the ranking; delete the ranking and nothing moves · Re-raise only if: some later text is found to
  **depend** on the ranking, or the ranking is copied into the convention page. **The second
  unestablished comparative (*"also the more contagious"*, :460) is covered by this residual, was flagged
  in place in round 5, and is not a separate item.**
- **R24 — new text re-deploys the conceded Fact-A premise to dismiss R2, without §4.4's disclosure.**
  §4.2.1 and §4.4.1(d) objection 4 lean on the premise §4.4's own warning box concedes is a non-sequitur,
  and neither carries the disclosure §4.4 carries for it. Report text left as written · **This does not
  reopen R2** · Re-raise only if: a **third** passage is written that leans on the same premise. **The
  conclusion is right on an independent ground the section already states** — a header label is a
  pointer, not a quotation; the defect is the reasoning leaned on, not the verdict.
- **R25 — §4.1 still prints the classifier order the report blames for the false Fact C.** §4.1's method
  reads *"backtick span → markdown href → bare text"* while §4.2 states the corrected classifier tests
  for `[…](…)` **first**. §4.1 left as written · **No count is affected — verified independently:** for
  all 4 hrefs the label sits inside backticks inside the link text, so both precedences extract the same
  dead path · Re-raise only if: someone reproduces the measurement from §4.1 and publishes a differing
  figure.

### Round-4 findings accepted as residuals — **direct owner ruling, 2026-08-01**

> ⚠️ **ADR-034 is NOT the justification for these three, and must not be cited as one** — same framing
> and same reason as the two boxes above. **The justification is a direct owner ruling and nothing
> else**, made on 2026-08-01 via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session,
> **after the owner was explicitly warned of that distinction.** **All three are real defects, correct as
> found, deliberately left standing — not findings that dissolved on inspection.** Re-read
> `adr-034-…:148-153` in rounds 4 and 6: the ADR's own text supports this framing and **has not
> widened**.
>
> *Indexed here in round 6. The full text of each is recorded under `## Coder response` :1054-1103 and is
> not restated here, so the two records cannot drift apart.*

- **R26 — low — §4.2.1's Gap A / Gap B "reach" asymmetry omits the scope accident its own §4.3 names.**
  `/fkit-task-done`'s mover clause is written for a **sibling** folder's `review.md`; every measured
  header sits in the folder's **own** `review.md` pointing at its **own** brief. Report text left as
  written · **Blast radius traced: no count moves** (36 + 4 = 40 survives), §4.6 repairs all 40
  identically, §8.2's *"the movers gain no new duty"* holds either way. What is wrong is the
  **characterization** of current mover behaviour as *"correct behaviour, not a miss"* rather than
  *"unspecified"* · Re-raise only if: later text makes the clause's **coverage** of Gap B load-bearing,
  or the asymmetry is copied into follow-up 1's convention page.
- **R29 — low — §8.2 attributes a clause to `0168`'s brief that the brief does not contain.** The report
  says the brief *"says: treat as text-only…"* and then critiques *"'Text-only'…"* — analysing wording it
  supplied itself; `grep -niE 'text-only|text only'` over `0168`'s brief returns **nothing**. Report text
  left as written · **The substantive point survives and the attribution does not** — the brief as
  actually written genuinely does not require the stale label to be replaced · Re-raise only if: `0168`'s
  brief is edited such that the recommendation no longer holds, or the paraphrase is copied into a
  follow-up brief **as a quotation**. **⚠️ The same paraphrase propagated into this ledger's own
  `## Accepted residuals` (the author's-two-residuals entry below, round-2 reviewer text). That instance
  is ledger-internal and is not repaired.**
- **R30 — low — §7.2's red-set figures are measured over a scanned set containing this task's own growing
  ledger, and have already drifted.** Elided reading **39 / 20 → 40 / 21 → 42 / 21** across rounds 3, 4
  and 6; shorthand **127 / 25 → 130–135 / 25**. Report figures left as written · **The literal figures
  did not move — 38 / 19 total, 27 / 11 exempt, 11 / 8 residual on all five independent runs**, which is
  what the owner's literal-form ruling rests on · Re-raise only if: an elided or shorthand figure from
  §7.2 is quoted as current in a follow-up brief or a test's expected value · **The flagged concern was
  applied, not accepted** — §7.2 :1135 and §8 :1175 now carry **📅 as of 2026-08-01**, the self-reference,
  and an instruction to re-measure at filing time.

> **Nine accepted residuals in total — R2, R3, R9 · R23, R24, R25 · R26, R29, R30 — every one on a
> direct owner ruling, none on ADR-034.** Re-derived from this ledger's finding tables in round 6:
> 30 findings = 21 applied + 9 residual. **Nothing else in this section is a finding disposition;** the
> entries above the round-1 box are structural, and the two below are the author's own on-record items.

### Round-1 dispositions recorded for completeness — applied, not residual

Recorded here so a later round does not re-open them. All owner rulings, 2026-08-01, live driver session.

- **R4** — rewrite required and done (new §4.4.1). **R1** corrected. **R7** → a fourth open question,
  `⏳ Awaits the owner`, no recommendation. **R8** → policy guard named; eight follow-ups.
  **R10–R15** verified and applied.
- **R5 and R6 — ratified as applied.** The driver failed to relay them in round 1 and the author
  repaired both on their own judgement, flagging that they carried no ruling. The owner reviewed and
  **ratified after the fact**, including the author's choice to route R5's consequence to the
  **convention page** rather than into follow-up 3 / `0168` item 2. Re-raise only if: the convention
  page's contents are re-scoped. **Round-2 findings R20 and R22 attack the *replacement* wording, not
  the repaired old wording** — they are new defects in new text, not a re-raise of R5 or R6.
- **§4.4.1's append-not-rewrite recommendation for the 16 body-level paths is kept** as a recommendation
  into §4.6's open scoping question for follow-ups 4 and 7 — **not** a change to the ruled remedy.
- **Open question 3** — the owner ranks the case-5 successor explicitly at filing. **Open question 5** —
  the convention page is dual-homed. **Open question 6** — the dead-path guard is named, filed **low**,
  sequenced after follow-ups 3 and 4.

### The author's two on-record residuals — reviewer's judgement

The author put two items on record and asked whether they are residuals or live findings. **Judged:**

- **The §4.2.1 writer rule living in the report rather than the convention page — ACCEPTED RESIDUAL, and
  the author's call was right.** What: §4.2.1:370-375 states a general writer rule whose natural home is
  `conventions/durable-citation-anchors.md` · Why (structural): **that page does not exist** — it is
  unfiled follow-up 1 — and it sat outside this round's two-file change surface; the owner had already
  ruled R5's routing settled. Writing it would have been the scope creep, not the omission ·
  Re-raise only if: never, on this point. **⚠️ But the routing half is a live finding, R20** — §8:925's
  contents list for follow-up 1 does not name this rule, so the flag reaches the producer through **this
  ledger only**, which is not what a producer reads to file a follow-up. That is one line in the report,
  and per R20 it must carry the **narrowed** wording, not the `never`.
- **Not editing `0168`'s brief over the "text-only" gap — ACCEPTED RESIDUAL, and the author's call was
  right.** What: `0168`'s brief says *treat as text-only* but never says the label must be **replaced**,
  which is the reading under which all four defects survive a "successful" sweep · Why (structural):
  briefs are the **producer's** artifact; the author both named the gap precisely and supplied the exact
  normalized form — `Task: 0001 — [brief](./brief.md)` — in §8.2:998-1007, the relay section `0168`
  reads · Re-raise only if: a producer declines to make the addition after relay. **Producer action
  attached:** add *"the label must be replaced, not prepended to"* to `0168`'s treat-as-text-only clause.
