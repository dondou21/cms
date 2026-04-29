const db = require('./config/db');

async function migrate() {
    console.log('--- Starting Migration: STAR Members & Departments ---');
    try {
        const isPG = !!process.env.DATABASE_URL;
        
        if (isPG) {
            // Update Members
            await db.execute('ALTER TABLE members ADD COLUMN IF NOT EXISTS is_star BOOLEAN DEFAULT FALSE');
            await db.execute('ALTER TABLE members ADD COLUMN IF NOT EXISTS remarks TEXT');
            
            // New tables (using CREATE TABLE IF NOT EXISTS from schema)
            const newTables = [
                `CREATE TABLE IF NOT EXISTS department_roles (
                    id             SERIAL PRIMARY KEY,
                    department_id  INTEGER REFERENCES departments(id) ON DELETE CASCADE,
                    member_id      INTEGER REFERENCES members(id) ON DELETE CASCADE,
                    role_name      VARCHAR(100),
                    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`,
                `CREATE TABLE IF NOT EXISTS department_programs (
                    id             SERIAL PRIMARY KEY,
                    department_id  INTEGER REFERENCES departments(id) ON DELETE CASCADE,
                    day_of_week    VARCHAR(20),
                    time           VARCHAR(50),
                    activity       TEXT,
                    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`,
                `ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS events_list JSONB`
            ];
            
            for (const stmt of newTables) {
                await db.execute(stmt);
            }
        }
        
        console.log('--- Migration Complete ---');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit(0);
    }
}

migrate();
