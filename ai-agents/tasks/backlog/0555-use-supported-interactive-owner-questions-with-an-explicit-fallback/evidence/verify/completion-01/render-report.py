from pathlib import Path
import json,hashlib
O=Path(__file__).resolve().parent; P=O.parents[2]; V=O.parent
r=json.loads((O/'results-summary.json').read_text()); a=json.loads((O/'audit-final.json').read_text()); launcher=json.loads((V/'launcher.json').read_text())
f=r['filtered']; pr=r['proveRed']; cs=r['proveRedChildren']
def count(c): return ', '.join(f'{k} {v}' for k,v in c.items()) or 'no summary counts recorded'
def lines(names): return '; '.join(names) or 'none'
text=f'''- **0555 — Use supported interactive owner questions with an explicit fallback:** completion-only verification finished. Filtered functional child exit **{f['exit']}**; prove-red script exit **{pr['exit']}**.
- Automatic live-display acceptance remains **UNMET**. Claude/mixed live compatibility remains unverified. No closure or waiver.
- Original Build handoff remains incomplete. This standalone packet was created now by the fresh completion-01 Verify worker; it is not an original Build report, worklog, manifest, task diff or final audit.

Authority: caller fkit-lead relayed actual root user chat on 2026-11-06, observed 10:34:39 UTC: `"- Approve complete plan (Recommended)"`. This worker did not observe that owner exchange; it trusts the live relay. The complete approved plan is 9,675 bytes, SHA-256 `8e9e1fe76cb3797116d534e2fd69633ff2311748a4c38a030ed383308d607ca6`. Its stale unapproved wording was preserved. Scope: complete the two remaining checks and produce this evidence only. No source edits, implementation, re-planning, review, owner form, settings, hooks, lifecycle, index, install, commit or push action.

Both commands ran sequentially, once each, using separately requested `require_escalated` scope. The Python collector executes the exact approved argv (shell globs expanded into the same sorted file list), redirects stdout/stderr only, returns actual child status, and writes a per-command completed checkpoint. Prove-red uses the inspected existing Bash-function collector: identical node argv and status, stdout/stderr additionally captured for each script-owned disposable suite invocation. No broad allowlist or configuration change. Permission-context differences do not establish a failure cause.

```sh
node --test --test-skip-pattern='^0284/(git-deadline|term-ignored|no-stray|reinstall-deadline|reinstall-timeout-not-run):|^fkit additions a break file left by a dead breaker is removed, and waiters back off meanwhile$|^benchmark:' test/*.test.js test/board/*.test.js
npm run test:prove-red
```

| Fresh command | Numeric child exit | Counts | Evidence |
| --- | ---: | --- | --- |
| Filtered functional | {f['exit']} | {count(f['counts'])} | `filtered.json`, `filtered.stdout`, `filtered.stderr`, `filtered-checkpoint.json` |
| Prove-red script | {pr['exit']} | Per-child rows below | `prove-red.json`, `prove-red.stdout`, `prove-red.stderr`, `prove-red-checkpoint.json` |

Filtered failure names: {lines(f['failureNames'])}.

| Existing prove-red step | Suite exit | Counts | Required red observed | Extra failing assertions | Forbidden narrowness failures |
| --- | ---: | --- | --- | --- | --- |
'''
for c in cs:
 text+=f"| {c['step']} | {c['exit']} | {count(c['counts'])} | {c['requiredRedObserved'] if c['requiredRedObserved'] is not None else 'baseline: must be green'} | {lines(c['extraFailures'])} | {lines(c['narrownessForbiddenFailures'])} |\n"
