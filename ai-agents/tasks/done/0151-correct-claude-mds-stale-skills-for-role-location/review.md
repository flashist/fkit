# Review — 0151

Task: `ai-agents/tasks/backlog/0151-correct-claude-mds-stale-skills-for-role-location/brief.md`
File(s) under review: `CLAUDE.md` (+3/-1, line 43), `ai-agents/tasks/backlog/0151-…/worklog.md` (new)
Baseline: `db863be`
Status: in-review

**Round 1 verdict: ✅ Ready to merge** — the shipped sentence is **true in all three of its
assertions**; 0 defects in the source change. 4 low/trivial findings, all in the worklog record or
pre-existing repo state. Reviewers run: **both** (this reviewer + Codex adversarial pass, `codex exec
--sandbox read-only`). **No coverage gap.**

## Ground truth re-derived independently (not credited from the worklog)

| Assertion in the new sentence | Verified | Evidence |
|---|---|---|
| `skills_for_role()` is in `claude/skills-for-role.sh` | ✅ true | `claude/skills-for-role.sh:48` — the only definition outside the `.claude/` copy |
| `claude/fkit-claude.sh` sources it | ✅ true | `claude/fkit-claude.sh:257` — `. "$here/skills-for-role.sh"` |
| the `PreToolUse` skill-ownership hook sources it | ✅ true | `claude/skill-ownership-hook.sh:39` — `. "$here/skills-for-role.sh"`; wired as `PreToolUse`/`matcher:Skill` at `claude/fkit-claude.sh:296` |
| "**both**" is exact (not more, not fewer) | ✅ true | exactly two sourcing sites tree-wide |

**The most serious available finding did not materialize** — the hook *does* source it; the fix
introduced no new false claim.

Also independently confirmed: **`CLAUDE.md:43` was the only live stale site** (own joined-line sweep,
200-char proximity window, anchors the coder did not use — `source of truth` / `ownership is` /
`declared` / `defined`; every other hit is a dated ADR, a wiki ADR mirror, a done/cancelled brief, a
dated report, a correct quotation of the defect, or an already-correct site).
**Regeneration-safe** — `claude/fkit-claude-init.sh:428` copies lines `1..lb-1` verbatim; with
`begin-rules` at `:47`, lines 43–45 are preserved. Proven by simulating the rebuild on a scratchpad
copy (repo untouched); the real init script was **not** run, deliberately — running it would rewrite
the `.claude/` mirror and pollute the very diff under judgement.
**V1 is genuinely non-vacuous** — re-ran V1/V2 plus both negative controls against `db863be` myself:
V1 absent at baseline, V2 fires at baseline. The replacement of the `grep -qF` embedded-newline check
was a real improvement.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | low | `.claude/skills-for-role.sh:48` | A **tracked, byte-identical fifth copy** of `skills_for_role()` exists that the `claude/skills-for-role.sh:12-24` mirror checklist does **not** name and `fkit-claude-init.sh` does **not** generate — so "declared in exactly one place" is loose. **Pre-existing** (the phrase is verbatim at `db863be`) and preserved on the brief's explicit instruction; not introduced here. Same class and same disposition as the `architecture.md` finding → **route to task 0142**. |
| R2 | 1 | low | `worklog.md:43-44` | The sweep is described as covering every tracked file *"excluding the gitignored `.claude/` mirror"*. `.claude/skills-for-role.sh` is **not gitignored** — `.gitignore:14,17` cover only `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/`. The sweep's **conclusion is unaffected** (that file carries no ownership claim at all), but the stated exclusion basis is wrong. |
| R3 | 1 | low | `worklog.md:131-151` | The **newly added** third assertion — *"sourced by both `claude/fkit-claude.sh` and the `PreToolUse` skill-ownership hook"* — is checked by **nothing**. V1's regex stops at the filename; V4 checks the definition and a launcher grep only, never the hook. Additionally V4's `grep -q 'skills-for-role\.sh"$' claude/fkit-claude.sh` does not require the matched line to be a `source` command. The clause **is true** (verified above), so nothing false shipped — the harness simply proves less than the sentence asserts. |
| R4 | 1 | trivial | `worklog.md:125-163` | §6.1 is headed *"V1–V4, exactly as executed"*, but the recorded transcript's final line `ALL V1-V4 PASS` is emitted by **no command in the displayed block** (it ends at `echo "V4 PASS …"`). Transcript is not byte-reproducible from the commands as shown. |

