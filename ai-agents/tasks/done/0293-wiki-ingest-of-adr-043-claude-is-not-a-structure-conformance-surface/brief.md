# Wiki ingest of ADR-043 — `.claude/` is not a structure-conformance surface, the refresh is the guarantee

## ID
0293

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-wiki

## Context

### Authority

**Owner ruling 2026-08-13**, given live via `AskUserQuestion` in a `fkit lead` session — **the option
label is the verbatim text**: **"Batch it — file it, run later"**.

⚠️ **The owner chose filing over running it that night, and gave a reason: to avoid a FOURTH vault
write in a single day.** That reason is not incidental — it is the substance of the ruling, and it is
why the batching requirement below is mandatory rather than advisory. ⛔ **Running this row alone, as
a one-off librarian session, discards the ruling's stated purpose.**

### What is being ingested

[ADR-043](../../../knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md)
(`ai-agents/knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md`,
status **accepted**, dated **2026-08-13**), which discharges task
[`0255`](../0255-decide-whether-claude-enters-the-structure-conformance-surface/brief.md).

**The ruling in one line:** `.claude/` is **deliberately NOT** a structure-conformance surface. The
unconditional launch refresh is the guarantee. No spec row, no manifest row, no new class, no new
check.

**The load-bearing argument, and it must survive into the vault page:** the refresh is **stronger**
than conformance on the one axis conformance cannot reach — **deletion**. Under
[ADR-015](../../../knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md)'s
invariant a file fkit stops shipping **lingers under `ai-agents/` forever** and `/fkit-heal` can only
ever **report** it; under `.claude/`'s refresh a retired agent or skill is **gone automatically on the
next launch**. ⛔ **A page that presents Option 4 as "we decided not to bother" has lost the ADR.**

**Two further pieces a page must not drop:**
- **§C5 — absence is now evidence of a decision.** Zero `.claude` rows in `claude/structure-spec.md`
  is **ruled**, not an oversight. §"Re-raise only if" names four conditions that would flip it, and
  **three things that are explicitly NOT grounds to re-raise**.
- **§C4 — the implementation thread ENDS rather than defers.** `0255`'s Notes listed it as blocking
  *"the (unwritten) implementation brief for `.claude/` conformance"*; under this ruling **that brief
  is never written**, and the owner signed off knowing that.

### ⚠️ ADR-015 AND ADR-039 ALREADY HAVE VAULT PAGES — AND ADR-043 AMENDS NEITHER

Verified on disk 2026-08-13 — both exist:

- `ai-agents/wiki-vault/wiki/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md`
- `ai-agents/wiki-vault/wiki/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md`

⛔ **ADR-043 §C2 and §C3 say explicitly that neither is touched and neither is amended.** C2: ADR-015
governs `ai-agents/`; `.claude/` is outside its scope **by construction** — the invariant forbids
overwrite and delete, and `.claude/`'s whole mechanism *is* overwrite and delete. C3: ADR-039's
consent-gated repair stays scoped to the spec inventory (`ai-agents/**` plus the two root context
files); nothing widens or narrows.

⚠️ **But a reader arriving from either page needs the pointer.** Someone reading ADR-039's page and
wondering *"does this cover my `.claude/`?"* today has nothing telling them the question was asked and
answered. **That is what the back-links are for** — a boundary marker, ⛔ **never an amendment**.

⚠️ **Also verified 2026-08-13: `ai-agents/wiki-vault/wiki/decisions/` holds 42 pages, ADR-001 through
ADR-042 — one page per ADR, and ADR-043 has none.** `grep -rl "ADR-043" ai-agents/wiki-vault/` returns
**nothing**.

### ⛔⛔ THE BATCHING REQUIREMENT — RUN THIS IN ONE LIBRARIAN SESSION WITH `0291`

