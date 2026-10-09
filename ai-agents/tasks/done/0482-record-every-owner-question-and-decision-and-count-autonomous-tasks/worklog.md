# Worklog — 0482 Record every owner question and decision, and count the tasks done autonomously after plan approval

Opened 2026-10-05 by a spawned `fkit-coder` (Process-review worker of `fkit-sprint-ship-loop`, Sprint 10),
answering review finding R8 (brief § Verification steps, Phase A step 5). This task is a gated umbrella:
**Phase A only.** No hook, script, settings, skill, agent or test was written in Phase A or in this
review round.

## Owner APPROVE of Phase B

- **2026-10-04** — Phase B **NOT approved** (owner ruling relayed by `fkit-lead`; recorded in the brief's
  2026-10-04 note). Only Phase A could run.
- **2026-10-05 — APPROVE of Phase B items 1–5** (capture; linking; the per-task line; the metric;
  privacy — as in `plan.md` § 3). **Channel:** given directly by the owner via `AskUserQuestion` in the
  `fkit-lead` session, during the Sprint 10 `/fkit-sprint-ship-loop`; relayed to this worker by the
  driver's spawn prompt (declared-approval marker). **Item 6 (historical approximate count) NOT
  approved** — it needs its own separate approval.
- The APPROVE is **not** acceptance of ADR-053. ADR-053 stays `proposed`; B0 (the owner's direct
  acceptance) blocks every one of B1–B5, including B3b.

## Owner rulings (all 2026-10-05, `AskUserQuestion` in the `fkit-lead` session, Sprint 10 ship-loop)

