// Checks the relative links in fkit's top-level docs with reference-integrity's §4.1 rule, shared
// through `test/link-condition.mjs`. A repo-content guard: the fourth test-scope category, recorded in
// `test/task-id-uniqueness.test.js`'s header. Reads the repo read-only; fixtures live in os.tmpdir().

// Same rule, same gaps (reference-integrity's blind spots 1-8). The cost here: image links and
// nested-bracket badge labels are never matched, so README's teaser gif, VERSION and LICENSE badge
// targets go unchecked (3 targets, all resolving, measured 2026-10-14). Owner ruling: disclose, not fix.

// CHANGELOG.md is scanned whole, released entries too: deleting a file an old entry links to means
// fixing that entry's link. Owner ruling 2026-10-14: accept and disclose.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { REPO } from './harness.mjs';
import { walk, resolveExact, scanFiles, formatBroken } from './link-condition.mjs';

export const NAMED = [
  'README.md', 'CONTRIBUTING.md', 'RELEASING.md', 'CHANGELOG.md', 'claude/README.md',
  'CLAUDE.md', 'AGENTS.md',
];

export function missingNamed(root) {
  return NAMED.filter((rel) => !resolveExact(root, path.join(root, rel)));
}

// `docs/` is walked only if present, so removing its last page is not a crash.
export function collectDocs(root) {
  const named = NAMED.filter((rel) => resolveExact(root, path.join(root, rel)));
  const docs = path.join(root, 'docs');
  const walked = resolveExact(root, docs) && fs.statSync(docs).isDirectory()
    ? walk(docs).map((p) => path.relative(root, p).split(path.sep).join('/'))
    : [];
  return [...named, ...walked.sort()];
}

// A front-door link is a pointer offered to a reader, so a red is fixed at the link: no exemptions.
export function scanDocs(root) {
  return scanFiles(root, collectDocs(root), new Set());
}

const MADE = [];
function fixture(files) {
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(tmpdir()), 'fkit-toplinks-'));
  MADE.push(dir);
  for (const [rel, body] of Object.entries(files)) {
    const abs = path.join(dir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, body);
  }
  return dir;
}
process.on('exit', () => { for (const d of MADE) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) { /* best effort */ } } });

// Every named file, each with one link that resolves, so a clean fixture is never 0-because-empty.
const BASE = Object.fromEntries(NAMED.map((rel) =>
  [rel, `[home](${path.posix.relative(path.posix.dirname(rel), 'README.md')})\n`]));

// ── Live tree, read-only ─────────────────────────────────────────────────────────────────────────

const LIVE = scanDocs(REPO);

test('T1 scope: every named top-level doc exists, case-exact', () => {
  const missing = missingNamed(REPO);
  assert.deepEqual(missing, [],
    'named top-level doc(s) missing or renamed — a deleted file must red here, not drop out of the ' +
    `scan silently:\n${missing.map((r) => `    - ${r}`).join('\n')}\n  If the rename is deliberate, ` +
    'update NAMED (and the CONTRIBUTING.md "What to run for a change" row) in the same edit.');
});

test('T2 scope: every named doc was scanned, and nothing under ai-agents/ was', () => {
  const unscanned = NAMED.filter((rel) => !LIVE.visited.includes(rel));
  assert.deepEqual(unscanned, [], `named doc(s) not scanned:\n${unscanned.map((r) => `    - ${r}`).join('\n')}`);
  const strays = LIVE.visited.filter((rel) => rel.startsWith('ai-agents/'));
  assert.deepEqual(strays, [],
    'files under ai-agents/ entered this scan — that tree is test/reference-integrity.test.js\'s, ' +
    `and ai-agents/wiki-vault/ is fkit-wiki's alone (ADR-005):\n${strays.map((r) => `    - ${r}`).join('\n')}`);
});

test('T3 live tree: no broken relative link in the top-level docs', () => {
  assert.deepEqual(LIVE.broken, [],
    `${LIVE.broken.length} unresolved link(s) in fkit's top-level docs\n` +
    formatBroken(REPO, LIVE.broken) +
    '\n  Repair the link; this check has no exemption list.');
});

