// The board's web server: a port of aiboard/server.py at aiboard a1592dc, with aiboard T-022 closed (see
// refuseCrossSite). Like aiboard's, it has no state of its own: every request re-reads the folders.
// The page, ../web/index.html, is aiboard a1592dc's aiboard/web/index.html byte for byte
// (sha256 3b32c9e8f0311a73ab87a7de2af790534294f04af1eac25c5d757ef29b1a0dc6).
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { isIPv4, isIPv6 } from 'node:net';
import { delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BoardError, NotFound } from '../core/store.mjs';
import {
  AttributeError,
  ValueError,
  metaGet,
  pyDecodeUtf8,
  pyEncodeUtf8,
  pyJsonDumps,
  pyJsonLoads,
  pyList,
  pyOr,
  pyRepr,
  pyStr,
  pyStrip,
  pyTruthy,
  pyTypeName,
} from '../core/python-compat.mjs';

export const WEB_DIR = fileURLToPath(new URL('../web', import.meta.url));

// ----------------------------------------------------------------------------- urlparse

const SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/;
const USES_PARAMS = new Set(['', 'ftp', 'hdl', 'prospero', 'http', 'imap', 'https', 'shttp', 'rtsp', 'rtspu', 'sip', 'sips', 'mms', 'sftp', 'tel']);

/** urlparse(self.path).path, after http.server reduces a leading "//" to "/" (Python 3.9.6). */
function urlparsePath(target) {
  let url = target.startsWith('//') ? `/${target.replace(/^\/+/, '')}` : target;
  url = url.replace(/[\t\r\n]/g, '');
  let scheme = '';
  const colon = url.indexOf(':');
  if (colon > 0 && SCHEME.test(url.slice(0, colon))) {
    scheme = url.slice(0, colon).toLowerCase();
    url = url.slice(colon + 1);
  }
  if (url.startsWith('//')) {
    let delim = url.length;
    for (const c of '/?#') {
      const at = url.indexOf(c, 2);
      if (at >= 0) delim = Math.min(delim, at);
    }
    const netloc = url.slice(2, delim);
    url = url.slice(delim);
    if (netloc.includes('[') !== netloc.includes(']')) throw new ValueError('Invalid IPv6 URL');
    checkNetloc(netloc);
  }
  const hash = url.indexOf('#');
  if (hash >= 0) url = url.slice(0, hash);
  const query = url.indexOf('?');
  if (query >= 0) url = url.slice(0, query);
  if (USES_PARAMS.has(scheme) && url.includes(';')) {
    const semi = url.includes('/') ? url.indexOf(';', url.lastIndexOf('/')) : url.indexOf(';');
    if (semi >= 0) url = url.slice(0, semi);
  }
  return url;
}

function checkNetloc(netloc) {
  if (!netloc || /^[\x00-\x7f]*$/.test(netloc)) return;
  const n = netloc.replace(/[@:#?]/g, '');
  const normalized = n.normalize('NFKC');
  if (n === normalized) return;
  for (const c of '/?#@:') {
    if (normalized.includes(c)) throw new ValueError(`netloc '${netloc}' contains invalid characters under NFKC normalization`);
  }
}

// ----------------------------------------------------------------------------- request values

function fail(message) {
  throw new BoardError(message);
}

// x.strip() on a raw JSON value: only a str has it.
function strip(value) {
  if (typeof value !== 'string') throw new AttributeError(`'${pyTypeName(value)}' object has no attribute 'strip'`);
  return pyStrip(value);
}

const strStrip = (value) => pyStrip(pyStr(value));

function labels(value) {
  if (value === null) return [];
  if (typeof value === 'string') return value.split(',').map(pyStrip).filter((x) => x);
  return pyList(value).map(strStrip).filter((x) => x);
}

// ----------------------------------------------------------------------------- responses

function send(res, status, body, contentType) {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    // Python's server speaks HTTP/1.0: one request per connection.
    Connection: 'close',
  });
  res.end(body);
}

