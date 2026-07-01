# Autonomy + MCP config — `.loop/config.yaml`

Lives at `<repo_root>/.loop/config.yaml`. Created from template on first run. Edited by humans, read by the plugin at every Phase -1.

> v0.6.0 added the `mcp_integrations` section + 3 new gates (`ticket_status_update_gate`, `pr_creation_gate`, `notification_gate`). See `references/mcp-integrations.md` for the schema and adapter patterns. This document covers only the autonomy/gates portion.

## TL;DR (v0.9.0)

- `autonomy.preset` is the ONLY dial you usually need. **Three values**:
  - `minimal` — total autonomy. Plugin only stops for hard safety floor (rule violations, hotfix confirmation).
  - `ownership` — human owns architectural and risk decisions; plugin owns routine execution.
  - `custom` — you spell out each gate. Requires ALL gates to be defined explicitly (no partial custom).
- **Presets are self-contained.** Setting `preset: minimal` implies all gate defaults for minimal. You do NOT need to spell out each gate.
- Observability is ALWAYS ON — surfacing lines, per-agent consumption table, run-report, STATE updates. Not a gate. Not configurable.
- Override per-run via the ticket text: `do "ticket... --autonomy=minimal"`.
- **Resilience (v0.9.0):** invalid presets, unknown gates, and forbidden values are rejected at Phase -1 with a clear error message. Config drift can't silently break the plugin.
- 4 hard rules NEVER bend regardless of config: no auto-merge PRs, no push to main, no touching denylist paths, no overriding documented `.rules` violations silently.

## Minimal viable config

If your project uses Jira + GitHub, this 10-line config is complete:

```yaml
# .loop/config.yaml
autonomy:
  preset: minimal

mcp_integrations:
  ticket_source:
    type: jira
    project_key: "MH"

  pr_target:
    type: github
    owner: "your-org"
    repo: "your-repo"
    base_branch: "develop"
```

Change `preset: minimal` to `ownership` if you want to be consulted on architectural and risk decisions.

## Preset expansion table (v0.9.0)

Setting `preset: <name>` implies these gate values internally. You do NOT need to write them out.

| Gate | `minimal` | `ownership` | `custom` |
|---|---|---|---|
| `budget_gate.on_exceed` | `proceed` | `ask` (only if >2× threshold) | *(user-defined)* |
| `budget_gate.threshold_usd` | 5.00 | 2.00 | *(user-defined)* |
| `verifier_blocking_gate.on_blocking` | `auto_fix` (2 retries) | `auto_fix` (2 retries) | *(user-defined)* |
| `adr_conflict_gate.on_high_conflict` | `proceed_with_record` | **`ask`** | *(user-defined)* |
| `adr_rule_violation_gate.on_violation` | `ask` (safety floor — NEVER proceed) | `ask` (safety floor) | `ask` \| `abort` only |
| `spec_clarification_gate.on_gaps` | `use_defaults_and_flag` | `use_defaults_and_flag` | *(user-defined)* |
| `spec_clarification_gate.max_questions` | 0 | 0 | *(user-defined)* |
| `self_healing_exhaust_gate.on_exhausted` | `escalate_silent` | **`ask`** | *(user-defined)* |
| `ticket_status_update_gate.on_complete` | `proceed` | `proceed` | *(user-defined)* |
| `pr_creation_gate.on_ready` | `proceed` (draft only) | **`ask`** | *(user-defined)* |
| `notification_gate.enabled` | `false` | `false` | *(user-defined)* |
| Approval before every write | no | no | no |
| Hotfix confirmation | **`ask`** (safety floor) | **`ask`** (safety floor) | **`ask`** (safety floor) |

### What `ownership` means

Human owns:
- **Architectural decisions** — ADR PR/MR conflicts (`adr_conflict_gate: ask`)
- **Work convergence** — when self-healing can't converge after retries (`self_healing_exhaust_gate: ask`)
- **Delivery moments** — when PR is ready to be created (`pr_creation_gate: ask`)
- **Rule violations & hotfix** — safety floor, non-negotiable

