# Repair the five live ownership-fact defects found by `0142` (D1–D5)

**Source**: `ai-agents/tasks/done/0188-repair-the-five-live-ownership-fact-defects/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P16` · ID 0188 · owner `fkit-coder` · two review rounds, 2026-08-26/27

## Goal

**Follow-up 1 of `0142`'s report.** `0142` was report-only by its own brief, so it found five wrong ownership facts at sites that are (or should be) on the skill-ownership inventory and **deliberately left every one live**. ⛔ **None had been recorded anywhere.**

### ⭐⭐ The methodological finding that governs all five repairs

`0142`'s first banner audit was `grep -q "⛔ Owner:"` over every skill. It reported **exactly one** missing banner. ⛔ **It was wrong** — `fkit-team/SKILL.md` also has none, but contains **prose describing the banner**, and ⭐ **prose about a marker satisfied the grep for the marker.** It was caught **by reading the file, not by refining the pattern.** ⚠️ *"Expect the same of every repair below: open the file."*

### ⭐ Why it ships before the registry build, and the two false reasons that were withdrawn

Owner ruling, verbatim: ⛔ ***"do not let the build quietly repair its own corpus."*** A build that fixes its own inputs demonstrates nothing about the guard.

⚠️⚠️ **The brief warns against re-deriving a mechanism for that ordering, because two successive mechanical justifications were asserted, found FALSE, and withdrawn** — *"out of order the guard ships red on its first run"* (round 1) and *"clause 2 deletes the `FOUR`, so the build resolves D4 itself"* (round 2). ⭐ **Both were plausible, both were asserted rather than measured, and both survived a careful author and a review round.** ⛔ **The sequencing rests on the owner's ruling and on nothing else.**

### The five defects

| # | Defect |
|---|---|
| **D1** | `claude/scaffold/CLAUDE.md`'s producer row omits `/fkit-task-brief` — ⭐ **a declared mirror that ships into every consuming project's root `CLAUDE.md`.** *Highest of the five.* |
| **D2** | `architecture.md` says **one** skill lacks an owner banner; **two** do (`fkit-query` and `fkit-team`). Two further sentences carry the same error. |
| **D3** | `architecture.md` cites `skills-for-role.sh:35` for `skills_for_role()`; it is at **48**, and 35 is inside a comment block. ⚠️ **"Re-measure at implementation time — this coordinate decays, which is the whole point of the defect."** |
| **D4** | The mirror checklist says **FOUR** mirrors. There are five, and `0142` found a sixth. ⛔ **"The count is not off by one; it is off by at least two."** |
| **D5** | Root `CLAUDE.md` says foreign skills are *"invisible"*; they are **visible-but-blocked** — contradicted by four live docs and by ADR-018 §Decision 5, which records the visibility regression as a **knowingly accepted cost**. ⭐ *`0142` quoted this same file from prose thirteen lines below the false sentence and did not notice.* |

⭐ **D4's repair had to touch TWO files** — the 12-line FOUR-mirror block exists **twice, byte-identically**, in `claude/skills-for-role.sh` and `claude/fkit-claude.sh`. ⛔ **Neither copy points at the other and nothing tests that they agree.**

⭐ **D2's choice was left OPEN to the implementer by design** — add two banners, or correct three sentences. *"Both are legitimate; pick one, apply it consistently, and say which and why. Do not do half of each."*

## Key Changes

- **D1 arrived already discharged.** ⭐ **`0250` closed it on 2026-08-23**, and a dated correction note (written under task `0324`) was appended to *both* the D1 section and its verification step — **leaving the original text byte-identical** — with a ⛔ **explicit warn-off**: *"DO NOT 'repair against `skills_for_role()`'."* The two carriers order the list differently **deliberately**, and reordering *"would undo that choice and re-break the twin match — while reporting success."*
- **D2** — sentences corrected (24 of 26 skills carry a banner), verified **by opening all 26**.
- **D3** — the citation now resolves, paired with a fragment per the durable-citation convention.
- **D4** — count corrected to **SIX** in both copies; a `diff` of the two blocks after the edit is **empty**, and all six mirrors were verified to exist.
- **D5** — the *"invisible"* claim replaced with wording that matches ADR-018 §Decision 5. ⛔ **ADR-018 itself was not edited — it is a dated record.**

