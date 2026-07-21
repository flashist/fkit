---
name: fkit-record-decision
description: Record an architecture decision as an ADR (Architecture Decision Record) — context, the decision, the options weighed and why the others were rejected, and the consequences. Saved to ai-agents/knowledge-base/decisions/ — never the wiki (fkit-wiki ingests it later). Makes no commits.
---

# Record Decision — Architecture Decision Record (ADR)

> ## ⛔ Owner: the **architect**
> This is the fkit-architect's own procedure. Execute it **only** if you are the architect — running as the
> `fkit-architect` agent or in a `fkit architect` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-architect Record an ADR for <decision>
> ```


Capture a settled architecture decision durably, so the *why* survives and future reviewers (and
reviewers' reviewers) start from the decision instead of re-litigating it.

**Argument:** `$ARGUMENTS` — the decision to record (and any context/options you already have).

> **Boundaries.** ADRs are written to **`ai-agents/knowledge-base/decisions/`** — the architect's
> source-of-record location. This is **not** the wiki's `decisions/` pages: writing/synthesizing into
> `ai-agents/wiki-vault/` is the **fkit-wiki** agent's job. When an ADR should appear in the wiki,
> recommend the owner run fkit-wiki's `ingest` on it. Never write the wiki yourself.

## Step 1 — Establish the decision and its grounding

- Confirm what decision is being recorded and that it is actually **settled** (an ADR records a
  decision, not an open debate — if it's still open, use `fkit-evaluate-approach` first).
- Ground the context in the codebase and any prior docs (`ai-agents/knowledge-base/`, including a prior
  evaluation under `reports/` — `reports/YYYY-MM-DD-eval-*.md` — if this decision came from one). Cite
  `path:line` where relevant.
- Ask the owner for anything missing: the real driver, constraints, and which alternatives were
  genuinely considered. Do not invent rationale.

## Step 2 — Assign the ADR number and file

> ### ⚠️ Derive the number from FILES ON DISK — never from prose
>
> **The 2026-07-19 collision, by name.** This skill derived the next number by listing
> `ai-agents/knowledge-base/decisions/`, saw `adr-028` as the highest, and allocated **029**. But 029
> was already claimed: a task brief referenced it and roughly **ten `ai-agents/wiki-vault/` pages had
> already ingested it**. The only place it was *not* claimed was `decisions/` itself — the file did not
> exist on disk yet. The stop-hook decision had to be renumbered to ADR-030.
>
> **A content sweep was built to close that gap, and removed on 2026-07-20 after failing three times.**
> Each failure was the same shape: **prose documenting the mechanism poisoned the mechanism.** A review
> ledger writing `adr-1029` as an example made the sweep report the highest claim as 1030. Requiring a
> slug did not help — `adr-999-placeholder.md` has one. Anchoring on `decisions/` did not help either,
> because a full path in an ordinary sentence is indistinguishable from a real reference. Worse, the
> documented way to *reserve* a number and the way to *poison* the sweep were the same string.
>
> **So the rule is now the narrow one that cannot fail this way: count files, not words.**

- **Step A — every `adr-*` file must conform. This must print NOTHING:**

  ```
  find ai-agents/knowledge-base/decisions -type f -iname 'adr-*' -exec basename {} \; \
    | grep -viE '^adr-[0-9]{3}-.+\.md$'
  ```

  Anything it prints is a **malformed ADR filename — stop and fix it before allocating.** ⚠️ This check
  is not tidiness; a malformed name silently breaks the number extraction below. Verified: with
  `adr-031.md` present (no slug), the extraction reported the highest as **30**, so **031 would be
  allocated a second time**. The canonical shape is `adr-<NNN>-<slug>.md`, three or more digits, a
  **non-empty** slug. The same shape is enforced by `parseAdrFilename()` in
  `test/adr-number-uniqueness.test.js` and assumed by `/fkit-wiki-lint`'s cross-check — **all three
  must agree, or allocation can create a series neither detector can see.**

- **Step B — the highest number in use:**

  ```
  find ai-agents/knowledge-base/decisions -type f -iname 'adr-*' -exec basename {} \; \
    | grep -oiE '^adr-[0-9]{3}-' | grep -oE '[0-9]+' | sed 's/^0*//' | sort -n | tail -1
  ```

  Add one. **If it prints nothing, the answer is `001`** — the normal first run in a fresh project, not
  an error.

  - **`-type f`** — a *directory* named `adr-999-placeholder.md` is not an ADR. Without this it is
    counted and every future ADR is numbered from 1000, permanently.
  - **`-iname`, not `-name`** — an `ADR-031-x.md` is the same ADR to every human who reads it. ⚠️ This
    was fixed once, then **silently reverted** by a later rewrite of this command and not noticed for a
    round. If you rewrite this pipeline, re-run the uppercase case.
  - **`sed 's/^0*//'` then `sort -n`** — identity is **numeric**. Lexicographically `adr-999` sorts
    above `adr-1029`, and `029`/`0029` are the *same* ADR. The same numeric rule holds in
    `test/adr-number-uniqueness.test.js` and in `/fkit-wiki-lint`'s cross-check; **all three must
    agree**, or a collision one catches another waves through.
  - **No `2>/dev/null`.** An unreadable directory is not an empty one. If `find` reports an error, stop
    and resolve it — do not allocate from a partial scan.

> ### ⛔ THE GAP THIS LEAVES — a manual step, not a guarantee
>
> **This derivation cannot see a number claimed before its file exists** — which is exactly the
> 2026-07-19 case. That gap is **real, and it is stated here rather than covered by an automated check
> that kept failing open.**
>
> **So before you allocate, look — with your eyes, not a pipeline.** Check whether the number you are
> about to take is already spoken for by work in flight: a task brief referencing an ADR that has not
> been written yet, a design report promising one, an in-flight branch. `grep -rn "ADR-<N>" ai-agents/`
> is a reasonable starting point — **read the hits and judge them**, because that judgment is precisely
> what no version of the automated sweep could do.
>
> **Detection on the other side:** `/fkit-wiki-lint`'s ADR number/slug cross-check finds a collision
> once it exists in the vault, and `test/adr-number-uniqueness.test.js` finds two ADR files sharing a
> number. Neither prevents the allocation; both catch it afterwards.

> ### ⛔ This step does NOT read `ai-agents/wiki-vault/` — and that is a deliberate limitation
>
> An earlier version swept the whole repository, vault included, for claimed numbers. **It was removed
> on 2026-07-20** after prose in ordinary documents poisoned it three separate times. The derivation now
> reads only ADR *filenames* under `knowledge-base/decisions/`.
>
> **So do not rely on this step to notice a number already ingested into the vault.** That was exactly
> the 2026-07-19 collision, and it is the gap the manual check below exists to cover. Reading the vault
> is permitted to any role (reads are decentralized, ADR-005) — **writing it is fkit-wiki's alone**, and
> nothing in this skill writes it.

## Step 3 — Write the ADR

Use this structure:

```
# ADR-<NNN>: <title>

