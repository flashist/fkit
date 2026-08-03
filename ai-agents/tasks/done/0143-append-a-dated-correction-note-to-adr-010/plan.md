# Plan — 0143, append a dated correction note to ADR-010

**Approved by the owner** via `AskUserQuestion` in the live `fkit-lead` `/fkit-sprint-ship-loop`
driver session, **2026-08-02** ("Approve as planned"), together with four rulings recorded in
`worklog.md`. Written by a spawned fkit-architect planning worker; executed by a spawned
fkit-architect implementation worker. Measurements below were taken 2026-08-02 against a clean
working tree on `main` and **re-verified firsthand before any text was written** (see `worklog.md`
§Re-verification for what held and what did not).

---

## 1. Which claims in ADR-010 are stale today

ADR-010 has **never been amended**: `git log` on the file returns two commits, both creation-era
(`5d3b4e0`, `8a3f1e5`). Every note this task adds is the first.

### The brief's target sentence — §Context, the `- **A 7th agent, `fkit-lead`**` bullet

> *"**A 7th agent, `fkit-lead`** — the "team room" (menu option 7) — routes rather than does. It has
> no Write or Edit tools, deliberately (`claude/agents/fkit-lead.md:22-26`)."*

| Part | Status today | Evidence |
|---|---|---|
| "A 7th agent" | **still true** | `claude/fkit-claude.sh` — `ROLES="lead producer coder architect reviewer adversarial-reviewer wiki"` (7) |
| "team room" | **retired** | label gone from the launcher; survives only in the *rejection* comment (*"`team` / `team room` are NOT accepted"*) |
| "menu option 7" | **false — lead is option 1; option 7 is wiki** | menu prints `1) lead` and `7) wiki`; case arms `1\|lead)`, `7\|wiki)` |
| "routes rather than does" | **reversed** | ADR-031 §Decision 1 |
| "no Write or Edit tools, deliberately" | **false** | ADR-022; `claude/agents/fkit-lead.md` frontmatter carries no `tools:` key; its own stance note says so |
| the pointer `claude/agents/fkit-lead.md:22-26` | **stale** | that range is the conductor intro + the ADR-031 stance note; no tools claim near it |

**The sentence carries four falsehoods, not the brief's three.** The brief names label + menu +
"routes rather than does"; it does not name **"no Write or Edit tools"**, which ADR-022 falsified
earlier and independently.

### A second site the brief does not name — §Decision 3

> *"3. **`fkit-lead` (the team room) is a router, not a doer.** It has no Write/Edit tools and owns
> only `/fkit-team` and `/fkit-query`. It is the safe default when no role is named
> (`claude/fkit-claude.sh:190`)."*

- "router, not a doer" — **reversed**, and ADR-031 names *this exact site* as what it reverses.
- "owns only `/fkit-team` and `/fkit-query`" — **false**: `skills_for_role()` in
  `claude/skills-for-role.sh` grants lead **five** skills, including `fkit-sprint-ship-loop`.
- "safe default when no role is named" — **still true**, but its pointer `:190` is stale; the default
  is `[ -n "$role" ] || role="lead"` under the comment *"lead is the safe default"*.

**"Routes rather than does" lives at two sites** — one in Context, one in the binding Decision list.
Correcting only Context leaves the ADR's *decision* reading as in force. Hence the owner's Q2 ruling.

### Further stale claims found, ruled OUT of this task (follow-ups, §6)

- **§Context bullet 2 + §Decision 2** — the `skillOverrides` off-list, "hidden from the `/` menu **and
  unrunnable by name**". **Retired** (task 43 / ADR-018); skills are visible-but-blocked today.
- **§Context + §Decision 5** — `skills_for_role()` "in `claude/fkit-claude.sh:75-86`". **Moved** to
  `claude/skills-for-role.sh`; the launcher only sources it.
- **§Context** — the "`skills:` frontmatter is a second list, and they disagree" inconsistency.
  **Resolved**: no `claude/agents/*.md` carries a `skills:` key (ADR-012 dropped it).
- **Seven stale code line-ranges** across §Context, §Decision and §Related.

---

## 2. Soft dependencies — both landed

