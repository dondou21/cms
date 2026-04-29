const db = require('../config/db');

exports.getIntegrationStats = async (req, res) => {
    try {
        // SQLite compatible interval: date('now', '-30 days')
        const [visitors] = await db.execute("SELECT COUNT(*) as count FROM report_visitors WHERE created_at >= date('now', '-30 days')");
        const [wantToJoin] = await db.execute("SELECT COUNT(*) as count FROM members WHERE status = 'Prospect' AND want_to_join_icc = true");
        const [converts] = await db.execute("SELECT COUNT(*) as count FROM report_visitors WHERE is_convert = true");
        
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
        const currentMonth = parseInt(month) || new Date().getMonth() + 1;
        const currentYear = parseInt(year) || new Date().getFullYear();
        
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        // Members Count & Trend
        const [[{ total_members }]] = await db.execute('SELECT COUNT(*) as total_members FROM members');
        const [[{ prev_members }]] = await db.execute(
            "SELECT COUNT(*) as prev_members FROM members WHERE created_at < $1", 
            [new Date(currentYear, currentMonth - 1, 1)]
        );
        const member_trend = prev_members > 0 ? ((total_members - prev_members) / prev_members) * 100 : 0;

        // Giving & Trend
        // Using strftime('%m', date) for SQLite compatibility
        const [[{ monthly_giving }]] = await db.execute(
            "SELECT SUM(amount) as monthly_giving FROM givings WHERE strftime('%m', date) = $1 AND strftime('%Y', date) = $2",
            [currentMonth.toString().padStart(2, '0'), currentYear.toString()]
        );
        const [[{ prev_giving }]] = await db.execute(
            "SELECT SUM(amount) as prev_giving FROM givings WHERE strftime('%m', date) = $1 AND strftime('%Y', date) = $2",
            [prevMonth.toString().padStart(2, '0'), prevYear.toString()]
        );
        const giving_trend = prev_giving > 0 ? ((monthly_giving - prev_giving) / prev_giving) * 100 : 0;

        // Visitors (Integration) & Trend
        const [[{ monthly_visitors }]] = await db.execute(
            "SELECT COUNT(*) as count FROM report_visitors WHERE strftime('%m', created_at) = $1 AND strftime('%Y', created_at) = $2",
            [currentMonth.toString().padStart(2, '0'), currentYear.toString()]
        );
        const [[{ prev_visitors }]] = await db.execute(
            "SELECT COUNT(*) as count FROM report_visitors WHERE strftime('%m', created_at) = $1 AND strftime('%Y', created_at) = $2",
            [prevMonth.toString().padStart(2, '0'), prevYear.toString()]
        );
        const visitor_trend = prev_visitors > 0 ? ((monthly_visitors - prev_visitors) / prev_visitors) * 100 : 0;

        const [attendance_summary] = await db.execute("SELECT status, COUNT(*) as count FROM attendance JOIN events ON attendance.event_id = events.id WHERE events.date = (SELECT MAX(date) FROM events) GROUP BY status");
        const [upcoming_events] = await db.execute("SELECT * FROM events WHERE date >= date('now') ORDER BY date ASC LIMIT 2");
        const [recent_activity] = await db.execute(`
            SELECT * FROM (
                SELECT first_name, last_name, created_at as time, 'joined' as type, 0 as amount FROM members
                UNION ALL
                SELECT m.first_name, m.last_name, g.date as time, 'donated' as type, g.amount FROM givings g JOIN members m ON g.member_id = m.id
            ) AS combined
            ORDER BY time DESC LIMIT 5
        `);

        res.json({
            total_members: parseInt(total_members) || 0,
            member_trend: parseFloat(member_trend.toFixed(1)),
            monthly_giving: parseFloat(monthly_giving) || 0,
            giving_trend: parseFloat(giving_trend.toFixed(1)),
            monthly_visitors: parseInt(monthly_visitors) || 0,
            visitor_trend: parseFloat(visitor_trend.toFixed(1)),
            recent_attendance: attendance_summary,
            upcoming_events,
            recent_activity
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
