# Implementation plan — task 0103: the task-folder-name scheme change (Option C)

**Status:** phase 1 of 2 built. Phase 2 pending the producer's literal mover run (owner ruling D2).
**Spec:** `ai-agents/knowledge-base/reports/2026-07-26-decide-task-folder-name-numeric-prefix.md` §8.
**Owner approved:** 2026-07-26, "Approve as planned", via `AskUserQuestion` in the
`/fkit-sprint-ship-loop` driver session.

---

## Scope — seven items from report §8

1. Invert the FACTS identity in `dashboard.sh` — the folder-name `NNNN` prefix becomes primary.
2. Render the sprint board's Priority cell as `P<n>`.
3. Update the FACTS-id test literals, with a red-proof.
4. Rewrite `fkit-status/SKILL.md:299-304` (the `<task>` narration).
5. Re-point `dashboard-contract.test.js`'s trap-B guard test.
6. Normalise all board link labels to the folder ID.
7. Write the `priority-is-rank-not-identity.md` convention page (dual-homed).

**No folder renames. No href rewrites. No `wiki-vault/` writes.**

---

## Owner rulings at the plan gate (2026-07-26)

| # | Question | Ruling |
|---|---|---|
| D1 | Does `sprints/done/sprint-1.md` get `P<n>` cells? | **NO** — byte-untouched; its 14 rows keep bare integers. |
| D2 | Is the mechanical mover verification enough? | **NO — owner OVERRODE the recommendation.** A literal `/fkit-task-done` producer run is required against the scratch tree. |
| D3 | Edit `fkit-producer.md` too? | **NO** — `fkit-task-brief` only; report the producer's absence of a site as evidence. |
| D4 | Keep `P<n>` as the token? | **YES.** If it proves unworkable in flight, escalate `NEEDS-DECISION` — do not improvise the §11.1 R4 fallback. |
| D5 | Convention page sign-off | **NOT yet given.** A later gate; not written in phase 1. |

---

## Phase split

**Phase 1 (this build)** — steps 0, 1, 3, 5, the test runs, the §7 scratch tree, and these artifacts.
**Phase 2 (after the producer's mover run returns)** — steps 2b (`sprint-2.md` `P<n>` rendering),
6 (label normalisation), 4 (`fkit-status/SKILL.md` narration), the `fkit-task-brief/SKILL.md` writer
updates, and step 8 full verification. Step 7 (the convention page) stays gated on D5.

---

## Step order and rationale

`0 → 1 → 3 → 5 → 2a(verify) → 2b(render) → 6 → 4 → 7 → 8(full verify)`

- Item 1 lands **before** items 3/5 — the tests are written against the new behaviour.
- Item 2's mover verification happens **before** the rendering lands (report §11's explicit
  precondition: verify both movers against a `P103` cell before the board changes).
- Item 7 is gated on the owner's sign-off and lands last.

---

## Step 1 — `dashboard.sh`: the folder ID becomes the primary identity

- **1a.** New `folder_id_prefix()` helper after `task_id()`. **Numeric-only**, because `${f%%-*}`
  returns the *whole* string when the name has no hyphen — `0042 alpha` would put a SPACE into a
  positional FACTS field, reintroducing the `drift on tasks my, re[a]d, task` phantom-task bug
  through a new door. The guard also rejects a stale flat href (`…/backlog/x.md` → `backlog`) and a
  legacy unprefixed folder (`extract-scaffold-…` → `extract`).
- **1b.** Delete the early `tid=$(task_id "$pr")` — no reader between it and the first `add_fact`.
- **1c.** Replace the FACTS-id comment block and fallback with the inverted ladder:
  **folder ID prefix → Priority number → sanitised folder name → `?`.**
- **1d.** Leave the `id-mismatch` block's `folder_id=${folder%%-*}` **byte-identical** — it must
  compare the RAW prefix even when non-numeric. The helper's comment records that the two parses
  differ on purpose, so a later reader does not "unify" them.
