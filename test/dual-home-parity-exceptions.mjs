// The dual-home parity EXCEPTION LIST — task 0132, the reconciliation ADR-027 §Decision 3 requires
// before the parity test (task 0133) can be built.
//
// WHAT THIS IS. `ai-agents/` (fkit's own working tree) and `claude/scaffold/ai-agents/` (the template a
// consuming project receives at init) hold some of the same documents. `conventions/dual-home-parity.md`
// says an fkit-authored file living in both homes must be byte-identical in both. This module is the
// machine-readable list of every path where that rule does NOT apply, WITH the reason it does not —
// because an exception with no stated reason is an unfalsifiable permanent hole in 0133's test.
//
// THIS MODULE IS AUTHORITATIVE. `conventions/dual-home-parity.md` carries a human-readable mirror of
// the table below; where the two disagree, this file wins and the convention is stale. Task 0133's
// parity test imports this module rather than restating the list.
//
// ⚠️ THE CONVENTION'S LITMUS HAS TWO KINDS; REALITY HAS THREE (owner ruling, 2026-08-01).
// The convention sorts files into fkit-authored (✅ must match) and project-specific (⛔ never sync).
// A third kind was found by this task's sweep and is now recognized: **audience-adapted** — the same
// document in both homes, deliberately rewritten in the scaffold for a consuming reader. fkit's
// incident narratives, task/ADR provenance, and relative links into `ai-agents/tasks/` and
// `ai-agents/sprints/` are stripped on purpose. Byte-aligning those files would ship broken links and
// fkit-internal history into every consuming project. The owner rejected byte-aligning them as a
// product regression on this task's own evidence.
//
// SHAPE. One flat array of `{ path, kind, reason }`.
//   - `path` is POSIX, relative to EACH home's root (so `README.md` means both `ai-agents/README.md`
//     and `claude/scaffold/ai-agents/README.md`).
//   - A `path` ending in `/` is a DIRECTORY exception: it and everything under it is outside the
//     dual-homed surface entirely. Needed because the surface is not "both trees" — most of the live
//     tree is fkit's own project content that the scaffold deliberately does not ship.
//   - `kind` is one of: 'audience-adapted' | 'placeholder' | 'index' | 'fkit-repo-only' | 'live-only'
//     | 'project-content-dir' | 'runtime-state'.
//
// HOW A CONSUMER USES IT. Run `diff -rq ai-agents/ claude/scaffold/ai-agents/` and require that EVERY
// reported line — `Files … differ` AND `Only in …` alike — maps to an entry here (exact `path` match,
// or falls under a directory entry). Anything left over is drift. Do NOT filter `Only in ai-agents`
// lines away first: `dependency-declaration-form.md`'s absence from the scaffold was a genuine
// violation of the repo's own rule and it showed up as exactly such a line.

/** @typedef {{ path: string, kind: string, reason: string }} ParityException */

