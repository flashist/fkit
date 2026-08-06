# Plan — task `0203`: amend the sprint loop's *"Rules that make this honor the ADRs"* with the faithful-carry construction

> **Provenance.** Produced by a spawned `@fkit-coder` running `/fkit-plan-task` under
> `fkit-sprint-ship-loop` (live `fkit lead` driver session), and **approved by the owner via
> `AskUserQuestion` on 2026-08-05**. Copied here verbatim by the driver at approval, before the Build
> spawn (ADR-020).
>
> **Owner's rulings at approval:**
> - **OQ-1 → A1 (capability bound).** Step 5's trigger is *"if — and only if — you **cannot carry the
>   plan whole**"*, with the `wc -c` byte count and the reason stated. ⚠️ **This declares the driver's
>   own practice this run — pointer-only on 11–20 KB plans — OUT OF BOUNDS.** A2 (invented byte
>   threshold) and A3 (driver's judgment, self-authorizing) are **rejected**.
> - **OQ-2 → B1.** **Include** the *"honest bound on 'true by construction'"* paragraph. Rule ships at
>   **+56 / −0**.
>
> ⚠️ **Honest limit** (loop honesty clause): approval leaves no artifact of its own (ADR-021). This
> file pins *which bytes were carried*, not *which were approved*.

---

## 0. Provenance and evidence classes

**Verified firsthand at plan time, on disk:**
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` is **309 lines, 25,457 bytes**, blob `cce59c1d412d36f5e6a1b987e1b2a57f9c00d89f`.
- Dependency `0202` is **`✅ Done (agent-closed — not owner-verified)`**, folder at `ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/`. Dependency satisfied.
- Element 7's evidence is **on disk, not only testimony**: `0202`'s review ledger records the Process-review spawn prompt stating the plan was *"carried BOTH ways — paste and pointer"* and *"The paste below should match it"*, then **shipping the pointer only — no paste**, with the driver owning it.
- `git hash-object` and `wc -c` both work on an untracked `plan.md` (checked against `0191`'s: 11,154 bytes, blob `a79f916e…`).
- No test reads this file's body (see §6).

**Testimony, attributed not asserted:** that the rule "fired zero times in the run that installed it", and the round-1/round-2 carry failures. These come from `0162`'s decision report, which itself flags them as unverifiable testimony (no transcript is stored in this repo). The plan does not depend on them; the rule text below attributes them rather than claiming them.

---

## 1. What changes, and where

**Change surface: exactly one file — `claude/skills/fkit-sprint-ship-loop/SKILL.md`.** One insertion, no deletions, no edits to existing lines.

**Insertion point, anchored on text, not on a line number:** immediately **after** the first bullet of the block headed `**Rules that make this honor the ADRs:**` — the bullet that ends `…not a verifiable token.` — and **before** the bullet beginning `**The plan/build split (honesty clause) is mandatory**`.

At plan time that heading sat at `SKILL.md:149` and that first bullet spanned `:150-156`, but **re-derive it from the heading text at implementation time**; see §7.

**Nothing existing is edited.** The first bullet's own text (the three declared-approval signals, the "trust, not proof" sentence) stays byte-unchanged, including its slightly awkward existing line wrap — reflowing it would be an unrelated change in the same diff.

---

## 2. The proposed rule wording — full text

Inserted as an indented sub-block under the first bullet, so a reader hits the requirement and then its construction.

````markdown
  **How to carry it — the construction, not an exhortation** (ADR-032 D3; `0162`'s decision report
  §2/§4, owner-ruled 2026-08-02). **A faithful carry is a copy over a durable artifact, executed in the
  spawning turn — never recall over conversation state.** The requirement above shipped without one, and
  per `0162` it then fired zero times in the run that installed it: once by pointing at conversation
  state, once by pasting with silent truncations under an explicit *"everything else is byte-for-byte"*
  claim. **A language model restating a long text from its own context cannot be relied on to reproduce
  it byte-for-byte, nor to detect its own failure to do so** — so run these six steps, in order, in the
  turn you spawn.

  1. **Read `<task-folder>/plan.md` byte-exactly — `Bash(cat <path>)`, NOT the `Read` tool.** Two
     reasons, both fatal. `Read` returns **`cat -n` framing** — a line number and a tab prepended to
     **every** line — so the bytes you hold are not the file's bytes and their `git hash-object` can
     never equal its blob hash; and `Read` **caps at 2000 lines by default**, silently truncating a long
     plan *before* you have formed any judgment about it. Stripping the framing by hand re-introduces the
     exact transformation this construction exists to remove.
  2. **Check the read was whole — before pasting anything.** Run `wc -c <path>` in the same turn and
     account for **every** byte. A read that stopped short is a **failed** carry, not a carry to patch
     up: take step 5's degraded form and say so.
  3. **Paste those bytes into the spawn prompt, unaltered.**
  4. **Cite a pointer beside the paste** — the path plus `git hash-object <path>` (it works on untracked
     files, which is what these are). One line, in this form:
     ```
     plan: ai-agents/tasks/<board>/<task>/plan.md  blob c0ffee… (git hash-object)
           — unverified — no hook checks it until follow-up 3 lands
     ```
     ⚠️ **Emit that `unverified — no hook checks it until follow-up 3 lands` text every time.** The hash
     is **self-computed and self-reported**; nothing checks it until `0204`'s `PreToolUse`/`Task`
     carry-check hook lands, and a reader must never mistake it for a checked one. **Paste AND pointer —
     both, never either/or** (owner ruling, 2026-08-02, `0162` OQ-1; pure by-reference was rejected). The
     paste is what the worker acts on and is what satisfies condition (b) of the marker as written; the
     pointer is what makes the paste checkable at all. **A paste alone is unfalsifiable — which is
     exactly why the truncate-and-certify round went undetected.**
  5. **If — and only if — you cannot carry the plan whole, carry by reference only, and say so in the
     spawn prompt in those words.** Pointer alone, degradation declared, and state the `wc -c` byte count
     and why it could not be carried. **Truncation is never permissible** — not with a declaration, not
     with an ellipsis, not "omitting rationale only": **never a partial paste, and never a completeness
     claim over bytes that were cut.** A truncation that announces itself is a defect a reader can act
     on; one that certifies itself is a claim the reader cannot check. A pointer-only spawn **fails
     condition (b) as written**, so the spawned coder is **entitled to refuse it** — that is the correct
     outcome, and it is why this is the exception and not the routine.
  6. **Before you send: look at the prompt and confirm both legs are actually in it — then state the
     result.** Pasted bytes present **and** path + hash pointer present. In the degraded form: pointer
     present **and** the degradation declared. **A driver may not describe a carry as two-legged on the
     strength of intending it** — on 2026-08-02, on `0202`'s own run, a driver announced a plan carried
     *"BOTH ways — paste and pointer"* and shipped the pointer only. That is the same shape as the false
     certification this construction exists to prevent, and **the pointer is what made it detectable**.

  **Two words this construction governs. They bind the same way:**
  > **"Verbatim" is a word a driver may apply only to bytes it read from a file that turn.**
  >
  > **"Both ways" is a phrase a driver may use only after looking at what it wrote.**

  True by construction, or forbidden.

  **The honest bound on "true by construction" — do not rewrite this into a guarantee.** `cat` puts the
  file's bytes in your context *this turn*, which is strictly better than recall of a message written
  hours earlier, and that is the whole of the gain. It does **not** make the paste a mechanical copy: you
  still emit those bytes token by token. Step 4's pointer is what would let anyone notice a divergence —
  and until follow-up 3 lands, nothing does. **This construction narrows the hazard; it does not remove
  it** (ADR-031 honesty clause; `0162` §9).
````

**Size: +56 lines / −0** (the mandatory block is +48; OQ-2's B1 paragraph adds 8, owner-ruled included).

---

## 3. Where each of the seven required elements lands

| # | Element | Lands in |
|---|---|---|
| 1 | Byte-exact read, `Bash(cat …)`, explicitly **not** `Read`, **with both reasons** (`cat -n` framing, 2000-line cap) | Step 1 |
| 2 | Mandatory whole-file check against `wc -c` | Step 2 |
| 3 | Paste unaltered | Step 3 |
| 4 | Path + `git hash-object` pointer, **both paste and pointer** | Step 4 |
| 5 | The *"verbatim"*-word discipline as a governing rule | Closing blockquote, first line |
| 6 | Pointer-only degraded form; **truncation never permissible** | Step 5 |
| 7 | Presence check on **both legs** before the spawn, result stated; degraded form checks pointer + declaration | Step 6, and the second blockquote line |
| ⛔ | `unverified — no hook checks it until follow-up 3 lands` **in the rule text itself** | Step 4, inside the fenced pointer form **and** in the ⚠️ sentence after it |

The marker appears **twice on purpose** — once as the literal text the driver emits, once as the instruction to emit it. The brief's verification step 6 greps for it; both hits are in the rule text, neither in a footnote.

---

## 4. What this plan deliberately does **not** touch

- **`claude/agents/fkit-coder.md` — untouched.** Condition (b) stands byte-unchanged (`0162` §5); `0163` needs no edit.
- **No hook.** That is `0204`.
- **The Build row** of the step table (at plan time `SKILL.md:121`, the row reading `| **Build** | @fkit-coder | implement the **approved** plan…`) — untouched. That is `0164`/`0202` territory. The insertion is 28 lines below it and does not move it.
- **`§5.4`'s exit table** (the heading `## Stop conditions — the driver's exit table (§5.4)`) — untouched. That is `0208`.
- **`ai-agents/wiki-vault/`** — never.
- **No test.** See §6.
- **No commit, no push.**

---

## 5. Region collision with `0208` and `0164` — stated, because both edit this file

| Task | Region it edits | Collides? |
|---|---|---|
| `0203` (this) | the bullet block under `**Rules that make this honor the ADRs:**`, between §2's step table and §3 | — |
| `0208` (queued next) | the `## Stop conditions — the driver's exit table (§5.4)` table, **~95 lines below** the insertion | **No overlap.** But +56 lines shifts its whole region down by 56. |
| `0164` (backlog) | the **Build row** of the §2 step table, **28 lines above** the insertion, plus `fkit-coder.md` | **No overlap**, and the insertion does not move it. |

**⚠️ Whichever of `0203`/`0208` lands second must re-derive its anchors from surrounding text, not from any line number recorded before the first landed.** Concretely: after this change the `## Stop conditions` heading moves from **243 → 299**. `0208`'s brief coordinates will be stale the moment this lands.

---

## 6. Verification plan — and the honest limit on it

**Content checks (these are what actually prove the task landed):**

```
/usr/bin/grep -n "unverified — no hook checks it until follow-up 3 lands" claude/skills/fkit-sprint-ship-loop/SKILL.md   # expect 2 hits
/usr/bin/grep -n "NOT the \`Read\` tool"        claude/skills/fkit-sprint-ship-loop/SKILL.md
/usr/bin/grep -n "cat -n"                       claude/skills/fkit-sprint-ship-loop/SKILL.md
/usr/bin/grep -n "2000 lines"                   claude/skills/fkit-sprint-ship-loop/SKILL.md
/usr/bin/grep -n "wc -c"                        claude/skills/fkit-sprint-ship-loop/SKILL.md
/usr/bin/grep -n "git hash-object"              claude/skills/fkit-sprint-ship-loop/SKILL.md
/usr/bin/grep -n "a word a driver may apply only to bytes it read from a file that turn" claude/skills/fkit-sprint-ship-loop/SKILL.md
/usr/bin/grep -n "a phrase a driver may use only after looking at what it wrote"          claude/skills/fkit-sprint-ship-loop/SKILL.md
/usr/bin/grep -n "never a partial paste"        claude/skills/fkit-sprint-ship-loop/SKILL.md
/usr/bin/grep -n "narrows the hazard; it does not remove"                                 claude/skills/fkit-sprint-ship-loop/SKILL.md
```

**Change-surface check:** `git diff --stat` over tracked source must show `claude/skills/fkit-sprint-ship-loop/SKILL.md` **and nothing else**. (Note: `git status` is already dirty with unrelated task-folder and board changes from earlier in this session — the check is on `git diff --stat`, not on a clean tree.)

**Test suite:**
```
node --test test/skill-frontmatter.test.js     # capture baseline first, then re-run
npm test                                        # = node --test test/*.test.js && bash test/prove-red.sh
```
Record pass/fail counts for both, before and after.

**⚠️ The limit, stated loudly because a green suite will look like proof and is not.** `test/skill-frontmatter.test.js` globs every `claude/skills/*/SKILL.md` but audits **only the `---` frontmatter block** — verified at plan time by reading its live-corpus assertions and its `splitFrontmatter` helper, which slices at the closing `---` and discards everything after. **No test in `test/` reads this file's body.** So:

- **A green suite is a regression check — evidence the amendment did not break the frontmatter — never proof the amendment landed.** The grep list above is what proves that.
- **No text-presence test is proposed**, per the brief's exclusion.
- One checked non-risk: `test/prove-red.sh` mutation 9 copies the real `claude/` tree and de-indents the second content line of **this file's** `description: >-` block scalar, expecting the frontmatter suite to go red. Its `awk` anchors on `$0 == "description: >-"` and a line counter within the scalar — **a body-only insertion 140+ lines below cannot disarm it.** Re-run `npm test` anyway to confirm, and report if mutation 9 reports a no-op.

**Also:** `git hash-object` and `wc -c` re-run on the file after the edit, so the worklog records the new blob and byte count.

---

## 7. Coordinates that shifted since the brief was written

The brief pins the rule at `claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-02:110-116`. **That is stale.** `0191` inserted 13 lines into `## Hard rules` and `0202` inserted the *Durable artifacts* section and the `plan.md` prose block.

| Anchor (text) | Brief says | Verified at plan time |
|---|---|---|
| `**Rules that make this honor the ADRs:**` | `:109` | **149** |
| The bullet ending `…not a verifiable token.` | `:110-116` | **150–156** |
| `## Stop conditions — the driver's exit table (§5.4)` | — | **243** |
| The `\| **Build** \| @fkit-coder \|` step row | — | **121** |
| File length | 296 | **309** (25,457 bytes) |

**All anchors in this plan are stated as text, and the implementer re-derives line numbers at edit time.** Per `0160`'s durable-citation rider, no line number appears in this plan without the quoted phrase it points at. Citations to ADRs follow this file's house idiom — bare `ADR-NNN §N` in parentheses, no `:NNN`.

---

## 8. Open questions — both ruled by the owner at approval

- **OQ-1 (was blocking) → A1.** Step 5's trigger is a **capability bound**: *"If — and only if — you cannot carry the plan whole…"*, plus the obligation to state the `wc -c` byte count and the reason, so a pointer-only carry is legible after the fact. **A2 (invented byte threshold N) and A3 (driver's judgment) are rejected** — A2 invents an un-anchored constant, A3 makes the exception self-authorizing so the primary construction may never run.
  ⚠️ **Recorded consequence, owner-acknowledged:** this **declares the driver's practice on this very run out of bounds.** Verified at plan time: the driver carried plans pointer-only on `0167` (20,369 B), `0190` (11,225 B), `0191` (11,154 B) and `0200` (17,891 B) — the degraded form used as the primary form, four times, by the driver this rule binds. Future runs paste.
