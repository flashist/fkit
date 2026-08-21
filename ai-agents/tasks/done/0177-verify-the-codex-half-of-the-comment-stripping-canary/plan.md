# Plan — task 0177, verify the codex half of the comment-stripping canary

## 0. Status of this step

Planning only. `EnterPlanMode` is absent (spawned consult), so I honored the skill's prose contract instead. **No repo file was created, modified, or deleted.** Disclosure: I wrote one scratch file outside the repo, `/tmp/pi.json` (a `codex debug prompt-input` dump used as a feasibility probe). Not a work product; delete or ignore.

---

## 1. Re-measured live, this session (not inherited)

Every figure below was produced now, not copied.

| Quantity | Measured now | Driver/brief said | Delta |
|---|---|---|---|
| `codex --version` | `codex-cli 0.145.0` | 0.145.0 | ✅ match |
| `RULES_MAX` | **4352** | 4352 | ✅ match |
| Emitted block | **3840 B** | 3837 B | **+3** |
| Free headroom | **512 B** | 515 B | **−3** |
| Wrapper (markers + comment) | **407 B** | 404 B | **+3** |
| Source `universal-rules.md` | 3433 B | — | — |
| Utilization | 88 % | — | — |

**≥400 B standing headroom target: MET (512 B).** The one owner-set criterion, and it holds.

Commands and raw output:

```
$ codex --version
codex-cli 0.145.0

$ grep -E '^RULES_MAX=' claude/fkit-claude-init.sh
RULES_MAX=4352
```

Emitted-block measurement — the brief's prescribed technique (run the **real** `emit_block()`, count UTF-8 bytes), lifted verbatim from `test/rules-block-budget.test.js`'s `emittedBlockSize()`:

```
emitted_bytes = 3840
RULES_MAX     = 4352
free_headroom = 512
source_bytes  = 3433
wrapper_bytes = 407
utilization   = 88%
```

**Why the 3 B delta is not caused by the dirty tree.** `git status --porcelain` on `claude/fkit-claude-init.sh`, `claude/scaffold/universal-rules.md`, `test/rules-block-budget.test.js`, `CLAUDE.md`, `AGENTS.md` returns **empty** — all five are identical to HEAD. `git log -L '/^emit_block() {/,/^}/'` shows `emit_block` **unchanged since `eb68c58`**, task 0130's own compression commit. So the wrapper has been 407 B (comment portion 357 B) since 0130 shipped, and 0130's recorded `404 B / 354 B` was already off by 3 at authoring. The brief and the driver inherited that error. Root cause not traced and not worth tracing; a plausible unconfirmed hypothesis is a char-vs-byte slip on the comment's one em-dash plus a newline miscount. **Consequence for this task: `test/rules-block-budget.test.js` carries a live stale figure (`354 B`) in a file this task is already editing** — see open question Q2.

`test/rules-block-budget.test.js` currently passes standalone: **3 pass / 0 fail.**

---

## 2. The measurement method — and what would only look like evidence

The brief forbids inferring from documentation or carrying 0130's architect consult forward. It asks for something *observable in the model's own output iff the comment survived*. Two independent lines, because each covers the other's weakness.

### Primary — direct observation of the model-visible payload

`codex debug prompt-input` ("Render the model-visible prompt input list as JSON") renders exactly what is sent to the model, **with no model call**, so there is no sampling noise and no compliance question. AGENTS.md is injected into the **developer message**, inside an `<INSTRUCTIONS>…# AGENTS.md instructions</INSTRUCTIONS>` envelope (string extracted from the installed binary), with discovery at repo root plus CWD-upward.

**I ran this once as a feasibility probe, and it already answers the question.** Preliminary result, to be redone rigorously by the implementation spawn:

```
$ codex debug prompt-input "hi" > /tmp/pi.json     # exit 0, 47943 bytes

marker/comment string            in AGENTS.md   in model-visible prompt
fkit:begin-rules                       1                 1
fkit:end-rules                         1                 1
fkit-managed:                          1                 1
REPLACED on every                      1                 1
Universal hard rules                   1                 1
Never commit or push unless            1                 1
```

