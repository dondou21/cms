-- ============================================================
-- PostgreSQL Schema for Church Management System (CMS)
-- Optimized for Supabase / Remote Hosting
-- ============================================================

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    description  TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (System Access)
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50) DEFAULT 'Viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Members Table
CREATE TABLE IF NOT EXISTS members (
    id            SERIAL PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255),
    phone         VARCHAR(50),
    address       TEXT,
    status        VARCHAR(50) DEFAULT 'active',
    department_id INTEGER,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Giving Table (Tithes & Offerings)
CREATE TABLE IF NOT EXISTS givings (
    id         SERIAL PRIMARY KEY,
    member_id  INTEGER,
    amount     DECIMAL(12, 2) NOT NULL,
    date       DATE NOT NULL,
    type       VARCHAR(100) DEFAULT 'Offering',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    date             DATE NOT NULL,
    time             VARCHAR(50),
    location         VARCHAR(255),
    attendance_count INTEGER DEFAULT 0,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id         SERIAL PRIMARY KEY,
    event_id   INTEGER NOT NULL,
    member_id  INTEGER NOT NULL,
    status     VARCHAR(50) DEFAULT 'Present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_member_att FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE (event_id, member_id)
);
