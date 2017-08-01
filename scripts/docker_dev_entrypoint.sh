#!/bin/sh -e

cd "$(dirname "$0")"

cd ..

python manage.py migrate --settings zds.settings_docker_dev
python manage.py runserver 0.0.0.0:8000 --settings zds.settings_docker_dev
