const db = require('../config/db');

exports.getIntegrationStats = async (req, res) => {
    try {
        const [visitors] = await db.execute('SELECT COUNT(*) as count FROM report_visitors WHERE created_at >= NOW() - INTERVAL \'30 days\'');
        const [wantToJoin] = await db.execute('SELECT COUNT(*) as count FROM members WHERE status = \'Prospect\' AND want_to_join_icc = true');
        const [converts] = await db.execute('SELECT COUNT(*) as count FROM report_visitors WHERE is_convert = true');
        
        res.json({
            new_visitors: parseInt(visitors[0].count),
            want_to_join: parseInt(wantToJoin[0].count),
            new_converts: parseInt(converts[0].count),
            pending_followup: parseInt(wantToJoin[0].count) // Simplified
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDashboardSummary = async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentMonth = month || new Date().getMonth() + 1;
        const currentYear = year || new Date().getFullYear();

        const [[{ total_members }]] = await db.execute('SELECT COUNT(*) as total_members FROM members');
        const [[{ active_members }]] = await db.execute("SELECT COUNT(*) as active_members FROM members WHERE status = 'active'");
        
        // Monthly giving filtered by month/year
        const [[{ monthly_giving }]] = await db.execute(
            "SELECT SUM(amount) as monthly_giving FROM givings WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2",
            [currentMonth, currentYear]
        );

        const [attendance_summary] = await db.execute("SELECT status, COUNT(*) as count FROM attendance JOIN events ON attendance.event_id = events.id WHERE events.date = (SELECT MAX(date) FROM events) GROUP BY status");
        
        const [upcoming_events] = await db.execute("SELECT * FROM events WHERE date >= CURRENT_DATE ORDER BY date ASC LIMIT 2");
        const [recent_members] = await db.execute("SELECT first_name, last_name, created_at as time, 'joined' as type FROM members ORDER BY created_at DESC LIMIT 3");
        const [recent_givings] = await db.execute("SELECT m.first_name, m.last_name, g.amount, g.date as time, 'donated' as type FROM givings g JOIN members m ON g.member_id = m.id ORDER BY g.date DESC LIMIT 3");

        res.json({
            total_members: total_members || 0,
            active_members: active_members || 0,
            monthly_giving: monthly_giving || 0,
            recent_attendance: attendance_summary,
            upcoming_events,
            recent_activity: [...recent_members, ...recent_givings].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        });
    } catch (error) {
        console.error('Dashboard Summary Error:', error);
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
