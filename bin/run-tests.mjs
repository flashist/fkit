import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const enabled = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  .fkit.testsEnabled;
if (typeof enabled !== 'boolean') throw new Error('fkit.testsEnabled must be a boolean');

const suite = process.argv[2];
if (suite === '--status') {
  console.log(enabled);
  process.exit(0);
}

const testFiles = (directory) => readdirSync(new URL(`../${directory}/`, import.meta.url))
  .filter((name) => name.endsWith('.test.js')).sort().map((name) => `${directory}/${name}`);
const suites = {
  unit: () => [process.execPath, ['--test', ...testFiles('test'), ...testFiles('test/board')]],
  docs: () => [process.execPath, ['--test', 'test/dual-home-parity.test.js', 'test/task-id-uniqueness.test.js']],
  release: () => [process.execPath, ['--test', ...testFiles('test/release')]],
  'prove-red': () => ['bash', ['test/prove-red.sh']],
};
if (!Object.hasOwn(suites, suite)) throw new Error(`Unknown test suite: ${suite}`);

// Keep the pause ahead of discovery and spawning so disabled suites do no work.
if (!enabled) {
  console.log(`SKIPPED: ${suite} tests are temporarily disabled (package.json: fkit.testsEnabled=false). No tests ran.`);
  process.exit(0);
}

const [command, args] = suites[suite]();
const result = spawnSync(command, [...args, ...process.argv.slice(3)], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
if (result.signal) {
  console.error(`Test runner terminated by ${result.signal}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
