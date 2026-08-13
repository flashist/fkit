# Scope `README.md:54`'s *"fkit-managed structure"* sentence to what the check actually covers — `ai-agents/` **plus** the two root context files

## ID
0292

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner ruling 2026-08-13**, given live via `AskUserQuestion` in a `fkit lead` session — **the option
label is the verbatim text**: **"Its own follow-on brief"**. Recorded in
[ADR-043](../../../knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md)
§Owner sign-off (subsidiary-questions table) and discharged in §C6.

⚠️ **This edit is a CONSEQUENCE of ADR-043, not a pre-emption of it.** Before ADR-043 ruled, writing
the corrected sentence would have decided the very question
[`0255`](../../done/0255-decide-whether-claude-enters-the-structure-conformance-surface/brief.md)
existed to decide. That is exactly why
[`0253`](../../done/0253-state-the-per-project-relaunch-step-fkit-update-requires/brief.md)'s
reviewer raised it and the owner held it as an **accepted residual** rather than applying it
(`0253`'s `review.md`, owner ruling 2026-08-13, verbatim: *"Accept both as residuals"*). ⛔ **A close
that frames this as a `0253` defect has framed it wrong.** `0253` shipped correctly; the reconciliation
was deliberately deferred to the decision that has now been taken.

### The problem — measured on disk 2026-08-13

`README.md:54-55` (one sentence, wrapped across two lines) reads:

> *"A launch also tells you — one stderr line — when your project's fkit-managed structure diverges
> from what the installed version ships."*

**"fkit-managed structure" is nowhere defined in the README** — and **the repo's own vocabulary puts
`.claude/` inside that phrase**. `claude/fkit-claude-init.sh:568-569` writes the gitignore comments
literally as `'fkit-managed agents (refreshed by fkit-claude-init.sh)'` and
`'fkit-managed skills (refreshed by fkit-claude-init.sh)'` (verified 2026-08-13).

But the divergence check does **not** cover `.claude/`. So `:54` appears to promise coverage of
exactly the thing the paragraph at **`README.md:35-40`** (shipped by `0253` today) says nothing tells
you about — `:39`, verbatim: *"never re-launched in keeps its **old agents and skills, and nothing
tells you**"*.

### ⛔⛔ THE OBVIOUS FIX IS WRONG — READ THIS BEFORE WRITING A WORD

`0253`'s reviewer proposed **scoping `:54` to `ai-agents/`**. ⛔ **Do not apply that.** It would
**under-describe the check**.

The launch notice covers the **spec inventory**, and **Inventory Table B includes the two root context
files** — `claude/structure-spec.md:89-90`, verified on disk 2026-08-13:

```
| `CLAUDE.md` | root context file | see §"Root context files"; fkit-managed block is self-healing, owner body is the repair target |
| `AGENTS.md` | root context file | see §"Root context files"; fkit-managed block is self-healing, owner body is the repair target |
```

Neither is under `ai-agents/`. **A reader told the line covers `ai-agents/` would wrongly conclude a
diverged root `CLAUDE.md` goes unreported.** ⛔ **A brief that repeats the naive fix ships a different
wrong sentence** — this is the single most important constraint on this task.

### The replacement wording — lift it from ADR-043 §C6, do not re-derive it

ADR-043 §C6 carries the recommended replacement verbatim. Quoted here from disk 2026-08-13:

> A launch also tells you — one stderr line — when your project's `ai-agents/` tree, or its root
> `CLAUDE.md` / `AGENTS.md`, diverges from what the installed version ships. (The fkit agents and
> skills under `.claude/` are not part of that check: a launch rewrites them outright, so there is
> nothing to diverge.)

**The parenthetical is the whole point.** It is what turns `:39` and `:54` from an apparent
contradiction into **one coherent story**: `.claude/` gets no divergence line **because** it gets an
unconditional rewrite — and the thing you must do to get that rewrite is the re-launch `:39` now tells
you about.

⚠️ **That parenthetical is only sayable BECAUSE ADR-043 ruled.** It asserts a decision
(*"not part of that check"*), not merely an observation. Written a day earlier it would have been a
producer or coder deciding `0255`.

⚠️ **Wording is a recommendation, not a ruling.** The owner ruled *that* this gets its own brief and
*that* `.claude/` is not a conformance surface. §C6's sentence is the architect's recommended wording.
Improving the prose is allowed; **dropping either half — the root-context-file naming, or the
`.claude/` parenthetical — is not.**

## What to build

**One sentence, in one file.** Replace `README.md:54-55`'s sentence with §C6's wording (or a faithful
improvement of it that keeps both mandatory halves).

1. **Re-derive first.** Read `README.md:35-40` and `:54-55`, `claude/structure-spec.md:89-90`,
   `claude/fkit-claude-init.sh:568-569`, and ADR-043 §C6. ⛔ Do not work from this brief's quotations.
   ⚠️ **State explicitly, in both directions, where what you measure differs from this brief.**
2. **Write the replacement.** It **MUST**:
   - name **`ai-agents/`** *and* the **root `CLAUDE.md` / `AGENTS.md`** as what the notice covers;
   - carry the parenthetical stating that the fkit agents and skills under `.claude/` are **not** part
     of that check, **with its reason** — a launch rewrites them outright, so there is nothing to
     diverge.
   - ⛔ **Not** say or imply the check covers `.claude/`. ⛔ **Not** scope the line to `ai-agents/`
     alone.
3. **Leave the rest of the paragraph alone.** The `/fkit-heal` sentence, the consent-gating clause,
   and the `.fkit-accepted-drift` sentence at `:55-59` are accurate and stay **byte-identical**
   unless the replaced sentence's line-wrapping forces a reflow — and if it does, say so.

### Constraints

- ⛔ **`README.md` only, and only that sentence.** This is **not** a README review. If you spot
  another README defect, **report it as a finding; do not fix it here.**
- ⛔ **Do not touch `README.md:35-40`.** `0253` shipped it and it is correct. It is the half of the
  story this sentence is being reconciled *with*.
- ⛔ **Do not edit `ai-agents/knowledge-base/decisions/adr-043-*.md`** — quoting §C6 is the job; editing
  it is not.
- ⛔ **Do not edit `claude/structure-spec.md`, `claude/structure-manifest.tsv`,
  `claude/skills/fkit-heal/*`, `claude/fkit-claude-init.sh`, or `claude/fkit-claude.sh`.** ADR-043 §C1
  lists every one of these as **explicitly unaffected**. Touching any of them exceeds the ruling.
- ⛔ **No behavior change of any kind.** This is docs-only. The check's coverage is not being widened,
  narrowed, or altered — only described correctly.
- ⛔ **Do not build the "refresh receipt."** ADR-043 §C7 records it as **permitted, not required**, and
  says plainly *"Nothing is being built, and nothing is filed."* It is not this task.
- ⛔ **No `wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  ⚠️ If a vault page carries the same over-broad claim, **report it** — the ADR-043 ingest row `0293`
  is where that lands.
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  no re-rank ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ **No commit, no push.**

## Verification steps

Each step is a runnable command. **Paste the command and its output; do not assert.**

1. **Facts were re-derived, not inherited.**
   ```
   grep -n "fkit-managed" README.md
   sed -n '35,40p;54,55p' README.md
   sed -n '89,90p' claude/structure-spec.md
   sed -n '568,569p' claude/fkit-claude-init.sh
   ```
   ⚠️ **State explicitly where the measurement differs from this brief.**

2. **The undefined phrase is gone.** It occurs exactly **once** in `README.md` today (step 1 proves
   it), and the replacement drops it:
   ```
   grep -c "fkit-managed structure" README.md    # expect 0
   ```

3. **⭐ THE ROOT CONTEXT FILES ARE NAMED — the check the naive fix would fail.** Anchored on the
   sentence's own durable opening phrase, not on a line number (⚠️ **the numbers move when you edit**):
   ```
   grep -n -A3 "A launch also tells you" README.md
   grep -A3 "A launch also tells you" README.md | grep -c "ai-agents/"    # expect >= 1
   grep -A3 "A launch also tells you" README.md | grep -c "CLAUDE.md"     # expect >= 1
   grep -A3 "A launch also tells you" README.md | grep -c "AGENTS.md"     # expect >= 1
   ```
   ⚠️ If your rewrite changes that opening phrase, say so and re-anchor the greps on whatever you
   wrote — **do not skip the step**.
   ⛔ **A sentence naming only `ai-agents/` FAILS this task.** The new sentence must name the root
   `CLAUDE.md` / `AGENTS.md` inside the notice's scope, in the same sentence — not elsewhere in the
   file, where four unrelated mentions already exist (`:26`, `:88`, `:90`, `:104`, measured
   2026-08-13). **Paste the sentence in full so a reader can judge it** — the counts alone cannot
   distinguish "named as covered" from "named nearby".

4. **The `.claude/` parenthetical is present, with its reason.**
   ```
   grep -A4 "A launch also tells you" README.md | grep -n "\.claude/"
   ```
   Expect a hit stating `.claude/` is **not** part of the check **and why** (a launch rewrites it
   outright). Paste the text.

5. **`0253`'s paragraph is untouched.**
   ```
   git diff -U0 -- README.md | grep '^[-+]' | grep -v '^[-+][-+][-+]'
   ```
   ⚠️ Expect changed lines **only** in the `:54-55` sentence's range. ⛔ **No `-` or `+` line
   containing `FKIT_SETUP_ONLY` or `old agents and skills, and nothing tells you`** — those are
   `0253`'s prose.

6. **Nothing else in the repo changed.**
   ```
   git status --porcelain
   ```
   ⚠️ Expect **only** `README.md` and this brief. ⛔ **Nothing under `claude/`, nothing under
   `ai-agents/knowledge-base/decisions/`, nothing under `ai-agents/wiki-vault/`.**

7. **The suite is still green, and say what that does and does not prove.**
   ```
   npm test
   ```
   ⚠️ **No test reads this README sentence.** Green proves the edit broke nothing; it proves **nothing
   about the sentence's correctness**. The close must say so.

8. **Nothing committed, nothing staged.**
   ```
   git log --oneline -1 && git diff --cached --stat    # expect the staged diff EMPTY
   ```

## Notes

- **Why Backlog / Unscheduled.** Measured 2026-08-13: `ai-agents/sprints/sprint-5.md` carries **17
  status rows and all 17 read `✅ Done` — zero open rows** — so there is no open sprint to file into,
  and Backlog is where an unsprinted brief lands by construction. ⚠️ **Measured caveat: the plan's
  header at `sprint-5.md:3` still reads `🟢 ACTIVE`**, so the board is finished by row status but not
  yet marked closed. That is a plan-state observation, ⛔ **not this row's job to fix**. On merit it
  also belongs there: this is a **one-sentence docs correction with no behavior change**, nothing is
  blocked on it, and no user is broken by it — the sentence over-promises, it does not misdirect
  anyone into a wrong action. ⛔ **Filed by a spawned producer with no owner channel, so it is
  UNRANKED and re-ranks nothing**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  The owner may rank it whenever they next touch the board.
- **Provenance chain.** `0253` (shipped `README.md:35-40`, deferred this as an accepted residual) →
  `0255` (the decision task) → **ADR-043 §C6** (the ruling and the recommended wording) → this row.
- **Relationship to `0293`.** `0293` ingests ADR-043 into the vault. **No file overlap** — this row
  touches `README.md`, `0293` touches `ai-agents/wiki-vault/` only. **No ordering constraint**; they
  are independent and can run in either order or concurrently.
- **What this row does NOT do.** It does not widen, narrow, or alter the structure check
  (ADR-043 §C1: every implementation artifact is *explicitly unaffected*), does not build the C7
  receipt, and does not reopen `0255`. ADR-043 §"Re-raise only if" also names three things that are
  **not** grounds to re-raise, one of which is *"the observation that the launch notice never reports
  `.claude/`"* — this row **describes** that fact, it does not challenge it.
