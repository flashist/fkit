# Approved implementation plan — task 0266

**Approved by the owner 2026-08-12 via `AskUserQuestion`**, in a `fkit lead` session driving
`/fkit-sprint-ship-loop` against `ai-agents/sprints/sprint-5.md`. The plan body below is the coder
worker's returned text, copied verbatim.

## Owner rulings taken at the plan gate (2026-08-12)

1. **Plan approved** — verbatim option label: "Approve (Recommended)".
2. **Edit 3 — APPLY IT.** Verbatim option label: "Yes, apply it (Recommended)". The one-sentence
   repair at `:189-190` is in scope for this task.
3. **Edit 1's ordering treatment — RATIFIED as outcome-only.** Verbatim option label:
   "Ratify — outcome only (Recommended)". Do **not** state the comparison rule or the suffix bound in
   prose.
4. **Optional grep-guard test — NO.** Verbatim option label: "No — surfaced, not built
   (Recommended)". Surfaced only; not built in this task.

---

## Plan — task 0266: retire the `sprint-*.md` glob in `fkit-status/SKILL.md`

**Scope: one file.** `/Users/mark.dolbyrev/Workspace/fkit/claude/skills/fkit-status/SKILL.md`. No `dashboard.sh` edit, no other §6 site, no rename, no commit, no wiki write.

**Grounding fact that shapes the whole plan:** 0265 did not just ship an identity primitive — it shipped `select-active <sprints-dir>`, which executes **all of ADR-041 §1** (candidate set, eligibility, ordering, tie-break, the ambiguity drift record, the empty-set case) in shell. So the correct prose is *"run this and read its answer"*, not *"here is the rule, execute it by hand"*. That is the only reading that satisfies ADR-041 §5's binding constraint, and it is why no grammar detail appears below.

---

### Edit 1 — the selection rule (currently lines 26-28)

**Replace:**
```
- **Empty** — the **active sprint**: the `sprint-*.md` at the top of `ai-agents/sprints/` (the ones in
  `ai-agents/sprints/done/` are closed). If there is more than one, take the highest N **and flag the
  ambiguity** in the report.
```

**With:**
```
- **Empty** — the **active sprint**, and **you do not work it out yourself**. Run:

  ```sh
  bash .claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
  ```

  It considers every `.md` **directly** in `ai-agents/sprints/` — **no pattern on the filename** —
  and resolves each one's identity for you. `ai-agents/sprints/done/` is closed and is not
  considered. **Do not re-derive any of that here.** This file is prose executed by a model and
  `dashboard.sh` is the one implementation; two implementations of one question is the defect
  [ADR-041 §5](../../../ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
  forbids. Read its answer:

  - `active file="…" identity="…"` — **that file is the active sprint.** It has already ordered the
    eligible candidates and taken the highest. Use that path in step 4.
  - `candidate file="…" identity="…"` — every file it looked at and what it resolved to, `unresolved`
    included. A **`Backlog` identity is never eligible; `unresolved` is never eligible.**
  - `drift ambiguous-active-sprint identity="…" chosen="…" also="…"` — two plans claim the **same**
    identity. The script has already chosen; **your job is to report it** — name the one chosen and
    every other file that claimed it. Do not pass over it silently.
  - `active none` — **there is no eligible sprint plan. Say so, list every `candidate` line with its
    identity or `unresolved`, and stop.** Never fall back to the `Backlog` board. Do not guess.

  If the call fails, or the version marker is not `⟦fkit-dashboard v1⟧`, say so rather than guessing
  at the shape. **`bash <path>`, never `./dashboard.sh`** — same reason as step 4 below.
```

**Deliberate interpretation the owner should ratify:** the brief's item 1 lists ADR-041 §1's six sub-rules and asks that the rewritten `:26` carry them. The text above carries §1.1 (candidate set, no stem pattern), §1.3 (eligibility, both exclusions by name), §1.5 (the ambiguity report duty) and §1.6 (stop, never fall back) as **reader-facing duties**, and delegates §1.2 (resolution) and §1.4 (ordering) to the script by naming only its outcome — *"it has already ordered … and taken the highest"*. I deliberately do **not** spell out integer-vs-text comparison or the suffix ordering, because the suffix bound is exactly one of the five things the brief's ⛔ forbids restating, and §1.4 is already pinned by tests S1–S8 in `test/dashboard-contract.test.js`. **If the owner wants the ordering stated in prose anyway, say so and I will add an outcome-level sentence with no bound in it** — but the safer reading of the ⛔ is the text above.

### Edit 2 — the explanatory block (currently lines 47-50)

**Replace** (the sentence only; the first half of the block is untouched):
```
> (task 44) forbids. **The default run never includes it:** an empty argument resolves the active
> sprint by globbing `sprint-*.md`, and `backlog.md` is deliberately outside that glob — so
> unscheduled work is reported **only when asked for by name**, by construction rather than by a rule
> anyone has to remember.
```

