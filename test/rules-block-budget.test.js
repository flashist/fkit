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
import { spawnSync } from 'node:child_process';
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
// ⚠️ RUNS THE REAL `emit_block()` — it does NOT reimplement it (review R2, task 79).
//
// It used to reproduce the function in JavaScript, and the reproduction was wrong by 107 B in two
// independent ways:
//   1. It measured the preamble as the *JavaScript source text* of the seven `printf` lines — 568
//      chars of script, not the 443 bytes those printfs actually emit.
//   2. It used `src.length`, which counts UTF-16 code units (2521), not UTF-8 bytes (2539). This file
//      is dense with `—`, `⚠️` and `⛔`, so that gap grows with every symbol added.
//
// ⚠️ WHY THAT WAS DANGEROUS RATHER THAN UNTIDY. The two errors move in OPPOSITE directions and
// independently. It happened to over-count, so the test was conservative — but past roughly 125 B of
// divergence the sign flips, and a conservative guard becomes one that reports GREEN on a block
// `fkit-claude-init.sh` then rejects with `exit 1`, breaking every launch in every consuming project.
// The old header comment asserted the reproduction was faithful, which is precisely what made the
// drift invisible at the read site.
//
// The lesson generalises: **a test that asserts fidelity to a shell function while reimplementing it
// in another language is asserting something nothing checks.** Run the real thing.
function emittedBlockSize() {
  const r = spawnSync('bash', ['-c',
    // Source the script's variables without executing it, then call the real emit_block.
    `set -a
     RULES_BEGIN=$(grep -oE "^RULES_BEGIN='.*'" "$0" | sed "s/^RULES_BEGIN='//;s/'\\$//")
     RULES_END=$(grep -oE "^RULES_END='.*'" "$0" | sed "s/^RULES_END='//;s/'\\$//")
     RULES_TAG=$(grep -oE "^RULES_TAG='.*'" "$0" | sed "s/^RULES_TAG='//;s/'\\$//")
     rules_src="$1"
     set +a
     eval "$(sed -n '/^emit_block() {/,/^}/p' "$0")"
     emit_block`,
    INIT, SOURCE]);
  assert.equal(r.status, 0, `emit_block failed: ${r.stderr}`);
  return Buffer.byteLength(r.stdout);          // UTF-8 bytes, which is what the cap counts
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