/** @type {ParityException[]} */
export const exceptions = [
  // ─── fkit-repo-only ────────────────────────────────────────────────────────────────────────────
  {
    path: 'knowledge-base/conventions/dual-home-parity.md',
    kind: 'fkit-repo-only',
    reason:
      'ADR-027 §5, and the document says so about itself. It governs development of the fkit framework ' +
      'repo, not how the agents work: a consuming project has one `ai-agents/` tree and no ' +
      '`claude/scaffold/`, so the rule would govern directories it does not have. SHIPPING IT IS A ' +
      'REGRESSION — task 0132 verification step 3 fails any change that adds it to the scaffold.',
  },

  // ─── index (each home lists its own actual contents) ───────────────────────────────────────────
  {
    path: 'knowledge-base/conventions/README.md',
    kind: 'index',
    reason:
      'ADR-027 §5. Its "What\'s here" table necessarily enumerates the conventions THAT HOME actually ' +
      'holds, and the homes differ by design — the live tree carries `dual-home-parity.md` (fkit-repo-only, ' +
      'above), the scaffold does not. The live copy also cites ADR-013 by path; the scaffold copy drops ' +
      'ADR references a consuming project has no file for. Everything outside the index table should stay ' +
      'in step by hand.',
  },

  // ─── placeholders (scaffold copy is an empty shell the project fills in) ───────────────────────
  {
    path: 'knowledge-base/PROJECT.md',
    kind: 'placeholder',
    reason:
      'ADR-027 §1. The scaffold copy is the placeholder project brief that `/fkit-initiate-project` ' +
      'interviews the owner to replace. Syncing the live copy would ship fkit\'s OWN product brief into ' +
      "someone else's repository.",
  },
  {
    path: 'wiki-vault/index.md',
    kind: 'placeholder',
    reason:
      'ADR-027 §1. The scaffold copy is an empty wiki catalog; the live copy is fkit\'s own catalog of ' +
      '180+ ingested pages. Also: only the `fkit-wiki` role may write `ai-agents/wiki-vault/`, so no ' +
      'reconciliation may touch the live copy at all.',
  },
  {
    path: 'wiki-vault/log.md',
    kind: 'placeholder',
    reason:
      'ADR-027 §1. The scaffold copy is an empty activity log; the live copy is fkit\'s own ingest ' +
      'history. Same wiki write-gateway restriction as `wiki-vault/index.md`.',
  },

  // ─── live-only ────────────────────────────────────────────────────────────────────────────────
  {
    path: 'knowledge-base/architecture.md',
    kind: 'live-only',
    reason:
      'Each project generates its own with `/fkit-inspect` or `/fkit-survey-project`; the scaffold ships ' +
      'no copy at all, only a pointer to the path from `scaffold/CLAUDE.md`. Shipping fkit\'s copy would ' +
      "hand a consuming project a description of fkit's internals as if it were their own architecture. " +
      'NOT PREVIOUSLY RECORDED ANYWHERE — neither ADR-027 nor the convention listed it; added by task 0132 ' +
      'because the brief requires a reason per path, not just a path.',
  },

  {
    path: '.fkit-accepted-drift',
    kind: 'live-only',
    reason:
      'The launch-notice intent file (task 0247): it records THIS project\'s deliberate divergences ' +
      'from what the installed fkit version ships — per-project intent by definition, like ' +
      '`.fkit-keep-out`. The scaffold must never ship one: a shipped copy would pre-suppress launch ' +
      'notices in every consuming project, which is exactly the global mute the owner\'s Q3 ruling ' +
      'forbade. The live copy exists because this repo dogfoods fkit and accepts its own known drift ' +
      '(owner-ruled 2026-08-07, task 0247 Q3 "Seed it").',
  },

  // ─── audience-adapted (same document, deliberately de-fkit-ified for a consuming reader) ───────
  // Each entry names what is ACTUALLY different in that file. A shared boilerplate reason across five
  // paths is exactly the unfalsifiable hole the 0132 brief warns against.
  {
    path: 'README.md',
    kind: 'audience-adapted',
    reason:
      'The live copy documents the `ai-agents/` tree AS FKIT USES IT — it links ADR-013 by relative path ' +
      'for the knowledge-base root rule, and describes the Claude-Code/Codex model routing of fkit\'s own ' +
      'agents. The scaffold copy replaces that with a "The standing conventions" section addressed to a new ' +
      'owner ("They are yours to amend"), spells out the create-if-absent top-up rule as a promise to the ' +
      'reader rather than a fact about fkit, and drops the ADR link a consuming project cannot resolve. ' +
      'Largest of the six files ADR-027 recorded as drifted; the divergence is editorial, not staleness.',
  },
  {
    path: 'knowledge-base/conventions/task-status-vocabulary.md',
    kind: 'audience-adapted',
    reason:
      'The live copy cites ADR-033, ADR-025 and ADR-018 by relative path for the producer-only mover gate ' +
      'and the agent-closed marker, and opens with fkit\'s own 2026-07-11 "convention-by-accident" history. ' +
      'The scaffold copy restates the same rules with no ADR links (a consuming project has none of those ' +
      'files), opens with a "starting convention, yours to amend" frame, and ADDS a paragraph the live copy ' +
      'does not have — how to harden the gate in `claude/skill-ownership-hook.sh` if your team wants more ' +
      'than prose. Its "Where this is enforced" list names `/fkit-*` skills; the live list names ' +
      '`claude/skills/*/SKILL.md` source paths and fkit\'s own tracking brief.',
  },
  {
    path: 'knowledge-base/conventions/one-skill-one-output.md',
    kind: 'audience-adapted',
    reason:
      'The live copy is anchored in fkit\'s own instance: the owner\'s 2026-07-17 Sprint 2 OQ8 ruling quoted ' +
      'verbatim, a "History — recorded honestly" section about `/fkit-status full`, tasks 38/41/44, and a ' +
      'Provenance section with four relative links into `tasks/done/` and `sprints/sprint-2.md`. The scaffold ' +
      'copy generalizes all of that into "Why the escape hatch exists" with no task numbers and no links, ' +
      'and drops the live copy\'s self-referential enforcement bullet ("the scaffold ships the conventions, ' +
      'so this file must be added there"), which is meaningless once you ARE the scaffold copy.',
  },
  {
    path: 'knowledge-base/conventions/evidence-before-assertion.md',
    kind: 'audience-adapted',
    reason:
      'The live copy is written from fkit\'s 2026-07-13 incident — three producer failures in one session, ' +
      'the task-17 discrepancy narrated by name — and ends with a Provenance section pointing at a task ' +
      'brief by path. The scaffold copy states the same rule with the incident generalized ("the bug this ' +
      'convention exists to stop"), no task-17 narrative, and no Provenance section. Its "Where this is ' +
      'enforced" list names `/fkit-*` skills; the live list names `claude/skills/*/SKILL.md` source files.',
  },
  {
    path: 'knowledge-base/conventions/status-report-format.md',
    kind: 'audience-adapted',
    reason:
      'Smallest of the five. The live copy\'s header calls itself a "Working draft, iterating with the owner" ' +
      'that will later be baked into `claude/agents/fkit-producer.md` — a statement about fkit\'s own roadmap, ' +
      'false in a consuming project where the skill already exists. The scaffold copy replaces it with a ' +
      '"starting convention, shipped with the project scaffold" frame, and paraphrases the owner\'s quoted ' +
      'spec instead of attributing it to fkit\'s owner.',
  },
  {
    path: 'knowledge-base/conventions/dependency-declaration-form.md',
    kind: 'audience-adapted',
    reason:
      'SHIPPED TO THE SCAFFOLD BY TASK 0132 — its absence was the live violation the task was filed to fix. ' +
      'Shipped GENERALIZED, not byte-identical, by owner ruling 2026-08-01: the live copy narrates fkit\'s ' +
      'own task-84 / `0092` misreport, the `0020` review\'s R19/R40 prior art, and a "The guard (task 0107)" ' +
      'section describing the history of fkit\'s own `dashboard.sh`. The scaffold copy keeps the canonical ' +
      'form, the examples, the rules, and the guard\'s BEHAVIOUR, and drops every fkit task/review reference ' +
      'and the relative links into `tasks/`. ⚠️ This means 0132 verification step 2 ("byte-identical to the ' +
      'live copy") is SUPERSEDED by the ruling, not met — recorded here so no future maintainer "fixes" it ' +
      'by copying the live file over.',
  },

  // ─── project-content directories (outside the dual-homed surface entirely) ─────────────────────
  // The surface is NOT "both trees". The scaffold ships 13 real files plus `.gitkeep` placeholders;
  // everything below is fkit's own project content, which the scaffold deliberately holds empty.
  // Recorded at directory granularity so a new ADR, report, brief or wiki page is never re-derived as
  // a drift event. ADR-035 and task 0174's report are not drift, and no ADR ever will be.
  //
  // ⚠️ HAND-OFF TO TASK 0133 — THESE ENTRIES ARE BLANKET, AND 0133 MUST TURN THEM INTO A TRIPWIRE.
  // A directory entry matches BIDIRECTIONALLY: it excuses a path under it in EITHER home. That is what
  // makes the bulk `Only in` noise classifiable, but it also means a genuinely dual-homed file added
  // under one of these directories LATER would be silently exempt from 0133's byte-parity check
  // instead of enforced by it.
  //
  //   THE ASSERTION 0133 MUST ADD: no directory exception may cover a NON-`.gitkeep` file that is
  //   present in BOTH homes. Such a file is dual-homed by construction and belongs on the enforced
  //   set, not under a blanket.
  //
  // This is LATENT today, not a live hole — no such file exists as of 2026-08-01. But the mechanism is
  // already live: 9 `.gitkeep` files sit in both homes under these entries (verified by walking both
  // trees), which is exactly why the assertion must carve `.gitkeep` out rather than ban co-presence
  // outright. The named near-miss is `knowledge-base/reports/README.md` — an undated folder-purpose doc
  // of the SAME SPECIES as `tasks/README.md`, which IS dual-homed and IS enforced. It lives only in the
  // live tree today; ship it to the scaffold and it would land under `knowledge-base/reports/` and go
  // unchecked. (Raised as R1 by both reviewers on 0132 round 1; the owner ruled 2026-08-01 that 0133
  // owns the fix because 0133 owns the test. Recorded here, in 0132's worklog, and in 0132's review
  // ledger so it cannot be missed.)
  {
    path: 'knowledge-base/decisions/',
    kind: 'project-content-dir',
    reason:
      'ADR-027 §1 / the convention\'s own table. Scaffold holds only `.gitkeep`; the live tree holds fkit\'s ' +
      "own 35+ ADRs. A project's decisions are its own. NO ADR IS EVER A DRIFT EVENT.",
  },
  {
    path: 'knowledge-base/reports/',
    kind: 'project-content-dir',
    reason:
      'ADR-027 §1. Scaffold holds only `.gitkeep`; the live tree holds fkit\'s own dated audits and ' +
      'evaluations. NO REPORT IS EVER A DRIFT EVENT. (Note: the live tree also holds a `reports/README.md` ' +
      'folder-purpose doc with no scaffold counterpart — covered by this directory entry; whether it should ' +
      'ship is a separate scoping question, not drift.)',
  },
  {
    path: 'knowledge-base/history/',
    kind: 'project-content-dir',
    reason: "ADR-027 §1. Scaffold holds only `.gitkeep`; the live tree holds fkit's own superseded design docs.",
  },
  {
    path: 'knowledge-base/incidents/',
    kind: 'project-content-dir',
    reason: "ADR-027 §1. Scaffold holds only `.gitkeep`; the live tree holds fkit's own incident records.",
  },
  {
    path: 'sprints/',
    kind: 'project-content-dir',
    reason:
      'ADR-027 §1. Scaffold holds only `.gitkeep` (plus `done/.gitkeep`); the live tree holds fkit\'s own ' +
      'sprint plans, `backlog.md`, and the sprint-keyed review ledgers under `sprints/reviews/`. ' +
      '`tasks/README.md` — the one real document in the task/sprint area — IS dual-homed and byte-identical, ' +
      'and is enforced, not excepted.',
  },
  {
    path: 'tasks/backlog/',
    kind: 'project-content-dir',
    reason: "ADR-027 §1. Scaffold holds only `.gitkeep`; the live tree holds fkit's own task folders.",
  },
  {
    path: 'tasks/done/',
    kind: 'project-content-dir',
    reason: "ADR-027 §1. Scaffold holds only `.gitkeep`; the live tree holds fkit's own closed task folders.",
  },
  {
    path: 'tasks/cancelled/',
    kind: 'project-content-dir',
    reason: "ADR-027 §1. Scaffold holds only `.gitkeep`; the live tree holds fkit's own cancelled task folders.",
  },
  {
    path: 'wiki-vault/wiki/',
    kind: 'project-content-dir',
    reason:
      'ADR-027 §1. Scaffold holds only `.gitkeep` under each of `decisions/`, `features/`, `systems/`, ' +
      "`tasks/`; the live tree holds fkit's own 180+ ingested wiki pages. Also write-gated to the " +
      '`fkit-wiki` role. `wiki-vault/schema.md` IS dual-homed and byte-identical, and is enforced, not excepted.',
  },

  // ─── runtime state (live-only, generated, never authored) ──────────────────────────────────────
  {
    path: '.fkit/',
    kind: 'runtime-state',
    reason:
      'Launcher bookkeeping written by `claude/fkit-claude.sh` at run time (also appears as ' +
      '`tasks/backlog/.fkit` and `wiki-vault/.fkit`). Generated, not authored; never shipped.',
  },
  {
    path: 'tasks/backlog/.fkit',
    kind: 'runtime-state',
    reason:
      'Same launcher bookkeeping as `.fkit/`, in a second location. Generated, not authored. ' +
      'It sits UNDER the `tasks/backlog/` directory entry above, so it is reachable only because ' +
      "`findException` resolves an exact entry before a covering directory one — without that rule this " +
      'entry is dead and the path is excused with the wrong reason ("fkit\'s own task folders").',
  },
  {
    path: 'wiki-vault/.fkit',
    kind: 'runtime-state',
    reason: 'Same launcher bookkeeping as `.fkit/`, in a third location. Generated, not authored.',
  },
  {
    path: 'wiki-vault/.wiki-watermark',
    kind: 'runtime-state',
    reason:
      'The commit SHA `/fkit-wiki-sync` uses as its since-point. Per-repository state, meaningless in a ' +
      'fresh scaffold; also write-gated to the `fkit-wiki` role.',
  },
  {
    path: 'knowledge-base/.gitkeep',
    kind: 'runtime-state',
    reason:
      'A git placeholder in the live tree only; the scaffold `knowledge-base/` is non-empty so it needs ' +
      'none. Structural, not content. (Mirror case: the scaffold carries `.gitkeep` inside each ' +
      'project-content directory above, covered by those directory entries.)',
  },
];

