# Decision report — should the numeric prefix be dropped from task-folder names?

- **Date:** 2026-07-26
- **Task:** [`0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names`](../../tasks/done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/brief.md) (Sprint 2, priority 103)
- **Author:** fkit-architect
- **Status:** **recommendation made and owner-ruled; revised after round-1 review.** The owner ruled
  **Option C** on 2026-07-26, before this report was written, in answer to the one question the
  investigation could not settle from evidence (see §1).
- **Revisions:** **round 1 (2026-07-26)** — reviewed by fkit-reviewer + Codex (`codex-cli 0.145.0`,
  both passes complete). Verdict *⚠️ changes requested, 8 defects (2 high), none challenging the
  ruling.* Both load-bearing claims — the `task_id()` parser behaviour and the 130-row prefix-strip —
  were **reproduced by independent execution**, as was the decisive step-1 finding. Repaired here:
  **R1** (§7.1 rewritten — Option D is 35% shipped, not disproved, and is now an owner-ruled
  complement in §8), **R2** (§8 gains the `SKILL.md` narration contract and the guard test; §6
  addresses the ⚠️ ORDER MATTERS warning it had omitted), **R5** (citation convention, above).
  **R3/R4/R6/R7** accepted as residuals in §11.1; **R8** is a producer-owned board edit.
- **Weighs against:** [ADR-029](../decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)
  Decisions 5 and 6, and the folder-migration task — folder **`0062`**, priority **76**, referred to
  across the repo and in ADR-029 as *"task 76"*
  ([`0062-migrate-tasks-to-folder-structure-and-update-tooling`](../../tasks/done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md)).
- **Blocks / feeds:** folder **`0103`** (priority **104**)
  ([`0103-implement-task-folder-name-scheme-change`](../../tasks/done/0103-implement-task-folder-name-scheme-change/brief.md))
  — **rescoped, not cancelled.** See §8.

> **Citation convention used in this report** *(added in round 1, review finding R5)*
>
> Every task is cited as **folder `NNNN` (priority N)** on first mention. Where an existing artifact
> calls something *"task 76"* it is quoted as written and glossed, because ADR-029 and several
> `dashboard.sh` comments use that name and searchability matters.
>
> **Round 1 caught this report committing the exact conflation it documents:** it called the migration
> *"task 76"* by **priority** and its follow-up *"task 79"* by **folder ID** — folder `0079`'s priority
> is **77**, and a reader applying the first convention to the second name lands on folder `0022`
> (priority 79), an unrelated task. Verified and corrected throughout. Recorded rather than quietly
> fixed, since a report arguing that two number-spaces are confusable is the last document that should
> confuse them.

> **The decision, in one line:** **keep** the `<NNNN>-` prefix on task-folder names; fix the confusion
> on the **priority** side instead, by finishing the `dashboard.sh` change ADR-029 Decision 6 already
> authorised and never landed, and by rendering the board's priority cell as a non-integer rank token.

---

## 1. The owner's ruling, and the question that produced it

The investigation established that the owner's complaint — *"a task carries two different numbers"* —
was real (§4) but that the folder prefix was not its cause (§5). That left exactly one question the
evidence could not answer, because it turns on intent rather than fact:

> Is the objection **functional** (the two numbers are ambiguous and cause errors) or **aesthetic**
> (I do not want to read `0102-decide-whether-…` in a path)? If aesthetic, no amount of priority-side
> cleanup satisfies it and the honest answer is the full 152-folder rename.

**The owner's answer (2026-07-26): the objection is FUNCTIONAL, not aesthetic. Option C.**

The owner explicitly accepted the two things Option C does **not** fix:

- folder paths still read `0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names`;
- `## ID` remains, so a task still has **two ID carriers**, exactly as ADR-029 Decision 8 requires.

**That trade is settled and is recorded here as an accepted consequence, not re-argued.**

---

## 2. What the folder-name number actually buys

The brief asks this first. Each claimed benefit, and whether `## ID` alone could carry it:

