// The launcher-contract test suite — task 23, governed by ADR-014.
//
// Scope (settled, ADR-014 §2): the black-box process contract only —
//   • the argv fkit hands to `claude`, INCLUDING whether it exec'd at all (Group A);
//   • the settings written to .fkit/settings/<role>.json (Group B).
// NOT shell internals. NOT LLM behavior. `exec claude …` is the boundary; the suite asserts up to it.
//
// Runner: node --test, zero devDependencies (ADR-014 §4).
//
// Group B was rewritten for task 43 / ADR-018: the per-role `skillOverrides` "off" list (the
// "7×21 lockdown matrix") and the `CONSULT_SKILLS` exception list are RETIRED — both were
// session-scoped (they governed what the launching process could see, not who was actually calling),
// which is the bug class task 43 fixes. Role→skill enforcement is now a `PreToolUse` hook
// (skill-ownership-hook.sh) that checks the REAL invoking agent's identity against skills_for_role()
// at the point of each `Skill` call, not at session-launch time — see
// test/skill-ownership-hook.test.js for that contract (fixtures-in, exit-code-out; a genuine
// per-role/per-skill matrix belongs there now, not here). What THIS suite still owns is the much
// narrower question: does `build_settings()` correctly wire the hook into every role's generated
// settings? That's a fixed, role-INDEPENDENT shape (same hook, same matcher, for every role) — hence
// no more hard-coded per-role UNIVERSE/OWNED/CONSULT matrix here; there is nothing role-shaped left
// in this file's contract to hard-code.

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chmodSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { makeProject, runFkit, readSettings, cleanup, cleanupStub, LAUNCHER } from './harness.mjs';

const ROLES = ['lead', 'producer', 'coder', 'architect', 'reviewer', 'adversarial-reviewer', 'wiki'];

// The one hook command every role's settings must carry — role-independent by design (the hook reads
// the REAL caller's identity out of its own payload; it does not need a different command per role).
//
// ⚠️ Derived from LAUNCHER's own directory, NOT hard-coded to this checkout's REPO path (round-1
// review, R2). `build_settings()` computes `$here` from the launcher script actually being run, so
// `prove-red.sh`'s mutant copies (a full copy of claude/ under a temp dir, run via FKIT_LAUNCHER)
// generate their OWN, correctly-different absolute path — a hard-coded REPO path would never match a
// copy's settings, failing even the "unmutated copy must be green" baseline. This must track
// whichever launcher is actually under test.
const HOOK_SCRIPT = join(dirname(LAUNCHER), 'skill-ownership-hook.sh');
const HOOK_COMMAND = `bash "${HOOK_SCRIPT}"`;

// The Stop turn-completion hook (task 0127 / ADR-030): the SECOND hook build_settings() wires, into the
// same {"hooks":{…}} object. Same launcher-relative derivation as HOOK_SCRIPT (see the note above) so
// prove-red.sh's mutant copies generate their own correct absolute path.
const STOP_HOOK_SCRIPT = join(dirname(LAUNCHER), 'turn-completion-hook.sh');
const STOP_HOOK_COMMAND = `bash "${STOP_HOOK_SCRIPT}"`;

// The AskUserQuestion marker hook (task 0127 / ADR-030 path 2): the SECOND PreToolUse entry, matched on
// the AskUserQuestion tool, that records the marker the Stop hook reads. Same launcher-relative
// derivation as the others.
const MARKER_HOOK_SCRIPT = join(dirname(LAUNCHER), 'askuserquestion-marker-hook.sh');
const MARKER_HOOK_COMMAND = `bash "${MARKER_HOOK_SCRIPT}"`;

