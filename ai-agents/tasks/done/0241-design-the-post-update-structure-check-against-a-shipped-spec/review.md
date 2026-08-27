# Review — 0241

Task: 0241 — [brief](./brief.md)
File(s) under review: ai-agents/knowledge-base/reports/2026-08-06-design-post-update-structure-check.md; ai-agents/tasks/backlog/0241-design-the-post-update-structure-check-against-a-shipped-spec/worklog.md (document review — design quality, fidelity, internal consistency)
Status: in-review

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | low    | reports/2026-08-06-design-post-update-structure-check.md §4 "Content scope"; worklog.md §Phase A | Both say "28 files under the scaffold's `ai-agents/`"; verified count is **27** (14 content + 13 `.gitkeep`), and the report's own §4 enumeration (1+1+8+1+3+13) sums to 27. One-word arithmetic slip; the trigger-2 seven-file evidence is unaffected. (Raised by verify unit + both reviewers.) |
| R2 | 1     | medium | reports/…§7 "The consent model — propose-then-apply" | Apply step lacks an apply-time freshness re-check: nothing requires re-hashing a file immediately before replacement and refusing if it changed after propose/consent; §9's dry-run/apply parity test checks set equality only. A file edited between consent and apply would be silently overwritten. One-sentence design amendment closes it. (Codex.) |
| R3 | 1     | medium | reports/…§5 candidate 2 + §10 Q4 | The intent-file suppression ("I know; stop telling me") has no defined scope — global vs per-path vs per-mismatch. Unscoped, it would also mute mismatches introduced by *future* fkit versions, defeating the awareness layer the owner is asked to approve in Q4; the doc argues the intent file "threads the needle" without stating what it suppresses. (Codex.) |
| R4 | 1     | low    | reports/…§5 recommendation + §10 Q4 | Categorical "**No per-project state anywhere** in the recommended design" contradicts the recommended tracked intent file, which *is* per-project state (intent, not progress — the doc's own distinction). Should read "no per-project progress/cursor state; the only state is the tracked intent file". Precision matters here because Q4 turns on exactly this distinction. (Codex.) |
| R5 | 1     | low    | reports/…§7 "Manifest home" + §11 unit 3 | "Generated from fkit's git history at release" under-specifies the generator: the scaffold has had **three historical homes** (ADR-015 Context §2 names them), so completeness requires path-rename-aware history walking; "at release" boundaries sit oddly on a sha-keyed distribution installable at arbitrary `FKIT_REF`. Implementation-level, but unit 3's brief will need it. (Codex; partially correct — every-shipped-blob *is* enumerable from git history, so "cannot guarantee" overstated.) |
| R6 | 1     | low    | reports/…§8 "owner-side body" | Classification/repair outcome for **absent or malformed markers** is unstated in §8 (only a §9 test fixture). `merge_rules` refuses malformed pairs because the region is unknowable; the checker/repair should state the same refusal (or the classification: markers deleted ⇒ owner-edited). §2's blanket safety-bar inheritance covers it generically, but §8 promises elision mechanics without this branch. (Codex; partially correct.) |
| R7 | 1     | low    | reports/…§4 "Sha-tracking comes free" | Overstates `.version` reliability: `install.sh` downloads the `$REF` tarball and resolves the sha in a **separate** request (ref can advance between them; fallback writes `sha=unknown`), and a source-checkout self-host has no `.version` at all. The load-bearing property — wholesale share refresh keeps spec co-located with installed content — holds regardless; only the "identifies which sha" claim needs softening. (Codex; partially correct.) |
| R8 | 1     | low    | reports/…§8 + §9 "Testing strategy" | Byte-exact body hashing has no stated CRLF contract (normalize before hashing vs ship per-variant hashes); an untouched CRLF-converted file would classify as owner-edited. §9 names CRLF fixtures but the design doesn't say which behavior the fixture asserts. (Codex; partially correct — implementation-level.) |

## Coder response

*(Round 1 processed by a spawned fkit-coder under the sprint-ship-loop's declared approval; fixes
applied per the driver's routing ruling — every verified doc-level fix, small and localized, none
touching the design's recommendations or resolving an owner question. All eight findings verified
against the sources: scaffold re-counted by `find` (27), `install.sh`/`fkit-claude.sh`/init re-read
at the cited seams, ADR-015 Context §2/§4 re-read.)*

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (arithmetic slip) | Fixed 28→27 in report §4 and worklog Phase A (correction noted inline). The §4 enumeration already summed to 27; trigger-2 evidence unaffected. | ✅ done |
| R2 | CORRECT | Defect (design gap) | §7 step 4 now requires an **apply-time freshness re-check** — re-hash immediately before each replacement; mismatch → refuse and report, never apply. §9's dry-run/apply parity test extended to assert it (fixture: edit between consent and apply → item refused). | ✅ done |
| R3 | CORRECT | Defect (underspecification) | Suppression scope defined in §5 candidate 2: **per-path** — entry names one path, "divergence here is deliberate." Global switch and per-mismatch keying both rejected with reasons (mutes future-version mismatches everywhere / records a position, cursor-shaped). Future-version-on-suppressed-path consequence owned openly. Q4 cross-references the scope statement. Recommendation unchanged (notice + suppression); Q4 still the owner's. | ✅ done |
| R4 | CORRECT | Defect (self-contradiction) | §5 recommendation and Q4 reworded: "no per-project **progress or cursor** state; the only per-project state is the tracked intent file — intent, not progress." The categorical "no per-project state anywhere" is gone. | ✅ done |
| R5 | PARTIALLY CORRECT | Defect (under-specification; reviewer's own caveat stands — every shipped blob **is** enumerable, so "cannot guarantee" was overstated) | §7 "Manifest home" now specifies the generator: rename-aware walk across the three historical homes ADR-015 Context §2 names; regenerated per shipped-share build, not at semver releases (sha-keyed distribution, arbitrary ref). §11 unit 3 row carries the same spec for the implementation brief. Deeper generator detail deliberately carried into unit 3. | ✅ done |
| R6 | PARTIALLY CORRECT | Defect (missing stated branch; §2's blanket safety-bar inheritance did cover it generically) | §8 now states the branch: malformed marker set → elision region unknowable → **refuse to classify**, mirroring `merge_rules`' refusal contract (quoted); markers absent → nothing elided → classifies **owner-edited**. Both report-only, never repaired. §9 fixture unchanged (already present). | ✅ done |
| R7 | PARTIALLY CORRECT | Defect (overstatement; load-bearing co-location property holds, as the reviewer notes) | §4 "Sha-tracking comes free" softened: `.version`'s `sha=` is a best-effort **label** — separate request from the tarball fetch (ref can advance between), `sha=unknown` fallback, self-host has no `.version` (all verified in `install.sh` / `fkit-claude.sh`). Load-bearing property restated as wholesale-refresh co-location, which holds in every case. | ✅ done |
| R8 | PARTIALLY CORRECT | Defect (unstated contract; implementation-level as the reviewer says, but the design must pick the behavior the fixture asserts) | §7 hashing contract now states: **normalize CRLF → LF on both sides** (manifest generation and on-disk hashing) — otherwise an autocrlf checkout misclassifies untouched files as owner-edited, init's own documented Windows failure class. §9's CRLF fixture line names the asserted classification (ending-only variant → untouched-stale). §11 unit 3 carries "CRLF-normalized". | ✅ done |

## Accepted residuals (shared, do-not-re-litigate)

*(none yet)*
