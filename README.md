# Internshala Backend Developer Assignment

Full-stack assignment project with:
- Secure REST backend (Node.js + Express + MongoDB)
- JWT auth + role-based access control (`user`, `admin`)
- CRUD APIs for `tasks`
- API versioning (`/api/v1`)
- Swagger docs + Postman collection
- Basic React frontend for testing auth and CRUD flows

## Tech Stack

- Backend: Node.js, Express, Mongoose, JWT, bcryptjs, Zod
- Frontend: React + Vite, React Router, Axios
- Database: MongoDB

## Project Structure

```txt
backend/
  logs/
  src/
    config/
    controllers/
    docs/
    middleware/
    models/
    routes/v1/
    services/
    validations/
frontend/
postman/
  Internshala_Backend_Assignment.postman_collection.json
```

## Setup Instructions

## 1) Backend setup

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Set `.env` values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/internshala_assignment
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
ADMIN_INVITE_TOKEN=change_this_for_admin_registration
```

Backend URLs:
- API base: `http://localhost:5000/api/v1`
- Swagger docs: `http://localhost:5000/api-docs`
- Health check: `http://localhost:5000/health`
- Smoke test (auto-checks auth + RBAC + CRUD): `npm run smoke`

## 2) Frontend setup

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Set `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Frontend URL:
- App: `http://localhost:5173`

## API Summary

Auth:
- `POST /api/v1/auth/register`
  - `role=admin` requires `adminInviteToken`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Tasks:
- `POST /api/v1/tasks`
- `GET /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

Admin (RBAC):
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/stats`

## Security Features

- Password hashing with `bcryptjs`
- JWT-based authentication (`Authorization: Bearer <token>`)
- Role-based route guards (`admin` only endpoints)
- Controlled admin registration via `ADMIN_INVITE_TOKEN`
- Input validation with `zod`
- Request sanitization middleware (strips HTML tags and Mongo operator keys)
- Rate limiting and secure HTTP headers (`helmet`)
- Centralized error handling

## Logs

Backend log files are written automatically:
- Access logs: `backend/logs/access.log`
- Error logs: `backend/logs/error.log`

You can attach these files when sharing assignment execution proof.

## API Documentation

- Swagger UI available at `/api-docs`
- Postman collection:
  `postman/Internshala_Backend_Assignment.postman_collection.json`

## Scalability Note

Current structure is modular (controllers/services/middleware/routes), which supports vertical growth per module.  
For horizontal scaling:
- Add Redis for response caching and token/session revocation lists
- Add a queue worker for heavy async jobs (emails, reports)
- Use load balancer + multiple stateless API instances
- Move logs/metrics to centralized observability (ELK/Datadog/Grafana)
- Split auth/task/admin modules into microservices when domain boundaries grow

## Optional Enhancements

- Dockerize backend/frontend with `docker-compose`
- Add refresh-token flow
- Add tests (Jest + Supertest)
- Add CI pipeline (lint/build/test)
