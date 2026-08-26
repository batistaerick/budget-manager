# Budget Manager Mobile

The Expo application provides the core Budget Manager workflows on Android and
iOS. It shares API contracts and transport behavior with the web application
through `@budget-manager/api-client`.

## Local development

```bash
cp .env.example .env
npm ci
npm start
```

Set `EXPO_PUBLIC_API_URL` to an API address reachable by the device or emulator.
For Android Emulator, the host machine is normally available at
`http://10.0.2.2:8080`.

## Verification

```bash
npm run check
EXPO_PUBLIC_API_URL=http://localhost:8080 npm run build
```
