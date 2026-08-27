# Plan — 0188: Repair the five live ownership-fact defects (D1–D5)

> Approved by the owner via `AskUserQuestion` in a live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-26/27. Written by the driver at approval, before the Build spawn (ADR-020). Rulings on ND1–ND4 are appended at the end.

## 1. Plan

### Re-verification, 2026-08-26 (every coordinate re-measured; the brief's are dated 2026-08-02)

| Defect | Status today | Where (today) | What the site says | What is true |
|---|---|---|---|---|
| D1 | **Discharged** (by `0250`, 2026-08-23) | `claude/scaffold/CLAUDE.md:23` | producer row: `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal` | `skills_for_role(producer)` (`skills-for-role.sh:51`) = initiate-project, task-brief, task-done, task-cancelled, status, heal — same set, different order. Order difference is deliberate (0250 plan §1d; twin `fkit-team/SKILL.md:54` byte-matches the scaffold row order, re-verified today). **No edit. Do not reorder.** |
| D2 | **Live** | `architecture.md:145-146` — *"Only `fkit-query` carries no banner — it is universal by design."*; `fkit-team/SKILL.md:48` — *"banner at the top of every skill"*; `claude/scaffold/CLAUDE.md:50` — *"banner on each skill"* | one banner-less skill / all skills bannered | Opened all 26 `claude/skills/*/SKILL.md`: 24 carry `> ## ⛔ Owner:` (lines 11–15, past the frontmatter); **`fkit-query` and `fkit-team` carry none** (`fkit-team:48` only *describes* the banner — the grep trap the brief warns of). |
| D3 | **Live** | `architecture.md:160-161` — *"`skills_for_role()` at `claude/skills-for-role.sh:35`"* | line 35 | `skills_for_role() {` is at **`claude/skills-for-role.sh:48`**; `:35` is inside the ADR-033 comment block. Unchanged since 2026-08-02. Adjacent, same paragraph: `architecture.md:145` cites the banner example at `fkit-review/SKILL.md:8`; it is at **`:12`** today. |
| D4 | **Live, two copies** | `claude/skills-for-role.sh:12-23` and **`claude/fkit-claude.sh:259-270`** (moved from `:239-250`); `diff` of the two 12-line ranges today → **no output** | *"FOUR hand-maintained places MIRROR this list … If you add a fifth mirror, add it HERE FIRST."* | Six. Fifth: `test/skill-ownership-hook.test.js:289-292` (*"OWNED is a maintained MIRROR of skills_for_role()"*). Sixth: `claude/fkit-claude-init.sh:1011-1013` (printed role roster; *"kept in step by hand … nothing tests that they agree"* — mirrors the role list and the lock invariant, not the per-role skill lists). |
| D5 | **Live** | root `CLAUDE.md:32` — *"every other fkit skill is turned off, invisible and unrunnable"* (outside the fkit rules block, which spans `:47-98` — owner-body prose, not init-refreshed) | invisible | Visible-but-blocked: `fkit-team/SKILL.md:46-48`, `claude/README.md:32`, `architecture.md:225`, `claude/scaffold/CLAUDE.md:49`, ADR-018 §Decision 5 (`adr-018:104-113`). Twin falsehood at root `README.md:76` — *"turned off: invisible and unrunnable"* (not named by the brief). |

### D2 — repair choice: correct the three sentences, do not add banners

Why: (1) the banner's meaning is *"the one role allowed to execute it"* (`architecture.md:144-145`); a banner on a universal skill would be a banner that names no owner — the marker would then mean two things. (2) ADR-036 clause 4 makes `⛔ Owner:` **trigger (d)** of the coming tripwire, an ownership-fact trigger; two "owner: everyone" banners would be two more non-fact hits to register. (3) Backlog `0226` and `architecture.md:157` (`everyone | team, query`) already treat the two as universal-by-design. Adding banners would make the docs true by changing the design; correcting the docs makes them true by describing it. Applied consistently to all three sentences.

**Exact edits**