[`0291`](../0291-correct-two-stale-vault-claims-surfaced-by-0258s-review/brief.md) — *Correct two
stale vault claims surfaced by `0258`'s review* — is **already filed, `🔲 Backlog`, `## Owner:
fkit-wiki`, and unrun** (verified 2026-08-13). It edits `index.md` and appends to `log.md`.

**The churn is the reason, and it is measured.** `ai-agents/wiki-vault/wiki/systems/install-and-self-update.md`
was written **three times on 2026-08-13** by three separate librarian runs — `log.md:1924` (the `0285`
block, inside that day's sync entry beginning `:1884`), `log.md:2017` (the `0258` ingest), and
`log.md:2111` (the `0289` ingest). The owner's ruling was explicitly *don't make it four*.

**Both rows also collide on the same two files** — `index.md` and `log.md`. Run separately, they
produce two log entries and two `index.md` edits for work that is one session's worth. ✅ **Run
together: one session, one coherent `log.md` entry set, one pass over `index.md`.**

⚠️ **They are still two tasks with two independent scopes and two closes.** ⛔ Batching is a
*scheduling* instruction — it does **not** merge the rows, does **not** let one row's scope leak into
the other's, and does **not** change either `## Status`.

⚠️ **`0291` says its own item 2 must not touch `install-and-self-update.md` because `0289` may be
mid-run.** `0289` has since closed. **Re-check that page's state before assuming either way** — and
note that **neither this row nor `0291` has that page in scope.**

### ⛔ THIS ROW RUNS IN A `fkit wiki` SESSION — NOT IN `/fkit-sprint-ship-loop`

`## Owner` is **`fkit-wiki`** and must stay that way. **Vault writes are that role's exclusively**
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

⚠️ **The sprint loop cannot run this row** — the same exclusion recorded on `0258`, `0285`, `0287`,
`0289` and `0291`: **the loop never reads `## Owner`**
([ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)
fixes each step's role to the skill that step runs), so its **Build** step spawns `@fkit-coder`, and
that role may **never** write the vault. Driven by the loop this row either stalls on a refusal or
breaches ADR-005. **It runs in a `fkit wiki` session, or via a spawned librarian.**

⚠️ **That is an exclusion from the loop and from nothing else.** `## Status` stays `🔲 Backlog`. This
row is **NOT blocked**, **NOT deprioritised**, **NOT descoped**.

## What to build

The librarian's own ingest procedure (`/fkit-wiki-ingest`) against the ADR-043 source record.
**Structure and page shape are the librarian's call** — what follows is scope and content
obligations, not a template.

1. **Re-derive from disk. ⛔ Do not work from this brief's quotations.**
   - ADR-043 itself — §Decision, §Options considered (all four, including the three rejected on their
     real costs), §Residuals R1/R2, §Consequences C1–C7, §"Re-raise only if", §Owner sign-off.
   - The existing `wiki/decisions/adr-015-*.md` and `wiki/decisions/adr-039-*.md` pages, and their
     `## Related` sections.
   - `index.md`'s decisions list and `log.md`'s tail.
   ⚠️ **State explicitly, in both directions, where what you measure differs from this brief.**

2. **Create the ADR-043 vault page**, carrying at minimum:
   - the **decision**, stated as a decision (`.claude/` is deliberately not a conformance surface);
   - the **deletion argument** — why the refresh is *stronger* than conformance, not weaker
     (⛔ dropping this loses the ADR);
   - **§C5** — absence of `.claude` spec rows is **ruled**, plus the four re-raise conditions **and
     the three explicit non-grounds**;
   - **§C4** — the implementation thread **ends**, and the owner signed off knowing it;
   - **§C7** — a refresh receipt is **permitted, not required**; ⛔ **nothing is being built and
     nothing is filed** (this clause exists precisely so a reader cannot misread the ruling as
     *"no signal, ever"*);
   - the **owner sign-off**: verbatim label **"Sign off — Option 4"**, `AskUserQuestion`, live
     `fkit lead` session, 2026-08-13, plus the two subsidiary rulings (**"Its own follow-on brief"**
     → C6, **"Record it in the ADR as permitted, not required"** → C7);
   - ⚠️ **the three rejected options with their real costs**, not dismissals — Option 2 in particular
     is recorded as *"the sharpest of the three rejected"*, and Option 1 as *"genuinely elegant"*.

3. **Reciprocal back-links — required, and bounded.**
   - The new page links **to** `[[decisions/adr-015-…]]` and `[[decisions/adr-039-…]]`, stating the
     relationship as ADR-043 states it: **not touched, not amended — this records where the scope
     ends.**
   - Each of those two pages gains a **back-link bullet** in its `## Related` section pointing at the
     new page, with the same boundary framing.
   - ⛔⛔ **Those back-links are PURE ADDITIONS.** ADR-015's and ADR-039's existing text stays
     **byte-identical** — ⛔ no restatement of either invariant, ⛔ no status change, ⛔ no edit to
     their decision text, ⛔ no reflow. ⚠️ **ADR-015's page already carries a dated amendment and dated
     updates; adding another update block there would assert an amendment ADR-043 explicitly does not
     make.** A `## Related` bullet is the whole intervention.
   - Add whatever **other** back-links the new page's own outbound `[[…]]` links create — link hygiene
     is bidirectional. ⛔ Nothing beyond the far side of a link this page actually makes.

4. **Add the ADR-043 row to `index.md`'s decisions list**, in the form the neighbouring ADR-039 /
   ADR-041 / ADR-042 rows use.

5. **Append the run's `log.md` entry.** ⛔ **`log.md` is APPEND-ONLY** — `log.md:3-5`'s own header and
   the owner ruling recorded on `0212`. **Never edit or annotate a past entry in place.**
   ✅ If run in the same session as `0291`, the log must make clear **which write belongs to which
   task** — one entry naming both, or one per task, is the librarian's call; **an unlogged vault write
   is not.**

6. **Record one verdict per site touched** — *page created* / *back-link appended, body byte-identical*
   / *index row added* / *out of scope, reported*. ⛔ A batch verdict does not satisfy this.

### ⚠️ One finding surfaced at filing — REPORT it, do not fix it here

`ai-agents/wiki-vault/wiki/tasks/sprint-5-fix-what-a-real-project-found.md:36` (measured 2026-08-13)
reads **"Still open:"** and lists `0255` — which is now in `ai-agents/tasks/done/`. ⚠️ **The same line
lists several other now-closed rows**, so the staleness is broader than `0255`.

⛔ **Fixing it is NOT in this row's owner-ruled scope** (ingest + the link hygiene that ingest
requires), and widening into it would make this the general vault sweep the ruling excludes. ✅
**Report it as a finding with what you measured.** ⚠️ It is also a **clean concrete instance of exactly
what [`0290`](../../backlog/0290-decide-whether-anything-should-notice-when-a-close-falsifies-a-vault-claim/brief.md)
is investigating** — a close falsifying a vault claim — and is useful evidence there. ⛔ **This row does
not answer `0290` and must not try to:** no mechanism, no lint rule, no skill edit.

