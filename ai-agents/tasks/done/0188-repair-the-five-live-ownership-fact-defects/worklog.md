# Worklog — 0188: Repair the five live ownership-fact defects (D1–D5)

Build step of `/fkit-sprint-ship-loop`, spawned `fkit-coder`, 2026-08-27. Plan: `plan.md`
(blob `5988236e…`, confirmed by `git hash-object` before the first edit). Owner rulings ND1–ND4 applied
as recorded in `plan.md` §4. No commit, no push, no task-file move, no `plan.md` edit, no write to
`ai-agents/wiki-vault/` or `ai-agents/knowledge-base/decisions/`, no `fkit-claude-init.sh` run.

## Baseline (before any edit)

- `git status`: the six target files clean apart from the known `claude/fkit-claude.sh` hunk at `:313+`
  (another task's); `claude/scaffold/` clean.
- `node bin/generate-structure-manifest.mjs --stdout | cmp - claude/structure-manifest.tsv` → fresh.
- `node --test test/*.test.js` → **774 pass, 0 fail, 24 suites**.

## Re-measured coordinates (brief verification 8) — every site opened, 2026-08-27

| Defect | Site (today) | Matches the plan's 2026-08-26 snapshot? |
|---|---|---|
| D1 | `claude/scaffold/CLAUDE.md:23` producer row; `skills_for_role producer` → `fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-initiate-project fkit-task-brief fkit-task-done fkit-task-cancelled fkit-status fkit-heal` | Same set as the row's six role-owned skills; order differs (deliberate, 0250 §1d). **No edit.** |
| D2 | `architecture.md:145-146`; `fkit-team/SKILL.md:48`; `claude/scaffold/CLAUDE.md:50` | Yes — all three quoted sentences present verbatim. |
| D2 banner enumeration | 26 files under `claude/skills/*/SKILL.md`; `> ## ⛔ Owner:` present in 24 (lines 11–15); **absent in `fkit-query` and `fkit-team`** — both opened by eye, not only grepped | Yes. |
| D3 | `skills_for_role() {` at `claude/skills-for-role.sh:48` before this task's edits; `architecture.md:160-161` cited `:35` | Yes, before edit. **Moved to `:51` by this task's own D4 edit** — see decision log 1. |
| D3 add-on (ND4) | `claude/skills/fkit-review/SKILL.md` banner at `:12`; `architecture.md:145` cited `:8` | Yes. |
| D4 | `claude/skills-for-role.sh:12-23` and `claude/fkit-claude.sh:259-270`; `diff` of the two 12-line ranges empty before edit | Yes. Hook-test mirror comment now at `test/skill-ownership-hook.test.js:290` (`MIRROR of skills_for_role()`), `OWNED` at `:317` — the plan's `:289-292` had drifted by a few lines; the sixth mirror (`fkit-claude-init.sh:1011-1013`, *"kept in step by hand … nothing tests that they agree"*) unchanged. |
| D5 | root `CLAUDE.md:32` ("turned off, invisible and unrunnable"), outside the rules block (`:47-98`) | Yes. |
| ND1 sites | root `README.md:76-77` ("invisible and unrunnable"); root `CLAUDE.md:39-42`, `README.md:81-83`, `PROJECT.md:51-52`, `PROJECT.md:93-96` ("advisory" in a consult); `fkit-claude-init.sh:1014` | Yes, all quoted text present verbatim. |
| ADR-018 §Decision 5 | `adr-018:104-113` — visible-in-menu, denied on invocation, **Accepted** | Yes; not edited. |

No test pins any of the old wording (`grep` over `test/`, `bin/`, `claude/*.sh|*.mjs` for each before-string:
no hits). The only hits for the old line numbers are frozen fixtures under `test/fixtures/closed-rank-0174-*.md`
— historical records, left alone.

## Edits made (in plan order)

### D2 — choice: correct the three sentences; add no banner

Reason (as ruled in the plan): the banner means *"the one role allowed to execute it"*; a banner on a
universal skill would name no owner and give the marker two meanings. ADR-036 clause 4 makes `⛔ Owner:`
a tripwire trigger — two "owner: everyone" banners would be two non-fact hits. `0226` and the `everyone`
row in `architecture.md` already treat both as universal-by-design. Correcting the docs makes them true
by describing the design; adding banners would make them true by changing it. Applied to all three
sentences, not half of each. No "24 of 26" count introduced.

1. `ai-agents/knowledge-base/architecture.md:145-147`
   - before: `` Only `fkit-query` carries no banner — it is universal by design. ``
   - after: `` Only the two universal skills — `fkit-query` and `fkit-team` — carry no banner; both are universal by design (the `everyone` row below). ``
2. `claude/skills/fkit-team/SKILL.md:48-49`
   - before: `` The `⛔ Owner:` banner at the top of every skill is now a courtesy … ``
   - after: `` The `⛔ Owner:` banner at the top of every role-owned skill (this one and `/fkit-query` carry none — they are universal) is now a courtesy … ``
3. `claude/scaffold/CLAUDE.md:50-51`
   - before: `` The `⛔ Owner:` banner on each skill is a courtesy ``
   - after: `` The `⛔ Owner:` banner on each role-owned skill is a courtesy ``
   - then `npm run generate:manifest` → `claude/structure-manifest.tsv` **+1 row** (`2e31f0dd… CLAUDE.md`), old row kept (append-only). `git diff --stat` = `1 insertion(+)`.

### D3 (+ ND2, ND4)

`ai-agents/knowledge-base/architecture.md`
- `:145`: `` `claude/skills/fkit-review/SKILL.md:8` `` → `` `claude/skills/fkit-review/SKILL.md:12` `` (ND4).
- `:161-162`: `` `claude/skills-for-role.sh:35`.** `` → `` `claude/skills-for-role.sh:51` — `skills_for_role() {`.** `` (ND2 form: line + fragment). `:51`, not the plan's `:48` — decision log 1.

### D4 — both copies, byte-identical

Replaced the 12-line block at `claude/skills-for-role.sh:12-23` and `claude/fkit-claude.sh:259-270` with
the plan's block verbatim (FOUR → SIX; two bullets added — the hook test's `OWNED` and init's printed
roster; "fifth" → "another" + the dated parenthetical, ND3). `"Task 70"` byte-identical. The
`fkit-claude.sh` tail (*"This has already bitten once: task 14…"*, now `:274-278`) untouched.

