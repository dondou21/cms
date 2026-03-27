const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    create: async (userData) => {
        const { name, email, password, role } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email, hashedPassword, role || 'Viewer']
        );
        return rows[0].id;
    },

    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = $1', [email]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
        return rows[0];
    }
};

module.exports = User;