- **Status:** proposed | accepted | superseded by ADR-<NNN> | deprecated
- **Date:** <YYYY-MM-DD>   (use today's date from the session context)
- **Deciders:** <who>

## Context
The forces at play: the problem, the constraints, and what makes this a real decision. Cite
`path:line` and any `reports/YYYY-MM-DD-eval-*.md` this came from.

## Decision
The choice made, stated plainly and unambiguously.

## Options considered
- **<Option A (chosen)>** — why it wins.
- **<Option B>** — why it was rejected.
- **<Option C>** — why it was rejected.

## Consequences
- **Positive:** what this buys us.
- **Negative / costs:** what we accept by choosing it.
- **Residual risks / "re-raise only if":** the condition under which this should be reopened — so a
  future review treats a matching finding as closeout, not a new defect.

## Related
Links to relevant `path:line`, design specs (`reports/YYYY-MM-DD-design-*.md`), evaluations
(`reports/YYYY-MM-DD-eval-*.md`), or superseded ADRs.
```

Keep it tight and honest — the value is the *why* and the rejected alternatives, not length.

## Step 4 — Report

State the ADR written (path + number + status) and its one-line decision. **Make no commits.** Note
that **fkit-wiki** should ingest this into the wiki's decisions pages if it belongs there — you do not
write the wiki.
