# A shared instructions layer for all fkit agents — investigation findings

- **Date:** 2026-07-14
- **Author:** fkit-architect (consulted by the coder, who ran the delivery experiment)
- **Task:** [`add-shared-instructions-layer-for-all-agents.md`](../../tasks/backlog/add-shared-instructions-layer-for-all-agents.md)
- **Status:** open — awaiting owner review. **No implementation is scoped by this report.**
- **Revision 2.** Revision 1 recommended building an `ai-agents/AGENTS-COMMON.md` splice. It was
  reviewed adversarially (Codex + Claude, 17 findings) and **the recommendation did not survive**. This
  revision **reverses it**. What changed is not taste — it is two facts revision 1 got wrong (§2, §3).
- **Correction, 2026-07-14 (post-acceptance, wording only — no finding or recommendation changes).**
  This report used **"floor"** as a name for the shared rules — in §3, in §7's first recommendation
  (*"Give Codex the floor it has never had"*), and in §6's own heading — while **§6 itself retracts the
  word**: *"There is no 'floor', no 'teeth', no 'non-overridable' anything."* The same overclaim reached
  [`ADR-016`](../decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md), which is
  amended in step. **The rule, applied throughout: the win is *delivery*, never a floor.** Codex went from
  receiving **none** of the universal hard rules to receiving **all four, verbatim** — and **nothing
  enforces them**, exactly as for every Claude agent. **Delivery: structural. Compliance: advisory.**

---

## Summary — the recommendation is reversed

**Do not build `AGENTS-COMMON.md`. Do not splice anything into the seven agent files.**

**The shared instructions layer the task asks for already exists, already ships, and is already proven
to reach every fkit agent in both a session and a spawned consult.** It is the **"Universal hard rules
(every role, every session)"** block in the scaffolded root context files
(`claude/scaffold/CLAUDE.md:56-63`). The owner's stated need — *"add my own instructions that all fkit
agents read"* — is met **today, with zero new mechanism**, by adding lines to `CLAUDE.md`.

What is actually broken is **delivery of that existing layer**, in two places:

1. **Brownfield.** Init leaves an existing `CLAUDE.md` as-is (`claude/fkit-claude-init.sh:64-65`), so
   **no project that already had a `CLAUDE.md` ever receives fkit's universal hard rules.** Including
   projects fkit itself set up before those rules existed.
2. **Codex.** The scaffolded `AGENTS.md` — the file the codex CLI reads natively during the adversarial
   pass (`claude/fkit-claude-init.sh:9-10`, `:74`) — **has no universal-hard-rules section at all.**
   Verified: absent from `claude/scaffold/AGENTS.md`, and absent from this repo's own `AGENTS.md`. The
   second model in fkit's review loop is never sent **any** of the shared rules.

**Recommendation: fix the channel fkit already has, rather than build a second one it doesn't need.**
A **marker-delimited, fkit-managed, idempotent block** merged into `CLAUDE.md` *and* `AGENTS.md` at
init. This is the "build nothing new" branch, and it **beats the splice on the merits** (§4) — it is
the only candidate that reaches **both models**, and unlike the splice it does **not** depend on the
parked task 28.

**Governance line, stated once and not walked back:** this makes **delivery** structural. It does
**not** make **compliance** structural. There are **zero hooks in this repository**; all seven agents
hold `Bash` and five hold `Write`/`Edit`. A rule in a context file is **prose asking an agent to
behave**. See §6 — and note that §6 is the *only* claim level in this report. There is no stronger one
elsewhere in it. That was revision 1's worst defect and it is not repeated.

---

## 1. Correcting the record — the count, verified from the files, third and final time

Three numbers have been published for how many agent files carry the "no secrets" rule. **The brief said
2 of 7. The coder said 4 of 7. Revision 1 of this report said 3 of 7 carry no form of it. All three are
wrong**, mine most embarrassingly, since it was wrong inside a section titled "Correcting the record".

The error was a grep pattern (`secret|credential|DSN|password`) that **misses the phrasing "sensitive
information"**, which is how four of the files actually word it.

**The verified truth — `grep -rniE "sensitive|secret|credential" claude/agents/`:**

