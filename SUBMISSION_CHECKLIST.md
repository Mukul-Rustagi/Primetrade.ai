# Submission Checklist

Use this before sharing the assignment repository.

## 1) Run and verify locally

Backend:
```bash
cd backend
copy .env.example .env
npm install
npm run smoke
npm run dev
```

Frontend:
```bash
cd frontend
copy .env.example .env
npm install
npm run lint
npm run build
npm run dev
```

## 2) Required files to include

- Root docs:
  - `README.md`
  - `SUBMISSION_CHECKLIST.md`
- Backend:
  - `backend/src/**`
  - `backend/package.json`
  - `backend/package-lock.json`
  - `backend/.env.example`
  - `backend/logs/access.log`
  - `backend/logs/error.log`
  - `backend/logs/smoke-test.log`
- Frontend:
  - `frontend/src/**`
  - `frontend/package.json`
  - `frontend/package-lock.json`
  - `frontend/.env.example`
- API docs:
  - `postman/Internshala_Backend_Assignment.postman_collection.json`
  - `postman/Internshala_Local.postman_environment.json`

## 3) Deliverable mapping

- Auth APIs + JWT + hashing: implemented
- RBAC (`user` vs `admin`): implemented
- CRUD entity (`tasks`): implemented
- API versioning + validation + error handling: implemented
- Swagger/Postman docs: implemented
- Basic frontend UI integration: implemented
- Security/scalable structure: implemented
- Log files: generated under `backend/logs/`

## 4) Repo push notes

- Do not commit `.env` files.
- If you do not want `frontend/dist`, keep it untracked (already ignored in linter config).
- Ensure MongoDB is running before demo/testing.
