# Install, Launcher & Self-Update

**Layer**: shared
**Key files**: `install.sh`, `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, `bin/release.mjs`, `VERSION`, `package.json`, `RELEASING.md` *(added 2026-08-13 by the `0258` resync — the maintainer-facing release procedure, which did not exist when this line was last written)*

## Summary
How fkit gets onto a machine and stays current. `curl … install.sh | sh` installs **only `claude/`** into `~/.local/share/fkit/` plus a thin `~/.local/bin/fkit` launcher. Running `fkit` in any project scaffolds that project, runs preflight, and execs a role-locked Claude Code session.

**fkit opens no ports, exposes no API, and stores no data outside the project's own files.** Every network call is optional, time-boxed to 5 s, and silent on failure — offline `fkit` must cost nothing and print nothing.

> ⚠️ **Dated correction 2026-08-13 (the `0285` resync; the sentence above is left byte-identical). *"Time-boxed to 5 s"* is FALSE on the git path.** `FKIT_NET_TIMEOUT=5` is a **real deadline only for the curl branches** (`--max-time 5`). The `git ls-remote` branch sets **only `GIT_HTTP_LOW_SPEED_LIMIT` / `GIT_HTTP_LOW_SPEED_TIME`**, which bound a **stalled transfer** — **not DNS, not connect**. So the git path **has no deadline and can outlive 5 s: measured 12 s** against a sleeping `ls-remote` stub. The launcher's own comment says so in the source: *"the git path is NOT deadlined."* ✅ `ai-agents/knowledge-base/architecture.md` already carries this correction; **the vault did not until now.** ✅ **The rest of the sentence is unaffected and still true** — every network call is optional and silent on failure.

## Architecture

### Install
Fetch the tarball → **sanity-gate the fetch** on `claude/fkit-claude.sh`, the one file the installer cannot work without → copy **only `claude/`** into `~/.local/share/fkit/` → `rm -rf "$SHARE/omnigent"`, which is what makes an upgrade from an older fkit clean rather than leaving a dead runtime on disk → write `.version` → generate `~/.local/bin/fkit`.

That generated launcher is a **direct `exec`** of `$SHARE/claude/fkit-claude.sh` — there is no flavor dispatch, and `update` is **not** intercepted; it falls through to the launcher, which owns self-update.

**Four retired verbs fail loudly** rather than being passed through to `claude` as a stray argument: `omnigent`, `claude`, `reconnect`, `restart-team`. They were all real commands once; `reconnect` / `restart-team` existed *only* to paper over Omnigent orchestration failures.

### The launcher (`fkit`)
```
fkit                                  (run in any project directory)
   ├─ self-host re-exec into ./claude/fkit-claude.sh if this IS an fkit checkout
   ├─ `fkit update` → re-run install.sh
   ├─ else: throttled update CHECK → prints "run fkit update" (never auto-execs)
   ├─ fkit-claude-init.sh <proj>  (idempotent: scaffold, .claude/ refresh, intake)
   ├─ preflight:  claude REQUIRED (exit 127)  ·  codex required-but-WARNED
   ├─ fresh project? → skip the menu, seed the PRODUCER into /fkit-initiate-project
   ├─ deterministic role MENU (1-7 — an if/else; no LLM in the routing)
   │    ⚠️ reordered 2026-07-25: 1) lead  2) producer  3) coder  4) architect
   │                             5) reviewer  6) adversarial  7) wiki
   └─ exec claude --agent fkit-<role> --settings .fkit/settings/<role>.json