`0139` and `0140` are both in `ai-agents/tasks/done/`. The note may therefore assert a menu position
as **present-tense fact**, verified from code rather than from a document (owner's Q5 ruling).

---

## 3. The form — a port, not an invention

The premise "this is the first" is **partly false**. Three precedents exist on disk:

1. **Vault-side, ADR-010's own page** — carries two dated correction notes dated 2026-08-02, inline,
   indented under the claim, opening `⚠️ **Dated correction 2026-08-02 — …**` / `✅ …`, each stating
   *"The sentence above is left byte-identical as the record of …"*.
2. **Vault-side convention** — the wiki-resync task page: *"Placement, not word count, was the
   recurring error … The rule adopted — **banner above claim** — is now the vault's convention."*
3. **KB-side, ADR-032** — a dated `## Amendment — 2026-07-22, owner ruling: …` **section**. And
   ADR-036 carries dated `- **Revised:**` lines in its **header metadata**.

**Decision: match the vault's inline form; do not invent a new one**, with two deliberate differences.

- **Match:** the `⚠️/⛔ **Dated <kind> YYYY-MM-DD — <one-line claim of what is false>**` opener; the
  explicit *"left byte-identical"* clause; naming the causing tasks; blockquote so it is visually not
  the ADR's own voice.
- **Differ 1 — links.** The vault uses `[[wikilinks]]`; the KB uses relative markdown links.
- **Differ 2 — citation form.** Anchor by **file + quoted phrase**, no `:NNN` into a mutable file.
  (See `worklog.md` §Re-verification — the plan's stated *ground* for this was wrong; the choice
  itself is permitted and was kept as approved.)

**So `0143` does not establish the form from nothing — it ports an established vault form to the
knowledge-base side.**

### Template — a drifted fact

```markdown
> ⚠️ **Dated correction YYYY-MM-DD — <what is false, one line>.** The sentence above is
> **left byte-identical** as the record of what was decided on <original date>.
> **What is true today**, verified against live code <date>: <bulleted facts, each with a
> quoted phrase from the live file>. **Cause:** task [`NNNN`](../../tasks/done/…/brief.md),
> owner-ruled <date>. **This ADR's decision is unaffected; Status stays `accepted`.**
```

### Template — an overturned decision

```markdown
> ⛔ **Dated reversal notice YYYY-MM-DD — this decision is REVERSED. Do not follow it.**
> Reversed <date> by [ADR-NNN](adr-NNN-….md) §Decision N. The text above is **left
> byte-identical** as the record of what was decided on <original date>.
> **In force today:** <…>. **Still true:** <…>. **No other decision in this ADR is
> reversed** — <list> stand, and this ADR remains `accepted`.
```

---

## 4. "Note, not a rewrite" — operationally

- **Byte-identical:** every existing line of the ADR. No word, link, date, citation or heading in the
  current body is touched — **including the stale `:NNN` pointers**, which stay as the record of what
  was cited on 2026-07-11.
- **Added:** blockquote note blocks only, plus one header metadata bullet.
- **Placement — adjacent, not footer.** Each note sits directly **after** the bullet/decision it
  corrects, at that item's continuation indent, so a reader hitting the false sentence hits the
  correction in the same visual block. An end-of-file "Corrections" section is **rejected**: it
  reproduces the exact placement error the vault's lint named.
- **Original vs correction is unambiguous** three ways: the note is a blockquote (the ADR body uses
  none in §Context/§Decision); it opens with a marker + the literal words `Dated correction` /
  `Dated reversal notice` + an ISO date; and it names its own cause task and verification date.
- **Verification:** `git diff` must show **additions only** — zero deleted or modified lines.

---

## 5. Two kinds of staleness — the form must distinguish them

| | A fact that drifted | A decision that was overturned |
|---|---|---|
| Example | "menu option 7", "team room" | "router, not a doer" |
| What changed | the world moved; the *decision* is untouched | a later ADR **decided differently** |
| Who authorizes | any task that lands the change (`0139`/`0140`) | an ADR, by name |
| Reader's action | update your mental model | **do not follow this decision** |
| Marker | **⚠️ Dated correction** | **⛔ Dated reversal notice** |

Collapsing them would be the real defect: a reader who sees one uniform banner cannot tell "the menu
moved" from "this instruction is void." ADR-031 itself draws the line (*"a real decision, not a
drift"*); the note form carries that distinction visibly rather than re-deriving it.

**Note set (owner-ruled Q1 + Q2 + Q3): three blocks plus one header bullet.**
1. **⚠️ Dated correction** at §Context — label retired, menu option 1, and the ADR-022-falsified
   "no Write or Edit tools".
2. **⛔ Dated reversal notice** at §Context — the *"routes rather than does"* half, pointing at
   ADR-031 and at note 3.
3. **⛔ Dated reversal notice** at §Decision 3 — the site ADR-031 formally reverses, plus the
   "owns only two skills" and menu/label corrections.
4. **Header metadata bullet** `- **Corrections:**` — pointer to both sites plus the marker legend.

---

## 6. Scope boundary — what this task does NOT do

**Hard out:**
- **`ai-agents/wiki-vault/` is not touched** — including ADR-010's vault page. Exclusive `fkit-wiki`
  write surface.
- No `Status:` change — stays `accepted`. No `superseded`, no `deprecated`.
- No edit to any existing byte of ADR-010's body.
- No edit to ADR-031, ADR-022, ADR-018, ADR-012, or the sprint board.
- No change to `/fkit-record-decision` (the brief forbids it here).
- No commit; the edit is left in the working tree.
- No scaffold copy to sync — `conventions/dual-home-parity.md` lists `knowledge-base/{decisions,…}`
  as **⛔ never sync**.

**Follow-ups — see `worklog.md` §Follow-ups for the corrected, authoritative list.**
