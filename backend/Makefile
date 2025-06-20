# --- Variables --------------------------------------------------------------------------------------------------------
include ../makefile.mk
include ../.env

export ENV_FILE ?= ../.env
export ENV_STATE ?= development

export DOCKERHUB_USERNAME ?= tvorchalavka
export PROJECT_NAME ?= tvorcha-lavka-backend
export BASE_IMAGE_TAG ?= web-backend

export DOCKER_NETWORK_NAME ?= tvorcha-network
export DOCKER_VOLUME_NAME ?= tvorcha-efs

export DOCKER_DIR ?= ./docker
export DOCKER_DEV_DIR ?= $(DOCKER_DIR)/development

export DOCKER_VOLUME_PATH ?= /mnt/efs
export DOCKER_FILE_PATH ?= $(DOCKER_DIR)/Dockerfile

DOCKER_COMPOSE_BASE_FLAGS := \
	--env-file $(ENV_FILE) \
	-p $(PROJECT_NAME) \
	-f $(DOCKER_DIR)/docker-compose.yml \
	-f $(DOCKER_DIR)/docker-compose.redis.yml \
	-f $(DOCKER_DIR)/docker-compose.rabbitmq.yml \
	-f $(DOCKER_DIR)/docker-compose.celery.yml \
	-f $(DOCKER_DIR)/docker-compose.elasticsearch.yml

DOCKER_COMPOSE_TESTING_FLAGS := \
	--env-file $(ENV_FILE) \
	-p $(PROJECT_NAME)-test \
	-f $(DOCKER_DEV_DIR)/docker-compose.test.yml

ifeq ($(ENV_STATE), development)
  POETRY_FLAGS := "--only main,debug,test"

  DOCKER_IMAGE_TAG := $(DOCKERHUB_USERNAME)/$(BASE_IMAGE_TAG):develop
  DOCKER_COMPOSE_FLAGS := \
  	$(DOCKER_COMPOSE_BASE_FLAGS) \
	-f $(DOCKER_DEV_DIR)/docker-compose.dev.yml \
	-f $(DOCKER_DEV_DIR)/docker-compose.celery.dev.yml \
	-f $(DOCKER_DEV_DIR)/docker-compose.elasticsearch.dev.yml

  DOCKER_VOLUME := $(DOCKER_VOLUME_NAME)
else
  DOCKER_IMAGE_TAG := $(DOCKERHUB_USERNAME)/$(BASE_IMAGE_TAG):latest
  POETRY_FLAGS := "--only main"

  DOCKER_COMPOSE_FLAGS := $(DOCKER_COMPOSE_BASE_FLAGS)

  DOCKER_VOLUME := $(DOCKER_VOLUME_NAME) \
    --opt device=$(DOCKER_VOLUME_PATH) \
    --opt type=none \
    --opt o=bind \
    --driver local
endif


# --- Docker -----------------------------------------------------------------------------------------------------------
.PHONY: generate-compose build rebuild destroy network volume pull-if-needed up stop down down-v logs

define make_compose
	@echo Generating: $(1).yml
	@poetry run jinja2 $(DOCKER_DIR)/templates/$(1).j2 > \
	$(if $(findstring .dev,$(1)),$(DOCKER_DEV_DIR),$(DOCKER_DIR))/$(1).yml
endef

generate-compose:
	$(call LOG_HEADER,generate compose files)
	$(call make_compose,docker-compose.celery)
	$(call make_compose,docker-compose.celery.dev)
	$(call LOG_HEADER,generation complete!)

rebuild: down destroy build

build:
	$(call LOG_HEADER,build an image: $(DOCKER_IMAGE_TAG))
	@docker build \
	--target base \
	--tag $(DOCKER_IMAGE_TAG) \
	--file $(DOCKER_FILE_PATH) \
	--build-arg POETRY_FLAGS=$(POETRY_FLAGS) .
	$(call LOG_HEADER,the image $(DOCKER_IMAGE_TAG) has been created!)

destroy:
	@docker rmi -f $(DOCKER_IMAGE_TAG) $(DEV_NULL)
	$(call LOG_HEADER,image $(DOCKER_IMAGE_TAG) has been destroyed!)

network:
	@docker network inspect $(DOCKER_NETWORK_NAME) $(DEV_NULL) || ( \
		echo Creating network: $(DOCKER_NETWORK_NAME) && \
		docker network create --driver bridge $(DOCKER_NETWORK_NAME) $(DEV_NULL) && \
		echo Network has been created! \
	)

