-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text not null,
  latitude float,
  longitude float,
  category text not null,
  date timestamp with time zone not null,
  max_participants int default 100,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create event_participants table to track who joined events
create table if not exists public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamp with time zone default now(),
  unique(event_id, user_id)
);

-- Create saved_events table for bookmarks/favorites
create table if not exists public.saved_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  saved_at timestamp with time zone default now(),
  unique(event_id, user_id)
);

-- Enable row level security
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.saved_events enable row level security;

-- Profiles policies
create policy "Allow users to view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Allow users to update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Events policies - allow public read, authenticated write
create policy "Allow anyone to view events"
  on public.events for select
  using (true);

create policy "Allow authenticated users to create events"
  on public.events for insert
  with check (auth.uid() = created_by);

create policy "Allow users to update their own events"
  on public.events for update
  using (auth.uid() = created_by);

create policy "Allow users to delete their own events"
  on public.events for delete
  using (auth.uid() = created_by);

-- Event participants policies
create policy "Allow anyone to view event participants"
  on public.event_participants for select
  using (true);

create policy "Allow users to join events"
  on public.event_participants for insert
  with check (auth.uid() = user_id);

create policy "Allow users to leave events"
  on public.event_participants for delete
  using (auth.uid() = user_id);

-- Saved events policies
create policy "Allow users to view their saved events"
  on public.saved_events for select
  using (auth.uid() = user_id);

create policy "Allow users to save events"
  on public.saved_events for insert
  with check (auth.uid() = user_id);

create policy "Allow users to unsave events"
  on public.saved_events for delete
  using (auth.uid() = user_id);
