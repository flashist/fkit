# Worklog — task 0190

**Role:** `fkit-coder`, spawned as the **Build** worker by `/fkit-sprint-ship-loop` (live `fkit lead`
driver session), 2026-08-04.

**No owner channel** (ADR-021 — `AskUserQuestion` is session-only, absent in a spawn). Every judgment
call below was made by me and is recorded so the owner can overrule it.

---

## Plan carry — verified before any other work

First action, per the spawn instruction. Read with `cat`, **not** the `Read` tool (which frames output
`cat -n`-style and caps at 2000 lines).

| Check | Declared | Measured | Result |
|---|---|---|---|
| `wc -c plan.md` | 11225 | 11225 | ✅ match |
| `git hash-object plan.md` | `0c917c3cfc381860746c15fe90e380b3b6e2b37b` | `0c917c3cfc381860746c15fe90e380b3b6e2b37b` | ✅ match |
| lines | 185 | 185 | ✅ match |

⚠️ **Carry form, stated as honestly as the plan states it about itself:** this is the **pointer** form.
It pins *which bytes were carried*, not *which bytes were approved*. Nothing at runtime checks it — I
checked it myself. The `carried-not-approved` class is **narrowed, not closed**.

---

## The owner's decision this build implements

**Branch (b) — an owner-signed `RULES_MAX` bump, 4096 → 4352 (+256), shipping wording W-TIGHT (229 B).**

- **Named by:** the owner.
- **Date:** 2026-08-04.
- **Channel:** `AskUserQuestion`, in the live `fkit lead` driver session, relayed to me by
  `fkit-sprint-ship-loop` as a declared-approval marker in the Build spawn prompt.
- **Recorded in:** `plan.md` §"⛔ THE OWNER'S DECISION", carried verbatim by the driver at approval time.

This is the **ADR-016 signed bump** the cap's discipline rationale requires. The owner was shown, and
accepted, the stated cost: **every turn in every consuming project pays the extra bytes.**

⚠️ **The cap's second rationale — "attention dilution" — remains SUSPECTED BUT UNMEASURED**
(`test/rules-block-budget.test.js` header; `claude/fkit-claude-init.sh` header). It must not be cited
as established, and this build does not cite it.

**Second owner decision, out of scope here:** the wrapper-comment compression (~354 B, zero rule-text
loss) is a **separate follow-up task**. ⛔ I did **not** compress the wrapper, and ⛔ I filed **no
brief** — this task files none. **→ For the producer: that follow-up still needs filing.** When it is
filed, it must **measure** the codex side (`AGENTS.md`) rather than inherit the assumption that it
still pays the wrapper cost — that side was never re-measured (`claude/fkit-claude-init.sh:332-333`
marks it UNVERIFIED).

---

## Re-measured at build time — first-hand, this turn, not inherited from the plan

