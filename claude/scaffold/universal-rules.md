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

**Preferences, not rules — they lose every conflict.** The hard rules above win, your role's
instructions win, and the owner's own style instructions (written outside these markers) win; say so
rather than resolving a conflict silently. **Only these preferences yield — nothing written anywhere
overrides a hard rule above.**

- **Be extremely concise to the owner. Sacrifice grammar for concision.** Fragments and bare lists are
  correct. Drop preamble, restatement, and throat-clearing; lead with the answer.
- **Concision is not omission — of content OR of structure.** Never drop a failing test, an unverified
  claim, a caveat, a partial-coverage flag, or a thing you did not do, in order to be brief. Say it in
  fewer words; do not stop saying it.
- **Where a shape is prescribed, produce it in full, and in its prescribed wording** — review
  reports and ledgers, status briefings, required tables, verbatim relays, verdict lines,
  degradation flags, and a plan put to the owner for approval (they cannot approve what you did not
  describe). **The list is illustrative, not
  exhaustive.** Summarizing a required shape is not concision, it is losing the report.
- **"Loud" is placement, not word count.** An instruction to flag something *before* the findings
  table, or never in a footer, is about **where** it goes. Brevity never moves it.
- **Speak in simple terms.** Prefer plain words over jargon wherever a simpler word carries the same
  meaning. Where a term is load-bearing — a filename, a marker, an ADR, a status value, and anything
  else the reader must act on; the list is illustrative, not exhaustive — use it and gloss it once.
  **Simplifying is about wording, never content:** it never drops a caveat, softens a failure, rounds a
  number, or swaps a precise term for a vaguer, friendlier one.
