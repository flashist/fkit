// The SKILL.md / agent frontmatter guard — task 0136.
//
// SCOPE: the same FOURTH test-scope category as test/task-id-uniqueness.test.js and
// test/adr-number-uniqueness.test.js — an invariant over the repo's own shipped content rather than
// over product behavior. ADR-014 §2 fenced the scope at two things; ADR-017 rule 4 widened it to a
// third; task-id-uniqueness.test.js's header records the fourth. This suite is a third instance of
// the fourth, not a fifth category, so the widening is cited rather than re-argued.
//
// WHY IT EXISTS — a silent failure that actually happened, during task 0123. The coder put a colon on
// a CONTINUATION line of a multi-line YAML `description:`. The frontmatter stopped parsing and Claude
// Code's skill listing fell back to the file's H1 as the description. Nothing errored, no test went
// red, 511 tests stayed green, and the only signal was the listing text changing — noticed by eye.
//
// WHAT TASK 0136 DID, AND WHY THE ASSERTION IS STRUCTURAL. All 25 skill descriptions were converted
// from a bare PLAIN scalar to a `>-` folded block scalar, the shape all 7 `claude/agents/*.md` files
// already used. Inside a block scalar a colon is just text, so the whole hazard class disappears
// rather than one instance of it being tested. That is 0123 review R5: the STRUCTURE is the
// guarantee. A colon-hunting regex would only ever chase one token — R4 established that three skill
// files carried a same-line `": "` that strict YAML rejects and the loader happened to tolerate, so
// "does it contain a colon" was never the right question.
//
// ⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT — read this before trusting it.
//   * It reads FRONTMATTER ONLY. A skill's BODY — the procedure itself, which is the entire point of
//     the file — remains untested by anything in this repo. Do NOT read a green run here as coverage
//     of skill behaviour. 0123's 511-passing suite proved no regression; it did not prove the change.
//   * It is NOT the loader. Claude Code's own parser is what actually renders a description, and no
//     test in this repo can substitute for it. This file reads the bytes; the loader is the authority.
//   * Violation 5 (a de-indented continuation line ended the scalar early) is detected by asking
//     whether the column-0 line that closed the block is one of the five KNOWN frontmatter keys.
//     Round-1 review R2 NARROWED this blind spot: the check used to accept ANY well-formed `word:`
//     line, so a de-indented continuation line that happened to begin `note: …` read as a real key and
//     was not caught at all. What remains is far smaller — a de-indented line beginning with one of
//     `name:` `description:` `color:` `initialPrompt:` `tools:` is still indistinguishable from that
//     key actually being declared. ⚠️ That remainder is NOT inherent to the problem: a real YAML
//     parser would close it outright. What rules that out is ADR-014's zero-devDeps policy
//     (`package.json` has no `devDependencies` and this task added none — block scalars are what make
//     hand-rolling tractable, which is why the conversion came first). It is revisitable the day that
//     policy is.
//
// ⚠️ NON-VACUITY IS LOAD-BEARING. "Every discovered file conforms" passes trivially over zero
// discovered files. If claude/skills/ or claude/agents/ moves or is renamed, this must go RED, not
// green — hence the explicit count assertions before every corpus check. Round-1 review R6: those
// assertions are EXACT COUNTS, not `> 0`, because `> 0` is green over a PARTIAL corpus — 24 of the 25
// skills could vanish and nothing here would notice. Nothing else in the repo reconciles this
// inventory against disk either (skill-ownership-hook.test.js's ALL_SKILLS is a hardcoded list, not a
// readdir), so this is the only place a partial disappearance can be caught.
//
// THIS TEST READS THE REPO, read-only. Every fixture lives under os.tmpdir(); harness.mjs:9's rule
// ("nothing here writes into the repo") is intact.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO, cleanup } from './harness.mjs';

const MADE = [];
after(() => MADE.forEach(cleanup));

