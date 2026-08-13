# Implementation plan — task 0253: state the per-project re-launch step `fkit update` requires

**Planning-only run.** No file was written, no edit made. (`EnterPlanMode` is not granted to a spawned worker — ADR-021 — so this is the prose contract, honored.)

---

### 0. Brief-accuracy audit — re-derived on disk today (2026-08-13)

Every claim below was re-read from disk this session, not carried from the brief.

| Brief claim | Verdict | Evidence re-read today |
|---|---|---|
| `README.md:31-33` is "Staying current" | ✅ **still exact** | `README.md` is 112 lines; 31-33 are the three wrapped lines of that paragraph, 34 blank |
| `claude/fkit-claude-init.sh:479-490` is the refresh site | ✅ **still exact**, comment header included | `:479-480` = `# 3. refresh the fkit-managed agents + skills …`; `:481` `mkdir -p`; `:482` `rm -f "$dest/.claude/agents/fkit-"*.md`; `:483` `cp`; `:485-487` `for d in "$dest/.claude/skills/fkit-"*/ … rm -rf`; `:488` `cp -R`; `:490` the count line |
| That code runs **only** on launch | ✅ **confirmed** | Only two references to the script anywhere: `claude/fkit-claude.sh:358` and `:360` (the launch-time setup call), and `install.sh:44`, which only `chmod +x`s it. No other caller, no other verb. |
| `fkit update` updates the share only | ✅ **confirmed** | `claude/fkit-claude.sh:109-123` — the `update` arm calls `_fkit_reinstall` then `exit 0`, **before** the init call at `:358`. `_fkit_reinstall` (`:99-103`) pipes `install.sh` to `sh`. `install.sh` writes only `$SHARE` (`:21`, default `~/.local/share/fkit`) and `$BIN` (`:22`). It never touches a project. |
| "No diagnostic of any kind" | ✅ **confirmed, and stronger than the brief says** | Three independent checks: (1) `grep -c '^\.claude' claude/structure-manifest.tsv` → **0**; (2) `grep -n '\.claude' claude/structure-spec.md` → **nothing**, and `fkit-heal/check.sh` emits one line per spec-inventory row, so an absent path is invisible; (3) the divergence notice `structure_notice()` is called at `claude/fkit-claude.sh:507` — **after** the init refresh at `:358`, so even if `.claude/` were added it would always read clean. Additionally the refresh itself is **silent** on an already-set-up project: `:357-358` runs init with `>/dev/null`, so the `• refreshed N agents…` line at `fkit-claude-init.sh:490` is swallowed. |
| Brief header fields (Sprint 5 / P14) vs its own stale closing line | ⚠️ **already self-corrected** in the brief's 2026-08-10 carry note (`brief.md:83-94`). No action; **I do not edit the brief.** |

**Net: the brief is not stale.** Its two `file:line` citations both still resolve *and* still support their sentences. That is unusual for this sprint and worth stating plainly.

---

### 1. What a user actually has to do — the instruction, worked out rather than restated

The brief says "re-launch". Checked against the launcher, that is **correct but incomplete**. There are exactly **two** ways to refresh a project's `.claude/`, both one step, both per-project:

- **`fkit` or `fkit <role>` in that project** — opens a session *and* refreshes (`fkit-claude.sh:357-360`).
- **`FKIT_SETUP_ONLY=1 fkit` in that project** — refreshes and exits without launching Claude (`fkit-claude.sh:511-514`; documented in `fkit --help` at `:190`).

The second matters: someone with several projects should not have to open and close a Claude session in each just to pick up new agents. It is already a public, help-documented env var — but it appears **nowhere in `README.md` today**. Including it is therefore new README surface, so it is question **Q2** below rather than a silent decision.

There is **no** `fkit setup` verb — the only verbs are `update`/`--update`/`upgrade`/`--upgrade`/`self-update`, `-h`/`--help`, and the seven role words (`fkit-claude.sh:109`, `:167`, `:216-219`).

---

### 2. The exact edit

**File:** `/Users/mark.dolbyrev/Workspace/fkit/README.md` — the only file.

**Current text (bytes to be preserved unchanged), `README.md:31-33`:**

