// The structure-repair contract suite — claude/skills/fkit-heal/repair.sh (task 0246, unit 5 of
// the 0241 design; licensed by ADR-039: consent-gated replacement of untouched-stale fkit-authored
// files ONLY — no move, no rename, no delete; plan-level approval of an enumerated list with diffs
// in view; apply-time freshness re-check; consent never stored).
//
// SCOPE: the stdout/stdin/exit-code contract of a shipped skill executable — the same widened
// test-scope category as test/structure-check.test.js (see that header). propose is a pure
// function of (share, project tree) -> (stdout, exit code); apply adds stdin (the approved item
// lines) and the per-item writes. Fixtures live under os.tmpdir(); nothing writes into the repo.
//
// ⚠️ WHOLE-TREE SNAPSHOTS ARE THE CONSENT MECHANICS' RED BAR: "applied set == approved set,
// nothing else changed, no consent artifact stored anywhere" is proven by before/after tree
// snapshots, not prose. The behavioral bridge fixture (apply -> re-run check.sh -> conforming,
// exit 0) is also the mirror-rot guard for the deliberate helper duplication between the two
// scripts: it only passes while their marker/hashing contracts agree.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, spawn } from 'node:child_process';
import {
  mkdtempSync, writeFileSync, mkdirSync, readFileSync, cpSync, symlinkSync, chmodSync, rmSync,
  readdirSync, readlinkSync, linkSync, existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { REPO, cleanup } from './harness.mjs';

const CHECK = join(REPO, 'claude', 'skills', 'fkit-heal', 'check.sh');
const REPAIR = join(REPO, 'claude', 'skills', 'fkit-heal', 'repair.sh');
const SKILL = join(REPO, 'claude', 'skills', 'fkit-heal', 'SKILL.md');
const SCAFFOLD = join(REPO, 'claude', 'scaffold');
const BEGIN = '<!-- fkit:begin-rules -->';
const END = '<!-- fkit:end-rules -->';

const MADE = [];
after(() => MADE.forEach(cleanup));

function runCheck(root, share = REPO) {
  const r = spawnSync('bash', [CHECK, '--share', share, root], { encoding: 'utf8' });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}
function propose(root, share = REPO, envExtra = null) {
  const r = spawnSync('bash', [REPAIR, 'propose', '--share', share, root], {
    encoding: 'utf8',
    ...(envExtra ? { env: { ...process.env, ...envExtra } } : {}),
  });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}
function apply(root, items, share = REPO, envExtra = null) {
  const r = spawnSync('bash', [REPAIR, 'apply', '--share', share, root], {
    encoding: 'utf8',
    input: items,
    ...(envExtra ? { env: { ...process.env, ...envExtra } } : {}),
  });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}

// The machine lines of a proposal: `item<TAB>path<TAB>prehash<TAB>posthash`.
const itemLines = (out) => out.split('\n').filter((l) => l.startsWith('item\t'));
const itemPaths = (out) => itemLines(out).map((l) => l.split('\t')[1]);
// Apply announce lines (everything that is not a `#` note): `<result>\t<path>\t<detail>`.
const announceLines = (out) => out.split('\n').filter((l) => l && !l.startsWith('#'));

function freshProject() {
  const dir = mkdtempSync(join(tmpdir(), 'fkit-repair-'));
  MADE.push(dir);
  cpSync(join(SCAFFOLD, 'ai-agents'), join(dir, 'ai-agents'), { recursive: true });
  cpSync(join(SCAFFOLD, 'CLAUDE.md'), join(dir, 'CLAUDE.md'));
  cpSync(join(SCAFFOLD, 'AGENTS.md'), join(dir, 'AGENTS.md'));
  return dir;
}

// Deterministic full-tree snapshot: names, types, symlink targets, content hashes — keyed lines.
function snapshotMap(dir) {
  const out = new Map();
  const walk = (rel) => {
    for (const e of readdirSync(join(dir, rel), { withFileTypes: true })
      .sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      const p = join(dir, r);
      if (e.isSymbolicLink()) { out.set(r, `-> ${readlinkSync(p)}`); continue; }
      if (e.isDirectory()) { out.set(r, 'dir'); walk(r); continue; }
      let h;
      try { h = createHash('sha256').update(readFileSync(p)).digest('hex'); } catch { h = '<unreadable>'; }
      out.set(r, h);
    }
  };
  walk('');
  return out;
}
// The set of keys whose value changed, appeared, or vanished between two snapshots.
function changedPaths(before, afterMap) {
  const changed = new Set();
  for (const [k, v] of before) if (!afterMap.has(k) || afterMap.get(k) !== v) changed.add(k);
  for (const k of afterMap.keys()) if (!before.has(k)) changed.add(k);
  return changed;
}

function git(args) {
  const r = spawnSync('git', args, { cwd: REPO, encoding: 'latin1', maxBuffer: 1 << 26 });
  assert.equal(r.status, 0, `git ${args.join(' ')} failed: ${r.stderr}`);
  return r.stdout;
}
function oldestShipped(repoPath) {
  const shas = git(['log', '--full-history', '--format=%H', '--', repoPath]).trim().split('\n');
  const root = shas[shas.length - 1];
  assert.ok(root, `no history for ${repoPath} — the historical fixture would be vacuous`);
  return git(['show', `${root}:${repoPath}`]);
}
// The oldest marker-BEARING shipped scaffold root file (the elision-path shape).
function oldestMarkerBearing(repoPath) {
  const shas = git(['log', '--full-history', '--format=%H', '--', repoPath]).trim().split('\n');
  for (let i = shas.length - 1; i >= 0; i--) {
    const c = git(['show', `${shas[i]}:${repoPath}`]);
    if (c.includes(BEGIN)) return c;
  }
  assert.fail(`no marker-bearing shipped ${repoPath} found — the fixture would be vacuous`);
}

const rawSha = (buf) => createHash('sha256').update(buf).digest('hex');

// A project with two untouched-stale rows: an old shipped reference file (ai-agents/README.md)
// and the markerless omnigent-era root file (CLAUDE.md — the Q1-ruled whole-file-replace case).
function driftedProject() {
  const dir = freshProject();
  const oldReadme = oldestShipped('generic/ai-agents/README.md');
  assert.notEqual(oldReadme, readFileSync(join(SCAFFOLD, 'ai-agents', 'README.md'), 'latin1'),
    'fixture vacuous: the generic-era README no longer differs from current');
  writeFileSync(join(dir, 'ai-agents', 'README.md'), oldReadme, 'latin1');
  const omnigent = oldestShipped('omnigent/scaffold/CLAUDE.md');
  assert.ok(!omnigent.includes(BEGIN), 'fixture vacuous: the omnigent-era CLAUDE.md grew markers');
  writeFileSync(join(dir, 'CLAUDE.md'), omnigent, 'latin1');
  return dir;
}

// ── §6.1 dry-run/apply parity + zero writes outside the approved list ────────────────────────────

test('propose is read-only; apply applies EXACTLY the proposal; everything re-checks conforming', () => {
  const dir = driftedProject();
  const before = snapshotMap(dir);

  const p = propose(dir);
  assert.equal(p.code, 0, `propose is exit 0 even on a drifted project (stderr: ${p.err})`);
  assert.deepEqual(itemPaths(p.out).sort(), ['CLAUDE.md', 'ai-agents/README.md'],
    'exactly the two untouched-stale rows are proposed');
  for (const path of itemPaths(p.out)) {
    assert.ok(p.out.includes(`# diff ${path}`), `the proposal carries a diff block for ${path}`);
  }
  assert.deepEqual(snapshotMap(dir), before, 'propose MUST NOT write anything');

  const items = itemLines(p.out).join('\n');
  const a = apply(dir, items);
  assert.equal(a.code, 0, `all items applied -> exit 0 (out: ${a.out} err: ${a.err})`);
  const applied = announceLines(a.out).filter((l) => l.startsWith('applied\t')).map((l) => l.split('\t')[1]);
  assert.deepEqual(applied.sort(), itemPaths(p.out).sort(), 'applied set == proposed set, exactly');

  const changed = changedPaths(before, snapshotMap(dir));
  assert.deepEqual([...changed].sort(), ['CLAUDE.md', 'ai-agents/README.md'],
    'NOTHING outside the approved list changed, and no new path appeared (consent artifact included)');

  assert.equal(readFileSync(join(dir, 'ai-agents', 'README.md'), 'latin1'),
    readFileSync(join(SCAFFOLD, 'ai-agents', 'README.md'), 'latin1'),
    'a reference file is replaced with the scaffold copy verbatim');
  assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'latin1'),
    readFileSync(join(SCAFFOLD, 'CLAUDE.md'), 'latin1'),
    'a markerless untouched-stale root file is whole-file replaced (owner ruling Q1, 2026-08-07)');

  const c = runCheck(dir);
  assert.equal(c.code, 0, `post-apply the whole project re-checks conforming\n${c.out}`);
});

