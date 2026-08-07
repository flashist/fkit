// The skill-ownership-hook contract suite — claude/skill-ownership-hook.sh (task 43 / ADR-018).
//
// SCOPE: the hook is a pure function of (PreToolUse JSON payload on stdin) -> (exit code, stderr).
// Tests as fixtures-in, exit-code-out — no model, no auth, no network, no live `claude` invocation.
//
// ⚠️ WHY DENY ASSERTIONS PIN THE EXACT JSON SHAPE, NOT JUST EXIT CODE. Owner decision, 2026-07-16
// (resolving round-1 review R1): the hook denies via the documented
// `hookSpecificOutput.permissionDecision:"deny"` JSON on stdout (exit 0), matching ADR-018 Decision 3
// verbatim — not `exit 2`, which an earlier version of this hook used instead. That JSON route is
// real but schema-fragile: it was live-verified to silently fail OPEN the first time it was tried,
// because that attempt omitted the required `hookEventName` field. Every deny test below therefore
// asserts exit 0 (never a bare exit code standing in for the decision) AND parses stdout to confirm
// `hookEventName:"PreToolUse"` and `permissionDecision:"deny"` are actually present — pinning exit
// code alone would not have caught the exact mistake that motivated switching to this shape in the
// first place.
//
// ⚠️ Invoked as `bash <path>`, never `./<path>` — same reasoning as dashboard-contract.test.js
// (ADR-017 rule 2): the exec bit is not guaranteed to survive the install/copy chain.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { REPO } from './harness.mjs';

// FKIT_SKILL_OWNERSHIP_HOOK lets prove-red.sh point this suite at a deliberately-mutated COPY of the
// hook script (mirroring FKIT_LAUNCHER's pattern for the launcher-contract suite) — round-1 review,
// R2: this is what makes a broken skills_for_role() entry provably caught again, now that role↔skill
// correctness lives in THIS file rather than in the old launcher-contract Group B matrix. The hook
// sources `skills-for-role.sh` via a path relative to its OWN location, so pointing this at a mutant
// copy's script automatically exercises that copy's own (mutated) skills-for-role.sh too — no second
// env var needed.
// ⚠️ Announce a non-default script to stderr, same reasoning as harness.mjs's FKIT_LAUNCHER guard: a
// stale inherited env var would otherwise make `npm test` silently test the wrong file and report green.
const DEFAULT_SCRIPT = join(REPO, 'claude', 'skill-ownership-hook.sh');
const SCRIPT = process.env.FKIT_SKILL_OWNERSHIP_HOOK || DEFAULT_SCRIPT;
if (SCRIPT !== DEFAULT_SCRIPT) {
  process.stderr.write(`[skill-ownership-hook.test.js] ⚠ testing NON-default script via FKIT_SKILL_OWNERSHIP_HOOK: ${SCRIPT}\n`);
}

function run(payload) {
  const r = spawnSync('bash', [SCRIPT], { input: payload, encoding: 'utf8' });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}

// assertDeny — the deny contract: exit 0 (never a bare exit code standing in for the decision, per
// ADR-018 Decision 3) AND a stdout JSON shape with the exact required fields. `hookEventName` is the
// one field a real prior mistake omitted and silently failed open on — pin it explicitly, every time.
function assertDeny(r, label) {
  assert.equal(r.code, 0, `expected deny-via-exit-0, got exit ${r.code} (stderr: ${r.err})`);
  let parsed;
  try {
    parsed = JSON.parse(r.out.trim());
  } catch (e) {
    assert.fail(`${label}: deny stdout is not valid JSON: ${JSON.stringify(r.out)} (${e.message})`);
  }
  const out = parsed.hookSpecificOutput;
  assert.ok(out, `${label}: missing hookSpecificOutput in deny stdout: ${r.out}`);
  assert.equal(out.hookEventName, 'PreToolUse', `${label}: wrong/missing hookEventName`);
  assert.equal(out.permissionDecision, 'deny', `${label}: wrong/missing permissionDecision`);
}

