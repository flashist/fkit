# Worklog — 0280: rewrite the false "no CI" paragraph and fabricated citation in `fkit-wiki-lint`

**Role:** fkit-coder, spawned as the BUILD worker of `/fkit-sprint-ship-loop`.
**Authority:** the approved plan at `plan.md` (owner-approved 2026-08-15 via `AskUserQuestion` in the
driving `fkit lead` session; option label *"Approve (Recommended)"*). That plan is both the standing
approval and the scope boundary. `plan.md` was written by the driver at approval time and was **not**
re-authored here.
**Date:** 2026-08-15

---

## What I did

One edit, one file: replaced the parenthetical closing check 5 in
`claude/skills/fkit-wiki-lint/SKILL.md` (was lines 183–188, now 183–191).

**Removed** — the paragraph containing all three defects:
- **D1/D2** — *"this project has no CI"* / *"there is no `.github/`"*, both false on the live tree.
- **D3** — the citation `architecture.md:390: "There is no CI and no test suite"`, a quote that
  appears nowhere in `architecture.md` and a line that is actually about the `fkit update` notice.

**Inserted** — a two-case replacement that keeps the instruction: gate-repos get belt-and-braces,
no-gate repos get "may be the only thing that looks", and `⛔ Do not skip it in either case.`

Per the plan: the fabricated quote was **deleted, not repaired**; **no replacement citation** was
added (the brief permits none, and `architecture.md`'s line anchors are demonstrably drifting); the
example names **"fkit's own repo"**, never a deictic like "this project", because the file ships to
consuming repos where a deictic would rebuild D1 in a new form.

## What I deliberately did NOT do

- No edit to `ai-agents/knowledge-base/architecture.md` — edit-forbidden by the brief.
- No edit to any ADR. ADR-026's two present-tense claims (`:48`, `:131`) stay **reported-only**: the
  owner did not select that option (OQ2). Not swept.
- The `architecture.md:33-35` stale claim (OQ1) is filed as a **separate** task by a producer —
  out of this scope, untouched here.
- No commit, no push, no `ai-agents/wiki-vault/` write, no task-file move, no `## Status` change.
- No manifest regeneration (nothing owed — see step 6).
- `.claude/skills/fkit-wiki-lint/SKILL.md`, the gitignored dogfood copy, was **not** hand-edited. It
  keeps the old text until the next `fkit` launch re-runs convergence (`fkit-claude-init.sh:484-488`
  does `rm -rf` then `cp -R` per skill dir). Expected, not a defect.

---

## Verification — the brief's 8 steps, with raw output

### Step 1 — re-measure D1/D2/D3 against the live tree

```
$ ls .github/workflows
test.yml

$ grep -n "There is no CI and no test suite" ai-agents/knowledge-base/architecture.md
exit=1        # zero hits — the quote exists nowhere in the file

$ sed -n '385,395p' ai-agents/knowledge-base/architecture.md
- **`fkit update`** — an **explicit verb**. Re-runs the canonical `install.sh` for `$repo@$ref`
  (`claude/fkit-claude.sh:99-123`). Refuses to run in a source checkout ("update it with `git
  pull`").
- **the automatic check** — throttled (60 min default), **only partly time-boxed** (the curl paths
  get `--max-time 5`; the preferred `git ls-remote` path gets no deadline at all — see `:69`), silent
  when current and silent when offline, and it **only ever prints** (`:125-165`). ...
```

**Verdict:** D1 false (CI exists), D2 false (`.github/` exists), D3 confirmed fabricated —
`:390` is the update-notice discussion, nothing to do with CI or tests.

### Step 2 — the landed paragraph carries all three points

```
$ sed -n '183,191p' claude/skills/fkit-wiki-lint/SKILL.md
   *(`test/adr-number-uniqueness.test.js` also asserts this invariant, so `npm test` catches it too —
   but only where something actually runs `npm test`, and only once the collision has been committed
   and pushed. Where an automated gate exists (fkit's own repo runs the suite in GitHub Actions on
   every push to `main` and every pull request), this lint step is genuine belt-and-braces. Where one
   does not — the typical consuming project, with no `.github/` and nobody running the suite by hand
   — nothing runs it at all, and this step may be the only thing that looks.
   ⛔ **Do not skip it in either case.** The check is cheap; the lint cannot know which kind of repo
   it is running in; and even a green gate only ever sees what was already pushed, while a collision
   sitting uncommitted in the working tree is exactly what this pass exists to catch.)*
```

Mapping:
1. *Gate-repos get belt-and-braces* → sentence 2 ("Where an automated gate exists … genuine
   belt-and-braces").
2. *No-gate repos: this may be the only thing that looks* → sentence 3 ("Where one does not … may be
   the only thing that looks").
3. *The instruction itself* → "⛔ **Do not skip it in either case.**"

### Step 3 — fabricated quote and its citation are gone, with no replacement citation

```
$ grep -n "architecture.md:390\|There is no CI and no test suite" claude/skills/fkit-wiki-lint/SKILL.md
grep exit=1        # zero hits
```

**No replacement citation was added.** Reason (from the plan, §C): the brief explicitly allows none;
the new sentence asserts nothing needing a source; and `architecture.md`'s `:NNN` anchors are
actively drifting (the brief's own cites `:480`/`:597` are now `:496`/`:615`), so any new anchor
would be a fresh liability of exactly the kind this task is repairing.

### Step 4 — the instruction did not weaken (argued, not asserted)

The old text justified "do not skip" with a premise now false on this repo. The new text supplies
**three independent reasons**, and **none** depends on CI being absent:

1. **The check is cheap** — holds unconditionally.
2. **The lint cannot know which kind of repo it is running in** — holds unconditionally. This is the
   load-bearing one: it is why a reader on a CI-having repo still cannot self-exempt.
3. **A green gate only ever sees what was already pushed; an uncommitted collision in the working
   tree is exactly what this pass is for** — this reason applies *specifically* on a CI-having repo,
   i.e. to precisely the reader most tempted to skip.

Reason 3 is a strict improvement: the original had no answer at all for a CI repo. A gated reader now
reaches "genuine belt-and-braces" — an argument the step still has *value*, never permission to drop
it — and then hits an unconditional ⛔.

### Step 5 — nothing else in check 5 changed

```
$ git diff -- claude/skills/fkit-wiki-lint/SKILL.md
@@ -180,12 +180,15 @@        # exactly ONE hunk
```
One hunk, `-6 / +9`. Surrounding text at `:171-181` and the `**Compare slugs exactly…**` line at the
end are untouched (both visible as context in the hunk).

### Step 6 — single-home, and no manifest regeneration owed

```
$ find claude/scaffold -name "*wiki-lint*"
(no output — no scaffold twin)

$ grep -c "wiki-lint" claude/structure-manifest.tsv
0
```
**Conclusion:** the skill is single-homed and carries zero manifest rows, so `npm run
generate:manifest` is **not** owed. None was run.

### Step 7 — full `npm test`

```
$ npm test          # 22:46:44 → 22:53:51 MSK, ~7m07s wall
NPM_TEST_EXIT=0

ℹ tests 730
ℹ suites 17
ℹ pass 730
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 63317.591458

✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```
All 22 prove-red mutations went red as named; all 11 unmutated baselines (`0a`–`0k`) green.
Full output captured to a file and read from the file, not through a pipe, so the summary block is
the complete one.

⚠️ **This proves nothing about the prose.** No test reads a reasoning paragraph inside a `SKILL.md`.
The suite is a **no-regression check only** — it establishes that the edit broke nothing, never that
the new wording is correct. Steps 2–4 are the only evidence that bears on the wording itself, and
they are human-readable argument, not machine verification.

### Step 8 — exactly one path in the stat

```
$ git diff --stat -- claude/skills/fkit-wiki-lint/SKILL.md
 claude/skills/fkit-wiki-lint/SKILL.md | 15 +++++++++------
 1 file changed, 9 insertions(+), 6 deletions(-)
```
⚠️ Path-scoped deliberately: the working tree is dirty with unrelated in-flight sprint work, so a
bare `git diff --stat` would list dozens of files and could not satisfy this step. The scoping is
what makes the "one file" claim checkable, not a way of hiding other changes — no other file was
touched by this task.

---

## Extra check not in the plan's 8 steps

The plan's approved wording makes its **own** factual claim — that fkit's suite runs "on every push
to `main` and every pull request". Replacing a false claim with an unverified one would defeat the
task, so I checked it:

```
$ sed -n '1,20p' .github/workflows/test.yml
name: test
on:
  push:
    branches: [main]
  pull_request:
  # So the first (possibly dash-red) run can be triggered on demand, without pushing to main.
  workflow_dispatch:
```
**Claim verified true.** The workflow also has `workflow_dispatch`, which the new sentence neither
states nor denies, so the wording stands exactly as approved. No wording change was made on the back
of this check.

---

## Decision log — autonomous calls made without asking

Under the sprint-ship-loop's standing approval (ADR-019 discipline carried by ADR-032), a fix may be
applied unasked only if it is verified `CORRECT`, mechanical/localized, and inside the approved plan.

**Fixes applied without asking: none.** The single edit is the approved plan's verbatim replacement
text — not a discretionary fix.

**Obvious-winner calls: none.** Every choice in the change (delete rather than repair the quote, add
no replacement citation, name fkit's own CI rather than a deictic, omit the release gate) was
**already decided in the approved plan**, OQ3 included — the owner ruled *"Name fkit's CI
(Recommended)"*, so even that was not mine to call. Nothing was decided at implementation time.

**Scope departures: none.** Nothing outside `claude/skills/fkit-wiki-lint/SKILL.md` and this worklog
was written.

The one judgment I did exercise was **verification-only** — checking `test.yml`'s triggers before
trusting the approved sentence (above). It changed nothing, so there is nothing to reverse.

---

# Round 1 review response — 2026-08-16

**Role:** fkit-coder, spawned as the PROCESS-REVIEW worker of `/fkit-sprint-ship-loop`.
**Authority:** the same approved `plan.md`, **plus owner dispositions relayed live via
`AskUserQuestion` in the driving `fkit lead` session** (2026-08-15/16). Verbatim option labels:
R1+R2 *"Fix now, one rewrite (Recommended)"*; R3 *"Fix alongside R1/R2 (Recommended)"*; round 2
*"No round 2 (Recommended)"*.

## What I did

One edit, one file, one hunk — the **same parenthetical** rewritten again:
`claude/skills/fkit-wiki-lint/SKILL.md:183-190` (was 183–191; 9 lines → 8). Verdicts and per-finding
evidence are in `review.md`'s *Coder response*.

**Landed text:**

```
   *(`test/adr-number-uniqueness.test.js` also asserts this invariant, so `npm test` catches it too —
   but that test lives in fkit's own repo and ships nowhere else, so in a consuming project nothing
   runs it, whatever CI that project has, and this lint step may be the only thing that looks. In
   fkit's own repo it does run — GitHub Actions runs the suite on every push to `main` and every pull
   request — so there this step is genuine belt-and-braces.
   ⛔ **Do not skip it in either case.** The check is cheap; the lint cannot know which kind of repo
   it is running in; and even a green CI gate only ever sees what was already pushed, while a
   collision sitting uncommitted in the working tree is exactly what this pass exists to catch.)*
```

The three constraints on the result hold: the `⛔` line is **unconditional** and unchanged; nothing
is asserted about consumers' repos beyond what fkit itself ships; and **no citation was added** —
the only sourced claim (fkit's CI triggers) is re-verified below and stated without a `:NNN` anchor.

## Verification

```
$ git diff --stat -- claude/skills/fkit-wiki-lint/SKILL.md
 claude/skills/fkit-wiki-lint/SKILL.md | 14 ++++++++------
 1 file changed, 8 insertions(+), 6 deletions(-)

$ git diff -- claude/skills/fkit-wiki-lint/SKILL.md | grep -c '^@@'
1                       # still exactly ONE hunk for the whole task

$ grep -n "architecture.md:390\|There is no CI and no test suite\|no \`.github/\`\|typical consuming project" \
    claude/skills/fkit-wiki-lint/SKILL.md
grep exit=1             # zero hits — D3's cite, D2's claim and R2's population clause all absent

$ ls test/adr-number-uniqueness.test.js ; find claude -name "*.test.js" ; find claude -name "package.json"
test/adr-number-uniqueness.test.js
                        # both finds EMPTY — the test and the `npm test` script ship nowhere

$ sed -n '42,43p' install.sh
rm -rf "$SHARE/claude"
cp -R "$TMP/src/claude" "$SHARE/claude"

$ sed -n '13,18p' .github/workflows/test.yml
name: test
on:
  push:
    branches: [main]
  pull_request:

$ npm test              # 00:05:30 → 00:12:37, ~7m07s wall
NPM_TEST_EXIT=0
ℹ tests 730 / suites 17 / pass 730 / fail 0 / cancelled 0 / skipped 0 / todo 0
ℹ duration_ms 63477.388
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

⚠️ **`npm test` proves nothing about the prose** — no test reads a `SKILL.md` reasoning paragraph.
No-regression check only.

## Decision log — round 1 response

Standing approval: ADR-019's discipline carried by ADR-032 — a fix may be applied unasked only if it
is verified `CORRECT`, mechanical/localized, and inside the approved plan (as amended by an owner
disposition).

- **Fix 1 — answers R1.** *Changed:* replaced the gate-exists conditional with the shipping fact
  (*"that test lives in fkit's own repo and ships nowhere else…"*). *Why it qualified:* verified
  `CORRECT` by me directly (root-level `test/`; `install.sh:42-43` copies only `src/claude`; no
  `.test.js` and no `package.json` anywhere under `claude/`) — **and the owner ruled it explicitly**
  (*"Fix now, one rewrite (Recommended)"*), which is what licenses departing from the approved plan's
  Insert block. Localized to the one parenthetical.
- **Fix 2 — answers R2.** *Changed:* deleted *"the typical consuming project, with no `.github/` and
  nobody running the suite by hand"*. *Why it qualified:* verified `CORRECT` (nothing in the tree
  supports a census of consumers), owner-ruled in the same disposition, mechanical deletion inside
  the same parenthetical. The fkit-side CI example was **kept** — the standing *"Name fkit's CI
  (Recommended)"* ruling governs it and is unchanged.
- **Fix 3 — answers R3.** *Changed:* dropped *"and only once the collision has been committed and
  pushed"* from the head clause; the limit now appears once, as *"even a green **CI gate**…"*.
  *Why it qualified:* verified `CORRECT` (`package.json:5` runs `node --test` over the working tree;
  `bin/release.mjs:167-174` says CI never sees the tree), owner-ruled *"Fix alongside R1/R2
  (Recommended)"*, mechanical.

**Obvious-winner calls: none.** Every substantive choice was owner-ruled before I started.

**Judgment calls returned instead of taken: none arose.** No finding was disputed, no severity
contested, no regression appeared, and nothing required going outside the parenthetical.

**Scope departures: none.** Nothing written outside `claude/skills/fkit-wiki-lint/SKILL.md`,
`review.md`'s *Coder response* section, and this worklog. `architecture.md`, the ADRs (including
ADR-026's two present-tense claims), the vault, every task file and every `## Status` are untouched.
No commit, no push.
