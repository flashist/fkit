# Sweep the repo-only `claude/` path form out of installed-facing skill and scaffold prose

**Source**: `ai-agents/tasks/done/0390-sweep-the-repo-only-claude-path-form-out-of-installed-facing-skill-and-scaffold-prose/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 9 · `P3` · `0390` · ✅ Done (agent-closed — not owner-verified)

## Goal

**The defect in one line: fkit's skills and convention pages reference the selector script and the
ownership hook by TWO path forms — repo-only `claude/…` and installed-only `.claude/…`. ⛔ A consuming
project has only `.claude/`.** A repo-only path in installed-facing text is **unrunnable, or
unresolvable, there.**

⭐ **This is the only row on Sprint 9 that ships new behaviour to a consuming project** — it fixes a
command an installed agent cannot run.

## Key Changes

**Owner ruling 2026-09-12, verbatim *"Residual + one sweep task (Rec)"*.** ⛔ **The ruling is *file it*,
not *do it*.**

**Two classes, measured 2026-09-13, needing different fixes:**

| Class | What | Count |
|---|---|---|
| **A** | **Runnable command lines** under `claude/skills/` using the repo-only form — all 8 are `bash claude/skills/fkit-status/dashboard.sh …`, in `fkit-sprint-done`, `fkit-sprint-cancelled` and `fkit-sprint-ship-loop` | **8 sites, 3 files** |
| **B** | Repo-only `claude/…` paths inside **SCAFFOLD-SHIPPED prose** — `priority-is-rank-not-identity.md`, `task-status-vocabulary.md`, `sprint-status-vocabulary.md` | **5 sites, 3 files** |

**Total: 13 sites in 6 files.**

⚠️ **Class B is NOT a mechanical find-and-replace** — these are *source coordinates in prose a
consuming reader receives*, not commands, and each install location had to be verified against
`claude/fkit-claude-init.sh`. ⛔ ***"A confidently wrong path is worse than the inconsistent one."***

### ⛔ ONE MEASURED FALSE POSITIVE — and any bare-grep sweep hits it

`claude/skills/fkit-heal/SKILL.md` reads *"(In this repo's own checkout: `bash
claude/skills/fkit-heal/check.sh`…)"* — it **deliberately contrasts** the repo form against the
`.claude/` form given three lines earlier. ⛔ **It is correct as written; changing it is a regression.**
⭐ **The sweep must exclude it by name.**

### ⭐ The correct form was already the majority, and the scripts declare it themselves

**13 sites already used `.claude/`** — including, ⭐ **load-bearing**, the two scripts' own invocation
banners: `dashboard.sh` reads *"⚠️ INVOKE AS: bash .claude/skills/fkit-status/dashboard.sh …"*, and
`throughput.mjs` the same. ⛔ **So the three sprint skills contradicted the documented invocation form
of the very script they call.** ⭐ ***"This is not a style preference with two defensible sides; there
is a declared form and 8 runnable lines that do not use it."***

### ⛔ Why it was a sweep and not a patch

**A partial fix leaves the ship-loop internally inconsistent**, using both forms in the same file.
⛔ ***"It is a sweep or it is nothing."*** Fixing only `0339`'s two new sites would have left
`fkit-sprint-ship-loop/SKILL.md` with `.claude/` on one line and `claude/` four lines later — ⭐ **strictly
worse to read than the uniform-but-wrong file that shipped.**

### ⭐ The severity was REDUCED, and the reasoning is recorded so it is not re-inflated

**Codex rated one instance `high`; the reviewer reduced it to `low`** on traced blast radius — the
pattern is **pre-existing, repo-wide, and already shipping in released versions**. ⛔ **Nothing was
red** — no test pins the path form. ⭐ **Both the original label and the reduction are recorded
deliberately, so a later reader does not re-inflate from the Codex label alone.**

⛔ **What was fenced OUT: ADRs and reports under `knowledge-base/`.** They cite
`claude/skills/…:NNN` as **source-file coordinates into this repo**, which is what
`durable-citation-anchors.md` asks for. ⭐ **Those are correct and are a different thing from an
installed-facing instruction** — ADR-047 alone holds ~20 of them, and sweeping them would be a large,
wrong change.

## Outcome

⭐ **Verified on disk 2026-09-16: `grep -rn "bash claude/skills/" claude/` returns exactly ONE line —
`claude/skills/fkit-heal/SKILL.md`, the measured false positive.** ⛔ **All eight Class A sites are
gone and the one correct repo-form line survived untouched.**

⚠️ **A third class was flagged for triage, deliberately NOT counted and NOT auto-rewritten:** two
scaffold pages name `claude/scaffold/` **itself** in shipped prose, and a consuming project has no
`claude/scaffold/` at all. ⛔ **They may be a distinct class — a shipped page naming a directory the
reader does not have — or legitimate references to fkit-the-framework.** ⭐ ***"Triage them; do not
silently rewrite them."***

⭐ **`0339` contributed 2 of the 13 sites and replicated an existing pattern rather than inventing
one** — the identical sentence had shipped in `task-status-vocabulary.md` since 2026-07-19. ⛔ **11 of
13 were pre-existing and independent of it.**

## Related
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]]
- [[tasks/teach-the-roles-what-current-sprint-means]]
- [[tasks/write-the-durable-citation-anchors-convention-page]]
- [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]]
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]]
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]
- [[systems/install-and-self-update]]
- [[systems/launch-convergence-and-init]]
- *Added 2026-09-16 (sync `b4a1a52`→`a351cb6`):* [[systems/backlog-convergence-and-the-k-measurement]] — ⭐ **one of only three rows in the k-report's 30 with textual proof of its class**: its own words, *"pre-existing, repo-wide, already shipping"*, are what put it in the **latent** finite-pool class. ⭐ **The same sentence did double duty** — it is also the reviewer's stated ground for reducing Codex's `high` severity to `low`
- *Added 2026-09-16 (sync `b4a1a52`→`a351cb6`, closing a one-way link):* [[systems/knowledge-base-structure]] — where this sweep's **must-match vs audience-adapted asymmetry** is measured and recorded
