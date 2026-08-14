# Plan — 0292: scope README:54's "fkit-managed structure" sentence

> **APPROVED by the owner 2026-08-14**, live via `AskUserQuestion` in a `fkit lead` session driving
> `/fkit-sprint-ship-loop`. **Verbatim option label: "Approve as planned (Recommended)"** — which is
> §C6 wording verbatim, **no reflow** of the surrounding paragraph.
>
> This file was written by the **driver** at the moment of approval, copying the plan text the
> approval was given over. It was not re-rendered or summarised.
>
> ⚠️ **One transport normalisation, declared:** the plan as returned by the planning worker carried
> `&amp;&amp;` inside the final row of the Test-plan table (an HTML-escaping artifact of the agent
> transport, not something the worker typed). It is written below as `&&`, the shell operator that
> row plainly means. **No other byte was altered.**

---

# PLAN

## The sentence today

**Found at `README.md:54-55`** — the line number did **not** move; `0253`'s paragraph landed at `:35-40` and pushed nothing past `:54`. (Located by text via `grep -n "fkit-managed" README.md` → single hit, line 54.)

```
54: A launch also tells you — one stderr line — when your project's fkit-managed structure diverges from
55: what the installed version ships. To see the per-file verdicts and repair, run `/fkit-heal` in a
56: producer session: repair is **in-session, consent-gated, diffs in view, and applies only the exact
57: list you approve — never silent**, and it never moves, renames, or deletes anything. Divergence
58: that's deliberate? List the path in `ai-agents/.fkit-accepted-drift` and the launch line goes quiet
59: (`/fkit-heal` still reports it in full).
```

The sentence to replace is `:54` through `"…what the installed version ships."` on `:55`. Everything from `"To see the per-file verdicts…"` onward stays.

## Proposed replacement

Lines `54-55` become these **four** lines; lines `56-59` stay **byte-identical** (renumbered to `58-61`):

```
A launch also tells you — one stderr line — when your project's `ai-agents/` tree, or its root
`CLAUDE.md` / `AGENTS.md`, diverges from what the installed version ships. (The fkit agents and
skills under `.claude/` are not part of that check: a launch rewrites them outright, so there is
nothing to diverge.) To see the per-file verdicts and repair, run `/fkit-heal` in a
```

**No reflow of the rest of the paragraph.** The wrap was computed so the fourth line ends on exactly the same tail as today's `:55` (`run \`/fkit-heal\` in a`), which lets `:56-59` carry over untouched. Widths: 98 / 95 / 96 / 83 chars, against a paragraph that currently runs 104 / 96 / 98 / 97 / 99 / 40. The 83-char fourth line is the price of not reflowing — see open question 1.

## Provenance

**Verbatim from ADR-043 §C6.** Confirmed on disk at `ai-agents/knowledge-base/decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee.md:279-282`, under the heading `### C6 — README.md:54 must be scoped — a follow-on docs brief` (`:252`), introduced as **"Recommended replacement wording"** (`:275`).

Three checks the prompt asked for:

- **(a) It exists** — yes, `:279-282`.
- **(b) It prescribes wording** — yes, a complete replacement sentence, not a description of one. It is explicitly flagged **"⛔ not applied here"** because `0255`'s no-implementation fence forbade touching `README.md`; the owner ruled it into *"Its own follow-on brief"* — this task.
- **(c) It is accurate today** — yes. See below. **I found no staleness, no error, and nothing to paper over.**

Only change from the ADR text: the line-wrapping. Not one word altered. Both mandatory halves are present — the root-context-file naming, and the `.claude/` parenthetical **with its reason**.

## Accuracy check

**What the check actually covers on disk, measured today:**

1. **The launch notice delegates to the shipped checker.** `claude/fkit-claude.sh:453-507` (`structure_notice()`) runs `claude/skills/fkit-heal/check.sh` and filters its rows. It invents no inventory of its own.
2. **`check.sh` walks the spec inventory, one row per row.** `check.sh:23` pins the contract *"one line per spec-inventory row, in table order"*; `:155` calls `parse_tables "$spec"`. It reads `claude/structure-spec.md`.
3. **The spec inventory is 48 paths. Exactly two are not under `ai-agents/`:**
   ```
   CLAUDE.md
   AGENTS.md
   ```
   (Extracted from field 2 of every inventory row in both tables — Table A directories and Table B files. Table A has zero non-`ai-agents/` paths.) This confirms `claude/structure-spec.md:89-90` as the brief quotes it, byte-for-byte.
