---
name: fkit-heal
description: >-
  The producer's structure-conformance check and consent-gated repair — run the deterministic
  checker over the install share's structure-spec and hash manifest, present its per-file verdicts
  verbatim, then, owner present, propose replacements for untouched-stale fkit-authored files with
  diffs in view, collect explicit approval of the exact enumerated list via AskUserQuestion, and
  apply exactly what was approved behind an apply-time freshness re-check. Consent is never stored;
  nothing is ever moved, renamed, or deleted; owner-edited files are report-only with diffs; and it
  never writes ai-agents/wiki-vault/ (ADR-005 routes those repairs to fkit-wiki).
---

# Heal — the structure check and its consent-gated repair

> ## ⛔ Owner: the **producer**
> This is the fkit-producer's own procedure. Execute it **only** if you are the producer — running
> as the `fkit-producer` agent or in a `fkit producer` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-producer Run /fkit-heal and report the structure's conformance.
> ```

Report how the project's working structure compares to what the installed fkit version requires —
the structure-spec (`claude/structure-spec.md`, task 0243) decides *what should exist and what each
path means*; the hash manifest (`claude/structure-manifest.tsv`, task 0244) decides
*touched-or-not*. Then, **only in a live session with the owner present**, offer the consent-gated
repair of `untouched-stale` files (task 0246). Capability licensed by ADR-039; implementation units
4 and 5 of the 0241 design.

**⚠️ The check phase is read-only; the repair phase mutates nothing without explicit consent.**
`check.sh` repairs nothing in any branch. `repair.sh propose` computes and shows what *would*
change — still writing nothing. Only `repair.sh apply`, fed **exactly the item lines the owner
approved**, writes — and each write sits behind an apply-time freshness re-check. v1 scope
(ADR-039, binding): **replacement of untouched-stale fkit-authored files only — no move, no
rename, no delete**; owner-edited files are report-only with diffs, touched never. No task-file
moves, no commits, no re-ranks.

## Procedure — the check

1. **Resolve the project root** — the directory the session is working in (its `ai-agents/` and
   root `CLAUDE.md`/`AGENTS.md` are the check targets).

2. **Run the checker** — the verdicts are byte-mechanics (hashing, marker counting, manifest
   lookup), so the script computes them, never you (ADR-017):

   ```
   bash .claude/skills/fkit-heal/check.sh
   ```

   (In this repo's own checkout: `bash claude/skills/fkit-heal/check.sh`. Pass `--share <dir>` only
   to override share auto-resolution — normally unnecessary.) Exit codes: `0` fully conforming,
   `1` nonconformities or refusals found, `2` could not run (that is *cannot-run*, not
   *nonconforming* — relay the stderr message and stop).

3. **Present the report verbatim.** Every row and the summary line, exactly as printed — **never
   recompute, soften, or re-derive a verdict**, and never drop a refusal line. The row outcomes:

   | Outcome | Meaning | What may follow (never silently) |
   |---|---|---|
   | `conforming` | matches the installed version (or the class checks existence only) | nothing |
   | `missing` | required path absent | creation is launch convergence's job — report, never create |
   | `untouched-stale` | matches an older shipped version, never edited by the owner | repair-eligible via this skill's repair phase (consent-gated, below) |
   | `owner-edited` | matches no version fkit ever shipped | report with diff, **never touch** |
   | `wrong-type` | exists but is the wrong filesystem type | report-only |
   | `wiki-routed` | a wiki-vault nonconformity | repair is `fkit-wiki`'s exclusively (ADR-005) |
   | `refused: symlink` / `refused: malformed-markers` / `unreadable` | the safety bar refused to classify | say so loudly; never guess past a refusal |
   | `kept-out` | listed in `ai-agents/.fkit-keep-out` | deliberate intent — not a nonconformity |

4. **For each `owner-edited` file, show the diff** against the share's scaffold copy:

   ```
   diff "$share/claude/scaffold/<path>" "<project>/<path>"
   ```

   where `$share` is the share the checker resolved (it is the project root itself in a
   source-checkout self-host, else `${XDG_DATA_HOME:-$HOME/.local/share}/fkit`). For `CLAUDE.md` /
   `AGENTS.md`, note that the fkit-managed rules block appears in a plain diff **and is not
   drift** — it is rewritten on every launch and sits outside the hashed region.

5. **For `wiki-routed` lines, state the routing and stop there:** any repair under
   `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusively (ADR-005) — a consult, or an owner-directed
   `/fkit-wiki-ingest`. **Never touch the vault yourself**, whatever the report says it should
   contain.

