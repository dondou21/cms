const db = require('../config/db');

const Department = {
    create: async (deptData) => {
        const { name, description } = deptData;
        const [rows] = await db.execute(
            'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING id',
            [name, description]
        );
        return rows[0].id;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM departments');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM departments WHERE id = $1', [id]);
        return rows[0];
    },

    update: async (id, deptData) => {
        const { name, description } = deptData;
        await db.execute(
            'UPDATE departments SET name = $1, description = $2 WHERE id = $3',
            [name, description, id]
        );
    },

    delete: async (id) => {
        await db.execute('DELETE FROM departments WHERE id = $1', [id]);
    },

    getMembers: async (id) => {
        const [rows] = await db.execute('SELECT * FROM members WHERE department_id = $1', [id]);
        return rows;
    }
};

module.exports = Department;
