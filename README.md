# Budget Manager

Budget Manager is a personal-finance monorepo containing the browser application,
the native mobile application, the transactional API, shared packages,
documentation, and deployment infrastructure.

## Repository structure

```text
apps/
  api/            Java 25 / Spring Boot API
  mobile/         Expo / React Native Android and iOS application
  web/            Next.js 16 web application
packages/
  api-client/     OpenAPI-generated SDK, validation, and domain contracts
docs/             Architecture and engineering documentation
infrastructure/   Terraform for the AWS deployment foundation
```

The API is a modular monolith organized around identity, ledger, and savings
business capabilities. Its dependency direction and DDD boundaries are described
in [the backend architecture](docs/backend/architecture.md).

The committed OpenAPI contract at `packages/api-client/openapi.yaml` generates a
typed fetch SDK used by both frontend applications. After changing the contract,
run `make api-client-generate` and commit the generated sources.

## Requirements

- Java 25
- Node.js 24 and npm 11+
- Docker with Docker Compose
- Terraform 1.13+ (only when changing infrastructure)

## Getting started

```bash
make install
cp .env.example .env
make compose-up
```

The web application is available at `http://localhost:3000`; the API is available
at `http://localhost:8080`. Copy `apps/mobile/.env.example` to
`apps/mobile/.env` before starting Expo.

For development without containers, run `make api-run`, `make web-dev`, and
`make mobile-start` in separate terminals.

## Quality gates

```bash
make check
make build
make compose-config
make terraform-check
```

`make install` installs all locked JavaScript dependencies and activates Lefthook. The
pre-commit hook runs checks for changed applications. Commit messages must follow
Conventional Commits, for example `feat: add recurring transactions`.

Never commit `.env` files, credentials, Terraform state, generated builds, or
personal finance data.
