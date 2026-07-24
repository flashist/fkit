// The shiploop-marker-hook contract suite — claude/shiploop-marker-hook.sh (task 0129 / ADR-030).
//
// SCOPE: a UserPromptExpansion hook that is a pure function of (payload on stdin, filesystem at $cwd) ->
// (a marker file, exit code). RECORDS ONLY, never blocks: every path exits 0 with empty stdout. Tests
// as fixtures-in, marker-file-out — no model, no auth, no network.
//
// ⚠️ Invoked as `bash <path>`, never `./<path>` (ADR-017 rule 2).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const DEFAULT_SCRIPT = join(REPO, 'claude', 'shiploop-marker-hook.sh');
const SCRIPT = process.env.FKIT_SHIPLOOP_MARKER_HOOK || DEFAULT_SCRIPT;
if (SCRIPT !== DEFAULT_SCRIPT) {
  process.stderr.write(`[shiploop-marker-hook.test.js] ⚠ testing NON-default script via FKIT_SHIPLOOP_MARKER_HOOK: ${SCRIPT}\n`);
}

const TMP = mkdtempSync(join(tmpdir(), 'fkit-sl-'));
after(() => { try { rmSync(TMP, { recursive: true, force: true }); } catch { /* best effort */ } });

let n = 0;
function newCwd() {
  const p = join(TMP, `proj-${n++}`);
  mkdirSync(p, { recursive: true });
  return p;
}
function run(payload) {
  const r = spawnSync('bash', [SCRIPT], { input: payload, encoding: 'utf8' });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}
function payload({ expansionType = 'slash_command', commandName = 'fkit-task-ship-loop', sessionId = 'sess-1', cwd, omitCwd = false } = {}) {
  const parts = ['"hook_event_name":"UserPromptExpansion"'];
  if (expansionType !== null) parts.push(`"expansion_type":${JSON.stringify(expansionType)}`);
  if (commandName !== null) parts.push(`"command_name":${JSON.stringify(commandName)}`);
  if (sessionId !== null) parts.push(`"session_id":${JSON.stringify(sessionId)}`);
  if (!omitCwd) parts.push(`"cwd":${JSON.stringify(cwd)}`);
  parts.push('"prompt":"/fkit-task-ship-loop brief"');
  return `{${parts.join(',')}}`;
}
function markerPath(cwd, sessionId) { return join(cwd, '.fkit', 'state', `shiploop-${sessionId}`); }

function assertRecordOnly(r) {
  assert.equal(r.code, 0, `expected exit 0, got ${r.code} (stderr: ${r.err})`);
  assert.equal(r.out.trim(), '', `a marker hook must emit no stdout, got: ${r.out}`);
}

test('a /fkit-task-ship-loop invocation → writes the session marker', () => {
  const cwd = newCwd();
  assertRecordOnly(run(payload({ commandName: 'fkit-task-ship-loop', sessionId: 'abc', cwd })));
  assert.ok(existsSync(markerPath(cwd, 'abc')), 'marker must exist after a ship-loop invocation');
});

test('a /fkit-sprint-ship-loop invocation → writes the marker too (both loops, one signal)', () => {
  const cwd = newCwd();
  assertRecordOnly(run(payload({ commandName: 'fkit-sprint-ship-loop', sessionId: 'def', cwd })));
  assert.ok(existsSync(markerPath(cwd, 'def')), 'sprint-loop invocation must also write the marker');
});

test('a leading-slash command_name is handled', () => {
  const cwd = newCwd();
  assertRecordOnly(run(payload({ commandName: '/fkit-task-ship-loop', sessionId: 'ghi', cwd })));
  assert.ok(existsSync(markerPath(cwd, 'ghi')), 'a "/"-prefixed command_name must still match');
});

test('a NON-ship-loop command → writes nothing', () => {
  const cwd = newCwd();
  assertRecordOnly(run(payload({ commandName: 'fkit-plan-task', sessionId: 'abc', cwd })));
  assert.ok(!existsSync(join(cwd, '.fkit', 'state')), 'no marker for a non-ship-loop command');
});

test('expansion_type != slash_command (e.g. mcp_prompt) → writes nothing (authoritative gate)', () => {
  const cwd = newCwd();
  assertRecordOnly(run(payload({ expansionType: 'mcp_prompt', commandName: 'fkit-task-ship-loop', sessionId: 'abc', cwd })));
  assert.ok(!existsSync(join(cwd, '.fkit', 'state')), 'only a real slash_command invocation writes the marker');
});

test('unsafe session_id → writes nothing, no crash (path-safety)', () => {
  const cwd = newCwd();
  assertRecordOnly(run(payload({ sessionId: '../evil', cwd })));
  assert.ok(!existsSync(join(cwd, '.fkit', 'state')));
});

test('missing session_id / missing cwd / non-existent cwd → writes nothing, exit 0', () => {
  const cwd = newCwd();
  assertRecordOnly(run(payload({ sessionId: null, cwd })));
  assertRecordOnly(run(payload({ sessionId: 'abc', omitCwd: true })));
  assertRecordOnly(run(payload({ sessionId: 'abc', cwd: join(TMP, 'nope') })));
});

test('empty / malformed payload → exit 0, no crash', () => {
  assertRecordOnly(run(''));
  assertRecordOnly(run('not json {{{'));
});
