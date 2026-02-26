# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
TripPlanner PWA — Complete
npm run dev to start, npm run build to ship.

Project structure built in src/
Layer	Files
Types	src/lib/types.ts
Firebase	src/lib/firebase.ts
State	src/lib/store.ts (Zustand + localStorage)
Hooks	src/hooks/useTrips.ts, useBudget.ts, useItinerary.ts, usePacking.ts
Pages	Home, TripDetail, Itinerary, Map, Budget, Packing
UI	shadcn/ui-style Button, Card, Dialog, Input, Select, Badge
Features
My Trips dashboard with trip cards, create/delete
Itinerary builder — day-by-day collapsible view with activities (time, category, location, notes)
Leaflet map — OpenStreetMap tiles, no API key needed; pins activities that have lat/lng
Budget tracker — set total budget + currency, add expenses by category, visual progress bar
Packing list — grouped by category, check-off items, progress bar
ChatGPT button — copies a pre-filled trip prompt to clipboard + opens chatgpt.com
RedNote button — deep-links to 小红书 search for the trip destination
PWA — installable, service worker, offline support, dist/sw.js generated
Before running — add Firebase config to .env:

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
...
See .env.example for all keys. The app uses anonymous Firebase Auth automatically.

https://trip-planner-with-react-f52kjg31i-seanye333s-projects.vercel.app/