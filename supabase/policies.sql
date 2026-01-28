alter table profiles enable row level security;
alter table projects enable row level security;
alter table job_history enable row level security;
alter table payments enable row level security;
alter table products enable row level security;

create policy "Profiles are viewable by owner"
on profiles for select
using (auth.uid() = id);

create policy "Profiles can be updated by owner"
on profiles for update
using (auth.uid() = id);

create policy "Projects are scoped to owner"
on projects for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Jobs are scoped to owner"
on job_history for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Payments are viewable by owner"
on payments for select
using (auth.uid() = user_id);

create policy "Payments can be created by owner"
on payments for insert
with check (auth.uid() = user_id);

create policy "Products are public"
on products for select
using (true);
