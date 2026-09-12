const connectDB = require('./config/db');
const mongoose = require('mongoose');
const http = require('http');

// Simple integration test for backend APIs
async function runTests() {
  console.log('🚀 Starting LifeQuest RPG Backend E2E Test Suite...');

  // Start DB
  await connectDB();
  const app = require('./server');

  // Let server listen on test port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5001, resolve));
  console.log('✅ Server listening on test port 5001');

  const baseURL = 'http://localhost:5001/api';

  async function request(path, options = {}) {
    const res = await fetch(`${baseURL}${path}`, {
      headers: {
        'Content-[# API Endpoints]
- `POST /api/auth/register` (Registers user, hashes password, returns JWT token & user stats)
- `POST /api/auth/login` (Authenticates user, returns JWT token & user stats)
- `GET /api/auth/me` (Gets current user profile)
- `GET /api/tasks` (Gets user's active/completed quests)
- `POST /api/tasks` (Creates quest with server-calculated rewards)
- `PUT /api/tasks/:id` (Updates quest details)
- `DELETE /api/tasks/:id` (Deletes quest)
- `POST /api/tasks/:id/complete` (Completes quest authoritatively: grants XP, Gold, Stat points, updates streak, checks level-up)
- `GET /api/character/me` (Gets hero attributes & level progress)
- `GET /api/character/transactions` (Gets transaction history)
- `GET /api/shop` (Gets merchant item catalog & purchase status)
- `POST /api/shop/:itemId/buy` (Purchases item, deducts Gold, adds to inventory)
- `GET /api/inventory` (Gets hero inventory items)
- `PUT /api/inventory/:id/equip` (Equips/unequips item)

---

## 🎮 RPG Progression System

### Non-Linear Leveling Formula
```js
function getRequiredXP(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}
```
- **Level 1**: 100 XP
- **Level 2**: 282 XP
- **Level 3**: 519 XP
- **Level 5**: 1,118 XP
- **Level 10**: 3,162 XP

### Difficulty Rewards
| Difficulty | XP Reward | Gold Reward | Attribute Points |
| :--- | :--- | :--- | :--- |
| **Easy** | 50 XP | 10 Gold | +2 Stat Points |
| **Medium** | 100 XP | 20 Gold | +4 Stat Points |
| **Hard** | 175 XP | 35 Gold | +7 Stat Points |
| **Epic** | 300 XP | 60 Gold | +12 Stat Points |

---

## 💻 Local Setup & Execution

### Prerequisites
- **Node.js**: v18+
- **NPM**: v9+

### 1. Clone & Install Dependencies
```bash
# Install root, backend, and frontend packages
npm run setup
```

### 2. Configure Environment Variables
- **Backend `.env`** (`d:/hackton/backend/.env`):
```env
PORT=5000
MONGODB_URI=
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```
*Note: If `MONGODB_URI` is left blank, the application automatically initializes an in-memory MongoDB server (`mongodb-memory-server`) for instant offline execution.*

- **Frontend `.env`** (`d:/hackton/frontend/.env`):
```env
VITE_API_URL=/api
```

### 3. Run Locally (Full-Stack Mode)
```bash
npm start
```
This runs Express backend on `http://localhost:5000` and Vite React frontend on `http://localhost:5173`.

---

## 🔒 Security & Data Isolation
- **Password Hashing**: Passwords stored using `bcryptjs` with salt rounds.
- **JWT Authentication**: Protected API routes require a valid `Bearer <token>`.
- **Authoritative Server**: Frontend never dictates XP, Gold, Level, or item prices; all computations are executed and validated on the backend.
- **User Scoping**: Database queries strictly filter by `userId` to guarantee full multi-tenant data isolation.

---

## 🚀 Production Deployment
- **Frontend**: Deploy `frontend/dist` to **Vercel** or **Netlify**.
- **Backend**: Deploy `backend/` to **Render**, **Railway**, or **Fly.io**.
- **Database**: Connect to **MongoDB Atlas**.
