-- Create waitlist table
create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone not null default now()
);

-- Add index on email for faster lookups
create index if not exists waitlist_email_idx on public.waitlist (email);

-- Add index on created_at for sorting
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Create policy to allow inserts from anyone (for the waitlist form)
-- Only allows inserting email and created_at, nothing else
create policy "Allow public inserts"
  on public.waitlist
  for insert
  to public
  with check (
    email is not null 
    and length(email) > 0 
    and length(email) <= 255
  );

-- Create policy to allow service role to read all entries
create policy "Allow authenticated reads"
  on public.waitlist
  for select
  to authenticated
  using (true);

