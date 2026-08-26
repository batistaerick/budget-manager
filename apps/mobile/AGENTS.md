# Mobile application guidance

- Keep routes and layouts in `src/app` and reusable presentation in
  `src/components`.
- Put feature state and behavior in `src/features`; keep API setup in `src/lib`.
- Consume backend contracts from `@budget-manager/api-client` instead of
  duplicating DTOs.
- Preserve strict TypeScript, accessible labels, and explicit loading, empty,
  and error states.
- Read the API URL from `EXPO_PUBLIC_API_URL`; never embed environment-specific
  hosts or credentials.
- Before committing, run `npm run check` and export both supported platforms.
