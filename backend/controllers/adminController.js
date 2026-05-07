const User = require('../models/User');
const bcrypt = require('bcrypt');

const createDoctor = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const doctor = await User.create({
            name,
            email,
            password,
            role: 'Doctor',
            status: 'Active'
        });

        res.status(201).json({
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            role: doctor.role,
            status: doctor.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDoctorStatus = async (req, res) => {
    try {
        const doctor = await User.findOne({ _id: req.params.id, role: 'Doctor' });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        doctor.status = req.body.status;
        await doctor.save();

        res.json({
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            role: doctor.role,
            status: doctor.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ 
            role: { $in: ['Doctor', 'Patient'] } 
        }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePatient = async (req, res) => {
    try {
        const patient = await User.findOne({ _id: req.params.id, role: 'Patient' });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        await patient.deleteOne();
        res.json({ message: 'Patient account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createDoctor, updateDoctorStatus, getAllUsers, deletePatient };