6. **State the known limits with the report:**
   - a **renamed** directory reports its spec path as `missing` — the check cannot see the renamed
     twin (ADR-015's rename consequence; the report carries this note itself);
   - an unreadable/symlinked/directory `ai-agents/.fkit-keep-out` **fails closed**: the whole
     `ai-agents/` subtree check is refused loudly (no per-row lines for it), the root context files
     are still checked — mirror that honestly rather than presenting a partial report as full
     coverage. **The same honesty carries into repair:** on that fail-closed path the `ai-agents/`
     rows were never checked, so only the root context files can appear in a proposal — say so.

## Procedure — the repair (consent-gated, ADR-039 v1)

1. **Live session required.** These steps run **only with the owner present** — a `fkit producer`
   session, or spawned under the sprint-loop relay pattern with every decision surfaced to the
   owner live. In a headless or background invocation, **stop after the check report**: repair
   without a present owner is exactly what ADR-015/ADR-039 forbid.

2. **Nothing eligible → say so and stop.** If the report has no `untouched-stale` rows, state
   "nothing repair-eligible" and end. **Never manufacture a consent question.**

3. **Propose — nothing applied yet:**

   ```
   bash .claude/skills/fkit-heal/repair.sh propose
   ```

   Present the proposal **in full and verbatim**: the enumerated per-file `item` lines, every
   `# diff` block, and every `# excluded:` line. Announcing a change **never** substitutes for
   consent on this path — the proposal is the thing the owner approves, so they must see all of it.

4. **One `AskUserQuestion` — plan-level approval of that exact enumerated list** (ADR-039
   Decision 2), asked with the diffs in view. Offer: approve the full list / approve a named subset
   / not now. No destructive item can exist in v1 — nothing here moves, renames, or deletes; if one
   somehow appeared it would be a bug to report, not something to confirm individually.

5. **Apply exactly what was approved** — pipe the approved `item` lines, **verbatim and nothing
   else** (the full list, or only the owner's named subset), to:

   ```
   ... | bash .claude/skills/fkit-heal/repair.sh apply
   ```

   Each item is re-verified at apply time: still classifying `untouched-stale`, on-disk bytes still
   exactly what the proposal showed (else `refused: changed-since-propose` — the consent given was
   to a diff that no longer exists), replacement still exactly what was approved. **Present the
   per-path apply output verbatim — refusals and errors loudest.** Exit `0` all applied, `1` any
   refusal or error, `2` could not run.

6. **Consent is never stored.** No file, no config, no env var, nothing that survives the run —
   the approved item lines live only in this session's transcript. There is no "always allow", no
   remembered approval, no progress state (ADR-039's re-raise fences).

7. **Wiki-routed lines stay routed** (check step 5): `repair.sh` refuses any
   `ai-agents/wiki-vault/` path outright — whatever the spec says the vault should contain, its
   repair belongs to `fkit-wiki` (ADR-005), never to this skill.

## The launch-time notice and `ai-agents/.fkit-accepted-drift` (task 0247)

Every `fkit` launch runs this same checker once (the share's copy; its stderr discarded) and prints
**at most one stderr line** when any path classifies in the exit-1 set — awareness only: never a
repair, never a prompt, nothing on stdout, no state recorded anywhere. A conforming project stays
completely silent. The notice points here; this skill's check remains the only diagnostic and
`repair.sh` the only (consent-gated) writer.

**Suppression — the intent file `ai-agents/.fkit-accepted-drift`** (tracked; a *sibling* of
`.fkit-keep-out`, never entries in it — keep-out means "never create this path", drift-acceptance
means "divergence here is deliberate"): one **project-root-relative** path per line (`CLAUDE.md`,
`ai-agents/README.md`); `#` comments and blank lines allowed; an entry covers the path **and
everything beneath it**; literal matching, never globbed.

- **Owned consequence:** a suppressed path stays notice-silent even when a future fkit version
  changes what ships there — consistent with the recorded intent ("this path is mine now");
  reversible by deleting the entry. No global switch and no per-mismatch keying exist, by ruling.
- **Failure direction, inverted from keep-out deliberately:** an intent file that is a
  symlink / directory / unreadable is **ignored — nothing suppressed**, the notice prints. Keep-out
  gates a write (fail closed = don't write); this gates silence (fail closed = don't silence — the
  worst case is one extra stderr line, never hidden drift).
- **Suppression applies to the launch notice only. This on-demand check never suppresses:** the
  report above lists suppressed paths in full, exactly like any other row — hiding rows from an
  explicit request would be suppressing evidence.
