# Plan — 0288: fix the post-release verify line's failing and false-green cases

> **APPROVED by the owner 2026-08-14**, live via `AskUserQuestion` in a `fkit lead` session driving
> `/fkit-sprint-ship-loop`. All three of the plan's open questions were put to the owner and answered
> in the same exchange. **Verbatim option labels:**
>
> - **OQ1 → "(A) Fix R5 on the default path too (Recommended)"**
> - **OQ2 → "(A) Print them (Recommended)"**
> - **OQ3 → "(A) Accept all five (Recommended)"**
>
> ⛔ **OQ1's answer is the owner ruling that settles the brief's internal contradiction** — the brief's
> Context ⛔ (*"any remedy that changes what the default path prints … has failed"*) and its
> verification step 5 (*"if the default output changed at all, say so out loud and justify it"*) cannot
> both hold once R5 is answered on the default path. **Step 5 governs; the Context ⛔ is overridden on
> this point, by the owner, on 2026-08-14.** The change must still be justified out loud per step 5.
>
> This file was written by the **driver** at the moment of approval, copying the plan text the approval
> was given over. It was not re-rendered or summarised.
>
> ⚠️ **Transport normalisation, declared:** the plan as returned by the planning worker carried
> HTML-escaped entities — `&amp;&amp;` for `&&`, `&lt;` for `<`, `&gt;` for `>` — an escaping artifact
> of the agent transport, not characters the worker typed. They are written below unescaped. **No other
> byte was altered.**

---

# PLAN

## Approach

**Grounding done first.** Read `bin/release.mjs` whole (277 lines — every `:NNN` in the brief matches its quoted text), `test/prove-red.sh` (header index + mutations 14–17 as the closest precedents), `test/update-banner.test.js` (the newest test and the best seam precedent), `package.json`, `.github/workflows/test.yml`, and the wiki pages for ADR-026 / ADR-014. **N1 confirmed from source, not executed** — `:258` is `if (doTag && !localTagExists && !remoteTagExists)`, the tag push at `:261-263` lives *inside* that block, and `:267` is `else if (!doTag)`, so the local-tag-only state falls through both. I did **not** run the reproduction (this spawn writes nothing); executing it is the build's first act.

**Three measurements I ran read-only** (against the local repo as its own remote — no network, no touch of `flashist/fkit`), because the R2 remedy turns on them:

| command (git 2.50.1) | result |
|---|---|
| `git ls-remote --tags . v0.2.1` | **only** `18595e80… refs/tags/v0.2.1` — **no peeled line** |
| `git ls-remote --tags .` (no pattern) | both the tag-object line **and** `692b8e90… refs/tags/v0.2.1^{}` |
| `git ls-remote . 'refs/tags/v0.2.1^{}'` | exactly `692b8e90… refs/tags/v0.2.1^{}`, exit 0 |
| `git ls-remote --exit-code --tags . v9.9.9` | exit 2, silent (confirms the brief) |

⚠️ **This kills the obvious R2 command.** A pattern arg suppresses the peeled line, so `git ls-remote --tags origin <tag>` can **never** show which commit the tag names. The peel must be requested by its full ref: `refs/tags/<tag>^{}`. Anyone planning R2 from memory would have printed a command that cannot answer the question.

### The organising idea

The defect is one thing said four ways: **the summary block describes the default path, not the run that actually happened.** So the remedy is not a guard bolted onto one line — it is a summary derived from the run's *end state*, computed from the same flags the execute section already used. No tag/push/bump logic changes; no `--dry-run` change.

Three derived facts, computed inside the summary block:

```js
const tagCreated  = doTag && !localTagExists && !remoteTagExists;  // the :258 block ran
const tagPushed   = tagCreated && doPush;                          // :261-263 ran
const tagOnOrigin = remoteTagExists || tagPushed;                  // true when the run ends
```

`localTagExists`/`remoteTagExists` are measured pre-run at `:218-220`, and nothing in the run can change `remoteTagExists` except our own tag push — which `tagPushed` already accounts for. Every git call in the execute section runs with `check: true`, so a failed push calls `fail()` and exits 1: **the summary only ever runs when every git command succeeded.** That is what makes deriving end-state from flags sound rather than optimistic.

Branch order (total, exhaustive, no gaps):

