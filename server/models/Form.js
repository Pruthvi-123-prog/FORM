const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['categorize', 'cloze', 'comprehension']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: true
  },
  // Categorize question specific fields
  categories: [{
    id: String,
    name: String,
    color: String
  }],
  items: [{
    id: String,
    text: String,
    correctCategory: String
  }],
  // Cloze question specific fields
  sentence: {
    type: String,
    default: ''
  },
  blanks: [{
    id: String,
    position: Number,
    correctAnswer: String,
    placeholder: String
  }],
  // Comprehension question specific fields
  passage: {
    type: String,
    default: ''
  },
  subQuestions: [{
    id: String,
    question: String,
    type: {
      type: String,
      enum: ['multiple-choice', 'text', 'true-false'],
      default: 'text'
    },
    options: [String],
    correctAnswer: String
  }]
}, {
  _id: false
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  headerImage: {
    type: String,
    default: ''
  },
  questions: [questionSchema],
  settings: {
    allowMultipleSubmissions: {
      type: Boolean,
      default: false
    },
    showProgressBar: {
      type: Boolean,
      default: true
    },
    thankYouMessage: {
      type: String,
      default: 'Thank you for your submission!'
    },
    redirectUrl: {
      type: String,
      default: ''
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  },
  slug: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate unique slug before saving
formSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Form', formSchema);
