# ================================
# NICD Server - Makefile
# ================================

.PHONY: help build dev prod stop restart logs clean db-shell app-shell test lint format

# Default target
.DEFAULT_GOAL := help

# Docker Hub Configuration
DOCKER_USER ?= nicd010603
IMAGE_NAME ?= nicd-server
VERSION ?= latest

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
	docker compose -f docker-compose.dev.yml --env-file .env.local up --build

dev-d: ## Start development environment in detached mode
	@echo "$(CYAN)Starting development environment (detached)...$(RESET)"
	docker compose -f docker-compose.dev.yml --env-file .env.local up --build -d

dev-down: ## Stop development environment
	@echo "$(YELLOW)Stopping development environment...$(RESET)"
	docker compose -f docker-compose.dev.yml down

# ================================
# Production
# ================================
prod: ## Start production environment
	@echo "$(CYAN)Starting production environment...$(RESET)"
	docker compose up --build -d

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

docker-build: ## Build image for Docker Hub
	@echo "$(CYAN)Building image: $(DOCKER_USER)/$(IMAGE_NAME):$(VERSION)$(RESET)"
	docker build -t $(DOCKER_USER)/$(IMAGE_NAME):$(VERSION) -t $(DOCKER_USER)/$(IMAGE_NAME):latest .

docker-push: ## Push image to Docker Hub
	@echo "$(CYAN)Pushing image to Docker Hub...$(RESET)"
	docker push $(DOCKER_USER)/$(IMAGE_NAME):$(VERSION)
	docker push $(DOCKER_USER)/$(IMAGE_NAME):latest
	@echo "$(GREEN)Image pushed: $(DOCKER_USER)/$(IMAGE_NAME):$(VERSION)$(RESET)"

docker-pull: ## Pull image from Docker Hub
	@echo "$(CYAN)Pulling image from Docker Hub...$(RESET)"
	docker pull $(DOCKER_USER)/$(IMAGE_NAME):$(VERSION)

docker-release: docker-build docker-push ## Build and push to Docker Hub
	@echo "$(GREEN)Release complete: $(DOCKER_USER)/$(IMAGE_NAME):$(VERSION)$(RESET)"

docker-tag: ## Tag image with specific version (usage: make docker-tag VERSION=1.0.0)
	@echo "$(CYAN)Tagging image: $(DOCKER_USER)/$(IMAGE_NAME):$(VERSION)$(RESET)"
	docker tag $(DOCKER_USER)/$(IMAGE_NAME):latest $(DOCKER_USER)/$(IMAGE_NAME):$(VERSION)

# ================================
# Logs
# ================================
logs: ## View logs from all containers
	docker compose logs -f

logs-app: ## View logs from app container only
	docker compose logs -f app

logs-db: ## View logs from database container only
	docker compose logs -f postgres

# ================================
# Shell Access
# ================================
app-shell: ## Access app container shell
	@echo "$(CYAN)Accessing app container...$(RESET)"
	docker compose exec app sh

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
install: ## Install dependencies locally
	@echo "$(CYAN)Installing dependencies...$(RESET)"
	pnpm install

start: ## Start app locally (requires local PostgreSQL)
	@echo "$(CYAN)Starting app locally...$(RESET)"
	pnpm start:dev

build-local: ## Build app locally
	@echo "$(CYAN)Building app locally...$(RESET)"
	pnpm build

# ================================
# Testing & Quality
# ================================
test: ## Run tests
	@echo "$(CYAN)Running tests...$(RESET)"
	pnpm test

test-cov: ## Run tests with coverage
	@echo "$(CYAN)Running tests with coverage...$(RESET)"
	pnpm test:cov

test-e2e: ## Run e2e tests
	@echo "$(CYAN)Running e2e tests...$(RESET)"
	pnpm test:e2e

lint: ## Run linter
	@echo "$(CYAN)Running linter...$(RESET)"
	pnpm lint

format: ## Format code
	@echo "$(CYAN)Formatting code...$(RESET)"
	pnpm format

# ================================
# Status
# ================================
status: ## Show status of containers
	@echo "$(CYAN)Container Status:$(RESET)"
	docker compose ps

ps: status ## Alias for status
