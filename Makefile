# --- Variables --------------------------------------------------------------------------------------------------------
BACKEND_DIR = ./backend
FRONTEND_DIR = ./frontend
BACKEND_IMAGE = marketplace-backend:latest
FRONTEND_IMAGE = marketplace-frontend:latest


# --- Docker -----------------------------------------------------------------------------------------------------------
.PHONY: build rebuild build-backend build-frontend destroy destroy-backend destroy-frontend up stop down down-v logs

build: build-backend #build-frontend  # <--------------	uncomment when frontend/docker-compose.yml will be exist
destroy: destroy-backend #destroy-frontend  # <--------	same
rebuild: down destroy build

build-backend:
	docker build -t $(BACKEND_IMAGE) $(BACKEND_DIR)

build-frontend:
	docker build -t $(FRONTEND_IMAGE) $(FRONTEND_DIR)

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


# --- Django -----------------------------------------------------------------------------------------------------
.PHONY: migrations

migrations:
	cd $(BACKEND_DIR) && poetry run python manage.py makemigrations
migrate:
	cd $(BACKEND_DIR) && poetry run python manage.py migrate

# --- Code Linters -----------------------------------------------------------------------------------------------------
.PHONY: lint flake8

lint: flake8

flake8:
	@echo Starting flake8...
	cd $(BACKEND_DIR) && poetry run flake8 --toml-config=pyproject.toml .
	@echo All done! ✨ 🍰 ✨


# --- Code Formatters --------------------------------------------------------------------------------------------------
.PHONY: reformat isort black

reformat: isort black

isort:
	@echo Starting isort...
	cd $(BACKEND_DIR) && poetry run isort --settings=pyproject.toml .

black:
	@echo Starting black...
	cd $(BACKEND_DIR) && poetry run black --config=pyproject.toml .
