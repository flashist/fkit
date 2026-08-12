# Approved implementation plan — task 0268

**Approved by the owner 2026-08-12 via `AskUserQuestion`**, in a `fkit lead` session driving
`/fkit-sprint-ship-loop` against `ai-agents/sprints/sprint-5.md`. The plan body below is the coder
worker's returned text, copied verbatim.

## Owner rulings taken at the plan gate (2026-08-12)

1. **Plan approved** — verbatim option label: "Approve (Recommended)".
2. **F1 — ACCEPT THE CODER'S AMENDED VERIFICATION STEP 2.** Verbatim option label:
   "Accept coder's amended step 2 (Recommended)". Verify instead that *"the tables differ only in ways
   that pre-date this change, and this change appears identically in both."* ⛔ Do **not** edit the
   brief's step-2 text. ⛔ Do **not** add the missing row to the scaffold. The underlying divergence
   gets its own task.
3. **F2 and F3 — FILE BOTH AS NEW TASKS.** Verbatim option label: "File both as new tasks
   (Recommended)". ⛔ Not filed by the Build worker and **not fixed in this task** — the driver routes
   the filing to a producer separately.

---

### 0. Preconditions, re-verified on disk today (2026-08-12)

| Claim | Status |
|---|---|
| `0264` closed | ✅ `ai-agents/tasks/done/0264-implement-adr-040s-identity-grammar-in-dashboard-sh-both-rungs-and-the-moved-target-companion/` exists |
| `moved_target` takes the suffix | ✅ `claude/skills/fkit-status/dashboard.sh:938` — `sed -nE "s/.*Moved to \[*(${SPRINT_ID_RE}\|Backlog).*/\1/p"`, with `SPRINT_ID_RE="Sprint [0-9]+[a-z]?"` at `:68-69` |
| Rule 2 compares verbatim | ✅ `dashboard.sh:1013` — `[ "$b_sprint" != "$moved_target" ]`, a plain string compare |
| T9 test exists and passes | ✅ `test/dashboard-contract.test.js:958` |
| Baseline suite green | ✅ `npm test` → 709 tests, 709 pass, 0 fail; `prove-red.sh` hard gate PASSED |

⚠️ **The brief's line numbers were stale.** `dashboard.sh:692` (cited by the brief and by ADR-040 §6) is now **`:938`**; the drift-rule-2 consumer cited as `:767` is now **`:1013`**. The target file's `:21` / `:22` anchors are still correct.

### 1. Verified anchors — the two homes

- `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` — `**Moved**` row at **`:21`**, `**Moved (to backlog)**` at **`:22`**, blank `:23`, `**No other value is valid.**` at `:24`.
- `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md` — `**Moved**` row at **`:21`** (byte-identical to the live row), blank `:22`, `**No other value is valid.**` at `:23`.

### 2. The edit — identical text, both homes

Insert immediately **after the table**, before the existing `**No other value is valid.**` paragraph. Live: new block at `:24-26`. Scaffold: new block at `:23-25`. The `**Moved**` and `**Moved (to backlog)**` rows are **not touched**.

```
⚠️ **`N` in the `Moved to [Sprint N]` marker is the target sprint's *identity*, not a number** — `4`,
or `4c`. Write it exactly as that sprint's own plan names itself: `Sprint 4` and `Sprint 4c` are
different sprints.
```