- **OQ-2 → B1.** The *"honest bound on 'true by construction'"* paragraph **ships**. `0162` §2's claim that the word *verbatim* becomes *"true by construction rather than true by effort"* is **stronger than the mechanism supports**: `cat` puts the bytes in the driver's context that turn, but the driver still **emits** them token by token — there is no memcpy, and until `0204` lands nothing detects a divergence.

---

## 9. Scope-growth flag, carried forward from the brief

The brief flags — and this plan repeats rather than buries — that **scope grew 2026-08-03 (element 7) and the rank did not.** Per ADR-035 a spawned producer does not re-rank. On merit the addition makes an existing required element checkable rather than adding new territory. Separately, **`P181` is append rank, not merit rank**; on merit `0203` belongs directly below `0202`. Both are flagged for the owner, not decided here.

---

## 10. What the plan spawn did not do

- **Ran no tests.** The plan spawn is bound to write no files, and `npm test` writes a temp work tree. **So this plan records no baseline test counts** — capturing them is the first Build step, before the edit.
- **Wrote no `plan.md`.** The driver writes it at approval.
- **Did not verify the "fired zero times" claim** or the round-1/round-2 carry failures firsthand — no transcript exists in this repo; `0162` records them as testimony and so does the rule text drafted above. Element 7's evidence, by contrast, **is** on disk in `0202`'s review ledger and was read at plan time.