1. `ai-agents/knowledge-base/architecture.md:145-146`
   - before: `` Only `fkit-query` carries no banner — it is universal by design. ``
   - after: `` Only the two universal skills — `fkit-query` and `fkit-team` — carry no banner; both are universal by design (the `everyone` row below). ``
   - deliberately **no "24 of 26" count** in the sentence: a standalone skill count is itself a decaying ownership fact (`0226` U5).
2. `claude/skills/fkit-team/SKILL.md:48`
   - before: `` The `⛔ Owner:` banner at the top of every skill is now a ``
   - after: `` The `⛔ Owner:` banner at the top of every role-owned skill (this one and `/fkit-query` carry none — they are universal) is now a ``
3. `claude/scaffold/CLAUDE.md:50`
   - before: `` The `⛔ Owner:` banner on each skill is a courtesy ``
   - after: `` The `⛔ Owner:` banner on each role-owned skill is a courtesy ``
   - **mirror consequence:** this line is outside the scaffold's `<!-- fkit:begin-rules -->`/`end-rules` pair (`:68-69`), so the whole file hashes → `npm run generate:manifest`; expected result **exactly one added `CLAUDE.md` row** in `claude/structure-manifest.tsv` (same shape as 0250's regen; the old hash row stays — the manifest is append-only). Without it `test/structure-manifest.test.js` A goes red.

### D3 — exact edit

`ai-agents/knowledge-base/architecture.md:160-161`
- before: `` **Ownership is declared in exactly one place: `skills_for_role()` at `claude/skills-for-role.sh:35`.** ``
- after: `` **Ownership is declared in exactly one place: `skills_for_role()` at `claude/skills-for-role.sh:48` — `skills_for_role() {`.** ``
- Form per `conventions/durable-citation-anchors.md` §"Never cite a line number naked" + table row 1 (source file cited in a design doc: `path:NNN` is correct, paired with the fragment). (ND2.)
- Add-on, same paragraph, same class (ND4): `architecture.md:145` `` `claude/skills/fkit-review/SKILL.md:8` `` → `` `claude/skills/fkit-review/SKILL.md:12` ``.

### D4 — exact edit, BOTH copies, kept byte-identical

Re-run first: `diff <(sed -n 12,23p claude/skills-for-role.sh) <(sed -n 259,270p claude/fkit-claude.sh)` → must be empty (it is today).

Replace the 12-line block in **both** files with this 14-line block (line 12 / 259 and line 23 / 270 change; two bullets added):

```
# ⚠️ CHANGING A ROLE'S SKILLS? SIX hand-maintained places MIRROR this list (or a role fact it carries)
# for humans and MUST be updated in the same commit, or the docs lie about what a role can do:
#   * claude/skills/fkit-team/SKILL.md  — the roster the /fkit-team skill prints
#   * claude/README.md                  — the skill-ownership table
#   * claude/scaffold/CLAUDE.md         — SHIPS INTO EVERY CONSUMING PROJECT's root CLAUDE.md
#   * ai-agents/knowledge-base/architecture.md — the skill count and the role/skill table
#   * test/skill-ownership-hook.test.js — OWNED, the hard-coded mirror the hook test asserts against
#   * claude/fkit-claude-init.sh        — the printed role roster (mirrors the role list and the lock
#                                         invariant, not the per-role skill lists; nothing tests it)
#
# ⚠️ THIS LIST SAID "TWO" UNTIL 2026-07-18, AND THE OMISSION COST EXACTLY WHAT IT LOOKS LIKE IT WOULD.
# Task 70 followed the two-item list precisely and still shipped a false statement into every consuming
# project (scaffold/CLAUDE.md asserted the lead role has "only" two skills, which had just stopped being
# true). A checklist that is itself incomplete is worse than no checklist: it is followed, and it fails.
# If you add another mirror, add it HERE FIRST. (It said "FOUR" until 2026-08-26 — incomplete a second time; 0142 D4.)
```

