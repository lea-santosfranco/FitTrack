const jwt       = require('jsonwebtoken');
const UserModel  = require('../models/user.model');
const { sendVerificationEmail } = require('../utils/mailer');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username, role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const AuthController = {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { username, email, password, weight, goal } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email and password are required.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ error: 'Email already in use.' });
      }

      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ error: 'Username already taken.' });
      }

      const { id: userId, verificationToken } = await UserModel.create({ username, email, password, weight, goal });
      await sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        message: 'Account created. Please check your email to verify your account before logging in.',
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Failed to create account.' });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const isValid = await UserModel.verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      if (!user.email_verified) {
        return res.status(403).json({ error: 'Please verify your email before logging in.' });
      }

      const { password: _, verification_token, verification_token_expires, ...userWithoutPassword } = user;
      const token = generateToken(user);

      res.json({ message: 'Login successful.', token, user: userWithoutPassword });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed.' });
    }
  },

  // GET /api/auth/verify-email?token=...
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ error: 'Verification token is required.' });

      const user = await UserModel.findByVerificationToken(token);
      if (!user) return res.status(400).json({ error: 'Invalid or already used verification link.' });

      if (new Date(user.verification_token_expires) < new Date()) {
        return res.status(400).json({ error: 'Verification link has expired. Please request a new one.' });
      }

      await UserModel.verifyEmail(user.id);
      res.json({ message: 'Email verified successfully. You can now log in.' });
    } catch (err) {
      console.error('VerifyEmail error:', err);
      res.status(500).json({ error: 'Failed to verify email.' });
    }
  },

  // POST /api/auth/resend-verification
  async resendVerification(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email is required.' });

      // Réponse générique dans tous les cas pour ne pas révéler si l'email existe (anti-énumération)
      const genericResponse = { message: 'If an account exists for this email, a verification link has been sent.' };

      const user = await UserModel.findByEmail(email);
      if (!user || user.email_verified) {
        return res.json(genericResponse);
      }

      const token = await UserModel.setNewVerificationToken(user.id);
      await sendVerificationEmail(user.email, token);

      res.json(genericResponse);
    } catch (err) {
      console.error('ResendVerification error:', err);
      res.status(500).json({ error: 'Failed to resend verification email.' });
    }
  },

  // GET /api/auth/me
  async me(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found.' });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch profile.' });
    }
  },

  // PUT /api/auth/profile
  async updateProfile(req, res) {
    try {
      const { username, email, weight, goal } = req.body;

      if (email) {
        const existing = await UserModel.findByEmail(email);
        if (existing && existing.id !== req.user.id) {
          return res.status(409).json({ error: 'Email already in use.' });
        }
      }
      if (username) {
        const existing = await UserModel.findByUsername(username);
        if (existing && existing.id !== req.user.id) {
          return res.status(409).json({ error: 'Username already taken.' });
        }
      }

      const user = await UserModel.update(req.user.id, { username, email, weight, goal });
      res.json({ message: 'Profile updated.', user });
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).json({ error: 'Failed to update profile.' });
    }
  },
};

module.exports = AuthController;
