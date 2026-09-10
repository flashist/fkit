# ADR-010: Role-locked sessions with a skill lockdown, replacing lead-session "hat" skills

**Date**: 2026-07-11
**Status**: accepted (partly superseded — see below)

**Supersedes**: [[decisions/adr-008-claude-code-native-port-alongside-omnigent]] §"Role access"

> ⚠️ **Two of its decisions were themselves corrected** by
> [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]: the lock is
> **session-scoped, not universal**, and the `skills:` frontmatter was **dropped, not generated**.
> *(ADR-012 §2 was in turn superseded by [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the lock is now structural on the consult path too.)*
> The core decision — role-locked sessions — stands.

> ⚠️ **Decision 3 is REVERSED — do not follow it.** *"`fkit-lead` (the team room) is a router, not a doer… no Write or Edit tools, deliberately"* was reversed on 2026-07-22 by
> [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]: lead is now an **orchestrating conductor** that spawns and drives typed peers. **Decisions 1, 2, 4 and 5 are unaffected.** *(The "no Write or Edit tools" half had already gone stale earlier, via [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]].)*
>
> ⚠️ **Two further factual claims in this ADR are now false, and are deliberately left in place**: the lead is described as *"the 'team room' (menu option 7)"* — the label was **retired project-wide** and the role moved to **menu option 1** on 2026-07-25 ([[tasks/reorder-launcher-menu-lead-first-and-rename-label]], [[tasks/retire-team-room-in-docs-and-agent-definitions]]). **The ADR body was not rewritten on purpose:** silently editing a decision record to match today's reality erases the history the record exists to hold. The sanctioned fix is a **dated correction note appended** to the ADR — an architect call, owner-ruled 2026-07-25.
>
> ✅ **SHIPPED 2026-08-02 — the correction notes landed in the knowledge-base ADR.** Two tasks, both additions-only, `Status` still `accepted`: [[tasks/append-a-dated-correction-note-to-adr-010]] (`0143`, **+71 / −0**) and [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] (`0195`, **+53 / −0**, repairing a self-contradiction `0143` knowingly shipped). **The source ADR now carries FIVE dated correction blocks** — §Context ⚠️, §Context ⛔, §Decision 3 ⛔, §Decision 5 ⚠️, and §Context's *"One real inconsistency"* passage ⚠️ — **plus a `- **Corrections:**` header item that carries TWO site lists** (the owner declined editing the first line and ruled a continuation instead; **a reader who stops at the first line under-reports the annotated sites**). **Not "one line", as this page previously predicted** — that was a prediction of a fix, not a record of one.
>
> ⚠️ **This page is NOT the full resync, and must not be read as one.** Task **`0199`** (owner `fkit-wiki`, open) still owes: carrying the ⚠️/⛔ legend with both glosses, the *"left byte-identical"* clause and the **below-the-claim** placement rule **with its recorded rationale**; recording the §Decision 5 contradiction as **history** (contradicted 2026-07-11 → 2026-08-02, repaired by `0195`) rather than as a live gotcha; and clearing the vault-wide *"still open"* framing elsewhere. `0199` carries an **⛔ ordering constraint — it runs LAST**, after `0196`, `0197` and `0171`, so it describes an ADR that has stopped being appended to. Two of ADR-010's stale `claude/fkit-claude.sh` pointers remain un-annotated on the source, fenced to `0196` and `0197`.

