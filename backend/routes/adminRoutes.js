const express = require('express');
const router = express.Router();
const { createDoctor, updateDoctorStatus, getAllUsers, deletePatient } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/doctors', protect, authorizeRoles('Admin'), createDoctor);
router.put('/doctors/:id/status', protect, authorizeRoles('Admin'), updateDoctorStatus);
router.get('/users', protect, authorizeRoles('Admin'), getAllUsers);
router.delete('/patients/:id', protect, authorizeRoles('Admin'), deletePatient);

module.exports = router;