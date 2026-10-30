// Retained for later owner-directed reactivation; the Codex launcher registers neither hook.
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { ROLES, contained } from './settings.mjs';
import { ownership } from './materialize.mjs';

const [role, event = 'pre', root = process.env.FKIT_CODEX_ROOT, runId = process.env.FKIT_CODEX_RUN_ID] = process.argv.slice(2);
function deny(reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } }));
}
try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  if (!ROLES.includes(role)) throw Error('Unknown fkit role');
  if (event === 'stop') {
    if (!root || !/^[a-z0-9-]+$/.test(runId ?? '')) throw Error('Invalid turn-check context');
    const marker = contained(root, join(root, '.fkit/state', `owner-${runId}`));
    const hadQuestion = existsSync(marker);
    if (hadQuestion) unlinkSync(marker);
    if (role === 'adversarial-reviewer' || input.stop_hook_active || !input.last_assistant_message?.trim()) process.exit(0);
    const text = input.last_assistant_message;
    const noNext = !text.includes("What's next?");
    const noForm = existsSync(contained(root, join(root, '.fkit/state', `owner-form-unavailable-${runId}`)));
    let fence = false;
    const question = text.split('\n').some(line => {
      if (line.trim().startsWith('```')) { fence = !fence; return false; }
      return !fence && !line.trim().startsWith('>') && !line.includes("What's next?") && /\?\s*$/.test(line);
    });
    const needsQuestion = question && !hadQuestion && !noForm;
    if (noNext || needsQuestion) process.stdout.write(JSON.stringify({ decision: 'block', reason: [noNext ? "End with What's next?; if nothing is pending say so." : '', needsQuestion ? 'Ask actual owner questions with fkit_ask_owner and wait. If this was only an explanation, finish without inventing a question.' : ''].filter(Boolean).join(' ') }));
    process.exit(0);
  }
  const name = input.tool_name;
  if (['spawn_agent', 'Agent', 'Task'].includes(name)) deny('Use the fkit consult launcher for a fresh role session with resolved settings.');
  else if (name === 'Skill') {
    const skill = input.tool_input?.skill;
    if (typeof skill !== 'string') throw Error('Missing skill identity');
    if (skill.startsWith('fkit-') && !ownership()[role].includes(skill)) deny(`fkit-${role} does not own ${skill}`);
  }
} catch {
  if (event === 'stop') process.stderr.write('fkit-codex: turn completion check unavailable (fail-open)\n');
  else deny('Cannot validate the fkit role/tool identity');
}