And in place, inside the AGENTS.md payload — not echoed from a file listing:

```
…lives in\n[`ai-agents/knowledge-base/PROJECT.md`](…).\n\n
<!-- fkit:begin-rules -->\n
<!-- fkit-managed: this block is REPLACED on every `fkit` launch. Edits inside the markers\n
     are overwritten. Put your own standing instructions OUTSIDE them — everything outside\n
     is yours and fkit never touches it. A marker is recognized only alone on its line, so a\n
     bare marker line inside a code fence still reads as a real marker. -->\n\n
## Universal hard rules (every role, every sessi…
```

**Preliminary finding: `codex-cli 0.145.0` does NOT strip HTML comments from `AGENTS.md`.** The wrapper reaches the model verbatim. That is brief outcome **#2 — "codex does not strip"**: keep the conservative assumption, replace *assumed* with *measured* plus a version stamp.

Residual weakness of this line alone: `prompt-input` is a debug renderer. It is overwhelmingly likely to share the assembly path with `codex exec`, but that is an inference, not an observation. Hence line two.

### Corroboration — a behavioral canary through the real `codex exec` path

Run in a scratch dir **outside the repo** (session scratchpad), `git init`'d so repo-root discovery applies. `AGENTS.md` carries two distinct random tokens:

- `CANARY-PLAIN-<rand>` in ordinary markdown prose — **positive control**: proves AGENTS.md was loaded and the model is willing to report tokens.
- `CANARY-COMMENT-<rand>` inside `<!-- … -->` — **the test**.
- A third token that exists nowhere is asked for too — **negative control** against confabulation.

```
codex exec --ephemeral -s read-only --skip-git-repo-check -C <scratch> --json \
  "Without running any command or reading any file, list every token matching CANARY-* that appears in your instructions. If none, reply NONE."
```

3 repetitions. Read-out:

| Plain | Comment | Absent | Conclusion |
|---|---|---|---|
| seen | seen | not seen | **does not strip** (expected) |
| seen | NONE | not seen | **strips** |
| NONE | — | — | AGENTS.md not loaded — run **void**, not evidence of stripping |
| — | — | seen | model confabulating — run **void** |

**The confound that must be actively excluded, and the main "looks like evidence but isn't":** a model that runs `cat AGENTS.md` produces output *identical* to a model that received the comment in context. Mitigations, both required: `-s read-only` plus the explicit no-tool-use instruction, **and** verification from the `--json` event stream that **no shell command executed**. Any run with a tool call is void and re-run.

**Other things that would only look like evidence, and are excluded:**
- Asking codex whether it strips comments — a model's claim about its own harness, not an observation of it.
- Codex docs, release notes, or 0130's architect consult — excluded by the brief; the consult is the thing under test.
- A single non-mention of the token — indistinguishable from non-compliance.
- `strings` on the codex binary — I did this; it surfaces AGENTS.md handling text but no stripping machinery, and **absence in a strings dump is not evidence of absence**. Tertiary at best; will be recorded as context, never as the finding.

---

## 3. Files touched — exactly two, comments only

Nothing else. Specifically **not**: `RULES_MAX`, `emit_block()`, `claude/scaffold/universal-rules.md`, `CLAUDE.md`, `AGENTS.md`, any assertion or threshold in the test.

**The task must not re-run `fkit-claude-init.sh`.** 0130 had to (it changed the emitted block); this task does not, because the `RULES_MAX`-site comment lives *above* `RULES_MAX=4352` and is **outside** `emit_block()`. The emitted block is provably untouched, so `CLAUDE.md` / `AGENTS.md` stay clean and verification step 6 holds by construction as well as by measurement.

### 3a. `claude/fkit-claude-init.sh` (~lines 330–333)

Replace the two `UNVERIFIED:` lines; keep the four Claude-side lines above them intact:

