---
name: fkit-open-questions-interview
description: >-
  Sweep this session's history for questions put to the owner that were never answered, then
  interview the owner about them. Interview-only — reads nothing from disk, writes nothing, and
  never invents a question. Available to the six Claude-side roles.
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
- A question actually answered for its unchanged scope — an applicable explicit "ship it" can settle
  approval. Request acceptance, queueing or presentation alone cannot. Re-asking a settled question
  is worse than not asking; take an applicable prose answer without a confirmation form.
- A question whose answer stopped mattering because the work changed direction.
- A rhetorical question, or a decision you *documented* rather than *asked*.
- **A question you never actually put to them.** A doubt you had privately is not an open question; it
  is work you have not done.

## Steps

1. **Sweep** the session from the start for the shapes above. Include questions asked through
   `AskUserQuestion` **and** in prose — prose questions are the easier ones to lose.

   > **⚠️ Only an actual applicable owner answer settles a decision.** A tool result alone is not
   > enough: cancellation, decline, interruption, invalid/empty results, accepted/queued requests,
   > and displayed but unanswered forms keep it open. Unknown delivery remains unverified; do not
   > repeatedly resubmit asynchronous requests. Once answered for unchanged scope, unfinished agent
   > work does not reopen it — go and do that work instead of asking the owner twice.
   > **Except a reply that is not a choice:** a picked "Explain more, then ask again", or a typed
   > question or request for more information, is not an answer — the question stays open.
2. **Check each against later turns.** Was it answered, made moot, or overtaken? Drop those, and drop
   anything you could resolve yourself.
3. **Dedup only the same decision and unchanged scope/options.** Repeated asks are one pending
   decision; shared context or similar labels do not merge independently approvable actions. Retain
   each stable decision key, scope/revision, options and known answer provenance in the conversation.
   A changed scope supersedes the old version and needs a fresh applicable answer.
4. **If nothing is open: say so and stop.** *"Nothing outstanding."* **Do not pad the list to justify
   the invocation** — a clean sweep is a real and useful result.
5. **Otherwise, interview.** Order by what blocks the most work, and for each say **why it matters** —
   what is stuck, or what you will do differently depending on the answer. A question with no stated
   consequence is one the owner cannot weigh.

## How to ask

- **In an interactive root:** select the supported interface under `conventions/asking-the-owner.md`:
  exposed negotiated Codex `fkit_roles.fkit_ask_owner`, or supported Claude native `AskUserQuestion`.
  If missing/unsupported or delivery fails, state the limitation, exact decision and named choices
  with recommendation and standing option, then wait. Report uncertain delivery as unverified.
  Give each independent decision its own concise question and selectable options, recommendation
  first and the standing `Explain more, then ask again` last, once, described as
  `Give me more context in simple terms, then re-ask the question.` In string-only Codex, put the
  description in visible preceding chat. Respect actual option limits and the separate custom-text
  route. Never silently drop valid alternatives or combine unrelated effects; use the convention's
  faithful narrowing or transparent non-authorizing stages when needed.
- **Adapt group size to the exposed interface.** Current Codex asks one `fkit_ask_owner` call at a
  time, never a `questions` array or concatenated decisions. Batch related decisions as separate
  objects only when that shape/count and trustworthy identity are supported; otherwise ask
  sequentially. Bind answers by stable decision identity and unchanged scope, not list order or
  duplicate labels. Preserve custom text exactly against its original decision; custom routing
  alone grants nothing. Plan approval and retry permission stay separate.
- **Retain the unresolved remainder until settled.** Accept valid partial answers only for their own
  unchanged scopes. Cancellation, decline, interruption, invalid/empty/duplicate-ambiguous results,
  silence and preselection settle nothing. A late reply never approves another decision. Keep each
  actual approval's key/scope, quoted answer, date and actual channel in the conversation for the
  normal caller to use; this interview writes no artifacts. Unknown provenance stays unknown.
  - State the remaining count in prose outside the call; on current Codex, for example: "1 of 9
    now; 8 remain." Never abandon items beyond an assumed four-question group.
  - Any typed question, explanation request or standing-option pick stops **all new dialogs for
    any decision that turn**. Answer in full in chat, keep other valid answers, and on the owner's
    next message take an applicable answer or explain another question; otherwise re-ask only
    unresolved decisions. Do not loop into another item or immediately re-ask after explaining.
  - A change of subject leaves unresolved decisions open: raise them when that work settles, or
    say explicitly which ceased to matter and why. Do not silently discard them.
  - Missing/failed dialogue uses a separate fallback per decision, preserving identity, scope,
    context and choices; uncertain delivery stays unverified, with no repeated asynchronous asks.
    Pair owner-visible task IDs with canonical titles and retain each option's dependency knock-on.

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
