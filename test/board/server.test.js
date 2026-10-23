// The board's web server (board/server/server.mjs), ported from aiboard a1592dc's tests/test_server.py.
// ServerTests keeps aiboard's test names verbatim, in aiboard's order, so 0423 can match each one; the
// other tests are new for 0422: aiboard T-022's fix, simultaneous writes, and requests read as Python
// reads them. Every expected string below was printed by aiboard a1592dc under Python 3.9.6.
// Every board here is a fixture under the OS temp folder (ADR-052 Q16): see assertFixture.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync } from 'node:fs';
import { createServer, request } from 'node:http';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, test } from 'node:test';
import { Board } from '../../board/core/store.mjs';
import { makeHandler } from '../../board/server/server.mjs';

const MAIN = fileURLToPath(new URL('../../board/cli/main.mjs', import.meta.url));
const PAGE = fileURLToPath(new URL('../../board/web/index.html', import.meta.url));
const PAGE_SHA256 = '3b32c9e8f0311a73ab87a7de2af790534294f04af1eac25c5d757ef29b1a0dc6';
const TMP = realpathSync(tmpdir());
const JSON_TYPE = { 'Content-Type': 'application/json' };

let tmp;
let board;
let server;
let port;

function assertFixture(root) {
  assert.ok(root.startsWith(TMP + sep) && !root.split(sep).includes('ai-agents'), `not a fixture board: ${root}`);
}

async function startServer(b, opts) {
  assertFixture(b.root);
  const srv = createServer(makeHandler(b, opts));
  await new Promise((resolve, reject) => {
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', resolve);
  });
  return srv;
}

const stopServer = (srv) =>
  new Promise((resolve) => {
    srv.close(() => resolve());
    srv.closeAllConnections();
  });

// One request on its own connection; only Host and Content-Length are added to the given headers.
function send(p, method, path, { headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const data = body === null ? null : Buffer.from(body);
    const h = { ...headers };
    if (data !== null) h['Content-Length'] = data.length;
    const r = request({ host: '127.0.0.1', port: p, method, path, headers: h, agent: false }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('error', reject);
      res.on('end', () => {
        const raw = Buffer.concat(chunks);
        let json;
        try {
          json = JSON.parse(raw.toString('utf8'));
        } catch {
          json = undefined;
        }
        resolve({ status: res.statusCode, message: res.statusMessage, headers: res.headers, raw, text: raw.toString('utf8'), json });
      });
    });
    r.on('error', reject);
    r.end(data ?? undefined);
  });
}

const post = (path, data, headers = JSON_TYPE) => send(port, 'POST', path, { headers, body: JSON.stringify(data) });

// aiboard's req(): POST JSON with author "mark" first when data is given, otherwise GET.
async function req(path, data = null) {
  const r = data === null ? await send(port, 'GET', path) : await post(path, { author: 'mark', ...data });
  return [r.status, r.json];
}

// Every file and folder under root, with contents: a refused write must leave this unchanged.
function tree(root) {
  const out = {};
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        out[`${relative(root, p)}/`] = '';
        walk(p);
      } else out[relative(root, p)] = readFileSync(p, 'latin1');
    }
  };
  walk(root);
  return out;
}

function childEnv() {
  const env = { ...process.env, BROWSER: 'true' };
  delete env.NODE_TEST_CONTEXT;
  delete env.AIBOARD_ROOT;
  return env;
}

// The CLI in a child process, killed if it outlives the timeout; always awaited.
function runCli(argv) {
  assertFixture(tmp);
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [MAIN, ...argv], { cwd: tmp, env: childEnv(), stdio: ['ignore', 'pipe', 'pipe'], timeout: 30_000, killSignal: 'SIGKILL' });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', reject);
    child.on('close', (code, signal) => resolve({ code, signal, stdout, stderr }));
  });
}

beforeEach(async () => {
  tmp = realpathSync(mkdtempSync(join(TMP, 'board-server-')));
  board = new Board(tmp);
  board.init({ name: 'Srv' });
  server = await startServer(board);
  port = server.address().port;
});