// assertAllow — the allow contract. ⚠️ Since deny is now signalled by exit 0 + JSON (not exit 2),
// exit code ALONE no longer distinguishes allow from deny — allow() also exits 0. A test that only
// checked `r.code === 0` would now pass just as "true" for an unowned skill that was actually denied,
// which is exactly the kind of gap that would have silently swallowed a real mis-scoped role. allow()
// emits no stdout at all, so an allow is exit 0 AND empty stdout — this is the assertion that must do
// the real work now.
function assertAllow(r, label) {
  assert.equal(r.code, 0, `${label}: expected allow, got exit ${r.code} (stderr: ${r.err})`);
  assert.equal(r.out.trim(), '', `${label}: expected allow (empty stdout), but got a decision on stdout: ${r.out}`);
}

function payload({ agentType, agentId, toolName = 'Skill', skill }) {
  const fields = [];
  fields.push('"session_id":"test-session"');
  fields.push('"transcript_path":"/tmp/transcript.jsonl"');
  fields.push('"cwd":"/tmp/test-project"');
  fields.push('"permission_mode":"default"');
  if (agentId !== undefined) fields.push(`"agent_id":"${agentId}"`);
  if (agentType !== undefined) fields.push(`"agent_type":"${agentType}"`);
  fields.push('"effort":{"level":"high"}');
  fields.push('"hook_event_name":"PreToolUse"');
  fields.push(`"tool_name":"${toolName}"`);
  fields.push(`"tool_input":{"skill":"${skill}"}`);
  return `{${fields.join(',')}}`;
}

// =================================================================================================
// Allow — a role invoking a skill it owns, at "any depth" (the payload has no depth field at all;
// only agent_type, which is why a leaf subagent 2 hops deep and a top-level `--agent`-launched
// session are indistinguishable to this script, by design — see the hook's own header comment).
// =================================================================================================

test('reviewer owns fkit-stateful-review -> allow', () => {
  const r = run(payload({ agentType: 'fkit-reviewer', skill: 'fkit-stateful-review' }));
  assertAllow(r, 'reviewer x fkit-stateful-review');
});

test('reviewer owns fkit-review -> allow', () => {
  const r = run(payload({ agentType: 'fkit-reviewer', skill: 'fkit-review' }));
  assertAllow(r, 'reviewer x fkit-review');
});

test('coder owns fkit-plan-task -> allow', () => {
  const r = run(payload({ agentType: 'fkit-coder', skill: 'fkit-plan-task' }));
  assertAllow(r, 'coder x fkit-plan-task');
});

test('coder owns fkit-task-ship-loop -> allow (task 53 / ADR-019)', () => {
  const r = run(payload({ agentType: 'fkit-coder', skill: 'fkit-task-ship-loop' }));
  assertAllow(r, 'coder x fkit-task-ship-loop');
});

test('a non-coder role does NOT own fkit-task-ship-loop -> deny (ADR-019: coder-only is what authorizes autonomy)', () => {
  const r = run(payload({ agentType: 'fkit-producer', skill: 'fkit-task-ship-loop' }));
  assertDeny(r, 'producer x fkit-task-ship-loop');
  assert.match(r.err, /does not own skill 'fkit-task-ship-loop'/);
});

test('lead owns fkit-sprint-ship-loop -> allow (task 0112 / ADR-032: lead is the sprint conductor)', () => {
  const r = run(payload({ agentType: 'fkit-lead', skill: 'fkit-sprint-ship-loop' }));
  assertAllow(r, 'lead x fkit-sprint-ship-loop');
});

test('a non-lead role does NOT own fkit-sprint-ship-loop -> deny (ADR-032: lead-only is what authorizes the conductor)', () => {
  const r = run(payload({ agentType: 'fkit-coder', skill: 'fkit-sprint-ship-loop' }));
  assertDeny(r, 'coder x fkit-sprint-ship-loop');
  assert.match(r.err, /does not own skill 'fkit-sprint-ship-loop'/);
});

