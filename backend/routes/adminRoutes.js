const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/users/:id/block', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `User ${user.username} blocked`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/users/:id/unblock', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `User ${user.username} unblocked`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `User ${user.username} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/users/:id/addAdmin', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.username} is now admin`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/users/:id/removeAdmin', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'user' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `Admin rights removed from ${user.username}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;