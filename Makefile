FRONTEND_DIR := apps/frontend
BACKEND_DIR  := apps/backend

.PHONY: help install dev dev-frontend dev-backend build build-frontend build-backend test test-frontend test-backend test-e2e db-up db-down db-logs clean

help:
	@echo "Anybank — available targets:"
	@echo "  make install         Install frontend dependencies"
	@echo "  make dev             Run frontend and backend in parallel"
	@echo "  make dev-frontend    Run Angular dev server"
	@echo "  make dev-backend     Run Spring Boot app"
	@echo "  make db-up           Start Postgres via docker compose"
	@echo "  make db-down         Stop Postgres"
	@echo "  make db-logs         Tail Postgres logs"
	@echo "  make build           Build both apps"
	@echo "  make test            Run tests for both apps"
	@echo "  make test-e2e        Run the Playwright login e2e (headed, full stack)"
	@echo "  make clean           Remove build artifacts and node_modules"

install:
	cd $(FRONTEND_DIR) && npm install

dev:
	$(MAKE) -j2 dev-backend dev-frontend

dev-frontend:
	cd $(FRONTEND_DIR) && npm start

dev-backend:
	cd $(BACKEND_DIR) && ./mvnw spring-boot:run

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

db-logs:
	docker compose logs -f postgres

build: build-frontend build-backend

build-frontend:
	cd $(FRONTEND_DIR) && npm run build

build-backend:
	cd $(BACKEND_DIR) && ./mvnw -DskipTests package

test: test-frontend test-backend

test-frontend:
	cd $(FRONTEND_DIR) && npm test -- --watch=false --browsers=ChromeHeadless

test-backend:
	cd $(BACKEND_DIR) && ./mvnw test

# Brings up Postgres, then Playwright boots the backend + Angular dev server
# and drives the login flow in a real (headed) browser.
test-e2e:
	docker compose up -d --wait postgres
	cd $(FRONTEND_DIR) && npm run e2e:headed

clean:
	rm -rf $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/dist $(FRONTEND_DIR)/.angular
	cd $(BACKEND_DIR) && ./mvnw clean
