# Codex is a full seven-role runtime with explicit local limits

**Date**: 2026-10-29
**Status**: accepted

## Context

The owner accepted a Codex CLI runtime for all seven roles alongside Claude, with measured local limits. Source: `ai-agents/knowledge-base/decisions/adr-061-codex-as-a-full-seven-role-runtime-with-explicit-local-limits.md`.

## Decision

Each Codex role runs in a fresh process with project and role model settings; unavailable selections do not silently fall back. Wiki writes remain exclusive to the wiki role, movers to the producer, and owner approval remains required. General role writes and planning gates are instruction-enforced; the dispatcher enforces procedure ownership and consult topology at its boundary. Manual execution is outside that boundary.

The adversarial role is a fresh, read-only leaf. A usable same-model second pass is supported with visible disclosure and a different-model recommendation; missing or unusable passes remain partial. ADR-042 D2 and task `0273` remain unresolved.

The 2026-10-30 amendment reverses the unconditional legacy-entry preservation for interactive bare `fkit`: absent settings, an explicit runtime choice and save confirmation precede setup. Unconfigured noninteractive and explicit legacy entry retain legacy behavior. The amendment records approved behavior, not proof of implementation.

## Consequences

All seven direct no-Claude role smoke checks and local task/sprint workflows passed per the decision record. The record does not certify public distribution or Claude compatibility; real Claude smoke checks failed with a network/service-related error of unknown precise cause. General write and planning controls are not a universal filesystem wall; optional hooks require trust. A sandbox setting alone does not prove test execution.

## Related
