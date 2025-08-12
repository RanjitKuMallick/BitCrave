const db = require('../models/db');

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM menu WHERE available = TRUE ORDER BY category, name'
    );
    res.json({
      success: true,
      count: rows.length,
      menu: rows
    });
  } catch (err) {
    console.error('Get menu error:', err);
    res.status(500).json({ message: 'Server error while fetching menu' });
  }
};

// Get menu items by category
exports.getMenuByCategory = async (req, res) => {
  const { category } = req.params;
  
  try {
    const [rows] = await db.query(
      'SELECT * FROM menu WHERE category = ? AND available = TRUE ORDER BY name',
      [category]
    );
    
    res.json({
      success: true,
      count: rows.length,
      category,
      menu: rows
    });
  } catch (err) {
    console.error('Get menu by category error:', err);
    res.status(500).json({ message: 'Server error while fetching menu' });
  }
};

// Get menu items by type (Veg/Non-Veg)
exports.getMenuByType = async (req, res) => {
  const { type } = req.params;
  
  try {
    const [rows] = await db.query(
      'SELECT * FROM menu WHERE type = ? AND available = TRUE ORDER BY category, name',
      [type]
    );
    
    res.json({
      success: true,
      count: rows.length,
      type,
      menu: rows
    });
  } catch (err) {
    console.error('Get menu by type error:', err);
    res.status(500).json({ message: 'Server error while fetching menu' });
  }
};

// Create new menu item
exports.createMenuItem = async (req, res) => {
  const { name, description, price, category, type, image_url } = req.body;
  
  // Validation
  if (!name || !price || !category) {
    return res.status(400).json({ 
      message: 'Name, price, and category are required' 
    });
  }

  if (price <= 0) {
    return res.status(400).json({ 
      message: 'Price must be greater than 0' 
    });
  }

  const validCategories = ['Starter', 'Main Course', 'Dessert', 'Drinks'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ 
      message: 'Invalid category. Must be one of: Starter, Main Course, Dessert, Drinks' 
    });
  }

  const validTypes = ['Veg', 'Non-Veg'];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({ 
      message: 'Invalid type. Must be Veg or Non-Veg' 
    });
  }

  try {
    // Check if item already exists
    const [existing] = await db.query(
      'SELECT id FROM menu WHERE name = ?',
      [name]
    );

    if (existing.length > 0) {
      return res.status(409).json({ 
        message: 'Menu item with this name already exists' 
      });
    }

    // Create the menu item
    const [result] = await db.query(
      'INSERT INTO menu (name, description, price, category, type, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category, type, image_url]
    );

    res.status(201).json({ 
      message: 'Menu item created successfully',
      menuItemId: result.insertId,
      menuItem: {
        id: result.insertId,
        name,
        description,
        price,
        category,
        type,
        image_url,
        available: true
      }
    });
  } catch (err) {
    console.error('Create menu item error:', err);
    res.status(500).json({ message: 'Server error while creating menu item' });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, type, image_url, available } = req.body;
  
  try {
    // Check if menu item exists
    const [existing] = await db.query(
      'SELECT * FROM menu WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Update the menu item
    await db.query(
      'UPDATE menu SET name = ?, description = ?, price = ?, category = ?, type = ?, image_url = ?, available = ? WHERE id = ?',
      [name, description, price, category, type, image_url, available, id]
    );
    
    res.json({ 
      message: 'Menu item updated successfully',
      menuItemId: id
    });
  } catch (err) {
    console.error('Update menu item error:', err);
    res.status(500).json({ message: 'Server error while updating menu item' });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if menu item exists
    const [existing] = await db.query(
      'SELECT * FROM menu WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await db.query('DELETE FROM menu WHERE id = ?', [id]);
    res.json({ 
      message: 'Menu item deleted successfully',
      menuItemId: id
    });
  } catch (err) {
    console.error('Delete menu item error:', err);
    res.status(500).json({ message: 'Server error while deleting menu item' });
  }
};

// Toggle menu item availability
exports.toggleAvailability = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if menu item exists
    const [existing] = await db.query(
      'SELECT * FROM menu WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const currentStatus = existing[0].available;
    const newStatus = !currentStatus;

    await db.query(
      'UPDATE menu SET available = ? WHERE id = ?',
      [newStatus, id]
    );
    
    res.json({ 
      message: `Menu item ${newStatus ? 'activated' : 'deactivated'} successfully`,
      menuItemId: id,
      available: newStatus
    });
  } catch (err) {
    console.error('Toggle availability error:', err);
    res.status(500).json({ message: 'Server error while updating availability' });
  }
};

// Get menu statistics
exports.getMenuStats = async (req, res) => {
  try {
    // Total menu items
    const [totalResult] = await db.query('SELECT COUNT(*) as total FROM menu');
    
    // Available menu items
    const [availableResult] = await db.query('SELECT COUNT(*) as available FROM menu WHERE available = TRUE');
    
    // Items by category
    const [categoryResult] = await db.query(
      'SELECT category, COUNT(*) as count FROM menu GROUP BY category'
    );
    
    // Items by type
    const [typeResult] = await db.query(
      'SELECT type, COUNT(*) as count FROM menu WHERE type IS NOT NULL GROUP BY type'
    );
    
    res.json({
      success: true,
      stats: {
        total: totalResult[0].total,
        available: availableResult[0].available,
        unavailable: totalResult[0].total - availableResult[0].available,
        byCategory: categoryResult,
        byType: typeResult
      }
    });
  } catch (err) {
    console.error('Get menu stats error:', err);
    res.status(500).json({ message: 'Server error while fetching menu statistics' });
  }
};

// Search menu items
exports.searchMenuItems = async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ 
      message: 'Search query is required' 
    });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM menu WHERE (name LIKE ? OR description LIKE ?) AND available = TRUE ORDER BY name',
      [`%${q}%`, `%${q}%`]
    );
    
    res.json({
      success: true,
      count: rows.length,
      query: q,
      menu: rows
    });
  } catch (err) {
    console.error('Search menu error:', err);
    res.status(500).json({ message: 'Server error while searching menu' });
  }
};
