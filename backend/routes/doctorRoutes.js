const express = require('express');
const router = express.Router();
const { getDoctorProfile, updateDoctorProfile } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect('Doctor'), getDoctorProfile);
router.put('/profile', protect('Doctor'), updateDoctorProfile);

module.exports = router;