# Implementation plan — 0280: rewrite the false "no CI" paragraph and fabricated citation in `fkit-wiki-lint`

## Planning-only contract honored
`EnterPlanMode` is absent (spawned consult), so I held the prose contract: **nothing written to disk.** No file edited, no task file moved, no commit, no vault write.

---

## A. Every brief fact re-measured against the live tree (not inherited)

All three defects **confirmed present**. Two brief facts have **drifted** — details below.

| Claim | Command | Result |
|---|---|---|
| **D1/D2** — "no CI", "no `.github/`" are false | `ls .github/workflows` | `test.yml`. `.github/` contains `workflows`. **Both claims false.** |
| **D3** — citation fabricated | `grep -n "There is no CI and no test suite" ai-agents/knowledge-base/architecture.md` | **exit 1, zero hits.** String exists nowhere in the file. |
| **D3** — what `:390` actually says | `sed -n '385,395p'` | The launcher's `fkit update` notice — throttling, `--max-time 5`, `git ls-remote`. **Nothing about CI or tests.** Misattribution confirmed. |
| Single-home | `find claude/scaffold -name "*wiki-lint*"` | **empty** — no scaffold twin. |
| Manifest | `grep -c "wiki-lint" claude/structure-manifest.tsv` | **0** rows. No `npm run generate:manifest` owed. |
| Convergence rm+cp | `claude/fkit-claude-init.sh:484-488` | Confirmed: `for d in .claude/skills/fkit-*/ … rm -rf` then `cp -R`. Consumers **do** receive the fix on re-launch. |
| Create-if-absent for `ai-agents/` | `fkit-claude-init.sh:31-34` | Confirmed: *"Convergence NEVER writes to a path that already exists."* Distinction in the brief holds. |
| Target file clean | `git status --porcelain <path>` | **Clean** — unaffected by the dirty tree. Diff scoping is trivial. |

### Two drifts found — the brief's own anchors moved
1. **`architecture.md` line anchors are stale.** Brief cites `:31`, `:480`, `:597`; actual today are `:31`, **`:496`**, **`:615`**. The file grew to 622 lines. This is direct evidence for the brief's own instruction to prefer durable quoted-text citations over `:NNN`.
2. **A new stale claim the brief does not know about** — see §D.

---

## B. Files touched

**Exactly one:** `/Users/mark.dolbyrev/Workspace/fkit/claude/skills/fkit-wiki-lint/SKILL.md`

Nothing else. No `architecture.md` edit, no ADR edit, no vault write, no manifest regen, no test change.

---

## C. The exact edit proposed

**Replace lines 183–188** (the whole parenthetical closing check 5). Surrounding text at `:171-181` and `:190` is untouched.

**Remove:**
```
   *(`test/adr-number-uniqueness.test.js` also asserts this invariant, so `npm test` catches it too.
   ⚠️ **But nothing runs that automatically — this project has no CI** (`architecture.md:390`: "There
   is no CI and no test suite"; there is no `.github/`). `npm test` runs when a human runs it. So this
   lint step is not redundant belt-and-braces over an automated gate; on a repo where nobody has run
   the suite, it may be the only thing that looks. Do not skip it on the assumption the test covered
   it.)*
```

**Insert:**
```
   *(`test/adr-number-uniqueness.test.js` also asserts this invariant, so `npm test` catches it too —
   but only where something actually runs `npm test`, and only once the collision has been committed
   and pushed. Where an automated gate exists (fkit's own repo runs the suite in GitHub Actions on
   every push to `main` and every pull request), this lint step is genuine belt-and-braces. Where one
   does not — the typical consuming project, with no `.github/` and nobody running the suite by hand
   — nothing runs it at all, and this step may be the only thing that looks.
   ⛔ **Do not skip it in either case.** The check is cheap; the lint cannot know which kind of repo
   it is running in; and even a green gate only ever sees what was already pushed, while a collision
   sitting uncommitted in the working tree is exactly what this pass exists to catch.)*
```

### Why this wording, decision by decision

- **Fabricated quote and its `architecture.md:390` cite: deleted outright.** Not repaired, not re-pointed. `architecture.md` is not edited to make the quote true.
- **No replacement citation.** The brief explicitly permits this (*"No citation at all is an acceptable outcome"*), and §A drift plus §D staleness make any `architecture.md` anchor a live liability. The sentence asserts nothing that needs sourcing.
- **"fkit's own repo", never "this project"/"this one".** The file ships to consumers, where a deictic reads as *the consuming* repo — which would rebuild D1 in a new form. This is the single highest-risk word choice in the edit.
- **Release gate deliberately not mentioned.** Per the brief's constraint, the reasoning does not rest on it.
- **Three points all carried:** gate-repos → belt-and-braces; no-gate repos → only thing that looks; instruction unchanged.

### The non-weakening argument (brief's verification step 4 — the flagged failure mode)
The old text justified "do not skip" with a premise that is now false on this repo. Simply asserting the fix is non-weakening would be the exact failure the brief warns of, so the argument is structural: the new text gives **three independent reasons** to not skip, and **none depends on CI being absent**.

1. *The check is cheap* — holds unconditionally.
2. *The lint cannot know which kind of repo it is in* — holds unconditionally; this is the load-bearing one, and it is the reason a CI-having reader still cannot self-exempt.
3. *A green gate only sees what was pushed; an uncommitted collision is what this pass is for* — this reason applies **specifically and only on a CI-having repo**, i.e. exactly the reader most tempted to skip.

Reason 3 is the deliberate improvement over the original, which had no answer for a CI repo at all. A reader on a gated repo reaches "genuine belt-and-braces" — an argument the step has *value*, not permission to drop it — and then hits an unconditional ⛔.

