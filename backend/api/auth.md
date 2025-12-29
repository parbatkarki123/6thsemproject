Route: /api/auth/register

Request body (POST):
- name: string (optional)
- email: string (required)
- password: string (required)

Response (201):
- user: { id, name, email }
- token: JWT string

Errors:
- 400: missing fields
- 409: user already exists
- 500: server error

Middleware: none

---

Route: /api/auth/signin

Request body (POST):
- email: string (required)
- password: string (required)

Response (200):
- user: { id, name, email }
- token: JWT string

Errors:
- 400: missing fields
- 401: invalid credentials
- 500: server error

Middleware: none

---

Route: /api/auth/me

Request (GET):
- Header: Authorization: Bearer <token>

Response (200):
- user: { id, name, email }

Errors:
- 401: unauthorized or invalid token
- 404: user not found

Middleware: `src/middlewares/auth.js` (JWT verification)

Notes:
- Uses `src/lib/prisma.js` shared Prisma client.
- Environment: set `JWT_SECRET` to a strong secret in dotenv.
- Dependencies: `bcryptjs` and `jsonwebtoken` are required. Install with `npm install bcryptjs` if not present.
