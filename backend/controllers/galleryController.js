const db = require('../models/db');

// Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM gallery ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      count: rows.length,
      gallery: rows
    });
  } catch (err) {
    console.error('Get gallery error:', err);
    res.status(500).json({ message: 'Server error while fetching gallery' });
  }
};

// Get gallery item by ID
exports.getGalleryItemById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await db.query(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json({
      success: true,
      galleryItem: rows[0]
    });
  } catch (err) {
    console.error('Get gallery item error:', err);
    res.status(500).json({ message: 'Server error while fetching gallery item' });
  }
};

// Create new gallery item
exports.createGalleryItem = async (req, res) => {
  const { title, description, image_url } = req.body;
  
  // Validation
  if (!image_url) {
    return res.status(400).json({ 
      message: 'Image URL is required' 
    });
  }

  try {
    // Create the gallery item
    const [result] = await db.query(
      'INSERT INTO gallery (title, description, image_url) VALUES (?, ?, ?)',
      [title, description, image_url]
    );

    res.status(201).json({ 
      message: 'Gallery item created successfully',
      galleryItemId: result.insertId,
      galleryItem: {
        id: result.insertId,
        title,
        description,
        image_url,
        created_at: new Date()
      }
    });
  } catch (err) {
    console.error('Create gallery item error:', err);
    res.status(500).json({ message: 'Server error while creating gallery item' });
  }
};

// Update gallery item
exports.updateGalleryItem = async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url } = req.body;
  
  try {
    // Check if gallery item exists
    const [existing] = await db.query(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Update the gallery item
    await db.query(
      'UPDATE gallery SET title = ?, description = ?, image_url = ? WHERE id = ?',
      [title, description, image_url, id]
    );
    
    res.json({ 
      message: 'Gallery item updated successfully',
      galleryItemId: id
    });
  } catch (err) {
    console.error('Update gallery item error:', err);
    res.status(500).json({ message: 'Server error while updating gallery item' });
  }
};

// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if gallery item exists
    const [existing] = await db.query(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await db.query('DELETE FROM gallery WHERE id = ?', [id]);
    res.json({ 
      message: 'Gallery item deleted successfully',
      galleryItemId: id
    });
  } catch (err) {
    console.error('Delete gallery item error:', err);
    res.status(500).json({ message: 'Server error while deleting gallery item' });
  }
};

// Get gallery statistics
exports.getGalleryStats = async (req, res) => {
  try {
    // Total gallery items
    const [totalResult] = await db.query('SELECT COUNT(*) as total FROM gallery');
    
    // Recent uploads (last 7 days)
    const [recentResult] = await db.query(
      'SELECT COUNT(*) as recent FROM gallery WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    
    // Items with titles
    const [titledResult] = await db.query(
      'SELECT COUNT(*) as titled FROM gallery WHERE title IS NOT NULL AND title != ""'
    );
    
    res.json({
      success: true,
      stats: {
        total: totalResult[0].total,
        recent: recentResult[0].recent,
        titled: titledResult[0].titled,
        untitled: totalResult[0].total - titledResult[0].titled
      }
    });
  } catch (err) {
    console.error('Get gallery stats error:', err);
    res.status(500).json({ message: 'Server error while fetching gallery statistics' });
  }
};

// Search gallery items
exports.searchGalleryItems = async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ 
      message: 'Search query is required' 
    });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM gallery WHERE (title LIKE ? OR description LIKE ?) ORDER BY created_at DESC',
      [`%${q}%`, `%${q}%`]
    );
    
    res.json({
      success: true,
      count: rows.length,
      query: q,
      gallery: rows
    });
  } catch (err) {
    console.error('Search gallery error:', err);
    res.status(500).json({ message: 'Server error while searching gallery' });
  }
};
