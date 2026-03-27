const db = require('../config/db');

const Event = {
    create: async (eventData) => {
        const { title, description, date, time, location } = eventData;
        const [rows] = await db.execute(
            'INSERT INTO events (title, description, date, time, location) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [title, description, date, time, location]
        );
        return rows[0].id;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM events ORDER BY date DESC, time DESC');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM events WHERE id = $1', [id]);
        return rows[0];
    },

    update: async (id, eventData) => {
        const { title, description, date, time, location } = eventData;
        await db.execute(
            'UPDATE events SET title = $1, description = $2, date = $3, time = $4, location = $5 WHERE id = $6',
            [title, description, date, time, location, id]
        );
    },

    updateAttendance: async (id, count) => {
        await db.execute('UPDATE events SET attendance_count = $1 WHERE id = $2', [count, id]);
    },

    delete: async (id) => {
        await db.execute('DELETE FROM events WHERE id = $1', [id]);
    }
};

module.exports = Event;
