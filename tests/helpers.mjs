// Shared test helpers — tmp project dirs for tests that touch the filesystem.

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const KIT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function mkTmpDir(prefix = "fkit-test-") {
  return mkdtempSync(join(tmpdir(), prefix));
}

export function rmTmpDir(dir) {
  rmSync(dir, { recursive: true, force: true });
}
