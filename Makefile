# Basic automation shortcuts for MockLoop

PYTHON ?= python3
PNPM ?= pnpm
BACKEND_DIR := backend
FRONTEND_DIR := frontend

.PHONY: help backend-install backend-dev frontend-install frontend-dev lint backend-test docker-backend docker-frontend services-up services-down dev-full db-init db-migrate db-upgrade db-downgrade

help:
	@echo "MockLoop commands:"
	@echo "  make services-up       # start PostgreSQL + Redis via docker-compose"
	@echo "  make services-down     # stop all services"
	@echo "  make backend-install   # create venv + install FastAPI deps"
	@echo "  make backend-dev       # run FastAPI locally (starts services if needed)"
	@echo "  make frontend-install  # install Next.js deps with pnpm"
	@echo "  make frontend-dev      # run Next.js dev server"
	@echo "  make dev-full          # start services + backend + frontend"
	@echo "  make lint              # lint frontend via pnpm"
	@echo "  make backend-test      # quick bytecode check for backend"
	@echo "  make docker-backend    # build backend Docker image"
	@echo "  make docker-frontend   # build frontend Docker image"
	@echo "  make db-init           # initialize Alembic (run once)"
	@echo "  make db-migrate NAME=description  # create new migration"
	@echo "  make db-upgrade        # apply pending migrations"
	@echo "  make db-downgrade      # rollback one migration"

backend-install:
	cd $(BACKEND_DIR) && $(PYTHON) -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt

services-up:
	@echo "Starting PostgreSQL and Redis services..."
	docker-compose up -d
	@echo "Waiting for services to be ready..."
	@sleep 3

services-down:
	@echo "Stopping all services..."
	docker-compose down

backend-dev: services-up
	@echo "Starting FastAPI backend..."
	cd $(BACKEND_DIR) && . .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-full: services-up
	@echo "Starting full development environment..."
	@echo "Backend will start on http://localhost:8000"
	@echo "Frontend will start on http://localhost:3000"
	@echo "Press Ctrl+C to stop all services"
	cd $(BACKEND_DIR) && . .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
	cd $(FRONTEND_DIR) && $(PNPM) dev

frontend-install:
	cd $(FRONTEND_DIR) && $(PNPM) install

frontend-dev:
	cd $(FRONTEND_DIR) && $(PNPM) dev

lint:
	cd $(FRONTEND_DIR) && $(PNPM) lint

backend-test:
	$(PYTHON) -m compileall $(BACKEND_DIR)/app

docker-backend:
	docker build -t mockloop-backend -f $(BACKEND_DIR)/Dockerfile .

docker-frontend:
	docker build -t mockloop-frontend -f $(FRONTEND_DIR)/Dockerfile .

# Database migration commands
db-init: services-up
	@echo "Initializing Alembic..."
	cd $(BACKEND_DIR) && . .venv/bin/activate && alembic init alembic

db-migrate: services-up
	@if [ -z "$(NAME)" ]; then echo "Usage: make db-migrate NAME=description"; exit 1; fi
	@echo "Creating migration: $(NAME)"
	cd $(BACKEND_DIR) && . .venv/bin/activate && alembic revision --autogenerate -m "$(NAME)"

db-upgrade: services-up
	@echo "Applying database migrations..."
	cd $(BACKEND_DIR) && . .venv/bin/activate && alembic upgrade head

db-downgrade: services-up
	@echo "Rolling back one migration..."
	cd $(BACKEND_DIR) && . .venv/bin/activate && alembic downgrade -1
