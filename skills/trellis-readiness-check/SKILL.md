---
name: "trellis-readiness-check"
description: "Diagnose what is missing before a Trellis app can boot, connect providers, or deploy."
---

# Trellis Readiness Check

Use this skill when the user wants to know what is missing before Trellis can run.

The noob sequence here is:

1. fill `.env`
2. choose smoke mode or real Convex mode
3. run `npm run doctor -- --json`
4. fix only the next blocker
5. boot local proof

## Required Commands

Run:

```bash
npm run ai-sdr -- check --json
npm run doctor -- --json
```

## Classify Blockers

Group blockers into:

- boot blockers
- core demo blockers
- optional lane blockers
- optional blockers

Do not dump the full environment matrix unless the user asks for it.

## Default First Proof

Prefer the fastest local proof before asking for the full stack:

```bash
TRELLIS_LOCAL_SMOKE_MODE=true
TRELLIS_SANDBOX_TOKEN=local-sandbox-token
HANDOFF_WEBHOOK_SECRET=local-handoff-secret
DISCOVERY_LINKEDIN_ENABLED=false
NO_SENDS_MODE=true
```

Then:

```bash
npm run doctor -- --json
npm run doctor
npm run dev
```

Success means:

- `/healthz` returns ok
- `/dashboard` loads
- the operator surface is reachable

That does not prove:

- hosted deploy
- remote MCP
- live signal ingest
- discovery automation
- outbound send safety

The explicit next checks are:

- local smoke proof: `npm run ai-sdr:demo:smoke`
- local real Convex proof: `npm run ai-sdr:demo:check -- --base-url http://localhost:3000 --dashboard-password "$DASHBOARD_PASSWORD" --mcp-token "$TRELLIS_MCP_TOKEN" --signal-secret "$SIGNAL_WEBHOOK_SECRET"`
- hosted proof: `npm run ai-sdr:demo:check -- --base-url "$APP_URL" --dashboard-password "$DASHBOARD_PASSWORD" --mcp-token "$TRELLIS_MCP_TOKEN" --signal-secret "$SIGNAL_WEBHOOK_SECRET"`

For real Convex mode, be explicit:

```bash
nvm use 22
npx convex dev
npm run dev
```

Do not tell the user that `npm run dev` alone is enough when `CONVEX_URL` is set.

Do not switch a user into real Convex mode until Node 22 is active.

If `PORT=3000` is already occupied, tell the user to either stop the old process or run:

```bash
PORT=3001 npm run dev
```

## Noob Rule

Only tell the user the next missing step.

Good:

- `Blocked: set CONVEX_URL before Trellis can persist state`
- `Blocked: run nvm use 22 before Trellis can boot real Convex mode`
- `Next: add FIRECRAWL_API_KEY so research can run`
- `Next: run doctor again after updating .env`
- `Later: add APIFY_TOKEN only after the first safe signal demo works`
