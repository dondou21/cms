-- ============================================================
-- SQLite Schema for Church Management System (CMS)
-- Compatible with SQLite 3 — used for offline desktop mode
-- ============================================================

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    description  TEXT,
    created_at   TEXT DEFAULT (datetime('now'))
);

-- Users Table (System Access)
CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    role       TEXT DEFAULT 'Viewer',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Members Table
CREATE TABLE IF NOT EXISTS members (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    email         TEXT,
    phone         TEXT,
    address       TEXT,
    invited_by    TEXT,
    referral_source TEXT,
    age_range     TEXT,
    marital_status TEXT,
    status        TEXT DEFAULT 'active',
    department_id INTEGER,
    created_at    TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Giving Table (Tithes & Offerings)
CREATE TABLE IF NOT EXISTS givings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id  INTEGER,
    amount     REAL NOT NULL,
    date       TEXT NOT NULL,
    type       TEXT DEFAULT 'Offering',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT NOT NULL,
    description      TEXT,
    date             TEXT NOT NULL,
    time             TEXT,
    location         TEXT,
    attendance_count INTEGER DEFAULT 0,
    created_at       TEXT DEFAULT (datetime('now'))
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id   INTEGER NOT NULL,
    member_id  INTEGER NOT NULL,
    status     TEXT DEFAULT 'Present',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (event_id)  REFERENCES events(id)  ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE (event_id, member_id)
);

-- Service Orders (Déroulés) Persistence
CREATE TABLE IF NOT EXISTS service_orders (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id         INTEGER,
    title            TEXT,
    date             TEXT,
    description      TEXT,
    location         TEXT,
    theme            TEXT,
    sequences        TEXT, -- JSON Array
    announcements    TEXT, -- JSON Array
    created_at       TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);