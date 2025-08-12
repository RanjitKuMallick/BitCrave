const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { registerUser , loginUser, logoutUser} = require('../controllers/userController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public route for new registration
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);


module.exports = router;
