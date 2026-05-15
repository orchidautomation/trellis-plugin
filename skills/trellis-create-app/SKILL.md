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
- role-facing MCP route = `/mcp/trellis`
- operator MCP route = `/mcp/operator`

If the user asks what creates the database, route them to `trellis-setup-database`: the generated deploy flow should resolve or create the `TRELLIS_DB` D1 database and apply Trellis runtime schema.

## First Agent Edits

After init, route behavior edits to `trellis-build-agent`.

For novices, explain:

- `src/agent.ts` is where they mount providers, model, state map, MCP surfaces, knowledge, skills, and workflow calls.
- `src/state/*.map.ts` is where they describe business state. Trellis writes it into D1; users do not hand-author internal D1 migrations.
- `knowledge/**/*.md` is product/company context.
- `skills/**/SKILL.md` is methodology for individual bounded skills.

Do not encourage editing `src/trellis-runtime.ts` or `src/index.ts` for normal agent behavior.

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
3. move to `trellis-setup-database` if the blocker is D1, schema, seed data, traces, or state rows
4. move to `trellis-readiness-check` if anything else blocks
5. move to `trellis-first-deploy` when smoke is green

Do not ask for Attio, AgentMail, Firecrawl, Apify, Prospeo, Langfuse, or Braintrust credentials during first scaffold. Provider credentials are connected after the Cloudflare app boots.