- The approved block is **15 lines** (the init bullet wraps to a second line), so the ranges are
  `12-26` / `259-273`, not the plan's `12-25` / `259-272` — decision log 2.
- `diff <(sed -n 12,26p claude/skills-for-role.sh) <(sed -n 259,273p claude/fkit-claude.sh)` → empty.
- `bash -n` both scripts → OK.
- `skills_for_role` for all 8 arguments (7 roles + `nosuchrole`) captured before and after → `cmp` identical.
- All six named mirrors exist on disk (`ls`).

### D5

Root `CLAUDE.md:31-33`
- before: `` every other fkit skill is turned off, invisible and unrunnable. That is what makes ``
- after: `` every other fkit skill is denied on invocation: still visible in the `/` menu, but unrunnable (ADR-018 §Decision 5, an accepted cost). That is what makes ``
- ADR-010 link on the line above untouched. ADR-018 not edited.

### ND1 — the five extra sites, same wording discipline (ADR-018; visibility per §Decision 5; no ADR edit)

1. Root `README.md:75-78` (D5 twin)
   - before: `` every other fkit skill is turned off: invisible and unrunnable, not merely discouraged. That is what makes reviewer independence a fact rather than a promise. ``
   - after: `` every other fkit skill is denied on invocation: still visible in the `/` menu, but unrunnable, not merely discouraged (ADR-018 §Decision 5, an accepted cost). That is what makes reviewer independence a fact rather than a promise. ``
2. Root `CLAUDE.md:39-45`
   - before: `` ⚠️ **The lock is a wall in a session, a rule in a consult.** A *spawned* consult inherits the **calling** session's skill settings, not its own — so the skill boundary there is advisory, carried by each skill's `⛔ Owner:` banner. See [`ADR-012`](…). ``
   - after: `` ⚠️ **The lock is a wall in a session and in a consult alike.** A `PreToolUse` skill-ownership hook checks the REAL invoking agent's identity — a session's own role, or a spawned subagent's own role, at any consult depth — against `skills_for_role()` on every `Skill` call, and denies what that role does not own. Each skill's `⛔ Owner:` banner is a courtesy, not the enforcement. See [`ADR-018`](…), which superseded the "advisory in a consult" half of [`ADR-012`](…). ``
   - Wording mirrors the live `fkit-team/SKILL.md:39-44` and `claude/README.md:56-63`. Outside the rules block; the init refresh will not revert it.
3. Root `README.md:80-85`
   - before: `` Note that a **consult** inherits the calling session's skill settings, so there the role boundary is advisory rather than enforced — see [ADR-012](…). ``
   - after: `` A **consult** is gated the same way: a `PreToolUse` hook checks the spawned agent's own role on every skill call, at any depth, so the boundary is enforced there too — see [ADR-018](…), which superseded the "advisory in a consult" half of [ADR-012](…). ``
