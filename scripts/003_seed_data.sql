-- Seed sample events (only if profiles exist)
-- This will be populated with user data after authentication is set up
insert into public.events (
  title,
  description,
  location,
  latitude,
  longitude,
  category,
  date,
  max_participants,
  created_by
) values
(
  'Web Development Meetup',
  'Join us for an evening of web development talks and networking.',
  'San Francisco, CA',
  37.7749,
  -122.4194,
  'Technology',
  now() + interval '7 days',
  50,
  (select id from auth.users limit 1)
),
(
  'React Workshop',
  'Learn advanced React patterns and best practices.',
  'San Francisco, CA',
  37.7749,
  -122.4194,
  'Technology',
  now() + interval '14 days',
  30,
  (select id from auth.users limit 1)
)
on conflict do nothing;
