# Implementation plan — task `0338`: flip `select-active` to the lowest-ordered open sprint

**Spec: ADR-047**, read in full (1310 lines). ⛔ **Where the brief and the ADR differ, the ADR wins** —
the three differences are listed below.

## ⛔ Refutations and measurements that lead

**1. The repin surface is ~3× what ADR §2.4 counts. Measured, not estimated.** Adding the render-path
`sprint-status-missing` drift alone **reds 17 tests** in `dashboard-contract.test.js` (148 → 131 pass).
§2.4 and §Consequences only ever name the **eight** `select-active` S-scenarios. The 17 are render-path
tests (exact-stdout, roll-up, `0210/*`, `task 65/*`), red because `plan()`'s fixtures have no line-3 banner.

**2. ⭐ And the fix is TWO LINES, also measured.** Giving the shared `plan()` fixture helper a line-3
banner takes all 17 back to green — **148/148, with no expected-stdout string touched.** The banner in
the plan source does not leak into the rendered board. ⭐ **So the 17 are a HELPER change, not 17 repins.**

**3. §2.4's list of eight is INCOMPLETE — there is a NINTH exact-equality `activeLine` site:** test
*"ADR-041 R5: an unreadable candidate resolves to 'unresolved', never to a wrong identity"*, asserting
`activeLine(sel.out) === 'active file="sprint-3.md" identity="Sprint 3"'`. In neither §2.4's list nor
§9.1's. ⛔ It breaks **twice** — added `status=`, and its `prosePlan` fixture goes ineligible.

**4. ⭐ §6.1's trap-vs-swap confirmed by my own transcript, not taken on trust.** On the P14 tie fixture:
today → `plan-sprint-6.md`; **trap** (`! identity_gt "$_i" "$_best_id"`) → **`sprint-6.md`** (last-wins,
⛔ violates ADR-041 §1.5); **swap** (`identity_gt "$_best_id" "$_i"`) → `plan-sprint-6.md` ✓.
⛔ **On the P5 direction fixture trap and swap AGREE** (both pick `Sprint 4`) — so **P5 cannot
discriminate and P14 is the only test that can.**

**5. ⛔ The brief disagrees with the ADR in three places; the ADR wins** (the brief itself demands this
be reported back): (a) brief item 3's `chosen file=` line is the ADR's **`board`** line (§2.3a);
(b) brief item 2's `drift sprint-status-unresolved` is the ADR's **two** kinds, `sprint-status-missing`
+ `sprint-status-malformed` (§2, §7); (c) brief item 3's **`drift active-marker-invalid` does not exist
in the ADR at all** — §7's nine kinds have no such name, and under §2.1 the marker lives *inside a
banner*, so "a marker pointing at a missing plan" is structurally impossible. `active-marker-on-non-active`
covers the real case.

