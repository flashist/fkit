export const native = text => text
  .replace(/\bfkit (lead|producer|coder|architect|reviewer|adversarial-reviewer|wiki)\b/g, 'fkit opencode $1')
  .replaceAll('fkit <role>', 'fkit opencode <role>').replaceAll('.claude/', '.opencode/')
  .replaceAll('claude/skills/', 'opencode/skills/')
  .replaceAll('AskUserQuestion', 'question').replaceAll('Agent tool', 'subagent tool')
  .replace(/in a spawned consult the tool is\s+absent/g, 'in a spawned consult FKit reserves the tool for the parent')
  .replaceAll('A spawned worker has no `question` (it is session-only).', 'A spawned worker returns decisions to its parent rather than using `question`.')
  .replaceAll('the owner channel is session-only', 'FKit reserves the owner channel for the primary')
  .replaceAll('`Skill`', '`skill`').replaceAll('Codex', 'native second opinion')
  .replaceAll('Claude-side roles', 'native roles').replaceAll('Claude-side role', 'native role')
  .replaceAll('ADR-018 `native skill permission` hook', 'OpenCode native skill permission gate')
  .replaceAll('ADR-018 hook', 'OpenCode native skill permission gate')
  .replaceAll('hook-enforced', 'permission-enforced').replaceAll('hook-structural', 'permission-structural')
  .replaceAll('PreToolUse', 'native skill permission').replaceAll('skill-ownership hook', 'skill permission gate')
  .replaceAll('ADR-018 `native skill permission` hook', 'OpenCode native skill permission gate').replaceAll('Claude Code', 'OpenCode')
  .replaceAll('hop N of 2', 'hop N of 3').replaceAll('hop 1 of 2', 'hop 1 of 3').replaceAll('at hop 2', 'at hop 3').replaceAll('two-hop consult contract', 'three-hop consult contract')
  .replaceAll('EnterPlanMode', 'present a read-only plan').replaceAll('ExitPlanMode', 'question approval gate');

export function scaffoldContent(rel, text) {
  const content = native(text);
  if (rel !== 'AGENTS.md') return content;
  return content.replace('Guidance for native second opinion (the codex fkit agents)',
    'Guidance for the native OpenCode FKit agents') + '\nRead `.opencode/fkit-rules.md` for universal team rules.\n';
}
