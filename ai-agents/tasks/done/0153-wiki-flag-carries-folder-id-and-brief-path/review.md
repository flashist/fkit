# Review — 0153-wiki-flag-carries-folder-id-and-brief-path

Task: `ai-agents/tasks/backlog/0153-wiki-flag-carries-folder-id-and-brief-path/brief.md`
File(s) under review: `claude/skills/fkit-wiki-ingest/SKILL.md`, `claude/skills/fkit-wiki-lint/SKILL.md`,
`claude/skills/fkit-wiki-sync/SKILL.md`, plus the task folder's `plan.md` and `worklog.md`
Status: in-review

**Verdict (Round 1): ⚠️ Changes requested — 4 defects (none blocking). Codex coverage: FULL.**

Reviewers run: fkit-reviewer (own pass) **and** Codex `gpt-5.6-sol` via `codex exec --sandbox
read-only` — both completed, neither skipped. Coverage is **not** partial.

**Attribution note.** `git diff` cannot attribute this change (0125 is uncommitted; `HEAD` and the
`.claude/` mirrors both predate the flag block entirely — verified: mirror `cmp`-equal to `HEAD`, 56
lines, no block). Attribution was instead **established by reversal**: reversing exactly the
documented edit on the current `ingest` block — swapping the two flag lines back to their `Task N`
forms and removing the added blank + four rule lines — reproduces the block at **exactly 33 lines /
2296 bytes**, matching the pre-state recorded independently in `brief.md:73` *before* this task
started. The change surface inside the block is therefore proven to be **exactly** the two flag lines
plus the rule paragraph, and nothing else.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | medium | `ai-agents/tasks/backlog/0153-wiki-flag-carries-folder-id-and-brief-path/plan.md:106` | `plan.md` asserts "Full runnable commands are reproduced in `worklog.md` §5 alongside their observed output" — the worklog records **outputs only**, no command for any of CHECK1/2/3, NC1–NC4 or NC5; and `worklog.md:277` points 0154's author at those control implementations as if recorded. |
| R2 | 1 | low | `claude/skills/fkit-wiki-ingest/SKILL.md:75-78` (`lint:84-87`, `sync:119-122`) | The rule paragraph defines `<NNNN>` in four careful lines but leaves `<slug>` — its neighbour in the same emitted path — undefined; "Substitute real values" is the only cover. An undefined placeholder in this exact line is the defect class this task exists to eliminate. |
| R3 | 1 | low | `claude/skills/fkit-wiki-ingest/SKILL.md:72-73` (`lint:81-82`, `sync:116-117`) | The emitted path hardcodes `ai-agents/tasks/backlog/…`, but the "one the caller named" branch (`ingest:58`) carries **no location guard and no status guard**, while `ingest:30` resolves `all tasks` over `{backlog,done}` and `sync:44` keeps `{done,cancelled}` briefs — so a caller-named brief already in `done/`/`cancelled/` yields a path that does not exist. |
| R4 | 1 | low | `ai-agents/tasks/backlog/0153-wiki-flag-carries-folder-id-and-brief-path/worklog.md:233-242` | The SHA-256 checksums are presented as "what replaces the diff-based check", but they were taken before the CHECK6 stash and re-verified after the pop — they prove **stash round-trip integrity**, not that this task's edits are confined to the intended lines. |

### Verified-and-dismissed (recorded so nobody re-chases them)

- **Uniformity invariant — HOLDS.** Independently measured: `ingest`/`lint` **38 lines / 2791 B /
  min-indent 3** and raw-`cmp`-identical to each other; `sync` **38 lines / 2698 B / min-indent 0**.
  Normalising each block by its **own** min-indent makes all three byte-identical
  (`sha256 826a7e94…` × 3). `sync` was **not** re-indented. Codex measured the same numbers
  independently and hashed the flag strings identical across all three. Author's `MININDENT` 3/3/0 and
  `LINES` 38/38/38 confirmed exactly.
- **Negative controls — all real, reproduced independently.** NC1: the near-miss anchor
  `The wiki \*\*closes nothing` yields a **0-line** extraction from both files, and an ungated check
  then reports `UNIFORM` on empty-vs-empty (fail-open reproduced). NC3-equivalent: breaking one list
  item's relative indent by a single space → own-min-indent normalise **FIRED**. NC4-equivalent: whole
  block shifted a uniform +2 → **GREEN** (correctly does not over-fire). NC5-equivalent: `sed 's/^ *//'`
  blanket-strip reports **UNIFORM despite the broken indent** — 0125's R3 fail-open reproduced.
