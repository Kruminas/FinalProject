/* routes/formRoutes.js */
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const Form = require('../models/Form');
const Template = require('../models/Template');

router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const forms = await Form.find()
      .populate('author', 'email username')
      .populate('template');
    res.json({ forms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate('author', 'email username')
      .populate('template');
    if (!form) return res.status(404).json({ message: 'Form not found' });
    if (
      req.user.role !== 'admin' &&
      String(form.author._id) !== req.user.id &&
      String(form.template.author) !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to view' });
    }
    res.json({ form });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { templateId, answers } = req.body;
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    const newForm = new Form({
      template: templateId,
      answers,
      author: req.user.id
    });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('template');
    if (!form) return res.status(404).json({ message: 'Form not found' });
    if (
      form.author.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      String(form.template.author) !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to edit' });
    }
    form.answers = req.body.answers ?? form.answers;
    await form.save();
    res.json({ message: 'Form updated', form });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('template');
    if (!form) return res.status(404).json({ message: 'Form not found' });
    if (
      form.author.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      String(form.template.author) !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
