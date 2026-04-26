const db = require('../config/db');

const ServiceReport = {
    create: async (data) => {
        const {
            date, programme, organisateur, departement,
            adults_men, adults_women, juniors_boys, juniors_girls,
            visitors_total, visitors_joining, salvation_total, salvation_joining,
            problems, general_remarks
        } = data;

        const [rows] = await db.execute(
            `INSERT INTO service_reports (
                date, programme, organisateur, departement,
                adults_men, adults_women, juniors_boys, juniors_girls,
                visitors_total, visitors_joining, salvation_total, salvation_joining,
                problems, general_remarks
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
            [
                date, programme, organisateur, departement || 'SECRETARIAT',
                adults_men || 0, adults_women || 0, juniors_boys || 0, juniors_girls || 0,
                visitors_total || 0, visitors_joining || 0, salvation_total || 0, salvation_joining || 0,
                problems, general_remarks
            ]
        );
        return rows[0].id;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM service_reports ORDER BY date DESC');
        return rows;
    },

    getPreviousReport: async (currentDate) => {
        const [rows] = await db.execute(
            'SELECT * FROM service_reports WHERE date < $1 ORDER BY date DESC LIMIT 1',
            [currentDate]
        );
        return rows[0] || null;
    }
};

module.exports = ServiceReport;
