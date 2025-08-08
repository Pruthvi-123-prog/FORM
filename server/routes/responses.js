const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Response = require('../models/Response');
const Form = require('../models/Form');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Helper function to calculate score
const calculateScore = (answers, formQuestions) => {
  let score = 0;
  let maxScore = 0;

  answers.forEach(answer => {
    const question = formQuestions.find(q => q.id === answer.questionId);
    if (!question) return;

    maxScore += 1; // Each question worth 1 point

    switch (answer.questionType) {
      case 'categorize':
        // Check if all items are categorized correctly
        if (answer.categorizedItems && question.items) {
          let correctCount = 0;
          answer.categorizedItems.forEach(item => {
            const correctItem = question.items.find(i => i.id === item.itemId);
            if (correctItem && correctItem.correctCategory === item.categoryId) {
              correctCount++;
            }
          });
          if (correctCount === question.items.length) {
            score += 1;
          }
        }
        break;

      case 'cloze':
        // Check if all blanks are filled correctly
        if (answer.blankAnswers && question.blanks) {
          let correctCount = 0;
          answer.blankAnswers.forEach(blank => {
            const correctBlank = question.blanks.find(b => b.id === blank.blankId);
            if (correctBlank && correctBlank.correctAnswer.toLowerCase() === blank.answer.toLowerCase()) {
              correctCount++;
            }
          });
          if (correctCount === question.blanks.length) {
            score += 1;
          }
        }
        break;

      case 'comprehension':
        // Check sub-questions
        if (answer.subAnswers && question.subQuestions) {
          let correctCount = 0;
          answer.subAnswers.forEach(subAnswer => {
            const correctSubQuestion = question.subQuestions.find(sq => sq.id === subAnswer.subQuestionId);
            if (correctSubQuestion && correctSubQuestion.correctAnswer) {
              if (correctSubQuestion.correctAnswer.toLowerCase() === subAnswer.answer.toLowerCase()) {
                correctCount++;
              }
            }
          });
          if (correctCount === question.subQuestions.length) {
            score += 1;
          }
        }
        break;
    }
  });

  return { score, maxScore };
};

// POST /api/responses - Submit form response
router.post('/', [
  body('formSlug').trim().isLength({ min: 1 }).withMessage('Form slug is required'),
  body('answers').isArray().withMessage('Answers must be an array'),
], handleValidationErrors, async (req, res) => {
  try {
    // Find the form
    const form = await Form.findOne({ slug: req.body.formSlug, isPublished: true });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or not published' });
    }

    // Calculate score
    const { score, maxScore } = calculateScore(req.body.answers, form.questions);

    // Create response
    const responseData = {
      formId: form._id,
      formSlug: req.body.formSlug,
      answers: req.body.answers,
      score,
      maxScore,
      completionTime: req.body.completionTime || 0,
      submitterInfo: {
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip || req.connection.remoteAddress || '',
        sessionId: req.body.sessionId || ''
      }
    };

    const response = new Response(responseData);
    await response.save();

    res.status(201).json({
      message: 'Response submitted successfully',
      responseId: response._id,
      score,
      maxScore,
      thankYouMessage: form.settings.thankYouMessage || 'Thank you for your submission!'
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ message: 'Failed to submit response' });
  }
});

// GET /api/responses/:id - Get response by ID
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid response ID')
], handleValidationErrors, async (req, res) => {
  try {
    const response = await Response.findById(req.params.id).populate('formId', 'title');
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    res.json(response);
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ message: 'Failed to fetch response' });
  }
});

// GET /api/responses/form/:slug - Get all responses for a form by slug
router.get('/form/:slug', [
  param('slug').isLength({ min: 1 }).withMessage('Slug is required')
], handleValidationErrors, async (req, res) => {
  try {
    const responses = await Response.find({ formSlug: req.params.slug })
      .sort({ submittedAt: -1 })
      .populate('formId', 'title');
    
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Failed to fetch responses' });
  }
});

// DELETE /api/responses/:id - Delete response
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid response ID')
], handleValidationErrors, async (req, res) => {
  try {
    const response = await Response.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({ message: 'Failed to delete response' });
  }
});

// GET /api/responses/analytics/:formId - Get analytics for a form
router.get('/analytics/:formId', [
  param('formId').isMongoId().withMessage('Invalid form ID')
], handleValidationErrors, async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    
    const analytics = {
      totalResponses: responses.length,
      averageScore: responses.length > 0 ? 
        responses.reduce((sum, r) => sum + r.score, 0) / responses.length : 0,
      averageCompletionTime: responses.length > 0 ?
        responses.reduce((sum, r) => sum + r.completionTime, 0) / responses.length : 0,
      responsesByDay: {},
      scoreDistribution: {
        excellent: 0, // 90-100%
        good: 0,      // 70-89%
        average: 0,   // 50-69%
        poor: 0       // 0-49%
      }
    };

    // Calculate daily responses
    responses.forEach(response => {
      const date = response.submittedAt.toDateString();
      analytics.responsesByDay[date] = (analytics.responsesByDay[date] || 0) + 1;

      // Calculate score distribution
      const percentage = response.maxScore > 0 ? (response.score / response.maxScore) * 100 : 0;
      if (percentage >= 90) analytics.scoreDistribution.excellent++;
      else if (percentage >= 70) analytics.scoreDistribution.good++;
      else if (percentage >= 50) analytics.scoreDistribution.average++;
      else analytics.scoreDistribution.poor++;
    });

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

module.exports = router;
