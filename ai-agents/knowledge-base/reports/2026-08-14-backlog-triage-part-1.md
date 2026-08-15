# Backlog triage — part 1 of 4 (the 27 oldest open rows)

Triage of the 27 oldest open backlog rows — `0013` through `0172` — run 2026-08-14 against HEAD
`4424b44` (v0.2.2, no active sprint). **Counts: `KEEP` 22 · `STALE-PREMISE` 5 · `SUPERSEDED` 0 ·
`DONE-IN-FACT` 0 · `DUPLICATE` 0 · `UNCLEAR` 0.** The five stale-premise rows are `0037`, `0045`,
`0152`, `0154` and `0171`; in every one the *work* still stands and only the brief's framing has
moved, so none is a cancellation proposal on staleness alone. Nothing in this batch was found already
done, and no two rows cover the same work. Every verdict was checked on disk, which is why there is no
`UNCLEAR` — where a row's own citations had drifted I re-derived the fact rather than guessing.
**The `size` column is a rough estimate, not a measurement** — `S`/`M`/`L` is my judgement of effort
from the brief's stated scope, with no plan written and no code read end to end. Two dependencies in
this batch turned out to be **discharged** while their rows still read as blocked (`0168` on `0160`,
`0046` on task 36) — see *Cross-cutting observations*.

