const db = require('../config/db');

const Giving = {
    create: async (givingData) => {
        const { member_id, amount, date, type } = givingData;
        const [result] = await db.execute(
            'INSERT INTO givings (member_id, amount, date, type) VALUES ($1, $2, $3, $4)',
            [member_id, amount, date, type || 'Offering']
        );
        return result.lastID;
    },

    findAll: async (filters = {}) => {
        let query = `
      SELECT g.*, (m.first_name || ' ' || m.last_name) as member_name 
      FROM givings g 
      LEFT JOIN members m ON g.member_id = m.id
    `;
        const params = [];

        if (filters.startDate && filters.endDate) {
            query += ` WHERE g.date BETWEEN $${params.length + 1} AND $${params.length + 2}`;
            params.push(filters.startDate, filters.endDate);
        } else if (filters.memberId) {
            query += ` WHERE g.member_id = $${params.length + 1}`;
            params.push(filters.memberId);
        }

        query += ' ORDER BY g.date DESC';
        const [rows] = await db.execute(query, params);
        return rows;
    },

    getMonthlyReport: async () => {
        const [rows] = await db.execute(`
      SELECT 
        strftime('%Y-%m', date) as month, 
        type, 
        SUM(amount) as total 
      FROM givings 
      GROUP BY month, type 
      ORDER BY month DESC
    `);
        return rows;
    }
};

module.exports = Giving;
