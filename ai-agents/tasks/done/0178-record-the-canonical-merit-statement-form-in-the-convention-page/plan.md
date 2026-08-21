# Plan — task 0178, record the canonical merit-statement form

## A. What I verified first-hand (and where the brief has drifted)

| Brief claim | Verified? | Evidence |
|---|---|---|
| Target page is dual-homed, both copies exist | ✅ **confirmed** | `/Users/mark.dolbyrev/Workspace/fkit/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` and `/Users/mark.dolbyrev/Workspace/fkit/claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` — `diff` today is **empty** (byte-identical) |
| Both copies must stay byte-identical | ✅ **confirmed, and now machine-enforced** | the path is **absent** from the exception list in `/Users/mark.dolbyrev/Workspace/fkit/test/dual-home-parity-exceptions.mjs`, so `/Users/mark.dolbyrev/Workspace/fkit/test/dual-home-parity.test.js` enforces byte-parity. The brief predates that test landing; it says "check by hand". **It is now a test.** Baseline run today: 9/9 pass |
| Report §3.1's two shapes, folder-ID-only, relative-not-absolute, advisory, `as ranked` required | ✅ **confirmed verbatim** | `/Users/mark.dolbyrev/Workspace/fkit/ai-agents/knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md` §3.1; the identical fenced block also appears in ADR-035 §Decision |
| §3.7 division-of-labour table | ✅ **confirmed verbatim** | same report, §3.7 |
| Report §8 names this page as the home | ✅ **confirmed** | §8 follow-up 1 |
| *"`dependency-declaration-form.md` is **not** in the scaffold copy today — a `0132` drift item"* | ❌ **STALE — do not inherit** | `dependency-declaration-form.md` **is present in both homes today**. Task `0132` is **closed** (`ai-agents/tasks/done/0132-reconcile-dual-homed-file-drift-live-vs-scaffold`) and shipped it (audience-adapted, recorded by name in the exceptions module). The brief's stated *reason* for rejecting that alternative home no longer holds — see §E open question 1 for the reason that does |
| *"`On merit` appears in 15 briefs … 4 incompatible shapes"* (measured 2026-08-01) | ❌ **STALE — re-measured today** | live count: **91** briefs carry `On merit`; **40** already use the canonical `**On merit:**` shape; **38** use the legacy `On merit this belongs` sentence. The practice has spread ahead of the convention page. Not load-bearing for 0178 (no backfill here) but it **materially changes task `0180`'s grandfathering arithmetic** — see §E open question 2 |

## B. ⚠️ The gap the brief's verification steps miss — a third file must change

`/Users/mark.dolbyrev/Workspace/fkit/test/structure-manifest.test.js` assertion A, in its own words:

> *"touch anything under `claude/scaffold/` without regenerating and this goes red"*

`/Users/mark.dolbyrev/Workspace/fkit/bin/generate-structure-manifest.mjs` hashes **git history ∪ the current on-disk `claude/scaffold/`**. Editing the scaffold copy therefore changes that path's on-disk hash, and `claude/structure-manifest.tsv` goes stale the same instant.

**So brief verification step 5 (`npm test` passes) FAILS unless the manifest is regenerated in the same change.** The brief does not say this. Baseline checked this turn: `structure-manifest.test.js` is **5/5 green today**, so this would be a regression introduced by 0178, not a pre-existing red.

`claude/structure-manifest.tsv` currently carries **2** rows for `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`; after the edit + regeneration it carries **3** (the table is append-only — historical hashes are never removed).

## C. Files touched — exactly three

