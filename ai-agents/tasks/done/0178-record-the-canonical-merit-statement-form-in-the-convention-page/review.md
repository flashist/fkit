# Review — 0178

Task: `ai-agents/tasks/done/0178-record-the-canonical-merit-statement-form-in-the-convention-page/brief.md`
File(s) under review:
- `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` (+58/−0)
- `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` (+58/−0, byte-identical)
- `claude/structure-manifest.tsv` (**1 row added** after R1's fix — 3 at round 1, two of which were
  0171's and are gone; `git diff --numstat` = `1  0`)

## ✅ Approved — all 5 findings discharged (3 fixed, 2 accepted residuals routed to 0179); 0178 is green as an isolated commit (730/730 + `prove-red.sh` hard gate PASSED); the live tree's 2 reds are task 0171's, proved not attributed.

Status: **resolved — round 2 (disposition pass) complete.** Ready to close.

Reviewers run (Round 1): **fkit-reviewer (Claude)** + **Codex adversarial pass** (`codex-cli 0.145.0`,
`codex exec --sandbox read-only`, exit 0). **Both reviewers ran — coverage is complete, not partial.**

Round 2 (2026-08-21) is a **disposition pass by owner ruling** (*"Disposition-only pass"*): no new Codex
pass was run and no answered finding was re-opened. Round 2's job was to **verify the fixes**, record the
dispositions, and set this line. **Round 2 coverage is deliberately partial by design — that is the
ruling, not a degradation to hide.** No new findings were raised; none was warranted.

⚠️ **Machine coverage of this change is thin and that is a property of the change, not a finding.** The
only tests that touch it are `dual-home-parity.test.js` (byte equality) and `structure-manifest.test.js`
(a hash row). Neither reads a word of the new prose. The prose is the deliverable; nothing downstream
will catch an error in it.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `claude/structure-manifest.tsv:55,64` | Two of the three added rows hash **another task's uncommitted scaffold content** (`0171`: `conventions/README.md` → `03eaaac…`, untracked `durable-citation-anchors.md` → `2ef1f15…`). The generator's walk is `git history ∪ the CURRENT on-disk claude/scaffold/` (`bin/generate-structure-manifest.mjs:20-22`), so regenerating in a dirty tree baked them in. At any commit carrying this manifest but **not** `0171`'s scaffold content, `test/structure-manifest.test.js` assertion A (byte-equality against a regeneration) goes **red**. Verified by recomputing all three hashes with the generator's own `hashFor`. Raised by both reviewers. |
| R2 | 1 | high | `priority-is-rank-not-identity.md:106-109` | Item 4's **presence** condition — *"presence of an `**On merit:**` line"* — is materially **looser** than report §5.1, which it cites as its authority: §5.1 requires *"`**On merit:**` followed by either a relative statement naming a neighbour by folder ID, or the literal `as ranked`"*. Under item 4, the ~14 live briefs reading `- **On merit:** the **Backlog**, unranked, and that is honest…` **pass**; under §5.1 they **fail**. Item 4 is the spec task `0179` implements from, so the divergence produces the wrong guard. Item 4 also does not state the guard's scan domain (which files count as "a brief on a ranked board"), nor whether a declaration-shaped line inside a fenced example counts — this page prints two. Raised by both reviewers. |
| R3 | 1 | medium | `priority-is-rank-not-identity.md:40-45` | *"Two shapes, and only two"* is asserted as an exhaustive grammar but is an **example pair**. The live corpus, written under this ruling, already uses forms the two shapes do not cover: **9 briefs** write `immediately **below** \`NNNN\`` (the shape line names only *above*); the fenced example writes the ID **bare** (`0154`) while the rule two lines down quotes it **backticked** (`` `0154` ``) and **every** live brief — including `0178`'s own, `brief.md:121` — backticks it; **4 briefs** write `as ranked — <trailing prose>` against a bare `as ranked` example. Two competent guard authors will write different regexes. The text is verbatim-faithful to report §3.1, so the ambiguity is **inherited, not introduced** — but the brief (`brief.md:78`) sets the deliverable as *"the grammar"*, and this is not one. Claude-only; Codex marked lines 40-45 clean on faithfulness to §3.1 and did not test implementability. |
| R4 | 1 | low | `priority-is-rank-not-identity.md:47` | *"Every brief on a **ranked** board carries exactly one of them"* is present-tense and reads as description; as description it is **false** — 3 briefs carry a `P<n>` token inside a canonical merit line (`0259`, `0260`, `0261`: `` as ranked — `Sprint 5 P1/P2/P3` ``), and many carry neither shape. Normative wording (*"must carry"*) removes the reading. Low: no behavior depends on it and item 4 already carries the corpus-is-red caveat, 60 lines later. Raised by both reviewers (Codex rated it medium; severity here is mine, from the traced blast radius). |
| R5 | 1 | low | `priority-is-rank-not-identity.md:106-109` | Placement of the **"Specified, not built yet."** flag, **not** whether item 4 ships. Item 4 sits in a numbered list headed *"Where this is enforced"*; the flag lands mid-item, after two sentences of detail. A reader skimming the list heading reads item 4 as live enforcement — items 1-3 are. Loud is placement, not word count: the flag belongs at the head of the item. **This does not re-open the owner's 2026-08-21 ruling that item 4 ships with its flag** — that ruling is respected and not questioned. Claude-only. |

### Round 2 — dispositions (reviewer-owned)

Owner ruled live, 2026-08-21, verbatim option labels: **R1** *"Regenerate from a 0178-only tree"*; **R2 +
R3** *"Tighten R2, residual R3"*; **R4 + R5** *"Fix the wording"*; close posture *"Close it; record the red
as 0171's"*.

**Every fix was re-verified against the files by the reviewer this round — none was taken on the
responding worker's report.** A disposition pass that rubber-stamps an unverified fix is worse than no
pass.

| #  | Disposition | Reviewer verification (this round) | Outcome |
|----|-------------|-----------------------------------|---------|
| R1 | Regenerate from a 0178-only tree | `git diff --numstat -- claude/structure-manifest.tsv` = **`1  0`**; the single added row is `55b4a6d5…  ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`, and `shasum -a 256` of the on-disk page equals that hash in **both** homes. 0171's two rows (`03eaaac…`, `2ef1f15…`) are gone from the diff. Dual-home byte-parity re-checked directly: `diff` of the two copies is **empty**. 0171's two files still hash to `03eaaac…` / `2ef1f15…` — the exact values round 1 recorded, so they are **byte-unchanged across the round**, corroborated by this ledger's own round-1 text rather than by self-report. | ✅ **Discharged — fix verified** |
| R2a | Tighten to §5.1 | Item 4's presence condition read against report `2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md` **§5.1 part 1** side by side. §5.1: *"`**On merit:**` followed by either a relative statement naming a neighbour by folder ID, or the literal `as ranked`. A brief with neither is `brief-missing-merit` drift."* Page item 4 now states that condition, cites §5.1 **by name**, and keeps §5.4's two accepted limits. **Match confirmed.** Re-measured independently: **15** backlog briefs carry an `**On merit:**` line with neither a folder ID nor `as ranked` — the responding worker's 15, not round 1's ~14. The count correction stands; the finding was right in direction and near in count. | ✅ **Discharged — fix verified** |
| R2b | Residual → 0179 | Confirmed §5.1 is **silent** on scan domain and on fenced examples. Writing either onto the page would widen it past the ruled authority, which the R2/R3 ruling forbids. Splitting R2b out was **correct**, not evasion. | ⏳ **Accepted residual (AR-1 §4–5)** |
| R3 | Accepted residual → 0179; page NOT widened | Verified the page's *"Two shapes, and only two"* block is **byte-verbatim report §3.1** — unchanged by this round's edits. The page was not widened past §3.1. The grammar ambiguity is real and stays unresolved **on purpose**. | ⏳ **Accepted residual (AR-1 §1–3)** |
| R4 | Fix the wording | Line 47 now reads *"Every brief on a **ranked** board **must** carry exactly one of them. That is the rule, not a description of the corpus — much of the existing corpus does not yet meet it."* The false-as-description reading is gone and the corpus gap is stated **on the page**, not only 60 lines down in item 4. | ✅ **Discharged — fix verified** |
| R5 | Fix the wording | **"Specified, not built yet."** now sits at the **head** of item 4, immediately after the file names and before any detail. Wording byte-unchanged; only placement moved — which is what the finding asked for ("loud is placement, not word count"). The owner's ruling that item 4 ships **with** its flag is untouched. | ✅ **Discharged — fix verified** |

**No new findings.** The fixes were examined for defects introduced; none was found. Nothing fresh was
hunted for, by ruling.

### The live-tree red is 0171's — proved by measurement, not attribution

The responding worker proved this by reverting 0178's fix and observing A and F still red. **The reviewer
re-proved it by a sharper, non-destructive method** — regenerating the manifest to stdout
(`node bin/generate-structure-manifest.mjs --stdout`) and diffing, which touches no file:

- **Regeneration vs the live working-tree manifest: the delta is *exactly and only* 0171's two rows**
  (`03eaaac…  conventions/README.md`, `2ef1f15…  conventions/durable-citation-anchors.md`). 0178's row
  `55b4a6d5…` is present in both and contributes **nothing** to the delta. That is `structure-manifest.test.js`
  **A**'s entire failure, and it is 0171's.
- **Regeneration vs HEAD's manifest: the delta is those same two rows *plus* 0178's row.** So A is red in
  this tree whether 0178's fix is present or reverted — reverting makes it *worse*, not better. This both
  confirms the responding worker's revert experiment and explains it.
- `structure-spec.test.js` **F** names its own culprit in its assertion output:
  `['ai-agents/knowledge-base/conventions/durable-citation-anchors.md']` — 0171's **untracked** file,
  listed in `claude/structure-spec.md` (which 0171 also modified in this tree) and therefore absent from a
  manifest that correctly carries only 0178's row. No path from 0178 to this failure exists.
- Live tree measured this round: **`tests 730 / pass 728 / fail 2`**, the two being exactly A and F.
  `prove-red.sh`'s *"baseline is not green"* is a **refusal downstream of those two**, not a third failure.

**The constraint this implies, recorded so it is not rediscovered:** 0178 is **green as an isolated
commit** (730/730 + hard gate PASSED, on clean HEAD). **The live tree cannot go green until 0171 lands.**
⛔ The manifest must **not** be regenerated in this working tree to buy that green — a regeneration here
re-bakes 0171's two uncommitted rows and **restores the R1 defect verbatim**. The responding worker's
refusal to regenerate again was correct and is endorsed.

## Coder response

_(coder-owned — the reviewer does not write here. Round 1 answered by an **fkit-architect** worker: this
task's `## Owner` names `fkit-architect`, and the section keeps its ledger name regardless of role.)_

Every finding was re-verified against the files this turn before any edit. **All five stand — none was
found wrong.** Owner dispositions of 2026-08-21 were relayed by the driver and are applied verbatim.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **Valid — confirmed** | **Defect** | Manifest regenerated in an **isolated clone** of the repo at HEAD, with only 0178's two files applied, so 0171's in-flight scaffold content was never in the generator's walk. Result copied back. `git diff --numstat -- claude/structure-manifest.tsv` now reads **`1  0`**, the one added row being `55b4a6d5…  ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`. The two rows hashing 0171's content (`03eaaac…` README, `2ef1f15…` durable-citation-anchors) are **gone**. | ✅ **Fixed** |
| R2a | **Valid — confirmed** | **Defect** | Item 4's **presence** condition rewritten to report §5.1's own two-part condition: `**On merit:**` followed by *either* a relative statement naming a neighbour by folder ID *or* the literal `as ranked`, and a brief with neither is drift. §5.1 is now cited **by name in the item** so the authority is explicit rather than implied. Re-measured today: **15** backlog briefs pass the old loose condition and fail §5.1 — the reviewer's "~14" was right in direction and very nearly in count. | ✅ **Fixed** |
| R2b | **Valid — confirmed** | **Frontier** | The rest of R2 — item 4 states no **scan domain** ("which files count as a brief on a ranked board") and does not say whether a declaration-shaped line **inside a fenced example** counts (this page prints two). Both are real gaps, and **neither is ruled by §5.1**, which is silent on them. Resolving them on the page would widen it past the ruled authority, which the owner's R2/R3 disposition forbids. **Recorded as an accepted residual for `0179`** — see below. | ⏳ **Residual → 0179** |
| R3 | **Valid — confirmed** | **Frontier** | ⛔ **Not acted on, by owner ruling.** Re-verified the three ambiguities: `below` vs `above`, bare `0154` in the fence vs backticked `` `0154` `` in the rule, and `as ranked — <trailing prose>`. The page's text is verbatim-faithful to report §3.1, so tightening it here would contradict a **ruled decision**. **Recorded as an accepted residual for `0179`** — see below. | ⏳ **Residual → 0179** |
| R4 | **Valid — confirmed** | **Defect** | Independently re-measured: `0259`, `0260`, `0261` each carry a `P<n>` token inside a canonical `**On merit:**` line (`` as ranked — `Sprint 5 P1/P2/P3` ``) — exactly the three the reviewer named, so the sentence was false **as description**. Line 47 restated as **the rule**: *"Every brief on a **ranked** board **must** carry exactly one of them. That is the rule, not a description of the corpus — much of the existing corpus does not yet meet it."* The gap is now stated on the page rather than only in item 4's caveat 60 lines down. | ✅ **Fixed** |
| R5 | **Valid — confirmed** | **Defect** | **"Specified, not built yet."** moved to the **head** of item 4, immediately after the file names and before any detail — a reader skimming the numbered list can no longer read item 4 as live enforcement. The flag's wording is **byte-unchanged**; only its position moved. The owner's 2026-08-21 ruling that item 4 ships **with** its flag is respected, not re-opened. | ✅ **Fixed** |

**Not touched, as ruled:** both `conventions/README.md` copies (OQ4 default), task `0180`, task `0171`,
`ai-agents/wiki-vault/`, every `## Status` field, and every task file's location. Nothing committed.

### R1 — the fix method, and the proof it did not damage 0171

0171's two files were hashed before the work started and again after it finished, and are
**byte-identical**: `README.md` = `03eaaac67c4d7de811cf153c1aea6a1e782941f8a87f70de4152ecca6c01e697`,
`durable-citation-anchors.md` = `2ef1f155556154230fd6b7cad10b81705185e66bb0eb91a8360c4466199c7933`.
Neither was opened for writing, moved, stashed, reverted or deleted at any point. The regeneration ran in
a **`git clone` of this repo into a scratch directory outside the checkout** — the clone carries only
committed content, so 0171's uncommitted README edit and its untracked file were **physically absent**
from the generator's `history ∪ on-disk scaffold` walk. Only `claude/structure-manifest.tsv` came back.

⚠️ **`npm test` is RED in the live working tree, and that red is 0171's, not 0178's.** Read this before
reading the manifest row as broken:

- **In an isolated tree carrying 0178's change alone on a clean HEAD: 730/730 unit tests pass, and
  `prove-red.sh` reports `✓ hard gate PASSED`.** That is the state of a commit carrying 0178 alone, and
  it is fully green.
- **In the live tree: 728/730**, failing `structure-manifest.test.js` **A** and `structure-spec.test.js`
  **F**. Assertion F names the culprit in its own output — `ai-agents/knowledge-base/conventions/durable-citation-anchors.md`,
  0171's untracked file, listed in `claude/structure-spec.md` (**also modified by 0171 in this working
  tree**) but absent from a manifest that correctly contains only 0178's row. `prove-red.sh` then fails
  with *"baseline is not green"* — a refusal to run its gate, downstream of those two reds, not an
  independent failure.
- **Proved, not assumed:** with 0178's manifest fix **fully reverted to HEAD**, A and F are **still red**
  in this tree. They pre-exist this task's change and are cleared by 0171 regenerating with its own
  content committed — not by 0178.
- ⛔ **These two reds must NOT be cured by regenerating again here.** A green bought that way is the R1
  defect restored, which is precisely what the reviewer warned of.

`dual-home-parity.test.js` is **9/9 green in the live tree** — both homes are byte-identical after the
edits.

**What the suite does and does not cover.** It proves **no regression** and that the manifest is
consistent for a 0178-only commit. It proves **nothing about the prose**, which is the whole deliverable:
no test reads a word of this page's body. R2a, R4 and R5 are text fixes verified by reading and by
targeted greps, not by any assertion.

## Accepted residuals (shared, do-not-re-litigate)

**AR-1 — the merit-statement grammar is an example pair, not a specification (from R3, plus R2b).**
Owner ruling, 2026-08-21 (*"Tighten R2, residual R3"*): the page states report §3.1's two shapes
**verbatim and is not widened past them**, because §3.1 is a ruled decision. The known under-specification
is therefore **accepted on this page** and inherited by **task `0179`**, which resolves it when it builds
the guard. The open points, recorded so `0179` does not have to rediscover them:

1. `immediately below \`NNNN\`` — the shape line names only *above*. **Re-measured today: 10 briefs**,
   not the 9 the reviewer counted: `0179 0180 0187 0264 0265 0266 0267 0268 0269 0314`. One of them
   reads `below \`0313\` in importance but **above it in readiness**` — a hybrid neither shape covers,
   and the strongest single argument that this is a real grammar gap. The count difference is not a
   correction to the finding, which stands.
2. Folder ID written **bare** (`0154`) in the fenced example vs **backticked** (`` `0154` ``) in the rule
   two lines below — every live brief backticks it, including `0178`'s own.
3. `as ranked — <trailing prose>` — **4** live briefs; the example shows a bare `as ranked`.
4. **Scan domain** (from R2b): item 4 does not define which files count as *"a brief on a ranked board"*.
5. **Fenced examples** (from R2b): item 4 does not say whether a declaration-shaped line inside a fenced
   code block counts — this page itself prints two, so a naive guard would flag the convention page.

⛔ **Do not re-raise any of the five against this page.** They are `0179`'s to settle, in the guard.

**Reviewer countersign on AR-1 (round 2).** Verified independently and **accepted**. The ten `below`
briefs are exactly those named — `0179 0180 0187 0314` on the Backlog board and `0264 0265 0266 0267
0268 0269` in `ai-agents/tasks/done/`. **Provenance correction, recorded so `0179` is not misled:** six
of the ten are **closed** briefs, not live backlog ones — which narrows the "live corpus" framing but
does **not** weaken the gap, because the strongest specimen is live: `0314`'s
*"below `0313` in importance but **above it in readiness**"* — a hybrid **neither canonical shape
covers**. Confirmed in
`ai-agents/tasks/backlog/0314-fix-the-deletion-filter-blind-spot-in-fkit-record-decision/brief.md:168`.
The count of 10 stands.

**AR-2 — machine coverage of this change is thin, by nature.** Only `dual-home-parity.test.js` (byte
equality) and `structure-manifest.test.js` (a hash row) touch it; neither reads the prose. Stated by the
reviewer in this ledger's header as a property of the change, not a finding. Not re-raisable as a defect.
**The prose is the entire deliverable and nothing downstream will catch an error in it** — R2a, R4 and R5
are verified by reading and targeted greps, by both parties, and by no assertion. Carried knowingly.

**AR-3 — a `fkit-wiki` ingest of the updated convention page is owed, and is not part of this task.**
`ai-agents/wiki-vault/` carries **no** modification in this working tree, so today's edits to
`priority-is-rank-not-identity.md` are certainly not ingested. Only the `fkit-wiki` role may write the
vault (ADR-005), so neither the responding worker nor the reviewer could discharge it. **Not a defect in
0178** — route it as its own wiki task.

**AR-4 — dropping "Specified, not built yet." is `0180`'s inherited duty.** Item 4 ships flagged, by
owner ruling. The flag becomes **false** the moment the `brief-missing-merit` guard lands, and the task
that lands it is `ai-agents/tasks/backlog/0180-build-the-brief-missing-merit-guard/`. Checked this round:
**`0180`'s brief does not mention the flag**, so the duty is recorded **here** rather than assumed.
`0179` (*require a merit statement on every ranked-board brief*) owns AR-1's grammar; `0180` owns the
build and therefore owns removing the flag. Not re-raisable against this page.

**AR-5 — the live tree stays red until `0171` lands, and 0178 must not buy a green.** See *"The live-tree
red is 0171's"* above for the measurement. 0178 is green as an isolated commit; the two live reds are
0171's and clear when 0171 commits its own scaffold content and regenerates. ⛔ Regenerating the manifest
in this tree to force a green **restores the R1 defect** and is forbidden. Not a 0178 defect, not
re-raisable.

## Re-litigates settled decisions (suppressed) — Round 1

**Empty, and checked rather than skipped.** Neither reviewer raised any of the five owner rulings of
2026-08-21 (the page's home; item 4 shipping at all; leaving both `conventions/README.md` copies alone;
leaving `0180` alone; citing ADR-035 and the report bare rather than linked), nor either of ADR-035's
`Do not re-raise` options (report §3.5 "make insertions legal", §3.2 "formalize the owner re-rank act").
Both reviewers were primed with all seven; nothing had to be suppressed on the output side.

## Verified clean (so an absent finding is distinguishable from an unexamined one)

- Both copies byte-identical (`diff` empty); the `dependency-declaration-form.md` link resolves in
  **both** trees, and the scaffold copy carries the `- **Depends on:**` / `- **Blocks:**` forms the new
  text routes to (`claude/scaffold/…/dependency-declaration-form.md:11-12`) — the page's own linking test
  is met.
- Every citation checks out: ADR-035's title is quoted exactly; report §3.1 exists and rules this form
  in by name; *"six other candidates"* = §3.2-§3.7, seven total; §5.4 carries exactly the two accepted
  limits the page attributes to it; the two shapes match §3.1 and ADR-035 verbatim.
- Item 4's drift-kind family is real: `brief-missing-status`, `brief-missing-owner`, `brief-missing-id`
  all exist in `claude/skills/fkit-status/dashboard.sh:894-983` and are asserted in
  `test/dashboard-contract.test.js`.
- The three-carriers table is verbatim report §3.7, and **survives a table-only reader**: the merit row
  reads `**no — advisory**` in the table itself. (Answering the driver's question 2: yes, it survives.)
- Manifest row for this page is correct and in-scope; the table stayed append-only. **Round-2 correction
  to round 1's own text:** the in-scope row is `55b4a6d5…`, not the `8f9ad2a…` round 1 wrote — round 1
  read the pre-regeneration manifest. The row is verified against `shasum -a 256` of the on-disk page in
  both homes.

## Convergence call — round 2

**Converged. Close it.** Called proactively, not on request.

- All five round-1 findings are discharged: **three fixed and verified**, **two accepted residuals** with
  a named owner (`0179`) and a written hand-off, per the owner's ruling.
- **Nothing in round 2 re-litigated a settled decision**, and no new finding was warranted. The one
  numeric disagreement between the parties (9 vs 10 `below` briefs; ~14 vs 15 loose-condition briefs) was
  the responding worker **re-measuring rather than inheriting** the reviewer's figures — the correct
  behavior, and both corrections favor the finding.
- **A further review round would produce no new information.** The remaining unknowns are all in AR-1,
  and they are `0179`'s to settle in the guard — not this page's, by a ruled decision. Another pass here
  could only re-raise them, which is the loop this ledger exists to stop.
- **The one thing a closer must not misread:** the live tree is 728/730. That red is `0171`'s (AR-5,
  proved above), and 0178 is green as an isolated commit. **Do not hold 0178 open waiting for a green
  live tree, and do not regenerate the manifest to manufacture one.**
