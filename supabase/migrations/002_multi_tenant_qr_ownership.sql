alter table qr_codes
  add column owner_id uuid references auth.users(id) default auth.uid();

create index qr_codes_owner_id_idx on qr_codes(owner_id);

drop policy "authenticated admins manage qr codes" on qr_codes;
drop policy "authenticated admins read scan events" on scan_events;
drop policy "authenticated admins insert scan events" on scan_events;

create policy "users manage their own qr codes"
  on qr_codes for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "users read scans for their qr codes"
  on scan_events for select to authenticated
  using (
    exists (
      select 1
      from qr_codes
      where qr_codes.id = scan_events.qr_code_id
        and qr_codes.owner_id = auth.uid()
    )
  );

create policy "users insert scans for their qr codes"
  on scan_events for insert to authenticated
  with check (
    exists (
      select 1
      from qr_codes
      where qr_codes.id = scan_events.qr_code_id
        and qr_codes.owner_id = auth.uid()
    )
  );
