const pool = require('../config/database');

    const MAX_ATTEMPTS = 5;
    const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    const getRateLimit = async (ip) => {
        const result = await pool.query(
            'SELECT * FROM login_rate_limits WHERE ip_address = $1',
            [ip]
        );
        return result.rows[0];
    };

    const registerFailedAttempt = async (ip) => {
        const existing = await getRateLimit(ip);

        if (!existing) {
            await pool.query(
                `INSERT INTO login_rate_limits (ip_address, failed_attempts, last_attempt_at)
                VALUES ($1, 1, NOW())`,
                [ip]
            );
            return;
        }

        const newAttempts = existing.failed_attempts + 1;
        const blockedUntil = newAttempts >= MAX_ATTEMPTS
            ? new Date(Date.now() + BLOCK_DURATION_MS)
            : existing.blocked_until;

        await pool.query(
            `UPDATE login_rate_limits
            SET failed_attempts = $1, blocked_until = $2, last_attempt_at = NOW()
            WHERE ip_address = $3`,
            [newAttempts, blockedUntil, ip]
        );
    };

    const resetAttempts = async (ip) => {
        await pool.query(
            `UPDATE login_rate_limits
            SET failed_attempts = 0, blocked_until = NULL
            WHERE ip_address = $1`,
            [ip]
        );
    };

    module.exports = { getRateLimit, registerFailedAttempt, resetAttempts, MAX_ATTEMPTS };