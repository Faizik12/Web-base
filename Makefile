check: lint test

install:
	poetry install

lint:
	poetry run flake8 app

test:
	poetry run pytest

dev:
	poetry run flask --app app --debug run

PORT ?= 8000
start:
	poetry run gunicorn app:app --bind 0.0.0.0:$(PORT) --workers 4

.PHONY: check install lint test dev start