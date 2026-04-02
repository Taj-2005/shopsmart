#!/bin/sh
set -e
# Run migrations on every startup — safe because Django migrations are idempotent.
# This also creates the `notes` table the first time.
python manage.py migrate --noinput
exec python manage.py runserver 0.0.0.0:8001
