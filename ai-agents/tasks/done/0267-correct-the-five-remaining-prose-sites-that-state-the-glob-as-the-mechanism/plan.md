# Approved implementation plan — task 0267

**Approved by the owner 2026-08-12 via `AskUserQuestion`**, in a `fkit lead` session driving
`/fkit-sprint-ship-loop` against `ai-agents/sprints/sprint-5.md`. The plan body below is the coder
worker's returned text, copied verbatim.

## Owner rulings taken at the plan gate (2026-08-12)

1. **Plan approved** — verbatim option label: "Approve (Recommended)".
2. **Verification step 3 — SATISFY THE SUBSTANCE, REPORT THE FLAW.** Verbatim option label:
   "Satisfy the substance, report the flaw (Recommended)". Paste the full sweep and account for every
   hit as the step actually demands; state plainly that the brief's three-zone prediction was wrong.
   ⛔ Do **not** edit anything to force a pass. ⛔ Do **not** edit the brief's step 3 text.
3. **The eighth-site candidate — AGREE, REPORT DON'T EDIT.** Verbatim option label:
   "Agree — report, don't edit (Recommended)". `priority-is-rank-not-identity.md:28` is **not** an
   ADR-041 §6 site. Leave both homes byte-identical; no manifest regen.
4. **Edit 2's new ADR-041 §2 link — KEEP IT.** Verbatim option label: "Keep the link (Recommended)".

---

## Evidence — what I read on disk (2026-08-12)

- Task brief `0267` in full (all four dated amendments).
- 0266's landed work: `claude/skills/fkit-status/SKILL.md:26-56` (corrected selection rule) and `:66-77` (the corrected "Why `Backlog` is a target and not a mode" block) — this is my wording precedent. Confirmed on disk: `file=` is described as **"a basename, not a path"**, and **"`active none` exits 3, and that is an answer, not a failure"** with real failure at exit 1. I contradict neither.
- 0266 closure confirmed on disk: brief is at `ai-agents/tasks/done/0266-…/brief.md` (git shows `RM` from backlog), `ai-agents/sprints/sprint-5.md:147` reads `✅ Done (agent-closed — not owner-verified)`, folder mtime **2026-08-12**. Uncommitted, as expected. **Verification step 1 satisfied.**
- ADR-041 §§2–6 verbatim; ADR-014 (test scope).
- All five target sites, plus `README.md`, `claude/structure-manifest.tsv`, `bin/generate-structure-manifest.mjs`, `test/dual-home-parity.test.js`, `test/dual-home-parity-exceptions.mjs`, `package.json`.
- **`npm test` baseline: GREEN** (exit 0, including the `prove-red.sh` hard gate — "real + unmutated copy green; each mutation reds its NAMED assertion").

---

## Line-number re-verification (brief's anchors were dated 2026-08-10)

| §6 # | Brief said | Actual on disk today | Drift |
|---|---|---|---|
| 3 | `fkit-task-brief/SKILL.md:308-312` | **`:310-312`** (glob claim at `:310-311`) | ⚠️ **moved** — `:308` is the ` ```markdown ` fence, `:309` the `# Backlog` title. The false claim is `:310-311`; `:312` is the untouched Priority sentence in the same placeholder. |
| 4 | `fkit-task-brief/SKILL.md:334-337` | `:334-337` | exact |
| 5 | `fkit-sprint-ship-loop/SKILL.md:47` | `:47` (sentence spans `:46-48`) | exact |
| 6 | `fkit-sprint-ship-loop/SKILL.md:93` | `:93` | exact |
| 7 | `ai-agents/sprints/backlog.md:7-11` | `:7-11` | exact |
| — | `README.md:31-33` (landing site) | `:31-33` | exact |

---

## Answers to the three questions you asked up front

**1. Is editing `fkit-sprint-ship-loop/SKILL.md` mid-run safe? — Yes, and for two independent reasons.**
A skill is read into context at invocation; a later disk write does not mutate the running instance. Even if the driver re-reads the file mid-run, both edits are **prose-only inside the Argument gloss (`:46-48`) and inside step 1's first bullet (`:93`)** — no step is added, removed, renumbered, or reworded as an instruction. A driver that re-read the file mid-run would get *more* correct guidance, not different guidance. The edit takes effect for the **next** invocation. I recommend sequencing this file **last** anyway, purely so the driver's own reads stay stable through the earlier work.

