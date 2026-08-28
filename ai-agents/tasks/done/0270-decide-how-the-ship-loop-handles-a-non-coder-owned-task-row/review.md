# Review — 0270

Task: 0270 — [brief](./brief.md)
File(s) under review: `ai-agents/knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md` (round 1: 430 lines; round 2: 521 lines; round 3: 561 lines; **round 4: 589 lines**, status accepted); `worklog.md` in this folder (boundary claims)
Status: closed-out
<!-- Round 4 re-opened this ledger with 4 `low`, non-blocking defects (R14–R17); all four were
     applied 2026-08-28 and the reviewer called convergence with an explicit "apply these, then
     close — do not open a Round 5". Closed on that ruling. Nothing structural regressed at any
     round. -->

**Rounds:** 1 (7 findings) · 2 (4) · 3 (2) · 4 (4) — **17 findings, all dispositioned, none
blocking, none outstanding.** Ledger closed after Round 4 per the reviewer's convergence call and the
owner's **"Act, then close (Recommended)"**.

> Round 1 — 2026-08-27. Reviewers run: fkit-reviewer own pass + Codex adversarial pass
> (`codex exec --sandbox read-only`, codex-cli 0.145.0) — **both ran; coverage full.**
> Line numbers below are claims about the revision read on 2026-08-27 (`durable-citation-anchors.md`
> row 2); each is paired with a quoted fragment.
> Verdict line: **⚠️ Changes requested — 7 defects (none blocking).** All seven are document defects
> (fact / wording / over-claim); the rulings ND1–ND7 are transcribed faithfully and are not re-raised.

> Round 2 — 2026-08-28. Reviewers run: fkit-reviewer own pass + Codex adversarial pass
> (`codex exec --sandbox read-only`) — **both ran; coverage full.** Scope: the seven Round-1 fixes
> re-verified against the rewritten ADR (521 lines) and `worklog.md`, plus a both-directions sweep of
> the changed regions for new over-claim and new internal contradiction.
> Verdict line: **⚠️ Changes requested — 4 defects (none blocking).**
> **All seven Round-1 fixes land.** R1's exception is genuinely bounded; R2's discharge holds without
> the dropped universal; R3's marking, R4, R5 and R7 verified correct. **R6's second leg is
> ADJUDICATED IN THE CODER'S FAVOUR — my Round-1 leg was WRONG** (see §Round 2 adjudication).
> The four new rows are novel defects **introduced by** the Round-1 fixes; none re-opens a ruled ND,
> the decision, or the owner's 2026-08-28 rulings. The in-place-edit call is owner-ruled and not raised.