```
# UNVERIFIED: the codex side (AGENTS.md, codex-cli 0.145.0) was not re-measured here; assume it
# still pays.
```
→
```
# MEASURED, codex side (task 0177, 2026-08-16, codex-cli 0.145.0): codex does NOT strip. The markers
# and this comment reach the model verbatim inside the AGENTS.md payload — observed directly in
# `codex debug prompt-input`, corroborated by a canary token only a surviving comment could carry.
# So the wrapper is free on the Claude side and PAID IN FULL on the codex side. Harness-specific
# (ADR-016): this is a property of these two builds and must be re-measured when either moves.
```

### 3b. `test/rules-block-budget.test.js` (header, ~lines 24–27)

```
// … The codex
// side (AGENTS.md, codex-cli 0.145.0) was NOT re-measured; assume it still pays.
```
→
```
// The codex side IS now measured (task 0177, 2026-08-16, codex-cli 0.145.0): codex does NOT strip —
// the wrapper reaches the model verbatim in the AGENTS.md payload, so it costs real context there.
// The conservative assumption was right; it is no longer an assumption. Both figures are
// harness-specific (ADR-016) and must be re-measured when either build moves.
```

Note for the reviewer, pre-empting a re-litigation of 0130's R2: the deliberately-dated `568 / 443 / 125 / 107` arithmetic elsewhere in this header is **not touched**. Q2 below concerns only the separate *"today"* figure.

---

## 4. Sequencing