Plugin owns:
- Small budget deltas
- Verifier auto-fix for lint/type/test failures
- Spec gaps (marked TBD, not asked)
- Ticket status updates
- Small execution decisions

Result: about 3–5 interactions per typical development ticket, at the architecturally-important moments. Compared to `minimal` (0–1 interactions) and old `balanced` (10+ interactions).

## Customizable gates for `preset: custom`

If you set `preset: custom`, you MUST define every gate explicitly. Partial custom configs are rejected at Phase -1. Below is the complete list of gates + their allowed values.

### `budget_gate`

Controls behavior when the plan estimates spending more than the threshold.

```yaml
budget_gate:
  enabled: true                    # true | false
  threshold_tokens: 200000         # any positive integer
  threshold_usd: 1.50              # any positive float
  on_exceed: ask                   # ask | proceed | abort
```

| Field | Type | Allowed values |
|---|---|---|
| `enabled` | boolean | `true`, `false` |
| `threshold_tokens` | integer | > 0 |
| `threshold_usd` | float | > 0 |
| `on_exceed` | enum | `ask`, `proceed`, `abort` |

### `verifier_blocking_gate`

Controls behavior when the verifier reports blocking findings after intermediate artifacts are audited.

```yaml
verifier_blocking_gate:
  enabled: true
  on_blocking: auto_fix
  auto_fix_max_retries: 2
```

| Field | Type | Allowed values |
|---|---|---|
| `enabled` | boolean | `true`, `false` |
| `on_blocking` | enum | `ask`, `auto_fix`, `proceed_with_warnings`, `abort` |
| `auto_fix_max_retries` | integer | 0–5 (values >5 rejected — infinite loop risk) |

### `adr_conflict_gate`

Controls behavior when the ADR generator detects HIGH-overlap conflicts with open PRs/MRs.

```yaml
adr_conflict_gate:
  enabled: true
  on_high_conflict: ask
```

| Field | Type | Allowed values |
|---|---|---|
| `enabled` | boolean | `true`, `false` |
| `on_high_conflict` | enum | `ask`, `proceed_with_record`, `abort` |

### `adr_rule_violation_gate` (safety floor)

Controls behavior when the ticket proposes an alternative that violates a rule documented in `.cursorrules` / `AGENTS.md` / `.clinerules` etc.

```yaml
adr_rule_violation_gate:
  enabled: true
  on_violation: ask
```

| Field | Type | Allowed values |
|---|---|---|
| `enabled` | boolean | `true`, `false` |
| `on_violation` | enum | `ask`, `abort` — **`proceed` is REJECTED** by the resilience layer. Documented rules can never be silently bypassed. |

### `spec_clarification_gate`

Controls behavior when the spec-refiner finds gaps that need clarification.

```yaml
spec_clarification_gate:
  enabled: true
  on_gaps: use_defaults_and_flag
  max_questions: 0
```

| Field | Type | Allowed values |
|---|---|---|
| `enabled` | boolean | `true`, `false` |
| `on_gaps` | enum | `ask`, `use_defaults_and_flag`, `abort` |
| `max_questions` | integer | 0–20 (values >20 rejected — friction cap) |

### `self_healing_exhaust_gate`

Controls behavior when a worker exhausts its retry budget without converging.

```yaml
self_healing_exhaust_gate:
  enabled: true
  on_exhausted: escalate_silent
```

| Field | Type | Allowed values |
|---|---|---|
| `enabled` | boolean | `true`, `false` |
| `on_exhausted` | enum | `ask`, `escalate_silent`, `abort` |

### `ticket_status_update_gate`

Controls behavior when the run completes and the MCP-connected ticket source can be updated.

```yaml
ticket_status_update_gate:
  enabled: true
  on_complete: proceed
```

| Field | Type | Allowed values |
|---|---|---|
| `enabled` | boolean | `true`, `false` |
| `on_complete` | enum | `ask`, `proceed`, `proceed_with_record`, `skip` |

### `pr_creation_gate`

Controls behavior when the plugin is ready to create a PR via the MCP-connected git host.

```yaml
pr_creation_gate:
  enabled: true
  on_ready: ask
```

