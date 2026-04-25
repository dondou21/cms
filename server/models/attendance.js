const db = require('../config/db');

const Attendance = {
    record: async (attendanceData) => {
        const { event_id, member_id, status } = attendanceData;
        const [result] = await db.execute(
            'INSERT INTO attendance (event_id, member_id, status) VALUES ($1, $2, $3) ON CONFLICT (event_id, member_id) DO UPDATE SET status = EXCLUDED.status',
            [event_id, member_id, status || 'Present']
        );
        return result.lastID;
    },

    findByEvent: async (eventId) => {
        const [rows] = await db.execute(`
      SELECT a.*, (m.first_name || ' ' || m.last_name) as member_name 
      FROM attendance a 
      JOIN members m ON a.member_id = m.id 
      WHERE a.event_id = $1
    `, [eventId]);
        return rows;
    },

    getSummary: async (eventId) => {
        const [rows] = await db.execute(`
      SELECT status, COUNT(*) as count 
      FROM attendance 
      WHERE event_id = $1 
      GROUP BY status
    `, [eventId]);
        return rows;
    }
};

module.exports = Attendance;
