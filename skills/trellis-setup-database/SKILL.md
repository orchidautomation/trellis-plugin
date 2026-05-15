---
name: "trellis-setup-database"
description: "Create, bind, migrate, inspect, seed, or clean the Trellis D1 database for a generated Trellis app."
---

# Trellis Setup Database

Use this skill when the user asks about D1, database creation, schema, migrations, seeded demo data, trace cleanup, approval cleanup, or why a generated Trellis app cannot read/write state.

## Core Rule

Trellis owns the internal database schema. Do not ask novices to design migrations for Trellis runtime tables.

The app builder owns business state shape through `trellis.state(...)` in `src/state/*.map.ts`.

## What The Database Stores

D1 is the canonical store for:

- signals and run state
- business projections from `trellis.state(...)`
- drafts and approvals
- provider runs and provider actions
- audit events and trace events
- smoke runs and operator controls
- agent sessions and surface thread mappings

R2 stores markdown knowledge packs and skill packs. Do not put large knowledge documents directly into D1.

## Default Setup Path

From a generated app root:

```bash
nvm use 22
npm install
npm run cf:login
npm run doctor -- --json
npm run deploy -- --json
npm run verify -- --json
```

The deploy step should resolve or create the `TRELLIS_DB` D1 database, apply the Trellis runtime schema, and preserve the binding in `wrangler.jsonc`.

After deploy, verify live:

```bash
npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"
```

## Binding Checklist

Inspect `wrangler.jsonc` and confirm there is exactly one Trellis D1 binding:

```jsonc
{
  "d1_databases": [
    {
      "binding": "TRELLIS_DB",
      "database_name": "<app-name>-trellis",
      "database_id": "<cloudflare-d1-database-id>"
    }
  ]
}
```

If `TRELLIS_DB` is missing, route the user through `trellis-create-app` or the app's generated setup command. Do not hand-edit a new database binding unless the Trellis CLI is unavailable and the user accepts manual setup.

## Schema Ownership

Trellis-owned tables include:

- `trellis_signals`
- `trellis_prospects`
- `trellis_state_records`
- `trellis_drafts`
- `trellis_approvals`
- `trellis_provider_runs`
- `trellis_provider_actions`
- `trellis_workflow_runs`
- `trellis_audit_events`
- `trellis_trace_events`
- `trellis_operator_controls`
- `trellis_smoke_runs`
- `trellis_agent_sessions`
- `trellis_slack_threads`

Do not write custom migrations for those tables.

Use `src/state/*.map.ts` for business state:

```ts
const stateMap = trellis.state({
  tables: {
    leads: {
      primaryKey: "id",
      fields: {
        id: "signal.id",
        company: "signal.payload.company",
        domain: "signal.payload.companyDomain",
        status: "qualification.decision",
        summary: "qualification.summary",
      },
      indexes: [
        { name: "leads_by_status", fields: ["status"] },
      ],
    },
  },
});
```

## Inspect The Remote Database

Prefer app verification first:

```bash
npm run doctor -- --json
npm run verify -- --json
npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"
```

Use Wrangler only when the user explicitly needs table-level proof:

```bash
npx wrangler d1 list
npx wrangler d1 execute <database-name> --remote --command "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'trellis_%' ORDER BY name"
npx wrangler d1 execute <database-name> --remote --command "SELECT type, COUNT(*) AS count FROM trellis_trace_events GROUP BY type ORDER BY count DESC"
```

Do not paste secrets into commands. Use Worker secrets for route/API keys and provider credentials.

## Seed Demo Data

Use app-provided demo or smoke commands when available:

```bash
npm run smoke -- --json
npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY" --exercise-agent
```

For a curated SDR demo, seed only a small number of readable rows:

- one lead or account
- one trace
- one draft
- one or two pending approvals
- enough trace events to show the workflow

Do not seed fake sends as completed sends unless an actual provider executed them.

## Clean Demo Data

Be conservative. Never wipe a user's production database by default.

For demo cleanup:

1. identify the target database and environment
2. export or snapshot first when available
3. delete only fixture/demo rows by known `trace_id`, `signal_id`, `workspace_id`, or source prefix
4. keep one curated success path for demos
5. run `npm run verify -- --live --url "$APP_URL" --api-key "$TRELLIS_API_KEY"` after cleanup

Use exact IDs. Avoid broad deletes such as `DELETE FROM trellis_trace_events` unless the user explicitly asks to reset the whole demo database.

## Common Fixes

- `TRELLIS_DB binding is missing`
  - Next: run `trellis-create-app` or restore the generated `wrangler.jsonc` binding.
- `database_id is missing`
  - Next: run `npm run deploy -- --json` so the generated deploy flow can resolve or create the D1 database.
- `schema table missing`
  - Next: run `npm run deploy -- --json`, then `npm run verify -- --json`.
- `trace events are empty`
  - Next: run `npm run smoke -- --json` locally or a safe live verification with `--exercise-agent`.
- `state is missing for a lead`
  - Next: inspect `src/state/*.map.ts` and the trace for the related signal.

## Response Shape

When finished, report:

- D1 binding name and database name
- whether schema exists
- whether traces/approvals/state rows exist
- whether business state is coming from `trellis.state(...)`
- commands run
- any manual Cloudflare secret or provider setup still required