Method: ran the **real** `emit_block()` out of `claude/fkit-claude-init.sh` (the same technique
`test/rules-block-budget.test.js` uses — source the script's variables, `eval` the function, call it).
**Not** a reimplementation. All sizes are UTF-8 bytes via `wc -c`, which is what the cap counts.

### Before the edit (baseline)

| Quantity | Measured |
|---|---|
| `claude/scaffold/universal-rules.md` | **3166 B** |
| Emitted block | **3570 B** |
| `RULES_MAX` | **4096** |
| Free | **526 B** |
| Utilization | **87.16 %** → 87 |
| `node --test test/rules-block-budget.test.js` | **3/3 green** |
| `git status --porcelain` | **8 entries**, all prior-task artifacts (sprint-2, 0190 brief+plan, 0167 close set) |

### After the edit (shipped state)

| Quantity | Measured |
|---|---|
| W-TIGHT cost (source delta) | **229 B** (3166 → **3395 B**) — matches the plan exactly |
| Emitted block | **3799 B** — matches the plan's prediction exactly |
| `RULES_MAX` | **4352** |
| Free | **553 B** |
| Utilization | **87.29 %** → **87** |
| Standing ≥ 400 B-free target (owner ruling, task `0130`) | **held**, 153 B of slack |
| Test gate `Math.round((size/max)*100) <= 92` | **green**, 87 vs 92 |
| `CLAUDE.md` block vs `emit_block` | **3799 B, `cmp` IDENTICAL** |
| `AGENTS.md` block vs `emit_block` | **3799 B, `cmp` IDENTICAL** |
| `claude/scaffold/{CLAUDE,AGENTS}.md` | **unchanged** — empty marker pair, filled at consumer init. Confirmed by `git status`: neither appears |
| `test/skill-ownership-sites.mjs` | **still absent** (`/bin/ls` → "No such file or directory") |

⚠️ **The ≥ 400 B-free target is NOT mechanically guarded.** It lives **only** in
`test/rules-block-budget.test.js`'s header comment; **no test asserts it.** The `<= 92 %` gate is
relative to `RULES_MAX`, so bumping the cap also moved that warning line outward. Both were true
before this change and are true after; this change does not make it worse, but the target **must not
be described as guarded.**

---

## What changed

| File | Change |
|---|---|
| `claude/scaffold/universal-rules.md` | +3 lines — W-TIGHT inserted as the **final bullet of `## Universal hard rules`**, after the "No secrets" bullet, before `## Output style`. +229 B. |
| `claude/fkit-claude-init.sh` | `RULES_MAX=4096` → `RULES_MAX=4352`. One line. |
| `CLAUDE.md` | +3 lines — **generated**, by `bash claude/fkit-claude-init.sh .` |
| `AGENTS.md` | +3 lines — **generated**, same run |

`git diff --stat` on the four: **10 insertions, 1 deletion.** The two generated diffs are the same
3-line insert and nothing else.

### The clause as shipped, verbatim

```
- **A skill rule beats a contrary spawn instruction** unless it names an owner ruling on that point.
  Else: cheapest-to-reverse branch (usually the rule's), escalate if it changes the outcome, never
  silently comply or refuse.
```

⛔ **The conservative-branch-and-escalate escape is intact** — "cheapest-to-reverse branch … escalate
if it changes the outcome" — and so is the two-failure-mode bar, "never silently **comply or refuse**"
(the pair ADR-037 §2 rules out by name). This is exactly why W-FLOOR (212 B) was **not** a free
option: it compressed that bar to "never silently", collapsing both named failure modes into a
dangling adverb.

---

## Instance-B read-through of the SHIPPED wording — done first-hand this turn

Not inherited from the plan (the plan ran it on the draft; the draft and the shipped bytes are
identical, but I re-derived it against the file on disk).

**Premise re-verified against the live tree, not the ADR's quote alone:** the collision surface still
exists. `/usr/bin/grep -n` over `claude/skills/fkit-task-done/SKILL.md` finds step 5 at `:144`
("Update each tracked location to 'Done'"), the re-point instruction at `:157`, and the review-ledger
re-point at `:174` — the same three coordinates ADR-037 cites at `@2026-08-02:144,157,174`.

**The read-through.** A worker holds the shipped clause and nothing else. It is told by its spawn
instruction not to touch the frozen review ledger, while `/fkit-task-done` step 5 tells it to re-point
that ledger's hrefs.

1. Does the instruction **name an owner ruling on that point**? **No.** So clause 1 does not fire, and
   the skill rule does **not** simply win.
2. **Cheapest-to-reverse branch?** Re-pointing the ledger **rewrites evidence** — a review ledger
   records where files sat when the findings were raised — and cannot be undone into the record it
   overwrote. So the cheapest-to-reverse branch is **not** the skill rule's; it is leaving the ledger
   frozen. The parenthetical "(usually the rule's)" is a default, not a mandate, and it correctly
   yields here.
3. **Does it change the outcome?** Yes. → **escalate.**
4. **Silence?** Barred, in both directions.

**Result: the worker does not re-point the ledger, and it escalates.** That is precisely what the real
spawned `fkit-producer` did on 2026-07-29, and precisely the outcome the owner then ruled for. ✅ The
shipped wording reproduces instance B correctly.

---

## ADR-036 trigger (e) — assessed first-hand

**Trigger (e)** asks whether new text introduces a role name or an ownership verb into a
skill-ownership site.

- **Role tokens in the shipped clause:** `/usr/bin/grep -oiE` for
  `coder|producer|reviewer|architect|wiki|lead|adversarial` over the three shipped lines returned
  **exit 1 — no match**. (Qualified, not an unqualified "zero hits": the sweep covered exactly
  `claude/scaffold/universal-rules.md` lines 11-13.) The clause introduces **no new role token.**
- **Ownership verb:** the clause does contain **"refuse"**.
- **Why it changes nothing:** `claude/scaffold/universal-rules.md` **already** trips (e) at least
  twice today — `:5` *"**Only the wiki role** writes"* and `:7` *"**Only the producer** may invoke
  them"*, both verified by `/usr/bin/grep -n` this turn. The file's registry status is therefore
  **unchanged** by this clause.
- **`test/skill-ownership-sites.mjs` is still absent**, so the registry assessment **defers to task
  `0194`**, as the brief directs.

---

## Verification run

| Gate | Command | Result |
|---|---|---|
| Budget test | `node --test test/rules-block-budget.test.js` | **3 pass / 0 fail** (3/3) |
| Full suite | `npm test` | **567 pass / 0 fail**, 17 suites, 0 skipped, ~28.4 s |
| Mutation gate | `prove-red.sh` (inside `npm test`) | **hard gate PASSED** — 9 baseline checks green (`0a`–`0i`), **14 mutations each reddened their NAMED assertion** (`1`–`14`) |
| Byte-diff `CLAUDE.md` | `cmp` extracted block vs `emit_block` | **identical**, 3799 B |
| Byte-diff `AGENTS.md` | `cmp` extracted block vs `emit_block` | **identical**, 3799 B |
| Working-tree scope | `git status --porcelain` | **12 entries = the 8-entry baseline + exactly the 4 expected files.** Nothing outside the expected set; **no hunk needed reverting** |

Init's other side effects were checked, not assumed: it refreshed `.claude/` (7 agents, 25 skills) and
created `.fkit/interview`. **Both paths are gitignored**, so neither appears in `git status` and
neither is part of this change. It performed **no** convergence top-up or orphan cleanup write that
reached a tracked file.

⛔ **No commit, no push.** ⛔ **Nothing written under `ai-agents/wiki-vault/`.** ⛔ **No brief filed.**
⛔ **`plan.md` not re-authored** — the driver wrote it at approval; I only read it.

---

## Decision log (ADR-020)

Judgment calls made without an owner channel. **One.**

1. **Left `claude/fkit-claude-init.sh`'s cap header comment untouched — number-only bump.**
   - **What I did not do:** the header at `:323-324` reads *"keep >= 400 B free. **526 B free at time
     of writing** — a snapshot, not a guarantee"*. After the bump the live figure is **553 B**. I did
     **not** refresh that snapshot, and I did **not** add an in-script "why 4352 / owner-signed
     2026-08-04" note.
   - **Why it qualified as in-plan:** plan step 3 is narrow and literal — *"Edit `RULES_MAX=` … 4096 →
     4352"* — and plan step 6 **already assigns the bump rationale to this worklog** ("the owner's
     choice by name + date + channel"). The plan placed the record; widening the edit would have gone
     outside the approved plan for a non-blocking comment.
   - **Honest cost, flagged rather than absorbed:** the line is self-labelled a snapshot, so it is not
     false — but a future reader at the edit site sees `RULES_MAX=4352` beside "526 B free", and
     `test/rules-block-budget.test.js`'s own failure text invites the raiser to *"raise RULES_MAX
     deliberately **and say why**"* — which nothing in the script now does. **This worklog is the only
     place the "why" lives, and it travels with the task folder, not with the script.**
   - **Reversibility:** trivially reversible; a comment-only edit. **Surfaced to the driver for the
     owner/reviewer to rule on rather than decided by me.**

**Fixes applied without asking: none** — this was a Build spawn, not a review round. **Obvious-winner
calls: none** beyond item 1, which is recorded above as a decision *not* to widen.

---

## Caveats carried forward

- **The plan's 174/186/212 B figures from the brief remain unreproducible** — the wordings behind them
  exist in no file (accepted residual R4 of `0158`). The 212–246 B range is what re-drafting from
  ADR-037's own counterfactual actually costs. It cannot be ruled out that a sharper drafter finds a
  correct wording below 212 B; the plan spawn's ~15 attempts did not.
- **Reading risk worth a reviewer's eye:** a bullet inside `## Universal hard rules` that talks about
  *skill* rules could be misread as promoting skill rules to tier 1. The wording keeps the **hard rule**
  as the *collision procedure*, not as a statement of the skill rule's status.
- **No text-presence test was added** — ADR-037 §5 names one and does **not** require it; out of scope
  per the brief.
- **Out of scope and untouched:** the driver-side clause (`0191`), any `/fkit-task-done` amendment
  (`0192`), the wrapper compression (owner-ruled follow-up).

---
---

# Round 1 — Process-review

**Role:** `fkit-coder`, spawned as the **Process-review** worker by `/fkit-sprint-ship-loop` (live
`fkit lead` driver session), 2026-08-04. Skill run: `/fkit-process-stateful-review`, task `0190`.

**Plan carry re-verified before any other work** — `/bin/cat`-class read, **not** the `Read` tool:
`git hash-object plan.md` = `0c917c3cfc381860746c15fe90e380b3b6e2b37b` ✅, `wc -c` = **11225** ✅,
185 lines ✅. Same ⚠️ carry caveat as the Build round: pointer form, nothing at runtime checks it.

**Owner channel:** still none in a spawn (ADR-021). **But unlike the Build round, this round did not
need one** — the owner ruled on all five findings via `AskUserQuestion` in the live driver session and
the rulings were relayed verbatim in the spawn prompt. Every disposition below is the owner's, not
mine. `plan.md` was **not** re-authored — read only.

---

## Decision log (ADR-020) — this round

### 1. R1 — re-worded the hinge (owner-ruled fix, applied)

- **Which finding:** R1, the medium defect. The `Else:` hinge could be parsed to invert the clause;
  **Codex actually produced that parse**, which is the brief's own bar for the clause being wrong.
- **What changed** — `claude/scaffold/universal-rules.md:11-13`:
  - `Else:` → `With no such ruling: take the` — the no-ruling branch is now **named**, not inferred by
    back-attaching "else" to the nearest condition.
  - `unless **it** names` → `unless **that instruction** names` — see item 2, this half was mine.
- **Why it qualified:** verified `CORRECT` against the file; mechanical and localized (one bullet, no
  behavior beyond the text itself); **inside the approved plan** and expressly ordered by the owner's
  disposition.
- **Cost:** +38 B source (3395 → 3433 B); block 3799 → 3837 B; free 553 → **515 B**. Target ≥ 400 B
  free **holds with 115 B of slack**.

### 2. Obvious-winner call — the pronoun half of R1 was NOT in the owner's prescribed shape

- **What I did beyond the disposition:** the owner's shape kept *"unless **it** names"* and budgeted
  **~10–20 B**. I also replaced `it` with `that instruction` (**+14 B**; the hinge alone was **+24 B**,
  totalling the 38 B above).
- **Which finding it answers:** the **second, weaker ambiguity inside R1 itself** — "it" can bind to
  the sentence subject *"A skill rule"* rather than to *"a contrary spawn instruction"*. The reviewer
  raised it in the same row; the owner's disposition addressed only the hinge and delegated the exact
  bytes to me (*"you draft the exact bytes"*).
- **Why it qualified as an obvious winner within the plan's intent:** the plan's whole purpose is a
  clause a worker with no other context parses correctly; an unambiguous referent strictly dominates an
  ambiguous one, loses no required element, and costs 14 B against 553 B of headroom. It changes no
  branch of the clause's logic.
- ⚠️ **Honest cost, flagged rather than absorbed:** it is **2× the owner's stated byte budget**
  (38 B vs ~10–20 B) and it edits bytes the owner's prescribed shape had kept. Trivially reversible —
  revert `that instruction` → `it` to land at +24 B. **Surfaced in the return for the owner to
  overrule.**

### 3. R4 — refreshed the cap header (owner-ruled fix, applied)

- **Which finding:** R4. `claude/fkit-claude-init.sh:323` read *"526 B free at time of writing"*, and
  the bump carried **no inline attribution** though the same header names the ruling and task inline
  twice for `0130`. This reverses the Build round's decision-log item 1 (a deliberate not-to-widen
  call, correctly surfaced there for the owner to rule on — the owner ruled to widen).
