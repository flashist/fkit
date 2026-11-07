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
- **One question per independent decision**, each with its own selectable alternatives. Group related
  decisions only as separate question objects when the actual interface supports that shape and
  count; otherwise ask sequentially. The **recommended option comes first**, marked.

## Select the supported interface

- **Eligible interactive Codex root:** use exposed `fkit_roles.fkit_ask_owner` when the client
  negotiates MCP form support. Valid explicit `form: {}` and legacy empty elicitation capabilities
  support requests; absent, malformed and URL-only declarations do not. Eligibility, capability
  and tool exposure are separate checks. A prompt naming a tool does not make it available.
- **Supported interactive Claude root:** use native `AskUserQuestion`.
- **Headless/delegated worker or adversarial leaf:** return `NEEDS-DECISION` to the caller; never
  open owner forms. An interactive root with no usable interface uses the fallback below.

Throughout fkit instructions, `AskUserQuestion` means the supported interface for that runtime,
with this fallback when unavailable. Do not silently choose prose while a usable interface exists.
No new API, native configuration change, installation or activation shortcut is authorized.

## Independent decisions and answer binding

A decision is one independently approvable scope or action. Shared context does not make two decisions
one: plan approval and permission for more attempts need separate questions and options. Never offer
"approve the plan and grant two more attempts" or require a combined free-text answer for ordinary
choices. A retry does not approve source; plan approval does not revive exhausted launches. Start
dependent work only when every required approval and allowance is satisfied; unrelated authorized
work may continue under the existing driver rules.

Keep a small conversation/checkpoint list: stable decision key, task ID plus canonical title where
applicable, unchanged scope/revision, question, exact options, recommendation, pending/answered/
superseded state and answer provenance. Use existing driver artifacts only after their normal gates.
Human-readable keys such as `0556-plan-r1` and `0556-retry-r1` are correlation aids, not approval proof,
new runtime tags, hooks or a persistent registry.

Current Codex `fkit_roles.fkit_ask_owner` accepts **one** `question` and supplied option strings, not a
`questions` array. Ask one call at a time; never join independent questions or their options in one
string. Other interfaces may batch separate question objects only within their actual limits and
with trustworthy question identity. Bind answers by decision identity and unchanged scope, never
list order or repeated option labels; without trustworthy identity, ask sequentially instead.

Keep that binding through the call, actual response, custom-text follow-up and re-ask. Transport
request IDs correlate replies to calls; they do not establish semantic approval. Preserve custom
text exactly against its original decision. A re-ask keeps its key only while scope/options mean
the same thing; changed scope supersedes that version and requires a fresh applicable answer.
Duplicate labels, reordered answers and late replies never approve another decision. Accept valid
partial answers for their unchanged scopes, retain every unanswered item, and leave ambiguous or
invalid results pending. Record each actual approval's key and scope/plan version, exact quoted
selected answer or exact prose/custom text, date and actual channel in the existing authorized log
or checkpoint. Unknown provenance stays unknown. Never relabel prose as a form answer, or record
"Write another answer" as the substantive custom answer. Carry the applicable answer and full
approved scope faithfully to the next worker; a quote buys fidelity, not proof.

## Delivery and fallback

Capability proves request support, not automatic display. Separate tool exposure and eligibility,
request issuance/acceptance, queueing, observed presentation, actual answer and applicable approval.
An invocation marker, `{"accepted":true}`, queued notification or displayed but unanswered form
grants nothing. Claim presentation only when actually observed; there is no invented presentation
acknowledgment. Unknown delivery stays unverified and the decision pending. Do not repeatedly
resubmit asynchronous requests or use an activation shortcut to pretend an automatic dialogue opened.

If the interface is missing, unsupported or delivery fails, state the concrete limitation and use
this fallback separately for each decision, retaining its key, scope, context and pending state:

> This session exposes no usable automatic owner dialogue. Decision: [exact scope]. Choices:
> [named alternatives and recommendation; standing explanation option]. Dependent work remains
> stopped until your answer.

If delivery is uncertain, say so explicitly instead of claiming it failed or displayed. Keep the
decision pending and list its scope and choices. Wait for an actual applicable answer before
dependent work. An explicit prose answer counts; do not reopen a form to confirm it.