test('a spawned subagent identity (agent_id present) is honored the same as a session', () => {
  const r = run(payload({ agentType: 'fkit-reviewer', agentId: 'abc123', skill: 'fkit-stateful-review' }));
  assertAllow(r, 'subagent identity honored');
});

// Universal skills: every role's own skills_for_role() list already includes fkit-team/fkit-query,
// so no special-casing exists in the hook — this proves that holds for every role, not just one.
for (const role of ['lead', 'producer', 'coder', 'architect', 'reviewer', 'adversarial-reviewer', 'wiki']) {
  for (const universal of ['fkit-team', 'fkit-query']) {
    test(`universal skill ${universal} is allowed for ${role}`, () => {
      const r = run(payload({ agentType: `fkit-${role}`, skill: universal }));
      assertAllow(r, `${role} x ${universal}`);
    });
  }
}

// producer -> architect -> fkit-survey-project: the exact consult CONSULT_SKILLS existed to patch.
// Must now succeed via ownership (architect owns it), not an exception list.
test('architect owns fkit-survey-project (the old CONSULT_SKILLS case) -> allow', () => {
  const r = run(payload({ agentType: 'fkit-architect', skill: 'fkit-survey-project' }));
  assertAllow(r, 'architect x fkit-survey-project');
});

// Non-fkit-* skills are out of scope for this hook entirely — a project's or the user's own skill
// is never gated by role, regardless of who's calling.
test('a non-fkit-* skill is allowed regardless of role', () => {
  const r = run(payload({ agentType: 'fkit-coder', skill: 'dataviz' }));
  assertAllow(r, 'non-fkit-* skill out of scope');
});

// =================================================================================================
// Deny — the reason this hook exists. Every case must resolve via the JSON deny shape (exit 0 +
// hookSpecificOutput.permissionDecision:"deny"), never a bare exit code.
// =================================================================================================

test('coder does NOT own fkit-review -> deny, the original bug this task fixes', () => {
  const r = run(payload({ agentType: 'fkit-coder', skill: 'fkit-review' }));
  assertDeny(r, 'coder x fkit-review');
  assert.match(r.err, /does not own skill 'fkit-review'/);
});

test('coder does NOT own fkit-stateful-review -> deny', () => {
  const r = run(payload({ agentType: 'fkit-coder', skill: 'fkit-stateful-review' }));
  assertDeny(r, 'coder x fkit-stateful-review');
});

test('producer does NOT own fkit-review -> deny', () => {
  const r = run(payload({ agentType: 'fkit-producer', skill: 'fkit-review' }));
  assertDeny(r, 'producer x fkit-review');
});

test('missing agent_type entirely -> deny (an unrolled plain `claude` session)', () => {
  const raw = '{"session_id":"x","hook_event_name":"PreToolUse","tool_name":"Skill","tool_input":{"skill":"fkit-review"}}';
  const r = run(raw);
  assertDeny(r, 'missing agent_type');
  assert.match(r.err, /no agent_type/);
});

test('agent_type present but not an fkit-* agent -> deny for an fkit-* skill', () => {
  const r = run(payload({ agentType: 'some-other-agent', skill: 'fkit-review' }));
  assertDeny(r, 'non-fkit agent_type');
  assert.match(r.err, /not an fkit-\* agent/);
});

