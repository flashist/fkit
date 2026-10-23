// The board's model and front-matter layer (board/core/model.mjs), ported from aiboard a1592dc.
// ModelTests keeps aiboard's test names verbatim so 0423 can match every ported test by name.
import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import {
  PRIORITIES,
  Task,
  dumpFrontMatter,
  normalizeId,
  normalizePriority,
  normalizeStatus,
  parseFrontMatter,
  parseWorklog,
  slugify,
  ValueError,
} from '../../board/core/model.mjs';

// Python's type(x).__name__, so assertIs(type(a), type(b)) ports as an equality of names.
function pyType(v) {
  if (v === null) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint' || (typeof v === 'number' && Number.isInteger(v))) return 'int';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (v instanceof Map) return 'dict';
  return typeof v;
}

const label = (v) => JSON.stringify(typeof v === 'bigint' ? String(v) : v);

describe('ModelTests', () => {
  test('test_front_matter_roundtrip', () => {
    const meta = new Map([
      ['id', 'T-001'], ['title', 'Fix: login [urgent]'], ['sprint', null],
      ['labels', ['a', 'b']], ['n', 3], ['ok', true],
    ]);
    const text = dumpFrontMatter(meta, '# Fix\n\nbody');
    const [parsed, body] = parseFrontMatter(text);
    assert.deepStrictEqual(parsed, meta);
    assert.equal(body.trim(), '# Fix\n\nbody');
  });

  test('test_front_matter_inline_list_and_missing', () => {
    const [meta, body] = parseFrontMatter('---\ntasks: [T-001, T-002]\nempty:\n---\nhello');
    assert.deepStrictEqual(meta.get('tasks'), ['T-001', 'T-002']);
    assert.equal(meta.get('empty'), null);
    assert.equal(body, 'hello');
    assert.deepStrictEqual(parseFrontMatter('no front matter'), [new Map(), 'no front matter']);
  });

  test('test_zero_padded_digits_roundtrip_byte_identical', () => {
    const text = '---\nid: 0013\nblocked_by:\n  - 0404\n  - 0013\n---\n\nbody\n';
    const [meta, body] = parseFrontMatter(text);
    assert.deepStrictEqual(meta, new Map([['id', '0013'], ['blocked_by', ['0404', '0013']]]));
    assert.equal(dumpFrontMatter(meta, body), text);
  });

  test('test_hostile_scalars_roundtrip', () => {
    const values = ['0404', '0013', '007', '404', '-3', '-0', 5, -3, 0, true, false, null,
      'true', 'False', 'null', 'None', '~', '', ' pad ', '🚀 emoji', 'a: b', '[x]',
      '{y}', '"quoted"', "'single'", 'back\\slash', 'both \\"', '# hash'];
    for (const v of values) {
      const meta = new Map([['v', v], ['l', [v, 'ok']]]);
      const [parsed] = parseFrontMatter(dumpFrontMatter(meta, ''));
      assert.deepStrictEqual(parsed.get('v'), v, label(v));
      assert.equal(pyType(parsed.get('v')), pyType(v), label(v));
      // None and "" inside a block list are not preserved yet; aiboard a1592dc skips them too.
      if (v !== '' && v !== null) {
        assert.deepStrictEqual(parsed.get('l'), [v, 'ok'], label(v));
      }
    }
  });

  test('test_quotes_and_backslashes_roundtrip', () => {
    for (const title of ['Fix "quoted" bug: x', 'back\\slash', 'both \\"', "it's"]) {
      const [meta] = parseFrontMatter(dumpFrontMatter(new Map([['title', title]]), ''));
      assert.equal(meta.get('title'), title);
    }
  });

  test('test_ids_and_statuses', () => {
    for (const ref of ['1', 'T-1', 't-001', 'T-001-some-slug']) {
      assert.equal(normalizeId('T', ref), 'T-001');
    }
    assert.equal(normalizeId('T', 'S-001'), null);
    assert.equal(normalizeStatus('In Progress'), 'in-progress');
    assert.equal(normalizeStatus('wip'), 'in-progress');
    assert.throws(() => normalizeStatus('bogus'), ValueError);
    assert.equal(slugify('Hello, World!  Ünicode'), 'hello-world-nicode');
  });

  test('test_priorities', () => {
    assert.deepStrictEqual(PRIORITIES, ['low', 'medium', 'high', 'critical']);
    assert.equal(normalizePriority('critical'), 'critical');
    for (const alias of ['urgent', 'URGENT', ' Urgent ']) {
      assert.equal(normalizePriority(alias), 'critical');
    }
    assert.equal(normalizePriority('High'), 'high');
    assert.throws(() => normalizePriority('bogus'), ValueError);
  });

  test('test_rank_defaults_to_id_order', () => {
    const task = (meta) => new Task({ id: 'T-007', title: 'x', status: 'backlog', path: '.', meta });
    assert.equal(task(new Map()).rank, 7000);
    assert.equal(task(new Map([['rank', 2500]])).rank, 2500);
    assert.equal(task(new Map([['rank', '-1500']])).rank, -1500);
    assert.equal(task(new Map([['rank', 'soon']])).rank, 7000);
  });

  test('test_worklog_parse', () => {
    const entries = parseWorklog('# Worklog\n\n## 2026-01-01T00:00:00Z — alice\n\nfirst\n\n## 2026-01-02T00:00:00Z - bob\n\nsecond\nline\n');
    assert.deepStrictEqual(entries.map((e) => [e.author, e.text]), [['alice', 'first'], ['bob', 'second\nline']]);
  });
});