## Re-litigates settled decisions (suppressed)

- **Codex raised R1 as `high`, framed as "every session receives a *newly* false invariant".**
  Suppressed at that severity: the phrase *"declared in exactly one place"* is **verbatim pre-existing**
  at `db863be`, and the four-mirror model is settled — `claude/skills-for-role.sh:12-24` names the
  mirrors deliberately, and **task 0124's review already examined `.claude/skills-for-role.sh`,
  confirmed it byte-identical, and accepted it** (`ai-agents/tasks/done/0124-…/review.md:94-96`).
  Nothing sources the `.claude/` copy. Retained at `low` as R1 only for the one genuinely novel
  residue: it is a **fifth** copy the checklist does not name.
- Not re-raised (already disclosed and accepted): the line ships unguarded; `architecture.md:154-155`'s
  stale `:35`; no `npm test` baseline; the deliberately stale `.claude/` mirror; the V5 allowlist
  amendment.

## Judgements the driver asked for

- **Is the unguarded disclosure loud enough? — Yes.** `worklog.md:113-120` opens §6 *before* any check
  with a blockquoted ⚠️, names both tests, states neither reads line 43, states nothing generates the
  line, and states `npm test` green ≠ enforced. Placement is correct (leading, not a footer). Its
  factual claims verified: exactly two tests reference `CLAUDE.md`; `orphan-cleanup.test.js:183` is a
  comment only; `rules-block-budget.test.js:102-106` reads markers/the generated block.
- **Is the V5 deviation recorded accurately? — Yes**, at `worklog.md:223-230`. Note the worklog
  discloses **three** plan deviations (V1 strengthening, V5 allowlist, negative controls + V5b/V5c),
  not the one the task framing mentions — over-disclosure, which is the right direction.
- **Is the worklog auditable without a `plan.md`? — Yes.** It states the baseline SHA, quotes the
  plan's superseded V1 inline, records the change surface, and reproduces its commands with observed
  output. I re-ran V1/V2/NC/NC2 and re-derived V3's line numbers (`begin-rules 47`, claim `43`)
  independently; all matched. Only R4 (a missing echo) is not reproducible.

## Convergence call

**Act, then close.** One novel low-severity repo-hygiene residue (R1) that belongs to **task 0142**,
not here — fixing it would breach this task's one-file scope. R2–R4 are worklog-record accuracy only
and change no shipped behavior. **No finding challenges the correctness of the shipped change.**
Recommend shipping 0151 as-is and appending R1 to 0142's specimen list.

## Coder response

<!-- CODER-OWNED — the reviewer does not write here. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect — pre-existing repo hygiene, **not** this task's | Verified: `.claude/skills-for-role.sh` is **tracked** (`git ls-files` lists it), **not** gitignored (`git check-ignore` exit 1), and **byte-identical** to canonical (`md5 72cf34741a4dd1b0c99f0345459d3c30` both). Recorded in `worklog.md` §5 as a **second specimen for task 0142**, alongside `architecture.md:154-155`. **Not changed**, per owner ruling 2 and the brief's one-file scope. Added check **V8b** proving nothing *sources* the `.claude/` copy — it is a copy, not a third loader, so "both" stays exact. | Routed to 0142 |
| R2 | CORRECT | Defect — in my worklog's stated basis, not its conclusion | Verified: `.gitignore` covers only `.claude/settings.local.json` (`:5`), `.claude/agents/fkit-*.md` (`:14`) and `.claude/skills/fkit-*/` (`:17`). `.claude/skills-for-role.sh` is **not** matched. My §3 wording *"excluding the gitignored `.claude/` mirror"* was wrong about **why** the file was excluded: my sweep filtered it by an explicit `grep -vE '^\.claude/'`, not because git ignored it. **Conclusion unaffected** — that file carries the function definition, not a prose claim asserting a location. Recorded as an **accepted residual** with the premise corrected in `worklog.md` §3. | Residual recorded |
| R3 | CORRECT | Defect — in the harness, not the shipped sentence | Verified both halves. (i) The clause **is true**: `claude/skill-ownership-hook.sh:39` is a real `. "$here/skills-for-role.sh"`, wired `PreToolUse`/`matcher:"Skill"` at `claude/fkit-claude.sh:296`. (ii) My harness **did** prove less than the sentence asserted — V1 stopped at the filename and V4 never touched the hook. **FIXED**: added **V7** (hook has exactly one real *source statement*), **V7b** (the `matcher:"Skill"` arm actually invokes the hook, arm-isolated), **V8** (exactly two sourcing sites, and they are the two named), **V8b**; and **tightened V4** so it requires a real `source` command, not any line ending in the filename. Ran it — 21 checks, exit 0. | Fixed + re-run |
| R4 | CORRECT | Defect — record accuracy, trivial | Verified: `worklog.md` §6.1's displayed block ends at `echo "V4 PASS …"`, while the transcript's final line `ALL V1-V4 PASS` (worklog `:162`) is emitted by no shown command — it came from a trailing `echo` in the ad-hoc run that I omitted when transcribing. The reviewer is right that it is not byte-reproducible as shown. **Accepted residual per owner ruling 3 — changed nothing.** Superseded in practice: §6 now records the round-2 harness, which is a **file** run as `bash verify-0151.sh`, so its transcript is reproducible by construction. | Residual recorded |

