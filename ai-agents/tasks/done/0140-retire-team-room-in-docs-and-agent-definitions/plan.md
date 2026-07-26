# Plan — 0140 Retire "team room" in the docs and agent definitions, fix the stale "menu 7" citations

- **Task-id:** `0140-retire-team-room-in-docs-and-agent-definitions`
- **Approved:** 2026-07-25, owner, via `/fkit-task-ship-loop` plan gate ("Approve as planned")
- **Scope boundary:** this file. Anything outside it stops for the owner.
- **Depends on:** 0139 — **landed and closed** before this plan was approved, so the "menu 1" claims
  are true as written.

## Three findings against the brief — reported, not silently corrected

The brief instructs: *"A path or line number that does not match what you find is a finding to report,
not a number to quietly correct."* Three do not match.

1. **"No ADR-027 dual-home surface" is WRONG.**
   `knowledge-base/conventions/task-owner-vocabulary.md:19` reads *"The team room — routes questions;
   does not itself do the work"*, and the file exists in **both** homes —
   `ai-agents/knowledge-base/conventions/` and `claude/scaffold/ai-agents/knowledge-base/conventions/` —
   currently **byte-identical** (3224 bytes each, `diff` clean). `dual-home-parity.md:41` rules
   `knowledge-base/conventions/*.md` **"fkit-authored ✅ must match"**. So the file is in scope **and**
   both homes must be edited together.
2. **The inventory misses three live sites:** `claude/skills/fkit-team/SKILL.md:51` (the brief lists
   only `:20`), `ai-agents/knowledge-base/architecture.md:17` (lists only `:105`), and the convention
   file above (absent entirely).
3. **A third dated report carries the phrase:** `reports/2026-07-11-doc-drift-audit.md:19,27,62`. The
   brief names only two reports as untouchable history. The same reasoning applies — leave it, report it.

## The change

### A. Stale menu-number citations — correctness

Reworded so they cannot go stale again (the point of the convention 0137 records), not merely
renumbered to 1:

| File:line | Now | Becomes |
|---|---|---|
| `claude/agents/fkit-lead.md:4` | `— menu option 7` | `— the first entry in the \`fkit\` menu` |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:13` | `` `fkit lead` **session** (menu 7) `` | `` `fkit lead` **session** `` |
| `ai-agents/knowledge-base/architecture.md:105` | `(menu 7; ADR-031)` | `(ADR-031)` |

`architecture.md:180` renders the menu as `(1-7 — an if/else; no LLM anywhere in the routing)`. The
**range is unchanged** by 0139 — **confirmed, and left alone**, as the brief instructs.

⚠️ `claude/agents/fkit-lead.md` is a **system prompt**, in the lead's context every turn. Its `:4` site
is inside the frontmatter `description:` — which is already a `>-` **folded block scalar**, so the
`": "` hazard (task 0136) is lower than the brief states. Checked anyway; no `": "` introduced.

### B. "team room" as a concept name — wording only

`claude/agents/fkit-lead.md` `:4`, `:12` (the greeting), `:22`, `:23` · `claude/README.md:103` ·
`claude/skills/fkit-team/SKILL.md:20` **and `:51`** · `claude/scaffold/CLAUDE.md:37` ·
`README.md:4`, `:45` · `CLAUDE.md:8` · `AGENTS.md:9` · `ai-agents/knowledge-base/architecture.md:17`

Replaced with "lead" / "the lead" / "the conductor" as each sentence reads best. **A rename, not a
rewrite** — no surrounding prose restructured, no claim changed. `fkit-lead.md:23` (*"The owner reached
you by picking 'team room' from the `fkit` menu"*) becomes factually correct, not just renamed.

### C. The dual-home pair — both homes, byte-identical

`ai-agents/knowledge-base/conventions/task-owner-vocabulary.md:19` **and**
`claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md:19`, edited identically.
`diff` the two afterwards to prove parity held.

### D. Owner-approved scope addition — the menu aliases are dropped

Ruled at the plan gate on the reviewer's recommendation (*"drop it in 0140, and let `lead` be the only
word"*), recorded as a **new decision**, not a reopening of 0139:

- `claude/fkit-claude.sh:477` — `1|lead|team|"team room")` → `1|lead)`.
- `claude/fkit-claude.sh:182-192` — the ⚠️ anti-re-add comment written in 0139 describes those words as
  "MENU-PICK aliases only". Rewritten: the words are retired everywhere, and the argv-vs-line hazard is
  kept as the reason not to re-add them.
- `test/launcher-contract.test.js:138-139` — comments say "the team room". Reworded (comment-only); the
  brief permits this where the file is already being touched.

**Consequence, stated plainly: typing `team` or `team room` at the menu now gets
`? "team" is not one of 1-7.`** The word is gone from every path — display, menu pick, and CLI.

### E. Explicitly NOT touched — reported instead

`decisions/adr-010-…:26,66,100` (task 0143's job, architect-owned) · `decisions/adr-012-…:61` ·
`decisions/adr-031-…:7` (a **quotation** of ADR-010 — rewriting it would misquote the source) · all
three dated reports (`2026-07-22-design-…`, `2026-07-18-design-…`, `2026-07-11-doc-drift-audit`) ·
`ai-agents/sprints/**` prose and the sprint-review ledger · `ai-agents/wiki-vault/` (**0141**,
wiki-role-only).

**Flag for the producer, not an edit:** `sprints/sprint-2.md:147` — the row for the now-closed 0139 —
asserts *"word aliases `team`/`team room` are kept"*. Item D makes that **false**. It is a
producer-owned board row for a closed task, so this task does not edit it.

## Verification

1. `npm test` → expect **521 tests green + the `prove-red.sh` hard gate**. **If a test requires
   editing, STOP and report it** (brief step 3 + the same rule 0139 carried).
2. Grep sweep for `team room|team-room|Team room|Team Room` over `*.md`/`*.sh`/`*.js` excluding
   `node_modules`, `.claude/`, and `ai-agents/tasks/` — survivors must be **exactly** the §E set.
3. Grep for `menu option 7|menu 7` — survivors must be only the untouched ADR and reports.
4. `diff` the two `task-owner-vocabulary.md` homes → **identical**.
5. `claude/agents/fkit-lead.md` frontmatter still parses and the description is the real text, **not**
   the H1 fallback.
6. Launcher under a real pty: `team` / `team room` are now **rejected** at the menu
   (`is not one of 1-7`); `1` and `lead` still open lead; the other picks unaffected; `fkit lead` on
   the CLI still works and `fkit team` still errors.
7. Every edited sentence still asserts what it asserted before — a rename, not a rewrite.

## Commit

None. Every edit stays in the working tree; the owner commits.