// =================================================================================================
// THE TASK MOVERS (ADR-033, task 0124 — REVERSING ADR-025) — the highest-care area in this file.
//
// ⚠️ WHAT THESE TESTS DO AND DO NOT PROVE, AND THE ANSWER CHANGED. Under ADR-025 (task 64) the movers
// were owned by every role but the adversarial reviewer, and there was NOTHING structural left to
// test: the `(agent-closed — not owner-verified)` marker is prose and no code path enforces it, so
// "an agent closing its own work is refused" was not a testable proposition at all. ADR-033 makes it
// one again, but only in a specific and limited sense that these tests must not overstate:
//   1. Producer-only ACTUALLY TOOK EFFECT, at any spawn depth. A non-producer identity calling a
//      mover is denied by the hook, not merely asked not to. That is the assertion the deny cases
//      below and the exhaustive matrix now carry, and it is what the prose alone never gave us.
//   2. The fail-CLOSED paths still hold for the movers specifically — an unidentifiable caller is
//      denied, exactly as before. This mattered most when six of seven roles were allowed; it still
//      matters, because a fail-OPEN here would let an unroled session move task files.
//
// ⚠️ WHAT IS STILL NOT PROVEN, AND MUST NOT BE CLAIMED (ADR-033 §The limit). Producer-only restores
// separation of the closing IDENTITY, NOT prevention. A determined doer can still spawn a producer
// to close — "the coder marks its own work done with an extra hop". No test below asserts otherwise,
// and none should be added that pretends the hook closes that path. The agent-closed marker is still
// the only signal there, and it is still prose.
//
// The X1 contradiction cuts both ways now: before task 64 the movers' PROSE claimed any role could
// invoke them while this mapping denied every non-producer call. Task 0124 restores the mapping, so
// the same class of bug reappears if any SKILL, agent definition or mirror is left saying otherwise.
// The mapping wins; prose that disagrees with it is the bug.
// =================================================================================================

for (const mover of ['fkit-task-done', 'fkit-task-cancelled']) {
  test(`producer owns ${mover} -> allow (ADR-033: the producer is the ONLY role that may close)`, () => {
    const r = run(payload({ agentType: 'fkit-producer', skill: mover }));
    assertAllow(r, `producer x ${mover}`);
  });

  // The five roles ADR-025 had granted the movers to and ADR-033 took them back from. The exhaustive
  // matrix below covers these pairs too; they are spelled out HERE, by name, because the reversal is
  // the entire point of task 0124 — a future edit that silently re-grants one to a doer role must
  // break a test that says so in its own title, not only a generated matrix row.
  for (const role of ['lead', 'coder', 'architect', 'reviewer', 'wiki']) {
    test(`${role} does NOT own ${mover} -> deny (ADR-033 reverses ADR-025: closes route through the producer)`, () => {
      const r = run(payload({ agentType: `fkit-${role}`, skill: mover }));
      assertDeny(r, `${role} x ${mover}`);
      assert.match(r.err, new RegExp(`does not own skill '${mover}'`));
    });
  }

  test(`adversarial-reviewer does NOT own ${mover} -> deny (owner ruling: findings-only)`, () => {
    const r = run(payload({ agentType: 'fkit-adversarial-reviewer', skill: mover }));
    assertDeny(r, `adversarial-reviewer x ${mover}`);
  });

  test(`${mover} with NO agent_type -> deny (unrolled session must not move task files)`, () => {
    const raw = `{"session_id":"x","hook_event_name":"PreToolUse","tool_name":"Skill","tool_input":{"skill":"${mover}"}}`;
    const r = run(raw);
    assertDeny(r, `no agent_type x ${mover}`);
    assert.match(r.err, /no agent_type/);
  });

  test(`${mover} from a non-fkit agent_type -> deny`, () => {
    const r = run(payload({ agentType: 'some-other-agent', skill: mover }));
    assertDeny(r, `non-fkit agent_type x ${mover}`);
    assert.match(r.err, /not an fkit-\* agent/);
  });
}

test('malformed / non-JSON payload -> deny, not a crash', () => {
  const r = run('not even json {{{');
  assertDeny(r, 'malformed payload');
});

test('empty payload -> deny', () => {
  const r = run('');
  assertDeny(r, 'empty payload');
  assert.match(r.err, /empty hook payload/);
});