// The ship-loop marker hook (task 0129 / ADR-030): a UserPromptExpansion entry recording a real
// ship-loop slash-command invocation. Same launcher-relative derivation as the others.
const SHIPLOOP_HOOK_SCRIPT = join(dirname(LAUNCHER), 'shiploop-marker-hook.sh');
const SHIPLOOP_HOOK_COMMAND = `bash "${SHIPLOOP_HOOK_SCRIPT}"`;

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
// Group B — the hook-wiring contract (task 43 / ADR-018). No more per-role matrix: every role gets
// the SAME hook, wired the SAME way — role-specific enforcement now lives entirely inside the hook
// script itself (test/skill-ownership-hook.test.js), keyed on the REAL caller's identity at the
// point of each Skill call, not on which role's settings file launched the process.
// =================================================================================================
describe('Group B — hook wiring', () => {
  // 8. For every role, the generated settings wire TWO PreToolUse hooks, both via `bash "<path>"`
  //    (never a bare path — ADR-017 rule 2, the exec bit is not guaranteed to survive install/copy):
  //      • matcher "Skill"           → skill-ownership-hook.sh (ADR-018 lockdown), and
  //      • matcher "AskUserQuestion" → askuserquestion-marker-hook.sh (task 0127 / ADR-030 path 2).
  //    Matched by matcher, not array index, so a reorder can't silently pass. The AskUserQuestion entry
  //    must be ADDED alongside the Skill one, never displace it — losing the Skill entry would silently
  //    unbolt the whole role lockdown, so pin both are present.
  for (const role of ROLES) {
    test(`8. ${role}: settings wire both PreToolUse hooks (Skill lockdown + AskUserQuestion marker)`, async () => {
      const r = await runFkit([role], { project: PROJECT });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      const settings = readSettings(PROJECT, role);
      const preToolUse = settings.hooks?.PreToolUse;
      assert.equal(preToolUse?.length, 2, `${role}: expected two PreToolUse entries (Skill + AskUserQuestion)`);
      const skill = preToolUse.find((e) => e.matcher === 'Skill');
      const marker = preToolUse.find((e) => e.matcher === 'AskUserQuestion');
      assert.ok(skill, `${role}: the Skill lockdown PreToolUse entry must still be present`);
      assert.ok(marker, `${role}: the AskUserQuestion marker PreToolUse entry must be present`);
      assert.equal(skill.hooks?.[0]?.type, 'command');
      assert.equal(skill.hooks?.[0]?.command, HOOK_COMMAND,
        `${role}: Skill hook must invoke skill-ownership-hook.sh via an explicit interpreter`);
      assert.equal(marker.hooks?.[0]?.type, 'command');
      assert.equal(marker.hooks?.[0]?.command, MARKER_HOOK_COMMAND,
        `${role}: AskUserQuestion hook must invoke askuserquestion-marker-hook.sh via an explicit interpreter`);
    });
  }

  // 8b. For every role, the SAME settings object also wires exactly one Stop hook (task 0127 /
  //     ADR-030), pointing at the on-disk turn-completion-hook.sh via `bash "<path>"`. Stop is NOT
  //     tool-scoped, so — unlike the PreToolUse entry — it carries no `matcher`; a stray matcher here
  //     would be a wiring bug. It must NOT displace the PreToolUse entry: assertion 8 already pins that
  //     PreToolUse survives, and this pins Stop is added alongside it, not instead of it.
  for (const role of ROLES) {
    test(`8b. ${role}: settings wire the Stop turn-completion hook`, async () => {
      const r = await runFkit([role], { project: PROJECT });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      const settings = readSettings(PROJECT, role);
      const stop = settings.hooks?.Stop;
      assert.equal(stop?.length, 1, `${role}: expected exactly one Stop hook entry`);
      assert.ok(!('matcher' in stop[0]), `${role}: a Stop hook must not be tool-scoped (no matcher)`);
      assert.equal(stop[0].hooks?.length, 1, `${role}: expected exactly one Stop command`);
      assert.equal(stop[0].hooks[0].type, 'command');
      assert.equal(stop[0].hooks[0].command, STOP_HOOK_COMMAND,
        `${role}: Stop command must invoke turn-completion-hook.sh via an explicit interpreter, not a bare path`);
    });
  }

  // 8c. For every role, the settings wire exactly one UserPromptExpansion hook (task 0129 / ADR-030) —
  //     the transcript-independent ship-loop marker. Not tool-scoped (no matcher); the hook self-filters
  //     on command_name. Added alongside PreToolUse + Stop, never displacing them.
  for (const role of ROLES) {
    test(`8c. ${role}: settings wire the UserPromptExpansion ship-loop marker hook`, async () => {
      const r = await runFkit([role], { project: PROJECT });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      const settings = readSettings(PROJECT, role);
      const upe = settings.hooks?.UserPromptExpansion;
      assert.equal(upe?.length, 1, `${role}: expected exactly one UserPromptExpansion hook entry`);
      assert.ok(!('matcher' in upe[0]), `${role}: the ship-loop marker hook self-filters (no matcher)`);
      assert.equal(upe[0].hooks?.[0]?.type, 'command');
      assert.equal(upe[0].hooks?.[0]?.command, SHIPLOOP_HOOK_COMMAND,
        `${role}: UserPromptExpansion command must invoke shiploop-marker-hook.sh via an explicit interpreter`);
    });
  }

  // 9. The RETIREMENT is itself part of the contract, not an incidental side effect: no role's
  //    settings may carry a `skillOverrides` key any more. A stray reintroduction (e.g. a rebase
  //    that resurrects the old mechanism alongside the new one) must go red here, not ship silently.
  test('9. no role\'s settings carry a skillOverrides key any more (retired, task 43)', async () => {
    for (const role of ROLES) {
      const r = await runFkit([role], { project: PROJECT });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      const settings = readSettings(PROJECT, role);
      assert.ok(!('skillOverrides' in settings), `${role}: skillOverrides must not be generated any more`);
    }
  });

  // 10. The hook script this settings entry points at must actually exist on disk — a settings file
  //     that correctly NAMES a script Claude Code can't find would fail exactly as badly (silently,
  //     per the fail-open hazard) as never wiring the hook in the first place.
  test('10. the hook script the settings point at exists on disk', () => {
    assert.ok(existsSync(HOOK_SCRIPT), `expected ${HOOK_SCRIPT} to exist`);
    assert.ok(existsSync(STOP_HOOK_SCRIPT), `expected ${STOP_HOOK_SCRIPT} to exist`);
    assert.ok(existsSync(MARKER_HOOK_SCRIPT), `expected ${MARKER_HOOK_SCRIPT} to exist`);
    assert.ok(existsSync(SHIPLOOP_HOOK_SCRIPT), `expected ${SHIPLOOP_HOOK_SCRIPT} to exist`);
  });
});