**Round 2 — two defects I found in my own fix, disclosed.** My first version of **V7b** *failed on correct wiring*: it matched a literal `"PreToolUse"`, but the hook JSON is embedded in a double-quoted shell string where every quote is backslash-escaped (`\"PreToolUse\"`). Fixed by de-escaping before matching. My first **V8** then *passed for the wrong reason, then failed for a third*: run interactively it counted 2, but in a script it counted 4 — because in this tool's shell `grep` is a **shell function** from a Claude Code shell snapshot which skips hidden directories, whereas real `grep` also hit `.fkit/tmp/*` (gitignored Codex error logs that merely **quote** the source line). V8 is now scoped to **git-tracked** files and asserts the two sites **by name**, with **NC5b** proving that pipeline is non-vacuous. **Both defects were in the verification, exactly where the driver predicted this round's defect would hide.**

## Accepted residuals (shared, do-not-re-litigate)

Owner-ruled 2026-07-30. Do not re-raise these without new evidence that they **failed in practice**.

- **R2 — the sweep's stated exclusion basis was wrong; its conclusion was not.** *What:* `worklog.md` §3 described `.claude/` as gitignored; `.claude/skills-for-role.sh` is tracked. *Why accepted:* the file carries no ownership **claim**, so the sweep's finding — `CLAUDE.md:43` was the only live stale site — holds, and the reviewer independently reconfirmed it with a wider window and different anchors. The premise is corrected in §3. *Re-raise only if:* a tracked `.claude/` file is found to assert a role→skill ownership **location**, which would change the conclusion rather than the wording.
- **R4 — `worklog.md` §6.1's transcript is not byte-reproducible from its displayed commands.** *What:* the final `ALL V1-V4 PASS` line is emitted by no shown command. *Why accepted:* trivial; every substantive `PASS` line **is** produced by a shown command, the reviewer reproduced V1/V2/NC1/NC2 and re-derived V3's line numbers independently, and this was the one finding it could not reproduce — the gap is the missing echo itself, not a false result. *Re-raise only if:* a substantive check result is found that no shown command can produce.
- **R1 — a tracked, byte-identical fifth copy at `.claude/skills-for-role.sh`.** *What:* the `claude/skills-for-role.sh:12-24` mirror checklist does not name it, so *"declared in exactly one place"* is loose. *Why accepted here:* **pre-existing and verbatim at `db863be`**, preserved on the brief's explicit instruction, and nothing sources it (check V8b). Fixing it would breach the one-file scope. **Routed to task 0142** as a specimen, not dropped. *Re-raise only if:* something is found to **source** the `.claude/` copy, which would make "both" false.
- **Carried forward from round 1, already accepted and not re-raised:** the corrected line ships **unguarded** (no test reads it); `architecture.md:154-155`'s stale `:35` (routed to 0142); **no `npm test` baseline** was taken; the `.claude/` mirror of `CLAUDE.md` is deliberately stale because `fkit-claude-init.sh` was not run; and the V5 allowlist amendment.
- **`npm test` green is my claim alone.** The reviewer deliberately did **not** re-run V6 — the suite invokes init and could write into the tree under judgement. **Not independently confirmed.**
