# --- Variables --------------------------------------------------------------------------------------------------------
include .env
export MODE

MODE := $(MODE:"%"=%)
BACKEND_DIR = ./backend
FRONTEND_DIR = ./frontend
BACKEND_IMAGE = marketplace-backend:latest
FRONTEND_IMAGE = marketplace-frontend:latest


# --- Docker -----------------------------------------------------------------------------------------------------------
.PHONY: build rebuild build-backend build-frontend destroy destroy-backend destroy-frontend up stop down down-v logs

build: build-backend build-frontend
destroy: destroy-backend destroy-frontend
rebuild: down destroy build

build-backend:
	docker build --build-arg MODE=$(MODE) -t $(BACKEND_IMAGE) $(BACKEND_DIR)

build-frontend:
	docker build -t $(FRONTEND_IMAGE) $(FRONTEND_DIR) --target $(MODE)

destroy-backend:
	docker rmi -f $(BACKEND_IMAGE)

destroy-frontend:
	docker rmi -f $(FRONTEND_IMAGE)

up:
	docker compose up -d

stop:
	docker compose stop

down:
	docker compose down

down-v:
	docker compose down -v

logs:
	docker compose logs -f


# --- Django -----------------------------------------------------------------------------------------------------------
.PHONY: migrations create-superuser

migrations:
	cd $(BACKEND_DIR) && poetry run python manage.py makemigrations

migrate:
	docker compose run --rm backend python manage.py migrate

create-superuser: up
	docker exec -it backend python manage.py createsuperuser

# --- Code Linters -----------------------------------------------------------------------------------------------------
.PHONY: lint flake8 eslint

lint: flake8 eslint

flake8:
	@echo Starting flake8...
	cd $(BACKEND_DIR) && poetry run flake8 --toml-config=pyproject.toml . || true
	@echo "flake8 completed with errors, but continuing... ✨ 🍰 ✨"

eslint:
	@echo Starting eslint...
	cd $(FRONTEND_DIR) && npx eslint . --config .eslintrc.cjs || true
	@echo "eslint completed with errors, but continuing... ✨ 🍰 ✨"

# --- Code Formatters --------------------------------------------------------------------------------------------------
.PHONY: reformat isort black prettier

reformat: isort black prettier

isort:
	@echo Starting isort...
	cd $(BACKEND_DIR) && poetry run isort --settings=pyproject.toml . || true
	@echo "isort completed with errors, but continuing..."

black:
	@echo Starting black...
	cd $(BACKEND_DIR) && poetry run black --config=pyproject.toml . || true
	@echo "black completed with errors, but continuing..."

prettier:
	@echo Starting prettier...
	cd $(FRONTEND_DIR) && npx prettier --config .prettierrc.cjs --write . || true
	@echo "prettier completed with errors, but continuing..."

# --- Pytest -----------------------------------------------------------------------------------------------------------
.PHONY: pytest pytest-cov

pytest:
	@echo Starting pytest...
	docker compose run --rm backend pytest

pytest-cov:
	@echo Starting pytest with coverage...
	docker compose run --rm backend pytest --cov=. --cov-report=html
