# Backlog triage — synthesis of parts 1–4, and a Sprint 6 proposal

**Read-only synthesis, 2026-08-14, HEAD `4424b44`.** Merges the four independent triage fragments
([part 1](2026-08-14-backlog-triage-part-1.md), [part 2](2026-08-14-backlog-triage-part-2.md),
[part 3](2026-08-14-backlog-triage-part-3.md), [part 4](2026-08-14-backlog-triage-part-4.md)) into
one verdict table, one merged theme set, one dependency picture, and **a Sprint 6 proposal that has
NOT been executed**.

**Combined verdicts across 108 triaged rows:** `KEEP` 92 · `STALE-PREMISE` 14 · `DONE-IN-FACT` 2 ·
`SUPERSEDED` 0 · `DUPLICATE` 0 · `UNCLEAR` 0.

⚠️ **The board is 106 open rows, not 108.** The two `DONE-IN-FACT` rows — `0206` and `0238` — were
closed under the owner's ruling *"Close both as agent-closed"* and now sit in `ai-agents/tasks/done/`.
**They appear nowhere below.** Verified this turn: `ai-agents/tasks/backlog/` holds exactly **106**
task folders.

⚠️ **`size` is inherited from the fragments and is an estimate, not a measurement.** No row was
planned or costed here. Where two fragments would have sized the same row differently, the
originating fragment's value stands.

---

## 1. Merged theme set, and the mapping

**The four fragments invented their tags independently** — 6 tags in part 1, 4 in part 2, 11 in part
3, 13 in part 4, **21 distinct labels** in all, several of them near-synonyms coined for one range.
Merging them is the main reason this pass exists.

**Ten merged themes.** The merge groups by *what a worker would have to read and touch*, not by
subject matter — that is what makes a theme useful for scoping.

| merged theme | folded from | rows |
|---|---|---|
| `testing` | p1/p2/p3/p4 `testing` | 17 |
| `records` | p3 `adr`, p4 `adr`, + the **record-accuracy** half of `docs` (p1, p2, p4) | 16 |
| `ownership` | p3 `ownership`, p3 `movers`, p4 `roles`, p1 `agent-design` | 14 |
| `citations` | p3 `citations`, p3 `docs-drift`, p4 `docs-citations`, + the **coordinate-repair** half of `docs` (p1, p2) | 12 |
| `conventions` | p1 `conventions`, p4 `conventions` | 10 |
| `tooling` | p1 `launcher`, p4 `launcher`, p3 `dashboard`, p3 `budget`, p3 `scaffold`, p4 `release` | 10 |
| `process` | p1/p2/p4 `process`, p4 `field-test` | 10 |
| `wiki` | p2/p3/p4 `wiki` | 8 |
| `loop` | p3 `sprint-loop`, p4 `loop` | 6 |
| `review` | p4 `review` | 3 |
| | **total** | **106** |

**Four notes on the merge, because a mapping that hides its judgement calls is not a mapping:**

1. ⭐ **`docs` is the one part-tag that does NOT fold whole — it splits.** Parts 1, 2 and 4 all used
   `docs` for two genuinely different jobs: *"a recorded coordinate no longer resolves"* (→
   `citations`) and *"a frozen record states something false"* (→ `records`). The test applied: **does
   the fix change a pointer, or a claim?** `0168` (dead brief paths in ledger headers) is `citations`;
   `0146` (a false residual sentence in a closed ledger) is `records`. Merging them would have hidden
   the largest single cluster on the board.
2. **`docs-drift` (part 3) and `docs-citations` (part 4) are the same theme under two names**, and both
   are `citations`. Part 3 coined `docs-drift` and part 4 coined `docs-citations` for rows of
   identical shape.
3. **`budget` (part 3) is folded into `tooling`, not `testing`.** Its three rows (`0218`, `0219`,
   `0220`) are about the launcher's `RULES_MAX` cap; only `0219`/`0220` touch `test/`. ⚠️ `0219` and
   `0220` are tagged `testing` below because their **deliverable** is a guard; `0218` is `citations`
   because its deliverable is a figure repair. **The chain is named explicitly in §5 so the split does
   not lose it.**
4. **`review` (3 rows) was kept separate rather than folded into `process`.** It is small enough to
   fold, but its three rows form a strict dependency chain with one unblocked head — folding it would
   have buried exactly the fact a scoping pass needs.

---

## 2. Merged verdict table — all 106 open rows

**Columns:** `id` · `verdict` · merged `theme` · `size` · **real state** (dependencies resolved against
`ai-agents/tasks/done/` and `cancelled/` this turn).

⭐ = **ready today but its brief does not say so** (see §3). ⛔ = blocked on an **owner decision**, not
on code.