Why this shape:
- **Beneath the table, not in a cell.** `priority-is-rank-not-identity.md:35-37` (**both homes, byte-enforced — not a parity exception**) instructs maintainers to leave the `➡️ Moved to [Sprint N](…) — priority M` marker byte-identical. A parenthetical inside the Marker or Meaning cell would contradict a live convention; beneath the table costs nothing.
- **Scoped by marker text**, not by row label — `Moved (to backlog)` also begins "Moved", so `` `Moved to [Sprint N]` `` is the unambiguous anchor and leaves `:22` visibly out of scope.
- **No grammar restated** — no character class, no "digits plus an optional letter". It names the *source of truth* (the plan's own name) and the *consequence* (two distinct sprints), which is what ADR-041 §5 permits.
- **No filename pattern** — consistent with `0266`/`0267`'s landed "no pattern on the filename".
- Register matches: the file already leads paragraphs with `⚠️ **bold**`; wraps at ~100 cols as the file does.

### 3. Manifest regen — **owed, and doubly enforced**

Yes. `claude/structure-manifest.tsv` currently carries **4** hashes for this project path (`:75-78`); `1814dfba…` is the current scaffold blob's hash. The generator walks *history ∪ current on-disk `claude/scaffold/`*, so the scaffold edit adds a **5th row** (sorted by path then hash).

Run `npm run generate:manifest`. Skipping it reds **two** suites, not one:
- `test/structure-manifest.test.js` A — "the committed manifest is byte-exactly what the generator produces today";
- `test/structure-notice.test.js` test 1 — "conforming fixture: complete silence"; it installs from `claude/scaffold/` and would see the new blob as drift.

The **live** copy is irrelevant to the manifest (it tracks scaffold-sourced project paths) and already hashes to `a0ecac97…`, which is in none of the four rows — i.e. this repo's own live copy already classifies as owner-edited. **The live edit changes no classification.**

### 4. Sequencing

1. Edit the live copy (`:24-26`).
2. Edit the scaffold twin (`:23-25`) — **deliberately; nothing enforces it** (see §6).
3. `npm run generate:manifest`.
4. Verify (§5).

### 5. Verification, per ADR-014 (black-box process contract, `node --test`, zero devDeps)

1. **Demonstrate the suffix actually parses** — build a throwaway fixture in the scratchpad: a plan with row `| ➡️ Moved to [Sprint 4c](../sprint-4c.md) — priority 3 | 1 | Alpha | [\`a.md\`](../tasks/backlog/a.md) |` and a brief reading `## Sprint: Sprint 4c`; run `bash claude/skills/fkit-status/dashboard.sh <plan>` and paste the FACTS block showing **zero** `drift disagreement`. Plus `node --test test/dashboard-contract.test.js` with the T9 result pasted.
2. **Twin parity by hand** — `diff` the two copies and paste it, since the automated check is off (§6).
   ⚠️ **AMENDED BY OWNER RULING 2 (see above):** verify that *the tables differ only in ways that
   pre-date this change, and that this change appears identically in both.* The brief's original
   wording is unmeetable and is **not** to be edited.
3. `node --test test/structure-manifest.test.js` green.
4. `npm test` green in full — target 709/709, plus the `prove-red.sh` hard gate.
5. `git diff --stat` shows exactly three paths: the two convention copies and `claude/structure-manifest.tsv`.

### 6. ⚠️ Confirmed on disk: the twin edit really is unenforced

`test/dual-home-parity-exceptions.mjs:129-139` excepts this path as `audience-adapted`; `test/dual-home-parity.test.js:171` skips any path `findException` resolves. The `reason` is only **length**-checked (floor 30 chars, `:274`) — never checked for *accounting for what actually differs*. So editing one home and not the other is silent. Ran `node --test test/dual-home-parity.test.js test/structure-manifest.test.js` → 14/14 pass with the homes as they are today.

### 7. ⛔ The parity exception's `reason` — **not edited, and it does not need to be**

The reason enumerates ADR citations, the opening frame, the added hardening paragraph, and the "Where this is enforced" list. It never claimed the vocabulary table is identical, and the gloss lands **identically in both homes**, so nothing it says becomes false. **No edit, no stop.**

---

## ⚠️ Three findings — surfaced, not acted on

**F1 — the brief's verification step 2 is unmeetable as written, and this predates the change.** The two vocabulary tables **already** differ: the live copy has a `**Moved (to backlog)**` row at `:22`; **the scaffold copy has no such row at all** (its table ends at `:21`). The exception's `reason` says nothing about this. Step 2 asks that the table "differ only where the parity exception's stated reason accounts for it" — that is **already false today**. I cannot fix it inside this task's constraints (adding the row = adding a status value to the scaffold, ⛔; editing the reason, ⛔). Proposed amended step 2: *"the tables differ only in ways that pre-date this change, and this change appears identically in both."* Worth its own task. **→ OWNER RULING 2 ACCEPTS THIS AMENDMENT.**

**F2 — `claude/skills/fkit-task-brief/SKILL.md:351` is a likely glob-as-mechanism survivor.** It instructs writing `➡️ Moved to [Sprint N](sprint-N.md) — priority M` — an href **template built from the filename**. ADR-041 §6's seven-site list names `:308-312` and `:334-337`, **not `:351`**, so `0267` would not have swept it. Under "no pattern on the filename" the plan may be `plan-sprint-4c.md` and that href is then wrong. My gloss does not create this; it makes it easier to notice. Confidence: **plausible, not confirmed** — I did not trace every mover call site. Out of scope here; worth a task. **→ OWNER RULING 3: file as a new task. Not fixed here.**

**F3 — the same `N` gap exists in `status-report-format.md`** (live `:46`, scaffold `:48`), which enumerates `➡️ Moved to [Sprint N](…) — priority M` among the valid status values with `N` equally undefined. Also a declared `audience-adapted` parity exception. Out of scope; a one-line follow-up. **→ OWNER RULING 3: file as a new task. Not folded into 0268.**

---

## The two questions the driver asked

**Does the gloss need to name the `moved_target` companion?** **No — recommend against.** `moved_target` is a shell local in `dashboard.sh`; naming it in a human-facing vocabulary doc leaks implementation, adds a line anchor that rots (it already moved `:692`→`:938` in two days), and edges toward prose readable as a spec, which ADR-041 §5 warns off. The doc's designated enforcement-pointer sections are the two "Where this is enforced" lists — and those **diverge by design between homes** (live names `claude/skills/*/SKILL.md` source paths, scaffold names `/fkit-*` skills, per the exception's reason), so adding `dashboard.sh` there is beyond a gloss and would need two different edits. Leave both lists untouched.

