# Review — 0247

Task: ai-agents/tasks/done/0247-add-the-launch-time-structure-notice-and-intent-file-suppression/brief.md
File(s) under review: claude/fkit-claude.sh (structure_notice), claude/skills/fkit-heal/SKILL.md (§ launch-time notice), test/structure-notice.test.js, test/prove-red.sh (mutation 15 + make_claude_copy restructure), test/dual-home-parity-exceptions.mjs, ai-agents/.fkit-accepted-drift
Status: closed-out

## Reviewer findings
| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | claude/fkit-claude.sh:441–478 | Invalid non-UTF-8 bytes in a readable intent file (e.g. a Latin-1-encoded comment) crash macOS `/usr/bin/awk` ("towc: multibyte conversion failure", exit 2) inside the filter; the `|| return 0` then silences the ENTIRE notice — inverting the documented failure direction into hidden drift — and awk's multi-line error text leaks to the launcher's stderr uncaptured (awk stderr is not redirected). Verified by execution. Launch itself stays non-fatal. |
| R2 | 1     | low    | claude/fkit-claude.sh:451 vs claude/skills/fkit-heal/check.sh:197 | Intent parser is not "carried verbatim" from the keep-out parser on CR handling: keep-out does `tr -d '\r'` (all CRs), the intent awk does one `sub(/\r$/)` (one trailing CR). An entry with embedded/doubled CRs fails to suppress where the keep-out template would. Fails in the SAFE direction (extra notice line, never hidden drift); the comment block's "carried verbatim" claim is slightly overstated. |

**Round 2 — reviewer verification (2026-08-07, owner-ruled "Fix both now"):** both fixes verified
against the code and by independent execution.
- R1 VERIFIED FIXED: Latin-1 probe re-run against the fixed chain — `LC_ALL=C` awk, bad-bytes intent
  file + valid entry: rc 0, zero stderr bytes, valid suppression STILL honored (only the unsuppressed
  path noticed). Retry path independently forced (first invocation made to fail): notice prints with
  suppression dropped — a filter failure drops suppression, never the notice, as the updated contract
  comment states. `set -eu` safety of the new `|| … || sn_line=""` chain is structural (terminal
  assignment cannot fail).
- R2 VERIFIED FIXED: `gsub(/\r/)` aligns with keep-out's `tr -d '\r'`; comment wording corrected in
  both the launcher block and its parser bullet.
- Pinning tests confirmed real (launcher-level, assert the exact defect properties incl. stderr clean
  of awk noise); suite re-run by the reviewer: 14/14. prove-red mutation 15's sed target line
  `structure_notice || :` byte-intact (fkit-claude.sh:488).
- Double-failure branch (`sn_line=""` after the have=0 retry also fails): ACCEPTED AS INSPECTED, no
  test required. Reachable in practice only when awk itself is broken/absent — in which case check.sh
  (awk-dependent) exits 2 upstream and the earlier guard silences first; the branch's entire behavior
  surface is "silent, non-fatal", and forcing it would need an awk stub that breaks the filter but
  not check.sh in the same fixture — same binary, same PATH, not achievable without contorting the
  fixture into proving nothing.

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Fixed (owner-ruled "Fix both now", 2026-08-07). Re-reproduced by execution: `/usr/bin/awk` under a UTF-8 locale dies on a Latin-1 comment ("towc: multibyte conversion failure", exit 2), and the old `\|\| return 0` silenced the whole notice — hidden drift — with awk's error text leaking to stderr. Fix in `claude/fkit-claude.sh`: the filter runs under `LC_ALL=C` with `2>/dev/null`; a filter failure now retries with suppression disabled (`have=0`) before giving up — a parser failure drops SUPPRESSION, never the notice. Contract comment updated to state the direction. Pinned by new test "R1: latin-1 bytes in the intent file" (red pre-fix at both the notice-count and stderr-clean assertions; green post-fix). | fixed |
| R2 | CORRECT | Defect | Fixed (same ruling). Confirmed against `check.sh:197`: keep-out does `tr -d '\r'` (all CRs); the intent awk did `sub(/\r$/)` (one trailing CR). One-word alignment: `sub(/\r$/, "", l)` → `gsub(/\r/, "", l)`; comment block's "CRLF trim" wording corrected to "ALL CRs stripped". Pinned by new test "R2: CR handling matches the keep-out template" (doubled trailing CR + embedded CR both suppress; red pre-fix, green post-fix). Safe-direction pre-fix, as the reviewer said. | fixed |

Round-1 verification: red-first probes recorded (both new tests red at the expected assertions before
the fix, green after). `node --test test/structure-notice.test.js` 14/14; full unit suite 682/682;
`bash test/prove-red.sh` hard gate PASSED (re-run because the launcher — the mutation surface for
mutations 14/15 — was edited; mutation 15's target line is byte-unchanged). Write-action grep over the
launcher diff: clean. The `have=0` retry branch itself is code-inspected, not test-forced — making awk
fail post-`LC_ALL=C` requires stubbing awk, which would break check.sh in the same fixture.

## Accepted residuals (shared, do-not-re-litigate)
- launch cost ~330ms — What: the notice pass runs check.sh every launch, ≈330ms marginal on this repo's fixture (plan heuristic was ≤~250ms) · Why (structural): reuse-check.sh is the plan-approved architecture (no drift, inherited read-only proof); the dominant cost is check.sh's subprocess fan-out and check.sh is zero-edit by plan; owner accepted the number via AskUserQuestion, live lead session 2026-08-07 (worklog D4) · Re-raise only if: the marginal cost grows materially (e.g. spec-row growth pushes it well past this accepted order) or a launch-latency complaint is actually reported.