- `"Task 70"` on the warning line stays **byte-identical** — it is the numeral 0306's dated notes in `0188`/`0226` are keyed to, and `0226` owns the block rewrite.
- `fkit-claude.sh:271-275` (the *"This has already bitten once: task 14…"* tail) is outside the 12-line block and is left alone.
- After the edit: `diff <(sed -n 12,25p claude/skills-for-role.sh) <(sed -n 259,272p claude/fkit-claude.sh)` → empty. Both named mirrors verified to exist on disk (they do today).
- Comment-only: `bash -n` on both scripts; `skills_for_role()` output byte-identical before/after for all 8 arguments (7 roles + one unknown).
- The "fifth → another" wording and the dated parenthetical: ND3.

### D5 — exact edit

Root `CLAUDE.md:32`
- before: `` `/fkit-*` skills** — every other fkit skill is turned off, invisible and unrunnable. That is what makes ``
- after: `` `/fkit-*` skills** — every other fkit skill is denied on invocation: still visible in the `/` menu, but unrunnable (ADR-018 §Decision 5, an accepted cost). That is what makes ``
- Keeps the ADR-010 link on the line above untouched. Wording matches the four live docs and ADR-018 §Decision 5. ADR-018 itself is **not** edited.
- Root `README.md:76` (same falsehood, not named by the brief) and the "advisory" sentences: ND1.

### "Also look at" — judged, not edited

- `PROJECT.md:47-48` *"every other `/fkit-*` skill is turned off"* — **not shown false**; the launcher's own comment uses the same phrase (`fkit-claude.sh:245-246`), and "turned off" does not assert invisibility. Leave; record in worklog.
- `ai-agents/README.md:10`, `ai-agents/tasks/README.md:18-19` (mover rule without the producer-only clause) — **incomplete, not false; out of scope here.** Reasons: `tasks/README.md` is a byte-identical twin of `claude/scaffold/ai-agents/tasks/README.md` (report C19/C20), so completing it means a second scaffold edit + manifest row; and `0341` (backlog, sprint movers) will re-touch mover prose — do not pre-empt it. Record in worklog; suggest the producer fold it into `0341`'s brief.

### Ordering

1. Baseline: `git status` clean on the six target files except the known `fkit-claude.sh:313+` hunk (verify); `node bin/generate-structure-manifest.mjs --stdout | cmp - claude/structure-manifest.tsv` → fresh; `npm run test:unit` green (774 today).
2. Re-measure every coordinate above and the banner enumeration (open each of the 26 files) — record in `worklog.md` (brief verification 8).
3. `architecture.md`: D3 (+ the `:8→:12` add-on, ND4) and D2 sentence, one edit.
4. `fkit-team/SKILL.md:48` — D2.
5. `claude/scaffold/CLAUDE.md:50` — D2; then `npm run generate:manifest`; `git diff --stat claude/structure-manifest.tsv` → one line added.
6. D4 in `skills-for-role.sh`, then the identical block in `fkit-claude.sh`; run the block `diff`; `bash -n` both; `skills_for_role` 8-arg before/after compare.
7. Root `CLAUDE.md:32` — D5, plus the ND1 sites.
8. Verify (below); write `worklog.md`.

### Verification (maps to the brief's steps 1–8)

1. D1: `bash -c 'source claude/skills-for-role.sh; skills_for_role producer'` vs `sed -n 23p claude/scaffold/CLAUDE.md` — same set, order difference recorded as accepted. No edit made.
2. D2: `for f in claude/skills/*/SKILL.md; do grep -n '^> ## ⛔ Owner:' "$f" || echo "NONE: $f"; done` **and** open the two NONE files by eye (grep alone is known wrong here); the three sentences re-read true.
3. D3: `sed -n 48p claude/skills-for-role.sh` = `skills_for_role() {`.
4. D4: block `diff` empty; `ls` each of the six mirrors.
5. D5: `grep -n invisible CLAUDE.md` → no ownership hit; sentence agrees with the four docs and ADR-018 §D5.
6. `git status --short ai-agents/wiki-vault ai-agents/knowledge-base/decisions` → nothing.
7. `npm test` (unit + `prove-red.sh`); `package.json` unchanged (no devDependency, ADR-014). Red-first proof: **not applicable** — prose-only, no behaviour, no new test; the one test that moves (`structure-manifest` A) is exercised by the regen.
8. `worklog.md` carries the re-measured coordinates per defect, the D2 choice and reason, and the judgments on the "also look at" sites.

