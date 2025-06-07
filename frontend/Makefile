# --- Variables --------------------------------------------------------------------------------------------------------
include ../makefile.mk
include ../.env

export ENV_FILE ?= ../.env
export ENV_STATE ?= development

export DOCKERHUB_USERNAME ?= tvorchalavka
export PROJECT_NAME ?= tvorcha-lavka-frontend
export BASE_IMAGE_TAG ?= web-frontend

export DOCKER_NETWORK_NAME ?= tvorcha-network

export DOCKER_DIR ?= ./docker
export DOCKER_DEV_DIR ?= $(DOCKER_DIR)/development

export DOCKER_FILE_PATH ?= $(DOCKER_DIR)/Dockerfile

DOCKER_COMPOSE_BASE_FLAGS := \
	--env-file $(ENV_FILE) \
	-p $(PROJECT_NAME) \
	-f $(DOCKER_DIR)/docker-compose.yml

ifeq ($(ENV_STATE), development)
  DOCKER_IMAGE_TAG := $(DOCKERHUB_USERNAME)/$(BASE_IMAGE_TAG):develop

  DOCKER_COMPOSE_FLAGS := \
  	$(DOCKER_COMPOSE_BASE_FLAGS) \
	-f $(DOCKER_DEV_DIR)/docker-compose.dev.yml
else
  DOCKER_IMAGE_TAG := $(DOCKERHUB_USERNAME)/$(BASE_IMAGE_TAG):latest
  DOCKER_COMPOSE_FLAGS := $(DOCKER_COMPOSE_BASE_FLAGS)
endif


# --- Docker -----------------------------------------------------------------------------------------------------------
.PHONY: build rebuild destroy network pull-if-needed up stop down down-v logs

rebuild: down destroy build

build:
	$(call LOG_HEADER,build an image: $(DOCKER_IMAGE_TAG))
	@docker build \
	--target $(ENV_STATE) \
	--tag $(DOCKER_IMAGE_TAG) \
	--file $(DOCKER_FILE_PATH) .
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

pull-if-needed:
ifeq ($(call should_pull,frontend),true)
	@docker pull $(DOCKER_IMAGE_TAG)
endif

up: pull-if-needed network
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


# --- Code Linters -----------------------------------------------------------------------------------------------------
.PHONY: lint eslint

lint: eslint

eslint:
	$(call LOG_HEADER,eslint)
	npx eslint --config=.eslintrc.cjs --fix .
	@echo "All done! ✨ 🍰 ✨"

# --- Code Formatters --------------------------------------------------------------------------------------------------
.PHONY: reformat prettier

reformat: prettier

prettier:
	$(call LOG_HEADER,prettier)
	npx prettier --config=.prettierrc.cjs --write .
