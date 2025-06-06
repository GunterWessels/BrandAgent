-- Simple Supabase table creation
-- Run this directly in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS session_logs (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  user_name TEXT,
  user_industry TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  duration_ms INTEGER,
  error_count INTEGER DEFAULT 0,
  full_log_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_session_logs_session_id ON session_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_timestamp ON session_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_session_logs_user_industry ON session_logs(user_industry);

-- Enable Row Level Security (optional)
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts (adjust as needed for your security requirements)
CREATE POLICY "Allow inserts for session_logs" ON session_logs
  FOR INSERT WITH CHECK (true);

-- Create a policy to allow selects (adjust as needed)
CREATE POLICY "Allow selects for session_logs" ON session_logs
  FOR SELECT USING (true);