4. `ai-agents/knowledge-base/PROJECT.md:50-54`
   - before: `` (In a *spawned consult* the skill boundary is advisory rather than enforced — [`ADR-012`](…).) ``
   - after: `` (In a *spawned consult* the skill boundary is enforced too — a `PreToolUse` hook checks the spawned agent's own role at any depth, [`ADR-018`](…), superseding the "advisory in a consult" half of [`ADR-012`](…).) ``
5. `ai-agents/knowledge-base/PROJECT.md:91-100` (the "Role boundaries" bullet)
   - before (body): `` But per [`ADR-012`](…), a *spawned consult* inherits the **caller's** skill settings, so there the boundary is advisory (the `⛔ Owner:` banner). Likewise "never commit/push unprompted" and the two-hop consult cap remain prompt rules. A known, accepted limit — not a claim to overstate. ``
   - after (body): `` A *spawned consult* is gated the same way: the `PreToolUse` skill-ownership hook checks the spawned agent's own role at any depth ([`ADR-018`](…), superseding the "advisory in a consult" half of [`ADR-012`](…)); the `⛔ Owner:` banner is a courtesy, not the enforcement. But "never commit/push unprompted" and the two-hop consult cap remain prompt rules. A known, accepted limit — not a claim to overstate. ``
   - before (bullet head, `:91`): `` **Role boundaries: structural in a session, prompt-enforced in a consult.** ``
   - after: `` **Role boundaries: structural in a session and in a consult; the rest is prompt-enforced.** `` — decision log 3.
6. `claude/fkit-claude-init.sh:1014` — **left as is**, per the ruling: `'  Role-locked sessions — inside each, only its own skills exist:\n'` is the printed installer roster; "only its own skills exist" overstates (foreign skills exist in the menu, denied on invocation — ADR-018 §D5). Candidate for the producer; not edited here.

## "Also look at" — judged, not edited

- `PROJECT.md:47-48` *"every other `/fkit-*` skill is turned off"* — not shown false: the launcher's own comment (`fkit-claude.sh:245-246`) uses the same phrase, and "turned off" asserts nothing about visibility. Left.
- `ai-agents/README.md:10`, `ai-agents/tasks/README.md:18-19` — mover rule without the producer-only clause: incomplete, not false; out of scope. `tasks/README.md` is a byte-identical twin of `claude/scaffold/ai-agents/tasks/README.md` (`cmp` today), so completing it is a second scaffold edit + manifest row, and `0341` will re-touch mover prose. Suggest the producer fold it into `0341`.

## Verification (brief steps 1–8)

1. D1 — `skills_for_role producer` vs `scaffold/CLAUDE.md:23`: same six role-owned skills; order difference accepted; no edit.
2. D2 — enumeration above; `NONE:` only for `fkit-query` and `fkit-team`, both opened; the three sentences re-read true.
3. D3 — `sed -n 51p claude/skills-for-role.sh` → `skills_for_role() {`; `architecture.md` cites `:51` + fragment.
4. D4 — 15-line block `diff` empty; six mirrors exist.
5. D5 — `grep -n invisible CLAUDE.md README.md` → no hits.
6. `git status --short ai-agents/wiki-vault ai-agents/knowledge-base/decisions` → nothing.
7. `node --test test/*.test.js` → **774 pass, 0 fail, 24 suites** (run after every edit but the final `:50→:51` prose fix in `architecture.md`, which no test reads — see below). `bash test/prove-red.sh` → **hard gate PASSED**, 24 mutations each red their named assertion. `package.json` unchanged. Red-first: not applicable — prose only, no behaviour, no new test; the one test that moves (`structure-manifest` A) is exercised by the regen.
8. This worklog.

## Decision log (ADR-019 §96 / ADR-032 A4 audit obligation — unattended calls under the standing approval)

1. **D3 anchor `:48` → `:51` (location adapted, edit as approved).** The approved D4 block adds three lines above `skills_for_role()`, so the plan's `:48` — measured before D4 — is wrong the moment D4 lands. Cited the true post-edit line, paired with the fragment as ND2 requires. Mechanical, verified (`sed -n 51p`), inside the plan's intent (a correct anchor). An intermediate `:50` was written from a miscount and corrected in the same build.
2. **D4 ranges `12-25`/`259-272` → `12-26`/`259-273`.** The approved block text is 15 lines, not 14 (the init bullet wraps). Block text unchanged from the plan; only the verification ranges. Verified by `wc -l` and the empty `diff`.
3. **`PROJECT.md:91` bullet head edited alongside the ruled `:93-96` body (obvious winner within intent).** The head *"structural in a session, prompt-enforced in a consult"* is the same claim the ruled body carried; fixing the body alone would have left the bullet contradicting itself in bold. Minimal rewording, same ADR-018 discipline. Not ruled by name — flagged here for the driver.
4. **Not fixed, noted for the producer (outside the plan):** `PROJECT.md:93` still describes the session lock as *"a `skillOverrides` lockdown"* — that list was retired by ADR-018 (`claude/README.md:66-69`, `fkit-claude.sh:283`); different fact class (mechanism, not visibility/advisory), not named by any ruling. Root `README.md:75-76` still says a session pins a *"tool allowlist"* — relaxed for all but the adversarial reviewer (ADR-022); same status.

## Not part of the diff

- The gitignored `.claude/skills/fkit-team/SKILL.md` copy stays stale until the next `fkit-claude-init.sh .` refresh (not run in this task).
- `architecture.md` and `PROJECT.md` changed → `fkit-wiki` sync later.
- Frozen fixtures under `test/fixtures/closed-rank-0174-*.md` cite the old `skills-for-role.sh:12-24`/`:37` — historical, untouched.

## Process-review — Round 1 (2026-08-27)

Process-review worker of `/fkit-sprint-ship-loop`, spawned `fkit-coder`, under the plan's standing
approval (`plan.md` blob `5988236e…` re-confirmed by `git hash-object` first). Method:
`fkit-process-stateful-review` steps 0–7, no per-round owner gate; owner rulings on R2–R5 relayed live
by the driver (`AskUserQuestion`, 2026-08-27) and folded in, not re-decided. Ledger: `review.md` —
five *Coder response* rows written, one *Accepted residual* added, `Status: closed-out`. Reviewer
findings untouched.

Every finding verified against the tree before acting (no claim taken on trust): R1 `CLAUDE.md:43`,
R2 `skill-ownership-hook.sh:101-109` (non-`fkit-*` → `allow`), R3 all five sites, R4
`architecture.md:145`, R5 both `:26` / `:273`. Severity, mine: **low** for all five — prose only, no
behaviour changes hands; the two 0188-introduced ones (R1, R5) are one word / one token each.

### Before / after (R1, R3, R4, R5)

- R1 — root `CLAUDE.md:43`
  - before: `` Each skill's `⛔ Owner:` banner is a courtesy, not the enforcement. ``
  - after: `` Each role-owned skill's `⛔ Owner:` banner is a courtesy, not the enforcement. ``
- R3a — `PROJECT.md:47-49`
  - before: `` every other `/fkit-*` skill is turned off. ``
  - after: `` every other `/fkit-*` skill stays technically enabled but is denied on invocation: visible in the `/` menu, unrunnable (ADR-018 §Decision 5). ``
- R3b — `PROJECT.md:68-69`
  - before: `` generates the per-role `skillOverrides` settings that make the lockdown real, and execs ``
  - after: `` writes the per-role settings that wire the `PreToolUse` skill-ownership hook that makes the lockdown real (ADR-018), and execs `` (what `build_settings()` does today: `.fkit/settings/<role>.json` containing `{"hooks":{…}}`, `fkit-claude.sh:296`)
- R3c — `PROJECT.md:93-94`
  - before: `` a `skillOverrides` lockdown that makes every non-owned `/fkit-*` skill unrunnable (plus, ``
  - after: `` a `PreToolUse` skill-ownership hook that denies every non-owned `/fkit-*` skill on invocation, visible in the menu but unrunnable (plus, `` — the following `:96` *"gated the same way"* now names the right mechanism.
- R3d — root `README.md:75-77`
  - before: `` pins the session to that role's system prompt, tool allowlist, and **only its own `/fkit-*` skills** ``
  - after: `` pins the session to that role's system prompt and **only its own `/fkit-*` skills** (a `tools:` allowlist too, for the adversarial reviewer alone — [ADR-022](…)) `` — only `claude/agents/fkit-adversarial-reviewer.md:9` carries `tools:` today (`grep '^tools:' claude/agents/*.md`).
- R3e — `claude/fkit-claude.sh:245-247` (comment only)
  - before: `` A role session sees ONLY these; every other fkit-* skill is turned off. Non-fkit skills (the project's own, the user's own) are never touched. ``
  - after: `` A role session may RUN only these — every other fkit-* skill stays enabled (visible in the menu) but is denied on invocation (ADR-018). Non-fkit skills (the project's own, the user's own) are never touched. ``
  - kept at three lines on purpose so the D4 block does not move off `:259-273`; `bash -n` OK; the other task's hunk stays at `:316→:319` (`git diff -U0` hunk headers).
- R4 — `architecture.md:145`
  - before: `` naming the one role allowed to execute it ``
  - after: `` naming the role (or roles) allowed to execute it ``
- R5 — `claude/skills-for-role.sh:26` and `claude/fkit-claude.sh:273`, one token each
  - before: `` until 2026-08-26 `` → after: `` until 2026-08-27 ``. Range `diff` (`12,26` / `259,273`) empty after.
- R2 — no edit; residual recorded in `review.md`.

### R3 (extension, owner-ruled) — the two extra "tool allowlist" sites, 2026-08-27

Owner ruling relayed live by the driver: "Fold in now (Recommended)". Both re-measured before editing.

- `claude/fkit-claude.sh:17` (comment only, one line kept so the D4 block stays at `:259-273`)
  - before: `` #   * `--agent fkit-<role>`  — the role's system prompt and tool allowlist (harness-enforced) ``
  - after: `` #   * `--agent fkit-<role>`  — the role's system prompt (harness-enforced; plus a `tools:` allowlist for the adversarial reviewer alone, ADR-022) ``
  - `bash -n` OK; hunk headers now `@@17@@`, `@@245@@`, D4 `@@259/265/270@@`, other task `@@-316 +319@@` — untouched.
- `claude/README.md:29-31`
  - before: `` 1. **`--agent fkit-<role>`** — the role's system prompt and **tool allowlist** (harness-enforced). ``
  - after: `` 1. **`--agent fkit-<role>`** — the role's system prompt (harness-enforced) — plus, for the adversarial reviewer alone, its `tools:` allowlist ([ADR-022](../ai-agents/knowledge-base/decisions/adr-022-…)). `` (link target exists on disk)
- Sweep for `tool allowlist (harness-enforced)` / `**tool allowlist**` over `claude/`, root `README.md`, `CLAUDE.md`, `knowledge-base/*.md` → no remaining hits.

### Verification (this round)

- `skills_for_role` for 8 arguments (7 roles + `nosuchrole`) captured before and after → `cmp` identical.
- `bash -n claude/skills-for-role.sh claude/fkit-claude.sh` → OK.
- D4 range diff empty; manifest `--stdout | cmp` → fresh (no scaffold file touched this round, confirmed).
- `node --test test/*.test.js` → **774 pass, 0 fail, 24 suites**.
- `bash test/prove-red.sh` → **hard gate PASSED**, 24 mutations each red their named assertion.
- `grep` sweep over the nine target files for `skillOverrides|turned off|invisible|the one role|2026-08-26`: only historical "retired" mentions remain (`fkit-claude.sh:286`, `architecture.md:207,239`, `fkit-team/SKILL.md:48` "not invisible-and-blocked") — all true statements.
- No test pinned any before-string (`grep` over `test/`, `bin/`, `claude/*.sh|*.mjs`).

### Decision log — Process-review round 1 (ADR-019 §96 / ADR-032 A4)

1. **R1 applied without asking.** Verified CORRECT (line 43 read), one-word, localized, in-plan (ND1 site this task rewrote; D2 wording discipline). Mechanical.
2. **R3/R4/R5 applied under the owner's live rulings** (relayed by the driver, 2026-08-27) — not unattended calls; each site re-measured before editing. R5 is a plan deviation (`plan.md` §ND3 text says `2026-08-26`), owner-ruled, `plan.md` untouched.
3. **R3e line count (obvious winner within intent).** The comment fix could have run to four lines; three keeps every D4 coordinate in `review.md`/this worklog true. No wording lost.
4. **Not fixed, same class as R3 "tool allowlist", not named by the finding or the ruling:** `claude/fkit-claude.sh:17` (*"the role's system prompt and tool allowlist (harness-enforced)"*) and `claude/README.md:29` (same phrase). True for the adversarial reviewer only (ADR-022). Left for the driver — outside the named sites.
5. `fkit-claude-init.sh:1014` still left as ruled (ND1).
6. **R3 extension applied under the owner's live ruling** ("Fold in now", 2026-08-27) — not an unattended call. `fkit-claude.sh:17` kept to one line (obvious winner within intent) so every D4 coordinate stays true. Decision-log line 4 above is superseded by this entry.