// FKIT_FRONTMATTER_ROOT lets the red-gate (prove-red.sh) point this suite at a deliberately-broken
// COPY of claude/ without touching the real tree — the same seam FKIT_LAUNCHER and
// FKIT_SKILL_OWNERSHIP_HOOK provide for their suites. Defaults to the real tree for `npm test`.
// ⚠️ Announce a non-default root to stderr, same reasoning as harness.mjs's FKIT_LAUNCHER guard: a
// STALE inherited FKIT_FRONTMATTER_ROOT would otherwise make `npm test` silently audit some other
// tree and report green while the real skills are broken.
const DEFAULT_ROOT = join(REPO, 'claude');
const ROOT = process.env.FKIT_FRONTMATTER_ROOT || DEFAULT_ROOT;
if (ROOT !== DEFAULT_ROOT) {
  process.stderr.write(`[skill-frontmatter.test.js] ⚠ auditing NON-default tree via FKIT_FRONTMATTER_ROOT: ${ROOT}\n`);
}

// ── The pure functions under test ────────────────────────────────────────────────────────────────

// "First thing in the file" means LINE 1. A leading blank line, or a BOM glued to the opening
// delimiter, is a violation — not a curiosity — because it is exactly what stops the loader seeing
// frontmatter at all.
function splitFrontmatter(text) {
  const lines = text.split('\n');
  if (lines[0] !== '---') {
    return { ok: false, reason: 'line 1 must be exactly `---` — frontmatter must be the FIRST thing ' +
      'in the file (a leading blank line or a byte-order mark breaks the loader)' };
  }
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') return { ok: true, lines: lines.slice(1, i) };
  }
  return { ok: false, reason: 'the frontmatter block is never closed by a second `---`' };
}

// Locate a column-0 `key:` inside the frontmatter and collect the lines that follow it up to the next
// column-0 line (blank lines belong to the block; a `---` cannot appear, splitFrontmatter cut there).
//
// ⚠️ DELIBERATELY NOT A GENERAL YAML PARSER. It answers exactly two questions — where does this key's
// value start, and what CLOSED it — and `stoppedAt` is load-bearing for that second one: the whole
// point of violation 5 is that a de-indented continuation line closes the scalar just as effectively
// as a real key does, and the only way to tell them apart is to look at the closing line.
function findKey(fmLines, key) {
  const re = new RegExp(`^${key}:`);
  for (let i = 0; i < fmLines.length; i++) {
    if (!re.test(fmLines[i])) continue;
    const cont = [];
    let stoppedAt = null;
    for (let j = i + 1; j < fmLines.length; j++) {
      if (/^[^\s]/.test(fmLines[j])) { stoppedAt = { index: j, text: fmLines[j] }; break; }
      cont.push(fmLines[j]);
    }
    return { index: i, line: fmLines[i], cont, stoppedAt };
  }
  return null;
}

// A well-formed frontmatter key declaration, capturing the key name.
const KEY_LINE = /^([A-Za-z_][A-Za-z0-9_-]*):([ \t]|$)/;

// ⚠️ THE CLOSED VOCABULARY — round-1 review R2. Only these five keys appear anywhere in the corpus:
// `name`×32, `description`×32, `color`×7, `initialPrompt`×7, `tools`×1, across all 25 skills and 7
// agents. An allowlist rather than "anything shaped like `word:`" is what stops a de-indented
// continuation line beginning `note: …` from passing itself off as a real key (see the header).
// ⚠️ ADDING A SIXTH KEY IS A DELIBERATE ACT: add it here in the same change, or E5 goes red naming it.
const KNOWN_KEYS = ['name', 'description', 'color', 'initialPrompt', 'tools'];

const keyNameOf = (line) => { const m = KEY_LINE.exec(line); return m ? m[1] : null; };
const isKnownKeyLine = (line) => KNOWN_KEYS.includes(keyNameOf(line));

