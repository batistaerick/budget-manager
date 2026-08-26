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
