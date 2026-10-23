// Python 3 string and value behaviour the board's port depends on: where plain JS gives a different
// answer on the same input, the board must give Python's (aiboard a1592dc is the reference).
import { closeSync, openSync, readFileSync, readlinkSync, writeFileSync } from 'node:fs';

export class ValueError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

// str.isspace(): JS trim() lacks \x1c-\x1f and \x85, and wrongly includes \ufeff.
const WS = '\\t\\n\\v\\f\\r\\x1c-\\x20\\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000';
export const PY_WS_CLASS = `[${WS}]`;
export const PY_NON_WS_CLASS = `[^${WS}]`;
const WS_CHARS = new Set('\t\n\v\f\r\x1c\x1d\x1e\x1f \x85\xa0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000');
const LINE_BREAK = /\r\n|[\n\r\v\f\x1c\x1d\x1e\x85\u2028\u2029]/u;

// A loop, not a regex: a trailing-whitespace regex backtracks quadratically on long interior runs.
export function pyStrip(s) {
  let end = s.length;
  while (end > 0 && WS_CHARS.has(s[end - 1])) end -= 1;
  return pyLstrip(s.slice(0, end));
}

export function pyRstrip(s) {
  let end = s.length;
  while (end > 0 && WS_CHARS.has(s[end - 1])) end -= 1;
  return s.slice(0, end);
}

export function pyLstrip(s) {
  let start = 0;
  while (start < s.length && WS_CHARS.has(s[start])) start += 1;
  return s.slice(start);
}

export function pySplitlines(s) {
  if (s === '') return [];
  const lines = s.split(LINE_BREAK);
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

// Python's dict.get returns None for a missing key; JSON needs null, not a dropped key.
export const metaGet = (meta, key) => (meta.has(key) ? meta.get(key) : null);

export function pyTruthy(v) {
  if (v === null || v === undefined || v === false || v === 0 || v === 0n || v === '') return false;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof Map) return v.size > 0;
  return true;
}

export const pyOr = (v, fallback) => (pyTruthy(v) ? v : fallback);

export function pyTypeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint' || (typeof v === 'number' && Number.isInteger(v))) return 'int';
  if (typeof v === 'number') return 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (v instanceof Map) return 'dict';
  return typeof v;
}

// list(x): a str becomes its code points; anything not iterable in Python raises TypeError.
export function pyList(v) {
  if (Array.isArray(v)) return v.slice();
  if (typeof v === 'string') return Array.from(v);
  if (v instanceof Map) return [...v.keys()];
  throw new TypeError(`'${pyTypeName(v)}' object is not iterable`);
}

function floatStr(n) {
  if (Number.isNaN(n)) return 'nan';
  if (n === Infinity) return 'inf';
  if (n === -Infinity) return '-inf';
  return String(n);
}

const NON_PRINTABLE = /[\p{C}\p{Z}]/u;

function reprStr(s) {
  const quote = s.includes("'") && !s.includes('"') ? '"' : "'";
  let out = quote;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (ch === quote || ch === '\\') out += '\\' + ch;
    else if (ch === '\t') out += '\\t';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (cp < 0x20 || cp === 0x7f) out += '\\x' + cp.toString(16).padStart(2, '0');
    else if (cp < 0x7f || ch === ' ' || !NON_PRINTABLE.test(ch)) out += ch;
    else if (cp <= 0xff) out += '\\x' + cp.toString(16).padStart(2, '0');
    else if (cp <= 0xffff) out += '\\u' + cp.toString(16).padStart(4, '0');
    else out += '\\U' + cp.toString(16).padStart(8, '0');
  }
  return out + quote;
}

export function pyRepr(v) {
  if (typeof v === 'string') return reprStr(v);
  if (Array.isArray(v)) return '[' + v.map(pyRepr).join(', ') + ']';
  if (v instanceof Map) return '{' + [...v].map(([k, x]) => `${pyRepr(k)}: ${pyRepr(x)}`).join(', ') + '}';
  return pyStr(v);
}

