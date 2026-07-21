---
name: fkit-wiki-lint
description: The wiki librarian's lint procedure — health-check ai-agents/wiki-vault/ (broken links, stale claims, missing back-links, template drift), fix what's safe, and flag what needs judgment. The wiki role is the exclusive write gateway for the vault.
---

# Wiki Lint — the wiki librarian's procedure

> ## ⛔ Owner: the **wiki** role
> This procedure **writes** `ai-agents/wiki-vault/`, and only the wiki role may do that. Execute it
> **only** if you are the wiki — running as the `fkit-wiki` agent or in a `fkit wiki` session.
>
> **Any other role: do not execute this.** Ask the librarian:
> ```
> @fkit-wiki Run your lint procedure.
> ```

Health-check the whole wiki and fix what's safely fixable.

## Steps

1. **Read the rulebook:** `ai-agents/wiki-vault/schema.md` — the rules to enforce.
2. **Read the catalog:** `ai-agents/wiki-vault/index.md` — the full page list.
3. **Read every page** listed in the index.
4. **Check for these issues:**

   **Structural**
   - Pages missing required metadata fields per schema.md (`**Status**:`, `**Key files**:`,
     `**Date**:` — inline **bold** fields, not YAML frontmatter).
   - Pages that don't follow the schema.md template (template drift).
   - Index entries pointing at non-existent files (broken links).
   - Wiki pages that exist but are missing from `index.md`.

   **Content**
   - Contradictions between pages (two pages describing the same system differently).
   - Stale claims — references to files or functions that no longer exist (**verify with grep**).
   - Orphaned pages — no cross-links in or out.

   **Cross-reference**
   - One-way links: if A links to B, B must link back to A.
   - Links to source files that have moved or been renamed.

   **ADR number/slug cross-check** — *see the dedicated section below; this one is easy to get wrong.*
   - A vault ADR page whose number matches a **different** decision in the knowledge-base.
   - A vault ADR page with **no** knowledge-base counterpart at all.
   - A page whose `# ADR-NNN:` heading disagrees with the number in its own filename.

5. **For each issue:** fix it directly (edit the page), or — if it needs human judgment — flag it in
   place with a `> **LINT WARNING:**` blockquote.
6. **Log it.** Append to `ai-agents/wiki-vault/log.md`, using today's real date:
   ```
   ## YYYY-MM-DD — lint
   - Issues found: N
   - Issues fixed: M
   - Issues flagged for human review: K
   - <one-line summary of the most significant issues>
   ```
7. **Report** a final summary.

---

## The ADR number/slug cross-check — how, and the three ways to ruin it

> ### Why a link check cannot find this
>
> **On 2026-07-19 two different decisions wore the same number.** `/fkit-record-decision` allocated
> ADR-029 by listing `knowledge-base/decisions/` and seeing 028 as the highest — but 029 was already
> claimed by a stop-hook decision referenced in a task brief and **already ingested into ~10 vault
> pages.** The stop-hook decision was renumbered to ADR-030.
>
> **Nothing was broken.** `[[adr-029-stop-hook-…]]` pointed at a real file that really existed; every
> link resolved, nothing 404'd, every link check passed. **Link rot is what a lint detects, and this was
> not link rot** — it was two decisions wearing one number, each internally consistent. It was caught by
> a person noticing. This check is what makes that mechanical.
>
> This is **detection**, and since 2026-07-20 it carries more weight than it used to.
> `/fkit-record-decision`'s numbering step derives the next number from **ADR filenames on disk only** —
> it does **not** scan the vault, or any prose, for claimed numbers (a sweep that did was removed after
> ordinary documents poisoned it three times). **So prevention cannot see a number that exists only in
> the vault** — which is precisely the 2026-07-19 collision. This check is the thing that catches it
> afterwards. Neither replaces the other, and the prevention half is narrower than its name suggests.

### The procedure

For each **regular file** in **`ai-agents/wiki-vault/wiki/decisions/`** matching
`^adr-([0-9]{3})-(.+)\.md$` — **matched case-INSENSITIVELY**:

⚠️ **Regular files only — a directory whose name matches is not an ADR page.** A directory called
`adr-999-placeholder.md` would otherwise be read as one, inventing a page that does not exist and, in
the sibling scan in `/fkit-record-decision`, permanently poisoning number allocation. The same rule
holds in `test/adr-number-uniqueness.test.js`; **all three implementations of this scan must agree.**

⚠️ **Case-insensitive, and this is the single most persistently-lost rule in this file's history.**
`ADR-031-x.md` is the same ADR to every human who reads it, and both of `/fkit-record-decision`'s steps
(`-iname`, `grep -oiE`) and `parseAdrFilename` (`/…/i`) treat it as such. This site did not — so an
uppercase name was **valid and counted by the allocator, and invisible to this cross-check**, while the
blockquote above asserted the three agreed. Across three review rounds this rule was fixed, silently
reverted by a rewrite, re-fixed, and then omitted from a fourth site. **If you touch any of the four,
re-run the uppercase case against all of them.**

> ⚠️ **THIS SECTION CONTAINS THREE SEPARATE ENUMERATIONS, AND THE RULE APPLIES TO ALL THREE** — this
> loop over `wiki/decisions/`, the knowledge-base counterpart lookup in step 1, and the separate
> knowledge-base pass in step 5. The rule was first added to this loop **only**, and a check that
> grepped for the *wording* scored it fixed — because it counted mentions, not enumerations.
> **The unit that has to be enumerated and ticked is the enumeration, not the file.**

