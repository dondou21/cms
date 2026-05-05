const db = require('./config/db');

async function migrate() {
    console.log("--- Creating Finance Reports Table ---");
    
    const query = `
    CREATE TABLE IF NOT EXISTS finance_reports (
        id                 SERIAL PRIMARY KEY,
        date               DATE NOT NULL,
        programme          VARCHAR(255),
        stars_on_service   TEXT,
        remarks            TEXT,
        responsible_name   VARCHAR(255),
        cash_breakdown     JSONB,
        category_breakdown JSONB,
        created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    try {
        await db.execute(query);
        console.log("Finance Reports table created successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    }
}

migrate();