test('prehash in the item line is the RAW on-disk sha256; posthash is the raw replacement sha256', () => {
  const dir = driftedProject();
  const p = propose(dir);
  for (const l of itemLines(p.out)) {
    const [, path, pre, post] = l.split('\t');
    assert.equal(pre, rawSha(readFileSync(join(dir, path))),
      `${path}: prehash fingerprints the exact on-disk bytes (no normalization)`);
    assert.match(post, /^[0-9a-f]{64}$/);
  }
  const a = apply(dir, itemLines(p.out).join('\n'));
  assert.equal(a.code, 0);
  for (const l of itemLines(p.out)) {
    const [, path, , post] = l.split('\t');
    assert.equal(rawSha(readFileSync(join(dir, path))), post,
      `${path}: the written bytes hash to the approved posthash`);
  }
});

test('an empty proposal (fully conforming project): exit 0, no items, no manufactured question', () => {
  const p = propose(freshProject());
  assert.equal(p.code, 0);
  assert.equal(itemLines(p.out).length, 0);
  assert.match(p.out, /# nothing repair-eligible/, 'the empty case is stated, not implied');
});

// ── §6.2 apply-time freshness re-check (ADR-039 Decision 2) ──────────────────────────────────────

test('a file changed between propose and apply is refused: changed-since-propose; others still apply', () => {
  const dir = driftedProject();
  const p = propose(dir);
  assert.equal(itemLines(p.out).length, 2);
  // CRLF-ize the old README: STILL untouched-stale (the check normalizes endings), but the raw
  // bytes no longer match the prehash — the exact seam where eligibility passes and only the
  // apply-time freshness re-check stands between consent-to-a-stale-diff and a write.
  const crlf = readFileSync(join(dir, 'ai-agents', 'README.md'), 'latin1').split('\n').join('\r\n');
  writeFileSync(join(dir, 'ai-agents', 'README.md'), crlf, 'latin1');

  const a = apply(dir, itemLines(p.out).join('\n'));
  assert.equal(a.code, 1, 'any refusal makes apply exit 1');
  const lines = announceLines(a.out);
  const readme = lines.find((l) => l.split('\t')[1] === 'ai-agents/README.md');
  assert.match(readme, /^refused: changed-since-propose\t/,
    'the changed item is refused, never applied — the consent given was to a diff that no longer exists');
  const claude = lines.find((l) => l.split('\t')[1] === 'CLAUDE.md');
  assert.match(claude, /^applied\t/, 'the untouched item still applies');
  assert.equal(readFileSync(join(dir, 'ai-agents', 'README.md'), 'latin1'), crlf,
    'the changed file is byte-untouched by apply');
});

// ── §6.3 the v1 boundary ─────────────────────────────────────────────────────────────────────────

test('an owner-edited file is never proposed, and a FORGED item line for it is refused at apply', () => {
  const dir = freshProject();
  const ownerFile = join(dir, 'ai-agents', 'tasks', 'README.md');
  const ownerBytes = readFileSync(ownerFile, 'latin1') + '\nan owner note\n';
  writeFileSync(ownerFile, ownerBytes, 'latin1');

  const p = propose(dir);
  assert.ok(!itemPaths(p.out).includes('ai-agents/tasks/README.md'),
    'owner-edited is report-only — never in a proposal');

  // Forge the item line an attacker (or a confused session) might build: correct current prehash,
  // posthash of the scaffold copy. The fresh-check eligibility re-verification must catch it.
  const forged = ['item', 'ai-agents/tasks/README.md',
    rawSha(readFileSync(ownerFile)),
    rawSha(readFileSync(join(SCAFFOLD, 'ai-agents', 'tasks', 'README.md')))].join('\t');
  const a = apply(dir, forged);
  assert.equal(a.code, 1);
  assert.match(a.out, /^refused: not-repair-eligible\tai-agents\/tasks\/README\.md\t.*owner-edited/m,
    'the forged line is refused with the real classification named');
  assert.equal(readFileSync(ownerFile, 'latin1'), ownerBytes, 'the owner-edited file is byte-unchanged');
});

test('neither script contains a move/remove/delete token (the no-destructive-path grep fixture)', () => {
  for (const script of [CHECK, REPAIR]) {
    const src = readFileSync(script, 'utf8');
    assert.ok(!/\b(rm|mv|unlink|rmdir)\b/.test(src),
      `${script} must contain no rm/mv/unlink/rmdir token — v1 licenses replacement ONLY`);
  }
});

test('repair.sh has exactly one write-redirect into the project, and no other file write', () => {
  const src = readFileSync(REPAIR, 'utf8');
  const writes = src.match(/> *"\$root\//g) || [];
  assert.equal(writes.length, 1, 'the per-item in-place replacement is the ONLY project write');
  assert.ok(!/mktemp|>>/.test(src), 'no temp files, no appends — nothing written outside approved paths');
});

// ── §6.4 ADR-005: the vault is never proposed, never written ─────────────────────────────────────

test('a nonconforming wiki-vault yields no vault proposal; a forged vault item is hard-refused', () => {
  const dir = freshProject();
  const schema = join(dir, 'ai-agents', 'wiki-vault', 'schema.md');
  const schemaBytes = readFileSync(schema, 'latin1') + '\nan extra section\n';
  writeFileSync(schema, schemaBytes, 'latin1');
  const vaultBefore = [...snapshotMap(dir)].filter(([k]) => k.startsWith('ai-agents/wiki-vault'));

  const p = propose(dir);
  assert.equal(p.code, 0);
  assert.ok(!itemPaths(p.out).some((x) => x.startsWith('ai-agents/wiki-vault')),
    'zero vault paths in the proposal — wiki-routed is fkit-wiki territory (ADR-005)');

  const forged = ['item', 'ai-agents/wiki-vault/schema.md',
    rawSha(readFileSync(schema)), rawSha(Buffer.from('whatever'))].join('\t');
  const a = apply(dir, forged);
  assert.equal(a.code, 1);
  assert.match(a.out, /^refused: wiki-routed\tai-agents\/wiki-vault\/schema\.md\t.*ADR-005/m,
    'the vault refusal names its authority and fires before anything else looks');
  const vaultAfter = [...snapshotMap(dir)].filter(([k]) => k.startsWith('ai-agents/wiki-vault'));
  assert.deepEqual(vaultAfter, vaultBefore, 'the vault subtree is byte-unchanged');
});

// ── §6.5 the consent shape (prose is load-bearing: the skill IS the consent procedure) ───────────

test('SKILL.md pins the consent model: AskUserQuestion, enumerated list with diffs, never stored', () => {
  const skill = readFileSync(SKILL, 'utf8');
  assert.match(skill, /AskUserQuestion/, 'consent is collected via AskUserQuestion');
  assert.match(skill, /enumerated/, 'plan-level approval of the exact enumerated list');
  assert.match(skill, /[Nn]ever manufacture a consent question/, 'no consent question when nothing is eligible');
  assert.match(skill, /substitutes for\s+consent/, 'announce never substitutes for consent');
  assert.match(skill, /Consent is never stored/, 'no stored consent, ever');
  assert.match(skill, /no move, no\s+rename, no delete/i, 'the v1 boundary is stated');
  assert.match(skill, /[Ll]ive session required/, 'repair is in-session, owner present');
});

// ── §6.6 root context files: the marker-preserving replace ───────────────────────────────────────

test('untouched-stale CLAUDE.md body: scaffold body applied, marker region preserved BYTE-FOR-BYTE', () => {
  const dir = freshProject();
  const old = oldestMarkerBearing('claude/scaffold/CLAUDE.md');
  assert.notEqual(old, readFileSync(join(SCAFFOLD, 'CLAUDE.md'), 'latin1'),
    'fixture vacuous: the oldest marker-bearing CLAUDE.md no longer differs from current');
  const block = `${BEGIN}\nMY LAUNCH-WRITTEN RULES\n  line two, with leading spaces kept\n${END}`;
  assert.ok(old.includes(`${BEGIN}\n${END}`), 'fixture assumes the shipped empty block');
  writeFileSync(join(dir, 'CLAUDE.md'), old.replace(`${BEGIN}\n${END}`, block), 'latin1');
  assert.equal(runCheck(dir).out.match(/^(\S[^\t]*)\tCLAUDE\.md\t/m)[1], 'untouched-stale',
    'precondition: the stuffed-block old body classifies untouched-stale');

  const p = propose(dir);
  assert.deepEqual(itemPaths(p.out), ['CLAUDE.md']);
  const a = apply(dir, itemLines(p.out).join('\n'));
  assert.equal(a.code, 0, `${a.out}\n${a.err}`);

  const scaf = readFileSync(join(SCAFFOLD, 'CLAUDE.md'), 'latin1');
  const expected = scaf.slice(0, scaf.indexOf(BEGIN)) + block + scaf.slice(scaf.indexOf(END) + END.length);
  assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'latin1'), expected,
    'applied file == current scaffold body OUTSIDE the markers + the project marker region VERBATIM');
  assert.equal(runCheck(dir).code, 0, 'and it re-checks conforming');
});

