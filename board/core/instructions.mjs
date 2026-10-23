// Agent-facing instructions, shared by `aiboard agents-md` and (later) the MCP server: a faithful port of
// aiboard/instructions.py at aiboard a1592dc.
import { statSync } from 'node:fs';
import { pyReadText, pyRstrip, pyWriteText } from './python-compat.mjs';

// Path.exists(): only these errors mean "no"; any other (EACCES, say) is raised, as in Python.
function exists(path) {
  try {
    statSync(path);
    return true;
  } catch (e) {
    if (['ENOENT', 'ENOTDIR', 'EBADF', 'ELOOP'].includes(e.code)) return false;
    throw e;
  }
}

export const BEGIN = '<!-- aiboard:begin -->';
export const END = '<!-- aiboard:end -->';

const agentsBlock = (rootHint) => `## Issue tracking with aiboard

This project tracks work in **aiboard**, a file-based issue tracker in ${rootHint}.
Tasks and sprints are folders; the parent folder is the status
(\`backlog\`, \`in-progress\`, \`done\`, \`cancelled\`). Each task folder holds
\`brief.md\` (what to do) and \`worklog.md\` (what was done, append-only).

Use the CLI (\`aiboard\`, or \`python3 -m aiboard\`) from anywhere inside the
project; it finds the board automatically by walking up from the current
directory. Run it from inside the project: from elsewhere it may silently
resolve to a different board. \`aiboard info\` shows which board you are on. Add \`--json\` for machine-readable
output; errors are then \`{"error": "..."}\` on stdout with exit code 1.
Set \`AIBOARD_AUTHOR=<your-agent-name>\` so worklog entries are attributed.

Working loop:

0. First, answer people: \`aiboard --json task list --assignee <you> --needs-reply\` lists your tasks (any status) whose latest comment is not yours. Act on those before new work.
1. Find work: \`aiboard --json task list --status backlog --unblocked [--sprint S-001]\`. Tasks come in queue order, top first (critical tasks start at the top): take the first one.
2. Take it: \`aiboard task start T-007\` (atomic claim + in-progress; if it fails, another agent got there first: take the next one in the list)
3. Read the brief: \`aiboard --json task show T-007\`
4. Log as you go: \`aiboard task log T-007 "Implemented X. Next: Y."\` (use \`-\` to pipe Markdown via stdin)
5. Need a human? \`aiboard task comment T-007 "Question: ..."\` and move on; answers arrive as comments (\`task show\`).
6. Finish: \`aiboard task change-status T-007 done --note "PR #12"\` (or \`cancelled --note "why"\`). Read the comments first; a reviewer may have left notes.
7. Verify: \`aiboard check\` (or \`aiboard check --fix\` after editing files by hand)

Create work with \`aiboard task new "Title" --sprint S-001 --priority high --body-file -\`;
add \`--blocked-by T-003\` when another task must finish first (or later: \`aiboard task block T-009 T-003\`).
Reorder the queue with \`aiboard task rank T-009 --top\` (or \`--bottom\`, \`--before T-003\`, \`--after T-003\`).
Sprints: \`aiboard sprint list\`, \`aiboard sprint show S-001\`, \`aiboard sprint new "Name" --goal "..."\`.

If your harness supports MCP, \`aiboard mcp\` exposes the same operations as
typed tools (list_tasks, get_task, create_task, change_task_status, log_work, ...).

Rules: never write a status into \`brief.md\` (the folder is the status);
\`worklog.md\` is append-only; ids like \`T-007\` are permanent.
`;

export function renderBlock(rootHint = 'this repository') {
  return `${BEGIN}\n${pyRstrip(agentsBlock(rootHint))}\n${END}\n`;
}

// Python's re.escape(BEGIN) + ".*?" + re.escape(END) + "\n?" under re.S.
const BLOCK = /<!-- aiboard:begin -->[\s\S]*?<!-- aiboard:end -->\n?/;

/** Insert or replace the marked block in `path`. Returns 'created' | 'updated' | 'unchanged'. */
export function installBlock(path, rootHint = 'this repository') {
  const block = renderBlock(rootHint);
  if (!exists(path)) {
    pyWriteText(path, block);
    return 'created';
  }
  const text = pyReadText(path);
  if (BLOCK.test(text)) {
    const updated = text.replace(BLOCK, () => block);
    if (updated === text) return 'unchanged';
    pyWriteText(path, updated);
    return 'updated';
  }
  const sep = text.endsWith('\n\n') ? '' : text.endsWith('\n') ? '\n' : '\n\n';
  pyWriteText(path, text + sep + block);
  return 'updated';
}
