// The part of Python 3.9.6's argparse (with textwrap.wrap/fill and shutil.get_terminal_size) that
// aiboard's command line uses, ported line for line: its error text, usage wrapping and help layout
// are part of aiboard's output, and only the original algorithm reproduces them.
import { isatty } from 'node:tty';
import { IndexError, ValueError, pyInt, pyRepr, pyStr, pyStrip } from '../core/python-compat.mjs';

export const SUPPRESS = '==SUPPRESS==';
export const OPTIONAL = '?';
export const ONE_OR_MORE = '+';
export const PARSER = 'A...';
const UNRECOGNIZED_ARGS_ATTR = '_unrecognized_args';

export class SystemExit extends Error {
  constructor(code = 0) {
    super(`SystemExit: ${code}`);
    this.name = 'SystemExit';
    this.code = code;
  }
}

/** sys.stdout / sys.stderr as argparse sees them; the CLI swaps them, as redirect_stdout does. */
export const sys = { stdout: process.stdout, stderr: process.stderr };

const chars = (s) => Array.from(s);
const len = (s) => chars(s).length;
const ljust = (s, width) => s + ' '.repeat(Math.max(0, width - len(s)));
const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

// shutil.get_terminal_size().columns: $COLUMNS if a positive int, else the tty on fd 1, else 80.
function terminalColumns() {
  let columns = 0;
  if (process.env.COLUMNS !== undefined) {
    try {
      columns = pyInt(process.env.COLUMNS);
    } catch (e) {
      if (!(e instanceof ValueError)) throw e;
    }
  }
  if (columns <= 0) columns = isatty(1) ? (process.stdout.columns ?? 80) : 80;
  return columns;
}

// ----------------------------------------------------------------------------- textwrap

const TW_WS = '[\\t\\n\\x0b\\x0c\\r ]';
const TW_NWS = '[^\\t\\n\\x0b\\x0c\\r ]';
const TW_W = '[\\p{L}\\p{N}_]';
const TW_WP = '[\\p{L}\\p{N}_!"\'&.,?]';
const TW_LT = '[\\p{L}\\p{Nl}\\p{No}_]';
const WORDSEP = new RegExp(
  `(${TW_WS}+|(?<=${TW_WP})-{2,}(?=${TW_W})|${TW_NWS}+?(?:-(?:(?<=${TW_LT}{2}-)|(?<=${TW_LT}-${TW_LT}-))(?=${TW_LT}-?${TW_LT})|(?=${TW_WS}|$)|(?<=${TW_WP})(?=-{2,}${TW_W})))`,
  'u',
);

function expandTabs(text, tabsize = 8) {
  let out = '';
  let col = 0;
  for (const ch of text) {
    if (ch === '\t') {
      const n = tabsize - (col % tabsize);
      out += ' '.repeat(n);
      col += n;
    } else {
      out += ch;
      col = ch === '\n' || ch === '\r' ? 0 : col + 1;
    }
  }
  return out;
}

/** textwrap.wrap with TextWrapper's defaults (break_on_hyphens, break_long_words, drop_whitespace). */
export function wrap(text, width, { initialIndent = '', subsequentIndent = '' } = {}) {
  const munged = expandTabs(text).replace(/[\t\n\x0b\x0c\r]/g, ' ');
  const chunks = munged.split(WORDSEP).filter((c) => c);
  const lines = [];
  if (width <= 0) throw new ValueError(`invalid width ${pyRepr(width)} (must be > 0)`);
  chunks.reverse();
  while (chunks.length) {
    let curLine = [];
    let curLen = 0;
    const indent = lines.length ? subsequentIndent : initialIndent;
    const lineWidth = width - len(indent);
    if (pyStrip(chunks[chunks.length - 1]) === '' && lines.length) chunks.pop();
    while (chunks.length) {
      const l = len(chunks[chunks.length - 1]);
      if (curLen + l <= lineWidth) {
        curLine.push(chunks.pop());
        curLen += l;
      } else break;
    }
    if (chunks.length && len(chunks[chunks.length - 1]) > lineWidth) {
      const spaceLeft = lineWidth < 1 ? 1 : lineWidth - curLen;
      const last = chars(chunks[chunks.length - 1]);
      curLine.push(last.slice(0, spaceLeft).join(''));
      chunks[chunks.length - 1] = last.slice(spaceLeft).join('');
      curLen = curLine.reduce((n, c) => n + len(c), 0);
    }
    if (curLine.length && pyStrip(curLine[curLine.length - 1]) === '') {
      curLen -= len(curLine[curLine.length - 1]);
      curLine = curLine.slice(0, -1);
    }
    if (curLine.length) lines.push(indent + curLine.join(''));
  }
  return lines;
}

