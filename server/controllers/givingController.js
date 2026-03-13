const Giving = require('../models/giving');

exports.recordGiving = async (req, res) => {
    try {
        const givingId = await Giving.create(req.body);
        res.status(201).json({ id: givingId, message: 'Contribution recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording contribution', error: error.message });
    }
};

exports.getGivings = async (req, res) => {
    try {
        const { startDate, endDate, memberId } = req.query;
        const givings = await Giving.findAll({ startDate, endDate, memberId });
        res.json(givings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching giving records', error: error.message });
    }
};

exports.getMonthlyReport = async (req, res) => {
    try {
        const report = await Giving.getMonthlyReport();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching monthly report', error: error.message });
    }
};
