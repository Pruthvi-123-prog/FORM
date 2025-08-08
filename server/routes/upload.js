const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Configure Cloudinary (you'll need to set these environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/upload/image - Upload image to Cloudinary
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      // If Cloudinary is not configured, return a placeholder URL
      // In production, you should configure Cloudinary
      const placeholderUrl = `https://via.placeholder.com/800x400/e2e8f0/64748b?text=${encodeURIComponent('Image Placeholder')}`;
      return res.json({ 
        url: placeholderUrl,
        message: 'Cloudinary not configured. Using placeholder image.' 
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'form-builder',
          transformation: [
            { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// DELETE /api/upload/image/:publicId - Delete image from Cloudinary
router.delete('/image/:publicId', async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.json({ message: 'Cloudinary not configured' });
    }

    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

// POST /api/upload/base64 - Upload base64 image
router.post('/base64', [
  body('imageData').isLength({ min: 1 }).withMessage('Image data is required'),
  body('filename').optional().trim()
], handleValidationErrors, async (req, res) => {
  try {
    const { imageData, filename } = req.body;

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      // If Cloudinary is not configured, return a placeholder URL
      const placeholderUrl = `https://via.placeholder.com/800x400/e2e8f0/64748b?text=${encodeURIComponent('Image Placeholder')}`;
      return res.json({ 
        url: placeholderUrl,
        message: 'Cloudinary not configured. Using placeholder image.' 
      });
    }

    // Upload base64 image to Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      resource_type: 'image',
      folder: 'form-builder',
      public_id: filename ? filename.split('.')[0] : undefined,
      transformation: [
        { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
      ]
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

module.exports = router;
