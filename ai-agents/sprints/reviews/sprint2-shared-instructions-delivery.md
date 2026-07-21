# Review — sprint2-shared-instructions-delivery

Task: [`tasks/backlog/give-codex-the-universal-hard-rules.md`](../../tasks/done/0047-give-codex-the-universal-hard-rules/brief.md) (30) ·
[`tasks/backlog/merge-fkit-rules-block-into-existing-root-context-files.md`](../../tasks/done/0061-merge-fkit-rules-block-into-existing-root-context-files/brief.md) (31) ·
[`tasks/backlog/add-no-secrets-rule-to-fkit-lead.md`](../../tasks/done/0007-add-no-secrets-rule-to-fkit-lead/brief.md) (32)
File(s) under review: `claude/fkit-claude-init.sh`, `claude/scaffold/universal-rules.md` (new),
`claude/scaffold/CLAUDE.md`, `claude/scaffold/AGENTS.md`, `claude/agents/fkit-lead.md`,
and this repo's own `/CLAUDE.md` + `/AGENTS.md` (dogfooding, required by brief 31).
Scope: working tree. **Out of scope — not reviewed:** ADR-016, `reports/2026-07-14-shared-instructions-layer.md`,
the three task briefs, `ai-agents/sprints/sprint-2.md` (other roles authored these).
Reviewers: fkit-reviewer (own pass, empirical) + Codex via `codex exec` — **both ran, all three rounds.
Coverage is complete.**
Status: **CLOSED** (round 3 + owner dispositions) — all 13 findings dispositioned.
⚠️ **Closed with one owner-authorized action still PENDING EXECUTION — see R7 below.**

---

## ✅ CLOSED — final verdict

> **✅ CLOSED. All 13 findings dispositioned: R1–R6, R8–R10, R12 fixed (each independently re-run,
> none taken on trust) · R7 owner-approved · A1 + A2 accepted as residuals · R13 won't-fix.
> Coverage complete (both reviewers, all three rounds). No round 4 — converged.
> ⚠️ One thing is approved but NOT YET DONE: `universal-rules.md` is still untracked (`??`) as of this
> closeout. The gate closes on the `git add`, not on the approval. Do not cut a release until it is
> tracked.**

### Owner dispositions (recorded — this is the ruling, not a recommendation)

| # | Finding | Owner's ruling | Recorded as |
|---|---------|----------------|-------------|
| **R7** | `universal-rules.md` untracked → bricks every launch | **APPROVED — commit the file.** | **Resolved by owner (authorized).** ⚠️ **Verified at closeout: still `?? claude/scaffold/universal-rules.md` — the `git add` has not landed yet.** Authorization ≠ execution. See the standing gate below. |
| **A1** | Markers inside a code fence are overwritten — **loudly**, on stderr | **ACCEPTED as a residual.** | **Accepted residual.** My blocking condition (R8 fixed → the warning is credible again) is **met and verified in both directions**. Promoted from *conditionally recommended* → **accepted**. |
| **A2** | The `fkit-managed:` tag is a heuristic, not a boundary — the spoof path replaces **silently** | **ACCEPTED as a residual, with the carve-out intact.** | **Accepted residual + carve-out.** A2 is the one path where A1's *"loud, not silent"* bargain does **not** hold. Recorded as a **known silent path**, explicitly *not* folded into A1. |
| **R13** | `$$` temp path is predictable / not exclusive; `>` follows symlinks | **WON'T FIX** — threat model does not hold. | **Rejected (won't fix), with rationale.** The path is `<project-root>/CLAUDE.md.fkit-tmp.<pid>` — the **owner's own project root**, not a world-writable `/tmp`. Anyone able to plant that symlink can already edit `CLAUDE.md` directly, so the attack buys them **nothing they do not already have**. This is the `/tmp` symlink-race pattern applied where its premise (world-writable, multi-user) is **absent**. **Recorded so a future reviewer finds the ruling instead of re-reporting the mechanism — do not re-raise the bare mechanism.** |
| **ADR-016 overclaim** | `adr-016:214` *"Codex finally gets a floor"* contradicts the ADR's own *Consequences* (*"no floor, no teeth"*) — same in the report at `:307` | **ROUTED TO THE ARCHITECT — approved.** | **Raised → routed → dispositioned.** Out of scope for this diff (the coder's added lines are **clean**: zero enforcement-language hits — see *F — Overclaim check*). The architect is amending ADR-016 + the report **in place; decision unchanged**. Recorded here so a finding that survived two rounds is not lost merely because it belonged to another role's file. |

### R12 — re-verified at closeout, and NOT taken on the coder's word

The coder reports R12 fixed. **I re-ran it rather than accepting the claim — and that is not a formality:
the previous round's "I replaced both pipes" claim was made in good faith and was false.** This one holds.

- `claude/fkit-claude-init.sh:175-178` — the pipe is **gone**, replaced by exactly the suggested construct:
  `case "$region" in *"$RULES_TAG"*) has_tag=1 ;; *) has_tag=0 ;; esac`.
- **No pipe → no EPIPE → `pipefail` can no longer invert the tag check** into a false *"fkit did not
  write it"*, and no raw `printf: write error: Broken pipe` leaks to the owner's stderr (the R4 class).
- `grep -nE '\|\s*(grep -q|head -1)'` → **no surviving pipes into an early-exiting consumer.** The two
  remaining textual hits (`:134`, `:172`) are the **comments explaining why the pipes were removed** —
  the fix documents its own reasoning at both former sites.
- `bash -n` clean.

**R12 is FIXED, not a residual.** The coder's regression run (7/7: foreign region still warns · brownfield
idempotent · CRLF 1 block · R1 prose repro safe · this repo idempotent, one block per root file) is
consistent with everything I certified in rounds 1–3. **R10 is now closed at both sites** — site (a) in
round 3, site (b) here.

### ⛔ The one thing that is approved but not yet true

**`claude/scaffold/universal-rules.md` is STILL UNTRACKED at the moment of closeout** — verified, not
assumed: `git status --porcelain` → `?? claude/scaffold/universal-rules.md`.

The owner has **authorized** the commit, so R7 is no longer an *open question* — it is a **pending
action**. But I will not record a release gate as closed on an intention:

- `install.sh` ships `claude/` from a **git tarball**. An untracked file is **not in the tarball**.
- `claude/fkit-claude-init.sh:80` hard-`exit 1`s when the file is absent → **every `fkit` launch fails,
  for every user, immediately.**
- `install.sh`'s fetch sanity-gate checks only `fkit-claude.sh`. **It will not catch this.**

**Standing gate — the last line of this review:** `git ls-files --error-unmatch
claude/scaffold/universal-rules.md` must **succeed** before a release is cut. That is a `git add`, and it
is the owner's to make (I do not commit, and neither does the coder unprompted). Everything else in this
change is done.

---

## Round 3 — decision verdict

> **✅ Ready to merge — 0 open defects in the code. R8 and R9 are dead, verified.
> ⛔ But the change is RELEASE-GATED on R7: `claude/scaffold/universal-rules.md` is STILL UNTRACKED,
> and shipping without it hard-`exit 1`s every `fkit` launch for every user. That is an owner action.**

**R8, R9, R10(a): fixed, and I re-ran every one rather than taking the coder's word.**

- **R8 — dead.** A brand-new project now launches **completely silent**: 0 warnings, 1 block per root
  file, rules delivered. And the guard is **precise, not a blanket mute** — I specifically checked that
  it did not buy the silence by disabling the alarm: a **fenced foreign region still warns** (2/2 files),
  and so does a **one-line foreign region** (`le == lb + 2`, the exact boundary the new guard sits on).
  The owner's deliberate **bare-marker opt-in** is silent, as designed. The warning now fires when and
  only when it should. **This is what A1 was waiting on.**
