# ADR-046: A sprint board may be committed unranked, and erasing a frozen rank is a violation

**Date**: 2026-09-04
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-046-a-sprint-board-may-be-committed-unranked-and-an-erased-rank-flags.md`

> ⭐ **Ingested 2026-09-05** (task `0358`, sweep C). This ADR had **no vault page at all** until this
> pass. ⚠️ **It is UNTRACKED on disk** — new this session, never committed. The bytes read were the
> working tree's, blob `6093dd4b2a80ab4282ab2fa6c2c3c45712c98b5b`. If that work is amended or
> reverted, this page describes a revision that never landed; the hash makes that **detectable, not
> impossible**.
>
> ✅ **Dated resync 2026-09-10 (sync `cf289c2`→`b4a1a52`) — the UNTRACKED clause above is SPENT, and
> the line is left byte-identical.** The ADR was **committed in `5ed0b91`** ("Sprint push"), added as a
> new file. ⭐ **The bytes ingested on 2026-09-05 are the bytes that landed** — the committed blob is
> `6093dd4b2a80ab4282ab2fa6c2c3c45712c98b5b`, byte-for-byte the hash recorded above, so **the risk that
> hash existed to detect did not materialise** and nothing on this page describes a revision that never
> landed. ⛔ **No claim below changes on this account**; only the tracked/untracked fact does.

> ⚠️ **This ADR carries THREE dated correction passes, all 2026-09-05** — and they nest: the second
> supersedes the first's site list, the third supersedes the second's, and **site 3 of the third pass
> corrects a claim inside the first note itself**. ⭐ *"A correction may itself be corrected"* — the ADR
> lists that as its own site rather than folding it into site 1. ⛔ **No decision in this ADR has been
> overturned; the absence of any ⛔ note is itself the record, and `Status` stays `accepted`.**

## Context

`test/closed-rank-immutability.test.js`'s `parseBoard` threw on a Priority cell holding the unranked
marker `—`, which meant a **sanctioned, twice-precedented board state was not committable**. The guard
exists to freeze a **closed row's rank**; its strictness had drifted away from that declared subject.

## Decision

**Two parts, both ruled by the owner on 2026-09-04** (live via `AskUserQuestion` in a `fkit lead`
session, rulings **P1**, **P2**, **P3** at task `0361`'s plan gate). ⛔ The ADR records that ruling; it
does not originate one.

### 1 — A sprint board's Priority cell may hold `—`

`parseBoard` is **widened** to accept the unranked marker as **one literal alternative**, byte-verified
**U+2014** (`e2 80 94`) against a live Backlog cell.

⛔ **Widening is not weakening.** The garbage-cell throw **stays**: `'high'`, `''`, `'P'`, ASCII hyphen
`-` (U+002D), en-dash `–` (U+2013) and `'—5'` must all still throw. The unit test asserting the throw
is **amended and split, never deleted**. A dash of the wrong codepoint is the realistic typo and must
keep failing — which is why the accepted form is a **literal alternative, not a loosened character
class**.

> ⚠️ **Dated correction 2026-09-05 — one item of that must-throw list is UNREACHABLE, and nothing
> changed on its account.** The item is **`'— '`** — an em-dash with a trailing space. `parseBoard`
> binds the cell as `const rank = unmask(cells[2]).trim();` and the rank check runs **after** that
> line, so **the trim precedes the check**: a cell written with trailing space reaches the check as
> plain `'—'` and parses as the unranked marker. `'— '` cannot arrive at the check as a cell value at
> all, and no test asserts it — ⭐ **deliberately, and that absence is the point.**
>
> ⭐ **Every other item on the list is reachable and IS asserted.** The list's substance stands; one of
> its illustrations does not. ⛔ This corrects **one list item's reachability** — it does not narrow the
> widening, does not touch the transition table, and is not licence to revisit the decision.
>
> ⚠️ **The note above itself contained a false claim when written** (third correction pass, same day):
> its assertion about `'P1 (a) (b)'` was wrong. Corrected as its own site.

⭐ Found by task `0361`'s phase-2 coder, which **declined to assert a case it had measured impossible**
and surfaced it instead of papering over it.

### 2 — The closed-row transition table

| `earlier` → `later`, on a **closed** row | Verdict |
|---|---|
| `—` → `—` | no flag — no-op |
| `—` → `P<n>` | ⭐ **allowed** — there was no rank to freeze; the deferral clause being honoured |
| `P<n>` → `—` | ⛔ **FLAG** — erasing a frozen rank destroys the history the invariant exists to keep |
| `P<n>` → `P<m>`, n≠m | ⛔ **FLAG** — unchanged, today's behaviour |
| any transition on an **open** row | no flag — unchanged; open rows may move |

## Consequences

- **Positive.** A sanctioned board state becomes committable, and the freeze the guard actually exists
  to hold gets **stronger**: the erase direction `P<n>`→`—` was previously *unreachable* (the parse
  threw before any comparison) and is now an explicit, flagged violation.
- **Positive.** The transition rule is settled **in writing before it is implemented**, so the
  implementer is not left to invent the semantics of comparing a rank against a non-rank.
- ⛔ **Cost — no ordering semantics.** `—` is compared **verbatim as a string**, like every other rank.
  **No numeric coercion may be introduced** — an unranked row genuinely has no order.
- ⚠️ **Cost — the rule now lives in THREE places**: this ADR, `backlog.md`'s clause, and the test. Only
  the test is executable. **Drift between the prose and the code is caught by nothing automatic.**
- ⚠️ **Residual risk — the wrong-codepoint dash.** `–` (U+2013) and `-` (U+002D) render almost
  identically to `—` (U+2014) and must keep throwing. A character class instead of the literal
  alternative would silently accept all three, invisibly in review.

⛔ **Do not re-raise** the choice between the three options, the transition table's five rows, or
whether `—`→`P<n>` should flag — the stricter reading was considered and **refused by name**, because
it would flag a lawful act both boards instruct.

## Related
- [[tasks/build-the-closed-rank-immutability-guard]] — the guard this ADR widens; ⛔ **phase 2, the implementation, is a coder's act gated on this ADR** and is not the architect's
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the adjacent rank-integrity ruling
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — why the Priority cell is **mutable board rank and never identity**
- [[decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task]] — the other Sprint 7 decision ingested in the same 2026-09-05 pass
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — the rank-integrity lineage this closes a gap in
- *Added 2026-09-10 (sync `cf289c2`→`b4a1a52`):* [[tasks/settle-whether-a-sprint-board-may-be-committed-unranked]] — task `0361`, which produced ADR-046 · [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — Sprint 7, the board that attacked the record-repair rate (archived 2026-09-08) · [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]] — task `0358`, Sweep C — the wiki-vault pass that advanced the watermark over a bounded-out backlog