export function pyStr(v) {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : floatStr(v);
  if (Array.isArray(v) || v instanceof Map) return pyRepr(v);
  // No Python type to copy (a dict is a Map here); falling through to pyRepr would recurse forever.
  throw new TypeError(`no Python str() for ${Object.prototype.toString.call(v)}; use a Map for a dict`);
}

// A \p{Nd} character's value: Unicode lays decimal digits out in contiguous runs of ten, 0 to 9.
const ND = /^\p{Nd}$/u;
export function pyDigitValue(ch) {
  let cp = ch.codePointAt(0);
  let offset = 0;
  while (ND.test(String.fromCodePoint(cp - 1))) {
    cp -= 1;
    offset += 1;
  }
  return offset % 10;
}

export const pyAsciiDigits = (s) => Array.from(s, (ch) => (ch >= '0' && ch <= '9' ? ch : String(pyDigitValue(ch)))).join('');

const PY_INT = new RegExp(`^${PY_WS_CLASS}*([+-]?)(\\p{Nd}+(?:_\\p{Nd}+)*)${PY_WS_CLASS}*$`, 'u');

// int(str) in base 10: optional sign, any Unicode decimal digits, single underscores between digits.
export function pyInt(s) {
  const m = PY_INT.exec(s);
  if (!m) throw new ValueError(`invalid literal for int() with base 10: ${pyRepr(s)}`);
  return Number(BigInt(m[1] + pyAsciiDigits(m[2].replaceAll('_', ''))));
}

function cmpCodePoints(a, b) {
  const x = Array.from(a);
  const y = Array.from(b);
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const d = x[i].codePointAt(0) - y[i].codePointAt(0);
    if (d !== 0) return d;
  }
  return x.length - y.length;
}

// max() over strings: Python orders by code point, JS's < by UTF-16 unit.
export function pyMax(strings) {
  let best = strings[0];
  for (const s of strings.slice(1)) if (cmpCodePoints(s, best) > 0) best = s;
  return best;
}

// str(PurePosixPath(p)): POSIX keeps exactly two leading slashes, three or more collapse to one.
export function pyPosixPath(p) {
  const s = String(p);
  let root = '';
  if (s.startsWith('/')) root = s.startsWith('//') && !s.startsWith('///') ? '//' : '/';
  const parts = s.split('/').filter((x) => x !== '' && x !== '.');
  const out = root + parts.join('/');
  return out === '' ? '.' : out;
}

export function pyPathName(p) {
  const parts = pyPosixPath(p).split('/').filter((x) => x !== '' && x !== '.');
  return parts.length ? parts[parts.length - 1] : '';
}

export const pyCompare = cmpCodePoints;

function pyError(name, base = Error) {
  return class extends base {
    constructor(message) {
      super(message);
      this.name = name;
    }
  };
}

export const UnicodeDecodeError = pyError('UnicodeDecodeError', ValueError);
export const UnicodeEncodeError = pyError('UnicodeEncodeError', ValueError);
export const JSONDecodeError = pyError('JSONDecodeError', ValueError);
export const OverflowError = pyError('OverflowError');
export const AttributeError = pyError('AttributeError');
export const RuntimeError = pyError('RuntimeError');
export const IndexError = pyError('IndexError');
// Python's re.error, which is not a ValueError.
export const ReError = pyError('error');

const DECODER = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

