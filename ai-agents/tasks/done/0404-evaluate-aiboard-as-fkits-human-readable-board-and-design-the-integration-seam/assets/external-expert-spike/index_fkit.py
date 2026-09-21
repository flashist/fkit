"""One-pass read-only index of fkit's ai-agents tree. Writes nothing to the repo."""
import re, sys, time, json
from pathlib import Path
from collections import Counter, defaultdict

ROOT = Path("/Users/mark.dolbyrev/Workspace/fkit/ai-agents")
t0 = time.perf_counter()

FIELD = re.compile(r"^## (ID|Sprint|Priority|Status|Owner)\s*\n+([^\n]+)", re.M)
tasks = {}
dups = []
total_bytes = 0
for board in ("backlog", "done", "cancelled"):
    for d in sorted((ROOT / "tasks" / board).iterdir()):
        if not d.is_dir():
            continue
        m = re.match(r"(\d{4})-", d.name)
        if not m:
            continue
        text = (d / "brief.md").read_text(encoding="utf-8")
        total_bytes += len(text.encode())
        f = dict(FIELD.findall(text))
        h1 = re.search(r"^# (.+)$", text, re.M)
        dep = re.search(r"^\s*[-*]\s*\*\*[^A-Za-z]*Depends on:?\*\*:?(.*)$", text, re.M)
        blk = re.search(r"^\s*[-*]\s*\*\*[^A-Za-z]*Blocks:?\*\*:?(.*)$", text, re.M)
        tid = m.group(1)
        if tid in tasks:
            dups.append(tid)
        tasks[tid] = dict(folder=board, dir=d.name, title=h1.group(1) if h1 else None,
                          fields=f, dep_raw=dep.group(1).strip() if dep else None,
                          blk_raw=blk.group(1).strip() if blk else None)
t_index = time.perf_counter() - t0

print(f"indexed {len(tasks)} briefs, {total_bytes} brief bytes, in {t_index*1000:.0f} ms (one pass, cold parse)")
print("duplicate ids:", dups)

# --- id-mismatch sweep
mism = [(t, v["fields"].get("ID")) for t, v in tasks.items() if v["fields"].get("ID", "").strip() != t]
print("id-mismatch (folder prefix vs ## ID):", mism)

# --- status vs folder
def glyph_board(s):
    if s.startswith("✅"): return "done"
    if s.startswith("⛔"): return "cancelled"
    return "backlog"
drift = [(t, v["folder"], v["fields"].get("Status")) for t, v in tasks.items()
         if glyph_board(v["fields"].get("Status", "")) != v["folder"]]
print("status-vs-folder drift:", drift)
print("status glyph counts:", Counter(v["fields"].get("Status", "?")[:1] for v in tasks.values()))

# --- sprint field vs board rows
boards = {}
for p in list((ROOT / "sprints").glob("*.md")) + list((ROOT / "sprints/done").glob("*.md")) + list((ROOT / "sprints/cancelled").glob("*.md")):
    rows = {}
    for line in p.read_text(encoding="utf-8").splitlines():
        if not line.startswith("|"):
            continue
        ids = re.findall(r"tasks/(?:backlog|done|cancelled)/(\d{4})-", line)
        if not ids:
            continue
        status_cell = line.split("|")[1].strip()
        rows[ids[-1]] = status_cell  # the Brief-column link is last
    boards[p.stem] = rows
print("board files:", {k: len(v) for k, v in boards.items()})

def norm_sprint(s):
    s = s.strip()
    m = re.match(r"Sprint\s+(\d+)", s)
    if m: return f"sprint-{m.group(1)}"
    if s.lower().startswith("backlog"): return "backlog"
    return s
no_row, wrong_board, moved_only = [], [], []
for t, v in tasks.items():
    want = norm_sprint(v["fields"].get("Sprint", ""))
    live = [b for b, rows in boards.items() if t in rows and not rows[t].startswith("➡")]
    anyrow = [b for b, rows in boards.items() if t in rows]
    if not anyrow:
        no_row.append(t)
    elif want not in live:
        wrong_board.append((t, v["fields"].get("Sprint"), live, anyrow))
