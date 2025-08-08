const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Form = require('../models/Form');
const Response = require('../models/Response');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
};

// GET /api/forms - Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find()
      .select('title description headerImage isPublished createdAt slug')
      .sort({ createdAt: -1 });
    
    // Get response counts for each form
    const formsWithStats = await Promise.all(
      forms.map(async (form) => {
        const responseCount = await Response.countDocuments({ formId: form._id });
        return {
          ...form.toObject(),
          responseCount
        };
      })
    );
    
    res.json(formsWithStats);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Failed to fetch forms' });
  }
});

// GET /api/forms/:id - Get form by ID
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid form ID')
], handleValidationErrors, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ message: 'Failed to fetch form' });
  }
});

// GET /api/forms/slug/:slug - Get form by slug (for public access)
router.get('/slug/:slug', [
  param('slug').isLength({ min: 1 }).withMessage('Slug is required')
], handleValidationErrors, async (req, res) => {
  try {
    const form = await Form.findOne({ slug: req.params.slug, isPublished: true });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or not published' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error fetching form by slug:', error);
    res.status(500).json({ message: 'Failed to fetch form' });
  }
});

// POST /api/forms - Create new form
router.post('/', [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').optional().trim(),
  body('headerImage').optional().custom((value) => {
    if (value && value.trim() !== '') {
      // Only validate URL if the value is not empty
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(value)) {
        throw new Error('Header image must be a valid URL');
      }
    }
    return true;
  }),
], handleValidationErrors, async (req, res) => {
  try {
    const formData = {
      title: req.body.title,
      description: req.body.description || '',
      headerImage: req.body.headerImage || '',
      questions: req.body.questions || [],
      settings: req.body.settings || {},
      createdBy: req.body.createdBy || 'anonymous'
    };

    const form = new Form(formData);
    await form.save();
    
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Form with this slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create form' });
  }
});

// PUT /api/forms/:id - Update form
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid form ID'),
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('headerImage').optional().custom((value) => {
    if (value && value.trim() !== '') {
      // Only validate URL if the value is not empty
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(value)) {
        throw new Error('Header image must be a valid URL');
      }
    }
    return true;
  }),
], handleValidationErrors, async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.json(form);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ message: 'Failed to update form' });
  }
});

// DELETE /api/forms/:id - Delete form
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid form ID')
], handleValidationErrors, async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    // Also delete all responses for this form
    await Response.deleteMany({ formId: req.params.id });
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Failed to delete form' });
  }
});

// POST /api/forms/:id/publish - Publish/unpublish form
router.post('/:id/publish', [
  param('id').isMongoId().withMessage('Invalid form ID'),
  body('isPublished').isBoolean().withMessage('isPublished must be a boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { isPublished: req.body.isPublished },
      { new: true }
    );
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.json({
      message: form.isPublished ? 'Form published successfully' : 'Form unpublished successfully',
      form
    });
  } catch (error) {
    console.error('Error publishing form:', error);
    res.status(500).json({ message: 'Failed to update form status' });
  }
});

// GET /api/forms/:id/responses - Get responses for a form
router.get('/:id/responses', [
  param('id').isMongoId().withMessage('Invalid form ID')
], handleValidationErrors, async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.id })
      .sort({ submittedAt: -1 });
    
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Failed to fetch responses' });
  }
});

module.exports = router;
