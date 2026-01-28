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