> **6 of 7 agent files carry the rule. Exactly one does not: `fkit-lead.md`.**

| File | Line | Wording |
|---|---|---|
| `fkit-producer.md` | :93 | "**Never expose sensitive information.** No DSNs, endpoints, passwords, or credentials…" |
| `fkit-coder.md` | :121 | "**Never expose sensitive information.** No DSNs, endpoints, passwords, or credentials…" |
| `fkit-reviewer.md` | :86 | "**Never expose sensitive information** in any report or document you write." |
| `fkit-wiki.md` | :81 | "**Never expose sensitive information** in any wiki page…" |
| `fkit-adversarial-reviewer.md` | :57 | "Never expose **secrets/credentials** in your findings…" |
| `fkit-architect.md` | :112 | "…never expose **secrets** in any doc or stub." |
| `fkit-lead.md` | — | **absent** |

**This materially weakens the case for building anything, and the report says so.** The finding is not
"a rule is missing from most of the team". It is **"one omission (`fkit-lead.md`) plus three wordings
across six files"** — and `fkit-lead.md` holds neither `Write` nor `Edit` (§6), so it is the agent least
able to leak a secret into an artifact in the first place.

**A rule present in 6 of 7 files, in three phrasings, is a copy-paste hygiene problem.** It is a weak
motivation for a new delivery mechanism, and anyone using it as the headline justification for one is
overselling. The stronger motivation is not the drift at all — it is **§2 and §3**, which are about the
channel that is supposed to be carrying this rule and, on two paths, isn't.

**Lesson, recorded because it has now cost three attempts:** a count of a *semantic* rule cannot be
established by grepping for one of its phrasings. All three wrong numbers came from three different
greps. Read the seven files.

---

## 2. The fact revision 1 missed: the layer already exists, and already reaches everyone

Revision 1 argued there was "no place to put a cross-cutting instruction that reaches all seven", while
also conceding elsewhere that `CLAUDE.md` was reaching all seven. **Both cannot be true.** They are not.
The second is true.

`claude/scaffold/CLAUDE.md:56-63` ships this today:

> **Universal hard rules (every role, every session):**
> - Never commit or push unless the owner explicitly asks…
> - Only the wiki role writes `ai-agents/wiki-vault/`…
> - Task files move… only via the owner-invoked `/fkit-task-done` / `/fkit-task-cancelled`…
> - **No secrets in any artifact** — no DSNs, endpoints, keys, or credentials…

That is **a shared instructions layer, with a universal-rules block, delivered to every fkit agent** —
and §5's experiment proves it reaches both a session and a spawned consult, **3/3**. It is not a
workaround; it is deliberate, and the section heading says so explicitly.

**So the task's premise — "there is nowhere to put a rule that all seven agents read" — is false.**
There is. It is `CLAUDE.md`, it works, and the owner can use it this afternoon without a line of code.

**What this does to the task:** it collapses from *"design and build a shared instructions mechanism"*
to *"fix two delivery holes in the mechanism we already ship"*. That is a much smaller, much safer
piece of work, and it is the honest reading of the evidence.

---

## 3. The two real holes — and only one of them was previously known

### Hole 1 — brownfield never gets the rules (known; revision 1 called it decisive, then tried to keep it)

```
claude/fkit-claude-init.sh:64-65
  if [ -e "$dest/CLAUDE.md" ]; then
    echo "• CLAUDE.md already present — left as-is"
```

Any project that already uses Claude Code already has a `CLAUDE.md`. Init sees it and never writes.
**fkit's team map and its four universal hard rules are never installed on that project.** Same for
`AGENTS.md` (`:70-71`).

### Hole 2 — the Codex adversarial pass is sent no shared rules at all (NEW — this is the one nobody has said out loud)

The reviewer's second opinion is the entire reason Codex is a hard prerequisite (`ADR-009`). And:

- `claude/skills/fkit-adversarial-review/SKILL.md:32,42` builds its own prompt into
  `.fkit/tmp/adversarial-prompt.md` and runs `codex exec --sandbox read-only --cd "$PWD" -`.
