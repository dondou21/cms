const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./config/db');

// Paths
const SCHEMA_SQLITE = path.join(__dirname, 'config', 'schema.sql');
const SCHEMA_PG = path.join(__dirname, 'config', 'schema_pg.sql');

async function initDB() {
    const isPG = !!process.env.DATABASE_URL;
    console.log(`--- Initializing ${isPG ? 'PostgreSQL (Supabase)' : 'SQLite'} Database ---`);

    try {
        const schemaPath = isPG ? SCHEMA_PG : SCHEMA_SQLITE;
        const schemaString = fs.readFileSync(schemaPath, 'utf8');
        
        // Split schema into individual statements
        // PostgreSQL handles multiple statements better in one go, but let's be safe
        const statements = schemaString.split(';').filter(s => s.trim());
        
        for (const stmt of statements) {
            await db.execute(stmt);
        }
        console.log('Schema created successfully.');

        // Seed initial admin users
        const passwordHash = await bcrypt.hash('password123', 10);
        const users = [
            { name: 'System Admin',    email: 'admin@church.com',     role: 'Admin' },
            { name: 'Pastor David',    email: 'pastor@church.com',    role: 'Pastor/Leader' },
            { name: 'Secretary Sarah', email: 'secretary@church.com', role: 'Secretary/Clerk' },
            { name: 'Finance Officer', email: 'finance@church.com',   role: 'Finance Officer' },
            { name: 'Church Member',   email: 'viewer@church.com',    role: 'Viewer' }
        ];

        for (const user of users) {
            // Check if user exists (PostgreSQL and SQLite both support this syntax)
            const [existing] = await db.execute('SELECT id FROM users WHERE email = $1', [user.email]);
            if (existing.length === 0) {
                await db.execute(
                    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                    [user.name, user.email, passwordHash, user.role]
                );
                console.log(`Created user: ${user.email}`);
            }
        }

        console.log('--- Database Initialization Complete ---');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

if (require.main === module) {
    initDB().then(() => {
        console.log('Done.');
        process.exit(0);
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { initDB };