export const fill = (text, width, opts) => wrap(text, width, opts).join('\n');

// ----------------------------------------------------------------------------- help formatting

class Section {
  constructor(formatter, parent, heading = null) {
    this.formatter = formatter;
    this.parent = parent;
    this.heading = heading;
    this.items = [];
  }

  formatHelp() {
    const f = this.formatter;
    if (this.parent !== null) f._indent();
    const itemHelp = f._joinParts(this.items.map((item) => item()));
    if (this.parent !== null) f._dedent();
    if (!itemHelp) return '';
    const heading = this.heading !== SUPPRESS && this.heading !== null ? `${' '.repeat(f._currentIndent)}${this.heading}:\n` : '';
    return f._joinParts(['\n', heading, itemHelp, '\n']);
  }
}

export class HelpFormatter {
  constructor(prog, indentIncrement = 2, maxHelpPosition = 24, width = null) {
    if (width === null) width = terminalColumns() - 2;
    this._prog = prog;
    this._indentIncrement = indentIncrement;
    this._maxHelpPosition = Math.min(maxHelpPosition, Math.max(width - 20, indentIncrement * 2));
    this._width = width;
    this._currentIndent = 0;
    this._level = 0;
    this._actionMaxLength = 0;
    this._rootSection = new Section(this, null);
    this._currentSection = this._rootSection;
  }

  _indent() {
    this._currentIndent += this._indentIncrement;
    this._level += 1;
  }

  _dedent() {
    this._currentIndent -= this._indentIncrement;
    if (this._currentIndent < 0) throw new Error('Indent decreased below 0.');
    this._level -= 1;
  }

  _addItem(fn) {
    this._currentSection.items.push(fn);
  }

  startSection(heading) {
    this._indent();
    const section = new Section(this, this._currentSection, heading);
    this._addItem(() => section.formatHelp());
    this._currentSection = section;
  }

  endSection() {
    this._currentSection = this._currentSection.parent;
    this._dedent();
  }

  addText(text) {
    if (text !== SUPPRESS && text !== null) this._addItem(() => this._formatText(text));
  }

  addUsage(usage, actions, groups, prefix = null) {
    if (usage !== SUPPRESS) this._addItem(() => this._formatUsage(usage, actions, groups, prefix));
  }

  addArgument(action) {
    if (action.help === SUPPRESS) return;
    const invocations = [this._formatActionInvocation(action)];
    for (const sub of this._iterIndentedSubactions(action)) invocations.push(this._formatActionInvocation(sub));
    const actionLength = Math.max(...invocations.map(len)) + this._currentIndent;
    this._actionMaxLength = Math.max(this._actionMaxLength, actionLength);
    this._addItem(() => this._formatAction(action));
  }

  addArguments(actions) {
    for (const action of actions) this.addArgument(action);
  }

  formatHelp() {
    let help = this._rootSection.formatHelp();
    if (help) {
      help = help.replace(/\n\n\n+/g, '\n\n');
      help = help.replace(/^\n+|\n+$/g, '') + '\n';
    }
    return help;
  }

  _joinParts(parts) {
    return parts.filter((p) => p && p !== SUPPRESS).join('');
  }

  _formatUsage(usage, actions, groups, prefix) {
    if (prefix === null) prefix = 'usage: ';
    const prog = this._prog;
    if (!actions.length) {
      usage = prog;
    } else {
      const optionals = actions.filter((a) => a.option_strings.length);
      const positionals = actions.filter((a) => !a.option_strings.length);
      const actionUsage = this._formatActionsUsage([...optionals, ...positionals], groups);
      usage = [prog, actionUsage].filter((s) => s).join(' ');
      const textWidth = this._width - this._currentIndent;
      if (len(prefix) + len(usage) > textWidth) {
        const partRegexp = /\([^\n]*?\)+(?=\s|$)|\[[^\n]*?\]+(?=\s|$)|\S+/gu;
        const optUsage = this._formatActionsUsage(optionals, groups);
        const posUsage = this._formatActionsUsage(positionals, groups);
        const optParts = optUsage.match(partRegexp) ?? [];
        const posParts = posUsage.match(partRegexp) ?? [];
        if (optParts.join(' ') !== optUsage || posParts.join(' ') !== posUsage) throw new Error('AssertionError');

        const getLines = (parts, indent, linePrefix = null) => {
          const lines = [];
          let line = [];
          let lineLen = linePrefix !== null ? len(linePrefix) - 1 : len(indent) - 1;
          for (const part of parts) {
            if (lineLen + 1 + len(part) > textWidth && line.length) {
              lines.push(indent + line.join(' '));
              line = [];
              lineLen = len(indent) - 1;
            }
            line.push(part);
            lineLen += len(part) + 1;
          }
          if (line.length) lines.push(indent + line.join(' '));
          if (linePrefix !== null) lines[0] = chars(lines[0]).slice(len(indent)).join('');
          return lines;
        };

        let lines;
        if (len(prefix) + len(prog) <= 0.75 * textWidth) {
          const indent = ' '.repeat(len(prefix) + len(prog) + 1);
          if (optParts.length) {
            lines = getLines([prog, ...optParts], indent, prefix);
            lines.push(...getLines(posParts, indent));
          } else if (posParts.length) {
            lines = getLines([prog, ...posParts], indent, prefix);
          } else {
            lines = [prog];
          }
        } else {
          const indent = ' '.repeat(len(prefix));
          lines = getLines([...optParts, ...posParts], indent);
          if (lines.length > 1) lines = [...getLines(optParts, indent), ...getLines(posParts, indent)];
          lines = [prog, ...lines];
        }
        usage = lines.join('\n');
      }
    }
    return `${prefix}${usage}\n\n`;
  }