1. Find the **regular file** in `ai-agents/knowledge-base/decisions/` carrying the **same number**.
   *(Regular files only — same rule as the vault loop above. A directory whose name matches is not an
   ADR, in this enumeration or any other.)*

   ⚠️ **Compare the number NUMERICALLY, not as text.** `adr-029-…` and `adr-0029-…` are the **same
   ADR** — a human reads them that way and allocation treats them that way. A textual
   `^adr-<same NNN>-` match treats them as different and waves the collision straight through, which is
   the one thing this check exists to catch. **Strip leading zeros before comparing.** The same rule
   holds in `/fkit-record-decision`'s numbering step and in `test/adr-number-uniqueness.test.js`; all
   three must agree, or a collision one catches another lets past. *(They did not agree until
   2026-07-20 — the divergence between the three was itself the finding.)*
2. **No match** → flag **missing counterpart**.
3. **Match with a different slug** → flag **slug divergence**, naming both filenames in full.
4. Check each page's `# ADR-NNN:` heading agrees with the number in its own filename. This catches the
   *second half* of the 2026-07-19 repair — a rename that moves the file but leaves the title line
   claiming the old number. Both steps were needed then; both are checked now.

**Then, as a SEPARATE pass over `ai-agents/knowledge-base/decisions/` — not nested in the loop above:**

5. **Two or more knowledge-base *regular files* bearing the same NNN** → flag loudly. That is the
   collision in its rawest form. *(Regular files only — third enumeration, same rule.)*
   ⚠️ **Compare numerically here too** — strip leading zeros before grouping. This enumeration received
   the regular-file rule but not the numeric one, so followed literally it treated `adr-029-x` and
   `adr-0029-y` as different ADRs: the exact collision this step exists to report, waved through.

   ⚠️ **This must not live inside the per-vault-page loop.** Two colliding knowledge-base ADRs are
   usually **both brand new and neither ingested yet** — which is the normal lagging-ingest state, and
   precisely the 2026-07-19 situation. A check reached only *via* a vault page would therefore be
   unreachable exactly when the collision is freshest and cheapest to fix. It iterates the
   knowledge-base directory directly, whether or not any vault page exists.

   *(`test/adr-number-uniqueness.test.js` also asserts this invariant, so `npm test` catches it too.
   ⚠️ **But nothing runs that automatically — this project has no CI** (`architecture.md:390`: "There
   is no CI and no test suite"; there is no `.github/`). `npm test` runs when a human runs it. So this
   lint step is not redundant belt-and-braces over an automated gate; on a repo where nobody has run
   the suite, it may be the only thing that looks. Do not skip it on the assumption the test covered
   it.)*

**Compare slugs exactly — case-sensitive, no normalization.**

### ⚠️ The three ways to ruin this check

1. **Do not build a fuzzy/normalizing comparison.** It is tempting (truncation? case? underscores?) and
   it is wrong. Vault ADR filenames are **copied verbatim from the knowledge-base filename**, never
   generated from the title — which is why ADR-022's file
   (`adr-022-tools-unrestricted-except-adversarial-reviewer.md`) keeps that name despite an H1 reading
   *"Tool allowlists relaxed for every role except the adversarial reviewer"*. Since nothing generates a
   slug, nothing needs forgiving. Worse: **a normalizer tuned to forgive truncation starts forgiving
   real divergence too**, and the 2026-07-19 slugs (`stop-hook-…` vs `a-task-is-a-folder-…`) are exactly
   what you need it not to forgive.

2. **Iterate over FILENAMES in `wiki/decisions/` — never grep prose for `adr-NNN-` tokens.** A text scan
   across the vault produces false positives that are all **deliberate history**: `log.md`'s account of
   the collision and its repair, the ADR-029/030 pages' own collision notes, and substrings of *task*
   page names such as `[[tasks/rollout-adr-004-fixed-consult-titles]]`. **The vault documents the
   collision on purpose; flagging its own records is how this check loses trust.** Once it cries wolf on
   `log.md`, nobody reads it again.

3. **Do not flag a knowledge-base ADR that has no vault page.** That is **normal** — the vault lags
   ingest by design, and closing that gap is `/fkit-wiki-sync`'s job, not lint's. This check runs in one
   direction only: vault page → knowledge-base counterpart.

### Two deliberate non-rules

- **Skip any decision page that does not parse as `adr-NNN-*` (three or more digits).** `schema.md` mandates only
  `wiki/decisions/<slug>.md`; the ADR prefix is universal in practice but **unwritten**. Skipping
  non-conforming pages means the first legitimately non-ADR decision page is not a permanent false
  positive.
- **No exemption list.** There is no tombstone convention, no withdrawn-decision convention, and no ADR
  recorded outside `knowledge-base/decisions/`. **A superseded ADR keeps its file** — supersession
  changes an ADR's status, never its existence — so it still has a counterpart and is not an exemption.
  A vault ADR page with no counterpart is therefore genuinely anomalous. **An empty exemption list that
  never fires beats one that hides the very case this was built for.**

  *(An earlier draft asserted a specific count of superseded ADRs. It was removed rather than
  corrected: the number was not re-verified before being written, it would go stale on the next
  supersession, and nothing in the rule depends on it. State the invariant, not a census —
  `conventions/evidence-before-assertion.md`.)*

### ⛔ Flag; never auto-fix

A number/slug divergence has **two possible causes with opposite repairs**: a genuine renumbering (the
vault page is stale and should be updated to the new number) versus a vault page for a decision that was
withdrawn (the page should go). **Telling them apart needs judgment**, and this skill's convention is to
fix what is safe and surface what is not. **This is not safe.** Flag it in place with a
`> **LINT WARNING:**` blockquote and report it; do not rewrite the page, and do not renumber anything.

## Hard rules

- **`schema.md` is ground truth.** Never invent a page shape to make a page "pass".
- **Never invent knowledge** to fill a gap — flag it.
- **Write only inside `ai-agents/wiki-vault/`.** **Never commit or push.**
