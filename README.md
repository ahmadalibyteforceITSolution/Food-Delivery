# Food Panda Restaurant

A full‑stack food‑delivery application with a **Vue 3 + Vite** frontend and an **Express** backend.

## Project structure
```
Food panda Restaurant/
├─ backend/      # Express API
├─ frontend/    # Vue 3 SPA (Vite)
├─ vercel.json  # Vercel deployment configuration
└─ README.md    # <‑ you are here
```

## Local development
1. **Install dependencies**
   ```bash
   # Backend
   cd "backend"
   npm install   # may need to run with PowerShell execution‑policy bypass
   
   # Frontend
   cd "../frontend"
   npm install
   ```
2. **Run the services**
   ```bash
   # Backend (development)
   cd backend && npm start
   
   # Frontend (development server)
   cd ../frontend && npm run dev
   ```
   The frontend expects the API at `http://localhost:5000/api/...`.

## Vercel deployment
The repository contains a `vercel.json` that tells Vercel to:
- Build the Vue app as a static site (`frontend/dist`).
- Proxy any request matching `/api/*` to the Express server (`backend/server.js`).
- Serve all other routes from the built static files.

### Steps to deploy
1. Push the repository to GitHub (or any Git provider).
2. In the Vercel dashboard, **Import Project** and select the repo.
3. Vercel will automatically detect the `vercel.json` and run:
   - `npm install` in both `frontend` and `backend`
   - `npm run build` in `frontend` (Vite) to generate `dist/`
4. Once the build finishes, Vercel will provide a live URL.

> **Note** – If you encounter the PowerShell execution‑policy error while running `npm install` locally, open PowerShell **as Administrator** and run:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```
> Then re‑run `npm install`.

## Environment variables
Create a `.env` file in `backend/` (copy from `.env.example`) with at least:
```
MONGO_URI=your_mongodb_uri
RESEND_API_KEY=your_resend_key   # optional – email notifications
RESEND_FROM_EMAIL=your_from_email
ADMIN_EMAIL=admin@example.com    # optional
``` 
The frontend can also use a `.env` file for Vite if needed.

---
Enjoy building and deploying your food‑delivery platform! 🎉
