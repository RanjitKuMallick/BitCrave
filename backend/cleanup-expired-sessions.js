const db = require('./models/db');

async function cleanupExpiredSessions() {
  try {
    console.log('🧹 Cleaning up expired admin sessions...');
    
    // Delete expired sessions
    const [result] = await db.query(
      'DELETE FROM admin_sessions WHERE expires_at < NOW() OR is_active = FALSE'
    );
    
    console.log(`✅ Cleaned up ${result.affectedRows} expired sessions`);
    
    // Also clean up old blacklisted tokens (older than 7 days)
    const [tokenResult] = await db.query(
      'DELETE FROM blacklisted_tokens WHERE blacklisted_at < DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    
    console.log(`✅ Cleaned up ${tokenResult.affectedRows} old blacklisted tokens`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanupExpiredSessions();
