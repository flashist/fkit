# Review — assign-global-task-ids-and-create-registry

Task: `ai-agents/tasks/done/assign-global-task-ids-and-create-registry.md` (task 75, ID `0017`) —
moved to `done/` by `/fkit-task-done` at closeout; marker `✅ Done (agent-closed — not owner-verified)`
present on both the brief and the sprint-2 row. Post-move re-check: **101 briefs, 101 unique IDs, 0
duplicates**, and the brief's own `## ID 0017` survived the move intact.
File(s) under review: commit `ada3e8b` (`e62b4f5..ada3e8b`) — 100 briefs under
`ai-agents/tasks/{backlog,done,cancelled}/*.md` (each gained `## ID`) and
`claude/skills/fkit-task-brief/SKILL.md` (new step 6 + renumbering 6→7…9→10).
Out of scope (producer-owned, pre-existing): the design report
`ai-agents/knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md` and the
`## Pinned corpus` section of the task brief.
Status: **closed-out** — R1, R2, R4 fixed and reviewer-verified; R3 deferred to its own brief
(`0101`); R5 accepted as a residual by owner ruling. All five findings disposed.

Reviewers run (Round 1): fkit-reviewer (Claude) + Codex adversarial pass — **both completed**.

## Process flags (Round 1) — resolved

- **Commit `ada3e8b`** was raised by the reviewer as a possible breach of the "never commit unless the
  owner explicitly asks" hard rule. **Resolved: owner-authored.** The coder issued no `git commit`
  (its transcript is the evidence) and the commit landed between the coder's turns. *Recorded honestly:
  git authorship alone is not proof of who ran the command — both the owner and an agent commit as the
  same configured git user — so this rests on the coder's transcript, which the reviewer cannot read.
  The disposition is the owner's and has been made.*
- **The out-of-scope design report** swept into `ada3e8b` follows from the same owner action. No
  reviewer action.

## Routed elsewhere — a live defect in an approved document

