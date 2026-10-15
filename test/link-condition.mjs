// The shared §4.1 link rule (masking, match, case-exact resolution, scan loop), imported by both link
// guards. Its record (spec, D1–D3, S1–S4, blind spots) is test/reference-integrity.test.js's header.

import fs from 'node:fs';
import path from 'node:path';

export function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// 2. MASKING.  A masked character becomes a space, so every offset and every
//    line number stays exactly where it was.
const blank = (s) => ' '.repeat(s.length);

// 2a. Fenced blocks (``` or ~~~), the fence lines themselves included.
// 2b. Blockquote lines — first non-space character is '>'.
//     Both carried over from 0176 scoping decision 2: a quotation is not a
//     link, and flagging one punishes the document that defines the convention.
// ⚠️ THE FENCE-CLOSE RULE IS COMMONMARK'S — a CLOSING fence carries no info string, which is what
// `m[2].trim() === ""` enforces. Both copies of this function had that wrong before 2026-08-30, the
// bug was introduced once and duplicated, and it hid one live instance (task 0266's plan). Do not
// "simplify" it back.
export function maskFencesAndQuotes(lines) {
  let fence = null;
  return lines.map((line) => {
    const m = /^\s{0,3}(`{3,}|~{3,})([^`~]*)$/.exec(line);
    if (fence !== null) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length && m[2].trim() === "") fence = null;
      return blank(line);
    }
    if (m) { fence = m[1]; return blank(line); }
    if (/^\s*>/.test(line)) return blank(line);
    return line;
  });
}

// 2c. Inline code spans.  A run of N backticks opens a span; the next run of
//     EXACTLY N closes it; an unpaired run is literal text.
//     RULED: for the LINK half a link inside backticks is documented marker
//     text, not a pointer offered to a reader — so it is SKIPPED.
//     (The citation half rules the opposite way. See §1.)
export function maskCodeSpans(text) {
  const out = text.split('');
  let i = 0;
  while (i < out.length) {
    if (out[i] !== '`') { i++; continue; }
    let n = 0; while (out[i + n] === '`') n++;
    let j = i + n, close = -1;
    while (j < out.length) {
      if (out[j] === '`') {
        let k = 0; while (out[j + k] === '`') k++;
        if (k === n) { close = j; break; }
        j += k;
      } else j++;
    }
    if (close === -1) { i += n; continue; }
    for (let x = i; x < close + n; x++) if (out[x] !== '\n') out[x] = ' ';
    i = close + n;
  }
  return out.join('');
}

// ⭐ SPAN SCOPE IS LINE-LEVEL, AND THE REASON IS ACCURACY — NOT "NEVER FEWER".
// §7 item 4 records an earlier claim that the line-level masker "reports more, never fewer" than the
// document-level one, and ⛔ WITHDRAWS it as false. The two maskers are NOT nested; each reports
// something the other hides (line-level 6 across 4, document-level 4 across 3). The settled choice is
// still line-level, on the corrected reason that the document-level masker's one unique hit is a
// FALSE POSITIVE it creates by mis-pairing on an earlier unpaired backtick. Test C1 pins that down.
export function maskDocument(src) {
  const masked = maskFencesAndQuotes(src.split('\n')).join('\n');
  return masked.split('\n').map(maskCodeSpans).join('\n');
}

