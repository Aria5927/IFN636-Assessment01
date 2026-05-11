const express = require('express');
const router = express.Router();
const { createDoctor, updateDoctorStatus, getAllUsers, deletePatient } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/doctors', protect('Admin'), createDoctor);
router.put('/doctors/:id/status', protect('Admin'), updateDoctorStatus);
router.get('/users', protect('Admin'), getAllUsers);
router.delete('/patients/:id', protect('Admin'), deletePatient);

module.exports = router;