afterEach(async () => {
  await stopServer(server);
  rmSync(tmp, { recursive: true, force: true });
});

describe('ServerTests', () => {
  test('test_critical_priority', async () => {
    let [status, t] = await req('/api/tasks', { title: 'Prod is down', priority: 'urgent' });
    assert.deepEqual([status, t.priority], [201, 'critical']);
    [status, t] = await req('/api/tasks/T-001/edit', { priority: 'high' });
    assert.deepEqual([status, t.priority], [200, 'high']);
    [status, t] = await req('/api/tasks/T-001/edit', { priority: 'critical' });
    assert.deepEqual([status, t.priority], [200, 'critical']);
    const [code, err] = await req('/api/tasks/T-001/edit', { priority: 'bogus' });
    assert.equal(code, 400);
    assert.ok(err.error.includes('critical'));
  });

  test('test_rank_endpoint', async () => {
    for (const title of ['a', 'b', 'c']) await req('/api/tasks', { title });
    let [status, t] = await req('/api/tasks/T-003/rank', { top: true });
    assert.deepEqual([status, t.id], [200, 'T-003']);
    [status, t] = await req('/api/tasks/T-001/rank', { after: 'T-002' });
    assert.equal(status, 200);
    const [, snap] = await req('/api/board');
    assert.deepEqual(snap.tasks.map((x) => x.id), ['T-003', 'T-002', 'T-001']);
    assert.ok(snap.tasks.every((x) => 'rank' in x));
    assert.equal((await req('/api/tasks/T-001/rank', {}))[0], 400);
    assert.equal((await req('/api/tasks/T-001/rank', { before: 'T-099' }))[0], 404);
  });

  test('test_index_and_board', async () => {
    const page = await send(port, 'GET', '/');
    assert.ok(page.raw.includes('<title>aiboard</title>'));
    const [status, snap] = await req('/api/board');
    assert.deepEqual([status, snap.name, snap.read_only], [200, 'Srv', false]);
  });

  test('test_write_flow', async () => {
    let [status, sp] = await req('/api/sprints', { title: 'Sprint 1', status: 'in-progress', author: 'mark' });
    assert.deepEqual([status, sp.id], [201, 'S-001']);
    let t;
    [status, t] = await req('/api/tasks', { title: 'From the browser', sprint: 'S-001', labels: 'ui, web', author: 'mark' });
    assert.deepEqual([status, t.id, t.labels], [201, 'T-001', ['ui', 'web']]);
    [status, t] = await req('/api/tasks/T-001/status', { status: 'in-progress', author: 'mark' });
    assert.deepEqual([status, t.status], [200, 'in-progress']);
    [status, t] = await req('/api/tasks/T-001/assign', { assignee: 'mark', author: 'mark' });
    assert.equal(t.assignee, 'mark');
    [status] = await req('/api/tasks/T-001/assign', { assignee: 'someone', author: 'other' });
    assert.equal(status, 400);
    [status, t] = await req('/api/tasks/T-001/assign', { assignee: 'someone', author: 'other', force: true });
    assert.equal(t.assignee, 'someone');
    await req('/api/tasks/T-001/assign', { assignee: 'mark', author: 'mark', force: true });
    let t3;
    [status, t3] = await req('/api/tasks', { title: 'Startable', author: 'mark' });
    [status, t3] = await req(`/api/tasks/${t3.id}/start`, { author: 'mark' });
    assert.deepEqual([status, t3.status, t3.assignee], [200, 'in-progress', 'mark']);
    [status, t] = await req('/api/tasks/T-001/log', { message: 'looked at it', author: 'mark' });
    assert.equal(t.worklog.at(-1).text, 'looked at it');
    assert.equal(t.worklog.at(-1).author, 'mark');
    [status, t] = await req('/api/tasks/T-001/comment', { message: 'Please add tests', author: 'reviewer' });
    assert.deepEqual([status, t.comments.at(-1).author, t.comments_count], [200, 'reviewer', 1]);
    assert.equal((await req('/api/tasks/T-001/comment', { message: '' }))[0], 400);
    [status, t] = await req('/api/tasks/T-001/edit', { priority: 'high', labels: ['x'] });
    assert.deepEqual([t.priority, t.labels], ['high', ['x']]);
    let t2;
    [status, t2] = await req('/api/tasks', { title: 'Blocked', blocked_by: ['T-001'] });
    assert.equal(status, 201);
    const bid = t2.id;
    [status, t2] = await req(`/api/tasks/${bid}/edit`, { blocked_by: 'T-001' });
    assert.deepEqual([t2.blocked_by, t2.blocked], [['T-001'], true]);
    [status] = await req(`/api/tasks/${bid}/status`, { status: 'in-progress' });
    assert.equal(status, 400);
    [status, t2] = await req(`/api/tasks/${bid}/status`, { status: 'in-progress', force: true });
    assert.equal(t2.status, 'in-progress');
    let s;
    [status, s] = await req('/api/sprints/S-001/status', { status: 'done' });
    assert.equal(s.status, 'done');
    [status] = await req('/api/check/fix', {});
    assert.equal(status, 200);
    assert.equal(board.getTask('T-001').status, 'in-progress');
  });

  test('test_errors', async () => {
    assert.equal((await req('/api/tasks', { title: '' }))[0], 400);
    assert.equal((await req('/api/tasks/T-9/status', { status: 'done' }))[0], 404);
    board.createTask('x');
    assert.equal((await req('/api/tasks/T-1/status', { status: 'bogus' }))[0], 400);
    assert.equal((await req('/api/tasks/T-1/nope', {}))[0], 404);
    assert.equal((await req('/api/whatever', {}))[0], 404);
    const r = await send(port, 'POST', '/api/tasks', { headers: JSON_TYPE, body: 'not json' });
    assert.equal(r.status, 400);
  });

  test('test_read_only', async () => {
    const ro = await startServer(board, { read_only: true });
    try {
      const roPort = ro.address().port;
      const r = await send(roPort, 'POST', '/api/tasks', { headers: JSON_TYPE, body: '{"title": "x"}' });
      assert.equal(r.status, 400);
      assert.equal((await send(roPort, 'GET', '/api/board')).json.read_only, true);
    } finally {
      await stopServer(ro);
    }
  });
});

