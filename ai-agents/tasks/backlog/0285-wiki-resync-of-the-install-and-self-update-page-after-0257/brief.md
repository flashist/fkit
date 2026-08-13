# Wiki resync of `systems/install-and-self-update` after `0257` changed the banner

## ID
0285

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

**Two owner rulings, both 2026-08-13**, both given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option labels are the verbatim texts**:

1. **"File a new resync task (Recommended)"** — this row exists, and it is **not** a widening of
   `0258`.
2. **"Keep it folded in (Recommended)."** — the vault's *"time-boxed to 5 s"* claim is **in scope for
   this row**, alongside the banner-string resync. See *"✅ THE 5 s TIME-BOX IS IN SCOPE"* below.

**Provenance:** [`0257`](../../done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md),
closed 2026-08-13, changed the launcher's update-banner text. `0257`'s own brief predicted this
follow-up in its out-of-scope list: *"The vault's `systems/install-and-self-update` page quotes the
banner text verbatim and will need a resync — file it as a follow-up, do not write it."*

### ⛔ THIS IS A NEW TASK. IT IS NOT A WIDENING OF `0258`.

**The owner ruled this explicitly on 2026-08-13.**
[`0258`](../0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md) resyncs the
**same page**, and its scope is **deliberately `0252`-only**. That narrowing is itself an owner
ruling, recorded on the Backlog board row for `0258`
([`backlog.md:185`](../../../sprints/backlog.md), verbatim: *"scope is `0252` only — `0256`/`0257`
deliberately NOT folded in"*) and carried onto `sprint-5.md:157` when the row was pulled into
Sprint 5. The reasoning is `0239`'s: a union of preconditions would block a resync that is ready the
moment its own trigger lands.

⛔ **Do not touch `0258` — not its brief, not its scope, not its board row, not its rank.**
⚠️ **Both rows edit the same page.** Running them at the same time is the one combination to avoid;
see `## Notes` for the ordering note.

### ⛔ THIS ROW RUNS IN A `fkit wiki` SESSION — NOT IN `/fkit-sprint-ship-loop`

`## Owner` is **`fkit-wiki`** and it must stay that way. **Vault writes are that role's
exclusively** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

⚠️ **The sprint loop cannot run this row**, for the same reason recorded on
[`0258`](../0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md),
[`0269`](../0269-wiki-ingest-of-adr-040-and-adr-041-the-sprint-identity-decisions/brief.md) and
[`0282`](../0282-wiki-resync-of-the-no-ci-claims-after-the-0256-ci-landing/brief.md): **the loop never
reads `## Owner`** — [ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)
fixes each step's role to the skill that step runs, so its **Build** step spawns `@fkit-coder`, and
`claude/agents/fkit-coder.md` forbids that role from writing the vault **ever**. Driven by the loop,
this row either stalls on a refusal or breaches ADR-005. **It runs in a `fkit wiki` session instead.**

⚠️ **That is an exclusion from the loop and from nothing else.** `## Status` stays `🔲 Backlog`. This
row is **NOT blocked**, **NOT deprioritised**, **NOT descoped**.

### ⛔ `log.md` IS APPEND-ONLY

**Owner ruling 2026-08-03, recorded on [`0211`](../../done/0211-annotate-the-three-old-form-completion-flags-in-the-vault-log/brief.md).**
`ai-agents/wiki-vault/log.md` records what was believed **at the time of each entry**. ⛔ **Never
rewrite a past entry.** A past entry that is now false is corrected by **appending a new dated
entry**, never by editing the old one.

### The approved new renderings — the source of truth is the landed launcher, not this brief

`0257` replaced one rendering with **two**. Read off `claude/fkit-claude.sh:156-162`, verified
2026-08-13:

```
  ↑ fkit v0.2.1 — newer content on main (1111111 → deadbee). Run:  fkit update
  ↑ fkit v0.1.30 → v0.2.1 is available. Run:  fkit update      ← unchanged when versions genuinely differ
```

- The **first** is the new form. It fires whenever the two version strings are **absent or equal** —
  which is the **normal** case, because the check triggers on **shas** and only ~14% of commits ever
  touch `VERSION`.
- The **second** is the pre-existing form, **unchanged**, and it fires only when there really are two
  **distinct known** versions.
- ⚠️ **The `v0.2.1 ` prefix in the first form is conditional** (`"${curver:+v$curver }"`). With no
  installed version string the line renders `↑ fkit — newer content on main (…)`. **A page that shows
  only the `v`-prefixed form is showing a partial truth.**
- ⚠️ **Note the double space in `Run:  fkit update`** in both renderings. The page's current text has
  a single space. **Quote what the code prints.**

### ✅ THE 5 s TIME-BOX IS IN SCOPE — SETTLED BY OWNER RULING, NOT A JUDGMENT CALL

**Second owner ruling 2026-08-13**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"Keep it folded in (Recommended)."**

The producer had flagged the 5 s claim as a scope extension beyond the first ruling's words and
offered to narrow it. **The owner ruled it stays folded in**, reasoning: **same page, same resync,
same session** — and **the vault is the one place still asserting a claim `0257` corrected
everywhere else**.

⛔ **This is settled. The scope question is closed** — the first ruling names the banner string, the
second adds the time-box claim, and **both are this task's**. The same sentence on the same page
carries both, and correcting one while leaving the other would leave the page half-resynced against
the same source task.

`0257` corrected four false *"time-boxed to 5 s"* claims in
[`architecture.md`](../../../knowledge-base/architecture.md) and the launcher comments. **The vault
was not touched and still carries the old claim.** Measured on disk 2026-08-13:

| Page | Line | The stale claim |
|---|---|---|
| `wiki/systems/install-and-self-update.md` | `:9` | *"Every network call is optional, **time-boxed to 5 s**, and silent on failure"* |
| `wiki/systems/install-and-self-update.md` | `:50` | *"throttled (60 min default), **time-boxed to 5 s** … `↑ fkit vX → vY is available. Run: fkit update`"* — **both** stale claims, one sentence |
| `wiki/tasks/build-claude-self-update.md` | `:16` | *"An automatic check — throttled, **time-boxed to 5 s**, silent when current and silent when offline"* |

**The truth on disk, per `architecture.md:54`:** only the **curl** paths carry `--max-time 5`; the
**preferred `git ls-remote` path has no outer deadline at all** and was **measured at 12 s** with a
sleeping stub. ⚠️ **`wiki/tasks/build-claude-self-update.md` is a historical task page** — whether a
task page's record of what a task *built* should be **corrected in place, annotated with a dated
note, or left as history with the correction carried elsewhere** is **the librarian's call under the
vault's own conventions**. ⛔ **That is a choice of METHOD, not of scope** — the ruling put the claim
in scope on all three sites. **Record the verdict for each; ⛔ "left as history" is a permitted
verdict, "not mentioned" is not.**

⛔ **All three sites must carry a recorded verdict in the close.** ⚠️ **"Out of this task's scope" is
no longer an available verdict for the 5 s claim** — the owner closed that option on 2026-08-13.

### ⚠️ RE-DERIVE THE CARRYING SET — DO NOT TRUST THE TABLE ABOVE

A sweep was run at filing (2026-08-13):
`grep -rn 'is available\|5 s\|time-box\|only ever prints\|update check' ai-agents/wiki-vault/`.
**It is one day, a handful of patterns, and a starting point.** Re-derive it, with more than one
pattern (`is available`, `vX → vY`, `↑ fkit`, `time-boxed`, `5 s`, `only ever prints`,
`newer version`). ⚠️ **`0282` recorded a case where a generic sweep missed a carrying page that only
a targeted per-file check found. Treat that as proof the sweep must be broad.**

**Assessed as NOT carrying at filing — verify, do not assume:**

| Page | Why it looks clean |
|---|---|
| `index.md:13`, `:71` | Pointer lines only — no banner text, no timeout figure. |
| `wiki/systems/fkit.md:62`, `:123` | Cross-links to the install page; no claim of its own. |
| `wiki/decisions/adr-009-…md:20` | *"contained **no update check at all**"* — **past tense, about the pre-`0257` world, and true as history.** ⛔ Do not "correct" it. |
| `wiki/systems/install-and-self-update.md:25` | The ASCII flow line — *"prints 'run fkit update'"* — generic, no version wording. Likely correct as-is. |
| `wiki/systems/install-and-self-update.md:63` | *"`GIT_TERMINAL_PROMPT=0` … so a credential-prompting remote can never hang the launcher"* — **true about that specific cause**. ⚠️ **But it now sits next to a page that must stop implying the launcher cannot hang at all.** Judgment call: leave the claim, consider whether the page as a whole still misleads. **Record a verdict.** |

**Record one verdict per hit** — *corrected* / *correct as-is, because …* / *append-only, new entry
written* / *out of scope, reported*. ⛔ **A batch verdict does not satisfy this.**

### ⚠️ WHAT THE CORRECTED TEXT MAY NOT SAY — `0257` HAS NEVER RUN ON CI

⛔ **No vault page may state or imply that the new banner is verified on Linux, or verified by CI.**
Measured facts, and the page may not go past them:

- **CI has never executed `0257`'s change.** `architecture.md:32-33` states it in the same terms:
  *"⚠️ **The CI half has never actually run**: the workflow is verified by review, not by a run."*
  `0257` closed without a push, so no runner has ever seen this code.
- **`0257`'s own reviewer recorded the limit verbatim:** *"CI has never run this change, and the
  sealed-PATH fixture is proven on **macOS only**."*
- ✅ **What IS established:** `test/update-banner.test.js` exists and passes locally on darwin, and
  `test/prove-red.sh` mutations **16** and **17** prove two of its assertions can go red.
- ⛔ **Do not write "verified", "proven", or "tested on every platform".** *"Pinned by a local suite on
  macOS; never executed on a runner"* is the defensible form.

## What to build

A resync pass over `ai-agents/wiki-vault/`, run in a **`fkit wiki` session**, following the
librarian's own procedure (`/fkit-wiki-sync`, or `/fkit-wiki-ingest` per source page — **the
librarian's call which fits**).

1. **Re-derive the carrying set** from a fresh multi-pattern sweep. ⛔ **Do not work from this brief's
   tables.** State where the re-derived set differs from them, **in both directions**.
2. **Replace the single verbatim banner quotation with the two renderings**, sourced from
   `claude/fkit-claude.sh` as it stands on the day, **not from this brief**. Carry the conditional
   `v`-prefix and the double space.
3. **Say why there are two renderings** — the check triggers on **shas** and a remote *version* is not
   always knowable (`git ls-remote` returns refs, not file content). One sentence; the page is a
   systems page, not a changelog.
4. **Correct or annotate the `time-boxed to 5 s` claims — all three sites.** **Owner ruling
   2026-08-13, "Keep it folded in (Recommended)."** ⛔ **Not optional, not narrowable, not silently
   skipped.** The *method* per site is the librarian's call (correct in place / dated annotation /
   left as history with the correction carried elsewhere); ⛔ **the scope is not.** ⚠️ **Write what
   the code does, not "5 s"**: only the **curl** paths carry `--max-time`; the preferred
   `git ls-remote` path has **no outer deadline** and was measured at **12 s**.