describe('fkit additions', () => {
  // Expected bytes are aiboard a1592dc's own output for this document, checked once against Python.
  test('emoji, quotes, backslashes and 0013 survive a write byte-for-byte', () => {
    const text = [
      '---',
      'id: 0013',
      'title: "🚀 Launch: \\"the\\" C:\\\\ drive 👩‍💻"',
      'blocked_by:',
      '  - 0404',
      '  - T-0013',
      'labels:',
      '  - 🎉 party',
      '  - 🇺🇦',
      '---',
      '',
      '# Body 🚀✨',
      '',
      'Emoji 👩‍👩‍👧 and "quotes" and back\\slash.',
      '',
    ].join('\n');
    const [meta, body] = parseFrontMatter(text);
    assert.equal(meta.get('id'), '0013');
    assert.equal(meta.get('title'), '🚀 Launch: "the" C:\\ drive 👩‍💻');
    assert.deepStrictEqual(meta.get('blocked_by'), ['0404', 'T-0013']);
    assert.deepStrictEqual(meta.get('labels'), ['🎉 party', '🇺🇦']);
    const out = dumpFrontMatter(meta, body);
    assert.ok(Buffer.from(out, 'utf8').equals(Buffer.from(text, 'utf8')), out);
  });

  // Each expected value is what Python 3.9 gives for aiboard a1592dc on the same input.
  test("keeps Python's string behaviour (port guard)", () => {
    const [crlf, crlfBody] = parseFrontMatter('---\r\nid: T-001\r\ntitle: a\r\n---\r\n\r\nbody\r\nline 2\r\n');
    assert.deepStrictEqual(crlf, new Map([['id', 'T-001'], ['title', 'a']]));
    assert.equal(crlfBody, 'body\nline 2');

    const [edges] = parseFrontMatter('---\ntitle: \x1fx\ufeff\nother: \x85y \n---\n');
    assert.equal(edges.get('title'), 'x\ufeff');
    assert.equal(edges.get('other'), null);
    assert.equal(dumpFrontMatter(edges, ''), '---\ntitle: x\ufeff\nother: \n---\n\n\n');

    const ordered = '---\nid: T-1\n2024: q\n1: r\n---\n\nb\n';
    assert.equal(dumpFrontMatter(...parseFrontMatter(ordered)), ordered);

    const [nested] = parseFrontMatter('---\ntags: [x, [y]]\n---\n');
    assert.deepStrictEqual(nested.get('tags'), ['x', ['y']]);
    assert.equal(dumpFrontMatter(nested, ''), '---\ntags:\n  - x\n  - "[\'y\']"\n---\n\n\n');

    assert.equal(normalizeId('T', 'T-٣'), 'T-003');
    assert.equal(normalizeId('T', 'ſ-12'), null);
    assert.equal(normalizeId('S', 'ſ-12'), 'S-012');

    const [truthy] = parseFrontMatter('---\npriority: True\nrank: true\nlabels: abc\n---\n');
    const t = new Task({ id: 'T-004', title: 'x', status: 'backlog', path: 'a//b/./c/', meta: truthy });
    assert.equal(t.priority, 'true');
    assert.equal(t.rank, 4000);
    assert.equal(t.folder, 'c');
    assert.equal(t.toDict().path, 'a/b/c');
    assert.deepStrictEqual(t.toDict().labels, ['a', 'b', 'c']);
    assert.throws(() => normalizeStatus('bogus\n'), { message: "unknown status 'bogus\\n'; expected one of backlog, in-progress, done, cancelled" });

    const big = '---\nn: 123456789012345678901234567890\nq: "123456789012345678901234567890"\n---\n\n\n';
    const [bigMeta] = parseFrontMatter(big);
    assert.equal(bigMeta.get('n'), 123456789012345678901234567890n);
    assert.equal(bigMeta.get('q'), '123456789012345678901234567890');
    assert.equal(dumpFrontMatter(bigMeta, ''), big);
  });
});
