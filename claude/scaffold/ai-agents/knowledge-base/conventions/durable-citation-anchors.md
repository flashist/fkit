# Durable citation anchors — when a coordinate is safe to cite

> **A coordinate is safe to cite when the citer controls or freezes the target's revision. It is
> unsafe when a third party edits the target after you write.**
>
> **Line numbers are for findings against a revision. Names are for cross-references into living
> documents.**
>
> Ruled by the owner on 2026-08-01, from the 2026-08-01 durable-citation report (task 0160).

The rule block above is the test. A writer's fastest way into it is one question:

> *Am I claiming something about a revision I have read — or pointing a later reader at wherever the
> target will be when they get there?*

**A claim about a read revision is safe. A pointer for a later reader is not.**

> **⚠️ That question is a first cut, not the whole test — and applied alone it gets one row of the
> table below wrong in the unsafe direction.** Walked against the five rows, it cleanly decides
> exactly one of them: the file-under-review row it was written for. Row 1 bundles two uses that
> answer differently. Row 3 it actively contradicts — citing a sprint board line as a claim about a
> revision you read answers *"claim"*, and therefore *"safe"*, while the table rules `path:NNN`
> **wrong** there, categorically. Row 4 it does not parse at all. Row 5 it decides only in part.
>
> **So both conditions must be read together:** the claim-versus-pointer question **and** *is the
> target a document a third party edits under me?* **The second condition is what makes row 3
> categorical**, and it is the one a writer skips. This is a scope statement, not a second rule —
> every reason it names is already in that row's own `Because` cell.

## Never cite a line number naked

**Pair every `path:NNN` with a quoted fragment or the heading it sits under.**

This is the highest-value rule on this page and it applies to every case at once, including the ones
where the line number is correct. A naked pointer that has drifted is indistinguishable from one that
has not. A pointer carrying `sprint-2.md:162 — "Wiki re-ingest the amended ADR-032"` is
**self-correcting**: a reader who finds different text at `:162` knows immediately that the number
moved, and the quote tells them what to search for. The cost to the writer is one clause.

The rider does not make a wrong number right. It makes a drifted number **recoverable**. A coordinate
already known to be wrong is repaired, not annotated.

## Which anchor for which target

| If the target is… | …then | Because |
|---|---|---|
| A source file, test, skill or agent file, cited in a design doc or a finding | **`path:NNN` is correct** | edits arrive as a reviewed diff **to the thing you cited**, so a reader who finds it changed sees the change; they do not silently land on unrelated text that grew above it |
| A file **under review**, cited in a review ledger row | **`path:NNN` is correct — as a claim** | the finding is a claim about the revision the reviewer read. **See the caveat below the table** |
| A **coordination document** others append to — sprint plans, task briefs, an append-only project log | **`path:NNN` is wrong** | third parties append **above** your line for reasons unrelated to your sentence; the file grows under you |
| A **task** | **the folder-name `NNNN` prefix**, always | assigned once, never reused |
| A **board position** | **`P<n>`, and only as rank** | [`priority-is-rank-not-identity.md`](priority-is-rank-not-identity.md) — *"A sprint board's Priority cell is board rank, written `P<n>`. A task's identity is its task-folder name's `NNNN` prefix, and nothing else."* |

> **The caveat on the review-ledger row, stated rather than glossed.** "Frozen by construction" is
> true of the reviewer's **assertion** and false of the **reader's resolution**. In a multi-round
> stateful review a round-1 finding is re-read in round 2, *after* the coder has edited the cited file
> in response to it — so the number in the `file:line` cell may no longer land where the reviewer was
> looking. The row stays on the safe side because the finding is a claim, not a forwarding address;
> what makes it **re-resolvable** in round 2 is the paired-quote rider, not the number.

### Applying the two conditions to a target the table does not name

**This section is this page's own judgement, not part of the ruling transcribed above.** The five
rows do not enumerate every kind of target, and the commonest gap is a **decision record that carries
appended correction notes** — a document that is immutable in its *claims* and still grows in its
*text*.

Apply the second condition: *is this a document a third party edits under me?* An append-corrected
decision record answers **yes** — every dated note appended above your line moves it, for reasons
that have nothing to do with your sentence. So it lands on row 3's side of the table: **`path:NNN` is
wrong; anchor by heading plus quoted fragment.**

⚠️ **A heading alone is usually not enough.** A top-level heading in a long document can span a
hundred lines and swallow every citation into it, which is durable and useless. **The fragment does
the locating; the heading gives the reader a region to look in.** Where the target sits under a
nested or dated sub-heading, name that one — it is the smaller region.

