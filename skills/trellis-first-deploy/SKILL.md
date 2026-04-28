---
name: "trellis-first-deploy"
description: "Take a first-time Trellis user from local proof to the simplest credible production deployment."
---

# Trellis First Deploy

Use this skill when the user wants the shortest path to getting a Trellis app into production.

## Preferred Order

1. get smoke mode green locally
2. set up Convex
3. set up Vercel
4. verify remote MCP
5. deploy

## Required Commands

Run:

```bash
npm run doctor -- --json
npm run ai-sdr -- deploy vercel --json
```

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

## Success Condition

Production is not done until:

- deploy succeeds
- `/healthz` is healthy
- dashboard loads
- the remote MCP endpoint is reachable