test('block-only drift is conforming — never proposed; malformed markers are never proposed and a forged item is refused', () => {
  const dir = freshProject();
  const claude = join(dir, 'CLAUDE.md');
  writeFileSync(claude, readFileSync(claude, 'latin1')
    .replace(`${BEGIN}\n${END}`, `${BEGIN}\nrules the launch wrote\n${END}`), 'latin1');
  assert.equal(itemLines(propose(dir).out).length, 0, 'block-only drift proposes nothing');

  // Malformed markers: duplicate begin — refused by the check, unproposable, unforgeable.
  const mal = readFileSync(claude, 'latin1').replace(BEGIN, `${BEGIN}\n${BEGIN}`);
  writeFileSync(claude, mal, 'latin1');
  assert.equal(itemLines(propose(dir).out).length, 0, 'malformed markers are report-only (0245 contract)');
  const forged = ['item', 'CLAUDE.md', rawSha(readFileSync(claude)),
    rawSha(readFileSync(join(SCAFFOLD, 'CLAUDE.md')))].join('\t');
  const a = apply(dir, forged);
  assert.equal(a.code, 1);
  assert.match(a.out, /^refused: not-repair-eligible\tCLAUDE\.md\t.*refused: malformed-markers/m);
  assert.equal(readFileSync(claude, 'latin1'), mal, 'the malformed file is byte-unchanged');
});

