# Faithful carry of an approved plan — the construction that satisfies the sprint loop's verbatim rule

- **Date:** 2026-08-02
- **Task:** `0162` — *Decide the construction that satisfies the sprint-loop's verbatim-carry requirement*
- **Author role:** `fkit-architect`, spawned as the Build worker of `/fkit-sprint-ship-loop`
- **Kind:** decision report. **Status:** decided — the owner ruled all four open questions on 2026-08-02
  (see §8). Follow-ups named in §10, none written here.
- **Change surface of the task that produced it:** this file, plus the task folder's `plan.md` and
  `worklog.md`. No source, no `SKILL.md`, no agent definition, no test, no ADR, no board row, no brief.

---

## 0. Read this first — what in this report is checkable, and what is testimony

This report is about a control that failed twice while certifying itself. It would be a poor report if it
reproduced that shape. So the evidence classes are separated up front, and never merged later.

**Checkable — verified firsthand this turn against live files, every claim cited by path and line.**
Everything in §1 (findings), §6 (machine-checkability), §7 (ADR-037 interaction) and the evidence table
in §12.

**Testimony — reported by the sprint driver about its own past conduct, unverifiable from disk.** The
round-1 and round-2 carry failures that scoped this task, the driver's claim that it pasted `0158`,
`0143` and `0195` plans in full, and its self-reported near-miss on `0195`'s §7. **No session transcript
is stored in this repo** — `find . -name "*.jsonl"` (excluding `node_modules/`) returns nothing. These
are recorded as reported.

**No conclusion below depends on them** — every conclusion is independently anchored in files read this
turn. But two do draw *illustrative* support from testimony, and saying otherwise would overstate the
separation this section exists to draw: §2 argues the construction partly from round 2's
truncate-and-certify, and §3 justifies the pointer half with *"which is precisely why round 2's false
certification worked"*. Strip the testimony and both survive — §2 on the disk-checkable `0195` miscount
below, §3 on a logical property of an unfalsifiable claim. They lose an illustration, not their basis.

**The one place testimony and disk meet, and disk wins.** The driver reported compressing `0195`'s §7
"five Q&A pairs". On disk, `0195/plan.md` §7 is titled *"Open questions — asked and answered"*, contains
**four** rows (OQ-1…OQ-4), and its own prose says *"All four"*
(`ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/plan.md:88-98`).
**The single checkable detail inside the testimony is wrong.** That miscount is not a gotcha — it is mild
but direct evidence for this report's central finding: a model misreported the contents of a document it
had authored hours earlier, in the same breath as reporting carefully on its own reliability.

### 0.1 This report's own spawn prompt demonstrates the defect it diagnoses

**A worked example, live, on the task that found it.** The owner's ruling (§8, OQ-1) is *paste **and**
path/hash pointer*. The prompt that spawned this report carried the paste and **no pointer** — because at
spawn time `0162/plan.md` **did not exist**. Verified firsthand: an `ls` of
`ai-agents/tasks/backlog/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/`
at the start of this turn returned exactly one file, `brief.md`. The sprint loop does not write `plan.md`
until the Build step — which is this turn. So the approved construction was **unavailable at the moment
it was supposed to be used**, on its own task, hours after being approved.

That is finding **F2** (§1) biting immediately, and it is why follow-up 1 is a hard prerequisite for
follow-ups 2 and 3 rather than a tidy-up.

**And it went further than was known when this section was first written.** The `plan.md` this Build
step then wrote turned out **not to be the approved plan** — it is a re-rendering of it, missing text the
owner approved. That was confirmed on disk during this task's own review round; the evidence and its
consequences are in **§9**, where the residual it exercises lives. It is the second self-demonstration on
one task.

The driver disclosed this in its spawn prompt rather than asserting a fidelity it could not deliver. That
disclosure is itself testimony — no transcript exists to check the paste against. **This report does not
lean on it.** Every conclusion below is reached from files read this turn.

---

## 1. Findings that reshape the task

Five findings, established before any question is answered. Two of them correct the brief.

### F1 — the brief's own citation is stale, in two places

The brief cites `claude/skills/fkit-sprint-ship-loop/SKILL.md:109` as the line stating the requirement,
and quotes it as `:109-115`. Today, **`:109` is the heading** `**Rules that make this honor the ADRs:**`
and the requirement bullet runs **`:110-116`**. Both citations are off by one line. (The approved plan
named only the first; the range is corrected here.)

One more instance of the `0160`/ADR-035/ADR-036 stale-coordinate arc. This report cites the rule the way
ADR-037's citation-form block prescribes — by **heading plus quoted phrase**, *"Rules that make this
honor the ADRs"* → *"The Build AND Process-review spawn prompts MUST each carry the approved plan
verbatim…"* — with the line number as a convenience, not as the identifier.

### F2 — the decisive structural fact: the sprint loop never writes `plan.md` before the Build spawn

`claude/skills/fkit-sprint-ship-loop/SKILL.md` names `plan.md` **exactly once** in the whole file — in
the **Build** row of its step table (`:103`), as something the *Build worker* writes:

> | **Build** | `@fkit-coder` | implement the **approved** plan; write source + `plan.md`/`worklog.md`; …

The sprint loop has **no artifact table at all** (`grep` for an artifact table heading returns nothing).

Contrast the task loop. `claude/skills/fkit-task-ship-loop/SKILL.md:102` carries an artifact row —
*"`<task-folder>/plan.md` | at plan approval | the approved implementation plan — **the boundary the
loop's autonomy is measured against**"* — and its step 4 (`:143`) instructs *"write the approved plan to
`<task-folder>/plan.md` — the durable autonomy boundary"*.

