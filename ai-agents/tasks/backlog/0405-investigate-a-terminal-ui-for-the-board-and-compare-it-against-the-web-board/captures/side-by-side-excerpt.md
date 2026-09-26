# The same six rows, before and after (w=120)
Generated from `before-backlog.txt` and `after-backlog-120.txt` — the first six data rows
of the SAME render. Nothing is re-ordered or hand-picked.

## BEFORE — `dashboard.sh` raw

```
| 🔲 Backlog | — | Add two worked examples to `evidence-before-assertion.md` — task 36, and the ADR-029/030 vault repair | [`0013-add-worked-example-to-evidence-before-assertion`](../tasks/backlog/0013-add-worked-example-to-evidence-before-assertion/brief.md) | fkit-producer | ⟨derive: none recorded⟩ |
| 🔲 Backlog | — | Extend `prove-red.sh` to reach `fkit-claude-init.sh` (add the missing test seam) | [`0037-extend-prove-red-to-reach-init`](../tasks/backlog/0037-extend-prove-red-to-reach-init/brief.md) | fkit-coder | ⟨derive: none recorded⟩ |
| 🔲 Backlog | — | Gate the read-side symlink hazard when init reads inside `ai-agents/` | [`0045-gate-read-side-symlink-hazard-in-init`](../tasks/backlog/0045-gate-read-side-symlink-hazard-in-init/brief.md) | fkit-coder | ⟨derive: none recorded⟩ |
| 🔲 Backlog | — | Design an observer-agent + notes-driven self-improvement (skill-tuning) system … | [`0121-design-observer-agent-and-skill-tuning-system`](../tasks/backlog/0121-design-observer-agent-and-skill-tuning-system/brief.md) | fkit-architect | ⟨derive: nothing — the design can start now.⟩ |
| 🔲 Backlog | — | Add the dual-home scoping check to `/fkit-task-brief` … | [`0131-add-dual-home-scoping-check-to-task-brief`](../tasks/backlog/0131-add-dual-home-scoping-check-to-task-brief/brief.md) | fkit-coder | ⟨derive: nothing. Independent of 0132 and 0133 — it prevents *future* drift where those two fix and detect *existing* drift.⟩ |
| 🚧 Blocked — sequenced behind `0408` (ADR-050's mover command); see the 2026-09-18 note in the Task cell | — | Add the sanctioned producer-only reconcile mode to `/fkit-task-done` — and mirror both ship-loops as one unit … | [`0135-add-producer-only-reconcile-mode-to-task-done`](../tasks/backlog/0135-add-producer-only-reconcile-mode-to-task-done/brief.md) | fkit-coder | ⟨derive: 0134 (the ADR — hard; the must-never list is the deliverable and it is not this task's to invent) and 0124 (which rewrites both movers' SKILL prose to producer-only; landing this first would collide in `fkit-task-done/SKILL.md` and `fkit-task-cancelled/SKILL.md`), and 0408 (added 2026-09-18 — ADR-050's mover command; building this mode against prose movers means building it twice. ⚠️ Conditional — this term is VOID if ADR-050 is not accepted in a form that moves mover mechanics out of prose. See the 2026-09-18 dated note at the end of this brief).⟩ |
```

## AFTER — `board-narrow.mjs --width 120`

```
Status         #    Task                                            Id   Owner     Next step
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
🔲 Backlog     —    Add two worked examples to evidence-before-ass… 0013 producer  none recorded
🔲 Backlog     —    Extend prove-red.sh to reach fkit-claude-init.… 0037 coder     none recorded
🔲 Backlog     —    Gate the read-side symlink hazard when init re… 0045 coder     none recorded
🔲 Backlog     —    Design an observer-agent + notes-driven self-i… 0121 architect nothing — the design can start now.
🔲 Backlog     —    Add the dual-home scoping check to /fkit-task-… 0131 coder     nothing. Independent of 0132 and 013…
🚧 Blocked     —    Add the sanctioned producer-only reconcile mod… 0135 coder     0134 (the ADR — hard; the must-never…
```
