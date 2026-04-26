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

-- Members Table (Matching "Fiche de Bienvenue")
CREATE TABLE IF NOT EXISTS members (
    id                 SERIAL PRIMARY KEY,
    civilite           VARCHAR(20), -- Mme, Mlle, Mr
    first_name         VARCHAR(100) NOT NULL,
    last_name          VARCHAR(100) NOT NULL,
    email              VARCHAR(255),
    phone              VARCHAR(50),
    address            TEXT,
    invited_by         VARCHAR(255), -- Social media, friend, etc.
    age_range          VARCHAR(50),  -- Moins de 18, 18-24, etc.
    marital_status     VARCHAR(50),  -- Single, Married, etc.
    accepted_christ    BOOLEAN DEFAULT FALSE,
    want_accompaniment BOOLEAN DEFAULT FALSE,
    usual_church       BOOLEAN DEFAULT FALSE,
    want_to_join_icc   BOOLEAN DEFAULT FALSE,
    interests          TEXT,         -- Impact Group, House Church, etc.
    info_on            TEXT,         -- MUI, Upcoming events
    join_gs            BOOLEAN DEFAULT FALSE, -- Follow-up Group
    comments           TEXT,
    status             VARCHAR(50) DEFAULT 'active',
    department_id      INTEGER,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
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

-- Giving Table (Event-Based Tracking)
CREATE TABLE IF NOT EXISTS givings (
    id          SERIAL PRIMARY KEY,
    event_id    INTEGER, -- Linked to an event
    donor_name  VARCHAR(255), -- Optional donor name (since not linked to member table)
    amount      DECIMAL(12, 2) NOT NULL,
    date        DATE NOT NULL,
    type        VARCHAR(100) DEFAULT 'Offering', -- Tithe, Offering, etc.
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_giving FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
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
