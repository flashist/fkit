#!/usr/bin/env bash
# fkit reconnect — client-side recovery tool for disconnected fkit subagent runners.
#
# Context: see ai-agents/knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md.
# A session's runner process can die (runner_online: false / status: failed) while the
# conversation itself survives server-side. Recovery is a known, FIRST-PARTY Omnigent feature —
# the Web UI's own per-session "Agent disconnected" notification gives a human a ready-to-copy
# `omnigent run <bundle>/config.yaml --resume <conv_id> --server <url>` command. This script does
# NOT invent that reconnect mechanism; it only automates the two things a human would otherwise
# have to do under pressure: (a) finding WHICH sessions in the whole fkit-team tree are
# disconnected, by recursively walking it (root -> teammates -> any ad hoc consult
# grandchildren), and (b) running the reconnect command for each one it finds, then confirming it
# actually came back.
#
# Caveats — read before pointing this anywhere but a local dev box:
#   - Uses GET /v1/sessions/{id}/child_sessions and GET /v1/sessions/{id}, INTERNAL Omnigent
#     server endpoints with no published external API contract. Confirmed (not assumed) against
#     the installed Omnigent package source to be the same mechanism the Web UI's own child-session
#     panel uses, so treat it as stable-per-source rather than a fragile reverse-engineered hack —
#     but it is not on the agent-facing MCP tool surface. Retire this whole script once the
#     Omnigent platform ships a first-class reconnect + tree-visibility tool (the incident doc's
#     ask #4).
#   - Assumes a LOCAL, UNAUTHENTICATED dev server (the only case fkit runs today). Before running
#     this against anything else, confirm whether the server requires auth and, if so, reuse
#     whatever credential the `omnigent` CLI itself already uses — don't invent a new one here.
#   - The omnigent.closed label filter is LOAD-BEARING, not cosmetic: a session deliberately ended
#     via sys_session_close carries labels["omnigent.closed"] == "true" and must never be treated
#     as a reconnect candidate. Removing that filter would make this script "reconnect" sessions
#     that were intentionally closed.
#   - Scoped to fkit's own known topology: every session in a fkit-team tree is expected to be one
#     of the six vendored bundles under .fkit/agents/ (or fkit-team itself), spawned by
#     config_path. If the server reports a node without an omnigent agent binding (e.g. a
#     claude-native sub-agent with no agent_name), that's treated as an unexpected shape for THIS
#     tool and surfaced as a clear error rather than guessed at.
#   - Human-operator CLI tooling only. Nothing in fkit-team or any teammate invokes this script
#     autonomously — that would expand the team's "orchestrates, never acts" charter and needs its
#     own explicit decision, not a side effect of this script existing.
#
# Usage:  fkit reconnect [--help]     (run from the project root, i.e. wherever `fkit` runs)
# Env:    FKIT_RECONNECT_TIMEOUT      seconds to wait per session for it to come back idle
#                                     (default 60).
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: fkit reconnect [--help]

Recursively walks the live fkit-team session tree (root -> teammates -> any ad hoc consult
grandchildren), finds every session whose runner has disconnected (runner_online: false, or
status: failed), and reconnects each one with the same `omnigent run <bundle>/config.yaml
--resume <conv_id> --server <url>` command the Web UI's own per-session "Agent disconnected"
dialog already gives a human. This script only automates FINDING which sessions need it and
running it for each — the reconnect command itself is a first-party Omnigent feature, not
invented here.

Caveats:
  - Uses /v1/sessions/{id}/child_sessions and /v1/sessions/{id}, INTERNAL Omnigent server
    endpoints with no published external API contract (confirmed — not assumed — to be the same
    mechanism the Web UI panel itself uses). Retire this once the Omnigent platform ships a
    first-class reconnect + tree-visibility tool.
  - Assumes a LOCAL, UNAUTHENTICATED dev server. Before pointing this at anything else, confirm
    whether the server requires auth and, if so, reuse whatever credential the `omnigent` CLI
    itself already uses.
  - Sessions labeled omnigent.closed=true (closed via sys_session_close) are NEVER reconnected —
    that filter is load-bearing, not cosmetic.

Env:
  FKIT_RECONNECT_TIMEOUT   seconds to wait for each reconnected session to come back idle before
                           reporting it as still unreachable (default 60).
USAGE
}

case "${1:-}" in
  -h|--help) usage; exit 0 ;;
  "") ;;
  *) echo "fkit reconnect: unrecognized argument '$1'" >&2; usage >&2; exit 1 ;;
esac

for b in curl python3 omnigent; do
  command -v "$b" >/dev/null 2>&1 || {
    echo "fkit reconnect: '$b' is required on PATH but was not found." >&2
    exit 1
  }
done

proj="$(pwd)"

_server_url() {  # mirrors fkit.sh's own _team_server_url — the real web-UI URL, not a hardcoded port
  omnigent host status --json 2>/dev/null \
    | sed -n 's/.*"server_url"[[:space:]]*:[[:space:]]*"\(http[^"]*\)".*/\1/p' | head -1
}
url="$(_server_url)"
if [ -z "$url" ]; then
  echo "fkit reconnect: no local Omnigent server appears to be running — start your team first (fkit)." >&2
  exit 1
fi

teamfile="$proj/.fkit/team-session"
if [ ! -f "$teamfile" ]; then
  echo "fkit reconnect: $teamfile not found — run 'fkit' in this project first to stand up the team." >&2
  exit 1
fi
root="$(head -1 "$teamfile" | tr -d '[:space:]')"
if [ -z "$root" ]; then
  echo "fkit reconnect: $teamfile is empty." >&2
  exit 1
fi