  _formatActionsUsage(actions, groups) {
    const groupActions = new Set();
    const inserts = new Map();
    for (const group of groups) {
      const start = actions.indexOf(group._group_actions[0]);
      if (start === -1) continue;
      const end = start + group._group_actions.length;
      const slice = actions.slice(start, end);
      if (slice.length !== group._group_actions.length || slice.some((a, i) => a !== group._group_actions[i])) continue;
      for (const a of group._group_actions) groupActions.add(a);
      const [open, close] = group.required ? ['(', ')'] : ['[', ']'];
      inserts.set(start, inserts.has(start) ? `${inserts.get(start)} ${open}` : open);
      inserts.set(end, inserts.has(end) ? inserts.get(end) + close : close);
      for (let i = start + 1; i < end; i++) inserts.set(i, '|');
    }

    const parts = [];
    actions.forEach((action, i) => {
      if (action.help === SUPPRESS) {
        parts.push(null);
        if (inserts.get(i) === '|') inserts.delete(i);
        else if (inserts.get(i + 1) === '|') inserts.delete(i + 1);
      } else if (!action.option_strings.length) {
        let part = this._formatArgs(action, action.dest);
        if (groupActions.has(action) && part[0] === '[' && part[part.length - 1] === ']') part = part.slice(1, -1);
        parts.push(part);
      } else {
        const optionString = action.option_strings[0];
        let part = action.nargs === 0 ? optionString : `${optionString} ${this._formatArgs(action, action.dest.toUpperCase())}`;
        if (!action.required && !groupActions.has(action)) part = `[${part}]`;
        parts.push(part);
      }
    });
    for (const i of [...inserts.keys()].sort((a, b) => b - a)) parts.splice(i, 0, inserts.get(i));

    let text = parts.filter((p) => p !== null).join(' ');
    text = text.replace(/([[(]) /g, '$1');
    text = text.replace(/ ([\])])/g, '$1');
    text = text.replace(/[[(] *[\])]/g, '');
    text = text.replace(/\(([^|]*)\)/g, '$1');
    return pyStrip(text);
  }

  _formatText(text) {
    const textWidth = Math.max(this._width - this._currentIndent, 11);
    const indent = ' '.repeat(this._currentIndent);
    return this._fillText(text, textWidth, indent) + '\n\n';
  }

  _formatAction(action) {
    const helpPosition = Math.min(this._actionMaxLength + 2, this._maxHelpPosition);
    const helpWidth = Math.max(this._width - helpPosition, 11);
    const actionWidth = helpPosition - this._currentIndent - 2;
    let header = this._formatActionInvocation(action);
    const pad = ' '.repeat(this._currentIndent);
    let indentFirst = 0;
    if (!action.help) header = `${pad}${header}\n`;
    else if (len(header) <= actionWidth) header = `${pad}${ljust(header, actionWidth)}  `;
    else {
      header = `${pad}${header}\n`;
      indentFirst = helpPosition;
    }
    const parts = [header];
    if (action.help) {
      const helpLines = this._splitLines(this._expandHelp(action), helpWidth);
      parts.push(`${' '.repeat(indentFirst)}${helpLines[0]}\n`);
      for (const line of helpLines.slice(1)) parts.push(`${' '.repeat(helpPosition)}${line}\n`);
    } else if (!header.endsWith('\n')) {
      parts.push('\n');
    }
    for (const sub of this._iterIndentedSubactions(action)) parts.push(this._formatAction(sub));
    return this._joinParts(parts);
  }