- **1e.** Expected consequence, not a bug: an unresolvable row keys on its href's folder
  (`0099-gone` → `0099`) instead of the priority. That is what makes the change work on rows whose
  brief is missing.

The `?` sentinel and the `set -f` glob guard both **stay**, per §8 item 1.

---

## Step 3 — the FACTS-id test literals + the red-proof

~44 assertion sites carry a priority-keyed literal. The fixture helper `foldBriefsAndPlan` assigns
folder IDs in **insertion order of the `briefs` object**, independent of the priority the row writes —
so every literal is re-read against that order, **failure-driven and per-site, never batch-sed**
(a blind `s/derive 1/derive 0001/g` corrupts the exceptions).

Known exceptions: the `folderTree` sites map priority `1` → **`0042`**; the trap-B site's priority `7`
→ `0001`; and the missing-brief site maps to **`0099`** (from its href, per 1e).

**Red-proof** (two legs — one leg alone is satisfiable by coincidence): hold the priority and move the
folder (the id must move); hold the folder and move the priority (the id must not move).

### Three sites §8 does not name — surfaced, not slipped in

- **`:1634`** asserted `\d{4}-zeta`; the id is now the bare prefix → re-point to `\d{4}`, rename.
- **`:1691`** asserted `\d{4}-a` → same change. The distinguishing `high-value` assertion stays as-is.
- **`:1735`** would keep **passing while no longer exercising the sanitiser it exists to guard** — a
  silent coverage loss, worse than a red bar. Add a third row whose folder carries no numeric prefix
  so the ladder reaches arm 3.

---

## Step 5 — re-point the trap-B guard test

The old test asserted the **priority** won. Replace the ⚠️ header comment, the test name and the
assertions **in the same edit**, carrying an explicit *do not restore the old assertion* warning
naming task 0103 — otherwise a future reader "fixes" the red bar by reverting step 1.

---

## Step 2a — verify both movers against a `P<n>` cell, before the rendering lands

Evidence: both movers key on the **folder name** and identify a row as `| … | <task> | <brief> |`
with a leading status cell. **Neither parses the Priority cell.** Verified on a throwaway tree at
`/tmp/0103-movers/`, with a bare-`42` control at `/tmp/0103-movers-control/` proving `P` is inert
rather than accidentally green.

**Owner ruling D2 overrode the recommendation:** the coder writes the scratch tree and stops; a
producer runs `/fkit-task-done` literally against it (the movers are producer-only, ADR-033 §1, and
the ADR-018 hook denies the coder at any spawn depth).

---

# ⚠️ BACK-FILLED 2026-07-27 — everything below this line, down to "Edge cases"

> **This section was not written at plan time. It was added on 2026-07-27, after the work shipped, on
> the owner's ruling at review finding R2.** The phase-1 plan on disk documented only steps 1, 3, 5
> and 2a, while its own step order names nine — so steps 0, 2b, 6, 4, 7 and 8 had **no plan text on
> disk**, and `worklog.md` cited a "Plan §10" and a "plan's `:294`" that an auditor could not find.
>
> **The content is reconstructed from the owner-approved plan carried verbatim in the coder's phase-1
> prompt**, which is the authoritative source; it is not re-planned or improved after the fact. Where
> reality differed from the approved text, **both are recorded** rather than the plan being quietly
> corrected to match what happened. Treat this as *the approved plan, transcribed late* — not as
> evidence of what was known on 2026-07-26.
>
> Why it matters: ADR-032 A2's audit obligation exists so an absent reader can reconstruct a
> ratification. Task **0147** would enforce this in the driver; it is **not built**, so this is the
> manual discharge of that duty.

## Step 0 — capture the baseline *(approved plan §3)*

Run `dashboard.sh` against `sprint-2.md`, `backlog.md` and `done/sprint-1.md`; capture stdout and the
per-file drift **kinds and counts** before touching anything. Kinds+counts — **not ids** — are the
comparison target, because every id changes by design.