5. **`log.md`: append one new dated entry.** ⛔ **No existing entry edited.**
6. **Record one verdict per hit.**
7. **Keep the page's own cross-links intact** and leave every claim `0257` did not falsify
   byte-identical — in particular the *"Version bumping is load-bearing"* conclusion and the ADR-001
   supersession note, which `0258` also protects.

### Constraints

- ⛔ **`log.md` is APPEND-ONLY** (owner ruling 2026-08-03, `0211`).
- ⛔ **Vault writes only.** ⛔ Do not edit `ai-agents/knowledge-base/`, `claude/`, or any source file.
  ⚠️ **If the librarian notices a knowledge-base page needing the same fix, report it — do not fix
  it.**
- ⛔ **Do not touch `0258`** — its brief, scope, rank, board row, or the page sections it owns beyond
  what this task's own corrections require.
- ⛔ **No task-file move** (ADR-033), no re-rank, no board-row edit beyond this task's own close.
- ⛔ No commit.
- ⚠️ **Every `:NNN` in this brief is a dated anchor measured 2026-08-13; the durable anchor is the
  quoted text. Re-measure.**

## Verification steps

1. **The carrying set was re-derived, not inherited.** Paste the sweep commands and their output.
   ⚠️ State explicitly where it differs from this brief's tables, in both directions.