**Is there a `Moved` marker form the gloss would make inconsistent?** **Not as planned — but there is one if the gloss moves into the row.** `priority-is-rank-not-identity.md:35-37`, present and byte-identical in **both** homes and **byte-enforced** (not on the exception list), says of that exact marker: *"Leave it byte-identical."* Keeping the gloss beneath the table sidesteps this completely. Putting a parenthetical in the Marker cell would put the two conventions in direct conflict.

---

**evidence — what I read on disk**

- `ai-agents/tasks/backlog/0268-…/brief.md` (full)
- `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` (full, 90 lines) and `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md` (full, 81 lines)
- `test/dual-home-parity-exceptions.mjs` (full) — entry at `:129-139`, `findException` at `:355`
- `test/dual-home-parity.test.js` (`:118`, `:137-142`, `:171`, `:270-278`)
- `claude/skills/fkit-status/dashboard.sh` — `:58-80` (`SPRINT_NUM_RE`/`SPRINT_ID_RE`), `:915-945` (`moved_target`), `:1008-1018` (drift rule 2), `:218` (usage)
- `ai-agents/knowledge-base/decisions/adr-040-…md` — `:1-40`, `:183-220`, `:325-340`
- `ai-agents/knowledge-base/decisions/adr-041-…md` — `:156-175`, `:187-222`
- `ai-agents/knowledge-base/decisions/adr-014-how-fkit-tests-itself.md` — `:1-50`
- `bin/generate-structure-manifest.mjs` `:1-60`; `claude/structure-manifest.tsv` `:70-80`
- `test/structure-manifest.test.js`, `test/structure-notice.test.js` `:92-135`, `test/dashboard-contract.test.js` `:950-975`
- `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` and its scaffold twin, `:28-42` both
- `ai-agents/knowledge-base/conventions/status-report-format.md:46` and scaffold `:48`; `claude/skills/fkit-task-brief/SKILL.md:345-355`
- Commands run: `shasum -a 256` on both copies; `node --test test/dual-home-parity.test.js test/structure-manifest.test.js` (14/14); `npm test` (709/709 + hard gate)
