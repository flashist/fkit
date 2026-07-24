// The turn-completion-hook contract suite — claude/turn-completion-hook.sh (task 0127 / ADR-030).
//
// SCOPE: the hook is a pure function of (Stop-hook JSON payload on stdin, + the AskUserQuestion marker
// file on disk, + an optional transcript file) -> (exit code, stdout, stderr). Fixtures-in, decision-out
// — no model, no auth, no network, no live `claude`. Per ADR-012 this is the CEILING of automated
// coverage: the live path (a real AskUserQuestion PreToolUse marker being written, the Stop actually
// blocking) cannot be exercised by a spawned subagent — that stays hand-verified.
//
// ⚠️ THE CENTRAL INVARIANT IS FAIL-OPEN (ADR-030 Decision 6), INVERTED from skill-ownership-hook.sh.
// A block can stop a turn completing, so it is the dangerous outcome: every error, empty field,
// unreadable file, or uncertainty MUST allow (empty stdout). assertAllow() pins "no block emitted".
//
// CHECK A uses a PreToolUse MARKER (path 2), not the transcript: marker present = AskUserQuestion used
// this turn = suppress; marker absent AND infra present (the state dir exists) = may fire; any doubt =
// suppress. The R1 regression test below is the one the round-1 transcript approach failed.
//
// ⚠️ Invoked as `bash <path>`, never `./<path>` (ADR-017 rule 2).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const DEFAULT_SCRIPT = join(REPO, 'claude', 'turn-completion-hook.sh');
const SCRIPT = process.env.FKIT_TURN_COMPLETION_HOOK || DEFAULT_SCRIPT;
if (SCRIPT !== DEFAULT_SCRIPT) {
  process.stderr.write(`[turn-completion-hook.test.js] ⚠ testing NON-default script via FKIT_TURN_COMPLETION_HOOK: ${SCRIPT}\n`);
}

const TMP = mkdtempSync(join(tmpdir(), 'fkit-tc-'));
after(() => { try { rmSync(TMP, { recursive: true, force: true }); } catch { /* best effort */ } });

let n = 0;
// A project cwd; with a .fkit/state dir by default (= marker infra present, so check A may fire).
function newCwd({ stateDir = true } = {}) {
  const p = join(TMP, `proj-${n++}`);
  mkdirSync(p, { recursive: true });
  if (stateDir) mkdirSync(join(p, '.fkit', 'state'), { recursive: true });
  return p;
}
function placeMarker(cwd, sessionId) {
  writeFileSync(join(cwd, '.fkit', 'state', `askuq-${sessionId}`), '');
}
function markerExists(cwd, sessionId) {
  return existsSync(join(cwd, '.fkit', 'state', `askuq-${sessionId}`));
}
// The ship-loop session marker (task 0129) — written by shiploop-marker-hook.sh on a real invocation.
function placeShiploopMarker(cwd, sessionId) {
  writeFileSync(join(cwd, '.fkit', 'state', `shiploop-${sessionId}`), '');
}
let tN = 0;
function writeTranscript(lines) {
  const p = join(TMP, `transcript-${tN++}.jsonl`);
  writeFileSync(p, lines.join('\n') + '\n');
  return p;
}

function run(payload) {
  const r = spawnSync('bash', [SCRIPT], { input: payload, encoding: 'utf8' });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}
function payload({
  agentType = 'fkit-coder',
  lastMessage = 'ok',        // string, or null to OMIT the field
  rawMessage,                // raw JSON fragment for the value (e.g. 'null'); overrides lastMessage
  stopHookActive = false,
  transcriptPath,
  hookEvent = 'Stop',
  cwd,
  sessionId = 'sess-1',
} = {}) {
  const parts = [];
  if (hookEvent !== null) parts.push(`"hook_event_name":${JSON.stringify(hookEvent)}`);
  parts.push(`"stop_hook_active":${stopHookActive ? 'true' : 'false'}`);
  if (agentType !== null) parts.push(`"agent_type":${JSON.stringify(agentType)}`);
  if (sessionId !== null) parts.push(`"session_id":${JSON.stringify(sessionId)}`);
  if (cwd !== undefined) parts.push(`"cwd":${JSON.stringify(cwd)}`);
  if (transcriptPath !== undefined) parts.push(`"transcript_path":${JSON.stringify(transcriptPath)}`);
  if (rawMessage !== undefined) parts.push(`"last_assistant_message":${rawMessage}`);
  else if (lastMessage !== null) parts.push(`"last_assistant_message":${JSON.stringify(lastMessage)}`);
  return `{${parts.join(',')}}`;
}

