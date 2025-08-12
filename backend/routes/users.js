const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { registerUser, loginUser, logoutUser, firebaseLogin } = require('../controllers/userController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/firebase-login', firebaseLogin);
router.post('/logout', logoutUser);

module.exports = router;
