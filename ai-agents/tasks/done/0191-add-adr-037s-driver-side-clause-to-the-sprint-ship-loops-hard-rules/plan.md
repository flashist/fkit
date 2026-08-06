# Plan — task 0191, driver-side clause of ADR-037

> **Provenance.** Produced by a spawned `@fkit-coder` running `/fkit-plan-task` under
> `fkit-sprint-ship-loop` (live `fkit lead` driver session), and **approved by the owner via
> `AskUserQuestion` on 2026-08-04**. Copied here verbatim by the driver at the moment of approval,
> before the Build spawn (ADR-020).
>
> **Owner's rulings at approval:**
> 1. **Wording shape → Option A** (sub-bulleted). Option B is rejected.
> 2. **Init refresh → NOT this run.** Do **not** run `claude/fkit-claude-init.sh .` as part of this
>    build; **record the gap in the worklog** instead (see *Open questions* §2).
>
> ⚠️ **Honest limit** (loop honesty clause): approval leaves no artifact of its own (ADR-021). This
> file pins *which bytes were carried*, not *which were approved*.

### Verification log (everything below was checked on disk at plan time, not taken from the prompt)

| Claim | Result |
|---|---|
| `0190`'s worker-side clause shipped | **Confirmed.** `claude/scaffold/universal-rules.md`, final bullet of `## Universal hard rules`, lines 11–13. Text matches the prompt verbatim. |
| `RULES_MAX` bumped 4096 → 4352 | **Confirmed.** `claude/fkit-claude-init.sh:337`. Line 336 comment names ADR-037's worker-side clause as the reason. |
| `## Hard rules` still present in the target | **Confirmed.** `claude/skills/fkit-sprint-ship-loop/SKILL.md:275`, 9 bullets at 276–290, `## Usage` at 292, file is 296 lines. |
| Contending tasks touch other regions | **Confirmed distinct.** `0203` → the `**Rules that make this honor the ADRs:**` bullet at **line 149** (inside step 2). `0208` → the §5.4 exit table, **lines 245–255**. `0164` → the Build row, step-2 region. **None touches `## Hard rules` (275–290).** |
| Brief's line-pinned coordinates | **There are none.** The brief carries no `path:NNN` citation to decay — itself compliant with the `0176` policy. Its one structural coordinate ("the section exists in the file today") is confirmed. |
| `npm test` baseline | **Green.** `fail 0`, plus the `prove-red.sh` hard gate passing (14 mutations each redding their named assertion). |
| ADR-037 read in full | Yes. §3 (lines 190–204), §4 asymmetry blockquote (206–211), site ruling (219–220), instance A adjudication (298–308). |

### Two corrections to claims in the spawn prompt

**1. "No test reads any `SKILL.md` today" is imprecise — but its conclusion survives, for the right reason.**
`test/skill-frontmatter.test.js` **does** read every `claude/skills/*/SKILL.md` (it globs them at line 303 and `readFileSync`s each at 323). It audits **only the frontmatter block** — the `---`-delimited head, lines 1–8 in the target — and treats the body only as "where frontmatter stopped". The edit lands at line ~285, hundreds of lines below the frontmatter close, so it cannot move that test either way.

Net: the brief's verification step 6 is still correct — **a green suite is a regression check, not proof the clause landed** — but the accurate reason is *"the only test that opens this file reads its frontmatter, not its body"*, not *"nothing reads it"*. Do **not** propose a text-presence test (ADR-037 §5 names one and declines it: it would assert words are on disk while reading like proof a driver obeyed them).

**2. A byte-parity test exists but does not reach this file.** `test/dual-home-parity.test.js` compares `ai-agents/` against `claude/scaffold/ai-agents/` — **not** `claude/skills/` against `.claude/skills/`. So no parity guard fires, and `.claude/skills/fkit-*/` is gitignored (`.gitignore:17`). The brief's "diff touches exactly one file" holds for tracked files.

### The unusual hazard, stated

The edit target is **the skill the driver spawning this worker is executing right now.** Three things about that:

- **The live driver reads `.claude/skills/fkit-sprint-ship-loop/SKILL.md`, not the canonical `claude/` copy.** Diffed at plan time: **byte-identical (24394 B)**. Editing the canonical file therefore **cannot perturb the in-flight driver** — that is the safety property that makes a mid-run edit acceptable.
- **The flip side, and it is a real caveat:** the clause reaches **no driver in this repo** until `claude/fkit-claude-init.sh .` refreshes the gitignored copy. ADR-037 §4's whole justification for the asymmetry — *"a SKILL.md the worker does not load, but **which the driver itself does load**"* — is only true post-refresh. **Do not run the init script** (owner-ruled at approval): it rewrites the exact file the live driver's skill was loaded from, it is outside the brief's one-file scope, and it is the owner's call. **Record the gap in the worklog.**
- **Region discipline:** touch **`## Hard rules` only** (275–290). **Re-read that section immediately before editing** and re-derive the anchor from its text, not from these line numbers — `0203`/`0208`/`0164` may land in between and shift everything below their edits. The owner's ruled `0203`→`0208` sequencing does not bind this task (different region), but the re-read does.

### The wording that ships — Option A (owner-ruled)