describe('a write must come from the board page itself (aiboard T-022)', () => {
  beforeEach(() => {
    board.createTask('one');
    board.createTask('two');
    board.createTask('three');
    board.createSprint('Sprint 1');
  });

  // Each body is a write the server would carry out if it let the request through.
  const ENDPOINTS = [
    ['/api/tasks', { title: 'pwned' }, 201],
    ['/api/tasks/T-001/status', { status: 'done' }, 200],
    ['/api/tasks/T-002/assign', { assignee: 'evil' }, 200],
    ['/api/tasks/T-003/start', {}, 200],
    ['/api/tasks/T-001/comment', { message: 'pwned' }, 200],
    ['/api/tasks/T-001/log', { message: 'pwned' }, 200],
    ['/api/tasks/T-002/rank', { top: true }, 200],
    ['/api/tasks/T-001/edit', { title: 'pwned' }, 200],
    ['/api/sprints', { title: 'pwned' }, 201],
    ['/api/sprints/S-001/status', { status: 'done' }, 200],
    ['/api/check/fix', {}, 200],
  ];

  test('T-022 reproduction: a page on another site closing a task is refused', async () => {
    const before = tree(tmp);
    // aiboard T-022, demonstrated 2026-09-18: a CORS "simple" request, so the browser sends no preflight.
    const r = await send(port, 'POST', '/api/tasks/T-001/status', {
      headers: { Origin: 'https://evil.example', 'Content-Type': 'text/plain;charset=UTF-8' },
      body: '{"status":"done","author":"Mark"}',
    });
    assert.equal(r.status, 403);
    assert.equal(typeof r.json.error, 'string');
    assert.equal(board.getTask('T-001').status, 'backlog');
    assert.deepEqual(tree(tmp), before);
  });

  test('every write endpoint refuses a cross-site write and leaves the board untouched', async () => {
    const shapes = [
      ['text/plain, no Origin', { 'Content-Type': 'text/plain;charset=UTF-8' }, 415],
      ['JSON from another site', { 'Content-Type': 'application/json', Origin: 'https://evil.example' }, 403],
      ['Origin: null', { 'Content-Type': 'application/json', Origin: 'null' }, 403],
      ['DNS rebinding', { 'Content-Type': 'application/json', Host: `evil.example:${port}`, Origin: `http://evil.example:${port}` }, 403],
    ];
    const before = tree(tmp);
    const ro = await startServer(board, { read_only: true });
    try {
      for (const [path, body] of ENDPOINTS) {
        for (const [name, headers, code] of shapes) {
          const data = JSON.stringify({ author: 'evil', ...body });
          const r = await send(port, 'POST', path, { headers, body: data });
          assert.deepEqual([r.status, typeof r.json?.error], [code, 'string'], `${path}, ${name}`);
          const h = name === 'DNS rebinding' ? { ...headers, Host: `evil.example:${ro.address().port}` } : headers;
          const rr = await send(ro.address().port, 'POST', path, { headers: h, body: data });
          assert.deepEqual([rr.status, rr.json], [400, { error: 'this board is served read-only' }], `read-only ${path}, ${name}`);
        }
      }
    } finally {
      await stopServer(ro);
    }
    assert.deepEqual(tree(tmp), before);
    // The same writes from the page itself go through, so each refusal above was the check's doing.
    const own = { 'Content-Type': 'application/json', Origin: `http://127.0.0.1:${port}` };
    for (const [path, body, code] of ENDPOINTS) {
      const r = await post(path, { author: 'mark', ...body }, own);
      assert.equal(r.status, code, `${path}: ${r.text}`);
    }
  });

  test('writes from the page, from agents and from IP-literal hosts still work', async () => {
    const page = { Origin: `http://127.0.0.1:${port}`, 'Content-Type': 'application/json; charset=utf-8' };
    let r = await post('/api/tasks', { title: 'From the page', author: 'mark' }, page);
    assert.equal(r.status, 201);
    // drag-to-status, as the page sends it
    r = await post('/api/tasks/T-004/status', { author: 'mark', status: 'in-progress' }, page);
    assert.deepEqual([r.status, r.json.status], [200, 'in-progress']);
    const ok = [
      { Host: `localhost:${port}`, Origin: `http://localhost:${port}`, 'Content-Type': 'application/json' },
      { Host: `LocalHost:${port}`, Origin: `http://LOCALHOST:${port}`, 'Content-Type': 'Application/JSON ; charset=utf-8' },
      { 'Content-Type': 'application/json' },
      { Host: `127.0.0.2:${port}`, 'Content-Type': 'application/json' },
      { Host: `[::1]:${port}`, Origin: `http://[::1]:${port}`, 'Content-Type': 'application/json' },
    ];
    for (const headers of ok) {
      r = await post('/api/tasks/T-001/comment', { author: 'mark', message: 'hi' }, headers);
      assert.equal(r.status, 200, `${JSON.stringify(headers)}: ${r.text}`);
    }
    const refused = [
      [{ Origin: `http://127.0.0.1:${port + 1}`, 'Content-Type': 'application/json' }, 403],
      [{ Origin: `https://127.0.0.1:${port}`, 'Content-Type': 'application/json' }, 403],
      [{ Origin: '', 'Content-Type': 'application/json' }, 403],
      [{ Host: `board.test:${port}`, 'Content-Type': 'application/json' }, 403],
      [{ Host: `127.0.0.1.evil.example:${port}`, 'Content-Type': 'application/json' }, 403],
      [{}, 415],
      [{ 'Content-Type': 'application/x-www-form-urlencoded' }, 415],
      [{ 'Content-Type': 'multipart/form-data; boundary=x' }, 415],
      [{ 'Content-Type': 'application/json-patch+json' }, 415],
    ];
    const before = tree(tmp);
    for (const [headers, code] of refused) {
      r = await post('/api/tasks/T-001/comment', { author: 'evil', message: 'pwned' }, headers);
      assert.equal(r.status, code, JSON.stringify(headers));
    }
    assert.deepEqual(tree(tmp), before);
    // The host the server was started on is its own name too.
    const named = await startServer(board, { host: 'board.test' });
    try {
      r = await send(named.address().port, 'POST', '/api/tasks/T-001/comment', {
        headers: { Host: `Board.Test:${named.address().port}`, Origin: `http://board.test:${named.address().port}`, 'Content-Type': 'application/json' },
        body: '{"message": "named"}',
      });
      assert.equal(r.status, 200, r.text);
    } finally {
      await stopServer(named);
    }
  });

  test('a preflight and every other method get Python\'s 501, with no CORS header', async () => {
    const page = (method) =>
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n        "http://www.w3.org/TR/html4/strict.dtd">\n' +
      '<html>\n    <head>\n        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">\n' +
      '        <title>Error response</title>\n    </head>\n    <body>\n        <h1>Error response</h1>\n' +
      `        <p>Error code: 501</p>\n        <p>Message: Unsupported method ('${method}').</p>\n` +
      '        <p>Error code explanation: HTTPStatus.NOT_IMPLEMENTED - Server does not support this operation.</p>\n    </body>\n</html>\n';
    for (const method of ['OPTIONS', 'PUT', 'DELETE', 'PATCH', 'HEAD']) {
      const r = await send(port, method, '/api/tasks/T-001/status', {
        headers: { Origin: 'https://evil.example', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' },
      });
      assert.equal(r.status, 501);
      assert.equal(r.message, `Unsupported method ('${method}')`);
      assert.equal(r.headers['content-type'], 'text/html;charset=utf-8');
      assert.equal(r.headers['content-length'], String(Buffer.byteLength(page(method))));
      assert.equal(r.headers.connection, 'close');
      assert.equal(r.text, method === 'HEAD' ? '' : page(method));
      assert.deepEqual(Object.keys(r.headers).filter((k) => k.startsWith('access-control-')), []);
    }
  });
});

describe('simultaneous writes', () => {
  test('none is lost or reordered, from the web and the command line at once', { timeout: 60_000 }, async () => {
    board.createSprint('Sprint 1');
    const inSprint = (i) => i % 2 === 0;
    const web = Array.from({ length: 40 }, (_, i) =>
      post('/api/tasks', { author: 'mark', title: `web ${i}`, ...(inSprint(i) ? { sprint: 'S-001' } : {}) }),
    );
    const cli = Array.from({ length: 4 }, (_, i) =>
      runCli(['--root', tmp, 'task', 'new', `cli ${i}`, ...(inSprint(i) ? ['--sprint', 'S-001'] : [])]),
    );
    const [webRes, cliRes] = await Promise.all([Promise.all(web), Promise.all(cli)]);

    const titleOf = new Map();
    webRes.forEach((r, i) => {
      assert.equal(r.status, 201, r.text);
      assert.equal(r.json.title, `web ${i}`);
      titleOf.set(r.json.id, `web ${i}`);
    });
    cliRes.forEach((r, i) => {
      assert.deepEqual([r.code, r.stderr], [0, ''], r.stderr);
      const id = /^Created (T-\d+) in backlog: /.exec(r.stdout)?.[1];
      assert.ok(id, r.stdout);
      titleOf.set(id, `cli ${i}`);
    });
    const ids = Array.from({ length: 44 }, (_, i) => `T-${String(i + 1).padStart(3, '0')}`);
    assert.deepEqual([...titleOf.keys()].sort(), ids);

    const tasks = board.listTasks();
    assert.deepEqual(tasks.map((t) => t.id), ids);
    for (const t of tasks) assert.equal(t.title, titleOf.get(t.id), t.id);
    for (let i = 1; i < tasks.length; i++) assert.ok(tasks[i].rank > tasks[i - 1].rank, tasks[i].id);
    const members = ids.filter((id) => inSprint(Number(titleOf.get(id).split(' ')[1])));
    assert.deepEqual(board.getSprint('S-001').tasks, members);
    assert.deepEqual(board.check(), []);

    const comments = await Promise.all(
      Array.from({ length: 30 }, (_, i) => post('/api/tasks/T-001/comment', { author: 'mark', message: `comment ${i}` })),
    );
    const final = board.getTask('T-001').comments.map((c) => c.text);
    assert.deepEqual([...final].sort(), Array.from({ length: 30 }, (_, i) => `comment ${i}`).sort());
    assert.deepEqual(comments.map((r) => r.json.comments_count).sort((a, b) => a - b), Array.from({ length: 30 }, (_, i) => i + 1));
    // Each response saw exactly the comments before it: the writes ran one at a time, in one order.
    for (const r of comments) {
      assert.equal(r.status, 200);
      assert.deepEqual(r.json.comments.map((c) => c.text), final.slice(0, r.json.comments_count));
    }
  });
});

describe('requests are read as Python reads them', () => {
  test('bodies: dicts keep their key order, NaN, bad UTF-8, a non-object', async () => {
    board.createTask('one');
    let r = await send(port, 'POST', '/api/tasks/T-001/log', { headers: JSON_TYPE, body: '{"message": "m", "author": {"b": 1, "2": 2}}' });
    assert.equal(r.status, 200, r.text);
    assert.equal(r.json.worklog.at(-1).author, "{'b': 1, '2': 2}");
    r = await send(port, 'POST', '/api/tasks', { headers: JSON_TYPE, body: '{"title": NaN}' });
    assert.deepEqual([r.status, r.json.title], [201, 'nan']);
    r = await send(port, 'POST', '/api/tasks', { headers: JSON_TYPE, body: Buffer.from([0x7b, 0xff, 0x7d]) });
    assert.deepEqual([r.status, r.text], [400, '{"error": "request body is not valid JSON"}']);
    r = await send(port, 'POST', '/api/tasks', { headers: JSON_TYPE, body: '[1]' });
    assert.deepEqual([r.status, r.text], [400, '{"error": "request body must be a JSON object"}']);
    r = await send(port, 'POST', '/api/tasks', { headers: JSON_TYPE, body: '' });
    assert.deepEqual([r.status, r.text], [400, '{"error": "title is required"}']);
  });

  test('paths: query, params, repeated slashes and the absolute form', async () => {
    const paths = ['/api/tasks?x=1', '/api/tasks;v=1', '//api/tasks', '/api//tasks/', 'http://127.0.0.1/api/tasks#f'];
    for (const path of paths) {
      const r = await send(port, 'POST', path, { headers: JSON_TYPE, body: '{"title": "t"}' });
      assert.equal(r.status, 201, path);
    }
    let r = await send(port, 'POST', '/api//tasks//T-001///comment', { headers: JSON_TYPE, body: '{"message": "m"}' });
    assert.equal(r.status, 200);
    r = await send(port, 'POST', '/api/tasks/T-001', { headers: JSON_TYPE, body: '{}' });
    assert.deepEqual([r.status, r.text], [404, '{"error": "not found"}']);
    r = await send(port, 'GET', '/api/board?x=1');
    assert.equal(r.status, 200);
  });

  test('GET responses: sprint detail, check, not found, headers', async () => {
    board.createSprint('Sprint 1');
    board.createTask('one', { sprint: 'S-001' });
    let r = await send(port, 'GET', '/api/sprints/S-001');
    assert.equal(r.status, 200);
    assert.deepEqual(Object.keys(r.json), [
      'id', 'title', 'status', 'goal', 'start', 'end', 'tasks', 'created', 'updated', 'folder', 'path', 'description', 'progress', 'tasks_detail',
    ]);
    assert.deepEqual(r.json.progress, { total: 1, counts: { backlog: 1, 'in-progress': 0, done: 0, cancelled: 0 }, percent: 0, remaining: 1 });
    assert.deepEqual(r.json.tasks_detail.map((t) => t.id), ['T-001']);
    assert.equal(r.headers['content-type'], 'application/json; charset=utf-8');
    assert.equal(r.headers['cache-control'], 'no-store');
    assert.equal(r.headers['content-length'], String(r.raw.length));
    r = await send(port, 'GET', '/api/check');
    assert.deepEqual([r.status, r.text], [200, '{"ok": true, "problems": []}']);
    r = await send(port, 'GET', '/nope');
    assert.deepEqual([r.status, r.text], [404, '{"error": "not found"}']);
    r = await send(port, 'GET', '/api/tasks/T-099');
    assert.equal(r.status, 404);
    r = await send(port, 'GET', '/api/tasks/T-001');
    assert.deepEqual([r.status, r.json.brief, r.json.worklog.length], [200, '# one\n\n_No description yet._', 1]);
  });

  test('fields of the wrong JSON type: Python\'s status and body', async () => {
    board.createTask('one');
    const err = (type, what) => `{"error": "${type}: '${what}' object ${type === 'TypeError' ? 'is not iterable' : "has no attribute 'strip'"}"}`;
    const exact = [
      ['/api/tasks/T-001/assign', '{"assignee": 1}', 500, err('AttributeError', 'int')],
      ['/api/tasks/T-001/assign', '{"assignee": 1.5}', 500, err('AttributeError', 'float')],
      ['/api/tasks/T-001/assign', '{"assignee": true}', 500, err('AttributeError', 'bool')],
      ['/api/tasks/T-001/assign', '{"assignee": ["a"]}', 500, err('AttributeError', 'list')],
      ['/api/tasks/T-001/assign', '{"assignee": {"a": 1}}', 500, err('AttributeError', 'dict')],
      ['/api/tasks/T-001/start', '{"assignee": ["a"]}', 500, err('AttributeError', 'list')],
      ['/api/tasks', '{"title": "t", "labels": 0}', 500, err('TypeError', 'int')],
      ['/api/tasks', '{"title": "t", "labels": 1.5}', 500, err('TypeError', 'float')],
      ['/api/tasks', '{"title": "t", "labels": true}', 500, err('TypeError', 'bool')],
      ['/api/tasks', '{"title": []}', 400, '{"error": "title is required"}'],
      ['/api/tasks/T-001/comment', '{"message": {}}', 400, '{"error": "message is required"}'],
    ];
    for (const [path, body, code, text] of exact) {
      const r = await send(port, 'POST', path, { headers: JSON_TYPE, body });
      assert.deepEqual([r.status, r.text], [code, text], `${path} ${body}`);
    }
    const stored = [
      ['/api/tasks', '{"title": {"a": 1}}', 201, (t) => t.title, "{'a': 1}"],
      ['/api/tasks', '{"title": ["a"]}', 201, (t) => t.title, "['a']"],
      ['/api/tasks', '{"title": true}', 201, (t) => t.title, 'True'],
      ['/api/tasks', '{"title": "t", "assignee": {"a": 1}}', 201, (t) => t.assignee, "{'a': 1}"],
      ['/api/tasks', '{"title": "t", "assignee": ["a"]}', 201, (t) => t.assignee, ['a']],
      ['/api/tasks/T-001/comment', '{"message": ["a"]}', 200, (t) => t.comments.at(-1).text, "['a']"],
      ['/api/tasks/T-001/edit', '{"labels": {"a": 1}}', 200, (t) => t.labels, ['a']],
      ['/api/tasks/T-001/edit', '{"labels": [1]}', 200, (t) => t.labels, ['1']],
      ['/api/tasks/T-001/edit', '{"title": {}}', 200, (t) => t.title, '{}'],
      ['/api/tasks/T-001/assign', '{"assignee": [], "force": "x"}', 200, (t) => t.assignee, null],
    ];
    for (const [path, body, code, pick, want] of stored) {
      const r = await send(port, 'POST', path, { headers: JSON_TYPE, body });
      assert.deepEqual([r.status, pick(r.json)], [code, want], `${path} ${body}`);
    }
  });

  test('an id field holding a list: Python\'s 500, and the board untouched', async () => {
    board.createTask('one');
    board.createTask('two');
    board.createSprint('Sprint 1');
    const before = tree(tmp);
    const cases = [];
    for (const ref of ['["a"]', '[1]']) {
      cases.push(['/api/tasks', `{"title": "t", "sprint": ${ref}}`]);
      cases.push(['/api/tasks/T-002/edit', `{"sprint": ${ref}}`]);
      cases.push(['/api/tasks/T-002/rank', `{"before": ${ref}}`]);
      cases.push(['/api/tasks/T-002/rank', `{"after": ${ref}}`]);
    }
    for (const [path, body] of cases) {
      const r = await send(port, 'POST', path, { headers: JSON_TYPE, body });
      assert.deepEqual([r.status, r.text], [500, `{"error": "AttributeError: 'list' object has no attribute 'strip'"}`], `${path} ${body}`);
    }
    assert.deepEqual(tree(tmp), before);
  });
});

describe('the page', () => {
  test('is aiboard a1592dc\'s page, served byte for byte', async () => {
    const bytes = readFileSync(PAGE);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), PAGE_SHA256);
    for (const path of ['/', '/index.html']) {
      const r = await send(port, 'GET', path);
      assert.equal(r.status, 200);
      assert.ok(r.raw.equals(bytes), path);
      assert.equal(r.headers['content-type'], 'text/html; charset=utf-8');
      assert.equal(r.headers['cache-control'], 'no-store');
    }
  });
});

