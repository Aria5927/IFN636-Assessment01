const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');
const RecordFilter = require('../strategies/filterStrategy');

// GET /api/records - Role based access
const getRecords = async (req, res) => {
    try {
        const recordFilter = new RecordFilter();
        let filter = recordFilter.buildFilter(req.query);

        if (req.user.role === 'Patient') {
            filter.patientId = req.user._id;
        }

        const records = await HealthRecord.find(filter)
            .populate('patientId', 'name email')
            .populate('doctorId', 'name email');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/records/patients - Get all patients for dropdown
const getPatients = async (req, res) => {
    try {
        const patients = await User.find({ role: 'Patient' }).select('name email');
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRecord = async (req, res) => {
    try {
        const record = await HealthRecord.create({
            patientId: req.body.patientId,
            doctorId: req.user._id,
            ...req.body
        });
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRecord = async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (req.user.role !== 'Admin') filter.doctorId = req.user._id;

        const record = await HealthRecord.findOneAndUpdate(filter, req.body, { new: true });
        if (!record) return res.status(404).json({ message: 'Record not found or unauthorized' });
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRecord = async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (req.user.role !== 'Admin') filter.doctorId = req.user._id;

        const record = await HealthRecord.findOneAndDelete(filter);
        if (!record) return res.status(404).json({ message: 'Record not found or unauthorized' });
        res.json({ message: 'Record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const totalRecords = await HealthRecord.countDocuments();

        const bloodTypeDistribution = await HealthRecord.aggregate([
            { $group: { _id: '$bloodType', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const genderDistribution = await HealthRecord.aggregate([
            { $group: { _id: '$gender', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalRecords,
            bloodTypeDistribution,
            genderDistribution
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRecords, getPatients, createRecord, updateRecord, deleteRecord, getStats };