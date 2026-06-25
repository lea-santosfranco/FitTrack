const pool    = require('../config/database');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');

const SALT_ROUNDS = 10;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM User WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByUsername(username) {
    const [rows] = await pool.execute('SELECT * FROM User WHERE username = ?', [username]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, weight, goal, role, email_verified, created_at, updated_at FROM User WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, username, email, weight, goal, role, email_verified, created_at, updated_at FROM User ORDER BY id'
    );
    return rows;
  },

  async create({ username, email, password, weight, goal }) {
    const hash  = await bcrypt.hash(password, SALT_ROUNDS);
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

    const [result] = await pool.execute(
      `INSERT INTO User (username, email, password, weight, goal, verification_token, verification_token_expires)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, hash, weight || null, goal || 'maintain', token, expires]
    );
    return { id: result.insertId, verificationToken: token };
  },

  async findByVerificationToken(token) {
    const [rows] = await pool.execute(
      'SELECT * FROM User WHERE verification_token = ?',
      [token]
    );
    return rows[0] || null;
  },

  async verifyEmail(id) {
    await pool.execute(
      'UPDATE User SET email_verified = 1, verification_token = NULL, verification_token_expires = NULL WHERE id = ?',
      [id]
    );
  },

  async setNewVerificationToken(id) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
    await pool.execute(
      'UPDATE User SET verification_token = ?, verification_token_expires = ? WHERE id = ?',
      [token, expires, id]
    );
    return token;
  },

  async update(id, { username, email, weight, goal }) {
    const fields = [];
    const values = [];

    if (username !== undefined) { fields.push('username = ?'); values.push(username); }
    if (email    !== undefined) { fields.push('email = ?');    values.push(email); }
    if (weight   !== undefined) { fields.push('weight = ?');   values.push(weight); }
    if (goal     !== undefined) { fields.push('goal = ?');     values.push(goal); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.execute(`UPDATE User SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  async updatePassword(id, newPassword) {
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await pool.execute('UPDATE User SET password = ? WHERE id = ?', [hash, id]);
  },

  async updateRole(id, role) {
    await pool.execute('UPDATE User SET role = ? WHERE id = ?', [role, id]);
    return this.findById(id);
  },

  async verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  },

  async delete(id) {
    await pool.execute('DELETE FROM User WHERE id = ?', [id]);
  },
};

module.exports = UserModel;
