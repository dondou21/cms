const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Accept a custom DB path (used by Electron) or fall back to local
const DB_PATH = process.env.ELECTRON_APP_DATA
    ? path.join(process.env.ELECTRON_APP_DATA, 'cms.db')
    : path.join(__dirname, 'cms.db');

const SCHEMA_PATH = path.join(__dirname, 'config', 'schema.sql');

async function initDB() {
    console.log('--- Initializing SQLite Database ---');
    console.log('DB location:', DB_PATH);

    try {
        const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
        await db.exec('PRAGMA foreign_keys = ON');

        const schemaString = fs.readFileSync(SCHEMA_PATH, 'utf8');
        const statements = schemaString.split(';').filter(s => s.trim());
        for (const stmt of statements) await db.exec(stmt);
        console.log('Schema OK.');

        const passwordHash = await bcrypt.hash('password123', 10);
        const users = [
            { name: 'System Admin',    email: 'admin@church.com',     role: 'Admin' },
            { name: 'Pastor David',    email: 'pastor@church.com',    role: 'Pastor/Leader' },
            { name: 'Secretary Sarah', email: 'secretary@church.com', role: 'Secretary/Clerk' },
            { name: 'Finance Officer', email: 'finance@church.com',   role: 'Finance Officer' },
            { name: 'Church Member',   email: 'viewer@church.com',    role: 'Viewer' }
        ];

        for (const user of users) {
            const existing = await db.all('SELECT id FROM users WHERE email = ?', [user.email]);
            if (existing.length === 0) {
                await db.run(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [user.name, user.email, passwordHash, user.role]
                );
            }
        }

        console.log('--- Database Ready ---');
        await db.close();
    } catch (error) {
        console.error('Database init failed:', error);
        throw error; // Let the caller handle it
    }
}

// Allow running directly: node server/init_db.js
if (require.main === module) {
    initDB().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { initDB };