- **R9 — dead, and its real point holds.** Exactly **1 block after 4 CRLF cycles** (was 5, unbounded).
  More important than the count: I verified the thing R9 actually exists to protect — **fkit can once
  again ship a rules correction into a CRLF file** (appended a 5th rule → it landed, still 1 block,
  owner prose intact). Brief 31's original bug stays fixed for Windows users.
- **R10(a) — dead.** 3000 begin markers → **rc=0**, clean refusal on stderr, file byte-identical, 7
  agents installed. The `pipefail`/SIGPIPE abort on the refuse-gracefully path is gone.

**Zero regressions.** All 10 round-1/2 guarantees re-run and hold: R1 prose repro (owner's sentence
survives) · brownfield idempotent ×3 with prose above *and* below · all 3 malformed-marker refusals
(rc=0, byte-identical, stderr, 7 agents) · symlink guard (target untouched, link intact, no
write-through) · R6 no-trailing-newline · **0 temp litter across every fixture** · `bash -n` clean.

**What round 3 found is one incompletely-closed low finding and one low hardening nit — nothing new,
nothing blocking.** Per the round-2 convergence rule I set myself (*"if round 3 produces findings that
are again only in the newest fix, stop and ship"*), **I am calling it: stop and ship.** R12 and R13 below
are recorded so they are not lost, **not** as a reason to open a round 4.

---

## Round 3 — verification of the coder's fixes (all re-run; none taken on trust)

| # | Coder's claim | Verdict | Evidence |
|---|---|---|---|
| **R8** | guard the range — probe only when `le > lb + 1` | ✅ **FIXED** | `:170`. Fresh project → **0 warnings**, 1 block/file, rules delivered, 0 litter. **Did not over-suppress** (I checked, because a guard that mutes the alarm would "fix" R8 by breaking A1): fenced foreign region → **still warns** (2/2 files); **one-line** foreign region (`le == lb+2`, the guard's boundary) → **still warns**; bare-marker opt-in → correctly silent. |
| **R9** | `\r` added to the `marker_lines` trim set | ✅ **FIXED** | `:114`. **1 block after 4 CRLF cycles** (was 5, unbounded). Owner prose intact. **And the real test:** a rules correction (a 5th rule) **reaches** a CRLF-converted file — still 1 block. Brief 31's bug stays fixed on Windows. |
| **R10(a)** | `set -- $(marker_lines …)`, no pipe → no SIGPIPE | ✅ **FIXED** | `:139-141`. **3000 begin markers → rc=0**, refusal on stderr, file byte-identical, **7 agents installed**. `set --` is safe here: `$f`/`$name` are captured at `:118` first. |
| **R10(b)** | *(claimed closed: "replaced **both** pipes")* | ❌ **NOT FIXED — see R12** | R10 had **two sites**, and "both pipes" ≠ "both sites": the two `head -1` pipes were site (a). Site (b) — the region/tag pipeline — **survives at `:173`**. |
| **R11** | header-change self-heals; tag-spoof left as-is | ✅ **AGREED** | Confirmed in round 2. Tag-spoof recommended as a residual (A2 below) — **owner's call, not the coder's and not mine.** |
| **R7** | "not mine to close" | ❌ **STILL OPEN — OWNER ACTION** | Re-verified this round: `git ls-files --error-unmatch claude/scaffold/universal-rules.md` → **fails. Still untracked.** |

## Round 3 — new findings

> **Final status (recorded at closeout): R12 → ✅ FIXED** (`:175-178`, re-verified — the pipe is gone).
> **R13 → ❌ WON'T FIX** (owner ruling; threat model does not hold — see residuals). Neither is open.

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R12 | 3 | low | `claude/fkit-claude-init.sh:173` | **R10 site (b) is still live — the coder closed the two `head -1` pipes and read that as "both pipes", but R10 had two *sites*.** The region/tag check is still a pipe into an early-exiting consumer: `! printf '%s' "$region" \| grep -qF "$RULES_TAG"`. `grep -q` exits on first match; bash's **builtin** `printf` then takes **EPIPE**, prints a raw `printf: write error: Broken pipe`, and returns non-zero → `pipefail` → `!` inverts → **the "fkit did not write it" warning fires even though the tag IS present.** The `sed` moved into a command substitution, which killed the *sed* SIGPIPE — but the pipe itself remained and `printf` inherited the bug. **Reproduced end-to-end through the real script, deterministically: 5/5 runs, 2 broken-pipe leaks + 2 spurious warnings each.** (In an isolated subshell it never fires — 0/12 — so this is *only* visible by driving the actual script; a unit-style check would certify it clean.) **Why it is nonetheless LOW and NOT blocking:** it needs an **owner-authored region >64 KB (the pipe buffer) containing `fkit-managed:`**. fkit's own emitted block is **718 B** under a **4096 B** hard cap, so **it is unreachable from anything fkit writes.** And in the one scenario that *does* reach it, the region genuinely **is** owner content — so the warning firing is **accidentally correct**. The real cost is the **raw internal error leaking to the owner's stderr** — precisely the class of leak R4 was raised to eliminate. **One line to close** (`case "$region" in *"$RULES_TAG"*) …` — no pipe, no subshell). |
| R13 | 3 | low | `claude/fkit-claude-init.sh:143,152,179` | **Predictable temp path — mechanically real, but the threat model does not hold.** Raised by **Codex** (as *medium*; **I downgrade it to low, and here is why**). `tmp="$f.fkit-tmp.$$"` is not created exclusively, and `> "$tmp"` **does** follow a symlink (verified: I truncated a file outside the project through a planted link). **But the path is `<project-root>/CLAUDE.md.fkit-tmp.<pid>` — inside the owner's own project root, which is not a shared trust boundary.** Anyone who can plant that symlink **already has write access to the project root** and can simply edit `CLAUDE.md`, or any source file, directly — the attack buys the attacker **nothing they don't already have**. This is the classic `/tmp` symlink-race pattern applied to a directory where its premise (world-writable, multi-user) is **absent**. The *accidental* collision is benign too: it needs stale litter that survived (**0 litter on every path**, re-verified), matched the live PID exactly, **and** was a symlink — and a stale *plain* file at that path is simply truncated and overwritten, which is the intent (verified: rc=0, 1 block). **Hardening nit, not a defect.** `mktemp` in the same directory would close it for ~free if the file is open anyway. |

---

## Round 2 — decision verdict

> **🛑 Blocked — the round-1 blocker is genuinely fixed, but the fix introduced 2 medium regressions.
> Plus R7 (release gate) is still open and remains the single highest-risk item in the change.**

**R1–R6 are all fixed, and I re-ran every one of them rather than taking the coder's word: 6/6 hold.**
The prose repro — the round-1 blocker — now leaves the owner's sentence **intact** while still delivering
the rules. The coder took option (a) over Codex's half-fix, correctly, and the fenced case is now **loud
on stderr** exactly as claimed.

**What blocks round 2 is that the R1 fix broke two things it did not need to break** — and, fittingly,
**one of them attacks the very warning that makes the fenced-case acceptance safe**:

- **R8 — every brand-new fkit project now cries wolf on its first launch.** `sed -n '3,2p'` (start > end)
  does **not** print nothing — it prints the start line. So the "is this region empty?" probe at `:159`
  **never sees an empty region**, and the scaffold's own bare marker pair trips the alarm. A greenfield
  project is told *"fkit did not write it"* about the file **fkit created four lines earlier**. The code
  does the exact opposite of what its own comment (`:152-156`) says it does.
- **R9 — CRLF now duplicates the block, without bound.** The `awk` trim strips `[ \t]` but not `\r`.

**These two compound.** R8 devalues the warning on the most common path there is; R9 silently
resurrects brief 31's original bug for every Windows user. Neither is destructive of owner content —
which is why this is *blocked*, not *high* — but R8 in particular undermines the ground on which I would
otherwise accept the fenced-code-block residual. See the residuals section.

---

## Round 2 — verification of the coder's fixes (I re-ran all 12; I did not trust them)

| # | Coder's claim | Verdict | Evidence |
|---|---|---|---|
| **R1** | exact-line `awk` matching; prose repro survives | ✅ **FIXED** | Prose fixture: owner's `PRECIOUS MIDDLE SENTENCE` **survives**, rules still delivered at EOF, idempotent ×3. Inline-quoted marker is **inert** (`marker_lines` → no hit). |
| **R2** | footgun note in the block header, stating the real rule | ✅ **FIXED** | `:86-88` states markers are recognized **only when alone on a line**, that inline quoting is safe, and that a bare marker line in a fence still reads as real. Accurate — it matches the code's actual behavior. |
| **R3** | `trap 'rm -f "$tmp"' EXIT`, cleared after `mv`/`cmp` | ✅ **FIXED** | Trap fires on a forced `set -e` abort → **0 litter**. **0 litter across 8 paths** (brownfield / greenfield / markers-only / malformed / two-pairs / unreadable / unwritable / no-trailing-newline). **No clobber between the two `merge_rules` calls**: `$tmp` is global, but all three exits (`:171`, `:176`, `:180`) clear the trap **before returning**, so the `AGENTS.md` call always re-arms into a cleared slot. |
| **R4** | explicit `[ ! -r ]` refusal before any read | ✅ **FIXED** | `chmod 222` → `⚠ skipped CLAUDE.md — fkit cannot read it (check its permissions)`, rc=0, **no raw `Permission denied` leak**, **no bogus "malformed"** misreport. |
| **R5** | cap measures the emitted block | ✅ **FIXED** | `:96` `block_size="$(emit_block \| wc -c)"`. Emitted block = **1161 B** vs `RULES_MAX=4096`. Right meter now. |
| **R6** | EOF-append guarantees the separating newline | ✅ **FIXED** | No-trailing-newline fixture: last line intact **on its own line**, begin marker **alone on its line**, idempotent. |
| **R7** | "confirmed and I cannot fix it" | ❌ **STILL OPEN — owner action** | `git ls-files --error-unmatch claude/scaffold/universal-rules.md` → **still untracked**. The coder is right that this is not theirs to close. **Flagged as loudly as I know how, below.** |

**No regressions in anything else round 1 certified:** symlink guard still refuses and does **not** write
through (target byte-identical, symlink intact, init carries on with 7 agents) · all three malformed-marker
refusals still `rc=0`, file byte-identical, stderr, init completes · greenfield block itself is **correct
and idempotent** (the warning is spurious, the file is right) · **this repo**: one block per root file,
clean stderr, no litter, `git status` unchanged on re-run · **the four rules still land byte-identical to
`universal-rules.md`** in a brownfield `AGENTS.md`.

*(The live `codex exec` delivery re-check timed out on the environment, not the code. I verified
structurally instead: the emitted rules are **byte-identical** to `universal-rules.md` and the delivery
path is untouched by the round-2 diff — only the header comment changed. Round 1's live proof stands.)*

---

## Round 2 — new findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R8 | 2 | **medium** | `claude/fkit-claude-init.sh:159` | **Every fresh fkit project cries wolf on its first launch — and it is the R1 remedy's own alarm.** `sed -n "$((lb+1)),$((le-1))p"` with **start > end** does **not** print nothing: BSD/GNU `sed` prints the **start line**. Verified directly: `sed -n '3,2p'` on a 4-line file returns the line-3 content. So for an **adjacent marker pair** — which is exactly what `claude/scaffold/CLAUDE.md:56-57` ships — `region` picks up the **end marker itself**, is non-empty, lacks the tag, and the warning fires. **Reproduced on a brand-new empty project:** both `CLAUDE.md` and `AGENTS.md` emit *"⚠ … replacing the content between the fkit rules markers — **fkit did not write it**"* — about scaffold files **fkit itself created four lines earlier** (`:190`). The code contradicts its own comment (`:152-156`: *"An empty region is an opt-in … we do NOT do it silently"* — the empty case was supposed to be **silent**). Self-heals after launch 1 (verified: 0 warnings on launches 2-4), so it is **once per project, not forever** — but it is once per *every* project, on the *first* launch, which is precisely when a new user is calibrating whether fkit's warnings mean anything. **This is the cry-wolf failure that devalues the one signal R1's fix depends on.** Raised by **Codex** (medium); I missed it. Independently verified. |
| R9 | 2 | **medium** | `claude/fkit-claude-init.sh:111` | **CRLF regression: the block is duplicated, without bound.** `gsub(/^[ \t]+|[ \t]+$/, "", l)` trims spaces and tabs but **not `\r`**, so on a CRLF file `<!-- fkit:begin-rules -->\r` ≠ the marker and the matcher reports **no block**. **Reproduced end-to-end:** run init on an LF file (1 block) → CRLF-convert the file (a Windows editor save, or `git autocrlf=true` on checkout) → next launch **appends a second block**. And it **grows**: one additional block per CRLF-normalization event — I drove it to **5 blocks / 5 copies of the rules** in 4 cycles. **This is a regression against two things round 1 explicitly certified**: *"CRLF → markers still found … idempotent (verified)"* and *"**No unbounded growth on any path**."* The old substring `grep -F` tolerated `\r`; exact-line matching does not. **Worse than cosmetic:** the stale ghost block is invisible to the matcher forever, so fkit **can never ship a rules correction into it** — which is the exact bug brief 31 exists to fix, resurrected for Windows users. Owner content is never lost, which is why this is medium and not high. Raised by **both** (Codex rated it high). **One-line fix: add `\r` to the `gsub` class.** |
| R10 | 2 | low | `claude/fkit-claude-init.sh:135-136` · `:160` | **`set -o pipefail` + a pipe consumer that exits early = SIGPIPE (141).** Two sites, one root cause. **(a) `:135-136` — init *dies* instead of refusing.** `printf '%s\n' "$lbs" \| head -1`: `head` exits after one line; once `$lbs` exceeds the 64 KB pipe buffer, `printf` takes SIGPIPE → pipeline returns **141** → `set -e` **aborts the whole script**. Verified with a file of 100 000 begin markers: **rc=141, stderr empty, 0 agents installed** — the "refuse and carry on" guarantee fails *completely* on a path whose entire job is to refuse gracefully. **(b) `:160` — a spurious warning.** `sed … \| grep -qF "$RULES_TAG"`: `grep -q` exits on first match, `sed` takes SIGPIPE, `pipefail` makes the pipeline non-zero, `!` inverts it → the "fkit did not write it" warning fires **even though the tag is present**. Verified: clean below ~5 KB, **fires reliably at ≥46 KB**. Both need absurd inputs (thousands of markers; a >16 KB region) and **neither is reachable from fkit's own 1161 B block under the 4096 B cap** — so: **low, latent, but a real landmine**, and (a) is the same class of "the guard itself is the thing that breaks" bug as R1. Site (a) raised by **Codex**; site (b) by me. |
| R11 | 2 | low | `claude/fkit-claude-init.sh:77,160` | **The `fkit-managed:` tag is a heuristic, not a boundary — and the coder's own two worries, answered.** (i) **Spoofable, and it fails silent.** Verified: owner content between the markers that merely *contains the string* `fkit-managed:` suppresses the warning and is **deleted silently**. This does **not** re-open R1 — getting the markers into your file at all is the accepted footgun — but it means the warning is a best-effort hint, and it should be described as one, not relied on. (ii) **The coder's top worry — "an old block warns on every launch forever" — does NOT occur.** Verified against a simulated pre-tag block (the round-1 header, which had no tag): warns **once**, then the rewrite installs the tag and it is silent forever after (0 warnings on launches 2-3, owner prose above and below intact). It is **self-healing**. The residual is only that the copy is *misleading on the one path it is guaranteed to take*: an fkit upgrade that changes the header will tell every existing user *"fkit did not write it"* about a block **fkit did write**. Cosmetic; worth a word-change, not a redesign. |

### The coder's three attack questions — answered

1. **The `fkit-managed:` tag.** Spoofable and accidentally matchable (**R11**), so treat it as a hint.
   **But your biggest worry is unfounded**: a header change does **not** warn forever — it warns once and
   self-heals, because the warning path *also rewrites the block with the new tag*. **The forever-warning
   you feared is not there. A false warning on every new project (R8) is — and it's the worse one**, because
   it hits every user at first contact rather than existing users once at upgrade.
2. **`awk` marker matching.** **CRLF is the hole (R9)** — a marker with a trailing `\r` should match and
   does not. Tabs and leading/trailing spaces: **correct** (matched). NBSP-prefixed marker: **correctly not
   matched**. Inline-in-prose: **correctly inert** — R1 is genuinely closed.
3. **The `trap`.** **Clean on all three counts.** It fires on a `set -e` abort (0 litter). It does **not**
   clobber across the two `merge_rules` calls — every exit path clears it before returning, so there is no
   window where `CLAUDE.md`'s trap is live while `AGENTS.md`'s is being armed. And 0 litter across 8 paths.

---

## ⛔ R7 — RELEASE GATE. Read this before cutting a release.

**`claude/scaffold/universal-rules.md` is still untracked** (re-verified this round:
`git ls-files --error-unmatch` → fails). `install.sh` ships `claude/` from a **git tarball**;
`claude/fkit-claude-init.sh:80` hard-`exit 1`s when the file is absent. **A release cut without committing
this file means every `fkit` launch fails, for every user, immediately.** `install.sh`'s own fetch
sanity-gate checks only `fkit-claude.sh`, so **it will not catch this.**

The coder is right that this is not theirs to close — they do not commit unprompted, correctly. **This is
the single highest-risk item in the change, and it is an owner action, not a code action.**

---

## Round 1 — decision verdict

> **🛑 Blocked — 1 confirmed high defect (R1: fkit silently deletes owner prose), 2 medium, 4 low.**

**The feature works.** Every load-bearing claim the coder made was independently re-verified and holds:
idempotency (3×, across brownfield / greenfield / CRLF / empty / markers-only / 5 MB / this repo — byte-identical),
idempotency across a content change, every refusal path (rc=0, file byte-identical, stderr, init completes),
`exit 3`'s meaning uncorrupted, and — live, with a control — **Codex reading the four rules out of a
brownfield `AGENTS.md`**. Brief 31's real bug is genuinely fixed, not relocated.

**What blocks it is the one path nobody's test covered: the merge is destructive and silent.** A
project whose `CLAUDE.md` merely *mentions* both markers has the region between them **overwritten,
with no output on any stream.** Empirically reproduced, twice, below.

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | **high** | `claude/fkit-claude-init.sh:109-112,122` · `:137` | **fkit silently deletes the owner's prose.** Marker detection is `grep -cF` — a **substring** match on any line — so a root `CLAUDE.md`/`AGENTS.md` that merely *mentions* the two markers is treated as fkit's managed block and the entire line range between them is replaced (`:122`). **Reproduced twice, from a clean fixture:** (a) markers named in **ordinary prose on two lines** (*"The begin marker is `<!-- fkit:begin-rules -->` … The end marker is `<!-- fkit:end-rules -->` …"*) → **both of the owner's sentences deleted**; (b) markers inside a **fenced code block** → the fenced content deleted. In both runs: `rc=0`, **stderr completely empty**. **The silence is the aggravator, and it is a second, separable defect:** the only announcement of the write (`:137` `echo "• updated the fkit rules block in $name"`) goes to **stdout**, which `claude/fkit-claude.sh:305` sends to `/dev/null` on every already-set-up project. So **the one destructive path in the feature is the one path with zero user-visible signal** — the exact inversion of the stderr discipline the coder correctly applied to every *refusal* (`:35-37`, `:100-107`). Raised by both reviewers (Codex X1, high). ⚠️ **Codex's suggested direction — "match only standalone marker lines" — is a HALF-FIX: it closes (a) but NOT (b), where the markers *are* standalone lines, inside a fence.** Do not ship it and call this closed. |
| R2 | 1 | **medium** | `claude/fkit-claude-init.sh:88-90` | **The one mitigation brief 31 actually asked for was not delivered.** Brief 31:114 accepts the fenced-marker footgun *conditionally*: **"Note it in the block header; do not build a markdown parser."** The emitted header notes only that the block is rewritten on every launch. It never warns that **writing the marker strings anywhere else in the file arms R1** — and it instead promises *"everything outside is yours and fkit never touches it"*, which reads as unconditional safety and is exactly what a user would rely on right before tripping R1. Directly compounds R1. |
| R3 | 1 | **medium** | `claude/fkit-claude-init.sh:114-136` | **No `trap` — the temp file survives an abort.** `grep -c '^\s*trap'` on init = **0**. `tmp="$f.fkit-tmp.$$"` is created by the redirection at `:118`/`:122` and removed only on the success (`mv`) and malformed (`rm -f`) paths. Any `set -e` abort in between — ENOSPC, SIGINT, a failed `mv` at `:136` — leaves `CLAUDE.md.fkit-tmp.<pid>` in the **owner's project root**. Brief 31 requires no temp file left behind. **Verified clean on every normal path** (all refusals, 5 MB file: 0 litter), so this is abort-only. Raised by both (Codex X2). |
| R4 | 1 | low | `claude/fkit-claude-init.sh:105,109-112` | **Wrong diagnosis on a writable-but-unreadable file.** There is no `-r` check. `chmod 222 CLAUDE.md` → `-w` passes, the four `grep`s fail, `nb`/`ne` come back **empty**, and init reports **"⚠ skipped CLAUDE.md — its markers are malformed ( begin,  end)"** — after leaking two raw `grep: …: Permission denied` lines to stderr. **Fails safe** (verified: file byte-identical, rc=0, init completes) but misdirects the owner to look for markers that are not the problem. |
| R5 | 1 | low | `claude/fkit-claude-init.sh:75-84` | **The size cap measures the wrong thing.** `RULES_MAX=4096` is checked against `universal-rules.md` alone (**668 B**), but what lands in every agent's context is the *emitted block* — plus the two markers and the 253 B managed-comment header ≈ **921 B**. ADR-016:207-209 asked for a cap on *"whatever fkit ships in the block"*. Vast headroom today, so this is a **wrong meter, not a live breach** — but the meter is the whole point of that ADR clause. |
| R6 | 1 | low | `claude/fkit-claude-init.sh:118` | **Append path loses the blank separator when the owner's file has no trailing newline.** `{ cat "$f"; printf '\n'; emit_block; }` yields exactly one `\n`, so the begin marker lands on the line **immediately after** the owner's last line. Under CommonMark the HTML comment is absorbed into the owner's final paragraph. Cosmetic; **idempotent** (verified). |
| R7 | 1 | low | `claude/scaffold/universal-rules.md` (untracked) · `install.sh:32,43` · `claude/fkit-claude-init.sh:78` | **Release gate, not a code defect — but it bricks every launch if missed.** `universal-rules.md` is currently **untracked**. `install.sh` ships `claude/` from a **git tarball**, and init hard-`exit 1`s if the file is absent (`:78`) — so a release cut without committing it means **every `fkit` launch fails, for every user**. `install.sh`'s own fetch sanity-gate (`:34`) checks only `fkit-claude.sh`, so it would not catch this. Recorded so the release does not eat it. |

### Verified-safe — do NOT chase (the coder's own attack list, re-run independently)

Every item the coder asked me to attack under **A**, and several they worried about, is **clean**:

- **`sed` is never given owner content as a program.** Only line-address `p` (`:122`). Owner content
  containing `$100 & 50%`, literal backslashes, `&`, and even a literal `s/foo/bar/g` line survives
  **byte-for-byte** (diffed). The `$`/backslash/`&` worry is unfounded.
- **`mv` cross-filesystem is impossible.** `tmp="$f.fkit-tmp.$$"` is in the **same directory** as `$f`.
  Not a risk; nothing to fix.
- **Concurrent `fkit` launches do not race destructively.** `$$` is per-process → distinct temp paths;
  both writers emit **identical bytes**; `mv` is an atomic rename; a reader holding the old fd sees a
  consistent old inode. Worst case is a redundant write.
- **CRLF** → markers still found (`grep -F` substring), block emitted LF, **idempotent** (verified).
- **No trailing newline** → handled; idempotent (see R6 for the cosmetic residue).
- **Empty file**, **file that IS only the two markers**, **begin marker on line 1** → all correct,
  all idempotent, `rc=0`.
- **Marker with trailing whitespace / indentation** → matched (substring) and handled.
- **5 MB / 120 000-line owner file** → correct, <1 s, one block, idempotent, **no litter**.
- **Symlinked root file** → `[ -L ]` first (`:99`, `:142`): **target byte-identical, symlink intact,
  rest of init ran** (7 agents copied). The task-27 lesson is correctly applied to this second seam.

### B — Idempotency: **CONFIRMED**, independently

- **Brownfield** (owner prose above *and* below): 3 runs → `md5` identical; **one** block; owner prose intact.
- **Greenfield**: one block in each root file; scaffold placeholders intact; idempotent ×3.
- **This repo**: one block in each root file; all sections intact.
- **Across a content change** (the coder's own extra question — the right one to ask): appended a 5th rule
  to `universal-rules.md` → the block **updated in place, exactly once**; the prefix and suffix around it
  did not move; re-running was a no-op; reverting the rules file reverted the block. **No unbounded growth
  on any path.**

### C — Refusal paths: **CONFIRMED**, and the `exit 3` reading is **correct**

| State | rc | File byte-identical | stderr | init completed | Temp litter |
|---|---|---|---|---|---|
| begin marker, no end | 0 | ✅ | ✅ | ✅ (7 agents) | 0 |
| two marker pairs | 0 | ✅ | ✅ | ✅ | 0 |
| end before begin | 0 | ✅ | ✅ | ✅ | 0 |
| symlinked `CLAUDE.md` | 0 | ✅ (target) | ✅ | ✅ | 0 |
| unwritable (`chmod 444`) | 0 | ✅ | ✅ | ✅ | 0 |
| writable-but-unreadable | 0 | ✅ | ⚠️ wrong message — **R4** | ✅ | 0 |

**None of these can be made to write.** And **`exit 3` is not corrupted — the coder got it right.** The new
refusals `return 0` from `merge_rules` and **never touch `aa_state`**, which is set only in step 1
(`:38-46`); `exit 3` still fires only on `[ -n "$aa_state" ]` (`:270`). Verified empirically: every refusal
above exits **0**, not 3. The `exit 3` = *"I refused `ai-agents/`"* channel from task 27 remains single-fact.
*(Corollary, deliberate and correct: a refused root file is invisible to the launcher's exit-status logic —
the owner learns about it from **stderr**, which `fkit-claude.sh:305` does **not** discard. That is the right
trade; it is also precisely what makes R1's silence a defect rather than a style choice.)*

### D — "Did I fix the thing, or just move it?" → **FIXED. Not relocated.** Live-verified with a control.

Brief 31's real bug ("brownfield projects get no rules") is closed, and brief 30's premise holds end-to-end:

- Brownfield fixture (owner prose + merged block), `codex exec --cd <fixture>`, cold:
  **returned all four universal hard rules, verbatim.**
- **Control** — identical owner prose, **no** fkit block: returned **no rules at all**.

So the rules reach Codex *through a brownfield `AGENTS.md` produced by the new merge* — which is the exact
composition of briefs 30 and 31, and the thing neither brief tested on its own.

### E — **RULING: brief 30's verification step is BROKEN. The coder is right. Do not trust it.**

The brief (`give-codex-the-universal-hard-rules.md:81-83`) states the pass condition as
`grep -ciE "never commit|no secrets|wiki-vault" claude/scaffold/AGENTS.md`, and asserts:
*"This is the exact grep that returned **0** before the fix."*

**It did not.** Run against the **pre-fix** files at `HEAD`:

| File (pre-fix, zero rules present) | Brief's grep returns |
|---|---|
| `claude/scaffold/AGENTS.md` | **1** |
| `/AGENTS.md` | **2** |

The only thing it matched was `wiki-vault` — **in the Knowledge Base section's prose**, describing the
*path*. Two independent faults:

1. **It passes a file with no rules in it at all.** The pattern matches project prose, not the rules.
2. **`grep -c` with an alternation cannot do what the brief claims.** The brief asks for *"a non-zero
   count for **each** of the three patterns"*; `-c` returns **one** count of matching *lines*, once. The
   check it describes is not the check it specifies.

The coder's per-rule greps are the correct instrument. **This is a defect in the brief, not in the code**
— recorded here so the next person does not inherit the false negative. It also lands squarely on ADR-016's
own lesson (`:104-105`): *"a count of a **semantic** rule cannot be established by grepping one of its
phrasings."* The brief repeated the mistake the ADR was written to stop.

### F — Overclaim check: **CLEAN in the coder's diff.**

`grep -inE "floor|teeth|non-overridable|enforc|guarantee|binding"` over **every added line** of the diff
(`claude/`, `/CLAUDE.md`, `/AGENTS.md`) and over `universal-rules.md`: **zero hits.** The coder wrote no
enforcement language. ADR-016's *"delivery is structural, compliance is advisory"* is respected throughout.

**One hit exists, and it is out of scope — it belongs to the architect, not this diff.** Codex (X3, low)
flags **`adr-016:214`**: *"**Codex finally gets a floor**"*, in the ADR's own *Positive* section — 15 lines
after its *Consequences* section says *"There is no floor, no teeth, no 'non-overridable' anything."*
**ADR-016 commits, in its own summary, the exact overclaim it was written to retract.** (Same word in the
report at `:307`: *"Give Codex the floor it has never had."*) Not chargeable to this task — **surfaced for
the architect**; see owner-questions.

### (32) — verified

All **7** agent files now carry a no-secrets rule (`grep -L` → empty). The new bullet sits under
`fkit-lead.md`'s `## Hard rules` (`:67-68`) and, sensibly, extends it to *"a routed answer you bring back
from another role"* — the lead's actual leak surface.

---

## Coder response

<!-- CODER-OWNED. The reviewer does not write here. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **Agreed — high, and I reproduced it before fixing.** `grep -cF` is a **substring** match, so a `CLAUDE.md` whose prose merely *documents* the markers had the text between the two sentences **silently deleted** (rc=0, stderr empty). The reviewer was right that this is worse than brief 31's accepted footgun, and right that it was the one destructive path with **zero** signal — I had applied the stderr discipline to every refusal and not carried it to the write. | Defect | Took option **(a)**, not Codex's half-fix (exact-line matching alone closes the prose case but **not** the fenced case). Two changes: (1) `marker_lines()` compares the *trimmed whole line* via `awk` — a marker quoted inline is inert; (2) before replacing a region fkit did **not** author (no `fkit-managed:` tag), **warn on stderr**. The fenced case is now **loud instead of silent**. | **Fixed** |
| R2 | **Agreed.** Brief 31:114's acceptance of the footgun was *conditional* on noting it in the block header; I hadn't. | Defect | Header now states the real rule: markers are recognized only when **alone on a line** — quoting one inline is safe, a bare marker line inside a code fence is not. | **Fixed** |
| R3 | **Agreed.** A `set -e` abort between write and `mv` would strand `CLAUDE.md.fkit-tmp.<pid>` in the owner's project root. | Defect | `trap 'rm -f "$tmp"' EXIT`, cleared on every exit path before returning. Verified 0 litter across all paths. | **Fixed** |
| R4 | **Agreed.** A writable-but-unreadable file leaked a raw `grep: Permission denied` and then **misreported** "markers are malformed ( begin, end)". | Defect | Explicit `[ ! -r ]` refusal before any read. | **Fixed** |
| R5 | **Agreed — the meter was measuring the wrong thing.** `RULES_MAX` capped the *source* (668 B), not the *emitted* block, which is what every agent actually pays for on every turn. | Defect | Cap now computed from `emit_block \| wc -c`. | **Fixed** |
| R6 | **Agreed.** A file with no trailing newline had its last line absorbed into the marker line. | Nit | EOF-append now guarantees the separating newline itself. | **Fixed** |
| R7 | **Agreed, and I cannot close it.** `claude/scaffold/universal-rules.md` is **untracked**; `install.sh` ships from a git tarball and init hard-`exit 1`s without it, so a release cut without it **breaks every `fkit` launch for every user**. `install.sh`'s fetch gate checks only `fkit-claude.sh` and would not catch it. | Defect (release gate) | **None available to me — I do not commit unprompted.** Relayed to the owner as the single highest-risk item in the change. It is a `git add`, not a code change. | **⛔ OPEN — owner action** |
| R8 | **Agreed — and the reviewer's framing was the useful part.** `sed -n '5,4p'` prints the **start** line, not nothing, so the empty-region probe read the end-marker line as foreign content: **every brand-new project warned about the file fkit created four lines earlier.** The blast radius is trivial; the cost is not — it spends the credibility of the *only* warning that makes A1's tradeoff survivable. A false alarm on a user's first launch is worth less than no alarm. | Defect (introduced by my R1 fix) | Guard the range: probe only when `le > lb + 1`. Verified **both** directions — fresh project silent; genuinely foreign region (fenced, and the `le == lb+2` boundary) **still warns**. | **Fixed** |
| R9 | **Agreed — the worse of the two.** `gsub` didn't strip `\r`, so a CRLF file never matched its own markers: **5 blocks after 4 cycles**, unbounded, with the stale block invisible to the matcher **forever** — i.e. brief 31's original bug (fkit can never ship a rules correction) resurrected for Windows users. Round 1's "CRLF → idempotent" pass was a false certification. | Defect (introduced by my R1 fix) | `\r` added to the trim set. **1 block after 4 CRLF cycles**, and a rules correction now reaches a CRLF file. | **Fixed** |
| R10 | **Agreed.** `pipefail` + an early-exiting pipe consumer (`head -1`) → SIGPIPE → rc=141 → `set -e` kills init, on the path whose entire job is to refuse gracefully. | Defect | Both `head -1` pipes replaced with `set -- $(marker_lines …)`. Verified with **3000 markers**: clean refusal, rc=0, agents installed. | **Fixed** |
| R11 | **Reviewer corrected me, and tested rather than agreed — my worry was unfounded.** A block-header change does **not** warn forever: it warns **once**, the rewrite installs the new tag, silent thereafter. It self-heals. | Frontier | None. The tag-spoof path is recorded as **A2**. | **Accepted residual (A2)** — pending owner |
| R12 | **Agreed, and it is a direct hit on me: I claimed "replaced both pipes" and the bug was still there.** The tag check kept `printf \| grep -qF` — `grep -q` exits on match, EPIPEs `printf`, `pipefail` makes the pipeline non-zero, and the `!` inverts that into "tag absent", firing the warning on a block we **did** write plus a raw broken-pipe leak (the class R4 closed). Only found by **driving the real script** — it never fires in an isolated subshell. | Defect | Replaced with `case "$region" in *"$RULES_TAG"*)`. No pipe, no bug. Verified 5/5 on the real script. | **Fixed** |
| R13 | **Agreed with the reviewer's downgrade.** `tmp="$f.fkit-tmp.$$"` isn't exclusive and `>` follows symlinks — but the path is in the **owner's own project root**, not a world-writable `/tmp`. Anyone who can plant that link can already edit `CLAUDE.md` directly, so it buys an attacker nothing; accidental collision is benign. | Frontier | None. Hardening nit. | **Won't fix** (recommended residual) |

---

## Accepted residuals (shared, do-not-re-litigate)

> ✅ **The owner has ruled. A1 and A2 are ACCEPTED; R13 is WON'T FIX.** These three are **settled ground**.
> A future reviewer that re-reports the *mechanism* of any of them — the fenced-marker overwrite, the
> tag spoof, or the predictable temp path — is **re-litigating a decision, not finding a defect**, and
> should be suppressed. Re-open **only** on the stated conditions below.

### ✅ A1 — ACCEPTED (owner, round 3 closeout)

**What:** bare marker lines inside a **fenced code block** are still treated as real markers, so the
region between them is overwritten. **Now announced loudly on stderr.**

**Why this is a frontier-move, not a defect:** the markers *are* the contract, and a bare marker line is
a marker line. Closing it properly needs the markdown parser brief 31 **explicitly forbids**
(`brief 31:114`). The tradeoff was made once, on purpose, with the alternative named and rejected.

**The condition I set is MET, and I verified it in both directions rather than declaring it.** A1's whole
justification is *"loud, not silent"* — and in round 2 that loudness was **not credible**, because R8 made
every brand-new project cry wolf on its first launch. R8 is fixed: a fresh project is **silent** (0
warnings), **and** the alarm still fires on a genuinely foreign region (fenced, *and* at the `le == lb+2`
one-line boundary the new guard sits on). A fix that bought silence by muting the alarm would have
destroyed A1's premise while looking like a pass. It didn't. **The warning means something again, so the
trade A1 rests on is one the code actually honors.**

**Re-open A1 if:** the stderr warning is removed or weakened · the launcher starts discarding stderr
(`fkit-claude.sh:305` currently does **not**) · or a report arrives of an owner losing content **despite**
the warning — which would mean the warning is not landing and the trade was wrong.

### ✅ A2 — ACCEPTED, with the carve-out intact (owner, round 3 closeout)

**What:** owner content between the markers that merely *contains the string* `fkit-managed:` suppresses
the warning and is replaced **silently**. The tag is a **heuristic, not a boundary**.

**Why accepted:** it requires the owner to place that exact string between two bare marker lines **they
also authored** — a compounded improbability. Closing it means either the forbidden markdown parser or a
spoof-resistant tag (nonce/hash), which buys little against a threat that **is not adversarial**.

⚠️ **THE CARVE-OUT — this is the honest part, and it survives acceptance:**
**A2 is the one path where A1's *"loud, not silent"* bargain does NOT hold.** It is recorded as a
**known silent path**, and it is **not** folded into A1 as though A1's warning covered it. A1 is
acceptable *because* it is loud; A2 is acceptable *despite* being silent, on improbability alone. Anyone
citing A1's stderr warning as the safety story for the tag path is **citing it wrongly**.

**Re-raise A2 only if:** a report arrives of an owner losing content on this path · **or the tag is ever
repurposed as a security/authenticity control rather than a hint** — at which point "heuristic, not a
boundary" stops being a caveat and becomes a vulnerability.

### ❌ R13 — WON'T FIX (owner, round 3 closeout) — threat model, not mechanism

**The mechanism is real and I verified it:** `tmp="$f.fkit-tmp.$$"` is not created exclusively, and
`> "$tmp"` **does** follow a symlink (I truncated a file outside the project through a planted link).
Codex rated it **medium**; **I downgraded it to low and the owner agrees.**

**The threat model does not hold.** The path is `<project-root>/CLAUDE.md.fkit-tmp.<pid>` — **inside the
owner's own project root**, which is **not a shared trust boundary**. Anyone who can plant that symlink
**already has write access to the project root** and can simply edit `CLAUDE.md`, or any source file,
directly. The attack buys the attacker **nothing they do not already have**. This is the classic `/tmp`
symlink-race pattern applied to a directory where its premise — **world-writable, multi-user** — is
**absent**. Accidental collision is benign too: it needs stale litter that survived (**0 litter on every
path**, re-verified), that matched the live PID **exactly**, **and** was a symlink; a stale *plain* file
there is simply truncated and overwritten, which is the intent.

**Recorded so a future reviewer finds the ruling rather than re-reporting the mechanism.** `mktemp` in the
same directory would close it for ~free **if the file is opened for another reason** — but it is not worth
a change on its own. **Re-raise only if** the temp file ever moves to a world-writable or shared directory,
which would restore the premise this ruling rests on.

### (superseded) Round 3 — status of the proposed residuals

*(Kept for the audit trail: this is the state before the owner ruled. A1 and A2 are now **accepted**
above.)*

**A1 — my condition is MET. I withdraw my objection and recommend acceptance.**
In round 2 I recorded A1 as *conditionally* accepted, with one stated condition: *"Accept A1 once R8 is
fixed"* — because A1's entire justification is *"loud, not silent"*, and R8 made that loudness
non-credible by crying wolf on every project's first launch. **R8 is now fixed and I verified both
directions**: the fresh-project false alarm is gone (0 warnings), **and** the alarm still fires on a real
foreign region (fenced, and at the guard's exact one-line boundary). The warning means something again,
so the trade A1 rests on is now a trade the code actually honors. **On the merits, A1 is a sound
frontier-move.** → **owner's ruling required to record it.**

**A2 (new, from R11(i)) — the `fkit-managed:` tag-spoof silent path. Recommended for acceptance, with a
carve-out.**
**What:** owner content between the markers that merely *contains the string* `fkit-managed:` suppresses
the warning and is replaced **silently**.
**Why (structural):** it requires the owner to place that exact string between two bare marker lines
**they also authored** — a compounded improbability — and closing it properly means either the markdown
parser brief 31 explicitly forbids, or a spoof-resistant tag (a nonce/hash), which buys little against a
threat that is not adversarial. I **concur with the coder** that this is a reasonable place to stop.
**Carve-out (mine, and it is the honest part):** the tag is a **best-effort heuristic, not a boundary**.
A1's bargain is *"loud, not silent"*; A2 is the one path where the bargain does **not** hold. It must be
recorded as a *known silent path*, not folded into A1 as if it were covered.
**Re-raise only if:** a report arrives of an owner losing content on this path; or the tag is ever
repurposed as a security/authenticity control rather than a hint.
→ **owner's ruling required to record it.**

### Proposed for acceptance — **awaiting the owner's ruling** (see owner-questions)

**A1 — markers inside a fenced code block are still overwritten (now *loudly*).**
The coder asked me to record this as accepted, and **on the merits I agree it is now adequately
handled**: it is announced on **stderr** (verified — and stderr is the one stream the launcher does
**not** `/dev/null`), the block header states the real rule, and closing it properly would need the
markdown parser brief 31 explicitly forbids. It is a genuine **frontier-move**, not a defect: the
markers are the contract, and a bare marker line is a marker line.

⚠️ **But I am recording it as *conditionally* accepted, not accepted, because its entire justification is
"loud, not silent" — and R8 currently makes that loudness non-credible.** A warning that fires falsely on
**every greenfield project's first launch** is a warning users learn to ignore before they ever meet the
real one. **Accept A1 once R8 is fixed.** Until then the acceptance rests on a promise the code does not
yet keep.

**Re-open A1 if:** the stderr warning is removed or weakened; the launcher starts discarding stderr; or a
report arrives of an owner losing content to it *despite* the warning (which would mean the warning is not
landing, and the trade was wrong).

**Not covered by A1, and not settled:** the tag-spoof silent path (**R11(i)**) — a fenced region that
happens to contain `fkit-managed:` is deleted with **no** warning at all, which is outside the
"loud, not silent" bargain A1 is premised on.

### Suppressed as re-litigation of settled ground

- **Codex X (round 2, "High") — "exact marker lines inside fenced examples are still treated as real
  managed regions and overwritten."** ❌ **Suppressed.** This is brief 31:114's *explicitly accepted*
  footgun (*"a known, accepted footgun … do not build a markdown parser"*), and the acceptance's one
  condition — note it in the block header — **has now been met** (R2, verified). Codex is re-raising a
  settled tradeoff as a defect, and its severity label (**high**) is wrong for a decision that was made
  once, on purpose, with the alternative named and rejected. **Do not re-fix this.** The *only* live parts
  of it are R8 (the warning is not credible yet) and R11(i) (the warning can be suppressed) — both of
  which are about the **warning**, not about the overwrite.

*(Round-1 note: entries are added only once the **owner** rules on a finding. A1 is the first to reach
that gate.)*

**Primed against, and correctly NOT re-raised by either reviewer** (ADR-016 *Re-raise only if*): the
`AGENTS-COMMON.md` splice; `--append-system-prompt`; "the rules are visible to non-fkit Claude sessions";
"the rules are duplicated across 6 of 7 agent files"; "an agent ignored a shared instruction". **Zero
re-litigation this round — nothing to suppress.**

⚠️ **One near-miss worth naming so it is not mistaken for a settled residual.** Brief 31:114 calls
"markers inside a fenced code block" a *"known, accepted footgun"*. **R1 is not covered by that
acceptance**, on two independent grounds:
1. **The acceptance was conditional** — *"Note it in the block header"* — and the note was not written (**R2**).
2. **R1's stronger repro is not a fenced code block at all.** Markers named in **ordinary prose**, on two
   separate lines, are enough to arm it. That case was never accepted by anyone, and — unlike the fenced
   case — it is closable by exact-line matching, **without a markdown parser** (which the brief rightly
   forbids). A finding is only settled to the extent it was actually settled.

---

## Convergence call — round 1

**Act, don't close out.** Zero re-litigation; every finding is new; the two reviewers agree on the top
two (R1, R3) and were **complementary**, not redundant.

- **The high (R1) is not a style point** — it is unattended, irreversible, silent deletion of content in a
  file **fkit does not own**, on **every launch**. This is the first fkit code with that blast radius, and
  the coder was right to ask for it to be attacked. The precondition is narrow *and self-inflicted by fkit's
  own documentation surface*: the way an owner gets both marker strings into their `CLAUDE.md` is by
  **documenting the mechanism fkit just added to their file** — which fkit's own block header invites them
  to think about, while telling them everything outside it is safe.
- **Both reviewers earned their keep.** Codex independently found R1 and R3 by inspection; the empirical
  pass produced the **prose repro** (which Codex's suggested fix would close) *and* showed **Codex's fix is
  incomplete for the fenced case** (which it would not). Neither pass alone gives you that.
- **Everything else in the diff is sound.** Do not let R1 obscure that briefs 30 and 32 are clean, and that
  brief 31's *stated* bug is genuinely fixed and Codex-verified end-to-end.

**Recommended shape of round 2:** R1 + R2 + R3 together (they are one seam — detect precisely, warn on
stderr when taking over a region fkit did not author, and clean up the temp file). R4–R6 are free to fold in
while that code is open. R7 is a release-checklist item, not code.

**The verdict is a recommendation, not an authorization.** No code was changed by this review.

---

## Convergence call — round 2

**Act, then close. One more round should finish this.** We are converging, and the shape of the remaining
work is small and mechanical.

- **The round-1 blocker is genuinely dead.** R1–R6: **6/6 fixed, all independently re-run**. The coder
  took the harder, correct option over Codex's half-fix, and was right to. Brief 30, brief 32, the refusal
  paths, the symlink guard, `exit 3`, idempotency, and end-to-end rule delivery all still hold. **This is
  close.**
- **But the fix drew blood on its way in, and that is the whole reason a round 2 exists.** R8 and R9 are
  both *in the R1 fix itself* — one in the region probe, one in the matcher. Neither was reachable before
  the fix. This is the ordinary tax of changing a destructive path, not a sign the approach is wrong.
- **R8 is the one to take seriously**, and not for its blast radius (a spurious line on stderr) but for
  what it costs: it spends the credibility of the **only warning that makes the fenced-case tradeoff
  survivable**. Fix R8 and A1 becomes a clean, defensible accepted residual. Leave it and fkit ships a
  safety alarm that every new user is trained to ignore on day one.
- **R9 is the one with the most real users behind it.** Windows + `git autocrlf` is not exotic, and the
  failure mode — a stale rules block fkit can never reach again — is brief 31's original bug, wearing a
  new hat.
- **Both reviewers earned their keep again, and this time Codex out-found me.** It caught R8 (the
  `sed` start>end behavior) and the `:135` SIGPIPE abort, both of which I missed; I caught the `:160`
  SIGPIPE, the tag spoof, and confirmed the header-change worry is unfounded. **Neither pass alone gives
  you this round.** Codex also produced one clean re-litigation (the fenced case, suppressed above) — which
  is exactly the noise the ledger exists to absorb.

**Recommended shape of round 3 (small, and the last):**
- **R9** — one line: add `\r` to the `gsub` character class at `:111`.
- **R8** — guard the region probe on `le > lb + 1` before running `sed`, or compare `le - lb` directly.
  (Do *not* reach for a fancier `sed`; the arithmetic is the bug.)
- **R10** — two lines: `head -1` → `sed -n 1p`/parameter expansion, and neutralize the `:160` pipeline's
  exit status. Cheap while the file is open; do not spend real time on it.
- **R11** — a word-change in the warning copy ("fkit did not write it" → something honest about it being a
  best-effort check). Optional.
- **R7** — **owner action. Not code. Do not let round 3 close without it.**

**Convergence signal: no new *classes* of defect appeared this round** — everything found is either in the
R1 fix's own seam or a wording nit. If round 3 lands R8 + R9 clean, I expect to close this out. **If round 3
produces findings that are again only in the newest fix, stop and ship** — that is the point at which we are
polishing, not converging.

**The verdict is a recommendation, not an authorization.** **No code was changed by this review, in either
round.**

---

## Convergence call — round 3

### 🛑 STOP AND SHIP. This is converged. Do not open a round 4.

I set the stopping rule myself in round 2 — *"if round 3 produces findings that are again only in the
newest fix, stop and ship; that is polishing, not converging"* — and the coder was right to hold me to
it. **The rule is met, so I am honoring it.**

- **The two mediums are dead, and I verified the fixes in both directions rather than just confirming
  the happy path.** R8's fix could easily have "worked" by muting the alarm — that would have traded a
  false positive for a false negative and quietly destroyed A1's premise. It didn't: the alarm is
  **silent where it should be and still loud where it must be**, including at the exact one-line
  boundary the new guard sits on. R9's fix likewise holds where it matters — not just "1 block" but
  **"a rules correction can reach a CRLF file again"**, which is the actual guarantee brief 31 exists
  to provide.
- **Zero regressions across all 10 prior guarantees.** Nothing that rounds 1-2 certified has moved.
- **The two round-3 findings are both low, and neither is a new class.** R12 is the un-closed half of an
  existing low finding (R10), unreachable from anything fkit writes. R13 is a hardening nit whose threat
  model dissolves on contact with the fact that the path lives in the owner's own project root. **Neither
  is worth a round.** Fold R12's one-liner in **only if** the file is opened for another reason.
- **Both reviewers earned their keep for a third time, and the split is instructive.** Codex confirmed
  the three fixes by inspection and found R13 (which I'd have missed); **I found R12 — and only because
  I drove the real script.** In an isolated subshell R12 never fires (0/12); through `fkit-claude-init.sh`
  it fires **5/5**. A unit-style check would have certified that pipe clean. That is the whole argument
  for an empirical pass, and it is why I do not accept "fixed" on a coder's say-so — **including a claim
  as reasonable-sounding as "replaced both pipes"**, which was true and still left the bug in.
- **Codex re-litigated nothing this round.** The ledger's priming held.

### The one thing that is not converged, and it is not code

**⛔ R7. `claude/scaffold/universal-rules.md` is still untracked.** Re-verified this round. The coder is
right that it is not theirs to close, and right not to commit unprompted. **A release cut without this
file hard-`exit 1`s init for every user, on every launch, and `install.sh`'s fetch sanity-gate checks
only `fkit-claude.sh`, so it will not catch it.** This is now **the only thing standing between this
change and done** — and it is a `git add`, not a code change.

**The verdict is a recommendation, not an authorization. No code was changed by this review, in any of
the three rounds.**

---

## Closeout — the owner has ruled. This review is CLOSED.

**All 13 findings are dispositioned. There is no round 4.**

| Disposition | Findings |
|---|---|
| ✅ **Fixed** (each independently re-run by me; none taken on trust) | R1, R2, R3, R4, R5, R6, R8, R9, R10, **R12** |
| ✅ **Resolved by owner** (commit authorized) | **R7** — ⚠️ *authorized, not yet executed. See the standing gate.* |
| 🤝 **Accepted residual** (owner ruling — do not re-litigate) | **A1** (loud overwrite in a fence) · **A2** (tag spoof, silent — **carve-out intact**) |
| ❌ **Won't fix** (owner ruling — threat model, not mechanism) | **R13** |
| ↪️ **Routed** (out of scope for this diff; architect owns it) | **ADR-016 `:214` "Codex finally gets a floor"** — amendment in flight, decision unchanged |

### What this review actually bought, and it is worth naming once

**The empirical pass is the whole argument.** Three separate times, a claim that was reasonable, made in
good faith, and *wrong* only fell over when the real script was driven:

- **Round 2 — R8.** The greenfield false alarm existed *because* `sed -n '3,2p'` prints the start line.
  No amount of reading the code says that; running it does.
- **Round 3 — R12.** *"I replaced both pipes"* was **true and still left the bug in** — R10 had two
  **sites**, not two pipes. In an isolated subshell R12 never fires (**0/12**); through the real
  `fkit-claude-init.sh` it fires **5/5**. **A unit-style check would have certified that pipe clean.**
- **Closeout — R7.** The owner **approved** the commit and the coder reported the gate closing. The file
  is still `??`. **An approval is not a `git add`**, and this review does not mark a release gate closed
  on an intention.

That is why "fixed" is never accepted on say-so here — **including from a coder who was right about
everything else in the round.**

### Both reviewers earned their keep, all three rounds — and the split is the point

Codex found **R8** (the `sed` start>end behavior), the **`:135` SIGPIPE abort**, and **R13**; I'd have
missed all three. I found **R1's prose repro** (and that **Codex's own suggested fix was a half-fix** that
would have closed it while leaving the fenced case open), the **`:160` SIGPIPE**, the **tag spoof**, and
**R12**. **Neither pass alone gives you this review.** Codex also produced exactly one clean
re-litigation (the fenced case, suppressed) — which is the noise this ledger exists to absorb, and it did.

### ⛔ The single thing standing between this change and done

**`git add claude/scaffold/universal-rules.md`.** Owner-authorized; **not yet done** (verified `??` at
closeout). Until `git ls-files --error-unmatch claude/scaffold/universal-rules.md` **succeeds**, a release
cut hard-`exit 1`s init for **every user, on every launch** — and `install.sh`'s fetch sanity-gate checks
only `fkit-claude.sh`, so **it will not catch it.**

**Status: CLOSED. No code was changed by this review, in any round, at any point.**