  _formatActionInvocation(action) {
    if (!action.option_strings.length) return this._metavar(action, action.dest);
    if (action.nargs === 0) return action.option_strings.join(', ');
    const args = this._formatArgs(action, action.dest.toUpperCase());
    return action.option_strings.map((o) => `${o} ${args}`).join(', ');
  }

  _metavar(action, defaultMetavar) {
    if (action.metavar !== null) return action.metavar;
    if (action.choices !== null) return `{${action.choiceList().map(pyStr).join(',')}}`;
    return defaultMetavar;
  }

  _formatArgs(action, defaultMetavar) {
    const m = this._metavar(action, defaultMetavar);
    if (action.nargs === null) return m;
    if (action.nargs === OPTIONAL) return `[${m}]`;
    if (action.nargs === ONE_OR_MORE) return `${m} [${m} ...]`;
    if (action.nargs === PARSER) return `${m} ...`;
    return Array(action.nargs).fill(m).join(' ');
  }

  // Python's `help % params`: aiboard's help strings hold no "%", so the expansion leaves them as they are.
  _expandHelp(action) {
    return action.help;
  }

  *_iterIndentedSubactions(action) {
    if (!(action instanceof SubParsersAction)) return;
    this._indent();
    yield* action._choices_actions;
    this._dedent();
  }

  _splitLines(text, width) {
    return wrap(pyStrip(text.replace(/[ \t\n\r\f\v]+/g, ' ')), width);
  }

  _fillText(text, width, indent) {
    return fill(pyStrip(text.replace(/[ \t\n\r\f\v]+/g, ' ')), width, { initialIndent: indent, subsequentIndent: indent });
  }
}

// ----------------------------------------------------------------------------- actions

function getActionName(argument) {
  if (argument === null) return null;
  if (argument.option_strings.length) return argument.option_strings.join('/');
  if (argument.metavar !== null && argument.metavar !== SUPPRESS) return argument.metavar;
  if (argument.dest !== null && argument.dest !== SUPPRESS) return argument.dest;
  return null;
}

class ArgumentError extends Error {
  constructor(argument, message) {
    const name = getActionName(argument);
    super(name === null ? message : `argument ${name}: ${message}`);
    this.name = 'ArgumentError';
  }
}

class Action {
  constructor({ option_strings, dest, nargs = null, default: dflt = null, type = null, choices = null, required = false, help = null, metavar = null }) {
    this.option_strings = option_strings;
    this.dest = dest;
    this.nargs = nargs;
    this.default = dflt;
    this.type = type;
    this.choices = choices;
    this.required = required;
    this.help = help;
    this.metavar = metavar;
  }

  choiceList() {
    return this.choices instanceof Map ? [...this.choices.keys()] : this.choices;
  }

  hasChoice(value) {
    return this.choices instanceof Map ? this.choices.has(value) : this.choices.includes(value);
  }
}

class StoreAction extends Action {
  call(parser, namespace, values) {
    namespace[this.dest] = values;
  }
}

class StoreTrueAction extends Action {
  constructor(o) {
    super({ ...o, nargs: 0, default: hasOwn(o, 'default') ? o.default : false });
  }

  call(parser, namespace) {
    namespace[this.dest] = true;
  }
}

class AppendAction extends Action {
  call(parser, namespace, values) {
    const items = namespace[this.dest] ?? null;
    namespace[this.dest] = [...(items === null ? [] : items), values];
  }
}

class HelpAction extends Action {
  constructor(o) {
    super({ ...o, dest: SUPPRESS, default: SUPPRESS, nargs: 0 });
  }

  call(parser) {
    parser.printHelp();
    parser.exit();
  }
}

class VersionAction extends Action {
  constructor(o) {
    super({ help: "show program's version number and exit", ...o, dest: SUPPRESS, default: SUPPRESS, nargs: 0 });
    this.version = o.version;
  }

  call(parser) {
    const formatter = parser._getFormatter();
    formatter.addText(this.version);
    parser._printMessage(formatter.formatHelp(), sys.stdout);
    parser.exit();
  }
}

class SubParsersAction extends Action {
  constructor({ prog, parser_class, dest = SUPPRESS, required = false, help = null, metavar = null }) {
    const map = new Map();
    super({ option_strings: [], dest, nargs: PARSER, choices: map, required, help, metavar });
    this._prog_prefix = prog;
    this._parser_class = parser_class;
    this._name_parser_map = map;
    this._choices_actions = [];
  }