- Because of `--cd "$PWD"`, **the codex CLI natively reads the project-root `AGENTS.md`** — init's own
  comment says exactly this: *"AGENTS.md (the codex CLI reads it for the adversarial pass)"*
  (`claude/fkit-claude-init.sh:9-10`, `:74`).
- **`claude/scaffold/AGENTS.md` contains no universal-hard-rules section.** Neither does this repo's
  `AGENTS.md`. Verified by grep on both.

**So the one model fkit runs *specifically* for independent judgment is the one model receiving none of
fkit's shared rules.** It has the project overview, the wiki note, the review-notes note, and the
architecture pointer — and **not one** of: don't commit unprompted, don't write the wiki, don't move
task files, **no secrets in any artifact**.

**This hole is fatal to the splice and decisive for the alternative.** An `ai-agents/AGENTS-COMMON.md`
spliced into `.claude/agents/fkit-*.md` **cannot reach Codex** — Codex never reads those files, and the
adversarial skill builds its prompt from scratch. A "shared layer for **all** agents" that structurally
excludes the second model is misnamed. **`AGENTS.md` is the only channel that reaches Codex at all**,
and it is a channel we already have and already ship.

---

## 4. The splice, defeated on the merits

I was told to either beat the "build nothing / fix the `CLAUDE.md` hole" alternative or adopt it. **I
adopt it.** Here is the comparison that settles it — every row verified.