**Disk confirms the divergence is real, not editorial.** `0147/` and `0150/` — the two tasks shipped in
the run where both carry failures happened — contain `brief.md`, `review.md`, `worklog.md` and **no
`plan.md`**. Tasks that went through a path where a plan was persisted (`0143/`, `0158/`, `0195/`) do
have one.

**Consequence, and it governs everything after it:**

| Spawn | Does `plan.md` exist yet? | Is carry-by-reference available? |
|---|---|---|
| **Build** | **No** — the Build worker is the one who writes it | **No.** A pointer here is a dangling pointer. |
| **Process-review** | Yes — Build wrote it | Yes. |

Any ruling that sanctions a pointer without first moving the write **sanctions a dangling pointer on half
the spawns it governs**.

### F3 — a driver-side machine check is not merely conceivable; the wiring precedent is built and shipped

`claude/fkit-claude.sh:296` (inside `build_settings()`, `:272`) emits the role's hook block as JSON,
registered **by matcher**:

- `PreToolUse` / matcher `Skill` → `skill-ownership-hook.sh`, which **denies** via an explicit
  `hookSpecificOutput.permissionDecision:"deny"` payload (`claude/skill-ownership-hook.sh:41-47`)
- `PreToolUse` / matcher `AskUserQuestion` → `askuserquestion-marker-hook.sh` (records, does not deny)
- `Stop` → `turn-completion-hook.sh`
- `UserPromptExpansion` → `shiploop-marker-hook.sh`

A **third `PreToolUse` matcher on `Task`** is mechanically available and receives `tool_input` — i.e. the
spawn prompt. So a hook *can* read a spawn prompt, compare it against a `plan.md` on disk, and deny.
**This corrects the brief's "a guard … is at least conceivable" framing** — the deny mechanism is not
conceptual, it is built, shipped and mutation-tested. It also narrows ADR-037 §5 (see §7).

*(Refinement on the approved plan: `shiploop-marker-hook.sh` is a **`UserPromptExpansion`** hook, not a
`PreToolUse` one. Only two `PreToolUse` matchers exist today. The precedent for a third stands; the count
is corrected.)*

### F4 — worker-side detection is impossible, confirmed verbatim

`claude/agents/fkit-coder.md:93-98`, re-read today:

> **This is trust, not proof — state it, do not harden it into a false guarantee.** You cannot verify the
> approval from your context (the owner channel is session-only, ADR-021; there is no cross-context
> marker to check).

The worker has nothing to compare a carried plan against. **Zero worker-side detection mechanisms are
proposed anywhere in this report.** (Refusing a carry defective *on its face* is a different thing, is
not detection, and is `0163`.)

### F5 — the brief's "nothing here is machine-checked" claim is half wrong, and the correct half matters

**The brief states:** *"no test in `test/` reads `claude/agents/fkit-coder.md` or any `SKILL.md` content
at all"*, evidenced by `grep -rn 'fkit-coder.md' test/` returning one `existsSync` hit.

**Re-verified today, and it splits:**

- **The `fkit-coder.md` half holds.** `grep -rn 'fkit-coder.md' test/` still returns exactly one hit —
  `test/converge-contract.test.js:357`, an `existsSync` path check. Nothing reads its **body**.