text+='''
Required assertions: M1 `reviewer × fkit-review`; M2 assertion 2 (`--resume`); M30 assertion `12. fresh project` (12b may also fail; 12c/12d must stay green); M31 assertion 12b (12/12c/12d must stay green). Every child capture includes argv, target, numeric exit, stdout and stderr. `results-summary.json` lists every failing assertion, required-red and narrowness results, including extra errors. The gate's own conclusion is retained below; it does not replace these separate checks.

```text
'''+pr['gateOutput']+'```\n'
text+=f'''
Inherited results are preserved and attributed to prior runs, without duplicate execution:

- Restricted standalone `node --test test/launcher-contract.test.js`: exit {launcher['exit']}; {count(launcher['counts'])}. Failures: “bare first use: each runtime saves once and continues fresh onboarding or existing-project menu” (9 != 15, first-use line 647); “bare first use: management, explicit routes and partial terminal fds preserve their contracts” (terminal harness line 783). Source attribution/cause unknown; no waiver, investigation or retry.
- Old restricted filtered lane: HTTP failures appear in partial stdout; no JSON result, final totals or numeric child exit. **INCOMPLETE/UNKNOWN**.
- Old restricted prove-red lane: only 0b start in saved stdout; no numeric child or gate completion. **INCOMPLETE/UNKNOWN**. Old child activity is not diagnosed or controlled by this worker.
- Build expected-red owner-channel test: exit 1, tests 1/pass 0/fail 1 at old capability advertisement. Final targeted tests: exit 0, tests 2/pass 2/fail 0. Four syntax checks, manifest generation, root initializer, disposable delivery and scoped whitespace: recorded exit 0. Direct Build JSON and associated stdout/stderr were read and indexed in `inherited-build-checks-read.json`.
- First Build preservation assertion failed: 3,956-byte managed blocks, 396 free versus required 400. Final consistent correction: 3,945 bytes, 407 free. No original Build final audit was returned.
- Persisted `delivery.json` actually records exit 0; an initial root failure claim was corrected. Twelve retained runtime instruction captures bind to the budget-corrected run, not complete-run timestamp labels. Both direct delivery records report child exit 0. These are static/argv checks only: no actual CLI/model/live UI pass.

Fresh preservation audit (`audit-final.json`):

- 17 current source hashes compared with `source-hashes.json`; mismatches: {len(a['sourceMismatches'])}. Seventeen real Build beforeimages compared with Build baseline; mismatches: {len(a['sourceBeforeimageMismatches'])}.
- 79 frozen 0554 — Make the lead advance authorized work after worker completion evidence — records; mismatches: {len(a['frozen0554Mismatches'])}. Four protected records; mismatches: {len(a['protectedRecordMismatches'])}.
- ADR-060 current hash: `bb738233baea73c0e034cbff21e4b24e150f3832ac7149193002ead41c3057a1`; plan-review hash: `4213df8c9f08ceebd012d229848694b3117f924ebb297193bfa23c5691b15df4`.
- 2,181 baseline workspace hashes compared; deltas outside 17 source paths: {len(a['workspaceDeltasOutside17Sources'])}; new nonignored paths outside this task's evidence: {len(a['workspaceAdditionsOutsideTaskEvidence'])}.
- 71 managed beforeimages compared; mismatches: {len(a['managedBeforeimageMismatches'])}. Current managed files compared with prior Verify: deltas {len(a['managedCurrentDeltasSincePriorVerify'])}.
- Index hash matches Build baseline: {a['indexExpected']==a['indexActual']}; staged diff hash matches: {a['indexPatchExpected']==a['indexPatchActual']}.
- {a['buildArtifactCount']} old Build evidence files compared with `build-evidence-hashes.json`; mismatches: {len(a['buildArtifactMismatches'])}.
- Old Verify file deltas observed during this worker: {len(a['oldVerifyDeltas'])}. Full expected/current hashes are in the audit. Any such delta has unknown authorship; a prior unfinished lane may append. It is not a source-change claim or proof of child completion.
- Root-owned `.fkit/tmp/sprint15-lead-continuation-20261105.json` is not preservation proof.

`source-manifest.json` and `task-source.diff` are reconstructed now from the 17 real Build beforeimages, accurately attributed to this Verify worker. `artifact-manifest.json` hashes every file in this new lane except itself; `artifact-manifest.sha256` hashes that manifest. No prior file is overwritten.

Missing original handoff: task `worklog.md`, `evidence/build/artifact-manifest.json`, `evidence/build/task-source.diff`, and original Build final audit. Prior Verify final report/manifest are also absent. This independent packet does not fabricate or backfill them.

Coverage boundaries: approved filtered suite is **not default npm test**. Seven planned exclusions remain: three banner cases, two reinstall cases, mixed stale-break cleanup/lock recovery, optional benchmark snapshot/access checks. Exclusions are not added to reporter pass/skip counts. Release checks omitted because release tooling is unchanged. No new tests, top-level cases, prove-red cases or source mutations; only the existing four script-owned disposable mutants. No timing investigation, measurements/gates, process watching, provider/config/model/account probes, transport diagnosis or repairs. No fresh source review or Process-review. Live automatic selectable presentation before interaction, ordinary submission and cancellation remain unexecuted here; acceptance **UNMET**, no closure waiver.

0556 — Give each independent owner decision its own selectable options — remains separate. No placement/dependency decisions or changes; checked none.

What's next? Lead consumes this verification packet and retains failed/unknown checks, missing original handoff and unmet live acceptance in the root disposition. No task closure is performed here.
'''
with (O/'verification-report.md').open('x') as f: f.write(text)
print('Saved verification-report.md')
