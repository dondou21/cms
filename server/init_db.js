const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function initDB() {
    console.log('--- Initializing SQLite Database ---');
    try {
        const dbPath = path.join(__dirname, 'cms.db');
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        await db.exec('PRAGMA foreign_keys = ON');

        console.log('Connected to SQLite.');

        const schemaPath = path.join(__dirname, 'config', 'schema.sql');
        const schemaString = fs.readFileSync(schemaPath, 'utf8');

        const statements = schemaString.split(';').filter(stmt => stmt.trim());
        for (let stmt of statements) {
            await db.exec(stmt);
        }
        console.log('Schema tables created/verified successfully.');

        const passwordHash = await bcrypt.hash('password123', 10);
        const users = [
            { name: 'System Admin', email: 'admin@church.com', password: passwordHash, role: 'Admin' },
            { name: 'Pastor David', email: 'pastor@church.com', password: passwordHash, role: 'Pastor/Leader' },
            { name: 'Secretary Sarah', email: 'secretary@church.com', password: passwordHash, role: 'Secretary/Clerk' },
            { name: 'Finance Officer', email: 'finance@church.com', password: passwordHash, role: 'Finance Officer' },
            { name: 'Church Member', email: 'viewer@church.com', password: passwordHash, role: 'Viewer' }
        ];

        console.log('Seeding users...');
        for (const user of users) {
            const existing = await db.all('SELECT id FROM users WHERE email = ?', [user.email]);
            if (existing.length === 0) {
                await db.run(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [user.name, user.email, user.password, user.role]
                );
                console.log(` -> Created user: ${user.email}`);
            } else {
                console.log(` -> User ${user.email} already exists.`);
            }
        }

        console.log('--- Initialization Complete! ---');
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('Database Initialization Failed:', error);
        process.exit(1);
    }
}

initDB();