test('missing tool_input.skill -> deny', () => {
  const raw = '{"agent_type":"fkit-coder","hook_event_name":"PreToolUse","tool_name":"Skill","tool_input":{}}';
  const r = run(raw);
  assertDeny(r, 'missing tool_input.skill');
  assert.match(r.err, /tool_input\.skill/);
});

test('a tool_name other than Skill reaching this hook -> deny, defensively (matcher misconfiguration)', () => {
  const raw = '{"agent_type":"fkit-coder","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"ls"}}';
  const r = run(raw);
  assertDeny(r, 'wrong tool_name reaching the hook');
});

// =================================================================================================
// The exhaustive role × skill matrix (round-1 review, R3). The spot checks above are representative,
// not exhaustive — this is the actual security boundary (`skills_for_role()`), so a full grid belongs
// here, the way the old launcher-contract Group B owned one before this task retired it.
//
// ⚠️ HARD-CODED ON PURPOSE (mirrors ADR-014 §5, the old Group B's own warning): OWNED is a maintained
// MIRROR of skills_for_role(), not derived from it. A test whose oracle is the implementation tests
// nothing — a role accidentally mis-scoped to (or dropped from) a skill in skills-for-role.sh must
// move THIS table out of sync with reality and go red, not silently agree with whatever shipped.
// =================================================================================================

const UNIVERSE = [
  'fkit-adversarial-review', 'fkit-design-spec', 'fkit-evaluate-approach', 'fkit-heal',
  'fkit-initiate-project',
  'fkit-inspect', 'fkit-plan-task', 'fkit-process-review', 'fkit-process-stateful-review',
  'fkit-dumb-down', 'fkit-open-questions-interview',
  'fkit-query', 'fkit-record-decision', 'fkit-review', 'fkit-stateful-review', 'fkit-status',
  'fkit-survey-project', 'fkit-task-cancelled', 'fkit-task-done', 'fkit-task-brief',
  'fkit-task-ship-loop', 'fkit-team',
  'fkit-wiki-ingest', 'fkit-wiki-lint', 'fkit-wiki-sync',
];

// ⚠️ THE TASK MOVERS ARE PRODUCER-ONLY (ADR-033, task 0124 — reversing ADR-025, task 64).
// They were producer-only until 2026-07-19, ADR-025 granted them to every role but the adversarial
// reviewer, and ADR-033 takes that back knowingly: close authority re-consolidates in the one role
// whose job is the task lifecycle, and the ADR-018 hook makes it structural rather than prose. Every
// other role routes its closes through a spawned producer (ADR-033 §3/§4) and closes nothing itself.
// This mirror is what proves the reversal actually took effect. If prose and mapping ever disagree
// again — the X1 contradiction, in either direction — the mapping wins and the prose is the bug.
// ⚠️ `MOVERS` now appears on EXACTLY ONE role. That is the invariant, not an accident of editing:
// spreading it into a second role's list is the precise mistake this table exists to catch.
const MOVERS = ['fkit-task-done', 'fkit-task-cancelled'];

