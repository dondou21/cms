const db = require('../config/db');

exports.getDashboardSummary = async (req, res) => {
    try {
        const [[{ total_members }]] = await db.execute('SELECT COUNT(*) as total_members FROM members');
        const [[{ active_members }]] = await db.execute('SELECT COUNT(*) as active_members FROM members WHERE status = "active"');
        const [[{ monthly_giving }]] = await db.execute('SELECT SUM(amount) as monthly_giving FROM givings WHERE MONTH(date) = MONTH(CURRENT_DATE) AND YEAR(date) = YEAR(CURRENT_DATE)');
        const [attendance_summary] = await db.execute('SELECT status, COUNT(*) as count FROM attendance JOIN events ON attendance.event_id = events.id WHERE events.date = (SELECT MAX(date) FROM events) GROUP BY status');

        res.json({
            total_members,
            active_members,
            monthly_giving: monthly_giving || 0,
            recent_attendance: attendance_summary
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard summary', error: error.message });
    }
};

exports.getAttendanceTrends = async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT e.title, e.date, COUNT(a.id) as attendee_count 
      FROM events e 
      LEFT JOIN attendance a ON e.id = a.event_id AND a.status = 'Present'
      GROUP BY e.id 
      ORDER BY e.date DESC 
      LIMIT 10
    `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance trends', error: error.message });
    }
};

exports.getMembersByMinistry = async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT d.name as ministry, COUNT(m.id) as count 
      FROM departments d 
      LEFT JOIN members m ON d.id = m.department_id 
      GROUP BY d.id
    `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching members by ministry', error: error.message });
    }
};