// ── §6.7 per-path announce: one line per submitted item, refusals included ───────────────────────

test('apply announces exactly one line per submitted item — applied, refused, and garbage alike', () => {
  const dir = driftedProject();
  const p = propose(dir);
  const valid = itemLines(p.out).find((l) => l.split('\t')[1] === 'ai-agents/README.md');
  const forgedEscape = `item\t../outside\t${'0'.repeat(64)}\t${'1'.repeat(64)}`;
  const garbage = 'not an item line at all';
  const a = apply(dir, [valid, forgedEscape, garbage].join('\n'));
  assert.equal(a.code, 1);
  const lines = announceLines(a.out);
  assert.equal(lines.length, 3, 'one announce line per submitted item, no more, no less');
  assert.match(lines[0], /^applied\tai-agents\/README\.md\t/);
  assert.match(lines[1], /^refused: bad-path\t\.\.\/outside\t.*escapes the project root/);
  assert.match(lines[2], /^refused: malformed-item\t/);
});

test('a symlink swapped in after propose is refused — the target and every ancestor are [-L]-tested', () => {
  const dir = driftedProject();
  const p = propose(dir);
  const items = itemLines(p.out).join('\n');
  const target = mkdtempSync(join(tmpdir(), 'fkit-repair-elsewhere-'));
  MADE.push(target);
  writeFileSync(join(target, 'README.md'), 'foreign content\n');
  // Swap the FILE for a symlink (its parent stays real): apply must refuse on -L, never write
  // through. (Fixture-side removal — the script under test has no removal token, see the grep pin.)
  const abs = join(dir, 'ai-agents', 'README.md');
  rmSync(abs);
  symlinkSync(join(target, 'README.md'), abs);
  const a = apply(dir, items);
  assert.equal(a.code, 1);
  assert.match(a.out, /^refused: symlink\tai-agents\/README\.md\t/m, 'never write through a link');
  assert.equal(readFileSync(join(target, 'README.md'), 'utf8'), 'foreign content\n',
    'the symlink target is byte-unchanged');
});

