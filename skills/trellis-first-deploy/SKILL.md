---
name: "trellis-first-deploy"
description: "Take a first-time Trellis user from local proof to the simplest credible production deployment."
---

# Trellis First Deploy

Use this skill when the user wants the shortest path to getting a Trellis app into a hosted, demo-safe state.

## Preferred Order

1. create app and fill `.env`
2. use Node 22
3. choose smoke mode or real Convex mode
4. get local proof green
5. set up Convex
6. set up core hosted env
7. deploy
8. verify `/healthz` and `/dashboard`
9. connect remote MCP
10. run one safe signal demo
11. only then enable discovery or sends

Treat the canonical hosted path as:

1. Convex Cloud
2. Vercel
3. remote Trellis MCP

Do not route a first deploy through Railway.

## Required Commands

Run:

```bash
npm run doctor -- --json
npm run ai-sdr -- deploy vercel --json
```

Then verify:

```bash
curl -fsS ${APP_URL}/healthz
```

Then load `${APP_URL}/dashboard` in the browser.

Then tell the user only the next missing step.

## Convex

Always use Node 22 first:

```bash
nvm use 22
```

For real local development:

```bash
npx convex dev
```

Keep `npx convex dev` running while `npm run dev` runs in another terminal.

Use this exact two-terminal local pattern:

Terminal 1:

```bash
nvm use 22
npx convex dev
```

Terminal 2:

```bash
nvm use 22
npm run dev
```

For production:

```bash
npx convex deploy
```

For coding-agent sessions where a login flow is awkward:

```bash
CONVEX_AGENT_MODE=anonymous npx convex dev
```

## Vercel

After Convex prod deploy succeeds, copy the prod Convex URL into Vercel env:

```bash
CONVEX_URL=https://<deployment>.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
CONVEX_SITE_URL=https://<deployment>.convex.site
```

Minimum hosted env:

```bash
APP_URL=https://<your-vercel-domain>
DASHBOARD_PASSWORD=<long-random-password>
TRELLIS_SANDBOX_TOKEN=<long-random-secret>
TRELLIS_MCP_TOKEN=<long-random-secret>
SIGNAL_WEBHOOK_SECRET=<long-random-secret>
HANDOFF_WEBHOOK_SECRET=<long-random-secret>
NO_SENDS_MODE=true
FIRECRAWL_API_KEY=<key>
AI_GATEWAY_API_KEY=<key>
```

```bash
vercel login
vercel
vercel --prod
```

If `APP_URL` changes after the first prod deploy, update it and redeploy once.

If `npx convex deploy` fails on schema validation against old prod data, stop and use the repo runbook rather than loosening the final schema permanently:

- `docs/convex-vercel-prod-runbook.md`

## Safe Demo Rule

Keep `NO_SENDS_MODE=true`.

Do not treat the app as demo-ready until all of these are true:

- `npm run demo:smoke` passes locally
- or `npm run dev` + `npm run ai-sdr:demo:check` passes in real Convex mode
- one hosted deployment exists
- `/healthz` is healthy
- `/dashboard` loads
- remote MCP is connected
- `npm run ai-sdr:demo:check -- --base-url "$APP_URL" --dashboard-password "$DASHBOARD_PASSWORD" --mcp-token "$TRELLIS_MCP_TOKEN" --signal-secret "$SIGNAL_WEBHOOK_SECRET"` passes
- the resulting state is visible in both dashboard and MCP

Do not turn on discovery automation or outbound sends before that point.

## Success Condition

Production is not done until:

- deploy succeeds
- `/healthz` is healthy
- dashboard loads
- the remote MCP endpoint is reachable
- hosted `ai-sdr:demo:check` passes
