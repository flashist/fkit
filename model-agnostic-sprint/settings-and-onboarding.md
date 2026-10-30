# Proposed settings and onboarding

Proposal for owner review; names and schema are not implemented.

## Concepts

- **Runtime:** the agent application fkit launches, initially Codex CLI, later Claude Code and other adapters.
- **Provider:** the service behind a runtime. A runtime may support more than one provider, but this first stage uses the CLI's existing account.
- **Model:** an exact identifier accepted by that runtime/account.
- **Role:** fkit responsibilities and skill ownership, independent of the model. All seven roles always exist.

Changing a role's model must not change its permissions, authority or review isolation. A smaller wiki model is an override, not a different wiki workflow.

## Configuration proposal

Use a project-local ignored file such as `.fkit/model-settings.json` for stage 1, separate from generated `.fkit/settings/` hook settings. Stage 2 may add shared project defaults, but should decide their location and override policy explicitly. Do not repurpose existing hook JSON as model configuration.

Illustrative schema (model names below are placeholders, never shipped defaults):

```json
{
  "schemaVersion": 1,
  "default": { "runtime": "codex", "model": "<chosen-model>" },
  "roles": {
    "wiki": { "model": "<chosen-smaller-model>" },
    "adversarial-reviewer": { "model": "<chosen-review-model>" }
  }
}
```

Omitted roles inherit the default. Start with exact model IDs and optional runtime-supported reasoning effort; do not invent a universal reasoning scale. An explicit runtime change must resolve a model for that runtime rather than carrying over an incompatible ID. Mixed-runtime roles are a stage-2 capability, not a stage-1 promise.

Resolve in this order: saved role override, saved project default, then an explicitly adopted runtime default if the owner chose that option. Avoid implicit fallback after invalid settings or an unavailable configured model. First-run setup can offer the CLI default, but must display that selection and record that it is runtime-controlled. A one-session override is optional scope; if implemented, define whether it affects only the launched role or delegated roles, and display the result.

Validate JSON, schema version, allowed role names, runtime adapter, empty IDs and incompatible options before launching. Catalogs are suggestions, not proof of account access; distinguish syntactically valid, catalog-listed and successfully invoked. Refreshing a catalog should not silently replace a saved model. Never print auth data or store keys. No pricing or savings claims without current evidence; model size alone does not prove acceptable wiki quality.

Save atomically after a final settings summary. Cancellation leaves the previous configuration intact. Unknown schema versions refuse with an actionable message. An effective-settings view should explain where each role's model came from.

## First-run journey

1. Launch the opt-in local entry point. Discover local CLI availability without calling a model.
2. If model settings are absent, offer Codex and select the default model from available metadata or exact-ID input. A catalog failure still permits explicit input; it must be labeled unverified.
3. Ask whether all roles should inherit, or whether to customize roles. Show wiki and adversarial reviewer as useful examples; do not force seven model questions.
4. Show the seven-role summary. Explain: a fresh adversarial role runs even with one model; a different model is recommended for another perspective. Do not require a second installation.
5. Check authentication using the CLI's supported mechanism; leave credential handling to the CLI. A failed check offers a recovery command and preserves settings.
6. Save settings, then perform safe project setup. Start producer for a fresh project, respecting intake and existing skip behavior; consult architect and wiki through the selected runtime.
7. Open lead only after the existing successful-initiation conditions hold. Interrupted or incomplete setup returns an actionable state.

Existing `ai-agents/` project with no model settings: run model setup only, not the product interview again. Explicit role launch on a fresh project must have documented behavior consistent with the existing launcher. Noninteractive launch must use valid saved settings or fail with instructions; never hang for input or guess an approval. Reconfiguration updates models without repeating product onboarding.

## Review status proposal

Keep three independent facts in every report:

| Fact | Proposed values |
| --- | --- |
| Pass availability | Primary plus usable adversarial pass; primary only because adversarial failed/unavailable |
| Model diversity | Same model; different identified models; model identity/diversity unknown |
| Execution evidence | Per-pass commands and results, or reasoning-only |

A successful same-model adversarial pass is a supported two-pass review, with a visible note: **"Both passes used the same model. A different model is recommended for a broader second opinion."** A failed adversarial pass remains a visibly partial review. This wording is proposed; it changes today's diversity-based incomplete label and needs an explicit new decision before implementation. Different runtime or a different reasoning setting does not establish different model identity. Different IDs/aliases may still refer to the same model; disclose unknown identity rather than claiming diversity.

Preserve finding verification, ledger residuals, scope, unique prompt artifacts and evidence-based coverage. Do not require a second model merely to test a configured override: two roles can use one available model in baseline verification, with override routing validated separately.