// The `>-` folding rules, spelled out because every one of them is a way to change the rendered text
// by accident:
//   * base indent comes from the FIRST non-empty content line;
//   * a break between two lines at base indent folds into ONE space;
//   * a MORE-indented line is a more-indented line — its newline is PRESERVED, so one stray extra
//     space silently turns a description multi-line;
//   * a run of k blank lines between two base-indent lines becomes k newlines;
//   * a run of k blank lines NEXT TO a more-indented line becomes k+1 newlines — the break that the
//     more-indented line would have kept literally is still kept, ON TOP of the blank lines
//     (round-1 review R4: this clause was missing, so `['  one','','    two']` folded to `"one\n  two"`
//     where YAML yields `"one\n\n  two"`);
//   * a line indented LESS than base ENDS the scalar (the hazard a block scalar does not absorb);
//   * `-` chomping strips the trailing newline.
//
// ⚠️ VERIFIED AGAINST A REAL YAML LOADER, NOT AGAINST ITSELF. Every rule above was checked by
// enumerating all 363 sequences of up to five lines over {base, more-indented, blank} and comparing
// this function's output to Ruby's Psych (a real YAML 1.2 parser, available on the box, NOT a project
// dependency — ADR-014's zero-devDeps rule is untouched). 241 sequences are legal YAML and this
// function matches all 241; the other 122 are ones the parser itself rejects.
//
// ⚠️ ONE KNOWN, GUARDED LIMIT. A WHITESPACE-ONLY line indented deeper than base (e.g. three spaces
// where base is two) is a more-indented content line to YAML — `['  foo','   ','  bar']` renders
// `"foo\n \nbar"` — but this function treats every whitespace-only line as blank and yields
// `"foo\nbar"`. Not reachable undetected: clause E8 rejects any continuation line with trailing
// whitespace, which such a line is by definition. Stated rather than fixed so the match above is not
// claimed more broadly than it was tested.
function foldBlockScalar(contLines) {
  const items = [];
  let base = null;
  for (const l of contLines) {
    if (l.trim() === '') { items.push(null); continue; }
    const ind = l.match(/^[ \t]*/)[0].length;
    if (base === null) base = ind;
    if (ind < base) break;                        // less-indented → the scalar ends here
    items.push({ more: ind > base, body: l.slice(base) });
  }
  while (items.length && items[items.length - 1] === null) items.pop();   // `-` chomping
  let out = '';
  let prev = null;                                // null | 'base' | 'more' — the last CONTENT line
  let blanks = 0;                                 // blank lines pending since that content line
  for (const it of items) {
    if (it === null) { blanks++; continue; }
    if (prev === null) out += '\n'.repeat(blanks);                    // leading blank lines
    else if (blanks > 0) out += '\n'.repeat(blanks + (prev === 'more' || it.more ? 1 : 0));
    else out += (prev === 'more' || it.more) ? '\n' : ' ';
    out += it.body;
    prev = it.more ? 'more' : 'base';
    blanks = 0;
  }
  return out;
}

