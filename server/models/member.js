const db = require('../config/db');

const Member = {
    create: async (memberData) => {
        const { 
            civilite, first_name, last_name, email, phone, address, 
            invited_by, age_range, marital_status, accepted_christ, 
            want_accompaniment, usual_church, want_to_join_icc, 
            interests, info_on, join_gs, comments, department_id 
        } = memberData;
        const [rows] = await db.execute(
            `INSERT INTO members (
                civilite, first_name, last_name, email, phone, address, 
                invited_by, age_range, marital_status, accepted_christ, 
                want_accompaniment, usual_church, want_to_join_icc, 
                interests, info_on, join_gs, comments, department_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id`,
            [
                civilite, first_name, last_name, email, phone, address, 
                invited_by, age_range, marital_status, accepted_christ || false, 
                want_accompaniment || false, usual_church || false, want_to_join_icc || false, 
                interests, info_on, join_gs || false, comments, department_id || null
            ]
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
        const { 
            civilite, first_name, last_name, email, phone, address, 
            invited_by, age_range, marital_status, accepted_christ, 
            want_accompaniment, usual_church, want_to_join_icc, 
            interests, info_on, join_gs, comments, status, department_id 
        } = memberData;
        await db.execute(
            `UPDATE members SET 
                civilite = $1, first_name = $2, last_name = $3, email = $4, phone = $5, 
                address = $6, invited_by = $7, age_range = $8, marital_status = $9, 
                accepted_christ = $10, want_accompaniment = $11, usual_church = $12, 
                want_to_join_icc = $13, interests = $14, info_on = $15, join_gs = $16, 
                comments = $17, status = $18, department_id = $19 
            WHERE id = $20`,
            [
                civilite, first_name, last_name, email, phone, address, 
                invited_by, age_range, marital_status, accepted_christ, 
                want_accompaniment, usual_church, want_to_join_icc, 
                interests, info_on, join_gs, comments, status, department_id, id
            ]
        );
    },

    delete: async (id) => {
        await db.execute('DELETE FROM members WHERE id = $1', [id]);
    }
};

module.exports = Member;
