// src/controllers/AuthController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../models/index.js';
import { JWT_SECRET, JWT_EXPIRY } from '../config/jwt.js';

export const register = async (req, res) => {
  try {
    const { fullName, email, password, organizationId, departmentId } = req.body;

    const existing = await db.User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

    const user = await db.User.create({
      fullName,
      email,
      password,
      organizationId,
      departmentId,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const agent = req.headers['user-agent'];

  try {
    // 🔹 Removed `.scope('withPassword')`
    const user = await db.User.findOne({
      where: { email },
      include: [
        { model: db.Organization, as: 'organization' },
        { model: db.Department, as: 'department' },
      ],
      // 🔹 Explicitly include password here (since we removed the scope)
      attributes: { include: ['password'] },
    });

    if (!user) {
      await db.LoginAttempt.create({
        email,
        status: 'failed',
        ip_address: ip,
        user_agent: agent,
      });
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.isActive) {
      await db.LoginAttempt.create({
        user_id: user.id,
        status: 'locked',
        ip_address: ip,
        user_agent: agent,
      });
      return res.status(403).json({ success: false, message: 'User inactive' });
    }

    console.log("user.password--------------", user.password);

    const match = await bcrypt.compare(password, user.password);
    console.log("match--------------", match);

    if (!match) {
      await db.LoginAttempt.create({
        user_id: user.id,
        status: 'failed',
        ip_address: ip,
        user_agent: agent,
      });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY || '1d' }
    );

    await db.Session.create({
      user_id: user.id,
      token,
      status: 'active',
      ip_address: ip,
      user_agent: agent,
      created_at: new Date(),
    });

    await db.LoginAttempt.create({
      user_id: user.id,
      status: 'success',
      ip_address: ip,
      user_agent: agent,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        organization: user.organization,
        department: user.department,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ success: false, message: 'Token missing' });

    await db.Session.update(
      { status: 'revoked' },
      { where: { token } }
    );

    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token missing' });

    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY || '1d' });
    return res.json({ success: true, token: newToken });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