// ── §6.8 the 0245-residual seams, repair-side ────────────────────────────────────────────────────

test('R1 seam: a NUL-bearing drifted file is unreadable to the check and NEVER proposed', () => {
  const dir = freshProject();
  const old = oldestShipped('generic/ai-agents/README.md');
  writeFileSync(join(dir, 'ai-agents', 'README.md'), old.replace('\n', '\u0000hidden-edit\n'), 'latin1');
  const p = propose(dir);
  assert.equal(p.code, 0);
  assert.ok(!itemPaths(p.out).includes('ai-agents/README.md'),
    'the NUL-bearing file must never reach a proposal — the write gate stays closed (0245-R1 clause)');
});

test('R6 seam: a broken sha tool means apply refuses everything and writes nothing', () => {
  const dir = driftedProject();
  const p = propose(dir);
  const items = itemLines(p.out).join('\n');
  const shim = mkdtempSync(join(tmpdir(), 'fkit-repair-sha-'));
  MADE.push(shim);
  for (const t of ['sha256sum', 'shasum']) {
    writeFileSync(join(shim, t), '#!/bin/sh\necho "not: a-hash"\nexit 0\n');
    chmodSync(join(shim, t), 0o755);
  }
  const before = snapshotMap(dir);
  const a = apply(dir, items, REPO, { PATH: `${shim}:${process.env.PATH}` });
  assert.equal(a.code, 1, 'a broken hash tool must never let a write happen');
  assert.ok(!announceLines(a.out).some((l) => l.startsWith('applied\t')), 'nothing reports applied');
  assert.deepEqual(snapshotMap(dir), before, 'and nothing was written');
});