> Round 3 — 2026-08-28. Reviewers run: fkit-reviewer own pass + Codex adversarial pass
> (`codex exec --sandbox read-only`) — **both ran; coverage full.** Scope: the four Round-2 fixes
> (R8–R11) plus the coder's one discretionary edit (decision-log entry 5), re-verified against the
> rewritten ADR (561 lines) and `worklog.md`, both directions over the changed regions only.
> Verdict line: **⚠️ Changes requested — 2 defects (none blocking).**
> **All four Round-2 fixes land in substance.** R9, R10 and R11 are verified correct and internally
> consistent; R8's headline qualification is the right move and its `0249`/`0211` framing in candidate
> 4 is correct. **The discretionary edit STANDS — do not reverse it** (§Round 3 adjudication).
> ⚠️ **Flagged before the rows, because it is the third consecutive round: both new findings are
> quantifier/enumeration errors inside the sentences the fixes themselves wrote or re-labelled.** R12
> is a fresh mis-location introduced by the R8 fix; R13 is a count the R10 fix carried through a
> widened label without re-measuring — and it was already wrong under the narrow label. Both are
> **under**-claims (they understate the ADR's own evidence and reach), so nothing downstream is
> licensed wrongly. The decision, ND1–ND7, the ADR-038 transcription and the owner's 2026-08-28
> rulings are untouched by both.

> Round 4 — 2026-08-28, **confirmation pass**. Reviewers run: fkit-reviewer own pass + Codex
> adversarial pass (`codex exec --sandbox read-only`, codex-cli 0.145.0) — **both ran; coverage
> full and genuinely model-diverse.** Scope: the two Round-3 fixes (R12, R13) only, re-verified
> against the rewritten ADR (589 lines), plus the no-regression sweep the driver asked for.
> Verdict line: **⚠️ Changes requested — 4 defects (none blocking).**
> **Both Round-3 fixes land in substance.** R12's three-gap block is mutually consistent and nothing
> in it contradicts `:233-235`'s base definition — gap (2) correctly re-files `0211` on a *measured*
> board and narrows the exclusion to the 123 counted open rows; the ⛔ *"the eight are not
> re-opened"* is present at `:256-257`. **R13's partition was re-derived first-hand from disk and
> reproduces exactly** — 123 `🔲 Backlog` rows, `72/30/13/6/2` on anchored `^## Owner$`, the same 13
> producer IDs, and every one lands in the bucket the ADR assigns (8 + 3 + 2 = 13). The *"Five of the
> 13"* claim is **numerically true** and *"every one is a reference, not an invocation"* is **true
> for all five**, including the two the ADR does not name.
> ⚠️ **Flagged before the rows, because it is now the fourth consecutive round: every new finding is
> again an enumeration or a quantifier inside text the fix itself wrote.** R14 is a Markdown
> lazy-continuation the R12 fix opened at the block's new last line; R15 is a literal contradiction
> the R12 fix created between `:225` and its own `:246`; R16 is the R13 fix re-creating, in its own
> new paragraph, the exact *"reads as a complete enumeration and is not one"* defect R13 was about;
> R17 is a provenance date the R12 fix left a day stale. **All four are `low`, all four are
> one-clause repairs, and all four are document-surface — none touches the decision, ND1–ND7, the
> ADR-038 transcription, or the owner's 2026-08-28 rulings.**
> ⚠️ **Codex's `X5` (*"`## Sprint: Backlog` is a nonexistent heading / contrary to the citation
> rule"*) was CHECKED AND REJECTED** — the ADR declares its own citation form at `:14-18` and that
> shorthand is used document-wide (`:311`, `:420`), predating this round. Codex's `X2` (*"All three
> cut in the decision's favour"*) was checked and **held below the bar**: pre-existing text, not
> introduced by either Round-3 fix, and its conclusion survives on its second clause.
> **No regression outside the changed regions** — see §Round 4 no-regression sweep.

## Reviewer findings
| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1 | medium | `adr-044…md:92-96`, `:141-145`, `:290-295` | *"ADR-038 explicitly does not fix these roles [Build / Plan] (the `:88-91` fragment)"* — ADR-038 `:88-91` names **Build and Verify** only. Plan **runs a skill** (`fkit-sprint-ship-loop/SKILL.md:122`, *"run `/fkit-plan-task`"*; coder-owned, `skills-for-role.sh:55`), so ADR-038 `:39` fixes Plan = coder. Decision 2 (ND3, ruled — not re-raised) therefore departs from ADR-038's rule for a skill-running step on non-coder rows, while C4 says the ADR *"reopens none of them"*. Say plainly that Decision 2 is an owner-ruled scoped exception to ADR-038's rule for the Plan step, and record where (see NEEDS-DECISION 1). Raised by both reviewers. |
| R2 | 1 | medium | `adr-044…md:84-88` | *"On every row measured (Sprints 3–6 and the Backlog board), `## Owner` is the deliverable's author"* — false on the ADR's own counter-example: `0171` is `## Owner: fkit-architect`, built by the coder (`:43-45`, `:375`; `0171/worklog.md:3`). The closeout discharge's stated premise fails; its conclusion survives on the other leg already written at `:192-196` (a derived role does not own the skill → hook denies → by-hand = the `0158`/`0143` misroute). Re-found the discharge on that leg; drop the universal claim. Raised by both reviewers. |
| R3 | 1 | medium | `adr-044…md:134-139`, `:178`, `:365-376` | Decision 1: a deliverable that names no skill *"is the coder's … whatever `## Owner` says"*. Under that rule `0178` (convention page, *"by hand"*, architect) and `0218` (brief repair, *"by hand"*, producer) would be **coder** Build rows; they were staffed by `## Owner` — the reading the ADR rejects — so they do not corroborate Decision 1 (§Corroborating practice: *"applied live … on every one of these rows"* over-claims), and *"consistent with all seven non-coder rows the loop has already shipped"* (`:178`) is wrong twice (0270 is `🔄 In progress`; with `0249` the measured set is eight). C6 must state the consequence plainly: by-hand producer/architect rows — brief repairs above all (on today's Backlog board `0318`, `0320`, `0321`, `0335` are `fkit-producer`) — become coder Build rows. Own pass. |
| R4 | 1 | low | `adr-044…md:65-72` | *"The brief's 'no third outcome' claim is corrected here"* — the brief's *"no third outcome"* sentence is about the **wiki** row (coder refuses or breaches ADR-005); the correction offered (the `NEEDS-DECISION` relay, `SKILL.md:249`, `:255-258`) answers the brief's **architect** sentence (*"no beat left to stop at"*). The paragraph labels the wrong claim; and *"the architect wall is not a wall"* is true only once ND5's carve-outs ship — today `fkit-architect.md:63-65` (*"don't run a half-blind version of it"*) bars it, and `0270` ran on a named Route ruling (ADR-037 §3), which C2 (i) itself acknowledges. State it as conditional on (i). Raised by both reviewers. |
| R5 | 1 | low | `adr-044…md:97-105`, `:273-276` | *"ADR-038 already contradicts its own Build fact, in practice"* over-reads `:88-91`. ADR-038 records `0241`'s Build running `/fkit-design-spec` at `:101-103` **in the same document**, so *"run no skill"* there means the **step prescribes none** (`SKILL.md:123`: *"implement the approved plan"*, no skill named) — not that Build workers never invoke one. Follow-on C2 (ii) stays warranted (ND6, ruled) but on a different ground: after this ADR, Build's role no longer *"come[s] from the loop's enumerated step table"* — it comes from Decision 1. Re-found the reason; do not describe ADR-038 as self-contradicting. Codex pass. |
| R6 | 1 | low | `adr-044…md:115`, `:118-120`, `:321-322` | Backlog split not reproducible. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` on 2026-08-27 → 123 `🔲 Backlog` rows: 72 coder / **30 architect / 13 producer / 6 wiki / 2 reviewer / 0 blank** (51 non-coder holds); no `brief-missing-owner` fact emitted; `grep -A1 '^## Owner'` over every `brief.md` (working tree **and** `HEAD`) → none blank. The ADR's *"12 producer, 1 blank `## Owner`"* and *"One Backlog brief returns an empty `## Owner` to a naive grep"* are wrong as measured facts. State the measured split; either name the brief and the command that read it blank, or drop the sentence (the blank-Owner rule in Decision 4 stands regardless). Raised by both reviewers. |
| R7 | 1 | low | `0270/worklog.md` §Verification (*"Boundary (brief verification steps 9–10)"*), §Deliberately not done (*"No … board … edit"*) | Boundary claim incomplete. `git diff -U0 -- ai-agents/sprints/sprint-6.md` shows the `0270` row flipped `🔲 Backlog` → `🔄 In progress` — the **driver's** step at plan approval, not the Build worker's, exactly like the `brief.md` flip the worklog *does* attribute to the driver. Brief step 9 as written (*"changes only under decisions/ plus this task's own folder"*) is unmeetable inside the loop, whose driver flips board status by design; the worklog should say so and name the board row as the driver's, rather than claim the boundary held as stated. Step 10 holds (`git diff --stat -- claude/skills/fkit-sprint-ship-loop/SKILL.md` empty). Codex pass. |

| R8 | 2 | medium | `adr-044…md:225-227` (*"every non-coder row the loop has driven — eight of them"*) | **A new false universal, introduced by the R3 fix.** R3 correctly replaced *"all seven shipped"* with the measured eight — but kept an unqualified *"every non-coder row the loop has driven"*, and that is false. Measured 2026-08-28: **Sprint 2 alone carries seven further non-coder rows the loop drove with a loop-spawned non-coder Build worker** — `0143`, `0158` (architect, *"spawned by `fkit-sprint-ship-loop`"*), `0159` (`## Owner: fkit-producer`, *"Build worker, spawned by `/fkit-sprint-ship-loop`"*), `0162` (*"Role: `fkit-architect`, spawned by `/fkit-sprint-ship-loop`"*), `0167`, `0195`, `0200` (*"spawned as the **Build** worker by `/fkit-sprint-ship-loop`"*) — plus `0142` (architect, loop-driven) and **`0211`** (Backlog, `## Owner: fkit-wiki`, worklog *"`fkit-wiki` (build worker, spawned by `/fkit-sprint-ship-loop`)"*). ⚠️ **`0211` is a second lawful wiki Build the ADR never counts**, while candidate 4 (`:283-286`) cites `0249` as if it were the only one. ⚠️ **The ADR cites `0167` (`:182`), `0143` and `0158` (`:97`, `:246`) by name elsewhere** — it excludes from *"every"* rows it discusses itself. The measurement window is Sprints 3–6 + the Backlog board; the sentence quantifies over all loop history. **Same over-claim class as R2/R3.** Either qualify the scope (*"every non-coder row on the boards measured here"*) or state the wider population. The decision, the rulings and the ND transcriptions are unaffected — a wider evidence base strengthens the case. Raised by Codex; verified and widened by the own pass. |
| R9 | 2 | low | `adr-044…md:450-456` (*"The **last four are not corroboration of the rule**"*) | **New internal contradiction, introduced by the R3 two-halves preamble.** The preamble consigns **four** table rows to non-corroboration and says *"the driver improvised a staffing for each"*, but its own table marks only **two**: `0178` and `0218` carry *"Not corroboration of the rule"* (`:464-465`); `0171`'s row (`:466`) is a coder Build of a skill-less convention page — **exactly Decision 1's skill-less clause**, by the ADR's own classification of `0178` as that class; and `0270`'s row (`:467`) reads *"Build via the architect's own skill (Decision 1)"* — the rule applied live, on a named Route ruling, not an improvisation. It also contradicts **C6** (`:391`, *"**Two** rows already shipped the other way"*) and **§Why this and not the others** (`:228`, *"on `0178` and `0218` the rule would have staffed Build differently"*), both of which name exactly two. The preamble **under**-claims the ADR's own evidence. Correct the count to two, or say per-row what each of the last four is. Raised by both reviewers. |
| R10 | 2 | low | `adr-044…md:387-388` (*"four `## Owner: fkit-producer` rows are brief repairs — `0318`, `0320`, `0321`, `0335`"*) | **Measured classification wrong on two of four, in the C6 bullet the R3 fix added.** Only `0318` (*"Append a dated correction note to `0238`'s closed brief"*) and `0320` (*"…in the closed briefs `0261` and `0263`"*) repair briefs. **`0321`** repairs *"the two stale `0171` claims on the live Backlog board"* — a **board** repair. **`0335`** states *"**No source code changes. This task edits records only.** It writes into `0327`'s folder"* — worklog/review **records**, and its own brief reports neither stale claim occurs in `0327/brief.md`. ✅ **The consequence itself stands** — all four are skill-less coordination-doc repairs, which Decision 1 (`:175`, *"coordination-doc repairs"*) sends to the coder; the owner-confirmed substance is untouched. Only the noun *"brief repairs"* is wrong; *"coordination-doc repairs"* is the accurate label and is already Decision 1's own word. Codex pass. |
| R11 | 2 | low | `0270/worklog.md:84` (§Deliberately not done, *"Two unverified items are stated as such in the ADR, not guessed"*) | **Stale claim left behind by the R6 fix.** The R6 fix **resolved** one of those two: `adr-044…md:404-407` now reads *"**Resolved 2026-08-28, in `0270`'s review round 1:** the blank-`## Owner` question"*, and the **same worklog's** decision-log entry 7 (`:163-170`) records the resolution and says *"Sprint 5's two rows remain unverified"*. So **one** item is stated as unverified in the ADR, not two. The audit record contradicts itself 80 lines apart. Drop the second item from the sentence (or point it at entry 7). No effect on the ADR or the decision. Own pass. |


| R12 | 3 | medium | `adr-044…md:238-240` (*"earlier sprints carry further non-coder rows the loop drove … `0211` among them"*), `:305-307` (*"`0211` sits outside this ADR's measured boards"*) | **`0211` is filed on the wrong board by the R8 fix — a new fact error and a new internal contradiction, in the very block the owner's *"Qualify the quantifier"* ruling directed.** Measured 2026-08-28: `0211`'s brief reads `## Sprint` → **`Backlog`** (`:6-7`), and it has a live row on **`ai-agents/sprints/backlog.md:121`** (`✅ Done (agent-closed — not owner-verified)`); that row's own text says the task *"STAYS on the Backlog board at rank `—`"* and *"does **not** join Sprint 2"*. So: **(a)** gap (2) places `0211` under *"The loop ran before Sprint 3, and those boards were not measured here"* — `0211` is not on a pre-Sprint-3 board, so **the only instance the ADR names for gap (2) does not support gap (2)**; **(b)** *"`0211` sits outside this ADR's measured boards"* contradicts the same ⚠️ block 70 lines above, which defines the evidence base as *"**Sprints 3–6 and the Backlog board** (§Context's table)"* (`:233-235`) — the Backlog board **is** measured (`:142`). What is true is narrower: `0211` sits outside the **123 `🔲 Backlog` rows** the ADR counted, because it is `✅ Done`. **(c)** Candidate 4 itself calls `0211` *"a Backlog row driven by the loop"* (`:298-300`) and proves the driving by quoting its worklog — so by the headline's own predicate (*"all eight non-coder rows **this ADR measured** the loop driving"*, `:225`) the ADR now measures a **ninth**. ⛔ **The repair is to re-file `0211` under the right heading and narrow *"measured boards"* to *"the 123 `🔲 Backlog` rows measured"* — NOT to re-measure Sprint 2 (owner-ruled out of scope) and NOT to re-open the eight, which is correct for Sprints 3/4/6.** Raised by both reviewers. |
| R13 | 3 | low | `adr-044…md:408-416` (*"four `## Owner: fkit-producer` rows are skill-less coordination-doc repairs (measured 2026-08-28)"*) | **The count survived the R10 label-widening unre-measured, and it was already wrong under the narrow label.** R10 correctly re-verified the **four named rows** and correctly widened *"brief repairs"* → *"skill-less coordination-doc repairs"*; it did not ask whether the wider label admits more. Re-measured first-hand 2026-08-28 — board reproduces exactly (123 `🔲 Backlog` rows, anchored `^## Owner$` → 72/30/13/6/2): of the **13** producer rows, at least four more meet the ADR's own class. ⚠️ **`0193` is a `brief` repair — the original narrow class — and was missed even before the widening**: *"Repair the stale citations in `0158`'s **closed brief**"*, deliverable *"Six dated corrections to one closed brief … two dated corrections to a second closed brief"*. Also `0149` (*"A **dated correction note** in `ai-agents/tasks/done/0118-…/brief.md`"*), `0183` (*"Two dated correction notes. **Documentation only.**"* — a sprint record + a closed brief), `0221` (*"A **documentation repair to one file**"* — `0194`'s brief). Two further candidates in the same class: `0340` (*"board/plan edits are the producer's; no code"*) and `0013` (worked examples on a convention page — the bullet's own *"convention-page prose"*). ✅ **The consequence is unaffected and gets stronger, not weaker** — every one of these is skill-less and Decision 1 sends them all to the coder; the owner-confirmed substance (*"Confirm as intended"*) is untouched. The defect is that a bullet whose stated job is to let a reader check the claim reads as a complete enumeration (*"four … (measured 2026-08-28)"*, *"the loop staffs **all four**"*) and is not one — **under**-stating the reach of the change C6 itself calls *"the change with the widest reach"*. Raised by both reviewers. |

| R14 | 4 | low | `adr-044…md:257-258` (`> for Sprints 3, 4 and 6.` immediately followed by `**Main tradeoff:** prose-enforced, like ADR-038`) | **A Markdown render defect opened by the R12 fix, at the exact line the fix appended.** There is **no blank line** between the ⚠️ block's new closing sentence (`:256-257`, the ⛔ *"The eight are not re-opened"* the fix added) and the `**Main tradeoff:**` paragraph at `:258`. Under CommonMark a non-blank, non-block-start line after a blockquote paragraph is a **lazy continuation**: `:258-261` are absorbed **into the blockquote** *and* merged into its final paragraph. Rendered, the accepted decision's **main tradeoff** — the standing Build carve-outs the owner signed off under ND5 — stops being its own top-level paragraph and reads as a trailing clause of a warning about how to read a count: *"…they are correct for Sprints 3, 4 and 6. **Main tradeoff:** prose-enforced…"*. **Verified as new, not pre-existing:** an `awk` sweep for `prev ~ /^>/ && $0 !~ /^>/ && $0 != ""` over all 589 lines returns **exactly one** hit — this one; every other blockquote in the document is correctly terminated. ✅ **No fact changes and nothing downstream is licensed wrongly** — this is presentation, and the repair is inserting one blank line at `:258`. ⛔ Do **not** "fix" it by moving or rewording either paragraph. Raised by both reviewers. |
| R15 | 4 | low | `adr-044…md:225-226` (*"all eight non-coder rows this ADR measured the loop driving"*) vs `:245-247` (*"By candidate 4's own predicate it is therefore a **ninth measured instance** of the practice"*) | **A literal self-contradiction created by the R12 fix, between the headline and the block written to qualify it.** `:225`'s predicate is *"non-coder rows **this ADR measured** the loop driving"*. `0211` satisfies every limb of it: it is non-coder (`## Owner: fkit-wiki`), the loop drove it (candidate 4 quotes its worklog, *"`fkit-wiki` (build worker, spawned by `/fkit-sprint-ship-loop`)"*, verified verbatim at `0211/worklog.md:3`), and this ADR **measured** it — `:245-247`, newly written by the fix, says so in those words. So by `:225`'s own predicate the figure is **nine**, and `:225` and `:246` cannot both be literally true. This is the same class R12 itself identified (*"by the headline's own predicate the ADR now measures a ninth"*) — R12's repair re-filed the instance correctly but left the headline's quantifier untouched, so the fix **relocated** the contradiction rather than discharging it. ✅ **A reader is not misled** — the ⚠️ block sits directly under the sentence, names the phrase *"all eight"* by name, and discloses the ninth — which is why this is `low`, not `medium`. The defect is that one word (*"measured"*) does two jobs 21 lines apart in a document whose whole value is being checkable. ⛔ **The repair is a one-clause narrow of `:225`'s predicate to the counted population** (e.g. *"all eight non-coder rows this ADR **counted** the loop driving"*, or *"…on the boards it counted"*) — ⛔ **NOT** re-opening which eight rows they are, ⛔ **NOT** re-measuring Sprint 2, and ⛔ **NOT** promoting the count to nine. Raised by both reviewers (Codex `X1`/`X7`; own pass concurs and supplied the predicate test). |
| R16 | 4 | low | `adr-044…md:437-442` — the ⚠️ *"A mention is not a producing skill"* paragraph the R13 fix added | **The R13 fix re-creates, inside its own new paragraph, the exact defect R13 was raised about** — *"a bullet whose stated job is to let a reader check the claim reads as a complete enumeration and is not one"*. **Two legs, one repair.** ✅ First, the substance is **CORRECT and was verified**: *"Five of the 13"* is numerically true — `0262`, `0318`, `0320`, `0321`, `0335` — and *"every one is a **reference**, not an invocation"* is true for **all five**, including the two the paragraph never names (`0262:370`, *"ADR-035, `/fkit-task-brief` step 5"* — a citation; `0321:30`, inside a quoted blockquote). The three it does name check out verbatim (`0318:155`, `0320:163-164`, `0335:311-312` all point at `## Correcting an accepted ADR — the dated correction note`; `0318:127` reads *"an owner-ruled task, **not** by `/fkit-task-brief`"*). **(a)** The paragraph asserts a universal over five and substantiates **three** — `0262` and `0321` are asserted-but-unnamed, so the reader who tries to check the claim cannot. **(b)** ⚠️ **The warning's reach figure is short by four.** *"or it will route all **five** to the wrong role"* measures the hazard by the two named skills, but the hazard the sentence describes is *"grep the brief for skill names"* — and **nine** of the 13 briefs contain at least one real `/fkit-*` skill token, not five: add `0184` (`/fkit-sprint-ship-loop`, `/fkit-status`), `0187` (`/fkit-task-done`, `/fkit-team`), `0221` (`/fkit-sprint-ship-loop`), `0340` (`/fkit-status`); `0013` names the **agent** `/fkit-coder`, making ten `/fkit-*` tokens in all. Only `0149`, `0183`, `0193` are clean. **Two of the additions name producer-owned skills** — `0187`'s `/fkit-task-done` and `0262`'s `/fkit-heal`, both `claude/skills-for-role.sh:54` — i.e. the precise misroute shape the sentence exists to warn about. ✅ **The prescribed remedy is right regardless** (*"read the deliverable's producing skill"*), and `:422-423`'s *"None of the 13 names a **producing** skill"* is **verified true** — none of those skills produces the deliverable in question. Only the reach figure under-states. ⛔ Repair by naming `0262` and `0321` and widening the reach clause; ⛔ do **not** re-open the 8+3+2 partition, which re-derives exactly. Raised by both reviewers (leg (a) Codex `X4`; leg (b) own pass, disk-verified). |
| R17 | 4 | low | `adr-044…md:17-18` (*"where a line number appears for one of those it is a secondary aid **measured 2026-08-27**, never the anchor"*) vs `:242` (`ai-agents/sprints/backlog.md:121`) | **A stale provenance stamp left by the R12 fix — the smallest of the four, and stated rather than dropped.** The ADR's own §Citation form block declares that any line number cited against a board or brief is a secondary aid **measured 2026-08-27**. The R12 fix introduced `ai-agents/sprints/backlog.md:121` at `:242` — and it is the **only** board/brief line number in all 589 lines (`grep -n 'sprints/…\.md:[0-9]…'` → one hit) — but that coordinate was measured **2026-08-28**, in the fix's own re-derivation (the coder's Round-3 log: *"`0211` at `ai-agents/sprints/backlog.md:121`"*, under the 2026-08-28 commands). So the document's single board coordinate is stamped a day older than it is. ✅ **The number itself is CORRECT today** — `sed -n '121p'` is `0211`'s row, and it sits at `:121` in both the working tree and `HEAD`, so nothing has drifted. ✅ **And the citation form is a declared frontier-move, not a convention breach:** `durable-citation-anchors.md` row 3 rules `path:NNN` wrong for a coordination document *categorically*, but `:14-18` declares the secondary-aid form up front and pairs it with the row's quoted fragment (`✅ Done (agent-closed — not owner-verified)`). **That call is not re-litigated here** — only its date is wrong. Repair: widen the stamp to cover 2026-08-28, or date the coordinate in place. Codex pass (`X8`), verified and narrowed by the own pass. |

### Round 3 adjudication — the coder's discretionary edit: **IT STANDS. Do not reverse it.**

`worklog.md` decision-log entry 5 records one edit applied without a reviewer finding: §Context
`:151`, *"The gap bites on **every sprint**"* → *"on **every sprint in the table above**"*, flagged
*"so Round 3 can reverse it"*. **Ruling: correct, keep it.** Re-measured against §Context's own table
(`:136-142`): Sprint 3 → 2 of 4 non-coder; Sprint 4 → 2 of 8; Sprint 5 → 5 of 17; Sprint 6 → 4 of 21.
Every sprint row in the table carries non-coder rows, so the new sentence is **true as measured**, and
*"roughly one row in four"* holds (13 of 50 across Sprints 3–6 = 26%). ⚠️ **One correction to how the
coder labelled it:** the edit is a scope **narrowing** of the claim, not a widening — it bounds an
unbounded universal to the measured table, which is the same direction the owner's *"Qualify the
quantifier"* ruling pushed R8. The coder's *"small scope widening"* refers to widening their own
**action** scope beyond the reviewer's findings, which is an honest and correct thing to flag; the
**claim** got narrower and truer. Nothing to reverse.

### Round 2 adjudication — R6's second leg: **the reviewer was WRONG, the coder's disproof STANDS**

Re-measured first-hand 2026-08-28. `grep -A1 '^## Owner' ai-agents/tasks/backlog/0184-*/brief.md`
returns **two** match blocks: `## Owner` + `fkit-producer` (brief `:15-16`), then
`## Owner rulings on record` + **a blank line** (brief `:206-207`). My Round-1 claim — *"`grep -A1
'^## Owner'` over every `brief.md` … → none blank"* — **does not reproduce and was wrong**; it must
have read an anchored match or collapsed the multi-match output. The ADR's sentence *"One Backlog
brief returns an empty `## Owner` to a naive grep"* was **true as written**, and keeping and
sharpening it (naming `0184`, explaining the quirk, prescribing `^## Owner$`) was the correct
disposition. **R6's `PARTIALLY CORRECT` verdict and its one-leg-disproven record are accepted in
full; the reviewer's *"wrong as measured facts"* over-reached on that half, exactly as the coder
said.** R6's **first** leg re-reproduces exactly today (below).

### Checked clean (no row)
**Round 3.**
- **R9 — the per-row rewrite lands, and it agrees everywhere.** The preamble (`:476-492`) is four
  bullets, not a count: `0241`/`0222`/`0242`/`0249` corroborate; `0171` *"also corroborates Decision 1,
  and separately kills `## Owner` as the predicate"*; `0270` is the rule applied live but
  `🔄 In progress`; `0178`/`0218` are *"NOT corroboration of the rule"*, **"and only these two"**.
  Cross-checked against C6 `:417` (*"**Two** rows already shipped the other way"*), §Why `:228`
  (*"on `0178` and `0218`"*), §Re-raise `:450` (*"`0171` is the counter-example"*), §Context `:43-45`,
  and the table's own `0171` row `:506` (updated to *"✅ **corroborates Decision 1's skill-less
  clause** … and is the **counter-example**"*). **All six sites agree; no count remains to contradict
  the table.** R3's `0178`/`0218` marking is unchanged, as required. Codex reached the same conclusion.
- **R10 — every quoted fragment resolves on disk, and the label is right.** All four briefs re-read:
  `0318` *"Append a dated correction note to `0238`'s closed brief"* ✓; `0320` *"…in the closed briefs
  `0261` and `0263`"* ✓; `0321` *"Repair the two stale `0171` claims on the live Backlog board"* ✓;
  `0335` *"**No source code changes. This task edits records only.** It writes into `0327`'s folder"*
  (`brief.md:221`) ✓. *"Skill-less coordination-doc repairs"* is Decision 1's own word (`:175`) and is
  the accurate class. *(The **count** in the same bullet is R13; the four **quotes** and the **label**
  are clean.)*
- **R11 — the worklog now agrees with itself and with the ADR.** §Deliberately not done reads
  *"**One** unverified item … how Sprint 5's two non-excluded architect rows were staffed"*, with the
  dated parenthetical naming what resolved the second and pointing at decision-log entry 7. Matches
  the ADR's §Unverified this pass (`:428` *"(Still unverified.)"*; `:430-433` *"**Resolved
  2026-08-28, in `0270`'s review round 1:** the blank-`## Owner` question"*) and the R8 block's gap (1)
  (*"the other two were not checked (still flagged under §Unverified this pass)"*). No contradiction
  left anywhere in the file.
- **R8 — the parts that are right, stated so they are not re-fixed.** The headline qualification
  (*"all eight non-coder rows **this ADR measured** the loop driving"*) is the correct move and the
  eight are correct for Sprints 3/4/6 (§Context's table: 2 + 2 + 4). Gap (1) is accurate — Sprint 5's
  five split 3 owner-excluded / 2 unchecked, and the two unchecked are the **architect** rows §Unverified
  names. Candidate 4's `0211` framing is **correct**: *"more than once"*, `0211` named *"a second
  instance of the lawful Build, not a counter-example to Decision 4"*, `0249` kept as the worked
  specimen *"because its ledger shows the unlawful half too"* — exactly as ruled. **Sprint 2 was not
  re-measured and the evidence base was not restated**, per the ruling. ⛔ **Only `0211`'s board
  placement is wrong (R12) — the rest of the R8 fix must not be re-opened.**
- **Backlog board re-reproduces exactly, a third time**: `| 🔲 Backlog` rows on
  `ai-agents/sprints/backlog.md` → **123**; each row's own brief read with an anchored `^## Owner$` →
  **72 coder / 30 architect / 13 producer / 6 wiki / 2 reviewer** = **51 non-coder**; no blank field.
  The ADR's dated figure is right for its date. *(The live board keeps growing; that is not a defect.)*
- **Transcriptions still byte-faithful.** ADR-038 §Decision at `adr-044…md:27` is character-for-character
  `adr-038…md:39` (diffed, identical). All **eight** owner labels in §Owner sign-off (`:465-472`) match
  `plan.md` §6 (`:97-104`) exactly — Route, ND1–ND7. Nothing widened or narrowed by the Round-2 edits.
  Both reviewers checked this independently and agree.
- **Citations durable.** The fragments the Round-2 fixes newly added all resolve: `0211` `worklog.md:3`
  (*"`fkit-wiki` (build worker, spawned by `/fkit-sprint-ship-loop`)"*), the four `0318`/`0320`/`0321`/
  `0335` fragments, `0335` `brief.md:221`. *(Trivial, not a row: the `0335` parenthetical says
  *"its `worklog.md` and `review.md`"*; its brief's own site table also names `plan.md` (sites A1, A2).
  The operative claim — records, not a brief — is unaffected. Noted so the coder is not asked to chase it.)*
- `node --test test/adr-number-uniqueness.test.js` → **14 pass, 0 fail**. Full suite `npm test` →
  **782 tests, 782 pass, 0 fail** (24 suites), and `test/prove-red.sh`'s hard gate **PASSED** (26
  mutations, each reds its named assertion; exit `0`). No `ai-agents/wiki-vault/` path in
  `git status`.
- **Tree boundary holds.** `0270`'s own footprint is the untracked ADR under `decisions/` plus this
  task folder. `git diff -U0` on `0270/brief.md` → one line, `🔲 Backlog` → `🔄 In progress` (the
  driver's). `sprint-6.md` → one hunk, four board rows (the driver's, dispositioned at R7). Everything
  else in the working tree belongs to other Sprint 6 tasks and is not this one's: `bin/release.mjs` +
  `test/release-summary.test.js` + `test/prove-red.sh` (`0300`), `claude/skills/fkit-task-done/SKILL.md`
  + the `0229` folder move (`0229`), the `0188`/`0300` moves, and the `0318`/`0320`/`0321` brief edits —
  which are **link repointing only** (`../0229-…` → `../../done/0229-…`, one line each), a consequence
  of `0229`'s close, **not** an edit by this task to the rows the ADR cites.

**Round 2.**
- **Counts re-reproduce exactly**, independently by both reviewers: `| 🔲 Backlog` rows on
  `ai-agents/sprints/backlog.md` → **123**; each row's own brief read with an **anchored** `^## Owner$`
  → **72 coder / 30 architect / 13 producer / 6 wiki / 2 reviewer** = **51 non-coder**. No blank field
  anywhere. `dashboard.sh` emits **no** `brief-missing-owner` fact for this board — the lone textual
  hit is inside `0180`'s task **title**, as the coder said. The ADR's corrected row and re-measurement
  paragraph are right. *(The board is live: it reads **124** rows today as new tasks land. The ADR's
  figure is dated 2026-08-28 and correct for its date.)*
- **R1 — the exception's bound is genuinely bounded.** `:185-192` fences it on **three** axes (the
  Plan step · non-coder rows · `/fkit-sprint-ship-loop`), adds the explicit negative *"It reaches no
  other step and no other loop"*, states ADR-038 **not amended**, and states C2 (ii) **not widened**
  to Plan. It **grants no skill** — Decision 2 is *"by hand where that role does not own
  `/fkit-plan-task`"*, and `skills_for_role()` stays untouched (`:322`, C1 `:306`). It licenses
  nothing beyond Plan-on-non-coder-rows. §Context `:112-118` and C4 `:351-362` agree with it and with
  each other. Codex reached the same conclusion independently.
- **R2 — the discharge holds without the universal.** `:95-106` now rests on the mechanism leg alone
  (derived role → does not own `fkit-process-stateful-review` → ADR-018 hook denies → by-hand
  `0158`/`0143` route → outcome (b) was rejected for). That leg is self-sufficient; the parenthetical
  naming `0171` as the counter-example is correct on disk (`## Owner: fkit-architect`, coder Build).
  All three of ADR-038's re-raise triggers re-checked as not firing.
- **R3 — marking correct.** `0178` = `## Owner: fkit-architect`, `0218` = `## Owner: fkit-producer`,
  both by hand; both rows carry *"Not corroboration of the rule"*. The eight-row set at `:226` is
  internally consistent and `0270` is marked `🔄 In progress`, not shipped. *(The **quantifier** in
  the same sentence is R8; the **preamble's** count is R9 — the marking itself is clean.)*
- **R4, R5, R7 — verified correct.** R4: the wiki *"no third outcome"* sentence explicitly stands with
  Decision 4 named as its answer, the architect claim is the one corrected, and *"the architect wall
  is not a wall"* is now conditional on C2 (i) (`:78-83`). R5: ADR-038 carries `:88-91` and `:101-103`
  in one document — *"not ADR-038 contradicting itself"* is right, and C2 (ii) is re-founded on
  *"their roles come from the loop's enumerated step table"*, scoped to Build, Verify untouched
  (`:119-132`, `:324-331`); the stale *"(C5)"* cross-reference is fixed. R7: `worklog.md:60-75` names
  the `sprint-6.md` P19 flip, attributes it to the driver, and states step 9 is unmeetable inside the
  loop rather than claiming the boundary held.
- **Transcriptions byte-faithful.** ADR-038 §Decision at `adr-044…md:27` matches `adr-038…md:39`
  character-for-character. All **eight** owner labels in §Owner sign-off (`:439-446`) match `plan.md`
  §6 exactly — Route, ND1, ND2, ND3, ND4, ND5, ND6, ND7. Nothing widened or narrowed.
- **Citations durable (fragment-paired) and resolving.** Re-read on disk: `SKILL.md:31`, `:103`,
  `:122` (*"run `/fkit-plan-task`"*), `:123` (*"implement the **approved** plan"*), `:126`, `:249`;
  `skills-for-role.sh:51-59` (flat `case`), `:55` coder incl. `fkit-plan-task`, `:56` architect;
  `fkit-coder.md:211`, `:60`; `fkit-architect.md:65`; `dashboard.sh:1196`, `:983`;
  `fkit-process-stateful-review/SKILL.md:195`; ADR-038 `:39`, `:88-91`, `:101-103`, `:116`. The
  recorded `skills-for-role.sh:48 → :51` drift note (`:491-492`) is accurate.
- `node --test test/adr-number-uniqueness.test.js` → **14 pass, 0 fail**. Full suite `npm test` →
  **782 tests, 782 pass, 0 fail** (24 suites), and `test/prove-red.sh`'s hard gate PASSED — exit `0`.
  No `ai-agents/wiki-vault/`
  path in `git status`. Nothing else in the tree is this task's: the ADR (untracked) + this folder;
  the `sprint-6.md` P19 flip is the driver's, dispositioned at R7.
- **Codex finding not recorded as a row (PARTIALLY CORRECT, trivial):** that `:152-155`'s *"reads
  blank to a naive grep"* attributes the blankness to the **brief** when the grep in fact emits
  `fkit-producer` first and the empty value second. True but immaterial — the sentence's operative
  content (the exact mechanism, the real owner, and the `^## Owner$` fix) is precise, and no reader is
  misled. Noted so the coder is not asked to chase it.

**Round 1.**
- Brief verification steps 1–8: all met — structure (`:20`, `:129`, `:188`, `:247`); ADR-038 Decision quoted verbatim with file + `:39` (`:24-29`); closeout answered before options (`:74-105`, subject to R2's re-founding); Build fixed by the table, named (`:29-34`); candidates 1–3 each accept/reject (`:190-226`), plus 4 and 5; `0255`/`0258`/`0269` by ID with the 2026-08-10 rulings and verbatim labels (`:113`, matching `sprint-5.md` §Notes); `0223`/`0224`/`0225` explicit (C3); ADR-038 not amended, correction note routed to a follow-on (C4); sign-off table with date, channel, eight verbatim labels (`:345-361`).
- Decision vs rulings ND1–ND5: exact — Owner column `fkit-wiki` + Plan-worker `BLOCKED` backstop; blank Owner not-eligible-until-repaired; Plan = Build role by hand; report only, route named, new roll-up class, status untouched; carve-outs for **both** architect and producer (`:181-184`, `:259-272`, `:359`). ND6: three follow-ons named, not scoped. ND7: corroboration table present. No widening, no narrowing found beyond R3's consequence-statement gap.
- Facts re-measured: Sprint 3–6 status tables → 4/2, 8/2, 17/5 (3 architect, 2 wiki), 21/4 — match; seven worklog fragments (`0171`, `0178`, `0218`, `0222`, `0241`, `0242`, `0249`) and `0249/review.md:16` — match; ADR-038 `:39`, `:57-63`, `:88-91`, `:101-103`, `:107-116` — match; `SKILL.md:31`, `:103`, `:122-127`, `:249`; `skills-for-role.sh:51-59`; `fkit-coder.md:60-72`, `:211`; `fkit-architect.md:65`; `fkit-process-stateful-review/SKILL.md:195`; `dashboard.sh:983`, `:1196` — all match; ADR-005 title fragment, ADR-033 §Decision 2/4, ADR-037 §3/§5, `0167` worklog fragment, `0205` folder, `/fkit-record-decision` §"Correcting an accepted ADR" — all present.
- Number sweep: `grep -rn -i 'adr-044' ai-agents/ claude/ test/ README.md CLAUDE.md` → only `0270`'s `plan.md`/`worklog.md`; `node --test test/adr-number-uniqueness.test.js` → 14 pass, 0 fail. No `ai-agents/wiki-vault/` path in `git status`. Shape matches ADR-043 (Context / Decision / Options / Consequences / Re-raise / Owner sign-off / Related).
- Citations: skill/agent `path:NNN` paired with fragments; ADR/board/brief refs by heading + fragment with `:NNN` as dated secondary aid — conforms to `durable-citation-anchors.md` rows 1 and 3.
- Codex finding on re-raise-trigger overlap with ADR-038 (`:331-336`): **disproven** — the overlap is deliberate and labelled (*"ADR-038's own first trigger; if it fires there, the 'soft wall' analysis here changes shape too"*). Not recorded as a row.

### Round 4 — no-regression sweep (the driver's confirm list), and what re-derived clean

**Nothing regressed outside the changed regions.** Each item checked this turn, not assumed:

- **Decision and ND transcriptions byte-faithful.** ✅ ND1–ND7 at `adr-044…md:494-500` compared
  against `plan.md` §6 line by line — all seven option labels identical, including the
  `(Recommended)` suffixes and ND2's rider *"a blank `## Owner` is not-eligible-until-repaired, never
  treated as coder"*.
- **ADR-038 unamended.** ✅ `git status --porcelain -- …/adr-038*.md` → empty.
- **No wiki-vault write.** ✅ `git status --porcelain -- ai-agents/wiki-vault/` → empty.
- **Tree boundary holds.** ✅ The only change under `ai-agents/knowledge-base/` is the untracked
  ADR-044 itself; the only other touched paths are inside `0270`'s own folder (`brief.md` modified —
  the driver's status flip already recorded under R7, plus `plan.md`/`review.md`/`worklog.md`).
- **Tests green.** ✅ `test/adr-number-uniqueness.test.js` **14/14 pass, 0 fail** (includes *"the live
  knowledge-base has no duplicate ADR numbers"*, which is the one that could have reded on a new
  ADR). ✅ Full unit suite **782/782 pass, 0 fail, 0 skipped**. ✅ `bash test/prove-red.sh` hard gate
  **PASSED** — every one of its 26 mutations reds its named assertion.
- **Citations durable.** ✅ Checked against the ADR's own declared form at `:14-18` and against
  `conventions/durable-citation-anchors.md`. One defect found and filed as **R17** (a date stamp, not
  a wrong coordinate). No `path:NNN` citation in the document resolves to different text than the
  ADR claims.

**Re-derived first-hand from disk this round, and reconciling exactly** — stated because this is the
fourth round in which a count moved, and because the driver asked for the R13 partition to be
re-derived independently rather than re-read:

- `grep -E '^\| 🔲 Backlog \|' ai-agents/sprints/backlog.md`, taking the **last** cell's brief link
  → **123 rows, 0 duplicates**.
- Each of the 123 briefs read for its anchored `^## Owner$` next line → **72 coder / 30 architect /
  13 producer / 6 wiki / 2 reviewer = 123**. Matches `:142` and matches the ADR's parenthetical.
- The **13 producer IDs** are exactly `0013 0149 0183 0184 0187 0193 0221 0262 0318 0320 0321 0335
  0340` — the ADR's set, no additions, no omissions.
- **Every bucket assignment verified against each brief's own `## What to build`.** The eight
  coordination-doc **repairs** all repair a coordination document, and each per-document label at
  `:425-429` is accurate (`0183` does repair a sprint plan *and* a brief; `0193` does repair a closed
  brief *and* a closed sprint board; `0321` is the live Backlog board; `0335` is *"This task edits
  records only"*). The three at `:430-432` are all skill-less doc **writing, not repair**. The two at
  `:433-435` reach the coder through the residual limb. **8 + 3 + 2 = 13.** ✅ R13's fix is correct.
- `0211`'s board position: `sed -n '121p' ai-agents/sprints/backlog.md` → its row, in **both** the
  working tree and `HEAD`. Its brief reads `## Sprint` → `Backlog` and `## Status` →
  `✅ Done (agent-closed — not owner-verified)`. ✅ Gap (2) is factually right.
- The eight named at `:226` count to eight. Gap (1)'s *"five"* Sprint 5 rows resolve to 3 excluded +
  2 unchecked. ✅ Both internally consistent.
- **The three gaps are mutually consistent, and none contradicts `:233-235`.** Gap (1) is a measured
  board whose rows were not driven; gap (2) is a measured board whose *closed* rows were not counted;
  gap (3) is boards outside the base entirely. No overlap, no gap claims a row another gap claims.
  ✅ **This is the substance of R12 and it lands.** Gap (3)'s *"none is named or counted here"* was
  checked against `0143`/`0158` (`:97`, `:272`) and `0167` (`:182`, `:586`) — all three are named for
  **other** reasons (the Process-review misroute; a Plan-step owner ruling), none as an instance in
  the count. **Not a contradiction; no row.**

### Round 4 — re-litigates settled decisions (suppressed)

**None reached the ledger, but two were raised in-pass and stopped here** — recorded so the coder can
see they were considered and why they are not rows:

- **Codex `X5`** — *"`## Sprint: Backlog` is a nonexistent heading; the same malformed anchor recurs
  at `:311` and `:420`, contrary to the ADR's citation rule."* **REJECTED on verification.** It is a
  document-wide shorthand for a two-line brief field, used identically at `:311` (`## Owner:
  fkit-wiki`) and `:420` (`## Owner: fkit-producer`), and it **predates this round** — it is not text
  either Round-3 fix wrote. Nobody fails to find `## Owner` in a brief because of it. Raising it now
  would be scope creep into unchanged text.
- **Codex `X2`** — *"'All three cut in the decision's favour' is wrong, because gap (1)'s rows were
  never driven."* **Checked; held below the bar.** The *"more corroboration"* clause is indeed loose
  for gap (1), but the sentence's conclusion survives on its second clause (*"nothing in the wider
  set has been shown to contradict the rule"*), which is true of all three. More decisively: the
  sentence is **not** text the R12 or R13 fix introduced, and this is a confirmation pass scoped to
  those fixes.

Checked against every settled item and **none is touched by R14–R17**: *Accepted residuals* (still
empty); **ND1–ND7** — re-verified byte-faithful, no row re-argues a ruling; the owner's **2026-08-28**
rulings on **R1**, **R3**, **R8** and **"Act, then close"** — R15 does **not** re-argue *"Qualify the
quantifier"* (it says the qualification left the headline it qualifies literally contradicted) and
R16 does **not** re-argue *"Confirm as intended"* (the consequence is restated, untouched); the
**"Accept the in-place edit"** ruling — **not raised, by instruction**; **R6's second leg**, **R3's
`0178`/`0218` marking**, my own **Round-3 ruling that the *"every sprint in the table above"* edit
stands**, and **R9/R10/R11 as verified clean** — all **not reopened**; **Sprint 2 not re-measured /
the eight not re-opened** — honoured, and R15's repair is explicitly scoped so it stays honoured.
ADR-038's three `Re-raise only if` triggers re-checked: none fires. ADR-044's own four triggers
(`:466-476`): none fires.

### Round 4 — convergence call

⛔ **CONVERGED — this is the closeout round, and I am calling it proactively rather than waiting to
be asked. Recommend: apply the four, then CLOSE. Do not open a Round 5.**

**Why, stated plainly.** Four findings, **zero blocking**, **all `low`**, all one-clause repairs, all
document-surface. Not one touches the decision, ND1–ND7, the ADR-038 transcription, or an owner
ruling. Everything structural has now been verified **four** times and holds; the R12 and R13 fixes
both **land in substance**, and R13's partition — the thing the driver asked to be re-derived
independently — reproduces from disk **exactly**, down to the ID set and every bucket.

⚠️ **The pattern is now four rounds old, and it is the finding that matters most.** Round 1 fixed two
quantifier errors and introduced two; Round 2 fixed those and introduced two; Round 3 fixed those and
introduced these. **Every single recurrence has been in the fix, never in the decision**, and every
one has been an over- or under-statement of a *count, an enumeration, or a render boundary* — never a
wrong rule, never a wrong staffing, never a misread ruling. The coder's Round-3 counter-measure
(re-derive every numeral and named instance from disk) **worked**: every numeral in this round's text
re-derives correctly. What it does not cover is what R14–R17 actually are — a **blank line**, a
**quantifier in an unedited sentence made false by an edited one**, an **enumeration that is
substantiated for three of a correctly-counted five**, and a **date stamp**. Those are not
measurement failures; they are the residue of hand-maintaining a 589-line prose document.

⛔ **That residue is a frontier, not a defect class to keep iterating on.** The marginal value of a
fifth reviewer round on this document has gone to approximately zero: each round costs a full
two-reviewer pass and returns 2–4 low, non-blocking surface nits in whatever the previous fix wrote,
with a demonstrated ~100% rate of producing one or two more. **A Round 5 would be re-litigating a
settled cost, and I would flag it as such.** The owner's 2026-08-28 ruling **"Act, then close
(Recommended)"** already covers this disposition; no new owner call is needed and none is raised.

**No regression risk in the repairs.** All four are localized and none reverses a prior fix. ⛔ R14 is
one blank line — do not reword either paragraph. ⛔ R15 must be fixed by narrowing `:225`'s
*predicate*, **not** by re-opening the eight, promoting the count to nine, or re-measuring Sprint 2.
⛔ R16 must be fixed by naming the two unnamed rows and widening the reach clause, **not** by
re-opening R3's owner-confirmed consequence or the 8+3+2 partition. ⛔ R17 is a date.

**Recommended sequencing for the close:** apply R14–R17, re-run `npm test` (currently 782/782 plus
the prove-red gate), and close. ⛔ **Do not re-review the applied fixes.** If applying them creates a
fifth surface nit of this same class, **record it in the worklog and close anyway** — that is the
convergence call, and it is deliberate.

### Round 3 — re-litigates settled decisions (suppressed)

**None.** Nothing was suppressed this round. Checked against every settled item and none is touched:
*Accepted residuals* (still empty); **ND1–ND7** (`plan.md` §6) — re-verified byte-faithful, no row
re-argues a ruling; the owner's **2026-08-28** rulings on **R1**, **R3** and **R8** — R12 does **not**
re-argue *"Qualify the quantifier"*, it says the qualification as executed mis-files its own only
cited instance, and R13 does **not** re-argue *"Confirm as intended"*, it says the bullet's
enumeration is incomplete while its consequence stands; the **"Accept the in-place edit"** ruling —
**not raised, by instruction**; **R6's second leg** — the coder's disproof stands, not reopened;
**R3's `0178`/`0218` marking** — confirmed correct a third time, not reopened; **Sprint 2 not
re-measured / evidence base not restated** — honoured, and R12's repair is explicitly scoped so it
stays honoured. ADR-038's three `Re-raise only if` triggers re-checked: none fires. ADR-044's own four
triggers: none fires.

### Round 3 — convergence call

**Converging, and this is the last round that should be needed.** Two novel defects, **zero blocking**,
both **under**-claims, neither touching the decision, the rulings, or any ND transcription. They are
**not** re-litigation — R12 is text the R8 fix newly wrote, R13 is a count the R10 fix carried through a
label it widened. ⚠️ **Flagged loudly, up front, because the pattern is now three rounds old:** Round 1
fixed two quantifier errors (R2, R3) and introduced two more (R8, R9); Round 2 fixed those and
introduced/left two more (R12, R13). **Every recurrence is in the fix, never in the decision**, and
every one has been an over- or under-statement of a *count or population*, never a wrong rule. **The
counter-measure the coder applied in Round 2 (sweep `every/all/only/never/always`) is the right one but
was scoped to universals — it does not catch a bare numeral (`"four"`) or a mis-attributed instance
(`0211`).** ⛔ **Recommended counter-measure for Round 3: for every remaining numeral and every named
instance in the changed regions, re-derive it from disk and state the command — do not carry a figure
forward through an edit that changes its label.** **No regression risk:** both repairs are localized
and neither reverses a prior fix; R12 must not be "fixed" by re-measuring Sprint 2 or re-opening the
eight, and R13 must not be "fixed" by re-opening R3's owner-confirmed consequence. **Recommend act,
then close out.** After these two, everything structural has been verified three times and holds; a
Round 4 is warranted only if a genuinely new defect appears.

### Round 2 — re-litigates settled decisions (suppressed)

**None.** Nothing was suppressed this round. Checked against every settled item and none is touched:
*Accepted residuals* (empty); **ND1–ND7** (`plan.md` §6) — no row re-argues a ruling, only R8/R9/R10
touch text the rulings direct, and each leaves the ruled substance intact; the owner's **2026-08-28**
rulings on **R1** (*"Owner-ruled scoped exception (Recommended)"*) and **R3** (*"Confirm as intended
(Recommended)"*) — both fixes verified as faithfully executed, and R9/R10 correct **how** the R3
consequence is worded, never **whether** it holds; the owner's **"Accept the in-place edit
(Recommended)"** ruling — **not raised, by instruction**; ADR-038 not amended and follow-on (ii) not
widened to Plan — **not re-argued**, both verified as stated. ADR-038's three `Re-raise only if`
triggers re-checked: none fires. ADR-044's own four triggers: none fires.

### Round 2 — convergence call

**Not yet converged — one more round is warranted, and it is small.** Four novel defects, **zero
blocking**, none touching the decision, the rulings, or any ND transcription. They are **not**
re-litigation: every one is text the Round-1 fixes newly wrote (R8 and R9 from the R3 rewrite, R10 from
the C6 bullet, R11 from the R6 resolution). ⚠️ **Flagged loudly, up front: R8 and R9 are the same
over-claim class Round 1 already fixed twice** — R2 dropped a false universal and R3 corrected a false
count, and the fix for R3 introduced a fresh false universal (`"every non-coder row the loop has
driven"`) plus a fresh over-generalisation (`"the last four"`). That is a **pattern in the fixes, not
in the decision**, and the Round-2 fixes should be checked against it rather than written quickly.
**No regression risk:** all four repairs are localized wording; none reverses a Round-1 fix, and R9/R10
must not be "fixed" by re-opening R3's marking, which is correct. Recommend **act, then close out** —
after these four, this ledger should converge, because everything structural has now been verified
twice and holds.

## Coder response

> Round 1 processed 2026-08-28 by the **Process-review worker** of `/fkit-sprint-ship-loop`
> (`fkit-coder`, spawned; ADR-038 fixes this step to the coder whoever authored the deliverable).
> Method: `fkit-process-stateful-review` steps 0–7, **standing approval** in place of the per-round
> owner gate (ADR-019 / ADR-032). **Every claim below was re-verified first-hand against the files on
> 2026-08-28** — the reviewer's line numbers were treated as dated aids, not anchors, and severities
> were **derived here from blast radius, not inherited**. Owner rulings of 2026-08-28 folded in for
> **R1** (*"Owner-ruled scoped exception (Recommended)"*) and **R3** (*"Confirm as intended
> (Recommended)"*); R2/R4/R5/R6/R7 needed no ruling.
>
> **Step 0/2 loop-check.** *Accepted residuals*: empty — nothing to suppress. ADRs in scope:
> ADR-038's *"Re-raise only if"* triggers and its closeout clause; ADR-044's own *"Re-raise only
> if"*. **No finding is a re-litigation** — none re-argues ADR-038's option (b) from deliverable
> authorship, and none re-opens a ruled ND. All seven are novel document defects. Nothing suppressed
> as settled.
>
> **Step 3.5 regression / oscillation.** Round 1; no prior rounds to oscillate against. No fix below
> reverses an earlier one.
>
> ⚠️ **One boundary call, recorded not buried.** ADR-044 is `Status: accepted`, and
> `/fkit-record-decision` §"Correcting an accepted ADR" says the form is *"not a licence to edit ADR
> prose … corrections are appended next to it, never written over it."* The fixes below **edit the
> prose in place**. Reason: that convention protects an ADR already in the corpus; ADR-044 was
> written in this task's own Build step and has not left its Build → Review → Process-review round.
> The owner's R1/R3 rulings direct the edits in terms only in-place editing satisfies (*"must state
> plainly"*, *"must stop citing"*) — a named owner ruling displacing a skill rule, ADR-037 §3, the
> same mechanism ADR-044 itself relies on. **No `- **Corrections:**` metadata bullet was added** —
> that form is for post-acceptance drift; this ledger and `worklog.md` are the record. Status stays
> `accepted`: the decision and every ND transcription are **unchanged**.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** (severity **medium**, derived — an accepted ADR mislabels a departure from a live ADR's rule as ground that rule left open; the C2 (i) implementer would read it as licence) | Defect — fact + framing | **Verified first-hand:** `SKILL.md:122` Plan row reads *"run `/fkit-plan-task`"*; `skills-for-role.sh:55` has `fkit-plan-task` under `coder)`; ADR-038's `:88-91` bullet names **Build and Verify** only. So ADR-038 §Decision does fix Plan = coder and Decision 2 departs from it. **Fixed per the owner's ruling** *"Owner-ruled scoped exception (Recommended)"*, at three sites: §Context — the *"Build / Plan"* bullet split into **Build** (untouched ground) and **Plan — and this is a departure, named as one**; **Decision 2** — a ⚠️ blockquote stating the scoped exception, its bound (Plan step, non-coder rows, this loop only), and that ADR-038 is not amended; **C4** — rewritten from *"reopens none of them"* to name the one departing clause, why an owner-ruled exception is not an amendment, and that C2 (ii) is **not** widened to Plan. ADR-038 **not amended**; follow-on (ii) **not** widened. | ✅ done |
| R2 | **CORRECT** (severity **medium**, derived — a universal premise falsified by the ADR's own counter-example, load-bearing for the closeout discharge the brief's verification step 3 requires) | Defect — false factual premise | **Verified first-hand:** `0171` brief `## Owner` → `fkit-architect`; `0171` `worklog.md` → *"Built 2026-08-15 by the `fkit-coder` Build worker"*. The ADR states the counter-example itself, so *"on every row measured … `## Owner` **is** the deliverable's author"* is false on its own evidence. **Fixed:** universal claim dropped; the Process-review discharge re-founded on the mechanism leg alone (derived role → does not own the skill → ADR-018 hook denies → by-hand `0158`/`0143` route), with an explicit parenthetical that the discharge does **not** rest on `## Owner` and authorship coinciding, naming `0171`. Conclusion unchanged; candidate 1 stays rejected. | ✅ done |
| R3 | **CORRECT** (severity **medium**, derived — an unstated consequence that changes who builds four live Backlog rows, plus a corroboration over-claim in the section a future reader will cite) | Defect — omission + over-claim | **Verified first-hand:** `0178` `## Owner: fkit-architect`, worklog *"fkit-architect, spawned as the BUILD step"*, deliverable a convention page **by hand**; `0218` `## Owner: fkit-producer`, worklog *"a spawned `fkit-producer` build worker"*, deliverable a brief repair **by hand**. Decision 1's skill-less clause (which names *"coordination-doc repairs"*) sends both to the coder — so they did **not** run the rule. On the Backlog board today `0318`, `0320`, `0321`, `0335` are all `## Owner: fkit-producer` brief repairs (measured 2026-08-28). **Fixed per the owner's ruling** *"Confirm as intended (Recommended)"*: **C6** gains a ⚠️ bullet stating the consequence plainly — the four named rows become coder Build rows, `## Owner` is not changed but stops being what the loop reads, and `0178`/`0218` shipped the other way; **§Corroborating practice** gains a two-halves preamble and marks the `0178`/`0218` rows *"Not corroboration of the rule"*; **§Why this and not the others** — *"consistent with all seven non-coder rows the loop has already shipped"* replaced with the measured eight, `0270` marked `🔄 In progress` not shipped, and *"accounts for"* explicitly distinguished from *"reproduces"*. | ✅ done |
| R4 | **CORRECT** (severity **low**, derived — a mislabelled claim and one unconditional sentence inside a Context paragraph; C2 (i) already carries the substance, so nothing downstream is misdirected) | Defect — wrong referent + missing condition | **Verified first-hand:** the brief's *"There is no third outcome"* sits in the **wiki** paragraph (refuse and stall, or comply and breach ADR-005); the *"no beat left to stop at"* sentence is the **architect** paragraph two paragraphs down — the `NEEDS-DECISION` relay answers the second, not the first. `fkit-architect.md:65` still reads *"don't run a half-blind version of it"* about its four interactive skills. **Fixed:** the paragraph now names the architect claim as the one corrected, says plainly that the wiki *"no third outcome"* sentence **stands** and Decision 4 is its answer, and splits *"the architect wall is not a wall"* into a conditional — true **only once C2 (i) ships**; until then an architect Build row needs a named ruling (ADR-037 §3), as `0270` itself did. | ✅ done |
| R5 | **CORRECT** (severity **low**, derived — an over-read of a neighbouring ADR, plus a follow-on resting on a reason that does not hold; the follow-on itself is owner-ruled and survives) | Defect — over-read + wrong ground | **Verified first-hand:** ADR-038 carries *"Build and Verify run no skill"* (`:88-91`) and `0241`'s architect Build via `/fkit-design-spec` (`:101-103`) **in one document**; `SKILL.md:123` Build cell reads *"implement the approved plan"* and names no skill. The reviewer's reading holds: *"run no skill"* is about the **step**, so ADR-038 is not self-contradicting. **Fixed:** *"ADR-038 already contradicts its own Build fact"* replaced with *"records Build workers running skills, without reconciling that with the table"*, plus an explicit **"This is not ADR-038 contradicting itself"* and the step-vs-worker distinction. **C2 (ii) re-founded** on the reviewer's ground — the fragment to annotate is *"their roles come from the loop's enumerated step table"*, because after Decision 1 Build's role comes from the deliverable's skill; scoped to Build, Verify untouched. Also corrected a stale cross-reference in the same bullet (*"filed as a follow-on (C5)"* → **C2 ii**; C5 is §Historical records). | ✅ done |
| R6 | **PARTIALLY CORRECT** (severity **low**, derived — wrong counts in one evidence row; the 51 / 41% headline every argument rests on is unaffected) | Defect — measured facts wrong (one leg **disproven**) | **Re-measured first-hand 2026-08-28**, as instructed: `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` → exit 0, 123 `🔲 Backlog` rows; reading each row's own brief `## Owner` → **72 coder / 30 architect / 13 producer / 6 wiki / 2 reviewer** = 51 non-coder. **Reviewer's split confirmed exactly**; the ADR's *"12 producer, 1 blank"* is wrong on both counts (51 total unaffected). No `brief-missing-owner` drift fact emitted — the single textual hit in the dashboard output is inside a task **title**, not a fact line. ⚠️ **The reviewer's second leg is DISPROVEN.** It reported `grep -A1 '^## Owner'` over every brief → *"none blank"*; re-run here it **does** return a blank, for `0184`, which carries a second heading `## Owner rulings on record` followed by a blank line — an unanchored `^## Owner` matches it. So the ADR's sentence *"One Backlog brief returns an empty `## Owner` to a naive grep"* is **true as written**, and the reviewer's *"wrong as measured facts"* over-reaches on that half. **Fixed:** the table row now reads 13 producer / no blank category; a dated re-measurement paragraph states the split, the command, and the superseded draft figures; the blank-Owner sentence is kept and **sharpened** — `0184` named, the quirk explained, the fix stated (anchor `^## Owner$`). **Resolved** the ADR's own §Unverified item on the blank-Owner brief (an obvious-winner call — see `worklog.md` decision log); Sprint 5's two rows stay unverified and are still flagged. Decision 4's blank-Owner rule untouched. | ✅ done |
| R7 | **CORRECT** (severity **low**, derived — a boundary claim in a worklog; no effect on the ADR or the decision, but it is the audit record) | Defect — incomplete claim | **Verified first-hand:** `git diff -U0 -- ai-agents/sprints/sprint-6.md` → one hunk, four rows changed, including `| 🔲 Backlog | P19 | **Decide how `/fkit-sprint-ship-loop` handles a non-coder-owned task row**` → `| 🔄 In progress | P19 | …`. That is `0270`'s own board row, flipped by the **driver** at plan approval — three sibling rows (P16–P18) flipped to `✅ Done` in the same hunk, confirming a driver edit, not a Build-worker one. Brief verification step 9 (*"changes **only** under `ai-agents/knowledge-base/decisions/` plus this task's own folder"*) therefore cannot be met inside the loop. Step 10 re-confirmed: `git diff --stat -- claude/skills/fkit-sprint-ship-loop/SKILL.md` → empty. **Fixed in `worklog.md`:** the boundary paragraph now names the `sprint-6.md` P19 flip, attributes it to the driver, states that step 9 as written is unmeetable inside the loop, and stops claiming the boundary held as stated. §Deliberately not done's *"no board edit"* re-scoped to *"no board edit **by this worker**"*. | ✅ done |

### Round 2 — 2026-08-28

> Same worker, same method (steps 0–7), same **standing approval**. Plan carry re-verified before any
> write: `git hash-object plan.md` → `8985cf9089a0a771a689cafcb9ac16cb5101b77f`. Every claim
> re-verified first-hand; severities derived here.
>
> **The reviewer's R6 adjudication is accepted with thanks and needs no action** — its Round-1 second
> leg is withdrawn, the Round-1 disposition stands, and nothing is redone.
>
> **Step 0/2 loop-check.** *Accepted residuals*: still empty. ADRs in scope re-skimmed (ADR-038's
> re-raise triggers and closeout clause; this ADR's own). **No R8–R11 finding is a re-litigation** —
> all four are defects **introduced by the Round-1 fixes**, none re-opens a ruled ND, the decision, or
> the 2026-08-28 rulings.
>
> **Step 3.5 regression / oscillation — this one matters.** R8 and R9 are **regressions I introduced
> in Round 1**: the R3 fix replaced a false count with a false *universal* (R8) and a preamble whose
> count contradicts its own table (R9). That is the reviewer's flagged pattern, and it is a fair hit.
> **No oscillation:** neither fix reverses a Round-1 fix — R8 qualifies the sentence R3 corrected
> (the corrected *content* stands), and R9 corrects a preamble R3 added without touching R3's
> `0178`/`0218` marking, which the reviewer re-verified as correct and which I did **not** re-open.
> **Counter-measure applied before writing:** every replacement sentence's quantifier was checked
> against what was actually measured, and a full `every/all/only/never/always` sweep was run over the
> finished ADR (one further same-class over-claim found and fixed — decision-log entry 5).

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R8 | **CORRECT** (severity **medium**, derived — a false universal in the ADR's summary paragraph, in a document other agents will cite as authority; it excludes rows the ADR itself names elsewhere) | Defect — false quantifier (**regression introduced by the Round-1 R3 fix**) | **Verified first-hand, all nine rows.** Sprint 2 (`## Sprint` field read on each brief): `0142` architect, `0143` architect, `0158` architect, `0159` **producer** (*"Build worker, spawned by `/fkit-sprint-ship-loop`"*), `0162` architect (*"spawned by `/fkit-sprint-ship-loop`"*), `0167` architect, `0195` architect, `0200` architect (*"spawned as the **Build** worker by `/fkit-sprint-ship-loop`"*). **`0211` verified as instructed:** `## Sprint: Backlog`, `## Owner: fkit-wiki`, worklog `:3` *"**Role:** `fkit-wiki` (build worker, spawned by `/fkit-sprint-ship-loop`)"*, deliverable *"annotate the three old-form completion flags in the vault log"* — **a vault write, lawfully built by a loop-spawned wiki worker. It holds.** So *"every non-coder row the loop has driven"* is false; the measurement window is Sprints 3–6 + the Backlog board. **Fixed per the owner's ruling** *"Qualify the quantifier (Recommended)"*: the sentence now reads *"all eight non-coder rows **this ADR measured** the loop driving"*, followed by a ⚠️ block naming the evidence base (Sprints 3–6 + the Backlog board), the **two** gaps it does not cover — Sprint 5's five non-coder rows (three owner-excluded 2026-08-10 and never driven; two unchecked and still flagged) and pre-Sprint-3 loop history — and stating that a wider population **corroborates** Decision 1 rather than contradicting it. **Sprint 2 was not re-measured and the evidence base was not restated**, per the ruling. ⚠️ **`0249`'s framing qualified as directed:** candidate 4 now says the loop has done a lawful wiki Build **more than once**, names `0211` as a **second instance, not a counter-example to Decision 4**, and explains that `0249` is cited as the worked specimen because its ledger shows the unlawful half too. Decision, rulings and ND transcriptions untouched. | ✅ done |
| R9 | **CORRECT** (severity **low**, derived — an internal contradiction confined to one preamble; it **under**-claims the ADR's own evidence, so it weakens the case rather than overstating it) | Defect — wrong count contradicting its own table (**regression introduced by the Round-1 R3 fix**) | **Verified first-hand.** The table's last four rows are `0178`, `0218`, `0171`, `0270`. Only `0178` and `0218` carry *"Not corroboration of the rule"*. `0171` is a **coder** Build of a skill-less convention page — precisely Decision 1's skill-less clause, by the ADR's own classification of `0178` as that class — so it **corroborates**. `0270` ran the architect's own skill on a named Route ruling — the rule applied live, not an improvisation. Confirmed the contradiction with C6 (*"**Two** rows already shipped the other way"*) and §Why this and not the others (*"on `0178` and `0218`"*), which both name two. **Fixed by saying per-row what each row is** rather than by substituting another count — a bare "two" would have re-created the same failure mode from the other side. The preamble is now four bullets: `0241`/`0222`/`0242`/`0249` corroborate; `0171` corroborates **and** kills `## Owner` as the predicate; `0270` is the rule applied live but `🔄 In progress`; `0178`/`0218` are *"NOT corroboration of the rule"*, **and only these two**. The `0171` table row was updated to match. ⛔ **R3's `0178`/`0218` marking was NOT re-opened** — the reviewer re-verified it as correct and it is unchanged. | ✅ done |
| R10 | **CORRECT** (severity **low**, derived — a wrong noun on two of four rows in an owner-confirmed consequence bullet; the consequence itself is unaffected, but the bullet's job is to let a reader check the claim) | Defect — wrong classification label | **Verified first-hand, all four briefs read.** `0318` — *"Append a dated correction note to `0238`'s **closed brief**"* → brief repair ✅. `0320` — *"…in the **closed briefs** `0261` and `0263`"* → brief repair ✅. **`0321`** — *"Repair the two stale `0171` claims on the **live Backlog board**"* → a **board** repair, not a brief repair. **`0335`** — *"**No source code changes. This task edits records only.** It writes into `0327`'s folder"*, targeting its `worklog.md` and `review.md` → a **records** repair. Reviewer correct on both. ✅ **The consequence stands unchanged:** all four are skill-less coordination-doc repairs, which Decision 1 (*"coordination-doc repairs"*) sends to the coder — the owner-confirmed substance is untouched. **Fixed:** the bullet now says *"skill-less coordination-doc repairs"* — Decision 1's own word — and names what each of the four actually repairs, with a quoted fragment each. Also re-checked the neighbouring `0218` label (*"brief repair"*) rather than assuming it: `0218` repairs `0177`'s brief, so it is correct and was left alone. | ✅ done |
| R11 | **CORRECT** (severity **low**, derived — a worklog contradicting itself 80 lines apart; no ADR or decision effect, but this is the audit record, which is the one place a stale claim hides) | Defect — stale claim (**left behind by the Round-1 R6 fix**) | **Verified first-hand:** `worklog.md` §Deliberately not done read *"Two unverified items"*, while the same file's decision-log entry 7 records the blank-`## Owner` item as resolved and the ADR's §Unverified this pass reads *"**Resolved 2026-08-28, in `0270`'s review round 1**"*. One item, not two. **Fixed:** the bullet now reads **One**, names the surviving item (how Sprint 5's two non-excluded architect rows were staffed), and carries a dated parenthetical recording that *"Two"* was true when written on 2026-08-27 and what resolved the second — pointing at decision-log entry 7 and the ADR section, so the correction is traceable rather than a silent overwrite. | ✅ done |

### Round 3 — 2026-08-28

> Same worker, same method (steps 0–7), same **standing approval**. Plan carry re-verified:
> `git hash-object plan.md` → `8985cf9089a0a771a689cafcb9ac16cb5101b77f`. Owner ruling folded in
> (live `AskUserQuestion`, 2026-08-28, verbatim label): **"Act, then close (Recommended)"**.
>
> **Accepted without action, as ruled:** the reviewer's finding that my Round-2 discretionary edit
> (*"every sprint"* → *"every sprint in the table above"*) **stands, not reversed** — and its
> correction of my own label for it: the edit **narrows** the claim. I had called it a "small scope
> widening"; that was about my *action* scope (editing unflagged text), not the claim's scope, and
> conflating the two in one phrase was imprecise. Recorded rather than quietly dropped. **R9, R10,
> R11 verified clean and not re-touched.**
>
> **Step 0/2 loop-check.** *Accepted residuals*: still empty. No R12/R13 finding is a
> re-litigation; neither re-opens a ruled ND, the decision, or the owner's rulings. Both are defects
> in text I wrote in Round 2.
>
> **Step 3.5 regression / oscillation.** ⚠️ **Both findings are again my own regressions** — R12 from
> the Round-2 R8 fix (I filed `0211` under the wrong gap), R13 from the Round-2 R10 fix (I carried
> "four" through an edit that widened the label from *"brief repairs"* to *"coordination-doc
> repairs"* without re-deriving the count — precisely the failure the reviewer names). **No
> oscillation:** neither reverses an earlier fix; both narrow claims I had left too loose, and
> neither touches the eight-row set or R3's owner-confirmed consequence.
>
> **Counter-measure applied, as instructed.** My Round-2 sweep (`every/all/only/never/always`) caught
> universals but by construction catches neither a bare numeral nor a mis-attributed instance. So
> this round **every numeral and named instance in the changed regions was re-derived from disk
> before writing**, commands stated in the decision log — and re-run again after writing. All
> reconcile: 123 `🔲 Backlog` rows; 72 coder / 30 architect / 13 producer / 6 wiki / 2 reviewer;
> Sprint tables 4 / 8 / 17 / 21; `0211` at `ai-agents/sprints/backlog.md:121`; 8 + 3 + 2 = 13.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R12 | **CORRECT** (severity **medium**, derived — the ADR's only named instance for a gap did not support that gap, and two of its own statements contradicted each other on what "measured" means; a reader checking the scope claim would find it false) | Defect — mis-filed instance + internal contradiction (**regression introduced by the Round-2 R8 fix**) | **Verified first-hand:** `0211`'s brief reads `## Sprint: Backlog` and `## Status: ✅ Done (agent-closed — not owner-verified)`; its row is live at `ai-agents/sprints/backlog.md:121`; `grep -c '^\| 🔲 Backlog .*0211-'` → **0**. So `0211` is **on** a measured board, and the true exclusion is narrower than I wrote: it fell outside the **123 `🔲 Backlog` rows counted**, because the count is of open rows. Confirmed the contradiction between the ⚠️ block's base definition (*"Sprints 3–6 and the Backlog board"*) and candidate 4's *"`0211` sits outside this ADR's measured boards"*. **Fixed within the guardrails:** the ⚠️ block now lists **three** gaps, with `0211` re-filed under a new gap (2) — *"the Backlog board was measured as its 123 `🔲 Backlog` rows — its closed rows were not"* — stating that **by candidate 4's own predicate it is a ninth measured instance**, not a row from an unmeasured board; gap (3) keeps the pre-Sprint-3 point **unenumerated**. Candidate 4's parenthetical narrowed to *"on a measured board but outside the **123 `🔲 Backlog` rows** counted … it reads `✅ Done`"*. ⛔ **Sprint 2 not re-measured** (owner-ruled out of scope) and ⛔ **the eight not re-opened** — an explicit *"The eight are not re-opened — they are correct for Sprints 3, 4 and 6"* was added. | ✅ done |
| R13 | **CORRECT** (severity **low**, derived — an under-count in an owner-confirmed consequence bullet; the consequence is unaffected, but the bullet exists so a reader can check it, and "four" understated the reach by more than half) | Defect — stale numeral carried through a label change (**regression introduced by the Round-2 R10 fix**) | **Re-measured from disk, not adjusted.** Command: the 123 `🔲 Backlog` rows extracted from the board, each row's own brief read for `## Owner` → **13 producer rows**; each of the 13 then read for the skill its deliverable names. **Result: none of the 13 names a producing skill**, so Decision 1 reaches **all 13**, not four. By document: **eight are coordination-doc repairs** — `0149`, `0183`, `0193`, `0221`, `0318`, `0320`, `0321`, `0335` (the reviewer's four additions confirmed exactly, **`0193` included — *"Repair the stale citations in `0158`'s closed brief"*, the original narrow class**); **three are skill-less coordination-doc writing that is not repair** — `0013`, `0184`, `0340`; **two name no skill but are not doc work** — `0187`, `0262`, which reach the coder through the clause's residual limb. 8 + 3 + 2 = 13. ⚠️ **One thing the re-measurement surfaced and the ADR now warns about:** five of the 13 (`0262`, `0318`, `0320`, `0321`, `0335`) cite `/fkit-record-decision` or `/fkit-task-brief` in their text, and **every one is a reference, not an invocation** — three point at `/fkit-record-decision`'s *"Correcting an accepted ADR"* section for the dated-note **form**, and `0318` explicitly says the row is *"an owner-ruled task, **not** by `/fkit-task-brief`"*. A grep-based oracle would misroute all five, so C6 now tells `0224`/`0225` to read the deliverable's producing skill rather than grep for skill names. ⛔ **R3's owner-confirmed consequence not re-opened** — it is restated, not changed. | ✅ done |

### Round 4 — 2026-08-28 — **final round; the ledger closes here**

> Same worker, same method, same **standing approval**. Plan carry re-verified:
> `git hash-object plan.md` → `8985cf9089a0a771a689cafcb9ac16cb5101b77f`. Reviewer's convergence
> ruling honoured: **apply the four, then close — no Round 5.** Decision-log entry 3 **kept**, as
> ruled. R13's 13-row partition independently re-derived by the reviewer and reproduced exactly.
>
> **Step 0/2/3.5.** *Accepted residuals*: still empty. No re-litigation; nothing re-opens a ruled ND,
> the decision, or the eight-row set. R14 and R17 are hand-maintenance artefacts, not regressions of
> a claim. R15 and R16 are mine — R15 relocated (not removed) a contradiction, R16 added text
> substantiated for three of a correctly-counted five. No oscillation: no fix reverses an earlier one.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R14 | **CORRECT** (severity **low**, derived — a rendering defect, not a content one, but it silently swallows four lines of the tradeoff paragraph into a blockquote in every CommonMark renderer) | Defect — markdown structure | **Verified first-hand:** no blank line between the ⚠️ block's closing `> …for Sprints 3, 4 and 6.` and `**Main tradeoff:**`, so lazy continuation absorbs the following four lines into the quote's final paragraph. **Fixed with exactly one blank line; neither side reworded**, per the guardrail. Re-swept the whole file for the same shape (`awk` over every line whose predecessor is a `>` line) → **no other instance**. | ✅ done |
| R15 | **CORRECT** (severity **low**, derived — a self-contradiction between the headline count and the block that qualifies it, three lines apart) | Defect — quantifier left behind by my own Round-3 R12 fix | **Verified first-hand:** `:225`'s *"all eight non-coder rows **this ADR measured** the loop driving"* is contradicted by `:246`'s *"a **ninth measured** instance"* — R12 filed `0211` correctly but left the headline predicate on "measured", relocating the contradiction rather than clearing it. **Fixed by narrowing the predicate to the counted population**, per the guardrail: *"all eight non-coder rows the loop drove in **the population this ADR counted** — the Sprints 3–6 status tables and the 123 `🔲 Backlog` rows"*. "Counted" and "measured" now do different work: eight counted, `0211` measured-but-not-counted. ⛔ The eight **not** re-opened, **not** promoted to nine, Sprint 2 **not** re-measured. | ✅ done |
| R16 | **PARTIALLY CORRECT** (severity **low**, derived — an unsubstantiated enumeration in an advisory aimed at two unshipped follow-ups; its *reach* sub-claim understates the risk it exists to flag) | Defect — under-substantiation + under-stated reach (one sub-claim **disproven**) | **Verified first-hand.** (a) *"Five of the 13"* is **true** — `0262`, `0318`, `0320`, `0321`, `0335` — and all five are references, not invocations. **Fixed:** `0321` now quoted (*"`/fkit-task-brief`'s own independent-shippability test"*) and `0262` quoted (*"(ADR-035, `/fkit-task-brief` step 5)"*), so all five are checkable. (b) *"nine carry a real `/fkit-*` token"* is **true** — the five plus `0184`, `0187`, `0221`, `0340`; `0013` names the **agent** `/fkit-coder`; `0149`/`0183`/`0193` name none. **Fixed:** reach clause widened. ⚠️ **(c) the finding's *"two of those name producer-owned skills"* does NOT reproduce — it understates by four times.** Derived, not inherited: `skills_for_role()` sourced directly, producer-**exclusive** skills computed as those in the producer arm and no other role (`fkit-initiate-project`, `fkit-task-brief`, `fkit-task-done`, `fkit-task-cancelled`, `fkit-status`, `fkit-heal`), then matched across the 13 → **eight** rows name one (`0184`, `0187`, `0262`, `0318`, `0320`, `0321`, `0335`, `0340`); only `0221` of the nine does not, naming the lead-owned `/fkit-sprint-ship-loop`. The ADR states the measured **eight**, not the finding's two: a grep oracle would route **8 of these 13 rows back to the producer** — the exact `## Owner` staffing Decision 1 replaces. ⛔ The partition **not** re-opened. | ✅ done |
| R17 | **CORRECT** (severity **low**, derived — a date in the citation-form preamble that no longer covers every coordinate under it; the coordinate itself is correct) | Defect — stale scope on a dated aid | **Verified first-hand:** §Citation form dates board line numbers to **2026-08-27**; the `ai-agents/sprints/backlog.md:121` coordinate added in Round 3 was measured **2026-08-28** and re-confirmed correct in tree today. **Fixed: the date only** — the preamble now carves out that one coordinate as measured 2026-08-28. No coordinate changed, no citation re-anchored. | ✅ done |

**Step 5 — convergence call, Round 4.** **Converged. Ledger closed.** Four findings, four
dispositioned, all `✅ done`; three `CORRECT`, one `PARTIALLY CORRECT` (R16, sub-claim (c)
disproven **upward** — the risk is larger than the finding stated, and the ADR now records the
measured figure). Zero blocking, zero frontier, zero closeout, zero blocked, zero re-litigation.
**No fifth nit of this class found:** the post-fix sweep for lazy continuation returns nothing, and
every numeral in the changed regions re-derives (9 skill-token rows · 8 producer-exclusive · 5
reference-only · 13 total · 8 + 3 + 2 = 13). Per the reviewer's ruling **no Round 5 is opened.**

---

**Step 5 — convergence call, Round 3.** **Converged.** Two findings, two dispositioned, both
`✅ done`, both `CORRECT`. Zero blocking, zero frontier, zero closeout, zero blocked, zero
re-litigation. **Both were my own regressions and both are now narrowed to what was measured.** No
discretionary edits this round. **Ready for the short Round 4 confirmation and close.**

---

**Step 5 — convergence call, Round 2.** **Converged.** Four findings, four dispositioned, all
`✅ done`, all `CORRECT`. Zero blocking, zero frontier, zero closeout, zero blocked, zero
re-litigation. **Both regressions I introduced in Round 1 (R8, R9) are fixed, and neither fix
re-opened the Round-1 work the reviewer re-verified as correct.** One unflagged same-class over-claim
was found by my own sweep and fixed (decision-log entry 5) — recorded so the reviewer can object.
Round 3 is warranted only if a **new** defect appears.

---

**Step 5 — convergence call, Round 1.** **Converged.** Seven findings, seven dispositioned in one round: six
`CORRECT`, one `PARTIALLY CORRECT` (R6, one leg disproven and recorded). **Zero blocking**, zero
`won't fix (frontier)`, zero `closeout (re-litigation)`, zero `blocked`. No finding touched the
decision, the owner's rulings, or any ND transcription. Nothing suppressed as settled. Round 2 is
warranted only if the reviewer disputes R6's disproven leg or a **new** defect appears.

## Accepted residuals (shared, do-not-re-litigate)
- _(none)_ — no finding this round was a confirmed intended tradeoff. Six were fixed outright; R6's
  disproven leg is recorded in its row, not carried as a residual.
