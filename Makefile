.DEFAULT_GOAL := help

API_DIR := apps/api
WEB_DIR := apps/web
MOBILE_DIR := apps/mobile
API_CLIENT_DIR := packages/api-client
LOCAL_API_URL := http://localhost:8080
COMPOSE := docker compose
TERRAFORM_DIR := infrastructure/terraform
TERRAFORM := terraform
MVNW := cd $(API_DIR) && ./mvnw --batch-mode
WEB_NPM := npm --prefix $(WEB_DIR)
MOBILE_NPM := npm --prefix $(MOBILE_DIR)
API_CLIENT_NPM := npm --prefix $(API_CLIENT_DIR)
ROOT_NPM := npm

.PHONY: help install prepare check build format test hooks-install hooks-uninstall commit-title-check \
	api-check api-format api-test api-build api-run \
	api-client-install api-client-generate api-client-check api-client-format api-client-audit \
	web-install web-check web-format web-test web-build web-dev web-storybook web-storybook-build \
	mobile-install mobile-check mobile-format mobile-test mobile-build mobile-start mobile-android mobile-ios \
	compose-config compose-up compose-down compose-restart compose-ps compose-logs compose-deps-up compose-deps-down \
	terraform-format terraform-init terraform-validate terraform-check up down clean restart ps logs

help:
	@echo "Usage: make <command>"
	@echo ""
	@echo "🚀 Core: install prepare check build format test hooks-install hooks-uninstall commit-title-check"
	@echo "☕ API: api-run api-check api-format api-test api-build"
	@echo "🔗 Client: api-client-generate api-client-check api-client-format api-client-audit"
	@echo "🌐 Web: web-dev web-check web-format web-test web-build web-storybook web-storybook-build"
	@echo "📱 Mobile: mobile-start mobile-android mobile-ios mobile-check mobile-format mobile-test mobile-build"
	@echo "🐳 Compose: up down clean restart ps logs compose-config compose-deps-up compose-deps-down"
	@echo "🏗️  Terraform: terraform-format terraform-init terraform-validate terraform-check"

# ── Core commands ─────────────────────────────────────────────────────────────

install: hooks-install api-client-install web-install mobile-install

prepare: format check build

check: api-check api-client-check api-client-audit web-check mobile-check

build: check api-build web-build mobile-build

format: api-format api-client-format web-format mobile-format
	$(ROOT_NPM) exec prettier -- --write "*.{json,md,yaml,yml}" ".github/**/*.{yaml,yml,md}" "docs/**/*.md"

test: api-test web-test mobile-test

hooks-install:
	$(ROOT_NPM) ci
	$(ROOT_NPM) run hooks:install

hooks-uninstall:
	$(ROOT_NPM) run hooks:uninstall

commit-title-check:
	@test -n "$(TITLE)" || (echo "Usage: make commit-title-check TITLE='feat: add capability'" && exit 1)
	node scripts/validate-conventional-commit.mjs --title "$(TITLE)"

# ── API ───────────────────────────────────────────────────────────────────────

api-run:
	$(MVNW) spring-boot:run

api-check:
	$(MVNW) verify

api-format:
	$(MVNW) spotless:apply

api-test:
	$(MVNW) test

api-build:
	$(MVNW) package -DskipTests

# ── Generated API client ──────────────────────────────────────────────────────

api-client-install:
	$(API_CLIENT_NPM) ci

api-client-generate:
	$(API_CLIENT_NPM) run generate

api-client-check:
	$(API_CLIENT_NPM) run check

api-client-format:
	$(API_CLIENT_NPM) run format

api-client-audit:
	$(API_CLIENT_NPM) audit --audit-level=high

# ── Web ───────────────────────────────────────────────────────────────────────

web-install:
	$(WEB_NPM) ci

web-dev:
	$(WEB_NPM) run dev

web-check:
	$(WEB_NPM) run check

web-format:
	$(WEB_NPM) run format

web-test:
	$(WEB_NPM) test -- --runInBand

web-build:
	NEXT_PUBLIC_API_URL=$(LOCAL_API_URL) $(WEB_NPM) run build

web-storybook:
	$(WEB_NPM) run storybook

web-storybook-build:
	NEXT_PUBLIC_API_URL=$(LOCAL_API_URL) $(WEB_NPM) run build-storybook

# ── Mobile ────────────────────────────────────────────────────────────────────

mobile-install:
	$(MOBILE_NPM) ci

mobile-check:
	$(MOBILE_NPM) run check

mobile-format:
	$(MOBILE_NPM) run format

mobile-test:
	$(MOBILE_NPM) test -- --runInBand

mobile-build:
	EXPO_PUBLIC_API_URL=$(LOCAL_API_URL) $(MOBILE_NPM) run build

mobile-start:
	$(MOBILE_NPM) start

mobile-android:
	$(MOBILE_NPM) run android

mobile-ios:
	$(MOBILE_NPM) run ios

# ── Docker Compose ────────────────────────────────────────────────────────────

compose-config:
	$(COMPOSE) config --quiet

compose-up:
	$(COMPOSE) up --build -d

compose-down:
	$(COMPOSE) down

compose-restart: compose-down compose-up

compose-ps:
	$(COMPOSE) ps

compose-logs:
	$(COMPOSE) logs --follow

compose-deps-up:
	$(COMPOSE) up -d postgres

compose-deps-down:
	$(COMPOSE) stop postgres

up: compose-up
down: compose-down
restart: compose-restart
ps: compose-ps
logs: compose-logs

clean:
	$(COMPOSE) down --volumes --remove-orphans

# ── Terraform ─────────────────────────────────────────────────────────────────

terraform-format:
	$(TERRAFORM) fmt -recursive $(TERRAFORM_DIR)

terraform-init:
	$(TERRAFORM) -chdir=$(TERRAFORM_DIR) init -backend=false

terraform-validate: terraform-init
	$(TERRAFORM) -chdir=$(TERRAFORM_DIR) validate

terraform-check:
	$(TERRAFORM) fmt -check -recursive $(TERRAFORM_DIR)
	$(MAKE) terraform-validate
