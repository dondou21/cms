const Attendance = require('../models/attendance');
const Event = require('../models/event');

exports.recordAttendance = async (req, res) => {
    try {
        const { event_id, member_id, status, count } = req.body;

        if (typeof count !== 'undefined' && event_id && !member_id) {
            await Event.updateAttendance(event_id, parseInt(count, 10));
            return res.status(201).json({ message: 'Attendance count updated successfully' });
        }

        if (!event_id || !member_id) {
            return res.status(400).json({ message: 'event_id and member_id are required for individual attendance records' });
        }

        await Attendance.record({ event_id, member_id, status });
        res.status(201).json({ message: 'Attendance recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording attendance', error: error.message });
    }
};

exports.getEventAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByEvent(req.params.eventId);
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
};

exports.getAttendanceSummary = async (req, res) => {
    try {
        const summary = await Attendance.getSummary(req.params.eventId);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance summary', error: error.message });
    }
};
