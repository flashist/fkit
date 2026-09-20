# ADR-049: `author` is a CLAIM plus the channel it came through — fkit stops demanding a verified human principal no channel can supply, and anchors human verification at the git commit

- **Status:** `accepted` — **signed by the owner on 2026-09-18** (see *§Authority*, ruling 3). He had
  already ruled on the **content** (ruling 2); the signature puts it in force. The two items in
  *§Open questions* remain **his and unanswered**, and he was told so before signing.
- **Date:** 2026-09-18. ⚠️ **Decision REVISED the same day**, after `fkit-external-expert`'s verdict
  landed and the owner ruled for the expert's content. The pre-verdict Decision is **not deleted** — it
  is preserved, with its reasoning intact, in *§Option F — considered and NOT taken*.
- **Filename:** deliberately unchanged. Its slug (*"…no channel supplies one"*) is still **factually
  true** and is the clause the expert's verdict agrees with; only the *prescription* the old title
  implied ("therefore fkit must demand one") is reversed. Keeping the path means the citations already
  written by `fkit-lead` and by the expert's verdict keep resolving.
- **Deciders:** **the owner** (two rulings, both relayed verbatim in *§Authority*, plus the two open
  questions in *§Open questions* which are his and are **not** answered here). Everything else is
  **`fkit-architect`'s**, made under those rulings, and is marked where it is decided.
- **Provenance legend, used throughout and glossed once:** **[A]** = `aiboard-lead`'s claim about its
  own system, unverified by fkit. **[A✓]** = that claim independently re-verified by
  `fkit-architect` against aiboard's source at HEAD `df554b9`. **[M]** = measured fkit-side by
  `fkit-architect`. **[X]** = measured or read by `fkit-external-expert` itself, per its verdict's own
  tag. **[M✓]** = an [X] figure re-checked by `fkit-architect` in this revision.

> ## ⚠️ REVISION NOTICE — THE VERDICT LANDED AND IT CHANGED THE DECISION
>
> This ADR's first draft carried a banner saying it was written ahead of `fkit-external-expert`'s
> verdict and *"may need revision, including reversal of its recommendation, when the expert answers."*
> **It did.** The verdict
> (`2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md`, *§3 Attack 3* and *§4 Q11*)
> contradicts the recommended direction (option F). **The owner ruled for the expert's content on
> 2026-09-18** — ruling 2 below. The Decision section is rewritten to that ruling.
>
> ⭐ **The old banner is quoted rather than deleted because it did its job:** it told the reader not to
> build on a pre-verdict draft, and the draft was in fact overturned. That is evidence the warning
> convention works, and it stays on the record.

> ## ⛔ SCOPE — THIS IS ABOUT ANOTHER PROJECT'S ARCHITECTURE, AND fkit CANNOT DECIDE IT
>
> *(Unchanged by the revision. The expert's verdict independently agrees — its §7: "Nothing here pushes
> a fkit governance concept into aiboard's core.")*
>
> The identity gap is **aiboard's**. fkit does not own aiboard's design and **may not decide it
> unilaterally.** So this ADR is deliberately narrowed to the half that is fkit's to state:
>
> - **fkit states the REQUIREMENT** — what a close must be attributable to before fkit will record it
>   as owner-verified. That is fkit's own governance and it outlives whatever aiboard builds.
> - **aiboard specifies the MECHANISM**, on aiboard's own board, where it can be superseded without
>   touching this record.
>
> **`aiboard-lead` was offered co-authorship of this ADR and declined**, proposing exactly that split;
> `fkit-lead` accepted it and so does this ADR. **It was also offered the option of hosting the
> decision on aiboard's side instead. Both offers stay open.** If `aiboard-lead` or the owner would
> rather this live on aiboard's board, this file is superseded by that record, not defended.

---

## Authority — the owner's rulings, verbatim

### Ruling 3 — 2026-09-18, the signature — **this ADR is `accepted`**

**How it was given:** live in a `fkit lead` session, via `AskUserQuestion`, relayed by `fkit-lead`.

**What he was shown before signing,** in plain language: that **no channel here can tell a human from
an agent**; that the owner-verified stamp was **never a lock, only a label**; that **claim-plus-commit
makes the label truthful**; and that **closing T-022 is a precondition of this decision, not a
follow-up to it**. He was also shown that **two of this ADR's open questions remain unanswered and are
his**. He chose to sign.

⚠️ **No verbatim sentence was relayed for this ruling** — unlike rulings 1 and 2, which are quoted
above. This entry records the **act and its date**, not the owner's words, and must not be cited as a
quotation.

⛔ **The signature changes the Status line and nothing else.** The Decision, the options, the
corrections of record and the open questions stand exactly as they were written and ruled.

### Ruling 1 — 2026-09-18, on how to handle the identity gap *(unchanged)*

Asked how to handle it (an ADR for his signature / file it as a task and decide later / ignore it
because a read-only board makes it moot), he chose the ADR, and added:

> *"#1, and I also want you (and maybe the other leads, Codex, and external-expert) to think about
> removing the web dependency at all, and maybe investigating what can be done in Terminal UI. Whether
> we can achieve something user-friendly here, that resembles the Trello/Jira board (if there is an
> option to do that, we may give it a try, without removing web first, compare them, and after that
> make the final decision)."*

⭐ **Two things in that sentence bind this ADR.** The terminal UI is a **first-class option**, not a
footnote — precisely because it might *remove the need* for an identity mechanism rather than specify
one. And his **sequencing is explicit: build alongside, compare in practice, then decide.** He does
not want the web board removed first, and this ADR does not remove it.

### Ruling 2 — 2026-09-18, on the content of this ADR *(NEW — this is the ruling that rewrote the Decision)*

`fkit-lead` put the choice to him as **this ADR's option F** (propose-only plus fkit's owner-present
consent channel; the marker records what fkit *observed*) against **the expert's claim-plus-commit**.
His selected option, verbatim:

> *"Claim-plus-commit, per the expert — Author becomes an explicit CLAIM plus the channel it came
> through — no pretence of proof. Human verification lives at the git COMMIT, which is the one real
> human checkpoint fkit actually has. Its argument: a browser drag writing plain ✅ Done gives an
> attacker no forgery power that running Bash doesn't already give, so the gate was never
> load-bearing. Fix T-022 and stop there."*

⭐ **What ruling 2 binds, stated precisely so it is not over-read:**

