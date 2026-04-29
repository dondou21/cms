const db = require('../config/db');

const Department = {
    create: async (deptData) => {
        const { name, description } = deptData;
        const [rows] = await db.execute(
            'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING id',
            [name, description]
        );
        return rows[0].id;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM departments');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM departments WHERE id = $1', [id]);
        return rows[0];
    },

    update: async (id, deptData) => {
        const { name, description } = deptData;
        await db.execute(
            'UPDATE departments SET name = $1, description = $2 WHERE id = $3',
            [name, description, id]
        );
    },

    delete: async (id) => {
        await db.execute('DELETE FROM departments WHERE id = $1', [id]);
    },

    getRoles: async (id) => {
        const [rows] = await db.execute(`
            SELECT dr.*, m.first_name, m.last_name 
            FROM department_roles dr
            JOIN members m ON dr.member_id = m.id
            WHERE dr.department_id = $1
        `, [id]);
        return rows;
    },

    addRole: async (deptId, memberId, roleName) => {
        await db.execute(
            'INSERT INTO department_roles (department_id, member_id, role_name) VALUES ($1, $2, $3)',
            [deptId, memberId, roleName]
        );
    },

    deleteRole: async (roleId) => {
        await db.execute('DELETE FROM department_roles WHERE id = $1', [roleId]);
    },

    getPrograms: async (id) => {
        const [rows] = await db.execute('SELECT * FROM department_programs WHERE department_id = $1', [id]);
        return rows;
    },

    addProgram: async (deptId, day_of_week, time, activity) => {
        await db.execute(
            'INSERT INTO department_programs (department_id, day_of_week, time, activity) VALUES ($1, $2, $3, $4)',
            [deptId, day_of_week, time, activity]
        );
    },

    deleteProgram: async (programId) => {
        await db.execute('DELETE FROM department_programs WHERE id = $1', [programId]);
    }
};

module.exports = Department;
