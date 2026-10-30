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
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { makeProject, runFkit, runTerminal, readSettings, cleanup, cleanupStub, LAUNCHER, REPO } from './harness.mjs';
import { interviewSettings, launchArgs } from '../codex/fkit.mjs';
import { OwnerQuestions } from '../codex/owner-question.mjs';
import { parseCatalog } from '../codex/models.mjs';

const ROLES = ['lead', 'producer', 'coder', 'architect', 'reviewer', 'adversarial-reviewer', 'wiki'];

// fkit coder's plan-review session line (ADR-060): the only role whose argv carries it.
const LINE_FLAG = '--append-system-prompt-file';
const lineFile = (state) => `.fkit/settings/coder-plan-review-${state}.txt`;
const sessionArgs = (role) => (role === 'coder' ? [LINE_FLAG, lineFile('on')] : []);

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

// The carry-check hook (task 0204 / `0162` §10 row 3): the THIRD PreToolUse entry, matched on the
// subagent-spawning tool ("Agent"; "Task" is the legacy alias — hence the regex matcher). Same
// launcher-relative derivation as the others, and doubly load-bearing here: the .sh resolves its .mjs
// beside itself, so prove-red's copied tree must point at the COPY's pair.
const CARRY_HOOK_SCRIPT = join(dirname(LAUNCHER), 'carry-check-hook.sh');
const CARRY_HOOK_COMMAND = `bash "${CARRY_HOOK_SCRIPT}"`;

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
      assert.deepEqual(r.argv, [
        '--agent', `fkit-${role}`, '--settings', `.fkit/settings/${role}.json`, ...sessionArgs(role),
      ]);
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
      '--agent', 'fkit-coder', '--settings', '.fkit/settings/coder.json', LINE_FLAG, lineFile('on'), '--debug',
    ]);
  });

  // 7. No-args, no-tty, INITIATED project → the lead (fkit-lead), per the launcher's own comment
  //    at the lead default ("No role and no tty (piped / CI) → lead is the safe default").
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
  // 8. For every role, the generated settings wire THREE PreToolUse hooks, all via `bash "<path>"`
  //    (never a bare path — ADR-017 rule 2, the exec bit is not guaranteed to survive install/copy):
  //      • matcher "Skill"           → skill-ownership-hook.sh (ADR-018 lockdown),
  //      • matcher "AskUserQuestion" → askuserquestion-marker-hook.sh (task 0127 / ADR-030 path 2), and
  //      • matcher "Agent|Task"      → carry-check-hook.sh (task 0204).
  //    Matched by matcher, not array index, so a reorder can't silently pass. Each later entry must be
  //    ADDED alongside the Skill one, never displace it — losing the Skill entry would silently unbolt
  //    the whole role lockdown, so pin all three are present.
  for (const role of ROLES) {
    test(`8. ${role}: settings wire all three PreToolUse hooks (Skill lockdown + AskUserQuestion marker + carry check)`, async () => {
      const r = await runFkit([role], { project: PROJECT });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      const settings = readSettings(PROJECT, role);
      const preToolUse = settings.hooks?.PreToolUse;
      assert.equal(preToolUse?.length, 3, `${role}: expected three PreToolUse entries (Skill + AskUserQuestion + Agent|Task)`);
      const skill = preToolUse.find((e) => e.matcher === 'Skill');
      const marker = preToolUse.find((e) => e.matcher === 'AskUserQuestion');
      const carry = preToolUse.find((e) => e.matcher === 'Agent|Task');
      assert.ok(skill, `${role}: the Skill lockdown PreToolUse entry must still be present`);
      assert.ok(marker, `${role}: the AskUserQuestion marker PreToolUse entry must be present`);
      assert.ok(carry, `${role}: the Agent|Task carry-check PreToolUse entry must be present`);
      assert.equal(skill.hooks?.[0]?.type, 'command');
      assert.equal(skill.hooks?.[0]?.command, HOOK_COMMAND,
        `${role}: Skill hook must invoke skill-ownership-hook.sh via an explicit interpreter`);
      assert.equal(marker.hooks?.[0]?.type, 'command');
      assert.equal(marker.hooks?.[0]?.command, MARKER_HOOK_COMMAND,
        `${role}: AskUserQuestion hook must invoke askuserquestion-marker-hook.sh via an explicit interpreter`);
      assert.equal(carry.hooks?.[0]?.type, 'command');
      assert.equal(carry.hooks?.[0]?.command, CARRY_HOOK_COMMAND,
        `${role}: Agent|Task hook must invoke carry-check-hook.sh via an explicit interpreter`);
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
    assert.ok(existsSync(CARRY_HOOK_SCRIPT), `expected ${CARRY_HOOK_SCRIPT} to exist`);
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
      const inlineCarry = inline.hooks?.PreToolUse?.find((e) => e.matcher === 'Agent|Task');
      assert.equal(inlineCarry?.hooks?.[0]?.command, CARRY_HOOK_COMMAND,
        'inline fallback must carry the Agent|Task carry-check hook wiring');
      assert.equal(inline.hooks?.Stop?.[0]?.hooks?.[0]?.command, STOP_HOOK_COMMAND,
        'inline fallback must also carry the Stop turn-completion hook wiring');
      assert.equal(inline.hooks?.UserPromptExpansion?.[0]?.hooks?.[0]?.command, SHIPLOOP_HOOK_COMMAND,
        'inline fallback must also carry the ship-loop marker hook wiring');
      // No writable .fkit/ → no session line: plan review fails toward off (ADR-060), never a dangling flag.
      assert.equal(r.argv.length, 4, `expected no session-line flag, got: ${r.argv.slice(4)}`);
    } finally {
      chmodSync(join(proj, '.fkit'), 0o700);          // restore so cleanup can remove it
      cleanup(proj);
    }
  });

  // The absolute PROJECT.md path the launcher's freshness predicate reads. Handing it to the stub as
  // FKIT_STUB_INITIATE is how a test says "the initiation succeeded" — the only way to reach the
  // lead hand-off, since a stub that writes nothing leaves the tree fresh forever.
  const pmPath = (proj) => join(proj, 'ai-agents', 'knowledge-base', 'PROJECT.md');

  // 12. Fresh (uninitiated) project, no role → TWO phases: the producer cold-start (with its seed),
  //     and then, once the initiation has actually landed, the lead — in the same tab, NOT the menu.
  //     Still pins all four of the things it always pinned about the cold start (which agent, which
  //     settings file, that a seed is appended, what the seed says); the lead phase is additive.
  //     ⚠️ Only visible via r.argvs: r.argv alone shows the lead and would pass even if the producer
  //     had never run at all.
  test('12. fresh project, no role → producer cold-start, then the lead', async () => {
    const proj = makeProject({ fresh: true });
    try {
      const r = await runFkit([], { project: proj, extraEnv: { FKIT_STUB_INITIATE: pmPath(proj) } });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      assert.equal(r.argvs.length, 2,
        `expected the producer cold start THEN the lead, got ${r.argvs.length} claude invocation(s)`);

      const [producer, lead] = r.argvs;
      assert.deepEqual(producer.slice(0, 4),
        ['--agent', 'fkit-producer', '--settings', '.fkit/settings/producer.json']);
      assert.equal(producer.length, 5, 'expected a trailing seed prompt arg');
      assert.match(producer[4], /fresh fkit project/i, 'the cold-start seed must be passed to claude');

      // The lead is opened by the launcher's ordinary tail — its own settings file, and NO seed.
      assert.deepEqual(lead,
        ['--agent', 'fkit-lead', '--settings', '.fkit/settings/lead.json']);
    } finally {
      cleanup(proj);
    }
  });

  // 12b. The OTHER cold-start seed — the one used when the terminal intake captured answers. Nothing
  //      tested it before this: test 12 runs headless, so .fkit/interview exits without writing
  //      .fkit/intake.md and only the no-intake branch was ever exercised. Pre-creating intake.md is
  //      exactly what a completed intake leaves behind, and interview's own `[ -f "$out" ] && exit 0`
  //      guard means it survives the run untouched.
  test('12b. fresh project with a completed intake → the intake-aware seed', async () => {
    const proj = makeProject({ fresh: true });
    try {
      mkdirSync(join(proj, '.fkit'), { recursive: true });
      writeFileSync(join(proj, '.fkit', 'intake.md'), '# intake\n\n1. Project name?\n> Test\n');
      const r = await runFkit([], { project: proj, extraEnv: { FKIT_STUB_INITIATE: pmPath(proj) } });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);

      // ⚠️ THE LEAD HAND-OFF IS ASSERTED HERE TOO, NOT ONLY IN TEST 12 — and this is the copy that
      // matters. Test 12 covers the headless/no-intake path (CI, no tty); an owner sitting at a real
      // terminal completes .fkit/interview and therefore walks THIS one. While 12b asserted argvs[0]
      // alone, a launcher that restored `exec` on the intake-present branch only — deleting the lead
      // hand-off for every human who answers the intake, and for nobody else — passed the whole suite
      // 43/43 green (measured). The seed assertions below cannot see it: the producer phase is
      // byte-identical under that mutant. Only the second invocation is.
      assert.equal(r.argvs.length, 2,
        `expected the intake cold start THEN the lead, got ${r.argvs.length} claude invocation(s)`);

      const [producer, lead] = r.argvs;
      assert.deepEqual(producer.slice(0, 4),
        ['--agent', 'fkit-producer', '--settings', '.fkit/settings/producer.json']);
      assert.equal(producer.length, 5, 'expected a trailing seed prompt arg');
      assert.match(producer[4], /intake\.md/i,
        'with an intake on disk the seed must point the producer at it');
      assert.match(producer[4], /READ THAT FILE FIRST/,
        'the intake seed must tell the producer not to re-ask what the intake already answers');

      // Same tail as test 12's: the lead's own settings file, and NO seed.
      assert.deepEqual(lead,
        ['--agent', 'fkit-lead', '--settings', '.fkit/settings/lead.json']);
    } finally {
      cleanup(proj);
    }
  });

  // 12c. The hand-off is GATED, half one: the producer exited clean but the tree is STILL FRESH — the
  //      owner said "skip setup", or the initiation never finished. Landing them in a lead session
  //      they did not ask for, on a project that was never initiated, is worse than the shell prompt.
  //      So: exactly ONE invocation, and no lead.
  test('12c. cold start that does not initiate → no lead hand-off', async () => {
    const proj = makeProject({ fresh: true });
    try {
      const r = await runFkit([], { project: proj });     // stub writes nothing → tree stays fresh
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      assert.equal(r.argvs.length, 1,
        'a cold start that did not initiate the project must NOT open a second session');
      assert.equal(r.argvs[0][1], 'fkit-producer');
      // "Exit exactly as today" makes the CLEAN bail's 0 contractual, not incidental — pre-0379 the
      // `exec`'d producer returned exactly this. 12d pins the non-zero side (130), so without this a
      // change that only altered the zero case would stay green: measured, a bail rewritten to exit 7
      // passed 43/43. The bail is the owner declining setup; it is not an error.
      assert.equal(r.code, 0, 'a clean bail must exit 0 — the owner declining setup is not a failure');
    } finally {
      cleanup(proj);
    }
  });

  // 12d. The hand-off is GATED, half two: the tree IS initiated but the producer exited non-zero —
  //      a Ctrl-C partway through, after PROJECT.md had already been written. The exit code is its
  //      own fact; without it the launcher would cheerfully open the lead on an interrupted run. Also
  //      pins that the launcher exits WITH the cold start's code rather than swallowing it, which is
  //      what `exec` used to give for free.
  test('12d. initiated tree but a non-zero cold start → no lead hand-off, code propagated', async () => {
    const proj = makeProject({ fresh: true });
    try {
      const r = await runFkit([], {
        project: proj,
        extraEnv: { FKIT_STUB_INITIATE: pmPath(proj), FKIT_STUB_EXIT: '130' },
      });
      assert.equal(r.exec, true, `stderr: ${r.stderr}`);
      assert.equal(r.argvs.length, 1,
        'an interrupted cold start must NOT open a second session, even if the tree now looks initiated');
      assert.equal(r.code, 130, 'the launcher must exit with the cold start\'s own exit code');
    } finally {
      cleanup(proj);
    }
  });
});