// ── the scaffold-absent seam (0245-R7, structurally defused in repair) ───────────────────────────

// ── the 0246 review round-1 fixes (owner-ruled 2026-08-07): R1/R2/R5/R7 pins ─────────────────────

test('R2: a multi-hard-linked target is refused — never written through to the co-linked path', () => {
  const dir = driftedProject();
  const p = propose(dir);
  const items = itemLines(p.out).join('\n');
  const twinDir = mkdtempSync(join(tmpdir(), 'fkit-repair-twin-'));
  MADE.push(twinDir);
  const readme = join(dir, 'ai-agents', 'README.md');
  const oldBytes = readFileSync(readme, 'latin1');
  // A second dirent for the same inode (same tmp filesystem): -L walks and path-string checks
  // cannot see it, and the in-place truncate-redirect would rewrite the co-linked content.
  linkSync(readme, join(twinDir, 'twin'));
  const a = apply(dir, items);
  assert.equal(a.code, 1, 'a hardlinked target makes apply exit 1');
  assert.match(a.out, /^refused: hardlink\tai-agents\/README\.md\t.*hard link/m,
    'the multi-link target is refused by name, never written');
  assert.equal(readFileSync(join(twinDir, 'twin'), 'latin1'), oldBytes,
    'the co-linked path is byte-unchanged (the R2 probe rewrote it silently pre-fix)');
  assert.equal(readFileSync(readme, 'latin1'), oldBytes, 'the target itself is byte-unchanged');
  const claude = announceLines(a.out).find((l) => l.split('\t')[1] === 'CLAUDE.md');
  assert.match(claude, /^applied\t/, 'the un-linked item still applies');
});