  add_parser(name, { aliases = [], ...kwargs } = {}) {
    const prog = kwargs.prog ?? `${this._prog_prefix} ${name}`;
    if (hasOwn(kwargs, 'help')) {
      const metavar = aliases.length ? `${name} (${aliases.join(', ')})` : name;
      this._choices_actions.push(new Action({ option_strings: [], dest: name, help: kwargs.help, metavar }));
    }
    const parser = new this._parser_class({ prog, description: kwargs.description ?? null });
    this._name_parser_map.set(name, parser);
    for (const alias of aliases) this._name_parser_map.set(alias, parser);
    return parser;
  }

  call(parser, namespace, values) {
    const [parserName, ...argStrings] = values;
    if (this.dest !== SUPPRESS) namespace[this.dest] = parserName;
    const sub = this._name_parser_map.get(parserName);
    if (sub === undefined) {
      throw new ArgumentError(this, `unknown parser ${pyRepr(parserName)} (choices: ${[...this._name_parser_map.keys()].join(', ')})`);
    }
    const [subnamespace, rest] = sub.parse_known_args(argStrings, null);
    Object.assign(namespace, subnamespace);
    if (rest.length) {
      if (!hasOwn(namespace, UNRECOGNIZED_ARGS_ATTR)) namespace[UNRECOGNIZED_ARGS_ATTR] = [];
      namespace[UNRECOGNIZED_ARGS_ATTR].push(...rest);
    }
  }
}

const ACTIONS = { store: StoreAction, store_true: StoreTrueAction, append: AppendAction, help: HelpAction, version: VersionAction };

class ArgumentGroup {
  constructor(container, title = null) {
    this._container = container;
    this.title = title;
    this.description = null;
    this._group_actions = [];
  }

  _add_action(action) {
    this._container._registerAction(action);
    this._group_actions.push(action);
    return action;
  }
}

class MutuallyExclusiveGroup {
  constructor(container, required = false) {
    this._container = container;
    this.required = required;
    this._group_actions = [];
  }

  add_argument(...args) {
    const action = this._container._makeAction(args);
    if (action.required) throw new ValueError('mutually exclusive arguments must be optional');
    this._container._add_action(action);
    this._group_actions.push(action);
    return action;
  }
}

// Python's `$` (no MULTILINE) also matches before one final newline.
const NEGATIVE_NUMBER = /^(?:-\p{Nd}+|-\p{Nd}*\.\p{Nd}+)\n?$/u;

export class ArgumentParser {
  constructor({ prog = null, description = null } = {}) {
    this.prog = prog;
    this.description = description;
    this.usage = null;
    this.epilog = null;
    this.prefix_chars = '-';
    this._actions = [];
    this._option_string_actions = new Map();
    this._mutually_exclusive_groups = [];
    this._defaults = {};
    this._has_negative_number_optionals = [];
    this._positionals = new ArgumentGroup(this, 'positional arguments');
    this._optionals = new ArgumentGroup(this, 'optional arguments');
    this._action_groups = [this._positionals, this._optionals];
    this._subparsers = null;
    this.add_argument('-h', '--help', { action: 'help', default: SUPPRESS, help: 'show this help message and exit' });
  }

  // ------------------------------------------------------------------- building

  set_defaults(kwargs) {
    Object.assign(this._defaults, kwargs);
    for (const action of this._actions) if (hasOwn(kwargs, action.dest)) action.default = kwargs[action.dest];
  }

  add_argument(...args) {
    return this._add_action(this._makeAction(args));
  }

  _makeAction(args) {
    const kwargs = typeof args[args.length - 1] === 'object' ? { ...args.pop() } : {};
    let o;
    if (!args.length || (args.length === 1 && !this.prefix_chars.includes(args[0][0]))) {
      if (kwargs.nargs !== OPTIONAL) kwargs.required = true;
      o = { ...kwargs, dest: args[0], option_strings: [] };
    } else {
      const long = args.filter((s) => len(s) > 1 && this.prefix_chars.includes(chars(s)[1]));
      const dest = kwargs.dest ?? (long.length ? long[0] : args[0]).replace(/^-+/, '').replaceAll('-', '_');
      o = { ...kwargs, dest, option_strings: args };
    }
    if (!hasOwn(o, 'default') && hasOwn(this._defaults, o.dest)) o.default = this._defaults[o.dest];
    const ActionClass = ACTIONS[o.action ?? 'store'];
    return new ActionClass(o);
  }

  add_mutually_exclusive_group({ required = false } = {}) {
    const group = new MutuallyExclusiveGroup(this, required);
    this._mutually_exclusive_groups.push(group);
    return group;
  }

