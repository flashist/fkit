# Wiki resync of the vault's Codex-sandbox `read-only` pages after `0273` moves the call sites to `workspace-write`

## ID
0287

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

### Authority

**Owner ruling 2026-08-13**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"File a resync task now (Recommended)"**.

**Provenance:** surfaced by the **wiki lint of 2026-08-13**, which flagged the exposure itself in the
vault log (`ai-agents/wiki-vault/log.md:2008`, anchor measured 2026-08-13):

> *"The Codex sandbox flag is described in three vault pages and ADR-042's D2 will falsify all three
> when it ships. … **Verified 2026-08-13: all five sites under `claude/` still read `read-only` and
> task `0273` is open, so the three pages are ACCURATE TODAY** and were annotated rather than
> corrected."*

The lint made the right call: it **annotated rather than corrected**, because the pages are true
today. This row exists to make the correction **once the premise actually changes**.

### ⚠️ THE HANDED-OVER COUNT OF "THREE" IS AN UNDERCOUNT — RE-DERIVED ON DISK 2026-08-13

**The set was re-derived for this filing rather than carried.** `log.md:2008` names three pages.
A `grep -rn "sandbox" ai-agents/wiki-vault` filtered for `read-only` returns **five carrying pages**.
The two the lint's own note omits are **live, present-tense claims**, and one of them is the vault's
most-read file.