test('R1: the bytes written are the bytes verified — injected synthesis drift never reaches the disk', () => {
  // Deterministic stand-in for the race the review probed live: a stateful `cat` shim tampers the
  // scaffold-README read from the Nth targeted call on. check.sh runs no `cat` at all, so the
  // only targeted reads are apply's own synthesize calls — the count is exact.
  const mkShim = (threshold) => {
    const shim = mkdtempSync(join(tmpdir(), 'fkit-repair-cat-'));
    MADE.push(shim);
    const cnt = join(shim, 'count');
    writeFileSync(join(shim, 'cat'), `#!/bin/sh
case "$*" in
  *"claude/scaffold/ai-agents/README.md"*)
    n=0; [ -f "${cnt}" ] && read n < "${cnt}"
    n=$((n+1)); printf '%s\\n' "$n" > "${cnt}"
    if [ "$n" -ge ${threshold} ]; then printf 'TAMPERED — bytes the owner never approved\\n'; exit 0; fi
    ;;
esac
PATH="\${PATH#*:}"
exec cat "$@"
`);
    chmodSync(join(shim, 'cat'), 0o755);
    return shim;
  };
  const scaffoldBytes = readFileSync(join(SCAFFOLD, 'ai-agents', 'README.md'), 'latin1');
  const old = oldestShipped('generic/ai-agents/README.md');

  // Scenario A — drift injected on the 3rd+ targeted read (the OLD shape's unverified
  // write-buffer read; pre-fix this wrote the tampered bytes and only noticed post-write).
  // Guarantee-shaped: whatever the synthesis call pattern, the on-disk result is the approved
  // bytes or the untouched bytes — never tampered, and never a post-write verify-failed.
  {
    const dir = freshProject();
    writeFileSync(join(dir, 'ai-agents', 'README.md'), old, 'latin1');
    const p = propose(dir);
    const a = apply(dir, itemLines(p.out).join('\n'), REPO,
      { PATH: `${mkShim(3)}:${process.env.PATH}` });
    assert.ok(!/error: verify-failed/.test(a.out),
      'the post-write verify must never be the only line of defense — the buffer is verified BEFORE the write');
    const got = readFileSync(join(dir, 'ai-agents', 'README.md'), 'latin1');
    assert.ok(got === scaffoldBytes || got === old,
      'on-disk bytes are the approved replacement or the untouched original — never unapproved bytes');
  }
  // Scenario B — drift injected on the 2nd+ targeted read (the write buffer itself): the
  // buffer-hash-vs-posthash gate refuses pre-write, nothing lands on disk.
  {
    const dir = freshProject();
    writeFileSync(join(dir, 'ai-agents', 'README.md'), old, 'latin1');
    const p = propose(dir);
    const a = apply(dir, itemLines(p.out).join('\n'), REPO,
      { PATH: `${mkShim(2)}:${process.env.PATH}` });
    assert.equal(a.code, 1);
    assert.match(a.out, /^refused: replacement-drifted\tai-agents\/README\.md\t/m,
      'a drifted write buffer is refused before the redirect opens');
    assert.equal(readFileSync(join(dir, 'ai-agents', 'README.md'), 'latin1'), old,
      'nothing was written');
  }
});

