const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Template = require('../models/Template');
const Form = require('../models/Form');

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const templates = await Template.find({ author: user._id });

    const forms = await Form.find({ author: user._id }).populate('template');

    const liked = await Template.find({ likes: user._id });

    res.json({
      user,
      templates,
      forms,
      liked
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;