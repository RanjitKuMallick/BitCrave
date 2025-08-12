const db = require('../models/db');
const bcrypt = require('bcryptjs');

// Staff login
exports.staffLogin = async (req, res) => {
  const { staff_id, password } = req.body;
  
  if (!staff_id || !password) {
    return res.status(400).json({ message: 'Staff ID and password are required' });
  }

  try {
    // Find staff member by staff_id
    const [staff] = await db.query(
      'SELECT * FROM staff WHERE staff_id = ? AND status = "active"',
      [staff_id]
    );

    if (staff.length === 0) {
      return res.status(401).json({ message: 'Invalid staff ID or inactive account' });
    }

    const staffMember = staff[0];
    
    // For demo purposes, use staff_id as password
    // In production, use proper password hashing
    if (password !== staff_id.toString()) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      staff: {
        id: staffMember.id,
        staff_id: staffMember.staff_id,
        name: staffMember.name,
        email: staffMember.email
      }
    });
  } catch (error) {
    console.error('Staff login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get staff's assigned tables for today
exports.getStaffAssignedTables = async (req, res) => {
  const { staff_id } = req.params;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Get staff's assigned tables for today
    const [assignments] = await db.query(
      `SELECT sta.table_number, t.capacity, t.location 
       FROM staff_table_assignments sta
       JOIN tables t ON sta.table_number = t.table_number
       WHERE sta.staff_id = (SELECT id FROM staff WHERE staff_id = ?) 
       AND sta.assigned_date = ?`,
      [staff_id, today]
    );

    res.json({
      success: true,
      assignedTables: assignments
    });
  } catch (error) {
    console.error('Get staff assigned tables error:', error);
    res.status(500).json({ message: 'Server error while fetching assigned tables' });
  }
};

// Get reservations for staff's assigned tables
exports.getStaffReservations = async (req, res) => {
  const { staff_id } = req.params;

  try {
    // Get staff's assigned table numbers (all dates)
    const [assignments] = await db.query(
      `SELECT DISTINCT sta.table_number 
       FROM staff_table_assignments sta
       WHERE sta.staff_id = (SELECT id FROM staff WHERE staff_id = ?)`,
      [staff_id]
    );

    if (assignments.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: [],
        message: 'No tables assigned to you'
      });
    }

    const assignedTableNumbers = assignments.map(a => a.table_number);

    // Get confirmed reservations for staff's assigned tables (all dates)
    const [reservations] = await db.query(
      `SELECT * FROM reservations 
       WHERE status = "Confirmed" 
       AND (payment_status IS NULL OR payment_status != "Paid")
       AND table_number IN (?)
       ORDER BY date DESC, time ASC`,
      [assignedTableNumbers]
    );

    res.json({
      success: true,
      count: reservations.length,
      data: reservations,
      assignedTables: assignedTableNumbers
    });
  } catch (error) {
    console.error('Get staff reservations error:', error);
    res.status(500).json({ message: 'Server error while fetching reservations' });
  }
};

// Assign table to staff for a specific date
exports.assignTableToStaff = async (req, res) => {
  const { staff_id, table_number, assigned_date } = req.body;

  if (!staff_id || !table_number || !assigned_date) {
    return res.status(400).json({ message: 'Staff ID, table number, and date are required' });
  }

  try {
    // Check if staff exists
    const [staff] = await db.query('SELECT id FROM staff WHERE staff_id = ?', [staff_id]);
    if (staff.length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Check if table exists
    const [table] = await db.query('SELECT * FROM tables WHERE table_number = ?', [table_number]);
    if (table.length === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Assign table to staff
    await db.query(
      'INSERT INTO staff_table_assignments (staff_id, table_number, assigned_date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP',
      [staff[0].id, table_number, assigned_date]
    );

    res.json({
      success: true,
      message: `Table ${table_number} assigned to staff ${staff_id} for ${assigned_date}`
    });
  } catch (error) {
    console.error('Assign table to staff error:', error);
    res.status(500).json({ message: 'Server error while assigning table' });
  }
};

// Get all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const [staff] = await db.query('SELECT * FROM staff ORDER BY name');
    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Get all staff error:', error);
    res.status(500).json({ message: 'Server error while fetching staff' });
  }
};

