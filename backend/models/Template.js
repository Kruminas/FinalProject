const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'number', 'multiple-choice', 'checkbox'],
    required: true
  },
  options: [String]
});

const TemplateSchema = new Schema({
  title:       { type: String, required: true },
  description: String,
  questions:   [QuestionSchema],
  author:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likes:       [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', TemplateSchema);