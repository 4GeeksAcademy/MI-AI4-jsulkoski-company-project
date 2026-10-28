# Candidate Utilities

The TypeScript domain models and pure data-processing utilities are under `src/`. The manual browser harness is `src/index.html` and runs against the briefing's sample data.

From the repository root:

```sh
npm install
npm run typecheck
npm run build
npx http-server . -p 3000 -a 0.0.0.0
```

Open `http://localhost:3000/src/index.html` after building. `npm run demo` combines the build and local server steps.