| Benefit | Real? | Could `## ID` alone carry it? |
|---|---|---|
| **Identity** — an unambiguous handle across sprints and boards | Yes | Yes, but only by opening the file. The folder name carries it in every `ls`, every path, every href, every grep hit. |
| **Sortability** — lexical sort equals numeric sort (ADR-029 Decision 3) | Yes | **No.** Directory listings sort by name. Without the prefix, `ls` orders by slug, and allocation order becomes invisible. |
| **Link-recovery key** — `dashboard.sh:597-609` scans the three boards by folder name to relocate a moved task | Yes | Partially. The *slug* alone is still unique today (§6, step 4) so recovery would still function — but the key becomes a mutable string again, which is the failure ADR-029's Context was written to end. |
| **Collision visibility** — a duplicate ID is visible as two same-prefixed folders | Yes | **No.** It would be visible only to the `node --test` guard (`test/task-id-uniqueness.test.js`), never to a human reading the tree. |
| **The second carrier** — the half of ADR-029's *"two carriers, no third"* that `id-mismatch` reconciles | Yes | **No, by definition.** Dropping the prefix leaves one carrier and deletes the reconciliation. |

**Finding:** the prefix carries four things `## ID` cannot, and three of them (sortability, collision
visibility, the second carrier) have no replacement mechanism proposed anywhere.

---

## 3. What the tooling actually does — measured, not assumed

The brief's Context asserts three coupling points and treats them as near-fatal. **Two of the three
are overstated.** Executed evidence:

