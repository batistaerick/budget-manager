# Budget Manager API engineering guide

- Organize the modular monolith by bounded context (`identity`, `ledger`,
  `savings`, `shared`), then by `domain`, `application`, and `infrastructure`.
- Domain code must not depend on application or infrastructure code.
- HTTP adapters call application services and never persistence adapters.
- Keep transport DTOs out of domain packages and never expose entities directly.
- Update `../../packages/api-client/openapi.yaml` whenever an HTTP contract
  changes, then run `make api-client-generate` from the repository root.
- Run `./mvnw spotless:apply` while editing and `./mvnw verify` before committing.
