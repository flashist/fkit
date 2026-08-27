# Plan — 0204: `PreToolUse`/`Task` carry-check hook + tests + `unverified` marker removal

> Approved by the owner via `AskUserQuestion` in a live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-25. Written by the driver at approval, before the Build spawn (ADR-020). Rulings on Q1–Q4 are appended at the end.

## 1. Steps and files

### Step 0 — re-verify coordinates before any edit
- `ls ai-agents/tasks/done | grep -E '^0202|^0223'` — both present (checked 2026-08-25). If `0223` were still open, stop: the board rules "0223 before 0204".
- `grep -n -i 'unverified\|0204' claude/skills/fkit-sprint-ship-loop/SKILL.md` — re-derive the marker sites from the live file (see Step 4). Do not work from the line numbers below; they are a snapshot.
- `git status` clean except the two board/brief files the driver already touched.

### Step 1 — the hook (two files, CREATE)
**`claude/carry-check-hook.sh`** — bash wrapper, same registration form as the siblings (`bash "<path>"`, ADR-017 rule 2), `set -u`, no stdin consumption:
- `here="$(cd "$(dirname "$0")" && pwd)"`; if `command -v node` fails → **allow** (exit 0, empty stdout) with one loud stderr line `carry-check-hook: node not found — carry check SKIPPED (fail-open)` (policy: Q3).
- else `exec node "$here/carry-check-hook.mjs"` — stdin passes through untouched. Resolving the `.mjs` beside itself is what lets prove-red point `FKIT_CARRY_CHECK_HOOK` at a mutant *copy* of `claude/` and have the copy's `.mjs` exercised (same trick as `skill-ownership-hook.sh` sourcing `skills-for-role.sh`).

**`claude/carry-check-hook.mjs`** — the check, node built-ins only (`fs`, `path`, `crypto`); no `package.json` change (ADR-014).

Header comment must state, in this order: what it checks (carry-fidelity **proxy** for condition (b), never (b) — green ≠ "the marker held"; (a)/(c) stay forgeable prose); **TOCTOU** (time-of-check only; `plan.md` may be rewritten after the read; must never be described as guaranteeing what the worker received); **launcher sessions only** (`.fkit/settings/<role>.json`; no `.claude/settings.json`; `settings.local.json` has no `hooks`); the **ungated limit** (a Build spawn with no pointer line at all is not seen — see semantics); the **fail-open policy** for infrastructure faults; and why the siblings' `"[^"]*"` extraction was *not* copied (caveat 4).

**Exact check semantics** (every path ends in explicit allow/deny):
1. Read all of stdin; `JSON.parse`. Parse failure → allow + stderr (Q3).
2. `tool_name` ∉ {`Task`, `Agent`} → allow (defensive; matcher already scopes).
3. `p = tool_input.prompt`; not a string → allow (nothing to check).
4. **Gate detection — pointer lines.** Scan `p` line by line for `^\s*plan:\s+(\S+/plan\.md)\s+blob\s+([0-9a-f]{7,64})\b` (the step-4 fenced form). **Zero matches → allow (ungated)** — this is how Plan/Verify/reviewer spawns and any non-sprint-loop spawn pass through. The trigger is the pointer alone, not `subagent_type` or the caller string (Q1).
5. **Degraded-form detection.** `declared = /by reference only|pointer[- ]only/i.test(p)` (literal set: Q2).
6. **For every pointer match** (all must pass):
   a. Path safety: must be relative, no `..` segment, no leading `/`; resolve against payload `cwd`; resolved path must stay under `cwd` → else **deny** `unsafe plan path`.
   b. Read file as bytes; ENOENT/EISDIR → **deny** `dangling pointer: <path> does not exist`.
   c. Compute git blob id: `sha1("blob " + byteLength + "\0" + bytes)` hex (= `git hash-object` for a SHA-1 repo; no `git` spawn). Named hash must be a prefix of it (≥7 hex; Q4) → else **deny** `hash mismatch: prompt names <named>, file is <computed>`.
   d. Paste check, **skipped only if `declared`**: `p.includes(bytes.toString('utf8'))` — the whole file, every byte, in order → else **deny** `prompt does not contain the exact bytes of <path> (truncated, re-rendered, or omitted without declaring the degraded form)`.
7. Allow: exit 0, empty stdout. Deny: stderr `carry-check-hook: DENY — <reason>` + stdout `JSON.stringify({hookSpecificOutput:{hookEventName:'PreToolUse',permissionDecision:'deny',permissionDecisionReason}})`, exit 0 — the exact route `skill-ownership-hook.sh` uses (ADR-018 D3).

