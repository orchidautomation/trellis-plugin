---
name: "trellis-onboarding"
description: "Route a new Trellis user to the next correct workflow without making them understand the whole stack first."
---

# Trellis Onboarding

Use this skill when a user is new to Trellis and wants the shortest path from scaffold to a working GTM agent.

## Framing

Trellis is the framework.

An AI SDR is one example recipe built with Trellis.

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

- `Next: run vercel login`
- `Blocked: CONVEX_URL is missing`
- `Next: connect Apify for discovery`

## Route To The Right Skill

Use these skills based on the user's next need:

- `trellis-create-app`
  - when they need a new Trellis app scaffold
- `trellis-readiness-check`
  - when they need to know what is missing before boot or deploy
- `trellis-stack-explainer`
  - when they want to understand what the app contains
- `trellis-connect-providers`
  - when they need to wire external services one lane at a time
- `trellis-connect-mcp`
  - when they need local or remote MCP connected to Claude Code, Codex, Cursor, or OpenCode
- `trellis-first-deploy`
  - when they want the shortest path to production

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