**2. `npm run generate:manifest` — NOT implicated.** `bin/generate-structure-manifest.mjs:70-78` walks only `{generic,omnigent/scaffold,claude/scaffold}/ai-agents/` plus four root `{CLAUDE,AGENTS}.md` files. **None of my four target paths is under `claude/scaffold/`.** Root `README.md` is not in the scaffold (`claude/scaffold/README.md` does not exist). No regen needed; `test/structure-manifest.test.js` cannot go stale from this diff.

**3. `test/dual-home-parity.test.js` — NOT implicated.** The two homes are `ai-agents/` and `claude/scaffold/ai-agents/`. The two SKILL.md files live under `claude/skills/`, outside both homes (`find claude/scaffold -name SKILL.md` returns nothing). `ai-agents/sprints/backlog.md` sits under **`sprints/`, which is a prune point** in `test/dual-home-parity-exceptions.mjs:237`, and `claude/scaffold/ai-agents/sprints/` contains only `.gitkeep` and `done/` — so the prune-point tripwire (no co-present non-`.gitkeep` file) is not tripped either. Root `README.md` is outside both homes entirely. No parity impact.

---

## ⚠️ Verification step 3's stated expectation is factually wrong — surface this before you approve

Step 3 predicts the sweep *"returns **nothing** outside `ai-agents/tasks/`, `ai-agents/knowledge-base/decisions/`, and `ai-agents/sprints/done/`."* **That is not true today and will not be true after my edits.** I ran it. The three-zone list is incomplete, so step 3 **as literally worded cannot pass**, and I will not manufacture a pass by editing files the brief forbids or that are historical records.

What step 3 actually requires — *"Paste the full result and account for every remaining hit"* — I can and will satisfy. Full post-edit accounting of every surviving hit:

| Remaining hit | Category | Action |
|---|---|---|
| `ai-agents/sprints/done/sprint-2.md:129,222,225,2704`; `done/sprint-3.md:61,173,180,188,189`; `done/sprint-4.md:54,99,106,166` | archived boards | **exempt** — brief names this zone |
| `ai-agents/sprints/sprint-5.md:13` | dated banner recording the 2026-08-10 Sprint-4 archival ruling — *"leaves exactly one `sprint-*.md` in `/fkit-status`'s active-sprint glob"* | **historical record of what was true then.** Not corrected. ⚠️ **Live board, outside all three named zones.** |
| `ai-agents/sprints/sprint-5.md:144,:147` | task-row text quoting `0264`/`0266`'s own brief titles | **historical row content.** Not corrected. ⚠️ Outside all three zones. |
| `ai-agents/sprints/backlog.md:119,:122` | task-row text quoting `0182`/`0185`'s briefs, in `➡️ Moved` / `✅ Done` rows | **historical row content on the file I am editing.** I edit `:8` only. ⚠️ Outside all three zones. |
| `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md:28` | see next section | **report, do not edit** ⚠️ Outside all three zones, and **inside `claude/`**, where the brief predicted zero hits. |

---

## The eighth-site search — one candidate found, my call is NOT a site

`priority-is-rank-not-identity.md:28`, byte-identical in both homes:

```
| A **sprint board** (`ai-agents/sprints/sprint-*.md`) Priority cell | `P<n>` | it is rank; ...
```

**My assessment: not an eighth §6 site, and it should not be edited.** §6's criterion is *"states the glob as the mechanism."* This line uses `sprint-*.md` as a **locator gloss** — "the kind of file a sprint board is" — in a table about what to write in a Priority cell. It makes **no claim about active-sprint selection**. ADR-041 retired the glob as the *selector*; it did not retire `sprint-N.md` as a naming convention (§3 keeps `backlog.md`'s name precisely because names still matter for hrefs). The line remains **true** as written.

Two further reasons not to touch it, independent of that call:
- It is **dual-homed and byte-identical**, so any edit is a **two-file edit** or `test/dual-home-parity.test.js` goes red.
- Its project path **is manifest-covered** (`claude/structure-manifest.tsv:66-67`), so editing the scaffold copy forces `npm run generate:manifest` — putting `claude/structure-manifest.tsv` into a diff that step 8 fences to five files.

Also worth flagging: the live twin `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md:28` carries the same text and **the brief's step-3 grep never looks there** (it scans only `claude/` and `ai-agents/sprints/`). The sweep is narrower than "the repo."

