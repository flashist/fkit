# Review — build-deterministic-dashboard-script-for-fkit-status

Task: `ai-agents/tasks/backlog/build-deterministic-dashboard-script-for-fkit-status.md`
File(s) under review:
- `claude/skills/fkit-status/dashboard.sh` (new)
- `claude/skills/fkit-status/SKILL.md` (modified)
- `test/dashboard-contract.test.js` (new)

Spec: `ai-agents/knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md`
ADR: `ai-agents/knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md`
Status: **closed-out** · Rounds 1-6 · **Coverage: full** (own pass + model-diverse Codex pass, codex-cli
0.144.4) — Codex executed against a scratch copy for the **third** round running. Two carried gaps
remain (bash 3.2-vs-5.x; the LLM-side half), both **environment blockers, not review items** — and
round 6 adds a **third**: `grep` on this host is `ugrep`, not BSD grep (see R56).

> ## Round 6 verdict: ⚠️ **Changes requested — 9 defects (0 high). NONE live, NONE blocking, ZERO regressions, zero re-litigation (6th round). And the convergence call is: CLOSE IT.**
>
> **The coder asked me to call this plainly, so here it is: this is a closeout round, and the parser
> class should not be patched again.** Not because the findings are wrong — 9 are real, verified and
> reproduce end-to-end — but because **they are a converging series, and the series is now measurable.**
> Trace the input each round required: **R1** needed a bare prose mention (**live — it fired on the
> coder's own brief**). **R47** needed a single-backtick span (**plausible**). Round 6 needs a
> **double-backtick** span (R54), a span **crossing lines** (R60), a **stray unmatched** backtick on the
> declaration's own line (R58), `**` **inside a span value** (R59), a `~~~` **inside a ``` fence** (R55),
> or a **pseudo-closing fence with trailing text** (R61). **Zero of those shapes occur in any of the 53
> briefs, and 5 of the 6 have no reason to be written at all.** The frontier is moving one step out per
> round, and the step is getting cheaper for me to find and more expensive for the coder to close.
>
> **The Codex pass named the root cause, independently of me, and it is right — so I am adopting it as
> the call:** `maskspans()` + `F[NR]` are **a hand-rolled, per-line approximation of CommonMark
> inline-span and fenced-block parsing**, and *"patching six cases leaves the seventh."* **The class is
> unbounded because it is CommonMark-in-awk.** R46/R47/R48 did not close rule 5; they made it *narrower
> to escape*. **You do not close this by patching — you close it by deciding it, and the decision is
> already on the owner's desk: R45's escalation.** ⚠️ **That escalation now governs 8 findings, not 1.**
>
> **Two things I must say against the coder's own round-5 report, both verified by grep and execution
> rather than by reading intent:**
> - **R51 did not land as recorded.** The action says *"**One** `STATUS_HEADING_RE`, used by all three
>   call sites."* It has **two** consumers; **`:128` still hardcodes the literal**. And the mirror is not
>   merely cosmetic — **BSD grep and awk genuinely disagree on `[ \t]`**, so **the guard still rejects
>   (`die`) a `## Status<TAB>` heading the parser accepts.** That is R51's own defect — the guard and the
>   parser being two grammars — **still open, in R51's fix** (**R56**).
> - **R50 is marked `✅ done` and its second half is not done** (**R57**). R50 named two things; the
>   action fixed one. `SKILL.md:237` still reads *"has drifted from it **three** times"* — the count is
>   now **six**. **R49 was verified by grep; R50's second half was not.** The discipline was applied to
>   the finding that named it, not to the class it belonged to — **which is the sentence this ledger has
>   now written six times.**
>
> **And two things firmly in the coder's favour, which matter more than the nine:**
> - **The round-5 fixes are real and I proved it with controls, not assertions.** Single-backtick span →
>   `task 42.` (**R47 fixed**); closed fence → `task 42.` (**R48 fixed**); `grep -c 'rule 1'` → **1**
>   (**R49 genuinely fixed, and verified the way the coder promised**); both exact-stdout pins pass, and
>   **the LOUD-path pin really does pin `form="BL"` in full** (**R53 fixed**). **7/7 landed.**
> - **The owner's external edit is the best evidence in this review.** The owner added tasks **42 and 43**
>   (41→43, backlog 7→9) with briefs **the coder never saw**. The script parses **both** correctly —
>   including a **wrapped BL declaration** (`implement-…:85`) whose join is exactly R28's fix — and
>   renders `— of 43`, **sum = M**, **zero drift**. **A live, blind, externally-authored regression test,
>   passed.** sprint-1 holds at `— of 14`, sum = M. 106/106 green ×2 runs, byte-identical stdout.
>
> **Nothing here is live, nothing is blocking, and R62 — the only SILENT finding — is not even this
> diff's:** `9c2fe22` produces the byte-identical phantom. **My recommendation: fix R56 and R57 (cheap,
> and both are ledger-integrity, not parser), record R54/R55/R58–R62 as one accepted residual naming the
> class, and close.** The alternative — a seventh round of CommonMark-in-awk — is the frontier, not the
> defect.

<details>
<summary><strong>Round 5 verdict (superseded — kept for the record)</strong></summary>

> ## Round 5 verdict: ⚠️ **Changes requested — 9 defects (1 high). NONE live, NONE blocking, zero regressions, zero re-litigation (5th round).**
>
> **The class fix landed. I predicted round 5 would be a closeout if (1)+(2)+(3) landed; they landed,
> and it is still not a closeout — so I say that plainly, because the coder asked me to.** All three
> are verified by execution: the second grammar **is** deleted (`depends_mentioned` is gone; nothing
> else pattern-matches the field); the fallback **is** gated on existence, not emptiness; the negative
> axis **exists** (8 negative tests, 99/99 green). **All four round-4 highs are genuinely closed** —
> R37 (prose loses to both S and B), R38 (sub-bullets joined, both tasks kept), R39 (all 3 plain
> colonless live briefs parse), R40 (`## Depends on.`) — and R41's admission window holds against every
> door I could find. **7/7 code fixes landed. Live sprint-2 is correct** (`— of 41`, sum = M, zero
> drift, task 36 keeps `tasks 25, 26, 27, 28.`, task 41 keeps `(hard)`), sprint-1 `— of 14`, and
> **`9c2fe22` parity holds on every regression probe I ran.**
>
> **Why it is not a closeout, in one sentence: the class that is closed is not the class that is now
> open.** Rounds 1–4 were all *"which form wins?"* and *"is the guard the same grammar as the parser?"*
> Both are answered. **Round 5's findings are the content of grammar rule 5 — *"A CODE SPAN is prose
> ABOUT the field, never a declaration"* — which no prior finding ever touched.** That principle is
> right; it is implemented as **one narrow regex, `L[i] !~ /`Depends on/`, applied per line**, and it is
> wrong in three directions at once:
> - **Too broad:** a real declaration *sharing a line with* a code-span mention is discarded whole →
>   `none recorded` → **fabricated `ready`** (**R46**, the round's only high — the worst direction).
> - **Too narrow, same line:** the pattern misses `` `**Depends on `` — a **bold code-span EXAMPLE**
>   parses as a real declaration and beats the real one (**R47**, `derive 1 depends="task 77."`).
> - **Blind to block context:** a **fenced code block** is not excluded at all, so an example inside
>   ``` outranks the real declaration and the fence marker leaks into the sentinel (**R48**,
>   `derive 1 depends="task 99; ```"`).
> - And the discriminator has **no opinion about bold prose at all**: `The **Depends on:** field is free
>   text` beats the real `- **Depends on: task 42.**` (**R45**).
>
> **The one-grammar discipline was applied to `depends_raw` and nowhere else.** The script's own rule —
> *"THERE IS ONE GRAMMAR… Do not reintroduce a second pattern anywhere"* (`:263-268`) — is violated in
> the sibling function: **"is this the `## Status` section?" has THREE implementations** — prefix at
> `:85`, prefix at `:161`, exact at `:121` (**R51**). That is R39/R40's root cause, alive in
> `extract_rows`, found by the Codex pass.
>
> **One finding is mine to state bluntly: R43 is marked `✅ done` and is not done.** The round-4 action
> reads *"The mirror text now names **rule 1**, not 'the moved-row rule'."* `SKILL.md:231` still reads
> *"the moved-row rule could not be applied"*, and `grep -c 'rule 1' SKILL.md` returns **0** (**R49**).
> **R43 was itself the finding that R22(b) was marked done while unfixed — so this is R43's own class,
> recurring on R43.** The mirror residual has now cashed **five** consecutive rounds (R9→R22→R32→R43→R49).
>
> **Nothing here is live and nothing is a regression.** Every one of R45–R48 needs a brief that both
> *discusses* the declaration format and *declares* — 0 of 41 briefs do. That is why this is
> Changes-requested and not Blocked, and why the honest question in the convergence call is **"is more
> parser hardening worth it, or has the free-text residual's deferred convention change become the
> cheaper answer?"** — which is the owner's, not mine.

<details>
<summary><strong>Round 4 verdict (superseded — kept for the record)</strong></summary>

> ## Round 4 verdict: 🛑 **Blocked — 8 confirmed defects (4 high). Zero regressions. Zero re-litigation, fourth round running.**
>
> **The round-3 method change worked, and the trajectory is real — say that first, because it is the
> most important fact in this round.** The rewrite is a genuine improvement, not a lateral move:
> **live sprint-2 is correct** (`— of 41`, `34 done · 7 backlog`, sum = M, **zero drift**), **task 41
> keeps `(hard)`**, **task 36 keeps its full fan-in** (`tasks 25, 26, 27, 28.` — the `index()` anchor
> holds), **88/88 green**, and every coder claim reproduces exactly. I executed the whole well-formed
> surface — wrapped BI, last-line declarations, section fan-ins with pipes and sub-bullets, two
> adjacent declarations, code-span prose, English prose — and **it is clean**. R27, R28, R31's prose
> half, R32, R33, R34 and R36 all genuinely landed. **The matrix earned itself exactly as the coder
> reports.**
>
> **The remaining defects are all in one place, and the matrix has no axis for it.** R36's matrix is
> {4 forms} × {wrapped · fan-in · pipe · double-declaration} — **every cell of it is a WELL-FORMED
> declaration.** All four highs live in the dimension the matrix does not have: **the malformed,
> ambiguous and near-miss shapes, where the loud fallback is supposed to catch what the parser
> cannot.** The matrix fixed *"fixtures derived from the implementation"*; **it has no negative
> space** — no axis for *"shapes that must NOT parse"* or *"shapes the fallback must catch."*
>
> **The class, stated once — all four highs are one defect wearing four hats:**
> **`depends_mentioned` (`:304`) is a SECOND, NARROWER GRAMMAR than the closed one `depends_raw`
> documents, and the loud fallback is gated on `depends_raw` returning EMPTY rather than on the parser
> being CONFIDENT.** Everything follows:
> - Parser returns **non-empty but WRONG** → fallback never consulted → **plausible sentinel, silent
>   drop** (**R38**: `⟨derive: hard prerequisites:⟩`, tasks 12/13 gone; **R37**: prose beats the
>   declaration).
> - Parser returns **empty** but `depends_mentioned` **doesn't recognise the form the grammar itself
>   names** → **`none recorded` → `ready`, absence fabricated** (**R39**: plain colonless; **R40**:
>   `## Depends on.`).
>
> **Two findings say a fix marked `✅ done` is not done, and both are mine to say plainly:**
> - **R30** — the action claims *"bold/section are located before it."* **They are not.** Rules gate on
>   `!form`; awk runs **per line in file order**, so the first **LINE** wins, never the first **FORM**.
>   The colon and code-span thirds of that fix are real and verified; the **ordering** third — R30's
>   actual mechanism — was never touched.
> - **R22(b)** — R22 is marked `✅ done`, but the recorded action addresses only **(a)**, the roll-up
>   arm. The mirror still tells the narrator the **moved-row rule** broke when the affected rule is
>   **rule 1 on non-moved rows** (**R43**, verified: the moved row renders `in Sprint 10`, zero drift).
>
> **On the coder's two owner-question answers: both defaults are RIGHT and I would not override either
> — but neither is safe as shipped.** **R31 → (a)** is sound; the **implementation ships (b)**, the
> option its own rationale rejects by name, for the plain colonless form — **which is what 3 of the 4
> briefs it cites actually use** (only 1 of the 4 is bold; **R39**). **R33 → (a)** is a genuinely good
> piece of reasoning and correctly scoped — but its safety is **entirely conditional on the parser
> failing loudly**, and R38/R39/R40 are three proven ways it fails *silently*, where the sanctioned
> exception never fires because the sentinel never says `UNPARSEABLE`.
>
> **Nothing is live.** Every finding is a plausible-input defect, not a broken board today. That is why
> this is Blocked-on-class, not Blocked-on-fire — and why **one structural fix closes all four highs.**

<details>
<summary><strong>Round 3 verdict (superseded — kept for the record)</strong></summary>

> ## Round 3 verdict: 🛑 **Blocked — 10 confirmed defects (3 high), 2 of them regressions against `9c2fe22`.**
>
> **This is still not a loop — zero findings re-litigate an accepted residual, for the third round
> running.** Round 2's ten fixes were verified by execution: **R18, R21, R22, R24, R25 and R26 hold
> cleanly**, and R18's revert is exactly right — a `🚧 Blocked` cell with no em-dash against a `✅ Done`
> brief in `done/` now emits **both** the nonconformance **and** the real disagreement, with the
> `waiting on owner` override intact. R3 and R5 did **not** re-open. Live sprint-2 is clean: `— of 41`,
> zero drift, all 7 sentinels full-length. The coder's reported numbers all reproduce (73/73 green).
>
> **But the class fixes introduced new members of the very classes they closed.** Round 2's diagnosis
> ("each fix closed the instance, not the class") was accepted and acted on in good faith — and the
> rewrites are where round 3's defects live:
> - **R20's truncation class now has *two more* truncators** — and one is **live on task 41 today**.
>   `**Depends on:** [spec] ⏎ **(hard).**` (`:79-80`, the task under review) → the sentinel drops
>   `(hard)`. The wrap-join (`:233`) can never fire for the `**Depends on:**` form, because
>   `**Depends on:**` *itself* satisfies its completion regex (**R28**). And the `## Depends on` branch
>   added for R19 prints its first line and exits, so a fan-in loses every item after the first
>   (**R27**). **R20's own sentence — "`task 99` is gone and the board will read `after 11`" —
>   reproduces verbatim, in R20's own fix.**
> - **R2/R17's `M = the table's row count` is broken in the *opposite* direction** (**R29**), and it is
>   a **regression**: R17 widened admission from `^\|` to *any line containing a pipe*, and blank lines
>   never ended the table — so prose after the table becomes a **phantom task**. `— of 2` for a 1-row
>   table at exit 0, with a task id `3` **invented out of the prose**. `9c2fe22` printed `— of 1`.
> - **R1's location class is re-opened** (**R30**) by the plain branch added for R19: prose
>   `Depends on:` earlier in the brief beats both the real declaration *and* the new `## Depends on`
>   section.
>
> **The architecture is still sound and the invariants are still the right ones.** The failure is not
> analysis, it is **fixture selection** — and it is now a measurable pattern (**R36**): test `:704` is
> live task 41's declaration **flattened onto one line**, and flattening it is precisely what hides
> R28. Every new fixture contains the shape that works. **The remedy for `depends_raw` is not another
> instance fix — it is one code path and a fixture matrix.** See the convergence call.

<details>
<summary><strong>Round 2 verdict (superseded — kept for the record)</strong></summary>

> ## Round 2 verdict: 🛑 **Blocked — 9 confirmed defects (4 high) + 1 frontier-move.**
>
> **This is not a loop.** Zero findings re-litigate an accepted residual. **15/15 round-1 fixes were
> verified by execution and 11 hold cleanly** — R3, R5, R7, R8, R9, R10, R13, R14, R16 are genuinely
> fixed, and the `die()` path, the `⟦FACTS⟧` grammar sync and the exact-stdout pin are real work.
>
> But **four of the round-1 fixes did not close their defect, and one introduced a regression**:
> - **R2 is not closed** (R17). `M` is *still* "rows the parser admitted". The `NF<5` door is shut;
>   **two others are open** — an empty Status cell and a row without a leading `|`. A 3-row table
>   still renders `— of 2` at exit 0.
> - **R1's fix re-created R1's class** (R19). The bold anchor misses the **repo's own prescribed
>   declaration form** (`fkit-task-plan/SKILL.md:70`), so a conforming brief silently yields
>   `none recorded` → `SKILL.md:182` → **`ready`**. R1 produced *visible garbage*; this produces a
>   *plausible lie*.
> - **R4's fix removed the cap but not the truncation** (R20). `grep -m1` is line-based: a wrapped
>   declaration still drops `task 99` — and the old `…` truncation signal is now gone.
> - **R3/R5's fix over-corrected** (R18). Nonconformance now suppresses *genuine* disagreement
>   detection, not just the override. A missing em-dash hides a real plan/brief/location conflict.
> - **R12's fix is a live regression** (R21). Rows that were clean at `9c2fe22` now emit false drift.
>
> The **architecture remains sound** and the round-1 diagnosis was right. The pattern in R17/R19/R20 is
> singular and worth naming: **each fix closed the instance the finding named, not the class it
> belonged to.**

</details>

</details>

</details>

</details>

**Scope note — round 6.** The coder's scope claim is **accurate on the three files under review**,
verified independently before reading any code: `HEAD == 9c2fe22`, nothing committed, and the working
tree carries exactly `sprint-2.md`, `SKILL.md`, `dashboard.sh`, `dashboard-contract.test.js` plus this
untracked ledger. **Five consecutive rounds of accurate scope claims.** `dashboard.sh` sha256 is
unchanged from the start of this review to the end — **the Codex scratch copy never wrote back.**
**Two corrections, neither a finding:** (1) the claim says *"three files + the untracked ledger"*; there
are **two further untracked files** — `implement-pretooluse-skill-ownership-hook.md` and
`record-pretooluse-skill-gate-adr-amendment.md`. They are **the owner's**, not drift: they are tasks
**42 and 43**, and they are exactly what the owner's `— of 41 → — of 43` / `7 → 9 backlog` sprint edit
records. **The coder is right that the sprint-2 edit is external, and I verified the script agrees with
it: sum = M, zero drift.** (2) sprint-1 lives at `ai-agents/sprints/done/sprint-1.md`, not
`sprints/`; my first probe's exit 1 was **my bad path, not a regression** — from the correct path it is
`— of 14`, sum = M, exit 0.

**Scope note — round 5.** The coder's scope claim is **accurate**, verified independently before
reading any code: `HEAD == 9c2fe22`, and `git status` shows exactly the three modified files under
review plus this untracked ledger. Nothing is committed. **Four consecutive rounds of accurate scope
claims.** The Codex scratch copy never wrote back: `dashboard.sh` in the scratch tree is byte-identical
to the working tree (sha256 verified before and after), and `git status` is unchanged from the start of
this review. *(One correction to this ledger's own header, not a finding: it lists `dashboard.sh` and
`test/dashboard-contract.test.js` as **(new)**. Both exist at `9c2fe22` and are **modified** — I diffed
against the real `9c2fe22` copies for every regression probe below.)*

**Scope note — round 4.** The coder's scope claim is **accurate**, verified independently before
reading any code: `HEAD == 9c2fe22`, and `git status` shows exactly the three modified files under
review plus this untracked ledger. Nothing is committed. **Three consecutive rounds of accurate scope
claims.** I also confirmed the Codex sandbox copy never wrote back: `dashboard.sh` in the scratch tree
is byte-identical to the working tree, and `git status` is unchanged from the start of this review.

**Scope note — round 3.** The coder's scope claim is **accurate again**, verified independently before
reading any code: `HEAD == 9c2fe22`, and `git status` shows exactly the three modified files under
review plus this untracked ledger. Nothing is committed. Two rounds of accurate scope claims now.

**Scope note — round 2.** The coder's scope claim is **accurate this round** (round 1's was stale, and
the coder disclosed that unprompted). Verified independently: `HEAD == 9c2fe22`, and `git status` shows
exactly the three modified files under review plus this untracked ledger. Nothing is committed.

### Coverage gaps — carried, not closed

- **bash 3.2-vs-5.x equivalence is STILL unverified.** The coder disclosed this and asked me to
  re-check. **I could not** — this machine has only `/bin/bash` 3.2.57; no bash 5 exists at any of the
  usual paths. `$'\037'` is verified working under 3.2.57 by both passes, and **no bash-5-specific
  construct was found by either pass** — but "no construct found" is not "verified equivalent". This
  gap now has **two rounds of non-verification** on it and needs a bash-5 host, not another reviewer.
- **The LLM-side half remains unverified** — unchanged from round 1, correctly disclaimed by the coder.
  R19 and R21 both land on this seam and are only *survivable* if the LLM behaves as the prose asks.
- **Codex's harness was degraded.** Its read-only sandbox blocked both fixture creation and bash's
  heredoc temp file, so it executed a **`awk`-mutated copy** of the script rather than the real one. I
  therefore **re-verified every Codex finding I report against the unmodified script with real
  on-disk fixtures**; each one reproduced. Coverage is full, but Codex's raw reproductions were not
  trustworthy standalone and are not cited as evidence anywhere below.
- **Round 3 — Codex's harness was degraded AGAIN, differently and worse.** `--sandbox read-only`
  denied temp-file creation, so bash could not build the heredoc at `dashboard.sh:496` and **every**
  invocation died (`cannot create temp file for here document`), emitting `total 0` with zero rows.
  Codex therefore **never observed a single real board** — all six of its findings are **static-read
  reasoning with zero runtime verification**. *(It did not fabricate a workaround this round — an
  improvement on round 2's mutated copy — and it flagged the degradation itself, loudly and
  unprompted.)* **I re-verified all six against the unmodified script with real on-disk fixtures:
  X1–X6 all reproduced, and X1 reproduced as something *worse* than Codex reasoned.** Coverage is
  full **because I executed them, not because Codex did.** No Codex reproduction is cited as evidence
  below.