- **The `awk -v` trap — real, and the author's account is exactly right.**
  `awk -v SA='The wiki \*\*closes nothing'` mangles to `The wiki **closes nothing`, which **matches
  line 51 as an awk regex** (`**` collapses to `*` = zero-or-more spaces) while the properly-escaped
  in-program literal matches **0** — silently defeating the anchor gate. Confirmed by direct execution.
- **0125's block intact.** All three files carry, at count 1 each: R2's "say nothing about it at all",
  R5's "spawn the producer to close it yourself", the null line, the `**Close nothing.**` hard-rule
  bullet, the routing line `@fkit-producer Run /fkit-task-done on <brief path>`, and the "carries them
  verbatim" paragraph. Both new flag strings present exactly 1× per file; literal `Task N` = **0**
  across `claude/`.
- **"No downstream consumer" — confirmed.** Repo-wide, the only live carriers of the flag wording are
  the three SKILLs. Other hits are frozen history (0125's `done/` folder, the 2026-07-23 report) and
  0153's own docs. `claude/agents/fkit-coder.md:103` and `claude/skills/fkit-task-ship-loop/SKILL.md:3`
  match only the generic phrase "ready to close", not the flag.
- **The fix does solve the reported problem.** A producer handed the emitted line gets a literal,
  directly-consumable path. The four digits appear **twice** (in `Task <NNNN>` and again opening the
  path), so a rank-derived value fails loudly rather than silently: rank `108` would emit
  `backlog/0108-…`, and folder `0108` lives in `done/` — the path is a checksum on the ID. That
  redundancy is load-bearing, not decorative.
- **Both self-caught plan errors are recorded honestly and neither reached the landed text.** The
  U+2019-vs-U+0027 apostrophe misdescription (`plan.md:7-11`, struck through at `plan.md:141-145`;
  `worklog.md` §4a) touched only explanatory prose — the operative `new_string` used ASCII, confirmed
  by the landed files. The CHECK5 `git status` misprediction is recorded plainly at `worklog.md:217-231`
  with the cause ("I ran `git status --porcelain | head` … and generalized"), not glossed.

### Re-litigates settled decisions (suppressed)

- **"No automated test guards this text."** Suppressed — owner's SUBSUME ruling of 2026-07-27 assigns
  this to task **0154**; 0125's R3 fail-open residual is closed there, not here. The author states the
  brief's verification step 7 is vacuous rather than silently skipping it (`worklog.md` §6).
- **"`priority-is-rank-not-identity.md` is untracked in git."** Suppressed — task 0103 in flight; the
  citation resolves on disk and ships once 0103 commits. Flagged by the author at `worklog.md:302-306`.
- **"`npm test` green proves nothing here."** Suppressed — stated by the author; no test reads any
  `SKILL.md` body, so the suite is a regression guard only, by design.

### Convergence call

**Act, do not close out.** This is Round 1 — nothing here re-litigates a prior finding, and no
suppressed item was raised as novel by either reviewer. All four findings are **documentation-level**;
none touches the landed SKILL text's correctness, and none blocks the close. R1 is the only one worth
fixing before the ledger is archived, and R2/R3 are best folded into **0154**, which will pin this
wording verbatim anyway.

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect (documentation) | Recorded the actual runnable implementations in `worklog.md` **§5.0** (`norm()` extractor + its four load-bearing properties), **§5.1** (CHECK1/2/3 bodies) and **§5.2** (all five negative controls). Corrected `plan.md:106` in place with a dated note stating the claim was aspirational. Rewrote the §6 pointer so 0154's author is sent to §5.0–§5.2 rather than to outcomes. | **Fixed** (owner ruled FIX NOW) |
| R2 | **CORRECT** | Defect (documentation) | **Not fixed here** — owner ruled it folds into 0154, which pins this wording verbatim. Verified firsthand: `<slug>` appears in both flag lines in all three files and is defined nowhere in any of them; the rule paragraph spends four lines on `<NNNN>` and leaves `<slug>` to "Substitute real values". Recorded as an accepted residual below. | **Deferred to 0154** |
| R3 | **CORRECT — and spec-conformant** | Defect (brief-level gap, not a deviation) | **Not fixed here** — owner ruled. Verified firsthand: `ingest:58` ("one the caller named") carries no location or status guard; `ingest:30` resolves `all tasks` over `{backlog,done}`; `sync:44` keeps `{done,cancelled}` briefs — so a caller-named brief already in `done/`/`cancelled/` yields a `backlog/…` path that does not exist. **But `brief.md:95-97` mandates exactly this path form**, so emitting it is compliance, not a miss. Recorded below with that framing explicit. | **Deferred — brief-level** |
| R4 | **CORRECT** | Defect (documentation) | **Not fixed by adding evidence** — owner ruled it largely discharged by the reviewer's reversal. Verified the reviewer's method firsthand rather than taking it on trust: reversing the documented edit reproduces **33 lines / 2296 bytes**, matching `brief.md:73`'s independently-recorded pre-state, with **0** `0153` artifacts left. Added a dated correction at `worklog.md` §5 CHECK5 conceding the checksums prove only stash round-trip integrity, and recorded the reversal method (with its command) as the better one. | **Fixed** (claim corrected, method recorded) |

### Coder-initiated correction — the driver's `git diff` premise is wrong

Not a reviewer finding; surfaced while re-checking the two claims the driver asked me to re-check. The
process-review prompt stated: *"The working tree is now CLEAN and committed at `994e3e3` … **`git diff`
is now a usable attribution tool again**."* **It is not.** Verified by execution: `994e3e3` ("Tasks
update") added **0125's block and 0153's change in a single commit** (`ingest +42`, `lint +42`,
`sync +48/-1`), and its parent `b86e5eb` contains **no block at all** (block-anchor count 0 → 1 across
the pair). Committing did not restore attribution — it **removed the last chance** to separate the two
tasks by diff. The reviewer's reversal method is unaffected (it works off current content, not history)
and remains the only working attribution. Recorded at `worklog.md` §5 CHECK5.

