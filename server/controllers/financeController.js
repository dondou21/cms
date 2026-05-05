const FinanceReport = require('../models/financeReport');

exports.createReport = async (req, res) => {
    try {
        const reportId = await FinanceReport.create(req.body);
        res.status(201).json({ id: reportId, message: 'Finance report saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReports = async (req, res) => {
    try {
        const reports = await FinanceReport.findAll();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReport = async (req, res) => {
    try {
        const report = await FinanceReport.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