// Returns violation strings — one per broken rule, each prefixed with a stable E<n> code so a test
// can name the rule it means rather than matching prose that will be reworded.
//   E1 no frontmatter, or not the first thing in the file
//   E2 `name:` missing
//   E3 `description:` missing
//   E4 `description:` is not a `>-` block scalar   ← THE structural rule (R5)
//   E5 a continuation line is not indented past the key / the scalar ended early
//   E6 a continuation line is indented with a TAB
//   E7 the folded value is empty, or is not a single line
//   E8 a continuation line has TRAILING whitespace, which survives folding
//   E9 a frontmatter key is declared more than once
function auditFile(text) {
  const v = [];
  const fm = splitFrontmatter(text);
  if (!fm.ok) return [`E1 frontmatter: ${fm.reason}`];   // nothing below is checkable without it

  // E9 — a duplicate key at column 0. Round-1 review R3: a real loader keeps the LAST duplicate
  // (verified — Ruby's Psych renders `description` twice-declared as the second one), while findKey()
  // below returns the FIRST. So a second `description:` carrying a plain scalar is what actually
  // renders, and every clause after this one would inspect the `>-` block that no longer wins and
  // report nothing. Checked BEFORE the E4 early return so it survives it.
  const counts = new Map();
  for (const l of fm.lines) {
    const k = keyNameOf(l);
    if (k !== null) counts.set(k, (counts.get(k) || 0) + 1);
  }
  for (const [k, n] of counts) {
    if (n > 1) {
      v.push(`E9 frontmatter: \`${k}:\` is declared ${n} times — a YAML loader keeps the LAST one, so ` +
        'the earlier declaration this guard reads is not what renders');
    }
  }

  if (!findKey(fm.lines, 'name')) v.push('E2 name: missing from the frontmatter');

  const d = findKey(fm.lines, 'description');
  if (!d) { v.push('E3 description: missing from the frontmatter'); return v; }

  // The structural rule. Once the shape is wrong, clauses 5–7 are about a block scalar that does not
  // exist, so reporting them too would bury the one thing to fix.
  if (!/^description:[ \t]*>-[ \t]*$/.test(d.line)) {
    v.push(`E4 description: must be a >- folded block scalar, found: ${JSON.stringify(d.line)}`);
    return v;
  }

  // E5a — the line that CLOSED the scalar is at column 0 but is not a `key:` declaration, i.e. a
  // continuation line lost its indent and silently truncated the description.
  if (d.stoppedAt && !isKnownKeyLine(d.stoppedAt.text)) {
    v.push('E5 description: the block scalar was ended by a line at column 0 that is not one of the ' +
      `known frontmatter keys (${KNOWN_KEYS.join(', ')}) — either a continuation line lost its indent, ` +
      'or a new key was added and KNOWN_KEYS must be updated in the same change: ' +
      JSON.stringify(d.stoppedAt.text));
  }

  // E5b — a continuation line indented LESS than the scalar's base indent. Same defect, caught inside
  // the block rather than at its edge: the indent must be uniform, never shallower on one line.
  let base = null;
  for (const l of d.cont) {
    if (l.trim() === '') continue;
    const ind = l.match(/^[ \t]*/)[0].length;
    if (base === null) { base = ind; continue; }
    if (ind < base) {
      v.push(`E5 description: continuation line is indented ${ind}, shallower than the scalar's ` +
        `base indent of ${base} — it ends the scalar: ${JSON.stringify(l)}`);
      break;
    }
  }

  // E6 — a tab in the indent. YAML forbids tabs for indentation outright.
  for (const l of d.cont) {
    if (/^[ ]*\t/.test(l)) {
      v.push(`E6 description: continuation line is indented with a TAB: ${JSON.stringify(l)}`);
      break;
    }
  }

  // E8 — trailing whitespace on a continuation line. Round-1 review R1: this is INVISIBLE in an editor
  // and it changes what renders. Folding joins two base-indent lines with one space, so a line ending
  // in a space renders a DOUBLE space (`['  foo ','  bar']` → `"foo  bar"`); before a more-indented
  // line the space survives verbatim. Both verified against a real YAML loader. E7 cannot catch it —
  // the result is still a non-empty single line — so it needs its own clause.
  for (const l of d.cont) {
    if (/[ \t]$/.test(l)) {
      v.push('E8 description: continuation line has TRAILING whitespace, which SURVIVES folding — it ' +
        `renders as a double space, or verbatim before a more-indented line: ${JSON.stringify(l)}`);
      break;
    }
  }

  // E7 — what actually renders. Empty means the scalar carries nothing; a newline means a
  // more-indented or blank line turned one description into several.
  const folded = foldBlockScalar(d.cont);
  if (folded.length === 0) {
    v.push('E7 description: the folded value is EMPTY');
  } else if (folded.includes('\n')) {
    v.push('E7 description: the folded value is not a single line — a more-indented or blank line ' +
      `preserved a newline: ${JSON.stringify(folded)}`);
  }

  return v;
}

// ⚠️ THE FAILURE MESSAGE IS A SEPARATE FUNCTION SO IT CAN BE TESTED (the R39 lesson from
// adr-number-uniqueness.test.js). Asserting a violation is in the ARRAY leaves the rendered message
// unguarded — and the message is the entire remedy a person gets when this goes red.
function renderViolations(results) {
  return results.map(r => `  ${r.label}\n${r.violations.map(x => `    - ${x}`).join('\n')}`).join('\n');
}

// ── Discovery ────────────────────────────────────────────────────────────────────────────────────
//
// ⚠️ withFileTypes IS LOAD-BEARING, the R33 lesson from adr-number-uniqueness.test.js: a DIRECTORY
// named `fkit-something.md` under agents/ would otherwise satisfy the non-vacuity assertion while
// contributing no actual agent file — green over nothing, the exact state this header calls out.

