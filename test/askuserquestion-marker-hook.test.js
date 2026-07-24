// The askuserquestion-marker-hook contract suite — claude/askuserquestion-marker-hook.sh
// (task 0127 / ADR-030, path 2).
//
// SCOPE: a PreToolUse hook that is a pure function of (payload on stdin, filesystem at $cwd) ->
// (a marker file, exit code). It RECORDS ONLY and must NEVER deny: every path exits 0 with empty
// stdout. Tests as fixtures-in, marker-file-out — no model, no auth, no network.
//
// ⚠️ Invoked as `bash <path>`, never `./<path>` (ADR-017 rule 2).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const DEFAULT_SCRIPT = join(REPO, 'claude', 'askuserquestion-marker-hook.sh');
const SCRIPT = process.env.FKIT_ASKUQ_MARKER_HOOK || DEFAULT_SCRIPT;
if (SCRIPT !== DEFAULT_SCRIPT) {
  process.stderr.write(`[askuserquestion-marker-hook.test.js] ⚠ testing NON-default script via FKIT_ASKUQ_MARKER_HOOK: ${SCRIPT}\n`);
}

const TMP = mkdtempSync(join(tmpdir(), 'fkit-auq-'));
after(() => { try { rmSync(TMP, { recursive: true, force: true }); } catch { /* best effort */ } });

let n = 0;
function newCwd() {
  const p = join(TMP, `proj-${n++}`);
  mkdirp(p);
  return p;
}
import { mkdirSync } from 'node:fs';
function mkdirp(p) { mkdirSync(p, { recursive: true }); }

function run(payload) {
  const r = spawnSync('bash', [SCRIPT], { input: payload, encoding: 'utf8' });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}
function payload({ toolName = 'AskUserQuestion', sessionId = 'sess-1', cwd, omitCwd = false } = {}) {
  const parts = ['"hook_event_name":"PreToolUse"'];
  if (sessionId !== null) parts.push(`"session_id":${JSON.stringify(sessionId)}`);
  if (!omitCwd) parts.push(`"cwd":${JSON.stringify(cwd)}`);
  if (toolName !== null) parts.push(`"tool_name":${JSON.stringify(toolName)}`);
  parts.push('"tool_input":{"questions":[]}');
  return `{${parts.join(',')}}`;
}
function markerPath(cwd, sessionId) { return join(cwd, '.fkit', 'state', `askuq-${sessionId}`); }

// Every path must be a clean allow: exit 0, no stdout (a PreToolUse recorder must never deny).
function assertRecordOnly(r) {
  assert.equal(r.code, 0, `expected exit 0, got ${r.code} (stderr: ${r.err})`);
  assert.equal(r.out.trim(), '', `a marker hook must emit no stdout, got: ${r.out}`);
}

test('AskUserQuestion call → writes the turn-scoped marker', () => {
  const cwd = newCwd();
  const r = run(payload({ toolName: 'AskUserQuestion', sessionId: 'abc', cwd }));
  assertRecordOnly(r);
  assert.ok(existsSync(markerPath(cwd, 'abc')), 'marker must exist after an AskUserQuestion call');
});

test('a non-AskUserQuestion tool → writes NO marker', () => {
  const cwd = newCwd();
  const r = run(payload({ toolName: 'Bash', sessionId: 'abc', cwd }));
  assertRecordOnly(r);
  assert.ok(!existsSync(join(cwd, '.fkit', 'state')), 'no state dir/marker for a non-AskUserQuestion tool');
});

test('unsafe session_id → writes nothing, no crash (path-safety)', () => {
  const cwd = newCwd();
  const r = run(payload({ sessionId: '../evil', cwd }));
  assertRecordOnly(r);
  // Nothing resembling a marker anywhere under cwd.
  assert.ok(!existsSync(join(cwd, '.fkit', 'state')) || readdirSync(join(cwd, '.fkit', 'state')).length === 0,
    'an unsafe session_id must not produce a marker');
});

test('missing session_id → writes nothing, exit 0', () => {
  const cwd = newCwd();
  assertRecordOnly(run(payload({ sessionId: null, cwd })));
  assert.ok(!existsSync(join(cwd, '.fkit', 'state')));
});

test('cwd that does not exist → writes nothing, exit 0', () => {
  const r = run(payload({ sessionId: 'abc', cwd: join(TMP, 'does-not-exist') }));
  assertRecordOnly(r);
});

test('missing cwd → writes nothing, exit 0', () => {
  assertRecordOnly(run(payload({ sessionId: 'abc', omitCwd: true })));
});

test('empty / malformed payload → exit 0, no marker, no crash', () => {
  assertRecordOnly(run(''));
  assertRecordOnly(run('not json {{{'));
});