### Citing a task — one form, and the variant that hides from every sweep

Row 4 rules the anchor: the folder-name `NNNN` prefix, always. Two practice notes on top of it.

**Write `` `NNNN` (`folder-slug`) `` on the first occurrence in a file, and bare `` `NNNN` ``
after.** The ID is the durable half and the slug is the readable half; repeating the slug on every
mention buys nothing and rots when a folder is renamed.

⛔ **`task-NN` and `task NN` are the same citation class, and both are wrong.** The hyphenated form is
not a different mistake, it is the *same* mistake spelled so that nobody finds it. It has repeatedly
survived sweeps that repaired every spaced occurrence in the same files, because the sweep's search
pattern matched only the spaced form and the hyphenated one is invisible to it. **A citation form is
only as good as the pattern that finds violations of it** — when you sweep for a bad form, sweep for
its spellings, not for the one you happen to have typed. This is the *wording drift* limit below,
firing on the writer's own tooling.

## Link labels

> **Do not use a mutable location as the visible label of a forwarding link into a living document.**
> Where a link exists to point a later reader at wherever the target will be when they get there,
> label it with what the target *is* (`brief`), never with where it *lives*
> (`ai-agents/tasks/done/<slug>.md`). The **target** carries location; the **label** carries meaning.
> A label that names a path is a second, unmaintained copy of the coordinate — and the copy the
> reader actually reads.

This is the paired-quote rider applied to the label rather than the line number, and it is the same
failure both are about: a coordinate rendered as display text, with nothing to make its drift
visible. A dead link fails **loudly** — following it does not work. A stale label on a working link
fails **silently** — following it works fine, and the one part the reader can check by clicking is
the part that was never broken.

⚠️ **The ban belongs to forwarding links into living documents, and nothing wider.** A label that is
a **claim about a revision the writer read** is governed by the rule block at the top of this page,
not by this one — including when that claim is wrapped in a link. `` [`config.ts:42`](config.ts) ``
in a design doc is row 1, and row 1 rules it **correct**.

**Repairing one.** If the target resolves, replace the label and leave the target alone. If it does
not, the pointer is dead and gets the durable form. The repair that fixes nothing is *prepending* a
durable ID and leaving the stale path standing after it — that satisfies the letter of every rule
here and changes nothing a reader sees.

## Review-ledger practice

A review finding's `file:line` cell **stands**. The finding is a claim about the revision the
reviewer read, which is the safe side of the test, and nothing on this page bans it.

But the paired-quote rider reaches it too. **The ask on a reviewer is: put the quoted fragment or the
heading in the `Claim` cell, always.**

⛔ **This is a practice recommendation, not a schema change.** A findings row has no quote field and
this page does not add one. The `Claim` cell and the ledger's per-finding evidence section are where
the fragment goes today.

## Verifying a claim about text

A citation form is worth nothing if the command a reader uses to check it lies to them. This section
is the checking half of the same subject, and the companion to
[`evidence-before-assertion.md`](evidence-before-assertion.md): that page says a claim about project
state must come from a check made this turn, and this one says what makes the check trustworthy.

1. **A single-line `grep` cannot see a phrase that wraps.** Prose in a maintained document is
   line-wrapped, and a rule that reads as one sentence may live on two lines with an indented
   continuation. An **absence** claim over prose therefore needs **whitespace-normalised** matching
   before it may be asserted.

2. **The squeeze is load-bearing.** The form is `tr '\n\t' '  ' | tr -s ' '`, then match.
   ⚠️ **A bare `tr '\n' ' '` still misses it.** Joining the lines does not remove the continuation
   line's indent — it turns it into a run of internal spaces, and the phrase still does not match.
   The `tr -s ' '` that collapses that run is what makes the check work. Dropping it is a false
   negative, not a near miss.

3. **`grep -c` counts matching LINES, not occurrences.** Two hits on one line count as one. Where a
   **count** is load-bearing — *"the file's only occurrence"*, *"exactly three sites"* — derive it
   with `grep -o … | wc -l`.

4. ⭐ **Direction matters, and this is what keeps the rule cheap. A PRESENCE claim cannot fail this
   way.** If a `grep` found the text, the text is there — a wrapped phrase produces false
   *negatives*, never false positives. **Only ABSENCE claims need the expensive form.** Applying it
   to every match you run is a waste, and reading this section as requiring that is a
   misreading of it.

