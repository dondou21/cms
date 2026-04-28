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
    invited_by         VARCHAR(255), -- Friend, social media, etc.
    referral_source    VARCHAR(255), -- More specific details
    age_range          VARCHAR(50),  -- Moins de 18, 18-24, etc.
    marital_status     VARCHAR(50),  -- Single, Married, etc.
    accepted_christ    BOOLEAN DEFAULT FALSE,
    want_accompaniment BOOLEAN DEFAULT FALSE,
    usual_church       BOOLEAN DEFAULT FALSE,
    want_to_join_icc   BOOLEAN DEFAULT FALSE,
    desires_contact_leader BOOLEAN DEFAULT FALSE,
    desires_impact_group   BOOLEAN DEFAULT FALSE,
    desires_house_church   BOOLEAN DEFAULT FALSE,
    desires_formation_001  BOOLEAN DEFAULT FALSE,
    info_request_mui       BOOLEAN DEFAULT FALSE,
    info_request_events    BOOLEAN DEFAULT FALSE,
    join_gs                BOOLEAN DEFAULT FALSE, -- Follow-up Group
    comments               TEXT,
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

-- Service Reports (Fiche de Rapport)
CREATE TABLE IF NOT EXISTS service_reports (
    id                 SERIAL PRIMARY KEY,
    date               DATE NOT NULL,
    programme          VARCHAR(255),
    organisateur       VARCHAR(255),
    departement        VARCHAR(255) DEFAULT 'SECRETARIAT',
    -- Attendance Stats
    adults_men         INTEGER DEFAULT 0,
    adults_women       INTEGER DEFAULT 0,
    juniors_boys       INTEGER DEFAULT 0,
    juniors_girls      INTEGER DEFAULT 0,
    -- Integration Stats
    visitors_total     INTEGER DEFAULT 0,
    visitors_joining   INTEGER DEFAULT 0,
    salvation_total    INTEGER DEFAULT 0,
    salvation_joining  INTEGER DEFAULT 0,
    -- Remarks
    problems           TEXT,
    general_remarks    TEXT,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS report_visitors (
    id                 SERIAL PRIMARY KEY,
    report_id          INTEGER REFERENCES service_reports(id) ON DELETE CASCADE,
    full_name          VARCHAR(255) NOT NULL,
    phone              VARCHAR(50),
    wants_to_join      BOOLEAN DEFAULT FALSE,
    is_convert         BOOLEAN DEFAULT FALSE,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Orders (Déroulés) Persistence
CREATE TABLE IF NOT EXISTS service_orders (
    id               SERIAL PRIMARY KEY,
    event_id         INTEGER REFERENCES events(id) ON DELETE SET NULL,
    title            VARCHAR(255),
    date             VARCHAR(255),
    description      TEXT,
    location         VARCHAR(255),
    theme            VARCHAR(255),
    sequences        JSONB, -- Array of ServiceItem
    announcements    JSONB, -- Array of Announcement
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