| | **A. Splice `AGENTS-COMMON.md` into 7 agent files** *(revision 1's pick)* | **B. Marker block in `CLAUDE.md` + `AGENTS.md`** *(recommended)* |
|---|---|---|
| Reaches Claude session | ✅ | ✅ |
| Reaches spawned consult | ✅ (3/3) | ✅ (3/3) |
| **Reaches the Codex adversarial pass** | ❌ **never** (§3, hole 2) | ✅ **the only channel that does** |
| Reaches brownfield projects | **stub: ❌** — blocked on **parked task 28** | ✅ — root files, **task 28 not involved** |
| fkit-scoped (invisible to non-fkit sessions) | ✅ | ❌ *(the one and only surviving objection)* |
| New failure modes introduced | symlink read-through (X8), partial-splice divergence (X4), owner-file → 7 system prompts injection surface (X13) | none new; block content is fkit's own |
| Code required | new file + splice loop + sanitizer + precedence rule | idempotent merge in a seam that already exists (`:64-75`) |
| Prompts assembled from N sources | 2 | 1 |

**Row by row, the two that decide it:**

**The splice never reaches Codex.** Not "reaches it partially" — *never*. This is structural, not a bug
to be fixed later: the adversarial skill constructs its own prompt file. Building a shared-instructions
layer whose text cannot reach the model fkit installed *for its independence* is building the wrong
thing.

**The splice's *stub* ships to nobody, and the fix for that is parked.** Precise version of the finding,
because the loose version overstates it: the *splice code* would run fine on a brownfield project — it
reads `$dest/ai-agents/AGENTS-COMMON.md` if present and no-ops if not. What never arrives is the
**scaffolded stub** — because `ai-agents/` copy is all-or-nothing at the directory level
(`claude/fkit-claude-init.sh:55-56`, `elif [ -e "$aa" ]` → *"already present — left as-is"*). So on
**every already-initialized project, including this one**, the file simply does not appear.

That matters more than it sounds, and this is the part revision 1 hid from itself: **the stub's header
was where revision 1 put all of the design's load-bearing caveats** — the precedence rule, the
"relaunch to take effect" caveat, the plea for brevity. A design whose entire documentation surface is
the one artifact that never gets delivered is not a shipped design. And the fix — **task 28, additive
`ai-agents/` convergence — is currently PARKED by the owner.** Revision 1's recommendation therefore
**silently depended on a parked task**. That dependency alone should have stopped it.

**Option B has no such dependency, and this is the crux:** `CLAUDE.md` and `AGENTS.md` live at the
**project root**, not inside `ai-agents/`. They are handled by init **step 2** (`:62-75`), a completely
separate seam from the `ai-agents/` scaffold guard that task 28 is about. **Option B can ship today,
with task 28 still parked.**

### The one thing the splice wins on — and why it isn't enough

**fkit-scoping.** A `CLAUDE.md` rule is seen by *any* Claude session in the repo, not just fkit ones. So
fkit's process rules ("state your hop budget", "consult the producer for scope") become noise in an
unrelated `claude` session.

**Three reasons this does not carry the decision:**

1. **It is a preference, not a defect.** Noise in an unrelated session costs tokens and mild confusion.
   The splice's costs are a parked-task dependency, two new failure modes, and total exclusion of the
   second model. That is not a close trade.
2. **fkit already made this call, deliberately, and shipped it.** `claude/scaffold/CLAUDE.md` **already**
   puts the team map, the consult/hop rules, and the four universal hard rules in `CLAUDE.md`. Option B
   introduces **zero** new leakage into non-fkit sessions — it delivers, to more projects, exactly the
   content fkit already chose to put there. Rejecting `CLAUDE.md` as "not fkit-scoped" while shipping a
   `CLAUDE.md` full of fkit-scoped content is incoherent.
3. **If scoping ever genuinely bites, it is separable** — a `## fkit` section whose prose says "these
   rules bind fkit role sessions" costs one heading, not a new mechanism.

**Conclusion: build nothing new. Fix the channel we have.** The splice is rejected — primarily because
it cannot reach Codex, and secondarily because its delivery is blocked on a parked task.

---

## 5. The mechanism experiment — what it proved, and its recorded limits

The brief demanded experiment over reasoning. The coder ran it. **Harness version: Claude Code
2.1.208** — recorded, because an unversioned observation elevated to a law of nature is precisely
ADR-010's original error, and this report will not repeat it.

| Channel | Session | **Spawned consult** | Verdict |
|---|---|---|---|
| Agent definition file (`.claude/agents/<name>.md`) | ✅ | ✅ 3/3 | reaches both |
| **Project `CLAUDE.md`** | ✅ | **✅ 3/3** | **reaches both — this is the recommended channel** |
| `claude --append-system-prompt` | ✅ (control) | ❌ **0/3, then 0/2** | **SESSION-ONLY — reject by name** |

**I am myself a live replication of row 2.** I am a spawned consult (`coder → architect`, hop 1), and
this repo's `CLAUDE.md` is in my context. The recommended channel is demonstrating itself as I write.

**The negative result is the strongest part, and it now survives both attacks on it:**

- **Instruction-competition / dedup** was proposed as an alternative explanation for the null. The coder
  **re-ran `--append-system-prompt` as the sole canary** — no competing tokens, so dedup cannot explain
  it. The subagent emitted plain `2` / `4`. **No token. 0/2.**
- **The within-subject control holds:** in the earlier design, the *same* spawn from the *same* file
  fired ALPHA and GAMMA but not BETA (3/3). The subagent was demonstrably canary-responsive; only the
  append channel was dark.
- **Two designs, same negative.** That is as solid as a null gets.

**Stated with the honesty the evidence supports:** *observed on Claude Code 2.1.208, under two
independent designs.* The **mechanistic reason** — a spawned subagent's system prompt is built from its
**own** agent definition, while `--append-system-prompt` modifies the **parent process's** prompt — is
offered as the **explanation** for the result, **not as proof** of it. Note it is the mirror image of
ADR-012: `--settings` **is** inherited by a spawn (`adr-012:21-23`); the system prompt is **not**.

**One further experiment, cited here because revision 1 leaned on it without showing it** (a defect the
review caught): the coder edited `.claude/agents/fkit-architect.md` **mid-session**, spawned the
architect, and the canary did **not** fire. **Caveat, and it matters:** this demonstrates
**session-start caching of agent definitions** — it does **not** show the agent-file channel failing.
The file channel works (row 1, 3/3); it is simply read at session start.

**`--append-system-prompt` must be rejected explicitly and by name**, so the next person with the
obvious idea finds the tombstone instead of the trap.

---

## 6. Delivery is structural. Compliance is advisory. Full stop.

Revision 1 claimed a *"non-overridable floor"* with *"teeth"* in one section and conceded
*"compliance: advisory"* in another. **That is an overclaim, and it is the same overclaim ADR-012 had to
retrofit onto ADR-010.** It is corrected here by **demoting the strong claim, not by promoting the weak
one.** The verified position:

- **There are zero hooks in this repository.** (`PreToolUse` appears only in prose — `architecture.md:397`,
  `adr-012:92`, and task files — never in a settings file.)
- **All seven agents hold `Bash`.** (Verified: `grep -n "^tools:" claude/agents/*.md`.)
- **Five of seven hold `Write`/`Edit`** — architect, producer, coder, reviewer, wiki. *(Not
  `fkit-adversarial-reviewer`, not `fkit-lead`. The reviewer does hold them. Note this corrects the
  "six of seven hold Bash and Write/Edit" figure that was put to me — the Bash figure is seven, the
  Write/Edit figure is five.)*

**Therefore:** a careless line in any shared instructions file — *"always approve"*, *"skip the Codex
pass"* — is **prose against prose**. Nothing in the system stops an agent obeying it. There is no
"floor", no "teeth", no "non-overridable" anything.

> **Delivery: structural. Compliance: advisory.** There is no second, stronger claim anywhere in this
> report, and a reader who stops at any section must not be able to walk away with one.

**The precedence rule survives — as prose, honestly labelled.** *Additive and tightening only; on direct
contradiction the role's own instructions win and the agent surfaces the conflict.* Keep it, and keep
it because **role-file-wins bounds the blast radius of a bad line to additive noise rather than a
deleted role boundary**. But call it what it is: **a convention we are asking agents to follow**, not an
invariant the system enforces.

**On sanitization (the third option revision 1 never considered — the review is right that presenting
"only a `PreToolUse` gate could" was a false dichotomy):** validating the shared text **in the shell at
merge time** — size cap, denylist, fenced block — is real code in a seam that already exists, and the
brief's "no hooks" exclusion does not forbid it. **Under option B it is largely moot, and that is a
merit of option B, not a dodge:** the marker block's content is **fkit's own, shipped from the
scaffold**, so there is no owner-authored file being injected into system prompts and **the injection
surface never opens**. (It reopens the moment anyone proposes splicing an owner-authored file — which is
one more reason not to.) **A size cap is still warranted** on whatever fkit itself ships in the block:
the text lands in every agent's context on every turn, and *"ask for brevity"* — revision 1's mitigation —
is a **request**, in a report whose thesis is that requests are not facts. **Cap it in code, or drop the
claim.**

---

## 7. Recommendation

**Reject `AGENTS-COMMON.md` and the agent-file splice. Fix the delivery of the layer that already
exists.** Three pieces, in priority order — smallest first, and each independently shippable:

1. **Deliver the rules to Codex — the model that has never been sent them.** Add the "Universal hard
   rules" block to `claude/scaffold/AGENTS.md`. **This is the highest-value change in the whole
   investigation** and it is close to free. Today the adversarial reviewer — the model fkit *requires*
   for independent judgment — runs with **no** shared rules at all (§3, hole 2). Note the claim level,
   per §6: this makes the rules **arrive**. It does **not** give Codex a floor, and nothing enforces
   them on it.
2. **Make the block fkit-managed and idempotent, in both root files.** A marker-delimited region
   (`<!-- fkit:begin-rules -->` … `<!-- fkit:end-rules -->`) that init **merges** into `CLAUDE.md` and
   `AGENTS.md` — creating the file when absent (today's behavior), and **updating just the block** when
   present. Everything outside the markers stays the owner's, untouched, forever. This closes hole 1,
   gives fkit a channel it can actually ship corrections through, and **does not depend on parked task
   28**.
3. **Add the "no secrets" line to `fkit-lead.md`** — the single agent missing it (§1). One line. Not a
   mechanism.

**The owner's original need is already met and needs no build:** to give all fkit agents a standing
instruction, he adds it to `CLAUDE.md` (and, for the Codex pass, `AGENTS.md`). That works **today**,
proven 3/3, in both sessions and consults.

**The main tradeoff, stated plainly:** fkit's shared rules stay visible to non-fkit Claude sessions in
the same repo. That is a small, real cost in noise — **and it is the cost fkit already chose to pay**,
since `CLAUDE.md` already carries the team map and the hard rules by design.

### New hazards found — worth recording even though the design that would trigger them is rejected

- **Symlink read-through (was going to be a real bug).** A splice reading `$dest/ai-agents/AGENTS-COMMON.md`
  **reads through a symlinked `ai-agents/`** — exactly the hazard task 27's `[ -L ]` gate was built to
  prevent, **inverted**: we gated *writes*, not *reads*. Off-project content would have been merged into
  seven system prompts. **Any future feature that reads out of `ai-agents/` inherits this.** The `[ -L ]`
  gate at `claude/fkit-claude-init.sh:40` needs a read-side sibling if anything ever does.
- **`exit 3` is treated as success by the launcher** (`fkit-claude-init.sh:193`, `fkit-claude.sh:312`).
  That is *by design* — "I refused `ai-agents/`, but setup succeeded". It is correct for today's init.
  It is a **trap for any future step that assumes `ai-agents/` was readable**, because such a step would
  silently no-op on a refused tree while the session starts normally.
- **Partial-failure divergence.** A per-agent-file loop that fails midway exits non-zero, but the
  launcher (post-task-26) **starts the session anyway** → partially-configured, silently divergent
  agents. Option B has one merge target per file and no loop, so it is far less exposed — but any
  multi-file mutation in init should be written to be all-or-nothing.

### For the owner — decisions, and what must go to you

1. **Ratify the reversal.** Revision 1 recommended building the splice; this revision recommends **not**
   building it. **This is a genuinely new architecture decision and it is yours, not mine to settle in a
   consult.** If you ratify it, it is **ADR-worthy** — it settles a mechanism, **rejects
   `--append-system-prompt` by name** (with the version it was tested on), and rejects
   `AGENTS-COMMON.md` by name. Without the tombstone, both ideas come back.
2. **Hole 2 (Codex has no shared rules) is the real finding of this investigation.** It is a live defect,
   it is independent of everything else here, and I recommend it be fixed **regardless of what you decide
   about the rest**. It deserves its own task.
3. **Task 28 is parked — and that is now consequential.** It does not block option B (§4). It *did*
   silently block revision 1's recommendation. If you ever revisit an `ai-agents/`-sourced config file,
   **task 28 is its prerequisite** and that dependency must be explicit in the brief.
4. **The drift motivation is weaker than advertised (§1).** 6 of 7 files carry the rule; one omission and
   three wordings. If your reason for wanting this layer was "the rule is missing everywhere", **that
   reason does not hold** — and you should decide whether you still want it on the *other* grounds
   (a single edit point for *your own* standing instructions), which are legitimate but different.
5. **Not decided, deliberately:** whether the six agent files' duplicated rules are ever consolidated.
   The brief forbids it; it is a refactor of six system prompts and deserves its own risk assessment.

---

## Related

- [ADR-009](../decisions/adr-009-claude-code-native-is-the-only-runtime.md) — Codex is a **required**
  runtime. §3 hole 2 is a defect against this ADR's premise: the required second model gets no rules.
- [ADR-010](../decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) — the "structural, not by
  instruction" overclaim §6 refuses to repeat.
- [ADR-012](../decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) — the consult
  path is advisory; `--settings` **is** inherited by a spawn, the system prompt is **not**.
- [ADR-013](../decisions/adr-013-knowledge-base-root-holds-the-living-canon.md) — why this is a dated
  report, not a root document.
- Code: `claude/scaffold/CLAUDE.md:56-63` (the layer that already exists);
  `claude/scaffold/AGENTS.md` (the layer that is **missing** for Codex);
  `claude/fkit-claude-init.sh:9-10,:74` (codex reads AGENTS.md), `:40` (the `[ -L ]` write gate),
  `:55-56` (all-or-nothing `ai-agents/` guard — task 28), `:64-75` (never-clobber root files — hole 1),
  `:193` (exit 3); `claude/fkit-claude.sh:312` (exit 3 treated as success);
  `claude/skills/fkit-adversarial-review/SKILL.md:32,42` (codex prompt built from scratch).
