## Step 1 — Two native reviewers

The reviewer performs its own pass. A fresh native adversarial-reviewer context supplies the
second opinion on the same scope, with the full diff, changed untracked files, brief, and settled
residuals. Do not run Codex or a Claude fallback. The second pass is the native colleague's work;
never substitute your own hostile pass and call it independent.

Record actual provider/model identities for author, primary reviewer, and second reviewer.
Unknown identity, the same model family, a failed worker, empty output or output unrelated to the
scope means incomplete review. Preserve the second pass verbatim, then verify and deduplicate.

## Coverage states

Choose exactly one, with evidence, in every report and every round's ledger header:

- **both reviewers measured** — a usable second-model pass, and both reviewers executed a
  behavior-bearing command with an actual result. Reading source, syntax checks, and imagining
  execution are not measurement. Name each command and result.
- **reasoning-only second opinion** — a usable, verified second-model pass, but either reviewer
  only read/reasoned. State which checks did not run. This is a valid second opinion.
- **second model unavailable** — no usable independent pass or diversity not verified. Start the
  report with `⚠️ [NOT model-diverse — INCOMPLETE]`, before any findings; state the reason and
  use `Decision: 🟡 Partial review`. Never pair this state with Ready to merge or automatic closure.

The evidence clause names actual native sessions/agents, models, scope and results. Never
invent CLI versions, exit codes, measurements, sandboxing or model provenance.

