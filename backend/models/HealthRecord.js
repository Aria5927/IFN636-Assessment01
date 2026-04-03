const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    conditionDetail: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    medication: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);