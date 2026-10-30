import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { ROLES } from './settings.mjs';
import { KIT } from './materialize.mjs';

export function consultChain(role, chain) {
  if (!ROLES.includes(role) || !Array.isArray(chain) || chain.some(r => !ROLES.includes(r)) || new Set(chain).size !== chain.length) throw Error('Invalid consult role or chain');
  if (chain.length >= 3 || chain.includes(role) || chain.at(-1) === 'adversarial-reviewer') throw Error('Consult denied: two-hop budget, cycle, or leaf role');
  return [...chain, role];
}

export function adversarialChain(caller, chain) {
  // Claude's external second opinion did not consume an ordinary Agent consult hop.
  if (caller !== 'reviewer' || !Array.isArray(chain) || chain.at(-1) !== caller || chain.some(r => !ROLES.includes(r)) || new Set(chain).size !== chain.length || chain.includes('adversarial-reviewer') || chain.length > 3) throw Error('Only a valid reviewer context may request the independent second opinion');
  return [...chain, 'adversarial-reviewer'];
}

export function checkCarry(root, prompt) {
  // Fidelity is checked independently of the model; owner approval remains a separate gate.
  const carry = spawnSync('bash', [join(KIT, 'claude/carry-check-hook.sh')], { input: JSON.stringify({ tool_name: 'Agent', cwd: root, tool_input: { prompt } }), encoding: 'utf8', timeout: 10000 });
  if (carry.stderr) process.stderr.write(carry.stderr);
  if (carry.error || carry.status !== 0) console.error('fkit-codex: carry check unavailable (existing fail-open policy)');
  else if (carry.stdout.trim()) {
    let decision;
    try { decision = JSON.parse(carry.stdout).hookSpecificOutput; } catch { console.error('fkit-codex: carry check response invalid (existing fail-open policy)'); }
    if (decision?.permissionDecision === 'deny') throw Error(`Consult denied: ${decision.permissionDecisionReason}`);
  }
}
