import re, json
from pathlib import Path
ROOT = Path("/Users/mark.dolbyrev/Workspace/fkit/ai-agents")
idx = json.load(open(Path(__file__).with_name("fkit_index.json")))  # written by index_fkit.py; run that first
G = "🔲🔄🚧✅⛔➡"
live = {}; total = 0; moved = 0; drift = []
for p in sorted(ROOT.glob("sprints/**/sprint-*.md")) + [ROOT/"sprints/backlog.md"]:
    for line in p.read_text(encoding="utf-8").splitlines():
        if not line.startswith("|"): continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 4 or not cells[0] or cells[0][0] not in G: continue
        m = re.search(r"tasks/(?:backlog|done|cancelled)/(\d{4})-", cells[-1])
        if not m: continue
        t = m.group(1); total += 1
        if cells[0][0] == "➡": moved += 1; continue
        live.setdefault(t, []).append(p.stem)
        bs = idx.get(t, {}).get("fields", {}).get("Status", "?")
        if bs[0] != cells[0][0] or ("agent-closed" in bs) != ("agent-closed" in cells[0]):
            drift.append((p.stem, t, cells[0][:45], bs[:45]))
print("status-led task rows:", total, "moved:", moved, "tasks with a live row:", len(live))
print("tasks with >1 live row:", {t: b for t, b in live.items() if len(b) > 1})
print("tasks with no live row:", sorted(set(idx) - set(live)))
print("row-vs-brief disagreements (glyph or agent-closed marker):", len(drift))
for d in drift: print("  ", d)
# sprint field vs live row board
bad = []
for t, b in live.items():
    s = idx[t]["fields"].get("Sprint", "")
    m = re.match(r"Sprint\s+(\d+)", s); want = f"sprint-{m.group(1)}" if m else "backlog"
    if want not in b: bad.append((t, s, b))
print("## Sprint disagrees with live row's board:", len(bad)); [print("  ", x) for x in bad[:20]]