print(f"tasks with NO board row anywhere: {len(no_row)} -> {no_row[:40]}")
print(f"tasks whose ## Sprint names a board where they have no live (non-Moved) row: {len(wrong_board)}")
for w in wrong_board[:25]:
    print("   ", w)
multi_live = [(t, [b for b, r in boards.items() if t in r and not r[t].startswith('➡')]) for t in tasks]
multi_live = [x for x in multi_live if len(x[1]) > 1]
print(f"tasks with live rows on >1 board: {len(multi_live)} -> {multi_live[:15]}")

# --- board row status vs brief status
rowdrift = []
for b, rows in boards.items():
    for t, cell in rows.items():
        if t not in tasks or cell.startswith("➡"):
            continue
        bs = tasks[t]["fields"].get("Status", "")
        if cell[:1] != bs[:1]:
            rowdrift.append((b, t, cell[:30], bs[:30]))
print(f"live board-row glyph != brief glyph: {len(rowdrift)}")
for r in rowdrift[:25]:
    print("   ", r)

# --- dependency edges (id extraction from the raw line; prose ignored)
def ids(raw):
    return set(re.findall(r"(?<![\d.])(\d{4})(?![\d-])", raw or "")) & set(tasks)
dep = {t: ids(v["dep_raw"]) - {t} for t, v in tasks.items()}
blk = {t: ids(v["blk_raw"]) - {t} for t, v in tasks.items()}
n_dep = sum(len(s) for s in dep.values()); n_blk = sum(len(s) for s in blk.values())
miss_inverse_blk = [(a, b) for a, s in dep.items() for b in s if a not in blk[b]]   # a depends on b, b doesn't say Blocks a
miss_inverse_dep = [(a, b) for a, s in blk.items() for b in s if a not in dep[b]]   # a blocks b, b doesn't say Depends on a
print(f"dep lines present: {sum(1 for v in tasks.values() if v['dep_raw'] is not None)}, blocks lines present: {sum(1 for v in tasks.values() if v['blk_raw'] is not None)}")
print(f"id-edges: depends_on={n_dep}, blocks={n_blk}")
print(f"depends_on edges with no matching Blocks on the target: {len(miss_inverse_blk)} ({100*len(miss_inverse_blk)/max(n_dep,1):.1f}%)")
print(f"blocks edges with no matching Depends on on the target: {len(miss_inverse_dep)} ({100*len(miss_inverse_dep)/max(n_blk,1):.1f}%)")

# cycles on union graph (a -> b means a depends on b)
g = defaultdict(set)
for a, s in dep.items():
    g[a] |= s
for a, s in blk.items():
    for b in s: g[b].add(a)
state, stack, cycles = {}, [], []
sys.setrecursionlimit(5000)
def visit(n):
    state[n] = 1; stack.append(n)
    for m in sorted(g[n]):
        if state.get(m, 0) == 0: visit(m)
        elif state[m] == 1: cycles.append(stack[stack.index(m):] + [m])
    stack.pop(); state[n] = 2
for n in sorted(tasks):
    if state.get(n, 0) == 0: visit(n)
print(f"cycles in union dependency graph: {len(cycles)}")
for c in cycles[:10]: print("   ", " -> ".join(c))

# open tasks blocked by open tasks
openb = [(a, sorted(b for b in g[a] if tasks[b]['folder']=='backlog')) for a in tasks if tasks[a]['folder']=='backlog']
print("open tasks with >=1 open blocker:", sum(1 for a, b in openb if b), "of", len(openb))

json.dump({t: {k: v[k] for k in ("folder","dir","title","fields")} for t, v in tasks.items()},
          open(Path(__file__).with_name("fkit_index.json"), "w"), ensure_ascii=False)
