# Record the canonical merit-statement form in the convention page

**Source**: `ai-agents/tasks/done/0178-record-the-canonical-merit-statement-form-in-the-convention-page/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P5` · ID 0178 · owner `fkit-architect` · shipped 2026-08-21

## Goal

Follow-up 1 of `0174`'s merit-ordering decision report (§3.1, §8) — the one the next two follow-ups cite. Board rank is **append-only against closed history**, so a new row whose merit position sits above a closed one can never be given that rank; §3.1 ruled IN, by name against six weighed alternatives, that the ordering intent is recorded as a **relative, non-numeric merit statement in the task's own brief**.

**The practice already existed and its form was wrong.** Measured 2026-08-01: `On merit` appeared in 15 briefs in **at least four incompatible shapes**, and one of them reproduced the stale-rank defect *inside* the practice — *"On merit this belongs at 122 — immediately below 0142 (P121)"*, an absolute board rank paired with a folder-ID-plus-rank citation, both already stale.

## Key Changes

A new `## The merit statement` section in `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`, **dual-homed byte-identically** into `claude/scaffold/ai-agents/knowledge-base/conventions/`, plus a regenerated `claude/structure-manifest.tsv`. **+58 / −0 per home; three files, no widened surface.**

**Two shapes, and only two:**

```
- **On merit:** immediately above 0154 — <reason>
- **On merit:** as ranked
```

**Four rules, each chosen against a named failure:**

- **Relative, never absolute.** Name a neighbour, never a position. A relative statement survives every re-rank; an absolute one is stale the moment anything above it moves.
- **Folder ID only — a merit statement contains no `P<n>` token.** Writing `0154 (P129)` pairs an identity with a rank and reintroduces the exact defect the page exists to prevent.
- **Advisory. Board rank still binds execution.** It records what the owner thinks *should* have been next; nothing reads the board differently because of it.
- **`as ranked` is required, not optional.** A brief with no merit line is indistinguishable from one whose author forgot. ⭐ **The explicit no-op is what makes absence detectable — and what makes a guard possible at all.**

**The three carriers, and which of them binds:**

| carrier | carries | binding? |
|---|---|---|
| Board rank `P<n>` | reading order — what to pick up next | yes, for picking work |
| `On merit` statement | the owner's preference the rank cannot express | **no — advisory** |
| `Depends on` / `Blocks` | correctness order — what must land first | **yes, and it outranks reading order** |

⭐ **A merit case that is really a *correctness* constraint belongs in `- **Depends on:**`, where it binds** — not in a merit statement, where it does not.

**It is stated as a rule, not a description.** The page says plainly that *"much of the existing corpus does not yet meet it"* — normative wording alone would have removed the falsehood while leaving the reader with no idea the corpus is non-conforming.

### The conflict it surfaced rather than planned around

The driver's relay named `dependency-declaration-form.md` as the home; **the report names `priority-is-rank-not-identity.md`, and the brief followed the report.** ✅ The owner confirmed (`OQ1`): content stays where the report put it; the other page is only *linked*.

### ⚠️ The guard it specified and deliberately did not build

Item 4 under `## Where this is enforced` records a `brief-missing-merit` drift kind for `dashboard.sh` — **shipped WITH its "Specified, not built yet." flag intact**, by owner ruling `OQ3`, at the **head** of the item so a skimmer sees it. ⛔ **No enforcement is claimed that does not exist.** Its two accepted limits are recorded with it: a bare rank with no `P` is not caught, and **the guard is red on the existing corpus** until a grandfathering decision is taken.

## Outcome

**Shipped 2026-08-21**, agent-closed. Round-1 review returned 🛑 **BLOCKED with 5 findings**; all five were re-verified firsthand and **none was found wrong**. Three fixed, two routed to `0179` as accepted residuals. Green as an isolated commit — **730/730 plus `prove-red.sh`**.

### ⭐ Two decisions worth keeping

- **The manifest was regenerated inside a `git clone` of the repo into a scratch dir**, with only this task's two files applied, then copied back. Running `npm run generate:manifest` literally in a dirty tree is what produced finding R1 — a clone carries only committed content, so the in-flight work of `0171` was **physically absent** from the generator's walk rather than merely avoided. `0171`'s files were hashed before and after and proved **byte-identical**.
- ⭐ **It accepted a RED `npm test` in the live working tree rather than regenerating to green.** Proved by probe that the two reds are `0171`'s, not this task's. **Regenerating here would have restored the R1 defect** — a correct-but-red tree was chosen over a green-but-wrong manifest.

**Residuals:**

- **`AR-1`, routed to `0179`** — the report's §5.1 is **silent** on the guard's scan domain and on whether a fenced example counts. Writing them onto the page would widen it past the ruling authority. **The unfixed half is recorded, not dropped.**
- **A duty `0180` inherits:** when the guard lands it must drop *"Specified, not built yet"* from item 4 in **both** homes and regenerate the manifest again.
- ⚠️ **A re-measure found the reviewer's corpus count understated** — **10** briefs use the legacy `below` form, not 9 — and surfaced a hybrid (*"below … in importance but above it in readiness"*) that **neither shape covers**.
- ⚠️ **`0180`'s cost figure is stale**: the report's *"29 of 29 open briefs red, 0 canonical"* no longer matches the corpus (re-measured: **91 briefs carry `On merit`, 40 already canonical, 38 legacy**). Owner-ruled a producer's separate correction; not touched here.
- **This brief's own merit statement uses the canonical shape, not the legacy sentence `/fkit-task-brief` step 5 still mandates** — flagged so it is not read as drift. `0179` lands the wording in the skill.

## Related
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — `0174`, the decision report this implements
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the authority, and why rank cannot carry the ordering
- [[tasks/implement-task-folder-name-scheme-change]] — `0103`, which filed the convention page this extends
- [[tasks/disambiguate-the-frozen-history-clause]] — `0161`, the same page's earlier ambiguity
- [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — `0107`, the `dependency-declaration-form` the third carrier lives in
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — `P5`
- [[systems/knowledge-base-structure]] — where the conventions are catalogued
- [[tasks/write-the-durable-citation-anchors-convention-page]] — ✅ *Added 2026-08-22:* task `0171`, the sibling convention landing on the same board (`P2`) — ⭐ **the source of the two reds this task probed and deliberately did not regenerate away**. Closed 2026-08-22, agent-closed
