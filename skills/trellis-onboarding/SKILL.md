---
name: "trellis-onboarding"
description: "Route a new Trellis user through the Cloudflare-first path without making them understand the whole stack first."
---

# Trellis Onboarding

Use this skill when a user is new to Trellis and wants the shortest path to a working Trellis demo or app.

## Framing

Trellis is a vertical GTM agent stack. Flue is hidden behind Trellis. Cloudflare is the default runtime and deploy target.

Keep the explanation simple:

- `src/agent.ts` is the Trellis app blueprint
- `knowledge/` is context
- `skills/` is behavior
- `wrangler.jsonc` is the Cloudflare binding map
- D1 is queryable Trellis state and traces
- R2 stores knowledge and skill packs
- Queues handle background work
- Workflows handle durable workflow dispatch
- `/mcp/trellis` is the agent control and inspection surface
- `/mcp/operator` is the runtime control-plane surface when the app exposes a role-shaped MCP like `trellis-sdr`

## Novice Rule

Do one thing at a time:

- one decision
- one command
- one blocker
- one next step

Prefer:

- `Next: create the Cloudflare app`
- `Next: run cf:login`
- `Next: run doctor`
- `Next: run smoke`
- `Next: deploy`
- `Next: verify cloudflare`
- `Next: connect remote MCP`
- `Blocked: Cloudflare auth is missing`
- `Blocked: TRELLIS_API_KEY is missing for protected remote routes`

## Default Demo Order

Unless the user explicitly wants a different path, route them through this order:

1. create a Trellis Cloudflare app
2. use Node 22
3. install dependencies
4. authenticate Cloudflare
5. run doctor
6. run local smoke
7. deploy
8. verify Cloudflare locally and live
9. connect remote MCP
10. run one safe signal
11. only then connect optional providers or enable sends

Say the next step in these exact verbs when possible:

- `Next: create app`
- `Next: use Node 22`
- `Next: install`
- `Next: authenticate Cloudflare`
- `Next: run doctor`
- `Next: run smoke`
- `Next: deploy`
- `Next: verify`
- `Next: connect remote MCP`
- `Next: run one safe demo`

## Route To The Right Skill

Use these skills based on the user's next need:

- `trellis-create-app`
  - when they need a new Trellis Cloudflare scaffold
- `trellis-readiness-check`
  - when they need to know what is missing before boot, deploy, or live verification
- `trellis-setup-database`
  - when they need to create, bind, inspect, seed, clean, or explain the D1 database and schema
- `trellis-stack-explainer`
  - when they want to understand what the app contains
- `trellis-build-agent`
  - when they want to build or modify `src/agent.ts`, `src/state/*.map.ts`, `knowledge/`, `skills/`, or MCP tool surfaces
- `trellis-connect-providers`
  - when they need to wire provider credentials one lane at a time after first boot
- `trellis-connect-mcp`
  - when they need local or remote MCP connected to Claude Code, Codex, Cursor, or OpenCode
- `trellis-first-deploy`
  - when they want the shortest path from local proof to a hosted Cloudflare demo

## Source Of Truth

Treat the Trellis CLI as the execution contract. Prefer machine-readable commands:

```bash
npm run trellis -- init <target-dir> --name <app-name> --json
npm run trellis -- doctor --json
npm run trellis -- smoke --json
npm run trellis -- deploy --json
npm run trellis -- verify cloudflare --json
npm run trellis -- verify cloudflare --live --url <worker-url> --api-key "$TRELLIS_API_KEY"
npx wrangler d1 execute <database-name> --remote --command "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'trellis_%' ORDER BY name"
npm run trellis -- connect <provider> --json
npm run trellis -- docs add <path> --json
npm run trellis -- mcp claude-code --remote --write --json --url "${APP_URL}/mcp/trellis" --token "$TRELLIS_API_KEY"
```

Do not route new users through Convex, Vercel, Railway, or legacy AI SDR commands. Do not scrape pretty terminal output if JSON is available.

## Current Trellis Agent Pattern

When the user asks to build an agent, use `trellis-build-agent` and make these concepts explicit:

- `src/agent.ts` defines the Trellis workflow.
- `src/state/*.map.ts` defines business state projections.
- Trellis owns internal D1 tables and trace/approval schema.
- `trellis-setup-database` handles D1 creation, binding, schema proof, seed data, and safe demo cleanup.
- `skills/**/SKILL.md` files are bounded methods, not the entire agent.
- `knowledge/**/*.md` files are fetched into runtime context through R2 packs.
- `/mcp/trellis` should be the role-facing surface such as `trellis-sdr`.
- `/mcp/operator` should be the platform/operator surface such as `trellis-operator`.
