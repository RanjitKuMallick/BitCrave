const db = require('./models/db');

async function addSampleMenu() {
  try {
    console.log('Adding sample menu items...');
    
    const sampleMenu = [
      // Starters
      { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 250, category: 'Starter', type: 'Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Chicken 65', description: 'Spicy fried chicken with curry leaves', price: 300, category: 'Starter', type: 'Non-Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Veg Spring Roll', description: 'Crispy vegetable spring rolls', price: 180, category: 'Starter', type: 'Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      
      // Main Course
      { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 450, category: 'Main Course', type: 'Non-Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato gravy', price: 380, category: 'Main Course', type: 'Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Biryani', description: 'Aromatic rice with spices and meat', price: 550, category: 'Main Course', type: 'Non-Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Dal Makhani', description: 'Creamy black lentils', price: 280, category: 'Main Course', type: 'Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      
      // Desserts
      { name: 'Gulab Jamun', description: 'Sweet milk dumplings in sugar syrup', price: 120, category: 'Dessert', type: 'Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Rasmalai', description: 'Soft cottage cheese patties in milk', price: 150, category: 'Dessert', type: 'Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      
      // Drinks
      { name: 'Mango Lassi', description: 'Sweet yogurt-based mango drink', price: 80, category: 'Drinks', type: 'Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Masala Chai', description: 'Spiced Indian tea', price: 60, category: 'Drinks', type: 'Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
      { name: 'Fresh Lime Soda', description: 'Refreshing lime and soda drink', price: 70, category: 'Drinks', type: 'Veg', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' }
    ];
    
    for (const item of sampleMenu) {
      try {
        await db.query(
          'INSERT INTO menu (name, description, price, category, type, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [item.name, item.description, item.price, item.category, item.type, item.image_url, true]
        );
        console.log(`✅ Added menu item: ${item.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️ Menu item ${item.name} already exists`);
        } else {
          console.error(`❌ Error adding menu item ${item.name}:`, error.message);
        }
      }
    }
    
    console.log('✅ Sample menu setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up sample menu:', error);
    process.exit(1);
  }
}

addSampleMenu();
