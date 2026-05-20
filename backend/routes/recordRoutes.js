const express = require('express');
const router = express.Router();
const { getRecords, getPatients, createRecord, updateRecord, deleteRecord, getStats } = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect('Doctor', 'Admin'), getStats);
router.get('/patients', protect('Doctor', 'Admin'), getPatients);
router.get('/', protect('Doctor', 'Patient', 'Admin'), getRecords);
router.post('/', protect('Doctor'), createRecord);
router.put('/:id', protect('Doctor', 'Admin'), updateRecord);
router.delete('/:id', protect('Admin', 'Doctor'), deleteRecord);

module.exports = router;