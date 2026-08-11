# Implementation plan — task `0259`: add the red fixture

## 1. Goal, in one line

Add **one** new test case to `test/dashboard-contract.test.js` that reproduces the downstream `PLAN_SPRINT` defect — a `plan-sprint-4.md` filename with a product-prefixed H1 — and assert drift rule 1 still skips. **It goes RED on today's code, and that is the deliverable.** No `dashboard.sh` change.

## 2. Grounding — what I verified on disk (2026-08-11)

Read, not assumed:

- `claude/skills/fkit-status/dashboard.sh:83` — `sed -n 's/^# \(Sprint [0-9][0-9]*\).*/\1/p'`. H1 must **start** `# Sprint N`. `# Geoconflict — Sprint 4 — …` → no match. ✓
- `dashboard.sh:87` — `basename … | sed -n 's/^sprint-\([0-9][0-9]*\)$/Sprint \1/p'`. `plan-sprint-4` → no match. ✓
- `dashboard.sh:93` — `backlog` basename special case. `plan-sprint-4` ≠ `backlog`. ✓
- ⇒ `PLAN_SPRINT` resolves **empty**.
- `dashboard.sh:802` — rule 1's guard is `elif [ -n "$PLAN_SPRINT" ] && [ -n "$b_sprint" ] && [ "$b_sprint" != "$PLAN_SPRINT" ]`. Empty identity ⇒ guard false ⇒ falls through to rule 3's cross-check ⇒ `drift disagreement`. **That is the red.**
- `dashboard.sh:906` — `add_fact "drift unresolved-plan-sprint h1=…"` fires when `PLAN_SPRINT` is empty. That is the mechanism the brief's verification step 2 wants shown.
- **`basename "$PLAN_FILE"` is used in exactly three places** (`:54`, `:87`, `:93`) — grep-verified. The plan filename influences **nothing** but identity resolution, so renaming the fixture's plan file cannot perturb any other assertion.
- `dashboard.sh:126` — `STATUS_HEADING_RE=$'^## Status[ \t]*$'`; `:206` `die`s without it. **The reporter's real plans use `## Sprint 4 Status` and die here before reaching drift logic** (report §7 note 2 — their data defect, explicitly not ours). Our fixture must therefore use `## Status`. This is a deliberate, documented deviation from "§7 verbatim" and belongs in the test comment.
- `test/dashboard-contract.test.js:641` (R8 #1) and `:654` (R8 #2) — read in full. `:654` is the hand-built precedent. `backlogFixture` at `:1583` is the closer template: hand-built root + shared `foldBriefsAndPlan` + **caller-chosen plan filename**.
- `foldBriefsAndPlan(agents, briefs, planText)` at `:47` is module-level and reusable — it injects `## ID` and `## Owner` and folder-izes hrefs, so the fixture emits **no** incidental `brief-missing-owner` / `id-mismatch` noise.
- `package.json` — `test` = `node --test test/*.test.js && bash test/prove-red.sh`.

**Wiki/KB context that materially changes the brief's framing — flagged, not silently absorbed:**

- The brief says the test is known-red "until `0260`'s decision lands". **`0260` has already closed.** Its output is **`ADR-040` — "A plan's sprint identity is a whole H1 segment, never a substring"**, status `accepted`.
- **ADR-040's required-test table line `T1` is this exact fixture, verbatim:** `plan-sprint-4.md`, H1 `# Geoconflict — Sprint 4 — In-App Monetization & Citizenship`, brief `## Sprint: Sprint 9`, expect identity `Sprint 4`, rule 1 skips → **zero** `drift disagreement`. So the fixture below is not merely brief-compliant, it is the ADR's `T1`.
- The **implementation follow-on is `0264`** (Sprint 5 `P4`), whose brief says *"T1 is `0259`'s red fixture, **do not duplicate**"*. `0264` is what turns this green.

## 3. Scope

**One file changed: `test/dashboard-contract.test.js`.** One new `test(...)` block, inserted **immediately after** the `R8: an entirely unresolvable plan sprint is REPORTED, not silently ignored` case (ends ~`:670`) and **before** the `// R14 —` comment block, so the three R8 cases read as a set.

Plus one non-source artifact: **`ai-agents/tasks/backlog/0259-…/worklog.md`** (see §7).

## 4. The change — exact code to insert

```js
// R8 (third case) — ⛔ KNOWN-RED, ON PURPOSE. THIS TEST IS EXPECTED TO FAIL on today's dashboard.sh.
// If you are staring at a red suite: this is a filed, known defect, not a break you just caused.
//
// The defect — reported by a downstream fkit project running 0.2.1, against the same 945-line
// dashboard.sh we ship:
//   ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md
// Task 0259 files this fixture · task 0260 decided the fix shape → ADR-040 (accepted), where this
// case is required test T1 · task 0264 is the implementation follow-on. IT GOES GREEN WHEN 0264
// LANDS ADR-040's identity grammar, and not before.
//
// ⛔ Do NOT make it pass by widening either matcher ad hoc. ADR-040's hard constraint: a WRONG
// identity is strictly WORSE than NO identity — `plan-sprint-4c.md` naively resolving to "Sprint 4"
// makes rule 1 live and wrong, turning today's LOUD failure into a SILENT one.
//
// Why the two R8 cases above do not catch it: :641 proves the filename fallback works when the
// filename ALREADY matches `^sprint-[0-9]+$`; :654 uses `hardening.md` and pins the REPORTING path.
// Neither asserts the shape real projects actually use — a `plan-`prefixed filename AND a
// product-prefixed H1 — where BOTH rungs miss and rule 1 goes inert. Green for a fixture-shaped
// reason. Filename and H1 are taken verbatim from the report's §7 table of 12 real plan names.
//
// Built by hand like the :654 case rather than through fixture(): that helper names the plan file
// `sprint-1.md`, and THE FILENAME IS THE THING UNDER TEST.
//
// ⚠️ ONE DELIBERATE DEVIATION FROM §7: the status heading here is `## Status`, not the reporter's
// `## Sprint 4 Status`. Theirs dies at dashboard.sh:206 before any drift logic runs — their own data
// defect, report §7 note 2, which they explicitly asked us not to fix. This fixture has to REACH
// rule 1 to say anything about it.
test('R8: a product-prefixed H1 on a `plan-sprint-N.md` filename must keep rule 1 alive', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-dash-'));
  MADE.push(root);
  const agents = join(root, 'ai-agents');
  for (const d of ['tasks/backlog', 'tasks/done', 'tasks/cancelled', 'sprints', 'sprints/done']) {
    mkdirSync(join(agents, d), { recursive: true });
  }
  const planText = foldBriefsAndPlan(
    agents,
    { 'backlog/a.md': brief({ title: 'Alpha', sprint: 'Sprint 9', status: '🔲 Backlog', priority: 1 }) },
    plan(['| ✅ Done | 1 | Alpha | [`a.md`](../tasks/backlog/a.md) |'], {
      title: '# Geoconflict — Sprint 4 — In-App Monetization & Citizenship',
    }),
  );
  const planPath = join(agents, 'sprints', 'plan-sprint-4.md');
  writeFileSync(planPath, planText);
  const { out } = run(planPath);
  // The drift facts ride the assertion message on purpose: the red output must show
  // `drift unresolved-plan-sprint` — the identity failing to resolve — so a reader can see it is red
  // for THE STATED REASON and not some other one, without a second assertion that would itself
  // invert to red the moment 0264 lands.
  const drift = facts(out).filter((f) => f.startsWith('drift '));
  assert.equal(
    drift.filter((f) => f.startsWith('drift disagreement')).length,
    0,
    `rule 1 must still skip: the brief belongs to Sprint 9, not to this plan. Drift facts: ${JSON.stringify(drift)}`,
  );
});
```

**No new imports.** `mkdtempSync`, `writeFileSync`, `mkdirSync`, `tmpdir`, `join`, `MADE`, `foldBriefsAndPlan`, `brief`, `plan`, `run`, `facts` are all already in scope.

## 5. Why this is red today, and green after `0264` — the trace

| | today | after `0264` (ADR-040) |
|---|---|---|
| `PLAN_SPRINT` | **empty** (both rungs miss) | `Sprint 4` (H1 segment rule) |
| rule 1 guard `:802` | false → no skip | true (`Sprint 9` ≠ `Sprint 4`) → **skips** |
| rule 3 runs? | yes: `b_key`=backlog ≠ `key`=done, and `found_dir`=backlog ≠ `exp`=done ⇒ `bad=1` | no |
| `drift disagreement` count | **1** ⇒ assertion **FAILS** | **0** ⇒ passes |
| `drift unresolved-plan-sprint` | emitted (`:906`) | not emitted |

## 6. Two deliberate design calls in this plan — read them at the approval gate

1. **`drift unresolved-plan-sprint` is NOT a standalone assertion.** The brief's verification step 2 says *"show that the same fixture emits"* it. Baking that in as `assert.ok(...)` would create a test that **inverts to red the moment `0264` lands** — a trap, and it contradicts the brief's own statement that green returns once the follow-on ships. Instead the fact list is embedded in the failing assertion's message, so today's red output **shows it permanently** and nothing inverts later. If the owner wants it as a hard assertion instead, say so at this gate.
2. **The comment names `ADR-040` and `0264`, not only `0260`.** Brief item 4 says "name `0260` by folder ID" — `0260` is named. But `0260` has already closed into `ADR-040`, and the thing that actually makes this green is `0264`. A marker pointing only at a closed decision task sends the next runner to a dead end. Strictly more information; no instruction contradicted.

## 7. Verification — what the Build worker runs and records

1. `node --test test/dashboard-contract.test.js` → **the new case FAILS**, with its assertion message quoted in full. Copy the message; it must contain `drift unresolved-plan-sprint h1="# Geoconflict — Sprint 4 — In-App Monetization & Citizenship"` **and** a `drift disagreement 0001 …` entry.
   - ⚠️ **A green run means the fixture does not reproduce the defect.** Likeliest cause: a plan filename that accidentally matches `^sprint-[0-9][0-9]*$`. Second likeliest: an H1 that starts `# Sprint`.
