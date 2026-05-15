---
name: "trellis-stack-explainer"
description: "Explain a Trellis Cloudflare app's active runtime, knowledge, skills, providers, MCP, and operator surfaces in plain language."
---

# Trellis Stack Explainer

Use this skill when a user wants to understand what their Trellis app actually contains.

## Required Inputs

Read:

1. `src/agent.ts`
2. `wrangler.jsonc`
3. `src/trellis-runtime.ts`
4. `knowledge/`
5. `skills/`
6. `.trellis/providers/` if present

Then run when available:

```bash
npm run doctor -- --json
npm run verify -- --json
```

## Output Order

Explain the app in this order:

1. what the app is trying to do
2. where it runs in Cloudflare
3. what state and trace stores it uses
4. what knowledge it uses
5. what skills it uses
6. what providers are active
7. what each provider does
8. what is optional vs required
9. what the first safe demo path is

## Plain Language

Use this mapping:

- `src/agent.ts` = agent behavior
- `knowledge/` = context
- `skills/` = task instructions
- `wrangler.jsonc` = Cloudflare wiring
- D1 = database for Trellis state, approvals, provider runs, audit events, and traces
- R2 = knowledge and skill pack storage
- Queue = async background work
- Workflow = durable workflow dispatch
- Durable Object = agent identity and session owner
- Workers AI and AI Gateway = model path
- MCP = host control and inspection route
- role-shaped MCP = business surface such as `trellis-sdr` at `/mcp/trellis`
- operator MCP = platform surface such as `trellis-operator` at `/mcp/operator`
- provider manifests = non-secret setup records
- Worker secrets = real credentials

Do not answer with raw schema language first.

## Cloudflare Surface

For generated apps, expect:

- Worker route: `/`
- health route: `/healthz`
- smoke route: `/smoke`
- role-facing MCP route: `/mcp/trellis`
- operator MCP route: `/mcp/operator`
- dashboard route: `/dashboard`
- signal route: `/webhooks/signals`
- approval routes: `/approvals/*`
- provider action routes: `/provider-actions/*`
- operator routes: `/operator/*`
- event stream routes: `/events` and `/events/stream` when the runtime includes them

Once `TRELLIS_API_KEY` is configured, protected routes need bearer auth.

## D1 And State Explanation

Explain D1 in two layers:

- Trellis internal tables are owned by the framework: signals, state records, drafts, approvals, provider runs, provider actions, workflows, audit events, trace events, operator controls, smoke runs, agent sessions, and surface thread links.
- Business tables are declared in `src/state/*.map.ts` with `trellis.state(...)` and stored as projections in `trellis_state_records`.

Do not tell a novice to edit internal D1 schema for normal agent work.

## Skill Explanation

For each `skills/**/SKILL.md`, explain:

- what the skill decides or produces
- what knowledge it depends on
- which schema in `src/agent.ts` validates it
- whether it can have side effects

Skills should be small bounded methods. The workflow in `src/agent.ts` composes them.

## First Safe Demo Path

The first safe demo path is:

1. create app or use the generated Cloudflare app
2. use Node 22
3. install dependencies
4. authenticate Cloudflare
5. run doctor
6. run smoke
7. deploy
8. verify Cloudflare locally and live
9. connect remote MCP
10. run one safe signal
11. only then optional lanes like discovery, CRM, email, or sends
