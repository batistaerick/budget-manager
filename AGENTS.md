# Budget Manager engineering guide

- Treat this repository as one monorepo. Deployable applications belong in
  `apps/`, shared code in `packages/`, documentation in `docs/`, and infrastructure
  in `infrastructure/`.
- Keep domain behavior independent of HTTP, persistence, framework, and provider
  concerns. Organize new API capabilities by bounded context and then by domain,
  application, and infrastructure.
- Never commit credentials, tokens, `.env` files, Terraform state, or personal
  finance data.
- Keep TypeScript strict and application DTOs explicit. Do not use `any` to bypass
  uncertain types.
- Run `make check` before committing, `make build` for release changes, and
  `make compose-config` after Compose changes.
- Use imperative Conventional Commit messages.
