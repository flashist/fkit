# Wiki resync of the vault's no-CI claims after the `0256` CI landing

## ID
0282

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-wiki

## Context

### Authority

**Owner ruling 2026-08-12**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"wiki-vault resync (~10 pages)"**.

**Provenance:** [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md),
closed 2026-08-12, landed `.github/workflows/test.yml` and the in-release `npm test` gate. The vault
was written against the pre-`0256` world and states, across many pages, that fkit has no CI and no
`.github/`.

### ⛔ THIS ROW RUNS IN A `fkit wiki` SESSION — NOT IN `/fkit-sprint-ship-loop`

`## Owner` is **`fkit-wiki`** and it must stay that way. **Vault writes are that role's
exclusively** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

⚠️ **The sprint loop cannot run this row**, for the same reason recorded on
[`0269`](../../done/0269-wiki-ingest-of-adr-040-and-adr-041-the-sprint-identity-decisions/brief.md) and
[`0258`](../../done/0258-wiki-resync-of-the-install-and-self-update-page-after-0252/brief.md): **the loop
never reads `## Owner`** — [ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)
fixes each step's role to the skill that step runs, so its **Build** step spawns `@fkit-coder`
(`claude/skills/fkit-sprint-ship-loop/SKILL.md:121`), and `claude/agents/fkit-coder.md:211` forbids
that role from writing the vault **ever**. Driven by the loop, this row either stalls on a refusal or
breaches ADR-005. **It runs in a `fkit wiki` session instead.**

⚠️ **That is an exclusion from the loop and from nothing else.** `## Status` stays `🔲 Backlog`. This
row is **NOT blocked**, **NOT deprioritised**, **NOT descoped**.

### ⛔ `log.md` IS APPEND-ONLY

**Owner ruling 2026-08-03, recorded on [`0211`](../../done/0211-annotate-the-three-old-form-completion-flags-in-the-vault-log/brief.md).**
`ai-agents/wiki-vault/log.md` records what was believed **at the time of each entry**. ⛔ **Never
rewrite a past entry.** A past entry that is now false is corrected by **appending a new dated
entry**, never by editing the old one.

