# Review — 0177-verify-the-codex-half-of-the-comment-stripping-canary

Task: [`brief.md`](./brief.md)
Plan: [`plan.md`](./plan.md) · Worklog: [`worklog.md`](./worklog.md)
File(s) under review: `claude/fkit-claude-init.sh` (comment-only) · `test/rules-block-budget.test.js` (comment-only) · `ai-agents/tasks/backlog/0177-…/canary.sh` (new) · `ai-agents/tasks/backlog/0177-…/worklog.md` (new)
Reviewers (round 1): fkit-reviewer (own pass) + Codex `codex-cli 0.145.0` (adversarial) — **both ran; coverage is full**
Status: in-review
- **Corrections:** 2026-08-16 — this ledger carries dated notes inline in **§Coder response**, at the
  *"A third variant, not named in the finding and closed by the same fix"* passage, at the **AFTER
  case table**, and at the **R1 verdict row**. Marker legend: **⚠️ = a fact that drifted or was
  wrong** (the decision is untouched); **⛔ = a decision that was overturned** (do not follow it). The
  annotated text is **left byte-identical** — corrections are appended beside it, never written over
  it. Status stays `in-review`.

> **Decision verdict — ⚠️ Changes requested — 6 defects (none blocking).** Zero defects in the two
> shipped-source edits: both are comment-only, factually correct, and the load-bearing claim was
> **independently re-measured by the reviewer this session**. All six defects sit in the *research
> artifact* (`canary.sh`) and the *evidence record* (`worklog.md`), plus one read-site provenance gap.