- It settles the **content** of the Decision: claim-plus-commit replaces option F.
- It does **not** sign the ADR — status stays `proposed`.
- It does **not** answer OQ-1 or OQ-2, which remain his (*§Open questions*).
- ⚠️ **It relays the expert's argument as the reason.** `fkit-lead` explicitly asked the architect to
  **test that argument rather than adopt it on relay**. That test is *§The load-bearing sentence,
  tested* — it **holds where the ruling rests on it** and **fails as worded**. The ruling stands.

---

## Context

### C1 — The requirement fkit already has, and where it came from *(unchanged)*

fkit's shipped rule: *"Task files AND sprint boards reach `done/` or `cancelled/` only via the four
movers … **Only the producer may invoke them**; anything an agent closes MUST carry the
`(agent-closed — not owner-verified)` marker."*

`aiboard-lead` proposed a reframe, quoted in the source report under *§Q11*: if a **human** drags the
card, the close is owner-verified by definition, so the marker would be *"factually wrong on that
row"* — therefore pass through **who initiated the transition** and let fkit pick the marker.

**fkit accepted the marker-semantics half and still does.** A marker that lies defeats the only thing
it is for. **The plumbing half is what failed.**

> ⚠️ **Revised reading, 2026-09-18 under ruling 2.** The first draft concluded from this that fkit must
> therefore *refuse* board-originated closes until a verified principal exists. The expert's verdict
> reaches the opposite disposal from the same premise (*§3 Attack 3*): *"a plain `✅ Done` can already
> be typed by any agent with an editor … The marker is a labelling convention among cooperative
> agents, as ADR-025 says of itself. Let it be that."* ⭐ **Both readings agree the plumbing fails.
> They disagree on whether the marker was ever a security control. The expert is right that it was
> not** — and ADR-033 had already said so about its own gate: *"the win is structural role-separation
> at the mover, not a laundering-proof gate."* [M✓]

### C2 — The verified facts. All three were checked, not reasoned about. *(unchanged; expert concurs independently)*

1. **aiboard has no identity mechanism at all.** [A✓] The server reads the actor from the request
   body, unvalidated, with a default — `aiboard/server.py` at `df554b9`:
   `author = str(body.get("author") or "web").strip() or "web"`. In the browser that value comes from
   a free-text box the user types into. A grep of the package for auth / token / session / cookie /
   CSRF constructs returns zero. **Anything that can reach the port can claim to be anyone.**
   ⭐ **Third-party confirmation:** the expert read the same code and returned **"True"** [X]
   (*§1*, row *"aiboard has no identity"*).

2. ⛔ **Worse than "no identity": there is an anonymous *remote* write path, and it is a live defect,
   not a hypothetical.** [A✓ at the mechanism level] `aiboard-lead` **tested** rather than reasoned
   and found that **unauthenticated cross-origin writes are accepted, because the server validates no
   request headers.** `fkit-architect` independently confirmed the mechanism at `df554b9`: the server
   checks no `Origin` and no `Referer`, and `_body()` parses the payload with `json.loads` on the raw
   bytes with **no check of the declared request `Content-Type`** — the only `Content-Type` the file
   touches is the one it *sends* in `_send`. Binding to `127.0.0.1` is no defence, because the browser
   making such a request is already inside. **Consequence: any page the owner visits while the board
   is being served can write to his board — status, create, assign, edit, comment, sprint moves — and
   the write is recorded under whatever author it names.**

   ⚠️ **Added 2026-09-18 from the verdict [X]:** the expert independently confirmed the same defect
   class by reading `server.py`'s `do_POST`, and found **one class more than fkit had recorded** —
   there is **no `Host` check either, so DNS-rebinding is not excluded.** Named as a class; nothing
   further about it appears here.

   > ⚠️ **Deliberately described as a defect class and nothing more. No payload, no reproduction
   > steps, no working exploit appears in this git-tracked document.** `aiboard-lead` filed it on
   > aiboard's own board as **T-022** with the repro; that is its correct home.
   >
   > ⭐ **And it is fixable in the web board** — requiring a JSON content type alone restores the
   > preflight the server does not answer. **This is not an argument that the web board is
   > unsalvageable.** It is a measurement of what *serving HTTP on a local port with no auth* costs.
   > The expert prices the whole fix — content type, `Origin`/`Host` against the bound address, a
   > per-launch token in the served page — at **"~20 lines"** [X].

3. **aiboard's CLI already has the identity story a terminal UI would have, and it is weak.** [A✓]
   `aiboard/cli.py` at `df554b9`:
   `DEFAULT_AUTHOR = os.environ.get("AIBOARD_AUTHOR") or os.environ.get("USER") or "agent"`.
   **Environment-derived — set by whoever launched the process.** This is the fact that kills the
   terminal-UI identity argument; see *§The OS-identity argument*.

4. **Codex reached the same hole independently**, from the report alone, without either codebase:
   *"A browser user is not 'the owner by definition'. A UI channel identifies where a request came
   from, not who authorized it … Initiator and approver must be separate authenticated principals."*

### C3 — fkit's standing dissent (report §8.3.2 W3) — ⚠️ **HALF WITHDRAWN, 2026-09-18**

Codex's recommended plan gates browser writes behind its step 11 — *"Enable browser writes only after
recovery, concurrency, and **authorization** tests pass."* **There is no authorization to test.**

⛔ **The half that STANDS:** step 11 is a contradiction. The expert's verdict agrees in its own words
(*§3 Attack 3*): *"The architect is right that it is a contradiction."*

⛔ **The half that is WITHDRAWN:** the first draft's remedy — scope an **identity spike** — is wrong,
and `fkit-architect` withdraws it. The expert (*§3 Attack 3*): *"wrong about the remedy … the
architect's fix — an identity spike — hunts for something that cannot exist in this deployment."*
⭐ **`fkit-architect` accepts that in full and did not need the owner to rule it**: the argument is the
same one this ADR already made against the TUI (*§The OS-identity argument*) — one uid, agents with
unrestricted tools (ADR-022), any secret the UI can read an agent can read. **Having made that
argument against someone else's mechanism, carrying an identity spike of its own was inconsistent.**
The correct disposal is the expert's: **delete the authorization gate from the plan** and replace it
with D1–D4 below.

### C4 — Constraints this ADR must respect, and does *(unchanged)*

- ⭐ **aiboard must remain usable by someone with no fkit and no framework at all.** The owner has
  never withdrawn this. Any identity mechanism must make sense for a solo user with no agents.
