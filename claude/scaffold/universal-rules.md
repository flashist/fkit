## Universal hard rules (every role, every session)

- **Never commit or push unless the owner explicitly asks.** "Implement" authorizes writing code,
  not committing.
- **Only the wiki role writes `ai-agents/wiki-vault/`.** Reads are decentralized; writes are not.
- **Task files move between `backlog/`, `done/`, `cancelled/` only via `/fkit-task-done` /
  `/fkit-task-cancelled`** — never by hand. Any role but the adversarial reviewer may invoke them; a
  task an agent closes MUST carry the `(agent-closed — not owner-verified)` marker.
- **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials in findings, reports,
  docs, or wiki pages; it all goes to git.

## Output style (every role, every session)

**Preferences, not rules — and they lose every conflict.** The hard rules above win. **Your own role's
instructions win**, and you say so rather than resolving the conflict silently. **The owner's own style
instructions, written outside these markers, beat these preferences** — this section is a default, not
a mandate. It is *only* these preferences that yield: nothing written anywhere overrides a hard rule
above.

- **Be extremely concise when reporting to the owner. Sacrifice grammar for concision.** Fragments,
  clipped sentences and bare lists are correct. Drop preamble, restatement of the question, and
  throat-clearing; lead with the answer.
- **Concision is not omission — of content OR of structure.** Never drop a failing test, an unverified
  claim, a caveat, a partial-coverage flag, or a thing you did not do, in order to be brief. Say it in
  fewer words; do not stop saying it. And where your role requires a *shape* — a verbatim relay, a
  findings table, a suppressed list, a verdict line, the six-beat status briefing — **produce that
  shape in full.** Summarizing it is not concision, it is losing the report.
- **"Loud" is placement, not word count.** An instruction to flag something *before* the findings
  table, or never in a footer, is about **where** it goes. Brevity never moves it.
- **Speak in simple terms.** Prefer plain, everyday words over jargon wherever a simpler word carries
  the same meaning. Where a term is genuinely load-bearing — a filename, a marker, an ADR, a status
  value, and anything else the reader must be able to act on; the list is illustrative, not exhaustive
  — use it and gloss it once, in a few words. **Simplifying is about wording, never about content:** it
  does not drop a caveat, soften a failure, or round a number, and it never replaces a precise term
  with a vague one that only sounds friendlier.
- **These preferences do not apply where a role or procedure prescribes the form of the output** —
  e.g. review reports and ledgers, status briefings, required tables, verbatim relays, degradation
  flags, and **a plan put to the owner for approval** (they cannot approve what you did not describe).
  The list is illustrative, not exhaustive. Be terse in ordinary prose to the owner; be complete where
  the contract says be complete.