**With:**
```
> (task 44) forbids. **The default run never includes it:** an empty argument selects the active
> sprint by **resolved identity**, and this board's identity is `Backlog` — which is **never
> eligible** — so unscheduled work is reported **only when asked for by name**, by construction
> rather than by a rule anyone has to remember. **The exclusion is stronger than the filename rule it
> replaced** ([ADR-041 §3](../../../ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)):
> it no longer depends on what the file is called, so renaming it could not make it the active sprint.
```

Conclusion kept, mechanism swapped, §3's "stronger not weaker" recorded.

### Edit 3 — **needs an explicit owner yes/no** (currently lines 189-190)

Line 189-190 reads:
> *"You pass it a **path**; it does not resolve sprints. Resolving the argument to a sprint plan stays yours."*

Edit 1 makes this **self-contradictory within one file**: resolving the empty argument now *is* a `dashboard.sh` call. It is **not** a glob reference, so it is not an eighth ADR-041 §6 site — but it is a statement my change falsifies, and the brief says *"nothing else in this file."*

**Proposed minimal repair (one sentence, no new mechanism):**
```
You pass it a **path** — *this* invocation renders a board, it does not resolve one. Resolving an
**empty** argument is the separate `select-active` call in the argument contract above.
```

**Recommendation: yes, apply it.** Shipping a file that says both "resolving stays yours" and "you do not work it out yourself" is worse than a three-word scope stretch. **If the owner says no: I leave it byte-identical and report it as a finding instead.**

### Optional item — **recommend NO**

A grep-guard test (`SKILL.md` must never regain `sprint-*.md`) is cheap and mechanically assertable, but it is outside the brief's *"edits to SKILL.md only"* and would need arguing as a further instance of the tests' fourth scope category. **Surfaced, not planned.** Say the word if you want it.

---

### Verification — the brief's seven, mapped

ADR-014 discipline: `node --test` via `npm test`, **zero devDependencies** (confirmed — `package.json` has none).

1. **Interface exists — already run, output pasted here:**
   `bash claude/skills/fkit-status/dashboard.sh identity ai-agents/sprints/sprint-5.md` → `Sprint 5`, exit 0.
   `… identity ai-agents/sprints/backlog.md` → `Backlog`, exit 0.
2. **The rewritten rule on this repo — already run:**
   ```
   ⟦fkit-dashboard v1⟧
   ⟦SELECT⟧
   active file="sprint-5.md" identity="Sprint 5"
   candidate file="backlog.md" identity="Backlog"
   candidate file="sprint-5.md" identity="Sprint 5"
   ⟦FACTS⟧
   ⟦END⟧
   ```
   Selects `sprint-5.md`; `backlog.md` listed, identity `Backlog`, not eligible. ✅
3. **The reporter's §7 names.** The brief calls for a desk check; I will do better — build the seven **top-level** names from the §7 table (`plan-index.md`, `plan-sprint-4.md`, `plan-sprint-4c.md`, `plan-sprint-5.md`, `plan-sprint-6.md`, `sprint-backlog.md`, `backlog.md`) with their verbatim H1s **in the scratchpad** (never in the repo) and run `select-active` against it. Expected: `active file="plan-sprint-6.md" identity="Sprint 6"`, `sprint-backlog.md` → `Backlog`, `plan-index.md` → `unresolved`. Paste the real output; if it disagrees with ADR-041's stated outcome, that is a finding about 0265, not a licence to edit prose.
4. `grep -n 'sprint-\*\.md' claude/skills/fkit-status/SKILL.md` → **empty**. (Baseline today: hits at `:26` and `:48` — the two sites, and **only** those two. Grepped `sprint-\*` across the whole file: no third glob reference. **ADR-041 §6's claim to completeness holds for this file** — no eighth site to report.)
5. **No second grammar** — paste greps proving the file contains no segment-delimiter list, no `Sprint [0-9]`-shaped pattern, and no `plan-` allowlist.
6. `npm test` green.
7. `git diff --stat` → `claude/skills/fkit-status/SKILL.md` only.

**Two honest caveats.**
- **No test proves this change.** Nothing in `test/` asserts this file's body — `skill-frontmatter.test.js` asserts frontmatter only, and I touch none of it; `dashboard-contract.test.js:2484` says outright that SKILL.md prose is *"LLM-executed, untestable"*, which is precisely why 0265 built `select-active`. `npm test` here is a **regression guard, not evidence the edit is correct**; steps 2-5 are the evidence.
- **`claude/structure-manifest.tsv` needs no regeneration** — it covers `claude/scaffold/` and carries no `fkit-status` entry (grepped). The gitignored `.claude/` copy can be refreshed with `claude/fkit-claude-init.sh .` after the edit; it is not part of the diff.
