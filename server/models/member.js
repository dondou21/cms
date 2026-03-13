const db = require('../config/db');

const Member = {
    create: async (memberData) => {
        const { first_name, last_name, email, phone, address, status, department_id } = memberData;
        const [result] = await db.execute(
            'INSERT INTO members (first_name, last_name, email, phone, address, status, department_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone, address, status || 'active', department_id]
        );
        return result.insertId;
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
      WHERE m.id = ?
    `, [id]);
        return rows[0];
    },

    update: async (id, memberData) => {
        const { first_name, last_name, email, phone, address, status, department_id } = memberData;
        await db.execute(
            'UPDATE members SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, status = ?, department_id = ? WHERE id = ?',
            [first_name, last_name, email, phone, address, status, department_id, id]
        );
    },

    delete: async (id) => {
        await db.execute('DELETE FROM members WHERE id = ?', [id]);
    }
};

module.exports = Member;
