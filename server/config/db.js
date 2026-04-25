const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

// In production (packaged Electron), use the app's user data directory.
// In development, use the local server folder.
const getDbPath = () => {
    // When running inside a packaged Electron app
    if (process.env.ELECTRON_APP_DATA) {
        return path.join(process.env.ELECTRON_APP_DATA, 'cms.db');
    }
    // When running in development (node server/index.js)
    return path.join(__dirname, '..', 'cms.db');
};

let dbPromise = null;

const getDb = () => {
    if (!dbPromise) {
        dbPromise = open({
            filename: getDbPath(),
            driver: sqlite3.Database
        }).then(db => {
            db.exec('PRAGMA foreign_keys = ON');
            console.log('Connected to SQLite at:', getDbPath());
            return db;
        });
    }
    return dbPromise;
};

module.exports = {
    execute: async (sql, params = []) => {
        const db = await getDb();
        // Convert PostgreSQL $1, $2 placeholders to SQLite ?
        const sqliteSql = sql.replace(/\$\d+/g, '?');
        const isSelect = sqliteSql.trim().toUpperCase().startsWith('SELECT');
        const hasReturning = sqliteSql.includes('RETURNING');

        if (isSelect || hasReturning) {
            try {
                const rows = await db.all(sqliteSql, params);
                return [rows];
            } catch (err) {
                // If RETURNING failed (older SQLite), try falling back to run
                if (hasReturning) {
                    const result = await db.run(sqliteSql.split('RETURNING')[0], params);
                    return [{ id: result.lastID }]; 
                }
                throw err;
            }
        } else {
            const result = await db.run(sqliteSql, params);
            return [result]; 
        }
    }
};