// Where CPython's strict UTF-8 decoder stops, and why: [start, end, reason].
function utf8Error(buf) {
  let i = 0;
  while (i < buf.length) {
    const b = buf[i];
    if (b < 0x80) {
      i += 1;
      continue;
    }
    let need;
    let lo = 0x80;
    let hi = 0xbf;
    if (b >= 0xc2 && b <= 0xdf) need = 1;
    else if (b >= 0xe0 && b <= 0xef) {
      need = 2;
      if (b === 0xe0) lo = 0xa0;
      if (b === 0xed) hi = 0x9f;
    } else if (b >= 0xf0 && b <= 0xf4) {
      need = 3;
      if (b === 0xf0) lo = 0x90;
      if (b === 0xf4) hi = 0x8f;
    } else return [i, i + 1, 'invalid start byte'];
    for (let j = 1; j <= need; j++) {
      if (i + j >= buf.length) return [i, buf.length, 'unexpected end of data'];
      const c = buf[i + j];
      if (j === 1 ? c < lo || c > hi : c < 0x80 || c > 0xbf) return [i, i + j, 'invalid continuation byte'];
    }
    i += need + 1;
  }
  return [0, 1, 'invalid data'];
}

/** bytes.decode("utf-8"): strict, BOM kept, CPython's error message. */
export function pyDecodeUtf8(buf) {
  try {
    return DECODER.decode(buf);
  } catch {
    const [start, end, reason] = utf8Error(buf);
    const where = end - start === 1
      ? `byte 0x${buf[start].toString(16).padStart(2, '0')} in position ${start}`
      : `bytes in position ${start}-${end - 1}`;
    throw new UnicodeDecodeError(`'utf-8' codec can't decode ${where}: ${reason}`);
  }
}

/** Path.read_text(encoding="utf-8"): strict decoding, BOM kept, \r\n and lone \r read as \n. */
export function pyReadText(path) {
  return pyDecodeUtf8(readFileSync(path)).replace(/\r\n?/g, '\n');
}

/** str.encode("utf-8"): strict, so a lone surrogate raises UnicodeEncodeError with CPython's message. */
export function pyEncodeUtf8(text) {
  const m = /[\uD800-\uDFFF]+/u.exec(text);
  if (m) {
    const start = Array.from(text.slice(0, m.index)).length;
    const n = m[0].length;
    const where = n === 1
      ? `character '\\u${m[0].charCodeAt(0).toString(16)}' in position ${start}`
      : `characters in position ${start}-${start + n - 1}`;
    throw new UnicodeEncodeError(`'utf-8' codec can't encode ${where}: surrogates not allowed`);
  }
  return Buffer.from(text, 'utf8');
}

/** Path.write_text(text, encoding="utf-8"): truncates first, so a failed encode leaves the file empty. */
export function pyWriteText(path, text) {
  const fd = openSync(path, 'w');
  try {
    writeFileSync(fd, pyEncodeUtf8(text));
  } finally {
    closeSync(fd);
  }
}

// posixpath.normpath.
function normpath(p) {
  if (p === '') return '.';
  let initial = p.startsWith('/') ? 1 : 0;
  if (p.startsWith('//') && !p.startsWith('///')) initial = 2;
  const comps = [];
  for (const comp of p.split('/')) {
    if (comp === '' || comp === '.') continue;
    if (comp !== '..' || (!initial && !comps.length) || (comps.length && comps[comps.length - 1] === '..')) comps.push(comp);
    else if (comps.length) comps.pop();
  }
  return '/'.repeat(initial) + comps.join('/') || '.';
}

/** Python 3.9's non-strict Path.resolve(): symlinks expanded part by part, missing parts kept, ".." lexical. */
export function pyResolve(p) {
  const seen = new Map();
  const walk = (path, rest) => {
    if (rest.startsWith('/')) path = '';
    for (const name of rest.split('/')) {
      if (!name || name === '.') continue;
      if (name === '..') {
        path = path.slice(0, Math.max(0, path.lastIndexOf('/')));
        continue;
      }
      const next = path.endsWith('/') ? path + name : `${path}/${name}`;
      if (seen.has(next)) {
        path = seen.get(next);
        if (path !== null) continue;
        throw new RuntimeError(`Symlink loop from ${pyRepr(next)}`);
      }
      let target;
      try {
        target = readlinkSync(next);
      } catch (e) {
        if (e.errno === undefined) throw e;
        path = next;
        continue;
      }
      seen.set(next, null);
      path = walk(path, target);
      seen.set(next, path);
    }
    return path;
  };
  const s = pyPosixPath(p);
  return pyPosixPath(normpath(walk(s.startsWith('/') ? '' : process.cwd(), s) || '/'));
}

