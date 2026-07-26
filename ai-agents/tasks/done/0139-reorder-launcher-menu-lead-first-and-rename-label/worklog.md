# Worklog — 0139 Reorder the `fkit` launcher menu so lead is option 1

- **Task file:** `ai-agents/tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/brief.md`
- **Plan:** `plan.md` (same folder) — approved by the owner 2026-07-25 at the ship-loop plan gate.
- **Loop:** `/fkit-task-ship-loop`, coder session.

## Owner-decision log

| When | Question / choice | Owner's answer |
|---|---|---|
| Plan gate | The brief's four build items leave three "team room" strings in the launcher files (`:486` lead-session banner, `:444` and `:481` comments). In or out of 0139? | **Banner + both comments** — all three in scope. Target: zero "team room" in either launcher file except the retained case-arm alias. |
| Plan gate | Approve the plan, with the brief's case-arm contradiction resolved in favour of its own menu block? | **Approved**, full loop (build → verify → review → route the close to the producer). |
| Post-verify | `fkit team` on the explicit-role path has never worked (proven identical on HEAD and the working tree), so brief verification step 4 is unmet as written. Leave it, or fix it? | **Fix it, and file a follow-up** — accept `team` as a CLI role word; name a follow-up task for the test coverage rather than writing that test inside 0139. |
| Post-verify (obvious winner, not asked) | Include `"team room"` alongside `team` in the new explicit-role arm? | **Yes.** Mirrors the menu arm exactly, costs nothing, and avoids leaving `fkit "team room"` broken while the menu's `team room` works — the same inconsistency the fix exists to remove. Stays inside the owner-approved extension's intent. *(Moot from round 1 of review onward — the whole alias was reverted.)* |
| Review round 1 (R1) | `fkit team room` unquoted opens lead with a junk `room` prompt; at HEAD a clean `exit 2`. Fix narrowly / fix generally / accept as residual / revert the alias? | **Revert the `team` alias entirely** — a fourth option neither reviewer proposed. Consequence accepted knowingly: `fkit team` errors again and **brief step 4 is unmet as written**. |
| Review round 1 (R2) | `$ROLES` and the header comment still list `lead` last. Fold into 0139, or hand to 0140? | **Fold into 0139.** |
| Review round 1 (R3) | Record the after-a-named-role passthrough as an accepted residual? | **Yes, record.** |
| Review round 2 (R4) | The new ⚠️ comment points the next maintainer at the rejected narrow fix. Amend, or leave? | **Amend** — record *why* the narrow fix was rejected. |
| Review round 2 (R5) | Three records still say `fkit team` opens a lead session. Amend all, amend mine only, or leave and flag? | **Fix mine, flag the brief** — correct `plan.md` + `worklog.md`; leave `brief.md:100` untouched (a producer-owned acceptance criterion) and flag the deviation at close. |
| Close routing | Route the close to a producer spawn, or put it to the owner? | **Put it to the owner** — the brief has a knowingly-unmet acceptance criterion, and the ship-loop forbids routing a run with an unresolved criterion through a producer. |

**Brief contradiction surfaced before approval (not silently resolved):** the brief's "What to build"
§2 lists `5|adv|adversarial)` / `6|reviewer)` while its §1 menu block lists `5) reviewer` /
`6) adversarial`. Taken literally, §2 would make pick `5` open the adversarial reviewer while the menu
row says reviewer. The menu block wins — it is also the "shift the existing order by one" result.

## Work

### P4 — build (complete)

All six edits landed, `claude/` canonical sources only:

| File | Lines | Change |
|---|---|---|
| `claude/fkit-claude.sh` | 453–459 | menu block renumbered — `1) lead` … `7) wiki`, 13-char label column preserved |
| `claude/fkit-claude.sh` | 466–472 | case arms renumbered to match; `1\|lead\|team\|"team room")`; every word alias kept verbatim |
| `claude/fkit-claude.sh` | 159–165 | `--help` `Roles:` — `lead` moved to top, reworded to "the conductor — routes you to a role, or drives the team for you" |
| `claude/fkit-claude.sh` | 444 | comment: "team-room default" → "lead default" *(owner-approved addition)* |
| `claude/fkit-claude.sh` | 481 | comment: "the team room is the safe default" → "lead is the safe default" *(owner-approved addition)* |
| `claude/fkit-claude.sh` | 486 | lead-session banner: `→ team room.` → `→ lead.` *(owner-approved addition)* |
| `claude/fkit-claude-init.sh` | 857–863 | printed role list — `• lead` moved to top, "the team room" → "the conductor" |

