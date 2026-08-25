# Decide and implement init's behaviour when `.fkit/interview` is a hard link — `cat >` still truncates the shared inode

## ID
0332

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner-ruled 2026-08-24**, live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
**The option label is the verbatim text: "Accept residual + file its own task (Recommended)".**

The question put to the owner, **verbatim**:

> "R1: a HARD-LINKED `.fkit/interview` is still written through — `cat >` truncates the shared inode.
> Reproduced by the reviewer at HEAD and in the working tree: victim file overwritten, rc=0.
> Pre-existing, not a regression, and `[ -L ]` structurally cannot see a hard link."

The chosen option's description, **verbatim**:

> "The reviewer's pick. Same class as F1–F4 and the same ruling you gave them. Codex's suggested fix
> (temp-file-plus-rename) changes §4's write shape and needs its own red-first proof — not something
> to bolt onto a task scoped to the `-L` rule."

### The finding

`claude/fkit-claude-init.sh` §4 writes the first-run intake with a **truncating redirect**:

```
cat > "$dest/.fkit/interview" <<'INTERVIEW'
```

It is guarded by `path_contained ".fkit/interview" write`. **That guard tests `[ -L ]` on each path
component and nothing else** (plus an absolute-path rejection and a `..` rejection). A hard link is
not a symlink: `[ -L ]` on a hard-linked leaf is **false**, the guard returns 0, and `cat >` truncates
and rewrites the **shared inode** — so a victim file elsewhere in the project is destroyed.

**Reproduced independently by three workers.** The reviewer measured it at `HEAD` and in the working
tree (victim 22 B → 2780 B, `rc=0`, no refusal, **both**). The filing producer reproduced it again
**firsthand on 2026-08-24** against the current working tree, in a scratch directory outside the repo:

| | |
|---|---|
| victim before | 19 B (`[ -L ]` on the leaf → **no**, `nlink` → **2**) |
| victim after `fkit-claude-init.sh` | **2780 B** — the intake script body |
| init exit code | **0** |
| refusal lines on stderr | **0** |

⛔ **Pre-existing. `0046` neither caused this nor worsened it.** `0046` closed the **symlink** shape;
this is a different shape that its guard structurally cannot reach.

### ⛔ It is structurally impossible to fix by extending `path_contained` — do not try

`path_contained` walks a path **component by component** and asks one question per component: *is this
name a symlink?* **There is no "is this inode linked elsewhere" question a per-component symlink test
can ask.** Hard-link membership is a property of the *inode* (`st_nlink`), not of any *name* on the
path. Any fix must change **what §4 does when it writes**, not what the containment walk checks.

⚠️ Recording this because the obvious-looking move — "add one more test to the helper" — is a dead
end, and a run that starts there will burn its budget before discovering why.

### Severity is `low` — and the reasoning must survive scheduling

1. **Hard links cannot cross filesystems.** The attacker's link and the victim file must sit on the
   same volume as the project.
2. **Creating the link requires write access inside the project directory already.** Anyone who can
   plant `.fkit/interview` as a hard link can equally overwrite the victim file directly.

⇒ **A foot-gun, not an escalation path.** It costs a careless user a file; it does not grant anyone a
capability they lacked.

⚠️ **The rating is contested and the history matters.** Codex raised this **HIGH** — from reasoning it
**never reproduced** (its second-opinion pass ran `--sandbox read-only` under
[ADR-042](../../../knowledge-base/decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so.md) D1, so it
measured nothing needing a write). Two workers then reproduced it and priced it `low`; the filing
producer's own reproduction above agrees.

⛔ **Re-raise above `low` only on new evidence of a route that creates the hard link WITHOUT
pre-existing write access inside the project.** Absent such a route, `low` stands — do not re-rate it
from the severity word alone.

## What to build

**This task has a decision in front of it, and the decision is deliberately NOT pre-made.** Two
candidate fixes were identified; neither was chosen.

### Candidate A — refuse on `st_nlink > 1`

Before writing, check the existing leaf's link count and **refuse + report** when it is greater than 1,
the same non-fatal shape §4 already uses for a symlink refusal (warn to stderr, setup carries on).

- **For:** smallest change; keeps §4's write shape (`cat >`) exactly as it is; the refusal message and
  its non-fatal contract already exist and are already tested.
- **Against:** it refuses rather than repairs, so a user with a legitimately hard-linked file gets no
  intake; `stat`'s link-count flag is **not portable** between BSD/macOS (`stat -f %l`) and GNU/Linux
  (`stat -c %h`), and this script must run on both — so it needs a portability shim or an `ls -l`
  parse, both of which have their own edge cases.

### Candidate B — write a temp file and `rename()` over the leaf