const JSON_WS = new Set([' ', '\t', '\n', '\r']);
const JSON_ESCAPES = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' };
const isDigit = (c) => c !== undefined && c.length === 1 && c >= '0' && c <= '9';
const hexValue = (c) => (c !== undefined && /^[0-9a-fA-F]$/.test(c) ? parseInt(c, 16) : -1);

class StopScan {
  constructor(idx) {
    this.idx = idx;
  }
}

/**
 * json.loads(str) as CPython 3.9's C scanner reads it: objects become Maps in source key order (a
 * repeated key keeps its first place and its last value), NaN and Infinity are accepted, integers past
 * 2^53 stay exact as BigInt, and errors carry Python's message and code-point position.
 */
export function pyJsonLoads(text) {
  const s = Array.from(text);
  const n = s.length;
  const fail = (msg, pos) => {
    const before = s.slice(0, pos);
    const nl = before.lastIndexOf('\n');
    const line = before.filter((c) => c === '\n').length + 1;
    return new JSONDecodeError(`${msg}: line ${line} column ${pos - nl} (char ${pos})`);
  };
  const ws = (i) => {
    while (i < n && JSON_WS.has(s[i])) i += 1;
    return i;
  };
  const word = (i, w) => i + w.length - 1 < n && s.slice(i, i + w.length).join('') === w;

  const scanString = (end) => {
    const begin = end - 1;
    const chunks = [];
    for (;;) {
      let c = null;
      let next = end;
      for (; next < n; next++) {
        c = s[next];
        if (c === '"' || c === '\\') break;
        if (c.codePointAt(0) <= 0x1f) throw fail('Invalid control character at', next);
      }
      if (next === n) throw fail('Unterminated string starting at', begin);
      chunks.push(s.slice(end, next).join(''));
      next += 1;
      if (c === '"') return [chunks.join(''), next];
      if (next === n) throw fail('Unterminated string starting at', begin);
      c = s[next];
      if (c !== 'u') {
        end = next + 1;
        if (!Object.hasOwn(JSON_ESCAPES, c)) throw fail('Invalid \\escape', end - 2);
        chunks.push(JSON_ESCAPES[c]);
        continue;
      }
      next += 1;
      end = next + 4;
      if (end >= n) throw fail('Invalid \\uXXXX escape', next - 1);
      let cp = 0;
      for (; next < end; next++) {
        const d = hexValue(s[next]);
        if (d < 0) throw fail('Invalid \\uXXXX escape', end - 5);
        cp = cp * 16 + d;
      }
      if (cp >= 0xd800 && cp <= 0xdbff && end + 6 < n && s[next++] === '\\' && s[next++] === 'u') {
        let low = 0;
        end += 6;
        for (; next < end; next++) {
          const d = hexValue(s[next]);
          if (d < 0) throw fail('Invalid \\uXXXX escape', end - 5);
          low = low * 16 + d;
        }
        if (low >= 0xdc00 && low <= 0xdfff) cp = 0x10000 + ((cp - 0xd800) << 10) + (low - 0xdc00);
        else end -= 6;
      }
      chunks.push(String.fromCodePoint(cp));
    }
  };

  const scanNumber = (start) => {
    let idx = start;
    if (s[idx] === '-') {
      idx += 1;
      if (idx >= n) throw new StopScan(start);
    }
    if (isDigit(s[idx]) && s[idx] !== '0') {
      idx += 1;
      while (idx < n && isDigit(s[idx])) idx += 1;
    } else if (s[idx] === '0') idx += 1;
    else throw new StopScan(start);
    let isFloat = false;
    if (idx < n - 1 && s[idx] === '.' && isDigit(s[idx + 1])) {
      isFloat = true;
      idx += 2;
      while (idx < n && isDigit(s[idx])) idx += 1;
    }
    if (idx < n - 1 && (s[idx] === 'e' || s[idx] === 'E')) {
      const eStart = idx;
      idx += 1;
      if (idx < n - 1 && (s[idx] === '-' || s[idx] === '+')) idx += 1;
      while (idx < n && isDigit(s[idx])) idx += 1;
      if (isDigit(s[idx - 1])) isFloat = true;
      else idx = eStart;
    }
    const src = s.slice(start, idx).join('');
    if (isFloat) return [Number(src), idx];
    const v = Number(src);
    return [Number.isSafeInteger(v) ? v + 0 : BigInt(src), idx];
  };

  const scan = (idx) => {
    if (idx >= n) throw new StopScan(idx);
    const c = s[idx];
    if (c === '"') return scanString(idx + 1);
    if (c === '{') {
      const obj = new Map();
      idx = ws(idx + 1);
      if (idx >= n || s[idx] !== '}') {
        for (;;) {
          if (idx >= n || s[idx] !== '"') throw fail('Expecting property name enclosed in double quotes', idx);
          const [key, afterKey] = scanString(idx + 1);
          idx = ws(afterKey);
          if (idx >= n || s[idx] !== ':') throw fail("Expecting ':' delimiter", idx);
          const [value, afterValue] = scan(ws(idx + 1));
          obj.set(key, value);
          idx = ws(afterValue);
          if (idx < n && s[idx] === '}') break;
          if (idx >= n || s[idx] !== ',') throw fail("Expecting ',' delimiter", idx);
          idx = ws(idx + 1);
        }
      }
      return [obj, idx + 1];
    }
    if (c === '[') {
      const arr = [];
      idx = ws(idx + 1);
      if (idx >= n || s[idx] !== ']') {
        for (;;) {
          const [value, afterValue] = scan(idx);
          arr.push(value);
          idx = ws(afterValue);
          if (idx < n && s[idx] === ']') break;
          if (idx >= n || s[idx] !== ',') throw fail("Expecting ',' delimiter", idx);
          idx = ws(idx + 1);
        }
      }
      return [arr, idx + 1];
    }
    if (c === 'n' && word(idx, 'null')) return [null, idx + 4];
    if (c === 't' && word(idx, 'true')) return [true, idx + 4];
    if (c === 'f' && word(idx, 'false')) return [false, idx + 5];
    if (c === 'N' && word(idx, 'NaN')) return [NaN, idx + 3];
    if (c === 'I' && word(idx, 'Infinity')) return [Infinity, idx + 8];
    if (c === '-' && word(idx, '-Infinity')) return [-Infinity, idx + 9];
    return scanNumber(idx);
  };

  if (s[0] === '\ufeff') throw fail('Unexpected UTF-8 BOM (decode using utf-8-sig)', 0);
  let value;
  let end;
  try {
    [value, end] = scan(ws(0));
  } catch (e) {
    if (e instanceof StopScan) throw fail('Expecting value', e.idx);
    throw e;
  }
  end = ws(end);
  if (end !== n) throw fail('Extra data', end);
  return value;
}