- **What changed:** `526 B` → **`515 B`** — **re-measured myself after R1's re-wording**, not
  hardcoded from the spawn prompt's 553 B (which R1 had already invalidated). Plus, above `RULES_MAX`:
  *"Raised 4096 → 4352 by owner ruling, task 0190, 2026-08-04 — the ADR-016 signed bump reason 1 above
  requires. It bought room for ADR-037's worker-side precedence clause, which does not fit under 4096."*
- **Why it qualified:** verified `CORRECT`; **comment-only**, nothing executable reads either line;
  expressly ordered by the owner's disposition.

### 4. R2, R3 — accepted as residuals (owner-ruled, no code change)

Recorded in `review.md` → *Accepted residuals* with full What / Why / Re-raise-only-if, each naming
the downstream guarantee the owner named: R2 → the harness subagent preamble; R3 → ADR-020 plus the
clause's own return-flag duty. **No bytes spent restoring either.** R2's residual states plainly that
the *exact point* → *that point* loosening is **not** covered downstream.

### 5. Correction applied to the reviewer's proposed residual — stated, not silent

The reviewer's PROPOSED ≥ 400 B-free residual was measured on the **3799 B** block and concluded the
guard hole was *"widened by only 8 B"* (219 → 227 B), target cleared by 153 B. **R1's +38 B lands in
the same round and supersedes all three figures**: headroom **189 B** — a **30 B NARROWING** against
the pre-task 219 B baseline, not a widening — and the target cleared by **115 B**. I recorded the
residual as accepted **with the corrected arithmetic and an explicit correction note**, rather than
copying numbers that are now false into do-not-re-litigate memory. The **re-raise threshold of
3952 B is unchanged** (it is a function of `RULES_MAX`, not of the block).

