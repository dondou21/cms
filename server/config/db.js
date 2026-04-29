const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

let pgPool;
const localDb = new sqlite3.Database(path.join(__dirname, '../../server/database.sqlite'));

if (process.env.DATABASE_URL) {
    pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    console.log('Using PostgreSQL Database (Online Mode)');
}

module.exports = {
    execute: async (sql, params = []) => {
        // Try PostgreSQL first if available
        if (pgPool) {
            try {
                const result = await pgPool.query(sql, params);
                return [result.rows, result];
            } catch (err) {
                console.error('🌐 PostgreSQL Error (Connectivity):', err.message);
                console.log('🔄 Falling back to Local SQLite...');
            }
        }

        // Fallback to SQLite
        return new Promise((resolve, reject) => {
            // Convert PG $1, $2 syntax to SQLite ? syntax
            const sqliteSql = sql.replace(/\$\d+/g, '?');
            
            const isQuery = sqliteSql.trim().toUpperCase().startsWith('SELECT');
            
            if (isQuery) {
                localDb.all(sqliteSql, params, (err, rows) => {
                    if (err) return reject(err);
                    resolve([rows, { rows }]);
                });
            } else {
                localDb.run(sqliteSql, params, function(err) {
                    if (err) return reject(err);
                    // Return rows compatible format
                    resolve([[{ id: this.lastID }], { rows: [{ id: this.lastID }], lastID: this.lastID }]);
                });
            }
        });
    }
};