---

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | medium | `canary.sh:20-41` | **The containment guard — the script's only safety property — has two confirmed fail-open paths, and `rm -rf "$WORK"` (line 41) fires on a caller-supplied path with no other protection.** Both reproduced in isolation this session. **(a) Nonexistent parent:** `_w=$(cd "$(dirname "$WORK")" 2>/dev/null && pwd -P)/$(basename "$WORK")` — when the `cd` fails the substitution is empty, so `_w` collapses to `/<basename>`. Verified: `canary.sh /Users/…/fkit/does-not-exist/scratch` yields `_w=/scratch` and the `case` **ALLOWS** a target inside the fkit checkout. **(b) Script copied out of the repo — the worse one, and exactly the "reproducible by someone who did not run it" scenario the task is selling:** `FKIT_REPO` is derived by `git rev-parse --show-toplevel` from `dirname "$0"`. Verified: copy `canary.sh` to a non-repo directory and the derivation yields the empty string, so `if [ -n "${FKIT_REPO:-}" ]` is false and **the guard is skipped entirely** — then line 41 `rm -rf`s whatever path was typed. Raised by Codex (as two findings: unconditional `rm -rf`, and parent-canonicalization fail-open); path (b) is the reviewer's own addition. Recommended shape: canonicalize-or-die, treat an underivable `FKIT_REPO` as fatal rather than as "no guard", and either `mktemp -d` or refuse a pre-existing target instead of `rm -rf`-ing it. |
| R2 | 1 | medium | `canary.sh:82-96` | **Rep admissibility is fail-open: a rep that failed to run is reported as "admissible".** `codex exec … --json > "$RAW"` is followed by `echo "exit: $?"` — the status is *printed* but never *acted on*, and `set -u` is used without `-e`/`pipefail`. If codex errors, times out, or is unauthenticated, `$RAW` is empty or an error stream; the confound check at line 91 then finds no command-execution event and line 95 prints **`no command-execution event found — rep is admissible`**. There is no assertion that an agent message was produced at all, nor that the two planted tokens appeared. A silent-failure run therefore reads as clean evidence. (⚠️ Codex additionally claimed the script fails to capture codex's exit status — **that half is disproven**: `$?` on line 83 *is* codex's status and is printed correctly. The defect is that nothing gates on it.) This did not bite the recorded run — `exit: 0` and both controls held, 3/3 — so it is a reproducibility defect, not a reason to doubt the finding. |
| R3 | 1 | low | `canary.sh:87` | **The "verbatim agent message" transcript is extracted with a regex that is not JSON-safe, so "verbatim" only holds for answers containing no quote characters.** `grep -o '"text":"[^"]*"' \| sed … \| printf '%b'`: the character class stops at the first `\"`, silently truncating any message containing a quotation mark; `printf '%b'` re-interprets every backslash escape, not just `\n`, so `\\`, `\t` and octal sequences are transformed rather than reproduced. It also harvests **every** `"text":` field in the stream, not only agent messages, so a future codex build that carries text on another event type would pollute the transcript. Harmless for this run (both answers were bare tokens), but it weakens the artifact's central promise — that a later reader can re-run it and get an auditable transcript. Raised by Codex; verified against the script. Recommended shape: a real JSON parser (`jq`) selecting the documented agent-message field. |
| R4 | 1 | low | `test/rules-block-budget.test.js:27-28` | **The evidence boundary is disclosed at one read site and not the other, and the residuals live only in the worklog.** `claude/fkit-claude-init.sh:333-335` names its provenance inline — "observed directly in `codex debug prompt-input`, corroborated by a canary token only a surviving comment could carry". The test-file site states only the conclusion: "the wrapper reaches the model verbatim in the AGENTS.md payload, so it costs real context there." The builder's own recorded residual (`worklog.md:258-262`, `:459-460`) is that `prompt-input` is a **debug renderer** and that its sharing an assembly path with `codex exec` is an **inference, not an observation** — an honest and correctly-stated residual, but stated where a reader of the test file will not see it. Two smaller provenance gaps ride along: init.sh's "only a surviving comment could carry" is true *only given* the event-census exclusion of the `cat AGENTS.md` confound, which is not mentioned at the read site; and the real fkit wrapper was observed end-to-end only via `prompt-input` (the `codex exec` line proved comment survival with a *synthetic* comment in a scratch repo). Raised by Codex; the reviewer's framing is narrower — the conclusion is **not** overclaimed (see verified-negatives below), the provenance is unevenly placed. ⚖️ Partly a **frontier-move**: the brief's step 3 required these sites to stop reading as unresolved assumptions, and more hedging pulls against that — the disposition is the owner's. |
| R5 | 1 | low | `canary.sh:11` | **The negative control is described as a token that "exists nowhere", which is not true — its exact value is interpolated into the prompt at line 62.** It is absent from `AGENTS.md`; it is present in the user message. As written, the header mis-describes what the control tests (source attribution, not unseen-token recall). The builder already reasoned this through — `worklog.md:414-424` records strengthening the control with a set-equality check *precisely because* naming the token in the prompt makes "seen" ambiguous — and `worklog.md:126` states it correctly ("present nowhere **in the file**"). Only the script's own one-line legend is loose. Raised by Codex; verified. Documentation-only; the finding does not depend on it, since both readings passed 3/3. |
| R6 | 1 | low | `worklog.md:145-167` | **The 3/3 claim is attested, not auditable.** Only rep 1's transcript is reproduced; reps 2 and 3 are asserted "byte-identical to rep 1" with no hashes and no retained events. The raw `rep{1,2,3}.jsonl` were written into the scratch dir *outside* the checkout (`canary.sh:81`), which the record does not preserve, so a reader cannot verify the replication without another billed `codex exec` run. Raised by Codex; verified. Recommended shape: hashes of the three raw streams, or each rep's extracted message + event census inline. Counterweight, recorded: byte-identical reps carry no information beyond attestation, and `n=3, one model, one day` is already flagged as a residual at `worklog.md:468`. |
| R7 | 1 | low (informational) | `test/rules-block-budget.test.js:34` | **"84% utilization" — reviewer's judgement: it needs nothing, or at most a two-word era marker. It is NOT a stale live claim.** Live utilization re-measured this session: 3837 / 4352 = **88.2% → 88%**. But line 34 sits inside a wholly past-tense paragraph reporting the task-62/79-era disagreement ("Codex scored…", "fkit-reviewer kept…", "the disagreement **was** over whether 84% utilization … was worth recording"), so it reads as a historical account, which is what it is. The only real blemish is stylistic inconsistency inside one file: its sibling historical figure at line 10 carries an explicit marker ("**At the time of writing**, the block sat at ~86%") and line 34 does not. 🛑 **LOUD REGRESSION HAZARD — read before acting on this row.** "Updating" `84%` → `88%` would **falsify** the sentence, which reports what two reviewers computed at that time. That is exactly the class of error the frozen `568 / 443 / 125 / 107` arithmetic at lines 60-67 exists to prevent, and which that block's own parenthetical warns against in terms ("Re-stating them in today's bytes would make the arithmetic false"). If anything is done here, it is adding an era marker to the *prose*, never touching the number. |