// =================================================================================================
// Group C — degradation paths the happy path never touches. Each of these fails OPEN (a session with
// no role isolation, or the wrong role), so an untested regression here is silent-wrong, not a crash.
// =================================================================================================
describe('Group C — degradation & fresh-project routing', () => {
  // 11. Read-only project → build_settings() cannot write .fkit/settings and MUST fall back to passing
  //     the SAME lockdown JSON inline on --settings. If that fallback ever emitted empty/garbage, the
  //     session would launch with no role isolation (fail-open) — so pin that the inline value carries
  //     the real hook wiring, not just any JSON. (Happy-path Group B only ever sees the file.)
  test('11. read-only project → inline --settings carries the hook wiring', async () => {
    const proj = makeProject({ fresh: false });
    try {
      chmodSync(join(proj, '.fkit'), 0o500);         // make .fkit unwritable → mkdir .fkit/settings fails
      const r = await runFkit(['coder'], { project: proj });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      // argv is: --agent fkit-coder --settings <value>. The value must be inline JSON, not a file path.
      assert.equal(r.argv[2], '--settings');
      const val = r.argv[3];
      assert.match(val, /^\{/, `expected inline JSON, got: ${val}`);
      const inline = JSON.parse(val);
      assert.ok(!('skillOverrides' in inline), 'the retired mechanism must not resurface in the fallback');
      const inlineSkill = inline.hooks?.PreToolUse?.find((e) => e.matcher === 'Skill');
      const inlineMarker = inline.hooks?.PreToolUse?.find((e) => e.matcher === 'AskUserQuestion');
      assert.equal(inlineSkill?.hooks?.[0]?.command, HOOK_COMMAND,
        'inline fallback must carry the Skill lockdown hook wiring');
      assert.equal(inlineMarker?.hooks?.[0]?.command, MARKER_HOOK_COMMAND,
        'inline fallback must carry the AskUserQuestion marker hook wiring');
      assert.equal(inline.hooks?.Stop?.[0]?.hooks?.[0]?.command, STOP_HOOK_COMMAND,
        'inline fallback must also carry the Stop turn-completion hook wiring');
      assert.equal(inline.hooks?.UserPromptExpansion?.[0]?.hooks?.[0]?.command, SHIPLOOP_HOOK_COMMAND,
        'inline fallback must also carry the ship-loop marker hook wiring');
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
