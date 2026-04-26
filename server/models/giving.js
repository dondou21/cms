const db = require('../config/db');

const Giving = {
    create: async (givingData) => {
        const { event_id, donor_name, amount, date, type } = givingData;
        const [rows] = await db.execute(
            'INSERT INTO givings (event_id, donor_name, amount, date, type) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [event_id || null, donor_name || 'Anonymous', amount, date, type || 'Offering']
        );
        return rows[0].id;
    },

    findAll: async (filters = {}) => {
        let query = `
      SELECT g.*, e.title as event_title 
      FROM givings g 
      LEFT JOIN events e ON g.event_id = e.id
    `;
        const params = [];

        if (filters.startDate && filters.endDate) {
            query += ` WHERE g.date BETWEEN $${params.length + 1} AND $${params.length + 2}`;
            params.push(filters.startDate, filters.endDate);
        } else if (filters.eventId) {
            query += ` WHERE g.event_id = $${params.length + 1}`;
            params.push(filters.eventId);
        }

        query += ' ORDER BY g.date DESC';
        const [rows] = await db.execute(query, params);
        return rows;
    },

    getMonthlyReport: async () => {
        const [rows] = await db.execute(`
      SELECT 
        to_char(date, 'YYYY-MM') as month, 
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
