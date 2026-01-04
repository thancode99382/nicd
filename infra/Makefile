# ================================
# NICD Infrastructure - Makefile
# ================================

.PHONY: help build dev prod stop restart logs clean db-shell app-shell test lint format

# Default target
.DEFAULT_GOAL := help

# Docker Hub Configuration
DOCKER_USER ?= nicd010603
SERVER_IMAGE ?= nicd-server
CLIENT_IMAGE ?= nicd-client
VERSION ?= latest

# Path Configuration
SERVER_DIR := ../nicd-server
CLIENT_DIR := ../nicd-client
ENV_LOCAL := .env.local
ENV_PROD := .env.production

# Colors for terminal output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# ================================
# Help
# ================================
help: ## Show this help message
	@echo ""
	@echo "$(CYAN)NICD Server - Available Commands$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ================================
# Development
# ================================
dev: ## Start development environment with hot reload
	@echo "$(CYAN)Starting development environment...$(RESET)"
	docker compose -f docker-compose.dev.yml --env-file $(ENV_LOCAL) up --build

dev-d: ## Start development environment in detached mode
	@echo "$(CYAN)Starting development environment (detached)...$(RESET)"
	docker compose -f docker-compose.dev.yml --env-file $(ENV_LOCAL) up --build -d

dev-down: ## Stop development environment
	@echo "$(YELLOW)Stopping development environment...$(RESET)"
	docker compose -f docker-compose.dev.yml down

# ================================
# Production
# ================================
prod: ## Start production environment
	@echo "$(CYAN)Starting production environment...$(RESET)"
	docker compose --env-file $(ENV_PROD) up --build -d

prod-down: ## Stop production environment
	@echo "$(YELLOW)Stopping production environment...$(RESET)"
	docker compose down

# ================================
# Build
# ================================
build: ## Build production Docker image
	@echo "$(CYAN)Building production image...$(RESET)"
	docker compose build

build-dev: ## Build development Docker image
	@echo "$(CYAN)Building development image...$(RESET)"
	docker compose -f docker-compose.dev.yml build

build-no-cache: ## Build production image without cache
	@echo "$(CYAN)Building production image (no cache)...$(RESET)"
	docker compose build --no-cache

# ================================
# Docker Hub
# ================================
docker-login: ## Login to Docker Hub
	@echo "$(CYAN)Logging in to Docker Hub...$(RESET)"
	docker login

# --- Server Image ---
docker-build-server: ## Build server image for Docker Hub
	@echo "$(CYAN)Building server image: $(DOCKER_USER)/$(SERVER_IMAGE):$(VERSION)$(RESET)"
	docker build -t $(DOCKER_USER)/$(SERVER_IMAGE):$(VERSION) -t $(DOCKER_USER)/$(SERVER_IMAGE):latest -f server/Dockerfile $(SERVER_DIR)

docker-push-server: ## Push server image to Docker Hub
	@echo "$(CYAN)Pushing server image to Docker Hub...$(RESET)"
	docker push $(DOCKER_USER)/$(SERVER_IMAGE):$(VERSION)
	docker push $(DOCKER_USER)/$(SERVER_IMAGE):latest
	@echo "$(GREEN)Server image pushed: $(DOCKER_USER)/$(SERVER_IMAGE):$(VERSION)$(RESET)"

# --- Client Image ---
docker-build-client: ## Build client image for Docker Hub
	@echo "$(CYAN)Building client image: $(DOCKER_USER)/$(CLIENT_IMAGE):$(VERSION)$(RESET)"
	docker build -t $(DOCKER_USER)/$(CLIENT_IMAGE):$(VERSION) -t $(DOCKER_USER)/$(CLIENT_IMAGE):latest -f client/Dockerfile $(CLIENT_DIR)

docker-push-client: ## Push client image to Docker Hub
	@echo "$(CYAN)Pushing client image to Docker Hub...$(RESET)"
	docker push $(DOCKER_USER)/$(CLIENT_IMAGE):$(VERSION)
	docker push $(DOCKER_USER)/$(CLIENT_IMAGE):latest
	@echo "$(GREEN)Client image pushed: $(DOCKER_USER)/$(CLIENT_IMAGE):$(VERSION)$(RESET)"

# --- All Images ---
docker-build-all: docker-build-server docker-build-client ## Build all images for Docker Hub
	@echo "$(GREEN)All images built$(RESET)"

docker-push-all: docker-push-server docker-push-client ## Push all images to Docker Hub
	@echo "$(GREEN)All images pushed$(RESET)"

docker-release: docker-build-all docker-push-all ## Build and push all images to Docker Hub
	@echo "$(GREEN)Release complete!$(RESET)"
	@echo "  Server: $(DOCKER_USER)/$(SERVER_IMAGE):$(VERSION)"
	@echo "  Client: $(DOCKER_USER)/$(CLIENT_IMAGE):$(VERSION)"

docker-pull-server: ## Pull server image from Docker Hub
	@echo "$(CYAN)Pulling server image from Docker Hub...$(RESET)"
	docker pull $(DOCKER_USER)/$(SERVER_IMAGE):$(VERSION)

docker-pull-client: ## Pull client image from Docker Hub
	@echo "$(CYAN)Pulling client image from Docker Hub...$(RESET)"
	docker pull $(DOCKER_USER)/$(CLIENT_IMAGE):$(VERSION)

docker-pull-all: docker-pull-server docker-pull-client ## Pull all images from Docker Hub
	@echo "$(GREEN)All images pulled$(RESET)"