function discoverSkillFiles(root) {
  const dir = join(root, 'skills');
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    // The R2 lesson from the task-id guard: unreadable is not the same as absent.
    throw new Error(`cannot read ${dir}: ${err.code} — the scan would be silently incomplete`, { cause: err });
  }
  return entries.filter(e => e.isDirectory())
    .map(e => ({ label: `skills/${e.name}/SKILL.md`, path: join(dir, e.name, 'SKILL.md') }))
    .filter(f => existsSync(f.path) && statSync(f.path).isFile())
    .sort((a, b) => (a.label < b.label ? -1 : 1));
}

function discoverAgentFiles(root) {
  const dir = join(root, 'agents');
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw new Error(`cannot read ${dir}: ${err.code} — the scan would be silently incomplete`, { cause: err });
  }
  return entries.filter(e => e.isFile() && e.name.endsWith('.md'))
    .map(e => ({ label: `agents/${e.name}`, path: join(dir, e.name) }))
    .sort((a, b) => (a.label < b.label ? -1 : 1));
}

function auditAll(files) {
  return files.map(f => ({ label: f.label, violations: auditFile(readFileSync(f.path, 'utf8')) }))
    .filter(r => r.violations.length > 0);
}

// ── Fixtures (os.tmpdir() only) ──────────────────────────────────────────────────────────────────

const GOOD = [
  '---',
  'name: fkit-example',
  'description: >-',
  '  A description that wraps across several lines, every continuation line indented exactly two',
  '  spaces, with a colon in it: entirely harmless inside a block scalar.',
  'color: blue',
  '---',
  '',
  '# Example',
  '',
].join('\n');

// Write one skill fixture and return its root, so tests exercise the same discovery + read path the
// live corpus uses rather than a shortcut around it.
function fixtureRoot({ skills = {}, agents = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'fkit-fm-'));
  MADE.push(root);
  for (const [n, text] of Object.entries(skills)) {
    mkdirSync(join(root, 'skills', n), { recursive: true });
    writeFileSync(join(root, 'skills', n, 'SKILL.md'), text);
  }
  for (const [n, text] of Object.entries(agents)) {
    mkdirSync(join(root, 'agents'), { recursive: true });
    writeFileSync(join(root, 'agents', n), text);
  }
  return root;
}

// Audit a single skill fixture through discovery, returning just its violation strings.
function auditOne(text) {
  const root = fixtureRoot({ skills: { 'fkit-fixture': text } });
  const files = discoverSkillFiles(root);
  assert.equal(files.length, 1, 'the fixture must be discovered, or the audit below is vacuous');
  return auditFile(readFileSync(files[0].path, 'utf8'));
}

const codes = (violations) => violations.map(v => v.slice(0, 2));

// ── Unit tests ───────────────────────────────────────────────────────────────────────────────────

test('a conforming file passes every clause', () => {
  assert.deepEqual(auditOne(GOOD), []);
});

test('E1: frontmatter must be the FIRST thing in the file — a leading blank line is a violation', () => {
  assert.deepEqual(codes(auditOne('\n' + GOOD)), ['E1']);
  assert.deepEqual(codes(auditOne('﻿' + GOOD)), ['E1'], 'a BOM glued to `---` hides it just as well');
});

test('E1: an unterminated frontmatter block is a violation', () => {
  assert.deepEqual(codes(auditOne('---\nname: x\ndescription: >-\n  y\n')), ['E1']);
});

test('E2: `name:` missing', () => {
  assert.deepEqual(codes(auditOne(GOOD.replace('name: fkit-example\n', ''))), ['E2']);
});

test('E3: `description:` missing', () => {
  assert.deepEqual(codes(auditOne('---\nname: fkit-example\ncolor: blue\n---\n\n# Example\n')), ['E3']);
});

// FIXTURE A from the brief — the shape all 25 skills had before task 0136, and the one the structural
// rule exists to reject. Note it is reported ALONE: clauses 5-7 describe a block scalar, and there
// isn't one, so listing them too would bury the single thing to fix.
test('E4: a PLAIN scalar description is rejected — the structural rule (fixture A)', () => {
  const plain = GOOD.replace(
    'description: >-\n  A description that wraps across several lines, every continuation line indented exactly two\n',
    'description: A description on one plain-scalar line\n');
  assert.deepEqual(codes(auditOne(plain)), ['E4']);
});

