# Database Access Guide

To access the database and view all data for the Church Management System, follow these steps:

## 1. Access the Supabase Dashboard
The project uses **Supabase** as its backend and database provider.

1.  Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2.  Log in with the credentials provided to you during setup.
3.  Select your project (e.g., **ICC Kigali CMS**).

## 2. Viewing Data (Table Editor)
1.  On the left sidebar, click on the **Table Editor** icon (it looks like a grid).
2.  You will see the following tables:
    *   `members`: All church members and visitors (including integration data).
    *   `attendance`: Attendance records for different services.
    *   `givings`: Financial contributions (Tithes, Offerings, etc.).
    *   `events`: Scheduled church events.
    *   `departments`: List of church ministries.
3.  Click on any table to see the raw data. You can filter, sort, and export it directly to CSV or Excel.

## 3. Running Custom Queries (SQL Editor)
If you want to perform more complex searches:
1.  Click on the **SQL Editor** icon in the sidebar.
2.  Click **New Query**.
3.  Example query to see all members joined in the last month:
    ```sql
    SELECT * FROM members WHERE created_at > now() - interval '1 month';
    ```

## 4. Connection Details (Technical)
If you want to use an external tool like **DBeaver** or **TablePlus**:
*   **Host**: `aws-0-us-east-1.pooler.supabase.com` (Check your Supabase settings for exact host)
*   **Port**: `5432`
*   **User**: `postgres.your_project_id`
*   **Password**: [Your Database Password]

## 5. Updating Schema (New Integration Fields)
If you see errors when saving new visitors, you may need to add the missing columns to the `members` table. Run this in the **SQL Editor**:

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
