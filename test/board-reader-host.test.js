// `fkit board`'s reader answers only under a Host that names it (task 0538): localhost or an IP literal.
// It is run as the shipped process on a throwaway tree and probed over raw sockets, so the Host header
// (and its absence) is exactly what the test wrote, not what an HTTP client fills in.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { connect } from 'node:net';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const TITLE = 'Demo task for the host check';
const PATHS = ['/', '/api/board', '/api/check', '/api/tasks/0001', '/api/sprints/BACKLOG'];

let root;
let child;
let exited;
let port;

before(async () => {
  root = mkdtempSync(join(realpathSync(tmpdir()), 'fkit-board-host-'));
  mkdirSync(join(root, 'ai-agents', 'tasks', 'backlog', '0001-demo'), { recursive: true });
  mkdirSync(join(root, 'ai-agents', 'sprints'), { recursive: true });
  writeFileSync(join(root, 'ai-agents', 'tasks', 'backlog', '0001-demo', 'brief.md'),
    `# ${TITLE}\n\n## ID\n0001\n\n## Sprint\nBacklog\n\n## Status\n📋 To do\n`);
  writeFileSync(join(root, 'ai-agents', 'sprints', 'backlog.md'),
    '# Backlog\n\n| ID | Task | Status |\n|---|---|---|\n| 0001 | Demo | 📋 To do |\n');

  child = spawn(process.execPath, [join(REPO, 'bin', 'fkit-board.mjs'), '--root', root, '--port', '0'],
    { env: { ...process.env, BROWSER: 'true' }, stdio: ['ignore', 'pipe', 'pipe'] });
  exited = new Promise((resolve) => child.once('exit', resolve));
  port = await new Promise((resolve, reject) => {
    let out = '';
    let err = '';
    const timer = setTimeout(() => reject(new Error(`no banner in 15 s; stderr: ${err}`)), 15000);
    child.stdout.on('data', (d) => {
      out += d;
      const m = /http:\/\/127\.0\.0\.1:(\d+)\//.exec(out);
      if (m) { clearTimeout(timer); resolve(Number(m[1])); }
    });
    child.stderr.on('data', (d) => { err += d; });
    child.once('exit', (code) => { clearTimeout(timer); reject(new Error(`reader exited ${code}: ${err}`)); });
  });
});

after(async () => {
  if (child && child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
  if (exited) await exited;
  if (root) rmSync(root, { recursive: true, force: true });
});

function send({ path, host, method = 'GET', version = '1.1' }) {
  const head = `${method} ${path} HTTP/${version}\r\n${host === undefined ? '' : `Host: ${host}\r\n`}`
    + 'Connection: close\r\n\r\n';
  return new Promise((resolve, reject) => {
    const socket = connect(port, '127.0.0.1');
    const chunks = [];
    socket.setTimeout(10000, () => socket.destroy(new Error('no answer in 10 s')));
    socket.on('data', (d) => chunks.push(d));
    socket.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8');
      const split = text.indexOf('\r\n\r\n');
      resolve({ status: Number(text.split(' ')[1]), body: text.slice(split + 4) });
    });
    socket.on('error', reject);
    socket.write(head);
  });
}

test('local host names and IP literals get the board', async () => {
  for (const name of ['127.0.0.1', 'localhost', 'LocalHost', '[::1]', '127.0.0.2']) {
    for (const path of PATHS) {
      const { status } = await send({ path, host: `${name}:${port}` });
      assert.equal(status, 200, `${name} ${path}`);
    }
  }
  const { body } = await send({ path: '/api/board', host: `localhost:${port}` });
  assert.ok(body.includes(TITLE), 'the allowed answer carries the board data the refused one must not');
});

test('any other host name is refused with 403 and no board data or path', async () => {
  for (const name of ['evil.example', '127.0.0.1.evil.example']) {
    for (const path of PATHS) {
      const { status, body } = await send({ path, host: `${name}:${port}` });
      assert.equal(status, 403, `${name} ${path}`);
      assert.deepEqual(JSON.parse(body), { error: 'read refused: the Host header does not name this board server' });
      assert.ok(!body.includes(TITLE) && !body.includes(root), `${name} ${path} leaked`);
    }
  }
});

test('no Host: 403 from the reader on HTTP/1.0, 400 from Node on HTTP/1.1', async () => {
  const old = await send({ path: '/api/board', version: '1.0' });
  assert.equal(old.status, 403);
  assert.ok(!old.body.includes(TITLE) && !old.body.includes(root));
  const modern = await send({ path: '/api/board' });
  assert.equal(modern.status, 400);
  assert.ok(!modern.body.includes(TITLE) && !modern.body.includes(root));
});

test('a non-GET is still 405, whatever its Host', async () => {
  for (const name of ['127.0.0.1', 'evil.example']) {
    const { status } = await send({ path: '/api/board', host: `${name}:${port}`, method: 'POST' });
    assert.equal(status, 405, name);
  }
});
