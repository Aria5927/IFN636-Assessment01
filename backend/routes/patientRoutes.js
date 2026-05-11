const express = require('express');
const router = express.Router();
const { getPatientProfile, updatePatientProfile, deactivateAccount } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect('Patient'), getPatientProfile);
router.put('/profile', protect('Patient'), updatePatientProfile);
router.put('/deactivate', protect('Patient'), deactivateAccount);

module.exports = router;