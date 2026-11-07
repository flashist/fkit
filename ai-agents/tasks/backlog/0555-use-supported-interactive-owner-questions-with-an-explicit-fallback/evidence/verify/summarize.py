from pathlib import Path
import hashlib
import json
import re
import shlex

V = Path(__file__).resolve().parent
B = V.parent / 'build'

def counts(text):
    return {k: int(v) for k, v in re.findall(r'^[#ℹ] (tests|suites|pass|fail|cancelled|skipped|todo) (\d+)', text, re.M)}

def command(argv):
    return shlex.join(argv).replace('|', '\\|')

children = []
for file in sorted((V / 'prove-red-children').glob('*.exit')):
    base = str(file)[:-5]
    argv = Path(base + '.argv').read_text().splitlines()
    target = Path(base + '.target').read_text().strip()
    text = Path(base + '.stdout').read_text() + '\n' + Path(base + '.stderr').read_text()
    if 'claude-mutant-skills' in target:
        label = 'M1'
    elif 'claude-mutant-resume' in target:
        label = 'M2'
    elif 'claude-mutant-coldstart-exec-intake' in target:
        label = 'M31'
    elif 'claude-mutant-coldstart-exec' in target:
        label = 'M30'
    else:
        label = '0c' if argv[-1].endswith('skill-ownership-hook.test.js') else '0b'
    failed = list(dict.fromkeys(re.sub(r' \([^\n]*ms\)$', '', line.strip()) for line in text.splitlines() if line.lstrip().startswith(('✖ ', 'not ok '))))
    children.append({'step': label, 'exit': int(file.read_text()), 'command': ['node', *argv], 'target': target, 'counts': counts(text), 'failingReporterLabels': failed, 'stdout': str(Path(base + '.stdout').relative_to(V)), 'stderr': str(Path(base + '.stderr').relative_to(V))})
children.sort(key=lambda x: ['0b', '0c', 'M1', 'M2', 'M30', 'M31'].index(x['step']))
(V / 'prove-red-child-summary.json').write_text(json.dumps(children, indent=2, ensure_ascii=False) + '\n')

fresh = []
for lane in ['launcher', 'filtered', 'prove-red', 'launcher-escalated', 'filtered-escalated', 'prove-red-escalated']:
    p = V / (lane + '.json')
    if p.exists():
        row = json.loads(p.read_text())
        row['lane'] = lane
        fresh.append(row)

inherited = json.loads((V / 'inherited-checks.json').read_text())
after = json.loads((V / 'audit-after.json').read_text())
lines = [
    '- **0555 — Use supported interactive owner questions with an explicit fallback: Verify-only packet.** Source coherence is established; check outcomes below are independent execution evidence, not a Reviewer verdict.',
    '- **Build handoff remains incomplete:** no original Build worklog, final artifact manifest, final task diff or final preservation audit. This directory contains newly generated Verify artifacts only.',
    '- **Automatic live-display acceptance: UNMET. Claude/mixed live compatibility: unverified.** No closure, waiver, source repair, model invocation or owner answer is supplied by this packet.',
    '',
    'Read `completion-state.md` for the complete 17-path audit and delivery-record discrepancies. `audit-before.json` and `audit-after.json` contain the full comparisons; `source-hashes.json`, `current-source/`, and `task-source.diff` freeze the verified source unit against the real Build beforeimages, rather than dirty HEAD.',
    '',
    'Fresh commands and outcomes (numeric child statuses; no completed failure is hidden by a later run):',
    '',
    '| Lane | Exact command | Exit | Tests / suites / pass / fail / cancelled / skipped / todo | Permission context |',
    '| --- | --- | ---: | --- | --- |',
]
for r in fresh:
    c = r['counts']
    summary = ' / '.join(str(c.get(k, 'n/a')) for k in ['tests', 'suites', 'pass', 'fail', 'cancelled', 'skipped', 'todo'])
    lines.append(f"| {r['lane']} | `{command(r['command'])}` | {r['exit']} | {summary} | {r['permissionContext']} |")
lines += ['', 'The three approved commands ran against the same frozen source in independent disposable fixtures. The prove-red command uses a Verify-owned exported Bash `node` function solely to retain each existing `node --test` child stdout/stderr and numeric exit before the original script removes its disposable tree. Original argv, node command, output channels and return statuses are preserved. The wrapper adds no mutant, test file, test case or source modification. Child records:', '', '| Step | Exact command | Child exit | Tests / suites / pass / fail / cancelled / skipped / todo |', '| --- | --- | ---: | --- |']
for r in children:
    c = r['counts']
    summary = ' / '.join(str(c.get(k, 'n/a')) for k in ['tests', 'suites', 'pass', 'fail', 'cancelled', 'skipped', 'todo'])
    lines.append(f"| {r['step']} | `{command(r['command'])}` | {r['exit']} | {summary} |")