5. **Record the known limits honestly.** The normalised form is strong against wrapping and weak
   against the following, all of which read as absence:
   - **a phrase split by a line-start marker** — a `>` opening a blockquote's continuation line, or a
     `-`/`*` opening a list item's, survives the join and defeats the match. This one **does** have a
     remedy: strip leading markers as well as whitespace before matching, with
     `sed 's/^[[:space:]>*-]*//'`, then join and squeeze;
   - **a phrase split across table cells — and this one has no cheap remedy.** The `|` sits *between*
     cells, not at the line start, so the strip above leaves the line byte-identical and the match
     still fails. ⛔ **Do not reach for deleting every `|`.** That welds unrelated cells into one run
     and buys a false *positive* for the false negative: a phrase that spans a cell boundary, and is
     present in no cell, begins to match. **Treat a phrase that may cross a cell boundary as
     unverifiable by this method, and say so** rather than reporting its absence;
   - **wording drift** — a rule reworded survives in different words, and only the exact phrase you
     chose is tested; nothing tells you the phrase was the wrong one;
   - **code fences are treated as prose** — a phrase found may be an illustrative example rather than
     a binding rule, and the matcher cannot tell you which;
   - **hyphenation across a line break is not modelled** — a token broken as `task-\nbrief` joins to
     `task- brief` and is still missed;
   - **inline emphasis splits a phrase** — `**bold**` and `*italic*` markers sit *inside* sentences and
     survive every transform here. A phrase that reads as one continuous run when **rendered** may be
     `…real, **and** the rest…` in the source, so a fragment quoted verbatim-as-rendered can be
     unfindable by any raw search — including this one. Quote a run that lies **wholly inside or
     wholly outside** the emphasis markers.

   ⛔ **The normalised form is not a clean sweep, and presenting it as one is the defect this whole
   page is about.** State which of these limits your check did not cover, in the same breath as the
   result.

## Where this is enforced

Honestly: **almost nowhere, today.** Stated plainly rather than implied away.

- **The meaning of a line number cannot be enforced, ever.** No check can tell that a coordinate
  still means what its writer meant. The paired-quote rider makes drift *visible to a reader*; it
  does not make it *detectable by a machine*.
- **The coordination-document ban is mechanically checkable and is not checked.** A syntactic guard
  for it is named and unwritten; writing it is separate work from writing this rule.
- **The review-ledger practice note is unenforced.** The findings schema has no quote field and
  gaining one is out of scope here.
- **The link-label rule is unenforced.**
- **The verification section is unenforced.** It is a method a writer follows, not a gate anything
  runs.

**Do not read this page as guarded.** What is in force is the rule; what checks it is a reader.

## Provenance

The 2026-08-01 durable-citation decision report (task 0160), §1, §1.1, §1.2 and §4.2.1 — the rule
block, the five-row table and its caveat, the scope note on the claim-versus-pointer question, the
paired-quote rider, the review-ledger practice note, and the link-label rule in its narrowed wording.
The board-rank row is carried, not re-decided; it belongs to
[`priority-is-rank-not-identity.md`](priority-is-rank-not-identity.md).

⚠️ **The narrowed link-label wording is deliberate.** That rule was first written as a flat ban on a
link's display text being a mutable coordinate, and was narrowed because as written it contradicted
row 1 of the table. **Do not restore the wider form.**

**The verification section is not from the report.** It was folded in by owner ruling on 2026-08-14,
after a backlog triage judged a task obsolete on a single-line `grep` that returned zero for a clause
that was live in three shipped files — the clause wrapped across a line break with an indented
continuation. Acting on that verdict would have deleted a working rule from files that ship into
every project. The measured naive-versus-normalised readings, and the files they were taken over, are
recorded in the 2026-08-14 backlog-triage re-check report; they are a dated specimen and deliberately
do not appear in the rule above.

> **⚠️ The reports above are cited by name and NOT linked — deliberately. Do not "fix" this.** This
> file is dual-homed and must stay **byte-identical** in both copies (the rule is
> `dual-home-parity.md`, cited bare here because it is fkit-repo-only and ships to no project), while
> `knowledge-base/decisions/` and `knowledge-base/reports/` are **never synced** into
> `claude/scaffold/` and ship empty. A relative link to either would therefore be **dead in every
> project fkit sets up**, and making it resolve would mean letting the two copies diverge. Owner
> ruling, 2026-08-01. The same
> test rules out linking anything under `ai-agents/tasks/` or `ai-agents/sprints/`, and
> `dual-home-parity.md` itself. `priority-is-rank-not-identity.md` and `evidence-before-assertion.md`
> above *are* linked, because they are themselves dual-homed and present in both trees — that is the
> test to apply before adding any link here.
