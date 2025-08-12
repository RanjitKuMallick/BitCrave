const db = require('../models/db');

// Create reservation
exports.createReservation = async (req, res) => {
  const { name, email, phone, date, time, people, special_requests, table_number, order_items } = req.body;
  
  // Validation
  if (!name || !date || !time || !people) {
    return res.status(400).json({ 
      message: 'Name, date, time, and number of people are required' 
    });
  }

  // Validate date format and ensure it's not in the past
  const reservationDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (reservationDate < today) {
    return res.status(400).json({ 
      message: 'Reservation date cannot be in the past' 
    });
  }

  // Validate time format (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return res.status(400).json({ 
      message: 'Invalid time format. Use HH:MM format' 
    });
  }

  // Validate number of people
  if (people < 1 || people > 20) {
    return res.status(400).json({ 
      message: 'Number of people must be between 1 and 20' 
    });
  }

  try {
    // Check if the restaurant is open (assuming 11:00-22:00)
    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 11 || hours >= 22) {
      return res.status(400).json({ 
        message: 'Reservations are only accepted between 11:00 AM and 10:00 PM' 
      });
    }

    // Check for table availability and prevent double booking
    let assignedTable = null;
    
    // Get all tables that are already booked for this date and time
    const [bookedTables] = await db.query(
      'SELECT table_number FROM reservations WHERE date = ? AND time = ? AND status != "Cancelled" AND table_number IS NOT NULL',
      [date, time]
    );
    
    const bookedTableNumbers = bookedTables.map(row => row.table_number);
    
    // Find suitable table based on capacity that is NOT already booked
    let tableQuery;
    if (people <= 2) {
      tableQuery = `
        SELECT id, table_number, capacity 
        FROM tables 
        WHERE capacity >= ? AND capacity <= 2 
        AND status = "available" 
        AND table_number NOT IN (${bookedTableNumbers.length > 0 ? bookedTableNumbers.map(() => '?').join(',') : 'NULL'})
        ORDER BY capacity ASC 
        LIMIT 1
      `;
    } else if (people <= 4) {
      tableQuery = `
        SELECT id, table_number, capacity 
        FROM tables 
        WHERE capacity >= ? AND capacity <= 4 
        AND status = "available" 
        AND table_number NOT IN (${bookedTableNumbers.length > 0 ? bookedTableNumbers.map(() => '?').join(',') : 'NULL'})
        ORDER BY capacity ASC 
        LIMIT 1
      `;
    } else {
      tableQuery = `
        SELECT id, table_number, capacity 
        FROM tables 
        WHERE capacity >= ? 
        AND status = "available" 
        AND table_number NOT IN (${bookedTableNumbers.length > 0 ? bookedTableNumbers.map(() => '?').join(',') : 'NULL'})
        ORDER BY capacity ASC 
        LIMIT 1
      `;
    }
    
    const queryParams = [people, ...bookedTableNumbers];
    const [availableTables] = await db.query(tableQuery, queryParams);
    
    if (availableTables.length > 0) {
      assignedTable = availableTables[0].table_number;
    } else {
      // No suitable table available
      return res.status(409).json({ 
        message: 'Sorry, no suitable tables are available for this time slot. Please choose another time or date.' 
      });
    }


    
    // Create the reservation with automatically assigned table
    const [result] = await db.query(
      'INSERT INTO reservations (name, email, phone, date, time, people, message, table_number, order_items, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, date, time, people, special_requests || null, assignedTable, order_items || null, "Pending"]
    );

    res.status(201).json({ 
      message: 'Reservation created successfully',
      reservationId: result.insertId,
      assignedTable: assignedTable,
      reservation: {
        id: result.insertId,
        name,
        email,
        phone,
        date,
        time,
        people,
        message: special_requests,
        table_number: assignedTable,
        order_items
      }
    });
  } catch (err) {
    console.error('Reservation creation error:', err);
    res.status(500).json({ message: 'Server error while creating reservation' });
  }
};

