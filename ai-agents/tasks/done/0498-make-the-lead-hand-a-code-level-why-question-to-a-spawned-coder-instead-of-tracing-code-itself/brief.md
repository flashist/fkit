# Make the lead hand a code-level "why" question to a spawned coder instead of tracing code itself

## ID
0498

## Sprint
Sprint 10

## Priority
P16

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.
> The sprint ship-loop's per-task plan approval, given live by the owner, is where that word is given.

**The owner's request, 2026-10-08** (typed in a `fkit lead` session; lightly trimmed by the lead's
relay): in another project, when he asked the lead about a user scenario and whether it was fine, the
lead *"started doing its own research and it actually digged down into the code and the server side
logic. I think it's wrong. … as soon as the lead understands that it needs to go into the code, not
just information about the project … It needs to spawn agent probably coder agent who can answer code
specific … questions."* He added: *"we are not changing its behavior right now, but we want to make
sure that when the task is done, the same behavior is not happening in the future … when the new
versions of the F-Kit are released and used."*

**The incident, described generically** (a consuming project's lead session, fact-finding on
2026-10-08; that project, its files, hosts, logs and code are deliberately not named here):

- During a live production test the owner asked *"I see this error, is it ok?"* — a lobby-start error
  (HTTP 403).
- The lead answered **by itself**, in about 14 read-only tool calls over about 10 minutes: it searched
  the server code, read the request handler and server classes, read the production log over SSH
  (under an earlier read-only production approval the owner had given it), read client code and a
  reverse-proxy config, and concluded it was a production-only bug — plausible, **unverified**.
- It then handed that diagnosis to a producer for a brief (*"lead's diagnosis, to be confirmed by the
  coder"*). That can **anchor** the coder and weakens the independent look the coder is meant to give.
- It never consciously decided not to delegate — *"each step felt like one more look"*. The same
  "is this expected?" pattern happened 3–4 times that day during live testing.

**What in `fkit-lead.md` pulled which way** (the consuming lead's own reading, checked against the
canonical source on 2026-10-08):

- **Toward reading code itself:** the last bullet of *"What you can do here"* — *"Read the repo
  (`Read`, `Grep`, `Glob`) and run read-only shell to orient."* — states **no limit** on "orient".
- **Toward delegating:** *"Delegate, never substitute"*; *"`@fkit-<role> <question>` — put a
  **one-off question** to a role and bring the answer back"*; the hard rule *"Never write source or
  review, yourself."*
- **The gap:** the never-list names writing source, reviewing and designing — it does **not** name
  investigation or diagnosis. So diagnosis felt allowed as "only reading".
- Context only, not fkit's: that project also keeps a local memory note (*"run it, don't hand it
  over"*) that biased the lead toward doing reads itself. Nothing in this task touches project-local
  memory.

**Owner rulings, 2026-10-08, given via `AskUserQuestion` in the `fkit lead` session** (relayed to a
spawned `fkit-producer` with no owner channel, ADR-021; ⚠️ the option texts are the lead's relay of the
selected options, not text this producer saw the owner choose):

| # | Question | Selected option (verbatim, as relayed) | Option text |
|---|---|---|---|
| L1 | Where the lead's own looking stops | *"Quick triage, then hand off (Recommended)"* | *"Lead may answer from the spec/brief/wiki and do 1–2 fact lookups (a file, a config value, deploy state). The first 'why does the code do this?' (tracing code or reading logs to explain a failure) goes to a spawned role."* |
| L2 | What the hand-off must do (multi-select — **all three** chosen) | *"Tell owner it's delegated"* | *"Say plainly 'a coder is finding the cause' so you know the answer is coming from a role, not the lead's own digging."* |
| L3 | (same question) | *"No lead guess as fact"* | *"The lead's own hypothesis never goes into a brief or spawn prompt as fact — marked as a guess or left out, so the coder looks independently."* |
| L4 | (same question) | *"Relay read approvals"* | *"If you gave the lead an approval (e.g. read-only production logs), it passes that approval, quoted, to the role it spawns."* |

**The consuming lead's own suggested line** (input to the plan, not a ruling): the lead may find files
or docs, read a config value or a status, check deploy/version state, and answer *"is X expected per
the spec/brief/wiki/ADR?"* — read-only checks whose result is a **fact**. It delegates at the first
*"WHY does the code do this?"*. Tripwire: a **second** file read in service of explaining a behaviour,
or **any** log read to explain a failure. Edge cases it named: triage depth (classify expected-vs-bug in
1–2 reads, then hand off); the owner waiting mid-test (say *"a coder is finding the cause"* instead of
self-diagnosing); a production-read approval held by the lead must be relayed; never paste the lead's
hypothesis as fact; a live-test walkthrough comparing screenshots to approved text is fine — that is
checking against spec, not diagnosis. It asked for a **cheap default usable mid-conversation**, e.g.
*"answer from spec; if not answerable in one read, spawn `@fkit-coder` with the symptoms and logs, and
say so."*

**Relation to locked decisions — flagged, no conflict found:**

- **ADR-031** made the lead a conductor (*"Delegate, never substitute"*). This task **extends** the
  never-list it introduced to name diagnosis; it does not reverse anything. Whether that needs an
  ADR-031 amendment note, a new short ADR, or no ADR at all is for the plan to propose (via an
  `fkit-architect` consult if it wants one). ADR-010's history (the lead as *"a router, not a doer"*,
  reversed by ADR-031 §Decision 3) is background only — this task does not bring back the
  router-only lead.
