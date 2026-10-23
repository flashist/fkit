// The board's command line (board/cli/cli.mjs) and agent instructions (board/core/instructions.mjs),
// ported from aiboard a1592dc's tests/test_board.py. CliTests and InstructionsTests keep aiboard's test
// names verbatim, in aiboard's order, so 0423 can match each one; the other tests are new for 0421, and
// every expected string in them was printed by aiboard a1592dc under Python 3.9.6.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, test } from 'node:test';
import { SystemExit, main } from '../../board/cli/cli.mjs';
import { BEGIN, END, installBlock, renderBlock } from '../../board/core/instructions.mjs';

const MAIN = fileURLToPath(new URL('../../board/cli/main.mjs', import.meta.url));

let tmp;

const makeTmp = () => realpathSync(mkdtempSync(join(tmpdir(), 'board-cli-')));
const read = (p) => readFileSync(p, 'utf8');

function capture(argv, stdin = '') {
  const io = { stdout: { write: (s) => void (io.out += s) }, stderr: { write: (s) => void (io.err += s) }, out: '', err: '' };
  io.readStdin = () => Buffer.from(stdin, 'utf8');
  return io;
}

// aiboard's run_cli: main() with --root, stdout captured; a SystemExit propagates, as in Python.
function runCli(...argv) {
  const io = capture();
  const code = main(['--root', tmp, ...argv], io);
  return [code, io.out];
}

// main() in-process with stdout, stderr and the exit code captured; SystemExit is the exit code.
function runAll(argv, { stdin = '', sysArgv = null } = {}) {
  const io = capture(argv, stdin);
  const savedArgv = process.argv;
  if (sysArgv) process.argv = [process.argv[0], 'aiboard', ...sysArgv];
  let code;
  try {
    code = main(argv, io);
  } catch (e) {
    if (!(e instanceof SystemExit)) throw e;
    code = e.code;
  } finally {
    process.argv = savedArgv;
  }
  return { code, stdout: io.out, stderr: io.err };
}

function withColumns(columns, fn) {
  const saved = process.env.COLUMNS;
  process.env.COLUMNS = String(columns);
  try {
    return fn();
  } finally {
    if (saved === undefined) delete process.env.COLUMNS;
    else process.env.COLUMNS = saved;
  }
}

const rooted = (s, root) => s.split(root).join('<ROOT>');

function writeTree(root, files) {
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), text);
  }
}

