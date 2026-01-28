# PhotoReimagine MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an MVP web app that lets users sign in, upload a photo, edit it via Kie.ai (Nano Banana Pro), and manage credits/payments with an admin pricing panel.

**Architecture:** Next.js App Router fullstack with serverless API routes. Supabase provides auth, PostgreSQL, and storage. Kie.ai handles AI jobs via async webhook callbacks.

**Tech Stack:** Next.js 14+, TypeScript, Material UI, Supabase (Postgres/Auth/Storage), Kie.ai API, Jest + React Testing Library, Playwright.

---

### Task 1: Scaffold Next.js app

**Files:**
- Create: `app/layout.tsx`, `app/page.tsx`, `next.config.js`, `package.json` (via create-next-app)
- Create: `.env.local.example`

**Step 1: Scaffold app**

Run: `npx create-next-app@latest photoreimagine --typescript --eslint --app --src-dir --import-alias "@/*"`
Expected: New Next.js app folder created.

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: App loads on http://localhost:3000.

**Step 3: Add env example**

Create `.env.local.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
KIE_API_KEY=
KIE_WEBHOOK_SECRET=
POLAR_PUBLIC_KEY=
POLAR_SECRET_KEY=
NEXT_PUBLIC_AUTH_MODE=mock
```

**Step 4: Commit**

Run: `git add . && git commit -m "chore: scaffold next app"`

---

### Task 2: Add testing stack (Jest + RTL)

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `__tests__/app/home.test.tsx`
- Modify: `package.json`

**Step 1: Write failing test**

Create `__tests__/app/home.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the product name", () => {
    render(<Home />);
    expect(screen.getByText("PhotoReimagine.ai")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/app/home.test.tsx -v`
Expected: FAIL because Jest is not configured.

**Step 3: Add Jest config**

Create `jest.config.ts`:
```ts
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
```

Create `jest.setup.ts`:
```ts
import "@testing-library/jest-dom";
```

Modify `package.json` scripts:
```json
"test": "jest"
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/app/home.test.tsx -v`
Expected: PASS after updating the Home page in Task 3.

**Step 5: Commit**

Run: `git add . && git commit -m "test: add jest and rtl"`

---

### Task 3: Set up Material UI theme and layout

**Files:**
- Create: `src/app/providers.tsx`
- Create: `src/app/theme.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Write failing test**

Update `__tests__/app/home.test.tsx` to expect the title text:
```tsx
expect(screen.getByText("PhotoReimagine.ai")).toBeInTheDocument();
```
Expected: FAIL until `page.tsx` is updated.

**Step 2: Add MUI theme**

Create `src/app/theme.ts`:
```ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1B3A57" },
    secondary: { main: "#F0A202" },
    background: { default: "#F7F5F2" },
  },
  typography: {
    fontFamily: "'Playfair Display', serif",
  },
});
```

Create `src/app/providers.tsx`:
```tsx
"use client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/app/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

Modify `src/app/layout.tsx`:
```tsx
import Providers from "@/app/providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Modify `src/app/page.tsx` to include brand text:
```tsx
export default function Home() {
  return (
    <main>
      <h1>PhotoReimagine.ai</h1>
    </main>
  );
}
```

**Step 3: Run test to verify it passes**

Run: `npm test -- __tests__/app/home.test.tsx -v`
Expected: PASS

**Step 4: Commit**

Run: `git add . && git commit -m "feat: add mui theme and layout"`

---

### Task 4: Add Supabase schema and types

**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/db/types.ts`
- Test: `__tests__/lib/credits.test.ts`

**Step 1: Write failing test**

Create `__tests__/lib/credits.test.ts`:
```ts
import { applyCreditDebit } from "@/lib/credits";

describe("credits", () => {
  it("deducts credits safely", () => {
    expect(applyCreditDebit(3, 1)).toBe(2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/lib/credits.test.ts -v`
Expected: FAIL because credits module does not exist.

**Step 3: Add schema**

Create `supabase/schema.sql`:
```sql
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'USER',
  credits_balance integer not null default 3,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  name text not null,
  original_image_url text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists job_history (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id),
  user_id uuid not null references profiles(id),
  status text not null default 'QUEUED',
  prompt text not null,
  ai_model text not null,
  result_image_url text,
  credits_used integer not null default 1,
  error_message text,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null,
  credits integer not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  amount integer not null,
  credits_purchased integer not null,
  status text not null default 'PENDING',
  polar_payment_id text,
  created_at timestamp with time zone default now()
);
```