// =================================================================================================
// Group D — fkit coder's plan-review session line (ADR-060; task 0543, cases OK'd by the owner by
// name). The launcher consumes --no-plan-review / --plan-review after `coder` only, and writes the
// on or off line into a file it hands claude with --append-system-prompt-file.
// =================================================================================================
describe('Group D — plan-review session line', () => {
  const ON_LINE = /^fkit session: coder · Plan review: on — the default for fkit coder sessions \(owner ruling 2026-10-24, ADR-060\), launched \d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/;
  const OFF_LINE = /^fkit session: coder · Plan review: off — fkit coder --no-plan-review \(owner, at launch \d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\)$/;
  const BASE = ['--agent', 'fkit-coder', '--settings', '.fkit/settings/coder.json'];
  const lineIn = (state) => readFileSync(join(PROJECT, lineFile(state)), 'utf8').trimEnd();

  test('D1. `fkit coder` → the on line, passed by file', async () => {
    const r = await runFkit(['coder'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, [...BASE, LINE_FLAG, lineFile('on')]);
    assert.match(lineIn('on'), ON_LINE);
  });

  test('D2. `fkit coder --no-plan-review` → consumed; the off line', async () => {
    const r = await runFkit(['coder', '--no-plan-review'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, [...BASE, LINE_FLAG, lineFile('off')]);
    assert.match(lineIn('off'), OFF_LINE);
  });

  test('D3. `fkit coder --plan-review` → a consumed no-op; the on line', async () => {
    const r = await runFkit(['coder', '--plan-review'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, [...BASE, LINE_FLAG, lineFile('on')]);
  });

  test("D4. both flags together → usage error, claude NEVER exec'd", async () => {
    const r = await runFkit(['coder', '--no-plan-review', '--plan-review'], { project: PROJECT });
    assert.notEqual(r.code, 0);
    assert.equal(r.exec, false);
    assert.match(r.stderr, /together/);
  });

  for (const [role, flag] of [['lead', '--no-plan-review'], ['architect', '--plan-review']]) {
    test(`D5. \`fkit ${role} ${flag}\` → usage error, claude NEVER exec'd`, async () => {
      const r = await runFkit([role, flag], { project: PROJECT });
      assert.notEqual(r.code, 0);
      assert.equal(r.exec, false);
      assert.match(r.stderr, /only after coder/);
    });
  }

  test("D6. the owner's own --append-system-prompt passes through unchanged", async () => {
    const r = await runFkit(['coder', '--append-system-prompt', 'X'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, [...BASE, LINE_FLAG, lineFile('on'), '--append-system-prompt', 'X']);
  });

  test('D7. `fkit coder --resume` still passes through', async () => {
    const r = await runFkit(['coder', '--resume'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, [...BASE, LINE_FLAG, lineFile('on'), '--resume']);
  });

  test('D8. after a `--` separator the token is the owner\'s literal text', async () => {
    const r = await runFkit(['coder', '--', '--no-plan-review'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, [...BASE, LINE_FLAG, lineFile('on'), '--', '--no-plan-review']);
  });

  for (const args of [['--append-system-prompt-file', 'f'], ['--append-system-prompt-file=f']]) {
    test(`D9. \`fkit coder ${args.join(' ')}\` → usage error, claude NEVER exec'd`, async () => {
      const r = await runFkit(['coder', ...args], { project: PROJECT });
      assert.notEqual(r.code, 0);
      assert.equal(r.exec, false);
      assert.match(r.stderr, /--append-system-prompt instead/);
    });
  }

  // D10 — no other role carries the line: test 1 / 1b pin every other role's argv exactly.

  // D11–D13: review R1, OK'd by the owner by name (2026-10-27).
  test("D11. the token is taken out even as another option's value", async () => {
    const r = await runFkit(['coder', '--append-system-prompt', '--no-plan-review'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, [...BASE, LINE_FLAG, lineFile('off'), '--append-system-prompt']);
  });

  test('D12. `fkit lead -- --no-plan-review` passes through: no usage error after `--`', async () => {
    const r = await runFkit(['lead', '--', '--no-plan-review'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, ['--agent', 'fkit-lead', '--settings', '.fkit/settings/lead.json', '--', '--no-plan-review']);
  });

  test('D13. the token is taken out wherever it sits; the other args keep their order', async () => {
    const r = await runFkit(['coder', '--resume', '--no-plan-review', '--debug'], { project: PROJECT });
    assert.equal(r.exec, true, `stderr: ${r.stderr}`);
    assert.deepEqual(r.argv, [...BASE, LINE_FLAG, lineFile('off'), '--resume', '--debug']);
  });
});

function configuredFixture() {
  const root = mkdtempSync(join(tmpdir(), 'fkit-runtime-contract-'));
  const bin = join(root, 'bin');
  mkdirSync(bin);
  writeFileSync(join(bin, 'node'), '#!/bin/sh\nexec "' + process.execPath + '" "$@"\n', { mode: 0o755 });
  for (const runtime of ['codex', 'claude']) {
    const script = `#!${process.execPath}
const fs=require('node:fs');
const args=process.argv.slice(2);
fs.appendFileSync('cli-requests.jsonl',JSON.stringify(['${runtime}',args])+'\\n');
if(args.includes('--version')){console.log('${runtime === 'codex' ? 'codex-cli 0.165.0' : '2.1.312 (Claude Code)'}');process.exit(0)}
if(args[0]==='login')process.exit(0);
if(args[0]==='debug' && args[1]==='models'){console.log(JSON.stringify({models:[{slug:'chosen-codex',supported_reasoning_levels:[{effort:'low'},{effort:'high'}]}]}));process.exit(0)}
fs.writeFileSync('${runtime}-call.json',JSON.stringify(args));
if(process.env.FKIT_STUB_INITIATE && args.some(a=>a.includes('This is a fresh fkit project')))fs.writeFileSync(process.env.FKIT_STUB_INITIATE,'# Fixture initiated\\n');
const input=args[0]==='exec'||args.includes('--print')||args.includes('-p')?fs.readFileSync(0,'utf8'):'';
console.log(${runtime === 'claude' ? "JSON.stringify({is_error:false,result:'fixture-claude:'+input,modelUsage:{'observed-claude':{}}})" : "'fixture-codex:'+input"});
`;
    writeFileSync(join(bin, runtime), script, { mode: 0o755 });
  }
  const env = { ...process.env, PATH: `${bin}:/usr/bin:/bin`, FKIT_NO_UPDATE_CHECK: '1', FKIT_NO_SELF_HOST: '1' };
  const run = args => spawnSync('sh', [join(REPO, 'bin/fkit'), ...args], { cwd: root, env, encoding: 'utf8', timeout: 20000 });
  return { root, run, env, close: () => rmSync(root, { recursive: true, force: true }) };
}

const runtimePrompt = 'Runtime [1/codex, 2/claude, 0/cancel]: ';
const modelPrompt = runtime => `Default ${runtime} model ID [`;
const effortPrompt = 'Default effort [';
const customPrompt = 'Customize models or effort for individual roles?';
const savePrompt = 'Save these settings? [y/N] ';
const rolePrompt = 'Choose a role [1]: ';
const modelFile = root => join(root, '.fkit/model-settings.json');
const roleCalls = root => ['codex', 'claude'].filter(runtime => existsSync(join(root, runtime + '-call.json')));
const terminal = (f, steps, args = [], options = {}) => runTerminal(args, { project: f.root, env: f.env, steps, ...options });
function configurationSteps(runtime, save = 'y\n') {
  return [
    [runtimePrompt, runtime + '\n'], [modelPrompt(runtime), 'chosen-' + runtime + '\n'],
    ...(runtime === 'codex' ? [[effortPrompt, 'high\n']] : []),
    [customPrompt, 'n\n'], [savePrompt, save],
  ];
}

test('bare first use: real terminal rejects runtime blanks, invalid input, EOF and SIGINT without persistence', async () => {
  const f = configuredFixture();
  try {
    for (const [answer, code] of [['\n', 1], ['wrong\n', 1], ['constructor\n', 1], ['0\n', 0], ['cancel\n', 0], ['\x04', 1], ['\x03', 130]]) {
      const r = await terminal(f, [[runtimePrompt, answer]]);
      assert.equal(r.code, code, r.output + r.stderr);
      assert.equal(r.answered, 1, r.output + r.stderr);
      assert.equal(existsSync(join(f.root, '.fkit')), false);
      assert.deepEqual(roleCalls(f.root), []);
    }
    const retry = await terminal(f, [[runtimePrompt, '0\n']]);
    assert.equal(retry.code, 0, retry.output);
    assert.match(retry.output, /Choose a project runtime/);
  } finally { f.close(); }
});

test('bare first use: invalid configuration, later EOF/SIGINT and declined save never set up or launch', async () => {
  const f = configuredFixture();
  try {
    const base = [[runtimePrompt, 'codex\n'], [modelPrompt('codex'), '1\n']];
    const cases = [
      [[runtimePrompt, 'codex\n'], [modelPrompt('codex'), '99\n']],
      [...base, [effortPrompt, 'bogus\n']],
      [...base, [effortPrompt, 'high\n'], [customPrompt, 'y\n'], ['Roles to customize [', 'unknown\n']],
      [[runtimePrompt, 'codex\n'], [modelPrompt('codex'), '\x04']],
      [[runtimePrompt, 'claude\n'], [modelPrompt('claude'), '\x03']],
      configurationSteps('codex', '\x04'),
      configurationSteps('claude', '\x03'),
      configurationSteps('codex', 'n\n'),
      configurationSteps('claude', '\n'),
    ];
    for (const steps of cases) {
      const last = steps.at(-1)[1];
      const expected = last === '\x03' ? 130 : ['n\n', '\n'].includes(last) ? 0 : 1;
      const r = await terminal(f, steps);
      assert.equal(r.code, expected, r.output + r.stderr);
      assert.equal(r.answered, steps.length, r.output);
      assert.equal(existsSync(join(f.root, '.fkit')), false);
      assert.equal(existsSync(join(f.root, '.gitignore')), false);
      assert.deepEqual(roleCalls(f.root), []);
    }
    assert.equal((await terminal(f, [[runtimePrompt, '0\n']])).code, 0);
  } finally { f.close(); }
});

test('bare first use: each runtime saves once and continues fresh onboarding or existing-project menu', async () => {
  for (const runtime of ['codex', 'claude']) for (const fresh of [true, false]) {
    const f = configuredFixture();
    try {
      const pm = join(f.root, 'ai-agents/knowledge-base/PROJECT.md');
      if (!fresh) {
        mkdirSync(dirname(pm), { recursive: true });
        writeFileSync(pm, '# Owner project\n');
      } else f.env.FKIT_STUB_INITIATE = pm;
      writeFileSync(join(f.root, 'AGENTS.md'), '# Owner instructions\n');
      writeFileSync(join(f.root, 'source.txt'), 'source unchanged\n');
      const steps = configurationSteps(runtime);
      if (runtime === 'codex') {
        steps[3][1] = 'y\n';
        steps.splice(4, 0, ['Roles to customize [', 'wiki\n'], ['wiki model [', '\n'], ['wiki effort [', 'low\n'], ['Roles to customize [', 'done\n']);
        rmSync(join(f.root, 'bin/claude'));
      }
      if (fresh) {
        for (const prompt of ['1. Project name?', '2. What is it,', '3. Who is it for,', '4. What stage is it?', '5. Near-term goal', '6. Key constraints,']) steps.push([prompt, '\n']);
      } else steps.push([rolePrompt, 'wiki\n']);
      const r = await terminal(f, steps);
      assert.equal(r.code, 0, r.output + r.stderr);
      assert.equal(r.answered, steps.length, r.output);
      assert.equal(r.output.split(savePrompt).length - 1, 1, r.output);
      const saved = readFileSync(modelFile(f.root), 'utf8'), value = JSON.parse(saved);
      assert.equal(value.default.runtime, runtime);
      assert.equal(value.default.model, 'chosen-' + runtime);
      assert.equal(value.default.reasoningEffort, runtime === 'codex' ? 'high' : undefined);
      if (runtime === 'codex') assert.deepEqual(value.roles.wiki, { reasoningEffort: 'low' });
      const args = JSON.parse(readFileSync(join(f.root, runtime + '-call.json')));
      assert.equal(args[args.indexOf('--model') + 1], 'chosen-' + runtime);
      if (runtime === 'codex') assert.ok(args.includes(`model_reasoning_effort="${fresh ? 'high' : 'low'}"`));
      if (fresh) {
        assert.match(readFileSync(pm, 'utf8'), /Fixture initiated/);
        assert.ok(existsSync(join(f.root, '.fkit/intake.md')));
        const calls = readFileSync(join(f.root, 'cli-requests.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
        assert.equal(calls.filter(([, argv]) => argv.some(a => a.includes('This is a fresh fkit project'))).length, 1);
        if (runtime === 'codex') assert.ok(args.some(a => a.includes('Begin this interactive fkit-lead session')), JSON.stringify(args));
        else assert.ok(args.includes('fkit-lead'), JSON.stringify(args));
      } else assert.equal(readFileSync(pm, 'utf8'), '# Owner project\n');
      assert.ok(existsSync(join(f.root, '.agents/skills/fkit-query/SKILL.md')));
      assert.ok(readFileSync(join(f.root, 'AGENTS.md'), 'utf8').startsWith('# Owner instructions\n'));
      assert.equal(readFileSync(join(f.root, 'source.txt'), 'utf8'), 'source unchanged\n');
      const repeat = await terminal(f, [[rolePrompt, 'wiki\n']]);
      assert.equal(repeat.code, 0, repeat.output);
      assert.doesNotMatch(repeat.output, /Choose a project runtime|Save these settings/);
      assert.equal(readFileSync(modelFile(f.root), 'utf8'), saved);
    } finally { f.close(); }
  }
});

test('bare first use: saved mixed overrides skip configuration, refresh managed files and preserve owner bytes', async () => {
  const f = configuredFixture();
  try {
    mkdirSync(join(f.root, '.fkit'));
    const saved = JSON.stringify({ schemaVersion: 1, default: { runtime: 'codex', model: 'chosen-codex', reasoningEffort: 'high' }, roles: { wiki: { runtime: 'claude', model: null }, coder: { model: null, reasoningEffort: null } } });
    writeFileSync(modelFile(f.root), saved);
    const paths = {
      'ai-agents/knowledge-base/PROJECT.md': '# Owner project\n',
      'ai-agents/wiki-vault/owner.md': 'wiki bytes\n',
      '.codex/config.toml': '# owner config\n',
      '.agents/skills/owner/SKILL.md': '# unowned\n',
      'source.txt': 'source bytes\n',
    };
    for (const [path, text] of Object.entries(paths)) {
      mkdirSync(dirname(join(f.root, path)), { recursive: true });
      writeFileSync(join(f.root, path), text);
    }
    for (const role of ['wiki', 'coder']) {
      if (role === 'coder') {
        const resource = join(f.root, '.agents/skills/fkit-query/SKILL.md');
        writeFileSync(resource, readFileSync(resource, 'utf8') + '\nSTALE RESOURCE\n');
      }
      const r = await terminal(f, [[rolePrompt, role + '\n']]);
      assert.equal(r.code, 0, r.output);
      assert.doesNotMatch(r.output, /Choose a project runtime|Save these settings/);
      assert.equal(readFileSync(modelFile(f.root), 'utf8'), saved);
      const args = JSON.parse(readFileSync(join(f.root, role === 'wiki' ? 'claude-call.json' : 'codex-call.json')));
      assert.ok(!args.includes('--model'));
      assert.ok(!args.some(a => a.includes('model_reasoning_effort')));
      for (const [path, text] of Object.entries(paths)) assert.equal(readFileSync(join(f.root, path), 'utf8'), text);
    }
    assert.doesNotMatch(readFileSync(join(f.root, '.agents/skills/fkit-query/SKILL.md'), 'utf8'), /STALE RESOURCE/);
    for (const steps of [
      [[modelPrompt('codex'), '\x04']],
      [[modelPrompt('codex'), '\x03']],
      [[modelPrompt('codex'), '\n'], [effortPrompt, '\n'], [customPrompt, 'n\n'], [savePrompt, 'n\n']],
      [[modelPrompt('codex'), '\n'], [effortPrompt, 'bogus\n']],
    ]) {
      const r = await terminal(f, steps, ['configure']);
      assert.equal(r.code, steps[0][1] === '\x03' ? 130 : steps.at(-1)[1] === 'n\n' ? 0 : 1, r.output);
      assert.equal(readFileSync(modelFile(f.root), 'utf8'), saved);
    }
  } finally { f.close(); }
});

test('bare first use: invalid existing files and unavailable runtimes never reconfigure or launch', async () => {
  const f = configuredFixture();
  try {
    mkdirSync(join(f.root, '.fkit'));
    const file = modelFile(f.root);
    for (const text of ['{corrupt', '{"schemaVersion":99}', JSON.stringify({schemaVersion:1,default:{runtime:'claude',model:null,reasoningEffort:'high'},roles:{}})]) {
      writeFileSync(file, text);
      const r = await terminal(f, []);
      assert.equal(r.code, 1, r.output);
      assert.doesNotMatch(r.output, /Choose a project runtime|Save these settings/);
      assert.equal(readFileSync(file, 'utf8'), text);
    }
    rmSync(file);
    mkdirSync(file);
    assert.equal((await terminal(f, [])).code, 1);
    rmSync(file, { recursive: true });
    assert.equal(spawnSync('mkfifo', [file]).status, 0);
    assert.equal((await terminal(f, [])).code, 1);
    rmSync(file);
    const target = join(f.root, 'owner-settings');
    writeFileSync(target, 'owner bytes');
    symlinkSync(target, file);
    assert.equal((await terminal(f, [])).code, 1);
    assert.equal(readFileSync(target, 'utf8'), 'owner bytes');
    rmSync(file);
    symlinkSync(join(f.root, 'missing-target'), file);
    assert.equal((await terminal(f, [])).code, 1);
    rmSync(file);
    rmSync(join(f.root, '.fkit'), { recursive: true });
    for (const runtime of ['codex', 'claude']) writeFileSync(join(f.root, 'bin', runtime), '#!/bin/sh\nexit 127\n');
    for (const runtime of ['codex', 'claude']) {
      const r = await terminal(f, [[runtimePrompt, runtime + '\n']]);
      assert.equal(r.code, 1, r.output);
      assert.match(r.output, /CLI is unavailable/);
      assert.equal(existsSync(modelFile(f.root)), false);
    }
    assert.deepEqual(roleCalls(f.root), []);
  } finally { f.close(); }
});

test('bare first use: management, explicit routes and partial terminal fds preserve their contracts', async () => {
  const f = configuredFixture();
  try {
    mkdirSync(join(f.root, 'ai-agents/knowledge-base'), { recursive: true });
    writeFileSync(join(f.root, 'ai-agents/knowledge-base/PROJECT.md'), '# Existing project\n');
    for (const args of [['--help'], ['board', '--help'], ['update'], ['--update'], ['upgrade'], ['--upgrade'], ['self-update'], ['settings'], ['models'], ['--preview'], ['unknown-role']]) {
      const r = f.run(args);
      assert.doesNotMatch(r.stdout + r.stderr, /Choose a project runtime|Save these settings/);
      assert.equal(existsSync(modelFile(f.root)), false);
      assert.deepEqual(roleCalls(f.root), []);
    }
    for (const [stdinTty, stdoutTty] of [[false, true], [true, false], [false, false]]) {
      const r = await terminal(f, [['role [1-7, Enter=lead, q to quit]: ', 'q\n']], [], { stdinTty, stdoutTty });
      assert.equal(r.code, 0, r.output + r.stderr);
      assert.equal(r.answered, 1, r.output);
      assert.doesNotMatch(r.output, /Choose a project runtime/);
      assert.equal(existsSync(modelFile(f.root)), false);
    }
    for (const [args, entry] of [
      [['--runtime', 'codex'], join(REPO, 'bin/fkit')],
      [[], join(REPO, 'bin/fkit-codex')],
      [['--root', f.root], join(REPO, 'bin/fkit')],
    ]) {
      const r = await terminal(f, [[modelPrompt('codex'), '\x04']], args, { entry });
      assert.equal(r.code, 1, r.output);
      assert.doesNotMatch(r.output, /Choose a project runtime/);
    }
    const target = mkdtempSync(join(tmpdir(), 'fkit-target-root-'));
    try {
      const configure = f.run(['configure', '--root', target, '--runtime', 'claude', '--runtime-default']);
      assert.equal(configure.status, 0, configure.stderr);
      assert.equal(JSON.parse(readFileSync(modelFile(target), 'utf8')).default.runtime, 'claude');
      const preview = f.run(['--runtime', 'codex', 'lead', '--root', target, '--preview']);
      assert.equal(preview.status, 0, preview.stderr);
      const resolved = JSON.parse(preview.stdout);
      assert.equal(resolved.root, target);
      assert.deepEqual(resolved.settings, { runtime: 'codex', model: null });
      assert.equal(existsSync(modelFile(f.root)), false);
    } finally { rmSync(target, { recursive: true, force: true }); }
    let r = f.run(['coder', '--debug']);
    assert.equal(r.status, 0, r.stderr);
    let args = JSON.parse(readFileSync(join(f.root, 'claude-call.json')));
    assert.ok(args.includes('fkit-coder') && args.includes('--debug'));
    r = f.run([]);
    assert.equal(r.status, 0, r.stderr);
    args = JSON.parse(readFileSync(join(f.root, 'claude-call.json')));
    assert.ok(args.includes('fkit-lead'));
    assert.equal(existsSync(modelFile(f.root)), false);
  } finally { f.close(); }
});

test('bare first use: missing Node stops only the new entry, and old Codex stops before save', async () => {
  const f = configuredFixture();
  try {
    const noNode = join(f.root, 'no-node');
    mkdirSync(noNode);
    for (const tool of ['dirname']) symlinkSync('/usr/bin/' + tool, join(noNode, tool));
    const r = await terminal(f, [], [], { env: { ...f.env, PATH: noNode } });
    assert.equal(r.code, 1, r.output);
    assert.match(r.output, /fkit: first-use configuration needs Node.js\. Install Node.js, then run fkit again\./);
    assert.equal(existsSync(join(f.root, '.fkit')), false);
    assert.deepEqual(roleCalls(f.root), []);
    writeFileSync(join(f.root, 'bin/codex'), '#!/bin/sh\necho codex-cli 0.164.0\n');
    const old = await terminal(f, [[runtimePrompt, 'codex\n']]);
    assert.equal(old.code, 1, old.output);
    assert.match(old.output, /0.165.0 or newer stable/);
    assert.equal(existsSync(modelFile(f.root)), false);
  } finally { f.close(); }
});

test('configured runtimes: direct roles select their own CLI/model and preserve saved settings', () => {
  const f = configuredFixture();
  try {
    let r = f.run(['configure', '--runtime', 'codex', '--model', 'chosen-codex', '--effort', 'high', '--role-effort', 'adversarial-reviewer=low', '--role-runtime', 'wiki=claude', '--role-model', 'wiki=chosen-claude']);
    assert.equal(r.status, 0, r.stderr);
    const file = join(f.root, '.fkit/model-settings.json');
    const saved = readFileSync(file, 'utf8');
    r = f.run(['wiki', '--exec', 'bounded wiki scope']);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /fixture-claude:bounded wiki scope/);
    const claude = JSON.parse(readFileSync(join(f.root, 'claude-call.json')));
    assert.equal(claude[claude.indexOf('--model') + 1], 'chosen-claude');
    assert.ok(!claude.includes('chosen-codex'));
    assert.ok(!claude.some(arg => arg.includes('model_reasoning_effort')));
    r = f.run(['coder', '--exec', 'bounded coder scope']);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /fixture-codex:bounded coder scope/);
    const codex = JSON.parse(readFileSync(join(f.root, 'codex-call.json')));
    assert.equal(codex[codex.indexOf('--model') + 1], 'chosen-codex');
    assert.ok(codex.includes('model_reasoning_effort="high"'));
    assert.ok(!codex.some(arg => arg.startsWith('hooks.') || arg.includes('/codex/hook.mjs')));
    const codexSettings = { schemaVersion: 1, default: { runtime: 'codex', model: 'chosen-codex', reasoningEffort: 'high' }, roles: {} };
    for (const role of ROLES) for (const headless of [false, true]) {
      const args = launchArgs(f.root, role, codexSettings, 'bounded hook-free scope', headless);
      assert.ok(!args.some(arg => arg.startsWith('hooks.') || arg.includes('/codex/hook.mjs')), `${role}/${headless}: hooks must remain disabled`);
      assert.ok(args.includes('features.multi_agent=false'));
      assert.ok(args.includes('model_reasoning_effort="high"'));
      const binding = args.find(arg => arg.startsWith('developer_instructions='));
      assert.match(binding, /disabled fkit's Codex PreToolUse and Stop hooks/);
      assert.match(binding, /End owner replies with What's next/);
      if (headless) assert.equal(args.at(-1), '-');
      else assert.deepEqual(args.slice(-2), ['--', 'bounded hook-free scope']);
      const defaultArgs = launchArgs(f.root, role, codexSettings, undefined, headless);
      if (headless) assert.equal(defaultArgs.at(-1), '-');
      else {
        assert.equal(defaultArgs.at(-2), '--');
        assert.match(defaultArgs.at(-1), new RegExp(`Begin this interactive fkit-${role} session`));
        assert.match(defaultArgs.at(-1), /role name, not a skill to request/);
        assert.ok(!defaultArgs.at(-1).includes('.claude/skills/'));
        if (role === 'lead') assert.match(defaultArgs.at(-1), /Greet the owner as the fkit lead and conductor/);
      }
    }
    for (const alias of ['adv', 'adversarial']) {
      r = f.run([alias, '--exec', 'bounded hostile scope']);
      assert.equal(r.status, 0, r.stderr);
      const args = JSON.parse(readFileSync(join(f.root, 'codex-call.json')));
      assert.equal(args[args.indexOf('--sandbox') + 1], 'read-only');
      assert.ok(args.includes('model_reasoning_effort="low"'));
    }
    r = f.run(['--runtime', 'claude', 'lead', '--preview']);
    assert.equal(r.status, 0, r.stderr);
    const preview = JSON.parse(r.stdout);
    assert.equal(preview.settings.runtime, 'claude');
    assert.equal(preview.settings.model, null);
    assert.equal(readFileSync(file, 'utf8'), saved);
  } finally { f.close(); }
});

test('configured owner questions: single-field choices and explicit custom answers preserve consent', async () => {
  const fixture = () => {
    const forms = [];
    const owner = new OwnerQuestions(message => forms.push(message));
    owner.initialize({ elicitation: { form: {} } });
    const ask = () => owner.ask({ question: 'Synthetic choice only', options: ['Propose checks', 'Explain more, then ask again'] }, 42);
    const accept = (index, answer) => owner.respond({ id: forms[index].id, result: { action: 'accept', content: { answer } } });
    return { owner, forms, ask, accept };
  };
  const f = fixture();
  const pending = f.ask();
  assert.deepEqual(Object.keys(f.forms[0].params.requestedSchema.properties), ['answer']);
  assert.deepEqual(f.forms[0].params.requestedSchema.required, ['answer']);
  f.accept(0, 'Propose checks');
  assert.deepEqual(await pending, { action: 'accept', answered: true, answer: 'Propose checks', comment: '', instruction: 'Relay exactly. A question, request for explanation, or alternative is not approval of a plan.' });
  assert.equal(f.forms.length, 1);
  for (const response of ['text', 'cancel', 'empty', 'interrupt']) {
    const c = fixture();
    let settled = false;
    const result = c.ask().finally(() => { settled = true; });
    c.accept(0, 'Write another answer');
    await Promise.resolve();
    assert.equal(settled, false);
    assert.equal(c.forms.length, 2);
    assert.deepEqual(Object.keys(c.forms[1].params.requestedSchema.properties), ['answer']);
    assert.equal(c.forms[1].params.requestedSchema.properties.answer.minLength, 1);
    if (response === 'text') {
      c.accept(1, 'Explain this; no changes yet.');
      const reply = await result;
      assert.equal(reply.answer, 'Write another answer');
      assert.equal(reply.comment, 'Explain this; no changes yet.');
    } else if (response === 'cancel') {
      c.owner.respond({ id: c.forms[1].id, result: { action: 'cancel' } });
      assert.equal((await result).answered, false);
    } else if (response === 'empty') {
      c.accept(1, '   ');
      assert.equal((await result).answered, false);
    } else {
      c.owner.cancel(42);
      await assert.rejects(result, /no answer or approval/);
      assert.equal(c.accept(1, 'Late response'), false);
    }
    assert.equal(c.owner.pending.size, 0);
  }
  const free = fixture();
  const freeResult = free.owner.ask({ question: 'Describe your goal' }, 43);
  assert.equal(free.forms[0].params.requestedSchema.properties.answer.enum, undefined);
  free.accept(0, 'Write another answer');
  assert.equal((await freeResult).answer, 'Write another answer');
  assert.equal(free.forms.length, 1);
  const invalid = fixture();
  const invalidResult = invalid.ask();
  invalid.accept(0, 'Unknown choice');
  await assert.rejects(invalidResult, /Invalid owner response/);
});

test('configured effort: reset/inherit are distinct and invalid choices preserve saved files', () => {
  const f = configuredFixture();
  try {
    let r = f.run(['configure', '--model', 'chosen-codex', '--effort', 'high', '--role-effort', 'wiki=low']);
    assert.equal(r.status, 0, r.stderr);
    const file = join(f.root, '.fkit/model-settings.json');
    r = f.run(['settings']);
    assert.match(r.stdout, /lead: codex \/ chosen-codex \/ effort: high/);
    assert.match(r.stdout, /wiki: codex \/ chosen-codex \/ effort: low/);
    r = f.run(['configure', '--role-effort', 'wiki=default']);
    assert.equal(r.status, 0, r.stderr);
    r = f.run(['wiki', '--preview']);
    assert.equal(JSON.parse(r.stdout).settings.reasoningEffort, null);
    r = f.run(['configure', '--role-effort', 'wiki=inherit']);
    assert.equal(r.status, 0, r.stderr);
    r = f.run(['wiki', '--preview']);
    assert.equal(JSON.parse(r.stdout).settings.reasoningEffort, 'high');
    const saved = readFileSync(file, 'utf8');
    for (const flags of [['--effort', 'ultra'], ['--effort', 'bogus'], ['--role-effort', 'wiki=ultra'], ['--role-runtime', 'wiki=claude', '--role-effort', 'wiki=high']]) {
      r = f.run(['configure', ...flags]);
      assert.equal(r.status, 1, r.stdout);
      assert.equal(readFileSync(file, 'utf8'), saved);
    }
    assert.equal(existsSync(join(f.root, 'codex-call.json')), false);
    assert.equal(existsSync(join(f.root, 'claude-call.json')), false);
    r = f.run(['configure', '--effort', 'default']);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(JSON.parse(readFileSync(file, 'utf8')).default.reasoningEffort, undefined);
    r = f.run(['wiki', '--exec', 'bounded default-effort scope']);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(!JSON.parse(readFileSync(join(f.root, 'codex-call.json'))).some(arg => arg.includes('model_reasoning_effort')));
  } finally { f.close(); }
});

test('configured interview: model-specific effort, role customization, blanks and unknown catalogs', async t => {
  const output = [];
  t.mock.method(console, 'log', line => output.push(line));
  const models = parseCatalog({ models: [
    { slug: 'chosen-codex', supported_reasoning_levels: [{ effort: 'low' }, { effort: 'high' }] },
    { slug: 'small-codex', supported_reasoning_levels: [{ effort: 'low' }] },
  ] });
  const value = { schemaVersion: 1, default: { runtime: 'codex', model: null }, roles: {} };
  const answers = ['1', '2', 'y', '7, wiki', '2', '1', 'done'];
  const questions = [];
  const visibleMenus = [];
  await interviewSettings(value, { models, available: true }, async prompt => { questions.push(prompt); visibleMenus.push(output.join('\n')); return answers.shift(); });
  assert.equal(answers.length, 0);
  assert.equal(value.default.model, 'chosen-codex');
  assert.equal(value.default.reasoningEffort, 'high');
  assert.deepEqual(value.roles.wiki, { model: 'small-codex', reasoningEffort: 'low' });
  assert.match(questions[1], /Default effort/);
  assert.match(questions[5], /wiki effort/);
  assert.match(questions[4], /number or exact ID/);
  assert.match(visibleMenus[4], /wiki model choices:\nLocal Codex model catalog[^\n]*\n1\. chosen-codex — chosen-codex\n2\. small-codex — small-codex/);
  assert.match(visibleMenus[5], /wiki reasoning effort:\n1\. low$/);
  assert.match(questions[5], /number or name/);
  const saved = structuredClone(value);
  const multiple = ['', '', 'y', '1,5', '', '', '', '', '0'];
  await interviewSettings(value, { models, available: true }, async () => multiple.shift());
  assert.equal(multiple.length, 0);
  assert.deepEqual(value, saved);
  const skip = ['', '', 'y', ''];
  await interviewSettings(value, { models, available: true }, async () => skip.shift());
  assert.deepEqual(value, saved);
  for (const selection of ['8', '-1', 'unknown-role', '1 nope', '0,7']) {
    const invalid = ['', '', 'y', selection];
    await assert.rejects(interviewSettings(value, { models, available: true }, async () => invalid.shift()), /Invalid role selection/);
    assert.deepEqual(value, saved);
  }
  const blanks = ['', '', 'y', 'wiki', '', '', ''];
  await interviewSettings(value, { models, available: true }, async () => blanks.shift());
  assert.deepEqual(value, saved);
  const rounds = ['', '', 'y', '3', '1', 'low', '7', '2', 'low', '3', '', 'high', '0'];
  const roundPrompts = [];
  await interviewSettings(value, { models, available: true }, async prompt => { roundPrompts.push(prompt); return rounds.shift(); });
  assert.equal(rounds.length, 0);
  assert.equal(roundPrompts.filter(prompt => prompt.startsWith('Roles to customize')).length, 4);
  assert.deepEqual(value.roles.coder, { model: 'chosen-codex', reasoningEffort: 'high' });
  assert.deepEqual(value.roles.wiki, { model: 'small-codex', reasoningEffort: 'low' });
  const unknown = { schemaVersion: 1, default: { runtime: 'codex', model: null }, roles: {} };
  const exact = ['exact-unknown-model', 'high', 'n'];
  await interviewSettings(unknown, { models: [], available: false }, async () => exact.shift());
  assert.equal(unknown.default.reasoningEffort, 'high');
  await assert.rejects(interviewSettings(saved, { models, available: true }, async prompt => prompt.startsWith('Default codex') ? '' : 'ultra'), /Invalid reasoning effort/);
  const claude = { schemaVersion: 1, default: { runtime: 'claude', model: null }, roles: {} };
  const claudePrompts = [];
  await interviewSettings(claude, { models, available: true }, async prompt => { claudePrompts.push(prompt); return ''; });
  assert.equal(claudePrompts.some(prompt => /effort \[/.test(prompt)), false);
});

test('configured runtimes: changing default retains existing role choices and invalid choices never launch', () => {
  const f = configuredFixture();
  try {
    let r = f.run(['configure', '--runtime-default', '--role-model', 'wiki=small-codex']);
    assert.equal(r.status, 0, r.stderr);
    r = f.run(['configure', '--runtime', 'claude', '--model', 'chosen-claude']);
    assert.equal(r.status, 0, r.stderr);
    const file = join(f.root, '.fkit/model-settings.json');
    const saved = readFileSync(file, 'utf8');
    const config = JSON.parse(saved);
    assert.deepEqual(config.default, { runtime: 'claude', model: 'chosen-claude' });
    assert.deepEqual(config.roles.wiki, { runtime: 'codex', model: 'small-codex' });
    r = f.run(['configure', '--role-runtime', 'wiki=unknown']);
    assert.equal(r.status, 1);
    assert.equal(readFileSync(file, 'utf8'), saved);
    assert.equal(existsSync(join(f.root, 'claude-call.json')), false);
    assert.equal(existsSync(join(f.root, 'codex-call.json')), false);
    writeFileSync(file, JSON.stringify({ ...config, roles: { wiki: { runtime: 'codex' } } }));
    r = f.run(['wiki', '--exec', 'must not launch']);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /runtime change requires an explicit model/);
    assert.equal(existsSync(join(f.root, 'codex-call.json')), false);
  } finally { f.close(); }
});

test('public dispatcher: an unconfigured project retains the existing Claude launcher contract', async () => {
  const project = makeProject();
  try {
    const r = await runFkit(['wiki', '-p', 'bounded legacy scope'], { project, launcher: join(REPO, 'bin/fkit') });
    assert.equal(r.code, 0, r.stderr);
    assert.equal(r.argv[r.argv.indexOf('--agent') + 1], 'fkit-wiki');
    assert.ok(r.argv.includes('bounded legacy scope'));
    assert.equal(existsSync(join(project, '.fkit/model-settings.json')), false);
  } finally { cleanup(project); }
});

test('configured delegation: fresh peers use their runtime, model and effort and report observed identity separately', async () => {
  const f = configuredFixture();
  let child;
  try {
    const setup = f.run(['configure', '--runtime-default', '--effort', 'high', '--role-effort', 'coder=low', '--role-runtime', 'wiki=claude', '--role-model', 'wiki=chosen-claude']);
    assert.equal(setup.status, 0, setup.stderr);
    child = spawn(process.execPath, [join(REPO, 'codex/server.mjs'), f.root, 'lead', '["lead"]'], { cwd: f.root, env: f.env, stdio: ['pipe', 'pipe', 'pipe'] });
    child.stderr.resume();
    const lines = createInterface({ input: child.stdout });
    const result = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error('delegation timed out')), 10000);
      child.on('error', error => { clearTimeout(timer); reject(error); });
      lines.on('line', line => { const message = JSON.parse(line); if (message.id === 1) { clearTimeout(timer); resolve(message.result); } });
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'fkit_consult', arguments: { role: 'wiki', prompt: 'bounded delegated wiki scope' } } }) + '\n');
    });
    assert.equal(result.isError, false);
    const text = result.content[0].text;
    assert.match(text, /Runtime: claude/);
    assert.match(text, /Model: observed-claude/);
    assert.match(text, /Model requested: chosen-claude/);
    assert.match(text, /fixture-claude:bounded delegated wiki scope/);
    assert.equal(existsSync(join(f.root, 'codex-call.json')), false);
    const codexResult = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error('Codex delegation timed out')), 10000);
      lines.on('line', line => { const message = JSON.parse(line); if (message.id === 2) { clearTimeout(timer); resolve(message.result); } });
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'fkit_consult', arguments: { role: 'coder', prompt: 'bounded delegated coder scope' } } }) + '\n');
    });
    assert.equal(codexResult.isError, false);
    assert.match(codexResult.content[0].text, /fixture-codex:bounded delegated coder scope/);
    assert.ok(JSON.parse(readFileSync(join(f.root, 'codex-call.json'))).includes('model_reasoning_effort="low"'));
    assert.ok(!JSON.parse(readFileSync(join(f.root, 'codex-call.json'))).some(arg => arg.startsWith('hooks.') || arg.includes('/codex/hook.mjs')));
    child.stdin.end();
    await new Promise(resolve => child.once('close', resolve));
  } finally { child?.kill('SIGTERM'); f.close(); }
});

