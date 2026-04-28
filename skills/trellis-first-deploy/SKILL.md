---
name: "trellis-first-deploy"
description: "Take a first-time Trellis user from local proof to the simplest credible production deployment."
---

# Trellis First Deploy

Use this skill when the user wants the shortest path to getting a Trellis app into a hosted, demo-safe state.

## Preferred Order

1. create app and fill `.env`
2. get smoke mode green locally
3. set up Convex
4. set up core hosted env
5. deploy
6. verify `/healthz` and `/dashboard`
7. connect remote MCP
8. run one safe signal demo
9. only then enable discovery or sends

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

```bash
npx convex dev
npx convex deploy
```

For coding-agent sessions:

```bash
CONVEX_AGENT_MODE=anonymous npx convex dev
```

## Vercel

```bash
vercel login
vercel
vercel --prod
```

## Safe Demo Rule

Keep `NO_SENDS_MODE=true`.

Do not treat the app as demo-ready until all of these are true:

- one hosted deployment exists
- `/healthz` is healthy
- `/dashboard` loads
- remote MCP is connected
- one signal has been ingested
- the resulting state is visible in both dashboard and MCP

Do not turn on discovery automation or outbound sends before that point.

## Success Condition

Production is not done until:

- deploy succeeds
- `/healthz` is healthy
- dashboard loads
- the remote MCP endpoint is reachable
