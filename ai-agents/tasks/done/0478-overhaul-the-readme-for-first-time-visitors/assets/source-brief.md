# Brief: improve the fkit README

**Repo:** https://github.com/flashist/fkit (branch `main`, version 0.3.1 at time of writing)
**Owner:** Mark Dolbyrev (flashist)
**Prepared:** 2026-10-02, from a review of `README.md` at `main` HEAD
**Audience of this brief:** the AI agent responsible for maintaining this repo

---

## 1. Goal

Today the README serves two readers at once: the maintainer and a new visitor deciding whether to try
fkit. Most of the text is written for the maintainer. Rewrite it so a **new visitor**, in 2–3
minutes, understands:

1. what fkit is,
2. why it exists (the problem it solves),
3. how to install it, run it and remove it,
4. what a first session actually looks like.

Move maintainer-level detail into separate docs and link to it from the README. **Do not delete
information. Relocate it.**

### Success looks like

- The README is roughly **half its current length** (now 230 lines; target ~110–130).
- The README has **no inline ADR references**, apart from one pointer to the ADR folder.
- A first-time reader can find install, a first-session example, OS support, uninstall, and how to
  contribute without leaving the page.
- Every fact that was in the old README still exists somewhere in the repo and can be reached by a
  link.
- Every relative link in the README and in the new docs resolves (see §6).

---

## 2. Ground rules

- **Follow this repo's own process.** fkit is developed with fkit (`ai-agents/`, `CLAUDE.md`,
  `AGENTS.md`). Read `CLAUDE.md` and `AGENTS.md` first and respect their role and write rules.
  Example: if the repo requires a task brief before changes, or requires that source writes go
  through the coder role, do that. If those rules conflict with this brief, the repo's rules win.
  Flag the conflict to the owner.
- **Do not invent facts.** Check every claim you add (OS support, install paths, costs, behaviour)
  against the code, mainly `install.sh` and `claude/fkit-claude.sh`. If something can't be verified,
  leave a clearly marked `TODO(owner): …` and list it in the PR description. Don't guess.
- **Keep the voice.** The current README is direct, confident and precise. Keep that tone, use fewer
  words, and use less internal vocabulary.
- **Deliver as one PR** with a clear description. Don't push to `main` directly: `install.sh` installs
  from `main` HEAD by default, so `main` is live for every new install.

---

## 3. What to move out of the README

| Current README content | Move to | Leave in README |
|---|---|---|
| "One thing an update does not repair" (stale backlog header sentence, ADR-041) | New `CHANGELOG.md`, under the version where the fix shipped, or a "Known issues / migration notes" section in `CHANGELOG.md` | Nothing. A general "see CHANGELOG for upgrade notes" line in the Updating section is enough |
| Entire "Reading the board in a browser (repo-local)" section (flags, `--root`, ports, HTTP methods, write-safety guarantees, tests that pin it) | New `docs/board.md`, copied in full and lightly reorganised | 2–3 lines: what the board is, `npm run board`, that it is repo-local/read-only, link to `docs/board.md` |
| Inline ADR links and phrases like "ADR-018 §Decision 5, an accepted cost", "Track 1 of ADR-051", "reversing ADR-025" | Already in `ai-agents/knowledge-base/decisions/` | One line: "Design decisions are recorded as ADRs in [`ai-agents/knowledge-base/decisions/`](…)" |
| Detailed role-lock mechanics (PreToolUse hook, consult depth, `tools:` allowlist exception) | `claude/README.md`, which already covers topology; merge in anything it lacks | A plain-language version: each session can only run its own role's commands, and this is enforced, not advisory |
| "History" (Omnigent runtime removal) | `CHANGELOG.md` or `claude/README.md` | Optional. Remove it unless the owner wants it kept |
| Detailed "Layout" tree | `CONTRIBUTING.md` (new) | Optional short version, or a link from the Contributing section |

---

## 4. What to add to the README

### 4.1 "Why fkit" (3–5 sentences, right after the pitch)
Explain the problem in plain words: when one AI session plans, writes **and** reviews its own code,
the review isn't independent and mistakes slip through. fkit splits the work into roles that
**cannot** do each other's jobs. The coder can't review, only the producer can close tasks, and the
reviewer gets a second opinion from a different model (Codex). This turns review from a promise into
a rule.

### 4.2 "A first session" walkthrough
Add a short, concrete example of what happens after typing `fkit` in a brand-new project. Base it on
the real flow described in the current README and `claude/README.md`:
terminal intake → producer runs `/fkit-initiate-project` → lead opens → you give a goal → producer
writes a brief → coder builds (`/fkit-task-ship-loop`) → reviewer + Codex review → producer closes.
Format: a numbered list or an abbreviated transcript, 8–15 lines. If you show transcript text, it
must match what the tool actually prints. Check it against the skills; don't make it up.

### 4.3 Glossary of fkit terms
Define each term in one line, either at first use or in a short "Key terms" list:
**brief**, **ship loop**, **sprint**, **review ledger**, **consult** (`@fkit-<role>`),
**role-locked session**, **lead**, **producer**, **ADR**, **wiki librarian**.

### 4.4 Practical facts that are currently missing
Check each against the code before writing it:

- **Supported platforms.** The README doesn't say which OSes work. `install.sh` is POSIX `sh` and
  writes to `~/.local/...`, which suggests macOS/Linux. Confirm, and state the Windows status
  (WSL? unsupported?). If unknown → `TODO(owner)`.
