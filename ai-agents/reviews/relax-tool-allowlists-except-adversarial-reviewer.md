# Review — relax-tool-allowlists-except-adversarial-reviewer

Task: ai-agents/tasks/backlog/relax-tool-allowlists-except-adversarial-reviewer.md
File(s) under review: claude/agents/fkit-{producer,coder,architect,reviewer,wiki,lead}.md (one `tools:` line removed each); claude/agents/fkit-adversarial-reviewer.md (must stay byte-identical)
ADR: ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md
Status: in-review

## Reviewer findings

Round 1 — **no findings.** Both reviewers (own pass + Codex adversarial) converged clean. Nothing to
record as a defect. Detail in the round note below.

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| —  | 1     | —   | —         | No confirmed defects. |

### Round 1 note (reviewer)
Verified against the working tree:
- **Frontmatter well-formed in all six** — read each block in full: `name`/`description` (folded
  `>-`)/`color`/`initialPrompt` (folded `>-`) + closing `---` all intact. **No trace of the reverted
  first-pass collapse bug** (no description line fused into `color:`). The `tools:` line is the sole
  removal in each file.
- **Adversarial reviewer byte-identical** — `git diff` shows no change to
  `claude/agents/fkit-adversarial-reviewer.md`; its `tools: Read, Grep, Glob, Bash, Skill` line is
  intact (`:9`). ADR-022 Decision 2's one deliberate wall preserved.
- **No prose edited** — the AskUserQuestion session/consult note (task 54) is present in **all six**
  bodies (producer:46, coder:34, architect:41, reviewer:58, wiki:24, lead:42); the diff removes only
  the `tools:` line, so all role-boundary contract prose is untouched (ADR-022 Decision 5 honored).
- **Nothing else in the six files changed** — Codex independently proved it: for each,
  `git show HEAD:<file> | sed '/^tools: /d'` is byte-identical to the working file (PASS ×6), and the
  adversarial reviewer is byte-identical to HEAD.
- **Out-of-scope surfaces untouched** — `git diff --stat` touches no `skills-for-role.sh`, no ADR-018
  hook, no `fkit-team`/`README.md` mirror table. Skill lockdown intact.
- **Mechanism = omit the line** (ADR-022 Decision 1 recommended). The knowingly-dropped explicit
  entries (six `AskUserQuestion`, coder `EnterPlanMode`/`ExitPlanMode`, lead scoped `Agent(...)`) are
  ADR-022 accepted consequences retained by inheritance — **not** regressions; suppressed as settled
  (see below), not raised.

**Validation-gated (owner, could not be run headless — coder role lock):** live-session spot-checks —
(a) a `fkit <one-of-six>` session actually runs `WebSearch` (vs `TOOL_ABSENT`); (b) the coder is still
denied `/fkit-review` (skill lockdown holds). Static evidence strongly supports both — line removed ⇒
tool inheritance; skill-hook suite 346/0 per coder ⇒ lockdown unaffected — but the live behavioral
confirmation is the owner's to run. Verdict carries the (validation-gated) tag accordingly.

## Coder response
<!-- CODER-owned. Reviewer does not write here. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| —  | Agree — no defects | — | Nothing to fix. Independently re-confirmed the reviewer's clean bill against the working tree: `git diff --stat` = 6 files / 6 deletions / 0 insertions, only `tools:` lines removed; `fkit-adversarial-reviewer.md` byte-untouched; `node --test` 346/0 (skill hook suite unaffected → lockdown holds); init regen → six copies carry no `tools:` line. No code changed during review, so no re-verify cycle. | Accepted |

**Coder close-out.** Round 1, zero defects from either reviewer (full Codex coverage, codex-cli 0.144.4). The three Accepted residuals below are ADR-022's own accepted consequences — agreed, not disputed. Coder side complete. **Two owner-run validation spot-checks carried to the done-gate** (not review-round items): a session agent runs `WebSearch` (not `TOOL_ABSENT`), and the coder is still denied `/fkit-review`. Static evidence strongly supports both; the live confirmation is the owner's. Ready for the owner's done-gate.

## Accepted residuals (shared, do-not-re-litigate)

- **Role separation for the five now rests on prompts + the skill hook, not tools** — What: the
  producer/coder/architect/reviewer/wiki/lead hold unrestricted tools; separation is prompt- +
  skill-hook-enforced. · Why (structural): ADR-022 Decision 1 / Consequences; the `tools:` wall was
  never a sandbox (Bash escape hatch, ADR-008:85). · Re-raise only if: a concrete out-of-role harm is
  shown for a specific role/tool (ADR-022 re-raise clause) — not the general worry restated.
- **The one deliberate wall is the adversarial reviewer's `tools:` line** — What: only
  `fkit-adversarial-reviewer.md` keeps a `tools:` allowlist. · Why (structural): ADR-022 Decision 2/3 —
  its lack of Write/Edit/Agent makes reviewer independence a structural fact. · Re-raise only if:
  someone proposes giving it Write/Edit/Agent or removing its line (reopen ADR-022).
- **Skill lockdown is deliberately kept** — What: tools relaxed, ADR-018 skill hook untouched. · Why
  (structural): ADR-022 Decision 4. · Re-raise only if: someone proposes opening the skill hook "to
  match" — that is ADR-018's separate decision, not this one.
