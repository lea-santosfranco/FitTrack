const UserModel    = require('../models/user.model');
const VALID_ROLES  = ['user', 'admin'];

const AdminController = {
  // GET /api/admin/users
  async listUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json({ users, count: users.length });
    } catch (err) {
      console.error('ListUsers error:', err);
      res.status(500).json({ error: 'Failed to fetch users.' });
    }
  },

  // PATCH /api/admin/users/:id/role
  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(', ')}` });
      }

      const target = await UserModel.findById(req.params.id);
      if (!target) return res.status(404).json({ error: 'User not found.' });

      if (Number(req.params.id) === req.user.id && role !== 'admin') {
        return res.status(400).json({ error: 'You cannot revoke your own admin role.' });
      }

      const user = await UserModel.updateRole(req.params.id, role);
      res.json({ message: 'Role updated.', user });
    } catch (err) {
      console.error('UpdateUserRole error:', err);
      res.status(500).json({ error: 'Failed to update role.' });
    }
  },
};

module.exports = AdminController;
