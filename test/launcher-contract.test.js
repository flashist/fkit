// The launcher-contract test suite — task 23, governed by ADR-014.
//
// Scope (settled, ADR-014 §2): the black-box process contract only —
//   • the argv fkit hands to `claude`, INCLUDING whether it exec'd at all (Group A);
//   • the skillOverrides map written to .fkit/settings/<role>.json — the 7×21 lockdown matrix (Group B).
// NOT shell internals. NOT LLM behavior. `exec claude …` is the boundary; the suite asserts up to it.
//
// Runner: node --test, zero devDependencies (ADR-014 §4). Settled on the runner's OPEN question at
// task-pickup time via ADR-014's dispositive criterion 1: the crown-jewel assertion (#8) is a JSON
// set-comparison. In sh it degrades to substring `grep`, which passes for the wrong reason; in node
// it is JSON.parse + exact set equality. node won on the merits.
//
// ⚠️ THE MATRIX BELOW IS HARD-CODED ON PURPOSE (ADR-014 §5). It is NOT derived from skills_for_role().
// A test whose oracle is the implementation tests nothing — break the matrix and the derived oracle
// breaks in lockstep, still green. This hard-coded copy IS the contract; a deliberate edit here when a
// role's skills change is the ratchet, not a chore.

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import { makeProject, runFkit, readSettings, cleanup, cleanupStub, projectSkillDirs } from './harness.mjs';

// --- THE CONTRACT (hard-coded; see the warning above) -----------------------------------------

// The full universe of fkit-* skills the launcher's build_settings() iterates.
//
// Coverage note (deliberate, and pinned by the "universe matches disk" test in Group B): the per-role
// off-set comparison alone canNOT see a role-specific skill added to the repo without being added here
// IF it happens to be owned by every role — but no skill is. It genuinely cannot see a change to a
// UNIVERSALLY-on skill (fkit-team / fkit-query / fkit-survey-project): those are off for no role, so
// their presence never shows up in any off-set. That corner is closed separately by the assertion that
// this UNIVERSE equals the fkit-* skill dirs actually on disk. A role-SPECIFIC skill deleted or added
// still moves some role's off-set → red, as intended.
const UNIVERSE = [
  'fkit-adversarial-review', 'fkit-design-spec', 'fkit-evaluate-approach', 'fkit-initiate-project',
  'fkit-inspect', 'fkit-plan-task', 'fkit-process-review', 'fkit-process-stateful-review',
  'fkit-query', 'fkit-record-decision', 'fkit-review', 'fkit-stateful-review', 'fkit-status',
  'fkit-survey-project', 'fkit-task-cancelled', 'fkit-task-done', 'fkit-task-plan', 'fkit-team',
  'fkit-wiki-ingest', 'fkit-wiki-lint', 'fkit-wiki-sync',
];

// Skills each role OWNS (visible in its session). Mirror of skills_for_role() — maintained by hand.
const OWNED = {
  lead: ['fkit-team', 'fkit-query'],
  producer: ['fkit-team', 'fkit-query', 'fkit-initiate-project', 'fkit-task-plan', 'fkit-task-done', 'fkit-task-cancelled', 'fkit-status'],
  coder: ['fkit-team', 'fkit-query', 'fkit-plan-task', 'fkit-process-review', 'fkit-process-stateful-review'],
  architect: ['fkit-team', 'fkit-query', 'fkit-survey-project', 'fkit-inspect', 'fkit-design-spec', 'fkit-evaluate-approach', 'fkit-record-decision'],
  reviewer: ['fkit-team', 'fkit-query', 'fkit-review', 'fkit-stateful-review'],
  'adversarial-reviewer': ['fkit-team', 'fkit-query', 'fkit-adversarial-review'],
  wiki: ['fkit-team', 'fkit-query', 'fkit-wiki-ingest', 'fkit-wiki-lint', 'fkit-wiki-sync'],
};

// Skills forced ON for EVERY role regardless of ownership (ADR-012 §3 — a spawned consult inherits the
// caller's overrides, so a consulted skill must never be off anywhere). Never appears in any off-set.
const CONSULT = ['fkit-survey-project', 'fkit-query'];

const ROLES = Object.keys(OWNED);

// The expected off-set for a role: everything in the universe it neither owns nor is a consult skill.
function expectedOff(role) {
  const on = new Set([...OWNED[role], ...CONSULT]);
  return new Set(UNIVERSE.filter((s) => !on.has(s)));
}

// --- shared, initiated project (all assertions below want a non-fresh tree) --------------------
let PROJECT;
before(() => { PROJECT = makeProject({ fresh: false }); });
after(() => { if (PROJECT) cleanup(PROJECT); cleanupStub(); });