`node --test test/*.test.js` → **774 pass / 0 fail**. Manifest regenerated and verified fresh (`--stdout | cmp` clean, **+1 row**).

## Outcome

Two rounds, five findings. Reviewers: own pass + Codex (`codex exec --sandbox read-only`), **full coverage** in round 2. ⭐ **Round 2's verdict was `🔁 Closeout — no action (loop)`: no new defect.**

- **R1 (low):** ⭐ **a D2-class falsehood survived at a site this very task rewrote.** Root `CLAUDE.md` still said *"Each skill's `⛔ Owner:` banner"* while the scaffold twin had been corrected to *"each **role-owned** skill"*. Raised by both reviewers. Fixed.
- **R2 (low, PARTIALLY CORRECT, residual):** ⭐ **a literal over-claim in the docs** — the hook is described as checking *"every `Skill` call"*, but **it allows every non-`fkit-*` skill with no identity or ownership check.** ⛔ Kept, because the wording is **verbatim the live mirrors'** and the paragraph is scoped to fkit skills — *narrowing here alone breaks parity; narrowing everywhere is wider than `0188`.*
- **R3 (low):** ⭐ **stale mechanism facts left standing beside the rewrites** — `PROJECT.md` still described a retired `skillOverrides` lockdown, so the task's own new sentence *"gated the same way"* **pointed at the wrong mechanism**; `README.md` still claimed a per-role tool allowlist, retired by ADR-022 for every role but the adversarial reviewer. Owner ruled *"Fold into `0188` now"*, ⭐ **plus two more same-class sites the coder surfaced itself.**
- **R4 (low):** *"the ONE role allowed to execute it"* — false for the two six-role skills. → *"the role (or roles)"*.
- **R5 (low):** ⭐⭐ **a date in the fix was off by one day, and the reviewer proved it from the commit graph**: the block still said `FOUR` at `493cecd` (2026-08-25) and the fix landed 2026-08-27, so the text's *"until 2026-08-26"* was false. ⚠️ Changing it was a **deviation from the approved plan** and was escalated as such rather than silently applied.

### ⚠️ Also on the record

- ⭐ **Two re-raises by Codex in round 2 were SUPPRESSED as settled**, both against round 1's own *"checked, no finding"*: that `SIX` is a decaying count (it is the plan-approved block, whose `TWO → FOUR → SIX` decay is exactly what the block itself warns about) and that *"the two universal skills"* is a floating count (it is a **named pair**).
- ⭐ **`0142` scored these five against the registry tripwire and the answer was NO on all five** — every one is *wrong prose at a registered site*, which the tripwire does not look at. ⛔ **Building `0189` would never have surfaced them, and will never surface the next five.**
- ⚠️ **The brief recorded a merit/rank divergence of roughly 43 open rows and did NOT act on it** — a spawned producer has no owner channel and never re-ranks.
- ⭐ A quoted *"Task 70"* inside the brief means `0008`, not `0070`. ⛔ **Left byte-identical because it is a verbatim quotation**, with the key beside it — and the resolution **overrode `0306`'s own brief** on owner ruling, on the evidence that the quoted incident is a skill-mirror failure `0070`'s brief rules out of its own scope.

## Related
- [[tasks/fix-the-scaffold-producer-row-fkit-task-brief-omission]] — `0250`, which discharged D1 before this ran
- [[tasks/record-that-0250-discharged-0188s-d1-and-warn-off-the-reordering]] — `0324`, the correction note and its warn-off
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — §Decision 5, the accepted visibility cost D5 misstated
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — the ruling R3's stale allowlist prose contradicted
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — clause 2, which later demotes both checklist copies
- [[systems/role-locked-sessions]] — the ownership mechanism these five facts describe
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[systems/fkit]] — *added 2026-08-29:* the page whose §The 25 skills paragraph this task's **R4** and **D2** falsified; the correction is carried there as a ⚠️ SYNC block