// Encodes before writing anything, so an encode error can still become an error response.
function sendJson(res, data, status = 200) {
  send(res, status, pyEncodeUtf8(pyJsonDumps(data, null, { ensureAscii: false })), 'application/json; charset=utf-8');
}

// %(code)s is str(HTTPStatus.X) in Python 3.9, hence the name.
const ERROR_PAGE = (code, codeName, message, explain) =>
  '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n        "http://www.w3.org/TR/html4/strict.dtd">\n' +
  '<html>\n    <head>\n        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">\n' +
  '        <title>Error response</title>\n    </head>\n    <body>\n        <h1>Error response</h1>\n' +
  `        <p>Error code: ${code}</p>\n        <p>Message: ${message}.</p>\n` +
  `        <p>Error code explanation: ${codeName} - ${explain}.</p>\n    </body>\n</html>\n`;

const htmlEscape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** BaseHTTPRequestHandler.send_error(501, ...) for a method the handler has no do_X for. */
function sendUnsupported(req, res) {
  const message = `Unsupported method (${pyRepr(req.method)})`;
  const body = Buffer.from(ERROR_PAGE(501, 'HTTPStatus.NOT_IMPLEMENTED', htmlEscape(message), 'Server does not support this operation'), 'utf8');
  res.writeHead(501, message, { Connection: 'close', 'Content-Type': 'text/html;charset=utf-8', 'Content-Length': body.length });
  if (req.method === 'HEAD') res.end();
  else res.end(body);
}

const errorText = (e) => `${e.name}: ${e.message}`;

// ----------------------------------------------------------------------------- aiboard T-022

// A browser lets any site send a "simple" POST (text/plain, no preflight) to 127.0.0.1, and a site whose
// name is re-pointed at 127.0.0.1 counts as same-origin: so a write must name this server as its Host
// and Origin, and send JSON (ADR-052 D6). A missing Origin is not a browser, so it is let through.
function refuseCrossSite(req, ownHost) {
  const hostHeader = req.headers.host ?? '';
  const m = /^(\[[^\]]*\]|[^:[\]]+)(?::\d*)?$/.exec(hostHeader);
  const name = m ? m[1].toLowerCase() : null;
  const bare = name?.startsWith('[') ? name.slice(1, -1) : name;
  const own = ownHost === null ? null : String(ownHost).toLowerCase().replace(/^\[(.*)\]$/, '$1');
  if (!(name === 'localhost' || (bare !== null && (isIPv4(bare) || (name !== bare && isIPv6(bare)) || bare === own)))) {
    return [403, 'write refused: the Host header does not name this board server'];
  }
  const selfOrigin = originOf(`http://${hostHeader}`);
  if (req.headers.origin !== undefined && (selfOrigin === undefined || originOf(req.headers.origin) !== selfOrigin)) {
    return [403, 'write refused: the request comes from another site'];
  }
  const type = (req.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase();
  if (type !== 'application/json') return [415, 'write refused: the body must be sent as application/json'];
  return null;
}

function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

// ----------------------------------------------------------------------------- the handler

