## Step 4 — Consolidated report

If incomplete, put `⚠️ [NOT model-diverse — INCOMPLETE]` first, with the reason. Then report:

```
# Review — <scope>
Decision: <verdict>
Coverage: <state> — <native provenance and execution evidence>

| # | Reviewer | Reviewer severity | Verified verdict | Defect / frontier-move | One-liner |
|---|----------|-------------------|------------------|------------------------|-----------|
```

Choose exactly one verdict: `✅ Ready to merge` (no open defects),
`⚠️ Changes requested — N defects (none blocking)` (medium/low),
`🛑 Blocked — N confirmed defects (M high/critical)`, or
`🟡 Partial review — second model unavailable` (takes precedence).
Identify each reviewer/model. Give locations, concrete impact and evidence. Add suggestions
separately from defects, suppressed-as-settled items with ADR pointers, and a convergence call.
The verdict is a recommendation, never authorization to merge or close.

## Hard rules

Review only. Never edit source, commit, push or close tasks. This ephemeral procedure writes no
ledger; use fkit-stateful-review for persistent findings. Both passes are inputs to evaluate,
not authorities. Severity follows verified impact, not the reviewer's label. Do not re-litigate
settled tradeoffs without evidence their re-raise condition fired.
