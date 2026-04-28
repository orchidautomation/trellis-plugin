---
name: "trellis-create-app"
description: "Scaffold a new Trellis app with the right optional GTM lanes and then hand the user to the next setup step."
---

# Trellis Create App

Use this skill when the user wants to create a new Trellis app.

## Default Path

Start with the smallest viable Trellis app:

```bash
npm run ai-sdr -- init ../my-trellis-agent --name my-trellis-agent --json
```

If the user explicitly wants the AI SDR recipe, add the lanes they need:

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

Then move them to `trellis-readiness-check`.