On the plan's open questions:
- **OQ1** — no text at all, even locally (counts, times, task ids only).
- **OQ2** — unattributed owner messages count, shown separately.
- **OQ3** — every typed message counts as involvement.
- **OQ4** — retention 30 days (not the plan's proposed 90).

Quoted text below is the owner's chosen option label or its description, word for word; everything
else is paraphrase.

On review round 1 (ledger `review.md` in this folder):
- **R2 → "Allow, with a fixed list"** (option label). Paraphrase of its description: command name and
  role are stored only if on a known list; anything else is stored as `other`. Effect: the
  closed-format labels (session_id, agent_type, event kind, command_name, answer kind) are allowed and
  are not "text" under OQ1 (this also settles R3).
- **R4 → "Each entry 30 days old"** (option label; description: "Every entry is deleted once it's 30
  days old. Matches your ruling literally."). Paraphrase of what followed from it: per entry, not per
  file by last write; the ADR says how pruning is triggered and what it cannot guarantee.

On review round 2:
- **R9 → "Accept, fix the wording"** (option label). Paraphrase: the day-file rule as designed is
  accepted — entries may be deleted up to about one day early, and expired files stay on disk until the
  next capture write or summarizer run in that project (indefinitely if it is never used again);
  readers ignore everything before W. ADR-053 D4 and the B0 plain-words line now say exactly that.
- **`expanded` (R12) → "Yes, count it"** (option label; description: "Keep the new 'expanded' event.
  Safer: no action of yours is lost from the count."). Asked after round 2, relayed in the round-3
  spawn. Paraphrase of the question: should an expansion that is not a normal slash command (e.g. an MCP
  tool's prompt) count as owner involvement, but never as proof the session was watched? Basis of
  ADR-053 D2's `expanded` kind (decision log E4).
- **Damaged log lines (R11) → "Yes, mark unknown"** (option label; description: "A damaged line might
  have been your entry, so the task isn't credited as autonomous."). Asked and relayed the same way.
  Paraphrase of the question: if a line in the local log is damaged, should any task whose window
  overlaps that day read `unknown (log-corrupt)` rather than possibly autonomous? Basis of ADR-053
  D3/D7's `log-corrupt` rule (decision log E3).

**Not owner rulings:**
- **Briefs filed after the APPROVE, before ADR acceptance; B0 blocks B1–B5** (the architect's point).
  An earlier version listed it above under review round 1 as "kept". **The owner did not rule on it**
  (corrected 2026-10-05, review round 3, R15b): the sprint driver told him it was found consistent and
  needed no answer from him, and he gave none. Basis: the reviewer and `fkit-architect` found it
  consistent with the brief's Phase-B text and `plan.md` § 4 ("filed by the producer only after
  APPROVE"). It stands unless the owner says otherwise at B0.
- R1, R5, R6, R7 — see the correction below.

⚠️ **Correction (2026-10-05, review round 2, R13a):** an earlier version of this list said
"R5–R7 — fix", and decision log D1 said R1's basis was "owner said 'fix'". **Neither was an owner
ruling.** The owner never ruled on R1, R5, R6 or R7; "fix" was the sprint driver's default, wrongly
relayed to this worker as an owner ruling (the driver's own error, which it reported). R1 and R5–R7 were
verified CORRECT and fixed as in-plan / obvious-winner fixes under the sprint loop's standing approval.

`plan.md` is approved bytes and is not edited. Its § 2 "proposed 90", § 3's "Errors from these rules can
only lower the autonomy count" and § 5 "Not given" are superseded by the rulings above and by ADR-053,
whose Status bullet says the ADR governs where it differs from `plan.md` § 3.

## How Phase A ran

- Run as the **Plan step** of `/fkit-sprint-ship-loop` (Sprint 10) by a spawned `fkit-coder`,
  read-only outside this folder, with design input from `fkit-architect` in a hop-2 consult. Neither
  had an owner channel (ADR-021). The hook experiments ran in scratch folders outside the repo and were
  deleted afterwards (see `plan.md` § 1).
- The **driver** wrote the Plan step's text to `plan.md` verbatim. Per the driver's spawn prompt:
  blob `8308b0eec4df2f2d1071a1df75d467138fe32239`, 17072 bytes. Re-checked by this worker on
  2026-10-05 with `git hash-object` and `wc -c` — both match.
- **ADR-053** (`ai-agents/knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md`)
  was drafted by `fkit-architect` in that hop-2 consult and written up by an `fkit-architect` spawned by
  `fkit-lead`, with the 2026-10-05 APPROVE and OQ1–OQ4 folded in. Status `proposed`.

## 2026-10-05 — Process review, round 1 (spawned `fkit-coder`, Process-review worker of `fkit-sprint-ship-loop`)

Findings R1–R8 verified against ADR-053, `plan.md`, the brief, `claude/shiploop-marker-hook.sh`
(`is_identifier`) and `claude/skills-for-role.sh` (`skills_for_role()`). All eight CORRECT. ADR
substance changes were agreed with `fkit-architect` (consult, hop 2 of 2; chain `fkit-lead` →
`fkit-coder` → `fkit-architect`; it wrote nothing) and applied by this worker. Ledger *Coder response*
rows and two *Accepted residuals* entries written; ledger Status left `in-review` (see decision log
D7). Files touched: `review.md`, this `worklog.md`, ADR-053. Nothing else.

### Decision log (fixes applied without per-fix owner approval, and obvious-winner calls)

- **D1 — R1: tag extraction at capture time + D5 rule (1) fall-through.** What changed: ADR-053 D2
  (`asked`/`answered` one entry per question; exactly one distinct strict `[task NNNN]` tag in the
  question's `question` field → its four digits stored as the task id; text never stored) and D5 rule
  (1) (a tagged task not bound in S counts AND the entry also falls to rule 2/3; a `command` task id is
  a bind, not a tag). Why it qualified: verified CORRECT; fixed under the sprint loop's standing approval
  (driver default, not an owner ruling — corrected in round 2, R13a); the chosen shape is an
  obvious winner within the plan's intent — it only ever adds involvement, which is the plan's stated
  direction for every linking error. Shape agreed with the architect.
- **D2 — R3 (under the owner's R2 ruling): fixed lists sourced, not copied; session_id pinned.** What
  changed: ADR-053 D1 — agent_type / command_name from `skills_for_role()` read at run time, else
  `other`; timestamp made by the hook; session_id pinned in B1, failing value → `unknown-session` (the
  entry is kept). Why it qualified: the list rule is the owner's own ruling; reading it from the one
  source is mechanical (ADR-018: one source, no seventh mirror); keeping the entry on a bad session_id
  is the obvious winner (dropping it loses involvement → over-reports autonomy). Architect's
  adjustment.
- **D3 — R4 (under the owner's R4 ruling): UTC day files, two triggers, read rule W, no stored
  watermark.** What changed: ADR-053 D3/D4 rewritten; Consequences 30-day bullet and the pruning-scan
  cost added. Why it qualified: the ruling fixed the goal (per entry, 30 days; "say the trigger" was
  the driver's relay paraphrase, not the owner's words — R13b); day files are the obvious winner within it — per-entry rewrites of live files race appends and could
  under-count involvement; the stored `pruned-before` file was dropped for the same lost-update reason
  (architect's adjustment); no launcher-start prune was added (extra launcher surface for marginal
  coverage, since any prompt triggers a prune). The not-guaranteed case is stated as the driver's relay asked (wording corrected in round 2 — R9).
- **D4 — R5: wording qualified.** What changed: ADR-053 D5 closing sentence, D7's ambiguity sentence,
  Options-considered bullet 1; residual 7 reworded and residual 8 added (both found by the architect
  while checking R5's theme). Why it qualified: verified CORRECT, mechanical, wording only.
- **D5 — R6: dead value removed, window defined.** What changed: `asked-no-answer` removed from D1;
  D5 rule (3) defines the window (anchor → summarizer run for the task). Why it qualified: verified
  CORRECT; mechanical (a) and obvious winner (b) — entries before the anchor never count anyway, and the
  latest possible end is the close run.
- **D6 — R7: count `typed` entries only; prompt_id NOT added.** What changed: ADR-053 D8 defines
  "typed messages" as the number of `typed` entries; `command` entries bind and count as involvement
  but are never added to that count; the "one low" edge is stated. Why it qualified: obvious winner — it
  needs no new stored field. ⚠️ **This departs from the driver's suggested "dedupe via prompt_id"**:
  prompt_id is not on the owner's R2 list, so adding it would have needed a new owner ruling; the
  architect proposed this no-new-field route instead.
- **D7 — ledger Status left `in-review`, not `closed-out`.** Why: every row is `✅ done`, but D2, D4,
  D5 and D8 now carry new design text the reviewer has not seen. Leaving the ledger open is the
  cheapest-to-reverse choice; the driver decides whether a round 2 runs.
- **D8 — two *Accepted residuals* entries added** (R2/R3 labels-not-text; R4 day-file retention and
  the idle-project gap). Why it qualified: both rest on the owner's own 2026-10-05 rulings, so they are
  settled tradeoffs, not agent judgments.

## 2026-10-05 — Process review, round 2 (spawned `fkit-coder`, Process-review worker of `fkit-sprint-ship-loop`)

Findings R9–R13 verified against ADR-053, this worklog, `review.md`, `claude/skills-for-role.sh`
(`skills_for_role()`, header), `claude/fkit-claude.sh` (`ROLES`, `build_settings()`) and
`claude/shiploop-marker-hook.sh` (the `expansion_type` gate). All five CORRECT. ADR substance for
R9–R12 agreed with `fkit-architect` (consult, hop 2 of 2; chain `fkit-lead` → `fkit-coder` →
`fkit-architect`; it wrote nothing). Files touched: `review.md` (*Coder response* rows R9–R13, a note
on row R4, *Accepted residuals* entry 2 amended openly), this `worklog.md`, ADR-053 (Status stays
`proposed`). Nothing else. `plan.md` not edited.

### Decision log (round 2: fixes applied without per-fix owner approval, and obvious-winner calls)

- **E1 — R9 (owner ruling "Accept, fix the wording", 2026-10-05, `AskUserQuestion`, `fkit-lead`
  session): D4 wording.** What changed: ADR-053 D4 lead line and bullets now say a day file becomes
  deletable 30 days after its day starts (some entries about a day early) and is deleted at the next
  capture write or summarizer run; in every project it stays on disk until then (typically hours to
  days; indefinitely if never used again); readers ignore everything before W; 0121 note scoped to what
  readers see. Same in this worklog's B0 / B5 / 0121 carry lines and *Accepted residuals* entry 2. Why
  it qualified: the owner ruled on this exact point; the edit is wording only.
- **E2 — R10: one route for the fixed lists.** What changed: ADR-053 D1 — the launcher builds both
  lists per launch from `$ROLES` and `skills_for_role` and passes them as hook-command arguments;
  item format, empty-list fallback (`other`, entry kept), launch-time lifetime; rejected alternative
  named. Why it qualified: verified CORRECT (the "sourced" option could not build the union without a
  hard-coded role list); the route is the one D1 already offered ("passed in by the launcher") and the
  reviewer's own direction — in-plan, mechanical. Architect's three refinements adopted.
- **E3 — R11: single-write appends, malformed lines, `unknown-session`.** What changed: ADR-053 D3
  (one complete line per single `O_APPEND` write, concurrency fixture; malformed line → no total, and
  would-be-autonomous tasks whose window overlaps that day → `unknown (log-corrupt)`); D5
  (`unknown-session` never binds, never proves liveness; tagged entries count for the tag and as
  unattributed; `plan-write` there still anchors); D7 lists the two new `unknown` cases. Why it
  qualified: verified CORRECT; obvious winner within the plan's intent — every added rule only lowers
  autonomy, no new stored field. Departs from the reviewer's "skip malformed lines" reading (skipping
  could drop an owner entry → over-report); the architect scoped it by window/day, not by session
  (a torn line may have been the bind itself). **Basis since round 3 (R15a):** the `log-corrupt` rule now
  rests on the owner's ruling "Yes, mark unknown" (2026-10-05, `AskUserQuestion`, `fkit-lead` session —
  see § Owner rulings); until then it was an agent obvious-winner call.
- **E4 — R12: expansion gate + new `expanded` kind.** What changed: ADR-053 D2 — `command` only for
  `expansion_type` = `slash_command`; any other expansion → `expanded` (involvement; never binds, never
  liveness, never in the typed count); D5 owner-entry list gains `expanded`. Why it qualified: verified
  CORRECT; obvious winner — it dominates both alternatives on the plan's own rule (errors only lower
  autonomy): "record nothing" (the reviewer's direction) loses an owner action if UserPromptSubmit does
  not fire for an MCP prompt (unmeasured; E3 covers slash commands only), and "`command` with `other`"
  could fake liveness. ⚠️ **It is a new event kind not in plan.md § 3** — no new stored field (event
  kind is already on the owner's R2 list; ADR-053 D11 allows new kinds by amendment), but it is listed
  among the B0 differences the owner sees. **Basis since round 3 (R15a):** the `expanded` kind now rests
  on the owner's ruling "Yes, count it" (2026-10-05, `AskUserQuestion`, `fkit-lead` session — see
  § Owner rulings); until then it was an agent obvious-winner call.
- **E5 — R13: owner-attribution record corrected.** What changed: (a) this worklog's § Owner rulings
  and decision log D1, and ADR-053 § Owner rulings: R1 and R5–R7 are no longer shown as owner rulings
  — they were the sprint driver's default, wrongly relayed (the driver's own error, reported in the
  round-2 spawn prompt); each was verified CORRECT and fixed under the standing approval. (b) R2 / R4 /
  R9 quotes now give only the option label or its description word for word; everything else is marked
  paraphrase; the non-owner quote in *Accepted residuals* entry 2 removed. Why it qualified: verified
  CORRECT; mechanical record correction; no owner ruling invented.
- **E6 — *Accepted residuals* entry 2 amended (not added).** The entry now rests on the owner's R9
  ruling (date, channel) instead of being provisional, and its wording matches D4. Done openly — the
  entry carries an amendment note — as the driver directed.
- **E7 — ledger Status left `in-review`.** Every round-2 row is `✅ done`, but D1, D2, D3, D4, D5 and D7
  carry new text the reviewer has not seen (the reviewer expects a light round 3). Cheapest to reverse.

### Carry into the Phase-B briefs (for the producer when filing B0–B5)

- **B0 (owner acceptance):** ask against the amended ADR text and list where it differs from
  `plan.md` § 3 — D1 fields, D2 tag extraction, D4 day files, D5 rule (1), D8 counting; and from
  round 2: the launcher-passed fixed lists (D1), the new `expanded` event kind (D2), the
  `unknown (log-corrupt)` reason (D3/D7) and the `unknown-session` rule (D5). Put D4's rule
  in plain words: "Each day's log becomes deletable 30 days after that day starts, so some entries go
  up to a day early. Old files are removed the next time fkit records something or writes a summary in
  that project — until then they stay on disk (typically hours to days; forever if the project is never
  used again). What fkit reads never goes back more than 30 days." (Wording fixed after the owner's R9
  ruling, "Accept, fix the wording"; "is deleted" → "becomes deletable" in round 3, R14a, to match D4.)
  ADR-053's Status bullet carries the same differences list (R14b).
- **B1 (capture):** D1 fixed lists built by the launcher on every launch — known roles from `$ROLES`,
  command_name list = union of `skills_for_role "$r"` over `$ROLES` — and passed as two comma-joined
  hook-command arguments by `build_settings()` (file or inline fallback); items must match
  `[a-z0-9-]+`; a missing or malformed list = empty → every value `other`, entry kept; the hook never
  sources `claude/fkit-claude.sh` and holds no list of its own (R10);
  UserPromptExpansion → `command` only when `expansion_type` = `slash_command`, else `expanded` with no
  command_name and no task id (R12); every entry built in full, then one newline-terminated line in a
  single `write` to an `O_APPEND` file, never read-modify-write — B1 names the primitive (R11); hook-made UTC timestamp; measure and pin the session_id format on 2.1.289
  (`unknown-session` on failure, entry kept); one `asked` / `answered` entry per question; tag
  extraction from the `question` field only, exactly one distinct tag; measure the multi-select answer
  join format; per-session-per-UTC-day files; pruning on every capture write — pattern-matched regular
  files only, inside the D3-checked folder, symlinks refused, silent, never blocking; no stored
  watermark. Tests to add: a secret-shaped command_name / agent_type is stored as `other`; tag
  extraction (one, zero, several tags; tag only in `header` or an option → none); a dismissal yields
  `asked` only; a day file survives at day start + 30 days − ε and goes at + 30 days; many concurrent
  appenders to one day file → every line intact, none lost (R11); an `mcp_prompt` expansion → exactly
  one `expanded` entry, no command_name, no bind, liveness unmet (R12); an empty / malformed list
  argument → `other` (R10).
- **B2 (prose conventions):** the `[task NNNN]` relay tag goes in the question's `question` field, one
  task per question; the `task: <id>` spawn line — in both ship-loop SKILLs.
- **B3 (summarizer):** D5 rule (1) fall-through; window = anchor → summarizer run; W = end of the UTC
  day containing (now − 30 days), entries before W ignored; typed-message count = `typed` entries only;
  question counts per question. Fixtures to add: a relayed question whose task is not bound in the lead
  session still makes that task `involved`; a slash command counts as one typed message; an anchor
  before W → `unknown (log-pruned)`. Round 2: `unknown-session` entries never bind and never satisfy
  liveness; their tagged owner entries count for the tagged task AND as unattributed, untagged ones as
  unattributed only; a `plan-write` there still sets the anchor; a task whose only binding session is
  `unknown-session` → `unknown` (R11). A malformed line counts toward no total, and any would-be
  autonomous task whose window overlaps that file's UTC day → `unknown (log-corrupt)`; diagnostics
  count malformed lines (R11). `expanded` counts as involvement, never binds, never proves liveness,
  never in the typed-message count (R12). Fixtures for each.
- **B4 (metric report):** uses W, not a stored watermark.
- **B5 (docs):** state D4's on-disk vs what-readers-see rule (R9) and the 30-day limit in plain words.
- **0121 (observer):** readers see at most 30 days of the shared log (older files may still be on
  disk until the next prune, and must be ignored — R9); older history needs the owner to re-rule
  OQ4 — still no second log (ADR-053 Re-raise only if).

### Checks

- `node --test test/adr-number-uniqueness.test.js test/reference-integrity.test.js
  test/coordination-citation-policy.test.js test/task-id-uniqueness.test.js` — **99 / 99 pass**, 0 fail
  (run after the ADR, ledger and this file were written).
- Machine-path grep (`/Users/`, `/private/tmp`, `/home/`) over this file, `review.md` and ADR-053 — no
  match.
- `plan.md` re-hashed after the round — still blob `8308b0eec4df2f2d1071a1df75d467138fe32239`
  (unchanged).
- Skipped: `npm run test:unit`, `npm run test:docs`, `npm test` — this round changed only coordination
  documents and one `proposed` ADR, no code; the four guards above are the ones that read these files.
  The reviewer's round 2 (if the driver runs one) re-checks the ADR text.

### Checks (round 2)

- Same four guards (`node --test` adr-number-uniqueness, reference-integrity,
  coordination-citation-policy, task-id-uniqueness) — **99 / 99 pass**, 0 fail, run after the ADR,
  ledger and this file were written.
- Machine-path grep over this file, `review.md` and ADR-053 — only hit is the round-1 line naming the
  grep patterns themselves.
- `plan.md` re-hashed — still blob `8308b0eec4df2f2d1071a1df75d467138fe32239`.
- Skipped: `npm run test:unit`, `npm run test:docs`, `npm test` — documents and a `proposed` ADR only,
  no code.

## 2026-10-05 — Process review, round 3 (spawned `fkit-coder`, Process-review worker of `fkit-sprint-ship-loop`)

Findings R14–R15 verified against this worklog and ADR-053. Both CORRECT, both record/wording only — no
design change. No consult. Files touched: `review.md` (*Coder response* rows R14–R15, header `Status:`
→ `closed-out`), this `worklog.md`, ADR-053 (Status stays `proposed`). Nothing else. `plan.md` not
edited.

### Decision log (round 3: fixes applied without per-fix owner approval, and obvious-winner calls)

- **F1 — R14a: B0 plain-words line.** Finding: the line said "is deleted 30 days after that day starts"
  and then contradicted itself. What changed: § Carry, B0 bullet → "becomes deletable 30 days after
  that day starts", matching ADR-053 D4. Why it qualified: verified CORRECT; mechanical, one-word
  wording fix inside the owner's R9 ruling ("Accept, fix the wording").
- **F2 — R14b: ADR B0 differences list.** Finding: ADR-053's Status bullet omitted the D5
  `unknown-session` rule that this worklog's B0 bullet lists. What changed: ADR-053 Status bullet adds
  "and the `unknown-session` rule (D5)"; the two lists now match. Why it qualified: verified CORRECT;
  mechanical — the rule is already in D5 and in the worklog list.
- **F3 — R15a: two owner rulings recorded.** Finding: the owner's rulings on `expanded` and on damaged
  log lines (2026-10-05, `AskUserQuestion`, `fkit-lead` session, relayed in the round-3 spawn) were in
  neither rulings list, and E3/E4 still rested on agent calls. What changed: both added to ADR-053
  § Owner rulings and this worklog's § Owner rulings (option label and description word for word; the
  question paraphrased, not quoted); E3/E4 gain a "Basis since round 3" note. Why it qualified: verified
  CORRECT; mechanical record of rulings the driver relayed; no design change (D2/D3/D7 already say what
  the owner chose).
- **F4 — R15b: one item moved out of the owner-rulings lists.** Finding: "briefs filed after the
  APPROVE, before acceptance; B0 blocks B1–B5" sat under the owner-rulings heading, but the owner never
  ruled on it (driver's record: he was told it needed no answer and gave none). What changed: moved
  under "Not owner rulings" in both files, basis = reviewer + architect found it consistent with the
  brief's Phase-B text and `plan.md` § 4; it stands unless the owner says otherwise at B0. Why it
  qualified: verified CORRECT; mechanical attribution correction, same class as R13a; no ruling invented.
- **F5 — ledger `Status:` → `closed-out`.** Why: R14 and R15 are `✅ done`, nothing blocking remains,
  this round changed record wording only, and the reviewer recommended closeout after these fixes with
  no round 4 (as the driver relayed). Reversible if the driver runs another round.
- Obvious-winner calls this round: **none**.

### Checks (round 3)

- Same four guards (`node --test` adr-number-uniqueness, reference-integrity,
  coordination-citation-policy, task-id-uniqueness) — **99 / 99 pass**, 0 fail, run after the ADR,
  ledger and this file were written.
- Machine-path grep over this file, `review.md` and ADR-053 — only hit is the round-1 line naming the
  grep patterns themselves.
- `plan.md` re-hashed — still blob `8308b0eec4df2f2d1071a1df75d467138fe32239`.
- Skipped: `npm run test:unit`, `npm run test:docs`, `npm test` — record wording in documents and a
  `proposed` ADR only, no code.

## 2026-10-05 — Phase-B briefs filed; umbrella closed (spawned `fkit-producer`)

- Per the owner's 2026-10-05 APPROVE of Phase B items 1–5 (see § Owner APPROVE of Phase B), the
  producer filed the Phase-B briefs from `plan.md` § 4, as amended by ADR-053, with every item of
  § Carry into the Phase-B briefs folded into the matching brief: `0485` (B0), `0486` (B1), `0487` (B2),
  `0488` (B3), `0489` (B3b), `0490` (B4), `0491` (B5). **No B6** — item 6 is not approved.
- Placed on the **Backlog board**, not Sprint 10 (no sprint named by the owner; Sprint 10's scope is
  its R1 batch).
- This umbrella was then closed via `/fkit-task-done` as `✅ Done (agent-closed — not owner-verified)`:
  the brief and Sprint 10's `0482` section make the close conditional on the Phase-B briefs existing,
  and they now do. Phase B's own work lives in `0485`–`0491`; ADR-053 stays `proposed` until `0485`.
