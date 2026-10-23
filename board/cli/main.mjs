#!/usr/bin/env node
// The board's command-line entry, as aiboard's __main__.py. It sets process.exitCode and never calls
// process.exit(): pipe writes are asynchronous, and exiting early would cut off a long `board --json`.
import { SystemExit, main } from './cli.mjs';

try {
  process.exitCode = main();
} catch (e) {
  if (!(e instanceof SystemExit)) throw e;
  process.exitCode = e.code;
}
