-- Run as POSTGRES_USER (artwater)
CREATE DATABASE artwater_medusa;
CREATE DATABASE artwater_strapi;

-- Ensure full ownership for the artwater user
GRANT ALL PRIVILEGES ON DATABASE artwater_medusa TO artwater;
GRANT ALL PRIVILEGES ON DATABASE artwater_strapi TO artwater;
