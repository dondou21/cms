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
    events_list      TEXT, -- JSON Array
    announcements    TEXT, -- JSON Array
    created_at       TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- Service Reports (Fiche de Rapport — Secrétariat)
CREATE TABLE IF NOT EXISTS service_reports (
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
);

-- Report Visitors (linked to service_reports)
CREATE TABLE IF NOT EXISTS report_visitors (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id          INTEGER,
    full_name          TEXT NOT NULL,
    phone              TEXT,
    wants_to_join      INTEGER DEFAULT 0, -- 0/1 boolean
    is_convert         INTEGER DEFAULT 0, -- 0/1 boolean
    created_at         TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (report_id) REFERENCES service_reports(id) ON DELETE CASCADE
);

-- Finance Reports (Rapport des Dîmes et Offrandes)
CREATE TABLE IF NOT EXISTS finance_reports (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    date               TEXT NOT NULL,
    programme          TEXT,
    stars_on_service   TEXT,
    remarks            TEXT,
    responsible_name   TEXT,
    cash_breakdown     TEXT, -- JSON stored as TEXT
    category_breakdown TEXT, -- JSON stored as TEXT
    created_at         TEXT DEFAULT (datetime('now'))
);

-- Department Roles
CREATE TABLE IF NOT EXISTS department_roles (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id  INTEGER,
    member_id      INTEGER,
    role_name      TEXT,
    created_at     TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Department Weekly Programs
CREATE TABLE IF NOT EXISTS department_programs (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id  INTEGER,
    day_of_week    TEXT,
    time           TEXT,
    activity       TEXT,
    created_at     TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);