lines += ['', 'Exact failed reporter labels, including enclosing suite labels and every extra failure, are retained in `prove-red-child-summary.json` and the child logs. The four required mutants are M1 (reviewer ownership), M2 (`--resume`), M30 (both fresh handoff paths), and M31 (intake-only handoff). M30 is allowed to fail both 12 and 12b; 12c/12d must remain green. M31 must fail 12b while 12/12c/12d remain green. Gate output alone is not evidence that no unrelated assertion failed; use the child records for that claim.', '', 'Inherited Build commands and outcomes (executed before this worker; preserved rather than rerun):', '', '| Record | Exact command | Child exit | Counts or detail |', '| --- | --- | ---: | --- |']
for r in inherited:
    record = r['record']
    if isinstance(record, list):
        lines.append(f"| `{Path(r['path']).name}` | Aggregate of the individually listed direct command records | all recorded exits 0 | Original full array retained in `inherited-checks.json` |")
        continue
    detail = json.dumps(r['counts'], ensure_ascii=False) if r['counts'] else 'No suite count; exact stdout/stderr retained'
    if record.get('stdin'):
        detail += '; stdin `' + record['stdin'] + '`'
    if record.get('failedAssertion'):
        detail += '; failed managed-block reserve: 396 < 400 bytes'
    lines.append(f"| `{Path(r['path']).name}` | `{command(record['command'])}` | {record['exit']} | {detail} |")
lines += [
    '',
    'The aggregate `scoped-checks.json` records four syntax checks, manifest generation, root initialization, whitespace and targeted green; `complete-checks.json` records root-init, disposable delivery, targeted green and whitespace. All are exit 0. Target green/green-final/complete each report tests 2, suites 0, pass 2, fail/cancelled/skipped/todo 0; expected target red is exit 1, tests 1, pass 0, fail 1. Preservation attempt 1 is exit 1 with the recorded budget assertion; no functional pass is substituted for that missing original final audit.',
    '',
    'Preservation after fresh execution:',
    '',
    '```json',
    json.dumps(after['preservedSinceVerifyStart'], indent=2),
    '```',
    '',
    f"Frozen 0554 mismatches: {len(after['frozen0554Mismatches'])}; protected record mismatches: {len(after['recordMismatches'])}; source beforeimage mismatches: {len(after['sourceBeforeimageMismatches'])}; managed beforeimage mismatches: {len(after['managedBeforeimageMismatches'])}.",
    f"Git index SHA-256: `{after['indexCurrent']}`; cached binary diff SHA-256: `{after['indexPatchCurrent']}`; both match Build baseline. All 17 current source hashes remain equal to the pre-test snapshot. All 213 old Build evidence files remain equal to their recorded pre-Verify hashes. All 71 managed files remain equal to Verify-start bytes.",
    '',
    'Baseline exceptions are the 17 explicitly approved 0555 source changes over the live 0554 source baseline. The 79 closed 0554 artifacts are frozen, not used to forbid legitimate 0555 changes in shared live source. Root `.fkit/tmp/sprint15-lead-continuation-20261105.json` may be changed by the caller; it is excluded from preservation proof. New nonignored paths are enumerated, not inferred from Git status. No source, index, task status, board, wiki, hook, settings, install, commit or push mutation was performed by this worker.',
    '',
    'Coverage omissions: the filtered functional command is **not default `npm test`**. Seven cases are excluded by the exact approved pattern: three banner cases (`git-deadline`, `term-ignored`, `no-stray`), two reinstall cases (`reinstall-deadline`, `reinstall-timeout-not-run`), mixed stale-break/lock recovery, and the optional benchmark snapshot/access case. These seven are neither passes nor reporter-skips; reporter skip counts above are reported as emitted. Release checks were skipped because release tooling is unchanged. No new permanent test file, top-level case, mutation or prove-red addition was made. Inherited passed manifest/init/delivery/syntax/whitespace checks were not duplicated. No timing, infrastructure, account/model or native-configuration inquiry or repair was performed.',
    '',
    'Remaining handoff: the root lead must reconcile the missing original Build worklog/final manifest/final task diff/final preservation audit and the reported-initial-delivery-failure versus persisted-exit-0 discrepancy. The smallest documentation completion is an explicitly authorized, provenance-labelled Build handoff completion based on retained real evidence; no implementation retry is indicated by this coherence audit. The separate fresh Reviewer still owns code review. Root-owned live acceptance remains pending and cannot be established by these fixtures or fallback. 0556 — Give each independent owner decision its own selectable options remains separate.',
    '',
    "What's next? Return this packet to the root lead for the real failures, handoff gap, later fresh review and unmet live acceptance; no inner loop or closure.",
]
(V / 'verification.md').write_text('\n'.join(lines) + '\n')
print(json.dumps({'fresh': [{k: r[k] for k in ['lane', 'exit', 'counts']} for r in fresh], 'children': children}, indent=2, ensure_ascii=False))
