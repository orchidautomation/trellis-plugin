---
name: "trellis-create-app"
description: "Scaffold a new Cloudflare-first Trellis app and hand the user to readiness or deploy."
---

# Trellis Create App

Use this skill when the user explicitly wants to scaffold a new Trellis app.

## Default Path

Start with the smallest viable Trellis Cloudflare app:

```bash
npm run trellis -- init ../my-trellis-agent --name my-trellis-agent --json
```

Then:

```bash
cd ../my-trellis-agent
nvm use 22
npm install
npm run cf:login
npm run doctor -- --json
npm run smoke -- --json
```

## What Init Creates

Explain the scaffold in product language:

- Worker runtime = the deployed app
- Durable Object agent = durable identity and session owner
- D1 = Trellis state, approvals, provider runs, audit events, and trace events
- R2 packs = markdown knowledge and skill context
- Queue = background provider-action and runtime events
- Workflow = durable prospect workflow dispatch
- Workers AI and AI Gateway = model execution path
- Browser binding = browser automation slot
- MCP route = `/mcp/trellis`

## After Scaffold

Tell the user exactly what to do next:

```bash
cd <new-app>
nvm use 22
npm install
npm run cf:login
```

Then tell them:

1. run `npm run doctor -- --json`
2. run `npm run smoke -- --json`
3. move to `trellis-readiness-check` if anything blocks
4. move to `trellis-first-deploy` when smoke is green

Do not ask for Attio, AgentMail, Firecrawl, Apify, Prospeo, Langfuse, or Braintrust credentials during first scaffold. Provider credentials are connected after the Cloudflare app boots.
