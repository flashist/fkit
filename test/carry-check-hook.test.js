// The carry-check-hook contract suite — claude/carry-check-hook.sh + .mjs (task 0204; `0162` §10 row 3).
//
// SCOPE: a PreToolUse hook on the subagent-spawning tool ("Agent"; "Task" is the legacy alias) that is a
// pure function of (payload on stdin, filesystem at $cwd) -> (allow | deny JSON, exit code). Tests as
// fixtures-in, decision-out — no model, no auth, no network.
//
// ⚠️ WHAT GREEN MEANS HERE. Every `allow` below asserts ONE thing: "the prompt contains the exact bytes
// of the file at the pointer's path, whose git blob id starts with the pointer's hash". It is a
// carry-fidelity PROXY for the coder's condition (b) — never (b) itself. No test here can, or claims to,
// establish that the file is what the owner APPROVED (approval leaves no artifact — ADR-021). The check
// is time-of-check only (TOCTOU), and it exists only in launcher sessions (.fkit/settings/<role>.json).
//
// ⚠️ Invoked as `bash <path>`, never `./<path>` (ADR-017 rule 2). The .sh execs the .mjs beside itself,
// so FKIT_CARRY_CHECK_HOOK pointed at a copied claude/ tree exercises the COPY's .mjs (prove-red).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { REPO } from './harness.mjs';

const DEFAULT_SCRIPT = join(REPO, 'claude', 'carry-check-hook.sh');
const SCRIPT = process.env.FKIT_CARRY_CHECK_HOOK || DEFAULT_SCRIPT;
if (SCRIPT !== DEFAULT_SCRIPT) {
  process.stderr.write(`[carry-check-hook.test.js] ⚠ testing NON-default script via FKIT_CARRY_CHECK_HOOK: ${SCRIPT}\n`);
}

const TMP = mkdtempSync(join(tmpdir(), 'fkit-cc-'));
after(() => { try { rmSync(TMP, { recursive: true, force: true }); } catch { /* best effort */ } });

// --- the fixture plan: multi-line and escape-bearing on purpose (brief caveat 4) ---------------------
// `"`, `\`, an em-dash, a fenced block, a tab, non-ASCII, and a TRAILING NEWLINE — everything a naive
// `"[^"]*"` extractor or a trimming driver would mangle.
const PLAN_REL = 'ai-agents/tasks/backlog/0999-fixture-task/plan.md';
const PLAN_TEXT = [
  '# Plan — 0999: a "quoted" title with a back\\slash and a tab\there',
  '',
  '> Approved by the owner — naïve ünïcödé survives; so does `code`.',
  '',
  '```',
  'plan: … blob … (git hash-object)   <- not hex: the SKILL.md example never matches',
  '```',
  '',
  '1. Step one: keep {"json": "looking", "text": [1, 2]} intact.',
  '2. Step two: keep the trailing newline.',
  '',
].join('\n');
const PLAN_BYTES = Buffer.from(PLAN_TEXT, 'utf8');