Create `src/lib/db/types.ts`:
```ts
export type Profile = {
  id: string;
  role: "USER" | "ADMIN";
  credits_balance: number;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  original_image_url: string;
};

export type Job = {
  id: string;
  project_id: string;
  user_id: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  prompt: string;
  ai_model: string;
  result_image_url?: string | null;
  credits_used: number;
  error_message?: string | null;
};
```

**Step 4: Create credits module**

Create `src/lib/credits.ts`:
```ts
export function applyCreditDebit(balance: number, cost: number) {
  const next = balance - cost;
  if (next < 0) throw new Error("INSUFFICIENT_CREDITS");
  return next;
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- __tests__/lib/credits.test.ts -v`
Expected: PASS

**Step 6: Commit**

Run: `git add . && git commit -m "feat: add supabase schema and credits lib"`

---

### Task 5: Supabase clients (server + browser)

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`
- Test: `__tests__/lib/supabase.test.ts`

**Step 1: Write failing test**

Create `__tests__/lib/supabase.test.ts`:
```ts
import { getSupabaseUrl } from "@/lib/supabase/config";

describe("supabase config", () => {
  it("reads the url", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    expect(getSupabaseUrl()).toBe("https://test.supabase.co");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/lib/supabase.test.ts -v`
Expected: FAIL because config module does not exist.

**Step 3: Implement config + clients**

Create `src/lib/supabase/config.ts`:
```ts
export function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL_MISSING");
  return url;
}

export function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("SUPABASE_ANON_KEY_MISSING");
  return key;
}
```

Create `src/lib/supabase/client.ts`:
```ts
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/config";

export function createBrowserClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}
```

Create `src/lib/supabase/server.ts`:
```ts
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

export function createServerClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY_MISSING");
  return createClient(getSupabaseUrl(), key);
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/lib/supabase.test.ts -v`
Expected: PASS

**Step 5: Commit**

Run: `git add . && git commit -m "feat: add supabase client helpers"`

---

### Task 6: Auth utilities (mock-first)

**Files:**
- Create: `src/lib/auth.ts`
- Create: `__tests__/lib/auth.test.ts`

**Step 1: Write failing test**

Create `__tests__/lib/auth.test.ts`:
```ts
import { getCurrentUser } from "@/lib/auth";

