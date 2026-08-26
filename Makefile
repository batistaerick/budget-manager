.DEFAULT_GOAL := help

.PHONY: help install check build format api-client-generate api-client-check api-client-format api-check api-build api-format api-dev web-check web-build web-format web-dev mobile-check mobile-build mobile-format mobile-dev compose-up compose-down compose-config clean terraform-check

help:
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z_-]+:.*## / {printf "%-22s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install locked dependencies and Git hooks
	npm ci
	npm ci --prefix packages/api-client
	npm ci --prefix apps/web
	npm ci --prefix apps/mobile
	npx lefthook install

check: api-client-check api-check web-check mobile-check ## Run all static analysis and tests

build: api-build web-build mobile-build ## Build all deployable applications

format: api-client-format api-format web-format mobile-format ## Format all application source
	npx prettier --write "*.{json,md,yaml,yml}" ".github/**/*.{yaml,yml,md}" "docs/**/*.md"

api-client-check: ## Verify shared API contracts and client types
	npm run check --prefix packages/api-client

api-client-generate: ## Regenerate the shared client from OpenAPI
	npm run generate --prefix packages/api-client

api-client-format: ## Format the shared API client
	npm run format --prefix packages/api-client

api-check: ## Verify API formatting, tests, PMD, SpotBugs, and architecture
	cd apps/api && ./mvnw --batch-mode verify

api-build: ## Package the API
	cd apps/api && ./mvnw --batch-mode package -DskipTests

api-format: ## Format API source
	cd apps/api && ./mvnw spotless:apply

api-dev: ## Run the API locally
	cd apps/api && ./mvnw spring-boot:run

web-check: ## Verify web formatting, lint, types, and tests
	npm run check --prefix apps/web

web-build: ## Build the web application
	npm run build --prefix apps/web

web-format: ## Format web source
	npm run format --prefix apps/web

web-dev: ## Run the web application locally
	npm run dev --prefix apps/web

mobile-check: ## Verify mobile formatting, lint, types, and tests
	npm run check --prefix apps/mobile

mobile-build: ## Export Android and iOS application bundles
	EXPO_PUBLIC_API_URL=$${EXPO_PUBLIC_API_URL:-http://localhost:8080} npm run build --prefix apps/mobile

mobile-format: ## Format mobile source
	npm run format --prefix apps/mobile

mobile-dev: ## Run the Expo development server
	npm run start --prefix apps/mobile

compose-up: ## Start the complete local stack
	docker compose up --build --detach --wait

compose-down: ## Stop the local stack
	docker compose down

compose-config: ## Validate Docker Compose configuration
	docker compose config --quiet

clean: ## Remove local containers and volumes
	docker compose down --volumes --remove-orphans

terraform-check: ## Format-check and validate Terraform
	terraform fmt -check -recursive infrastructure/terraform
	terraform -chdir=infrastructure/terraform init -backend=false
	terraform -chdir=infrastructure/terraform validate