  add_subparsers({ dest = SUPPRESS, required = false, parser_class = this.constructor } = {}) {
    if (this._subparsers !== null) this.error('cannot have multiple subparser arguments');
    this._subparsers = this._positionals;
    const formatter = this._getFormatter();
    formatter.addUsage(this.usage, this._actions.filter((a) => !a.option_strings.length), this._mutually_exclusive_groups, '');
    const prog = pyStrip(formatter.formatHelp());
    const action = new SubParsersAction({ prog, parser_class, dest, required });
    this._subparsers._add_action(action);
    return action;
  }

  _add_action(action) {
    return (action.option_strings.length ? this._optionals : this._positionals)._add_action(action);
  }

  _registerAction(action) {
    this._actions.push(action);
    for (const s of action.option_strings) this._option_string_actions.set(s, action);
    if (!this._has_negative_number_optionals.length && action.option_strings.some((s) => NEGATIVE_NUMBER.test(s))) {
      this._has_negative_number_optionals.push(true);
    }
  }

  // ------------------------------------------------------------------- parsing

  parse_args(args) {
    const [namespace, argv] = this.parse_known_args(args, null);
    if (argv.length) this.error(`unrecognized arguments: ${argv.join(' ')}`);
    return namespace;
  }

  parse_known_args(args, namespace = null) {
    args = [...args];
    if (namespace === null) namespace = {};
    for (const action of this._actions) {
      if (action.dest !== SUPPRESS && !hasOwn(namespace, action.dest) && action.default !== SUPPRESS) {
        namespace[action.dest] = action.default;
      }
    }
    for (const dest of Object.keys(this._defaults)) if (!hasOwn(namespace, dest)) namespace[dest] = this._defaults[dest];
    try {
      [namespace, args] = this._parse_known_args(args, namespace);
    } catch (e) {
      if (!(e instanceof ArgumentError)) throw e;
      this.error(e.message);
    }
    if (hasOwn(namespace, UNRECOGNIZED_ARGS_ATTR)) {
      args.push(...namespace[UNRECOGNIZED_ARGS_ATTR]);
      delete namespace[UNRECOGNIZED_ARGS_ATTR];
    }
    return [namespace, args];
  }

