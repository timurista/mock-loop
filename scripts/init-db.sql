-- Initialize the MockLoop database with required extensions and basic setup

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create database schema
CREATE SCHEMA IF NOT EXISTS mockloop;

-- Set search path
SET search_path TO mockloop, public;

-- Grant permissions
GRANT ALL ON SCHEMA mockloop TO mockloop;
GRANT ALL ON ALL TABLES IN SCHEMA mockloop TO mockloop;
GRANT ALL ON ALL SEQUENCES IN SCHEMA mockloop TO mockloop;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA mockloop TO mockloop;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA mockloop GRANT ALL ON TABLES TO mockloop;
ALTER DEFAULT PRIVILEGES IN SCHEMA mockloop GRANT ALL ON SEQUENCES TO mockloop;
ALTER DEFAULT PRIVILEGES IN SCHEMA mockloop GRANT ALL ON FUNCTIONS TO mockloop;