| # | Path | Change |
|---|---|---|
| 1 | `/Users/mark.dolbyrev/Workspace/fkit/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | new section + one new bullet under `## Where this is enforced` |
| 2 | `/Users/mark.dolbyrev/Workspace/fkit/claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | **byte-identical** copy of the same edit |
| 3 | `/Users/mark.dolbyrev/Workspace/fkit/claude/structure-manifest.tsv` | **regenerated** by `npm run generate:manifest` — never hand-edited (the file's own header says so) |

**Deliberately NOT touched, each with the check that decided it:**

- **Both `conventions/README.md` copies.** 0178 adds a *section to an existing page*, not a new page — the live README's `## What's here` table needs no new row, and the scaffold README's count sentence *"Eight conventions ship with the scaffold"* stays true (scaffold holds 8 convention files besides `README.md`; verified by listing). The README row's description for this page (*"the board's Priority cell is rank (`P<n>`); a task's identity is its folder-name ID"*) stays accurate. **Additional reason to keep hands off:** `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` is **modified in the working tree by unrelated in-flight work**, and `durable-citation-anchors.md` is newly untracked in the scaffold — editing README here would collide.
- `ai-agents/wiki-vault/` — nothing. This is fkit-wiki's exclusively; ingest is routed, not written (§F).
- `claude/skills/fkit-task-brief/SKILL.md` — task `0179`. `dashboard.sh` / `dashboard-contract.test.js` — task `0180`. No brief backfilled. Nothing re-ranked.

## D. The exact content to write

**Two hard constraints on the wording, both from the page itself:**

1. **⛔ No relative links to `decisions/` or `reports/`.** The page's own closing block: *"ADR-029 and the decision report are cited by name and NOT linked — deliberately. Do not 'fix' this."* — because `knowledge-base/decisions/` and `knowledge-base/reports/` ship **empty** in the scaffold, so a link would be dead in every consuming project. **Brief item 4 ("cite ADR-035 and report §3.1 as the authority") must be satisfied by bare name, not by a link.** A link to `dependency-declaration-form.md` **is** permitted — it is dual-homed and present in both trees, which is the exact test the page states.
2. **⛔ No `path:NNN` citations** anywhere in the new text.

**Placement:** immediately after the `## What to write` table, before `## What NOT to rewrite`. The merit statement is a fourth prescriptive carrier and belongs with the other three; the frozen-history section and the closing dual-home block stay where they are.

---

**Section 1 — insert after the `## What to write` table:**

````markdown
## The merit statement — recording an ordering rank cannot carry

Board rank is **append-only against closed history**: a `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row is
never renumbered, so a new row whose merit position sits above one can never be given that rank. The
ordering intent is then recorded **in the task's own brief**, as a relative, non-numeric **merit
statement**.

**Two shapes, and only two:**

```
- **On merit:** immediately above 0154 — <reason>
- **On merit:** as ranked
```

Every brief on a **ranked** board carries exactly one of them. The Backlog board is unranked, so none is
required there — there is no rank for a statement to be relative to.

### The rules, each chosen against a named failure

- **Relative, never absolute.** Name a neighbour — *"immediately above `0154`"* — never a position,
  *"belongs at 122"*. A relative statement survives every re-rank; an absolute one is stale the moment
  anything above it moves. That is this page's own rule, applied to the one place it was not yet binding.
- **Folder ID only. A merit statement contains no `P<n>` token.** The neighbour is `0154`. Writing
  `0154 (P129)` pairs an identity with a rank, and reintroduces exactly the defect this page exists to
  prevent.
- **Advisory. Board rank still binds execution.** The merit statement records what the owner thinks
  *should* have been next. It does not redirect a reader picking up the next task, and nothing reads the
  board differently because of it. Two carriers, two jobs; collapsing them makes the board unreadable.
- **`as ranked` is required, not optional.** A brief with no merit line is indistinguishable from a
  brief whose author forgot. The explicit no-op is what makes **absence detectable**, and it is what
  makes a guard possible at all.

### The three carriers, and which of them binds

The merit statement is unreadable without the division of labour it sits in:

| Carrier | Carries | Binding? |
|---|---|---|
| Board rank `P<n>` | reading order — what to pick up next | yes, for picking work |
| `On merit` statement | the owner's preference the rank cannot express | **no — advisory** |
| `Depends on` / `Blocks` | correctness order — what must land first | **yes, and it outranks reading order** |

A merit case that is really a **correctness** constraint belongs in the `- **Depends on:**` form of
[`dependency-declaration-form.md`](dependency-declaration-form.md), where it **binds** — not in a merit
statement, where it does not.

**Authority.** ADR-035, *"A mid-board insertion is not the owner-ruled re-rank exception"*, and decision
report `2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md` §3.1, which ruled this form
in by name alongside six other candidates weighed in the same report. Both are cited bare — see the note
at the foot of this page.
````

**Section 2 — append as item 4 under `## Where this is enforced`:**