describe("auth", () => {
  it("returns mock user in mock mode", async () => {
    process.env.NEXT_PUBLIC_AUTH_MODE = "mock";
    const user = await getCurrentUser();
    expect(user?.id).toBe("mock-user");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/lib/auth.test.ts -v`
Expected: FAIL because auth module does not exist.

**Step 3: Implement auth helper**

Create `src/lib/auth.ts`:
```ts
export type AuthUser = { id: string; email: string };

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (process.env.NEXT_PUBLIC_AUTH_MODE === "mock") {
    return { id: "mock-user", email: "mock@photoreimagine.ai" };
  }
  return null;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/lib/auth.test.ts -v`
Expected: PASS

**Step 5: Commit**

Run: `git add . && git commit -m "feat: add mock auth"`

---

### Task 7: Projects API and storage helpers

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/app/api/projects/route.ts`
- Create: `__tests__/lib/storage.test.ts`

**Step 1: Write failing test**

Create `__tests__/lib/storage.test.ts`:
```ts
import { buildProjectImagePath } from "@/lib/storage";

describe("storage", () => {
  it("creates a stable storage path", () => {
    expect(buildProjectImagePath("u1", "p1", "file.png")).toBe("u1/p1/file.png");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/lib/storage.test.ts -v`
Expected: FAIL because storage module does not exist.

**Step 3: Implement storage helper**

Create `src/lib/storage.ts`:
```ts
export function buildProjectImagePath(userId: string, projectId: string, filename: string) {
  return `${userId}/${projectId}/${filename}`;
}
```

**Step 4: Implement projects API**

Create `src/app/api/projects/route.ts`:
```ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();
  const { userId, name, originalImageUrl } = body;

  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: userId, name, original_image_url: originalImageUrl })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- __tests__/lib/storage.test.ts -v`
Expected: PASS

**Step 6: Commit**

Run: `git add . && git commit -m "feat: add projects api and storage helper"`

---

### Task 8: Kie.ai client and job creation API

**Files:**
- Create: `src/lib/kie-client.ts`
- Create: `src/app/api/jobs/route.ts`
- Create: `__tests__/lib/kie-client.test.ts`

**Step 1: Write failing test**

Create `__tests__/lib/kie-client.test.ts`:
```ts
import { buildKieRequest } from "@/lib/kie-client";

describe("kie client", () => {
  it("builds a request payload", () => {
    const payload = buildKieRequest({
      prompt: "make it cinematic",
      imageUrl: "https://example.com/in.png",
    });
    expect(payload.prompt).toBe("make it cinematic");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/lib/kie-client.test.ts -v`
Expected: FAIL because kie client module does not exist.

**Step 3: Implement Kie.ai client**

Create `src/lib/kie-client.ts`:
```ts
type KieJobInput = { prompt: string; imageUrl: string };

export function buildKieRequest(input: KieJobInput) {
  return {
    prompt: input.prompt,
    image_url: input.imageUrl,
  };
}

export async function startKieJob(input: KieJobInput) {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error("KIE_API_KEY_MISSING");

  const res = await fetch("https://api.kie.ai/market/google/pro-image-to-image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildKieRequest(input)),
  });

  if (!res.ok) throw new Error("KIE_REQUEST_FAILED");
  return res.json();
}
```

**Step 4: Add jobs API**

Create `src/app/api/jobs/route.ts`:
```ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { startKieJob } from "@/lib/kie-client";
import { applyCreditDebit } from "@/lib/credits";

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();
  const { userId, projectId, prompt, imageUrl } = body;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits_balance")
    .eq("id", userId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const nextBalance = applyCreditDebit(profile.credits_balance, 1);

  await supabase.from("profiles").update({ credits_balance: nextBalance }).eq("id", userId);

  const { data: job } = await supabase
    .from("job_history")
    .insert({ project_id: projectId, user_id: userId, prompt, ai_model: "nano-banana" })
    .select()
    .single();

  await startKieJob({ prompt, imageUrl });

  return NextResponse.json({ jobId: job.id });
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- __tests__/lib/kie-client.test.ts -v`
Expected: PASS

**Step 6: Commit**

Run: `git add . && git commit -m "feat: add kie client and job api"`

---

### Task 9: Kie.ai webhook handler

**Files:**
- Create: `src/app/api/webhooks/kie/route.ts`
- Create: `__tests__/lib/webhook.test.ts`

**Step 1: Write failing test**

Create `__tests__/lib/webhook.test.ts`:
```ts
import { verifyWebhook } from "@/lib/webhook";

describe("webhook", () => {
  it("rejects invalid signatures", () => {
    process.env.KIE_WEBHOOK_SECRET = "secret";
    expect(verifyWebhook("bad", "payload")).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/lib/webhook.test.ts -v`
Expected: FAIL because webhook module does not exist.

**Step 3: Implement webhook verification**

Create `src/lib/webhook.ts`:
```ts
import crypto from "crypto";

export function verifyWebhook(signature: string, payload: string) {
  const secret = process.env.KIE_WEBHOOK_SECRET;
  if (!secret) throw new Error("KIE_WEBHOOK_SECRET_MISSING");
  const hash = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return hash === signature;
}
```

**Step 4: Implement webhook API**

Create `src/app/api/webhooks/kie/route.ts`:
```ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyWebhook } from "@/lib/webhook";

export async function POST(req: Request) {
  const supabase = createServerClient();
  const payload = await req.text();
  const signature = req.headers.get("x-kie-signature") || "";

  if (!verifyWebhook(signature, payload)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const body = JSON.parse(payload);
  const { job_id, status, result_image_url } = body;

  await supabase
    .from("job_history")
    .update({ status, result_image_url, completed_at: new Date().toISOString() })
    .eq("id", job_id);

  return NextResponse.json({ ok: true });
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- __tests__/lib/webhook.test.ts -v`
Expected: PASS

**Step 6: Commit**

Run: `git add . && git commit -m "feat: add kie webhook handler"`

---

### Task 10: Dashboard UI

**Files:**
- Create: `src/app/(dashboard)/dashboard/page.tsx`
- Modify: `src/app/page.tsx`
- Test: `__tests__/app/dashboard.test.tsx`

**Step 1: Write failing test**

Create `__tests__/app/dashboard.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import Dashboard from "@/app/(dashboard)/dashboard/page";

describe("Dashboard", () => {
  it("shows credit balance", () => {
    render(<Dashboard />);
    expect(screen.getByText(/credits/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/app/dashboard.test.tsx -v`
Expected: FAIL because dashboard page does not exist.

**Step 3: Implement dashboard page**

Create `src/app/(dashboard)/dashboard/page.tsx`:
```tsx
export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Credits: 3</p>
    </main>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/app/dashboard.test.tsx -v`
Expected: PASS

**Step 5: Commit**

Run: `git add . && git commit -m "feat: add dashboard page"`

---

### Task 11: Project editor UI

**Files:**
- Create: `src/app/(dashboard)/project/[id]/page.tsx`
- Test: `__tests__/app/project-editor.test.tsx`

**Step 1: Write failing test**

Create `__tests__/app/project-editor.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import ProjectEditor from "@/app/(dashboard)/project/[id]/page";

describe("Project Editor", () => {
  it("shows prompt input", () => {
    render(<ProjectEditor />);
    expect(screen.getByPlaceholderText(/prompt/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/app/project-editor.test.tsx -v`
Expected: FAIL because page does not exist.

**Step 3: Implement project editor**

Create `src/app/(dashboard)/project/[id]/page.tsx`:
```tsx
export default function ProjectEditor() {
  return (
    <main>
      <h1>Project Editor</h1>
      <input placeholder="Enter prompt" />
    </main>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/app/project-editor.test.tsx -v`
Expected: PASS

**Step 5: Commit**

Run: `git add . && git commit -m "feat: add project editor page"`

---

### Task 12: Payments (mock) + pricing UI

**Files:**
- Create: `src/app/api/payments/route.ts`
- Create: `src/app/(dashboard)/billing/page.tsx`
- Test: `__tests__/app/billing.test.tsx`

**Step 1: Write failing test**

Create `__tests__/app/billing.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import Billing from "@/app/(dashboard)/billing/page";

describe("Billing", () => {
  it("shows pricing options", () => {
    render(<Billing />);
    expect(screen.getByText(/starter/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/app/billing.test.tsx -v`
Expected: FAIL because billing page does not exist.

**Step 3: Implement mock payments API**

Create `src/app/api/payments/route.ts`:
```ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ checkoutUrl: "https://example.com/checkout" });
}
```

**Step 4: Implement billing page**

Create `src/app/(dashboard)/billing/page.tsx`:
```tsx
export default function Billing() {
  return (
    <main>
      <h1>Billing</h1>
      <div>Starter - 30 credits</div>
      <div>Pro - 100 credits</div>
      <div>Power - 200 credits</div>
    </main>
  );
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- __tests__/app/billing.test.tsx -v`
Expected: PASS

**Step 6: Commit**

Run: `git add . && git commit -m "feat: add billing page and mock payments"`

---

### Task 13: Admin products page (RBAC stub)

**Files:**
- Create: `src/app/(admin)/admin/products/page.tsx`
- Test: `__tests__/app/admin-products.test.tsx`

**Step 1: Write failing test**

Create `__tests__/app/admin-products.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import AdminProducts from "@/app/(admin)/admin/products/page";

describe("Admin Products", () => {
  it("shows products table", () => {
    render(<AdminProducts />);
    expect(screen.getByText(/products/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/app/admin-products.test.tsx -v`
Expected: FAIL because admin page does not exist.

**Step 3: Implement admin products page**

Create `src/app/(admin)/admin/products/page.tsx`:
```tsx
export default function AdminProducts() {
  return (
    <main>
      <h1>Products</h1>
      <p>Manage credit packages here.</p>
    </main>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/app/admin-products.test.tsx -v`
Expected: PASS

**Step 5: Commit**

Run: `git add . && git commit -m "feat: add admin products page"`

---

### Task 14: Add Playwright E2E tests (smoke)

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/smoke.spec.ts`
- Modify: `package.json`

**Step 1: Write failing test**

Create `e2e/smoke.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("PhotoReimagine.ai")).toBeVisible();
});
```

**Step 2: Run test to verify it fails**

Run: `npx playwright test e2e/smoke.spec.ts`
Expected: FAIL because Playwright is not configured.

**Step 3: Add Playwright config**

Create `playwright.config.ts`:
```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000" },
});
```

Modify `package.json` scripts:
```json
"test:e2e": "playwright test"
```

**Step 4: Run test to verify it passes**

Run: `npm run dev` (separate terminal)
Then: `npm run test:e2e -- e2e/smoke.spec.ts`
Expected: PASS

**Step 5: Commit**

Run: `git add . && git commit -m "test: add playwright smoke test"`

---

### Task 15: Documentation and cleanup

**Files:**
- Create: `README.md`
- Create: `docs/SETUP.md`

**Step 1: Write docs**

Create `README.md`:
```md
# PhotoReimagine.ai

MVP for AI photo editing with Kie.ai and Supabase.
```

Create `docs/SETUP.md`:
```md
# Local Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill Supabase and Kie.ai keys
3. Run `npm install`
4. Run `npm run dev`
```

**Step 2: Commit**

Run: `git add README.md docs/SETUP.md && git commit -m "docs: add setup guide"`

---

## Notes

- Replace mock auth and payment flows with real integrations once keys are available.
- After wiring real OAuth, add RBAC checks to admin routes.
- Add Supabase RLS policies for `projects`, `job_history`, and `payments` before production.
