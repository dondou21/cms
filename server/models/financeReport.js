const db = require('../config/db');

const FinanceReport = {
    create: async (reportData) => {
        const { date, programme, stars_on_service, remarks, responsible_name, cash_breakdown, category_breakdown } = reportData;
        const [rows] = await db.execute(
            `INSERT INTO finance_reports 
            (date, programme, stars_on_service, remarks, responsible_name, cash_breakdown, category_breakdown) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [
                date, 
                programme, 
                stars_on_service, 
                remarks, 
                responsible_name, 
                JSON.stringify(cash_breakdown), 
                JSON.stringify(category_breakdown)
            ]
        );
        return rows[0].id;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM finance_reports ORDER BY date DESC');
        return rows.map(row => ({
            ...row,
            cash_breakdown: typeof row.cash_breakdown === 'string' ? JSON.parse(row.cash_breakdown) : row.cash_breakdown,
            category_breakdown: typeof row.category_breakdown === 'string' ? JSON.parse(row.category_breakdown) : row.category_breakdown
        }));
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM finance_reports WHERE id = $1', [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            ...row,
            cash_breakdown: typeof row.cash_breakdown === 'string' ? JSON.parse(row.cash_breakdown) : row.cash_breakdown,
            category_breakdown: typeof row.category_breakdown === 'string' ? JSON.parse(row.category_breakdown) : row.category_breakdown
        };
    }
};

module.exports = FinanceReport;