// Unassign table from staff
exports.unassignTableFromStaff = async (req, res) => {
  const { staff_id, table_number, assigned_date } = req.body;

  if (!staff_id || !table_number || !assigned_date) {
    return res.status(400).json({ message: 'Staff ID, table number, and date are required' });
  }

  try {
    // Check if staff exists
    const [staff] = await db.query('SELECT id FROM staff WHERE staff_id = ?', [staff_id]);
    if (staff.length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Delete the assignment
    const [result] = await db.query(
      'DELETE FROM staff_table_assignments WHERE staff_id = ? AND table_number = ? AND assigned_date = ?',
      [staff[0].id, table_number, assigned_date]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Table assignment not found' });
    }

    res.json({
      success: true,
      message: `Table ${table_number} unassigned from staff ${staff_id}`
    });
  } catch (error) {
    console.error('Unassign table from staff error:', error);
    res.status(500).json({ message: 'Server error while unassigning table' });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [staff] = await db.query('SELECT * FROM staff WHERE id = ?', [id]);
    
    if (staff.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.json({
      success: true,
      data: staff[0]
    });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff member'
    });
  }
};

// Create new staff member
exports.createStaff = async (req, res) => {
  try {
    const { name, email, phone, role, status } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and role are required'
      });
    }
    
    // Check if email already exists
    const [existingStaff] = await db.query(
      'SELECT id FROM staff WHERE email = ?',
      [email]
    );
    
    if (existingStaff.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    // Generate a unique staff_id
    const [maxStaff] = await db.query('SELECT MAX(staff_id) as max_id FROM staff');
    const newStaffId = (maxStaff[0].max_id || 0) + 1;
    
    // Create staff member
    const [result] = await db.query(
      'INSERT INTO staff (staff_id, name, email, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [newStaffId, name, email, phone, role, status || 'active']
    );
    
    // Get the created staff member
    const [newStaff] = await db.query('SELECT * FROM staff WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: newStaff[0]
    });
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create staff member'
    });
  }
};

// Update staff member
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status } = req.body;
    
    // Check if staff member exists
    const [existingStaff] = await db.query(
      'SELECT id FROM staff WHERE id = ?',
      [id]
    );
    
    if (existingStaff.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    // Check if email already exists for other staff
    if (email) {
      const [emailCheck] = await db.query(
        'SELECT id FROM staff WHERE email = ? AND id != ?',
        [email, id]
      );
      
      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }
    
    // Update staff member
    const updateFields = [];
    const updateValues = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    
    if (updateFields.length > 0) {
      updateValues.push(id);
      await db.query(
        `UPDATE staff SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }
    
    // Get the updated staff member
    const [updatedStaff] = await db.query('SELECT * FROM staff WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: updatedStaff[0]
    });
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update staff member'
    });
  }
};

// Delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if staff member exists
    const [existingStaff] = await db.query(
      'SELECT id FROM staff WHERE id = ?',
      [id]
    );
    
    if (existingStaff.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    // Delete table assignments first
    await db.query('DELETE FROM staff_table_assignments WHERE staff_id = ?', [id]);
    
    // Delete staff member
    await db.query('DELETE FROM staff WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete staff member'
    });
  }
};



// Get available tables for assignment
exports.getAvailableTables = async (req, res) => {
  try {
    const [tables] = await db.query(
      'SELECT id, table_number, capacity, location FROM tables WHERE status = "available" ORDER BY table_number'
    );
    
    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    console.error('Error fetching available tables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available tables'
    });
  }
};

// Get staff statistics
exports.getStaffStats = async (req, res) => {
  try {
    const [totalStaff] = await db.query('SELECT COUNT(*) as total FROM staff');
    const [activeStaff] = await db.query('SELECT COUNT(*) as active FROM staff WHERE status = "active"');
    const [staffByRole] = await db.query(
      'SELECT role, COUNT(*) as count FROM staff GROUP BY role'
    );
    
    res.json({
      success: true,
      data: {
        total: totalStaff[0].total,
        active: activeStaff[0].active,
        byRole: staffByRole
      }
    });
  } catch (error) {
    console.error('Error fetching staff stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff statistics'
    });
  }
};
