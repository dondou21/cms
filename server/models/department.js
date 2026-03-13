const db = require('../config/db');

const Department = {
    create: async (deptData) => {
        const { name, description } = deptData;
        const [result] = await db.execute(
            'INSERT INTO departments (name, description) VALUES (?, ?)',
            [name, description]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM departments');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM departments WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, deptData) => {
        const { name, description } = deptData;
        await db.execute(
            'UPDATE departments SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
    },

    delete: async (id) => {
        await db.execute('DELETE FROM departments WHERE id = ?', [id]);
    },

    getMembers: async (id) => {
        const [rows] = await db.execute('SELECT * FROM members WHERE department_id = ?', [id]);
        return rows;
    }
};

module.exports = Department;
