import { spawn, fork } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, lstatSync, realpathSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadavg, availableParallelism } from 'node:os';
import { PassiveObserver, append, now } from './passive-observer.mjs';

const scratch = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(scratch, 'config.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(scratch, 'sealed-manifest.json'), 'utf8'));
const iteration = Number(process.argv[3]);
if (process.argv.length !== 4 || process.argv[2] !== '--iteration' || !Number.isInteger(iteration) || iteration < 1 || iteration > 5) throw Error('Usage: node supervisor.mjs --iteration <1..5>');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const blob = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
function preflight() {
  if (realpathSync(scratch) !== config.scratch || process.execPath !== config.node) throw Error('Scratch or Node identity changed');
  if (availableParallelism() !== config.availableParallelism || config.N !== config.availableParallelism + 2) throw Error('Fixed load recipe changed');
  for (const key of ['FKIT_BANNER_ROOT', 'FKIT_LAUNCHER', 'NODE_OPTIONS', 'NODE_TEST_CONTEXT']) if (process.env[key]) throw Error(`Unexpected inherited ${key}; reconcile before execution`);
  for (const [name, digest] of Object.entries(manifest.sha256)) if (sha256(readFileSync(join(scratch, name))) !== digest) throw Error(`Prepared artifact drift: ${name}`);
  if (sha256(readFileSync(join(config.root, 'test/harness.mjs'))) !== manifest.originalHarnessSha256) throw Error('Original harness import changed');
  for (const [name, digest] of Object.entries(config.sourceAnchors)) if (blob(readFileSync(join(config.root, name))) !== digest) throw Error(`Source anchor drift: ${name}`);
  if (iteration > 1) {
    const prior = JSON.parse(readFileSync(join(config.evidence, `iteration-${iteration - 1}`, 'result.json'), 'utf8'));
    if (prior.status !== 'COMPLETE' || prior.invocations.length !== 4) throw Error('Previous iteration incomplete; no automatic continuation');
  }
}
preflight();
const durable = join(config.evidence, `iteration-${iteration}`);
const runRoot = join(scratch, `iteration-${iteration}`);
mkdirSync(durable);
mkdirSync(runRoot);
const audit = join(durable, 'audit.jsonl');
let interrupted = false;
let stopReason = null;
let manager;
function interrupt(reason) {
  interrupted = true;
  stopReason = reason;
  append(audit, { event: 'interrupted', reason });
  manager?.requestStop();
}
process.on('SIGINT', () => interrupt('SIGINT received; no signal forwarding'));
process.on('SIGTERM', () => interrupt('SIGTERM received; no signal forwarding'));
process.on('SIGHUP', () => interrupt('SIGHUP received; no signal forwarding'));
class Burners {
  constructor() { this.entries = []; this.issues = []; this.stopping = false; }
  async start() {
    for (let i = 0; i < config.N; i++) {
      if (interrupted || this.stopping) throw Error('Burner startup interrupted');
      const child = fork(join(scratch, 'burner.mjs'), [String(config.burnerChunkOperations)], { execPath: config.node, execArgv: [], stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
      const entry = { index: i, child, ready: false, exited: false, closed: false, exit: null };
      this.entries.push(entry);
      entry.closedPromise = new Promise(resolveClose => child.once('close', (code, signal) => {
        entry.closed = true;
        if (!entry.exited) this.issues.push(`burner ${i}: no exit event`);
        append(audit, { event: 'burner-close', index: i, pid: child.pid ?? null, code, signal });
        resolveClose();
      }));
      child.once('exit', (code, signal) => {
        entry.exited = true;
        entry.exit = { code, signal };
        append(audit, { event: 'burner-exit', index: i, pid: child.pid, code, signal });
        if (!this.stopping || code !== 0 || signal !== null) {
          this.issues.push(`burner ${i}: unexpected exit`);
          interrupt(`burner ${i}: unexpected exit`);
        }
      });
      child.on('error', error => {
        this.issues.push(`burner ${i}: ${error.code ?? 'IPC error'}`);
        interrupt(`burner ${i}: IPC/startup error`);
      });
      child.on('disconnect', () => {
        append(audit, { event: 'burner-disconnect', index: i, pid: child.pid ?? null });
        if (!this.stopping) { this.issues.push(`burner ${i}: unexpected disconnect`); interrupt('Unexpected burner disconnect'); }
      });
      append(audit, { event: 'burner-spawn', index: i, pid: child.pid ?? null, privateIPC: true, chunkOperations: config.burnerChunkOperations });
      await new Promise((resolveReady, rejectReady) => {
        child.once('error', rejectReady);
        child.once('close', () => { if (!entry.ready) rejectReady(Error('Burner closed before ready')); });
        child.on('message', message => {
          if (message?.type !== 'ready' || message.pid !== child.pid || entry.ready) {
            this.issues.push(`burner ${i}: invalid ready message`);
            interrupt('Invalid burner ready message');
            rejectReady(Error('Invalid burner ready message'));
          } else {
            entry.ready = true;
            append(audit, { event: 'burner-ready', index: i, pid: child.pid });
            resolveReady();
          }
        });
      });
    }
  }
  requestStop() {
    if (this.stopping) return;
    this.stopping = true;
    for (const entry of this.entries) {
      const { child, index } = entry;
      if (entry.closed) continue;
      if (child.connected) {
        append(audit, { event: 'burner-stop-request', index, privateIPC: true });
        child.send({ type: 'stop' }, error => {
          if (error) {
            this.issues.push(`burner ${index}: stop send failed`);
            append(audit, { event: 'burner-stop-send-failed', index });
            if (child.connected) child.disconnect();
          }
        });
      } else if (!entry.exited) this.issues.push(`burner ${index}: disconnected before known exit`);
    }
  }
  async stop() {
    this.requestStop();
    await Promise.all(this.entries.map(entry => entry.closedPromise));
    return { requestedN: config.N, spawned: this.entries.length, entries: this.entries.map(({ index, child, ready, exited, closed, exit }) => ({ index, pid: child.pid ?? null, ready, exited, closed, exit })), issues: this.issues, status: this.issues.length || this.entries.some(e => !e.exited || !e.closed || e.exit?.code !== 0 || e.exit?.signal !== null) ? 'UNKNOWN' : 'IPC_STOPPED_AND_EXITED' };
  }
}
function textLines(path) { return existsSync(path) ? readFileSync(path, 'utf8').trim().split('\n').filter(Boolean) : []; }
function launchRows(trace, passive) {
  if (!trace) return passive.logs.map(([logs, snapshot]) => ({
    logs, rSecs: 'UNKNOWN', monotonicHoldSeconds: 'UNKNOWN', preparationSeconds: 'UNKNOWN', logReadSeconds: 'UNKNOWN',
    atAssertionSnapshot: 'UNKNOWN', status: 'UNKNOWN', signal: 'UNKNOWN', stdout: 'UNKNOWN', stderr: 'UNKNOWN', banner: 'UNKNOWN',
    finalGitCalls: snapshot.git.split('\n').filter(Boolean), finalWoke: /^woke$/m.test(snapshot.git),
    explanation: 'Safety-modified reference emits no extra per-launch passing-assertion timings or result snapshots; TAP/observer evidence remains separate',
  }));
  return trace.map(entry => {
    const seconds = (a, b) => Number(BigInt(b) - BigInt(a)) / 1e9;
    const git = textLines(join(entry.fixtures.logs, 'git'));
    const before = passive.identities.filter(id => BigInt(id.firstSeenNs) <= BigInt(entry.syncReturnNs) && BigInt(id.lastSeenNs) >= BigInt(entry.beforeSpawnNs));
    return {
      ...entry, rSecs: entry.result.secs, monotonicHoldSeconds: seconds(entry.beforeSpawnNs, entry.syncReturnNs),
      preparationSeconds: seconds(entry.preparationStartNs, entry.beforeSpawnNs), logReadSeconds: seconds(entry.syncReturnNs, entry.postLogReadNs),
      atAssertionSnapshot: { gitCalls: entry.result.gitCalls, stalling: entry.result.gitCalls.includes('stalling'), woke: entry.result.gitCalls.includes('woke'), label: 'original launch log-read snapshot supplied to assertions' },
      postReturn: { finalGitCalls: git, woke: git.includes('woke'), label: 'final retained log; passive JSONL bounds post-return changes' },
      banner: entry.result.stdout.split('\n').filter(line => line.includes('↑ fkit')), originalAssertionPassFail: 'See unchanged node:test TAP per-test result; no synthetic assertion verdict',
      identityCandidatesOverLaunchInterval: before,
      survivorsAtExactLauncherExit: 'UNKNOWN; shell disappearance is a sampled bound only', survivorsAtSyncReturn: 'See nearest bracketing passive samples; exact membership UNKNOWN between samples',
    };
  });
}
async function invocation(index, variant, pattern) {
  preflight();
  if (interrupted || manager.issues.length || manager.entries.some(e => !e.ready || e.exited)) throw Error('Load no longer fixed; stop new invocations');
  const name = `${index}-${variant}-${pattern.includes('term-ignored') ? 'focused' : 'group'}`;
  const dir = join(runRoot, name), output = join(durable, name);
  mkdirSync(dir); mkdirSync(output);
  const fixtureRoot = join(dir, 'fixtures'); mkdirSync(fixtureRoot);
  const tracePath = join(output, 'observed-trace.json');
  const script = join(scratch, `${variant}.mjs`);
  const argv = ['--test', `--test-name-pattern=${pattern}`, script];
  const record = { iteration, index, variant, label: variant === 'safe-reference' ? 'safety-modified reference harness; unchanged launcher' : 'observed safety-modified harness; unchanged launcher', command: [config.node, ...argv], fixtureRoot, sourceAnchors: config.sourceAnchors, artifactHashes: manifest.sha256, N: config.N, loadBefore: loadavg(), startedNs: now(), assertionResult: 'PENDING', cleanup: 'PENDING' };
  writeFileSync(join(output, 'checkpoint.json'), JSON.stringify(record, null, 2) + '\n');
  append(audit, { event: 'invocation-start', ...record });
  const child = spawn(config.node, argv, { cwd: config.root, env: { ...process.env, FKIT_DIAG_FIXTURES: fixtureRoot, FKIT_DIAG_TRACE: tracePath }, stdio: ['ignore', 'pipe', 'pipe'] });
  let spawnError = null;
  child.on('error', error => { spawnError = error.message; });
  const observer = new PassiveObserver({ fixtureRoot, output: join(output, 'passive.jsonl'), sampleIntervalMs: config.sampleIntervalMs, runner: { pid: child.pid, script }, onFailure: reason => interrupt(`Passive observer failed: ${reason}`) });
  observer.start();
  child.stdout.on('data', b => { appendFileSyncRaw(join(output, 'stdout.tap'), b); });
  child.stderr.on('data', b => { appendFileSyncRaw(join(output, 'stderr.txt'), b); });
  const exit = await new Promise(resolveExit => {
    child.once('exit', (code, signal) => { observer.markRunnerExit(); append(audit, { event: 'test-runner-exit', index, code, signal, pid: child.pid }); });
    child.once('close', (code, signal) => { observer.markRunnerExit(); resolveExit({ code, signal, spawnError, pipeCloseNs: now() }); });
  });
  record.returnedNs = now();
  record.exit = exit;
  record.assertionResult = exit.code === 0 && !exit.signal && !spawnError ? 'NODE_TEST_PASS' : 'NODE_TEST_FAIL_OR_INTERRUPTED';
  append(audit, { event: 'invocation-test-return', index, ...exit, load: loadavg() });
  while (!observer.unknown.size && (!observer.last || BigInt(observer.last.startedNs) < BigInt(record.returnedNs))) {
    await new Promise(resolveWait => setTimeout(resolveWait, config.sampleIntervalMs));
  }
  let summary = observer.summary();
  while (!summary.unknown.length && !summary.missing.length && summary.pending.length) {
    if (interrupted || manager.issues.length) break;
    await new Promise(resolveWait => setTimeout(resolveWait, config.sampleIntervalMs));
    summary = observer.summary();
  }
  summary = await observer.finish();
  const trace = variant === 'observed' && existsSync(tracePath) ? JSON.parse(readFileSync(tracePath, 'utf8')) : null;
  if (variant === 'observed' && !trace) summary.unknown.push('missing observed trace');
  if (!summary.samples || !summary.fixtureNames.length) summary.unknown.push('no fixture observation');
  const currentFixtures = readdirSync(fixtureRoot).sort();
  if (JSON.stringify(currentFixtures) !== JSON.stringify([...summary.fixtureNames].sort())) summary.unknown.push('fixture inventory differs from passive recorded inventory');
  const exactFixtureDirectories = currentFixtures.map(name => join(fixtureRoot, name));
  if (exactFixtureDirectories.some(path => !lstatSync(path).isDirectory() || lstatSync(path).isSymbolicLink() || dirname(realpathSync(path)) !== realpathSync(fixtureRoot))) summary.unknown.push('fixture path escape or non-directory');
  const settled = !interrupted && !summary.pending.length && !summary.missing.length && !summary.unknown.length && !spawnError && exit.signal === null;
  record.passive = summary;
  record.launches = launchRows(trace, summary);
  record.fixtureDirectories = exactFixtureDirectories;
  record.loadAfter = loadavg();
  record.cleanup = 'UNKNOWN_OR_PENDING; FIXTURES_RETAINED';
  record.completedNs = now();
  record.limits = ['Safety/lifecycle changes may alter reproduction', 'Fixture deletion is deferred; no machine-wide sandbox or complete cleanup guarantee', 'Original test alive(pid,0) is observational and separate from observer evidence', 'No timing attributed to a KILL timestamp; spawnSync includes pipe completion', 'Reference per-launch cells remain UNKNOWN when original output does not expose them'];
  const savedLogs = join(output, 'retained-logs');
  mkdirSync(savedLogs);
  for (const path of exactFixtureDirectories.filter(path => basename(path).startsWith('fkit-banner-log-'))) {
    const destination = join(savedLogs, basename(path));
    mkdirSync(destination);
    for (const name of ['git', 'curl', 'sleep']) if (existsSync(join(path, name))) copyFileSync(join(path, name), join(destination, name));
  }
  writeFileSync(join(output, 'result.json'), JSON.stringify(record, null, 2) + '\n');
  if (settled) {
    append(audit, { event: 'fixture-cleanup-authorized-by-observed-settlement', index, exactFixtureDirectories, limitation: 'Passive sampling is incomplete; no machine-wide guarantee' });
    for (const path of exactFixtureDirectories) {
      if (dirname(realpathSync(path)) !== realpathSync(fixtureRoot) || lstatSync(path).isSymbolicLink()) throw Error('Fixture cleanup path changed; retain remaining fixtures');
      rmSync(path, { recursive: true });
      append(audit, { event: 'fixture-directory-removed', index, path });
    }
    record.cleanup = 'OBSERVED_IDENTITIES_SETTLED; EXACT_RECORDED_FIXTURE_DIRECTORIES_REMOVED';
    writeFileSync(join(output, 'result.json'), JSON.stringify(record, null, 2) + '\n');
  }
  append(audit, { event: 'invocation-complete', index, assertionResult: record.assertionResult, cleanup: record.cleanup });
  return { result: record, settled, resultPath: join(output, 'result.json') };
}
function appendFileSyncRaw(path, bytes) {
  // Raw TAP remains separate from the observation record so failures stay inspectable.
  writeFileSync(path, bytes, { flag: 'a' });
}
const result = { iteration, status: 'INCOMPLETE', N: config.N, invocations: [], authority: 'Relayed diagnosis-only approval; no source repair', startedUTC: new Date().toISOString() };
append(audit, { event: 'iteration-reserved', iteration, N: config.N, load: loadavg() });
manager = new Burners();
try {
  await manager.start();
  for (const [index, variant, pattern] of [[1, 'safe-reference', '^0284/term-ignored:'], [2, 'safe-reference', '^0284/'], [3, 'observed', '^0284/term-ignored:'], [4, 'observed', '^0284/']]) {
    if (interrupted) break;
    const item = await invocation(index, variant, pattern);
    result.invocations.push({ index, variant, path: item.resultPath, assertionResult: item.result.assertionResult, cleanup: item.result.cleanup });
    if (!item.settled) { stopReason = 'Passive provenance or settlement UNKNOWN/PENDING; stop new runs'; break; }
  }
} catch (error) {
  stopReason = error.message;
  append(audit, { event: 'supervisor-error', reason: error.message });
} finally {
  result.burners = await manager.stop();
  result.interrupted = interrupted;
  result.stopReason = stopReason;
  result.status = !interrupted && !stopReason && result.invocations.length === 4 && result.burners.status === 'IPC_STOPPED_AND_EXITED' ? 'COMPLETE' : 'NEEDS-DECISION';
  result.finishedUTC = new Date().toISOString();
  result.loadAfterIPCStop = loadavg();
  writeFileSync(join(durable, 'result.json'), JSON.stringify(result, null, 2) + '\n');
}
process.exitCode = result.status === 'COMPLETE' ? 0 : 2;
