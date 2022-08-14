const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const problemSchema = new Schema({
  link: { type: String, required: true },
  name: { type: String, required: true },
  difficulty: { type: Number },
  folder: { type: String },
  tags: { type: Array },
  code: { type: String },
  notes: { type: String },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;