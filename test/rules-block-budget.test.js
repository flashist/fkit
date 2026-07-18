// The fkit-managed rules block size budget — `fkit-claude-init.sh`'s RULES_MAX guard.
//
// WHY THIS EXISTS (review finding R2, task 62). `fkit-claude-init.sh` refuses to write a rules block
// larger than RULES_MAX and **exits 1** when one is. Init runs on EVERY `fkit` launch, and task 26
// made init failure non-fatal to the launcher — but a project whose block is over budget still never
// receives its rules again, silently, on every launch after the one that broke it.
//
// ⚠️ THE FAILURE MODE IS WHY THIS IS A TEST AND NOT A COMMENT. The block is authored in
// `claude/scaffold/universal-rules.md`, which reads like ordinary prose — there is nothing at the edit
// site to tell an author a hard ceiling exists. At the time of writing, the block sat at ~86% of the
// cap after one bullet was added. The next contributor to add a paragraph would find out from a user.
//
// ⚠️ THIS ASSERTS THE EMITTED BLOCK, NOT THE SOURCE FILE. `emit_block()` wraps the source in two
// markers plus a five-line explanatory comment, so the source is meaningfully smaller than what the
// guard measures. Testing the source alone would under-count and pass a block that init rejects.
//
// NOTE ON DISAGREEMENT, recorded because the finding was contested: Codex scored this "no finding";
// fkit-reviewer kept it at medium and the owner ruled to add the guard. Both reviewers computed the
// same numbers — the disagreement was over whether 84% utilization with no regression guard was worth
// recording, not over the arithmetic.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

const INIT = join(REPO, 'claude', 'fkit-claude-init.sh');
const SOURCE = join(REPO, 'claude', 'scaffold', 'universal-rules.md');

// Read the cap from the script rather than hardcoding it — a test that pins its own copy of the
// number stops testing the thing the moment someone raises the real one.
function rulesMax() {
  const m = readFileSync(INIT, 'utf8').match(/^RULES_MAX=(\d+)/m);
  assert.ok(m, 'RULES_MAX not found in fkit-claude-init.sh — the guard this test mirrors has moved');
  return Number(m[1]);
}

// Reproduce emit_block()'s output size: markers + the explanatory comment + the source.
// ⚠️ Mirrors `emit_block()` in fkit-claude-init.sh. If that function's preamble changes, this must
// change with it — the assertion below is only as honest as this reproduction.
function emittedBlockSize() {
  const init = readFileSync(INIT, 'utf8');
  const begin = init.match(/^RULES_BEGIN='(.*)'$/m)[1];
  const end = init.match(/^RULES_END='(.*)'$/m)[1];
  const preamble = init
    .split('emit_block() {')[1]
    .split('}')[0]
    .split('\n')
    .filter((l) => l.includes("printf '") || l.includes("printf '<!--"))
    .join('\n');
  const src = readFileSync(SOURCE, 'utf8');
  // begin marker + newline, the preamble comment (approximated by its literal text length), source,
  // end marker + newline. The preamble is static text in the script, so its own length is the cost.
  return begin.length + 1 + preamble.length + src.length + end.length + 1;
}

test('the emitted rules block stays under RULES_MAX', () => {
  const max = rulesMax();
  const size = emittedBlockSize();
  assert.ok(
    size <= max,
    `rules block is ${size}B, over the ${max}B cap enforced at fkit-claude-init.sh — ` +
      `init would exit 1 and no project would receive its rules. Trim ${SOURCE}.`,
  );
});

// A ceiling with no early warning is a ceiling you discover by hitting it. This fails while there is
// still room to think, rather than after a launch is already broken.
test('the rules block has not quietly consumed its headroom', () => {
  const max = rulesMax();
  const size = emittedBlockSize();
  const pct = Math.round((size / max) * 100);
  assert.ok(
    pct <= 92,
    `rules block is at ${pct}% of the ${max}B cap (${size}B, ${max - size}B left). ` +
      `This is a WARNING THRESHOLD, not the hard limit — but the block is injected into every agent's ` +
      `context on every turn, so growth here is a real cost. Either trim universal-rules.md, or ` +
      `raise RULES_MAX deliberately and say why.`,
  );
});

// The real block must actually be delimited by the markers the guard looks for — a block that lost a
// marker measures as fine and merges as garbage.
test('the live CLAUDE.md carries exactly one well-formed rules block', () => {
  const init = readFileSync(INIT, 'utf8');
  const begin = init.match(/^RULES_BEGIN='(.*)'$/m)[1];
  const end = init.match(/^RULES_END='(.*)'$/m)[1];
  for (const name of ['CLAUDE.md', 'AGENTS.md']) {
    const body = readFileSync(join(REPO, name), 'utf8');
    const opens = body.split(begin).length - 1;
    const closes = body.split(end).length - 1;
    assert.equal(opens, 1, `${name}: expected exactly one begin marker, found ${opens}`);
    assert.equal(closes, 1, `${name}: expected exactly one end marker, found ${closes}`);
    assert.ok(body.indexOf(begin) < body.indexOf(end), `${name}: markers are out of order`);
  }
});