test('R5: an item whose diff cannot render is RETRACTED from the proposal, not left approveable', () => {
  const shim = mkdtempSync(join(tmpdir(), 'fkit-repair-diff-'));
  MADE.push(shim);
  writeFileSync(join(shim, 'diff'), '#!/bin/sh\necho "diff: exploded" >&2\nexit 2\n');
  chmodSync(join(shim, 'diff'), 0o755);
  const dir = driftedProject();
  const p = propose(dir, REPO, { PATH: `${shim}:${process.env.PATH}` });
  assert.equal(p.code, 0, 'propose still completes');
  assert.equal(itemLines(p.out).length, 0,
    'NO approveable item line without its diff in view — consent needs the diff (ADR-039 Decision 2)');
  assert.match(p.out, /^# excluded: ai-agents\/README\.md — diff failed \(rc 2\)/m);
  assert.match(p.out, /^# excluded: CLAUDE\.md — diff failed \(rc 2\)/m);
  assert.match(p.out, /^# nothing proposable/m,
    'the all-excluded case is stated truthfully — not as "no untouched-stale rows"');
});

test('R7: an interrupt mid-apply announces the in-flight path on stderr and exits nonzero', async () => {
  const dir = driftedProject();
  const p = propose(dir);
  const items = itemLines(p.out).join('\n');
  // The gauntlet's `find -links` probe is the only find call anywhere in the flow (check.sh runs
  // none): shimming it to block right before the write is a deterministic stand-in for "the
  // signal lands mid-write-sequence". The kill goes to the process GROUP, as a real Ctrl-C would.
  const shim = mkdtempSync(join(tmpdir(), 'fkit-repair-intr-'));
  MADE.push(shim);
  const sentinel = join(shim, 'reached');
  writeFileSync(join(shim, 'find'), `#!/bin/sh
case "$*" in
  *-links*) : > "${sentinel}"; sleep 60 ;;
esac
PATH="\${PATH#*:}"
exec find "$@"
`);
  chmodSync(join(shim, 'find'), 0o755);
  const child = spawn('bash', [REPAIR, 'apply', '--share', REPO, dir], {
    detached: true,
    env: { ...process.env, PATH: `${shim}:${process.env.PATH}` },
  });
  let err = '';
  child.stderr.on('data', (d) => { err += d; });
  child.stdout.resume();
  child.stdin.write(items);
  child.stdin.end();
  const deadline = Date.now() + 15000;
  while (!existsSync(sentinel) && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 25));
  }
  assert.ok(existsSync(sentinel), 'the write sequence was reached (the shimmed gauntlet find ran)');
  process.kill(-child.pid, 'SIGTERM');
  const code = await new Promise((r) => child.on('close', (c) => r(c)));
  assert.match(err, /INTERRUPTED while applying (CLAUDE\.md|ai-agents\/README\.md)/,
    'the in-flight path is named on stderr — never a silent death (0245 no-atomic-write re-raise)');
  assert.notEqual(code, 0, 'an interrupted apply never reports success');
});

test('an item whose scaffold source is missing is excluded from the proposal with a stated reason', () => {
  // A doctored share whose scaffold lacks ai-agents/README.md: the check's R7 fallthrough labels
  // the drifted project file untouched-stale — but repair must EXCLUDE it (nothing to synthesize),
  // never propose or apply it.
  const share = mkdtempSync(join(tmpdir(), 'fkit-repair-share-'));
  MADE.push(share);
  mkdirSync(join(share, 'claude'), { recursive: true });
  cpSync(join(REPO, 'claude', 'structure-spec.md'), join(share, 'claude', 'structure-spec.md'));
  cpSync(join(REPO, 'claude', 'structure-manifest.tsv'), join(share, 'claude', 'structure-manifest.tsv'));
  cpSync(SCAFFOLD, join(share, 'claude', 'scaffold'), { recursive: true });
  rmSync(join(share, 'claude', 'scaffold', 'ai-agents', 'README.md'));

  const dir = driftedProject();
  const p = propose(dir, share);
  assert.equal(p.code, 0);
  assert.ok(!itemPaths(p.out).includes('ai-agents/README.md'), 'unsynthesizable -> not proposed');
  assert.match(p.out, /^# excluded: ai-agents\/README\.md — .*scaffold/m, 'with a stated per-path reason');
});