⚠️ **Treat the list below as a floor measured on one day with one pattern, not as a scope.** Re-derive
again at execution time — the claim can be phrased without the literal string `--sandbox`
(`index.md:63` is exactly that case, and it is the one the lint's sweep missed).

**The three the lint named:**

1. **`wiki/systems/review-and-model-diversity.md`** — the system page, and the heaviest site.
   - **`:17`** — the quoted command inside a fenced block: `codex exec --sandbox read-only --cd "$PWD" -`
   - **`:26`** — the load-bearing reasoning: *"**The `read-only` sandbox above blocks all filesystem
     writes, and `mkdtemp` is a write.** So the Codex reviewer **cannot run the test suite, build a
     fixture, or execute a mutation — and never could.**"*
   - **`:42`** — ⚠️ **already carries a D2-pending note** (*"**D2 — decided, NOT built.** … ⚠️ Verified
     on disk 2026-08-13: all five sites under `claude/` still read `read-only`"*). **That note is the
     layer that must be amended when `0273` lands** — ⛔ **do not edit through it**; say which layer is
     being updated.

2. **`wiki/decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md`**
   - **`:23`** — *"The adversarial skill runs `codex exec --sandbox read-only --cd "$PWD"`"*.
     ⚠️ **This sentence's real subject is `--cd`, not `--sandbox`** — it explains why the codex CLI
     natively reads the project-root `AGENTS.md`. **The `--sandbox` value is incidental to the point.**
     Correct the value; ⛔ **do not disturb the `--cd`/`AGENTS.md` reasoning around it.**
   - **`:104`** — an existing dated cross-reference note added 2026-08-13. Same layering caution.

3. **`wiki/tasks/give-codex-the-universal-hard-rules.md`** — ⚠️ **the one that needs REWRITING, not a
   value swap.**
   - **`:13`** — *"The adversarial pass shells out: `codex exec --sandbox read-only --cd "$PWD"`."*
     A plain value correction.
   - **`:21`** — ⛔ **the rule-3 wording rests on a premise ADR-042's D2 retires.** It reads:
     > *"**Word rule 3 so it is true for Codex.** It runs `--sandbox read-only` and cannot move a file
     > anyway; the rule's real work there is *"do not tell the coder to move one, and do not report a
     > task as moved."* **Say the rule, not a fiction about what Codex can do.**"*

     **Under `workspace-write` the words *"and cannot move a file anyway"* become false** — that is
     precisely the capability D2 grants. ⚠️ **The paragraph's CONCLUSION survives and must survive**:
     rule 3's real work is still *"do not tell the coder to move one, and do not report a task as
     moved"*, and the *"say the rule, not a fiction"* principle is **strengthened, not weakened**, by
     the sandbox opening up. ⛔ **What must not survive is the structural-impossibility premise.**
     A find-and-replace of `read-only` → `workspace-write` on this line produces a **worse** page than
     leaving it alone: it would assert Codex *"runs `--sandbox workspace-write` and cannot move a file
     anyway"*, which is flatly false. **This site needs prose written, and it is the reason this task
     is not mechanical.**
   - **`:44`** — an existing dated note (*"Added 2026-08-13: this page's reasoning about
     `--sandbox read-only` is **accurate today** …"*). ⚠️ **That "accurate today" is the exact claim
     `0273` falsifies** — amending this note is mandatory, not optional.

**⚠️ The two the lint's note did NOT name — both live, both present-tense:**

4. **`ai-agents/wiki-vault/index.md:63`** — ⛔ **the vault's most-read file, and the sweep missed it
   because the line never contains the string `--sandbox`.** It reads:
   > *"The `read-only` sandbox means **Codex has never been able to run a test, build a fixture, or
   > execute a mutation**; `prove-red.sh` is among the things it cannot run."*

   ⚠️ **Under `workspace-write` this is wrong in TENSE as well as in value.** *"has never been able
   to"* is a **true historical statement** that becomes a **false present-tense one** the moment the
   flag changes. The correction is not `read-only` → `workspace-write`; it is a re-tensing —
   *"could never"* → *"could not, until `0273`"*. **Get the tense right or the page lies in a new
   direction.**

5. **`wiki/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md`** —
   ⛔ **REPORT A VERDICT, AND MOST LIKELY DO NOT EDIT IT.** This is ADR-042's **own** vault page, and
   both hits are the decision record describing itself:
   - **`:19`** (Context) — *"Every site invoking the second opinion hard-codes
     `codex exec --sandbox read-only`."* This was **true when the decision was taken** and is the
     condition the ADR was responding to.
   - **`:71`** (Decision) — *"All executable call sites move from `--sandbox read-only` to
     `--sandbox workspace-write`."* This **describes the change itself** and is correct before and
     after `0273`.

   ⚠️ **An ADR's claims are frozen; a resync that "corrects" `:19` destroys the record of why the
   decision was made.** The defensible treatment is the vault's **dated-correction form** — note that
   `:19`'s condition was **discharged by `0273` on <date>** — ⛔ **not a value swap.** If the librarian
   judges no edit is needed at all, **that is an acceptable verdict** — but it must be **recorded**,
   not silently skipped.

### ⛔ THIS ROW RUNS IN A `fkit wiki` SESSION — NOT IN `/fkit-sprint-ship-loop`

`## Owner` is **`fkit-wiki`** and it must stay that way. **Vault writes are that role's exclusively**
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

⚠️ **The sprint loop cannot run this row**, for the same reason recorded on
[`0258`](../0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md),
[`0269`](../../done/0269-wiki-ingest-of-adr-040-and-adr-041-the-sprint-identity-decisions/brief.md),
[`0282`](../../done/0282-wiki-resync-of-the-no-ci-claims-after-the-0256-ci-landing/brief.md) and
[`0285`](../../done/0285-wiki-resync-of-the-install-and-self-update-page-after-0257/brief.md):
**the loop never reads `## Owner`** —
[ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)
fixes each step's role to the skill that step runs, so its **Build** step spawns `@fkit-coder`
(`claude/skills/fkit-sprint-ship-loop/SKILL.md:121`), and `claude/agents/fkit-coder.md:211` forbids
that role from writing the vault **ever**. Driven by the loop, this row either stalls on a refusal or
breaches ADR-005. **It runs in a `fkit wiki` session instead.**

⚠️ **That is an exclusion from the loop and from nothing else.** `## Status` stays `🔲 Backlog` —
**NOT blocked, NOT deprioritised, NOT descoped.**

### State on disk at filing — measured 2026-08-13, and the reason this row is NOT runnable yet

- **All five `--sandbox` call sites under `claude/` still read `read-only`** — re-verified this filing,
  not carried from the lint's report: `claude/README.md:116`,
  `claude/skills/fkit-adversarial-review/SKILL.md:46`,
  `claude/skills/fkit-stateful-review/SKILL.md:95`, `claude/skills/fkit-review/SKILL.md:61`,
  `claude/agents/fkit-adversarial-reviewer.md:28`.
- **[`0273`](../0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md) is
  open** (`🔲 Backlog`, Backlog board).

**Therefore every one of the five vault sites is ACCURATE TODAY.** ⛔ **Running this row before `0273`
lands would replace true statements with false ones** — the exact failure the lint avoided by
annotating instead of correcting.

## What to build

A vault-only resync that makes `ai-agents/wiki-vault/` describe the Codex review sandbox as it
actually stands **after `0273`**.

1. **Re-derive the carrying set first.** ⛔ Do not trust the five sites above, and do not trust
   "three". Sweep broadly — `--sandbox`, `read-only`, `sandbox`, and the *capability* phrasings that
   carry the claim without the flag (*"cannot run the test suite"*, *"cannot build a fixture"*,
   *"cannot execute a mutation"*, *"never could"*, *"structurally cannot"*, *"reasoning, not
   measurement"*). **`index.md:63` is the proof this is necessary** — it carries the claim and a
   flag-based grep never sees it.
2. **Correct each live present-tense claim** to the post-`0273` reality, minding the two special cases
   above: the **rule-3 rewrite** on `give-codex-the-universal-hard-rules` and the **re-tensing** of
   `index.md:63`.
3. **Amend, do not overwrite, the existing dated notes** at `review-and-model-diversity.md:42`,
   `give-codex-the-universal-hard-rules.md:44` and `adr-016-….md:104`. Each says the read-only
   reasoning is *"accurate today"*. **That is the claim being retired — say which layer is being
   amended.**
4. **Record one verdict per site** — *corrected* / *correct as-is because …* / *append-only, new entry
   written* / *out of scope, reported*. ⛔ **A batch verdict does not satisfy this.**
5. **⚠️ Do not overclaim what `workspace-write` buys.** ADR-042's D2 was taken **against the
   architect's recommendation, knowingly and provisionally** (recorded at
   `review-and-model-diversity.md:42`). ⛔ **No page may assert that the Codex second opinion now
   measures, runs the suite green, or is verified** — the honest claim after `0273` is that the
   sandbox **permits** writes, not that any run has been observed. **A page that reads "Codex now runs
   the tests" is a worse record than the stale one.**
6. **⚠️ ADR-042's D1 three-state coverage vocabulary is a SEPARATE row** —
   [`0272`](../0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/brief.md).
   ⛔ Do not implement it here; if vault pages carry the old ran/unavailable binary, **report it**.

### ⛔ Hard constraints

- **⛔⛔ `log.md` IS APPEND-ONLY** — owner ruling **2026-08-03**, task
  [`0211`](../../done/0211-annotate-the-three-old-form-completion-flags-in-the-vault-log/brief.md).
  It records what was believed **at the time of each entry**. ⛔ **Never rewrite a past entry.** A
  now-false entry is corrected by **appending a new dated entry**.
  ⚠️ **This bites immediately and twice:** `log.md:2008` carries **both** the *"three vault pages"*
  undercount **and** the *"accurate today"* claim. **Both were true-as-believed when written**
  (the undercount was an honest miss) and **both stay byte-identical.** The correction — including the
  fact that the set is **five, not three** — goes in a **new dated entry**.
- **⛔ Vault writes only.** Do not edit `ai-agents/knowledge-base/`, `claude/`, or any source file.
  ⚠️ **`ai-agents/knowledge-base/architecture.md` carries the same claim at `:52`, `:275` and `:375`
  — that is [`0275`](../0275-correct-the-stale-adversarial-review-citations-in-architecture-mds-review-walkthrough/brief.md)
  and [`0273`](../0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md),
  NOT this row.** If a knowledge-base page needs the same fix, **REPORT it, do not fix it.**
- **⛔ No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- **⛔ No board edit, no re-rank, no commit.**

## Verification steps

1. **Precondition, checked before any edit — ⛔ STOP AND REPORT IF UNMET.**
   `0273` must be **closed**, and `grep -rn -- "--sandbox read-only" claude/` must return **zero
   hits**. ⚠️ **If any `claude/` site still reads `read-only`, the vault pages are still true — do not
   edit them.** Report and stop.
2. **`git diff --stat` touches only paths under `ai-agents/wiki-vault/`** — zero hits anywhere else.
3. **`log.md`'s `git diff` is ADDITIONS ONLY — zero modified, zero deleted lines.**
   ⚠️ **This is the constraint most likely to be violated by a well-meaning sweep — prove it with the
   diff, do not assert it.**
4. **A per-site verdict table** covering every site the re-derived sweep returned, including the ones
   deliberately left unedited (`adr-042`'s page most likely among them) and **why**.
5. **No two vault pages contradict each other** on what the Codex sandbox permits.
6. **No page asserts the second opinion has been observed measuring anything** — grep the diff for
   *"runs the tests"*, *"verified"*, *"green"*, *"measured"* and justify each.
7. ⚠️ **`npm test` proves NOTHING about vault prose** — no test reads page content. **The close must
   say so explicitly.**

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** surfaced by the **wiki lint of 2026-08-13** (recorded at
  `ai-agents/wiki-vault/log.md:2008`), which correctly **annotated rather than corrected** because the
  pages are true today. Filed **2026-08-13** on the owner's ruling of the same day, verbatim option
  label **"File a resync task now (Recommended)"**.
- **⚠️ ORDERING — recorded as a dated note, deliberately NOT a `Depends on:` edge** (the convention
  this board uses for soft ordering; see `0256`→`0252`, and `0282`'s and `0285`'s own notes).
  **Dated 2026-08-13:**
  - **This row must run AFTER
    [`0273`](../0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md).**
    ⛔ **Running it before `0273` lands would replace TRUE statements with FALSE ones** — the five
    vault sites are accurate today, verified on disk 2026-08-13.
  - ⚠️ **This is a harder ordering than the usual soft note.** For `0282`/`0285` the cost of running
    early was *a second pass, not a wrong result*. **Here the cost of running early IS a wrong
    result.** It is recorded as a note rather than a `Depends on:` edge only to match the board's
    convention — ⛔ **treat the precondition in *Verification steps* step 1 as the real gate.**
  - **Interacts with [`0272`](../0272-replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary/brief.md)**
    (ADR-042's D1 coverage vocabulary) — different subject, same ADR. **Neither gates the other**;
    ✅ prefer `0272` first so a single vault pass can carry both, but **do not implement D1 here**.
- **⚠️ Every `:NNN` in this brief is a dated anchor measured 2026-08-13 — the durable anchor is the
  quoted text. Re-measure at execution time.** (The convention page itself is not yet written — that
  is [`0171`](../0171-write-the-durable-citation-anchors-convention-page/brief.md), still open — so
  this is stated inline rather than cited.)
- **Owner: `fkit-wiki` — mandatory, not a preference.** ADR-005 makes the vault this role's exclusive
  write gateway; no other role or session may perform this row.