const JSON_SHORT = { '"': '\\"', '\\': '\\\\', '\n': '\\n', '\r': '\\r', '\t': '\\t', '\b': '\\b', '\f': '\\f' };

// ensure_ascii: everything outside space..~ is escaped, per UTF-16 unit, in lowercase hex. Without it,
// only control characters below U+0020 are (so DEL and U+2028 stay raw, as in Python).
function jsonQuote(s, ensureAscii = true) {
  let out = '"';
  for (const ch of s.split('')) {
    const c = ch.charCodeAt(0);
    if (JSON_SHORT[ch]) out += JSON_SHORT[ch];
    else if (c >= 0x20 && (c <= 0x7e || !ensureAscii)) out += ch;
    else out += '\\u' + c.toString(16).padStart(4, '0');
  }
  return out + '"';
}

/** A number Python holds as a float: JS cannot tell 24.0 from 24, and json.dumps prints them apart. */
export class PyFloat {
  constructor(value) {
    this.value = value;
  }
}

/** repr(float): shortest round-trip digits, fixed notation for exponents -4 to 15, else e+XX. */
export function pyFloatRepr(x) {
  if (Number.isNaN(x)) return 'nan';
  if (!Number.isFinite(x)) return x > 0 ? 'inf' : '-inf';
  if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
  const [mant, expStr] = x.toExponential().split('e');
  const exp = Number(expStr);
  const digits = mant.replace('-', '').replace('.', '');
  let out;
  if (exp >= -4 && exp < 16) {
    if (exp < 0) out = '0.' + '0'.repeat(-exp - 1) + digits;
    else if (digits.length <= exp + 1) out = digits + '0'.repeat(exp + 1 - digits.length) + '.0';
    else out = `${digits.slice(0, exp + 1)}.${digits.slice(exp + 1)}`;
  } else {
    const frac = digits.length > 1 ? `.${digits.slice(1)}` : '';
    out = `${digits[0]}${frac}e${exp < 0 ? '-' : '+'}${String(Math.abs(exp)).padStart(2, '0')}`;
  }
  return (x < 0 ? '-' : '') + out;
}

