const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config({ path: './.env' });

async function seed() {
    try {
        const password = await bcrypt.hash('password123', 10);

        const users = [
            { name: 'System Admin', email: 'admin@church.com', password, role: 'Admin' },
            { name: 'Pastor David', email: 'pastor@church.com', password, role: 'Pastor/Leader' },
            { name: 'Secretary Sarah', email: 'secretary@church.com', password, role: 'Secretary/Clerk' },
            { name: 'Finance Officer', email: 'finance@church.com', password, role: 'Finance Officer' },
            { name: 'Church Member', email: 'viewer@church.com', password, role: 'Viewer' }
        ];

        for (const user of users) {
            try {
                // Check if user exists first
                const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [user.email]);
                if (existing.length === 0) {
                    await db.execute(
                        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                        [user.name, user.email, user.password, user.role]
                    );
                    console.log(`User ${user.email} created.`);
                } else {
                    console.log(`User ${user.email} already exists.`);
                }
            } catch (error) {
                console.error(`Error creating ${user.email}:`, error);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Fatal error during seeding:', error);
        process.exit(1);
    }
}

seed();