function assertBlock(r, label) {
  assert.equal(r.code, 0, `${label}: expected exit 0, got ${r.code} (stderr: ${r.err})`);
  let parsed;
  try { parsed = JSON.parse(r.out.trim()); }
  catch (e) { assert.fail(`${label}: block stdout is not valid JSON: ${JSON.stringify(r.out)} (${e.message})`); }
  assert.equal(parsed.decision, 'block', `${label}: expected decision:"block", got ${JSON.stringify(parsed)}`);
  assert.ok(typeof parsed.reason === 'string' && parsed.reason.length > 0, `${label}: non-empty reason`);
  return parsed;
}
function assertAllow(r, label) {
  assert.equal(r.code, 0, `${label}: expected exit 0, got ${r.code} (stderr: ${r.err})`);
  assert.equal(r.out.trim(), '', `${label}: expected allow (empty stdout), got a decision: ${r.out}`);
}

// =================================================================================================
// Check B (exact) — the literal "What's next?" heading.
// =================================================================================================

test('B: message with no "What\'s next?" -> block', () => {
  const cwd = newCwd();
  assertBlock(run(payload({ lastMessage: 'Here is the result. All done.', cwd })), 'B missing');
});

test('B: message that closes with "What\'s next?" -> allow', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ lastMessage: 'Done.\n\nWhat\'s next?\nNothing pending.', cwd })), 'B present');
});

// =================================================================================================
// Check A via the marker. R1 REGRESSION is the headline: a turn that used AskUserQuestion must NOT be
// blocked even when the final message contains a prose question.
// =================================================================================================

test('A/R1 regression: marker present (tool WAS used) + prose question -> allow', () => {
  const cwd = newCwd();
  placeMarker(cwd, 'sess-1');
  assertAllow(run(payload({ lastMessage: 'Redis or Postgres?\n\nWhat\'s next?\nAwaiting.', cwd, sessionId: 'sess-1' })), 'R1: marker suppresses A');
});

test('A: marker absent + infra present + prose question -> block', () => {
  const cwd = newCwd();  // state dir exists, no marker
  const p = assertBlock(run(payload({ lastMessage: 'Redis or Postgres?\n\nWhat\'s next?\nAwaiting.', cwd, sessionId: 'sess-1' })), 'A fires');
  assert.match(p.reason, /AskUserQuestion/, 'A reason names the tool');
});

test('A: marker consumed after the run (turn-scoped, no leak to next turn)', () => {
  const cwd = newCwd();
  placeMarker(cwd, 'sess-1');
  run(payload({ lastMessage: 'Done.\n\nWhat\'s next?\nx', cwd, sessionId: 'sess-1' }));
  assert.ok(!markerExists(cwd, 'sess-1'), 'the Stop hook must delete the marker it read');
});

test('A FAIL-OPEN: infra absent (no state dir) + prose question -> allow', () => {
  const cwd = newCwd({ stateDir: false });
  assertAllow(run(payload({ lastMessage: 'Redis or Postgres?\n\nWhat\'s next?\nAwaiting.', cwd, sessionId: 'sess-1' })), 'A suppressed, no infra');
});

test('A FAIL-OPEN: no cwd in payload -> allow (cannot locate/trust the marker)', () => {
  assertAllow(run(payload({ lastMessage: 'Redis or Postgres?\n\nWhat\'s next?\nAwaiting.' })), 'A suppressed, no cwd');
});

// R4 (round 2): a state dir that EXISTS but is not WRITABLE means the marker could not have been
// recorded, so marker-absence is untrustworthy → suppress check A (fail open). Root ignores mode bits,
// so skip there (the check would be defeated, not the code).
test('A/R4 FAIL-OPEN: state dir present but not writable -> allow (marker not recordable)', { skip: process.getuid && process.getuid() === 0 ? 'runs as root; -w is bypassed' : false }, () => {
  const cwd = newCwd();  // has .fkit/state, no marker
  chmodSync(join(cwd, '.fkit', 'state'), 0o500);
  try {
    assertAllow(run(payload({ lastMessage: 'Redis or Postgres?\n\nWhat\'s next?\nAwaiting.', cwd })), 'A suppressed, dir unwritable');
  } finally {
    chmodSync(join(cwd, '.fkit', 'state'), 0o700);  // restore so cleanup can remove it
  }
});

// R3 — the interrogative test is line-based and excludes fences, blockquotes, and the heading.
test('A/R3: a question ONLY inside a code fence -> allow', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ lastMessage: 'All set.\n\n```sh\nwho am i?\n```\n\nWhat\'s next?\nNothing.', cwd })), 'A ignores fenced ?');
});

test('A/R3: a question ONLY in a ">" blockquote -> allow', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ lastMessage: 'Done.\n\n> did it work?\n\nWhat\'s next?\nNothing.', cwd })), 'A ignores blockquoted ?');
});

test('A/R3: a "## What\'s next?" heading (ends in ?) must not fire A -> allow', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ lastMessage: 'All good.\n\n## What\'s next?\nNothing pending.', cwd })), 'A ignores heading ?');
});

test('A/R3: an owner-directed line ending in ? (outside fences/quotes) -> block', () => {
  const cwd = newCwd();
  assertBlock(run(payload({ lastMessage: 'Should I ship it?\n\nWhat\'s next?\nYour call.', cwd })), 'A fires on real prose question');
});

// =================================================================================================
// Both checks fire -> exactly one block, reason carries both.
// =================================================================================================