`:463` (`role [1-7, q to quit]`) and `:475` (`is not one of 1-7`) **verified unchanged** — the range
did not move, so neither needed editing.

### P5 — verification (run after the final code change)

1. **`npm test` → 521 tests, 521 pass, 0 fail** (17 suites), **plus the `prove-red.sh` hard gate:
   `✓ hard gate PASSED`** — real + unmutated copy green, all 7 mutations red their named assertion.
   **No test required editing** (brief step 1's stop-condition did not fire); the launcher-contract and
   skill-ownership suites assert roles by name, as the brief predicted.
2. **`bash -n`** on both scripts — syntax OK.
3. **Interactive menu, driven under a real pty** (`script -q /dev/null`, stubbed `claude` on `PATH`,
   throwaway project — `/tmp/fkit-0139-menu-check.sh`, not committed). **16/16 checks passed:**
   - numbers: `1`→lead, `2`→producer, `3`→coder, `4`→architect, `5`→reviewer,
     `6`→adversarial-reviewer, `7`→wiki
   - word aliases at the menu: `lead`, `team`, `team room` → lead; `producer`→producer;
     `wiki`→wiki; `adv`→adversarial-reviewer
   - invalid pick `9` → `? "9" is not one of 1-7.`, and the menu keeps asking (a following `1` still
     opened lead)
   - rendered menu + lead banner contain **no** "team room"
   > **Harness traps hit and fixed before any result was trusted** (the first run reported 14 false
   > failures): input piped immediately hits the launcher's `read` **before** it opens `/dev/tty`, so
   > every read EOF'd and the launcher exited 0 without exec-ing — indistinguishable from "the pick is
   > broken". Fixed by delaying input ~4 s. Second trap: the stub records `--agent fkit-<role>`, not a
   > path to an agent file, so the original grep matched nothing.
4. **Explicit-role path (menu skipped):** `fkit lead`→`fkit-lead`, `fkit coder`→`fkit-coder`,
   `fkit wiki`→`fkit-wiki`. **`fkit team` → `fkit: "team" is not a role.` (exit 2)** — see the finding
   below.
5. **`fkit --help`** — `lead` first under `Roles:`, no "team room".
6. **`fkit-claude-init.sh .`** printed list — `• lead` first, no "team room".
7. **No-role, no-tty default** still resolves to `fkit-lead`.
8. **`grep -n "team room\|team-room"`** across both launcher files → **one survivor**, the deliberate
   case-arm alias `1|lead|team|"team room")`.

### Finding — brief verification step 4 rests on a false premise (NOT a regression)

The brief asks that **`fkit lead` and `fkit team` both still open a lead session** via the
explicit-role path. **`fkit team` does not work, and never did.** Proven, not assumed: the same
command was run against `git show HEAD:claude/fkit-claude.sh` and against the working tree, and both
print the identical error and exit 2:

```
fkit: "team" is not a role.
      Roles: producer coder architect reviewer adversarial-reviewer wiki lead (or: adv)
```

`team` and `"team room"` are **menu-pick aliases only** (`fkit-claude.sh:466`). The explicit-arg path
accepts only `$ROLES` plus `adv` and, since the ADR-010 passthrough fix, **rejects anything else by
design** rather than falling through. My change touched neither. **Brief verification step 4 is
therefore unmet on its `fkit team` half, and cannot be met without a behavior change outside the
approved plan** — so it stops for the owner rather than being fixed silently or quietly dropped.

**Owner ruled (2026-07-25): fix it, and name a follow-up for the test coverage.** Recorded in the
decision log above.

### P4b — the approved scope extension: `team` accepted on the explicit-role path

`claude/fkit-claude.sh:181-190` — the explicit-role `case` gains a dedicated lead arm carrying the
same alias set as the menu arm:

```sh
  lead|team|"team room")
    role="lead"; shift ;;
```

`lead` was removed from the generic `role="$1"` arm (it would otherwise be a shadowed duplicate —
drift bait). **`"team room"` was included as well** — an obvious winner recorded here rather than
re-asked: leaving `fkit "team room"` broken while the menu's `team room` works would create a fresh
copy of the exact inconsistency this fix removes, at zero cost. The words stay **aliases only** —
deliberately absent from `$ROLES` and from `--help`, both of which advertise `lead`, because the task
is retiring "team room" from display.

### P5b — re-verification, run after that final code change

1. **`npm test` → 521 tests, 521 pass, 0 fail** (17 suites) — twice, and **`✓ hard gate PASSED`**
   (`prove-red.sh`: real + unmutated copy green, all 7 mutations red their named assertion). No test
   needed editing.
2. **`bash -n claude/fkit-claude.sh`** — syntax OK.
3. **Explicit-role path, every accepted word:** `lead`, `team`, `team room` → `fkit-lead`;
   `producer`→producer; `coder`→coder; `architect`→architect; `reviewer`→reviewer; `wiki`→wiki;
   `adv` / `adversarial` / `adversarial-reviewer` → adversarial-reviewer. ~~**Brief step 4 now met.**~~
   **STALE — struck 2026-07-25.** True only of the round-1 tree. The owner **reverted** this alias
   after review finding R1, so `fkit team` errors again and **brief step 4 is unmet**; see P6 below.
4. **Args after a role still pass through:** `fkit team --debug` →
   `--agent fkit-lead --settings .fkit/settings/lead.json --debug`.
5. **The ADR-010 guard is intact** — the thing this arm could plausibly have widened. `fkit --resume`
   → `fkit: "--resume" is not a role.`; `fkit bogus` → exit 2. Neither falls through to a session.
6. **Interactive menu re-driven under a pty — 16/16 checks passed again**, unchanged.

### P6 — review round 1, and the revert it produced

Ledger: `review.md` (same folder). **Reviewers: both** — fkit-reviewer's own pass **and** the Codex
adversarial pass (`codex exec`, codex-cli 0.145.0, exit 0). **Coverage full — not a degraded run.**

Verdict line: *"⚠️ Changes requested — 1 confirmed defect (medium; none blocking), plus 2 low notes."*

**R1 (medium, CONFIRMED — a regression I introduced).** `fkit team room` typed **unquoted** — the
natural spelling of the retired label — opened a lead session and passed the stray word `room` to
`claude` as its initial prompt; at HEAD it was a clean `exit 2`. Cause: the menu reads a whole *line*
so `"team room"` matches there, but the explicit-role path reads *argv*, already whitespace-split.
The role lock was **not** bypassed (`--agent fkit-lead` + the right settings file), which is why it
was medium and not high.

> **Evidence I added that the review did not have.** My own first HEAD comparison was invalid — a
> *lone copy* of `fkit-claude.sh` in a temp dir cannot resolve its sibling resources, so it returns
> rc=1 without exec-ing and every exec-path row was meaningless. Re-run against a **full copy of
> `claude/`** with only the launcher reverted to HEAD: `fkit lead room` execs with the stray `room`
> **at HEAD too**. So the stray-positional behavior is pre-existing for the `lead` spelling; my change
> extended it to `team`. That made every narrow fix cost an inconsistency between the two spellings —
> which is what turned the decision back to the owner.

**Owner ruled (2026-07-25): revert the `team` alias entirely** — not one of the three narrow fixes.

- `claude/fkit-claude.sh:182-191` — `team` / `team room` removed from the explicit-role `case`,
  `lead` restored to the generic arm, and a ⚠️ comment added recording *why* re-adding the alias is
  not casual (the argv-vs-line asymmetry that produced R1).
- **Consequence, stated plainly: `fkit team` errors again, so the brief's verification step 4 is
  unmet as written.** It asks that `fkit team` open a lead session. It does not. The owner chose this
  knowingly over the alternatives. `team` / `team room` remain **menu-pick** aliases, exactly as
  before this task.

**R2 (low, CONFIRMED, raised independently by both reviewers).** `$ROLES` (`:50`) and the header
comment (`:9`) still listed `lead` last. **Owner ruled: fold into 0139.** Both reordered lead-first.
`$ROLES` is display-only — read at one site, the usage-error message — so no acceptance behavior moved.

**R3 (low, frontier-move).** The new arm widened which argv spellings reach the *intentional*
after-a-named-role passthrough. Both reviewers agreed it was **not a new hole** (`fkit lead --resume`
already did this at HEAD — I confirmed it). **Owner ruled: record as an accepted residual.** The R1
revert makes the widening itself moot; what is recorded is the pre-existing passthrough.

**Nothing was suppressed as re-litigation** — round 1 on a fresh ledger.

### P5c — re-verification after the round-1 fixes (the final code change)

- **`npm test` → 521 tests / 521 pass / 0 fail** (17 suites) and **`✓ hard gate PASSED`**.
- `bash -n` both scripts — OK.
- `fkit team`, `fkit "team room"`, `fkit team room` → **rc=2, no exec** (HEAD behavior restored).
- `lead` / `producer` / `coder` / `architect` / `reviewer` / `wiki` / `adv` / `adversarial` → correct
  `--agent` + settings pair each.
- `fkit lead --debug` → `--debug` still passed through; `fkit bogus` → rc=2 (ADR-010 guard intact).
- Usage error now prints `Roles: lead producer coder architect reviewer adversarial-reviewer wiki (or: adv)`.
- pty menu suite re-run → **16/16**; the menu still accepts `team` / `team room` as picks.

### P6b — review round 2, and the two document fixes it produced

Reviewers: **both again** — fkit-reviewer's own pass **and** a second Codex adversarial pass over the
round-2 delta (`codex exec`, exit 0). **Coverage full in both rounds — this run was never degraded.**

Verdict line: *"⚠️ Changes requested — 2 defects (none blocking); round-1 findings R1/R2/R3 all closed
and verified."* Nothing suppressed as re-litigation in either round.

- **R4 (low, CONFIRMED by both models independently).** My new ⚠️ anti-re-add comment ended by
  pointing the next maintainer at *the narrow fix the owner had just rejected*, and never recorded
  why it was rejected. **Owner ruled: amend.** `claude/fkit-claude.sh:182-192` now records that the
  leftover word is **not** the alias's defect — `fkit lead room` and `fkit coder room` behave
  identically at HEAD — and that a `team` arm consuming `room` was **weighed and rejected** because it
  would make one spelling stricter than all seven real role words.
- **R5 (low, CONFIRMED).** Three records still asserted `fkit team` opens a lead session. **Owner
  ruled: fix mine, flag the brief.** `plan.md:107` corrected with an inline amended-after-the-fact
  note; `worklog.md:116` struck through and marked STALE. **`brief.md:100` deliberately untouched** —
  a brief's acceptance criteria belong to the producer, and the author of the change that failed a
  criterion should not be the one who rewrites it.

**Two reviewer corrections to me, both right, both recorded:** (1) the invalidated lone-copy probe was
**mine**, not the reviewer's — its round-1 table used a full `cp -R claude/` and stood as written;
(2) the stray-positional behavior is general to **all seven** role words (`fkit coder room` confirmed),
not just `lead` as I had said — which strengthens the revert rather than weakening R1.

### P5d — final verification (after the last code change, the R4 comment edit)

- `bash -n` **and** `sh -n` on `claude/fkit-claude.sh` — both OK.
- **`npm test` → 521 tests / 521 pass / 0 fail / 17 suites**; **`prove-red.sh` → `✓ hard gate PASSED`**.
- Explicit-role sweep: `lead`, `producer`, `coder`, `architect`, `reviewer`, `wiki`, `adv` → correct
  `--agent` + settings pair each; `team` → rc=2 no exec; `team room` → rc=2 no exec; `bogus` → rc=2
  no exec; `lead --debug` → `--debug` passed through.
- The reviewer independently re-ran the suite and every probe and reported an exact match, plus one
  check I had not run: the explicit-role `case` block is **byte-identical to HEAD** apart from the new
  comment. The revert is complete.

---

## Close-out evidence packet

**Task:** `ai-agents/tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/brief.md`
**Status at hand-off:** `🔄 In progress` — work complete, close **put to the owner** (see below).

### The brief's verification steps, walked and ticked

| # | Criterion | Result |
|---|---|---|
| 1 | `npm test` green — 521 tests + the `prove-red.sh` hard gate; stop and report if a test needs editing | ✅ **Met.** 521/521, 0 fail, hard gate passed, run four times across the loop. **No test required editing** — the stop-condition never fired. |
| 2 | Menu renders `1) lead` first, `7) wiki` last, no "team room" | ✅ **Met.** Verified by rendering the real menu under a pty, not by reading source. |
| 3 | Every pick resolves correctly — `1`→lead, `2`→producer, `7`→wiki, and the words `lead`, `team`, `team room`, `producer`, `wiki` | ✅ **Met.** All 7 numbers + 6 word aliases checked at the menu; 16/16. |
| 4 | `fkit lead` **and `fkit team`** (explicit-role path) both open a lead session | ⚠️ **UNMET, knowingly — owner ruling 2026-07-25.** `fkit lead` ✅. **`fkit team` errors** (`fkit: "team" is not a role.`, rc=2). It errored at HEAD too; an alias added mid-run made it work; review finding **R1** showed that alias broke `fkit team room` (junk prompt where there had been a clean error), and the owner chose to **revert the alias** rather than fix it. `team` / `team room` remain **menu-pick aliases**, which is what they were before this task. **The brief's text was left unamended on purpose** (R5 ruling). |
| 5 | `fkit --help` lists `lead` first, no "team room" | ✅ **Met.** |
| 6 | Invalid pick `9` → `is not one of 1-7` | ✅ **Met**, and the menu keeps asking afterwards (a following `1` opened lead). |

### Review ledger

- **Path:** `ai-agents/tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/review.md`
- **Rounds:** 3. **Codex coverage: FULL in rounds 1 and 2** (`codex exec`, codex-cli 0.145.0, exit 0
  each time) — i.e. over **every executable change**. Round 3's delta was one comment plus two
  task-artifact edits with **zero executable-line changes**, so the reviewer ran it alone and said so:
  a stated scope reduction, **not** a partial / non-model-diverse review. *(This line read "Rounds: 2"
  until round 3 closed the ledger; corrected 2026-07-25 after the producer flagged it.)*
- **Findings:** R1 medium (fixed by revert), R2 low (fixed), R3 low (frontier-move, recorded as a
  residual), R4 low (fixed), R5 low (fixed for my artifacts, brief flagged not amended). **All five
  dispositioned; none outstanding.**
- **Convergence:** the reviewer's own call — *"Converging, not looping… disposition R4 and R5, then
  close out — no round 3."*

### Files touched / change surface

| File | Nature |
|---|---|
| `claude/fkit-claude.sh` | menu block, menu case arms, `--help` Roles, `$ROLES`, header comment, two in-file comments, lead-session banner, and the ⚠️ anti-re-add comment. **Net +33/−22 lines across both scripts.** |
| `claude/fkit-claude-init.sh` | printed role list reordered lead-first, "team room" → "the conductor" |
| this task folder | `plan.md`, `worklog.md`, `review.md` created (`brief.md` — only its `## Status` cell) |
| `ai-agents/sprints/sprint-2.md` | the 0139 status cell only |

**Not touched, by design:** `claude/agents/fkit-lead.md`, READMEs, `CLAUDE.md`, `AGENTS.md`,
`architecture.md`, `claude/skills/fkit-team/SKILL.md` (**0140**); `ai-agents/wiki-vault/` (**0141**).

### Residuals / deferrals

1. **Brief step 4 unmet as written** (above) — the one thing the owner should weigh before closing.
2. **The brief's own text still asserts `fkit team` works** — deliberately not amended by me.
3. **The renumber's accepted cost:** every other role shifts down one and a mis-pick is **silent** —
   you land in the wrong role's working session, no error. Owner-accepted 2026-07-25.
4. **`fkit lead --resume` passthrough** (pre-existing, unchanged by this task) — whether `--resume`
   overrides the pinned `--agent` is **untested**; it needs a real `claude`. Recorded in the ledger
   with a re-raise condition.
5. **0139 landing alone leaves prose briefly wrong** — the "menu option 7" citations are 0140's scope.

### Recommended follow-up tasks — *named only; I file no briefs*

- **Launcher-contract coverage for the menu aliases and the negative CLI assertions.** The follow-up
  the owner asked be named. After the revert it should pin: the **menu** picks `team` / `team room`
  (still accepted, still untested) **and** `fkit team` / `fkit team room` → `rc=2, no exec` — the
  negative assertions are what mechanically stop the alias being re-added. Note the suite's harness
  runs headless, so menu coverage needs a pty.
- **0140** (prose sweep) — recommend landing in the same session; 0139 makes its citations false.

### Commit state

**Nothing committed, nothing pushed.** `git log -1` is still `ed4122f Tasks update`. All edits sit in
the working tree for the owner. The tree also contains **uncommitted work that is not mine and
predates this run** — `ai-agents/sprints/backlog.md`, the rest of `sprint-2.md`, the 0132/0133 briefs,
and the new 0140–0143 task folders. I touched none of them.