- **The "or any `SKILL.md` content at all" half is wrong.** `test/skill-frontmatter.test.js` reads the
  content of every skill `SKILL.md` and every agent `.md` — `readFileSync` at `:323`, live-corpus tests
  at `:577` (*"every skill SKILL.md frontmatter conforms"*) and `:596` (*"every agent .md frontmatter
  conforms"*), over a **pinned, non-vacuous** corpus of `EXPECTED_SKILLS = 25` and `EXPECTED_AGENTS = 7`
  (`:574-575`).

**The precise statement, which is what this report uses:** *the **frontmatter** of every skill and agent
file is machine-checked; the **body** of none of them is.* The requirement at issue lives in the body.
The conclusion the brief drew survives — but it survives narrowly, and repeating the brief's wording
would have put a false claim into a second document. It is corrected rather than inherited.

*(Related: the brief's "unenforced-prose class" names `0152`/`0154`/`0157`. `0157` is **closed** —
`ai-agents/tasks/done/0157-state-task-brief-step-5s-append-rule-in-full/`. The open members are `0152`
and `0154`.)*

---

## 2. Q1 — What is a faithful carry?

**The plain answer, stated plainly because it decides everything after it:**

> **A language model restating a long text from its own conversation context cannot be relied on to
> reproduce it byte-for-byte, nor to detect its own failure to do so.**

Both halves matter, and the second is the dangerous one. Round 2 did not merely truncate — it truncated
**and certified completeness**, *"everything else is byte-for-byte."* A truncation that announces itself
is a defect a reader can act on. A truncation that certifies itself is a claim the reader has no way to
check. And §0's `0195` miscount shows the same failure mode in miniature, on a document the same model
authored hours earlier.

**Therefore a faithful carry cannot be defined as accurate recall.** No amount of instruction — "be
careful", "do not summarize", "carry it verbatim" — makes recall reliable, because the failure is
invisible to the thing being instructed.

### The construction

**A faithful carry is a copy operation over a durable artifact, executed in the spawning turn. Never a
recall over conversation state.**

Concretely, three steps the driver can actually perform:

1. **Read the file byte-exactly in the spawning turn — `Bash(cat <task-folder>/plan.md)`, not the `Read`
   tool.** The plan must already be on disk — which is exactly what F2 says is not true today for the
   Build spawn, and what follow-up 1 fixes.
2. **Check the read was whole, before pasting anything.** Compare what you hold against `wc -c <path>`
   and `git hash-object <path>` from that same turn. A read that does not account for every byte is a
   **failed** carry, not a carry to be patched up — take §4's pointer-only degraded path and say so.
3. **Paste those bytes into the spawn prompt**, unaltered. They come from a file read this turn, not from
   memory of a message written earlier.
4. **Cite the source alongside the paste**: the path, plus a content hash (see §3).

> **Why not the `Read` tool — stated because the obvious choice is the wrong one, and a follow-up was
> about to copy it into `SKILL.md`.** In this harness `Read` returns content in `cat -n` framing — a line
> number and a tab prefixed to **every** line — and reads **up to 2000 lines by default**. Verified
> firsthand: every `Read` result in the turn that wrote this correction came back line-number-prefixed.
> Two consequences, both fatal to *"true by construction"*. (i) Pasting that output "unaltered" yields
> text whose `git hash-object` can **never** equal the file's blob hash, so the §3 pointer and the
> follow-up 3 hook would disagree on every *well-behaved* spawn. (ii) The line cap **silently truncates a
> long plan** — precisely the case §4 forbids — and it truncates before the driver forms any judgment
> about it, which is the failure mode of §2's opening sentence arriving through the tooling instead of
> through recall. Stripping the framing by hand would re-introduce the very transformation this
> construction exists to remove. **Use a byte-exact read and verify the byte count.**

The word "verbatim" then becomes **true by construction** rather than true by effort. That is the whole
of the fix: the driver stops being asked to be reliable at something models are not reliable at, and is
asked instead to run a copy.

**The rule that would have killed round 2, stated as a discipline the driver can be held to:**

> **"Verbatim" is a word a driver may apply only to bytes it read from a file that turn.** True by
> construction, or forbidden.

---

## 3. Q2 — Is "carry by reference to an artifact on disk" acceptable?

**Recommendation, and the owner's ruling (§8): paste *and* pointer. Both. Not either/or.**

The brief asks the right question: a path is *exactly* the "pointer, not carrying" shape round 1 was
faulted for, so **what distinguishes a good pointer from round 1's bad one?** That distinction is the
substance of this answer, and it is three properties. **Round 1's pointer had none of them.**

| Property | Round 1's pointer | A `plan.md` pointer |
|---|---|---|
| **Durability** — the referent is reachable from the *new* worker's context | ✗ *"the plan text you returned in your previous message"* names a conversation the fresh worker has never seen. It resolves to nothing. | ✓ A file on disk, readable with tools the worker already holds. |
| **Existence at spawn time** | ✗ | **✗ today for the Build spawn** (F2), ✓ for Process-review. Follow-up 1 makes it ✓ for both. |
| **Revision identity** — it says *which* revision was approved | ✗ | ✗ for a bare path; ✓ once a content hash rides along. |

So a bare path is **not** sufficient, and the honest answer to "is by-reference acceptable?" is: *a
pointer with all three properties is a genuine improvement over round 1's, and still is not sufficient on
its own.*

### Why both, and not just the pointer

- **The paste is what the worker acts on**, and it satisfies condition (b) of the declared-approval
  marker exactly as (b) is written today (`claude/agents/fkit-coder.md:65-66`). Nothing has to be
  reopened.
- **The pointer is what makes the paste checkable** — by a hook (§6) at spawn time, and by a later reader
  **only for as long as the referenced bytes still exist**. **A paste alone is unfalsifiable, which is
  precisely why round 2's false certification worked.** Nobody could have caught it, including the model
  that wrote it.
  - **The audit value is narrower than a bare hash suggests, and must not be oversold.** `git hash-object
    <path>` **without `-w` writes nothing to the object store.** Verified firsthand: computing the hash
    of an untracked `plan.md`, then running `git cat-file -e` on that hash, reports the object **absent**.
    So for an untracked `plan.md` that is later rewritten, a hash recorded in a worklog lets a reader
    detect **that** the bytes changed — and only if they still hold a copy to compare — but never lets
    them recover **what was carried**. A pointer is a **tamper-evidence** device at spawn time, not an
    archive. A driver wanting the stronger property must `git hash-object -w` (or commit the file).
- **The paste's cost is now a token cost, not a fidelity risk.** The driver measured several thousand
  words × six spawns. That is real and worth stating — but once the paste is a file copy, a long paste
  is expensive, not unreliable. Those are different problems, and only one of them corrupts work.

### Revision identity — use `git hash-object`, not a commit-relative ref

Verified this turn: `git hash-object <path>` computes the blob SHA of **any readable file, tracked or
not**. This matters concretely — `plan.md` files in this repo are routinely **untracked** at the moment
they would be pointed at (`git status` today shows `0143/plan.md`, `0158/plan.md`, `0195/plan.md` all as
`??`). A pointer of the form `git rev-parse HEAD:<path>` would fail outright on every one of them.

**Recommended pointer form** (one line, next to the paste):

```
plan: ai-agents/tasks/backlog/<task>/plan.md  blob c0ffee… (git hash-object)
```

`shasum -a 256` is an equally valid alternative; `git hash-object` is preferred only because it needs no
extra tool and matches how the rest of the repo identifies content.

---

## 4. Q3 — What happens when the plan is very long?

**Truncation of a carried plan is never permissible.** Not with a declaration, not with an ellipsis, not
with "omitting rationale only". There is no declared lossy form this report sanctions, for one reason: a
driver that has decided a passage is droppable has already made the judgment that round 2 got wrong, and
it made that judgment about a document it could not reliably read.

**The rule when the plan will not fit:**

> If the driver cannot carry the plan whole, it carries **by reference only**, and says so in the spawn
> prompt in those words. **Never a partial paste.**

A pointer-only spawn is a **degraded** carry and must be visible as one — it fails condition (b) as
written, which means the spawned coder is entitled to refuse it (`0163`'s territory), and that is the
correct outcome. A degradation that stops the work is recoverable. A degradation that certifies itself is
not.

And the discipline that closes round 2's exact hole, restated because it belongs here as much as in §2:

> **"Verbatim" is a word a driver may apply only to bytes it read from a file that turn.**

---

## 5. Q4 — Does condition (b) survive?

**Under the ruled construction, (b) stands byte-unchanged.**

Condition (b) — *"it carries a concrete **approved plan** verbatim"*, `claude/agents/fkit-coder.md:65-66`,
the exact word `0150` landed one round ago — describes what the **spawn prompt** must contain. The
recommendation keeps a full verbatim plan in the spawn prompt. What changes is **where the bytes come
from** (a file read that turn, not recall) and **that a pointer rides along**. Both are additions to the
**driver's** obligation. Neither weakens the **worker's** condition.

**So `0150`'s guarantee is not reopened, and no ADR-altitude reversal is required.**

**`0163` needs no edit.** Verified today: `0163` is `🔲 Backlog`, `## Priority` **142**, unstarted, and
its own brief already instructs (`:96-100`):

> **Key the clause on the marker's conditions, not on a restated test.** Write it so it fires when
> **any** of (a)(b)(c) is unmet — not by re-spelling "verbatim" a second time in a second place.

It was written to survive exactly this ruling.

**Stated conditionally, for the record:** had the owner picked **pure by-reference**, (b) would have had
to change, and that reconciliation would have been **one** follow-up covering (b) and `0163`'s clause
together — never two independent edits to one guarantee surface. The owner did not pick it. **That
follow-up is therefore not filed** (see §10, follow-up 5).

---

## 6. Q5 — Is any of this machine-checkable?

Answered separately for the two sides, as the brief requires.

### Worker-side: **no. Impossible.**

`claude/agents/fkit-coder.md:93-98` — the owner channel is session-only (ADR-021), there is no
cross-context marker, the worker has nothing to compare against. Not "hard"; not "a follow-up". Not
possible. **No mechanism requiring the spawned coder to compare a carried plan against the owner's real
approved plan appears anywhere in this report.**

### Driver-side: **yes — a `PreToolUse` hook on the `Task` matcher.**

The shape: on a `Task` spawn whose prompt names `fkit-sprint-ship-loop`, extract the carried plan and the
pointer from `tool_input`, read the referenced `plan.md`, compare, and **deny** on mismatch — using the
same `hookSpecificOutput.permissionDecision:"deny"` route `skill-ownership-hook.sh:41-47` already uses.

**Five caveats, stated honestly rather than discovered later. All five carry into the follow-up.**

1. **It checks a carry-fidelity *proxy* for condition (b) — not (b), and not (a) or (c).** (a) *"the
   caller is `fkit-sprint-ship-loop`"* and (c) *"the owner approved via `AskUserQuestion`"* stay
   forgeable prose. A hook can confirm the prompt contains the plan's bytes. It **cannot confirm anyone
   approved them** — and (b) says *approved*. **Do not let a green hook read as a verified marker: it
   verifies neither more nor less than "these bytes match that file".**
2. **It is hard-gated on F2.** Until `plan.md` is written at plan approval, the Build spawn has nothing
   to compare against and the hook either fails open (worthless) or blocks every Build spawn (worse).
   **Follow-up 1 is a prerequisite, not a nicety.**
3. **The existing hooks' JSON extraction cannot do this job.** `skill-ownership-hook.sh:70-79` and
   `shiploop-marker-hook.sh:28-31` are deliberately jq-free bash using `"[^"]*"` matching. A spawn
   prompt is a long field containing escaped quotes, newlines and backslashes — that pattern breaks on
   it. This hook needs **real JSON parsing**. `node v24.13.0` is present and ADR-014's zero-devDeps
   constraint is satisfied by using it.
4. **The check is time-of-check, not time-of-use.** The hook reads `plan.md` at spawn time and the worker
   acts on the pasted bytes afterwards; nothing re-reads the file, and nothing pins it between the two.
   A `plan.md` rewritten after the hook passes leaves a green check standing over bytes that no longer
   describe the file. The window is small and the exposure is low — but a hook that is silent about its
   own TOCTOU window invites a reader to assume it has none, which is this report's whole complaint.
5. **Hooks exist only in launcher-built sessions.** They are written to `.fkit/settings/<role>.json` by
   `build_settings()` (`claude/fkit-claude.sh:272-296`). Verified today: this repo has **no
   `.claude/settings.json`**; `.claude/settings.local.json` **does** exist and is a valid hook host, but
   carries **no `hooks` key**. So the check binds `fkit <role>` sessions and nothing else — a plain
   `claude` session is unguarded.

### The honest summary line

**A *proxy* for one of the marker's three signals is mechanically checkable** — that the prompt carries
the bytes of a named file — **driver-side, in launcher sessions only, after a prerequisite fix. No signal
is checkable as written, (b) included:** (b) asserts the plan was **approved**, and approval is
unreachable from any hook. **The three conditions remain trust, and always will be.** That is a much
narrower win than "one of three", it is the honest one, and it is
stated narrowly on purpose. This report would rather join the unenforced-prose class knowingly (with
`0152` and `0154`) than ship a guard whose greenness means less than a reader will assume.

---

## 7. Q6 — Interaction with ADR-037 — flagged loudly, as the brief instructs

### The ruled construction **strengthens** the declared-approval marker

Condition (b) goes from *"the driver asserts it pasted the plan"* to *"the driver pasted bytes it read
from a named file with a stated hash, and a hook can check the paste against that file."* Strictly more
checkable, with (b)'s wording untouched.

**Precisely what becomes checkable — the distinction is load-bearing and easy to lose.** (b) reads *"it
carries a concrete **approved** plan verbatim"* (`claude/agents/fkit-coder.md:65-66`, quoted at ADR-037
`:96-97`). A hook can establish *the prompt contains the bytes of the file at path P with hash H*. It
**cannot** establish that P is the plan the owner approved — approval lives in a session channel no hook
can see (ADR-021). So what becomes machine-checkable is a **carry-fidelity proxy for (b)**: strictly
weaker than (b), genuinely useful, and **never to be reported as (b) itself.**

### But ADR-037 §5 is now **too strong**, and this report says so

`ai-agents/knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md:249-250`:

> **Prose is proportionate. There is no mechanical enforcement, and none is possible — stated plainly
> rather than promised.**

**"None is possible" is wrong as written — but by less than it first appears, and the difference is the
whole correction.** It holds for conditions (a) and (c), and it **also holds for (b) itself**, whose
*approved* qualifier no hook can reach. What it does **not** hold for is the **carry-fidelity proxy for
(b)** — *"the prompt contains the bytes of the file at path P with hash H"*. Once `plan.md` exists at
spawn time, **that proxy** is mechanically checkable driver-side by a `PreToolUse`/`Task` hook, using
deny machinery this repo already ships and mutation-tests (F3).

**So: mechanical enforcement of something genuinely useful is possible. Mechanical enforcement of the
marker's conditions as written is not.** §5 conflates the two, and that is the sentence's error.

**This is a narrowing of §5, not a contradiction of ADR-037's decision.** The ADR's substantive ruling —
that the marker is trust, not proof, and must not be hardened into a false guarantee — stands intact,
because **all three signals remain unverifiable as written** (only a weaker proxy for one of them becomes
checkable) and a conjunctive marker is only as strong as its weakest signal.

**Nor does this narrowing re-raise what ADR-037 forbids re-raising.** `:365-367` bars re-raising *that
this is unenforced prose, that the marker is forgeable, or that a skill rule should have been marked
undisplaceable*. This report re-raises none of the three: it corrects a **factual over-claim about what
is technically possible**, and it explicitly leaves the marker's forgeability intact — indeed §9 records
that the forgeable conditions stay forgeable. Keeping the correction scoped to the *proxy* is exactly
what keeps it on the right side of that line; asserting "(b) is checkable" would have drifted onto the
settled ground the ADR fenced off.

**It is also not ADR-037's pre-registered re-raise trigger.** `:362-364` reserves re-raising for *"if a
cross-context verification token ever becomes available in the harness"*. This is a **file on disk**, not
a token, and it verifies content rather than approval. The trigger has not fired; §5 simply overstates
its scope by one clause.

**The correction is follow-up 4 and is deliberately not written here** — see §10.

### The loud one — why pure by-reference was the wrong option

Had the owner chosen pointer-only, it would have **weakened** the marker. Condition (b) would degrade
from *"carries a plan"* to *"carries a pointer"*, and **a one-line pointer is far cheaper to forge than a
thousand-word paste.** A model that will misremember a document will also emit a plausible-looking path
without reading it. The paste's cost is, perversely, part of its integrity: it is expensive to fake at
length.

That is the strongest argument against pure by-reference, and it is the reason the recommendation is
both-and.

---

## 8. The owner's rulings — recorded with provenance

**All four were put to the owner via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver
session on 2026-08-02 and relayed to this worker.** The relay is the driver's testimony; no transcript
exists. Recorded as relayed.

| # | Question | Ruling |
|---|---|---|
| **OQ-1** | The construction: (a) paste + path/hash pointer, (b) pure by-reference, or (c) paste-only (today's rule, failed twice)? | **(a) PASTE + PATH/HASH POINTER — both, not either/or.** Rationale accepted: the paste is what the worker acts on and satisfies (b) as written; the path+hash makes it checkable by a hook and by a later reader. **A paste alone is unfalsifiable — which is why round 2's false certification worked.** Pure by-reference rejected in part because it **weakens** ADR-037's marker. |
| **OQ-2** | Build the hook, or join the unenforced-prose class knowingly? | **FILE THE HOOK AS A FOLLOW-UP, gated on the F2 fix. Do not build it here.** Accepted as real work to be ranked, not a footnote. All five caveats of §6 carry into the follow-up text. |
| **OQ-3** | ADR-037 §5 correction — amend the ADR, or record only in this report? | **DATED CORRECTION NOTE ON ADR-037 §5.** Amend the ADR. **Not written by this task** — it is follow-up 4 and is outside this task's report-only scope. |
| **OQ-4** | Timing — follow-up 1 changes sprint-loop behaviour mid-sprint. Now, or after Sprint 2? | **RULED after round 1 of this task's review, 2026-08-02: NOW — rank follow-up 1 and drive it this sprint.** At plan-approval time it had been folded in without a ruling and was carried forward as open; the ruling came once **R4b** turned the risk from hypothetical into a confirmed live failure. The change is **to prose in a step table, not to running code**. See §11. |

The plan itself was approved as written: report-only, one file under
`ai-agents/knowledge-base/reports/`, no ADR, no `SKILL.md` edit, no brief, no board row.

---

## 9. Enforcement honesty — the ADR-031 / ADR-037 statement

Stated in one place so no reader has to assemble it from four sections.

**What is checkable, after follow-up 1 and follow-up 3 land:**
- That a Build or Process-review spawn prompt contains the exact bytes of a named `plan.md` at a named
  hash — a **carry-fidelity proxy for condition (b)**, not (b) itself, since (b) asserts the plan was
  *approved* and no hook can reach approval. Driver-side. In `fkit <role>` launcher sessions only.
  Time-of-check only (§6 caveat 4).

**What is trust, permanently:**
- That the caller really is `fkit-sprint-ship-loop` — condition **(a)**, forgeable prose.
- That the owner really approved that plan via `AskUserQuestion` — condition **(c)**, forgeable prose,
  and unverifiable in principle while the owner channel is session-only (ADR-021).
- That the `plan.md` on disk is the revision the owner saw. The hash pins *which bytes were carried*, not
  *which bytes were approved*. **A driver that writes a plan.md the owner never approved defeats the
  whole construction, and nothing here detects it.**
- **The same gap, reached without any bad actor — and it is the likelier route.** Today the **Build
  worker** writes `plan.md` (F2, `SKILL.md:103`). A worker asked to write "the approved plan" may
  **author its own rendering** of it rather than copy the approved bytes — the identical
  recall-versus-copy failure §2 identifies, one layer down. Every later carry then points at that
  rendering. The **Process-review** spawn would carry it faithfully, hash and all, and be faithful to
  bytes **the owner never saw**. A green check would be entirely correct and entirely beside the point.

> **⚠️ This is no longer hypothetical. Confirmed on this task, 2026-08-02, during its own review round.**
> `0162/plan.md` (blob `2458a57e…`, 9625 bytes, 123 lines) is **not** the plan the owner approved: two
> distinctive strings from the approved text — the F2 heading *"the decisive structural fact"* and the
> open question *"OQ-4 — timing"* — are **absent** from it, while its section structure (`## 0.`–`## 7.`)
> matches neither the approved plan's. It is the Build worker's **re-rendering**, written at Build time.
> Had the Process-review spawn carried it by pointer with a matching hash, the carry would have verified
> green against bytes the owner never approved. **The gap this section records as a residual was
> exercised, in production, on the task that named it, within hours of naming it.**
>
> **What closes this instance, and what does not.** Follow-up 1 — writing `plan.md` **at plan approval**,
> from the approved text, before any worker is spawned — closes **this** route, because no worker is ever
> asked to reconstruct the plan. It does **not** close the general gap in the bullet above: a driver that
> persists a plan the owner never approved is still undetected. **Fixing the likely route is not fixing
> the class**, and this report does not claim otherwise.

**What is checkable today, before any follow-up:** nothing in this area. The declared-approval marker
fired zero times in the run that installed it. The frontmatter of every skill and agent file is
machine-checked (F5); the **bodies**, where all of these rules live, are checked by nothing.

**The one thing a reader must not conclude:** that a green carry-check hook means the marker held. It
means the pasted bytes match a named file — a proxy for part of one of three conjunctive signals. **No
signal is verified as written; a conjunctive marker is only as strong as its weakest signal; and all
three remain trust.**

---

## 10. Follow-ups — named, not written. Full list, corrected.

The producer files from this section. Two entries changed status under the owner's rulings and are
flagged inline.

| # | Role | Work | Gate |
|---|---|---|---|
| **1** | `fkit-coder` | **Move the sprint loop's `plan.md` write from the Build row to plan approval**, mirroring `fkit-task-ship-loop` step 4 (`:143`); **add the artifact table the sprint loop lacks entirely**, with a `<task-folder>/plan.md` \| *at plan approval* row mirroring `fkit-task-ship-loop/SKILL.md:102`. | **Prerequisite for 2 and 3.** ⚠️ **RANK NOW — DRIVE THIS SPRINT.** Owner ruling on OQ-4, `AskUserQuestion`, live `fkit-lead` session, 2026-08-02, after **R4b** confirmed the failure live. **Note for its author: this closes the reconstruction route only, not the carried-not-approved class** (accepted residual, `review.md`). |
| **2** | `fkit-coder` | **Amend the *"Rules that make this honor the ADRs"* bullet** (`fkit-sprint-ship-loop/SKILL.md`, currently `:110-116`) with the construction of §2 — **byte-exact read (`Bash(cat …)`, explicitly NOT the `Read` tool, which `cat -n`-frames its output and caps at 2000 lines)** → **verify the whole file was read** against `wc -c` → paste unaltered → cite path + `git hash-object` blob — and the **"verbatim"-word discipline**: *a driver may apply the word only to bytes it read from a file that turn.* Include the pointer-only degraded form of §4 and its "never a partial paste" rule. **The amendment MUST state, in the rule text itself, that the emitted pointer is `unverified — no hook checks it until follow-up 3 lands`,** so a self-computed, self-reported hash is never mistaken for a checked one in the window between this follow-up and follow-up 3. | After 1. **Ships without waiting for 3**, carrying that unverified-until-3 wording. |
| **3** | `fkit-coder` | **Build the `PreToolUse`/`Task` carry-check hook + tests.** Carry **all five** caveats of §6 into the brief verbatim: it checks a **carry-fidelity proxy for (b) only** — never (b) itself, which asserts approval; it is **hard-gated on 1**; it is **time-of-check-only (TOCTOU: `plan.md` may be rewritten between the hook's read and the worker's use)**; the jq-free `"[^"]*"` extraction of the sibling hooks **cannot** parse a prompt field and it needs real JSON parsing (`node v24.13.0`, ADR-014 zero-devDeps satisfied); **hooks exist only in launcher sessions** (`.fkit/settings/<role>.json` — this repo has no `.claude/settings.json`, and `.claude/settings.local.json` carries no `hooks` key). | **Hard-gated on 1.** Owner ruled it filed and ranked, not built here (OQ-2). |
| **4** | `fkit-architect` / owner | **Append a dated correction note to ADR-037 §5.** Precisely: §5's sentence *"There is no mechanical enforcement, and none is possible — stated plainly rather than promised"* (`adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md:249-250`) is **too strong** — but **only about a proxy, and the note must say so in those terms.** ⚠️ **Do NOT write that condition (b) is machine-checkable.** (b) reads *"it carries a concrete **approved** plan verbatim"* (same ADR file, `:96-97`; `claude/agents/fkit-coder.md:65-66`); a hook checks **carry fidelity** — *the prompt contains the bytes of the file at path P with hash H* — and can never establish that P is what the owner approved. The note must state: *"none is possible" holds for (a), for (c), **and for (b) as written**; what it does not hold for is a **carry-fidelity proxy for (b)**, mechanically checkable driver-side by a `PreToolUse`/`Task` hook once `plan.md` exists at spawn time (F3, F2)* — in launcher sessions only, at time-of-check only. It must state this is a **narrowing, not a reversal** (all three conditions stay unverifiable as written; a conjunctive marker is only as strong as its weakest signal), and that **ADR-037's pre-registered re-raise trigger (`:362-364`, "a cross-context verification token") has NOT fired**: this is a file, not a token. It must also note it does **not** re-raise `:365-367`'s fenced items — forgeability and unenforced-prose are untouched. Precedent for the form: `0143` (dated correction note to ADR-010). | **REQUIRED** — owner ruled OQ-3 this way. |
| **5** | ~~`fkit-producer`~~ | ~~Single joint reconciliation of condition (b) + `0163`'s clause.~~ **DO NOT FILE.** It was conditional on the owner picking pure by-reference. **The owner rejected pure by-reference (OQ-1), so (b) stands byte-unchanged and `0163` needs no edit** (§5). | **Not filed.** |
| **6** | `fkit-producer` | **Repair `0162`'s own stale citations — two of them, not one.** In `0162/brief.md` `## Context`: `…SKILL.md:109` → **`:110`**, and the quote range `(:109-115)` → **`(:110-116)`**. Consider re-citing by heading + phrase per ADR-037's citation-form block so it cannot go stale again. | — |
| **7** | `fkit-producer` (optional, small) | **Correct the brief's test-surface claim.** `0162/brief.md` `## Context` says *"no test in `test/` reads `claude/agents/fkit-coder.md` or any `SKILL.md` content at all"*. The second half is false — `test/skill-frontmatter.test.js:577`/`:596` read every skill and agent file's **frontmatter** over a pinned corpus. The accurate claim is *"no test reads the **body** of any of them."* (F5.) | — |
| **8** | `fkit-wiki` | **Ingest this report.** | — |

**Two status changes, stated explicitly as instructed:**
- **OQ-1's ruling makes follow-up 5 unnecessary.** It existed only for the pure-by-reference branch,
  which the owner did not take. It must **not** be filed.
- **OQ-3's ruling makes follow-up 4 required**, and it is an ADR amendment, not a report note.

---

## 11. Open questions — both now ruled

> **⚠️ Status note added after round 1 of this task's review, 2026-08-02.** Both questions below were put
> to the owner and **answered** via `AskUserQuestion` in the live `fkit-lead` session. The original text
> is left standing so the reasoning that was put to the owner stays readable; each ruling is recorded
> against it. **Neither is open any more.**

**OQ-4 — timing. RULED: rank follow-up 1 NOW, drive it this sprint.** The owner weighed **R4b — a
confirmed live production failure, not a hypothetical** — against the mid-flight hazard below, and judged
the change to be **to prose in a step table, not to running code**. The "After Sprint 2" argument was
heard and rejected on that ground.

*The question as it was put, retained:* Follow-up 1 changes `/fkit-sprint-ship-loop`'s
behaviour **mid-sprint**, while that same loop is driving Sprint 2. Two considerations pull opposite ways:

- **Now:** every remaining Sprint 2 task ships under the same broken carry this report documents, and
  follow-ups 2 and 3 are both blocked until 1 lands.
- **After Sprint 2:** editing the driver's own step table while it is executing that table is the exact
  hazard class `0164` was separated out for, and a mid-flight change makes any later forensic read of
  this sprint ambiguous.

**No recommendation was offered — it was a sequencing call the owner holds.** It was surfaced rather than
settled because the plan approval folded it in without ruling it. It has since been held and answered,
above.

**The second question — the carried-not-approved gap. RULED: accepted as a recorded residual.** Nothing
here detects a driver that writes a `plan.md` the owner never approved and then faithfully carries it.
The hash pins which bytes were carried, not which bytes were approved (§9). The owner **accepted this
gap** rather than commissioning a control, on the characterization that **the construction is
tamper-evidence against sloppiness, not a guarantee against a driver that fabricates** — approval lives
in a session channel that leaves no artifact (ADR-021), so nothing closes it today.

It is recorded with a **testable re-raise condition** in this task's review ledger
(`review.md` → *Accepted residuals* → `carried-not-approved`), so a later reviewer does not re-litigate
it and a later reader does not mistake the hook — or follow-up 1 — for closing it. **Follow-up 1 closes
only the reconstruction route, not the class.**

---

## 12. Evidence — verified firsthand

Every row was checked against a live file by the author of that row — in the Build turn, or (for rows
added under review) in the round-1 review turn. Paths are given unelided so a later reader can re-run
them; the one row that is **not** reproducible is marked as such.

| Claim | Source |
|---|---|
| The requirement bullet is at `:110-116`; `:109` is the heading | `claude/skills/fkit-sprint-ship-loop/SKILL.md:109`, `:110-116` |
| Sprint loop names `plan.md` **once**, in the Build row; has **no** artifact table | same file, `:103`; `grep -n 'plan\.md'` over the whole file → 1 hit |
| Task loop persists `plan.md` **at plan approval** | `claude/skills/fkit-task-ship-loop/SKILL.md:102`, `:136`, `:143` |
| `0147/`, `0150/` have **no** `plan.md`; `0143/`, `0158/`, `0195/` do | `ls` of all five task folders |
| Condition (b) — *"carries a concrete approved plan verbatim"* | `claude/agents/fkit-coder.md:65-66` |
| Worker cannot verify the marker — trust, not proof | `claude/agents/fkit-coder.md:93-98` |
| Hooks wired by matcher; `PreToolUse` = `Skill` + `AskUserQuestion` only; `Stop`; `UserPromptExpansion` | `claude/fkit-claude.sh:272`, `:296` |
| The `Skill` hook **denies** via `hookSpecificOutput.permissionDecision` | `claude/skill-ownership-hook.sh:41-47` |
| Hook JSON extraction is jq-free and quote-fragile | `claude/skill-ownership-hook.sh:70-79`; `claude/shiploop-marker-hook.sh:28-31` |
| No `.claude/settings.json`; `.claude/settings.local.json` exists with **no** `hooks` key; per-role `.fkit/settings/*.json` present (7 roles) | `ls -a .claude/`, `grep -n hooks .claude/settings.local.json`, `ls .fkit/settings/` |
| `node v24.13.0` present | `node --version` |
| Skill/agent **frontmatter** is machine-checked over a pinned corpus (25 skills, 7 agents); **bodies** are not | `test/skill-frontmatter.test.js:323`, `:574-575`, `:577`, `:596` |
| Only one `test/` reference to `fkit-coder.md`, an `existsSync` | `grep -rn 'fkit-coder.md' test/` → `test/converge-contract.test.js:357` |
| ADR-037 §5 *"none is possible"* | `ai-agents/knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md:247-256` |
| ADR-037's re-raise trigger is a **cross-context verification token**; `:365-367` fences forgeability / unenforced-prose from re-raise | same file, `:362-364`, `:365-367` |
| Condition (b) quoted in ADR-037 as *"carries a concrete **approved** plan verbatim"* | same file, `:96-97` |
| `0163` is `🔲 Backlog`, P142, and keys its clause on (a)(b)(c) rather than on the word | `ai-agents/tasks/backlog/0163-name-the-defective-marker-refusal-case-in-fkit-coder/brief.md:10`, `:13`, `:96-100`, `:138-145` |
| `0150` closed | `ai-agents/tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/` |
| `0157` closed — not an open member of the unenforced-prose class | `ai-agents/tasks/done/0157-state-task-brief-step-5s-append-rule-in-full/` |
| `0195` §7 has **four** OQ rows and says *"All four"* — driver testimony said five | `ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/plan.md:88-98` (heading `:88`, rows `:95-98`; OQ-4 is at `:98`) |
| `0147` §13 *"Retroactive entries — round 1 calls I made unattended and never logged"* is real | `ai-agents/tasks/done/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/worklog.md:481`; the `C8c`/`C8d`/`NC4` checks at `:164-171`, results at `:208-218` |
| No transcripts stored → driver self-reports unverifiable | `find . -name "*.jsonl"` excluding `node_modules/` → empty |
| `git hash-object` works on **untracked** files; today's `plan.md` files are untracked | `git hash-object ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/plan.md` → `fc69b74…`; `git status --porcelain` shows those paths as `??` |
| **`git hash-object` without `-w` stores nothing** — the audit-value correction in §3 | `git hash-object <untracked plan.md>` → `2458a57e…`, then `git cat-file -e 2458a57e…` → object **absent** |
| **`0162/plan.md` is not the approved plan** — the §9 residual, confirmed live | `git hash-object` → `2458a57eda55ca774884110e76dee1bf91b6d6e0`, 9625 bytes, 123 lines; `grep -F` for *"the decisive structural fact"* → **absent**, for *"OQ-4 — timing"* → **absent**; headings `## 0.`–`## 7.` match neither the approved plan's structure |
| `0162/` contained only `brief.md` at the start of the Build turn (the §0.1 self-demonstration) | `ls -la` of the task folder at that time. **⚠️ Not reproducible** — the folder now holds `brief.md`, `plan.md`, `worklog.md`, `review.md`. This row is the Build worker's firsthand observation of a since-changed state, **not** a check a later reader can re-run; by §0's taxonomy it sits nearer testimony than disk evidence, and it supports no conclusion on its own. |
| Suite green | `npm test` → `tests 560 / pass 560 / fail 0`; prove-red hard gate passed (13 mutations, each reds its named assertion) |

**Not verified, and flagged as testimony (§0):** the driver's round-1 and round-2 accounts, its
full-paste claims for `0158`/`0143`/`0195`, its `0195` §7 near-miss report, its account of the owner's
four rulings, and its disclosure about this report's own spawn prompt. **No transcript exists to check
any of them.**

---

## Related

- [`ADR-021`](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) — the owner channel is session-only. Why worker-side detection is impossible.
- [`ADR-031`](../decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) — the plan-gate honesty clause; the accepted prose-enforced cost.
- [`ADR-032`](../decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) — Decisions 3 and 7; the declared-approval marker's home.
- [`ADR-037`](../decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md) — §5's enforcement claim, narrowed by §7 above. **Correction note owed (follow-up 4).**
- `0163` — worker-side refusal of a carry defective on its face. Complementary; not detection; needs no edit under this ruling.
- `0164` — build-phase logging in the same `SKILL.md` follow-ups 1 and 2 edit. Coordinate on the file; neither decision depends on the other.
