const Member = require('../models/member');

exports.createMember = async (req, res) => {
    try {
        const memberId = await Member.create(req.body);
        res.status(201).json({ id: memberId, message: 'Member created successfully' });
    } catch (error) {
        console.error('Create Member Error:', error);
        res.status(500).json({ message: 'Error creating member', error: error.message });
    }
};

exports.getMembers = async (req, res) => {
    try {
        const { status, is_star, search } = req.query;
        const filters = {};
        if (status) filters.status = status;
        if (is_star !== undefined) filters.is_star = is_star === 'true';
        if (search) filters.search = search;
        
        const members = await Member.findAll(filters);
        res.json(members);
    } catch (error) {
        console.error('Fetch Members Error:', error);
        res.status(500).json({ message: 'Error fetching members', error: error.message });
    }
};

exports.getMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching member', error: error.message });
    }
};

exports.updateMember = async (req, res) => {
    try {
        await Member.update(req.params.id, req.body);
        res.json({ message: 'Member updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating member', error: error.message });
    }
};

exports.deleteMember = async (req, res) => {
    try {
        await Member.delete(req.params.id);
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting member', error: error.message });
    }
};