// 3. THE MATCH RULE.
// What counts as a link: a markdown inline link. Reference-style definitions
// ([a]: url) are OUT of scope, named rather than silently dropped.
export const LINK = /(?<!!)\[[^\]\n]*\]\(\s*(<[^>\n]*>|[^()\s]+)(?:\s+(?:"[^"\n]*"|'[^'\n]*'))?\s*\)/g;
// Skipped target classes: absolute schemes and a bare in-page anchor.
export const SKIP_SCHEME = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;
// Skipped: an ELIDED target — prose elision, not a path.
export const ELIDED = (t) => t.includes('…') || t.includes('...');

// ── D2 — case-exact resolution with §4.1's containment test ──────────────────────────────────────

function entriesOf(dir, cache) {
  let e = cache.get(dir);
  if (e === undefined) {
    try { e = new Set(fs.readdirSync(dir)); } catch (_) { e = null; }
    cache.set(dir, e);
  }
  return e;
}

// Replaces §4.1's `fs.existsSync(abs) && (abs === ROOT || abs.startsWith(ROOT + path.sep))`.
//
// CONTAINMENT (§4.1, added 2026-08-30, R12). Rebasing alone does NOT confine the target — both
// path.join and path.resolve normalize '..', so `path.join(ROOT, '/../../../../../etc/hosts')`
// yields `/etc/hosts`, which exists, and `existsSync` returned TRUE. ⛔ The escape survived the fix
// that was described as closing it. Both branches — root-absolute AND relative — are covered here.
//
// CASE-EXACTNESS (D2). Each segment must appear in its parent directory listing with exactly the
// spelling the link used, so a wrongly-cased target is broken on a case-insensitive volume too.
export function resolveExact(root, abs, cache = new Map()) {
  if (!(abs === root || abs.startsWith(root + path.sep))) return false;
  const rel = path.relative(root, abs);
  if (rel === '') return true;
  let dir = root;
  for (const seg of rel.split(path.sep)) {
    const entries = entriesOf(dir, cache);
    if (entries === null || !entries.has(seg)) return false;
    dir = path.join(dir, seg);
  }
  return true;
}

export function scanFiles(root, visited, namedExemptKeys) {
  const cache = new Map();
  const broken = []; let namedExempt = 0;
  let checked = 0;
  const skipped = { scheme: 0, elided: 0, emptyAfterFragment: 0 };
  for (const rel of visited) {
    const src = fs.readFileSync(path.join(root, rel), 'utf8');
    const masked = maskDocument(src);
    masked.split('\n').forEach((line, idx) => {
      for (const m of line.matchAll(LINK)) {
        let t = m[1].replace(/^</, '').replace(/>$/, '');
        if (SKIP_SCHEME.test(t)) { skipped.scheme++; continue; }
        if (ELIDED(t)) { skipped.elided++; continue; }
        t = t.split('#')[0];              // FRAGMENT IGNORED. Anchor existence is
        if (t === '') { skipped.emptyAfterFragment++; continue; }  // explicitly OUT of scope.
        try { t = decodeURIComponent(t); } catch (_) { /* keep raw */ }
        checked++;
        const abs = t.startsWith('/')
          ? path.join(root, t)              // ROOT-ABSOLUTE: rebased onto the repo root
          : path.resolve(root, path.dirname(rel), t);
        if (resolveExact(root, abs, cache)) continue;
        if (namedExemptKeys.has(rel + '::' + t)) { namedExempt++; continue; }
        broken.push({ file: rel, line: idx + 1, target: t });
      }
    });
  }
  return { broken, namedExemptCount: namedExempt, scanned: visited.length, visited, checked, skipped };
}

// ⛔ THE FAILURE MESSAGE NAMES THE LINE'S TEXT, NEVER A `file` + colon + line-number COORDINATE.
// A guard built to enforce a document that rules that citation form unsafe against a living file must
// not emit it. The line text is read back from the UNMASKED source, which is what a human needs to
// see; the record itself stays byte-identical to §4.1's.
export function formatBroken(root, broken) {
  const cache = new Map();
  return broken.map((b) => {
    let text = cache.get(b.file);
    if (text === undefined) { text = fs.readFileSync(path.join(root, b.file), 'utf8').split('\n'); cache.set(b.file, text); }
    const quoted = (text[b.line - 1] || '').trim();
    return `    - ${b.file}\n        (line ${b.line})  ${quoted}\n        unresolved target  ->  ${b.target}`;
  }).join('\n');
}
