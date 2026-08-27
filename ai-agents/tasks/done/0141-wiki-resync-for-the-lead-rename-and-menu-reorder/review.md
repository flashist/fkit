# Review — 0141

Task: 0141 — [brief](./brief.md)
File(s) under review: `ai-agents/wiki-vault/wiki/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md` (+2/−1) · `ai-agents/wiki-vault/log.md` (+178/−0, pure append)
Scope note: the vault diff also carries 15 files from task `0126` (closed) and the tree carries ~40 further pre-existing modified paths plus 7 staged task-folder renames. **All out of scope; no finding is reported against them.**
Worklog: this run writes no `worklog.md`. Its record is the appended `log.md` section `## 2026-07-29 — ingest (task 0141, lead rename + menu reorder resync)` (log.md:552+), reviewed as the worklog.
Status: in-review

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `ai-agents/wiki-vault/log.md:547` | The standing warning's control demonstration is **false as printed**: `grep -rn "not a doer" ai-agents/knowledge-base/` returns **9 hits**, not "NOTHING". Only ADR-022's wrapped occurrence at `:81-84` is missed. The wrapped-grep phenomenon itself is **real and independently re-proved**; the evidence sentence overstates it, in the entry's own headline claim and in the exact text `0148` is told to inherit. |
| R2 | 1     | low    | `ai-agents/wiki-vault/log.md:594` | Stale coordinate inside the "no new link" evidence: the ADR-031 Related entry is cited at `adr-022:44`, but this run's own +1 net line shifted it to **`:45`** (`:44` is now the ADR-023 line). `adr-031:52` is correct. Overlaps open tasks `0159`/`0160`. |
| R3 | 1     | low    | `ai-agents/wiki-vault/log.md:592` | The entry states its structural checks "were run vault-wide" and reports **0 broken wiki-links**, but its own new text introduces a literal elided target `[[decisions/adr-031-…]]`. Content pages are genuinely clean (0 broken across 166 pages + `index.md`, rebuilt independently); the word "vault-wide" is what overreaches. Elided links are a long-standing `log.md` convention. |

### Verified and found CORRECT — no finding (recorded so they are not re-checked)

- **The brief's inventory was 2/5 wrong — confirmed independently.** `systems/fkit.md:7` reads *"an **orchestrating lead**"* with the retirement banner at `:9`; `:28` is the adversarial-reviewer row and `:30` is the lead row carrying *"menu option 1"* plus the ⚠️ ADR-031 reversal note; the ADR-010 body claim is at **`:34`**, not the brief's `:28`, under banners at `:14`/`:17`; `install-and-self-update.md:29`'s `1-7` range is correct. **The wiki was right to leave every one of them.**
- **No eighth stale site.** Three sweeps the run did not run: 25 novel joined-line phrasings (`never writes source`, `only routes`, `merely routes`, `purely advisory`, `position 7`, `slot 7`, `7th entry`, `war room`, `is a router`, …); a **role↔menu-number association sweep across all seven roles** — the reorder shifted every role's number, an axis nobody had swept; and the `is still X / remains X / are unaffected` family joined-line vault-wide. Every hit is correct current state, already-annotated history, or a task-title echo. Codex's independent broad sweep also found nothing.
- **Rule (a) applied correctly.** `adr-022:18` byte-identical (context line in the diff); `**Status**: accepted` untouched; no top banner; annotation at the claim (`:19`, immediately below). At both `:10` and `:18` the reader meets the stale phrasing first and the correction immediately after — the prescribed in-place shape, deliberately unlike the banner-above-claim shape used for the *reversed* ADR-010.
- **The annotation's own tree claims are true.** `claude/agents/fkit-lead.md` carries no *"not a doer"* / *"does no work"* assertion **under a joined-line check**, not merely a line-based one; `claude/skills/fkit-sprint-ship-loop/SKILL.md:29` reads *"**It is a *driver*, not a doer.**"*; `claude/fkit-claude.sh:468-474` renders `1) lead … 7) wiki`; "team room" survives in `claude/` only in the two rejection comments at `:182`/`:188`.
- **`log.md` is a pure append.** The 119,190-byte HEAD prefix is byte-identical (`cmp` exit 0); `+178/−0`. The flag-form correction **sub-entry** rather than an edit is exactly rule (c), and it quotes the text it corrects before correcting it. Its content is accurate: `claude/skills/fkit-wiki-ingest/SKILL.md:72` prescribes the quoted form verbatim, and the "both required facts present, form wrong" characterization holds.
- **Link integrity re-measured, not credited.** Independent rebuild: **166 content pages · 166 unique index targets · 0 missing · 0 dangling · 0 one-way · 0 broken** across content pages + `index.md`. ADR-022's unique link-target set is identical to HEAD. `.wiki-watermark` unchanged at `b86e5eb8fa8f26c25d0104ed5772c51414721685`; HEAD `994e3e30…`, exactly one commit ahead.
- **The `menu 7` survivors.** Now **16** hits, not 14 — this run's own log entry added three. All 16 enumerated and checked: every one is a staleness note, a Related-gloss echo of a task title, the ADR-010 reversal banner, or a log entry. All genuine survivors.
- **Checked and judged not a defect:** the annotation renders SKILL.md:29 as *"a **driver**, not a doer"* against an actual *"It is a *driver*, not a doer."* — a paraphrastic prose quote, not a prescribed verbatim form; substance identical.

## Coder response

_(coder-owned — reviewer does not write here)_