```markdown
**Staying current:** a normal launch does a throttled check and **tells you** when a newer version is
out — it never updates itself behind your back. Run `fkit update` when you want it. (Silence it with
`FKIT_NO_UPDATE_CHECK=1`.) A checkout of this repo is never auto-checked — update it with `git`.
```

**Proposed addition — a new paragraph inserted immediately after line 33** (i.e. new blank line, then):

```markdown
**`fkit update` updates fkit, not your projects.** It refreshes the installed copy and stops there.
Each project picks up the new agents and skills the **next time you launch `fkit` in that project** —
that launch is what rewrites its `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/`. A project
you updated but never re-launched in keeps its **old agents and skills, and nothing tells you**. Want
the refresh without opening a session? Run `FKIT_SETUP_ONLY=1 fkit` in the project.
```

Notes on the wording, each deliberate:

- **Placement is a following paragraph, not an inline insertion.** The brief's item 1 says "after the `fkit update` sentence", which would land it mid-paragraph, between `Run fkit update when you want it.` and `(Silence it with FKIT_NO_UPDATE_CHECK=1.)` — splitting one thought. A following paragraph honors the intent, and has the side benefit that lines 31-33 stay **byte-identical**, making the brief's verification steps 2-3 trivially provable. **This is a deviation from the brief's literal phrasing; flagging it rather than doing it quietly.**
- **"and nothing tells you" names the failure without naming the mechanism.** I deliberately do **not** write "no `/fkit-heal` verdict" or "the divergence check does not cover `.claude/`", even though both are true today — that would bake in an assumption about what `0255` decides. The consequence is stated flatly, as the brief demands ("do not soften it to *may be out of date*"), and stays true whichever way `0255` goes.
- **No `file:line` citation is introduced.** Only stable path globs and a public env var. This is the single biggest defense against `0252`'s failure mode.
- **The `_fkit_reinstall` env-prefix defect does not appear.** Correct per the driver's instruction: the README describes intended default behavior, and the default case (`flashist/fkit@main`) is unaffected because the defaults coincide. See §5.
- Wrap at ≤100 characters, matching the surrounding prose (README's only >100-char lines are bare ADR URLs and table rows).

---

### 3. What this falsifies elsewhere in the README — one real collision

**`README.md:35-36` is already false, and my new paragraph would sit two lines above it saying the opposite.**

```markdown
**One thing an update does not repair.** `fkit update` and a launch refresh replace the agents and
skills under `.claude/` — they never rewrite your project's own content under `ai-agents/`.
```

`fkit update` **does not** replace anything under `.claude/` — verified above (`fkit-claude.sh:109-123` exits before init; `install.sh` writes only `$SHARE`/`$BIN`). Only the *launch* refresh does. Ship the new paragraph and the README contradicts itself across a paragraph break.

Minimal surgical fix — a two-word deletion, keeping the paragraph's actual subject (that `ai-agents/` is never rewritten) intact:

```markdown
**One thing an update does not repair.** A launch refresh replaces the agents and
skills under `.claude/` — it never rewrites your project's own content under `ai-agents/`.
```

This is outside the brief's "nothing else in the file", so it is question **Q1** below, not a silent decision.

Two neighbours I checked and am **not** proposing to change:
- `README.md:26-27` — "`fkit` sets the project up if needed (… installs the agents and skills into `.claude/` …)". "if needed" slightly undersells an unconditional every-launch refresh, but nothing my paragraph adds falsifies it. Imprecise, not wrong. Leave it.
- `README.md:47-52` — the structure-divergence / `/fkit-heal` paragraph. Untouched (explicitly out of scope), and my wording avoids implying it covers `.claude/`.

Out of scope but worth recording: `install.sh:110` prints *"(From now on: 'fkit update' whenever you want; fkit tells you when a new version is out.)"* — same gap, in a code file. **Reported, not fixed.**

---

### 4. Verification — named commands, run in this order

Baseline first, so a pre-existing failure is not attributed to this change.

**Step 0 — baseline (before any edit)**
```bash
npm test            # record the result; docs-only, so it must be identical after
```

**Step 1 — blast radius**
```bash
git diff --stat     # must show exactly 1 file changed: README.md
git diff README.md  # read the hunk
```

**Step 2 — preservation of the existing sentences (brief's verification 3)**
```bash
grep -n "FKIT_NO_UPDATE_CHECK=1" README.md
grep -n "update it with .git." README.md
grep -n "a throttled check and \*\*tells you\*\*" README.md
git diff -U0 README.md | grep '^-' | grep -v '^---'   # expected: NO deleted lines (pure addition)
```
The last one is the strong form: if placement is a following paragraph, the diff must contain **zero** `-` lines. (If Q1 is approved, exactly the two `:35-36` lines will show as changed — and nothing else.)

**Step 3 — the new content is actually there (brief's verification 2)**
```bash
grep -n "next time you launch" README.md
grep -n "old agents and skills, and nothing tells you" README.md
grep -n "FKIT_SETUP_ONLY=1 fkit" README.md
```

**Step 4 — claim-support sweep (the `0252` lesson: resolving ≠ supporting)**

Every factual assertion in the new paragraph gets a command that prints the supporting bytes back from disk, to be matched **against the sentence that cites it**, not merely confirmed to resolve:

```bash
# "that launch is what rewrites .claude/agents/fkit-*.md and .claude/skills/fkit-*/"
sed -n '479,490p' claude/fkit-claude-init.sh

# "only on launch" — the complete set of callers, must be exactly these three
grep -rn "fkit-claude-init.sh" claude/fkit-claude.sh install.sh

# "fkit update … refreshes the installed copy and stops there"
sed -n '99,124p' claude/fkit-claude.sh          # update arm ends in exit 0, before :358
grep -n '^SHARE=\|^BIN=' install.sh             # install.sh's only write targets

# "nothing tells you"
grep -c '^\.claude' claude/structure-manifest.tsv    # must be 0
grep -n '\.claude' claude/structure-spec.md          # must be empty
grep -n 'structure_notice ||' claude/fkit-claude.sh  # :507, i.e. AFTER the :358 refresh
sed -n '355,362p' claude/fkit-claude.sh              # refresh is >/dev/null on a set-up project

# "FKIT_SETUP_ONLY=1 fkit … without opening a session"
grep -n "FKIT_SETUP_ONLY" claude/fkit-claude.sh      # :28, :190, :396, :511
sed -n '511,514p' claude/fkit-claude.sh              # exits without reaching the claude exec
```

**Step 5 — citation-token sweep (guards against a citation I did not intend to add)**
```bash
git diff -U0 README.md | grep '^+' | grep -oE '[A-Za-z0-9_./-]+\.(sh|md|mjs|js|tsv):[0-9]+(-[0-9]+)?'
```
Expected output: **empty**. The proposed wording introduces no `file:line`. If this ever prints a token, each one must be `sed -n`'d back from disk and read **next to the sentence that cites it** before shipping — that is exactly the check `0252` shipped without.

**Step 6 — structure/test neutrality**
```bash
npm test                                   # must match the Step 0 baseline
grep -n "^.*\bREADME.md$" claude/structure-manifest.tsv   # root README is NOT a tracked path
```
Confirmed today: the manifest's only `README` rows are `ai-agents/README.md`, `ai-agents/knowledge-base/conventions/README.md`, `ai-agents/reviews/README.md`, `ai-agents/tasks/README.md`. The repo-root `README.md` is not in the manifest, not in `structure-spec.md`'s inventory, and not dual-homed (`test/dual-home-parity-exceptions.mjs:24-25` scopes its `README.md` entry to the two `ai-agents/` homes). **So this edit cannot move any test or any conformance verdict** — which also means `npm test` is a *neutrality* check here, not evidence the prose is right. Steps 4-5 are the real verification.

**Step 7 — width**
```bash
awk 'length>100 {printf "%d\t%d\n", NR, length}' README.md
```
Must add no new rows beyond the 14 pre-existing over-100 lines (all URLs/table rows).

---

### 5. Code defect found — reported, not fixed, not documented around

`claude/fkit-claude.sh:101-102`:
```sh
  FKIT_REPO="$fkit_repo" FKIT_REF="$fkit_ref" \
    curl -fsSL "https://raw.githubusercontent.com/$fkit_repo/$fkit_ref/install.sh" | sh
```
In a POSIX pipeline the assignment prefix binds to **`curl`**, not to the `sh` on the right — the inner `sh` never receives `FKIT_REPO`/`FKIT_REF`. **Already owned by task `0284`** (its brief documents it at `:168`, `:175-182`, `:206-207`, `:286`, `:423`). **Not mine, not fixed, and deliberately absent from the README wording**; the default case (`flashist/fkit@main`) is unaffected because the defaults coincide.

---

### 6. Sequencing

1. Baseline `npm test`.
2. Apply the addition after `README.md:33` (§2).
3. Apply the `:35-36` correction **only if Q1 is approved**.
4. Verification steps 1-7 in order.
5. Report; hand off. **No commit, no push, no task-file move, no brief/sprint/backlog edit.**

Estimated surface: 5-7 added lines, plus 2 modified lines if Q1 is approved. One file.

---

### 7. Risks and edge cases

- **`0255` coupling.** Mitigated by wording: "nothing tells you" is a statement of the user-visible outcome, not of the mechanism, so it survives either `0255` outcome. If `0255` later adds `.claude/` coverage, this sentence needs revisiting — but it will not be *wrong* in the interim, and it will not have pre-empted the decision.
- **Wrong-file risk.** The repo root `README.md` is fkit's own public README. `claude/README.md` (runtime detail) and `ai-agents/README.md` (a shipped, manifest-tracked file) are **different files** and must not be touched. The `git diff --stat` check catches a slip.
- **Verification is prose-shaped, and prose has no test.** Steps 4-5 are the only real defense. Named explicitly rather than trusting a careful read — `0252` proved a careful read is not enough.
- **The claim "no other caller" is a negative.** Proved by exhaustive grep over the two files that could call it plus a repo-wide search; a caller added later would falsify it. Recorded as a bounded claim, not an eternal one.

---

### Open questions for the owner

**Q1 — `README.md:35-36` says `fkit update` replaces `.claude/`, which is false. Fix it?**
- **(Rec) Yes, minimal:** delete "`fkit update` and " and adjust "they"→"it" — 2 lines changed, keeps the paragraph's real subject intact. Consequence: strictly outside the brief's "nothing else in the file", but ships a README that does not contradict itself two lines apart.
- **No, leave it:** the diff stays a pure addition, exactly as scoped. Consequence: the README asserts and denies the same thing within one screen; a reader has no way to tell which sentence is right.
- **Split it out:** leave `:35-36` alone here, file a follow-up brief. Consequence: honors scope exactly, but the contradiction ships and lives until that task is picked up.

**Q2 — Include `FKIT_SETUP_ONLY=1 fkit` as the no-session refresh?**
- **(Rec) Yes:** one sentence. It is the only way to refresh a project without opening a Claude session, it is already public in `fkit --help`, and it is the answer for anyone with more than two projects. Consequence: adds an env var the README has never mentioned.
- **No:** keep the paragraph to "re-launch", exactly per the brief. Consequence: shorter, but a multi-project user is told to open and close a session in each project for no reason.

**Q3 — Pointer to `RELEASING.md` from the README?**
- **(Rec) No.** `RELEASING.md` is **maintainer-facing** (how to cut a release of the fkit repo); "Staying current" is **user-facing** (how to keep an install current). Its own header says it "ships to nobody" and asks not to be relocated. Linking it from a user-facing paragraph invites a user to read a document that does not apply to them. Consequence: `RELEASING.md` remains discoverable only to someone browsing the repo root — which is its intended audience anyway.
- **Yes, one line under Layout:** list it in the `Layout` block (`README.md:88-99`) as a repo-root maintainer doc. Consequence: discoverable without conflating it with user guidance — but it is a second edit site and further widens scope beyond "the Staying current paragraph".

**Q4 — Placement: following paragraph (my proposal) or inline after the `fkit update` sentence (the brief's literal wording)?**
- **(Rec) Following paragraph:** reads cleanly, and makes lines 31-33 byte-identical so the preservation checks are trivially provable.
- **Inline:** matches the brief word-for-word. Consequence: splits `Run fkit update when you want it.` from `(Silence it with FKIT_NO_UPDATE_CHECK=1.)`, and rewraps lines 31-33, so the "pure addition" diff check no longer applies.

---

<!-- ─────────────────────────────────────────────────────────────────────────
     DRIVER-APPENDED — NOT part of the approved plan text above.
     Written by fkit-sprint-ship-loop at the plan gate, 2026-08-13.
     ───────────────────────────────────────────────────────────────────────── -->

## ⚠️ One declared transformation of the plan text above — read this before treating it as verbatim

The plan reached the driver with **three `>` characters HTML-escaped as `&gt;`**, an artifact of the
worker-return transport, not of the worker's intent. The driver **un-escaped them** at these three
sites, and declares it here rather than performing it silently:

1. §0, the "No diagnostic" row — *"runs init with `>/dev/null`"*
2. §4 Step 4, the last comment of the "nothing tells you" block — *"# refresh is `>/dev/null` on a set-up project"*
3. §4 Step 7 — `awk 'length>100 {printf "%d\t%d\n", NR, length}' README.md`

**Why un-escaped rather than left as received:** at sites 2 and 3 the escaped form is a **broken
command** — `awk 'length&gt;100 …'` is a syntax error, and a build worker copying it would get a
failure that looks like a defect in the verification step rather than a transport artifact. Leaving
them would have shipped an unrunnable verification into a task whose whole subject is unrunnable
instructions. **Every other byte above is as received.**

⚠️ **Consequence a later reader must know:** this file's `git hash-object` therefore covers the
**un-escaped** text, which is what the Build worker receives and acts on. It is *not* a byte-for-byte
image of the worker's raw return. That is the only divergence, it is enumerated exhaustively above,
and nothing else was normalised, reflowed, or reworded.

## Owner approval record (driver-appended)

The owner approved this plan via `AskUserQuestion` in the `fkit lead` session on **2026-08-13**, and
answered all four open questions. All four went the plan's own recommended way.

**Plan approved** — verbatim option label: *"Approve"*.

**Q4 — Placement: FOLLOWING PARAGRAPH.** Taken as part of the approval. Lines 31-33 stay
**byte-identical**; the new paragraph goes after `:33`. The `git diff -U0 … | grep '^-'` check must
show **zero deleted lines** except the two from Q1.

**Q1 — `README.md:35-36`: YES, MINIMAL FIX.** Verbatim option label: *"Yes — minimal fix"*.
⚠️ **This deliberately widens the brief's "nothing else in the file" boundary, by owner ruling.**
Delete `` `fkit update` and `` and adjust "they"→"it". **Two lines changed, and no more.** The
paragraph's real subject — that `ai-agents/` is never rewritten — must survive intact.

**Q2 — `FKIT_SETUP_ONLY=1 fkit`: YES, one sentence.** Verbatim option label: *"Yes — one sentence"*.
It stays as worded in §2's proposed paragraph.

**Q3 — Pointer to `RELEASING.md`: NO.** Verbatim option label: *"No"*. ⛔ Do not add a
`RELEASING.md` link anywhere in `README.md` — not in "Staying current", not in the `Layout` block.
`RELEASING.md` is maintainer-facing and `0252` (closed) deliberately left the README alone so this
task would own it; the owner has now ruled the link out entirely.

**Driver's independent verification, run before approval** (measured this turn, not asserted):

- **`README.md:35-36` really is false today.** Re-read from disk: *"`fkit update` and a launch
  refresh replace the agents and skills under `.claude/`"*. The `update` arm at
  `claude/fkit-claude.sh:109-124` reaches `exit 0` **before** the init call at `:358`. Confirmed.
- **`fkit-claude-init.sh` has exactly the callers the plan claims** — `claude/fkit-claude.sh:358`
  and `:360`, plus `install.sh:44` which only `chmod +x`s it. Confirmed by repo grep.
- **`.claude/` has no diagnostic coverage at all** — `grep -c '^\.claude' claude/structure-manifest.tsv`
  → **0**; `grep -c '\.claude' claude/structure-spec.md` → **0**. So *"nothing tells you"* is exact,
  not rhetorical.
- **`FKIT_SETUP_ONLY=1` is already public** — `claude/fkit-claude.sh:190` reads
  `  FKIT_SETUP_ONLY=1     set the project up, then exit without launching`. Q2 documents an
  existing public interface rather than inventing one.