2. **Every hit has exactly one recorded verdict.** ⛔ One line per hit; a batch verdict does not
   satisfy this step.
3. **The two landed renderings are quoted on the page and match the launcher byte for byte.** Show
   the launcher lines you read them from and the page text you wrote, side by side. ⚠️ **Include the
   conditional `v`-prefix case and the double space in `Run:  fkit update`.**
4. **No page asserts the banner is verified on Linux or by CI.** Quote the landed wording and show the
   never-executed caveat is present.
5. **The 5 s claims are resolved on all three sites** — corrected, annotated, or (for the historical
   task page only) recorded as left-as-history with the correction carried elsewhere. **One verdict
   per site.** ⛔ **"Out of scope" is not an available verdict** — the owner ruled the claim in scope
   on 2026-08-13, verbatim label **"Keep it folded in (Recommended)."**
6. **`log.md`: `git diff` shows additions only.** ⛔ **Zero modified or deleted lines.** Show the diff
   stat for that file specifically. ⚠️ **This is the constraint most likely to be violated by a
   well-meaning sweep** — prove it, do not assert it.
7. **`0258`'s territory is untouched.** Show that `0258`'s brief, its board row and its rank are
   byte-identical, and name any place where the two tasks' page edits would collide.
8. **Cross-links still resolve** and no two vault pages now contradict each other on the banner.
9. **`git diff --stat` touches only paths under `ai-agents/wiki-vault/`** — plus this task's own
   artifacts. Show it.