/**
 * json.dumps(value, indent=2): `indent = null` gives the one-line form (", " and ": "), and
 * `ensureAscii: false` matches ensure_ascii=False.
 */
export function pyJsonDumps(value, indent = 2, { ensureAscii = true } = {}) {
  const quote = (s) => jsonQuote(s, ensureAscii);
  const enc = (v, level) => {
    if (v === null || v === undefined) return 'null';
    if (v === true) return 'true';
    if (v === false) return 'false';
    if (typeof v === 'string') return quote(v);
    if (typeof v === 'bigint') return String(v);
    if (typeof v === 'number' || v instanceof PyFloat) {
      const n = v instanceof PyFloat ? v.value : v;
      if (Number.isNaN(n)) return 'NaN';
      if (!Number.isFinite(n)) return n > 0 ? 'Infinity' : '-Infinity';
      return v instanceof PyFloat ? pyFloatRepr(n) : String(n);
    }
    const entries = Array.isArray(v) ? null : v instanceof Map ? [...v] : Object.entries(v);
    const items = entries ? entries.map(([k, x]) => `${quote(pyStr(k))}: ${enc(x, level + 1)}`) : v.map((x) => enc(x, level + 1));
    const [open, close] = entries ? ['{', '}'] : ['[', ']'];
    if (!items.length) return open + close;
    if (indent === null) return open + items.join(', ') + close;
    const pad = ' '.repeat(indent * (level + 1));
    return `${open}\n${items.map((x) => pad + x).join(',\n')}\n${' '.repeat(indent * level)}${close}`;
  };
  return enc(value, 0);
}

/** format(value, "<width"): pads by code point; a list, dict or None has no such format in Python. */
export function pyFormatLeft(value, width) {
  let s;
  if (typeof value === 'string') s = value;
  else if (typeof value === 'boolean') s = value ? '1' : '0';
  else if (typeof value === 'bigint' || (typeof value === 'number' && Number.isInteger(value))) s = String(value);
  else if (typeof value === 'number') s = pyFloatRepr(value);
  else throw new TypeError(`unsupported format string passed to ${pyTypeName(value)}.__format__`);
  const n = Array.from(s).length;
  return n >= width ? s : s + ' '.repeat(width - n);
}

/** sep.join(iterable): a str joins its characters, and every item must already be a str. */
export function pyJoin(sep, iterable) {
  let items;
  if (typeof iterable === 'string') items = Array.from(iterable);
  else if (Array.isArray(iterable)) items = iterable;
  else if (iterable instanceof Map) items = [...iterable.keys()];
  else throw new TypeError('can only join an iterable');
  items.forEach((x, i) => {
    if (typeof x !== 'string') throw new TypeError(`sequence item ${i}: expected str instance, ${pyTypeName(x)} found`);
  });
  return items.join(sep);
}