test('E4: a different block-scalar style is still not `>-`', () => {
  assert.deepEqual(codes(auditOne(GOOD.replace('description: >-', 'description: |-'))), ['E4']);
  assert.deepEqual(codes(auditOne(GOOD.replace('description: >-', 'description: >'))), ['E4'],
    'clipped folding keeps a trailing newline — a different rendered value');
});

// FIXTURE B from the brief — the one hazard a block scalar does NOT absorb. The de-indented line
// closes the scalar, so the description silently truncates to whatever came before it.
test('E5: a de-indented continuation line ends the scalar early (fixture B)', () => {
  const broken = GOOD.replace(
    '  spaces, with a colon in it: entirely harmless inside a block scalar.',
    'spaces, with a colon in it — this line lost its indent.');
  assert.deepEqual(codes(auditOne(broken)), ['E5']);
});

test('E5: a continuation line SHALLOWER than the base indent is caught inside the block', () => {
  const broken = GOOD.replace(
    '  spaces, with a colon in it: entirely harmless inside a block scalar.',
    ' spaces, one space instead of two.');
  assert.deepEqual(codes(auditOne(broken)), ['E5']);
});

test('E6: a TAB-indented continuation line', () => {
  const broken = GOOD.replace(
    '  spaces, with a colon in it: entirely harmless inside a block scalar.',
    '\tspaces, indented with a tab.');
  assert.ok(codes(auditOne(broken)).includes('E6'), 'the tab must be named');
});

test('E7: a MORE-indented continuation line preserves a newline — the description goes multi-line', () => {
  const broken = GOOD.replace(
    '  spaces, with a colon in it: entirely harmless inside a block scalar.',
    '    spaces, with one accidental extra pair of spaces.');
  assert.deepEqual(codes(auditOne(broken)), ['E7']);
});

test('E7: a blank line inside the scalar becomes a newline', () => {
  const broken = GOOD.replace(
    '  spaces, with a colon in it: entirely harmless inside a block scalar.',
    '\n  spaces, after a blank line.');
  assert.deepEqual(codes(auditOne(broken)), ['E7']);
});

test('E7: `description: >-` with nothing after it folds to EMPTY', () => {
  const empty = [
    '---', 'name: fkit-example', 'description: >-', 'color: blue', '---', '', '# Example', '',
  ].join('\n');
  assert.deepEqual(codes(auditOne(empty)), ['E7']);
});

// ── Round-1 review fixes (R1 · R2 · R3 · R4) ─────────────────────────────────────────────────────

// R1. The defect: trailing whitespace is invisible, it SILENTLY changes the rendered description, and
// auditFile() returned nothing at all. Assert the render consequence too, so this test still means
// something if E8's wording is ever reworded away.
test('E8: TRAILING whitespace on a continuation line — invisible, and it changes the render (R1)', () => {
  const broken = GOOD.replace(
    '  spaces, with a colon in it: entirely harmless inside a block scalar.',
    '  spaces, this line ends in a space. ');
  assert.deepEqual(codes(auditOne(broken)), ['E8']);
  assert.equal(foldBlockScalar(['  foo ', '  bar']), 'foo  bar',
    'THIS is why it matters: a DOUBLE space renders, and E7 sees a perfectly good single line');
  assert.equal(foldBlockScalar(['  foo ', '    bar']), 'foo \n  bar',
    'before a more-indented line the space survives verbatim instead');
  assert.match(auditOne(broken)[0], /TRAILING whitespace/, 'the message must name what to delete');
});

test('E8: a continuation line of nothing but spaces is trailing whitespace too', () => {
  const broken = GOOD.replace(
    '  spaces, with a colon in it: entirely harmless inside a block scalar.',
    '   \n  spaces, after a line of pure whitespace.');
  assert.ok(codes(auditOne(broken)).includes('E8'),
    'a whitespace-only line is the one shape foldBlockScalar does not model exactly — E8 is its guard');
});

