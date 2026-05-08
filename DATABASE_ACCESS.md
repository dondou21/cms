# Database Access Guide

## How the Database Works (Dual-Mode Architecture)

The app automatically uses **two different databases** depending on the environment:

| Mode | Database | When Active |
|---|---|---|
| **Online / Web** | PostgreSQL on **Supabase** (cloud) | `DATABASE_URL` is set in `.env` |
| **Offline / Local** | SQLite (`server/database.sqlite`) | No `DATABASE_URL`, or Supabase unreachable |

The switcher logic is in `server/config/db.js`. Both modes share the exact same API — the frontend never knows which one is active.

---

## All Database Tables

| Table | Purpose |
|---|---|
| `members` | Church members & visitors (integration data) |
| `users` | CMS login accounts |
| `departments` | Church ministry departments |
| `department_roles` | Member roles within each department |
| `department_programs` | Weekly schedules per department |
| `events` | Church events |
| `attendance` | Event attendance records |
| `givings` | General financial contributions |
| `finance_reports` | Official Dîmes & Offrandes reports (Finance Dept) |
| `service_reports` | Service summary reports (Secrétariat) |
| `report_visitors` | Visitors listed in a service report |
| `service_orders` | Déroulé / service order plans |

---

## 1. Access the Supabase Dashboard (Online Mode)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in and select your project (**ICC Kigali CMS**).
3. Use **Table Editor** to browse data or **SQL Editor** for custom queries.

### Example — All finance reports this month:
```sql
SELECT * FROM finance_reports
WHERE date >= date_trunc('month', now())
ORDER BY date DESC;
```

### Example — All members joined in the last month:
```sql
SELECT * FROM members WHERE created_at > now() - interval '1 month';
```

---

## 2. Access SQLite (Offline / Local Mode)

The local database file is at: `server/database.sqlite`

Use **DB Browser for SQLite** (free, download at [sqlitebrowser.org](https://sqlitebrowser.org)) to open and inspect the file visually.

To switch to offline mode: comment out `DATABASE_URL` in `.env`.

---

## 3. Connection Details (External Tools — Online Mode)

For **DBeaver** or **TablePlus**:
- **Host**: Check Supabase project settings → Database → Connection string
- **Port**: `5432`
- **User**: `postgres.your_project_id`
- **Password**: Your database password from Supabase

---

## 4. Common Maintenance Commands

```bash
# Re-initialize all tables + seed default users (safe, uses IF NOT EXISTS)
cd server && node init_db.js

# Apply missing tables to an existing local SQLite DB (safe, non-destructive)
cd server && node migrate_missing_tables.js

# Start the backend server
cd server && npm run dev
```

---

## 5. Schema Fixes (If Needed on Supabase)

If you see errors saving new visitors on the web version, run this in the **SQL Editor**:

```sql
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS desires_contact_leader BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS desires_impact_group BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS desires_house_church BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS desires_formation_001 BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS info_request_mui BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS info_request_events BOOLEAN DEFAULT FALSE;
```

> [!CAUTION]
> Be careful when editing data directly in the database, as it may bypass application logic or validation rules. Always create a backup before making bulk changes.