const PY_DIGITPART = '[0-9](?:_?[0-9])*';
const PY_FLOAT = new RegExp(`^[+-]?(?:${PY_DIGITPART}(?:\\.(?:${PY_DIGITPART})?)?|\\.${PY_DIGITPART})(?:[eE][+-]?${PY_DIGITPART})?$`);
const PY_FLOAT_SPECIAL = /^([+-]?)(inf|infinity|nan)$/i;

/** float(v): bool, int, float or str (Unicode digits, underscores, inf/nan); anything else is a TypeError. */
export function pyFloat(v) {
  if (v === true) return 1;
  if (v === false) return 0;
  if (typeof v === 'number') return v;
  if (typeof v === 'bigint') {
    const n = Number(v);
    if (!Number.isFinite(n)) throw new OverflowError('int too large to convert to float');
    return n;
  }
  if (typeof v === 'string') {
    const t = pyStrip(v).replace(/\p{Nd}/gu, (ch) => String(pyDigitValue(ch)));
    if (PY_FLOAT.test(t)) return Number(t.replaceAll('_', ''));
    const m = PY_FLOAT_SPECIAL.exec(t);
    if (m) return m[2].toLowerCase() === 'nan' ? NaN : m[1] === '-' ? -Infinity : Infinity;
    throw new ValueError(`could not convert string to float: ${pyRepr(v)}`);
  }
  throw new TypeError(`float() argument must be a string or a number, not '${pyTypeName(v)}'`);
}

const stripFraction = (s) => (s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s);

/** format(x, "g"). JS rounds an exact decimal tie up where Python rounds it to even. */
export function pyFormatG(x) {
  if (Number.isNaN(x)) return 'nan';
  if (!Number.isFinite(x)) return x > 0 ? 'inf' : '-inf';
  if (x === 0) return Object.is(x, -0) ? '-0' : '0';
  const [mant, expStr] = x.toExponential(5).split('e');
  const exp = Number(expStr);
  if (exp < -4 || exp >= 6) return `${stripFraction(mant)}e${exp < 0 ? '-' : '+'}${String(Math.abs(exp)).padStart(2, '0')}`;
  return stripFraction(x.toFixed(5 - exp));
}

/** round(x) to an int: halves go to the even neighbour. */
export function pyRound(x) {
  const f = Math.floor(x);
  const diff = x - f;
  if (diff < 0.5) return f;
  if (diff > 0.5) return f + 1;
  return f % 2 === 0 ? f : f + 1;
}

/** a // b on ints: rounds toward negative infinity, so (-1999) // 2 is -1000. */
export function pyFloorDiv(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) return Math.floor(a / b);
  const [x, y] = [BigInt(a), BigInt(b)];
  const q = x / y;
  return Number(x % y !== 0n && (x % y < 0n) !== (y < 0n) ? q - 1n : q);
}

/** timedelta(hours=h) as milliseconds, raising where Python's timedelta does. */
export function pyTimedeltaHoursMs(h) {
  if (Number.isNaN(h)) throw new ValueError('cannot convert float NaN to integer');
  if (!Number.isFinite(h)) throw new OverflowError('cannot convert float infinity to integer');
  const days = Math.floor(h / 24);
  if (Math.abs(days) > 2147483647) throw new OverflowError('Python int too large to convert to C int');
  if (Math.abs(days) > 999999999) throw new OverflowError(`days=${days}; must have magnitude <= 999999999`);
  return h * 3600000;
}

