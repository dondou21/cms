# 🚀 Deployment Guide (Web App)

Follow these steps to make your Church Management System (CMS) accessible as a live web application.

---

### 1. Database Setup (Supabase)
Your database is already live on Supabase.
- **Connection String**: Ensure the `DATABASE_URL` in your production environment matches the one in your `.env`.
- **SSL**: Supabase requires SSL, which is handled automatically by the `pg` driver in the backend.

---

### 2. Backend Deployment (API)
The backend is a Node.js/Express application.

- **Platform**: [Render.com](https://render.com)
- **Steps**:
    1.  **New Web Service**: Create a new Web Service on Render.
    2.  **Connect GitHub**: Connect your repository.
    3.  **Root Directory**: Set to `server`.
    4.  **Build Command**: `npm install`
    5.  **Start Command**: `node index.js`
    6.  **Environment Variables**:
        - `DATABASE_URL`: Your Supabase PostgreSQL string.
        - `JWT_SECRET`: A long random string for security.
        - `PORT`: `5000` (Render will override this, but it's good for fallback).
        - `NODE_ENV`: `production`.

---

### 3. Frontend Deployment (UI)
The frontend is a Next.js application.

- **Platform**: [Vercel](https://vercel.com)
- **Steps**:
    1.  **New Project**: Create a new project on Vercel.
    2.  **Framework**: Next.js (detected automatically).
    3.  **Environment Variables**:
        - `NEXT_PUBLIC_API_URL`: Set this to your **Render Backend URL** (e.g., `https://impact-cms-api.onrender.com/api`).
    4.  **Deploy**: Click deploy.

---

### 4. Custom Domains (Optional)
- You can point a custom domain (e.g., `cms.yourchurch.org`) to your Vercel deployment via the Vercel Dashboard.

---

### 5. Post-Deployment Verification
1.  Navigate to your Vercel URL.
2.  Log in with your Admin credentials.
3.  Test the **Members**, **Attendance**, and **Giving** pages to ensure they communicate correctly with the Render API.

---

## 🔒 Security Best Practices
- **Secrets**: Never commit your `.env` file to GitHub.
- **CORS**: Ensure your backend `server/index.js` allows requests from your Vercel domain.
- **Backups**: Use Supabase's automatic backup feature to protect your data.