test('A+B both fire -> single block whose reason mentions both', () => {
  const cwd = newCwd();
  const p = assertBlock(run(payload({ lastMessage: 'Use Redis or Postgres?', cwd, sessionId: 'sess-1' })), 'A+B');
  assert.match(p.reason, /AskUserQuestion/, 'combined reason has A');
  assert.match(p.reason, /What's next\?/, 'combined reason has B');
});

// =================================================================================================
// Skip conditions (ADR-030 Decisions 5 & 7).
// =================================================================================================

test('SKIP: stop_hook_active=true -> allow (block-once)', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ lastMessage: 'no footer here', stopHookActive: true, cwd })), 'block-once');
});

test('SKIP: adversarial reviewer -> allow (findings-only contract)', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ agentType: 'fkit-adversarial-reviewer', lastMessage: 'FINDINGS: none.', cwd })), 'adversarial skip');
});

// SKIP 3 is now the transcript-INDEPENDENT ship-loop marker (task 0129): the shiploop-<session> marker,
// written by shiploop-marker-hook.sh on a real slash-command invocation, covers BOTH loops (the marker
// hook filters on command_name; the Stop hook just checks the marker exists). No transcript is read.
test('SKIP: a ship-loop session marker present -> allow (both loops, one signal)', () => {
  const cwd = newCwd();
  placeShiploopMarker(cwd, 'sess-1');
  assertAllow(run(payload({ lastMessage: 'looping, no footer', cwd, sessionId: 'sess-1' })), 'ship-loop marker skip');
});

// ✅ R8 FIXED (was the owner-live-verify defect + the round-3 known limitation): the command marker text
// appearing as transcript CONTENT no longer skips — the hook does not read the transcript at all now.
// A session that only READS files containing the marker (no real invocation → no shiploop marker) enforces.
test('R8 FIXED: the marker text as transcript CONTENT (no real invocation) -> block, not skipped', () => {
  const cwd = newCwd();  // no shiploop marker placed
  const t = writeTranscript([
    '{"type":"user","content":[{"type":"tool_result","content":"for marker in <command-name>/fkit-task-ship-loop</command-name> ; do ..."}]}',
  ]);
  assertBlock(run(payload({ lastMessage: 'answer with no footer', transcriptPath: t, cwd })), 'R8: marker-as-content must NOT skip');
});

// ✅ R6 FIXED: a real ship-loop turn is skipped even with NO transcript at all — the skip no longer
// depends on a readable/present transcript.
test('R6 FIXED: ship-loop marker present + NO transcript -> allow (skip is transcript-independent)', () => {
  const cwd = newCwd();
  placeShiploopMarker(cwd, 'sess-1');
  assertAllow(run(payload({ lastMessage: 'looping, no footer', cwd, sessionId: 'sess-1' /* no transcriptPath */ })), 'R6: skip without transcript');
});

// A non-loop session (no marker) enforces normally — the whole point of the fix.
test('NO-SKIP: no ship-loop marker -> block (a normal session enforces)', () => {
  const cwd = newCwd();
  assertBlock(run(payload({ lastMessage: 'here is the answer, no footer', cwd, sessionId: 'sess-plain' })), 'no marker → enforce');
});

// =================================================================================================
// FAIL OPEN — every degraded/uncertain input must allow, never block.
// =================================================================================================

test('FAIL-OPEN: empty payload -> allow', () => { assertAllow(run(''), 'empty payload'); });
test('FAIL-OPEN: malformed / non-JSON payload -> allow', () => { assertAllow(run('not even json {{{'), 'malformed'); });

test('FAIL-OPEN: last_assistant_message absent -> allow', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ lastMessage: null, cwd })), 'message absent');
});

// R2 — the round-1 gap: empty / null / whitespace-after-colon must all fail open.
test('FAIL-OPEN/R2: empty-string message -> allow', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ rawMessage: '""', cwd })), 'empty string');
});
test('FAIL-OPEN/R2: JSON null message -> allow', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ rawMessage: 'null', cwd })), 'null');
});
test('FAIL-OPEN/R2: whitespace after the colon (null/empty) -> allow', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ rawMessage: '   null', cwd })), 'spaced null');
  assertAllow(run(payload({ rawMessage: '   ""', cwd })), 'spaced empty');
});

test('FAIL-OPEN/R2: whitespace-ONLY message value -> allow (nothing to enforce against)', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ rawMessage: '"   "', cwd })), 'whitespace-only value');
});

test('FAIL-OPEN: an explicitly non-Stop event -> allow', () => {
  const cwd = newCwd();
  assertAllow(run(payload({ hookEvent: 'SubagentStop', lastMessage: 'no footer', cwd })), 'non-Stop event');
});

test('FAIL-OPEN: unreadable transcript does not affect check B -> block on a real missing footer', () => {
  const cwd = newCwd();
  assertBlock(run(payload({ lastMessage: 'no footer', transcriptPath: '/nonexistent/x.jsonl', cwd })), 'B without transcript');
});
