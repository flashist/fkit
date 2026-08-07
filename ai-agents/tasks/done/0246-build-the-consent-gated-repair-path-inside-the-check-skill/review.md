# Review — 0246

Task: ai-agents/tasks/backlog/0246-build-the-consent-gated-repair-path-inside-the-check-skill/brief.md
File(s) under review: claude/skills/fkit-heal/repair.sh (NEW — the propose/apply write engine),
claude/skills/fkit-heal/check.sh (EDIT — 0245-residual fixes R1/R3/R5/R6/R8 + header),
claude/skills/fkit-heal/SKILL.md (REWRITE — consent orchestration),
test/structure-check.test.js (EDIT, 24→28), test/structure-repair.test.js (NEW, 16)
(context: plan.md + 2 owner rulings, brief.md, worklog.md, ADR-039, 0245 review.md residuals)
Status: closed-out

*Round 1 (2026-08-07). Reviewers run: fkit-reviewer own pass + Codex adversarial pass
(`codex exec --sandbox read-only`, codex-cli 0.145.0) — full coverage, both completed. Every row
was verified against the code; R1 and R2 were additionally REPRODUCED LIVE in scratchpad fixture
projects (never the repo): R1 via a deterministic read-injection probe standing in for the race
timing (apply wrote tampered bytes, flagged only post-write), R2 via a real hardlink
(`wiki-vault/index.md` content silently rewritten, apply rc 0, announced `applied`). Both suites
re-run under my own hand: structure-repair 16/16, structure-check 28/28. Codex #1 (critical) and
#2/#4/#5 (high) were re-derived to the severities below — the racing "attacker" in #1/#2 is a
same-privilege local process inside the owner's own project during an interactive run, which can
already write everything the race reaches, so no privilege boundary is crossed; the hardlink case
(#4/R2) keeps med because the write is fkit's own and ADR-005 binds fkit's writes regardless of
who created the state. Codex respected the primed settled residuals; #7's re-raise of the
accepted no-atomic-write frontier is LEGITIMATE (its recorded "re-raise only if the failure is
SILENT" condition is met on the interrupt path) — not suppressed.*

*Round 2 (reviewer re-verify, 2026-08-07): every applied fix verified in code AND both Round-1
live probes RE-RUN against the fixed script — both now hold. **Hardlink probe (R2):** the vault
twin case now announces `refused: hardlink`, rc 1, co-linked `wiki-vault/index.md` byte-unchanged
(was: silent rewrite, rc 0). **Race probe (R1/R6):** a tampered write-buffer read now refuses
`refused: replacement-drifted` pre-write with the target byte-untouched (was: tampered bytes on
disk, flagged only post-write); an instrumented count confirms exactly TWO synthesize reads remain
and the second IS the hash-gated write buffer — no unverified read exists at any threshold. Fix
locations verified: buffer-hash gate repair.sh:438-446 (R1/R6), `refused: hardlink` via
`find -links +1` at :460 (R2), last-instant `[-L]` re-walk :456 (R3 narrowing), final pre-write
disk re-hash :464 as the last act before the redirect at :470 (R4 narrowing — ruled sequence
implemented verbatim), diff buffered + rc-gated retract with truthful `# nothing proposable`
footer :284-314 (R5), INT/TERM/HUP trap naming the in-flight path :335-348 (R7, test-pinned via
process-group SIGTERM). The four new pins (structure-repair.test.js:411,433,490,506) read sound —
R1's scenario A is guarantee-shaped and reds against the old shape. Suites re-run under my own
hand: structure-repair **20/20**, full suite **668/668**; fence pins re-verified (zero
rm/mv/unlink/rmdir tokens, exactly one `> "$root/` redirect, no mktemp/`>>`). **Both within-intent
calls judged SOUND:** (1) keeping the early freshness check (d) alongside the ruled last-instant
re-hash is strictly additive and preserves refusal-reason fidelity — verified: a root-file
marker-region edit between propose and apply changes the synthesized buffer, so without (d) it
would misannounce `replacement-drifted` (blaming the share) instead of `changed-since-propose`;
(2) factoring the (b) walk into the shared `first_symlink_component` helper is a pure refactor
that keeps the two gauntlet walks from drifting apart. **Residuals confirmed:** R3/R4 cores carry
owner ruling 2's clause verbatim ("re-raise only if repair ever runs cross-privilege or a locking
primitive becomes available"); R8's clause is sensible per ruling 4. No new findings. **Closed-out
status CONFIRMED.***

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | med | claude/skills/fkit-heal/repair.sh:369-399 | The bytes apply writes are NEVER hashed before the write: step (e) hashes one synthesis (:369), step (f) independently re-synthesizes into `repl` (:387) and writes that second, unverified buffer (:392) — a target/share change (or an rc-lost partial synthesis) between :369 and :387 writes bytes the owner never approved, detected only AFTER the file is overwritten (`error: verify-failed`, original bytes already gone). Probe-verified live. Loud, not silent — but it is the one closable gap in "apply writes only approved bytes". Fix: hash `$repl` (`printf '%s' "$repl" \| do_sha`) and compare to `$post` BEFORE opening the redirect; keep the post-write verify. [both reviewers — mine + Codex #3; probe-verified] |
| R2 | 1 | med | claude/skills/fkit-heal/repair.sh:326-341,392 | Hardlinks bypass every fence: `-L` walks and path-string checks cannot see a second dirent, and the in-place truncate-redirect preserves the inode — so a project file hardlinked to `ai-agents/wiki-vault/*` (or anywhere on the same filesystem) has the co-linked path's content rewritten by an approved apply, SILENTLY (rc 0, announced `applied`; probe-verified: vault index.md content replaced). Exotic precondition (a pre-existing hardlink inside the project), but the write is fkit's own and ADR-005 is a hard rule; the rejected temp+rename design would have broken the link instead of writing through it. Fix: refuse a multi-link target — `find "$root/$p" -maxdepth 0 -links +1` is portable — before the write. [both reviewers — mine + Codex #4; probe-verified] |
| R3 | 1 | low | claude/skills/fkit-heal/repair.sh:326-341,387-399 | Symlink-swap TOCTOU: the `-L` walk (b) runs well before the write (f); a symlink swapped in after (b) — with its target holding the prehash bytes — is written THROUGH, the post-write re-hash reads through the same link, and apply announces `applied`: a silent write outside the enumerated path. UNCLOSABLE in pure bash (no O_NOFOLLOW); the racing writer is same-privilege, so nothing is gained an attacker lacks — severity re-derived from Codex's critical to low. Narrow it: re-run the `-L` walk immediately before the redirect (after buffering), and record the irreducible core as an accepted residual. [Codex #1 + own pass; mechanism code-verified] |
| R4 | 1 | low | claude/skills/fkit-heal/repair.sh:354-392 | The freshness re-check (d) sits three synthesis reads before the write: a concurrent edit landing in the (d)→(f) window is silently clobbered with approved bytes (final hash == post, so `applied` is announced and the edit is never detected). Same-privilege race in an owner-supervised run, window ~ms — but ADR-039's "immediately before each replacement" is served better and for free by reordering: buffer `repl` first, verify it (R1's fix), THEN re-hash the disk file against `pre` as the last act before the redirect. Irreducible core (no compare-and-swap on files) → residual candidate. [Codex #2 + own pass; code-verified] |
| R5 | 1 | low | claude/skills/fkit-heal/repair.sh:270-274 | A `diff` failure (rc>1) only warns on stderr — the already-emitted item line STANDS and is approveable with no rendered diff, contradicting "diffs in view" consent (SKILL.md step 3/4). Codex's wider claim (diff generated from separate reads than pre/post, so the shown diff can mismatch the hashes) is PARTIALLY CORRECT: the race exists at propose, but apply's dual pre/post verification refuses any item whose bytes moved, so an applied-yet-wrong-diff needs a revert double-race — the load-bearing defect is the diff-failure branch. Fix: on diff rc>1, retract/exclude the item (mirror the `# excluded:` path); optionally diff from the same buffer that was hashed. [Codex #5 + own pass; code-verified] |
| R6 | 1 | low | claude/skills/fkit-heal/repair.sh:147-160,214-221,387 | Intermediate-command failures inside `synthesize` lose their rc (only the LAST command's status returns): a failed `head -c`/`emit_region` stage can yield a truncated replacement with rc 0. Mitigations already in place: a TRANSIENT partial is refused at (e) (`replacement-drifted` — hash mismatch vs the proposal), and a PERSISTENT one is visible in the consent diff the owner reads. Residual exposure is exactly R1's window (partiality arising only in the :387 buffer read) plus consent-on-a-visibly-corrupt diff. Folds into R1's fix; add explicit per-stage rc checks (or `set -o pipefail` where pipelines allow). [Codex #6; PARTIALLY CORRECT — mitigations traced] |
| R7 | 1 | low | claude/skills/fkit-heal/repair.sh (no trap anywhere; write at :392) | SIGINT/SIGTERM/SIGHUP mid-`printf` leaves a partial target file and kills the run before ANY announce line for the in-flight item — no loud error, no path named. This meets the accepted no-atomic-write residual's own recorded re-raise condition ("re-raise only if the failure is SILENT"), so it is a legitimate re-raise, not re-litigation. Fix: `trap` on INT/TERM/HUP that names the in-flight path on stderr and exits nonzero. [Codex #7; verified — no `trap` token in either script] |
| R8 | 1 | nit | test/structure-repair.test.js:246-259 | The regression fences are token-shaped, not guarantee-shaped: the grep pins only `rm\|mv\|unlink\|rmdir` and the single-write pin only the `> "$root/` spelling — `cp`, `dd`, `tee`, `ln`, `truncate`, `: >`, exec-fd redirects would all pass both. Verified: neither script contains any such token TODAY, so this is fence hardening, not a live hole (`ln` is the one that matters most, given R2). [both reviewers — Codex #8 + own pass] |

**Disproven / not recorded as rows:**
- **awk `-v` backslash mangling** (`row_outcome`/`class_of`, repair.sh:143-145,235-237): real awk
  behavior, but a backslash-bearing forged item path mangles into a NON-match → `refused:
  not-in-spec` — it fails CLOSED. Spec paths are validated, trusted input. Not a defect.
- **Consent prose**: no branch of SKILL.md reads as announce-only, stored, or manufactured consent
  (both reviewers, independently).
- **Quoting/word-splitting/glob on hostile paths, `set -u`, IFS restores, macOS bash 3.2 / BSD
  toolbox portability**: both reviewers found nothing; `set -f` + tab-parsing + full quoting hold,
  `.`-segment and case-trick paths die at `not-in-spec`.

**Suppressed as re-litigating settled decisions:** none — Codex honored the primed residuals
(trusted share, helper duplication, procedural consent, kept-out/vocabulary rulings, R4-dormant);
the one touch on a settled frontier (R7 vs the no-atomic-write choice) met that residual's
recorded re-raise condition and is recorded as a finding, not suppressed.

**Worklog audit (six decision-log entries):** all six verified in-plan; none required escalation.
(1) buffered write before redirect — verified the self-referential-truncate bug it fixes is real
(synthesize reads the marker region FROM the target) and that the fix is in-plan ("still an
in-place redirect, no temp file"); note R1 above is the residual seam of exactly this decision.
(2) eligibility via a fresh check.sh re-run — SOUND beyond-plan call: plan §6.3's forged-item test
is satisfiable only by fresh classification (a forger controls both hashes); single-sources
classification; read-only re-run, no added risk; test-pinned (forged owner-edited/malformed/vault
items all refused with the true outcome named). (3) the ~15-line spec-class parse duplicated into
repair.sh — SOUND: synthesis must know root-context vs reference class; "not under ai-agents/"
would encode an unpromised assumption; the apply→re-check-conforming bridge fixture guards both
duplications behaviorally. (4) CRLF freshness fixture — precise: hits `changed-since-propose`
without the eligibility gate masking it. (5) NUL schema.md consequence — stated, vocabulary
unchanged. (6) ` ` escapes in fixtures — good hygiene.

## Coder response

*(coder-owned — do not write here, reviewer)*

*Round 1 processed 2026-08-07 by fkit-coder (the sprint-loop Process-review worker, under the
loop's declared-approval marker). Every finding re-verified against the code; R1, R2, R5, and R7
additionally reproduced RED as deterministic fixtures against the pre-fix script before any fix
landed (recorded in worklog.md). **Owner rulings relayed verbatim** (AskUserQuestion, live lead
session, 2026-08-07): (1) R1 + R2: **"Fix now (Recommended)"** — hash the exact write buffer
against posthash pre-write; refuse `-links +1` targets (hardlink fence). (2) R3 + R4: **"Narrow +
residuals (Recommended)"** — re-`-L` immediately before the redirect; reorder buffer → verify
buffer → re-hash disk → write; record both irreducible cores as accepted residuals, clause:
"re-raise only if repair ever runs cross-privilege or a locking primitive becomes available".
(3) R5 + R7: **"Fix now (Recommended)"** — retract an item from the proposal when its diff cannot
render (consent needs the diff in view); add a signal trap announcing the in-flight path on
interrupt. (4) R6 + R8: **"R6 into R1's fix, R8 residual (Recommended)"** — R6's exposure closed
by R1's buffer-verify (say so in its row); R8 (fence tests token-shaped: cp/dd/tee/ln/`: >`
unmatched) recorded as accepted residual with a sensible re-raise clause.*

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Reproduced red (deterministic `cat`-shim read-injection: pre-fix wrote tampered bytes, `error: verify-failed` after the fact). Fixed per ruling 1: apply now synthesizes ONCE into the write buffer and hashes THAT buffer against the approved posthash before the redirect opens (`bufsha` gate replaces the old separate `synth_sha` pass); a drift/partial refuses `replacement-drifted` with nothing written. Post-write verify kept. Pinned by the R1 fixture (both scenarios: late-read tamper never lands; buffer tamper refused pre-write). | ✅ done |
| R2 | CORRECT | Defect | Reproduced red (hardlinked target: pre-fix apply rc 0, co-linked twin silently rewritten — the reviewer's probe, re-run). Fixed per ruling 1: `find "$root/$p" -maxdepth 0 -links +1` refusal (`refused: hardlink`) in the last-instant gauntlet before the write. Pinned by the R2 fixture (twin and target byte-unchanged, un-linked item still applies). Severity med agreed — ADR-005 binds fkit's own writes regardless of who created the link. | ✅ done |
| R3 | CORRECT | Defect (narrowable) + irreducible frontier core | Mechanism code-verified ((b) walk sat ~50 lines before the write). Narrowed per ruling 2: the full `[-L]` ancestor walk re-runs immediately before the redirect (shared `first_symlink_component` helper — (b)'s walk deduplicated into it, not reworded). Irreducible core (no O_NOFOLLOW in pure bash) recorded below as an accepted residual with the ruled clause. Severity low agreed (same-privilege racer). | ✅ done (+residual) |
| R4 | CORRECT | Defect (narrowable) + irreducible frontier core | Code-verified. Narrowed per ruling 2 — the ruled sequence is implemented verbatim as the final pre-write sequence: buffer → verify buffer (R1's gate) → re-hash disk vs prehash as the LAST act → write. **Deviation, stated:** the original early freshness check (d) is KEPT in addition, for refusal-reason fidelity — without it, a marker-region edit between propose and apply would hit the buffer-verify first and be announced `replacement-drifted` (blaming the share) instead of `changed-since-propose`. Strictly additive; nothing ruled was removed. Irreducible core (no file compare-and-swap) recorded below. | ✅ done (+residual) |
| R5 | CORRECT | Defect | Reproduced red (`diff`-shim rc 2: pre-fix the item line stood approveable, stderr-only warn). Fixed per ruling 3: the diff is buffered and its rc checked BEFORE the item line is emitted; rc > 1 retracts the item entirely (`# excluded: … diff failed (rc N): consent requires the diff in view`). The all-excluded case now states `# nothing proposable: N repair-eligible row(s) were all excluded` instead of falsely claiming no untouched-stale rows. The finding's optional same-buffer-diff hardening NOT taken (minimality; apply's dual verification covers the residual propose-side race, as this row itself traced). Pinned by the R5 fixture. | ✅ done |
| R6 | PARTIALLY CORRECT | Defect (folded into R1) | Verified as the reviewer traced it: the mitigations were real, the residual exposure was exactly R1's unverified-buffer window. Closed per ruling 4 **by R1's buffer-verify**: the buffer that is hashed IS the buffer written, so a lost-rc truncated synthesis hashes ≠ posthash and refuses pre-write — no separate per-stage rc checks added (ruled fold; `set -o pipefail` not introduced). | ✅ done (via R1) |
| R7 | CORRECT | Defect (legitimate re-raise — the accepted no-atomic-write residual's own "SILENT" clause was met) | Verified: no `trap` token pre-fix; red-probed (pre-fix the interrupt test's write sequence is unreachable — a signal dies silently). Fixed per ruling 3: `trap` on INT/TERM/HUP announces the in-flight path on stderr ("INTERRUPTED while applying <path> — the write may be incomplete; run check.sh …") and exits nonzero; `$inflight` spans the write sequence. Pinned by a deterministic fixture (gauntlet `find` shim + process-group SIGTERM, as a real Ctrl-C lands). | ✅ done |
| R8 | CORRECT | Frontier (fence hardening — verified no live token today) | Recorded below as an accepted residual per ruling 4, with a re-raise clause. No fence widened this round; note R2's runtime `-links` refusal now covers the ln-shaped risk at apply time, which was the token that mattered most. | won't fix (frontier) |

**Verification after fixes:** `test/structure-repair.test.js` 20/20 (16 + the 4 new pins),
`test/structure-check.test.js` 28/28, full suite `node --test test/*.test.js` **668/668** (was
664). E2e smoke re-run (guard chain changed materially): drifted fixture → propose (2 items +
2 diffs, rc 0) → apply (2 applied, rc 0) → re-check **conforming, rc 0**, both files byte-equal
to the scaffold. Fence pins (no rm/mv/unlink/rmdir; single `> "$root/` redirect; no mktemp/`>>`)
all still hold over the edited script.

## Accepted residuals (shared, do-not-re-litigate)

- **R3 core — symlink-swap TOCTOU at the write instant** — What: the `[-L]` ancestor walk re-runs
  immediately before the redirect, but a same-privilege racer swapping a symlink into the path in
  the handful of instructions between that last probe and the open is still written through, and
  the post-write re-hash reads through the same link. · Why (structural): pure bash cannot open
  with O_NOFOLLOW or verify-then-open atomically; the rejected temp+rename design would break
  hardlinks/ownership instead of closing the race; the racer is a same-privilege local process
  inside the owner's own project, which can already write everything the race reaches. · Re-raise
  only if: repair ever runs cross-privilege or a locking primitive becomes available. *(owner
  ruling 2, 2026-08-07)*
- **R4 core — freshness race at the write instant** — What: the on-disk re-hash against the
  prehash is the last act before the redirect, but a concurrent edit landing between that hash
  and the write is clobbered with the approved bytes and announced `applied` (final bytes ==
  posthash, so no gate can see it). · Why (structural): there is no compare-and-swap on files in
  bash — hash-then-write is inherently two steps; the window is now instructions wide, in an
  owner-supervised interactive run, same-privilege. · Re-raise only if: repair ever runs
  cross-privilege or a locking primitive becomes available. *(owner ruling 2, 2026-08-07)*
- **R8 — token-shaped regression fences** — What: the no-destructive-path grep pins only
  `rm|mv|unlink|rmdir` and the single-write pin only the `> "$root/` spelling; `cp`, `dd`, `tee`,
  `ln`, `truncate`, `: >`, and exec-fd redirects would pass both. Verified: neither script
  contains any such token today, and R2's runtime `-links +1` refusal covers the ln-shaped risk
  at apply time. · Why (structural): a grep fence cannot be guarantee-shaped short of a
  syscall-level audit; the guarantee-shaped layer is behavioral — the whole-tree before/after
  snapshots and the apply→re-check-conforming bridge fixtures, which fail on ANY unapproved write
  however it is spelled. · Re-raise only if: a write-capable token (`cp`/`dd`/`tee`/`ln`/
  `truncate`/a new redirect form) is introduced into either script — extend the fence in the same
  change — or the suite gains a general write-audit mechanism. *(owner ruling 4, 2026-08-07)*