// git blob id, computed HERE independently of the hook: sha1("blob <len>\0" + bytes).
function blobId(bytes) { return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'); }
const PLAN_HASH = blobId(PLAN_BYTES);

let n = 0;
function newProject({ planText = PLAN_TEXT, rel = PLAN_REL } = {}) {
  const cwd = join(TMP, `proj-${n++}`);
  mkdirSync(dirname(join(cwd, rel)), { recursive: true });
  if (planText !== null) writeFileSync(join(cwd, rel), planText);
  return cwd;
}
function pointer(hash = PLAN_HASH, rel = PLAN_REL) { return `plan: ${rel}  blob ${hash} (git hash-object)`; }
// A spawn prompt in the sprint loop's shape: caller line, pointer line(s), optional degraded-form
// declaration, then the paste between BEGIN/END fences.
function spawnPrompt({ hash = PLAN_HASH, rel = PLAN_REL, paste = PLAN_TEXT, declared = false, extraPointers = [] } = {}) {
  const lines = ['Caller: `fkit-sprint-ship-loop`. Build step for 0999. The owner approved the plan below.', pointer(hash, rel), ...extraPointers];
  if (declared) lines.push('⚠️ Degraded form: the plan is carried by reference only — read it from the path above.');
  if (paste !== null) lines.push('', '---BEGIN plan.md (verbatim)---', paste, '---END plan.md---');
  return lines.join('\n');
}
function payload({ toolName = 'Agent', prompt, cwd, omitCwd = false } = {}) {
  const o = {
    session_id: 'sess-1', hook_event_name: 'PreToolUse', tool_name: toolName, cwd,
    tool_input: { description: 'Build 0999', prompt, subagent_type: 'fkit-coder' },
  };
  if (omitCwd) delete o.cwd;
  return JSON.stringify(o);   // real JSON: every escape in the prompt is encoded properly
}
function run(input) {
  const r = spawnSync('bash', [SCRIPT], { input, encoding: 'utf8' });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}
// A real allow and a fail-open SKIP look the same on stdout/exit (review R4 of 0204): an allow must
// also prove the check RAN — no `SKIPPED` on stderr. assertSkip is the one place a skip is expected.
function assertAllow(r, why) {
  assert.equal(r.code, 0, `${why}: expected exit 0, got ${r.code} (stderr: ${r.err})`);
  assert.equal(r.out.trim(), '', `${why}: an allow must emit no stdout, got: ${r.out}`);
  assert.doesNotMatch(r.err, /SKIPPED/, `${why}: an allow must be a real allow, not a fail-open skip (stderr: ${r.err})`);
}
function assertSkip(r, why) {
  assert.equal(r.code, 0, `${why}: expected exit 0, got ${r.code} (stderr: ${r.err})`);
  assert.equal(r.out.trim(), '', `${why}: a skip must emit no stdout, got: ${r.out}`);
  assert.match(r.err, /carry-check-hook: .*SKIPPED \(fail-open\)/, `${why}: an infra fault must be loud on stderr`);
}
function assertDeny(r, why, reasonRe) {
  assert.equal(r.code, 0, `${why}: a deny is the JSON route with exit 0, got ${r.code} (stderr: ${r.err})`);
  let parsed;
  assert.doesNotThrow(() => { parsed = JSON.parse(r.out); }, `${why}: deny stdout must be JSON, got: ${r.out}`);
  const h = parsed.hookSpecificOutput;
  assert.equal(h?.hookEventName, 'PreToolUse', `${why}: hookEventName must be exactly PreToolUse or the deny is ignored`);
  assert.equal(h?.permissionDecision, 'deny', `${why}: expected permissionDecision deny`);
  assert.equal(typeof h?.permissionDecisionReason, 'string');
  if (reasonRe) assert.match(h.permissionDecisionReason, reasonRe, `${why}: wrong deny reason`);
  assert.match(r.err, /carry-check-hook: DENY/, `${why}: a deny must also be loud on stderr`);
  return h.permissionDecisionReason;
}

// --- 0. the fixture's blob id agrees with git itself (guards the formula the hook relies on) ---------
test('fixture blob id agrees with `git hash-object --stdin` (skipped if git is not on PATH)', (t) => {
  const g = spawnSync('git', ['hash-object', '--stdin'], { input: PLAN_BYTES });
  if (g.error || g.status !== 0) { t.skip('git not available'); return; }
  assert.equal(g.stdout.toString().trim(), PLAN_HASH, 'the test-side sha1 formula must equal git hash-object');
});

// --- the contract ------------------------------------------------------------------------------------
test('exact paste + matching hash -> allow', () => {
  const cwd = newProject();
  assertAllow(run(payload({ prompt: spawnPrompt(), cwd })), 'exact paste');
});

test('truncated paste -> deny', () => {
  const cwd = newProject();
  const truncated = PLAN_TEXT.slice(0, -40);   // last 40 bytes gone; the hash still names the real file
  assertDeny(run(payload({ prompt: spawnPrompt({ paste: truncated }), cwd })), 'truncated paste', /does not contain the exact bytes/);
});

test('re-rendered paste (one word changed) -> deny', () => {
  const cwd = newProject();
  const rerendered = PLAN_TEXT.replace('Step two', 'Step 2');
  assert.notEqual(rerendered, PLAN_TEXT);
  assertDeny(run(payload({ prompt: spawnPrompt({ paste: rerendered }), cwd })), 're-rendered paste', /does not contain the exact bytes/);
});

test('named hash does not match the file -> deny', () => {
  const cwd = newProject();
  const wrong = PLAN_HASH.replace(/^./, (c) => (c === '0' ? '1' : '0'));   // paste exact, hash altered
  const reason = assertDeny(run(payload({ prompt: spawnPrompt({ hash: wrong }), cwd })), 'hash mismatch', /hash mismatch/);
  assert.match(reason, new RegExp(PLAN_HASH), 'the deny names the computed blob id so the driver can see the real one');
});

test('pointer-only, declared degraded form, hash matches -> allow', () => {
  const cwd = newProject();
  // ⚠️ This allow is the hook NOT enforcing condition (b): the coder's own refusal remains the mechanism.
  assertAllow(run(payload({ prompt: spawnPrompt({ paste: null, declared: true }), cwd })), 'declared pointer-only');
});

test('pointer-only, declared, hash mismatch -> deny', () => {
  const cwd = newProject();
  const wrong = `${PLAN_HASH.slice(0, 20)}${PLAN_HASH.slice(0, 20)}`;
  assertDeny(run(payload({ prompt: spawnPrompt({ paste: null, declared: true, hash: wrong }), cwd })), 'declared + mismatch', /hash mismatch/);
});

test('pointer-only, NOT declared -> deny', () => {
  const cwd = newProject();
  assertDeny(run(payload({ prompt: spawnPrompt({ paste: null }), cwd })), 'undeclared pointer-only', /omitted without declaring the degraded form/);
});

test('no pointer line -> allow (ungated)', () => {
  const cwd = newProject();
  // A Plan/Verify/reviewer spawn — or a Build spawn that forgot the pointer: invisible to the hook.
  const prompt = `Run your fkit-stateful-review on the working tree. Task-id: 0999.\n\n${PLAN_TEXT}`;
  assertAllow(run(payload({ prompt, cwd })), 'no pointer');
  // A prompt quoting the SKILL.md example form (`blob c0ffee…`) is not a pointer either: not ≥7 hex.
  assertAllow(run(payload({ prompt: 'plan: ai-agents/tasks/<board>/<task>/plan.md  blob c0ffee… (git hash-object)', cwd })), 'example form');
});

test('a non-Task tool -> allow; tool_name "Agent" is gated like "Task"', () => {
  const cwd = newProject();
  const bad = spawnPrompt({ paste: PLAN_TEXT.slice(0, -40) });
  assertAllow(run(payload({ toolName: 'Bash', prompt: bad, cwd })), 'non-Task tool');
  assertAllow(run(payload({ toolName: 'Skill', prompt: bad, cwd })), 'non-Task tool');
  assertDeny(run(payload({ toolName: 'Agent', prompt: bad, cwd })), 'Agent gated');
  assertDeny(run(payload({ toolName: 'Task', prompt: bad, cwd })), 'Task (legacy alias) gated');
});

test('dangling pointer (file missing) -> deny', () => {
  const cwd = newProject({ planText: null });   // folder exists, plan.md does not
  assertDeny(run(payload({ prompt: spawnPrompt(), cwd })), 'dangling', /dangling pointer/);
  // A pointer at a directory is dangling too.
  const cwd2 = newProject({ planText: null });
  mkdirSync(join(cwd2, PLAN_REL), { recursive: true });
  assertDeny(run(payload({ prompt: spawnPrompt(), cwd: cwd2 })), 'pointer at a directory', /dangling pointer/);
});

test('gated spawn with no cwd in the payload -> deny (must be checkable)', () => {
  assertDeny(run(payload({ prompt: spawnPrompt(), omitCwd: true })), 'no cwd', /no cwd/);
});

test('absolute or ../ plan path -> deny', () => {
  const cwd = newProject();
  const abs = join(cwd, PLAN_REL);   // exists and would hash-match — still refused: path safety first
  assertDeny(run(payload({ prompt: spawnPrompt({ rel: abs }), cwd })), 'absolute path', /unsafe plan path/);
  assertDeny(run(payload({ prompt: spawnPrompt({ rel: `../${PLAN_REL}` }), cwd })), '../ path', /unsafe plan path/);
  assertDeny(run(payload({ prompt: spawnPrompt({ rel: `ai-agents/../../x/plan.md` }), cwd })), 'embedded ..', /unsafe plan path/);
});

test('escape-bearing multi-line prompt round-trips (caveat 4)', () => {
  const cwd = newProject();
  // Wrap the paste in prose that is itself full of things a quoted-run regex chokes on.
  const prompt = `Prefix with "double quotes", a back\\slash, a \t tab, a — dash and a "}" brace.\n${spawnPrompt()}\nSuffix: {"tool_input":{"prompt":"decoy"}}\n`;
  assertAllow(run(payload({ prompt, cwd })), 'escape-bearing round-trip');
  // ...and the same prompt with one escape-bearing byte of the PASTE altered is caught.
  const altered = prompt.replace('back\\slash and a tab', 'back/slash and a tab');
  assert.notEqual(altered, prompt);
  assertDeny(run(payload({ prompt: altered, cwd })), 'one escaped byte altered', /does not contain the exact bytes/);
});

test('two pointers, one bad -> deny', () => {
  const cwd = newProject();
  const rel2 = 'ai-agents/tasks/backlog/0998-other-task/plan.md';
  const text2 = '# Plan — 0998\n\n- other\n';
  mkdirSync(dirname(join(cwd, rel2)), { recursive: true });
  writeFileSync(join(cwd, rel2), text2);
  const hash2 = blobId(Buffer.from(text2));
  // both good → allow (pastes both)
  const both = `${spawnPrompt({ extraPointers: [pointer(hash2, rel2)] })}\n\n${text2}`;
  assertAllow(run(payload({ prompt: both, cwd })), 'two good pointers');
  // second pointer's hash wrong → deny, even though the first is perfect
  const oneBad = `${spawnPrompt({ extraPointers: [pointer(hash2.replace(/^./, 'f'), rel2)] })}\n\n${text2}`;
  assertDeny(run(payload({ prompt: oneBad, cwd })), 'second pointer bad', /hash mismatch/);
});

test('malformed JSON payload -> allow + stderr (fail-open, owner ruling Q3)', () => {
  for (const bad of ['', 'not json {{{', '[1,2]', '"a string"', 'null']) {
    assertSkip(run(bad), `malformed: ${JSON.stringify(bad)}`);
  }
});

test('hash prefix (>=7 hex) accepted', () => {
  const cwd = newProject();
  assertAllow(run(payload({ prompt: spawnPrompt({ hash: PLAN_HASH.slice(0, 7) }), cwd })), '7-hex prefix');
  assertAllow(run(payload({ prompt: spawnPrompt({ hash: PLAN_HASH.slice(0, 12) }), cwd })), '12-hex prefix');
  // A wrong 7-hex prefix is still a mismatch.
  const wrong7 = PLAN_HASH.slice(0, 6) + (PLAN_HASH[6] === 'a' ? 'b' : 'a');
  assertDeny(run(payload({ prompt: spawnPrompt({ hash: wrong7 }), cwd })), 'wrong 7-hex prefix', /hash mismatch/);
});

test('the plan\'s own words cannot declare the degraded form: truncated paste of a plan that says "pointer-only" -> deny', () => {
  // Found on the first smoke run against the real 0204 plan.md, which says "pointer-only" seven times:
  // with the declaration scanned over the WHOLE prompt, a truncated paste of it was allowed. The
  // declaration must come from the driver, outside the pasted file's own lines.
  const selfDescribing = [
    '# Plan — 0997: a plan about carries',
    '',
    '- step 5: a pointer-only spawn is the degraded form; carry by reference only and say so.',
    '- step 6: truncation is never permissible.',
    '',
  ].join('\n');
  const rel = 'ai-agents/tasks/backlog/0997-self-describing/plan.md';
  const cwd = newProject({ planText: selfDescribing, rel });
  const hash = blobId(Buffer.from(selfDescribing));
  assertAllow(run(payload({ prompt: spawnPrompt({ hash, rel, paste: selfDescribing }), cwd })), 'whole paste');
  assertDeny(run(payload({ prompt: spawnPrompt({ hash, rel, paste: selfDescribing.slice(0, -30) }), cwd })), 'truncated self-describing paste', /does not contain the exact bytes/);
  assertDeny(run(payload({ prompt: spawnPrompt({ hash, rel, paste: null }), cwd })), 'pointer-only, undeclared, plan mentions the words', /omitted without declaring/);
  // ...while the DRIVER's own declaration, outside the file's lines, still works.
  assertAllow(run(payload({ prompt: spawnPrompt({ hash, rel, paste: null, declared: true }), cwd })), 'driver-declared');
});

test('trailing newline is part of the bytes: a trimmed paste -> deny', () => {
  const cwd = newProject();
  // ⚠️ Only when nothing re-supplies it: with the END fence on its own line, the line break before the
  // fence puts the file's final newline back and the carry is byte-complete again (that is what
  // spawnPrompt() does, and it allows). So put the fence on the SAME line as the trimmed paste.
  const prompt = `${spawnPrompt({ paste: null })}\n---BEGIN plan.md (verbatim)---\n${PLAN_TEXT.trimEnd()} ---END plan.md---`;
  assertDeny(run(payload({ prompt, cwd })), 'trimmed paste', /does not contain the exact bytes/);
  const refenced = `${spawnPrompt({ paste: null })}\n---BEGIN plan.md (verbatim)---\n${PLAN_TEXT.trimEnd()}\n---END plan.md---`;
  assertAllow(run(payload({ prompt: refenced, cwd })), 'fence on its own line re-supplies the newline');
});

test('a paste cut mid-line right after "pointer-only" cannot self-declare (review R1): -> deny', () => {
  // The tool-cap truncation shape: the tail of the output is gone, leaving a PARTIAL last line. Before the
  // prefix rule, that partial line was not in the file's line set, so it was scanned as driver text, its
  // "pointer-only" declared the degraded form, and the truncated paste was ALLOWED.
  const selfDescribing = [
    '# Plan — 0996: a plan about carries',
    '',
    '- step 5: a pointer-only spawn is the degraded form; carry by reference only and say so.',
    '- step 6: truncation is never permissible.',
    '',
  ].join('\n');
  const rel = 'ai-agents/tasks/backlog/0996-cut-mid-line/plan.md';
  const cwd = newProject({ planText: selfDescribing, rel });
  const hash = blobId(Buffer.from(selfDescribing));
  const at = (needle) => selfDescribing.indexOf(needle) + needle.length;
  for (const cut of [at('pointer-only'), at('pointer-only spawn'), at('by reference only')]) {
    const paste = selfDescribing.slice(0, cut);
    assert.ok(!selfDescribing.split('\n').includes(paste.split('\n').pop()), 'the cut must leave a partial line');
    assertDeny(run(payload({ prompt: spawnPrompt({ hash, rel, paste }), cwd })), `cut at byte ${cut}`, /does not contain the exact bytes/);
  }
  // The prefix rule must not eat the DRIVER's own declaration: a real declared pointer-only spawn still allows.
  assertAllow(run(payload({ prompt: spawnPrompt({ hash, rel, paste: null, declared: true }), cwd })), 'driver-declared');
  // PREFIX_MIN pinned at its floor (review R10): a file line that BEGINS with the 12-char literal, cut after
  // exactly 12 chars, leaves the partial line `pointer-only`. PREFIX_MIN = 12 counts it as file content
  // (deny); any larger floor would scan it as driver text and allow. The cuts above all leave ≥ 25 chars.
  const atFloor = [
    '# Plan — 0996b: a plan that opens a line with the literal',
    '',
    'pointer-only spawns are the degraded form; say so in the prompt.',
    '- step 6: truncation is never permissible.',
    '',
  ].join('\n');
  const relF = 'ai-agents/tasks/backlog/0996b-at-floor/plan.md';
  const cwdF = newProject({ planText: atFloor, rel: relF });
  const hashF = blobId(Buffer.from(atFloor));
  const pasteF = atFloor.slice(0, atFloor.indexOf('pointer-only') + 12);
  assert.equal(pasteF.split('\n').pop(), 'pointer-only', 'the cut must leave exactly the 12-char literal');
  assertDeny(run(payload({ prompt: spawnPrompt({ hash: hashF, rel: relF, paste: pasteF }), cwd: cwdF })), 'cut leaving exactly `pointer-only`', /does not contain the exact bytes/);
});

test('a near-miss pointer line is not gated but is loud on stderr (review R3)', () => {
  const cwd = newProject();
  const truncated = PLAN_TEXT.slice(0, -40);
  const shapes = {
    'uppercase hex': `plan: ${PLAN_REL}  blob ${PLAN_HASH.toUpperCase()} (git hash-object)`,
    'non-hex char glued to the hash': `plan: ${PLAN_REL}  blob ${PLAN_HASH}g (git hash-object)`,
    'bullet prefix': `- plan: ${PLAN_REL}  blob ${PLAN_HASH} (git hash-object)`,
    'capitalised Plan:': `Plan: ${PLAN_REL}  blob ${PLAN_HASH} (git hash-object)`,
  };
  for (const [name, line] of Object.entries(shapes)) {
    const r = run(payload({ prompt: `Caller: x\n${line}\n\n${truncated}`, cwd }));
    assertAllow(r, `near-miss (${name}) stays ungated, per Q1`);
    assert.match(r.err, /carry-check-hook: WARNING — 1 line\(s\) look like a plan pointer/, `near-miss (${name}) must be loud`);
    assert.doesNotMatch(r.err, /DENY/, `near-miss (${name}) is not a deny`);
  }
  // A well-formed pointer emits no warning; a prompt with no pointer-like line at all is silent.
  const clean = run(payload({ prompt: spawnPrompt(), cwd }));
  assertAllow(clean, 'well-formed');
  assert.equal(clean.err, '', 'a well-formed pointer must not warn');
});

test('a pointer-form line inside the pasted plan is content, not a second gate (review R7)', () => {
  // A plan that quotes another task's real pointer line. Carried faithfully, it must allow — even when
  // the quoted pointer's file does not exist here (it is content, so it is not resolved).
  const quoting = [
    '# Plan — 0995: builds on 0994',
    '',
    'The approved 0994 plan this depends on:',
    `plan: ai-agents/tasks/done/0994-earlier/plan.md  blob ${PLAN_HASH} (git hash-object)`,
    '',
    '- do the thing',
    '',
  ].join('\n');
  const rel = 'ai-agents/tasks/backlog/0995-quoting/plan.md';
  const cwd = newProject({ planText: quoting, rel });
  const hash = blobId(Buffer.from(quoting));
  assertAllow(run(payload({ prompt: spawnPrompt({ hash, rel, paste: quoting }), cwd })), 'faithful carry of a quoting plan');
  // The top-level pointer is still checked in full: a truncated paste of the quoting plan denies …
  assertDeny(run(payload({ prompt: spawnPrompt({ hash, rel, paste: quoting.slice(0, -10) }), cwd })), 'truncated quoting plan', /does not contain the exact bytes/);
  // … and so does a wrong top-level hash.
  assertDeny(run(payload({ prompt: spawnPrompt({ hash: hash.replace(/^./, (c) => (c === '0' ? '1' : '0')), rel, paste: quoting }), cwd })), 'wrong top-level hash', /hash mismatch/);
  // A cut that lands INSIDE the quoted pointer line leaves a line that still parses as a pointer but is
  // no longer a file line — so it is gated, and dangles: fail-closed, never a silent pass.
  const cutInPointer = quoting.slice(0, quoting.indexOf('(git hash-object)') + 5);
  assertDeny(run(payload({ prompt: spawnPrompt({ hash, rel, paste: cutInPointer }), cwd })), 'cut inside the quoted pointer', /dangling pointer/);
  // ⚠️ Residual of the line-set narrowing: the hook cannot tell WHERE a line sits. The very same line
  // placed outside the paste as driver text is still byte-identical to a file line, so it is content and
  // is not gated (allow). A second pointer that differs by a byte — here a shorter hash prefix — is
  // driver text, is gated, and dangles.
  const sameLine = `${spawnPrompt({ hash, rel, paste: quoting })}\nplan: ai-agents/tasks/done/0994-earlier/plan.md  blob ${PLAN_HASH} (git hash-object)`;
  assertAllow(run(payload({ prompt: sameLine, cwd })), 'byte-identical line outside the paste is still content');
  const differentLine = `${spawnPrompt({ hash, rel, paste: quoting })}\nplan: ai-agents/tasks/done/0994-earlier/plan.md  blob ${PLAN_HASH.slice(0, 12)} (git hash-object)`;
  assertDeny(run(payload({ prompt: differentLine, cwd })), 'a different pointer line as driver text is gated', /dangling pointer/);
});

// Two plans on disk for the R8 / R9 shapes: a TARGET plan and a second plan that is pasted alongside it.
function twoPlans({ target, other, targetRel = 'ai-agents/tasks/backlog/0999-target/plan.md', otherRel = 'ai-agents/tasks/done/0998-other/plan.md' }) {
  const cwd = newProject({ planText: target, rel: targetRel });
  mkdirSync(dirname(join(cwd, otherRel)), { recursive: true });
  writeFileSync(join(cwd, otherRel), other);
  return { cwd, targetRel, otherRel, targetHash: blobId(Buffer.from(target)), otherHash: blobId(Buffer.from(other)) };
}

test('a plan dropped as content still has its lines subtracted from the declaration scan (review R8): -> deny', () => {
  // Regression from the R7 narrowing: `fileLines` was built from GATED pointers only. A target plan that
  // quotes another plan's pointer line makes that pointer content (not gated), so the other plan's file was
  // no longer subtracted — and a faithful paste of it, saying "pointer-only", declared the degraded form on
  // the driver's behalf, letting a TRUNCATED target through. The subtraction now covers every readable file.
  const otherRel = 'ai-agents/tasks/done/0998-other/plan.md';
  const other = '# Plan — 0998\n\n- a pointer-only spawn is the degraded form; say so.\n';
  const otherHash = blobId(Buffer.from(other));
  const target = `# Plan — 0999: builds on 0998\n\nThe approved 0998 plan:\nplan: ${otherRel}  blob ${otherHash} (git hash-object)\n\n- do the thing\n- and the other thing\n`;
  const { cwd, targetRel, targetHash } = twoPlans({ target, other, otherRel });
  const truncated = target.slice(0, -10);
  // Faithful target + the other plan pasted as context → allow (the legitimate shape must survive the fix).
  assertAllow(run(payload({ prompt: `${spawnPrompt({ hash: targetHash, rel: targetRel, paste: target })}\n\nContext (0998):\n${other}`, cwd })), 'faithful target + context');
  // The reproduced shape: truncated target + faithful paste of the other plan → deny.
  assertDeny(run(payload({ prompt: `${spawnPrompt({ hash: targetHash, rel: targetRel, paste: truncated })}\n\nContext (0998):\n${other}`, cwd })), 'truncated target + faithful other plan', /does not contain the exact bytes/);
  // Same with the other plan's pointer ALSO written by the driver → deny.
  assertDeny(run(payload({ prompt: `${spawnPrompt({ hash: targetHash, rel: targetRel, paste: truncated, extraPointers: [pointer(otherHash, otherRel)] })}\n\n${other}`, cwd })), 'other pointer driver-written too', /does not contain the exact bytes/);
  // The driver's own declaration is still honoured: it is not a line of either file.
  assertAllow(run(payload({ prompt: `${spawnPrompt({ hash: targetHash, rel: targetRel, paste: null, declared: true })}\n\nContext (0998):\n${other}`, cwd })), 'driver-declared, other plan as context');
});

test('the target is un-gated when a pasted sibling plan on disk quotes its pointer line (review R9, documented residual)', () => {
  // ⚠️ Documented behaviour, not a guarantee (accepted residual R7/R9 of 0204): the hook cannot tell WHOSE a
  // pointer line is. A sibling plan on disk that quotes the target's CURRENT pointer line, pasted faithfully
  // in the same spawn, makes the target's own pointer content — so a truncated target is allowed. Pinned so
  // a change here is a deliberate, visible one. Reachability: needs the sibling to quote the target's live
  // hash and be pasted in the same spawn.
  const target = '# Plan — 0999: the target\n\n- do the thing\n- and the other thing\n';
  const targetRel = 'ai-agents/tasks/backlog/0999-target/plan.md';
  const targetHash = blobId(Buffer.from(target));
  const sibling = `# Plan — 0997: a sibling\n\nSibling of:\nplan: ${targetRel}  blob ${targetHash} (git hash-object)\n\n- sibling work\n`;
  const { cwd, otherRel: siblingRel, otherHash: siblingHash } = twoPlans({ target, other: sibling, targetRel, otherRel: 'ai-agents/tasks/backlog/0997-sibling/plan.md' });
  const truncated = target.slice(0, -10);
  const withSibling = `${spawnPrompt({ hash: targetHash, rel: targetRel, paste: truncated })}\n${pointer(siblingHash, siblingRel)}\n\n${sibling}`;
  assertAllow(run(payload({ prompt: withSibling, cwd })), 'residual: sibling quoting the target un-gates it');
  // Controls: without the sibling → deny; sibling pointer without its paste → deny (the sibling is gated).
  assertDeny(run(payload({ prompt: spawnPrompt({ hash: targetHash, rel: targetRel, paste: truncated }), cwd })), 'no sibling', /does not contain the exact bytes/);
  assertDeny(run(payload({ prompt: `${spawnPrompt({ hash: targetHash, rel: targetRel, paste: truncated })}\n${pointer(siblingHash, siblingRel)}`, cwd })), 'sibling pointer, no paste', /does not contain the exact bytes/);
});

test('a near-miss line that is itself plan content does not warn (review R11)', () => {
  // A plan that quotes the pointer FORM (this task's own plan.md does) is carried faithfully on every
  // Build; the WARNING is for a mis-typed DRIVER line, so content lines are excluded from it.
  const formQuoting = [
    '# Plan — 0993: about pointers',
    '',
    'The pointer form is `plan: <path>/plan.md  blob <hash>` on one line.',
    '- step.',
    '',
  ].join('\n');
  const rel = 'ai-agents/tasks/backlog/0993-form-quoting/plan.md';
  const cwd = newProject({ planText: formQuoting, rel });
  const hash = blobId(Buffer.from(formQuoting));
  const clean = run(payload({ prompt: spawnPrompt({ hash, rel, paste: formQuoting }), cwd }));
  assertAllow(clean, 'faithful carry of a form-quoting plan');
  assert.equal(clean.err, '', 'a near-miss line inside the carried plan must not warn');
  // A real near-miss DRIVER line alongside the same carried plan still warns — and counts only itself.
  const withDriverNearMiss = run(payload({ prompt: `Plan: ${rel}  blob ${hash} (git hash-object)\n${spawnPrompt({ hash, rel, paste: formQuoting })}`, cwd }));
  assertAllow(withDriverNearMiss, 'driver near-miss + faithful carry');
  assert.match(withDriverNearMiss.err, /WARNING — 1 line\(s\) look like a plan pointer/, 'the driver near-miss still warns, counting only itself');
  // A truncated carry that cuts the form-quoting line out still denies: the exclusion touches the warning only.
  assertDeny(run(payload({ prompt: spawnPrompt({ hash, rel, paste: formQuoting.slice(0, 20) }), cwd })), 'truncated form-quoting plan', /does not contain the exact bytes/);
});

test('a driver near-miss line byte-identical to, or a >=12-char prefix of, a content line is silent too (review R14, documented residual)', () => {
  // ⚠️ Documented behaviour, not a guarantee (accepted residual R7/R9/R14 of 0204): the R11 exclusion is
  // position-blind — `isFileContent` cannot tell WHOSE a line is. A driver that copies a mis-formed pointer
  // line out of the carried plan (or a ≥ PREFIX_MIN prefix of it) gets no WARNING; before R11 it warned
  // (count 2). The decision is unchanged either way (Q1). Pinned so a change here is deliberate and visible.
  const contentLine = 'The pointer form is `plan: <path>/plan.md  blob <hash>` on one line.';
  const formQuoting = ['# Plan — 0992: about pointers', '', contentLine, '- step.', ''].join('\n');
  const rel = 'ai-agents/tasks/backlog/0992-form-quoting/plan.md';
  const cwd = newProject({ planText: formQuoting, rel });
  const hash = blobId(Buffer.from(formQuoting));
  const withDriver = (line, paste = formQuoting) => `Caller: x\n${line}\n${spawnPrompt({ hash, rel, paste })}`;
  // The residual, both shapes: identical line, and a prefix that still has the near-miss shape (ends at `blob`).
  const prefix = contentLine.slice(0, contentLine.indexOf('blob') + 4);
  assert.ok(prefix.length >= 12 && contentLine.startsWith(prefix), 'the prefix must be a ≥ 12-char prefix of the content line');
  for (const [name, line] of [['identical', contentLine], ['prefix', prefix]]) {
    const r = run(payload({ prompt: withDriver(line), cwd }));
    assertAllow(r, `driver repeats a content near-miss line (${name})`);
    assert.equal(r.err, '', `residual: the copied ${name} line draws no WARNING`);
  }
  // Controls, one byte different — neither a file line nor a prefix of one → warns once (proves both driver
  // lines above are near-miss-shaped, so the silence is the exclusion, not the regex).
  for (const [name, line] of [['identical', contentLine.replace(/\.$/, '!')], ['prefix', prefix.replace('form', 'Form')]]) {
    const r = run(payload({ prompt: withDriver(line), cwd }));
    assertAllow(r, `one byte different (${name})`);
    assert.match(r.err, /WARNING — 1 line\(s\) look like a plan pointer/, `one byte different (${name}) warns, count 1`);
  }
  // Warning-only: the same copied line with a truncated carry still denies.
  assertDeny(run(payload({ prompt: withDriver(contentLine, formQuoting.slice(0, 20)), cwd })), 'copied line + truncated carry', /does not contain the exact bytes/);
});

test('a plan that quotes its OWN pointer stays gated — the mutual-quote guard is load-bearing (review R12)', () => {
  // PRECOMPUTED fixture: a plan whose text quotes its own pointer with a 7-hex prefix of its own blob id.
  // Under Q4 (prefix match) that needs no fixpoint, only a nonce search — found in 170 s single-core
  // (2026-08-26; the search is ~2^28 sha1, so it is NOT run here). Not reachable by accident; reachable
  // deliberately. With the fixture in a spawn, the driver's top-level pointer and the identical quoted line
  // parse as two pointers that vouch for each other; WITHOUT the guard in pass 1b both are dropped as
  // content, nothing is gated, and a truncated (or omitted) paste passes.
  const rel = 'ai-agents/tasks/backlog/0993-self-quoting/plan.md';
  const selfQuoting = `# Plan — 0993: a plan that quotes its own pointer\n\nplan: ${rel}  blob 03af16b (git hash-object)\n\n- step: nonce 7\n`;
  const hash = blobId(Buffer.from(selfQuoting));
  assert.equal(hash, '03af16b3fb382ef85adf4513f7c68f0225e76575', 'fixture drift: the plan text no longer hashes to the id it quotes');
  assert.ok(hash.startsWith('03af16b'), 'the quoted 7-hex prefix must match the blob id');
  const cwd = newProject({ planText: selfQuoting, rel });
  // The driver's pointer line is byte-identical to the quoted one (7-hex, no trailing text difference).
  const ptr = `plan: ${rel}  blob 03af16b (git hash-object)`;
  const withPaste = (paste) => `Caller: x\n${ptr}\n\n---BEGIN plan.md (verbatim)---\n${paste}\n---END plan.md---`;
  assertAllow(run(payload({ prompt: withPaste(selfQuoting), cwd })), 'faithful carry of the self-quoting plan');
  assertDeny(run(payload({ prompt: withPaste(selfQuoting.slice(0, -6)), cwd })), 'truncated self-quoting plan must still be gated', /does not contain the exact bytes/);
  assertDeny(run(payload({ prompt: `Caller: x\n${ptr}`, cwd })), 'pointer-only, undeclared, self-quoting plan', /omitted without declaring/);
});