**This is a finding about ADR-041 §6, reported not acted on — exactly as the brief's item 5 directs.**

---

# The plan

Five prose edits across four files, plus the owner-ruled `README.md` note. **No behavior change, no new step, no new gate, no commit.**

### Edit 1 — Site 3, `claude/skills/fkit-task-brief/SKILL.md:310-312`

Inside the fenced generator skeleton. Replace the placeholder's three lines:

```
    <short header: this is not a sprint; the filename is deliberately `backlog.md`, NOT
    `sprint-backlog.md`, because /fkit-status globs `sprint-*.md` to find the active sprint;
    the Priority column reads `—` because this board is unranked by design.>
```

with:

```
    <short header: this is not a sprint; /fkit-status ignores this board because its identity
    resolves to `Backlog`, which is never eligible as the active sprint — not because of what the
    file is called; the filename is deliberately `backlog.md` because that href is written into
    every `➡️ Moved to [Backlog](backlog.md)` marker; the Priority column reads `—` because this
    board is unranked by design.>
```

Satisfies "What to build" item 1 exactly: gives the real reason the name is kept (ADR-041 §3's href argument) **without** claiming the filename is what excludes it. Stays a `<short header: …>` placeholder — the generator's contract is unchanged.

### Edit 2 — Site 4, `claude/skills/fkit-task-brief/SKILL.md:334-337`

**Rule kept verbatim in its first sentence; reason replaced.** Replace:

```
- **⚠️ Never file against `backlog.md` by writing a `sprint-backlog.md`.** `/fkit-status` finds the
  active sprint by globbing `sprint-*.md`; the backlog is excluded from the default status run purely
  because its filename does not match. A name inside the glob turns unscheduled work into the reported
  active sprint.
```

with:

```
- **⚠️ Never file against `backlog.md` by writing a `sprint-backlog.md`.** There is **one** backlog
  board and it is `backlog.md`. A second one splits unsprinted work across two files and breaks every
  `➡️ Moved to [Backlog](backlog.md)` href in the repo. It would **not** become the reported active
  sprint — `/fkit-status` resolves a `sprint-backlog.md` to the identity `Backlog` too, and `Backlog`
  is never eligible
  ([ADR-041 §2](../../../ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md))
  — but that is not a licence to write one.
```

The `../../../ai-agents/knowledge-base/decisions/` depth matches the existing links in this file and the ADR-041 links 0266 added to `fkit-status/SKILL.md`. **Owner ruling 4: KEEP the link.**

### Edit 3 — Site 5, `claude/skills/fkit-sprint-ship-loop/SKILL.md:46-48`

Replace:

```
**Argument:** `$ARGUMENTS` — a sprint plan path (e.g. `ai-agents/sprints/sprint-2.md`); **empty = the
active sprint** (the `sprint-*.md` the project is working). One operand — no output-variant flags
(`conventions/one-skill-one-output.md`).
```

with:

```
**Argument:** `$ARGUMENTS` — a sprint plan path (e.g. `ai-agents/sprints/sprint-2.md`); **empty = the
active sprint, as `/fkit-status` resolves it** — see `fkit-status/SKILL.md`'s empty-argument rule.
**Do not re-derive that rule here** (ADR-041 §5: one grammar, one implementation). One operand — no
output-variant flags (`conventions/one-skill-one-output.md`).
```

Points at the rule rather than restating it — the brief's item 3 constraint, and ADR-041 §5's binding constraint.

### Edit 4 — Site 6, `claude/skills/fkit-sprint-ship-loop/SKILL.md:93`

The line currently reads:

```
- Read the sprint plan (`$ARGUMENTS`, or the active `sprint-*.md`) and the briefs it links.
```

It becomes:

```
- Read the sprint plan (`$ARGUMENTS`, or the active sprint as `/fkit-status` resolves it) and the
  briefs it links.
```

### Edit 5 — Site 7, `ai-agents/sprints/backlog.md:7-11` — **a separate act from Edit 1, on this repo's live board**

Replace:

```
**⚠️ The filename is deliberately `backlog.md`, NOT `sprint-backlog.md`.** `/fkit-status` resolves the
active sprint by globbing `sprint-*.md` at the top of `ai-agents/sprints/`. This file does not match
that glob, and that is the whole mechanism by which the default status run ignores the backlog. Rename
it into the glob and every `/fkit-status` call starts reporting unscheduled work as if it were the
active sprint. **Do not "normalize" this name.**
```

with:

```
**⚠️ The filename is deliberately `backlog.md`, NOT `sprint-backlog.md`.** `/fkit-status` resolves the
active sprint by each plan's **identity**, never by its filename: this board's identity is `Backlog`,
which is **never eligible**, so the default status run ignores it no matter what the file is called
([ADR-041 §§2–3](../knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)).
**That exclusion is stronger than the filename rule it replaced** — renaming this file could not make
it the active sprint. The name is kept for a different reason: its href is written into every
`➡️ Moved to [Backlog](backlog.md)` marker in the repo. **Do not "normalize" this name.**
```

Link depth `../knowledge-base/decisions/` is correct from `ai-agents/sprints/`. Wording deliberately mirrors 0266's landed "stronger than the filename rule it replaced" phrasing in `fkit-status/SKILL.md`.

### Edit 6 — `README.md`, after the `**Staying current:**` block (insert after `:33`)

Per the owner's second ruling of 2026-08-10 (verbatim label **"README.md — exists today, right audience (Rec)"**). Insert a new paragraph:

```
**One thing an update does not repair.** `fkit update` and a launch refresh replace the agents and
skills under `.claude/` — they never rewrite your project's own content under `ai-agents/`. If your
project filed an unsprinted brief before this correction shipped, the header `/fkit-task-brief`
generated into `ai-agents/sprints/backlog.md` says the backlog is excluded from `/fkit-status`
because its filename sits outside a `sprint-*.md` glob. **That sentence is stale prose, not broken
behaviour.** Since
[ADR-041](ai-agents/knowledge-base/decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md)
the active sprint is selected by each plan's resolved **identity**, and the backlog is excluded
because its identity is `Backlog`, which is never eligible — a stronger rule, not a weaker one. Your
board works correctly; only its header sentence is wrong. Correct it by hand if you want it accurate;
nothing depends on it.
```

⛔ No `RELEASING.md` created. ⛔ No `Depends on: 0252` edge. ⛔ The landing-site question is **not** re-raised — it was escalated and ruled.

---

## Verification (per ADR-014 — black-box, zero new devDeps, **no new test**)

ADR-014 fences the suite at a black-box process contract; the fourth category (repo-content invariants) is instanced by `task-id-uniqueness`, `adr-number-uniqueness`, `dual-home-parity`. **A prose-truth repair adds no test** — asserting English sentences is outside every fenced category, and a new suite here would be scope creep. Verification is therefore:

1. **`npm test` green** — full run including `test/*.test.js` and the `prove-red.sh` hard gate. Baseline captured green today; a prose-only diff outside the scaffold and outside frontmatter must leave it green. (Cases 8/9 of `prove-red.sh` guard skill **frontmatter**; I touch only bodies.)
2. **Grep sweep pasted in full, every hit accounted for** — using the table above. ⚠️ Reported honestly as *"step 3's three-zone prediction is wrong; here is the complete accounting instead."*
3. **Site 3 and site 7 named as two acts** in the close, per step 4.
4. **Before/after quoted** for site 4's rule (step 6) — showing the first sentence byte-identical and only the reason replaced.
5. **`git diff --stat` shows exactly five paths**: `claude/skills/fkit-task-brief/SKILL.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `ai-agents/sprints/backlog.md`, `README.md`, and this task's own folder artifacts. **No manifest, no scaffold, no `fkit-status/SKILL.md`, no `dashboard.sh`, no `structure-spec.md`.** (0266's uncommitted work will also appear — noted, not mine.)
6. **Downstream-exposure caveat in the close, naming `README.md` and quoting the added text**, per step 5 as twice amended.

---

## Two residuals I will report, not fix

- **`fkit-sprint-ship-loop` step 1 has no executable path when `$ARGUMENTS` is empty.** The old text (*"the active `sprint-*.md`"*) at least implied a procedure; my replacement points at `fkit-status`'s rule, which ADR-041 §5 requires. Giving the loop its own `dashboard.sh select-active` call would be a **new step** — forbidden by this brief's "no behavior change" constraint. Report as a candidate follow-up; **I will not file it.**
- **The eighth-site candidate** in `priority-is-rank-not-identity.md:28` (both homes), as analysed above. **Owner ruling 3 confirms: report, do not edit.**