Declared degraded form + hash matches → **allow**; the spawned coder's refusal under condition (b) (SKILL.md step 5) remains the mechanism there — the hook does not enforce (b), and this stays true until `0333` lands.

### Step 2 — registration (MODIFY `claude/fkit-claude.sh`, `build_settings()`)
Append a third `PreToolUse` entry to the single `hooks` string, for every role: `{"matcher":"Agent|Task","hooks":[{"type":"command","command":"bash \"$here/carry-check-hook.sh\""}]}`. Add a comment block beside the existing entries explaining it and repeating the proxy/TOCTOU/launcher-only limits in one line each. `.fkit/settings/*.json` is gitignored and regenerated each launch — **no session gets the hook until its next `fkit <role>` launch** (state this in the worklog, as `0202` did).

### Step 3 — launcher-contract test (MODIFY `test/launcher-contract.test.js`)
Group B test 8: expect **three** PreToolUse entries; add `CARRY_HOOK_SCRIPT = join(dirname(LAUNCHER), 'carry-check-hook.sh')` and find the entry by `matcher === 'Agent|Task'`, assert `command === bash "<path>"`. Matched by matcher, not index.

### Step 4 — marker removal (MODIFY `claude/skills/fkit-sprint-ship-loop/SKILL.md`) — surgical, sites re-read live
Snapshot at HEAD `493cecd` (re-derive at Build):
| Site | Where (snapshot) | Edit |
|---|---|---|
| 1 | `:194` — `— unverified — no hook checks it until 0204's carry-check hook lands` inside the fenced pointer form | delete the line; fence becomes the single `plan: … blob … (git hash-object)` line |
| 2 | `:196-197` — `⚠️ **Emit that \`unverified — …\` text every time**, naming the task… resolve "follow-up 3".` | delete the sentence |
| 3 | `:198-200` — `The hash is **self-computed and self-reported**; nothing checks it until \`0204\`'s … hook lands, and a reader must never mistake it for a checked one.` | delete the sentence (sites 2+3 together remove that whole ⚠️ paragraph) |
| 4 ⛔ | `:247-248` — `…notice a divergence —` ⏎ `and until \`0204\`'s carry-check hook lands, nothing does. **This construction` | replace ` —` + the clause with `.` → `:247` ends `notice a divergence.` and `:248` begins `**This construction`. **No re-flow, no other byte** of the "honest bound" paragraph changes. Prove with `git diff -U0` on that paragraph: exactly those two lines |
| 5 | `:201-211` — the ⛔ `**Who removes this marker, and when…**` paragraph plus its 1–5 list | delete whole, **last** |

Post-checks: `grep -n '0204' SKILL.md` → 0 hits; `grep -n -i unverified` → only the roll-up sense (*"must not carry an unverified one"*, keep); `git diff --stat` shows deletions only apart from site 4's two lines; `node --test test/skill-frontmatter.test.js` green. **No replacement sentence is added** (e.g. "checked by carry-check-hook.sh") — the carve-out is the marker sentences only; `0227`/`0333` are queued against that clause.

