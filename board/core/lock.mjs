// The board's cross-process write lock. Node has no flock, so the lock is an O_EXCL owner file
// naming its holder; a holder that died is detected and its file broken. Limits: see 0418's worklog.
import { randomBytes } from 'node:crypto';
import { closeSync, openSync, readFileSync, statSync, unlinkSync, writeSync } from 'node:fs';
import { hostname } from 'node:os';
import { threadId } from 'node:worker_threads';

export const OWNER_SUFFIX = '.owner';
export const BREAK_SUFFIX = '.break';
// A record still empty after this long was left by a holder that died between create and write.
const UNWRITTEN_GRACE_MS = 10_000;
const MIN_WAIT_MS = 2;
const MAX_WAIT_MS = 50;

export class NestedLockError extends Error {}

const held = new Map();
const sleeper = new Int32Array(new SharedArrayBuffer(4));
let exitHook = false;

function sleep(ms) {
  Atomics.wait(sleeper, 0, 0, ms);
}

function readRecord(path) {
  try {
    const bytes = readFileSync(path);
    return { bytes, ino: statSync(path).ino };
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}

function parseRecord(bytes) {
  try {
    const r = JSON.parse(bytes.toString('utf8'));
    if (r && Number.isSafeInteger(r.pid) && r.pid > 0 && typeof r.host === 'string' && typeof r.token === 'string') return r;
  } catch {
    // unreadable: judged by the file's age below
  }
  return null;
}

function processAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code !== 'ESRCH';
  }
}

function isStale(record, path) {
  const r = parseRecord(record.bytes);
  if (r === null) {
    try {
      return Date.now() - statSync(path).mtimeMs > UNWRITTEN_GRACE_MS;
    } catch (e) {
      if (e.code === 'ENOENT') return false;
      throw e;
    }
  }
  if (r.host !== hostname()) return false;
  if (r.pid !== process.pid) return !processAlive(r.pid);
  if (r.threadId !== threadId) return false;
  if (held.has(r.token)) throw new NestedLockError('this thread already holds the board lock through another Board on the same root');
  // Our pid and thread, but not a lock we hold: an earlier process that had this pid left it.
  return true;
}

function unlinkQuiet(path) {
  try {
    unlinkSync(path);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

// Only the holder of the break file removes another writer's owner file, so two waiters that both
// judged it stale cannot both remove it and then both win. Returns false if another waiter is breaking.
function breakStale(ownerPath, seen) {
  const breakPath = ownerPath.slice(0, -OWNER_SUFFIX.length) + BREAK_SUFFIX;
  let fd;
  try {
    fd = openSync(breakPath, 'wx', 0o644);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
    try {
      if (Date.now() - statSync(breakPath).mtimeMs > UNWRITTEN_GRACE_MS) unlinkQuiet(breakPath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    return false;
  }
  try {
    const now = readRecord(ownerPath);
    if (now !== null && now.ino === seen.ino && now.bytes.equals(seen.bytes)) unlinkQuiet(ownerPath);
  } finally {
    closeSync(fd);
    unlinkQuiet(breakPath);
  }
  return true;
}

function releaseAllOnExit() {
  for (const [token, ownerPath] of [...held]) {
    try {
      releaseLock({ token, ownerPath });
    } catch {
      // exiting anyway; the next writer breaks what is left
    }
  }
}

/** Block until this process holds `<lockPath>.owner`; returns the handle to pass to releaseLock. */
export function acquireLock(lockPath) {
  const ownerPath = lockPath + OWNER_SUFFIX;
  const token = randomBytes(16).toString('hex');
  let wait = MIN_WAIT_MS;
  for (;;) {
    let fd;
    try {
      fd = openSync(ownerPath, 'wx', 0o644);
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      const record = readRecord(ownerPath);
      if (record === null) continue;
      if (isStale(record, ownerPath) && breakStale(ownerPath, record)) continue;
      sleep(wait * (0.5 + Math.random() / 2));
      wait = Math.min(wait * 2, MAX_WAIT_MS);
      continue;
    }
    try {
      const record = { pid: process.pid, threadId, host: hostname(), token, acquired: new Date().toISOString() };
      writeSync(fd, JSON.stringify(record) + '\n');
    } catch (e) {
      closeSync(fd);
      unlinkQuiet(ownerPath);
      throw e;
    }
    closeSync(fd);
    held.set(token, ownerPath);
    if (!exitHook) {
      process.on('exit', releaseAllOnExit);
      exitHook = true;
    }
    return { token, ownerPath };
  }
}

export function releaseLock(handle) {
  if (!held.has(handle.token)) return;
  held.delete(handle.token);
  const record = readRecord(handle.ownerPath);
  if (record !== null && parseRecord(record.bytes)?.token === handle.token) unlinkQuiet(handle.ownerPath);
}
