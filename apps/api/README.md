# API application

Spring Boot modular-monolith API for Budget Manager.

```bash
./mvnw spring-boot:run
./mvnw spotless:apply
./mvnw verify
```

`verify` runs unit and architecture tests, Spotless, PMD, and SpotBugs. Runtime
configuration is supplied through environment variables; see the root
`.env.example` and Compose file for local examples.

## Database migrations

Flyway owns the API schema in `src/main/resources/db/migration`. Hibernate runs
with `ddl-auto=validate` by default and should not create or update tables.

The first migration creates the schema and seeds the base roles. A local user can
be seeded by setting these ignored `.env` values before starting Compose:

```properties
APP_SEED_USER_EMAIL=you@example.com
APP_SEED_USER_NAME=Your Name
APP_SEED_USER_PASSWORD_HASH=<bcrypt-hash>
```