const ESCAPES = { a: '\x07', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t', v: '\v', '\\': '\\' };
const OCT = '01234567';
const DIGITS = '0123456789';
const MAXGROUPS = 2147483647;
const IDENTIFIER = /^[\p{XID_Start}_]\p{XID_Continue}*$/u;

/**
 * Parse a re.sub replacement string as CPython 3.9's sre_parse.parse_template does, eagerly, so a
 * bad template raises even when nothing matches. Returns expand(groups), groups[0] being the match.
 */
export function pySubTemplate(template, groupCount) {
  const chars = Array.from(template);
  let index = 0;
  let next = null;
  const reError = (msg, pos) => {
    let text = `${msg} at position ${pos}`;
    if (chars.includes('\n')) {
      const before = chars.slice(0, pos);
      const line = before.filter((c) => c === '\n').length + 1;
      text += ` (line ${line}, column ${pos - before.lastIndexOf('\n')})`;
    }
    return new ReError(text);
  };
  const advance = () => {
    if (index >= chars.length) {
      next = null;
      return;
    }
    let ch = chars[index];
    if (ch === '\\') {
      index += 1;
      if (index >= chars.length) throw reError('bad escape (end of pattern)', chars.length - 1);
      ch += chars[index];
    }
    index += 1;
    next = ch;
  };
  const get = () => {
    const that = next;
    advance();
    return that;
  };
  const tell = () => index - (next === null ? 0 : Array.from(next).length);
  const error = (msg, offset = 0) => reError(msg, tell() - offset);
  const isIn = (set, c) => c !== null && c.length === 1 && set.includes(c);
  advance();

  const parts = [];
  let literal = '';
  const addGroup = (n, pos) => {
    if (n > groupCount) throw error(`invalid group reference ${n}`, pos);
    if (literal) parts.push(literal);
    literal = '';
    parts.push(n);
  };
  for (;;) {
    let that = get();
    if (that === null) break;
    if (that[0] !== '\\') {
      literal += that;
      continue;
    }
    const c = that[1];
    if (c === 'g') {
      if (next !== '<') throw error('missing <');
      advance();
      let name = '';
      for (;;) {
        const ch = get();
        if (ch === null) {
          if (!name) throw error('missing group name');
          throw error('missing >, unterminated name', Array.from(name).length);
        }
        if (ch === '>') {
          if (!name) throw error('missing group name', 1);
          break;
        }
        name += ch;
      }
      const offset = Array.from(name).length + 1;
      if (IDENTIFIER.test(name)) throw new IndexError(`unknown group name ${pyRepr(name)}`);
      let n;
      try {
        n = pyInt(name);
        if (n < 0) throw new ValueError('negative');
      } catch (e) {
        if (!(e instanceof ValueError)) throw e;
        throw error(`bad character in group name ${pyRepr(name)}`, offset);
      }
      if (n >= MAXGROUPS) throw error(`invalid group reference ${n}`, offset);
      addGroup(n, offset);
    } else if (c === '0') {
      if (isIn(OCT, next)) {
        that += get();
        if (isIn(OCT, next)) that += get();
      }
      literal += String.fromCharCode(parseInt(that.slice(1), 8) & 0xff);
    } else if (DIGITS.includes(c)) {
      let octal = false;
      if (isIn(DIGITS, next)) {
        that += get();
        if (OCT.includes(c) && OCT.includes(that[2]) && isIn(OCT, next)) {
          that += get();
          octal = true;
          const v = parseInt(that.slice(1), 8);
          if (v > 0o377) throw error(`octal escape value ${that} outside of range 0-0o377`, that.length);
          literal += String.fromCharCode(v);
        }
      }
      if (!octal) addGroup(Number(that.slice(1)), that.length - 1);
    } else if (Object.hasOwn(ESCAPES, c)) {
      literal += ESCAPES[c];
    } else {
      if (/^[A-Za-z]$/.test(c)) throw error(`bad escape ${that}`, Array.from(that).length);
      literal += that;
    }
  }
  if (literal) parts.push(literal);
  return (groups) => parts.map((p) => (typeof p === 'number' ? groups[p] ?? '' : p)).join('');
}
