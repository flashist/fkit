import { spawn } from 'node:child_process';
import { appendFileSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadavg } from 'node:os';

export const now = () => process.hrtime.bigint().toString();
export function append(path, data) {
  appendFileSync(path, JSON.stringify({ monotonicNs: now(), utc: new Date().toISOString(), ...data }) + '\n');
}
function rowsFrom(stdout) {
  return stdout.split('\n').filter(Boolean).map(line => {
    const m = line.match(/^\s*(\d+)\s+(\d+)\s+(\w+\s+\w+\s+\d+\s+\d+:\d+:\d+\s+\d+)\s+(\S+)\s+(.*)$/);
    if (!m) throw Error('UNKNOWN ps row format');
    return { pid: Number(m[1]), ppid: Number(m[2]), start: m[3].replace(/\s+/g, ' '), state: m[4], command: m[5] };
  });
}
async function psRows() {
  const startedNs = now();
  const child = spawn('/bin/ps', ['-axo', 'pid=,ppid=,lstart=,state=,command='], { stdio: ['ignore', 'pipe', 'pipe'], env: { PATH: '/usr/bin:/bin', LC_ALL: 'C' } });
  let stdout = '', stderr = '';
  child.stdout.on('data', b => { stdout += b; });
  child.stderr.on('data', b => { stderr += b; });
  await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', code => code === 0 && !stderr ? resolve() : reject(Error('UNKNOWN ps failed')));
  });
  return { startedNs, endedNs: now(), rows: rowsFrom(stdout) };
}
export class PassiveObserver {
  constructor({ fixtureRoot, output, sampleIntervalMs, runner, onFailure }) {
    Object.assign(this, { fixtureRoot, output, sampleIntervalMs, runner, onFailure });
    this.identities = new Map();
    this.rootStart = null;
    this.runnerExited = false;
    this.unknown = new Set();
    this.samples = 0;
    this.stopRequested = false;
    this.last = null;
    this.logSnapshots = new Map();
    this.logged = new Map();
    this.fixtureNames = new Set();
  }
  start() { this.loop = this.observe(); }
  markRunnerExit() { this.runnerExited = true; }
  async observe() {
    do {
      try { await this.sample(); }
      catch (e) {
        this.unknown.add(e.message);
        append(this.output, { event: 'observation-failed', reason: e.message });
        this.onFailure?.(e.message);
        return;
      }
      if (!this.stopRequested) await new Promise(resolve => setTimeout(resolve, this.sampleIntervalMs));
    } while (!this.stopRequested);
  }
  async finish() {
    this.stopRequested = true;
    await this.loop;
    return this.summary();
  }
  readLogs() {
    for (const entry of readdirSync(this.fixtureRoot, { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.startsWith('fkit-banner-')) {
        this.unknown.add('unrecognized fixture entry');
        continue;
      }
      this.fixtureNames.add(entry.name);
      if (!entry.name.startsWith('fkit-banner-log-')) continue;
      const logs = join(this.fixtureRoot, entry.name);
      const snapshot = {};
      for (const name of ['git', 'curl', 'sleep']) {
        const file = join(logs, name);
        snapshot[name] = existsSync(file) ? readFileSync(file, 'utf8') : '';
      }
      if (JSON.stringify(snapshot) !== JSON.stringify(this.logSnapshots.get(logs))) {
        append(this.output, { event: 'log-snapshot', logs, runnerExited: this.runnerExited, snapshot });
        this.logSnapshots.set(logs, snapshot);
      }
      const gitPids = [...snapshot.git.matchAll(/^pids (\d+) (\d+)$/gm)].flatMap(m => [Number(m[1]), Number(m[2])]);
      const sleepPids = snapshot.sleep.split('\n').filter(Boolean).map(Number);
      for (const pid of [...gitPids, ...sleepPids]) {
        if (!Number.isSafeInteger(pid) || pid <= 0) this.unknown.add('invalid logged pid');
        else {
          const key = `${logs}:${pid}`;
          if (!this.logged.has(key)) this.logged.set(key, { pid, firstNs: now(), logs, matchedKey: null });
        }
      }
    }
  }
  async sample() {
    const snap = await psRows();
    const byPid = new Map(snap.rows.map(row => [row.pid, row]));
    const root = byPid.get(this.runner.pid);
    const owned = new Map();
    if (!this.runnerExited && root) {
      if (!this.rootStart) this.rootStart = root.start;
      if (root.start === this.rootStart && root.command.includes(this.runner.script)) owned.set(root.pid, { row: root, via: 'owned ChildProcess root + observed start' });
      else this.unknown.add('runner identity ambiguous');
    }
    for (const row of snap.rows) {
      if (row.command.includes(this.fixtureRoot + '/')) owned.set(row.pid, { row, via: 'exact invocation fixture path + observed start' });
    }
    for (const [key, tracked] of this.identities) {
      const row = byPid.get(tracked.pid);
      if (!row) {
        if (tracked.status !== 'disappeared') append(this.output, { event: 'identity-state', key, status: 'disappeared', bound: [tracked.lastSeenNs, snap.endedNs] });
        tracked.status = 'disappeared';
      } else if (row.start !== tracked.start) {
        tracked.status = 'reused';
        append(this.output, { event: 'identity-state', key, status: 'reused', differentStart: row.start });
      } else if (tracked.status === 'disappeared' || tracked.status === 'reused') {
        this.unknown.add('identity reappeared / possible same-second PID reuse');
        tracked.status = 'unknown';
      } else owned.set(row.pid, { row, via: tracked.via });
    }
    let changed = true;
    while (changed) {
      changed = false;
      for (const row of snap.rows) {
        if (!owned.has(row.pid) && owned.has(row.ppid)) {
          owned.set(row.pid, { row, via: { parentPid: row.ppid, parentStart: owned.get(row.ppid).row.start } });
          changed = true;
        }
      }
    }
    for (const { row, via } of owned.values()) {
      const key = `${row.pid}:${row.start}`;
      let tracked = this.identities.get(key);
      if (!tracked) {
        tracked = { ...row, via, firstSeenNs: snap.endedNs };
        this.identities.set(key, tracked);
        append(this.output, { event: 'identity-birth-observed', key, identity: tracked });
      }
      tracked.status = row.state.startsWith('Z') ? 'zombie' : 'live';
      tracked.lastSeenNs = snap.endedNs;
      tracked.ppid = row.ppid;
      tracked.state = row.state;
      tracked.command = row.command;
    }
    this.readLogs();
    for (const entry of this.logged.values()) {
      const { pid } = entry;
      if ([...this.logged.values()].some(other => other.pid === pid && other.logs !== entry.logs)) this.unknown.add('same logged PID across launches; provenance ambiguous');
      if (entry.matchedKey) continue;
      const matches = [...this.identities.entries()].filter(([, id]) => id.pid === pid && id.status !== 'reused');
      if (matches.length === 1) entry.matchedKey = matches[0][0];
      else if (matches.length > 1) this.unknown.add('logged PID maps to multiple start identities');
    }
    this.samples++;
    this.last = { startedNs: snap.startedNs, endedNs: snap.endedNs, load: loadavg(), runnerExited: this.runnerExited, identities: [...this.identities.entries()].map(([key, id]) => ({ key, pid: id.pid, ppid: id.ppid, status: id.status, state: id.state })) };
    append(this.output, { event: 'sample', ...this.last });
  }
  summary() {
    const missing = [...this.logged.entries()].filter(([, info]) => !info.matchedKey).map(([, info]) => info);
    const pending = [...this.identities.entries()].filter(([, id]) => !['disappeared', 'reused'].includes(id.status)).map(([key, id]) => ({ key, ...id }));
    return { samples: this.samples, last: this.last, identities: [...this.identities.entries()].map(([key, id]) => ({ key, ...id })), loggedPids: [...this.logged.entries()], missing, pending, unknown: [...this.unknown, ...(!this.rootStart ? ['runner start identity not captured'] : [])], fixtureNames: [...this.fixtureNames], logs: [...this.logSnapshots.entries()], status: missing.length || this.unknown.size || !this.rootStart ? 'UNKNOWN' : pending.length ? 'PENDING' : 'OBSERVED_IDENTITIES_SETTLED', limits: ['ps lstart resolution is one second; same-second PID reuse cannot always be separated', 'Passive sampling can miss short-lived descendants; no complete-process-coverage guarantee', 'ps disappearance bounds completion, never exact launcher exit or KILL time', 'Original alive(pid,0) assertion is separate and may misidentify reused PIDs'] };
  }
}