10. **Full `npm test` green; state the measured counts.** ⚠️ **Expect this to prove nothing about
    vault prose** — no test reads vault page content. **Say so explicitly** rather than implying
    coverage.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** follow-up surfaced by
  [`0257`](../../done/0257-fix-the-version-labeled-sha-triggered-update-banner/brief.md) (closed
  2026-08-13), which named it in its own out-of-scope list. Filed 2026-08-13 on the owner's ruling of
  the same day, verbatim option label **"File a new resync task (Recommended)"**. The
  **not-a-widening-of-`0258`** call is the owner's own, same date, same session.
- **Amended 2026-08-13** on a **second owner ruling of the same date and session**, verbatim option
  label **"Keep it folded in (Recommended)."** The producer's flagged scope extension — the
  *"time-boxed to 5 s"* claim — **was confirmed in scope**, and the *"may want narrowing / producer
  judgment"* hedge was **removed as settled**. The owner's reasoning, recorded: *same page, same
  resync, same session*, and **the vault is the one place still asserting a claim `0257` corrected
  everywhere else**. ⚠️ **What remains the librarian's judgment is the METHOD per site, never the
  scope.**
- **⚠️ ORDERING — recorded as a dated note, deliberately NOT a `Depends on:` edge** (the convention
  this board uses for soft ordering; see `0256`→`0252`, and `0282`'s own note). **Three interactions,
  measured 2026-08-13:**
  - **[`0258`](../0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md)** — same
    page, currently ranked **Sprint 5 P10**. ✅ **Run `0258` first.** It is scheduled, it is scoped to
    a different section (§Release + the `**Key files**` line), and running this row first would leave
    it editing a page that moved under it. ⛔ **Never concurrently.**
  - **[`0284`](../0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md)** —
    fixes the unbounded git path — **and, since the owner's 2026-08-13 "Fold into 0284 (Recommended)"
    ruling, `_fkit_reinstall`'s missing `--max-time` as well.** ⚠️ **If `0284` lands first, the correct
    page text is "bounded", not "unbounded", and writing the gap here would be stale on arrival.**
    ✅ Prefer `0284` before this row **if it is close**; otherwise record the gap as it stands and
    accept a second pass.
    ⛔ **But do NOT pre-write the post-`0284` wording, and do NOT restore "every network call is
    time-boxed" even after `0284` lands.** `0284` fences `install.sh` out of its own scope, and
    `install.sh:32` / `:59` carry no deadline — so **even a fully successful `0284` leaves `fkit
    update`'s actual download unbounded**. ⚠️ **Write only what the launcher on disk does on the day
    this runs.** Measured 2026-08-13.
  - **[`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md)** — corrects
    `architecture.md`'s citations. Unrelated subject, **same hazard**: this resync reads
    `architecture.md` as a source, and reading it before its citations are repaired means ingesting
    coordinates that are already wrong. ⚠️ **The prose claims this task ingests are correct today; it
    is the `:NNN` pointers that are not.** Do not copy them.
  - ✅ **The better order is `0258` → `0284` → this row.** ⚠️ **It is a preference, not a gate** —
    this row is runnable at any time and the cost of running early is a second pass, not a wrong
    result. Say so to whoever schedules them.
- **On merit:** the **Backlog**, unranked, and that is honest. Nothing waits on it, no behavior
  changes, no test reads vault prose, and it is not on the release path. Its claim to attention is
  that the page quotes a **user-visible string that no longer exists** — the most checkable kind of
  wrong a wiki page can be, and the kind a reader will trust.
- **Blast radius if never done:** every role reads the vault before non-trivial work (per
  `/fkit-query`, treated as ground truth). Until this runs, the vault tells them the launcher prints
  `↑ fkit vX → vY is available` — the exact wording `0257` removed because it was nonsense whenever
  the two versions matched — and that every network call is boxed at 5 s, which it is not.
- Filed 2026-08-13 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of
  the same day. It asked nothing, wrote nothing under `ai-agents/wiki-vault/`, moved no task file,
  changed no existing task's status, priority or location, and committed nothing.
- **Amended 2026-08-13** by a spawned `fkit-producer` (again **no owner channel**), relaying the
  owner's second ruling of that date via the `/fkit-sprint-ship-loop` driver. It **changed no status,
  priority, sprint field or location**, **moved no task file**, **invoked no mover**, **edited no
  source file and no sprint plan**, **wrote nothing under `ai-agents/wiki-vault/`** (⛔ ADR-005 — this
  row's own corrections are still the `fkit-wiki` role's to write, in a `fkit wiki` session), and
  **committed nothing**.