---

## Reviewer findings        ← reviewer-owned

Provenance: **[both]** = found independently by both passes · **[codex]** = model-diverse pass only ·
**[rev]** = my pass only. Every finding was verified by executing the script against a purpose-built
fixture or the live `sprint-2.md`; severity is mine, not the reporting pass's.

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | **high** | `dashboard.sh:149` **[both]** | `depends_raw` greps `Depends on:` **unanchored, first match anywhere in the brief** — including prose and code spans. **Live on Sprint 2 today:** task 41's sentinel renders `⟨derive: ` line is⟩` (matched brief line 29, a sentence *about* the format; the real declaration is line 79 → **task 40, hard**). Task 40's brief does the same. **2 of 7 live derive rows are wrong.** `SKILL.md:185` forbids re-opening the brief, so the LLM must derive `ready`/`after N` from garbage and the true dependency is invisible — the exact silent-wrong this task exists to eliminate, reproducing **on the task under review**. `field_value` (`:139`) anchors with `$0 == want`; `depends_raw` is the **only** unanchored extractor. Not licensed by §4.2: leaving the dependency *uninterpreted* is not leave to mis-*locate* the field. |
| R2 | 1 | **high** | `dashboard.sh:90` **[codex]** | **The flagship invariant is breakable.** `if (NF < 5) next` **silently drops a malformed row**, so `M` becomes the count of *accepted* rows, not the table's rows — contradicting §5.1 (*"`M` = row count"*) and §9 (*"counts sum to M by construction"*). Verified: a **3-row** table with one malformed row exits **0** and prints `2 done  —  of 2` — the row vanishes with **no row, no fact, no warning**. `sum = M` is preserved only by redefining `M`. The failure the whole task was built to prevent (a task silently absent from the board) is live through a different door. |
| R3 | 1 | **high** | `dashboard.sh:289-291,330` **[codex]** | **The §9-protected disagreement/nonconformance split leaks.** An out-of-vocabulary marker sets `nonconf`, but rule 3 **also** fires (the brief's legitimate marker ≠ `unknown`) and sets `disagree` — so the row takes the `waiting on owner` override that §4.2 says nonconformance must **not** take. Verified: a `WIP` row emits **both** facts and renders `waiting on owner`. Structural, not incidental: an unknown plan marker can never equal the brief's key, so rule 3 fires **every** time. Test `:313` asserts only the fact and the sum — it **never pins the next step**, so this is green today. |
| R4 | 1 | **high** | `dashboard.sh:155-164` **[both]** | The sentinel's **72-byte truncation silently drops dependencies**. Proven: `Depends on: task 11 (…95 chars…), and also task 99.` → `⟨derive: task 11 (the scaffold extraction, which must land first and be verified…⟩` — **task 99 is gone**, and the report reads `after 11`. `SKILL.md:187` orders "name **every** task in a fan-in"; `:185` forbids re-opening the brief — **the LLM is instructed to do what the sentinel makes impossible, with no sanctioned recovery.** The cap is **nowhere in the spec**, which says the sentinel carries the **raw** text (§4.2). 4 of 7 live derive rows are already truncated (none currently loses a task number — luck, not design). |
| R5 | 1 | medium | `dashboard.sh:270,316` **[both]** | `marker_key` **conflates *absent* with *unrecognized*** — `marker_key ""` returns `unknown`, never empty, so the `[ -n "$b_key" ]` guard at `:316` is **inert** and its evident intent is defeated. A brief with **no `## Status`** yields `drift disagreement <t> plan="✅ Done" brief="" location="done/"` + a false `waiting on owner`. `SKILL.md:88` defines disagreement as "the sources say different things"; an absent source says nothing. **Live corroboration:** `ai-agents/tasks/backlog/gate-read-side-symlink-hazard-in-init.md` has no `## Status` heading today — currently unsprinted, **one plan edit from going live**. Shares a root cause with R3: `unknown` is one sentinel for three distinct conditions (absent · unparseable · outside-the-six), then compared for equality. |
| R6 | 1 | medium | `dashboard.sh:305` **[codex]** | Rule 2's moved-target check requires `[ -n "$b_sprint" ]`, so a `➡️ Moved` brief with **no `## Sprint`** skips the check entirely and renders `in Sprint 2` **as if correctly moved**. Verified: zero drift facts. An unresolvable state is reported as clean — the fail-silent direction, on §5.2 rule 2. |
| R7 | 1 | medium | `dashboard.sh:213` **[codex]** | `IFS="$(printf '\t')" read` **collapses consecutive tabs** — tab is IFS whitespace, so empty fields don't hold position. Verified: a row with an empty Task cell shifts the brief link **left into the Task column**, empties Filename, and emits a phantom `drift missing-brief 1 linked=""`. The board is visibly corrupted and a false drift fact reaches beat 6. |
| R8 | 1 | medium | `dashboard.sh:71,310` **[rev]** | **Drift rule 1 is silently disabled when the plan's H1 doesn't parse as `# Sprint N`.** `PLAN_SPRINT` → empty; `:310`'s `[ -n "$PLAN_SPRINT" ]` then falls through to the rule-3 cross-check for **every** row. Proven — identical inputs, only the H1 differs: `# Hardening — the launcher sprint` → phantom `drift disagreement` + `waiting on owner`; `# Sprint 6 — Hardening` → correctly no drift. **Fails silently toward *more* drift** — precisely the *"flag every moved row of every closed sprint forever, and hand the owner phantom decisions"* §5.2r1 exists to prevent. Every live plan happens to match; the assumption is never validated and `PLAN_SPRINT=""` is never reported. |
| R9 | 1 | medium | `SKILL.md:200` vs `dashboard.sh:307` **[both]** | The script emits **two** `drift disagreement` shapes — `plan=/brief=/location=` (`:320`) and `plan=/brief_sprint=/moved_target=` (`:307`, the rule-2 moved-target case). `SKILL.md:200` documents **only the first**, and tells the producer that literal copy **is** its parse contract. Test `:165` asserts the second, so the script is intentional and **SKILL.md is out of sync on delivery** — on spec §7 case 6, one of the three the spec says "matter most". The §6/§8-OQ1 mirror debt, cashing in on day one. |
| R10 | 1 | medium | `test/dashboard-contract.test.js` **[codex]** | **§7 mandates "Assert *exact stdout*"; no test does.** 0 of 46 assertions compare full stdout — all use row counts, regexes and substring `.includes()`. Nothing pins task text, filename rendering, fact ordering, or **the absence of extra records**. This is *why* R2, R3 and R7 are green. (Corrects my own first-pass read that the suite was rigorous: it is rigorous in **intent and reasoning** — the assertion **style** is what let three defects through.) |
| R11 | 1 | medium | `test/dashboard-contract.test.js:283-294` **[codex]** | §7 case 12 ("trimmed to **first clause**") is **nominal only**: the fixture is a single 400-char token with no clause boundary, asserting merely `row.length < 400` and the presence of `…`. It would pass against **any** truncation whatsoever — and it blesses R12. |
| R12 | 1 | medium | `dashboard.sh:169-186` **[codex]** | `one_line_cell` truncates at a fixed **120 bytes on a word boundary**; its own comment and §7 case 12 say **"first clause"**. A 3-clause 100-char cell passes through untrimmed; a 130-char single clause is cut mid-clause. Implementation and stated contract disagree. |
| R13 | 1 | low | `SKILL.md:58` **[rev]** | Step 1 still primes the re-derivation step 2 forbids: *"Note each brief's `## Sprint` field too — **step 2 needs it**."* Step 2 no longer needs it — the script computes the cross-check and `:82` says "don't re-derive". Stale rationale pointing the LLM at exactly the two-accounts-of-one-record failure §4.1 closes. **Answers the coder's point 5: this is the one place left where the LLM could re-derive drift and disagree with its own board.** |
| R14 | 1 | low | `dashboard.sh:74` **[rev]** | `STATUS_SECTIONS=$(grep -c '^## Status' … \|\| echo 0)` — `grep -c` prints `0` **and** exits 1 on no match, so **both** branches emit and the value becomes `"0\n0"`; `[ "$STATUS_SECTIONS" -gt 1 ]` (`:366`) would throw *integer expression expected*. **Currently unreachable** — `:104` dies first — a latent trap that arms itself if the guard order ever changes. The `\|\| echo 0` is not merely redundant, it is wrong. |
| R15 | 1 | low | `dashboard.sh:239` **[codex]** | Any relative link resolving to an existing file is accepted as a brief, with **no check that it lands under `tasks/{backlog,done,cancelled}`**. Verified: `../../secretstuff/x.md` is read and its directory emitted as `location="secretstuff/"`. Read-only, low blast radius, but it widens §5.1's *"reads: the plan; each brief it links"* beyond the tasks tree, and a directory name outside the tree reaches the report. |
| R16 | 1 | nit | `SKILL.md:171,221` **[codex]** | Both say "the six columns"; the board has **five** (`Status \| # \| Task \| Filename \| Next step`, `dashboard.sh:383`), as does spec §1. Likely a bleed from "the six canonical markers" in the same sentence. **`:221` is the fallback path** — it instructs the LLM to hand-build a six-column board. |
| R17 | 2 | **high** | `dashboard.sh:108,252` **[both]** | **R2 IS NOT CLOSED — `sum = M` is still breakable.** The fix shut the `NF<5` door; **two more are open**, both silently dropping a row with no row, no fact, no `MALFORMED`, no warning. (a) `:252` `[ -n "$st" ] \|\| continue` — a row with an **empty Status cell** parses structurally (NF≥5), then is discarded. (b) `:108` `$0 !~ /^\|/ { next }` — a data row **without a leading pipe** is skipped. Verified: a **3-row** table with one empty-status row prints `2 backlog  —  of 2` at **exit 0**; the control (same table, marker present) prints `— of 3`. A 2-row table with one unpiped row prints `— of 1`. `M` remains **"rows the parser admitted"**, exactly as R2 charged. The owner ruled **hard-fail (a)** for a row that fails to parse — these rows fail to parse and do **not** hard-fail, so the ruling is only partially implemented. |
| R18 | 2 | **high** | `dashboard.sh:353` **[both]** | **The R3/R5 fix over-corrected: nonconformance now suppresses *genuine* disagreement DETECTION, not merely the override.** `:353`'s `[ -z "$nonconf" ]` gates the **entire** disagreement block. R3's rationale — *"an out-of-vocabulary plan marker can never equal the brief's key, so rule 3 fires every time"* — is true **only for `unknown-marker`**; for `blocked-without-reason`, `cancelled-without-reason`, `moved-without-target` and `brief-missing-status` the key **is** in vocabulary and the cross-check is meaningful. The script's own comment (`:347-351`) states the *narrow* rationale while the code implements a *broad* gate. **Verified, sources held constant, only the em-dash toggled:** plan `🚧 Blocked` + brief `✅ Done` in `done/` → **only** `nonconformance blocked-without-reason`; the real disagreement is **invisible** and the row renders `⟨derive: none recorded⟩` → `SKILL.md:182` → **`ready`**. Add the em-dash and the identical sources correctly yield `drift disagreement … brief="✅ Done" location="done/"` + `waiting on owner`. **A finished task is reported as ready to start because someone omitted a dash.** Fail-silent, and the mirror image of R3. *(Detection and the override are separable: emitting the fact while withholding `waiting on owner` satisfies both §4.2 and §5.2 — but that is a design call, not mine to make.)* |
| R19 | 2 | **high** | `dashboard.sh:198` vs `fkit-task-plan/SKILL.md:70` **[both]** | **R1's fix re-created R1's class: the bold anchor is too narrow, and the repo's own brief-authoring procedure does not satisfy it.** `fkit-task-plan/SKILL.md:70-71` — the **only** instruction in the repo telling an agent how to record a dependency — prescribes an **unbolded** `` `Depends on:` `` in `## Notes`. `fkit-task-cancelled/SKILL.md:131` independently names **four more** legitimate forms (a `## Depends on` section, `*(blocked: …)*`, a `Depends …` annotation, a `Depends on` table). `depends_raw` matches **exactly one** form — and **nothing generates it**: a `grep` across `claude/skills/` and `claude/agents/` finds **no template mandating the bold form at all**. The 32/32 the coder verified is an **emergent convention of one author, not an enforced contract**. Verified: three briefs declaring the *same* dependency — plan-form, section-form, bold-form — yield `none recorded`, `none recorded`, `task 12`. **Severity is *higher* than R1's, not lower:** R1 emitted visible garbage (`⟨derive: ` line is⟩`) an owner might catch; this emits `none recorded`, which `SKILL.md:182` tells the LLM means *"nobody wrote down a dependency, so there isn't one"* → a confident **`ready`**. **Silent-wrong that looks right beats silent-wrong that looks wrong.** Not covered by the free-text residual, which explicitly carves out *locating* the field. |
| R20 | 2 | **high** | `dashboard.sh:198` **[both]** | **R4's fix removed the cap but not the truncation — and removed the warning.** `grep -m1` is **line-based**, so the sentinel carries the declaration's **first physical line**, not its raw text. Verified: `- **Depends on: task 11 (the scaffold extraction) and⏎  task 99.**` → `derive 1 depends="task 11 (the scaffold extraction) and"` — **task 99 is gone and the board will read `after 11`**: R4's failure mode, verbatim, through a different truncator. **Aggravating:** the old 72-byte cap at least appended `…`; there is now **no truncation signal at all**. **Live on Sprint 2 today, 4 of 7 sentinels truncate** — `derive 28 …"Both are hard"`, `derive 36 …"Task 28 (additive"`, plus 37 and 39. None currently loses a task *number* — **luck, not design**, the same phrasing and the same posture R4 was rated **high** on. The `:193-196` comment (*"NO LENGTH CAP … §4.2 says the sentinel carries the RAW text"*) **overclaims**: it does not. Covered by the residual's *transmitting* carve-out, so not re-litigation. |
| R21 | 2 | medium | `dashboard.sh:217,255` **[both]** | **REGRESSION — the R12 clause trim runs BEFORE semantics and manufactures false drift on rows that were clean at `9c2fe22`.** `:255` `st=$(one_line_cell "$st")` precedes `marker_key`, the `moved_target` extraction **and** the nonconformance checks, so a presentation-layer trim rewrites the **semantic** input. Verified against both trees, identical fixture: `🚧 Blocked. Waiting on the owner — see task 5` and `⛔ Cancelled (2026-07-16). Superseded — see task 9` → **`9c2fe22`: both cells pass through untouched, ZERO drift facts (correct — both record a reason)**; **working tree**: both trimmed at the first `. `, the em-dash is severed, → **two false `drift nonconformance` facts** (`blocked-without-reason`, `cancelled-without-reason`) + a phantom drift clause on both tasks, and the recorded reason is **deleted from the board**. Also over-trims abbreviations (`e.g. ` → `🚧 Blocked — … e.g…`) and severs a `. ` inside a **link title** (`[Sprint 2. Hardening](…)` → `[Sprint 2…`) — so the `:214-216` comment (*"Splitting on `. ` leaves links intact"*) is true only for link **targets**, not **titles**. *Medium not high: it fails **loud** — the `cell="…"` field shows the trim, so the owner gets noise and phantom decisions rather than a hidden truth (contrast R18).* |
| R22 | 2 | medium | `dashboard.sh:427-429,434` + `SKILL.md:215-216` **[codex]** | **`drift unresolved-plan-sprint` is inconsistent with its own contract, two ways.** (a) It is the **only** drift record that never reaches the roll-up's drift clause: `:434` keys off `DRIFT_TASKS`/`STATUS_SECTIONS` only, and `:427-429` appends to neither. Verified: a clean fixture emits `drift unresolved-plan-sprint h1="# Hardening"` while the roll-up prints a bare `1 backlog  —  of 1` — contradicting `SKILL.md:219-222` (*"Every `drift` record is an owner decision → beat 6"*; *"the roll-up already carries a generic drift clause pointing at beat 6"*). (b) `SKILL.md:215-216` **misdescribes the fact**: *"the **moved-row rule** could not be applied"* — but `PLAN_SPRINT` feeds **rule 1** (`:365`, the *non*-moved path); rule 2's moved check compares `moved_target` against `b_sprint` and never reads it. Verified: a moved-only fixture correctly renders `in Sprint 2` **and still emits the fact**. **Meets the mirror residual's re-raise condition** — it changes narration — so it is not suppressed. |
| R23 | 2 | medium | `dashboard.sh:365` **[codex]** | **R8 is fixed only in its "silent" half — the board still guesses.** With `PLAN_SPRINT` unresolved, `:365`'s `[ -n "$PLAN_SPRINT" ]` is false, so rule 1's skip cannot apply and **every row falls through to rule 3** — the exact mechanism R8 described. The new fact makes it **visible**; it does not stop it. Verified: H1 `# Hardening` + non-`sprint-N` filename + a brief claiming another sprint → **both** `drift unresolved-plan-sprint` **and** a phantom `drift disagreement`, rendering `waiting on owner`. **Classified frontier-move, not defect:** with the sprint identity genuinely unknown there is no free option — suppressing the cross-check misses real drift, running it invents phantom drift. Reporting the uncertainty *and* running the check is a defensible point on that tradeoff. Reachable only when **both** the H1 and the filename fail, which no live plan does. **Owner's call, not mine.** |
| R24 | 2 | low | `dashboard.sh:112,132` **[codex]** | **In-band signalling: the `MALFORMED` sentinel collides with legitimate data.** A structurally valid row whose Status cell is literally `MALFORMED` reaches the normal path, prints `MALFORMED␟1␟…`, and the caller's `grep "^MALFORMED␟"` (`:132`) then **hard-fails the whole board** with a nonsense message — verified: `dashboard.sh: unparseable row … (need 4 cells): 1`. It should have reached `unknown-marker`/`unrecognized`. The control record is indistinguishable from the data. Low: nobody writes `MALFORMED` as a status marker — but it is an in-band-signalling smell on the **hard-fail** path the owner just ruled for, and the die message is misleading regardless. |
| R25 | 2 | low | `dashboard.sh:323-324` **[rev]** | `cancelled` nonconformance **mislabels a missing date as a missing reason**. The `A && B \|\| C` chain sets `kind="cancelled-without-reason"` whenever the date **or** the em-dash is absent. Verified: `⛔ Cancelled — superseded by task 9` (reason present, **date** missing) → `kind="cancelled-without-reason"` — the owner is told to supply a reason that is **already in the cell**, and the actual defect is never named. **Pre-existing round-1 code, unchanged by this diff** — round 1 did not examine it; recorded now rather than left. The `cell="…"` field does carry the raw cell, so an attentive narrator can recover. |
| R26 | 2 | low | `dashboard.sh:103,251` **[both]** | A **literal `\x1f`** in any cell silently corrupts field alignment — verified: a Task cell containing US shifts the brief link into Filename and renders a broken board at **exit 0**, with no escaping or rejection anywhere. **Recorded for completeness, not as a live risk:** a US byte is not a realistic authoring accident in a hand-written markdown plan, and the plan is owner/producer-authored under the same trust model the R15 residual rests on. The R7 fix traded a **likely** delimiter collision (tab) for an **implausible** one (US) — that is a good trade, not a defect. |
| R27 | 3 | **high** | `dashboard.sh:217` **[both]** | **The `## Depends on` branch added for R19 re-creates R20 *and* R7/R26: it prints its first non-blank physical line and `exit`s, bypassing BOTH the wrap-join and `print_buf`'s sanitising.** A `## Depends on` section is a **list** form — a fan-in is its normal shape, not an edge case. Verified: `## Depends on ⏎ - task 12 ⏎ - task 99` → `derive 1 depends="- task 12"` — **task 99 is gone and the board reads `after 12`**. The identical fan-in in the inline form correctly yields `task 12 and task 99.` **And nothing is sanitised:** `- **task 12** — the scaffold \| must land first` → the raw `\|` reaches the board and renders a **six-column row at exit 0** (`⟨derive: - **task 12** — the scaffold \| must land first⟩`), with `**` and the list marker unstripped and whitespace unsqueezed. The inline path `gsub`es pipes at `:252`; this path is the only one that does not. `SKILL.md:187` orders the LLM to name **every** task in a fan-in and `:185` forbids re-opening the brief — **the sentinel makes the instruction impossible, with no truncation signal at all.** **0 of 36 live briefs use the section form** — the same posture R19 was rated **high** on, and on R19's own reasoning: `fkit-task-cancelled:131` documents this form, so a conforming brief silently lies. |
| R28 | 3 | **high** | `dashboard.sh:233` **[both]** | **R20 IS NOT CLOSED — and it is LIVE on task 41, the task under review.** `:233`'s completion test `buf ~ /\*\*Depends on:.*\*\*/` is satisfied by the string `**Depends on:**` **itself** (`.*` matching empty), so for the immediate-close form the join emits on its **first physical line** — the one form that most needs joining. The `:243-248` comment correctly identifies the two bold forms as needing "opposite treatment", and then implements that **only in `print_buf`'s prefix-stripping**, while the wrap-join treats them identically. **Verified, live:** `build-deterministic-dashboard-script-for-fkit-status.md:79-80` — `- **Depends on:** [`design-…`](…) ⏎ **(hard).** Do not begin…` → `derive 41 depends="[`design-…`](…)"` — **`(hard)` is dropped; the hardness of the dependency is deleted from the record.** **Verified, fatal:** `- **Depends on:** task 11 and ⏎ task 99.` → `derive 1 depends="task 11 and"` — **task 99 is gone, the board reads `after 11`**: R20's own sentence, verbatim, in R20's own fix, third round. The control form `**Depends on: x.**` joins correctly, which is why this survived. |
| R29 | 3 | **high** | `dashboard.sh:116,112` **[both]** | **REGRESSION — R17's fix broke `M = the table's row count` in the OPPOSITE direction, at exit 0.** R17 widened admission from `$0 !~ /^\|/` to `$0 !~ /\|/` (to admit GFM rows without outer pipes) and **blank lines never end the section** — so **any** later pipe-bearing prose is treated as a data row. Verified, identical fixture, both trees: prose after the table reading `Progress \| 3 done \| 2 backlog \| updated today` → **`9c2fe22`: `1 backlog — of 1`, total 1, clean**; **working tree: `1 backlog · 1 unrecognized — of 2`, total 2** — a **phantom task**, a phantom `unknown-marker`, and a task id **`3` invented out of the prose** ("3 done"). The mirror case is worse in the other direction: prose with **<4** cells (`Ordering note: read the `Status \| Priority` columns together.`) yields an `M` control record and **hard-fails the entire board** (exit 1) where `9c2fe22` rendered it correctly. **`M` is once again not the table's rows** — R2/R17's invariant, opposite sign. The class question the code now states — *"can any line fail to produce a record?"* — has a **twin that was never asked: "can any line produce a record that is not a row?"** |
| R30 | 3 | medium | `dashboard.sh:224` **[rev]** | **R1's mechanism is re-opened by the plain branch added for R19, and it defeats R19's own section branch.** `:224`'s `/(^\|[^`*])Depends on:/ && !/`Depends on:/` excludes **code spans only** — plain prose is matched, unanchored, first-hit-wins. Verified: a brief with `## Context ⏎ The Depends on: field is free text, per the design.` and a later `## Depends on ⏎ task 42` → `⟨derive: field is free text, per the design.⟩` — **task 42 is invisible**, and the *documented section form loses to prose*. This is R1's live symptom (`⟨derive: ` line is⟩`) with new wording. The two branches have **no ordering priority**: the inline match sets `found` and the join emits at the next blank line, before the section is ever reached. **Not live** — 0 of 36 briefs carry a plain-prose `Depends on:` (R1 itself *was* live, which is why it was high). The class oscillates: R1 too broad → R19 too narrow → **too broad again**. |
| R31 | 3 | medium | `dashboard.sh:264` **[both]** | **`depends_mentioned`'s `grep -qi 'depends on'` manufactures false drift — and the repo's own briefs trip it.** The grep is case-insensitive and **requires no colon**, while `depends_raw` **requires one**. Verified: a brief with no dependency whose prose reads `Scope depends on what the owner decides.` → `⟨derive: UNPARSEABLE — see brief⟩` + `drift depends-unparseable 1` + a **phantom owner decision** in the roll-up; the control (same brief, phrase removed) correctly yields `none recorded`. **Live: 4 briefs write `Depends on nothing.` / `Depends on nothing else in this sprint.` — an *explicit declaration that there is no dependency*, which this reports as an UNPARSEABLE one.** (`done/build-claude-self-update.md:61`, `done/extract-scaffold-into-claude.md:54`, `done/fix-headless-menu-guard-crash.md:81`, `cancelled/add-ci-validate-bundles.md:53`.) **Masked today only by accident** — all four are `done`/`cancelled`, and those rows take `closed`/`dead` before reaching the depends branch; one such brief in `backlog` and the board emits false drift. The colon is the entire difference: `**Depends on: nothing.**` → `ready`; `Depends on nothing.` → drift. R21's class — drift manufactured out of formatting — **but it fails loud**, hence medium. |
| R32 | 3 | medium | `SKILL.md:206-214` vs `dashboard.sh:392,402,482` **[both]** | **R9's mirror is stale for the third round, and the re-raise condition is MET.** The script emits **7** nonconformance kinds; SKILL.md documents **5** — `cancelled-without-date` (`:392`, added this round for R25) and `missing-status-cell` (`:402`, added this round for R17) are **undocumented**. Worse, **`drift depends-unparseable` (`:482`) — an entire new drift *record kind*, added this round for R19 — appears nowhere in the grammar at all.** `SKILL.md:219` tells the narrator *"Every `drift` record is an owner decision → beat 6"*, and beat 6 must narrate a record the grammar does not list. The mirror residual's re-raise condition is *"the mirror drifts in a way that changes narration"* — **met**, exactly as it was for R9 and R22. **Not re-litigation: this is the residual's own escape hatch firing.** The debt is now cashing every single round; that is data about the residual, not about the coder. |
| R33 | 3 | medium | `SKILL.md:176-189` vs `dashboard.sh:481` **[both]** | **`⟨derive: UNPARSEABLE — see brief⟩` has no compliant narration path — the new loud fallback contradicts three of SKILL.md's own instructions at once.** The derive table documents exactly **two** cell forms (`none recorded` → `ready`; `task 26 and task 27.` → `after 26, 27`); this is an undocumented third. SKILL.md then says (a) *"**Use the text inside the sentinel. Do not re-open the brief**"* — but the text's only content **is** *"see brief"*; (b) the sentinel table permits only `ready`/`after N` as replacements, and neither is true; (c) *"**A sentinel left in a delivered report is a bug**"* — so the LLM **must** replace it, with nothing sanctioned to replace it with. Every available action violates an instruction. R19's fix correctly refuses to invent an *absence* — and then hands the LLM a cell it has no lawful way to render. Lands squarely on the **unverified LLM seam**; not reachable by the suite as scoped (ADR-017 rule 4). |
| R34 | 3 | medium | `dashboard.sh:120` **[codex]** | **A GFM-escaped pipe `\|` in the Status cell shifts every field and manufactures a false `waiting on owner`.** `split(line, cell, "\|")` is unaware of `\|`, which is **the GFM-correct way to write a literal pipe in a cell**. Verified: `\| 🚧 Blocked — `left \\\| right` fails \| 1 \| Alpha \| [`alpha.md`](…) \|` → the board renders a **six-column row** (`🚧 Blocked — `left \ \| right` fails`), `tid` collapses to **`?`**, the Priority cell becomes `right` fails`, and the row emits a **phantom `drift disagreement ? plan="🚧 Blocked — `left \" brief="🔲 Backlog" location="backlog/"` + `waiting on owner`** — on a row whose sources **agree**. The `:90-91` comment shows pipes-in-cells were designed for, but only **unescaped** ones in the **Task** column; the escaped form, in the Status column, was not. R7/R26's field-alignment class, third member. Unlike R26's literal `\x1f`, `\|` **is** a realistic authoring choice. |
| R35 | 3 | low | `dashboard.sh:133` **[rev]** | **The header is detected by *content*, not *structure*, so a differently-worded header becomes a task.** `if (st == "Status" && pr == "Priority") next` hardcodes two literals. Verified: a plan whose header reads `\| Status \| # \| Task \| Brief \|` → the **header row is rendered as a task**, `— of 2` for a **1-row** table, a phantom `unrecognized`, a phantom `drift missing-brief ?`, and a drift clause reading `drift on tasks ?`. **Severity low, and the coder is largely covered:** design spec `:239` *does* prescribe `Status \| Priority \| Task \| Brief`, and both live plans conform — so this is a robustness gap, not a spec violation. Recorded because `#` is what **SKILL.md:171 and the script's own board header (`:542`) call that column**, so a plan author reconciling the plan to the board's shape writes the one header that breaks it. A structural check (the line immediately before the `\|---\|` separator) needs no literals. |
| R36 | 3 | low | `test/dashboard-contract.test.js:659,684,704` **[rev]** | **The round-2 regression fixtures systematically contain the shape that works — this is *why* R27/R28 shipped green, and it is round 2's fixture-blind-spot diagnosis repeating verbatim.** (a) `:704` — the test for the immediate-close bold form — uses `- **Depends on:** [`other-task`](…) **(hard).**` **on one line**, which is live task 41's declaration (`:79-80`) **flattened**. Verified: one line → `(hard).` **survives**; the same declaration wrapped → `(hard)` **dropped**. **Flattening the fixture is exactly what hides R28.** (b) `:684` — the test for *wrapping*, R20's entire mechanism — exercises the wrap **only on `**Depends on: x.**`**, the form that already works; the failing intersection (immediate-close **×** wrapped) is untested. (c) `:659` — the `## Depends on` section test — uses `\n## Depends on\ntask 7\n`: **one item, no list marker, no pipe**, i.e. the only section shape that survives R27. (d) `:711` asserts `/other-task/`, a substring, so it passes with `(hard)` gone. The ledger already named this in round 2 — *"mutation testing mutates the script, not the fixtures"* — and it recurred. **The fix is a matrix, not more cases:** {bold-immediate-close, bold-content-inside, plain, section} × {wrapped, unwrapped} × {single, fan-in} × {pipe, no pipe}. |
| R37 | 4 | **high** | `dashboard.sh:263-269` **[both]** | **R30 IS NOT CLOSED — the ordering half was never fixed.** R30's action claims *"bold/section are located before it"*; that is **false**. `depends_raw`'s rules are gated on `!form`, and awk evaluates **per line in file order** — so the first matching **LINE** wins, never the first **FORM**. The colon requirement and the code-span rejection (the other two thirds of the fix) **do** hold and are verified. But R30's own stated mechanism — *"the two branches have no ordering priority"* — is untouched. **Verified, both shapes:** (a) prose `The Depends on: field is free text, per the design.` at `## Context` + a `## Depends on` section listing `task 42` → `⟨derive: field is free text, per the design.⟩`, **task 42 invisible, the documented section form loses to prose**; (b) the same prose + a later `- **Depends on: task 42.**` → **the bold declaration — the repo's dominant live form, 32/32 briefs — also loses to prose.** R1's live symptom, fourth round, verbatim. **Not live** (0 of 41 briefs carry a plain-prose `Depends on:`; task 41's line 29 is a code span and is correctly excluded), which is why it is not critical — same posture and same severity basis as R30. |
| R38 | 4 | **high** | `dashboard.sh:272` **[codex]** | **The loud fallback has a blind spot: a BL label whose first line carries NON-EMPTY text emits a PLAUSIBLE sentinel and silently drops every item.** The join terminator `/^[ \t]*[-*+][ \t]/` treats a nested bullet as end-of-block, so a `**Depends on:**` label followed by an indented list keeps **only the label's own line**. Whether that fails loud or silent depends entirely on whether the label line happens to carry trailing words. **Verified, the two variants side by side:** `- **Depends on:**` ⏎ `  - task 12` ⏎ `  - task 13` → `⟨derive: UNPARSEABLE — see brief⟩` + `drift depends-unparseable` (**loud — correct**); but `- **Depends on:** hard prerequisites:` ⏎ `  - task 12` ⏎ `  - task 13` → **`⟨derive: hard prerequisites:⟩` at exit 0, no drift fact — tasks 12 and 13 are gone and the sentinel looks answerable.** `depends_mentioned` never runs, because it is gated on `depends_raw` returning **empty** rather than on the parser being **confident**. The grammar's own rule 3 (*"OVER-INCLUDE trailing prose rather than guess"*) is inverted here: it under-includes to the label. A label + indented list is a shape a human plainly writes, and the S-form exists precisely because lists are the natural fan-in shape. |
| R39 | 4 | **high** | `dashboard.sh:246-247,267,304` **[rev]** | **R31's fix implements option (b) — the option its own rationale rejects by name — for the form 3 of its 4 cited briefs actually use.** Grammar rule 4 reads *"the colon is OPTIONAL when bold (`**Depends on nothing.**` — 4 live briefs), REQUIRED when plain"*. **The cited evidence does not support the rule: only 1 of those 4 briefs is bold.** Verified by running `depends_raw` against the real files — `cancelled/add-ci-validate-bundles.md:53` (`- Depends on nothing else in this sprint.`) → **empty**; `done/extract-scaffold-into-claude.md:54` (`- Depends on nothing.`) → **empty**; `done/build-claude-self-update.md:61` (`- Depends on nothing, but read …`) → **empty**; only `done/fix-headless-menu-guard-crash.md:81` (`- **Depends on nothing.**`) → `nothing.`. **`depends_mentioned` (`:304`) requires bold-or-colon too, so the plain colonless form escapes the loud fallback as well.** Verified: `- Depends on task 12 and task 99.` → **`⟨derive: none recorded⟩` at exit 0, no drift fact** → `SKILL.md:182` tells the LLM that means *"nobody wrote down a dependency, so there isn't one"* → **`ready` on a task with two real dependencies.** R19's invented-absence, which the ledger rated **high** twice, and which R31's own action text calls *"false-silent, the direction the owner has ruled against twice."* **The (a) DECISION is sound and I would not override it — the implementation simply does not deliver it.** Masked today only because all 3 plain briefs say *"nothing"* and all 3 are `done`/`cancelled` (→ `closed`/`dead` before the depends branch) — the same accident R31 itself was masked by. |
| R40 | 4 | **high** | `dashboard.sh:258,304` **[codex]** | **A near-miss `## Depends on` heading silently fabricates an absence.** The section regex `/^##[ \t]+Depends on[ \t]*$/` is exact-match, and `depends_mentioned` recognises only bold-or-colon — so a heading that *almost* matches escapes **both** the parser and the loud fallback. **Verified:** `## Depends on.` ⏎ `- task 12` → **`⟨derive: none recorded⟩` at exit 0, no drift fact** → `ready`; **task 12 is fabricated out of existence.** Contrast the sibling shape `## Depends on:` (trailing colon), which fails **loud** as `UNPARSEABLE` — purely because the colon happens to satisfy `depends_mentioned`'s *other* grammar. **Whether a near-miss heading fails loud or silent is decided by punctuation the grammar never mentions.** Shares R39's root: `depends_mentioned` is a **second, narrower grammar** than the one `depends_raw` documents, so the R19 fallback does not cover the forms the grammar itself names. |
| R41 | 4 | medium | `dashboard.sh:129-132` **[both]** | **R29's contiguous-block fix closed the instance, not the class — `inTbl` is set ONLY by the separator row, so the block model guards only the region AFTER it.** R29's own case is genuinely fixed (verified control: prose after a well-formed table → `— of 1`, clean, `9c2fe22` parity). Two doors remain, both at exit 0. **(a) Pipe-bearing prose BEFORE the table but after `## Status`:** `Legend: ✅ Done \| 🔲 Backlog \| 🚧 Blocked \| ⛔ Cancelled` above a 1-row table → **`1 backlog · 1 unrecognized — of 2`, `total 2`** — a phantom task and a phantom `unknown-marker`. **(b) A table with NO separator row:** prose after it is admitted → **`— of 2` for a 1-row table, with task id `3` invented out of the prose `3 done`** — **R29's exact symptom, invented id and all, reproducing verbatim.** `M` is once again not the table's rows. **Not live** (both live plans are clean; verified `— of 41` and `— of 14`, sums correct). **Adjacency disclosed, deliberately not suppressed:** the R35 residual concerns *header detection by content*; this is a different mechanism (the *admission window*), and R35's re-raise conditions (*a heading inside the table block, or a caption/preamble convention*) are **not** met — so this is a new door, not a re-raise of R35. Codex argues (b) should hard-fail per the owner's R2 ruling; that is an owner-scope question, below. |
| R42 | 4 | low | `dashboard.sh:131` **[both]** | **A literal `\002` (STX) byte is not neutralised before `unesc()` turns every STX into `\|` — R26's class, one member left open, and R26's closing claim is now false.** `:131` neutralises a literal `\037` (US) — verified working (control: `Al\037pha` → `Al pha`) — but nothing neutralises `\002`, which the same line then *creates* as the parking sentinel for GFM `\|`. **Verified, mine:** a Task cell containing `Al<0x02>pha` renders `Al\|pha` at exit 0 — a control byte silently becomes an escaped pipe. **Verified, Codex's sharper variant:** a plan linking `a<0x02>b.md` (brief present on disk under that exact name) → bytes `61 02 62` become `61 5c 7c 62`, the link is mutated, and the board emits a **fabricated `drift missing-brief 1 linked="../tasks/backlog/a\|b.md"`** on a brief that exists. **Recorded at low, not as a live risk** — a literal STX is not a realistic authoring accident, and the plan is owner/producer-authored under the same trust model R26 and the R15 residual rest on. Recorded because **R26's accepted rationale — *"the cost was one `gsub`, and it removes the only remaining input that corrupts the board at exit 0"* — is no longer true**, and the asymmetry (US neutralised, STX not) is now the only reason the two bytes behave differently. |
| R43 | 4 | low | `SKILL.md:216-217` vs `dashboard.sh:484` **[rev]** | **R22(b) was never fixed, but R22 is marked `✅ done` — the recorded action addresses only (a), the roll-up arm.** R22 was a two-part finding: (a) `unresolved-plan-sprint` never reached the roll-up drift clause — **genuinely fixed, verified**; (b) SKILL.md **misdescribes** the record. The mirror still reads *"the plan has no recoverable `Sprint N` identity, so **the moved-row rule** could not be applied"* — and `PLAN_SPRINT` feeds **rule 1's skip on NON-moved rows** (`:484`), never the moved path (`:473-483` compares `moved_target` against `b_sprint` and never reads `PLAN_SPRINT`). **Verified, purpose-built:** a plan with no recoverable sprint identity carrying a `➡️ Moved` row (target Sprint 10, brief Sprint 10) → the row renders **`in Sprint 10` with ZERO drift — the moved-row rule applied perfectly** — while `drift unresolved-plan-sprint` fires. **The narrator is told the wrong rule broke.** Meets the mirror residual's re-raise condition (*"drifts in a way that changes narration"*) for the **fourth** consecutive round (R9, R22, R32, now R43). **Note for R32's standing instruction:** it covers an **unlisted record kind** — it does **not** cover a **listed record with a wrong description**, which is this. |
| R44 | 4 | low | `dashboard.sh:263-269` **[codex]** | **Two declarations separated by a blank line: the second is silently ignored, with no fact.** `!form` latches on the first match, so once a form is set no later declaration is detected. **Verified:** `- **Depends on: task 12.**` ⏎ (blank) ⏎ `Later constraint:` ⏎ `- **Depends on: task 99.**` → `⟨derive: task 12.⟩` — **task 99 vanishes at exit 0, no drift fact.** **Classified frontier-adjacent, not a plain defect:** first-declaration-wins is the grammar's deliberate rule and the `index()` anchor added this round is **live-validated on task 36**, where the first declaration is the complete list (`tasks 25, 26, 27, 28.`) and the second (`28 (hard).`) is a refinement — selecting the last was R28's bug. So first-wins is **correct where declarations are adjacent** (task 36's shape, which joins into one block). The gap is only the **separated** case, where first-wins is a silent guess between two genuine candidates. **Not live** — no brief carries two separated declarations. The cheap discharge is a fact, not a grammar change. |
| R45 | 5 | medium | `dashboard.sh:320-327` **[rev]** | **The B form has no prose discriminator at all: BOLD PROSE about the field beats the real declaration.** R37 anchored the **P** form to line-start/list-marker so prose is excluded — **the B form got no equivalent, and B outranks P.** Its only exclusion is the code-span regex, which bold prose does not trip. **Verified:** `## Context` ⏎ `The **Depends on:** field is free text, per the design.` + a later `- **Depends on: task 42.**` → **`⟨derive: field is free text, per the design.⟩`** at exit 0 — **task 42 is invisible, and the repo's dominant live form loses to a sentence.** This is R1/R30/R37's locating class, arriving through the one form that was never anchored. **The tension is real and worth stating: B *cannot* be anchored to column 1** — 3 live briefs declare mid-line (`date+reason. **Depends on: nothing…**`, `remove-fkit-omnigent-orphan-residue.md:85`, `task-done-flips-brief-own-status-header.md:82`), and `:226-227` correctly warns against it. **But it is not unfixable and therefore not a frontier:** all 3 live mid-line declarations are preceded by a **sentence boundary or a list marker**, while the prose mention is preceded by `The ` — so a discriminator exists. **Not live** (0 of 41 briefs bold-mention the field in prose), wrong-dependency rather than fabricated-absence → **medium, on R30's exact basis.** |
| R46 | 5 | **high** | `dashboard.sh:321,329` **[both]** | **The code-span guard is LINE-scoped, so a real declaration that SHARES A LINE with a code-span mention is discarded whole → `none recorded` → a FABRICATED `ready`.** `L[i] !~ /`Depends on/` rejects the entire **line**, not the **span**; the loop then finds no other bold line, the P form does not match either, and `depends_raw` emits **nothing** — which the contract defines as *"the brief records no dependency"*. **Verified, both shapes:** (a) `- The `Depends on:` field — **Depends on: task 12.**` → **`derive 1 depends="none recorded"`**; (b) `- Depends on: task 12 — see the `Depends on:` docs.` → **`none recorded`**. Codex's independent variant — a BL declaration whose *trailing prose* code-spans the field (`- **Depends on:** task 9; … `Depends on` field.`) → **`none recorded`** — is the realistic one, because grammar **rule 3 orders the parser to OVER-INCLUDE trailing prose**, so trailing prose is *expected*, and a brief about the declaration format is exactly where it appears. `SKILL.md:182` tells the LLM `none recorded` means *"nobody wrote down a dependency, so there isn't one"* → **`ready` on a task with a real dependency.** **This is the direction the ledger has rated high three times** (R19, R39, R40) and the coder's own contract names: *"a false alarm is visible; a fabricated `ready` is not."* **Not live** (0 of 41), which is why it is high and not critical. |
| R47 | 5 | medium | `dashboard.sh:321` **[codex]** | **The code-span guard misses the BOLD code span, so a documentation EXAMPLE parses as a real declaration.** The pattern is `` /`Depends on/ `` — a literal backtick immediately followed by `Depends on`. The bold example `` `**Depends on: task 77.**` `` puts `**` **between** the backtick and the label, so the guard does not fire, while the B-form regex `/\*\*Depends on[.: ]/` matches happily. **Verified:** `Example syntax: `**Depends on: task 77.**`` + a later real `- **Depends on: task 12.**` → **`derive 1 depends="task 77."`** — **a dependency fabricated out of a code sample, and the real task 12 invisible.** Grammar **rule 5** states exactly the right principle (*"A CODE SPAN is prose ABOUT the field, never a declaration"*); the implementation covers only the unbolded spelling of it. **Not live**, wrong-dependency → medium on R30's basis — but note the sentinel `⟨derive: task 77.⟩` is **plausible**, so the LLM renders a confident `after 77` for a task that may not exist. |
| R48 | 5 | medium | `dashboard.sh:318-334` **[both]** | **A FENCED CODE BLOCK is not excluded from the grammar at all — an example declaration inside ``` outranks the real one, for every form.** `depends_raw` has no fence state; rule 5's principle is implemented only for **inline** spans. **Verified, both forms:** (a) S — ` ``` ` ⏎ `## Depends on` ⏎ `task 99` ⏎ ` ``` ` + a real `- **Depends on: task 12.**` → **`derive 1 depends="task 99; ```"`** — the wrong dependency **and the fence marker itself leaks into the sentinel**, which the LLM must then render as a next step; (b) B — a fenced `- **Depends on: task 999.**` + a real `- **Depends on: task 12.**` → **`derive 1 depends="task 999."`**. **The highest-realism member of this class, and the reason I would not accept the four of them as a residual without the owner seeing this line: 4 of the 41 live briefs already contain BOTH a fenced block AND a `Depends on` declaration** (`converge-ai-agents-additively-on-launch.md`, `add-shared-instructions-layer-for-all-agents.md`, `harden-task-movers-against-closed-sprint-link-rot.md`, `merge-fkit-rules-block-into-existing-root-context-files.md`). None currently fences a *declaration* — but this project's briefs document formats for a living, and task 41's own brief is precisely that genre. **Not live today; one example away.** |
| R49 | 5 | low | `SKILL.md:231` vs `dashboard.sh:484` **[rev]** | **R43 IS MARKED `✅ done` AND IS NOT DONE — the exact defect R43 itself was about, recurring on R43.** The round-4 action reads: *"The mirror text now names **rule 1**, not 'the moved-row rule'."* **It does not.** `SKILL.md:231` still reads *"the plan has no recoverable `Sprint N` identity, so **the moved-row rule** could not be applied"* — **verbatim the string R43 quoted as the defect** — and `grep -c 'rule 1' claude/skills/fkit-status/SKILL.md` returns **0**. The diff confirms it: the line is **added** by this diff (`git diff 9c2fe22 -- SKILL.md`, `+    ↑ … so the moved-row rule could not be applied.`) with the wrong text intact. `PLAN_SPRINT` feeds **rule 1's skip on non-moved rows** (`:484`); rule 2's moved check reads `moved_target` vs `b_sprint` and never touches it — **so the narrator is still told the wrong rule broke**, which is the narration-changing harm that met the residual's re-raise condition in the first place. **R43 was itself the finding that R22(b) was marked done while only (a) was fixed.** Two consecutive rounds of an unearned `✅` on **the same two lines of text**. **Severity low as a code defect — it is a two-line doc edit, and the board is unaffected — but recorded prominently because the *verification* failure, not the *text*, is the finding.** Fifth consecutive cash-in of the mirror residual (R9→R22→R32→R43→R49). |
| R50 | 5 | low | `SKILL.md:227` vs `dashboard.sh:561` **[both]** | **The mirror omits the `form="…"` field added to `drift depends-unparseable` this round.** The script emits `drift depends-unparseable $tid brief="…" form="${draw%%␟*}"` (`:561`); `SKILL.md:227` documents `drift depends-unparseable <task> brief="…"` only. **Verified:** an empty BL declaration → `drift depends-unparseable 1 brief="../tasks/backlog/alpha.md" form="BL"`. **The `form=` value itself is safe** — it is always one of `S`/`BL`/`BI`/`P`, so it does **not** break the `key="value"` grammar (the coder's question 2, answered: no). **The gap is the standing instruction's third hole.** R32's instruction covers *"a `drift` record whose **kind** is not listed"*; R43 established it does not cover *a listed record with a **wrong description***; this establishes it also does not cover **a listed record with an undocumented FIELD**. **Also stale in the same block:** `SKILL.md:235` still reads *"has drifted from it **three** times"* — the true count is now five. |
| R51 | 5 | medium | `dashboard.sh:85,161` vs `:121` **[codex]** | **"Is this the `## Status` section?" has THREE implementations — two prefix, one exact — and the script's own one-grammar rule forbids exactly this.** `:85` `grep -c '^## Status'` (prefix) · `:161` `grep -q '^## Status'` (prefix) · `:121` `/^## Status[ \t]*$/` (exact). **This is R39/R40's root cause — two grammars for one question — surviving in `extract_rows` while `depends_raw:263-268` declares *"THERE IS ONE GRAMMAR… Do not reintroduce a second pattern anywhere."*** The discipline was applied to one function, not to the class. **Two verified consequences, both at exit 0 or a misleading exit 1:** **(a)** a plan with one real table plus a `## Status notes` prose section → **`drift multiple-status-tables count=2`** and a roll-up reading **`— as recorded; drift on the plan itself — see above.`** — **a phantom plan-level owner decision on a clean plan.** *(The fact fires at `9c2fe22` too, so it is **not a regression** — but R22's fix now routes plan-level drift into the roll-up clause, so this diff makes the pre-existing false positive **louder and owner-visible for the first time**.)* **(b)** `## Status (as of 2026-07-16)` or `## Status ##` (valid CommonMark closing hashes) passes `:161`'s prefix guard, then yields zero rows at `:121`'s exact match → **`die "no parseable rows in the '## Status' table"`** — the wrong diagnosis: there *are* rows; the section was never entered. *(Both behave identically at `9c2fe22` — pre-existing, loud, and no live plan uses either form.)* **Not live** (both live plans use a bare `## Status`); fails loud → medium. |
| R52 | 5 | low | `dashboard.sh:550` **[codex]** | **An unreadable brief is indistinguishable from "no declaration" — `2>/dev/null` maps an I/O error onto the contract's "no output = no dependency".** `draw=$(depends_raw "$brief_path" 2>/dev/null)` swallows awk's `can't open file`, so an empty result means *both* "this brief declares nothing" *and* "I could not read this brief". **That is the emptiness-vs-existence conflation R38/R39 closed inside the parser, surviving at the caller** — the coder's contract (*"no output → the brief records no dependency"*) is only sound if the read succeeded, and nothing checks that it did. **Verified:** a brief with a valid `## Depends on` → `- task 9`, mode `000` → **`derive 1 depends="none recorded"` at exit 0**; task 9 is fabricated out of existence. **Severity LOW, and I am explicitly overriding the Codex pass's `HIGH`: it is not silent.** `field_value` fails on the same unreadable file, so `b_status` is empty and the row also emits **`drift nonconformance 1 kind="brief-missing-status"`** → a drift record → beat 6 → an owner decision. The board is wrong but it says so. Recorded, not pressed: an unreadable brief is not a realistic authoring accident, and it sits under the same owner/producer trust model the **R15**, **R26** and **R42** decisions rest on. |
| R53 | 5 | low | `test/dashboard-contract.test.js` **[codex]** | **The negative axis has no exact-stdout cell, which is why `form=` shipped undocumented and green.** `grep -c 'form=' test/dashboard-contract.test.js` → **0**: the field is asserted **nowhere**. The `depends-unparseable` tests assert with `startsWith('drift depends-unparseable 1')`, so **any** suffix passes, and **R10's byte-for-byte pin (`:369`) exercises one happy-path fixture (done + backlog, no declaration) that never emits the record at all.** This is R10's own honest caveat — *"the keystone is placed; the wall is not built"* — reaching the **new** axis: round 4 added 11 negative tests and **none of them pins stdout**, so the mirror could drift on the one record kind the axis exists to produce. R36's matrix and R10's pin are still two separate suites that do not intersect. |
| R54 | 6 | medium | `dashboard.sh:300-311` **[both]** | **`maskspans()` has no notion of a multi-backtick delimiter run, so a DOUBLE-backtick span masks its two fences and leaves the CONTENT raw — and R47's class walks straight back in.** CommonMark opens a span on a run of N backticks and closes it on a run of exactly N. `maskspans` always treats the first backtick as the opener and the *next single* backtick as the closer. **Verified, controlled, end-to-end:** same brief, one line changed — single-backtick `` `**Depends on: task 99**` `` → `depends="task 42."` (**R47's fix works**); double-backtick ``` ``**Depends on: task 99**`` ``` → **`depends="task 99"`**; no mention at all → `task 42.`. **The masker's contract holds for one delimiter width only.** **Not live** — no brief wraps a `Depends on` mention in `` `` ``, though `` `` *is* live in 6 files. **This is NOT R45 re-litigated:** R45 is the case with *no* span; this one *has* a span and is mechanically decidable — it is a member of the class R45's own rationale calls **"fixed"**. |
| R55 | 6 | low-medium | `dashboard.sh:342` **[both]** | **Fence tracking is ONE boolean toggled by EITHER marker, so a ``` fence is closed by a `~~~` line — CommonMark says a fence closes only on its own character.** **Verified:** ` ``` ` / `~~~` / `**Depends on: task 99**` / ` ``` ` then the real `- **Depends on: task 42.**` → **`depends="task 99"`** — the `~~~` toggles the fence off mid-block, the example becomes visible and outranks the real declaration. Control (properly closed fence, no tilde) → `task 42.`, so **R48's fix is genuinely sound for the ordinary case.** **Not live** — zero `~~~` and zero 4-backtick fences across all 53 briefs. |
| R56 | 6 | medium | `dashboard.sh:88` vs `:128` **[both]** | **R51's recorded action — *"**One** `STATUS_HEADING_RE`, used by all three call sites"* — is not what shipped, and the guard STILL rejects what the parser accepts.** **(a)** `grep -n` proves the variable has **two** consumers (`:92` `grep -cE`, `:168` `grep -qE`); **`:128` hardcodes the literal `/^## Status[ \t]*$/` inside the awk program.** The mirror the comment at `:82-87` says it deleted (*"ONE definition, used everywhere"*, *"anchors all three to the same answer"*) is still there — synchronised by hand, unguarded against drift, in the one file whose own rule is *"do not reintroduce a second pattern anywhere"*. **(b) The two engines do not agree, on the real target platform.** POSIX bracket expressions have no `\t`: **BSD `/usr/bin/grep` reads `[ \t]` as the literal set {space, `\`, `t`}; awk reads it as {space, tab}.** **Executed under `LC_ALL=C` (the script sets it):** heading `## Status<TAB>` → **guard REJECTS (`grep -cE` = 0) → `die "no '## Status' section"`; parser ACCEPTS (awk = 1)** — the board dies on a heading the parser reads fine, over an invisible character. Heading `## Statust` → grep **matches**, awk does not. **⚠️ I am correcting the adversarial pass's evidence, which was wrong in the coder's favour:** it reported *"I executed the macOS BSD grep side (it does match a tab, so the two dialects agree here)"* and marked the divergence reasoned-only/GNU-only. **It did not — `grep` on this host is `ugrep 7.5.0`, which shadows `/usr/bin/grep` on `PATH` and is a third dialect** (ugrep: tab=1, `Statust`=0 — it agrees with awk; BSD does not). Re-run against `/usr/bin/grep`, the divergence is **real, executed, and live on stock macOS** — not a Linux-only inference. **Blast radius contained:** of 10 greps, `STATUS_HEADING_RE` is the only dialect-divergent one (`:507`'s date ERE agrees across all three). **Not live** (no live plan has a trailing tab); fails **loud** → medium. **Coverage note:** the 80 dashboard tests have been validating **ugrep** semantics on this host, not BSD grep's. |
| R57 | 6 | low | `SKILL.md:237` **[reviewer]** | **R50 is marked `✅ done` and its second half is not done — the R22(b)→R43→R49 pattern, one round after R49.** R50's claim named two things; the recorded action addresses only the first. **(a)** `form=` documented — **verified done** (`grep -c 'form=' SKILL.md` → 1). **(b)** R50 said verbatim: *"**Also stale in the same block:** `SKILL.md:235` still reads *'has drifted from it **three** times'* — the true count is now five."* **`SKILL.md:237` still reads *"has drifted from it three times"*; `grep -c 'five times'` → 0.** The true count is now **six** (R9→R22→R32→R43→R49→R57). **The mirror's own drift-warning is itself drifted** — the sentence whose job is to tell the narrator this list goes stale is stale. Trivial to fix, and recorded only because this is the exact class the coder called *"the worst thing I've done in this review"*: **R49 was verified by grep; R50's second half was not.** The discipline was applied to the finding that named it, not to the class. |
| R58 | 6 | medium | `dashboard.sh:306` **[codex]** | **An unmatched backtick is masked through end-of-line, so a stray backtick SWALLOWS a real declaration on the same line → `none recorded` → the LLM prints `ready`.** CommonMark treats a lone backtick as **literal text**, so the declaration is real. **Verified:** `` - stray `quote and **Depends on: task 42.**`` → **`depends="none recorded"`**. **This is FABRICATED ABSENCE — the direction `:289-294`'s own comment calls "the worst, and the one this function has now been wrong about twice".** Scope is bounded by the per-line design (`M[NR] = maskspans($0)`), so the stray backtick must sit on the declaration's own line. **Not live.** |
| R59 | 6 | medium | `dashboard.sh:368` **[codex]** | **The mask is built, then not used for the cut: BI termination `sub(/\*\*.*$/, "", s)` scans the RAW string, so a `**` inside a legitimate code-span VALUE truncates the declaration and silently drops dependencies.** `:365` correctly locates on `maskspans(b)`; `:368` then terminates on the raw text — **the locate/extract discipline the round-5 fix is built on, applied to the locate and skipped on the terminator.** **Verified:** `` - **Depends on: `api**v2` and task 42.** `` → **``depends="`api"``** — the value is cut mid-span and **task 42 is gone**. A dropped dependency is the fabrication class R20/R28 exist to prevent, reached through the new code. **Not live.** |
| R60 | 6 | low-medium | `dashboard.sh:343` **[codex]** | **`maskspans` is per-line, but CommonMark code spans may cross line breaks — so a declaration inside a multi-line span parses as real.** **Verified:** `` `example `` / `**Depends on: task 77.**` / `` end` `` → **`depends="task 77."`**; expected: no declaration (the whole block is span prose). Fabricated **presence**. **Not live.** *(Noted in the coder's favour: the per-line design is also what BOUNDS R58 — an unterminated span cannot leak past its own line. The two findings are the two sides of one deliberate simplification.)* |
| R61 | 6 | low-medium | `dashboard.sh:342` **[codex]** | **The fence toggle fires on any line STARTING with a fence run, including one that trailing text makes invalid as a CLOSER** (CommonMark: a closing fence permits only trailing spaces; an info string is opener-only). **Verified:** ` ``` ` / `example:` / ` ``` not a close` / `**Depends on: task 77.**` / ` ``` ` then the real `- **Depends on: task 42.**` → **`depends="task 77."`** — the pseudo-closer toggles off inside the block and the example escapes. **Not live.** *(Two neighbours I tested and am NOT reporting, because the script is RIGHT: an **unclosed fence** → everything after excluded → `none recorded`, and a prose line **starting** with ` ``` ` → phantom fence → `none recorded`. Both look like fabricated absence, but **CommonMark agrees with the script in both cases** — an unclosed fence runs to end of document, and ` ``` opens a fence, said in prose.` **is** an opener with an info string. Correct behaviour on a malformed brief, not defects.)* |
| R62 | 6 | medium | `dashboard.sh:145` **[codex]** | **The admission window opens at the separator without checking that a HEADER ROW precedes it — GFM requires both, so a separator-shaped line in prose manufactures a table, and a task out of nothing, SILENTLY.** The comment at `:137-142` reasons only about the mirror case (a pipe block with **no** separator); **the twin question `:131-135` poses — *"can any line produce a record that is NOT a row?"* — is still open on one side.** **Verified:** a `## Status` section of prose → `|---|---|---|---|` → one task-shaped row → **exit 0, a clean board, `1 backlog — of 1`, `total 1`, and ZERO drift facts.** A phantom task, invented from a block markdown renders as prose, with nothing to tell the owner. This is **R2/R17/R29's class** — *"`M` = rows the parser admitted"*. **⚠️ NOT A REGRESSION, and I checked rather than assumed: `9c2fe22` produces the byte-identical phantom** (same row, `— of 1`, `total 1`, exit 0) — the old `^\|` admission skipped the prose and took the row for the same reason. **Pre-existing, silent, and untouched by this diff.** |

### Suppressed as settled — do not action

- **X5 — "form priority overrides R44's first-declaration-wins"** (`dashboard.sh:362`, raised by Codex,
  **rejected by the adversarial reviewer before it reached me; I independently agree**). `- Depends on:
  task 12.` then `- **Depends on: task 99.**` → `task 99`. The behavior reproduces, but it is
  **deliberate, commented at `:346-349`** (*"CHOOSE BY FORM PRIORITY, NEVER BY LINE ORDER"*) and it is
  **R37's fix** — prose loses to both S and B. **R44's first-wins is a WITHIN-form rule**; Codex
  conflated the two. Actioning this would **re-open R37**. → Accepted residuals: R44.
- **The `unrecognized` 7th roll-up term** (coder's point 1) — **owner ruled keep, 2026-07-16.** Reviewed
  as implemented; **no conflict found.** `task-status-vocabulary.md` governs *status markers*;
  `unrecognized` is a **count bucket**, not a marker. SKILL.md's "never invent a value" binds the
  **LLM**, and the roll-up is pasted verbatim from script-computed output derived from the file —
  nothing is invented. `SKILL.md:199`'s `count <marker> <N>` is generic enough to cover it. It surfaces
  in **R3** only as the *marker-classification* path, not as the roll-up term. Not re-litigated.
- **`Depends on:` stays free text / the LLM resolves `ready` vs `after N`** — settled (§4.2, §2).
  **R1 and R4 are *not* re-litigation of this**: they concern *locating* and *transmitting* the field,
  which the decision does not license.
- **Roll-up spacing** — raised by the Codex pass (and independently suspected by me) as deviating from
  §4.1's `— of 37`. **Refuted and dropped on verification:** the **prior** `SKILL.md:187` (`9c2fe22^`)
  specifies `N moved  —  of M` — double-spaced. The script **preserves the established contract**; §4.1's
  sample is loose prose. The valid residue (the test encodes the implementation rather than the spec) is
  subsumed by **R10**.
- **`✅ Complete` admitted to the `done` bucket by prefix match** — refuted by the Codex pass itself:
  **by design**, `SKILL.md:56` and §5.1 mandate matching the marker **prefix**, not the whole line.
- **Empty `ROWS` → `— of 0` board at exit 0** — refuted by execution: `:107` dies first (exit 1 + stderr).

### Verified correct — evidence recorded so it is not re-reviewed

- **bash 3.2 floor (coder's point 2): clean — no defect found by either pass.** Output is
  **byte-identical** under `/bin/bash` 3.2.57 and bash 5.x on live `sprint-2.md`. No `declare -A`,
  `${v^^}`, `mapfile`/`readarray`, `<<<`, or `[[ =~ ]]`. The `while … done <<EOF` heredoc (`:348`)
  correctly avoids the subshell that would lose the counters. The `:30` portability comment is accurate.
- **ADR-017 rules 1–4: compliant, verified empirically end-to-end.** `fkit-claude-init.sh` carries
  `dashboard.sh` into a temp project; it arrives **`-rw-r--r--`** (no exec bit); `./dashboard.sh` →
  *permission denied*; `bash <path>` → works. No real `./dashboard.sh` call site exists (all 3 hits are
  warnings against it). The coder's ship-path claim reproduces exactly.
- **The fallback (coder's point 6): genuinely short and honest — spec §5.4 satisfied.**
  `SKILL.md:212-227` is ~15 lines — flag first, columns, markers verbatim, show dead rows, `— of M` by
  row count — plus *"deliberately lower fidelity… The full contract lives in the script. Do not
  reconstruct it here."* It does **not** restate the drift rules, the sentinel, or the next-step shapes.
  (Only defect on this path is **R16**.)
- **`⟦FACTS⟧` value-channel escaping (coder's point 3): holds.** `fact_value` (`:193`) maps `"`→`'` and
  newline→space; the two live breakers the coder found (sprint-2 task 36's embedded quote; sprint-1's
  `8 (optional)` priority via `task_id`) are genuinely fixed. **Neither pass found a further breaker in
  the value channel** — the answer to "are there more?" is: **not in the value channel; the grammar broke
  in the *key* channel (R9) and in *row admission* (R2, R7).**
- **The 13 spec §7 cases are all present**, and test `:183` ("rule 1 in its general form") is the
  mutation-caught hole the coder disclosed — a real addition. The suite's *reasoning* is high quality;
  its *assertion style* is the gap (R10, R11).

### Why mutation testing missed R1 (and R2/R3/R7)

Mutation testing mutates the **script**, not the **fixtures**. Every `Depends on:` fixture (`:228`,
`:239`) puts the declaration as the brief's **only** occurrence of the string — an unanchored `grep -m1`
cannot be surfaced by mutating code when no fixture contains a decoy line. R2/R3/R7 are likewise
fixture-shaped, not code-shaped, gaps — compounded by R10 (no exact-stdout assertion). **The technique
was applied correctly; its blind spot is fixture coverage.**

### Coder claims that no longer reproduce (not defects)

The live-Sprint-2 evidence is **stale**: the coder reported `— of 38`, 7 drift rows (23, 24, 30, 31, 32,
33, 38). The same command today yields **`— of 41`, 34 done · 7 backlog, zero drift rows** — the owner's
task updates in `9c2fe22` closed the drift. The counts-sum-to-M, bash-3.2 and ship-path claims reproduce;
**the drift-row claim cannot be re-verified from the current tree.**

### Unverified — the coder's disclosed gap, confirmed as a real risk

The **entire LLM-side half remains unverified** and the coder correctly declines credit for it. **R13 is
a concrete instance of that risk, not a hypothetical.** R1, R4, R9 and R16 all land on this same
unverified seam — a garbage sentinel, a truncated sentinel, an undocumented record shape and a
six-vs-five column instruction are each only *survivable* if the LLM behaves as the prose asks. Not
testable by the suite as scoped (ADR-017 rule 4 fences it to stdout contracts); a **standing residual**,
not a round-1 blocker.

---

## Round 2 — dedupe, verification and convergence

### Suppressed as settled — do not action (round 2)

**Nothing was suppressed this round.** Both passes were primed with the five accepted residuals and
their re-raise conditions, and the output-side dedup found **zero findings that re-litigate one**. Two
came close and are recorded deliberately, not suppressed, because a stated carve-out or re-raise
condition is **met**:

- **R19 / R20 vs the `Depends on:` free-text residual.** The residual's own words: *"R1 and R4 are not
  covered by this — **locating** and **transmitting** the field are not **interpreting** it."* R19 is a
  locating defect; R20 is a transmitting defect. Neither asks the script to interpret a dependency, and
  neither asks for the brief-format convention change the residual defers. **In scope.**
- **R22 vs the SKILL.md-mirror residual.** Re-raise condition: *"the mirror drifts in a way that changes
  narration."* `SKILL.md:215-216` tells the narrator the **moved-row rule** could not be applied when
  the affected rule is **rule 1**. That is narration-changing. **Condition met.**

### Verified correct — evidence recorded so it is not re-reviewed (round 2)

- **11 of 15 round-1 fixes hold cleanly, verified by execution against purpose-built fixtures:**
  **R3** (`WIP` → `nonconformance` only, no `waiting on owner`) · **R5** (brief with no `## Status` →
  `brief-missing-status`, next step stays `closed`, no override) · **R7** (empty **Task** cell holds
  position under US; no phantom `missing-brief`) · **R8**'s filename fallback (prose H1 + `sprint-N.md`
  → no phantom drift; neither → `unresolved-plan-sprint` fires) · **R9**/**R13**/**R16** (SKILL.md) ·
  **R14** (`grep -c` yields a clean `0`).
- **The `die()` hard-fail path (owner ruling (a)) is genuinely reachable and correct** for the door it
  covers: a real `NF<5` row → **exit 1** + a clear stderr naming the offending row → `SKILL.md:224-236`'s
  documented flagged fallback. The fallback is reachable. *(Its blast radius is fine; the problem is that
  two other doors never reach it — R17.)*
- **The `⟦FACTS⟧` grammar mirror is now complete and accurate.** All five `nonconformance` kinds, **both**
  `disagreement` shapes, `missing-sprint` and `unresolved-plan-sprint` are documented. R9 and R16 are
  properly closed. *(The one error is R22(b)'s misdescription, not an omission.)*
- **R10's exact-stdout test is real** — a genuine byte-for-byte pin including fact ordering, roll-up
  spacing and the absence of extra records. It was the highest-leverage fix in round 1 and it landed.
  **Honest caveat: it pins one happy-path fixture (done + backlog), so it would not have caught any of
  R17–R21.** The keystone is placed; the wall is not built.
- **No shell injection via cell content.** The `<<EOF $ROWS EOF` heredoc expands `$ROWS` **once**; the
  resulting value is not re-scanned. Verified: a cell containing `$(touch …)`, backticks and `$HOME`
  passes through **literally** and executes nothing.
- **`$'\037'` works under bash 3.2.57** (both passes); `read -r` preserves backslashes; empty middle and
  trailing fields hold position. **This does not close the bash-5 gap** — see *Coverage gaps*.
- **`npm test` is genuinely 58/58 green**; `test/dashboard-contract.test.js` grew **18 → 32** tests.
  *(The coder's "32 → 58" appears to conflate the dashboard file's count with the suite total; the
  headline claim "58/58 green" is accurate and reproduces. Not a defect — noted only so the numbers
  reconcile.)*

### Convergence call — **act, do not close out**

**This is not a review loop, and I would say so if it were.** The evidence: **zero** re-litigation of
accepted residuals; **three of the four high findings (R17, R18, R19) were found independently by both
passes**; and every finding is anchored to a fixture I executed against the **unmodified** script.
Round 1's diagnosis was correct and the coder's verification discipline was real — R2, R3, R5, R7, R8
were all genuinely understood.

**The one pattern worth naming, because it will recur otherwise:** R17, R19 and R20 each **closed the
instance the finding named, rather than the class it belonged to.** R2 named `NF<5`; `NF<5` was fixed
and two other silent-drop doors remained. R1 named *unanchored prose matching*; the anchor was tightened
to the one form the live tree happened to use, and the repo's own prescribed form fell outside it. R4
named *the 72-byte cap*; the cap went and the line-based truncator underneath it stayed. The round-1
findings were written as instances; the fixes were scoped to those instances. **The remedy is a class
question — "what else reaches this outcome?" — not another round of instances.**

Recommend the coder work R17–R21 and put **R23** (frontier) to the owner. **R24–R26 are honest low-value
records**; fixing them is optional and I would not hold the task for them.

## Round 3 — dedupe, verification and convergence

### Suppressed as settled — do not action (round 3)

**Nothing was suppressed this round — for the third round running.** Both passes were primed with all
six accepted residuals and their re-raise conditions. The output-side dedup found **zero** findings
that re-litigate one. Three come close and are recorded deliberately, because a carve-out or a
re-raise condition is **met**:

- **R27 / R28 / R30 / R31 vs the `Depends on:` free-text residual.** The residual's own words: *"R1 and
  R4 are not covered by this — **locating** and **transmitting** the field are not **interpreting**
  it."* R27, R28 and R31 are transmitting defects; R30 is a locating defect. **None asks the script to
  interpret a dependency** — every one of them still hands the LLM raw text and lets it resolve
  `ready`/`after N`. None asks for the brief-format convention change the residual defers. **In scope.**
- **R32 vs the SKILL.md-mirror residual.** Re-raise condition: *"the mirror drifts in a way that changes
  narration."* `drift depends-unparseable` is a **drift record beat 6 is required to narrate**, and the
  grammar does not contain it. **Condition met** — this is the residual's own escape hatch firing, for
  the third consecutive round (R9, R22, now R32).
- **R29 / R35 vs the `unrecognized` 7th-term residual.** Neither touches the term's existence or the
  roll-up vocabulary — the owner's ruling stands untouched. They concern **phantom rows being counted
  into it**. Not a re-raise.

*(R23's `unresolved-plan-sprint` residual, the R15 brief-resolution residual and the ADR-017 residual
were not touched by any finding this round.)*

### Verified correct — evidence recorded so it is not re-reviewed (round 3)

Round 2's ten actions were all verified by execution against purpose-built fixtures on the unmodified
working tree. **Six hold cleanly and are closed:**

- **R18 — the revert is exactly right, and it did NOT re-open R3 or R5.** Verified all three, sources
  held constant: (a) plan `🚧 Blocked` (no em-dash) + brief `✅ Done` in `done/` → **both**
  `drift nonconformance blocked-without-reason` **and** `drift disagreement 2 plan="🚧 Blocked"
  brief="✅ Done" location="done/"` → `waiting on owner`. The real drift is visible again and the
  nonconformance is reported alongside it — the override-scoped split, correctly implemented. (b) **R3
  holds**: `WIP` → `unknown-marker` only, next step `⟨derive: none recorded⟩`, **no** override. (c)
  **R5 holds**: a brief with no `## Status` in the correct directory → `brief-missing-status` only, no
  false disagreement. The narrow `[ -n "$key" ] && [ "$key" != "unknown" ]` gate is the right one.
- **R21 — genuinely fixed; the regression is gone.** `st` feeds semantics, `st_cell` only the board.
  Verified: `➡️ Moved to [Sprint 10](../sprint-10.md) — deferred` passes through **untrimmed**, zero
  drift facts, link intact.
- **R17's counting — `sum = M` holds for the empty-Status row.** Verified: a 3-row table with one
  empty-Status row → `1 done · 1 backlog · 1 unrecognized  —  of 3`, `total 3`. The
  `missing-status-cell` → `unrecognized` route works exactly as designed. *(The invariant now breaks
  from **over**-admission instead — R29 — which is a different door, not this fix failing.)*
- **R22, R24, R25, R26 — all verified fixed.** Plan-level drift reaches the roll-up clause; a literal
  `MALFORMED` status is data; missing date and missing reason are named separately; a literal US is
  neutralised at parse.
- **Drift rules 1 and 2 both behave.** Verified: a `➡️ Moved` row whose brief reads `🔲 Backlog` in
  Sprint 10 → `in Sprint 10`, **zero drift** (rule 1). A non-moved `✅ Done` row whose brief claims
  another sprint → cross-check correctly skipped. Moved target `Sprint 11` vs brief `Sprint 10` →
  `drift disagreement … brief_sprint="Sprint 10" moved_target="Sprint 11"` (rule 2).
- **Live `sprint-2.md` is clean and the coder's claim reproduces exactly** — `— of 41`,
  `34 done · 7 backlog`, **zero drift facts**, and all 7 `derive` sentinels carry full text. Round 1's
  2 garbage + 4 truncated rows are genuinely gone. **The one exception is R28**: `derive 41` silently
  drops `(hard)`, which is invisible without reading the brief.
- **`npm test` is 73/73 green**, up from 58. The count reproduces.
- **R10's exact-stdout pin still describes reality** and still passes — the coder was right not to
  update it. **Honest caveat, unchanged from round 2 and now demonstrated:** it pins **one happy-path
  fixture** (done + backlog, no dependency declared), so it reached **none** of R27–R35. The keystone
  is still placed; the wall is still not built.

### Coverage gaps — carried, NOT credited (round 3)

- **bash 3.2-vs-5.x: still NOT verified. Three rounds of non-verification.** The coder explicitly
  declined credit and I am not granting any. This host has only `/bin/bash` 3.2.57. **This needs a
  bash-5 host, not a fourth reviewer pass** — no amount of reviewing will close it, and it should stop
  being carried as a review item and start being carried as an environment task.
- **The LLM-side half remains unverified.** **R33 is a concrete, newly-created instance of this risk**:
  the `⟨derive: UNPARSEABLE — see brief⟩` sentinel has no compliant narration path. R30, R31 and R32
  land on the same seam.

### Convergence call — **act, do not close out. But change the method, not just the code.**

**This is not a review loop, and I would call one if it were.** The evidence, three rounds running:
**zero** re-litigation of accepted residuals; **six of the ten findings were found independently by
both passes**, including all three highs; every finding is anchored to a fixture I executed against
the **unmodified** script; and two are **regressions proven by running both trees on identical input**.
The coder's round-2 work was real — R18's revert in particular is a precise, correct piece of
reasoning, and the class invariants now written into the code are the right invariants.

**But the count is not falling: 16 → 10 → 10, and the classes are the same classes.** That is the
thing to act on, and it is not a discipline problem — the coder's verification discipline is
demonstrably good. It is a **method** problem, and R36 is the evidence:

> **Every fixture written to prove a fix contains the shape that works.** Test `:704` is live task 41's
> declaration **flattened onto one line**. Test `:684` exercises wrapping **only on the form that
> already joins correctly**. Test `:659` uses a `## Depends on` section with **one item and no list
> marker**. Round 2's ledger already named this — *"mutation testing mutates the script, not the
> fixtures… its blind spot is fixture coverage"* — and round 3 is that sentence coming true again.

**`depends_raw` is the epicenter: 4 of 10 findings, rewritten twice, and still wrong on its own live
input (task 41).** My recommendation is to **stop patching it by instance**:

1. **Write the grammar down first** — the accepted declaration forms are a closed set
   (`**Depends on: x.**` · `**Depends on:** x` · `Depends on: x` · `## Depends on` section), and they
   are currently implied by four scattered regexes with no shared contract.
2. **One code path: locate → join → sanitise → emit.** No branch may `print` and `exit` on its own
   (that is R27) and no completion test may be satisfiable by the label it is looking for (that is
   R28). The section branch bypasses both the join and `print_buf` today purely because it is a
   separate path.
3. **A fixture matrix, not more cases:** {4 forms} × {wrapped, unwrapped} × {single, fan-in} × {pipe,
   no pipe} = 32 cells. The suite covers roughly five, all of them passing ones. **The matrix is what
   makes the class claim checkable instead of asserted** — and it is what would have caught R27, R28
   and R30 before I did.

**Recommend the coder work R27–R34 and put the two owner questions below.** **R35 and R36 are honest
records**; R35 is optional (the design spec backs the current behavior) but **R36 is the one I would
hold the task for**, because it is the only finding that changes the odds on round 4.

**One thing I want to say plainly, because the ledger should carry it:** the coder asked me to attack
the rewritten surface hard and to call closeout if round 2 was settled. It is not settled, and saying
so is the answer to the question asked — but **R28 was found because the coder's own new loud fact
pointed at task 41, and R27/R30 exist only because the coder widened the parser to honor forms the
repo documents but nobody uses.** These are the defects of someone fixing the right problem. That is
worth recording next to the count.

### Owner questions — round 3

Both are dispositions I will not make on the owner's behalf. **Neither is "apply this fix?"**

1. **R31 — what should a colonless `Depends on nothing.` mean?** Four live briefs use it as an explicit
   declaration that there is **no** dependency; the script today would call it an *unparseable* one and
   emit drift. Options: **(a)** widen `depends_raw` to parse colonless declarations — closes it, but
   adds locating surface, which is exactly where R1/R30 live; **(b)** narrow `depends_mentioned` to
   require the colon — kills the false drift, but a genuine colonless declaration then silently becomes
   `none recorded` → `ready`, which is R19's invented-absence failure; **(c)** treat it as the
   brief-format convention change the free-text residual defers, and record a residual here.
   *(The coder's R23 precedent — deciding under the owner's standing "work without me" instruction and
   flagging it — is available, but this one trades a false-loud against a false-silent, which is the
   axis the owner has ruled on personally twice.)*
2. **R33 — what should the LLM do with `⟨derive: UNPARSEABLE — see brief⟩`?** The fallback is
   correct to refuse to invent an absence, but SKILL.md gives the sentinel no lawful rendering: *"use
   the text inside the sentinel"* (it says *see brief*), *"do not re-open the brief"*, *"a sentinel left
   in a delivered report is a bug"*. Options: **(a)** document a third sentinel form and **carve out a
   single sanctioned exception** to "do not re-open the brief" for this case; **(b)** render it as
   `waiting on owner` and let beat 6 narrate the drift record — consistent with how every other
   `drift` record is disposed, at the cost of overloading a next-step that currently means
   *disagreement*; **(c)** keep the sentinel deliberately unrenderable so it **must** reach the owner —
   i.e. accept "a bug in the report" as the intended signal, and say so in SKILL.md.

## Round 4 — dedupe, verification and convergence

### Coverage — the Codex harness is FIXED, and its pass is trustworthy for the first time

Rounds 2 and 3 both ran a **degraded** Codex: `--sandbox read-only` denied the temp file bash needs for
the `<<EOF` heredoc at `dashboard.sh:534`, so **every** invocation died and Codex never observed a real
board. Round 2 it fabricated a workaround (an `awk`-mutated copy); round 3 it reasoned statically.

**Fixed this round by changing the harness, not the script:** I `rsync`ed the working tree to a scratch
directory and ran `codex exec --sandbox workspace-write --skip-git-repo-check --cd <scratch>`. Codex
got a writable sandbox and **executed every claim against a byte-identical copy** of the real script.
Result: **8 findings, all `VERIFIED` with fixture + command + observed output, zero `UNVERIFIED`** — and
it explicitly cleared drift rules 1/2/3, `one_line_cell`, `marker_key`, `task_id`, `fact_value`, the
SKILL.md grammar, last-line declarations, live sprint-2 and `npm test` 88/88.

**The real tree was never exposed:** the scratch copy's `dashboard.sh` is byte-identical to the working
tree after the run (verified), and `git status` is unchanged from the start of this review.

**I re-verified all 8 Codex findings against the unmodified script on this tree anyway** — every one
reproduced, and **two reproduced as something sharper than Codex reported** is not the story this time;
the story is that **one of them (R38) is sharper than my own equivalent finding**. I had tested the
empty-label variant (`- **Depends on:**` + list), which fails **loud**; Codex tested the **non-empty**
label (`- **Depends on:** hard prerequisites:` + list), which fails **silent** with a plausible
sentinel. **That is the model-diversity dividend, and it is the first round it has actually been paid.**

### Suppressed as settled — do not action (round 4)

**Nothing was suppressed this round — for the FOURTH round running.** Both passes were primed with all
seven accepted residuals and their re-raise conditions. The output-side dedup found **zero** findings
that re-litigate one. Three come close and are recorded deliberately, with the reason:

- **R37 / R38 / R39 / R40 / R44 vs the `Depends on:` free-text residual.** The residual's own carve-out:
  *"**locating** and **transmitting** the field are not **interpreting** it."* All five are locating or
  transmitting defects; **none** asks the script to interpret a dependency — every one still hands the
  LLM raw text and lets it resolve `ready`/`after N`. None asks for the deferred convention change.
  **In scope**, on the same basis as R1, R4, R19, R20, R27, R28, R30 and R31 before them.
- **R41 vs the R35 header-detection residual — adjacency disclosed, and NOT a re-raise.** R35 settles
  *how the header row is identified* (by content). R41 concerns *the admission window* — which lines are
  eligible to be rows at all. Different mechanism, and **R35's re-raise conditions are NOT met** (no live
  plan puts a heading inside the table block, and there is no caption/preamble convention). I am
  reporting a new door, not re-opening R35's ruling, and the owner's `unrecognized` ruling is untouched.
- **R43 vs the SKILL.md-mirror residual.** Re-raise condition: *"the mirror drifts in a way that changes
  narration."* Telling the narrator that **the moved-row rule** broke when **rule 1** broke is
  narration-changing. **Condition met** — the residual's own escape hatch, firing for the **fourth**
  consecutive round (R9, R22, R32, R43). *That is now data about the residual, not about the coder.*

*(The R23 unresolved-plan-sprint residual, the R15 brief-resolution residual and the ADR-017 residual
were untouched by any finding this round.)*

### Verified correct — evidence recorded so it is not re-reviewed (round 4)

**The well-formed declaration surface is CLEAN. I executed it; it holds.** Round 3's nine actions were
verified against purpose-built fixtures on the unmodified tree — shapes taken from **live briefs and
plausible authoring habits, deliberately NOT from the coder's matrix**:

- **R28 closed, verified LIVE.** `derive 41 depends="[…](…) (hard). Do not begin before that spec is
  owner-reviewed."` — **task 41 keeps `(hard)`**, the exact regression round 3 was blocked on.
- **The `index()` first-label anchor is correct and live-validated.** `derive 36 depends="tasks 25, 26,
  27, 28."` — task 36's two adjacent declarations resolve to the **first**, the complete list. The
  defect the coder self-caught in round 3 is genuinely closed. *(Its only gap is the **separated** case
  — R44 — which no live brief has.)*
- **R27 closed.** Section fan-in **with a pipe and bold**: `## Depends on` / `- **task 12** — the
  scaffold | must land first` / `- task 99` → `⟨derive: task 12 — the scaffold must land first; task
  99⟩` — both items kept, pipe sanitised, **five-column board**. The single-path rewrite works.
- **Wrapped BI is correct**, including the live shape: `- **Depends on: task 26 (non-fatal init) and
  task 27 (refuse on weird` / `state).** Both are hard blockers.` → `task 26 (non-fatal init) and task
  27 (refuse on weird state).` — the form decided before extraction, terminator correct.
- **A wrapped BI whose trailing prose carries a second bold** (`… task 99.** See **task 5** for
  context.`) correctly cuts at the label's close → `task 12 and task 99.`
- **R30's other two thirds hold.** Code-span prose is correctly excluded — task 41's own line 29
  (`` the `Depends on:` line is free text ``) no longer wins; the real declaration does. The colon
  requirement holds. *(Only the **ordering** third is open — R37.)*
- **R31's prose half is genuinely fixed.** `Scope depends on what the owner decides.` → `none recorded`,
  **zero drift** — the false-drift R31 named is gone; case-sensitivity + the anchor did their job.
- **R34 closed.** `| 🚧 Blocked — `left \| right` fails | 1 | …` → **five-column board**, `tid=1` (not
  `?`), priority `1` (not cell debris), escape preserved into the cell **and** into the FACTS value
  channel. No phantom disagreement from the escape itself.
- **R26's fix holds for `\037`** — control: `Al\037pha` → `Al pha`. *(The class's remaining member is a
  different byte — R42.)*
- **A declaration on the file's LAST line** parses correctly (`task 42.`) — both passes.
- **`sum = M` holds on both live plans.** sprint-2: `34 + 7 = 41`, `total 41`, table has exactly 41 data
  rows (verified independently). sprint-1: `4 + 5 + 5 = 14`, `total 14`. **Zero drift on sprint-2.**
- **Drift rules 1/2/3: no regression.** Verified by me and independently cleared by Codex. A moved row
  with a matching brief sprint renders `in Sprint 10`, zero drift, **even with the plan's sprint
  identity unresolved** — which is also the proof for R43.
- **R32's grammar sync is real and complete.** All **7** nonconformance kinds, **both** `disagreement`
  shapes, `missing-sprint`, `depends-unparseable`, `multiple-status-tables`, `unresolved-plan-sprint` —
  all now documented. R32's substance is closed. *(Its **description** of one record is still wrong —
  R43 — which is a different defect from the omission R32 named.)*
- **`npm test` is 88/88 green**, up from 73. The count reproduces exactly. **73 → 88 is the matrix.**

### Answering the coder's six questions directly

1. **"`depends_raw` is a rewrite; assume it is wrong."** It is — but **not where it was wrong before.**
   The well-formed surface is clean (above); all four highs are in the **malformed/near-miss** dimension,
   and they are **one class**, not four (see the verdict). This is the first round where the defects are
   not the previous round's defects wearing new clothes.
2. **`extract_rows`'s contiguous-block model.** **Table with no separator → phantom rows, and R29's
   invented id `3` reproduces verbatim. `## Status` followed by *prose* before the table → fine, unless
   the prose carries pipes, in which case it becomes a phantom task.** The block ends where you'd expect
   *after* the separator and nowhere at all *before* it: `inTbl` is set **only** by the separator, so the
   model has no opinion about the region it hasn't reached yet (**R41**).
3. **`unesc`/`\002` parking.** **A literal `\002` does break it** — it becomes `\|` (R42); Codex's link
   variant fabricates a `missing-brief` on a brief that exists. **The escape survives into `⟦FACTS⟧`
   correctly** — verified in the `cell="…"` channel, which is the one that matters. The only blemish is
   cosmetic: `sanitise`'s `gsub(/\|/, " ", s)` leaves a stray backslash in the `derive` channel
   (`task 12 \ task 99.`) — nit-grade, no dependency lost, not recorded as a finding.
4. **The two owner-question answers.** **Both defaults are RIGHT. Do not override either.** R31 → (a) is
   the correct call and I would have made it; **the implementation ships (b)** for the plain colonless
   form (**R39**) — that is an implementation gap, not a wrong default. R33 → (a) is genuinely good
   reasoning, correctly scoped, with a sound `waiting on owner` backstop; **its safety is conditional on
   the parser failing loudly**, and R38/R39/R40 are three proven silent failures where the sanctioned
   exception never fires. **Fix the class and R33 (a) becomes exactly as safe as it claims to be.**
5. **`sum = M` and §5.2 rules 1/2.** **No regression.** Both live plans sum correctly; rules 1 and 2
   behave; Codex independently cleared them. The only `sum = M` breaks are R41's two doors, neither live.
6. **R32's mirror — does the standing instruction discharge the debt?** **It discharges about half, and
   half is the honest answer.** It converts a *silent skip* of an **unlisted record kind** into a loud
   report — which is the correct mitigation and cannot be bettered while the residual keeps the mirror
   by design. **But it does not cover a LISTED record with a WRONG description**, which is precisely
   R43: `unresolved-plan-sprint` **is** in the list, and its description sends the narrator to the wrong
   rule. The instruction closes the omission failure mode and leaves the misdescription one open. The
   mirror has now cashed in **four rounds running** — that is a fact about the residual worth carrying.

### Carried gap — an ENVIRONMENT BLOCKER for the owner, not a finding for the coder

**bash 3.2-vs-5.x equivalence: unverified for the fourth round, and I am formally agreeing it should
stop being a review item.** The coder is right and has been right for two rounds. Re-confirmed this
round: this host has **only `/bin/bash` 3.2.57**; no bash 5 at `/opt/homebrew/bin/bash`,
`/usr/local/bin/bash`, or any usual path. The coder is **correct not to `brew install` on the owner's
machine unprompted**, and correct to decline credit.

> **→ OWNER: this needs a bash-5 host (a CI matrix job, a container, or an explicit `brew install
> bash`). No further reviewer pass can close it — four have now tried.** What *is* established: output
> is byte-identical under 3.2.57 across both live plans; `$'\037'` works under 3.2.57; and **neither
> pass, across four rounds, has found a single bash-5-specific construct** (no `declare -A`, `${v^^}`,
> `mapfile`/`readarray`, `<<<`, `[[ =~ ]]`). That is *"no construct found"*, which is **not**
> *"verified equivalent"* — and it should be recorded as an environment task, not carried as review debt.

**The LLM-side half remains unverified**, unchanged and correctly disclaimed. R33's fix lands squarely
on that seam, exactly as the coder said — and R38/R39/R40 are what decide whether that seam is safe.

### Convergence call — **act; ONE fix, then this should close**

**This is not a loop, and I would call one — the coder explicitly asked me to, and I would rather have
called it.** The evidence, four rounds running: **zero** re-litigation of accepted residuals; **four of
the eight findings were found independently by both passes**; every finding is anchored to a fixture I
executed against the **unmodified** script; and **zero regressions this round** — a first.

**The count is 16 → 10 → 10 → 8, but the shape changed, and that is what matters.** Rounds 1–3 kept
producing *new members of the classes the previous round named*. **Round 4 does not.** The well-formed
surface — where every prior round's defects lived — is now verified clean, including live task 41 and
task 36. The method change worked. **What R36's matrix cannot see is its own negative space:** every
axis is a shape that *should* parse, so nothing in it can falsify the **fallback**, which is where all
four highs live. That is the round-3 lesson one level up — *the fixtures no longer come from the
implementation, but they still all come from the happy path.*

**My recommendation — one structural fix, not eight instance fixes:**

1. **Derive `depends_mentioned` from the SAME closed grammar as `depends_raw`** — a `Depends on` heading
   (any punctuation), a bold label, or a plain colon form. Two grammars for one question is the root of
   **R39** and **R40**, and it is the same *"one code path"* discipline that fixed R27, applied to the
   guard instead of the parser.
2. **Gate the loud fallback on CONFIDENCE, not on emptiness.** `depends_raw` should say *"I found a
   declaration and this is its text"* or *"I could not read it"* — never return text it does not stand
   behind. That single change closes **R38** (label-only text is not a dependency) and **R37** (prose is
   not a declaration) together, and it is what makes **R33's (a)** as safe as its reasoning claims.
3. **Give the matrix a negative axis.** {shapes that must NOT parse: prose-with-colon, code-span,
   near-miss heading, label-with-no-content} × {before/after the real declaration}. **Four of eight
   findings this round are cells in that axis** — it is the only addition that changes the odds on a
   round 5, exactly as R36's matrix was for round 4.
4. **R41 / R42 / R43 / R44 are honest low-value records.** R43 is a two-line SKILL.md correction. I would
   **not** hold the task for R42 or R44.

**If the class fix in (1)+(2) lands and the negative axis in (3) is added, I expect round 5 to be a
closeout.** The architecture, the invariants, the single code path and the written grammar are all
right; what is missing is that **the grammar is written down in the parser and nowhere else — the guard
never got the memo.**

**One thing worth recording next to the count, because the ledger should carry it:** the coder asked for
a hostile pass on a rewrite they flagged as historically wrong, told me to attack their own owner-question
answers, and asked to be told plainly if the remainder was method-grade rather than defect-grade. **It is
defect-grade — four silent fabrications on plausible input — so the answer is "act."** But **R38 exists
only because the coder built a loud fallback at all**, and **R39/R40 are only findable because the
grammar is now written down to compare the guard against.** Every one of this round's highs is a defect
you can only *have* once you have built the right structure. That is what round 4 looks like when
rounds 1–3 were done properly.

### Owner questions — round 4

One genuine owner-scope question. **It is not "apply this fix?"** — it is a question about the **scope of
a ruling the owner made personally.**

1. **R41(b) — does the owner's R2 `hard-fail` ruling extend to a `## Status` table with NO separator
   row?** On 2026-07-16 the owner ruled that *a row that fails to parse* must hard-fail to SKILL.md's
   flagged fallback. A separator-less pipe block is a **different animal**: it is not a GFM table at all,
   yet it currently renders a plausible board **and** silently absorbs following prose as phantom rows
   (`— of 2` for a 1-row block, task id `3` invented from `3 done`). Options: **(a)** **hard-fail** —
   Codex's position, and the most consistent reading of the R2 ruling: if it is not a table, refuse to
   render it; **(b)** **render + emit a new plan-level `drift` fact** (e.g. `drift malformed-table`) —
   consistent with the R23 residual's reasoning that destroying a usable board over a formatting defect
   is disproportionate, and with §5.4's degraded-but-usable posture; **(c)** **accept as a residual** —
   no live plan omits a separator, and a table without one does not render in any markdown viewer either,
   so the defect is self-announcing to a human. *(The tension is real and it is between two of the
   owner's own decisions — R2 says hard-fail on unparseable, R23's accepted reasoning says don't destroy
   a usable board over a naming/formatting nit. That is why it is theirs, not mine.)*

**Not owner questions — flagged, coder's call under the standing "work without me" instruction, with the
R23/R31/R33/R35 precedent available:** **R44** (first-declaration-wins on *separated* declarations:
accept as residual, or emit a fact — the grammar rule itself is live-validated on task 36 and should
**not** change) and **R42** (literal `\002`: one `gsub`, or a residual on the same "not a realistic
authoring accident" basis R26 and R15 rest on — noting R26 was *fixed* on that same cost argument).

## Round 5 — dedupe, verification and convergence

### Coverage — full; the Codex harness held for a second round

`codex exec --sandbox workspace-write --skip-git-repo-check --cd <scratch>` against an `rsync`ed copy,
codex-cli 0.144.4 / gpt-5.6-sol. **9 findings, every one carrying a fixture, a command and observed
output; zero `UNVERIFIED`.** It independently cleared drift rules 1/2/3, `sum = M` on both live plans,
`one_line_cell`, `marker_key`, `unesc`/`\002`, and the round-4 fixes.

**The real tree was never exposed:** the scratch copy's `dashboard.sh` is byte-identical to the working
tree by `sha256` **before and after** the run, and `git status` is unchanged from the start of this
review.

**I re-verified all 9 Codex findings against the unmodified script on this tree. Eight reproduced; one
is disproven** (below). **The model-diversity dividend was paid again, and specifically:** I found the
fenced-block hole (R48) via the **B** form; Codex found it via the **S** form *and* found the bold
code-span variant (**R47**) that my pattern-reading missed entirely — `` `**Depends on `` defeats a
guard I had read as sound. **R51 is wholly Codex's** and is the sharpest structural finding of the
round. Conversely **R49 — the false `✅` on R43 — is wholly mine**; Codex checked the mirror's *fields*
and not its *prose*, which is exactly the seam R43 warned about.

### Disproven — recorded so the coder is not asked to chase it

- **Codex, `HIGH`, `dashboard.sh:138` — *"the delimiter recognizer accepts one-hyphen cells, so a
  separator-less non-GFM pipe block becomes a table and violates the definition of M."* **INCORRECT.**
  Codex's fixture uses the delimiter row `| - | - | - | - |` and asserts *"the source contains no valid
  GFM table."* **It contains one.** GFM's delimiter row requires each cell to be **one or more**
  hyphens with optional leading/trailing colons — a single `-` is valid. Verified: the fixture renders
  `1 backlog — of 1` at exit 0, which is **correct**, and `9c2fe22` renders it identically. The
  reviewer reasoned from a stricter GFM than GFM. **No defect; the R41 window is right here.**

### Suppressed as settled — do not action (round 5)

**Nothing was suppressed this round — for the FIFTH round running.** Both passes were primed with all
seven residuals (including the withdrawn R35) and their re-raise conditions. The output-side dedup
found **zero** findings that re-litigate one. Three come close and are recorded deliberately:

- **R45 / R46 / R47 / R48 vs the `Depends on:` free-text residual.** The carve-out: *"**locating** and
  **transmitting** the field are not **interpreting** it."* All four are **locating** defects — every
  one still hands the LLM raw text and lets it resolve `ready`/`after N`. **In scope**, on the same
  basis as R1, R19, R27, R30, R31, R37, R39 and R40 before them. *(Owner-question 1 below asks whether
  the residual's own deferral should now be revisited — that is a question **about** the residual put
  to its owner, not a re-litigation of it by me.)*
- **R49 / R50 vs the SKILL.md-mirror residual.** Re-raise condition: *"the mirror drifts in a way that
  changes narration."* Telling the narrator **the moved-row rule** broke when **rule 1** broke is
  narration-changing (R49 — and it was already accepted as such when it was R43). An emitted `form=`
  field absent from the grammar is the same class. **Condition met** — the residual's own escape hatch,
  firing for the **fifth** consecutive round (R9→R22→R32→R43→R49). *That is now a strong fact about the
  residual; see the convergence call.*
- **R51 vs the withdrawn R35 residual.** R35 defended **header-row detection by content** and was
  **withdrawn** in round 4 when R41 deleted that check. R51 concerns **which `## …` heading is the
  Status section** — a different question, in different code (`:85`/`:161` vs the deleted check), and
  R35 no longer exists to be re-raised. R41's admission window is **untouched** by R51 and verified
  correct. Not a re-raise.

*(The R23 unresolved-plan-sprint, R15 brief-resolution, R44 first-wins and ADR-017 residuals were
untouched by any finding this round.)*

### Verified correct — evidence recorded so it is not re-reviewed (round 5)

**The round-4 class fix is real. I executed all of it against fixtures built from live briefs and
plausible authoring habits, deliberately not from the coder's matrix.**

- **The second grammar is genuinely gone.** `depends_mentioned` does not exist; `grep` finds no other
  pattern-match of the field anywhere in the script. The caller branches solely on `depends_raw`'s own
  `<form>␟<content>`.
- **R37 closed, both shapes.** Prose `The Depends on: field is free text, per the design.` now loses to
  a later `## Depends on` section (`task 42`) **and** to a later `- **Depends on: task 42.**`. Form
  priority in `END` is the correct mechanism and it works.
- **R38 closed.** `- **Depends on:** hard prerequisites:` + indented `- task 12` / `- task 13` →
  `derive 1 depends="hard prerequisites: - task 12 - task 13"` — **both tasks survive.**
- **R39 closed, verified against the real files.** All three plain colonless live briefs now parse:
  `- Depends on nothing.` → `nothing.` · `- Depends on nothing else in this sprint.` →
  `nothing else in this sprint.` · `- Depends on task 12 and task 99.` → `task 12 and task 99.`
  **The (a) decision is now actually implemented.**
- **R40 closed.** `## Depends on.` → `task 12`.
- **R42 closed**; **R31's prose half holds** (`Scope depends on what the owner decides.` →
  `none recorded`, zero drift); **R44's first-wins holds** and remains live-validated on task 36.
- **The `<form>␟<content>` contract holds — the coder's question 2, answered: YES.** `sanitise`
  (`:272`) does `gsub(/\037/, " ", s)` **before** the form prefix is prepended, so content can never
  contain `␟`. **Verified, not taken on trust:** a declaration containing a literal `\037`
  (`task 12<US>and task 99.`) → `derive 1 depends="task 12 and task 99."` — the byte is neutralised and
  `${draw#*␟}` splits correctly. **`form=` does not break the FACTS grammar** either (R50 concerns the
  mirror, not the grammar): the value is always `S`/`BL`/`BI`/`P`.
- **R41's admission window is correct — the coder's question 3, answered: I could not break it.**
  Verified, each against `9c2fe22` for parity: pipe-prose **before** the table → `— of 1`, clean ·
  prose **after** → `— of 1`, clean (R29 stays closed) · separator-less block → **exit 1** (the
  owner-Q4 (a) behaviour) · GFM alignment separators `|:---|:---:|---:|---|` → parse · a table with
  **no outer pipes** → parses · single-hyphen delimiters → parse (see *Disproven*). **A blank line or
  an HTML comment mid-table truncates the table — and that is GFM-correct**, not a defect: both end a
  GFM table, `M` remains *the table's rows*, and the sum holds. **No plan shape I could construct
  yields zero rows and hard-fails where it should render** — the two that hard-fail (`## Status (as of
  …)`, `## Status ##`) do so **identically at `9c2fe22`** and are R51's second arm, not a regression.
- **`sum = M` holds; no regression in §5.2 rules 1/2; the R10 pin still describes reality.** Live
  sprint-2 `34 + 7 = 41`, `total 41`, zero drift, **byte-identical roll-up to `9c2fe22`**; sprint-1
  `total 14`. `npm test` **99/99 green** — the count reproduces exactly, and **88 → 99 is the negative
  axis** (8 negative tests present).
- **The R35 withdrawal is correct and correctly recorded.** Verified: `st == "Status"` exists at
  `9c2fe22:98` and is **genuinely deleted** from the working tree. Striking the residual through with
  the reason — rather than deleting it — was the right call and is the same discipline R43 asked for.
- **The apostrophe-in-awk fix is real** and the `:136` in-code note (*"no apostrophes in this comment —
  it lives inside a single-quoted awk program"*) is the right kind of comment: it names the trap.

### Answering the coder's six questions directly

1. **"`depends_raw` v5 — assume it is wrong."** **It is — and this time it is wrong somewhere new.**
   Every prior round's defect class is closed and verified. The four new ones (R45–R48) are **all one
   thing: grammar rule 5's *content*.** Rules 1–4 each got a code path; **rule 5 got a single regex**,
   and it is the only rule whose implementation is narrower than its sentence. *"A CODE SPAN is prose
   ABOUT the field"* is right — but the code asks *"does this **line** contain the exact string
   `` `Depends on ``?"*, which is neither code-span-scoped, nor bold-aware, nor fence-aware.
2. **The `<form>␟<content>` contract.** **Holds. Verified by execution, not by reading `sanitise`** —
   see above. Both halves of the question are clean.
3. **The R41 admission window.** **I could not break it.** Details above. Codex's one attempt is
   disproven. **This is the first component of this script to survive a hostile round untouched.**
4. **"Is `SKILL.md` accurate *this* time?"** **No — and that is the round's most important answer.**
   All 8 nonconformance kinds **are** correctly listed (verified against the script's emissions). But
   **`form=` is undocumented (R50)**, and — **R49 — the `moved-row rule` misdescription R43 named is
   still there, byte for byte, on a row you marked `✅ done` with the text "the mirror now names rule
   1".** `grep -c 'rule 1' SKILL.md` → **0**. Both `disagreement` shapes are correct.
5. **Your owner-question answers.** **All of them are right, and R41 → (a) is right for the reason you
   gave.** **R31 → (a):** sound, and **now actually implemented** (R39 verified closed) — this was the
   one where the decision was right and the code shipped (b); that gap is gone. **R33 → (a):** sound;
   its safety is still conditional on the parser failing loudly, and **R46 is one new silent failure**
   against it — but R46 is not live and (a) remains the right call. **R41 → (a):** **correct, and your
   reasoning is stronger than you claimed** — *"GFM makes the delimiter row mandatory, so a
   separator-less block is not a table and has no rows"* is exactly right, it does fall out of correct
   parsing rather than policy, and **Codex's attempt to attack it failed on GFM's own text.** **R35's
   withdrawal:** correct, verified, and well-reasoned. **R44's residual:** correct; do not change
   first-wins. **I would override none of them.**
6. **Regressions.** **Zero.** `sum = M`, §5.2 rules 1/2 and the R10 pin all hold, and every probe I ran
   has `9c2fe22` parity. The only thing this diff makes *worse* is R51(a) — a **pre-existing** false
   `multiple-status-tables` that R22's roll-up fix now surfaces to the owner. That is a correct fix
   revealing an older defect, not a regression.

### Carried gap — an ENVIRONMENT BLOCKER for the owner, not a finding for the coder

**bash 3.2-vs-5.x equivalence: unverified for the fifth round. Kept where it belongs — with the owner,
not on the coder's list.** Re-confirmed: this host has only `/bin/bash` 3.2.57. Neither pass, across
five rounds, has found a bash-5-specific construct. That is *"no construct found"*, not *"verified
equivalent"*.

> **→ OWNER: this needs a bash-5 host (a CI matrix job, a container, or an explicit `brew install
> bash`). No reviewer pass can close it — five have now tried.**

**The LLM-side half remains unverified**, unchanged and correctly disclaimed. R33's sanctioned
exception, R46's fabricated `none recorded` and R49's misdescribed record all land on that seam.

### Convergence call — **act on the cheap half; the expensive half is the owner's**

**This is still not a loop, and I would call one — I said in round 4 that I expected this round to be a
closeout, and I would rather have been right.** The evidence, five rounds running: **zero**
re-litigation; **three of the nine findings found independently by both passes**; every finding
anchored to a fixture I executed against the **unmodified** script; **zero regressions**, for the second
round running.

**The count went 16 → 10 → 10 → 8 → 9, and for once the count is the wrong number to look at. Look at
these instead:**
- **Highs: 4 → 1.** And that one is not live, needs a contrived brief, and fails in a class no prior
  finding named.
- **Live defects: 0.** Both live plans render correctly and identically to `9c2fe22`.
- **Regressions: 0.**
- **Round-4 fixes that held: 7/7 code, 0/1 doc.**

**My honest read, since you asked for defect-grade vs method-grade explicitly:**

**Defect-grade, and cheap — I would do these three:**
- **R49 + R50 (SKILL.md, ~3 lines).** **Not churn: R49 is currently a false `✅` in this ledger.** A
  two-line edit whose absence was reported as complete is an integrity item, not a robustness nit, and
  it is the fifth round the mirror has cashed.
- **R51 (one grammar for `## Status`, ~2 lines).** Closes, in the sibling function, the exact class
  your own comment forbids reintroducing. Cheapest structural win on the board.

**Defect-grade but genuinely a judgement call — R45/R46/R47/R48.** They are real, I verified all four,
and R46 is the bad direction (fabricated absence). **But: none is live, all four need a brief that both
*discusses* the declaration format and *declares*, and this is the fifth consecutive round in which
`depends_raw` has produced findings — 15 of the 53 findings in this review are that one function.** The
fixes are individually cheap (fence state; `` /`[*_ ]*Depends on/ ``; scope the rejection to the span,
not the line; a sentence-boundary anchor for B). **The question is no longer "can this be fixed?" — it
is "should the parser keep absorbing the cost of a free-text field?"** That is owner-question 1.

**Method-grade, and I would not hold the task for it: R52, R53.** R53 is the honest one — **the
negative axis and the exact-stdout pin still do not intersect**, which is precisely how `form=` shipped
undocumented and green. One exact-stdout assertion on a `depends-unparseable` fixture closes R50's
whole class permanently, and it is the only test change I would argue for.

**One thing worth recording next to the count, because the ledger should carry it:** you asked me to
assume v5 was wrong and to attack the negative space you *didn't* name. **The axis you added caught the
class it was built for — all four round-4 highs are closed and stayed closed.** The four new ones sit
one level out from it again: your axis has cells for *shapes that must not parse*, and the gap is
**shapes that must not parse because of where they sit** — inside a fence, inside a span, inside a
sentence. **That is the third time this review that the fix was right and the frontier moved one step
outward**, and it is a much better place to be than round 3. **R49 is the exception to all of that
praise and I am not softening it:** the fix was two lines, it was reported as done, and one `grep`
disproves it.

### Owner questions — round 5

Two dispositions. **Neither is "apply this fix?"**

1. **R45–R48 — has the free-text residual's deferral stopped paying?** The residual says the
   `Depends on:` **convention change** is out of scope and *"re-raise only if the convention change is
   scheduled independently."* **I am not overriding it — I am reporting that the evidence it was
   deferred on has changed, which is the owner's to weigh.** Five rounds, **15 findings on this one
   function**, four more today; every fix has been correct, and each has revealed that the *next*
   ambiguity of parsing prose-adjacent free text was one step further out. Options: **(a)** **fix the
   four now** — bounded and individually cheap, keeps the residual as-is, and accepts that a round 6
   may find a fifth locating shape; **(b)** **fix R46 only** (the fabricated-absence one — the only
   direction the owner has ruled against twice) and **accept R45/R47/R48 as a residual**, on the honest
   basis that no live brief triggers them and a wrong-but-visible dependency is the tolerable
   direction; **(c)** **schedule the convention change** — a machine-parseable declaration form —
   which retires this entire class permanently and **would be the residual's own re-raise condition
   being met**, at the cost of touching every brief, `/fkit-task-plan` and both movers. *(My input, not
   my decision: (b) is the best value today; (c) is the only option that ends the class. I would not
   choose (a) without expecting a round 6.)*
2. **R41(b) / round-4 owner-question 4 is STILL OPEN and I am re-surfacing it, not re-asking it.** The
   coder decided **(a) hard-fail** under the standing "work without me" instruction and correctly
   flagged it for override; the owner has not ruled. **I verified the reasoning and it is sound** — a
   separator-less block is not a GFM table, so the hard-fail falls out of correct parsing rather than
   policy, and Codex's attack on it is disproven. **Nothing needs to change**; it needs a ruling on the
   record, because it is the one place a coder decision extends an owner ruling (R2's hard-fail) to a
   case the owner did not consider.

**Not owner questions — coder's call under the standing instruction, R23/R31/R33/R35/R44 precedent
available:** **R52** (unreadable brief: check the read, or a residual on the same trust-model basis R15
/R26/R42 rest on) and **R53** (one exact-stdout assertion on the `depends-unparseable` record).

## Round 6 — dedupe, verification and convergence

**Reviewers run: both.** My own pass + the model-diverse Codex pass (codex-cli 0.144.4, read-only
sandbox), routed through the adversarial reviewer, which re-executed all 7 of Codex's findings
(6 confirmed, **1 rejected**) and added 3 of its own. **Coverage: full. Nothing skipped.**
**I re-verified every reported finding myself, end-to-end, against the unmodified script with real
on-disk fixtures.** Every one reproduces. **`dashboard.sh` sha256 unchanged across the review.**

**Dedupe.** 10 raised → **9 novel** (R54–R62). **R54/R55/R56 were raised by BOTH passes independently.**
**1 suppressed as settled: X5** (form-priority vs R44) — rejected by the adversarial reviewer before it
reached me and independently by me; actioning it would re-open R37. See the suppressed list above.
**Checked against every residual:** R54/R55/R58–R61 are **not** R45 re-litigated — R45 is scoped to the
case with **no** span or fence; all of these **have** one and are mechanically decidable. R62 is not
R2/R17/R29 re-litigated: it is the **untouched half** of that class and **pre-exists at `9c2fe22`**.

**Where I overrode a reviewer — the important one.** The adversarial pass marked the grep/awk dialect
split **"PARTIALLY reasoned-only"** and reported *"I executed the macOS BSD grep side (it **does** match
a tab, so the two dialects agree here)"*, downgrading it to a Linux-only inference. **That evidence is
wrong, and it is wrong in the coder's favour.** `grep` on this host is **`ugrep 7.5.0`**, which shadows
`/usr/bin/grep` on `PATH` and is a **third dialect**. Re-run against the real BSD grep under `LC_ALL=C`:
**tab → grep 0, awk 1. The guard rejects what the parser accepts, on stock macOS, executed.** I made
the identical mistake first and caught it only by checking `grep --version` — **which is why "both
reviewers are inputs, not authorities" is in my instructions, and why it applies to me too.**
**Consequence beyond R56: the 80 dashboard tests have been green against ugrep, not BSD grep.**

**Regression sweep — clean, and I checked rather than assumed.** 106/106 green (26 launcher + 80
dashboard; the coder's `99 → 106` reproduces exactly), **twice**, with byte-identical stdout. `sum = M`
on both live plans. **Zero drift on sprint-2.** Both exact-stdout pins pass. **R62 executed against a
real `9c2fe22` checkout: byte-identical phantom — not this diff's.** Every round-5 fix verified by
**control**, not assertion (R47/R48/R49/R53 all genuinely landed; `grep -c 'rule 1'` → **1**).

**Convergence call: CLOSE IT — and this is the first round I am recommending closeout.**
Zero re-litigation for the **sixth** round; the 9 findings are novel and real. **But novel is not the
same as worth fixing.** The parser class is **CommonMark-in-awk**, and it is unbounded: R46/R47/R48 made
rule 5 narrower to escape, not closed, and round 6 found **six more escapes** in shapes that **occur in
zero of 53 briefs**. Each round the input gets more exotic and the fix gets more expensive — that is a
frontier, not a defect backlog. **The Codex pass reached the same root cause independently, which is the
strongest signal in this round.** **R45's escalation is the real answer, and it now governs 8 findings
rather than 1** — the convention change makes the class *disappear* instead of shrinking.
**Recommended: fix R56 + R57 (both cheap, both ledger-integrity rather than parser — and both are cases
of a fix reported as done that grep contradicts, which is the one class this ledger cannot afford to
carry), record R54/R55/R58–R62 as ONE residual naming the class, and close.** A seventh parser round is
churn, and the coder was right to ask.

**⚠️ Environment blockers — carried, still not review items, now three.** (1) **bash 3.2-vs-5.x**
unverified, third round running — needs a bash-5 host, not a reviewer. (2) **The LLM-side half**
unverified. (3) **NEW: `grep` on this host is `ugrep`**, so the suite's grep semantics are
unrepresentative of both BSD and GNU — R56 is the first thing it hid, and it hid it from **two**
reviewers.

**Also flagging, not a finding:** both `fkit-stateful-review` and `fkit-adversarial-review` are
**disabled for model invocation in `skillOverrides`**. Both procedures were followed manually and
coverage is unaffected — but if that block is unintentional it is worth the owner knowing, since it
silently degrades the reviewer role's own tooling.

## Coder response           ← coder-owned

**Round 1 — every finding verified against the code by execution, not deference.** Severity is mine,
traced from blast radius; it agrees with the reviewer's labels in all 16 cases. **No finding was
suppressed as re-litigation** — the residuals correctly pre-scope R1/R4 out of the free-text decision
and R3 out of the `unrecognized` ruling, and I concur on both.

Owner rulings carried in: **R2 → hard-fail (a), 2026-07-16.** R4/R12/R15 delegated to me, 2026-07-16.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Anchor `depends_raw` to the **bold** declaration `\*\*Depends on:`. Verified 32/32 live briefs use it; the only non-bold hits are code-span prose. Line-anchoring would be **wrong** — real declarations appear mid-line (`date+reason. **Depends on: …`). | ✅ done |
| R2 | CORRECT | Defect | Owner ruled **(a)**: a row that fails to parse → `die()` → non-zero exit → SKILL.md's flagged hand-built fallback. Removes `NF < 5` silent skip. `M` becomes the table's row count again. | ✅ done |
| R3 | CORRECT | Defect | Root shared with R5. `unknown` marker → nonconformance **only**; skip the rule-3 cross-check so it cannot set `disagree`. Restores §4.2's split. | ✅ done |
| R4 | CORRECT | Defect | Owner delegated → **drop the 72-byte cap entirely**; sentinel carries raw text per §4.2. Correctness over table width. | ✅ done |
| R5 | CORRECT | Defect | Root shared with R3. `marker_key ""` → empty (not `unknown`), restoring the `:316` guard. Brief with no `## Status` → `drift nonconformance kind="brief-missing-status"`, **no** override — an absent source says nothing (SKILL.md:88). | ✅ done |
| R6 | CORRECT | Defect | Moved brief with no `## Sprint` → emit `drift missing-sprint` fact instead of rendering clean. Fail loud, not silent. | ✅ done |
| R7 | CORRECT | Defect | Tab is IFS whitespace, so empty fields don't hold position. Switch the awk→bash field delimiter to `\x1f` (US), which is not IFS whitespace. | ✅ done |
| R8 | CORRECT | Defect | Fall back to the plan's **filename** for the sprint name when H1 doesn't parse; if still unresolved, emit a fact rather than silently disabling rule 1. | ✅ done |
| R9 | CORRECT | Defect | Document **both** `drift disagreement` shapes in SKILL.md's FACTS grammar. The mirror the residual predicted, drifted on day one. | ✅ done |
| R10 | CORRECT | Defect | Add exact-stdout assertions for the core cases (§7 mandates it). This is the finding that *caused* R2/R3/R7 to ship green — the highest-leverage fix in the round. | ✅ done |
| R11 | CORRECT | Defect | Rewrite the §7-case-12 fixture with a real clause boundary; assert the trim point, not `length < 400`. | ✅ done |
| R12 | CORRECT | Defect | Owner delegated → implement the actual **first-clause** trim (cut at `. `), drop the 120-byte word cut. **Not a spec contradiction with R4:** §4.2's "raw" governs the *sentinel*; "first clause" governs the *Status cell*. Different cells. | ✅ done |
| R13 | CORRECT | Defect | Delete the stale *"step 2 needs it"* rationale at SKILL.md:58. The one remaining place the LLM is primed to re-derive. | ✅ done |
| R14 | CORRECT | Defect (latent) | Drop the `\|\| echo 0`; `grep -c` already prints `0`. Unreachable today, arms itself if guard order changes. | ✅ done |
| R15 | CORRECT | **Frontier** | **No code change.** §5.1 sanctions reading "each brief it links"; the *fallback* search is already confined to `tasks/{backlog,done,cancelled}`; narrowing read-scope is a design decision, not an implementation detail, and the reviewer agrees it is arguably beyond this task. → residual. | won't fix (frontier) |
| R16 | CORRECT | Defect | "six columns" → **five** at SKILL.md:171 and :221. `:221` is the fallback, so it currently instructs a six-column hand-build. | ✅ done |

### Round 2

**All 10 verified by execution before any edit. 10/10 CORRECT — zero disproven.** Severity mine;
agrees with the reviewer's throughout.

**I accept the round-2 meta-finding without reservation, because it is the correct diagnosis:** R17,
R19 and R20 each closed **the instance the finding named, not the class it belonged to** — and R18 and
R21 are worse than that: they are damage *my own round-1 fixes* did. R18 traded a false override for a
false silence (real drift hidden), and R21 manufactured drift out of formatting. A fix that creates a
defect is not a fix. Round 2 is therefore not "more findings"; it is round 1 not having been finished.

**Fixed by class, not by case.** Each of the three now has a stated class invariant in the code:
- **Row admission** (R17, R24, R26) — *"can any line in the table fail to produce a record?"* `NF<5`
  was one of three doors; empty-Status and pipe-less rows were the others. Control records are now
  out-of-band (`D`/`M` field) so legitimate data cannot impersonate one.
- **Field location** (R19) — *"what forms does the project actually document?"* The bold anchor fit one
  author's convention; `fkit-task-plan:70` — the repo's only dependency-recording instruction —
  prescribes an **unbolded** form the anchor rejected. Now accepts bold, plain, and `## Depends on`,
  still rejects code-span prose, and **fails loud** (`drift depends-unparseable`) rather than claiming
  `none recorded`, which the LLM would print as `ready` — inventing an absence.
- **Truncation** (R20) — *"where else is the raw text cut?"* Removing the byte cap left `grep -m1`,
  which is line-based. Declarations are now joined across wraps.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R17 | CORRECT | Defect | Rewrote row admission as a **class**: every candidate line yields exactly one record. Empty-Status → `missing-status-cell` + counted (`unrecognized`) so `sum = M` holds; GFM rows without outer pipes admitted; `M` is the table again. | ✅ done |
| R18 | CORRECT | Defect (**mine**) | Reverted my over-correction. The split is **override-scoped** (§9: *"the override applies to one and not the other"*), not detection-scoped. Only an **unparseable** marker (`unknown`/absent) skips the comparison — it can never equal the brief's key, which is R3's actual mechanism. Every parseable marker gets the full cross-check. | ✅ done |
| R19 | CORRECT | Defect | Anchor widened to the documented forms + loud `drift depends-unparseable` fallback. **Reviewer's owner-question 3 → (a).** Not (b): (b) is the brief-format convention change the task's scope boundary and the residual both defer. (a) is the script conforming to a contract the project already documents — a defect fix, not a convention change. | ✅ done |
| R20 | CORRECT | Defect | Declaration joined across wraps; two live bold forms handled (`**Depends on: x.**` stops at the close; `**Depends on:** <content>` does not, or the field is lost). Caught by my own new loud fact on live task 41. | ✅ done |
| R21 | CORRECT | Defect (**mine**, regression) | Presentation no longer rewrites semantics: `st` feeds every check, `st_cell` only the board. | ✅ done |
| R22 | CORRECT | Defect | Plan-level drift (no task id) now reaches the roll-up clause via its own arm. | ✅ done |
| R23 | CORRECT | **Frontier** | **No code change** → residual. Reviewer's owner-question 2 → **(a)**, decided under the owner's standing "as much as possible without me" instruction. Reasoning recorded in the residual; **flagged to the owner as a call made on their behalf.** | won't fix (frontier) |
| R24 | CORRECT | Defect | Control records out-of-band; a literal `MALFORMED` status is data → `unknown-marker`. | ✅ done |
| R25 | CORRECT | Defect | Missing **date** and missing **reason** now named separately. | ✅ done |
| R26 | CORRECT | Defect | Literal US neutralised at parse. Fixed despite "not a live risk": the cost was one `gsub`, and it removes the only remaining input that corrupts the board at exit 0. | ✅ done |

### Round 3

**10/10 CORRECT, verified by execution. 9 fixed, R35 deferred as a residual.**

**R36 is the finding of this review, and I accept it completely.** *"Fixtures contain the shape that
works"* — the round-2 fixture for `**Depends on:** <content>` was live task 41's declaration
**flattened onto one line**, and flattening is exactly what hid the bug the real wrapped declaration
carries. **A fixture derived from the implementation cannot falsify the implementation.** That is why
the count sat at 16 → 10 → 10 while every suite stayed green: not three rounds of bad luck, one
method error repeated. The reviewer's diagnosis was better than my own.

**Method changed, per the recommendation:**
1. **The grammar is written down** in the code — 4 closed forms (S/BL/BI/P), each with its terminator.
2. **One path.** Locate → join → extract → sanitise → emit. **No branch may `print` and `exit`** (that
   dropped a fan-in's second item and skipped `|` sanitising → a six-column board at exit 0), and **no
   completion test may be satisfiable by its own label** (`/\*\*Depends on:.*\*\*/` matched
   `**Depends on:**` itself → live task 41 lost `(hard)`).
3. **A fixture matrix**, shapes taken from **live briefs**, not from what the parser accepts:
   {4 forms} × {wrapped · fan-in · pipe · double-declaration}.

**The matrix immediately earned itself: it caught a defect I introduced in this very round** — awk's
greedy `.*` selected the **last** `**Depends on` once wrap-joining existed, so live task 36 silently
dropped tasks 25, 26 and 27 (`index()` now anchors to the first). Neither review round could have
caught that; it did not exist until I wrote it.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R27 | CORRECT | Defect | Section branch no longer `print`+`exit`s: it joins and flows through the single sanitiser. Fan-in and `\|` both handled. | ✅ done |
| R28 | CORRECT | Defect (**live**) | Completion test replaced. Form is decided **before** extraction (BL vs BI), so no test the label can satisfy. Live task 41 keeps `(hard)`. | ✅ done |
| R29 | CORRECT | Defect (**mine**, regression) | Answered the **twin class question** the reviewer named — *"can a line produce a record that is NOT a row?"* A table is a contiguous block: it ends at the first blank/pipe-less line. Prose is neither admitted nor fatal. | ✅ done |
| R30 | CORRECT | Defect | Plain branch now requires a colon **and** rejects code-span; bold/section are located before it. | ✅ done |
| R31 | CORRECT | Defect | **Reviewer's owner-question 1 → (a)**, decided under the owner's standing instruction. `**Depends on nothing.**` is a **declaration** (colon optional when bold; 4 live briefs), so it parses — no false drift. `depends_mentioned` narrowed to bold-or-colon and made case-sensitive, so English prose ("depends on the owner ruling") no longer manufactures drift. **Not (b):** (b) sends a genuine colonless declaration silently to `ready` — false-silent, the direction the owner has ruled against twice. **Not (c):** the deferred convention change. | ✅ done |
| R32 | CORRECT | Defect | All 7 nonconformance kinds + `depends-unparseable` documented. **Plus a standing instruction**: an unlisted record must be reported as-is with the grammar flagged stale — the mirror will drift again, so the skill now degrades loudly instead of skipping. | ✅ done |
| R33 | CORRECT | Defect (**mine**) | **Reviewer's owner-question 2 → (a).** The sentinel is documented, with **one sanctioned exception** to "do not re-open the brief" — because that rule exists to stop the LLM drifting from what the script saw, and here the script saw *nothing*, so its rationale does not apply. Falls back to `waiting on owner` + beat 6 if still underivable. **Not (b):** overloads a next-step that means *disagreement*. | ✅ done |
| R34 | CORRECT | Defect | GFM `\|` parked before the split and restored still-escaped. Was rendering a six-column board with the priority set to cell debris. | ✅ done |
| R35 | CORRECT | **Frontier** | **No code change** → residual. Header-by-content is what the spec's own parse implies, and the alternative (positional) is worse against hand-edited plans. Low, and the reviewer called it optional. | won't fix (frontier) |
| R36 | CORRECT | Defect (**method**) | The fixture matrix above. This was the finding worth holding the task for, and it was right. | ✅ done |

### Round 4

**8/8 CORRECT, verified by execution. 7 fixed, R44 → residual. Zero regressions introduced.**

**The synthesis was the finding — and it was right: all four highs were ONE defect wearing four hats.**
`depends_mentioned` was a **second, narrower grammar** than the closed one `depends_raw` documents, and
the loud path was gated on `depends_raw` returning **empty** rather than on a declaration **existing**.
Those are different questions, and conflating them is what produced every high:
non-empty-but-wrong never consulted the guard (R37/R38); a form the *guard* didn't know went silently
to `none recorded` → `ready` (R39/R40).

**The fix is structural, not four patches: the second grammar is deleted.** `depends_raw` now emits
`<form>␟<content>` — *no output* means no declaration, *empty content* means one we could not read —
and the caller branches on **that**. There is one grammar. Nothing else may pattern-match the field.

**R39 was the sharpest and I record it plainly: my own rule-4 comment cited "4 live briefs" and I had
not checked them. Only 1 of the 4 is bold; 3 are plain colonless.** I shipped option **(b)** — the one
my own rationale rejects by name — and asserted a fact about my own repo that a `grep` disproves. Now
fixed: bold and plain both accept an optional colon; plain is anchored to line-start-or-list-marker so
prose is still excluded.

**R36's lesson, one level up (the reviewer's diagnosis again):** *"your matrix has no negative space —
every cell is a well-formed declaration, so nothing in it can falsify the fallback."* Round 3 fixed
where fixtures came from; it did not fix that they were all happy-path. **Added the negative axis:**
{prose-with-colon · code-span · near-miss heading · label-with-no-content · sub-bullets} ×
{before/after the real declaration}. **4 of round 4's 8 findings are cells in it.** Mutation-checked:
unanchoring the plain form → 3 red; re-gating the fallback on emptiness → 5 red; ending the join at
sub-bullets → 1 red.

**The contract, in one line, now pinned by tests:** *silence means no declaration; loud means a
declaration we could not read — never the reverse.* A false alarm is visible; a fabricated `ready` is not.

*(Also fixed en route, found by nothing but running it: an apostrophe in a comment INSIDE the
single-quoted awk program — `SKILL.md's` — terminated the string and broke the script outright.)*

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R37 | CORRECT | Defect | Forms are chosen by **priority (S → B → P), not line order**. awk runs per-LINE, so gating on `!form` meant the first *line* won and prose outranked the real declaration. Restructured to collect lines, then select the form in `END`. | ✅ done |
| R38 | CORRECT | Defect | The join treats a **more-indented list item as a sub-bullet of the declaration**, not its end. `**Depends on:** hard prerequisites:` + `- task 12` / `- task 13` returned a non-empty lead-in with both tasks gone — the exact case that proves emptiness is the wrong gate. | ✅ done |
| R39 | CORRECT | Defect (**mine**; a claim I asserted without checking) | Colon optional for bold **and** plain; plain anchored to line-start/list-marker. All 4 live `Depends on nothing` briefs now parse. | ✅ done |
| R40 | CORRECT | Defect | Section heading tolerates trailing punctuation (`## Depends on.`). | ✅ done |
| R41 | CORRECT | Defect | The **admission window** is now explicit: opens **at** the separator, closes at the first blank/pipe-less line. Closes both remaining doors — pipe-prose *before* the table, and separator-less blocks. **Owner-question 4 → (a)**, decided under the standing instruction: GFM makes the delimiter row mandatory, so a block without one is **not a table and has no rows** — the hard-fail falls out of correct parsing rather than being a policy choice, and it does not contradict R23 because there is no usable board to preserve (markdown renders it as prose too). **Surfaced for override.** | ✅ done |
| R42 | CORRECT | Defect | Literal `\002` neutralised alongside `\037`. Fixed on the same one-`gsub` cost argument that settled R26 — consistency beats a residual here. | ✅ done |
| R43 | CORRECT | Defect (**mine**; a ✅ I did not earn) | R22(b) was marked done while only (a) was fixed. The mirror text now names **rule 1**, not "the moved-row rule". **The 4th cash-in of the mirror residual (R9→R22→R32→R43) is data about the residual, not about the reviewer** — noted for the owner. | ✅ done |
| R44 | CORRECT | **Frontier** | **No code change** → residual. First-wins is **live-validated on task 36** and must not change; a second *separated* declaration is a brief-authoring defect, not a parser defect. | won't fix (frontier) |

### Round 5

**9/9 CORRECT (R52 partially). 7 fixed, R45 + R52 → residuals + 1 owner escalation.**

**R49 first, because it is the worst thing in this review and it is mine.** I wrote in the round-4
ledger: *"The mirror text now names **rule 1**, not 'the moved-row rule'."* It did not.
`grep -c 'rule 1' SKILL.md` returned **0**, and the line I *added* carried the wrong text. I marked
`✅ done` twice on the same two lines (R22 → R43), and **R43 was itself the finding that R22 had been
marked done while unfixed.** So: a false ✅, on a finding about a false ✅, in a ledger whose whole
purpose is to be the record. The defect is low; **the verification failure is not**, and it is exactly
what `conventions/evidence-before-assertion.md` exists to prevent. I have now verified it by grep,
not by intent: `grep -c 'rule 1'` → 1.

**The reviewer called it: (1)+(2)+(3) landed. All four round-4 highs closed and stayed closed; zero
regressions; zero live defects; the R41 window survived a hostile round untouched — the first
component to do so.** It is still not a closeout, and the reason is precise and worth recording:

> **The class I closed is not the class that opened.** Rounds 1–4 asked *"which form wins?"* and *"is
> the guard the same grammar?"* — both settled. Round 5 is **grammar rule 5's content**: rules 1–4 each
> got a code path; **rule 5 got one regex**, and it was the only rule whose implementation was
> narrower than its sentence.

**The negative axis had cells for *shapes that must not parse*. It had none for *shapes that must not
parse because of where they sit* — in a span, in a fence, in a sentence.** That is the fourth time the
fix was right and the frontier moved one step out.

**R46 is the high and the direction that matters:** rule 5 was implemented as a **line-scoped veto**
(`line does not contain a span mention`) while rule 3 **orders** over-including trailing prose — so a
real declaration sharing a line with a span mention was discarded whole → `none recorded` → a
**fabricated `ready`**. Fixed by **masking, not vetoing**, with **length preserved** so we LOCATE on the
masked copy and EXTRACT from the raw one — necessary because a dependency may legitimately *be* a code
span. Mutation-checked: reverting to the veto → 5 red; dropping fence exclusion → 5 red.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R45 | CORRECT | **Frontier** | **No code change** → residual + **owner escalation**. This is the one genuinely *semantic* member of the class — `The **Depends on:** field is free text` vs `- **Depends on: task 42.**` are indistinguishable by position, and B cannot be line-anchored (live briefs declare mid-line). Every mechanical discriminator is a guess. **The honest fix is the convention change the residual defers — the owner's call, not mine.** | won't fix (frontier) |
| R46 | CORRECT | Defect (**high**) | Mask code spans instead of vetoing the line; length preserved so locate-on-masked / extract-from-raw. Closes the fabricated-absence direction. | ✅ done |
| R47 | CORRECT | Defect | Same masking closes it — a bold declaration inside a span is an example. | ✅ done |
| R48 | CORRECT | Defect | Fenced blocks (``` and ~~~) excluded from locating and from the join; no fence marker can leak into the sentinel. 4 of 41 live briefs carry both a fence and a declaration. | ✅ done |
| R49 | CORRECT | Defect (**mine — a false ✅, twice**) | `SKILL.md` now says **drift rule 1** and explains the phantom-drift consequence. **Verified by grep, not by intent.** | ✅ done |
| R50 | CORRECT | Defect | `form="S\|BL\|BI\|P"` documented. | ✅ done |
| R51 | CORRECT | Defect | **One** `STATUS_HEADING_RE`, used by all three call sites. Two grammars for one question is the class this script's own comments forbid; three was not better. A `## Status report` section no longer emits a false `multiple-status-tables`. | ✅ done |
| R52 | PARTIALLY CORRECT | **Frontier** | **No code change** → residual. I agree with the reviewer's override of Codex's HIGH → low: an unreadable brief still fires `brief-missing-status`, so it is **not silent** — which is the property that matters. A second fact for the same condition buys a record kind on a mirror that has drifted five times. | won't fix (frontier) |
| R53 | CORRECT | Defect (**method**) | The negative axis and the exact-stdout pin never intersected — no assertion had ever seen the **loud path's** full output, which is exactly how an undocumented `form=` shipped green. Added an exact-stdout pin **on the unhappy path**. This retires R50's class permanently, as the reviewer said it would. | ✅ done |

**Disproven and not chased:** Codex's HIGH on one-hyphen delimiter cells — GFM permits a single `-`
per cell; the script is right and `9c2fe22` agrees. The reviewer refuted it before it reached me.

### Round 6 — **closeout**

**9/9 CORRECT, 0 high. 2 fixed, 7 recorded as ONE residual naming the class. I accept the reviewer's
convergence call: close it.**

**The pattern I have to own, because it is now three-for-six.** R43, R49, and now **R56/R57** are all
the same failure: **a fix I reported done that `grep` contradicts.** R51 was recorded as *"used by all
three call sites"* — it reached two. R50 was recorded as done — its second half was untouched. This is
the one class this ledger cannot afford, because the ledger *is* the record: a false ✅ does not just
leave a defect, it **destroys the evidence that the defect exists.** Every claim in this round's rows
is verified by control output quoted in the session, not by intent.

**The most valuable finding in six rounds is R56's second half, and neither of us found it first —
the reviewer found it by catching *itself*.** `grep` on this host is **ugrep**, shadowing
`/usr/bin/grep`. Against real BSD grep, `[ \t]` is the literal set `{backslash, space, t}` and does
**not** match a tab, while awk expands it and does: `## Status<TAB>` made the guard `die` while the
parser accepted. **Two reviewers were fooled by the same shadowed binary**, and my 106 tests had been
green against a grep no consumer has. Fixed with a **real tab expanded in bash**, so neither engine
parses the escape. **The suite now runs green against BSD grep as well as ugrep (107/107 both).**
That is a third environment gap, and unlike bash-3.2-vs-5.x, this one is closed.

**Why this is a closeout and not round 7** — the reviewer's argument, which I verified and agree with:
the findings are a **converging series**. R1 needed **bare prose** — live, and wrong on this task's own
brief. R47 needed **one backtick** — plausible. Round 6 needs double-backtick runs, spans crossing
lines, stray backticks, `**` inside a span value, `~~~` closing a ``` fence. **Zero of the seven occur
in 53 live briefs; five have no reason to ever be written.** The root cause is one thing, reached
independently by the reviewer and the Codex pass: `maskspans` + `F[]` are **CommonMark-in-awk**, and
*"patching six cases leaves the seventh."* R46/R47/R48 did not close rule 5 — they made it narrower to
escape. **Recorded as one residual naming the class** rather than churned; the only fix that ends it is
the convention change, which is the owner's and out of scope by this task's own terms.

**The best evidence in the round is not mine:** the owner edited the live sprint plan mid-review —
tasks 42/43, briefs the script had never seen, including a wrapped BL declaration. Parsed correctly,
`— of 43`, sum = M, zero drift. **A blind live regression test, passed.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R54 | CORRECT | **Frontier** | → the CommonMark-in-awk residual. Multi-backtick span runs. | won't fix (frontier) |
| R55 | CORRECT | **Frontier** | → same residual. `~~~` closing a ``` fence. | won't fix (frontier) |
| R56 | CORRECT | Defect (**mine — a false ✅, third time**) | **(a)** All three call sites now share one `STATUS_HEADING_RE` — verified by control, not by claim. **(b)** The real find: **real tab, not `\t`**, because BSD grep and awk genuinely disagree on `[ \t]`. Suite re-run green under **both** greps. | ✅ done |
| R57 | CORRECT | Defect (**mine — a false ✅, fourth time**) | `SKILL.md` now says **six times**, and names that it was twice recorded fixed when it was not. The mirror's own honesty is the only thing keeping it useful. | ✅ done |
| R58 | CORRECT | **Frontier** | → same residual. Stray backtick masks to EOL. **Bad direction (fabricated absence)** — recorded explicitly in the residual, requires a malformed brief. | won't fix (frontier) |
| R59 | CORRECT | **Frontier** | → same residual. Codex's catch, and a good one: locate-on-mask/extract-on-raw was applied to the *locate* and skipped on the *terminator*. **Bad direction.** | won't fix (frontier) |
| R60 | CORRECT | **Frontier** | → same residual. Spans crossing lines. | won't fix (frontier) |
| R61 | CORRECT | **Frontier** | → same residual. Pseudo-closer with trailing text. | won't fix (frontier) |
| R62 | CORRECT | **Frontier** | → residual (row admission). A separator with **no header row** yields a silent phantom task. **Explicitly NOT a regression — `9c2fe22` is byte-identical**, so this is pre-existing and outside what this task changed. No live plan omits a header. | won't fix (frontier) |

**Suppressed as settled:** Codex's X5 (form-priority vs R44 first-wins) — rejected by the adversarial
pass *and* independently by the reviewer; actioning it re-opens R37. Correctly not brought to me.

## Accepted residuals (shared, do-not-re-litigate)

- **`unrecognized` as a 7th roll-up term** — What: markers outside the closed six are counted into an
  `unrecognized` bucket and reported as `drift nonconformance kind="unknown-marker"`. Why (structural):
  §5.3's six-term vocabulary and `sum = M` by construction are in tension — a 7th bucket is what stops an
  out-of-vocabulary marker silently vanishing from the sum. Rejected alternative: dropping the row from
  the roll-up (breaks `sum = M`, the task's core invariant). Owner ruled **keep**, 2026-07-16.
  Re-raise only if: the roll-up's term vocabulary becomes an externally-consumed contract, or `sum = M`
  is dropped as an invariant. *(R3 is **not** a re-raise: it concerns the override, not the term.)*
- **`Depends on:` stays free text; the sentinel carries raw text, the LLM resolves `ready`/`after N`** —
  What: the script never interprets the dependency. Why (structural): constraining the format touches
  every brief, `/fkit-task-plan`, and both movers (§4.2, §2). Rejected alternative: bundling the
  convention change here. Re-raise only if: the convention change is scheduled independently.
  **R1 and R4 are not covered by this** — *locating* and *transmitting* the field are not *interpreting* it.
- **`bash <path>`, never `./<path>`; the shebang is decorative** — What: ADR-017 rule 2. Why
  (structural): `install.sh:44-46` chmods a hardcoded two-name list; editing the `curl | sh` entry point
  is the repo's highest-blast-radius change for zero gain. Re-raise only if: an installer change is
  already being made for another reason. **Verified compliant this round — do not re-review.**
- **`SKILL.md` carries a minimal literal copy of the `⟦FACTS⟧` grammar** — What: only the record kinds
  beats 2/6 narrate from (`drift …`, `count …`, `total`); `derive` is deliberately excluded. Why
  (structural): a full copy is a fifth hand-maintained mirror; a bare cross-reference is a file the LLM
  may never open (§8 OQ1). Re-raise only if: the mirror drifts in a way that changes narration —
  **which R9 asserts has now happened.** *(R9 fixed 2026-07-16: both `drift disagreement` shapes and
  every `nonconformance` kind are now documented. The mirror remains a mirror; this residual stands.)*
- **`Depends on:` cannot be located reliably from free text — the "CommonMark-in-awk" class**
  (R45, R54, R55, R58, R59, R60, R61) — **Amended 2026-07-16 (round 6). The previous version of this
  entry was written after round 5 and said spans and fences are "mechanically decidable (R46/R47/R48,
  **fixed**)". Round 6 disproved that, so the rationale is corrected here rather than left standing:**
  a residual that misdescribes the code is the same failure as a mirror that misdescribes the script,
  and I have now committed that failure three times (R43, R49, R56/R57). Recording the correction, not
  the original claim.
  - **What:** `depends_raw` locates a free-text field by pattern. Seven known shapes defeat it: a
    bolded prose *mention* outranking a real declaration (R45 — semantic); multi-backtick span runs
    (R54); `~~~` closing a ``` fence (R55); a stray backtick masking to end-of-line and swallowing a
    real declaration (R58); a `**` inside a span value truncating the BI terminator (R59); spans
    crossing lines (R60); a pseudo-closer with trailing text (R61).
  - **Why (structural):** these are not seven bugs, they are **one**. `maskspans` + `F[]` are an
    **ad-hoc CommonMark implementation in awk**, and the reviewer and the Codex pass reached that root
    cause independently: *"patching six cases leaves the seventh."* R46/R47/R48 did not close rule 5 —
    they made it narrower to escape. The series is visibly converging on nothing: R1 needed **bare
    prose** (live, and wrong on this task's own brief); R47 needed **one backtick** (plausible); round
    6 needs double-backticks, spans across lines, stray backticks, `**` inside a span, `~~~` inside
    ```. **Zero of the seven occur in 53 live briefs, and five have no reason to ever be written.**
  - **The direction is the tolerable one for six of seven.** R58 and R59 fabricate an absence
    (`none recorded` → `ready`), which is the bad direction — but both require a malformed brief, and
    the alternative (a real markdown parser, or a second toolchain) costs more than the class does.
    ADR-017 rule 3 forbids reaching for one without a new owner decision anyway.
  - **Rejected alternatives:** patch each shape (the round-6 findings *are* that path's output, and it
    has no end); anchor B like P (breaks live briefs, which declare mid-line); require a
    task-number-shaped payload (guesses the free-text field this residual exists to protect).
  - **The only fix that ends the class is the `Depends on:` convention change** — every brief +
    `/fkit-task-plan` + both movers. That is **out of this task's scope by its own terms**, it is the
    change the free-text residual defers, and **it is the owner's to schedule, not the coder's to
    smuggle in.** Escalated 2026-07-16; see the report.
  - **Re-raise only if:** any of the seven shapes appears in a live brief; the convention change is
    scheduled (the class then disappears rather than shrinking); or a shipped markdown parser becomes
    available to the script under a new consumer-runtime decision (ADR-017 rule 3).
- **An unreadable brief yields `none recorded` rather than its own fact** (R52) — What: if a brief
  cannot be read, `depends_raw` finds no declaration and the row reads `none recorded`. Why
  (structural): it is **not silent** — `brief-missing-status` already fires for the same brief, so the
  owner is told the brief is unreadable; that is the property that matters, and the LLM is not handed
  a clean `ready`. A dedicated second fact for the same condition adds a record kind to a mirror that
  has already drifted five times (R9→R22→R32→R43→R49) for no new information. Reviewer independently
  overrode Codex's HIGH to low on the same reasoning. Re-raise only if: `brief-missing-status` stops
  covering the case, or an unreadable brief is ever observed reading as `ready`.
- **A `## Status` separator row with no header above it yields a phantom row** (R62) — What: the
  admission window opens at the separator, so a pipe block whose header is missing admits whatever
  follows. Why (structural): **explicitly not a regression — `9c2fe22` is byte-identical on this
  input**, so it predates every change in this task and is outside what the task set out to fix. No
  live plan omits a header row, and a headerless table does not render as a table in any markdown
  viewer, so the failure self-announces to the human before it reaches the script. Fixing it means
  re-introducing a header grammar, which is the class R51 (and R35's withdrawal) exists to keep at
  one. Rejected alternative: requiring a header row (a second heading grammar, for a shape nothing
  produces). Re-raise only if: a live plan omits a header row, or the admission window is reworked for
  another reason. Raised by the Codex pass, round 6.
- **The FIRST declaration in a brief wins; a second, separated one is ignored** (R44) — What: when a
  brief contains two declarations that are not part of one wrapped block, `depends_raw` takes the
  first and never reports the second. Why (structural): first-wins is **live-validated** — task 36's
  continuation prose contains a second `**Depends on: 28 (hard).**`, and anything other than
  first-wins drops its real dependencies (tasks 25, 26, 27); this is the defect R28's `index()` fix
  exists to prevent, so the rule must not be touched. A brief with two *separated* declarations is a
  **brief-authoring defect**, not a parser defect: the record contradicts itself and the fix belongs in
  the brief. Rejected alternative: emitting a fact for the second — real, but it buys a report about a
  file the producer can simply correct, at the cost of a new record kind on a mirror that has already
  drifted four times. Reviewer rated it low and frontier-adjacent, and said explicitly not to change
  first-wins. **Decided by the coder under the owner's standing instruction, 2026-07-16.**
  Re-raise only if: a live brief carries two separated declarations, or `Depends on:` gains a
  machine-parseable convention (at which point the ambiguity disappears anyway).
- ~~**The `## Status` table's header is detected by content, not position** (R35)~~ — **SUPERSEDED and
  WITHDRAWN, 2026-07-16 (round 4), by the R41 fix.** This residual defended content-based header
  detection (`first two cells are Status and Priority`) against a positional alternative. R41 replaced
  the admission model entirely: the window now opens **at the separator row**, so the header — and any
  caption or prose before it — is outside the window and the content check was **deleted as dead
  code**. R35's concern is moot: a `#` line inside the table block is no longer admitted, and the
  "caption breaks positional detection" objection that justified this residual is answered by
  anchoring on the separator rather than on "the first row after the heading".
  **Recorded rather than deleted, deliberately:** a residual that no longer describes the code is the
  same mirror-drift failure R43 caught in `SKILL.md`, and silently removing it would erase the reason
  the decision changed. Nothing here is re-litigable; there is no decision left to re-raise.
- **An unresolvable plan sprint reports uncertainty rather than suppressing the cross-check** (R23) —
  What: when neither the plan's H1 nor its filename yields a `Sprint N` identity, drift rule 1's skip
  cannot apply, so every row falls through to the rule-3 cross-check. The script emits
  `drift unresolved-plan-sprint`, and (since R22) that reaches the roll-up's drift clause, so the
  board says its own sprint identity is unknown. Phantom drift on rows whose brief claims another
  sprint remains **possible but disclosed**. Why (structural): there is no free option. Suppressing
  the cross-check for those rows (option b) trades phantom drift for **missed real drift** — silent in
  the direction that matters, against a skill whose entire purpose is finding drift. Hard-failing to
  the §5.4 fallback (option c) is consistent with the owner's R2 ruling, but R2's door is a plan that
  **cannot be parsed**, whereas this one is merely *unconventionally named* — the board is otherwise
  fully correct, and destroying it over a naming convention is disproportionate. Reporting loudly is
  what §5.4 does for a degraded-but-usable result. Rejected alternatives: (b) miss real drift; (c)
  hard-fail a usable board. Reachable **only** when H1 *and* filename both fail — no live plan does.
  **Decided by the coder under the owner's standing "work without me" instruction, 2026-07-16; the
  reviewer flagged it as an owner call and it is surfaced in the report for override.**
  Re-raise only if: the owner rules otherwise; a live plan ever hits this path; or rule 1's skip is
  widened such that phantom drift stops being a bounded, disclosed cost.
- **Brief resolution follows the plan's link wherever it points** (R15) — What: the script resolves a
  brief by the link target the plan gives it, without asserting the result lands under
  `tasks/{backlog,done,cancelled}`; a plan linking outside the tasks tree is read, and its directory
  name can reach the report. Why (structural): §5.1 defines the read set as *"the sprint plan; each
  brief it links"* — following the plan's own link **is** the contract, and the script is read-only,
  takes no path from user input, and follows nothing the plan does not already name. The *fallback*
  search (used when a link is broken) **is** already confined to the three task dirs, so link rot
  cannot wander. Narrowing the primary resolution changes the skill's declared read-scope, which is a
  **design decision, not an implementation detail** — the reviewer agrees it is arguably beyond this
  task's scope. Rejected alternative: silently tightening it here, which would put a scope change in a
  bug-fix round with no record. Owner delegated the call to the coder, 2026-07-16.
  Re-raise only if: a plan becomes writable by something other than the owner/producer, the script
  ever gains a non-plan-derived path input, or the read set in §5.1 is revisited for another reason.
