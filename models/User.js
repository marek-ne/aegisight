const bcrypt = require('bcrypt');
const db = require('../config/database');

const SALT_ROUNDS = 10;

class User {
    // Find user by email
    static async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );
        return result.rows[0] || null;
    }

    // Find user by Google ID
    static async findByGoogleId(googleId) {
        const result = await db.query(
            'SELECT * FROM users WHERE google_id = $1',
            [googleId]
        );
        return result.rows[0] || null;
    }

    // Find user by ID
    static async findById(id) {
        const result = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    // Create user with email/password
    static async createWithEmail({ email, password, firstName, lastName, companyName, businessPhone, jobLevel, department, jobFunction, country }) {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const result = await db.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, company_name, business_phone, job_level, department, job_function, country, auth_provider)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'email')
             RETURNING *`,
            [email.toLowerCase(), passwordHash, firstName, lastName, companyName, businessPhone, jobLevel, department, jobFunction, country]
        );

        return result.rows[0];
    }

    // Create user from Google OAuth
    static async createWithGoogle({ googleId, email, firstName, lastName, avatarUrl }) {
        const result = await db.query(
            `INSERT INTO users (google_id, email, first_name, last_name, avatar_url, auth_provider)
             VALUES ($1, $2, $3, $4, $5, 'google')
             RETURNING *`,
            [googleId, email.toLowerCase(), firstName, lastName, avatarUrl]
        );

        return result.rows[0];
    }

    // Link Google account to existing email user
    static async linkGoogleAccount(userId, googleId, avatarUrl) {
        const result = await db.query(
            `UPDATE users 
             SET google_id = $1, avatar_url = $2, auth_provider = 'google'
             WHERE id = $3
             RETURNING *`,
            [googleId, avatarUrl, userId]
        );

        return result.rows[0];
    }

    // Compare password for email/password login
    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    // Update last login timestamp
    static async updateLastLogin(userId) {
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [userId]
        );
    }

    // Get user by ID (exclude sensitive data)
    static async getPublicProfile(userId) {
        const result = await db.query(
            `SELECT id, email, first_name, last_name, avatar_url, auth_provider, created_at, last_login
             FROM users WHERE id = $1`,
            [userId]
        );
        return result.rows[0] || null;
    }
    // Save password reset token
    static async saveResetToken(email, token, expires) {
        const result = await db.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3 RETURNING *',
            [token, expires, email.toLowerCase()]
        );
        return result.rows[0];
    }

    // Find user by reset token
    static async findByResetToken(token) {
        const result = await db.query(
            'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
            [token]
        );
        return result.rows[0] || null;
    }

    // Update password and clear reset token
    static async updatePassword(userId, password) {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await db.query(
            'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2 RETURNING *',
            [passwordHash, userId]
        );
        return result.rows[0];
    }
}

module.exports = User;
