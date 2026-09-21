# `0409` before/after captures — the commands, the date, the exit codes

**Captured 2026-09-20** during the `0409` build, against the working tree at commit `add6a07`.
These are the FULL renders, untruncated, as [`plan.md`](../plan.md) §8 step 1 requires.

## The commands, exactly as run

```sh
# BEFORE — with dashboard.sh as it stood before 0409
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-11.md > before-sprint-11.txt
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md    > before-backlog.txt

# AFTER — same commands, with title_cell() in place
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-11.md > after-sprint-11.txt
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md    > after-backlog.txt
```

⚠️ Invoked as `bash <path>`, never `./<path>` — mirroring the skill's real call site (ADR-017 rule 2).
The producer-owned `/fkit-status` skill was **not** invoked; this is the script directly.

## Exit codes — captured directly, never through a pipe

| Capture | Exit | stderr |
|---|---|---|
| `before-sprint-11.txt` | **0** | empty (0 bytes) |
| `before-backlog.txt` | **0** | empty (0 bytes) |
| `after-sprint-11.txt` | **0** | empty (0 bytes) |
| `after-backlog.txt` | **0** | empty (0 bytes) |

## What they show

| | Before | After |
|---|---|---|
| `backlog.md` render | 458,446 bytes, 246 lines | **74,980 bytes**, 246 lines (**−83.6%**) |
| `sprint-11.md` render | 10,541 bytes, 19 lines | **1,812 bytes**, 19 lines (**−82.8%**) |

`⟦FACTS⟧` and the roll-up are **byte-identical** between each before/after pair (`diff`, exit 0) —
that is the drift-safety proof on the live corpus, alongside the `0409/facts-identical` test.

⚠️ `sprint-11.md` was modified in the working tree relative to `add6a07`, so its BEFORE bytes differ
slightly from the figures in `plan.md` §1 (10,541 vs 10,381). `backlog.md` was not, and its 458,446
matches the plan exactly — it is the stable comparison. See [`../scoring-table.md`](../scoring-table.md).

⚠️ **`before-backlog.txt` is 458 KB of committed text.** That is deliberate — `plan.md` §8 asked for
the full length, and a truncated "before" could not evidence the claim. It is also, itself, a fair
illustration of the problem `0383` exists to fix.
