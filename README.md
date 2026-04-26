# Church Management System (CMS) - Impact Center

A premium, modern, and secure management platform for church administrations. Built with a decoupled architecture, this system supports both local desktop usage and remote web-based access.

## 🚀 Features

- **Modern Dashboard**: Real-time stats for members, monthly giving, and attendance.
- **Member Management**: Comprehensive tracking of members, ministries, and status.
- **Financial Tracking**: Record tithes, offerings, and donations with CSV export capabilities.
- **Event & Attendance**: Schedule church events and track attendee presence.
- **Integration Dashboard**: Manage first-time visitors with a digital version of the physical "Fiche de Bienvenue."
- **Secure Authentication**: Role-based access control (Admin, Pastor, Secretary, Finance) using JWT.
- **Cloud Database**: Powered by Supabase (PostgreSQL) for remote access from any device.
- **Desktop Ready**: Packaged with Electron for offline/local desktop usage.

## 🛠 Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js, JWT Auth.
- **Database**: PostgreSQL (via Supabase).
- **Desktop**: Electron.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Supabase account (for database hosting)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dondou21/cms.git
   cd cms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   JWT_SECRET=your_secret_key
   PORT=5000
   DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Initialize the Database:
   ```bash
   node server/init_db.js
   ```

### Running Locally

To run the full development environment (Next.js + Express + Electron):
```bash
npm run dev
```

---

## 🗄 Database Management

Your data is hosted on **Supabase (PostgreSQL)**. To view, edit, or export your data directly:

1.  **Login**: Go to [Supabase Dashboard](https://supabase.com/dashboard).
2.  **Project**: Select your project (**Impact Center CMS**).
3.  **Table Editor**: Click the "Table Editor" icon on the left sidebar to see all tables (`members`, `givings`, `events`, `service_reports`, etc.).
4.  **SQL Editor**: You can run custom queries or migrations using the "SQL Editor".
5.  **Export**: From the Table Editor, you can click "Export to CSV" to download any table.

---

## 🌐 Web Deployment (Remote Access)

Follow these steps to make your app accessible as a website.

### 1. Database Setup (Done)
- Your database is already live on Supabase.
- Ensure the `DATABASE_URL` in your production environment is set to the connection string provided in your `.env`.

### 2. Backend Deployment (API)
- **Platform**: [Render.com](https://render.com) (Recommended).
- **Steps**:
    1.  Create a new **Web Service**.
    2.  Connect your GitHub repository.
    3.  **Root Directory**: `server`
    4.  **Build Command**: `npm install`
    5.  **Start Command**: `node index.js`
    6.  **Environment Variables**: Add `DATABASE_URL`, `JWT_SECRET`, and `PORT`.

### 3. Frontend Deployment (UI)
- **Platform**: [Vercel](https://vercel.com).
- **Steps**:
    1.  Create a new project and import your repository.
    2.  **Framework Preset**: Next.js.
    3.  **Environment Variables**: 
        - `NEXT_PUBLIC_API_URL`: Set this to your **Render Web Service URL** (e.g., `https://your-api.onrender.com/api`).
    4.  Deploy.

---

## 📦 Packaging for Desktop

To create a standalone `.exe` for Windows:
```bash
npm run build
```
The output will be in the `dist/` folder.

## 🔒 Security
- **JWT**: Secure token-based authentication.
- **SSL**: All database connections are encrypted using SSL.
- **Roles**: Admin, Pastor, Secretary, and Finance roles ensure users only see what they need.

## 📄 License
Private project for church administrative use.
