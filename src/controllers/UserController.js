// src/controllers/userController.js
import { db } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { User, Organization, Department } = db;

// ✅ Register (Create) User
export const createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      organizationId,
      departmentId,
      roleIds,
      isActive = true
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 🔍 Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // 🔐 Hash password (also handled in hooks but kept for safety)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      organizationId,
      departmentId,
      isActive
    });

    // 🧩 Assign roles if provided
    if (Array.isArray(roleIds) && roleIds.length > 0) {
      const roleLinks = roleIds.map((roleId) => ({
        userId: user.id,
        roleId,
        assigned_at: new Date()
      }));

      await UserRole.bulkCreate(roleLinks);
    }

    const safeUser = user.toJSON();
    delete safeUser.password;

    return res.status(201).json({
      success: true,
      message: `User created successfully${roleIds?.length ? ' with roles' : ''}`,
      user: safeUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Organization, as: 'organization', attributes: ['id', 'name'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
      ],
      attributes: { exclude: ['password'] },
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get User by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [
        { model: Organization, as: 'organization', attributes: ['id', 'name'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] },
      ],
      attributes: { exclude: ['password'] },
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, departmentId, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.update({ fullName, email, departmentId, isActive });

    const safeUser = user.toJSON();
    delete safeUser.password;

    res.status(200).json({ success: true, message: 'User updated successfully', user: safeUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete User (Soft delete due to paranoid: true)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.destroy();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Login User (optional for testing)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    await user.update({ lastLoginAt: new Date() });

    const safeUser = user.toJSON();
    delete safeUser.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
