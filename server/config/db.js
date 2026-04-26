const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
    // Hosted PostgreSQL (Supabase/Neon)
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Supabase/Render
        }
    });
    console.log('Using PostgreSQL Database');
} else {
    // Fallback or warning
    console.warn('WARNING: DATABASE_URL is not set. Please set it in your .env file for PostgreSQL access.');
    // We could keep SQLite as a local fallback for development, but for the web app we need PG.
    // For now, let's keep the SQLite logic as a backup so the app doesn't immediately crash.
}

module.exports = {
    execute: async (sql, params = []) => {
        if (pool) {
            // PostgreSQL logic
            // pg uses $1, $2 which is what we have in most models
            const result = await pool.query(sql, params);
            // PostgreSQL returns result.rows
            return [result.rows, result];
        } else {
            throw new Error('Database connection not established. Please provide a DATABASE_URL.');
        }
    }
};