  _parse_known_args(argStrings, namespace) {
    const actionConflicts = new Map();
    for (const group of this._mutually_exclusive_groups) {
      group._group_actions.forEach((a, i) => {
        if (!actionConflicts.has(a)) actionConflicts.set(a, []);
        actionConflicts.get(a).push(...group._group_actions.slice(0, i), ...group._group_actions.slice(i + 1));
      });
    }

    const optionStringIndices = new Map();
    let pattern = '';
    for (let i = 0; i < argStrings.length; i++) {
      if (argStrings[i] === '--') {
        pattern += '-' + 'A'.repeat(argStrings.length - i - 1);
        break;
      }
      const optionTuple = this._parse_optional(argStrings[i]);
      if (optionTuple === null) pattern += 'A';
      else {
        optionStringIndices.set(i, optionTuple);
        pattern += 'O';
      }
    }

    const seenActions = new Set();
    const seenNonDefaultActions = new Set();
    const extras = [];

    const takeAction = (action, argumentStrings, optionString = null) => {
      seenActions.add(action);
      const values = this._get_values(action, argumentStrings);
      if (values !== action.default) {
        seenNonDefaultActions.add(action);
        for (const conflict of actionConflicts.get(action) ?? []) {
          if (seenNonDefaultActions.has(conflict)) {
            throw new ArgumentError(action, `not allowed with argument ${getActionName(conflict)}`);
          }
        }
      }
      if (values !== SUPPRESS) action.call(this, namespace, values, optionString);
    };

    const consumeOptional = (startIndex) => {
      let [action, optionString, explicitArg] = optionStringIndices.get(startIndex);
      const actionTuples = [];
      let stop;
      for (;;) {
        if (action === null) {
          extras.push(argStrings[startIndex]);
          return startIndex + 1;
        }
        if (explicitArg !== null) {
          const argCount = this._match_argument(action, 'A');
          if (argCount === 0 && !this.prefix_chars.includes(chars(optionString)[1])) {
            actionTuples.push([action, [], optionString]);
            const explicit = chars(explicitArg);
            // 3.9's `explicit_arg[0]` on an empty `-h=`: aiboard crashes there, exit 1, nothing printed.
            if (!explicit.length) throw new IndexError('string index out of range');
            optionString = chars(optionString)[0] + explicit[0];
            const newExplicitArg = explicit.slice(1).join('') || null;
            if (this._option_string_actions.has(optionString)) {
              action = this._option_string_actions.get(optionString);
              explicitArg = newExplicitArg;
            } else {
              throw new ArgumentError(action, `ignored explicit argument ${pyRepr(explicitArg)}`);
            }
          } else if (argCount === 1) {
            stop = startIndex + 1;
            actionTuples.push([action, [explicitArg], optionString]);
            break;
          } else {
            throw new ArgumentError(action, `ignored explicit argument ${pyRepr(explicitArg)}`);
          }
        } else {
          const start = startIndex + 1;
          const argCount = this._match_argument(action, pattern.slice(start));
          stop = start + argCount;
          actionTuples.push([action, argStrings.slice(start, stop), optionString]);
          break;
        }
      }
      for (const [a, args, os] of actionTuples) takeAction(a, args, os);
      return stop;
    };

    const positionals = this._actions.filter((a) => !a.option_strings.length);

    const consumePositionals = (startIndex) => {
      const argCounts = this._match_arguments_partial(positionals, pattern.slice(startIndex));
      argCounts.forEach((argCount, i) => {
        const args = argStrings.slice(startIndex, startIndex + argCount);
        startIndex += argCount;
        takeAction(positionals[i], args);
      });
      positionals.splice(0, argCounts.length);
      return startIndex;
    };

    let startIndex = 0;
    const maxOptionStringIndex = optionStringIndices.size ? Math.max(...optionStringIndices.keys()) : -1;
    while (startIndex <= maxOptionStringIndex) {
      const nextOptionStringIndex = Math.min(...[...optionStringIndices.keys()].filter((i) => i >= startIndex));
      if (startIndex !== nextOptionStringIndex) {
        const positionalsEndIndex = consumePositionals(startIndex);
        if (positionalsEndIndex > startIndex) {
          startIndex = positionalsEndIndex;
          continue;
        }
        startIndex = positionalsEndIndex;
      }
      if (!optionStringIndices.has(startIndex)) {
        extras.push(...argStrings.slice(startIndex, nextOptionStringIndex));
        startIndex = nextOptionStringIndex;
      }
      startIndex = consumeOptional(startIndex);
    }
    const stopIndex = consumePositionals(startIndex);
    extras.push(...argStrings.slice(stopIndex));

    const requiredActions = [];
    for (const action of this._actions) {
      if (seenActions.has(action)) continue;
      if (action.required) requiredActions.push(getActionName(action));
      else if (typeof action.default === 'string' && hasOwn(namespace, action.dest) && action.default === namespace[action.dest]) {
        namespace[action.dest] = this._get_value(action, action.default);
      }
    }
    if (requiredActions.length) this.error(`the following arguments are required: ${requiredActions.join(', ')}`);

    for (const group of this._mutually_exclusive_groups) {
      if (group.required && !group._group_actions.some((a) => seenNonDefaultActions.has(a))) {
        const names = group._group_actions.filter((a) => a.help !== SUPPRESS).map(getActionName);
        this.error(`one of the arguments ${names.join(' ')} is required`);
      }
    }
    return [namespace, extras];
  }

  _match_argument(action, argStringsPattern) {
    const m = new RegExp(`^${this._get_nargs_pattern(action)}`).exec(argStringsPattern);
    if (m === null) {
      const messages = { null: 'expected one argument', [OPTIONAL]: 'expected at most one argument', [ONE_OR_MORE]: 'expected at least one argument' };
      const msg = messages[action.nargs] ?? `expected ${action.nargs} argument${action.nargs === 1 ? '' : 's'}`;
      throw new ArgumentError(action, msg);
    }
    return m[1].length;
  }

  _match_arguments_partial(actions, argStringsPattern) {
    for (let i = actions.length; i > 0; i--) {
      const pattern = actions.slice(0, i).map((a) => this._get_nargs_pattern(a)).join('');
      const m = new RegExp(`^${pattern}`).exec(argStringsPattern);
      if (m !== null) return m.slice(1).map((g) => g.length);
    }
    return [];
  }

  _parse_optional(argString) {
    if (!argString) return null;
    const cs = chars(argString);
    if (!this.prefix_chars.includes(cs[0])) return null;
    if (this._option_string_actions.has(argString)) return [this._option_string_actions.get(argString), argString, null];
    if (cs.length === 1) return null;
    if (argString.includes('=')) {
      const at = argString.indexOf('=');
      const optionString = argString.slice(0, at);
      if (this._option_string_actions.has(optionString)) {
        return [this._option_string_actions.get(optionString), optionString, argString.slice(at + 1)];
      }
    }
    const optionTuples = this._get_option_tuples(argString);
    if (optionTuples.length > 1) {
      this.error(`ambiguous option: ${argString} could match ${optionTuples.map((t) => t[1]).join(', ')}`);
    } else if (optionTuples.length === 1) {
      return optionTuples[0];
    }
    if (NEGATIVE_NUMBER.test(argString) && !this._has_negative_number_optionals.length) return null;
    if (argString.includes(' ')) return null;
    return [null, argString, null];
  }

