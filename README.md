# Church Management System (CMS) - Impact Center

A premium, modern, and secure management platform designed for church administrations. This system provides a unified solution for tracking membership, financial contributions, and community growth.

## 🌟 Key Features

*   **Executive Dashboard**: Real-time visualization of key performance indicators (KPIs) including growth trends and monthly giving.
*   **Member Lifecycle Management**: Track individuals from their first visit (Fiche de Bienvenue) to active membership.
*   **Automated Integration Pipeline**: Specialized workflow for the Integration Department to track prospects and converts.
*   **Financial Integrity**: Secure recording of tithes and offerings with comprehensive reporting and export features.
*   **Dual-Mode Operation**: Seamlessly transition between local desktop usage (Electron) and global web access.

## 🛠 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js (App Router), Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, JWT Authentication |
| **Database** | PostgreSQL (Supabase) |
| **Desktop** | Electron |
| **UI Icons** | Lucide Icons |

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Supabase recommended)

### Quick Start
1.  **Clone & Install**:
    ```bash
    git clone https://github.com/dondou21/cms.git
    cd cms
    npm install
    ```
2.  **Environment Setup**:
    Configure your `.env` with `DATABASE_URL` and `JWT_SECRET`.
3.  **Launch**:
    ```bash
    npm run dev
    ```

## 📂 Documentation

For detailed guides, please refer to the following:

- [**Deployment Guide**](./DEPLOYMENT.md): Detailed steps for hosting the API and Frontend.
- [**Database Management**](./README.md#database-access): (See below)

### Database Access
Your data is managed via **Supabase**. Administrative access is available through the [Supabase Dashboard](https://supabase.com/dashboard). 
- Use the **Table Editor** for manual data corrections.
- Use the **SQL Editor** for advanced reporting and migrations.

## 🔒 Security & Compliance
- **RBAC**: Role-Based Access Control (Admin, Pastor, Secretary, Finance).
- **Data Privacy**: All sensitive information is encrypted at rest and in transit (SSL/TLS).

## 📄 License
Private and Confidential. (c) 2024 Impact Center Church.
