---
name: "trellis-stack-explainer"
description: "Explain a Trellis app's active stack, knowledge, skills, and providers in plain language."
---

# Trellis Stack Explainer

Use this skill when a user wants to understand what their Trellis app actually contains.

For demo questions, anchor on the reference AI SDR first unless the user is already inside a custom app.

## Required Inputs

Read:

1. `ai-sdr.config.ts`
2. `npm run ai-sdr -- modules --json`
3. `npm run ai-sdr -- check --json`

## Output Order

Explain the app in this order:

1. what the app is trying to do
2. what knowledge it uses
3. what skills it uses
4. what providers are active
5. what each provider does
6. what is optional vs required
7. what the first safe demo path is

## Plain Language

Use this mapping:

- knowledge = context
- skills = behavior
- modules = building blocks
- providers = outside services
- bindings = which outside service does which job

Do not answer with raw schema language first.

For the reference AI SDR, the first safe demo path is:

1. create app or use the reference app
2. fill `.env`
3. run `doctor` and get local smoke mode green
4. hosted deploy
5. health and dashboard
6. remote MCP
7. one signal
8. only then optional lanes like discovery or sends
