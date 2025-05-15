const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  message: { type: String, default:'no message'},
  status: { type: String, default: 'submitted' },
  updatedBy: { type: String, default: null },
  category1: { type: String,required: true },
  category2: { type: String,required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);
