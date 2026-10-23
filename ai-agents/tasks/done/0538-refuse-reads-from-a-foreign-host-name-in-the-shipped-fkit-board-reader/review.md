# Review — 0538

Task: ai-agents/tasks/done/0538-refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader/brief.md
File(s) under review: bin/fkit-board.mjs, docs/board.md, CHANGELOG.md, CONTRIBUTING.md, test/board-reader-host.test.js (new, untracked) — working tree vs HEAD
Status: closed-out
Coverage: reasoning-only second opinion — Codex ran (codex-cli 0.157.1, exit 0) and returned "no significant issues found"; it ran `node -e` checks of `node:net` `isIPv4`/`isIPv6` (library behaviour, not the changed reader) and its attempt to run a server was denied by the sandbox (`EPERM` on listen), so it measured nothing on the change. Round 1's execution evidence is the Claude reviewer's: red/green of the new test in a `git archive HEAD` copy, and a bounded edge-case probe of the HEAD and changed readers.

> ⚠️ Disclosure limit (ADR-049) applies to this ledger: the class only — no payloads, no reproduction steps.
> Out of scope per the caller (2026-10-23): the reader's IPv4-only `127.0.0.1` bind; `board/` server reads (`0539`).

## Reviewer findings
| #  | Round | Sev  | Location | Claim |
|----|-------|------|----------|-------|

Round 1 (2026-10-23): **no novel defects.** Both passes clean after verification. One follow-up note
(not a defect, no row): `0467`'s brief (retire the reader) does not yet say it must also delete
`test/board-reader-host.test.js` and `CONTRIBUTING.md` *Test rules* item 4 — the knock-on `plan.md`
§ *open_questions* Q1-A names (*"when 0467 retires the reader, it must delete this test too"*).
Self-revealing if missed (the test would fail on a missing file), so a producer note, not a fix here.
Owner check still open: brief § *Verification steps* — *"`fkit board` in a real project opens the page
in the browser and the board renders"* (agents may not open a browser).

**Validation gate met (2026-10-23).** Owner's result, typed verbatim in the `fkit-lead` session
2026-10-23, relayed by `fkit-lead`: *"The page looks good"* — after running the reader from this
checkout (`bash claude/fkit-claude.sh board`) in his browser. Round 1 had no findings and nothing is
open, so the ledger is set to `Status: closed-out` (reviewer, phase 2, on that relay). The `0467`
follow-up note above is a producer note, not an open finding.

## Coder response
| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|

## Accepted residuals (shared, do-not-re-litigate)
- No-Host answer — What: HTTP/1.1 with no `Host` gets Node's own 400 (before the handler); HTTP/1.0 with no `Host` gets the reader's 403. · Why (structural): owner ruling 2026-10-23 ("Keep Node's 400 (Recommended)", `fkit-lead` session, `AskUserQuestion`); both refuse and carry no board data; matches `board/server`; the rejected alternative (`requireHostHeader: false`) adds code for a case no browser produces. · Re-raise only if: a request with no `Host` can obtain board data.
