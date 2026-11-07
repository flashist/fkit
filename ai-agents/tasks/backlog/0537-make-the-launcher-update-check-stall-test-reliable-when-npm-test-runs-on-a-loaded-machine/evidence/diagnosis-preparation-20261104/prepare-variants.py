from pathlib import Path
import json, hashlib, difflib
S=Path(__file__).resolve().parent
C=json.loads((S/'config.json').read_text()); R=Path(C['root'])
original=(S/'original-static.js').read_text()
assert (R/'test/update-banner.test.js').read_text()==original

def replace_once(text, old, new):
    assert text.count(old)==1, old
    return text.replace(old,new)

reference=replace_once(original,"import { tmpdir } from 'node:os';\n",'')
reference=replace_once(reference,"import { REPO } from './harness.mjs';",f"import {{ REPO }} from '{(R/'test/harness.mjs').as_uri()}';")
reference=replace_once(reference,"after(() => MADE.forEach((d) => { try { rmSync(d, { recursive: true, force: true }); } catch { /* best effort */ } }));", "// Fixtures must outlive assertion failures so passive settlement can inspect them.\nafter(() => {});")
reference=replace_once(reference,"mkdtempSync(join(tmpdir(), prefix))", "mkdtempSync(join(process.env.FKIT_DIAG_FIXTURES, prefix))")
reference=replace_once(reference,"// A failing run must not leave a 20 s sleep behind for the rest of the suite. Called only on failure: a\n// pid is not an identity, and one already dead may since belong to an unrelated process.\nfunction reap(pids) {\n  for (const p of pids) { try { process.kill(p, 'SIGKILL'); } catch { /* already gone */ } }\n}", "function reap(pids) {\n  return;\n}")
observed=replace_once(reference,"after(() => {});", "const OBSERVATIONS = [];\nafter(() => {\n  writeFileSync(process.env.FKIT_DIAG_TRACE, JSON.stringify(OBSERVATIONS.map(({ result, ...entry }) => ({\n    ...entry, result: { ...result, secs: result.secs ?? 'UNKNOWN', readSleepPids: undefined },\n  })), null, 2) + '\\n');\n});")
observed=replace_once(observed,"function launch(root, bin, { args = ['--help'], env = {}, cwd = null, path = null, inheritEnv = false } = {}) {\n", "function launch(root, bin, { args = ['--help'], env = {}, cwd = null, path = null, inheritEnv = false } = {}) {\n  const preparationStartNs = process.hrtime.bigint().toString();\n")
observed=replace_once(observed,"const r = spawnSync('/bin/sh', [join(root, 'claude', 'fkit-claude.sh'), ...args], {", "const spawnOptions = {")
observed=replace_once(observed,"    encoding: 'utf8',\n  });\n  const read =", "    encoding: 'utf8',\n  };\n  const beforeSpawnNs = process.hrtime.bigint().toString();\n  const r = spawnSync('/bin/sh', [join(root, 'claude', 'fkit-claude.sh'), ...args], spawnOptions);\n  const syncReturnNs = process.hrtime.bigint().toString();\n  const read =")
observed=replace_once(observed,"  return {\n    code: r.status, stdout: r.stdout || '', stderr: r.stderr || '', PATH,", "  const result = {\n    code: r.status, stdout: r.stdout || '', stderr: r.stderr || '', PATH,")
observed=replace_once(observed,"    readSleepPids: () => read(sleepLog).map(Number),\n  };\n}", "    readSleepPids: () => read(sleepLog).map(Number),\n  };\n  const postLogReadNs = process.hrtime.bigint().toString();\n  OBSERVATIONS.push({\n    preparationStartNs, beforeSpawnNs, syncReturnNs, postLogReadNs,\n    fixtures: { root, bin, logs, cwd: spawnOptions.cwd, home: spawnOptions.env.HOME },\n    spawn: { pid: r.pid, status: r.status, signal: r.signal, error: r.error?.message ?? null },\n    result,\n  });\n  return result;\n}")
for name, body in [('safe-reference.mjs',reference),('observed.mjs',observed)]:
    (S/name).write_text(body)
    (S/(name+'.diff')).write_text(''.join(difflib.unified_diff(original.splitlines(True),body.splitlines(True),fromfile='STATIC/test/update-banner.test.js',tofile=name)))
(S/'observed-v-reference.diff').write_text(''.join(difflib.unified_diff(reference.splitlines(True),observed.splitlines(True),fromfile='safe-reference.mjs',tofile='observed.mjs')))
print(json.dumps({'referenceSha256':hashlib.sha256(reference.encode()).hexdigest(),'observedSha256':hashlib.sha256(observed.encode()).hexdigest(),'destructiveReaperCallsRemoved':1,'existingReapCallers':reference.count('    reap(')}))
