# Variables
BACKEND_DIR = ./backend
FRONTEND_DIR = ./frontend
BACKEND_IMAGE = marketplace-backend:latest
FRONTEND_IMAGE = marketplace-frontend:latest

# Build the backend and frontend Docker images
.PHONY: build
build: build-backend #build-frontend  <-------------------- uncomment when frontend/docker-compose.yml will be exist

.PHONY: build-backend
build-backend:
	@echo "Building backend image..."
	docker build -t $(BACKEND_IMAGE) $(BACKEND_DIR)

.PHONY: build-frontend
build-frontend:
	@echo "Building frontend image..."
	docker build -t $(FRONTEND_IMAGE) $(FRONTEND_DIR)

# Start services using docker-compose
.PHONY: up
up:
	@echo "Starting services..."
	docker-compose up -d

# Stop the services
.PHONY: stop
stop:
	@echo "Stopping services..."
	docker-compose stop

# Down the services
.PHONY: down
down:
	@echo "Stopping services..."
	docker-compose down

# Rebuild the images and restart the primary services
.PHONY: rebuild
rebuild: down build up

# View logs
.PHONY: logs
logs:
	@echo "Viewing logs..."
	docker-compose logs -f
