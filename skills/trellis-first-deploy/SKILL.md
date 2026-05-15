---
name: "trellis-first-deploy"
description: "Take a first-time Trellis user from local proof to the simplest credible Cloudflare production deployment."
---

# Trellis First Deploy

Use this skill when the user wants the shortest path to getting a Trellis app into a hosted, demo-safe Cloudflare state.

## Preferred Order

1. create app
2. use Node 22
3. install dependencies
4. authenticate Cloudflare
5. run doctor
6. run smoke
7. deploy
8. verify Cloudflare locally
9. verify deployed `/healthz`, `/mcp/trellis`, `/mcp/operator`, and `/smoke`
10. connect remote MCP
11. run one safe signal demo only if requested
12. only then enable provider credentials, discovery, or sends

Treat the canonical hosted path as:

1. Cloudflare Workers
2. D1
3. R2 packs
4. Queues and dead-letter queue
5. Workflows
6. Durable Object agent sessions
7. Workers AI through Cloudflare AI Gateway
8. Trellis MCP

Do not route a first deploy through Vercel, Convex, or Railway.

## Required Commands

Run:

```bash
npm run doctor -- --json
npm run smoke -- --json
npm run deploy -- --json
npm run verify -- --json
```

Then verify the deployed Worker:

```bash
npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"
```

If the user wants a safe live harness exercise:

```bash
npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY" --exercise-agent
```

## Cloudflare

Always use Node 22 first:

```bash
nvm use 22
```

Authenticate:

```bash
npm run cf:login
```

or use:

```bash
CLOUDFLARE_ACCOUNT_ID=<account-id>
CLOUDFLARE_API_TOKEN=<token>
```

The first `npm run deploy -- --json` should resolve or create:

- `TRELLIS_DB` D1 database
- `TRELLIS_PACKS` R2 bucket
- `TRELLIS_ARTIFACTS` R2 bucket
- `TRELLIS_EVENTS` queue and dead-letter queue
- `PROSPECT_WORKFLOW` Cloudflare Workflow
- Worker deploy
- R2 pack sync for `knowledge/**/*.md` and `skills/**/SKILL.md`

If D1 setup, schema, seed data, trace cleanup, or state-row inspection becomes the main question, switch to `trellis-setup-database`.

## Secrets

Minimum protected remote route secret:

```bash
npx wrangler secret put TRELLIS_API_KEY
```

Optional webhook auth:

```bash
npx wrangler secret put TRELLIS_WEBHOOK_SECRET
```

Do not require provider secrets for the first deploy. Add them after the Worker is alive:

```bash
npm run trellis -- connect firecrawl --json
npm run trellis -- connect attio --json
npm run trellis -- connect agentmail --json
npm run trellis -- connect apify --json
npm run trellis -- connect prospeo --json
```

## Safe Demo Rule

Do not treat the app as demo-ready until all of these are true:

- `npm run smoke -- --json` passes locally
- `npm run deploy -- --json` succeeds
- `npm run verify -- --json` passes local Cloudflare checks
- `npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"` passes remote checks
- `/healthz` is healthy
- `/mcp/trellis` is reachable with auth
- `/mcp/operator` is reachable with auth
- R2 pack sync is clean
- the dashboard and operator surfaces are reachable with auth

Do not turn on discovery automation or outbound sends before that point.

## Success Condition

Production is not done until:

- Cloudflare deploy succeeds
- D1/R2/Queue/Workflow bindings are resolved
- packs are synced to R2
- `/healthz` is healthy
- `/mcp/trellis` is reachable with auth
- `/mcp/operator` is reachable with auth
- `trellis verify cloudflare --live` passes
