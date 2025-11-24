# Server API Routes

## Authentication Routes (`/auth`)

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| GET    | `/auth/login`              | Initiate Microsoft login            |
| GET    | `/auth/microsoft/callback` | Microsoft OAuth callback handler    |
| GET    | `/auth/me`                 | Get current authenticated user info |
| POST   | `/auth/logout`             | Logout current user                 |

## Users Routes (`/api/users`)

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/users/`       | Get current user    |
| GET    | `/api/users/all`    | Get all users       |
| GET    | `/api/users/:ID`    | Get user by ID      |
| GET    | `/api/users/search` | Search user by name |
| PUT    | `/api/users/`       | Disable user        |

## Discussions Routes (`/api/discussions`)

| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| GET    | `/api/discussions/`            | Get scheduled discussions   |
| GET    | `/api/discussions/unscheduled` | Get unscheduled discussions |
| GET    | `/api/discussions/:id`         | Get discussion by ID        |
| POST   | `/api/discussions/`            | Create new discussion       |
| PUT    | `/api/discussions/`            | Update discussion           |

## Responses Routes (`/api/responses`)

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| GET    | `/api/responses/`         | Get all responses         |
| GET    | `/api/responses/user/:id` | Get responses by user     |
| GET    | `/api/responses/replies`  | Get replies               |
| GET    | `/api/responses/all/:id`  | Get all responses by user |
| POST   | `/api/responses/`         | Post new response         |
| POST   | `/api/responses/replies`  | Post new reply            |

## Test Endpoint

| Method | Endpoint     | Description                                 |
| ------ | ------------ | ------------------------------------------- |
| GET    | `/api/hello` | Test endpoint (echoes Authorization header) |

## Debug Endpoint

| Method | Endpoint    | Description                 |
| ------ | ----------- | --------------------------- |
| GET    | `/__routes` | Lists all registered routes |

---

## Running the Server

```bash
npm install
npm start
```

Server runs on port 3000 (or `PORT` env var).
Frontend is served from `public/index.html`.
