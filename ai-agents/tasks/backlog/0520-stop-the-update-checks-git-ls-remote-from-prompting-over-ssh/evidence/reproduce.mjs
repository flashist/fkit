import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const evidence = resolve(import.meta.dirname);
let preamble = readFileSync(resolve(evidence, 'before-update-banner.test.js.snapshot'), 'utf8').split("test('0257/equal-versions:")[0];
preamble = preamble.replace("'./harness.mjs'", JSON.stringify(pathToFileURL(resolve('test/harness.mjs')).href));
preamble = preamble.replace('chmodSync, symlinkSync', 'chmodSync, realpathSync, symlinkSync');
const fixture = readFileSync(resolve(evidence, 'fixture-fragment.txt'), 'utf8');
const probe = `
const f = realGitFixture('scp');
const r = launch(f.root, f.bin, { cwd: f.cwd, env: f.env });
assert.equal(r.code, 0);
assert.equal(r.stderr, '');
assert.equal(banner(r.stdout), null);
assert.equal(existsSync(join(f.root, '.latest')), false);
assert.equal(readFileSync(join(f.root, '.update-check'), 'utf8'), '');
assert.equal(readFileSync(f.sshLog, 'utf8'), '0520-ssh-sentinel\\n');
console.log(JSON.stringify({ controls: f.controls, launcherExit: r.code, stderrEmpty: r.stderr === '', banner: null, latestCreated: false, attemptStampRetained: true, sshSentinelCalls: 1 }));
`;
try {
  await import('data:text/javascript;base64,' + Buffer.from(preamble + fixture + probe).toString('base64'));
} catch (error) {
  console.error(JSON.stringify({ message: error.message, actual: error.actual, expected: error.expected, code: error.code }));
  process.exitCode = 1;
}
