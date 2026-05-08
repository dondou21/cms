/**
 * migrate_missing_tables.js
 * ─────────────────────────
 * One-time migration: adds tables that existed only in schema_pg.sql
 * but were missing from the local SQLite database.
 * Safe to re-run — all statements use CREATE TABLE IF NOT EXISTS.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Could not open database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to database:', DB_PATH);
});

const statements = [
    // events_list column added to service_orders
    `ALTER TABLE service_orders ADD COLUMN events_list TEXT`,

    // Service Reports
    `CREATE TABLE IF NOT EXISTS service_reports (
        id                 INTEGER PRIMARY KEY AUTOINCREMENT,
        date               TEXT NOT NULL,
        programme          TEXT,
        organisateur       TEXT,
        departement        TEXT DEFAULT 'SECRETARIAT',
        adults_men         INTEGER DEFAULT 0,
        adults_women       INTEGER DEFAULT 0,
        juniors_boys       INTEGER DEFAULT 0,
        juniors_girls      INTEGER DEFAULT 0,
        visitors_total     INTEGER DEFAULT 0,
        visitors_joining   INTEGER DEFAULT 0,
        salvation_total    INTEGER DEFAULT 0,
        salvation_joining  INTEGER DEFAULT 0,
        problems           TEXT,
        general_remarks    TEXT,
        created_at         TEXT DEFAULT (datetime('now'))
    )`,

    // Report Visitors
    `CREATE TABLE IF NOT EXISTS report_visitors (
        id                 INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id          INTEGER,
        full_name          TEXT NOT NULL,
        phone              TEXT,
        wants_to_join      INTEGER DEFAULT 0,
        is_convert         INTEGER DEFAULT 0,
        created_at         TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (report_id) REFERENCES service_reports(id) ON DELETE CASCADE
    )`,

    // Finance Reports ← this is what was causing the "add data" error
    `CREATE TABLE IF NOT EXISTS finance_reports (
        id                 INTEGER PRIMARY KEY AUTOINCREMENT,
        date               TEXT NOT NULL,
        programme          TEXT,
        stars_on_service   TEXT,
        remarks            TEXT,
        responsible_name   TEXT,
        cash_breakdown     TEXT,
        category_breakdown TEXT,
        created_at         TEXT DEFAULT (datetime('now'))
    )`,

    // Department Roles
    `CREATE TABLE IF NOT EXISTS department_roles (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id  INTEGER,
        member_id      INTEGER,
        role_name      TEXT,
        created_at     TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
        FOREIGN KEY (member_id)     REFERENCES members(id)     ON DELETE CASCADE
    )`,

    // Department Programs
    `CREATE TABLE IF NOT EXISTS department_programs (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id  INTEGER,
        day_of_week    TEXT,
        time           TEXT,
        activity       TEXT,
        created_at     TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
    )`,
];

db.serialize(() => {
    statements.forEach((sql, i) => {
        db.run(sql, (err) => {
            const label = sql.trim().split('\n')[0].substring(0, 60);
            if (err) {
                // ALTER TABLE will fail if column already exists — that's fine, ignore it
                if (err.message.includes('duplicate column')) {
                    console.log(`⚠️  Skipped (already exists): ${label}`);
                } else {
                    console.error(`❌ Failed [${i + 1}]: ${label}`);
                    console.error('   →', err.message);
                }
            } else {
                console.log(`✅ OK [${i + 1}]: ${label}`);
            }
        });
    });
});

db.close((err) => {
    if (err) console.error('Error closing DB:', err.message);
    else console.log('\n🎉 Migration complete. All missing tables are now in database.sqlite');
});
