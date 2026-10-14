# Asking the owner

> **Explain first, in chat; give every question the standing option; and treat a reply that is not a
> choice as a question to answer, not an answer to act on.** A follow-up the owner types into a
> question dialog, or a pick of *"Explain more, then ask again"*, gets a full answer in normal chat,
> no new dialog that turn, and the same question back on the owner's next message.
>
> Owner ruling, 2026-10-10 — ship the *"Explain more, then ask again"* option to every fkit user, and
> answer a question typed into a dialog in full, in chat, without re-asking in the same turn
> (task 0504).

## Why

An agent asked the owner a question with `AskUserQuestion`, with little background. The owner typed a
follow-up into the dialog's free-text field — *"what does option B mean in practice?"* That text came
back to the agent as the **answer**. The agent stayed in "collect a decision" mode: it wrote *"I've
explained X"* and opened a new dialog at once, or squeezed the explanation into the dialog's short
fields. A new dialog hides the chat text above it, so the owner never saw the explanation. He gave up,
left the dialog, and asked again in normal chat. This happened often.

## Before you ask

- **Explain first, in chat:** what the choice is, why it matters, and what each option would actually
  change. Assume the owner has not followed the details.
- **Keep that background short enough to stay visible above the dialog.** A long explanation right
  before a new dialog is hidden by it. If it needs more room: explain, end the turn with no question
  line other than the **What's next?** heading, and ask on the next turn.
- **Keep the question and each option description short.** Explanations go in chat, not in dialog
  fields — except a short required fact, such as a placement option's knock-on, which stays in its
  description ([`placement-questions-state-the-knock-on.md`](placement-questions-state-the-knock-on.md)).
- **Batch related questions** into one call. The **recommended option comes first**, marked.

## The standing option

Every question put with `AskUserQuestion` carries this option, worded exactly:

- label: `Explain more, then ask again`
- description: `Give me more context in simple terms, then re-ask the question.`

- It is the **last** option. The recommended option stays **first**.
- The tool allows **at most 4 options**. A question with 4 real options merges or drops the weakest one
  so the standing option always fits.
- It appears **once**. If your own instructions already add this exact option, add it once.
- When the owner picks it, it is *a reply that is not a choice* — below.

## A reply that is not a choice

A typed question, a request for more information, or a pick of the standing option is **not an answer
and not consent**. When one comes back:

1. **Answer it in full, in chat** — plain words, no new jargon, a concrete example, and what each
   option means in practice.
2. **Open no new question that turn.** End the turn with no question line other than the
   **What's next?** heading; its next step says to reply *"ask again"* when ready.
3. **Re-ask:** Put the same question back on the owner's next message — unless that message is the answer (take it) or another question (answer it the same way).
   The re-ask carries the same options, plus the standing option again.
4. **Never write** *"I've explained X"* or *"as explained above"* — the explanation is the message the
   owner is reading now.

The mixed cases:

- **A batched call answered in part** — take the answers given, explain the rest, and re-ask only
  those.
- **A reply that both picks and asks** — answer the question first. Act on the pick only if the answer
  does not bear on it; otherwise re-ask.
- **The owner answers in prose, outside the dialog** — that is the answer. Take it; do not reopen a
  dialog to confirm it.
- **Never consent.** A picked *"Explain more, then ask again"*, or a typed question or request for more
  information, never counts as an approval, a selection, or an answered question.

## Spawned workers and relayers

A spawned worker has no `AskUserQuestion` (it is session-only). It returns its question to whoever
spawned it:

- A `NEEDS-DECISION` carries **at most 3 options** — the relayer adds the standing option as the 4th —
  and a plain-language `context` with enough for the relayer to explain the choice without asking the
  worker back. An open question returned in prose carries the same context.
- **A worker returns 4 options anyway:** the relayer merges the two least-recommended into one option,
  naming both, and says so in chat. The merged option keeps both options' knock-ons in its
  description. Never drop an option silently.
- **The owner replies to a relayed question with a question:** the relayer answers in chat from what
  it holds — the worker's context, the brief, the plan. If it cannot, it asks a read-only consult of
  the same role, carrying the worker's `NEEDS-DECISION` verbatim and the owner's question (no write
  approval, no live plan pointer). Then it ends the turn and re-puts the same decision as above. No
  timer, no guess.

## With other rules

- The owner's own style instructions win over this page, as they win over every output-style
  preference. Say so rather than resolving a conflict silently.
- A placement or dependency option still names its knock-on; the standing option carries none
  ([`placement-questions-state-the-knock-on.md`](placement-questions-state-the-knock-on.md)).

## Where it is enforced

- **Prose:** the *Ask interactively* line of the shared rules block points here. Each Claude-side
  agent prompt carries a short *Asking the owner* paragraph with the option's label and description.
  The sprint ship-loop, the open-questions interview and the heal skill carry the parts that touch
  them.
- **A presence test:** the label and description are byte-checked in each agent prompt and in this
  page's shipped copy, along with the "never consent" sentences. It checks the words are there, not
  that an agent follows them.
- **The Stop hook:** when a reply has a line ending in `?` and no `AskUserQuestion` was used, the hook
  asks for the tool — and tells an agent that was answering the owner's question, or explaining ahead
  of one, to open no dialog and end the turn with no question line other than the **What's next?**
  heading. **Accepted residual:** the hook cannot tell a genuine answer or explanation turn from a
  prose question relabelled as one. It is a heuristic by design.
