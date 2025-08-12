const db = require('../models/db');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM events ORDER BY date ASC, time ASC'
    );
    res.json({
      success: true,
      count: rows.length,
      events: rows
    });
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC, time ASC'
    );
    res.json({
      success: true,
      count: rows.length,
      events: rows
    });
  } catch (err) {
    console.error('Get upcoming events error:', err);
    res.status(500).json({ message: 'Server error while fetching upcoming events' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await db.query(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({
      success: true,
      event: rows[0]
    });
  } catch (err) {
    console.error('Get event error:', err);
    res.status(500).json({ message: 'Server error while fetching event' });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  const { title, description, date, time, location, image_url } = req.body;
  
  // Validation
  if (!title || !date || !time) {
    return res.status(400).json({ 
      message: 'Title, date, and time are required' 
    });
  }

  // Validate date format and ensure it's not in the past
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (eventDate < today) {
    return res.status(400).json({ 
      message: 'Event date cannot be in the past' 
    });
  }

  // Validate time format (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return res.status(400).json({ 
      message: 'Invalid time format. Use HH:MM format' 
    });
  }

  try {
    // Create the event
    const [result] = await db.query(
      'INSERT INTO events (title, description, date, time, location, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, date, time, location, image_url]
    );

    res.status(201).json({ 
      message: 'Event created successfully',
      eventId: result.insertId,
      event: {
        id: result.insertId,
        title,
        description,
        date,
        time,
        location,
        image_url,
        created_at: new Date()
      }
    });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, location, image_url } = req.body;
  
  try {
    // Check if event exists
    const [existing] = await db.query(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event
    await db.query(
      'UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, image_url = ? WHERE id = ?',
      [title, description, date, time, location, image_url, id]
    );
    
    res.json({ 
      message: 'Event updated successfully',
      eventId: id
    });
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ message: 'Server error while updating event' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if event exists
    const [existing] = await db.query(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await db.query('DELETE FROM events WHERE id = ?', [id]);
    res.json({ 
      message: 'Event deleted successfully',
      eventId: id
    });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

// Get events by date range
exports.getEventsByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ 
      message: 'Start date and end date are required' 
    });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM events WHERE date BETWEEN ? AND ? ORDER BY date ASC, time ASC',
      [startDate, endDate]
    );
    
    res.json({
      success: true,
      count: rows.length,
      startDate,
      endDate,
      events: rows
    });
  } catch (err) {
    console.error('Get events by date range error:', err);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// Get event statistics
exports.getEventStats = async (req, res) => {
  try {
    // Total events
    const [totalResult] = await db.query('SELECT COUNT(*) as total FROM events');
    
    // Upcoming events
    const [upcomingResult] = await db.query(
      'SELECT COUNT(*) as upcoming FROM events WHERE date >= CURDATE()'
    );
    
    // Past events
    const [pastResult] = await db.query(
      'SELECT COUNT(*) as past FROM events WHERE date < CURDATE()'
    );
    
    // Events this month
    const [monthResult] = await db.query(
      'SELECT COUNT(*) as thisMonth FROM events WHERE MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE())'
    );
    
    res.json({
      success: true,
      stats: {
        total: totalResult[0].total,
        upcoming: upcomingResult[0].upcoming,
        past: pastResult[0].past,
        thisMonth: monthResult[0].thisMonth
      }
    });
  } catch (err) {
    console.error('Get event stats error:', err);
    res.status(500).json({ message: 'Server error while fetching event statistics' });
  }
};

// Search events
exports.searchEvents = async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ 
      message: 'Search query is required' 
    });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM events WHERE (title LIKE ? OR description LIKE ? OR location LIKE ?) ORDER BY date ASC, time ASC',
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );
    
    res.json({
      success: true,
      count: rows.length,
      query: q,
      events: rows
    });
  } catch (err) {
    console.error('Search events error:', err);
    res.status(500).json({ message: 'Server error while searching events' });
  }
};

