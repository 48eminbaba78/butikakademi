-- Google Calendar entegrasyonu için gerekli kolonlar

ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS google_calendar_connected BOOLEAN DEFAULT FALSE;

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS google_event_id TEXT;