// R3. The defect: findKey() returns the FIRST match, a real loader keeps the LAST, so a second
// `description:` carrying a plain scalar rendered while auditFile() returned [] — the structural rule
// defeated completely, silently.
test('E9: a SECOND `description:` is caught — the loader keeps the last one (R3)', () => {
  const dup = GOOD.replace('color: blue', 'description: a plain scalar that actually wins\ncolor: blue');
  const got = auditOne(dup);
  assert.deepEqual(codes(got), ['E9']);
  assert.match(got[0], /declared 2 times/);
  assert.match(got[0], /LAST/, 'the message must say which declaration renders, or the remedy is guesswork');
});

test('E9: a duplicate `name:` is caught by the same clause', () => {
  assert.ok(codes(auditOne(GOOD.replace('color: blue', 'name: second-name\ncolor: blue'))).includes('E9'));
});

// R2. The defect: the "did a `key:` close the scalar" test accepted ANY well-formed `word:` line, so a
// de-indented continuation line beginning `note: …` was indistinguishable from a real key. The closed
// allowlist narrows that to the five keys that actually exist.
test('E5: a de-indented line that merely LOOKS like a key is now caught (R2)', () => {
  const broken = GOOD.replace(
    '  spaces, with a colon in it: entirely harmless inside a block scalar.',
    'note: this de-indented line used to pass itself off as a real frontmatter key.');
  assert.deepEqual(codes(auditOne(broken)), ['E5'],
    '`note:` is not in KNOWN_KEYS, so it can no longer end the scalar unnoticed');
  assert.match(auditOne(broken)[0], /known frontmatter keys \(name, description, color, initialPrompt, tools\)/);
  assert.match(auditOne(broken)[0], /KNOWN_KEYS must be updated/,
    'the message must also cover the OTHER cause — a legitimately-added sixth key');
});

test('KNOWN_KEYS is the closed vocabulary, and only a member of it may end the scalar (R2)', () => {
  assert.deepEqual(KNOWN_KEYS, ['name', 'description', 'color', 'initialPrompt', 'tools']);
  assert.ok(isKnownKeyLine('color: blue'));
  assert.ok(isKnownKeyLine('tools:'), 'a key with an empty value is still a key declaration');
  assert.ok(!isKnownKeyLine('note: prose'), 'shaped like a key, but not one of ours');
  assert.ok(!isKnownKeyLine('  color: blue'), 'indented — that is scalar content, not a key');
});

// R4. `foldBlockScalar` is asserted to implement `>-`, so it has to be right on its own terms even
// where E7 would catch the consequence anyway.
test('foldBlockScalar: blank lines NEXT TO a more-indented line keep the extra break (R4)', () => {
  assert.equal(foldBlockScalar(['  one', '', '    two']), 'one\n\n  two',
    'the fold used to drop one newline here — YAML keeps the more-indented line\'s own break too');
  assert.equal(foldBlockScalar(['  one', '    two', '', '  three']), 'one\n  two\n\nthree');
  assert.equal(foldBlockScalar(['  one', '', '', '    two']), 'one\n\n\n  two', 'k blanks → k+1 breaks');
  assert.equal(foldBlockScalar(['  one', '', '  two']), 'one\ntwo',
    'between two BASE lines k blanks stay k breaks — the fix must not over-correct');
});

test('foldBlockScalar: base-indent lines join with exactly ONE space and nothing is trimmed away', () => {
  assert.equal(foldBlockScalar(['  one', '  two', '  three']), 'one two three');
  assert.equal(foldBlockScalar([]), '', 'no content lines fold to the empty string');
  assert.equal(foldBlockScalar(['  one', '', '  two']), 'one\ntwo', 'a blank line is a real newline');
  assert.equal(foldBlockScalar(['  one', '    two']), 'one\n  two',
    'a more-indented line keeps its newline AND its extra indent');
  assert.equal(foldBlockScalar(['  one', '  two', '']), 'one two', '`-` chomps the trailing newline');
});

test('findKey: `stoppedAt` reports the line that closed the block, which is how E5 tells a key from prose', () => {
  const fm = splitFrontmatter(GOOD);
  const d = findKey(fm.lines, 'description');
  assert.equal(d.cont.length, 2);
  assert.equal(d.stoppedAt.text, 'color: blue');
  assert.ok(isKnownKeyLine(d.stoppedAt.text), 'a real, KNOWN key legitimately ends the scalar');
});