### Step 5 — tests (CREATE `test/carry-check-hook.test.js`)
Shape of `test/shiploop-marker-hook.test.js`: `node --test`, `spawnSync('bash', [SCRIPT])`, `FKIT_CARRY_CHECK_HOOK` seam with the stderr non-default warning, tmp `cwd` per test, `after()` cleanup. Fixture plan.md is multi-line and escape-bearing (`"`, `\`, `—`, a fenced block, trailing newline); its blob id computed **in the test** via `crypto` (independent of the hook) and, when `git` is on PATH, cross-checked against `git hash-object --stdin`. Payloads built with `JSON.stringify`. `assertDeny` pins exit 0 + parsed `permissionDecision:'deny'`; `assertAllow` pins exit 0 + empty stdout.

Tests (prove-red anchors in quotes):
1. `exact paste + matching hash -> allow`
2. **`truncated paste -> deny`** — last 40 bytes dropped, hash correct
3. `re-rendered paste (one word changed) -> deny`
4. **`named hash does not match the file -> deny`** — paste exact, hash altered
5. `pointer-only, declared degraded form, hash matches -> allow`
6. `pointer-only, declared, hash mismatch -> deny`
7. `pointer-only, NOT declared -> deny`
8. `no pointer line -> allow (ungated)`
9. `a non-Task tool -> allow`; `tool_name "Agent" is gated like "Task"`
10. `dangling pointer (file missing) -> deny`
11. `absolute or ../ plan path -> deny`
12. `escape-bearing multi-line prompt round-trips (caveat 4)`
13. `two pointers, one bad -> deny`
14. `malformed JSON payload -> allow + stderr` (per Q3)
15. `hash prefix (>=7 hex) accepted` (per Q4)

### Step 6 — prove-red (MODIFY `test/prove-red.sh`)
- Add `run_carry_check_suite()` (seam `FKIT_CARRY_CHECK_HOOK`, same shape as `run_shiploop_marker_suite`).
- **Mutation 23**: in a `make_claude_copy` tree, `sed` the copied `.mjs` paste check to always-true → `truncated paste -> deny` must go red.
- **Mutation 24**: neuter the hash comparison → `named hash does not match the file -> deny` red, while `truncated paste` stays green (isolation).
- Update the index header `TWENTY-TWO` → `TWENTY-FOUR` and the list.

### Step 7 — worklog + verification
`worklog.md` (Build worker writes): the five caveats in substance; site-by-site diff evidence for Step 4; test counts; prove-red result; the relaunch note; decision log (`none` if none). Verification per the brief's 7 steps: `grep -n '"\[^"\]\*"' claude/carry-check-hook.*` → 0 hits; `git diff package.json` empty; `npm test` with counts; `git status` confined to `claude/` + `test/`.

Not touched: `claude/fkit-claude-init.sh`, `claude/README.md` (candidate follow-up), `fkit-coder.md`, condition (b), `wiki-vault/`.

## 2. Edge cases / failure modes
- **Trailing newline.** `includes()` is strict; a driver that trims the final `\n` is denied. Documented; re-spawn is cheap.
- **Two-legged only by pointer.** A Build spawn that omits the pointer entirely is invisible to the hook. Stated as a limit; fixing it needs a machine-readable step marker in the driver's rule text — out of scope.
- **Prompt quoting the SKILL.md example** (`blob c0ffee…`) — not hex, no match.
- **Pointer to another task's plan** — checked against its own file; fine.
- **SHA-256 repos** — formula is SHA-1; note only.
- **CRLF** — bytes compared as-is.
- **Large prompts** — read fully from stdin.
- **`cwd` missing** → deny (a gated spawn must be checkable).
- **Regex matcher** `Agent|Task` — hook self-checks `tool_name` so a mis-match fails safe (allow).
- **Running lead session unaffected** until relaunch.
- **Deny reason delivery** to the model undocumented; stderr is the human-visible record.
- **Concurrent editors of the same clause** — `0333` expects to re-derive the five-site list; if 0204 lands first, 0333's step 5 becomes a no-op it must notice. Flag for the producer.

## 3. The five caveats — how each is honored
1. **Proxy, never (b).** Header, deny/allow wording, tests and worklog all say: green = "prompt contains the bytes of the file at P with hash H"; approval is unreachable (ADR-021); a green check does not mean the marker held.
2. **Hard-gated on 0202.** Verified discharged. A missing `plan.md` is a loud deny, never a silent pass.
3. **TOCTOU.** Read at spawn time only; never described as guaranteeing what the worker received.
4. **Real JSON parsing.** Node `JSON.parse`; the sibling `"[^"]*"` extractor explicitly not copied; test 12 is the escape-bearing round-trip; no devDep.
5. **Launcher sessions only.** Registered via `build_settings()` into `.fkit/settings/<role>.json`; re-verified: no `.claude/settings.json`, `settings.local.json` has no `hooks`.

## 4. Provenance caveat (coder's correction, before approval)
The `tool_input` field names (`description`, `prompt`, `subagent_type`) come from the Agent tool's own input schema, **not** from the hooks documentation; the `Agent|Task` matcher pairing is a robustness choice, not doc-confirmed. **Build must confirm both** against the docs or a one-off payload dump in a launcher session before relying on them; plan step 3 fails safe (allow) if `tool_input.prompt` is absent.

## 5. Owner rulings — `AskUserQuestion`, live `fkit lead` session, 2026-08-25 (verbatim option labels)
- **Plan gate:** "Approve".
- **Q1 (gate trigger):** "Pointer line alone (Recommended)" — presence of a `plan: … blob <hash>` line is the checkable claim; not `subagent_type`, not the caller string.
- **Q2 (degraded-form literal):** "Existing words (Recommended)" — recognise `by reference only` / `pointer only` / `pointer-only`, case-insensitive; no rule-text edit.
- **Q3 (infrastructure faults):** "Fail open + loud stderr (Recommended)" — `node` missing or unparseable payload → allow, one loud stderr line; recorded as a limit.
- **Q4 (hash strictness):** "Prefix, ≥7 hex (Recommended)" — named hash must be a prefix of the computed blob id, at least 7 hex chars.