```markdown
4. **`claude/skills/fkit-status/dashboard.sh` + `test/dashboard-contract.test.js`** — a
   `brief-missing-merit` drift kind, in the same family as `brief-missing-status`, `brief-missing-owner`
   and `brief-missing-id`. It checks two things: **presence** of an `**On merit:**` line on every brief
   on a ranked board, and **shape** — no `P<n>` token inside it. **Specified, not built yet.** Its two
   accepted limits — a bare rank with no `P` is not caught, and the guard is red on the existing corpus
   until a grandfathering decision is taken — are recorded in report
   `2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md` §5.4.
```

> **Why item 4 is included and honestly flagged:** `conventions/README.md`'s bar for a convention
> requires it to state where it is enforced. Claiming enforcement that does not exist would be false;
> omitting it would leave the bar unmet. **Task `0180` must edit this bullet to drop "not built yet"
> when the guard lands** — flag that in `0180`'s brief.

## E. Verification — mapped to the brief's steps, plus the two it is missing

All commands **path-scoped** (working tree is dirty with ~97 unrelated paths).

| Brief step | Command | Pass condition |
|---|---|---|
| 1 — both canonical shapes verbatim in a fenced block | `grep -n -e '\*\*On merit:\*\* immediately above 0154' -e '\*\*On merit:\*\* as ranked' ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | both lines returned, inside the fenced block |
| 2 — folder-ID-only rule, `P<n>` forbidden, in test-authorable words | `grep -n 'contains no `P<n>` token' ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | one hit. The sentence *"A merit statement contains no `P<n>` token"* is directly turnable into `0180`'s shape assertion |
| 3 — `as ranked` required, and why | `grep -n 'required, not optional' ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | one hit, followed by the *"absence detectable"* reason |
| 4 — diff between the two homes is empty | `diff ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | exit 0, no output |
| **4b — NEW, stronger than step 4** | `node --test test/dual-home-parity.test.js` | 9/9 pass. This is the machine enforcement of step 4 and it did not exist when the brief was written |
| **5a — NEW, the gap in §B** | `npm run generate:manifest` then `git diff --stat -- claude/structure-manifest.tsv` | **exactly one line added**, for path `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`; **no line removed**. Then `node --test test/structure-manifest.test.js` → 5/5 pass |
| 5 — `npm test` passes | `npm test` | green. Proves no regression, not the change (no test asserts on this page's body today) — as the brief correctly says. **Only meaningful after 5a**; run `npm run test:unit` first for fast feedback, `npm test` (includes `prove-red.sh`) last |
| 6 — no `:NNN` citations | `grep -n '\.md:[0-9]' ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | **no output** (exit 1) |
| **7 — NEW, no dead links shipped** | `grep -n '](\.\./' ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | **no output** — proves no relative link escapes the `conventions/` folder into the never-synced `decisions/` or `reports/`, which is the page's own stated rule |

**Order of operations (the sequence matters):** edit live copy → copy byte-for-byte to scaffold → `diff` (step 4) → `npm run generate:manifest` (5a) → `npm test` (5) → steps 1,2,3,6,7 greps.

**Do not commit.** Nothing is committed unless the owner asks.

## F. Wiki routing

The convention page is under `ai-agents/knowledge-base/` — mine to write. **Nothing under `ai-agents/wiki-vault/` is touched.** Once the page lands, `fkit-wiki` should ingest the updated `priority-is-rank-not-identity.md`; recommend the owner run `/fkit-wiki-ingest` or the driver route an ingest consult. **Not part of this task's diff.**

## Open questions returned with the plan

**1. The home — the brief's flagged conflict, re-derived because its stated reason is stale.** The driver's relay of the owner's *"file all eight"* ruling named `dependency-declaration-form.md` (or *"a sibling convention page"*) as the home. The brief rejects that because *"that page is not in the scaffold copy today"* — **that is no longer true**: task `0132` is closed and shipped it to the scaffold. The reason to keep `priority-is-rank-not-identity.md` is now purely substantive: report §8 follow-up 1 names it by path, and §3.1 calls the merit form *"the same rule `conventions/priority-is-rank-not-identity.md` already states, applied to the one place it was not yet binding"* — rank-vs-identity, not dependency-declaration form. **My recommendation: keep `priority-is-rank-not-identity.md`, and note that `dependency-declaration-form.md` is now a viable home so the choice is a judgement call rather than a forced one.** Owner confirmation wanted before writing.

**2. The corpus has moved a long way since the report — `0180`'s blocking decision is now a different size.** Report §5.4b sized the grandfathering decision at "29 of 29 open briefs red, 0 canonical". Re-measured today across `ai-agents/tasks/*/*/brief.md`: **91 briefs carry `On merit`, 40 already in the canonical `**On merit:**` shape, 38 in the legacy shape.** The canonical form spread through the corpus ahead of the convention page. This does not change 0178, but **task `0180`'s brief carries a stale cost figure and should be re-measured before that decision is put to the owner.** Not mine to edit (producer's).

**3. Item 4 under `## Where this is enforced` names a guard that does not exist yet.** I plan to include it, flagged *"Specified, not built yet"*, because `conventions/README.md`'s bar #3 requires a convention to state where it is enforced. The alternative is to omit it and leave the bar unmet. **Confirm you want the honest forward reference on the page rather than silence.** Either way, task `0180` inherits the duty to edit that bullet when the guard lands.

**4. Should `conventions/README.md`'s row for this page mention the merit statement?** My plan says **no** — no new file, no count falsified, and the scaffold copy is dirty with in-flight work that an edit would collide with. If you want the index row widened, it must be done in **both** homes (README is `kind: 'index'`, audience-adapted, so *substance* parity not byte parity) and is better sequenced after the in-flight `README.md` work settles.

---

## Owner approval record (driver-appended, 2026-08-21)

Approved by the owner via `AskUserQuestion` in the live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-21. Verbatim option labels:

- Plan: **"Approve (Recommended)"** — which also accepts the plan's **OQ4 default: `conventions/README.md` is NOT edited**, in either home.
- OQ1 (the home): **"Keep priority-is-rank-not-identity.md (Recommended)"** — the architect's substantive reasoning stands. ⛔ Do NOT move the content to `dependency-declaration-form.md`.
- OQ3 (the forward reference): **"Include it, flagged (Recommended)"** — item 4 ships with its *"Specified, not built yet"* flag intact. ⛔ Do not silently drop the flag, and do not claim enforcement that exists.
- OQ2 (`0180`'s stale cost figure): **not this task's work.** The owner ruled separately that a producer re-measure and correct `0180`'s record; the driver routes that. ⛔ `0178` does NOT edit `0180`.

This task is driven by an **architect** worker rather than a coder because its `## Owner` field names `fkit-architect`; the owner ruled on 2026-08-15/16, verbatim option label **"Spawn the brief's Owner role (Recommended)"**, that this loop's Plan/Build workers are the role the brief's `## Owner` names.

Transport note: the plan text above was returned by the plan worker through a task-notification channel that HTML-escapes `<`, `>` and `&`; the driver restored those characters (`&lt;` → `<`, `&gt;` → `>`, `&amp;` → `&`) when copying. No other transformation was applied.