- **fkit's governance stays fkit-side.** The role model, the producer-only movers and the literal
  `(agent-closed — not owner-verified)` string do not become aiboard concepts.
- ⚠️ **Where the line between those two sits is the OWNER'S to draw, and it has not been drawn.** The
  reconciliation both leads have been operating under is, in the source report's own words, *"the
  leads' construction, not the owner's ruling."* **This ADR does not assume it again — it asks him.**
  See *§Open questions* OQ-1.
- **Zero dependencies is a PREFERENCE, not a constraint** — conceded to Codex, recorded here so it is
  not quietly re-promoted to protect an option.
- ⛔ **Readability is UNMEASURED for both products, in both directions.** The source report's §7
  records that **neither** product has ever been used by a non-agent human. So *"a browser is more
  readable than a terminal"* is an unmeasured claim, and so is its opposite. **This ADR asserts
  neither.** ⚠️ **Still true after the verdict** — the expert's §1 *"Did not check"* says plainly:
  *"Nobody — including me — has yet watched the owner use it. That is still the missing evidence."*

### C5 — ⛔ NEW, and it cuts against `fkit-architect`: the drift argument was measured and it is FALSE

⚠️ **Added 2026-09-18. This is a correction of record against an argument this architect carried, and
it is recorded here for the same reason anyone else's would be.**

The expert ran the audits the source report's §7b listed as **never run**. Results, all [X], all
against the live tree, with counting rules stated in its *§1 New measurements*:

| Audit | Result |
|---|---|
| Folder prefix vs `## ID` | **0 mismatches / 405** |
| Duplicate ids | **0** |
| Live board row vs brief — **glyph *and* agent-closed marker** | **0 disagreements / 403** |
| `## Sprint` vs the board holding the live row | **0 disagreements / 403** |
| Tasks with more than one live row | **0** |
| `## Status` glyph vs folder | **1** — `0014` only |

⭐ **What it means, stated against interest.** Both leads argued fkit's duplicated carriers *would*
drift the way status drifted. **Measured, they have not.** The expert: *"Every live board row is
derivable from the briefs today, with zero exceptions — the rows are pure redundancy, and redundancy
that has held … The three famous defects were born wrong in one bulk migration; nothing has drifted
since."* **That supports Codex's item 6** (the drift evidence condemns the checker's coverage, not
redundancy) **and weakens an argument `fkit-architect` carried.** It is recorded, not softened.

⭐ **Reproduced, and the scripts are preserved.** The audit scripts were re-run by the expert from
their preserved location — `ai-agents/tasks/backlog/0404-evaluate-aiboard-…/assets/external-expert-spike/`,
whose README is headed *"THROWAWAY SPIKE — a demonstration, not a component"* — and **reproduced these
results exactly**: 516 status-led rows, 113 of them `➡️`, **0 disagreements of 403**, and no-live-row on
exactly `0004` and `0014`. ⚠️ **Cost flagged with the move, so it is not lost:** that folder travels
when task `0404` closes, and the verdict's §8 links into it — **a link a future mover must repoint.**