**Fixes applied without asking: none** — every fix this round was an explicit owner disposition.
**Obvious-winner calls: one** — item 2 above.

---

## Follow-ups — FOR THE PRODUCER. ⛔ I filed no brief; this task files none.

1. **R5 — `0177`'s acceptance criteria are now false.** Open, unstarted brief
   `ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md` pins
   **`RULES_MAX` 4096** (verification step 4, no escape hatch), **block 3570 B** and **526 B
   headroom** (step 6, which does carry an escape hatch), and *"404 B of the `RULES_MAX=4096` cap"* in
   its Context. Live values: **4352 / 3837 B / 515 B**. A worker executing `0177` reads a false
   criterion at its verification gate. Producer-owned; outside `0190`'s change surface.
2. **The ≥ 400 B-free target is mechanically unguarded.** It lives **only** in
   `test/rules-block-budget.test.js`'s header comment; **no assertion enforces it**. Pre-existing, and
   `0190` leaves it 30 B narrower than it found it — but it **must not be described as guarded**.
   Making it assertable is a new test, outside this task's change surface. Recorded as an accepted
   residual in `review.md` with its re-raise condition.
3. **Still outstanding from the Build round:** the wrapper-comment compression (~354 B, owner-ruled
   separate follow-up) — and when filed it must **measure** the codex side (`AGENTS.md`) rather than
   inherit the assumption that it still pays the wrapper cost (`claude/fkit-claude-init.sh` marks that
   UNVERIFIED).

