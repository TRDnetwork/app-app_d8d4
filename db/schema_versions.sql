-- UP
-- Tracking schema version for migration system (placeholder)

CREATE TABLE IF NOT EXISTS schema_versions (
  version INTEGER PRIMARY KEY,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT
);

-- Insert initial version
INSERT INTO schema_versions (version, description) VALUES
(1, 'Initial schema')
ON CONFLICT (version) DO NOTHING;

-- DOWN
DROP TABLE IF EXISTS schema_versions;