/** make_handler(board, read_only): an http request listener. */
export function makeHandler(board, { read_only = false, host = null } = {}) {
  function readBody(req, raw) {
    if (req.headers['content-length'] === undefined || raw.length === 0) return new Map();
    let data;
    try {
      data = pyJsonLoads(pyDecodeUtf8(raw));
    } catch (e) {
      if (e instanceof ValueError) throw new BoardError('request body is not valid JSON');
      throw e;
    }
    if (!(data instanceof Map)) throw new BoardError('request body must be a JSON object');
    return data;
  }

  // Python reads no body before its read-only check, and T-022's checks need only headers: so a refusal
  // is sent before the body is read, and a hostile page cannot make the server hold a large one.
  function refusePOST(req, res) {
    urlparsePath(req.url);
    const refused = read_only ? [400, 'this board is served read-only'] : refuseCrossSite(req, host);
    if (refused) sendJson(res, { error: refused[1] }, refused[0]);
    return refused !== null;
  }

  function doPOST(req, res, raw) {
    const path = urlparsePath(req.url);
    try {
      const body = readBody(req, raw);
      const get = (key) => metaGet(body, key);
      const author = pyOr(strStrip(pyOr(get('author'), 'web')), 'web');
      const parts = path.split('/').filter((p) => p);
      const route = parts.join('/');
      if (route === 'api/tasks' && parts.length === 2) {
        const title = pyOr(strStrip(pyOr(get('title'), '')), null) ?? fail('title is required');
        const t = board.createTask(title, {
          body: pyStr(pyOr(get('body'), '')),
          status: pyOr(get('status'), 'backlog'),
          sprint: pyOr(get('sprint'), null),
          priority: pyOr(get('priority'), 'medium'),
          assignee: pyOr(get('assignee'), null),
          labels: labels(get('labels')),
          author,
        });
        sendJson(res, t.toDict(), 201);
      } else if (parts.length === 4 && parts[0] === 'api' && parts[1] === 'tasks') {
        const [, , tid, action] = parts;
        let t;
        if (action === 'status') {
          t = board.moveTask(tid, pyStr(pyOr(get('status'), '')), {
            author,
            note: pyOr(get('note'), null),
            force: pyTruthy(get('force')),
          });
        } else if (action === 'assign') {
          t = board.assign(tid, pyOr(strip(pyOr(get('assignee'), '')), null), { author, force: pyTruthy(get('force')) });
        } else if (action === 'start') {
          t = board.start(tid, pyOr(strip(pyOr(get('assignee'), author)), author), { author, force: pyTruthy(get('force')) });
        } else if (action === 'comment') {
          t = board.comment(tid, pyOr(strStrip(pyOr(get('message'), '')), null) ?? fail('message is required'), { author });
        } else if (action === 'log') {
          t = board.log(tid, pyOr(strStrip(pyOr(get('message'), '')), null) ?? fail('message is required'), { author });
        } else if (action === 'rank') {
          t = board.rankTask(tid, {
            top: pyTruthy(get('top')),
            bottom: pyTruthy(get('bottom')),
            before: pyOr(get('before'), null),
            after: pyOr(get('after'), null),
          });
        } else if (action === 'edit') {
          const fields = new Map();
          for (const k of ['title', 'priority', 'sprint', 'labels', 'blocked_by']) if (body.has(k)) fields.set(k, body.get(k));
          if (fields.has('labels')) fields.set('labels', labels(fields.get('labels')));
          if (fields.has('blocked_by')) fields.set('blocked_by', labels(fields.get('blocked_by')));
          if (fields.has('sprint') && !pyTruthy(fields.get('sprint'))) fields.set('sprint', null);
          t = board.updateTask(tid, fields);
        } else {
          throw new NotFound(`unknown action ${action}`);
        }
        sendJson(res, t.toDict(true));
      } else if (route === 'api/sprints' && parts.length === 2) {
        const title = pyOr(strStrip(pyOr(get('title'), '')), null) ?? fail('title is required');
        const sp = board.createSprint(title, {
          goal: pyStr(pyOr(get('goal'), '')),
          body: pyStr(pyOr(get('body'), '')),
          status: pyOr(get('status'), 'backlog'),
          start: pyOr(get('start'), null),
          end: pyOr(get('end'), null),
        });
        sendJson(res, sp.toDict(), 201);
      } else if (parts.length === 4 && parts[0] === 'api' && parts[1] === 'sprints' && parts[3] === 'status') {
        sendJson(res, board.moveSprint(parts[2], pyStr(pyOr(get('status'), ''))).toDict());
      } else if (route === 'api/check/fix' && parts.length === 3) {
        const problems = board.check({ fix: true });
        sendJson(res, { ok: problems.every((p) => p.endsWith('(fixed)')), problems });
      } else {
        sendJson(res, { error: 'not found' }, 404);
      }
    } catch (e) {
      if (e instanceof NotFound) sendJson(res, { error: e.message }, 404);
      else if (e instanceof BoardError || e instanceof ValueError) sendJson(res, { error: e.message }, 400);
      else sendJson(res, { error: errorText(e) }, 500);
    }
  }

  function doGET(req, res) {
    const path = urlparsePath(req.url);
    try {
      if (path === '/' || path === '/index.html') {
        send(res, 200, readFileSync(join(WEB_DIR, 'index.html')), 'text/html; charset=utf-8');
      } else if (path === '/api/board') {
        const snap = board.snapshot();
        snap.read_only = read_only;
        sendJson(res, snap);
      } else if (path.startsWith('/api/tasks/')) {
        sendJson(res, board.getTask(path.slice(path.lastIndexOf('/') + 1)).toDict(true));
      } else if (path.startsWith('/api/sprints/')) {
        const sprint = board.getSprint(path.slice(path.lastIndexOf('/') + 1));
        const d = sprint.toDict(true);
        const { tasks, ...progress } = board.sprintProgress(sprint);
        d.progress = progress;
        d.tasks_detail = tasks.map((t) => t.toDict());
        sendJson(res, d);
      } else if (path === '/api/check') {
        const problems = board.check();
        sendJson(res, { ok: problems.length === 0, problems });
      } else {
        sendJson(res, { error: 'not found' }, 404);
      }
    } catch (e) {
      if (e instanceof NotFound) sendJson(res, { error: e.message }, 404);
      else sendJson(res, { error: errorText(e) }, 500);
    }
  }

  // Python's handler raising: socketserver prints the error and drops the connection unanswered.
  function dropOnError(res, fn) {
    try {
      return fn();
    } catch (e) {
      process.stderr.write(`Exception occurred during processing of request\n${e.stack}\n`);
      res.destroy();
      return true;
    }
  }

  return (req, res) => {
    req.on('error', () => {});
    if (req.method === 'POST' && dropOnError(res, () => refusePOST(req, res))) {
      req.resume();
      return;
    }
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      // The whole request runs to its response with no await in between, so web writes apply one at
      // a time, in arrival order (0418 limit 8); other processes are kept out by the store's writeLock.
      dropOnError(res, () => {
        if (req.method === 'GET') doGET(req, res);
        else if (req.method === 'POST') doPOST(req, res, Buffer.concat(chunks));
        else sendUnsupported(req, res);
      });
    });
  };
}