| Field | Type | Allowed values |
|---|---|---|
| `enabled` | boolean | `true`, `false` |
| `on_ready` | enum | `ask`, `proceed` (always draft), `skip` |

### `notification_gate`

Controls whether to post run summaries to Slack/Teams/Discord.

```yaml
notification_gate:
  enabled: false
  on_complete: skip
```

| Field | Type | Allowed values |
|---|---|---|
| `enabled` | boolean | `true`, `false` |
| `on_complete` | enum | `proceed`, `skip` |

## Resilience layer (v0.9.0)

At Phase -1, before any dispatch, the plugin validates the config:

### Rejected at boot

- Unknown preset name (typos like `minimial`, `owenership`) → error: *"Unknown preset '<name>'. Allowed: minimal | ownership | custom."*
- Unknown gate name (typos like `budgt_gate`, `verifier_gate`) → warning + ignored (not fatal, so you can rename gracefully).
- Invalid gate value:
  - Not in the enum → error: *"gate '<name>' field '<field>' has invalid value '<value>'. Allowed: <enum list>."*
  - Out of range (retries, questions) → error: *"gate '<name>' field '<field>' value '<n>' out of allowed range (0–<max>)."*
- Safety-floor violation:
  - `adr_rule_violation_gate.on_violation: proceed` → error: *"Documented rules cannot be silently bypassed. Use 'ask' or 'abort'."*
  - Hotfix confirmation set to anything but `ask` in preset expansion → error.

### Partial custom rejected

If `preset: custom`, ALL gates must be defined in the config. Missing any → error: *"preset 'custom' requires explicit definition of gates: [list of missing]. Either define them or use preset 'minimal' | 'ownership'."*

### Config surfacing

At Phase 0b, alongside the four observability lines, print a fifth line summarizing autonomy:

```
🎛 Autonomy: <preset> (<source>). Gates: <human summary>
```

For non-custom presets:
```
🎛 Autonomy: minimal (default from .loop/config.yaml). Gates: all proceed except safety floor.
🎛 Autonomy: ownership (default from .loop/config.yaml). Gates: ADR conflicts + self-healing exhaust + PR creation → ask; everything else proceeds.
```

For custom:
```
🎛 Autonomy: custom (default from .loop/config.yaml). Non-default gates: verifier=auto_fix(3 retries), spec_clarification=ask(3), pr_creation=proceed.
```

This makes it impossible for a config to silently drift into unexpected behavior. If the plugin doesn't like your config, it says so immediately.

## Schema

```yaml
# .loop/config.yaml
autonomy:
  preset: balanced     # minimal | balanced | high | custom

# Gate-by-gate behavior. The preset above sets these defaults; you can override individually.
gates:
  budget_gate:
    enabled: true
    threshold_tokens: 200000
    threshold_usd: 1.50
    on_exceed: ask                    # ask | proceed | abort

  verifier_blocking_gate:
    enabled: true
    on_blocking: ask                  # ask | auto_fix | proceed_with_warnings | abort
    auto_fix_max_retries: 2

  adr_conflict_gate:
    enabled: true
    on_high_conflict: ask             # ask | proceed_with_record | abort

  adr_rule_violation_gate:
    enabled: true
    on_violation: ask                 # ask | abort
                                      # NEVER "proceed" — rules are non-negotiable

  spec_clarification_gate:
    enabled: true
    on_gaps: ask                      # ask | use_defaults_and_flag | abort
    max_questions: 5

  self_healing_exhaust_gate:
    enabled: true
    on_exhausted: ask                 # ask | escalate_silent | abort

# Non-negotiable safety. NEVER editable regardless of preset.
hard_rules:
  - never_auto_merge_prs
  - never_push_to_main
  - never_touch_denylist_paths
  - never_override_documented_rules_silently
```

## Presets

### `minimal` — maximum autonomy

The plugin will only stop for things the human cannot delegate.

