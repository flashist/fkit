# Overhaul the README for first-time visitors

## ID
0478

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Requirements source:** an owner-supplied brief, copied verbatim to
[`assets/source-brief.md`](assets/source-brief.md) (prepared 2026-10-02). **It is the spec.** This
brief summarises it and records the owner rulings that override parts of it; where the two differ,
**the rulings below win**. Section numbers (§N) below refer to the source brief.

**Owner rulings** (2026-10-02, `fkit-lead` session, `AskUserQuestion`, selected option text, relayed
to a spawned producer):

1. **Process** — *"File it + I drive it — Producer files the task (your brief attached); coder plans;
   you approve the plan here; build; reviewer reviews; producer closes. Your OK at the plan step also
   authorises the coder to write."*
   ⛔ **Start rule.** The owner's standing rule is *no start without his word*. This ruling **is** his
   word to start **planning**. **Building still needs his approval of the plan.**
2. **Delivery** — *"Straight to main — As we've done today."* ⚠️ **This supersedes §2's line "Deliver
   as one PR … Don't push to `main` directly".** No PR, so no PR description. What §8 asks the PR
   description to carry goes into the **worklog and the commit message** instead (see What to build,
   step 8). Committing itself still happens only when the owner asks (universal hard rule). Note why
   §2 asked for a PR: `main` is live for every new install (`RELEASING.md`: "merging to `main` is the
   act of shipping"). The owner has accepted that.
3. **Stray root file** — *"Move under ai-agents/ — Next to its related task or into
   knowledge-base/reports; nothing lost."* Applies to `handoff-fkit-status-filtered-board.md`.
   **Overrides §6.2's "ask before deleting": move it, do not delete it.**
4. **History section** — *"Move to CHANGELOG — Keeps it, out of the visitor's way."* Settles §3's
   "History" row and the §8 TODO about it.

**Facts verified by the lead, 2026-10-02:**
- `.github/workflows/test.yml` exists, so a CI badge is possible.
- Tags `v0.2.2`, `v0.3.0`, `v0.3.1` exist (a tag/release badge is possible).
- The README's top has the GIF teaser as a **plain image**. ⚠️ GitHub turns any link to a
  `user-attachments` video into a player, so **never wrap the GIF in a link to the video**. The full
  video is a standalone `user-attachments` URL on its own line — §5 moves it to "See it in action";
  keep it a bare standalone line there.
- The README already says Codex is "optional but recommended".
- `docs/media/` exists (holds the GIF). `install.sh` copies only `claude/` and downloads the repo
  tarball.

**Facts checked at filing (producer, 2026-10-02):**
- `README.md` is 230 lines today; sections: pitch, Install & run, The team, Standing up a new project
  by hand, Reading the board in a browser (repo-local), Layout, Roadmap, History, License.
- No `CHANGELOG.md`, `CONTRIBUTING.md` or `docs/board.md` exists yet.
- `package.json` `description` lists six roles and omits the lead (§6.1 confirmed).
- `claude/structure-manifest.tsv` does not list the root `README.md` (it covers scaffold files such as
  `ai-agents/README.md`). A manifest regeneration is therefore probably **not** needed — confirm.
- The stray file's related task is `0039` (filter `/fkit-status` to open tasks), which is **done**.
  `ai-agents/tasks/done/` is frozen history, so **`ai-agents/knowledge-base/reports/` is the
  recommended destination** (ruling 3 allows either). Backlog task `0236` lists the file at repo root
  in its sweep inventory — note the move there in the worklog so `0236` does not chase a missing file.

**Overlaps — do not run concurrently:**
- **`0476`** (Codex optional across the other docs) explicitly leaves the root `README.md` alone, but
  its last step reads the README to confirm it agrees. The two must **not** edit the README at the
  same time. Check `git status` before planning. Whatever this task writes about Codex must keep
  "optional but recommended — without it the second opinion falls back to Claude-only, loudly
  flagged".
- **`0475`** (spawned coder writes under lead-relayed approval) names `README.md` among files a
  parallel coder may be editing. Same check.
- **`0467`** (retire the read-only board reader) will later remove the board reader. The new
  `docs/board.md` then goes with it. Relocate the board section anyway (the "nothing lost" rule); just
  note in the worklog that `0467` must also remove `docs/board.md` and the README pointer.

## What to build

Summary of the source brief. Read it in full; it holds the tables and the target outline.

**Goal (§1).** Rewrite `README.md` for a **new visitor** who, in 2–3 minutes, should learn what fkit
is, why it exists, how to install, run and remove it, and what a first session looks like. Move
maintainer detail into separate docs and link to it. **Do not delete information. Relocate it.**

1. **Plan first** (`/fkit-plan-task`). The plan must include a **section-by-section map** of the
   current README: for each block, where it goes (kept, tightened, or moved to which file). The owner
   approves the plan before any write.
2. **Move out (§3):**
   - the stale-backlog-header "update does not repair" note → new `CHANGELOG.md` (under the version
     where it shipped, or a "Known issues / migration notes" section);
   - the whole web-board section → new `docs/board.md`, in full; the README keeps 2–3 lines + link;
   - inline ADR references → removed from the README, apart from **one** pointer to
     `ai-agents/knowledge-base/decisions/`;
   - detailed role-lock mechanics → `claude/README.md` (merge only what it lacks); the README keeps a
     plain-language "enforced, not advisory" version;
   - **History → `CHANGELOG.md`** (ruling 4);
   - the Layout tree → new `CONTRIBUTING.md`.
3. **Add (§4):** "Why fkit"; "A first session" walkthrough (8–15 lines, checked against the real
   skills; any transcript text must match what the tool prints); Key terms glossary; supported
   platforms; what the installer does (paths, override variables, `~/.local/bin` on `PATH`, link to
   `install.sh`); uninstall (install locations + project-side leftovers, saying plainly that
   `ai-agents/` is the user's own work); one honest cost/usage sentence; an environment-variable
   table; a Contributing section + `CONTRIBUTING.md`; one line of badges (CI, version/tag, MIT).
4. **Restructure (§5)** to the target outline, including the "Updating" table and 2–3 lines on drift
   detection and `/fkit-heal`.
5. **Same-change fixes (§6):** update `package.json` `description` to seven roles including the lead;
   move `handoff-fkit-status-filtered-board.md` under `ai-agents/` (ruling 3: move, never delete);
   add the one README line explaining that this repo's `ai-agents/`, `CLAUDE.md` and `AGENTS.md` are
   fkit's own working files.
6. **Facts discipline.** Check every new factual claim (paths, env vars, OS support, uninstall steps,
   update behaviour) against `install.sh` and `claude/fkit-claude.sh`. Anything you cannot verify is
   written as `TODO(owner): …` in the text and listed in the worklog. Windows status is the likely one.
   Do not guess.
7. **Keep the voice:** direct, confident, precise. Fewer words, less internal vocabulary.
8. **Delivery record (replaces §8's PR description).** In the worklog, and summarised for the commit
   message the owner will ask for: a short summary of the restructure and where each moved section
   now lives; the `TODO(owner)` list; the manual GitHub "About"/topics step (§6.4: description +
   `package.json` keywords as topics — an owner action, not part of the change); before/after README
   line counts. Do not commit unless the owner asks.

**Out of scope:** any launcher, installer or skill **behaviour** change (documentation only, apart
from `package.json`'s `description`); the Codex rewording in other docs (`0476`); wiki pages (route a
`fkit-wiki` sync after close); frozen history under `tasks/done/`, `tasks/cancelled/`,
`sprints/done/`; the GitHub "About" box itself.

## Verification steps

1. `README.md` is roughly 110–130 lines (state before/after counts).
2. The README contains no ADR reference other than the single pointer to the decisions folder —
   `grep -n 'ADR' README.md` shows only that line (or none beyond it).
3. Every relative link in `README.md`, `docs/board.md`, `CONTRIBUTING.md`, `CHANGELOG.md` and any
   edited part of `claude/README.md` resolves: a script extracts each `](path)` target (stripping
   `#anchors`), resolves it relative to the file, and tests it with `-e`. Output shows zero misses.
4. "Nothing lost": the worklog holds a section-by-section table from the old README to its new home,
   and each moved fact can be found at the linked place (check by reading, not by assumption).
5. Every new factual claim carries a source (`install.sh:<line>` / `claude/fkit-claude.sh:<line>`) in
   the worklog, or is marked `TODO(owner)` in the text and listed.
6. The GIF is still a plain image (not wrapped in a link); the video is a bare standalone
   `user-attachments` line under "See it in action". Badges, tables, GIF and video render correctly in
   a GitHub preview, or the worklog says the preview was not possible and why.
7. `package.json` `description` names seven roles, including the lead.
8. `handoff-fkit-status-filtered-board.md` no longer exists at the repo root and exists, unchanged in
   content, under `ai-agents/` (`git diff -M` shows a rename, or a byte-compare passes).
9. The README's Codex wording still says "optional but recommended" with the Claude-only fallback
   flagged.
10. `npm test` is green; state the pass count. `npm run generate:manifest` was run only if the repo's
    process required it, and the worklog says which.
11. The worklog holds the delivery record from What to build, step 8.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Why one brief, not several:** the owner ruled to file *the* task with his brief attached, and the
  "nothing lost" rule ties the README rewrite to the new files that receive its content — a README cut
  without its receiving docs loses information, and the receiving docs alone change nothing for a
  visitor. The two small side fixes (`package.json` description, stray file move) could ship alone;
  they ride along because the source brief puts them in the same change and they are tiny. If the
  owner wants them split, that is a two-minute re-file.
- **Not concurrent with:** `0476`, `0475` (both may touch `README.md`). **Follow-up:** `0467` must
  also remove `docs/board.md` and the README's board pointer when it retires the reader.
- **Possible follow-up, not in scope:** `RELEASING.md` today mentions no changelog. If a
  `CHANGELOG.md` now exists, whether the release flow should maintain it is an owner question — flag
  it in the worklog, do not change the release process here.
- **Follow-up after close:** a `fkit-wiki` sync (the README and new docs are wiki sources).
- **Consulted:** none at filing.
- Filed 2026-10-02 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  rulings above; it decides nothing beyond them.
