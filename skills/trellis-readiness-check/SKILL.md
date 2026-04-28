---
name: "trellis-readiness-check"
description: "Diagnose what is missing before a Trellis app can boot, connect providers, or deploy."
---

# Trellis Readiness Check

Use this skill when the user wants to know what is missing before Trellis can run.

## Required Commands

Run:

```bash
npm run ai-sdr -- check --json
npm run doctor -- --json
```

## Classify Blockers

Group blockers into:

- boot blockers
- discovery blockers
- optional blockers

Do not dump the full environment matrix unless the user asks for it.

## Default First Proof

Prefer the fastest local proof before asking for the full stack:

```bash
TRELLIS_LOCAL_SMOKE_MODE=true
TRELLIS_SANDBOX_TOKEN=local-sandbox-token
HANDOFF_WEBHOOK_SECRET=local-handoff-secret
DISCOVERY_LINKEDIN_ENABLED=false
```

Then:

```bash
npm run doctor
npm run dev
```

Success means:

- `/healthz` returns ok
- `/dashboard` loads
- the operator surface is reachable

## Noob Rule

Only tell the user the next missing step.

Good:

- `Blocked: set CONVEX_URL before Trellis can persist state`
- `Next: add FIRECRAWL_API_KEY so research can run`