test('T4 disclosure: files scanned, links checked, skips by class', (t) => {
  t.diagnostic(`scanned ${LIVE.scanned} files, resolved ${LIVE.checked} link targets, ${LIVE.broken.length} broken`);
  t.diagnostic(`skipped by class — scheme/protocol-relative/anchor ${LIVE.skipped.scheme}, ` +
    `elided ${LIVE.skipped.elided}, empty-after-fragment ${LIVE.skipped.emptyAfterFragment}`);
  assert.ok(LIVE.checked >= 20,
    `only ${LIVE.checked} link targets were resolved across ${LIVE.scanned} files (51 on 2026-10-14), ` +
    'so the matcher is probably not matching, and "0 broken" would mean nothing.');
});

// ── Fixture arms, all under os.tmpdir() ──────────────────────────────────────────────────────────

test('M1 a broken link in README.md reds, naming the file and target; the fixed copy is green', () => {
  const clean = scanDocs(fixture(BASE));
  assert.deepEqual(clean.broken, [], 'the clean fixture was already broken, so the planted run proves nothing');
  assert.ok(clean.checked >= NAMED.length, 'the clean fixture resolved too few links to be a control');

  const planted = scanDocs(fixture({ ...BASE, 'README.md': '[home](README.md) [gone](docs/nope.md)\n' }));
  assert.deepEqual(planted.broken.map((b) => [b.file, b.target]), [['README.md', 'docs/nope.md']],
    'the planted broken link in README.md was not reported');

  const fixed = scanDocs(fixture({ ...BASE, 'README.md': '[home](README.md) [back](CHANGELOG.md)\n' }));
  assert.deepEqual(fixed.broken, []);
});

test('M2 claude/README.md resolves relative to claude/, and its broken link reds', () => {
  const planted = scanDocs(fixture({ ...BASE, 'claude/README.md': '[c](CONTRIBUTING.md)\n' }));
  assert.deepEqual(planted.broken.map((b) => [b.file, b.target]), [['claude/README.md', 'CONTRIBUTING.md']],
    'a link that resolves only from the repo root, not from claude/, was not reported');

  const fixed = scanDocs(fixture({ ...BASE, 'claude/README.md': '[c](../CONTRIBUTING.md)\n' }));
  assert.deepEqual(fixed.broken, []);
});

test('M3 a missing or wrongly-cased named doc is reported, not skipped', () => {
  const { 'CHANGELOG.md': _gone, ...withoutChangelog } = BASE;
  const root = fixture(withoutChangelog);
  assert.deepEqual(missingNamed(root), ['CHANGELOG.md']);
  assert.ok(!scanDocs(root).visited.includes('CHANGELOG.md'));

  const { 'README.md': readme, ...rest } = BASE;
  assert.deepEqual(missingNamed(fixture({ ...rest, 'readme.md': readme })), ['README.md'],
    'a wrongly-cased README passed — on a case-insensitive volume that would differ from CI');
});

test('M4 broken links under ai-agents/ and test/ are never visited', () => {
  const r = scanDocs(fixture({
    ...BASE,
    'ai-agents/wiki-vault/x.md': '[gone](./nowhere.md)\n',
    'ai-agents/y.md': '[gone](./nowhere.md)\n',
    'test/z.md': '[gone](./nowhere.md)\n',
  }));
  assert.ok(r.checked >= NAMED.length, 'the fixture resolved too few links, so nothing was exercised');
  assert.deepEqual(r.broken, []);
  assert.deepEqual(r.visited.filter((rel) => rel.startsWith('ai-agents/') || rel.startsWith('test/')), []);
});

test('M5 every .md under docs/ is collected, recursively, and its broken link reds', () => {
  const r = scanDocs(fixture({
    ...BASE,
    'docs/top.md': '[home](../README.md)\n',
    'docs/sub/deep.md': '[gone](../nope.md)\n',
  }));
  assert.ok(r.visited.includes('docs/top.md') && r.visited.includes('docs/sub/deep.md'));
  assert.deepEqual(r.broken.map((b) => [b.file, b.target]), [['docs/sub/deep.md', '../nope.md']]);
});