| id | verdict | theme | size | real state |
|---|---|---|---|---|
| 0013 | KEEP | conventions | M | ready |
| 0037 | STALE-PREMISE | testing | M | ready |
| 0045 | STALE-PREMISE | tooling | S | ⭐ **ready** — its gate *"task 28"* is a pre-migration numeral; the real work (`0023`) shipped |
| 0046 | KEEP | tooling | S | ⭐ **ready** — soft dep *"task 36"* = `done/0072` |
| 0121 | KEEP | ownership | L | ready |
| 0131 | KEEP | process | S | ready |
| 0134 | KEEP | ownership | M | ready — gates `0135` |
| 0135 | KEEP | ownership | L | blocked on `0134` (open); its second dep `0124` discharged |
| 0137 | KEEP | conventions | M | ready |
| 0138 | KEEP | conventions | M | ready |
| 0144 | KEEP | testing | M | ready |
| 0145 | KEEP | testing | L | ready |
| 0146 | KEEP | records | S | ready |
| 0149 | KEEP | records | S | ready |
| 0152 | STALE-PREMISE | testing | S | ready |
| 0154 | STALE-PREMISE | testing | M | ready — soft dep `0153` discharged; ⛔ **owner fork: rescope or drop** |
| 0155 | KEEP | process | S | ready — gates `0156` |
| 0156 | KEEP | tooling | M | blocked on `0155` (open) |
| 0163 | KEEP | ownership | S | ready — soft coupling to `0162` (closed), brief says it does not wait |
| 0164 | KEEP | ownership | M | ready — co-land with `0163` |
| 0165 | KEEP | process | M | ready |
| 0166 | KEEP | conventions | M | ready — named collision with `0013`, both open |
| 0168 | KEEP | citations | L | ⭐⭐ **ready** — `Depends on 0160 — hard`; `0160` is in `done/`. **Unblocks `0175`.** |
| 0169 | KEEP | records | M | ready |
| 0170 | KEEP | records | M | ready |
| 0171 | STALE-PREMISE | conventions | L | ready — gates `0172`, soft-gates `0197` |
| 0172 | KEEP | citations | S | blocked on `0171` (open, hard) |
| 0175 | KEEP | testing | M | blocked on `0168` (open) — ⚠️ but `0168` is free today |
| 0176 | KEEP | testing | M | blocked on `0237` (open) |
| 0177 | STALE-PREMISE | testing | S | ready — ⚠️ unworkable as written until `0218` lands |
| 0178 | KEEP | conventions | S | ready — **doubly hard gate** for `0179` and `0180` |
| 0179 | KEEP | process | S | blocked on `0178` (open) |
| 0180 | KEEP | testing | M | blocked on `0178` + `0179` (both open) |
| 0183 | STALE-PREMISE | records | S | ready |
| 0184 | KEEP | conventions | S | ready |
| 0186 | KEEP | records | S | ready |
| 0187 | KEEP | records | S | ready |
| 0188 | KEEP | records | M | ready — gates `0189` by owner ruling |
| 0189 | KEEP | testing | L | blocked on `0188` (open) |
| 0192 | KEEP | ownership | M | ready — gates `0201` |
| 0193 | STALE-PREMISE | citations | M | ready |
| 0194 | KEEP | testing | S | blocked on `0189` — ⚠️ **but its brief claims all THREE deps are open; `0190` and `0191` closed** |
| 0196 | KEEP | records | S | ready — serialization partner `0195` closed |
| 0197 | KEEP | citations | M | soft-gated on `0171` (open) |
| 0198 | KEEP | process | S | ready — makes `0196`/`0197`/`0205`/`0207` cheaper |
| 0199 | KEEP | wiki | M | ready, soft-ordered after `0196`/`0197` — ⛔ **`fkit-wiki` only** (ADR-005) |
| 0201 | KEEP | records | M | blocked on `0192` (open) **and** ⛔ an unmet owner authorization to write into two closed folders |
| 0204 | KEEP | loop | L | ⭐⭐ **ready** — hard gate `0202` is in `done/`; deletes **five** honesty markers |
| 0205 | KEEP | records | S | ready |
| 0207 | KEEP | records | S | ready |
| 0209 | KEEP | process | S | ready — ⚠️ two files must change in one edit or the ledger forks |
| 0212 | KEEP | wiki | S | ready — ⛔ **`fkit-wiki` only** (ADR-005) |
| 0213 | KEEP | wiki | S | ready — edits a SKILL under `claude/`, **not** the vault |
| 0214 | KEEP | testing | M | ready |
| 0215 | KEEP | testing | M | ready |
| 0216 | KEEP | wiki | M | ready — gates `0217`; creates a skill under `claude/`, **not** a vault write |
| 0217 | KEEP | ownership | M | blocked on `0216` (open) |
| 0218 | KEEP | citations | S | ready — ⭐ **cheapest unlock on the board** |
| 0219 | KEEP | testing | S | ready |
| 0220 | KEEP | testing | M | blocked on `0177` (open) |
| 0221 | STALE-PREMISE | citations | S | ready |
| 0223 | KEEP | loop | M | ⭐ **ready** — `0222` is in `done/`, ADR-038 exists |
| 0224 | KEEP | ownership | L | ⛔ **blocked on an OWNER decision** — the denial log's path is unruled |
| 0225 | KEEP | ownership | M | ready — dated correction records the relaxation |
| 0226 | KEEP | ownership | M | ready |
| 0227 | KEEP | loop | M | ready |
| 0228 | KEEP | loop | L | ready |
| 0229 | KEEP | ownership | M | ready — *"Ship 0229 standalone."*, recorded in the brief |
| 0230 | KEEP | conventions | S | ready |
| 0231 | KEEP | wiki | M | ready — ⛔ **`fkit-wiki` only** (ADR-005) |
| 0232 | KEEP | citations | L | ready — gates `0239` |
| 0233 | KEEP | ownership | M | blocked on `0189` + `0224` (neither artifact exists) |
| 0234 | KEEP | tooling | L | ready — ⚠️ blast radius grew from 1 archived board to **5** |
| 0235 | KEEP | tooling | L | ready |
| 0236 | STALE-PREMISE | citations | L | ready — ⚠️ must be re-derived against **5** archived boards |
| 0237 | KEEP | citations | L | ready — gates `0176` |
| 0239 | KEEP | wiki | M | blocked on `0232` (open) — ⛔ **`fkit-wiki` only** (ADR-005) |
| 0240 | STALE-PREMISE | records | M | ⭐ **ready** — `0222` in `done/`; its `Blocks: 0182` edge is also dead. ⛔ owner fork |
| 0250 | KEEP | tooling | S | ready — ships into every consuming project |
| 0251 | KEEP | citations | S | ready |
| 0262 | STALE-PREMISE | process | L | ready — ⛔ **owner fork** |
| 0270 | KEEP | loop | M | ready — decision-only |
| 0271 | KEEP | testing | M | ready — deps `0264`/`0265` closed, **and the brief already says so** |
| 0272 | STALE-PREMISE | review | M | ready — ⭐ **only unblocked head** of the review chain. ⛔ owner fork |
| 0273 | KEEP | review | M | blocked on `0272` (open, hard — the brief says STOP) |
| 0274 | KEEP | review | S | ready — the 2026-08-11 ruling discharged its gate |
| 0275 | KEEP | citations | S | ready |
| 0276 | KEEP | records | M | ready |
| 0277 | KEEP | loop | M | ready |
| 0278 | KEEP | process | M | ready — decision-only |
| 0279 | KEEP | conventions | M | ready — dual-homed, land identical in both |
| 0280 | KEEP | wiki | S | ready — ⭐ **highest re-reported-to-cost ratio on the board**; edits `claude/`, **not** the vault |
| 0281 | KEEP | records | S | ready |
| 0284 | KEEP | tooling | L | ready |
| 0286 | KEEP | citations | L | ready — its four preferred predecessors are all open |
| 0287 | KEEP | wiki | M | soft-gated on `0273`, **correctly refusing** — ⛔ **`fkit-wiki` only** (ADR-005) |
| 0290 | STALE-PREMISE | process | M | ready — ⛔ owner fork |
| 0296 | KEEP | process | M | ready |
| 0298 | KEEP | testing | S | ready |
| 0299 | KEEP | records | M | ready |
| 0300 | KEEP | tooling | M | ready — filing-time concurrency caveat discharged |
| 0301 | KEEP | conventions | L | ready |
| 0302 | KEEP | tooling | S | ready — fully ruled, zero open questions |
| 0303 | KEEP | tooling | L | ready — ⚠️ entangled with `0304` |
| 0304 | KEEP | ownership | M | ready — ⚠️ entangled with `0303` |
| 0305 | KEEP | ownership | L | ready |

