// Per-run Codex prompt path guard — task 0385.
//
// THE RULE THIS FILE GUARDS. Every review procedure used to write the Codex prompt to one fixed file,
// `.fkit/tmp/adversarial-prompt.md`. Two reviews running at once overwrote each other and Codex then
// reviewed the wrong diff with no error. Each run now resolves its own path, unique by a run id (UTC
// time + shell process number) printed by one command that the three review skills carry byte-identically.
// This file pins:
//   1. no file under claude/ carries the old fixed literal;
//   2. each of the three skills carries the hazard line, its own path shape, and the branch-label rule
//      (the label sits inside the run-id command's double-quoted echo, so an unsanitised `$(…)` would run);
//   3. the run-id command is the same line, exactly once, in all three skills;
//   4. every `.fkit/tmp/…adversarial-prompt.md` path under claude/ carries `<run-id>` (or is the
//      run-id command's own path) — so a different fixed name cannot slip in;
//   5. every run line and heredoc that names a prompt path quotes it (a branch label is shell text);
//   6. the prompt heredoc ends on a per-run marker, never a fixed one: an inlined file's own `EOF`
//      line would cut the prompt short and run the rest as shell commands. fkit-review (which
//      fkit-stateful-review reuses) must name the same marker or the Write tool.
// Control arms run the same checkers on mutated in-memory copies and must fail.
//
// ⚠️ It guards SOURCE TEXT only, never runtime obedience: a green run says the words sit where they
// should, not that a reviewer resolves the path once and reuses it. It reads claude/ only (so it needs
// no test:docs entry).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { REPO } from './harness.mjs';

const REVIEW = 'claude/skills/fkit-review/SKILL.md';
const STATEFUL = 'claude/skills/fkit-stateful-review/SKILL.md';
const ADV = 'claude/skills/fkit-adversarial-review/SKILL.md';
const SKILLS = [REVIEW, STATEFUL, ADV];

const OLD_LITERAL = '.fkit/tmp/adversarial-prompt.md';
const HAZARD =
  '⚠️ **One prompt file per run — never a shared name.** Codex does not fail on a prompt another ' +
  'review overwrote: it returns a confident, well-formed review of the wrong diff, and no degradation ' +
  'branch fires.';
const LABEL_RULE = 'every character outside `A–Z a–z 0–9 . _ -` replaced by `-`';
const COMMAND =
  'mkdir -p .fkit/tmp && echo ".fkit/tmp/<key>-$(date -u +%Y%m%dT%H%M%SZ)-$$-adversarial-prompt.md"';
const COMMAND_PATH = '.fkit/tmp/<key>-$(date -u +%Y%m%dT%H%M%SZ)-$$-adversarial-prompt.md';
const SHAPE = {
  [REVIEW]: '.fkit/tmp/<key>-<run-id>-adversarial-prompt.md',
  [STATEFUL]: '.fkit/tmp/<key>-r<N>-<run-id>-adversarial-prompt.md',
  [ADV]: '.fkit/tmp/<key>-<run-id>-adversarial-prompt.md',
};