| Coupling point (brief's claim) | Actual |
|---|---|
| **1. The folder name is the authoritative ID carrier** (ADR-029 Decision 5) | **Confirmed.** `dashboard.sh:630-646` reconciles brief `## ID` against `folder_id=${folder%%-*}` (`:638`). |
| **2. `dashboard.sh` uses the folder name as identity + link-recovery key** | **Overstated.** The folder name is the **fallback** identity (`:561-562`), not the primary. The primary is the **Priority cell** (`:519` → `task_id()` at `:481-483`). Link recovery does key on the folder (`:597-609`) but works fine on an unprefixed, still-unique folder name. |
| **3. Both movers grep `<NNNN>-<slug>`** | **Overstated.** `fkit-task-done/SKILL.md:92,107-120` and `fkit-task-cancelled/SKILL.md:92,110-123` grep the folder name as a *token*. An unprefixed slug is still unique across all 152 folders (§6 step 4), so the grep still resolves. |

**So a prefix drop is far more nearly cosmetic in the tooling than the brief supposed — exactly one
line actually breaks** (`dashboard.sh:638`), plus the deliberate deletion of the `id-mismatch` check.
This finding *weakens* the case against Option B and is recorded here rather than suppressed. It is
not, in the end, what decides the question — cost (§7) and causation (§5) do.

### 3.1 The load-bearing discovery: ADR-029 Decision 6 never landed

ADR-029 Decision 6 states the gain plainly:

> `dashboard.sh` currently reverse-engineers an identifier out of the **Priority cell** … Reading the
> ID from the folder name collapses that to one unambiguous lookup.

It does not. `dashboard.sh:519` still reads `tid=$(task_id "$pr")` — `$pr` is the Priority cell — and
the folder name is consulted only at `:561-562` when that yields no digits. The design report behind
ADR-029 listed this as **site 5 of five** required `dashboard.sh` changes, and flagged it as failing
**silently**:

> `| 5 | :451-453, :506-529 id derivation | Priority cell → filename stem → ? | the ID from the folder name — §3.7 | **silently** |`
> — [`2026-07-19-design-task-folder-structure-and-id-scheme.md:623`](2026-07-19-design-task-folder-structure-and-id-scheme.md)

**The tooling still treats the mutable board rank as the task's identity.** That is the two-numbers
problem expressed in code, and no folder rename touches it.

---

## 4. Is the confusion real, or theoretical? — Real, and measured

Evidence, all from the live tree:

1. **A live integer collision on the same board.** `sprint-2.md:135` is **priority 103 → folder
   `0102`**; `sprint-2.md:136` is **priority 104 → folder `0103`**. Folders `0103` and `0104` both
   exist and are *different tasks* from priorities 103 and 104. A bare "103" is genuinely ambiguous.
2. **A workaround notation invented to cope.** `ai-agents/sprints/sprint-2.md` carries **33**
   instances of an ad-hoc `priority (folderID)` form — `99 (0117)`, `107 (0124)`, `144/0145`, … .
   Nobody mandated it; it exists because bare integers do not disambiguate.
   **⚠️ The count 33 is qualified — see §11.1 (R6).** The `144/0145` exemplar is misquoted and is not
   a genuine instance; the true count of priority→folder-ID mappings is lower and unmeasured. Cite
   this exhibit for the notation's **existence**, never for its magnitude.
3. **The confusion has already produced incorrect prose.** `sprint-2.md:570` reads
   *"**104** (was `0103`)"* — treating a permanent folder ID as a former priority. It never was one:
   on the Backlog board that row's priority cell was `—` (`ai-agents/sprints/backlog.md:47-48`). This
   is the confusion materialising as a factual error in a maintained artifact, written by someone who
   knew the rule.
   **⚠️ This reading is disputed — see §11.1 (R3).** The same construction appears twice
   (`:566`, `:570`), which supports a competing reading as deliberate *"was referred to as"* notation.
   **Do not cite exhibit 3 on its own as proof of harm.**

**Verdict: not theoretical — carried by exhibits 1 and 2, which are unqualified.** Exhibit 1 in
particular is a plain, verified collision and needs no interpretation.
The board was also re-ranked twice on the day this was investigated —
priorities moved while folder IDs did not, which is the divergence working exactly as designed and is
precisely why the two number-spaces must not look alike.

---

## 5. Why the prefix is not the cause

The complaint is *"two numbers that do not match."* Dropping the prefix does not produce one number:

- `## ID` stays on **all 152 briefs** (verified: 152/152 carry the field). ADR-029 keeps it.
- The `103` vs `0103` collision (§4.1) lives in **prose and `## ID`**, not in the folder name. It
  survives the rename untouched.
- The 33 workaround notations (§4.2) are in **sprint-plan prose**. They survive too.

So Option B removes the *visible half of the symptom* and pays 152 folder renames for it, while the
ambiguity that generates the errors continues.

**Which number is the accident?** The **priority**. It is mutable board rank, re-ranked twice in a
single day; the ID is permanent identity that must never move (ADR-029 Decision 3). Renaming the
permanent identifier to resolve a collision caused by the mutable one is fixing the wrong end.

---

## 6. Verification performed

Four checks were run, not reasoned about. All on 2026-07-26 against the live tree.

**Step 1 — was the Decision-6 gap deliberate or unfinished? → Unfinished. Decisive.**
The migration's plan section B (folder `0062`, priority 76 — `0062-…/plan.md:47-58`) enumerates its
`dashboard.sh` work: re-derive `found_dir`, re-key link recovery, add `id-mismatch`, add
`malformed-folder`. **Site 5 — the Priority-cell id derivation — is absent.** No mention of
Priority-cell identity appears anywhere in folder `0062`'s brief, plan, worklog or review, nor in the
four artifacts of its link-repair follow-up, **folder `0079` (priority 77)**. There is no ruling to
keep it; it was simply dropped between design and plan. **Consequence: Option C implements ADR-029
Decision 6 as already written, and needs no new ADR.**

*(Round 1 independently re-verified this finding by execution — site 5 absent from `0062-…/plan.md:47-58`,
zero Priority-cell mentions across all eight artifacts.)*

*Why it went unnoticed:* the design predicted site 5 would fail silently, producing the literal string
`brief` as the id for every unranked row. The coder did fix that symptom — `:561-562` falls back to
the **folder name** rather than the filename stem, and `:548-550` documents exactly why. The
*mitigation* landed; the *required change* did not. The paper-over is what hid the gap.

> ⚠️ **The adjacent comment argues against this report's recommendation, and round 0 omitted it.**
> Review finding **R2**; quoted here in full, verified verbatim at `dashboard.sh:552-553`:
>
> > `⚠️ ORDER MATTERS: a numbered plan keeps numbering. This is a fallback, not a replacement —`
> > `changing sprint plans to filename ids would break every `drift on tasks 59, 60` reference the`
> > `skill narrates.`
>
> Quoting `:548-550` as support while skipping `:552-553` was selective. **Addressed, not explained
> away:**
>
> - **The hazard it names does not fire for Option C.** The warning is about substituting **filename
>   ids** — non-numeric slug stems. C substitutes the **folder ID** (`0102`), which is numeric, a
>   single token, and already sanitised. The `key="value"` grammar, the positional FACTS emission and
>   the `sort -n | uniq` roll-up (`:887`) are all unaffected.
> - **But its underlying point stands and is conceded:** the comment asserts numbering-by-priority is
>   *deliberate*, not incidental. C changes what that number **means** — `drift on tasks 59, 60`
>   becomes `drift on tasks 0044, 0051`. That is a real, intended change to a documented narration
>   contract, and it is exactly why §8 now carries `SKILL.md:299-304` and the guard test as required
>   work rather than leaving 0103 to discover them.
>
> The comment is therefore evidence that site 5 was **left** deliberately-looking, not that it was
> **ruled on**. Step 1's finding is unchanged: no ruling exists in any of folder `0062`'s or folder
> `0079`'s eight artifacts.

**Step 2 — does a prefix drop break `dashboard.sh`? → Yes, 130/130 rows. Demonstrated.**
The full `ai-agents/` tree was copied to a scratch directory, all **152** folders renamed to strip the
prefix, and the sprint-plan hrefs rewritten. Baseline before the strip: **exit 0, zero drift facts.**
After the strip: **exit 0, and 130 `id-mismatch` drift facts — one for every row on the board.**

```
drift id-mismatch 1 brief_id="0038" folder="extract-scaffold-into-claude"
drift id-mismatch 2 brief_id="0019" folder="build-claude-self-update"
drift id-mismatch 3 brief_id="0060" folder="make-codex-a-checked-prerequisite"
```

`${folder%%-*}` yields the first slug word (`extract`), which never equals the `## ID`. Note the fact
ids — `1`, `2`, `3` — are **priorities**, confirming §3.1 independently.

*Incidental finding, worth having:* an intermediate run renamed the folders but left the hrefs stale,
and produced **130 `missing-brief` drift facts**. A half-executed rename therefore fails **loudly**,
not silently. That is the good case, and it lowers the risk of Option B — recorded for completeness.

**Step 3 — is a `P103` priority cell backward-compatible with the existing parser? → Yes. Executed.**
`task_id()` (`dashboard.sh:481-483`) is `sed -n 's/^[^0-9]*\([0-9][0-9]*\).*/\1/p'`. Run directly:

| cell | parsed `tid` | | cell | parsed `tid` |
|---|---|---|---|---|
| `103` | `103` | | `—` | *(empty)* |
| `P103` | **`103`** | | `Unscheduled` | *(empty)* |
| `#103` | `103` | | `8 (optional)` | `8` |
| `P8 (optional)` | `8` | | `P0103` | `0103` |

**The `P` prefix is absorbed by the existing `^[^0-9]*` clause. No parser change is required for the
rendering half of Option C** — the recommendation's central mechanism is confirmed by execution.

**Step 4 — do slug and ID uniqueness still hold across the current corpus? → Yes.**
152 folders; **0** duplicate slugs after stripping prefixes; **0** duplicate IDs. Re-verified now
rather than inherited from ADR-029 Decision 4, since uniqueness is a property of the corpus, not a
permanent truth.

---

## 7. The options, and the honest cost of each

| | Option | What changes | Cost | What it actually fixes |
|---|---|---|---|---|
| **A** | Keep the prefix, change nothing | — | 0 | Nothing. The `priority (folderID)` workaround notations keep accruing (§4.2). |
| **B** | **Drop the prefix** (the owner's original suggestion) | 152 folder renames; ~416 tracked reference lines; 135 wiki-vault lines (wiki role only); delete `dashboard.sh:630-646`; rewrite `<NNNN>-<slug>` across 36 files / 92 mentions; **ADR-029 Decision 5 reversed → one carrier** | **Very high, and growing ~10 folders/day** | Removes one number from the folder name. Does **not** remove the second carrier, the `103`/`0103` collision, or the prose ambiguity (§5). |
| **C** | **Keep the prefix; disambiguate the priority + finish ADR-029 Decision 6** ✅ **CHOSEN** | `dashboard.sh`: folder ID becomes the primary FACTS id, priority demoted to fallback (`:519`, `:561-562`); board priority cell renders `P103` (parser-compatible — §6 step 3); tests updated | **Low.** ~15 lines of shell + two sed passes over the sprint plans + test updates. **Zero folder renames, zero link rewrites, zero wiki churn.** | Removes the *ambiguity*: the two number-spaces stop looking interchangeable, and the tooling stops treating mutable rank as identity. |
| **D** | Surface the folder ID in the board row | **35% shipped** — 45 of 130 rows | Low | Partial today. **Owner-ruled a complement to C, added to 0103's scope.** See §7.1. |
| **E** | Documentation only | One convention page | Trivial | Partial — a written rule does not make two adjacent bare integers distinguishable at a glance. **E is a component of C, not a rival to it.** |

### 7.1 Option D is 35% shipped — a complement to C, not a rival and not disproved

> ⚠️ **This section was wrong in round 0 and is rewritten.** It claimed *"**Every** Task cell already
> renders the folder name in full"* and concluded **"Option D is disproved, not deferred."** The
> premise is false and the conclusion did not follow from it. Review finding **R1** (high, raised
> independently by both reviewers); corrected here.

The brief proposes this as a leading cheap alternative:

> *"Surface the folder ID in the sprint board's row so `78` and `0099` are visibly the same task,
> instead of renaming anything."*

**Measured, not asserted.** Of the **130** board data rows in `sprint-2.md` that link a brief:

| Visible link label | Rows | Share | Example |
|---|---|---|---|
| Shows the folder ID — `` [`0102-decide-…`] `` | **45** | 35% | `sprint-2.md:135` |
| Legacy slug-only stem — `` [`extract-scaffold-into-claude.md`] ``, folder ID **hidden in the href** | **85** | 65% | `sprint-2.md:33-38` |

*(A 131st brief link exists in prose at `sprint-2.md:1820` and is not a board row.)*

**So Option D is implemented for barely a third of the board.** The example cited in round 0
(`sprint-2.md:135`) is drawn from the 35% minority and was generalised to "every" — the single worst
error in this report, because it turned a *partially-built* option into a *failed* one and retired it.

For the 85 legacy rows the reader sees a slug and a priority, and the folder ID appears **only** if
they hover or open the link. The §4 confusion is therefore entirely consistent with D simply **not
being finished** — no disproof is available from the evidence, and none is claimed.

> **Owner ruling (2026-07-26): D is a live complement to C, and label normalisation is added to
> `0103`'s scope.** Recorded as a ruling, not re-argued.
>
> The two attack the confusion from opposite ends and are **not mutually exclusive**:
> - **C** makes the two number-spaces **typographically distinct** (`P103` rank vs `0102` identity), so
>   they can no longer be mistaken for one another.
> - **D** makes the folder ID **visible on all 130 rows** instead of 45, so the identity is present
>   wherever the reader already is.
>
> C alone leaves 85 rows showing no ID at all. D alone leaves two bare integers adjacent — which is
> the state that produced §4's errors. Together they close both halves.

### 7.2 The cost of a second migration, priced

| | Count |
|---|---|
| Task folders to rename | **152** (31 backlog / 110 done / 11 cancelled) |
| Tracked non-wiki lines containing a numeric task path | **281** |
| Wiki-vault lines containing a numeric task path | **135** |
| **Total tracked reference lines** | **~416** |
| `NNNN` convention mentions across skills/docs/tests | **92**, in 36 files |

Growth, measured from git at four commits:

| Date | Task folders | Non-wiki ref lines |
|---|---|---|
| 2026-07-23 | 121 | 219 |
| 2026-07-25 | 136 | 257 |
| 2026-07-26 (HEAD) | 146 | 281 |
| 2026-07-26 (worktree) | **152** | — |

**~10 folders and ~20 reference-lines per day.** ADR-029 priced the *original* migration at 94
folders / ~309 links. A rename today is **1.6× the folders and ~1.35× the tracked links of the
migration it would partially undo** — and it grows past that every day the decision waits.

*(A worktree grep returns 443 non-wiki lines against git's 281; the difference is the gitignored
`.claude/` mirror. The tracked figure is reported. See §11 on the ±1 reproducibility residual — the
ratios above are unaffected.)*

> **These figures are slightly UNDERSTATED — raised in round 1 and verified.** The board-row counts
> above cover `sprint-2.md` only. **`backlog.md` carries a further 16 rows** linking numeric task
> folders (verified: 16), so the row-level blast radius is **146**, not 130.
>
> This cuts **against Option B**, the option *not* chosen — a prefix drop would have to repair 16 more
> rows than priced. It therefore **strengthens** the recommendation rather than qualifying it, and is
> recorded for that reason: an error in the losing option's favour is the one most worth correcting.

### 7.3 Weighing against the folder migration specifically — folder `0062` (priority 76)

The brief requires this be faced, not planned around. That migration — folder `0062`, priority 76,
called *"task 76"* in ADR-029 — moved 94 folders, 138 files and ~309
links in a single atomic commit, and **remains `agent-closed — not owner-verified`.** Option B would
partially undo it within days, at 1.6× its size, before anyone has confirmed it landed correctly.

**That is not the deciding argument — cost alone never justifies keeping a wrong design.** It is
decisive here only because §5 shows Option B does not fix the stated problem. Paying 1.6× a migration
to not-fix a problem is the combination that settles it.

### 7.4 Weighing against ADR-029 Decision 5 specifically

**ADR-029 Decision 5 is upheld, not amended.** The folder name remains authoritative; `## ID` remains
the second carrier; the `id-mismatch` drift check at `dashboard.sh:630-646` stays. Decision 8's
*"two carriers, no third"* is preserved intact.

For the record, had the recommendation gone the other way: ADR-029's own **"Re-raise only if"** clause
licenses this question — its first bullet admits re-raising when *"the folder layout is proposed to
change again."* Task 0102 was therefore legitimate, not a re-litigation. Option B would have required
a **superseding ADR** (precedent: ADR-033 superseding ADR-025), not an amendment, because it reverses
a decision and deletes a drift check. Option C needs neither — see §9.

---

## 8. What task 0103 receives

> **Task 0103 is RESCOPED, not cancelled.** Its board row (`sprint-2.md:136`) currently flags it as a
> cancellation candidate on the assumption that "keep the number" ends the work. **It does not.**
> Under Option C there is real implementation work, just not a rename.

0103's new scope, in full. **Items 4 and 5 were missing in round 0 (review finding R2) and are the two
most likely to bite 0103 in flight; item 6 is the owner's ruling from §7.1.**

1. **`dashboard.sh` — make the folder ID the primary task identity.** Invert `:519` and `:561-562` so
   the folder-name ID prefix is the primary `tid` and the Priority cell becomes the fallback. This
   completes design-report site 5 and ADR-029 Decision 6. Keep the `?` sentinel and the `set -f` glob
   guard (`:34-40`) — the design report is explicit that both stay regardless.
2. **Render the priority cell as a rank token.** `P<n>` in the sprint-plan boards. **No parser change
   is needed** — verified by execution (§6 step 3). Applies to `ai-agents/sprints/*.md` and to
   `fkit-task-brief` / `fkit-producer` so newly written rows use the form.
3. **Tests.** `test/dashboard-contract.test.js` pins FACTS ids that are currently priorities
   (e.g. `:263`); these change meaning under step 1 and must be updated deliberately, with a red-proof
   that the new id genuinely comes from the folder.
4. **⚠️ Rewrite the documented narration contract at `claude/skills/fkit-status/SKILL.md:299-304`.**
   Verified verbatim — it currently instructs the reader that `<task>` **is the Priority number**:

   > *"`<task>` is not always a number. It is the Priority number when the board has one, and the
   > brief's filename stem when it does not … **Narrate whichever form you were given** … do not
   > translate it into a number."*

   Option C **inverts this contract.** It is prose, not code, so nothing fails if it is missed — the
   skill simply narrates a rule that is no longer true. **This is the single most missable item in the
   handoff**, which is why it is called out rather than left to discovery.

5. **⚠️ `test/dashboard-contract.test.js:1655-1664` will go RED, and that is correct.** The test is
   named *"task 68: a numbered sprint plan still keys FACTS by number, not by filename"* and asserts
   `drift nonconformance 7` — i.e. that the **priority** wins over the folder. Verified verbatim.

   > **Implementing Option C will turn this test red for the right reason. It is not a regression.**
   > It encodes the pre-C contract and must be **deliberately re-pointed** to assert the folder ID
   > wins, with its name (`:1657`) and its two ⚠️ header comments (`:1655-1656`) updated in the same change.
   > A red bar here is the change working. Do not "fix" it by reverting step 1.

6. **Normalise the board's link labels — Option D, owner-ruled into scope (§7.1).** 85 of 130
   `sprint-2.md` rows (and any equivalents in `backlog.md`'s 16) render a legacy `slug.md` stem that
   hides the folder ID in the href. Normalise all rows to the `` [`NNNN-slug`] `` form so the ID is
   visible on **every** row, not 35% of them. This is label-text only — **hrefs already resolve
   correctly and must not be touched.**

7. **Do NOT rename any folder, rewrite any href, or touch the wiki vault.**

**What 0103 must not re-decide:** whether to keep the prefix (settled here, owner-ruled), and the
accepted consequences in §1.

---

## 9. The convention page — deliberately not written here

Option C's rule — *priority is board rank, never identity* — is a natural convention, and the plan for
this task anticipated writing one at
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`. **It is not written**, for
two reasons drawn from the conventions folder's own law
([`conventions/README.md`](../conventions/README.md)):

1. **A convention is "prescriptive and current."** The `P103` rendering does not exist yet — it is
   0103's work. Writing it now would put all 130 board rows in violation of a rule on the day it was
   filed, and assert as in-force something that is not.
2. **"A *new* convention is a rule imposed on every future run, so it needs the owner's sign-off."**
   The owner ruled on **Option C the decision**; they were not asked to enact a new standing law. That
   is a separate consent.

**Recommendation:** 0103 writes the convention **in the same change that lands the rendering**, with
the owner's explicit sign-off, dual-homed into `claude/scaffold/ai-agents/knowledge-base/conventions/`
per `dual-home-parity.md`, and added to the `README.md` index table.

> **Owner ratification (2026-07-26).** The owner was asked whether withholding the convention page was
> the right call and **ratified it.** The page stays unwritten until `0103` lands the rendering it
> would describe. Round 1 separately recorded its absence as *"deliberate and reasoned … not an
> incompleteness defect."*

---

## 10. Accepted consequences

Recorded as decided, per the owner's ruling (§1) — not open items:

- Folder paths remain long and numbered. `0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names` stays exactly as it reads.
- A task still has **two ID carriers** (`## ID` + folder name). This is ADR-029 Decision 8 working as designed, not a defect.
- The **existing `priority (folderID)` notations are frozen history and must not be mass-edited**
  (reported as 33; magnitude qualified by §11.1 R6). They were correct when written and remain
  readable. Under `P103` the notation simply becomes unnecessary going forward; existing prose is
  left alone.
- The `id-mismatch` drift check and its one-line prefix parse (`dashboard.sh:638`) are retained.

## 11. Residual risks and open items

- **The `P` prefix is untested in the movers' greps.** Both movers parse sprint-plan rows to find and
  rewrite status cells. Step 3 verified `dashboard.sh`'s parser only. **0103 must verify
  `fkit-task-done` and `fkit-task-cancelled` against a `P103` cell** before the rendering lands.
- **`P` is one candidate token, not a ruling.** `#103`, `rank 103` and dropping the integer entirely
  (row order already encodes rank) were not compared on their merits. `P103` is recommended because it
  is confirmed parser-compatible and minimal. **0103 may substitute an equivalent non-integer token.**
- **ADR-029 needs no edit, but its Decision 6 currently overstates reality** — it describes the
  Priority-cell simplification in the past tense. Once 0103 lands, that becomes true. **No correction
  is proposed** (and none was made — editing an accepted ADR is out of this task's scope). If the gap
  is to be recorded before 0103 ships, task 0143's dated-correction-note form is the right vehicle.
- **Folder `0062` (priority 76) remains `agent-closed — not owner-verified`.** This report does not
  change that, and the verification gap is independent of this decision.

### 11.1 Accepted residuals from round 1 — owner-ruled *record, do not repair*

Four review findings were verified as **correct or partly correct** and ruled **accepted residuals**
by the owner on 2026-07-26. They are recorded with re-raise conditions rather than fixed, because each
weakens a *supporting exhibit* without touching a conclusion.

- **R3 (med) — §4.3's "incorrect prose" exhibit has a competing reading that is not acknowledged.**
  Verified: the same construction appears **twice**, at `sprint-2.md:566` (*"**103** (was `0102`)"*)
  and `:570` (*"**104** (was `0103`)"*), with the IDs backticked as ID tokens. Two consistent uses
  plausibly read as a deliberate *"was referred to as"* notation, not a slip. §4.3 cites one instance
  and asserts error without noting the alternative. **§4's conclusion is unaffected** — it rests on
  exhibits 1 and 2 (the live `103`/`0103` collision and the 33 notations), both independently
  verified. **Re-raise if** the exhibit is ever cited on its own as proof of harm.
- **R4 (med) — the brief required evaluating "drop the sprint-priority number instead", and this
  report did not.** Verified against the brief (`:70-72`): it asks that the alternative be *"surfaced
  and evaluated."* §5 answers *which* number is the accident (the priority) but §7's A–E table has no
  option row for dropping it, and §11 concedes the integer-drop variant was never compared on merits.
  **This is a genuine gap in required coverage, disclosed rather than hidden. It was NOT evaluated in
  round 1 either** — the owner ruled to record the gap, not to close it now. **Re-raise if** `0103`
  finds `P<n>` unworkable, at which point dropping the integer becomes the live fallback and must be
  evaluated properly.
- **R6 (low) — §4.2's `144/0145` exemplar is misquoted and misclassified.** Verified: the file reads
  `0144/0145`, and at `sprint-2.md:190` and `:320` it denotes a **folder-ID pair** (`0144` *and*
  `0145`), not a priority→folder-ID mapping. Only `:354` is a genuine mapping. The count **33**
  reproduces only under a loose regex that sweeps in such non-instances, and **no defining command was
  published** — so the true count of genuine mappings is lower than 33 and remains unmeasured. **§4's
  conclusion survives** on the live collision and the *existence* of the notation. **Re-raise if** the
  number 33 is ever used as a magnitude rather than as evidence the notation exists.
- **R7 (low) — §7.2's reference-line figures are not reproducible as stated.** Two reviewers
  independently obtained **218 / 256 / 280** where this report published **219 / 257 / 281**, and
  **426** live tracked lines against the reported **~416**; the parenthetical worktree figure of 443
  did not reproduce (Codex `rg`: 310). Re-running my original command still returns my figures, so the
  gap is a **methodology difference, not a demonstrated arithmetic error** — but R7's substantive
  point is **conceded in full: the report published counts without publishing the command that
  produces them**, which is what makes them irreproducible. The `92 NNNN mentions` label is likewise
  scoped as *"skills/docs/tests"* when the count is repo-wide **including `wiki-vault/`**.

  > **Explicitly: the trend and the 1.6× / 1.35× conclusions are UNAFFECTED.** A ±1 per-commit
  > discrepancy across figures of 218–281 cannot move a ratio quoted to two significant figures, and
  > the growth direction (~10 folders/day) is identical under both counts. **This residual is about
  > reproducibility, not about the cost case.** §7.2's separate *understatement* correction (16 further
  > `backlog.md` rows) moves the figures **against Option B**, the option not chosen.

  **Re-raise if** any of these counts is reused outside this report, in which case publish the exact
  command alongside it.

**R8 (low) — the missing board-row link to this report — is not addressed here.** It is a sprint-plan
edit (`sprint-2.md`), which is producer-owned; a producer is making it. Recorded so the gap is not
mistaken for an oversight.
- **This report has had no adversarial pass.** One is expected after return, per the brief's note that
  the reversal of a recently-locked decision warrants one — noting the outcome *upholds* ADR-029
  rather than reversing it, which lowers but does not remove the need.