// Get user's own reservations
exports.getUserReservations = async (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ 
      message: 'Email is required to fetch user reservations' 
    });
  }
  
  try {
    const [rows] = await db.query(
      'SELECT * FROM reservations WHERE email = ? ORDER BY date DESC, time DESC',
      [email]
    );
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Get user reservations error:', err);
    res.status(500).json({ message: 'Server error while fetching user reservations' });
  }
};

// Get all reservations (admin only)
exports.getAllReservations = async (req, res) => {
  try {
    // Get filter parameters
    const { date, status, search } = req.query;
    
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];
    
    // Add date filter
    if (date) {
      query += ' AND DATE(date) = ?';
      params.push(date);
    }
    
    // Add status filter
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    // Add search filter
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Sort by created_at in descending order (newest first)
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await db.query(query, params);
    
    // Format dates properly for frontend
    const formattedRows = rows.map(row => ({
      ...row,
      date: row.date ? new Date(row.date).toISOString().split('T')[0] : null,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null
    }));
    
    res.json({
      success: true,
      count: formattedRows.length,
      data: formattedRows
    });
  } catch (err) {
    console.error('Get reservations error:', err);
    res.status(500).json({ message: 'Server error while fetching reservations' });
  }
};

// Get reservations by date range (admin only)
exports.getReservationsByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ 
      message: 'Start date and end date are required' 
    });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM reservations WHERE date BETWEEN ? AND ? ORDER BY date ASC, time ASC',
      [startDate, endDate]
    );
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error('Get reservations by date range error:', err);
    res.status(500).json({ message: 'Server error while fetching reservations' });
  }
};

// Get reservations for today (admin only)
exports.getTodayReservations = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await db.query(
      'SELECT * FROM reservations WHERE date = ? ORDER BY time ASC',
      [today]
    );
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error('Get today reservations error:', err);
    res.status(500).json({ message: 'Server error while fetching today\'s reservations' });
  }
};

// Get a specific reservation by ID
exports.getReservationById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await db.query(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error('Get reservation by ID error:', err);
    res.status(500).json({ message: 'Server error while fetching reservation' });
  }
};

