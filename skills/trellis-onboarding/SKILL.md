---
name: "trellis-onboarding"
description: "Route a new Trellis user to the next correct workflow without making them understand the whole stack first."
---

# Trellis Onboarding

Use this skill when a user is new to Trellis and wants the shortest path to a working Trellis demo or app.

## Framing

Trellis is the framework.

The reference AI SDR is the first demo path.

Keep the explanation simple:

- `ai-sdr.config.ts` is the app blueprint
- `knowledge/` is context
- `skills/` is behavior
- `modules` are building blocks
- `providers` are outside services
- `capabilityBindings` decide which provider does which job

## Noob Rule

Do one thing at a time:

- one decision
- one command
- one blocker
- one next step

Prefer:

- `Next: use the reference AI SDR before scaffolding a custom app`
- `Next: get smoke mode green locally`
- `Next: run vercel login`
- `Blocked: CONVEX_URL is missing`
- `Next: connect Firecrawl before optional lanes`

## Default Demo Order

Unless the user explicitly wants a custom scaffold, route them through this order:

1. create app or use the reference AI SDR already in the Trellis repo
2. fill `.env`
3. choose smoke mode or real Convex mode
4. run `doctor` and get local proof green
5. deploy
6. verify `/healthz` and `/dashboard`
7. connect remote MCP
8. run one safe signal demo
9. only then enable discovery or real sends

Say the next step in those exact verbs when possible:

- `Next: create app`
- `Next: fill .env`
- `Next: use Node 22`
- `Next: start convex dev`
- `Next: run doctor`
- `Next: deploy`
- `Next: connect remote MCP`
- `Next: run one safe demo`

## Route To The Right Skill

Use these skills based on the user's next need:

- `trellis-create-app`
  - when they explicitly need a new Trellis app scaffold
- `trellis-readiness-check`
  - when they need to know what is missing before boot or deploy
- `trellis-stack-explainer`
  - when they want to understand what the app contains
- `trellis-connect-providers`
  - when they need to wire external services one lane at a time
- `trellis-connect-mcp`
  - when they need local or remote MCP connected to Claude Code, Codex, Cursor, or OpenCode
- `trellis-first-deploy`
  - when they want the shortest path from local proof to a hosted demo

## Source Of Truth

Treat the Trellis CLI as the execution contract.

Prefer machine-readable commands:

```bash
npm run ai-sdr -- init <target-dir> --json
npm run ai-sdr -- modules --json
npm run ai-sdr -- check --json
npm run doctor -- --json
npm run ai-sdr -- connect <capability> <provider> --json
npm run ai-sdr -- mcp claude-code --local --write --json
npm run ai-sdr -- deploy <target> --json
```

Do not scrape pretty terminal output if JSON is available.