| id | verdict | theme | size | depends | evidence |
|---|---|---|---|---|---|
| 0013 | KEEP | conventions | M | none | `ai-agents/knowledge-base/conventions/evidence-before-assertion.md` still has only four headings — `## The rule`, `## Where this must be enforced`, `## Related`, `## Provenance`. No worked-example section exists; both examples the brief scopes are unwritten. |
| 0037 | STALE-PREMISE | testing | M | none | Brief: *"Its two current mutations are **both** against the launcher (`:86-111`)"*. `test/prove-red.sh` is now 64 KB and carries **22+** mutations plus a third seam, `FKIT_RELEASE_MJS` (`:50-51`, task 0288). The gap itself survives intact: `export const INIT = join(REPO, 'claude', 'fkit-claude-init.sh')` at `test/harness.mjs:160`, hardcoded, and `FKIT_INIT` appears nowhere in the repo. Re-scope the context paragraph; the deliverable is unchanged. |
| 0045 | STALE-PREMISE | launcher | S | none (gated on "task 28") | Two dead assumptions. (1) Brief: *"Nothing does this today — the hazard is latent, not live."* Init **does** read inside `$dest/ai-agents/` now — `ko="$aa/.fkit-keep-out"` at `claude/fkit-claude-init.sh:96` — and that read is already `[ -L ]`-guarded at `:105-106`. (2) Its gating task, *"task 28 (additive convergence walks and reads the tree)"*, is pre-migration numbering: `0028` today is `ai-agents/tasks/cancelled/0028-design-ship-loop-timeout-auto-proceed`, and the convergence work is `ai-agents/tasks/done/0023-converge-ai-agents-additively-on-launch` — **already shipped**, without the guard. Same for *"task 27"* (`0027` is the cancelled git-agent design). |
| 0046 | KEEP | launcher | S | task 36 = `0072` (soft) — **discharged** | Hazard is live and ungated: `mkdir -p "$dest/.fkit"` then `cat > "$dest/.fkit/interview"` at `claude/fkit-claude-init.sh:496-497`, with no `[ -L ]` test — while the same file guards every other write in exactly that form (`:167`, `:382-383`, `:467`). Its soft dependency *"task 36 (`remove-fkit-omnigent-orphan-residue`)"* resolves to `ai-agents/tasks/done/0072-remove-fkit-omnigent-orphan-residue` — **closed**, so nothing blocks it. |
| 0121 | KEEP | agent-design | L | none | `grep -rln "SkillOpt\|observer-agent" claude/ ai-agents/knowledge-base/` returns nothing — no design, ADR or skill exists. Brief's own `- **Depends on:** nothing — the design can start now.` still holds. Its external premise (Claude Code observer agents, Microsoft SkillOpt) is the thing the task investigates, so it cannot go stale by being unverified. |
| 0131 | KEEP | process | S | none | `claude/skills/fkit-task-brief/SKILL.md` has **zero** hits for `dual-home`, `both copies` or `scaffold` — the ADR-027 §1 scoping check was never filed and still is not there. Brief: `- **Depends on:** nothing.` |
| 0134 | KEEP | process | M | none (blocks `0135`) | The ADR does not exist — `ai-agents/knowledge-base/decisions/` runs to ADR-043 with no half-landed-close entry. Its recorded overlap partner `0229` is still open at `ai-agents/tasks/backlog/0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close`, so the owner's *"Ship 0229 standalone"* ruling is un-executed and the ordering the row describes is intact. |
| 0135 | KEEP | process | L | `0134` (open) + `0124` (**discharged**) | Brief `:92`: `- **Depends on:** **0134** (the ADR — hard…)`. `0134` is still in `backlog/`, so this stays blocked. Its second dependency `0124` is now `ai-agents/tasks/done/0124-revert-task-movers-to-producer-only` — discharged. The file-collision partner `0229` has still not shipped, so the *"read what 0229 wrote"* obligation is not yet reachable. |
| 0137 | KEEP | conventions | M | none | `ai-agents/knowledge-base/conventions/` holds nine files; none is `verify-against-the-claim.md`. Brief `:158-159`: `- **Depends on:** nothing.` / `- **Blocks:** nothing.` |
| 0138 | KEEP | conventions | M | none | Same directory listing — no `disproof-carries-the-higher-bar.md`. Brief `:133-134`: `- **Depends on:** nothing.` / `- **Blocks:** nothing.` |
| 0144 | KEEP | testing | M | none | `test/launcher-contract.test.js` is 297 lines and contains **zero** occurrences of `team` — the rejection is still wholly untested. The behaviour it would pin is live: `claude/fkit-claude.sh:201` reads *"⚠️ `team` / `team room` are NOT accepted — not here, and not at the menu either."* |
| 0145 | KEEP | testing | L | none | `grep -rn "pty\|node-pty" test/` returns no pty infrastructure — every hit is an unrelated word match. The menu picks 1-7 remain uncovered and the new-harness cost the brief describes is unpaid. |
| 0146 | KEEP | docs | S | none | The false residual is still on disk verbatim: `ai-agents/tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/review.md:287` — *"and `team room` are accepted **only** as menu picks, exactly as before this task."* The launcher's actual menu arm still disagrees with it. |
| 0149 | KEEP | docs | S | none | The stale prediction is still on disk: `ai-agents/tasks/done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md:84` reads `- **Blocks:** 0117 (wiki ingest must ingest the *amended* ADR-032 — the amendment lands before 0117 runs)`. The brief's own `:84` citation is still exact. Owner is `fkit-producer`. |
| 0152 | STALE-PREMISE | testing | S | none | Two assumptions gone. Brief/row: *"skill-file content is an entirely untested surface — **no test in the repo reads any `SKILL.md`'s content**"* — false since 0136 shipped: `test/skill-frontmatter.test.js:303` walks every `skills/*/SKILL.md`. And *"**25** files, not 26"* — there are **26** skill directories today. The guard itself is still unbuilt and would still be green day one: no `SKILL.md` H1 in `claude/skills/` uses the owner banner as its title. |
| 0154 | STALE-PREMISE | testing | M | soft-follows `0153` (**discharged**) | The five strings it would pin have moved. `grep -c "do not spawn the producer"` across all three wiki SKILLs returns **0** — 0173 (now in `done/`) rewrote the block, and the terminal clause reads *"Do not invoke a mover, do not edit the brief…"* (`fkit-wiki-ingest/SKILL.md:89`). Worse, under **ADR-033** pinning *"do not spawn the producer"* would pin the **wrong rule** — the producer is now the only role that may run a mover. The R2 branch does survive verbatim (`:70`, *"Unrelated to this run → **say nothing about it at all.**"*). Re-derive the assertion list against the post-0173 block before building. |
| 0155 | KEEP | process | S | none (blocks `0156`) | All six named briefs still lack the field — `grep -c "^## Priority"` returns 0 for each of `0122`, `0123`, `0124`, `0125`, `0126`, `0136`. Nothing has been backfilled. |
| 0156 | KEEP | process | M | `0155` (open) | `grep -rn "missing-priority" claude/ bin/ test/*.js` returns nothing — no `brief-missing-priority` kind in `dashboard.sh`, no test. The only hits repo-wide are inside `test/fixtures/closed-rank-0174-{before,after}.md`, which are copies of these two board rows, not an implementation. Blocked on `0155`, which is still open in this same batch. |
| 0163 | KEEP | agent-design | S | soft-coupled to `0162` (**closed**, does not wait) | `claude/agents/fkit-coder.md:98-99` still enumerates exactly two refusal cases — *"any other spawned 'implement this,' and this loop's own **plan-only** spawn"*. `grep -n "not carried verbatim"` across `fkit-coder.md` and `fkit-sprint-ship-loop/SKILL.md` returns nothing: the *"defective marker ⇒ refuse / `NEEDS-DECISION`"* clause the brief says is missing is still missing. |
| 0164 | KEEP | process | M | none (co-land with `0163`) | Gap intact: the Build-worker bullet (`claude/agents/fkit-coder.md:71-72`) still reads *"implement **only that approved plan**… never widen scope on your own"* with no logging duty, while the Process-review bullet immediately below carries the full ADR-019/ADR-020 worklog obligation. ⚠️ citation drift only — the sprint-loop Build row moved `:102` → `claude/skills/fkit-sprint-ship-loop/SKILL.md:123` and now reads *"write source + `worklog.md`"* (the `plan.md` clause was removed; the driver writes it). Still no per-decision content requirement. |
| 0165 | KEEP | process | M | none | The premise holds — the prescribed flag line is present and identical in all three wiki SKILLs, and nothing checks its **emitted** form. ⚠️ all three of the brief's citations drifted by 0173: `fkit-wiki-ingest:72` → `:75`, `fkit-wiki-sync:116` → `:120`, `fkit-wiki-lint:81` → `:84`. Re-derive before quoting them. |
| 0166 | KEEP | process | M | none | Re-ran the brief's own load-bearing command this turn: `grep -rn "not a doer" ai-agents/knowledge-base/` returns **9** — exactly the count the brief records, so its central evidence is unmoved. `evidence-before-assertion.md` is still unchanged, so *"the rule already exists and did not bind"* still describes the file. The named collision with `0013` is real and both rows are open. |
| 0168 | KEEP | docs | L | `0160` — **discharged** | Brief `:249`: `- **Depends on 0160 — hard.** No other dependency.` `0160` is now `ai-agents/tasks/done/0160-decide-the-durable-citation-form-for-mutable-coordinates` — **the hard block is gone and this row is executable today**. The generator is unchanged: `Task: <path to task file>` at `claude/skills/fkit-stateful-review/SKILL.md:52` and `claude/skills/fkit-process-stateful-review/SKILL.md:58`, so every future close still reproduces the class. |
| 0169 | KEEP | docs | M | none | `grep -rln "ADR-034\|adr-034" claude/` returns **nothing** — no skill references the close bar, exactly as the brief states. All four sites are still unpointed. |
| 0170 | KEEP | docs | M | none | Both skill sites live: `claude/skills/fkit-sprint-ship-loop/SKILL.md:44` — *"`fkit-task-ship-loop` stays **byte-unchanged.**"* — and the `## Hard rules` bullet at `:382-383`, *"Never invoke `fkit-task-ship-loop`… It stays byte-unchanged."* ADR-032 carries **no** `- **Corrections:**` bullet and no dated note. ⚠️ worth relaying to whoever builds it: ADR-032's header already has an `- **Amended by:**` bullet naming ADR-033 (`:11-13`), and §Amendment repeats it at `:225` — that is the *"neighbouring site whose wording this note may contradict"* the brief tells the implementer to hunt for, and it now has a concrete answer. |
| 0171 | STALE-PREMISE | conventions | L | none (blocks `0172`, `0176`) | The page genuinely does not exist (`find -name "durable-citation-anchors*"` → nothing), so the work stands. But the brief's scope fact — *"the scaffold copy's **'Six conventions ship with the scaffold'** count goes false"* — is **already false**: `claude/scaffold/ai-agents/knowledge-base/conventions/README.md:25` reads *"**Seven** conventions ship with the scaffold"*, and the scaffold now holds seven convention files. Deliverable B also needs re-derivation: `0195` has closed (`done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim`), which is one of the three shifts the brief warns about, while `0196` and `0197` are still open in `backlog/`. |
| 0172 | KEEP | agent-design | S | `0171` (open, hard) | Both halves verified. The mandate is unchanged: `claude/agents/fkit-architect.md:128` — *"Architecture docs / specs: structured markdown with `path:line` citations…"* — with no coordination-document exclusion. The adjacent site the brief names and deliberately excludes is also unchanged at `:113`, *"Ground every claim in a `path:line` reference."* Brief `:109` confirms the hard dependency on `0171`, which is open. |

