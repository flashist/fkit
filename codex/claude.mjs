import { join } from 'node:path';
import { KIT } from './materialize.mjs';

export function claudeArgs(root, role, resolved, prompt, headless, chain, runId, instructions) {
  const server = { command: 'node', args: [join(KIT, 'codex/server.mjs'), root, role, JSON.stringify(chain), headless ? 'headless' : 'native-owner', runId] };
  const args = ['--agent', `fkit-${role}`, '--append-system-prompt', instructions,
    '--mcp-config', JSON.stringify({ mcpServers: { fkit_roles: server } }), '--strict-mcp-config',
    '--disallowedTools', 'Agent,Task,Skill', '--permission-mode', headless ? 'auto' : 'manual'];
  if (resolved.model !== null) args.push('--model', resolved.model);
  // A Claude adversarial pass has no command or write tools; its coverage is reasoning-only.
  if (role === 'adversarial-reviewer') args.push('--tools', 'Read,Glob,Grep');
  if (headless) args.push('--print', '--output-format', 'json');
  else if (prompt) args.push('--', prompt);
  return args;
}

export function claudeResult(output, code) {
  let result;
  try { result = JSON.parse(output); } catch { return { code: code || 1, model: 'unknown', output: 'Claude returned no valid structured result. Inspect the CLI locally; private diagnostics withheld.' }; }
  const models = result?.modelUsage && typeof result.modelUsage === 'object' && !Array.isArray(result.modelUsage) ? Object.keys(result.modelUsage) : [];
  const model = models.length === 1 ? models[0] : 'unknown';
  if (!result || result.is_error || code !== 0) {
    const error = String(result?.result ?? '');
    const category = /usage limit|hit.*limit|quota/i.test(error) ? 'usage limit' : /auth|not logged|401/i.test(error) ? 'authentication' : /credit|billing|balance/i.test(error) ? 'billing' : 'runtime or service error';
    const status = /^API Error:\s*(\d{3})\b/.exec(error)?.[1];
    return { code: code || 1, model, output: `Claude failed: ${category}${status ? ` (HTTP ${status})` : ''}. Inspect the CLI locally; private diagnostics withheld.` };
  }
  if (typeof result.result !== 'string' || !result.result.trim()) return { code: 1, model, output: 'Claude returned no usable role response.' };
  return { code, model, output: result.result };
}
