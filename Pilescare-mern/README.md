# 🏥 ProctoCare by Vishva — Full-Stack MERN Website

A production-ready clinic website with **GSAP animations**, **MongoDB backend**, and a full **admin dashboard**.

---

## 📁 Project Structure

```
proctocare-mern/
├── backend/          ← Node.js + Express + MongoDB API
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   └── .env.example
└── frontend/         ← React + Vite + GSAP + Tailwind
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── lib/
    │   └── pages/
    └── index.html
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher → https://nodejs.org
- **MongoDB** running locally OR a free **MongoDB Atlas** cluster → https://cloud.mongodb.com
- A code editor (VS Code recommended)

---

## 🚀 Setup & Launch (Step by Step)

### Step 1 — Install dependencies

Open **two terminals** side by side.

**Terminal 1 — Backend:**
```bash
cd proctocare-mern/backend
npm install
```

**Terminal 2 — Frontend:**
```bash
cd proctocare-mern/frontend
npm install
```

---

### Step 2 — Configure the backend environment

```bash
cd proctocare-mern/backend
cp .env.example .env
```

Then open `.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/proctocare
JWT_SECRET=replace_with_any_long_random_string_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

ADMIN_EMAIL=admin@proctocarebyvishva.com
ADMIN_PASSWORD=YourStrongPassword123!
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string.

---

### Step 3 — Create the admin account (run once)

```bash
cd proctocare-mern/backend
npm run create-admin
```

You should see: `✅ Admin created: admin@proctocarebyvishva.com`

---

### Step 4 — Start both servers

**Terminal 1 — Start backend** (runs on http://localhost:5000):
```bash
cd proctocare-mern/backend
npm run dev
```

**Terminal 2 — Start frontend** (runs on http://localhost:5173):
```bash
cd proctocare-mern/frontend
npm run dev
```

---

## 🌐 Open in browser

| URL | What |
|-----|------|
| http://localhost:5173 | Main website |
| http://localhost:5173/admin/login | Admin panel login |
| http://localhost:5000/api/health | API health check |

---

## 🔑 Admin Panel

Go to `http://localhost:5173/admin/login` and sign in with the credentials from your `.env` file.

**Tabs available:**
- **Appointments** — view, filter, and update status of all bookings
- **Services** — add/edit/delete clinic services
- **Blog** — write and publish articles with HTML preview
- **Reviews** — manage patient testimonials
- **FAQs** — manage FAQ content by category
- **Settings** — update clinic name, address, hours, Google Maps embed

---

## 📦 Build for Production

```bash
# Build frontend
cd proctocare-mern/frontend
npm run build
# Output is in frontend/dist/

# Run backend in production
cd proctocare-mern/backend
NODE_ENV=production npm start
```

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS |
| Animations | GSAP 3 + ScrollTrigger, Lenis smooth scroll, SplitType |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| UI | Lucide React, Sonner (toasts) |

---

## 📝 Customise for your clinic

1. **Doctor photo** — replace the `src` URL in `AboutDoctor.jsx` and `Home.jsx`
2. **Phone number** — search for `+91 99999 99999` and replace in `Navbar.jsx`, `Footer.jsx`, `Contact.jsx`
3. **Clinic address** — update via the admin panel → Settings tab
4. **Brand colours** — edit `tailwind.config.js` → `colors.brand`
5. **Services** — add via admin panel → Services tab

---

## ❓ Common Issues

**MongoDB connection refused**
→ Make sure MongoDB is running: `mongod` or start MongoDB Compass

**Port 5000 already in use**
→ Change `PORT=5001` in `.env` and update `vite.config.js` proxy target

**Admin password forgotten**
→ Delete the user from MongoDB and re-run `npm run create-admin`
