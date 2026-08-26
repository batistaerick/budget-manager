# Budget Manager

Budget Manager is a personal-finance monorepo containing the browser application,
the transactional API, documentation, and deployment infrastructure.

## Repository structure

```text
apps/
  api/            Java 25 / Spring Boot API
  web/            Next.js 16 web application
docs/             Architecture and engineering documentation
infrastructure/   Terraform for the AWS deployment foundation
```

The API is a modular monolith organized around identity, ledger, and savings
business capabilities. Its dependency direction and DDD boundaries are described
in [the backend architecture](docs/backend/architecture.md).

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
at `http://localhost:8080`.

For development without containers, run `make api-dev` and `make web-dev` in
separate terminals.

## Quality gates

```bash
make check
make build
make compose-config
make terraform-check
```

`make install` installs locked web dependencies and activates Lefthook. The
pre-commit hook runs checks for changed applications. Commit messages must follow
Conventional Commits, for example `feat: add recurring transactions`.

Never commit `.env` files, credentials, Terraform state, generated builds, or
personal finance data.
