-- Create the session_logs table in Supabase
CREATE TABLE IF NOT EXISTS session_logs (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_name TEXT,
  user_industry TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  duration_ms INTEGER,
  error_count INTEGER DEFAULT 0,
  warning_count INTEGER DEFAULT 0,
  api_calls_count INTEGER DEFAULT 0,
  button_clicks_count INTEGER DEFAULT 0,
  page_views_count INTEGER DEFAULT 0,
  recommendations_count INTEGER DEFAULT 0,
  exported_documents_count INTEGER DEFAULT 0,
  full_log_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_session_logs_session_id ON session_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_timestamp ON session_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_session_logs_user_industry ON session_logs(user_industry);

-- Create a function to create the table (for the RPC call)
CREATE OR REPLACE FUNCTION create_session_logs_table_if_not_exists()
RETURNS TEXT AS $$
BEGIN
  -- This function is just a placeholder since we're creating the table above
  RETURN 'Table creation handled by migration';
END;
$$ LANGUAGE plpgsql;