⚠️ **This bites immediately here.** At filing, `log.md` carries at least three no-CI statements —
`:63` (*"no `.github/` (the CI gap is real)"*), `:85`, `:161` (*"there is no `.github/workflows/` in
the tree"*). **All three were true when written. All three stay byte-identical.** The correction is a
new appended entry for this resync.

### The carrying pages — ⚠️ RE-DERIVE, DO NOT TRUST THIS LIST

A sweep was run at filing (2026-08-12), `grep -rn "no CI\|\.github" ai-agents/wiki-vault/`, returning
**10 files**. **This list is a starting point measured on one day with one pattern. Re-derive it.**
⚠️ **The originally reported list came from a third party and named `adr-035…` — which this filing's
own sweep did NOT surface for "no CI" until a targeted per-file check found it at `:51`. That is
exactly why a fresh sweep is required rather than a list handed down.**

**Confirmed carrying, measured 2026-08-12:**

| Page | The claim |
|---|---|
| `index.md:23` | *"the CI gap it named is still open"* (ADR-003 entry) |
| `index.md:273` | *"⛔ Not continuous protection — no CI"* |
| `index.md:292` | *"the gap it named is now partly closed — `install.sh` still uncovered"* |
| `wiki/systems/testing-and-verification.md:8`, `:80`, `:86`, `:89`, `:146` | *"no CI, no test suite, no `.github/`"*; *"a CI workflow (there is no `.github/`)"*; *"the still-absent `.github/` workflow"*; *"no CI runs it"* |
| `wiki/systems/fkit.md:94`, `:238` | *"there is still no `.github/`"*; *"no CI runs it"* |
| `wiki/decisions/adr-003-ci-runs-validate-bundles.md:7-8`, `:13`, `:33` | *"the need it identified is still unmet and still open"*; *"no `.github/workflows/` exists today"* |
| `wiki/decisions/adr-014-how-fkit-tests-itself.md:8`, `:86` | *"zero automated verification — no CI, no test suite, no `.github/`"* |
| `wiki/decisions/adr-035-…md:51` | *"no CI runs it"* (inside a **dated correction note**) |
| `wiki/tasks/build-the-closed-rank-immutability-guard.md:21`, `:48` | *"No CI planned."*; *"there is no CI, so…"* |
| `wiki/tasks/add-ci-validate-bundles.md:11`, `:16`, `:18` | *"There was no CI in the repo"*; *"there is still no `.github/`"* |
| `wiki/tasks/add-e2e-smoke-script-for-fkit-itself.md:22` | *"the still-absent `.github/` workflow"* |
| `wiki/tasks/add-launcher-contract-smoke-script.md:27` | *"a CI workflow … deferred to Sprint 3"* |
| `wiki/tasks/decide-whether-fkit-needs-a-tester-agent.md:34` | *"the CI gap"* |
| `wiki/tasks/sprint-1-ship-the-onboarding-sequence.md:16`, `:19` | historical Sprint 1 scope |
| `log.md:63`, `:85`, `:101`, `:161` | ⛔ **APPEND-ONLY — see above** |

### ⛔ THE FENCE — several hits are CORRECT. Do not pattern-match on the word "CI".

**A sweep that rewrites every occurrence because most are wrong will break the ones that are right.**
Assessed at filing:

| Hit | Why it is likely CORRECT — verify, do not assume |
|---|---|
| `wiki/tasks/fix-headless-menu-guard-crash.md:8` — *"piped / CI / detached"* | About a **terminal-detection** case in the launcher. Nothing to do with GitHub Actions. |
| `wiki/tasks/specify-and-support-the-reverse-move-sprint-to-backlog.md:41` — *"passes on Linux CI and fails on the owner's Mac"* | A **hypothetical portability illustration**. ⚠️ It became *less* hypothetical once CI landed on `ubuntu-latest` — but the sentence as written is not falsified. |
| `wiki/decisions/adr-014-…md:86` — *"passes CI and fails on the owner's Mac"* | Same shape. |
| `wiki/tasks/sprint-1-…md:16`, `:19` | **Historical scope** of a closed sprint. True as history. |
| `wiki/tasks/add-ci-validate-bundles.md:11` — *"There was no CI in the repo"* | **Past tense, about 2026-07-09.** True as written. |
| `wiki/decisions/adr-014-…md:8` — *"fkit **had** zero automated verification"* | **Past tense Context.** ⚠️ Verify the tense on disk before touching it. |
| `wiki/decisions/adr-035-…md:51` | ⛔ **The claim sits inside an existing dated correction note whose header promises the original above is byte-identical.** Correcting it needs care about which layer is being amended — **surface the question rather than editing through it.** |

**Record one verdict per hit** — *corrected* / *correct as-is, because …* / *append-only, new entry
written* / *out of scope, reported*. ⛔ **A batch verdict does not satisfy this.**

### ⚠️ WHAT THE CORRECTED TEXT MAY AND MAY NOT SAY — CI HAS NEVER EXECUTED

Measured at filing: `.github/workflows/test.yml` **exists and parses on darwin**. **That is all that
is established.** `architecture.md:32-33` states it in the same terms: *"⚠️ **The CI half has never
actually run**: the workflow is verified by review, not by a run."*

⛔ **No vault page may assert that CI works, runs green, or protects anything.** The defensible claim:
**two mechanisms are now wired — an in-release `npm test` gate (watched refusing a red tree) and a CI
workflow (never executed).** ✅ The release gate is the half with evidence; the CI half is not.
**Keep them distinguished on every page that gains the correction.**

⚠️ **`install.sh` is STILL uncovered.** Several pages pair the no-CI claim with *"`install.sh` still
has none"* — **that half is still true** and must survive the correction. ⛔ **Do not let a CI
correction read as "the verification gap is closed."** It is **reduced, again** — the same
*reduced-not-closed* framing these pages already use.

## What to build

A resync pass over `ai-agents/wiki-vault/`, run in a **`fkit wiki` session**, following the
librarian's own procedure (`/fkit-wiki-sync`, or `/fkit-wiki-ingest` per source page — **the
librarian's call which fits**).

1. **Re-derive the carrying set.** Fresh sweep, more than one pattern (`no CI`, `\.github`, `zero
   automated`, `still unmet`, `still-absent`, `not continuous protection`). ⛔ **Do not work from the
   table above.**
2. **Correct every page that carries a now-false present-tense claim**, subject to the fence and the
   never-executed constraint.
3. **`log.md`: append one new dated entry.** ⛔ **No existing entry edited.** The entry records what
   this resync changed and why, and that `:63`/`:85`/`:161` were true when written.
4. **Record one verdict per hit.**
5. **Keep the vault's own cross-links intact** — several of these pages link each other and to
   `adr-003`. A correction that leaves two vault pages disagreeing has not finished.

### Constraints

- ⛔ **`log.md` is APPEND-ONLY** (owner ruling 2026-08-03, `0211`).
- ⛔ **Vault writes only.** ⛔ Do not edit `ai-agents/knowledge-base/`, `claude/`, or any source file
  — including ADR-003 (that is [`0281`](../../backlog/0281-correct-adr-003s-still-unmet-automated-verification-claim/brief.md))
  and `fkit-wiki-lint/SKILL.md` (that is [`0280`](../0280-rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint/brief.md)).
  ⚠️ **If the librarian notices a knowledge-base page needing the same fix, report it — do not fix
  it.**
- ⛔ **No task-file move** (ADR-033), no re-rank, no board-row edit beyond this task's own close.
- ⛔ No commit.
- ⚠️ **Every `:NNN` in this brief is a dated anchor measured 2026-08-12; the durable anchor is the
  quoted text. Re-measure.**

## Verification steps

1. **The carrying set was re-derived, not inherited.** Paste the sweep commands and their output.
   ⚠️ **State explicitly where the re-derived set differs from this brief's table** — in both
   directions.
2. **Every hit has exactly one recorded verdict.** ⛔ One line per hit; a batch verdict does not
   satisfy this step.
3. **The fenced hits were verified independently and are unchanged** — or, if one genuinely needed
   changing, show the independent reasoning. Name each fenced page.
4. **No corrected page asserts CI works.** ⚠️ **Quote the landed wording from at least
   `systems/testing-and-verification.md`, `systems/fkit.md` and the vault's `adr-003` page**, and
   show the never-executed caveat is present on each.
5. **The `install.sh`-still-uncovered half survived** everywhere it appeared. Show it.
6. **`log.md`: `git diff` shows additions only.** ⛔ **Zero modified or deleted lines.** Show the
   diff stat for that file specifically. ⚠️ **This is the constraint most likely to be violated by a
   well-meaning sweep** — prove it, do not assert it.
7. **Cross-links still resolve** and no two vault pages now contradict each other on CI. Name the
   pages checked.
8. **`git diff --stat` touches only paths under `ai-agents/wiki-vault/`** — plus this task's own
   artifacts. Show it.
9. **Full `npm test` green; state the measured counts.** ⚠️ **Expect this to prove nothing about
   vault prose** — no test reads vault page content. **Say so explicitly** rather than implying
   coverage.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** follow-up surfaced by [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md)'s
  CI landing (closed 2026-08-12). Filed 2026-08-12 on the owner's ruling of the same day, verbatim
  option label **"wiki-vault resync (~10 pages)"**.
- **⚠️ ORDERING — recorded as a dated note, deliberately NOT a `Depends on:` edge.** This is the
  convention this board uses for soft ordering (see `0256`→`0252`, and `0269`'s own note added
  2026-08-12). **Measured 2026-08-12, this resync interacts with three open rows:**
  - **[`0281`](../../backlog/0281-correct-adr-003s-still-unmet-automated-verification-claim/brief.md)** —
    corrects ADR-003's status line, which the vault's `wiki/decisions/adr-003-…md:7-8` mirrors and
    `index.md:23` summarises. **Running this resync first means ingesting the uncorrected ADR and
    owing a second pass.**
  - **[`0276`](../../backlog/0276-correct-the-unresolved-plan-sprint-drift-mechanism-claim-in-adr-041-and-its-echoes/brief.md)**
    — corrects a drift-mechanism claim in ADR-041. Unrelated subject, **same hazard**: a resync that
    runs before it ingests an uncorrected claim.
  - **[`0269`](../../done/0269-wiki-ingest-of-adr-040-and-adr-041-the-sprint-identity-decisions/brief.md)** —
    the pending ADR-040/041 ingest, itself already noted as wanting to run **after** `0276`.
  - ✅ **The better order is `0281` → `0276` → `0269` → this row.** Say so to whoever schedules them.
    ⚠️ **It is a preference, not a gate** — this row is runnable at any time and the cost of running
    early is a second pass, not a wrong result.
- **⚠️ The reported page list was second-hand and this brief does not rest on it.** The table above
  is an independent sweep run at filing; the fence and the append-only `log.md` hits were found by
  that sweep. ⚠️ **`adr-035` was in the second-hand list and the generic sweep missed it** — found
  only by a targeted per-file check. **Treat that as proof the sweep must be broad, not as proof the
  handed-down list is reliable.**
- **On merit:** the **Backlog**, unranked, and that is honest. Nothing waits on it, no behavior
  changes, no test reads vault prose, and it is not on the release path. Its claim to attention is
  breadth: the false claim is repeated across roughly ten pages including `index.md`, which is the
  vault's front door.
- **Blast radius if never done:** every role reads the vault before non-trivial work (per
  `/fkit-query`, treated as ground truth). Until this runs, the vault tells them fkit has no CI and
  no `.github/`, and `index.md` states the CI gap is *"still open"* — a false premise handed to
  whoever asks next.
- Filed 2026-08-12 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of
  the same day. It asked nothing, wrote nothing under `ai-agents/wiki-vault/`, moved no task file,
  touched no sprint plan, and committed nothing.