Not part of the diff: the gitignored `.claude/skills/fkit-team/SKILL.md` copy stays stale until the next `fkit-claude-init.sh .` refresh; init's refresh path is itself under uncommitted change (0327/0334), so it is not run inside this task. `architecture.md` changes → `fkit-wiki` sync later.

## 2. Edge cases / failure modes

- **Manifest regen ordering.** Regen must run after the scaffold edit and before tests; if any *other* uncommitted `claude/scaffold/` edit exists at regen time it gets hashed in too — `git status claude/scaffold` is clean today; re-check at build.
- **D4 byte-identity drift.** Verify with the range `diff`, not by eye. Ranges change to 14 lines (`12-25` / `259-272`).
- **`fkit-claude.sh` is dirty** from another task (`:313+`). D4's hunk is separate; commits are the owner's; a partial commit of that file would need `git add -p`.
- **Grep-blind D2 enumeration** — the enumeration opens files.
- **Introducing a fresh decaying count.** No "24 of 26", no "seventh"; the D3 line number is paired with its fragment.
- **Root `CLAUDE.md` rules block.** Lines 32/39-42 are outside `:47-98`, so the init refresh will not revert them.
- **`0226` will rewrite the D4 block later** and **`0189`/ADR-036 clause 2 will demote both copies** — D4's fix is interim by design; the brief says do it anyway.
- **`0189`'s brief cites the old `:239-250`** with "re-read rather than assume" — fine, no edit to 0189.

## 3. Caveats and rulings honored

- Owner ruling *"do not let the build quietly repair its own corpus"* — this task repairs; `0189` untouched.
- D1 dated correction (0324 ruling 2026-08-23) — D1 skipped; **no reordering**; twin match re-verified today.
- D2 "choose one, not half of each; state it in the worklog" — sentences, all three, reason recorded.
- D3 "re-measure at implementation time" — `:48` today; re-measured again at build.
- D4 "TWO files; re-run the diff before assuming" — both copies, diff before and after.
- D5 "ADR-018 is not edited" — not edited.
- "Also look at — do not manufacture" — PROJECT.md judged not false; READMEs judged out of scope with reasons. Extra sites found were put to the owner (ND1), not assumed.
- "Task 70 = 0008, quotation left byte-identical" (0306) — the numeral in both shell copies stays.
- Verification 6 (no wiki write), 7 (no devDependency), 8 (worklog coordinates).
- 0142's methodological finding — every site opened, not grepped.
- ADR-014 — no new test; red-first not applicable to prose.

Notes for the producer (not decisions): `0226`'s brief says "one file changed" for the D4 block — stale against the two-copy fact; the `ai-agents/README.md`/`tasks/README.md` mover-rule completion is a candidate for `0341`.

## 4. Owner rulings — `AskUserQuestion`, live `fkit lead` session, 2026-08-26/27 (verbatim option labels)
- **Plan gate:** "Approve".
- **ND1 (D5-class sites the brief does not name):** "Fix all five now (Recommended)" — also fix root `README.md:76` ("invisible"), root `CLAUDE.md:39-42`, `README.md:81-83`, `PROJECT.md:51-52` and `:93-96` ("consult boundary is advisory", superseded by ADR-018); leave `fkit-claude-init.sh:1014` with a worklog note. Re-measure each site before editing; same wording discipline as D5 (ADR-018 §Decision 5; no ADR edit).
- **ND2 (D3 anchor form):** "`:48` + fragment (Recommended)".
- **ND3 (D4 closing line):** "'another mirror' + dated note (Recommended)".
- **ND4 (banner example `:8` → `:12`):** "Yes, same edit (Recommended)".