**Real-state totals: 82 ready · 21 blocked on open work · 3 blocked on an owner decision**
(`0224`, plus `0201`'s authorization precondition, plus the four rows carrying unresolved forks that
do not stop them starting are counted as *ready* above, not as blocked).

---

## 3. ⭐ Ready today, but reads blocked — the single most useful output of this pass

**Five rows are executable right now and their briefs still present them as gated.** Each was checked
by resolving the named dependency against `ai-agents/tasks/done/` and `cancelled/` this turn.

| id | what the brief says | what is true today | why it matters |
|---|---|---|---|
| **`0168`** | `brief.md:249` — `- **Depends on 0160 — hard.** No other dependency.` | `0160` is `ai-agents/tasks/done/0160-decide-the-durable-citation-form-for-mutable-coordinates` | ⭐ **Strongest case on the board.** A *hard* block, discharged, with no correction. It also **gates `0175`** — so one unnoticed discharge is holding two rows. |
| **`0204`** | `brief.md:124` — `- **Depends on:** \`0202\` — **hard gate**, see caveat 2.` | `0202` is in `done/`, and the behaviour it needed is live: the driver now writes `plan.md` at approval | ⭐ **Load-bearing for the loop's own honesty.** It is the only thing standing between `/fkit-sprint-ship-loop` and the **five** enumerated honesty markers at `fkit-sprint-ship-loop/SKILL.md:201-214`, which the SKILL says are `0204`'s to delete. |
| **`0223`** | `brief.md:152` — `- **Depends on:** \`0222\` (records ADR-038 …)` | `0222` is in `done/` and `adr-038-…` exists, so its *"cite ADR-038 once it exists"* is now executable | Small — one row in one file — and free. |
| **`0240`** | `brief.md:236` — `- **Depends on:** \`0222\` — hard, for the ADR number only.` | `0222` in `done/`; **and** its `:239` `- **Blocks:** \`0182\` — soft` is dead, `0182` shipped | **Two** discharged edges, in opposite directions. ⚠️ Needs re-scope before pickup (see §6). |
| **`0046`** | `brief.md:101` — `- **Depends on: task 36** (\`remove-fkit-omnigent-orphan-residue\`) — **soft, not hard.**` | The **name** resolves to `done/0072-remove-fkit-omnigent-orphan-residue`; the **numeral** resolves to `done/0036-extend-mover-reference-sweep-to-the-knowledge-base` | ⭐ Simultaneously a discharged dependency **and** a mis-resolving numeral. A live, ungated symlink hazard in `fkit-claude-init.sh` is sitting behind it. |

**Plus one that reads gated on a pre-migration numeral rather than a dependency:**

- **`0045`** — gated on *"task 28 (additive convergence walks and reads the tree)"*. `0028` today is
  `cancelled/0028-design-ship-loop-timeout-auto-proceed`; the work described is
  `done/0023-converge-ai-agents-additively-on-launch`, **already shipped**. The gate is discharged and
  the row is free.

### ⛔ Four rows that read blocked and ARE free — and are NOT on the list above, deliberately

`0224`, `0225`, `0229` and `0271` each already carry a dated correction or a self-declaration
recording that the dependency discharged — *"Relax 0224 and 0225."* (2026-08-06), *"Current
dependency: nothing. This task is sprintable."*, *"both are now closed, so nothing here is waiting"*.
⭐ **These are the model.** They are the reason the five rows above are a defect and these are not.