docker-tag-server: ## Tag server image with specific version (usage: make docker-tag-server VERSION=1.0.0)
	@echo "$(CYAN)Tagging server image: $(DOCKER_USER)/$(SERVER_IMAGE):$(VERSION)$(RESET)"
	docker tag $(DOCKER_USER)/$(SERVER_IMAGE):latest $(DOCKER_USER)/$(SERVER_IMAGE):$(VERSION)

docker-tag-client: ## Tag client image with specific version (usage: make docker-tag-client VERSION=1.0.0)
	@echo "$(CYAN)Tagging client image: $(DOCKER_USER)/$(CLIENT_IMAGE):$(VERSION)$(RESET)"
	docker tag $(DOCKER_USER)/$(CLIENT_IMAGE):latest $(DOCKER_USER)/$(CLIENT_IMAGE):$(VERSION)

# ================================
# Logs
# ================================
logs: ## View logs from all containers
	docker compose logs -f

logs-nginx: ## View logs from nginx container only
	docker compose logs -f nginx

logs-app: ## View logs from app container only
	docker compose logs -f app

logs-client: ## View logs from client container only
	docker compose logs -f client

logs-db: ## View logs from database container only
	docker compose logs -f postgres

# ================================
# Shell Access
# ================================
nginx-shell: ## Access nginx container shell
	@echo "$(CYAN)Accessing nginx container...$(RESET)"
	docker compose exec nginx sh

app-shell: ## Access app container shell
	@echo "$(CYAN)Accessing app container...$(RESET)"
	docker compose exec app sh

client-shell: ## Access client container shell
	@echo "$(CYAN)Accessing client container...$(RESET)"
	docker compose exec client sh

# ================================
# Nginx
# ================================
nginx-reload: ## Reload nginx configuration
	@echo "$(CYAN)Reloading nginx configuration...$(RESET)"
	docker compose exec nginx nginx -s reload

nginx-test: ## Test nginx configuration
	@echo "$(CYAN)Testing nginx configuration...$(RESET)"
	docker compose exec nginx nginx -t

db-shell: ## Access PostgreSQL shell
	@echo "$(CYAN)Accessing PostgreSQL shell...$(RESET)"
	docker compose exec postgres psql -U $${DB_USER:-postgres} -d $${DB_NAME:-nicd}

# ================================
# Database
# ================================
db-up: ## Start only the database
	@echo "$(CYAN)Starting PostgreSQL...$(RESET)"
	docker compose up postgres -d

db-down: ## Stop the database
	@echo "$(YELLOW)Stopping PostgreSQL...$(RESET)"
	docker compose stop postgres

db-reset: ## Reset database (WARNING: destroys all data)
	@echo "$(RED)WARNING: This will destroy all database data!$(RESET)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	docker compose down -v
	docker volume rm nicd-server_postgres_data 2>/dev/null || true
	docker volume rm nicd-server_postgres_data_dev 2>/dev/null || true
	@echo "$(GREEN)Database reset complete$(RESET)"

# ================================
# Cleanup
# ================================
clean: ## Remove all containers, images, and volumes
	@echo "$(RED)Cleaning up Docker resources...$(RESET)"
	docker compose -f docker-compose.dev.yml down -v --rmi local 2>/dev/null || true
	docker compose down -v --rmi local 2>/dev/null || true
	@echo "$(GREEN)Cleanup complete$(RESET)"

prune: ## Remove unused Docker resources (system-wide)
	@echo "$(RED)Pruning unused Docker resources...$(RESET)"
	docker system prune -f
	docker volume prune -f
	@echo "$(GREEN)Prune complete$(RESET)"

# ================================
# Local Development (without Docker)
# ================================
install: ## Install dependencies locally (server)
	@echo "$(CYAN)Installing server dependencies...$(RESET)"
	cd $(SERVER_DIR) && pnpm install

install-client: ## Install dependencies locally (client)
	@echo "$(CYAN)Installing client dependencies...$(RESET)"
	cd $(CLIENT_DIR) && pnpm install

install-all: install install-client ## Install all dependencies locally
	@echo "$(GREEN)All dependencies installed$(RESET)"

start: ## Start server locally (requires local PostgreSQL)
	@echo "$(CYAN)Starting server locally...$(RESET)"
	cd $(SERVER_DIR) && pnpm start:dev

start-client: ## Start client locally
	@echo "$(CYAN)Starting client locally...$(RESET)"
	cd $(CLIENT_DIR) && pnpm dev

build-local: ## Build server locally
	@echo "$(CYAN)Building server locally...$(RESET)"
	cd $(SERVER_DIR) && pnpm build

build-client: ## Build client locally
	@echo "$(CYAN)Building client locally...$(RESET)"
	cd $(CLIENT_DIR) && pnpm build

# ================================
# Testing & Quality
# ================================
test: ## Run tests
	@echo "$(CYAN)Running tests...$(RESET)"
	cd $(SERVER_DIR) && pnpm test

test-cov: ## Run tests with coverage
	@echo "$(CYAN)Running tests with coverage...$(RESET)"
	cd $(SERVER_DIR) && pnpm test:cov

test-e2e: ## Run e2e tests
	@echo "$(CYAN)Running e2e tests...$(RESET)"
	cd $(SERVER_DIR) && pnpm test:e2e

lint: ## Run linter
	@echo "$(CYAN)Running linter...$(RESET)"
	cd $(SERVER_DIR) && pnpm lint

format: ## Format code
	@echo "$(CYAN)Formatting code...$(RESET)"
	cd $(SERVER_DIR) && pnpm format

# ================================
# Status
# ================================
status: ## Show status of containers
	@echo "$(CYAN)Container Status:$(RESET)"
	docker compose ps

ps: status ## Alias for status