### Attacks that found nothing — verified negative

Recorded so a later round does not re-derive them.

- **The central claim is CORRECT and was independently re-measured by the reviewer, not taken on
  report.** Ran `codex debug prompt-input` from the repo root (no model call, no write; `git status`
  on `AGENTS.md` / `CLAUDE.md` clean after). All six strings appear **exactly once** in the
  model-visible prompt and exactly once in `AGENTS.md`: `fkit:begin-rules`, `fkit:end-rules`,
  `fkit-managed:`, `REPLACED on every`, `Universal hard rules`, `Never commit or push unless`.
  `codex --version` → `codex-cli 0.145.0`, matching the version stamped in both comments.
  **codex does not strip. The comment sites' conclusion is right.**
- **Every byte figure independently re-measured, all agree.** Emitted block **3837 B**;
  `RULES_MAX=4352`; free **515 B**; source `universal-rules.md` **3433 B**; wrapper against an empty
  source **404 B**. ≥400 B standing target met, clearing by 115 B. No number in either comment is
  wrong. (The `515 B` and `354 B` owner rulings were honoured exactly — no number was changed at
  either site.)
- **The change really is comment-only, and the frozen arithmetic really is intact.** Every added and
  removed line in the path-scoped diff begins with `#` or `//`. `568`, `443`, `125`, `107` all still
  present on their original lines. `RULES_MAX`, `emit_block()`, `universal-rules.md`, `CLAUDE.md`,
  `AGENTS.md` untouched; no assertion or threshold in the test changed.
- **The `ADR-016` citation at both sites is apt, not decorative.** ADR-016:14 and :273-276 are exactly
  the "version-observed, not a law of nature — re-test before re-proposing, and record the version"
  principle the comments invoke.