2. **Red for the stated reason:** confirmed by step 1's message content (see §6.1). No extra assertion needed.
3. **Every other test in the file still passes**, including both existing R8 cases. Record the pass/fail tallies, not just "the rest passed".
4. **`npm test` — and one non-obvious consequence to record.** `npm test` is `node --test test/*.test.js && bash test/prove-red.sh`. The unit run now fails, so **`prove-red.sh` never executes** (`&&` short-circuits). The worklog must say that explicitly, and the worker must run **`npm run test:prove-red` separately** to show `prove-red.sh` still passes — otherwise a reader cannot tell a skipped guard from a broken one.
5. `git status --porcelain`.
   - ⚠️ **Verification steps 4 and 5 of the brief cannot both be read literally.** Step 4 requires a worklog; step 5 says *"exactly one changed file"*. Reading step 5 as its evident intent: **exactly one changed file on the product surface — `test/dashboard-contract.test.js`** — plus the task folder's own new `worklog.md`, which step 4 mandates. **Nothing under `ai-agents/wiki-vault/`. Nothing under `claude/`.** Flagged rather than silently resolved.

**Worklog** (`ai-agents/tasks/backlog/0259-…/worklog.md`, new file) records: the `node --test` output with the new failure **named**, the `npm run test:prove-red` result, the `prove-red`-not-reached note, `git status --porcelain`, and the decision log.

