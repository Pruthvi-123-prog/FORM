const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    required: true,
    enum: ['categorize', 'cloze', 'comprehension']
  },
  // Categorize answer
  categorizedItems: [{
    itemId: String,
    categoryId: String
  }],
  // Cloze answer
  blankAnswers: [{
    blankId: String,
    answer: String
  }],
  // Comprehension answers
  subAnswers: [{
    subQuestionId: String,
    answer: String
  }]
}, {
  _id: false
});

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  formSlug: {
    type: String,
    required: true
  },
  answers: [answerSchema],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  submitterInfo: {
    userAgent: String,
    ipAddress: String,
    sessionId: String
  },
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 0
  },
  completionTime: {
    type: Number, // in seconds
    default: 0
  },
  isComplete: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
responseSchema.index({ formId: 1, submittedAt: -1 });
responseSchema.index({ formSlug: 1 });

module.exports = mongoose.model('Response', responseSchema);
