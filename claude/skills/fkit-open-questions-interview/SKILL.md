---
name: fkit-open-questions-interview
description: Sweep this session's history for questions put to the owner that were never answered, then interview the owner about them. Interview-only — reads nothing from disk, writes nothing, and never invents a question. Available to the six Claude-side roles.
---

# Open Questions Interview

> ## ⛔ Owner: the **six Claude-side roles**
> producer · coder · reviewer · architect · wiki · lead. **Not `fkit-adversarial-reviewer`** — its
> review runs on Codex under a restricted allowlist
> ([ADR-022](../../../ai-agents/knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)),
> so it has no interactive channel to the owner and nothing here would work.

Find the questions **this conversation** put to the owner and never got an answer to, and ask them.

**No argument.** It operates on the session it is invoked in.

---

## The source is the conversation. Only the conversation.

**Sweep the current session's history — nothing else.** Not the sprint plan, not task briefs, not
`ai-agents/`, not the wiki, not the code.

**⚠️ This skill reads no files. That is the whole design, not an optimization.** A question sitting
unanswered in a *brief* is the producer's business and has its own path; a question raised in
`## Open questions` in a report is a record, not an ask. The thing this skill exists for is narrower
and otherwise invisible: **something was put to the owner in this conversation, the conversation moved
on, and nobody noticed the answer never came.** Widening the source set turns a precise tool into a
second, worse status report.

## What counts as an open question

Something asked **of the owner**, in this session, that they have not answered:

- A question you asked and then proceeded past.
- A decision you flagged as theirs — a ruling, an approval, a disposition — that never came back.
- **A question relayed from another agent** (a reviewer's owner-questions, an architect's open points)
  that was passed on but never resolved.
- **The unanswered remainder of a partial answer.** If you asked four things and they answered two,
  the other two are open. **This is the most commonly missed case** — a reply *feels* like closure.

**What does NOT count:**
- Anything you can answer yourself by reading the code or the files. **Go and answer it instead.**
- A question already answered, even implicitly — if they said "ship it", the approval questions under
  it are closed. Re-asking an answered question is worse than not asking.
- A question whose answer stopped mattering because the work changed direction.
- A rhetorical question, or a decision you *documented* rather than *asked*.
- **A question you never actually put to them.** A doubt you had privately is not an open question; it
  is work you have not done.

## Steps

1. **Sweep** the session from the start for the shapes above. Include questions asked through
   `AskUserQuestion` **and** in prose — prose questions are the easier ones to lose.

   > **⚠️ An `AskUserQuestion` that returned a result is ANSWERED.** The owner made a selection; that
   > is the answer. It does not become open again because you failed to act on it — that is *your*
   > unfinished work, and the fix is to go and do it, not to ask them the same thing twice. **Only a
   > question that never reached them, or whose answer never came back, is open.**
2. **Check each against later turns.** Was it answered, made moot, or overtaken? Drop those, and drop
   anything you could resolve yourself.
3. **Dedup.** The same question re-asked three times is **one** question. Merge near-duplicates and ask
   the merged form.
4. **If nothing is open: say so and stop.** *"Nothing outstanding."* **Do not pad the list to justify
   the invocation** — a clean sweep is a real and useful result.
5. **Otherwise, interview.** Order by what blocks the most work, and for each say **why it matters** —
   what is stuck, or what you will do differently depending on the answer. A question with no stated
   consequence is one the owner cannot weigh.

## How to ask

- **In a session:** use `AskUserQuestion`. **Batch** — up to 4 per call, related ones together, rather
  than interrogating one at a time. Give options real consequences, and mark a recommendation `(Rec)`
  where you have one and can defend it.
- **More than 4 open?** Ask the **most blocking 4 first**, then **repeat until the list is empty** — a
  second call, a third, as many as it takes. **This is a loop, not one extra round.**
  - **State the remaining count in your prose, outside the tool call** — *"4 of 9 below; 5 to follow."*
    A count that lives only inside a dialog vanishes the moment it closes.
  - **The loop is not cancelled by a change of subject.** If the owner answers 4 and then redirects you
    elsewhere, the remaining questions are still open: raise them when that work settles, or say
    plainly that you are dropping them and why. **Silently abandoning questions 5+ is the exact failure
    this skill exists to fix** — reproducing it inside the fix is the worst possible outcome.

> **⚠️ In a spawned consult, do not attempt to interview.** `AskUserQuestion` is **absent** there —
> measured `TOOL_ABSENT`, 3/3
> ([ADR-021](../../../ai-agents/knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
> **List the unanswered questions in your reply instead**, so the calling session can put them to the
> owner. Nothing fails loudly to remind you here — the tool is simply not there — so dropping them
> silently is the failure mode to guard against.

## Rules

- **Interview only. This skill writes nothing** — no file created, edited, or deleted; no status set,
  no task file moved, no wiki write. **Zero write surface.** The answers live in the conversation,
  where whatever you do next will use them.
- **Never invent a question.** Every one must trace to a real, identifiable moment in this session. If
  you cannot point at where it was asked, it was not asked.
- **Do not re-ask what was answered.** Re-litigating a settled decision is the failure this skill is
  most likely to cause; a settled answer stays settled.
- **Do not use it to escape work.** If the answer is in the repo, the honest move is to go and read it.
- **Report faithfully.** If the sweep is uncertain — a long or compacted session where you cannot see
  the whole history — **say so** rather than implying the list is exhaustive.