```

**Claude Code is a hard requirement** — the launcher exits **127** without it. **Codex is required but warned, never walled** (owner ruling): a Codex outage must not lock the owner out of their own team.

### The menu reordered — lead first, "team room" retired (2026-07-25)

The lead moved from **option 7 to option 1** and its label from *"team room"* to **`lead`**, on an owner ruling made from seeing the menu on screen: since [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] the lead is the orchestrating front door — the natural first stop for someone who does not know which role they need — and it was listed last. **The `1-7` range is unchanged**, so the prompt and the invalid-pick error needed no edit. Landed by [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] (launcher) and [[tasks/retire-team-room-in-docs-and-agent-definitions]] (every other file).

- **The tests needed no change**, and that is a design property: the launcher-contract and skill-ownership suites assert roles **by name, never by menu number**.
- ⚠️ **Accepted cost, ruled on knowingly: renumbering moved every other role down one, and the mis-pick is silent** — you land in a working session of the wrong role rather than getting an error. The word-alias path (`fkit coder`) is unaffected and is the mitigation.
- ⚠️ **The `team` / `"team room"` word aliases were REMOVED, not kept** — the brief originally required keeping them, and review finding R1 overturned it. **The menu reads a whole line, so `"team room"` matched there; the CLI reads argv already whitespace-split**, so `fkit team room` launched a lead session and passed the stray word `room` through to `claude`, where it had previously been a loud `exit 2`. The words are now accepted on **neither** path; `fkit team` exits 2. *(A residual note on that task still claims otherwise — the owner ruled 2026-07-26 that **the text is wrong and the code is right**; the docs-only correction is still open.)*

### Fresh-project onboarding
Init scaffolds `ai-agents/` + `CLAUDE.md` + `AGENTS.md`, **never clobbering** an existing one → `.fkit/interview` asks 6 questions **on the terminal, before any LLM starts**, writing `.fkit/intake.md` (tty-safe; skips cleanly when headless) → the launcher detects the uninitialized `PROJECT.md`, **skips the menu**, and seeds the producer straight into `/fkit-initiate-project` → the producer interviews the owner, **spawns the architect to run `fkit-survey-project`**, and writes `PROJECT.md`.

### Self-update — two paths, and the split is the design
- **`fkit update`** — an **explicit verb**. Re-runs the canonical `install.sh` for `$repo@$ref`. Refuses to run in a source checkout ("update it with `git pull`").
- **the automatic check** — throttled (60 min default), **time-boxed to 5 s**, silent when current and silent when offline, and it **only ever prints**: `↑ fkit vX → vY is available. Run: fkit update`.

> ⚠️ **Dated correction 2026-08-13 (the `0285` resync; the bullet above is left byte-identical). TWO of its claims are now wrong, for two unrelated reasons.**
>
> **1. The banner text quoted above is the OLD text.** [[tasks/fix-the-version-labeled-sha-triggered-update-banner]] (`0257`, closed 2026-08-13) changed it, because the check **triggers on commit sha** and **labelled both sides from `VERSION`** — so every commit that did not bump `VERSION` rendered `↑ fkit v0.2.1 → v0.2.1 is available`. ⚠️ **Not an edge case: the steady state.** Measured — **~86% of all commits** produce a same-label banner, and one install sat on that line for **142 consecutive commits**. *The banner was correct — there really was newer content, because distribution is sha-keyed — but its wording told the reader nothing had changed.* **A true signal that reads as noise.** The two live forms:
>
> ```
>   ↑ fkit v0.2.1 — newer content on main (1111111 → deadbee). Run:  fkit update
>   ↑ fkit v0.1.30 → v0.2.1 is available. Run:  fkit update      ← unchanged when versions differ
> ```
>
> The `vA → vB` form is now emitted **only when there really are two distinct known versions**. This also removed the reachable **`v?`** that appeared on a git-only box, where `_fkit_remote_sha` falls back git → curl but `_fkit_remote_version` is **curl-only**. ⚠️ **There is no git fallback to add**: `git ls-remote` returns refs, not file content, and GitHub refuses `git archive --remote`. ⚠️ **The fix is NOT validation** — both sides are only tested for non-emptiness, so a garbage remote `VERSION` still renders verbatim; that is a separate call, deliberately left open. **Coverage now exists** (`test/update-banner.test.js`), closing a gap `0257` measured as zero.
>
> **2. *"Time-boxed to 5 s"* is FALSE on the git path** — see the correction under §Summary. **Trigger semantics are unchanged** (sha comparison stays, correct for a sha-keyed distribution), as are the throttle, the silent-when-current and silent-when-offline behaviour, and the source-checkout exclusion.

**It never auto-updates and never re-execs itself** — deliberately unlike the Omnigent launcher it replaces, which had no timeout and no `GIT_TERMINAL_PROMPT` guard (a credential-prompting repo would hang the launcher indefinitely). Source checkouts are excluded entirely.

### Release
`npm run release` → `bin/release.mjs`: bump `VERSION` + `package.json` (patch by default), `git add -A`, commit, push, annotated tag `v<version>`, push the tag. **No npm-registry publish.**

> ✅ **Updated 2026-08-13 (the `0285` resync; the line above is left byte-identical and is now INCOMPLETE — it describes a sequence that gained a step in front of it).** [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] (`0256`, closed 2026-08-12) put a **blocking `npm test` gate before the bump**, and landed **CI** alongside it. ⚠️ **This reverses the owner's earlier `"No CI planned."` ruling.**
>
> - **The gate blocks on red — there is deliberately no warn-and-continue path.** `--no-test` exists, prints a loud unverified-tree warning, and *"is never a default"*.
> - ⚠️ **Its position is load-bearing.** It sits **immediately before the first mutating line**, so a red suite aborts cleanly with the tree as the user left it. **Gating any later would leave `VERSION` and `package.json` bumped and dirty, and the next default run would bump AGAIN — silently skipping a version.**
> - ⚠️ **It deliberately does NOT require a clean tree**, and must not: `npm test` and `git add -A` both read the **working tree**, so the gate tests the tree as it stood when the suite started — uncommitted work included. It does **not** test the exact committed bytes; ~6 min separate the gate from `git add -A`. **That is precisely what CI cannot cover, because CI never sees that tree.**
> - **Measured cost: ~5m30s–6m20s per release.**
>
> ⚠️ **The unrunnable verify command `bin/release.mjs` prints after a release is a SEPARATE, still-open defect** (task `0254`, Sprint 5): it prints an `npx github:…` line, but `package.json` has **no `bin` field**, so the command fails with *"could not determine executable to run"*. ⛔ **The fix is not to add a `bin` field** (no npm publish). ⚠️ **`RELEASING.md` does not exist yet** — task `0252` is still open, which is why the `0258` resync of this page has **not** run.

> ✅ **Dated correction 2026-08-13 (the `0258` resync; the block above is left byte-identical). Its closing sentence is FALSIFIED: `RELEASING.md` NOW EXISTS.** [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] (`0252`, closed 2026-08-13) landed it at the repo root — 201 lines — and added a pointer to it from `architecture.md` §6. **This is that resync.** ⚠️ **Everything else in the block above still stands** — the gate, its load-bearing position, and its deliberate refusal to require a clean tree are unaffected. ⚠️ **One further clause has since moved and is deliberately NOT corrected here:** task `0254` is no longer open. Its landing is outside this resync's scope (`0252` only, by the brief's explicit judgement) and **owes its own resync** — the wiki does not file tasks.
>
> **`RELEASING.md` is now the maintainer-facing source of truth for how fkit ships.** This page describes the *mechanism*; that document describes the *procedure*. ⛔ **It ships to nobody** — it sits outside `claude/scaffold/`, so `install.sh` never copies it into a consuming project, and it is absent from `claude/structure-spec.md`'s inventory, so no conformance check knows about it. That is why it lives at the repo root and **not** in `ai-agents/knowledge-base/conventions/`, which is dual-homed into every project — and a consuming project has no release to cut.
>
> **1. `main` is the release channel; the tag is a marker, not an install target.** A default install reads `main` — `install.sh` defaults `REF` to `main` and interpolates it straight into a `codeload.github.com` tarball URL, and the launcher resolves the same default when the install's `.version` names no ref. **So merging to `main` IS the act of shipping**: every commit on `main` is live to the next install the moment it is pushed. There is no staging channel and no promotion step between the two. `npm run release` cuts an annotated `v<x.y.z>` tag, and that tag is how a release is *identified* — in `git log`, in an issue, in a changelog entry — **not** how it is delivered.
>
> ⚠️ **The precise claim, because the stronger one is FALSE.** *"No install path resolves a tag"* is **wrong**: `$REF` is interpolated without inspection, so a tag **is** reachable. The true, weaker statement — and `RELEASING.md`'s own wording — is that **nothing in the release flow, the README, or `fkit update` puts an install onto a tag on its own**; an install lands on one only when someone explicitly sets `FKIT_REF`. **Reachable, not supported.**
>
> ⛔ **The assignment must come AFTER the pipe.** `curl … | FKIT_REF=v0.2.1 sh` works. **`FKIT_REF=v0.2.1 curl … | sh` does NOT** — in a POSIX pipeline an assignment prefix binds to the **first** command, so it sets the variable for `curl`, which never reads it, and leaves the `sh` that actually runs the installer on its own default. **That form silently installs `main` while looking like it pins a tag.**
>
> ⚠️ **Even written correctly, pinning is a way to FREEZE, not a way to subscribe — and not even a reliable way to go quiet.** `install.sh` records the ref into the install's `.version` and the update path resolves that ref's head with `git ls-remote`. A tag's head never moves, so the check *normally* stays silent — but that quiet is a side effect, not a guarantee, and it breaks at least two ways. **(a)** If `install.sh` could not resolve a sha it writes `sha=unknown`, and the check only tests both sides for non-emptiness, so `unknown` never matches and the notice fires forever. **(b)** `git ls-remote` on an **annotated** tag returns the **tag object's** sha while the curl fallback returns the **commit's** — so an install that gained or lost `git` between install time and check time compares two different shas for the same unmoved tag.
>
> **2. ⚠️ The `~5m30s–6m20s` figure in the block above is SUPERSEDED, and so is the `~6 min` beside it.** The owner ruled the wording **"roughly 6–8 minutes, machine-dependent"** on 2026-08-13, **superseding their own earlier `~6 min` ruling**, and `RELEASING.md` carries that range. Measured green runs span **328–463 s**; the spread is machine load, not a regression. ⚠️ **A red run is far cheaper — about a minute**: `npm test` is `node --test test/*.test.js && bash test/prove-red.sh`, so a failing unit suite **short-circuits at the `&&`** and the slow mutation gate never starts. *Failing early is cheap; failing eight minutes into a release run is not.* ⛔ `bin/release.mjs` and `.github/workflows/test.yml` still say `~6 min` in their own text — **that disagreement is deliberate and was accepted on the record**, not an unnoticed drift.
>
> **3. ✅ CI is no longer merely "wired" — it has RUN.** ⚠️ **`0252`'s own brief asserts *"CI HAS NEVER RUN"*; that is the one point on which that brief is now stale.** Measured 2026-08-13 with `gh run list`: **5 runs — 4 success, 1 failure.** The failure (2026-08-12) was a **real catch** — a lockdown-guard assertion that passed on a case-folding local filesystem and failed on the Linux runner ([[tasks/make-the-lockdown-guard-case-test-filesystem-independent]], `0283`). The newest success sits on the current `main` HEAD. ⛔ **Neither *"there is no CI"* nor *"CI is always green"* is true of this repo** — one red run exists, and **it is a point in CI's favour, not against it**.
>
> **4. What `RELEASING.md` carries that this page deliberately does not.** The pre-release checklist: the **`npm run generate:manifest` duty** — owed when you change a `claude/scaffold/` file the manifest actually covers, **or** the generator's own path map or hash contract, with the regenerated `claude/structure-manifest.tsv` committed in the *same* change. ⚠️ Stated as the negative people get wrong: editing `claude/skills/`, `claude/agents/` or `claude/fkit-claude.sh` **owes no regen**, because none of them ship through the scaffold. ⚠️ Adding a *new* top-level entry to `claude/scaffold/` is **more** than a regen — the generator refuses loudly until it is taught, because whether a file ships to a project is **a decision, not a derivation**.

> ⚠️ **Dated correction 2026-08-13 (the `0289` resync; BOTH blocks above are left byte-identical — the `0285` block *and* the `0258` correction stacked under it).** It settles **two** things: the `0285` block's `0254` clause — the one the `0258` correction deliberately declined and left *"owing its own resync"* — and one **over-broad sentence inside that `0258` correction itself**.
>
> ### 1. The `0254` clause is now wrong — but ⛔ "fixed" is NOT the correct replacement claim
>
> ✅ **The unrunnable-`npx` defect is FIXED AND CLOSED.** Task `0254` closed 2026-08-13; its folder is `ai-agents/tasks/done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/` and its `## Status` reads **`✅ Done (agent-closed — not owner-verified)`** — ⚠️ **carry that marker: closed by an agent, never verified by the owner.** It shipped exactly one line. `bin/release.mjs`'s post-release summary now prints, read from the code this run:
>
> ```
>   console.log(`  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}`);
> ```
>
> ⛔ **The `npx github:…` line is gone**, and with it the *"could not determine executable to run"* failure. ⚠️ **The history above is not deleted, it is dated** — that command really did fail that way, right up to 2026-08-13. ✅ **The `0285` block's ⛔ ruling that "the fix is not to add a `bin` field" SURVIVES and is exactly why the fix took this shape** — fkit makes no npm-registry publish ([[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]]).
>
> ⚠️ **But a NARROWER, SEPARATE set of defects on the REPLACEMENT line is STILL OPEN** — task `0288`, `ai-agents/tasks/backlog/0288-fix-the-post-release-verify-lines-failing-and-false-green-cases/`, `## Status` **`🔲 Backlog`**, unranked (priority `—`), verified open on the Backlog board this run. ⛔ **So this page does NOT say the printed verify command is simply "fixed".** Three findings — plus a fourth bullet that is an explicit **non-finding** — carried from `0254`'s review ledger and **every one measured by execution, not by reading**:
>
> - **The summary block is guarded ONLY by `dryRun`.** The tag and push *steps* above it do branch on `--no-tag` / `--no-push`, but **the summary block itself never consults either flag**, so the verify line prints on **every** non-dry path — including the paths that just declined to create the tag it names. Under `--no-tag` or `--no-push` the script prints `✓ Released <tag>` and then a check that **exits 2**. ⚠️ **That `exits 2` outcome belongs to those two flags, NOT to every non-default path** — `--no-bump` over a tag already on origin runs the same check and it **exits 0**, a false green; that is the next bullet. ⚠️ **Stated this way deliberately.** **`0288`'s brief** says the two flags are *"read … and never consulted again"* — **that is false as a description of the file** (re-measured 2026-08-13 and again 2026-08-14: both are consulted at the tag-exists check, the branch push, the tag creation, the tag push and the skip-tag branch). ⛔ **`0254`'s review body does NOT carry that gloss** — an earlier version of this bullet said it did, and that attribution was false; see the dated correction 2026-08-14 below. `0254`'s review says only the narrow, correct thing. **The defect is real; only that one sentence about it is not.** ⛔ **This is NOT confined to runs that publish nothing.** ⚠️ **`--no-tag` ALONE fires it, and that run genuinely pushes commits to `origin/main`** — it publishes a real release and then points the maintainer at a tag it announced, one line earlier, that it would not create. *(The reviewer measured only the two local-only `--no-push` variants; the coder's independent re-measurement found the broader case. The broadened form was then put to the owner and the ship ruling was **re-affirmed on it** — so the deferral rests on the corrected description, not the understated one.)*
> - **`--no-bump` over a tag already on origin makes the check exit 0 — a FALSE GREEN, and the worst of the three.** Tag creation is skipped when the tag already exists locally or on origin, but **the branch is pushed regardless** — so a new commit ships, the tag does not move, and the printed check passes against a **stale** tag directly under `✓ Released <tag>`. ⚠️ **Not a contrived combination:** the script's own header documents `--no-bump` as the way to finish a partially-failed release, which is precisely when a maintainer most needs the line to tell the truth. ⚠️ **A human cannot eyeball it either** — `git ls-remote` prints the **tag object's** sha, not the peeled commit; the comparison that would carry the claim is the peeled tag (`<tag>^{}`) against the pushed `HEAD`.
> - **The tag-absent failure is SILENT** — exit 2, nothing on stdout *or* stderr. ⛔ **The exit codes are NOT ambiguous, and a fix written against "they are" would chase a defect that does not exist**: 2 means tag absent, 128 means origin unreachable, and 128 is not silent — it prints a `fatal:` line. The review table's *"conflates"* wording was measured **false** by the coder. **The residual is the silence alone.**
> - ⛔ **The unquoted `${tag}` interpolation is NOT one of `0288`'s open defects** — **owner-ruled 2026-08-13, verbatim "Unactioned — pre-existing"**: the replaced line carried the identical exposure. ⛔ Do not read it off this page as open.
>
> ✅ **The default path is correct today, and it is the only path a clean release cut runs** — no flags, tag created and pushed, printed command exits 0. That is why `0288` sits unranked on the Backlog and **does not block a release**, and it is the one behaviour `0288`'s fix must not regress.
>
> ⚠️ **This page owes ONE MORE look when `0288` lands** — the open-defect paragraph above becomes history in its turn. **Known and accepted**, recorded here so the next reader files it rather than rediscovering it; it is not a defect in this correction.
>
> ### 2. ⚠️ One sentence in the `0258` correction above is over-broad — and that same block contradicts it
>
> That correction states *"Everything else in the block above still stands"*, yet **its own item 2, further down inside it**, declares the `0285` block's **`~5m30s–6m20s` per-release figure SUPERSEDED** by the owner's **"roughly 6–8 minutes, machine-dependent"** ruling of 2026-08-13. A reader who stops at the assurance is told nothing changed in text the same block later corrects.
>
> ✅ **The accurate reading is the narrow one that sentence was actually making** — the three claims it enumerates: the **pre-bump `npm test` gate**, its **load-bearing position**, and its **deliberate refusal to require a clean tree**. Those are unaffected, and nothing here reverses them. ⛔ **The assurance does not extend to the runtime figure**, which that same block supersedes, ⛔ **nor to the `0254` clause**, which it explicitly declined and left owing this resync. ⛔ **Nothing in the `0258` correction is rewritten — it stays byte-identical; this note bounds it.**
>
> ### Resync trail for this page — three passes, all 2026-08-13
>
> `0285` (after `0257` — the update banner and the 5 s time-box) → `0258` (after `0252` — `RELEASING.md`; it flagged this `0254` clause **in place** and correctly declined it as outside its `0252`-only scope, *"the wiki does not file tasks"*) → **`0289` — this correction**, the resync that clause was owed.

> ⚠️ **Dated correction 2026-08-14 (task `0295` — a retroactive review of the `0289` block above). Two claims inside that block's first bullet were corrected IN PLACE**, because that bullet is this page's current-state description of `bin/release.mjs` and a standing false sentence there keeps misleading readers. ⛔ **The `0289` block's core mechanism sentence is UNTOUCHED and was NOT wrong** — the summary block really is guarded **only** by `dryRun`, `grep -n 'doTag\|doPush' bin/release.mjs` really does return **seven** sites, and the block's enumeration of them is exact (re-measured 2026-08-14: `:82`, `:83`, `:227`, `:250`, `:258`, `:261`, `:267`).
>
> **1. A FALSE ATTRIBUTION was removed.** The bullet read *"`0288`'s brief **and `0254`'s review body** both say the two flags are 'read … and never consulted again'"*. ⛔ **`0254`'s review body contains no such clause** — `grep -c 'consult'` on `ai-agents/tasks/done/0254-fix-the-unrunnable-verify-command-release-mjs-prints/review.md` returns **0** (re-measured 2026-08-14). What that review actually says is narrow and **correct**: the flags are set at `bin/release.mjs:82-83`, and the summary block is guarded **only** by `dryRun`. ✅ **The false gloss is REAL — its home is `0288`'s brief** (`grep -c 'consult'` → **6**), which now carries its own dated correction disowning the gloss and explicitly warning readers off `0254`'s ledger. ⛔ **Only the attribution was wrong** — do not read this as *"no false gloss ever existed"*.
>
> **2. An unconditional `exits 2` claim was scoped.** *"Under `--no-tag` or `--no-push` … a check that **exits 2**"* stood next to *"prints on **every** non-dry path"* and read as covering every non-default path. **It does not:** `--no-bump` over a tag already on origin runs the same check and it **exits 0**. Measured — `bin/release.mjs:227` only prints *"will skip tag creation"*; `:258` guards creation with `doTag && !localTagExists && !remoteTagExists`, so none is made; `:250` pushes the **branch** regardless; `:276` prints the verify line, which passes against a **stale** tag. ✅ That case is the **next bullet**, which is why this is low severity: a reader of both bullets was never misled.
>
> **3. A count nit.** The lead-in said *"Three findings"* above **four** bullets. The fourth is a deliberate **non-finding** — the `${tag}` exclusion, owner-ruled *"Unactioned — pre-existing"* — and the wording now says so. ⛔ The fourth bullet stays; it exists to stop a reader treating `${tag}` as open.
>
> **4. Five back-links were added to `## Related`.** A 2026-08-13 sync + lint created five wiki-links pointing **at** this page with no reciprocal link back, breaking the vault's bidirectional-link convention. ⚠️ **That lint found the gap, fixed it, and then reverted its own fix** rather than make a fourth same-day write to this page, and recorded the reversion as a breach. ✅ The back-links land here instead, in this same single write.
>
> ⚠️ **All four items above landed in ONE write to this page**, deliberately. That makes this the **fourth** write to this page and the first on 2026-08-14 — so the *"Resync trail … three passes, all 2026-08-13"* heading above is now **dated, not wrong**. The churn on this page is itself under investigation as task `0290`; this correction answers none of that question.

**Version bumping is load-bearing** — self-update compares the installed sha against the remote head and reports the version from `VERSION`. This is precisely why [[decisions/adr-001-package-json-stays-metadata-only]]'s "stop bumping the version" instruction had to be superseded: following it would have broken self-update.

> ⚠️ **Dated correction 2026-08-13 (the `0258` resync; the paragraph above is left byte-identical). Its CONCLUSION stands and is not reversed — the REASON is sharpened, and one reason it used to rest on is now dead.**
>
> **What `VERSION` does.** It **names the release in the update notice.** When an install and the remote report two distinct known versions the notice reads `v0.2.1 → v0.2.2 is available`; otherwise it falls back to naming the change by sha. **Bumping is what buys the version wording** — it is what lets the notice name a **version delta** instead of falling back to a **sha delta**. Skip the bump and the notice is still *correct*, just less informative.
>
> **What `VERSION` does NOT do.** It does **not select, gate, or identify installed content.** Distribution is **sha-keyed**: the check compares the installed sha against the remote head, and `VERSION` is fetched **separately, afterwards, purely to word the message**. The consequence — **two installs can report the same `VERSION` and hold different content** — is argued in [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]'s Context and recorded as a design constraint in `claude/structure-spec.md`.
>
> ⚠️ **A reason stated elsewhere in this vault's neighbourhood is now FALSIFIED:** *"an unbumped `VERSION` makes the notice read `v0.1.30 → v0.1.30`"* was true before [[tasks/fix-the-version-labeled-sha-triggered-update-banner]] (`0257`, closed 2026-08-13) and is **false now** — that branch prints a coherent sha delta instead. ✅ **The supersession of ADR-001 is unaffected**: bumping still buys something real. ⛔ **What bumping never was is the delivery mechanism — a version number is a *label on* a release, never the thing that ships it.** `RELEASING.md` §2 is the source, and `architecture.md` §6 still calls version bumping load-bearing.

## Gotchas / Known Issues
- **`install.sh` is the blast radius of the whole product.** A bad landing breaks installation *including the self-update path that would ship the fix*. It **cannot be verified by reading a diff** — it must be installed from a ref into a clean `$HOME`.
- **`install.sh` still has zero automated coverage** — and it is the `curl | sh` entry point. `claude/fkit-claude.sh` **is now covered** (argv contract + the `skillOverrides` matrix) by the launcher-contract suite — see [[systems/testing-and-verification]]. *(Updated 2026-07-16: the risk is **reduced, not closed**. `architecture.md` §9.1 still says both files have "no coverage of any kind" — **the doc is behind the code**.)*
- **`fkit --resume` is gone** — the blanket unrecognized-arg passthrough that silently resumed *any* session under the **lead's** lockdown was removed by [[tasks/remove-fkit-resume-passthrough]], and the removal is now **pinned by a test**. A stray arg with no named role is a **usage error**; the *no-args, no-tty → lead* default survives.
- **`GIT_TERMINAL_PROMPT=0`** on the update check exists so a credential-prompting remote can never hang the launcher.
- **Idempotence**: both the installer and the per-project init are safe to re-run. ⚠️ **"Init never clobbers an existing `CLAUDE.md`/`AGENTS.md`" is no longer the whole story** — it now **merges an fkit-managed, marker-delimited block** into them (everything outside the markers is untouched forever), which is what finally gave **brownfield** projects the universal hard rules. `ai-agents/` is still left as-is: **per-path additive convergence is designed and approved but NOT yet shipped** (Sprint 2 task 28, backlog). See [[systems/launch-convergence-and-init]].
- **An init failure no longer bricks the launcher.** It used to: init runs under `set -euo pipefail` and was called unguarded, so any failure took the user's whole team offline. **Setup is best-effort; the session is not** ([[tasks/stop-init-failure-bricking-the-launcher]]).
- **The agent count is still a hard-coded literal, not derived.** `fkit-claude-init.sh` prints `Seven roles` as a `printf` string, while the line that actually *counts* the copied agents (`n_agents`) is separate. **The two can drift apart again silently** — they have before. *(Re-verified 2026-07-16: the string reads "Seven" and is correct, and the stale `fkit claude` usage comment is gone. `architecture.md` §9.5 still lists both as open drift — **the doc is behind the code**.)*
- **The exec bit does not survive install for anything but two hardcoded filenames.** Any *other* shipped script rides a tarball + `cp -R` chain that does not guarantee the bit — an **umask-dependent break that reproduces on nobody's dev machine**. Hence [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]: shipped skill executables are invoked `bash <path>`, **never `./<path>`**, and the installer is not touched.

## Related
- [[systems/fkit]]
- [[systems/role-locked-sessions]]
- [[systems/launch-convergence-and-init]]
- [[systems/testing-and-verification]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[tasks/remove-fkit-resume-passthrough]]
- [[tasks/stop-init-failure-bricking-the-launcher]]
- [[tasks/fix-headless-menu-guard-crash]]
- [[tasks/design-version-to-version-migration-mechanism]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]]
- [[decisions/adr-001-package-json-stays-metadata-only]]
- [[tasks/build-claude-self-update]]
- [[tasks/rewrite-installer-single-flavor]]
- [[tasks/extract-scaffold-into-claude]]
- [[tasks/verify-onboarding-flow-end-to-end]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/extend-initiate-project-fill-overview]]
- [[tasks/fix-agent-count-doc-drift-and-fresh-detection-dup]]
- [[tasks/make-codex-a-checked-prerequisite]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/wiki-sync-post-omnigent]]
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]]
- [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] — lead becomes menu option **1**; the alias removal and its silent-mis-pick cost
- [[tasks/retire-team-room-in-docs-and-agent-definitions]] — the project-wide rename outside the launcher, and the stale "menu 7" citations
- [[tasks/update-launcher-menu-help-for-conductor]] — the earlier text-only pass that dropped "does no work itself"
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — why lead belongs first
- [[tasks/add-adr-030-prose-half-to-universal-rules]] — the managed rules block the launcher re-injects on every run. ⚠️ **The `91.1% of 4096` figure that stood here was superseded on 2026-08-04** by `0190`'s owner-signed bump: `RULES_MAX` is **4352**, and the emitted block measures **3837 B — 88.2%, 515 B free** (re-measured by running the real `emit_block()`, lint 2026-08-06). The **≥ 400 B standing headroom target still holds, cleared by 115 B — and is guarded by no assertion at all** (task `0219`)
- [[tasks/transcript-independent-ship-loop-skip-signal]] — `build_settings()` now wires a **third** hook event
- [[tasks/design-the-post-update-structure-check]] — task `0241` (2026-08-06): the structure-spec `.md` + hash manifest are designed to live **in the install share** beside the scaffold — refreshed wholesale, so they are by construction the installed sha's spec (a project-local copy would be stepped over forever). Design only; follow-ups `0242`–`0249` filed
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the companion ADR recorded 2026-08-07 (`0242`): the consent-gated repair licence, its six verbatim rulings, and the manifest as determination layer
- [[tasks/fix-the-version-labeled-sha-triggered-update-banner]] — task `0257` (2026-08-13): the banner triggered on **sha** and labelled from **`VERSION`**, so ~86% of commits rendered `vX → vX`. New wording + the `v?` path removed + the repo's first banner test
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — task `0256` (2026-08-12): the blocking pre-release `npm test` gate **and** `.github/workflows/test.yml`. ⚠️ Reverses the owner's earlier *"No CI planned."* ruling
- [[tasks/build-the-producer-owned-structure-check-skill]] — the producer-owned conformance check over the install share's spec + manifest
- [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]] — the self-heal path: propose-then-apply, **never announce-only, never stored**
- [[tasks/add-the-launch-time-structure-notice-and-intent-file-suppression]] — the read-only launch notice; the launch path gains **no new power**
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]] — the board that shipped the structure-check capability, **archived unverified**
- [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — task `0252` (2026-08-13): `RELEASING.md`, the maintainer-facing release procedure this page's §Release now points at — the `main`-channel/tag distinction, what `VERSION` does and does not do, and the manifest regeneration duty
- [[tasks/make-the-lockdown-guard-case-test-filesystem-independent]] — task `0283` (2026-08-13): the one **red** CI run, and why it is a point in CI's favour
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the release-hygiene cluster's board. ⚠️ *Corrected 2026-08-14:* this line read *"the **live** board"*; it is **archived**, at `ai-agents/sprints/done/sprint-5.md`, by task `0294`. ⚠️ **There is no active board at all right now** — `dashboard.sh select-active ai-agents/sprints` returns `active none`
- [[tasks/the-2026-08-14-retroactive-review-corrections]] — ⚠️ *Added 2026-08-14:* tasks `0291` and `0295`, the two retroactive-review rows that corrected this page's `0289` block and reciprocated the five one-way links above — **in one shared write**, which is what the owner's batching ruling existed to achieve
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — ADR-043 (2026-08-13): the launcher, init refresh and self-update that ADR reasons over. **Back-link added by `0295`**
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — task `0255` (closed 2026-08-13): whether `.claude/` enters the structure-conformance surface. **Back-link added by `0295`**
- [[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]] — task `0254` (closed 2026-08-13): the post-release verify line, whose still-open successor defects (`0288`) are recorded on this page above. **Back-link added by `0295`**
- [[tasks/state-the-per-project-relaunch-step-fkit-update-requires]] — task `0253` (closed 2026-08-13): the per-project re-launch step `fkit update` requires. **Back-link added by `0295`**
- [[tasks/the-2026-08-13-vault-resync-chain]] — the six-row re-sync chain in which this page was written three times. **Back-link added by `0295`**