**6. ⭐ The brief's fence holds and NO `0271` guard reds — verified in their own text.** `0271/4` and
`0271/5a` match by prefix/regex and their comments name `0338` explicitly (*"0338 extends this mode's
output grammar deliberately … an exact-equality guard would red for that deliberate change"*). Only
prove-red mutations **14** and **32** touch `dashboard.sh`, and neither targets the selection site,
`VERSION_MARKER`, `is_eligible`, or line-3 parsing.

**7. ⚠️ One v2 site §9.1 misses:** `claude/skills/fkit-status/throughput.mjs:30` carries
`⟦fkit-dashboard v1⟧` in a contract comment. Prose, not a check — but it goes stale on the bump.

**8. ⭐ Criterion (a) is genuinely reachable, and I checked the input:** `ai-agents/sprints/sprint-8.md`
line 3 is exactly `> ## 🔄 In progress — 2026-09-10.`, line 4 is `>`. Matches §2's tightened recognizer
byte-for-byte. Today's selector prints `active file="sprint-8.md" identity="Sprint 8"` with **no status**.

**Baseline re-measured, HEAD `9943dcf`:** `npm run test:unit` → **877/877** (70s). `dashboard-contract`
→ **148/148** (13s). ⚠️ **Could not reproduce "guards 41/41"** — `test/prove-red.sh` has **46** gate
lines and **32** mutations. prove-red **not run** at plan time.

## Files this task touches — four, and no others

| File | Why |
|---|---|
| `claude/skills/fkit-status/dashboard.sh` | status reader, eligibility rung, plural `active` + `board` line, `status <plan>` mode, seven drift kinds, `v2` marker |
| `claude/skills/fkit-status/SKILL.md` | argument contract, the N-sprint beat shape, three `v1` sites |
| `claude/skills/fkit-status/throughput.mjs` | one stale `v1` comment (ruling **AB2**) |
| `test/dashboard-contract.test.js` | P1–P17, the nine repins, the fixture-helper banner, the `activeLine` fix |

⛔ **Not touched:** `ai-agents/sprints/**`, ADR-047, `fkit-sprint-ship-loop/SKILL.md`, `resolve_identity`
/ the identity ladder / the candidate set / the `Backlog` token / §1.5's tie-break rule, the `.claude/`
mirror, `test/prove-red.sh`. No commit, no push, no mover, no vault write, no re-rank.

## Step 1 — the recognizer and the status reader (§2)

One function in `dashboard.sh`, beside `resolve_identity` so "one grammar, one implementation"
(ADR-041 §5) is visibly obeyed:

```
plan_status_raw <plan-file>   ->  "<status-token>\t<kind>"
```

- Reads **line 3 only** (`sed -n '3p'`). ⛔ Never "find the banner anywhere" — §2's strict-position rule
  is the whole reason a `> ## ` deeper in a board is harmless (P10).
- Matches §2's regex verbatim.
- `🔒 CLOSED` → `Done` (V3, permanent compat rung — read forever, written never).
- Line 3 begins `> ## ` **and** carries one of the five markers but fails the regex → `unresolved/malformed`.
- Anything else → `unresolved/missing`.
- ⛔ Guard readability as the ladder does: `[ -r "$1" ] ||` → `missing`, **never a guessed status**
  (ADR-040's "wrong is worse than none").

Companion: `plan_has_active_marker <plan-file>` — the literal `⭐ ACTIVE BOARD` in line 3's trailing prose (§2.1).

⭐ **Why one function returning two fields:** the status token and the *reason* it is unresolved are two
facts, and §2 requires them distinguishable (`missing` must never read as `malformed`). Two separate
parses would be two readings of one line — the defect §2 and ADR-041 §5 both forbid.

## Step 2 — the `status <plan>` mode (§2.3a)

Mirrors `mode_identity`'s value-not-rendering contract: prints one token, ⛔ **no `⟦…⟧` markers**
(§9.2 item 1 — a marker here would break every `$(dashboard.sh status …)` caller). Exit 0 resolved ·
3 unresolved · 1 usage.

⚠️ **Concrete measured constraint:** the usage string is asserted by an **unanchored** `assert.match` in
test *"ADR-041: the historic one-argument board render is unchanged; a bad subcommand is a usage error"*.
⭐ **APPEND** `| status <plan>` to the end of `USAGE` and it stays green; **inserting** it before
`select-active <sprints-dir>` **reds** it. ⭐ Append, and say so in the worklog so a later reader does
not read the ordering as aesthetic.

## Step 3 — eligibility gains a status rung (§5, §6.4)

⭐ **`is_eligible` stays EXACTLY as it is — the identity rung only.** The status rung is a **separate**
filter at the `select-active` selection site.

⛔ **Why, and this is load-bearing:** the render path also calls `is_eligible "$PLAN_SPRINT"` for its
ADR-041 §1.5 ambiguity check, where "eligible" means *identity* eligibility by design (its own comment:
*"ELIGIBLE IDENTITIES ONLY, deliberately"*). **Widening `is_eligible` to include status would silently
stop `ambiguous-plan-identity` firing on a non-`In progress` board — and P12 requires it to fire.**
Keeping the rungs separate also keeps ADR-041 §1.3 readable as still-in-force with a rung added on top,
which is what §8.2 says happened.

Order is §6.4's exactly: **resolve identity + status → filter to eligible → order lowest-first →
tie-break by byte order, first wins.**

## Step 4 — `select-active` prints all, picks one (§2.3, §2.3a, §6.1)

⭐ **The comparator change is §6.1's ARGUMENT SWAP, not a negation:**

```
-    if [ -z "$_best_id" ] || identity_gt "$_i" "$_best_id"; then
+    if [ -z "$_best_id" ] || identity_gt "$_best_id" "$_i"; then
```

⛔ `identity_gt` itself is **byte-unchanged** — its length-then-bytes comparison exists for the
leading-zero and 30-digit-overflow hazards its own comment names; direction has nothing to do with either.

**Plural `active`.** Collect every eligible record, then order ascending by a selection-sort using
`identity_gt` as its **only** comparator — ⛔ no second sort key, no `sort` call, no arithmetic. A stable
min-scan over the glob-ordered list gives ADR-041 §1.5's "first in byte order wins a tie" for free.

⭐ **One `active` line per SPRINT, not per file.** §2.3a says "one per `In progress` sprint", and **P14
pins it**. On a same-identity collision the losing claimant appears only as a `candidate` and in the
drift record's `also=`.

**Emission order** (§2.3; P17 makes it byte-normative): `⟦fkit-dashboard v2⟧` → `⟦SELECT⟧` → every
`active` line ascending (or the bare `active none` sentinel) → the `board` line (**iff** ≥1 active) →
every `candidate` line in glob order **with `status=`** → `⟦FACTS⟧` → drift records → `⟦END⟧`.

- `active file="…" identity="…" status="In progress"` — status **printed, never implied**.
- `active none` — ⛔ **no fields at all**; a sentinel, not a record.
- `board file="…" identity="…" status="…" reason="lowest-ordered"|"active-marker"` — exactly one.
- `candidate file="…" identity="…" status="…"` — one per candidate.
- **One space** between every field. ⭐ **Parse by key, never by position.**
- Exit **0** with ≥1 active; **3** on `active none`. Unchanged.

**Marker override (§2.1, OQ-1).** `⭐ ACTIVE BOARD` in an `In progress` banner's trailing prose sets
`board … reason="active-marker"`; the `active` set is unchanged. Two or more claimants →
`ambiguous-active-marker` **and** fall back to lowest-ordered (P7 asserts both, plus reach).

⭐ **I verified §2.3's two example blocks are actually producible** — non-trivial, since P17 makes them
byte-normative and the first amendment already shipped one that could only red. Block 1: `backlog.md` is
carved out of `sprint-status-missing`, so `⟦FACTS⟧` is empty ✓. Block 2: `sprint-7.md` is `Done` at
depth 1, and `sprint-terminal-not-archived` is **render-path only**, so `select-active` emits nothing ✓.
**P17 is writable.**

## Step 5 — the drift facts, and which mode emits which (§7, §7.1, §7.2)

**`select-active` emits exactly four kinds** — `sprint-status-missing`, `sprint-status-malformed`,
`active-marker-on-non-active`, `ambiguous-active-marker` — plus the inherited `ambiguous-active-sprint`.
⭐ Reach obligation is **`⟦FACTS⟧` only**; ⛔ **`select-active` gains NO roll-up** (§7.2).

**The render path emits** `sprint-status-missing`, `sprint-status-malformed`,
`active-marker-on-non-active` (for the board it renders), plus the three archival kinds
`sprint-terminal-not-archived`, `sprint-archived-not-terminal`, `sprint-status-location-mismatch` —
⛔ **never `select-active`'s** (carve-out 2). Each also sets `plan_level_drift=1` so it reaches the
roll-up's drift clause.

⛔ **`ambiguous-plan-identity` is NOT merged with `ambiguous-active-sprint`**, and its existing field set
is **not reshaped** — §7's table foot rests on it.

⛔ **Carve-out 1, hard:** `sprint-status-missing` does **not** fire for a `Backlog` or `unresolved`
**identity** — read in identity-space (§1.2). ⛔ `sprint-status-malformed` is **not** carved out for
anyone (X1/R24).

**Archive-location detection:** by `PLAN_DIR`'s tail — `*/sprints/done` / `*/sprints/cancelled` /
`*/sprints`. ⭐ A plan rendered from a path not under a `sprints/` directory emits **none** of the three
location drifts, rather than guessing. Named because it is a decision the ADR leaves to the code.

**The seven drift field sets — X2's residual, spent here per ruling AB3:**

| Kind | Record |
|---|---|
| `sprint-status-missing` | `plan="<basename>"` |
| `sprint-status-malformed` | `plan="<basename>" line3="<the offending line>"` |
| `active-marker-on-non-active` | `plan="<basename>" status="<resolved status>"` |
| `sprint-terminal-not-archived` | `plan="<basename>" status="<Done\|Cancelled>"` |
| `sprint-archived-not-terminal` | `plan="<basename>" location="<dir>/"` |
| `sprint-status-location-mismatch` | `plan="<basename>" status="…" location="<dir>/"` |
| `ambiguous-active-marker` | `chosen="<lowest-ordered>" also="<every other claimant>"` |

⭐ `plan=` in **both** modes (never `file=`): these state a fact about a **board**, not about a choice, so
`dashboard.sh`'s own comment ruling `plan=` apart from `chosen=` — *because `plan=` does not imply a
choice was made* — is exactly right for all seven. `location=` mirrors the existing
`drift disagreement … location="$found_dir/"`. Every value goes through `fact_value`.

## Step 6 — the `v2` bump (§9)

One definition (`VERSION_MARKER`), ⛔ **TWO emit sites** (`⟦SELECT⟧` and `⟦BOARD⟧`) — **a
`select-active`-only bump is not implementable**, so the board render's output changes too. ⛔ No
dual-version parser; the tree moves at once.

**Verified myself:** five `v1` assertions in `test/dashboard-contract.test.js`, and §9.1's five test
names are correct. Three `v1` sites in `fkit-status/SKILL.md` — correct. ⚠️ **Plus the one §9.1 misses:**
`throughput.mjs:30` (ruling **AB2**).

## Step 7 — `fkit-status/SKILL.md` (§5, and ruling AB5)

- Rewrite the argument contract: empty argument reports **every** sprint the script lists as `active`;
  ⭐ **the `board` line is the single-board answer** for any caller that needs one; `candidate … status=`;
  the four new drift records in `select-active`'s `⟦FACTS⟧`; `active none`/exit 3 unchanged.
- ⛔ Correct the *"taken the highest"* text.
- N-sprint briefing shape per §5's table: beats **1, 4, 6 once across all**; beats **2, 3, 5 per sprint**
  ascending; beat **7 one table per sprint**; one closing cross-sprint line. **Still one output.**
- A named sprint and `Backlog` are unchanged.
- Three `v1` → `v2`. Document `status <plan>` beside `identity <plan>`.
- Verification: `grep -n "highest"` over both files leaves no hit stating the selection rule.

## Step 8 — tests (`test/dashboard-contract.test.js`)

**Fixture helpers first — this is the 17-test fix, measured:**

1. `plan()` gains a `banner` option defaulting to `> ## 🔄 In progress — 2026-01-01.` + a `>` spacer at
   lines 3–4; `banner: null` suppresses it. ⭐ **Measured: this alone takes the 17 render-path reds to
   148/148 with no expected-stdout edit.**
2. `prosePlan()` gains the same option, same default. ⭐ The S-fixtures then keep testing the identity
   ladder instead of silently becoming status tests.
3. ⭐ **`activeLine` stops swallowing plural output** (§2.4, P17): make it **throw** when more than one
   `active` line is present, and add `activeLines(out)` for the plural tests. ⭐ **A wrong test can then
   no longer stay green.**
4. Repin the **nine** exact-equality sites (S1, S1b, S2, S3, S5, S6, S7, S8 — **and `ADR-041 R5`**) with
   ` status="In progress"`. S5/S8's `active none` assertions are unchanged; give their
   `backlog.md`/`sprint-backlog.md` fixtures `banner: null` so ⭐ **S5 becomes a live guard for carve-out 1.**
5. Update `0271/5a`'s comment, which predicts a `chosen file=` line — the ADR named it `board`. The test
   itself is field-tolerant and passes untouched.

**Then P1–P17, each named for ADR-047.** ⭐ **Build red-first, and P14 goes in BEFORE the comparator
swap** — it is the only test that discriminates trap from swap, and the transcript shows P5 does not.

## Step 9 — verification

1. `npm run test:unit` (⛔ **never bare `npm test`** — `package.json:5` chains into prove-red).
2. `node --test test/dashboard-contract.test.js`.
3. On this repo, **canonical path** (⛔ not the gitignored `.claude/` mirror):
   `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` → expect
   `active file="sprint-8.md" identity="Sprint 8" status="In progress"`, `board … reason="lowest-ordered"`,
   `candidate file="backlog.md" … status="unresolved"`, **no drift**, **exit 0**. ⛔ Per the brief's
   appended note, anything else here **is a defect**, not a pre-migration state. ⭐ **Paste the output.**
4. `dashboard.sh ai-agents/sprints/done/sprint-7.md` and `… backlog.md` — confirm **no** false archival
   drift and **no** false `sprint-status-missing`.
5. All seven real `🔒 CLOSED` banners under `sprints/done/` parse to `Done` (P16's tail).
6. `grep -n "highest"` over `dashboard.sh` + `SKILL.md`.
7. ⭐ **`bash test/prove-red.sh` — genuinely in scope**, because this task changes executable code.
   ⚠️ Budget: `test:unit` measures **70s** here and prove-red runs 32 mutations mostly against the full
   suite, so **~40–60 min** is an estimate, ⛔ **not measured — report the real figure.**
8. Brief step 4 (`/fkit-status` on a two-sprint fixture) — per ruling **AB4**, a producer consult.

## Risks carried, named

- ⚠️ **Accepted cost of the fixture-banner default:** after step 8.1, "no banner" stops being the default
  fixture state, so a regression where the render path *fails* to emit `sprint-status-missing` is pinned
  by **P3 alone**. ⛔ **P3 is therefore not optional and must assert both routes.**
- ⚠️ **Beat-shape prose (§5) is unverifiable by the contract suite** — markdown an LLM executes. Its only
  real check is ruling AB4's consult.
- ⚠️ prove-red mutations **14/32** re-run the dashboard suite against a mutated copy and require a red at
  a **named** assertion; extra reds are tolerated by design (mutation 32's own comment says so). ⭐ Confirm
  rather than assume.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-11

Given live via `AskUserQuestion`. Option labels **verbatim**. These bind the Build and Process-review workers.

| # | Question | Owner ruling | What it settles |
|---|---|---|---|
| **AB0** | Approve this plan? | Approved via AB1–AB5 | ⛔ Every step above stands as written except where narrowed below. |
| **AB1** | ADR §2.4's repin inventory is short by one and never counts the 17 render-path tests. Proceed, or amend the ADR first? | **"Proceed; record in the worklog (Rec)"** | ⭐ **Build on the MEASURED surface.** ⭐ **Record both corrections in `0338`'s worklog**; a producer decides later whether ADR-047 earns a third dated amendment. ⛔ **Do NOT amend ADR-047** — it is accepted and closed, and its own §Consequences warns that *"amending an accepted ADR under time pressure is how a design ruling acquires new gaps"*. ⭐ Neither correction changes a design ruling: §2.4 is an **inventory of an implementation surface**, measured 2026-09-10 against a tree that has since moved. |
| **AB2** | `throughput.mjs:30`'s stale `⟦fkit-dashboard v1⟧` comment, which §9.1's table misses. | *Folded in by the driver as the planner recommended* | ⭐ **Fix it in `0338`.** One word, in a file inside the skill directory this task already edits. ⭐ It is a **comment, not a check** — nothing refuses or mis-parses because of it — but it states a fact about `dashboard.sh`'s output that `0338` makes false, in the one directory where a reader is most likely to trust it. |
| **AB3** | X2's residual leaves the SEVEN new drift field sets to the implementer, and names the cost: *"a field set chosen carelessly there is the one that ships."* | **"`plan=` in both modes (Rec)"** | ⭐ **Adopt Step 5's table as proposed.** `plan=` names the board in **both** modes, `status=` where a status is the point, `location=` mirroring the existing disagreement record, `chosen=`/`also=` on `ambiguous-active-marker`. ⭐ Basis: `dashboard.sh`'s own comment rules `plan=` apart from `chosen=` **because `plan=` does not imply a choice was made** — true of all seven. ⛔ Not `file=` inside `⟦SELECT⟧`. ⚠️ **One-shot choice** — X2's re-raise trigger is a second consumer reading drift records **by field**, which does not exist today. |
| **AB4** | The brief's Verification step 4 says run `/fkit-status`, which the coder's role lock denies (ADR-018 hook, any spawn depth). | **"Producer consult after the build (Rec)"** | ⭐ **After the build, the DRIVER spawns `@fkit-producer` as a read-only consult** — *"run `/fkit-status` empty-arg on this fixture and report what it rendered."* The producer owns the skill. ⛔ **The coder does not attempt it.** ⭐ **Fallback if the consult returns empty: drop step 4 and record the beat-shape prose as UNVERIFIED, with the reason** — ⛔ never silently. ⭐ This is the **only** check on §5's N-sprint beat shape; the contract suite cannot reach markdown an LLM executes. |
| **AB5** | After `0338`, `fkit-status`'s empty-arg rule reports N sprints, but the ship-loop delegates to it by reference and needs ONE board — and the brief fences the ship-loop off as `0339`'s. | **"Close it inside fkit-status (Rec)"** | ⭐ **Write the `board` line's single-board contract into `fkit-status/SKILL.md` — this task's OWN file.** ⛔ **Do NOT touch `fkit-sprint-ship-loop/SKILL.md`** — the brief's fence holds. ⭐ The ship-loop's existing pointer then lands on a rule that names the single-board answer. ⭐ Verified by the planner: the ship-loop does **not** parse the stream itself (no `select-active` call outside `fkit-status/`, no version check), so the v2 bump does not break it silently. |