beforeEach(() => {
  tmp = makeTmp();
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

// Expected output, printed by aiboard a1592dc (Python 3.9.6, COLUMNS=80); the board root is <ROOT>.
const ARGPARSE_CASES = [
  [[], 2, "", "usage: aiboard [-h] [--root ROOT] [--json] [--version]\n               {init,task,sprint,board,info,check,agents-md,mcp,serve} ...\naiboard: error: the following arguments are required: cmd\n"],
  [["foo"], 2, "", "usage: aiboard [-h] [--root ROOT] [--json] [--version]\n               {init,task,sprint,board,info,check,agents-md,mcp,serve} ...\naiboard: error: argument cmd: invalid choice: 'foo' (choose from 'init', 'task', 'sprint', 'board', 'info', 'check', 'agents-md', 'mcp', 'serve')\n"],
  [["task", "new"], 2, "", "usage: aiboard task new [-h] [--body BODY] [--body-file BODY_FILE]\n                        [--status STATUS] [--sprint SPRINT]\n                        [--priority {low,medium,high,critical}]\n                        [--assignee ASSIGNEE] [--label LABEL]\n                        [--blocked-by ID] [--by BY]\n                        title\naiboard task new: error: the following arguments are required: title\n"],
  [["--json", "task", "new", "x", "--priority", "bogus"], 1, "{\"error\": \"argument --priority: invalid choice: 'bogus' (choose from 'low', 'medium', 'high', 'critical')\"}\n", ""],
  [["task", "new", "x", "--priority", "bogus"], 2, "", "usage: aiboard task new [-h] [--body BODY] [--body-file BODY_FILE]\n                        [--status STATUS] [--sprint SPRINT]\n                        [--priority {low,medium,high,critical}]\n                        [--assignee ASSIGNEE] [--label LABEL]\n                        [--blocked-by ID] [--by BY]\n                        title\naiboard task new: error: argument --priority: invalid choice: 'bogus' (choose from 'low', 'medium', 'high', 'critical')\n"],
  [["task", "new", "x", "--b"], 2, "", "usage: aiboard task new [-h] [--body BODY] [--body-file BODY_FILE]\n                        [--status STATUS] [--sprint SPRINT]\n                        [--priority {low,medium,high,critical}]\n                        [--assignee ASSIGNEE] [--label LABEL]\n                        [--blocked-by ID] [--by BY]\n                        title\naiboard task new: error: ambiguous option: --b could match --body, --body-file, --blocked-by, --by\n"],
  [["task", "rank", "T-1"], 2, "", "usage: aiboard task rank [-h] (--top | --bottom | --before ID | --after ID) id\naiboard task rank: error: one of the arguments --top --bottom --before --after is required\n"],
  [["task", "rank", "T-1", "--top", "--bottom"], 2, "", "usage: aiboard task rank [-h] (--top | --bottom | --before ID | --after ID) id\naiboard task rank: error: argument --bottom: not allowed with argument --top\n"],
  [["task", "block", "T-1", "T-2", "--by", "x", "T-3"], 2, "", "usage: aiboard [-h] [--root ROOT] [--json] [--version]\n               {init,task,sprint,board,info,check,agents-md,mcp,serve} ...\naiboard: error: unrecognized arguments: T-3\n"],
  [["task", "assign", "T-001", "--force", "bob"], 2, "", "usage: aiboard [-h] [--root ROOT] [--json] [--version]\n               {init,task,sprint,board,info,check,agents-md,mcp,serve} ...\naiboard: error: unrecognized arguments: bob\n"],
  [["task", "log", "T-001", "-x"], 2, "", "usage: aiboard task log [-h] [--by BY] id message\naiboard task log: error: the following arguments are required: message\n"],
  [["task", "new", "-hx"], 2, "", "usage: aiboard task new [-h] [--body BODY] [--body-file BODY_FILE]\n                        [--status STATUS] [--sprint SPRINT]\n                        [--priority {low,medium,high,critical}]\n                        [--assignee ASSIGNEE] [--label LABEL]\n                        [--blocked-by ID] [--by BY]\n                        title\naiboard task new: error: argument -h/--help: ignored explicit argument 'x'\n"],
  [["task", "edit", "T-1", "--title"], 2, "", "usage: aiboard task edit [-h] [--title TITLE]\n                         [--priority {low,medium,high,critical}]\n                         [--assignee ASSIGNEE] [--sprint SPRINT]\n                         [--label LABEL] [--blocked-by ID]\n                         id\naiboard task edit: error: argument --title: expected one argument\n"],
  [["serve", "--port", "abc"], 2, "", "usage: aiboard serve [-h] [--host HOST] [--port PORT] [--no-open]\n                     [--read-only]\naiboard serve: error: argument --port: invalid int value: 'abc'\n"],
  [["--root"], 2, "", "usage: aiboard [-h] [--root ROOT] [--json] [--version]\n               {init,task,sprint,board,info,check,agents-md,mcp,serve} ...\naiboard: error: argument --root: expected one argument\n"],
  [["--js", "--root", "/nonexistent-board-0421", "info"], 1, "", "error: no board at /nonexistent-board-0421 (run `aiboard init`, or cd into a project that has one)\n"],
  [["-h"], 0, "usage: aiboard [-h] [--root ROOT] [--json] [--version]\n               {init,task,sprint,board,info,check,agents-md,mcp,serve} ...\n\nFile-based issue tracker for AI agents and humans.\n\npositional arguments:\n  {init,task,sprint,board,info,check,agents-md,mcp,serve}\n    init                create a board (folder skeleton + aiboard.json)\n    task                manage tasks\n    sprint              manage sprints\n    board               print a kanban view\n    info                which board the CLI resolves to from here, and a\n                        summary\n    check               validate consistency between tasks and sprints\n    agents-md           add (or refresh) aiboard instructions in AGENTS.md for\n                        any coding agent\n    mcp                 run an MCP server over stdio for agents (Claude Code,\n                        Codex, Cursor, ...)\n    serve               run the web board\n\noptional arguments:\n  -h, --help            show this help message and exit\n  --root ROOT           board root (default: $AIBOARD_ROOT, else the nearest\n                        parent holding a board)\n  --json                machine-readable output\n  --version             show program's version number and exit\n", ""],
  [["task", "-h"], 0, "usage: aiboard task [-h]\n                    {new,list,show,change-status,status,move,block,rank,unblock,assign,start,log,comment,edit}\n                    ...\n\npositional arguments:\n  {new,list,show,change-status,status,move,block,rank,unblock,assign,start,log,comment,edit}\n    new                 create a task\n    list                list tasks in queue order, top first (metadata only;\n                        use `show` for the brief)\n    show                show brief and worklog\n    change-status (status, move)\n                        change status (moves the folder)\n    block               mark a task as blocked by other tasks (Jira: 'is\n                        blocked by')\n    rank                reorder the queue (Jira: Rank): move a task to the\n                        top, the bottom, or next to another task\n    unblock             remove blockers from a task\n    assign              set the assignee (records it in the worklog)\n    start               claim a backlog task and move it to in-progress in one\n                        atomic step (Jira: Start progress)\n    log                 append a worklog entry\n    comment             add to the task's discussion (comments.md), e.g. a\n                        question or review note\n    edit                change metadata fields\n\noptional arguments:\n  -h, --help            show this help message and exit\n", ""],
  [["task", "start", "-h"], 0, "usage: aiboard task start [-h] [--as NAME] [--force] [--by BY] id\n\npositional arguments:\n  id\n\noptional arguments:\n  -h, --help  show this help message and exit\n  --as NAME   assignee (default: --by / $AIBOARD_AUTHOR)\n  --force     take it even if assigned to someone else, not in backlog, or\n              blocked\n  --by BY\n", ""],
  [["task", "move", "-h"], 0, "usage: aiboard task change-status [-h] [--note NOTE] [--force] [--by BY]\n                                  id status\n\npositional arguments:\n  id\n  status       backlog | in-progress | done | cancelled\n\noptional arguments:\n  -h, --help   show this help message and exit\n  --note NOTE  extra text for the worklog entry\n  --force      start even if blocked by open tasks\n  --by BY\n", ""],
  [["task", "rank", "-h"], 0, "usage: aiboard task rank [-h] (--top | --bottom | --before ID | --after ID) id\n\npositional arguments:\n  id\n\noptional arguments:\n  -h, --help   show this help message and exit\n  --top        top of the queue\n  --bottom     bottom of the queue\n  --before ID  just above this task\n  --after ID   just below this task\n", ""],
  [["--version"], 0, "aiboard 0.1.0\n", ""],
];

const FIXTURE = {
  "aiboard.json": "{\"name\": \"Demo\", \"version\": 1, \"stale_after_hours\": 1.5}\n",
  "sprints/backlog/.gitkeep": "",
  "sprints/backlog/S-002-later/sprint.md": "---\nid: S-002\ntitle: Later\ngoal: \nstart: \nend: \ntasks: []\ncreated: \"2026-01-02T03:00:01Z\"\nupdated: \"2026-01-02T03:00:01Z\"\n---\n\n# Later\n\n## Tasks\n\n_No tasks attached yet._\n",
  "sprints/cancelled/.gitkeep": "",
  "sprints/done/.gitkeep": "",
  "sprints/in-progress/.gitkeep": "",
  "sprints/in-progress/S-001-sprint-one/sprint.md": "---\nid: S-001\ntitle: Sprint One\ngoal: Ship the demo\nstart: 2026-01-05\nend: 2026-01-16\ntasks:\n  - T-001\n  - T-003\n  - T-004\ncreated: \"2026-01-02T03:00:00Z\"\nupdated: \"2026-01-02T03:00:18Z\"\n---\n\n# Sprint One\n\n**Goal:** Ship the demo\n\n## Tasks\n\n- [ ] T-001 \u2014 Login page (backlog)\n- [x] T-003 \u2014 Done thing (done)\n- [-] T-004 \u2014 Dropped thing (cancelled)\n",
  "tasks/backlog/.gitkeep": "",
  "tasks/backlog/T-001-login-page/brief.md": "---\nid: T-001\ntitle: Login page\nsprint: S-001\npriority: high\nrank: 1000\nassignee: alice\nlabels:\n  - ui\n  - bug\nblocked_by:\n  - T-002\ncreated: \"2026-01-02T03:00:02Z\"\nupdated: \"2026-01-02T03:00:08Z\"\n---\n\n# Login page\n\nBuild the **login** page.\n\nAcceptance: works.\n",
  "tasks/backlog/T-001-login-page/comments.md": "# Comments\n\n## 2026-01-02T03:00:07Z \u2014 bob\n\nQuestion: which IdP?\n\n",
  "tasks/backlog/T-001-login-page/worklog.md": "# Worklog\n\n## 2026-01-02T03:00:02Z \u2014 alice\n\nTask created in `backlog`.\n\n## 2026-01-02T03:00:06Z \u2014 alice\n\nBlocked by T-002.\n\n",
  "tasks/backlog/T-002-caf-stra-e-is-a-fairly-long-title/brief.md": "---\nid: T-002\ntitle: Caf\u00e9 \u2615 \u2014 stra\u00dfe is a fairly long title\nsprint: \npriority: critical\nrank: 0\nassignee: \nlabels: []\nblocked_by: []\ncreated: \"2026-01-02T03:00:04Z\"\nupdated: \"2026-01-02T03:00:04Z\"\n---\n\n# Caf\u00e9 \u2615 \u2014 stra\u00dfe is a fairly long title\n\n_No description yet._\n",
  "tasks/backlog/T-002-caf-stra-e-is-a-fairly-long-title/worklog.md": "# Worklog\n\n## 2026-01-02T03:00:04Z \u2014 bob\n\nTask created in `backlog`.\n\n",
  "tasks/backlog/T-005-reply-wanted/brief.md": "---\nid: T-005\ntitle: Reply wanted\nsprint: \npriority: medium\nrank: 4000\nassignee: bob\nlabels:\n  - x\nblocked_by: []\ncreated: \"2026-01-02T03:00:19Z\"\nupdated: \"2026-01-02T03:00:23Z\"\n---\n\n# Reply wanted\n\n_No description yet._\n",
  "tasks/backlog/T-005-reply-wanted/comments.md": "# Comments\n\n## 2026-01-02T03:00:20Z \u2014 carol\n\nPing?\n\n",
  "tasks/backlog/T-005-reply-wanted/worklog.md": "# Worklog\n\n## 2026-01-02T03:00:19Z \u2014 bob\n\nTask created in `backlog`.\n\n## 2026-01-02T03:00:22Z \u2014 bob\n\nInvestigated.\n\n- one\n- two\n\n",
  "tasks/cancelled/.gitkeep": "",
  "tasks/cancelled/T-004-dropped-thing/brief.md": "---\nid: T-044\ntitle: Dropped thing\nsprint: S-001\npriority: medium\nrank: 3000\nassignee: \nlabels: []\nblocked_by: []\ncreated: \"2026-01-02T03:00:14Z\"\nupdated: \"2026-01-02T03:00:17Z\"\n---\n\n# Dropped thing\n\n_No description yet._\n",
  "tasks/cancelled/T-004-dropped-thing/worklog.md": "# Worklog\n\n## 2026-01-02T03:00:14Z \u2014 alice\n\nTask created in `backlog`.\n\n## 2026-01-02T03:00:16Z \u2014 alice\n\nStatus changed `backlog` \u2192 `cancelled`.\n\n",
  "tasks/done/.gitkeep": "",
  "tasks/done/T-003-done-thing/brief.md": "---\nid: T-003\ntitle: Done thing\nsprint: S-001\npriority: medium\nrank: 2000\nassignee: \nlabels: []\nblocked_by: []\ncreated: \"2026-01-02T03:00:09Z\"\nupdated: \"2026-01-02T03:00:12Z\"\n---\n\n# Done thing\n\n_No description yet._\n",
  "tasks/done/T-003-done-thing/worklog.md": "# Worklog\n\n## 2026-01-02T03:00:09Z \u2014 alice\n\nTask created in `backlog`.\n\n## 2026-01-02T03:00:11Z \u2014 alice\n\nStatus changed `backlog` \u2192 `done`. PR #1\n\n",
  "tasks/in-progress/.gitkeep": "",
};

const READ_CASES = [
  [["task", "list"], 0, "board: Demo (<ROOT>)\nID     STATUS       PRIO     SPRINT ASSIGNEE              TITLE\nT-002  backlog      critical -      -                     Caf\u00e9 \u2615 \u2014 stra\u00dfe is a fairly long title\nT-001  backlog      high     S-001  alice        blocked  Login page\nT-003  done         medium   S-001  -                     Done thing\nT-004  cancelled    medium   S-001  -                     Dropped thing\nT-005  backlog      medium   -      bob          reply?   Reply wanted\n", ""],
  [["task", "list", "--status", "backlog", "--assignee", "alice"], 0, "board: Demo (<ROOT>)\nID     STATUS       PRIO     SPRINT ASSIGNEE              TITLE\nT-001  backlog      high     S-001  alice        blocked  Login page\n", ""],
  [["task", "list", "--needs-reply"], 0, "board: Demo (<ROOT>)\nID     STATUS       PRIO     SPRINT ASSIGNEE              TITLE\nT-001  backlog      high     S-001  alice        blocked  Login page\nT-005  backlog      medium   -      bob          reply?   Reply wanted\n", ""],
  [["task", "list", "--blocked"], 0, "board: Demo (<ROOT>)\nID     STATUS       PRIO     SPRINT ASSIGNEE              TITLE\nT-001  backlog      high     S-001  alice        blocked  Login page\n", ""],
  [["task", "list", "--sprint", "S-1"], 0, "board: Demo (<ROOT>)\nID     STATUS       PRIO     SPRINT ASSIGNEE              TITLE\nT-001  backlog      high     S-001  alice        blocked  Login page\nT-003  done         medium   S-001  -                     Done thing\nT-004  cancelled    medium   S-001  -                     Dropped thing\n", ""],
  [["task", "show", "T-001"], 0, "T-001: Login page\nstatus:   backlog\nsprint:   S-001\npriority: high\nrank:     1000\nassignee: alice\nlabels:   ui, bug\nblocked:  T-002 (backlog)  <- BLOCKED\nfolder:   <ROOT>/tasks/backlog/T-001-login-page\n\n# Login page\n\nBuild the **login** page.\n\nAcceptance: works.\n\n--- comments ---\n[2026-01-02T03:00:07Z] bob: Question: which IdP?\n\n--- worklog ---\n[2026-01-02T03:00:02Z] alice: Task created in `backlog`.\n[2026-01-02T03:00:06Z] alice: Blocked by T-002.\n", ""],
  [["--json", "task", "show", "T-001"], 0, "{\n  \"id\": \"T-001\",\n  \"title\": \"Login page\",\n  \"status\": \"backlog\",\n  \"sprint\": \"S-001\",\n  \"priority\": \"high\",\n  \"rank\": 1000,\n  \"assignee\": \"alice\",\n  \"labels\": [\n    \"ui\",\n    \"bug\"\n  ],\n  \"blocked_by\": [\n    \"T-002\"\n  ],\n  \"blocked\": true,\n  \"blockers\": [\n    {\n      \"id\": \"T-002\",\n      \"status\": \"backlog\",\n      \"title\": \"Caf\u00e9 \u2615 \u2014 stra\u00dfe is a fairly long title\"\n    }\n  ],\n  \"last_activity\": \"2026-01-02T03:00:08Z\",\n  \"stale\": false,\n  \"comments_count\": 1,\n  \"last_comment_by\": \"bob\",\n  \"needs_reply\": true,\n  \"created\": \"2026-01-02T03:00:02Z\",\n  \"updated\": \"2026-01-02T03:00:08Z\",\n  \"folder\": \"T-001-login-page\",\n  \"path\": \"<ROOT>/tasks/backlog/T-001-login-page\",\n  \"brief\": \"# Login page\\n\\nBuild the **login** page.\\n\\nAcceptance: works.\",\n  \"worklog\": [\n    {\n      \"timestamp\": \"2026-01-02T03:00:02Z\",\n      \"author\": \"alice\",\n      \"text\": \"Task created in `backlog`.\"\n    },\n    {\n      \"timestamp\": \"2026-01-02T03:00:06Z\",\n      \"author\": \"alice\",\n      \"text\": \"Blocked by T-002.\"\n    }\n  ],\n  \"comments\": [\n    {\n      \"timestamp\": \"2026-01-02T03:00:07Z\",\n      \"author\": \"bob\",\n      \"text\": \"Question: which IdP?\"\n    }\n  ]\n}\n", ""],
  [["task", "show", "T-005"], 0, "T-005: Reply wanted\nstatus:   backlog\nsprint:   -\npriority: medium\nrank:     4000\nassignee: bob\nlabels:   x\nblocked:  -\nfolder:   <ROOT>/tasks/backlog/T-005-reply-wanted\n\n# Reply wanted\n\n_No description yet._\n\n--- comments ---\n[2026-01-02T03:00:20Z] carol: Ping?\n\n--- worklog ---\n[2026-01-02T03:00:19Z] bob: Task created in `backlog`.\n[2026-01-02T03:00:22Z] bob: Investigated.\n\n- one\n- two\n", ""],
  [["sprint", "list"], 0, "board: Demo (<ROOT>)\nID     STATUS       DONE      DATES                   TITLE\nS-001  in-progress  1/3       2026-01-05 \u2192 2026-01-16 Sprint One\nS-002  backlog      0/0       ? \u2192 ?                   Later\n", ""],
  [["--json", "sprint", "list"], 0, "[\n  {\n    \"id\": \"S-001\",\n    \"title\": \"Sprint One\",\n    \"status\": \"in-progress\",\n    \"goal\": \"Ship the demo\",\n    \"start\": \"2026-01-05\",\n    \"end\": \"2026-01-16\",\n    \"tasks\": [\n      \"T-001\",\n      \"T-003\",\n      \"T-004\"\n    ],\n    \"created\": \"2026-01-02T03:00:00Z\",\n    \"updated\": \"2026-01-02T03:00:18Z\",\n    \"folder\": \"S-001-sprint-one\",\n    \"path\": \"<ROOT>/sprints/in-progress/S-001-sprint-one\",\n    \"progress\": {\n      \"total\": 3,\n      \"counts\": {\n        \"backlog\": 1,\n        \"in-progress\": 0,\n        \"done\": 1,\n        \"cancelled\": 1\n      },\n      \"percent\": 33,\n      \"remaining\": 1\n    }\n  },\n  {\n    \"id\": \"S-002\",\n    \"title\": \"Later\",\n    \"status\": \"backlog\",\n    \"goal\": null,\n    \"start\": null,\n    \"end\": null,\n    \"tasks\": [],\n    \"created\": \"2026-01-02T03:00:01Z\",\n    \"updated\": \"2026-01-02T03:00:01Z\",\n    \"folder\": \"S-002-later\",\n    \"path\": \"<ROOT>/sprints/backlog/S-002-later\",\n    \"progress\": {\n      \"total\": 0,\n      \"counts\": {\n        \"backlog\": 0,\n        \"in-progress\": 0,\n        \"done\": 0,\n        \"cancelled\": 0\n      },\n      \"percent\": 0,\n      \"remaining\": 0\n    }\n  }\n]\n", ""],
  [["sprint", "show", "S-001"], 0, "S-001: Sprint One\nstatus:   in-progress\ngoal:     Ship the demo\ndates:    2026-01-05 \u2192 2026-01-16\nprogress: 33% done  (backlog 1, in-progress 0, done 1, cancelled 1)\nfolder:   <ROOT>/sprints/in-progress/S-001-sprint-one\n\nID     STATUS       PRIO     SPRINT ASSIGNEE              TITLE\nT-001  backlog      high     S-001  alice        blocked  Login page\nT-003  done         medium   S-001  -                     Done thing\nT-004  cancelled    medium   S-001  -                     Dropped thing\n", ""],
  [["--json", "sprint", "show", "S-001"], 0, "{\n  \"id\": \"S-001\",\n  \"title\": \"Sprint One\",\n  \"status\": \"in-progress\",\n  \"goal\": \"Ship the demo\",\n  \"start\": \"2026-01-05\",\n  \"end\": \"2026-01-16\",\n  \"tasks\": [\n    \"T-001\",\n    \"T-003\",\n    \"T-004\"\n  ],\n  \"created\": \"2026-01-02T03:00:00Z\",\n  \"updated\": \"2026-01-02T03:00:18Z\",\n  \"folder\": \"S-001-sprint-one\",\n  \"path\": \"<ROOT>/sprints/in-progress/S-001-sprint-one\",\n  \"description\": \"# Sprint One\\n\\n**Goal:** Ship the demo\\n\\n## Tasks\\n\\n- [ ] T-001 \u2014 Login page (backlog)\\n- [x] T-003 \u2014 Done thing (done)\\n- [-] T-004 \u2014 Dropped thing (cancelled)\",\n  \"progress\": {\n    \"total\": 3,\n    \"counts\": {\n      \"backlog\": 1,\n      \"in-progress\": 0,\n      \"done\": 1,\n      \"cancelled\": 1\n    },\n    \"percent\": 33,\n    \"remaining\": 1\n  },\n  \"tasks_detail\": [\n    {\n      \"id\": \"T-001\",\n      \"title\": \"Login page\",\n      \"status\": \"backlog\",\n      \"sprint\": \"S-001\",\n      \"priority\": \"high\",\n      \"rank\": 1000,\n      \"assignee\": \"alice\",\n      \"labels\": [\n        \"ui\",\n        \"bug\"\n      ],\n      \"blocked_by\": [\n        \"T-002\"\n      ],\n      \"blocked\": true,\n      \"blockers\": [\n        {\n          \"id\": \"T-002\",\n          \"status\": \"backlog\",\n          \"title\": \"Caf\u00e9 \u2615 \u2014 stra\u00dfe is a fairly long title\"\n        }\n      ],\n      \"last_activity\": \"2026-01-02T03:00:08Z\",\n      \"stale\": false,\n      \"comments_count\": 1,\n      \"last_comment_by\": \"bob\",\n      \"needs_reply\": true,\n      \"created\": \"2026-01-02T03:00:02Z\",\n      \"updated\": \"2026-01-02T03:00:08Z\",\n      \"folder\": \"T-001-login-page\",\n      \"path\": \"<ROOT>/tasks/backlog/T-001-login-page\"\n    },\n    {\n      \"id\": \"T-003\",\n      \"title\": \"Done thing\",\n      \"status\": \"done\",\n      \"sprint\": \"S-001\",\n      \"priority\": \"medium\",\n      \"rank\": 2000,\n      \"assignee\": null,\n      \"labels\": [],\n      \"blocked_by\": [],\n      \"blocked\": false,\n      \"blockers\": [],\n      \"last_activity\": \"2026-01-02T03:00:12Z\",\n      \"stale\": false,\n      \"comments_count\": 0,\n      \"last_comment_by\": null,\n      \"needs_reply\": false,\n      \"created\": \"2026-01-02T03:00:09Z\",\n      \"updated\": \"2026-01-02T03:00:12Z\",\n      \"folder\": \"T-003-done-thing\",\n      \"path\": \"<ROOT>/tasks/done/T-003-done-thing\"\n    },\n    {\n      \"id\": \"T-004\",\n      \"title\": \"Dropped thing\",\n      \"status\": \"cancelled\",\n      \"sprint\": \"S-001\",\n      \"priority\": \"medium\",\n      \"rank\": 3000,\n      \"assignee\": null,\n      \"labels\": [],\n      \"blocked_by\": [],\n      \"blocked\": false,\n      \"blockers\": [],\n      \"last_activity\": \"2026-01-02T03:00:17Z\",\n      \"stale\": false,\n      \"comments_count\": 0,\n      \"last_comment_by\": null,\n      \"needs_reply\": false,\n      \"created\": \"2026-01-02T03:00:14Z\",\n      \"updated\": \"2026-01-02T03:00:17Z\",\n      \"folder\": \"T-004-dropped-thing\",\n      \"path\": \"<ROOT>/tasks/cancelled/T-004-dropped-thing\"\n    }\n  ]\n}\n", ""],
  [["sprint", "show", "S-002"], 0, "S-002: Later\nstatus:   backlog\ngoal:     -\ndates:    ? \u2192 ?\nprogress: 0% done  (backlog 0, in-progress 0, done 0, cancelled 0)\nfolder:   <ROOT>/sprints/backlog/S-002-later\n\n(no tasks)\n", ""],
  [["board"], 0, "board: Demo (<ROOT>)\nBACKLOG (3)                 IN-PROGRESS (0)             DONE (1)                    CANCELLED (1)               \n----------------------------------------------------------------------------------------------------------------\nT-002 Caf\u00e9 \u2615 \u2014 stra\u00dfe is \u2026                              T-003 Done thing            T-004 Dropped thing\nT-001 Login page\nT-005 Reply wanted\n", ""],
  [["board", "--sprint", "S-001"], 0, "board: Demo (<ROOT>)\nBACKLOG (1)                 IN-PROGRESS (0)             DONE (1)                    CANCELLED (1)               \n----------------------------------------------------------------------------------------------------------------\nT-001 Login page                                        T-003 Done thing            T-004 Dropped thing\n", ""],
  [["info"], 0, "board:    Demo\nroot:     <ROOT>\ntasks:    backlog 3, in-progress 0, done 1, cancelled 1\nsprints:  2 (active: S-001)\nstale after: 1.5h\n", ""],
  [["--json", "info"], 0, "{\n  \"name\": \"Demo\",\n  \"root\": \"<ROOT>\",\n  \"config\": {\n    \"name\": \"Demo\",\n    \"version\": 1,\n    \"stale_after_hours\": 1.5\n  },\n  \"task_counts\": {\n    \"backlog\": 3,\n    \"in-progress\": 0,\n    \"done\": 1,\n    \"cancelled\": 1\n  },\n  \"sprints\": 2,\n  \"active_sprints\": [\n    \"S-001\"\n  ],\n  \"stale_after_hours\": 1.5\n}\n", ""],
  [["check"], 1, "- T-004: front matter id is 'T-044'\n", ""],
  [["--json", "check"], 1, "{\n  \"ok\": false,\n  \"problems\": [\n    \"T-004: front matter id is 'T-044'\"\n  ]\n}\n", ""],
  [["task", "change-status", "T-001", "kinda-done"], 1, "", "error: unknown status 'kinda-done'; expected one of backlog, in-progress, done, cancelled\n"],
  [["--json", "task", "change-status", "T-001", "kinda-done"], 1, "{\"error\": \"unknown status 'kinda-done'; expected one of backlog, in-progress, done, cancelled\"}\n", ""],
  [["task", "show", "T-999"], 1, "", "error: T-999 not found under <ROOT>/tasks\n"],
];

const KANBAN_TITLES = ["abcdefghijklmnopqr\ud83d\ude00 and then some more", "Wide\u3000", "Sep\u001f"];
const MCP_HELP_AT_85 = "usage: aiboard mcp [-h] [--author AUTHOR]\n\noptional arguments:\n  -h, --help       show this help message and exit\n  --author AUTHOR  name recorded in worklogs (default: $AIBOARD_AUTHOR or 'mcp-\n                   agent')\n";
const KANBAN = "board: kanban (<ROOT>)\nBACKLOG (2)                 IN-PROGRESS (0)             DONE (0)                    CANCELLED (1)               \n----------------------------------------------------------------------------------------------------------------\nT-001 abcdefghijklmnopqr\ud83d\ude00\u2026                                                          T-002 Wide\nT-003 Sep\n";

describe('InstructionsTests', () => {
  test('test_install_block_is_idempotent', () => {
    const f = join(tmp, 'AGENTS.md');
    assert.equal(installBlock(f, 'this repository'), 'created');
    assert.equal(installBlock(f, 'this repository'), 'unchanged');
    assert.equal(installBlock(f, '`board/`'), 'updated');
    const text = read(f);
    assert.equal(text.split(BEGIN).length - 1, 1);
    assert.equal(text.split(END).length - 1, 1);
    assert.ok(text.includes('tracker in `board/`.'));
    const g = join(tmp, 'CLAUDE.md');
    writeFileSync(g, '# Existing\n\nKeep me.\n');
    assert.equal(installBlock(g, 'this repository'), 'updated');
    assert.ok(read(g).startsWith('# Existing\n\nKeep me.\n'));
    assert.ok(read(g).includes('tracker in this repository.'));
  });

  test('test_block_tells_agents_to_take_work_from_the_top', () => {
    const block = renderBlock();
    assert.ok(block.includes('queue order'));
    assert.ok(block.includes('aiboard task rank'));
  });
});

describe('CliTests', () => {
  test('test_full_flow', () => {
    assert.equal(runCli('init')[0], 0);
    let [code, out] = runCli('--json', 'sprint', 'new', 'Sprint 1', '--status', 'in-progress');
    assert.equal(JSON.parse(out).id, 'S-001');
    [code, out] = runCli('--json', 'task', 'new', 'Do it', '--sprint', 'S-001', '--by', 'agent-1');
    assert.equal(JSON.parse(out).status, 'backlog');
    assert.equal(runCli('task', 'move', 'T-001', 'done', '--note', 'shipped')[0], 0);
    [code, out] = runCli('--json', 'sprint', 'show', 'S-001');
    const data = JSON.parse(out);
    assert.equal(data.progress.percent, 100);
    [code, out] = runCli('board');
    assert.ok(out.includes('T-001 Do it'));
    assert.ok(out.includes('board: '));
    [code, out] = runCli('--json', 'info');
    const info = JSON.parse(out);
    assert.deepStrictEqual([info.root, info.task_counts.done, info.active_sprints], [tmp, 1, ['S-001']]);
    assert.equal(runCli('check')[0], 0);
    [code, out] = runCli('task', 'show', 'T-001', '--json'); // --json anywhere
    assert.equal(JSON.parse(out).id, 'T-001');
    [code, out] = runCli('task', 'new', 'Startable', '--json');
    [code, out] = runCli('task', 'start', JSON.parse(out).id, '--as', 'worker', '--json');
    assert.deepStrictEqual([code, JSON.parse(out).status, JSON.parse(out).assignee], [0, 'in-progress', 'worker']);
    [code, out] = runCli('--json', 'task', 'show', 'T-999');
    assert.equal(code, 1);
    assert.ok('error' in JSON.parse(out));
    [code, out] = runCli('--json', 'task', 'change-status', 'T-001', 'kinda-done');
    assert.equal(code, 1);
    assert.ok(JSON.parse(out).error.includes('unknown status'));
    assert.equal(runCli('task', 'new', 'Alias status', '--status', 'wip')[0], 0);
    assert.equal(runCli('--json', 'task', 'list', '--status', 'in progress')[0], 0);
  });

  test('test_argparse_errors_are_json', () => {
    runCli('init');
    const io = capture();
    const savedArgv = process.argv;
    process.argv = ['node', 'aiboard', '--json', 'task', 'new', 'x', '--priority', 'bogus'];
    let raised = null;
    try {
      main(['--root', tmp, '--json', 'task', 'new', 'x', '--priority', 'bogus'], io);
    } catch (e) {
      raised = e;
    } finally {
      process.argv = savedArgv;
    }
    assert.ok(raised instanceof SystemExit);
    assert.equal(raised.code, 1);
    assert.ok(JSON.parse(io.out).error.includes('invalid choice'));
  });

  test('test_critical_priority_via_cli', () => {
    runCli('init');
    let [code, out] = runCli('--json', 'task', 'new', 'Prod is down', '--priority', 'urgent');
    assert.equal(code, 0);
    assert.equal(JSON.parse(out).priority, 'critical');
    runCli('task', 'new', 'Minor');
    [code, out] = runCli('--json', 'task', 'edit', 'T-002', '--priority', 'critical');
    assert.deepStrictEqual([code, JSON.parse(out).priority], [0, 'critical']);
    [code, out] = runCli('task', 'list');
    assert.ok(out.includes('critical'));
  });

  test('test_task_rank_via_cli', () => {
    runCli('init');
    for (const title of ['a', 'b', 'c']) runCli('task', 'new', title);
    let [code, out] = runCli('task', 'rank', 'T-003', '--top');
    assert.equal(code, 0);
    assert.ok(out.includes('Ranked T-003 to the top'));
    [code, out] = runCli('--json', 'task', 'rank', 'T-001', '--after', 'T-002');
    assert.deepStrictEqual([code, JSON.parse(out).id], [0, 'T-001']);
    [code, out] = runCli('--json', 'task', 'list');
    assert.deepStrictEqual(JSON.parse(out).map((t) => t.id), ['T-003', 'T-002', 'T-001']);
    [code, out] = runCli('task', 'show', 'T-003');
    assert.ok(out.includes('rank:'));
  });

  test('test_board_truncates_with_ellipsis', () => {
    runCli('init');
    runCli('task', 'new', 'A very long title that certainly does not fit into the column');
    const [, out] = runCli('board');
    assert.ok(out.includes('…'));
  });
});

describe('the board command line (new for 0421)', () => {
  test("every command's --json output parses", () => {
    const BIG = '9007199254740993';
    const json = (...argv) => {
      const r = runAll(['--root', tmp, '--json', ...argv]);
      assert.equal(r.stderr, '', argv.join(' '));
      assert.doesNotThrow(() => JSON.parse(r.stdout), argv.join(' '));
      return r.stdout;
    };
    json('init');
    writeFileSync(join(tmp, 'aiboard.json'), `{"name": "Big", "version": 1, "big": ${BIG}}\n`);
    json('sprint', 'new', 'Sprint 1', '--goal', 'g', '--start', '2026-01-01');
    json('task', 'new', 'Emoji \u{1F600} task', '--sprint', 'S-001', '--label', 'a', '--priority', 'high');
    const brief = join(tmp, 'tasks', 'backlog', readdirSync(join(tmp, 'tasks', 'backlog')).find((n) => n.startsWith('T-001')), 'brief.md');
    writeFileSync(brief, read(brief).replace(/^created: .*$/m, `created: ${BIG}`));
    json('task', 'new', 'Second', '--body', 'b');
    json('task', 'new', 'Third', '--blocked-by', 'T-002');
    json('task', 'edit', 'T-002', '--title', 'Second!', '--assignee', 'ann');
    json('task', 'block', 'T-001', 'T-003');
    json('task', 'unblock', 'T-001', 'T-003');
    json('task', 'rank', 'T-003', '--top');
    json('task', 'assign', 'T-001', 'bob');
    json('task', 'start', 'T-002', '--as', 'ann', '--force');
    json('task', 'log', 'T-002', 'did a thing');
    json('task', 'comment', 'T-002', 'a question');
    json('task', 'change-status', 'T-002', 'done', '--note', 'n');
    json('sprint', 'new', 'Sprint 2');
    json('sprint', 'add', 'S-002', 'T-002');
    json('sprint', 'remove', 'S-002', 'T-002');
    json('sprint', 'refresh', 'S-001');
    json('sprint', 'change-status', 'S-002', 'in-progress');
    json('agents-md', '--file', join(tmp, 'AGENTS.md'));
    json('init');
    for (const argv of [['task', 'list'], ['sprint', 'list'], ['sprint', 'show', 'S-001'], ['board']]) json(...argv);
    const shown = json('task', 'show', 'T-001');
    assert.ok(shown.includes(`"created": ${BIG}`));
    assert.ok(shown.includes('Emoji \u{1F600} task'));
    const info = json('info');
    assert.ok(info.includes(`"big": ${BIG}`));
    assert.ok(info.includes('"stale_after_hours": 24.0'));
    const check = runAll(['--root', tmp, '--json', 'check']);
    assert.doesNotThrow(() => JSON.parse(check.stdout));
    const missing = runAll(['--root', tmp, '--json', 'task', 'show', 'T-999']);
    assert.equal(missing.code, 1);
    assert.match(JSON.parse(missing.stdout).error, /^T-999 not found under /);
  });

  test('the kanban view counts characters as Python does', () => {
    assert.equal(runCli('init', '--name', 'kanban')[0], 0);
    runCli('task', 'new', KANBAN_TITLES[0]);
    runCli('task', 'new', KANBAN_TITLES[1]);
    runCli('task', 'move', 'T-002', 'cancelled');
    runCli('task', 'new', KANBAN_TITLES[2]);
    const [code, out] = runCli('board');
    assert.equal(code, 0);
    assert.equal(rooted(out, tmp), KANBAN);
  });

  test('argument errors, help and version match aiboard a1592dc', () => {
    withColumns(80, () => {
      for (const [argv, code, stdout, stderr] of ARGPARSE_CASES) {
        assert.deepStrictEqual(runAll(argv, { sysArgv: argv }), { code, stdout, stderr }, argv.join(' '));
      }
    });
    // Narrower than 80, help wraps after a hyphen ("'mcp-" / "agent')"), as textwrap breaks hyphenated words.
    withColumns(85, () => {
      assert.deepStrictEqual(runAll(['mcp', '-h']), { code: 0, stdout: MCP_HELP_AT_85, stderr: '' });
    });
    // aiboard a1592dc crashes on an empty `-h=` (IndexError, exit 1 from the entry) before printing anything.
    for (const argv of [['-h='], ['task', '-h='], ['--json', 'task', 'new', '-h=']]) {
      const io = capture();
      assert.throws(() => main(argv, io), { name: 'IndexError' }, argv.join(' '));
      assert.deepStrictEqual([io.out, io.err], ['', ''], argv.join(' '));
    }
  });

  test('read commands print what aiboard a1592dc prints', () => {
    writeTree(tmp, FIXTURE);
    for (const [argv, code, stdout, stderr] of READ_CASES) {
      const r = runAll(['--root', tmp, ...argv]);
      assert.deepStrictEqual({ code: r.code, stdout: rooted(r.stdout, tmp), stderr: rooted(r.stderr, tmp) }, { code, stdout, stderr }, argv.join(' '));
    }
    const logged = runAll(['--root', tmp, 'task', 'log', 'T-005', '-'], { stdin: 'from stdin\r\nsecond line\r' });
    assert.equal(logged.code, 0);
    assert.ok(read(join(tmp, 'tasks/backlog/T-005-reply-wanted/worklog.md')).endsWith('\n\nfrom stdin\r\nsecond line\n\n'));
  });

  test('init and agents-md write into the project as aiboard a1592dc does', () => {
    const savedCwd = process.cwd();
    const savedRoot = process.env.AIBOARD_ROOT;
    delete process.env.AIBOARD_ROOT;
    process.chdir(tmp);
    try {
      const next = 'Next: `aiboard agents-md` to add agent instructions, `aiboard serve` for the web board.\n';
      const init = runAll(['init', 'board']);
      assert.deepStrictEqual({ ...init, stdout: rooted(init.stdout, tmp) }, { code: 0, stdout: `Board 'board' ready at <ROOT>/board (10 entries created)\n${next}`, stderr: '' });
      assert.deepStrictEqual(readdirSync(tmp).sort(), ['aiboard.json', 'board']);
      assert.equal(read(join(tmp, 'aiboard.json')), '{\n  "board": "board"\n}\n');
      assert.deepStrictEqual(runAll(['agents-md']), { code: 0, stdout: 'AGENTS.md: created\n', stderr: '' });
      assert.equal(read(join(tmp, 'AGENTS.md')), renderBlock('`board/`'));
      assert.deepStrictEqual(runAll(['agents-md', '--claude']), { code: 0, stdout: 'AGENTS.md: unchanged\nCLAUDE.md: created\n', stderr: '' });
      assert.equal(read(join(tmp, 'CLAUDE.md')), renderBlock('`board/`'));
      assert.deepStrictEqual(runAll(['--json', 'agents-md', '--claude']), { code: 0, stdout: '{\n  "AGENTS.md": "unchanged",\n  "CLAUDE.md": "unchanged"\n}\n', stderr: '' });
      // An existing pointer file is never overwritten.
      writeFileSync(join(tmp, 'aiboard.json'), '{"board": "board"}');
      const again = runAll(['init', 'board']);
      assert.deepStrictEqual({ ...again, stdout: rooted(again.stdout, tmp) }, { code: 0, stdout: `Board 'board' ready at <ROOT>/board (0 entries created)\n${next}`, stderr: '' });
      assert.equal(read(join(tmp, 'aiboard.json')), '{"board": "board"}');
      // With --root, no pointer file lands in the project, even for a board inside it.
      const project = join(tmp, 'project');
      mkdirSync(project);
      process.chdir(project);
      const elsewhere = runAll(['--root', join(project, 'other'), 'init', 'board']);
      assert.deepStrictEqual({ ...elsewhere, stdout: rooted(elsewhere.stdout, tmp) }, { code: 0, stdout: `Board 'other' ready at <ROOT>/project/other (9 entries created)\n${next}`, stderr: '' });
      assert.deepStrictEqual(readdirSync(project), ['other']);
    } finally {
      process.chdir(savedCwd);
      if (savedRoot !== undefined) process.env.AIBOARD_ROOT = savedRoot;
    }
  });

  test('installBlock appends after existing content as aiboard a1592dc does', () => {
    const block = renderBlock('x');
    const crlfBlock = `# A\r\n\r\n${block.split('\n').join('\r\n')}`;
    const cases = [
      ['ends-blank-line.md', '# A\n\n', 'updated', `# A\n\n${block}`],
      ['no-final-newline.md', '# A', 'updated', `# A\n\n${block}`],
      ['crlf.md', '# A\r\nKeep\r\n', 'updated', `# A\nKeep\n\n${block}`],
      ['crlf-with-block.md', crlfBlock, 'unchanged', crlfBlock],
    ];
    for (const [name, before, result, after] of cases) {
      const f = join(tmp, name);
      writeFileSync(f, before);
      assert.equal(installBlock(f, 'x'), result, name);
      assert.equal(read(f), after, name);
    }
  });

  test('the command-line entry reads stdin as Python does and sets exit codes', async () => {
    const env = { ...process.env, COLUMNS: '80' };
    delete env.NODE_TEST_CONTEXT;
    const run = (argv, stdin = '') =>
      new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [MAIN, ...argv], { env, stdio: ['pipe', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (d) => (stdout += d));
        child.stderr.on('data', (d) => (stderr += d));
        child.on('error', reject);
        child.on('close', (code) => resolve({ code, stdout, stderr }));
        child.stdin.end(stdin);
      });
    const piped = join(tmp, 'piped');
    const checked = join(tmp, 'checked');
    for (const root of [piped, checked]) assert.equal(runAll(['--root', root, 'init']).code, 0);
    runAll(['--root', checked, 'task', 'new', 'Odd id']);
    const odd = join(checked, 'tasks/backlog/T-001-odd-id/brief.md');
    writeFileSync(odd, read(odd).replace('id: T-001', 'id: T-099'));
    const [body, badPriority, noTitle, check] = await Promise.all([
      run(['--root', piped, 'task', 'new', 'Piped', '--body-file', '-'], 'line1\r\nline2\rline3\n'),
      run(['--json', '--root', piped, 'task', 'new', 'x', '--priority', 'bogus']),
      run(['--root', piped, 'task', 'new']),
      run(['--root', checked, 'check']),
    ]);
    assert.deepStrictEqual(body, { code: 0, stdout: `Created T-001 in backlog: ${piped}/tasks/backlog/T-001-piped\n`, stderr: '' });
    assert.ok(read(join(piped, 'tasks/backlog/T-001-piped/brief.md')).endsWith('\n# Piped\n\nline1\r\nline2\rline3\n'));
    const bogus = ARGPARSE_CASES.find(([argv]) => argv[0] === '--json');
    assert.deepStrictEqual(badPriority, { code: 1, stdout: bogus[2], stderr: '' });
    const required = ARGPARSE_CASES.find(([argv]) => argv.join(' ') === 'task new');
    assert.deepStrictEqual(noTitle, { code: 2, stdout: '', stderr: required[3] });
    assert.deepStrictEqual(check, { code: 1, stdout: "- T-001: front matter id is 'T-099'\n", stderr: '' });
  });
});
