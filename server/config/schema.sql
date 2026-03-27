-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    description  TEXT,
    created_at   TIMESTAMP DEFAULT NOW()
);

-- Users Table (System Access)
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50)  DEFAULT 'Viewer',
    created_at TIMESTAMP   DEFAULT NOW()
);

-- Members Table
CREATE TABLE IF NOT EXISTS members (
    id            SERIAL PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(100),
    phone         VARCHAR(20),
    address       TEXT,
    status        VARCHAR(20)  DEFAULT 'active',
    department_id INTEGER,
    created_at    TIMESTAMP   DEFAULT NOW(),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Giving Table (Tithes & Offerings)
CREATE TABLE IF NOT EXISTS givings (
    id         SERIAL PRIMARY KEY,
    member_id  INTEGER,
    amount     NUMERIC(15, 2) NOT NULL,
    date       DATE           NOT NULL,
    type       VARCHAR(50)    DEFAULT 'Offering',
    created_at TIMESTAMP      DEFAULT NOW(),
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    date             DATE         NOT NULL,
    time             TIME,
    location         VARCHAR(200),
    attendance_count INTEGER      DEFAULT 0,
    created_at       TIMESTAMP    DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id         SERIAL PRIMARY KEY,
    event_id   INTEGER     NOT NULL,
    member_id  INTEGER     NOT NULL,
    status     VARCHAR(50) DEFAULT 'Present',
    created_at TIMESTAMP  DEFAULT NOW(),
    FOREIGN KEY (event_id)  REFERENCES events(id)   ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id)  ON DELETE CASCADE,
    UNIQUE (event_id, member_id)
);