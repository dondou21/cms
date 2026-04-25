# Church Management System (CMS)

A premium, modern, and secure management platform for church administrations. Built with a decoupled architecture, this system supports both local desktop usage and remote web-based access.

## 🚀 Features

- **Modern Dashboard**: Real-time stats for members, monthly giving, and attendance.
- **Member Management**: Comprehensive tracking of members, ministries, and status.
- **Financial Tracking**: Record tithes, offerings, and donations with CSV export capabilities.
- **Event & Attendance**: Schedule church events and track attendee presence.
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

## 🌐 Web Deployment (Remote Access)

### 1. Database (Supabase)
- Create a free project on [Supabase](https://supabase.com).
- Copy your PostgreSQL connection string into `DATABASE_URL`.

### 2. Backend (Render / Railway)
- Connect your GitHub repo to [Render](https://render.com).
- Create a **Web Service**.
- Build Command: `npm install`
- Start Command: `npm run server:start`
- Add environment variables: `DATABASE_URL`, `JWT_SECRET`.

### 3. Frontend (Vercel)
- Connect your GitHub repo to [Vercel](https://vercel.com).
- Set `NEXT_PUBLIC_API_URL` to your **Render Backend URL**.
- Deploy.

## 📦 Packaging for Desktop

To create a standalone `.exe` for Windows:
```bash
npm run build
```
The output will be in the `dist/` folder.

## 📄 License
MIT