## 8. ⛔ Out of scope — restated so the Build worker cannot drift

- ⛔ **No change to `claude/skills/fkit-status/dashboard.sh`.** Not one character. The fix is `0264`.
- ⛔ **No change to `claude/skills/fkit-status/SKILL.md`**, including its `sprint-*.md` glob (`0261` / ADR-041).
- ⛔ **Do not "fix" the two existing R8 tests.** Both are correct for what they assert.
- ⛔ Do not widen either matcher's regex to make it green.
- ⛔ No new devDependency (ADR-014). No `prove-red.sh` mutation.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005).
- ⛔ No commit, no push, no re-rank, no task-file move.
- ⛔ Do not add `T2`–`T11` from ADR-040 — those are `0264`'s, and `0264` is told not to duplicate `T1`.

## 9. Risks and non-obvious failure modes

- **`&` in the H1** (`…Monetization & Citizenship`). Written by Node into a file and read by `sed` as *pattern space*, never as a replacement, so it is inert. `fact_value` at `:906` likewise treats it as data. Low risk, but if the red output shows a mangled `h1="…"`, that is the cause — report it, do not silently drop the `&` (it is part of the §7-verbatim requirement).
- **Em-dashes and the emoji** in H1/status cells are already used throughout this suite; no new encoding surface.
- **Fixture depth.** The plan sits at `ai-agents/sprints/plan-sprint-4.md` — same depth as `sprint-1.md`, so `AGENTS` resolution (`:65`) and `REL_PREFIX` (`:70`) behave identically. Moving it deeper would break href resolution and produce a *different* red.
- **Incidental drift facts.** Using `foldBriefsAndPlan` suppresses `brief-missing-owner` / `id-mismatch`. If the worker hand-writes the brief instead (the literal `:654` style), those extra facts appear; they are not `disagreement`s so the assertion still behaves, but the red output gets noisy and harder to read. Use `foldBriefsAndPlan`.
- **The suite ships RED.** This must be stated loudly in the close report, not buried. `npm test` does not return green until `0264` lands.

## 10. Open questions

None blocking. The two judgment calls in §6 and the step-4/step-5 reading in §7.5 are surfaced for the owner at this plan gate; approving the plan approves them.