*(One of my own readings on the way to this was also wrong and is worth flagging: an early loop wrote
`$r:claude/…`, which zsh mangled, making every `git show` return empty and briefly suggesting `994e3e3`
had no block. Caught by re-running without the loop. Third self-inflicted false reading this task — see
`worklog.md` §4.)*

## Accepted residuals (shared, do-not-re-litigate)

- **No mechanical guard on the flag text** — What: the block is prose enforced by nothing; deleting it
  in all three files turns nothing red. · Why (structural): building a test here would widen scope past
  the approved plan; the owner's SUBSUME ruling of 2026-07-27 assigns it to task 0154. · Re-raise only
  if: 0154 is cancelled or descoped without a replacement guard.
- **Uniformity across the three blocks is a human obligation** — What: the three blocks must stay
  identical modulo one uniform indent offset; nothing mechanical holds that today. · Why (structural):
  same as above — 0154's job. · Re-raise only if: a fourth wiki SKILL gains the block, or 0154 ships
  without covering cross-file uniformity.
- **R2 — `<slug>` is an undefined placeholder in the emitted path** — What: both flag lines emit
  `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`; the rule paragraph defines `<NNNN>` in four lines
  and never defines `<slug>`, which is covered only by "Substitute real values". Verified: `<slug>`
  occurs in all three files and is defined in none. · Why deferred (owner ruling, 2026-07-27): **0154
  pins this wording verbatim**, so defining `<slug>` now would mean 0154 re-pinning text that just
  changed; folding it in there costs one edit instead of two. The severity is genuinely low — unlike
  `N`, `<slug>` has exactly one plausible referent and no colliding second number-space, and the
  `<NNNN>` prefix alone already resolves the task unambiguously. · Re-raise only if: 0154 lands without
  defining it, or a consumer is observed mis-substituting `<slug>`.
- **R3 — the emitted path hardcodes `backlog/` with no location guard** — What: `ingest:58`'s
  "one the caller named" branch has neither a location nor a status guard, while `ingest:30` resolves
  `all tasks` over `{backlog,done}` and `sync:44` keeps `{done,cancelled}` briefs — so a caller-named
  brief already in `done/` or `cancelled/` yields a `backlog/…` path that does not exist. Verified at
  all three sites. · Why deferred (owner ruling, 2026-07-27): **this is spec-conformant, not a
  deviation.** `brief.md:95-97` mandates the path form `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`
  in those exact words; emitting it is compliance. **Read this as a brief-level gap, not as something
  the implementation missed.** · Re-raise only if: a flag is observed emitting a non-existent path in
  practice, or a future brief revisits the path form — at which point the fix belongs with whoever owns
  the guard, not with this task.
- **R4 — attribution now rests on reversal, not on checksums, and not on `git diff`** — What: the
  SHA-256 checksums in `worklog.md` §5 prove stash round-trip integrity only. The working method is the
  reviewer's reversal (reproduces 33 lines / 2296 bytes against `brief.md:73`'s pre-state). · Why
  structural: `git diff` **cannot** attribute this change and never will — `994e3e3` fused 0125's block
  and 0153's change into one commit, so no diff separates them. · Re-raise only if: someone proposes a
  diff-based attribution for this task, or the reversal is found not to reproduce the pre-state.
