# --- Variables --------------------------------------------------------------------------------------------------------
include .env
export MODE

MODE := $(MODE:"%"=%)
BACKEND_DIR = ./backend
FRONTEND_DIR = ./frontend
BACKEND_IMAGE = marketplace-backend:latest
FRONTEND_IMAGE = marketplace-frontend:latest
TEST_COMPOSE_FILE = $(BACKEND_DIR)/docker-compose.test.yml


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
.PHONY: lint-b flake8 lint-f eslint

lint-b: flake8 
lint-f: eslint

flake8:
	@echo Starting flake8...
	cd $(BACKEND_DIR) && poetry run flake8 --toml-config=pyproject.toml .
	@echo All done! ✨ 🍰 ✨

eslint:
	@echo Starting eslint...
	cd $(FRONTEND_DIR) && npx eslint --config=.eslintrc.cjs --fix .
	@echo All done! ✨ 🍰 ✨

# --- Code Formatters --------------------------------------------------------------------------------------------------
.PHONY: reformat-b isort black reformat-f prettier

reformat-b: isort black 
reformat-f: prettier

isort:
	@echo Starting isort...
	cd $(BACKEND_DIR) && poetry run isort --settings=pyproject.toml .

black:
	@echo Starting black...
	cd $(BACKEND_DIR) && poetry run black --config=pyproject.toml .

prettier:
	@echo Starting prettier...
	cd $(FRONTEND_DIR) && npx prettier --config=.prettierrc.cjs --write .

# --- Pytest -----------------------------------------------------------------------------------------------------------
.PHONY: pytest pytest-cov

pytest:
	@echo Starting pytest...
	docker compose -f $(TEST_COMPOSE_FILE) run --rm backend pytest
	docker compose -f $(TEST_COMPOSE_FILE) down -v

pytest-cov:
	@echo Starting pytest with coverage...
	docker compose -f $(TEST_COMPOSE_FILE) run --rm backend pytest --cov=. --cov-report=html
	docker compose -f $(TEST_COMPOSE_FILE) down -v
