# PhotoReimagine.ai

MVP for AI photo editing and generation using Kie.ai and Supabase.

## What is included

- Next.js App Router (TypeScript)
- Material UI theme and landing page
- Supabase schema, auth flow, and session handling
- Credit system helpers
- Kie.ai job orchestration + webhook handler
- Dashboard, project editor, billing, and admin stubs
- Jest + RTL tests and Playwright smoke test

## Quick Start

1. Copy `.env.local.example` to `.env.local`
2. Fill in Supabase + Kie.ai + Polar keys
3. Add Polar product IDs for the billing buttons
4. Set `NEXT_PUBLIC_AUTH_MODE` to `supabase` for real login
5. Run `npm install`
6. Run `npm run dev`

## Tests

- Unit: `npm test`
- E2E: `npm run test:e2e` (requires `npm run dev` in another terminal)