4. **`.claude/` is absent from the whole conformance surface.** Zero occurrences of `.claude` among the inventory paths, **zero** anywhere in `claude/structure-spec.md`, **zero** in `claude/skills/fkit-heal/check.sh`, and **zero** rows in `claude/structure-manifest.tsv`.
5. **The refresh really is unconditional.** `claude/fkit-claude-init.sh:482-488` — `rm -f .claude/agents/fkit-*.md` then `cp`; `rm -rf` each `.claude/skills/fkit-*/` then `cp -R`. Delete-and-recopy, no comparison, no condition.
6. **The refresh runs before the notice.** init is invoked at `fkit-claude.sh:358/360`; `structure_notice` fires at `:507`. So at the moment the notice could print, `.claude/` was just overwritten — which is what makes *"there is nothing to diverge"* true **at the point the sentence is about**, rather than loose. (ADR-043's rejected Option 2, "report at launch, **before** the refresh," is the mirror image of this ordering and confirms it.)

**How the new sentence matches:** it names `ai-agents/` and root `CLAUDE.md` / `AGENTS.md` — which is the inventory, exactly, with no third category omitted — and states `.claude/` is outside the check with the true reason. It does not contradict ADR-043's core finding; it is that finding, stated for a README reader.

**Interaction with `0253`, checked:**
- `:36`'s clause `(In a checkout of this repo it refuses and points you at `git pull`.)` is about **`fkit update`'s** behavior in a checkout. Different subject, different paragraph. No duplication, no contradiction.
- `:42-43` reads *"A launch refresh replaces the agents and skills under `.claude/` — it never rewrites your project's own content under `ai-agents/`."* This **reinforces** the new sentence rather than colliding with it: `.claude/` is rewritten but not reported; `ai-agents/` is reported but not rewritten. The two halves now interlock.
- `:39`'s *"old agents and skills, and nothing tells you"* is the statement the parenthetical reconciles with. Untouched.

**Where my measurement differs from the brief: nowhere.** Every quotation in the brief — `README.md:54-55`, `claude/structure-spec.md:89-90`, `claude/fkit-claude-init.sh:568-569`, ADR-043 §C6, the four unrelated `CLAUDE.md` mentions at `:26`, `:88`, `:90`, `:104` — matches disk exactly. `grep -c "fkit-managed" README.md` = 1; `A launch also tells you` occurs once.

## Files touched

- `/Users/mark.dolbyrev/Workspace/fkit/README.md` — **only**, and only lines 54-55.

Nothing under `claude/`, nothing under `ai-agents/knowledge-base/decisions/`, nothing under `ai-agents/wiki-vault/`. No commit, no stage, no task-file move.

## Test plan

**None that tests the sentence — it is prose.** Verified, not assumed: no test reads the root README's prose. `grep -rn 'A launch also tells\|fkit-managed structure' test/` returns nothing, and every `README.md` hit in `test/` resolves to `ai-agents/README.md` or `ai-agents/tasks/README.md` (spec-inventory rows). The one bare `path: 'README.md'` in `test/dual-home-parity-exceptions.mjs:118` is `ai-agents`-relative — checked in context at `:114-125`.

What will be run, and what each proves:

| Command | Proves | Does **not** prove |
|---|---|---|
| `npm test` | the edit broke nothing | **nothing about the sentence's correctness** |
| `grep -c "fkit-managed structure" README.md` → `0` | the undefined phrase is gone | that what replaced it is right |
| `grep -n -A3 "A launch also tells you" README.md` | `ai-agents/`, `CLAUDE.md`, `AGENTS.md` all present in the sentence | that a reader parses them as *in scope* — the full sentence gets pasted so a human can judge |
| `grep -A4 "A launch also tells you" README.md \| grep -n "\.claude/"` | the parenthetical and its reason are present | — |
| `git diff -U0 -- README.md` | no `-`/`+` line carries `FKIT_SETUP_ONLY` or `old agents and skills, and nothing tells you` | — |
| `git status --porcelain` | only `README.md` changed | — |
| `git log --oneline -1 && git diff --cached --stat` | nothing committed, nothing staged | — |

⚠️ Note for whoever runs step 4: `-A4` is required, not `-A3`. The reason clause (*"so there is nothing to diverge"*) lands on the fourth line of the new block; `-A3` would truncate it.

**The honest bottom line: correctness here is established by the disk measurements above, not by any test.** The close must say so.

## Findings — reported, not fixed (out of scope by the brief)

1. **The `fkit-managed` vocabulary collision survives outside the README.** `claude/fkit-claude-init.sh:567-569` still writes gitignore comments `fkit-managed local state`, `fkit-managed agents`, `fkit-managed skills`, and `claude/fkit-claude.sh:393` still comments *"when the project's fkit-managed structure diverges"* — the same over-broad phrase, in the code the sentence describes. Both files are on ADR-043 §C1's **explicitly unaffected** list and the brief forbids touching them. Recording it so a future reader knows the README fix does not retire the phrase repo-wide.
2. **No `wiki-vault/` check performed.** I did not sweep the vault for the same over-broad claim — outside this row, and it lands on `0293`.
3. **No other README defect found**, because I ran no audit. Absence of findings here is not a clean bill of health for the file.

## Open questions for the owner

**1. The 83-character last line.** To keep `0253`-era lines `:56-59` byte-identical, the new block's fourth line ends early (83 chars vs the paragraph's usual 95-100). Purely cosmetic in rendered Markdown — the raggedness is only visible in source.

- **(Rec) Accept it — no reflow.** Diff stays 2 lines out, 4 lines in; the surrounding prose is provably untouched, which is exactly what the brief asks for and what verification step 5 checks.
- **Reflow lines `:56-59` for even ragging.** Cleaner source, but the diff then shows `±` on four lines of `0253`'s prose. The *text* would be identical, but a reviewer must diff word-by-word to confirm that — and verification step 5 gets noisier.

> **OWNER ANSWER: "Accept it — no reflow."** (Approved via option label *"Approve as planned (Recommended)"*, 2026-08-14.)

**2. Wording: verbatim §C6, or improve it?** The brief permits improvement so long as neither mandatory half is dropped.

- **(Rec) Ship §C6 verbatim.** It is accurate against disk (checked above), the provenance chain stays clean ADR → README with zero drift, and there is no defect to improve away.
- **Reword for brevity.** No candidate is proposed, and any edit re-opens the accuracy question that measurement just closed.

> **OWNER ANSWER: "Ship §C6 verbatim."** (Same approval, 2026-08-14.)
