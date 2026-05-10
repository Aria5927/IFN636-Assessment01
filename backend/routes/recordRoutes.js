const express = require('express');
const router = express.Router();
const { getRecords, createRecord, updateRecord, deleteRecord, getStats } = require('../controllers/recordController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('Doctor', 'Patient', 'Admin'), getRecords);

router.post('/', protect, authorizeRoles('Doctor'), createRecord);

router.put('/:id', protect, authorizeRoles('Doctor'), updateRecord);

router.delete('/:id', protect, authorizeRoles('Admin'), deleteRecord);

router.get('/stats', protect, authorizeRoles('Doctor', 'Admin'), getStats);

module.exports = router;