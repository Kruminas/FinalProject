/* routes/formRoutes.js */
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const Form = require('../models/Form');
const Template = require('../models/Template');

// GET single form by ID
// 1) Admin can see any form
// 2) The form's author can see their own form
// 3) The template's creator can see this form
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate('author', 'email username')
      .populate('template');
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // If admin, allowed
    if (req.user.role === 'admin') {
      return res.json({ form });
    }

    // If user is the author of this form, allowed
    if (String(form.author._id) === String(req.user.id)) {
      return res.json({ form });
    }

    // If user is the template's creator, allowed
    const templateCreatorId = form.template.author.toString();
    if (templateCreatorId === req.user.id) {
      return res.json({ form });
    }

    // Otherwise, forbidden
    return res.status(403).json({ message: 'Not authorized to view this form' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all forms (optional) – If you still want an admin route to see everything
// (You can also skip this if you're only retrieving single forms by ID.)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view all forms' });
    }
    const forms = await Form.find()
      .populate('author', 'email username')
      .populate('template');
    res.json({ forms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to create a form – user answers a template
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

// PUT – only admin, the form author, or the template creator
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('template');
    if (!form) return res.status(404).json({ message: 'Form not found' });

    if (req.user.role === 'admin') {
      form.answers = req.body.answers ?? form.answers;
      await form.save();
      return res.json({ message: 'Form updated', form });
    }

    if (String(form.author) === req.user.id) {
      form.answers = req.body.answers ?? form.answers;
      await form.save();
      return res.json({ message: 'Form updated', form });
    }

    const templateCreatorId = form.template.author.toString();
    if (templateCreatorId === req.user.id) {
      form.answers = req.body.answers ?? form.answers;
      await form.save();
      return res.json({ message: 'Form updated', form });
    }

    return res.status(403).json({ message: 'Not authorized to edit this form' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE – only admin, form author, or template creator
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('template');
    if (!form) return res.status(404).json({ message: 'Form not found' });

    if (req.user.role === 'admin') {
      await form.remove();
      return res.json({ message: 'Form deleted' });
    }

    if (String(form.author) === req.user.id) {
      await form.remove();
      return res.json({ message: 'Form deleted' });
    }

    const templateCreatorId = form.template.author.toString();
    if (templateCreatorId === req.user.id) {
      await form.remove();
      return res.json({ message: 'Form deleted' });
    }

    return res.status(403).json({ message: 'Not authorized to delete this form' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