Write the intake body to a temp file in the same directory, then atomically `mv` it over
`.fkit/interview`. `rename()` replaces the **name**, leaving the victim inode untouched.

- **For:** fixes the class rather than detecting one instance; also makes the write atomic (no
  half-written intake if init is interrupted); this is what Codex suggested.
- **Against:** it **changes §4's write shape**, which is the higher-risk half; the temp file needs its
  own containment reasoning (it is a new `$dest`-relative write, so it is in scope for the same
  `path_contained` rule) and its own cleanup on failure; and it silently *detaches* the hard link
  rather than telling the user anything happened.

⚠️ **Both candidates change what §4 does on write, and both therefore need their own red-first
proof.** That is precisely why this is a separate task and not an amendment bolted onto `0046`, whose
scope was the `-L` rule.

### Steps

1. **Reproduce first, before any edit** — the scratch reproduction above, captured into the worklog as
   the "before" half. A run that starts from this brief's numbers instead of its own has skipped the
   step that matters.
2. **Choose between A and B, and put the choice to the owner** — this is a design call with a real
   trade-off (refuse-and-tell vs. repair-silently), not an implementation detail. If the owner is not
   present, return it as an open question; do not settle it inside the run.
3. **Write the failing test first**, and confirm it goes **red at the named assertion**. A test green
   before the fix is not testing this defect.
4. **Implement the chosen candidate**, non-fatal, consistent with §1's and `0088`'s bar: a refusal (or
   a fallback) warns and setup carries on. ⛔ The intake must never brick the launcher.
5. **Re-run the full suite** and the red-first gate.

## Verification steps

- **Red-first:** the new test fails at its named assertion against the untouched tree, and the control
  case (a plain, non-linked `.fkit/interview`) stays green. Record both.
- **The hard-link case:** with `.fkit/interview` hard-linked to a victim file, run init and assert the
  victim's **content and byte count are unchanged**. Assert on the victim, not only on init's exit
  code — `rc=0` is what the current defect already returns.
- **The symlink cases still pass:** `0046`'s `test/init-intake-guard.test.js` must stay green in full.
  This task must not regress the `-L` rule it sits beside.
- **Non-fatal contract:** init's exit code is unchanged and the rest of setup completes, whichever
  candidate ships.
- **Portability, if candidate A ships:** the link-count probe must be exercised (or explicitly shown
  to be shimmed) for both the BSD and GNU `stat` dialects. ⚠️ Do not assume the developer's own
  platform is the only one — `claude/skills/fkit-status/dashboard.sh`'s header documents this exact
  trap for this repo.
- **Full suite green**, and the `prove-red` hard gate passes.

## Notes

- **Depends on: nothing.** `0046` has closed
  ([`0046-gate-symlink-escape-in-init-intake-write`](../../done/0046-gate-symlink-escape-in-init-intake-write/brief.md))
  and this task does not need anything from it beyond the helper already being where it is.
- **Relation to `0046`:** `0046` closed the **symlink** shape of §4's write. This is the **hard-link**
  shape — a different mechanism its guard cannot see. `0046`'s review ledger records this as accepted
  residual **R1**, owner-ruled, which is why this row exists.
- **Relation to `0327`–`0330`:** same audit class — the sweep of `$dest`-relative writes in
  `fkit-claude-init.sh` and the launcher that `0046`'s plan §6 produced. Those four are symlink-shaped;
  this one is not, and it shares no code path with them.
  - [`0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim`](../../done/0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim/brief.md)
  - [`0328-make-inits-two-mkdir-p-calls-non-fatal-so-a-weird-fkit-or-claude-cannot-abort-setup`](../0328-make-inits-two-mkdir-p-calls-non-fatal-so-a-weird-fkit-or-claude-cannot-abort-setup/brief.md)
  - [`0329-decide-and-implement-inits-behaviour-when-gitignore-is-a-symlink`](../0329-decide-and-implement-inits-behaviour-when-gitignore-is-a-symlink/brief.md)
  - [`0330-gate-the-launchers-fkit-lockdown-writes-against-a-symlinked-fkit`](../0330-gate-the-launchers-fkit-lockdown-writes-against-a-symlinked-fkit/brief.md)
- ⛔ **Filed by a spawned `fkit-producer` with NO owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)):
  **appended to the unranked Backlog board, `## Priority` `Unscheduled`. Nothing was re-ranked by this
  filing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md))
  and no other task's `## Status` was changed.**
- **Every figure in this brief that is not the filing producer's own measurement is labelled as
  second-hand.** The 22 B → 2780 B pair is the reviewer's; the 19 B → 2780 B pair is this producer's,
  measured 2026-08-24 against the working tree. **Re-measure before relying on either.**
