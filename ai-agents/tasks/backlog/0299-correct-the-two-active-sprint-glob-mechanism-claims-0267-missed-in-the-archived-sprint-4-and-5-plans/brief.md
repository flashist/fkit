# Correct the five active-sprint-glob mechanism claims `0267` missed, in the archived Sprint 2–5 plans

⚠️ **The folder slug still says "two" and the Sprint 4/5 titles — deliberately.** The scope was
widened from two sites to five by owner ruling on 2026-08-14 (below) **after** this task was filed.
⛔ **Do not rename or move the folder** (ADR-033 — task files move only via the producer's movers).
The slug is a stale name, not a scope statement; **this brief's `## What to build` is the scope.**

## ID
0299

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

Four owner rulings, all given **2026-08-14**, all live via `AskUserQuestion` in a `fkit lead`
session driving `/fkit-sprint-ship-loop`, and relayed to a spawned producer with no owner channel.

**Ruling 1 — filing shape. Verbatim option label: "File one task for both (Recommended)".**
One task, not two — the owner ruled against splitting the original pair of sites.

**Ruling 2 — scope widened from two sites to five. Verbatim option label: "Fold the three into 0299
(Recommended)".** The sweep at §2 below was originally filed **report-only**; the owner has folded
**three** of its five findings into this task's scope — `sprint-4.md:106`, `sprint-3.md:173`, and
`sprint-2.md:2704`. ⛔ **The other two sweep findings stay frozen** (`sprint-4.md:99-100` and
`sprint-4.md:165-166`) — see the fences on each below.

**Ruling 3 — the Site 2 count phrase is fenced. Verbatim option label: "Yes — fence it too
(Recommended)".** The identical *"exactly one `sprint-*.md`"* count claim at `sprint-5.md:24` — which
this brief previously flagged as an **open question**, fenced only by the filing producer's inference
— is now **fenced by explicit owner ruling**. That open question is **CLOSED**; see `## Notes`.

**Ruling 4 — the Site 3 count phrase is fenced. Verbatim option label: "Fence it too — fix only the
mechanism (Recommended)".** The **third** instance of the same count claim, at `sprint-4.md:105-106`
(*"exactly one `sprint-*.md` (this board) matches the `/fkit-status` glob"*) — which this brief
previously flagged as an **open question**, fenced only by the amending producer's inference — is now
**fenced by explicit owner ruling**. That open question is **CLOSED**; see `## Notes`.

✅ **All three count claims are now owner-ruled under ONE rule, not three exceptions:** at
`sprint-4.md:54`, `sprint-5.md:24` and `sprint-4.md:105`, **the count is preserved verbatim and only
the retired-mechanism claim is corrected.** No inference is relied on anywhere in this task any more.

**This task therefore corrects FIVE sites, not two.**

### The defect

[ADR-041](../../../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
**retired glob-based active-sprint selection.** The active sprint is selected by each plan's
**resolved identity**, not by a `sprint-*.md` filename pattern.
[`0267`](../../done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/brief.md)
corrected five prose sites that stated the glob as the mechanism. **It missed these five.** All five
describe a mechanism that no longer exists.

⚠️ **Every `:NNN` below was re-verified on disk 2026-08-14** when ruling 2 widened the scope. **The
durable anchor is the quoted sentence, not the number** — re-measure again at implementation time.

**Site 1 — `ai-agents/sprints/done/sprint-4.md:54-55`**, inside the archival banner's *"Why it was
archived"* paragraph:

> Archiving it before [Sprint 5](sprint-5.md) opens is what keeps exactly **one** `sprint-*.md` in
> `/fkit-status`'s active-sprint glob.

**Site 2 — `ai-agents/sprints/done/sprint-5.md:24-25`**:

> [`done/sprint-4.md`](sprint-4.md)'s banner, and it is what leaves exactly one `sprint-*.md` in
> `/fkit-status`'s active-sprint glob.

**Site 3 — `ai-agents/sprints/done/sprint-4.md:105-106`** (folded in by ruling 2; the ruling named
the row `:106`, which is the **second** line — the sentence starts at `:105`), inside the **✅
DISCHARGED** note that begins at `:103`:

> sits at [`sprints/done/sprint-3.md`](sprint-3.md) with a `🔒 CLOSED` banner, exactly one
> `sprint-*.md` (this board) matches the `/fkit-status` glob, and the active-sprint resolution is
> unambiguous.

⛔ **Site 3 is NOT the frozen paragraph — read this carefully before editing.** The freeze at
`:99-100` covers the **⚠️ paragraph at `:95-101`**, which the discharge note itself calls *"the ⚠️
paragraph above"*. Site 3 sits **inside the discharge note** (`:103-108`), which is a **different
paragraph** and is **not** covered by the byte-identical instruction. Verify this for yourself before
you touch it: read `:95-108` whole.

**Site 4 — `ai-agents/sprints/done/sprint-3.md:173-174`** (folded in by ruling 2), item 3 of a
*"Verified first-hand before the roll"* list:

> `/fkit-status` resolves the active sprint by globbing `sprint-*.md` **at the top of
> `ai-agents/sprints/`**, and treats `sprints/done/` as closed.

**Site 5 — `ai-agents/sprints/done/sprint-2.md:2704-2705`** (folded in by ruling 2), a bullet under
*"Key facts the split rests on"*:

> `/fkit-status`'s default run globs `sprint-*.md`, so `backlog.md` is invisible to it **by
> construction** — the filename is load-bearing and stays outside the glob.

⚠️ **Site 5 states the retired mechanism TWICE** — *"globs `sprint-*.md`"* **and** *"the filename is
load-bearing and stays outside the glob"*. The second half is the exact claim
[ADR-041 §2](../../../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
inverts. **Both halves are in scope.** ⚠️ Its *conclusion* — that `backlog.md` is invisible to
`/fkit-status`'s default run — **is still true under ADR-041**, by identity rather than by filename.
**Correct the mechanism; do not negate the conclusion.**

⚠️ **EVERY ONE OF THE FIVE CLAIMS SPANS TWO LINES** — the wrap falls mid-phrase in all five. The
row-level anchors are the first line except at Site 3, where the ruling named `:106`, the second.
Re-measure and re-wrap; **do not edit only one line and leave a dangling clause.**

### ⛔⛔ THE SCOPE FENCE — READ THIS BEFORE TOUCHING `sprint-4.md:54`

**`sprint-4.md:54` carries TWO DIFFERENT DEFECTS IN ONE SENTENCE, and only one of them is in scope.**

| # | The defect | Ruling |
|---|---|---|
| **A** | the **retired mechanism** — *"`/fkit-status`'s active-sprint glob"* | ✅ **IN SCOPE. Fix it.** This task. |
| **B** | the **count** — *"exactly **one** `sprint-*.md`"*, which is now **zero** (Sprint 5 was archived 2026-08-14; `select-active` returns `active none`) | ⛔ **OUT OF SCOPE.** Separately owner-ruled **"Leave it"** on 2026-08-14, as history in a closed plan. |

⛔ **Do NOT "helpfully" fix both.** They sit in the same sentence, four words apart, and every
instinct will be to correct the whole clause in one pass. **The count claim is owner-ruled to stay.**
A run that corrects the count has overridden an owner ruling — the most serious failure available
here, and worse than leaving the mechanism claim alone.

The fix must therefore **preserve the "exactly one" count assertion verbatim** while replacing the
mechanism it is asserted about. This is a genuinely fiddly edit, which is why it gets a task and not
a one-liner.

✅ **THE SAME COUNT PHRASE AT SITE 2 IS NOW FENCED BY EXPLICIT OWNER RULING.** `sprint-5.md:24` reads
*"leaves exactly one `sprint-*.md`"*. This brief originally fenced it only by the filing producer's
inference and recorded it as an open question. **Ruling 3, 2026-08-14 — verbatim option label "Yes —
fence it too (Recommended)" — settles it: it is fenced.** ⛔ **Preserve Site 2's count phrase
verbatim.** The open question is **CLOSED**; no inference is being relied on any more.

✅ **THE THIRD INSTANCE OF THE COUNT PHRASE, AT SITE 3 (`sprint-4.md:105`), IS NOW FENCED BY EXPLICIT
OWNER RULING TOO.** It reads *"exactly one `sprint-*.md` (this board) matches the `/fkit-status`
glob"* — the count and the mechanism again in one sentence. Site 3 only entered scope with ruling 2,
and this brief originally fenced its count by the amending producer's **inference** and recorded it as
an open question. **Ruling 4, 2026-08-14 — verbatim option label "Fence it too — fix only the
mechanism (Recommended)" — settles it: it is fenced.** ⛔ **Preserve Site 3's count phrase verbatim;
correct only its mechanism claim.** The open question is **CLOSED**; no inference is being relied on
any more.

### ✅ ONE RULE COVERS ALL THREE COUNT CLAIMS

**These are not three separate exceptions. They are one rule applied three times**, each time by an
explicit owner ruling given 2026-08-14:

| # | Site | Count phrase — **PRESERVE VERBATIM** | Mechanism claim — **FIX** | Ruling |
|---|---|---|---|---|
| 1 | `sprint-4.md:54` | *"exactly **one** `sprint-*.md`"* | *"`/fkit-status`'s active-sprint glob"* | **"Leave it"** (the count), 2026-08-14 |
| 2 | `sprint-5.md:24` | *"exactly one `sprint-*.md`"* | *"`/fkit-status`'s active-sprint glob"* | **"Yes — fence it too (Recommended)"** (ruling 3) |
| 3 | `sprint-4.md:105` | *"exactly one `sprint-*.md` (this board)"* | *"matches the `/fkit-status` glob"* | **"Fence it too — fix only the mechanism (Recommended)"** (ruling 4) |

**The rule, stated once:** wherever the count and the mechanism share a sentence in an archived plan,
**the count is history and stays byte-for-byte; the mechanism is the defect and gets corrected.**
⛔ A run that "helpfully" corrects any of the three counts has overridden an owner ruling — the most
serious failure available in this task.

**Net: the count assertion is preserved verbatim at all three sites where it appears — `sprint-4.md:54`,
`sprint-5.md:24` and `sprint-4.md:105`, all three owner-ruled. Only the mechanism changes, at all five
sites.**

## What to build

**Five prose corrections across four archived plans**, and one re-run sweep.

### 1. Correct the mechanism claim at all five sites

Replace the retired-mechanism wording with ADR-041's actual mechanism — **selection by resolved
identity**. Each corrected sentence must:

- still say what the sentence was there to say — **preserve its job, change only its mechanism**. In
  an archival banner that is what the archival **achieved**; at Site 4 it is a dated *"verified
  first-hand"* record; at Site 5 it is why `backlog.md` is invisible to the default run;
- state the real mechanism: selection is by each plan's **resolved identity**, and an archived plan's
  identity is no longer eligible as the active sprint;
- **leave every "exactly one" count assertion untouched** (Sites 1, 2, 3 — see the fence above);
- cite ADR-041, following the citation form the five sites `0267` already corrected use — **read one
  of `0267`'s landed corrections first and match it**, rather than inventing a new phrasing. `0267`'s
  brief and plan are at
  `ai-agents/tasks/done/0267-correct-the-five-remaining-prose-sites-that-state-the-glob-as-the-mechanism/`.

⚠️ **Sites 4 and 5 are DATED HISTORICAL RECORDS, not live claims** — Site 4 is framed as a
measurement taken before the Sprint 3 roll, Site 5 as a fact a Sprint 2 design decision rested on.
The owner has ruled them in scope, so **correct the mechanism** — but write the correction so the
record still reads as *what was true / what was relied on at the time*, not as a retroactive claim
that ADR-041 already existed. Adding a dated *"corrected 2026-08-14 per ADR-041"* aside is the safest
shape; **match `0267`'s landed form first** and only diverge if it cannot carry the date framing.

⚠️ **ALL FIVE SITES ARE IN ARCHIVED PLANS under `ai-agents/sprints/done/`.** Editing frozen history is
normally wrong; it is sanctioned **here and only here**, by the owner's rulings 1 and 2, and only for
the **mechanism** defect. **Nothing else in any of the four files changes.**

### 1b. ⛔ The two sweep findings that stay FROZEN — do NOT touch

Ruling 2 folded in **three** of the sweep's five findings. **Two were expressly excluded and remain
report-only.** Both are in `sprint-4.md`:

| Site | Why it is frozen |
|---|---|
| `sprint-4.md:99-100` — *"Until the owner rules, two `sprint-*.md` files match `/fkit-status`'s active-sprint glob…"* | ⛔ **DO NOT TOUCH.** The file's **own** discharge note at `:103-104` says this paragraph *"is left **byte-identical** as history; it no longer describes reality."* Editing it contradicts an explicit in-file instruction. |
| `sprint-4.md:165-166` — *"Until ruled, `/fkit-status`'s default run sees two `sprint-*.md` files…"* | ⛔ **DO NOT TOUCH.** Inside §"Open questions for the owner", recording a question **as it was asked**. Rewriting it falsifies the record of what was asked. |

⚠️ **`:99-100` and `:105-106` are five lines apart in the same block quote, and one is frozen while
the other is in scope.** This is the likeliest place to make a mistake in this task. Read `:95-108`
whole before editing, and check your diff line-by-line afterwards.

### 2. Re-run the sweep — and REPORT any NEW survivor, do not fix it

**A sweep was run at filing, 2026-08-14**, over `ai-agents/`, `claude/`, `README.md` and `CLAUDE.md`,
excluding `ai-agents/wiki-vault/`. It found five further sites; **ruling 2 folded three of them into
scope** (Sites 3–5 above) and **froze the other two** (§1b). The full disposition:

| Site | Text (abridged) | Disposition |
|---|---|---|
| `sprints/done/sprint-4.md:99-100` | *"Until the owner rules, two `sprint-*.md` files match `/fkit-status`'s active-sprint glob…"* | ⛔ **FROZEN — do not touch.** See §1b. |
| `sprints/done/sprint-4.md:105-106` | *"exactly one `sprint-*.md` (this board) matches the `/fkit-status` glob"* | ✅ **IN SCOPE — Site 3**, folded in by ruling 2. Mechanism only; **count fenced** (see fence). |
| `sprints/done/sprint-4.md:165-166` | *"Until ruled, `/fkit-status`'s default run sees two `sprint-*.md` files…"* | ⛔ **FROZEN — do not touch.** See §1b. |
| `sprints/done/sprint-3.md:173-174` | *"`/fkit-status` resolves the active sprint by globbing `sprint-*.md` **at the top of `ai-agents/sprints/`**"* | ✅ **IN SCOPE — Site 4**, folded in by ruling 2. Keep its dated *"verified first-hand"* framing. |
| `sprints/done/sprint-2.md:2704-2705` | *"`/fkit-status`'s default run globs `sprint-*.md`, so `backlog.md` is invisible to it **by construction** — the filename is load-bearing"* | ✅ **IN SCOPE — Site 5**, folded in by ruling 2. **Both mechanism halves**; conclusion still true, don't negate it. |

⚠️ **Re-run the sweep anyway; do not trust this table.** Its purpose is now to catch a **sixth**
survivor this brief does not know about. ⛔ **Any NEW site you find is REPORT-ONLY** — the owner's
ruling 2 named exactly three sites, and widening past them needs its own ruling. Report it in the
close; do not fix it.

✅ **The live skill files are CLEAN — `0267` did its job there.** Verified at filing:
`claude/skills/fkit-task-brief/SKILL.md` (both the step-8 fresh-project header template at `:308-314`
and the *"never write a `sprint-backlog.md`"* warning at `:336-345`) and
`claude/skills/fkit-status/SKILL.md` now state identity, not glob, and cite ADR-041. **No live
`claude/` site needs a correction.** Every survivor is in an archived plan.

⚠️ **A trap the filing producer hit, recorded so you do not:** `.claude/skills/fkit-task-brief/SKILL.md`
(the gitignored mirror) was **stale** at filing and still carried the retired glob claim. It is
refreshed by `claude/fkit-claude-init.sh` and is **not** a defect to file. ⛔ **Grep `claude/`, never
`.claude/`, when assessing whether a prose site survives.**

⛔ **Anything the sweep turns up BEYOND the five in-scope sites is a report in the close, not an
edit.** Widening beyond the five needs its own owner ruling — see `## Notes`.

## Verification steps

1. **Before editing, quote all five sites verbatim from disk** and paste them into the close:
   ```
   sed -n '52,57p'     ai-agents/sprints/done/sprint-4.md   # Site 1
   sed -n '22,27p'     ai-agents/sprints/done/sprint-5.md   # Site 2
   sed -n '95,108p'    ai-agents/sprints/done/sprint-4.md   # Sites 3 + the FROZEN :99-100, read whole
   sed -n '170,176p'   ai-agents/sprints/done/sprint-3.md   # Site 4
   sed -n '2702,2707p' ai-agents/sprints/done/sprint-2.md   # Site 5
   ```
   ⚠️ **If the text does not match this brief's quotes, STOP and report** — something else has edited
   these files.
2. **Prove the count fence held.** After editing, show the count phrase is **still present and
   unchanged** at all three sites that carry it — `exactly **one**` (Site 1, `sprint-4.md:54`),
   `exactly one` (Site 2, `sprint-5.md:24`), `exactly one` (Site 3, `sprint-4.md:105`). A `git diff`
   of all four files pasted into the close, with the count words visibly untouched, is the required
   evidence. ⚠️ **This is the single most important check in this task.**
3. **Prove the mechanism claim is gone from the five, and still present at the two frozen sites.**
   Run exactly:
   ```
   for f in sprint-2 sprint-3 sprint-4 sprint-5; do echo "== $f =="; \
     grep -nE "active-sprint glob|the \`/fkit-status\` glob|resolves the active sprint by globbing|default run globs|outside the glob" \
     ai-agents/sprints/done/$f.md; done
   ```
   **Before the fix this returns** (re-verified on disk 2026-08-14): `sprint-2.md:2704`, `:2705`;
   `sprint-3.md:173`; `sprint-4.md:55`, `:100`, `:106`; `sprint-5.md:25`, `:193`.
   **After the fix it must return only `sprint-4.md:100` and `sprint-5.md:193`.** Paste the output.
   - `sprint-4.md:100` is the **frozen** `:99-100` site — it **must still match**. Its
     disappearance means you edited frozen history.
   - ⚠️ **`sprint-5.md:193` is NOT a defect and NOT in scope.** It is a **task-row cell** on Sprint 5's
     board describing `0266`, quoting the old wording of a site `0266` itself fixed. It is a record of
     a task description, not a claim about the mechanism. ⛔ **Leave it.**
   - ⚠️ **The frozen `sprint-4.md:165-166` site does NOT match this grep** — it reads *"sees two
     `sprint-*.md` files"*, with no "glob" in the phrase. **A previous version of this brief wrongly
     asserted it would appear as `sprint-4.md:166`; that was an error, now corrected.** Check `:165-166`
     is untouched with `git diff`, not with this grep.
4. **Re-run the sweep** and paste its raw output, with your own per-site classification against §2's
   table. Say explicitly whether you agree with each **FROZEN** call, and report any **sixth**
   survivor as report-only.
5. `npm test` green. ⚠️ **State plainly in the close that this proves nothing about these edits** —
   **no test reads archived sprint-plan prose**, which is the whole reason `0267` missed these five in
   the first place. A close that offers a green suite as evidence of correctness here is misreporting.
6. `git diff --stat` must touch **exactly four paths**: `ai-agents/sprints/done/sprint-2.md`,
   `sprint-3.md`, `sprint-4.md`, `sprint-5.md`. ⚠️ **Four, not two** — the count changed with ruling 2.
7. **Read the `sprint-4.md` diff hunk-by-hunk before closing.** It is the only file with an in-scope
   site (`:105-106`) and a frozen site (`:99-100`) inside the same block quote. **Confirm out loud in
   the close that `:99-101` and `:165-166` are byte-identical.**

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Related, not a dependency:**
  [`0276`](../0276-correct-the-unresolved-plan-sprint-drift-mechanism-claim-in-adr-041-and-its-echoes/brief.md)
  also discharges a `0267` residual and also touches ADR-041's surroundings — but it edits **ADR-041
  itself** (`:152-153`) and is owned by `fkit-architect`. **No file overlap** with this task
  (verified at filing: `0276` names ADR-041 and its echoes, not the archived sprint plans). Either
  order is safe. ⛔ Do not merge the two.
- **✅ CLOSED 2026-08-14 — was open question 1:** *does the "Leave it" ruling on `sprint-4.md:54`'s
  count claim also cover the identical count claim at `sprint-5.md:24`?* **ANSWERED: yes.** Owner
  ruling 3, given live via `AskUserQuestion` in a `fkit lead` session driving `/fkit-sprint-ship-loop`
  — **verbatim option label: "Yes — fence it too (Recommended)"**. `sprint-5.md:24`'s count phrase is
  **fenced by ruling**, no longer by the filing producer's inference. ⛔ Preserve it verbatim. **This
  question is no longer open.**
- **✅ CLOSED 2026-08-14 — was open question 2:** *should the three unfrozen sweep findings
  (`sprint-4.md:106`, `sprint-3.md:173`, `sprint-2.md:2704`) be corrected too?* **ANSWERED: yes,
  fold them into this task.** Owner ruling 2, same session and channel — **verbatim option label:
  "Fold the three into 0299 (Recommended)"**. They are now **Sites 3, 4 and 5** of `## What to build`;
  this task corrects **five sites, not two**. **This question is no longer open.**
- **✅ CLOSED 2026-08-14 — was open question 3:** *a third instance of the count phrase exists at
  `sprint-4.md:105` (*"exactly one `sprint-*.md` (this board) matches the `/fkit-status` glob"*), and
  no ruling had been given about it — should its count be fenced like the other two?* **ANSWERED: yes,
  fence it; correct only the mechanism.** Owner ruling 4, given live via `AskUserQuestion` in a
  `fkit lead` session driving `/fkit-sprint-ship-loop` — **verbatim option label: "Fence it too — fix
  only the mechanism (Recommended)"**. `sprint-4.md:105`'s count phrase is **fenced by ruling**, no
  longer by the amending producer's inference. ⛔ Preserve it verbatim. **This question is no longer
  open.** With it, **all three count claims are ruled** — see *"ONE RULE COVERS ALL THREE COUNT
  CLAIMS"* in `## Context`.
- ⛔ **No `wiki-vault/` write** (ADR-005). ⛔ **No task-file move** (ADR-033) — route the close to
  `@fkit-producer`.
- ⚠️ Every `:NNN` in this brief is a dated anchor measured **2026-08-14** and **re-verified on disk
  the same day** when ruling 2 widened the scope. The durable anchors are the quoted sentences.
  **Re-measure at implementation time.**
- **⚠️ Filed by a spawned producer with no owner channel.** No ranking was assigned (ADR-035).
- **⚠️ Scope amended 2026-08-14 by a second spawned producer, also with no owner channel**, on rulings
  2 and 3 relayed from the live `fkit lead` session. Two sites → five. The task's ID (`0299`), folder
  name, `## Status` (`🔲 Backlog`) and rank (`—`, unranked per ADR-035) are **unchanged**.
- **⚠️ Ruling 4 recorded 2026-08-14 by a third spawned producer, also with no owner channel**, relayed
  from the same live `fkit lead` session. **Scope did not change** — still five sites; the last open
  question (Site 3's count) is simply now settled by ruling instead of inference. ID, folder name,
  `## Status` and rank **unchanged**.