- **ADR-055 / `0475` (the lead-path spawn marker).** That marker is for a coder that **writes**. A
  diagnosis spawn is **read-only**, so it carries **no** write marker and must not be confused with
  one. Ruling L4's relayed **read** approval is a different thing: a quoted, dated approval passed
  along so the coder knows what reads it may make — it authorises no write. The plan should say this
  plainly so the two are never mixed up.
- **`0495`** (`🔄 In progress`) already edited the same file — the *"Hold the owner channel"* bullet
  now carries the knock-on rule for placement questions. Not a dependency; but both are prose in
  `fkit-lead.md`, so build on the tree **after** `0495`'s edit lands, and only touch `0495`'s
  convention if a placement question arises.
- **Overlap, flagged — not a dependency.** ADR-052 phase-5 task `0457` (reword agent prompts) will
  rewrite some of the same prompt text. It has not started. Build on the current tree.

## What to build

The rule is **prose in the lead's instructions** — trust, not proof, like the orchestrated plan gate
(ADR-031 honesty clause). Edit the canonical sources under `claude/`, never the `.claude/` copies.

1. **Bound "orient".** Rework the *"What you can do here"* bullet *"Read the repo … to orient"* so it
   states the limit from ruling L1: the lead may answer from the spec, brief, wiki or an ADR, and make
   **1–2 fact lookups** (find a file, read a config value or status, check deploy/version state). It
   names what is **not** orienting: tracing code, or reading logs, to explain *why* something behaves
   as it does.
2. **Name diagnosis in the never-list.** Extend the conductor discipline (*"Delegate, never
   substitute"*) and the hard rule (*"Never write source or review, yourself."*) so diagnosis /
   root-cause investigation is named alongside writing source, reviewing and designing. Keep the
   existing phrases intact (see Verification 4 on test anchors) — add, don't rephrase what tests pin.
3. **The tripwire and the cheap default.** State the hand-off point plainly enough to use
   mid-conversation: the first *"why does the code do this?"* goes to a spawned `@fkit-coder` (or the
   role the question belongs to). Give a concrete tripwire — the plan picks the exact wording; the
   consuming lead's proposal (a second file read in service of explaining a behaviour, or any log read
   to explain a failure) is the starting point. Give the one-line default: *answer from the spec; if one
   read does not settle it, spawn `@fkit-coder` with the symptoms (and any logs the owner pointed to),
   and say so.*
