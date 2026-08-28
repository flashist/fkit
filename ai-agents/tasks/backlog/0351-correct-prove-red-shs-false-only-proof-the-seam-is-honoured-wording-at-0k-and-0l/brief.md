# Correct `test/prove-red.sh`'s false *"the only proof the seam is honoured"* wording at steps `0k` and `0l` — those steps are green either way

## ID
0351

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

**Owner ruling 2026-08-28**, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` over task `0154`'s stateful review, and relayed to a spawned producer at
`0154`'s close — **the option label is the verbatim text: "File a follow-up (Recommended)"**.

⚠️ **Filed UNRANKED by a SPAWNED producer with no owner channel** (`AskUserQuestion` is absent in a
consult —
[ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
This row **appends** to the Backlog board and renumbers nothing
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### The defect — comments that claim the opposite of what the code proves

`test/prove-red.sh`'s clean-copy steps `0k` and `0l` each claim to be *the only proof* that their
environment-variable seam is honoured. **Both claims are false, for the same reason:** a clean-copy
step is **green whether or not the seam is honoured**. If the env var were ignored, the step would
run against the **real** file — which is also green — so the step cannot distinguish *honoured* from
*ignored* in either direction. **What proves the seam is honoured is the mutations going RED**, which
they only can if the suite actually read the mutated copy.

This is not a nitpick about wording in an arbitrary file. `test/prove-red.sh`'s entire thesis is that
**an unexercised gate hides drift**; a comment inside it that misattributes what a gate proves is that
thesis failing in its own house.

**`0154`'s R5 already fixed exactly this, at step `0m` only.** The corrected text is the model for this
task — measured 2026-08-28 at `test/prove-red.sh:385-390`:

> *"⚠️ THAT IS ALL IT PROVES. It is NOT proof that FKIT_WIKI_FLAG_ROOT is honoured: if the env var
> were ignored, `0m` would read the real `claude/` tree, which is green too, so `0m` cannot tell
> 'honoured' from 'ignored' either way. What proves the seam is honoured is mutations 27 and 28 going
> RED — they only can if the suite actually read the mutated copy."*

### Measured firsthand 2026-08-28 — a DIRTY working tree, dated, re-measure before acting

⛔ **`test/prove-red.sh` was uncommitted at filing** (`git status --porcelain` → ` M test/prove-red.sh`),
carrying two other tasks' rows (see *Notes*). **Line numbers below will move. The anchor is the
text, never the number.**

| Site | Measured | Reads (fragment) | Provenance |
|---|---|---|---|
| `0k`, comment block `:363-368` | 2026-08-28 | *"This one carries the usual extra weight for a NEW seam: it is **the only proof that FKIT_RELEASE_MJS is honoured at all**."* | house text from task `0288` |
| `0l`, comment block `:374-378` | 2026-08-28 | *"Extra weight, as for every new seam: **this is the only proof that FKIT_CARRY_CHECK_HOOK is honoured AND that the copied .sh runs the copied .mjs**"* | house text from task `0204` |
| mutation 23's comment `:1089` | 2026-08-28 | *"the copy's .sh execs it (**seam proven by `0l`**)"* | derived from `0l`'s claim — see *What to build* step 3 |

What actually proves each seam, measured from the file itself:

- **`0k`'s seam (`FKIT_RELEASE_MJS`)** — mutations **18–22, 25 and 26** going red.
- **`0l`'s seam (`FKIT_CARRY_CHECK_HOOK`, and that the copied `.sh` execs the copied `.mjs`)** —
  mutations **23 and 24** going red.

The *justification* sentences already in both blocks (*"if the env var were ignored, every mutation
below would run against the REAL release.mjs, all seven would come back green…"*) are **true**, and
they are describing the mutations — they were simply attached to the wrong claim. Reuse them; do not
delete them wholesale.

## What to build

**Comments only. No assertion, no step, no mutation, no shell logic changes.**

1. **Correct `0k`'s claim.** Keep the clean-copy step's genuine purpose (*a red below could be
   red-because-the-copy-is-broken*), strike the *"only proof … honoured"* claim, and name what really
   proves the seam: mutations 18–22, 25 and 26 going red. Follow `0m`'s shape at `:385-390`.
2. **Correct `0l`'s claim** the same way, naming mutations 23 and 24, and covering **both** halves of
   its claim — the env var being honoured *and* the copied `.sh` exec'ing the copied `.mjs`.
3. **⚠️ Surface the third site at the plan gate — it was NOT in the owner's ruling.** Mutation 23's
   comment (`:1089`) says *"seam proven by `0l`"*, which is the same false attribution, one hop
   downstream. Fixing `0k` and `0l` while leaving it standing leaves the falsehood in the file.
   ⛔ **Do not decide this alone and do not silently widen the ruling** — put it to the owner at the
   plan gate, with the recommendation to fix it in the same pass because it is the *same* claim, not
   a new one. Record the ruling and its verbatim label.
4. **Re-verify the mutation numbering before writing any of it.** The mutation-to-seam mapping above is
   a 2026-08-28 measurement of a dirty tree. ⛔ **If the numbers have moved, use what you measure, not
   what this brief says** — a correction note that names the wrong mutations is worse than the wording
   it replaces.

## Verification steps

1. `grep -n 'only proof' test/prove-red.sh` returns **no hit at `0k` or `0l`**, and no hit anywhere
   that attributes a seam proof to a clean-copy step. (Step `0i` is expected to still match — see
   *Notes*; say so explicitly rather than silently leaving it.)
2. Both corrected blocks name the mutations that actually prove their seam, and those mutation numbers
   match the mutations present in the file at implementation time.
3. **Prove the change is comment-only.** ⚠️ **A plain `git diff` against `HEAD` will NOT prove this** —
   `test/prove-red.sh` carries uncommitted rows from tasks `0300` and `0154` (see *Notes*). **Snapshot
   the file before editing**, then `diff <snapshot> test/prove-red.sh` and show that **every** changed
   line begins with `#`. Record the command output.
