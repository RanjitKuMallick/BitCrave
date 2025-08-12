const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testEmailJSIntegration() {
  try {
    console.log('🧪 Testing EmailJS Integration...\n');

    // Test 1: Check if admin can access reservations
    console.log('1. Testing admin access to reservations...');
    try {
      const response = await fetch(`${API_BASE}/reservations`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Admin can access reservations (${data.data.length} found)`);
        
        if (data.data.length > 0) {
          const sampleReservation = data.data[0];
          console.log(`   Sample reservation: ${sampleReservation.name} (${sampleReservation.email})`);
          console.log(`   Table: ${sampleReservation.table_number || 'Not assigned'}`);
          console.log(`   Status: ${sampleReservation.status}`);
        }
      } else {
        console.log(`❌ Admin access failed: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Admin access error:', error.message);
    }

    console.log('\n📋 EmailJS Setup Instructions:');
    console.log('1. Go to https://www.emailjs.com/ and create an account');
    console.log('2. Add your email service (Gmail, Outlook, etc.)');
    console.log('3. Create an email template with the following variables:');
    console.log('   - {{to_name}} - Customer name');
    console.log('   - {{reservation_id}} - Reservation ID');
    console.log('   - {{table_number}} - Assigned table number');
    console.log('   - {{reservation_date}} - Reservation date');
    console.log('   - {{reservation_time}} - Reservation time');
    console.log('   - {{number_of_guests}} - Number of guests');
    console.log('   - {{restaurant_name}} - Restaurant name');
    console.log('   - {{restaurant_address}} - Restaurant address');
    console.log('   - {{restaurant_phone}} - Restaurant phone');
    console.log('4. Update the admin/reservation.html file with your:');
    console.log('   - Service ID (replace "service_your_service_id")');
    console.log('   - Template ID (replace "template_your_template_id")');
    console.log('5. Test the confirmation by confirming a reservation in admin panel');

    console.log('\n📧 Sample Email Template:');
    console.log(`
Subject: Reservation Confirmed - BitCrave Restaurant

Dear {{to_name}},

Your reservation has been confirmed! Here are the details:

🆔 Reservation ID: {{reservation_id}}
🍽️ Table Number: {{table_number}}
📅 Date: {{reservation_date}}
⏰ Time: {{reservation_time}}
👥 Number of Guests: {{number_of_guests}}

📍 Restaurant Details:
{{restaurant_name}}
{{restaurant_address}}
📞 {{restaurant_phone}}

We look forward to serving you!

Best regards,
The BitCrave Team
    `);

  } catch (error) {
    console.error('❌ Error testing EmailJS integration:', error);
  }
}

testEmailJSIntegration();