// R39's lesson, applied: assert the rendered MESSAGE, not just the field. Swapping the template for
// something that drops the file label or the violation text must not leave this green.
test('renderViolations: the MESSAGE names the offending file and every violation on it', () => {
  const out = renderViolations([{ label: 'skills/fkit-broken/SKILL.md', violations: auditOne(
    GOOD.replace('description: >-', 'description: plain')) }]);
  assert.match(out, /skills\/fkit-broken\/SKILL\.md/, 'the file must be named or the remedy is a hunt');
  assert.match(out, /E4 description: must be a >- folded block scalar/);
});

test('discovery: a DIRECTORY named like an agent file is not an agent (R33)', () => {
  const root = fixtureRoot({ skills: { 'fkit-fixture': GOOD } });
  mkdirSync(join(root, 'agents', 'fkit-not-really.md'), { recursive: true });
  assert.deepEqual(discoverAgentFiles(root), [],
    'a directory must not be counted — it would defeat the non-vacuity guarantee');
});

test('discovery: a skill directory with no SKILL.md is skipped, not reported as broken', () => {
  const root = fixtureRoot({ skills: { 'fkit-fixture': GOOD } });
  mkdirSync(join(root, 'skills', 'fkit-empty'), { recursive: true });
  assert.deepEqual(discoverSkillFiles(root).map(f => f.label), ['skills/fkit-fixture/SKILL.md']);
});

test('discovery: a missing tree is empty (the non-vacuity assertions are what make that red)', () => {
  const root = mkdtempSync(join(tmpdir(), 'fkit-fm-bare-'));
  MADE.push(root);
  assert.deepEqual(discoverSkillFiles(root), []);
  assert.deepEqual(discoverAgentFiles(root), []);
});

// ── The live corpus ──────────────────────────────────────────────────────────────────────────────

// The corpus size, pinned. See the NON-VACUITY note in the header for why these are exact rather than
// `> 0`. ⚠️ THESE ARE NOT TRIPWIRES TO BUMP UNTIL GREEN — see the failure messages below.
const EXPECTED_SKILLS = 26;
const EXPECTED_AGENTS = 7;

test('live corpus: every skill SKILL.md frontmatter conforms', () => {
  const files = discoverSkillFiles(ROOT);

  // Non-vacuity first — everything below is trivially true over an empty or a THINNED corpus.
  assert.equal(files.length, EXPECTED_SKILLS,
    `discovered ${files.length} skills under ${join(ROOT, 'skills')}, expected exactly ` +
    `${EXPECTED_SKILLS} — so this scan is not clean, it is INCOMPLETE (or has grown). ZERO means the ` +
    'skill tree moved and discoverSkillFiles() must be taught the new location before this guard ' +
    'means anything.\n⚠️ If a skill was legitimately ADDED or REMOVED, update EXPECTED_SKILLS in this ' +
    'file as a DELIBERATE part of that same change. Do NOT bump it just to turn this run green: a ' +
    'count drifting down with no skill removed is precisely the partial disappearance this pin ' +
    'exists to catch.');

  const bad = auditAll(files);
  assert.deepEqual(bad, [],
    `${bad.length} of ${files.length} skill files have broken frontmatter. A broken description does ` +
    'NOT error at load time — the listing silently falls back to the file H1 (task 0123). Fix the ' +
    `frontmatter; do not reword the description.\n${renderViolations(bad)}`);
});

test('live corpus: every agent .md frontmatter conforms', () => {
  const files = discoverAgentFiles(ROOT);

  assert.equal(files.length, EXPECTED_AGENTS,
    `discovered ${files.length} agents under ${join(ROOT, 'agents')}, expected exactly ` +
    `${EXPECTED_AGENTS} — the scan is INCOMPLETE (or has grown), not clean.\n⚠️ If an agent was ` +
    'legitimately added or removed, update EXPECTED_AGENTS in this file as a DELIBERATE part of that ' +
    'same change — never to make a red run green.');

  const bad = auditAll(files);
  assert.deepEqual(bad, [],
    `${bad.length} of ${files.length} agent files have broken frontmatter.\n${renderViolations(bad)}`);
});