test('public dispatcher: legacy path does not invoke Node from PATH; source checkout self-hosts', () => {
  const f = configuredFixture();
  const installRoot = mkdtempSync(join(tmpdir(), 'fkit-dispatch-install-'));
  const checkout = mkdtempSync(join(tmpdir(), 'fkit-dispatch-checkout-'));
  try {
    mkdirSync(join(f.root, 'ai-agents/knowledge-base'), { recursive: true });
    writeFileSync(join(f.root, 'ai-agents/knowledge-base/PROJECT.md'), '# Initiated fixture\n');
    writeFileSync(join(f.root, 'bin/node'), '#!/bin/sh\necho forbidden > node-called\nexit 98\n', { mode: 0o755 });
    const legacy = f.run(['wiki', '-p', 'bounded legacy']);
    assert.equal(legacy.status, 0, legacy.stderr);
    assert.equal(existsSync(join(f.root, 'node-called')), false);
    assert.equal(existsSync(join(f.root, '.fkit/model-settings.json')), false);
    for (const root of [installRoot, checkout]) {
      mkdirSync(join(root, 'bin')); mkdirSync(join(root, 'claude')); mkdirSync(join(root, 'codex'));
      writeFileSync(join(root, 'bin/fkit'), readFileSync(join(REPO, 'bin/fkit')), { mode: 0o755 });
    }
    writeFileSync(join(installRoot, 'claude/fkit-claude.sh'), '#!/bin/sh\necho wrong-installed-tree\n');
    writeFileSync(join(checkout, 'claude/fkit-claude.sh'), '#!/bin/sh\necho checkout-resource-used\n');
    writeFileSync(join(checkout, 'codex/fkit.mjs'), '// checkout marker\n');
    const r = spawnSync('sh', [join(installRoot, 'bin/fkit'), 'wiki'], { cwd: checkout, env: { ...process.env, FKIT_NO_SELF_HOST: '0' }, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /checkout-resource-used/);
    assert.ok(!r.stdout.includes('wrong-installed-tree'));
  } finally { f.close(); rmSync(installRoot, { recursive: true, force: true }); rmSync(checkout, { recursive: true, force: true }); }
});