---

## Instance-B read-through of the RE-WORDED bytes — re-run first-hand this turn

**Premise re-verified against the live tree, not the ADR's quote alone:** `/usr/bin/grep -n` over
`claude/skills/fkit-task-done/SKILL.md` still finds step 5 at `:144` ("Update each tracked location to
'Done'"), the re-point instruction at `:157`, and the review-ledger re-point at `:174` — the same
three coordinates ADR-037 cites.

**The clause as re-worded, verbatim:**

```
- **A skill rule beats a contrary spawn instruction** unless that instruction names an owner ruling
  on that point. With no such ruling: take the cheapest-to-reverse branch (usually the rule's),
  escalate if it changes the outcome, never silently comply or refuse.
```

A worker holds this and nothing else. Its spawn instruction says do not touch the frozen review
ledger; `/fkit-task-done` step 5 says re-point that ledger's hrefs.

1. Does **that instruction** name an owner ruling on that point? **No.** The referent is now
   explicit — "that instruction" can no longer bind to "A skill rule". The exception does not fire.
2. **"With no such ruling:"** fires — and it fires on the **no-ruling** case, unambiguously, because
   *"such ruling"* back-references *"an owner ruling on that point"*. This is the defect R1 named: the
   old `Else:` invited attachment to the nearest condition (*a ruling IS named*), inverting the clause.
   Take the cheapest-to-reverse branch: re-pointing **rewrites evidence** and cannot be undone into the
   record it overwrote, so the branch is **not** the skill rule's. "(usually the rule's)" is a default
   and correctly yields.
