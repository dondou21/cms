const ServiceReport = require('../models/serviceReport');

exports.createReport = async (req, res) => {
    try {
        const id = await ServiceReport.create(req.body);
        res.status(201).json({ id, message: 'Report created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReports = async (req, res) => {
    try {
        const reports = await ServiceReport.findAll();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReportWithProgression = async (req, res) => {
    try {
        const { date } = req.query;
        const current = req.body; // or fetch if existing
        const previous = await ServiceReport.getPreviousReport(date || new Date());
        
        // Logic to calculate differences will be handled on frontend for more flexibility,
        // but we return the previous data here.
        res.json({ current, previous });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
