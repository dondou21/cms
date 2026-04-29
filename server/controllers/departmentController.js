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

exports.getDepartmentDetails = async (req, res) => {
    try {
        const roles = await Department.getRoles(req.params.id);
        const programs = await Department.getPrograms(req.params.id);
        res.json({ roles, programs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching department details', error: error.message });
    }
};

exports.addDepartmentRole = async (req, res) => {
    try {
        const { member_id, role_name } = req.body;
        await Department.addRole(req.params.id, member_id, role_name);
        res.json({ message: 'Role added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding role', error: error.message });
    }
};

exports.deleteDepartmentRole = async (req, res) => {
    try {
        await Department.deleteRole(req.params.roleId);
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
};

exports.addDepartmentProgram = async (req, res) => {
    try {
        const { day_of_week, time, activity } = req.body;
        await Department.addProgram(req.params.id, day_of_week, time, activity);
        res.json({ message: 'Program added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding program', error: error.message });
    }
};

exports.deleteDepartmentProgram = async (req, res) => {
    try {
        await Department.deleteProgram(req.params.programId);
        res.json({ message: 'Program deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting program', error: error.message });
    }
};
