#!/bin/sh
set -eu

create_database() {
  database_name="$1"

  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<EOSQL
SELECT format('CREATE DATABASE %I', '${database_name}')
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = '${database_name}'
)\gexec
GRANT ALL PRIVILEGES ON DATABASE "${database_name}" TO "${POSTGRES_USER}";
EOSQL
}

create_database "$POSTGRES_MEDUSA_DB"
create_database "$POSTGRES_STRAPI_DB"#!/bin/sh
set -eu

create_database() {
  db_name="$1"

  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<EOSQL
SELECT format('CREATE DATABASE %I', '${db_name}')
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = '${db_name}'
)\gexec

GRANT ALL PRIVILEGES ON DATABASE "${db_name}" TO "${POSTGRES_USER}";
EOSQL
}

create_database "$POSTGRES_MEDUSA_DB"
create_database "$POSTGRES_STRAPI_DB"