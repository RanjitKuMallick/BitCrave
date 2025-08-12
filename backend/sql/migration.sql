-- Migration script to update reservations table
USE bitcrave;

-- Add new columns to reservations table
ALTER TABLE reservations 
ADD COLUMN table_number INT NULL,
ADD COLUMN status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
ADD COLUMN payment_status ENUM('Pending', 'Paid') DEFAULT 'Pending',
ADD COLUMN order_items JSON NULL;

-- Update existing reservations to have 'Pending' status if status is NULL
UPDATE reservations SET status = 'Pending' WHERE status IS NULL;

-- Create index for better performance (only after columns exist)
CREATE INDEX idx_reservations_date_time ON reservations(date, time);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_table ON reservations(table_number);

-- Insert sample admin if not exists
INSERT IGNORE INTO admins (username, password) VALUES ('admin', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ');

-- Insert sample menu items if not exists
INSERT IGNORE INTO menu (name, description, price, category, type) VALUES 
('Butter Chicken', 'Creamy and rich chicken curry', 350.00, 'Main Course', 'Non-Veg'),
('Paneer Tikka', 'Grilled cottage cheese with spices', 280.00, 'Appetizer', 'Veg'),
('Biryani', 'Fragrant rice with tender meat', 450.00, 'Main Course', 'Non-Veg'),
('Dal Makhani', 'Creamy black lentils', 200.00, 'Main Course', 'Veg'),
('Naan', 'Soft bread from tandoor', 30.00, 'Bread', 'Veg'),
('Raita', 'Cooling yogurt side dish', 80.00, 'Side Dish', 'Veg');

-- Insert sample events if not exists
INSERT IGNORE INTO events (title, description, date, time, location) VALUES 
('Live Music Night', 'Enjoy live classical music with dinner', '2024-02-15', '19:00:00', 'Main Dining Hall'),
('Wine Tasting', 'Premium wine tasting event', '2024-02-20', '18:00:00', 'Private Dining Room'),
('Chef Special', 'Special menu curated by our head chef', '2024-02-25', '20:00:00', 'All Areas');

COMMIT;
