const db = require('../config/db');

const Event = {
    create: async (eventData) => {
        const { title, description, date, time, location } = eventData;
        const [result] = await db.execute(
            'INSERT INTO events (title, description, date, time, location) VALUES (?, ?, ?, ?, ?)',
            [title, description, date, time, location]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM events ORDER BY date DESC, time DESC');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, eventData) => {
        const { title, description, date, time, location } = eventData;
        await db.execute(
            'UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ? WHERE id = ?',
            [title, description, date, time, location, id]
        );
    },

    updateAttendance: async (id, count) => {
        await db.execute('UPDATE events SET attendance_count = ? WHERE id = ?', [count, id]);
    },

    delete: async (id) => {
        await db.execute('DELETE FROM events WHERE id = ?', [id]);
    }
};

module.exports = Event;
