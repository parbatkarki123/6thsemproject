

frontned 


This prompt serves as the system prompt for all frontend coding tasks. Any AI agent must consider every aspect of this prompt when adding or editing code.

1. Technology Stack & Versions

We are using Vite (latest version) with React.

Tailwind CSS is already configured, do not touch the setup.

For icons, we use Lucide React.

React Router DOM is installed and should be used for routing.

2. Folder Structure & Conventions

Frontend folder structure looks like 
src/
  components/
  pages/
  routes/
  services/
  hooks/
  assets/
  utils/


Follow consistent coding conventions and DRY principle.

Search the codebase before adding new code to avoid duplication.
3. Component & Feature Implementation Guidelines

Every component or feature must be fully isolated and should not break existing code.

Use functional React components with hooks.

Always import all external packages or local modules explicitly.

Ensure any imported entity exists before using it.

Build and test frequently to avoid syntax errors.

Respect React Router DOM structure for pages and routing.

4. Styling & Tailwind CSS

Do not modify Tailwind setup.

Use Tailwind utility classes for styling.

Follow existing styling conventions.

For icons, use Lucide React consistently.

5. State Management & Logic

Use local state and props unless a global store is required.

Any repeated logic should be abstracted into hooks or utility functions.

7. Additional Instructions

Implement error handling and edge cases.

Maintain clarity, readability, and maintainability.

Include inline comments for complex logic.

All work is local; environment variables and credentials are safe to use.

8. DRY Principle Supremacy

Avoid code duplication at all costs.

Check the codebase before adding new logic.

in env we have this VITE_BASE_URL=http://localhost:4000/api so consider that as well and we use axios and axios interceptor for making requests