⚠️ **`0224` is free of `0222` but is still NOT ready** — it is held by an **unruled owner decision**
(the denial log's path). Do not read it as schedulable.

### ⚠️ One row that must NOT be flipped

**`0194`** depends on `0189`, `0190`, `0191` and warns *"⚠️ All three dependencies are open at
filing."* **`0190` and `0191` have closed; `0189` has not.** The row is **still genuinely blocked** —
but its brief overstates the block **three-fold**. The repair is to correct the count, **not** to
declare the row ready.

---

## 4. The three decay shapes, re-measured

⚠️ **All three were re-measured this turn; two of the driver's figures moved.**

| shape | driver's figure | measured today | note |
|---|---|---|---|
| Dead `ai-agents/sprints/sprint-N.md` path | 18 briefs | **17 briefs, 28 occurrences** | The 18th was `0238`, which **closed today** carrying 5 occurrences |
| Pre-migration `task NN` numerals | 3 briefs (`0013`/`0045`/`0046`) | **13 briefs**; **4** numerals verified mis-resolving | ⭐ `task 43` is a **new finding** — see below |
| Discharged deps reading as blocking | `0168`, `0046`, `0135`, `0223`, `0204` | **`0168`, `0204`, `0223`, `0240`, `0046`** | ⚠️ `0135` is **genuinely still blocked** on `0134`; only its *second* dep discharged. `0240` is the addition. |

### ⭐⭐ `task 43` — the finding the instruction did not contain

The mis-resolving-numeral class is **not confined to the oldest briefs**. *"task 43"* means the
`PreToolUse` skill-ownership hook / ADR-018. Today `0043` is
`done/0043-fix-scaffold-knowledge-base-folders` — **entirely unrelated**. It is cited by `0196`,
`0302` and `0305` — **and `0302` and `0305` were both filed on 2026-08-14.**

⚠️⚠️ **It is being actively reproduced, because it is copied out of live source comments.** Measured
today: **10 occurrences under `claude/`** — `claude/README.md` (×3), `claude/fkit-claude.sh` (×6),
`claude/skills-for-role.sh` (×1). ⛔ Repairing only the `ai-agents/` half leaves the source re-seeding
the numeral into every future brief. **Whether the cleanup extends to `claude/` is an owner question,
returned in §8.**

⛔ **Not every numeral is a defect.** *"task 70"* (in `0217`, `0226`) resolves **correctly** to
`done/0070-relax-tool-allowlists-except-adversarial-reviewer`. `0296`'s *"task 23"* sits inside a
**verbatim quotation of a frozen cancellation reason** and must never be edited. Five further
numerals — *"task 23"*, *"task 26"*, *"task 46"*, *"task 47/48"*, *"task 80"* — were **not resolved**
and are **not classified**. ⚠️ *"task 46"* deserves particular care: **`0046` is a live open task**, so
a wrong resolution there lands a reader on real, open, unrelated work.

---

## 5. Dependency chains, especially the broken ones

**⚠️ The budget chain is three deep and broken in the middle — `0220` → `0177` → `0218`.**
`0220` cannot start without `0177`'s codex-side measurement; `0177` **as written** tells its worker to
reproduce a `RULES_MAX=4096` cap the repo no longer has (live: `4352`); `0218` is the one-file repair
that fixes exactly that. ⭐ **`0218` must ship before `0177`, and `0177` before `0220`** — and `0218`
is small, unblocked and independent. **It is the cheapest unlock on the board.** `0219` sits beside
them and is independent of all three.

**The merit chain hangs off one small unwritten page — `0180` → `0179` → `0178`.** `0178` is an `S`,
unblocked, and a **doubly** hard gate: the 2026-08-06 grandfathering ruling made `0178`'s **date**
`0180`'s cut-off boundary, so `0180` cannot even be *defined* until `0178` lands. Highest
leverage-per-hour row in its range.

**The review chain is three deep with one unblocked head — `0287` → `0273` → `0272`.** `0273` carries
a hard `Depends on: 0272` that says STOP; `0287`'s verification step 1 is a soft gate **currently and
correctly refusing**. ⭐ `0272` is the only startable member. Scoping `0273` or `0287` without `0272`
ahead of them puts two rows into a sprint that cannot start.

**Other live chains:**

| chain | head | head's state |
|---|---|---|
| `0175` → `0168` | `0168` | ⭐ **free today** — the whole chain is one step from moving |
| `0233` → {`0189`, `0224`}; `0194` → `0189` → `0188` | `0188` | ready |
| `0176` → `0237` | `0237` | ready (`L`) |
| `0239` → `0232` | `0232` | ready (`L`) |
| `0217` → `0216` | `0216` | ready |
| `0135` → `0134` | `0134` | ready |
| `0156` → `0155` | `0155` | ready (`S`) |
| `0172` → `0171`; `0197` ⇢ `0171` (soft) | `0171` | ready |
| `0201` → `0192` | `0192` | ready — ⛔ but `0201` also needs an owner authorization |

**⚠️ File contention, which is not a dependency but behaves like one.**
`claude/skills/fkit-sprint-ship-loop/SKILL.md` is contended by **six** open rows — `0204`, `0223`,
`0227`, `0228`, `0277`, and `0225` reading it. ⛔ **If more than one is sprinted together, sequence
them; do not run them in parallel.** Every one of those briefs already carries a *"re-read live, cite
by heading, never by line"* warning.

**⛔ A routing fact that outranks the loop's step table.** Five open rows write
`ai-agents/wiki-vault/` and must go to `fkit-wiki` (ADR-005): `0199`, `0212`, `0231`, `0239`, `0287`.
⚠️ `/fkit-sprint-ship-loop`'s Build step is **fixed to `@fkit-coder` and never reads a brief's
`## Owner`** — which is precisely the defect `0270` exists to decide. ⭐ **Until `0270` lands, do not
scope a vault-writing row into a ship-loop sprint.** `0213`, `0216` and `0280` are safe despite their
`wiki` theme: they edit skills under `claude/`, not the vault.

---

## 6. The 14 `STALE-PREMISE` rows — what died, and the rescope cost

⭐ **In all 14 the work still stands.** Not one is a cancellation proposal on staleness alone.

| id | what specifically died | rescope |
|---|---|---|
| `0037` | *"Its two current mutations are **both** against the launcher"* — `test/prove-red.sh` is now 64 KB with **22+** mutations and a third seam (`FKIT_RELEASE_MJS`). The gap itself survives intact. | **S** — context paragraph only; deliverable unchanged |
| `0045` | Two premises. (a) *"Nothing does this today — the hazard is latent, not live."* Init **does** read inside `$dest/ai-agents/` now, and that read is already `[ -L ]`-guarded. (b) Its gate *"task 28"* is a pre-migration numeral; the real work (`0023`) shipped **without** the guard. | **M** — someone must walk the init read paths to say whether the residual hazard shrank or merely arrived |
| `0152` | *"No test in the repo reads any `SKILL.md`'s content"* — false since `0136` shipped. And *"**25** files, not 26"* — there are **26** today. The guard is still unbuilt and still green day one. | **S** |
| `0154` | The five strings it would pin have moved (`0173` rewrote the block). ⛔ **Worse: under ADR-033, pinning *"do not spawn the producer"* would pin the WRONG rule** — the producer is now the only role that may run a mover. | **M** — ⛔ **owner fork: rescope or drop** (§8) |
| `0171` | Its scope fact — *"the scaffold's **'Six conventions ship'** count goes false"* — is **already false**; the scaffold README reads *"Seven"* and holds seven pages. Deliverable B needs re-derivation (`0195` closed; `0196`/`0197` open). | **S** |
| `0177` | Its ⛔ fence reads *"no `RULES_MAX` change (stays 4096)"*; live is **4352**. The `404 B` wrapper figure is measured against the old cap. **The prohibition names a number that no longer exists.** | **S** — ⭐ **resolved for free if `0218` ships first** |
| `0183` | Its deliverable **target path** — `ai-agents/sprints/sprint-2.md` — is dead; Sprint 2 archived to `sprints/done/`. The falsehood it repairs is still live in both records. | **S** |
| `0193` | Same dead path **five times**, including inside its `git diff ai-agents/sprints/sprint-2.md` **verification commands**, which now prove nothing. Its brief already warned *"⚠️ THIS BRIEF DECAYS"*. It has. | **M** |
| `0221` | Its ⛔ constraint *"EXACTLY ONE of the three premises is false — do not 'repair' the other two"* is now false: `0191` landed, so **two** are false. Only `0189`'s registry still holds. | **S** |
| `0236` | Scoped *"after the Sprint 2 archival"* and names `sprint-3.md` as a **live** re-point target — Sprint 3 archived 2026-08-07. **Five** boards are archived now, not one. None of its recorded counts reproduce. | **L** — the live/frozen/no-op classification must be re-derived against 5 boards |
| `0240` | **Every ordering clause is spent.** *"Sequence after `0222`"* — closed. ⛔ *"Do not pre-allocate 039"* — `adr-039`…`adr-043` are all taken. *"Blocks `0182` — soft"* — dead; `0182` shipped and the guard is implemented. | **M** — ⛔ **owner fork** (§8) |
| `0262` | Two facts falsified: *"nothing Sprint 4 shipped has ever been exercised outside this repo"* (the owner ran `v0.2.2` in `geoconflict` today) and *"the downstream reporter already on `0.2.1`"* (`VERSION` reads `0.2.2`). ⭐ **The heal/repair leg, `FKIT_CLEANUP_DRY_RUN` and the field report remain unexercised.** | **M** — ⛔ **owner fork** (§8) |
| `0272` | Its placement ruling — *"pull into Sprint 5 at `P17`, then move to `P6`"* — is unexecutable: Sprint 5 archived with **no successor**. ⛔ **The underlying ADR-042 D1 work is unaffected and has NOT landed** (zero `reasoning-only` hits across its five named files). | **S** — ⛔ **owner fork** (§8) |
| `0290` | Its own dated fence is **inverted**: it asserts *"`0289` has not run"* and forbids saying the page carries all three blocks. `0289` is closed and the page carries its block. ⭐ **The investigation itself is untouched** — its load-bearing unknown is unaffected. | **S** — ⛔ **owner fork** (§8) |

### ⭐⭐ DATED CORRECTION 2026-08-14 — the `0154` row above is FALSE, BOTH HALVES. It is 13 rows, not 14. Every byte above is left identical.

> ⛔ **SUPERSEDED BY ADDITION, LATER THE SAME DAY, 2026-08-14.** The `0154` row in the table above is
> left **byte-identical**; **both of its claims have fallen**, so `0154` is not a `STALE-PREMISE` row at
> all. Appended by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)) on an owner
> ruling given live via `AskUserQuestion` in a `fkit lead` session driving `/fkit-sprint-ship-loop`.
>
> **1. ⛔ *"The five strings it would pin have moved (`0173` rewrote the block)"* — FALSE.** The clause
> *"do not spawn the producer to close it yourself"* is **live in all three wiki skills**. It **wraps
> across a line break with an indented continuation**, so the single-line `grep` behind the row could
> not see it. Measured this turn — naive `grep -oF` / whitespace-normalised
> (`tr '\n\t' '  ' | tr -s ' '`): **`0/1` in `fkit-wiki-ingest` (`:90-91`), `fkit-wiki-sync`
> (`:135-136`) and `fkit-wiki-lint` (`:99-100`)**. ⚠️ A bare `tr '\n' ' '` still reads **0** in `ingest`
> and `lint`; the **squeeze** is what finds it. Method and the 41-claim sweep:
> [the 2026-08-14 backlog-triage re-check report](2026-08-14-backlog-triage-recheck.md).
>
> **2. ⛔ *"Worse: under ADR-033, pinning 'do not spawn the producer' would pin the WRONG rule"* — ALSO
> FALSE.** ⚠️ This half was **outside the re-check's scope** (a reasoning claim, not a grep). It was
> examined separately and **re-verified first-hand for this note.** ADR-033 `## Decision` item 4 has
> `/fkit-sprint-ship-loop` spawn `@fkit-producer` to close each shipped task — the **driver's** act
> (item 3 routes the coder loop's close the same way). The clause in the wiki skills forbids the
> **wiki** doing it **on its own initiative**, which is item 2 (*"The wiki stays wiki-only… it **flags**
> completion… and closes nothing"*) written into the procedure. **Two actors, one consistent rule.**
> ✅ **Pinning the clause pins CURRENT policy.**
>
> ### ⭐ The verdict, and the fork that is now withdrawn
>
> - **`0154` is a clean `KEEP`.** ✅ **Owner-ruled 2026-08-14** — verbatim option label:
>   ***"Keep it, with the wrap-tolerance requirement (Recommended)"***. The guard `0154` builds must
>   **normalise whitespace before matching**.
> - ⛔ **§8 fork 4 — *"`0154` — rescope or drop?"* — IS WITHDRAWN.** It rested entirely on the two claims
>   above. **Six forks required a ruling; five do.** The `0154` line in §8 is left byte-identical and
>   carries a pointer to this note.
> - ⛔ **§2's merged verdict table entry** — *"`0154` | STALE-PREMISE | … ⛔ **owner fork: rescope or
>   drop**"* — and **§7's *"`0154`, `0240`, `0290` — each carries an unresolved owner fork"*** are both
>   superseded by this note on the `0154` half only. `0240` and `0290` are unaffected.
> - **This section's own count** — *"The 14 `STALE-PREMISE` rows"* — reads **13** from here on.
>
> ⛔ **`0154` is NOT in Sprint 6 and this note does not add it.** ⛔ Nothing else in this synthesis is
> corrected; §7's Sprint 6 proposal is unchanged and every absence claim among its 18 ranked rows was
> re-checked and holds. No task file moved
> ([ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)), nothing
> re-ranked ([ADR-035](../decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
> no commit.

---

## 7. ⛔ Sprint 6 — A PROPOSAL. NOT EXECUTED.

⛔⛔ **Sprint 6 has NOT been opened. No `sprint-6.md` exists. No row was moved.** Every sprint in this
project was opened by an **explicit owner ruling**, and that ruling has not been given. This section is
a recommendation to accept, amend or reject.

⛔ **This is not a rank** ([ADR-035](../decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
The order below is a **recommended sequence**, derived from dependency and file-contention facts. All
106 rows remain `🔲 Backlog`, unranked, with their verdicts and themes attached — per the owner's
ruling *"Scoped sprint, rest stays Backlog (Recommended)"*.

**18 rows** — inside the requested 15–25, and in line with the last three sprints (4, 8, 17).

### Group A — Foundation, runs first (3)

| # | id | theme | size | why it earned a place |
|---|---|---|---|---|
| 1 | **`0306`** | citations | M | ⭐ **The owner ruled it in, and ruled it early.** Repairs the coordinates and dependency lines the other 17 rows must read. ⚠️ It edits briefs across 17+ open folders — **run it first and alone**; it touches `0168`, `0046`, `0204` and `0223`, all of which are in this proposal. |
| 2 | **`0171`** | conventions | L | ⭐ **The prevention half.** Writes `durable-citation-anchors` — the rule that stops the decay recurring. Part 1: scheduling it early *"changes what the other five cost."* Its own staleness is `S` (the scaffold already reads *"Seven"*). Also unblocks `0172` and soft-gates `0197`. |
| 3 | **`0178`** | conventions | S | ⭐ **Highest leverage-per-hour on the board.** A doubly hard gate: `0179` and `0180` both need it, and its **date** is `0180`'s cut-off boundary, so `0180` cannot be defined until it lands. Unblocked, small, unwritten. |

### Group B — Ready today, and nobody noticed (4)

| # | id | theme | size | why it earned a place |
|---|---|---|---|---|
| 4 | **`0218`** | citations | S | ⭐ **Cheapest unlock on the board.** One file. Repairs the broken middle of `0220` → `0177` → `0218`; without it `0177`'s worker is told to reproduce a cap the repo does not have. |
| 5 | **`0177`** | testing | S | Follows `0218` **in this sprint** — `0218` landing first is what makes it workable. Together they clear the path to `0220` in a later sprint. |
| 6 | **`0046`** | tooling | S | A **live, ungated** symlink-escape hazard in `fkit-claude-init.sh`, where the same file guards every other write in exactly that form. Dep discharged; free today. |
| 7 | **`0223`** | loop | M | `0222` closed, ADR-038 exists, deliverable is one row in one file. ⚠️ **Sequence before `0204`** — both edit `fkit-sprint-ship-loop/SKILL.md`. |

### Group C — High report-to-cost (4)

| # | id | theme | size | why it earned a place |
|---|---|---|---|---|
| 8 | **`0280`** | wiki | S | ⭐ **Largest re-reported-to-cost ratio on the board** — reported 3+ times, still true. One paragraph. The lint skill claims *"this project has no CI"* and backs it with a citation to `architecture.md:390` **that does not say it**, while `.github/workflows/test.yml` exists. ⛔ It edits `claude/`, **not** the vault — so it is coder-ownable and does **not** need `0270`. |
| 9 | **`0302`** | tooling | S | **Fully ruled, zero open questions.** Enter→lead at the role menu. The cleanest row on the board. |
| 10 | **`0250`** | tooling | S | The scaffold's `CLAUDE.md` producer row omits `/fkit-task-brief` while `skills_for_role()` grants it. **Ships into every consuming project.** Needs a manifest regen. |
| 11 | **`0198`** | process | S | Teaches `/fkit-record-decision` the dated-correction-note form. ⭐ **Four open rows (`0196`, `0197`, `0205`, `0207`) each re-derive that form from a closed folder without it — four re-derivations is how a form forks.** |

### Group D — Load-bearing, larger (4)

| # | id | theme | size | why it earned a place |
|---|---|---|---|---|
| 12 | **`0204`** | loop | L | ⭐ **The loop's own honesty depends on it.** Gate discharged. Until it lands the ship-loop emits an `unverified` marker on **every** spawn; the day it lands, **five** enumerated sites at `fkit-sprint-ship-loop/SKILL.md:201-214` become false and must be deleted **in the same change**. ⚠️ It does **not** close the `carried-not-approved` residual and must not be written up as if it does. ⚠️ Sequence after `0223`. |
| 13 | **`0168`** | citations | L | ⭐ **The flagship unnoticed row** — a *hard* block discharged with no correction. Also unblocks `0175`. Its generator is unchanged, so **every future close reproduces the class** until it lands. |
| 14 | **`0188`** | records | M | Five defects **all verified live**. D1 (scaffold `CLAUDE.md`) and D5 (root `CLAUDE.md`) **ship into every consuming project and into every session's context**. Also `0189`'s hard gate by owner ruling. |
| 15 | **`0300`** | tooling | M | A release false-green that **passes its own verify command** — `bin/release.mjs` resolves the branch as a push target with no HEAD-vs-branch guard. Release integrity. Filing-time concurrency caveat discharged. |

### Group E — Decisions that stop future rework (3)

| # | id | theme | size | why it earned a place |
|---|---|---|---|---|
| 16 | **`0270`** | loop | M | ⭐ **Every sprint run without it re-writes its cost into another brief.** The loop's Build step is fixed to `@fkit-coder` and never reads `## Owner`; five open rows carry near-identical paragraphs explaining they are therefore excluded. ⚠️ **It is also the precondition for ever scoping a vault-writing row.** Decision-only. |
| 17 | **`0272`** | review | M | The **only unblocked head** of the `0272` → `0273` → `0287` chain, and the ADR-042 D1 work has **not** landed. ⛔ Carries a spent placement ruling — **owner fork §8.1**. |
| 18 | **`0229`** | ownership | M | Owner ruled *"Ship 0229 standalone."* Unblocked, sprintable, and the drift it fixes is being paid every day it waits. |

### ⭐ Recommended order

`0306` → `0171` → `0218` → `0177` → `0178` → `0198` → `0280` → `0302` → `0250` → `0046` → `0223` →
`0204` → `0168` → `0188` → `0229` → `0300` → `0270` → `0272`

**The order encodes four facts, not a ranking:** (1) `0306` first, because it edits four of the other
rows' briefs; (2) `0171` before the citation work, so repairs have an anchor form to land in;
(3) `0218` before `0177`, the broken chain link; (4) `0223` before `0204`, same contended file.

### ⛔ Candidates evaluated and NOT proposed — the reasoning, not just the outcome

**All eight rows the triage surfaced are in.** These were weighed and left out:

- **`0189`** (`L`) — hard-gated on `0188`, which **is** in. But at 39 rows / 21 classes / 61 files it is
  the largest single item on the board and would dominate a sprint of this size. **Sprint 7, behind
  `0188`.**
- **`0236`, `0237`** (`L` each) — both need re-derivation against **five** archived boards, and `0306`
  + `0171` change what they cost. ⭐ **Running them after this sprint is strictly cheaper than beside
  it.** ⚠️ `0237` gates `0176`, so this defers `0176` too — stated so the cost is visible.
- **`0234`, `0235`** (`L` each) — `0234`'s blast radius grew from one archived board to five since it
  was costed. **Re-cost before scoping.**
- **`0224`** — ⛔ **cannot enter a sprint.** Held by an unruled owner decision (the denial-log path),
  which also holds `0233` shut. **Fork §8.2.**
- **`0233`** — inert until `0189` and `0224` both land.
- **`0303`, `0304`, `0305`** — filed today and **mutually entangled**; `0304` says it and `0303` *"may
  be ALTERNATIVES, NOT COMPLEMENTS"*. ⭐ **Sequencing them matters more than shipping them**, and that
  sequencing is an owner call not yet made.
- **`0262`** (`L`) — its premise is partly falsified by the `geoconflict` run. **Fork §8.3 first.**
- **`0199`, `0212`, `0231`, `0239`, `0287`** — ⛔ **all write `ai-agents/wiki-vault/` and must route to
  `fkit-wiki`** (ADR-005). The loop's Build step cannot route them. **That is what `0270` decides, and
  `0270` is in this sprint — deliberately ahead of them.**
- **`0154`, `0240`, `0290`** — each carries an unresolved owner fork (§8). Cheap, but scoping them
  before the ruling risks building the wrong thing.

⚠️ **What this sprint does NOT contain, stated plainly:** no `wiki-vault/` write, no row larger than
`0168`/`0171`/`0204`, and **no row from the `testing` theme except `0177`** — the board's largest
theme (17 rows) is almost entirely deferred, because its two heads (`0178`, `0188`) are in this sprint
and its guards are cheaper once they land.

---

## 8. ⛔ Genuine forks — the owner must rule; not decided here

Of the ten residual questions the four parts returned, **four are folded** and are not repeated as
forks: `0221` and `0193`'s dead citations, `0296`'s sweep corroboration, and `0177`'s *"stays 4096"*
fence (dissolved by `0218` shipping first). `0183`/`0193` and `0171`'s scheduling are folded into
`0306` and §7. **Six require a ruling.**

1. **`0272` — its placement ruling is spent.** *"Pull into Sprint 5 at `P17`, then move to `P6`"* is
   unexecutable: Sprint 5 archived with no successor. **Does it re-target the next sprint opened, or
   lapse to an ordinary unranked Backlog row?** ⚠️ Bears directly on §7 — `0272` is proposed into
   Sprint 6, which would be one answer to a question the owner has not been asked.
2. **`0224` — the denial log's path is unruled.** `.fkit/` is gitignored, so the ruled *"git-tracked,
   append-only"* shape has **no home**. ⛔ **This blocks the coder and holds `0233` shut.** It is the
   only row that cannot be scoped at all until ruled.
3. **`0262` — does the `geoconflict` run of `v0.2.2` partly discharge it?** The launch-notice slice was
   exercised in a real consuming project today; the heal/repair leg, `FKIT_CLEANUP_DRY_RUN` and the
   field report were **not**. ⭐ `0262` is the task that discharges the **2026-08-10 promise to
   personally verify `0245`/`0246`** — whether that promise is now partly met is the owner's call.
4. **`0154` — rescope or drop?** Its assertion list pins a rule **ADR-033 reversed**: pinning *"do not
   spawn the producer"* would guard the **opposite** of today's rule. ⚠️ A rescope is real work; the
   row's value after rescoping is a judgement, not a measurement.

   > ⛔ **SUPERSEDED LATER THE SAME DAY, 2026-08-14 — THIS FORK IS WITHDRAWN. The item above is left
   > byte-identical.** Its premise is false in **both** halves: the clause is **live** in all three wiki
   > skills (it wraps across a line break — measured naive `0` / normalised `1` in each), and ADR-033
   > does **not** reverse it — item 4 has the **ship-loop driver** spawn the producer to close, while
   > the clause forbids the **wiki** doing so on its own initiative. Two actors, one rule; pinning the
   > clause pins **current** policy. ✅ **Owner-ruled 2026-08-14** — verbatim option label:
   > ***"Keep it, with the wrap-tolerance requirement (Recommended)"***. **`0154` is a clean `KEEP`**,
   > and the guard it builds must normalise whitespace before matching. ⛔ It is **not** added to
   > Sprint 6. **Five forks here still require a ruling, not six.** Full note: the dated correction at
   > the end of §6.
5. **`0240` and `0221` would ship wrong as written.** `0240`'s entire ordering rationale expired
   (`0182` shipped, `0222` closed, `adr-039`…`043` all taken); `0221`'s ⛔ *"repair exactly one
   premise"* constraint now names the wrong count. **Re-scope in place, or re-file?**
6. **`0290`'s fence is inverted** — it forbids saying the page carries all three blocks on the basis
   that `0289` had not run; `0289` has now run and the page carries its block. **Append a dated
   correction note (the `0272` treatment), or leave it to re-measurement at pickup?** ⚠️ The
   investigation is unaffected either way, but the brief **will mislead** whoever picks it up.

**Plus one fork this synthesis raised that the four parts did not:**

7. ⭐ **Does the cleanup extend to `claude/`?** *"task 43"* has **10 occurrences in live source**
   (`claude/README.md`, `claude/fkit-claude.sh`, `claude/skills-for-role.sh`) and is **actively
   re-seeding** the mis-resolving numeral into new briefs — `0302` and `0305`, both filed 2026-08-14,
   copied it from there. `0306` scopes `claude/` **out** (a different change class, with a dual-home
   parity test and a structure manifest behind it) and **reports** it. ⛔ **Repairing only the
   `ai-agents/` half is a partial fix and `0306` is written to say so.**

---

## Provenance

Synthesis run 2026-08-14 by a **spawned `fkit-producer` with no owner channel**
([ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)), invoked from
`/fkit-sprint-ship-loop` in a live `fkit lead` session. **Files written: this report, and
`ai-agents/tasks/backlog/0306-…/brief.md` plus its board row.** No task file moved and nothing
cancelled ([ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md) —
the movers are producer-only; it reverses
[ADR-025](../decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md)),
nothing re-ranked ([ADR-035](../decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
no vault write ([ADR-005](../decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)), no
commit. **Board re-verified after the row was added:** `dashboard.sh` exits `0`, anchored
`^drift ` unchanged at `0`, anchored `^derive .*UNPARSEABLE` unchanged at `0`, `count backlog 107`.
