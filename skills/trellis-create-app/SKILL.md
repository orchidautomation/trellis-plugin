---
name: "trellis-create-app"
description: "Scaffold a new Trellis app with the right optional GTM lanes and then hand the user to the next setup step."
---

# Trellis Create App

Use this skill when the user explicitly wants to scaffold a new Trellis app instead of using the reference AI SDR first.

## Demo Rule

If the user just wants to see Trellis work, do not start here.

Route them to the reference AI SDR demo path first:

1. use the existing reference app
2. fill `.env`
3. run `doctor` and get smoke mode green
4. deploy
5. verify health and dashboard
6. connect remote MCP
7. run one safe signal

## Default Path

Start with the smallest viable Trellis app:

```bash
npm run ai-sdr -- init ../my-trellis-agent --name my-trellis-agent --json
```

If the user explicitly wants the AI SDR recipe scaffold, add the lanes they need:

```bash
npm run ai-sdr -- init ../my-ai-sdr --name my-ai-sdr \
  --with-discovery \
  --with-deep-research \
  --with-enrichment \
  --with-crm \
  --with-email \
  --with-handoff \
  --json
```

## Explain Lanes In Product Language

- discovery = Live Discovery
- deep-research = Deep Research
- enrichment = Enrichment
- crm = CRM Sync
- email = Outbound Email
- handoff = Slack Handoff

## After Scaffold

Tell the user exactly what to do next:

```bash
cd <new-app>
npm install
cp .env.example .env
```

Then tell them:

1. fill `.env` with only the core demo values first
2. run `npm run doctor -- --json`
3. move to `trellis-readiness-check`

Then move them to `trellis-readiness-check`.
