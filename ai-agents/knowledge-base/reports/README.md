# Reports — dated artifacts of work performed

One-off documents produced by a piece of work at a point in time, and **true forever after** because
they describe what was done or found *then*:

- **audits** — a survey of the state of something (e.g. doc drift across the repo)
- **verifications** — evidence that a flow was exercised and passed or failed
- **evaluations** — a comparison of candidate approaches, usually feeding an ADR
  (the architect's `/fkit-evaluate-approach` output)
- **plans** — a worked-out plan for a chunk of work, including once it has been executed

## Naming

`YYYY-MM-DD-<short-slug>.md`, dated by when the work was done. The slug should carry the kind:

```
2026-07-11-doc-drift-audit.md
2026-07-12-onboarding-verification.md
2026-07-13-tester-agent-evaluation.md
2026-07-11-plan-omnigent-removal.md
```

Same date-first pattern as `../incidents/`, on purpose — see the root rule in
[`ADR-013`](../decisions/adr-013-knowledge-base-root-holds-the-living-canon.md): the knowledge-base
root holds **only `PROJECT.md` and `architecture.md`**; everything else is filed by kind. Its
corollary: **a dated filename means "a record of a moment"**, so it never appears at the root or in
`../conventions/`.

## Lifecycle — filed is not dead

A report is filed here the moment it is written, not when it is "finished with". Being in `reports/`
says nothing about whether the document is still load-bearing:

- A report can be a **live input to an open question** — an evaluation sitting here is exactly what an
  undecided ADR is waiting on.
- A report can be **spent** — a plan that has been fully executed. It still stays, because it is the
  record of *why* the work was shaped the way it was.

Reports are **not edited** once written, except for factual corrections marked inline, and except for
a **Status** line if the doc carries one (an evaluation moving from `open` to `decided — see ADR-NNN`
is a status update, not a rewrite).

**A report is never promoted out of `reports/`.** If a report's conclusion hardens into a standing
rule the project reads on every run, that rule gets written as its **own document in
[`../conventions/`](../conventions/README.md)** (and, if it was a real decision, an ADR in
`../decisions/`) — and the report stays here as the evidence behind it. Evidence and law are
different kinds of document; a report never becomes one by being right.

## Not `history/`

`../history/` is narrower and is **not** the general archive: it holds **superseded design documents**
— docs that once described the intended architecture and no longer describe reality (ADR-002). A
report does not become false when the system changes, so it is never relocated to `history/`.