  _get_option_tuples(optionString) {
    const result = [];
    const cs = chars(optionString);
    const isPrefix = (c) => c !== undefined && this.prefix_chars.includes(c);
    if (isPrefix(cs[0]) && isPrefix(cs[1])) {
      let optionPrefix = optionString;
      let explicitArg = null;
      if (optionString.includes('=')) {
        const at = optionString.indexOf('=');
        optionPrefix = optionString.slice(0, at);
        explicitArg = optionString.slice(at + 1);
      }
      for (const [s, action] of this._option_string_actions) {
        if (s.startsWith(optionPrefix)) result.push([action, s, explicitArg]);
      }
    } else if (isPrefix(cs[0]) && !isPrefix(cs[1])) {
      const shortPrefix = cs.slice(0, 2).join('');
      const shortExplicitArg = cs.slice(2).join('');
      for (const [s, action] of this._option_string_actions) {
        if (s === shortPrefix) result.push([action, s, shortExplicitArg]);
        else if (s.startsWith(optionString)) result.push([action, s, null]);
      }
    } else {
      this.error(`unexpected option string: ${optionString}`);
    }
    return result;
  }

  _get_nargs_pattern(action) {
    const { nargs } = action;
    let pattern;
    if (nargs === null) pattern = '(-*A-*)';
    else if (nargs === OPTIONAL) pattern = '(-*A?-*)';
    else if (nargs === ONE_OR_MORE) pattern = '(-*A[A-]*)';
    else if (nargs === PARSER) pattern = '(-*A[-AO]*)';
    else pattern = `(-*${Array(nargs).fill('A').join('-*')}-*)`;
    if (action.option_strings.length) pattern = pattern.replaceAll('-*', '').replaceAll('-', '');
    return pattern;
  }

  _get_values(action, argStrings) {
    if (action.nargs !== PARSER) {
      const at = argStrings.indexOf('--');
      if (at !== -1) argStrings.splice(at, 1);
    }
    let value;
    if (!argStrings.length && action.nargs === OPTIONAL) {
      value = action.option_strings.length ? null : action.default;
      if (typeof value === 'string') {
        value = this._get_value(action, value);
        this._check_value(action, value);
      }
    } else if (argStrings.length === 1 && (action.nargs === null || action.nargs === OPTIONAL)) {
      value = this._get_value(action, argStrings[0]);
      this._check_value(action, value);
    } else if (action.nargs === PARSER) {
      value = argStrings.map((v) => this._get_value(action, v));
      this._check_value(action, value[0]);
    } else {
      value = argStrings.map((v) => this._get_value(action, v));
      for (const v of value) this._check_value(action, v);
    }
    return value;
  }

  _get_value(action, argString) {
    if (action.type === null) return argString;
    try {
      return action.type(argString);
    } catch (e) {
      if (!(e instanceof TypeError || e instanceof ValueError)) throw e;
      throw new ArgumentError(action, `invalid ${action.type.pyName} value: ${pyRepr(argString)}`);
    }
  }

  _check_value(action, value) {
    if (action.choices !== null && !action.hasChoice(value)) {
      const choices = action.choiceList().map(pyRepr).join(', ');
      throw new ArgumentError(action, `invalid choice: ${pyRepr(value)} (choose from ${choices})`);
    }
  }

  // ------------------------------------------------------------------- help and exits

  format_usage() {
    const formatter = this._getFormatter();
    formatter.addUsage(this.usage, this._actions, this._mutually_exclusive_groups);
    return formatter.formatHelp();
  }

  format_help() {
    const formatter = this._getFormatter();
    formatter.addUsage(this.usage, this._actions, this._mutually_exclusive_groups);
    formatter.addText(this.description);
    for (const group of this._action_groups) {
      formatter.startSection(group.title);
      formatter.addText(group.description);
      formatter.addArguments(group._group_actions);
      formatter.endSection();
    }
    formatter.addText(this.epilog);
    return formatter.formatHelp();
  }

  _getFormatter() {
    return new HelpFormatter(this.prog);
  }

  printUsage(file = sys.stdout) {
    this._printMessage(this.format_usage(), file);
  }

  printHelp(file = sys.stdout) {
    this._printMessage(this.format_help(), file);
  }

  _printMessage(message, file = sys.stderr) {
    if (message) file.write(message);
  }

  exit(status = 0, message = null) {
    if (message) this._printMessage(message, sys.stderr);
    throw new SystemExit(status);
  }

  error(message) {
    this.printUsage(sys.stderr);
    this.exit(2, `${this.prog}: error: ${message}\n`);
  }
}