const OWNED = {
  // No movers: the sprint ship-loop's driver spawns @fkit-producer per shipped task (ADR-033 §4).
  // (`fkit-sprint-ship-loop` itself is absent from UNIVERSE below, so it is not mirrored here either
  // — pre-existing gap, not this task's to close; the two spot tests above cover that pair.)
  lead: ['fkit-team', 'fkit-query', 'fkit-open-questions-interview', 'fkit-dumb-down'],
  // fkit-heal: the read-only structure check (task 0245) — producer-owned per the owner's 2026-08-06
  // Q4 ruling ("Yes, producer"); the same custodianship as the task lifecycle and board hygiene.
  producer: ['fkit-team', 'fkit-query', 'fkit-open-questions-interview', 'fkit-dumb-down', 'fkit-initiate-project', 'fkit-task-brief', ...MOVERS, 'fkit-status', 'fkit-heal'],
  // No movers: the coder ship-loop's terminal act is a producer route, not a self-close (ADR-033 §3).
  coder: ['fkit-team', 'fkit-query', 'fkit-open-questions-interview', 'fkit-dumb-down', 'fkit-plan-task', 'fkit-process-review', 'fkit-process-stateful-review', 'fkit-task-ship-loop'],
  architect: ['fkit-team', 'fkit-query', 'fkit-open-questions-interview', 'fkit-dumb-down', 'fkit-survey-project', 'fkit-inspect', 'fkit-design-spec', 'fkit-evaluate-approach', 'fkit-record-decision'],
  reviewer: ['fkit-team', 'fkit-query', 'fkit-open-questions-interview', 'fkit-dumb-down', 'fkit-review', 'fkit-stateful-review'],
  // NOT the movers — deliberate owner ruling (2026-07-19), not an omission. Findings-only contract,
  // restricted Codex allowlist (ADR-022). It is now one of six roles without them rather than the
  // lone exclusion, and the ruling stands. The matrix below turns this into a real deny assertion.
  'adversarial-reviewer': ['fkit-team', 'fkit-query', 'fkit-adversarial-review'],
  // No movers: the wiki stays wiki-only and FLAGS completion for the producer to close (ADR-033 §2).
  wiki: ['fkit-team', 'fkit-query', 'fkit-open-questions-interview', 'fkit-dumb-down', 'fkit-wiki-ingest', 'fkit-wiki-lint', 'fkit-wiki-sync'],
};

for (const role of Object.keys(OWNED)) {
  const owned = new Set(OWNED[role]);
  for (const skill of UNIVERSE) {
    const shouldAllow = owned.has(skill);
    test(`matrix: ${role} × ${skill} -> ${shouldAllow ? 'allow' : 'deny'}`, () => {
      const r = run(payload({ agentType: `fkit-${role}`, skill }));
      if (shouldAllow) {
        assertAllow(r, `${role} × ${skill}`);
      } else {
        assertDeny(r, `${role} × ${skill}`);
      }
    });
  }
}

// =================================================================================================
// The fail-open hazard, made concrete: every deny path must carry the exact required JSON shape, no
// matter what triggers it — this is the assertion style that would have caught the original mistake
// (an omitted `hookEventName` field silently failing open), not merely "some nonzero exit."
// =================================================================================================

test('every deny path resolves via the full JSON deny shape, never a bare/partial one', () => {
  const cases = [
    '',
    'garbage',
    '{"agent_type":"fkit-coder","hook_event_name":"PreToolUse","tool_name":"Skill","tool_input":{"skill":"fkit-review"}}',
    '{"hook_event_name":"PreToolUse","tool_name":"Skill","tool_input":{"skill":"fkit-review"}}',
  ];
  for (const c of cases) {
    assertDeny(run(c), `case ${JSON.stringify(c)}`);
  }
});

// The one field a real prior mistake omitted, pinned on its own: if `hookEventName` is ever dropped
// or misspelled again, Claude Code silently treats the "deny" as an allow — exit 0 with unrecognized
// stdout is the fail-open default this whole hook exists to override. assertDeny() already checks
// this per-case above; this test names the exact regression class so it can't be quietly weakened.
test('a deny is never signalled by a malformed/partial JSON shape that a real Claude Code would ignore', () => {
  const r = run(payload({ agentType: 'fkit-coder', skill: 'fkit-review' }));
  assert.equal(r.code, 0);
  const parsed = JSON.parse(r.out.trim());
  assert.equal(parsed.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.equal(parsed.hookSpecificOutput.permissionDecision, 'deny');
  assert.ok(typeof parsed.hookSpecificOutput.permissionDecisionReason === 'string' &&
    parsed.hookSpecificOutput.permissionDecisionReason.length > 0, 'reason should be a non-empty string');
});