---

## D. New finding — out of scope, reported not fixed

**`architecture.md:33-35` is now stale**, and the brief does not know this. It says:

> ⚠️ **The CI half has never actually run**: the workflow is verified by review, not by a run.

`gh run list --limit 5` returns **five completed/success runs**, most recent **2026-08-15 (today)**, 2m59s–4m22s. The CI half has run, repeatedly, green.

This does **not** change my edit (I cite no line of `architecture.md`), and the brief forbids touching that file. **Reported for filing, not fixed.** It also strengthens the no-citation choice.

**Other out-of-scope no-CI claims, re-measured today** (brief says report, do not sweep):
- `adr-014:18` — *"zero automated verification — no CI, no test suite, no `.github/`"*. Still present. As the brief cautioned, this sits in a **Context** section describing state at decision time; may be correct as history. **Not assumed either way.**
- `adr-026:48` — *"no `.github/workflows/` in the tree at all"*. Present tense, **now false**.
- `adr-026:131` — *"No `.github/workflows/` exists today"*. Present tense, **now false**.
- ADR-003 → task `0281`, untouched here. Vault copies → `0282` (closed). Vault `log.md` hits are historical finding records, not content needing repair — **no vault write implied, nothing to route to fkit-wiki.**

---

## E. Verification plan — mapped 1:1 to the brief's 8 steps

| Brief step | Command / action |
|---|---|
| **1** Re-measure D1/D2/D3 | `ls .github/workflows`; `grep -n "There is no CI and no test suite" ai-agents/knowledge-base/architecture.md` (expect **zero hits**); `sed -n '385,395p' ai-agents/knowledge-base/architecture.md` to put `:390`'s real content on the record. |
| **2** Landed paragraph carries all three points | Quote the landed text **in full** via `sed -n '183,190p' claude/skills/fkit-wiki-lint/SKILL.md`; map each of the three points to its sentence. |
| **3** Fabricated quote gone | `grep -n "architecture.md:390\|There is no CI and no test suite" claude/skills/fkit-wiki-lint/SKILL.md` → **zero hits**. State that **no** replacement citation was added, and why (§C). |
| **4** Instruction did not weaken | Reproduce the three-reason structural argument in §C — argued, not asserted. |
| **5** Nothing else in check 5 changed | `git diff -- claude/skills/fkit-wiki-lint/SKILL.md` → **exactly one hunk**. |
| **6** Single-home + manifest | `find claude/scaffold -name "*wiki-lint*"` → empty; `grep -c "wiki-lint" claude/structure-manifest.tsv` → `0`. Conclude: no `npm run generate:manifest`. |
| **7** Full `npm test` green | `npm test`, ~6 min (CI measures 2m59s–4m22s; local runs 328–380s). Report **measured pass/fail counts**. ⚠️ Will state explicitly: **this proves nothing about the prose** — no test reads a SKILL.md reasoning paragraph. The suite is a no-regression check only. |
| **8** One path in the stat | `git diff --stat -- claude/skills/fkit-wiki-lint/SKILL.md` → exactly one path. ⚠️ **Must be path-scoped** — the tree is dirty with unrelated in-flight work, so a bare `git diff --stat` would list dozens of files and cannot satisfy this step. |

**Sequencing:** re-measure (step 1) → single edit → steps 3, 5, 6, 8 (seconds) → `npm test` (step 7, ~6 min) → write up steps 2 and 4.

**Risks:** (a) line numbers may drift again before implementation — the edit anchors on the **quoted text**, not `:183-188`; (b) the dirty tree — every diff command is path-scoped; (c) `.claude/skills/fkit-wiki-lint/SKILL.md` (gitignored dogfood copy) keeps the old text until the next `fkit` launch re-runs convergence — expected, not a defect, and **not** something to hand-edit.

## Open questions returned with the plan

1. **File the newly-found stale claim at `architecture.md:33-35`?** *"The CI half has never actually run"* is falsified by 5 green runs (latest today). Out of scope here and `architecture.md` is edit-forbidden by this brief, so it needs its own row — a filing/scope call that belongs to the owner or producer. Sibling to `0281`.
2. **Do the two ADR-026 present-tense claims (`:48`, `:131`) get filed?** The brief records them as *"deliberately NOT filed — the owner did not rule that filed"*. Re-measured today and still false. Flagging once in case the owner now wants them; no action taken.
3. **Concrete example vs. fully generic.** I recommend naming fkit's own CI as the example (as drafted) — it makes the two-repo contrast concrete. The alternative is dropping the parenthetical entirely for maximum durability if fkit's CI config ever changes. Low stakes, reversible, and I proceed with the drafted version absent a ruling.

---

## Owner approval record (driver-appended, 2026-08-15)

Approved by the owner via `AskUserQuestion` in the live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-15. Verbatim option labels:

- Plan: **"Approve (Recommended)"**.
- Open question 3 (concrete example vs fully generic): **"Name fkit's CI (Recommended)"** — the drafted wording naming fkit's own GitHub Actions run STANDS.
- Open question 1 (file the `architecture.md:33-35` stale claim): **"File architecture.md:33-35 (Recommended)"** — the owner ruled it FILED as its own task; a producer files it separately. ⛔ It is NOT in `0280`'s scope and `architecture.md` stays edit-forbidden under this brief.
- Open question 2 (ADR-026's two present-tense claims): **NOT selected** — they stay reported-only, unfiled. Do not sweep them.

Transport note: the plan text above was returned by the plan worker through a task-notification channel that HTML-escapes `<`, `>` and `&`; the driver restored those characters (`&lt;` → `<`, `&gt;` → `>`) when copying. No other transformation was applied.
