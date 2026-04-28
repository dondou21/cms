const db = require('../config/db');
const ServiceReport = require('../models/serviceReport');

exports.createReport = async (req, res) => {
    try {
        const { visitors, ...reportData } = req.body;
        const id = await ServiceReport.create(reportData);
        
        if (visitors && visitors.length > 0) {
            for (const v of visitors) {
                // 1. Record visitor in report_visitors
                await db.execute(
                    `INSERT INTO report_visitors (report_id, full_name, phone, wants_to_join, is_convert) 
                     VALUES ($1, $2, $3, $4, $5)`,
                    [id, v.full_name, v.phone, v.wants_to_join || false, v.is_convert || false]
                );

                // 2. If wants to join, add to members table as "Prospect"
                if (v.wants_to_join) {
                    const names = v.full_name.split(' ');
                    const firstName = names[0];
                    const lastName = names.slice(1).join(' ') || 'Visitor';
                    
                    await db.execute(
                        `INSERT INTO members (first_name, last_name, phone, status, invited_by, want_to_join_icc) 
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [firstName, lastName, v.phone, 'Prospect', reportData.programme || 'Service Report', true]
                    );
                }
            }
        }

        res.status(201).json({ id, message: 'Report created successfully and visitors integrated' });
    } catch (err) {
        console.error('Report Creation Error:', err);
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
