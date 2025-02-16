/* models/Form.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answer:     { type: mongoose.Schema.Types.Mixed, required: true }
});

const FormSchema = new Schema({
  template:  { type: Schema.Types.ObjectId, ref: 'Template', required: true },
  answers:   [AnswerSchema],
  author:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', FormSchema);
