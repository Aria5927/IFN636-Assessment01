const HealthRecord = require('../models/HealthRecord');
const RecordFilter = require('../strategies/filterStrategy');

// GET /api/records - Role based access
const getRecords = async (req, res) => {
    try {
        const recordFilter = new RecordFilter();
        let filter = recordFilter.buildFilter(req.query);

        if (req.user.role === 'Patient') {
            filter.userId = req.user._id;
        }

        const records = await HealthRecord.find(filter).populate('userId', 'name email');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createRecord = async (req, res) => {
    try {
        const record = await HealthRecord.create({
            userId: req.user._id,
            ...req.body
        });
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRecord = async (req, res) => {
    try {
        const record = await HealthRecord.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRecord = async (req, res) => {
    try {
        const record = await HealthRecord.findOneAndDelete({ _id: req.params.id });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
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

module.exports = { getRecords, createRecord, updateRecord, deleteRecord, getStats };