// Update a reservation (for staff and admin)
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { 
    name, email, phone, date, time, people, message, 
    order_items, feedback, status, payment_status 
  } = req.body;
  
  try {
    // Check if reservation exists
    const [existing] = await db.query(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Build update query dynamically based on provided fields
    let updateFields = [];
    let updateValues = [];
    
    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      // Convert ISO date string to YYYY-MM-DD format
      const formattedDate = new Date(date).toISOString().split('T')[0];
      updateValues.push(formattedDate);
    }
    if (time !== undefined) {
      updateFields.push('time = ?');
      updateValues.push(time);
    }
    if (people !== undefined) {
      updateFields.push('people = ?');
      updateValues.push(people);
    }
    if (message !== undefined) {
      updateFields.push('message = ?');
      updateValues.push(message);
    }
    if (order_items !== undefined) {
      updateFields.push('order_items = ?');
      updateValues.push(order_items);
    }
    if (feedback !== undefined) {
      updateFields.push('feedback = ?');
      updateValues.push(feedback);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (payment_status !== undefined) {
      updateFields.push('payment_status = ?');
      updateValues.push(payment_status);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    updateValues.push(id);
    
    // Update the reservation
    await db.query(
      `UPDATE reservations SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // If payment status is being set to "Paid", mark the table as available for future bookings
    if (payment_status === "Paid") {
      const reservation = existing[0];
      if (reservation.table_number) {
        // The table is now free for future bookings
        // We don't need to update the tables table since we're using table_number directly
        // The table becomes available when the reservation is marked as paid
        console.log(`Table ${reservation.table_number} is now free for future bookings`);
      }
    }
    
    res.json({ 
      message: 'Reservation updated successfully',
      reservationId: id
    });
  } catch (err) {
    console.error('Update reservation error:', err);
    res.status(500).json({ message: 'Server error while updating reservation' });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if reservation exists
    const [existing] = await db.query(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await db.query('DELETE FROM reservations WHERE id = ?', [id]);
    res.json({ 
      message: 'Reservation deleted successfully',
      reservationId: id
    });
  } catch (err) {
    console.error('Delete reservation error:', err);
    res.status(500).json({ message: 'Server error while deleting reservation' });
  }
};

// Check availability for a specific date and time
exports.checkAvailability = async (req, res) => {
  const { date, time } = req.query;
  
  if (!date || !time) {
    return res.status(400).json({ 
      message: 'Date and time are required' 
    });
  }

  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM reservations WHERE date = ? AND time = ?',
      [date, time]
    );
    
    const isAvailable = rows[0].count < 3; // Max 3 reservations per time slot
    
    res.json({
      success: true,
      date,
      time,
      isAvailable,
      currentBookings: rows[0].count,
      maxBookings: 3
    });
  } catch (err) {
    console.error('Check availability error:', err);
    res.status(500).json({ message: 'Server error while checking availability' });
  }
};

// Confirm reservation (admin only) - table already assigned automatically
exports.confirmReservation = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if reservation exists
    const [existing] = await db.query(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    const reservation = existing[0];
    
    // Check if table is already assigned
    if (!reservation.table_number) {
      return res.status(400).json({ message: 'No table assigned to this reservation' });
    }
    
    // Check if table is available for the given date and time
    const [tableConflict] = await db.query(
      'SELECT COUNT(*) as count FROM reservations WHERE date = ? AND time = ? AND table_number = ? AND status = "Confirmed" AND id != ?',
      [reservation.date, reservation.time, reservation.table_number, id]
    );
    
    if (tableConflict[0].count > 0) {
      return res.status(409).json({ message: 'Table is already assigned for this time slot' });
    }
    
    // Update reservation status (table is already assigned)
    await db.query(
      'UPDATE reservations SET status = "Confirmed" WHERE id = ?',
      [id]
    );
    
    res.json({ 
      message: 'Reservation confirmed successfully',
      reservationId: id,
      assignedTable: reservation.table_number
    });
  } catch (err) {
    console.error('Confirm reservation error:', err);
    res.status(500).json({ message: 'Server error while confirming reservation' });
  }
};

// Cancel reservation (admin only)
exports.cancelReservation = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if reservation exists
    const [existing] = await db.query(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    // Update reservation status
    await db.query(
      'UPDATE reservations SET status = "Cancelled" WHERE id = ?',
      [id]
    );
    
    res.json({ 
      message: 'Reservation cancelled successfully',
      reservationId: id
    });
  } catch (err) {
    console.error('Cancel reservation error:', err);
    res.status(500).json({ message: 'Server error while cancelling reservation' });
  }
};

// Get available tables for a specific date and time
exports.getAvailableTables = async (req, res) => {
  const { date, time, people } = req.query;
  
  if (!date || !time || !people) {
    return res.status(400).json({ 
      message: 'Date, time, and number of people are required' 
    });
  }
  
  try {
    // Get all tables from the tables table
    const [allTables] = await db.query('SELECT * FROM tables WHERE status = "available"');
    
    // Get booked table IDs for the given date and time
    const [bookedTables] = await db.query(
      'SELECT table_id FROM reservations WHERE date = ? AND time = ? AND status IN ("Confirmed", "Pending")',
      [date, time]
    );
    
    const bookedTableIds = bookedTables.map(row => row.table_id);
    
    // Filter out booked tables and filter by capacity
    const guestCount = parseInt(people);
    let availableTables = allTables.filter(table => 
      !bookedTableIds.includes(table.id) && table.capacity >= guestCount
    );
    
    // Filter tables based on guest count (1-2 people: tables 1-5, 3-4 people: tables 6-10, 5+ people: tables 11+)
    if (guestCount <= 2) {
      availableTables = availableTables.filter(table => table.id <= 5);
    } else if (guestCount <= 4) {
      availableTables = availableTables.filter(table => table.id >= 6 && table.id <= 10);
    } else {
      availableTables = availableTables.filter(table => table.id >= 11);
    }
    
    res.json({
      success: true,
      data: availableTables,
      totalAvailable: availableTables.length
    });
  } catch (err) {
    console.error('Get available tables error:', err);
    res.status(500).json({ message: 'Server error while fetching available tables' });
  }
};

// Get reservation statistics (admin only)
exports.getReservationStats = async (req, res) => {
  try {
    // Total reservations
    const [totalResult] = await db.query('SELECT COUNT(*) as total FROM reservations');
    
    // Today's reservations
    const today = new Date().toISOString().split('T')[0];
    const [todayResult] = await db.query(
      'SELECT COUNT(*) as today FROM reservations WHERE date = ?',
      [today]
    );
    
    // Pending reservations
    const [pendingResult] = await db.query(
      'SELECT COUNT(*) as pending FROM reservations WHERE status = "Pending"'
    );
    
    // Confirmed reservations
    const [confirmedResult] = await db.query(
      'SELECT COUNT(*) as confirmed FROM reservations WHERE status = "Confirmed"'
    );
    
    // This week's reservations
    const [weekResult] = await db.query(
      'SELECT COUNT(*) as week FROM reservations WHERE date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)'
    );
    
    // This month's reservations
    const [monthResult] = await db.query(
      'SELECT COUNT(*) as month FROM reservations WHERE MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE())'
    );
    
    res.json({
      success: true,
      stats: {
        total: totalResult[0].total,
        today: todayResult[0].today,
        pending: pendingResult[0].pending,
        confirmed: confirmedResult[0].confirmed,
        thisWeek: weekResult[0].week,
        thisMonth: monthResult[0].month
      }
    });
  } catch (err) {
    console.error('Get reservation stats error:', err);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
};

// Get confirmed reservations for staff (public endpoint)
exports.getConfirmedReservations = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM reservations WHERE status = "Confirmed" AND (payment_status IS NULL OR payment_status != "Paid") ORDER BY date DESC, time ASC'
    );
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error('Get confirmed reservations error:', err);
    res.status(500).json({ message: 'Server error while fetching confirmed reservations' });
  }
};

// Check table availability for a specific date and time
exports.checkTableAvailability = async (req, res) => {
  const { date, time, people } = req.query;
  
  if (!date || !time || !people) {
    return res.status(400).json({ 
      message: 'Date, time, and number of people are required' 
    });
  }

  try {
    // Get all tables that are already booked for this date and time
    const [bookedTables] = await db.query(
      'SELECT table_number FROM reservations WHERE date = ? AND time = ? AND status != "Cancelled" AND table_number IS NOT NULL',
      [date, time]
    );
    
    const bookedTableNumbers = bookedTables.map(row => row.table_number);
    
    // Find suitable tables based on capacity that are NOT already booked
    let tableQuery;
    const guestCount = parseInt(people);
    
    if (guestCount <= 2) {
      tableQuery = `
        SELECT id, table_number, capacity, location
        FROM tables 
        WHERE capacity >= ? AND capacity <= 2 
        AND status = "available" 
        AND table_number NOT IN (${bookedTableNumbers.length > 0 ? bookedTableNumbers.map(() => '?').join(',') : 'NULL'})
        ORDER BY capacity ASC
      `;
    } else if (guestCount <= 4) {
      tableQuery = `
        SELECT id, table_number, capacity, location
        FROM tables 
        WHERE capacity >= ? AND capacity <= 4 
        AND status = "available" 
        AND table_number NOT IN (${bookedTableNumbers.length > 0 ? bookedTableNumbers.map(() => '?').join(',') : 'NULL'})
        ORDER BY capacity ASC
      `;
    } else {
      tableQuery = `
        SELECT id, table_number, capacity, location
        FROM tables 
        WHERE capacity >= ? 
        AND status = "available" 
        AND table_number NOT IN (${bookedTableNumbers.length > 0 ? bookedTableNumbers.map(() => '?').join(',') : 'NULL'})
        ORDER BY capacity ASC
      `;
    }
    
    const queryParams = [guestCount, ...bookedTableNumbers];
    const [availableTables] = await db.query(tableQuery, queryParams);
    
    res.json({
      success: true,
      available: availableTables.length > 0,
      availableTables: availableTables,
      totalAvailable: availableTables.length,
      message: availableTables.length > 0 
        ? `Found ${availableTables.length} suitable table(s) available` 
        : 'No suitable tables available for this time slot'
    });
  } catch (err) {
    console.error('Check table availability error:', err);
    res.status(500).json({ message: 'Server error while checking table availability' });
  }
};
