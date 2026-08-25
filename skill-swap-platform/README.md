# منصة مهارة — Skill Swap Platform

Full-stack skill-swap app: existing React (Vite) frontend + a new
Node/Express/MongoDB backend with JWT auth.

```
skill-swap-platform/
  backend/     Node.js + Express + MongoDB + Mongoose + JWT + bcrypt
  frontend/    The original React UI, now wired to the backend via Axios
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB instance — either local (`mongod`) or a free MongoDB Atlas cluster

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI and a real JWT_SECRET
npm install
npm start          # or: npm run dev (nodemon, auto-restart)
```

The API starts on `http://localhost:5000` (see `PORT` in `.env`).
Health check: `GET http://localhost:5000/api/health`

Optional demo data (one demo user + 3 sample skills):

```bash
npm run seed
# creates demo@mahara.io / Demo@1234
```

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api  (default is already correct for local dev)
npm install
npm run dev
```

Opens on `http://localhost:5173`. The Arabic RTL UI, all pages, and all
existing visual behavior are unchanged from the uploaded project.

## 4. What was added / changed

**New backend** (`backend/`) — models, controllers, routes, middleware,
services, config, `server.js`, exactly as requested. JWT auth with bcrypt
password hashing. No secrets hardcoded — everything sensitive comes from
`.env` (`MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`).

**Frontend — reconstructed (not present in the upload, but imported by
the pages you provided):**
- `src/context/AuthContext.jsx`, `SwapContext.jsx`, `ChatContext.jsx` —
  now call the backend via `src/api/*.js` (Axios) instead of local mock
  state.
- `src/components/layout/Navbar.jsx`, `Footer.jsx`,
  `src/components/skills/SwapModal.jsx`
- `src/data/initialData.js` (`TEAM_MEMBERS` used on the homepage)
- `package.json`, `vite.config.js`

**Frontend — small, necessary edits to files you uploaded** (everything
else in every page is untouched):
- `LoginPage.jsx` / `RegisterPage.jsx`: `handleSubmit` is now `async` and
  `await`s `login()` / `register()`, since these now perform a real
  network request instead of returning a value synchronously from mock
  state. `RegisterPage` also now surfaces a server error message on
  failure (e.g. duplicate email), which the original mock never
  triggered.
- `App.jsx`: the tab-switch logic now lives in an inner component so it
  can read auth state, and `swaps` / `messages` / `profile` redirect to
  the login page if the user isn't authenticated (previously there was
  no real backend, so every "user" was implicitly logged in).

## 5. Feature → endpoint map

| Feature | Method & route |
|---|---|
| Register | `POST /api/auth/register` |
| Login | `POST /api/auth/login` |
| Logout | `POST /api/auth/logout` (auth) |
| Current user | `GET /api/auth/me` (auth) |
| View own profile | `GET /api/users/profile` (auth) |
| Edit profile | `PUT /api/users/profile` (auth) |
| Add "teach" skill to profile | `POST /api/users/profile/skills-teach` (auth) |
| Add "learn" skill to profile | `POST /api/users/profile/skills-learn` (auth) |
| Search / filter users by skill | `GET /api/users?search=&skill=` (auth) |
| Browse skills marketplace | `GET /api/skills?search=&category=` (public) |
| Post a new skill | `POST /api/skills` (auth) |
| My own skills | `GET /api/skills/mine` (auth) |
| Delete a skill | `DELETE /api/skills/:id` (auth, owner only) |
| Create swap request | `POST /api/swaps` (auth) |
| List my swap requests | `GET /api/swaps` (auth) |
| Accept / reject / complete | `PATCH /api/swaps/:id` `{status}` or `/accept` `/reject` `/complete` (auth) |
| List my chats | `GET /api/chats` (auth) |
| Start/find a chat with a user | `POST /api/chats/start` `{peerId or peerName}` (auth) |
| Send a message | `POST /api/chats/:id/messages` `{text}` (auth) |

All `(auth)` routes require `Authorization: Bearer <token>`, which the
frontend's Axios client attaches automatically once you're logged in
(token is stored in `localStorage` as `mahara_token`).

## 6. Manual test checklist

With both servers running:

1. **Register** — go to "إنشاء حساب", fill all 3 steps, submit → you land
   on the success screen and are logged in (token stored).
2. **Logout** — click "خروج" in the navbar → token cleared, protected
   tabs become inaccessible.
3. **Login** — use the account you just registered → redirected to the
   skills tab.
4. **Auth persistence** — refresh the page while logged in → `GET
   /api/auth/me` repopulates the session from the stored token.
5. **Profile** — open "ملفي الشخصي", edit name/title/location/bio, add a
   "teach" and "learn" skill → all persist (`PUT` / `POST` calls above).
6. **Skills** — open "المهارات", add a new skill via "إضافة مهارة
   جديدة" → it appears in the grid and is also added to your profile's
   teach list. Search and category filters hit the backend live.
7. **Users** — `GET /api/users?search=...&skill=...` (there's no
   dedicated "browse users" page in the current UI, but the endpoint is
   ready for one, and it's used internally to match chat peers by name).
8. **Swap requests** — click "طلب تبادل" on any skill (not your own),
   pick what you'll offer, submit → shows up under "التبادلات" for both
   sides. Accept/reject/complete transitions work and update
   `swapsCompleted` on both users when completed.
9. **Messages** — start a chat from a skill card or an accepted swap →
   send messages, they persist per chat thread.

## 7. Important note on this delivery

This code was written and syntax-checked (Node's `--check` for every
backend file, TypeScript's syntactic parser for every frontend
file/JSX) in a sandboxed environment **with no network access**, so
`npm install` couldn't be run here and the app could not be started or
click-tested end-to-end in this session. Please run steps 2–3 above on
your machine to install dependencies and do the actual test pass — the
checklist in section 6 is written to walk you through exactly that.