### Constraints

- ⛔ **SCOPE:** ingest ADR-043 + the bidirectional link hygiene that ingest requires + the `index.md`
  row + the `log.md` entry. ⛔ **NOT a general vault sweep.** If a broader sweep looks valuable,
  **report it as a finding; do not run it here.**
- ⛔ **Vault writes only.** Do not edit `ai-agents/knowledge-base/`, `claude/`, `README.md`, or any
  source file. ⚠️ **⛔ Do not edit ADR-043 itself** — it is the source record, and this ingest is
  downstream of it.
- ⛔ **Do not touch `ai-agents/wiki-vault/wiki/systems/install-and-self-update.md`.** Three writes in
  one day is the churn this row's ruling exists to limit, and that page is in **neither** this row's
  scope nor `0291`'s.
- ⛔ **Do not edit any existing task brief**, including `0253`'s, `0255`'s, `0291`'s and `0292`'s.
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  no re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  no board-row edit beyond this task's own close.
- ⛔ **No commit, no push.**

## Verification steps

Each step is a runnable command. **Paste the command and its output; do not assert.**

1. **Facts were re-derived, not inherited.**
   ```
   ls ai-agents/wiki-vault/wiki/decisions/ | wc -l
   grep -rl "ADR-043" ai-agents/wiki-vault/ ; echo "exit=$?"
   grep -n "^## Related" -A40 ai-agents/wiki-vault/wiki/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md
   sed -n '1,6p' ai-agents/wiki-vault/log.md
   grep -n "0255" ai-agents/wiki-vault/wiki/tasks/sprint-5-fix-what-a-real-project-found.md
   ```
   ⚠️ **State explicitly where the measurement differs from this brief.**