4. **The three hand-off requirements (rulings L2–L4), each stated:**
   - **L2 — say it.** The lead tells the owner plainly that the answer is coming from a spawned role
     (e.g. *"a coder is finding the cause"*), so the owner never mistakes the lead's digging for a
     role's answer. This holds especially when the owner is waiting mid-test.
   - **L3 — no guess as fact.** The lead's own hypothesis never goes into a spawn prompt or a brief as
     fact. It is left out, or marked as an unverified guess, so the coder looks independently. This
     applies to briefs the lead asks a producer to write, too.
   - **L4 — relay read approvals.** If the owner gave the lead an approval (e.g. to read production
     logs read-only), the lead passes it to the spawned role **quoted**, with its date and channel —
     not summarised. State that this is a read approval and **not** the ADR-055 write marker.
5. **Say what stays allowed**, so the rule does not over-trigger: answering *"is this expected?"* from
   the spec/brief/wiki/ADR; quick classification of expected-vs-bug in 1–2 reads; live-test walkthroughs
   that compare what the owner sees against approved text.
6. **Role descriptions.** Where fkit describes what the lead may not do, add diagnosis so the summary
   matches the prompt — at least `/fkit-team`'s roster (the lead's row reads *"plan, code, design,
   review, or write the wiki"*) and any `README.md` row saying the same. The plan lists every such
   place found, or says why one is left alone.
7. **ADR question — the plan proposes, the owner decides.** Whether this needs a dated amendment note
   on ADR-031, a new short ADR, or nothing. If an ADR is written, it goes through `fkit-architect`.
8. **Out of scope:** changing any consuming project's current session, memory or files; changing any
   other role's instructions (the coder's, producer's, etc.) beyond the role-description summaries in
   item 6; any hook or tool enforcement — this is prose.

## Verification steps

1. **Text present (grep).** `claude/agents/fkit-lead.md` contains: the bounded-orient wording (1–2 fact
   lookups); diagnosis named in the never-list and in the hard rules; the tripwire; the one-line
   default; and each of L2, L3, L4 — L4 including "quoted" and the statement that it is not the ADR-055
   write marker.
2. **Role descriptions match (grep + diff review).** Every place listed under *What to build* §6 names
   diagnosis among the lead's don'ts, or the plan's stated reason for leaving it alone holds.
3. **Diff review — prose only.** No hook, script or tool behaviour changes; no other role's prompt
   changes beyond §6; only canonical sources under `claude/` (plus any ADR text) are edited.
4. **Tests that read the lead's prompt stay green.** `test/spawned-write-marker.test.js` (it extracts
   the *"Spawning a coder to write"* bullet up to the *"## The team"* heading) and
   `test/plan-review-switch.test.js` (it extracts the *"Plan review is opt-in, per sprint-loop run"*
   bullet) both pass unchanged — their anchors must survive the edit. Also
   `node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js`, and the full suite
   (or the change-scoped subset `0480` provides) before close.
5. **Dry-run probe (if feasible; trust, not proof).** Spawn an `fkit-lead`-like probe against the
   refreshed copies with a scenario: the owner, mid-test, asks *"I see this error, is it ok?"* where the
   honest answer needs a code-level cause. Pass = the probe answers what it can from spec in at most 1–2
   lookups, says a coder is finding the cause, and spawns (or states it would spawn) `@fkit-coder` with
   symptoms and no hypothesis-as-fact — rather than tracing code. Record the probe's prompt and
   transcript summary in the task folder. ⚠️ A single probe passing proves nothing general — the rule
   is prose and the model may still drift; say so in the close report. If no probe is feasible, say so
   and why.
6. **Regression check of the allowed side.** In the same probe (or a second), a plain *"is X expected
   per the brief?"* question is answered directly from the brief, with no spawn.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- Related, not dependent: `0475` / ADR-055 (write marker — a diagnosis spawn is read-only and carries
  none); `0495` (same file, in progress — build after its edit lands; touch its knock-on convention
  only if a placement question arises); `0457` (later reword of agent prompts — overlap only).
- Filed 2026-10-08 by a spawned `fkit-producer` on `fkit-lead`'s instruction, under the owner request
  and rulings L1–L4 above (no owner channel, ADR-021).
- ⚠️ `P16` is append rank, NOT a merit ranking — flagged for owner confirmation.
  **On merit this belongs directly below `0495`, where it is**, because both are prose rules in
  `fkit-lead.md`, this one should be built on `0495`'s landed edit, and nothing on the board depends on
  it.
