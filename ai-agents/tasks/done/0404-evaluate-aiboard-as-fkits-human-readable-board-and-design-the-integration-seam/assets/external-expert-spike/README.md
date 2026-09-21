# ⚠️ THROWAWAY SPIKE — a demonstration, not a component

Written by `fkit-external-expert`, 2026-09-18, as evidence for
[the external expert verdict](../../../../../knowledge-base/reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md).
Preserved here (task `0404`'s `assets/`) at `fkit-lead`'s request so it survives a reboot.
**Do not ship, extend, or depend on it.** It exists to show that something is possible and how cheap it is.

| File | What it is |
|---|---|
| `fkit_board_spike.py` | Read-only adapter. Serves aiboard's **unmodified** `web/index.html` over fkit's **unmodified** `ai-agents/` tree. Refuses every POST; writes nothing anywhere. `python3 fkit_board_spike.py` → `http://127.0.0.1:8585/`. `--bench` prints snapshot timing (measured: 405 tasks, 37 ms warm). |
| `index_fkit.py` | One-pass indexer + audits: id-vs-folder, duplicate ids, status-vs-folder, and a dependency audit. ⛔ **The dependency section's numbers are WITHDRAWN** — the prose contains negated ids (`0127`: *"0128 does **not** depend on…"*), so an id on a `Depends on:`/`Blocks:` line is not evidence of an edge. Kept as the record of why regex extraction is unsafe. Writes `fkit_index.json` beside itself (gitignored). |
| `rows.py` | The tight board-row audit (run `index_fkit.py` first). Rule: rows whose first cell starts with a status glyph and whose **last** cell links a task folder; `➡️` rows excluded. Result 2026-09-18: 0 row-vs-brief disagreements / 403, 0 `## Sprint` disagreements, tasks with no live row: `0004`, `0014`. |

**Known limits.** Both repo paths are hard-coded absolute paths to the owner's machine. Python 3.9, stdlib only.
The card mapping is the author's choices: priority flattened to `medium`; `P<n>`, the agent-closed marker and
`plan`/`review`/`worklog` presence shown as labels; `🚧` → the `blocked` flag; dependencies not mapped at all.
Sprint status is read from the **first** status glyph on the board's line 3 — a first draft that matched *any* `⛔`
mis-read Sprint 11 as cancelled, because its banner carries a later `⛔ PARTIALLY FROZEN`.

**Where a real version belongs:** in aiboard, as a pluggable store-adapter seam (after the Node port), with
fkit shipping the adapter for its own tree. This file is not that.