2. **The page exists and carries the load-bearing content.** All must hold:
   ```
   ls ai-agents/wiki-vault/wiki/decisions/ | grep -i "adr-043"
   grep -c "deletion\|delete" ai-agents/wiki-vault/wiki/decisions/adr-043-*.md   # expect >= 1
   grep -n "permitted, not required" ai-agents/wiki-vault/wiki/decisions/adr-043-*.md
   grep -n "Sign off — Option 4" ai-agents/wiki-vault/wiki/decisions/adr-043-*.md
   ```
   ⚠️ Counts prove presence, not fidelity. **Paste the deletion-argument paragraph and the §C4/§C5
   passages in full** so a reader can judge whether the ADR survived the ingest.

3. **Reciprocal back-links exist in both directions.**
   ```
   grep -n "adr-015\|adr-039" ai-agents/wiki-vault/wiki/decisions/adr-043-*.md
   grep -n "adr-043" ai-agents/wiki-vault/wiki/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md
   grep -n "adr-043" ai-agents/wiki-vault/wiki/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md
   ```

4. **⭐ THE BACK-LINKS WERE PURE ADDITIONS — nothing on either page was rewritten.**
   ```
   git diff --numstat -- ai-agents/wiki-vault/wiki/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md ai-agents/wiki-vault/wiki/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md
   ```
   ⛔ **The deletions column MUST be `0` on both.** A non-zero deletion count means an existing ADR
   page was edited, not appended to — **that is a failure of this task, not a detail**, because
   ADR-043 §C2/§C3 say those records are not amended.

5. **`log.md` was appended to, never edited.**
   ```
   git diff --numstat -- ai-agents/wiki-vault/log.md    # deletions column MUST be 0
   git diff -U0 -- ai-agents/wiki-vault/log.md | grep '^-' | grep -v '^---'   # expect EMPTY
   ```

6. **`index.md` carries the ADR-043 row.**
   ```
   grep -n "adr-043" ai-agents/wiki-vault/index.md
   ```

7. **The churned page was NOT touched.**
   ```
   git diff --stat -- ai-agents/wiki-vault/wiki/systems/install-and-self-update.md   # expect EMPTY
   ```

8. **Nothing outside the vault changed.**
   ```
   git status --porcelain
   ```
   ⚠️ Expect **only** files under `ai-agents/wiki-vault/`, this brief, and — **if `0291` ran in the
   same session** — `0291`'s brief and its two sites. ⛔ **Nothing under
   `ai-agents/knowledge-base/decisions/`, nothing in `claude/`, no source file, no `README.md`.**

9. **Nothing committed, nothing staged.**
   ```
   git log --oneline -1 && git diff --cached --stat    # expect the staged diff EMPTY
   ```

## Notes

- **Why Backlog / Unscheduled.** Measured 2026-08-13: `ai-agents/sprints/sprint-5.md` carries **17
  status rows and all 17 read `✅ Done` — zero open rows** — so there is no open sprint to file into,
  and Backlog is where an unsprinted brief lands by construction. ⚠️ **Measured caveat: the plan's
  header at `sprint-5.md:3` still reads `🟢 ACTIVE`**, so the board is finished by row status but not
  yet marked closed. That is a plan-state observation, ⛔ **not this row's job to fix**. On merit it
  also belongs there: this is **synthesized-knowledge maintenance**, nothing in shipped behavior is
  broken, no other row is blocked on it, and **the owner explicitly chose to defer running it**.
  ⛔ **Filed by a spawned producer with no owner channel, so it is UNRANKED and re-ranks nothing**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  The owner may rank it whenever they next touch the board.
- **Provenance chain.** `0255` (the decision task) → **ADR-043** (the record) → this row (the ingest).
  `0253` sits upstream as the task whose shipped `README.md:35-40` prose is ADR-043's premise.
- **Relationship to `0292`.** `0292` applies ADR-043 §C6's `README.md:54` correction. **No file
  overlap** — `0292` touches `README.md`, this row touches `ai-agents/wiki-vault/` only. **No ordering
  constraint.** ⚠️ If `0292` lands first, the vault page may cite the corrected README sentence; if it
  has not, ⛔ **do not describe the corrected sentence as landed** — say the correction is filed as
  `0292`.
- **Relationship to `0291` — batched, not merged.** See the batching section. Two scopes, two closes,
  one session.
- **Relationship to `0290`.** This row supplies **evidence** for `0290`'s investigation (a close
  falsifying a vault claim) and **answers none of its question**.
