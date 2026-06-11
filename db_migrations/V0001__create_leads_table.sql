CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  comment TEXT,
  source TEXT DEFAULT 'form',
  created_at TIMESTAMPTZ DEFAULT NOW()
);