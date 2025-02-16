/* routes/templateRoutes.js */
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const Template = require('../models/Template');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const newTemplate = new Template({
      title,
      description,
      questions,
      author: req.user.id
    });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i');
    const templates = await Template.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        {
          questions: {
            $elemMatch: { questionText: { $regex: regex } }
          }
        },
        {
          questions: {
            $elemMatch: { type: { $regex: regex } }
          }
        }
      ]
    }).populate('author', 'email username');
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const templates = await Template.find().populate('author', 'email username');
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).populate('author', 'email username');
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ template });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    if (template.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit' });
    }
    template.title = req.body.title ?? template.title;
    template.description = req.body.description ?? template.description;
    template.questions = req.body.questions ?? template.questions;
    await template.save();
    res.json({ message: 'Template updated', template });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    if (template.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