⚠️ **Two limits on it, so it is not over-read either:**
- It is **one run of one model** on one tree on one day; the expert flags its own bias (*§6*: *"I have
  a bias toward not building"*). It is a strong datum, not a permanent property.
- The expert **withdrew** its own dependency-graph numbers in the same section as unreliable (prose
  contains **negated ids** — *"0128 does not depend on…"* parses as a clean, false edge). ⭐ That
  withdrawal raises confidence in the six audits above, not lowers it: the same run distinguished its
  sound measurements from its unsound one and said so.

### C6 — ⛔ NEW, and it is the real write-side blocker: **fkit's transaction is prose, and it is ours**

⚠️ **Added 2026-09-18 from the verdict. Nobody in this investigation had named it.**

The expert (*§0.3*): *"The real write-side problem is on fkit's side and nobody named it: fkit's
'transaction' is a **460-line prose procedure executed by an LLM**. No lock, hook, queue or shared
service can coordinate with that."*

**[M✓] `fkit-architect` re-measured all four movers rather than accept the one figure:**

| Mover skill | Files | `SKILL.md` lines | Executable script |
|---|---|---|---|
| `fkit-task-done` | 1 | **460** | **none** |
| `fkit-task-cancelled` | 1 | **422** | **none** |
| `fkit-sprint-done` | 1 | **456** | **none** |
| `fkit-sprint-cancelled` | 1 | **476** | **none** |

⭐ **The expert's figure is right and understates the problem: it is not one 460-line prose
transaction, it is four, totalling 1,814 lines, and none of the four has a script to call.**

**Why this lands on ADR-049 specifically.** Every mechanism anyone proposed for the close gate — Codex's
"one transition service used by CLI, HTTP, MCP, browser and fkit", `aiboard-lead`'s hook,
option F's proposed-transition queue — assumes there is **something to link into or shell out to.**
There is not. The expert's *§3 Point 9*: *"There is nothing to link the library into."* And its
remedy turns the whole Q11 argument around:

> Make the movers a deterministic command first (folder rename **last**). After that, aiboard's hook
> becomes a **delegate, not a veto**: *drag → command → exit code → UI.* **No queue needed.**

⛔ **`fkit-architect`'s judgement: this is real, it is fkit architecture, and it does NOT belong in
this ADR's Decision.** It is recorded here as the **binding dependency** of D-future and deferred to a
sibling ADR — see D8 and *§Open questions* note. **Reason: this ADR decides what a close *claims*;
that one decides how a close is *executed*.** Fusing them would make each harder to supersede, and the
write-path change has its own consequences (ADR-033's producer-only rule, ADR-029's folder authority,
the skill-ownership hook, a test surface that does not exist today) that deserve their own record.

---

## Decision

> ⚠️ **This entire section was REWRITTEN 2026-09-18 under owner ruling 2.** The pre-verdict D1–D5 are
> preserved verbatim, with their reasoning, in *§Option F — considered and NOT taken* and
> *§Options considered*. **Nothing was deleted to make this section read cleanly.**

**D1 — `author` is a CLAIM plus its channel. fkit records both and asserts neither as proof.**

> **Every tool-written transition records `{claimed_actor, channel}`. fkit never infers verification
> from the channel. A transition arriving from a browser, a terminal, a CLI or an agent is recorded as
> *claimed by X, via channel Y* — and that is all it is.**

⭐ **Read the retreat honestly: fkit stops asking a question that has no trustworthy answer anywhere
in either system.** The pre-verdict draft asked *"did I watch a human approve this?"* and concluded
fkit must refuse everything else. The expert's objection is that the conclusion is disproportionate to
a threat the system already carries everywhere — see *§The load-bearing sentence, tested*.

**D2 — Human verification is anchored at the git commit — and its strength is stated, not assumed.**

fkit's hard rule *"Never commit or push unless the owner explicitly asks"* is the one point in the
system where a human is reliably in the loop. That is where a close becomes owner-verified in any real
sense.

> ⚠️ **`fkit-architect`'s caveat, and it is required reading with D2.** The commit checkpoint is
> **stronger than the marker and weaker than proof**, on two counts:
> 1. **It is a cooperative convention, exactly like the marker.** An agent has unrestricted tools
>    (ADR-022) and can run `git commit`. Nothing mechanically prevents it; the rule does.
> 2. **It authorizes; it does not verify content.** The owner saying *"commit"* does not establish
>    that he read the diff. Calling it *"verification"* claims more than the mechanism delivers.
>
> ⭐ **This matters because upgrading a convention into proof is precisely the error this ADR was
> opened to prevent.** D2 is adopted as **the best available human checkpoint**, named as such. The
> expert's own optional escalation is the only thing on the table that would make it genuinely
> unforgeable by an agent: *"a signing key that needs a passphrase or hardware touch — the one thing an
> agent cannot do."* ⚠️ **Not adopted here, not rejected — no requester, and it is a new OQ if the
> owner ever wants the stronger property.**

**D3 — The marker keeps its meaning and stops pretending to be a control.**
`(agent-closed — not owner-verified)` remains **mandatory** on anything an agent closes, and it remains
**true**. What changes is what fkit claims for it: it is *"a labelling convention among cooperative
agents"* — the expert's words, and ADR-025's own words about itself. **fkit does not defend it as a
security boundary, and does not build further mechanism to enforce it.**

**D4 — ⛔ Closing T-022 is a PRECONDITION of enabling any write mode. It is not a follow-up item.**

> **fkit does not enable board-originated writes against its tree until T-022 is closed. Not
> "afterwards", not "in the same sprint" — before.**

⭐ **Why the wording matters, and it is the difference between a true claim and a false one.** D1–D3
rest on *"this channel adds no forgery power."* That is true **of an actor that already has Bash** —
every fkit agent (see *§The load-bearing sentence, tested*). It is **false of T-022's actor**, which is
a **third-party web page with no Bash, no editor and no repo access**: for that actor the web write
path is not a duplicate of an existing power, it is **the only power it has.**

⚠️ **So the honest statement of this ADR's position is not** *"we accept a channel that adds nothing"*
**but** *"we accept a channel that adds nothing **once one specific hole is closed**."* **Only the
second is true, and D4 is what makes the ADR say the second.**

Gate browser writes on the T-022 fix **plus recovery and concurrency tests**, and delete the
"authorization tests" clause of Codex's step 11 (C3). ⛔ **The fix is aiboard's, on aiboard's board.
fkit specifies nothing about it** — fkit states only that it will not accept writes before it lands.

**D5 — Interim posture: fkit's board is served read-only.** [A✓] `aiboard serve --read-only` ships
today (`aiboard/cli.py`: *"disable editing from the browser"*) and the server's read-only branch
rejects the request **before** the body is parsed, so it also closes C2 for fkit's board without
waiting on T-022. ⭐ **Carried over from the pre-verdict draft unchanged, and now cheaper to hold:**
the expert reaches the same posture (*§3 Point 9*: *"serve fkit's board read-only"*) and notes it
*"no longer needs approving — it exists."*

**D6 — The terminal UI is evaluated ALONGSIDE the web board and neither is removed first**, per
ruling 1. ⛔ **On usability, not identity** — the identity argument for it failed (next section) and
the expert concurs *"in full."* ⚠️ **It is a change of premise** (OQ-2). The expert's ordering, which
`fkit-architect` endorses: read-only spike on the real tree first → Node port with the seam, T-021 and
T-022 folded in → *then* a TUI as a second thin consumer of the same snapshot contract.

**D7 — fkit does not specify aiboard's mechanism.** Unchanged. The mechanism task is aiboard's, on
aiboard's board.

**D8 — The deterministic-movers decision (C6) is DEFERRED to a sibling ADR and is a BLOCKER on any
board-originated write.** ⛔ **This ADR states the dependency and stops.** Until the four movers are a
deterministic command, *"drag → command → exit code → UI"* has no command to call, and D5's read-only
posture is not merely prudent — it is the only implementable one.

---

## ⚖️ The load-bearing sentence, tested — `fkit-architect`'s verdict

`fkit-lead` asked for this rather than a relay. The sentence the ruling rests on:

> *"A browser drag writing plain `✅ Done` gives an attacker no forgery power that running Bash doesn't
> already give."*

⭐ **Verdict: it HOLDS, on the scope it actually claims — including the one point its author flagged as
unverified, which `fkit-architect` has now verified empirically. The ruling stands.**

⚠️ **The claim must be tested as it means itself, and it is narrower than the relay makes it sound.**
The expert scopes it: it claims only that **the web channel is not the weak point — the shared uid
is.** It does **not** claim forgery is acceptable, that the marker is worthless, or that the external
actor of C2 is covered. *(It separates that actor itself: "T-022 is an **external** attacker … unlike
an agent.")* ⛔ **Refuting a broader version would be the same failure mode this investigation has
already logged twice today, so it is not done here.**

### The one thing it did not verify — and `fkit-architect` ran it

The expert took two premises from CLAUDE.md and the source report's §5 quotations rather than from
code, and **named the check that would refute it**: does any hook block a **non-`Skill`** write — an
`Edit`/`Write`/`Bash` into `ai-agents/tasks/done/`, or an edit to a brief's `## Status`? **If such a
guard exists, the sentence fails.**

**[M✓] It does not exist. Checked against the launcher's own hook registration, not reasoned about:**

| Hook | Registered event + matcher | Can it see a file write? |
|---|---|---|
| `skill-ownership-hook.sh` | `PreToolUse`, matcher **`Skill`** | **No** |
| `askuserquestion-marker-hook.sh` | `PreToolUse`, matcher `AskUserQuestion` — and *"RECORDS ONLY — NEVER DENIES"* | **No** |
| `carry-check-hook.sh` | `PreToolUse`, matcher `Agent\|Task` | **No** |
| `turn-completion-hook.sh` | `Stop` (no matcher — fires after the fact) | **No** |
| `shiploop-marker-hook.sh` | `UserPromptExpansion` | **No** |

⭐ **That is the complete registered set** — `build_settings()` in `claude/fkit-claude.sh` emits
exactly these five and nothing else, and the settings file it writes contains **only** a `hooks`
object: **no `permissions.deny`, no tool denylist.** `Edit`, `Write`, `MultiEdit`, `Bash` and
`NotebookEdit` are matched by **none** of the three `PreToolUse` matchers.

⛔ **So both of the expert's premises are confirmed at the source:** (a) ADR-022 leaves tools
unrestricted for every role but the adversarial reviewer, and (b) **the ADR-018 hook guards `Skill`
invocations, not file edits.** *No hook anywhere in fkit can observe — let alone deny — a write into
`done/` or an edit to a `## Status` line.*

⭐ **And there is standing observational evidence, which needed no new writing to obtain:** this repo's
own working tree currently carries **modified briefs under `ai-agents/tasks/done/`** (`0021`, `0041`),
edited by ordinary tooling, with no gate anywhere in the path. **The guard the refutation looked for
would have had to stop those.**

**Combined with C6, the conclusion is stronger than the expert put it.** [M✓] The four movers are
prose with **no script**, so there is not merely no hook on the write path — **there is no privileged
code path at all**, hence nothing for a drag to route around. ⛔ **The pre-verdict draft proposed a new
gate against an actor that was never gated, in a system that has no gate to strengthen.**

### Where the scope must be carried, not dropped

**The sentence is true of every actor that already has Bash. It is not a statement about T-022's
actor, and the expert does not claim it is.** ⚠️ **The risk is the relay, not the claim:** compressed
to *"gives an attacker no forgery power"*, the scope disappears and the sentence reads as covering an
adversary for whom it is false. ⭐ **D4 is what stops this ADR inheriting that compression** — T-022 as
a **precondition**, not a follow-up.

> ⚠️ **Correction against `fkit-architect`, same day, recorded under the same discipline as everything
> else here.** This section first returned *"HOLDS where the ruling rests on it, FAILS as worded"* and
> attributed the unscoped *"an attacker"* to the claim itself. **That was an over-read of a relayed
> paraphrase.** Read in its own context the expert had already separated the external actor and gated
> browser writes on it. **The finding survives as a wording risk in the relay chain; it is withdrawn as
> a defect in the expert's reasoning.**

⚠️ **One thing the sentence does not address, flagged rather than folded in.** It reasons about
*forgery* — adversarial intent. The governance worry is also about **rate**: a drag makes an unmarked
close reachable by routine, not only by an adversary. **On inspection that is not a defect of the
drag** — if a human really dragged it, D1 records exactly that, *claimed human, channel browser*, and
claims nothing more. **Recorded because it is the obvious objection and it should be visibly answered,
not silently dropped.**

---

## ⛔ The OS-identity argument: FAILED, and the detail is the valuable part

*(Unchanged by the revision. ⭐ Independently confirmed: the expert's §5 — "Identity: no help. Same
uid. I agree with `fkit-lead`'s retraction in full." — concurring on all three points below.)*

`fkit-lead` advanced this and explicitly asked for it to be verified rather than inherited:

> *aiboard's "anyone can claim any name" is a property of serving HTTP on a local port. A terminal UI
> is a process the user launched from their own shell, so the OS already knows who they are: the human
> path gets an authenticated principal for free. The agent path stays separate by construction.*

**It fails on three points, each independently sufficient. `aiboard-lead` refuted it against its own
source; `fkit-lead` accepted the refutation; `fkit-architect` re-verified point 3 directly.**

1. **The OS knows which *user*, not which *kind of actor*.** A TUI yields a uid. In this setup the
   human and every agent run as **the same uid** — fkit's agents are Claude Code sessions the owner
   launched, running as him. The gap is human-vs-agent; **that distinction does not exist at the OS
   layer here.** There is nothing to read.
2. **"By construction" is not construction.** Agents run shell commands. An agent can run a TUI and
   can drive a pty. Nothing prevents it.
3. **The premise is already disproved by shipped code.** [A✓] aiboard's CLI *already* has the identity
   story a TUI would have — `AIBOARD_AUTHOR or USER or "agent"`, environment-derived — and that is
   exactly the "a channel asserts a name" weakness §Q11 already calls insufficient. **A TUI's author
   string would be no better than what the CLI does today.**

⛔ **Therefore: the identity gap SURVIVES a terminal UI intact.** If fkit needs *"a human did this"*,
**neither a browser nor a terminal can tell it so today.**

### ⭐ The argument that DOES survive, and it is the stronger one

> **A terminal UI does not *create* identity. It *removes an anonymous write path*.**

That is a real, measured security benefit (C2) and it is the honest case for the TUI. It is a
**smaller** claim than the one it replaces: it improves the attack surface, it does **not** establish
a principal. ⚠️ **And the verdict shrinks it further** (*§5*): *"so does a ~20-line fix to T-022. That
is an argument for fixing the server, not for a second UI."* **`fkit-architect` accepts that**; the
same benefit is free today via D5.

---

## ⛔ Option F — CONSIDERED AND NOT TAKEN

> ⚠️ **Recorded, not deleted.** F was `fkit-architect`'s own proposal and the pre-verdict draft's
> recommended direction. **It is preserved in full, with its reasoning, because the house discipline
> for a rejected option applies to the architect's own proposal exactly as it applies to anyone's.**
> **Not taken by owner ruling 2, 2026-09-18** (*§Authority*).

**What F was, as drafted:**

> ⭐ **F — Confirmation instead of attribution (`fkit-architect`'s addition, and the recommended
> direction).** Combine E with the one channel fkit can actually observe: aiboard records a
> **proposed** transition; a fkit producer, in an **owner-present session**, applies it and takes the
> owner's confirmation through fkit's existing consent mechanism (ADR-021's session-only channel, the
> same shape as ADR-039's consent-gated repair). The marker then reflects **what fkit observed**, not
> what a request body claimed. **It is the only option on this list whose claim is backed by something
> the system can verify**, and it needs no new identity primitive in aiboard.
> - ⚠️ **Its cost, stated plainly:** a browser drag is no longer a one-gesture close — it becomes a
>   proposal the owner confirms elsewhere. That is a real loss against his stated wish.
> - ⚠️ **And it may cross the §1.4 line:** it requires aiboard to gain a "proposed transition" concept.
>   Whether that is a *generic* mechanism or fkit governance leaking into aiboard's core **is exactly
>   the line the owner has not drawn.**

**And its accompanying pre-verdict decisions, also preserved:** *"D2 — Until a mechanism satisfying D1
exists, fkit does not accept board-originated closes"*, with Q11-A and Q11-B both off the table.

**Why it was not taken — four reasons, the first three the expert's and the fourth the architect's own:**

1. **It bought a property the system does not have anywhere else.** F's whole value was an *observed*
   confirmation. The expert's point is that fkit's other close paths, its commits and its file writes
   are all unobserved already — so F hardened one door in a paper wall (*§3 Attack 3*: *"fitting a
   steel door to a paper wall"*).
2. **It cost the owner the thing he asked for.** F's own cost line conceded it: a drag stops being a
   one-gesture close. Ruling 1 asked for a board he could *"maybe change something"* on.
3. ⛔ **It could not be built.** C6 is decisive and was unknown when F was drafted: F's
   proposed-transition queue needs a producer-side applier, and fkit's applier is **1,814 lines of
   prose across four skills with no script**. **F was unimplementable on the day it was recommended
   and its author did not know it.** ⭐ *That is the single strongest argument against F, and it is not
   the one the owner ruled on.*
4. **It leaned on OQ-1, which is still unanswered.** F required a new concept inside aiboard, on a line
   the owner has not drawn. Recommending it meant recommending a mechanism whose admissibility was
   unknown.

⭐ **What survives from F and should NOT be lost with it:** the *insight* that fkit can only ever speak
about what it **observed**. **D1 keeps it** — a claim plus a channel is an honest record of exactly
what fkit observed. **F's error was not the insight; it was inflating "I observed a consent prompt"
into "a human is verified."**

⚠️ **Re-raise F only if** the owner answers OQ-1 permissively **and** the deterministic movers (C6/D8)
exist **and** he decides after using the board that a confirmed-proposal flow is what he wants. **All
three, not any one.**

---

## Options considered *(annotated with outcomes; no option removed)*

- **A — Do nothing; read-only board.** Codex's recommendation. ⭐ **Now the adopted interim posture
  (D5)**, and the expert reaches it independently. Still not the permanent answer, because it parks
  drag-to-Done.
- **B — Terminal UI.** ⛔ **Rejected as an identity mechanism** (three points above; expert concurs
  "in full"). **Retained per ruling 1 as a usability candidate**, sequenced per D6.
- **C — Real authentication on the web server** (token or session). ⚠️ **Partially ADOPTED, narrowed,
  and re-homed.** As an *identity* answer it still fails for the reason first recorded here — it
  authenticates *a request*, not *a human*, so an agent holding the token is indistinguishable from the
  owner. ⭐ **But as the T-022 fix it is exactly right**, and that is where D4 sends it: a per-launch
  token plus header checks, on aiboard's board, ~20 lines [X].
- **D — Structurally separate write paths.** ⛔ **Rejected, unchanged. An endpoint is not proof a human
  used it.** C2 demonstrates that an *arbitrary web page* can post to any endpoint. This option
  mistakes a route for a principal.
- **E — Propose-only.** aiboard emits *proposed* transitions to a queue the consuming project applies.
  ⛔ **Rejected, and the reason CHANGED.** The draft rejected it as insufficient alone; the expert
  rejects it as **unnecessary**: *"No queue once the mover is a millisecond script."* ⚠️ It survives
  only as an owner-chosen stopgap — the expert's *"append-only request file the producer drains at
  session start"*, whose **drain latency is "next producer session"**, a number the owner should hear
  before choosing it.
- ⭐ **F — Confirmation instead of attribution.** ⛔ **Not taken — owner ruling 2.** Full text and
  reasoning preserved above.
- ⭐ **G — Claim-plus-commit (the expert's, ADOPTED).** Author is a claim plus channel; no pretence of
  proof; human verification anchored at the commit; T-022 closed; stop there. **Adopted as D1–D4.**
  ⚠️ **Its cost, stated as plainly as F's was:** fkit gives up the ability to distinguish an
  owner-verified close from an agent one by any means stronger than cooperation. **That is a real
  reduction in what the marker asserts, and D3 says so out loud rather than pricing it at zero.**

---

## ⚠️ Corrections of record

⭐ **Four corrections, three of them against arguments `fkit-architect` made or carried. Listed
together so they are countable, per the recurring-bug-class discipline below.**

1. **W3 was half right.** Step 11 *is* a contradiction (stands); an **identity spike** is the wrong
   remedy (**withdrawn**). See C3.
2. **The drift argument is measured FALSE.** fkit's duplicated carriers have not rotted — 0/403 on the
   board-row audit, 0/405 on ids. See C5. **This weakens an argument the architect carried and
   supports Codex's item 6.**
3. ⚠️ **A stale claim that went stale DURING the review.** Both `fkit-architect`'s W1 and Codex's item 5
   rested on *"three of six statuses appear zero times."* **`0383` was set `🚧 Blocked` — with a stated
   reason — on 2026-09-18, so the claim is no longer true.**
   - **[M✓] Re-measured independently for this revision**, not taken from the verdict: scanning every
     `## Status` field across all 405 briefs, `🚧` appears in **exactly one** — `0383`. (The glyph
     appears in prose elsewhere; only the status field counts.) **The expert's [X] figure of 1 is
     confirmed.**
   - ⭐ **The right conclusion is neither lead's.** The expert: *"The vocabulary is used when needed and
     idle otherwise. **Infer nothing from a zero.**"* Codex's "archival mechanism" reading was wrong
     (115 open tasks, none `🔄`); the architect's *"not maintained as a live signal"* was too strong.
   - ⛔ **Where the stale sentence still stands:** in the source evaluation report's §8.3.2 (W1) and in
     Codex's item 5, **neither of which this revision edits.** The report is a dated artifact of a
     completed review and another agent is working that tree; **correcting it in place is not this
     ADR's to do.** ⚠️ **It is corrected here, and anyone citing W1 should cite this correction with
     it.**
4. ⚠️ **`fkit-architect` over-read the expert's load-bearing sentence, and withdrew it the same day.**
   The first pass of *§The load-bearing sentence, tested* graded it *"FAILS as worded"* on an unscoped
   *"an attacker"* — a phrase from the **relayed paraphrase**, not from the verdict, which had already
   separated T-022's external actor and gated browser writes on it. ⛔ **Withdrawn as a finding against
   the expert; retained as a wording risk in the relay chain, which D4 closes.** ⭐ **Recorded because
   the discipline that required corrections 1–3 does not exempt the corrections themselves.**

> ### ⚠️ RECURRING BUG CLASS — flag this as recurring, not as a new risk
>
> *(Carried forward from the pre-verdict draft, and the count has gone up.)*
>
> **A measured figure asserted without its unit or denominator named.** By name: the chars-vs-bytes
> discrepancy reconciled in the source report's *§2.4*; the 15,650 figure that turned out to be *"the
> longest line, in bytes, of `dashboard.sh`'s rendered stdout"*; Codex's item 7, a missing-denominator
> finding against fkit's own migration error rate; the character-width hazard in any TUI.
> ⭐ **A fifth instance arrived with the verdict and it is the most instructive**: the expert's own
> withdrawn dependency-graph numbers — *155 + 101 edges, 60.6%, 10 cycles* — sound because the **rule**
> was unstated, and false because prose contains **negated ids**. ⛔ **Treat this as a process defect,
> not bad luck.** The discipline that catches it is the one the expert used on its good measurements:
> **state the counting rule beside the number.**

---

## Costs and risks, priced honestly

**The terminal UI's real cost, in Node, since aiboard is being ported to Node.** [A] *(unchanged)*

- ⛔ **The "Python has `curses`, Node does not" framing is MOOT and is withdrawn** — under the port
  ruling a Python curses TUI is throwaway work.
- Node core gives raw-mode stdin, `tty`, terminal dimensions, a resize event and ANSI escapes —
  everything curses provides **except** the window/pad abstraction and terminfo portability.
  **≈400–700 lines of plumbing.** ⚠️ **[A]** — an estimate, not a measurement.
- ⭐ **The real cost driver is not drawing, it is character width.** Python counts code points, JS
  counts UTF-16 units, a terminal cares about **display columns** — and fkit's board content is
  emoji-dense.
- **A TUI library is a dependency of *aiboard*, not something imposed on a consuming project.**
  ⭐ **If a good board needs one, take it and say so.**
- ⚠️ **Added from the verdict [X]:** *"fkit **already has** a terminal view — `/fkit-status` and its
  1,687-line `dashboard.sh`. The owner's complaint was made from inside the terminal medium."* ⛔ **That
  is the strongest unaddressed argument against the TUI** and it belongs in the comparison D6 sets up.

**Accessibility — the two audiences want opposite things. Separate them.** *(unchanged)*

- **For THIS owner** — who lives in a terminal, whose agents *are* terminal sessions — a TUI is
  plausibly better. ⭐ **He is the audience of one that actually exists.**
- **For the never-withdrawn *"usable by someone with no framework at all"* constraint, a TUI NARROWS
  the audience.**
- ⛔ **So a TUI is a change of premise, not an implementation detail.** **Entirely the owner's call, and
  he should make it knowing that.** See OQ-2.

**New cost, from the revision.**
⚠️ **Adopting D1–D3 means fkit permanently stops claiming its close marker is anything but a
convention.** If the owner later wants a real human checkpoint, the only candidate on the table is
D2's optional signing key (passphrase or hardware touch). **Priced here so that choice is visible
later rather than rediscovered.**

---

## Consequences

**Positive**
- **The ADR now claims exactly what it can support.** `{claimed_actor, channel}` is verifiable
  record-keeping; *"owner-verified"* was not.
- **It unblocks what ruling 1 asked for.** Drag-to-Done stops being deferred behind a prerequisite that
  cannot exist, and is instead gated on a ~20-line fix and a deterministic mover — both buildable.
- D5 is free and closes C2's remote write path for fkit's board today, without waiting on T-022.
- The requirement stays stated in fkit's own terms, so it survives whatever aiboard builds and imposes
  no fkit concept on aiboard — the expert's §7 agrees no owner ruling is needed to place its
  recommendation on the permitted side of §1.4.
- The build-both-and-compare path still produces the first real usability evidence either project has
  had — and the expert confirms **nobody has yet watched the owner use either.**

**Negative / costs**
- ⛔ **fkit loses a distinction it briefly thought it could build.** Nothing in the system now
  distinguishes an owner-verified close from an agent's beyond cooperation and the commit rule.
- **Drag-to-Done is still parked in practice** — not by this ADR's choice, but by C6/D8: there is no
  command to delegate to.
- fkit's aiboard board is read-only for now (D5), so aiboard is a *view* and not yet a *control*.
- Building a TUI alongside the web board is duplicated UI work whose payoff is a comparison, not a
  feature. Priced here so it stays visible.
- ⚠️ **fkit's own close gate is not laundering-proof either** — ADR-033 says so of itself: *"the win is
  structural role-separation at the mover, not a laundering-proof gate."* **D1 does not fix that. It
  stops fkit pretending otherwise.**

**Re-raise only if**
- **The deterministic-movers ADR (C6/D8) lands** — then D5's read-only posture and the delegated-write
  seam are both reopened, because for the first time there is something to delegate to.
- **T-022 closes** — then D4's gate on browser writes is satisfied and the write question is live.
- **The owner wants a human checkpoint stronger than a convention** — then D2's signing-key option is
  the only candidate and it needs its own decision.
- **A second uid, a second machine, or a second human enters the picture** — ⭐ **every argument in this
  ADR rests on "one human and every agent share one OS uid."** Change that premise and the whole record
  is reopened, not amended.
- The comparison in D6 concludes and the owner picks a UI — the write-back mechanism is then a **new
  ADR**, not an amendment to this one.
- ⛔ **Do NOT re-raise on:** *"a browser/terminal identifies the user"* (settled twice — three points,
  §OS argument, expert concurring in full); *"use a separate endpoint"* (settled — option D); *"a human
  drag is owner-verified by definition"* (settled — true of *semantics*, unimplementable as
  *plumbing*); *"fkit's duplicated carriers will drift"* (settled by measurement — C5); or *"an
  identity spike will resolve step 11"* (withdrawn — C3).

---

## Open questions — the OWNER'S to answer. `fkit-architect` did not settle either of these.

⭐ **Two of the original four are CLOSED by ruling 2 and the verdict; the reasons are recorded below
rather than the questions being quietly dropped.**

- **OQ-1 — Where does the §1.4 line sit? *(RETAINED — still unanswered.)*** May a generic mechanism
  that a consuming project drives — a store adapter, a delegated-write command — live in aiboard's
  core, or is that fkit governance leaking in? ⚠️ **The verdict argues its own mechanisms pass §5.1's
  test** (*"useful to a solo user with files in another layout"*) **and that no ruling is needed to
  place them.** ⛔ **That removes the immediate forcing function; it does not draw the line.** The
  reconciliation both leads have used is still theirs, not yours, and this ADR still refuses to assume
  it.
- **OQ-2 — Do you accept the change of premise? *(RETAINED — still unanswered.)*** Your stated
  motivation was the browser. A TUI serves *you* better and serves *"anyone with no framework"* worse
  — and fkit **already has** a terminal view (`/fkit-status`, 1,687 lines) that you were using when you
  raised the complaint. **Which audience governs?**

**Closed, with the reason:**

- **OQ-3 — interim posture — CLOSED.** It asked whether to serve read-only now or keep writes enabled
  until T-022 lands. ⭐ **Both branches now converge on read-only**: the verdict's order puts the
  read-only spike first, and C6 shows the write branch has nothing to write *through* regardless. **The
  question had a forced answer, so it is not put to the owner.** ⚠️ It reopens the moment C6/D8 lands.
- **OQ-4 — is channel-asserted identity good enough for a one-user system? — CLOSED BY RULING 2.** It
  asked exactly what ruling 2 answers. **His answer is yes, with the honesty requirement attached:**
  a claimed actor plus its channel, *"no pretence of proof."* **That is D1.**

---

## Related

- ⭐ **The verdict that revised this ADR:**
  `ai-agents/knowledge-base/reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md`
  — *§0* (the six-line verdict), *§1* (what it ran, and the one measurement it withdrew), *§3 Attack 3*
  (identity), *§3 Point 9* (the close gate and the delegated-write seam), *§4 Q9/Q11*, *§5* (the TUI),
  *§7* (the §1.4 line).
- The source report: `ai-agents/knowledge-base/reports/2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md`
  — **§Q11.1** (the identity finding), **§Q11.2** (the independent convergence), **§8.3.2 (W3)**
  (fkit's dissent, now half withdrawn — C3), **§1.4** and **§5.1** (the undrawn line), **§7a/§7b** (what
  neither side had measured — now partly measured, C5). ⚠️ **W1 in that report is stale; see
  §Corrections of record 3. The report is not edited by this ADR.**
- aiboard **T-022**, on aiboard's own board — the cross-origin write defect, with the reproduction that
  deliberately does not appear here. **D4 gates browser writes on it.**
- `adr-033-task-movers-are-producer-only-reversing-adr-025.md` — the producer-only mover rule, and the
  source of this ADR's own honesty standard: *"not a laundering-proof gate."*
- `adr-025-spawned-agents-may-invoke-the-task-movers.md` — superseded by ADR-033, and the origin of the
  *"labelling convention among cooperative agents"* reading D3 adopts.
- `adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md` — the folder-is-authoritative rule the
  deterministic mover (C6/D8) must preserve, rename **last**.
- `adr-022-tools-unrestricted-except-adversarial-reviewer.md` — **why no in-repo mechanism can prove
  "a human did this."** Load-bearing for D1 and for the sentence test.
- `adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md` — ⭐ **the hook
  whose scope decides the sentence test.** It guards `Skill` invocations; `claude/fkit-claude.sh`'s
  `build_settings()` registers it with matcher **`"Skill"`** and registers **no matcher for `Edit`,
  `Write`, `MultiEdit` or `Bash`**, and emits **no `permissions.deny`** — so **no hook in fkit can see
  a file write into `done/` or an edit to a `## Status` line.** [M✓]
- ⭐ **The preserved audit spike:**
  `ai-agents/tasks/backlog/0404-evaluate-aiboard-…/assets/external-expert-spike/` — the scripts behind
  C5's figures, reproduced from that location. ⚠️ **It moves when `0404` closes; repoint inbound links
  (this one and the verdict's §8) at that point.**
- `adr-021-askuserquestion-is-session-only-absent-in-consults.md` — the session-only owner channel that
  **option F depended on**, and the reason this ADR returns open questions instead of asking them.
- `adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md` — the consent-gate
  shape option F reused; **retained as the reference if F is ever re-raised.**
- `adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker.md`
  — ⭐ **the nearest precedent for D3**: a mode that repairs state and *never upgrades the marker*.
- aiboard source at HEAD `df554b9`: `aiboard/server.py` (*"author = str(body.get(\"author\") or
  \"web\")"*, `do_POST`'s missing header checks, and `_body()`'s unconditional `json.loads`),
  `aiboard/cli.py` (*"DEFAULT_AUTHOR = os.environ.get(\"AIBOARD_AUTHOR\") or os.environ.get(\"USER\")
  or \"agent\""*, and the `--read-only` flag).

> ### ⚠️ Limits of fkit's own verification, stated rather than implied
>
> The [A✓] re-verifications were single-line case-insensitive greps plus targeted reads over aiboard's
> Python package at `df554b9`, excluding `aiboard/web/` and the test suite. **fkit did not execute
> aiboard's server and did not reproduce the cross-origin write** — C2's *mechanism* is verified; its
> *exploitability* is `aiboard-lead`'s tested claim, relied on but not re-run here. The 400–700-line
> Node estimate is **[A]**, an estimate.
>
> ⚠️ **Limits added with this revision.** The **[X]** figures in C5 are the expert's own measurements,
> **relied on but not re-run by `fkit-architect`** — they were re-run by the expert itself from the
> preserved spike folder, which is a reproduction, not an independent one. **Three things were measured
> independently here and are marked [M✓]:** the four movers' shape (C6), the single `🚧 Blocked` status
> (Corrections 3), and **the complete hook registration** (*§The load-bearing sentence, tested*). ⚠️ The
> hook finding is **read from `build_settings()`'s emitted configuration and the hooks' own matchers**;
> `fkit-architect` did **not** attempt an actual write into `ai-agents/tasks/done/` to prove the absence
> of a guard — **deliberately, because a producer is working that tree.** The standing evidence of
> already-modified `done/` briefs in the working tree is observational, not an experiment run for this
> ADR. ⛔ **The
> expert is a Claude run, like both leads, and says so** — it is a third read, not an independent
> model. ⭐ **And its own caveat should be carried, not filtered:** *"I have a bias toward not
> building, and this verdict is what that bias produces."*