House idiom in this section: bold lead-in, bare `ADR-NNN §N` in parentheses (no markdown links, no `:NNN`) — matching the existing `(ADR-031 Decision 2)`, `(ADR-033 §1/§4/§5)`, `(ADR-032/ADR-025)`.

Sub-bulleted, because verification step 2 demands each of the three forms be *"identifiable as a permitted form rather than as prose around one of them"*, and sub-bullets make that structurally true rather than a matter of careful reading:

```markdown
- **Never instruct into the territory of a rule in the skill a worker will run without naming the owner
  ruling you relay** (ADR-037 §3 — the driver-side half of the owner's Q2 ruling; this ADR binds the
  driver, not only the worker). Exactly one of three is permitted:
  - **Name the ruling** — what the owner ruled, when, on what point — and the instruction binds.
  - **Get the ruling first.** You hold the owner channel the worker lacks (ADR-021); if the point
    matters, ask before spawning.
  - **Do not issue it.** Let the skill rule stand.

  **A bare directive into a rule's territory is a defective instruction, and the worker's conservative
  branch is the correct response to it, not an obstruction** — do not read a worker's escalation here as
  a failure to follow orders. **This clause is weaker than its worker-side twin** and ADR-037 §4 records
  that deliberately: the worker-side clause reaches every spawn through the universal rules block, while
  this one binds you only because *you* load this file, and it reaches no worker.
```

**Option B (compact, ~half the lines) was REJECTED by the owner at approval.** Recorded so a later reader does not re-propose it: same five required elements, three forms inline as bolded run-in phrases rather than sub-bullets; cheaper on attention, but weaker against verification step 2 since "identifiable as a permitted form" would then rest on the bolding alone.

### Placement

Insert **after** the existing plan/build-split bullet (currently line 283–284) and **before** the producer/close bullet. Rationale: the two neighbouring bullets — `Spawn typed fkit-<role> subagents only` and `The plan/build split is mandatory` — are the section's other rules about **what the driver puts into a spawn prompt**, so the new clause reads in context there. Appending at the end of the section is the alternative; it isolates the clause from its topical neighbours and is **not** recommended. This is a placement judgment inside the approved region, not a scope question.

### Steps

1. Re-read `claude/skills/fkit-sprint-ship-loop/SKILL.md`'s `## Hard rules` and re-derive the insertion anchor from bullet text (guard against `0203`/`0208`/`0164` having shifted lines).
2. Insert the Option A bullet at the placement above. **One file, one hunk.**
3. Re-read the section to confirm the other eight bullets are byte-unchanged and the `## Usage` heading still follows.
4. Grep the new text for `:NNN` — must be zero, per the `0176` policy. Confirm `ADR-037` appears by name.
5. `npm test` — expect green, **reported as a regression check only** (see correction 1; no test reads this file's body).
6. Worklog: (a) verification step 5's instance-A application — see below; (b) the `.claude/` staleness caveat, **owner-ruled to be recorded rather than fixed this run**; (c) decision log per ADR-020.

### Verification step 5, answered in advance (the clause must decide instance A or it is not usable)

Instance A: a live lead instructed a spawned producer *"rank on merit rather than append"*, into the territory of `/fkit-task-brief` step 5's append default. **Form 1 was unavailable** — there was no owner ruling on placement to name; the owner had approved *filing* only, as the producer's own addendum says. So the clause leaves exactly two correct acts: **form 2, get the ruling first** (the lead held the owner channel; placement plainly mattered enough to instruct about) — the better fit — or **form 3, do not issue it**, letting step 5's append stand. The clause decides the case cleanly. **It is usable.**

### Edge cases and failure modes planned around

- **Concurrent edits shifting the anchor** — handled by step 1's re-read; the reason to anchor on bullet text, not line numbers.
- **Over-claiming parity** — the single likeliest wording defect. The final sentence of Option A is the mitigation and **must survive any compression**; a reviewer trimming it would reintroduce exactly the thing ADR-037 §4 refused to smooth.
- **Dropping a permitted form under length pressure** — the brief is explicit that a clause giving only form 1 *"reads as a licence to relay"*. Any shortening must keep all three.
- **Scope creep into `0203`'s bullet** — line 149's *"Rules that make this honor the ADRs"* is thematically adjacent (it mirrors the declared-approval marker) and is a tempting place to "also mention" ADR-037. It is **`0203`'s region and out of scope here.**
- **Not a failure mode, but worth naming:** ADR-037 §5 is explicit that this is unenforced prose and the named-ruling marker is forgeable. The plan does not try to harden it, per the ADR's own *"trust, not proof — state it, do not harden it into a false guarantee."*

### ⛔ Out of scope

The worker-side clause (`0190`, shipped); any other hard rule; the loop's steps, stop conditions, or progress reporting; **any test**; the `.claude/` init refresh (owner-ruled deferred).

### Open questions — both answered by the owner at approval

1. **Wording shape — Option A or Option B?** → **Owner ruled Option A** (2026-08-04, `AskUserQuestion`).
2. **Should `claude/fkit-claude-init.sh .` be run to refresh the gitignored `.claude/` copy, and when?** → **Owner ruled: NOT this run.** Until it runs, the clause is on disk but reaches **no driver**, including the one running now; ADR-037 §4's *"the driver itself does load it"* is only true afterwards. **The worklog must record this gap plainly as a stated limitation.** The owner runs init at their own convenience.