0. **Full-suite BEFORE baseline** — `node --test test/*.test.js` and `bash test/prove-red.sh`, recorded. **Non-optional.** The tree is dirty with substantial unrelated in-flight work including `test/structure-check.test.js`, `claude/structure-manifest.tsv`, `claude/structure-spec.md`, `claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh`. Without a baseline a pre-existing red gets misattributed to 0177. (Checked: neither edit target appears in `claude/structure-manifest.tsv`, so these comment edits cannot stale the manifest.)
1. Record `codex --version`, `RULES_MAX`, emitted/free/wrapper bytes — the BEFORE snapshot.
2. Re-run `codex debug prompt-input`, rigorously, with a control AGENTS.md; save raw output.
3. Build and run the behavioral canary, 3 reps, with all three controls; save transcripts.
4. Classify the outcome (strip / not-strip / inconclusive). **An inconclusive result is a valid outcome — record it, do not manufacture a verdict.**
5. Apply the matching edit to both sites (3a/3b above are the outcome-#2 wording).
6. Re-measure bytes and `RULES_MAX`; confirm identical to step 1.
7. Full-suite AFTER run; diff against the baseline.
8. Write `worklog.md` with quoted transcripts, both version stamps (codex-cli 0.145.0, 2026-08-16; Claude Code 2.1.220, 2026-08-01 restated from 0130), the byte table, and the commands.
9. Light review pass — the brief asks for one; wording accuracy matters more than usual here.
10. **No commit.**

---

## 5. Verification, mapped to the brief's seven steps

| Brief step | How it is satisfied |
|---|---|
| 1. Canary actually run, output quoted | `codex debug prompt-input` JSON extract + 3 `codex exec` transcripts, quoted in `worklog.md`, not asserted |
| 2. Exact codex version recorded | `codex --version` → `codex-cli 0.145.0`, **matches the brief's 0.145.0** — no discrepancy to call out. Stamped in the worklog and in both comments; Claude-side 2.1.220 / 2026-08-01 restated |
| 3. Both comment sites updated | §3a + §3b; neither left reading as an unresolved assumption |
| 4. No functional change | `git diff -- claude/fkit-claude-init.sh test/rules-block-budget.test.js` (**path-scoped**, given the dirty tree) shows comment text only. `grep -E '^RULES_MAX=' claude/fkit-claude-init.sh` before **and** after → both must read `4352`. Cap still measures the emitted block |
| 5. Suites green | `node --test test/*.test.js` (~7 min) + `bash test/prove-red.sh`, pass/fail counts reported, **compared to the step-0 baseline** so unrelated in-flight failures are attributed correctly |
| 6. Byte budget unmoved | Re-run the §1 measurement command; must print the same figures before and after. Free ≥ 400 B ✅. Not compared against any figure printed in the brief |
| 7. Trap not walked into | No change to what the cap measures; no source-capping recommendation folded in. **The measured outcome actually removes the trap's pressure**: it was the *stripped* result that would have argued for capping the source. "codex does not strip" means the wrapper genuinely costs context on one side, which *strengthens* the existing emitted-block semantics rather than challenging it. Nothing to escalate |

---

## 6. Risks and non-obvious failure modes

- **The `cat AGENTS.md` confound** — the top risk; mitigated by `-s read-only`, the no-tool instruction, and JSON-stream verification that no command ran. Any violation voids the run.
- **Never touch the repo's real `AGENTS.md`.** A stray edit both pollutes the diff and breaks the existing "exactly one well-formed rules block" test. All canary work happens in a scratch dir outside the repo.
- **Nested-AGENTS.md leakage** — codex merges AGENTS.md from CWD up to repo root, and may layer a user-global one. The scratch dir must be a fresh `git init` at its own root, and the prompt-input dump inspected for unexpected extra AGENTS.md payloads.
- **Nondeterminism** — a single behavioral run proves little; 3 reps with consistent controls is the floor.
- **Baseline** — covered above; the dirty tree makes it mandatory.
- **Suite runtime ~7 min ×2** (baseline + after). Budget it.

---

## Open questions returned with the plan

**Q1 — refresh the stale `515 B` snapshot at the `RULES_MAX` site?** That comment reads *"515 B free at time of writing — a snapshot, not a guarantee"*. Live value measured by this planner is **512 B**. It is already self-labelled a snapshot, so it is not strictly a defect, but it sits three lines from text this task is rewriting and is now knowably wrong. **Recommendation: yes** — refresh it, dated. Strictly at the edge of the brief's "change nothing else", hence asked rather than assumed.

**Q2 — correct `354 B` → `357 B` in `test/rules-block-budget.test.js`?** The header states *"Today it is six emitting 354 B"*; measured live by this planner it is **357 B**, and `emit_block` has not changed since 0130 wrote that line, so the figure was wrong on arrival rather than having drifted. **Verified safe:** correcting it does **not** disturb the deliberately-dated `568 − 443 = 125`, `125 − 18 = 107` arithmetic that 0130's review round R2 explicitly protected — that passage uses the *old* figures, which stay untouched. **Recommendation: make it drift-proof rather than re-pin a number** (e.g. *"today it is four comment printfs; the live figure is measured, not quoted"*), since a re-pinned number is exactly what went stale twice already. Outside the brief's literal scope, so owner's call.

**Q3 — where should the canary script live?** **Recommendation: in the task folder, not `test/`.** An automated test that shells out to `codex` would be network-, auth- and account-dependent, nondeterministic, and would fail for any contributor without codex credentials — it would make `node --test test/*.test.js` unreliable for everyone. The brief's verification step 4 permits "any new test/canary artifact the work deliberately adds"; recording a reproducible script plus raw transcripts alongside `worklog.md` gets the reproducibility without that cost. Confirm, or say if you want it in the suite.

**Q4 — informational, no decision needed, flagged because two live records are wrong.** The brief's and the driver's byte figures (`3837 / 515 / 404`) are each **3 B off** this planner's live measurement (`3840 / 512 / 407`), which it traces to an error in task 0130's own recorded figures rather than to any drift or to the dirty tree. Task 0218 repaired 0177's *stale* figures shortly before, and would have inherited this 3 B error along with them. **The ≥400 B target is unaffected and is met on either figure.**

---

## Owner approval record (driver-appended, 2026-08-16)

Approved by the owner via `AskUserQuestion` in the live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-16. Verbatim option labels:

- Plan: **"Approve (Recommended)"**.
- Q3 (where the canary script lives): resolved by the plan-approval option, which states the canary script lives **in the task folder, not `test/`** — the planner's own recommendation stands. ⛔ Do not add a codex-shelling test to `test/`.
- Q1 + Q2: **"Fix both, drift-proof Q2 (Recommended)"** — refresh the `515 B` snapshot at the `RULES_MAX` site (dated), and replace the test header's pinned `354 B` with a **drift-proof phrasing** rather than a re-pinned number. ⛔ The dated `568 / 443 / 125 / 107` arithmetic that 0130's review round R2 protected stays untouched.

### ⚠️ DRIVER HOLD — the 3 B measurement conflict must be settled BEFORE Build writes any figure

Owner ruling, same session, verbatim option label: **"Settle it first, then proceed (Recommended)"**.

Q4 above is **not** merely informational, and the plan's framing of it as a settled inheritance error is **not accepted as established**. Two independent measurement implementations disagree:

- **`3837 B` emitted / `515 B` free / `404 B` wrapper** — measured in **three** separate runs across `0218`'s plan, build and re-verify steps, by two different roles.
- **`3840 B` emitted / `512 B` free / `407 B` wrapper** — measured by this planner.

Both claim to use the `test/rules-block-budget.test.js` technique. One implementation differs from the other in some detail (trailing-newline handling is the leading hypothesis, unconfirmed). **Which figure is correct is UNRESOLVED at the time this plan was approved.** The ≥400 B criterion is met on either figure, so nothing is broken — but `0218` shipped one of these numbers into `0177`'s brief minutes before this plan was written.

The driver therefore holds the Build spawn until a dedicated reconciliation settles which implementation is right. Whichever figure survives, a dated correction goes to the record that carries the wrong one. **No figure may be written into any file under this task until that is settled.**

Transport note: the plan text above was returned by the plan worker through a task-notification channel that HTML-escapes `<`, `>` and `&`; the driver restored those characters when copying. The planner's long inline `node --input-type=module -e '…'` measurement one-liner was **NOT** reproduced verbatim in §1 — its heavily-escaped quoting did not survive the channel legibly, and reproducing it approximately would have been worse than omitting it. Its raw *output* is reproduced exactly, and the reconciliation step below re-derives the command from source. This is the one deliberate omission; everything else is copied as received.

---

## ⚠️ DATED CORRECTION — 2026-08-16, the hold is DISCHARGED and this plan's byte figures are REFUTED

**Legend: ⚠️ = a fact that drifted or was wrong; the decision it sits under still stands. ⛔ = a decision overturned; do not follow it.**

**Everything above this line is left byte-identical**, as the record of what was planned and what the owner approved on its original date. This note is an append; it deletes and rewrites nothing.

### ⚠️ The correct figures

A dedicated reconciliation ran 2026-08-16 on the owner's ruling (verbatim option label: **"Settle it first, then proceed (Recommended)"**). Verdict:

| Quantity | **TRUE** | This plan says | Status |
|---|---|---|---|
| Emitted block | **3837 B** | 3840 B | ⚠️ plan is wrong |
| Free headroom | **515 B** | 512 B | ⚠️ plan is wrong |
| Wrapper overhead | **404 B** (markers 50 + comment 354) | 407 B | ⚠️ plan is wrong |
| `RULES_MAX` | 4352 | 4352 | ✅ agreed |
| Source `universal-rules.md` | 3433 B | 3433 B | ✅ agreed |

Confirmed by **five independent paths**, four of which share no implementation: `emittedBlockSize()` copied verbatim from `test/rules-block-budget.test.js`; the shipping guard's own `emit_block | wc -c`; a redirect-to-file variant (ruling out pipe/redirect asymmetry); **the wrapper measured in isolation against an empty source file — 404 B exactly, at HEAD and at `eb68c58`, task `0130`'s own compression commit**; and the live blocks embedded in `CLAUDE.md` / `AGENTS.md` extracted by marker range with no `emit_block` involved at all. `node --test test/rules-block-budget.test.js` → 3 pass / 0 fail.

**The ≥400 B standing headroom target is MET at 515 B, clearing by 115 B.** It was met on either candidate figure; this is confirmed, not assumed.

### ⚠️ The mechanism — why this plan's §1 measurement was 3 B high

**Not trailing-newline handling** — that hypothesis was tested and disproved (`$(emit_block)` moves the count *down* by 1, never up by 3). The actual cause: **a lost level of shell escaping** in the `sed` that strips the closing quote from `RULES_BEGIN` / `RULES_END` / `RULES_TAG`, leaving one stray `'` in each — **+1 byte × 3 = +3**. Feeding those degraded variables to the real `emit_block()` reproduces `3840` exactly, and `3840 − 3433 = 407`, `407 − 50 = 357` — every derived figure in this plan falls out of the same single fault. The degraded run also emits **malformed markers** (`<!-- fkit:begin-rules -->'`), which a size-only measurement is structurally blind to.

⚠️ **Honesty bound on that diagnosis:** it is confirmed by *reproduction*, not by inspecting the command this plan's author actually ran — the transport note above records that the one-liner was deliberately not reproduced, so no artifact of it survives to diff. An exactly-matching failure mode reproduces the exact figure; that is strong, and it is not proof that this is the fault that occurred.

### ⛔ §1's inheritance-error paragraph is REFUTED — do not act on it

The paragraph at §1 beginning *"Why the 3 B delta is not caused by the dirty tree"* concludes that the wrapper "has been 407 B since `0130` shipped" and that `0130`'s recorded `404 B / 354 B` "was already off by 3 at authoring", with an em-dash/newline-miscount guess as the mechanism. **That conclusion is false in every part.** Measuring the wrapper in isolation at `eb68c58` returns **404 B**. `0130`'s figures were right; task `0218`'s repair to `0177`'s brief was right; `0190`'s records were right.

⚠️ **Q4 in the open-questions list is inverted.** It claims "two live records are wrong". The live records are **correct**; the wrong numbers are in **this plan alone**.

### ⛔ Q1's approved disposition is NARROWED — its premise was false

The approval record above carries the owner's verbatim ruling **"Fix both, drift-proof Q2 (Recommended)"**. Q1's half instructed Build to refresh the `515 B` snapshot at the `RULES_MAX` site. **`515 B` is CORRECT** — executing that instruction as written would replace a correct figure with the wrong `512`.

**Owner ruling, 2026-08-16, verbatim option label: "Leave 515 B; re-date only (Recommended)".** Build **re-dates** the snapshot comment at `claude/fkit-claude-init.sh` to record that the figure was re-verified 2026-08-16, and **changes no number there**.

### ⚠️ Q2's approved disposition STANDS, with its rationale corrected

**Owner ruling, 2026-08-16, verbatim option label: "Drift-proof it, correct rationale (Recommended)".** De-pinning the test header's figure in favour of drift-proof phrasing is sound regardless of why, and proceeds. But:

- ⛔ **`354 B` must NOT be rewritten to `357 B`.** `354 B` is correct.
- ⛔ Q2's stated justification — that the figure was "wrong on arrival" — is **false** and must not be repeated in the worklog or the code comment. The real reason to de-pin is that a pinned number invites exactly the staleness this sprint has been repairing.
- The dated `568 / 443 / 125 / 107` arithmetic that `0130`'s review round R2 protected stays untouched, as already recorded.

### ✅ The DRIVER HOLD above is discharged

The hold recorded in the approval record — *"no figure may be written into any file under this task until that is settled"* — is **lifted as of this note**. Build proceeds under the corrected figures and the two narrowed dispositions above.

⚠️ **Build must re-measure for itself regardless**, per the brief and per this plan's own §4 sequencing — and must use the repo's own `test/rules-block-budget.test.js` implementation rather than an ad-hoc transcription of it. Transcribing that extractor by hand is the documented way to get this wrong.

*(Recorded by the driver, `fkit-sprint-ship-loop`, in the live `fkit lead` session that holds the owner channel.)*