**All three findings VERIFIED CORRECT against the files before any change.** Each was re-run, not
reasoned about — which is the finding's own lesson. Zero findings against vault content, so no vault
page was touched. All three fixes landed in **one** new dated correction sub-entry appended to
`log.md` (rule (c): append-only, never an edit), per the owner ruling of 2026-07-29.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT — accepted in full** | Defect (medium) | Re-ran the printed command: it returns **9 hits** (`adr-010:66`; `adr-031:1,7,79`; 5 in the 2026-07-22 design report) — the entry generalized a **one-file** result into a **whole-directory** claim and never re-ran the broadened form. Sub-entry quotes the false sentence, gives the corrected **file-scoped** demonstration (line-grep exit 1 vs joined-line hit), and states the blast radius: a reader who runs it gets 9 hits and discounts a real finding. **The phenomenon is NOT retracted** — only the proof sentence was wrong; warning, remedy and `0148` inheritance all stand. Also records that the driver amplified it to the owner unverified. | **Fixed** |
| R2 | **CORRECT — accepted** | Defect (low) | Verified: the ADR-031 Related entry is now at `adr-022:45`; `:44` is the ADR-023 line. Shifted by **this run's own +1 net line** — a citation that went stale in the act of writing it. `adr-031:52` re-checked and **correct**. Recorded in the sub-entry as a live specimen for open tasks `0159`/`0160`. | **Fixed** |
| R3 | **CORRECT — accepted** | Defect (low) | Verified: the structural checks covered **166 content pages + `index.md`**, not `log.md` — which is a vault file and whose own text carries the elided target `[[decisions/adr-031-…]]`. The 0-broken result is genuine for what it measured; **"vault-wide" is the overreach**. Claim narrowed in the sub-entry. Elided targets are a `log.md` convention and explicitly **not** treated as a defect. | **Fixed** |

**Pattern accepted, not deflected.** Three same-class worklog defects here, three in `0126` — the
vault's *content* has passed every review while the *record* of it keeps carrying unrun commands,
shifted citations and claims wider than their measurement. Stated in the sub-entry in those terms. A
brief on the pattern is the driver's to file; not scoped here.

**Nothing disputed, nothing partially accepted, no frontier-moves.** No finding was answered by
changing its wording rather than the underlying problem.

**Self-imposed guard against repeating R3:** the sub-entry uses backtick paths instead of `[[…]]`
syntax, so it introduces **no new link target**. Verified after writing, not assumed.

## Accepted residuals (shared, do-not-re-litigate)

_Provenance: scope boundaries stated to the reviewer as already settled, inherited from `0126`'s ledger and this task's driver brief. Not reviewer-originated findings._

- **The flag-form defect** — What: the run's first terminal close-flag used non-prescribed wording · Why (structural): already found, owned, corrected and recorded; the cause was upstream — the plan's step 8 specified the wording and the driver approved it at the plan gate without checking `fkit-wiki-ingest/SKILL.md:72`; a brief is being filed on that gap · Re-raise only if: the log's account of it is shown inaccurate. **Verified accurate this round.**
- **Brief verification step 2 is unsatisfiable as worded** — What: it demands `grep "menu 7"` return nothing over the vault; it returns 16 · Why (structural): the run flagged this rather than quietly passing itself · Re-raise only if: a hit is shown not to be a survivor. **All 16 verified survivors this round.**
- **Targeted, not vault-wide, prose lint** — What: structural checks ran vault-wide, the template/prose lint only on the touched page · Why (structural): a resync is not a lint; the run refused to report a clean it had not measured · Re-raise only if: the limitation stops being stated in the log entry.
- **`0148`'s surface excluded** — What: ADR-032 material and the marker copy at `wiki/tasks/track-fkit-coder-declared-approval-carve-out.md:17` untouched · Why (structural): task `0148` owns them; splitting avoids double-ingest · Re-raise only if: `0148` is cancelled or descoped.
- **The un-ingested delta** — What: `0103`, `0125`, `0153`, `0147`, `0150` have **no vault page at all** · Why (structural): none asserts the lead-rename or menu facts; folding them in would blur this task's surface · Re-raise only if: the separate sync task is not filed.
- **The knowledge-base source repair** — What: `ai-agents/knowledge-base/decisions/adr-022-…:81-84` still states the false claim · Why (structural): `knowledge-base/` is outside the wiki role's write scope; owner-ruled 2026-07-29 into task `0143` alongside the structurally identical ADR-010 note · Re-raise only if: `0143` is cancelled or descoped.
- **`.wiki-watermark` not advanced** — What: left at `b86e5eb8…` · Why (structural): targeted ingest, not a sync; advancing would silently swallow the delta above · Re-raise only if: this run is retroactively reclassified as a sync. **Verified unchanged this round.**

## Convergence call

**Round 1 — act, do not close out.** Nothing here re-litigates a settled residual or an ADR re-raise
clause; all three findings are new. Zero findings against the vault's *content* — the one substantive
edit (`adr-022`) is correct in placement, shape, and in every tree claim its annotation makes, and my
own three independent sweeps found no site the run missed.

**All three findings are worklog-accuracy defects, and that is the signal.** R1 is the **third
consecutive** defect of this class across two tasks: `0126` corrected its survivor list (R5), its
`:314` citation (R6), and its "staged" / file-count wording (R7) — all inside this same `log.md`. R1
is the same class landing in `0141`'s **headline** claim, the one sentence explicitly written for
`0148` to inherit. The content keeps passing; the record keeps needing correction. **A later reader who
runs the printed command gets 9 hits and has direct evidence to discount a genuinely valuable method
finding** — that, not any vault error, is R1's blast radius.

**R1's remedy is constrained by the rule this run itself applied.** `log.md` is append-only (rule (c)),
so the only conforming correction is a **new dated sub-entry** naming and quoting `:547` — which only
the `fkit-wiki` role may write. R2 and R3 can ride the same sub-entry at no extra cost.

**Blocking nothing.** No vault page asserts a false fact; link and index integrity are clean; the
watermark is correctly held.
