# Convention: the canonical dependency-declaration form

**One home, one form.** A task brief records its dependencies in `## Notes`, as a bullet whose bold
label is flush against the `**` with nothing before it:

```
- **Depends on:** <tasks, or "nothing">
- **Blocks:** <tasks>
```

Examples that parse:

```
- **Depends on: nothing.**
- **Depends on:** 0110 (evolved lead) and 0112 (wiring).
- **Depends on: task 0072** — soft, not hard.
```

## Why this exists

`dashboard.sh` (the `/fkit-status` board renderer) derives each open task's **Next step**
(`ready` / `after N`) by parsing the dependency straight out of the brief. It reads the canonical form
above — and a handful of legacy equivalents (a `## Depends on` section, a plain line-start
`Depends on:`). It does **not** reliably read a declaration wrapped in decoration.

**The failure it prevents (task 84 / `0092`):** that brief wrote

```
- **⚠️ Depends on tasks 82, 83 and 81 Part D — …**
```

The `⚠️ ` sits between `**` and `Depends on`, so the parser's bold anchor missed it, the script emitted
`none recorded`, and the board's contract maps that to **`ready`** — a false "nothing blocks this."
The producer hand-corrected it for **seven consecutive status runs**. A dependency the record states
but the tool cannot see is a dependency the board silently drops.

Prior art: the `0020` review (R19/R40) established that locating a dependency from arbitrary free text
is unreliable ("CommonMark-in-awk"), and that the grammar was an *unenforced emergent convention of one
author*. This convention makes it enforced: `fkit-task-brief` writes the canonical form, and this doc
is its single documented home.

## The guard (task 0107)

The parser no longer fails **silently** on a non-canonical declaration. A line whose `Depends on`
label is preceded only by markup/decoration (the `0092` shape) now renders a LOUD
`⟨derive: UNPARSEABLE — see brief⟩` plus a `drift depends-unparseable` fact, instead of a fabricated
`ready`. The guard is scoped so ordinary **ASCII** prose that merely *mentions* dependencies (any
Latin letter before the label) and code-span mentions do **not** trip it. It is **not** prose-proof in
general — a declaration-shaped line with a non-Latin-script prefix, or in a blockquote/table, can still
trip it. That is the safe direction (a LOUD flag, never a fabricated `ready`) and is an accepted
residual (task `0107` review R1), not a defect.

**The guard is a safety net, not a licence.** The fix for a LOUD row is to rewrite the dependency in
the canonical form above — not to leave the guard firing.

## How the board reads the IDs (task 0492)

The Next step (`ready` / `after N`) is still read from the declaration's text as a whole. One more
check reads the **task IDs** on the line: on a sprint board, `drift depends-on-later-sprint` flags an
open task that **hard**-depends on an open task the sprint cannot count on (on the Backlog board, or
in a later, not-started, closed or unresolved sprint). It reads the line like this:

1. **Only exact 4-digit task IDs are read** — `0110`, not `110`, `T-023`, `ADR-0047`, or a date such
   as `2026-09-13`. Every such ID in the declaration counts, even one mentioned in passing. An ID with
   no task folder (a year, a typo) is skipped.
2. **To mark a dependency soft, write `— soft, not hard` after its ID** — the same marking
   `/fkit-task-brief` uses. A soft ID is skipped by the later-sprint check; anything not marked soft is
   read as **hard**. The mark covers the ID before it, up to the next different ID: in
   `0110 and 0112 — soft, not hard`, only `0112` is soft. The first `soft` or `hard` after the ID
   decides, and only as a **whole word** — `software`, `Microsoft` or `harden` decide nothing (task
   `0492` review R1). An ID named more than once is soft only if every mention is.
3. **The bold form works.** In `- **Depends on: task 0072** — soft, not hard.` (the third example
   above), the text **after** the closing `**` decides soft or hard. An ID that appears only there is
   not a dependency.
4. **Known misses — write around them:**
   - the word **before** the ID (`soft: 0110`) reads as **hard** — it over-flags, the safe direction;
   - ranges like `0485–0491` are **not** expanded — name each ID;
   - a negated `(not soft)` reads as **soft** — the quiet direction, so never write it; write `hard`;
   - a link to the task's folder repeats the ID in its path — `[0110](../0110-make-it-soft/brief.md)`
     or `0110 ([brief](../0110-make-it-soft/brief.md))` — so a word `soft` or `hard` in the slug can
     decide it: both read **soft**, the quiet direction. Write the ID and its mark first, then the
     link, then the mark again:
     `0110 — hard, not soft ([brief](../0110-make-it-soft/brief.md)) — hard, not soft`. A slug with the
     word `hard` still reads hard — it over-flags, the safe direction.

## Rules

- **Declare in `## Notes`, in the canonical form.** No decoration between `**` and the label.
- **`nothing` is a valid value** — write `- **Depends on: nothing.**` rather than omitting the line, so
  the absence is explicit.
- A brief with **no** dependency line at all still resolves to `ready` — the board treats a genuinely
  absent declaration as "nothing blocks this."

Related: `conventions/one-skill-one-output.md` (the board is one deterministic output);
task `0107` (this guard + convention); task `0020` (the dashboard's design).
