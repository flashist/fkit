# Design options to investigate

Status: working hypotheses, not decisions. None has been proven to meet all existing role guarantees.

## A. Native Codex sessions and subagents

Use project-scoped custom agents for roles, Codex skills for procedures, runtime configuration for models, and hooks where supported. An fkit launcher prepares the root session and handles bootstrap. The lead delegates to named subagents.

Advantages: smallest integration, native interactive experience, fresh subagent contexts, per-role model configuration in documented custom agents. Risks: the documented subagent permission inheritance may prevent a stricter reviewer sandbox; skill isolation and hook trust need proof; a role's developer instructions are not by themselves a security boundary. Explicit spawn model precedence may override defaults, so test the complete resolution chain.

## B. fkit-managed separate CLI processes

Launch each role in its own Codex process with a role-specific prompt, model, sandbox and controlled settings. A driver passes work and collects results.

Advantages: potential independent context and process-level sandbox per role, including a read-only adversarial pass. Risks: a CLI process launched by a writable agent may inherit or be constrained by the outer sandbox, so verify actual nesting; orchestration, streaming, cancellation, ownership and interactive questions become fkit's responsibility. Skills and permissions must still be tested rather than assumed isolated.

## C. Hybrid

Use native agents for ordinary role consultation and a separate, restricted process for the adversarial pass. Use an fkit-owned dispatcher or scoped skill configuration where native mechanics are insufficient.

Advantages: preserves native collaboration while retaining a potentially distinct review sandbox. Risks: two invocation paths, identity propagation and model configuration drift; normal roles may still lack equivalent skill enforcement. Test first; do not introduce a dispatcher without a demonstrated gap it resolves.

## Evaluation gates

Compare these options against: seven usable roles; per-role model override and inheritance; fresh contexts; real caller identity at skill use; producer-only movers; wiki write boundary as honestly described today; owner plan/decision relay; reviewer sandbox; safe failure on missing hooks; install/update isolation; macOS local operation; and later Claude adaptation. For every gate record the exact version, setup, observed result, bypasses and remaining uncertainty. Distinguish documented behavior from a local observation, and a procedural rule from a structural boundary.

## Initial recommendation

Prototype A and the isolated-review element of C first because both build on existing primitives and current fkit behavior. If they cannot meet an owner-required boundary, evaluate B. This is an investigation order, not an approved architecture. A read-only process must be measured in the actual nested invocation environment, and no approach is accepted until the end-to-end role flows and failure modes have been exercised.