> ⭐ **THE FULL RESYNC — 2026-09-05, task `0199`, inside sweep `0358` (sweep C). The block directly above is DISCHARGED and is left byte-identical as the record of what was owed.** `0196`, `0197` and `0171` have all landed, so the ordering constraint is satisfied and this page now describes an ADR that has stopped being appended to. ⛔ **ADR-010's `**Status:**` on disk remains `accepted`** — the notes never superseded it.
>
> ⚠️ **The counts in the ✅ SHIPPED block above are now STALE, and they are superseded by this line.** That block is left byte-identical as the 2026-08-02 record. **Re-measured on disk 2026-09-05** against the working-tree ADR (blob `3ced65a930e80e512221f3d2ebfa4bb7888e6f15`):
>
> | The block above says | Measured today |
> |---|---|
> | *"FIVE dated correction blocks"* | **10** |
> | *"a `- **Corrections:**` header item that carries TWO site lists"* | **four** site lists |
>
> **What grew it:** `0197` (2026-09-03, inside sweep `0356`) appended a **third** site list — notes at the end of §Context, at §Consequences' one-role-per-session bullet, and at the end of §Related, recording where code the ADR cites by line has since moved. `0196` (2026-09-04, inside sweep `0357`) appended a **fourth** — notes at §Context bullet 2 and at §Decision 2, recording that the `skillOverrides` off-list is retired and that an unowned skill today is **visible but blocked**, not hidden. ⭐ **Each new list supersedes its predecessors and leaves them byte-identical**, so *a reader who stops at the first line still under-reports the annotated sites* — now by three lists rather than one.
>
> ### ⭐ The correction-note FORM, carried here because the vault is where the next reader looks it up
>
> **The two-marker legend, both glosses, verbatim from the ADR's own header item:**
>
> - **⚠️ = a fact that drifted** — *the decision is untouched*.
> - **⛔ = a decision that was overturned** — *do not follow it*.
>
> **The *"left byte-identical"* clause.** No existing line of the ADR is ever edited. *"No existing line of this ADR was edited; the notes are appends, and the Status stays `accepted`."* Each later append repeats it, and each supersedes the prior site list **without touching it**.
>
> ### ⚠️ The below-the-claim placement rule — a DELIBERATE departure from this vault's own convention, with its recorded rationale
>
> ⛔ **In a knowledge-base ADR a dated note is placed DIRECTLY AFTER the bullet or decision item it corrects**, indented to that item's continuation level. **The vault's own *"banner above claim"* convention is NOT carried over to the knowledge-base side.** Recorded as `0143` residual **`R1-placement`**, owner-ruled *"keep as shipped"* over the convention the plan had cited.
>
> **Why (structural, as recorded):** a block placed *above* a bullet **visually detaches from the thing it corrects** — it reads as a preamble to the section rather than as an annotation on one claim — and **it breaks the §Context narrative**, which is continuous prose the reader is moving through. The reader is already warned before any body text by the header `- **Corrections:**` bullet, which names every annotated site and carries the legend, **so below-placement costs no warning**.
>
> **Both alternatives were rejected by name:** *banner-above-claim* (this vault's convention) on the two grounds above; and *a single end-of-file "Corrections" section*, rejected in planning because **it reproduces the exact placement error the vault's own lint named**.
>
> ⭐ **The reviewer was right that the departure shipped unreasoned.** The rationale was written down afterwards, and this is the vault's copy of it.
>
> ### §Decision 5's self-contradiction is HISTORY, not a live gotcha
>
> ⚠️ **Recorded here as a closed episode with both dates, per `0199`'s item 4.** ADR-010 §Decision 5 named `claude/fkit-claude.sh` as the home of `skills_for_role()`. **Contradicted 2026-07-11 → 2026-08-02**: `0143` appended a correction note pointing at the real home while the decision text still named the old one, so for that window the ADR asserted both. **Repaired 2026-08-02 by `0195`** ([[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]]), which added the §Decision 5 note that resolves it. ⛔ **Do not read this as a defect standing today** — it is a dated episode in how the correction-note form matured, and it is why `0195` exists.

## Context
ADR-008 designed the Claude flavor around a **single interactive lead session** that was the team lead *and* the coder by default, and that could **"wear a hat"** — `/fkit-agent-<role>` skills that made the current session adopt a role.

The hat model was **prompt-enforced**, and that was the problem: *a session "wearing" the reviewer hat was the same context that had just written the code*, and nothing but instructions stopped it from running the coder's procedures. ADR-008 conceded this itself — reviewer independence *"is a property of a fresh context, not of the prompt"* — and then relied on an in-skill independence *check* to compensate.

The hat skills have since been **deleted in code**, and the owner confirmed the replacement is settled.

## Decision
**Every session is locked to exactly one role, two ways:**

1. **`claude --agent fkit-<role>`** — the role's system prompt and **tool allowlist** (harness-enforced).
2. **`--settings` carrying `skillOverrides`** — every `fkit-*` skill the role does *not* own is set to `"off"`: hidden from the `/` menu **and unrunnable by name**.

   > ⚠️ **Dated correction 2026-08-02 — Decision 2's mechanism NO LONGER EXISTS, and "hidden from the `/` menu" is now FALSE.** The sentence above is left byte-identical as the record of what was decided on 2026-07-11. The `skillOverrides` off-list was **retired at task 43 / [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]** ([[tasks/implement-pretooluse-skill-ownership-hook]]); `build_settings()` stopped writing it. Today every `fkit-*` skill is left **enabled and visible in every session** — a coder session's `/` autocomplete **does list `/fkit-review`** — and a `PreToolUse` hook **denies the invocation** by the real caller's role at any spawn depth. **ADR-018 §Decision 5 accepts that menu visibility as a known cost, deliberately.** So the correct statement of today's lock is ***visible but blocked*, never *invisible*.** ⚠️ **This also corrects the 2026-07-22 note above**, which says *"Decisions 1, 2, 4 and 5 are unaffected"* — that is true of 1, 4 and 5, but **Decision 2's mechanism is retired**. See [[systems/role-locked-sessions]] §"Era 2" for the current lock.

Plus:
- **`fkit` is a deterministic role menu.** No LLM decides who you're talking to — picking a role is an `if/else`. `fkit <role>` skips the menu.
- **A 7th agent, `fkit-lead`** — the "team room" — **routes rather than does**. It has no Write or Edit tools, deliberately.
- **Cross-role work is a consult, never a role switch** — the Agent tool, **max two hops, never a cycle**.
- **`skills_for_role()` in `claude/fkit-claude.sh` is the single source of truth** for role→skill ownership.

  > ✅ **Dated correction 2026-08-02 — the function MOVED; `claude/fkit-claude.sh` is the wrong file today.** The sentence above is left byte-identical as the 2026-07-11 record. `skills_for_role()` was **extracted into `claude/skills-for-role.sh`** at task 43 / [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] so both the launcher **and** the `PreToolUse` hook could read it without sourcing `fkit-claude.sh` (whose top-level side effects make it unsafe to source). **Verified against live code 2026-08-02: declared at `claude/skills-for-role.sh:48`; `claude/fkit-claude.sh` only sources it.** *"Single source of truth" is still exactly right — only the filename changed.* The same stale pointer was fixed in the repo-root `CLAUDE.md` by [[tasks/correct-claude-mds-stale-skills-for-role-location]] (`0151`).

## Consequences
- **Role separation becomes structural where it counts.** A `fkit reviewer` session *is* a fresh context, and a coder session **cannot execute `/fkit-review`** — the skill does not exist in it. **This is the property reviewer independence rests on, and it holds.** *(⚠️ "The skill does not exist in it" is the retired Era-1 mechanism — see the dated correction at Decision 2 above. The skill **does** exist and is **visible**; the hook denies it. The property itself holds, and now holds in consults too.)* It is a strictly stronger form of exactly what ADR-008 argued for.
- **The hop budget cannot be made structural.** Claude Code ignores `Agent(type)` allowlists inside *subagent* definitions, so the two-hop cap stays **prompt-enforced, knowingly**. It *is* structural in one place — `fkit-lead`'s own `Agent(...)` list.
- **"Never commit/push unprompted" remains a prompt rule too.** A known, accepted limit — **not a claim to overstate.**
- **Path-level hook enforcement of role boundaries was deferred** — and ADR-012 later *priced* that deferral.
- ADR-012 corrected the scope: the lockdown follows **the launching session**, so on the **consult path it is advisory**, not structural.

## Related
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]
- [[tasks/design-task-ship-loop-skill]]
- [[systems/role-locked-sessions]]
- [[systems/fkit]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/review-and-model-diversity]]
- [[tasks/reconcile-skill-ownership-source-of-truth]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/document-consult-chain-envelope]]
- [[tasks/restore-plan-mode-in-plan-task]]
- [[tasks/rewrite-docs-post-omnigent]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[systems/testing-and-verification]]
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — measured confirmation of the consult envelope
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — relaxes this ADR's tool-allowlist half; the skill half stands
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — Evolve `fkit-lead` into the orchestrating conductor (reverse the non-doer stance)
- [[tasks/append-a-dated-correction-note-to-adr-010]] — task `0143`, which landed this ADR's first three dated correction blocks and **established the knowledge-base correction-note form**
- [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — task `0195`, which added two more and repaired the `skills_for_role()` self-contradiction
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — task `0141`, which treated this page as a historical record and set the vault's own correction-note convention
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the **content** axis (which text wins inside a spawn); this ADR is the **invocation** axis, and ADR-037 leaves it untouched
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — cites this role lock as why an unroled `claude` session is **unsupported**, which is what makes its residual R1 a known cost rather than a conformance gap
- [[tasks/teach-record-decision-the-dated-correction-note-form]] — ⚠️ *Added 2026-08-22:* task `0198` — this ADR is the **worked example** the shipped correction-note section names, and the source of the site-list wording its supersession clause quotes
- *Added 2026-09-10 (sync `cf289c2`→`b4a1a52`):* [[tasks/sweep-b-the-single-site-correction-notes]] — task `0357`, Sweep B — the single-site correction notes
