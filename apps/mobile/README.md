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

`npm start` expects a development build. Use `npm run start:go` when running
the app through Expo Go.

Set `EXPO_PUBLIC_API_URL` to an API address reachable by the device or emulator.
For Android Emulator, the host machine is normally available at
`http://10.0.2.2:8080`.

## Scripts

```bash
npm start              # Start Expo for a development build
npm run start:go       # Start Expo Go
npm run android        # Build and run Android with a supported JDK
npm run android:device # Build and run Android on a connected device
npm run ios            # Build and run iOS
npm run web            # Start the web target
npm run prebuild       # Generate native projects
npm run bundle         # Export Android and iOS bundles
npm run verify         # Run types, lint, format check, route check, and tests
```

## Verification

```bash
npm run verify
EXPO_PUBLIC_API_URL=http://localhost:8080 npm run bundle
```