- **Brief step 3 is met.** Neither comment site still reads as an unresolved assumption, and the two
  sites do not contradict each other ("PAID IN FULL on the codex side" ↔ "it costs real context
  there").
- **`canary.sh`'s confound-detection regex (line 91) is weak but not load-bearing — dismissed.** It
  guesses at event names (`exec_command|command_execution|shell|*exec*`) and would pass vacuously
  against an unanticipated name. It does not matter, because the script *also* prints the full event
  census unconditionally (line 98) and the worklog's actual argument rests on that census being
  exactly five known non-tool events (`worklog.md:187-190`) — the sound form of the check. No finding.
- **`brief.md`'s `## Status` flip `🔲 Backlog` → `🔄 In progress` — checked, no finding.**
  `In progress` is explicitly free to set by anyone
  (`conventions/task-status-vocabulary.md:14`, "Anyone — freely"), so no mover rule was bypassed.
  `worklog.md:4` says "No `## Status` changed", which is scoped to the *build step*; the flip is
  plausibly an earlier step's. Not attributable from an uncommitted tree either way — noted, not filed.

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

Round 1 processed 2026-08-16. Every finding was re-verified against the files before any edit; R1's
two fail-open paths were **reproduced first-hand** (evidence below), not taken on report.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT — both paths reproduced, plus a third variant the finding did not name** | Defect | **FIXED** in `canary.sh`: canonicalize-or-die on both the work path and the repo root; an underivable `FKIT_REPO` is now fatal instead of "no guard"; `rm -rf "$WORK"` replaced by `mktemp -d`, so the script deletes nothing, ever | resolved |
| R2 | **CORRECT** — verified by inspection; `set -u` without `-e`/`pipefail`, `$?` printed at `canary.sh:83` (pre-edit numbering) and never acted on, and the `else` branch prints `rep is admissible` on an empty `$RAW` | Defect | **NOT FIXED — accepted as a residual by owner ruling, 2026-08-16** (verbatim option label: "Harden R1 only (Recommended)"). Recorded below | accepted residual |
| R3 | **CORRECT** — verified by inspection; the `[^"]*` class stops at the first escaped quote and `printf '%b'` re-interprets every backslash escape, not only `\n` | Defect | **NOT FIXED — accepted as a residual by the same owner ruling.** Recorded below | accepted residual |
| R4 | **CORRECT** — verified: `claude/fkit-claude-init.sh` names its provenance inline ("observed directly in `codex debug prompt-input`, corroborated by a canary token only a surviving comment could carry"); the test-file site stated only the conclusion, and the residuals lived only in `worklog.md` | Defect (the provenance half) / ⚖️ Frontier (the hedging half) — **owner ruled the split** | **FIXED, narrowly**: three comment lines added at `test/rules-block-budget.test.js` pointing at task `0177`'s `worklog.md` for evidence, method and residuals. ⛔ **No hedge was added to the claim** — owner ruling, 2026-08-16 (verbatim option label: "Pointer to worklog.md (Recommended)"), and the brief's step 3 requires the site to stay assertive. The claim sentence is byte-unchanged | resolved |
| R5 | **CORRECT** — verified: `canary.sh:11` (pre-edit) says the negative-control token "exists nowhere"; line 62 interpolates `$ABSENT` into the prompt. It is absent from `AGENTS.md`, present in the user message | Defect (documentation-only) | **NOT FIXED — accepted as a residual by the same owner ruling.** Recorded below | accepted residual |
| R6 | **CORRECT** — verified: `worklog.md`'s "Transcripts — 3/3 identical" section reproduces rep 1 only; reps 2 and 3 are asserted "byte-identical to rep 1" with no hashes, and the raw `rep{1,2,3}.jsonl` were written into the scratch dir, which the record does not preserve | Defect (evidence-record) | **NOT FIXED — accepted as a residual by owner ruling, 2026-08-16** (verbatim option label: "Leave both as-is (Recommended)"). Re-running to capture hashes would cost a fresh billed `codex exec`. Recorded below | accepted residual |
| R7 | **CORRECT, and its regression warning is HEEDED** — verified: `test/rules-block-budget.test.js`'s "84% utilization" sits inside a wholly past-tense paragraph reporting the 0079/0130-era disagreement ("Codex scored…", "fkit-reviewer kept…", "the disagreement **was** over whether…"). Changing `84` → `88` would **falsify** the sentence | Informational / ⚖️ Frontier | **NOTHING DONE — owner ruling, 2026-08-16** (verbatim option label: "Leave both as-is (Recommended)"). The number is untouched; no era marker was added either. Grep-verified: `84% utilization` still present exactly once, `88% utilization` absent | accepted residual |

> ⚠️ **Dated correction 2026-08-16 — R1's row above reads `resolved` on the strength of a fix that
> was incomplete.** The row is **left byte-identical**. Its two named fail-open paths (a) and (b)
> genuinely were fixed in round 1 and remain fixed — re-verified this round as C3a/C3b/C5. What the
> row's *"plus a third variant the finding did not name"* did not say is that the third variant was
> **not fixed and not tested**; it stayed open until round 2. R1's status is `resolved` **as of round
> 2**, not as of round 1. The fact and its evidence live at the *"A third variant…"* note and the
> round-2 table below — deliberately not restated here, so there is one place to keep true rather
> than two.

### R1 — first-hand reproduction, before and after

⛔ `canary.sh` was **never executed** — it makes live billed `codex exec` calls. Both the reproduction
and the verification ran against a **non-destructive transplant** of the guard region only
(`canary.sh` lines `21`–`63`, i.e. `set -u` through `cd "$WORK"`), cut with `sed` into a scratch file
outside the repo, with `rm -rf` reported rather than run in the BEFORE copy and the run stopped before
any codex line in the AFTER copy. `grep -c codex` over the transplant → **0**.

**BEFORE — both fail-open paths reproduced, exactly as the finding describes:**

```
R1(a) nonexistent parent, target inside the checkout:
  FKIT_REPO=<repo> repro-guard.sh <repo>/does-not-exist/scratch
  _w='/scratch'   _r='/Users/mark.dolbyrev/Workspace/fkit'
  >>> WOULD RUN: rm -rf '<repo>/does-not-exist/scratch' <<<     exit=0   (guard ALLOWED it)

R1(b) script outside any git repo:
  repro-guard.sh <repo>/ai-agents/tasks
  FKIT_REPO=''    GUARD SKIPPED ENTIRELY
  >>> WOULD RUN: rm -rf '<repo>/ai-agents/tasks' <<<            exit=0
```

**A third variant, not named in the finding and closed by the same fix** — the script copied into a
*different* git repo. `FKIT_REPO` then derives to *that* repo's root, so the guard runs, reports
success, and protects the wrong tree:

```
  _r='<scratchpad>/otherrepo'   _w='<repo>/ai-agents/tasks'
  >>> WOULD RUN: rm -rf '<repo>/ai-agents/tasks' <<<            exit=0
```

> ⚠️ **Dated correction 2026-08-16 — the words "and closed by the same fix" in the paragraph above
> were FALSE when written.** The paragraph is **left byte-identical** as the record of what round 1
> claimed. It was not a fact that later drifted: the third variant was never re-tested, and the
> round-1 AFTER table below **omits it**, so nothing in round 1 could have caught the claim.
>
> **What is true**, verified against the round-1 hardened `canary.sh` on 2026-08-16 by an independent
> re-verify and reproduced first-hand this round before any edit:
> - The third variant **still failed open**. Guard transplanted from a copy sitting in a *different*
>   git repo, `FKIT_REPO` unset, target `<fkit>/ai-agents/tasks` → **`EXIT=0`, `GUARD ALLOWED`**,
>   with `_r=<scratch>/otherrepo` and `_w=<fkit>/ai-agents/tasks`. The identical script with
>   `FKIT_REPO` passed correctly refused at `EXIT=2`, which isolates the derivation as the cause.
> - **Why the round-1 fix could not have closed it.** All three round-1 checks test that the derived
>   `FKIT_REPO` is non-empty and resolvable. Inside another checkout `git rev-parse --show-toplevel`
>   **succeeds**, so every one of them passes on the wrong root. Resolving is not identifying.
> - **Blast radius, stated honestly**: bounded by the round-1 `mktemp -d` fix — nothing would be
>   deleted. But the script would `git init` and write `AGENTS.md` inside the fkit checkout, which is
>   exactly what its own header warning exists to prevent. At its shipped location the guard was and
>   is sound; the hole needed the script copied elsewhere.
> - **Now genuinely closed**, round 2: the resolved root must carry fkit-only markers
>   (`canary.sh`, *"RESOLVING IS NOT IDENTIFYING"*). Evidence is the round-2 table below, **not** this
>   one — deliberately not restated here, so there is one place to keep true rather than two.

**AFTER — 10 cases against the hardened guard, all as intended, plus one post-condition check
(the last row is the check, not an eleventh case):**

| Case | Result |
|---|---|
| In-checkout target, parent exists | `REFUSING: … is inside the fkit checkout` · exit 2 — **unchanged** |
| The self-test recorded in `worklog.md` (`canary.sh <repo>/nope 1`) | **byte-identical refusal message to the one on record** · exit 2 |
| R1(a): nonexistent parent inside the checkout | `REFUSING: the parent … does not exist, so the path cannot be canonicalized…` · exit 2 — **was exit 0** |
| R1(a): nonexistent parent outside the checkout | same fatal · exit 2 |
| R1(b): script outside any git repo, `FKIT_REPO` underivable | `REFUSING: cannot derive the fkit checkout root from $0 …` · exit 2 — **was: guard skipped** |
| Repo root itself named as the target | `REFUSING` · exit 2 |
| `FKIT_REPO` set to a nonexistent directory | `REFUSING: … does not resolve to a directory.` · exit 2 |
| Happy path: parent outside the checkout | fresh `…/canarywork.ocsxDkvn` created · exit 0 |
| Happy path run a second time | fresh `…/canarywork.5ZUMTGLN` created · exit 0 |
| Both scratch dirs afterwards | **both still present — nothing was deleted** |
| No argument | usage message · exit 1 |

> ⚠️ **Dated correction 2026-08-16 — the 10-case table above OMITS the third variant it had just
> claimed was fixed, and that omission is why the false claim survived round 1.** The table is **left
> byte-identical**; its ten rows were and remain correct for the cases they name. The defect is
> what is *missing* from it: the "script copied into a different git repo" case appears in the prose
> above the table and in no row of it, so "closed by the same fix" was asserted and never tested.
> **The lesson, recorded because it generalizes:** a variant you identify yourself is the one most
> likely to escape your own verification table — self-found cases need a row like any other.
> The **round-2 table immediately below supersedes this one as the ledger's complete case set**, and
> is the table a later reader should use. Nothing above is retracted.

**ROUND 2 — the full case set against the round-2 hardened guard, 13 cases, 2026-08-16.** Run by the
same non-destructive method as round 1 (guard region transplanted with `sed`, `grep -c codex` over
every transplant → **0**, `canary.sh` itself never executed). Refusal cases run a transplant that
**stops at the `esac`**, before `mktemp`/`cd`, so a fail-open case would create nothing anywhere.
The three rows marked **NEW** are the coverage round 1 lacked; the other ten are re-run to prove the
round-2 fix regressed none of them.

| # | Case | Result | vs round 1 |
|---|---|---|---|
| C1 | in-checkout target, parent exists | `REFUSING: … is inside the fkit checkout` · **exit 2** | unchanged |
| C2 | worklog self-test `<repo>/nope 1` | `REFUSING: … is inside the fkit checkout` · **exit 2** | unchanged |
| C3a | nonexistent parent INSIDE checkout | `REFUSING: the parent … does not exist…` · **exit 2** | unchanged |
| C3b | nonexistent parent OUTSIDE checkout | same fatal · **exit 2** | unchanged |
| **C4** | **script in a DIFFERENT git repo, `FKIT_REPO` unset, target `<fkit>/ai-agents/tasks`** | `REFUSING: <scratch>/otherrepo is not the fkit checkout — no claude/fkit-claude.sh under it…` · **exit 2** | **NEW — was exit 0, GUARD ALLOWED** |
| **C4b** | **same, target = the fkit repo ROOT** | same fatal · **exit 2** | **NEW — was exit 0, GUARD ALLOWED** |
| C5 | script outside ANY git repo, `FKIT_REPO` underivable | `REFUSING: cannot derive the fkit checkout root from $0 …` · **exit 2** | unchanged |
| C6 | repo root itself named as the target | `REFUSING: … is inside the fkit checkout` · **exit 2** | unchanged |
| C7 | `FKIT_REPO` = nonexistent directory | `REFUSING: … does not resolve to a directory.` · **exit 2** | unchanged |
| **C8** | **`FKIT_REPO` explicitly set to a real directory that is NOT fkit** | `REFUSING: … is not the fkit checkout…` (message names it as `explicitly-passed`) · **exit 2** | **NEW — identity now applies to explicit values too** |
| C9 | happy path, parent outside the checkout | fresh `…/canarywork.XWu9sQml` created · **exit 0** | unchanged |
| C10 | happy path a second time | fresh `…/canarywork.9l3AqfpK` created · **exit 0** | unchanged |
| C11 | no argument | usage message · **exit 1** | unchanged |
| **—** | **post-condition** (the check, not a 14th case) | both scratch dirs still present; `<fkit>/ai-agents/tasks` intact; **0** stray dirs created under it | **nothing deleted, nothing written into the checkout** |

> ⚠️ **Dated note 2026-08-16 — the artifacts C9/C10 and the post-condition row cite are no longer on
> disk. The rows are left byte-identical.** `canarywork.XWu9sQml` and `canarywork.9l3AqfpK` cannot be
> found today — their parent scratch dir is gone entirely — so the post-condition row's *"both scratch
> dirs still present"* can no longer be re-checked by looking at the filesystem.
> **The run was real and the row was true when written**: the round-2 worker's own transcript records
> both dirs created and a post-condition of `scratch dirs surviving: 2`. This is a **reproducibility
> residual, not a false fix claim** — the guard behaviour C9/C10 exercise is independently confirmed by
> a later verifier's own runs, so nothing about the fix rests on these two directories still existing.
> The C9, C10 and post-condition rows are **left byte-identical and are deliberately not rewritten to
> past tense**: they record what was observed at run time, and rewriting them would replace the
> observation with a later reader's view of it.
> **What a future round should do instead:** record the evidence somewhere that outlives the scratch
> dir — hash or list the created dirs into the ledger at run time — rather than pointing at a temporary
> path.
>
> **Corrected in place on this same pass, and named here rather than annotated:** the sentence
> introducing the table above claimed *"The four rows marked **NEW** … the other nine are re-run"*.
> The table has **3** NEW rows (C4, C4b, C8) and **10** re-run rows — both halves were wrong — and the
> sentence now reads three / ten. It was corrected in place, not annotated, because it is round 2's own
> newly-appended text rather than preserved round-1 history, and a ledger carrying a live false count
> beside a note explaining that false count is worse than a correct count. The neighbouring **13
> cases** figure was already correct (3 + 10 = 13) and is untouched.

`rm -rf` now appears in `canary.sh` **once, inside a comment** explaining why it is gone
(grep-verified). `bash -n canary.sh` → clean.

⚠️ **A bug I introduced and caught before returning, recorded rather than quietly fixed.** My first
hardening put an apostrophe inside the `${1:?…}` usage message. Inside `${parameter:?word}` a single
quote opens a quoted string even within the surrounding double quotes, and `bash -n canary.sh`
reported `unexpected EOF while looking for matching '}'` — **the whole script failed to parse**. Found
by syntax-checking, fixed by removing the apostrophe, and the reason is now a comment at the site so
the next editor does not re-introduce it. Had I not run `bash -n`, this would have shipped a script
that cannot run at all.

⚠️ **One CLI-contract change rides along, stated rather than glossed.** `<scratch-dir>` is now the
*name* of a dir whose **parent must already exist**; the script creates `<scratch-dir>.XXXXXXXX` under
that parent. `worklog.md`'s recorded guard self-test still produces its recorded output byte-for-byte
(verified above), so the evidence record is not stale.

⚠️ **`canary.sh` is not part of `npm test`** — the owner ruling that keeps it out of `test/` (accepted
residual below) means the suite covers none of this. A green suite says **nothing** about the
hardening; the isolated table above is the only evidence for it.

### Suite, re-run after both edits

`npm test` → **730 tests / 730 pass / 0 fail / 0 cancelled / 0 skipped / 0 todo, 17 suites**;
`prove-red.sh` `✓ hard gate PASSED`, all 22 mutations red at their named assertion; **exit 0**.
Identical to both the pre-build baseline and the post-build run — **delta: none**.
`test/rules-block-budget.test.js` standalone: **3 pass / 0 fail**. `RULES_MAX=4352` unchanged; neither
`claude/fkit-claude-init.sh` nor `claude/scaffold/universal-rules.md` was touched this round, so the
emitted block cannot have moved.

⛔ **Read that green as covering the R4 comment addition only.** It carries no information about the
R1 hardening, for the reason stated directly above.

> ⚠️ **Dated note 2026-08-16 — recorded limitation, no fix: this ledger's append-only discipline
> cannot be proven against git.** `review.md` and `canary.sh` are **untracked at HEAD** — `git status`
> reports both as `??`, and `git ls-files --error-unmatch` fails on both. So `git diff --numstat --
> review.md` yields **no baseline at all**: not `+N / −0`, but no row for the file, and the companion
> filter `git diff -U0 -- review.md | grep '^-' | grep -v '^---'` prints nothing because it has no
> input, not because nothing was deleted. Both commands *succeed*, which is what makes this a trap.
> (`worklog.md` and `plan.md` in this folder are untracked too; only `brief.md` is tracked and has a
> real baseline.)
>
> **What a future round should use instead — snapshot, then compare against the snapshot:** copy the
> file **before** editing, then run `git diff --no-index --numstat <snapshot> <file>` and a
> **normal-format** `diff <snapshot> <file>`, reading `<` lines as deletions (an LCS-style check works
> equally well). Both are immune to the `^---` blind spot in `grep '^-' | grep -v '^---'`: a deleted
> line whose own text begins with `---` — a markdown thematic break, a YAML fence — appears in a
> unified diff as `----…` and is discarded by that filter as though it were the diff's own
> `--- a/<file>` header, so a real deletion reads as clean. Normal-format `diff` has no such header
> line and no such blind spot. **Round 2 already used the snapshot route** (`worklog.md` decision-log
> item 9: `git diff --no-index --numstat` → `71  0`, `diff | grep '^<'` → no output), which is why its
> append-only claim stands; the point recorded here is that the tracked-file commands the correction
> form names as primary **do not apply to these files**, and reading them as passing would be reading
> an empty result as a proof.
>
> **The owner has ruled that a separate task be filed about this. It is deliberately not filed by this
> pass** — recorded here only so the limitation is not lost between rounds.

## Accepted residuals (shared, do-not-re-litigate)

Round-1 additions, all five from the owner's dispositions of 2026-08-16. Each was **verified CORRECT
before being accepted** — none is accepted because it was wrong.

- **R2 — `canary.sh` rep admissibility stays fail-open** — What: a rep that failed to run is still
  reported "admissible"; nothing gates on codex's exit status, and there is no assertion that an agent
  message or the planted tokens appeared · Why (structural): owner ruling 2026-08-16, verbatim option
  "Harden R1 only"; the finding is a **reproducibility** defect in a one-shot research artifact, and it
  did not bite the recorded run (`exit: 0`, both controls held, 3/3) · Re-raise only if: `canary.sh` is
  re-run to produce new evidence, or is promoted to anything another task depends on.
- **R3 — `canary.sh`'s transcript extractor is not JSON-safe** — What: `grep -o '"text":"[^"]*"'`
  truncates at the first escaped quote, `printf '%b'` re-interprets every backslash escape, and it
  harvests every `"text":` field rather than agent messages only · Why (structural): same owner ruling;
  harmless for the recorded run, whose two answers were bare tokens with no quote characters ·
  Re-raise only if: `canary.sh` is re-run, or a transcript with quote/backslash content is quoted from
  it as verbatim.