**Design spec §3.2 carries the same incomplete `10#` rationale that R1 found in the skill** — it too
cites only `0095` and `0009`, both loud-mode cases, and states the failure "fails with *value too great
for base*". **Reviewer-confirmed at the source**
(`ai-agents/knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md`, §3.2).
Owner ruled: **flag to the architect; the coder does not edit the spec.** Recorded here so a future
reader does not re-derive the wrong reason from an approved document. **The reviewer did not send that
flag** — routing is the coder's, and duplicating it risks two consults for one defect.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | high | claude/skills/fkit-task-brief/SKILL.md:157-159 | The `10#` octal warning documents only the *loud* failure mode. At the current corpus max `0100`, omitting `10#` silently yields `0065` — an ID already assigned to `done/record-pretooluse-skill-gate-adr-amendment.md` — with no error. Both examples chosen (`0095`, `0009`) are loud-mode; every max whose digits are all 0–7 is silent-wrong. |
| R2 | 1     | high | claude/skills/fkit-task-brief/SKILL.md:140-146, :176 | Multi-brief allocation is unspecified. Step 6 derives a single `next`; step 7 writes N briefs (decomposition is this skill's whole purpose, cf. step 5 "sub-tasks from one split should be contiguous"). Nothing instructs incrementing or re-deriving per brief, so a 2-brief split can stamp `0101` twice. |
| R3 | 1     | med  | test/ (absent) | ADR-029's sole named mitigation for the accepted cross-branch race — a duplicate-ID assertion in the `node --test` suite — does not exist and is not scoped in any task brief (75, 76, or elsewhere). 100 IDs are now live with no automated uniqueness guard. |
| R4 | 1     | low→med | claude/skills/fkit-task-brief/SKILL.md:194-198 | **Severity raised on the fix.** The skill drops the spec's qualifier. Spec §3.3 says "two sessions on the same working tree, **allocating in sequence**, cannot collide"; the skill asserts the unqualified "two sessions on the *same* tree cannot collide". Two concurrent same-tree sessions can both read `max` before either writes. |
| R5 | 1     | low  | claude/skills/fkit-task-brief/SKILL.md:122, :145 | **Accepted as residual (owner, 2026-07-20).** The `0001`…`9999` range is stated but not enforced; at `max=9999` the derivation emits a malformed 5-digit `10000` rather than stopping. Largely settled by spec §3.1 (overflow accepted as a stated limit) — the gap is that the skill records no stop rule at all. |

## Reviewer re-verification of the fixes (Round 1, post-fix)

Re-run by the reviewer against `claude/skills/fkit-task-brief/SKILL.md` — verified, not taken on report.

- **R1 — CLEARED.** SKILL.md:157-170 now leads with the silent mode. Every row of its worked table
  reproduces exactly on bash: `0100 → 0065` (and `0065` is genuinely assigned), `0064 → 0053`,
  `0095 → value too great for base`. The false reassurance ("you'd see an error") is gone and `0095` is
  correctly demoted to "the lucky case".
- **R2 — CLEARED.** SKILL.md:176-192 adds the fourth bullet. The loop was run **verbatim** against the
  live corpus and yields `0101 0102 0103`. Its cross-references survive the renumbering: "step 3"
  (decompose, :68) and "step 5" (priority, :111) are both correct.
- **R1×R2 compose safely — checked explicitly.** R2's loop strips the padding once via
  `n=$(( 10#$max ))`, so every later `$(( n + 1 ))` is already base-10. The multi-brief fix does **not**
  reintroduce the octal trap R1 fixed: ten iterations from `0100` give `0101…0109` with no silent wrap.
- **R3 — brief exists.** `ai-agents/tasks/backlog/assert-task-ids-are-unique-in-the-test-suite.md`,
  ID `0101`. **The guard itself is still unbuilt** — that is the point of the deferral, not an oversight.
- **First live exercise of the reviewed procedure passed.** The R3 brief is the first post-pin brief.
  It took `0101` = `1 + max`, not the slot its slug would sort into — exactly the post-pin rule. Corpus
  is now 101 briefs, **101 IDs, all unique, no duplicates**.
- **No regression.** `npm test` 390/390 (fail 0) + prove-red hard gate passed. `dashboard.sh` exit 0 on
  all three plans; `sprint-2` and `sprint-1` byte-identical to baseline. `backlog` differs by **exactly**
  the R3 brief's new row and its counts (4→5 backlog, total 5→6) — an expected addition, **no new drift
  records**. Only `claude/skills/fkit-task-brief/SKILL.md` is modified in the working tree. `.claude/`
  copy is in sync with the canonical source.

## Reviewer re-verification, round 2 (R4 fix) — and a severity correction

- **R4 — CLEARED, and it was worse than I graded it.** I filed R4 as low severity, a spec-fidelity gap:
  the skill had dropped the words "allocating in sequence". The coder's fix showed the omission was
  **hiding a live hazard**, not just diverging from the spec — "two sessions on the same tree cannot
  collide" reads as *same-tree is safe*, when the property doing the work is **sequential** allocation.
  Two same-tree sessions that both derive `max` before either writes collide exactly like the
  cross-branch case. **My severity was wrong; the coder's reading was right.** Recorded as low→med so a
  later reader does not learn the wrong lesson from my original grade. SKILL.md:194-198 now states the
  qualifier, marks it load-bearing, and names the failure.
- **No regression.** `npm test` 390/390 (fail 0) + prove-red hard gate passed. `dashboard.sh` exit 0,
  `sprint-2` **byte-identical to the original pre-change baseline**. 10 step headings intact, `### 10.
  Report` last. **101 briefs, 101 IDs, 0 duplicates.** `.claude/` copy in sync.

## Convergence call — closeout

Round 1 only; no second round of findings was needed and none was manufactured. Five findings, all
disposed: **R1, R2, R4 fixed and verified by re-running the documented commands, not by reading the
diff**; R3 deferred to brief `0101` with the gap acknowledged on the record; R5 accepted as a residual
by owner ruling. No finding re-litigated a settled decision, and two Codex findings were correctly
suppressed against ADR-029 / spec §3.1 with their non-settled halves preserved as R4 and R5.

**The irreversible part of this task — the assignment itself — was correct on first submission** and
was independently re-derived twice (reviewer and Codex), 100/100 exact. Every defect found was in the
*procedure for allocating future IDs*, not in the 100 IDs that landed. That distinction is why the
verdict cleared.

**Reviewer recommends closeout.** The recommendation is not an authorization; closing task 75 is the
owner's call, already given, and the `(agent-closed — not owner-verified)` marker applies.

## Coder response

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
|    |         |                   |        |        |

## Accepted residuals (shared, do-not-re-litigate)

- **Four-digit ID ceiling is not enforced in the skill (R5)** — What: the allocation procedure states the
  `0001`…`9999` range but adds no stop rule; at `max=9999` it would emit a malformed five-digit `10000`.
  · Why (structural): spec §3.1 — four digits is ~100× the current corpus (101 briefs); five digits is
  noise, and a guard for a boundary ~9,900 tasks away is machinery that will be read far more often than
  it will ever fire. The ceiling stands as a **stated, accepted limit**, not an oversight. Owner ruling,
  2026-07-20, on finding R5. · Re-raise only if: the corpus passes ~9000 tasks, or the ID scheme is
  widened past four digits.

- **Cross-branch ID race — detect, don't prevent** — What: two branches can each allocate the same ID and merge cleanly; the answer is a duplicate-ID assertion plus renumbering before anything links to the ID, not a lock file or reservation protocol. · Why (structural): ADR-029 Decision 3 + Consequences — a lock is real machinery for a single-owner prototype and a stale lock is the worse failure; content-derived IDs were rejected because the owner's ruling requires sequential. · Re-raise only if: the project gains multiple concurrent committers, or a collision actually occurs in practice. *(R3 is not a re-raise — it reports that the agreed mitigation is unbuilt.)*
- **Four-digit ID overflow at 10000** — What: the scheme caps at `9999`; beyond it lexical sort stops equalling numeric sort. · Why (structural): spec §3.1 — four digits is ~100× the current corpus; five digits is noise. Accepted as a stated limit. · Re-raise only if: the corpus passes ~9000 tasks.
- **No registry file** — What: authority rests on exactly two carriers, the folder name and the brief's `## ID`, reconciled by an `id-mismatch` drift check. · Why (structural): owner ruling 2026-07-19 on spec §3.6 — a generated committed index is a third carrier that can drift, a lesson this project has paid for at least three times. · Re-raise only if: something in the design starts needing to *read* a registry.

## Re-litigates settled decisions (suppressed)

- *"No reservation/lock protocol is specified for concurrent allocation"* (Codex, part of its second HIGH) — suppressed against **ADR-029 Decision 3** and the *Cross-branch ID race* residual above. Detection-not-prevention is the recorded choice. The **documentation-accuracy** half of that finding survives as **R4** and is not suppressed.
- *"The 9999 boundary is not enforced"* (Codex MEDIUM) — partly suppressed against **spec §3.1** / the *Four-digit ID overflow* residual. Recorded as **R5** at low severity only because the skill omits a stop rule entirely.

## Verified-and-disproven (no action; recorded so they are not re-chased)

- **The assignment itself is correct.** Re-derived independently from pinned SHA `e62b4f5` with the brief's verbatim command; `diff` against what landed is **empty** — 100/100 exact. Codex reproduced this separately. IDs are contiguous `0001`–`0100`, no gaps, no duplicates.
- **Live corpus == pinned corpus** — `diff` of the two slug sets is empty; no post-pin brief needing `1 + max`.
- **Field placement/format** — all 100 briefs: `## ID` at line 3, value at line 4 matching `^[0-9]{4}$` with no trailing whitespace, blank line 5, `## Sprint` at line 6. Matches spec §3.5 exactly.
- **The interim allocation grep works** — the skill's `grep -rhA1 … | grep -oE '^[0-9]{4}'` returns `0100` against the corpus as it stands; `grep`'s `--` group separators are discarded by the anchored numeric extraction, and no brief contains a decoy `## ID` example.
- **Three-board scan rule** — documented correctly (SKILL.md:160-162), and the command's brace expansion covers all three boards.
- **Step renumbering left no stale cross-reference** — the skill's two internal refs both now read "step 8" (SKILL.md:48, :118) and are correct; a repo-wide sweep found no other live reference to this skill's step numbers.
- **Constraints honoured** — all 102 changed paths are `M`; no registry file, no adds, no deletions, no renames.
- **No regression** — `dashboard.sh` output is byte-identical to the `e62b4f5` baseline for all four sprint plans (backlog, sprint-2, done/sprint-1), exit 0, zero drift records. `npm test` 390/390 pass; `prove-red.sh` hard gate passed.
