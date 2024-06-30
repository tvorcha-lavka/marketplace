# --- Variables --------------------------------------------------------------------------------------------------------
BACKEND_DIR = ./backend
FRONTEND_DIR = ./frontend
BACKEND_IMAGE = marketplace-backend:latest
FRONTEND_IMAGE = marketplace-frontend:latest


# --- Docker -----------------------------------------------------------------------------------------------------------
.PHONY: build
build: build-backend #build-frontend  <-- uncomment when frontend/docker-compose.yml will be exist

.PHONY: rebuild
rebuild: down build up

.PHONY: build-backend
build-backend:
	docker build -t $(BACKEND_IMAGE) $(BACKEND_DIR)

.PHONY: build-frontend
build-frontend:
	docker build -t $(FRONTEND_IMAGE) $(FRONTEND_DIR)

.PHONY: up
up:
	docker compose up -d

.PHONY: stop
stop:
	docker compose stop

.PHONY: down
down:
	docker compose down

.PHONY: logs
logs:
	docker compose logs -f


# --- Code Linters -----------------------------------------------------------------------------------------------------
.PHONY: lint
lint: flake8

.PHONY: flake8
flake8:
	@echo Starting flake8...
	cd $(BACKEND_DIR) && poetry run flake8 --toml-config=pyproject.toml .
	@echo All done! ✨ 🍰 ✨


# --- Code Formatters --------------------------------------------------------------------------------------------------
.PHONY: reformat
reformat: isort black

.PHONY: isort
isort:
	@echo Starting isort...
	cd $(BACKEND_DIR) && poetry run isort --settings=pyproject.toml .

.PHONY: black
black:
	@echo Starting black...
	cd $(BACKEND_DIR) && poetry run black --config=pyproject.toml .
