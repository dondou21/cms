const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let pool;
let sqlitePromise;
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
    console.log('Initializing SQLite database setup for development...');
    sqlitePromise = open({
        filename: path.join(__dirname, '..', 'cms.db'),
        driver: sqlite3.Database
    }).then(db => {
        db.exec('PRAGMA foreign_keys = ON');
        console.log('Connected to local SQLite database (cms.db) for testing.');
        return db;
    }).catch(err => {
        console.error('Failed to connect to SQLite:', err);
    });
} else {
    // Production Mode -> Use Neon PostgreSQL
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // required for Neon
    });
    console.log('PostgreSQL Pool initialized.');
}

module.exports = {
  execute: async (sql, params = []) => {
      if (isDev) {
          const db = await sqlitePromise;
          // SQLite uses ? instead of $1, $2, so we translate the query string for SQLite
          const sqliteSql = sql.replace(/\$\d+/g, '?');
          
          // Determine the nature of the query to use db.all vs db.run
          const isSelect = sqliteSql.trim().toUpperCase().startsWith('SELECT');
          const hasReturning = sqliteSql.includes('RETURNING');
          
          if (isSelect || hasReturning) {
              const rows = await db.all(sqliteSql, params);
              return [rows];
          } else {
              await db.run(sqliteSql, params);
              return [[]]; // Emulate empty rows for updates/deletes like pg does without returning
          }
      } else {
          // Standard PostgreSQL pipeline
          return pool.query(sql, params).then(r => [r.rows]);
      }
  }
};