# Hand off to the Python engine for the actual tree walk / liveness check / reconnect / poll — the
# nested JSON (labels dicts, pagination) isn't something to parse safely with sed/grep, and every
# machine that can run the `omnigent` CLI this script shells out to already has a working python3
# (omnigent itself is a pip-installed Python package), so this isn't a new dependency in practice.
exec python3 - "$url" "$root" "$proj" <<'PYEOF'
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

BASE, ROOT_ID, PROJ = sys.argv[1], sys.argv[2], sys.argv[3]
TIMEOUT = int(os.environ.get("FKIT_RECONNECT_TIMEOUT", "60"))
POLL_INTERVAL = 2
CLOSED_LABEL_KEY = "omnigent.closed"
CLOSED_LABEL_VALUE = "true"


def log(msg):
    print(f"fkit reconnect: {msg}")


def err(msg):
    print(f"fkit reconnect: ERROR: {msg}", file=sys.stderr)


def http_get(path):
    full = BASE.rstrip("/") + path
    req = urllib.request.Request(full, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code} from {full}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"could not reach {full}: {e.reason}") from e
    try:
        return json.loads(body)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"unexpected (non-JSON) response from {full}: {e}") from e


def get_session(conv_id):
    info = http_get(f"/v1/sessions/{urllib.parse.quote(conv_id)}")
    if not isinstance(info, dict) or "id" not in info:
        raise RuntimeError(f"unexpected shape for GET /v1/sessions/{conv_id}: {info!r}")
    return info


def list_children(conv_id):
    children = []
    after = None
    seen_cursors = set()
    while True:
        path = f"/v1/sessions/{urllib.parse.quote(conv_id)}/child_sessions?limit=100"
        if after:
            path += f"&after={urllib.parse.quote(after)}"
        page = http_get(path)
        if not isinstance(page, dict) or "data" not in page:
            raise RuntimeError(f"unexpected shape for child_sessions of {conv_id}: {page!r}")
        data = page["data"]
        for child in data:
            if not isinstance(child, dict) or "id" not in child:
                raise RuntimeError(f"unexpected child_sessions entry under {conv_id}: {child!r}")
        children.extend(data)
        if not page.get("has_more") or not data:
            break
        after = page.get("last_id") or data[-1].get("id")
        if not after or after in seen_cursors:
            raise RuntimeError(f"child_sessions pagination did not advance for {conv_id}")
        seen_cursors.add(after)
    return children


def is_closed(labels):
    return isinstance(labels, dict) and labels.get(CLOSED_LABEL_KEY) == CLOSED_LABEL_VALUE


def safe_name(s):
    return re.sub(r"[^A-Za-z0-9._-]+", "_", s or "unknown")


def walk_tree(root_id):
    """BFS from root_id. Returns the list of session-info dicts for every node reached —
    root included — skipping (and never recursing into) any child labeled omnigent.closed."""
    visited = set()
    queue = [root_id]
    nodes = []
    while queue:
        cid = queue.pop(0)
        if cid in visited:
            continue
        visited.add(cid)
        nodes.append(get_session(cid))
        for child in list_children(cid):
            kid = child["id"]
            if is_closed(child.get("labels")):
                continue  # deliberately ended — never a candidate, never recursed into
            if kid not in visited:
                queue.append(kid)
    return nodes


def main():
    try:
        nodes = walk_tree(ROOT_ID)
    except RuntimeError as e:
        err(str(e))
        return 1

    disconnected = [
        n for n in nodes
        if n.get("runner_online") is False or n.get("status") == "failed"
    ]

    if not disconnected:
        log(f"{len(nodes)} session(s) checked, all connected.")
        return 0

    launched = []
    resolution_failures = []
    for n in disconnected:
        cid = n["id"]
        title = n.get("title") or cid
        agent_name = n.get("agent_name")
        if not agent_name:
            resolution_failures.append((title, cid, "server reported no agent_name for this session"))
            continue
        cfg = os.path.join(PROJ, ".fkit", "agents", agent_name, "config.yaml")
        if not os.path.isfile(cfg):
            resolution_failures.append((title, cid, f"no local bundle at {cfg}"))
            continue
        log_path = f"/tmp/reconnect-{safe_name(title)}.log"
        logf = open(log_path, "ab")
        subprocess.Popen(
            ["omnigent", "run", cfg, "--resume", cid, "--server", BASE],
            stdin=subprocess.DEVNULL,
            stdout=logf,
            stderr=subprocess.STDOUT,
            cwd=PROJ,
            start_new_session=True,
        )
        launched.append({"title": title, "id": cid, "log": log_path})

    for title, cid, reason in resolution_failures:
        err(f"{title} ({cid}): cannot reconnect — {reason}")

    pending = {n["id"]: n for n in launched}
    reconnected_ids = set()
    deadline = time.time() + TIMEOUT
    while pending and time.time() < deadline:
        for cid in list(pending):
            try:
                info = get_session(cid)
            except RuntimeError:
                continue  # transient — keep polling until the deadline
            if info.get("status") == "idle" and info.get("runner_online"):
                reconnected_ids.add(cid)
                del pending[cid]
        if pending:
            time.sleep(POLL_INTERVAL)

    ok = 0
    for n in launched:
        if n["id"] in reconnected_ids:
            log(f"{n['title']} ({n['id']}): reconnected (status=idle)")
            ok += 1
        else:
            err(
                f"{n['title']} ({n['id']}): still not reachable after {TIMEOUT}s — "
                f"check {n['log']} (a non-TTY OSError there is expected noise from the "
                f"foreground REPL, not itself a failure signal — judge only from server state)"
            )

    return 0 if not resolution_failures and ok == len(launched) else 1


sys.exit(main())
PYEOF
