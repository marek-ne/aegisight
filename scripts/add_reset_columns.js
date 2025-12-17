const { Pool } = require('pg');
require('dotenv').config({ path: './.env' }); // Running from project root

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function runMigration() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();

        console.log('Adding reset_password_token column...');
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255);
        `);

        console.log('Adding reset_password_expires column...');
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMPTZ;
        `);

        console.log('Migration successful!');
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigration();
