backend




This prompt serves as the system prompt for all backend coding tasks. Any AI agent must consider every aspect of this prompt when making edits or adding new features.

1. Technology Stack & Versioning

We are using JavaScript for the backend.

We are using the latest Prisma version (v7). Consider the nuances and new conventions in Prisma v7 carefully.

2. Folder Structure & Conventions

Respect the existing folder structure of the project.

Follow coding conventions consistently.

Apply the DRY principle strictly; do not duplicate functionality unnecessarily.

Before adding any code, search the codebase for existing similar or same functionality.

3. Feature Implementation Guidelines

Every feature or block of code must be fully isolated and should not break existing code.

Follow separation of concerns: separate routes, controllers, and services appropriately.

Implement middlewares wherever needed.

Always import external packages, modules, or functions explicitly. Do not assume they exist.

Before importing from a file, verify that the entity exists in that file.

Do not hallucinate code; if uncertain, make logical safe choices and iterate.

Build and test the code frequently to avoid syntax errors.

4. Environment & Packages

You can access local .env files (there is no sensitive information).

Use the terminal with npm to install packages. Do not manually add packages to package.json to avoid version conflicts.

All changes should be local and self-contained.

Important: The backend is using ESM (ECMAScript modules).
- Ensure `package.json` contains: `"type": "module"`.
- Use `import` / `export` instead of `require` / `module.exports`.
- Include file extensions in local imports (e.g. `import { hashPassword } from './utils/hash.js'`).
- For dotenv, use `import 'dotenv/config'` at the app entrypoint.
- If you add dev tooling (nodemon), ensure it works with ESM (the project already uses `node --watch` in `dev`).

Prisma ESM recommendation:
- To avoid import/export mismatches with `@prisma/client` under ESM, use a small project shim `src/lib/prisma.js` that imports the package and exports a single shared client instance:

```js
// src/lib/prisma.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
export { PrismaClient, prisma };
```

- Import the shared client in your modules: `import { prisma } from './src/lib/prisma.js'`.
- This ensures a single client instance across the app and avoids the named-export mismatch.

If a package is not installed (e.g., `cookie-parser`, `cors`), install it via `npm install cookie-parser cors` in the `backend` folder.

5. Documentation & Summaries

After creating a route or API, add a summary in a designated file inside the api folder.

The summary should include:

Route URL

Request parameters/body

Expected response

Any middleware applied

Frontend engineers should be able to understand any route completely by reading the summary file.

6. Additional Instructions

Always consider error handling and edge cases.

Ensure compatibility with the rest of the codebase.

Strive for clarity, readability, and maintainability in all code.

If needed, suggest improvements to folder structure or coding patterns without breaking existing functionality.

Assume all work is local; there are no external privacy restrictions.

7. DRY Principle Supremacy

Avoid duplicating code at all costs.

Check the codebase before adding new logic.


for using the prima clien thave a look into the lib folder there we have a file called prisma.js that creates a single shared Prisma Client instance for the app