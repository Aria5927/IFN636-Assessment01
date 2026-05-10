const express = require('express');
const router = express.Router();
const { getPatientProfile, updatePatientProfile, deactivateAccount } = require('../controllers/patientController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/profile', protect, authorizeRoles('Patient'), getPatientProfile);
router.put('/profile', protect, authorizeRoles('Patient'), updatePatientProfile);
router.put('/deactivate', protect, authorizeRoles('Patient'), deactivateAccount);

module.exports = router;