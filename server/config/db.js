const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

async function getDb() {
    if (!dbInstance) {
        dbInstance = await open({
            filename: path.join(__dirname, '..', 'cms.db'),
            driver: sqlite3.Database
        });

        await dbInstance.exec('PRAGMA foreign_keys = ON');
    }
    return dbInstance;
}

const poolWrapper = {
    execute: async (sql, params = []) => {
        const db = await getDb();
        const upperSql = sql.trim().toUpperCase();
        if (upperSql.startsWith('SELECT')) {
            const rows = await db.all(sql, params);
            return [rows, []];
        } else {
            const result = await db.run(sql, params);
            return [{
                insertId: result.lastID,
                affectedRows: result.changes
            }, []];
        }
    },
    query: async (sql, params = []) => {
        return poolWrapper.execute(sql, params);
    }
};

module.exports = poolWrapper;
