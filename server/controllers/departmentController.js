const Department = require('../models/department');

exports.createDepartment = async (req, res) => {
    try {
        const deptId = await Department.create(req.body);
        res.status(201).json({ id: deptId, message: 'Department created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating department', error: error.message });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const depts = await Department.findAll();
        res.json(depts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error: error.message });
    }
};

exports.getDepartment = async (req, res) => {
    try {
        const dept = await Department.findById(req.params.id);
        if (!dept) return res.status(404).json({ message: 'Department not found' });
        res.json(dept);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching department', error: error.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        await Department.update(req.params.id, req.body);
        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating department', error: error.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        await Department.delete(req.params.id);
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting department', error: error.message });
    }
};

exports.getDepartmentMembers = async (req, res) => {
    try {
        const members = await Department.getMembers(req.params.id);
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching department members', error: error.message });
    }
};
