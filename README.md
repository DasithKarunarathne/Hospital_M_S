# HospitalMS Scaffold

Full-stack playground for the Hospital Management System case study. The repo ships with a minimal Express + MongoDB backend, a Vite + React frontend, JWT auth, and mocked integrations so you can explore the features without external services.

## Quickstart

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

The backend listens on **http://localhost:4000**, the frontend on **http://localhost:5173** with `/api` proxying to the API.

## Seeded logins

The server seeds a few accounts on startup (password is the same for all):

| Role    | Email                   | Password       |
|---------|-------------------------|----------------|
| Doctor  | doctor@hospital.test    | Password123!   |
| Staff   | staff@hospital.test     | Password123!   |
| Manager | manager@hospital.test   | Password123!   |

Patients can self-register via the **Register** screen (or POST `/auth/register`). Staff/doctor/manager accounts must be added in MongoDB or seeded.

## Authentication flow

- `POST /auth/register` & `POST /auth/login` issue bcrypt-backed accounts and short-lived JWTs (1 hour).
- `GET /auth/me` uses `Authorization: Bearer <token>` to return the active user.
- Frontend stores the token in localStorage (`hospitalms_token`), attaches it via Axios, and logs out automatically on 401s.
- Protected screens redirect to `/login`; unauthorized roles are bounced to `/unauthorized`.

## Key API routes

| Method & path                     | Description |
|----------------------------------|-------------|
| `GET /appointments`              | Upcoming appointments (simple list for the UI) |
| `GET /appointments/policy`       | Returns `{ cancelCutoffHours }` |
| `GET /appointments/:doctorId/slots?day=YYYY-MM-DD` | 30‑minute availability grid filtered by existing bookings |
| `POST /appointments`             | Book a slot (optimistic concurrency, audit trail) |
| `PATCH /appointments/:id/cancel` | Cancel with policy enforcement |
| `PATCH /appointments/:id/reschedule` | Reschedule with policy + availability checks |
| `POST /payments`                 | Create a payment intent / insurance authorization |
| `GET /payments/:id/receipt`      | Idempotent receipt lookup |
| `POST /payments/mock-psp/trigger`| Dev helper to flip PSP intents to success/fail |
| `GET /reports/{visits,revenue,appointments}` | Aggregated dashboards with privacy scrub |
| `GET /reports/export?type=...`   | CSV export (consumed by the React download helper) |

All patient/appointment/payment/report endpoints require a valid JWT. RBAC hooks remain available via `rbac.middleware` if you want to enforce role-specific access.

## Frontend highlights

- **Layout shell** with nav, user badge, and logout.
- **Auth pages** (login/register) using React Hook Form + Zod. Successful login chains to `/auth/me` for a fresh profile.
- **Records** editing respects optimistic locking (`If-Match`) and surfaces audit trails.
- **Appointments** integrate with availability & policy endpoints. The cancel dialog surfaces the current cutoff window and disabled slots reflect the server response.
- **Payments** drive the mocked PSP flow; when a card intent is pending you can mark it success/fail via the developer panel.
- **Reports** tabs reuse shared filters, render data + charts, and offer CSV export via the `downloadBlob` helper.
- **Global toasts** + axios interceptors show consistent success/error banners.
- **Misc pages** for 404 and unauthorized access.

## Mock PSP usage

1. Choose **Card** on the Payments screen to create a pending intent.
2. Use the “Mock PSP” panel to trigger `SUCCEEDED` or `FAILED`; the backend webhook handler finalises status and issues receipts.

## Environment config

- `backend/.env` – set `MONGO_URI`, `PORT`, and `JWT_SECRET`. Other values have safe defaults for local dev.
- `frontend/.env` – override `VITE_API_BASE` if the API runs on a non-default host.

## Further steps

- Replace the mocked doctor roster with actual `User` lookups.
- Expand RBAC checks per route.
- Add real appointment listing + pagination, or hook to real PSP integrations.
- Capture additional patient profile fields or insurance flows as needed.

Happy hacking! Log issues or ideas directly in the repo once you explore the scaffold.*** End Patch
