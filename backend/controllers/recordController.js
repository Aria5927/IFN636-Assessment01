const HealthRecord = require('../models/HealthRecord');

const getRecords = async (req, res) => {
    try {
        const records = await HealthRecord.find({ userId: req.user._id });
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
            { _id: req.params.id, userId: req.user._id },
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
        const record = await HealthRecord.findOneAndDelete(
            { _id: req.params.id, userId: req.user._id }
        );
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json({ message: 'Record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRecords, createRecord, updateRecord, deleteRecord };