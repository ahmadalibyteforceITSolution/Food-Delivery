# Elysium Eats - Premium Food Delivery Platform

A modern, full-stack food delivery application built with Vue 3, Vite, and Node.js.

## 📁 Project Structure

```text
food-panda-restaurant/
├── backend/            # Express.js Server & MongoDB Models
│   ├── server.js       # Main API & Sitemap logic
│   ├── seed.js         # Database seeding script
│   └── .env            # Environment variables (DB URI, Email)
├── frontend/           # Vue 3 Frontend (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── stores/     # Pinia State Management
│   │   └── views/      # Page components
│   └── public/         # Static assets
├── vercel.json         # Deployment configuration
└── package.json        # Root scripts for monorepo management
```

## 🚀 Getting Started

### 1. Installation
Install dependencies for both frontend and backend:
```bash
npm run install:all
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory with:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
EMAIL_USER=your_gmail
EMAIL_PASS=your_gmail_app_password
```

### 3. Running the Project

**Run both Frontend & Backend (Recommended):**
```bash
npm run dev
```

**Run Separately:**
- Frontend only: `npm run dev:frontend`
- Backend only: `npm run dev:backend`

## 🛠 Features
- **Dynamic SEO**: Automatically updated meta tags and sitemap.
- **Blog System**: 100+ culinary articles with pagination.
- **Premium UI**: Tailwind CSS powered luxury design.
- **Real-time Cart**: Powered by Pinia.