Ordinary choices submit without mandatory text. A custom-text route alone supplies no answer;
wait for the separate text response and preserve it exactly. Never auto-submit a preselected option.
Cancellation, decline, interruption, invalid/empty/duplicate-ambiguous results and silence grant no
approval. A late reply counts only if it actually answers the still-current decision; never reuse it
for changed scope.
Record approval against the unchanged decision/plan with the quoted answer, date and actual channel;
never label prose as a form response. Approval to use an interface never approves implementation.

## The standing option

Every owner question, including fallback, carries this option, worded exactly:

- label: `Explain more, then ask again`
- description: `Give me more context in simple terms, then re-ask the question.`

- It is the **last** option. The recommended option stays **first**.
- Respect the actual interface's option limit and separate custom-text affordance. Current Codex
  allows **at most 4 supplied options**: up to 3 real alternatives plus the standing one. Its adapter
  accepts strings, so keep the standing label exact and give its description in visible preceding
  chat; structured interfaces use their description field. Listed choices need no custom text.
- Never drop valid alternatives or merge unrelated effects to fit. Return an overfull worker set for
  a narrower faithful set, or transparently stage selection within the same decision: a preliminary
  category/subset choice authorizes no dependent action; the final question names the exact scope.
  Disclose any semantically equivalent consolidation and preserve all placement/dependency knock-ons.
- It appears **once**. If your own instructions already add this exact option, add it once.
- When the owner picks it, it is *a reply that is not a choice* — below.

## A reply that is not a choice

A typed question, a request for more information, or a pick of the standing option is **not an answer
and not consent**. When one comes back:

1. **Answer it in full, in chat** — plain words, no new jargon, a concrete example, and what each
   option means in practice.
2. **Open no new dialog for any decision that turn.** End the turn with no question line other than the
   **What's next?** heading; its next step says to reply *"ask again"* when ready.
3. **Re-ask:** On the owner's next message, take an applicable answer or answer another question;
   otherwise re-ask only unresolved decisions, keeping their unchanged scopes and options plus the
   standing option. Retain the other pending decisions; never restart answered ones.
4. **Never write** *"I've explained X"* or *"as explained above"* — the explanation is the message the
   owner is reading now.

The mixed cases:

- **A supported batch answered in part** — keep valid answers bound to their own unchanged scopes.
  Retain the unanswered remainder. An explanation request in any item stops all new dialogs that
  turn, including other decisions; explain in chat and re-ask only unresolved items on the next
  owner message under the rule above.
- **A reply that both picks and asks** — answer the question first. Act on the pick only if the answer
  does not bear on it; otherwise re-ask.
- **The owner answers in prose, outside the dialog** — that is the answer. Take it; do not reopen a
  dialog to confirm it.
- **Never consent.** A picked *"Explain more, then ask again"*, or a typed question or request for more
  information, never counts as an approval, a selection, or an answered question.

## Spawned workers and relayers

A spawned worker has no `AskUserQuestion` (it is session-only). It returns its question to whoever
spawned it:

- Return each independent decision separately, with **at most 3 real options**, its recommendation
  and plain-language `context` sufficient to explain the choice. Multiple decisions use one prose
  envelope (not a parser or a tool API):

  ```text
  NEEDS-DECISION { decisions: [
    { id, question, options, recommendation, context },
    { id, question, options, recommendation, context }
  ] }
  ```

  Legacy `NEEDS-DECISION { question, options, recommendation, context }` stays valid for one decision;
  the root assigns a stable key before asking. Do not omit any returned item. An open question in
  prose carries the same context. Every owner-visible task reference pairs permanent ID with its
  canonical title; machine paths and dependency grammar stay unchanged.
- The relayer explains each decision, adds the standing option once and uses interface-aware
  grouping above. Overfull options follow the transparent narrowing/staging rule, never forced
  merging or dropping. Each placement/dependency option keeps its own knock-on.
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

These are scoped legacy hook descriptions, not a promise of runtime enforcement or live display.
Codex fkit hooks remain disabled. Static instructions and protocol fixtures do not establish that
choices opened automatically before owner interaction; that requires actual live observation,
ordinary submission and cancellation. Historical CLI form checks do not certify every host or
Claude/mixed compatibility.
