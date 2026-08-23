# Implement the task-folder-name scheme change (Option C)

**Source**: `ai-agents/tasks/done/0103-implement-task-folder-name-scheme-change/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0103` · owner `fkit-coder`

*(No board rank is recorded on this page. Per `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` — the convention this very task wrote — a task's identity is its folder-name `NNNN` prefix and nothing else; the Priority cell is mutable rank.)*

## Goal

Execute the owner's **Option C** ruling from [[tasks/decide-whether-to-drop-the-numeric-prefix-from-task-folder-names]] (`0102`): **keep** the `<NNNN>-` prefix on task-folder names, and fix the two-mismatched-numbers confusion on the **priority** side instead.

⚠️ **This brief was very nearly cancelled by reflex.** It originally said *"this task may never run"* and *"should be cancelled by the owner"* if `0102` ruled *keep the number*. `0102` did rule keep — and that **created** work rather than removing it. A `⛔ RESCOPED 2026-07-26` banner was put at the top of the brief specifically because a reflex cancel was the live risk. Blast radius fell to roughly a tenth of the old scope: **no folder renames, no href rewrites, no wiki churn.**

The authoritative scope was the decision report `ai-agents/knowledge-base/reports/2026-07-26-decide-task-folder-name-numeric-prefix.md` §8, **not** the brief — where the two differed, §8 won.

## Key Changes

Seven items:

1. **`dashboard.sh` — the folder ID becomes the primary task identity.** The `⟦FACTS⟧` id ladder now takes the folder-name `NNNN` prefix first; the Priority cell is only a fallback. This completes **[[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] Decision 6**, which `0102` found had been *authorised and never landed* — and which had been written in the past tense as though already done.
2. **The board's Priority cell renders as a rank token `P<n>`**, in `ai-agents/sprints/*.md` and in the producer's brief-writing surfaces. No parser change was needed — verified by execution, not assumed.
3. **Tests re-pointed, not reverted.** `test/dashboard-contract.test.js:1655-1664` was *expected* to go red: it encoded the pre-C contract (*priority wins over folder*). The brief said so in advance and forbade "fixing" it by reverting item 1.
4. **`claude/skills/fkit-status/SKILL.md`'s narration contract rewritten** — it had instructed the reader that `<task>` **is** the Priority number. Option C inverts that. The report called this *"the single most missable item in the handoff"* because it is **prose, not code — nothing fails if it is missed.**
5. **Option D — link-label normalisation — owner-ruled into scope.** Every board row now shows the folder ID in the visible label, not only in the href. Labels changed; **hrefs did not.**
6. **The convention page written in the same change**: `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`, **dual-homed** into `claude/scaffold/`, listed in the conventions README. It was deliberately *not* written by `0102`, and the owner ratified that reasoning: filing it before `P<n>` existed would have put every board row in violation of a rule on the day it was filed.

**ADR-029 Decision 5 is upheld, not amended** — the folder name stays authoritative, `## ID` stays the second carrier, and **no new ADR was needed.**

## Outcome

Done, **agent-closed — not owner-verified**.

- The convention `priority-is-rank-not-identity.md` is now live and dual-homed, and is cited by later work as settled rule — `0153`, `0159`, `0160` and `0161` all rest on it. It needed the owner's **explicit separate sign-off**, because a convention is a standing rule on every future run and that is a different consent from the Option C ruling.
- ⚠️ **The convention shipped ambiguous and needed an owner ruling to read on the same day.** Its *"frozen history"* clause never said which of two notations it governed. That defect is [[tasks/disambiguate-the-frozen-history-clause]] (`0161`).
- Three residuals were carried in from `0102` and had to be resolved here, not deferred: the **movers' greps were unverified against a `P<n>` cell** (a mover that stops finding rows is a silent repo-wide breakage), `P` was **one candidate token and not a ruling**, and ADR-029 Decision 6's past-tense text became true only when this task landed.

## Related

- [[tasks/decide-whether-to-drop-the-numeric-prefix-from-task-folder-names]] — `0102`, the decision this executes
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — Decision 6, fulfilled here
- [[tasks/disambiguate-the-frozen-history-clause]] — `0161`, the convention page's own ambiguity
- [[tasks/sweep-the-stale-rank-citations]] — `0159`, repairing the damage the convention names
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, the wider citation class
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — the `dashboard.sh` this rewires
- [[systems/knowledge-base-structure]]
- [[tasks/state-task-brief-step-5s-append-rule-in-full]] — `0157`, which wrote the cite-the-folder-ID rule into the brief skill
- [[tasks/wiki-flag-carries-folder-id-and-brief-path]] — `0153`, which applied this task's rank-vs-identity convention to the wiki completion flag
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — **a mid-board insertion is NOT the owner-ruled re-rank exception** — forced by arithmetic, not policy
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174` — the merit-ordering ruling; **the task that became its own proof case**
- [[tasks/record-the-canonical-merit-statement-form-in-the-convention-page]] — ⚠️ *Added 2026-08-22:* task `0178`, which added the `## The merit statement` section to the convention page this task filed