## ⭐⭐ DATED CORRECTION 2026-08-14 — the `0154` row's evidence is FALSE, BOTH HALVES. Every byte above and below is left identical.

> ⛔ **SUPERSEDED BY ADDITION, LATER THE SAME DAY, 2026-08-14.** The `0154` row in the table above
> (`STALE-PREMISE`) is left **byte-identical** — it is the record Sprint 6's scoping pass read — but
> **its evidence does not hold, and the verdict it carries is wrong.** Appended by a spawned
> `fkit-producer` with no owner channel
> ([ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)), on an owner
> ruling given live via `AskUserQuestion` in a `fkit lead` session driving `/fkit-sprint-ship-loop`.
>
> The row gave **two independent reasons**. ⛔ **Both have now fallen** — the first by measurement, the
> second by reading ADR-033 against the live clause.
>
> **1. ⛔ *"`grep -c "do not spawn the producer"` across all three wiki SKILLs returns **0**"* — the
> command is right and the conclusion is wrong. The clause is LIVE in all three files.**
>
> The phrase **wraps across a line break, and the continuation line is indented**, so a single-line
> `grep` cannot see it. Re-measured this turn, per file:
>
> | file | naive `grep -oF` | whitespace-normalised |
> |---|---|---|
> | `claude/skills/fkit-wiki-ingest/SKILL.md` (`:90-91`) | **0** | **1** |
> | `claude/skills/fkit-wiki-sync/SKILL.md` (`:135-136`) | **0** | **1** |
> | `claude/skills/fkit-wiki-lint/SKILL.md` (`:99-100`) | **0** | **1** |
>
> Normalisation used: `tr '\n\t' '  ' | tr -s ' '`. ⚠️ **The squeeze is load-bearing — a bare
> `tr '\n' ' '` still returns 0 in `ingest` and `lint` (measured this turn: 0 / 1 / 0)**, because those
> two files' continuation lines are indented and the indent survives the join; only `sync`'s
> continuation is flush-left. **Two of three is a false negative, not a near miss.** Full
> method and the 41-claim re-check:
> [the 2026-08-14 backlog-triage re-check report](2026-08-14-backlog-triage-recheck.md).
>
> **2. ⛔ *"under **ADR-033** pinning *'do not spawn the producer'* would pin the **wrong rule**"* —
> also false. ⚠️ This half was OUTSIDE the re-check's scope (it is a reasoning claim, not a grep) and
> was examined separately; it was **re-verified first-hand for this note**, not relayed.**
>
> **Two different actors, one consistent rule:**
>
> - **ADR-033 `## Decision` item 4** has `/fkit-sprint-ship-loop` spawn `@fkit-producer` to close each
>   shipped task — that spawn is the **driver's** act, and item 3 routes the coder loop's close the same
>   way.
> - The R5 clause forbids the **wiki** doing it **on its own initiative**. Live text, all three files:
>   *"**Then stop.** Do not invoke a mover, do not edit the brief, do not touch the sprint plan, and do
>   not spawn the producer to close it yourself. Routing the close is the **caller's** next move, not
>   yours"* — which is ADR-033 item 2 (*"The wiki stays wiki-only… it **flags** completion… and closes
>   nothing"*) written into the procedure.
>
> ✅ **Pinning the clause pins CURRENT policy.** A run that acted on the row above would have deleted a
> live rule from three files that ship into every consuming project.
>
> ### ⭐ What the row's verdict actually is
>
> **`0154` is a clean `KEEP`.** ✅ **Owner-ruled 2026-08-14** — verbatim option label:
> ***"Keep it, with the wrap-tolerance requirement (Recommended)"***. The guard `0154` builds must
> **normalise whitespace before matching**, or it reproduces the false negative that produced this note.
> `0154`'s own brief already carries the matching dated correction and its assertion 5 stands.
>
> ### ⚠️ What this note also corrects, and what it does NOT touch
>
> - **This report's header counts are affected.** *"`KEEP` 22 · `STALE-PREMISE` 5"* and the sentence
>   naming the five stale rows as *"`0037`, `0045`, `0152`, `0154` and `0171`"* both read one row wrong
>   from here on: in fact **`KEEP` 23 · `STALE-PREMISE` 4**, the four being `0037`, `0045`, `0152`,
>   `0171`. ⛔ Those lines are left **byte-identical**; this note is the correction.
> - **The *Cross-cutting observations* bullet naming *"`0154` (post-0173 flag block)"* among the decayed
>   citations is left standing and is NOT withdrawn** — `0173` did rewrite the block, the brief's own
>   quoted figures are dated, and *"re-derive before quoting"* still applies. ⛔ What falls is only the
>   claim that the clause is **gone**.
> - ⛔ **Nothing else in this report is corrected.** Parts 2, 3 and 4 are untouched — no verdict of
>   theirs changed.
> - ⛔ **`0154` is NOT in Sprint 6 and this note does not add it.** No task file moved
>   ([ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)), nothing
>   re-ranked ([ADR-035](../decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
>   no board row edited, no commit.

## Rows I could not judge

None. Every row in this batch resolved to a verdict on evidence read from disk this turn. Two rows
came close and are recorded here so the owner knows where my confidence is thinnest:

- **`0121`** — I verified only that no design artifact exists. Its external premise (that Claude Code
  observer agents and Microsoft SkillOpt work as the brief assumes) I did **not** check and cannot
  check from this repo. I called it `KEEP` because testing that premise *is* the task's deliverable —
  an investigation cannot be staled by its own open question. If the owner reads it differently, this
  is the one row in the batch where `UNCLEAR` would also be defensible.
- **`0045`** — the verdict is `STALE-PREMISE` and firm, but *what the brief should say instead* is not
  something triage can settle. Whether the one live read (`$aa/.fkit-keep-out`, already guarded) makes
  the remaining hazard smaller or merely proves it arrived needs someone to walk the init read paths.

## Cross-cutting observations

- **Two dependencies are discharged and no row says so.** `0168` reads *"Depends on 0160 — hard. Do
  NOT start before it rules"*, and `0160` closed. `0046` reads *"Depends on: task 36 — soft"*, and
  that task closed as `0072`. Both rows still present as blocked to anyone skimming the board.
  `0135`'s second dependency (`0124`) is likewise closed, though its first (`0134`) is not, so it
  stays genuinely blocked. **A board-wide dependency re-check is worth its own task** — parts 2-4 are
  likely to find the same shape, and it is cheap to get wrong in the direction of not scheduling work
  that is actually ready.
- **Pre-migration task numbers are a live hazard in the oldest briefs.** `0013`, `0045` and `0046`
  cite *"task 27"*, *"task 28"*, *"task 36"* — numbers from before the ADR-029 folder-id scheme. Today
  `0027` and `0028` are unrelated **cancelled** tasks, and *"task 36"* is folder `0072`. A reader who
  resolves those numerals literally lands on the wrong task and gets a confident wrong answer. This is
  worse than a dead path, because the reference **resolves** — to something else. `0013` survives it
  only because its href points at `0072` correctly while its visible label does not; that is exactly
  `0168`'s "dead in display, live in navigation" class, appearing outside the ledger population
  `0168` scopes.
- **Line-number citations have decayed across the batch, and the rows about citation decay are the
  ones decayed.** `0037` (`prove-red.sh:86-111`), `0152` (25 vs 26 skills), `0154` (post-0173 flag
  block), `0164` (`:102` → `:123`), `0165` (all three wiki SKILL lines), `0171` (six vs seven
  conventions). None of it kills the underlying work; all of it means an implementer must re-derive
  before quoting. **`0171` writes the convention that would have prevented this, and `0160` already
  ruled the form** — so there is a real argument for scheduling `0171` early rather than by age.
- **`0152`, `0154` and `0136`'s shipped guard form one cluster.** 0136 landed the `SKILL.md` walk that
  both remaining rows were told to reuse, so the "exactly one walk" constraint they each carry is now
  satisfiable rather than contested. They should be scoped together or not at all.
- **Nothing in this batch is a duplicate, and nothing is done-in-fact.** These 27 have aged without
  being quietly overtaken — the oldest rows are old because nobody scheduled them, not because the
  work evaporated. That is an argument against sweeping them, and also against assuming age means
  low value: `0037`, `0046` and `0155` are all small and unblocked today.