volume:
	@docker volume inspect $(DOCKER_VOLUME_NAME) $(DEV_NULL) || ( \
		echo Mount volume: $(DOCKER_VOLUME_NAME) && \
		docker volume create $(DOCKER_VOLUME) $(DEV_NULL) && \
		echo Volume has been mounted! \
	)

pull-if-needed:
ifeq ($(call should_pull,backend),true)
	@docker pull $(DOCKER_IMAGE_TAG)
endif

up: pull-if-needed network volume
	$(call LOG_HEADER,starting $(BASE_IMAGE_TAG) [$(ENV_STATE)])
	@docker compose $(DOCKER_COMPOSE_FLAGS) up -d
	$(call LOG_HEADER,$(BASE_IMAGE_TAG) has been started!)

stop:
	$(call LOG_HEADER,stopping $(BASE_IMAGE_TAG))
	@docker compose $(DOCKER_COMPOSE_FLAGS) stop
	$(call LOG_HEADER,$(BASE_IMAGE_TAG) has been stopped!)

down:
	$(call LOG_HEADER,shutting down $(BASE_IMAGE_TAG))
	@docker compose $(DOCKER_COMPOSE_FLAGS) down $(DEV_NULL)
	$(call LOG_HEADER,$(BASE_IMAGE_TAG) has been shut down!)

down-v:
	$(call LOG_HEADER,shutting down $(BASE_IMAGE_TAG) and removing volumes)
	@docker compose $(DOCKER_COMPOSE_FLAGS) down -v $(DEV_NULL)
	$(call LOG_HEADER,$(BASE_IMAGE_TAG) has been shut down!)

logs:
	$(call LOG_HEADER,$(BASE_IMAGE_TAG) logs)
	@docker compose $(DOCKER_COMPOSE_FLAGS) logs -f


# --- Django -----------------------------------------------------------------------------------------------------------
.PHONY: migrations migrate downgrade migrate-categories create-superuser

migrations:
	poetry run python src/manage.py makemigrations

migrate:
	@docker compose $(DOCKER_COMPOSE_FLAGS) run --rm $(BASE_IMAGE_TAG) \
	python manage.py migrate

migrate-categories:
	@docker compose $(DOCKER_COMPOSE_FLAGS) run --rm $(BASE_IMAGE_TAG) \
	python manage.py migrate_categories

downgrade:
	@docker compose $(DOCKER_COMPOSE_FLAGS) run --rm $(BASE_IMAGE_TAG) \
	python manage.py migrate $(word 2, $(MAKECMDGOALS)) $(word 3, $(MAKECMDGOALS))

%:  # Dummy rule to avoid 'No rule to make target' when passing extra args
	@:

create-superuser:
	@docker compose $(DOCKER_COMPOSE_FLAGS) run --rm $(BASE_IMAGE_TAG) \
	python manage.py createsuperuser

# --- Code Linters -----------------------------------------------------------------------------------------------------
.PHONY: lint flake8

lint: flake8

flake8:
	$(call LOG_HEADER,flake8)
	@poetry run flake8 --toml-config=pyproject.toml .
	@echo All done! ✨ 🍰 ✨

# --- Code Formatters --------------------------------------------------------------------------------------------------
.PHONY: reformat isort black

reformat: isort black

isort:
	$(call LOG_HEADER,isort)
	@poetry run isort --settings=pyproject.toml .

black:
	$(call LOG_HEADER,black)
	@poetry run black --config=pyproject.toml .

# --- Type Checking ----------------------------------------------------------------------------------------------------
.PHONY: mypy

mypy:
	$(call LOG_HEADER,mypy)
	@poetry run mypy --config-file=pyproject.toml .

# --- Pytest -----------------------------------------------------------------------------------------------------------
.PHONY: pytest pytest-cov

pytest:
	$(call LOG_HEADER,pytest)
	@docker compose $(DOCKER_COMPOSE_TESTING_FLAGS) run \
		--rm test-runner python /scripts/entrypoint.py --pytest
	@docker compose $(DOCKER_COMPOSE_TESTING_FLAGS) down -v

pytest-cov:
	$(call LOG_HEADER,pytest with coverage)
	@docker compose $(DOCKER_COMPOSE_TESTING_FLAGS) run \
		--rm test-runner python /scripts/entrypoint.py --pytest-cov
	@docker compose $(DOCKER_COMPOSE_TESTING_FLAGS) down -v


# --- Code Checking ----------------------------------------------------------------------------------------------------
.PHONY: check

check:
	@make -s reformat lint mypy pytest
