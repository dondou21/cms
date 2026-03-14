const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

async function initDB() {
    console.log('--- Initializing Database ---');
    try {
        // Connect to MySQL server (without specifying a database)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Connected to MySQL server.');

        // 1. Create the database if it doesn't exist
        const dbName = process.env.DB_NAME || 'cms_db';
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`Database '${dbName}' ensured.`);

        // 2. Use the database
        await connection.query(`USE \`${dbName}\``);

        // 3. Run schema.sql
        const schemaPath = path.join(__dirname, 'config', 'schema.sql');
        const schemaString = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema statements one by one
        const statements = schemaString.split(';').filter(stmt => stmt.trim());
        for (let stmt of statements) {
            await connection.execute(stmt);
        }
        console.log('Schema tables created/verified successfully.');

        // 4. Seed Users
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
            const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [user.email]);
            if (existing.length === 0) {
                await connection.execute(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [user.name, user.email, user.password, user.role]
                );
                console.log(` -> Created user: ${user.email}`);
            } else {
                console.log(` -> User ${user.email} already exists.`);
            }
        }

        console.log('--- Initialization Complete! ---');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Database Initialization Failed:');
        console.error(error.message);
        console.error('Make sure your MySQL server (like XAMPP/WAMP) is running and your root password is correct in .env');
        process.exit(1);
    }
}

initDB();
