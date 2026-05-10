const express = require('express');
const router = express.Router();
const { getDoctorProfile, updateDoctorProfile } = require('../controllers/doctorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/profile', protect, authorizeRoles('Doctor'), getDoctorProfile);
router.put('/profile', protect, authorizeRoles('Doctor'), updateDoctorProfile);

module.exports = router;