# Emergency Hospital Management System

A full-stack app: React (Vite) frontend + Express/MongoDB backend.

- **Frontend**: React, plain CSS, talks to the backend over `fetch`.
- **Backend**: Express, Mongoose (MongoDB), JWT auth, bcrypt password hashing.

## "Could not reach the server. Is the backend running?"

This means the frontend, running in your browser, could not reach
`http://localhost:4000`. Check these in order:

1. **Backend not started.** Open a terminal, `cd Backend`, `npm install` (first
   time only), then `npm run dev`. You must see
   `Server running on http://localhost:4000` in that terminal — leave it running.
2. **Test it directly.** Visit `http://localhost:4000/api/health` in your
   browser while the backend is running. You should see JSON like
   `{"success":true,"server":"up","database":"connected"}`. If `database` says
   `"disconnected"`, the server itself is fine but MongoDB isn't — see step 4.
3. **Port mismatch.** `Backend/.env` has `PORT=4000` and the frontend's `.env`
   has `VITE_API_URL=http://localhost:4000/api` — these must match. If you
   changed one, change the other too, and restart both servers.
4. **MongoDB not connected.** `npm run dev` in `Backend/` will still start the
   HTTP server even if MongoDB isn't reachable, but every API call that touches
   the database will fail. Check the backend terminal for a
   `MongoDB connection error` line — usually means `mongod` isn't running
   locally, or your Atlas `MONGO_URI`/password/IP allowlist is wrong.

## Project structure

```
emergency/
├── src/                  # React frontend
│   ├── api.js            # fetch wrapper for the backend API
│   ├── App.jsx           # top-level state + routing
│   └── components/       # pages/components (unchanged UI, now async-aware)
├── Backend/
│   ├── server.js         # Express entry point
│   ├── config/db.js      # MongoDB connection
│   ├── models/           # Patient, Hospital, Request (Mongoose schemas)
│   ├── routes/           # /api/patients, /api/hospitals, /api/requests, /api/admin
│   ├── middleware/auth.js
│   ├── seed.js           # seeds the hospitals collection with starter data
│   └── .env              # backend config (Mongo URI, JWT secret, admin creds)
└── .env                  # frontend config (VITE_API_URL)
```

## 1. Set up MongoDB

Use either:
- A local MongoDB install (`mongod` running on `mongodb://127.0.0.1:27017`), or
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster — copy its connection string.

Then edit `Backend/.env` and set `MONGO_URI` accordingly. Also change `JWT_SECRET`
to any long random string.

## 2. Install dependencies & run the backend

```bash
cd Backend
npm install
npm run seed   # one-time: populates the hospitals collection
npm run dev    # starts the API on http://localhost:4000
```

## 3. Install dependencies & run the frontend

In a second terminal, from the project root:

```bash
npm install
npm run dev    # starts Vite on http://localhost:5173
```

The frontend reads the API base URL from `.env` (`VITE_API_URL`), which
already points at `http://localhost:4000/api`.

### Optional: run both with one command

After you've run `npm install` in **both** the project root and `Backend/`
at least once, you can start both servers together from the project root:

```bash
npm run dev:all
```

## Admin login

Demo credentials (set in `Backend/.env`):

```
username: admin
password: admin123
```

## API overview

| Method | Route                        | Auth          | Purpose                         |
|--------|-------------------------------|---------------|----------------------------------|
| POST   | /api/patients/register        | —             | Create a patient account         |
| POST   | /api/patients/login            | —             | Log in, returns a JWT            |
| GET    | /api/patients                  | admin         | List all patients                |
| PUT    | /api/patients/:id               | patient (self)| Update personal/medical info     |
| DELETE | /api/patients/:id               | admin         | Remove a patient                 |
| GET    | /api/hospitals                 | —             | List hospitals                   |
| PUT    | /api/hospitals/:id               | admin         | Update available beds (syncs Bed docs) |
| GET    | /api/hospitals/:id/beds          | admin         | List individual bed records      |
| POST   | /api/requests                  | —             | Create an emergency request      |
| GET    | /api/requests                  | admin         | List all emergency requests      |
| PUT    | /api/requests/:id/resolve        | admin         | Mark a request as resolved       |
| POST   | /api/admin/login                | —             | Admin login (checked against DB), returns a JWT |

Patient and admin JWTs are passed as `Authorization: Bearer <token>` and are
issued for 7 days. Passwords are hashed with bcrypt before being stored.

## What changed from the original scaffold

The original project only had a "Hello World" Express server, and the React
app kept everything (patients, hospitals, emergency requests) in
`localStorage`. This version:

- Adds Mongoose models for `Patient`, `Admin`, `Hospital`, `Bed`, and `Request`.
- Adds a full REST API with JWT-based auth for patients and admins.
- Rewrites `App.jsx` to call the API instead of `localStorage`, while keeping
  every existing component's UI and props the same shape (only the data
  source moved).
- Adds `Backend/seed.js` to load the original demo hospitals, an individual
  `Bed` document per bed, and a database-backed admin account into MongoDB.
- The admin login is checked against the `Admin` collection (password
  hashed with bcrypt) — not hardcoded in the backend — though the *default*
  admin account's username/password still come from `Backend/.env` the first
  time `npm run seed` runs.
- Every emergency `Request` stores a real reference (`hospital`) to the
  `Hospital` it was routed to, not just the hospital's name as text.

### Not implemented (and why)

A few things mentioned in project write-ups for systems like this aren't
implemented here, because they need infrastructure this sandbox can't set up
for you — you'd add these yourself if your report requires them:

- **Google Maps API** — the app uses the browser's built-in Geolocation API
  only (no map display, no Maps API key).
- **Bootstrap/Tailwind CSS** — styling is plain custom CSS.
- **Postman API testing** — no Postman collection is included; you'd create
  one against the routes listed above.
- **Deployment (Vercel/Render)** — the app runs locally only. Deploying it
  is a separate step (Backend → Render/Railway, frontend → Vercel/Netlify,
  updating `VITE_API_URL` to the deployed backend's URL).
- **Notifications/alerts** — there's no email/SMS/push notification system.
