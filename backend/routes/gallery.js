const express = require('express');
const router = express.Router();
const {
  getAllGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getGalleryStats,
  searchGalleryItems
} = require('../controllers/galleryController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public routes
router.get('/', getAllGalleryItems);
router.get('/:id', getGalleryItemById);
router.get('/search', searchGalleryItems);

// Admin routes (require authentication)
router.post('/', verifyAdminToken, createGalleryItem);
router.put('/:id', verifyAdminToken, updateGalleryItem);
router.delete('/:id', verifyAdminToken, deleteGalleryItem);
router.get('/stats/overview', verifyAdminToken, getGalleryStats);

module.exports = router;