3. **Changes the outcome?** Yes → **escalate.**
4. **Silence?** Barred in both directions.

**Result: the worker does not re-point the ledger, and it escalates.** ✅ Unchanged from the shipped
wording, and reached without backing out of a wrong parse first.

**All four required elements survive** — checked one by one, not asserted wholesale:

| Element | Where it survives |
|---|---|
| Named-owner-ruling exception | *"unless that instruction names an owner ruling on that point"* |
| Cheapest-to-reverse branch, skill rule as tie-break default | *"take the cheapest-to-reverse branch (usually the rule's)"* |
| Escalate where it changes the outcome | *"escalate if it changes the outcome"* |
| Never-silently, **both** failure modes by name | *"never silently **comply or refuse**"* |

⛔ It did **not** collapse into the defective W-FLOOR form (*"never silently."*) — both named failure
modes are still present as verbs.

---

## Re-verification after the edits — first-hand, this turn

Method: the **real** `emit_block()` sourced out of `claude/fkit-claude-init.sh` — the same technique
`test/rules-block-budget.test.js` uses (`set -a`, grep the marker/tag vars, `eval` the function,
call it). **Not** a reimplementation. Bytes via `wc -c`, UTF-8, which is what the cap counts.

| Quantity | Before this round | After this round |
|---|---|---|
| `claude/scaffold/universal-rules.md` | 3395 B | **3433 B** |
| Emitted block | 3799 B | **3837 B** |
| `RULES_MAX` | 4352 | **4352** (unchanged this round) |
| Free | 553 B | **515 B** |
| Utilization | 87.2932 % → 87 | **88.1664 % → 88** |
| Standing ≥ 400 B-free target | held | **held, 115 B of slack** |
| Test gate `Math.round((size/max)*100) <= 92` | 87 vs 92 | **88 vs 92, green** |

⚠️ **The ≥ 400 B-free target is still NOT mechanically guarded** — it holds by measurement, not by
assertion. See follow-up 2.

| Gate | Command | Result |
|---|---|---|
| Byte-diff `CLAUDE.md` | `cmp` extracted block vs `emit_block` | **IDENTICAL**, 3837 B (lines 47-98) |
| Byte-diff `AGENTS.md` | `cmp` extracted block vs `emit_block` | **IDENTICAL**, 3837 B (lines 30-81) |
| Budget test | `node --test test/rules-block-budget.test.js` | **3 pass / 0 fail** |
| Full suite | `npm test` | **567 pass / 0 fail**, 17 suites, 0 skipped, ~26.7 s |
| Mutation gate | `prove-red.sh` (inside `npm test`) | **hard gate PASSED** — 9 baseline checks green (`0a`–`0i`), **14 mutations each reddened their NAMED assertion** (`1`–`14`) |
| Working-tree scope | `git status --porcelain` | **14 entries**; the four `0190` code files plus `review.md`/`worklog.md`, the rest prior-task artifacts. **Nothing outside the expected set.** |

Regeneration was a real `bash claude/fkit-claude-init.sh .` (exit 0). Its other effects were checked,
not assumed: refreshed `.claude/` (7 agents, 25 skills) and `.fkit/interview` — **both gitignored**,
so neither appears in `git status`.

⛔ **No commit, no push.** ⛔ **Nothing written under `ai-agents/wiki-vault/`.** ⛔ **No brief filed.**
⛔ **`plan.md` not re-authored.** ⛔ **No text-presence test added** (ADR-037 §5 names one and does not
require it; out of scope per the brief). ⛔ **The reviewer's *Reviewer findings* section was not
edited.**