// =================================================================================================
// Group A — the argv contract. Assert the argv fkit exec's, NOT the exit code (assertion 2 is the
// whole reason: a green exit can hide a broken invariant).
// =================================================================================================
describe('Group A — argv contract', () => {
  // 1. Each of the 7 roles → exactly `--agent fkit-<role> --settings .fkit/settings/<role>.json`.
  for (const role of ROLES) {
    test(`1. role "${role}" → --agent fkit-${role} --settings .fkit/settings/${role}.json`, async () => {
      const r = await runFkit([role], { project: PROJECT });
      assert.equal(r.exec, true, `expected claude to be exec'd\nstderr: ${r.stderr}`);
      assert.deepEqual(r.argv, ['--agent', `fkit-${role}`, '--settings', `.fkit/settings/${role}.json`]);
    });
  }

  // 1b. The adv / adversarial aliases resolve to fkit-adversarial-reviewer.
  for (const alias of ['adv', 'adversarial']) {
    test(`1b. alias "${alias}" → fkit-adversarial-reviewer`, async () => {
      const r = await runFkit([alias], { project: PROJECT });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      assert.deepEqual(r.argv, [
        '--agent', 'fkit-adversarial-reviewer',
        '--settings', '.fkit/settings/adversarial-reviewer.json',
      ]);
    });
  }

  // 2. `fkit --resume` → non-zero AND claude never exec'd. THE assertion exit codes cannot make:
  //    at HEAD before task 18, --resume exited 0 and launched a session under the wrong lockdown.
  test("2. `fkit --resume` → non-zero, and claude was NEVER exec'd", async () => {
    const r = await runFkit(['--resume'], { project: PROJECT });
    assert.notEqual(r.code, 0, 'expected a non-zero exit');
    assert.equal(r.exec, false, 'claude must NOT be exec\'d for an unrecognized first arg');
  });

  // 3. An arbitrary unknown first arg → same.
  test("3. unknown first arg → non-zero, and claude was NEVER exec'd", async () => {
    const r = await runFkit(['definitely-not-a-role'], { project: PROJECT });
    assert.notEqual(r.code, 0);
    assert.equal(r.exec, false);
  });

  // 4. `fkit --help` → exit 0, no exec.
  test('4. `fkit --help` → exit 0, no exec', async () => {
    const r = await runFkit(['--help'], { project: PROJECT });
    assert.equal(r.code, 0);
    assert.equal(r.exec, false);
  });

  // 5. `fkit update` is NOT swallowed by the usage-error branch (it exits above the guard). The
  //    invariant: it does not hit the "is not a role" branch (exit 2) and does not exec claude.
  //    NOTE: run in-repo, the launcher's `share` IS the repo root, so `fkit update` short-circuits on
  //    the source-checkout branch (exit 1, "git pull") and never reaches the real `curl | sh`
  //    reinstall. That's fine — this pins the "not swallowed by the usage guard" invariant, not the
  //    reinstall path; don't read a green here as exercising the network update.
  //    ⚠️ HERMETIC: against a NON-source-checkout launcher (prove-red.sh's copies) this WOULD reach the
  //    real `curl | sh` installer over the network — the harness stubs `curl` to a no-op precisely so
  //    that path can never fetch. See the curl-stub note in harness.mjs.
  test('5. `fkit update` is not swallowed by the usage-error guard', async () => {
    const r = await runFkit(['update'], { project: PROJECT });
    assert.notEqual(r.code, 2, 'exit 2 would mean it fell into the usage-error branch');
    assert.equal(r.exec, false, 'update must not launch a session');
    assert.doesNotMatch(r.stderr, /is not a role/, 'must not be treated as a bad role');
  });

  // 6. Passthrough after a NAMED role still works.
  test('6. `fkit coder --debug` → passthrough after a named role', async () => {
    const r = await runFkit(['coder', '--debug'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, [
      '--agent', 'fkit-coder', '--settings', '.fkit/settings/coder.json', '--debug',
    ]);
  });

  // 7. No-args, no-tty, INITIATED project → the team room (fkit-lead), per the launcher's own comment
  //    at the lead default ("No role and no tty (piped / CI) → the team room is the safe default").
  //    This started life as a `todo`: the suite caught a real launcher bug — the menu guard gated on
  //    `[ -r /dev/tty ]`, TRUE even with no controlling terminal, so a headless run entered the menu
  //    and died at `exec 3</dev/tty` instead of falling through to lead. The launcher now probes actual
  //    openability (`( exec 3</dev/tty )`), so headless→lead holds and this is an ENFORCING test.
  test('7. no args, no tty, initiated → --agent fkit-lead', async () => {
    const r = await runFkit([], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, ['--agent', 'fkit-lead', '--settings', '.fkit/settings/lead.json']);
  });
});

// =================================================================================================
// Group B — the lockdown matrix (the crown jewel; needs no LLM). JSON.parse + exact set equality.
// =================================================================================================
describe('Group B — lockdown matrix', () => {
  // 8. For each role, the settings file turns OFF exactly the non-owned, non-consult skills — no more
  //    (nothing owned is off), no fewer (every foreign skill is off).
  for (const role of ROLES) {
    test(`8. ${role}: skillOverrides off-set == universe − owned − consult`, async () => {
      const r = await runFkit([role], { project: PROJECT });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      const overrides = readSettings(PROJECT, role).skillOverrides;

      // Every entry present must be valued exactly "off" (the file only ever lists off skills).
      for (const [k, v] of Object.entries(overrides)) {
        assert.equal(v, 'off', `${role}: ${k} should be "off", got ${JSON.stringify(v)}`);
      }
      const actualOff = new Set(Object.keys(overrides));
      assert.deepEqual(actualOff, expectedOff(role), `${role}: off-set mismatch`);

      // Belt-and-braces on the two directions set-equality already covers, stated as intent:
      for (const owned of OWNED[role]) {
        assert.ok(!actualOff.has(owned), `${role}: OWNED skill ${owned} must not be off`);
      }
      for (const c of CONSULT) {
        assert.ok(!actualOff.has(c), `${role}: CONSULT skill ${c} must never be off`);
      }
    });
  }

  // 9. Negative control — makes the two directions concrete on one role. Guard on this run's own exec
  //    (not a settings file left by an earlier coder test) so a coder run that stopped before writing
  //    settings can't pass on stale data.
  test('9. coder: fkit-review is off; fkit-plan-task is NOT', async () => {
    const r = await runFkit(['coder'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    const overrides = readSettings(PROJECT, 'coder').skillOverrides;
    assert.equal(overrides['fkit-review'], 'off', 'a skill the coder does not own must be off');
    assert.ok(!('fkit-plan-task' in overrides), 'a skill the coder owns must not appear in the off map');
  });

  // 10. The hard-coded UNIVERSE must equal the fkit-* skill dirs actually on disk. This closes the one
  //     corner the per-role off-sets cannot see: a UNIVERSALLY-on skill (fkit-team / fkit-query /
  //     fkit-survey-project) added or removed never moves any role's off-set, so only a direct
  //     universe-vs-disk check catches it — and it also forces the deliberate UNIVERSE edit whenever
  //     the skill set changes (the ratchet, made total).
  test('10. hard-coded UNIVERSE == fkit-* skill dirs on disk', () => {
    assert.deepEqual(new Set(projectSkillDirs(PROJECT)), new Set(UNIVERSE),
      'UNIVERSE has drifted from the skills actually shipped — update the hard-coded list deliberately');
  });
});

// =================================================================================================
// Group C — degradation paths the happy path never touches. Each of these fails OPEN (a session with
// no role isolation, or the wrong role), so an untested regression here is silent-wrong, not a crash.
// =================================================================================================
describe('Group C — degradation & fresh-project routing', () => {
  // 11. Read-only project → build_settings() cannot write .fkit/settings and MUST fall back to passing
  //     the SAME lockdown JSON inline on --settings. If that fallback ever emitted empty/garbage, the
  //     session would launch with no role isolation (fail-open) — so pin that the inline value is real,
  //     complete lockdown JSON with the correct off-set. (Happy-path Group B only ever sees the file.)
  test('11. read-only project → inline --settings carries the full lockdown', async () => {
    const proj = makeProject({ fresh: false });
    try {
      chmodSync(join(proj, '.fkit'), 0o500);         // make .fkit unwritable → mkdir .fkit/settings fails
      const r = await runFkit(['coder'], { project: proj });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      // argv is: --agent fkit-coder --settings <value>. The value must be inline JSON, not a file path.
      assert.equal(r.argv[2], '--settings');
      const val = r.argv[3];
      assert.match(val, /^\{/, `expected inline JSON, got: ${val}`);
      const off = new Set(Object.keys(JSON.parse(val).skillOverrides));
      assert.deepEqual(off, expectedOff('coder'), 'inline fallback lockdown must match the file lockdown');
    } finally {
      chmodSync(join(proj, '.fkit'), 0o700);          // restore so cleanup can remove it
      cleanup(proj);
    }
  });

  // 12. Fresh (uninitiated) project, no role → the producer cold-start (launcher :402-413), NOT lead
  //     and NOT the menu. Pins the agent, the settings file, and that the initiation seed is appended.
  test('12. fresh project, no role → producer cold-start with seed', async () => {
    const proj = makeProject({ fresh: true });
    try {
      const r = await runFkit([], { project: proj });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      assert.deepEqual(r.argv.slice(0, 4),
        ['--agent', 'fkit-producer', '--settings', '.fkit/settings/producer.json']);
      assert.equal(r.argv.length, 5, 'expected a trailing seed prompt arg');
      assert.match(r.argv[4], /fresh fkit project/i, 'the cold-start seed must be passed to claude');
    } finally {
      cleanup(proj);
    }
  });
});
