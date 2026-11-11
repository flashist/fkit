#!/usr/bin/env bash
set -euo pipefail
here="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
exec bash "$here/check-core.sh" --share "$here/../../fkit-resources" "$@"
