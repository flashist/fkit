# Worklog — 0143, append a dated correction note to ADR-010

**Date:** 2026-08-02
**Role:** fkit-architect, spawned as a bounded worker by `fkit-sprint-ship-loop` (fkit-lead's sprint driver)
**Working tree:** `main`, no commit made — the edit is left uncommitted, per the brief.

---

## Owner rulings carried into this task — provenance recorded

All five were taken via `AskUserQuestion` in the **live `fkit-lead` `/fkit-sprint-ship-loop` driver
session on 2026-08-02**, relayed to this worker in its spawn instruction. A spawned worker has no
owner channel (ADR-021), so these are relayed rulings, not rulings this worker obtained.

| # | Question | Owner's ruling | Effect on the deliverable |
|---|---|---|---|
| — | Approve the plan? | **Approved as written.** | The plan in `plan.md` is the authorized scope. |
| **Q1** | One note or two at §Context? | **(a) TWO blocks back to back** — `⚠️ Dated correction` for the drifted facts, a separate `⛔ Dated reversal notice` for the overturned decision. | Two blockquotes after the `- **A 7th agent…** ` bullet. The two kinds of staleness stay visually distinct. |
| **Q2** | Is §Decision 3 in scope? | **(a) YES — correct it here.** Correcting only the Context prose leaves the ADR's binding decision list still instructing a reader to follow a decision ADR-031 reversed. | Third blockquote after §Decision item 3. Also picks up the *"owns only `/fkit-team` and `/fkit-query`"* falsehood. |
| **Q3** | May the header metadata block gain a line? | **(a) YES — ONE line**, pure append, no existing header line altered. Matches ADR-036's `- **Revised:**` precedent. | One `- **Corrections:**` bullet after `- **Supersedes:**`. |
| **Q4** | Fold in the `skillOverrides` / `skills_for_role()` corrections? | **(a) NO — file them as follow-ups.** Different cause, different mechanism; this task establishes the form on one clean case. | Follow-ups 1 and 2 below. The reversal notice carries **one short parenthetical** naming the `skillOverrides` retirement as a *deliberately deferred* item — see "Deviation" below. |
| **Q5** | Note wording tense? | **(a) Present tense with a verification date** (*"Verified against live code 2026-08-02"*), matching the vault form. Both soft deps landed, so this was free. | Every factual bullet in the notes is present-tense and dated. |

---

## Re-verification — every fact re-measured firsthand before writing

The plan was written by a different worker. Per the spawn instruction, nothing in it was inherited.
All of the following were re-run against the live working tree on 2026-08-02.

**Held, confirmed:**

- `ROLES="lead producer coder architect reviewer adversarial-reviewer wiki"` — 7 roles. "A 7th agent"
  is still true.
- Menu prints `1) lead` … `7) wiki`; case arms `1|lead)` and `7|wiki)`. **Lead is option 1, not 7.**
- `"team room"` appears in `claude/` **only** inside the launcher's rejection comment
  (*"`team` / `team room` are NOT accepted — not here, and not at the menu either"*) — two occurrences,
  both explanatory. The label is retired.
- `claude/agents/fkit-lead.md` frontmatter: `name`, `description`, `color`, `initialPrompt` — **no
  `tools:` key**. Its own stance note reads *"That 'no write tools' line was also already stale:
  ADR-022 gave every Claude-side role Write/Edit."*
- ADR-031 header: *"**Reverses:** ADR-010 §Decision 3 … ADR-010 Decisions 1, 2, 4, 5 are
  **unaffected**"*, and §Context: *"This **reverses** ADR-010 §Decision 3, and reversal is a real
  decision, not a drift."*
- `skills_for_role()` is declared in **`claude/skills-for-role.sh`**; `claude/fkit-claude.sh` only
  sources it. Lead's line grants **five** skills: `fkit-team fkit-query
  fkit-open-questions-interview fkit-dumb-down fkit-sprint-ship-loop`. The ADR's "owns only two" is
  false.
- The lead-is-default line is `[ -n "$role" ] || role="lead"` under the comment *"No role and no tty
  (piped / CI) → lead is the safe default"*. The claim holds; only the ADR's `:190` pointer is stale.
- `skillOverrides` retirement: the launcher's own comment — *"Retired here (task 43 / ADR-018 …) the
  old `skillOverrides` 'off' list … Do not re-add either mechanism"*.
- Both soft deps present in `ai-agents/tasks/done/`: `0139-…`, `0140-…`.
- `conventions/dual-home-parity.md` lists `knowledge-base/{decisions,history,incidents,reports}/` as
  **⛔ never sync**. No scaffold copy to keep in step.
- ADR-010 `**Status:**` reads `accepted` after the edit.

**⚠️ One item in the approved plan was WRONG and is corrected here — the citation-form rationale.**

The plan's §3 "Differ 2" recommended writing **no `:NNN` line numbers**, and flagged its own caveat:
*"I read §3.3's heading 'Ruling — narrow, do not ban' … but not its full body; I recommend the strict
no-`:NNN` form because it is safe under either reading."*

**That stated ground does not survive reading the body.** `reports/2026-08-01-durable-citation-form-
for-mutable-coordinates.md` §3.3 rules, in the report author's own words:

> *"**Keep `path:NNN`** for code, tests, files under `claude/`, and review findings. **Stop using it**
> for coordination documents whose growth is other people's edits … **Rider (§1.1):** never a naked
> number, anywhere."*

and §1.2 says the architect's `path:line` mandate *"**stays** for code, tests, and files under
`claude/`"*. So the ruling does **not** ban `:NNN` for the `claude/` files these notes cite; it bans
it for coordination documents (sprint boards, task briefs, `wiki-vault/log.md`) and requires a paired
quote everywhere.

**What was done about it.** The approved *choice* was kept — the notes carry **no `:NNN`** and anchor
by **file + quoted phrase**. That form is **permitted** under the ruling (the rule forbids naked
numbers, not the absence of numbers), so following the approved plan does not violate anything, and
going beyond an approved plan on a form question was not this worker's call. **But the plan's reason
for the choice was false and is recorded as false here rather than inherited silently.** If the owner
would rather the notes carry `claude/…:NNN` + quote — the maximally informative form the ruling
actually endorses for `claude/` files — that is a one-pass edit and is listed as follow-up 7.

**One further discrepancy, unchanged from the plan and re-confirmed:** the brief's `## Priority` field
reads **124**; the sprint board row reads **P125**. Consistent with `0174`'s owner-ruled P119
insertion renumbering the old P119–P148 up by one. Harmless per
`conventions/priority-is-rank-not-identity.md` (rank is not identity), but it is a brief/board
mismatch. **Not repaired here** — a producer's call, and this task may not edit the brief or the board.

---

## Deviation from the letter of Q4, and why

Q4 ruled the `skillOverrides` correction **out** of this pass. The ⛔ reversal notice at §Context
nonetheless carries one short parenthetical naming it.

**Reason.** ADR-031's scope sentence — the one the note relays — reads *"Decisions 1, 2, 4, 5 are
unaffected."* Written flat into ADR-010, that sentence would assert something **the project already
knows to be misleading**: the vault's own ADR-010 page carries a 2026-08-02 note saying exactly this,
*"that is true of 1, 4 and 5, but **Decision 2's mechanism is retired**."* Writing an unscoped
"Decisions 1, 2, 4 and 5 are unaffected" would have added a **new** false-reading claim to the ADR
under a brief whose entire point is not adding false claims.

**The wording chosen** scopes the sentence to the reversal (*"No other ADR-010 decision is **reversed
by ADR-031**"* — true, precisely) and adds one italic parenthetical recording that Decision 2's
mechanism was retired by ADR-018, that this is **a drift, not a reversal**, and that it is
**deliberately not corrected in this pass**. That is the brief's own sanctioned
"addressed-or-explicitly-deferred" pattern applied to a second claim. **No correction to Decision 2
was written; the follow-up stands unchanged.** Flagged here so the owner can strike the clause if they
read Q4 more strictly.

---

## What was written

**One file changed:** `ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md`

Four additions, in document order:

1. **Header metadata bullet** — `- **Corrections:** 2026-08-02 — …` after `- **Supersedes:**`. Names
   both note sites and carries the **marker legend** (⚠️ = a fact that drifted; ⛔ = a decision that was
   overturned), so the form is self-describing inside the ADR.
2. **⚠️ Dated correction** — indented blockquote directly after the §Context bullet
   `- **A 7th agent, `fkit-lead`** …`. Covers the retired label, menu option 1 (option 7 is wiki), the
   ADR-022-falsified "no Write or Edit tools", and the now-stale `fkit-lead.md:22-26` pointer. Names
   `0139` / `0140` as cause with relative links into `tasks/done/`.
3. **⛔ Dated reversal notice** — second blockquote at the same site, for *"routes rather than does"*,
   pointing at ADR-031 §Decision 1 and forward to note 4.
4. **⛔ Dated reversal notice** — indented blockquote after §Decision item 3. States what is in force
   today (conductor; holds Write/Edit; **five** skills, listed by name), what is **still true** (lead
   is the safe default), and that no other decision is reversed.

**Additions-only, proven by diff, not by eye** (brief verification step 1):

```
$ git diff --numstat -- …/adr-010-role-locked-sessions-and-skill-lockdown.md
71      0       ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md

$ git diff -U0 -- …/adr-010-…md | grep -E '^-' | grep -v '^---'
(no output)
```

**71 insertions, 0 deletions. Zero deleted or modified lines.**

---

## Brief's verification steps — walked

| # | Step | Result |
|---|---|---|
| 1 | Original body at the target sentence **unchanged**, verified **by diff** | ✅ 71/0 diffstat, zero `-` lines |
| 2 | A correction note is present, carries a date, names `0139`/`0140` as cause | ✅ note 2, with relative links into `tasks/done/` |
| 3 | The note states the lead's current menu position and that "team room" is retired | ✅ note 2 (*"menu option 1, not 7 … Option 7 is `wiki`"*, *"retired project-wide"*); restated at note 4 |
| 4 | *"Routes rather than does"* corrected **or** explicitly deferred — silence fails | ✅ **corrected**, at **both** sites, under a distinct ⛔ marker |
| 5 | `**Status:**` still reads `accepted` | ✅ verified after the edit; three of the four blocks say so in their own text |
| 6 | The form is reproducible, and any `/fkit-record-decision` change is **named, not done** | ✅ form spec + two templates in `plan.md` §3/§5; header legend inside the ADR; skill change is follow-up 4, **not made** |

**Tests:** `npm test` — **560 tests, 560 pass, 0 fail**; the mutation hard gate passed
(*"real + unmutated copy green; each mutation reds its NAMED assertion"*). No test reads this ADR, so a
green suite is a **regression check, not evidence the note is correct** — the diff and the code
re-verification above are that evidence.

---

## Follow-ups — the authoritative list (supersedes `plan.md` §6)

The plan's §6 listed six. Q2's ruling (§Decision 3 now in scope) **changed two of them**, and the
citation-form finding **adds a seventh**.

1. **ADR-010 §Context bullet 2 + §Decision 2 — dated correction for the retired `skillOverrides`
   mechanism** (ADR-018). *"Hidden from the `/` menu and unrunnable by name"* is false; skills are
   **visible but blocked** today. The vault already carries this note; the KB source does not.
   *(Unchanged by Q2. Note: this pass added a parenthetical **naming** the deferral — see "Deviation"
   above — so the follow-up now has a hook in the ADR pointing at it.)*
2. **ADR-010 §Decision 5 + §Context — `skills_for_role()` moved** to `claude/skills-for-role.sh`, and
   the `skills:` frontmatter was **dropped** (ADR-012), resolving the "two lists disagree"
   inconsistency the ADR records as still open. *(Unchanged by Q2. Scope note: this pass's §Decision 3
   notice already states the correct file for `skills_for_role()` in passing — the follow-up should
   avoid restating it a second way.)*
3. **ADR-010's stale code line-ranges** — seven of them, a `0160` Case-2-adjacent class. **⚠️ CHANGED
   BY Q2:** three of the seven are now **annotated as stale in place** by this pass
   (`claude/agents/fkit-lead.md:22-26`, `claude/fkit-claude.sh:190`, and the `skills_for_role()`
   location), so the follow-up's remaining surface is the §Context menu/lock pointers and the
   §Related `Code:` line. Likely belongs with `0171` (durable-citation-anchors convention page) rather
   than as a standalone repair. **Also unverified and still open:** `claude/scaffold/CLAUDE.md:12-50`
   in §Related — the file is 92 lines and `:12` is `## The fkit agent team`; the range contents were
   never checked.
4. **Teach `/fkit-record-decision` the correction-note + reversal-notice form** — including the
   two-marker legend (⚠️ drift / ⛔ reversal), the adjacent-placement rule, and the "left
   byte-identical" clause. The brief explicitly wants this **named, not done**. **⚠️ CHANGED BY Q2:**
   the shape to teach is now **three-part** (drift note, reversal notice, header `- **Corrections:**`
   bullet), not one.
5. **Wiki resync of the ADR-010 page** once this note lands, so the vault's *"the sanctioned fix is a
   dated one-line correction note appended … **still open**"* retires. **`fkit-wiki` only.**
   **⚠️ CHANGED BY Q2:** the vault page must now reflect **three** KB-side notes plus a header bullet,
   and its own *"one-line"* phrasing is now inaccurate — the landed notes are multi-line.
6. **Producer note:** brief `## Priority` 124 vs board P125.
7. **🆕 Reconsider the notes' citation form.** The approved plan's ground for writing no `:NNN` was
   false (see "Re-verification" above); the ruling **endorses** `claude/…:NNN` **paired with a quote**
   for files under `claude/`. The form as shipped is permitted, so this is an improvement, not a
   defect. Owner's call.

**Coordination, unchanged and still live:** task `0170` is scoped to append a dated note to ADR-032
and cites *"cf. `0143`'s appended note on ADR-010"* as its model. **The form landed here binds that
task** — and `0170`'s own row mandates *"write no `:NNN` line numbers"*, which is consistent with what
shipped.

---

## Round 1 review — dispositions and decision log (2026-08-02)

The reviewer's round-1 findings and this worker's verdicts live in
[`review.md`](review.md) (§*Reviewer findings*, §*Coder response*, §*Accepted residuals*). Summary of
what **changed the deliverable**, and why each call qualified.

### Decision log — autonomously-applied fixes and obvious-winner calls

| # | Finding | What changed | Why it qualified |
|---|---------|--------------|------------------|
| 1 | **R3** (low, reviewer's label; **defect**, mine) | `adr-010:49-50` — *"it is the conductor intro **and the ADR-031 stance note** today"* → *"it is the conductor intro today, and the ADR-031 stance note that corrects the tools line **begins immediately below that range**."* | **ADR-019 autonomous-fix class**, all four tests met: **verified-CORRECT** first-hand (`sed -n '26p' claude/agents/fkit-lead.md \| od -c` → a bare `\n`; intro is `:22-25`, stance note starts `:27`, so `:22-26` is intro + blank line); **mechanical** (one clause, no new fact introduced); **localized** (two lines, both added by this task); and **inside the approved plan**, whose entire purpose is that the notes be accurate. Also: a factual slip inside a correction note about factual slips is the one defect this task cannot ship — recorded as residual **R3-cite-accuracy**. Not put to the owner. |

**No other fix was applied.** Every other finding was either an owner disposition (R1, R2, R4, R5) or
already settled before this round (Q4 deviation, citation form). **Obvious-winner calls made without
the owner: exactly the one above.**

### Owner dispositions relayed into this round

| # | Finding | Owner's ruling | Effect |
|---|---------|----------------|--------|
| **R1** | medium — both notices sit **below** the claim they correct, and the plan cited *"banner above claim"* without listing placement as a deliberate difference | **KEEP AS SHIPPED**, and record it as a **reasoned** residual | No text change. Residual **R1-placement** written, with the rationale the shipped form originally lacked: an above-placed block visually detaches from the bullet it annotates and breaks the §Context narrative, and the header `- **Corrections:**` bullet already warns the reader first. **Binds `0170`.** |
| **R2** | low — 12 stale `adr-010:NNN` pointers in sibling ADRs | **Follow-up, not this task**; **folds into the durable-citation-anchors work**, does not stand alone | No change. Residual **R2-pointer-drift**, recording the corrected scope — **12 pointers, not the 1 this worklog's residual 4 originally reported**. |
| **R4** | low — `adr-010:127` (new) names `claude/skills-for-role.sh`, §Decision 5 at `:144` still names `claude/fkit-claude.sh` | **Follow-up, not this task** — already inside the Q4 exclusion | No change. **⚠️ 0143 ships with a visible self-contradiction inside ADR-010, one screen apart. Recorded plainly as residual R4-contradiction-ships, not softened.** Its "re-raise only if" fires if follow-up 2 has not landed by the end of Sprint 2. |
| **R5** | low — the header bullet is 4 physical lines, not the "one line" Q3 ruled | **RATIFIED as shipped** — one metadata *item*; the ⚠️/⛔ legend is the minimum that makes the two-marker system readable | No change. Residual **R5-header-form**. **Binds `0170`'s header form too.** |

### Carried forward as settled — not re-litigated this round

- **The Q4 deviation was RIGHT; wording kept as shipped.** Codex called it *"excluded scope shipped"*;
  the reviewer ruled that **PARTIALLY CORRECT and rejected it as a defect** — no correction to
  Decision 2 was written, follow-up 1's surface is intact, and relaying ADR-031's flat *"Decisions 1,
  2, 4, 5 unaffected"* would have added a **new** misleading claim. Frontier-move, correctly
  self-flagged. Residual **Q4-scope-fence**.
- **The citation form is PERMITTED and is the right choice.** The reviewer read §3.3 and §1.1 of the
  durable-citation report: §3.3 is titled *"narrow, do not ban"* and its *"Keep `path:NNN`"* is a
  **carve-out from a ban, not an obligation**; §1.1's rider governs *how* to cite a number, not
  *whether*. No-`:NNN`-with-quote carries the durable half and drops the fragile half. **Not mandated,
  not non-compliant.** **Binds `0170`.** R2 is live proof it was right — 12 sibling `:NNN` pointers
  broke in this very edit while the notes' own citations did not. **The finding above that the
  *plan's rationale* for the choice was false remains accurate and stands recorded.** Residual
  **Citation form**.

### Additions-only, re-proven after the R3 fix

```
$ git diff --numstat -- …/adr-010-…md
71      0
$ git diff -U0 -- …/adr-010-…md | grep '^-' | grep -v '^---'
(no output)
$ git diff --check -- …/adr-010-…md
(clean)
```

**Still 71 insertions, 0 deletions.** R3's repair rewrote only text **this task itself added**; no
pre-existing ADR line was modified, so the step's `NEEDS-DECISION` stop condition was never reached.

**Tests re-run after the fix:** `npm test` — **560 tests, 560 pass, 0 fail**, mutation hard gate
passed. No test reads this ADR, so green is a **regression check, not evidence the note is correct**.

### Follow-up list — corrected by this round (supersedes the list above)

The list above was written before review. **Three entries change; one closes; the total is 7.**

1. **ADR-010 §Context bullet 2 + §Decision 2 — dated correction for the retired `skillOverrides`
   mechanism** (ADR-018). *"Hidden from the `/` menu and unrunnable by name"* is false; skills are
   **visible but blocked** today. *(Unchanged. The ⛔ notice's parenthetical is its hook.)*
2. **ADR-010 §Decision 5 + §Context — `skills_for_role()` moved** to `claude/skills-for-role.sh`, and
   the `skills:` frontmatter was **dropped** (ADR-012). **⚠️ RAISED IN PRIORITY BY R4:** this is no
   longer only a staleness repair — until it lands, ADR-010 **contradicts itself on one screen**
   (`:127` vs `:144`). Residual **R4-contradiction-ships** re-raises if it has not landed by the end
   of Sprint 2.
3. **ADR-010's stale code line-ranges** — the §Context menu/lock pointers and the §Related `Code:`
   line; three of the original seven are now annotated as stale in place. **Also still unverified:**
   `claude/scaffold/CLAUDE.md:12-50` in §Related — the file is 92 lines, `:12` is
   `## The fkit agent team`, range contents never checked. Belongs with `0171`.
4. **🔀 REPLACES the old follow-up 3's sibling half — the 12 displaced `adr-010:NNN` pointers in
   ADR-012 / ADR-018 / ADR-031.** `adr-012:9` (×2), `:23`, `:25`, `:66`, `:87`, `:105`, `:166` (×2);
   `adr-018:88`; `adr-031:7`, `:27`. 10 self-correct via a paired quote or a `§Decision N` heading;
   **2 are naked and land on unrelated text** — `adr-012:87` and `adr-012:105`. **Owner-ruled: fold
   into the durable-citation-anchors work (`0171`), do NOT file standalone.**
5. **Teach `/fkit-record-decision` the correction-note + reversal-notice form** — the three-part shape
   (drift note, reversal notice, header `- **Corrections:**` bullet), the two-marker legend, the
   *"left byte-identical"* clause, and — **new from R1** — the **below-the-claim placement rule with
   its rationale**, which is a KB-side departure from the vault's *"banner above claim"*. Named, not
   done.
6. **Wiki resync of the ADR-010 page** so the vault's *"the sanctioned fix is a dated one-line
   correction note … **still open**"* retires. The vault page must reflect **three** KB-side notes plus
   a header bullet, and its *"one-line"* phrasing is now inaccurate. **`fkit-wiki` only.**
7. **Producer note:** brief `## Priority` reads **124**; sprint board row reads **P125**. Harmless per
   `conventions/priority-is-rank-not-identity.md`, but it is a brief/board mismatch. Producer's call.

**❌ CLOSED, do not file:** the old follow-up 7 (*"reconsider the notes' citation form"*). The
reviewer adjudicated the shipped form **permitted and the strongest available choice**, and the owner
carried that forward as settled. It is now residual **Citation form**, not an open item.

**Coordination, still live:** task `0170` (append a dated note to ADR-032) cites `0143` as its model.
**Four things now bind it:** the below-the-claim placement (R1), the wrapping header
`- **Corrections:**` bullet with its legend (R5), the no-`:NNN` citation form, and the two-marker
⚠️/⛔ vocabulary.

---

## What was NOT touched

`ai-agents/wiki-vault/` (including ADR-010's vault page — `fkit-wiki`'s exclusive surface) · ADR-031 ·
ADR-022 · ADR-018 · ADR-012 · ADR-032 · the sprint board · `/fkit-record-decision` · the brief · the
task folder's location or board status (the close is a producer's, per ADR-033) · any source file ·
any test. **No commit, no push.**
