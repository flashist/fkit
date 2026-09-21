"""THROWAWAY SPIKE (fkit-external-expert, 2026-09-18).

Read-only adapter: serves aiboard's UNMODIFIED web board over fkit's UNMODIFIED
ai-agents/ tree. Writes nothing anywhere. Every POST is refused.

    python3 fkit_board_spike.py            # then open http://127.0.0.1:8585/
"""
import json, re, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

FKIT = Path("/Users/mark.dolbyrev/Workspace/fkit/ai-agents")
UI = Path("/Users/mark.dolbyrev/Workspace/aiboard/aiboard/web/index.html")
FIELD = re.compile(r"^## (ID|Sprint|Priority|Status|Owner)\s*\n+([^\n]+)", re.M)
STATUSES = ["backlog", "in-progress", "done", "cancelled"]


def sprint_id(raw):
    m = re.match(r"Sprint\s+(\d+)", raw or "")
    return f"S-{int(m.group(1)):03d}" if m else None


def load_tasks(bodies=False):
    out = []
    for board in ("backlog", "done", "cancelled"):
        for d in sorted((FKIT / "tasks" / board).iterdir()):
            m = re.match(r"(\d{4})-", d.name)
            if not (d.is_dir() and m):
                continue
            text = (d / "brief.md").read_text(encoding="utf-8")
            f = dict(FIELD.findall(text))
            h1 = re.search(r"^# (.+)$", text, re.M)
            st = f.get("Status", "")
            status = "in-progress" if (board == "backlog" and st.startswith("🔄")) else board
            labels = []
            if "agent-closed" in st: labels.append("agent-closed")
            if st.startswith("🚧"): labels.append("blocked")
            if (f.get("Priority") or "Unscheduled") != "Unscheduled": labels.append(f["Priority"])
            for extra in ("plan.md", "review.md", "worklog.md"):
                if (d / extra).exists(): labels.append(extra[:-3])
            t = {"id": m.group(1), "title": h1.group(1) if h1 else d.name, "status": status,
                 "sprint": sprint_id(f.get("Sprint")), "priority": "medium", "assignee": f.get("Owner"),
                 "labels": labels, "blocked_by": [], "blocked": st.startswith("🚧"), "blockers": [],
                 "last_activity": None, "stale": False, "comments_count": 0, "last_comment_by": None,
                 "needs_reply": False, "created": None, "updated": None, "folder": d.name, "path": str(d)}
            if bodies:
                t["_text"] = text
            out.append(t)
    return out


def load_sprints(tasks):
    sprints = []
    files = list((FKIT / "sprints").glob("sprint-*.md")) + list((FKIT / "sprints").glob("*/sprint-*.md"))
    for p in sorted(files, key=lambda p: int(re.search(r"(\d+)", p.stem).group(1))):
        n = int(re.search(r"(\d+)", p.stem).group(1))
        lines = p.read_text(encoding="utf-8").splitlines()
        banner = lines[2] if len(lines) > 2 else ""
        first = next((c for c in banner if c in "🔲🔄✅🔒⛔"), "")  # FIRST glyph only: banners carry later ⛔ prose
        status = ("cancelled" if p.parent.name == "cancelled" or first == "⛔" else
                  "done" if p.parent.name == "done" or first in "✅🔒" and first else
                  "in-progress" if first == "🔄" else "backlog")
        sid = f"S-{n:03d}"
        members = [t for t in tasks if t["sprint"] == sid]
        counts = {s: sum(1 for t in members if t["status"] == s) for s in STATUSES}
        total = len(members)
        sprints.append({"id": sid, "title": lines[0].lstrip("# ").strip()[:120], "status": status,
                        "goal": banner.lstrip("> #").strip()[:300], "start": None, "end": None,
                        "tasks": [t["id"] for t in members], "created": None, "updated": None,
                        "folder": p.name, "path": str(p),
                        "progress": {"total": total, "counts": counts,
                                     "percent": round(100 * counts["done"] / total) if total else 0,
                                     "remaining": counts["backlog"] + counts["in-progress"]}})
    return sprints


def snapshot():
    tasks = load_tasks()
    return {"root": str(FKIT), "name": "fkit (read-only spike)", "statuses": STATUSES, "tasks": tasks,
            "sprints": load_sprints(tasks), "generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "read_only": True}


class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def _send(self, code, body, ctype="application/json; charset=utf-8"):
        self.send_response(code); self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body))); self.send_header("Cache-Control", "no-store")
        self.end_headers(); self.wfile.write(body)

    def do_POST(self):
        self._send(400, json.dumps({"error": "read-only spike: nothing is ever written"}).encode())

    def do_GET(self):
        path = self.path.split("?")[0]
        if path in ("/", "/index.html"):
            return self._send(200, UI.read_bytes(), "text/html; charset=utf-8")
        if path == "/api/board":
            return self._send(200, json.dumps(snapshot(), ensure_ascii=False).encode())
        if path.startswith("/api/tasks/"):
            tid = path.rsplit("/", 1)[1]
            for t in load_tasks(bodies=True):
                if t["id"] == tid:
                    d = Path(t["path"]); t["brief"] = t.pop("_text"); t["comments"] = []
                    wl = d / "worklog.md"
                    t["worklog"] = ([{"timestamp": "", "author": "worklog.md", "text": wl.read_text(encoding="utf-8")}]
                                    if wl.exists() else [])
                    return self._send(200, json.dumps(t, ensure_ascii=False).encode())
        if path.startswith("/api/sprints/"):
            sid = path.rsplit("/", 1)[1]; tasks = load_tasks()
            for s in load_sprints(tasks):
                if s["id"] == sid:
                    s["description"] = Path(s["path"]).read_text(encoding="utf-8")[:20000]
                    s["tasks_detail"] = [t for t in tasks if t["sprint"] == sid]
                    return self._send(200, json.dumps(s, ensure_ascii=False).encode())
        if path == "/api/check":
            return self._send(200, json.dumps({"ok": True, "problems": []}).encode())
        self._send(404, json.dumps({"error": "not found"}).encode())


if __name__ == "__main__":
    if "--bench" in sys.argv:
        for _ in range(3):
            t0 = time.perf_counter(); s = snapshot(); dt = time.perf_counter() - t0
            print(f"snapshot: {len(s['tasks'])} tasks, {len(s['sprints'])} sprints, {dt*1000:.0f} ms, "
                  f"{len(json.dumps(s, ensure_ascii=False).encode())} payload bytes")
    else:
        print("fkit read-only board spike: http://127.0.0.1:8585/  (Ctrl+C to stop)")
        ThreadingHTTPServer(("127.0.0.1", 8585), H).serve_forever()