```
!doPush        → S-LOCAL      nothing was pushed
!doTag         → S-NOTAG      pushed, but no tag was created
tagCreated     → S-RELEASED   the default path (tag created + pushed)
remoteTagExists→ S-STALE      R2: tag was already on origin, not moved
else           → S-UNFINISHED N1: tag exists locally only, never pushed
```

### Per defect

**R1 — `✓ Released` must not appear on a run that released nothing.** I chose **alternative branch text, not a bare `doTag && doPush` guard.** Two reasons: (a) a bare guard suppresses the verify line but leaves `✓ Released v0.2.4` standing over a run that created no tag — the headline is as false as the check, and `--no-tag` *publishes commits*, so the maintainer is owed a statement of what actually landed; (b) a flag guard cannot see N1 at all (there `doTag && doPush` are both true). **What `--no-tag` alone prints instead:** `✓ Pushed main (v0.1.1) — no tag was created (--no-tag)` plus `Nothing to verify on origin: this run created no tag.` It still says the commits were published, because they were.

**R2 — distinguish "a tag of that name exists" from "that tag names this release."** In the S-STALE state the run cannot know which is true: the genuinely-idempotent `--no-bump` re-run (nothing new to commit, tag already correct) is indistinguishable from the false-green case without asking origin. So the summary **states what it knows and prints the comparison the brief names**, making no claim either way:

```
✓ Pushed main — tag v0.1.0 was already on origin; this run did NOT move it
  ⚠ An existence check would pass here whether or not the tag names this release.
  Which commit the tag names:  git ls-remote --exit-code origin 'refs/tags/v0.1.0^{}'
  Which commit this run pushed: git rev-parse HEAD
```

⛔ **I deliberately rejected the one-line verdict command** — `[ "$(git ls-remote … | cut -f1)" = "$(git rev-parse HEAD)" ] && echo ✓ || echo ✗` and its `| grep -q` cousin. A pipeline discards git's exit status, so **origin-unreachable would render as "the tag does not name this commit"** — manufacturing exactly the absent/unreachable conflation the brief says is false and forbids building against. Two plain commands keep 2 and 128 distinct, and 128 still prints its own `fatal:`. This is a **stronger check**, not a weaker label, so the brief's "argue it explicitly" clause for the weaker-label route does not apply.

Single-quoting `'refs/tags/${tag}^{}'` is **required for the command to work at all** (`^` and `{}` are shell-special in zsh), not a fix for R4. ⛔ **R4 is untouched:** the existing `--exit-code --tags origin ${tag}` line keeps its unquoted interpolation exactly as owner-ruled, and the new line's quoting is not claimed as a security improvement (a tag containing `'` still breaks out — the same pre-existing exposure).

**R5 — the failing case must not be silent.** The printed check gains a speaking failure branch that preserves a machine-readable status:

```
git ls-remote --exit-code --tags origin v0.1.1 || { echo "✗ v0.1.1 not confirmed on origin (git exit $?)"; false; }
```

- tag present → git prints the sha, exit 0 — **identical to today**;
- tag absent → prints `✗ … (git exit 2)`, status 1;
- origin unreachable → git's own `fatal:` **plus** `✗ … (git exit 128)`, status 1.

`$?` inside the `||` group expands to git's status (arguments expand before `echo` runs); the trailing `false` keeps the compound non-zero so `$?` remains usable. **The real git code is printed, so 2 and 128 stay distinguishable** — nothing here presumes they were ambiguous. ⚠️ This changes the *text* the default path prints; see **Open question 1** — it is the one place the brief's Context ⛔ and its verification step 5 pull in opposite directions, and I will not resolve that silently.

**N1 — bounded to the summary block, per the 2026-08-13 ruling.** ⛔ No tag push is added; the fence is not lifted. The S-UNFINISHED branch prints:

```
⚠ UNFINISHED — main was pushed, but tag v0.1.0 was NOT pushed
  The tag already existed locally, so tag creation was skipped — and the tag push
  lives inside that same skipped step, so it never ran.
  Finish it by hand:  git push origin v0.1.0
  ⚠ Check what it names first: git rev-parse 'v0.1.0^{}'  vs  git rev-parse HEAD
