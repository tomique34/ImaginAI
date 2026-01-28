# Local Setup

## Requirements

- Node.js 18+ (recommended: 20+)
- npm

## Steps

1. Copy `.env.local.example` to `.env.local`
2. Set the following values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `KIE_API_KEY`
   - `KIE_WEBHOOK_SECRET`
   - `POLAR_PUBLIC_KEY`
   - `POLAR_SECRET_KEY`
   - `POLAR_API_BASE_URL`
   - `NEXT_PUBLIC_POLAR_STARTER_ID`
   - `NEXT_PUBLIC_POLAR_PRO_ID`
   - `NEXT_PUBLIC_POLAR_POWER_ID`
   - `NEXT_PUBLIC_AUTH_MODE` (set to `supabase` for real login)
3. Install dependencies:
   - `npm install`
4. Start the dev server:
   - `npm run dev`

## Tests

- Unit: `npm test`
- E2E: `npm run test:e2e` (run `npm run dev` in another terminal)
