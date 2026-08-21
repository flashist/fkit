---
name: fkit-record-decision
description: >-
  Record an architecture decision as an ADR (Architecture Decision Record) — context, the decision,
  the options weighed and why the others were rejected, and the consequences. Saved to
  ai-agents/knowledge-base/decisions/ — never the wiki (fkit-wiki ingests it later). Makes no
  commits.
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

> **Correcting an existing ADR, not recording a new one?** Skip Steps 1–4 — they assume a new ADR —
> and use §"Correcting an accepted ADR — the dated correction note" below.

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

## Correcting an accepted ADR — the dated correction note

Use this when a **claim inside** an accepted ADR has drifted — code moved, a count changed, a named
mechanism was replaced — but the decision itself still stands.

**When to use, and when not:**

- A correction annotates a stale claim inside an ADR whose **Status stays `accepted`**. The single
  most likely wrong move is marking it `superseded` — `superseded` says the *decision* was replaced,
  and a drifted fact does not replace a decision.
- It is NOT for a genuine reversal of the whole ADR. A reversal is a **new ADR plus a ⛔ notice**
  in the old one pointing at it.
- It is **not a licence to edit** ADR prose. The recorded text is history; corrections are appended
  next to it, never written over it.

**Piece by piece — the form has three parts:**

1. A **drift note** — a dated ⚠️ blockquote placed next to the stale claim.
2. A **reversal notice** — a dated ⛔ blockquote, used only when a specific decision inside the ADR
   was overturned.
3. A header **`- **Corrections:**`** metadata bullet, listing the annotated sites.

**The two-marker legend — and only two:**

- ⚠️ = a fact that drifted (the decision is untouched)
- ⛔ = a decision that was overturned (do not follow it)

There is **no third marker**. Mismarking matters: a drift marked ⛔ tells readers to stop following a
decision that in fact stands.

**Append-only, proved by diff — not by eye:**

Every note states that the corrected text is **left byte-identical**. Prove the `+N / −0` shape with
these two commands, not by re-reading:

```
git diff --numstat -- <adr-file>                        # expect "N  0  <adr-file>"
git diff -U0 -- <adr-file> | grep '^-' | grep -v '^---' # expect no output
```

⚠️ **Use that deletion filter exactly.** The shorter-looking `grep '^-[^-]'` is **wrong**: a deleted
markdown list line `- text` appears in the diff as `-- text`, so its second character is also `-` and
the pattern skips it — including every `- **Status:**` and `- **Corrections:**` header bullet, which
is the one line this form tells you to extend. `grep -v '^---'` drops only the diff's own
`--- a/<file>` header line.

**When earlier uncommitted appends already sit on the same file** (task `0195`), the working-tree
diff cannot isolate your change: it is measured against the last commit, so deleting a line that an
*earlier* uncommitted append added still reports `N  0` and still passes the filter above. Copy the
file **before you edit**, then run both of these as well:

```
git diff --no-index --numstat <snapshot> <adr-file>   # expect "N  0"
diff <snapshot> <adr-file> | grep '^<'                # expect no output
```

**Placement — below the claim, deliberately:**

The note goes **below** the claim it corrects. This deliberately departs from the wiki vault's
"banner above claim" convention: a block above a bullet visually **detaches** from the claim it
annotates and reads as section preamble, breaking the narrative — and the reader is already
**warned** first by the header `- **Corrections:**` bullet, so below-placement costs no warning.

**The header bullet's form:**

`- **Corrections:**` is **one metadata item** that **may wrap** across physical lines. It carries the
⚠️/⛔ **legend** and the list of annotated sites. It is the stated **append-only exception**: the one
part of an `accepted` ADR a correction may extend, because it is metadata *about* the notes, not body
text. When a later correction pass extends it (as task `0195` did), **append** continuation lines to
the same item, leave the prior lines byte-identical, and name **which part** of them the new lines
supersede — in the shipped form, only the **site list**: *"The site list in the first line of this
item is left byte-identical and is superseded by this line; the same append-only rule and the same
legend apply."* Do not declare the whole prior item superseded: its ⚠️/⛔ legend, its no-edit
assertion and its *"Status stays `accepted`"* statement are all still binding.

**Indentation follows the claim it annotates:**

The note's **indentation matches** the block it sits under. A claim inside a list item takes the
item's continuation indent; a claim in **top-level prose** takes **column 0**. An indented note under
prose renders inside the wrong list; an indent-0 note is not sloppy — it is the correct form for
prose.

**Cross-reference, do not restate:**

When two sites share a corrected fact, **one site carries the fact** and every other site points at
it — and the pointing note says it is pointing **on purpose**, in the shipped wording: *"deliberately
not restated here, so there is one place to keep true rather than two."* Restating creates two copies
to keep true; one of them will drift.

**Worked example, by name:** ADR-010 (`adr-010-role-locked-sessions-and-skill-lockdown.md` under the
knowledge-base decisions directory) carries all five shipped notes. Task `0143` established the form
(first application); task `0195` generalized it (second application — the indent-0 note under
top-level prose, and the cross-reference note). In this repository, read ADR-010 before writing your
first correction.

**Two auxiliary form rules (ratified with the form, task `0143`):**

- Notes are **dated** and written **present-tense with a verification date** — "verified against live
  code YYYY-MM-DD" — not past-tense narration.
- **Citation form:** cite mutable files by **file + quoted phrase, never `:NNN`** line numbers — on
  `0143`'s own append, 12 sibling line-number pointers broke while its quote-anchored citations
  survived.

**Hand off when you are done.** Report which sites you annotated and state the proof figures above.
The Boundaries note at the top of this skill covers a **new** ADR; a **corrected** ADR whose wiki page
already exists leaves that page stale — so also recommend the owner have **fkit-wiki** re-ingest the
ADR. You do not write the wiki yourself, and you **make no commits**.