describe('serve from the command line', () => {
  async function freePort() {
    const s = createServer();
    await new Promise((resolve) => s.listen(0, '127.0.0.1', resolve));
    const p = s.address().port;
    await new Promise((resolve) => s.close(resolve));
    return p;
  }

  async function serveChild(extra) {
    assertFixture(tmp);
    const p = await freePort();
    const child = spawn(process.execPath, [MAIN, '--root', tmp, 'serve', '--no-open', '--port', String(p), ...extra], {
      cwd: tmp,
      env: childEnv(),
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 30_000,
      killSignal: 'SIGKILL',
    });
    const exited = new Promise((resolve) => child.on('exit', (code, signal) => resolve({ code, signal })));
    let stdout = '';
    let stderr = '';
    child.stderr.on('data', (d) => (stderr += d));
    try {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`no banner: ${stdout} ${stderr}`)), 10_000);
        child.stdout.on('data', (d) => {
          stdout += d;
          if (stdout.includes('\n')) {
            clearTimeout(timer);
            resolve();
          }
        });
        child.on('exit', () => {
          clearTimeout(timer);
          reject(new Error(`exited early: ${stderr}`));
        });
      });
      const snap = await send(p, 'GET', '/api/board');
      child.kill('SIGINT');
      return { p, stdout, snap: snap.json, exit: await exited };
    } finally {
      const late = setTimeout(() => child.kill('SIGKILL'), 5_000);
      await exited;
      clearTimeout(late);
    }
  }

  test('prints aiboard\'s banner, serves the board, and stops cleanly on Ctrl+C', { timeout: 60_000 }, async () => {
    for (const [extra, mode, readOnly] of [[[], 'read-write', false], [['--read-only'], 'read-only', true]]) {
      const { p, stdout, snap, exit } = await serveChild(extra);
      assert.equal(stdout, `aiboard web board: http://127.0.0.1:${p}/  (root: ${tmp}, ${mode})  Ctrl+C to stop\n`);
      assert.deepEqual([snap.name, snap.read_only], ['Srv', readOnly]);
      assert.deepEqual(exit, { code: 0, signal: null });
    }
  });
});
