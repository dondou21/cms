const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Neon
});

module.exports = {
  execute: (sql, params) => pool.query(sql, params).then(r => [r.rows])
};