// ----------------------------------------------------------------------------- serve

// webbrowser.open(url): each $BROWSER entry in turn, given the URL as its one argument, then the
// platform's default opener. Every failure is swallowed.
async function openBrowser(url) {
  const run = (cmd, args) =>
    new Promise((resolve) => {
      const child = spawn(cmd, args, { detached: true, stdio: 'ignore' });
      // An opener still running (a blocking $BROWSER entry) must not keep the process alive after Ctrl+C.
      child.unref();
      child.on('error', () => resolve(false));
      child.on('exit', (code) => resolve(code === 0));
    });
  for (const cmd of (process.env.BROWSER ?? '').split(delimiter)) {
    if (cmd && (await run(cmd, [url]))) return;
  }
  if (process.platform === 'darwin') await run('open', [url]);
  else if (process.platform === 'win32') await run('cmd', ['/c', 'start', '', url]);
  else await run('xdg-open', [url]);
}

/** serve(): listen, print aiboard's banner, open the browser after 0.5 s; Ctrl+C stops it. */
export function serve(board, { host = '127.0.0.1', port = 8484, open_browser = true, read_only = false } = {}) {
  const server = createServer(makeHandler(board, { read_only, host }));
  const url = `http://${host}:${port}/`;
  const mode = read_only ? 'read-only' : 'read-write';
  let timer = null;
  server.once('error', (e) => {
    throw e;
  });
  server.listen(port, host, () => {
    process.stdout.write(`aiboard web board: ${url}  (root: ${board.root}, ${mode})  Ctrl+C to stop\n`);
    if (open_browser) timer = setTimeout(() => openBrowser(url).catch(() => {}), 500);
  });
  process.once('SIGINT', () => {
    clearTimeout(timer);
    server.close();
    server.closeAllConnections();
  });
  return server;
}
