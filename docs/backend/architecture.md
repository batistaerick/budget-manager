# Backend architecture

## Shape

The API is a modular monolith with one deployment unit and three bounded
contexts:

- **Identity** owns users, roles, authentication, refresh tokens, and profile
  images.
- **Ledger** owns categories, transactions, and installments.
- **Savings** owns savings goals and their location rules.

The code is split by capability first and then by DDD layer:

| Package                                | DDD responsibility                        |
| -------------------------------------- | ----------------------------------------- |
| `{context}.domain`                     | Entities and domain vocabulary            |
| `{context}.application`                | Use cases and transaction orchestration   |
| `{context}.infrastructure.http`        | Controllers, DTOs, and converters         |
| `{context}.infrastructure.persistence` | Spring Data persistence adapters          |
| `{context}.infrastructure.security`    | Authentication and authorization adapters |

Dependencies point inward: controllers call application services; services use
repositories; domain objects never access application or infrastructure types.
ArchUnit enforces those boundaries and prevents HTTP adapters from accessing
persistence adapters directly in every Maven verification.

## Evolution rules

- New capability code is grouped by bounded context first, then by `domain`,
  `application`, and `infrastructure`.
- A bounded context never calls another context's repository. It calls an explicit
  application interface or publishes a domain event.
- Controllers return DTOs rather than JPA entities.
- Domain invariants are checked in domain/application code, not only by request
  validation.
- PostgreSQL is the source of truth. Replace Hibernate `update` with forward-only
  Flyway migrations before the first shared environment.
- Store timestamps in UTC and monetary amounts with an explicit currency and exact
  decimal or minor-unit representation.
- External writes must be idempotent and authenticated.

## Delivery boundaries

The web app knows the API contract but never database details. Infrastructure is
kept outside both apps. Docker images are immutable and run as non-root users.
