const express = require('express');
const router = express.Router();
const { getRecords, createRecord, updateRecord, deleteRecord, getStats } = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect('Doctor', 'Admin'), getStats);
router.get('/', protect('Doctor', 'Patient', 'Admin'), getRecords);
router.post('/', protect('Doctor'), createRecord);
router.put('/:id', protect('Doctor'), updateRecord);
router.delete('/:id', protect('Admin'), deleteRecord);

module.exports = router;