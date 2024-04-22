#!/bin/bash

set -e

# Wait for the database to be ready
until PGPASSWORD=$DATABASE_PASSWORD psql -h db -U $DATABASE_USERNAME -p $DATABASE_PORT -c '\l'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

# Create the database
PGPASSWORD=$DATABASE_PASSWORD psql -h db -U $DATABASE_USERNAME -p $DATABASE_PORT -c "CREATE DATABASE $DATABASE_NAME"