> **Approved-plan expectation vs measured reality:** §3 expected `sprint-1` to carry **9** drift facts.
> The live measurement on 2026-07-26 was **7** (2 `disagreement` + 5 `nonconformance`), so §12's
> "9 vs 9" check is wrong as written. The check performed was its *intent* — before-vs-after
> kinds+counts on the real number — which came out **7 vs 7, unchanged**. The discrepancy was not
> investigated.

## Step 2b — render the Priority cell as `P<n>` *(approved plan §8)*

**File: `ai-agents/sprints/sprint-2.md` only.** `backlog.md`'s 16 cells are all `—` (measured);
`sprints/done/sprint-1.md` is out of scope by owner ruling **D1**.

**Do NOT use a whole-file sed.** `sprint-2.md`'s `## Status` section extends well past the board and
contains other pipe tables whose second column holds `**0139**`, `*(new)*`, `---`. Use an awk state
machine mirroring `extract_rows`' admission window — open at the `|---|` separator after the first
`## Status`, close at the first blank or pipe-less line — so the edit and the parser cannot disagree.
Rewrite only the **second** cell, and only when it is a bare integer.

Assert mechanically, not by eye: **130** `P`-cells, **0** bare-integer cells left, and additions ==
deletions with no line-count change.

**Explicitly NOT touched:** the `➡️ Moved to [Sprint N](…) — priority M` marker (that `priority M` is
prose in the **Status** cell and is `task-status-vocabulary.md`'s canonical form); the Task-cell
`priority (folderID)` notations (**frozen history**); and the briefs' own `## Priority` fields — §8
governs the board **cell**, and `fkit-sprint-ship-loop/SKILL.md:81` orders by the brief field.

### Writers, so new rows use the form

- **`claude/skills/fkit-task-brief/SKILL.md`** — the pull-into-sprint step *"Add the row to the sprint
  plan, with a real priority number"* becomes the rank token `P<n>`.
  > **Line-number correction (back-fill):** the approved plan cited this site as **`:294`**. The actual
  > line was **`:287`** — line numbers had shifted. `worklog.md`'s phrase *"the plan's `:294`"* refers
  > to this approved-plan citation, which is why it matches no line in the file. The edit landed on the
  > correct site; only the plan's line number was stale.
- The `**The Priority cell is `—`, always.**` rule for `backlog.md` is unchanged and correct; add a
  clause noting a **sprint** board writes `P<n>`, so the contrast is explicit at the point of writing.
- The fresh-project `backlog.md` template keeps `—` — **no change**.
- **`claude/agents/fkit-producer.md` carries no Priority-cell site.** §8 names it, but it holds only a
  role blurb and a generic brief-shape list. **Report the absence as evidence rather than inventing a
  site** — owner ruling **D3** confirmed this.

## Step 6 — normalise the board's link labels (Option D) *(approved plan §9)*

**Files:** `sprint-2.md` (85 of 130 rows) and `backlog.md` (6 of 16). All Brief cells are uniformly
`` [`<label>`](../tasks/<board>/<NNNN>-<slug>/brief.md) ``, so the transform is **label := the folder
segment of its own href** — idempotent, leaving already-correct rows untouched.

Apply inside the **same admission window** as step 2b, restricted to the **last** cell. **The href is
reproduced as a captured group and never rebuilt from parts**, so it cannot be altered.

Four mechanical proofs (the brief requires "checked mechanically, not by eye"):
**A.** every label equals its href's folder segment, 0 exceptions ·
**B.** every board label starts with the 4-digit ID ·
**C.** **no href changed** — diff the sorted set of all `(../tasks/…)` targets before vs after ·
**D.** every href still resolves on disk.

## Step 4 — rewrite `claude/skills/fkit-status/SKILL.md:299-304` (trap A) *(approved plan §10)*

The **only** narration site. Prose, so **nothing fails if it is missed** — which is exactly why it is
called out as its own step with its own verification line.

**The approved plan prescribed this replacement text verbatim:**

```markdown
> **⚠️ `<task>` is the FOLDER ID, not the priority.** It is the task-folder name's `NNNN` prefix —
> `0102` from `0102-decide-…` — which is the task's **permanent identity** (ADR-029 Decision 3). The
> **Priority cell is mutable board rank and is never the id**; the board renders it as `P<n>` precisely
> so the two number-spaces cannot be mistaken for one another. See
> [`priority-is-rank-not-identity.md`](../../../ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md).
>
> So the roll-up's drift clause reads `drift on tasks 0044, 0051` — **zero-padded folder IDs, not
> priorities.** This is a deliberate change (task 0103, decision report §8 item 1) from the earlier
> contract in which `<task>` was the Priority number: **do not translate a `0044` back into a
> priority, and do not report a padded id as a malformed record.**
>
> Two fallbacks survive and you may still be handed either: the **priority number**, when a row's href
> yields no numeric folder prefix; and a **sanitised folder name**, when there is neither. `?` means a
> genuinely unidentifiable row. All forms are a single token, so the `key="value"` grammar is unchanged.
> **Narrate whichever form you were given.**
```

Also **re-check** `SKILL.md:170` (the `—` cells narration) and `:325` (the six board columns) — both
remain true and need no edit; confirm rather than assume, and say so in the worklog.

**Verification (edge case E11):** `grep -n 'Priority number' claude/skills/fkit-status/SKILL.md` must
return **nothing** at the end.

> ### ⚠️ A CONFLICT INSIDE THE APPROVED PLAN — and the owner's ratification of the fix
>
> **The prescribed text above contains the phrase `"was the Priority number"`, which is exactly the
> string E11's verification grep requires to return nothing.** The two halves of the approved plan
> cannot both hold as written.
>
> **Resolution, applied on 2026-07-26 and RATIFIED BY THE OWNER on 2026-07-27:** three words change —
> `"was the Priority number"` → **`"was the board's rank number"`**. Identical meaning; both the
> prescribed text's intent and the named end-state check now hold. **The scope of the deviation is
> exactly those three words; nothing else in the block differs from the prescribed text.** The owner
> ruled: *"the three-word fix is ACCEPTED — keep `was the board's rank number`."*
>
> A later review (**R4**, Codex) then found the prescribed sentence *"the Priority cell … **is never
> the id**"* to be unconditionally false against ladder arm 2 (`dashboard.sh:581`), which does emit the
> priority as the id. That sentence was reconciled on 2026-07-27 to say the cell is *rank, not
> identity*, and keys a record **only as the documented fallback**. This is a **second, separate**
> departure from the prescribed text, recorded here so both are auditable.

## Step 7 — the convention page *(approved plan §11)* — gated on owner sign-off

**New file:** `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`, **dual-homed
byte-identically** into `claude/scaffold/…`. Content must clear the conventions README's four-part
bar; outline: the rule · why rank and identity are not interchangeable · what to write (sprint board
`P<n>` · backlog `—` · brief field a plain number) · what NOT to rewrite (the `➡️ Moved … — priority M`
marker; frozen `priority (folderID)` notations) · where it is enforced · provenance with a **dated
owner sign-off**.

Index rows go into **both** `conventions/README.md` files, each in its own house wording, plus the
scaffold README's *"Five conventions ship with the scaffold"* → **"Six"**. **Do not reconcile the
pre-existing live↔scaffold README divergence** — task 0132/0133.

**Gate:** the page is drafted, presented, and **not filed until the owner signs** (ruling **D5**).

> **Back-filled outcome:** D5 was signed **2026-07-27**. Filing surfaced a structural conflict the
> plan did not anticipate — `dual-home-parity.md:41` demands conventions be byte-identical while `:47`
> marks `decisions/` and `reports/` **never-sync** and `.gitkeep`-only, so **any** byte-identical
> convention linking an ADR is guaranteed dead in every scaffolded project. The coder **stopped and
> escalated rather than rewording the signed page**. Owner ruled **Option A**: cite `ADR-029` and the
> decision report **bare**, keep the `task-status-vocabulary.md` link (present in both trees), change
> no other word. Review finding **R1** then required the page to *say* this on its face, which was
> added on 2026-07-27.

## Step 8 — full verification *(approved plan §12)*

Run **`bash claude/fkit-claude-init.sh .` FIRST** — otherwise the gitignored `.claude/` mirror is
stale and the brief's own verification command tests the **old** script and reports a **false green**
(edge case E14). Then:

1. the brief's named command, `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md`;
2. **no new drift** — compare **kinds and counts, not ids**, against the step-0 baseline
   (**`sprint-1` is 7, not §12's 9** — see Step 0 above);
3. every FACTS id is a 4-digit folder ID present under `ai-agents/tasks/`, and none is a board priority;
4. the suites: `node --test test/dashboard-contract.test.js`, `test/launcher-contract.test.js`, `npm test`;
5. the step-6 label and href proofs A–D;
6. **no renames, no href changes** — `git status --porcelain | grep '^R'` empty;
7. dual-home parity for the new page: `diff` reports byte-identical.

---

## Edge cases accounted for

| # | Failure mode | Handling |
|---|---|---|
| E1 | `${folder%%-*}` on a hyphen-less name returns the WHOLE name → a space in a positional FACTS field | `folder_id_prefix()` is numeric-only; such a name falls through to the sanitising arm 3 |
| E2 | Stale flat href → folder `backlog` → fabricated id | Same numeric guard rejects it |
| E3 | Legacy unprefixed folder → `extract` | Same guard (none exist today; the guard is what keeps that from being load-bearing) |
| E4 | Arm 3 becomes dead code and the glob test silently stops proving anything | Arm 3 kept as a live fallback **and** `:1735` gains an unprefixed-folder row |
| E5 | `?` sentinel / `set -f` dropped as "no longer needed" | Both explicitly retained |
| E6 | Duplicate FACTS ids if two rows resolved to one folder | Zero duplicate hrefs in sprint-2's board (verified) |
| E7 | `sort -n` mangles zero-padded ids | Verified by execution: correct order, mixed forms tolerated |
| E8 | A whole-file sed corrupts sprint-2's other tables | Both mechanical passes use the same admission window as `extract_rows` |
| E9 | A label rewrite silently changes an href | The href is a captured group, never rebuilt; proved by a sorted before/after diff |
| E10 | `sprints/done/sprint-1.md` rewritten | Out of scope (D1); its ids change because the script changed, and the kinds/counts diff proves nothing new appeared |
| E11 | Trap A missed — prose, so nothing goes red | Its own step with its own verification grep |
| E12 | Trap B "fixed" by reverting step 1 | Explicit ⚠️ comment naming task 0103 and the report |
| E13 | Blind sed over the test literals corrupts the exceptions | Failure-driven, per-site method |
| E14 | The `.claude/` mirror is stale → false green | `bash claude/fkit-claude-init.sh .` runs first in step 8 |
| E15 | Reconciling the pre-existing live/scaffold README divergence | Forbidden here — task 0132/0133's scope |
| E16 | The convention page filed without sign-off | Hard gate (D5) |
| E17 | Vault pages narrate the now-old rule | Not this task's to fix; recorded as a wiki-role resync |

---

## Out of scope

Renaming any task folder; rewriting any href; any `wiki-vault/` write; re-deciding the prefix
question; editing ADR-029; reconciling the pre-existing live↔scaffold `conventions/README.md`
divergence (task 0132/0133); `test/dual-home-parity.test.js` (does not exist — task 0133); any commit
or push.
