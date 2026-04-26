const db = require('../config/db');

const Member = {
    create: async (memberData) => {
        const { 
            civilite, first_name, last_name, email, phone, address, 
            invited_by, referral_source, age_range, marital_status, accepted_christ, 
            want_accompaniment, usual_church, want_to_join_icc, 
            desires_contact_leader, desires_impact_group, desires_house_church, 
            desires_formation_001, info_request_mui, info_request_events,
            join_gs, comments, department_id, status 
        } = memberData;
        const [rows] = await db.execute(
            `INSERT INTO members (
                civilite, first_name, last_name, email, phone, address, 
                invited_by, referral_source, age_range, marital_status, accepted_christ, 
                want_accompaniment, usual_church, want_to_join_icc, 
                desires_contact_leader, desires_impact_group, desires_house_church, 
                desires_formation_001, info_request_mui, info_request_events,
                join_gs, comments, department_id, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING id`,
            [
                civilite, first_name, last_name, email, phone, address, 
                invited_by, referral_source, age_range, marital_status, accepted_christ || false, 
                want_accompaniment || false, usual_church || false, want_to_join_icc || false, 
                desires_contact_leader || false, desires_impact_group || false, desires_house_church || false,
                desires_formation_001 || false, info_request_mui || false, info_request_events || false,
                join_gs || false, comments, department_id || null, status || 'Active'
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
            invited_by, referral_source, age_range, marital_status, accepted_christ, 
            want_accompaniment, usual_church, want_to_join_icc, 
            desires_contact_leader, desires_impact_group, desires_house_church, 
            desires_formation_001, info_request_mui, info_request_events,
            join_gs, comments, status, department_id 
        } = memberData;
        await db.execute(
            `UPDATE members SET 
                civilite = $1, first_name = $2, last_name = $3, email = $4, phone = $5, 
                address = $6, invited_by = $7, referral_source = $8, age_range = $9, marital_status = $10, 
                accepted_christ = $11, want_accompaniment = $12, usual_church = $13, 
                want_to_join_icc = $14, desires_contact_leader = $15, desires_impact_group = $16, 
                desires_house_church = $17, desires_formation_001 = $18, info_request_mui = $19, 
                info_request_events = $20, join_gs = $21, comments = $22, status = $23, department_id = $24 
            WHERE id = $25`,
            [
                civilite, first_name, last_name, email, phone, address, 
                invited_by, referral_source, age_range, marital_status, accepted_christ, 
                want_accompaniment, usual_church, want_to_join_icc, 
                desires_contact_leader, desires_impact_group, desires_house_church, 
                desires_formation_001, info_request_mui, info_request_events,
                join_gs, comments, status, department_id, id
            ]
        );
    },

    delete: async (id) => {
        await db.execute('DELETE FROM members WHERE id = $1', [id]);
    }
};

module.exports = Member;