- **R5 — `canary.sh:11`'s negative-control legend stays loose** — What: the header says the absent
  token "exists nowhere"; it is absent from `AGENTS.md` but present in the prompt · Why (structural):
  same owner ruling; documentation-only, the finding does not depend on it (both readings passed 3/3),
  and `worklog.md` already states it correctly ("present nowhere **in the file**") · Re-raise only if:
  someone cites the script's legend, rather than the worklog, as the description of what the control
  tests.
- **R6 — the 3/3 replication claim stays attested, not auditable** — What: only rep 1's transcript is
  reproduced; reps 2 and 3 are asserted byte-identical with no hashes, and the raw `rep{1,2,3}.jsonl`
  were not preserved · Why (structural): owner ruling 2026-08-16, verbatim option "Leave both as-is";
  closing it needs a fresh **billed** `codex exec` run, and byte-identical reps carry no information
  beyond the attestation. `n=3, one model, one day` is already a recorded residual · Re-raise only if:
  the canary is re-run for another reason, at which point the hashes are free.
- **R7 — `test/rules-block-budget.test.js`'s "84% utilization" stays exactly as written** — What: the
  number is not updated and no era marker is added · Why (structural): owner ruling 2026-08-16,
  verbatim option "Leave both as-is"; the line is a **past-tense account** of the 0079/0130-era
  reviewer disagreement, so `84` → `88` would **falsify** the sentence — the same class of error the
  frozen `568 / 443 / 125 / 107` arithmetic exists to prevent · ⛔ Re-raise only if: the surrounding
  paragraph stops being past-tense. **A future round proposing `88%` here is proposing a regression.**

