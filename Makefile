check: lint test

lint:
	poetry run flake8 backend

test:
	poetry run pytest

install:
	poetry install

migrate:
	poetry run alembic upgrade head

dev: migrate
	poetry run flask --app backend --debug run

PORT ?= 8000
start: migrate
	poetry run gunicorn backend:app --bind 0.0.0.0:$(PORT) --workers 4

.PHONY: check lint test install migrate dev start