// A read error must not pass as "text missing".
function read(rel) {
  return readFileSync(join(REPO, rel), 'utf8');
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

const flat = (s) => s.replace(/\s+/g, ' ');

// Backticks and double quotes bound a path in markdown and shell; the command path contains spaces.
const PATH_RE = /\.fkit\/tmp\/[^\n`"]*?adversarial-prompt\.md/g;

function oldLiteralHits(files) {
  return Object.entries(files).filter(([, text]) => text.includes(OLD_LITERAL)).map(([f]) => f);
}

function skillProblems(files) {
  const problems = [];
  for (const f of SKILLS) {
    const t = flat(files[f]);
    if (!t.includes(HAZARD)) problems.push(`${f}: hazard line missing`);
    if (!t.includes(SHAPE[f])) problems.push(`${f}: shape ${SHAPE[f]} missing`);
    if (!t.includes(LABEL_RULE)) problems.push(`${f}: branch-label rule missing`);
  }
  return problems;
}

function commandProblems(files) {
  const problems = [];
  for (const f of SKILLS) {
    const lines = files[f].split('\n').map((l) => l.trim()).filter((l) => l.includes('$(date -u'));
    if (lines.length !== 1) problems.push(`${f}: ${lines.length} run-id command lines, want 1`);
    else if (lines[0] !== COMMAND) problems.push(`${f}: run-id command differs: ${lines[0]}`);
  }
  return problems;
}

function unboundPaths(files) {
  const bad = [];
  for (const [f, text] of Object.entries(files)) {
    for (const m of text.match(PATH_RE) ?? []) {
      if (!m.includes('<run-id>') && m !== COMMAND_PATH) bad.push(`${f}: ${m}`);
    }
  }
  return bad;
}

function unquotedRunLines(files) {
  const bad = [];
  for (const [f, text] of Object.entries(files)) {
    for (const line of text.split('\n')) {
      if (!line.includes('adversarial-prompt.md')) continue;
      if (/codex exec\b/.test(line) && !/ - < "\.fkit\/tmp\//.test(line)) bad.push(`${f}: ${line.trim()}`);
      if (/\bcat >/.test(line) && !/cat > "\.fkit\/tmp\//.test(line)) bad.push(`${f}: ${line.trim()}`);
    }
  }
  return bad;
}

const MARKER = "<<'FKIT_PROMPT_<run-id>'";
const MARKER_CLOSE = 'closed by the line `FKIT_PROMPT_<run-id>`';
const REVIEW_WRITE_RULE =
  "Write the prompt with the Write tool, or through a Bash heredoc closed by the same per-run marker as " +
  "fkit-adversarial-review (`<<'FKIT_PROMPT_<run-id>'` … `FKIT_PROMPT_<run-id>`) — never a fixed marker such as `EOF`";

function heredocMarkerProblems(files) {
  const bad = [];
  const heredocs = Object.entries(files).flatMap(([f, text]) =>
    text.split('\n').filter((l) => /\bcat >/.test(l) && l.includes('adversarial-prompt.md')).map((l) => [f, l]));
  if (!heredocs.some(([f]) => f === ADV)) bad.push(`${ADV}: no prompt heredoc line`);
  for (const [f, line] of heredocs) {
    if (!line.includes(MARKER)) bad.push(`${f}: heredoc marker is not ${MARKER}: ${line.trim()}`);
  }
  if (!flat(files[ADV]).includes(MARKER_CLOSE)) bad.push(`${ADV}: closing marker line missing`);
  if (!flat(files[REVIEW]).includes(REVIEW_WRITE_RULE)) bad.push(`${REVIEW}: prompt write rule missing`);
  return bad;
}

const CORPUS = Object.fromEntries(walk(join(REPO, 'claude')).map((p) => [relative(REPO, p), readFileSync(p, 'utf8')]));
const mutate = (f, fn) => ({ ...CORPUS, [f]: fn(CORPUS[f]) });

test('1. no file under claude/ carries the old fixed prompt path', () => {
  assert.ok(SKILLS.every((f) => f in CORPUS), 'a review skill is missing from the walked corpus');
  assert.deepEqual(oldLiteralHits(CORPUS), []);
});

test('2. each review skill carries the hazard line, its own path shape and the branch-label rule', () => {
  assert.deepEqual(skillProblems(CORPUS), []);
});

test('3. the run-id command is one identical line in all three skills', () => {
  assert.deepEqual(commandProblems(CORPUS), []);
  assert.ok(SKILLS.every((f) => read(f).includes(COMMAND)));
});

test('4. every prompt path under claude/ carries <run-id>', () => {
  const paths = Object.values(CORPUS).flatMap((t) => t.match(PATH_RE) ?? []);
  assert.ok(paths.length >= 6, `expected the skills' and README's paths, found ${paths.length}`);
  assert.deepEqual(unboundPaths(CORPUS), []);
});

test('5. every run line and heredoc that names a prompt path quotes it', () => {
  assert.deepEqual(unquotedRunLines(CORPUS), []);
});

test('6. the prompt heredoc ends on a per-run marker, never a bare EOF (fkit-review included)', () => {
  assert.deepEqual(heredocMarkerProblems(CORPUS), []);
});

test('control arms: each checker fails on a mutated copy', () => {
  const swap = (f, from, to) => mutate(f, (t) => {
    assert.ok(t.includes(from), `control-arm setup: ${f} lacks ${from}`);
    return t.split(from).join(to);
  });
  const runLine = '- < ".fkit/tmp/<key>-<run-id>-adversarial-prompt.md"';

  assert.notDeepEqual(oldLiteralHits(mutate('claude/README.md', (t) => `${t}\n${OLD_LITERAL}\n`)), []);
  assert.notDeepEqual(skillProblems(swap(STATEFUL, '**One prompt file per run', '**Prompt file')), []);
  assert.notDeepEqual(skillProblems(swap(ADV, SHAPE[ADV], '.fkit/tmp/<key>-adversarial-prompt.md')), []);
  assert.notDeepEqual(skillProblems(swap(STATEFUL, 'every character outside `A–Z a–z 0–9 . _ -`', 'every character')), []);
  assert.notDeepEqual(commandProblems(swap(ADV, '+%Y%m%dT%H%M%SZ)-$$', '+%s)')), []);
  assert.notDeepEqual(unboundPaths(swap(REVIEW, SHAPE[REVIEW], '.fkit/tmp/fixed-adversarial-prompt.md')), []);
  assert.notDeepEqual(unboundPaths(mutate('claude/README.md', (t) => `${t}\n\`.fkit/tmp/fixed-adversarial-prompt.md\`\n`)), []);
  assert.notDeepEqual(unquotedRunLines(swap(REVIEW, runLine, '- < .fkit/tmp/<key>-<run-id>-adversarial-prompt.md')), []);
  assert.notDeepEqual(unquotedRunLines(swap(ADV, 'cat > ".fkit/tmp/', 'cat > .fkit/tmp/')), []);
  assert.notDeepEqual(heredocMarkerProblems(swap(ADV, MARKER, "<<'EOF'")), []);
  assert.notDeepEqual(heredocMarkerProblems(swap(ADV, MARKER_CLOSE, 'closed by the line `EOF`')), []);
  assert.notDeepEqual(heredocMarkerProblems(swap(REVIEW, "(`<<'FKIT_PROMPT_<run-id>'`", "(`<<'EOF'`")), []);
});