- **`515 B` free-headroom snapshot in `fkit-claude-init.sh`** — What: the number stays `515`, re-dated
  only · Why (structural): owner ruling Q1, 2026-08-16, verbatim option "Leave 515 B; re-date only";
  `515` is the correct live figure, re-measured by the reviewer this session · Re-raise only if: a
  fresh measurement of the emitted block disagrees with 3837 B / 515 B free.
- **`354 B` de-pinned rather than re-pinned in `test/rules-block-budget.test.js`** — What: the pinned
  figure is removed in favour of drift-proof phrasing; `354 B` was **correct**, not wrong · Why
  (structural): owner ruling Q2, 2026-08-16, verbatim option "Drift-proof it, correct rationale"; a
  number pinned in a comment invites staleness while `emittedBlockSize()` measures the live block ·
  Re-raise only if: someone proposes re-introducing a pinned wrapper figure, or repeats the refuted
  "wrong on arrival" story.
- **The frozen `568 / 443 / 125 / 107` arithmetic (test lines 60-67)** — What: stays at its historical
  values, never re-stated in today's bytes · Why (structural): protected by task 0130's review round
  R2; the numbers document a past bug's magnitude, and today's bytes would make the arithmetic false ·
  Re-raise only if: the arithmetic is shown to be internally inconsistent *at its own era*.
- **`canary.sh` lives in the task folder, not `test/`** — What: the canary is a task artifact, not a
  suite test · Why (structural): owner ruling Q3, 2026-08-16 — a codex-shelling suite test is network-,
  auth- and account-dependent and would fail for every contributor without codex credentials;
  rejected alternative was `test/` · Re-raise only if: codex credentials become a hard prerequisite of
  the suite for other reasons.
- **The refuted `3840 / 512 / 407` figures surviving inside `plan.md`** — What: they stay, beneath the
  appended dated correction that marks them refuted · Why (structural): the plan is a dated record of
  what was believed at plan time; erasing the wrong figures would erase the correction's subject.
  True figures are 3837 / 515 / 404, confirmed by eight independent paths and re-confirmed by the
  reviewer · Re-raise only if: the correction block itself goes missing.
