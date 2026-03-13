const db = require('../config/db');

const Attendance = {
    record: async (attendanceData) => {
        const { event_id, member_id, status } = attendanceData;
        const [result] = await db.execute(
            'INSERT INTO attendance (event_id, member_id, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?',
            [event_id, member_id, status || 'Present', status || 'Present']
        );
        return result.insertId;
    },

    findByEvent: async (eventId) => {
        const [rows] = await db.execute(`
      SELECT a.*, CONCAT(m.first_name, ' ', m.last_name) as member_name 
      FROM attendance a 
      JOIN members m ON a.member_id = m.id 
      WHERE a.event_id = ?
    `, [eventId]);
        return rows;
    },

    getSummary: async (eventId) => {
        const [rows] = await db.execute(`
      SELECT status, COUNT(*) as count 
      FROM attendance 
      WHERE event_id = ? 
      GROUP BY status
    `, [eventId]);
        return rows;
    }
};

module.exports = Attendance;
