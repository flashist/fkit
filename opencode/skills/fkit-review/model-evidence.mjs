#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

// Inspect native session records, not model self-reports; never print prompt or response contents.
const childID = process.argv[2];
if (!/^ses[a-zA-Z0-9_-]+$/.test(childID || '')) {
  console.error('Usage: node model-evidence.mjs <native-child-sessionID>');
  process.exit(2);
}
function api(operation, params) {
  const args = ['api', operation];
  for (const [key, value] of Object.entries(params)) args.push('--param', `${key}=${value}`);
  if (process.env.FKIT_OPENCODE_SERVER) args.push('--server', process.env.FKIT_OPENCODE_SERVER);
  return JSON.parse(execFileSync('opencode', args, { encoding: 'utf8', timeout: 15000,
    maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }));
}
function latest(sessionID, agent) {
  const result = api('session.message.list', { sessionID, type: 'assistant', order: 'desc', limit: '100' });
  if (!Array.isArray(result.data)) throw new Error('Missing native assistant-message records');
  return result.data.find(m => m.type === 'assistant' && m.agent === agent && !m.error &&
    typeof m.model?.providerID === 'string' && typeof m.model?.id === 'string' && m.content?.length);
}
try {
  const child = api('session.get', { sessionID: childID }).data;
  if (child?.id !== childID || !/^ses[a-zA-Z0-9_-]+$/.test(child.parentID || '')) {
    throw new Error('Child has no verifiable parent session');
  }
  if (process.env.OPENCODE_SESSION_ID && child.parentID !== process.env.OPENCODE_SESSION_ID) {
    throw new Error('Child does not belong to the invoking reviewer session');
  }
  const hostile = latest(childID, 'fkit-adversarial-reviewer');
  const primary = latest(child.parentID, 'fkit-reviewer');
  if (!hostile || !primary) throw new Error('Missing reviewer assistant-message model evidence');
  const diverse = primary.model.id !== hostile.model.id;
  console.log(JSON.stringify({ status: diverse ? 'distinct-runtime-models' : 'same-model',
    primary: { sessionID: child.parentID, messageID: primary.id, model: primary.model },
    hostile: { sessionID: childID, messageID: hostile.id, model: hostile.model },
    note: 'Native runtime model IDs; provider aliases do not prove a distinct upstream model.' }, null, 2));
  process.exitCode = diverse ? 0 : 1;
} catch {
  // CLI errors may include private server details; report the evidence gap without echoing them.
  console.log(JSON.stringify({ status: 'unverified', reason: 'Native reviewer session/model evidence unavailable; report a partial review.' }));
  process.exitCode = 1;
}
