base ----------------------------
This task is to merge the frontend components with the backend APIs according to the project’s existing frontend and backend conventions. Follow these rules carefully.

1. Objective

Connect React components in src/components/ and pages in src/pages/ to the backend APIs.

Use the existing services, hooks, and utils to make API calls; do not create new Markdown docs or unrelated files.

Ensure all API integration follows the backend API docs and the API summaries that already exist.

2. Frontend Guidelines

Stack: React (latest Vite) + Tailwind CSS + Lucide React icons + React Router DOM.

Components must be functional and use hooks.

All imported modules must exist.

Use local state and props, abstract repeated logic into hooks or utils.

Follow DRY principle strictly; check the codebase before adding new logic.

Apply error handling and edge-case handling on all API calls.

Styling: use Tailwind CSS utilities only; maintain existing styling conventions.

Routing: respect React Router DOM structure.

3. Backend Guidelines

Stack: JavaScript + Prisma v7.

Routes, controllers, and services must remain separated.

Import all dependencies explicitly; verify they exist.

Implement error handling for all API endpoints.

Maintain API summaries in the designated API folder (already existing).

Do not create redundant routes or duplicate backend logic.

4. Integration Requirements

Identify which frontend components/pages need which API endpoints.

Use services/ folder functions to call APIs wherever possible.

Ensure data from API responses is properly handled and displayed in components.

Implement loading states, error states, and empty states where appropriate.

Avoid creating extra files unless absolutely necessary.

5. Testing & Verification

Test each component individually after connecting it to the API.

Ensure the UI does not break and that API data displays correctly.

Build frequently to catch syntax or runtime errors.

6. DRY Principle

Do not duplicate code or logic.

Reuse existing components, services, and hooks.

Only create new utilities/hooks if the functionality cannot be handled by existing code.

7. Deliverable

Fully functional React frontend integrated with backend APIs.

No extra Markdown or documentation files beyond what already exists.

Clean, readable, maintainable code following project conventions.


------------------------------------


 


-------------------------