```

No `✓ Released`, no green check. The accepted residual stands and the close must say so: **after `0288`, `--no-bump` still cannot finish that release — it stops lying about it.** R2 and N1 are answered by **separate branches** (`remoteTagExists` vs the fall-through), not one shared guard; the brief's warning that a single `localTagExists || remoteTagExists` guard fixes one and leaves the other is exactly why the branch order above is total.

### What each path prints (requirement 4)

| run | headline | follow-on |
|---|---|---|
| default | `✓ Released v0.1.1` *(byte-identical)* | verify line (R5 form — see OQ1) |
| `--no-tag` | `✓ Pushed main (v0.1.1) — no tag was created (--no-tag)` | `Nothing to verify on origin: this run created no tag.` |
| `--no-push` | `⚠ NOT released — nothing was pushed (--no-push)` | `v0.1.1 is committed and tagged locally only.` + `Finish it with: git push origin main && git push origin v0.1.1` |
| `--no-tag --no-push` | `⚠ NOT released — nothing was pushed, no tag created` | `v0.1.1 is committed locally only.` |
| `--no-bump`, tag on origin (R2) | `✓ Pushed main — tag v0.1.0 was already on origin; this run did NOT move it` | the two-command comparison above |
| `--no-bump`, tag local-only (N1) | `⚠ UNFINISHED — main was pushed, but tag v0.1.0 was NOT pushed` | reason + `git push origin v0.1.0` + the peel-vs-HEAD caution |
| `--dry-run` | unchanged, byte-identical | unchanged |

## Files touched

1. **`/Users/mark.dolbyrev/Workspace/fkit/bin/release.mjs`** — the summary block only (today `:271-277`). `:272`'s `if (dryRun)` arm is **byte-unchanged**; the `else` arm becomes the five-branch state summary plus the three derived consts and a comment recording why the summary must not re-derive state from `doTag`/`doPush` alone. ⛔ Nothing above `:271` is edited — no bump, tag, push or dry-run logic; no header-comment rewrite (the "idempotent" claim at `:12-14` stays, and the close records that it overstates).
2. **`/Users/mark.dolbyrev/Workspace/fkit/test/release-summary.test.js`** — **new.** Picked up automatically by `node --test test/*.test.js`; ⛔ `package.json` is not edited.
3. **`/Users/mark.dolbyrev/Workspace/fkit/test/prove-red.sh`** — a `make_release_copy()` + `run_release_suite()` helper pair, an unmutated-copy baseline step, **five** mutation blocks, and the header index updated **SEVENTEEN → TWENTY-TWO** with five new index lines (the header's own standing instruction, and the drift that bit `0136` R5).

⛔ Nothing else. No `package.json`, no `VERSION`, nothing under `ai-agents/wiki-vault/`, no commit, no push, no task-file move.

## Test plan

**Fixture shape** (`test/release-summary.test.js`, zero devDeps, `node --test` + `node:assert/strict`):

- `mkdtemp` → `origin.git` (`git init --bare`) + `repo` (`git init -b main`), remote `origin` = the local bare path.
- Local git config in the fixture only: `user.name`/`user.email`, `commit.gpgsign=false`, `tag.gpgsign=false` (a maintainer machine with signing on would otherwise hang or fail).
- `VERSION` = `0.1.0`, `package.json` = `{"version":"0.1.0"}`, one content file; commit; push main.
- **Copy the release script to `<fixture>/bin/release.mjs`.** That is the whole seam: `KIT = resolve(__dirname, "..")`, so the copy operates on the fixture and **can never reach the real repo**. Source path is `process.env.FKIT_RELEASE_MJS || join(REPO, 'bin', 'release.mjs')`, with the `update-banner.test.js` convention of a loud stderr notice when it is non-default.
- **Two hard seals, asserted not assumed:** (a) the helper refuses to run unless `git remote get-url origin` resolves inside the tmp dir — the brief's "never push to `flashist/fkit`" made structural; (b) the helper hard-codes `--no-test` and asserts it is present in argv — without it `release.mjs` runs `npm test`, which runs this file, which runs `npm test`. **That recursion would be unbounded**, so it gets an assertion, not a comment.
- Where a test **executes a printed command**, it extracts the line from stdout and refuses to run anything not starting with `git ls-remote` or `git rev-parse` — read-only verbs only.

**Named assertions** (greppable `0288/…`, matching prove-red's `grep -Eq '(✖|not ok|fail).*<name>'`):

| name | asserts |
|---|---|
| `0288/default-released` | `✓ Released v0.1.1` present; a verify line present; **the printed command, executed, exits 0** |
| `0288/no-tag` | no `✓ Released`, no tag-verify instruction, states no tag was created — **and `origin/main` did move** (the publishing case R1's reviewer missed) |
| `0288/no-push` | no `✓ Released`; states nothing was pushed; `origin/main` unmoved |
| `0288/stale-origin-tag` | R2 setup (annotated tag on origin at commit A, new commit B, `--no-bump`): no bare `✓ Released`; the peel command printed; **executed, it returns A ≠ `git rev-parse HEAD`** |
| `0288/local-only-tag` | N1 setup: no `✓ Released`; states the tag was not pushed; **and `git ls-remote --tags origin <tag>` is still empty afterwards** — proof the fix did not start pushing tags (the fence, tested) |
| `0288/failure-speaks` | take the default run's printed command, delete the tag from the fixture's origin, re-run it: **output non-empty on stdout+stderr, status non-zero** |
| `0288/dry-run` | dry-run text unchanged; no tag created; `VERSION` unmodified |

**Mutations — five (18–22), one per defect plus one for the must-not-regress line.** Each is a *plausible wrong implementation*, each targets a distinct branch so it reds exactly one named assertion, and each carries the `cmp -s "$f" "$f.orig"` no-op guard the neighbouring mutations use (ADR-026 Decision 5's gap is open in general; the local convention closes it per-mutation, and a `sed` against `.mjs` is the same technique as against `.sh`).

| # | mutation | must red |
|---|---|---|
| 18 | make the `!doTag` summary branch unreachable so `--no-tag` falls back to the released headline | `0288/no-tag` |
| 19 | replace `tagOnOrigin` with the naive `doTag && doPush` guard the brief warns about | `0288/local-only-tag` |
| 20 | replace the peel-vs-HEAD comparison with the plain existence check | `0288/stale-origin-tag` |
| 21 | strip the `\|\| { echo …; false; }` tail from the verify command | `0288/failure-speaks` |
| 22 | make the `✓ Released` headline condition unreachable | `0288/default-released` |

**Why five and not fewer:** each of the four defects needs its own proof that its assertion is load-bearing, and a single "revert the whole block" mutation would red several assertions at once — the header's own thesis is red-at-the-named-assertion, not red-somewhere. **Why not more:** `0288/no-push` and `0288/dry-run` assert *absence of change*; the only mutation that reds them is the same whole-block revert, which proves less than 18–22 already do. Mutation 22 exists because "the default path must not regress" is the loudest constraint in the brief and deserves a mutant, not just an assertion. Note mutations 18–21 all leave `0288/default-released` **green** — that isolation is itself evidence the default branch is independent.

Also added: an unmutated-copy baseline run (`0r`), the step-0b role — it certifies a later red isolates to the mutation rather than to a broken fixture.

## Risks / what could regress

- **⚠️ The default path's printed text.** This is the sharpest risk and it is a genuine conflict in the brief, not an oversight of mine — see **OQ1**. Under my recommendation the default headline `✓ Released vX.Y.Z` is **byte-identical**, and the verify command's **success behaviour is byte-identical** (git prints the sha, exit 0); what changes is the failure branch appended to the line. Proof: `0288/default-released` executes the printed command in the fixture and requires exit 0, and the build pastes the real default run's output verbatim into the worklog with `$?` shown. **If the owner picks OQ1(B) the printed line is untouched and this risk disappears.**
- **Exit-status semantics.** Today: 0 / 2 / 128. Mine: 0 / 1 / 1, with the true git code **printed** in the message and git's `fatal:` still on stderr. A reviewer will (rightly) ask whether that loses information; the answer is no, it relocates it from `$?` to the visible output while keeping `$?` usable as pass/fail. ⛔ It does **not** presume the codes were ambiguous.
- **`refs/tags/<tag>^{}` behaviour is measured on git 2.50.1 only** (macOS). Build must re-measure on the fixture, including the **lightweight-tag** case, where no `^{}` ref exists and the peel command exits 2 — a pre-existing tag someone else made lightweight would render as "missing". `release.mjs` only ever creates annotated tags (`tag -a`), so this affects foreign tags only; if the build finds it confusing, the printed prose gains one clause. **Flag, not assume.**
- **Printing `git push origin …` as a recovery hint** advises an action the ruling declined to automate. Text-only, inside the fence, and "say plainly it did not [push]" reads as licensing it — but it is a judgment call: **OQ2**.
- **Suite runtime.** Six release-suite runs (baseline + 5 mutants) × 7 fixture-building tests. Estimate **+1–2 min** on a ~6 min `npm test`, paid on every CI run and every release (CI timeout is 20 min, so headroom holds). **Estimate, not a measurement** — the build measures it and reports the real number. **OQ3.**
- **Environment assumptions in the new test:** git identity, signing config, `git init -b main` (git ≥ 2.28), `node` on PATH. All handled fixture-locally; CI is ubuntu-latest with modern git.
- **Recursion** (`release.mjs` → `npm test` → this file → …) — structurally blocked by the `--no-test` assertion above.
- **Real-repo integrity.** Every run is a throwaway clone with a local bare origin; `KIT` is the fixture by construction. Build records `HEAD`, local tag count, `VERSION`, `git status --porcelain` before and after, per the brief.
- **Not covered, and the close must say so:** the pre-existing suite still says nothing about this line (step 11 stands — satisfied by naming the new test, not by deleting it); Windows shells are not covered (the printed command is POSIX, as it already was); and N1's underlying recovery gap is **accepted, not fixed**.

**Build sequencing:** (1) reproduce N1 on **today's** code and paste it verbatim — step 12.2, and the first act, because N1 is source-confirmed and unexecuted; (2) reproduce R1/R2/R5 on today's code as the baseline; (3) edit the summary block; (4) re-run all seven paths and execute every printed command; (5) write the test; (6) extend `prove-red.sh`; (7) full `npm test`; (8) record integrity + residuals. Then hand to `@fkit-reviewer`.

## Open questions for the owner

**1. The default path's printed verify line — does it change?** The Context section says ⛔ *"Any remedy that changes what the default path prints … has failed"*; verification step 5 says *"if the default output changed at all, say so out loud and justify it."* Both cannot hold if R5 is answered on the path a real release cut runs.
- **(A) — Rec.** Apply the R5 speaking-failure form on the default path too. R5 is answered where it actually matters; the headline stays byte-identical; success behaviour (sha, exit 0) stays byte-identical; only the failure branch is new. Cost: the printed line is longer and textually different, justified out loud per step 5.
- **(B)** Keep the default line byte-identical; answer R5 only with an added explanatory line beneath it ("prints nothing and exits 2 if the tag is missing; 128 with `fatal:` if origin is unreachable"). Cost: the check itself is still silent — a partial answer to R5, and the default path still prints one extra line, so even (B) is not *literally* zero-change.
- **(C)** Byte-identical default line, no explanatory line; R5 answered only on the non-default branches. Cost: **R5 is unanswered on the only path most maintainers ever paste** — I do not recommend this.

> **OWNER ANSWER, 2026-08-14 — verbatim label: "(A) Fix R5 on the default path too (Recommended)".**
> ⛔ This is the ruling that resolves the brief's internal contradiction. **Verification step 5 governs;
> the Context ⛔ is overridden on this point.** The change must still be justified out loud per step 5.

**2. Should the summary print by-hand recovery commands** (`git push origin v0.1.0` in the N1 branch, `git push origin main && git push origin <tag>` in the `--no-push` branch)?
- **(A) — Rec.** Print them. "Say plainly that it did not push and the release is unfinished" is more useful when it says how to finish, and every printed command gets executed during verification.
- **(B)** State the situation only, print no command. Safer against the reading that the fence covers *suggesting* a push, not just performing one.

> **OWNER ANSWER, 2026-08-14 — verbatim label: "(A) Print them (Recommended)".**

**3. Accept ~+1–2 min on `npm test` / CI** for six extra prove-red suite runs (measured number reported at build time)?
- **(A) — Rec.** Accept all five mutations. `prove-red.sh` is the project's hard gate and these are its first `bin/` mutations.
- **(B)** Trim to three (18, 19, 22 — R1, N1, default), dropping the R2 and R5 mutants. Cost: `0288/stale-origin-tag` and `0288/failure-speaks` become assertions nobody has proven can fail — the exact posture ADR-026 exists to reject.

> **OWNER ANSWER, 2026-08-14 — verbatim label: "(A) Accept all five (Recommended)".**

⛔ Not re-raised, because both are owner-ruled: test coverage is authorized ((a) add a test + extend `prove-red.sh`), and N1's fence stays closed (report truthfully only).

**Note on procedure:** I followed `/fkit-plan-task`. `EnterPlanMode` is not in a spawned consult's toolset, so I used the skill's documented prose-contract fallback; nothing was written — no source, no test, no `plan.md`.