```yaml
autonomy:
  preset: minimal
gates:
  budget_gate:           { on_exceed: proceed }                     # spend up to global cap, no ask
  verifier_blocking_gate:{ on_blocking: auto_fix, auto_fix_max_retries: 2 }
                                                                    # try to fix, then warn
  adr_conflict_gate:     { on_high_conflict: proceed_with_record }
                                                                    # PR conflicts logged in ADR, run continues
  adr_rule_violation_gate:{ on_violation: abort }                   # rules still untouchable
  spec_clarification_gate:{ on_gaps: use_defaults_and_flag }
                                                                    # marks gaps TBD, doesn't ask
  self_healing_exhaust_gate:{ on_exhausted: escalate_silent }
                                                                    # records in STATE, doesn't ask
```

**Use when:** trivial tickets you've run dozens of times, batch processing, after a calibration period of `balanced` runs.

### `balanced` — default

What v0.4.x shipped. Asks when human judgment adds value, proceeds when not.

```yaml
autonomy:
  preset: balanced
gates:
  budget_gate:           { on_exceed: ask }
  verifier_blocking_gate:{ on_blocking: ask }
  adr_conflict_gate:     { on_high_conflict: ask }
  adr_rule_violation_gate:{ on_violation: ask }
  spec_clarification_gate:{ on_gaps: ask, max_questions: 5 }
  self_healing_exhaust_gate:{ on_exhausted: ask }
```

**Use when:** new project or new ticket archetype. First weeks of using the plugin in production.

### `high` — maximum human-in-the-loop

For sensitive areas (auth, billing, infra) where you'd rather pause more often.

```yaml
autonomy:
  preset: high
# Inherits all "ask" gates from balanced PLUS:
extras:
  approval_before_every_write: true     # like L1 but with writes after explicit OK
  max_questions: 10                     # spec-refiner can probe deeper
  require_user_confirmation_per_phase: true  # ask "continue?" after each phase
```

**Use when:** the ticket touches money flows, identity, customer data, production infra, regulatory compliance.

## Per-run override

Append to the ticket text:

```
do "Migrar auth a Riverpod 2 con tests --autonomy=minimal"
do "Cambiar pricing engine --autonomy=high"
do "Audit security of session module --autonomy=balanced"
```

The override applies ONLY to that run. Config file untouched. Useful when you trust this specific ticket but generally prefer a different stance.

## Surfacing in chat

`do` Phase 1 announces the active autonomy alongside the readiness level:

```
🎚 Readiness level: L2 (assisted)
🎛 Autonomy: minimal (override por --autonomy=minimal en el ticket)
```

If preset is `custom`, the chat shows which gates are non-default:

```
🎛 Autonomy: custom (verifier_blocking_gate=auto_fix, others=default balanced)
```

## Gate decision table

Each gate's `on_*` value determines behavior when triggered:

| Action | Behavior |
|---|---|
| `ask` | `AskUserQuestion` with 2–3 options. Run pauses. |
| `proceed` | Continue with default safe path. Record decision in run-report. |
| `proceed_with_record` | Continue but escalate to STATE Watch List for human review later. |
| `proceed_with_warnings` | Continue, mark the run as `status: partial` in run-log. |
| `auto_fix` | Try corrective dispatch (e.g. fix-failing-tests worker). Capped at `auto_fix_max_retries`. |
| `escalate_silent` | Don't ask, don't fix; add to STATE High Priority for next run. |
| `abort` | Stop the run, mark `status: aborted` in run-log, surface reason. |

## Migration from v0.4.x

If `.loop/config.yaml` doesn't exist when v0.5.0 boots, the plugin creates it with `preset: balanced`. Behavior is identical to v0.4.x. Zero breakage.

## What CANNOT be configured (safety floor)

Even `preset: minimal` honors these:

1. **No auto-merge PRs.** EVER. The plugin produces a branch + PR description; humans merge.
2. **No push to `main` / `master` / `production` / protected branches.** EVER.
3. **No writes to `.loop/budget.md` denylist paths.** EVER. Denylist is enforced by every worker before any Write.
4. **No silent override of documented `.rules` violations.** `adr_rule_violation_gate.on_violation` can only be `ask` or `abort`. If you want to bypass a rule, edit the `.rules` file first (a separate, deliberate act).

These four floors prevent autonomy from becoming recklessness.
