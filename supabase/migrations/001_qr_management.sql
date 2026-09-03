create type qr_status as enum ('unassigned', 'active', 'disabled');

create table qr_codes (
  id uuid primary key default gen_random_uuid(), short_code text unique not null,
  business_name text, target_url text, status qr_status not null default 'unassigned',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index qr_codes_short_code_idx on qr_codes(short_code);

create table scan_events (
  id uuid primary key default gen_random_uuid(), qr_code_id uuid not null references qr_codes(id) on delete cascade,
  scanned_at timestamptz not null default now(), user_agent text, referrer text
);
create index scan_events_qr_code_id_idx on scan_events(qr_code_id);
create index scan_events_scanned_at_idx on scan_events(scanned_at);

create or replace function set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger qr_codes_updated_at before update on qr_codes for each row execute function set_updated_at();

alter table qr_codes enable row level security;
alter table scan_events enable row level security;
create policy "authenticated admins manage qr codes" on qr_codes for all to authenticated using (true) with check (true);
create policy "authenticated admins read scan events" on scan_events for select to authenticated using (true);
create policy "authenticated admins insert scan events" on scan_events for insert to authenticated with check (true);