4. `bash test/prove-red.sh` → `✓ hard gate PASSED`, with every mutation red at its named assertion and
   the `0a`–`0m` clean-copy steps green. ⚠️ **The count was 28/28 on 2026-08-28 — re-measure; do not
   assert the number from this brief.**
5. `npm test` → exit 0. ⚠️ **792/792 on 2026-08-28 — a dated figure. Re-measure.**
6. No file other than `test/prove-red.sh` is modified by this task. Nothing committed, nothing pushed,
   nothing written under `ai-agents/wiki-vault/`.

## Notes

- ⚠️ **`test/prove-red.sh`'s working-tree diff entangles TWO tasks, and the split cannot be
  reconstructed from the diff alone.** `0300`'s rows (mutations 25/26, the `run_release_suite` comment
  rewrite, the `0k` five→seven edits) sit in the same file as `0154`'s (`run_wiki_flag_suite()`, step
  `0m`, mutations 27/28, the header count and its two index lines). **If those land in a commit before
  this task runs, this note is spent; if they have not, do not assume the pre-edit state of `0k` is
  `HEAD`'s.**
- **`0i` is deliberately NOT in scope.** `test/prove-red.sh:348-351` (task `0210`) carries a
  similarly-shaped sentence — *"it is the only proof that the copy-root seam works at all"*. **By this
  producer's measurement it is different in kind:** `0i`'s seam is a path-layout property, so a
  broken copy-root would make the clean run itself go **red** — it *can* distinguish, where `0k` and
  `0l` cannot. The owner's ruling named `0k` and `0l`. ⛔ **Do not edit `0i`.** If your own measurement
  contradicts the reasoning above, **report it for a separate filing** rather than widening this task.
- **The file header does not repeat the claim** — checked 2026-08-28: the `⚠️ MUTATIONS 18-22, 25 AND
  26 …` paragraph (`:56-60`) describes the seam correctly and needs nothing.
- **Companion task filed from the same close:** `0350` (the `0125` R3 discharge note). **No dependency
  in either direction** — different files, different roles, independently shippable.
