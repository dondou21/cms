const db = require('../config/db');

const Member = {
    create: async (memberData) => {
        const { first_name, last_name, email, phone, address, status, department_id } = memberData;
        const [rows] = await db.execute(
            'INSERT INTO members (first_name, last_name, email, phone, address, status, department_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [first_name, last_name, email, phone, address, status || 'active', department_id]
        );
        return rows[0].id;
    },

    findAll: async () => {
        const [rows] = await db.execute(`
      SELECT m.*, d.name as department_name 
      FROM members m 
      LEFT JOIN departments d ON m.department_id = d.id
    `);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(`
      SELECT m.*, d.name as department_name 
      FROM members m 
      LEFT JOIN departments d ON m.department_id = d.id 
      WHERE m.id = $1
    `, [id]);
        return rows[0];
    },

    update: async (id, memberData) => {
        const { first_name, last_name, email, phone, address, status, department_id } = memberData;
        await db.execute(
            'UPDATE members SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5, status = $6, department_id = $7 WHERE id = $8',
            [first_name, last_name, email, phone, address, status, department_id, id]
        );
    },

    delete: async (id) => {
        await db.execute('DELETE FROM members WHERE id = $1', [id]);
    }
};

module.exports = Member;