export default exceptions;

/**
 * Resolve `.`, `..` and empty segments in a home-relative POSIX path.
 * Returns null if the path climbs above the home root — such a path names something outside the
 * dual-homed surface entirely and must NEVER be handed an exception.
 * @param {string} path
 * @returns {string | null}
 */
function normalize(path) {
  const out = [];
  for (const seg of path.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') {
      if (out.length === 0) return null;
      out.pop();
      continue;
    }
    out.push(seg);
  }
  return out.join('/');
}

/**
 * The covering exception for `path` (POSIX, relative to a home root), or undefined if the path must be
 * byte-identical across both homes. Matches an exact file entry, a descendant of a directory entry, and
 * a directory entry named without its trailing slash — `diff -rq` reports a whole missing directory as
 * `Only in ai-agents: .fkit`, with no slash, so a consumer must not have to append one.
 *
 * TWO RULES, both load-bearing:
 *
 * 1. THE PATH IS NORMALIZED FIRST. Without it, `..` lets a byte-enforced file masquerade as a
 *    descendant of a directory entry — `knowledge-base/reports/../conventions/task-owner-vocabulary.md`
 *    would collect the `knowledge-base/reports/` exception although the file it names is enforced. That
 *    is the unsafe direction (a silent false exception), so it is closed here rather than left to every
 *    caller. A path that climbs above the home root gets NO exception, which is the safe direction: the
 *    caller reports drift rather than silently excusing it.
 *
 * 2. MOST SPECIFIC WINS — an exact entry beats a covering directory entry, whatever the array order.
 *    `Array.find` alone made `tasks/backlog/.fkit` DEAD: the earlier `tasks/backlog/` directory entry
 *    always won, so the path was excused with the wrong reason ("fkit's own task folders") instead of
 *    its own ('runtime-state'). Reordering the array would have fixed that one case and left the trap
 *    armed for the next; the ordering rule makes an exact entry unkillable by a future re-sort.
 *
 * @param {string} path
 * @returns {ParityException | undefined}
 */
export function findException(path) {
  const p = normalize(path);
  if (p === null) return undefined;
  return (
    exceptions.find((e) => !e.path.endsWith('/') && p === e.path) ??
    exceptions.find((e) => {
      if (!e.path.endsWith('/')) return false;
      const dir = e.path.slice(0, -1);
      return p === dir || p.startsWith(e.path);
    })
  );
}