- **What the installer does.** Verified from `install.sh`: it installs to
  `$HOME/.local/share/fkit` (`FKIT_SHARE`) and puts the `fkit` launcher in `$HOME/.local/bin`
  (`FKIT_BIN`). It tracks `main` by default (`FKIT_REF`). State this, mention the override variables,
  and say `~/.local/bin` must be on `PATH`. Link to `install.sh` so `curl | sh` users can read it
  first.
- **Uninstall.** Give the exact commands: remove the two install locations. Also cover project-side
  leftovers: `.claude/agents/fkit-*.md`, `.claude/skills/fkit-*/`, and optionally `ai-agents/`,
  `CLAUDE.md`, `AGENTS.md`. Make clear that `ai-agents/` holds the user's own work.
- **Cost / usage note.** fkit runs several Claude Code sessions and optionally Codex, so it uses
  noticeably more model quota/tokens than a single session. One honest sentence is enough.
- **Environment variables in one place.** A small table: `FKIT_NO_UPDATE_CHECK`, `FKIT_NO_SELF_HOST`,
  `FKIT_SETUP_ONLY`, `FKIT_SHARE`, `FKIT_BIN`, `FKIT_REF` (plus any others found in
  `claude/fkit-claude.sh` / `install.sh`).

### 4.5 Contributing section + `CONTRIBUTING.md`
In the README, 3–4 lines: fkit is developed with fkit, tests are `npm test`, releases follow
`RELEASING.md`, and details are in `CONTRIBUTING.md`. In `CONTRIBUTING.md`: the layout tree (moved
from the README), test commands from `package.json`, the release flow pointer, and how changes go
through the fkit roles in this repo.

### 4.6 Badges (top of README, one line)
- CI status for `.github/workflows/test.yml`
- Version (from `VERSION`, or a GitHub release/tag badge if tags exist)
- License: MIT

---

## 5. Restructure: target outline

```
# fkit
[badges]
[teaser GIF]                     ← keep, it's good
One-paragraph pitch              ← keep the current first paragraph, lightly tightened
## Why fkit                      ← NEW (4.1)
## Install & run                 ← current section, tightened + platforms, PATH note
## A first session               ← NEW (4.2)
## See it in action              ← the video, moved here from the top
## The team                      ← keep the table; plain-language role-lock paragraph; no ADR links
## Key terms                     ← NEW (4.3), can be merged into "The team" if short
## Updating                      ← "Staying current" rewritten as a table (see below) + /fkit-heal in 2–3 lines
## Configuration                 ← NEW env-var table (4.4)
## Uninstall                     ← NEW (4.4)
## Setting up a project by hand  ← keep, shortened
## Web board (repo-local)        ← 2–3 lines + link to docs/board.md
## Contributing                  ← NEW (4.5)
## Roadmap                       ← keep, one line, no ADR link (or a single one)
## License
```

### "Updating" as a table
Replace the current long paragraphs with something like:

| Situation | What happens |
|---|---|
| Normal `fkit` launch | Throttled check; **tells** you if a newer version exists, never auto-updates |
| `fkit update` | Updates the installed fkit only, not your projects |
| Next `fkit` launch in a project | Rewrites that project's `.claude/agents/fkit-*` and `.claude/skills/fkit-*` |
| Project not re-launched since update | Keeps old agents/skills silently. Run `FKIT_SETUP_ONLY=1 fkit` there |
| Inside a checkout of the fkit repo | No auto-check; `fkit update` refuses → use `git pull`; uses the checkout's own `claude/` |

Then 2–3 lines on drift detection and `/fkit-heal`: a one-line warning at launch, repair is
consent-gated, and `ai-agents/.fkit-accepted-drift` silences paths you changed on purpose.

---

## 6. Other fixes in the same PR

1. **`package.json` description is out of date.** It lists six roles and omits the **lead**. The
   README says seven. Update it to match, since it shows up on npm and in search.
2. **Stray file at repo root.** `handoff-fkit-status-filtered-board.md` (dated 2026-07-18) is an
   internal session handoff note sitting next to the README. Move it under `ai-agents/` (e.g.
   alongside the related task) or delete it if the task is done. **Ask the owner before deleting.**
3. **Root `CLAUDE.md` / `AGENTS.md` / `ai-agents/`.** Visitors may think these are part of the
   product. One README line explains it: "fkit is developed with fkit, so this repo's own
   `ai-agents/`, `CLAUDE.md` and `AGENTS.md` are its working files."
4. **GitHub "About" box (owner action, not in the PR).** Suggest a short description and topics
   matching `package.json` keywords (`claude-code`, `ai-agents`, `codex`, `code-review`,
   `multi-agent`). List this in the PR description as a manual step.

---

## 7. Checks before opening the PR

- [ ] Every relative link in `README.md`, `docs/board.md`, `CONTRIBUTING.md`, `CHANGELOG.md` resolves
      (a quick script: extract `](path)` targets, test each with `-e`).
- [ ] Every fact removed from the README can be found in a linked doc (do a section-by-section diff).
- [ ] Every new factual claim (paths, env vars, OS support, uninstall steps) has been checked against
      `install.sh` / `claude/fkit-claude.sh`. Unverifiable ones are marked `TODO(owner)`.
- [ ] `npm test` still passes. Some tests may read docs or the manifest; if
      `claude/structure-manifest.tsv` or the scaffold is affected, run
      `npm run generate:manifest` as the repo's process requires.
- [ ] README renders correctly on GitHub (preview the branch): tables, GIF, video embed, badges.
- [ ] README length is roughly 110–130 lines.

## 8. PR description should include

- A short summary of the restructure, and where each moved section now lives.
- The list of `TODO(owner)` items needing Mark's input (likely: Windows support, whether to keep
  "History", whether to delete the handoff file).
- The manual GitHub "About"/topics step.
- Before/after line counts.
